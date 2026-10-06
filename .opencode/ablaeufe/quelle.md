# Ablauf: /quelle

<!-- Eine Quelle prüfen und als BibTeX-Eintrag in literatur.bib aufnehmen. Wird vom Befehl `/quelle` gelesen; der Befehl selbst ist nur ein Satz, damit im Chat und im KI-Protokoll nicht der ganze Ablauf steht. -->

Die Quelle steht im Auftrag der Gruppe: eine DOI, ein Link oder eine Literaturangabe. Fehlt sie, frag danach.

1. **Existiert sie?** Ruf die DOI (https://doi.org/…) oder die Seite des Verlags auf und prüfe Autorinnen und Autoren, Jahr, Titel, Zeitschrift, Band und Seiten. Findest du die Quelle nicht, sag das deutlich: Dann ist sie vermutlich falsch zitiert oder erfunden, und sie kommt nicht ins Verzeichnis.
2. **Taugt sie?** Prüfe sie knapp an der Checkliste zur Bewertung einer Quelle aus `.opencode/kriterien/literaturreview.md` (Punkt 8: Thema, Sachverstand der Autorinnen und Autoren, wissenschaftliche Veröffentlichung, Aktualität, eigene Quellennachweise). Dann ein Satz zur Art der Quelle: begutachtete Zeitschrift, Fachbuch, Dissertation, Bericht einer Institution, Internetquelle. Bachelor- und Masterarbeiten, Vorlesungsskripte und nicht geprüfte Internetquellen sind nach dem Leitfaden keine geeigneten Quellen; sag es, wenn es so ist.
3. **Eintrag.** Schreib einen BibTeX-Eintrag mit sprechendem Schlüssel (`nachname` des ersten Autors plus Jahr, etwa `moeller2009`; Umlaute als ae, oe, ue), allen Personen, Titel, Zeitschrift oder Verlag mit Ort, Band, Seiten und DOI. Bei Internetquellen `url` und `urldate` (Datum des Abrufs). Lass die Ergänzung in `expose/literatur.bib` bestätigen, und prüfe vorher, ob der Schlüssel schon vergeben ist.
4. **Zitieren.** Zeig in einem Beispiel, wie sie im Text zitiert wird: `[@moeller2009]` oder `[@moeller2009, S. 280]`.
5. **Volltext.** Gibt es einen Open-Access-Volltext, sag, wo; die Gruppe kann ihn in `expose/literatur/` ablegen, unter dem Schlüssel als Dateinamen (`moeller2009.pdf`). Lizenzierte Volltexte nicht.
