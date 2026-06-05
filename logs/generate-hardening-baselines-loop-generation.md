# Generation Log: hardening-baselines-loop

- **sim-id:** hardening-baselines-loop
- **Library:** Mermaid (flowchart TD) + vanilla-JS hover tooltips
- **Bloom level/verb:** Understand / explain
- **Learning objective:** Students can explain the continuous loop among
  baselines, configuration management, and drift detection, and identify how
  outside influences force the baseline to evolve.

## Instructional-design decision

`causal-loop-diagram` spec → a static cyclic diagram with hover reveals (no
animation). The four-node feedback cycle (Baseline → Config Mgmt → Drift →
Baseline) carries the central "hardening is never done" idea; three outside
influences (CIS reference, new vulnerabilities, auditors) feed the baseline.
Drift Detection is highlighted in amber as the focus of ongoing ops attention.

## Implementation approach

- `flowchart TD` with three slate influence nodes feeding the blue Baseline
  Configuration, then Baseline → Config Management (blue) → Drift Detection
  (amber) → back to Baseline, closing the loop.
- Every transition is annotated per the spec ("applied via Ansible/Puppet/IaC",
  "scanners verify: InSpec, OpenSCAP", "exceptions approved, baseline updated, or
  host remediated", "baseline must evolve", "regulatory requirements").
- Per-node detail in a `nodeInfo` map driving a follow-the-cursor tooltip
  (waitForMermaid polling). A bottom legend keys the three color roles.
  CANVAS_HEIGHT comment in `hardening-baselines-loop.js`.

## Validation score

- Before (scaffold): not run.
- After: **100 / 100 (A).**

## Layout review (Claude Vision)

- **Model used:** Claude Opus 4.8 (1M context) vision pass.
- Cycle 1 FAIL: at height 622 the amber Drift Detection node and the legend were
  clipped at the bottom.
- Fix: raised CANVAS_HEIGHT 620 → 720 and synced the copy-paste iframe example
  height.
- Cycle 2: clean. All six nodes with correct color classes, every edge
  annotation, the feedback loop back to the baseline, and the legend render with
  complete text and good contrast; no clipping.
- **Final state:** clean.
