# Generation Log: classic-dmz-architecture

- **sim-id:** classic-dmz-architecture
- **Library:** Mermaid (flowchart LR with subgraphs)
- **Bloom level / verb:** Understand / Explain
- **Learning objective:** Students will explain why a two-firewall DMZ with
  deny-by-default policies limits the blast radius of a compromised public-facing
  host.

## Instructional-design decision

The spec type is `diagram`. Per the pipeline, a diagram is a static reference
artifact — "interactive" means it scales responsively and carries a legend, not
that it animates. The MicroSim is therefore a static Mermaid flowchart with a
color legend; no looping animation, matching the Understand Bloom level (read,
trace, explain).

## Implementation approach

- Mermaid `flowchart LR` with three subgraphs: Internet (untrusted, gray border),
  DMZ (slate border, three hosts: web reverse proxy / public DNS / SMTP relay),
  and Internal network (cybersecurity-blue border, four hosts: app servers /
  database / domain controller / file servers).
- Two hexagonal firewall nodes (amber) carry the edge-firewall (ports 80/443/25/53
  inbound) and inner-firewall (DMZ→specific internal endpoints only; no
  internal-initiated traffic to DMZ) policies.
- linkStyle directives color the legitimate flows cybersecurity blue (solid +
  one dashed for user egress) and the blocked attacker pivot rust/red dashed,
  matching the spec palette.
- `useMaxWidth: true` makes the SVG scale to the container; a resize listener
  reasserts max-width. `subGraphTitleMargin` is set per the project Mermaid rule
  so subgraph titles do not collide with the cluster borders.
- A normal-flow HTML legend below the diagram explains the five line/box types.
- CANVAS_HEIGHT comment lives in classic-dmz-architecture.js for the iframe-height
  tool (iframe set to 482px).

## Validation score

- Before (scaffold): not run (placeholder).
- After: **100 / 100 (grade A).**

## Layout review (Claude Vision)

- Model: Claude Opus 4.8 (1M context) vision.
- **Cycle 1:** Walked the checklist. Full diagram renders with no clipping; all
  zone, host, and firewall labels legible; title and subtitle clear; six-entry
  legend present and readable on two rows within the 482px height; color coding
  matches the spec (blue legitimate, slate DMZ, blue internal, amber firewalls,
  red blocked pivot). The red "pivot attempt — blocked by deny-by-default" label
  is clearly visible.
- **FAILs:** none. Minor empty space at lower-right of the canvas, but no clipping
  and the legend's second row is well within bounds — not worth tightening at the
  risk of clipping.
- **Final state:** clean.
