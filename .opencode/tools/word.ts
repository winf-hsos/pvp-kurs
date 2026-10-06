// Werkzeuge für Gruppen, die in Word schreiben. OpenCode nennt sie nach Datei
// und Export: word_lesen, word_literaturverzeichnis, word_erzeugen.
// Alle drei rufen Quarto auf (quarto pandoc); /einrichtung installiert es.
import { tool } from "@opencode-ai/plugin"
import { spawn } from "node:child_process"
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

const FILTER = path.join(import.meta.dir, "word-lesen.lua")

// Asynchron und ohne Eingabekanal: spawnSync blockiert den OpenCode-Server, solange
// Quarto läuft, und ein offener stdin kann Quarto unter Windows warten lassen.
function pandoc(args: string[], cwd: string): Promise<{ text: string; warnungen: string }> {
  return new Promise((resolve, reject) => {
    const p = spawn("quarto", ["pandoc", ...args], { cwd, stdio: ["ignore", "pipe", "pipe"], windowsHide: true })
    let out = "", err = ""
    p.stdout.setEncoding("utf8").on("data", (d) => (out += d))
    p.stderr.setEncoding("utf8").on("data", (d) => (err += d))
    const uhr = setTimeout(() => { p.kill(); reject(new Error("Quarto hat nach zwei Minuten nicht geantwortet.")) }, 120_000)
    p.on("error", () => { clearTimeout(uhr); reject(new Error("Quarto wurde nicht gefunden. Erst mit /einrichtung installieren, dann OpenCode neu starten.")) })
    p.on("close", (code) => {
      clearTimeout(uhr)
      if (code === 0) resolve({ text: out, warnungen: err.trim() })
      else reject(new Error(err.trim() || "quarto pandoc ist fehlgeschlagen"))
    })
  })
}

function imOrdner(wurzel: string, datei: string) {
  const voll = path.resolve(wurzel, datei)
  if (!voll.startsWith(path.resolve(wurzel) + path.sep)) throw new Error(`${datei} liegt nicht im Kursordner.`)
  return voll
}

const rel = (wurzel: string, voll: string) => path.relative(wurzel, voll).split(path.sep).join("/")

// Ein Abschnitt reicht von seiner Überschrift bis zur nächsten gleicher oder höherer Ebene
function abschnitt(md: string, gesucht: string) {
  const zeilen = md.split("\n")
  const start = zeilen.findIndex((z) => /^#+ /.test(z) && z.toLowerCase().includes(gesucht.toLowerCase()))
  if (start < 0) return null
  const ebene = zeilen[start].match(/^#+/)![0].length
  let ende = zeilen.length
  for (let i = start + 1; i < zeilen.length; i++) {
    const m = zeilen[i].match(/^(#+) /)
    if (m && m[1].length <= ebene) { ende = i; break }
  }
  return zeilen.slice(start, ende).join("\n").trim()
}

export const lesen = tool({
  description:
    "Liest eine Word- oder LibreOffice-Datei (.docx, .odt) als kompaktes Markdown, mit Kommentaren und Änderungen der Lehrenden im Text. " +
    "Mit gliederung=true nur die Überschriften, mit abschnitt nur diesen Abschnitt; beides spart Platz bei langen Dateien. Ändert nichts.",
  args: {
    datei: tool.schema.string().optional().describe("Pfad im Kursordner, Standard expose/word/expose.docx"),
    gliederung: tool.schema.boolean().optional().describe("nur die Überschriften"),
    abschnitt: tool.schema.string().optional().describe("Teil einer Überschrift, etwa 'Teilziele'"),
  },
  async execute(args, ctx) {
    const datei = args.datei || "expose/word/expose.docx"
    const voll = imOrdner(ctx.directory, datei)
    if (!existsSync(voll)) return `${datei} gibt es nicht. Liegt die aktuelle Fassung noch in Teams? Dann herunterladen und dort ablegen.`
    const { text } = await pandoc([voll, "-t", "gfm", "--wrap=none", "--track-changes=all", `--lua-filter=${FILTER}`], ctx.directory)
    if (args.gliederung) {
      const kopf = text.split("\n").filter((z) => /^#+ /.test(z))
      return kopf.length ? kopf.join("\n") : "Die Datei hat keine Überschriften mit Formatvorlage."
    }
    if (args.abschnitt) {
      const teil = abschnitt(text, args.abschnitt)
      if (teil) return teil
      const kopf = text.split("\n").filter((z) => /^#+ /.test(z)).join("\n")
      return `Keine Überschrift enthält „${args.abschnitt}“. Die Gliederung:\n${kopf}`
    }
    return text.trim()
  },
})

export const literaturverzeichnis = tool({
  description:
    "Erzeugt das Literaturverzeichnis im Stil des Leitfadens aus expose/literatur.bib als expose/word/literaturverzeichnis.docx zum Hineinkopieren " +
    "und gibt es als Text zurück. Mit schluessel nur diese Einträge, sonst alle.",
  args: {
    schluessel: tool.schema.array(tool.schema.string()).optional().describe("BibTeX-Schlüssel der zitierten Quellen, etwa ['moeller2009']"),
  },
  async execute(args, ctx) {
    const w = ctx.directory
    const bib = path.join(w, "expose", "literatur.bib")
    const csl = path.join(w, "kurs", "vorlagen", "leitfaden-hsos.csl")
    const vorlage = path.join(w, "kurs", "vorlagen", "word-vorlage.docx")
    const ziel = path.join(w, "expose", "word", "literaturverzeichnis.docx")
    await ctx.ask({ permission: "edit", patterns: [rel(w, ziel)], always: [rel(w, ziel)], metadata: {} })
    const nocite = args.schluessel?.length ? args.schluessel.map((s) => "@" + s.replace(/^@/, "")).join(", ") : "@*"
    const tmp = mkdtempSync(path.join(tmpdir(), "pvp-"))
    try {
      const md = path.join(tmp, "lv.md")
      writeFileSync(md, `---\nlang: de\nnocite: |\n  ${nocite}\n---\n\n# Literaturverzeichnis\n\n::: {#refs}\n:::\n`)
      const gemeinsam = [md, "--citeproc", `--bibliography=${bib}`, `--csl=${csl}`]
      const { warnungen } = await pandoc([...gemeinsam, `--reference-doc=${vorlage}`, "-o", ziel], w)
      const { text } = await pandoc([...gemeinsam, "-t", "plain", "--wrap=none"], w)
      const fehlend = [...warnungen.matchAll(/Citeproc: citation (\S+) not found/g)].map((m) => m[1])
      return [
        `Geschrieben: ${rel(w, ziel)}`,
        fehlend.length ? `Nicht in literatur.bib: ${fehlend.join(", ")}` : "",
        "",
        text.trim(),
      ].filter((z, i) => z || i > 1).join("\n")
    } finally {
      rmSync(tmp, { recursive: true, force: true })
    }
  },
})

export const erzeugen = tool({
  description:
    "Macht aus einer Markdown-Datei in expose/notizen/ (etwa einer Tabelle) eine Word-Datei daneben, formatiert nach dem Leitfaden, " +
    "damit eine Word-Gruppe den Inhalt in ihr Exposé kopieren kann. Die Word-Datei der Gruppe selbst ändert es nie.",
  args: {
    datei: tool.schema.string().describe("Markdown-Datei, etwa expose/notizen/evidenztabelle.md"),
  },
  async execute(args, ctx) {
    const w = ctx.directory
    const quelle = imOrdner(w, args.datei)
    if (!rel(w, quelle).startsWith("expose/notizen/") || !quelle.endsWith(".md")) throw new Error("Nur Markdown-Dateien in expose/notizen/.")
    if (!existsSync(quelle)) return `${args.datei} gibt es nicht.`
    const ziel = quelle.replace(/\.md$/, ".docx")
    await ctx.ask({ permission: "edit", patterns: [rel(w, ziel)], always: [rel(w, ziel)], metadata: {} })
    const vorlage = path.join(w, "kurs", "vorlagen", "word-vorlage.docx")
    await pandoc([quelle, `--reference-doc=${vorlage}`, "-o", ziel], w)
    return `Geschrieben: ${rel(w, ziel)}`
  },
})
