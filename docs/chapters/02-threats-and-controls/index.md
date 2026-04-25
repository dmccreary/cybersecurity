---
title: "Threats, Vulnerabilities, and Security Controls"
description: "Introduces the threat-and-control vocabulary used throughout professional practice: threat actors, vulnerabilities, exploits, attack surface, CVE/CVSS, kill-chain models, and the preventive/detective/corrective control taxonomy."
generated_by: claude skill chapter-content-generator
date: 2026-04-25 10:24:00
version: 0.07
---

# Threats, Vulnerabilities, and Security Controls

## Summary

Introduces the threat-and-control vocabulary used throughout professional practice: threat actors, vulnerabilities, exploits, attack surface, CVE/CVSS, kill-chain models, and the preventive/detective/corrective control taxonomy. Students learn how risk is communicated and how controls are categorized as administrative, technical, or physical.

## Concepts Covered

This chapter covers the following 26 concepts from the learning graph:

1. Threat
2. Vulnerability
3. Exploit
4. Threat Actor
5. Attack Surface
6. Blast Radius
7. Trust Boundary
8. Asset
9. Security Requirement
10. CVE
11. CVSS
12. TTP
13. Indicator of Compromise
14. Indicator of Attack
15. Zero Day
16. Kill Chain
17. Cyber Kill Chain
18. Diamond Model
19. Security Control
20. Preventive Control
21. Detective Control
22. Corrective Control
23. Compensating Control
24. Administrative Control
25. Technical Control
26. Physical Control

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Security Foundations: Properties, Mindset, and Risk](../01-security-foundations/index.md)

---

!!! mascot-welcome "Welcome — From Vocabulary to Practice"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    Welcome back. Chapter 1 gave us the *properties* (CIA, AAA) and the *mindset* (adversarial and systems thinking). This chapter gives us the *vocabulary of attack and defense* — the words security professionals use every day to describe what could go wrong, what is going wrong, and what we are doing about it. Master this language and the rest of the textbook becomes ten times easier to read.

## 1. The Core Triple — Threat, Vulnerability, and Exploit

Three words appear in every security report, vendor advisory, and incident postmortem you will ever read. They are often used loosely in casual writing, but professional practice depends on getting them right.

A **threat** is a *potential* cause of harm — anyone or anything that could damage your assets, whether or not they ever do. Earthquakes are threats to a data center. Disgruntled former employees are threats. So are nation-state intelligence services, automated scanning bots, and lightning. A threat is a possibility, not an event.

A **vulnerability** is a weakness in a system, process, or person that a threat could exploit to cause harm. Vulnerabilities are properties of *your* environment. A buffer overflow in a parser, a default password that was never changed, an employee who has not been trained to recognize phishing — all are vulnerabilities. A vulnerability that no threat ever finds is still a vulnerability; it is just one that has not yet mattered.

An **exploit** is the *technique* or *artifact* — typically code, but sometimes a procedure or a social manipulation — that turns a vulnerability into actual harm. Exploits are how the abstract risk of a vulnerability becomes a concrete loss. The same vulnerability may have several exploits or none at all; an exploit may be public, semi-private (sold on a market), or held in secret.

| Term | Question it answers | Example |
|------|--------------------|---------|
| Threat | What *could* cause harm? | "A nation-state actor targeting our research" |
| Vulnerability | Where am I weak? | "Our login has no rate limit" |
| Exploit | How is the weakness actually used? | "Credential-stuffing tool with 4M leaked passwords" |
| Risk (from Ch. 1) | How much should this worry me? | Likelihood × impact, given the above |

The relationship is sequential: **threats** look for **vulnerabilities** that they can turn into harm using **exploits**, and the resulting expected harm is the **risk**.

!!! mascot-thinking "Why The Distinction Matters"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    Reports that conflate threat, vulnerability, and exploit produce muddled mitigations. "We have a phishing threat" is not actionable. "We have employees who click links in unverified emails (vulnerability) and we are seeing credential-harvesting campaigns (threat) that use spoofed login pages (exploit)" tells you what to fix and where.

## 2. Threat Actors — Who Is On The Other Side

A **threat actor** (sometimes called *adversary*) is the human or organizational entity behind a threat. Threat actors differ enormously in skill, resources, motivation, and patience, and the right defensive posture depends on which actors you are designing against. A small online retailer faces fundamentally different actors than a defense contractor.

Five broad categories cover most threat actors you will encounter. *Script kiddies* use existing tools opportunistically; their resources are low and their attention span is short, but their volume is high — most internet-facing systems get scanned by them within minutes of going online. *Cybercriminals* are profit-motivated, and they are increasingly professional: ransomware groups operate like businesses, complete with HR, customer support, and revenue sharing with affiliates. *Hacktivists* are motivated by ideology rather than profit; their targets are often chosen for symbolic value. *Insiders* are current or former employees, contractors, or partners with legitimate access; they are statistically rare but disproportionately damaging because they bypass perimeter defenses by definition. *Nation-state actors* (sometimes called *advanced persistent threats* or APTs) are government-aligned groups with the resources, patience, and skill to conduct multi-year campaigns; they are the apex predators of the threat landscape.

#### Diagram: Threat Actor Capability Matrix

<details markdown="1">
<summary>2D matrix of threat actors by skill versus resources, with typical motivations</summary>
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
</details>

The defender's job is not to stop every actor — it is to make the cost of a successful attack exceed the value the actor can extract. Script kiddies stop at the first lock; cybercriminals look for the cheapest path to revenue; nation-states will pay any price for a target they have decided matters. Knowing your likely actors shapes which controls are worth their cost.

## 3. Where Attacks Happen — Surface, Boundaries, Blast Radius

Three spatial concepts let you reason about *where* attacks happen and *how far* they spread once they do.

The **attack surface** is the sum of all points where an unauthorized actor could try to enter, extract data, or cause damage. For a web application, the attack surface includes every public endpoint, every form field, every cookie, every header, every dependency, and every interface to a backend service. For a physical building, the attack surface includes every door, window, vent, network jack, and security camera with a default password. Reducing attack surface — turning off unused services, closing unused ports, removing unused dependencies — is one of the highest-leverage activities in security, because you cannot be attacked through interfaces that do not exist.

A **trust boundary** is a line in the system across which the *level of trust* changes. Inside the boundary, components implicitly trust each other; outside, they do not. The boundary between your application and the public internet is a trust boundary. The boundary between user-supplied input and your application's internal data is a trust boundary. The boundary between your application and your database is a trust boundary. Every trust boundary is a place where authorization, validation, and integrity checks must happen, because you are crossing from "trusted" to "untrusted" territory or vice versa. Most security bugs occur at trust boundaries that the designer forgot were boundaries.

The **blast radius** is the scope of damage when a control fails. If an attacker compromises one user account, what can they reach? Can they read other users' data? Can they pivot to internal systems? Can they reach the database directly? Blast radius is what *least privilege* and *separation of duties* (Chapter 1) actually buy you: a smaller blast radius when something does go wrong. The phrase comes from explosives — the analogy is intentional.

#### Diagram: Attack Surface, Trust Boundary, and Blast Radius

<details markdown="1">
<summary>Layered diagram showing attack surface, trust boundaries, and blast radius for a sample web app</summary>
Type: architecture-diagram
**sim-id:** surface-boundary-blast-radius<br/>
**Library:** Mermaid (or static SVG)<br/>
**Status:** Specified

A simplified 3-tier web application diagram with:

- **Outer layer** (red, dashed): "Attack surface" — labeled with example points (HTTPS endpoint, login form, password reset, file upload, API tokens, third-party JavaScript)
- **First trust boundary** (between internet and reverse proxy): solid blue line labeled "Untrusted → DMZ"
- **Second trust boundary** (between application and database): solid blue line labeled "App → Data tier"
- **Internal components**: reverse proxy → application server → database
- A red explosion icon centered on the application server, with a dashed circle around it labeled "Blast radius if app is compromised: read all users' records, no path to OS"
- A second smaller blast-radius dashed circle centered on the database labeled "Blast radius if DB credentials are stolen: read/write all customer data"

Color palette: cybersecurity blue #1565c0 for trust boundaries, red #c62828 for attack-surface marks, slate steel #455a64 for component outlines, amber #ffa000 for the blast-radius dashed circles. Responsive layout.

Implementation: Mermaid graph LR with subgraphs for each tier; styling applied via Mermaid theme.
</details>

These three concepts — surface, boundary, blast radius — give you a spatial vocabulary that complements the property vocabulary from Chapter 1. They are not independent: reducing attack surface reduces the chance of compromise; trust boundaries are where controls go; blast radius is what is left over after a successful attack.

!!! mascot-tip "The Defender's Triple Question"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sentinel offering a tip">
    For any system you review, ask three questions: *Where is the attack surface?* *Where are the trust boundaries?* *What is the blast radius if any single component is compromised?* You can fit a real architectural review on a single page if you keep the answers crisp.

## 4. Assets and Security Requirements

Two more terms anchor the analytical side of the work. An **asset** is anything of value the system protects: data, code, computational capacity, reputation, regulatory standing, even attention. Assets are what threat actors are *after* — they explain why anyone bothers to attack. A clear asset inventory is a precondition for sensible threat modeling, because a threat that does not endanger any asset is not worth defending against.

A **security requirement** is a stated, testable property the system must provide to protect its assets. Security requirements should look like other engineering requirements — specific, measurable, and traceable to the business need they satisfy. *"The system shall log all authentication failures with timestamp, source IP, and claimed username, and retain logs for 90 days"* is a security requirement; *"the system shall be secure"* is a wish.

Good security requirements connect three layers in a chain: a *business need* (we must comply with HIPAA Section 164.312) drives a *security property* (audit logs of access to PHI) which drives a *technical requirement* (the application logs every read of patient records with user, timestamp, and patient ID). Each link in the chain must be traceable for the audit conversation to go well later.

| Layer | Example |
|-------|---------|
| Business need | "Comply with HIPAA Security Rule, Section 164.312" |
| Security property | "Audit access to protected health information" |
| Technical requirement | "Log every PHI-record read with user, time, record-ID, retain 6 years" |
| Test | "Unit test asserts log entry on each `getRecord()` call; quarterly retention review" |

## 5. Public Vulnerability Vocabulary — CVE and CVSS

When a vulnerability is discovered in widely used software, the security community needs a way to refer to it without ambiguity. Two standards do that work, and they show up everywhere.

**CVE** stands for *Common Vulnerabilities and Exposures*, a public catalog of disclosed vulnerabilities maintained by MITRE. Each entry receives a unique identifier of the form `CVE-YYYY-NNNNN` — for example, *CVE-2021-44228* (the famous Log4Shell vulnerability in Apache Log4j). A CVE entry includes a brief description, the affected products and versions, and references to advisories or patches. CVE identifiers let security teams, vendors, and tools refer to the same vulnerability without confusion across thousands of products and millions of systems.

**CVSS** stands for *Common Vulnerability Scoring System*, a standardized way to express the severity of a vulnerability as a number from 0.0 (none) to 10.0 (catastrophic). A CVSS score is computed from a vector string that describes attack characteristics — attack vector (network, adjacent network, local, physical), attack complexity (low, high), privileges required, user interaction, scope, and the impact on confidentiality, integrity, and availability. The current standard is CVSS v3.1, and CVSS v4.0 is being adopted as of the mid-2020s.

A CVSS score is a *base* score. Two additional layers — temporal (does an exploit exist? has a patch been released?) and environmental (is the affected system actually deployed in a critical role here?) — adjust the base score for the specific organization. A CVSS 9.8 vulnerability in software you do not run is not a 9.8 to *you*. This nuance is often lost in the rush to "patch all the criticals," which is why mature teams pair CVSS with their own asset inventory and exploit-availability data.

Before we look at the example below, two parameters worth pinning down: *Attack Vector* describes how the attacker reaches the vulnerability (the most dangerous value is "Network", meaning over the public internet); *Privileges Required* describes whether the attacker needs an account, and at what level. These two together explain most of the variation in real-world CVSS scores.

The CVSS v3.1 base score for the Log4Shell vulnerability looked roughly like this:

```
CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H

  AV:N  Attack Vector = Network (reachable over the internet)
  AC:L  Attack Complexity = Low (no special conditions)
  PR:N  Privileges Required = None (anonymous attacker)
  UI:N  User Interaction = None (no user click needed)
  S:C   Scope = Changed (compromise extends beyond the vulnerable component)
  C:H, I:H, A:H  All three impacts are High

  Computed base score: 10.0  (Critical)
```

The vector string is what you should learn to read; the score is just a summary. A vulnerability that requires local access, user interaction, and special configuration may be CVSS 7.0 in the abstract but practically irrelevant in your environment, while a CVSS 8.0 with `AV:N/PR:N/UI:N` is the kind that gets you paged at 2 a.m.

## 6. The Attacker's Vocabulary — TTPs, IOCs, IOAs, and Zero Days

When defenders study attackers, four terms do most of the work.

A **TTP** stands for *Tactics, Techniques, and Procedures*: the *tactics* an attacker pursues (their goals — credential access, lateral movement, exfiltration), the *techniques* they use to achieve those tactics (e.g., "credential dumping from LSASS memory"), and the *procedures* they execute (the specific tool, command, or sequence of steps). TTPs describe the *how* of an attack at increasing levels of detail. The MITRE ATT&CK framework, which we will see in detail in Chapter 15, is a public catalog of TTPs.

An **indicator of compromise** (IOC) is a piece of forensic evidence that a system has *already been compromised*. IOCs are typically concrete artifacts: a file hash, a malicious IP address, a registry key, a specific filename, a process name. Detecting an IOC means the breach has already happened — IOCs are *historical*.

An **indicator of attack** (IOA) is evidence that an attack is *currently in progress* — patterns of behavior that suggest an active intrusion regardless of whether any specific artifact is present. An IOA might be "a service account suddenly enumerating user accounts in Active Directory," "PowerShell launched by a Word document," or "outbound traffic to a country we never communicate with." IOAs are *behavioral* rather than artifact-based, and they are the foundation of modern detection engineering.

A **zero day** is a vulnerability that is being actively exploited *before* the vendor has issued a patch — the defender has had "zero days" to prepare a fix. Zero-day exploits are valuable on both legitimate and illegitimate markets (responsible-disclosure bug bounties, intelligence agencies, criminal marketplaces) and are the most dangerous class of vulnerability because traditional patch-management processes provide no protection until the vendor responds.

| Term | What it describes | Time horizon |
|------|-------------------|--------------|
| TTP | The attacker's *behaviors* | Across an entire campaign |
| IOC | An *artifact* left by an attacker | After the fact (forensic) |
| IOA | A *behavior pattern* of active attack | During the attack |
| Zero day | A vulnerability with no patch yet | The window before vendor response |

!!! mascot-warning "IOC-Only Detection Is A Footgun"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel showing caution">
    A defense built only on IOCs catches yesterday's attacks. Once attackers know which file hashes you alert on, they recompile the malware and the hash changes — the IOC is dead. Behavioral detection (IOAs) is more expensive to build but vastly more durable. The pattern, not the artifact, is what survives.

## 7. Kill Chains — Modeling The Attacker's Journey

Real attacks are not single events; they are sequences. **Kill chain** is the general term for any model that describes the stages an attacker progresses through from initial reconnaissance to final objective. Two kill-chain models dominate.

The **Cyber Kill Chain**, published by Lockheed Martin in 2011, breaks an intrusion into seven sequential phases: *Reconnaissance* (research the target), *Weaponization* (build the exploit + payload), *Delivery* (send it — phishing email, drive-by, USB), *Exploitation* (the vulnerability fires), *Installation* (persistent foothold installed), *Command and Control* (the attacker can now drive the foothold remotely), and *Actions on Objectives* (data exfiltration, lateral movement, ransomware deployment, whatever the actual goal was). The Cyber Kill Chain's value is that it gives defenders a vocabulary for *where* in the attack a particular control disrupts the attacker — a phishing-aware email gateway disrupts at *delivery*; an EDR agent disrupts at *exploitation* or *installation*; a network egress filter disrupts at *command and control*. Stop the chain at any phase and the attack fails.

The **Diamond Model**, also published in 2013, takes a different angle: it describes a single intrusion event as a four-vertex diamond consisting of *Adversary*, *Capability* (the exploit/tool), *Infrastructure* (the C2 servers, dropper sites), and *Victim*. Each pair of vertices has a meaningful relationship — *Adversary uses Capability*, *Capability targets Victim*, *Adversary owns Infrastructure*, *Infrastructure communicates with Victim*. The Diamond Model is excellent for *correlating* events across time — different victims attacked by the same adversary using the same infrastructure form a campaign. Where the Cyber Kill Chain models the *flow* of one attack, the Diamond Model models the *relationships* across many.

#### Diagram: Cyber Kill Chain Phases with Defensive Controls

<details markdown="1">
<summary>Seven-phase Cyber Kill Chain with control examples per phase</summary>
Type: workflow-diagram
**sim-id:** cyber-kill-chain-controls<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A horizontal flow with 7 boxes representing the kill chain phases:

1. **Reconnaissance** → controls: external attack surface management, domain monitoring
2. **Weaponization** → controls: threat intelligence, sandboxing, anti-exploit
3. **Delivery** → controls: email security, URL filtering, attachment scanning
4. **Exploitation** → controls: patching, EDR, application allowlisting
5. **Installation** → controls: EDR, file integrity monitoring, persistence detection
6. **Command and Control** → controls: egress filtering, DNS filtering, network detection
7. **Actions on Objectives** → controls: DLP, segmentation, anomaly detection

Each phase is a colored box (gradient from blue at left to red at right). Below each phase, a small list of 2-3 control examples appears. Arrows between phases imply progression. A "break the chain" callout sits above the flow, with a downward arrow into each phase, captioned: "Stop the chain at any phase and the attack fails."

Color: cybersecurity blue (#1565c0) shading deeper through the chain. Responsive: stacks vertically below 800px viewport with phase titles and bullet lists.

Implementation: Mermaid graph LR with styled subgraphs.
</details>

The two models are complementary — most mature security teams use both, the Cyber Kill Chain for individual-incident analysis and the Diamond Model for campaign tracking and threat-intel correlation.

!!! mascot-thinking "What 'Defense In Depth' Really Buys You"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    Each kill-chain phase is an opportunity to detect or block the attacker. A single perfect control at one phase is fragile; multiple imperfect controls at multiple phases force the attacker to defeat all of them in sequence. That is *defense in depth* applied to the time dimension, not just the space dimension.

## 8. Security Controls — The Defender's Toolkit

A **security control** is any safeguard or countermeasure deployed to reduce risk to an asset. Controls are the actual *things you build, buy, or write down* — they are the output of all the analysis we have built up so far. Every security program is, in effect, a portfolio of controls chosen and arranged against a threat model.

Controls are categorized along two independent axes, and the two axes are often combined into compound labels in real-world inventories.

### 8.1 By Function — What The Control Does

**Preventive controls** stop a threat from succeeding in the first place. Encryption prevents eavesdropping; authentication prevents impersonation; firewalls prevent unauthorized network access; input validation prevents injection. Preventive controls are what most people picture when they hear "security."

**Detective controls** identify that a threat *has* succeeded (or is in progress) so that response can begin. Intrusion detection systems detect attacks; SIEM correlation rules detect anomalies; audit logs detect after-the-fact misuse; security cameras detect physical intrusion. Detective controls assume that prevention is imperfect — and they are correct to assume that.

**Corrective controls** restore the system after a successful attack and limit ongoing damage. Backups restore data; incident-response runbooks restore service; patches close the vulnerability that allowed the breach. Corrective controls are how you recover, not how you avoid.

**Compensating controls** are alternative measures that achieve the spirit of a required control when the required control cannot be implemented as specified. If a regulation requires encryption at rest but a legacy database cannot be encrypted in place, a compensating control might be strict network segmentation plus continuous monitoring of the database server. Auditors accept compensating controls when they are documented, justified, and produce roughly equivalent risk reduction.

### 8.2 By Type — How The Control Is Implemented

**Administrative controls** are policies, procedures, and training — controls that operate through human behavior and organizational structure. Acceptable-use policies, background checks, security-awareness training, and segregation-of-duties rules are administrative. They are typically the cheapest controls to deploy and the hardest to make effective, because they depend on people doing what they are told.

**Technical controls** (sometimes *logical* controls) are implemented in hardware or software: firewalls, encryption, access-control lists, intrusion-detection systems, multi-factor authentication. Technical controls are the bread and butter of computing security and the focus of most of this textbook.

**Physical controls** are tangible barriers and monitors: locks, fences, badge readers, security cameras, guards, environmental sensors. Physical security is often forgotten by software-focused teams, but a server in an unlocked room with a USB port is no more secure than the building's front door.

#### Diagram: Security Control 3D Taxonomy

<details markdown="1">
<summary>Cube diagram showing the function × type taxonomy of security controls</summary>
Type: infographic-svg
**sim-id:** control-taxonomy-cube<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A 3×3 grid (or simplified 3D cube) where:
- Rows = Function: Preventive / Detective / Corrective / Compensating (4 rows)
- Columns = Type: Administrative / Technical / Physical (3 columns)

Each of the 12 cells contains a 1-2 example controls. Examples:
- Preventive × Administrative: "Acceptable use policy", "Security training"
- Preventive × Technical: "Firewall", "Encryption at rest", "MFA"
- Preventive × Physical: "Door locks", "Badge access"
- Detective × Administrative: "Periodic audit", "User behavior reviews"
- Detective × Technical: "IDS", "SIEM correlation rules", "Audit logs"
- Detective × Physical: "Security cameras", "Motion sensors"
- Corrective × Administrative: "Incident response plan", "Disaster recovery procedures"
- Corrective × Technical: "Backups", "Patches", "Endpoint quarantine"
- Corrective × Physical: "Replacement hardware", "Fire suppression"
- Compensating × Administrative: "Manual review when automation is unavailable"
- Compensating × Technical: "Strict segmentation when in-place encryption is impossible"
- Compensating × Physical: "Locked cage when full datacenter access control is unavailable"

Cell coloring: each function gets a color (preventive=blue, detective=green, corrective=amber, compensating=slate). Hover tooltips reveal more examples per cell. Legend below explains colors.

Color: cybersecurity blue #1565c0 for preventive, green #4caf50 for detective, amber #ffa000 for corrective, slate #455a64 for compensating. Responsive: rows stack to vertical list below 700px.

Implementation: Static SVG grid with `<title>` tooltips per cell.
</details>

Mature security teams maintain an inventory of every control they operate, tagged with both the function (preventive/detective/corrective/compensating) and the type (administrative/technical/physical). The inventory is what allows leadership to answer questions like "what is the ratio of preventive to detective spend?" or "are we over-invested in technical controls and under-invested in administrative ones?"

!!! mascot-tip "The Healthiest Programs Are Mixed"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sentinel offering a tip">
    Programs that lean entirely on prevention discover too late that prevention sometimes fails. Programs that lean entirely on detection discover too late that nothing was preventing the attack. The healthiest portfolios mix prevention, detection, and correction — and balance technical controls with the administrative and physical ones that make them work in practice.

## 9. Putting The Vocabulary Together

To anchor everything in this chapter, consider a single sentence written in the professional vocabulary you have just learned, and notice how dense it now is:

> *"The recently disclosed CVE-2024-XXXXX is a remote-code-execution vulnerability (CVSS 9.8, AV:N/AC:L/PR:N/UI:N) in the public-facing API of our customer portal — directly on the internet attack surface and across our outermost trust boundary. Threat intelligence indicates a financially motivated cybercriminal group is using a public exploit and the IOAs include outbound traffic to known C2 infrastructure. We are deploying a vendor patch (preventive technical control) within 24 hours, monitoring for the published IOCs (detective technical control), and updating our incident-response runbook (corrective administrative control) for any system that shows the IOAs before patching completes."*

A reader new to security would parse that paragraph as opaque jargon. You can now read it cleanly: vulnerability, severity (with vector breakdown), where it sits in the system (attack surface, trust boundary), who the threat actor is, what the indicators look like, and exactly which controls are being deployed — categorized by function and type. The whole chapter, expressed in three sentences.

!!! mascot-celebration "What You Can Now Do"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sentinel celebrating">
    You can now read security advisories, incident reports, and vendor write-ups in their native language. You can describe a system's attack surface and trust boundaries, reason about blast radius, score and contextualize a CVSS finding, decompose an attack into kill-chain phases, and classify any proposed control along both function and type axes. The vocabulary is the foundation; cryptography is next, because you cannot reason about confidentiality and integrity controls until you understand the primitives that build them.

## Key Takeaways

- **Threat → Vulnerability → Exploit → Risk** is the core sequence. Get the words right and the analysis follows.
- **Threat actors** range from script kiddies to nation-states; defenses must be sized to *likely* actors, not all possible actors.
- **Attack surface, trust boundary, blast radius** are the spatial vocabulary of defense — *where* attacks happen and how far they spread.
- **CVE** identifies a vulnerability; **CVSS** scores its severity. Read the vector, not just the number.
- **TTP / IOC / IOA / zero day** describe attacker behavior at different time horizons; behavioral detection (IOAs) is more durable than artifact-based (IOCs).
- **Kill chains** (Cyber Kill Chain, Diamond Model) model attacker progression and let defenders place controls at multiple phases.
- **Security controls** are categorized by *function* (preventive / detective / corrective / compensating) and *type* (administrative / technical / physical). Healthy programs mix both axes.

Next chapter: cryptographic primitives — the building blocks that make most of the technical preventive controls in this chapter actually work.
