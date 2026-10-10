# Install Sora

Sora is a desktop application developed by **Belu**, built using the original [pystardust/ani-cli](https://github.com/pystardust/ani-cli). It currently runs from source; there are no official Sora installers, APKs, or mobile apps.

## Devices

| Device | Availability |
| --- | --- |
| Windows 10/11, 64-bit PC | Supported source setup; tested on Windows |
| Linux desktop, x86-64 | Source setup provided; Linux verification notes below |
| Linux desktop, ARM64 | Source setup is architecture-independent, but not tested on ARM64 hardware |
| macOS | Experimental: Electron supports macOS, but Sora has not been validated there |
| Chromebook | Possible only with its Linux development environment and a graphical session; untested |
| Android / iPhone / iPad | Not supported by this Electron desktop application |
| Headless Linux server | Unit tests can run; the GUI needs a desktop/display server |

Check [Electron's platform notes](https://www.electronjs.org/docs/latest/breaking-changes) for current architecture requirements. Sora does not provide a browser-hosted or account-sync version.

## Windows

1. Install [Node.js 24 or newer](https://nodejs.org/en/download) with npm, [Git for Windows](https://git-scm.com/downloads/win), and [FFmpeg](https://ffmpeg.org/download.html). Use 64-bit builds.
2. Make FFmpeg available on PATH, or set `SORA_FFMPEG_DIR` to the folder containing `ffmpeg.exe`. Sora also detects `%USERPROFILE%\ffmpeg\bin`.
3. Open PowerShell in a location you own, such as Documents:

```powershell
git clone https://github.com/janidutm/Sora.git
cd Sora
powershell -NoProfile -ExecutionPolicy Bypass -File .\Setup.ps1
npm.cmd start
```

Read Setup.ps1 before executing it. The execution-policy override applies only to that PowerShell process. Setup downloads the pinned original ani-cli script/license and yt-dlp, then runs `npm ci`. Git Bash supplies the shell utilities used by the upstream bridge.

Later, double-click **Start Sora.cmd** or run `npm.cmd start` from the Sora folder. If Git is installed in a custom location:

```powershell
$env:SORA_BASH = 'D:\Apps\Git\bin\bash.exe'
$env:SORA_FFMPEG_DIR = 'D:\Apps\ffmpeg\bin'
npm.cmd start
```

## Linux: Ubuntu / Debian

Install basic dependencies with your distribution package manager:

```bash
sudo apt update
sudo apt install git curl bash python3 ffmpeg libgtk-3-0 libnss3 libgbm1 libasound2t64
```

On older distributions, the audio package may be named `libasound2` instead of `libasound2t64`. Install Node.js **24+ with npm** using the [official Node.js download instructions](https://nodejs.org/en/download); distribution repositories may ship an older major version. Check before continuing:

```bash
node --version
npm --version
ffmpeg -version
git clone https://github.com/janidutm/Sora.git
cd Sora
bash setup.sh
npm start
```

Run Sora as your regular user from a writable folder in your home directory. Setup installs the pinned original ani-cli script/license, portable Python-based yt-dlp, and locked npm dependencies. It requires Python 3. It does not use sudo, install system packages, or modify your shell configuration.

To launch later, run `bash start-sora.sh` from the repository. Keep Node/npm available in that shell. A graphical Linux desktop is required; Wayland and X11 compatibility depends on your Electron/desktop setup.

## Other Linux distributions

Install Node.js 24+, npm, Git, Bash, curl, Python 3, FFmpeg, and the libraries required by Electron through your distribution's package manager. Then use the same clone/setup/start commands above. GNU sed, grep, coreutils, and base64 must be present. The bridge uses GNU-compatible text processing.

For Fedora, the basic packages are `git curl bash python3 nodejs npm gtk3 nss mesa-libgbm alsa-lib`; FFmpeg availability depends on your configured repositories. For Arch, they include `git curl bash python nodejs npm ffmpeg gtk3 nss alsa-lib`. Verify the Node major version after installation. Distribution-specific commands and desktop behavior have not been tested across every release.

## macOS (experimental)

Install Node.js 24+, npm, Git, curl, Python 3, FFmpeg, and **GNU sed**. The system BSD sed may behave differently from the upstream bridge's expectations; put GNU sed's `gnubin` directory on PATH. Then clone the repository and run `bash setup.sh` and `npm start`. This route is provided for developers to try; macOS playback and downloads have not been verified.

## Your username

On first launch, enter a local username of up to 32 characters. Your profile button shows its initial; click the button to change your name anytime. Choosing Later keeps a neutral question mark and prompts again next launch. The name stays on your computer and is included in library backups. It is a display preference, not an online account or password. Developer credits continue to name Belu.

## Troubleshooting

- **Missing Bash / FFmpeg / yt-dlp:** verify the dependency is installed and visible to the terminal that launches Sora. You can override tool paths using the variables below.
- **Missing ani-cli:** rerun the setup script. Its pinned source belongs at `vendor/ani-cli/ani-cli`.
- **Electron sandbox failure on Linux:** use a supported desktop distribution and follow its Electron/Chromium sandbox policy. Do not run Sora as root or routinely disable the sandbox. Ubuntu AppArmor policies may require a distro-specific adjustment for locally installed Electron applications.
- **Blank window or shared-library error:** install the GTK/NSS/GBM/audio runtime libraries for your distribution. A headless SSH session cannot display the app without a graphical session.
- **WSL:** use a Linux clone in your WSL home, with its own Linux `node_modules`; do not reuse Windows `node_modules`. GUI launch requires WSLg or another configured display server.
- **A stream fails:** retry, change the audio edition, or check another episode. Upstream sources can be unavailable, blocked, or changed. Quality and subtitles are limited by what the source actually supplies.
- **Offline subtitles:** use Downloads → Fetch subtitles or Add subtitles; imported SRT/VTT files are saved beside the episode. Some sources provide no captions.

| Variable | Value |
| --- | --- |
| `SORA_BASH` | Full path to Bash |
| `SORA_FFMPEG_DIR` | Directory containing FFmpeg |
| `SORA_YTDLP` | Full path to a yt-dlp executable |
| `SORA_MPV` | Full path to optional mpv |

Windows PowerShell: `$env:SORA_YTDLP = 'D:\Tools\yt-dlp.exe'`. Linux shell: `export SORA_YTDLP=/opt/tools/yt-dlp`. Variables apply to the launching shell and its child processes. mpv is optional; Sora's built-in player is the default.

## Update, backup, and uninstall

Close Sora before updating. Export your library through **Library & backups**, and copy downloaded videos separately. Then run `git pull --ff-only` and the setup script again. Locally edited source files may need to be committed or stashed before pulling. Setup preserves existing vendor/tool files; it does not silently upgrade the pinned tools.

Data is stored in `data/`, and downloads default to `downloads/`; both are ignored by Git. A custom download location can be chosen in Downloads. Exported library backups contain lists, history, watch time, removal history, and preferences, but not downloaded video files or the download queue. A saved download-directory path may need changing after moving between operating systems.

On Windows, preview uninstall with `Uninstall.ps1 -WhatIf` and read its help before running it. `-KeepDownloads` preserves default downloads in a sibling folder. On Linux/macOS, close Sora, export your library, move any downloads you wish to keep, and remove the exact cloned Sora folder through your file manager. System dependencies installed separately remain installed. Custom download folders outside Sora remain separate.

## Verification

Run `npm test` after setup. Tests cover platform tool resolution, cancellation, local media seeking, subtitle conversion, backups, and library state. Full GUI and external-source playback coverage varies by operating system; see [Linux verification](linux-verification.md) for the recorded Linux checks.
