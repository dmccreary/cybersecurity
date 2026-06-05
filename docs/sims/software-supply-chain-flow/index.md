---
title: A Modern Software Supply Chain
description: Interactive Mermaid flow of the nine stages of a software supply chain, each marked with a real-world attack-injection incident, plus the defenses mapped to each stage.
image: /sims/software-supply-chain-flow/software-supply-chain-flow.png
og:image: /sims/software-supply-chain-flow/software-supply-chain-flow.png
twitter:image: /sims/software-supply-chain-flow/software-supply-chain-flow.png
social:
  cards: false
status: review
library: Mermaid
bloom_level: Analyze
---

# A Modern Software Supply Chain

![A Modern Software Supply Chain](./software-supply-chain-flow.png)

<iframe src="main.html" width="100%" height="702" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/software-supply-chain-flow/main.html" height="702" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This diagram follows a single piece of software through the **nine stages** of a
modern supply chain — from a developer's workstation, through the source
repository, dependency registries, the CI/CD build server, the artifact
repository, code signing, distribution, deploy/update, and finally execution on
the end user's machine. The blue boxes are the stages a release actually passes
through. Attached to each stage is an **amber attack-injection point** (marked
with a ⚡), each labeled with a real incident: typosquatting and the 2018
**event-stream** hijack at the dependency registry, **SolarWinds (2020)** at the
build server, and **NotPetya (2017)** at the deploy/update stage.

The teaching point is that the chain is only as strong as its weakest stage: a
build server compromise (SolarWinds) produced a *correctly signed* malicious
update, so signature checks alone did not help. That is why the right-hand panel
maps the four major defenses to the stages they cover — **SBOM** (stages 3, 5,
9), **code signing** applied at stage 6 but only useful if *verified* at stage 9,
**reproducible builds** (stage 4), and **provenance attestations** such as SLSA
(stages 4–8). Hover over (or tap) any stage, any ⚡ attack point, or any defense
row to read a one-line explanation in the panel, then reason about which control
would have caught that specific incident.

## Lesson Plan

**Learning objective (Bloom: Analyze).** Given a real-world supply-chain
incident, students will identify which stage of the chain was compromised and
determine which defense or defenses would have detected or prevented it.

**Suggested classroom use.** Present three incidents — event-stream, SolarWinds,
and NotPetya — without their labels. For each, have students locate the
compromised stage on the diagram, then argue which of the four defenses applies
and whether it would *prevent* the attack or merely *detect* it after the fact.
Use SolarWinds specifically to break the intuition that "it's signed, so it's
safe."

**Discussion questions:**

1. SolarWinds shipped a signed update that was malicious. Which stage was
   compromised, and which defense (and why not code signing alone) would have
   caught it?
2. SBOM covers stages 3, 5, and 9 but not the build step itself. What class of
   attack does that gap leave open, and which other defense closes it?
3. Why is *verifying* a signature at stage 9 a different control from *applying*
   one at stage 6 — and what goes wrong if a consumer skips the verification?

## References

- [Supply chain attack — Wikipedia](https://en.wikipedia.org/wiki/Supply_chain_attack)
- [SolarWinds (2020 cyberattack) — Wikipedia](https://en.wikipedia.org/wiki/2020_United_States_federal_government_data_breach)
- [Software Bill of Materials (SBOM) — Wikipedia](https://en.wikipedia.org/wiki/Software_supply_chain)
- [SLSA — Supply-chain Levels for Software Artifacts](https://slsa.dev/)

## Specification

The full specification below is extracted from
[Chapter 6: "Software Assurance and Supply Chain Security"](../../chapters/06-software-assurance/index.md).

```text
Type: workflow-diagram
sim-id: software-supply-chain-flow
Library: Mermaid
Status: Specified

A horizontal flow from left to right with nine nodes; attack-injection points marked with a red lightning bolt icon and labeled with a known incident.

1. Developer Workstation — local source code (lightning bolt: "compromised IDE plugin")
2. -> Source Repository (Git) — version control (lightning bolt: "stolen credentials, malicious PR")
3. -> Dependency Registry (npm, PyPI, Maven) — third-party libraries pulled in (lightning bolt: "typosquatting; event-stream 2018")
4. -> Build Server (CI/CD) — turns source + deps into artifact (lightning bolt: "SolarWinds 2020")
5. -> Artifact Repository — stores binaries / container images (lightning bolt: "registry account takeover")
6. -> Code Signing — signature applied (lightning bolt: "stolen signing key")
7. -> Distribution — package registry, app store, CDN (lightning bolt: "in-transit replacement")
8. -> Deploy / Update — running on user infrastructure (lightning bolt: "malicious update; NotPetya 2017")
9. -> End User — finally executes the code

Each node uses cybersecurity blue #1565c0. The lightning-bolt annotations use amber #ffa000. Hovering an annotation shows a 1-line incident summary.

Below the chain, a horizontal banner labeled "Defenses" lists controls aligned to each stage: SBOM (covers stages 3, 5, 9), code signing (stage 6, verified at 9), reproducible builds (stage 4), provenance attestations (stages 4-8, e.g., SLSA framework).

Learning objective (Bloom — Analyze): given a real-world supply-chain incident, identify which stage of the chain was compromised and which defenses would have detected or prevented it.

Responsive: chain wraps to two rows below 900px; attack annotations remain attached.

Implementation: Mermaid graph LR with custom node styling; tooltips via Mermaid click callbacks or a thin overlay layer.
```

## Related Resources

- [Chapter 6: "Software Assurance and Supply Chain Security"](../../chapters/06-software-assurance/index.md)
