# Generation Log: purdue-model-layers

- **sim-id:** purdue-model-layers
- **library:** Mermaid (flowchart TB)
- **Bloom level / verb:** Understand / Identify
- **Learning objective:** Students can identify the seven layers of the Purdue
  model from the enterprise network to the physical process and explain the
  IT/OT DMZ boundary and why the CIA priority order inverts between IT and OT.

## Instructional-design decision

The spec is a layered ICS/OT architecture diagram (Bloom: Understand), so the
interaction is hover-reveal per layer — no animation. A Mermaid `flowchart TB`
of seven stacked layer boxes matches the canonical Purdue drawing, with a side
legend carrying the IT-vs-OT CIA priority inversion.

## Implementation approach

- Seven layers top-to-bottom: L5/L4 enterprise (slate), the IT/OT DMZ (amber,
  the firewalled boundary), L3/L2 operations/supervisory (blue), L1 basic
  control (darker blue), L0 physical process (cream) — exactly the spec palette.
- Bidirectional `<-->` edges between layers; the DMZ->L3 edge carries the
  "Brokered, inspected, monotone — no direct sessions" annotation and is
  restyled amber (`linkStyle 2`) to emphasize the firewalled crossing.
- A right-hand HTML legend renders the CIA priority-inversion table (IT: C>I>A;
  OT: A>I>C) with prose explaining why, plus a note on the DMZ. Layout stacks the
  legend below the diagram under 760px.
- Companion `purdue-model-layers.js` carries the CANVAS_HEIGHT comment and
  per-layer hover tooltips.

## Validation score

- **100 (A)** on the first validate run.

## Layout review (Claude Vision — claude-opus-4-8[1m])

- **Pre-flight render test** confirmed the bidirectional labeled edge
  (`<-- "label" -->`) and `<br/>` inside the edge label parse cleanly in
  Mermaid 11.
- **Cycle 1 (height):** at 900 the stack clipped at Level 0. Measured true
  extent (~970px) via an 1100px capture; set `// CANVAS_HEIGHT: 975` (iframe
  977), re-ran fix-iframe-heights, synced the example block.
- **Cycle 2:** walked the checklist:
  - 1.1–1.5 legibility: PASS (all seven layer labels readable; legend table
    text crisp; dark-on-amber DMZ, dark-on-cream L0 all high-contrast).
  - 3.1 title / 3.2 draw-order: PASS.
  - 3.6 highlighted state: PASS (the amber DMZ band and amber boundary edge
    clearly mark the IT/OT divide).
  - 5.1 subgraph title: N/A.
  - 6.1 renders / 6.3 aspect ratio: PASS (fills 977px, legend and back-link
    visible, no clipping).
- **Final state:** clean.
