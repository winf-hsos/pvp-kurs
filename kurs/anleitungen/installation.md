# Installation

Ihr braucht drei kostenlose Programme, die unter Windows und macOS laufen:

| Programm | wofür | woher |
|---|---|---|
| **OpenCode** | euer KI-Assistent | [opencode.ai/download](https://opencode.ai/download) |
| **Quarto** | macht aus eurem Text ein Word-Dokument | [quarto.org](https://quarto.org/docs/get-started/) |
| **Positron** | der Editor, in dem ihr schreibt | [positron.posit.co](https://positron.posit.co/) |

Nur OpenCode installiert ihr von Hand. Die beiden anderen installiert der Assistent mit euch, wenn ihr `/einrichtung` tippt.

## Teil 1: von Hand

### OpenCode

Ladet die Desktop-App von [opencode.ai/download](https://opencode.ai/download) und installiert sie wie jedes andere Programm. Unter macOS wählt ihr *Apple Silicon*, wenn euer Mac einen M-Chip hat (Apfelmenü > *Über diesen Mac* > Zeile *Chip*), sonst *Intel*.

### Den Kursordner

Ladet den Kursordner als ZIP von [github.com/winf-hsos/pvp-kurs](https://github.com/winf-hsos/pvp-kurs) (grüner Knopf *Code* > *Download ZIP*) und entpackt ihn. Jede Person der Gruppe macht das auf ihrem eigenen Laptop. Entpackt ihn an einen Ort, den ihr wiederfindet, etwa in Dokumente, und nicht im Ordner Downloads. Benennt den entpackten Ordner `pvp-kurs-main` gern um, etwa in `pvp-gruppe`.

### Ordner öffnen und starten

1. Startet OpenCode. Links seht ihr die Liste **Projects**.
2. Klickt auf das kleine Ordnersymbol mit Plus neben *Projects* (*Add project*) und wählt den Kursordner.
3. **Den Kursschlüssel eintragen, bevor ihr den Assistenten zum ersten Mal fragt.** Ohne Schlüssel antwortet das Kursmodell nicht, sondern meldet nur „OpenAI API key is missing“. Für das Kursmodell GPT-6 Luna bekommt ihr in der Veranstaltung einen Schlüssel, eine lange Zeichenfolge, über den Teams-Raum. Klickt in OpenCode unten links auf **Settings**, dann links auf **Providers**. Bei **OpenAI** auf **+ Connect** klicken (steht es nicht in der Liste, zuerst *Show more providers*), **API key** wählen und den Schlüssel einfügen.
4. Klickt **New session**. Unter dem Eingabefeld steht das Modell, das der Kursordner voreingestellt hat: GPT-6 Luna (Kursmodell).
5. Tippt `/einrichtung` und Enter.

**Der Schlüssel ist wie ein Passwort.** Jede Antwort des Assistenten kostet Geld, und der Kurs bezahlt sie. Gebt den Schlüssel niemandem außerhalb des Kurses weiter, legt ihn in keine Datei im Kursordner und fügt ihn nie in den Chat ein, auch nicht in den mit eurem Assistenten.

Ohne Schlüssel oder wenn das Kursmodell einmal nicht antwortet, wählt ihr unter dem Eingabefeld das kostenlose Modell **Space Bunny** (`opencode/space-bunny-free`); es braucht keinen Schlüssel.

## Teil 2: der Assistent übernimmt

`/einrichtung` prüft, ob Quarto und Positron da sind, und installiert sie mit eurem OK. Danach rendert es das leere Exposé einmal zur Probe nach Word und fragt nach eurer Gruppe. Die Schritte von Hand:

### Quarto

- **Windows:** Installer von [quarto.org/docs/get-started](https://quarto.org/docs/get-started/) oder im Terminal `winget install --id Posit.Quarto -e`.
- **macOS:** Installer (`.pkg`) von derselben Seite.

Prüfen: Terminal öffnen, `quarto --version` tippen; eine Versionsnummer erscheint. OpenCode danach neu starten.

### Positron

- **Windows:** Installer von [positron.posit.co](https://positron.posit.co/) oder `winget install --id Posit.Positron -e`.
- **macOS:** `.dmg` von derselben Seite, Positron in den Programme-Ordner ziehen.

In Positron *File > Open Folder* und den Kursordner wählen. Wer lieber Visual Studio Code nutzt, installiert dort die Erweiterung *Quarto*.

## Wenn etwas nicht klappt

Fragt zuerst den Assistenten und beschreibt, was ihr seht, gern mit einem Bildschirmfoto. Hilft das nicht, meldet euch in der Veranstaltung.
