# Generation Log: adversarial-example-explorer

- **sim-id:** adversarial-example-explorer
- **Library:** p5.js
- **Bloom level/verb:** Analyze / explain
- **Learning objective:** Students can explain why a model's decision boundary
  admits adversarial examples by manipulating an input and watching the
  classifier's confidence change.

## Instructional-design decision

The spec is an Analyze-level *explorer*. The interaction is a live recompute on
slider change (continuous redraw is appropriate here because the pedagogical
payload is "watch confidence move as you slide ε"), plus a latch button (Apply),
a perturbation-only view toggle, a reset, and a "Why?" reveal. Five controls,
each tied to the objective: ε slider (Apply), target dropdown, perturbation-only
checkbox, Apply, Reset, Why. The default load state already demonstrates the
concept (clean digit confidently classified as "3"), satisfying progressive
disclosure.

## Implementation approach

- 28×28 grayscale digit "3" hand-authored as a stroke list, lightly blurred so
  it reads as ink rather than a bitmap.
- Transparent **linear classifier**: `score_d = bias_d + scale·dot(img, w_d)`.
  `w[3]` is the clean digit; `w[8]` rewards the closed left column an 8 has and
  a 3 lacks; `w[5]` rewards a top-left vertical stroke. Softmax → confidences.
- The FGSM perturbation vector is `sign(w_target − w_3)` — for a linear model
  this is exactly the sign of the gradient of `(logit_target − logit_3)` w.r.t.
  the input, so the demo is faithful FGSM, not a cosmetic overlay.
- Tuned so the clean digit reads **98%** "3" and the prediction flips to "8"
  around **ε ≈ 0.18–0.20** (small but visible), reaching ~95% "8" at ε = 0.30.
  Verified numerically with a standalone node reproduction of the model.
- Live horizontal bar chart, color-coded: blue = confident & correct, orange =
  adversarial target, slate = other classes. Annotation bar reports L∞ norm,
  human visibility, and the verdict. "Show perturbation only (10×)" magnifies
  the signed noise around mid-gray. Responsive: panels stack below 700px.

## Validation score

- Before (scaffold): not run (placeholder).
- After: **98 / 100 (A).** The only flagged item is the validator noting use of
  `createSlider/createSelect/createButton/createCheckbox` — these ARE the
  required p5 built-in controls per project standards, so it is a false
  positive, not a defect.

## Layout review (Claude Vision)

- **Model used:** Claude Opus 4.8 (1M context) vision pass.
- Cycle 1 FAILs:
  1. Default "3" confidence was ~77% (spec wants ~95%) and the attack would not
     flip within ε ≤ 0.3.
  2. The ε slider value label nearly touched the slider thumb.
- Fixes: redesigned the classifier to discriminative weight maps + gradient-sign
  FGSM and retuned bias/scale (clean → 98% "3", flips at ε ≈ 0.18); widened
  `sliderLeftMargin` 210 → 250.
- Cycle 2: clean. No clipped text, no stroke halos, good contrast, sliders
  within margins, no overlapping controls, all bar labels complete.
- **Final state:** clean.
