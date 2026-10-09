# Sora — an artwork-first desktop companion for ani-cli

Version 0.1.0, local development preview. This is the first working foundation, not a finished release.

## Open

Double-click **Start Sora.cmd**. The desktop app opens with trending anime artwork from AniList.

- Discover: browse trending titles or filter the displayed selection by genre.
- Search: type a title in the top search bar and press Enter.
- Open a title: choose the matching streaming edition if no exact title match is found. Exact English/Japanese title matches are selected automatically.
- Episodes: choose Subtitled/Dubbed and quality, then click an episode number.
- Player: the embedded player uses ani-cli's resolved stream; Retry and Open in mpv are available if the embedded player cannot play it.
- Downloads: click Download episodes, pick a range of up to 50 episodes, and Add to queue. Each episode downloads sequentially. Downloads shows progress, cancellation and retry.
- My watchlist: save titles for later without an account.
- Continue watching: saves episode and embedded-player position locally. External mpv playback positions are not tracked.

Downloads are stored in Sora/downloads. Video files and English VTT subtitles share the same filename when available. If the requested quality is unavailable, ani-cli may choose the best available variant; the embedded player reports the resolved quality.

Closing the app stops active work. Interrupted downloads are marked for retry on the next launch; yt-dlp can reuse partial files. Partially downloaded files remain until resumed or removed manually. Downloads do not run as a background service.

## How it is built

- Electron desktop shell; local HTML, CSS and JavaScript with context isolation and sandboxing.
- AniList GraphQL for artwork/metadata; cached locally for one hour.
- An unmodified, pinned checkout of pystardust/ani-cli for source search, episode listing and stream extraction. bridge.sh loads upstream functions without running its terminal UI.
- HLS.js and a token-based localhost stream proxy for embedded playback and English subtitle tracks.
- yt-dlp for downloads, mpv for optional external playback.
- Existing Git Bash, Node.js and FFmpeg are reused. No system PATH or registry changes are needed.

All application data, browser profile, metadata caches, source and portable tools are inside Sora. This project does not read either of the removed apps' libraries or settings. Services can change or block requests, and some shows may have no playable source. Error states and retries are part of the interface; availability is never guaranteed.

## Develop

```powershell
# In this folder:
npm.cmd test
npm.cmd start
```

Dependencies are pinned in package-lock.json. The current dependencies and downloaded tools are already installed for this preview. The repository is local; nothing has been published.

The ani-cli bridge is tied to the pinned upstream function interfaces. Updating it requires running the resolver checks and playback tests again; there is no automatic upstream update that could silently change them.

## Uninstall

Close Sora and its mpv player, then open PowerShell in this folder:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\Uninstall.ps1 -WhatIf
powershell -NoProfile -ExecutionPolicy Bypass -File .\Uninstall.ps1
# To keep downloaded episodes in a sibling folder instead:
powershell -NoProfile -ExecutionPolicy Bypass -File .\Uninstall.ps1 -KeepDownloads
```

This removes the Sora folder including source, tools, watchlist, history and caches. Existing Git, Node.js and FFmpeg remain installed. No desktop/Start menu shortcut or Windows Installed Apps entry was created.

## Credits and licensing

Sora application code: GPL-3.0-or-later, following its ani-cli dependency. ani-cli's copyright/license are in vendor/ani-cli/LICENSE. Electron is MIT; HLS.js is Apache-2.0. mpv and yt-dlp include their upstream licenses in their distributions/source. Anime artwork belongs to its respective rights holders and is supplied by AniList; it is not claimed as original Sora artwork.

Sources: https://github.com/pystardust/ani-cli · https://docs.anilist.co · https://electronjs.org · https://github.com/video-dev/hls.js · https://github.com/yt-dlp/yt-dlp · https://mpv.io

## Verified in this preview
Seven automated unit checks passed. A separate hidden integration window verified AniList search, matching metadata to the ani-cli source, the 26-episode listing for Cowboy Bebop, watchlist saving, embedded playback advancing past two seconds, a real yt-dlp transfer, and cancellation. The download test was stopped at 0.1%; a complete episode download has not been verified. Test data and tiny partial files are isolated in work/ rather than the user's library/downloads. The uninstall WhatIf check passed; no uninstall was performed.

