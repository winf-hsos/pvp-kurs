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

Ladet den Kursordner als ZIP von [github.com/winf-hsos/pvp-kurs](https://github.com/winf-hsos/pvp-kurs) (grüner Knopf *Code* > *Download ZIP*) und entpackt ihn. Wohin, steht in `zusammenarbeit.md`: am besten in einen Ordner, den eure Gruppe gemeinsam nutzt. Benennt den entpackten Ordner `pvp-kurs-main` gern um, etwa in `pvp-gruppe`.

### Ordner öffnen und starten

1. Startet OpenCode. Links seht ihr die Liste **Projects**.
2. Klickt auf das kleine Ordnersymbol mit Plus neben *Projects* (*Add project*) und wählt den Kursordner.
3. Klickt **New session**. Unter dem Eingabefeld steht das Modell, das der Kursordner voreingestellt hat: Space Bunny, eines der kostenlosen Modelle von OpenCode. Ihr braucht keinen Schlüssel.
4. Tippt `/einrichtung` und Enter.

Kostenlose Modelle kommen und gehen. Funktioniert Space Bunny nicht mehr, wählt unter dem Eingabefeld ein anderes kostenloses Modell; die Lehrenden sagen euch, welches.

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
