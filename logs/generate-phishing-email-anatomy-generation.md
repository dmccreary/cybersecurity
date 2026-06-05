# Generation Log: phishing-email-anatomy

- **sim-id:** phishing-email-anatomy
- **library:** p5.js
- **Bloom level / verb:** Analyze / Analyze (decompose)
- **Learning objective:** Students decompose a realistic spear-phishing message
  into its component manipulation techniques and identify the specific signals
  that should trigger suspicion.

## Instructional-design decision

Bloom level is Analyzing, so the interaction is genuine analysis, not animation:
the learner decomposes a concrete artifact. Two modes serve the objective —
"Spot the indicators" (hotspots hidden; click to find; scored) builds active
recall, and "Annotated" (all hotspots + hover explanations) closes the loop. A
single `createSelect` dropdown switches modes and a `Reset` button clears found
state — within the 1–5 control budget.

## Implementation approach

- p5.js drawing region renders a stylized email-client window on a cream body
  with a finance-team invoice lure. Six hotspots (sender, greeting, urgency,
  link, attachment, footer) are rectangular hit regions in a 900-wide design
  space scaled to the live canvas width via `scaleX()`.
- Spot mode: `mousePressed` marks a hotspot found; a red glow + (in Annotated)
  a labeled tag mark revealed indicators; a "Found N of 6" score renders in the
  control region; hovering an unfound hotspot shows a "click to confirm" prompt.
- Annotated mode: all six revealed with labels; hover shows the technique
  explanation in a word-wrapped tooltip.
- Standard p5 conventions: `updateCanvasSize()` first in setup, `windowResized`,
  `describe()`, bare `<main>` parented via `document.querySelector('main')`,
  built-in controls, `// CANVAS_HEIGHT: 620` comment.

## Validation score

- **98 (A)** — the documented p5 false positive (validator flags built-in
  `createSelect`/`createButton` as "DOM functions"). 98 is the A-grade ceiling
  for compliant p5 sims; built-in controls are REQUIRED, so not removed.

## Layout review (Claude Vision — claude-opus-4-8[1m])

- **Cycle 1 FAIL (6.1 / 3.x):** the email body rendered only down to the
  urgency line — the link, attachment chip, and footer were missing. Root cause:
  `textStyle(UNDERLINE)` — p5.js has no `UNDERLINE` textStyle constant, and the
  bad call silently aborted the rest of `drawEmailWindow`. The emoji paperclip
  was also a rendering risk.
- **Fix:** removed `textStyle(UNDERLINE)` (drew the link underline manually with
  a `line()`), replaced the `📎` emoji with a `[file]` text glyph.
- **Cycle 2:** the full email rendered (PNG bytes 59K -> 85K). Verified the
  Annotated mode separately by temporarily defaulting to it: all six hotspots
  show red glow boxes and labeled tags correctly. Reverted default to "Spot the
  indicators."
- Walked the checklist:
  - 1.1–1.5 legibility: PASS (From/Subject/body/link/footer all readable;
    control-region score text high-contrast).
  - 2.1–2.7 controls: PASS (Reset + Mode dropdown in the white control region,
    no overlap, below drawHeight).
  - 3.1 title / 4.1 drawing-area background: PASS.
  - 6.1 renders / 6.3 aspect ratio: PASS (fills 622px).
  - Residual: in Annotated mode a red label tag sits slightly over the line
    above its box (tight line spacing). Cosmetic; the tag clearly belongs to the
    box below it. Left within budget.
- **Final state:** clean (one negligible cosmetic note in Annotated mode).
- Note: `bk-capture-screenshot` cannot simulate clicks/hovers, so found-state
  and tooltips were verified by reasoning + the Annotated-default capture rather
  than an interactive screenshot.
