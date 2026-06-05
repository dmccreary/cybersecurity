---
title: Vendor Risk Tiers
description: Vendor Risk Tiers
status: scaffold
library: Static SVG with hover tooltips
bloom_level: TBD
---

# Vendor Risk Tiers



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

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
