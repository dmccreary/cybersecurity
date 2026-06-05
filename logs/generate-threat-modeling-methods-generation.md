# Generation Log — threat-modeling-methods

- **sim-id:** threat-modeling-methods
- **Library:** Static SVG (inline `<svg>` + small hover-tooltip script in a `.js` carrying the `CANVAS_HEIGHT` comment)
- **Bloom level / verb:** Understand / Compare
- **Learning objective:** Given a system to secure and a fixed time budget, the
  student can compare STRIDE, PASTA, and Attack Trees and select the method whose
  question and output best match the situation.
- **Chapter:** 1 — Security Foundations: Properties, Mindset, and Risk

## Instructional-design decision

The spec is an `infographic-svg`, Bloom level Understand. Per the pipeline,
"interactive" here means hover/click reveals, NOT looping animation. I kept the
diagram static and added per-cell `<title>`-style hover tooltips (custom floating
tooltip driven by `data-tip`) plus an HTML summary table. This lets the learner
control the pace and read each concept on demand — the right interaction model
for a Compare/Understand objective. No sliders or animation were added because
there is no continuous parameter to explore.

## Implementation approach

This sim arrived from a previous interrupted run with a real `main.html` and
`.js` already in place (three-column SVG: STRIDE blue / PASTA slate / Attack
Trees amber, plus a summary table). I completed the pipeline and repaired the
one real defect:

- Three columns of equal width; STRIDE maps each letter to the violated security
  property, PASTA lists the seven numbered stages, Attack Trees shows a worked
  example tree.
- **Key behavior:** floating hover tooltips on every cell (`data-tip` →
  `#tip` div), positioned with viewport clamping so the tooltip never escapes
  the window; touch-tap support; tooltip hidden on resize/leave.
- Responsive: SVG scales to container width via `viewBox` + `max-width`; summary
  table is full-width.

**Repair made:** the attack-tree subtree originally laid its three children out
in a horizontal row inside the narrow amber column, which caused the three boxes
to overlap and clipped their labels ("Compromise dat", boxes sharing pixels). I
re-laid the subtree vertically: root → three stacked OR-children
(Compromise database / Phish admin / Exploit API), with "Phish admin" expanded
into two indented grandchildren (Spear-phish email / Fake login page). All boxes
now sit cleanly within the column with full, unclipped text, and an "OR — any
path reaches the goal" hint clarifies the tree semantics.

## Validation score

- **Before:** 80 (B) — missing metadata `educational`/`pedagogical` sections,
  missing social-preview frontmatter, missing copy-paste iframe example.
- **After:** 100 (A) — added `educational` + `pedagogical` blocks to
  metadata.json, social-preview `image`/`og:image`/`twitter:image` + `social.cards:false`
  frontmatter, and the copy-paste iframe block. Also added About / Lesson Plan /
  References sections and the screenshot embed.

## Layout review (Claude Vision)

- **Model:** Claude Opus 4.8 (1M context) — the model running this agent.
- **Screenshot:** `docs/sims/threat-modeling-methods/threat-modeling-methods.png`
  at iframe height 702.

**FAILs found (first pass):**

- 2.3 / 1.1 Attack-tree child boxes overlapped and their labels were clipped
  ("Compromise dat…", three boxes sharing pixels in the amber column).

**Fix applied:** re-laid the attack-tree subtree vertically (see above) and
re-screenshotted.

**Final state: CLEAN.** Second-pass checklist: 1.1/1.3/1.4 PASS, 3.1/3.2/3.3
PASS (columns aligned, footers aligned, tree contained), 4.x PASS (blue/slate/
amber hierarchy), 6.x PASS (renders fully, aspect matches 702px). Controls
section N/A (static infographic). One cosmetic residue: the faint amber
"OR — any path reaches the goal" hint just touches the connector spine, but it
is fully legible and not worth a third cycle.
