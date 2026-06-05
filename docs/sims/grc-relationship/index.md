---
title: GRC Relationship
description: Interactive three-circle Venn diagram of Governance, Risk, and Compliance, with hover tooltips on every region and overlap, including the central Security Program.
image: /sims/grc-relationship/grc-relationship.png
og:image: /sims/grc-relationship/grc-relationship.png
twitter:image: /sims/grc-relationship/grc-relationship.png
social:
  cards: false
status: review
library: Static SVG with hover tooltips
bloom_level: Understand
---

# GRC Relationship

![GRC Relationship Venn Diagram](./grc-relationship.png)

<iframe src="main.html" width="100%" height="522" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/grc-relationship/main.html" height="522" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This Venn diagram shows how the three pillars of organizational security relate.
**Governance** (blue) is who decides and who is accountable. **Risk** (slate) is
what could go wrong and what we do about it. **Compliance** (amber) is the evidence
that we meet external standards. The three overlap, and the place where all three
meet is the organization's **Security Program**.

The pairwise overlaps are where most real work happens: governance and risk meet at
*risk appetite and board reporting*; governance and compliance meet at *policy
ownership and audit response*; risk and compliance meet at *control mapping and gap
analysis*. Hover over (or tap) any region or overlap to read a one-sentence
definition.

The caption underneath captures the central insight: *an organization can be
compliant and still insecure — compliance is evidence, risk is reality, and
governance is who decides between them.* On narrow screens the three circles
reflow into a stacked, labeled layout so the diagram stays readable on a phone.

## Lesson Plan

**Learning objective (Bloom: Understand).** Students will distinguish governance,
risk, and compliance as three related but distinct functions, explain what each
overlap represents, and articulate why an organization can be compliant yet still
insecure.

**Suggested classroom use.** Read a list of activities aloud — "the board sets the
risk appetite", "an auditor checks our access logs", "we map our controls to PCI
DSS" — and have students name which region each belongs in. Then debate the caption:
can you be fully compliant and still breached?

**Discussion questions:**

1. Give a concrete example of an organization that is *compliant but insecure*.
   Which region of the diagram is doing the work, and which is missing?
2. Why does "risk appetite" sit in the Governance ∩ Risk overlap rather than inside
   Risk alone?
3. What lives at the very center — the Security Program — that none of the three
   functions can provide on its own?

## References

- [Governance, risk management, and compliance — Wikipedia](https://en.wikipedia.org/wiki/Governance,_risk_management,_and_compliance)
- [IT risk management — Wikipedia](https://en.wikipedia.org/wiki/IT_risk_management)
- [Regulatory compliance — Wikipedia](https://en.wikipedia.org/wiki/Regulatory_compliance)
- [Corporate governance of information technology — Wikipedia](https://en.wikipedia.org/wiki/Corporate_governance_of_information_technology)

## Specification

The full specification below is extracted from
[Chapter 13: "Organizational Security: Governance, Risk, and Compliance"](../../chapters/13-organizational-security/index.md).

```text
Type: infographic-svg
sim-id: grc-relationship
Library: Static SVG with hover tooltips
Status: Specified

A three-circle Venn diagram:
- Governance (top-left) - cybersecurity blue. "Who decides; who is accountable."
- Risk (top-right) - slate steel. "What could go wrong; what we do about it."
- Compliance (bottom) - amber. "Evidence we meet external standards."

Overlap labels:
- Governance ∩ Risk: "Risk appetite, board reporting"
- Governance ∩ Compliance: "Policy ownership, audit response"
- Risk ∩ Compliance: "Control mapping, gap analysis"
- All three (center): "Security Program"

Caption: "An organization can be compliant and still insecure. Compliance is
evidence; risk is reality; governance is who decides between them."

Hover tooltips on each region give a one-sentence definition. Responsive: below
600px, circles arrange vertically with labels. Includes a resize listener.

Implementation: Inline SVG with hover tooltips; minimal JS for resize handling.
```

## Related Resources

- [Chapter 13: "Organizational Security: Governance, Risk, and Compliance"](../../chapters/13-organizational-security/index.md)
