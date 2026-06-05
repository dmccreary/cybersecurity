# Generation Log: ids-ips-decision-flow

- **sim-id:** ids-ips-decision-flow
- **Library:** Mermaid (flowchart TD)
- **Chapter:** 8 — Network Security Foundations: Protocols, Firewalls, and Detection
- **Bloom level / verb:** Understand / Distinguish
- **Learning objective:** Distinguish out-of-band intrusion detection (IDS) from
  in-line intrusion prevention (IPS), and explain why a sensor's placement in or
  beside the data path determines whether it can block traffic.

## Instructional-design decision

The spec is a `workflow-diagram`. Per the pipeline, "interactive" for a workflow
diagram means hover/click reveals, not looping animation. I used a Mermaid TD
flowchart with two subgraphs (IDS out-of-band, IPS in-line) plus a right-side
info panel that updates on node hover/click, and a static pros/cons comparison
table beneath the panel. This matches an Understand-level objective: the learner
traces a packet down each branch and reads concrete per-step explanations rather
than watching an animation.

## Implementation approach

- `main.html` carries the schema meta tag, a bare `<main>`, the Mermaid ESM
  import with `subGraphTitleMargin`, the two-subgraph diagram, the legend, the
  hover panel, and an at-a-glance IDS-vs-IPS comparison table.
- `ids-ips-decision-flow.js` holds the `// CANVAS_HEIGHT:` comment and the
  node-hover wiring (mouseenter + click → info panel text) using the standard
  `waitForMermaid` polling pattern.
- Colors follow the spec: blue (#1565c0) permitted flow, amber (#ffa000)
  alert-only, red (#c62828) drop/block, slate (#455a64) decision diamonds.
- Responsive: `.layout` stacks to a single column below 700px.

Key behaviors: IDS branch ends in an alert + unchanged delivery (no block); IPS
branch ends in drop/quarantine/forward, emphasizing the availability trade-off.

## Validation

- validate-sims.py: **100 (A)** on the first run; no gaps to fix.

## Layout review (Claude Vision)

- **Cycle 1 (height 562):** FAIL 2.7 / bottom boundary — the bottom row of nodes
  (IPS "Forward packet", IDS "Emit alert to SIEM" and "Original packet reaches
  destination unchanged") was clipped. The diagram was taller than the iframe
  and vertically centered, leaving empty top whitespace while the bottom spilled.
- **Fix:** raised CANVAS_HEIGHT and changed `.mermaid` to `align-items:
  flex-start` so the diagram top-anchors (removing wasted top whitespace).
- **Cycle 2 (height 702):** all nodes fully visible; no clipping, no overlap,
  good contrast, subgraph titles clear of arrows. **Final state: clean.**

Claude Vision model used: Claude Opus 4.8 (1M context).
