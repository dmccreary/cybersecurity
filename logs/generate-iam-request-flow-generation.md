# Generation Log: iam-request-flow

- **sim-id:** iam-request-flow
- **library:** Mermaid (sequenceDiagram)
- **Bloom level / verb:** Understand / Describe
- **Learning objective:** Students can describe the sequence of messages in a
  federated authentication flow (SAML / OIDC) and explain why the Service
  Provider trusts a signed identity token rather than handling credentials.

## Instructional-design decision

The spec is a `workflow-diagram` of a four-lane federated login. Bloom level is
Understand, so the interaction is hover-reveal of concrete data, not animation.
A Mermaid `sequenceDiagram` is the faithful representation: four participants
(User, Browser, IdP, SP) and nine numbered messages. Hover tooltips on each
numbered message and each actor lane carry the "why this step matters" content;
a persistent legend below the diagram states the IdP-authenticates /
SP-authorizes division of trust and the signature/expiry/audience checks.

## Implementation approach

- `sequenceDiagram` with `autonumber` and `showSequenceNumbers`; custom
  `themeVariables` apply the brand palette (slate actors, cream/amber notes,
  slate signal text).
- Companion `iam-request-flow.js` carries the `// CANVAS_HEIGHT: 620` comment
  and attaches floating-tooltip hover handlers keyed by the autonumber on each
  `.messageText`, by actor name on `text.actor`, and on the two `Note` rects.
- A static legend block states the key trust-division insight so the
  educational content is visible even without hovering.

## Validation score

- Before metadata fix: **90 (A)** — flagged missing `educational` and
  `pedagogical` metadata sections.
- After adding both sections: **100 (A)**.

## Layout review (Claude Vision — claude-opus-4-8[1m])

- **Cycle 1 FAIL (6.1 renders):** screenshot showed Mermaid "Syntax error in
  text". Root cause traced via a minimal repro harness: a **semicolon** in the
  note text `Verify signature, expiry, audience; extract claims` — Mermaid
  treats `;` as a statement separator, corrupting the parse. (Parenthesised
  participant aliases like `(IdP)` were also removed proactively per WAVE-1
  learnings.)
- **Fix:** replaced the semicolon with ", then" — `Verify signature, expiry,
  audience, then extract claims`.
- **Cycle 2:** re-rendered cleanly. Walked the full checklist:
  - 1.1–1.5 text legibility: PASS (all messages, actor labels, notes, legend
    fully visible; white-on-slate, dark-on-cream, blue legend — good contrast).
  - 2.x controls: N/A (no controls — hover-only sim).
  - 3.1 title: PASS (centered, no overlap).
  - 5.x: N/A (no subgraphs, network edges, charts, or maps).
  - 6.1 renders: PASS. 6.3 aspect ratio: PASS (content fills 622px).
- **Known minor deviation:** the spec asked for a cybersecurity-blue IdP lane
  vs. slate SP lane. Mermaid sequence diagrams apply a single global `actorBkg`
  and do not support per-actor background colours without fragile DOM hacks, so
  both actor boxes are slate. Educationally faithful; left as-is.
- **Final state:** clean.
