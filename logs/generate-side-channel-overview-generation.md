# Generation Log: side-channel-overview

- **sim-id:** side-channel-overview
- **Library:** Static SVG with hover tooltips (inline SVG built by JS + tooltip/resize handler)
- **Bloom level / verb:** Understand / Identify
- **Learning objective:** Students can identify the four major hardware
  side-channel classes, explain that the leak is physical rather than logical,
  and match a defense to each class.

## Instructional-design decision

An `infographic-svg` spec → hover/tap reveals, no animation. The teaching point
is that a logically perfect crypto implementation can still leak its key through
physical side effects. The radial layout puts the CPU+key at the center and four
amber channels radiating to attacker icons, which makes "the secret leaks
outward" literal. One-line descriptions plus real-world examples (Spectre,
faulTPM, Flush+Reload, Rowhammer) live in tooltips so the canvas stays clean.

## Implementation approach

- `main.html`: title, subtitle, `#diagram` host, a green defenses badge, fixed
  tooltip div. SVG capped at `max-width: 640px` so the title + diagram + badge
  fit without vertical-centering whitespace.
- `side-channel-overview.js` (`// CANVAS_HEIGHT: 580`): builds the SVG in JS with
  two layouts — a radial layout (wide) and a stacked vertical list (< 700px) —
  switched by a resize listener. Custom small attacker glyphs (stopwatch, scope,
  co-tenant VM, hammer), amber arrows with markers (rowhammer is a two-way
  arrow), and a central CPU package with a lock + secret-key K. Colors per spec:
  blue chip, amber channels, slate board, green badge.
- Tooltips via both native `<title>` and a JS `data-tip` handler.

## Validation score

- Before: not separately measured.
- After: 100 (A).

## Layout review (Claude Vision)

Three cycles.

1. First screenshot (602px): channel-title labels overlapped the attacker labels
   on all four arms ("Timing channel" over "Timing attacker", etc.). FAIL on
   checklist 1.1 / overlap.
2. Moved each channel title to the arrow midpoint, clear of attacker labels;
   reduced CANVAS_HEIGHT 600 → 560 to cut top whitespace. Re-screenshot (562px):
   labels clean, but the green defenses badge was clipped below the fold because
   the full-width SVG (760x540 → 568px tall) + title pushed the badge past 562px.
3. Capped SVG `max-width` to 640px and set CANVAS_HEIGHT 580 (→ iframe 582).
   Final screenshot: all four channels, attacker icons, channel titles, arrow
   labels, and the full green defenses badge visible with no overlaps.

**Final state: clean.**

**Claude Vision model:** Claude Opus 4.8 (1M context), model id claude-opus-4-8[1m].
