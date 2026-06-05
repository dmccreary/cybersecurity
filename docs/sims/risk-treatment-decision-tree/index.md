---
title: Risk Treatment Decision Tree
description: Interactive Mermaid decision tree that routes a single identified risk through the four treatment options — avoid, mitigate, transfer, or accept — each with an owner and a date.
image: /sims/risk-treatment-decision-tree/risk-treatment-decision-tree.png
og:image: /sims/risk-treatment-decision-tree/risk-treatment-decision-tree.png
twitter:image: /sims/risk-treatment-decision-tree/risk-treatment-decision-tree.png
social:
  cards: false
status: review
library: Mermaid
bloom_level: Apply
---

# Risk Treatment Decision Tree

![Risk Treatment Decision Tree](./risk-treatment-decision-tree.png)

<iframe src="main.html" width="100%" height="882" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/risk-treatment-decision-tree/main.html" height="882" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This diagram takes a single risk — already rated by **likelihood × impact** — and
walks it through a fixed sequence of questions until it lands on exactly one
treatment. The first question asks whether the activity can simply be
**eliminated** without an unacceptable business loss; if so, the answer is
**AVOID**. If not, the tree asks whether available controls can drive the
**residual risk** below the organization's risk appetite, which leads to
**MITIGATE**. Failing that, it asks whether the financial impact can be shifted
to another party through insurance or contract — that is **TRANSFER**. When none
of those apply, the only remaining option is **ACCEPT**, and acceptance must be a
deliberate, signed, time-bound decision rather than a silent default.

Hover over (or tap, on a touch screen) any box to read a one-paragraph
explanation in the right-hand panel. The four terminal nodes are color-coded —
slate for Avoid, cybersecurity blue for Mitigate, amber for Transfer, and rust
orange for Accept — so the chosen treatment is visible at a glance. The amber
caption beneath the panel states the central lesson: **implicit acceptance is the
failure mode**, and every risk must carry exactly one of these four labels with a
named owner and a review date.

## Lesson Plan

**Learning objective (Bloom: Apply).** Given a described risk, students will
apply the four-option risk-treatment model to select and justify the appropriate
treatment — avoid, mitigate, transfer, or accept — and identify the owner and
review date that the decision requires.

**Suggested classroom use.** Project the tree and present three or four short
risk scenarios (a legacy VPN appliance past end-of-life, a marketing feature
that collects unnecessary personal data, a low-likelihood regional outage, a
ransomware exposure). For each, have students walk the diamonds aloud and stop at
the first "yes." Then ask who must sign and when the next reassessment falls.

**Discussion questions:**

1. Two teams treat the "same" risk differently — one transfers it, one accepts
   it. What difference in *risk appetite* or *cost of control* explains that, and
   is either wrong?
2. Why does transferring a risk to an insurer not reduce the operational impact
   of the event itself? What does it actually change?
3. A risk was "accepted" two years ago and never revisited. Why is an undated,
   unsigned acceptance arguably worse than no decision at all?

## References

- [Risk management — Wikipedia](https://en.wikipedia.org/wiki/Risk_management)
- [IT risk management — Wikipedia](https://en.wikipedia.org/wiki/IT_risk_management)
- [ISO/IEC 27005 (information security risk management) — Wikipedia](https://en.wikipedia.org/wiki/ISO/IEC_27000-series)
- [NIST SP 800-39: Managing Information Security Risk](https://csrc.nist.gov/pubs/sp/800/39/final)

## Specification

The full specification below is extracted from
[Chapter 13: "Organizational Security: Governance, Risk, and Compliance"](../../chapters/13-organizational-security/index.md).

```text
Type: workflow-diagram
sim-id: risk-treatment-decision-tree
Library: Mermaid
Status: Specified

A flowchart starting from a single root box: "Identified Risk: likelihood × impact rating".

Branches:

1. First decision diamond: "Can the activity be eliminated without unacceptable business loss?"
   - Yes -> terminal node "AVOID — Stop the activity. Document the decision."
   - No -> continue to next decision.

2. Second decision diamond: "Is residual risk after available controls below the organization's risk appetite?"
   - Yes (and a control is feasible) -> terminal node "MITIGATE — Implement control(s). Track residual risk."
   - No -> continue.

3. Third decision diamond: "Can the financial impact be transferred to another party (insurance, contract)?"
   - Yes -> terminal node "TRANSFER — Procure insurance / vendor contract. Track coverage limits."
   - No -> continue.

4. Final terminal: "ACCEPT — Document, sign at appropriate executive level, time-bound (typically 12 months), reassess on schedule."

Color: each terminal node colored distinctly — Avoid (slate steel), Mitigate (cybersecurity blue), Transfer (amber), Accept (rust orange).

Caption beneath: "Implicit acceptance is the failure mode. Every risk gets exactly one of these four labels, with an owner and a date."

Responsive: Mermaid graph TD; renders to container width. Caption wraps below 500px.

Implementation: Mermaid flowchart with classDef styling for the four terminal types.
```

## Related Resources

- [Chapter 13: "Organizational Security: Governance, Risk, and Compliance"](../../chapters/13-organizational-security/index.md)
