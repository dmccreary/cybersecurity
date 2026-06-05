---
title: Vendor Risk Tiers
description: An interactive concentric-ring infographic that tiers a vendor portfolio around the organization, with hover tooltips for the due-diligence controls that fit each tier and a fourth-party (subprocessor) cluster showing inherited risk.
image: /sims/vendor-risk-tiers/vendor-risk-tiers.png
og:image: /sims/vendor-risk-tiers/vendor-risk-tiers.png
twitter:image: /sims/vendor-risk-tiers/vendor-risk-tiers.png
social:
   cards: false
status: review
library: Static SVG with hover tooltips
bloom_level: Understand
---

# Vendor Risk Tiers

![Vendor Risk Tiers](./vendor-risk-tiers.png)

<iframe src="main.html" width="100%" height="772" scrolling="no"></iframe>

[Run the Vendor Risk Tiers MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/vendor-risk-tiers/main.html" height="772" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This infographic answers a question every security program eventually faces:
**how much scrutiny does each vendor deserve?** Your organization sits at the
center; vendors orbit it in three concentric rings ordered by the damage their
failure or breach could do. **Tier-1 critical** vendors (cloud platform,
identity provider, payment processor) sit closest because a problem there can
halt the business or expose customer data. **Tier-2 important** vendors (HR SaaS,
monitoring, analytics) carry real but contained impact. **Tier-3 standard**
vendors (office supplies, marketing tools with no sensitive data) sit on the
outer ring with the lightest oversight.

Hover (or tap on touch devices) any ring, vendor chip, or the center to reveal a
tooltip with the **typical due-diligence controls** for that tier — from annual
SOC 2 reviews and joint incident-response runbooks at Tier-1, down to
self-attestation and lightweight onboarding at Tier-3. Outside the rings, a small
**fourth-party** cluster (a CDN, a key-management service, an SMS gateway) is
joined to the Tier-1 vendors by dotted lines: these are *subprocessors of your
vendors* — your data flows to them even though you never signed a contract with
them, so their risk is inherited and is usually disclosed in a vendor's data
processing agreement. The diagram is responsive: below about 640px wide the rings
flatten into a stacked list with the same tooltips.

## Lesson Plan

**Learning objective (Bloom — Understand / classify):** Students can classify a
vendor into the correct risk tier based on the impact of its failure, match the
depth of due-diligence controls to that tier, and explain why fourth-party
(subprocessor) risk is inherited.

**Suggested classroom use:** Project the diagram and give students a list of
real-sounding vendors (a backup provider, a graphic-design tool, an email
marketing service, a code-signing key vault). Have them place each in a ring and
defend the placement using the tooltip controls. Then reveal the fourth-party
cluster and ask which of *their* placements actually depends on an undisclosed
subprocessor.

**Discussion questions:**

1. Why does applying the same security questionnaire to every vendor produce a
   *worse* outcome than tiering — for both the low-risk and the high-risk vendors?
2. A vendor you rated Tier-3 quietly starts storing customer PII to add a new
   feature. What tier are they now, and what process should have caught the change?
3. Your payment processor uses a third-party fraud-scoring service you have never
   heard of. How is that service classified, and where would you expect to find
   it disclosed before you signed?

## References

- [Third-party risk management (Wikipedia)](https://en.wikipedia.org/wiki/Third-party_management)
- [SOC 2 — System and Organization Controls (Wikipedia)](https://en.wikipedia.org/wiki/System_and_Organization_Controls)
- [Supply chain attack (Wikipedia)](https://en.wikipedia.org/wiki/Supply_chain_attack)
- [NIST SP 800-161 — Cybersecurity Supply Chain Risk Management](https://csrc.nist.gov/pubs/sp/800/161/r1/final)

## Specification

The full specification below is extracted from
[Chapter 13: "Organizational Security: Governance, Risk, and Compliance"](../../chapters/13-organizational-security/index.md).

```text
Type: infographic-svg
**sim-id:** vendor-risk-tiers<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A concentric-ring diagram on a 900x600 canvas, with the organization at the center.

Center: "Our Organization" — cybersecurity blue circle.

Ring 1 (Tier-1 Critical Vendors) — closest ring, slate steel:
- Examples: cloud platform, identity provider, payment processor.
- Tooltip: "Annual SOC 2 review, executive escalation path, contractual SLAs, joint incident response runbook."

Ring 2 (Tier-2 Important Vendors) — middle ring, lighter slate:
- Examples: HR SaaS, monitoring tools, analytics platforms.
- Tooltip: "Annual security questionnaire, quarterly review of public incidents, contract review."

Ring 3 (Tier-3 Standard Vendors) — outer ring, cream:
- Examples: office supplies, marketing tools without sensitive data.
- Tooltip: "Self-attestation, lightweight onboarding."

Beyond Ring 3 — small "Fourth-party" cluster, drawn as small circles outside the rings, connected by dotted lines to the Tier-1 vendors:
- Tooltip: "Subprocessors of our vendors. Inherited risk; usually disclosed in DPAs."

Each ring has hover tooltips listing typical controls. Caption beneath: "Tier the vendor portfolio. The same questionnaire for every vendor is the wrong default."

Responsive: SVG scales with container; below 600px, rings flatten to a vertical stacked list with controls beside each tier. Window-resize listener re-renders.

Implementation: Inline SVG with `<title>` tooltips and a small resize handler.
```

## Related Resources

- [Chapter 13: "Organizational Security: Governance, Risk, and Compliance"](../../chapters/13-organizational-security/index.md)
