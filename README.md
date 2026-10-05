# Kursordner: Planung und Vorbereitung wissenschaftlicher Projekte

Hochschule Osnabrück, Fakultät Agrarwissenschaften und Landschaftsarchitektur. Pflichtmodul im 3. Semester (BNE, BLP, BAT), Wintersemester 2026/27.

In diesem Ordner schreibt eure Gruppe ihr Exposé, zusammen mit einem KI-Assistenten, der eure Dateien lesen, Literatur suchen, Tabellen bauen und euren Text nach den Kriterien der Lehrenden begutachten kann. Jede Sitzung mit ihm wird automatisch mitgeschrieben; dieses KI-Protokoll ist einer der vier Teile eures Exposés.

## Loslegen

1. [OpenCode installieren](kurs/anleitungen/installation.md) und diesen Ordner als ZIP laden ([Code > Download ZIP](https://github.com/winf-hsos/pvp-kurs/archive/refs/heads/main.zip)).
2. Den Ordner entpacken; jede Person der Gruppe hat ihren eigenen. Wie ihr trotzdem gemeinsam schreibt, steht in [zusammenarbeit.md](kurs/anleitungen/zusammenarbeit.md).
3. In OpenCode öffnen und den Kursschlüssel für GPT-6 Luna eintragen (Settings > Providers > OpenAI; der Schlüssel kommt über den Teams-Raum, [Anleitung](kurs/anleitungen/installation.md)).
4. Eine neue Sitzung starten und `/einrichtung` tippen.

Was diese Woche dran ist, steht in [kurs/JETZT.md](kurs/JETZT.md).

## Was wo liegt

```
expose/                  ← gehört euch
  expose.qmd             Hauptdokument, bindet die Teile ein
  teile/                 je Abschnitt eine Datei
  literatur.bib          eure Quellen
  literatur/             Open-Access-PDFs für den Assistenten
  notizen/               Recherche, Evidenztabelle, Ideen
  AGENTS.md              was der Assistent über euer Projekt wissen soll
  abgabe/                das fertige Word-Dokument (entsteht beim Rendern)
KI-Protokoll/            ← entsteht von selbst, wird abgegeben
kurs/                    ← gehört dem Kurs: Termine, Anleitungen, Regeln, Vorlagen
.opencode/               ← der Assistent: Regeln, Befehle, Gutachter, Protokoll
```

Was in `kurs/` und `.opencode/` liegt, ändert ihr nicht; `/aktualisieren` holt neue Fassungen und lässt `expose/` und `KI-Protokoll/` dabei in Ruhe.

## Die Befehle

| Befehl | Was er tut |
|---|---|
| `/einrichtung` | einmal zu Beginn: Quarto und Editor installieren, Gruppe festhalten |
| `/recherche <frage>` | Suchbegriffe, Datenbanken und erste Treffer |
| `/quelle <doi>` | eine Quelle prüfen und in `literatur.bib` aufnehmen |
| `/evidenztabelle` | Tabelle aus den PDFs in `expose/literatur/` |
| `/konsistenz` | passen Oberziel, Teilziele, Arbeitspakete und Workload zusammen? |
| `/review [teil]` | Gutachten nach den Kriterien der Lehrenden |
| `/word` | das Exposé nach Word rendern |
| `/ki-angaben` | „Angaben zur Nutzung von KI“ aus dem Protokoll entwerfen |
| `/aktualisieren` | neue Kursmaterialien holen |

## Regeln

Die KI-Regeln des Leitfadens der Fakultät gelten auch hier; die Kurzfassung steht in [kurs/ki-regeln.md](kurs/ki-regeln.md). Das Wichtigste: Ihr prüft alles, was der Assistent liefert, ihr übernehmt keinen Text ungeprüft, ihr gebt ihm keine personenbezogenen Daten und keine PDFs aus Lizenzdatenbanken, und ihr dokumentiert die Nutzung.

## Abgabe

Zu jeder Abgabe (vorläufig, 1. Abgabe, final) über die Aufgabe im Teams-Raum: `expose/abgabe/expose.docx`, die Präsentation als PowerPoint und von jeder Person ihren Ordner `KI-Protokoll` als eigenes ZIP. Termine in [kurs/termine.md](kurs/termine.md).
