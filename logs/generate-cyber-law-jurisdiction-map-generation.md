# Generation Log: cyber-law-jurisdiction-map

- **sim-id:** cyber-law-jurisdiction-map
- **Library:** p5.js
- **Bloom level / verb:** Understand → Analyze / Identify
- **Learning objective:** Given a hypothetical data-handling scenario, students
  will identify which laws apply and explain why each one reaches the scenario.

## Instructional-design decision

The spec is an `interactive-infographic` with Bloom Understand→Analyze. Per the
pipeline, "interactive" here means hover-reveal and a view toggle (scenario
selector), not looping animation. The MicroSim is a static jurisdictional map
with two interactions: (1) hover a statute card for its details, and (2) select
a scenario to highlight applicable laws and explain why. This Analyze-level
interaction asks the learner to reason about jurisdiction rather than watch an
animation.

## Implementation approach

- Three vertical bands rendered with hand-rolled p5 cards: U.S. Federal (CFAA,
  ECPA, HIPAA, GLBA, FERPA, blue header), U.S. State (CCPA/CPRA + "+19 other
  state laws", slate header), International (GDPR, NIS2, purple header).
- Each statute card carries scope / who-is-regulated / key-obligation /
  breach-notification-window, shown in a hover tooltip that flips left/right to
  stay on-canvas.
- A `createSelect` scenario dropdown (5 presets + a default prompt) sits in the
  control area. Selecting a scenario highlights applicable cards in cybersecurity
  blue with a heavier border, dims the rest to gray, and populates the right-hand
  side panel with a per-law explanation of why it applies (by data subject, data
  location, or regulated entity).
- Responsive: side-panel width is clamped as a fraction of canvas width; bands
  and tooltip reflow; select resizes via positionControls() in updateCanvasSize().

## Validation score

- Before (scaffold): not run (placeholder).
- After: **98 / 100 (grade A).** Only flagged item is the validator's generic
  "uses DOM functions (createSelect)" note — a false positive, since p5 built-in
  controls are required by the project standard. 98 is the effective ceiling.

## Layout review (Claude Vision)

- Model: Claude Opus 4.8 (1M context) vision.
- **Cycle 1:** Walked the checklist on the default ("Pick a scenario...") state.
  All band headers, statute names, and tags render unclipped; white-on-color
  header contrast passes; the blue "Why these laws apply" side panel shows the
  on-load instruction text without overflow; the Scenario dropdown and its label
  sit cleanly in the control region; title centered; three band colors plus the
  blue panel give a clear visual hierarchy.
- **FAILs:** none.
- **Final state:** clean (no patch required).
