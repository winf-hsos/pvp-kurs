# Schreiben mit Quarto

Euer Exposé ist eine Textdatei mit der Endung `.qmd`. Quarto macht daraus ein Word-Dokument mit der Formatierung, die der Leitfaden der Fakultät verlangt: Arial 11 pt, 1,5-zeilig, Blocksatz, 2,5 cm Rand, Zitate und Literaturverzeichnis im Stil des Leitfadens.

## Warum nicht gleich Word?

Weil euer Assistent mit Text viel besser arbeiten kann. Er sieht jede Zeile, kann gezielt einen Absatz ändern, ohne die Formatierung zu zerstören, und jede Änderung ist nachvollziehbar. Zitate stehen als kurzer Schlüssel im Text, das Literaturverzeichnis entsteht von selbst und ist immer vollständig. Das Format, Markdown, ist dasselbe, in dem Sprachmodelle selbst am liebsten schreiben. Abgegeben wird trotzdem Word, denn die Lehrenden kommentieren darin.

## Das Wichtigste in fünf Minuten

```markdown
# Überschrift der ersten Ebene

## Überschrift der zweiten Ebene

Ein Absatz ist einfach Text. Eine Leerzeile beginnt einen neuen Absatz.
**fett**, *kursiv* (für wissenschaftliche Artnamen wie *Escherichia coli*).

Zitat in Klammern [@moeller2009], mit Seite [@moeller2009, S. 280],
mehrere [@moeller2009; @willam2017] oder im Satz: @moeller2009 zeigen, dass ...

1. Nummerierte Liste
2. zweiter Punkt

| Arbeitspaket | Arbeitstage |
|---|---:|
| AP 1 | 20 |

: Überschrift der Tabelle {#tbl-workload}

Verweis auf die Tabelle: siehe @tbl-workload.
```

Kommentare, die nicht ins Word-Dokument kommen, stehen zwischen `<!--` und `-->`. In den Vorlagen stehen dort die Hinweise, was in einen Abschnitt gehört.

## Der visuelle Modus

In Positron (und VS Code mit der Quarto-Erweiterung) gibt es oben rechts im Editor einen Schalter **Source / Visual**. Im visuellen Modus sieht das Dokument fast wie in Word aus: Überschriften groß, Tabellen als Tabellen, Zitate über *Insert > Citation*. Ihr könnt jederzeit umschalten.

## Nach Word rendern

- im Assistenten: `/word`
- in Positron: in `expose.qmd` oben auf **Preview** bzw. **Render** klicken
- im Terminal: `quarto render expose`

Das Ergebnis liegt in `expose/abgabe/expose.docx`. Schließt die Datei in Word, bevor ihr neu rendert, sonst kann Quarto sie nicht überschreiben.

## Die Literatur

Alle Quellen stehen in `expose/literatur.bib`, jede mit einem Schlüssel wie `moeller2009`. Einträge bekommt ihr über die DOI (etwa auf doi2bib.org) oder mit `/quelle` im Assistenten. Quarto setzt nur Quellen ins Literaturverzeichnis, die ihr im Text zitiert, so wie es der Leitfaden verlangt.

### Mit einem Literaturverwaltungsprogramm

Der Leitfaden der Fakultät empfiehlt in Abschnitt 3.3.8, die Literatur mit einem Programm zu verwalten, und nennt Citavi, EndNote und Mendeley; vorgeschrieben ist keines. Wer schon mit einem solchen Programm arbeitet, muss nicht umsteigen: Alle gängigen Programme, auch das kostenlose Zotero, exportieren ihre Einträge als BibTeX. Die exportierten Einträge fügt ihr unten in `expose/literatur.bib` ein. Die Datei ganz durch den Export zu ersetzen geht nur, wenn wirklich alle Quellen im Programm stehen; sonst gehen Einträge verloren, die `/quelle` dort ergänzt hat.

Zwei Dinge dabei beachten:

- **Den Zitierstil stellt ihr im Programm nicht ein.** Quarto setzt Kurzbelege und Literaturverzeichnis selbst im Stil des Leitfadens; aus dem Programm kommen nur die Daten.
- **Schlüssel prüfen.** Jedes Programm vergibt eigene Schlüssel (etwa `Moeller.2009` oder `moller_effects_2009`). Zitiert im Text genau den Schlüssel, der in `literatur.bib` steht, und exportiert nach Änderungen im Programm neu, damit beide übereinstimmen. Meldet `/word` „Citation not found“, passt ein Schlüssel nicht.

Mehr: [quarto.org/docs/authoring/markdown-basics](https://quarto.org/docs/authoring/markdown-basics.html)
