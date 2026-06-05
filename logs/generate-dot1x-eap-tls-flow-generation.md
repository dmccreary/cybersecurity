# Generation Log: dot1x-eap-tls-flow

- **sim-id:** dot1x-eap-tls-flow
- **Library:** Mermaid (sequenceDiagram)
- **Bloom level / verb:** Understand / Explain
- **Learning objective:** Students will explain the roles of the supplicant,
  authenticator, and RADIUS server in an 802.1X / EAP-TLS exchange and identify
  where the trust decision is actually made.

## Instructional-design decision

The spec type is `workflow-diagram`. Per the pipeline, this is a static,
responsive Mermaid sequence diagram (not animation), matching the Understand
Bloom level: trace the message flow and explain each party's role.

## Implementation approach

- Mermaid `sequenceDiagram` with three actors: Supplicant, Authenticator, RADIUS
  Server. `autonumber` numbers the seven messages.
- Notes over each actor state the standing facts: the supplicant holds the
  private key and client cert; the authenticator relays encrypted EAP and never
  sees secrets; the RADIUS server validates the client cert against the corporate
  CA and logs the event.
- The TLS mutual-handshake step is a full-width spanning note (S to R) that reads
  as a callout box emphasizing where mutual certificate validation happens.
- Brand-palette themeVariables: cybersecurity-blue actor boxes, slate signal
  arrows, amber notes on a cream background.
- CANVAS_HEIGHT comment in dot1x-eap-tls-flow.js (900) drives the iframe height
  (902px); the full flow including the closing "Now on the network" note fits.

## Validation score

- Before (scaffold): not run (placeholder).
- After: **100 / 100 (grade A).**

## Layout review (Claude Vision)

- Model: Claude Opus 4.8 (1M context) vision.
- **Cycle 1 FAIL — Mermaid parse error (bomb / "Syntax error in text"):** the
  first build used a `rect rgb(...) ... end` highlight block wrapping a note, plus
  `<br/>` and parentheses inside participant aliases, plus colons inside message
  text (`EAP-Request: Identity?`). One or more of these broke the Mermaid parser.
  - **Fix:** rebuilt the diagram from the known-good diffie-hellman-exchange
    main.html as a base; removed the `rect` block (the TLS step is now a
    full-width spanning note instead), used single-word/plain participant aliases,
    and rewrote message text to use commas instead of inner colons and "alice at
    corp" instead of an `@`-address.
  - (Note: an early round of bisecting was misled by invoking
    `bk-capture-screenshot .` with a `.` path, which writes to `..png` and left
    the real PNG stale; re-running with the absolute sim path confirmed the
    rebuilt diagram renders.)
- **Cycle 2:** full diagram renders — three blue actors, three amber role notes,
  seven numbered messages, the wide amber TLS-handshake callout, and the closing
  "Now on the network" note, all unclipped within 902px.
- **Final state:** clean.
