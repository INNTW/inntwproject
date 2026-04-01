# INNTW Project Journal

## 2026-03-31 — Logo Addition Attempt

### What was tried:
1. User uploaded INNTW logo as .svgz file (compressed SVG)
2. Decompressed .svgz to .svg in sandbox (~33KB raw, optimized to ~14KB with SVGO)
3. Attempted to write SVG to `public/inntw-logo.svg` via Desktop Commander write_file — **FAILED** (file truncated to 6 bytes due to large content)
4. Attempted base64 decode via shell on user's machine — SVG appeared to write but **DID NOT RENDER** on the live site
5. Attempted to convert SVG to PNG using cairosvg on user's machine — **FAILED** (no cairo library installed)
6. User explicitly requested: **USE THE PNG DIRECTLY, STOP TRYING SVG**

### Key lesson:
- Desktop Commander write_file truncates large binary/text content
- SVG route does not work for this logo — do NOT attempt again
- The PNG exists in sandbox at `/sessions/modest-wizardly-johnson/inntw-logo.png` (23KB, 384x384px)
- Must transfer PNG via base64 encode in sandbox → write base64 text to user machine → decode on user machine

### Current state:
- `public/inntw-logo.svg` exists but is BROKEN — needs to be deleted
- `page.tsx` has an `<img>` tag referencing `/inntw-logo.svg` — needs to be updated to `/inntw-logo.png`
- The `import Image from "next/image"` was already removed

### Next steps:
1. Delete broken `public/inntw-logo.svg`
2. Transfer PNG to `public/inntw-logo.png` via base64 method
3. Update `page.tsx` to reference `.png` instead of `.svg`
4. Commit and push
5. Verify on live site
