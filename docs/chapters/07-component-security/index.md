---
title: "Component and Hardware Security"
description: "Explores the trust foundation beneath software: TPM, HSM, secure enclaves, TEEs, secure and measured boot, side-channel attacks, hardware supply chain, embedded and IoT security, attestation, and hardware roots of trust."
generated_by: claude skill chapter-content-generator
date: 2026-04-25 11:21:00
version: 0.07
---

# Component and Hardware Security

## Summary

Explores the trust foundation beneath software: TPM, HSM, secure enclaves, trusted execution environments, firmware and secure/measured boot, side-channel attacks (timing, power, cache, Rowhammer), the hardware supply chain, embedded systems, IoT security, device attestation, and hardware roots of trust.

## Concepts Covered

This chapter covers the following 19 concepts from the learning graph:

1. Hardware Security
2. Trusted Platform Module
3. Hardware Security Module
4. Secure Enclave
5. Trusted Execution Env
6. Firmware Security
7. Secure Boot
8. Measured Boot
9. UEFI Security
10. Side-Channel Attack
11. Timing Attack
12. Power Analysis Attack
13. Cache Side-Channel
14. Rowhammer
15. Hardware Supply Chain
16. Embedded Security
17. IoT Security
18. Device Attestation
19. Hardware Root of Trust

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Security Foundations: Properties, Mindset, and Risk](../01-security-foundations/index.md)
- [Chapter 4: Cryptography in Practice: PKI, TLS, and Data Protection](../04-crypto-in-practice/index.md)
- [Chapter 6: Software Assurance and Supply Chain Security](../06-software-assurance/index.md)

---

!!! mascot-welcome "Welcome to the Foundations Beneath Software"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    Welcome. Until now we have assumed that the CPU runs the instructions we wrote, that memory holds the bits we stored, and that the operating system we boot is the one we trust. This chapter questions every one of those assumptions. We will trace the trust chain down to the silicon, meet the side-channel attacks that read secrets through timing and power, and ask what it means for a device to *prove* what it is. Trust, but verify — and this chapter is where verification meets the metal.

## 1. Why Hardware Security Matters

Every security control we have studied so far — encryption, access control, integrity checks, authentication — runs as software on top of hardware. If the hardware lies, every layer above it lies with it. **Hardware security** is the discipline of designing, attesting, and defending the physical and microarchitectural foundation that software runs on. It addresses three questions that pure software security cannot answer on its own:

1. *Where do we keep secrets that even a compromised operating system cannot reach?*
2. *How does a system prove that it booted the software we expected, not malware that replaced it?*
3. *How do we keep an adversary with physical proximity to a device — a soldering iron, a logic analyzer, a refrigeration spray — from extracting our keys?*

The answers involve specialized chips, cryptographic protocols rooted in unchangeable silicon, and an awareness of *side channels* — leaks of information through timing, power, electromagnetic emanations, and even microarchitectural state that the chip's designers never intended to expose. The unifying idea is the **trust boundary**. In software security we drew trust boundaries between processes; in hardware security we draw them between regions of the same chip, between the chip and the board, between the board and the supply chain that built it.

A second unifying idea is the **root of trust**. Every chain of verification has to start somewhere — a piece of code or a key that we trust by axiom because we cannot verify what came before it. In hardware, that anchor lives in immutable silicon and is the topic the chapter returns to repeatedly. We will define it precisely in section 9, but it is worth keeping in mind from the beginning: the question of hardware security is largely the question of "what is your root of trust, and why do you trust it?"

This chapter maps directly to the **Component Security** knowledge area of the CSEC2017 / ABET CAC curriculum and complements the software-supply-chain treatment of Chapter 6 by going one layer deeper, into the hardware itself.

## 2. The Cast of Trust Anchors

Modern systems contain several specialized chips and chip features whose only job is to be trustworthy storage and computation for cryptographic operations. The names overlap, the boundaries are sometimes fuzzy, and a typical laptop or phone may contain several of them at once. Before we diagram their interactions, let's define the four main categories.

A **Trusted Platform Module (TPM)** is a small, standardized cryptographic chip (or firmware-emulated equivalent) found in essentially every modern PC and server. Defined by the Trusted Computing Group (TCG), the current standard is TPM 2.0. A TPM stores cryptographic keys, measures the boot process into special registers (PCRs — Platform Configuration Registers), generates random numbers, and can sign attestations about the system's state. A TPM is *passive* in the sense that it does not control the CPU; it is a coprocessor the CPU consults.

A **Hardware Security Module (HSM)** is a higher-assurance cousin of the TPM, typically a separate device (a PCIe card, a network appliance, or a USB token) used by enterprises and certificate authorities to protect their most sensitive keys — root signing keys, payment-network keys, root-of-trust keys for cloud key-management services. HSMs have tamper-evident and tamper-responsive packaging: opening one should zeroize the keys it holds. They are typically certified to FIPS 140-2 or FIPS 140-3, with Level 3 or Level 4 indicating physical-tamper protection.

A **Secure Enclave** is a small, isolated execution environment inside the main application processor (or in a dedicated security coprocessor on the same package). Apple's Secure Enclave Processor, Google's Titan M, and Samsung's Knox are well-known examples. Unlike a TPM, a secure enclave can *execute custom code* — typically a small, audited image — that operates on secrets the main OS never sees.

A **Trusted Execution Environment (TEE)** is the more general category that secure enclaves belong to. A TEE is a region of the main CPU that runs code in an isolated mode the rest of the system cannot inspect, with its own memory protections and attestation. Major TEEs include **Intel SGX** (since 2015), **Intel TDX** (current), **AMD SEV/SEV-SNP**, and **ARM TrustZone**. TEEs are the foundation of **confidential computing**, where workloads run encrypted even from the cloud provider hosting them — a topic we revisit briefly in Chapter 16.

The following table summarizes the trust anchors we just defined so you can compare them at a glance. Use the table as a reference; the prose above is what introduces them.

| Anchor | Form factor | Can run custom code? | Typical use | Threat model |
|--------|-------------|----------------------|-------------|--------------|
| TPM 2.0 | Discrete chip or firmware | No (fixed command set) | Boot measurement, key sealing, disk encryption keys | Software attacker, modest physical |
| HSM | PCIe / network appliance / USB | No (fixed command set) | CA root keys, payment HSMs, KMS root | Strong physical, supply-chain |
| Secure Enclave | On-package coprocessor | Yes (signed firmware only) | Biometric matching, device-bound keys, payment | Compromised main OS |
| TEE (SGX, TrustZone, SEV) | Mode of main CPU | Yes (developer code) | Confidential computing, DRM, key isolation | Compromised hypervisor / OS |

#### Diagram: Hardware Trust Anchors on a Modern System

<details markdown="1">
<summary>Layered diagram showing the relationship between TPM, HSM, secure enclave, and TEE on a typical system</summary>
Type: infographic-svg
**sim-id:** trust-anchors-overview<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A horizontal layered diagram showing a modern computing system with four trust anchors highlighted.

Layout (left to right, on a single board):

1. **Main CPU package** (large central box, slate-steel border)
   - Inside: a smaller box labeled **Application cores** (cybersecurity blue)
   - Inside: a smaller box labeled **TEE region** (amber outline) with caption "Intel SGX / TDX / AMD SEV / ARM TrustZone — runs developer code in isolation"
   - On the same package: a small box labeled **Secure Enclave / Security coprocessor** (cybersecurity blue) with caption "Apple SEP, Google Titan M, Samsung Knox — runs only signed firmware"

2. **Discrete TPM chip** (smaller box on the board, slate-steel) connected by a thin line labeled "LPC / SPI bus" to the main CPU. Caption: "Stores measurements and sealed keys. Standardized command set."

3. **External HSM** (separate box outside the main board, drawn as a 1U appliance) connected via a network or PCIe icon. Caption: "Enterprise key custody. FIPS 140-3 Level 3+. Tamper-responsive."

Above the main CPU package, a "Hardware Root of Trust" badge points down into the secure enclave / TEE region with an arrow labeled "Anchored in silicon, set at fabrication."

Color: cybersecurity blue (#1565c0) for trusted regions, amber (#ffa000) outline on TEE to indicate "depends on microcode/firmware," slate steel (#455a64) for buses and packaging.

Hover tooltips on each anchor display its main capabilities and threat model from the table above.

Responsive: 4-column desktop layout collapses to vertical stack below 800px viewport.

Implementation: Static SVG with `<title>` tooltips per element.
</details>

## 3. The Trusted Platform Module in Depth

The **TPM** earns its own section because it is the trust anchor most students will encounter first — it is on essentially every business-class PC made since 2015 and is required for Windows 11. A TPM 2.0 exposes a small set of capabilities, which together support disk encryption, secure boot verification, attestation, and secure key storage. Three of these capabilities deserve naming:

- **Sealed storage** — encrypt a key under the TPM such that decryption is only possible if the system's measured boot state matches a specified policy. If an attacker boots a different OS, the seal does not open.
- **Platform Configuration Registers (PCRs)** — special registers that can only be *extended* (not overwritten) by hashing new measurements into them. PCRs are the running tally of "what booted on this machine," and they are the basis of measured boot (next section).
- **Attestation** — the TPM can sign a quote of its current PCR values with a key that descends from a TPM-resident *Endorsement Key* installed at manufacture. A remote verifier can read this quote and decide whether the machine booted into a trustworthy state.

The TPM is not a fortress against every attack. It is connected to the CPU over a low-speed bus (LPC or SPI), and that bus can be probed with cheap equipment — the well-known *TPM sniffing* attacks read the disk encryption key in transit between the TPM and the CPU during boot. The countermeasure is *parameter encryption* (TPM 2.0 supports this) or moving the TPM logic onto the CPU package itself (firmware TPM, fTPM). It is also worth knowing that fTPMs share the main CPU and have their own bug history — for example, the 2023 *faulTPM* paper extracted keys from AMD fTPMs via voltage glitching.

Despite these limits, the TPM is enormously useful: it gives the operating system a place to store keys that survive an offline disk attack, it enables BitLocker / LUKS disk encryption with strong protection, and it underpins Windows Hello and similar passwordless authentication systems.

## 4. The Boot Chain — Where Trust Actually Starts

Before any operating system runs, a sequence of firmware and bootloader code has already executed: the CPU's microcode brings the chip to a usable state, then immutable boot ROM loads the next stage, and so on through several stages until the OS kernel takes over. **Firmware security** is the discipline of protecting that chain, and it is where many of the most consequential breaches of the last decade have lived.

Modern PCs run **UEFI** — the Unified Extensible Firmware Interface — which replaced the legacy BIOS during the 2010s. **UEFI security** features include cryptographic verification of boot stages, a database of trusted signing keys, and a modular driver architecture that runs before the OS does. UEFI is far more capable than legacy BIOS, but its complexity is also a liability: UEFI vulnerabilities (BootHole in 2020, BlackLotus bootkit in 2023, LogoFAIL in 2023) have repeatedly demonstrated that the pre-OS environment is a serious attack surface.

The two related technologies that protect the boot chain are *secure boot* and *measured boot*. They are easily confused — the names sound interchangeable — but they answer different questions and they compose well together.

### 4.1 Secure Boot

**Secure Boot** is an *enforcement* mechanism: at each stage, the firmware verifies that the next stage is signed by a key in a trusted database, and refuses to execute an unsigned or untrusted stage. If verification fails, boot stops. Secure Boot is what prevents an attacker who has tampered with your bootloader on disk from running their replacement — the firmware will not load it.

Secure Boot's trust comes from a chain of signatures: the firmware trusts a Platform Key (PK), which authorizes Key Exchange Keys (KEKs), which sign the database of allowed bootloader signers (the "db") and a database of revoked signers (the "dbx"). On a typical PC, the dbx is updated regularly by Microsoft, AMD, Intel, and the OS vendors to revoke compromised bootloaders. The effectiveness of Secure Boot depends entirely on this revocation discipline — BlackLotus survived because the vulnerable bootloaders it exploited were not promptly added to the dbx.

### 4.2 Measured Boot

**Measured Boot** is a *recording* mechanism: at each stage, the firmware computes a hash of the next stage *before* running it and *extends* that hash into a TPM PCR. The result is a tamper-evident log of every piece of code that ran during boot. Measured boot does not, by itself, refuse to boot anything — it only records what happened. The recording becomes useful when paired with two things: TPM key sealing (the disk encryption key only unlocks if the PCRs match a trusted state) and attestation (a remote verifier reads the PCRs and decides whether to trust the system).

The two technologies are complementary. Secure Boot gives you a binary "boot-or-don't" guarantee at the moment of boot. Measured Boot gives you an evidentiary trail that survives the boot and lets a remote party — a corporate VPN, a cloud orchestrator, a remote-attestation service — make a trust decision *after* boot. Real systems use both.

#### Diagram: Secure Boot vs. Measured Boot

<details markdown="1">
<summary>Side-by-side flow diagram showing how secure boot enforces trust while measured boot records it</summary>
Type: workflow-diagram
**sim-id:** secure-vs-measured-boot<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Two parallel vertical flows side by side, both starting from "Power On" at the top.

**Left column: Secure Boot (enforcement)**

1. Power On → CPU Reset Vector
2. Boot ROM (immutable, the silicon root of trust)
3. Verifies signature of UEFI firmware → if FAIL, halt (red diamond)
4. UEFI verifies signature of bootloader → if FAIL, halt (red diamond)
5. Bootloader verifies kernel signature → if FAIL, halt (red diamond)
6. Kernel runs

Each step is colored cybersecurity blue with a green "verify" annotation; failure paths show a red halt diamond.

**Right column: Measured Boot (recording)**

1. Power On → CPU Reset Vector
2. Boot ROM hashes UEFI firmware → extends PCR[0]
3. UEFI hashes bootloader → extends PCR[4]
4. Bootloader hashes kernel/initrd → extends PCR[8/9]
5. Kernel runs (unconditionally)
6. After boot: TPM holds PCR values that fingerprint the boot

Each step shows a small "PCR" register box on the right that accumulates hash values; the final state can be read by a remote attester.

Below both columns: a caption "Real systems use BOTH — Secure Boot prevents bad boots; Measured Boot proves what booted."

Color: cybersecurity blue for trusted stages, slate steel for hardware/firmware boundaries, amber for the warning that PCRs are extend-only.

Responsive: two columns collapse to stacked sequence below 700px.

Implementation: Mermaid two flowcharts side by side via `flowchart TB` with subgraphs.
</details>

!!! mascot-thinking "Secure vs. Measured — Two Different Questions"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    Notice the asymmetry. Secure Boot answers *"should I run this?"* at boot time, with a binary verdict. Measured Boot answers *"what actually ran?"* with evidence that someone else can audit later. The first protects this boot; the second lets a third party trust this machine. Real production systems need both — and the TPM is what binds the second one to immutable hardware.

## 5. Side-Channel Attacks — Information Leaks Through Physics

So far we have treated cryptographic operations as black boxes: input goes in, output comes out, and the secret key inside never leaks unless someone breaks the math. **Side-channel attacks** challenge that abstraction. A side channel is any unintended information leak that depends on the secret being processed — the *time* an operation takes, the *power* the chip draws, the *electromagnetic field* it emits, the *acoustic noise* of its capacitors, even the *cache lines* it touches. Side channels do not break the cryptographic algorithm; they read the secret out the back of the implementation.

The historical surprise of side channels is how *practical* they are. The 1996 Kocher paper on timing attacks demonstrated that real RSA implementations leaked their keys through millisecond differences in decryption time. Since then the field has expanded into power, EM, cache, and microarchitectural channels — most spectacularly with the **Spectre** and **Meltdown** disclosures of 2018, which showed that *speculative execution* in modern CPUs leaks information across what software developers had assumed were hard isolation boundaries.

Side-channel attacks fall into rough families. Let's define each before showing them in a comparison table.

### 5.1 Timing Attacks

A **timing attack** exploits variations in execution time that depend on the secret. Classic targets are comparison loops that exit early on the first byte mismatch — comparing an attacker-supplied MAC to the correct MAC byte by byte leaks how many leading bytes were correct. Modular exponentiation in a naive RSA implementation runs faster when the secret exponent has more zero bits than one bits; an attacker who can time many decryptions can recover the key. The countermeasure is *constant-time programming* — code paths that take the same time regardless of secret values. Modern crypto libraries (libsodium, BoringSSL, ring) take constant-timeness as a core requirement.

### 5.2 Power Analysis Attacks

A **power analysis attack** measures the power consumption of a chip (or its electromagnetic emanations, by induction nearly the same channel) during a cryptographic operation and correlates that trace to the bits of the key. *Simple Power Analysis (SPA)* reads the trace directly to distinguish operations like square-vs-multiply. *Differential Power Analysis (DPA)* uses statistics over many traces to extract keys even from noisy measurements. Power analysis is the canonical threat to smart cards, embedded controllers, and IoT devices — the attacker needs only an oscilloscope and modest expertise. Countermeasures include *masking* (splitting the secret into random shares processed separately), *constant-power* circuit design, and shielding; FIPS 140-3 Level 3+ certification specifically requires evidence of power-analysis resistance.

### 5.3 Cache Side-Channels

A **cache side-channel** uses the shared CPU cache as a covert communication channel. The attacker, running on the *same physical core* as the victim (often a co-located VM or a sibling hyperthread), measures which cache lines are present or evicted to infer which memory addresses the victim accessed. Because real cryptographic implementations often have data-dependent memory access patterns (e.g., AES T-tables indexed by key bytes), the attacker can recover key material. *Flush+Reload*, *Prime+Probe*, and *Flush+Flush* are the classical attack patterns. The countermeasures are protocol-level (no co-tenancy with untrusted code), implementation-level (constant-memory-access cryptography, AES-NI hardware instructions), and architectural (cache partitioning, e.g., Intel CAT). Spectre is, in essence, a cache side channel where the attacker first uses speculative execution to prime the cache with secret-dependent state, then recovers it with Flush+Reload.

### 5.4 Rowhammer

**Rowhammer** is a different beast: not a side channel that *reads* secrets, but a fault injection that *writes* through hardware. Modern DRAM packs cells so densely that repeatedly reading one row can cause electrical disturbances that flip bits in *adjacent* rows. An attacker who can hammer carefully chosen rows can flip bits in memory the operating system thought it had isolated from them — corrupting page tables to gain kernel privileges, corrupting cryptographic keys, or undermining VM isolation. The 2014 disclosure prompted vendor mitigations (Target Row Refresh, increased refresh rates), but variants — TRRespass (2020), Half-Double (2021), RowPress (2023) — keep finding ways around them. Rowhammer is the canonical example that *the abstraction of "memory is reliable storage" is a software fiction the hardware does not enforce.*

The following table compares the four side-channel families to organize what we just defined. Use it to compare attacker capability and countermeasure costs at a glance.

| Family | What attacker observes | Required access | Primary countermeasure |
|--------|------------------------|-----------------|------------------------|
| Timing | Execution time (ms / cycles) | Network or local | Constant-time code |
| Power / EM | Current draw, EM emission | Physical proximity | Masking, shielding, FIPS-rated chip |
| Cache | Cache hit/miss patterns | Co-resident code | Constant-memory-access crypto, no co-tenancy |
| Rowhammer | (fault injection, not observation) | Local code execution | TRR, ECC memory, refresh hardening |

#### Diagram: Side-Channel Attack Surface

<details markdown="1">
<summary>Infographic showing how data leaks from a chip through timing, power, EM, cache, and fault channels</summary>
Type: infographic-svg
**sim-id:** side-channel-overview<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A central illustration of a CPU chip on a board, with four labeled channels radiating outward.

Center: a stylized CPU package (cybersecurity blue, slate-steel border) labeled "Cryptographic operation in progress." Inside, a small lock icon labeled "Secret key K."

Four arrows leaving the chip, each in amber (#ffa000), each terminating at an attacker icon:

1. **Up — Timing channel.** Arrow labeled "execution time (cycles, ms)"; attacker shown with a stopwatch.
2. **Right — Power / EM channel.** Arrow labeled "current draw, EM field"; attacker shown with an oscilloscope and probe.
3. **Down — Cache channel.** Arrow labeled "shared cache state"; attacker shown as a co-tenant VM with a measuring icon.
4. **Left — Rowhammer (fault).** A two-way arrow labeled "induced bit flips in DRAM"; attacker shown writing to adjacent rows.

Below the central chip: a green badge labeled "Defenses: constant-time code, masking, shielding, no co-tenancy, ECC RAM, TRR."

Hover tooltips on each channel show a one-line description and a real-world example (Spectre for cache, faulTPM for power, etc.).

Color: cybersecurity blue for the chip, amber for leak channels, slate steel for the board, green for the defenses badge.

Responsive: 4-arrow radial layout collapses to vertical list with icons below 700px.

Implementation: Static SVG with `<title>` tooltips and a small JS handler to scale the radial pattern responsively.
</details>

!!! mascot-warning "Constant-Time Is A Discipline, Not A Default"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel showing caution">
    Code like `if (mac == expected_mac)` looks correct and is. Code like `for (i = 0; i < n; i++) if (mac[i] != expected[i]) return false;` looks correct and *isn't* — it leaks the position of the first wrong byte. Use your library's `constant_time_compare` for any comparison involving a secret. The naive comparison is the footgun, and "it worked in tests" is exactly the kind of silent failure side channels specialize in.

## 6. The Hardware Supply Chain

Software has a supply chain (Chapter 6); hardware does too, and it is harder to verify. The **hardware supply chain** runs from semiconductor IP design (ARM, RISC-V, Intel-internal cores), through fabrication (TSMC, Samsung, Intel Foundry, GlobalFoundries), through assembly and packaging, through the original-design manufacturer (ODM) that integrates chips onto a board, through the original-equipment manufacturer (OEM) that brands and ships the device, and finally through the distributor and the customer's receiving dock. Every stage is a place where an adversary could substitute, modify, or instrument hardware.

The threats break into several categories. *Counterfeit components* — relabeled lower-grade parts or recycled chips passed off as new — have been a chronic problem in defense procurement and were the target of the U.S. SAE AS5553 standard. *Hardware Trojans* are deliberately inserted malicious circuitry, vanishingly hard to detect once a chip is in fabrication. *Implant attacks* during shipping or installation are reported (most famously in the disputed 2018 Bloomberg "Big Hack" allegations and in the more rigorously documented NSA TAO ANT catalog leaked in 2013). *Compromised firmware* — pre-installed at the factory or at an intermediate distributor — is the most common documented threat in the wild and is what Chapter 6's SBOM and code-signing apparatus tries to extend down to firmware images.

The defenses are a mix of organizational and technical. Organizationally, governments and large enterprises maintain *trusted supplier lists* (the U.S. Trusted Foundry program, NIST SP 800-161 supply-chain risk management). Technically, *split-manufacturing* divides the chip across multiple fabs so no single fab sees the whole design; *PUFs* (Physically Unclonable Functions) provide a fingerprint unique to each die that cannot be cloned; and *device attestation* (section 9) lets the buyer cryptographically verify what they received. None of these are bulletproof, and a sophisticated nation-state attacker with fab access remains the worst-case threat that hardware supply chain practice is designed to bound rather than eliminate.

## 7. Embedded and IoT Security

Most computers in the world are not laptops or servers; they are **embedded systems** — microcontrollers running fixed firmware in cars, medical devices, industrial controllers, point-of-sale terminals, smart meters, routers, and the long tail of the *Internet of Things*. **Embedded security** covers this enormous, heterogeneous category, and **IoT security** narrows the focus to the subset that connects to networks. The two share most of the same problems, in greater volume and with smaller defense budgets than enterprise IT.

Embedded systems have several security-defining characteristics:

- **Long lifetimes.** A car ECU stays in the field for 15+ years; a smart meter for 20+. The cryptography deployed at manufacture must remain defensible for the device's whole life, and the patching process must reach devices that may never have been online.
- **Tight resource budgets.** A microcontroller may have 64 KB of RAM and a 32 MHz CPU. Running modern asymmetric crypto, sandboxing, or heavy logging is non-trivial.
- **Physical accessibility.** Smart meters bolt onto the side of a house; payment terminals sit on counters. Adversaries get physical access at scale.
- **Fragmented update channels.** Many devices have no update mechanism, or one that requires a vendor visit. Insecure-by-default is the failure mode at industrial scale.
- **Composability with safety.** When the device controls a pacemaker, a brake, an insulin pump, or a substation breaker, security failures become safety failures.

The result is an ecosystem with extraordinarily uneven security. Industry standards are emerging — the U.S. *Cyber Trust Mark* labeling program (2024+), the EU *Cyber Resilience Act* (2024), ETSI EN 303 645 for consumer IoT, IEC 62443 for industrial systems — but the installed base will take a generation to replace. The high-leverage controls a designer of an embedded device should focus on are: a hardware root of trust (section 9), authenticated and signed firmware updates, no default passwords, encrypted communications, and a *defined end-of-support date* communicated to buyers.

#### Diagram: IoT Device Security Stack

<details markdown="1">
<summary>Layered diagram showing the security stack of a representative IoT device from silicon root of trust to cloud backend</summary>
Type: diagram
**sim-id:** iot-security-stack<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A vertical layered diagram of a representative IoT device, with each layer annotated for its security role.

From bottom to top:

1. **Silicon (immutable boot ROM, fuses, PUF)** — slate steel — caption: "Hardware root of trust. Cannot be re-flashed."
2. **Secure Boot Loader (signed)** — cybersecurity blue — caption: "Verifies next stage signature."
3. **Firmware (signed, version-anti-rolled-back)** — cybersecurity blue — caption: "Application logic. OTA-updatable."
4. **OS / RTOS (FreeRTOS, Zephyr, embedded Linux)** — cybersecurity blue — caption: "Process isolation, if any."
5. **Application code** — cybersecurity blue
6. **TLS-based communication channel** — drawn as an arrow leaving the device upward — caption: "Mutual TLS to backend, device-bound key from secure element."
7. **Cloud backend / Device management plane** — drawn at the top as a separate box — caption: "Identity registry, OTA orchestration, attestation verifier."

On the right side, a vertical bar shows "trust diminishes upward — most attacks target firmware and application." On the left side, a vertical bar shows "blast radius grows upward — a backend compromise hits the whole fleet."

Color: cybersecurity blue for layers, slate steel for the immutable silicon, amber for the OTA channel (because that is the most common attack surface).

Responsive: vertical stack on all viewports; annotations move below boxes on narrow screens.

Implementation: Mermaid `flowchart TB` with subgraphs for the device and backend.
</details>

!!! mascot-tip "The IoT Defense-in-Depth Minimum"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sentinel offering a tip">
    For any connected device you ship, target this minimum: hardware root of trust, signed and rollback-protected firmware updates, unique per-device credentials at provisioning, mutual TLS to a known backend, and a documented end-of-support date. Defense in depth at the device level is what keeps a single CVE from turning into a million-device botnet.

## 8. Device Attestation — Proving What You Are

We now have the pieces to define **device attestation**: the cryptographic process by which a device proves to a remote party what hardware and software it is running. Attestation is the answer to "how does my server actually know that the laptop connecting to the VPN is a corporate machine in a healthy state, rather than a stolen disk imaged onto an attacker's laptop?"

The core mechanism, for TPM-based attestation, is a *quote*: the TPM signs a snapshot of its PCRs (the measured-boot trace) plus a fresh nonce supplied by the verifier. The signature is produced with an *Attestation Identity Key* (AIK) that derives from the TPM's manufacturer-installed Endorsement Key (EK), which the manufacturer's certificate vouches for. The verifier checks the signature, checks that the EK certificate chains to a known manufacturer, checks that the PCR values match a policy of trusted boot states, and on success accepts the device as healthy.

For a TEE — Intel SGX, AMD SEV-SNP, ARM TrustZone — the structure is similar, but the signed quote includes a measurement of the *enclave code* itself rather than the boot state. Cloud providers run *attestation services* (Microsoft Azure Attestation, Intel's IAS, Google's Confidential Space, AWS Nitro Attestation) that issue tokens consumable by application backends. The pattern is the same in each case:

1. Verifier sends a fresh nonce to the device.
2. Device's hardware root of trust assembles a measurement (PCRs or enclave hash) plus the nonce.
3. Device signs the bundle with a key whose certificate chains to a manufacturer the verifier trusts.
4. Verifier checks signature, certificate chain, freshness, and policy.
5. Verifier issues an attestation token that downstream services can rely on.

Attestation is the cryptographic backbone of many things you may already have used: BitLocker recovery, FIDO2 device authentication (the "attestation statement" in WebAuthn), Apple's iCloud Keychain trust, Google Play Integrity, and confidential-computing workloads in the cloud. Whenever a service distinguishes "real device" from "anything claiming to be a device," attestation is what is doing the work behind the scenes.

A subtle but important note: attestation proves *what* is running, not that *what is running is good*. The verifier's policy database — the list of acceptable PCR values, acceptable enclave hashes, acceptable firmware versions — is the human judgment that turns "I am a Lenovo laptop with kernel 6.7" into "I am acceptable to my employer's VPN." That policy is what gets out of date when bootloaders are revoked, when CVEs are disclosed, when fleet inventories drift. Attestation moves the trust problem from "can I trust this device?" to "is my policy current?" — which is a problem with the same shape but much better tooling.

#### Diagram: Device Attestation Flow

<details markdown="1">
<summary>Sequence diagram showing a device proving its boot state to a remote verifier using a TPM quote</summary>
Type: workflow-diagram
**sim-id:** device-attestation-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A sequence diagram with three actors:

- **Verifier** (left) — e.g., corporate VPN server or cloud attestation service
- **Device** (middle) — e.g., laptop or VM
- **TPM / Hardware Root of Trust** (right) — on the device but conceptually distinct

Steps from top to bottom:

1. Verifier → Device: "Attestation request (nonce N)"
2. Device → TPM: "Quote PCRs with nonce N, sign with AIK"
3. TPM → Device: "Quote = sign_AIK(PCR0..23 || N)"
4. Device → Verifier: "Quote + AIK certificate + EK certificate chain"
5. Verifier checks: (a) certificate chains to known manufacturer, (b) signature is valid, (c) nonce matches, (d) PCRs match policy of acceptable boot states
6. Verifier → Device: "Attestation token (or denial)"

A side-note box at the bottom: "Trust depends on the manufacturer's EK certificate AND the verifier's policy of acceptable PCR values. Both must be current."

Color: cybersecurity blue for verifier and device, slate steel for the TPM/HW root, amber for the policy-check step (because policy currency is the operational footgun).

Responsive: actor lanes simplify to single column below 600px.

Implementation: Mermaid sequenceDiagram.
</details>

## 9. The Hardware Root of Trust

Throughout this chapter we have referenced the **hardware root of trust** — the immutable foundation on which everything else stands. Now we can define it precisely:

A hardware root of trust is a piece of computation and storage, fixed in silicon at manufacture, whose integrity and authenticity are taken as axiomatic by the rest of the system because there is no lower layer to verify them against. It typically consists of (a) an *immutable boot ROM* whose contents are mask-programmed into the chip, (b) a set of *fuses* that hold device-unique secrets and certificates burned at the factory, (c) the cryptographic public keys of the manufacturer used to verify all subsequent firmware, and (d) a small set of critical operations — random-number generation, cryptographic signing, key derivation — that depend only on those silicon-resident assets.

Every higher-level trust property in this chapter chains back to that root. Secure Boot's signature verification chain ends at a manufacturer key in the boot ROM. Measured Boot's PCRs are extended starting from a value the boot ROM wrote. The TPM's Endorsement Key is signed by a manufacturer key whose root is in the silicon. A TEE's attestation key derives from a fused per-die secret. If you reach the bottom of any of these chains, you find the same answer: *we trust this because changing it would require physically rebuilding the chip.*

The honest phrasing is that the hardware root of trust pushes the trust problem somewhere we can credibly defend, not somewhere we can eliminate it. The fab, the masking process, and the manufacturer's signing infrastructure are the new attack surfaces — small enough to defend with serious engineering and physical security, but not zero. Confidential-computing research is now extending the root of trust upward into formally verified boot stages and downward into PUFs that make even the manufacturer's job harder; the field is active and improving.

The following list summarizes the chain of trust, from silicon to application, that you should be able to recite by the end of this chapter. Everything we covered slots in somewhere on it.

1. **Silicon root of trust** — boot ROM, fuses, manufacturer public key, PUF (immutable; cannot be re-flashed).
2. **First-stage bootloader** — verified by silicon root, hashed into PCRs.
3. **UEFI / second-stage firmware** — verified by first stage, hashed into PCRs.
4. **OS bootloader (GRUB, systemd-boot, Windows Boot Manager)** — verified by Secure Boot db, hashed into PCRs.
5. **OS kernel and initramfs** — verified by bootloader, hashed into PCRs.
6. **Userspace integrity (IMA, dm-verity, Apple's APFS sealed system volume)** — measured continuously in some systems.
7. **TPM-sealed keys / TEE-bound secrets** — released only when the chain above produces an expected fingerprint.
8. **Application** — runs on a foundation it can reason about because the chain has been measured and (often) attested to a remote verifier.

!!! mascot-thinking "What 'Trust' Means Here"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    Notice the structure: we do not eliminate the need for trust — we concentrate it. The *root* is small, immutable, and physically defended; everything above it is verified against the root. That is the same shape as PKI (one CA root, many derived certificates) and the same shape as defense in depth (many layers, but anchored in a foundation). Hardware security is the place where that shape becomes literal silicon.

## 10. Putting It Together — A Day in the Life of a Booting Laptop

To anchor the abstractions, walk through what happens when you press the power button on a modern Windows 11 laptop with BitLocker enabled and a corporate VPN that requires attestation:

1. The CPU comes out of reset and executes from boot ROM. The boot ROM verifies the UEFI firmware's signature against keys fused into the chip at manufacture. (Silicon root of trust enforces step one.)
2. UEFI initializes hardware, then verifies the OS bootloader against the Secure Boot db. The hash of UEFI is extended into TPM PCR[0]; the hash of the bootloader into PCR[4]. (Secure Boot enforces; Measured Boot records.)
3. The bootloader verifies and loads the Windows kernel; the kernel hash is extended into PCR[11].
4. The kernel boots, asks the TPM to *unseal* the BitLocker disk encryption key. The TPM checks that PCR[0..11] match the policy that was set when BitLocker was enabled; if any boot stage was tampered with, the seal does not open and BitLocker prompts for the recovery key.
5. Windows loads, the user logs in. The laptop connects to the corporate VPN.
6. The VPN server sends a fresh nonce. The laptop asks the TPM to quote PCR[0..11] with that nonce. The TPM signs with an AIK derived from the manufacturer-issued EK. (Attestation.)
7. The VPN server verifies the signature, checks the EK certificate chain to a Trusted Computing Group root, checks that the PCR values are on its allow-list of corporate-approved boot states, and either grants or denies access.

Every concept in this chapter — TPM, secure boot, measured boot, sealed storage, attestation, hardware root of trust — appears in that one boot sequence. Every concept is also the place where a real system has failed at some point in the last five years, which is why hardware security is an active engineering discipline and not a solved problem.

!!! mascot-celebration "What You Can Now Reason About"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sentinel celebrating">
    You can now name the trust anchors of a modern system, distinguish secure boot from measured boot, recognize the four families of side-channel attack, and trace a chain of trust from silicon to application. That is the foundation we will build on in Chapter 8, where we leave the device behind and ask the harder question: how do we trust the *network* between two devices that have already proven what they are?

## 11. Key Takeaways

- **Hardware security** asks where keys live, what code actually booted, and how to defend against adversaries with physical or microarchitectural access.
- **TPM** is the standardized boot-measurement and key-sealing chip on essentially every modern PC; **HSM** is its higher-assurance cousin for enterprise key custody; **secure enclaves** and **TEEs** run isolated code on the main processor.
- **Secure boot** enforces signed boot stages; **measured boot** records every stage's hash into TPM PCRs. They are complementary, not redundant.
- **UEFI security** has replaced legacy BIOS but has its own significant attack surface; **firmware security** is now a first-class concern.
- **Side-channel attacks** — timing, power, cache, Rowhammer — extract secrets through unintended physical or microarchitectural leakage, and require disciplined countermeasures (constant-time code, masking, no co-tenancy, ECC RAM).
- **Hardware supply chain** threats are bounded, not eliminated, by trusted suppliers, split manufacturing, PUFs, and attestation.
- **Embedded and IoT security** apply these ideas under tight resource and lifetime constraints, with hardware root of trust and signed updates as the high-leverage controls.
- **Device attestation** lets a remote verifier cryptographically check what hardware and software a device is running.
- **Hardware root of trust** is the immutable silicon foundation that every higher-level trust property chains back to. The whole chapter, in one phrase, is *what is your root of trust, and why do you trust it?*
