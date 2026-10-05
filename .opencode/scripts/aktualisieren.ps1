# Holt die neueste Fassung des Kursordners von GitHub.
# Ersetzt kurs/, .opencode/, opencode.json und README.md.
# expose/, AGENTS.md und KI-Protokoll/ bleiben unberührt.
$ErrorActionPreference = 'Stop'
$wurzel = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$quelle = 'https://github.com/winf-hsos/pvp-kurs/archive/refs/heads/main.zip'
$tmp = Join-Path ([IO.Path]::GetTempPath()) ("pvp-kurs-" + [guid]::NewGuid().ToString('N').Substring(0, 8))
New-Item -ItemType Directory $tmp | Out-Null
try {
    Invoke-WebRequest -Uri $quelle -OutFile (Join-Path $tmp 'kurs.zip') -UseBasicParsing
    Expand-Archive (Join-Path $tmp 'kurs.zip') -DestinationPath $tmp
    $neu = Get-ChildItem $tmp -Directory | Select-Object -First 1
    foreach ($ordner in 'kurs', '.opencode') {
        $ziel = Join-Path $wurzel $ordner
        if (Test-Path $ziel) { Remove-Item $ziel -Recurse -Force }
        Copy-Item (Join-Path $neu.FullName $ordner) $ziel -Recurse
    }
    foreach ($datei in 'opencode.json', 'README.md', '.gitignore') {
        $q = Join-Path $neu.FullName $datei
        if (Test-Path $q) { Copy-Item $q (Join-Path $wurzel $datei) -Force }
    }
    # AGENTS.md gehört der Gruppe: nur anlegen, wenn sie fehlt.
    if (-not (Test-Path (Join-Path $wurzel 'AGENTS.md'))) { Copy-Item (Join-Path $neu.FullName 'AGENTS.md') (Join-Path $wurzel 'AGENTS.md'); "neu: AGENTS.md" }
    # Neue Dateien im Exposé-Gerüst nur ergänzen, nie überschreiben.
    $neuExpose = Join-Path $neu.FullName 'expose'
    Get-ChildItem $neuExpose -Recurse -File | ForEach-Object {
        $rel = $_.FullName.Substring($neuExpose.Length + 1)
        $ziel = Join-Path (Join-Path $wurzel 'expose') $rel
        if (-not (Test-Path $ziel)) {
            New-Item -ItemType Directory -Force (Split-Path $ziel) | Out-Null
            Copy-Item $_.FullName $ziel
            "neu im Exposé-Ordner: $rel"
        }
    }
    "Kursordner aktualisiert. expose/, AGENTS.md und KI-Protokoll/ sind unverändert."
}
finally {
    Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
}
