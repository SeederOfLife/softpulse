#!/usr/bin/env bash
# Rebuild the static website (site/) that Vercel serves, from web/soft-pulse.html
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p site/fonts && cp android/assets/fonts/* site/fonts/
python3 tools/build_index.py web/soft-pulse.html site/index.html
# home-screen / full-screen web app tags (website only)
python3 - <<'PY'
p='site/index.html'; s=open(p).read()
tags=('<link rel="manifest" href="manifest.webmanifest">'
      '<link rel="apple-touch-icon" href="apple-touch-icon.png">'
      '<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">'
      '<meta name="apple-mobile-web-app-capable" content="yes">'
      '<meta name="mobile-web-app-capable" content="yes">'
      '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'
      '<meta name="apple-mobile-web-app-title" content="Soft Pulse">'
      '<meta name="theme-color" content="#1c1b19">')
if 'rel="manifest"' not in s: s=s.replace('<meta name="color-scheme" content="light dark">','<meta name="color-scheme" content="light dark">'+tags,1)
assert 'rel="manifest"' in s
open(p,'w').write(s)
PY
echo "site/index.html updated"
