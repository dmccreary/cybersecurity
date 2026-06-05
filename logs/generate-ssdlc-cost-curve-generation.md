# Generation Log: ssdlc-cost-curve

- **sim-id:** ssdlc-cost-curve
- **Library:** Chart.js 4.4.0 (horizontal bar, logarithmic x-axis)
- **Bloom level / verb:** Understand / Interpret
- **Learning objective:** Students can interpret the logarithmic cost curve,
  explain why remediation cost grows geometrically with the phase of discovery,
  and argue for shifting security activities earlier.

## Instructional-design decision

A `chart` spec → hover tooltips, no animation loop (animation duration kept short
at 400ms just for initial draw). The log x-axis is the pedagogical point: cost
grows geometrically (1, 2, 5, 10, 30, 100), so a log axis is the honest way to
show the shape. Tooltips carry the per-phase activities and cost driver so the
chart conveys *why* each phase costs what it does, not just the number.

## Implementation approach

- `main.html`: title (the spec's exact title), subtitle, a `.chartbox` with fixed
  380px height holding the `<canvas>`, and a small attribution note that the
  multipliers are illustrative industry figures. Chart.js loaded from jsDelivr CDN.
- `ssdlc-cost-curve.js` (`// CANVAS_HEIGHT: 470`): `type:'bar'` with
  `indexAxis:'y'` for the horizontal layout. Six phases, cybersecurity-blue
  gradient (#bbdefb → #0d47a1) darkening with cost; the Production bar gets a 3px
  amber (#ffa000) border. Logarithmic x-axis with custom tick callback showing
  only 1×/2×/5×/10×/30×/100×. Custom tooltip callbacks emit phase, cost, typical
  activities, and the cost driver.

## Validation score

- After: 100 (A).

## Layout review (Claude Vision)

Two cycles.

1. First screenshot: the Requirements (1×) bar was invisible — a logarithmic axis
   with `min: 1` renders a value of exactly 1 with zero bar length. (Checklist
   3.6 / data legibility FAIL.)
2. Set x-axis `min: 0.8, max: 120` so the 1× bar has a small visible width while
   the tick labels stay at the intended powers. Re-screenshot: all six bars
   visible, gradient progression clear, Production amber border present, log ticks
   correct, title/subtitle/attribution all legible.

Other checklist items PASS: 5.3 chart has title + axis label + per-bar tooltips
(legend intentionally hidden — single dataset); 1.x text legible; 4.x single
dominant blue hierarchy with amber accent.

**Final state: clean.**

**Claude Vision model:** Claude Opus 4.8 (1M context), model id claude-opus-4-8[1m].
