# Generation Log: secops-activity-map

- **sim-id:** secops-activity-map
- **Library:** Mermaid (flowchart TD)
- **Bloom level / verb:** Understand / Relate (spec left null; this is a `diagram`
  whose purpose is to help the learner *relate* the three secops functions and
  see their feedback loop — comprehension, not application).
- **Learning objective:** Relate the offensive, defensive, and response
  functions of security operations and the activities under each; explain how
  findings, alerts, and lessons cycle between them; describe the purple team and
  threat-intelligence roles.

## Instructional-design decision

A `diagram` (relationship map), not a flow that executes. Per the pipeline,
"interactive" here means hover/click reveal — no animation. Each of the five
nodes reveals a paragraph in the info panel, supporting the Understand-level goal
of relating functions rather than executing a procedure.

## Implementation approach

The spec asked for a triangle layout (Offensive top, Defensive bottom-left,
Response bottom-right) with a central Purple Team and a Threat-Intelligence input
feeding all three. Mermaid does not do literal triangle geometry, so the design
preserves the *relationships* the spec cares about: three function nodes, the
three directional cyclic flows (Offensive→Defensive "Findings improve
detections", Defensive→Response "Alerts trigger investigations",
Response→Offensive "Lessons drive next exercise"), a central Purple Team linked
to all three with undirected edges (integrative, not directional), and Threat
Intelligence at the top feeding all three via dashed "intel" arrows that are
visually distinct from the solid workflow arrows. Colors follow the spec exactly:
Offensive cybersecurity blue `#1565c0`, Defensive slate steel `#455a64`, Response
alert amber `#ffa000`; Purple Team gets purple `#6a1b9a` (its own identity), and
Threat Intel uses cream `#fff8e1` with an amber border to read as a soft input
rather than a function. Activity lists live inside each function-node label
(centre-dot separated) so the map is self-documenting; per-node detail is in the
hover panel. Standard 2/3 + 1/3 layout; responsive breakpoint set to 700px per
the spec.

## Validation score

- First validation run: **100 (A)** — the `educational` and `pedagogical`
  metadata blocks were authored up front (lesson learned from sim 1), so no gap
  was reported.

## Layout review (Claude Vision)

- **Model used:** Claude Opus 4.8 (1M context) vision pass.
- **Cycle 1 (height 720/722):** CLEAN on first render. All five nodes and all
  edge labels are fully visible and uncropped; contrast passes on every node
  (white text on blue/slate/purple, dark text on amber/cream); dashed intel
  arrows are visually distinct from the solid workflow arrows; the three cyclic
  flow labels are legible with white label backgrounds over the connectors. The
  resulting arrangement approximates the requested triangle (offense up, defense
  mid-left, response mid-right, purple team centred below). No clipping, overlap,
  or parse errors.
- **Final state:** clean (no patches needed).
