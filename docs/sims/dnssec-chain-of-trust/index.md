---
title: DNSSEC Validation Chain
description: A Mermaid tree of the DNSSEC chain of trust from the root zone trust anchor to a leaf A record, with the resolver's bottom-up validation steps.
image: /sims/dnssec-chain-of-trust/dnssec-chain-of-trust.png
og:image: /sims/dnssec-chain-of-trust/dnssec-chain-of-trust.png
twitter:image: /sims/dnssec-chain-of-trust/dnssec-chain-of-trust.png
social:
   cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# DNSSEC Validation Chain

![DNSSEC Validation Chain](./dnssec-chain-of-trust.png)

<iframe src="main.html" width="100%" height="672" scrolling="no"></iframe>

[Run the DNSSEC Chain of Trust MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/dnssec-chain-of-trust/main.html" height="672" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This diagram shows how **DNSSEC** turns ordinary DNS answers into ones a resolver
can cryptographically trust. The left panel is the *chain of trust*: the root
zone signs a delegation to the `.example` TLD, which signs a delegation to
`bank.example`, which signs the final `www.bank.example` A record. Each parent
publishes a **DS record** — a hash of its child's Key Signing Key — so that one
signed link points to the next. Hovering any zone reveals what that link
contributes.

The green root node is the **trust anchor**: every validator ships with the root
KSK out of band, so the chain ultimately reduces to "does this match the anchor I
already trust?" The right panel lists what the resolver actually does on a lookup
— and it runs *bottom-up*, the opposite direction from how the chain is built:
verify the leaf signature, then the bank's key, then `.example`, then root, then
compare to the anchor. The red callout names the failure mode: any broken or
missing link returns SERVFAIL rather than a trusted-looking but unverified answer.
The layout reflows to a single column on narrow screens.

## Lesson Plan

**Learning objective (Bloom — Understand):** Students can trace the DNSSEC chain
of trust and explain how DS records link each zone to its parent, and why any
broken link causes the resolver to return SERVFAIL.

**Suggested classroom use:** Trace the chain top-down (how it is built), then walk
the resolver steps to show validation goes bottom-up (how it is checked). Pose a
broken-link scenario (a stale DS record) and have students predict the resolver's
response.

**Discussion questions:**

1. Why does the security of the entire chain reduce to a single value — the root
   KSK trust anchor that validators ship with?
2. The chain is *built* top-down but *validated* bottom-up. Why does the resolver
   start from the leaf record?
3. DNSSEC fails closed (SERVFAIL) rather than open. What is the operational cost
   of that choice, and why is it the right default for integrity?

## References

- [Domain Name System Security Extensions (Wikipedia)](https://en.wikipedia.org/wiki/Domain_Name_System_Security_Extensions)
- [ICANN — DNSSEC and the root zone trust anchor](https://www.icann.org/dnssec)
- [IETF RFC 4033 — DNS Security Introduction and Requirements](https://www.rfc-editor.org/rfc/rfc4033)

## Specification

The full specification below is extracted from
[Chapter 9: "Advanced Network Defense: Wireless, DNS, and Zero Trust"](../../chapters/09-advanced-network-defense/index.md).

```text
Type: tree-diagram
**sim-id:** dnssec-chain-of-trust<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A vertical tree diagram showing the chain of signatures from the root zone to a leaf record:

1. **Root zone (`.`)** — labeled with "Root KSK (stored in trust anchor)". A green checkmark denotes the trust anchor that all DNSSEC validators ship with.
2. ↓ "signs" → **TLD zone (`.example`)** — labeled with "DS record in root zone points to TLD KSK"
3. ↓ "signs" → **`bank.example` zone** — labeled with "DS record in TLD points to bank's KSK"
4. ↓ "signs" → **`www.bank.example` A record** — labeled with "Returned to resolver: A record + RRSIG"

A side panel on the right shows what a resolver does on lookup:

- "Step 1: Receive A record + signature for `www.bank.example`"
- "Step 2: Fetch and verify ZSK signature using bank's KSK"
- "Step 3: Verify bank's KSK using DS record in `.example`"
- "Step 4: Verify `.example` keys using DS record in root"
- "Step 5: Compare root KSK to trust anchor — if match, ACCEPT"
- "Any failure → REJECT (resolver returns SERVFAIL)"

Color the trust path in cybersecurity blue (`#1565c0`); use a green checkmark on the root anchor; use red X annotations on what happens if any link fails.

Responsive: collapses to a vertical list with indented chain on viewport widths below 700px.

Implementation: Mermaid graph TD with custom node styling and side annotations.
```

## Related Resources

- [Chapter 9: "Advanced Network Defense: Wireless, DNS, and Zero Trust"](../../chapters/09-advanced-network-defense/index.md)
