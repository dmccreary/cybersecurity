---
title: Hardware Trust Anchors on a Modern System
description: Hardware Trust Anchors on a Modern System
status: scaffold
library: Static SVG with hover tooltips
bloom_level: TBD
---

# Hardware Trust Anchors on a Modern System



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 7: "Component and Hardware Security"](../../chapters/07-component-security/index.md).

```text
Type: infographic-svg
**sim-id:** trust-anchors-overview<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A horizontal layered diagram showing a modern computing system with four trust anchors highlighted.

Layout (left to right, on a single board):

1. **Main CPU package** (large central box, slate-steel border)
   - Inside: a smaller box labeled **Application cores** (cybersecurity blue)
   - Inside: a smaller box labeled **TEE region** (amber outline) with caption "Intel SGX / TDX / AMD SEV / ARM TrustZone — runs developer code in isolation"
   - On the same package: a small box labeled **Secure Enclave / Security coprocessor** (cybersecurity blue) with caption "Apple SEP, Google Titan M, Samsung Knox — runs only signed firmware"

2. **Discrete TPM chip** (smaller box on the board, slate-steel) connected by a thin line labeled "LPC / SPI bus" to the main CPU. Caption: "Stores measurements and sealed keys. Standardized command set."

3. **External HSM** (separate box outside the main board, drawn as a 1U appliance) connected via a network or PCIe icon. Caption: "Enterprise key custody. FIPS 140-3 Level 3+. Tamper-responsive."

Above the main CPU package, a "Hardware Root of Trust" badge points down into the secure enclave / TEE region with an arrow labeled "Anchored in silicon, set at fabrication."

Color: cybersecurity blue (#1565c0) for trusted regions, amber (#ffa000) outline on TEE to indicate "depends on microcode/firmware," slate steel (#455a64) for buses and packaging.

Hover tooltips on each anchor display its main capabilities and threat model from the table above.

Responsive: 4-column desktop layout collapses to vertical stack below 800px viewport.

Implementation: Static SVG with `<title>` tooltips per element.
```

## Related Resources

- [Chapter 7: "Component and Hardware Security"](../../chapters/07-component-security/index.md)
