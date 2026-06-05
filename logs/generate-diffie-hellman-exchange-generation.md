# Generation Log: diffie-hellman-exchange

- **sim-id:** diffie-hellman-exchange
- **Library:** Mermaid (sequenceDiagram)
- **Bloom level / verb:** Understand / Explain
- **Learning objective:** Students will explain why two parties can establish a
  shared secret over a channel an eavesdropper fully observes.

## Instructional-design decision

The spec type is `workflow-diagram`. Per the pipeline, "interactive" for a
workflow diagram means a responsive, readable static diagram — not animation.
The MicroSim is a Mermaid sequence diagram, which matches the Understand Bloom
level (trace the protocol, distinguish public from secret values, explain the
hardness assumption).

## Implementation approach

- Mermaid `sequenceDiagram` with three actors: Alice (left), Network/Eve
  (center), Bob (right). `autonumber` numbers the two transmitted messages.
- Public parameters p and g are shown in an amber callout box above the diagram
  (HTML, not a Mermaid node, so it reads as a precondition).
- Notes over Alice and Bob mark the private exponents "kept secret"; notes over
  Eve show that she sees A and B on the wire; a final note over Eve states she
  has p, g, A, B but cannot find s (discrete log problem) with a trailing "?".
- Custom themeVariables apply the brand palette: cybersecurity-blue actor boxes,
  slate signal arrows, amber notes on a cream background.
- `useMaxWidth: true` scales the SVG to the container; a resize listener reasserts
  max-width.
- CANVAS_HEIGHT comment in diffie-hellman-exchange.js drives the iframe-height tool.

## Validation score

- Before (scaffold): not run (placeholder).
- After: **100 / 100 (grade A).**

## Layout review (Claude Vision)

- Model: Claude Opus 4.8 (1M context) vision.
- **Cycle 1 FAIL — 6.3 bottom clipping:** at the initial CANVAS_HEIGHT of 640 the
  diagram was cut off after Alice's "Computes s = B^a mod p" note; Bob's compute
  step, the shared-secret note, and Eve's final note were below the iframe.
  - **Fix:** raised CANVAS_HEIGHT to 860, re-ran fix-iframe-heights, re-screenshot.
- **Cycle 2 partial — 6.3:** Eve's final note's bottom border sat right at the
  iframe edge at 862.
  - **Fix:** raised CANVAS_HEIGHT to 900 for clear bottom padding.
- **Cycle 3:** full diagram visible — all notes, both transmissions, both
  compute steps, the shared-secret note, and Eve's "?" note render with bottom
  padding; text unclipped; brand-color theming reads cleanly.
- **Final state:** clean.
- Note: also synced the copy-paste iframe example height in index.md to match the
  embedded iframe after each height change.
