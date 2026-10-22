# Soft Pulse

A metronome and a precision chime tuner in one app — built for tuning six-tube wind chimes in a workshop, usable for any instrument.

- **Web:** `web/soft-pulse.html` is the whole app in one file (open it in a browser).
- **Android:** the same page wrapped in a small WebView app (`android/`), built into `SoftPulse-<version>.apk`.

## Tuner
- 0.01 ¢ display, 440 / 432 Hz switch, peak (FFT) and pitch modes.
- Short rings (0.2–0.5 s) are caught; workshop noise (brushes, grinders, motors) is learned and ignored.
- Six chime tiles fill automatically; the workshop's chime cards (G major, A/D minor, F♯ minor, …) are recognised.
- Octave pairs: the upper note's target is the lower note + 0.5 ¢ (setting), with a live gap meter and "Octave locked".
- Whole-chime check on demand.
- **Hz map:** a page of frequencies from physics, brain research, archaeoacoustics, tuning history, Cousto's planetary tones, solfeggio and chakras, each with an evidence badge. A label appears on the tuner when a sound is close to one.

## Metronome
Music-style tempo picks, 4/8/16/32 subdivisions, real drum and instrument sounds, timer.

## Website (Vercel)
`site/` is the ready-to-serve website (`site/index.html` + local fonts), and `vercel.json` tells Vercel to serve it.
Import this GitHub repo once in Vercel (no framework, no build command); every push then redeploys automatically.
After changing `web/soft-pulse.html`, run `tools/build_site.sh` and commit `site/`.
HTTPS (which Vercel provides) is required for the microphone.

## Build the APK
```
VERSION=4.3 CODE=34 FW=path/to/android.jar DEX=path/to/classes.dex tools/build.sh
```
`android/smali/` holds the WebView activity (assemble it to `classes.dex` with smali).
Signing reads `keys/key.pem` and `keys/cert.pem` (or `SP_KEY` / `SP_CERT`). **Keys are never committed.**
Use the same key for every release, or Android won't install an update over the old app.

## Tests
`tests/` has headless simulations (jsdom) that feed recordings or synthetic rings to the tuner:
`python3 tests/mk.py web/soft-pulse.html sim_new.html` then e.g. `node tests/sim_set.js sim_new.html <recording.f32>`.
Recordings (48 kHz mono float32) are not in the repo.

## Versions
4.3 Hz map page · 4.2 octave direction (+0.5 ¢), gap meter above the buttons · 4.1 octave lock on short rings · 4.0 tuned on real chime recordings · 3.9 steady-tone display · 3.8 machine-noise filter
