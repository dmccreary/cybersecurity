---
title: MITRE ATT&CK Tactic Sequence Explorer
description: Step through preset attack campaigns and watch each technique appear in the column of its MITRE ATT&CK tactic, analyzing how techniques chain into a full campaign and where a SOC could first detect it.
image: /sims/attack-tactic-sequence/attack-tactic-sequence.png
og:image: /sims/attack-tactic-sequence/attack-tactic-sequence.png
twitter:image: /sims/attack-tactic-sequence/attack-tactic-sequence.png
social:
  cards: false
status: review
library: p5.js
bloom_level: Analyze
---

# MITRE ATT&CK Tactic Sequence Explorer

![MITRE ATT&CK Tactic Sequence Explorer](./attack-tactic-sequence.png)

<iframe src="main.html" width="100%" height="542" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/attack-tactic-sequence/main.html"
        width="100%" height="542" scrolling="no"></iframe>
```

## About this MicroSim

This MicroSim lays out the fourteen MITRE ATT&CK Enterprise tactics as labeled
columns across the top, in kill-chain order from Reconnaissance through Impact.
Pick a preset campaign from the **Scenario** dropdown and use **Step Forward**
to reveal the attacker's techniques one at a time. Each technique appears as a
circle positioned in the column of the tactic it belongs to, connected by an
arrow to the previous step, so you can watch a real-world campaign trace a path
across the tactics rather than a single event. A progress strip at the bottom
shows the cumulative share of the campaign that has unfolded.

Click any revealed circle to open a tooltip with the technique ID and name (for
example "T1566 — Phishing"), a short description of what the attacker does, and
one concrete defender-side detection idea. The amber pulsing circle marks the
earliest point a typical Security Operations Center would have had a realistic
chance to detect the intrusion — use it to reason about where defenses pay off
most. **Step Back**, **Reset**, **Play All**, and the speed slider let you
control the pace of exploration.

## Lesson Plan

**Learning objective (Bloom: Analyze):** Students will analyze how individual
techniques chain into a complete campaign by stepping through preset scenarios,
identifying which tactic each technique belongs to, and locating the earliest
realistic detection opportunity.

**Suggested classroom use:** Project the MicroSim and walk the "Phishing →
Ransomware" scenario one step at a time. At each step, pause and ask students to
name the tactic *before* revealing the column, then click the circle to check
the detection idea. Then assign small groups a different scenario each and have
them present the attacker's path and their proposed earliest detection point.

**Discussion questions:**

1. In the "Supply Chain Compromise" scenario, why is the earliest detection
   point so much harder to act on than in the phishing scenario?
2. Two scenarios both end in Exfiltration but reach it through different
   tactics. What does that tell you about defending the Exfiltration stage
   versus defending earlier stages?
3. If you could add only one detection control to your SOC, which step in your
   assigned scenario would you instrument first, and why?

## References

- [MITRE ATT&CK Enterprise Matrix](https://attack.mitre.org/matrices/enterprise/) — the canonical list of tactics and techniques used in this MicroSim.
- [MITRE ATT&CK Tactics](https://attack.mitre.org/tactics/enterprise/) — descriptions of each of the fourteen Enterprise tactics.
- [Wikipedia: Cyber kill chain](https://en.wikipedia.org/wiki/Kill_chain#Computer_security_model) — the staged model that ATT&CK tactics extend.
- [SolarWinds supply chain attack](https://en.wikipedia.org/wiki/2020_United_States_federal_government_data_breach) — background for the supply-chain scenario.

## Specification

The full specification below is extracted from
[Chapter 15: "Offensive and Defensive Security Operations"](../../chapters/15-security-operations/index.md).

```text
Type: microsim
**sim-id:** attack-tactic-sequence
**Library:** p5.js

An interactive p5.js MicroSim that visualizes how an attack progresses across
MITRE ATT&CK tactics. 14 tactic columns across the top; attacker techniques
shown as circles in the column of their tactic; step controls, scenario
selector, play-all with speed slider; click a circle for technique details and
a detection idea; the first SOC-detectable technique pulses in alert amber; a
progress strip shows cumulative campaign completion.

Learning objective (Bloom's: Analyzing): Students will analyze how individual
techniques chain into a complete campaign by stepping through preset scenarios
and identifying which tactic each technique belongs to.
```

## Related Resources

- [Chapter 15: "Offensive and Defensive Security Operations"](../../chapters/15-security-operations/index.md)
