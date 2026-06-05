---
title: PICERL Incident Response Lifecycle
description: Mermaid flowchart of the six PICERL incident-response phases as a closed loop, with a dashed feedback arrow from Lessons Learned back to Preparation and typical time labels per phase.
image: /sims/picerl-lifecycle/picerl-lifecycle.png
og:image: /sims/picerl-lifecycle/picerl-lifecycle.png
twitter:image: /sims/picerl-lifecycle/picerl-lifecycle.png
social:
  cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# PICERL Incident Response Lifecycle

![PICERL Incident Response Lifecycle](./picerl-lifecycle.png)

<iframe src="main.html" width="100%" height="252" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/picerl-lifecycle/main.html" height="252" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

PICERL is the classic six-phase incident-response lifecycle: **P**reparation,
**I**dentification, **C**ontainment, **E**radication, **R**ecovery, and **L**essons
Learned. This diagram lays the six phases out left to right and, crucially, closes
the loop with a dashed blue arrow that returns from Lessons Learned back to
Preparation — that feedback edge is what makes PICERL a *lifecycle* rather than a
one-time checklist.

The colors encode role. The two blue phases — **Preparation** and **Lessons
Learned** — are the durable, between-incident work that happens when no alarm is
ringing. **Containment** is amber because it is the most time-critical phase: it is
where you stop the bleeding before deciding how to clean up. The remaining phases
(Identification, Eradication, Recovery) are the active-incident work shown in slate.

Each box also carries a typical **time/effort** label, from "ongoing" preparation
through "hours" to identify, "minutes to hours" to contain, "days" to eradicate,
"weeks" to recover, and "weeks after" for the review. Those labels are deliberately
rough — they exist to build intuition that containment is fast and decisive while
recovery and review are slow and thorough.

## Lesson Plan

**Learning objective (Bloom: Understand).** Students will name the six PICERL phases
in order, explain what happens in each, and describe how the Lessons Learned →
Preparation feedback loop improves the organization's response to future incidents.

**Suggested classroom use.** Walk a short tabletop scenario (e.g., a ransomware
detection) through all six phases, asking students what specific action belongs in
each phase and roughly how long they would expect to spend there.

**Discussion questions:**

1. Why is Containment treated as the most time-critical phase, and what is the
   difference between short-term and long-term containment?
2. What concrete artifacts should the Lessons Learned phase produce so that the
   feedback loop into Preparation is real and not just a meeting?
3. Eradication and Recovery are sometimes rushed under business pressure. What goes
   wrong if you start Recovery before Eradication is complete?

## References

- [Incident response (computer security) — Wikipedia](https://en.wikipedia.org/wiki/Incident_response)
- [Computer security incident management — Wikipedia](https://en.wikipedia.org/wiki/Computer_security_incident_management)
- [SANS Institute — Wikipedia](https://en.wikipedia.org/wiki/SANS_Institute)

## Specification

The full specification below is extracted from
[Chapter 15: "Offensive and Defensive Security Operations"](../../chapters/15-security-operations/index.md).

```text
Type: workflow-diagram
sim-id: picerl-lifecycle
Library: Mermaid
Status: Specified

A closed-loop diagram of the six PICERL phases: Preparation (blue), Identification
(slate), Containment (amber, time-critical), Eradication (slate), Recovery (slate),
Lessons Learned (blue). Arrows form the cycle and a dashed arrow returns from
Lessons Learned to Preparation, emphasizing the feedback loop. Each phase carries a
relative-time annotation (hours to identify, minutes-hours to contain, days to
eradicate, weeks to recover, weeks-after to review).

Color: cybersecurity blue, slate steel, alert accent amber for the time-critical
phase. Background white. Responsive via Mermaid useMaxWidth.
```

## Related Resources

- [Chapter 15: "Offensive and Defensive Security Operations"](../../chapters/15-security-operations/index.md)
