# Sora

An artwork-first Windows anime desktop app, developed by **Belu**.

**Built using the original [pystardust/ani-cli](https://github.com/pystardust/ani-cli).** Sora provides a custom Electron interface and built-in player around ani-cli's search, episode listing, and stream resolution functions. Those functions come from the original, unmodified upstream script—not an independently written streaming engine. This is an independent project and is not an official ani-cli release.

![Sora Discover](docs/final-home.png)

## Features

- AniList artwork, daily discovery, relationships, and airing schedule.
- Built-in player with fullscreen, quality selection, playback speed, and subtitle settings.
- Episode downloads with pause/resume, cancellation, and destination selection.
- Offline playback and saved or imported subtitles in the same player.
- Watchlist, resume history, total watch time, and portable library backups.

## Install on Windows

Install **Node.js 24+**, **Git for Windows** (Git Bash), and **FFmpeg**. Make `ffmpeg` available on PATH, or set `SORA_FFMPEG_DIR` to its `bin` folder. If Git is installed outside its standard location, set `SORA_BASH` to `bash.exe`.

Clone this repository, open PowerShell in its folder, then run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\Setup.ps1
npm.cmd start
```

Setup installs the locked npm dependencies, downloads the pinned original ani-cli script and its license, and installs a pinned Windows yt-dlp executable. It does not install FFmpeg or change the system PATH. Review `Setup.ps1` before running it. Optional external mpv playback requires your own mpv distribution at `tools/mpv/mpv.exe`; the built-in player works without it.

After setup, you can also double-click **Start Sora.cmd**. See [the user guide](READ%20ME.md), [download controls](docs/release-1.1.md), and [offline playback](docs/offline-playback.md).

Application data lives in `data/`; downloads default to `downloads/`. Both are excluded from Git. Library backups exclude video files. Back up your library and videos before uninstalling; `Uninstall.ps1 -WhatIf` previews removal.

## Original ani-cli attribution

- Original project: **[pystardust/ani-cli](https://github.com/pystardust/ani-cli)**, by its upstream authors and contributors.
- Pinned upstream revision: [`21ed4a0a6354688622b5a967d93ba96d851d0ef2`](https://github.com/pystardust/ani-cli/tree/21ed4a0a6354688622b5a967d93ba96d851d0ef2), version 5.1.5.
- [`bridge.sh`](bridge.sh) loads upstream functions without launching the terminal interface. Setup places the unmodified script and upstream license in `vendor/ani-cli/`.
- Sora application code is **GPL-3.0-or-later**; see [LICENSE](LICENSE). Preserve upstream copyright and license notices when redistributing.
- Artwork and metadata come from [AniList](https://anilist.co/) and their respective rights holders. Electron, HLS.js, yt-dlp, FFmpeg, and optional mpv retain their own licenses.

## Development and verification

```powershell
npm.cmd test
npm.cmd start
```

Version 1.1.1 has 31 passing unit tests, plus local Electron integration checks for downloads, offline playback, subtitles, library controls, and watch time. Integration scripts under `tests/` use isolated fixture data and may require additional local fixtures. External sources can change; these checks do not guarantee every title or source will work.
