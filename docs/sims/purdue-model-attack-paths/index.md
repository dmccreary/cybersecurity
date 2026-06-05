---
title: Purdue Model Attack Paths
description: Interactive SVG of the Purdue model levels with the IT/OT boundary highlighted and three historical ICS attack paths overlaid - Stuxnet, Colonial Pipeline, and Oldsmar - each annotated with the control that failed.
image: /sims/purdue-model-attack-paths/purdue-model-attack-paths.png
og:image: /sims/purdue-model-attack-paths/purdue-model-attack-paths.png
twitter:image: /sims/purdue-model-attack-paths/purdue-model-attack-paths.png
social:
  cards: false
status: review
library: SVG
bloom_level: Understand
---

# Purdue Model Attack Paths

![Purdue Model Attack Paths](./purdue-model-attack-paths.png)

<iframe src="main.html" width="100%" height="642" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/purdue-model-attack-paths/main.html" height="642" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This diagram stacks the six **Purdue model** levels — from the **Enterprise**
(Level 5) at the top down to the **Physical Process** (Level 0) at the bottom —
with the **IT/OT boundary** drawn as a thick amber dashed line between Level 4 and
Level 3. Over the levels run three real industrial-control-system attacks as
colored arrows: **Stuxnet (2010)**, **Colonial Pipeline (2021)**, and the
**Oldsmar water plant (2021)**. Each arrow descends through the levels it
actually touched, ending where the impact landed.

Hover over (or tap) any level to read its role, hover an attack arrow to read how
the intrusion moved and — crucially — the **control that failed** at each hop, or
use the buttons to isolate a single attack path. The lessons are pointed: Stuxnet
crossed an *assumed* air gap because USB media was still allowed; Colonial caused
an operational shutdown entirely from the IT side because **MFA was missing on a
VPN**, never touching a controller; and Oldsmar reached a chemical-dosing setpoint
through a remote-access tool with a **shared password**. Together they show that
the IT/OT boundary is only as strong as the weakest control crossing it.

## Lesson Plan

**Learning objective (Bloom: Understand).** Students will identify the six Purdue
levels and the IT/OT boundary, trace three real ICS attacks through those levels,
and name the specific control that failed in each.

**Suggested classroom use.** Project the diagram and isolate one attack at a time
with the buttons. For each, have students state the entry point, the levels
crossed, the impact, and the single control whose absence enabled it. Then ask
which control would have stopped each attack earliest.

**Discussion questions:**

1. Stuxnet defeated an air gap. What does that tell you about treating physical
   isolation as a complete control, and what would you add?
2. Colonial Pipeline never reached Level 1 or 0, yet caused a shutdown. How can an
   IT-only compromise produce operational impact across the IT/OT boundary?
3. All three attacks crossed the IT/OT boundary differently. What is the common
   theme in the controls that failed, and how does least privilege apply?

## References

- [Purdue Enterprise Reference Architecture — Wikipedia](https://en.wikipedia.org/wiki/Purdue_Enterprise_Reference_Architecture)
- [Stuxnet — Wikipedia](https://en.wikipedia.org/wiki/Stuxnet)
- [Colonial Pipeline ransomware attack — Wikipedia](https://en.wikipedia.org/wiki/Colonial_Pipeline_ransomware_attack)
- [Oldsmar water treatment attack — Wikipedia](https://en.wikipedia.org/wiki/2021_Florida_water_system_cyberattack)

## Specification

The full specification below is extracted from
[Chapter 16: "Emerging Topics and Capstone"](../../chapters/16-emerging-and-capstone/index.md).

```text
Type: infographic
sim-id: purdue-model-attack-paths
Library: Static SVG with hover tooltips
Status: Specified

A vertical stack of horizontal bands, each a Purdue level (Level 0 physical
process up to Level 5 enterprise), with the IT/OT boundary drawn as a thick
dashed line (amber) between Level 3 and Level 4. Three labeled attack paths drawn
as red arrows descend through the levels with hover tooltips:
- Stuxnet (2010): USB -> Level 3 workstation -> Level 1 PLC -> Level 0 centrifuge.
- Colonial Pipeline (2021): VPN credential -> Level 4 IT -> operational impact via
  shutdown of Level 3 systems.
- Oldsmar water (2021): TeamViewer -> HMI at Level 2 -> setpoint change at Level 1
  -> Level 0 chemical dosing.
Each arrow is annotated with the control that failed.

Color: cybersecurity blue, alert accent for boundary, slate steel and rust orange
for OT levels. Responsive; tooltips are tap targets on touch screens.

Implementation: Static SVG with CSS hover and a small JavaScript tooltip layer.
```

## Related Resources

- [Chapter 16: "Emerging Topics and Capstone"](../../chapters/16-emerging-and-capstone/index.md)
