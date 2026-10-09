# Sora — an artwork-first desktop companion for ani-cli

Version 0.2.0, local development preview.

## Open

Double-click **Start Sora.cmd**. The desktop app opens with trending anime artwork from AniList.

- Discover: browse trending titles or filter the displayed selection by genre.
- Search: type a title in the top search bar and press Enter.
- Open a title: choose the matching streaming edition if no exact title match is found. Exact English/Japanese title matches are selected automatically.
- Episodes: choose Subtitled/Dubbed and quality, then click an episode number.
- Sora Cinema: adaptive quality plus available source resolutions, playback speed, volume/mute, seeking, fullscreen, picture in picture, previous/next, and optional auto-next. Expand Playback & subtitle settings to choose a track, size, colour, background, position, timing offset, or a local SRT/VTT file. Space pauses, arrows seek 10 seconds, F toggles fullscreen, M mutes. Retry and mpv fallback remain available.
- Downloads: use the download button beneath any episode, or click Download episodes, pick a range of up to 50 episodes, and Add to queue. Each episode downloads sequentially. Downloads shows progress, cancellation and retry.
- My watchlist: save titles for later without an account.
- Continue watching: saves episode and embedded-player position locally. External mpv playback positions are not tracked.

Downloads are stored in Sora/downloads. Video files and English VTT subtitles share the same filename when available. If the requested quality is unavailable, ani-cli may choose the best available variant; the player offers Auto plus the resolutions actually advertised by the stream.

Closing the app stops active work. Interrupted downloads are marked for retry on the next launch; yt-dlp can reuse partial files. Partially downloaded files remain until resumed or removed manually. Downloads do not run as a background service.

## How it is built

- Electron desktop shell; local HTML, CSS and JavaScript with context isolation and sandboxing.
- AniList GraphQL for artwork/metadata; catalogue cached locally for one hour, with stale results shown immediately while refreshing. Related anime appear below the episode panel.
- Source and episode lookups are cached and deduplicated for ten minutes in each session. Resolved streams are reused for 90 seconds. Playback reuses the existing episode map.
- Title matching ignores punctuation and source labels while refusing ambiguous editions. Search sources accepts alternate or shortened titles. Unreleased entries explain their status.
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

## Version 0.2 verification

Eleven unit tests pass. Live Electron checks passed for playback, loaded subtitle cues, speed changes, available-quality menu, relationships, per-episode download buttons, download transfer and cancellation. A cached episode lookup took 1 ms in the local test. JoJo Steel Ball Run 2nd Stage returned three episodes and resolved episode 1 to a 1080p stream. Full episode download, PiP/fullscreen interactions and every source title are not exhaustively tested. Source quality and subtitle languages depend on availability.

Player quality switching follows the HLS API: https://hlsjs.video-dev.org/api-docs/hls.js.hls.currentlevel

The combined AniList entry “2nd–3rd Stage” (210482) maps to the verified provider edition named “2nd Stage.” A separate live test passed this mapping and the three-episode listing.
