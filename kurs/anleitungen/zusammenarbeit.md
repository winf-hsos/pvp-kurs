# Zu dritt am selben Exposé

Jede Person hat ihren eigenen Kursordner auf dem eigenen Laptop, mit eigenem Assistenten und eigenem KI-Protokoll. Das Exposé schreibt ihr trotzdem gemeinsam; dafür ist es in Dateien aufgeteilt (`expose/teile/`).

Schreibt ihr in Word, ist es einfacher: Ihr arbeitet gemeinsam in einer Datei in Teams, wie in [word.md](word.md) beschrieben, und die Schritte unten entfallen bis auf das KI-Protokoll.

## So geht es

1. **Teile verteilen.** Sprecht ab, wer welchen Abschnitt schreibt, etwa eine Person Literaturreview, eine Oberziel und Hintergrund, eine Teilziele, Arbeitspakete und Workload. Jede Person arbeitet in ihrem Kursordner an ihren Dateien.
2. **Eine Person führt die Gesamtfassung.** Sie sammelt die Dateien der anderen ein (über euren Gruppenchat in Teams) und legt sie in ihren Ordner `expose/teile/`, wobei sie die alte Fassung ersetzt. Sie rendert mit `/word` und stellt das Word-Dokument für alle in den Chat.
3. **Die Literatur zusammenführen.** Neue Einträge aus `literatur.bib` schickt jede Person mit; die Gesamtfassung hängt sie unten an ihre Datei an. Doppelte Schlüssel meldet Quarto beim Rendern; dann einen der beiden löschen.
4. **Wieder verteilen.** Nach dem Zusammenführen schickt die Person mit der Gesamtfassung `expose/teile/` und `literatur.bib` an die anderen, damit alle mit demselben Stand weiterarbeiten.

Je klarer die Aufteilung, desto seltener schreibt ihr in derselben Datei. Müssen zwei Personen an denselben Abschnitt, sprecht euch vorher ab, wer gerade dran ist.

## Das KI-Protokoll

Jede Person hat ihr eigenes Protokoll in `KI-Protokoll/`. Zu jeder Abgabe gibt **jede Person ihr Protokoll als ZIP** ab, benannt mit Gruppennummer und einer Ziffer, etwa `KI-Protokoll_Gruppe-07_1.zip`, `_2.zip`, `_3.zip`. Namen sind nicht nötig.

Für den Abschnitt „Angaben zur Nutzung von KI“ braucht die Person mit der Gesamtfassung alle drei Protokolle: Sie entpackt die ZIPs der anderen nach `expose/notizen/protokolle/2/` und `.../3/`, dann bezieht `/ki-angaben` sie mit ein.

Wer Git kennt, kann den Ordner auch als gemeinsames Repository führen. Für den Kurs ist das nicht nötig.
