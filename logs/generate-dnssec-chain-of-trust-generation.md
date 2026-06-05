# Generation Log: dnssec-chain-of-trust

- **sim-id:** dnssec-chain-of-trust
- **Library:** Mermaid (flowchart TD) + vanilla-JS hover details panel
- **Bloom level/verb:** Understand / trace
- **Learning objective:** Students can trace the DNSSEC chain of trust and
  explain how DS records link each zone to its parent, and why any broken link
  causes the resolver to return SERVFAIL.

## Instructional-design decision

`tree-diagram` spec → a static top-down chain plus a fixed side panel (no
animation). The diagram shows how the chain is *built* (root → TLD → bank → leaf)
while the right-hand panel lists how a resolver *validates* it (bottom-up), making
the direction reversal explicit. Hovering a zone updates a detail box.

## Implementation approach

- `flowchart TD` with four nodes: green root (trust anchor, with ✓), two blue DS
  link nodes, and a slate leaf A-record node, joined by "signs" edges.
- Right column holds the five resolver steps as an ordered list plus a red
  "Any failure → REJECT (SERVFAIL)" callout — the spec's failure annotation.
- Hover details live in a `nodeInfo` map driving a panel below the resolver list,
  wired with the guide's `waitForMermaid()` polling.
- Flex layout: diagram and panel sit side-by-side and wrap to a single column on
  narrow screens. CANVAS_HEIGHT comment in `dnssec-chain-of-trust.js`.

## Validation score

- Before (scaffold): not run.
- After: **100 / 100 (A).**

## Layout review (Claude Vision)

- **Model used:** Claude Opus 4.8 (1M context) vision pass.
- Cycle 1 FAIL: at height 470 the vertical TD chain (4 tall nodes) was clipped —
  only the top two nodes were visible.
- Fix: raised CANVAS_HEIGHT 470 → 640, then → 670 for bottom breathing room, and
  synced the copy-paste iframe example height.
- Cycle 2: clean. All four chain nodes (green anchor → blue → blue → slate leaf)
  with "signs" labels, the resolver step list, and the red REJECT callout render
  with complete text and good contrast; no clipping.
- **Final state:** clean.
