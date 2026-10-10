# Linux support verification

Sora uses platform-aware Bash, yt-dlp, FFmpeg, and optional mpv paths. Unix child processes start in their own process groups so cancellation can terminate a downloader and its descendants without targeting unrelated processes. Windows retains taskkill-based tree termination.

The Linux setup downloads the same pinned original ani-cli source used on Windows and the Python yt-dlp distribution. It installs Linux Electron through npm rather than copying Windows dependencies. `start-sora.sh` launches the installed Linux Electron binary.

## Results for 1.2.0

Tested on Ubuntu 24.04 x86-64 under WSL with WSLg, Node.js 24.15.0, and Electron 44.7.0, using a separate Linux installation and isolated fixture library.

- Linux setup fetched the pinned original ani-cli script/license and yt-dlp successfully; locked npm dependencies installed successfully.
- All **34 tests passed on both Windows and Linux**, including real partial yt-dlp transfer cancellation, descendant process termination, subtitle conversion, local HTTP ranges, and backup/library controls.
- Linux Electron launched with its sandbox enabled. No `--no-sandbox` override was used.
- The Linux offline integration suite passed: download saves subtitles; built-in playback without the source server/internet; caption overlay; seeking ranges; seek/fullscreen; saved resume; persistent imported subtitles.
- Bash syntax checks passed for setup, launcher, and the upstream bridge.

See [the integration report](linux-offline-verification.json) and [Linux player screenshot](linux-offline-player.png).

WSL reported no ALSA sound device during this run; video playback and subtitle assertions passed, but audible sound output was not verified. Native Linux desktop hardware, ARM64 Linux, macOS, Chromebooks, and mobile devices have not been tested. Live streaming-source availability was not exhaustively retested on Linux; the offline fixture test avoids depending on external streaming services.
