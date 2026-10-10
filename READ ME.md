# Sora — an artwork-first desktop companion for ani-cli

Version 1.1.1, local desktop release. Developed by **Belu**.

## Open

Double-click **Start Sora.cmd**. The desktop app opens with trending anime artwork from AniList.

- Discover: spotlight recommendations slide every five seconds. Use arrows, dots, or Pause; hovering or focusing pauses the carousel. Trending, recent popular, and upcoming sections refresh daily, with cached results available while a refresh runs.
- Spotlight artwork uses AniList banners for the exact season entry, prioritizing titles with landscape banners. A poster is contained rather than stretched when no banner is available. Hover or keyboard-focus a smaller anime poster card to show an expanded preview with artwork, synopsis, genres, status, episode count, and title. The large spotlight keeps its normal size.
- Search: type a title in the top search bar and press Enter.
- Open a title: posters open details without playing, including posters in viewing history. Sora automatically matches the streaming edition using English/Japanese titles and aliases. Use Connection details → Reconnect if the source is unavailable.
- Episodes: click an episode to autoplay immediately. Filter episode numbers, use Start watching/Continue watching, or jump to another episode inside the player.
- Sora Cinema: adaptive quality plus available source resolutions, playback speed, volume/mute, seeking, fullscreen, picture in picture, previous/next, and optional auto-next. Expand Playback & subtitle settings to choose a track, size, colour, background, position, timing offset, or a local SRT/VTT file. Space pauses, arrows seek 10 seconds, F toggles fullscreen, M mutes. Retry and mpv fallback remain available.
- Playback quality is directly beside the fullscreen controls. Best pins the highest available resolution (and bitrate at that resolution); Auto adapts to the connection. Pick an available resolution to switch during playback without restarting. The adjacent label shows the decoded video height. Your player quality choice is saved. A source offering only one resolution cannot provide additional resolutions.
- Downloads: use the download button beneath any episode, or click Download episodes, pick a range of up to 50 episodes, and Add to queue. Each episode downloads sequentially. Collection cards show cached artwork, clickable anime titles, progress, pause/resume, cancellation and retry. Saved offline means the completed video still exists in the downloads folder. Open folder accesses your saved videos.
- Connection: the top bar shows online/offline status, checked periodically. Click it to recheck. Saved title details remain accessible offline; new searches and streams require a connection.
- My watchlist: save titles and track Planned, Watching, Completed, On-hold, and Dropped. Filter your library by status.
- Navigation: use the top-left arrows or Alt+Left/Right to return to a previous page with its search, episode page, and scroll position.
- Airing schedule: preview the next 50 broadcasts within the coming seven days, grouped in your local timezone. Broadcast times are separate from streaming availability.
- Surprise me: open a random released title from Discover.
- Continue watching: saves episode and embedded-player position locally. External mpv playback positions are not tracked.

Downloads default to Sora/downloads, with a separate subfolder per new episode. Use Downloads → Change folder to choose a new destination. Existing jobs keep their original locations. Video files and English VTT subtitles share the same filename when available. If the requested quality is unavailable, ani-cli may choose the best available variant; the player offers Auto plus the resolutions actually advertised by the stream.

Closing the app stops active work. Interrupted downloads are marked for retry on the next launch; yt-dlp can reuse partial files. Pause keeps partial files for Resume; Cancel deletes the episode's files and keeps its thumbnail card. Paused jobs remain paused after reopening. Downloads do not run as a background service.

## How it is built

- Electron desktop shell; local HTML, CSS and JavaScript with context isolation and sandboxing.
- AniList GraphQL for artwork/metadata; catalogue cached locally for one hour, with stale results shown immediately while refreshing. Related anime appear below the episode panel.
- Source and episode lookups are cached and deduplicated for ten minutes in each session. Resolved streams are reused for 90 seconds. Playback reuses the existing episode map.
- Automatic title matching handles punctuation, source labels, aliases, and known split-season entries. Numeric season mismatches are excluded. Unreleased entries explain their status.
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
# Sora 0.3 — Developed by Belu

## Portable library backups

Open **Library & backups** in the sidebar.

1. **Export library backup** opens a Save dialog. The suggested destination is Documents, outside the application folder. Choose any location, including a USB drive or a synced folder you manage yourself.
2. **Import a backup** reads and validates a Sora version 1 JSON backup, then previews its title/history/status counts.
3. **Merge library** deduplicates titles and keeps the newest playback record per anime. Imported statuses and player options take precedence. **Replace library** uses only the imported backup.
4. Before applying either restore, Sora writes a safety copy to `data/restore-snapshots`. Those files can be imported using the same dialog. A pre-upgrade library copy is in `data/upgrade-snapshots`.

Backups include saved titles, watch statuses, watch history with episode/position, audio/quality preferences, and subtitle/playback settings. They exclude videos, browser caches, and signed streaming URLs. JSON files remain local until you copy them elsewhere. Limits: 300 saved titles, 100 recent history records, and 5 MB per backup. A merge exceeding the title limit is rejected without changing the library. Downloaded videos must be copied separately. Account syncing is not included.

## Sora Cinema

Fullscreen uses the Electron desktop window API. F, F11, double-click, or the fullscreen button toggles it. Escape leaves fullscreen while keeping the player open; Escape again closes the player. Fullscreen stays active between episodes. Controls fade away after mouse inactivity during fullscreen playback; move the mouse to reveal them. Settings remain accessible in fullscreen.

The player remembers speed, volume, caption size/colour/background/position/offset, auto-next, and the configurable skip-button duration. The skip button jumps the configured number of seconds; it does not detect actual opening timestamps. Original/dubbed editions can be changed in player settings. Clicking an episode starts playback without a second Play click.

## Navigation and discovery

Back/forward arrows and Alt+Left/Right restore page state and scroll position. Watchlist statuses help separate watching, planned, completed, on-hold, and dropped titles. Episode search works across all episodes, rather than only the visible page. The airing schedule previews the next 50 broadcasts within seven days, using your local timezone. Surprise me opens a released title from Discover. Titles are matched automatically; the manual title chooser has been removed.

## Verification

Twenty-two unit tests and six Electron integration suites passed for this release. Every spotlight action was visible and clickable at 1000×700, 1420×930, and 1920×1080, including long JoJo titles. Checks covered poster hover previews, daily discovery, offline title links, backups and safety snapshots, navigation, airing schedule, episode-click autoplay, fullscreen, subtitles, speed, Best/Auto/manual quality, and download transfer/cancellation. A controlled two-resolution video verified switching without losing playback position. Application screenshots were reviewed. The uninstall script was checked in WhatIf mode without removing files.

These checks used isolated test data. Download transfer and cancellation were checked with a small partial download; full episodes and every external streaming source were not exhaustively tested. Details are in docs/final-verification.json.

The loading constellation is original CSS animation, with reduced-motion support. Artwork remains credited to AniList and its respective rights holders. Sora's developer credit is Belu. Feature references include [Re:ANIME's schedule](https://reanime.to/schedule) and [watchlist export/import](https://reanime.to/profile). Fullscreen and autoplay follow [Electron's BrowserWindow API](https://www.electronjs.org/docs/latest/api/browser-window).


## New in 1.1

See [download and library controls](docs/release-1.1.md) for Pause/Resume, cancellation cleanup, download folder selection, total watch time, explicit watchlist removal, and their backup behavior. Tracking starts with this version. The current checks include 28 automated tests and Electron transfer, watch-time, and poster-preview checks.

## Watch downloaded episodes

Use Downloads → Watch offline to play saved videos in Sora Cinema. Available subtitles save with new downloads. Fetch subtitles repairs older downloads; Add subtitles permanently saves a local SRT/VTT alongside the episode. See [offline playback](docs/offline-playback.md) for details and the 31-test verification.
