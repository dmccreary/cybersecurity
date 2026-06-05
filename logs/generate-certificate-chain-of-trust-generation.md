# Generation Log: certificate-chain-of-trust

- **sim-id:** certificate-chain-of-trust
- **Library:** Mermaid (flowchart TB + three subgraph tiers)
- **Bloom level/verb:** Understand / Explain
- **Learning objective:** Students will explain how a certificate chain links an
  end-entity certificate back to a trusted root, and trace the reverse
  verification path a browser walks to establish trust.

## Instructional-design decision

The spec is a `diagram` for conceptual understanding of PKI. Bloom: Understand →
hover-reveal of concrete data, no animation. I used a top-down Mermaid hierarchy
with three subgraph tiers (Root / Intermediates / End-entities) and put the
spec's "Verification path" reverse-direction callout as static structured text in
the info panel, where it reinforces the top-down vs bottom-up contrast. Hover/tap
on any node reveals its role.

## Implementation approach

- `flowchart TB` with three subgraphs; "signs" edge labels run top-down.
- Root node styled blue (#1565c0) with a 4px gold (#d4af37) border = trust anchor;
  intermediates slate (#455a64); leaves white with orange (#d84315) border — all
  per spec.
- Info panel (40% width to fit the multi-line verification callout) holds: a color
  legend, the amber Verification path ordered list, and the hover Node Details box.
- Interaction JS in `certificate-chain-of-trust.js` carries the `// CANVAS_HEIGHT`
  comment and the `waitForMermaid()` hover wiring (mouseenter + click).
- `subGraphTitleMargin` set per project rule (three subgraph titles). Responsive
  single-column stack below 700px.

## Validation score

- Before: 50 (C) — scaffold.
- After: 100 (A).

## Layout review (Claude Vision, Opus 4.8)

Walked the visual checklist against the screenshot.

- PASS: all text complete and legible (no clipping, no residual strokes, good
  contrast); legend present and correct; verification callout fully visible;
  "signs" edge labels readable; all three leaf nodes fully visible with intact
  orange borders; no overlap; no error banner.
- Residual: some empty aliceblue above the Root tier (Mermaid TB diagrams pack
  toward the bottom). Minor and cosmetic — the diagram is tall and legible, the
  bottom leaf row is fully within frame, so no height change was warranted.
- Final state: **clean** (negligible top whitespace).

## Final iframe height

542 (CANVAS_HEIGHT 540 + 2).
