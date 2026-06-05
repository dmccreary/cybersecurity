---
title: Side-Channel Attack Surface
description: An interactive SVG infographic of a CPU leaking its secret key through four physical side channels — timing, power/EM, cache, and rowhammer — with hover tooltips and a defenses badge.
image: /sims/side-channel-overview/side-channel-overview.png
og:image: /sims/side-channel-overview/side-channel-overview.png
twitter:image: /sims/side-channel-overview/side-channel-overview.png
social:
   cards: false
status: review
library: Static SVG with hover tooltips
bloom_level: Understand
---

# Side-Channel Attack Surface

![Side-Channel Attack Surface](./side-channel-overview.png)

<iframe src="main.html" width="100%" height="582" scrolling="no"></iframe>

[Run the Side-Channel Attack Surface MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/side-channel-overview/main.html" height="582" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This infographic makes a single uncomfortable point visible: a cryptographic
implementation can be logically perfect and still leak its secret key. At the
center, a CPU package performs a crypto operation while holding **secret key K**.
The key never crosses the logical interface — but four amber channels radiate
outward, each ending at an attacker, because *computing on* the key produces
physical side effects an adversary can measure.

The four channels are: **timing** (execution time varies with secret-dependent
branches — defeated by constant-time code), **power / EM** (instantaneous current
draw and radiated fields correlate with the data — defeated by masking and
shielding), **cache** (a co-tenant VM observes shared cache state, as in
Spectre-class attacks — defeated by removing co-tenancy), and **rowhammer**, a
two-way fault channel where hammering adjacent DRAM rows flips bits in a victim
row (defeated by ECC RAM and Target Row Refresh). Hover (or tap) any channel for
a one-line description and a real-world example. The green badge underneath
collects the matching defenses. Below 700px the radial layout collapses to a
vertical list.

## Lesson Plan

**Learning objective (Bloom — Understand):** Students can identify the four major
hardware side channels, explain that the leak is physical rather than logical,
and match a defense to each class.

**Suggested classroom use:** Start with the question "if the code has no bugs, how
can the key leak?" Then reveal the chip and walk each channel's tooltip. Finish by
having students pair each channel with its defense from the badge and explain why
that defense addresses *that* physical effect specifically.

**Discussion questions:**

1. Why does constant-time code defend the timing channel but do nothing for the
   power channel?
2. Rowhammer is drawn with a two-way arrow. Why is it different from the other
   three "read-only" channels?
3. A cloud provider runs many tenants on shared hardware. Which channel does that
   business model make most dangerous, and what is the trade-off in mitigating it?

## References

- [Side-channel attack (Wikipedia)](https://en.wikipedia.org/wiki/Side-channel_attack)
- [Row hammer (Wikipedia)](https://en.wikipedia.org/wiki/Row_hammer)
- [Spectre (security vulnerability) (Wikipedia)](https://en.wikipedia.org/wiki/Spectre_(security_vulnerability))

## Specification

The full specification below is extracted from
[Chapter 7: "Component and Hardware Security"](../../chapters/07-component-security/index.md).

```text
Type: infographic-svg
**sim-id:** side-channel-overview<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A central illustration of a CPU chip on a board, with four labeled channels radiating outward.

Center: a stylized CPU package (cybersecurity blue, slate-steel border) labeled "Cryptographic operation in progress." Inside, a small lock icon labeled "Secret key K."

Four arrows leaving the chip, each in amber (#ffa000), each terminating at an attacker icon:

1. **Up — Timing channel.** Arrow labeled "execution time (cycles, ms)"; attacker shown with a stopwatch.
2. **Right — Power / EM channel.** Arrow labeled "current draw, EM field"; attacker shown with an oscilloscope and probe.
3. **Down — Cache channel.** Arrow labeled "shared cache state"; attacker shown as a co-tenant VM with a measuring icon.
4. **Left — Rowhammer (fault).** A two-way arrow labeled "induced bit flips in DRAM"; attacker shown writing to adjacent rows.

Below the central chip: a green badge labeled "Defenses: constant-time code, masking, shielding, no co-tenancy, ECC RAM, TRR."

Hover tooltips on each channel show a one-line description and a real-world example (Spectre for cache, faulTPM for power, etc.).

Color: cybersecurity blue for the chip, amber for leak channels, slate steel for the board, green for the defenses badge.

Responsive: 4-arrow radial layout collapses to vertical list with icons below 700px.

Implementation: Static SVG with `<title>` tooltips and a small JS handler to scale the radial pattern responsively.
```

## Related Resources

- [Chapter 7: "Component and Hardware Security"](../../chapters/07-component-security/index.md)
