---
title: Threat Actor Capability Matrix
description: Threat Actor Capability Matrix
status: scaffold
library: Static SVG with hover tooltips
bloom_level: TBD
---

# Threat Actor Capability Matrix



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 2: "Threats, Vulnerabilities, and Security Controls"](../../chapters/02-threats-and-controls/index.md).

```text
Type: infographic-svg
**sim-id:** threat-actor-matrix<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A 2D scatter plot:
- X-axis: Resources (low → high)
- Y-axis: Skill (low → high)

Five labeled circles positioned in the appropriate quadrants:
- **Script kiddies** (low skill, low resources, lower-left): blue #1565c0, small radius
- **Hacktivists** (mixed skill, low-moderate resources, middle-left): green, medium radius
- **Cybercriminals** (high skill, moderate-high resources, middle-right): orange #fb8c00, larger radius
- **Insiders** (variable skill, low resources but unique access, special placement on a separate annotation): slate steel #455a64, with a callout arrow indicating "bypasses perimeter by design"
- **Nation-state actors / APTs** (highest skill, highest resources, upper-right): red #c62828, largest radius

Each circle has a hover tooltip listing typical motivations, time horizons, and example incidents. A legend at the bottom maps circle size to "typical campaign duration" (kiddies = minutes, APTs = years).

Color background should be neutral white. Responsive design that reflows axes at narrow widths.

Implementation: Static SVG with `<title>` elements; could be enhanced later as a clickable infographic.
```

## Related Resources

- [Chapter 2: "Threats, Vulnerabilities, and Security Controls"](../../chapters/02-threats-and-controls/index.md)
