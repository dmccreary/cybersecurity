---
title: FAQ Coverage Gaps
description: Concepts from the learning graph that do not yet have a dedicated FAQ entry, tiered by priority for future FAQ expansion.
---

# FAQ Coverage Gaps

This report lists concepts from the [learning graph](concept-list.md) that are not directly referenced by any entry in [docs/faq.md](../faq.md). Concepts are tiered by *whether an FAQ entry would actually help the reader* — many concepts are best learned in the chapter context where they appear and would not benefit from a standalone FAQ entry.

- **Concepts in learning graph:** 390
- **Concepts referenced by FAQ:** 187 (48 %)
- **Concepts not yet referenced:** 203 (52 %)

## Critical Gaps (High Priority)

These are high-centrality, frequently-asked concepts where an FAQ entry would clearly help readers. Add these in the next FAQ expansion pass.

### Network Foundations

| Concept | Suggested question | Chapter |
|---|---|---|
| TCP | What's the difference between TCP and UDP, and when should I use each? | [Chapter 8](../chapters/08-network-foundations/index.md) |
| UDP | (combined with TCP above) | [Chapter 8](../chapters/08-network-foundations/index.md) |
| OSI Model | Do I really need to know all seven OSI layers? | [Chapter 8](../chapters/08-network-foundations/index.md) |
| TCP/IP Model | How does the TCP/IP model map to OSI? | [Chapter 8](../chapters/08-network-foundations/index.md) |
| Firewall | How do firewalls actually decide whether to allow a packet? | [Chapter 8](../chapters/08-network-foundations/index.md) |
| Stateful Firewall | What does "stateful" add to a firewall? | [Chapter 8](../chapters/08-network-foundations/index.md) |
| Web Application Firewall | What does a WAF do that a network firewall does not? | [Chapter 8](../chapters/08-network-foundations/index.md) |
| Network Segmentation | What is network segmentation, and why does it shrink blast radius? | [Chapter 8](../chapters/08-network-foundations/index.md) |
| VPN | What does a VPN actually protect, and what does it not? | [Chapter 8](../chapters/08-network-foundations/index.md) |
| IPsec | What is IPsec, and when do I use it instead of TLS? | [Chapter 8](../chapters/08-network-foundations/index.md) |
| Man-in-the-Middle | How does a TLS-protected connection actually defeat MitM? | [Chapter 8](../chapters/08-network-foundations/index.md) |
| WPA3 | What does WPA3 fix that WPA2 left broken? | [Chapter 9](../chapters/09-advanced-network-defense/index.md) |
| 802.1X | What is 802.1X, and how does it secure enterprise Wi-Fi? | [Chapter 9](../chapters/09-advanced-network-defense/index.md) |
| DDoS Mitigation | How do organizations actually defend against DDoS? | [Chapter 9](../chapters/09-advanced-network-defense/index.md) |
| SSH | How do SSH keys differ from passwords for server access? | [Chapter 8](../chapters/08-network-foundations/index.md) |

### Detection, SOC, and Operations

| Concept | Suggested question | Chapter |
|---|---|---|
| SIEM | What does a SIEM actually do, and what does it not do? | [Chapter 11](../chapters/11-cloud-and-ops-monitoring/index.md) |
| SOAR | How does SOAR extend a SIEM, and when do I need it? | [Chapter 11](../chapters/11-cloud-and-ops-monitoring/index.md) |
| Security Operations Center | What functions does a SOC perform, and what staffing model does it use? | [Chapter 11](../chapters/11-cloud-and-ops-monitoring/index.md) |
| EDR | What is EDR, and how does it differ from antivirus? | [Chapter 11](../chapters/11-cloud-and-ops-monitoring/index.md) |
| XDR | How is XDR different from EDR plus SIEM? | [Chapter 11](../chapters/11-cloud-and-ops-monitoring/index.md) |
| Threat Hunting | What is threat hunting, and how is it different from detection engineering? | [Chapter 15](../chapters/15-security-operations/index.md) |
| Threat Intelligence | What makes a piece of threat intelligence actually useful? | [Chapter 15](../chapters/15-security-operations/index.md) |
| Detection Engineering | How do I write a high-signal detection rule? | [Chapter 15](../chapters/15-security-operations/index.md) |
| Lateral Movement | What is lateral movement, and how do I detect it? | [Chapter 15](../chapters/15-security-operations/index.md) |
| Vulnerability Management | How do I run an effective vulnerability management program? | [Chapter 15](../chapters/15-security-operations/index.md) |
| Indicator of Compromise | What is the difference between an IOC and an IOA? | [Chapter 2](../chapters/02-threats-and-controls/index.md) |
| Indicator of Attack | (combined with IOC above) | [Chapter 2](../chapters/02-threats-and-controls/index.md) |

### Software Vulnerabilities and Supply Chain

| Concept | Suggested question | Chapter |
|---|---|---|
| CSRF | What is CSRF, and why do modern frameworks make it less common? | [Chapter 5](../chapters/05-software-vulnerabilities/index.md) |
| SSRF | What is SSRF, and why has it become a top cloud-era risk? | [Chapter 5](../chapters/05-software-vulnerabilities/index.md) |
| Insecure Deserialization | Why is deserializing untrusted data so dangerous? | [Chapter 5](../chapters/05-software-vulnerabilities/index.md) |
| Command Injection | How does command injection differ from SQL injection? | [Chapter 5](../chapters/05-software-vulnerabilities/index.md) |
| Broken Access Control | What does "broken access control" actually look like? | [Chapter 5](../chapters/05-software-vulnerabilities/index.md) |
| SBOM | What is an SBOM, and why does the supply chain need one? | [Chapter 6](../chapters/06-software-assurance/index.md) |
| Software Composition Analysis | What is SCA, and how is it different from SAST? | [Chapter 6](../chapters/06-software-assurance/index.md) |
| Fuzzing | What is fuzzing, and where does it find bugs that other tests miss? | [Chapter 6](../chapters/06-software-assurance/index.md) |
| Code Signing | What does code signing prove, and what does it not? | [Chapter 6](../chapters/06-software-assurance/index.md) |

### Compliance, Law, and Forensics

| Concept | Suggested question | Chapter |
|---|---|---|
| GDPR | What does GDPR actually require of a US company? | [Chapter 14](../chapters/14-societal-security/index.md) |
| HIPAA Law | What does HIPAA require beyond "encrypt PHI"? | [Chapter 14](../chapters/14-societal-security/index.md) |
| PCI-DSS | When does PCI-DSS apply, and what does it actually require? | [Chapter 13](../chapters/13-organizational-security/index.md) |
| ISO 27001 | What is ISO 27001, and how does it differ from NIST CSF? | [Chapter 13](../chapters/13-organizational-security/index.md) |
| CFAA | What activities does the CFAA criminalize, and what counts as authorization? | [Chapter 14](../chapters/14-societal-security/index.md) |
| Data Breach Notification | When am I legally required to notify after a breach? | [Chapter 14](../chapters/14-societal-security/index.md) |
| Chain of Custody | What is chain of custody, and how do I preserve it during an acquisition? | [Chapter 14](../chapters/14-societal-security/index.md) |
| Digital Forensics | What does a digital forensics investigation actually involve? | [Chapter 14](../chapters/14-societal-security/index.md) |
| Memory Forensics | When do I need memory forensics, and what does it find? | [Chapter 14](../chapters/14-societal-security/index.md) |
| Incident Containment | What does effective incident containment look like? | [Chapter 15](../chapters/15-security-operations/index.md) |
| Lessons Learned | What goes into a useful blameless postmortem? | [Chapter 15](../chapters/15-security-operations/index.md) |

### System and Container Security

| Concept | Suggested question | Chapter |
|---|---|---|
| Container Security | What threat model does a container actually defend against? | [Chapter 10](../chapters/10-system-security/index.md) |
| Kubernetes Security | What are the most common Kubernetes misconfigurations? | [Chapter 10](../chapters/10-system-security/index.md) |
| SELinux | When is SELinux worth the operational cost? | [Chapter 10](../chapters/10-system-security/index.md) |
| Process Isolation | What process-isolation guarantees does a modern OS provide? | [Chapter 10](../chapters/10-system-security/index.md) |
| Patch Management | How do I run patch management without breaking production? | [Chapter 11](../chapters/11-cloud-and-ops-monitoring/index.md) |
| System Hardening | What does a hardened baseline look like, and how do I track drift from it? | [Chapter 11](../chapters/11-cloud-and-ops-monitoring/index.md) |
| CIS Benchmarks | What are CIS Benchmarks, and how do I use them? | [Chapter 11](../chapters/11-cloud-and-ops-monitoring/index.md) |
| Audit Logging | What should I audit-log, and what should I not? | [Chapter 11](../chapters/11-cloud-and-ops-monitoring/index.md) |

## Medium Priority Gaps

These would strengthen the FAQ but are well covered in the chapter prose. Add when expanding the FAQ to ~120 entries.

### Cryptography

- Plaintext, Ciphertext, Decryption, Cryptographic Key — covered together in a "what are the basic crypto vocabulary words?" entry
- Block Cipher, Stream Cipher — distinguish in one entry
- DES, 3DES — historical context entry
- CTR Mode — comparison with GCM and CBC
- Public Key, Private Key — covered in existing asymmetric crypto entry but could be defined more sharply
- Collision Resistance, Preimage Resistance — covered in hash properties
- Key Derivation Function — covered alongside password hashing
- Homomorphic Encryption — could earn an entry as an emerging primitive

### Hardware and Component Security

- Side-Channel Attack, Timing Attack, Power Analysis Attack, Cache Side-Channel, Rowhammer
- Secure Boot, Measured Boot, UEFI Security, Hardware Root of Trust, Device Attestation
- IoT Security, Embedded Security, Firmware Security
- Hardware Supply Chain

### Networking Specifics

- ICMP, IP Protocol, ARP Spoofing, DHCP Snooping, Packet Sniffing, Port Scanning
- DMZ, VLAN, WireGuard, Rogue Access Point
- DNS Tunneling, Reverse Proxy, Proxy Server
- NetFlow Analysis, Packet Capture
- Volumetric Attack, Application-Layer DDoS

### Identity and IAM

- Identity Management, Access Management, Password Authentication, Password Policy
- Privilege Creep, Just-in-Time Access, Insider Threat
- Pretexting, Baiting (specific social engineering tactics)
- User Behavior Analytics
- Privacy by Design, Data Minimization

### Risk and Governance

- Likelihood, Impact, Risk Assessment, Risk Register
- Threat Actor, Asset, Security Requirement, Zero Day
- Administrative / Technical / Physical Control (taxonomy currently flagged in one entry but not broken out)
- Security Policy, Acceptable Use Policy, Security Standard, Security Procedure
- Governance Risk Compliance, CISO Role
- Business Continuity, Disaster Recovery, Business Impact Analysis, RTO, RPO
- Supply Chain Risk

### Law

- ECPA, CCPA, GLBA, FERPA, NIS2 Directive
- Cyber Law, Cybercrime, Cyber Policy
- ACM Code of Ethics

### Detection and Response Detail

- OSINT, Vulnerability Scanning, Antivirus, Host-Based IDS
- Incident Preparation, Incident Identification, Incident Eradication, Incident Recovery
- Malware Analysis, Privilege Escalation, Command and Control, Data Exfiltration, Persistence Mechanism
- Capture the Flag

## Low Priority Gaps

Specialized or terminal concepts where chapter prose is sufficient and a separate FAQ entry would add little. Address only if FAQ expands beyond 150 entries.

- Specific cipher / KDF names not already covered
- **Smart Grid Security**, **Blockchain Security** — covered narrowly in [Chapter 16](../chapters/16-emerging-and-capstone/index.md); broader treatment is out of scope
- **Technical Communication**, **Team Collaboration** — capstone soft skills, well covered in capstone deliverables
- **Network Security**, **Cloud Security**, **Hardware Security**, **Operating System Security**, **Cryptography** — these are the chapter-level concept umbrellas; entries already exist for the children, so the umbrella entries would be redundant
- **Security Monitoring**, **Log Management**, **Configuration Management**, **Baseline Configuration** — operationally covered in [Chapter 11](../chapters/11-cloud-and-ops-monitoring/index.md); FAQ-form would dilute
- **Security Control**, **Security Control** umbrella — already framed by the four-way preventive/detective/corrective/compensating taxonomy entry

## Recommendations

1. **Phase 1 (next pass): add ~50 questions** drawn from the High Priority list above. This brings the FAQ to ~140 entries and pushes concept coverage into the 70 % range.
2. **Phase 2 (when expanding to 200+): add ~30 questions** from the Medium Priority list, bringing coverage above 80 %.
3. **Low Priority concepts** stay in the chapters where they live — the FAQ is a wayfinding tool, not a glossary.
