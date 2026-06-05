---
title: Threat Modeling Methodology Comparison
description: A side-by-side infographic comparing STRIDE, PASTA, and Attack Trees with hover tooltips and a summary table of effort, output, and best fit.
image: /sims/threat-modeling-methods/threat-modeling-methods.png
og:image: /sims/threat-modeling-methods/threat-modeling-methods.png
twitter:image: /sims/threat-modeling-methods/threat-modeling-methods.png
social:
   cards: false
status: review
library: Static SVG
bloom_level: Understand
---

# Threat Modeling Methodology Comparison

![Threat Modeling Methodology Comparison](./threat-modeling-methods.png)

<iframe src="main.html" width="100%" height="702" scrolling="no"
  style="border: 1px solid #ccc; border-radius: 8px;"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/threat-modeling-methods/main.html" height="702" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This infographic places three of the most widely used threat-modeling
methods side by side so you can see, at a glance, how their questions and
outputs differ. The **STRIDE** column lists the six threat categories —
Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service,
and Elevation of Privilege — and maps each one to the security property it
violates. The **PASTA** column walks the seven stages of the Process for
Attack Simulation and Threat Analysis, a business-driven, risk-centric
method. The **Attack Trees** column shows a worked example: a root goal of
"Steal Customer Data" branching into three attacker paths, one of which is
expanded into two concrete sub-techniques. Hover (or tap, on touch screens)
over any cell to read a one-line explanation, and use the summary table
below the diagram to compare time-to-complete, output type, and best fit.
The MicroSim is a static SVG with hover reveals — there is no animation, so
you control the pace of exploration.

## Lesson Plan

**Learning objective:** Given a system to secure and a fixed time budget,
the student can *compare* STRIDE, PASTA, and Attack Trees and select the
method whose question and output best match the situation.

**Suggested classroom use:** Project the infographic and ask students to
predict, before hovering, which security property each STRIDE letter
violates. Then reveal the tooltips to check. Next, give students a short
system description (for example, a customer-data API behind a login) and
have them argue which of the three methods they would reach for first and
why. Finish with the summary table to ground the discussion in real effort
and output trade-offs.

**Discussion questions:**

1. STRIDE finishes in hours and PASTA can take weeks. What does PASTA buy
   you for that extra effort, and when is it worth it?
2. The attack tree shows three OR-branches to the same goal. As a defender,
   how does enumerating attacker paths change which control you fund first?
3. Could you use more than one method on the same system? Where would STRIDE
   hand off to an attack tree?

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

## References

- [STRIDE (security) — Wikipedia](https://en.wikipedia.org/wiki/STRIDE_(security))
- [Threat model — Wikipedia](https://en.wikipedia.org/wiki/Threat_model)
- [Attack tree — Wikipedia](https://en.wikipedia.org/wiki/Attack_tree)
- [OWASP Threat Modeling Process](https://owasp.org/www-community/Threat_Modeling_Process)

## Related Resources

- [Chapter 1: "Security Foundations: Properties, Mindset, and Risk"](../../chapters/01-security-foundations/index.md)
