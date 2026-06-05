# Generation Log: ics-attack-path-explorer

- **sim-id:** ics-attack-path-explorer
- **Library:** p5.js
- **Bloom level/verb:** Apply → Analyze / Apply, Analyze
- **Learning objective:** Given a Purdue-model network with an attacker at Level 5,
  the student places segmentation controls and analyzes the resulting attack path
  length, time to compromise, and blast radius at the Level 1 PLCs.

## Instructional-design decision

The spec states Bloom Apply → Analyze and asks for a manipulable Purdue stack with
defense toggles and a Run-Attack animation. Apply/Analyze → an explorer where the
student sets controls and reads quantitative outcomes. I used a discrete attack
*plan* model (not continuous animation): the token animates a single descent per
run so the focus is on the cause-and-effect between toggled controls and the
readouts, not on watching motion. Narration explains *why* each control held or
failed, which is the analytical payoff.

## Implementation approach

- `computePlan()` walks the attacker from Level 5 toward Level 1. Each boundary has
  a control: the DMZ broker gates IT→OT (3.5), allowlisting gates 3→2, and the MFA
  jump host + disabled RDP gate 2→1. A control "holds" unless Attacker Skill meets
  its bypass threshold; when bypassed it instead adds hops + minutes. The read-only
  historian never fully blocks but shrinks blast radius (protects the safety PLC).
- Visuals: six color-coded bands (slate IT, orange DMZ, blue OT) with device chips,
  a red attacker token that eases toward the deepest reached band, a Result box
  (path length / time / blast radius, color-cued CONTAINED vs reached) and a
  word-wrapped cream Narration panel that reveals lines progressively.
- Controls: 5 checkboxes in the right panel + Attacker Skill slider + Run Attack +
  Reset, all p5 built-ins. `updateCanvasSize()` first; slider resized in
  `windowResized()`; canvas parented to `<main>`.

## Validation score

- Before: scaffold.
- After first run: 88 (A) — flagged missing `educational`/`pedagogical` metadata
  sections (plus the known p5 DOM-function false positive).
- After adding both metadata sections: 98 (A). The remaining −2 is the
  `createButton/createCheckbox/createSlider` false positive; built-ins are required.

## Layout review (Claude Vision, Opus 4.8)

- Walked the checklist on the rendered 800×607 screenshot.
- PASS: title + subtitle legible and unclipped; all six Purdue bands visible with
  correct palette and legible device chips; attacker token rendered at Level 5;
  right panel checkboxes, Result box, and Narration box fully inside the draw area
  with no overflow; control region buttons, slider, and two help lines fit the
  white region without clipping; good contrast throughout; no overlap between
  checkboxes and the Result box.
- No FAILs. **Clean on cycle 1.**

## Final iframe height

607 (CANVAS_HEIGHT 605 + 2). The copy-paste example iframe in index.md was set to
607 to match.
