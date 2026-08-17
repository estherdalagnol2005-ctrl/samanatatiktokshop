# Samanta TikTok Shop — Recovery Rules

This repository contains a recovered snapshot of the production deployment.

## Critical rules
- Preserve the current visual output unless the user explicitly requests a change.
- Do not redesign the hero or replace the Sunlix identity.
- Preserve GSAP, ScrollTrigger, SiteMotion, MethodTimeline and DreamsCarousel behavior.
- Treat `assets/` and `brand/` as production artifacts.
- Before editing, inspect `docs/SAMANTA_PROJECT_HANDOFF.md` and the existing production bundle.
- Validate desktop and mobile after every visual change.

## Recovery caveat
The original uncompiled React/Vite source was not available in the exported browser capture. The exact deployed HTML, CSS, JS chunks and media assets were recovered from a HAR capture. Continue from this snapshot cautiously or progressively reconstruct readable source components while keeping visual parity.
