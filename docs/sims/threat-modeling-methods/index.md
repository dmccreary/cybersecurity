---
title: Threat Modeling Methodology Comparison
description: Threat Modeling Methodology Comparison
status: scaffold
library: Static SVG or Mermaid
bloom_level: TBD
---

# Threat Modeling Methodology Comparison



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 1: "Security Foundations: Properties, Mindset, and Risk"](../../chapters/01-security-foundations/index.md).

```text
Type: infographic-svg
**sim-id:** threat-modeling-methods<br/>
**Library:** Static SVG or Mermaid<br/>
**Status:** Specified

Three vertical columns of equal width:

**Column 1 — STRIDE** (header in cybersecurity blue #1565c0)
- Six rows, one per letter, each showing: letter, name, property violated
- Footer: "Use for: design reviews, fast component-by-component analysis"

**Column 2 — PASTA** (header in slate steel #455a64)
- Seven numbered stages from "Define Objectives" to "Simulate Attacks"
- Footer: "Use for: high-stakes systems, business-aligned analysis"

**Column 3 — Attack Trees** (header in amber #ffa000)
- A small attack tree showing root "Steal Customer Data" branching to three children: "Compromise database", "Phish admin", "Exploit API"; one child further expanded to two grandchildren
- Footer: "Use for: comparing attacker paths, cost/feasibility analysis"

Below all three columns: a single-line summary table showing time-to-complete (STRIDE: hours, PASTA: days–weeks, attack trees: hours–days), output type, and best fit. Responsive: columns stack vertically below 800px.

Implementation: Static SVG built once, or three small Mermaid diagrams in a CSS grid.
```

## Related Resources

- [Chapter 1: "Security Foundations: Properties, Mindset, and Risk"](../../chapters/01-security-foundations/index.md)
