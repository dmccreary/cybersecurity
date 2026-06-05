# Generation Log: software-supply-chain-flow

- **sim-id:** software-supply-chain-flow
- **Library:** Mermaid (flowchart TD) + a small `.js` for hover and the defenses
  wiring / CANVAS_HEIGHT comment.
- **Bloom level / verb:** Analyze / Analyze (stated explicitly in the spec).
- **Learning objective:** Given a real-world supply-chain incident, identify
  which stage of the chain was compromised and which defenses would have detected
  or prevented it.

## Instructional-design decision

`workflow-diagram` at Analyze level. The interaction is hover/click reveal (no
animation) on three classes of element: the nine blue stages, the nine amber ⚡
attack-injection points (each naming a real incident), and the four defense rows.
This directly supports the Analyze objective — the student maps an incident to a
stage and then to the control that would have caught it. The defense rows were
made interactive (not just static text) so a learner can pull up each control's
stage-coverage explanation while reasoning.

## Implementation approach

The spec asked for a left-to-right LR chain. Per the WAVE-1 learning that LR
flows with many nodes shrink node text and bottom-anchor inside a narrow 2/3
panel, the chain was rendered as a `flowchart TD` instead: the nine stages form a
vertical/diagonal spine (S1→S9 solid arrows) and each stage has its amber attack
node attached via a dashed branch (S_n -.-> A_n), so every attack point stays
visibly attached to its stage — honoring the spec's "annotations remain attached"
requirement better than a cramped horizontal row. Stages use cybersecurity blue
`#1565c0`; attack nodes use amber `#ffa000` with a ⚡ glyph and the incident label
(event-stream 2018, SolarWinds 2020, NotPetya 2017, etc.). The "Defenses" banner
lives in the right info panel as four green-accented rows (SBOM → 3,5,9; code
signing → 6 verified at 9; reproducible builds → 4; provenance/SLSA → 4–8); each
row is hover/click wired to the shared `#panel` via a small inline script that
reads the same `nodeInfo` map used by the diagram nodes. Standard 2/3 + 1/3
layout; 700px responsive stack breakpoint.

## Validation score

- First validation run: **100 (A)** — educational/pedagogical metadata authored
  up front, no gaps reported.

## Layout review (Claude Vision)

- **Model used:** Claude Opus 4.8 (1M context) vision pass.
- **Cycle 1 (height 700/702):** CLEAN. All nine stages and all nine attached ⚡
  attack annotations render fully and uncropped (the last node, "skipped
  verification at run time", sits well inside the 702px height). White-on-blue
  and dark-on-amber contrast both pass; the ⚡ glyph renders correctly in the
  nodes, the legend, and the panel; the four-row Defenses panel shows each
  control with its stage mapping. Dashed attack branches are visually distinct
  from the solid chain. No overlap, no Mermaid parse errors. The diagonal cascade
  is a TD auto-layout artifact but is readable and keeps every attack point
  attached to its stage.
- **Final state:** clean (no patches needed).
