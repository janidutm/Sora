# Sora 1.1.1 — watch your downloads

Developed by Belu.

Open **Downloads → Watch offline** on a completed episode. It plays the saved video in Sora Cinema, with seeking, volume, speed, fullscreen, picture in picture, subtitles, resume position, and watch-time tracking. Previous/Next and the episode selector use downloaded episodes from the same title/audio edition. Offline playback never resolves an online stream. The quality label reports the saved video's resolution; downloading one file does not create additional quality variants.

New downloads save the source's available subtitle tracks alongside the video, converting supported SRT tracks to VTT. The card displays the number of saved tracks. The player keeps its subtitle language, size, colour, background, position, and timing controls.

For existing downloads, Sora discovers matching VTT/SRT sidecars and makes one background attempt to fetch missing captions. **Fetch subtitles** retries using the source, without downloading the video again. **Add subtitles** copies a local SRT/VTT file into that episode's folder, so it remains available after restarting and disconnecting. A source may supply no subtitles or fail to respond; the card explains this instead of claiming captions were saved. Subtitle files and video files stay together and are separate from JSON library backups.

Verification: all 31 automated tests passed. The Electron integration downloaded a valid MP4 plus SRT captions, shut down the source server and blocked external HTTPS, then played the downloaded video with its caption overlay visible. Local range requests, seeking, fullscreen, saved resume position, and persistent manual subtitles passed. Download pause/resume/cancellation regression checks also passed. The screenshot uses a generated test pattern to verify playback and captions without relying on a remote stream.
