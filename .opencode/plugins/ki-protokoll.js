// KI-Protokoll für das Modul "Planung und Vorbereitung wissenschaftlicher Projekte"
//
// Schreibt jede Sitzung mit dem Assistenten automatisch mit: jeden Auftrag
// der Gruppe, jede Antwort des Assistenten und jeden Arbeitsschritt (welche
// Datei gelesen oder geändert, welche Suche ausgeführt wurde). Der Inhalt
// gelesener Dateien wird nicht mitgeschrieben, nur ihr Name.
//
// Ablage im Ordner KI-Protokoll/:
//   rohdaten/<sitzung>.jsonl   jede Zeile ein Ereignis, wird nur ergänzt
//   <datum>_<uhrzeit>_<kurzname>.md   lesbare Fassung je Sitzung
//   UEBERSICHT.md              alle Sitzungen mit Prüfsumme der Rohdaten
//
// Die lesbaren Dateien werden aus den Rohdaten neu erzeugt, sobald der
// Assistent eine Antwort beendet hat. Abgegeben wird der ganze Ordner.
// Bitte nichts darin von Hand ändern: Die Prüfsumme in der Übersicht zeigt
// jede Änderung an den Rohdaten.

import { appendFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs"
import { createHash } from "node:crypto"
import { basename, join, relative } from "node:path"

const ORDNER = "KI-Protokoll"
const ZEITZONE = "Europe/Berlin"

const zeit = (ms) =>
  new Date(ms).toLocaleString("de-DE", { timeZone: ZEITZONE, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
const uhrzeit = (ms) =>
  new Date(ms).toLocaleTimeString("de-DE", { timeZone: ZEITZONE, hour: "2-digit", minute: "2-digit" })
const dateistempel = (ms) => {
  const t = new Date(ms).toLocaleString("sv-SE", { timeZone: ZEITZONE }) // 2026-10-06 14:15:03
  return t.slice(0, 16).replace(" ", "_").replace(":", "-")
}

export const KiProtokoll = async ({ directory }) => {
  const basis = join(directory, ORDNER)
  const rohdaten = join(basis, "rohdaten")
  const sitzungen = new Map() // id -> { titel, beginn, eltern, modell, version, kurzname }
  const gesehen = new Set() // Teil-IDs, die schon protokolliert sind
  const rollen = new Map() // Nachrichten-ID -> "user" | "assistant"

  const sicher = (f) => async (...a) => {
    try {
      await f(...a)
    } catch (e) {
      // Das Protokoll darf die Arbeit nie unterbrechen.
      try {
        mkdirSync(basis, { recursive: true })
        appendFileSync(join(basis, "fehler.log"), `${new Date().toISOString()} ${e?.stack || e}\n`)
      } catch {}
    }
  }

  const schreibe = (id, eintrag) => {
    mkdirSync(rohdaten, { recursive: true })
    appendFileSync(join(rohdaten, `${id}.jsonl`), JSON.stringify({ zeit: Date.now(), ...eintrag }) + "\n")
  }

  const pfad = (p) => {
    if (typeof p !== "string") return p
    const r = relative(directory, p)
    return r && !r.startsWith("..") ? r.replaceAll("\\", "/") : p
  }

  // Was ein Arbeitsschritt getan hat, in einer Zeile und ohne Dateiinhalte.
  const schritt = (tool, input = {}) => {
    const datei = pfad(input.filePath || input.path)
    switch (tool) {
      case "read": return `gelesen: ${datei}`
      case "write": return `geschrieben: ${datei}`
      case "edit": case "multiedit": return `geändert: ${datei}`
      case "patch": case "apply_patch": {
        // Der Patch nennt seine Dateien im Text: "*** Update File: expose/literatur.bib"
        const text = String(input.patchText ?? input.patch ?? "")
        const dateien = [...text.matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm)].map((m) => pfad(m[1].trim()))
        return `geändert: ${dateien.length ? dateien.join(", ") : datei ?? "(Datei nicht erkennbar)"}`
      }
      case "glob": return `Dateien gesucht: ${input.pattern}`
      case "grep": return `in Dateien gesucht: „${input.pattern}“`
      case "list": return `Ordner angesehen: ${datei ?? "."}`
      case "bash": return `Befehl ausgeführt: ${input.command}`
      case "webfetch": return `Webseite gelesen: ${input.url}`
      case "websearch": return `im Web gesucht: „${input.query}“`
      case "task": return `Teilauftrag an ${input.subagent_type ?? "Unteragent"}: ${input.description ?? ""}`
      case "word_lesen": return `Word-Datei gelesen: ${input.datei || "expose/word/expose.docx"}${input.abschnitt ? ` (Abschnitt „${input.abschnitt}“)` : input.gliederung ? " (Gliederung)" : ""}`
      case "word_literaturverzeichnis": return "Literaturverzeichnis erzeugt: expose/word/literaturverzeichnis.docx"
      case "word_erzeugen": return `Word-Datei erzeugt aus: ${input.datei}`
      case "todowrite": case "todoread": return null
      default: return `${tool}${datei ? `: ${datei}` : ""}`
    }
  }

  const sitzung = (id) => {
    if (!sitzungen.has(id)) {
      // Nach einem Neustart von OpenCode die Angaben aus den Rohdaten holen.
      const s = { titel: null, beginn: null, eltern: null, modell: null, version: null }
      const datei = join(rohdaten, `${id}.jsonl`)
      if (existsSync(datei)) {
        for (const z of readFileSync(datei, "utf8").split("\n").filter(Boolean)) {
          const e = JSON.parse(z)
          if (e.art === "beginn") Object.assign(s, { beginn: e.zeit, eltern: e.eltern ?? null, version: e.version ?? null })
          if (e.art === "titel") s.titel = e.titel
          if (e.modell) s.modell = e.modell
        }
      }
      sitzungen.set(id, s)
    }
    return sitzungen.get(id)
  }

  const lesbar = (id) => {
    const datei = join(rohdaten, `${id}.jsonl`)
    if (!existsSync(datei)) return
    const eintraege = readFileSync(datei, "utf8").split("\n").filter(Boolean).map((z) => JSON.parse(z))
    const s = sitzung(id)
    const beginn = s.beginn ?? eintraege[0]?.zeit ?? Date.now()
    const titel = s.titel ?? "ohne Titel"

    const zeilen = [
      `# KI-Protokoll: ${titel}`,
      "",
      "Automatisch erzeugt beim Arbeiten mit dem Assistenten. Nicht von Hand ändern.",
      "",
      "| | |",
      "|---|---|",
      `| Beginn | ${zeit(beginn)} |`,
      `| Werkzeug | OpenCode${s.version ? ` ${s.version}` : ""} |`,
      `| Modell | ${s.modell ?? "unbekannt"} |`,
      `| Sitzung | \`${id}\` |`,
    ]
    if (s.eltern) zeilen.push(`| Teilauftrag aus Sitzung | \`${s.eltern}\` |`)
    zeilen.push("")

    let schritte = []
    const schritteAbschliessen = () => {
      if (schritte.length) {
        zeilen.push("**Arbeitsschritte des Assistenten:**", "", ...schritte.map((x) => `- ${x}`), "")
        schritte = []
      }
    }
    for (const e of eintraege) {
      if (e.art === "auftrag") {
        schritteAbschliessen()
        zeilen.push(`## ${uhrzeit(e.zeit)} Auftrag der Gruppe`, "", ...e.text.split("\n").map((z) => `> ${z}`), "")
        if (e.anhaenge?.length) zeilen.push(`Angehängt: ${e.anhaenge.join(", ")}`, "")
      } else if (e.art === "schritt") {
        schritte.push(e.fehler ? `${e.text} (fehlgeschlagen)` : e.text)
      } else if (e.art === "antwort") {
        schritteAbschliessen()
        zeilen.push(`## ${uhrzeit(e.zeit)} Antwort des Assistenten`, "", e.text, "")
      } else if (e.art === "fehler") {
        schritteAbschliessen()
        zeilen.push(`## ${uhrzeit(e.zeit)} Fehler`, "", e.text, "")
      }
    }
    schritteAbschliessen()

    const name = `${dateistempel(beginn)}_${id.slice(-8)}.md`
    writeFileSync(join(basis, name), zeilen.join("\n"), "utf8")
  }

  const uebersicht = () => {
    if (!existsSync(rohdaten)) return
    const reihen = []
    for (const f of readdirSync(rohdaten).filter((f) => f.endsWith(".jsonl"))) {
      const id = basename(f, ".jsonl")
      const roh = readFileSync(join(rohdaten, f), "utf8")
      const eintraege = roh.split("\n").filter(Boolean).map((z) => JSON.parse(z))
      const s = sitzung(id)
      const beginn = s.beginn ?? eintraege[0]?.zeit ?? 0
      const geaendert = new Set(
        eintraege.filter((e) => e.art === "schritt" && /^(geändert|geschrieben): /.test(e.text)).map((e) => e.text.replace(/^[^:]+: /, "")),
      )
      reihen.push({
        beginn,
        zeile: `| ${zeit(beginn)} | [${(s.titel ?? "ohne Titel").replaceAll("|", "/")}](${dateistempel(beginn)}_${id.slice(-8)}.md)${s.eltern ? " (Teilauftrag)" : ""} | ${eintraege.filter((e) => e.art === "auftrag").length} | ${[...geaendert].join(", ") || "–"} | \`${createHash("sha256").update(roh).digest("hex").slice(0, 16)}\` |`,
      })
    }
    reihen.sort((a, b) => a.beginn - b.beginn)
    const text = [
      "# KI-Protokoll: Übersicht",
      "",
      "Automatisch erzeugt. Jede Zeile ist eine Sitzung mit dem Assistenten; der Link führt zum Protokoll dieser Sitzung.",
      "Die Prüfsumme gehört zu den Rohdaten in `rohdaten/` und ändert sich, wenn dort etwas verändert wird.",
      "",
      "| Beginn | Sitzung | Aufträge | geänderte Dateien | Prüfsumme |",
      "|---|---|---|---|---|",
      ...reihen.map((r) => r.zeile),
      "",
      `Stand: ${zeit(Date.now())}`,
      "",
    ].join("\n")
    writeFileSync(join(basis, "UEBERSICHT.md"), text, "utf8")
  }

  const aktualisieren = (id) => {
    lesbar(id)
    uebersicht()
  }

  return {
    // Der Auftrag der Gruppe, wörtlich.
    "chat.message": sicher(async (input, output) => {
      const id = input.sessionID
      const teile = output?.parts ?? []
      const text = teile.filter((p) => p.type === "text" && !p.synthetic).map((p) => p.text).join("\n").trim()
      const anhaenge = teile.filter((p) => p.type === "file").map((p) => pfad(p.filename ?? p.url ?? "Datei"))
      if (!text && !anhaenge.length) return
      const modell = input.model ? `${input.model.providerID}/${input.model.modelID}` : null
      if (modell) sitzung(id).modell = modell
      schreibe(id, { art: "auftrag", text, anhaenge, agent: input.agent ?? output?.message?.agent ?? null, modell })
    }),

    event: sicher(async ({ event }) => {
      const p = event?.properties ?? {}
      switch (event?.type) {
        case "session.created": {
          const info = p.info ?? {}
          const s = sitzung(info.id)
          if (s.beginn) return
          Object.assign(s, { beginn: info.time?.created ?? Date.now(), eltern: info.parentID ?? null, version: info.version ?? null })
          schreibe(info.id, { art: "beginn", eltern: s.eltern, version: s.version })
          return
        }
        case "session.updated": {
          const info = p.info ?? {}
          const s = sitzung(info.id)
          if (info.title && !info.title.startsWith("New session") && info.title !== s.titel) {
            s.titel = info.title
            schreibe(info.id, { art: "titel", titel: info.title })
            aktualisieren(info.id)
          }
          return
        }
        case "message.updated": {
          const info = p.info ?? {}
          rollen.set(info.id, info.role)
          if (info.role === "assistant" && info.modelID) sitzung(info.sessionID).modell = `${info.providerID}/${info.modelID}`
          return
        }
        case "message.part.updated": {
          const t = p.part ?? {}
          if (gesehen.has(t.id)) return
          if (t.type === "text" && t.time?.end && !t.synthetic && rollen.get(t.messageID) !== "user") {
            if (!t.text?.trim()) return
            gesehen.add(t.id)
            schreibe(t.sessionID, { art: "antwort", text: t.text.trim() })
          } else if (t.type === "tool" && (t.state?.status === "completed" || t.state?.status === "error")) {
            gesehen.add(t.id)
            const text = schritt(t.tool, t.state.input)
            if (text) schreibe(t.sessionID, { art: "schritt", text, fehler: t.state.status === "error" })
          }
          return
        }
        case "session.error": {
          if (p.sessionID) schreibe(p.sessionID, { art: "fehler", text: p.error?.data?.message ?? p.error?.name ?? "unbekannter Fehler" })
          return
        }
        case "session.idle": {
          if (p.sessionID) aktualisieren(p.sessionID)
          return
        }
      }
    }),
  }
}
