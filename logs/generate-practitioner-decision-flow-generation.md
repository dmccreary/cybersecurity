# Generation Log: practitioner-decision-flow

- **sim-id:** practitioner-decision-flow
- **Library:** Mermaid (flowchart TD)
- **Chapter:** 14 — Societal Security: Law, Ethics, and Privacy
- **Bloom level / verb:** Apply / Apply
- **Learning objective:** Apply the five-gate checklist (Legal, Ethical,
  Forensic, Notification, Public Good) to decide whether and how to act on a
  system, and explain why clearing one gate does not clear the others.

## Instructional-design decision

The spec is a `workflow-diagram` decision tree. "Interactive" means hover/click
reveals. I built a Mermaid TD flow with five sequential decision diamonds, each
with its branch outcome: Legal→STOP, Ethical→Revise (loop back), Forensic→Capture
before continuing, Notification→Alert/start clock, Public Good→Open coordination
channel, terminating in a green "Proceed" node. A right-side panel reveals what
each gate checks and where the chapter introduced it (satisfying the spec's "each
diamond links to the section" intent via hover detail). Apply-level fits a
decision tree the learner walks against a scenario.

## Implementation approach

- `main.html`: schema meta tag, bare `<main>`, Mermaid ESM import, the five-gate
  TD flow with STOP (red), CONTINUE (blue), act-before-continuing (amber), and
  cleared-to-proceed (green) class definitions, legend, and hover panel.
- `practitioner-decision-flow.js`: `// CANVAS_HEIGHT:` comment + standard
  `waitForMermaid` hover wiring (12 nodes).
- Colors per spec: STOP red (#c62828), CONTINUE/gate cybersecurity blue
  (#1565c0), amber (#ffa000) for capture/alert, green (#2e7d32) for proceed.

## Validation

- validate-sims.py: **100 (A)** on the first run.

## Layout review (Claude Vision)

- **Cycle 1 (height 980):** FAIL 2.7 / bottom boundary — the five large decision
  diamonds plus their branch nodes make a very tall flow; only gates 1-3 were
  visible.
- **Cycle 2 (height 1642):** still clipped — gate 5 and the green Proceed node
  remained below the fold (the zigzag layout is taller than estimated).
- **Fix:** raised CANVAS_HEIGHT to 2080.
- **Cycle 3 (height 2082):** all five gates, every branch outcome, and the green
  Proceed terminal node fully visible; complete labels, correct color classes,
  readable Yes/No edge labels, good contrast. **Final state: clean** (expected
  empty space right of the tall diagram — not a defect).

Claude Vision model used: Claude Opus 4.8 (1M context).
