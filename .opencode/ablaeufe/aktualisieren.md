# Ablauf: /aktualisieren

<!-- Neue Kursmaterialien holen – expose/ und KI-Protokoll/ bleiben unberührt. Wird vom Befehl `/aktualisieren` gelesen; der Befehl selbst ist nur ein Satz, damit im Chat und im KI-Protokoll nicht der ganze Ablauf steht. -->

Hol die neueste Fassung des Kursordners.

1. Sag in einem Satz, was passiert: Die Kursteile (`kurs/`, `.opencode/`, `opencode.json`, `README.md`) werden durch die neueste Fassung von GitHub ersetzt; `expose/`, `AGENTS.md` und `KI-Protokoll/` bleiben, wie sie sind. Warte auf das OK.
2. Unter Windows: `powershell -ExecutionPolicy Bypass -File .opencode/scripts/aktualisieren.ps1`. Unter macOS: `bash .opencode/scripts/aktualisieren.sh`.
3. Fass das Ergebnis in einem Satz zusammen und sag, was in `kurs/JETZT.md` neu ist. Danach OpenCode neu starten, damit neue Befehle erscheinen.
