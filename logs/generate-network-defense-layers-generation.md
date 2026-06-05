# Generation Log: network-defense-layers

- **sim-id:** network-defense-layers
- **library:** Static SVG with hover tooltips
- **Bloom level / verb:** Understand / Identify
- **Learning objective:** Students can identify the nested network trust zones
  from the untrusted internet to the crown-jewel data store and name the control
  that typically crosses each trust boundary.

## Instructional-design decision

The spec is an `infographic-svg` (Bloom: Understand). "Interactive" here means
hover-reveal, not animation. Built as an inline `<svg>` of six nested rounded
rectangles (the spec offers rings OR nested rectangles; rectangles give far
cleaner multi-line labels). Each zone is a hover target with a tooltip naming
its controls; italic trust-boundary labels sit between rings; a right-hand
legend distinguishes ingress / egress / lateral-movement arrows.

## Implementation approach

- Inline SVG, `viewBox="0 0 560 560"`, `width:100%` so it scales with the
  iframe; CSS media query stacks the legend below the diagram under 700px (spec
  responsive requirement).
- Six zones colored per spec: gray internet, slate edge, blue DMZ, deeper-blue
  internal, fur-orange (#d84315 family) sensitive zone, cream crown jewels.
- Trust-boundary controls (DDoS scrubbing, TLS/WAF, stateful firewall,
  micro-segmentation) as italic labels between rings.
- Three SVG markers/arrows: blue ingress (inward), slate egress (outward), amber
  dashed lateral movement, plus a legend explaining each.
- Companion `network-defense-layers.js` carries the `// CANVAS_HEIGHT` comment,
  the `data-tip` tooltip wiring (matching the wave-1 cia-triad-overview pattern),
  and a window-resize listener that hides the tooltip on reflow (spec requires
  responding to resize).

## Validation score

- **100 (A)** on the first validate run.

## Layout review (Claude Vision — claude-opus-4-8[1m])

- **Cycle 1:** rendered correctly with all six zones, boundary labels, and the
  legend legible. Minor FAIL (3.3-ish): the amber lateral-movement arrow was
  nearly hidden behind the crown-jewels box, and the ingress/egress arrows
  crossed the rings high up, looking busy.
- **Fix:** repositioned the lateral arrow to sit clearly across the
  sensitive-zone band and lowered the ingress/egress arrow endpoints to the
  bottom corners for a cleaner read.
- **Cycle 2:** walked the checklist:
  - 1.1–1.5 legibility: PASS (every zone label and control list readable;
    dark-on-light and white-where-needed contrast good).
  - 3.3 panel overflow: PASS (legend text fits its box).
  - 4.4 color hierarchy: PASS (gray->slate->blue->orange->cream reads as a
    trust gradient).
  - 6.1 renders / 6.3 aspect ratio: PASS (fills 622px, no clipping; back-link
    present).
  - Residual: the amber arrowhead lightly grazes the end of the "internal
    services" text — cosmetic only, label unambiguous. Left within the 3-cycle
    budget.
- **Final state:** clean (one negligible cosmetic touch noted).
