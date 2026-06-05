# Generation Log: linux-ac-layers

- **sim-id:** linux-ac-layers
- **library:** Mermaid (flowchart TD)
- **Bloom level / verb:** Understand / Trace
- **Learning objective:** Students can trace a single read() syscall through the
  DAC, capability, and MAC gates and explain why the gates are AND-composed and
  why a single DENY is decisive.

## Instructional-design decision

The spec is a "drawing" tracing one syscall through layered access-control
gates, with a denied path and an allowed alternate path. Bloom is Understand, so
the interaction is hover-reveal per box (no animation). A Mermaid `flowchart TD`
with two parallel vertical chains — left = denied read(/etc/shadow), right =
allowed read(index.html) — lets a student compare the two outcomes gate by gate.

## Implementation approach

- One `Process` node fans out to two chains via labelled edges (`read /etc/shadow`,
  `read /var/www/html/index.html`).
- Left chain: DAC denies immediately (`DENY` edge to a red EACCES result); a
  dashed "if it had passed" branch shows the capability and MAC gates that would
  have run, reinforcing the AND-composition.
- Right chain: DAC -> capability -> MAC -> green ALLOW result.
- Colors per spec: light-blue (#e3f2fd) DAC, cyan capability, brand-blue MAC,
  red (#d32f2f) DENY, green (#4caf50) ALLOW; white process box.
- Slate side note states "even one DENY is enough; if DAC permits but MAC denies,
  MAC wins."
- Companion `linux-ac-layers.js` carries the CANVAS_HEIGHT comment and per-node
  hover tooltips.

## Validation score

- **100 (A)** on the first validate run (metadata complete from the start).

## Layout review (Claude Vision — claude-opus-4-8[1m])

- **Pre-flight render test** in a scratch harness confirmed the diagram parses
  cleanly despite colons inside quoted labels (`0640 root:shadow`) and the
  dashed branch — Mermaid tolerates colons *inside* `["..."]` labels.
- **Cycle 1 FAIL (6.3 clipping):** at the initial CANVAS_HEIGHT 720 the bottom
  slate note and back-link were clipped.
- **Fix:** measured true extent (~820px) via a tall capture; set
  `// CANVAS_HEIGHT: 830` (iframe 832), re-ran fix-iframe-heights, synced the
  example block.
- **Cycle 2:** walked the checklist:
  - 1.1–1.5 legibility: PASS (every box's text complete and high-contrast;
    white-on-cyan capability boxes readable; red/green result boxes clear).
  - 3.2 draw-order / 3.6 highlighted state: PASS (DENY vs ALLOW visually
    distinct by color).
  - 5.1 subgraph title: N/A (no subgraphs).
  - 6.1 renders / 6.3 aspect ratio: PASS (content fills 832px, back-link
    visible, no clipping).
- **Final state:** clean.
