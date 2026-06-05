# Generation Log: risk-treatment-decision-tree

- **sim-id:** risk-treatment-decision-tree
- **Library:** Mermaid (flowchart TD)
- **Bloom level / verb:** Apply / Apply (spec left these null; inferred from the
  task — the learner is given a risk and must *apply* the four-option model to
  pick a treatment, not merely recall the four names).
- **Learning objective:** Given a described risk, apply the four-option
  risk-treatment model (avoid, mitigate, transfer, accept) to select and justify
  the appropriate treatment, with an owner and a review date.

## Instructional-design decision

This is a `workflow-diagram` / decision tree. Per the pipeline, "interactive"
for a workflow diagram means hover/click reveal, not looping animation. The
chosen interaction is a hover/tap-to-reveal info panel keyed to each node, which
supports the Apply-level objective: a student walks the diamonds for a given
scenario and reads the consequence of each branch. No sliders/animation — those
would not serve a fixed decision procedure.

## Implementation approach

Built on the project's standard Mermaid 2/3-diagram + 1/3-info-panel layout
(matched to `ids-ips-decision-flow`). A vertical `flowchart TD` runs the risk
down three decision diamonds; the first "yes" routes to one of three terminal
nodes (AVOID, MITIGATE, TRANSFER) and the all-"no" path falls through to ACCEPT.
The four terminals use distinct `classDef` colors required by the spec: Avoid =
slate steel `#455a64`, Mitigate = cybersecurity blue `#1565c0`, Transfer = amber
`#ffa000` (dark text for contrast), Accept = rust orange `#d84315`. The required
caption ("Implicit acceptance is the failure mode…") sits in an amber-accented
box in the info panel. A separate `risk-treatment-decision-tree.js` carries the
`// CANVAS_HEIGHT` comment (so `fix-iframe-heights.py` can read it) and the
hover/click logic that populates `#panel` with a per-node explanation. Responsive
rule stacks the layout below 500px per the spec.

## Validation score

- Before metadata additions: **90 (A)** — flagged "missing educational section"
  and "missing pedagogical section" in metadata.json.
- After adding `educational` and `pedagogical` blocks: **100 (A)**.

## Layout review (Claude Vision)

- **Model used:** Claude Opus 4.8 (1M context) vision pass.
- **Cycle 1 (height 760/762):** FAIL — bottom of the diagram clipped; the
  TRANSFER and ACCEPT terminal nodes were cut off below the iframe. Cause: the
  TD staircase layout (each "No" branch steps down-and-right) makes the diagram
  ~820px of SVG plus a ~38px title; the 760 CANVAS_HEIGHT was too short.
  Fix: measured actual rendered SVG height with headless Chromium (820px),
  raised `// CANVAS_HEIGHT` to 880, re-ran fix-iframe-heights (→882), synced the
  copy-paste example iframe block, re-screenshotted.
- **Cycle 2 (height 880/882):** CLEAN — all four terminal nodes fully visible
  with correct colors and contrast; legend, step-details panel, and amber
  caption all fit; no overlap, no parse errors. Residual empty space below the
  caption in the right column is expected (reserved for the hover info text) and
  is not a defect.
- **Final state:** clean.
