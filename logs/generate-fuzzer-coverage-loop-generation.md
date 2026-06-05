# Generation Log: fuzzer-coverage-loop

- **sim-id:** fuzzer-coverage-loop
- **Library:** p5.js
- **Bloom level / verb:** Analyze / Compare
- **Learning objective:** Students will compare the exploration behavior of
  coverage-guided versus random fuzzing and explain why coverage guidance
  dramatically reduces the time to find bugs on deep code paths.

## Instructional-design decision

The spec is a `microsim` at Bloom-Analyze whose explicit goal is a *comparison*
(coverage-guided vs. random). This is one of the cases where a genuine running
simulation is the right interaction: the learner toggles guidance on/off and
watches the two exploration behaviors diverge. Animation runs only while the
mouse is over the canvas (per the project standard) to save CPU and reduce
distraction; the default on-load state shows the seed input and an otherwise
uncovered graph, which already communicates the starting point.

## Implementation approach

- Left panel: a fixed control-flow graph of 25 basic blocks arranged as a
  branching tree with increasing depth; a few deep blocks are "rare" (amber) and
  the deepest is the bug. Blocks start gray and turn blue as inputs reach them;
  covered edges thicken and turn blue.
- Right panel: the input corpus as stacked horizontal bars (length = input size);
  coverage-gaining inputs are blue, others gray; the list caps and scrolls.
- Top: a real-time coverage gauge (percent and block count).
- Fuzzing model: each tick computes the reachable "frontier" (uncovered blocks
  whose parent is covered). In guided mode, frontier blocks are reached with a
  high base probability scaled by mutation aggressiveness, so coverage climbs and
  the deep bug is eventually hit (CRASH animation). In random mode, reach
  probability decays geometrically with depth and is crushed for rare blocks, so
  the bug is almost never reached — making the comparison vivid.
- Controls (p5 built-ins): Mutation aggressiveness (1-10), Inputs per second
  (1-50), Coverage-guided checkbox, Reset. The checkbox and Reset both reset the
  run so A/B comparisons start clean.
- Responsive width; CANVAS_HEIGHT comment (590) drives the iframe height (592px).

## Validation score

- Before (scaffold): not run (placeholder).
- After: **98 / 100 (grade A).** Only flagged item is the validator's generic
  "uses DOM functions (createSlider/createCheckbox/createButton)" note — a false
  positive, since p5 built-in controls are required. 98 is the effective ceiling.

## Layout review (Claude Vision)

- Model: Claude Opus 4.8 (1M context) vision.
- **Cycle 1:** Walked the checklist on the default state. CFG tree renders with
  the amber bug block at the deepest position and the blue covered root; the input
  corpus panel shows the seed bar; the coverage gauge reads "4% (1/25 blocks)";
  the three-item legend, both sliders (with right margin), the checkbox, and the
  Reset button all render cleanly with readable labels and no overlap.
- **FAILs:** none. (The CFG legend sits just below the deepest node row but does
  not collide with any node or label.)
- **Final state:** clean.
