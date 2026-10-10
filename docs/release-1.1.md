# Sora 1.1 — download controls and your library

Developed by Belu.

- **Pause / Resume:** available on download cards. Pausing stops the worker and keeps its partial files. Resume reuses the same card, destination, and files. Sources supporting byte ranges can continue from the saved offset; some sources may restart the transfer. Paused cards survive app restarts.
- **Cancel:** waits for the worker to exit, then removes that episode's video, fragments, and subtitle files. The cancelled card and artwork remain, with Retry available. New jobs use their own episode subfolder so cleanup cannot affect neighbouring downloads. Legacy shared-folder cleanup matches only that episode's known filenames. A cleanup failure is shown as an error.
- **Download location:** Downloads → Change folder, or About & storage → Change download folder. New jobs use the chosen folder; existing jobs keep their original destinations. Show files opens an individual job's location. Existing files are not moved.
- **Total watch time:** shown in Continue watching and Library & backups. Counts actual elapsed time during embedded playback, excluding pause, buffering, and seeking. Tracking begins with this version; older history and external mpv playback cannot be reconstructed.
- **Remove from watchlist:** a separate button appears beneath each saved poster and in title details. Removals are recorded so merging an older backup does not add the title back. Saving the title again overrides the removal.
- **Backups:** JSON exports include watch time, watchlist removals, and the chosen download-folder preference alongside the existing library and player preferences. Merging the same backup repeatedly does not duplicate watch time. Video files and the download queue are separate from library backups. On another computer, select a suitable folder if the saved path is unavailable.

Verification: 28 automated tests passed. Isolated Electron checks passed actual yt-dlp pause, HTTP Range resumption, process termination, cancellation file cleanup with thumbnail retention, destination selection, explicit watchlist removal, and backup fields. A real HLS fixture accrued about three seconds of watch time; pausing and seeking added none, and the measured counter appeared in the export. Poster hover-preview regression checks also passed. A library safety snapshot was saved before reopening the updated app.
