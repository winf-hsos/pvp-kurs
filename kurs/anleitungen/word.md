# Schreiben in Word

Ihr dürft das Exposé in Word schreiben (oder in LibreOffice, abgegeben wird dann als `.docx`). Der Assistent unterstützt euch dabei, nur etwas anders als bei Quarto: Er liest eure Datei, schreibt aber nicht hinein. Entwürfe gibt er im Chat, und ihr übertragt sie selbst. Ob ihr in Word oder Quarto schreibt, fragt `/einrichtung` einmal ab und hält es in `AGENTS.md` fest; wollt ihr später wechseln, ändert ihr dort die Zeile „Schreibwerkzeug“.

## Die Datei

`/einrichtung` legt euch `expose/word/expose.docx` an, eine Kopie von `kurs/vorlagen/expose-vorlage.docx`. Sie hat die Gliederung des Exposés und ist nach dem Leitfaden formatiert: Arial 11 pt, 1,5-zeilig, Blocksatz, 2,5 cm Rand. Damit das so bleibt, nutzt die Formatvorlagen (Überschrift 1, Überschrift 2, Standard) statt Text von Hand zu formatieren.

## Zu dritt in Teams

Word hat einen echten Vorteil, denn ihr könnt gleichzeitig in derselben Datei schreiben:

1. Eine Person lädt `expose.docx` in den Dateien-Bereich eures Gruppenkanals in Teams. Ab dann schreibt ihr alle in dieser Datei, in Teams oder in Word über *In Desktop-App öffnen*.
2. **Bevor ihr den Assistenten fragt,** holt ihr den aktuellen Stand: in Teams bei der Datei *Herunterladen* und die Datei als `expose/word/expose.docx` in euren Kursordner legen (die alte ersetzen). Der Assistent sieht nur, was in eurem Kursordner liegt.
3. Was der Assistent vorschlägt, tragt ihr selbst in die Datei in Teams ein. Er ändert eure Word-Datei nie, denn dabei gingen Formatierung, Kommentare und die Änderungsverfolgung verloren.

Kommentare der Lehrenden in der Word-Datei liest der Assistent mit; fragt ihn, was sie bedeuten und wie ihr darauf eingehen könnt.

## Was der Assistent für euch tut

| Befehl | in Word |
|---|---|
| `/recherche`, `/quelle` | wie bei Quarto; jede geprüfte Quelle kommt in `expose/literatur.bib` |
| `/evidenztabelle` | schreibt die Tabelle nach `expose/notizen/` und macht daraus eine Word-Datei zum Kopieren |
| `/konsistenz`, `/review` | lesen eure Word-Datei und melden, was fehlt, mit Fundstelle |
| `/word` | prüft Zitate gegen die Literatur, erzeugt das Literaturverzeichnis und erinnert an die Abgabe |
| `/ki-angaben` | entwirft den Abschnitt im Chat; ihr übertragt ihn |

## Zitieren und Literaturverzeichnis

Im Text setzt ihr die Kurzbelege selbst, so wie der Leitfaden es verlangt: (MÖLLER und REENTS 2009), mit Seite (MÖLLER und REENTS 2009, S. 280), oder im Satz: MÖLLER und REENTS (2009) zeigen, dass … Bei drei und mehr Personen MEFFERT et al. (2002).

Das Literaturverzeichnis müsst ihr nicht von Hand setzen. Alle Quellen stehen in `expose/literatur.bib`; `/word` macht daraus `expose/word/literaturverzeichnis.docx` im Stil des Leitfadens, und ihr kopiert den Inhalt ans Ende eures Exposés. Nach dem Leitfaden gehören nur Quellen hinein, die ihr im Text zitiert; `/word` sagt euch, welche Einträge überzählig sind oder fehlen.

Wer mit Zotero oder Citavi arbeitet, kann dabei bleiben: Einträge aus `literatur.bib` lassen sich dort per BibTeX importieren, und umgekehrt exportiert ihr aus dem Programm BibTeX und fügt es unten in `literatur.bib` ein. Für Zotero gibt es den Zitierstil des Leitfadens als Datei: `kurs/vorlagen/leitfaden-hsos.csl`, in Zotero unter *Einstellungen > Zitieren > +* hinzufügen. Dann setzt das Word-Plugin von Zotero Kurzbelege und Verzeichnis selbst.

## Abgabe

Das Word-Dokument, die Präsentation als PowerPoint und von jeder Person ihr Ordner `KI-Protokoll` als eigenes ZIP, wie in `kurs/anleitungen/zusammenarbeit.md` beschrieben.
