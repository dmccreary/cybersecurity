---
title: "About This Book"
description: "About Cybersecurity: Foundations, Practice, and Professional Responsibility — its purpose, audience, design, and the team behind it."
---

# About This Book

## Welcome from Sentinel the Fox

![](./img/mascot/welcome.png){ align="left" width="140px"}

Welcome. I'm Sentinel — your guide through this book. Cybersecurity is a discipline of *defensible engineering*, not folklore: every control has assumptions, every protocol has trust boundaries, and every system has a blast radius worth understanding before an adversary finds it for you. We'll work through the foundations together, one careful pass at a time. *Trust, but verify.*

<div style="clear: both;"></div>

## Why This Intelligent Textbook

Cybersecurity is no longer an optional concern reserved for specialists — it now sits underneath every hospital record, payment rail, voting system, and connected device that students will design, operate, or depend on for the rest of their careers. Yet most undergraduate curricula still teach the field as a list of attacks and acronyms to memorize, rather than as a computing discipline grounded in adversarial thinking, systems thinking, and risk reasoning. Graduates arrive in industry able to recite the OWASP Top Ten but unable to threat-model a service they did not write themselves.

**In the United States (2024–2025):**

- The U.S. Bureau of Labor Statistics projects **33% growth** in information security analyst employment from 2023 to 2033 — among the fastest of any occupation tracked, and roughly eight times the all-occupations average[^1]
- CyberSeek reports that U.S. employers posted **roughly 469,000 open cybersecurity jobs** in the most recent twelve-month period, with only enough qualified workers available to fill about 85% of demand[^2]
- The ABET Computing Accreditation Commission's **Cybersecurity Program Criteria** explicitly require coverage of all eight CSEC2017 knowledge areas plus the cross-cutting concepts of adversarial thinking, systems thinking, and risk — a depth that most general computer science curricula do not provide[^3]
- IBM's *Cost of a Data Breach Report 2024* finds the average U.S. breach now costs **$9.36 million**, with breaches involving shadow data and misconfigured cloud resources costing significantly more[^4]

**Worldwide:**

- ISC2's *2024 Cybersecurity Workforce Study* estimates a **global workforce gap of 4.8 million** unfilled cybersecurity positions — a 19% year-over-year increase as demand outpaces the supply of qualified practitioners[^5]
- Cybersecurity Ventures projects that **global cybercrime damages will reach $10.5 trillion annually by 2025**, larger than the GDP of every nation except the United States and China[^6]
- The Verizon *2024 Data Breach Investigations Report* analyzed **30,458 security incidents** across 94 countries and found that the human element — phishing, misuse of credentials, errors — was a factor in **68% of confirmed breaches**, underscoring that technical controls alone are not enough[^7]

These numbers are not abstractions. They represent the systems your students will build, the patients whose records they will protect, the elections whose integrity they will defend, and the AI models they will deploy into adversarial environments. They need more than vocabulary — they need the analytical habits to reason about threats they have not yet seen.

This book takes a fundamentally different approach. It is built on a **learning graph of 390 interconnected concepts** organized into **12 taxonomy categories** that mirror the eight CSEC2017 knowledge areas plus foundations, operations, emerging topics, and the capstone. Concepts are introduced in the order their prerequisites are established, so understanding builds naturally from chapter to chapter — students never encounter "RSA decryption" before they have met modular arithmetic, and never see "TLS handshake" before they understand both symmetric and asymmetric primitives. Throughout the book you will find **interactive MicroSims** — browser-based simulations that let students manipulate cryptographic operations, explore network protocols, and discover principles through experimentation rather than memorization. The entire textbook is **open source and free** — no paywalls, no access codes, no expensive annual editions, and licensed for non-commercial reuse and adaptation by any instructor who wants to fork it for their own program.

## How to Use This Book

This textbook is designed for self-paced study and for use as the primary or supplementary text in an undergraduate cybersecurity course. Each chapter builds on previous material, so reading in order is recommended. The book includes:

- **16 Chapters** covering security foundations, threats and controls, cryptography (fundamentals and practice), software vulnerabilities and assurance, component security, network defense, system and cloud security, human factors, organizational governance, societal and legal context, security operations, and emerging topics with a capstone
- **Interactive MicroSims** embedded in chapters — browser-based simulations you can manipulate to explore concepts hands-on
- **Annotated References** linking to Wikipedia and authoritative sources (NIST, ABET, IETF, OWASP, MITRE)
- **Glossary** with ISO 11179-compliant definitions for every key concept
- **Learning Graph** visualizing 390 concept dependencies across the 12 taxonomy categories
- **Sentinel the Fox**, the book's pedagogical mascot, who appears at chapter openings, key insights, common footguns, difficulty spikes, and chapter celebrations
- **Search** available from any page using the search bar

The [Learning Graph](learning-graph/index.md) visualizes how concepts connect across chapters. If you want to explore non-linearly or check prerequisites for a specific topic, start there.

## About the Author

![](./img/dan-headshot-small.png){ width="150px" align="right"}

Dan McCreary is a semi-retired AI researcher, solution architect, and educator who has spent more than three decades helping Fortune 100 organizations reason over massive datasets. At Optum he founded the Generative AI Center of Excellence and led the team that built one of the world's largest healthcare knowledge graphs — spanning over 25 billion vertices — to unify member, provider, and patient insights. Dan's deep background in knowledge representation and systems thinking underpins the precise learning graphs and intelligent textbook workflows used throughout this course.

He is the co-author of *Making Sense of NoSQL* (Manning Publications), the founding chair of the NoSQL Now! conference, and a frequent keynote speaker on semantic search, ontology strategy, and AI hardware. Beyond industry, Dan has mentored students as a STEM volunteer since 2014 and now applies the same rigor to building open educational resources. You can visit the [Intelligent Textbooks Case Studies](https://dmccreary.github.io/intelligent-textbooks/case-studies/) to see over 70 textbooks that Dan has created or co-created with other authors.

**Selected Credentials**

- B.A. in Physics and Computer Science from Carleton College
- M.S.E.E. from the University of Minnesota
- MBA coursework at the University of St. Thomas
- Patent holder in semantic search and ontology management techniques
- Advocate for large-scale Enterprise Knowledge Graph adoption across healthcare and education
- Long-time promoter of accessible, low-cost AI-powered learning experiences

## How to Cite This Book

If you reference this textbook in academic work, curriculum proposals, lesson plans, or other publications, please use one of the following citation formats.

**APA (7th edition)**

McCreary, D. (2026). *Cybersecurity: Foundations, Practice, and Professional Responsibility*. https://dmccreary.github.io/cybersecurity/

**Chicago (17th edition)**

McCreary, Dan. 2026. *Cybersecurity: Foundations, Practice, and Professional Responsibility*. https://dmccreary.github.io/cybersecurity/.

**MLA (9th edition)**

McCreary, Dan. *Cybersecurity: Foundations, Practice, and Professional Responsibility*. 2026, dmccreary.github.io/cybersecurity/.

**BibTeX**

```bibtex
@book{mccreary2026cybersecurity,
  title     = {Cybersecurity: Foundations, Practice, and Professional Responsibility},
  author    = {McCreary, Dan},
  year      = {2026},
  url       = {https://dmccreary.github.io/cybersecurity/},
  note      = {Interactive intelligent textbook, ABET CAC-aligned}
}
```

To cite a specific chapter, append the chapter number and title — for example:

McCreary, D. (2026). Chapter 1: Security Foundations. In *Cybersecurity: Foundations, Practice, and Professional Responsibility*. https://dmccreary.github.io/cybersecurity/chapters/01-security-foundations/

## License

This work is released under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0)](license.md). You are free to share and adapt the material for non-commercial purposes as long as you give appropriate credit and share your adaptations under the same license.

## References

[^1]: U.S. Bureau of Labor Statistics. (2024). *Occupational Outlook Handbook: Information Security Analysts*. https://www.bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm
[^2]: CyberSeek. (2024). *Cybersecurity Supply/Demand Heat Map*. NICE / Lightcast. https://www.cyberseek.org/heatmap.html
[^3]: ABET Computing Accreditation Commission. (2024). *Criteria for Accrediting Computing Programs, 2024–2025: Cybersecurity Program Criteria*. https://www.abet.org/accreditation/accreditation-criteria/criteria-for-accrediting-computing-programs-2024-2025/
[^4]: IBM Security. (2024). *Cost of a Data Breach Report 2024*. https://www.ibm.com/reports/data-breach
[^5]: ISC2. (2024). *2024 Cybersecurity Workforce Study: Bridging the Gap*. https://www.isc2.org/research
[^6]: Cybersecurity Ventures. (2023). *2023 Official Cybercrime Report*. https://cybersecurityventures.com/cybercrime-damages-10-5-trillion-by-2025/
[^7]: Verizon. (2024). *2024 Data Breach Investigations Report*. https://www.verizon.com/business/resources/reports/dbir/
