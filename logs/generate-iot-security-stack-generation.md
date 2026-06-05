# Generation Log: iot-security-stack

- **sim-id:** iot-security-stack
- **library:** Mermaid (flowchart TB)
- **Bloom level / verb:** Understand / Identify
- **Learning objective:** Students can identify the layers of an IoT device
  security stack from the hardware root of trust to the cloud management plane
  and explain why trust diminishes and blast radius grows upward.

## Instructional-design decision

The spec is a layered `diagram` (Bloom: Understand). Interaction is hover-reveal
of each layer's security role — no animation. A Mermaid `flowchart TB` with the
device drawn as a subgraph (silicon at the bottom as the root of trust, layers
stacked upward) plus a separate cloud-backend box above, connected by an amber
mutual-TLS edge, matches the spec's "bottom-to-top trust establishment" framing.

## Implementation approach

- `flowchart TB`; device layers in a titled `subgraph` ("IoT Device"); silicon
  in slate (immutable root of trust), all software layers in brand blue, cloud
  backend in a light-blue framed box.
- The mutual-TLS channel is the 5th edge, restyled amber (`linkStyle 4`) because
  the OTA/firmware path is the most common attack surface.
- Two HTML annotation panels below the diagram carry the spec's "blast radius
  grows upward" (amber) and "trust diminishes upward" (blue) bars.
- Companion `iot-security-stack.js` holds the `// CANVAS_HEIGHT` comment and
  per-node hover tooltips on `.node`.
- `subGraphTitleMargin` set in flowchart config per project standard.

## Validation score

- **100 (A)** on the first validate run (metadata included the educational and
  pedagogical sections from the start, learned from sim 1).

## Layout review (Claude Vision — claude-opus-4-8[1m])

- **Cycle 1 FAIL (6.3 aspect ratio / clipping):** at the initial CANVAS_HEIGHT
  of 760 the screenshot clipped at the Application Code box — the TLS edge,
  cloud backend, and both annotation panels were below the fold. The TB stack
  is genuinely tall.
- **Fix:** captured at 1300 to find the true content extent, set
  `// CANVAS_HEIGHT: 1215` (iframe 1217), re-ran fix-iframe-heights, synced the
  copy-paste example block.
- **Cycle 2:** full diagram visible. Walked the checklist:
  - 1.1–1.5 legibility: PASS (white-on-slate, white-on-blue, dark-on-light
    cloud box, dark annotation text — all readable, no clipped glyphs).
  - 3.1 title / 3.2 draw-order: PASS. Subgraph title "IoT Device" has clear
    margin above the silicon box (subGraphTitleMargin applied).
  - 5.1 subgraph-title collision: PASS (no arrow crosses the title).
  - 6.1 renders / 6.3 aspect ratio: PASS (content fills 1217px, back-link at
    bottom, no clipping).
- **Final state:** clean.
