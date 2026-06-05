# Generation Log: stack-overflow-anatomy

- **sim-id:** stack-overflow-anatomy
- **Library:** Static SVG with hover tooltips (inline `<svg>` + a small
  `stack-overflow-anatomy.js` for the floating tooltip and the CANVAS_HEIGHT
  comment).
- **Bloom level / verb:** Understand / Explain (spec left null; the goal is to
  *explain* the overflow mechanism and the role of each mitigation).
- **Learning objective:** Explain how an unbounded write to a fixed-size stack
  buffer overwrites the saved frame pointer and return address, why that
  redirects execution on return, and which mitigations would have stopped it.

## Instructional-design decision

`infographic-svg`. "Interactive" = hover/click reveal, no animation. Each stack
cell carries a `data-tip` that names the cell's role and the defense (stack
canary, ASLR, DEP/NX) that acts at that location, so the learner can reason about
detect-vs-prevent at each step. A static, labeled side-by-side comparison is the
right medium for an Understand-level "anatomy" objective.

## Implementation approach

One inline `<svg>` (viewBox 0 0 780 312) holding two stack frames drawn in the
conventional stack-grows-down orientation (high addresses on top, "stack pointer"
arrow at the bottom). Left ("Normal call"): grey caller frame, slate Return
address `0x4011d3`, slate Saved frame pointer, white `buffer[16]` = "Hello\0...".
Right ("Overflow"): identical layout but `buffer[16]`, Saved frame pointer, and
Return address are all red `#d84315`, with the return address overwritten to the
attacker value `0xdeadbeef` and the saved frame pointer to "AAAA". A red
annotation arrow runs from the overwritten return-address cell into the right
margin to "→ now jumps to attacker code (shellcode / ROP)". Slate = intact
contents, red = attacker-controlled, blue = annotations/SP arrows/caption, grey =
other frames — matching the spec palette. The 11 cell groups were generated with
a Python helper for exact coordinates and consistent per-cell tooltip text. The
required blue caption sits below. Responsive: SVG scales with width (cap 820px)
and fills the viewport below 700px; tooltip clamped in-bounds and hidden on
resize.

A geometry note: the first annotation placement put the "jumps to attacker code"
text at the right viewBox edge where it collided with the overflow panel. This
was corrected before any screenshot by widening the viewBox to 780, narrowing the
two panels to 270px each at x=20 and x=320, and routing the annotation arrow into
the clear 590–760 right margin.

## Validation score

- First validation run: **100 (A)** — educational/pedagogical metadata authored
  up front, no gaps reported.

## Layout review (Claude Vision)

- **Model used:** Claude Opus 4.8 (1M context) vision pass.
- **Cycle 1 (height 520/522):** CLEAN. Both panels, all cells, the
  high/low-address axis labels, both stack-pointer arrows, the red annotation
  arrow in the right margin, and the blue caption are fully visible and
  uncropped. Color coding verified against the spec (slate intact, red
  attacker-controlled, grey caller frame, blue annotation). The normal-vs-overflow
  contrast reads clearly (0x4011d3 vs 0xdeadbeef; "Hello\0..." vs "AAAA...+more").
  Contrast passes on every cell. No overlap.
- **Final state:** clean (no patches needed).
