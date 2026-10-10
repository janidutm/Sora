$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$revision = '21ed4a0a6354688622b5a967d93ba96d851d0ef2'
$vendorPath = Join-Path $PSScriptRoot 'vendor/ani-cli'
$toolsPath = Join-Path $PSScriptRoot 'tools'
New-Item -ItemType Directory -Force -Path $vendorPath, $toolsPath | Out-Null
foreach ($file in @('ani-cli', 'LICENSE')) {
    $destination = Join-Path $vendorPath $file
    if (!(Test-Path -LiteralPath $destination)) {
        Invoke-WebRequest -Uri "https://raw.githubusercontent.com/pystardust/ani-cli/$revision/$file" -OutFile $destination
    }
}
$downloader = Join-Path $toolsPath 'yt-dlp.exe'
if (!(Test-Path -LiteralPath $downloader)) {
    Invoke-WebRequest -Uri 'https://github.com/yt-dlp/yt-dlp/releases/download/2026.08.19/yt-dlp.exe' -OutFile $downloader
}
& npm.cmd ci
if ($LASTEXITCODE -ne 0) { throw 'npm ci failed.' }
& node node_modules/electron/install.js
if ($LASTEXITCODE -ne 0) { throw 'Electron installation failed.' }
Write-Host 'Sora dependencies are ready. Ensure Git Bash and FFmpeg are installed, then run npm.cmd start.'
