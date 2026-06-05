---
title: Device Attestation Flow
description: A Mermaid sequence diagram of TPM-based remote device attestation among a verifier, a device, and the hardware root of trust.
image: /sims/device-attestation-flow/device-attestation-flow.png
og:image: /sims/device-attestation-flow/device-attestation-flow.png
twitter:image: /sims/device-attestation-flow/device-attestation-flow.png
social:
   cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# Device Attestation Flow

![Device Attestation Flow](./device-attestation-flow.png)

<iframe src="main.html" width="100%" height="662" scrolling="no"></iframe>

[Run the Device Attestation Flow MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/device-attestation-flow/main.html" height="662" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This sequence diagram walks through **TPM-based remote attestation** — how a
verifier (a corporate VPN server or cloud service) gets cryptographic evidence
that a device booted into a known-good state. Read it top to bottom: the verifier
sends a fresh **nonce**, the device asks its **TPM** to *quote* its Platform
Configuration Registers (PCRs) and sign them with an Attestation Identity Key
(AIK), and the device returns that signed quote along with its AIK and EK
certificate chain.

The amber note over the verifier holds the four checks that make or break trust:
the certificate must chain to a known manufacturer, the signature must be valid,
the nonce must match (defeating replay), and the PCRs must satisfy the verifier's
policy of acceptable boot states. Only then does the verifier issue an attestation
token. The highlighted note at the bottom names the operational footgun: trust
rests on *both* the manufacturer's EK certificate and a *current* PCR policy — a
stale policy will happily accept a boot state that should now be rejected. The
actor lanes collapse to a single column on narrow screens.

## Lesson Plan

**Learning objective (Bloom — Understand):** Students can trace the remote
attestation exchange and explain why trust depends on both the EK certificate and
a current PCR policy.

**Suggested classroom use:** Project the diagram and have students name, for each
message, what it proves and to whom. Pause on the verifier's four checks and ask
which one each common attack (replay, spoofed TPM, modified bootloader) would try
to defeat.

**Discussion questions:**

1. What specifically does the nonce N protect against, and what would go wrong
   without it?
2. The TPM signs with an AIK, not the EK directly. Why introduce a separate
   attestation key?
3. Who is responsible for keeping the "acceptable PCR values" policy current, and
   what is the blast radius if they fall behind after a firmware update?

## References

- [Trusted Platform Module (Wikipedia)](https://en.wikipedia.org/wiki/Trusted_Platform_Module)
- [Trusted Computing — remote attestation (Wikipedia)](https://en.wikipedia.org/wiki/Trusted_Computing#Remote_attestation)
- [IETF RFC 9334 — Remote ATtestation procedureS (RATS) Architecture](https://www.rfc-editor.org/rfc/rfc9334)

## Specification

The full specification below is extracted from
[Chapter 7: "Component and Hardware Security"](../../chapters/07-component-security/index.md).

```text
Type: workflow-diagram
**sim-id:** device-attestation-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A sequence diagram with three actors:

- **Verifier** (left) — e.g., corporate VPN server or cloud attestation service
- **Device** (middle) — e.g., laptop or VM
- **TPM / Hardware Root of Trust** (right) — on the device but conceptually distinct

Steps from top to bottom:

1. Verifier → Device: "Attestation request (nonce N)"
2. Device → TPM: "Quote PCRs with nonce N, sign with AIK"
3. TPM → Device: "Quote = sign_AIK(PCR0..23 || N)"
4. Device → Verifier: "Quote + AIK certificate + EK certificate chain"
5. Verifier checks: (a) certificate chains to known manufacturer, (b) signature is valid, (c) nonce matches, (d) PCRs match policy of acceptable boot states
6. Verifier → Device: "Attestation token (or denial)"

A side-note box at the bottom: "Trust depends on the manufacturer's EK certificate AND the verifier's policy of acceptable PCR values. Both must be current."

Color: cybersecurity blue for verifier and device, slate steel for the TPM/HW root, amber for the policy-check step (because policy currency is the operational footgun).

Responsive: actor lanes simplify to single column below 600px.

Implementation: Mermaid sequenceDiagram.
```

## Related Resources

- [Chapter 7: "Component and Hardware Security"](../../chapters/07-component-security/index.md)
