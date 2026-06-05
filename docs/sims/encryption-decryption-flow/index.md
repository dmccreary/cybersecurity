---
title: Symmetric Encryption and Decryption Flow
description: Interactive Mermaid workflow of symmetric encryption showing plaintext encrypted to ciphertext and back, with one shared secret key in both directions, plus a Kerckhoffs's-principle callout.
image: /sims/encryption-decryption-flow/encryption-decryption-flow.png
og:image: /sims/encryption-decryption-flow/encryption-decryption-flow.png
twitter:image: /sims/encryption-decryption-flow/encryption-decryption-flow.png
social:
  cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# Symmetric Encryption and Decryption Flow

![Symmetric Encryption and Decryption Flow](./encryption-decryption-flow.png)

<iframe src="main.html" width="100%" height="402" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/encryption-decryption-flow/main.html" height="402" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This diagram follows a message through symmetric encryption and back. The readable
**plaintext** ("Attack at dawn.") goes into the **encryption** box, which combines
it with a secret key to produce **ciphertext** that looks like random bytes. The
ciphertext then enters the **decryption** box, which uses the *same* key to recover
the original plaintext exactly.

The single amber **shared key** node feeds both the encryption and decryption boxes
with a "same key" arrow — that is the defining feature of symmetric cryptography
and the reason safely distributing that one key is the hard problem it leaves
behind. The right-hand panel also states **Kerckhoffs's principle**: the algorithm
is public and openly reviewed, while all of the security rests on keeping the key
secret.

Hover over (or tap) any box to read what happens at that step. The layout stacks to
a single column on narrow screens.

## Lesson Plan

**Learning objective (Bloom: Understand).** Students will explain how plaintext
becomes ciphertext and back using an algorithm plus a key, recognize that the same
secret key is used in both directions, and state Kerckhoffs's principle.

**Suggested classroom use.** Have students trace the flow left to right, then ask
them to find the one node that touches both the encryption and decryption boxes.
Use the Kerckhoffs callout to discuss why "security through obscurity" of the
algorithm is discouraged.

**Discussion questions:**

1. Why must the encryption box and the decryption box use the *same* key in
   symmetric cryptography? What problem does that create when two strangers want to
   communicate?
2. Kerckhoffs's principle says the algorithm should be assumed public. Why is a
   publicly reviewed algorithm considered *stronger*, not weaker?
3. The ciphertext "looks random." Why is "looks random" an important property, and
   what would it mean for security if patterns from the plaintext leaked through?

## References

- [Symmetric-key algorithm — Wikipedia](https://en.wikipedia.org/wiki/Symmetric-key_algorithm)
- [Kerckhoffs's principle — Wikipedia](https://en.wikipedia.org/wiki/Kerckhoffs%27s_principle)
- [Encryption — Wikipedia](https://en.wikipedia.org/wiki/Encryption)
- [Advanced Encryption Standard — Wikipedia](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)

## Specification

The full specification below is extracted from
[Chapter 3: "Cryptography Fundamentals: Symmetric Ciphers and Hashing"](../../chapters/03-crypto-fundamentals/index.md).

```text
Type: workflow-diagram
sim-id: encryption-decryption-flow
Library: Mermaid
Status: Specified

A horizontal flow:
1. Plaintext (input, white) - "The original message: 'Attack at dawn.'"
2. -> Encryption (process, blue) - "Algorithm + Key"
3. -> Ciphertext (intermediate, slate) - "8a4f...d12b (looks random)"
4. -> Decryption (process, blue) - "Algorithm + same Key"
5. -> Plaintext (output, white) - "Recovered: 'Attack at dawn.'"

Above the encryption and decryption boxes, a key icon connects both, labeled
"Shared cryptographic key (kept secret)". The diagram emphasizes that the same key
must be used in both directions for symmetric crypto.

A small inset shows Kerckhoffs's principle: "Algorithm: PUBLIC. Key: SECRET."

Color: cybersecurity blue, white, slate steel. Responsive: stacks vertically below
700px viewport.

Implementation: Mermaid graph LR with custom node styling.
```

## Related Resources

- [Chapter 3: "Cryptography Fundamentals: Symmetric Ciphers and Hashing"](../../chapters/03-crypto-fundamentals/index.md)
