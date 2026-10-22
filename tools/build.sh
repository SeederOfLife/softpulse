#!/usr/bin/env bash
# Build SoftPulse-<version>.apk from web/soft-pulse.html
# needs: python3, node (+ apk-signer deps for tools/sign.mjs), aapt2, an android framework jar/apk (FW), classes.dex
# usage: VERSION=4.3 CODE=34 FW=path/to/android.jar AAPT2=aapt2 DEX=path/to/classes.dex tools/build.sh
set -euo pipefail
cd "$(dirname "$0")/.."
: "${VERSION:?set VERSION}"; : "${CODE:?set CODE}"; : "${FW:?set FW}"; : "${DEX:?set DEX}"; AAPT2=${AAPT2:-aapt2}
mkdir -p build
python3 tools/build_index.py web/soft-pulse.html android/assets/index.html
"$AAPT2" compile --dir android/res -o build/res.zip
"$AAPT2" link -o build/unsigned.apk -I "$FW" --manifest android/AndroidManifest.xml \
  --min-sdk-version 24 --target-sdk-version 34 --version-code "$CODE" --version-name "$VERSION" -A android/assets build/res.zip
cp "$DEX" build/classes.dex && (cd build && zip -q -j unsigned.apk classes.dex)
node tools/sign.mjs build/unsigned.apk "build/SoftPulse-$VERSION.apk"
echo "built build/SoftPulse-$VERSION.apk"
