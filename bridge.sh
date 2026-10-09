#!/usr/bin/env bash
# Load the pinned upstream functions without entering its terminal UI.
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
UPSTREAM="$ROOT/vendor/ani-cli/ani-cli"
source <(sed '/^# MAIN$/,$d' "$UPSTREAM")
source <(sed -n '/^# setup$/,/^mode=/p' "$UPSTREAM" | sed '$d')
curl_exe=curl
cipher_flag=""
case "$1" in
  search) hianime_search "$2" ;;
  episodes) hianime_episodes "$2" ;;
  resolve)
    episode_maps="$6"
    [ -n "$episode_maps" ] || episode_maps=$(hianime_episodes "$2") || exit 1
    hianime_m3u8 "$3" "$4" || die 'No playable source for this episode/audio. Try another title or Sub/Dub.'
    select_quality "$5"
    printf 'MASTER\t%s\nMETA\t%s\n' "$_m3u8_master" "$_json"
    printf 'VIDEO\t%s\nREFERRER\t%s\nSUBTITLE\t%s\nQUALITY\t%s\n' "$video_link" "$refr" "$sub_link" "${_result%%>*}"
    ;;
  *) die 'Unknown bridge operation' ;;
esac
