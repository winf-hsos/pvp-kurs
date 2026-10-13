# R-Pakete für den Teil von Herrn Enneking

Für den Teil von Herrn Enneking braucht ihr R und die folgenden Pakete. Der Assistent prüft sie bei der Einrichtung und nach jeder Aktualisierung (`/aktualisieren`) und installiert fehlende mit eurem OK. Ihr könnt ihn auch jederzeit bitten: „Prüfe die R-Pakete.“

| Paket | Hinweis |
|---|---|
| `tidyverse` | enthält unter anderem `dplyr` und `purrr` |
| `psych` | |
| `stats` | gehört zu R, muss nicht installiert werden |
| `car` | |
| `sjmisc` | |
| `janitor` | |
| `ufs` | |
| `emmeans` | |
| `FactoMineR` | |
| `dplyr` | |
| `purrr` | |
| `REdaS` | |
| `GPArotation` | |

Maßgeblich ist die Liste im Skript `.opencode/scripts/check-r-packages.R`; die Tabelle hier ist dieselbe Liste zum Nachlesen.

## Von Hand installieren

Ist R noch nicht da, installiert ihr es zuerst: unter Windows im Terminal `winget install --id RProject.R -e`, unter macOS den Installer von [cran.r-project.org](https://cran.r-project.org/). Danach installiert dieser Befehl im Kursordner alles, was fehlt, in eure persönliche R-Bibliothek:

```bash
Rscript .opencode/scripts/check-r-packages.R install
```

Ohne das Wort `install` prüft das Skript nur und ändert nichts. Die Installation von `tidyverse` dauert einige Minuten. Unter Windows steht `Rscript` nach der Installation von R manchmal erst nach einem Neustart zur Verfügung.

Das Paket `ufs` hat CRAN am 28.08.2026 entfernt, weil Mängel nicht rechtzeitig behoben wurden. Das Skript installiert deshalb die neueste archivierte Fassung (25.7.1) aus dem CRAN-Archiv, samt ihren Abhängigkeiten; ein einfaches `install.packages("ufs")` funktioniert nicht mehr. Das Paket wird nicht mehr gepflegt.
