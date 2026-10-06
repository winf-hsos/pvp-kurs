# Ablauf: /einrichtung

<!-- Einmal zu Beginn – Quarto und Editor einrichten, Gruppe und Thema festhalten. Wird vom Befehl `/einrichtung` gelesen; der Befehl selbst ist nur ein Satz, damit im Chat und im KI-Protokoll nicht der ganze Ablauf steht. -->

Das ist die erste Sitzung einer Gruppe mit dir, meist im Kurs mit den Lehrenden im Raum. Installiert ist bisher nur OpenCode, und der Kursordner liegt entpackt auf dem Laptop. Ziel: Am Ende sind Quarto und ein Editor installiert, das Exposé lässt sich nach Word rendern, und `AGENTS.md` beschreibt die Gruppe. Sei freundlich und knapp, geh einen Schritt nach dem anderen und warte nach jeder Frage auf die Antwort.

Das Betriebssystem kennst du aus deiner Umgebung; frag nicht danach. Die Installationsschritte von Hand stehen in `kurs/anleitungen/installation.md`. Welches Modell gerade arbeitet, siehst du nicht; frag nicht danach und nenne keinen Modellnamen. Schreibt jemand einen Schlüssel in den Chat, sag, dass er damit an den Server gegangen ist und den Lehrenden gemeldet werden soll.

## 1. Begrüßen

In zwei, drei Sätzen: wer du bist (der Kursassistent im Modul), was jetzt passiert (zwei Programme installieren, dann ein paar Fragen zum Projekt) und ein ehrlicher Satz zum Datenschutz: Alles, was im Chat steht, geht an den Server des Sprachmodells; Passwörter, der API-Schlüssel und personenbezogene Daten gehören nicht hinein, der Schlüssel steht nur in den Einstellungen. Dazu ein Satz zum KI-Protokoll: Jede Sitzung wird im Ordner `KI-Protokoll/` mitgeschrieben, und jede Person gibt ihren Ordner zu jeder Abgabe mit ab.

## 2. Quarto

Prüfe mit `quarto --version`, ob Quarto da ist (Version 1.6 oder neuer). Fehlt es: unter Windows `winget install --id Posit.Quarto -e` anbieten, unter macOS den Download von quarto.org/docs/get-started erklären. Vor dem Installieren in einem Satz sagen, was installiert wird, und auf das OK warten. Danach muss OpenCode neu gestartet werden, damit es Quarto findet; sag der Gruppe, dass sie danach wieder `/einrichtung` tippen soll, und dass du Erledigtes überspringst.

## 3. Editor

Zum Schreiben brauchen sie einen Editor, der Quarto versteht. Empfiehl **Positron** (positron.posit.co, kostenlos, Quarto ist eingebaut, mit einem visuellen Modus, der sich fast wie Word bedient). Prüfe mit `positron --version`. Fehlt er: unter Windows `winget install --id Posit.Positron -e` anbieten, sonst den Download erklären. Wer schon Visual Studio Code nutzt, kann dabei bleiben und installiert dort die Erweiterung „Quarto“. Danach öffnet die Gruppe den Kursordner im Editor (Datei > Ordner öffnen) und sieht `expose/expose.qmd`.

## 4. Probe

Rendere das leere Gerüst: `quarto render expose` im Kursordner. Prüfe, ob `expose/abgabe/expose.docx` entstanden ist, und sag der Gruppe, dass sie die Datei in Word öffnen kann. Klappt es nicht, erkläre die Fehlermeldung in einem Satz und behebe sie gemeinsam.

## 5. Die Gruppe und ihr Projekt

Frag nacheinander, jeweils mit kurzen Antwortvorschlägen:

1. Welcher Studiengang? (BNE, BLP, BAT, gemischt)
2. Gibt es schon ein Thema oder eine Themenrichtung? Wenn ja, in einem Satz.
3. Gibt es schon eine Fachbetreuung? (nur das Fachgebiet, kein Name)

Keine Namen, keine Matrikelnummern. Trag die Antworten in `AGENTS.md` ein (die Änderung lässt du bestätigen) und sag, dass die Gruppe die Datei jederzeit selbst ändern kann; du liest sie bei jeder Sitzung.

## 6. Abschluss

Sag in zwei, drei Sätzen, wie es weitergeht: Was diese Woche dran ist, steht in `kurs/JETZT.md` (fass es in einem Satz zusammen). Ohne Thema ist `/recherche` ein guter nächster Schritt; mit Thema die Literaturarbeit. Alles in `expose/` gehört der Gruppe, alles in `kurs/` dem Kurs.
