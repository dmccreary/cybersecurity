---
title: TLS 1.3 Handshake
description: A Mermaid sequence diagram of the 1-RTT TLS 1.3 handshake, with notes explaining ephemeral Diffie-Hellman, the encryption transition, CertificateVerify, and forward secrecy.
image: /sims/tls13-handshake-sequence/tls13-handshake-sequence.png
og:image: /sims/tls13-handshake-sequence/tls13-handshake-sequence.png
twitter:image: /sims/tls13-handshake-sequence/tls13-handshake-sequence.png
social:
   cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# TLS 1.3 Handshake

![TLS 1.3 Handshake](./tls13-handshake-sequence.png)

<iframe src="main.html" width="100%" height="762" scrolling="no"></iframe>

[Run the TLS 1.3 Handshake MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/tls13-handshake-sequence/main.html" height="762" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This sequence diagram walks the **TLS 1.3 handshake** from the first packet to a
secure, forward-secret connection — and TLS 1.3 reaches that state in a single
round trip (1-RTT). Read it top to bottom.

The **ClientHello** and **ServerHello** travel in the clear (slate) and each
carries an *ephemeral* Diffie-Hellman public key (the `key_share`). Once both
sides have exchanged public keys, each computes the *same* shared secret using
its own private key and the peer's public key — the note over both lifelines
shows the symmetry `ECDH(client_pub, server_priv) = ECDH(server_pub,
client_priv)`. From that point the handshake keys exist and **everything below is
encrypted** (blue): the server's certificate, its **CertificateVerify** (a
signature over the handshake transcript that proves the server holds the certified
private key), and the Finished messages.

After the handshake, **application data** flows in rust orange, protected by an
AEAD cipher (AES-GCM or ChaCha20-Poly1305). The closing note states the property
that makes ephemeral DH worth the effort: **forward secrecy** — the ephemeral keys
are discarded, so stealing the server's long-term key *later* cannot decrypt a
recorded past session. A dashed panel summarizes how TLS 1.2 differed (two round
trips, more options, more footguns) to motivate why TLS 1.3's smaller, opinionated
design is more secure by default.

## Lesson Plan

**Learning objective (Bloom — Understand):** Students can trace the TLS 1.3
handshake message by message, name what each step defends against, explain how
ephemeral DH yields forward secrecy, and identify where traffic becomes encrypted.

**Suggested classroom use:** Project the diagram and read it as a story, pausing at
each amber note to ask "what would break if this step were missing?" Use the
ServerHello note to connect back to the Diffie-Hellman MicroSim, and the
CertificateVerify note to connect to the PKI / certificate-chain material.

**Discussion questions:**

1. What exactly does CertificateVerify prove that simply *sending* the certificate
   does not?
2. An attacker records the whole session and a year later steals the server's
   long-term private key. Can they decrypt the recording? Justify your answer.
3. TLS 1.3 removed static-RSA key exchange. What property did that buy, and what
   convenience did it cost?

## References

- [Transport Layer Security — TLS 1.3 (Wikipedia)](https://en.wikipedia.org/wiki/Transport_Layer_Security#TLS_1.3)
- [Forward secrecy (Wikipedia)](https://en.wikipedia.org/wiki/Forward_secrecy)
- [RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3](https://www.rfc-editor.org/rfc/rfc8446)

## Specification

The full specification below is extracted from
[Chapter 4: "Cryptography in Practice: PKI, TLS, and Data Protection"](../../chapters/04-crypto-in-practice/index.md).

```text
Type: workflow-diagram
**sim-id:** tls13-handshake-sequence<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A vertical sequence diagram with two actors: **Client** (left) and **Server** (right). Time flows downward.

Messages, in order:

1. **Client → Server: ClientHello** — labeled "supported versions, cipher suites, ephemeral DH public key (key_share)"
2. **Server → Client: ServerHello** — "selected version + cipher, server's ephemeral DH public key"
3. **Server → Client: {EncryptedExtensions, Certificate, CertificateVerify, Finished}** — drawn in a colored box (cybersecurity blue #1565c0) labeled "Encrypted from this point — handshake keys derived"
4. **Client → Server: {Finished}** — also in the encrypted box
5. **Both directions: Application Data** — colored rust orange (#d84315), labeled "AEAD-encrypted (AES-GCM or ChaCha20-Poly1305)"

Side annotations on the right:

- Next to step 1: "Client's DH private key kept secret"
- Next to step 2: "Server's DH private key kept secret. Both sides now compute shared_secret = ECDH(client_pub, server_priv) = ECDH(server_pub, client_priv)"
- Next to step 3: "CertificateVerify: server signs handshake transcript with cert's private key. Proves cert holder."
- Next to step 5: "Forward secrecy: ephemeral DH keys discarded after handshake. Long-term key compromise does NOT decrypt past sessions."

A small inset shows TLS 1.2 (greyed out) for comparison: two round-trips, more messages, more options, more footguns.

Color: cybersecurity blue (encrypted), rust orange (application data), slate steel for plain text. Responsive: scales vertically; annotations move below messages on narrow screens.

Implementation: Mermaid sequenceDiagram with notes on the right.
```

## Related Resources

- [Chapter 4: "Cryptography in Practice: PKI, TLS, and Data Protection"](../../chapters/04-crypto-in-practice/index.md)
