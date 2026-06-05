---
title: MITM via ARP Spoofing
description: Mermaid sequence diagram of a man-in-the-middle attack via ARP cache poisoning, contrasting the normal flow, the attacker's forged ARP replies, the relayed flow, and the HTTPS defense.
image: /sims/mitm-arp-spoofing/mitm-arp-spoofing.png
og:image: /sims/mitm-arp-spoofing/mitm-arp-spoofing.png
twitter:image: /sims/mitm-arp-spoofing/mitm-arp-spoofing.png
social:
  cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# MITM via ARP Spoofing

![MITM via ARP Spoofing](./mitm-arp-spoofing.png)

<iframe src="main.html" width="100%" height="847" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/mitm-arp-spoofing/main.html" height="847" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This sequence diagram walks top to bottom through a classic **man-in-the-middle
(MITM) attack via ARP spoofing**, with four actors: the **Client**, the
**Attacker**, the **Gateway**, and the **Internet** beyond it. The autonumbered
messages and the phase notes let you read the attack as a story.

The first phase shows the **normal flow**: the client ARPs for the gateway's MAC
address, gets the real reply, and sends HTTP traffic that the gateway forwards. The
second phase, marked by an amber note, is where the **attack begins** — the attacker
sends *gratuitous* (unsolicited) ARP replies. Because ARP has no authentication,
both the client and the gateway accept them and update their caches to point at the
attacker's MAC. The third phase shows the **poisoned flow**: the client's traffic
now goes to the attacker, who reads or modifies it and relays it to the real
gateway, then relays the response back. The client never notices.

The amber callout below the diagram states the defense. With **HTTPS and proper
certificate validation**, the attacker can still see *that* the client is talking to
a server, but the payload is opaque ciphertext, and any certificate the attacker
substitutes fails validation — so the user sees a warning instead of a silent
compromise. Trust, but verify.

## Lesson Plan

**Learning objective (Bloom: Understand).** Students will describe how gratuitous
ARP replies poison the client and gateway caches, trace how the attacker ends up on
path, and explain why HTTPS with certificate validation defeats the impersonation.

**Suggested classroom use.** Walk the class through the diagram one numbered message
at a time, pausing at the "attack begins" note to ask what property of ARP makes the
forged replies succeed. Then connect the defense note to the TLS material from the
cryptography chapters.

**Discussion questions:**

1. ARP has no authentication. How do the forged replies in messages 6 and 7 exploit
   that, and why must the attacker poison *both* the client and the gateway?
2. After poisoning, the attacker can read and modify plaintext HTTP. What exactly
   changes when the client switches to HTTPS — what can the attacker still see?
3. What network-layer or switch-layer defenses (e.g., dynamic ARP inspection,
   static ARP entries) could detect or prevent this attack?

## References

- [ARP spoofing — Wikipedia](https://en.wikipedia.org/wiki/ARP_spoofing)
- [Address Resolution Protocol — Wikipedia](https://en.wikipedia.org/wiki/Address_Resolution_Protocol)
- [Man-in-the-middle attack — Wikipedia](https://en.wikipedia.org/wiki/Man-in-the-middle_attack)
- [Dynamic ARP inspection — Wikipedia](https://en.wikipedia.org/wiki/Dynamic_ARP_inspection)

## Specification

The full specification below is extracted from
[Chapter 8: "Network Security Foundations: Protocols, Firewalls, and Detection"](../../chapters/08-network-foundations/index.md).

```text
Type: workflow-diagram
sim-id: mitm-arp-spoofing
Library: Mermaid
Status: Specified

A sequence diagram with four actors: Client, Attacker, Gateway, Internet.

Phase 1 (normal flow): Client ARPs for the gateway, gets the real reply, sends an
HTTP request the gateway forwards to the internet.

Phase 2 (attack begins): the attacker sends gratuitous ARP replies.

Phase 3 (after ARP poisoning): forged ARP replies tell the client the gateway is at
the attacker's MAC and tell the gateway the client is at the attacker's MAC; the
client's HTTP request goes to the attacker, who relays it to the gateway and relays
the response back.

A callout states that HTTPS with proper certificate validation prevents the
attacker from impersonating the server — the relayed traffic is opaque ciphertext.

Color: cybersecurity blue client, slate gateway, fur orange attacker, amber
attack-begins separator. Responsive via Mermaid useMaxWidth.
```

## Related Resources

- [Chapter 8: "Network Security Foundations: Protocols, Firewalls, and Detection"](../../chapters/08-network-foundations/index.md)
