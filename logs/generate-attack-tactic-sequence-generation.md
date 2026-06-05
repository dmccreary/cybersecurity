# Generation Log: attack-tactic-sequence

- **sim-id:** attack-tactic-sequence
- **Library:** p5.js
- **Bloom level / verb:** Analyze / Analyze
- **Learning objective:** Students will analyze how individual techniques chain
  into a complete campaign by stepping through preset scenarios, identifying
  which MITRE ATT&CK tactic each technique belongs to, and locating the earliest
  realistic SOC detection point.

## Instructional-design decision

The spec is explicitly Bloom-Analyze. Per the pipeline's Bloom→interaction
mapping, Analyze maps to a step-through / side-by-side explorer rather than
continuous animation. The MicroSim is therefore a **step-through scenario
explorer**: the learner advances techniques one at a time (Step Forward/Back),
with an optional Play-All for demonstration. Each step plots a technique circle
in the column of its tactic, so the "which tactic does this belong to?" analysis
is the core interaction. The default state reveals two techniques (not zero) so
the concept is visible on load without interaction.

## Implementation approach

- 14 ATT&CK Enterprise tactic columns rendered left-to-right in kill-chain order
  with short two-line headers sized to fit narrow columns.
- Four preset campaigns encoded as data arrays (Phishing→Ransomware, Supply
  Chain Compromise, Web App SQLi→Data Theft, Insider Credential Abuse), each
  technique carrying id, name, tactic index, description, and a defender-side
  detection idea.
- Technique circles are cybersecurity-blue (#1565c0); the first SOC-detectable
  technique pulses in alert amber (#ffa000) with a soft glow. Arrows connect
  consecutive steps. Click a circle to toggle a tooltip with the technique ID,
  name, description, and detection idea.
- A cumulative progress strip and bar show "% of campaign" reached.
- Controls are p5 built-ins: createSelect (scenario), createButton (Step Back /
  Step Forward / Play All / Reset), createSlider (speed 0.5–3.0 s/step).
  Animation only advances while the mouse is over the canvas.
- Responsive: column headers shrink below 700px; slider resizes with width.

## Validation score

- Before (scaffold): not run (placeholder).
- After: **98 / 100 (grade A).** The only flagged item is the validator's
  generic "uses DOM functions (createSlider/createSelect/createButton)" note,
  which is a false positive — the project standard *requires* p5 built-in
  controls. 98 is the effective ceiling for a compliant p5 sim.

## Layout review (Claude Vision)

- Model: Claude Opus 4.8 (1M context) vision.
- **Cycle 1 FAIL — 1.1 / 3.5 clipped column header:** the centered label of the
  far-left column ("Reconnaissance") was clipped at the canvas left edge,
  reading as "connaissance". Long centered labels overflowed the narrow 14-column
  grid.
  - **Fix:** replaced single long centered labels with short two-line tactic
    names (e.g. "Resource"/"Dev", "C2", "Exfil") sized to fit a column; also set
    the default to reveal two techniques so the concept is visible on load.
- **Cycle 2:** re-screenshot — all 14 headers fully visible ("Recon" … "Impact"),
  no clipping; amber detectable circle clearly distinct from blue circles; arrow,
  progress bar, and all controls render correctly with margins.
- **Final state:** clean.
