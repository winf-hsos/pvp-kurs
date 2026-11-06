// Tools for groups that write in Word: word_lesen, word_literaturverzeichnis, word_erzeugen.
// All three call Quarto (quarto pandoc); /einrichtung installs it.
//
// One file serves both OpenCode generations, like ki-protokoll.js:
//   OpenCode 1.x calls server() and gets the tools as a V1 tool map,
//   OpenCode 2.x calls setup() and registers them with ctx.tool.transform.
// OpenCode 2.x no longer loads .opencode/tools/, which is why the tools moved here.
// The Lua filter stays in .opencode/tools/word-lesen.lua.

import { spawn } from "node:child_process"
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

// The filter lives in the course folder. Not via import.meta.dir: only Bun knows it,
// in OpenCode Desktop it is undefined, and loading the file used to break every session.
const filterPath = (root) => path.join(root, ".opencode", "tools", "word-lesen.lua")

// Asynchronous and without stdin: spawnSync blocks the OpenCode server while Quarto
// runs, and an open stdin can make Quarto wait on Windows.
function pandoc(args, cwd, signal) {
  return new Promise((resolve, reject) => {
    const p = spawn("quarto", ["pandoc", ...args], { cwd, stdio: ["ignore", "pipe", "pipe"], windowsHide: true })
    let out = ""
    let err = ""
    p.stdout.setEncoding("utf8").on("data", (d) => (out += d))
    p.stderr.setEncoding("utf8").on("data", (d) => (err += d))
    const stop = () => p.kill()
    signal?.addEventListener("abort", stop, { once: true })
    const timer = setTimeout(() => { p.kill(); reject(new Error("Quarto hat nach zwei Minuten nicht geantwortet.")) }, 120_000)
    p.on("error", () => { clearTimeout(timer); reject(new Error("Quarto wurde nicht gefunden. Erst mit /einrichtung installieren, dann OpenCode neu starten.")) })
    p.on("close", (code) => {
      clearTimeout(timer)
      signal?.removeEventListener("abort", stop)
      if (code === 0) resolve({ text: out, warnings: err.trim() })
      else reject(new Error(err.trim() || "quarto pandoc ist fehlgeschlagen"))
    })
  })
}

function insideRoot(root, file) {
  const full = path.resolve(root, file)
  if (!full.startsWith(path.resolve(root) + path.sep)) throw new Error(`${file} liegt nicht im Kursordner.`)
  return full
}

const rel = (root, full) => path.relative(root, full).split(path.sep).join("/")

// A section runs from its heading to the next heading of the same or a higher level.
function section(md, wanted) {
  const lines = md.split("\n")
  const start = lines.findIndex((z) => /^#+ /.test(z) && z.toLowerCase().includes(wanted.toLowerCase()))
  if (start < 0) return null
  const level = lines[start].match(/^#+/)[0].length
  let end = lines.length
  for (let i = start + 1; i < lines.length; i++) {
    const m = lines[i].match(/^(#+) /)
    if (m && m[1].length <= level) { end = i; break }
  }
  return lines.slice(start, end).join("\n").trim()
}

const headings = (text) => text.split("\n").filter((z) => /^#+ /.test(z))

// The three tools, independent of the OpenCode version. `askEdit(relPath)` asks for
// the edit permission in the way the running version expects.
const TOOLS = {
  word_lesen: {
    description:
      "Liest eine Word- oder LibreOffice-Datei (.docx, .odt) als kompaktes Markdown, mit Kommentaren und Änderungen der Lehrenden im Text. " +
      "Mit gliederung=true nur die Überschriften, mit abschnitt nur diesen Abschnitt; beides spart Platz bei langen Dateien. Ändert nichts.",
    args: {
      datei: { type: "string", optional: true, description: "Pfad im Kursordner, Standard expose/word/expose.docx" },
      gliederung: { type: "boolean", optional: true, description: "nur die Überschriften" },
      abschnitt: { type: "string", optional: true, description: "Teil einer Überschrift, etwa 'Teilziele'" },
    },
    async run(args, root, _askEdit, signal) {
      const file = args.datei || "expose/word/expose.docx"
      const full = insideRoot(root, file)
      if (!existsSync(full)) return `${file} gibt es nicht. Liegt die aktuelle Fassung noch in Teams? Dann herunterladen und dort ablegen.`
      const { text } = await pandoc([full, "-t", "gfm", "--wrap=none", "--track-changes=all", `--lua-filter=${filterPath(root)}`], root, signal)
      if (args.gliederung) {
        const h = headings(text)
        return h.length ? h.join("\n") : "Die Datei hat keine Überschriften mit Formatvorlage."
      }
      if (args.abschnitt) {
        const part = section(text, args.abschnitt)
        if (part) return part
        return `Keine Überschrift enthält „${args.abschnitt}“. Die Gliederung:\n${headings(text).join("\n")}`
      }
      return text.trim()
    },
  },

  word_literaturverzeichnis: {
    description:
      "Erzeugt das Literaturverzeichnis im Stil des Leitfadens aus expose/literatur.bib als expose/word/literaturverzeichnis.docx zum Hineinkopieren " +
      "und gibt es als Text zurück. Mit schluessel nur diese Einträge, sonst alle.",
    args: {
      schluessel: { type: "array", items: "string", optional: true, description: "BibTeX-Schlüssel der zitierten Quellen, etwa ['moeller2009']" },
    },
    async run(args, root, askEdit, signal) {
      const bib = path.join(root, "expose", "literatur.bib")
      const csl = path.join(root, "kurs", "vorlagen", "leitfaden-hsos.csl")
      const template = path.join(root, "kurs", "vorlagen", "word-vorlage.docx")
      const target = path.join(root, "expose", "word", "literaturverzeichnis.docx")
      await askEdit(rel(root, target))
      const nocite = args.schluessel?.length ? args.schluessel.map((s) => "@" + s.replace(/^@/, "")).join(", ") : "@*"
      const tmp = mkdtempSync(path.join(tmpdir(), "pvp-"))
      try {
        const md = path.join(tmp, "lv.md")
        writeFileSync(md, `---\nlang: de\nnocite: |\n  ${nocite}\n---\n\n# Literaturverzeichnis\n\n::: {#refs}\n:::\n`)
        const common = [md, "--citeproc", `--bibliography=${bib}`, `--csl=${csl}`]
        const { warnings } = await pandoc([...common, `--reference-doc=${template}`, "-o", target], root, signal)
        const { text } = await pandoc([...common, "-t", "plain", "--wrap=none"], root, signal)
        const missing = [...warnings.matchAll(/Citeproc: citation (\S+) not found/g)].map((m) => m[1])
        return [
          `Geschrieben: ${rel(root, target)}`,
          missing.length ? `Nicht in literatur.bib: ${missing.join(", ")}` : "",
          "",
          text.trim(),
        ].filter((z, i) => z || i > 1).join("\n")
      } finally {
        rmSync(tmp, { recursive: true, force: true })
      }
    },
  },

  word_erzeugen: {
    description:
      "Macht aus einer Markdown-Datei in expose/notizen/ (etwa einer Tabelle) eine Word-Datei daneben, formatiert nach dem Leitfaden, " +
      "damit eine Word-Gruppe den Inhalt in ihr Exposé kopieren kann. Die Word-Datei der Gruppe selbst ändert es nie.",
    args: {
      datei: { type: "string", description: "Markdown-Datei, etwa expose/notizen/evidenztabelle.md" },
    },
    async run(args, root, askEdit, signal) {
      const source = insideRoot(root, args.datei)
      if (!rel(root, source).startsWith("expose/notizen/") || !source.endsWith(".md")) throw new Error("Nur Markdown-Dateien in expose/notizen/.")
      if (!existsSync(source)) return `${args.datei} gibt es nicht.`
      const target = source.replace(/\.md$/, ".docx")
      await askEdit(rel(root, target))
      const template = path.join(root, "kurs", "vorlagen", "word-vorlage.docx")
      await pandoc([source, `--reference-doc=${template}`, "-o", target], root, signal)
      return `Geschrieben: ${rel(root, target)}`
    },
  },
}

// OpenCode 1.x: a tool map built with the V1 helper. Imported here, not at the top,
// because 2.x does not install @opencode-ai/plugin.
const serverV1 = async ({ directory }) => {
  const { tool } = await import("@opencode-ai/plugin")
  const z = tool.schema
  const zodArg = (a) => {
    let s = a.type === "array" ? z.array(z.string()) : a.type === "boolean" ? z.boolean() : z.string()
    if (a.optional) s = s.optional()
    return s.describe(a.description)
  }
  const map = {}
  for (const [name, t] of Object.entries(TOOLS)) {
    map[name] = tool({
      description: t.description,
      args: Object.fromEntries(Object.entries(t.args).map(([k, a]) => [k, zodArg(a)])),
      async execute(args, ctx) {
        const root = ctx.directory ?? directory
        const askEdit = (p) => ctx.ask({ permission: "edit", patterns: [p], always: [p], metadata: {} })
        return t.run(args, root, askEdit, ctx.abort)
      },
    })
  }
  return { tool: map }
}

// OpenCode 2.x: JSON Schema input, permission through ctx.permission.assert.
// codemode: false keeps the tools directly callable, so the KI-Protokoll names them.
const jsonSchema = (args) => ({
  type: "object",
  properties: Object.fromEntries(
    Object.entries(args).map(([k, a]) => [
      k,
      a.type === "array" ? { type: "array", items: { type: a.items }, description: a.description } : { type: a.type, description: a.description },
    ]),
  ),
  required: Object.entries(args).filter(([, a]) => !a.optional).map(([k]) => k),
  additionalProperties: false,
})

const setupV2 = async (ctx) => {
  const root = ctx.location.directory
  await ctx.tool.transform((editor) => {
    for (const [name, t] of Object.entries(TOOLS)) {
      editor.add({
        name,
        description: t.description,
        input: jsonSchema(t.args),
        options: { codemode: false },
        execute: async (input, context) => {
          const askEdit = (p) =>
            ctx.permission.assert({
              sessionID: context.sessionID,
              agent: context.agent,
              source: { type: "tool", messageID: context.messageID, id: context.id },
              action: "edit",
              resources: [p],
              save: [p],
            })
          return { content: await t.run(input ?? {}, root, askEdit, context.signal) }
        },
      })
    }
  })
}

export default { id: "word", setup: setupV2, server: serverV1 }
