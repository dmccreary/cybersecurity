# Generation Log: vuln-sandbox

- **sim-id:** vuln-sandbox
- **diagram name:** Vulnerability Sandbox MicroSim
- **chapter:** 5 — Software Vulnerabilities and Secure Coding
- **library:** p5.js (1.11.10 via jsdelivr CDN)
- **Bloom level / verb:** Analyze / Compare
- **learning objective:** Given the same attacker payload, compare a vulnerable and
  a fixed implementation of a web endpoint, identify the structural difference (data
  concatenated into code vs. data kept separate), and reason about why the fix makes
  the bad outcome impossible.

## Instructional-design decision + rationale

The spec explicitly states **Bloom: Analyze** and is fundamentally a **comparative
visualization** (p5 guide Pattern 2 — two scenarios side by side). Per the
pipeline's instructional-design rule, Analyze/Apply work calls for an explorer with
discrete, event-driven state updates rather than continuous looping animation. So
the sim is driven by user actions: choose a class, edit the payload, press **Send
request**. Send fires a *one-shot* ~1-second flow animation of the payload traveling
to the sink, then settles — no perpetual loop that would distract from the
side-by-side comparison. Control count is exactly 4 (select, input, button,
checkbox), within the guide's 1–5 budget, and the default state (SQL Injection,
`admin' --`, internals shown) demonstrates the concept on load with no interaction.

## Implementation approach

- Built from the placeholder scaffold. New `main.html` (p5 CDN, schema meta tag,
  bare `<main></main>`, loads `vuln-sandbox.js`) and a full p5 sketch.
- Standard p5 layout: `updateCanvasSize()` first in `setup()`; `drawHeight = 480`,
  `controlHeight = 80` (two control rows), `canvasHeight = 560`; `aliceblue`
  drawing region + `white` control region with `silver` borders; `noStroke()`
  before every `text()`.
- **p5 BUILT-IN controls only:** `createSelect()` (vulnerability class),
  `createInput()` (attacker payload, auto-fills per class), `createButton('Send
  request')`, `createCheckbox('Show internals')`. All parented to
  `document.querySelector('main')` and repositioned in `windowResized()` /
  `updateCanvasSize()`.
- **Data model** for 5 classes (SQLi, Command Injection, Reflected XSS, Path
  Traversal, IDOR): each carries the vulnerable concatenation template, the fixed
  (separated) template + note, the sink name, and both outcomes.
- **Vulnerable panel (left):** the constructed string is drawn with the code in
  cybersecurity blue and the **payload highlighted in rust orange** (`#d84315`),
  word-wrapped; a rust flow arrow carries a moving packet into the sink; outcome
  in red ("EXPLOITED: …").
- **Fixed panel (right):** the code template in blue plus the payload as a separate
  **slate-steel data chip**, making the code/data separation visible; slate flow
  arrow; outcome in green ("CONTAINED: …").
- **Outcome bar** (amber) at the bottom: "Same payload. Different defense."
- Responsive: panels are side-by-side at ≥700px and **stack vertically** below
  700px (per spec); a custom word-wrap helper keeps long queries/outcomes inside
  the panel at any width.
- Honors the spec palette throughout.

## Validation score

- **Before:** scaffold (placeholder "Not Yet Implemented"; boilerplate metadata —
  creator "Dementia Education Project", subject "dementia"; no lesson plan/refs/
  screenshot).
- **After:** **98 / A.** The only deduction is the documented validator FALSE
  POSITIVE that flags p5 built-in controls (`createSelect/createInput/createButton/
  createCheckbox`) as forbidden "DOM functions." Those controls are REQUIRED by the
  project standard, so they were NOT removed — 98 is the A-grade ceiling for a
  compliant p5 sim (per WAVE-1 learnings). Fixed metadata (creator "Dan McCreary",
  subject ["cybersecurity"], rights CC BY-NC-SA 4.0, Bloom Analyze/Compare,
  completion_status "validated"); added About / Lesson Plan / References / embedded
  screenshot; schema tag + bare `<main>` present; iframe height 562.

## Layout review (Claude Vision)

- **Model:** Claude Opus 4.8 (1M context) — `claude-opus-4-8[1m]`.
- Screenshot captured with `bk-capture-screenshot` at the absolute sim dir,
  800×562, then read with the Read tool. **1 cycle — clean on first render.**

Checklist walk:
- **PASSES:** 1.1 (no clipped text — the long right-panel outcome "CONTAINED:
  Returned 0 rows (no user literally named that)" fits inside the panel), 1.3 (clean
  fills, no stroke halos — `noStroke()` precedes all text), 1.4 (blue/rust/slate code
  coloring and white-on-red/green headers all high contrast), 1.5 (title 22px, labels
  ≥10.5px), 2.1–2.7 (select/input/button/checkbox all inside the white control region,
  labels "Vulnerability class:" and "Attacker payload:" aligned with controls, input
  extends to near the right edge with margin, no overlaps, nothing below the canvas),
  3.1 (title centered, subtitle below it, no overlap), 3.2 (header strips and sink
  boxes drawn in correct order), 3.3 (panel content contained), 4.1 (aliceblue
  drawing bg), 4.2 (white control bg), 4.4 (clear blue-code / rust-payload / amber-bar
  hierarchy), 6.1 (renders the default SQLi state), 6.3 (800×562 matches iframe).
- **N/A:** 3.4/3.5 (no axes/grid), 5.x (no Mermaid/network/chart/map).
- **FAILS:** none.

Note: the one-shot flow packet (moving circle) is not visible in the static
screenshot because the animation settles to flowT=1 after ~1s; the arrows still
clearly indicate flow into the sink. This is expected for an event-driven sim.

**Final state: CLEAN** (1 cycle).
