# Generation Log: privacy-decision-tree

- **sim-id:** privacy-decision-tree
- **library:** Mermaid (flowchart TD)
- **Bloom level / verb:** Apply / Apply
- **Learning objective:** Students can apply a structured decision process to
  decide whether and how to collect a proposed data field, and map each branch to
  the GDPR/CCPA principle it enforces.

## Instructional-design decision

The spec is a top-down decision tree a reviewer walks per data field. This is an
Apply-level task (run the procedure on a real field), so the interaction is
hover-reveal of the principle behind each decision — no animation. A Mermaid
`flowchart TD` with decision diamonds maps the spec exactly.

## Implementation approach

- Five decision diamonds (blue), three approve/use leaves (slate), and two
  stop leaves (alert-orange #ffa000): "Do not collect" and "Stop. Do not share."
- Branch edge labels (No/Yes, "retention window set") follow the spec's tree.
- A persistent note below the diagram maps the four branches to their named
  principles (purpose limitation, data minimization, storage limitation, lawful
  basis) and notes both GDPR and CCPA/CPRA carry them.
- Companion `privacy-decision-tree.js` carries the CANVAS_HEIGHT comment and
  per-node hover tooltips citing the specific GDPR article / CCPA principle.

## Validation score

- **100 (A)** on the first validate run.

## Layout review (Claude Vision — claude-opus-4-8[1m])

- **Cycle 1 (height):** scratch-harness render confirmed clean parse and correct
  colors, but the tree is tall (5 large diamonds). At 820 it clipped badly.
- **Fix:** measured true extent (~1565px) via a 1700px capture; set
  `// CANVAS_HEIGHT: 1570` (iframe 1572), re-ran fix-iframe-heights, synced the
  example block.
- **Cycle 2:** walked the checklist:
  - 1.1–1.5 legibility: PASS (white-on-blue decision text, white-on-slate
    leaves, dark-on-amber stop leaves; all branch labels readable).
  - 3.6 highlighted state: PASS (stop leaves clearly distinct in amber from the
    slate approve leaves).
  - 5.1 subgraph title: N/A.
  - 6.1 renders / 6.3 aspect ratio: PASS (fills 1572px, note and back-link
    visible, no clipping).
- **Final state:** clean.
