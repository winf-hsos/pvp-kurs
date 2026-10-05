#!/usr/bin/env bash
# Holt die neueste Fassung des Kursordners von GitHub.
# Ersetzt kurs/, .opencode/, opencode.json und README.md.
# expose/, AGENTS.md und KI-Protokoll/ bleiben unberührt.
set -euo pipefail
wurzel="$(cd "$(dirname "$0")/../.." && pwd)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
curl -fsSL https://github.com/winf-hsos/pvp-kurs/archive/refs/heads/main.zip -o "$tmp/kurs.zip"
unzip -q "$tmp/kurs.zip" -d "$tmp"
neu="$(find "$tmp" -mindepth 1 -maxdepth 1 -type d | head -n 1)"
for ordner in kurs .opencode; do
  rm -rf "$wurzel/$ordner"
  cp -R "$neu/$ordner" "$wurzel/$ordner"
done
for datei in opencode.json README.md .gitignore; do
  [ -f "$neu/$datei" ] && cp "$neu/$datei" "$wurzel/$datei"
done
# AGENTS.md gehört der Gruppe: nur anlegen, wenn sie fehlt.
[ -e "$wurzel/AGENTS.md" ] || { cp "$neu/AGENTS.md" "$wurzel/AGENTS.md"; echo "neu: AGENTS.md"; }
# Neue Dateien im Exposé-Gerüst nur ergänzen, nie überschreiben.
(cd "$neu/expose" && find . -type f) | while read -r rel; do
  if [ ! -e "$wurzel/expose/$rel" ]; then
    mkdir -p "$(dirname "$wurzel/expose/$rel")"
    cp "$neu/expose/$rel" "$wurzel/expose/$rel"
    echo "neu im Exposé-Ordner: ${rel#./}"
  fi
done
echo "Kursordner aktualisiert. expose/, AGENTS.md und KI-Protokoll/ sind unverändert."
