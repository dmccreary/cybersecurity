# Generation Log: picerl-lifecycle

- **sim-id:** picerl-lifecycle
- **Library:** Mermaid (flowchart LR)
- **Bloom level/verb:** Understand / Describe
- **Learning objective:** Students will name the six PICERL phases in order, explain
  what happens in each, and describe how the Lessons Learned → Preparation feedback
  loop improves future incident response.

## Instructional-design decision

A workflow-diagram spec at Bloom Understand → static lifecycle diagram (no
animation). The pedagogical core is the *closed loop*: I made the feedback edge from
Lessons Learned back to Preparation a visually distinct dashed blue arrow so the
"lifecycle, not checklist" idea is unmistakable.

## Implementation approach

- Mermaid `flowchart LR` with the six phases connected P→I→C→E→R→L and a dashed
  `L -.-> P` feedback edge styled blue via `linkStyle`. Each node label carries the
  phase name, a one-line description, and a typical time/effort label.
- Color via classDefs: Preparation and Lessons Learned in cybersecurity blue (the
  between-incident phases), Containment in amber (most time-critical), the
  active-incident phases in slate. An HTML legend explains the color roles and a
  note reinforces the feedback loop.
- The spec's "clock-face time annotation" is realized as per-node time labels (a
  literal clock face is not achievable in Mermaid); the relative ordering of effort
  is preserved. The `.js` carries the CANVAS_HEIGHT comment.

## Validation score

- Before: scaffold.
- After: 100 (A) on the first validation run.

## Layout review (Claude Vision, Opus 4.8)

- Cycle 1: rendered clean — six phases left to right with correct colors, all node
  text legible, the dashed blue feedback edge labeled and visible, legend and note
  clear, no overlap or clipping. The only issue was excess bottom whitespace (iframe
  taller than content).
- Fix: tightened CANVAS_HEIGHT 360→250; re-ran fix-iframe-heights (→252) and synced
  the copy-paste example.
- Cycle 2: all PASS — diagram fills the frame, no clipping, good contrast. **Clean.**

## Final iframe height

252 (CANVAS_HEIGHT 250 + 2). Copy-paste example iframe also set to 252.
