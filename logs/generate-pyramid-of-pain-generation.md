# Generation Log: pyramid-of-pain

- **sim-id:** pyramid-of-pain
- **Library:** p5.js
- **Bloom level/verb:** Understand / Explain
- **Learning objective:** Students will explain why detecting attackers at higher
  levels of the pyramid imposes more cost on the adversary than detecting them at
  lower levels, and match a sample detection rule to its level.

## Instructional-design decision

An `infographic` spec at Bloom Understand → hover/click reveals and a view toggle,
NOT looping animation. The interaction is: hover a level for what it is + what
detecting it forces the adversary to do; click a level to pin it and reveal a sample
SIEM rule; a selector toggles Defender (detection ideas) vs Attacker (evasion cost)
view. This directly serves the "explain why higher detection costs more" objective.

## Implementation approach

- Six trapezoidal bands drawn apex-first with `quad()`, interpolating half-width
  from a narrow apex (TTPs) to a wide base (Hash Values), colored on a
  cybersecurity-blue → pale-gray gradient. Each band shows its name and pain label.
- Per-band hover hit-testing uses the band's wider bottom half-width; `hovered` and
  `selected` (clicked, toggle-to-pin) drive a right-side info panel that shows
  "what it is", "detecting it forces…", and either the SIEM rule (Defender, only when
  the level is clicked) or the attacker's cost (Attacker view).
- A vertical arrow with a rotated "more cost imposed on the adversary" label runs up
  the pyramid's right edge. Controls: a `createSelect()` view toggle (p5 built-in
  closest to the spec's "radio"), `updateCanvasSize()` first, canvas parented to
  `<main>`, slider/select repositioned in `windowResized()`.

## Validation score

- Before: scaffold.
- After: 98 (A). The −2 is the known `createSelect()` "DOM function" false positive;
  the built-in control is required by project standards. 98 is the p5 A-grade
  ceiling.

## Layout review (Claude Vision, Opus 4.8)

- Walked the checklist on the rendered 800×542 screenshot.
- PASS: title + subtitle legible and unclipped; six pyramid levels render with
  correct narrowing and the blue→gray gradient; every level's name and pain label is
  legible (white text on dark upper bands, dark text on pale lower bands — good
  contrast); the vertical "more cost imposed on the adversary" arrow and its rotated
  label are clear; the right info panel sits fully inside the draw area and shows the
  default Defender-view instructions; the control region holds the View label, the
  Defender/Attacker selector, and the help text with no clipping or overlap.
- No FAILs. **Clean on cycle 1.**

## Final iframe height

542 (CANVAS_HEIGHT 540 + 2). Copy-paste example iframe also set to 542.
