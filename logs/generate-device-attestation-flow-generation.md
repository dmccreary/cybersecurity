# Generation Log: device-attestation-flow

- **sim-id:** device-attestation-flow
- **Library:** Mermaid (sequenceDiagram)
- **Bloom level/verb:** Understand / trace
- **Learning objective:** Students can trace the TPM remote-attestation exchange
  among verifier, device, and hardware root of trust, and explain why trust
  depends on both the EK certificate and a current PCR policy.

## Instructional-design decision

`workflow-diagram` spec describing a 3-actor sequence → a static, numbered
top-to-bottom message flow (no animation; sequence diagrams have no per-node
hover targets). The four verifier checks are surfaced as a highlighted amber note
over the verifier; the trust caveat (the operational footgun) is a styled HTML
note beneath the diagram.

## Implementation approach

- Mermaid `sequenceDiagram` with `autonumber` and three participants
  (Verifier / Device / TPM). Theme variables set blue actor boxes, slate signal
  lines, and amber notes.
- Five messages reproduce the spec steps; `||` was written as "plus" and
  parentheses kept minimal to stay parser-safe.
- The CANVAS_HEIGHT comment lives in `device-attestation-flow.js` so
  fix-iframe-heights can read it.

## Validation score

- Before (scaffold): not run.
- After: **100 / 100 (A).**

## Layout review (Claude Vision)

- **Model used:** Claude Opus 4.8 (1M context) vision pass.
- Cycle 1 FAILs:
  1. The verifier-checks note was `Note over V` (centered over one actor), so its
     box was narrower than the text and clipped the leading "(a)" / "(d)".
  2. At height 520 the diagram itself filled the frame and the bottom HTML trust
     note was cut off.
- Fixes: changed the note to `Note over V,D` (wider box) and renumbered the four
  checks as 1–4 to avoid leading-parenthesis clipping; raised CANVAS_HEIGHT
  520 → 660 so the full diagram plus the bottom note are visible; synced the
  copy-paste iframe example height.
- Cycle 2: clean. All actors, numbered messages, the four-check note, and the
  bottom trust note render with complete text and good contrast.
- Residual (accepted, not a defect): the spec suggested the TPM lane in
  slate-steel, but Mermaid sequence diagrams share one actor background; per-actor
  tinting would require the experimental `box` syntax and add clutter, so all
  actor boxes are blue. Functional content is fully faithful.
- **Final state:** clean (one accepted cosmetic color deviation).
