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

Sixteen unit tests passed, including backup round-trip, latest-progress merging, replacement, validation, and automatic season matching. Live Electron checks passed for episode-click autoplay, playing fullscreen, Escape keeping the player open, subtitle cues, speed controls, downloads/cancellation, navigation back/forward, backup export/import, restore safety snapshots, and the airing schedule. These checks used isolated data and small partial downloads. Full episode downloads and every streaming source are not exhaustively tested. Manual visual review was blocked by the Windows helper error “foreground window did not report a process id.”

The loading constellation is original CSS animation, with reduced-motion support. Artwork remains credited to AniList and its respective rights holders. Sora's developer credit is Belu. Feature references include [Re:ANIME's schedule](https://reanime.to/schedule) and [watchlist export/import](https://reanime.to/profile). Fullscreen and autoplay follow [Electron's BrowserWindow API](https://www.electronjs.org/docs/latest/api/browser-window).
