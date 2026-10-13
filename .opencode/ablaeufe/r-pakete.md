# Ablauf: R-Pakete

<!-- Wird nach jeder Aktualisierung (`/aktualisieren`) und bei der Einrichtung (`/einrichtung`) gelesen, und immer dann, wenn die Gruppe nach den R-Paketen fragt. -->

Für den Teil von Herrn Enneking braucht jede Person einige R-Pakete. Du prüfst sie nach jeder Aktualisierung und bei der Einrichtung, installierst fehlende mit dem OK der Person und sagst ihr, was du getan hast. Die Liste steht im Skript `.opencode/scripts/check-r-packages.R` (für die Studierenden gespiegelt in `kurs/anleitungen/r-pakete.md`), du musst sie nicht kennen und nennst die Namen nur aus der Ausgabe des Skripts.

## 1. R finden

Prüfe mit `Rscript --version`, ob R da ist. Unter Windows liegt `Rscript` oft nicht im Suchpfad, etwa direkt nach der Installation; sieh dann in `C:\Program Files\R\R-*\bin` und `%LOCALAPPDATA%\Programs\R\R-*\bin` nach (die neueste Version nehmen) und ruf es mit dem vollen Pfad auf. Wo du es gefunden hast, nimmst du in den folgenden Schritten statt `Rscript`.

## 2. Fehlt R ganz

Sag in zwei Sätzen, dass R für den Teil von Herrn Enneking gebraucht wird und die Pakete erst nach der Installation geprüft werden können. Biete die Installation an: unter Windows `winget install --id RProject.R -e`, unter macOS den Installer von cran.r-project.org (die Gruppe lädt ihn selbst). Installiere erst nach dem OK. Danach muss OpenCode neu gestartet werden, damit es R findet; sag, dass die Gruppe dann „Prüfe die R-Pakete“ schreiben kann. Wer R nicht installieren will, den drängst du nicht, du erinnerst nur bei der nächsten Aktualisierung kurz.

## 3. Prüfen

Führe `Rscript .opencode/scripts/check-r-packages.R` aus. Sind alle Pakete da, sag das in einem Satz und höre auf.

## 4. Fehlende Pakete installieren

Nenne die fehlenden Pakete und sag in ein, zwei Sätzen, dass sie für den Teil von Herrn Enneking gebraucht werden, dass die Installation einige Minuten dauern kann (vor allem `tidyverse` mit seinen Abhängigkeiten) und dass sie in die persönliche R-Bibliothek der Person gehen, nicht ins System. Warte auf das OK und führe dann `Rscript .opencode/scripts/check-r-packages.R install` aus. Gehört `ufs` zu den fehlenden Paketen, sag dazu, dass es nicht mehr auf CRAN liegt (dort am 28.08.2026 entfernt, weil Mängel nicht rechtzeitig behoben wurden) und das Skript deshalb die neueste archivierte Fassung nimmt; die Person soll wissen, dass das Paket nicht mehr gepflegt wird.

## 5. Ergebnis

Meldet das Skript Erfolg, sag das in einem Satz und nenne, was neu dazukam. Bleibt ein Paket übrig, nenne es, erkläre die Fehlermeldung in einem Satz und schlage eine Lösung vor; kommt ihr nicht weiter, soll die Gruppe sich bei den Lehrenden melden und den Namen des Pakets nennen. Erfinde keine Ursachen: Steht in der Ausgabe nichts Erkennbares, sag das.
