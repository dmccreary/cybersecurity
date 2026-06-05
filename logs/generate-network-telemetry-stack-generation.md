# Generation Log: network-telemetry-stack

- **sim-id:** network-telemetry-stack
- **Library:** Static SVG with hover tooltips (spec named Mermaid — see deviation note)
- **Bloom level/verb:** Understand / Compare
- **Learning objective:** Students will identify the five common network telemetry
  sources and the question each answers, compare them along fidelity, coverage, and
  storage-cost, and explain why broad cheap telemetry is kept always-on while
  high-fidelity capture is on-demand.

## Instructional-design decision

A "diagram" spec at Bloom Understand → a static layered reference with hover
reveals (not animation). Five telemetry bands ordered top (highest fidelity) to
bottom (broadest coverage), each labeled with data type, example tool, and the
question it answers, all feeding a SIEM, with flanking fidelity/coverage axes.

## Implementation approach + library deviation

- The spec named **Mermaid**. I first built it as a Mermaid flowchart. Two layout
  attempts failed badly: (1) a TB subgraph with `==> siem` cross-edges produced a
  diagonal "staircase" instead of a vertical stack; (2) a single `pcap --> ... -->
  siem` chain plus `useMaxWidth` stretched the narrow tall diagram to full container
  width, blowing node text up to ~40px and clipping most nodes. This is the
  documented wave-1 Mermaid LR/TB-in-wide-iframe pain.
- I switched to **inline SVG** (permitted by the pipeline for layered/infographic
  diagrams) for a compact, predictable five-band stack: a fixed `viewBox`, five
  blue-gradient bands (darkest = highest fidelity), a cream SIEM box with curved
  feed arrows from each band, blue "Fidelity ↑" and orange "Coverage ↓" axes, and a
  per-band hover/tap tooltip. The amber cost note is HTML below the SVG. The `.js`
  carries the CANVAS_HEIGHT comment. metadata/index/spec-text updated to reflect the
  actual library and the reason for the deviation.

## Validation score

- Before: scaffold.
- After (SVG version): 100 (A).

## Layout review (Claude Vision, Opus 4.8)

- Mermaid cycle FAILs: diagonal staircase (attempt 1) and giant clipped nodes
  (attempt 2) — both unfixable without fighting the layout engine, hence the SVG
  switch.
- SVG cycle 1 FAIL: with `xMidYMid` the wide-aspect viewBox centered the stack,
  leaving ~150px top whitespace and clipping the bottom DNS band.
- Fix: top-anchored the SVG (`xMidYMin meet`) and raised CANVAS_HEIGHT 470→500 so
  the host has room for all five bands plus the HTML cost note; re-ran
  fix-iframe-heights (→502) and synced the copy-paste example.
- SVG cycle 2: all PASS — title/subtitle legible; five bands stacked vertically with
  correct fidelity gradient; each band's title/tool/question legible; both flanking
  axes drawn with arrows and labels; SIEM box with five feed arrows; good contrast;
  no clipping. **Clean.**

## Final iframe height

502 (CANVAS_HEIGHT 500 + 2). Copy-paste example iframe also set to 502.
