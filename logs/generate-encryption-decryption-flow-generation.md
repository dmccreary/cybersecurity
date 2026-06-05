# Generation Log: encryption-decryption-flow

- **sim-id:** encryption-decryption-flow
- **Library:** Mermaid (flowchart LR)
- **Bloom level/verb:** Understand / Explain
- **Learning objective:** Students will explain how plaintext becomes ciphertext
  and back using an algorithm plus a key, recognize that symmetric encryption uses
  the same secret key in both directions, and state Kerckhoffs's principle.

## Instructional-design decision

The spec is a `workflow-diagram` for conceptual understanding. Bloom: Understand →
hover-reveal, no animation. A naturally horizontal five-step flow rendered as a
Mermaid `LR` graph, with the single shared-key node feeding both process boxes to
make the "same key in both directions" idea visually unmistakable. Kerckhoffs's
principle is stated as a static callout in the info panel.

## Implementation approach

- `flowchart LR`: Plaintext -> Encryption -> Ciphertext -> Decryption -> Plaintext,
  with an amber `KEY` node connected by dashed "same key" edges to both ENC and DEC.
- Colors per spec: plaintext white, process blue (#1565c0), ciphertext slate
  (#455a64), shared key amber (#ffa000).
- Info panel: color key, Kerckhoffs callout (Algorithm PUBLIC / Key SECRET), and the
  hover Step Details box. Interaction JS in `encryption-decryption-flow.js` carries
  the `// CANVAS_HEIGHT` comment and the `waitForMermaid()` hover wiring.
- `subGraphTitleMargin` set per project rule. Responsive single-column below 700px.

## Validation score

- Before: 50 (C) — scaffold.
- After: 100 (A).

## Layout review (Claude Vision, Opus 4.8)

- PASS: full flow visible and uncropped (all five boxes + shared key + both "same
  key" edges); legend and Kerckhoffs callout fully visible; good contrast; no
  residual strokes; no overlap; no error banner.
- Residual: Mermaid bottom-anchors the wide LR flow, leaving top whitespace, and
  node text is small. Reducing the iframe height further would clip the info-panel
  Step Details box (it needs ~360px), so height was left at 400. The diagram is
  complete and structurally legible; per-step detail is delivered via hover.
- Final state: **clean** (minor top whitespace / small node text only).

## Final iframe height

402 (CANVAS_HEIGHT 400 + 2).
