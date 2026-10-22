#!/usr/bin/env bash
# Rebuild the static website (site/) that Vercel serves, from web/soft-pulse.html
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p site/fonts && cp android/assets/fonts/* site/fonts/
python3 tools/build_index.py web/soft-pulse.html site/index.html
echo "site/index.html updated"
