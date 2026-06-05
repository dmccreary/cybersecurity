# Generation Log: cyber-kill-chain-controls

- **sim-id:** cyber-kill-chain-controls
- **Library:** Mermaid (flowchart LR) + vanilla-JS hover tooltips
- **Bloom level/verb:** Understand / map
- **Learning objective:** Students can map each Cyber Kill Chain phase to the
  controls that disrupt it and explain why breaking the chain at any one phase
  defeats the attack.

## Instructional-design decision

`workflow-diagram` spec → hover reveals + a static, scannable flow (no
animation). The 7 phases read left→right; each box prints its key controls so
the diagram is useful at a glance, and hovering reveals the full control list
plus what the attacker is doing in that phase. The "break the chain" idea is the
load-bearing concept, so it is carried by a prominent top callout banner with the
spec's exact caption AND a "BREAK THE CHAIN" node feeding dashed arrows into the
chain.

## Implementation approach

- `flowchart LR` with 8 nodes (7 phases + 1 break node) and a blue→red classDef
  gradient (P1 #1565c0 … P7 #e53935) encoding the early-cheap / late-costly cost
  curve.
- Each phase label includes 2–3 control examples via `<br/>`; full descriptions
  live in the `nodeInfo` map driving a follow-the-cursor tooltip.
- Tooltip wiring uses the guide's robust `waitForMermaid()` polling so it works
  inside the iframe.
- CANVAS_HEIGHT comment lives in `cyber-kill-chain-controls.js` so
  fix-iframe-heights can read it (named to match the sim id, not `script.js`).

## Validation score

- Before (scaffold): not run.
- After: **100 / 100 (A).**

## Layout review (Claude Vision)

- **Model used:** Claude Opus 4.8 (1M context) vision pass.
- Cycle 1 FAIL: wiring a dashed Break→edge into all 7 phases forced Dagre to
  cascade the chain into a diagonal staircase, shrinking the boxes and wasting
  horizontal space.
- Fix: reduced the dashed break-arrows to 3 representative ones (early/mid/late),
  which let the chain render as a near-horizontal row while still showing the
  defender can intervene at any point. Also trimmed CANVAS_HEIGHT from 430 → 250
  to remove the large bottom whitespace.
- Cycle 2: clean. All 7 phases visible with complete control text, gradient
  correct, callout banner and legend present, no clipping, good contrast.
- **Final state:** clean.
