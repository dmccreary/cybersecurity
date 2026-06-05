# Generation Log: password-cracking-cost

- **sim-id:** password-cracking-cost
- **Library:** p5.js
- **Chapter:** 4 — Cryptography in Practice
- **Bloom level / verb:** Analyze / Analyze
- **Learning objective:** Analyze how each password-protection technique (no
  protection, salt, slow hash, memory-hard hash) changes the time and dollar
  cost an attacker faces when cracking a stolen password database.

## Instructional-design decision

The spec is an Analyze-level `microsim`, which maps to sliders/dropdowns +
calculator (not looping animation). I built a calculator: a hash-function
dropdown, a hardware slider (1 CPU → ASIC cluster), a database-size slider
(10K → 10M), and a rainbow-attack checkbox. On any change it recomputes the
attacker's effective guess rate, time-to-crack 1/10/50%, and the cloud-GPU
dollar cost to crack 1%, with a safe/unsafe verdict and a red footgun callout.
This lets students vary one factor at a time and observe the cost swing across
orders of magnitude — the core analytical task.

## Implementation approach

- Standard p5 structure: `updateCanvasSize()` first in `setup()`, canvas
  parented to `document.querySelector('main')`, `windowResized()` resizing both
  sliders, built-in controls only, `// CANVAS_HEIGHT:` comment, `describe()`.
- Model (hard-coded, order-of-magnitude, ~2025 GPU benchmarks): hardware raw
  SHA-256 rates (1 CPU 2e7 → ASIC 5e13), hash work-factors (raw=1, salt=1,
  bcrypt c10=1e5, c12=4e5, Argon2id=2e6 + a memory-hard parallelism penalty),
  ~25% weak-password fraction, ~1e9-guess budget per crackable account. Unsalted
  fast hash + rainbow checkbox = effectively instant.
- Colors per spec: blue (#1565c0) for defensible configs, rust (#d84315) for
  insecure, plus per-hash "why this speed" note (the spec's tooltip).
- Time bars use a logarithmic scale as specified.

## Validation

- validate-sims.py: **98 (A)** — the only deduction is the known false positive
  for p5 built-in controls (`createSlider/createSelect/createCheckbox`), which
  are REQUIRED. 98 is the p5 A-grade ceiling; not chased further.

## Layout review (Claude Vision)

- **Cycle 1 (height 562):** FAIL 2.2 — the control-area label "Hardware: 1 GPU
  (RTX 4090)" ran under the start of the hardware slider track (sliderLeftMargin
  was 170).
- **Fixes:** raised `sliderLeftMargin` to 215 and shortened the control-area
  hardware label to a `short` name ("1 GPU") while keeping the full model name in
  the big readout context line. Also added a 2% snap so the animated guess-rate
  readout settles on the exact steady-state value instead of perpetually easing.
- **Cycle 2 (height 562):** labels now clear of both sliders and the dropdown;
  big readout, log-scale time bars, cost panel, and footgun callout all complete
  and legible; good contrast; backgrounds correct. **Final state: clean.** (The
  screenshot captures the guess-rate readout mid-ease, which is expected for an
  animated readout — the steady-state value is exact.)

Claude Vision model used: Claude Opus 4.8 (1M context).
