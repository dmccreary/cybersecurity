# Generation Log: risk-heat-map

- **sim-id:** risk-heat-map
- **Library:** p5.js
- **Chapter:** 13 — Organizational Security
- **Bloom level / verb:** Analyze / Analyze
- **Learning objective:** Given a brief risk description, place it on a 5x5
  likelihood-by-impact grid and analyze how the recommended treatment changes
  with its placement.

## Instructional-design decision

The spec is an Analyze-level `microsim`. That maps to an explorer/placement tool
with immediate feedback. I built a 5x5 likelihood (X) by impact (Y) grid where
score = L x I, each cell colored on the spec's green/yellow/amber/red gradient
with its score rendered. The learner places a risk three ways — sample dropdown,
two sliders, or by dragging the marker — and a right panel shows the score, band,
recommended treatment, and rationale in real time. Hovering a cell shows its
interpretation. This directly supports analyzing how treatment shifts with
placement.

## Implementation approach

- Standard p5 structure: `updateCanvasSize()` first, canvas parented to
  `document.querySelector('main')`, `windowResized()` resizing both sliders,
  built-in controls only (select, 2 sliders, button), `// CANVAS_HEIGHT:` comment,
  `describe()`.
- Grid geometry recomputed each frame for width responsiveness; the right panel
  width scales with canvas width.
- Treatment logic per spec: score >= 15 Mitigate/Avoid; 10-14 Mitigate/Transfer;
  5-9 Mitigate/Accept; <= 4 Accept. Colors exactly per spec (green #4caf50,
  yellow #fbc02d, amber #ffa000, red-orange #d84315, marker #1565c0 with slate
  border).
- Interactions: dropdown auto-positions the marker; sliders and dragging update
  L/I and flip the dropdown to "Custom"; `mouseMoved` drives the cell-hover
  interpretation; Reset restores the default sample.

## Validation

- validate-sims.py: **98 (A)** — only deduction is the known false positive for
  p5 built-in controls (createSelect/createSlider/createButton), which are
  REQUIRED. 98 is the p5 A-grade ceiling.

## Layout review (Claude Vision)

- **Cycle 1 (height 702):** walked the full checklist against the screenshot.
  PASS on all items: 5x5 grid with correct gradient and per-cell scores; both
  axis label sets and axis titles complete; blue marker correctly placed at the
  default L3xI5=15; right panel shows risk, score chip, band, treatment, and
  rationale without overflow; controls (dropdown, two sliders with values, Reset)
  clear of each other and within the control region; title centered and clear of
  grid and panel; aliceblue/white backgrounds present; good contrast.
- No defects found. **Final state: clean** — no patches required.

Claude Vision model used: Claude Opus 4.8 (1M context).
