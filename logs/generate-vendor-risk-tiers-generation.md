# Generation Log: vendor-risk-tiers

- **sim-id:** vendor-risk-tiers
- **Library:** Static SVG with hover tooltips (inline SVG built in a `.js` file; a custom
  positioned tooltip div, not native `<title>`, for richer styled tooltips)
- **Chapter:** 13 — "Organizational Security: Governance, Risk, and Compliance"
- **Bloom level / verb:** Understand / classify (inferred — spec had no Bloom field)
- **Learning objective:** Classify a vendor into the correct risk tier based on the impact of
  its failure, match the depth of due-diligence controls to that tier, and explain why
  fourth-party (subprocessor) risk is inherited.

## Instructional-design decision + rationale

Spec type is `infographic-svg`. Per the pipeline guidance, "interactive" for an infographic
means hover/click reveals and view toggles — NOT looping animation. The diagram is a static
concentric-ring picture; the interaction is hover-to-reveal the controls that fit each tier.
This matches an Understand/classify objective: the learner studies a fixed structure and
maps vendors to tiers, rather than manipulating parameters. Tooltips carry the concrete
control sets (SOC 2 + IR runbook at Tier-1 down to self-attestation at Tier-3) so the
"why this tier gets this scrutiny" payload is one hover away.

## Implementation approach

- Inline SVG rendered by `vendor-risk-tiers.js`. Center = "Our Organization" (cybersecurity
  blue). Three concentric rings: Tier-1 critical (slate `#455a64`), Tier-2 important (lighter
  slate `#78909c`), Tier-3 standard (cream `#fff3d6`). Each ring carries a band-name label at
  its top and 2–3 white vendor example chips placed at the band midline.
- A fourth-party cluster (CDN, KMS, SMS gw) sits OUTSIDE the rings as dashed circles joined to
  the Tier-1 ring by dotted connectors — the "subprocessors of your vendors / inherited risk"
  idea from the spec.
- Hover/tap reveals a styled tooltip (custom `#tip` div, `data-tip` attributes) with the typical
  due-diligence controls for the hovered tier / the fourth-party explanation.
- Responsive: a window-resize listener swaps the radial SVG for a vertical stacked-list SVG
  below 640px container width, preserving all tooltips.
- Brand palette throughout; schema meta tag + bare `<main></main>` present; CANVAS_HEIGHT
  comment in the `.js` so fix-iframe-heights can read it.

## Validation score

- Before: placeholder scaffold (not gradeable).
- After: **100 / A** (`validate-sims.py`).

## Layout review (Claude Vision)

- **Model:** Claude Opus 4.8 (1M context) — `claude-opus-4-8[1m]`.
- **Pass 1 FAILs:**
  - 3.3 / 1.2 panel & label overlap — the Tier-1 band name collided with the "Cloud platform"
    vendor chip (both at top center); "Tier 3 — Standard" was partly covered by the center
    circle/chip (read as "Tier 3 — Sta").
  - 6.3 aspect ratio / 1.1 bottom clip — the square 700×700 viewBox plus chrome exceeded the
    702px iframe: the caption box and the bottom fourth-party nodes were below the fold; the
    top fourth-party node was clipped; large dead whitespace sat between legend and diagram.
- **Fixes:** moved all vendor chips off the top center and onto their band midlines; repositioned
  band-name labels to the clear top of each band; gave the center circle a radius (60) smaller
  than the Tier-3 inner radius; moved the three fourth-party nodes to non-clipping angles and
  reduced their offset; cropped the viewBox vertically (`0 78 700 560`) to kill the dead
  whitespace; raised CANVAS_HEIGHT 700 → 770, re-ran fix-iframe-heights (702 → 772), updated the
  copy-paste example iframe to 772, re-captured.
- **Pass 2:** CLEAN. All three ring labels, all vendor chips, all three fourth-party nodes,
  the center, and the caption are fully visible with no edge clipping; high contrast (white
  labels on slate, dark on cream); single dominant blue center drives the eye.

**Final state: clean.**
