# Sora 1.0.1 — downloads and reference flows

Developed by Belu. Checked 10 October 2026.

Cancellation now covers queued episodes, source preparation, and active transfers. Preparation uses its own abortable process rather than a shared playback lookup. Cancellation terminates the process tree and waits for exit before the queue proceeds. Late progress cannot revive a cancelled job. Progress updates preserve the Cancel button's DOM node, preventing redraws from interrupting a click. Errors now take priority over percentage text. Retry keeps the downloader's partial files for resumption where the source supports it.

Verification: 25 automated tests passed, including an actual yt-dlp transfer from a controlled local HTTP server. Cancellation closed that connection, stopped the downloader, and preserved its .part file. A separate test confirmed child-process termination. An isolated Electron test passed queued cancellation, cancellation during preparation, queue advancement, repeated cancellation, and button stability. Preparation cancellation and queue advancement took 7.9 seconds on this machine. The live integration passed playback, subtitles, quality controls, speed, fullscreen, and episode autoplay, but the remote download received no progress before its timeout. Full remote episode completion is not claimed.

## Reference sites explored

- [Re:ANIME episode page](https://reanime.to/watch/rilakkuma-sxskcu?ep=1): playback started and autoplay advanced to episode two. Inspected SUB/DUB server buttons, theater mode, auto-next, auto-skip, shortcuts, episode search, list/grid toggle, spoiler shield, and recommendations. Returning home showed a guest Continue Watching card for episode two at 1:03/1:30, including Play and Remove controls. Its View all link targets /continue-watching; direct navigation returned to the homepage in this guest session, so a standalone history page was not verified.
- [Anikoto episode page](https://anikototv.to/watch/rilakkuma-qvmgp/ep-1): opened the player overlay and loaded its embedded video player, which reported a 1:30 duration but remained at zero seconds. Explored episode-number search/ranges, SUB/DUB filtering, alternate servers, Auto Play/Next/Skip, Light/Expand, previous/next, related titles, and the download menu. Sign in opened a username/password and CAPTCHA dialog. Account history was not verified.
- [Miruro](https://www.miruro.to/): Cloudflare security verification prevented access to its application. No player or history claims.

Useful future additions: explicit Resume and Remove controls with elapsed/total time on Sora history cards; spoiler-safe episode previews; a shortcut reference; clearer preparing/buffering states. These are observations for future work, not features added in this patch.
