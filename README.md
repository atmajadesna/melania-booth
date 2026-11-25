# Melania Booth

A feminine, privacy-first browser photobooth by Desna.

**[Live demo](https://atmajadesna.web.id/melania-booth/)**

## Features
Six frame themes, 3/4 timed captures, individual retakes, mirror and camera switching, local image upload, filters and brightness, caption/date/frame decoration, undo/redo of editor settings, vertical strips and four-photo grids, PNG and 1080×1920 Story export, native file sharing where supported.

No photo uploads, accounts, analytics, external scripts or server-side image storage. Photos exist in memory until the page closes. Save the PNG before leaving. Theme thumbnails are labeled illustrative previews, not real photos.

## Run
Serve this directory using `python3 -m http.server 8080` and open localhost:8080. Real camera access requires localhost or HTTPS.

## Test
Install Playwright and Chromium (`npm install --no-save playwright && npx playwright install chromium`). Run `node test.cjs`; set `TEST_URL` for another deployment and `ARTIFACT_DIR` for screenshot output. Tests cover responsive widths and simulated Chromium camera capture through PNG download. This is a simulated device test, not verification of a physical phone camera. Actual browser/device permission and camera switching behavior should be tested on hardware.

## Editing
- `index.html`: sections and controls
- `tokens.css`, `styles.css`: palette and responsive design
- `app.js`: themes, in-memory session, camera and canvas rendering
- `test.cjs`: browser regression suite

Source files are deployed through an explicit runtime allowlist to `/var/www/desna-personal/melania-booth/`.

## Limitations
Stickers use fixed decorative positions; draggable stickers and manual crop/zoom are not implemented. The lighting control is brightness adjustment, not facial retouching. Fullscreen, file sharing and camera switching depend on browser support. No persistent photo gallery or remote storage. Cancelled sessions preserve the previous completed photos.
