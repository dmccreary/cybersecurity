---
title: Privacy-Enhancing Technologies Compared
description: Interactive SVG 2x2 comparison of four privacy-enhancing technologies (FHE, MPC, Differential Privacy, Zero-Knowledge Proofs) across definition, input/output visibility, computational cost, and maturity, with a real-world example tooltip per card.
image: /sims/privacy-tech-compare/privacy-tech-compare.png
og:image: /sims/privacy-tech-compare/privacy-tech-compare.png
twitter:image: /sims/privacy-tech-compare/privacy-tech-compare.png
social:
  cards: false
status: review
library: Static SVG with hover tooltips
bloom_level: Analyze
---

# Privacy-Enhancing Technologies Compared

![Privacy-Enhancing Technologies Compared](./privacy-tech-compare.png)

<iframe src="main.html" width="100%" height="527" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/privacy-tech-compare/main.html" height="527" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

Four modern privacy-enhancing technologies are laid out as a 2x2 grid of cards, each
described with the **same six fields** so they can be compared head to head:
**Homomorphic Encryption (FHE)**, **Secure Multi-Party Computation (MPC)**,
**Differential Privacy (DP)**, and **Zero-Knowledge Proofs (ZKP)**.

Every card answers the questions that actually drive a design decision: a one-line
definition, *who can see the inputs*, *who can see the outputs*, the **computational
cost** (visualized as a 1–5 bar that runs from rust to gold), and the technique's
**maturity** (research, niche, or production). Reading down the cost column alone is
revealing: differential privacy is cheap (1/5) while fully homomorphic encryption is
expensive (5/5), which is why they show up in very different places.

Hover or tap any card for a **real-world example** — the U.S. 2020 Census for DP,
Zcash for ZKP, threshold signatures for MPC, privacy-preserving ML inference for
FHE. The amber footer band summarizes *when to reach for which*: each technique
answers a different privacy question, so the goal is to match the tool to the
requirement rather than defaulting to the most powerful (and most expensive) option.

## Lesson Plan

**Learning objective (Bloom: Analyze).** Students will compare four
privacy-enhancing technologies across the same six fields and select the appropriate
technique for a given privacy requirement, justifying the choice with the
input/output visibility and cost dimensions.

**Suggested classroom use.** Present three short scenarios — "publish neighborhood
income statistics", "two hospitals study a shared cohort without sharing records",
"prove you are over 18 without revealing your birthdate" — and have students name
the best-fit technique and defend it using the card fields.

**Discussion questions:**

1. DP and FHE sit at opposite ends of the cost scale. How does that cost difference
   explain where each one is actually deployed today?
2. In MPC, every participant learns the output but not the others' inputs; in ZKP,
   only the verifier learns a true/false result. Why does that distinction matter
   when choosing between them?
3. "Privacy" is not one property. For each technique, who exactly is being protected
   from whom?

## References

- [Homomorphic encryption — Wikipedia](https://en.wikipedia.org/wiki/Homomorphic_encryption)
- [Secure multi-party computation — Wikipedia](https://en.wikipedia.org/wiki/Secure_multi-party_computation)
- [Differential privacy — Wikipedia](https://en.wikipedia.org/wiki/Differential_privacy)
- [Zero-knowledge proof — Wikipedia](https://en.wikipedia.org/wiki/Zero-knowledge_proof)

## Specification

The full specification below is extracted from
[Chapter 4: "Cryptography in Practice: PKI, TLS, and Data Protection"](../../chapters/04-crypto-in-practice/index.md).

```text
Type: infographic-svg
sim-id: privacy-tech-compare
Library: Static SVG with hover tooltips
Status: Specified

A 2x2 grid of cards, each describing one technique with the same six fields:
header (technique name), one-line definition, inputs visible to whom, outputs
visible to whom, computational cost (1-5 bars), maturity, and a real-world example
in a hover tooltip.

Card 1 — Homomorphic Encryption (FHE): compute on ciphertext; inputs/outputs client
only; cost 5/5; maturity niche→production. Card 2 — MPC: parties compute jointly
without sharing inputs; cost 3/5; production. Card 3 — Differential Privacy: add
calibrated noise; cost 1/5; production. Card 4 — Zero-Knowledge Proofs: prove a
statement without revealing why; cost 4/5; production (growing).

A footer band lists "when to reach for which". Color: cybersecurity blue and slate
for headers, rust→gold gradient for the cost bars. Responsive: the SVG scales to its
container.
```

## Related Resources

- [Chapter 4: "Cryptography in Practice: PKI, TLS, and Data Protection"](../../chapters/04-crypto-in-practice/index.md)
