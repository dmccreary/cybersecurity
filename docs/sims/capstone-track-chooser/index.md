---
title: Choosing a Capstone Track
description: A three-branch decision tree that helps students choose among a Secure System, Security Program, or Applied Research capstone, with hover tooltips showing the estimated weeks of effort for each deliverable.
image: /sims/capstone-track-chooser/capstone-track-chooser.png
og:image: /sims/capstone-track-chooser/capstone-track-chooser.png
twitter:image: /sims/capstone-track-chooser/capstone-track-chooser.png
social:
  cards: false
status: review
library: Static SVG with hover tooltips
bloom_level: Understand
---

# Choosing a Capstone Track

![Choosing a Capstone Track](./capstone-track-chooser.png)

<iframe src="main.html" width="100%" height="602" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/capstone-track-chooser/main.html"
        width="100%" height="600" scrolling="no"></iframe>
```

## About this MicroSim

This infographic frames the capstone decision as a single question — "What kind
of security work draws you in?" — that branches into three tracks. The left
branch (cybersecurity blue) leads to **Capstone A: Secure System**, for students
who want to build and defend a real system. The center branch (slate steel)
leads to **Capstone B: Security Program**, for students who want to design how
an organization manages risk. The right branch (alert amber) leads to
**Capstone C: Applied Research**, for students who want to investigate an
emerging question rigorously. Each card lists its concrete deliverables inside a
rust-orange-bordered panel.

Hover (or tap on a tablet) any deliverable to see a tooltip with its estimated
weeks of effort, so you can compare the shape and pace of each track before you
commit a semester to it. A banner across the bottom reminds you that all three
tracks satisfy ABET Student Outcomes 1-6 — the choice is about the work you want
to do, not about which track "counts" more. The diagram scales to its container
width so it remains readable when embedded in a chapter page.

## Lesson Plan

**Learning objective (Bloom: Understand):** Given the three capstone tracks,
students will identify which track's deliverables best match the kind of
security work they want to do and justify the choice from the deliverable
timeline.

**Suggested classroom use:** Show this MicroSim at the capstone-planning
meeting. Ask each student to hover all deliverables across the three cards and
privately tally the rough total weeks per track. Then have them pair up and
explain to a partner which track they are drawn to and why, using at least two
specific deliverables as evidence.

**Discussion questions:**

1. Two tracks each spend their largest single block of weeks on a "build"
   deliverable (Prototype, Proof-of-concept). How are those two builds different
   in purpose?
2. Capstone B has no "prototype" deliverable. What does that tell you about the
   kind of evidence a security-program capstone produces?
3. If all three tracks satisfy the same ABET outcomes, what *should* drive your
   choice between them?

## References

- [ABET Cybersecurity Program Criteria](https://www.abet.org/accreditation/accreditation-criteria/criteria-for-accrediting-computing-programs-2024-2025/) — the Student Outcomes 1-6 referenced in the banner.
- [Wikipedia: Capstone course](https://en.wikipedia.org/wiki/Capstone_course) — background on the capstone-project model.
- [Wikipedia: Threat model](https://en.wikipedia.org/wiki/Threat_model) — the first deliverable of the Secure System track.
- [NIST SP 800-53 Security and Privacy Controls](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final) — the control framework referenced by the Security Program track.

## Specification

The full specification below is extracted from
[Chapter 16: "Emerging Topics and Capstone Pathways"](../../chapters/16-emerging-and-capstone/index.md).

```text
Type: infographic
**sim-id:** capstone-track-chooser
**Library:** Static SVG with hover tooltips

A clean three-branch decision tree starting from the question "What kind of
security work draws you in?" Three branches descend to cards: Capstone A Secure
System (blue), Capstone B Security Program (slate), Capstone C Applied Research
(amber). Hover tooltips on each deliverable show estimated weeks of effort. A
banner notes all three satisfy ABET Student Outcomes 1-6. Cards have rust-orange
accent borders. Responsive; branches reflow on narrow viewports.
```

## Related Resources

- [Chapter 16: "Emerging Topics and Capstone Pathways"](../../chapters/16-emerging-and-capstone/index.md)
