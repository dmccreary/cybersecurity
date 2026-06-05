# Generation Log: forensic-workflow

- **sim-id:** forensic-workflow
- **Library:** Mermaid (flowchart TD) + vanilla-JS hover tooltips
- **Bloom level/verb:** Understand / sequence
- **Learning objective:** Students can sequence the steps of a digital forensic
  investigation and explain why analysis is performed on a verified copy and why
  every step writes to the chain-of-custody log.

## Instructional-design decision

`workflow-diagram` spec → a static top-down flow with hover reveals (no
animation). Nine ordered steps including two decision diamonds (power decision,
hash-verify gate with a re-image loopback). The chain-of-custody log is modeled
as a node that several steps connect to with dashed edges, conveying the
"continuous, every-step" rail the spec asks for.

## Implementation approach

- `flowchart TD` with color classes matching the palette: slate (#455a64) for
  procedural steps 1/6/8, blue (#1565c0) for technical steps 2/4/7, amber for the
  two decision diamonds, cream (#fff8e1) with slate border for the court node, and
  a light-blue log node.
- Hash-verify diamond branches `Yes → Examination Copy` and `No: re-image → back
  to Forensic Imaging`.
- Per-step detail in a `nodeInfo` map driving a follow-the-cursor tooltip
  (waitForMermaid polling). CANVAS_HEIGHT comment in `forensic-workflow.js`.

## Validation score

- Before (scaffold): not run.
- After: **100 / 100 (A).**

## Layout review (Claude Vision)

- **Model used:** Claude Opus 4.8 (1M context) vision pass.
- Cycle 1 FAIL: at height 760 only the first ~4 nodes were visible. The diagram's
  natural height (9 nodes + 2 large multi-line diamonds + LOG rail) is ~1600px;
  the multi-line power-decision diamond was especially oversized.
- Fixes: shortened the Power Decision diamond label to a single line (detail moved
  to its tooltip), trimmed every node body to two lines, and raised CANVAS_HEIGHT
  760 → 1620 so the whole pipeline plus the Chain of Custody Log node fit. Synced
  the copy-paste iframe example height.
- Cycle 2: clean. All nine steps with correct color classes, both decision
  diamonds, the Yes / No-re-image branch labels, and the LOG node with its dashed
  in-edges all render with complete text and good contrast.
- **Final state:** clean.
