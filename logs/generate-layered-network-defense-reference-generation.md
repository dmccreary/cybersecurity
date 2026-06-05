# Generation Log: layered-network-defense-reference

- **sim-id:** layered-network-defense-reference
- **Library:** Mermaid (flowchart TD)
- **Chapter:** 8 — Network Security Foundations: Protocols, Firewalls, and Detection
- **Bloom level / verb:** Understand / Describe
- **Learning objective:** Describe the ordered layers of a defense-in-depth
  network architecture, match each layer to the attack class it primarily
  addresses, and explain why IDS/IPS, encryption in transit, and logging are
  cross-cutting concerns that span every layer.

## Instructional-design decision

The spec is a reference `diagram`. "Interactive" here means hover/click reveals,
not animation. I implemented a Mermaid TD stack of 8 layers (Internet client →
DDoS/CDN → edge firewall → WAF → LB/TLS → app tier → inner firewall →
internal services) with each control layer carrying an inline "[ addresses: X ]"
attack-class badge, plus a separate `cross` subgraph for the three cross-cutting
concerns. A right-side info panel reveals a per-layer explanation on hover/click.
This supports an Understand-level objective: the learner reads the ordered stack
and the attack each layer counters.

## Implementation approach

- `main.html`: schema meta tag, bare `<main>`, Mermaid ESM import with
  `subGraphTitleMargin`, the 8-node TD stack, the cross-cutting subgraph, legend,
  and hover panel.
- `layered-network-defense-reference.js`: `// CANVAS_HEIGHT:` comment plus the
  standard `waitForMermaid` node-hover wiring (11 nodes).
- Colors per spec: blue (#1565c0) control layers, cream (#fff8e1) data tiers,
  slate (#455a64) boundaries, amber shades for the cross-cutting observability
  group.
- Responsive: `.layout` stacks below 700px.

## Validation

- validate-sims.py: **100 (A)** on the first run.

## Layout review (Claude Vision)

- **Cycle 1 (height 762):** FAIL 2.7 / bottom boundary — Mermaid placed the
  cross-cutting subgraph beside the top of the tall 8-node stack, making the
  whole diagram far taller than 762px; everything below the WAF layer was
  clipped.
- **Fix:** raised CANVAS_HEIGHT to 1360 to fit the full stack.
- **Cycle 2 (height 1362):** all 8 layers, the cross-cutting subgraph, legend,
  and info panel fully visible; complete labels, good contrast, subgraph title
  clear of nodes. Some expected empty space below the short info panel beside the
  tall diagram — not a defect. **Final state: clean.**

Claude Vision model used: Claude Opus 4.8 (1M context).
