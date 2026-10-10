#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
unset ELECTRON_RUN_AS_NODE
exec ./node_modules/.bin/electron . "$@"
