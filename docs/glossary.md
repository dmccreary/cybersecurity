# Glossary of Terms

#### 802.1X

An IEEE standard for port-based network access control, requiring authentication before granting network access. It is widely used on wired and wireless enterprise networks together with RADIUS.

See also: Network Access Control.

**Example:** Plugging a laptop into an 802.1X-enabled office port forces the user to authenticate via certificate or credentials before any traffic flows.

#### AAA Framework

A model that organizes identity-related security functions into authentication, authorization, and accounting. Many network protocols and identity systems implement these three layers as distinct concerns.

See also: Authentication, Authorization, Accounting.

**Example:** A RADIUS server handles AAA for a corporate Wi-Fi network, verifying credentials, granting network access, and logging session details.

#### ABAC

Attribute-Based Access Control, a model in which access decisions are computed from attributes of the subject, resource, action, and environment via policy. It expresses fine-grained, context-aware policies.

See also: RBAC.

**Example:** "Allow doctors to read patient records only during their assigned shift on hospital networks" is an ABAC policy using multiple attributes.

#### Acceptable Use Policy

A policy that defines how employees and other users may use organizational resources — networks, systems, data, devices — and what is prohibited. It is typically agreed to as part of onboarding.

See also: Security Policy.

**Example:** An AUP forbids employees from running unapproved software on company laptops and from using corporate email for personal business.

#### Access Control

The mechanism by which a system decides whether a subject is permitted to perform an action on an object, based on a policy. Policy models include DAC, MAC, RBAC, and ABAC.

See also: DAC, MAC, RBAC, ABAC.

**Example:** A file server consults its access-control list to decide whether a user can open a given file.

#### Access Management

The runtime enforcement of authentication and authorization decisions for identities accessing resources. It complements identity management on the operational side.

See also: IAM System.

**Example:** An access-management gateway authenticates a user via SSO and authorizes their request to a backend application based on group membership.

#### Accounting

The recording of which authenticated identities performed which actions, producing audit trails used for forensics, compliance, and accountability. It answers the question "what did you do?"

See also: AAA Framework.

**Example:** A server logs every database query with the user, timestamp, and rows affected so administrators can investigate after an incident.

#### ACM Code of Ethics

The professional code of ethics of the Association for Computing Machinery, articulating principles such as contributing to society, avoiding harm, honoring confidentiality, and respecting privacy. It guides computing professionals' conduct.

See also: Cyber Ethics.

**Example:** A computing professional consults the ACM Code of Ethics when a project's data-collection practices conflict with their conscience.

#### Administrative Control

A control implemented through policies, procedures, training, and human processes rather than technology. It governs how people interact with systems and information.

See also: Technical Control, Physical Control.

**Example:** A policy requiring background checks for employees with access to financial systems is an administrative control.

#### Adversarial ML

A subfield of AI security studying attacks that exploit the statistical structure of machine-learning models, such as evasion, poisoning, and model extraction. Attacks often transfer across models trained similarly.

See also: AI Security, Model Evasion, Data Poisoning.

**Example:** Crafting an image with imperceptible perturbations that fools an image classifier is an adversarial-ML evasion attack.

#### Adversarial Thinking

The disciplined practice of analyzing systems from an attacker's perspective to anticipate misuse before it occurs. It complements traditional engineering by asking how a feature could be subverted, not just how it should work.

**Example:** A developer reviewing a password reset flow asks how an attacker could trigger resets for arbitrary accounts, not just how a legitimate user recovers access.

#### AES

The Advanced Encryption Standard, a symmetric block cipher with 128-bit blocks and 128-, 192-, or 256-bit keys, standardized by NIST in 2001. It is the dominant symmetric cipher in modern protocols.

**Example:** Web traffic over HTTPS commonly uses AES-128 or AES-256 in GCM mode for bulk data encryption.

#### AI Security

The branch of security concerned with attacks against and misuse of machine-learning systems, including model integrity, confidentiality, availability, and the broader systems that incorporate them. It overlaps with traditional software security but adds data- and model-specific concerns.

See also: Adversarial ML.

**Example:** Defending an LLM-powered application against prompt injection and data leakage is AI-security work.

#### Anomaly-Based Detection

A detection approach that builds a model of normal behavior and alerts on deviations from it. It can find novel attacks but suffers from false positives when "normal" drifts.

Contrast with: Signature-Based Detection.

**Example:** A user behavior analytics system that flags a sudden midnight bulk-download as anomalous is performing anomaly-based detection.

#### Antivirus

Endpoint software that detects and removes malicious software, historically using signatures and now incorporating heuristics and behavior. It is increasingly subsumed by EDR.

**Example:** Antivirus on a home PC quarantines a downloaded file matching a signature for known malware.

#### AppArmor

A Linux mandatory access control system that confines individual programs through path-based profiles. It is generally considered easier to author than SELinux at the cost of some expressiveness.

See also: SELinux.

**Example:** An AppArmor profile restricts a PDF viewer to read user documents and access display services but nothing else.

#### Application-Layer DDoS

A DDoS variant that consumes application or backend resources rather than network bandwidth, often with relatively low traffic volume. Detection requires understanding application semantics.

See also: DDoS Attack.

**Example:** Repeatedly hitting an expensive search endpoint with valid-looking queries is an application-layer DDoS attack.

#### Argon2

A modern password-hashing function and the winner of the 2015 Password Hashing Competition, with parameters for memory hardness and parallelism. The Argon2id variant is the default recommendation for new systems.

See also: Password Hashing, Bcrypt.

**Example:** A new authentication system uses Argon2id with sufficient memory and time costs to resist GPU-based attacks.

#### ARP Spoofing

An attack on local networks in which a malicious host sends forged ARP messages to associate its MAC address with the IP address of another host, allowing it to intercept traffic. Defenses include dynamic ARP inspection and segmentation.

See also: Man-in-the-Middle.

**Example:** An attacker on a coffee-shop Wi-Fi runs ARP spoofing to position itself between victims and the gateway, then captures their traffic.

#### ASLR

Address Space Layout Randomization, an exploit mitigation that randomizes the memory addresses of program components — stack, heap, libraries — so attackers cannot rely on fixed addresses. It complicates many memory-corruption exploits.

See also: DEP, Stack Canary.

**Example:** With ASLR enabled, an attacker exploiting a buffer overflow cannot reliably predict the address of `system()` and must first leak an address.

#### Asset

Anything of value an organization seeks to protect, including data, systems, intellectual property, reputation, and people. Identifying assets is a prerequisite for risk-based decision making.

**Example:** Customer payment records, source code repositories, and employee directories are common assets of a software company.

#### Asymmetric Cryptography

A cryptographic style in which each party holds a key pair: a public key shareable with anyone and a private key kept secret. Operations done with one key are undone by the other, enabling encryption and signature workflows without pre-shared secrets.

Contrast with: Symmetric Cryptography.

**Example:** RSA and elliptic curve cryptography are asymmetric systems used in TLS and code signing.

#### Attack Surface

The total set of points where an unauthorized party could attempt to enter, extract data from, or disrupt a system. Reducing attack surface reduces the number of paths an attacker can probe.

**Example:** Disabling unused services on a server, closing extra ports, and removing dormant accounts shrink its attack surface.

#### Attack Trees

A graphical representation of how an attacker could achieve a goal, with the goal as the root and refinement of sub-goals as branches. Leaves are concrete attack steps with cost or feasibility annotations.

See also: Threat Modeling.

**Example:** An attack tree for "obtain database admin credentials" branches into phishing the DBA, exploiting the bastion host, or stealing a backup tape.

#### Audit Logging

The recording of security-relevant events — logins, privilege changes, configuration changes, sensitive data access — in a tamper-resistant manner. Audit logs are a foundation for accountability and forensics.

See also: Log Management.

**Example:** A database audit log records every administrative action with the operator, timestamp, and statement executed.

#### Authentication

The process of verifying that an identity claim is genuine, typically by presenting credentials such as a password, token, or biometric. It answers the question "who are you?"

Contrast with: Authorization.

**Example:** Logging into email by entering a username and password authenticates the user before any messages are shown.

#### Authorization

The process of determining whether an authenticated identity is permitted to perform a requested action on a resource. It answers the question "what are you allowed to do?"

Contrast with: Authentication.

**Example:** After logging in, a junior employee is authorized to view payroll reports but not modify them.

#### Availability

The property that authorized users can access information and services when needed. Redundancy, capacity planning, and resilience to denial-of-service attacks all support availability.

See also: CIA Triad.

**Example:** A hospital's electronic health record system is designed with redundant servers so doctors can retrieve patient data even during a hardware failure.

#### Baiting

A social-engineering technique that lures victims by exploiting curiosity or reward — for example, USB drives left in a parking lot or downloads promising free goods. Once accepted, the bait delivers malware or harvests data.

See also: Social Engineering.

**Example:** Branded USB sticks dropped near an office that auto-run malware when plugged in are a classic baiting attack.

#### Baseline Configuration

A documented, approved set of configuration settings that represents the secure standard for a class of systems. Deviations are tracked and justified.

See also: Configuration Management, CIS Benchmarks.

**Example:** A baseline configuration for Windows 11 specifies enabled services, audit policies, and registry settings derived from CIS guidance.

#### Bcrypt

An adaptive password-hashing function based on the Blowfish cipher whose work factor can be increased over time as hardware speeds improve. It has been a standard recommendation for password storage for decades.

See also: Password Hashing, Argon2.

**Example:** A login service stores bcrypt hashes with a configurable cost factor to slow brute-force attacks.

#### BGP Security

The set of practices protecting the Border Gateway Protocol, which routes traffic between autonomous systems on the internet, from accidental and malicious mis-announcements. RPKI is a leading defense.

See also: RPKI.

**Example:** Operators deploy RPKI-based route origin validation as part of their BGP-security posture.

#### Biometric Authentication

The use of physiological or behavioral characteristics — fingerprints, faces, voice, gait — to verify identity. It must be paired with liveness detection and template protection to be sound.

**Example:** Apple Face ID is biometric authentication that compares a live facial scan against a template stored in a secure enclave.

#### Blast Radius

The extent of damage that results when a single compromise occurs, measured in systems, data, or users affected. Designs that limit blast radius confine the impact of inevitable breaches.

**Example:** A microservice running with credentials scoped to one database has a smaller blast radius than one with cluster-wide admin credentials.

#### Block Cipher

A symmetric cipher that operates on fixed-size blocks of plaintext (e.g., 128 bits), producing ciphertext blocks of the same size. A mode of operation extends it to messages of arbitrary length.

See also: Block Cipher Modes.

**Example:** AES is a block cipher that processes 128-bit blocks regardless of overall message length.

#### Block Cipher Modes

Modes of operation that specify how a block cipher is repeatedly applied to encrypt messages longer than one block. The chosen mode determines whether the resulting scheme provides confidentiality alone or also authentication.

See also: ECB Mode, CBC Mode, CTR Mode, GCM Mode.

**Example:** Choosing GCM versus CBC for AES dramatically changes the security properties of the resulting protocol.

#### Blockchain Security

The security concerns and properties of distributed ledger systems, including consensus integrity, smart-contract correctness, key management, and the layers of applications built on top. The threat model spans cryptography, networking, and economics.

**Example:** Auditing a smart contract for reentrancy bugs that could allow draining funds is blockchain-security work.

#### Blue Team

The defenders within an organization who detect, investigate, and respond to attacks, both real and simulated. Their performance is evaluated through exercises against red teams.

See also: Red Team, Purple Team.

**Example:** The blue team's metrics during a red-team engagement include mean time to detect and to contain simulated intrusions.

#### Broken Access Control

A category of vulnerability in which authorization checks are missing, incorrect, or bypassable, allowing users to perform actions or view data outside their permitted scope. It topped the recent OWASP Top Ten.

**Example:** Changing the user ID in a URL to view another user's invoices because the server only checks authentication, not ownership, is broken access control.

#### Broken Authentication

A category of vulnerability in which the authentication mechanism itself is weak, misconfigured, or implemented in ways that allow account takeover. Common examples include credential stuffing tolerance, predictable session IDs, and missing MFA.

**Example:** An application that allows unlimited login attempts without rate limiting suffers from broken authentication.

#### Buffer Overflow

A class of memory-safety bug in which data written to a buffer exceeds its boundaries, corrupting adjacent memory and potentially altering control flow. Modern mitigations and memory-safe languages reduce but do not eliminate this risk.

See also: Stack Overflow, Heap Overflow.

**Example:** A C program that copies network input into a fixed-size stack buffer without bounds checking is vulnerable to buffer overflow.

#### Bug Bounty Program

A structured engagement in which an organization invites external researchers to find and report vulnerabilities in scope and pays rewards for valid findings. It complements internal testing and clarifies legal authorization.

**Example:** A bug bounty program offers escalating rewards for higher-impact findings such as account takeover and remote code execution.

#### Business Continuity

The capability of an organization to continue delivering essential services during and after disruptive events. It encompasses planning, alternate processes, and resource arrangements.

See also: Disaster Recovery, Business Impact Analysis.

**Example:** A bank's business continuity plan includes alternate sites and manual procedures so customer service continues during a major IT outage.

#### Business Impact Analysis

A structured assessment of the consequences of disruption to business processes and the dependencies that support them. BIA outputs drive RTOs, RPOs, and resource allocation.

See also: Business Continuity, RTO, RPO.

**Example:** A BIA establishes that the order-entry system has the lowest tolerable downtime and accordingly the strictest recovery objectives.

#### Cache Side-Channel

A side channel based on observing cache hits and misses to infer the memory access patterns of victim code. Flush+Reload and Prime+Probe are well-known techniques.

See also: Side-Channel Attack.

**Example:** A co-located VM uses Flush+Reload on a shared library to extract a cryptographic key from a neighbor VM via cache timing.

#### Capstone Applied Research

A culminating undergraduate project that conducts applied research on a defined cybersecurity problem, producing a written report and defended findings. It is an option for capstone requirements emphasizing inquiry.

**Example:** A capstone applied-research project measures the prevalence of a specific misconfiguration across publicly accessible cloud buckets.

#### Capstone Secure System

A culminating undergraduate project that designs, builds, and evaluates a secure system end-to-end, integrating skills across the curriculum. It is one option for ABET CAC capstone requirements.

**Example:** A team builds a secure messaging service from threat model to deployment as a capstone secure system project.

#### Capstone Security Program

A culminating undergraduate project that designs and evaluates an organizational security program, integrating governance, risk, and operations content. It is an option for capstone requirements emphasizing the program-management track.

**Example:** Students assess a small nonprofit's security posture and produce a multi-year program plan as a capstone security program.

#### Capture the Flag

A cybersecurity competition format in which participants solve security challenges or attack and defend systems to obtain "flags" representing successful completions. CTFs are widely used for training and recruiting.

**Example:** Students compete in an annual CTF that tests skills in cryptography, web exploitation, reverse engineering, and forensics.

#### CBC Mode

Cipher Block Chaining mode, which XORs each plaintext block with the previous ciphertext block before encryption, using an initialization vector for the first block. It hides repetition but does not by itself provide authentication.

See also: Block Cipher Modes, Initialization Vector.

**Example:** AES-CBC was widely used in TLS 1.0 alongside a separate MAC for integrity.

#### CCPA

The California Consumer Privacy Act and its successor CPRA, U.S. state laws granting California consumers rights over their personal information including notice, deletion, and opt-out of sale. They have driven privacy programs across U.S. companies.

**Example:** A retailer adds a "Do Not Sell or Share My Personal Information" link to comply with CCPA.

#### Certificate Authority

An entity that issues digital certificates binding identities to public keys, vouching for the binding through its own signature. Trust in a CA's signature is rooted in its public key being pre-installed in clients.

See also: PKI, X.509 Certificate.

**Example:** A web hosting customer obtains a TLS certificate from a public CA so browsers will trust the server.

#### Certificate Chain

The sequence of certificates linking a leaf certificate to a trusted root, with each certificate signed by the next up the chain. Verifiers walk the chain to validate trust.

See also: X.509 Certificate.

**Example:** A website's leaf certificate is signed by an intermediate CA, which is in turn signed by a root CA the browser already trusts.

#### Certificate Revocation

The mechanism by which a previously valid certificate is marked invalid before its expiration, typically due to key compromise or change of affiliation. Revocation is checked via CRLs or OCSP.

See also: OCSP.

**Example:** When a server's private key is exposed, the operator asks the CA to revoke the corresponding certificate.

#### CFAA

The Computer Fraud and Abuse Act, the primary U.S. federal anti-hacking statute prohibiting access to a computer "without authorization" or in excess of authorization. Its scope and interpretation have evolved through litigation.

**Example:** Prosecutions against attackers who gain unauthorized access to federal systems often invoke the CFAA.

#### Chain of Custody

The documented sequence of people who have possessed and handled an item of evidence, supporting the integrity and admissibility of the evidence. Gaps undermine the evidentiary value.

See also: Digital Forensics.

**Example:** A forensic examiner records every transfer of a seized hard drive — sender, receiver, time, location — in the chain-of-custody log.

#### CIA Triad

The foundational model of information security composed of confidentiality, integrity, and availability. It frames security goals as a trade-off space rather than a single property.

See also: Confidentiality, Integrity, Availability.

**Example:** A read-only public website prioritizes integrity and availability while placing little value on confidentiality of its published content.

#### Ciphertext

The transformed, scrambled form of data produced by an encryption algorithm. Without the correct key, ciphertext should reveal essentially nothing about the underlying plaintext.

Contrast with: Plaintext.

**Example:** An AES-encrypted email body in a stored mailbox is ciphertext that requires the user's key to read.

#### CIS Benchmarks

Configuration guidance maintained by the Center for Internet Security covering operating systems, applications, and cloud services, derived from community consensus. They are widely used as hardening baselines.

See also: System Hardening.

**Example:** Many regulated environments certify that their Linux servers comply with the CIS Linux Benchmarks at a chosen level.

#### CISO Role

The executive responsible for an organization's information-security strategy, program, and outcomes, typically reporting to the CEO, CIO, or board. The role blends technical, business, and regulatory judgment.

**Example:** A CISO presents the firm's risk register and quarterly metrics to the audit committee.

#### Cloud IAM

The identity and access management capabilities of cloud platforms, controlling which users, services, and resources can perform which actions. It is the new perimeter in cloud-native architectures.

See also: IAM System.

**Example:** An AWS IAM role attached to a Lambda function grants it specific S3 permissions and nothing else.

#### Cloud Security

The branch of security focused on protecting workloads, data, and identities deployed in public, private, and hybrid clouds. It emphasizes shared responsibility, identity-centric controls, and configuration as code.

See also: Shared Responsibility Model.

**Example:** Enforcing least-privilege IAM policies and encrypting object storage buckets are routine cloud-security practices.

#### Code Signing

The practice of attaching a digital signature to executable code so consumers can verify its origin and integrity before execution. Signing keys are typically protected in HSMs.

See also: Digital Signature.

**Example:** Operating systems verify code-signing signatures on drivers before allowing them to load into the kernel.

#### Collision Resistance

The property of a hash function that finding two different inputs producing the same output is computationally infeasible. It is essential for digital signatures and integrity-based identifiers.

See also: Preimage Resistance.

**Example:** SHA-256's collision resistance ensures that committing to a document by its hash uniquely binds the signer to that exact document.

#### Command and Control

The infrastructure and channels by which an attacker controls compromised systems and exfiltrates data, typically using protocols that blend with normal traffic. Detecting C2 is a key defensive objective.

**Example:** Beacons from infected hosts to a domain mimicking a legitimate provider are command-and-control traffic.

#### Command Injection

An injection vulnerability where attacker-controlled input is incorporated into operating-system commands invoked by the application, allowing arbitrary command execution. Avoiding shell invocation and using argument arrays mitigates it.

See also: Injection Attack.

**Example:** Passing untrusted filenames into a shell-invoked `tar` command without escaping enables an attacker to append arbitrary commands.

#### Compensating Control

An alternative control deployed when a primary required control cannot be implemented, providing comparable risk reduction by other means. It is documented and accepted as a deliberate trade-off.

**Example:** A legacy device that cannot run modern endpoint protection is placed on an isolated network segment as a compensating control.

#### Complete Mediation

The principle that every access to every resource is checked against the authorization policy, with no shortcuts or cached decisions that could grow stale. It prevents bypass through caching or implicit trust.

**Example:** A file server checks permissions on every read and write rather than only on initial open, so revocations take effect immediately.

#### Confidential Computing

A computing paradigm that protects data in use by performing computations inside hardware-isolated trusted execution environments, with attestation. It extends protection beyond data at rest and in transit.

See also: Trusted Execution Env, Data in Use.

**Example:** Running a sensitive analytics workload in an Intel SGX or AMD SEV enclave on a public cloud is confidential computing.

#### Confidentiality

The property that information is disclosed only to authorized parties. Mechanisms include encryption, access control, and classification schemes that limit who can read sensitive data.

See also: CIA Triad.

**Example:** Encrypting a laptop's hard drive preserves confidentiality if the device is stolen, because the thief cannot read the contents without the key.

#### Configuration Management

The practice of defining, applying, and verifying system configurations as code, ensuring consistency and reducing drift. Tools like Ansible, Puppet, and Chef implement it.

See also: Baseline Configuration.

**Example:** A configuration-management system enforces SSH settings, audit policies, and firewall rules across thousands of Linux hosts.

#### Container Security

The branch of security concerned with protecting containerized workloads, container images, registries, runtimes, and orchestrators. It blends application, OS, and supply-chain concerns.

See also: Docker Security, Kubernetes Security.

**Example:** Scanning container images for known vulnerabilities before deployment is a basic container-security practice.

#### Corrective Control

A control whose purpose is to restore systems or data to a known-good state after an incident. Backups, patches, and incident response runbooks are corrective controls.

**Example:** Restoring encrypted files from offline backups after a ransomware incident is the action of a corrective control.

#### Critical Infrastructure

The systems and assets — energy, water, healthcare, finance, transportation — whose disruption would have severe consequences for society or national security. Governments designate sectors and impose specific protections.

See also: ICS Security.

**Example:** Electric power grids and water-treatment facilities are critical infrastructure subject to sector-specific cybersecurity expectations.

#### Cross-Site Scripting

A web vulnerability in which an attacker injects script that runs in another user's browser within the trust context of the vulnerable site. It enables session theft, content tampering, and credential capture.

See also: Stored XSS, Reflected XSS, DOM-Based XSS.

**Example:** A comment field that renders user-supplied HTML without sanitization can serve as an XSS vector.

#### Cryptographic Key

A secret value (or one of a key pair) consumed by a cryptographic algorithm to determine its output. Key length and randomness directly affect the difficulty of attacking the system.

**Example:** A 256-bit AES key is a randomly chosen value that selects which permutation the cipher applies to plaintext.

#### Cryptography

The discipline of designing and analyzing mathematical techniques for securing communication and data, including encryption, authentication, and integrity primitives. It transforms data into forms that resist reading or tampering by unauthorized parties.

**Example:** TLS combines several cryptographic primitives — key exchange, encryption, and signatures — to secure web traffic.

#### CSRF

Cross-Site Request Forgery, a web attack in which a victim's browser is tricked into sending an authenticated request to a target site, performing an action the user did not intend. Tokens and SameSite cookies are standard defenses.

**Example:** A malicious page that auto-submits a form to a banking site relies on CSRF to transfer funds using the victim's existing session.

#### CTR Mode

Counter mode, which converts a block cipher into a stream cipher by encrypting an incrementing counter and XORing the result with plaintext. It is parallelizable and avoids padding.

See also: Block Cipher Modes.

**Example:** AES-CTR is used in disk encryption schemes where parallel block access is important.

#### CVE

Common Vulnerabilities and Exposures, a public catalog assigning unique identifiers to disclosed software flaws so vendors, researchers, and defenders can refer to the same issue. Each CVE entry summarizes the affected products and the nature of the flaw.

**Example:** CVE-2021-44228 is the identifier for the Log4Shell vulnerability in Apache Log4j.

#### CVSS

The Common Vulnerability Scoring System, a numeric framework for rating the severity of vulnerabilities along dimensions such as access vector, complexity, and impact. Scores range from 0.0 to 10.0 and inform patch prioritization.

See also: CVE.

**Example:** A remotely exploitable, unauthenticated code execution flaw typically receives a CVSS base score above 9.0.

#### CWE Top 25

A list maintained by MITRE of the most dangerous software weaknesses across all software categories, derived from the Common Weakness Enumeration. It is broader in scope than the OWASP web-focused list.

See also: OWASP Top Ten.

**Example:** Out-of-bounds writes and use-after-free issues regularly appear near the top of the CWE Top 25.

#### Cyber Ethics

The branch of applied ethics addressing right action in computing contexts, including privacy, dual-use research, disclosure, automation, and the responsibilities of practitioners. It informs codes of professional conduct.

See also: ACM Code of Ethics.

**Example:** Choosing not to weaponize a vulnerability discovered in a hospital network is a cyber-ethics decision grounded in avoidance of harm.

#### Cyber Kill Chain

Lockheed Martin's seven-stage model of intrusions: reconnaissance, weaponization, delivery, exploitation, installation, command and control, and actions on objectives. It frames defense as disrupting any stage.

See also: Kill Chain.

**Example:** Email filtering blocks the delivery stage, while endpoint protection targets the exploitation and installation stages of the cyber kill chain.

#### Cyber Law

The body of law addressing computer-mediated activities, including computer crime, electronic communications, data protection, and intellectual property. It is fragmented across jurisdictions.

See also: CFAA, GDPR.

**Example:** Determining whether a particular intrusion technique violates statute requires applying cyber law to the facts and jurisdiction.

#### Cyber Policy

The set of governmental and organizational decisions about cybersecurity strategy, regulation, and international relations, including critical infrastructure, deterrence, and norms. It bridges technical and political domains.

See also: Critical Infrastructure.

**Example:** A national cyber-policy document outlines goals for protecting critical infrastructure and engaging in international cyber-norms processes.

#### Cybercrime

Criminal activity in which computers or networks are the target, the tool, or the location of the offense, ranging from intrusion and fraud to harassment and intellectual-property theft. It is investigated and prosecuted under multiple statutes.

See also: Cyber Law.

**Example:** Ransomware deployment for extortion is cybercrime under multiple statutes in most jurisdictions.

#### Cybersecurity

The discipline concerned with protecting computing systems, networks, and data from unauthorized access, disruption, modification, or destruction by adversaries. It combines technical controls, processes, and human factors to preserve confidentiality, integrity, and availability across digital and physical infrastructure.

**Example:** A bank's cybersecurity program includes firewalls, employee training, encryption, and incident response procedures working together to protect customer accounts.

#### DAC

Discretionary Access Control, a model in which the owner of a resource decides who else may access it. Standard Unix file permissions are a familiar example.

Contrast with: MAC.

**Example:** A user who owns a file can `chmod` it to share with another user, exemplifying DAC.

#### Data at Rest

Data stored on persistent media such as disks, backups, or object stores while not actively being processed. Protections typically include encryption and access control.

Contrast with: Data in Transit, Data in Use.

**Example:** An encrypted database file on a server's disk is data at rest.

#### Data Breach Notification

The legal and contractual obligation to inform affected individuals, regulators, or partners when personal or sensitive data has been compromised. Triggers, timelines, and contents are jurisdiction-specific.

**Example:** Following a breach exposing customer email addresses, a company sends data-breach-notification letters to affected users within state-mandated timelines.

#### Data Exfiltration

The unauthorized transfer of data from a compromised environment to attacker-controlled destinations. Volume, channel, and pacing all influence detectability.

**Example:** Compressing customer records and uploading them in chunks to a cloud storage bucket controlled by the attacker is data exfiltration.

#### Data in Transit

Data actively moving between systems across a network or interconnect. Transport-layer encryption protocols protect it from eavesdropping and tampering.

Contrast with: Data at Rest.

**Example:** An API request traveling from a mobile app to a backend server over TLS is data in transit.

#### Data in Use

Data being actively processed in memory, registers, or caches by a CPU. It is the hardest state to protect; confidential computing technologies aim to reduce exposure here.

Contrast with: Data at Rest, Data in Transit.

**Example:** Plaintext credit card numbers loaded into application memory while being validated are data in use.

#### Data Loss Prevention

Technology and processes that monitor, detect, and block unauthorized movement of sensitive data outside organizational control. DLP combines content inspection with policy enforcement at endpoints, networks, and cloud services.

**Example:** A DLP rule blocks email attachments containing patterns matching credit card numbers from being sent externally.

#### Data Minimization

The principle of collecting and retaining only the personal data strictly necessary for a defined purpose. It reduces both privacy harm and breach impact.

See also: Privacy Engineering.

**Example:** An app that asks only for an email address rather than full name and date of birth at signup applies data minimization.

#### Data Poisoning

An attack on a machine-learning system in which adversary-controlled examples are introduced into training data to shape the resulting model's behavior. Targeted poisoning can install backdoors triggered by specific inputs.

See also: Adversarial ML.

**Example:** Polluting a public training dataset with crafted labels that cause a model to misclassify a specific class is data poisoning.

#### Database Encryption

The practice of encrypting database contents at the storage, column, or field level to protect against unauthorized access through stolen media or backups. Key handling and search semantics are the principal challenges.

**Example:** A healthcare app encrypts patient SSNs at the column level so that even DBAs without the application's key cannot read them.

#### DDoS Attack

A Distributed Denial of Service attack in which many sources flood a target's resources to make it unavailable to legitimate users. Botnets, reflectors, and amplification techniques scale these attacks.

See also: Volumetric Attack, Application-Layer DDoS.

**Example:** A coordinated DDoS attack from a botnet of compromised IoT devices renders a gaming service unreachable for hours.

#### DDoS Mitigation

The combination of capacity, filtering, and traffic engineering used to absorb or deflect DDoS attacks. Cloud-based scrubbing services are a common building block.

See also: DDoS Attack.

**Example:** A site behind a DDoS mitigation provider has all traffic routed through scrubbing centers that drop attack traffic before it reaches origin servers.

#### Decryption

The inverse process to encryption, transforming ciphertext back into plaintext using the appropriate key. Without the key, the algorithm should be infeasible to reverse.

See also: Encryption.

**Example:** A client decrypts a TLS-protected response using the session key it derived during the handshake.

#### Defense in Depth

A design strategy that layers independent controls so that the failure of any single control does not compromise the protected asset. The goal is graceful degradation under attack.

**Example:** A web application is protected by a firewall, an application-layer filter, input validation, and parameterized queries — each redundant against injection.

#### DEP

Data Execution Prevention, a memory-protection feature that marks data pages non-executable so injected shellcode in such pages cannot run. Attackers respond with techniques like return-oriented programming.

See also: ASLR.

**Example:** With DEP enabled, an attacker who corrupts a stack buffer with shellcode cannot directly execute it on the stack.

#### Dependency Scanning

The continuous checking of an application's declared dependencies against vulnerability databases so newly disclosed flaws in libraries surface quickly. It is a common building block of SCA.

See also: Software Composition Analysis.

**Example:** A CI pipeline runs dependency scanning on every pull request and fails the build if a library with a critical CVE is introduced.

#### DES

The Data Encryption Standard, an older symmetric block cipher with a 56-bit key, now considered insecure due to its short key length. It was the U.S. federal standard from 1977 until being superseded by AES.

See also: 3DES, AES.

**Example:** DES can be brute-forced in hours on commodity hardware today, which is why no new system should use it.

#### 3DES

Triple DES, a construction that applies the DES algorithm three times with two or three keys to extend effective key length. It is deprecated in favor of AES due to performance and small block size.

See also: DES, AES.

**Example:** Some legacy payment-processing systems still use 3DES for compatibility, though new deployments use AES.

#### Detection Engineering

The discipline of designing, building, testing, and maintaining detections — rules, queries, and analytics — that surface adversary activity in operational data. It treats detections as code with lifecycle management.

See also: SIEM, MITRE ATT&CK.

**Example:** A detection engineer writes a query mapped to a specific ATT&CK technique, tests it against attack simulations, and tunes false positives in production.

#### Detective Control

A control whose purpose is to identify that an incident has occurred or is in progress, such as logging, monitoring, or anomaly detection. It supports faster response and forensics.

Contrast with: Preventive Control.

**Example:** A SIEM alert when a user logs in from two distant countries within an hour is a detective control.

#### Device Attestation

A protocol by which a device cryptographically proves its identity and configuration state to a relying party. Attestation underpins trust decisions in zero-trust and confidential computing.

See also: Trusted Platform Module.

**Example:** An enterprise issues network access only to devices whose TPM-based attestation demonstrates an approved boot state.

#### DHCP Snooping

A switch feature that filters DHCP messages to allow only authorized DHCP servers to lease addresses on a network, defeating rogue DHCP attacks. It maintains a binding table that other features can leverage.

**Example:** Enabling DHCP snooping on access switches stops an attacker who plugs in a rogue DHCP server from poisoning client configurations.

#### Diamond Model

An intrusion analysis framework that links four core features of an event — adversary, capability, infrastructure, and victim — to surface relationships across incidents. It supports clustering events into campaigns.

**Example:** Two intrusions sharing the same command-and-control infrastructure and victim sector pivot through the diamond model into a single campaign.

#### Differential Privacy

A mathematical framework for releasing aggregate information about a dataset with quantifiable bounds on the privacy loss for any individual. It typically introduces calibrated noise into computations.

**Example:** A census bureau publishes population statistics with differential-privacy noise so individual respondents cannot be re-identified.

#### Diffie-Hellman

A protocol enabling two parties to derive a shared secret over a public channel without prior key exchange, based on the difficulty of the discrete logarithm problem. It is the foundation of many key-agreement schemes.

See also: Key Exchange.

**Example:** TLS uses an ephemeral elliptic-curve Diffie-Hellman exchange to agree on a session key for each connection.

#### Digital Forensics

The discipline of acquiring, preserving, examining, and presenting digital evidence in a manner suitable for investigation or legal proceedings. It includes disk, memory, network, and mobile sub-domains.

See also: Chain of Custody, Forensic Imaging.

**Example:** A digital-forensics examiner images a suspect laptop, recovers deleted files, and produces a written report that may be entered as evidence.

#### Digital Signature

A cryptographic value produced from a message and a private key that anyone holding the corresponding public key can verify. It provides authenticity, integrity, and non-repudiation.

See also: Public Key, Non-Repudiation.

**Example:** A software vendor signs binaries with its private key so users can verify the publisher and detect tampering.

#### Disaster Recovery

The IT-focused subset of business continuity covering the restoration of systems, data, and infrastructure after a major incident. Plans specify objectives, runbooks, and testing.

See also: RTO, RPO, Business Continuity.

**Example:** A disaster-recovery plan defines a hot standby site that takes over within 30 minutes after a primary data center failure.

#### DMZ

A demilitarized zone, a network segment that hosts services accessible from a less-trusted network (typically the internet) but isolated from the more-trusted internal network. It limits exposure of internal systems.

**Example:** Public web servers sit in a DMZ between the internet and the internal database tier, with firewalls enforcing the segmentation.

#### DNS Security

The set of practices and protocols protecting domain name resolution from poisoning, hijacking, and abuse. DNSSEC, encrypted DNS transports, and resolver hardening are major components.

See also: DNSSEC, DNS Tunneling.

**Example:** Configuring resolvers to use DNS-over-HTTPS or DNS-over-TLS improves DNS security against on-path observers.

#### DNS Tunneling

The use of DNS queries and responses as a covert data channel, often to exfiltrate data or maintain command-and-control through restrictive networks. Defenders detect it via volume and entropy analysis on DNS traffic.

See also: DNS Security.

**Example:** Malware encodes stolen data into long subdomains it queries, and the attacker's authoritative DNS server reads them out — that is DNS tunneling.

#### DNSSEC

DNS Security Extensions, which add cryptographic signatures to DNS records so resolvers can verify their authenticity and integrity. It does not provide confidentiality.

See also: DNS Security.

**Example:** A DNSSEC-validating resolver rejects forged responses for a signed zone, preventing a class of cache-poisoning attacks.

#### Docker Security

The container-security concerns specific to Docker images, daemons, and tooling, such as image provenance, daemon socket exposure, and rootless operation. Many Docker concerns generalize to other runtimes.

See also: Container Security.

**Example:** Mounting the Docker daemon socket into a container effectively grants that container root on the host, which is a Docker-security footgun.

#### DOM-Based XSS

A cross-site scripting variant in which the vulnerability lives entirely in client-side code that constructs DOM content from attacker-controllable sources. The server may never see the payload.

See also: Cross-Site Scripting.

**Example:** Client JavaScript that reads `location.hash` and injects it into the DOM via `innerHTML` is the classic DOM-based XSS pattern.

#### Dynamic Analysis

The examination of a program's behavior while it executes, often with instrumented inputs to expose bugs that only manifest at runtime. It complements static analysis by finding flaws that depend on state and environment.

See also: Static Analysis, Fuzzing.

**Example:** Running an application under AddressSanitizer to detect memory errors during testing is dynamic analysis.

#### ECB Mode

Electronic Codebook mode, the simplest block cipher mode, encrypting each block independently with the same key. Identical plaintext blocks produce identical ciphertext blocks, leaking structure.

See also: Block Cipher Modes.

**Example:** Encrypting an image with AES-ECB famously leaves the outline visible because repeated pixel patterns map to repeated ciphertext.

#### Economy of Mechanism

The principle that security mechanisms should be as small and simple as possible. Complexity hides bugs and is itself an attack surface.

**Example:** A minimalist authentication library with a small codebase is easier to audit than a sprawling framework with many configuration paths.

#### ECPA

The Electronic Communications Privacy Act, U.S. law governing interception, access, and disclosure of electronic communications, with provisions including the Wiretap Act and the Stored Communications Act. It both restricts surveillance and authorizes specific procedures.

**Example:** Subpoenas for stored email contents engage Stored Communications Act provisions of the ECPA.

#### EDR

Endpoint Detection and Response, agent-based software on workstations and servers that records detailed activity, detects threats, and supports remote investigation and remediation. It supersedes traditional antivirus.

See also: XDR.

**Example:** EDR records every process start, network connection, and file write on a workstation, enabling retrospective queries during an investigation.

#### Elliptic Curve Cryptography

Asymmetric cryptography built on the algebra of elliptic curves over finite fields, offering equivalent security to RSA at much smaller key sizes. It underpins modern key exchange and signature standards like ECDSA and Ed25519.

**Example:** A 256-bit ECC key provides comparable security to a roughly 3072-bit RSA key with much faster operations.

#### Embedded Security

The practice of securing devices with constrained computing resources, real-time requirements, and long deployment lifetimes, where many enterprise techniques do not apply directly. It blends hardware, firmware, and protocol concerns.

See also: IoT Security.

**Example:** A medical infusion pump must enforce secure boot, signed updates, and minimal network exposure under embedded-security constraints.

#### Encryption

The process of transforming plaintext into ciphertext using an algorithm and a key, so that only parties holding the appropriate key can recover the plaintext. It provides confidentiality and underpins many other security properties.

See also: Decryption.

**Example:** Encrypting a database column with AES-GCM ensures that a stolen backup tape does not expose its contents.

#### Exploit

A specific technique, code, or sequence of actions that takes advantage of a vulnerability to produce an attacker-desired effect. The same vulnerability may have multiple exploits of varying reliability.

See also: Vulnerability.

**Example:** A Metasploit module that reliably triggers a known buffer overflow to gain a shell is an exploit for that vulnerability.

#### Fail Secure Default

A design principle that systems revert to a denying or safe state when they encounter errors or unexpected conditions. The default is "no access" rather than "open access."

**Example:** When an authorization service is unreachable, the application denies the request rather than allowing it through.

#### Federated Identity

An arrangement in which an identity provider in one domain vouches for users to relying parties in other domains, often across organizational boundaries. Standards like SAML and OIDC implement it.

See also: SAML, OIDC.

**Example:** A university federation lets students from any member institution access a shared library service with their home credentials.

#### FERPA

The U.S. Family Educational Rights and Privacy Act, governing access to and disclosure of student education records by institutions receiving federal education funds. It grants rights to students or their parents over those records.

**Example:** A university uses FERPA-compliant procedures before disclosing a student's grades to a third party.

#### FIDO2

A set of standards (WebAuthn and CTAP) enabling phishing-resistant, public-key-based authentication using authenticators such as security keys or platform devices. It eliminates the shared-secret weaknesses of passwords.

See also: Passkey, Multi-Factor Authentication.

**Example:** Logging into a site with a YubiKey via WebAuthn is FIDO2 authentication.

#### File Permissions

The metadata associated with files and directories specifying which subjects may read, write, or execute them. Mismanaged permissions are a frequent source of security issues.

See also: Access Control.

**Example:** A web server configuration file readable by every user on the system has overly permissive file permissions.

#### Firewall

A network device or software that filters traffic between zones based on policy, allowing or denying packets and connections according to rules. It is a foundational network-security control.

See also: Stateful Firewall, Next-Gen Firewall.

**Example:** A firewall rule permits inbound TCP 443 to the web server VLAN while blocking all other inbound traffic.

#### Firmware Security

The discipline of protecting low-level software embedded in devices — BIOS, device firmware, microcontrollers — from unauthorized modification and exploitation. Compromised firmware can persist below the operating system.

See also: Secure Boot.

**Example:** A network switch's firmware update process validates a vendor signature before applying the update to prevent malicious firmware injection.

#### Forensic Imaging

The creation of a verifiable, bit-for-bit copy of a storage device for analysis without altering the original. Hash values bound to the image attest to integrity.

See also: Digital Forensics.

**Example:** Using a hardware write-blocker, an examiner produces a forensic image of a laptop's drive and records its SHA-256 hash.

#### Format String Bug

A vulnerability in which user-controlled input is passed as the format string to a C-style printf-family function, allowing arbitrary memory reads and writes. It arises when developers pass external data where a literal format string is expected.

**Example:** Calling printf(user_input) instead of printf("%s", user_input) lets an attacker include format specifiers that leak stack contents.

#### Fuzzing

A dynamic-analysis technique that feeds large numbers of malformed or randomized inputs to a program to elicit crashes and other defects. Coverage-guided fuzzers steer mutation toward unexplored code paths.

**Example:** OSS-Fuzz continuously fuzzes widely used open-source libraries and reports thousands of bugs to maintainers.

#### GCM Mode

Galois/Counter Mode, a block cipher mode that combines CTR-mode encryption with a Galois-field authenticator to provide both confidentiality and integrity. It is a leading authenticated encryption mode.

See also: Block Cipher Modes.

**Example:** TLS 1.3 cipher suites use AES-GCM or ChaCha20-Poly1305 to encrypt and authenticate records together.

#### GDPR

The European Union's General Data Protection Regulation, governing processing of personal data of EU residents with rights for individuals and obligations for controllers and processors. Penalties can reach a percentage of global turnover.

See also: Privacy Engineering.

**Example:** A U.S. SaaS company offering services to EU users implements GDPR-required notices, lawful bases, and data subject rights.

#### GLBA

The U.S. Gramm-Leach-Bliley Act, which imposes privacy and safeguarding requirements on financial institutions handling consumer financial information. Its Safeguards Rule requires written information-security programs.

**Example:** A regional bank's information-security program includes a written plan and risk assessments to satisfy GLBA Safeguards Rule.

#### Governance Risk Compliance

The set of disciplines aligning organizational governance, risk management, and compliance with security objectives. GRC practitioners translate between executives, auditors, and operations.

See also: Security Policy.

**Example:** A GRC team maps technical controls to PCI-DSS requirements and tracks evidence of effectiveness for an annual audit.

#### Hardware Root of Trust

The minimal set of hardware components and keys whose integrity is assumed at design time and from which all higher-level security guarantees derive. Compromise of the root undermines the rest of the chain.

See also: Trusted Platform Module.

**Example:** Burned-in fuses storing a vendor key in a system-on-chip serve as the hardware root of trust for verifying boot images.

#### Hardware Security

The branch of security concerned with protecting computing hardware from physical and logical attack, including tamper resistance, secure boot, and isolation primitives. It underpins many software guarantees.

See also: Trusted Platform Module, Hardware Security Module.

**Example:** A laptop's hardware-backed disk encryption depends on hardware security primitives in the TPM.

#### Hardware Security Module

A dedicated cryptographic appliance that generates, stores, and uses keys in tamper-resistant hardware, exposing operations through controlled interfaces. HSMs are central to high-assurance key management.

See also: Trusted Platform Module, Key Management.

**Example:** A certificate authority signs new certificates using keys that never leave its HSM.

#### Hardware Supply Chain

The set of organizations and processes that design, manufacture, transport, and distribute hardware, each of which is a potential point of tampering. Counterfeit components and implants are real concerns for high-value targets.

**Example:** Allegations that network equipment was modified during shipment to install hardware implants illustrate hardware supply-chain risk.

#### Hash Function

A deterministic function that maps arbitrary-length input to a fixed-length output, designed so that different inputs almost always produce different outputs. Cryptographic hash functions resist collision and preimage attacks.

See also: SHA-2, Collision Resistance.

**Example:** Git uses SHA-1 (and increasingly SHA-256) hashes to identify content uniquely.

#### Heap Overflow

A buffer overflow that occurs in heap-allocated memory, typically corrupting allocator metadata or adjacent objects to gain code execution. Heap layouts are less deterministic than the stack, so exploits often involve heap grooming.

See also: Buffer Overflow.

**Example:** Overflowing a malloc'd buffer in a browser to corrupt a neighboring object's vtable is a common heap-overflow exploit shape.

#### HIPAA Compliance

The set of administrative, physical, and technical safeguards that organizations handling protected health information must implement under U.S. HIPAA regulations. Audits, breach notification, and BAAs are key obligations.

See also: HIPAA Law.

**Example:** A telehealth provider implements access controls, encryption, and audit logs as part of HIPAA compliance for its patient records.

#### HIPAA Law

The U.S. Health Insurance Portability and Accountability Act and its associated regulations governing the privacy and security of protected health information. It defines covered entities, business associates, and breach notification rules.

See also: HIPAA Compliance.

**Example:** A laboratory transmitting test results to physicians is bound by HIPAA Law as a covered entity.

#### HMAC

A specific construction for building MACs from a hash function and a secret key, standardized in RFC 2104. It is widely used in protocols and APIs that require authenticated messages.

See also: Message Authentication Code.

**Example:** AWS request signing uses HMAC-SHA256 over canonicalized request fields with a secret key.

#### Homomorphic Encryption

A class of encryption schemes that allow computations to be performed directly on ciphertexts, producing encrypted results that, once decrypted, match the result of operating on the plaintext. Practical schemes are computationally expensive but enable privacy-preserving cloud computation.

**Example:** A research service computes statistics over patient data while it remains encrypted, never seeing individual records in plaintext.

#### Host-Based IDS

A host-resident detection system that observes operating-system activity, integrity of key files, and process behavior. It complements network-based detection by seeing actions inside hosts.

See also: Intrusion Detection.

**Example:** A host-based IDS alerts when system binaries are modified outside scheduled patch windows.

#### HTTPS

HTTP traffic carried over a TLS-protected channel, providing server authentication and transport encryption. It is the dominant secure protocol on the web.

See also: TLS.

**Example:** A browser address bar's lock icon indicates that the page was loaded over HTTPS.

#### Hypervisor Security

The protection of the hypervisor — the software layer that creates and runs VMs — from compromise by guests or attackers, and the maintenance of isolation between guests. The hypervisor is a critical trust anchor in virtualized environments.

See also: Virtualization Security.

**Example:** A hypervisor-security flaw allowing a guest VM to read host memory undermines the isolation of every other guest on that host.

#### IaaS Security

The customer-side security concerns of Infrastructure-as-a-Service offerings, where the provider supplies compute, storage, and networking but the customer manages the operating system and above. Patching, IAM, and network controls dominate.

See also: Shared Responsibility Model.

**Example:** Patching the kernel of a Linux VM running on EC2 is the customer's IaaS-security responsibility.

#### IAM System

A platform that combines identity management and access management capabilities, often providing SSO, MFA, lifecycle workflows, and policy decision points. It is central to modern security architecture.

See also: Identity Management, Access Management.

**Example:** Okta, Azure AD/Entra ID, and Ping Identity are commercial IAM systems used by enterprises.

#### ICMP

The Internet Control Message Protocol, used for diagnostic and control messages such as echo requests (ping) and unreachability notifications. It is also abused as a covert channel and reconnaissance tool.

**Example:** Running `ping example.com` sends ICMP echo requests and waits for echo replies to test reachability.

#### ICS Security

The security of Industrial Control Systems used in manufacturing, utilities, and process industries, where availability and safety dominate. It blends IT and OT concerns and uses specialized protocols.

See also: SCADA Security, OT Security.

**Example:** ICS-security best practices include strict segmentation between corporate IT and plant control networks.

#### Identity Management

The lifecycle administration of user, service, and device identities, including provisioning, de-provisioning, and attribute updates. It is foundational to authorization decisions.

See also: IAM System, Access Management.

**Example:** When an employee changes departments, identity management updates their group memberships so downstream systems adjust their access.

#### Impact

The magnitude of harm — financial, operational, reputational, or human — that would result if a threat were realized. It is one of the two factors used to compute risk.

See also: Risk.

**Example:** Loss of patient records at a hospital has high impact due to regulatory penalties, patient harm, and loss of trust.

#### Incident Containment

The phase in which actions are taken to halt the incident's spread without prematurely tipping off attackers or destroying evidence. It often involves network isolation and credential revocation.

See also: PICERL Lifecycle.

**Example:** Incident containment for a compromised workstation includes isolating it from the network while preserving its volatile memory.

#### Incident Eradication

The phase in which attacker presence is fully removed from the environment, including malware, persistence mechanisms, and unauthorized accounts. It depends on accurate scoping during identification.

See also: PICERL Lifecycle, Persistence Mechanism.

**Example:** Incident eradication may involve rebuilding affected systems and rotating credentials touched during the incident.

#### Incident Identification

The phase in which detected signals are triaged, validated, and declared an incident, with scope and severity initially established. Speed and accuracy at this stage shape later phases.

See also: PICERL Lifecycle.

**Example:** A SOC analyst correlates EDR alerts and network anomalies to identify an incident involving an attacker on a workstation.

#### Incident Preparation

The pre-incident phase covering plans, runbooks, tools, training, and exercises that determine how well an organization will perform during an incident. Most response quality is set here.

See also: PICERL Lifecycle, Tabletop Exercise.

**Example:** Incident preparation includes maintaining an updated contact list, rehearsing tabletop exercises, and pre-staging forensic tools.

#### Incident Recovery

The phase in which systems and services are restored to known-good states and normal operations resume, with elevated monitoring for recurrence. Verification is part of the phase.

See also: PICERL Lifecycle.

**Example:** Incident recovery validates that restored services pass functional and security checks before user access is restored.

#### Incident Response

The organized approach to detecting, containing, eradicating, and recovering from security incidents, with explicit roles, runbooks, and learning. It is a core operational capability.

See also: PICERL Lifecycle, Incident Response Plan.

**Example:** An incident-response team activates its plan when EDR confirms ransomware execution on a workstation.

#### Incident Response Plan

A documented plan describing how an organization will detect, respond to, and recover from incidents, including roles, communications, and authorities. It is enacted under stress, so clarity matters.

See also: Runbook, Tabletop Exercise.

**Example:** An incident response plan names the on-call lead, lists who must be notified within one hour, and provides a contact tree.

#### Indicator of Attack

A behavioral pattern or sequence of actions suggesting an active or attempted intrusion, regardless of specific artifacts. IoAs focus on intent and technique rather than fixed signatures.

Contrast with: Indicator of Compromise.

**Example:** PowerShell spawning from a Word document and contacting an external host is an IoA consistent with macro-based malware.

#### Indicator of Compromise

An observable artifact, such as a file hash, IP address, or domain name, that suggests a system has been compromised. IoCs are matched against logs to detect known intrusions.

Contrast with: Indicator of Attack.

**Example:** A SHA-256 hash known to belong to a ransomware family is an IoC that endpoint tools can match against running processes.

#### Information Security

The practice of safeguarding information in any form — digital, physical, or spoken — against unauthorized disclosure, alteration, or loss. The scope is broader than cybersecurity because it includes paper records and verbal communication.

See also: Cybersecurity.

**Example:** Locking paper medical files in a cabinet and shredding discarded printouts are information security controls that have no cyber component.

#### Initialization Vector

A non-secret, typically random or unique value used to ensure that encrypting the same plaintext under the same key yields different ciphertexts. Reusing an IV with the same key in modes like CTR or GCM can be catastrophic.

**Example:** A CBC-mode application generates a fresh 16-byte IV for each message and prepends it to the ciphertext.

#### Injection Attack

A class of attack in which untrusted data is interpreted as code or commands by a downstream interpreter due to inadequate separation of data from code. SQL, OS command, and template injections are common members.

See also: SQL Injection, Command Injection.

**Example:** A login form that inserts user input directly into a SQL query is vulnerable to SQL injection, a member of the broader injection class.

#### Input Validation

The practice of verifying that input meets expected structural and semantic constraints before further processing. It reduces the attack surface for injection and parsing bugs.

See also: Output Encoding.

**Example:** Validating that a "country code" parameter matches an allow-list of ISO codes before using it in any subsequent operation is input validation.

#### Insecure Deserialization

A class of vulnerability in which untrusted serialized data is deserialized by code that constructs objects with side effects, leading to remote code execution or logic manipulation. Avoiding native deserialization of untrusted input is the structural fix.

**Example:** Java applications that deserialize attacker-supplied bytes have been compromised through gadget chains in widely used libraries.

#### Insider Threat

A threat originating from people with legitimate access — employees, contractors, or partners — whether acting maliciously, negligently, or under coercion. Detection mixes technical telemetry with HR and management context.

See also: User Behavior Analytics.

**Example:** A departing engineer downloading large volumes of source code shortly before resigning is a classic insider-threat pattern.

#### Integer Overflow

A bug in which an arithmetic operation produces a value outside the representable range of its type, wrapping around to an unexpected value. The wrong value often becomes a buffer size, leading to memory corruption.

**Example:** Multiplying width by height in 32-bit arithmetic without overflow checks can yield a tiny allocation that the program then writes far too much data into.

#### Integrity

The property that information and systems remain accurate, complete, and unaltered except by authorized actions. Cryptographic hashes, digital signatures, and access controls help detect or prevent tampering.

See also: CIA Triad.

**Example:** A software vendor publishes a SHA-256 hash of an installer so users can verify the downloaded file was not modified in transit.

#### Intrusion Detection

A monitoring capability that observes systems or networks and raises alerts when activity matches signs of intrusion. IDS does not block by itself.

See also: Intrusion Prevention.

**Example:** A network IDS flags a sudden surge of failed logins followed by a successful one as suspicious and alerts the SOC.

#### Intrusion Prevention

An inline detection capability that blocks identified malicious traffic in addition to alerting. IPS sits in the data path and can disrupt service if misconfigured.

See also: Intrusion Detection.

**Example:** An IPS drops connections containing a known exploit signature before the payload reaches the target service.

#### IoT Security

The branch of security focused on networked physical devices — sensors, appliances, vehicles, industrial equipment — characterized by scale, heterogeneity, and limited update capability. Default credentials and unpatched firmware are recurrent issues.

See also: Embedded Security.

**Example:** The Mirai botnet conscripted hundreds of thousands of IoT devices with default credentials to launch massive DDoS attacks.

#### IP Protocol

The Internet Protocol, the network-layer protocol that addresses and routes packets across interconnected networks. IPv4 and IPv6 are its two deployed versions.

**Example:** An IP packet contains source and destination addresses that routers use to forward it toward its destination.

#### IPsec

A suite of protocols for authenticating and encrypting IP traffic at the network layer, commonly used for site-to-site VPNs. It provides modes for tunneling and transport.

See also: VPN.

**Example:** Two corporate sites connect their networks through an IPsec VPN tunnel between their edge routers.

#### ISO 27001

An international standard for establishing, operating, and continually improving an information security management system (ISMS). Certification requires audited evidence of conformance.

**Example:** A SaaS provider pursues ISO 27001 certification to satisfy enterprise customer requirements in regulated markets.

#### Just-in-Time Access

A model in which elevated privileges are granted only for the moment they are needed and revoked automatically afterward, often through an approval workflow. It minimizes standing privilege.

See also: Least Privilege.

**Example:** A developer requests temporary production-database access for a 30-minute investigation; the just-in-time access platform grants and then revokes it.

#### Kernel Security

The subset of OS security focused specifically on the kernel — the privileged core mediating access to hardware. Kernel compromises typically bypass all userspace controls.

See also: Operating System Security.

**Example:** A kernel-mode vulnerability that allows arbitrary code execution undermines every userspace protection on the system.

#### Key Derivation Function

A function that derives one or more cryptographic keys from a secret input such as a password, master key, or shared secret. KDFs are designed to be slow on passwords and to spread entropy from short inputs.

See also: Bcrypt, Argon2.

**Example:** PBKDF2 derives a strong AES key from a user passphrase by repeatedly hashing it with a salt.

#### Key Exchange

A cryptographic procedure by which two or more parties agree on a shared secret key, often over an untrusted channel. Modern protocols typically use ephemeral key exchange to gain forward secrecy.

See also: Diffie-Hellman, Perfect Forward Secrecy.

**Example:** During a TLS handshake, key exchange establishes the symmetric keys used for the rest of the session.

#### Key Management

The set of processes governing the generation, distribution, storage, rotation, and destruction of cryptographic keys throughout their lifecycle. Weak key management undermines otherwise strong cryptography.

See also: Key Rotation, Hardware Security Module.

**Example:** A company uses a managed KMS service to centrally generate, store, and rotate the keys used by its applications.

#### Key Rotation

The periodic replacement of cryptographic keys with newly generated ones, limiting the data exposed if any single key is compromised. Rotation cadence depends on key purpose and exposure.

See also: Key Management.

**Example:** A token-signing key is rotated every 90 days, with overlap so older tokens remain verifiable until they expire.

#### Kill Chain

A model that decomposes an attack into sequential stages so defenders can detect and disrupt it as early as possible. Breaking any link prevents the attack from completing.

See also: Cyber Kill Chain.

**Example:** Detecting reconnaissance scanning is earlier in the kill chain than detecting data exfiltration and gives defenders more time to respond.

#### Kubernetes Security

The container-security concerns specific to Kubernetes clusters, including RBAC, network policies, admission control, and secret management. Misconfiguration is a leading cause of cluster compromise.

See also: Container Security.

**Example:** Using PodSecurity admission to forbid privileged pods cluster-wide is a Kubernetes-security control.

#### Lateral Movement

An adversary technique that propagates access from an initial foothold to additional systems within the environment. It often leverages stolen credentials and trust relationships.

**Example:** Reusing a hash captured on a compromised workstation to authenticate to a file server is lateral movement.

#### Lattice-Based Crypto

A family of post-quantum cryptographic constructions based on the hardness of problems on mathematical lattices, such as Learning With Errors. It underlies several NIST-selected post-quantum standards.

See also: Post-Quantum Cryptography.

**Example:** ML-KEM (Kyber) is a lattice-based key-encapsulation mechanism standardized by NIST.

#### Least Privilege

The principle that subjects receive only the permissions strictly necessary to perform their function, no more. It bounds the damage from compromised accounts and accidental misuse.

**Example:** A backup service account has read access to database files but no write access, no shell login, and no network egress beyond the backup target.

#### Lessons Learned

The post-incident phase in which the organization reviews what happened, what worked, what didn't, and what to change. Outputs feed back into preparation and broader controls.

See also: PICERL Lifecycle.

**Example:** Lessons-learned from a phishing-driven breach lead to deploying phishing-resistant MFA and updating training.

#### Likelihood

An estimate of how probable it is that a given threat will materialize over a defined time horizon. It is often expressed qualitatively (low/medium/high) or as a probability when data permit.

See also: Risk.

**Example:** Public-facing web servers face a high likelihood of automated vulnerability scans every day.

#### Log Management

The collection, normalization, retention, and protection of log data from systems and applications. Reliable logs are foundational for detection and forensic analysis.

See also: SIEM, Audit Logging.

**Example:** A central log management platform retains 90 days of OS and application logs and forwards a subset to long-term storage for compliance.

#### MAC

Mandatory Access Control, a model in which a system-wide policy — not the resource owner — determines access decisions, typically based on labels and clearance. Multi-level secure systems use MAC.

Contrast with: DAC.

**Example:** A SELinux-enforced policy can prevent a database process from reading an unrelated file even if Unix permissions would allow it, demonstrating MAC.

#### Malware Analysis

The systematic study of malicious software to determine its capabilities, indicators, and impact, using static, dynamic, and reverse-engineering techniques. Outputs inform detection, eradication, and intelligence.

**Example:** A malware analyst sandboxes a sample, extracts its C2 domains, and produces detection rules and IoCs for downstream use.

#### Man-in-the-Middle

An attack in which an adversary positions itself between two communicating parties and can read or modify messages while each party believes it is talking directly to the other. Strong authentication and integrity protection defeat it.

See also: ARP Spoofing.

**Example:** An attacker on the same network performs ARP spoofing and TLS interception to mount a man-in-the-middle attack against an unencrypted protocol.

#### MD5

A 128-bit hash function once widely used but now broken: collisions can be produced in seconds and it is unsuitable for any security purpose. It is retained only for legacy non-security uses like checksums.

**Example:** Two files with the same MD5 hash but different contents have been publicly demonstrated, including malicious certificate forgeries.

#### Measured Boot

A boot process that records cryptographic measurements of each loaded component into protected hardware (typically a TPM), producing an attestable record of the system's boot state. Verifiers can detect tampering by comparing measurements to known-good values.

See also: Secure Boot.

**Example:** A remote management server requires measured-boot attestation from each node before granting it access to confidential workloads.

#### Memory Forensics

The acquisition and analysis of volatile memory contents — process lists, network connections, encryption keys, injected code — typically using tools like Volatility. It captures state that disappears at shutdown.

See also: Digital Forensics.

**Example:** Memory forensics on a suspected compromised server reveals an injected DLL not present on disk.

#### Memory Protection

Hardware and OS features that restrict how processes can access memory, including page-level read/write/execute permissions and address-space separation. It is the substrate above which exploit mitigations live.

See also: ASLR, DEP.

**Example:** A user process attempting to write to a page marked read-only triggers a fault from the memory-protection unit.

#### Message Authentication Code

A short, key-dependent tag attached to a message that lets a recipient verify both authenticity and integrity using a shared key. Without the key, an attacker cannot forge valid tags.

See also: HMAC.

**Example:** A backup system tags each encrypted file with a MAC so tampering during storage is detectable on restore.

#### Micro-Segmentation

The practice of enforcing fine-grained, often per-workload, segmentation policies inside a data center or cloud environment. It reduces lateral movement once a foothold is gained.

See also: Network Segmentation, Zero Trust Architecture.

**Example:** Micro-segmentation policies allow a web tier to talk only to its application tier on specific ports, blocking lateral access to unrelated services.

#### MITRE ATT&CK

A knowledge base of adversary tactics and techniques drawn from real-world observations, organized by domain (enterprise, mobile, ICS) and platform. It is widely used to map detections, threats, and red-team activities.

See also: TTP.

**Example:** A SOC maps each detection rule to the MITRE ATT&CK technique it covers to find gaps.

#### Mobile Forensics

The acquisition and analysis of data from mobile devices, accounting for unique storage formats, encryption, and lock mechanisms. Cloud-account artifacts often complement on-device evidence.

See also: Digital Forensics.

**Example:** Mobile forensics tools extract messages, location history, and application data from a seized smartphone subject to legal authorization.

#### Model Evasion

An attack on a deployed machine-learning model in which adversary-crafted inputs cause incorrect predictions while appearing normal to humans. It is the canonical adversarial-example attack.

See also: Adversarial ML.

**Example:** Adding nearly invisible perturbations to a stop sign so a self-driving system classifies it as a yield sign is model evasion.

#### Model Theft

An attack in which an adversary reconstructs a substitute of a target model — its architecture, weights, or behavior — through queries or exfiltration. It can undermine intellectual property and enable further attacks.

See also: Adversarial ML.

**Example:** Querying a paid prediction API extensively and training a local model on the responses is a model-theft attack.

#### Multi-Factor Authentication

An authentication scheme requiring two or more independent factors — something you know, have, or are — to reduce the impact of any single factor's compromise. Phishing-resistant factors are increasingly preferred.

See also: FIDO2.

**Example:** Logging in with a password plus a hardware security key satisfies MFA.

#### NetFlow Analysis

The analysis of flow records summarizing network conversations — source, destination, ports, byte counts — exported by routers and switches. It scales to large environments where full packet capture would be impractical.

**Example:** NetFlow analysis surfaces a workstation that suddenly transfers gigabytes to an unfamiliar external IP, prompting investigation.

#### Network Access Control

A capability that authenticates and assesses devices before granting them network access, enforcing posture and identity policies at the edge. 802.1X is a foundational technology.

See also: 802.1X.

**Example:** A NAC system places a laptop with outdated antivirus into a remediation VLAN until it is updated.

#### Network Forensics

The capture and analysis of network traffic and flow data to investigate incidents, attribute activity, and reconstruct attacker behavior. It often requires substantial storage and indexing.

See also: Digital Forensics, Packet Capture.

**Example:** Network forensics during a breach traces an attacker's lateral movement by correlating flow records and packet captures across sensors.

#### Network Security

The discipline of protecting networks and the data that traverses them from unauthorized access, modification, and disruption. It blends segmentation, filtering, monitoring, and cryptography.

**Example:** A campus network uses firewalls, segmentation, and intrusion detection to enforce its network-security policy.

#### Network Segmentation

The practice of dividing a network into isolated zones with controlled connectivity between them, limiting lateral movement after a compromise. Segmentation is a key reducer of blast radius.

See also: Micro-Segmentation, VLAN.

**Example:** Separating the corporate office network from the manufacturing network with strict firewall rules is network segmentation.

#### Next-Gen Firewall

A firewall that integrates application-layer awareness, identity, and threat intelligence to make decisions beyond simple ports and addresses. It can identify applications regardless of port.

See also: Firewall.

**Example:** A next-gen firewall detects that traffic on TCP 443 is actually a peer-to-peer file-sharing application and blocks it per policy.

#### NIS2 Directive

The European Union's Network and Information Security 2 directive, expanding cybersecurity obligations across additional sectors and tightening incident-reporting requirements. Member states transpose it into national law.

**Example:** A medium-size cloud provider operating in the EU updates its incident-reporting procedures to meet NIS2 timelines.

#### NIST CSF

The NIST Cybersecurity Framework, an outcome-focused framework structured around functions — Identify, Protect, Detect, Respond, Recover (and now Govern) — that organizations use to assess and improve their security posture. It is widely adopted across industries.

**Example:** A utility uses the NIST CSF to benchmark current versus target maturity in each function and prioritize investment.

#### Non-Repudiation

The property that a party cannot credibly deny having performed an action, typically achieved through digital signatures and tamper-evident logs. It binds an action to an identity in a way that resists later denial.

**Example:** A contract signed with a digital signature backed by a trusted certificate authority is hard for the signer to repudiate later.

#### OAuth 2.0

An authorization framework that lets a resource owner grant a third-party application limited access to a protected resource without sharing credentials. It is widely used to issue access tokens for APIs.

See also: OIDC.

**Example:** A photo-printing site uses OAuth 2.0 to obtain a scoped access token for the user's cloud photo library.

#### OCSP

The Online Certificate Status Protocol, which lets a client query a CA in real time to determine whether a certificate has been revoked. OCSP stapling allows servers to attach freshness proofs to handshakes.

See also: Certificate Revocation.

**Example:** A browser performs an OCSP query to confirm the website's certificate has not been revoked before establishing the TLS session.

#### OIDC

OpenID Connect, an identity layer on top of OAuth 2.0 that adds authentication and standardized user-identity claims via ID tokens. It is the dominant federated-login protocol on the modern web.

See also: OAuth 2.0, Federated Identity.

**Example:** "Sign in with Google" buttons typically use OIDC to authenticate users to third-party applications.

#### Open Design Principle

The principle that the security of a system should not depend on the secrecy of its design or implementation, only on the secrecy of keys. It enables peer review and avoids security-by-obscurity.

**Example:** AES is a public, peer-reviewed standard whose security rests on the secret key, not on hiding how the algorithm works.

#### Operating System Security

The branch of security concerned with protecting OS kernels, system services, and the boundary between user processes and privileged code. It includes access control, isolation, and exploit mitigations.

See also: Kernel Security, Process Isolation.

**Example:** Modern operating systems enforce ASLR, DEP, and stack canaries by default as part of their OS-security posture.

#### Operational Technology

The hardware and software that monitors and controls physical processes, devices, and infrastructure, distinct from traditional IT systems. OT prioritizes safety and availability and tolerates change poorly.

See also: OT Security.

**Example:** Programmable logic controllers running a chemical plant are operational technology.

#### OSI Model

A seven-layer reference model of network communication — physical, data link, network, transport, session, presentation, application — used to discuss protocols and attacks at consistent levels. Real-world stacks rarely match it exactly but the vocabulary persists.

**Example:** Discussing whether an attack happens at "Layer 2" or "Layer 7" implicitly invokes the OSI model.

#### OSINT

Open-Source Intelligence, the collection and analysis of publicly available information from sources such as websites, social media, and public records. It is used both offensively and defensively.

See also: Threat Intelligence.

**Example:** An OSINT investigation links infrastructure used in two intrusions through shared domain registrations and SSL-certificate metadata.

#### OT Security

The security discipline focused on operational technology environments, where availability and safety dominate and many enterprise IT techniques do not apply directly. It blends process knowledge with cybersecurity.

See also: ICS Security, Operational Technology.

**Example:** OT-security practices stress passive monitoring, careful change management, and segmentation from corporate IT.

#### Output Encoding

The practice of encoding data appropriately for the context into which it is being inserted, such as HTML, URL, or SQL contexts. It prevents data from being reinterpreted as code.

See also: Input Validation.

**Example:** HTML-encoding user comments before rendering them in a page prevents XSS even when the comment includes characters like `<` and `>`.

#### OWASP Top Ten

A community-maintained list of the most critical web application security risks, updated periodically to reflect prevailing threats. It is widely used as a baseline for awareness and assessment.

See also: CWE Top 25.

**Example:** "Broken Access Control" topped the most recent OWASP Top Ten and drove many teams to audit their authorization logic.

#### PaaS Security

The customer-side security concerns of Platform-as-a-Service offerings, where the provider manages OS and runtime and the customer focuses on application code, data, and identity. Application-layer security and configuration dominate.

See also: Shared Responsibility Model.

**Example:** Securing application secrets and IAM for a Heroku-deployed app is PaaS-security work.

#### Packet Capture

The recording of network traffic to disk for later analysis, used in forensics, troubleshooting, and detection engineering. Scale and storage are operational challenges.

**Example:** During an incident, the SOC pulls packet captures from sensors at the egress point to reconstruct an attacker's exfiltration channel.

#### Packet Sniffing

The capture and inspection of network traffic, used legitimately for diagnostics and illegitimately for eavesdropping. Encrypted protocols sharply reduce the value of passive sniffing.

**Example:** A network engineer uses Wireshark to packet-sniff traffic on a span port and diagnose a misbehaving application.

#### Padding Scheme

A method for extending plaintext to fill a complete block before encryption with a block cipher in modes like CBC. Improper padding handling can leak information through padding-oracle attacks.

**Example:** PKCS#7 padding appends bytes whose value equals the number of padding bytes added.

#### Parameterized Query

A database access pattern in which the query structure is sent separately from the parameter values, so values are never interpreted as SQL. It is the canonical structural defense against SQL injection.

See also: SQL Injection.

**Example:** Calling `prepare("SELECT * FROM users WHERE id = ?")` and binding `id` separately yields a parameterized query.

#### Passkey

A user-friendly form of FIDO2 credential synced across a user's devices through a platform or password manager, replacing passwords for many sites. The private key is bound to the user but portable across their devices.

See also: FIDO2.

**Example:** A user signs into a website with a passkey stored in iCloud Keychain, authenticating with Face ID instead of a password.

#### Password Authentication

The verification of identity by demonstrating knowledge of a shared secret. It remains common but is best paired with additional factors due to credential theft and reuse.

See also: Multi-Factor Authentication.

**Example:** A user typing a password into a login form performs password authentication.

#### Password Hashing

The process of transforming a password into a stored value using a slow, salted hash so that database leaks do not directly reveal passwords. Modern schemes such as bcrypt and Argon2 are tunable in cost.

See also: Bcrypt, Argon2, Salting.

**Example:** A web app stores Argon2id hashes of user passwords, never the passwords themselves.

#### Password Policy

A set of rules governing how passwords are chosen, stored, rotated, and recovered, ideally informed by current research rather than legacy assumptions. Modern guidance emphasizes length over forced rotation.

See also: Password Authentication.

**Example:** A modern password policy might require a minimum length, screen against breached-password lists, and forgo periodic forced rotation.

#### PASTA

The Process for Attack Simulation and Threat Analysis, a seven-stage risk-centric threat-modeling methodology that aligns business objectives with technical threats. It emphasizes attacker viewpoints and likely exploit paths.

See also: Threat Modeling.

**Example:** A bank uses PASTA to align its fraud risk goals with technical threat scenarios when modeling a new mobile banking feature.

#### Patch Management

The process of identifying, testing, and deploying software updates to remediate vulnerabilities and bugs across an environment. Cadence, exception handling, and verification are operational concerns.

**Example:** A patch-management program applies critical security updates within seven days of release across all internet-facing servers.

#### PCI-DSS

The Payment Card Industry Data Security Standard, a contractual standard mandating specific security controls for organizations that store, process, or transmit cardholder data. Levels vary with transaction volume.

**Example:** Tokenizing card numbers and limiting the cardholder data environment reduces PCI-DSS scope for a merchant.

#### Penetration Testing

An authorized, simulated attack against a system or organization to identify exploitable weaknesses and demonstrate impact. Scope, rules of engagement, and reporting are defined in advance.

See also: Red Team, Vulnerability Management.

**Example:** A penetration test of a new web application uncovers a chain of vulnerabilities allowing an attacker to read other users' records.

#### Perfect Forward Secrecy

A property of key-exchange protocols in which compromise of long-term keys does not compromise the confidentiality of past sessions. It is achieved by deriving session keys from ephemeral parameters.

See also: Key Exchange.

**Example:** TLS 1.3 always uses ephemeral Diffie-Hellman, ensuring captured ciphertext cannot be decrypted later even if the server's private key is stolen.

#### Persistence Mechanism

A technique that allows an attacker to maintain access across reboots, credential changes, and reimaging. Mechanisms include scheduled tasks, services, registry keys, and rogue accounts.

**Example:** Installing a malicious systemd service that re-establishes a backdoor on every boot is a persistence mechanism.

#### Phishing

A social-engineering attack delivered via email, message, or web that lures victims into disclosing credentials, installing malware, or transferring funds. It is the most common initial-access technique.

See also: Spear Phishing.

**Example:** An email impersonating IT and linking to a fake login page is a phishing attempt.

#### Physical Control

A control that protects facilities and hardware from physical access, theft, or environmental damage. Locks, badge readers, fences, fire suppression, and surveillance fall in this category.

See also: Technical Control, Administrative Control.

**Example:** A biometric lock on a data center door is a physical control limiting who can touch the servers.

#### PICERL Lifecycle

A six-phase incident-response model — Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned — that organizes activities across an incident's life. It is a popular evolution of the SANS lifecycle.

See also: Incident Response.

**Example:** Post-incident reviews follow the PICERL lifecycle to ensure each phase's outcomes are captured and improved.

#### PKI

Public Key Infrastructure, the combination of certificate authorities, registration processes, repositories, and revocation mechanisms that distribute and manage public keys at scale. It enables trust in identities across organizations.

See also: Certificate Authority.

**Example:** A government PKI issues certificates that allow citizens to authenticate and sign documents in online portals.

#### Plaintext

The original, readable form of a message or data before any cryptographic transformation. It is what encryption hides and what decryption recovers.

Contrast with: Ciphertext.

**Example:** The string "transfer $1000 to account 12345" is plaintext that an application encrypts before transmission.

#### Port Scanning

The probing of network ports on a target to discover open services and infer the system's footprint. It is a standard early reconnaissance step in both offensive and defensive testing.

**Example:** Running `nmap` against a subnet to enumerate listening services on each host is port scanning.

#### Post-Quantum Cryptography

A class of cryptographic algorithms designed to remain secure against attacks by both classical and quantum computers. NIST has selected initial standards across signatures and key encapsulation.

See also: Quantum Threat, Lattice-Based Crypto.

**Example:** Modern protocols are adopting hybrid handshakes combining classical key exchange with a post-quantum scheme like ML-KEM.

#### Power Analysis Attack

A side-channel attack that extracts secrets — often cryptographic keys — from a device's power consumption traces during operation. Smart cards have historically been vulnerable to differential power analysis.

See also: Side-Channel Attack.

**Example:** A researcher recovers an AES key from a smart card by capturing thousands of power traces during encryptions and applying differential analysis.

#### Preimage Resistance

The property of a hash function that, given an output, finding any input mapping to it is computationally infeasible. It protects hashed passwords and commitment schemes.

See also: Collision Resistance.

**Example:** Even with a stolen SHA-256 hash of a strong password, an attacker cannot feasibly recover the original.

#### Pretexting

A social-engineering technique in which the attacker invents a believable backstory to justify the requested information or action. It is often a building block in other attacks.

See also: Social Engineering.

**Example:** An attacker pretexting as an auditor "needing to verify production credentials" tries to talk an engineer into sharing them.

#### Preventive Control

A control whose purpose is to stop incidents from occurring, such as access enforcement, encryption of data at rest, or input validation. It acts before the threat materializes.

Contrast with: Detective Control.

**Example:** A firewall blocking inbound traffic to internal servers is a preventive control.

#### Privacy by Design

A framework articulating that privacy considerations be embedded into systems from the outset rather than bolted on later. It pairs with privacy engineering to translate principles into practice.

See also: Privacy Engineering.

**Example:** Default-private settings on a new social feature instead of default-public is an application of privacy by design.

#### Privacy Engineering

The application of engineering practices to embed privacy properties — minimization, purpose limitation, transparency — into systems by design. It complements legal and policy work with technical realization.

See also: Privacy by Design, Data Minimization.

**Example:** A team applying privacy engineering to a feature designs it to avoid collecting precise location when coarse location suffices.

#### Private Key

The secret half of an asymmetric key pair, held by exactly one party and used to decrypt messages encrypted to the corresponding public key or to produce digital signatures. Disclosure undermines the security of every operation that depends on it.

See also: Public Key, Asymmetric Cryptography.

**Example:** A web server stores its TLS private key in a hardened directory and never transmits it.

#### Privilege Creep

The gradual accumulation of access rights by users as they change roles or projects, leaving them with broader privileges than needed. Periodic access reviews counter it.

See also: Least Privilege.

**Example:** An engineer who has rotated through three teams without losing previous group memberships shows privilege creep.

#### Privilege Escalation

An adversary technique that elevates an attacker's privileges within a system from a lower level to a higher one, such as from user to administrator. It is often a prerequisite to broader objectives.

**Example:** Exploiting a kernel vulnerability from an unprivileged shell to gain root is privilege escalation.

#### Process Isolation

The OS guarantee that one process cannot directly read or modify another's memory or resources without authorization. Virtual memory and access control are foundational mechanisms.

See also: Memory Protection.

**Example:** Two browser tabs as separate processes cannot directly access each other's memory thanks to process isolation enforced by the kernel.

#### Prompt Injection

An attack on LLM-based systems in which adversary-controlled content embedded in inputs alters the model's behavior, often overriding system instructions. Indirect prompt injection delivers the payload via documents the model retrieves.

See also: AI Security.

**Example:** A web page contains hidden instructions that an LLM-based agent retrieves and follows, causing it to leak data — that is prompt injection.

#### Proxy Server

An intermediary that forwards client requests to servers on their behalf, often providing caching, filtering, and policy enforcement. Forward proxies serve outbound traffic; reverse proxies serve inbound.

See also: Reverse Proxy.

**Example:** A corporate web proxy inspects and logs employee browsing while enforcing acceptable-use policy.

#### Psychological Acceptability

The principle that security controls must be usable enough that legitimate users do not work around them. Hostile usability erodes security in practice.

**Example:** A password policy so onerous that staff write passwords on sticky notes is psychologically unacceptable and net-negative for security.

#### Public Key

The shareable half of an asymmetric key pair, used by senders to encrypt messages for the holder of the corresponding private key or to verify signatures the private key produced. It does not need to be kept secret.

See also: Private Key, Asymmetric Cryptography.

**Example:** A user publishes their PGP public key on a key server so colleagues can send them encrypted email.

#### Purple Team

A collaborative model in which red and blue teams work together iteratively, with the red team's actions informing the blue team's detections in near real time. It accelerates defensive learning.

See also: Red Team, Blue Team.

**Example:** A purple-team week sees red-team operators sharing each technique with defenders so they can build and tune detections immediately.

#### Quantum Threat

The risk that sufficiently capable quantum computers, once available, will break widely used public-key cryptosystems such as RSA and ECC by efficiently solving the hard problems they rely on. The risk motivates migration to post-quantum cryptography.

See also: Post-Quantum Cryptography.

**Example:** "Harvest-now, decrypt-later" attacks store encrypted traffic today against the quantum threat of future decryption.

#### Race Condition

A defect arising when the correctness of a program depends on the relative timing of concurrent operations, allowing an attacker to interleave events and bypass checks. Security-relevant race conditions often involve shared state and external resources.

See also: TOCTOU.

**Example:** Two concurrent requests to deduct from the same account can both pass a balance check before either applies its update, allowing an over-withdrawal.

#### RBAC

Role-Based Access Control, a model in which permissions are assigned to roles and users acquire permissions by being assigned to roles. It scales administration in organizations with stable job functions.

See also: ABAC.

**Example:** Granting "billing-admin" role to an accountant gives them all permissions associated with that role under RBAC.

#### Red Team

A group of security professionals that emulates real-world adversaries against an organization to test detection and response capabilities holistically. Red teams operate with broader scope and stealth than typical pentests.

See also: Blue Team, Purple Team.

**Example:** A red-team engagement against a bank reproduces a likely threat actor's TTPs, including phishing, lateral movement, and exfiltration attempts.

#### Reflected XSS

A cross-site scripting variant where the payload is included in a request and reflected back in the response without persistence, typically delivered via a crafted link. Victims must follow the malicious URL to be affected.

See also: Cross-Site Scripting.

**Example:** A search page that echoes the query into HTML without escaping allows an attacker to send a victim a link that triggers script execution.

#### Responsible Disclosure

A vulnerability-handling practice in which a researcher privately reports a flaw to the vendor and allows reasonable time for a fix before publishing details. Coordinated disclosure formalizes timelines and communication.

**Example:** A researcher emails a vendor with a flaw and a 90-day disclosure timeline, working with the vendor to coordinate publication after the patch.

#### Reverse Proxy

A proxy positioned in front of one or more origin servers that accepts client requests and forwards them after policy enforcement, load balancing, or termination of TLS. It hides backend topology and adds defensive capabilities.

See also: Proxy Server.

**Example:** A reverse proxy in front of a web cluster terminates TLS, applies a WAF, and load-balances requests to backend servers.

#### Risk

The combination of the likelihood that a threat exploits a vulnerability and the impact if it does. Security programs use risk to prioritize where to invest defensive effort.

See also: Likelihood, Impact, Risk Assessment.

**Example:** A high-likelihood phishing campaign against an executive whose account controls wire transfers represents a high risk to the company.

#### Risk Acceptance

A risk treatment in which the organization formally chooses to live with a risk because the cost of further treatment outweighs the expected benefit. It is documented and reviewed periodically.

See also: Risk Mitigation.

**Example:** A small business may accept the residual risk of localized power outages rather than invest in a full uninterruptible power supply.

#### Risk Assessment

A structured evaluation of assets, threats, vulnerabilities, likelihoods, and impacts to produce a prioritized view of organizational risk. Output guides control selection and investment.

See also: Risk.

**Example:** An annual risk assessment finds that ransomware against unpatched servers is the top-priority risk and recommends accelerated patching.

#### Risk Avoidance

A risk treatment that eliminates a risk by not undertaking the activity that creates it, such as discontinuing a feature or declining a market. It removes the exposure entirely.

See also: Risk Mitigation.

**Example:** Choosing not to enter a jurisdiction with prohibitive data-handling requirements is risk avoidance.

#### Risk Mitigation

A risk treatment that reduces likelihood, impact, or both through controls. It is one of four broad treatment options alongside transfer, acceptance, and avoidance.

See also: Risk Transfer, Risk Acceptance, Risk Avoidance.

**Example:** Deploying MFA to mitigate the risk of credential-based account takeover is risk mitigation.

#### Risk Register

A maintained record of identified risks, their assessment, owners, treatment, and status. It is a central artifact of a risk-management program.

See also: Risk Assessment.

**Example:** The CISO reviews the risk register quarterly to confirm that high risks have current owners and treatment plans.

#### Risk Transfer

A risk treatment that shifts financial or operational impact to another party, typically through insurance or contractual indemnification. The underlying risk often remains; the financial exposure changes hands.

See also: Risk Mitigation.

**Example:** Purchasing cyber-insurance to cover breach response and notification costs is a risk-transfer step.

#### Rogue Access Point

An unauthorized wireless access point connected to a network, either maliciously planted or installed by well-meaning users. It can bypass perimeter controls and capture credentials.

See also: Wireless Security.

**Example:** An attacker plants a rogue access point cloning a corporate SSID near the lobby to capture employee credentials.

#### Rowhammer

A class of attack that exploits electrical interference between adjacent DRAM rows to flip bits in memory the attacker is not authorized to modify. It crosses isolation boundaries via hardware physics rather than software bugs.

**Example:** Rowhammer has been used to escalate privileges from a userspace process to kernel by flipping bits in page-table entries.

#### RPKI

The Resource Public Key Infrastructure, a system in which IP address holders cryptographically authorize specific autonomous systems to originate routes for their prefixes. Validating routers can drop invalid announcements.

See also: BGP Security.

**Example:** A regional internet registry issues an RPKI Route Origin Authorization specifying which ASN may announce a given IP prefix.

#### RPO

Recovery Point Objective, the maximum acceptable amount of data loss measured in time between the last backup or replication point and the disruption. RPOs guide backup frequency and replication design.

See also: RTO.

**Example:** A 15-minute RPO for the order database requires replication or backups at least every 15 minutes.

#### RSA

A widely used asymmetric algorithm based on the practical difficulty of factoring the product of two large primes. It supports both encryption and signatures and remains common in PKI.

See also: Public Key, Private Key.

**Example:** A 2048-bit RSA key is commonly used to sign X.509 certificates issued to web servers.

#### RTO

Recovery Time Objective, the maximum acceptable duration that a business process or system can be down following a disruption. RTOs guide architectural and operational investment.

See also: RPO.

**Example:** A four-hour RTO for the customer portal means recovery procedures must restore service within four hours of an outage.

#### Runbook

A concrete, step-by-step procedure for handling a specific type of incident or operational scenario. Runbooks reduce variance and accelerate response under pressure.

See also: Incident Response Plan.

**Example:** A "ransomware on workstation" runbook lists specific commands and decisions for isolation, evidence collection, and reimaging.

#### SaaS Security

The customer-side security concerns of Software-as-a-Service offerings, where the provider runs the application and the customer manages users, data classification, and configuration. Identity, sharing settings, and data handling are central.

See also: Shared Responsibility Model.

**Example:** Configuring SSO, MFA, and data-loss prevention in Google Workspace is SaaS-security work.

#### Salting

The practice of adding a unique, random value to each password before hashing, so identical passwords produce different stored hashes. Salts defeat precomputed rainbow tables.

See also: Password Hashing.

**Example:** Storing a 16-byte random salt alongside each hashed password prevents an attacker from identifying users who share the same password.

#### SAML

Security Assertion Markup Language, an XML-based standard for exchanging authentication and authorization assertions between identity providers and service providers. It is widely used in enterprise SSO.

See also: Single Sign-On, Federated Identity.

**Example:** A corporate SSO logs employees into Salesforce by sending a SAML assertion from the company IdP.

#### SBOM

A Software Bill of Materials, a structured inventory of the components — including versions and dependencies — that compose a piece of software. SBOMs support vulnerability response and license tracking.

**Example:** When Log4Shell was disclosed, organizations with SBOMs could quickly identify which products contained vulnerable Log4j versions.

#### SCADA Security

The security of Supervisory Control and Data Acquisition systems used to monitor and control geographically distributed industrial processes. SCADA networks often use legacy protocols with limited authentication.

See also: ICS Security.

**Example:** A water utility upgrades its SCADA security by adding authentication, encryption, and monitoring on previously cleartext protocols.

#### Secure Boot

A boot-time verification process that ensures each loaded component — bootloader, kernel, drivers — is signed by a trusted authority before execution. It defeats unauthorized boot-time tampering.

See also: Measured Boot.

**Example:** UEFI Secure Boot prevents an attacker who replaces the bootloader from running unsigned code at startup.

#### Secure Code Review

A peer review focused on identifying security-relevant defects, including authentication, authorization, input handling, and cryptographic-API misuse. It complements automated analysis with human judgment about context and intent.

**Example:** A reviewer flags a new endpoint that accepts a user-supplied ID without checking ownership, a class of bug static tools often miss.

#### Secure Coding

The practice of writing code in ways that avoid known categories of vulnerability, such as input validation flaws, memory safety issues, and injection. Language choice, libraries, and review discipline all contribute.

See also: OWASP Top Ten, CWE Top 25.

**Example:** Using parameterized queries instead of string concatenation is a basic secure-coding habit that defeats SQL injection.

#### Secure Computation

A set of cryptographic techniques, including secure multiparty computation, that let multiple parties jointly compute a function over their inputs without revealing the inputs to each other. It enables collaboration without disclosure.

**Example:** Two banks compute joint fraud statistics on shared customer overlap without either bank exposing its customer list.

#### Secure Design

The practice of choosing architectures and patterns that minimize attack surface, enforce least privilege, and fail safely, before any code is written. It is cheaper to fix design flaws on a whiteboard than after deployment.

**Example:** Deciding that an admin API will live on a separate, mTLS-only network is a secure-design choice rather than a coding choice.

#### Secure Enclave

An isolated execution environment within a processor that protects code and data from the rest of the system, including a privileged operating system. Examples include Apple's Secure Enclave Processor.

See also: Trusted Execution Env.

**Example:** Touch ID and Face ID match biometric templates inside the Secure Enclave so the host OS never sees them.

#### Secure SDLC

A software development lifecycle that integrates security activities — threat modeling, secure design, code review, testing, and response — into every phase rather than appending them at the end. The goal is to reduce vulnerabilities introduced during development.

See also: Secure Design, Secure Coding.

**Example:** A secure SDLC includes design-time threat modeling, mandatory peer review, automated static analysis in CI, and pre-release penetration testing.

#### Security Audit

An independent examination of security controls, processes, or evidence against a defined criterion to provide assurance about their state. It is broader than a vulnerability assessment.

**Example:** An external auditor conducts an annual security audit against ISO 27001 and issues findings to leadership.

#### Security Awareness Training

Education programs that help employees recognize and respond appropriately to common threats such as phishing, social engineering, and data handling errors. Effectiveness depends on relevance and reinforcement, not annual click-through.

**Example:** A security awareness training program runs monthly simulated phishing campaigns and provides immediate, contextual feedback to employees who click.

#### Security Control

A safeguard or countermeasure designed to reduce risk by preventing, detecting, or correcting incidents. Controls are categorized by function and by implementation type.

See also: Preventive Control, Detective Control, Corrective Control.

**Example:** Multi-factor authentication is a security control that reduces the likelihood of account takeover.

#### Security Economics

The study of how incentives, costs, and externalities shape the security behavior of producers, defenders, and attackers. It explains many security failures as rational responses to misaligned incentives.

**Example:** Software vendors ship insecure defaults because customers do not pay extra for security and bug-fix costs fall on others.

#### Security Metrics

Quantitative measures of security posture, control effectiveness, and program performance, used to inform decisions and report outcomes. Good metrics are actionable and resistant to gaming.

**Example:** Mean time to detect, mean time to contain, and percentage of critical patches applied within SLA are common security metrics.

#### Security Misconfiguration

A vulnerability arising from insecure default settings, incomplete hardening, or accidental exposure of administrative interfaces. It is consistently a top cause of breaches.

**Example:** Leaving a cloud storage bucket with public read access exposes any data stored within it as security misconfiguration.

#### Security Monitoring

The continuous observation of systems, networks, and applications to detect signs of attack, misuse, or failure. It feeds incident response with timely signal.

See also: SIEM, EDR.

**Example:** A SOC's security-monitoring stack ingests logs from servers, endpoints, network sensors, and cloud services into a SIEM.

#### Security Operations Center

A team and facility — physical or virtual — responsible for around-the-clock monitoring, detection, and response to security events. Tier structure and runbooks shape its operations.

See also: SIEM.

**Example:** A 24x7 SOC triages alerts from the SIEM and escalates incidents to engineers and management as appropriate.

#### Security Policy

A high-level statement of an organization's security objectives, expectations, and roles, signed off by leadership. Policies are enacted through standards, procedures, and controls.

See also: Acceptable Use Policy, Security Standard.

**Example:** A corporate information-security policy commits the organization to protect customer data and assigns the CISO authority to define standards.

#### Security Procedure

Step-by-step instructions for performing a security-relevant task, such as enrolling a new user or responding to a malware alert. Procedures make behavior reproducible across staff.

See also: Security Standard.

**Example:** A security procedure for offboarding lists the systems to disable, accounts to revoke, and assets to recover when an employee leaves.

#### Security Program Mgmt

The governance, planning, and execution discipline that operates an organization's security program over time, balancing risk, resources, and outcomes. It encompasses strategy, metrics, staffing, and reporting.

See also: CISO Role.

**Example:** An annual security program-management cycle sets objectives, allocates budget, tracks metrics, and reports outcomes to the board.

#### Security Requirement

A property a system must possess to mitigate identified threats, expressed as a verifiable specification rather than a wish. Requirements drive design, implementation, and verification.

**Example:** "Session tokens are invalidated server-side within 60 seconds of logout" is a security requirement that can be tested.

#### Security Standard

A document specifying mandatory technical or procedural requirements that implement a security policy. Standards translate policy intent into testable settings.

See also: Security Policy, Security Procedure.

**Example:** A security standard mandates AES-256 for data at rest and minimum TLS 1.2 for data in transit across all systems.

#### SELinux

Security-Enhanced Linux, a kernel-level mandatory access control implementation that confines processes through fine-grained policies labeling subjects and objects. It limits the damage from compromised services.

See also: AppArmor.

**Example:** SELinux in enforcing mode can prevent a compromised web server from reading `/etc/shadow` even when it runs as root.

#### Sensitive Data Exposure

A vulnerability in which confidential information is stored or transmitted without adequate protection, leading to disclosure to unauthorized parties. It often results from missing encryption or excessive logging.

**Example:** Logging full credit card numbers to application logs is sensitive data exposure even if those logs are otherwise access-controlled.

#### Separation of Duties

A control that divides a sensitive task across two or more parties so no single person can complete it alone. It deters insider abuse and reduces the impact of a single account compromise.

**Example:** Initiating a wire transfer requires one employee to enter the request and a second to approve it before funds move.

#### SHA-2

A family of cryptographic hash functions standardized by NIST including SHA-224, SHA-256, SHA-384, and SHA-512. SHA-256 is the most widely deployed member.

See also: Hash Function, SHA-3.

**Example:** Bitcoin proof-of-work uses double SHA-256 hashing of block headers.

#### SHA-3

A family of cryptographic hash functions based on the Keccak permutation, standardized by NIST as a structurally different alternative to SHA-2. It provides similar output sizes via a different internal design.

See also: SHA-2, Hash Function.

**Example:** SHA-3-256 is used in some post-quantum-related schemes and Ethereum's Keccak variant.

#### Shared Responsibility Model

The framework dividing security duties between cloud providers and customers, with providers responsible for "security of the cloud" and customers for "security in the cloud." The exact division varies by service tier.

See also: IaaS Security, PaaS Security, SaaS Security.

**Example:** In IaaS, the provider secures hypervisors and physical hardware while the customer secures guest OSes, applications, and data.

#### Side-Channel Attack

An attack that derives secret information from unintended physical or computational signals such as timing, power consumption, electromagnetic emanation, or cache behavior. Side channels often defeat algorithmically secure systems.

See also: Timing Attack, Power Analysis Attack.

**Example:** Spectre exploits cache side channels arising from speculative execution to leak data across security boundaries.

#### SIEM

Security Information and Event Management, a platform that aggregates and analyzes security-relevant data to support detection, investigation, and reporting. Modern SIEMs blend rule-based and analytic detection.

See also: Security Operations Center, SOAR.

**Example:** Splunk and Microsoft Sentinel are SIEMs that ingest logs and apply detection content authored by security teams.

#### Signature-Based Detection

A detection approach that matches observed activity against a library of known-bad patterns. It is precise on known threats and blind to novel ones.

Contrast with: Anomaly-Based Detection.

**Example:** Antivirus software identifying a file as malware based on a known hash is signature-based detection.

#### Single Sign-On

An authentication mechanism in which a user authenticates once to an identity provider and gains access to multiple applications without re-entering credentials. SSO improves usability and centralizes credential handling.

See also: Federated Identity, SAML.

**Example:** An employee signs in to Okta and immediately accesses email, code repositories, and HR systems through SSO.

#### Smart Grid Security

The security of modernized electrical grids that integrate sensors, communications, and computation across generation, transmission, and distribution. It blends OT security with large-scale telemetry and cyber-physical concerns.

See also: ICS Security, Critical Infrastructure.

**Example:** Securing communications between substation devices and control centers against tampering and disruption is smart-grid-security work.

#### SOAR

Security Orchestration, Automation, and Response, a platform that automates routine response actions and connects security tools through playbooks. It reduces analyst toil on repetitive tasks.

See also: SIEM, Incident Response.

**Example:** A SOAR playbook automatically isolates an endpoint and creates a ticket when EDR detects ransomware behavior.

#### SOC 2

A reporting framework from the AICPA in which auditors assess service organizations against trust service criteria covering security, availability, confidentiality, processing integrity, and privacy. SOC 2 reports are common in B2B SaaS.

**Example:** A SaaS startup undergoes a SOC 2 Type II audit to support enterprise sales.

#### Social Engineering

Attacks that manipulate human behavior — through deception, urgency, or authority — to elicit information or actions that compromise security. The vulnerability targeted is psychological rather than technical.

See also: Phishing, Pretexting.

**Example:** Calling a help desk pretending to be a panicked executive to coax a password reset is social engineering.

#### Software Composition Analysis

The analysis of an application's third-party and open-source dependencies to identify known vulnerabilities, license issues, and supply-chain risks. SCA tools rely on dependency manifests and vulnerability databases.

See also: Dependency Scanning, SBOM.

**Example:** SCA tools alerted thousands of teams to vulnerable Log4j versions buried deep in transitive dependencies.

#### Software Supply Chain

The set of people, processes, and components involved in producing and delivering software, including dependencies, build systems, registries, and distribution channels. Attacks anywhere in the chain can compromise downstream consumers.

See also: SBOM.

**Example:** The SolarWinds incident inserted malicious code into the build pipeline of a widely used product, illustrating supply-chain risk.

#### Spear Phishing

A targeted phishing attack tailored to a specific individual or small group, leveraging personal context to increase plausibility. Whaling is the variant aimed at executives.

See also: Phishing.

**Example:** An attacker referencing a recent invoice and a real vendor name in a message to a finance employee is spear phishing.

#### SQL Injection

An injection vulnerability where attacker-controlled input alters the structure of a SQL query, allowing data theft, modification, or authentication bypass. Parameterized queries are the structural fix.

See also: Injection Attack, Parameterized Query.

**Example:** Submitting `' OR '1'='1` in a login form whose backend concatenates input into SQL can bypass password checks.

#### SSH

The Secure Shell protocol, providing authenticated, encrypted remote access to hosts and a substrate for tunnels and file transfer. Public-key authentication is its strongest credential mode.

**Example:** A system administrator logs into a Linux server over SSH using a public-key pair stored on a hardware token.

#### SSRF

Server-Side Request Forgery, a vulnerability in which an attacker induces the server to make HTTP requests to arbitrary destinations, often reaching internal services. Cloud metadata endpoints are common SSRF targets.

**Example:** A URL-fetching feature that does not restrict targets can be abused to query AWS instance metadata and exfiltrate IAM credentials.

#### Stack Canary

A random value placed before the saved return address on the stack and verified at function return; corruption indicates an overflow and triggers process termination. It is a low-cost mitigation against classic stack smashing.

See also: ASLR, DEP.

**Example:** A function compiled with stack-canary protection aborts if a buffer overflow overwrites the canary on the way to the return address.

#### Stack Overflow

A buffer overflow that occurs in a function's stack frame, often allowing attackers to overwrite the saved return address and redirect execution. It was the canonical exploit primitive in early memory-corruption attacks.

See also: Buffer Overflow.

**Example:** Smashing a stack-allocated buffer to overwrite the return address has been a staple exploitation technique for decades.

#### Stateful Firewall

A firewall that tracks the state of network connections and filters based on whether packets belong to established flows, not just per-packet headers. It enables more precise rules than stateless filtering.

See also: Firewall.

**Example:** A stateful firewall allows return traffic from a server only if it is part of a connection that the firewall previously approved outbound.

#### Static Analysis

The examination of source code or compiled artifacts without executing them, using tools that flag patterns associated with bugs and vulnerabilities. It scales review across large codebases at the cost of false positives.

See also: Dynamic Analysis.

**Example:** A linter that flags every concatenation of strings into a SQL query is performing static analysis.

#### Stored XSS

A cross-site scripting variant where the malicious payload is persisted on the server (e.g., in a database) and served to subsequent visitors. Its reach can be wide because every viewer of the affected page is targeted.

See also: Cross-Site Scripting.

**Example:** A forum that lets users post raw HTML in profiles can be weaponized to attack everyone who views a malicious profile.

#### Stream Cipher

A symmetric cipher that produces a keystream of pseudorandom bits which is combined (typically via XOR) with the plaintext bit by bit or byte by byte. It is well-suited to streaming data of unknown length.

**Example:** ChaCha20 is a modern stream cipher used in TLS and disk encryption.

#### STRIDE

A threat-modeling taxonomy developed at Microsoft that categorizes threats as Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege. It gives reviewers a checklist of attack categories per component.

See also: Threat Modeling.

**Example:** Applying STRIDE to a login service prompts the team to consider session token forgery (spoofing) and unauthorized role changes (elevation of privilege).

#### Supply Chain Risk

The risk that products, components, or services entering an organization carry compromise from upstream sources, including software libraries, hardware, and managed services. It is broader than third-party risk because it includes indirect suppliers.

See also: Software Supply Chain, Hardware Supply Chain.

**Example:** A compromised build server at a software vendor inserting backdoors into shipped binaries is a supply-chain-risk event.

#### Symmetric Cryptography

A cryptographic style in which the same secret key is used both to encrypt and to decrypt data. It is fast and key-efficient but requires a secure channel to share the key.

Contrast with: Asymmetric Cryptography.

**Example:** A backup utility encrypts files with AES using a single key shared between the backup server and the restore tool.

#### System Hardening

The reduction of a system's attack surface by disabling unused services, removing unnecessary software, applying secure settings, and restricting permissions. Hardening guides codify the recommended steps.

See also: CIS Benchmarks, Baseline Configuration.

**Example:** Following a hardening guide on a new server disables Telnet, enforces password complexity, and turns on auditing.

#### Systems Thinking

An analytic approach that examines how components interact and how emergent properties arise from those interactions, rather than studying parts in isolation. In security, it surfaces vulnerabilities at the seams between components.

**Example:** A weakness in how a load balancer forwards headers to backend servers may be invisible when each component is reviewed alone but exploitable when they are studied together.

#### Tabletop Exercise

A discussion-based exercise in which stakeholders walk through a hypothetical incident scenario to test plans, roles, and decision-making. It surfaces gaps without requiring live systems.

See also: Incident Preparation.

**Example:** A tabletop exercise simulates a ransomware incident affecting payroll and reveals confusion about who can authorize ransom-payment decisions.

#### TCP

The Transmission Control Protocol, a connection-oriented transport protocol providing reliable, ordered, byte-stream delivery between endpoints. Most application protocols, including HTTP, are built on TCP.

See also: UDP.

**Example:** A web browser opens a TCP connection to port 443 of a server before initiating a TLS handshake.

#### TCP/IP Model

The four-layer model — link, internet, transport, application — that describes the actual stack of protocols underlying the modern internet. It is more pragmatic than the OSI model.

See also: OSI Model.

**Example:** TCP and UDP at the transport layer of the TCP/IP model carry application data over IP at the internet layer.

#### Team Collaboration

The set of practices and skills enabling effective joint work across roles, time zones, and organizations, including communication norms, shared tooling, and conflict resolution. Security work depends on it because no one role sees the whole picture.

**Example:** Effective team collaboration during an incident keeps responders, communications, legal, and leadership aligned despite stress and incomplete information.

#### Technical Communication

The discipline of conveying technical information clearly to varied audiences — engineers, managers, regulators, end users — through writing, diagrams, and presentations. In cybersecurity it is essential for incident reports, threat models, and stakeholder engagement.

**Example:** A penetration-test report uses technical communication to present findings, evidence, and remediation in language each audience can act on.

#### Technical Control

A control implemented in hardware or software, such as authentication systems, encryption, firewalls, and access control lists. It enforces policy through automated mechanism.

See also: Administrative Control, Physical Control.

**Example:** Disk encryption configured by Group Policy is a technical control protecting data at rest.

#### Third-Party Risk

The risk introduced by external organizations that have access to systems, data, or premises, including suppliers, contractors, and partners. Many breaches originate or pivot through third parties.

See also: Vendor Risk Management, Supply Chain Risk.

**Example:** A retailer's breach via an HVAC vendor's network access is a textbook example of realized third-party risk.

#### Threat

A potential cause of an unwanted incident that may harm a system or organization. Threats are realized through threat actors using techniques against vulnerabilities.

See also: Threat Actor, Vulnerability.

**Example:** Ransomware targeting a hospital is a threat regardless of whether the hospital has been attacked yet.

#### Threat Actor

A person or group that conducts or has the intent to conduct activities harmful to an organization's assets. Categories include cybercriminals, nation-states, hacktivists, and insiders.

**Example:** A financially motivated ransomware crew operating from outside any single jurisdiction is a threat actor for hospitals and municipalities.

#### Threat Hunting

The proactive search through environments for adversary activity not surfaced by existing detections, driven by hypotheses and threat-intelligence inputs. It complements reactive monitoring.

See also: Threat Intelligence.

**Example:** A threat hunter hypothesizes credential-dumping activity and queries EDR data for the artifacts that technique typically leaves behind.

#### Threat Intelligence

The collection, analysis, and dissemination of information about adversaries, their capabilities, and their activities to inform defensive decisions. It ranges from strategic briefings to operational indicators.

See also: OSINT, Threat Hunting.

**Example:** A threat-intelligence report on a new ransomware crew helps the SOC tune detections for the group's TTPs.

#### Threat Modeling

A structured analysis activity that identifies likely threats to a system, the assets they target, and the controls that mitigate them. It produces a prioritized list of risks to address during design.

See also: STRIDE, PASTA, Attack Trees.

**Example:** Before launching a new payment API, the team threat-models likely abuses such as replay attacks, token theft, and excessive scope on access tokens.

#### Timing Attack

A side-channel attack that infers secrets from variations in how long an operation takes, such as a non-constant-time string comparison. Constant-time implementations are the standard defense.

See also: Side-Channel Attack.

**Example:** A login function that returns faster on incorrect prefixes leaks information about correct passwords through timing.

#### TLS

Transport Layer Security, the protocol that authenticates servers (and optionally clients) and encrypts data in transit between endpoints. It underpins HTTPS and many other protocols.

See also: TLS Handshake, HTTPS.

**Example:** Connecting to a banking site over HTTPS uses TLS to authenticate the server and protect form data in transit.

#### TLS Handshake

The initial exchange of messages in a TLS session that authenticates parties, negotiates parameters, and derives session keys. TLS 1.3 streamlined this to a single round trip in most cases.

See also: TLS.

**Example:** During the TLS handshake, the server presents its certificate, both parties run a key exchange, and they begin encrypted application data.

#### TOCTOU

A time-of-check to time-of-use race condition in which a resource changes between the moment a program validates it and the moment it acts on it. The fix is usually to operate on the validated handle rather than re-resolving by name.

See also: Race Condition.

**Example:** Checking that a file is not a symlink and then opening it by name is a TOCTOU vulnerability if the attacker swaps in a symlink between the two operations.

#### Trust Boundary

A point in a system where data or control crosses between zones of differing trust, requiring validation, authentication, or authorization. Many vulnerabilities live at boundaries that were assumed but not enforced.

**Example:** The boundary between a browser and a web server is a trust boundary; user input must be validated as it crosses into server logic.

#### Trusted Execution Env

A trusted execution environment (TEE) such as Intel SGX or ARM TrustZone, providing isolated execution of sensitive code with hardware-enforced confidentiality and integrity from the host OS. It supports attestation of what is running.

See also: Confidential Computing.

**Example:** A confidential database query runs inside a TEE, which produces an attestation that the host can verify before sending data.

#### Trusted Platform Module

A specialized hardware chip that provides secure key storage, measurement of boot state, and cryptographic operations isolated from the main CPU. Modern operating systems use it for disk encryption and remote attestation.

See also: Hardware Security Module.

**Example:** Windows BitLocker can seal the disk encryption key to TPM measurements so the disk only unlocks if the boot state is unchanged.

#### TTP

Tactics, Techniques, and Procedures — the patterns of behavior threat actors use across campaigns, in increasing order of specificity. TTPs are more durable indicators than file hashes or addresses.

See also: MITRE ATT&CK.

**Example:** A particular APT group's TTP includes spear-phishing with macro-laden documents followed by credential dumping via a specific tool.

#### UDP

The User Datagram Protocol, a connectionless transport protocol providing best-effort message delivery with low overhead and no built-in reliability. DNS, video streaming, and gaming commonly use it.

See also: TCP.

**Example:** A DNS resolver sends a query as a single UDP datagram and accepts the response or retries on timeout.

#### UEFI Security

The set of security features and concerns associated with the Unified Extensible Firmware Interface, the modern replacement for legacy BIOS. UEFI hosts Secure Boot and a substantial codebase that has its own attack surface.

See also: Firmware Security.

**Example:** UEFI variables stored insecurely have been abused to persist malware across operating-system reinstalls.

#### Usable Security

The study and practice of designing security mechanisms that humans can and will use correctly under realistic conditions. Mechanisms hostile to users tend to be circumvented and produce worse outcomes overall.

See also: Psychological Acceptability.

**Example:** Replacing periodic forced password changes with phishing-resistant MFA and breached-password screening is a usable-security improvement.

#### User Behavior Analytics

The application of statistical and machine-learning models to user activity data to identify anomalies suggesting compromise, misuse, or insider threat. It complements rule-based detection.

See also: Insider Threat.

**Example:** A UBA model flags an account that suddenly accesses repositories outside its normal working pattern and from an unusual location.

#### Vendor Risk Management

The practice of evaluating and overseeing the security risks that third-party suppliers introduce to an organization. It includes due diligence, contractual controls, and ongoing monitoring.

See also: Third-Party Risk.

**Example:** Before adopting a SaaS analytics tool, the company performs vendor risk management including reviewing the provider's SOC 2 report.

#### Virtualization Security

The security concerns and controls associated with hypervisors and virtual machines, including isolation between guests and protection of the management plane. Escape from a guest to the host is a high-impact concern.

See also: Hypervisor Security.

**Example:** Patching hypervisors promptly is a virtualization-security priority because a hypervisor flaw can affect every guest VM.

#### VLAN

A virtual LAN, a Layer 2 mechanism for separating broadcast domains and traffic on the same physical infrastructure. VLANs are a common building block of segmentation but rely on switch enforcement.

See also: Network Segmentation.

**Example:** Voice-over-IP phones live on a dedicated VLAN separate from user workstations on the same office switches.

#### Volumetric Attack

A DDoS variant that aims to saturate network capacity with sheer traffic volume, often using amplification through misconfigured services. Mitigation typically requires capacity beyond the target's link.

See also: DDoS Attack.

**Example:** A DNS amplification attack reflecting traffic off open resolvers can deliver hundreds of gigabits per second to a target as a volumetric attack.

#### VPN

A Virtual Private Network, a tunnel that encapsulates and encrypts traffic between endpoints across an untrusted network so it appears as if they share a private link. VPNs support remote access and site-to-site connectivity.

See also: IPsec, WireGuard.

**Example:** A remote employee's laptop establishes a VPN to corporate headquarters, after which traffic to internal services is routed through the encrypted tunnel.

#### Vulnerability

A weakness in a system, process, or control that a threat could exploit to cause harm. Vulnerabilities can be technical (a software bug), procedural, or human.

See also: Exploit.

**Example:** An unpatched remote code execution flaw in a web server is a vulnerability that any internet-borne threat may exploit.

#### Vulnerability Management

The lifecycle of identifying, prioritizing, remediating, and verifying vulnerabilities across an environment. It blends scanning, patching, and exception handling under SLAs.

See also: Vulnerability Scanning, Patch Management.

**Example:** A vulnerability-management program runs weekly authenticated scans, prioritizes by exploit-likelihood and asset criticality, and tracks remediation against SLAs.

#### Vulnerability Scanning

Automated probing of systems for known vulnerabilities, missing patches, and configuration weaknesses. It feeds vulnerability management with current findings.

See also: Vulnerability Management.

**Example:** A nightly authenticated vulnerability scan of all servers reports missing critical patches into the ticketing system.

#### Web Application Firewall

A filter specialized for HTTP traffic that inspects requests and responses for application-layer attacks such as SQL injection, XSS, and protocol abuse. WAFs operate at Layer 7 and are tuned per application.

**Example:** A WAF blocks requests containing patterns characteristic of SQL injection before they reach a vulnerable backend.

#### WireGuard

A modern VPN protocol designed for simplicity, minimal codebase, and strong cryptographic defaults. It has been merged into the Linux kernel and is widely used in commercial VPNs.

See also: VPN.

**Example:** A small company replaces its OpenVPN deployment with WireGuard for lower operational overhead and improved performance.

#### Wireless Security

The branch of network security focused on protecting Wi-Fi and other wireless transmissions from eavesdropping, unauthorized access, and rogue infrastructure. WPA3 and 802.1X are key technologies.

See also: WPA3, 802.1X.

**Example:** A campus wireless network uses WPA3-Enterprise with 802.1X to authenticate students and encrypt all traffic over the air.

#### WPA3

Wi-Fi Protected Access 3, the current generation of Wi-Fi security replacing WPA2, with improvements such as Simultaneous Authentication of Equals (SAE) to resist offline password attacks. It strengthens both personal and enterprise Wi-Fi.

See also: Wireless Security.

**Example:** WPA3-Personal uses SAE so an attacker capturing the handshake cannot run an offline dictionary attack against the network passphrase.

#### X.509 Certificate

A standardized data structure that binds a public key to identity information, signed by a certificate authority. It is the certificate format used in TLS, code signing, and many enterprise PKIs.

See also: PKI.

**Example:** Inspecting a website's TLS certificate in a browser shows its X.509 fields including subject, issuer, validity dates, and public key.

#### XDR

Extended Detection and Response, a platform that correlates telemetry across endpoints, networks, identities, and cloud workloads to detect threats spanning multiple domains. It seeks to break down tool silos.

See also: EDR.

**Example:** An XDR platform links a suspicious cloud-IAM event with endpoint behavior on the engineer's laptop into a single incident.

#### Zero Day

A vulnerability unknown to the vendor or defenders, for which no patch exists at the time of exploitation. Zero days command high value among attackers because defenses cannot anticipate them.

**Example:** A previously undisclosed flaw in a popular browser, exploited in the wild before any patch is available, is a zero-day.

#### Zero Trust Architecture

A security architecture that assumes no implicit trust based on network location and authenticates and authorizes every request based on identity and context. Perimeter is replaced by per-resource policy.

See also: Micro-Segmentation.

**Example:** In a zero-trust architecture, an employee accessing an internal app from the office is authenticated and authorized identically to one accessing it from home.

#### Zero-Knowledge Proof

A cryptographic protocol by which a prover convinces a verifier that a statement is true without revealing any information beyond the statement's truth. Modern systems use zero-knowledge proofs in authentication and blockchain applications.

**Example:** A user proves they are old enough to access a service without revealing their date of birth using a zero-knowledge age proof.

