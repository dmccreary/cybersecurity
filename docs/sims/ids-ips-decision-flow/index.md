---
title: IDS/IPS Decision Flow
description: Interactive Mermaid flowchart contrasting an out-of-band Intrusion Detection System with an in-line Intrusion Prevention System, with a pros and cons comparison panel.
image: /sims/ids-ips-decision-flow/ids-ips-decision-flow.png
og:image: /sims/ids-ips-decision-flow/ids-ips-decision-flow.png
twitter:image: /sims/ids-ips-decision-flow/ids-ips-decision-flow.png
social:
  cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# IDS/IPS Decision Flow

![IDS/IPS Decision Flow](./ids-ips-decision-flow.png)

<iframe src="main.html" width="100%" height="702" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/ids-ips-decision-flow/main.html" height="702" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This diagram follows a single inbound packet down two very different paths. On
the **IDS (out-of-band)** branch, a switch SPAN port copies the packet to a
detection engine that runs signature and anomaly analysis in parallel; if it
matches, the IDS emits an **alert to the SIEM** — but the original packet
reaches its destination unchanged. The IDS observes and records; it never
blocks. On the **IPS (in-line)** branch, the packet must pass *through* the
engine in the live data path: a signature match is dropped, logged, and the
connection terminated, while a high anomaly score is dropped or quarantined.
Only clean traffic is forwarded.

Hover over (or tap, on a touch screen) any box to read a one-paragraph
explanation in the right-hand panel, and consult the comparison table beneath
it to weigh the trade-offs. The color key separates permitted flow (blue),
alert-only events (amber), drops (red), and decision points (slate). The core
insight is the trade between control and availability: an IDS carries no
availability risk but cannot stop an attack in flight, while an IPS can block in
real time but becomes a single point of failure and a source of false-positive
outages.

## Lesson Plan

**Learning objective (Bloom: Understand).** Students will distinguish
out-of-band intrusion detection from in-line intrusion prevention and explain
why placement in (or beside) the data path determines whether a sensor can block
traffic.

**Suggested classroom use.** Project the diagram and trace one malicious packet
down both branches, pausing at each decision diamond to ask students what
happens next. Then assign two short scenarios — a hospital network that must
never drop legitimate traffic, and a payment gateway that must stop known
exploits instantly — and have students argue for IDS, IPS, or both.

**Discussion questions:**

1. A SPAN-port IDS detects a live exploit. Why can it not stop the connection,
   and what compensating control would you pair it with?
2. An in-line IPS rule starts dropping legitimate traffic during a traffic
   spike. What is the blast radius, and how does "fail open" vs "fail closed"
   change your answer?
3. When would you deliberately run aggressive, noisy rules on an IDS that you
   would never enable on an IPS?

## References

- [Intrusion detection system — Wikipedia](https://en.wikipedia.org/wiki/Intrusion_detection_system)
- [Intrusion prevention system — Wikipedia](https://en.wikipedia.org/wiki/Intrusion_detection_system#Intrusion_prevention)
- [Port mirroring (SPAN) — Wikipedia](https://en.wikipedia.org/wiki/Port_mirroring)
- [NIST SP 800-94: Guide to Intrusion Detection and Prevention Systems](https://csrc.nist.gov/pubs/sp/800/94/final)

## Specification

The full specification below is extracted from
[Chapter 8: "Network Security Foundations: Protocols, Firewalls, and Detection"](../../chapters/08-network-foundations/index.md).

```text
Type: workflow-diagram
sim-id: ids-ips-decision-flow
Library: Mermaid
Status: Specified

A flowchart starting at the top with "Inbound packet" entering the network boundary.

Branch 1: IDS path (out-of-band)
- Packet -> Switch SPAN port -> IDS engine (signature engine + anomaly engine in parallel)
- If match -> emit alert to SIEM (orange annotation: "alert only — packet is not blocked")
- Original packet continues to destination unchanged

Branch 2: IPS path (in-line)
- Packet enters IPS engine in the data path
- Signature check: if known-bad -> drop, log, terminate connection
- Anomaly check: if score above threshold -> drop or quarantine
- Otherwise -> forward packet to destination

Below the two branches, a comparison panel:
- IDS pros: no availability risk, can run aggressive rules
- IDS cons: no real-time blocking
- IPS pros: real-time blocking, automatic response
- IPS cons: false positives drop legitimate traffic; single point of failure

Color: cybersecurity blue for permitted-traffic flow, amber for alerts, red for
drops, slate for the comparison panel. Responsive: stacks vertically below 700px.

Implementation: Mermaid flowchart TD with custom node styling and subgraphs for the two branches.
```

## Related Resources

- [Chapter 8: "Network Security Foundations: Protocols, Firewalls, and Detection"](../../chapters/08-network-foundations/index.md)
