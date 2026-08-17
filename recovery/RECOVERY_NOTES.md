# Recovery Notes

Recovered on 2026-08-14 from the production HAR capture for:
`https://samanta-tiktok-shop.murilos549011.chatgpt.site/`

## Recovered
- Production `index.html`
- Production CSS bundle
- Main JavaScript bundle and framework/runtime chunks
- GSAP and ScrollTrigger chunks
- `SiteMotion`, `MethodTimeline`, and `DreamsCarousel` chunks
- Sunlix logo/icons
- Samanta imagery and results imagery
- Paris MP4 video
- Favicon

## Font paths
The deployed CSS expects:
- `/brand/nagoku-black.otf`
- `/brand/tiktok-sans-variable.ttf`

The HAR recorded the font requests but did not embed their binary response bodies. Add the licensed font files at those exact paths before final deployment if they are available from the original brand package.

## Run locally
```bash
npm start
```
Then open `http://localhost:4173`.

This is a production-build recovery, not the original uncompiled source repository.
