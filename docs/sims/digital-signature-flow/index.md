---
title: Digital Signature - Sign and Verify Flow
description: Interactive Mermaid workflow of digital signing and verification across a trust boundary, showing the role of the private key (signs) versus the public key (verifies).
image: /sims/digital-signature-flow/digital-signature-flow.png
og:image: /sims/digital-signature-flow/digital-signature-flow.png
twitter:image: /sims/digital-signature-flow/digital-signature-flow.png
social:
  cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# Digital Signature: Sign and Verify Flow

![Digital Signature Sign and Verify Flow](./digital-signature-flow.png)

<iframe src="main.html" width="100%" height="432" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/digital-signature-flow/main.html" height="432" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This diagram shows the two halves of a digital signature, separated by the
**trust boundary** between the signer's machine and the verifier's machine. On the
**signer** side, the message M is hashed with SHA-256 to a digest, and the digest
is signed with the signer's **private key** to produce signature S; the pair
(M, S) is then sent. On the **verifier** side, the received M is hashed again,
the **public key** is applied to S to recover the expected digest, and the two
digests are compared.

The comparison diamond is the heart of the idea: if the computed digest equals the
expected digest, the signature is valid — the message is intact and was signed by
the holder of the matching private key. If they differ, the message was tampered
with or signed with the wrong key, and it is rejected.

Hover over (or tap) any box to read what happens at that step. The right-hand
panel also calls out the key asymmetry — the private key signs and is held only by
the signer, while the public key verifies and can be held by anyone. The layout
stacks to a single column on narrow screens.

## Lesson Plan

**Learning objective (Bloom: Understand).** Students will explain the signing path
and the verification path of a digital signature, and distinguish the role of the
private key (signs) from the public key (verifies).

**Suggested classroom use.** Have students hover the signer column top-to-bottom,
then the verifier column, and articulate why both sides compute a SHA-256 digest.
Then pose a "what if": the attacker changes one character of M in transit — walk
the diagram to the rejection outcome.

**Discussion questions:**

1. Why does the signer hash the message before signing instead of signing the
   whole message directly?
2. The verifier never has the private key. How can it still confirm the signer's
   identity?
3. Trace what happens at the "Equal?" diamond if (a) the message is altered, or
   (b) an impostor signs with a different private key.

## References

- [Digital signature — Wikipedia](https://en.wikipedia.org/wiki/Digital_signature)
- [Public-key cryptography — Wikipedia](https://en.wikipedia.org/wiki/Public-key_cryptography)
- [SHA-2 — Wikipedia](https://en.wikipedia.org/wiki/SHA-2)
- [Cryptographic hash function — Wikipedia](https://en.wikipedia.org/wiki/Cryptographic_hash_function)

## Specification

The full specification below is extracted from
[Chapter 4: "Cryptography in Practice: PKI, TLS, and Data Protection"](../../chapters/04-crypto-in-practice/index.md).

```text
Type: workflow-diagram
sim-id: digital-signature-flow
Library: Mermaid
Status: Specified

Two parallel vertical flows separated by a trust boundary (signer's machine |
verifier's machine).

Left flow (Signer): Message M -> Hash (SHA-256) -> Digest H(M) -> Sign with
PRIVATE key -> Signature S -> Send (M, S).

Right flow (Verifier): Receive (M, S) splits into: hash M -> computed digest; and
verify S with PUBLIC key -> expected digest. Both digests feed a comparison
diamond "Equal?" with outputs "Valid signature" (green) or "Tampered or wrong key"
(red).

A small inset shows the asymmetry: PRIVATE key only the signer holds; PUBLIC key
anyone can hold.

Color: cybersecurity blue, slate steel, rust orange. Responsive: stacks vertically
below 800px viewport.

Implementation: Mermaid graph with two subgraphs and styled nodes.
```

## Related Resources

- [Chapter 4: "Cryptography in Practice: PKI, TLS, and Data Protection"](../../chapters/04-crypto-in-practice/index.md)
