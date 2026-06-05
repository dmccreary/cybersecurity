# Generation Log: surface-boundary-blast-radius

- **sim-id:** surface-boundary-blast-radius
- **Library:** Static SVG with hover tooltips (chosen over Mermaid — see below)
- **Bloom level / verb:** Understand / Distinguish
- **Learning objective:** Students can distinguish attack surface, trust boundary,
  and blast radius, trace what a compromise of each tier reaches, and explain how
  trust boundaries and least privilege shrink blast radius.

## Instructional-design decision

An `architecture-diagram` spec → hover/click reveals, no animation. The spec
lists "Mermaid (or static SVG)". I chose **static SVG** because the diagram needs
precise geometry that Mermaid cannot express well: two overlapping dashed
blast-radius circles of different sizes centered on specific components, an
explosion glyph layered on a node, a red dashed multi-item attack-surface panel,
and two vertical trust-boundary lines spanning the diagram. Hand-rolled SVG gives
exact control of all of that and clean hover tooltips. The teaching point is that
the three concepts answer three different questions about the *same* system, so
each gets a distinct color (red surface / blue boundary / amber blast) and its
own legend swatch.

## Implementation approach

- `main.html`: title, subtitle, `#diagram` host, a flex legend mapping each line
  style to its concept, fixed tooltip div.
- `surface-boundary-blast-radius.js` (`// CANVAS_HEIGHT: 520`): builds an 880x470
  SVG. Left: red dashed attack-surface panel with six hoverable entry-point rows.
  Two solid blue trust-boundary lines (Untrusted→DMZ, App→Data tier). Center
  flow: reverse proxy → application server → database (drawn as a cylinder).
  Amber dashed blast circles behind the app (r=100, "all user records, no path to
  OS") and the database (r=74, "all customer data, read AND write"); a jagged
  explosion path marks the assumed app compromise. Arrowhead marker for the
  internal data flow. Colors per spec: #c62828 surface, #1565c0 boundary, #455a64
  components, #ffa000 blast.
- Tooltips via native `<title>` + JS `data-tip` handler.

## Validation score

- After: 100 (A).

## Layout review (Claude Vision)

Walked the checklist against the 800x522 screenshot. All PASS / N/A:

- 1.1–1.4 text: PASS (all six surface labels, both boundary labels, both blast
  captions, and component labels fully visible and legible).
- 3.1 title: PASS. 3.2 draw order: PASS (blast circles drawn behind components;
  explosion on top). 3.3 panel overflow: PASS.
- 4.4 color hierarchy: PASS — red / blue / amber / slate, each carrying a distinct
  meaning, reinforced by the legend.
- 6.1/6.3 renders, aspect ratio matches: PASS.

**Final state: clean** — 0 cycles of fixes needed.

**Claude Vision model:** Claude Opus 4.8 (1M context), model id claude-opus-4-8[1m].
