# Generation Log: ddos-mitigation-explorer

- **sim-id:** ddos-mitigation-explorer
- **Library:** p5.js
- **Bloom level/verb:** Analyze / Analyze
- **Learning objective:** Students will analyze how ingress filtering, anycast,
  scrubbing, and rate limiting each reduce volumetric vs application-layer attack
  traffic, by manipulating attack parameters and defense settings and observing the
  change in traffic reaching the origin.

## Instructional-design decision

The spec states Bloom: Analyze and explicitly requests an animated traffic
microsim with sliders/selects/checkboxes. Analyze → explorer with manipulable
parameters, which matches the spec exactly. I kept a real (if simplified)
quantitative model so toggling defenses produces meaningful, explainable changes —
the analytical payoff is comparing defenses across attack types, not just watching
dots move.

## Implementation approach

- `computeModel()` turns the controls into a single normalized attack volume
  (log-tuned over the 10-10,000 bot range and amplification factors), then applies
  each enabled defense as a multiplicative reduction: BCP38 strips ~90% of
  amplified/spoofed volumetric traffic only; anycast divides load by 3; scrubbing
  cuts ~95% (and adds 100 ms latency); rate limiting cuts L7 traffic but weakens as
  the botnet grows more diverse. Volumetric loads the bandwidth bar; L7 loads CPU.
- Visual: left botnet dot cluster (amber), four center defense-layer rectangles
  (blue when on, grey when off), right origin server with bandwidth + CPU health
  bars that go amber/red under load, and a ticker for "% legitimate requests
  served." Animated particles (amber attack, green legitimate) flow left-to-right
  and fade at a defense when absorbed; animation only advances on mouse-over per
  the iframe convention.
- Controls: 2 sliders, 2 selects (reflector auto-disabled for non-volumetric
  attacks), 4 checkboxes, reset — built-in p5 controls only, laid out in four rows;
  `updateCanvasSize()` first; sliders resized in `windowResized()`.

## Validation score

- Before: 50 (C) — scaffold.
- After: 98 (A). The -2 is the known `createSelect()` "DOM function" false
  positive; project standards require p5 built-in controls. No fix warranted.

## Layout review (Claude Vision, Opus 4.8)

- PASS: all labels complete and legible, no residual strokes, good contrast;
  controls sit in the white region in four non-overlapping rows; sliders have right
  margin; origin server, both health bars, and the ticker are fully visible; amber
  attack dots / blue layers / green legitimate stream give clear color hierarchy;
  no error banner.
- FAIL (cycle 1): at the default settings the attack barely registered (saturate
  constant too high), so the origin looked idle on load — weak progressive
  disclosure for an Analyze sim.
- Fix: lowered the `saturate` constant 4e6 -> 90000 so the default volumetric
  attack puts the origin under moderate stress (bandwidth ~44%, 56% served) on
  load, while amplified/high-rate attacks clearly saturate it.
- Final state: **clean**.

## Final iframe height

527 (CANVAS_HEIGHT 525 + 2).
