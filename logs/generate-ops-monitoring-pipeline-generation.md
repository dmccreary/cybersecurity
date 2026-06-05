# Generation Log: ops-monitoring-pipeline

- **sim-id:** ops-monitoring-pipeline
- **library:** Mermaid (flowchart TD)
- **Bloom level / verb:** Understand / Describe
- **Learning objective:** Students can describe the stages telemetry passes
  through from source to SOC analyst and explain the analyst-to-SIEM feedback
  loop and the purpose of tiered log retention.

## Instructional-design decision

The spec is a 5-stage operations pipeline (Bloom: Understand). Interaction is
hover-reveal per stage — no animation. The spec asked for `graph LR` with
subgraphs, but the WAVE-1 learnings warn that LR diagrams bottom-anchor and
shrink node text, and that Mermaid subgraph layout is unpredictable.

## Implementation approach

- Started LR with subgraphs as specified, then a TD-with-subgraphs variant —
  both rendered as sprawling, hard-to-follow layouts (Mermaid ignored the inner
  `direction` hints and stacked sources vertically while placing SOAR beside
  them). Documented this in two scratch-harness render tests.
- Final design: a clean `flowchart TD` of **five single stage boxes**, each
  listing its components inline via `<br/>`. Colors per spec: slate sources,
  gray collection, blue SIEM core, amber SOAR, cream analyst.
- The analyst-to-SIEM feedback edge ("tune rules, suppress noise") renders as a
  clean back-curve. A retention-tier strip sits below the diagram.
- Companion `ops-monitoring-pipeline.js` carries the CANVAS_HEIGHT comment and
  per-stage hover tooltips (keyed to the 5 box IDs).

## Validation score

- **100 (A)** on the first validate run.

## Layout review (Claude Vision — claude-opus-4-8[1m])

- **Cycle 1 (LR):** FAIL — sprawling, tiny text, hard to follow (the documented
  LR/subgraph failure mode).
- **Cycle 2 (TD + subgraphs):** still FAIL — subgraphs stacked unpredictably and
  the diagram exceeded the viewport awkwardly.
- **Cycle 3 (TD, 5 stage boxes):** PASS. Measured true content extent (~880px)
  via a tall capture, set `// CANVAS_HEIGHT: 890` (iframe 892). Walked checklist:
  - 1.1–1.5 legibility: PASS (all stage labels and component lists readable;
    white-on-slate/blue and dark-on-amber/cream all high-contrast).
  - 3.1 title / 3.2 draw-order: PASS.
  - 3.6 feedback edge: PASS (the "tune rules, suppress noise" back-curve is
    clearly distinct from the forward flow).
  - 6.1 renders / 6.3 aspect ratio: PASS (fills 892px, retention strip and
    back-link visible, no clipping).
- **Final state:** clean (deviated from the spec's LR-with-subgraphs to a TD
  stage-box pipeline for legibility; all spec content preserved).
