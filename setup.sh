#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
for tool in node npm curl python3 sed grep; do
  command -v "$tool" >/dev/null || { printf 'Missing prerequisite: %s\nSee docs/INSTALL.md.\n' "$tool" >&2; exit 1; }
done
node -e 'if(Number(process.versions.node.split(".")[0])<24){console.error("Node.js 24 or newer is required.");process.exit(1)}'
revision=21ed4a0a6354688622b5a967d93ba96d851d0ef2
mkdir -p vendor/ani-cli tools
for file in ani-cli LICENSE; do
  if [[ ! -s "vendor/ani-cli/$file" ]]; then
    curl -fL --retry 3 "https://raw.githubusercontent.com/pystardust/ani-cli/$revision/$file" -o "vendor/ani-cli/$file.tmp"
    mv -- "vendor/ani-cli/$file.tmp" "vendor/ani-cli/$file"
  fi
done
if [[ ! -s tools/yt-dlp ]]; then
  curl -fL --retry 3 'https://github.com/yt-dlp/yt-dlp/releases/download/2026.08.19/yt-dlp' -o tools/yt-dlp.tmp
  mv -- tools/yt-dlp.tmp tools/yt-dlp
fi
chmod +x tools/yt-dlp
npm ci
# Ensure Electron is present even when npm defers dependency lifecycle scripts.
node node_modules/electron/install.js
printf '\nSetup complete. Ensure FFmpeg is installed, then run: npm start\n'
