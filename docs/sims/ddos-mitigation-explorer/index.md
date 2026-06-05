---
title: DDoS Mitigation Explorer
description: Interactive p5.js simulation of DDoS attack and defense. Adjust the botnet and attack type, toggle ingress filtering, anycast, scrubbing, and rate limiting, and watch how much traffic reaches the origin.
image: /sims/ddos-mitigation-explorer/ddos-mitigation-explorer.png
og:image: /sims/ddos-mitigation-explorer/ddos-mitigation-explorer.png
twitter:image: /sims/ddos-mitigation-explorer/ddos-mitigation-explorer.png
social:
  cards: false
status: review
library: p5.js
bloom_level: Analyze
---

# DDoS Mitigation Explorer

![DDoS Mitigation Explorer](./ddos-mitigation-explorer.png)

<iframe src="main.html" width="100%" height="527" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/ddos-mitigation-explorer/main.html" height="527" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

An attacker **botnet** on the left fires traffic toward an **origin server** on
the right, passing through up to four optional **defense layers** in the middle.
Amber dots are attack traffic; the steady green stream along the bottom is
legitimate requests. The origin has two health bars — **bandwidth** (loaded by
volumetric attacks) and **CPU** (loaded by application-layer attacks) — and turns
red when overwhelmed. A ticker reports the percentage of legitimate requests
served.

Use the sliders to set the number of bots and the per-bot request rate, and the
dropdowns to choose the attack type and (for volumetric attacks only) an
amplification reflector. Then analyze each defense in isolation: **BCP38** ingress
filtering strips spoofed/amplified volumetric traffic; **anycast** splits the load
across three points of presence; the **scrubbing** center absorbs most identified
attack traffic at the cost of latency; and **rate limiting** caps per-IP request
rates but weakens as the botnet grows more diverse.

The pedagogical payoff is seeing that no single defense is sufficient: a defense
that crushes one attack type may do nothing against another. Move your mouse over
the canvas to animate the traffic.

## Lesson Plan

**Learning objective (Bloom: Analyze).** Students will analyze how different DDoS
mitigation strategies reduce the impact of volumetric versus application-layer
attacks by manipulating attack parameters and defense settings and observing the
change in traffic reaching the origin.

**Suggested classroom use.** Assign each student an attack type and have them find
the *minimal* set of defenses that keeps legitimate-requests-served above 50%.
Then have them try a Memcached-amplified volumetric attack with and without BCP38
and explain the dramatic difference.

**Discussion questions:**

1. Why does BCP38 ingress filtering help enormously against an amplified
   volumetric attack but not at all against an L7-CPU attack?
2. Rate limiting works well against a small botnet but degrades as you raise the
   bot count. What real-world property of large botnets does this model?
3. Scrubbing absorbs ~95% of attack traffic but adds latency. When is that
   trade-off worth it, and when is anycast a better first move?

## References

- [Denial-of-service attack — Wikipedia](https://en.wikipedia.org/wiki/Denial-of-service_attack)
- [BCP 38 / ingress filtering — Wikipedia](https://en.wikipedia.org/wiki/Ingress_filtering)
- [Anycast — Wikipedia](https://en.wikipedia.org/wiki/Anycast)
- [DDoS mitigation — Wikipedia](https://en.wikipedia.org/wiki/DDoS_mitigation)

## Specification

The full specification below is extracted from
[Chapter 9: "Advanced Network Defense: Wireless, DNS, and Zero Trust"](../../chapters/09-advanced-network-defense/index.md).

```text
Type: microsim
sim-id: ddos-mitigation-explorer
Library: p5.js
Status: Specified

Learning objective (Bloom's: Analyze): Students will analyze how different DDoS
mitigation strategies (ingress filtering, anycast, scrubbing, rate limiting)
reduce the impact of volumetric vs. application-layer attacks.

Layout: attacker botnet (left), defense layers (center: ingress filter, anycast,
scrubbing, rate limiter), origin server with bandwidth and CPU health bars
(right), and a ticker for legitimate requests served.

Controls: sliders for bot count (10-10,000) and attack rate per bot (1-100 req/s);
selects for attack type (Volumetric, L7-CPU, L7-DB) and amplification reflector
(None, DNS 50x, NTP 500x, Memcached 50,000x, volumetric only); checkboxes for
BCP38, anycast, scrubbing, rate limiting; reset button.

Behavior: defenses absorb a fraction of attack traffic by type; volumetric maxes
bandwidth, L7 maxes CPU; legitimate traffic shown alongside attack traffic.

Color palette: cybersecurity blue defense layers, amber attack traffic, green
legitimate traffic, red overwhelmed origin. Responsive via updateCanvasSize().
```

## Related Resources

- [Chapter 9: "Advanced Network Defense: Wireless, DNS, and Zero Trust"](../../chapters/09-advanced-network-defense/index.md)
