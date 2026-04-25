---
title: "Offensive and Defensive Security Operations"
description: "Operational security practice: penetration testing, red/blue/purple teaming, MITRE ATT&CK, threat intelligence, threat hunting, vulnerability management, the PICERL incident-response lifecycle, malware analysis, adversary techniques, runbooks, tabletop exercises, and detection engineering."
generated_by: claude skill chapter-content-generator
date: 2026-04-25 11:21:14
version: 0.07
---

# Offensive and Defensive Security Operations

## Summary

Brings together the operational practice of security: penetration testing, red/blue/purple teaming, the MITRE ATT&CK framework, threat intelligence and OSINT, threat hunting, vulnerability management and scanning, the PICERL incident-response lifecycle, malware analysis, adversary techniques (privilege escalation, lateral movement, command and control, exfiltration, persistence), bug bounties, capture-the-flag, runbooks, tabletop exercises, and detection engineering.

## Concepts Covered

This chapter covers the following 30 concepts from the learning graph:

1. Penetration Testing
2. Red Team
3. Blue Team
4. Purple Team
5. MITRE ATT&CK
6. Threat Intelligence
7. OSINT
8. Threat Hunting
9. Vulnerability Management
10. Vulnerability Scanning
11. Incident Response
12. PICERL Lifecycle
13. Incident Preparation
14. Incident Identification
15. Incident Containment
16. Incident Eradication
17. Incident Recovery
18. Lessons Learned
19. Malware Analysis
20. Privilege Escalation
21. Lateral Movement
22. Command and Control
23. Data Exfiltration
24. Persistence Mechanism
25. Bug Bounty Program
26. Capture the Flag
27. Incident Response Plan
28. Runbook
29. Tabletop Exercise
30. Detection Engineering

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Security Foundations: Properties, Mindset, and Risk](../01-security-foundations/index.md)
- [Chapter 2: Threats, Vulnerabilities, and Security Controls](../02-threats-and-controls/index.md)
- [Chapter 6: Software Assurance and Supply Chain Security](../06-software-assurance/index.md)
- [Chapter 8: Network Security Foundations: Protocols, Firewalls, and Detection](../08-network-foundations/index.md)
- [Chapter 9: Advanced Network Defense: Wireless, DNS, and Zero Trust](../09-advanced-network-defense/index.md)
- [Chapter 11: Cloud Security and Operations Monitoring](../11-cloud-and-ops-monitoring/index.md)
- [Chapter 13: Organizational Security: Governance, Risk, and Compliance](../13-organizational-security/index.md)
- [Chapter 14: Societal Security: Law, Forensics, and Ethics](../14-societal-security/index.md)

---

!!! mascot-welcome "Welcome to the Operations Floor"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    Welcome. Earlier chapters built the controls; this chapter is where they meet a thinking adversary. We will work through the rhythm of an operational security team — find the gaps before attackers do, watch the network for the ones that slipped through, and respond when something gets in. Trust, but verify.

## 1. From Controls to Operations

Most of this textbook has been about controls — the cryptographic primitives, network defenses, secure coding practices, identity systems, and governance frameworks that, in principle, keep an organization safe. **Security operations** is the discipline of running those controls in the real world against adversaries who get to pick the time, target, and technique. The controls are necessary but not sufficient. An organization with strong controls and weak operations is a fortress with no guards on the wall.

Operational security work splits into three intertwined activities. *Offensive* work simulates adversaries to find weaknesses before real ones do. *Defensive* work watches the running environment for evidence of attack and stops it. *Response* work takes over when prevention has already failed, contains the damage, and rebuilds trust in the system. The same organization needs all three, and the three teams must learn from each other or none of them will improve.

This chapter is heavier on practice than theory. The frameworks here — MITRE ATT&CK, the PICERL lifecycle, the cyber kill chain — are useful precisely because they let practitioners speak a common language across organizations. A junior analyst at a regional bank and a senior responder at a cloud provider can both say "we observed T1059 followed by T1078 and we contained at the lateral-movement stage" and mean the same thing. Frameworks are scaffolding for operational reasoning.

The diagram below previews the major activities we will cover, grouped by their place in the offensive/defensive/response triangle.

#### Diagram: Security Operations Activity Map

<details markdown="1">
<summary>Triangle showing offensive, defensive, and response activities and how they feed each other</summary>
Type: diagram
**sim-id:** secops-activity-map<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A triangle layout with three major nodes at each vertex:

- **Offensive (top, cybersecurity blue #1565c0):** Penetration Testing, Red Team, Bug Bounty, Capture the Flag, Threat Modeling
- **Defensive (bottom-left, slate steel #455a64):** Blue Team, SOC Monitoring, Threat Hunting, Vulnerability Management, Detection Engineering
- **Response (bottom-right, alert accent #ffa000):** Incident Response, PICERL, Forensics, Malware Analysis, Lessons Learned

Three connecting flows:

1. Offensive → Defensive: "Findings improve detections"
2. Defensive → Response: "Alerts trigger investigations"
3. Response → Offensive: "Lessons drive next exercise"

A central node labeled **Purple Team** sits in the middle, connected to all three vertices, representing the integrative practice.

Around the outside, a thin arc labeled **Threat Intelligence** feeds all three vertices, indicating intel is consumed by all functions.

Color palette: cybersecurity blue (#1565c0), slate steel (#455a64), alert accent (#ffa000). Background: white. Responsive: stacks vertically below 700px viewport.

Implementation: Mermaid graph TD with custom node styling and color coding.
</details>

## 2. Offensive Security: Adversary Simulation

Offensive security is the practice of attacking systems with permission, in order to find and document weaknesses before unauthorized adversaries do. The work is bounded by a written *rules of engagement* document that defines scope (which assets), time (which window), techniques (allowed and forbidden), and reporting (who learns what, when). Without that document, the same actions are crimes under the Computer Fraud and Abuse Act and equivalent laws in other jurisdictions, as Chapter 14 covered.

### 2.1 Penetration Testing

**Penetration testing** (often shortened to *pentesting*) is a time-boxed, scoped engagement in which a tester attempts to compromise specified targets using techniques a real attacker might use, then writes a report documenting what was found, how it was exploited, and how to fix it. A typical engagement runs two to six weeks and produces a remediation-focused report graded by severity.

Pentests are usually classified by the level of prior knowledge given to the tester:

- **Black-box** — the tester has no internal knowledge; they start with only what an external attacker would know (a domain name, an IP range). This simulates an outsider attack but is slow and may miss bugs that are deep inside the application.
- **Gray-box** — the tester has limited insider information (a low-privileged user account, architectural overview). This simulates a compromised account or insider with reduced privilege, and balances coverage against realism.
- **White-box** — the tester has full access to source code, architecture diagrams, and credentials. This is the most efficient path to deep findings but does not simulate any realistic adversary.

Most mature organizations run a mix. Black-box tests once a year for a realistic outside view; white-box tests for new components where deep coverage matters more than realism; gray-box tests for production applications.

### 2.2 Red Teams, Blue Teams, and Purple Teams

A **red team** is an internal or contracted offensive team whose job is to emulate a specific adversary's *full campaign* against the organization, end-to-end, often over months. Unlike a pentest, a red team engagement is goal-oriented ("exfiltrate the customer database without detection") rather than coverage-oriented ("find all bugs in this application"), and its success criterion is whether it achieved the goal without being caught.

A **blue team** is the defensive operations team — the analysts watching the SIEM, the engineers tuning detections, the responders on call. Their job is to detect the red team (and real attackers) as early in the kill chain as possible, contain the activity, and learn from what they missed.

A **purple team** is not a separate organization in most companies; it is a *practice* in which red and blue work together in the same room, in real time. The red team performs a technique (say, a Kerberoasting attack against Active Directory). The blue team checks whether their detections fired. If not, they add a detection rule, re-run the technique, and confirm the alert. Purple teaming compresses the feedback loop from "we got beat in the report" to "we caught it on the second try, today."

The table below summarizes the differences. Note that this table reinforces concepts the prose has already introduced — it is a comparison, not an introduction.

| Practice | Time scale | Goal | Success criterion | Output |
|----------|-----------|------|-------------------|--------|
| Penetration test | 2–6 weeks | Find bugs in scoped target | Coverage of attack surface | Findings report |
| Red team | 1–6 months | Emulate a specific threat actor | Achieve objective stealthily | Campaign narrative + lessons |
| Blue team | Continuous | Detect and respond to attacks | Time-to-detect, time-to-contain | Detection rules + IR reports |
| Purple team | Hours to days | Close detection gaps | Detection coverage of TTPs | New / improved detections |

### 2.3 Bug Bounty Programs and Capture the Flag

Penetration tests and red teams cost money and produce findings on a calendar. A **bug bounty program** flips the economics: the organization publishes a scope and a price list, and any independent researcher who finds a qualifying vulnerability submits it for a reward. Programs run on platforms like HackerOne, Bugcrowd, and Intigriti, or directly through the organization's own security page.

Bug bounties are not a substitute for internal security work. They are a *long tail* — the program will turn up a steady trickle of findings that no one on staff would have time to look for, including bugs in third-party libraries the organization uses. The downside is signal-to-noise: a public program will receive many low-quality submissions ("your site doesn't have header X" reports that don't represent real risk), and triaging those takes a real budget of analyst time.

**Capture the Flag (CTF)** competitions are the educational and recruiting cousin of offensive security work. Participants solve technical challenges — exploit a deliberately vulnerable web app, reverse a binary, decrypt a ciphertext — and submit a "flag" string for points. Two formats dominate: *Jeopardy-style* (independent challenges across categories) and *attack-defense* (each team gets a vulnerable network and must patch their own while attacking others'). For students, CTFs are how a great many practitioners learn the field; for employers, they are an interview signal that scales better than asking people to do live work in the interview room.

!!! mascot-thinking "The Asymmetry"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel reflecting">
    Notice the asymmetry: the defender must cover every path; the attacker only needs one. Offensive exercises exist not because adversaries are smarter, but because finding one missing brick is easier than auditing the whole wall. Plan accordingly.

## 3. The MITRE ATT&CK Framework

Once you have a red team, a blue team, and a backlog of findings, you need a shared vocabulary for what the attackers actually *did*. **MITRE ATT&CK** (Adversarial Tactics, Techniques, and Common Knowledge) is the open framework that has become that vocabulary across the industry.

ATT&CK organizes adversary behavior into a matrix. The columns are **tactics** — the *why* of an action, the attacker's high-level goal at each stage. The rows within each column are **techniques** — the *how*, the specific methods used to achieve that tactic. Each technique has a stable identifier (e.g., `T1059` for Command and Scripting Interpreter), a description, common detection ideas, and references to real-world threat actors observed using it.

The standard tactic columns, in roughly the order an attacker uses them, are:

1. **Reconnaissance** — gathering information about the target before contact
2. **Resource Development** — preparing infrastructure (domains, certificates, malware)
3. **Initial Access** — getting a first foothold (phishing, exploit, valid account)
4. **Execution** — running attacker code on a system
5. **Persistence** — surviving reboot, password change, and reinstall
6. **Privilege Escalation** — going from low to high privilege locally
7. **Defense Evasion** — avoiding detection by security tools
8. **Credential Access** — stealing passwords, hashes, tokens
9. **Discovery** — mapping the internal environment
10. **Lateral Movement** — moving from compromised host to other hosts
11. **Collection** — gathering target data
12. **Command and Control** — communicating with attacker infrastructure
13. **Exfiltration** — getting data out
14. **Impact** — destroying, encrypting, or otherwise harming the environment

A real attack campaign is rarely a single technique; it is a *sequence* of techniques across several tactics, and the value of ATT&CK is that defenders can describe an attack as "T1566 → T1059 → T1078 → T1003 → T1021" and other defenders will understand exactly what happened and where to look in their own logs.

#### Diagram: MITRE ATT&CK Tactic Sequence Explorer

<details markdown="1">
<summary>Interactive sequence showing how attacker techniques chain across tactics</summary>
Type: microsim
**sim-id:** attack-tactic-sequence<br/>
**Library:** p5.js<br/>
**Status:** Specified

An interactive p5.js MicroSim that visualizes how an attack progresses across MITRE ATT&CK tactics.

**Learning objective (Bloom's: Analyzing):** Students will analyze how individual techniques chain into a complete campaign by stepping through preset scenarios and identifying which tactic each technique belongs to.

**Layout:**

- Canvas: 900 × 520, responsive (uses `updateCanvasSize()` first in setup).
- Top: 14 tactic columns rendered as labeled vertical bars (Reconnaissance through Impact). Each column header shows the tactic name in slate steel #455a64.
- Center: animated timeline with attacker techniques represented as cybersecurity-blue (#1565c0) circles; each circle is positioned in the column of its tactic.
- Bottom: scenario selector dropdown and step controls.

**Controls:**

- `createSelect()` for "Scenario": options are "Phishing → Ransomware", "Supply Chain Compromise (SolarWinds-style)", "Web App SQLi → Data Theft", "Insider Credential Abuse"
- `createButton("Step Forward")` advances one technique
- `createButton("Step Back")` rewinds one technique
- `createButton("Play All")` auto-advances at 1.5s/step
- `createButton("Reset")` returns to start
- `createSlider(0.5, 3.0, 1.5, 0.1)` for play speed (label: "Speed (s/step)")

**Behavior:**

- Each step adds the next technique circle in its appropriate tactic column with an animated arrow from the previous one.
- Clicking a technique circle pops up a tooltip with the technique ID, name (e.g., "T1566 — Phishing"), short description, and one defender-side detection idea.
- An "alert accent" #ffa000 highlight pulses on the *first* technique that a typical SOC would have detected, prompting students to reason about earliest detection point.
- Below the timeline: a running text strip showing "Cumulative attacker progress: <% of campaign>".

**Default scenario:** "Phishing → Ransomware" pre-loaded.

**Responsive design:** Canvas reflows to container width. On widths below 700px, tactic column labels rotate 45° to fit.

Implementation: p5.js with a JSON data file containing each scenario's technique sequence and metadata. `canvas.parent(document.querySelector('main'));`
</details>

ATT&CK is descriptive, not prescriptive. It catalogs what attackers *have done*, drawn from real incident reports and threat intelligence; it does not rank techniques by importance or claim to be exhaustive. New techniques are added regularly, and old ones are deprecated when better names appear. The framework is most useful when paired with two practices: **detection coverage mapping** (which ATT&CK techniques can your SOC currently detect?) and **threat-actor mapping** (which techniques does the adversary you most worry about actually use?).

## 4. Threat Intelligence and OSINT

A defender who watches every alert from every system equally will drown in noise. **Threat intelligence** is the discipline of collecting, analyzing, and applying information about threats so that defensive effort focuses where it matters. Useful intelligence answers concrete questions: *Which adversaries target organizations like ours? What infrastructure are they currently using? Which vulnerabilities are being exploited in the wild this week?*

Intelligence is usually classified by abstraction level:

- **Strategic** — long-horizon trends and adversary motivations, consumed by executives and risk committees
- **Operational** — specific campaigns and the TTPs (tactics, techniques, procedures) being used right now
- **Tactical** — the technical patterns to look for in logs (file hashes, registry keys, command-line strings)
- **Technical (Indicators of Compromise / IOCs)** — concrete observables: IP addresses, domains, hashes, certificates

The value of an indicator decays quickly. A malicious IP address used in an attack last month may be reused, but is more often discarded; a malware hash will match only one specific build. The TTP-level intelligence above the IOCs ages much more slowly — adversaries change infrastructure frequently but change their *methods* slowly. This is the basis of David Bianco's **Pyramid of Pain**: detecting an attacker by their TTPs causes them more difficulty than detecting them by their hash.

#### Diagram: The Pyramid of Pain

<details markdown="1">
<summary>Pyramid showing increasing attacker pain from hash detection to TTP detection</summary>
Type: infographic
**sim-id:** pyramid-of-pain<br/>
**Library:** p5.js<br/>
**Status:** Specified

An interactive infographic showing David Bianco's Pyramid of Pain.

**Learning objective (Bloom's: Understanding):** Students will explain why detecting attackers at higher levels of the pyramid imposes more cost on the adversary than detecting them at lower levels.

**Layout:**

- Canvas: 700 × 520, responsive.
- A 6-level pyramid, narrowest at top, widest at bottom:
  1. **Top — TTPs (cybersecurity blue #1565c0):** "Tough!" Adversary must change methodology
  2. **Tools (slate steel #455a64):** "Challenging" Adversary must rebuild capability
  3. **Network/Host Artifacts (medium blue):** "Annoying" Adversary must change tradecraft
  4. **Domain Names (light slate):** "Simple" Adversary must register new domains
  5. **IP Addresses (light gray):** "Easy" Attacker rotates infrastructure
  6. **Bottom — Hash Values (palest gray):** "Trivial" Attacker rebuilds with one byte changed

**Behavior:**

- Hovering each level expands a tooltip in cream (#fff8e1) explaining what an indicator at that level is, what detecting it forces the adversary to do, and one example.
- Clicking each level reveals a sample SIEM detection rule for that level (e.g., for TTPs: a behavioral rule, "process spawning powershell.exe with -enc base64 flag").
- A radio control toggles between "Defender view" (shows detection ideas) and "Attacker view" (shows what evading detection at that level costs the adversary).

**Responsive design:** Canvas reflows; on narrow screens the labels move below the pyramid layers as a stacked legend.

Implementation: p5.js with hover detection on layer regions. `canvas.parent(document.querySelector('main'));`
</details>

**Open-Source Intelligence (OSINT)** is the subset of intelligence collected from publicly available sources — search engines, social media, WHOIS records, certificate transparency logs, code repositories, leaked credential dumps, and so on. OSINT serves both attackers (reconnaissance against a target) and defenders (understanding what an attacker can already learn about the organization). A defensive OSINT review is now standard before any new system goes live: search for credentials, secrets, internal hostnames, and architecture details that may have leaked into public GitHub repositories or developer Q&A sites.

## 5. Vulnerability Management and Threat Hunting

### 5.1 Vulnerability Management

**Vulnerability management** is the continuous process of finding, prioritizing, fixing, and verifying weaknesses across the organization's systems. It differs from a one-shot pentest in that it is a *program*, not an event: a cycle that runs forever and measures itself by metrics like mean time to remediate (MTTR), patch coverage, and percentage of critical vulnerabilities remediated within the policy window.

The standard cycle has five steps:

1. **Discover** — find all assets in scope (endpoints, servers, containers, cloud workloads, network devices)
2. **Scan** — run **vulnerability scanning** tools against the assets to identify known vulnerabilities by version comparison
3. **Prioritize** — rank by exploitability, exposure, and asset criticality
4. **Remediate** — patch, reconfigure, or compensate
5. **Verify** — re-scan to confirm the fix landed

**Vulnerability scanning** tools (Nessus, Qualys, OpenVAS, Tenable.io, cloud-native scanners) compare the versions of installed software against a database of known CVEs and report any matches. Scanners are inexpensive and produce huge lists, which is exactly the problem: a typical mid-sized organization will have tens of thousands of findings open at any moment, and most cannot be exploited from where the attacker would actually stand.

Prioritization is what separates a useful program from a noise generator. CVSS scores alone are a poor prioritization signal because they describe theoretical severity, not exploitability in your environment. Modern programs combine CVSS with three other inputs:

- **Exploit availability** — is there a public exploit, in Metasploit or as a standalone tool?
- **Active exploitation** — is the CVE on CISA's Known Exploited Vulnerabilities (KEV) catalog, meaning attackers are using it *right now*?
- **Exposure and reachability** — is the affected system actually reachable from where the attacker can stand (internet-facing, lateral movement away)?

EPSS (Exploit Prediction Scoring System) is the current best-of-class third-party signal for the second item: a probability that a CVE will be exploited in the wild in the next 30 days, updated daily.

!!! mascot-tip "Patch What's Reachable First"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sentinel offering practical advice">
    In production, prioritize a CVSS-7 vulnerability on an internet-facing host above a CVSS-9 vulnerability on an isolated internal box. Reachability and exploit availability beat raw severity score every time. Least privilege, by default — and least exposure first.

### 5.2 Threat Hunting

Vulnerability management asks "where could we be hit?" **Threat hunting** asks "have we already been hit, and is the SIEM just not seeing it?" A threat hunter starts from a *hypothesis* — typically informed by threat intelligence — and goes looking through logs, telemetry, and host data for evidence that the hypothesis is true.

A typical hunt looks like this:

1. **Form a hypothesis** — "If APT-X has gained a foothold here, we'd see PowerShell with `-EncodedCommand` running from non-admin accounts during business hours."
2. **Define the data sources** — endpoint process logs, PowerShell module logs, Sysmon events
3. **Query and analyze** — run searches, look at outliers, follow up on suspicious results
4. **Triage outcomes** — confirmed incident → escalate to IR; false positive → document the why; *gap* → if the hypothesis cannot even be tested with current data, that is a logging deficiency to fix
5. **Convert to detection** — if the hunt found something worth catching, write a detection rule so it triggers automatically next time

The crucial output of threat hunting is not "we caught an attacker today" — most hunts find nothing — it is *durable detections*. A hunt that found nothing but identified a logging gap, or produced a new high-fidelity detection rule, has paid for itself.

## 6. Detection Engineering

**Detection engineering** is the discipline of designing, implementing, and maintaining the rules and analytics that make alerts fire. It treats detections as software: written in a query language, version-controlled in Git, tested with sample data, deployed through CI/CD, and measured by quality metrics rather than gut feeling.

A useful detection has three properties:

- **Sensitivity** — does it fire on the actual attacker behavior?
- **Specificity** — does it *not* fire on benign behavior that looks similar?
- **Maintainability** — can the next analyst understand why it exists, what it covers, and how to tune it?

The trade-off between sensitivity and specificity is the central engineering problem. A rule that alerts on "any PowerShell execution" is highly sensitive but useless — every Windows admin uses PowerShell. A rule that alerts only on a specific malware hash is highly specific but trivially evaded. Detection engineers learn to write rules that exploit *behavioral* signals (process lineage, command-line entropy, unusual time-of-day, unusual host-pair communication) where attackers cannot trivially blend in.

The standard toolkit and language ecosystem includes:

| Tool / language | Purpose | Where it runs |
|-----------------|---------|---------------|
| Sigma | Vendor-neutral detection rule format | Translates to Splunk, Elastic, Sentinel queries |
| YARA | Pattern matching on file content | Endpoint, mail gateways, sandboxes |
| Snort / Suricata rules | Network signature matching | IDS / IPS sensors |
| KQL (Kusto Query Language) | Detections in Microsoft Sentinel / Defender | Cloud SIEM |
| SPL (Splunk Search Processing Language) | Detections in Splunk | Splunk SIEM |
| EQL (Event Query Language) | Sequence-based detections | Elastic Security |

A modern detection engineering practice maintains a **detection coverage map** — typically rendered as an ATT&CK matrix colored by which techniques have at least one high-fidelity detection — and uses it to drive backlog priorities. Coverage gaps that overlap with the techniques used by the organization's most relevant threat actors get fixed first.

!!! mascot-warning "Don't Let Mocked Tests Be Your Only Validation"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel cautioning">
    A detection that passes its unit test against synthetic events but never fires on real attacker behavior is a control that fails open. Validate every rule against real (or red-team-generated) telemetry before counting it as coverage. If a detection has never alerted, you do not know whether it works.

## 7. The Incident Response Lifecycle (PICERL)

Even with strong prevention and good detection, incidents happen. **Incident response** is the structured process of handling a confirmed or suspected security incident from first signal through full recovery and learning. The dominant model is the **PICERL lifecycle**, codified in NIST SP 800-61 and adopted across the industry:

- **P**reparation
- **I**dentification
- **C**ontainment
- **E**radication
- **R**ecovery
- **L**essons Learned

The phases are pedagogically sequential but operationally overlapping — a complex incident may have one team eradicating on host A while another is still identifying scope on host B. The discipline is in not skipping phases, especially the unglamorous bookends (Preparation and Lessons Learned) that pay back across every future incident.

#### Diagram: The PICERL Lifecycle

<details markdown="1">
<summary>Cyclical diagram of the six-phase incident response lifecycle</summary>
Type: workflow-diagram
**sim-id:** picerl-lifecycle<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A circular workflow diagram showing the six PICERL phases as a closed loop, with Lessons Learned feeding back into Preparation.

**Layout:**

Six rounded boxes arranged in a clockwise circle:

1. **Preparation** (top, cybersecurity blue #1565c0) — "Plans, runbooks, training, tooling"
2. **Identification** (top-right, slate steel #455a64) — "Detect, triage, declare"
3. **Containment** (bottom-right, alert accent #ffa000) — "Short-term and long-term containment"
4. **Eradication** (bottom, slate steel) — "Remove attacker access and artifacts"
5. **Recovery** (bottom-left, slate steel) — "Restore services, monitor closely"
6. **Lessons Learned** (top-left, cybersecurity blue) — "Post-incident review, durable improvements"

Arrows form a clockwise cycle. A dashed arrow returns from Lessons Learned to Preparation, emphasizing the feedback loop.

A clock-face annotation around the outside indicates relative time on each phase ("hours" for Identification, "minutes-hours" for Containment, "days" for Eradication, "weeks" for Recovery, "weeks after" for Lessons Learned).

Color: cybersecurity blue (#1565c0), slate steel (#455a64), alert accent (#ffa000) used for the time-critical phase. Background white. Responsive: stacks vertically below 700px.

Implementation: Mermaid graph LR or custom SVG with circular layout.
</details>

### 7.1 Preparation

**Incident preparation** is the work done *before* anything happens, and it is the single highest-leverage phase. Preparation includes:

- Writing the **incident response plan** — a document approved by leadership that names the IR team, defines roles, sets escalation paths, lists communication channels (and *out-of-band* channels for when normal email is compromised), and references the legal and regulatory notification obligations from Chapter 14
- Building **runbooks** for common incident classes (ransomware, business email compromise, web shell, data exfiltration)
- Provisioning IR tooling (forensic acquisition, network blocking authority, log retention)
- Running **tabletop exercises** to rehearse the plan
- Establishing relationships with external parties — outside counsel, IR retainer firm, FBI/Secret Service field office, cyber insurance carrier — *before* you need them at 2 AM

A **runbook** is a step-by-step procedure for responding to a specific class of incident. Good runbooks specify *who decides*, *who acts*, and *what evidence to preserve* at each step. They are written for someone tired and stressed at 3 AM, not for a calm reviewer at a desk. They are also living documents — every real incident reveals at least one thing the runbook said wrong.

A **tabletop exercise** is a discussion-based simulation in which the IR team and stakeholders work through a hypothetical scenario without touching production systems. A facilitator narrates the scenario ("a ransomware note appears on twelve workstations"), injects developments ("the CFO's laptop is among them"), and watches how the team responds. Tabletops surface gaps in the plan — missing decision authority, unclear ownership, untested tools — far cheaper than a real incident does. They are required by many compliance frameworks, but the value of a *good* tabletop comes from honest engagement with realistic scenarios, not from checking the compliance box.

!!! mascot-encourage "The First Tabletop Is the Hardest"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Sentinel offering reassurance">
    The first tabletop exercise an organization runs is often awkward — gaps everywhere, unclear authority, half-written runbooks. That is normal, and that is the entire point. The discomfort during a tabletop is the discomfort you wanted to feel before the real thing. Each rehearsal makes the next one calmer.

### 7.2 Identification

**Incident identification** turns a signal into a declared incident. The signal might come from a SIEM alert, a user report, a third party (your bank calling about strange wires), or a threat hunt. The IR team triages: is this real, what is its scope, and is it serious enough to declare? A *declared incident* triggers the full IR process — a dedicated bridge, evidence preservation, notification clocks running.

Two questions dominate this phase. First, what are the **indicators of compromise (IOCs)** — the specific observables that confirm and bound the incident (a malicious file hash, an attacker IP, a compromised account)? Second, what is the **scope** — how many hosts, accounts, data records are affected? Scope estimates often grow during the response; a hallmark of mature teams is communicating the *uncertainty* in scope rather than committing too early to a number that may be wrong by an order of magnitude.

### 7.3 Containment

**Incident containment** stops the bleeding without destroying the evidence needed for eradication and prosecution. Containment splits into two phases:

- **Short-term containment** — fast actions to limit damage, often with imperfect information: isolate hosts at the network layer, disable accounts, block IPs at the firewall, revoke session tokens
- **Long-term containment** — once the scope is understood, deploy more durable measures: network segmentation, hardened replacements, full credential rotation across affected trust boundaries

The classic containment dilemma is whether to **immediately yank the network cable** of a compromised host or **leave it running while you observe**. Yanking cuts off the attacker but tips them off; observing preserves visibility but risks more damage. The right answer depends on what the attacker is doing: if data is actively exfiltrating, contain now; if the attacker is dormant and you need to understand their full footprint before acting, watch carefully under tight legal guidance.

### 7.4 Eradication, Recovery, and Lessons Learned

**Incident eradication** removes the attacker's access and artifacts: malware, web shells, scheduled tasks, persistence keys, attacker-created accounts, modified system binaries. The temptation to declare eradication done after one round is dangerous. Sophisticated attackers plant *multiple* persistence mechanisms; if you remove one and miss the others, they will come back through the spare door three days later. Eradication is finished when an honest threat hunt across the affected environment finds nothing.

**Incident recovery** restores normal operations. Hosts come back from clean backups or are rebuilt from gold images; services come back online in stages; monitoring on the affected systems is set tighter than baseline for some weeks afterward. A common mistake is to recover and then *quietly* return to baseline monitoring — the exact moment the attacker counts on, if they have any reentry path you missed.

**Lessons learned** is the post-incident review, and it is the phase most often skipped or done badly. A useful post-incident review names what happened *blamelessly*, identifies the *systemic* causes (not just the proximate cause), and produces a small number of *durable* improvements that go on someone's actual roadmap with a date. A review that produces fifty-two action items will produce zero outcomes; a review that produces three real ones changes the organization. The output should also feed back into runbooks and detection engineering, so the next incident of this class costs less.

The table summarizes typical artifacts produced at each PICERL phase. Note this table organizes prose we have already explained — it does not introduce new concepts.

| Phase | Time scale | Key activities | Artifacts |
|-------|-----------|----------------|-----------|
| Preparation | Continuous | IR plan, runbooks, tabletops, tooling | IR plan, runbook library, exercise reports |
| Identification | Minutes to hours | Triage, declaration, IOC capture | Incident ticket, IOC list, scope estimate |
| Containment | Minutes to days | Isolate, disable, block | Containment log, evidence images |
| Eradication | Days to weeks | Remove attacker access and artifacts | Eradication checklist, hunt results |
| Recovery | Days to weeks | Rebuild, restore, monitor | Restoration plan, validation results |
| Lessons Learned | Weeks after | Post-incident review | PIR document, improvement backlog |

## 8. Adversary Techniques in Depth

To respond to attacks intelligently, defenders must understand the small repertoire of moves attackers use *inside* a compromised environment. The PICERL phases are the defender's structure; the techniques in this section are what the attacker is doing during your Identification, Containment, and Eradication.

### 8.1 Privilege Escalation

**Privilege escalation** is the act of moving from a low-privileged context (a normal user, a service account, a container) to a higher-privileged one (administrator, root, domain admin) on the same host or within the same trust boundary. It splits into:

- **Vertical escalation** — going from user to admin on the same host (kernel exploit, misconfigured `sudo`, weak service permissions)
- **Horizontal escalation** — moving sideways into another account at a similar privilege level whose access happens to include something the attacker wants

Vertical escalation often exploits a small, well-known set of conditions: a setuid binary that calls a user-controlled program, a service running as SYSTEM with a writable executable path, a token-impersonation primitive in Windows, or a kernel CVE for which a public exploit exists. Defending against privilege escalation is one of the highest-leverage hardening activities — it forces the attacker to convert a small foothold into a useful one, and a good defender can make that conversion expensive or impossible.

### 8.2 Lateral Movement

**Lateral movement** is the act of reaching from one compromised host to another inside the environment. The attacker has some access; they want *more* access — to the file server, to the domain controller, to the database holding the prize. Lateral movement techniques include:

- **Pass-the-hash / pass-the-ticket** — reusing stolen credential material against other hosts in the same Windows domain
- **Remote service execution** — using legitimate administrative protocols (SMB, WinRM, SSH, WMI) with stolen credentials
- **Internal exploitation** — exploiting an unpatched internal service that the perimeter would never have exposed
- **Credential harvesting from memory** — using tools like Mimikatz to extract cached credentials from a host, then using those credentials to reach the next host

Lateral movement is the single highest-value detection target for most defenders, because nearly every serious incident passes through it and the legitimate-looking traffic produces high-fidelity behavioral detections. Network segmentation, jump hosts, just-in-time admin, and tiered administration models (Microsoft's "Tier 0/1/2" model is the canonical example) are the architectural defenses that limit how far lateral movement can travel before hitting a wall.

### 8.3 Command and Control

**Command and control (C2)** is the channel an attacker uses to issue commands to the implant on a compromised host and receive results. Modern attackers prefer C2 channels that blend into normal traffic — HTTPS to a domain that *looks* like a CDN, DNS queries that encode commands in subdomain names, traffic to legitimate services like Slack or GitHub being repurposed as carriers. The defender's job is to find the patterns that distinguish attacker C2 from real user traffic at scale.

Useful C2 detection signals include:

- **Beaconing** — the implant calls home on a regular interval; jittered beacons still produce a detectable distribution
- **Low-and-slow data volumes** — periodic small POSTs to an unfamiliar domain
- **JA3/JA4 TLS fingerprinting** — TLS client fingerprints that do not match any legitimate browser or library on the host
- **Newly registered or low-reputation domains** in outbound DNS

Mature SOCs maintain detections for each, plus an analyst-reviewed feed of suspicious outbound destinations.

### 8.4 Data Exfiltration

**Data exfiltration** is the attacker's act of getting target data out of the environment. The exfiltration path can be the same channel as C2, or it can be deliberately separated to avoid the size signal — large outbound transfers stand out, whereas a short C2 channel and a separate, brief upload to a cloud storage service may not. Common patterns include:

- DNS tunneling for slow, low-volume exfiltration
- HTTPS POST to attacker-controlled web endpoints
- Cloud storage uploads (Mega, Dropbox, S3) using stolen API credentials
- Email, with attached encrypted archives, from a compromised mailbox

Defensive controls layer at multiple boundaries: data loss prevention (DLP) at the egress, anomaly detection on user-data-volume baselines, prohibition (or proxying) of unsanctioned cloud storage, and mandatory egress filtering for sensitive zones.

### 8.5 Persistence Mechanisms

A **persistence mechanism** is any technique an attacker uses to survive a reboot, password change, or partial cleanup. Persistence is *the* reason eradication is harder than containment: an attacker who is contained on the network but has a scheduled task that fetches a new implant each morning is back tomorrow.

Common persistence mechanisms include:

- **Scheduled tasks** (cron, Windows Task Scheduler) that launch attacker code on a schedule
- **Registry Run keys** in Windows that launch attacker code at user logon
- **Service installation** — register a service that runs as SYSTEM at boot
- **WMI event subscriptions** — fire attacker code on system events
- **Modified login profiles** (`.bashrc`, PowerShell profiles, browser extensions)
- **Bootkits and firmware implants** (rare but devastating; they survive even OS reinstall)
- **Cloud persistence** — attacker-created IAM users, SSH keys, OAuth grants, backdoor Lambda functions

Eradication that does not enumerate and remove every plausible persistence mechanism is unfinished work. This is why mature IR teams maintain checklists per environment ("the 27 places persistence can hide on a Windows endpoint, the 18 in our AWS account, the 9 in our Kubernetes clusters") and run them all.

## 9. Malware Analysis

When an attacker drops a binary or script during an incident, the IR team needs to know what it does — what data it touches, what hosts it talks to, what persistence it plants — so that scope and eradication can be complete. **Malware analysis** is the discipline of answering those questions, and it splits into two complementary approaches:

- **Static analysis** — examining the sample without executing it. Reading strings, examining imported libraries, looking for embedded indicators, decompiling key functions, identifying packers and obfuscators.
- **Dynamic analysis** — running the sample in a controlled environment (a sandbox or an air-gapped analysis VM) and watching its behavior. File system changes, registry modifications, network connections, process injection.

For most operational teams, the right first step is an automated sandbox (commercial: Joe Sandbox, ANY.RUN; open-source: Cuckoo, CAPE) that produces a behavioral report in minutes. Deep manual reverse engineering — debugger-driven inspection of the unpacked code — is reserved for samples where the report is incomplete or where attribution and capability assessment matter (high-end APT samples, novel ransomware variants).

The output of malware analysis feeds directly into IR: IOCs to hunt for elsewhere in the environment, persistence mechanisms to remove, network indicators to block, and a behavioral profile that makes detection of *this same family* automatic next time.

## 10. Putting It Together: A Day in Operations

Imagine a typical Wednesday at a mid-sized organization with a real security operations practice. Threat intelligence has flagged an active campaign by a financially motivated group exploiting a recently disclosed vulnerability in a popular VPN appliance. The day might unfold like this:

1. **Morning** — vulnerability management team confirms the relevant appliance is in inventory, kicks off an emergency patch cycle, and updates the SLA dashboard. The detection engineering team writes a Sigma rule for the specific exploit pattern and ships it to the SIEM.
2. **Mid-morning** — a threat hunter, working from the campaign's published TTPs, queries the last 30 days of VPN logs for the attacker's known indicators. They find nothing on the matched host but identify a logging gap (the appliance's full request body is not retained) and file a ticket to fix it.
3. **Midday** — the SIEM fires the new detection on a different host. The on-call analyst triages, declares an incident, and the IR runbook for "VPN appliance compromise" engages. Containment isolates the appliance; identification expands scope by examining authentication logs and outbound connections from any account that authenticated through the appliance in the last 14 days.
4. **Afternoon** — eradication removes the attacker's web shell and three persistence mechanisms; recovery rebuilds the appliance from a clean image with the patch applied. The malware-analysis team finishes a behavioral report on the dropper and the C2 traffic pattern.
5. **End of day** — the incident is closed pending the post-incident review. The detection rule that fired is promoted from "experimental" to "production"; one new runbook step is added based on a decision the IR lead had to make ad-hoc; the logging gap from the morning is on next sprint's backlog.

What makes this a *good* day is not that nothing went wrong — something always goes wrong — but that every part of the operation produced a durable improvement. Threat intel produced a hunt and a detection. The hunt produced a logging fix. The incident produced a runbook update and an upgraded detection. The malware analysis produced new IOCs that go into the next intel feed. This is the rhythm a security operations program is trying to achieve: every signal, in or out, leaves the organization a little harder to attack tomorrow than it was today.

!!! mascot-celebration "What You Can Now Do"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sentinel celebrating">
    You can now read an incident report and name where the attacker was in MITRE ATT&CK at each step, identify which PICERL phase the responders were in, and reason about which detection or control should have caught the attack earlier. That is the foundation Chapter 16 builds on as we look at emerging topics — AI security, post-quantum migration, and the capstone you will defend.

## 11. Key Takeaways

- **Security operations** is the running practice of finding, watching, and responding — necessary because no set of controls alone is sufficient against thinking adversaries.
- **Penetration tests** find bugs in scope; **red teams** emulate full adversary campaigns; **blue teams** detect and respond; **purple teams** close detection gaps in real time.
- **MITRE ATT&CK** is the shared vocabulary of adversary techniques; defenders use it to map detection coverage and prioritize gaps.
- **Threat intelligence** prioritizes defensive effort; the **Pyramid of Pain** explains why detecting TTPs costs the adversary far more than detecting hashes.
- **Vulnerability management** is the continuous discover-scan-prioritize-remediate-verify cycle; prioritize on exploitability and reachability, not raw CVSS.
- **Threat hunting** is hypothesis-driven search through data for attackers your detections missed; the best output is a new durable detection.
- **Detection engineering** treats detections as software, with tests, version control, and coverage metrics tracked against ATT&CK.
- The **PICERL lifecycle** — Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned — is the operational structure of incident response; preparation and lessons learned are the highest-leverage phases.
- **Adversary techniques** (privilege escalation, lateral movement, C2, exfiltration, persistence) are the small repertoire defenders must recognize and architect against.
- **Bug bounties** and **CTFs** extend the offensive talent pool and develop practitioners; they complement rather than replace internal work.
