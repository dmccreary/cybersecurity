---
title: The Purdue Model — IT/OT Network Layers
description: A Mermaid diagram of the Purdue Enterprise Reference Architecture — seven stacked ICS/OT layers from the enterprise network down to the physical process, with the firewalled IT/OT DMZ and the IT-vs-OT CIA priority inversion.
image: /sims/purdue-model-layers/purdue-model-layers.png
og:image: /sims/purdue-model-layers/purdue-model-layers.png
twitter:image: /sims/purdue-model-layers/purdue-model-layers.png
social:
   cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# The Purdue Model — IT/OT Network Layers

![The Purdue Model — IT/OT Network Layers](./purdue-model-layers.png)

<iframe src="main.html" width="100%" height="977" scrolling="no"></iframe>

[Run the Purdue Model MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/purdue-model-layers/main.html" height="977" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

The **Purdue model** (the Purdue Enterprise Reference Architecture) is the standard
way to reason about the network architecture of an industrial control system. This
diagram stacks its layers the way the standard draws them: ordinary **enterprise IT**
at the top (Level 5 email/ERP/internet, Level 4 plant logistics), the **physical
process** at the bottom (Level 0 sensors, actuators, pumps, valves), and the
**operational technology** layers in between — Level 3 operations management, Level 2
SCADA/HMIs, Level 1 PLCs and controllers. Between the IT and OT worlds sits the
amber **IT/OT DMZ**: a controlled boundary holding a data-historian replica, jump
hosts, and security monitoring.

The single most important detail is the boundary crossing into Level 3, annotated
**"brokered, inspected, monotone — no direct sessions."** Nothing on the enterprise
side opens a session straight into the control network; traffic is mediated and
inspected at the DMZ. The right-hand legend shows the **CIA priority inversion** that
makes OT different from IT: in the enterprise, **confidentiality** comes first, but on
the plant floor **availability** does — a stopped turbine or a mis-actuated valve is a
safety event far worse than a leaked spreadsheet. Hover any layer for detail.

## Lesson Plan

**Learning objective (Bloom — Understand):** Students can identify the seven layers of
the Purdue model from the enterprise network to the physical process and explain the
IT/OT DMZ boundary and why the CIA priority order inverts between IT and OT.

**Suggested classroom use:** Read the stack top-down, hovering each layer. Stop at the
DMZ and ask why a direct remote-desktop session from an engineer's corporate laptop to
a PLC would violate the model. Then compare the two CIA orderings in the legend.

**Discussion questions:**

1. Why does the IT/OT DMZ forbid direct sessions from the enterprise into the control
   systems rather than just firewalling specific ports?
2. Why does **availability** outrank **confidentiality** on the plant floor when the
   opposite holds in enterprise IT?
3. An attacker lands on the Level 5 enterprise network. What does the Purdue
   architecture force them to do before they can reach a Level 1 PLC?

## References

- [Purdue Enterprise Reference Architecture (Wikipedia)](https://en.wikipedia.org/wiki/Purdue_Enterprise_Reference_Architecture)
- [Industrial control system (Wikipedia)](https://en.wikipedia.org/wiki/Industrial_control_system)
- [SCADA (Wikipedia)](https://en.wikipedia.org/wiki/SCADA)

## Specification

The full specification below is extracted from
[Chapter 14: "Societal Security: Law, Forensics, and Ethics"](../../chapters/14-societal-security/index.md).

```text
Type: diagram
**sim-id:** purdue-model-layers<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Mermaid `flowchart TB` with seven horizontal layers stacked top to bottom, each a colored band:

- **Level 5 — Enterprise Network** (slate steel #455a64) — "Email, ERP, Internet"
- **Level 4 — Business Logistics** (slate steel) — "Plant scheduling, inventory"
- **(IT/OT DMZ)** (alert accent #ffa000, dashed border) — "Data historian replica, jump host, security monitoring"
- **Level 3 — Operations Management** (cybersecurity blue #1565c0) — "Engineering workstations, historians, MES"
- **Level 2 — Supervisory Control** (cybersecurity blue) — "HMIs, SCADA servers"
- **Level 1 — Basic Control** (cybersecurity blue, darker) — "PLCs, DCS controllers"
- **Level 0 — Physical Process** (cream #fff8e1 with slate border) — "Sensors, actuators, pumps, valves"

Vertical arrows between levels are bidirectional, but the arrow crossing the IT/OT DMZ is annotated **"Brokered, inspected, monotone — no direct sessions"** to emphasize the firewalled boundary.

A right-side legend explains the **CIA priority inversion**: IT (Confidentiality > Integrity > Availability) versus OT (Availability > Integrity > Confidentiality).

Implementation: Mermaid `flowchart TB` with subgraph layers and color classes; legend rendered alongside.
```

## Related Resources

- [Chapter 14: "Societal Security: Law, Forensics, and Ethics"](../../chapters/14-societal-security/index.md)
