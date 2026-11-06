// KI-Protokoll for the module "Planung und Vorbereitung wissenschaftlicher Projekte"
//
// Records every session with the assistant: each request of the group, each
// answer of the assistant and each working step (which file was read or
// changed, which search was run). The content of files that were read is not
// recorded, only their names.
//
// Output in the folder KI-Protokoll/:
//   rohdaten/<session>.jsonl           one event per line, append only
//   <date>_<time>_<shortid>.md         readable version per session
//   UEBERSICHT.md                      all sessions with a checksum of the raw data
//
// The readable files are rebuilt from the raw data whenever the assistant has
// finished an answer. Students hand in the whole folder and must not edit it:
// the checksum in the overview reveals any change to the raw data.
//
// One file serves both OpenCode generations (see the OpenCode guide
// "Migrate plugins from V1", section "Support V1 and V2 from one package"):
//   OpenCode 1.x calls server() and gets the V1 hooks,
//   OpenCode 2.x calls setup() and subscribes to the V2 event stream.
// Both feed the same recorder, so the files look the same in either version.
//
// The JSONL field names (zeit, art, text, ...) and the German Markdown output
// are part of the submitted record and must stay unchanged.

import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { createHash } from "node:crypto"
import { basename, join, relative, resolve } from "node:path"

const FOLDER = "KI-Protokoll"
const TIME_ZONE = "Europe/Berlin"

const dateTime = (ms) =>
  new Date(ms).toLocaleString("de-DE", { timeZone: TIME_ZONE, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
const clockTime = (ms) =>
  new Date(ms).toLocaleTimeString("de-DE", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit" })
const fileStamp = (ms) => {
  const t = new Date(ms).toLocaleString("sv-SE", { timeZone: TIME_ZONE }) // 2026-10-06 14:15:03
  return t.slice(0, 16).replace(" ", "_").replace(":", "-")
}

// The recorder knows nothing about OpenCode versions: both adapters below
// translate their events into these calls.
const createRecorder = (directory) => {
  const base = join(directory, FOLDER)
  const rawDir = join(base, "rohdaten")
  const sessions = new Map() // id -> { titel, beginn, eltern, modell, version }

  const logError = (e) => {
    try {
      mkdirSync(base, { recursive: true })
      appendFileSync(join(base, "fehler.log"), `${new Date().toISOString()} ${e?.stack || e}\n`)
    } catch {}
  }

  // The record must never interrupt the work.
  const guard = (f) => async (...a) => {
    try {
      await f(...a)
    } catch (e) {
      logError(e)
    }
  }

  const rawFile = (id) => join(rawDir, `${id}.jsonl`)

  const append = (id, entry) => {
    mkdirSync(rawDir, { recursive: true })
    appendFileSync(rawFile(id), JSON.stringify({ zeit: Date.now(), ...entry }) + "\n")
  }

  const projectPath = (p) => {
    if (typeof p !== "string") return p
    const r = relative(directory, p)
    return r && !r.startsWith("..") ? r.replaceAll("\\", "/") : p
  }

  // What a working step did, in one line and without file contents.
  // Tool names and arguments differ between 1.x (bash, task, filePath) and 2.x (shell, subagent, path).
  const describeStep = (tool, input = {}) => {
    const file = projectPath(input.filePath || input.path)
    switch (tool) {
      case "read": return `gelesen: ${file}`
      case "write": return `geschrieben: ${file}`
      case "edit": case "multiedit": return `geändert: ${file}`
      case "patch": case "apply_patch": {
        // The patch names its files in the text: "*** Update File: expose/literatur.bib"
        const text = String(input.patchText ?? input.patch ?? "")
        const files = [...text.matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm)].map((m) => projectPath(m[1].trim()))
        return `geändert: ${files.length ? files.join(", ") : file ?? "(Datei nicht erkennbar)"}`
      }
      case "glob": return `Dateien gesucht: ${input.pattern}`
      case "grep": return `in Dateien gesucht: „${input.pattern}“`
      case "list": return `Ordner angesehen: ${file ?? "."}`
      case "bash": case "shell": return `Befehl ausgeführt: ${input.command}`
      case "webfetch": return `Webseite gelesen: ${input.url}`
      case "websearch": return `im Web gesucht: „${input.query}“`
      case "task": return `Teilauftrag an ${input.subagent_type ?? "Unteragent"}: ${input.description ?? ""}`
      case "subagent": return `Teilauftrag an ${input.agent ?? "Unteragent"}: ${input.description ?? ""}`
      case "word_lesen": return `Word-Datei gelesen: ${input.datei || "expose/word/expose.docx"}${input.abschnitt ? ` (Abschnitt „${input.abschnitt}“)` : input.gliederung ? " (Gliederung)" : ""}`
      case "word_literaturverzeichnis": return "Literaturverzeichnis erzeugt: expose/word/literaturverzeichnis.docx"
      case "word_erzeugen": return `Word-Datei erzeugt aus: ${input.datei}`
      case "todowrite": case "todoread": return null
      default: return `${tool}${file ? `: ${file}` : ""}`
    }
  }

  const session = (id) => {
    if (!sessions.has(id)) {
      // After a restart of OpenCode, recover the details from the raw data.
      const s = { titel: null, beginn: null, eltern: null, modell: null, version: null }
      if (existsSync(rawFile(id))) {
        for (const line of readFileSync(rawFile(id), "utf8").split("\n").filter(Boolean)) {
          const e = JSON.parse(line)
          if (e.art === "beginn") Object.assign(s, { beginn: e.zeit, eltern: e.eltern ?? null, version: e.version ?? null })
          if (e.art === "titel") s.titel = e.titel
          if (e.modell) s.modell = e.modell
        }
      }
      sessions.set(id, s)
    }
    return sessions.get(id)
  }

  const writeReadable = (id) => {
    if (!existsSync(rawFile(id))) return
    const entries = readFileSync(rawFile(id), "utf8").split("\n").filter(Boolean).map((z) => JSON.parse(z))
    const s = session(id)
    const start = s.beginn ?? entries[0]?.zeit ?? Date.now()
    const title = s.titel ?? "ohne Titel"

    const lines = [
      `# KI-Protokoll: ${title}`,
      "",
      "Automatisch erzeugt beim Arbeiten mit dem Assistenten. Nicht von Hand ändern.",
      "",
      "| | |",
      "|---|---|",
      `| Beginn | ${dateTime(start)} |`,
      `| Werkzeug | OpenCode${s.version ? ` ${s.version}` : ""} |`,
      `| Modell | ${s.modell ?? "unbekannt"} |`,
      `| Sitzung | \`${id}\` |`,
    ]
    if (s.eltern) lines.push(`| Teilauftrag aus Sitzung | \`${s.eltern}\` |`)
    lines.push("")

    let steps = []
    const flushSteps = () => {
      if (steps.length) {
        lines.push("**Arbeitsschritte des Assistenten:**", "", ...steps.map((x) => `- ${x}`), "")
        steps = []
      }
    }
    for (const e of entries) {
      if (e.art === "auftrag") {
        flushSteps()
        lines.push(`## ${clockTime(e.zeit)} Auftrag der Gruppe`, "", ...e.text.split("\n").map((z) => `> ${z}`), "")
        if (e.anhaenge?.length) lines.push(`Angehängt: ${e.anhaenge.join(", ")}`, "")
      } else if (e.art === "schritt") {
        steps.push(e.fehler ? `${e.text} (fehlgeschlagen)` : e.text)
      } else if (e.art === "antwort") {
        flushSteps()
        lines.push(`## ${clockTime(e.zeit)} Antwort des Assistenten`, "", e.text, "")
      } else if (e.art === "fehler") {
        flushSteps()
        lines.push(`## ${clockTime(e.zeit)} Fehler`, "", e.text, "")
      }
    }
    flushSteps()

    writeFileSync(join(base, `${fileStamp(start)}_${id.slice(-8)}.md`), lines.join("\n"), "utf8")
  }

  const writeOverview = () => {
    if (!existsSync(rawDir)) return
    const rows = []
    for (const f of readdirSync(rawDir).filter((f) => f.endsWith(".jsonl"))) {
      const id = basename(f, ".jsonl")
      const raw = readFileSync(join(rawDir, f), "utf8")
      const entries = raw.split("\n").filter(Boolean).map((z) => JSON.parse(z))
      const s = session(id)
      const start = s.beginn ?? entries[0]?.zeit ?? 0
      const changed = new Set(
        entries.filter((e) => e.art === "schritt" && /^(geändert|geschrieben): /.test(e.text)).map((e) => e.text.replace(/^[^:]+: /, "")),
      )
      rows.push({
        start,
        line: `| ${dateTime(start)} | [${(s.titel ?? "ohne Titel").replaceAll("|", "/")}](${fileStamp(start)}_${id.slice(-8)}.md)${s.eltern ? " (Teilauftrag)" : ""} | ${entries.filter((e) => e.art === "auftrag").length} | ${[...changed].join(", ") || "–"} | \`${createHash("sha256").update(raw).digest("hex").slice(0, 16)}\` |`,
      })
    }
    rows.sort((a, b) => a.start - b.start)
    const text = [
      "# KI-Protokoll: Übersicht",
      "",
      "Automatisch erzeugt. Jede Zeile ist eine Sitzung mit dem Assistenten; der Link führt zum Protokoll dieser Sitzung.",
      "Die Prüfsumme gehört zu den Rohdaten in `rohdaten/` und ändert sich, wenn dort etwas verändert wird.",
      "",
      "| Beginn | Sitzung | Aufträge | geänderte Dateien | Prüfsumme |",
      "|---|---|---|---|---|",
      ...rows.map((r) => r.line),
      "",
      `Stand: ${dateTime(Date.now())}`,
      "",
    ].join("\n")
    writeFileSync(join(base, "UEBERSICHT.md"), text, "utf8")
  }

  return {
    guard,
    logError,
    projectPath,
    known: (id) => sessions.has(id) || existsSync(rawFile(id)),
    setModel: (id, model) => {
      if (id && model) session(id).modell = model
    },
    begin: (id, { start, parent, version }) => {
      const s = session(id)
      if (s.beginn) return
      Object.assign(s, { beginn: start ?? Date.now(), eltern: parent ?? null, version: version ?? null })
      append(id, { art: "beginn", eltern: s.eltern, version: s.version })
    },
    title: (id, title) => {
      const s = session(id)
      if (!title || title.startsWith("New session") || title === s.titel) return false
      s.titel = title
      append(id, { art: "titel", titel: title })
      return true
    },
    request: (id, { text, attachments = [], agent = null, model = null }) => {
      if (!text && !attachments.length) return
      if (model) session(id).modell = model
      append(id, { art: "auftrag", text, anhaenge: attachments, agent, modell: model })
    },
    answer: (id, text) => {
      if (text?.trim()) append(id, { art: "antwort", text: text.trim() })
    },
    step: (id, tool, input, failed) => {
      const text = describeStep(tool, input ?? {})
      if (text) append(id, { art: "schritt", text, fehler: Boolean(failed) })
    },
    error: (id, text) => append(id, { art: "fehler", text: text || "unbekannter Fehler" }),
    refresh: (id) => {
      writeReadable(id)
      writeOverview()
    },
  }
}

// OpenCode 1.x: hooks returned by server(), events arrive through the event hook.
const serverV1 = async ({ directory }) => {
  const rec = createRecorder(directory)
  const seen = new Set() // part IDs already recorded
  const roles = new Map() // message ID -> "user" | "assistant"

  return {
    // The group's request, verbatim.
    "chat.message": rec.guard(async (input, output) => {
      const parts = output?.parts ?? []
      rec.request(input.sessionID, {
        text: parts.filter((p) => p.type === "text" && !p.synthetic).map((p) => p.text).join("\n").trim(),
        attachments: parts.filter((p) => p.type === "file").map((p) => rec.projectPath(p.filename ?? p.url ?? "Datei")),
        agent: input.agent ?? output?.message?.agent ?? null,
        model: input.model ? `${input.model.providerID}/${input.model.modelID}` : null,
      })
    }),

    event: rec.guard(async ({ event }) => {
      const p = event?.properties ?? {}
      switch (event?.type) {
        case "session.created": {
          const info = p.info ?? {}
          rec.begin(info.id, { start: info.time?.created, parent: info.parentID, version: info.version })
          return
        }
        case "session.updated": {
          const info = p.info ?? {}
          if (rec.title(info.id, info.title)) rec.refresh(info.id)
          return
        }
        case "message.updated": {
          const info = p.info ?? {}
          roles.set(info.id, info.role)
          if (info.role === "assistant" && info.modelID) rec.setModel(info.sessionID, `${info.providerID}/${info.modelID}`)
          return
        }
        case "message.part.updated": {
          const t = p.part ?? {}
          if (seen.has(t.id)) return
          if (t.type === "text" && t.time?.end && !t.synthetic && roles.get(t.messageID) !== "user") {
            if (!t.text?.trim()) return
            seen.add(t.id)
            rec.answer(t.sessionID, t.text)
          } else if (t.type === "tool" && (t.state?.status === "completed" || t.state?.status === "error")) {
            seen.add(t.id)
            rec.step(t.sessionID, t.tool, t.state.input, t.state.status === "error")
          }
          return
        }
        case "session.error": {
          if (p.sessionID) rec.error(p.sessionID, p.error?.data?.message ?? p.error?.name)
          return
        }
        case "session.idle": {
          if (p.sessionID) rec.refresh(p.sessionID)
          return
        }
      }
    }),
  }
}

// OpenCode 2.x: setup(ctx) subscribes to the public event stream.
// Event names and payloads: packages/schema/src/session-event.ts in anomalyco/opencode.
const V2_EVENTS = [
  "session.created",
  "session.renamed",
  "session.model.selected",
  "session.step.started",
  "session.inbox.enqueued",
  "session.text.ended",
  "session.tool.input.started",
  "session.tool.called",
  "session.tool.success",
  "session.tool.failed",
  "session.execution.failed",
  "session.execution.succeeded",
  "session.execution.interrupted",
  "session.idle",
]

const modelName = (m) => (m?.providerID && m?.id ? `${m.providerID}/${m.id}` : null)

const setupV2 = async (ctx) => {
  const directory = ctx.location.directory
  const rec = createRecorder(directory)
  const controller = new AbortController()
  const own = new Map() // session ID -> true if it belongs to this project
  const tools = new Map() // tool call ID -> { name, input }
  const answered = new Set() // assistant message ID + ordinal already recorded

  // One OpenCode server can serve several projects; record only this one.
  const norm = (p) => (process.platform === "win32" ? resolve(p).toLowerCase() : resolve(p))
  const ours = (event) => {
    const id = event.data?.sessionID
    if (!id) return false
    const dir = event.location?.directory ?? event.data.location?.directory
    if (dir) own.set(id, norm(dir) === norm(directory))
    return own.get(id) ?? rec.known(id)
  }

  const handle = rec.guard(async (event) => {
    if (!ours(event)) return
    const d = event.data
    const id = d.sessionID
    // 2.x may load the plugin after the session was created; then the first event opens it.
    if (["session.inbox.enqueued", "session.text.ended", "session.tool.called", "session.renamed"].includes(event.type))
      rec.begin(id, { start: event.created, version: ctx.app?.version })
    switch (event.type) {
      case "session.created":
        rec.begin(id, { start: event.created, parent: d.parentID, version: d.version })
        rec.setModel(id, modelName(d.model))
        if (rec.title(id, d.title)) rec.refresh(id)
        return
      case "session.renamed":
        if (rec.title(id, d.title)) rec.refresh(id)
        return
      case "session.model.selected":
      case "session.step.started":
        rec.setModel(id, modelName(d.model))
        return
      case "session.inbox.enqueued": {
        // Only the group's own input; synthetic, compaction and move items are not requests.
        if (d.item?.type !== "user") return
        const payload = d.item.payload ?? {}
        rec.request(id, {
          text: String(payload.text ?? "").trim(),
          attachments: (payload.files ?? []).map((f) => rec.projectPath(f.name ?? f.uri ?? "Datei")),
        })
        return
      }
      case "session.text.ended": {
        const key = `${d.assistantMessageID}:${d.ordinal}`
        if (answered.has(key)) return
        answered.add(key)
        rec.answer(id, d.text)
        return
      }
      case "session.tool.input.started":
        tools.set(d.id, { ...tools.get(d.id), name: d.name })
        return
      case "session.tool.called":
        tools.set(d.id, { ...tools.get(d.id), name: d.name ?? tools.get(d.id)?.name, input: d.input })
        return
      case "session.tool.success":
      case "session.tool.failed": {
        const call = tools.get(d.id)
        if (!call) return
        tools.delete(d.id)
        rec.step(id, call.name ?? "Werkzeug", call.input, event.type === "session.tool.failed")
        return
      }
      case "session.execution.failed":
        rec.error(id, d.error?.message)
        rec.refresh(id)
        return
      case "session.execution.succeeded":
      case "session.execution.interrupted":
      case "session.idle":
        rec.refresh(id)
        return
    }
  })

  // The stream can end when the server reconnects; subscribe again until the plugin unloads.
  void (async () => {
    while (!controller.signal.aborted) {
      try {
        for await (const event of ctx.event.subscribe({ types: V2_EVENTS, signal: controller.signal })) await handle(event)
      } catch (e) {
        if (controller.signal.aborted) break
        rec.logError(e)
      }
      if (!controller.signal.aborted) await new Promise((r) => setTimeout(r, 1000))
    }
  })()

  return () => controller.abort()
}

export default { id: "ki-protokoll", setup: setupV2, server: serverV1 }
