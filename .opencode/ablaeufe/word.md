# Ablauf: /word

<!-- Das Exposé nach Word rendern (expose/abgabe/expose.docx). Wird vom Befehl `/word` gelesen; der Befehl selbst ist nur ein Satz, damit im Chat und im KI-Protokoll nicht der ganze Ablauf steht. -->

Rendere das Exposé nach Word. Schreibt die Gruppe in Word (`AGENTS.md`, „Wie wir arbeiten“), gilt der zweite Teil weiter unten.

## Quarto

1. Führe `quarto render expose` im Kursordner aus.
2. Hat es geklappt, nenne den Pfad `expose/abgabe/expose.docx` und erinnere an die Abgabe: Word-Dokument im Teams-Raum des Moduls, dazu von jeder Person der Gruppe ihren Ordner `KI-Protokoll` als eigenes ZIP (etwa `KI-Protokoll_Gruppe-07_1.zip`). Die Präsentation entsteht in PowerPoint.
3. Gibt es Warnungen zu Zitaten (etwa „Citation not found“), nenne die fehlenden Schlüssel und wo sie stehen; sie fehlen in `literatur.bib` oder sind falsch geschrieben.
4. Bricht es ab, erkläre die Fehlermeldung in ein, zwei Sätzen und schlag die Korrektur vor. Typische Ursachen: eine nicht geschlossene Klammer im Kopf von `expose.qmd`, ein Tippfehler in `literatur.bib`, oder die Word-Datei ist noch in Word geöffnet.

## Word

Hier gibt es nichts zu rendern; der Befehl bereitet die Abgabe vor.

1. **Lesen.** Lies `expose/word/expose.docx` mit `word_lesen`. Fehlt die Datei, frag, wo die aktuelle Fassung liegt; arbeitet die Gruppe in Teams, soll sie den Stand herunterladen und dort ablegen.
2. **Zitate gegen Literatur.** Sammle alle Kurzbelege im Text und vergleiche sie mit `expose/literatur.bib`. Nenne Belege ohne Eintrag (die Gruppe nimmt sie mit `/quelle` auf) und Einträge, die im Text nicht vorkommen, denn nach dem Leitfaden gehören nur zitierte Quellen ins Verzeichnis. Nicht zitierte Einträge entfernst du nur mit Bestätigung.
3. **Literaturverzeichnis.** Ruf `word_literaturverzeichnis` mit den Schlüsseln der zitierten Quellen auf. Es entsteht `expose/word/literaturverzeichnis.docx` im Stil des Leitfadens; die Gruppe kopiert den Inhalt an das Ende ihres Exposés und ersetzt dabei ein älteres Verzeichnis.
4. **Formalia kurz.** Prüfe nach `.opencode/kriterien/formalia.md` nur, was sich aus dem Text erkennen lässt (Gliederung, Kurzbelege, Abschnitt „Angaben zur Nutzung von KI“). Schrift, Ränder und Zeilenabstand siehst du nicht; sag, dass die Vorlage sie richtig setzt, solange die Gruppe deren Formatvorlagen nutzt.
5. **Abgabe.** Erinnere wie oben an die Abgabe im Teams-Raum: das Word-Dokument, die Präsentation in PowerPoint und von jeder Person ihr `KI-Protokoll` als eigenes ZIP, mit der Gruppennummer aus `AGENTS.md` im Namen.
