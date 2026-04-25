# Session Log: Chapter Structure Generation

**Date:** 2026-04-25
**Skill:** `book-chapter-generator`
**Inputs:** `docs/course-description.md`, `docs/learning-graph/learning-graph.json` (390 concepts, 476 edges), `docs/learning-graph/concept-taxonomy.md`

## Outcome

Generated a **16-chapter** structure covering all 390 concepts with **zero dependency violations**, then created `docs/chapters/` with 16 directories and updated `mkdocs.yml` navigation.

## Final Chapter Structure

| # | Title | Concepts | CSEC2017 Area |
|---|-------|---------:|---------------|
| 1 | Security Foundations: Properties, Mindset, and Risk | 30 | FOUND (part 1) |
| 2 | Threats, Vulnerabilities, and Security Controls | 26 | FOUND (part 2) |
| 3 | Cryptography Fundamentals: Symmetric Ciphers and Hashing | 34 | CRYPTO (part 1) |
| 4 | Cryptography in Practice: PKI, TLS, and Data Protection | 27 | CRYPTO (part 2) |
| 5 | Software Vulnerabilities and Secure Coding | 26 | SOFT (part 1) |
| 6 | Software Assurance and Supply Chain Security | 12 | SOFT (part 2) |
| 7 | Component and Hardware Security | 19 | COMP |
| 8 | Network Security Foundations: Protocols, Firewalls, and Detection | 25 | NET (part 1) |
| 9 | Advanced Network Defense: Wireless, DNS, and Zero Trust | 22 | NET (part 2) |
| 10 | System Security: OS, Memory, and Access Control | 20 | SYS (part 1) |
| 11 | Cloud Security and Operations Monitoring | 21 | SYS (part 2) |
| 12 | Human Security: Identity, Authentication, and Social Engineering | 28 | HUMAN |
| 13 | Organizational Security: Governance, Risk, and Compliance | 27 | ORG |
| 14 | Societal Security: Law, Forensics, and Ethics | 24 | SOC |
| 15 | Offensive and Defensive Security Operations | 30 | OPS |
| 16 | Emerging Topics and Capstone Pathways | 19 | EMERG + CAP |

**Total:** 390 concepts. **Average:** 24.4 concepts/chapter. **Range:** 12–34.

## The Core Tradeoff: Fewer, Larger Chapters vs. More, Smaller Chapters

The skill guideline recommends **8–25 concepts per chapter** as the acceptable range. Eight of the 16 chapters in the chosen design (Ch 1, 3, 4, 5, 12, 13, 15, plus Ch 16's near-edge size) **exceed** the 25-concept guideline. The user explicitly accepted this tradeoff with the instruction: *"I agree the chapters are large, but logically the concepts should stay together."*

This section makes the tradeoff explicit so future revisions can revisit it with full context.

### Why we chose fewer, larger chapters

1. **Topical coherence with CSEC2017 / ABET CAC.** The course is structured around the eight CSEC2017 knowledge areas explicitly cited in the ABET Computing Accreditation Commission Cybersecurity Program Criteria. Each chosen chapter maps to one knowledge area (or a clean two-part split of one). Splitting further would fragment material that the accreditation criteria treat as a single unit.
2. **Pedagogical narrative arc.** Concepts inside a chapter were authored with shared vocabulary and mutual reinforcement. Example: Chapter 3 (Symmetric Crypto + Hashing, 34 concepts) keeps AES, modes, IVs, hashes, and MACs together because students need all of them before any TLS or PKI discussion in Chapter 4 makes sense.
3. **Reduced cross-chapter prerequisite chains.** A flat 30-concept chapter introduces fewer "go back two chapters to remember X" jumps than the equivalent split into a 15-concept Part A and a 15-concept Part B that depends heavily on Part A. The dependency check confirmed zero violations across the chosen layout.
4. **Operationally simpler navigation.** 16 chapters fit cleanly in the MkDocs sidebar. Splitting to ≤25 concepts everywhere would have produced ~22 chapters; the sidebar starts to feel like a table of contents for a multi-volume work rather than a single textbook.
5. **The taxonomy is already well-balanced.** The 12-category taxonomy in `concept-taxonomy.md` shows the largest category (CRYPTO) at 15.6% of concepts. There are no pathological 30%+ categories that *force* a split.

### What we give up by choosing fewer, larger chapters

1. **Higher per-chapter cognitive load.** A 34-concept chapter is roughly 36% longer than the 25-concept guideline. Students reading linearly may need more sittings, more breaks, and more in-chapter scaffolding (subheadings, recap callouts) to keep orientation.
2. **Harder to assign as homework units.** A 34-concept chapter is too much for a single week of an undergraduate course; instructors will need to subdivide chapters into 2–3 weekly modules themselves. A more granular chapter structure would have done that work for them.
3. **Uneven pacing in the book.** Chapter 6 has 12 concepts and Chapter 3 has 34 — almost a 3× spread. Readers will feel chapters of "different weight," which can subtly imply Chapter 6 matters less. (It does not — supply-chain security is currently a top concern in industry.)
4. **Quizzes and assessments will be lopsided.** Downstream skills (`quiz-generator`, `chapter-content-generator`) generate per-chapter artifacts. Larger chapters will produce larger quizzes and longer chapter content, which the user will need to either accept or post-process.
5. **Chapter content generation is more expensive.** Token cost for chapter content scales roughly with concept count. The 34-concept chapter will generate ~3× the content tokens of the 12-concept chapter — a real budget consideration.

### Considered alternatives (and why we rejected each)

| Alternative | Rejected because |
|-------------|-----------------|
| **18-chapter design** with all chapters ≤26 (split CRYPTO into 3 parts; split FOUND into 3 parts) | Would split AES + modes + IV across two chapters, which destroys the natural "you cannot use AES safely without understanding modes" pedagogical unit. |
| **22-chapter design** strictly enforcing the 8–25 range everywhere | Sidebar bloat; created two 8-concept "trailing fragment" chapters that felt like appendices, not chapters. |
| **Per-CSEC2017-area chapters with no splits** (11 chapters total) | Chapter 5 (NET) would have been 47 concepts and Chapter 6 (SYS) 41 concepts — substantially worse than the worst chapter in the chosen design (34). |
| **Merge CAP (5 concepts) into the OPS chapter** | The capstones are *synthesis* across the entire course, not part of operations. Pairing them with EMERG (forward-looking topics) better fits the closing-chapter role. |

## Validation Performed

```
Total concepts:   390  ✓ all assigned exactly once
Total edges:      476  ✓ zero dependency violations
Foundational:       1  ✓ "Cybersecurity" is the only zero-prereq concept (correct edge direction)
Chapter sizes:     12–34  (8 chapters above 25, by design)
```

The mandatory edge-direction check from the skill (`prereqs[edge['from']].add(edge['to'])`) was applied. The single foundational concept ("Cybersecurity") confirms the dependency direction is correct — if the direction were inverted, advanced concepts like "Capstone Applied Research" would appear as foundational.

## Files Created

```
docs/chapters/index.md                              # Main overview
docs/chapters/01-security-foundations/index.md
docs/chapters/02-threats-and-controls/index.md
docs/chapters/03-crypto-fundamentals/index.md
docs/chapters/04-crypto-in-practice/index.md
docs/chapters/05-software-vulnerabilities/index.md
docs/chapters/06-software-assurance/index.md
docs/chapters/07-component-security/index.md
docs/chapters/08-network-foundations/index.md
docs/chapters/09-advanced-network-defense/index.md
docs/chapters/10-system-security/index.md
docs/chapters/11-cloud-and-ops-monitoring/index.md
docs/chapters/12-human-security/index.md
docs/chapters/13-organizational-security/index.md
docs/chapters/14-societal-security/index.md
docs/chapters/15-security-operations/index.md
docs/chapters/16-emerging-and-capstone/index.md
mkdocs.yml                                          # Navigation updated
```

Each chapter `index.md` contains: title, summary, full concept list, prerequisite chapter links, and a `TODO: Generate Chapter Content` marker for the next skill in the pipeline.

## Recommendations for Downstream Work

- When `chapter-content-generator` runs on Chapters 3, 5, 12, and 15 (the densest), allocate proportionally more tokens or split content generation into sub-passes by sub-topic.
- When `quiz-generator` runs, consider scaling questions per chapter by concept count rather than producing a fixed number per chapter, so the larger chapters get appropriate assessment coverage.
- If student feedback later indicates the larger chapters are too dense, the natural re-split points are: Ch 1 at id 22 (principles vs. risk), Ch 3 at id 82 (symmetric vs. hashing), Ch 5 at id 134 (memory bugs vs. injection), Ch 15 at id 359 (intel/hunting/vulnmgmt vs. PICERL/adversary techniques).
