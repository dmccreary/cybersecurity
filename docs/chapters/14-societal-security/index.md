---
title: "Societal Security: Law, Forensics, and Ethics"
description: "Addresses the legal, forensic, and ethical context of security work: cyber law, digital forensics, professional ethics, responsible disclosure, and critical-infrastructure protection."
generated_by: claude skill chapter-content-generator
date: 2026-04-25 11:21:03
version: 0.07
---

# Societal Security: Law, Forensics, and Ethics

## Summary

Addresses the legal, forensic, and ethical context of security work: U.S. and international cyber law (CFAA, ECPA, GDPR, CCPA, HIPAA, GLBA, FERPA, NIS2), cybercrime, digital forensics across disk/memory/mobile/network, chain of custody and forensic imaging, cyber ethics and the ACM code, responsible disclosure, cyber policy, and critical-infrastructure (ICS, SCADA) protection.

## Concepts Covered

This chapter covers the following 24 concepts from the learning graph:

1. Cyber Law
2. CFAA
3. ECPA
4. GDPR
5. CCPA
6. HIPAA Law
7. GLBA
8. FERPA
9. NIS2 Directive
10. Cybercrime
11. Digital Forensics
12. Chain of Custody
13. Forensic Imaging
14. Memory Forensics
15. Mobile Forensics
16. Network Forensics
17. Cyber Ethics
18. Responsible Disclosure
19. ACM Code of Ethics
20. Cyber Policy
21. Critical Infrastructure
22. ICS Security
23. SCADA Security
24. Data Breach Notification

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Security Foundations: Properties, Mindset, and Risk](../01-security-foundations/index.md)
- [Chapter 2: Threats, Vulnerabilities, and Security Controls](../02-threats-and-controls/index.md)
- [Chapter 5: Software Vulnerabilities and Secure Coding](../05-software-vulnerabilities/index.md)
- [Chapter 9: Advanced Network Defense: Wireless, DNS, and Zero Trust](../09-advanced-network-defense/index.md)

---

!!! mascot-welcome "Welcome to the Societal Layer"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    Welcome. Up to now we have studied the machinery — bits, protocols, controls. This chapter steps back to the social systems that machinery operates inside: courts, regulators, investigators, professional bodies, and the critical infrastructure your country runs on. Technical skill without legal and ethical fluency is a career-limiting gap. Trust, but verify.

## 1. Why Societal Security Is a Computing Discipline

The earlier chapters treated security mostly as an engineering question: what controls reduce what risks against what threats? But every technical decision a security engineer makes is bounded — and sometimes determined — by **law, regulation, professional ethics, and public policy**. The same network scan that is routine reconnaissance on a system you own may be a federal crime against a system you do not. The same forensic image that exonerates one employee may, if mishandled, become inadmissible in court and let a real attacker walk free. The same vulnerability disclosure that makes the internet safer can, if timed badly, hand a working exploit to criminals.

Societal Security is the eighth and final knowledge area of the **CSEC2017 Joint Task Force curriculum**, the curriculum the ABET Computing Accreditation Commission references when it accredits cybersecurity programs. It exists because computing is a *sociotechnical* discipline: technical artifacts have social consequences, and social rules constrain technical practice. The five cross-cutting questions you should ask of every situation in this chapter are the same five professional practitioners ask:

- *Is this action legal in the jurisdictions involved?*
- *Is this action ethical even if legal?*
- *If this becomes evidence, will it hold up in court?*
- *Who is required to be notified, and within what window?*
- *What public-good obligations does my professional role impose?*

These questions cut across statutes, professional codes, and practical investigation. We will work through each in turn.

## 2. Cyber Law: The Legal Substrate

**Cyber Law** is the body of statutes, regulations, and case law that govern computing — what you may do to a system, what you must do with the data you collect, and what happens when something goes wrong. It is not one law but a layered patchwork of federal statutes, sector-specific rules, state laws, and international regimes that often disagree with one another. A practitioner working on a cloud product can easily be subject to a dozen overlapping legal regimes at once.

Before we examine the statutes themselves, three vocabulary distinctions will keep you out of trouble:

- **Authorization** is the legal hinge for almost every cyber statute. The same packet sent to the same port can be lawful or criminal depending on whether the recipient authorized it. "I had a good reason" is not authorization. Written permission, scoped to specific systems and time windows, is.
- **Jurisdiction** determines which law applies. A server in Ireland operated by a U.S. company storing data on a French citizen accessed by a Brazilian attacker can implicate four jurisdictions simultaneously. The internet is global; the law is not.
- **Civil versus criminal** liability differ in burden of proof and remedy. Criminal cases are prosecuted by governments and can result in imprisonment; civil cases are brought by parties (often regulators or injured users) and result in fines, injunctions, or damages.

### 2.1 The Computer Fraud and Abuse Act (CFAA)

The **Computer Fraud and Abuse Act (CFAA)** is the central U.S. anti-hacking statute, enacted in 1986 and amended several times since. Its core prohibition is *accessing a protected computer "without authorization" or in excess of authorized access*. "Protected computer" is defined so broadly — essentially any computer connected to the internet — that the CFAA reaches almost all U.S.-related computing. Penalties scale from misdemeanors to felonies depending on intent, harm, and whether the access furthered a separate crime.

The CFAA is the statute that turns a port scan, a credential-stuffing attempt, or an unauthenticated API request from a research curiosity into a possible federal offense. The 2021 Supreme Court decision in *Van Buren v. United States* narrowed "exceeds authorized access" to mean accessing files or areas you were forbidden to enter, not merely using authorized access for a forbidden purpose — a meaningful but still bounded relief for security researchers.

!!! mascot-warning "Authorization Is Not Implied"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel warning">
    A site that is publicly reachable is not a site you are authorized to test. "Public-facing" means the bits travel; it does not mean the owner has consented to your scans, fuzzing, or login attempts. Get written authorization scoped to specific hosts and time windows before any active testing — the CFAA does not care that you meant well.

### 2.2 The Electronic Communications Privacy Act (ECPA)

The **Electronic Communications Privacy Act (ECPA)** governs the **interception, access, and disclosure** of electronic communications — email, phone calls, instant messages, and stored records. It has three parts: the **Wiretap Act** (real-time interception), the **Stored Communications Act** (data at rest with providers), and the **Pen Register Act** (metadata). For a security practitioner, the ECPA is the reason you cannot simply read employee email without a documented policy and consent, and the reason network monitoring programs require carefully crafted notice and exceptions.

### 2.3 Sectoral U.S. Privacy Statutes

The United States, unlike the European Union, does not have a single comprehensive privacy law. Instead it regulates privacy *by sector*. The four most often encountered are summarized below; the rest of this section explains each in turn.

| Statute | Sector | Core obligation |
|---------|--------|----------------|
| **HIPAA** | Healthcare | Protect Protected Health Information (PHI); breach notification |
| **GLBA** | Financial services | Safeguard non-public personal financial information |
| **FERPA** | Education | Protect student education records; require parental/student consent |
| **CCPA** | California consumers | Disclosure, access, deletion, and opt-out rights |

The **Health Insurance Portability and Accountability Act (HIPAA Law)** governs **Protected Health Information (PHI)** held by covered entities (health plans, providers, clearinghouses) and their business associates. Its **Privacy Rule** restricts uses and disclosures; its **Security Rule** requires administrative, physical, and technical safeguards (access control, audit logs, encryption "where reasonable and appropriate"); its **Breach Notification Rule** requires notice to affected individuals and the U.S. Department of Health and Human Services within 60 days of discovery, with media notification for breaches over 500 individuals.

The **Gramm-Leach-Bliley Act (GLBA)** applies to financial institutions and requires them to safeguard customer non-public personal information. Its **Safeguards Rule**, modernized in 2023, now requires named CISOs, written information-security programs, multi-factor authentication on customer-data-handling systems, and 30-day breach notification to the FTC for incidents involving 500 or more consumers.

The **Family Educational Rights and Privacy Act (FERPA)** governs **education records** at schools that receive federal funding — almost every K–12 and higher-education institution in the United States. It restricts disclosure of personally identifiable student information without consent, with carve-outs for "directory information" and "school officials with legitimate educational interest." Edtech vendors regularly run afoul of FERPA when terms-of-service consent flows do not match the school-as-data-controller posture FERPA assumes.

The **California Consumer Privacy Act (CCPA)** — extended by the California Privacy Rights Act — gives California residents rights to know what personal information businesses collect, to access and delete it, to opt out of its sale or sharing, and to non-discrimination when exercising those rights. Although a state law, the CCPA reaches any business above a size threshold that handles California residents' data, which means most national and international web services.

### 2.4 GDPR and NIS2: The European Layer

The **General Data Protection Regulation (GDPR)** is the European Union's comprehensive privacy law, in force since 2018. Where U.S. privacy law is sectoral and rights-thin, GDPR is universal and rights-rich. It applies to any organization — wherever located — that processes personal data of people in the EU, and it grants data subjects rights of access, rectification, erasure, portability, and objection. Lawful processing requires a defined legal basis (consent, contract, legitimate interest, legal obligation, vital interest, or public task), and breach notification to the supervisory authority is required within **72 hours** of discovery. Fines reach the greater of 20 million euros or 4% of global annual revenue — large enough that GDPR has reshaped corporate privacy programs worldwide.

The **NIS2 Directive** (Network and Information Systems Directive 2), in force across the EU since 2024, raises cybersecurity baseline obligations for "essential" and "important" entities across energy, transport, banking, health, water, digital infrastructure, public administration, and digital service providers. NIS2 mandates risk-management measures, incident reporting in stages (early warning within 24 hours, full notification within 72 hours, final report within one month), supply-chain security, and personal accountability for management bodies. NIS2 is the European answer to the same critical-infrastructure question we will return to in Section 7.

#### Diagram: Cyber Law Jurisdictional Map

<details markdown="1">
<summary>Interactive map showing how laws layer over jurisdictions and sectors</summary>
Type: interactive-infographic
**sim-id:** cyber-law-jurisdiction-map<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom: Understand → Analyze): Given a hypothetical scenario (e.g., "A U.S. healthcare company stores European patient data on California servers"), the student identifies which laws apply and why.

Layout: A 900x600 canvas divided into three vertical bands labeled **U.S. Federal**, **U.S. State**, and **International**. Within each band, rounded rectangles represent statutes:

- U.S. Federal: CFAA (cybercrime), ECPA (communications), HIPAA (health), GLBA (finance), FERPA (education)
- U.S. State: CCPA (California), plus a "+ 19 other state laws" stacked card
- International: GDPR (EU privacy), NIS2 (EU critical infrastructure)

Hovering over any statute reveals a tooltip with: scope, who is regulated, key obligation, and breach-notification window.

Below the bands sits a **Scenario Selector** dropdown with five preset scenarios (e.g., "EU resident, U.S. SaaS, financial data"). Selecting one highlights all applicable statutes in cybersecurity blue (#1565c0) and dims the others. A side panel explains why each highlighted law applies.

Implementation: p5.js with hand-rolled card components and tooltip overlays. Responsive to window resize via `updateCanvasSize()` in setup().
</details>

## 3. Cybercrime: When Computing Is the Crime Scene

**Cybercrime** is criminal activity that targets, uses, or relies on computer systems. It splits into two broad classes: **computer-as-target** crimes (intrusion, ransomware, distributed denial of service, data theft) and **computer-as-tool** crimes (online fraud, child exploitation imagery, harassment, intellectual-property theft). The CFAA, identity-theft statutes, fraud statutes, and the Wire Fraud Act collectively criminalize most of these in the United States; analogous laws exist in nearly every jurisdiction, and the **Council of Europe Convention on Cybercrime** (Budapest Convention) provides a framework many countries have signed.

The economic scale matters for policy reasoning. The FBI's Internet Crime Complaint Center receives hundreds of thousands of complaints per year, with reported losses in the tens of billions of dollars; the actual loss is much higher because most incidents go unreported. Ransomware against hospitals, schools, and municipal governments has produced not only financial damage but also documented harm to patient care, learning, and emergency services. The boundary between cybercrime and national security has eroded: criminal ransomware groups now operate with the operational sophistication of nation-state actors, and several have provable nation-state ties.

For a security professional, the practical takeaway is twofold. First, every incident is a potential crime scene, and the way you handle the first hour determines whether prosecution is possible later. Second, your duty to your employer rarely permits "hacking back" — counter-attacking the attackers — because such counter-action is itself almost always a CFAA violation.

## 4. Digital Forensics: Turning Data into Evidence

**Digital Forensics** is the discipline of acquiring, preserving, examining, and presenting digital evidence in a manner suitable for legal or organizational proceedings. The discipline rests on four pillars — *acquisition*, *authentication*, *analysis*, and *presentation* — and on a single, non-negotiable concept that runs through all four: chain of custody.

### 4.1 Chain of Custody and Forensic Imaging

**Chain of Custody** is the documented, unbroken record of who handled a piece of evidence, when, where, why, and what they did to it, from the moment of seizure until it appears in court. A break in the chain — a missing log entry, an unaccounted-for window of access, a transfer without a witness — is the most common reason digital evidence is excluded at trial. The chain is not a technical artifact; it is a *paper trail* whose technical artifacts (hashes, write-blocker logs, time-stamped photographs) are the items that paper records.

**Forensic Imaging** is the bit-for-bit duplication of a storage device using a hardware or software write-blocker so the source media is not modified by the act of copying. The output is an *image file* — typically in raw `dd`, **EnCase E01**, or **AFF4** format — accompanied by **cryptographic hashes (MD5 plus SHA-256, or SHA-256 alone)** that prove the image is identical to the source and remains identical to itself over time. All subsequent analysis is performed on copies of the image, never on the source media.

The forensic workflow has a fixed order — and skipping a step is what most often loses cases. Before we examine the workflow diagram below, note that each numbered step writes one or more entries into the chain-of-custody log, and that volatile data (RAM, network connections, running processes) must be captured *before* the system is powered off.

#### Diagram: The Forensic Investigation Workflow

<details markdown="1">
<summary>Workflow diagram showing the forensic process from seizure to court</summary>
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
</details>

### 4.2 The Four Forensic Domains

The same workflow applies across four distinct domains, each with its own tools and pitfalls. Memory, mobile, and network forensics are the three that students most often underestimate. Each domain answers a different forensic question, summarized in the table that follows the prose.

**Memory Forensics** analyzes the contents of a system's RAM at the time of acquisition. RAM contains running processes, decrypted keys, network connections, command history, and malware that exists only in memory and never touches disk. Tools such as **Volatility** and **Rekall** parse memory images to reconstruct the kernel's view of the running system. Memory forensics is the only reliable way to investigate fileless malware, in-memory implants, and certain ransomware families, because by the time disk artifacts are written, the attacker has often hidden them.

**Mobile Forensics** addresses smartphones and tablets, which combine encrypted storage, multiple radios, cloud synchronization, and proprietary boot chains. Tools such as **Cellebrite UFED** and **Magnet AXIOM** support physical, file-system, and logical acquisitions; what they can recover depends heavily on device model, OS version, lock state, and whether biometrics are usable. Cloud-side acquisition through warrants to providers (iCloud, Google) often yields more than the device itself, but introduces additional legal process.

**Network Forensics** reconstructs activity from packet captures, NetFlow records, firewall and IDS logs, DNS logs, and proxy logs. Where disk forensics asks *"what was on this system?"*, network forensics asks *"what did this system say to whom, when?"*. Because attacker traffic must traverse the network, network forensics is often the most reliable way to scope a breach: every command-and-control beacon, every staged exfiltration, every lateral movement leaves a network footprint somewhere.

| Domain | Primary question | Representative tools | Volatility |
|--------|-----------------|----------------------|------------|
| **Disk forensics** | What was stored, deleted, or modified? | FTK, EnCase, Autopsy, Sleuth Kit | Persistent |
| **Memory forensics** | What was running, decrypted, or hidden in RAM? | Volatility, Rekall | Lost on power off |
| **Mobile forensics** | What did this device do, and with whom? | Cellebrite UFED, Magnet AXIOM | Mixed (encrypted at rest) |
| **Network forensics** | What conversations crossed the wire? | Wireshark, Zeek, Suricata, NetFlow tools | Lost if not captured |

!!! mascot-thinking "Volatility Decides Order"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    Acquire evidence in **order of volatility**: CPU registers and cache, then RAM, then network state, then disk, then archival media. Pull the power on a running compromised host before grabbing memory and you have just destroyed your best chance of catching fileless malware. The order is not optional.

## 5. Cyber Ethics and the ACM Code

Law tells you what you *must* and *must not* do. **Cyber Ethics** asks the harder question: what *should* you do when several lawful options are available, when the law is silent or out of date, and when your employer's interests diverge from the public's? Professional security work is full of these moments — a vulnerability you cannot ethically disclose, a customer request you cannot ethically fulfill, a tool you cannot ethically build.

The **ACM Code of Ethics and Professional Conduct** (revised 2018) is the canonical professional code for computing. It is organized into four sections: **General Ethical Principles** ("contribute to society and human well-being," "avoid harm," "be honest and trustworthy," "be fair and act not to discriminate," "respect privacy," "honor confidentiality"), **Professional Responsibilities**, **Professional Leadership Principles**, and **Compliance with the Code**. Two of its principles specifically constrain security work:

- **1.2 Avoid harm.** Computing professionals should consider whether the results of their efforts will be used in socially responsible ways and refrain from harm where reasonably possible.
- **2.8 Access computing and communication resources only when authorized or when compelled by the public good.** This principle specifically anticipates the security researcher's dilemma: the public-good carve-out exists, but it is narrow and demands documented justification.

The **IEEE Computer Society** maintains a parallel software-engineering code, and the **(ISC)² Code of Ethics** binds CISSP holders to four canons. All three converge on the same core: protect people, act with integrity, advance the profession, and behave honorably toward employers, clients, and the public.

### 5.1 Responsible Disclosure

**Responsible Disclosure** — also called *coordinated vulnerability disclosure* (CVD) — is the practice of reporting security vulnerabilities to vendors privately, giving them a defined window (typically 90 days, sometimes 30 or 120) to develop and ship a fix, and then publishing technical details after the patch is available. Responsible disclosure is the ethical compromise between two unworkable extremes. Pure secrecy ("never tell anyone") leaves users vulnerable indefinitely. Full immediate disclosure ("publish the exploit on day zero") helps attackers far more than defenders.

A defensible disclosure program has six elements: a clear reporting channel (often a `security.txt` file and a `security@` mailbox), an acknowledgment SLA, a coordination plan, a public disclosure timeline, a credit policy for the reporter, and — increasingly — a **safe-harbor clause** that promises the organization will not pursue CFAA or DMCA claims against good-faith researchers operating within the program's scope. Bug bounty programs run by Google, Microsoft, the U.S. Department of Defense ("Hack the Pentagon"), and others have professionalized this model.

!!! mascot-tip "Default to Coordination"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sentinel tip">
    When you find a vulnerability, your first move is *coordinate, then disclose*. Document your finding, contact the vendor through their published security channel, agree on a timeline, and stay in touch. Public disclosure is a tool — useful when a vendor refuses to engage, dangerous when used reflexively. *Trust, but verify.*

## 6. Cyber Policy and the Public Layer

**Cyber Policy** is the set of governmental positions, strategies, and regulations that shape how cybersecurity is practiced at national and international scale. It is the layer above the law — laws are policy made enforceable; policy is the broader plan and posture. In the United States, cyber policy is set by an array of bodies including the **National Security Council**, the **Cybersecurity and Infrastructure Security Agency (CISA)**, the **National Institute of Standards and Technology (NIST)**, and sector-specific regulators. The 2023 *National Cybersecurity Strategy* shifted the U.S. policy stance toward placing the burden of secure-by-default products on vendors rather than end users — a meaningful change practitioners feel through tighter procurement and software-bill-of-materials (SBOM) requirements.

Internationally, cyber policy is shaped by treaties (Budapest Convention), United Nations processes (the GGE and OEWG on responsible state behavior in cyberspace), regional regulations (NIS2, the EU Cyber Resilience Act), and bilateral agreements. There is no global "Geneva Convention" for cyber operations, though one is repeatedly proposed; the absence is itself a policy reality practitioners must work within.

### 6.1 Data Breach Notification

**Data Breach Notification** is the legal obligation, when personal data has been improperly accessed or disclosed, to inform affected individuals and (often) regulators within a defined window. This obligation is the policy lever that turns "security incident" into "public event," and it is therefore the single most consequential operational rule on most incident-response runbooks. The windows differ sharply, and a multinational organization can be subject to several at once. The summary table below collects the major regimes; the prose preceding each statute already explains its scope.

| Regime | Notification window | Notify whom |
|--------|--------------------|-------------|
| **GDPR (EU)** | 72 hours from discovery | Supervisory authority; data subjects "without undue delay" if high risk |
| **NIS2 (EU)** | 24h early warning, 72h notification, 1 month full report | National CSIRT / competent authority |
| **HIPAA (U.S.)** | 60 days | Affected individuals; HHS; media if 500+ |
| **GLBA (U.S.)** | 30 days | FTC if 500+ consumers |
| **CCPA / CPRA (California)** | "In the most expedient time possible and without unreasonable delay" | California AG; affected consumers |
| **All 50 U.S. states** | 30–90 days, varies | State AG; affected residents |

!!! mascot-encourage "The Clock Starts Quietly"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Sentinel encouraging">
    Reading these windows for the first time is overwhelming — every law has its own clock, its own definition of "discovery," its own list of recipients. Practitioners do not memorize them. They build a *notification matrix* with legal counsel, baked into the incident-response runbook, so the right notices fire at the right times under stress. You will build one in the capstone. This takes a few passes; that is normal.

## 7. Critical Infrastructure: ICS and SCADA Security

**Critical Infrastructure** is the set of systems and assets whose incapacitation or destruction would have a debilitating effect on national security, economic security, public health, or safety. The U.S. designates **16 critical infrastructure sectors**, including energy, water and wastewater, healthcare, financial services, communications, transportation, food and agriculture, and emergency services. The European NIS2 directive defines a similar list of essential and important entities. Securing these systems is no longer optional engineering — it is national policy.

The defining technical fact of critical infrastructure is that much of it runs on **operational technology (OT)** rather than conventional information technology. OT systems control physical processes — turbines, valves, breakers, pumps, robotic arms — and have life-safety and physical-damage consequences that ordinary IT does not. The two umbrella terms you must know are ICS and SCADA.

**Industrial Control Systems (ICS)** is the broad term for the hardware and software that control industrial processes, encompassing programmable logic controllers (PLCs), distributed control systems (DCS), human-machine interfaces (HMIs), and the engineering workstations that program them. **ICS Security** is a distinct subdiscipline because the priorities of OT differ from IT. The CIA triad's order is famously inverted: in OT, **availability and integrity dominate, with confidentiality last** — an unscheduled valve closure can kill people; a leaked recipe usually cannot.

**Supervisory Control and Data Acquisition (SCADA)** is the specific class of ICS used for *geographically distributed* monitoring and control — power grids, water distribution, oil pipelines, rail networks. **SCADA Security** focuses on the unique attack surface of long-haul telemetry: legacy serial protocols (Modbus, DNP3) bridged to IP networks, remote terminal units (RTUs) in unattended locations, and aging human-machine interfaces that often run unpatched Windows.

The risks are not theoretical. **Stuxnet** (2010) demonstrated that ICS could be physically destroyed via cyberattack. The **Ukraine power grid attacks** (2015 and 2016) showed that a coordinated attacker could open breakers across distribution substations and prolong outages by wiping operator workstations. **TRITON/TRISIS** (2017) targeted *safety instrumented systems* — the very controllers designed to prevent disasters — and is the first known cyberweapon designed to cause physical harm to humans. The **Colonial Pipeline ransomware incident** (2021) showed that even when the attack was on IT systems, the operational impact crossed into critical infrastructure as a precaution. The Purdue model below organizes the layered architecture defenders rely on to limit this kind of damage.

#### Diagram: The Purdue Model — IT/OT Network Layers

<details markdown="1">
<summary>Layered diagram of the Purdue Reference Model for ICS networks</summary>
Type: diagram
**sim-id:** purdue-model-layers<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Mermaid `flowchart TB` with seven horizontal layers stacked top to bottom, each a colored band:

- **Level 5 — Enterprise Network** (slate steel #455a64) — "Email, ERP, Internet"
- **Level 4 — Business Logistics** (slate steel) — "Plant scheduling, inventory"
- **(IT/OT DMZ)** (alert accent #ffa000, dashed border) — "Data historian replica, jump host, security monitoring"
- **Level 3 — Operations Management** (cybersecurity blue #1565c0) — "Engineering workstations, historians, MES"
- **Level 2 — Supervisory Control** (cybersecurity blue) — "HMIs, SCADA servers"
- **Level 1 — Basic Control** (cybersecurity blue, darker) — "PLCs, DCS controllers"
- **Level 0 — Physical Process** (cream #fff8e1 with slate border) — "Sensors, actuators, pumps, valves"

Vertical arrows between levels are bidirectional, but the arrow crossing the IT/OT DMZ is annotated **"Brokered, inspected, monotone — no direct sessions"** to emphasize the firewalled boundary.

A right-side legend explains the **CIA priority inversion**: IT (Confidentiality > Integrity > Availability) versus OT (Availability > Integrity > Confidentiality).

Implementation: Mermaid `flowchart TB` with subgraph layers and color classes; legend rendered alongside.
</details>

### 7.1 Defensive Patterns for ICS/SCADA

Five defensive patterns recur across every mature OT security program. These are the patterns most often missing in the postmortems of public ICS incidents.

- **Network segmentation per the Purdue model**, with brokered-only communication across the IT/OT DMZ. Direct sessions from corporate IT to Level-2 HMIs are the single most common antipattern in real environments.
- **Allowlisting on engineering workstations.** OT systems run a small, stable set of binaries. Application allowlisting is far more tractable here than on a developer laptop.
- **Out-of-band engineering access** — the "jump host" pattern, with multifactor authentication and session recording, sometimes air-gapped except during scheduled maintenance windows.
- **Asset inventory and protocol visibility** using passive monitoring (e.g., Claroty, Dragos, Nozomi) rather than active scanning, because active scans of legacy devices have caused outages.
- **Tested incident response with manual fallback procedures** — the operators must be able to run the plant without the SCADA system if necessary. This is not a "nice to have" in OT; it is a safety requirement.

The interactive simulator below lets you explore how a single segmentation choice cascades through an attack scenario, so you can feel the impact rather than just read about it.

#### Diagram: ICS Attack Path Explorer (MicroSim)

<details markdown="1">
<summary>p5.js MicroSim where students place segmentation controls and watch attack paths shorten or lengthen</summary>
Type: microsim
**sim-id:** ics-attack-path-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom: Apply → Analyze): Given a Purdue-model network with an attacker at Level 5, the student places segmentation controls (firewall, DMZ broker, allowlisting, MFA jump host) and observes the resulting attack path length and blast radius.

Canvas: 900 × 600 px, responsive via `updateCanvasSize()` in setup. Layout has:

- A vertical six-band Purdue stack on the left half (Levels 0–5), with colored nodes representing devices at each level
- A control panel on the right with **createCheckbox** toggles for each defense (DMZ Broker, Allowlist on Engineering Workstation, MFA Jump Host, Read-Only Historian, Disable RDP at Level 2)
- A **createButton** "Run Attack" that animates a red attacker token attempting to traverse from Level 5 to Level 1 (PLCs)
- A **createSlider** for "Attacker Skill" (0–10) that affects probability of bypassing weaker controls
- A live readout: **Path length**, **Time to compromise**, **Blast radius** (how many Level-1 devices the attacker can reach)

Behavior: With no defenses, the attacker reaches PLCs in ~3 hops. Each toggled defense adds hops, time, or blocks the path entirely; the simulator narrates *why* in a small log panel ("DMZ broker forced session termination — attacker must re-authenticate"). At maximum defenses, the attacker is contained in the IT layer.

Visual style matches textbook palette: cybersecurity blue for OT, slate steel for IT, alert orange for the DMZ, red token for attacker.

Implementation: p5.js with a small node-graph data model; canvas parented to `<main>` per project conventions.
</details>

## 8. Putting It Together — The Practitioner's Five Questions

Earlier we listed the five cross-cutting questions Societal Security forces on every action. Now that you have the vocabulary, the questions can be made operational. The following decision flow is the one I encourage every student to internalize before their first incident.

#### Diagram: The Practitioner's Decision Flow

<details markdown="1">
<summary>Workflow diagram of the legal/ethical/forensic/notification check that runs on every action</summary>
Type: workflow-diagram
**sim-id:** practitioner-decision-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Mermaid `flowchart TD` with five sequential decision diamonds:

1. **Legal?** — "Do I have written authorization in this jurisdiction, for these systems, for this window?"  → No: STOP, get authorization. Yes → continue.
2. **Ethical?** — "Even if legal, does this harm someone the ACM Code obligates me to consider?" → No: revise plan. Yes → continue.
3. **Forensic?** — "If this becomes evidence, will my chain of custody hold?" → No: capture before acting. Yes → continue.
4. **Notification?** — "Does this trigger HIPAA/GLBA/GDPR/NIS2/state breach notice?" → Yes: alert Legal/Privacy, start clock. → continue.
5. **Public Good?** — "Should I coordinate disclosure or notify CISA/CERT?" → Yes: open coordination channel.

Each diamond links to the section in the chapter where its concepts were introduced.

Implementation: Mermaid `flowchart TD` with class definitions for STOP (red), CONTINUE (cybersecurity blue), and reference links.
</details>

This flow is not a checklist to mechanically tick. It is a *prompt structure* — a set of questions you train yourself to ask in the first ten minutes of any incident, any pen test, any vulnerability handling, any data export. The questions are sequential because their answers depend on each other. You cannot evaluate breach-notification obligations if you have not preserved the forensic evidence that establishes what was breached. You cannot evaluate ethics if the action was illegal to begin with.

## 9. Key Takeaways

- **Cyber Law** is layered — federal, state, sectoral, and international regimes overlap. The CFAA criminalizes unauthorized access; ECPA governs communications; HIPAA, GLBA, FERPA, and CCPA cover sectoral and state privacy; GDPR and NIS2 set the European baseline.
- **Cybercrime** is at scale and escalating; the boundary between criminal and nation-state operations has blurred, and counter-attacking is itself almost always illegal.
- **Digital Forensics** depends on **chain of custody** and **forensic imaging**, with cryptographic hashes proving evidence integrity. Memory, mobile, and network forensics each answer a question disk forensics cannot.
- **Cyber Ethics** — anchored by the **ACM Code of Ethics** — and **responsible disclosure** are how practitioners act well in the gaps where law is silent or slow.
- **Cyber Policy** sets the strategic posture above the law; **data breach notification** is the operational rule that most directly shapes incident response.
- **Critical Infrastructure** — secured through ICS and SCADA practices, the Purdue model, and OT-aware controls — is where cybersecurity meets physical safety. The CIA triad is intentionally inverted: availability and integrity come first.

!!! mascot-celebration "What You Can Now Do"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sentinel celebrating">
    You can now read a security incident through five lenses simultaneously — legal, ethical, forensic, notification, and public-good — and you can name the statutes, codes, and frameworks that govern each. That is the foundation the capstone will build on, and the habit of mind every senior practitioner shares.
