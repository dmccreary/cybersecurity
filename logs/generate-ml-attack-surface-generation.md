# Generation Log: ml-attack-surface

- **sim-id:** ml-attack-surface
- **Library:** Mermaid (flowchart LR)
- **Chapter:** 16 — Emerging Topics and Capstone
- **Bloom level / verb:** Understand / Identify
- **Learning objective:** Identify the stages of the ML training and inference
  pipelines and match each ML-specific attack (data poisoning, adversarial
  evasion, model theft, prompt injection) to the stage it targets,
  distinguishing training-time from inference-time threats.

## Instructional-design decision

The spec is a `workflow-diagram` showing two pipelines with attack arrows
pointing in. "Interactive" means hover/click reveals. I used a Mermaid LR flow
for the legitimate pipeline (collection → cleaning → training → trained model →
production model → output) and added four amber attack nodes connected by red
dotted "attack" edges to the stage each targets (poisoning → collection; evasion,
theft, prompt injection → production model). A right-side panel reveals per-node
detail. This supports an Understand-level objective: the learner sees where each
attack enters and reads how it abuses that point.

## Implementation approach

- `main.html`: schema meta tag, bare `<main>`, Mermaid ESM import, the LR flow,
  four attack nodes, explicit `linkStyle` indices coloring pipeline edges blue
  and attack edges red.
- `ml-attack-surface.js`: `// CANVAS_HEIGHT:` comment + standard `waitForMermaid`
  hover wiring (10 nodes).
- Colors per spec: blue (#1565c0) model stages, light-blue pipeline steps, slate
  (#455a64) data-store cylinder, amber (#ffa000) attacks with red borders/edges.

## Validation

- validate-sims.py: **100 (A)** on the first run.

## Layout review (Claude Vision)

- **Cycle 1 (height 482, 2/3 + 1/3 split):** the WAVE-1 LR symptom — the wide LR
  diagram was scaled into the 66% panel, so node text was too small to read
  (FAIL 1.5) and the diagram bottom-anchored leaving large empty space.
- **Fix:** widened the diagram panel to 76% (info panel to 24%) so each node
  gets more pixels, re-centered the diagram vertically, and reduced CANVAS_HEIGHT
  to 430 to cut wasted vertical space.
- **Cycle 2 (height 432):** node text now legible, all stages and attack edges
  complete and readable, red dotted attack edges clearly point into the correct
  stages, good contrast. **Final state: clean** (minor expected top whitespace
  from LR vertical centering — not a defect).

Claude Vision model used: Claude Opus 4.8 (1M context).
