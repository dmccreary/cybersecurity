---
title: The Forensic Investigation Workflow
description: A Mermaid flowchart of the digital forensic investigation process from identification through court disclosure, with a parallel chain-of-custody log.
image: /sims/forensic-workflow/forensic-workflow.png
og:image: /sims/forensic-workflow/forensic-workflow.png
twitter:image: /sims/forensic-workflow/forensic-workflow.png
social:
   cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# The Forensic Investigation Workflow

![The Forensic Investigation Workflow](./forensic-workflow.png)

<iframe src="main.html" width="100%" height="1622" scrolling="no"></iframe>

[Run the Forensic Workflow MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/forensic-workflow/main.html" height="1622" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This flowchart lays out the **digital forensic investigation process** as a single
vertical pipeline, from the moment a device is identified through to its disclosure
in court. Read it top to bottom: identify and isolate the device, capture volatile
data (RAM and live connections that vanish at power-off), make a power decision,
take a write-blocked bit-for-bit forensic image, and verify its SHA-256 hash. Only
after the hash verifies does the investigator work on an *examination copy* — never
the source — then analyze, report, and disclose. Hovering any step reveals what it
involves and why it matters.

Two amber **decision diamonds** mark the branch points: the *Power Decision*
(live-image-then-power-off versus pull-the-plug) and the *Verify Hashes Match* gate,
which loops back to re-image on a mismatch. Running alongside the whole pipeline is
the **Chain of Custody Log** — the dashed arrows from several steps show that every
action writes to this continuous, tamper-evident record. That log is what makes the
evidence defensible: a gap in it can render otherwise-sound evidence inadmissible.

## Lesson Plan

**Learning objective (Bloom — Understand):** Students can sequence the steps of a
digital forensic investigation and explain why analysis is performed on a verified
copy and why every step writes to the chain-of-custody log.

**Suggested classroom use:** Trace the flow top-down, hovering each step. Stop at
the two decision diamonds and have students justify each branch. Then ask which
single step, if skipped, would most damage the case in court.

**Discussion questions:**

1. Why must volatile data be captured before the disk is imaged, and what is lost if
   the order is reversed?
2. The hash-verification diamond loops back to re-image on a mismatch. What kinds of
   problems would a mismatch reveal?
3. The chain-of-custody log runs parallel to every step rather than being a final
   document. Why is "continuous" the load-bearing word here?

## References

- [Digital forensics (Wikipedia)](https://en.wikipedia.org/wiki/Digital_forensics)
- [Chain of custody (Wikipedia)](https://en.wikipedia.org/wiki/Chain_of_custody)
- [NIST SP 800-86 — Guide to Integrating Forensic Techniques into Incident Response](https://csrc.nist.gov/pubs/sp/800/86/final)

## Specification

The full specification below is extracted from
[Chapter 14: "Societal Security: Law, Forensics, and Ethics"](../../chapters/14-societal-security/index.md).

```text
Type: workflow-diagram
**sim-id:** forensic-workflow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A vertical Mermaid flowchart with the following ordered nodes (each a rounded rectangle):

1. **Identify and Isolate** (slate steel #455a64) — "Photograph in place; document state; isolate from network"
2. **Capture Volatile Data** (cybersecurity blue #1565c0) — "RAM image, running processes, open connections"
3. **Power Decision** (decision diamond) — "Live image first, then power off, OR pull plug per policy"
4. **Forensic Imaging** (cybersecurity blue) — "Write-blocker; bit-for-bit copy; SHA-256 hash"
5. **Verify Hashes Match** (decision diamond) — Yes → continue; No → re-image
6. **Examination Copy** (slate steel) — "Work on a copy of the image, never the source"
7. **Analysis** (cybersecurity blue) — "Filesystem, registry, logs, memory, network artifacts"
8. **Reporting** (slate steel) — "Findings tied to evidence with hashes; reproducible"
9. **Court / Disclosure** (cream #fff8e1 with slate-steel border) — "Testimony; produce chain-of-custody log"

A parallel rail on the right shows **Chain of Custody Log** as a continuous record alongside steps 1–9, indicating that every step writes to the log.

Implementation: Mermaid `flowchart TD` with subgraphs and color classes matching the textbook palette.
```

## Related Resources

- [Chapter 14: "Societal Security: Law, Forensics, and Ethics"](../../chapters/14-societal-security/index.md)
