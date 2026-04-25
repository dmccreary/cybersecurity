---
title: "Advanced Network Defense: Wireless, DNS, and Zero Trust"
description: "Wireless security (WPA3, 802.1X), DNS security and DNSSEC, BGP/RPKI, DDoS attacks and mitigation, Zero Trust architecture, NAC, proxies, and traffic analysis with packet capture and NetFlow."
generated_by: claude skill chapter-content-generator
date: 2026-04-25 11:21:08
version: 0.07
---

# Advanced Network Defense: Wireless, DNS, and Zero Trust

## Summary

Covers the higher-level network defenses required by modern environments: wireless security (WPA3, 802.1X, rogue APs), DNS security and DNSSEC, DNS tunneling, BGP security with RPKI, DDoS attacks and mitigation, Zero Trust architecture and micro-segmentation, SSH, port scanning, NAC, proxies, packet capture, and NetFlow analysis.

## Concepts Covered

This chapter covers the following 22 concepts from the learning graph:

1. Wireless Security
2. WPA3
3. 802.1X
4. Rogue Access Point
5. DNS Security
6. DNSSEC
7. DNS Tunneling
8. BGP Security
9. RPKI
10. DDoS Attack
11. Volumetric Attack
12. Application-Layer DDoS
13. DDoS Mitigation
14. Zero Trust Architecture
15. Micro-Segmentation
16. SSH
17. Port Scanning
18. Network Access Control
19. Proxy Server
20. Reverse Proxy
21. Packet Capture
22. NetFlow Analysis

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Security Foundations: Properties, Mindset, and Risk](../01-security-foundations/index.md)
- [Chapter 2: Threats, Vulnerabilities, and Security Controls](../02-threats-and-controls/index.md)
- [Chapter 4: Cryptography in Practice: PKI, TLS, and Data Protection](../04-crypto-in-practice/index.md)
- [Chapter 8: Network Security Foundations: Protocols, Firewalls, and Detection](../08-network-foundations/index.md)

---

!!! mascot-welcome "Welcome to the Hostile Network"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    Welcome. Chapter 8 gave us protocols, firewalls, and the perimeter. This chapter takes the next step: the perimeter is dissolving. Wireless airwaves are public, DNS resolvers can be tricked, BGP announcements can be hijacked at internet scale, and the "trusted internal network" was never that trustworthy. We will build the defenses for this messier world. Trust, but verify.

## 1. Beyond the Perimeter

The defenses in Chapter 8 — firewalls, IDS, VLANs, VPNs — share a common assumption: that there is an *inside* and an *outside*, and that controls placed at the boundary can keep one from contaminating the other. That model worked reasonably well when employees sat at desks wired into a corporate switch, when the only DNS resolver users talked to was on the local network, and when the path a packet took across the internet was nobody's security concern.

That world is gone. Employees roam between coffee shops and home Wi-Fi. Applications live in cloud regions on the other side of the planet. Devices on the corporate LAN often include cameras, printers, and personal phones whose firmware nobody is patching. The boundary cannot be the only defense, and in many cases there is no clear boundary to defend.

The concepts in this chapter respond to that shift. They fall into four broad themes:

- **Edge-of-network defenses** for the airwaves and the cabling: wireless security, NAC, port scanning awareness.
- **Internet-scale defenses** for protocols whose original designs assumed a friendly network: DNSSEC, RPKI, DDoS mitigation.
- **Architectural defenses** that abandon the inside/outside model: Zero Trust, micro-segmentation.
- **Operational defenses** that give defenders visibility into traffic they cannot fully control: SSH for trusted access, proxies, packet capture, NetFlow.

Each section adds vocabulary and tools to the same goal: keeping confidentiality, integrity, and availability when the network itself is hostile.

## 2. Wireless Security

A wired Ethernet cable is, with some caveats, a private channel — to read or inject traffic, an attacker needs physical access to the cable. A wireless signal is the opposite: it leaves the building. Anyone within range with a standard laptop and a freely available driver can capture every frame. **Wireless security** is therefore the discipline of providing confidentiality, integrity, and authentication on a medium that is, by physics, broadcast.

The history of Wi-Fi security is a parade of broken protocols. WEP (1997) was the original and is broken in minutes. WPA (2003) was a stop-gap. WPA2 (2004) was the dominant standard for a decade and is still common, but it has known weaknesses, including the **KRACK** key-reinstallation attack disclosed in 2017. **WPA3** (2018) is the current standard and is the only protocol you should be deploying for new networks today.

### 2.1 WPA3 — The Current Standard

**WPA3** is the IEEE 802.11 security amendment that supersedes WPA2. Its two most important improvements are:

- **SAE (Simultaneous Authentication of Equals)**, also known as the *Dragonfly handshake*, replaces WPA2's PSK (Pre-Shared Key) handshake. SAE is resistant to *offline dictionary attacks*, the attack where an adversary who captures one handshake can guess the password against the captured data offline at billions of attempts per second. With SAE, every guess requires a fresh online interaction with the access point, dramatically raising the cost of weak-password attacks.
- **Forward secrecy**, inherited from the Diffie-Hellman exchange in SAE. If the network password leaks tomorrow, traffic captured today cannot be retroactively decrypted. This is the same property TLS 1.3 provides for web traffic and that Chapter 4 introduced.

WPA3 also defines an **Enhanced Open** mode for guest and public networks that provides per-session encryption *without* a password, using opportunistic wireless encryption (OWE). It does not authenticate the network — anyone could spin up an "Enhanced Open" SSID with the same name — but it keeps the casual eavesdropper out of every coffee-shop session, which is a significant improvement over the open networks of the past.

### 2.2 802.1X — Enterprise Authentication

For organizations that need stronger guarantees than a shared password — universities, hospitals, corporate campuses — Wi-Fi authentication is typically delegated to **802.1X**. 802.1X is a port-based network access control standard that predates Wi-Fi and originally targeted Ethernet ports; it has since become the universal enterprise authentication framework for both wired and wireless access.

The architecture has three roles:

- The **supplicant** is the device requesting access (laptop, phone, IoT device).
- The **authenticator** is the network equipment in the middle (the wireless AP or wired switch port). It does not itself decide whether to grant access; it relays the credentials.
- The **authentication server**, typically a RADIUS server, makes the policy decision and tells the authenticator yes or no.

The supplicant and authentication server speak **EAP** (Extensible Authentication Protocol). The most common production EAP method is **EAP-TLS**, which uses a TLS handshake with mutual certificates — the client has its own certificate and the server has its own, just as in HTTPS but in both directions. EAP-TLS is the gold standard because it is phishing-resistant: there is no password to capture, and an attacker who clones the SSID cannot forge a valid server certificate.

#### Diagram: 802.1X Authentication Flow

<details markdown="1">
<summary>Sequence diagram showing supplicant, authenticator, and RADIUS server in an EAP-TLS exchange</summary>
Type: workflow-diagram
**sim-id:** dot1x-eap-tls-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A sequence diagram with three actors from left to right: **Supplicant** (laptop icon), **Authenticator** (Wi-Fi AP / switch icon), **RADIUS Server** (server icon).

Steps from top to bottom:

1. Supplicant → Authenticator: "EAPOL-Start (I would like to join)"
2. Authenticator → Supplicant: "EAP-Request: Identity?"
3. Supplicant → Authenticator: "EAP-Response: alice@corp.example"
4. Authenticator → RADIUS: "Access-Request (relays identity)"
5. RADIUS → Authenticator → Supplicant: "EAP-Request: Begin TLS handshake"
6. (TLS mutual handshake — client cert + server cert exchanged, validated against corporate CA)
7. RADIUS → Authenticator: "Access-Accept + session keys"
8. Authenticator: "Open the port; install per-session keys"
9. Supplicant: "Now on the network"

Side annotations:

- A note on the supplicant: "Holds private key + corporate-issued client certificate"
- A note on the authenticator: "Sees encrypted EAP, relays only — never sees secrets"
- A note on the RADIUS server: "Validates client cert against corporate CA. Logs the auth event."

Color: cybersecurity blue (`#1565c0`) for the actors; slate steel (`#455a64`) for relay arrows; cream background. Highlight the TLS handshake step in a callout box.

Responsive: actors collapse to top labels, sequence runs vertically below 700px viewport.

Implementation: Mermaid sequenceDiagram with custom theming.
</details>

Cheaper EAP methods (EAP-PEAP, EAP-TTLS) tunnel a password inside an outer TLS connection. They are easier to deploy than EAP-TLS but only as strong as the password and the user's willingness to validate the server certificate — a misconfigured client that does not check the server certificate is vulnerable to a rogue access point spoofing the corporate SSID.

### 2.3 Rogue Access Points

A **rogue access point** is any wireless AP that broadcasts on a network's SSID without authorization. The danger is straightforward: clients configured to "auto-connect" to a remembered SSID will associate with the rogue AP if its signal is stronger, and the operator of the rogue AP can then run a man-in-the-middle attack against everything the client does.

Rogue APs come in two flavors:

- **Internal rogues** — an employee plugs a consumer Wi-Fi router into a network jack to "extend coverage in the conference room." It often has WPA2-PSK with a weak password and no logging, and it bypasses the corporate authentication policy entirely.
- **External rogues** (also called *evil twins*) — an attacker stands up a deauthentication-and-replace AP outside the building, broadcasting the same SSID. The attacker may then capture credentials or intercept traffic from devices that fail to validate the server certificate.

Defenses include **Wireless Intrusion Prevention Systems (WIPS)** that continuously scan the spectrum for unauthorized BSSIDs, **802.1X with EAP-TLS** so a rogue cannot present a valid server certificate, and *strict client configuration* that refuses to connect to a known SSID without certificate validation.

!!! mascot-warning "The Default-On Auto-Connect Footgun"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel showing caution">
    Most operating systems remember every Wi-Fi network you have ever joined and probe for them when scanning. A laptop walks into a coffee shop and silently asks the air "is `corp-wifi` here?" An attacker who hears that probe can stand up an AP with that exact SSID. The structural fix: turn off auto-join for trusted SSIDs, and use 802.1X with strict server-certificate validation so a spoofed AP cannot complete the handshake.

## 3. DNS Security

The Domain Name System translates names like `bank.example` into IP addresses like `192.0.2.42`. Almost every network action a user takes — opening a website, sending mail, joining a video call — begins with a DNS lookup. The original DNS protocol from 1983 was designed for a friendly internet: it uses unauthenticated UDP, has no integrity checking on responses, and is widely cached at every hop. **DNS security** is the set of practices and protocols that retrofit those guarantees onto DNS, because attackers reach for DNS constantly.

The two attacks that matter most are *cache poisoning*, where an attacker injects a false record into a resolver's cache so that subsequent lookups return an attacker-controlled IP, and *DNS hijacking*, where an attacker compromises an authoritative server or registrar and replaces a legitimate record. Both let the attacker silently redirect victims from `bank.example` to `attacker.example` without any visible warning.

### 3.1 DNSSEC

**DNSSEC** (Domain Name System Security Extensions) adds cryptographic signatures to DNS records. Each zone signs its records with a private key, and the corresponding public key is published in the parent zone, forming a chain of trust that ultimately leads to the *root zone*, whose key is one of the most ceremoniously managed cryptographic keys in the world.

When a DNSSEC-aware resolver looks up `www.bank.example`, it does not simply trust the response it receives. It walks the chain: it verifies the signature on the `www.bank.example` record using the `bank.example` key, verifies the `bank.example` key using the `.example` key, and so on up to the root. If any signature fails, the record is rejected.

The following table summarizes what DNSSEC does and does not provide. Notice that it focuses on integrity and origin — DNSSEC does not encrypt the lookup itself.

| Property | Provided by DNSSEC? | Notes |
|----------|:-------------------:|-------|
| Origin authentication of records | Yes | Signature chain proves the record came from the zone owner |
| Integrity of records | Yes | Tampering invalidates the signature |
| Non-existence proofs | Yes | NSEC/NSEC3 records prove a name does *not* exist |
| Confidentiality of the lookup | **No** | The query and response are still visible to anyone on the path |
| Protection against compromised zone keys | No | An attacker with the private key can forge signed records |

Because DNSSEC does not encrypt the lookup, two complementary protocols add confidentiality between client and resolver: **DNS over HTTPS (DoH)** and **DNS over TLS (DoT)**. Both wrap the DNS query in a TLS-protected channel so that on-path observers cannot see which sites a user is visiting. DoH and DoT prevent eavesdropping; DNSSEC prevents forgery. They solve different problems and are typically deployed together.

### 3.2 DNS Tunneling

**DNS tunneling** uses DNS queries and responses as a covert channel to smuggle data in and out of a network. The technique exploits a near-universal default: even networks that block almost all outbound traffic still allow DNS lookups to function, because without DNS the network is unusable. An attacker who has malware running on a compromised host can encode commands and exfiltrate data inside DNS requests to a domain they control.

A typical tunnel looks like this. The malware encodes data as base64 (or hex) and prepends it as a subdomain: `{base64data}.tunnel.attacker.example`. The recursive resolver dutifully forwards the query to the authoritative server for `tunnel.attacker.example` — which the attacker controls. The attacker decodes the data from the subdomain, encodes a response in a TXT or CNAME record, and sends it back. From the network's point of view, this looks like a sequence of legitimate DNS lookups; from the attacker's point of view, it is a low-bandwidth covert channel that bypasses the firewall.

Defenses include:

- Logging and analyzing DNS queries for high-volume, high-entropy subdomains (a legitimate domain rarely has thousands of unique random-looking subdomains).
- Forcing all outbound DNS through a corporate resolver and blocking direct port-53 traffic to the internet.
- Using DNS firewalls or threat-intelligence feeds to block queries to known tunnel domains.
- Looking for unusual *patterns* — a single workstation generating thousands of TXT-record lookups per minute is suspicious regardless of which domain it targets.

#### Diagram: DNSSEC Validation Chain

<details markdown="1">
<summary>Tree diagram showing chain of trust from root key down to a signed record</summary>
Type: tree-diagram
**sim-id:** dnssec-chain-of-trust<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A vertical tree diagram showing the chain of signatures from the root zone to a leaf record:

1. **Root zone (`.`)** — labeled with "Root KSK (stored in trust anchor)". A green checkmark denotes the trust anchor that all DNSSEC validators ship with.
2. ↓ "signs" → **TLD zone (`.example`)** — labeled with "DS record in root zone points to TLD KSK"
3. ↓ "signs" → **`bank.example` zone** — labeled with "DS record in TLD points to bank's KSK"
4. ↓ "signs" → **`www.bank.example` A record** — labeled with "Returned to resolver: A record + RRSIG"

A side panel on the right shows what a resolver does on lookup:

- "Step 1: Receive A record + signature for `www.bank.example`"
- "Step 2: Fetch and verify ZSK signature using bank's KSK"
- "Step 3: Verify bank's KSK using DS record in `.example`"
- "Step 4: Verify `.example` keys using DS record in root"
- "Step 5: Compare root KSK to trust anchor — if match, ACCEPT"
- "Any failure → REJECT (resolver returns SERVFAIL)"

Color the trust path in cybersecurity blue (`#1565c0`); use a green checkmark on the root anchor; use red X annotations on what happens if any link fails.

Responsive: collapses to a vertical list with indented chain on viewport widths below 700px.

Implementation: Mermaid graph TD with custom node styling and side annotations.
</details>

## 4. BGP Security and RPKI

DNS turns names into addresses; **BGP** (Border Gateway Protocol) decides which physical paths the packets follow once an address is known. BGP is the routing protocol of the public internet — every autonomous system (every ISP, cloud provider, and large enterprise) uses BGP to announce which IP prefixes it can reach and to learn how to reach the rest. **BGP security** is the discipline of preventing those announcements from being forged.

BGP's original design was, like DNS's, deeply trusting. An autonomous system could announce any prefix it wanted, and neighbors would accept the announcement on faith. The practical consequence has been a steady trickle of *BGP hijacks*, where one network announces a prefix it does not own — sometimes by accident, sometimes deliberately — and a chunk of internet traffic that should have gone elsewhere is suddenly routed through the wrong place. The 2008 incident in which a Pakistani ISP took YouTube offline globally for several hours is the textbook example; cryptocurrency thefts via BGP hijack have happened repeatedly in the years since.

**RPKI** (Resource Public Key Infrastructure) is the cryptographic infrastructure that lets a network operator prove which prefixes it is authorized to announce. The model is parallel to DNSSEC's chain of trust:

1. The Regional Internet Registries (ARIN, RIPE, APNIC, LACNIC, AFRINIC) issue *Route Origin Authorizations* (ROAs) to the prefix holders. A ROA cryptographically asserts "AS 64500 is authorized to announce 192.0.2.0/24 with a maximum prefix length of 24."
2. ROAs are signed using a hierarchy rooted at the RIRs.
3. Networks that do **Route Origin Validation (ROV)** download all ROAs, build a validated cache, and use it to filter incoming BGP announcements. An announcement that conflicts with a ROA — wrong AS, or a more-specific prefix than the ROA permits — is dropped.

ROV adoption has grown substantially in recent years, but it is still incomplete, and many large networks remain partially or wholly unprotected. RPKI is also only the *origin validation* layer; **BGPsec**, the protocol that would validate the entire AS path (not just the originator), exists as a standard but has seen very limited deployment because of its computational cost. In practice, the combination of RPKI ROV with operational best practices (prefix filters, IRR validation, peer-locking) is the state of the art.

The following table compares the three threat models RPKI addresses, partially addresses, or does not address. Notice that path manipulation by an on-path AS is the gap that BGPsec was designed to close.

| Attack | Description | RPKI ROV blocks? |
|--------|-------------|:----------------:|
| Origin hijack | Wrong AS announces another's prefix | Yes |
| Sub-prefix hijack | Attacker announces a more-specific prefix than the legitimate holder | Yes (if max-length set correctly) |
| Path manipulation | On-path AS lies about its position in the AS path | No (would require BGPsec) |
| Leak / accidental misconfiguration | A peer's prefix announced to the wider internet | Partially (helps for prefix filtering) |

!!! mascot-thinking "Why The Internet's Trust Layer Is Cryptographic"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    DNSSEC and RPKI are the same architectural pattern applied to two different problems: take a protocol that originally trusted any speaker, and graft a public-key infrastructure onto it that lets receivers verify what the speaker is allowed to say. The pattern is "PKI as the authority record." Once you see it in DNS and BGP, you will start seeing it everywhere — code signing, certificate transparency, software supply-chain attestations.

## 5. Denial of Service

Confidentiality and integrity get most of the attention in cryptography chapters, but availability is the third leg of the CIA triad and the one that DNS and BGP defenses cannot help with directly. A **DDoS attack** (Distributed Denial of Service) is an attempt to make a service unavailable to its legitimate users by flooding it with traffic from many sources. The "distributed" part — the attack comes from a botnet of thousands or millions of compromised hosts — is what makes mitigation hard. There is no single source IP to block.

DDoS attacks fall into two broad categories that are mitigated very differently.

### 5.1 Volumetric Attacks

A **volumetric attack** aims to saturate the *bandwidth* of the target's network or its upstream provider. The numbers involved have grown by orders of magnitude over the past decade — modern attacks routinely exceed 1 Tbps and have peaked above 5 Tbps. The mathematics is grim for the defender: it does not matter how well-tuned the target's web server is if the fiber going into the data center is full.

The most efficient volumetric attacks are *amplification* attacks, which exploit protocols where a small request triggers a much larger response. The attacker sends a request with a *spoofed source IP* (the victim's address) to a server that responds to the request. The response — much larger than the request — goes to the victim, not the attacker. By using thousands of such servers (called *reflectors*), the attacker amplifies a modest outbound bandwidth into a flood at the victim. DNS, NTP, memcached, and SSDP have all been used historically; the *amplification factor* for misconfigured memcached servers reached 50,000× before the protocol was hardened.

The math: if an attacker has *B* bandwidth and uses reflectors with amplification factor *A*, the victim sees up to \( B \times A \) bandwidth of attack traffic, possibly distributed across many reflector source IPs.

### 5.2 Application-Layer DDoS

An **application-layer DDoS** (also called a *Layer 7* attack, after the OSI model) does not try to saturate bandwidth. Instead, it sends fully valid-looking HTTP requests (or other application-layer queries) at a rate that exhausts some scarce server-side resource — CPU on the application server, connections in the database pool, memory in the search engine. Each request is small, so the bandwidth bill is modest, but each request is expensive to serve. A few thousand requests per second of "search for `aaaaa%bbbbb%ccccc`" can take down a service that handles a million bandwidth-light requests per second easily.

Application-layer DDoS is harder to mitigate because the requests look exactly like legitimate traffic. The defenders' tools are *rate limiting*, *behavioral analysis* (does this client's request pattern look human or bot?), and *challenge mechanisms* (CAPTCHAs, JavaScript challenges, proof-of-work). Modern WAFs and DDoS-protection services combine all three.

### 5.3 DDoS Mitigation

**DDoS mitigation** is a layered defense involving the network, the cloud provider, and the application. The high-level strategies are:

- **Ingress filtering at the network edge** — drop packets with obviously spoofed source IPs (BCP38), drop packets to closed ports, drop traffic that exceeds normal patterns. ISPs that practice ingress filtering on their customer networks deny attackers the ability to send spoofed packets at all.
- **Anycast and capacity** — large CDNs and DNS providers announce the same IP from many physical locations. An attacker's traffic is automatically split across all of them by BGP, so no single site is overwhelmed. Cloudflare, AWS Shield, Akamai, and Google Cloud Armor all rely heavily on anycast.
- **Scrubbing centers** — when an attack is detected, the target's traffic is diverted (via BGP announcement or DNS change) through a high-bandwidth scrubbing facility that filters attack traffic and forwards legitimate traffic to the origin.
- **Rate limiting and adaptive shaping** at the application tier, especially for L7 attacks.

#### Diagram: DDoS Mitigation Architecture (MicroSim)

<details markdown="1">
<summary>Interactive simulation comparing volumetric and L7 DDoS, with toggleable defenses</summary>
Type: microsim
**sim-id:** ddos-mitigation-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom's: Analyze):** Students will analyze how different DDoS mitigation strategies (ingress filtering, anycast, scrubbing, rate limiting) reduce the impact of volumetric vs. application-layer attacks, by manipulating attack parameters and defense settings and observing the change in traffic reaching the origin.

**Canvas:** 800 × 500 px, responsive (rescales container width via `updateCanvasSize()` in setup).

**Visual layout:**
- **Left:** Attacker botnet — animated cluster of small dots (compromised hosts) emitting packets toward the center. Slider sets the number of bots (10 to 10,000).
- **Center:** A network path showing optional defense layers as horizontal "filters":
  1. Ingress filter (toggleable)
  2. Anycast distribution (toggleable, shown as a fork into 3 paths)
  3. Scrubbing center (toggleable, shown as a funnel that absorbs attack traffic)
  4. Rate limiter at the origin (toggleable)
- **Right:** Origin server — a stylized server icon with two health bars: bandwidth utilization (volumetric) and CPU utilization (L7). Goes red when overwhelmed.
- A small ticker at the bottom shows: "Legitimate requests served per second / total attempted."

**Controls (p5.js builtin createSlider, createCheckbox, createSelect):**
- Slider: Number of bots (10–10,000)
- Slider: Attack rate per bot (1–100 req/s)
- Select: Attack type (Volumetric, L7-CPU, L7-DB)
- Select: Amplification reflector (None, DNS 50×, NTP 500×, Memcached 50,000×) — only enabled for Volumetric
- Checkbox: Enable BCP38 ingress filtering
- Checkbox: Enable anycast (3 PoPs)
- Checkbox: Enable scrubbing center
- Checkbox: Enable rate limiting
- Button: Reset

**Behavior:**
- Each bot emits dots traveling along the path. Defense layers absorb a fraction of the traffic based on attack type.
- Without defenses, volumetric attacks max out the origin bandwidth bar; L7 attacks max out the CPU bar.
- BCP38 reduces only spoofed/amplified volumetric traffic.
- Anycast splits traffic across 3 paths (each PoP sees 1/3 the traffic).
- Scrubbing absorbs ~95% of identified attack traffic but adds 100 ms latency.
- Rate limiting drops L7 traffic above a per-IP threshold; less effective when bots are diverse.
- Legitimate traffic (a steady green stream) is shown alongside attack traffic so students can see what proportion gets through.

**Color palette:** Cybersecurity blue (`#1565c0`) for defense layers, amber (`#ffa000`) for attack traffic, green (`#4caf50`) for legitimate traffic, red (`#d84315`) for overwhelmed origin.

**Responsive:** Canvas rescales to container width on resize event; controls stack vertically below 700px.

Implementation: p5.js in instance mode; `canvas.parent(document.querySelector('main'))`; `updateCanvasSize()` first in setup.
</details>

The combination of these techniques is what allows large modern services to absorb attacks that would have been catastrophic a decade ago. They are also why most organizations no longer try to mitigate DDoS in-house — the bandwidth and engineering cost is prohibitive — and instead contract with a specialized provider that aggregates capacity across thousands of customers.

## 6. Zero Trust Architecture

Every defense so far in this chapter still assumes a network with an inside and an outside. **Zero Trust Architecture** (ZTA) discards that assumption entirely. The core premise: *no network location is inherently trustworthy*. A request originating from inside the corporate LAN is treated with the same skepticism as a request originating from a coffee shop in another country. Authorization is decided per-request, based on the identity of the user, the posture of the device, and the sensitivity of the resource — not on whether the source IP is in some "trusted" range.

The shift from perimeter-based to Zero Trust thinking can be summarized in one table. Keep in mind that Zero Trust is not one product; it is an architectural posture that many controls together implement.

| Dimension | Perimeter model | Zero Trust |
|-----------|-----------------|-----------|
| Trust boundary | Network location (inside vs. outside) | Identity + device posture + request context |
| Authentication frequency | Once at the VPN gateway | Per-request, with re-authentication |
| Default lateral movement | Allowed within the LAN | Denied; explicit policy required |
| Encryption | Often only at the edge | End-to-end, application-layer |
| Visibility into the request | Coarse (firewall logs at the edge) | Fine-grained (every authorization decision logged) |

NIST SP 800-207 codifies the Zero Trust model around a *Policy Decision Point* (PDP) that evaluates each access request and a *Policy Enforcement Point* (PEP) that carries out the decision. The PDP draws on identity providers, device-posture systems, threat-intelligence feeds, and the request itself; the PEP sits in the data path and either forwards the request or blocks it. Access tokens are short-lived; sessions are continuously evaluated; the answer to "should this request proceed?" can change between one request and the next.

### 6.1 Micro-Segmentation

Zero Trust at the network layer is implemented largely through **micro-segmentation**: dividing the network into very small zones, often as fine-grained as one zone per workload, and enforcing default-deny policy between zones. The legacy alternative — "the database VLAN can talk to the application VLAN" — is replaced by "the `orders-api` service can talk to the `orders-db` service on TCP/5432, and nothing else."

Micro-segmentation is typically implemented in one of three ways:

- **Host-based agents** that enforce policy in the host's firewall or in user space (Illumio, Cisco Tetration). These work across cloud, on-prem, and hybrid environments.
- **Cloud-native security groups and network policies** (AWS Security Groups, GCP VPC firewall rules, Kubernetes NetworkPolicy). Strong inside one cloud, weaker across cloud boundaries.
- **Service-mesh sidecars** (Istio, Linkerd) that enforce mTLS and policy at the application-protocol layer, so the segmentation is independent of network topology.

The structural benefit of micro-segmentation is *blast-radius reduction*. When a single workload is compromised — a vulnerable application, a stolen credential, a malicious insider — the attacker can only reach what the policy permits, which is typically a tiny fraction of the environment. This is least privilege, applied to network reachability.

!!! mascot-tip "Defense in Depth, Now Applied to Network Reachability"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sentinel offering a tip">
    Treat every workload as if its blast radius is its segment. If you ask "can this service really need to reach that one?" and the honest answer is "no, but it's convenient," that's a future incident's lateral movement path. Default-deny, then add explicit allows. Least privilege, by default.

## 7. Trusted Access — SSH, Port Scanning, and NAC

### 7.1 SSH

**SSH** (Secure Shell) is the protocol that replaced Telnet, rlogin, and rsh in the 1990s and remains the workhorse for remote administration of Unix-like systems and increasingly of network equipment. SSH provides three guarantees over an untrusted network: a confidential channel, integrity protection, and mutual authentication of client and server. It runs over TCP/22 by default.

The SSH handshake is a hybrid-cryptography composition of the primitives from Chapter 3 and Chapter 4:

1. The client connects to the server. The server presents a *host key* (typically Ed25519 or ECDSA today, RSA on older systems).
2. The client checks the host key against `known_hosts`. On first connection, the client is asked to accept the key — this is the famous *trust on first use* (TOFU) prompt, and it is the weakest link in SSH's security model.
3. Client and server perform an ECDHE key exchange to derive a session key.
4. The client authenticates: usually by *public-key authentication* (the client signs a challenge with its private key, the server verifies against the corresponding public key in `authorized_keys`), occasionally by password.
5. All subsequent traffic is encrypted and integrity-protected.

The most important production hygiene rules around SSH are:

- **Disable password authentication.** Public-key authentication is far more resistant to brute force, credential stuffing, and phishing. SSH is one of the most commonly brute-forced services on the internet — every public-facing host sees thousands of login attempts per day.
- **Manage host keys centrally.** Ad hoc TOFU is fine for a handful of personal servers; for fleets, use SSH certificate authorities (signed host keys distributed to clients via configuration management) so that a compromised host key can be rotated cleanly.
- **Use an SSH bastion (jump host)** for access to internal networks, with logging on the bastion and time-bound user credentials. This concentrates the attack surface and the audit trail in one place.

### 7.2 Port Scanning

**Port scanning** is the active reconnaissance technique of probing a target's IP address(es) to determine which TCP and UDP ports are listening, what services are responding, and often what software versions those services are running. Port scanning is the first step of most external assessments — both legitimate (penetration tests, attack-surface management) and adversarial (target reconnaissance).

The most common scan types include:

- **TCP SYN scan** (`nmap -sS`) — sends a SYN, observes whether the response is SYN/ACK (open), RST (closed), or nothing (filtered). Half-open: the scanner does not complete the handshake.
- **TCP Connect scan** (`nmap -sT`) — completes the handshake; more visible in logs but does not require root privileges.
- **UDP scan** — much slower because there is no UDP equivalent of SYN/ACK; absence of an ICMP "port unreachable" is the only positive signal.
- **Service/version detection** (`nmap -sV`) — once an open port is found, sends protocol-specific probes to identify the running software (and often its version).

From the defender's perspective, port scanning is both a threat vector and a defensive tool. Threat: it is the precursor to most external attacks, and modern tooling can scan the entire IPv4 internet for any TCP port in under an hour. Defense: organizations should scan their own attack surface continuously and reconcile the result against an asset inventory — the unexpected open port on the unexpected host is exactly the device the security team did not know about.

!!! mascot-encourage "The Tools Look the Same in Both Hands"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Sentinel offering encouragement">
    The same tool used to attack a network can be used to defend it — `nmap`, packet captures, even DDoS testing services. That overlap is unsettling at first, and it is meant to be. You are learning to think like an attacker, build like a defender. The key is that your scope and authorization make the activity legal and ethical; the technique is neutral.

### 7.3 Network Access Control

**Network Access Control (NAC)** is the discipline of deciding which devices are permitted to connect to which parts of a network *before* they are given full network access. The core question NAC answers is: when a new device plugs in (or associates wirelessly), what should happen next?

A classical NAC system performs four checks:

1. **Identification** — what is this device? (MAC address, certificate, fingerprint)
2. **Authentication** — is the user or device who they claim to be? (typically via 802.1X)
3. **Posture assessment** — does the device meet policy? (current OS patches, active EDR agent, disk encryption enabled, no prohibited software)
4. **Authorization** — given identity + posture, which network segment(s) does the device get?

Devices that fail posture assessment are typically placed in a *quarantine VLAN* with very limited connectivity — usually just enough to talk to a remediation server that pushes patches or installs the missing agent. Once posture is acceptable, the device is moved to the appropriate production segment.

NAC complements micro-segmentation: NAC decides *whether* and *into which segment* a device joins; micro-segmentation decides what the device can reach within and across segments. The two together implement Zero Trust at the connection layer.

## 8. Proxies and Traffic Visibility

### 8.1 Proxy Server

A **proxy server** is an intermediary that forwards requests from clients to the wider network on the clients' behalf. The classical *forward proxy* sits between an organization's users and the internet: a user's browser sends an HTTP request to the proxy, the proxy forwards it to the destination, and returns the response to the user. The proxy has an opportunity to log the request, enforce policy (block known-malicious URLs, enforce category-based filtering, cache cacheable responses), and make outbound connections appear from a single, well-known IP address.

Forward proxies are the foundation of corporate web filtering. They are also commonly deployed with **TLS interception** (also called *SSL-bombing* or *TLS man-in-the-middle*), in which the proxy holds an internal certificate authority trusted by managed devices, terminates the user's TLS connection, inspects the cleartext, and re-encrypts to the destination. TLS interception is the only way to get content-aware filtering of HTTPS traffic, but it is also a powerful capability whose misuse breaks the authenticity guarantees of TLS — privacy advocates and security researchers have long criticized aggressive interception.

### 8.2 Reverse Proxy

A **reverse proxy** sits in front of one or more origin servers and accepts requests *on behalf of those servers* from external clients. The client connects to the reverse proxy thinking it is the destination; the reverse proxy forwards the request to the actual origin and returns the response. Common reverse-proxy platforms include Nginx, HAProxy, Envoy, AWS Application Load Balancer, and Cloudflare.

Reverse proxies are now the standard front door for almost every public web service because they consolidate several concerns:

- **TLS termination** — the reverse proxy holds the public certificate and handles the TLS handshake; origin servers behind it can speak plain HTTP on a private network.
- **Load balancing** — distributing requests across a pool of origin servers, with health checks.
- **WAF integration** — applying Layer 7 attack filtering (Chapter 8) before the request reaches the application.
- **DDoS protection** — absorbing attack traffic at a much higher capacity than any single origin.
- **Caching** — serving popular content from the proxy without hitting the origin.
- **Authentication** — handling OIDC/SAML at the edge so origin services can trust the validated identity in a header.

The forward-vs-reverse distinction is occasionally confusing; the table below clarifies which side each proxy is "on" and what it primarily protects.

| Property | Forward proxy | Reverse proxy |
|----------|---------------|---------------|
| On whose behalf? | The clients (users) | The servers |
| Primary location | Inside the corporate network | At the edge of the service's data center / cloud |
| Primary use | Outbound web filtering, logging | Inbound load balancing, TLS termination, WAF |
| Visible to whom? | Internal users explicitly configure it | External clients — they think it's the origin |

### 8.3 Packet Capture and NetFlow Analysis

When prevention has failed, when an alert has fired, when an incident is suspected — the question is always "what actually happened on the wire?" Two techniques answer that question at very different fidelities and costs.

**Packet capture** records the full content of network traffic. The classical tools are `tcpdump` and Wireshark; the storage format is PCAP. A full packet capture of a busy link captures every byte of every conversation: protocol headers, application payloads, TLS handshakes, encrypted application data. Packet capture is the highest-fidelity network telemetry possible — and the most expensive. A 10 Gbps link generates roughly 4.5 TB of traffic per hour; storing it for any meaningful period is a significant infrastructure exercise.

**NetFlow analysis** sits at the opposite end of the tradeoff. NetFlow (and its successors IPFIX and sFlow) does not record content; it records *summaries* of flows. A flow record contains the 5-tuple (source IP, destination IP, source port, destination port, protocol), the start and end times, and byte/packet counts. Each flow may represent thousands of packets summarized into a single record of perhaps 100 bytes. NetFlow gives the analyst a complete picture of *who talked to whom, when, how much, and over what protocol* — without ever inspecting the payload.

The following table summarizes when each technique is appropriate. In practice, mature security operations use both: NetFlow as the always-on, broad telemetry, and packet capture as the targeted, deep-dive tool when an investigation requires it.

| Concern | Packet capture | NetFlow |
|---------|:--------------:|:-------:|
| Visibility into payloads | Yes | No |
| Storage cost | Very high | Modest |
| Coverage of high-bandwidth links | Limited / sampled | Full |
| Compatible with encrypted traffic? | Headers only after TLS | Yes — operates on metadata |
| Useful for long-term retention | Days to weeks at most | Months to years |
| Useful for incident reconstruction (full content) | Essential | Insufficient on its own |
| Useful for behavioral baselining | Overkill | Ideal |

#### Diagram: Network Telemetry Stack

<details markdown="1">
<summary>Layered diagram showing where packet capture, NetFlow, DNS logs, firewall logs, and SIEM each fit</summary>
Type: diagram
**sim-id:** network-telemetry-stack<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A vertical layered diagram with five layers (top = most expensive / highest fidelity, bottom = cheapest / broadest coverage). Each layer shows the data type, an example tool, and the kind of question it can answer:

1. **Full packet capture (PCAP)** — `tcpdump`, Wireshark, Moloch — "What were the exact bytes of this conversation?"
2. **Application logs** — Web server, application audit logs — "What did the application do with this request?"
3. **Firewall / proxy logs** — pfSense, Squid — "Was this connection allowed, denied, or filtered?"
4. **NetFlow / IPFIX / sFlow** — `nfdump`, Elastiflow — "Who talked to whom, when, and how much?"
5. **DNS query logs** — Resolver logs — "What names did this host look up?"

To the right, an "aggregator" layer feeds all five into a **SIEM / data lake** (e.g., Splunk, Elastic, Chronicle), where correlation rules run.

Annotations:

- "Coverage" arrow on the left, increasing from top to bottom (full PCAP covers little, DNS logs cover everything cheaply)
- "Fidelity" arrow on the right, increasing from bottom to top (full PCAP is the gold standard for content)
- Cost note: "Storage cost roughly tracks fidelity. Most teams keep PCAP only on-demand and NetFlow always-on."

Color: cybersecurity blue for the layers; slate steel arrows; cream for the SIEM box. Responsive: layers stack vertically; SIEM moves below them on viewport widths under 700 px.

Implementation: Mermaid graph TD with subgraphs.
</details>

NetFlow is also the foundation of *behavioral analytics*. A network's normal flow patterns — which workstations talk to which servers, at what hours, in what volumes — form a baseline. Deviations from that baseline are often the first sign of compromise: a workstation that suddenly starts a high-volume connection to an unfamiliar IP at 3:00 a.m., a server that begins making outbound connections to a region the organization has no presence in. The detection does not need to read a single payload byte to be useful.

## 9. Wrapping Up: How These Pieces Compose

A mature defended network in 2026 looks roughly like this. Wireless networks use WPA3 with 802.1X EAP-TLS, with a WIPS scanning for rogue APs. The corporate DNS resolver enforces DNSSEC validation and forwards client queries over DoH or DoT to a vetted upstream; outbound port-53 traffic from non-resolvers is blocked at the edge to prevent tunneling. The organization publishes ROAs in RPKI for all of its IP prefixes and validates incoming announcements at peering points. Public services sit behind a CDN/reverse-proxy combination that absorbs volumetric DDoS at hundreds of points of presence and enforces a WAF against application-layer attacks. The internal network is micro-segmented; access to any resource flows through a Zero Trust policy decision point that authenticates the user, evaluates the device, and authorizes per-request. SSH access goes through a logged bastion; new devices entering the network pass through NAC posture assessment. NetFlow runs continuously, fed into a SIEM that baselines behavior and alerts on anomalies; full packet capture is available on-demand for incident response.

No single layer is sufficient. The attacker who bypasses one — whether by phishing a user, exploiting a zero-day in the proxy, or hijacking a BGP prefix — meets another. **Defense in depth** is not a slogan in this architecture; it is the architecture.

!!! mascot-celebration "What You Can Now Do"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sentinel celebrating">
    You can now read a modern network architecture diagram and identify each defense's job — what it covers, what it does not, and where it composes with the others. You can reason about wireless authentication, DNS and BGP integrity, DDoS economics, Zero Trust authorization, and the tradeoffs between packet-level and flow-level visibility. You have everything you need to design the network half of a defensible system. Chapter 10 turns inward to the system itself — operating systems, access control, virtualization, and containers.

## Key Takeaways

- **The perimeter model is no longer sufficient** — wireless airwaves, cloud workloads, and roaming users all puncture the inside/outside boundary. Modern network defense is layered and identity-aware.
- **WPA3 with 802.1X EAP-TLS** is the current standard for enterprise Wi-Fi; it provides forward secrecy, resists offline dictionary attacks, and is phishing-resistant. **Rogue access points** remain a threat that requires both technical (WIPS) and configuration (no auto-join) defenses.
- **DNSSEC** authenticates DNS records via a chain of trust rooted at the root zone; **DoH/DoT** add confidentiality. **DNS tunneling** abuses a typically-allowed protocol to smuggle data and is detectable in volume and entropy patterns.
- **RPKI** lets prefix holders cryptographically authorize their BGP announcements; ROV at validating networks blocks origin and sub-prefix hijacks. Path manipulation requires BGPsec, which is still rarely deployed.
- **DDoS attacks** come in volumetric (saturate bandwidth, often via amplification) and application-layer (exhaust application resources) forms. Modern mitigation uses ingress filtering, anycast capacity, scrubbing, and L7 rate limiting.
- **Zero Trust Architecture** decides authorization per-request based on identity, device posture, and context — never on network location alone. **Micro-segmentation** is its network-layer expression and dramatically reduces blast radius.
- **SSH** with public-key authentication and a bastion is the standard for remote administration. **Port scanning** is dual-use; defenders scan their own attack surface continuously.
- **NAC** decides admission and segment placement based on identity and posture; **proxies** (forward and reverse) consolidate logging, filtering, TLS termination, WAF, and load balancing. **Packet capture** gives full fidelity at high cost; **NetFlow** gives broad coverage at low cost; mature operations use both.

Next chapter: shifting focus from the network to the system itself — operating system security models, access control, virtualization, and container security.
