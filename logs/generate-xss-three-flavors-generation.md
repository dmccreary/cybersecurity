# Generation Log: xss-three-flavors

- **sim-id:** xss-three-flavors
- **Library:** Static SVG with hover tooltips (inline SVG built in a `.js` file; custom
  positioned tooltip div, supports HTML/`<code>` in tooltips)
- **Chapter:** 5 — "Software Vulnerabilities and Secure Coding"
- **Bloom level / verb:** Understand / compare (inferred — spec had no Bloom field)
- **Learning objective:** Compare the data flow of stored, reflected, and DOM-based XSS;
  identify where the payload lives in each subtype and whether the server ever sees it; and
  recognize that DOM-based XSS can be invisible to server-side logging.

## Instructional-design decision + rationale

Spec type is `infographic-svg`; "interactive" therefore means hover/tap reveals, not
animation. The teaching goal is a *comparison* across three subtypes, so the design is three
parallel data-flow columns the learner can scan side by side — the classic Analyze/Understand
"side-by-side compare" pattern. Each step is a box (not an animation frame) so the learner
controls the pace; hovering any box reveals the concrete "what happens / why it's dangerous"
detail, keeping the at-a-glance diagram uncluttered.

## Implementation approach

- Inline SVG rendered by `xss-three-flavors.js`. Three columns (Stored, Reflected, DOM-based),
  each a vertical stack of step boxes joined by down-arrows, with a dashed caption box at the
  bottom of each column.
- Color coding per spec: blue (`#1565c0` / `#e3f0fb`) = legitimate flow; amber
  (`#ffa000` / `#fff3d6`) = attacker-controlled data; red outline (`#c62828`) on the box where
  the script executes in the victim's browser. A legend maps the three colors.
- Each box carries a `data-tip` HTML tooltip (with `<code>` for the `location.hash` /
  `innerHTML` / `?q=` details). Monospace styling for code-like sub-lines (POST /comment,
  GET /search?q=, location.hash).
- Responsive: a single `drawColumn()` routine serves both a wide 3-across view and a narrow
  stacked single-column view; a resize listener swaps them at a 680px container breakpoint.
- Brand palette; schema meta tag + bare `<main></main>`; CANVAS_HEIGHT comment in the `.js`.

## Validation score

- Before: placeholder scaffold (not gradeable).
- After: **100 / A** (`validate-sims.py`).

## Layout review (Claude Vision)

- **Model:** Claude Opus 4.8 (1M context) — `claude-opus-4-8[1m]`.
- **Pass 1 FAIL (6.3 / 6.1):** at the 800px capture width the responsive breakpoint (initially
  860px) forced the STACKED single-column view, so the screenshot showed one tall column with
  the rest below the fold — the intended side-by-side comparison was not visible, and the
  stacked view far exceeded the iframe height.
- **Fix:** lowered the breakpoint to 680px so the primary 3-column wide view renders at the
  ~776px iframe content width (the spec's side-by-side comparison is the intended default; the
  stacked view remains as a true mobile fallback). Reset CANVAS_HEIGHT to 540, re-ran
  fix-iframe-heights (722 → 542), updated the copy-paste example iframe to 542, re-captured.
- **Pass 2:** CLEAN. All three columns render side by side; every box label and code sub-line
  is fully visible (incl. "Server → Victim", "JS writes to innerHTML"); arrows and per-column
  caption boxes present; color coding matches the legend; high contrast; no edge clipping
  (the "Back to Documentation" link sits just below the diagram, confirming the full content
  fits). Columns differ in height because Stored has five steps vs four — natural and readable.

**Final state: clean.**
