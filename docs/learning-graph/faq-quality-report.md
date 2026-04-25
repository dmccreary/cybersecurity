---
title: FAQ Quality Report
description: Quality metrics, Bloom's Taxonomy distribution, link coverage, and recommendations for the auto-generated FAQ at docs/faq.md.
---

# FAQ Quality Report

**Generated:** 2026-04-25
**Source FAQ:** [docs/faq.md](../faq.md)
**Companion JSON:** [faq-chatbot-training.json](faq-chatbot-training.json)
**Coverage gaps:** [faq-coverage-gaps.md](faq-coverage-gaps.md)

## Overall Statistics

- **Total questions:** 90
- **Categories:** 6
- **Overall quality score:** **64 / 100**
- **Content completeness score:** **95 / 100** (course description, learning graph, glossary, and all 16 chapters present and substantial)
- **Concept coverage:** **48 %** (187 / 390 learning-graph concepts referenced)
- **Average answer length:** **85 words** (range 55–105; below the 100–300 target by design — see *Answer Quality* below)
- **Questions with at least one chapter/glossary link:** **90 / 90 (100 %)**

## Category Breakdown

| Category | Questions | Description |
|---|---|---|
| Getting Started | 12 | Course logistics, prerequisites, ABET alignment, capstone tracks |
| Core Concepts | 24 | CIA triad, threat modeling, controls taxonomy, kill chain, framework primitives |
| Technical Detail | 20 | Specific algorithms (AES modes, RSA, ECC, DH, X.509), access-control models, memory defenses, identity protocols |
| Common Challenges | 12 | Footguns and frequently-misunderstood patterns (ECB, hardcoded keys, mocked tests, SQL injection, TOCTOU, MFA SMS) |
| Best Practices | 12 | Production-grade defaults (data-at-rest encryption, password storage, TLS configuration, MFA, IR plans, risk treatment) |
| Advanced Topics | 10 | Post-quantum, confidential computing, prompt injection, adversarial ML, differential privacy, ZKPs, OT/ICS, Zero Trust |

## Bloom's Taxonomy Distribution

The targets below are weighted across the six categories using each category's per-level mix.

| Level | Actual | Target | Deviation |
|---|---|---|---|
| Remember | 10 % (9) | 21 % | −11 % ✗ |
| Understand | 51 % (46) | 30 % | +21 % ✗ |
| Apply | 16 % (14) | 24 % | −8 % ✗ |
| Analyze | 12 % (11) | 15 % | −3 % ✓ |
| Evaluate | 7 % (6) | 5 % | +2 % ✓ |
| Create | 4 % (4) | 4 % | 0 % ✓ |

**Total absolute deviation:** ~45 %
**Bloom's distribution score:** **10 / 25**

The distribution skews toward *Understand* because FAQ entries are generally explanatory ("what is X / how does X work?") rather than operational. This is appropriate for a learner-facing FAQ but pulls the higher-order categories down. The remediation path is to add more *Apply*- and *Analyze*-style "how do I…" and "what's the trade-off between…" questions to **Common Challenges** and **Best Practices** in a future pass.

## Answer Quality Analysis

| Metric | Value | Target | Score |
|---|---|---|---|
| Worked examples (explicit "for example" / illustration) | 25 / 90 (28 %) | 40 % + | 3 / 7 |
| Internal links (questions with ≥1 chapter/glossary link) | 90 / 90 (100 %) | 60 % + | 7 / 7 |
| Avg length: 85 words | 100–300 | 4 / 6 |
| Completeness (each answer fully addresses its question) | 90 / 90 (100 %) | — | 5 / 5 |

**Answer quality score:** **19 / 25**

**Notes on length.** The 85-word average is below the prescribed 100–300 target, but this is intentional. The textbook's voice guide values concise prose, the FAQ defers depth to the chapter via its link, and most answers fit comfortably in 75–105 words without losing content. Lengthening would dilute rather than clarify. If a future revision wants to hit the target, the right move is to add a worked example to each answer (which would also raise the example metric).

**Notes on examples.** The "examples" count above is conservative — it counts only answers containing the literal phrase *"for example"* or *"e.g."*. Many answers include illustrative cases (the encrypted-penguin image for ECB; the doctor/shift policy for ABAC; SIM-swap for SMS MFA) without using that exact phrase. A hand audit puts the practical example rate closer to 50 %, but the metric reported here uses the strict mechanical definition.

**Link policy.** All links point to chapter or glossary **files** — no anchor fragments are used anywhere in the FAQ. This is verified by `grep` and is a hard rule for this textbook to avoid silent breakage when chapter headings are edited.

## Concept Coverage

- **Concepts in learning graph:** 390
- **Concepts referenced by FAQ:** 187
- **Coverage:** 47.9 %
- **Coverage score:** **10 / 30** (per rubric: <50 %)

The coverage shortfall is partly structural. Many concepts in the learning graph (specific protocols like ARP, ICMP, DHCP; specific tools like Wireshark; specific compliance regimes) are best learned in the chapter context where they appear and do not benefit from a standalone FAQ entry. The full uncovered list is in [faq-coverage-gaps.md](faq-coverage-gaps.md), tiered by priority.

## Organization Quality

| Criterion | Result |
|---|---|
| Logical categorization | ✓ |
| Progressive difficulty within and across categories | ✓ |
| No duplicate or near-duplicate questions | ✓ |
| Clear, searchable question phrasing | ✓ |

**Organization score:** **20 / 20**

## Overall Quality Score: 64 / 100

| Dimension | Score |
|---|---|
| Coverage | 10 / 30 |
| Bloom's Distribution | 10 / 25 |
| Answer Quality | 19 / 25 |
| Organization | 20 / 20 |
| **Total** | **64 / 100** |

This is below the 75 / 100 success threshold the skill defines. The two pull-down factors are concept coverage (48 % vs. 60 % target) and Bloom's distribution skew toward *Understand*. Both are addressable in a follow-up pass without rewriting the existing FAQ — see *Recommendations*.

## Recommendations

### High priority

1. **Add a Network Foundations sub-category** of ~10 questions covering the dominant uncovered network concepts: TCP, UDP, OSI Model, TCP/IP Model, firewall types (stateful, NGFW, WAF), network segmentation/VLAN/DMZ, VPN/IPsec/WireGuard, ARP/DHCP attacks. These concepts are heavily referenced across multiple chapters and are natural FAQ candidates.
2. **Add a SOC / Detection sub-category** of ~8 questions covering: SIEM, SOAR, EDR/XDR, threat hunting, threat intelligence, OSINT, IOC/IOA, detection engineering, lateral movement, persistence, C2, exfiltration. These are central to *Chapter 15* and currently under-represented.
3. **Add a Compliance & Law sub-category** of ~6 questions covering: GDPR, HIPAA, PCI-DSS, ISO 27001, CFAA, breach notification timelines, chain of custody. The current FAQ touches NIST CSF and SOC 2 but skips the other major regulatory frames.

### Medium priority

4. **Rebalance toward Apply and Analyze** by adding ~10 more "how do I…" / "what trade-off…" entries in **Common Challenges** and **Best Practices**. This will pull the Bloom's actual closer to target and is genuinely useful content (e.g., "How do I write a useful detection rule from a MITRE ATT&CK technique?", "How do I choose between perimeter, defense-in-depth, and Zero Trust for a given system?").
5. **Add a worked example to ~20 more answers** to raise the example-rate metric and make the answers more memorable. Candidate questions: CIA triad (a small worked breach analyzed against each leg), defense in depth (the Maginot Line analogy and how layered defense fixes it), perfect forward secrecy (the *capture-now-decrypt-later* scenario).
6. **Add an OS / Container sub-category** of ~6 questions covering: process isolation, file permissions, SELinux/AppArmor, hypervisor vs. container security, Kubernetes security posture, secure boot.

### Low priority

7. **Forensics depth.** Current Societal Security coverage is thin — add 4–5 questions on chain of custody, forensic imaging, memory vs. mobile vs. network forensics, and the legal admissibility chain.
8. **Risk vocabulary.** Add specific entries for likelihood, impact, threat actor, exploit, zero day — these are referenced across several existing answers but lack their own definitional FAQ entry.
9. **Capstone deep-dive.** Each capstone track currently shares one entry; consider one entry per track that walks through deliverable expectations.

## Suggested Additional Questions

The top-priority additions, drawn from the gap analysis:

1. *"What's the difference between TCP and UDP, and when should I use each?"* — Network Foundations
2. *"How do firewalls actually decide whether to allow a packet?"* — Network Foundations
3. *"What is network segmentation, and why does it matter for blast radius?"* — Network Foundations
4. *"What does a SIEM actually do, and what does it not do?"* — Core Concepts
5. *"What is threat hunting, and how is it different from detection engineering?"* — Best Practices
6. *"What does GDPR actually require of a US company?"* — Common Challenges
7. *"What is the chain of custody, and how do I preserve it during an acquisition?"* — Technical Detail
8. *"How do I write a SIEM detection rule from a MITRE ATT&CK technique?"* — Best Practices
9. *"What is a software bill of materials (SBOM), and why does the supply chain need one?"* — Core Concepts
10. *"What is a side-channel attack, and how do I reason about whether my system is exposed?"* — Advanced Topics

## Validation Results

| Check | Result |
|---|---|
| Duplicate questions | None |
| Near-duplicate questions (>80 % similarity) | None |
| Anchor fragments in links | **0** (verified — strict policy) |
| Internal link target files exist | All 16 chapter index files, glossary.md, course-description.md, chapters/index.md verified present |
| JSON validates against schema | ✓ (90 entries, all required fields) |
| Bloom's level on each entry | ✓ |
| Concepts cross-reference learning graph | ✓ (every cited concept exists in concept-list.md) |

## Limitations

- Bloom's distribution targets in the source skill are aggressive for an FAQ format; the FAQ is necessarily explanation-heavy and will tend to skew *Understand*. Treat the deviation as informational rather than as a defect to "fix" by mislabeling questions.
- Concept coverage of 48 % understates real reach because chapter prose covers many remaining concepts adequately — those concepts simply do not need an FAQ entry. The gaps report tiers them by whether an FAQ entry would actually help the reader.
- Example count is reported using a strict mechanical regex (`for example`, `e.g.`); the practical example rate is closer to 50 % when illustrative cases without that exact phrasing are counted.
