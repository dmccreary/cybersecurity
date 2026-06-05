# Generation Log: block-cipher-modes-compare

- **sim-id:** block-cipher-modes-compare
- **Library:** Static SVG with hover tooltips (inline SVG built in vanilla JS)
- **Bloom level/verb:** Understand / compare
- **Learning objective:** Students can compare the data flow of ECB, CBC, CTR,
  and GCM and explain why ECB leaks structure while GCM provides confidentiality
  and integrity.

## Instructional-design decision

This is an `infographic-svg` spec, so "interactive" means hover/tap reveals — no
animation. The diagram is a 2×2 comparison grid (Analyze-friendly side-by-side),
and every structural element (plaintext block, AES box, XOR node, IV/nonce,
keystream, GHASH, auth tag) carries a tooltip so the figure doubles as a guided
reference. Security recommendation is encoded in the tile border color: amber =
avoid (ECB), slate = use-with-care (CBC, CTR), green = recommended (GCM).

## Implementation approach

- Each tile is an inline `<svg>` built programmatically by small helpers (box,
  arrow, xor, label). Tooltips are dual: a native `<title>` element plus a
  `data-tip` attribute driven by a custom follow-the-cursor tooltip div (also
  fires on touchstart for tablets).
- ECB draws blocks 2 and 4 (and their ciphertext) in red to make the
  "identical-in → identical-out" leak visually obvious.
- CBC shows the IV feeding the first XOR and each ciphertext chaining (blue
  lines) into the next block's XOR — emphasizing the sequential dependency.
- CTR shows nonce/nonce+1/nonce+2 → AES → keystream, XOR'd with plaintext.
- GCM reuses the CTR core and adds the chained GHASH row plus a 128-bit auth tag.
- Responsive: CSS grid, 2×2 collapsing to a single column below 640px.

## Validation score

- Before (scaffold): not run.
- After: **100 / 100 (A).**

## Layout review (Claude Vision)

- **Model used:** Claude Opus 4.8 (1M context) vision pass.
- Cycle 1 FAIL: at the 800px screenshot width the original `max-width:800px`
  media query collapsed the grid to a single tall column, so each tile rendered
  ~500px tall and the page overflowed the iframe (only ECB + top of CBC visible).
  Fix: lowered the stack breakpoint to 640px so the 2×2 grid holds at typical
  content-column widths.
- Cycle 2 FAIL (minor): the CTR plaintext "P" marker was cramped against the
  keystream box. Fix: moved each "P" block clearly left of its XOR node with a
  clean horizontal arrow.
- Cycle 3: clean. All four tiles, badges, captions, and legend fully visible;
  no clipped text, good contrast, no overlaps.
- **Final state:** clean.
