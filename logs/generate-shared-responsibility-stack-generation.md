# Generation Log: shared-responsibility-stack

- **sim-id:** shared-responsibility-stack
- **Library:** Static SVG with hover tooltips (inline `<svg>` + a small
  `shared-responsibility-stack.js` for the floating tooltip and the
  `// CANVAS_HEIGHT` comment).
- **Bloom level / verb:** Understand / Compare (spec left null; the task is to
  *compare* responsibility across four service models, comprehension-level).
- **Learning objective:** Compare how responsibility for each layer shifts
  across On-Prem, IaaS, PaaS, and SaaS, and explain why data, identity, and
  configuration always remain the customer's job.

## Instructional-design decision

`infographic-svg`. Per the pipeline, "interactive" here means hover/click
reveals, not animation. Each of the 36 layer cells carries a `data-tip` giving
who is responsible plus a concrete example; a single fixed floating tooltip div
displays it. This serves the Understand/Compare objective: the static colored
grid makes the cross-model pattern visible at a glance, and the tooltips supply
the concrete grounding (e.g., "enabling MFA in the Microsoft 365 admin center")
without cluttering the figure.

## Implementation approach

Built as one inline `<svg>` (viewBox 0 0 740 470) holding four columns
(On-Prem, IaaS, PaaS, SaaS), each a nine-layer vertical stack with Physical
facilities at the bottom and Data & identities at the top, matching the spec's
bottom-to-top ordering. Layer fill is slate `#455a64` (provider) or blue
`#1565c0` (customer); the provider region grows from the bottom up: On-Prem 0,
IaaS 4, PaaS 6, SaaS 7 provider layers. The two top layers (Configuration, Data
& identities) stay customer-blue in every column — the load-bearing lesson. The
36 layer groups were generated with a small Python script to guarantee exact,
consistent coordinates and per-cell tooltip text, then written into main.html.
Background is cream `#fff8e1` per spec, a centered Provider/Customer legend sits
above the grid, and the required persistent caption ("In every model, data,
identity, and configuration are always the customer's job.") sits in an
amber-accented box below. Responsive: the SVG scales with width (capped at 760px)
and fills the viewport below 700px; the tooltip is clamped in-bounds and hidden
on resize.

## Validation score

- First validation run: **100 (A)** — educational/pedagogical metadata authored
  up front, no gaps reported.

## Layout review (Claude Vision)

- **Model used:** Claude Opus 4.8 (1M context) vision pass.
- **Cycle 1 (height 660/662):** CLEAN on first render. All 36 layer labels and
  the four column headers are fully visible and uncropped; white inter-layer
  gaps prevent any overlap; white text reads clearly on both slate and blue. The
  color pattern was verified against the spec cell-by-cell — On-Prem all blue,
  IaaS bottom-4 slate, PaaS bottom-6 slate, SaaS bottom-7 slate, with
  Configuration and Data & identities blue across all four columns. Legend,
  cream background, and the amber caption all present and correct.
- **Final state:** clean (no patches needed).
