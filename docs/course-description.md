---
title: Course Description for Cybersecurity
description: A detailed course description for Cybersecurity aligned with ABET Computing Accreditation Commission (CAC) Program Criteria, including overview, topics covered, and learning objectives organized by the 2001 Bloom's Taxonomy
quality_score: 98
---

# Cybersecurity

**Title:** Cybersecurity: Foundations, Practice, and Professional Responsibility

**Target Audience:** College undergraduate students (primarily sophomores through seniors pursuing a B.S. in Cybersecurity, Computer Science, Information Systems, or a related computing discipline). The course is also suitable for adult continuing education and professional development for IT practitioners transitioning into security roles.

**Prerequisites:**

- Introductory programming (Python, C, or equivalent) — one semester
- Data structures and algorithms — one semester
- Discrete mathematics (sets, logic, functions, modular arithmetic, basic combinatorics and probability)
- Computer organization and operating systems fundamentals (processes, memory, file systems, system calls)
- Introduction to computer networks (OSI/TCP-IP models, addressing, routing) — recommended, may be taken concurrently

## Course Overview

Cybersecurity is the computing discipline concerned with establishing and maintaining the confidentiality, integrity, and availability of information, systems, and infrastructure in the presence of adversaries. This course provides a comprehensive, ABET CAC-aligned introduction to cybersecurity as a computing-based discipline — grounded in algorithms, systems, and mathematics — and as a sociotechnical practice that spans engineering, organizational policy, human behavior, law, and ethics.

Students will develop both the **technical fluency** (cryptography, secure coding, network defense, system hardening, incident response) and the **cross-cutting habits of mind** (adversarial thinking, systems thinking, risk reasoning) that the ABET Computing Accreditation Commission requires of graduates from accredited cybersecurity programs. The course is structured around the eight knowledge areas of the CSEC2017 Joint Task Force curriculum — Data, Software, Component, Connection, System, Human, Organizational, and Societal Security — which the ABET CAC Cybersecurity Program Criteria explicitly reference.

The course emphasizes *defensible design* over rote memorization of attacks. Students learn to reason about threats, quantify and communicate risk, apply cryptographic primitives correctly, build and evaluate security controls, and assess the ethical, legal, and societal consequences of their technical decisions. A capstone project requires teams to design, implement, and defend a security-critical system, meeting ABET Student Outcomes for complex problem analysis, solution design, effective communication, ethical reasoning, teamwork, and applying security principles to maintain operations under adversarial conditions.

## Main Topics Covered

1. **Foundations and Cross-Cutting Concepts** — CIA triad, AAA (authentication, authorization, accounting), adversarial thinking, threat modeling (STRIDE, PASTA, attack trees), risk (likelihood × impact), systems thinking, defense in depth, least privilege, security economics
2. **Cryptography and Data Security** — symmetric ciphers (AES, modes of operation), asymmetric cryptography (RSA, ECC, Diffie-Hellman), hash functions (SHA-2, SHA-3), digital signatures, MACs, PKI, key management, TLS, data at rest/in transit/in use, database security, data loss prevention, privacy-preserving computation
3. **Software Security** — secure software development lifecycle (SSDLC), common vulnerabilities (OWASP Top Ten, CWE Top 25), buffer overflows, injection (SQL, command, XSS), deserialization flaws, race conditions, secure coding standards, static/dynamic analysis, fuzzing, software supply chain and SBOMs
4. **Component Security** — hardware security (TPM, HSM, secure enclaves), firmware and boot security, side-channel attacks, hardware supply chain, embedded and IoT device security
5. **Connection Security (Network Security)** — network protocols and their weaknesses, firewalls, IDS/IPS, VPNs, network segmentation, wireless security (WPA3, 802.1X), DNS/DNSSEC, BGP security, DDoS mitigation, Zero Trust architecture
6. **System Security** — operating system security models, access control (DAC, MAC, RBAC, ABAC), virtualization and container security, cloud security (shared responsibility, IAM), security monitoring, SOC operations, SIEM, endpoint detection and response (EDR)
7. **Human Security** — identity and access management, authentication (passwords, MFA, biometrics, FIDO2/passkeys), social engineering and phishing, usable security, insider threats, security awareness, privacy engineering
8. **Organizational Security** — governance, risk, and compliance (GRC), security policies and standards, NIST Cybersecurity Framework, ISO/IEC 27001, security program management, business continuity and disaster recovery, vendor risk, security metrics
9. **Societal Security** — cyber law (CFAA, ECPA, GDPR, HIPAA, CCPA), cybercrime, digital forensics, incident response and reporting obligations, cyber ethics, cyber policy, international norms, critical infrastructure protection
10. **Offensive and Defensive Operations** — penetration testing methodology, red/blue/purple teaming, MITRE ATT&CK framework, threat intelligence, vulnerability management, incident response lifecycle (PICERL), forensic investigation
11. **Emerging Topics** — AI/ML security (adversarial ML, model theft, prompt injection), quantum-resistant cryptography, zero-knowledge proofs, confidential computing, operational technology (OT/ICS) security

## Topics Not Covered

- Advanced cryptanalysis and original cryptographic research (covered in dedicated graduate cryptography courses)
- Deep reverse engineering and exploit development (covered in a follow-on offensive security course)
- Advanced malware analysis and binary instrumentation
- Nation-state-level offensive tradecraft and classified material
- Hardware chip design and semiconductor-level fabrication security
- Legal practice and jurisdiction-specific courtroom procedures (general legal awareness is covered; bar-level practice is not)
- Product-specific vendor certifications (CISSP, CEH, OSCP, Security+ exam prep — the course covers the knowledge domains but is not an exam prep course)
- Military cyber operations doctrine
- Physical penetration testing and lockpicking tradecraft

## Learning Outcomes

After completing this course, students will be able to:

### Remember

*Retrieving, recognizing, and recalling relevant knowledge from long-term memory.*

- **Recall** the CIA triad (confidentiality, integrity, availability) and the extended AAA properties (authentication, authorization, accounting, non-repudiation)
- **Define** core cryptographic primitives: symmetric and asymmetric ciphers, hash functions, MACs, digital signatures, and key exchange protocols
- **List** the eight CSEC2017 knowledge areas and the cross-cutting concepts referenced by the ABET CAC Cybersecurity Program Criteria
- **Identify** the OWASP Top Ten web application vulnerabilities and the CWE Top 25 software weaknesses
- **Name** the phases of the incident response lifecycle (Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned)
- **Recognize** common network protocols (TCP, UDP, IP, HTTP/S, DNS, TLS, SSH, BGP) and state the security properties each does and does not provide
- **Recall** key U.S. and international cyber laws and regulations (CFAA, ECPA, HIPAA, GLBA, FERPA, GDPR, CCPA, NIS2)
- **List** the steps of the NIST Cybersecurity Framework functions (Govern, Identify, Protect, Detect, Respond, Recover)
- **Define** key terms: threat, vulnerability, exploit, risk, attack surface, blast radius, kill chain, TTP, IOC, CVE, CVSS
- **Recognize** standard access control models (DAC, MAC, RBAC, ABAC)

### Understand

*Constructing meaning from instructional messages, including oral, written, and graphic communication.*

- **Explain** why adversarial thinking and systems thinking are cross-cutting habits essential to cybersecurity practice
- **Describe** how symmetric and asymmetric cryptography complement one another in real protocols such as TLS
- **Summarize** the security guarantees and limits of hash functions, MACs, and digital signatures, and articulate when each is appropriate
- **Interpret** threat models expressed in STRIDE, attack trees, or MITRE ATT&CK form
- **Explain** the shared responsibility model for cloud security and how responsibility shifts between IaaS, PaaS, and SaaS
- **Describe** how common vulnerabilities (buffer overflow, SQL injection, XSS, CSRF, SSRF) arise from specific coding or architectural mistakes
- **Compare** access control models and explain the tradeoffs between flexibility, manageability, and assurance
- **Explain** the Zero Trust security model and how it differs from perimeter-based defense
- **Summarize** the legal and ethical obligations of security practitioners under relevant statutes and professional codes (ACM, IEEE-CS)
- **Describe** how risk is quantified (likelihood × impact) and communicated to non-technical stakeholders
- **Interpret** a CVE/CVSS score and explain what it does and does not convey about real-world risk
- **Explain** the human factors that make social engineering effective and how usable security mitigates them

### Apply

*Carrying out or using a procedure in a given situation.*

- **Use** cryptographic libraries correctly to encrypt data, verify signatures, and establish authenticated channels — without implementing primitives from scratch
- **Apply** secure coding practices to eliminate the OWASP Top Ten vulnerabilities in a provided codebase
- **Perform** a threat model of a small system using STRIDE and produce a prioritized list of mitigations
- **Configure** a host firewall, network firewall rules, and a basic IDS/IPS ruleset to enforce a stated policy
- **Implement** multi-factor authentication and a password policy that follows current NIST SP 800-63B guidance
- **Use** static analysis, dependency scanning, and fuzzing tools in a CI/CD pipeline and interpret the results
- **Perform** a basic forensic acquisition and timeline reconstruction from disk and memory images, preserving chain of custody
- **Apply** the NIST Cybersecurity Framework to map an organization's current controls against a target profile
- **Conduct** a controlled vulnerability scan on an authorized target and triage the findings
- **Use** a SIEM to write detection rules for common TTPs documented in MITRE ATT&CK
- **Configure** TLS correctly on a web server (cipher suites, certificate chain, HSTS, OCSP stapling)
- **Apply** least privilege and segregation of duties to an identity and access management design

### Analyze

*Breaking material into constituent parts and determining how the parts relate to one another and to an overall structure or purpose.*

- **Analyze** a complex computing problem and decompose it into security requirements, trust boundaries, assets, and threats (ABET Student Outcome 1)
- **Diagnose** a security incident from log and packet evidence, distinguishing root cause from symptom
- **Analyze** a cryptographic protocol for confidentiality, integrity, authentication, and replay protection, identifying which properties are provided and which are not
- **Compare** competing security architectures (perimeter, defense-in-depth, Zero Trust) for a given operating context
- **Deconstruct** a published attack (e.g., SolarWinds, Log4Shell, Colonial Pipeline, MOVEit) into its kill-chain stages and identify the controls that failed
- **Differentiate** risks that should be mitigated, transferred, accepted, or avoided, and justify the choice
- **Analyze** the attack surface of an application, system, or network and prioritize hardening work by expected risk reduction
- **Examine** a piece of malicious or suspicious code statically to determine its likely behavior and indicators of compromise
- **Analyze** the privacy implications of a data collection or processing design and identify minimization opportunities
- **Decompose** a compliance requirement (e.g., HIPAA Security Rule, PCI-DSS) into concrete technical and administrative controls

### Evaluate

*Making judgments based on criteria and standards through checking and critiquing.*

- **Evaluate** a proposed security design against stated requirements, threat model, budget, and usability constraints, and recommend revisions (ABET Student Outcome 2)
- **Critique** cryptographic choices in a codebase and identify misuse (weak algorithms, ECB mode, hardcoded keys, missing authentication of ciphertext, insufficient IV randomness)
- **Judge** whether a proposed control is commensurate with the risk it addresses, citing defensible criteria
- **Assess** the effectiveness of an organization's security program against the NIST CSF or ISO/IEC 27001 and produce a prioritized improvement plan
- **Evaluate** the ethical and legal implications of a proposed offensive or investigative action (ABET Student Outcome 4)
- **Compare and rank** vendor security claims using third-party assurance evidence (SOC 2 reports, ISO certifications, pen test results)
- **Assess** the trustworthiness and relevance of threat intelligence before acting on it
- **Evaluate** a post-incident report for completeness, blamelessness, and usefulness of its recommendations
- **Judge** whether a machine learning model has been deployed with adequate safeguards against adversarial inputs, model extraction, and data poisoning
- **Critique** a published security research paper or vulnerability disclosure for technical accuracy and responsible handling

### Create

*Putting elements together to form a coherent or functional whole; reorganizing elements into a new pattern or structure.*

- **Design** a defensible security architecture for a small-to-medium system, including threat model, trust boundaries, controls, and residual risk (ABET Student Outcome 2)
- **Develop** an incident response plan and runbooks for a realistic organization, including communication, legal, and regulatory obligations
- **Construct** a complete secure software project that integrates threat modeling, secure coding, automated security testing, and deployment hardening
- **Compose** a written risk assessment and executive-level security recommendation that a non-technical decision-maker can act on (ABET Student Outcome 3)
- **Build** a SIEM/SOAR detection-and-response pipeline that triggers on chosen MITRE ATT&CK techniques and automates first-response actions
- **Design** an identity, authentication, and authorization system for a multi-tenant application using modern standards (OAuth 2.1, OIDC, SAML, FIDO2)
- **Produce** a privacy-by-design data handling plan that complies with stated regulatory requirements
- **Formulate** a responsible disclosure policy and a coordinated vulnerability disclosure workflow for an organization
- **Capstone Project — Secure System Design and Defense:** In teams of 3–5 (ABET Student Outcome 5), design, implement, and defend a security-critical application (e.g., secure messaging, e-voting prototype, healthcare data platform, IoT fleet manager, or confidential document workflow). Deliverables include a written threat model, design document, implemented prototype, peer red-team assessment report with remediations, and a public oral defense addressing questions on threats, controls, residual risk, ethics, and operational readiness (ABET Student Outcome 6).
- **Capstone Project — Security Program Design:** Alternative capstone in which student teams produce an end-to-end security program for a fictitious organization, including policy set, risk register, control catalog mapped to NIST CSF, tabletop incident exercise, and a board-level summary.
- **Capstone Project — Applied Research Report:** Alternative capstone in which students investigate an emerging security topic (post-quantum cryptography migration, AI supply-chain security, OT/ICS resilience), build a small proof-of-concept, and publish a reproducible report suitable for a practitioner audience.

## Alignment with ABET CAC Cybersecurity Program Criteria and Student Outcomes

This course is designed to contribute directly to the ABET Computing Accreditation Commission's Cybersecurity Program Criteria and to all six ABET Student Outcomes for computing programs:

1. **Analyze a complex computing problem** and apply principles of computing and other relevant disciplines to identify solutions — supported by the Analyze and Evaluate learning outcomes and the threat-modeling and incident-diagnosis exercises.
2. **Design, implement, and evaluate a computing-based solution** to meet a given set of computing requirements in the context of the program's discipline — supported by the Apply and Create outcomes and by all three capstone options.
3. **Communicate effectively** in a variety of professional contexts — supported by written risk assessments, executive briefings, and the oral capstone defense.
4. **Recognize professional responsibilities** and make informed judgments in computing practice based on legal and ethical principles — supported by the Societal Security topic and the Evaluate outcomes on ethics and disclosure.
5. **Function effectively as a member or leader of a team** engaged in activities appropriate to the program's discipline — supported by the team-based capstone project.
6. **Apply security principles and practices** to maintain operations in the presence of risks and threats — the pervasive outcome of the course, reinforced in every module and demonstrated in the capstone.
