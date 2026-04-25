---
title: "Network Security Foundations: Protocols, Firewalls, and Detection"
description: "Examines connection security: the OSI and TCP/IP models, protocol attack surface, spoofing and sniffing, firewalls, intrusion detection and prevention, network segmentation, and VPNs."
generated_by: claude skill chapter-content-generator
date: 2026-04-25 11:21:00
version: 0.07
---

# Network Security Foundations: Protocols, Firewalls, and Detection

## Summary

Examines connection security: the OSI and TCP/IP models, common protocols and their attack surface (TCP, UDP, IP, ICMP), spoofing and MITM attacks, packet sniffing, firewalls (stateful, NGFW, WAF), intrusion detection and prevention, signature- and anomaly-based detection, network segmentation (VLANs, DMZ), VPNs, and IPsec.

## Concepts Covered

This chapter covers the following 25 concepts from the learning graph:

1. Network Security
2. OSI Model
3. TCP/IP Model
4. TCP
5. UDP
6. IP Protocol
7. ICMP
8. ARP Spoofing
9. DHCP Snooping
10. Man-in-the-Middle
11. Packet Sniffing
12. Firewall
13. Stateful Firewall
14. Next-Gen Firewall
15. Web Application Firewall
16. Intrusion Detection
17. Intrusion Prevention
18. Signature-Based Detection
19. Anomaly-Based Detection
20. Network Segmentation
21. VLAN
22. DMZ
23. VPN
24. IPsec
25. WireGuard

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Security Foundations: Properties, Mindset, and Risk](../01-security-foundations/index.md)
- [Chapter 2: Threats, Vulnerabilities, and Security Controls](../02-threats-and-controls/index.md)
- [Chapter 3: Cryptography Fundamentals: Symmetric Ciphers and Hashing](../03-crypto-fundamentals/index.md)
- [Chapter 5: Software Vulnerabilities and Secure Coding](../05-software-vulnerabilities/index.md)

---

!!! mascot-welcome "Welcome to the Wire"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    Welcome. In this chapter we trade the comfortable assumption that "the network is friendly" for a sharper instinct: every packet, every header, every protocol field is a place where an adversary can lie. We will work up the stack — from frames on a wire to web traffic at the perimeter — and build the controls that defenders compose into a defensible network. Trust, but verify.

## 1. What Network Security Actually Defends

**Network security** is the practice of protecting the confidentiality, integrity, and availability of data while it is in transit between systems, and of protecting the systems themselves from threats that arrive over a network. The discipline sits at the boundary between *connection security* (the wire, the protocols, the routers) and *system security* (the hosts, the services, the data those services hold). Almost every modern attack — from credential theft to ransomware to nation-state espionage — uses the network as either its delivery channel or its exfiltration channel, which is why the network is one of the most heavily instrumented layers in the modern security stack.

Three observations frame the chapter. First, the protocols that run the internet were designed in the 1970s and 1980s for a small, cooperative, mostly academic network. Confidentiality, integrity, and authentication were not initial design goals. We have spent the last forty years bolting those properties on after the fact — TLS over TCP, IPsec inside IP, DNSSEC over DNS — and the legacy of "security as an afterthought" still shapes the attack surface today.

Second, the network is the *first* place an attacker reaches. If they cannot get a packet to your service, they cannot exploit a vulnerability in your service. Network controls are therefore a leverage point: a single firewall rule, a single segmentation boundary, a single VPN gateway can eliminate huge classes of attacks before they even reach the application layer.

Third, the network is also the last place an attacker leaves. Stolen data must travel out of the environment, and command-and-control traffic must travel in. A network that is well-instrumented for detection turns an attacker's required exfiltration step into a *signal* that defenders can find and act on.

#### Diagram: Network Security as Layered Defense

<details markdown="1">
<summary>Concentric defensive layers from internet to crown-jewel data, with named controls at each boundary</summary>
Type: infographic-svg
**sim-id:** network-defense-layers<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A series of concentric ring shapes (or nested rectangles) representing defensive layers, drawn from outer (internet) to inner (crown-jewel data store):

- **Outermost ring (gray):** "Internet / Untrusted" — adversaries, scanning traffic, DDoS sources
- **Ring 2 (slate):** "Edge perimeter" — labeled controls: edge firewall, DDoS mitigation, IPS
- **Ring 3 (cybersecurity blue):** "DMZ" — labeled hosts: web/reverse proxy, public DNS, email gateway
- **Ring 4 (deeper blue):** "Internal network / VLAN-segmented" — labeled controls: stateful firewall, NAC, IDS sensors
- **Ring 5 (warm orange):** "Sensitive zone" — labeled hosts: application servers, internal services
- **Innermost (cream):** "Crown jewels" — database servers, key vaults, payment data

Between each ring, draw a small "trust boundary" indicator (dashed line) labeled with the typical control crossing that boundary (e.g., "TLS termination", "WAF", "stateful firewall", "micro-segmentation").

To the right of the rings, a small legend distinguishes:

- Solid arrow inward = "ingress traffic"
- Solid arrow outward = "egress traffic"
- Red dashed arrow = "lateral movement (what segmentation is meant to stop)"

Color palette: cybersecurity blue (#1565c0) for trusted controls, slate steel (#455a64) for boundaries, amber (#ffa000) for the lateral-movement warning arrow, fur orange (#d84315) for the sensitive zone callout.

Interaction: hover on each ring shows a tooltip listing the controls that typically live at that boundary. Responsive: collapses to a vertical stack of labeled tiles below 700px viewport. The diagram must respond to window resize events.

Implementation: Static SVG with `<title>` tooltips per ring; alternatively a small p5.js sketch if simple animations (highlighting one boundary on click) are desired.
</details>

## 2. Two Models of the Network Stack

Before we can talk about *attacks* on the network, we need a shared map of the network. Two layered models dominate the literature: the OSI model and the TCP/IP model. They are similar enough that a careful student can use either, and different enough that you need to know which one a given diagram is using.

The **OSI model** (Open Systems Interconnection, ISO/IEC 7498) is a seven-layer reference model published in the 1980s. It separates concerns from the physical wire all the way up to the user-facing application. The seven layers, from bottom to top, are: Physical, Data Link, Network, Transport, Session, Presentation, Application. OSI is more granular than the protocols actually deployed on the internet — the Session and Presentation layers, in particular, do not map cleanly to anything in TCP/IP — but it is the lingua franca of network engineers and the layer numbers (especially L2, L3, L4, L7) appear in nearly every security product datasheet you will ever read.

The **TCP/IP model** (also called the Internet model) is the four- or five-layer model that actually describes the internet as it was built. Its layers, from bottom to top, are: Link, Internet, Transport, and Application — sometimes with the Physical layer broken out separately. TCP/IP is descriptive rather than prescriptive: it documents the protocols that grew up around ARPANET and were standardized in the late 1970s and early 1980s.

The two models differ in number of layers and in some terminology, but they share the central insight: **each layer offers services to the layer above and uses services of the layer below**, and a security property at one layer does not automatically extend to the others. TLS at L7 does not protect L3 metadata. A VPN at L3 does not authenticate L7 application identities. Knowing where in the stack a control operates tells you what it can and cannot defend.

#### Diagram: OSI vs. TCP/IP Model Comparison

<details markdown="1">
<summary>Side-by-side comparison of OSI seven-layer model and TCP/IP four-layer model with example protocols</summary>
Type: infographic-svg
**sim-id:** osi-vs-tcpip<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A two-column visual:

**Left column: OSI (7 layers, bottom to top):**

1. Physical — copper, fiber, radio
2. Data Link — Ethernet, Wi-Fi, ARP
3. Network — IP, ICMP, routing
4. Transport — TCP, UDP
5. Session — RPC session state (largely absorbed elsewhere in practice)
6. Presentation — encoding, encryption framing (TLS in some readings)
7. Application — HTTP, DNS, SMTP, SSH

**Right column: TCP/IP (4 layers):**

1. Link (≈ OSI 1+2)
2. Internet (≈ OSI 3) — IP, ICMP
3. Transport (= OSI 4) — TCP, UDP
4. Application (≈ OSI 5+6+7) — HTTP, DNS, TLS, SSH

Draw horizontal dashed lines between the two columns showing which OSI layer maps to which TCP/IP layer. Place a small icon in each cell hinting at the protocol's role (e.g., a globe for IP, a chain for TCP, a lock for TLS).

To the right of the table, a vertical "where attacks live" annotation:

- L2: ARP spoofing, rogue DHCP, MAC flooding
- L3: IP spoofing, ICMP abuse
- L4: TCP RST injection, SYN floods, port scanning
- L7: SQL injection, XSS, request smuggling, prompt injection

Color: cybersecurity blue (#1565c0) for the OSI column, slate (#455a64) for the TCP/IP column, amber (#ffa000) for the attack-location callouts.

Responsive: stacks vertically below 800px; the attack annotations move below both columns. The diagram must respond to window resize events.

Implementation: Static SVG with `<title>` tooltips per layer that show example protocols and example controls (e.g., L4 tooltip: "Stateful firewalls operate here").
</details>

The pragmatic security mapping is roughly this: *L2 attacks* are local-network attacks that require an attacker to be on the same broadcast domain. *L3 attacks* affect routing, addressing, and reachability. *L4 attacks* affect connection state, ports, and flow control. *L7 attacks* exploit application-layer protocols and the data they carry. Different controls live at different layers, and a defense-in-depth posture composes them.

## 3. The Protocols That Run the Internet — and Their Attack Surface

Four protocols carry essentially all internet traffic at the network and transport layers: IP, TCP, UDP, and ICMP. Each was designed for cooperative use and each has security implications that you must understand before you can reason about the rest of the chapter.

### 3.1 IP — The Routed Datagram

**The Internet Protocol (IP)** is the L3 datagram protocol that gives every host on the internet an address and provides best-effort delivery of packets between addresses. The current production versions are IPv4 (32-bit addresses, exhausted but still dominant) and IPv6 (128-bit addresses, deployed but not yet majority). IP is *connectionless* — each datagram is forwarded independently — and *unreliable* — there is no guarantee of delivery, ordering, or duplicate suppression at this layer. Reliability is provided by higher-layer protocols (TCP) when needed.

The security-relevant properties of IP follow from what it does *not* do. IP does not authenticate the source address; the **source IP** in a packet header is whatever the sender wrote there. This makes **IP spoofing** trivially possible at the protocol level — the network does not check that a packet from "10.0.0.5" actually came from the host with that address. In practice, most ISPs filter spoofed source addresses at the network edge (BGP route filtering, ingress filtering per BCP 38), but inside an enterprise network spoofing is still routine and is the foundation of many later attacks. IP also does not provide confidentiality (the payload is in the clear) or integrity beyond a weak header checksum.

### 3.2 TCP — Reliable Streams

**The Transmission Control Protocol (TCP)** is the L4 protocol that turns IP's unreliable datagrams into reliable, ordered byte streams between two endpoints identified by (IP address, port) pairs. TCP is *connection-oriented*: a connection is established with a three-way handshake (SYN, SYN-ACK, ACK), data is exchanged with sequence and acknowledgment numbers, and the connection is closed with a four-way handshake (FIN, ACK, FIN, ACK). TCP guarantees that bytes sent on one side arrive on the other, in order, exactly once.

The security implications of TCP also follow from its design. The handshake involves picking a 32-bit *initial sequence number* (ISN) that the other side must echo back; if the ISN can be predicted (as it could in older operating systems), an attacker can blind-spoof a TCP connection without ever seeing the SYN-ACK. Modern stacks use cryptographically random ISNs to defend against this. The TCP flags (SYN, ACK, FIN, RST, PSH, URG) and the connection state machine are also the substrate for the L4 attacks we will name in a moment: **SYN floods** (consuming server connection state with half-open connections), **TCP RST injection** (forging an RST packet to tear down a connection), and **port scanning** (probing many ports to enumerate services).

### 3.3 UDP — The Lightweight Datagram

**The User Datagram Protocol (UDP)** is the L4 protocol for cases where you do not want TCP's reliability machinery. UDP simply wraps a payload with source and destination ports and a checksum, and hands it to IP. It is connectionless, has no congestion control, and provides no delivery guarantees. UDP is the protocol of DNS, NTP, DHCP, video streaming, online games, and the modern QUIC transport (which provides reliability on top of UDP at the application layer).

UDP's security profile is shaped by its statelessness. Because there is no handshake, an attacker can trivially spoof the source address of a UDP packet and have the response sent to a victim — this is the building block of **reflection and amplification DDoS attacks**, in which a small spoofed query (e.g., a DNS query) elicits a much larger response that floods the spoofed victim. Some UDP-based protocols (memcached, NTP monlist, open DNS resolvers) have amplification factors of 50x or more and have produced some of the largest DDoS attacks ever observed.

### 3.4 ICMP — The Network's Diagnostic Protocol

**The Internet Control Message Protocol (ICMP)** is the L3 protocol used for network diagnostics and error reporting. Its most familiar uses are *Echo Request* and *Echo Reply* (the basis of `ping`) and *Time Exceeded* (the basis of `traceroute`). ICMP is essential — it is how the network tells endpoints about MTU problems, unreachable destinations, and routing issues — and it is also a recurring source of security concern.

Historically, ICMP has been abused for **covert channels** (encoding data inside the payload of `ping` packets), for **OS fingerprinting** (different stacks respond to malformed ICMP differently), for **ping floods** (a primitive DoS), and for **smurf attacks** (broadcast amplification). Many networks restrict or rate-limit ICMP at the perimeter for these reasons, but blanket-blocking ICMP also breaks Path MTU Discovery and produces hard-to-diagnose performance problems. The thoughtful default is to permit *necessary* ICMP types (echo reply, fragmentation needed, destination unreachable) and rate-limit them, rather than blocking the protocol entirely.

| Protocol | Layer | Connection | Security gotcha |
|----------|------:|------------|-----------------|
| IP | L3 | None | Source address is unauthenticated; trivial to spoof inside a LAN |
| TCP | L4 | Stateful (3-way handshake) | SYN floods; RST injection; ISN prediction in legacy stacks |
| UDP | L4 | Stateless | Reflection/amplification DDoS via spoofed source |
| ICMP | L3 | None | Covert channels, fingerprinting, smurf amplification |

!!! mascot-thinking "Why The Network Lies"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    Notice the recurring shape: every one of these protocols was designed without authenticating the *source*. That single design decision — repeated at L2 (ARP), L3 (IP), L4 (UDP), and L7 (early HTTP) — is the parent of an entire family of impersonation attacks. Once you see the pattern, ARP spoofing, IP spoofing, and DNS cache poisoning all become variations of the same theme.

## 4. Local-Network Attacks: ARP, DHCP, and Sniffing

The most damaging attacks on a local network rarely involve sophisticated cryptography — they exploit the fact that L2 protocols on a typical Ethernet or Wi-Fi segment trust whatever a peer says. We will look at three: ARP spoofing, rogue DHCP, and packet sniffing. Together they enable the larger pattern of **man-in-the-middle (MITM)** attacks.

### 4.1 ARP Spoofing

**The Address Resolution Protocol (ARP)** maps L3 IP addresses to L2 MAC addresses on a local Ethernet segment. When host A wants to send a packet to host B on the same LAN, A broadcasts an ARP request — "Who has IP 10.0.0.5?" — and B replies with its MAC address. A then caches that mapping and uses it for subsequent traffic.

ARP has no authentication. Any host on the LAN can claim to be any IP address by sending an unsolicited ARP reply (a *gratuitous ARP*), and most hosts will update their ARP cache on receipt without checking. **ARP spoofing** (or *ARP poisoning*) is the attack of sending forged ARP replies to redirect another host's traffic through the attacker. The classic pattern: the attacker tells host A that the gateway's IP maps to the attacker's MAC, and tells the gateway that A's IP maps to the attacker's MAC. Now all traffic between A and the gateway flows through the attacker, who can read it, modify it, or drop it. This is a textbook **man-in-the-middle** attack and it works against any unencrypted protocol on the LAN.

The defenses are layered. *Static ARP entries* on critical hosts prevent cache poisoning, but do not scale. *Dynamic ARP Inspection (DAI)* on managed switches validates ARP traffic against a trusted binding table built from DHCP. End-to-end encryption (TLS, IPsec, SSH) renders the captured traffic useless to the attacker even if redirection succeeds — the MITM gets ciphertext, not plaintext.

### 4.2 DHCP Snooping

**The Dynamic Host Configuration Protocol (DHCP)** assigns IP addresses, subnet masks, default gateways, and DNS servers to hosts as they join a network. DHCP works by client-broadcast (the client sends a DISCOVER and accepts the first valid OFFER from a DHCP server), and like ARP, it has no built-in authentication of the server.

A **rogue DHCP server** is an attacker host that responds to DHCP DISCOVERs faster than the legitimate server, handing out attacker-controlled DNS servers and default gateways. Once a victim accepts the rogue lease, the attacker controls name resolution and routing for that host — a powerful starting point for MITM and credential-harvesting attacks. **DHCP snooping** is the standard switch-level defense: configure the managed switch to permit DHCP server replies only from designated trusted ports, and drop server replies from all other ports. DHCP snooping also produces the trusted IP-to-MAC binding table that Dynamic ARP Inspection uses, so the two controls compose naturally.

### 4.3 Packet Sniffing

**Packet sniffing** is the act of capturing network frames or packets that are visible on a network interface and decoding them. On a wired Ethernet hub (now rare), every frame was visible to every host; on a switched Ethernet, frames are normally only visible to the intended destination, but sniffers in *promiscuous mode* can still capture broadcast and multicast traffic, and ARP spoofing or port-mirroring can put unicast traffic in front of a sniffer. On Wi-Fi, frames travel through the air and can be captured by anyone within radio range with a card in monitor mode.

Sniffing is dual-use. Defenders use sniffers (Wireshark, tcpdump, Zeek) for diagnostics, intrusion detection, and forensic investigation. Attackers use sniffers to harvest credentials, session tokens, and unencrypted application data. The historical lesson is sharp: protocols that send credentials in cleartext — Telnet, FTP, POP3, IMAP, HTTP without TLS — leak those credentials to anyone who can sniff the wire. The modern defense is end-to-end encryption *everywhere*, even on networks you nominally trust. A sniffer on a corporate LAN that captures TLS-encrypted traffic captures opaque ciphertext, which is exactly the property we want.

!!! mascot-warning "Trusting The LAN Is A Footgun"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel showing caution">
    "It is on the internal network so we do not need TLS" was a defensible argument in 1995 and is a defect in 2026. Insider threats, compromised endpoints, and lateral-movement attacks all live inside the LAN, and ARP spoofing turns any same-segment attacker into a MITM. The modern default — *encrypt every connection, even inside the perimeter* — is exactly what Zero Trust formalizes.

## 5. Man-in-the-Middle: Composing the Attacks

A **man-in-the-middle (MITM) attack** is one in which the attacker positions themselves between two communicating parties, relaying messages between them while reading or modifying the traffic. MITM is not a single technique; it is an *outcome* that can be reached from many starting positions.

The starting positions we have already named: ARP spoofing on a LAN, rogue DHCP handing out a malicious gateway, a compromised Wi-Fi access point, BGP hijacking that redirects entire prefixes, DNS cache poisoning that returns a malicious IP for a legitimate hostname, or simple cable tapping with physical access. From any of these positions, the attacker can run a full MITM if the traffic itself is unauthenticated or unencrypted.

The defense against MITM at the protocol level is *mutual authentication* combined with *encryption*: the client verifies the server's identity (typically via a TLS certificate signed by a trusted CA), the server optionally verifies the client's identity, and both sides establish session keys that an interposed attacker cannot derive. This is exactly the structure that Chapter 4 built up — TLS provides server authentication via PKI and forward-secret session keys via ECDHE — and it is why "use TLS, validate the certificate, do not click through warnings" is the simplest summary of MITM defense at the application layer.

#### Diagram: MITM Attack Topology

<details markdown="1">
<summary>Sequence diagram showing how ARP spoofing places an attacker between a client and a gateway</summary>
Type: workflow-diagram
**sim-id:** mitm-arp-spoofing<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A sequence diagram with four actors arranged horizontally: Client (left), Attacker (left-center), Gateway (right-center), Internet (right).

Steps top to bottom:

1. **Normal flow (top half, in slate):**
    - Client → Gateway: ARP request "Who has 10.0.0.1?"
    - Gateway → Client: ARP reply "10.0.0.1 is at MAC AA:BB:CC..."
    - Client → Gateway: HTTP request
    - Gateway → Internet: forwarded request

2. **Attack begins (separator line in amber #ffa000):** "Attacker sends gratuitous ARP replies"

3. **After ARP poisoning (bottom half, in red):**
    - Attacker → Client: forged ARP "10.0.0.1 is at MAC ATTACKER..."
    - Attacker → Gateway: forged ARP "Client IP is at MAC ATTACKER..."
    - Client → Attacker (thinking it is the Gateway): HTTP request
    - Attacker → Gateway: relayed HTTP request (after reading/modifying)
    - Gateway → Attacker: HTTP response
    - Attacker → Client: relayed HTTP response

To the right, a callout: "If the client uses HTTPS with proper certificate validation, the attacker cannot impersonate the server — the relayed traffic is opaque ciphertext."

Color: cybersecurity blue (#1565c0) for the client, slate (#455a64) for the gateway, fur orange (#d84315) for the attacker, amber (#ffa000) for the attack-begins separator. Responsive: simplifies to a vertical sequence below 700px viewport.

Implementation: Mermaid sequenceDiagram with custom theming.
</details>

## 6. Firewalls: From Packet Filters to NGFW

A **firewall** is a network control that enforces a stated policy on traffic crossing a boundary, typically by allowing or denying packets based on rules. Firewalls have evolved through three generations, and understanding the differences is critical because vendor marketing tends to flatten them into a single buzzword.

### 6.1 Stateless Packet Filters

The first generation of firewalls (1980s–early 1990s) were **stateless packet filters**: they examined each packet in isolation, matched it against a list of rules based on source/destination IP, source/destination port, and protocol, and either accepted or dropped the packet. Stateless filtering is fast and simple, but it cannot tell whether a given inbound TCP packet is part of an established connection or an unsolicited probe. To allow return traffic, stateless rules must permit *any* inbound packet matching the expected ports — which is a much broader hole than necessary.

### 6.2 Stateful Firewalls

A **stateful firewall** maintains a *connection table* that tracks the state of every TCP connection (and pseudo-connection state for UDP and ICMP) crossing the boundary. When a host inside the firewall initiates an outbound TCP connection, the firewall records the connection's five-tuple (source IP, source port, destination IP, destination port, protocol) and permits return packets that match that tuple. Unsolicited inbound packets that do not match any active connection are dropped.

Stateful firewalls are the modern baseline. They are present in every commercial firewall product and in every modern operating system's host firewall (Linux netfilter/iptables, Windows Defender Firewall, macOS pf). The connection table itself is an attack target — flooding it with half-open SYN connections or with bogus traffic can exhaust the table and cause the firewall to drop legitimate traffic — so SYN-cookie protection and connection-table sizing are real engineering concerns.

### 6.3 Next-Generation Firewalls

A **next-generation firewall (NGFW)** is a stateful firewall augmented with *application-layer inspection*, *user identity awareness*, and integrated threat intelligence. An NGFW does not just look at L4 ports; it parses the L7 protocol (HTTP, DNS, SMB, etc.), identifies the application by signature regardless of port (so a TLS connection on port 443 can be classified as Dropbox vs. Slack vs. a generic HTTPS web request), and applies policy based on user identity tied to a directory service (Active Directory, LDAP, SAML).

NGFWs typically include integrated intrusion prevention, URL filtering, malware sandboxing, and TLS inspection (also called *TLS interception*, in which the firewall terminates the client TLS connection, inspects the plaintext, and re-encrypts to the server using a CA certificate trusted by the corporate endpoints). TLS inspection is powerful and fragile — it gives the firewall visibility into encrypted traffic, but it also breaks certificate pinning, weakens end-to-end security guarantees, and creates a high-value compromise target. We will return to its tradeoffs in Chapter 9.

### 6.4 Web Application Firewalls

A **Web Application Firewall (WAF)** is a specialized firewall that operates exclusively at L7 for HTTP/S traffic, in front of web applications. Where a network firewall asks "should this packet be allowed?", a WAF asks "does this HTTP request look like a SQL injection, an XSS attempt, a request smuggle, or some other application-layer attack?" WAFs are configured with rule sets — most commonly the OWASP ModSecurity Core Rule Set (CRS) — and can be deployed as a reverse proxy, a CDN module (Cloudflare, AWS WAF, Akamai), or an inline appliance.

WAFs are *complementary* to secure coding, not a substitute for it. A correctly written application that escapes SQL parameters and validates input does not need a WAF to prevent injection — the application is already correct. But in practice, applications evolve, vulnerabilities are introduced, and zero-days exist; a WAF gives defenders a place to deploy a temporary filter (a *virtual patch*) for a known vulnerability while the application team produces a proper fix. WAFs are also effective against the long tail of automated attacks — credential stuffing, scanning, scraping — that flood every public web application.

| Generation | Layer | What it inspects | Typical use |
|------------|------:|-----------------|-------------|
| Stateless packet filter | L3/L4 | Headers per packet | Legacy edge filtering |
| Stateful firewall | L3/L4 | Connection state + headers | Standard perimeter and host firewall |
| Next-gen firewall (NGFW) | L3–L7 | Application identity, user identity, threat intel | Modern enterprise edge |
| Web Application Firewall | L7 (HTTP/S only) | HTTP request/response semantics | In front of public web applications |

!!! mascot-tip "Pick The Firewall To Match The Attack Surface"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sentinel offering a tip">
    A stateful firewall in front of a web application will not stop SQL injection — that attack is well-formed HTTP and looks legitimate at L4. Conversely, a WAF will not stop a SYN flood — that attack is L4 and never reaches the HTTP parser. Defense in depth here is literal: layer the controls so each one defends what it can actually see.

## 7. Intrusion Detection and Prevention

A firewall is a *preventive* control: it allows or denies traffic according to policy. **Intrusion detection** is a *detective* control that watches traffic (or hosts, or both) for evidence of malicious activity that the preventive controls did not stop. **Intrusion prevention** is the same machinery wired into the data path so that detection can also trigger automatic blocking.

### 7.1 IDS vs. IPS

**An Intrusion Detection System (IDS)** observes traffic out-of-band — typically receiving a copy of the traffic via a switch port mirror (SPAN port) or a network tap — and raises alerts when it sees something suspicious. Because it is out-of-band, an IDS cannot block traffic; it can only generate alerts that defenders investigate. The classic open-source IDS tools are Snort (signature-based), Suricata (multi-threaded successor with hybrid capabilities), and Zeek (formerly Bro, a richer protocol-analysis framework that produces structured logs rather than fixed alerts).

**An Intrusion Prevention System (IPS)** sits *in-line* in the traffic path, like a firewall, and can drop or reset connections in real time when a detection rule fires. An IPS gets the benefit of automatic response but pays a cost in availability risk: a false positive on an IPS rule can drop legitimate traffic, and an IPS that crashes or becomes overloaded can become a single point of failure for the entire network segment behind it. Many modern deployments configure the same engine in IDS mode in some places (less critical, more sensitive detections) and IPS mode in others (well-tuned, high-confidence rules).

The choice between IDS and IPS is a familiar safety tradeoff: IDS optimizes for *fewer false negatives* (you can run aggressive rules because there is no immediate operational impact) and IPS optimizes for *automatic response* (worth the false-positive risk for high-confidence detections).

### 7.2 Detection Methods: Signature vs. Anomaly

Within either IDS or IPS, two detection philosophies compete and complement each other.

**Signature-based detection** matches traffic against a database of patterns known to indicate specific attacks or malware — the byte sequences in a known exploit, the URL patterns of a known scanner, the JA3 fingerprint of a known C2 framework. Signatures are the IDS analog of antivirus signatures and have the same strengths and weaknesses: high precision against known threats, blind to anything novel. The Suricata and Snort rule ecosystems contain tens of thousands of community-maintained signatures and are an effective baseline. The fundamental limit is that signature-based detection cannot find what is not in the database — a fresh zero-day, a custom-built piece of malware, or a living-off-the-land technique that uses only legitimate tools.

**Anomaly-based detection** builds a model of "normal" behavior — usually statistical or, increasingly, ML-based — and alerts on deviations from that baseline. Anomaly detection can find novel attacks that signature detection misses (a sudden 10 GB upload from an accounting workstation at 3 AM, a new outbound connection to a country the organization has never communicated with, an internal host suddenly scanning the rest of the subnet). The trade-off is *false positives*: anomalies are common in real environments — new business processes, software updates, employees on holiday — and an alert volume that exceeds analyst capacity is operationally identical to no detection at all.

In practice, modern detection stacks blend both. Signatures handle the known-threat baseline cheaply and reliably. Anomaly methods, often layered with threat intelligence and behavioral analytics, fill in the gap for novel and stealthy attacks. The composition is what matters: each method covers a class of attack the other misses.

| Method | Catches | Misses | False positives | Typical use |
|--------|---------|--------|-----------------|-------------|
| Signature-based | Known attacks, known malware | Novel and custom attacks | Low (per signature) | First-line detection, AV, IPS rules |
| Anomaly-based | Novel deviations, insider threats | Slow drift, attacks resembling normal use | Higher (depend on baseline) | Behavioral analytics, ML detection |
| Hybrid (modern) | Both classes (each method covers the other's blind spot) | Attacks that look both normal and absent from signatures | Medium (with tuning) | Modern SIEM and EDR stacks |

#### Diagram: IDS/IPS Decision Flow

<details markdown="1">
<summary>Workflow showing how a packet flows through a detection engine and whether it is allowed, alerted, or dropped</summary>
Type: workflow-diagram
**sim-id:** ids-ips-decision-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A flowchart starting at the top with "Inbound packet" entering the network boundary.

Branch 1: **IDS path (out-of-band)**

- Packet → Switch SPAN port → IDS engine (signature engine + anomaly engine in parallel)
- If match → emit alert to SIEM (orange annotation: "alert only — packet is not blocked")
- Original packet continues to destination unchanged

Branch 2: **IPS path (in-line)**

- Packet enters IPS engine in the data path
- Signature check: if known-bad → drop, log, terminate connection
- Anomaly check: if score above threshold → drop or quarantine
- Otherwise → forward packet to destination

Below the two branches, a comparison panel:

- IDS pros: no availability risk, can run aggressive rules
- IDS cons: no real-time blocking
- IPS pros: real-time blocking, automatic response
- IPS cons: false positives drop legitimate traffic; single point of failure

Color: cybersecurity blue (#1565c0) for permitted-traffic flow, amber (#ffa000) for alerts, red for drops, slate (#455a64) for the comparison panel. Responsive: stacks vertically below 700px viewport. The diagram must respond to window resize events.

Implementation: Mermaid flowchart TD with custom node styling and subgraphs for the two branches.
</details>

#### MicroSim: Detection Tuning Trade-Off Explorer

<details markdown="1">
<summary>Interactive simulation showing how detection threshold affects true positives, false positives, and alert volume</summary>
Type: microsim
**sim-id:** detection-threshold-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom: Analyze):** Students will analyze how the choice of detection threshold trades off true-positive rate against false-positive rate, and will reason about the operational consequences (alert fatigue, missed attacks) of the two extremes.

**Canvas:** 800 × 500 px, responsive (must respond to window resize events; canvas width adapts to container width with `updateCanvasSize()` as the first call in `setup()`). Canvas parented with `canvas.parent(document.querySelector('main'));`.

**Visual layout:**

- Top half: a horizontal axis labeled "anomaly score". Two overlapping bell curves: a blue curve labeled "benign traffic" centered at score 0.3, and a red curve labeled "malicious traffic" centered at score 0.7. The two curves overlap in the middle.
- A vertical movable threshold line (draggable, slate color) crossing both curves.
- The area under the malicious curve to the right of the threshold is shaded green (true positives).
- The area under the benign curve to the right of the threshold is shaded amber (false positives).
- The area under the malicious curve to the left of the threshold is shaded red (false negatives — missed attacks).
- The area under the benign curve to the left of the threshold is unshaded (true negatives).

- Bottom half: four live-updating numeric readouts labeled "True Positives", "False Positives", "False Negatives", "Alert Volume per Day (estimated)". A small line chart shows the ROC point (TPR, FPR) corresponding to the current threshold.

**Controls (using p5.js builtin controls — `createSlider`, `createButton`):**

- Slider: "Threshold" (0.0 to 1.0, step 0.01) — moves the vertical line
- Slider: "Curve overlap" (0.1 to 0.5, step 0.01) — controls the standard deviation of the two curves to simulate easier or harder detection problems
- Slider: "Daily traffic volume (events)" (1,000 to 1,000,000, log-scaled) — to make alert volume tangible
- Button: "Preset: signature-style (high threshold)" — moves the threshold to 0.85
- Button: "Preset: anomaly-style (lower threshold)" — moves the threshold to 0.55
- Button: "Reset"

**Behavior:**

- Dragging the threshold updates all four readouts in real time.
- Lowering the threshold catches more malicious events (TP up) but raises the false-positive count and the alert-volume readout linearly with traffic.
- A small caption updates dynamically: at very low thresholds, "alert fatigue zone — analysts will miss real attacks among the noise"; at very high thresholds, "missed-attack zone — detection rules pass over real malicious activity"; in the middle, "operational range".

**Default parameters:** threshold = 0.5, overlap = 0.2, traffic = 100,000 events/day.

**Color palette:** cybersecurity blue (#1565c0) for benign curve, fur orange (#d84315) for malicious curve, amber (#ffa000) for false-positive shading, green (#4caf50) for true-positive shading, slate (#455a64) for the threshold line.

Implementation: p5.js single sketch. Use `updateCanvasSize()` as the first step in `setup()` to get container width. Parent canvas with `canvas.parent(document.querySelector('main'));`.
</details>

## 8. Network Segmentation: VLANs and the DMZ

**Network segmentation** is the practice of partitioning a network into smaller zones with controlled traffic flows between them, so that a compromise in one zone is contained rather than propagating to the entire environment. Segmentation is the most concrete realization of the *blast radius* principle from Chapter 1: when something inevitably goes wrong, the damage is bounded by where the boundaries were drawn.

### 8.1 Why Segmentation Matters

A flat network — one in which every host can reach every other host on every port — is a structure in which a single compromised endpoint can reach the database, the domain controller, the backup server, and the developer workstation with equal ease. Most major breaches in the past decade (Target, NotPetya, Equifax, the Colonial Pipeline incident) involved an attacker pivoting laterally across a flat or near-flat internal network from an initial foothold on a low-value asset. The technical recommendation that follows from these post-mortems is consistent: segment by trust level, segment by data sensitivity, and constrain the paths between segments to the minimum necessary.

### 8.2 VLANs

**A Virtual LAN (VLAN)** is a logical L2 broadcast domain that exists on a physical switch infrastructure. VLANs are tagged using the IEEE 802.1Q standard, which adds a 12-bit VLAN ID to each Ethernet frame. A managed switch can place different ports into different VLANs, and frames in different VLANs cannot communicate at L2 — they must be routed at L3, where firewall rules can be applied between subnets.

VLANs are the workhorse of internal segmentation. A typical enterprise might have separate VLANs for office workstations, servers, voice over IP, building management, guest Wi-Fi, and lab/development environments. The L3 boundary between VLANs is a natural place to put a stateful firewall, restricting which subnets can talk to which on which ports.

VLAN security has its own pitfalls. **VLAN hopping** is a class of attacks (double-tagging, switch-spoofing) in which an attacker on one VLAN injects frames that the switch forwards to another VLAN; modern switches with proper trunk-port configuration defeat this. **Misconfiguration** is the larger risk in practice — a port left in the wrong VLAN can quietly grant a workstation access to a server zone for years before anyone notices. Asset inventory and periodic configuration audits are the operational counterweights.

### 8.3 The DMZ

**A demilitarized zone (DMZ)** is a network segment that hosts services intended to be reachable from the internet — public web servers, mail relays, DNS servers — and that is isolated from the internal corporate network by a firewall. The DMZ pattern is one of the oldest in network security, dating to the 1990s, and remains conceptually central even in cloud-era architectures where the "DMZ" might be a public-subnet VPC tier rather than a physical zone.

The classic design uses two firewalls (or one firewall with three interfaces): one between the internet and the DMZ, and one between the DMZ and the internal network. Hosts in the DMZ accept connections from the internet for the specific services they expose, and the internal-side firewall is configured *deny by default* so that even a fully compromised DMZ host cannot freely reach internal systems. Ideally the DMZ host can only reach a small set of named internal endpoints (a database replica, a queue, an authentication service) on specific ports. This composes the *defense in depth* and *least privilege* principles into a structural pattern.

Modern segmentation extends the DMZ idea inward: **micro-segmentation** treats every workload as a potential trust boundary, applies firewall-like rules per workload (often via host agents or service-mesh policy), and aspires to a network where an attacker who lands on one host cannot reach any other host without permission. This is the structural foundation of Zero Trust networking, which Chapter 9 treats in depth.

#### Diagram: Classic DMZ Architecture

<details markdown="1">
<summary>Three-zone DMZ topology with internet, DMZ tier, and internal network separated by firewalls</summary>
Type: diagram
**sim-id:** classic-dmz-architecture<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A horizontal flow with three zones drawn as boxed regions:

**Left zone (gray):** "Internet" — represented by a cloud icon and "Untrusted clients, scanners, attackers".

**Middle zone (slate):** "DMZ" — drawn as a clearly bordered box. Inside: three labeled hosts (web reverse proxy, public DNS, SMTP relay).

**Right zone (cybersecurity blue):** "Internal network" — drawn as a clearly bordered box. Inside: labeled hosts (application servers, database, domain controller, file servers).

Between the Internet and the DMZ: a firewall icon labeled "Edge firewall — permits ports 80, 443, 25, 53 inbound to specific DMZ hosts".

Between the DMZ and the Internal network: a second firewall icon labeled "Inner firewall — DMZ may initiate connections only to specific internal endpoints (database replica, auth service) on specific ports; no internal-initiated traffic to DMZ".

Annotation arrows showing typical legitimate flows:

- Internet → DMZ web server: solid blue
- DMZ web server → internal application server: solid blue (narrow, specific port)
- Internal users → internet: dashed blue (egress through edge firewall, not via DMZ)

A red dashed arrow showing an *attempted* attacker pivot from a compromised DMZ host into the internal network, blocked by the inner firewall — labeled "blocked by deny-by-default policy".

Color: cybersecurity blue (#1565c0) for trusted flows, slate (#455a64) for the DMZ, fur orange (#d84315)/red for the blocked attack arrow. Responsive: stacks vertically below 800px viewport. The diagram must respond to window resize events.

Implementation: Mermaid flowchart LR with subgraphs for each zone.
</details>

## 9. VPNs and the Tunneling Layer

Once we accept that traffic across an untrusted network must be encrypted, we need a mechanism that does this *generically* — that protects whatever the application is doing, without each application needing to implement its own crypto. **A virtual private network (VPN)** is exactly that mechanism: a tunnel that takes packets from one network and encapsulates them, encrypted, inside packets sent across an untrusted network, where they are decrypted and emitted onto another (logically connected) network.

VPNs serve two distinct use cases that are often confused. *Remote-access VPNs* connect an individual user (a remote employee, a traveling laptop) to a corporate network so the user appears, to internal services, as if they were on the corporate LAN. *Site-to-site VPNs* connect two networks (a branch office and headquarters, two cloud VPCs in different regions) into one logical network without paying for a private circuit between them. The cryptographic mechanism is the same in both cases; only the topology differs.

VPNs provide confidentiality and integrity for the *tunnel*, and they provide authentication of the *tunnel endpoints*. They do not, by themselves, authenticate end users, sanitize traffic, or extend Zero Trust principles to inside the tunnel. A user with valid VPN credentials gets full network reachability inside the tunnel, which is precisely the over-trusting model that Zero Trust networking is designed to replace. Modern enterprises increasingly deploy VPNs alongside per-application access controls (sometimes called Zero Trust Network Access, ZTNA) rather than as a sole means of remote access.

### 9.1 IPsec

**IPsec** (Internet Protocol Security) is a suite of protocols, standardized in the late 1990s, that provides authentication, integrity, and confidentiality at L3 — the IP layer itself. IPsec has two main modes. *Transport mode* protects the payload of an IP packet between two endpoints (the IP header is unchanged). *Tunnel mode* encapsulates an entire IP packet inside another IP packet, protecting the original headers and payload — this is the mode used for site-to-site VPNs and most remote-access VPN gateways.

IPsec uses two protocols on the wire: **AH (Authentication Header)** for integrity and authenticity but not confidentiality, and **ESP (Encapsulating Security Payload)** for confidentiality plus optional integrity. ESP is overwhelmingly the more common choice. Key establishment and policy negotiation use **IKE (Internet Key Exchange)**, currently in its second version IKEv2, which performs a Diffie-Hellman exchange (Chapter 3) and authenticates the endpoints with either pre-shared keys, certificates, or EAP methods.

IPsec's reputation among engineers is mixed. The protocol family is powerful and is the backbone of countless site-to-site links worldwide, but it is also notoriously complex — IKE has multiple modes, dozens of configuration parameters, and a long history of subtle interoperability issues between vendors. For new deployments, especially remote-access ones, simpler alternatives often win.

### 9.2 WireGuard

**WireGuard** is a modern VPN protocol, designed by Jason Donenfeld and merged into the mainline Linux kernel in 2020. WireGuard's design philosophy is minimalism: a small codebase (a few thousand lines vs. tens of thousands for IPsec/IKE), a fixed cryptographic suite (Curve25519 for key exchange, ChaCha20-Poly1305 for AEAD encryption, BLAKE2s for hashing), and a simple configuration model based on public-key pairs. There are no negotiable algorithms, no fallback modes, and no separate key-management daemon — the protocol simply works once each peer has the other's public key.

In practice WireGuard offers significantly better performance than IPsec in many configurations, dramatically simpler configuration files, and a smaller attack surface. It is now the default protocol for several commercial VPN providers and a popular choice for site-to-site links between cloud environments. The trade-off is feature set: WireGuard intentionally does not support some IPsec features (dynamic key rollover negotiation, complex split-tunneling policies) and is opinionated about its cryptographic choices in a way that IPsec is not. For many uses, that opinionation is the feature, not the bug.

| Property | IPsec | WireGuard |
|----------|-------|-----------|
| Layer | L3 | L3 |
| Key exchange | IKEv2 (Diffie-Hellman) | Noise framework over Curve25519 |
| Algorithms | Negotiable suite | Fixed (ChaCha20-Poly1305, Curve25519, BLAKE2s) |
| Codebase size | ~70k+ LoC across components | ~4k LoC |
| Configuration | Complex (policy files, IKE config) | Simple (peer public keys + endpoints) |
| Standardization | IETF RFCs, 1990s onward | RFC-track, Linux kernel since 2020 |
| Typical strength | Long-haul site-to-site, vendor interop | Modern remote access, cloud-to-cloud |

!!! mascot-encourage "Two Hard Topics, One Mental Model"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Sentinel offering encouragement">
    The pile of acronyms in this section — IKEv2, ESP, AH, AEAD, ChaCha20-Poly1305 — can feel like alphabet soup the first time through. The mental model is simpler than the names suggest: a VPN is just *Diffie-Hellman to set up a shared secret, then authenticated encryption to protect everything you send*. Every protocol in this chapter is a variation on that one sentence. Read it twice; the rest is detail.

## 10. Putting the Network Defenses Together

To anchor the chapter, consider the layered network defense that a competent security team would deploy in front of a public-facing web application. Each layer addresses a class of attack the others cannot, and together they realize the *defense in depth* principle from Chapter 1.

1. **Edge** — DDoS mitigation (cloud-scrubbing service or CDN) absorbs volumetric attacks before they reach the origin. Without this, a 100 Gbps attack saturates the edge link regardless of how well-tuned the firewall is.
2. **Perimeter firewall** — a stateful, NGFW or cloud security group permits only the public service ports (typically 443 inbound) and denies everything else by default.
3. **WAF** — in front of the application, blocks the OWASP-class L7 attacks the firewall cannot see. Deployed as a CDN module or reverse proxy.
4. **Segmentation** — the application servers live in a segmented zone (DMZ or VPC public tier) and can only reach a small set of internal services (database, queue, auth) on specific ports. The internal-side firewall is deny-by-default.
5. **Detection** — IDS sensors with both signature and anomaly engines watch the traffic across each segment boundary. Alerts feed a SIEM that correlates with host telemetry.
6. **Encryption everywhere** — TLS for client-to-edge and edge-to-application; mutual TLS or service-mesh-managed mTLS between internal services. Even with the perimeter and segmentation controls in place, the assumption is that a sufficiently determined attacker can reach the LAN, and the encryption renders captured traffic opaque.
7. **Access** — administrative access to internal systems is via VPN (IPsec or WireGuard) with strong authentication, or — increasingly — via a Zero Trust access proxy that authenticates each request rather than relying on tunnel-level trust. (Chapter 9 returns to Zero Trust in detail.)

No single one of these layers is sufficient, and removing any one of them measurably increases the attacker's options. The mental discipline the chapter is teaching — *for every attack class, name the layer that defends it; for every layer, name what it cannot defend* — is the heart of a defensible network architecture.

#### Diagram: Layered Network Defense Reference Architecture

<details markdown="1">
<summary>End-to-end reference architecture showing how the seven defensive layers compose</summary>
Type: diagram
**sim-id:** layered-network-defense-reference<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A vertical layered architecture diagram (top to bottom):

1. **Internet client** (external) — cloud/laptop icon
2. **DDoS scrubbing / CDN** layer — labeled with its responsibility (volumetric absorption, geo filtering)
3. **Edge stateful firewall** — permits 443 only
4. **WAF** — blocks L7 attacks (SQLi, XSS, request smuggling)
5. **Load balancer / TLS termination**
6. **Application tier (DMZ/public subnet)** — N replicas, internal IPs
7. **Inner firewall / micro-segmentation** — deny by default
8. **Internal services tier (private subnet)** — database, cache, auth service

To the right of the stack, three vertical bars annotate cross-cutting concerns:

- "IDS/IPS sensors" — taps spanning every boundary
- "Encryption in transit" — TLS or mTLS labels at every hop
- "Logging and SIEM" — every component emits events

For each layer, a small badge shows the *attack class* it primarily addresses (e.g., "DDoS" on layer 2, "OWASP Top 10" on layer 4, "lateral movement" on layer 7).

Color: cybersecurity blue (#1565c0) for control layers, cream (#fff8e1) for data tiers, slate (#455a64) for boundaries, amber (#ffa000) accent for cross-cutting observability bars. Responsive: stacks horizontally on wide viewports, vertically below 900px. The diagram must respond to window resize events.

Implementation: Mermaid flowchart TD with subgraphs for each layer; the cross-cutting annotations are separate subgraphs aligned along the right margin.
</details>

## 11. What You Can Now Do

The chapter has covered twenty-five concepts and they tie together more tightly than the list suggests. You now have a vocabulary for the layered structure of the internet (OSI, TCP/IP), for the protocols at each layer (IP, TCP, UDP, ICMP) and the attacks that follow from their design, for the local-network attack family (ARP spoofing, DHCP rogue, sniffing, MITM), for the firewall taxonomy (stateful, NGFW, WAF), for detection (IDS, IPS, signature, anomaly), for segmentation (VLAN, DMZ), and for the tunneling layer (VPN, IPsec, WireGuard).

The patterns recur. *The protocols were not designed with authentication; we bolted it on.* *Every layer has its own attack class and its own defense.* *No single control is sufficient; defense in depth composes them.* *Encryption everywhere is the modern default, even inside the perimeter.* These are the habits of mind that the next chapter, **Advanced Network Defense and Architecture**, builds on as we move into wireless security, DNS and BGP defenses, DDoS mitigation, and Zero Trust architecture in depth.

!!! mascot-celebration "What You Can Now Reason About"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sentinel celebrating">
    You can now read a network diagram and name what each control defends — and, just as importantly, what each control does not. You can trace a packet from the wire to the application and name where confidentiality, integrity, and authentication are provided (or are missing). That is the foundation we will build the rest of the connection-security chapters on.
