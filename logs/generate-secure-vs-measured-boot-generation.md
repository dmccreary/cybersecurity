# Generation Log: secure-vs-measured-boot

- **sim-id:** secure-vs-measured-boot
- **Library:** Mermaid (`flowchart TB` with two subgraphs) + info panel + hover JS
- **Bloom level / verb:** Understand / Compare
- **Learning objective:** Students can compare Secure Boot (enforcement) with
  Measured Boot (recording), explain what a PCR's extend-only property
  guarantees, and say why production platforms run both.

## Instructional-design decision

A `workflow-diagram` spec → hover/click reveals, no animation. The load-bearing
idea is the *contrast* between enforce-and-halt vs. record-and-continue, so the
two flows are placed side by side (two `flowchart TB` subgraphs at the same
rank) and the closing "use BOTH" caption is given prominence in the info panel.
Node labels are kept short per the WAVE-1 learning that wide Mermaid flows shrink
text; the full per-stage explanation lives in a hover detail panel (same pattern
as certificate-chain-of-trust).

## Implementation approach

- `main.html`: certificate-chain-of-trust-style 62/38 split — diagram panel
  (left) + info panel (right) with a legend, an amber "PCRs are extend-only"
  callout, a blue "use BOTH" caption, and a Stage Details hover target.
- Mermaid: left subgraph Secure Boot with three `Verify ...` nodes each branching
  to a red `FAIL → HALT` diamond on bad signature; right subgraph Measured Boot
  with hash/extend nodes (PCR 0, 4, 8/9), an unconditional kernel run, and a TPM
  PCR result node. Class defs: slate hw, blue verify/measure, green run, amber
  TPM, red halt. Avoided `[ ]` in node text (used "PCR 0", "PCR 8 and 9") to dodge
  Mermaid label-parsing pitfalls.
- `secure-vs-measured-boot.js`: `// CANVAS_HEIGHT: 540`, node-hover handler that
  populates the Stage Details panel (same robust `.node` id-stripping pattern as
  the reference Mermaid sims).
- Responsive: panels stack below 700px (CSS media query).

## Validation score

- Before: not measured (built complete from the start).
- After: 100 (A).

## Layout review (Claude Vision)

Two cycles. First screenshot at 642px rendered cleanly but left a tall band of
dead space under the diagram (Mermaid diagram is ~470px). Lowered CANVAS_HEIGHT
640 → 540, re-ran fix-iframe-heights (→ 542), re-screenshotted.

Checklist on the 800x542 screenshot — all PASS / N/A:

- 1.1–1.4 text: PASS (all node labels legible, FAIL→HALT diamonds readable, code
  span in callout readable).
- 5.1 Mermaid subgraph titles vs arrows: PASS (titles clear of arrows).
- 3.x draw order / panels: PASS.
- 4.x color hierarchy: PASS (slate hw / blue verify / green run / red halt /
  amber TPM — meaningful, not noisy).
- legend + both callouts + stage panel: PASS, all visible, no overflow.

**Final state: clean.**

**Claude Vision model:** Claude Opus 4.8 (1M context), model id claude-opus-4-8[1m].
