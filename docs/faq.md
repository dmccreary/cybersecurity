---
title: Frequently Asked Questions
description: Frequently asked questions about the Cybersecurity textbook, organized by category. Covers course logistics, foundational concepts, technical details, common pitfalls, professional best practices, and emerging topics.
---

# Cybersecurity FAQ

This FAQ collects the questions students, instructors, and self-learners most often ask about the *Cybersecurity: Foundations, Practice, and Professional Responsibility* textbook. Questions are grouped by category and answered with links to the relevant chapters and the [Glossary](glossary.md). When a topic deserves a longer treatment, the chapter is the source of truth — these answers are summaries that point you there.

## Getting Started Questions

### What is this course about?

This is an ABET CAC-aligned introduction to **cybersecurity as a computing discipline**. It treats security not as folklore or compliance theater, but as defensible engineering grounded in algorithms, systems, mathematics, and human factors. You will learn to reason about adversaries, apply cryptographic primitives correctly, build and evaluate security controls, and judge the ethical and legal consequences of technical choices. The course is structured around the eight CSEC2017 knowledge areas — Data, Software, Component, Connection, System, Human, Organizational, and Societal Security — that the ABET Cybersecurity Program Criteria reference. See the full [Course Description](course-description.md) for scope, outcomes, and ABET mapping.

### Who is this course for?

The primary audience is **college undergraduates** (sophomores through seniors) pursuing a B.S. in Cybersecurity, Computer Science, Information Systems, or a related computing discipline. It is also suitable for adult continuing education and IT practitioners moving into security roles. The course assumes you can already write code and reason about systems; it does *not* assume any prior security background. Expect a mix of conceptual, mathematical, and hands-on engineering work. See the [Course Description](course-description.md) for the full audience profile.

### What prerequisites do I need?

You should have completed: one semester of **introductory programming** (Python, C, or equivalent), one semester of **data structures and algorithms**, **discrete math** (sets, logic, modular arithmetic, basic combinatorics and probability), and **computer organization / OS fundamentals** (processes, memory, file systems, system calls). An introduction to computer networks is recommended and may be taken concurrently. If you are missing one of these, you can usually catch up alongside the chapter that needs it; the [Course Description](course-description.md) lists exactly what is assumed.

### What will I be able to do after finishing this course?

You will be able to **threat-model a small system, apply cryptographic libraries correctly, harden a host and network, configure TLS and MFA, triage a vulnerability scan, write SIEM detections, and conduct a basic forensic acquisition**. Just as importantly, you will be able to *justify* your choices using risk reasoning that a non-technical decision-maker can act on. The full set of Remember-through-Create outcomes is in the [Course Description](course-description.md). The capstone in [Chapter 16](chapters/16-emerging-and-capstone/index.md) gives you a chance to put it all together.

### How is the textbook organized?

There are 16 chapters arranged so that every prerequisite is introduced before the concepts that build on it. Chapters 1–2 set the conceptual frame (security properties, threat modeling, controls). Chapters 3–4 cover cryptography. Chapters 5–7 cover software, software assurance, and hardware/components. Chapters 8–11 cover networks, systems, and cloud/ops. Chapters 12–14 cover the human, organizational, and societal layers. Chapters 15–16 cover offensive/defensive operations and emerging topics, including the capstone. See the [chapter index](chapters/index.md) for the full map.

### How is this course aligned with ABET?

The course is built to contribute directly to the **ABET Computing Accreditation Commission's Cybersecurity Program Criteria** and to all six ABET Student Outcomes for computing programs (problem analysis; design/implement/evaluate; communication; professional responsibility; teamwork; and applying security principles to maintain operations under risk). Specific ABET outcomes are flagged on individual learning objectives in the [Course Description](course-description.md) — for example, the threat-modeling and incident-diagnosis exercises support Outcome 1, and the team capstone supports Outcome 5.

### Do I need to be a strong programmer?

You need to be **comfortable enough to read code in at least one mainstream language** (Python or C is ideal) and to write small programs. You will not be asked to implement cryptographic primitives from scratch — in fact, the course actively discourages that, because rolling your own crypto is one of the field's classic footguns. You *will* be asked to call cryptographic libraries correctly, to read short snippets for vulnerabilities, and to apply secure-coding fixes. [Chapter 5](chapters/05-software-vulnerabilities/index.md) and [Chapter 6](chapters/06-software-assurance/index.md) are the most code-heavy.

### What knowledge areas does the course cover?

All **eight CSEC2017 knowledge areas** referenced by the ABET CAC criteria: **Data Security**, **Software Security**, **Component Security**, **Connection (Network) Security**, **System Security**, **Human Security**, **Organizational Security**, and **Societal Security**. The chapters map to these areas roughly in that order. The course also covers cross-cutting concepts (adversarial thinking, systems thinking, risk, defense in depth, least privilege) that the program criteria call out separately. See the [chapter index](chapters/index.md) for the full mapping.

### How much time should I plan per chapter?

Plan on **6–10 hours per chapter** for a serious first pass — about 2–3 hours of reading, 2–3 hours on the worked examples, and 2–4 hours on exercises. Cryptography ([Chapter 3](chapters/03-crypto-fundamentals/index.md) and [Chapter 4](chapters/04-crypto-in-practice/index.md)) and software vulnerabilities ([Chapter 5](chapters/05-software-vulnerabilities/index.md)) typically take longer on a first read. Sentinel will tell you when a section is genuinely hard — those are the places to slow down rather than push through.

### What are the capstone options?

The course offers three capstone tracks, all team-based: **Secure System Design and Defense** (design, implement, and defend a security-critical application against a peer red team); **Security Program Design** (build an end-to-end security program for a fictitious organization, including policy set, risk register, and tabletop exercise); and **Applied Research Report** (investigate an emerging topic such as post-quantum migration, AI supply-chain security, or OT/ICS resilience, and publish a reproducible report). All three are introduced in [Chapter 16](chapters/16-emerging-and-capstone/index.md) and detailed in the [Course Description](course-description.md).

### Are there hands-on labs?

Yes. Roughly half of the chapter exercises are hands-on: configuring TLS, writing SIEM detections, performing a forensic acquisition, exploiting and patching a deliberately vulnerable web application, building a basic CI/CD security pipeline, and so on. The course expects you to use real tools (a Linux VM, OpenSSL, a fuzzer, a SIEM trial, container runtimes) rather than only reading about them. Lab setup hints are listed in each chapter; the most lab-heavy chapters are [Chapter 6](chapters/06-software-assurance/index.md), [Chapter 11](chapters/11-cloud-and-ops-monitoring/index.md), and [Chapter 15](chapters/15-security-operations/index.md).

### Where do I find definitions of unfamiliar terms?

Every term that appears in **Title Case** in a chapter is defined in the [Glossary](glossary.md), which contains 390 entries. Each entry gives a short definition, "see also" cross-references, and a worked example. If a chapter uses a term you don't recognize, the glossary is the fastest way to ground it before continuing.

## Core Concepts

### What is the CIA triad?

The CIA triad is the foundational model for what security tries to preserve: **Confidentiality** (only authorized parties can read information), **Integrity** (information is not modified by unauthorized parties or processes), and **Availability** (authorized parties can access information when they need it). Most other security properties — including the extended **AAA** properties (authentication, authorization, accounting, non-repudiation) — can be expressed as combinations or refinements of CIA. [Chapter 1](chapters/01-security-foundations/index.md) develops the triad as the lens through which the rest of the course is framed.

### What is adversarial thinking, and why does it matter?

Adversarial thinking is the disciplined practice of analyzing systems from an attacker's perspective — asking "how would a motivated adversary misuse this feature?" rather than only "how should this feature work?" It complements traditional engineering: a developer who has only ever asked the latter question writes a working password reset flow; a developer who asks the former designs one that cannot be triggered for arbitrary accounts. The course treats adversarial thinking as a *cross-cutting habit* rather than a topic, so you will see it applied in every chapter beginning with [Chapter 1](chapters/01-security-foundations/index.md).

### What is defense in depth?

Defense in depth is the principle of layering **multiple independent controls** so that no single failure compromises the system. If one control fails open or is bypassed, others still stand. For example, a web application protected by a WAF, parameterized queries, least-privilege database accounts, output encoding, and runtime database query monitoring is much harder to fully exploit than one relying on any single control. The principle is introduced in [Chapter 1](chapters/01-security-foundations/index.md) and reappears in nearly every later chapter.

### What is least privilege?

Least privilege is the principle that every user, process, and service should have the **minimum permissions necessary** to perform its function — and no more. Violating it is the single most common contributor to incident blast radius: a compromised low-importance service that holds production database credentials gives the attacker the database. The principle drives access-control design in [Chapter 10](chapters/10-system-security/index.md), IAM design in [Chapter 12](chapters/12-human-security/index.md), and cloud IAM in [Chapter 11](chapters/11-cloud-and-ops-monitoring/index.md).

### What is a threat model?

A threat model is a **structured analysis of what could go wrong** with a system, usually expressed in terms of assets, trust boundaries, threats, and mitigations. Common methodologies include **STRIDE** (spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege), **attack trees**, and **PASTA**. A useful threat model is small enough to finish, specific enough to drive decisions, and revisited as the system changes. [Chapter 1](chapters/01-security-foundations/index.md) walks through STRIDE on a sample system end-to-end.

### What is the difference between a threat, a vulnerability, and a risk?

A **threat** is an actor or event with the potential to cause harm (a ransomware crew, a disgruntled insider, a power outage). A **vulnerability** is a weakness that a threat can exploit (an unpatched library, a missing access control). **Risk** combines the two with consequence: roughly *likelihood × impact*. Security work that confuses the three tends to chase headlines instead of reducing real risk. [Chapter 2](chapters/02-threats-and-controls/index.md) develops the vocabulary precisely.

### What is the AAA framework?

AAA stands for **Authentication** (proving who you are), **Authorization** (deciding what you may do), and **Accounting** (recording what you did). Many real protocols and identity systems implement these three layers as distinct concerns — for example, RADIUS provides AAA for enterprise Wi-Fi by checking credentials, granting access, and logging session details. The framework is introduced in [Chapter 1](chapters/01-security-foundations/index.md) and applied throughout [Chapter 12](chapters/12-human-security/index.md).

### What is an attack surface?

The attack surface is the **sum of points where an untrusted party can interact with a system** — open network ports, parsed file formats, deserialization endpoints, third-party libraries, browser extensions, and so on. A core habit of defensive engineering is to *measure and shrink* the attack surface rather than simply add controls. Reducing surface area is usually cheaper and more durable than adding a new control on top of an exposed one. [Chapter 2](chapters/02-threats-and-controls/index.md) develops the concept; [Chapter 5](chapters/05-software-vulnerabilities/index.md) shows how attack surface drives vulnerability classes.

### What is the blast radius of an incident?

Blast radius is the **scope of damage** that follows from a single compromise — how many systems, accounts, records, and trust boundaries the attacker reaches before being contained. The defender's question "did the breach happen?" is often less useful than "what is the blast radius?" because the latter drives both prevention (segmentation, least privilege) and response (containment strategy). The term is defined in [Chapter 2](chapters/02-threats-and-controls/index.md) and shapes the incident-response work in [Chapter 15](chapters/15-security-operations/index.md).

### How do symmetric and asymmetric cryptography differ?

**Symmetric cryptography** uses one shared secret key for both encryption and decryption — it is fast and good for bulk data, but the parties must agree on the key first. **Asymmetric (public-key) cryptography** uses a key pair: a public key anyone can hold and a private key only one party holds. This solves key distribution (you can publish your public key) but is hundreds of times slower than symmetric. Real protocols like TLS combine the two: asymmetric crypto bootstraps a session key, then symmetric crypto carries the bulk traffic. [Chapter 3](chapters/03-crypto-fundamentals/index.md) covers symmetric, and [Chapter 4](chapters/04-crypto-in-practice/index.md) shows the asymmetric+symmetric composition.

### Why is hashing not the same as encryption?

A **hash** is a one-way function: you cannot get the original data back from the digest. **Encryption** is reversible by design — given the right key, the ciphertext returns to plaintext. Hashes are used for integrity checks, password storage (with a KDF), digital signatures, and content-addressing, while encryption is used for confidentiality. Confusing them — for example, "encrypting" passwords instead of hashing them with bcrypt or Argon2 — is a recurring footgun, because encrypted passwords can be decrypted if the key leaks. [Chapter 3](chapters/03-crypto-fundamentals/index.md) covers hash properties and password hashing.

### What is a digital signature?

A digital signature uses a **private key** to produce a value that anyone holding the matching **public key** can verify. It provides three properties simultaneously: integrity (the message has not been altered), authentication (the holder of the private key signed it), and non-repudiation (the signer cannot plausibly deny it). Signatures are the building block of code signing, X.509 certificates, JWTs, and most authentication protocols. [Chapter 4](chapters/04-crypto-in-practice/index.md) develops signatures and their composition into PKI.

### What does TLS actually protect, and what does it not?

TLS protects **data in transit between two endpoints** that complete its handshake — confidentiality (encryption), integrity (MAC or AEAD), and authentication of at least the server (and optionally the client) via certificates. It does **not** protect data once it lands on either endpoint, validate that the server is the one *you* think it is beyond the certificate chain, or guarantee the application logic is sound. A correctly configured TLS connection to a vulnerable web app is still a vulnerable web app. [Chapter 4](chapters/04-crypto-in-practice/index.md) walks through the handshake and what each step is defending against.

### What is Zero Trust architecture?

Zero Trust is a security model that **assumes no implicit trust based on network location**. Instead, every request is authenticated, authorized, and continuously evaluated against policy, regardless of whether it originates inside or outside the corporate network. It replaces the failed perimeter assumption — "if you are inside, you are trusted" — with explicit verification at every hop. Practical Zero Trust uses strong identity, device posture, micro-segmentation, and policy engines. [Chapter 9](chapters/09-advanced-network-defense/index.md) develops Zero Trust and contrasts it with perimeter-based defense.

### What is the shared responsibility model in cloud security?

In cloud computing, **the cloud provider and the customer each own a portion of the security stack**, with the split depending on the service model. In **IaaS** the provider secures hardware, hypervisor, and physical network; the customer secures the OS, applications, data, and IAM. In **PaaS** the provider also takes the OS and runtime; the customer keeps the application and data. In **SaaS** almost everything is the provider's, but the customer still owns identity, data classification, and configuration. Many cloud breaches come from misunderstanding this line. [Chapter 11](chapters/11-cloud-and-ops-monitoring/index.md) develops the model with concrete examples.

### What is the difference between authentication and authorization?

**Authentication** answers *who are you?* and produces an identity (often via password, MFA, certificate, or token). **Authorization** answers *what may you do?* and produces a permit/deny decision based on policy. The two are distinct concerns and should be implemented in distinct layers — a system that conflates them often grants permission based on identity attributes that should not have been trusted in the first place. The full IAM stack — including identity, federation, and access management — is covered in [Chapter 12](chapters/12-human-security/index.md).

### What is the PICERL incident response lifecycle?

PICERL stands for **Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned** — the six phases of a mature incident response process. Preparation builds the team, runbooks, and tooling *before* the incident; the middle phases handle the live event; Lessons Learned closes the loop by feeding findings back into preparation. Skipping the first or last phase is the most common mistake. [Chapter 15](chapters/15-security-operations/index.md) walks through PICERL with worked examples.

### What does the NIST Cybersecurity Framework do?

The **NIST CSF** is a voluntary framework that organizes security work into six functions: **Govern, Identify, Protect, Detect, Respond, Recover**. It is not a prescriptive standard — it does not tell you to use AES-256 — it is a *common vocabulary* for describing what an organization does, what it should do, and the gap between the two. It is widely used to communicate security posture to non-technical executives and to map controls to other frameworks (ISO 27001, SOC 2). [Chapter 13](chapters/13-organizational-security/index.md) shows how to apply NIST CSF to assess and improve a security program.

### What is the difference between IDS and IPS?

An **IDS (Intrusion Detection System)** observes traffic or host activity and **alerts** when it sees something suspicious. An **IPS (Intrusion Prevention System)** is positioned in-line and can **block** traffic that matches a rule. The trade-off is the same one that recurs throughout defense: detect-only is safer (it cannot accidentally drop legitimate traffic) but slower to respond; prevent introduces an availability risk in exchange for speed. Most modern environments run both, often as a combined NIDS/IPS appliance. [Chapter 8](chapters/08-network-foundations/index.md) develops both, including signature- versus anomaly-based detection.

### What is a CVE, and what is CVSS?

A **CVE (Common Vulnerabilities and Exposures)** identifier is a globally unique name for a specific publicly known software flaw — for example, *CVE-2021-44228* is Log4Shell. **CVSS (Common Vulnerability Scoring System)** assigns that flaw a numeric severity score (0–10) based on attack vector, complexity, required privileges, and impact. CVSS is useful for triage but does not capture *your* environment's exposure: a 9.8 CVE on a system you do not run is not a 9.8 risk to you. [Chapter 2](chapters/02-threats-and-controls/index.md) covers CVE/CVSS, and [Chapter 15](chapters/15-security-operations/index.md) covers vulnerability management.

### What are the OWASP Top Ten and the CWE Top 25?

The **OWASP Top Ten** is the most widely cited list of high-impact web application security risks (broken access control, cryptographic failures, injection, insecure design, security misconfiguration, vulnerable components, identification and authentication failures, software and data integrity failures, security logging and monitoring failures, SSRF). The **CWE Top 25** is a complementary list of the most dangerous *software weakness types* (CWE entries). Both are starting points for code review and developer training, not exhaustive checklists. [Chapter 5](chapters/05-software-vulnerabilities/index.md) walks through both with examples.

### What is MITRE ATT&CK, and how is it used?

**MITRE ATT&CK** is a globally curated knowledge base of adversary **tactics, techniques, and procedures (TTPs)** observed in real intrusions, organized by phase (initial access, execution, persistence, privilege escalation, lateral movement, exfiltration, etc.). Defenders use it to write detections, evaluate coverage, plan red-team exercises, and communicate with peers in shared vocabulary. It is the dominant lingua franca for describing *how* attackers operate, distinct from CVE which describes *what* they exploit. [Chapter 15](chapters/15-security-operations/index.md) develops ATT&CK with detection-engineering examples.

### What is a kill chain?

The **kill chain** (originally Lockheed Martin's Cyber Kill Chain) describes the phases an attacker moves through to reach an objective: reconnaissance, weaponization, delivery, exploitation, installation, command-and-control, and actions on objectives. The defender's strategic insight is that **breaking any single link breaks the chain** — you do not need to detect at every phase. The Diamond Model is a related, complementary framework. Both are introduced in [Chapter 2](chapters/02-threats-and-controls/index.md) and used in detection engineering in [Chapter 15](chapters/15-security-operations/index.md).

### What does "fail secure by default" mean?

A system fails **secure** when an unexpected error or unavailable subsystem produces a *deny* (or otherwise safe) outcome rather than an *allow*. The opposite — failing **open** — is one of the most common silent footguns in security: an authentication service that returns "permitted" when it cannot reach its database has worse properties than one that simply errors out. This is one of Saltzer and Schroeder's classic principles, alongside least privilege, complete mediation, and economy of mechanism. [Chapter 1](chapters/01-security-foundations/index.md) covers the principles together.

## Technical Detail Questions

### What is the difference between AES-CBC and AES-GCM?

**AES-CBC** is a confidentiality-only mode that requires a separate MAC for integrity (and the composition order matters — encrypt-then-MAC is the safe one). **AES-GCM** is an **AEAD (Authenticated Encryption with Associated Data)** mode that provides confidentiality and integrity in a single primitive, with a tag verified before decryption. GCM also supports authenticated-but-unencrypted associated data for headers. In modern code, GCM (or ChaCha20-Poly1305) is the default; CBC is mostly seen in legacy systems. [Chapter 3](chapters/03-crypto-fundamentals/index.md) covers block-cipher modes and their pitfalls.

### What is an initialization vector, and why must it be unpredictable?

An **initialization vector (IV)** is a per-message value combined with the key to ensure that encrypting the same plaintext twice does not produce the same ciphertext. For modes like CBC, the IV must be **unpredictable** (typically random); for CTR/GCM, it must be **unique per key** (a nonce — reuse with the same key catastrophically breaks GCM). Hardcoding an IV, reusing one across messages, or using a counter-style IV with CBC are all common bugs that silently destroy the mode's security guarantees. [Chapter 3](chapters/03-crypto-fundamentals/index.md) develops IV/nonce requirements per mode.

### What is HMAC, and when do I need it?

**HMAC (Hash-based Message Authentication Code)** is a construction that combines a hash function (like SHA-256) and a secret key to produce a tag that anyone with the key can verify but no one without it can forge. Use HMAC when you need to verify that a message came from someone holding the shared key and was not modified in transit — for example, signing webhook payloads, validating session cookies, or building token formats. If you also need confidentiality, prefer AEAD (GCM, ChaCha20-Poly1305) over composing your own encrypt-and-MAC. [Chapter 3](chapters/03-crypto-fundamentals/index.md) covers MACs and HMAC.

### What is RSA, and when is it appropriate?

**RSA** is an asymmetric cryptosystem whose security rests on the difficulty of factoring large composite numbers. It supports both encryption and signatures and was the dominant public-key system for decades. In modern systems, RSA is still common in **certificates and signatures** (RSA-2048 or RSA-3072 minimum) but is rarely used for direct encryption because of padding pitfalls; instead, **hybrid encryption** uses RSA to wrap a symmetric key. New deployments increasingly prefer ECC for the same security at smaller key sizes. [Chapter 4](chapters/04-crypto-in-practice/index.md) develops RSA and PKI.

### Why is elliptic curve cryptography preferred over RSA today?

**ECC (Elliptic Curve Cryptography)** achieves comparable security to RSA at much smaller key sizes — a 256-bit ECC key is roughly equivalent to a 3072-bit RSA key — which means smaller signatures, faster operations, and lower bandwidth. Modern protocols (TLS 1.3, SSH, signal) default to elliptic-curve algorithms (ECDSA, EdDSA, X25519). RSA remains common in legacy ecosystems and certain compliance regimes, but new designs almost always choose ECC. [Chapter 4](chapters/04-crypto-in-practice/index.md) covers ECC alongside RSA.

### What is Diffie-Hellman key exchange?

Diffie-Hellman is a protocol that lets two parties **derive a shared secret over a public channel** without having previously exchanged any secret. Each side generates a private value and sends a public value derived from it; both can compute the same shared secret, but an eavesdropper cannot. Modern variants (ECDHE — Elliptic Curve Diffie-Hellman Ephemeral) use a fresh key pair per session, providing **perfect forward secrecy**. DH is the engine inside the TLS 1.3 handshake. [Chapter 4](chapters/04-crypto-in-practice/index.md) walks through DH and TLS.

### What is perfect forward secrecy?

**Perfect forward secrecy (PFS)** is a property of a key-exchange protocol in which **compromise of long-term keys does not compromise past session keys**. PFS is achieved by deriving each session's symmetric key from an *ephemeral* Diffie-Hellman exchange that is discarded after the session. Without PFS, an attacker who records ciphertext today and steals the server's private key tomorrow can decrypt all past traffic. TLS 1.3 mandates PFS. [Chapter 4](chapters/04-crypto-in-practice/index.md) covers PFS in the TLS handshake.

### What is X.509, and how do certificate chains work?

**X.509** is the standard format for digital certificates used in TLS, S/MIME, and code signing. A certificate binds a **public key** to an **identity** (typically a domain or organization) and is signed by a **Certificate Authority (CA)**. Browsers ship a list of trusted root CAs; a server certificate is trusted if a chain of signatures leads from it to one of those roots. Real chains usually include intermediate CAs to keep root keys offline. [Chapter 4](chapters/04-crypto-in-practice/index.md) develops X.509, chains, and PKI.

### What is OCSP, and what problem does it solve?

**OCSP (Online Certificate Status Protocol)** lets a client check whether a certificate has been **revoked** before its expiration date — for example, because the private key was leaked. The original OCSP design had privacy and performance problems (the client had to contact the CA on every connection). **OCSP stapling** fixes both by having the server fetch a fresh signed status response and present it during the TLS handshake. Modern TLS configurations should enable OCSP stapling. [Chapter 4](chapters/04-crypto-in-practice/index.md) covers revocation and stapling.

### What is the difference between SHA-2 and SHA-3?

**SHA-2** (SHA-256, SHA-384, SHA-512) is a family of Merkle–Damgård-style hash functions standardized by NIST in 2001 and still considered secure. **SHA-3** (Keccak) was selected through a NIST competition completed in 2012 using a fundamentally different sponge construction. SHA-3 was developed primarily as a **structurally different backup** in case a future attack broke SHA-2; in practice, SHA-2 remains dominant and either is appropriate for new designs. **MD5 and SHA-1 are broken** and should not be used for security purposes. [Chapter 3](chapters/03-crypto-fundamentals/index.md) covers hash families and their properties.

### What is bcrypt or Argon2, and when do I use them?

**bcrypt** and **Argon2** are **password-hashing functions** specifically designed to be slow and memory-hard, so that even an attacker with the hashed password database cannot brute-force the originals at scale. Use them — never a fast hash like SHA-256 — to store user passwords. Argon2 (specifically Argon2id) is the modern recommendation; bcrypt remains acceptable for existing systems. The cost parameter should be tuned to take ~100ms per hash on your target hardware. [Chapter 3](chapters/03-crypto-fundamentals/index.md) covers password hashing and salting.

### What is the difference between DAC, MAC, RBAC, and ABAC?

These are four **access-control models** with different trade-offs. **DAC (Discretionary)**: the owner of an object decides who else can access it (Unix file permissions). **MAC (Mandatory)**: the system enforces a central policy that owners cannot override (military classification, SELinux). **RBAC (Role-Based)**: permissions are attached to roles, users get roles (most enterprise apps). **ABAC (Attribute-Based)**: decisions are computed from attributes of subject, resource, action, and environment via policy (cloud IAM). Most real systems combine them — for example, RBAC for coarse-grained permissions and ABAC for context (time, location, risk score). [Chapter 10](chapters/10-system-security/index.md) develops all four.

### What is ASLR, and why does it matter?

**ASLR (Address Space Layout Randomization)** randomizes the memory addresses of executables, libraries, the stack, and the heap at process load time, so that an attacker exploiting a memory-safety bug cannot reliably know where to jump. It is a *probabilistic* defense — a 64-bit address space gives many bits of entropy, but information leaks can erode it. Combined with DEP/NX (no-execute memory) and stack canaries, it dramatically raises the cost of exploitation. [Chapter 10](chapters/10-system-security/index.md) covers ASLR alongside other memory defenses.

### What are stack canaries?

A **stack canary** is a small known value placed between local variables and the saved return address on the stack at function entry. The function checks the canary's value before returning; if a buffer overflow has overwritten it, the program aborts instead of jumping to attacker-controlled memory. Canaries do not prevent memory corruption — they make a common exploitation pattern detectable. They are one layer of defense in depth alongside ASLR, DEP, and modern compiler hardening flags. [Chapter 10](chapters/10-system-security/index.md) covers stack canaries with code examples.

### What is DEP / NX-bit?

**DEP (Data Execution Prevention)** — implemented by the CPU's **NX (No-eXecute) bit** — marks pages of memory as either executable or writable, but not both. An attacker who places shellcode on a writable page cannot execute it. DEP defeats the simplest "inject shellcode and jump to it" exploits and forces attackers toward more complex techniques like return-oriented programming (ROP). It is enabled by default on every modern OS. [Chapter 10](chapters/10-system-security/index.md) covers DEP, ROP, and the broader memory-defense landscape.

### What is OAuth 2.0 versus OIDC versus SAML?

**OAuth 2.0** is an **authorization** framework: it lets a user delegate limited access to their resources to a third-party app (the access token represents *what the app may do*, not who you are). **OIDC (OpenID Connect)** is an **authentication** layer built on top of OAuth 2.0 that adds an ID token containing identity claims — this is what "Sign in with Google" actually is. **SAML** is an older, XML-based federation protocol still common in enterprise SSO. Conflating OAuth 2.0 with authentication is one of the field's most common implementation mistakes. [Chapter 12](chapters/12-human-security/index.md) walks through all three.

### What is FIDO2, and what is a passkey?

**FIDO2** is a set of standards (WebAuthn + CTAP) for **phishing-resistant authentication** based on public-key cryptography. The user's device holds a private key bound to a specific origin; the server holds the matching public key. Because the private key never leaves the device and the protocol cryptographically binds the origin, FIDO2 stops credential phishing in a way that even MFA codes cannot. A **passkey** is the consumer-facing name for a FIDO2 credential, often synced through a platform (iCloud Keychain, Google Password Manager). [Chapter 12](chapters/12-human-security/index.md) covers FIDO2 and passkey deployment.

### What is DNSSEC, and what does it protect?

**DNSSEC (DNS Security Extensions)** adds **cryptographic signatures** to DNS records so that resolvers can verify a record came from the authoritative zone and was not modified. It defends against DNS spoofing and cache poisoning. DNSSEC does **not** encrypt DNS queries (that is DoH/DoT), and adoption is uneven across zones — many TLDs and recursive resolvers still do not validate signatures. [Chapter 9](chapters/09-advanced-network-defense/index.md) covers DNSSEC alongside BGP/RPKI and other infrastructure-protocol defenses.

### What is BGP, and what is RPKI?

**BGP (Border Gateway Protocol)** is the protocol that internet routers use to advertise which IP prefixes they can reach. It was designed without security: any AS can announce any prefix, leading to **route hijacks** that can intercept or black-hole traffic at internet scale. **RPKI (Resource Public Key Infrastructure)** lets the legitimate holder of an IP prefix cryptographically authorize specific ASes to announce it; routers can then drop unauthorized announcements. RPKI adoption has grown but is still partial. [Chapter 9](chapters/09-advanced-network-defense/index.md) develops BGP security and RPKI.

### What is a TPM, and what is an HSM?

A **TPM (Trusted Platform Module)** is a small cryptographic chip soldered into most modern PCs and servers. It stores keys, performs limited cryptographic operations, and supports **measured boot** — recording hashes of the boot chain so a remote party can attest the machine booted into a known state. An **HSM (Hardware Security Module)** is a dedicated, often network-attached cryptographic appliance designed for high-volume key operations and strict tamper resistance, used for CA private keys, payment processing, and key management at scale. TPMs protect a single host; HSMs protect organizational secrets. [Chapter 7](chapters/07-component-security/index.md) develops both.

## Common Challenges Questions

### Why is ECB mode a footgun?

**ECB (Electronic Codebook)** mode encrypts each block of plaintext independently with the same key, so identical plaintext blocks produce identical ciphertext blocks. The famous "encrypted penguin" image — still recognizable after ECB encryption because pixel patterns survive — illustrates the problem visually. ECB leaks structure, enables block substitution attacks, and breaks any expectation of semantic security. The fix is structural: never use ECB. Use an AEAD mode (AES-GCM, ChaCha20-Poly1305) instead, and prefer high-level libraries that make ECB hard to select by accident. [Chapter 3](chapters/03-crypto-fundamentals/index.md) covers ECB and the modes that replaced it.

### What's wrong with hardcoding keys in source code?

Hardcoded keys are a footgun because **source code leaks**: into git history, into CI logs, into container images pushed to public registries, into the laptop of every developer who clones the repo. Once a key is in source, you cannot revoke it without rotating, and you often do not know who has copies. The structural fix is to load secrets at runtime from a **secrets manager** (AWS Secrets Manager, HashiCorp Vault, environment-injected secrets) and to scan commits for secret patterns before they land. [Chapter 6](chapters/06-software-assurance/index.md) covers secret scanning in CI/CD.

### Why are mocked tests dangerous for security paths?

Mocking the components on a security path — the auth library, the policy engine, the database — produces tests that **always pass regardless of whether the real component works**. The classic incident: tests pass green, the migration ships, the real auth engine has a regression no test exercised. For security-critical paths, prefer integration tests that hit the real component, even if they are slower. Reserve mocks for truly external systems you cannot run locally. [Chapter 6](chapters/06-software-assurance/index.md) covers test strategy for security-critical code.

### What makes SQL injection so common, and how do I prevent it?

SQL injection is common because building queries by **string concatenation** is the path of least resistance in many languages, and it usually works — until input contains a quote. The structural fix is **parameterized queries** (prepared statements), which separate the SQL template from the data so the database engine can never reinterpret data as code. ORMs and query builders typically parameterize by default; raw `db.query("... " + user_input)` is the classic anti-pattern. Input validation and WAFs are useful in depth, but only parameterization makes the bad outcome impossible. [Chapter 5](chapters/05-software-vulnerabilities/index.md) covers injection in detail.

### What makes XSS hard to fully eradicate?

XSS is hard because the browser is asked to mix **content** (data) and **code** (HTML, JS, attributes) in dozens of contexts, each with different escaping rules. A value safe in HTML body text may be unsafe in an HTML attribute, a URL, a script string, or a CSS expression. Defense requires **context-aware output encoding** (the templating engine should do this for you), a strong **Content Security Policy** to limit damage when a single instance escapes, and treating any user input as untrusted at the rendering boundary. [Chapter 5](chapters/05-software-vulnerabilities/index.md) breaks XSS into stored, reflected, and DOM-based variants with defenses for each.

### How do I avoid race conditions (TOCTOU) in security checks?

A **TOCTOU (Time-of-Check to Time-of-Use)** bug occurs when the security check and the use of the resource are separate operations that an attacker can interleave — for example, checking a file's permissions, then opening it, with a symlink swap in between. The fix is to **make the check and the use atomic at the kernel level** — use `openat()` with appropriate flags, file descriptors instead of paths, transactional database operations, or compare-and-swap primitives. Validating then re-validating in user-space does not close the window. [Chapter 5](chapters/05-software-vulnerabilities/index.md) develops TOCTOU with examples.

### Why does input validation alone not stop injection?

Input validation catches **shape** problems — wrong type, wrong length, wrong characters — but injection is fundamentally a **layer-confusion** problem: data crosses a boundary into a system that interprets it as code (SQL, shell, HTML, LDAP). Strict allow-listing validation is valuable defense in depth, but the only structural fix is to prevent the data-as-code interpretation at the boundary itself: parameterized queries for SQL, `execve` with argv arrays for shell, context-aware encoding for HTML. Validation closes some doors; it does not lock the building. [Chapter 5](chapters/05-software-vulnerabilities/index.md) develops the distinction.

### What's the most common mistake in cryptographic code?

**Picking the wrong primitive** — using a hash where you needed a MAC, ECB where you needed AEAD, RSA-PKCS1-v1.5 where you needed RSA-OAEP, a fast hash for passwords. The second-most-common is **misusing IVs/nonces** (reusing a GCM nonce with the same key, hardcoding an IV). Both are silent: the code runs, the tests pass, the ciphertext looks fine, the system is broken. The structural defense is to use a **high-level library** (libsodium, age, Tink) that exposes safe primitives and makes unsafe ones hard to reach. [Chapter 3](chapters/03-crypto-fundamentals/index.md) catalogs cryptographic footguns.

### How do I handle key rotation without breaking production?

The keys most likely to leak are the ones that never rotate. The structural pattern is **versioned keys**: every encrypted blob carries a key identifier; the system can decrypt with any version it still holds and encrypts new data with the current version. Rotation then becomes "introduce a new version, switch encryption to it, re-encrypt at leisure, retire the old version." Hardcoding "the key" in the application — singular — makes rotation a flag day; making keys versioned from the start makes it a routine. [Chapter 4](chapters/04-crypto-in-practice/index.md) develops key management and rotation.

### Why do MFA SMS codes count as a weak factor?

SMS-based one-time codes are weak because **the SMS channel itself is trivially attackable** at multiple layers: SIM swaps (an attacker convinces the carrier to port the number), SS7 signaling-network interception, and credential phishing pages that simply relay the code in real time. SMS is still better than nothing — it raises cost over passwords alone — but for any account that matters, prefer **app-based TOTP**, **push approvals**, or, best, **FIDO2/passkeys**, which are phishing-resistant by design. [Chapter 12](chapters/12-human-security/index.md) develops the MFA hierarchy.

### Why do social engineering attacks succeed against trained employees?

Training does not eliminate social engineering because attackers exploit **systems that were never designed to resist it** — workflows that allow password resets via a phone call, vendors that send urgent payment-change emails, executives who travel and ask for unusual approvals over text. A motivated attacker who tailors a pretext to your workflow only needs to succeed once. The structural fix is to **redesign the workflow** so the answer to a social-engineering attempt is "I cannot do that without [phishing-resistant verification]," not "I should have known better." [Chapter 12](chapters/12-human-security/index.md) covers social engineering and usable security.

### How do I tell whether a control is preventive, detective, corrective, or compensating?

Ask **what the control does relative to an event**. **Preventive** controls stop the event from happening (firewall rule, parameterized query, MFA). **Detective** controls identify the event after it occurs (IDS, audit log review, anomaly detection). **Corrective** controls restore the system after detection (patch deployment, account disable, restore from backup). **Compensating** controls substitute for a primary control that cannot be implemented (extra logging because a system cannot run MFA). The same technology can play different roles depending on how it is deployed. [Chapter 2](chapters/02-threats-and-controls/index.md) develops the control taxonomy.

## Best Practice Questions

### What's the right way to encrypt application data at rest?

Use a **vetted high-level library** with an **AEAD primitive** (AES-GCM or ChaCha20-Poly1305) and a key managed by your platform's **secrets manager or KMS** (AWS KMS, GCP KMS, Vault). Never implement primitives yourself. Version your keys so rotation is routine, store the key ID alongside the ciphertext, and authenticate any associated metadata (table, row id) so blobs cannot be moved across rows. For full-database encryption, use the database's transparent data encryption (TDE) feature in addition to application-level encryption for sensitive fields. [Chapter 4](chapters/04-crypto-in-practice/index.md) covers data-at-rest patterns.

### How should I store user passwords?

**Hash them with bcrypt or Argon2id** — never with a fast hash, never with reversible encryption. Use a unique random salt per user (the library does this for you). Tune the cost parameter so a single hash takes around 100ms on your target hardware; that is fast enough for login and slow enough to make offline cracking expensive. Re-hash on login when you raise the cost factor. Store only the hash; never log the password, never email it. [Chapter 3](chapters/03-crypto-fundamentals/index.md) covers password hashing and the salting math.

### How do I configure TLS correctly on a web server?

Use **TLS 1.3** as the minimum version when your clients support it; allow TLS 1.2 only if you must, and disable everything older. Choose a modern cipher suite list (your platform's defaults are usually correct). Serve a valid certificate chain from a trusted CA. Enable **HSTS** with a long max-age and include subdomains once you are confident; preload only after that. Enable **OCSP stapling**. Use a tool like Mozilla SSL Configuration Generator or Qualys SSL Labs to verify. [Chapter 4](chapters/04-crypto-in-practice/index.md) develops TLS configuration end-to-end.

### How do I set up MFA the right way?

Default users to **phishing-resistant factors** — FIDO2/passkeys or platform authenticators — and offer **TOTP** (authenticator apps) as the secondary. Avoid SMS as a primary factor; allow it only as a recovery option, and only for low-risk accounts. Apply step-up authentication for sensitive actions (payment changes, role grants). Treat MFA enrollment and recovery flows with at least the same rigor as login — those are where attackers will pivot. [Chapter 12](chapters/12-human-security/index.md) covers MFA deployment, including the hard recovery problem.

### How do I write a useful runbook?

A runbook should let an on-call engineer **with no prior context** carry out a recovery procedure correctly under pressure. That means: explicit prerequisites, exact commands (not "run the migration"), expected output for each step, decision points with named branches, and a rollback path. Date it, version it, link the related dashboards, and include the contact for the owning team. Test it by handing it to someone who has never run it. Outdated runbooks are worse than missing ones because they breed false confidence. [Chapter 15](chapters/15-security-operations/index.md) covers runbook design alongside the broader incident response playbook.

### When should I accept, transfer, mitigate, or avoid a risk?

These are the four classic risk-treatment options. **Mitigate** when the cost of controls is less than the expected loss (most security work). **Transfer** when an external party can absorb the loss more efficiently — typically insurance or contractual indemnity (for cyber insurance, residual operational risk usually remains). **Accept** when the residual risk is genuinely below your tolerance and the mitigation cost exceeds the expected loss; document the decision with an owner and a review date. **Avoid** when the activity itself is not worth the risk — discontinue the feature, do not enter the market, do not collect the data. [Chapter 13](chapters/13-organizational-security/index.md) develops the risk-treatment framework.

### How do I write an effective threat model?

Start with a **scoped target** (one service, one data flow — not "the whole company"). Draw a data-flow diagram with explicit **trust boundaries**. Walk through STRIDE per element (or per trust-boundary crossing). For each identified threat, decide *mitigated, accepted, or further-investigation* with an owner. Time-box the exercise to a few hours; revisit it when the architecture changes. The two failure modes to avoid are *too big to finish* and *too abstract to drive decisions*. [Chapter 1](chapters/01-security-foundations/index.md) walks through STRIDE end-to-end on a worked example.

### How do I choose between RBAC and ABAC?

Choose **RBAC** when permissions cluster naturally around *job functions* — most internal enterprise applications, where users hold a small set of roles and roles map to coarse permissions. Choose **ABAC** when decisions depend on *context* — time of day, device posture, data sensitivity, user location — that cannot be captured cleanly as roles. In practice, modern systems often use **RBAC for the coarse decision and ABAC for the contextual filter** ("doctors can read patient records, but only during their shift on hospital networks"). Pure ABAC scales poorly without good policy tooling. [Chapter 10](chapters/10-system-security/index.md) develops both.

### What does a defensible incident response plan look like?

A defensible IR plan covers all six **PICERL** phases with named owners and tested runbooks, defines severity levels and the executive escalation criteria for each, lists legal and regulatory notification obligations with timelines, names the external resources (counsel, forensics retainer, cyber-insurance contact) you will call, and is rehearsed at least annually in a **tabletop exercise**. Plans that have not been tested have unknown failure modes. The plan should also define the *blameless postmortem* template you will use after the event. [Chapter 15](chapters/15-security-operations/index.md) develops the full IR plan.

### How do I measure security program effectiveness?

Use a small set of metrics tied to **outcomes you can defend**: mean time to detect and contain incidents, percentage of critical vulnerabilities remediated within SLA, MFA coverage on privileged accounts, percentage of systems on supported OS versions, phishing-simulation click-through trend, and tabletop-exercise findings closed. Avoid vanity metrics ("blocks per second on the firewall") that go up and to the right without telling you anything about risk. Map metrics to a framework (NIST CSF, ISO 27001) so you can communicate posture to executives. [Chapter 13](chapters/13-organizational-security/index.md) covers security metrics and program management.

### How should I handle a third-party security questionnaire?

Treat questionnaires as **one input among several** to vendor risk decisions, alongside SOC 2 Type II reports, penetration test summaries, and architectural review. Maintain a current set of standard answers (often called a "security trust portal") so questionnaires do not consume engineering attention each time. For high-risk vendors — those handling regulated data or with privileged access — ask for evidence beyond the questionnaire: report excerpts, sample logs, named control owners. The questionnaire is a starting point, not a control. [Chapter 13](chapters/13-organizational-security/index.md) covers vendor and third-party risk.

### What does responsible disclosure look like in practice?

Responsible disclosure means giving the vendor a fair window to fix a vulnerability before publishing details, with explicit timelines, a coordinated public advisory, and credit to the researcher. Concretely: contact via the vendor's security.txt or PSIRT channel; agree on a disclosure date (90 days is common, sometimes longer for hardware or supply-chain issues); coordinate the CVE assignment; publish jointly. From the vendor side, run a **bug bounty or vulnerability disclosure program** with safe-harbor language so researchers know they will not be sued for reporting. [Chapter 14](chapters/14-societal-security/index.md) covers disclosure ethics and law.

## Advanced Topic Questions

### What is post-quantum cryptography, and when should organizations migrate?

**Post-quantum cryptography (PQC)** is the family of public-key algorithms believed to remain secure against attacks by large, fault-tolerant quantum computers — primarily **lattice-based** schemes (ML-KEM/Kyber for key exchange, ML-DSA/Dilithium for signatures) standardized by NIST in 2024. Symmetric crypto (AES-256, SHA-256) is largely unaffected. The urgent driver is **harvest-now-decrypt-later**: data captured today and decrypted in a decade is already exposed. Organizations should inventory cryptographic dependencies now, plan **hybrid** classical+PQC deployments next, and prioritize long-lived secrets (medical records, government data, root CA keys). [Chapter 16](chapters/16-emerging-and-capstone/index.md) covers the migration in depth.

### What is confidential computing?

**Confidential computing** uses hardware-based **trusted execution environments (TEEs)** — Intel SGX/TDX, AMD SEV-SNP, AWS Nitro Enclaves, Apple Private Cloud Compute — to keep data encrypted **in use**, not just at rest and in transit. Code runs inside an enclave whose memory the host OS, hypervisor, and cloud operator cannot read; remote attestation lets a counterparty verify what code is running before sending it secrets. The technology enables genuinely private cloud workloads but introduces new threat models (side channels, supply-chain trust in the silicon vendor). [Chapter 16](chapters/16-emerging-and-capstone/index.md) develops the architecture.

### How do I defend an LLM application against prompt injection?

Prompt injection is the LLM analog of SQL injection: untrusted text is interpolated into a prompt that the model executes as instructions. There is no fully reliable input-sanitization defense — the structural fix is to **never let the model take security-relevant actions on untrusted instructions**. Concretely: separate the user-facing model from the action-taking system, require explicit human confirmation for sensitive operations, restrict tool access by what data it touches, validate model outputs against a schema, and treat anything from a tool call as untrusted input on the way back. [Chapter 16](chapters/16-emerging-and-capstone/index.md) covers prompt injection and the broader AI-security landscape.

### What is adversarial machine learning?

Adversarial ML is the field that studies **attacks against the statistical structure of ML models**: **evasion** (crafting inputs that the model classifies wrongly), **poisoning** (corrupting training data to degrade or backdoor the model), **model extraction** (stealing model weights through queries), and **membership inference** (determining whether specific data was in the training set). Many attacks transfer across models trained on similar data, which complicates defense. The field is actively evolving and lacks the mature defensive recipes that traditional software security has. [Chapter 16](chapters/16-emerging-and-capstone/index.md) covers the attack categories and current defensive directions.

### What is differential privacy?

**Differential privacy** is a mathematical guarantee that the output of a computation reveals **almost the same information** whether or not any one individual's data was included in the input. It is achieved by injecting carefully calibrated noise (typically Laplacian or Gaussian) into queries or model gradients. Differential privacy is the strongest formal privacy guarantee available — used by Apple for telemetry, by the U.S. Census Bureau, and in some federated-learning systems. The trade-off is a **privacy budget** (epsilon) that, once spent, can no longer protect new releases of the same dataset. [Chapter 4](chapters/04-crypto-in-practice/index.md) covers privacy-preserving computation.

### What is a zero-knowledge proof?

A **zero-knowledge proof (ZKP)** lets a prover convince a verifier that a statement is true **without revealing anything beyond the statement's truth** — for example, proving you know a password without sending it, or proving a transaction is valid without revealing its amount. Modern succinct constructions (zk-SNARKs, zk-STARKs) make verification fast even for complex statements and underpin privacy-preserving blockchains, anonymous credentials, and confidential supply-chain attestations. The math is dense but the operational pattern is simple: *prover commits, verifier challenges, prover responds*. [Chapter 4](chapters/04-crypto-in-practice/index.md) covers ZKPs at the conceptual level.

### How does OT/ICS security differ from IT security?

**Operational technology (OT) and industrial control systems (ICS)** — the systems that run power grids, water treatment, manufacturing lines, and pipelines — invert IT's usual priorities. Where IT optimizes for **confidentiality first, then integrity, then availability**, OT often inverts to **availability first, then integrity, then confidentiality**. Patching is dangerous because downtime can be physically destructive; devices have decades-long lifespans; protocols are often unauthenticated by design; and a successful attack can have **physical** consequences (Stuxnet, Colonial Pipeline). Defensive controls emphasize segmentation, monitoring, and engineering-grade change control. [Chapter 16](chapters/16-emerging-and-capstone/index.md) develops OT/ICS security.

### How do I design a Zero Trust architecture for a multi-cloud environment?

Start with **strong identity** as the new perimeter — federated identity provider, phishing-resistant MFA on every account, no long-lived credentials. Add **device posture** (attestation that the requesting device is managed and healthy). Build a **policy engine** that authorizes every request against identity, device, resource sensitivity, and risk signals. **Micro-segment** at the workload level — service-to-service mTLS, network policies, no flat networks. Centralize **logging** for cross-cloud detection. The architecture is incremental: most organizations get 80% of the value from identity + MFA + workload segmentation, before they call it "Zero Trust." [Chapter 9](chapters/09-advanced-network-defense/index.md) and [Chapter 11](chapters/11-cloud-and-ops-monitoring/index.md) together cover the design.

### How do I evaluate a vendor's SOC 2 Type II report?

A **SOC 2 Type II** report describes the vendor's controls for the Trust Services Criteria (Security and optionally Availability, Confidentiality, Processing Integrity, Privacy) and the auditor's tests of those controls **over a period** (typically 6–12 months). Read the **scope** (which systems are covered — the SaaS product, or the corporate network?), the **trust criteria** included, the **subservice organizations** (their cloud provider — coverage may be carved out or inclusive), and especially the **exceptions** in the auditor's testing. A clean SOC 2 with narrow scope is less assurance than an SOC 2 with one or two exceptions in broad scope. [Chapter 13](chapters/13-organizational-security/index.md) covers SOC 2 evaluation.

### How do I plan a red-team or purple-team engagement?

Define the **objective** in business terms ("can an external attacker reach customer data?"), not in technical terms ("can you get a shell on host X?"). Set **scope and rules of engagement** in writing — in-scope assets, prohibited techniques, blackout windows, emergency contacts, deconfliction procedure. Choose a **threat model to emulate** (a specific MITRE ATT&CK group whose TTPs match your concern). Decide whether the blue team is informed (purple) or not (true red team). Commit to a **debrief and remediation tracking** *before* you start — the engagement's value is in the changes it drives, not the report. [Chapter 15](chapters/15-security-operations/index.md) develops red/blue/purple operations.
