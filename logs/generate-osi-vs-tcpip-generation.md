# Generation Log: osi-vs-tcpip

- **sim-id:** osi-vs-tcpip
- **Library:** Static SVG with hover tooltips
- **Bloom level/verb:** Understand / Compare
- **Learning objective:** Students will map each OSI layer to its TCP/IP counterpart,
  identify example protocols at each layer, and associate common attacks with the
  layer they target.

## Instructional-design decision

An `infographic-svg` spec at Bloom Understand → static two-column comparison with
hover reveals (not animation). The interaction is the dashed layer-mapping plus
per-layer hover tooltips that name protocols and one example control, anchored to a
"where attacks live" column so the model connects to security practice.

## Implementation approach

- Inline SVG (fixed viewBox, scales to container). Left column: 7 OSI bands in
  cybersecurity blue, Application at top → Physical at bottom, each labeled with
  number, name, and example protocols. Center column: 4 TCP/IP bands in slate, each
  sized to span the OSI layers it covers (Application spans OSI 5–7, Link spans OSI
  1–2) and labeled with the span. Dashed slate lines connect each OSI band's right
  edge to the center of its TCP/IP band. Right column: four amber "where attacks
  live" callouts (L2/L3/L4/L7) with wrapped attack lists.
- Each OSI and TCP/IP band is a hot region with a hover/tap tooltip (protocols +
  example control). A small SVG text-wrapper keeps the attack callouts on two lines.
- The `.js` carries the CANVAS_HEIGHT comment.

## Validation score

- Before: scaffold.
- After: 100 (A) on the first validation run.

## Layout review (Claude Vision, Opus 4.8)

- Cycle 1: rendered clean and complete — all three columns, the spanning TCP/IP
  bands, correct dashed mappings, and the attack callouts all legible with no
  overlap or clipping. The only nit was extra bottom whitespace (iframe taller than
  content).
- Fix: tightened CANVAS_HEIGHT 560→500 so the diagram fills the iframe; re-ran
  fix-iframe-heights (→502) and synced the copy-paste example.
- Cycle 2: all PASS — diagram fills the frame, OSI 7 layers / TCP/IP 4 layers /
  attack callouts all present, dashed mapping lines correct (5–7→Application,
  1–2→Link), good contrast, no clipping. **Clean.**

## Final iframe height

502 (CANVAS_HEIGHT 500 + 2). Copy-paste example iframe also set to 502.
