# Generation Log: mitm-arp-spoofing

- **sim-id:** mitm-arp-spoofing
- **Library:** Mermaid (sequenceDiagram)
- **Bloom level/verb:** Understand / Describe
- **Learning objective:** Students will describe how gratuitous ARP replies poison
  the client and gateway caches, trace how the attacker ends up on path, and explain
  why HTTPS with certificate validation defeats the impersonation.

## Instructional-design decision

The spec is a workflow/sequence diagram (Bloom Understand). Per the pipeline, a
workflow diagram is "interactive" through its numbered, color-coded flow and view
structure, not animation. A Mermaid `sequenceDiagram` with `autonumber` is the
faithful representation: it reads top-to-bottom as a story (normal flow → attack
begins → poisoned flow) and the amber `Note over` separators mark the three phases.

## Implementation approach

- Built on the known-good wave-1 sequence-diagram base (device-attestation-flow):
  `theme: base` with explicit `themeVariables`, `useMaxWidth: true`,
  `showSequenceNumbers: true`, `wrap: true`.
- Four actors (Client, Attacker, Gateway, Internet). Three `Note over` phase
  separators and ten autonumbered messages covering the ARP resolution, the
  gratuitous-ARP poisoning of both caches, and the relayed HTTP request/response.
- An amber HTML `.note` below the diagram states the HTTPS defense (the relayed
  traffic is opaque ciphertext; a substituted cert fails validation).
- Avoided the documented Mermaid pitfalls: no `rect rgb()` highlight blocks, no
  parentheses/`<br/>`-laden message text, and used em-dashes instead of colons
  inside message bodies where a stray colon could confuse the parser.
- `.js` carries the `// CANVAS_HEIGHT:` comment for fix-iframe-heights.

## Validation score

- Before: scaffold.
- After: 100 (A) once the iframe height matched the rendered content.

## Layout review (Claude Vision, Opus 4.8)

- Cycle 1 FAIL: at the initial CANVAS_HEIGHT (720) the diagram was clipped — the
  screenshot cut off at message 9, hiding message 10 and the entire amber defense
  note. (Sequence-diagram height is content-driven and I under-estimated it.)
- Diagnosis: captured at 900px to see the true content extent; the in-`<main>`
  content ends at ~840px.
- Fix: set CANVAS_HEIGHT to 845, re-ran fix-iframe-heights (→847), updated the
  copy-paste example iframe to 847, re-screenshotted.
- Cycle 2: all PASS — title/subtitle legible; four actor boxes clear; three amber
  phase notes readable; all ten autonumbered messages and their labels legible with
  no overlap; full defense note visible; no clipping top or bottom. **Clean.**
- Note on color: the spec asked for per-actor colors (blue client, slate gateway,
  orange attacker). Mermaid sequence diagrams apply a single actor theme color and
  do not reliably support per-actor backgrounds (a documented wave-1 caveat), so
  actors are uniform blue while phase semantics are carried by the amber notes. This
  is a faithful, clean rendering of the spec's intent.

## Final iframe height

847 (CANVAS_HEIGHT 845 + 2). Copy-paste example iframe also set to 847.
