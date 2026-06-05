---
title: Block Cipher Modes Comparison
description: A hover-annotated 2x2 SVG infographic comparing the ECB, CBC, CTR, and GCM block cipher modes of operation.
image: /sims/block-cipher-modes-compare/block-cipher-modes-compare.png
og:image: /sims/block-cipher-modes-compare/block-cipher-modes-compare.png
twitter:image: /sims/block-cipher-modes-compare/block-cipher-modes-compare.png
social:
   cards: false
status: review
library: Static SVG with hover tooltips
bloom_level: Understand
---

# Block Cipher Modes Comparison

![Block Cipher Modes Comparison](./block-cipher-modes-compare.png)

<iframe src="main.html" width="100%" height="762" scrolling="no"></iframe>

[Run the Block Cipher Modes Comparison Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/block-cipher-modes-compare/main.html" height="760" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This infographic places four AES *modes of operation* side by side in a 2×2 grid
so students can compare how each one turns plaintext blocks into ciphertext. Each
tile draws the data flow with plaintext blocks, AES-Encrypt boxes, XOR nodes, and
ciphertext blocks. Hovering (or tapping) any element reveals a short tooltip
explaining its role, so the diagram doubles as a guided reference.

The tile borders encode the security recommendation: **ECB** is outlined amber as
a *warning* because identical plaintext blocks produce identical ciphertext (its
two repeated blocks are drawn in red so the leak is obvious); **CBC** and **CTR**
are neutral slate (acceptable when their IV/nonce rules are honored); and **GCM**
is outlined green because it is the modern recommended default — it provides
*authenticated encryption* (AEAD), emitting a 128-bit tag that detects tampering.
The captions summarize each mode's key property: ECB leaks patterns, CBC is
sequential, CTR is parallelizable, and GCM encrypts *and* authenticates.

## Lesson Plan

**Learning objective (Bloom — Understand):** Students can compare the data flow of
ECB, CBC, CTR, and GCM and explain why ECB leaks structure while GCM provides both
confidentiality and integrity.

**Suggested classroom use:** Project the grid and trace one block end-to-end in
each mode by hovering the AES and XOR elements. Start with ECB and show the
repeated red blocks, then contrast with CBC's chaining and CTR's keystream. End on
GCM as the default and connect the auth tag to a real tampering scenario.

**Discussion questions:**

1. ECB and CBC both use AES with the same key — so why does only ECB leak the
   structure of the plaintext?
2. CTR and GCM both depend on a *unique* nonce. What is the blast radius if a
   nonce is reused under the same key?
3. CBC encryption is sequential but CTR encryption is parallelizable. Which part
   of each mode forces, or removes, that ordering constraint?

## References

- [Block cipher mode of operation (Wikipedia)](https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation)
- [Galois/Counter Mode (Wikipedia)](https://en.wikipedia.org/wiki/Galois/Counter_Mode)
- [NIST SP 800-38A — Recommendation for Block Cipher Modes of Operation](https://csrc.nist.gov/pubs/sp/800/38/a/final)
- [NIST SP 800-38D — Galois/Counter Mode (GCM) and GMAC](https://csrc.nist.gov/pubs/sp/800/38/d/final)

## Specification

The full specification below is extracted from
[Chapter 3: "Cryptography Fundamentals: Symmetric Ciphers and Hashing"](../../chapters/03-crypto-fundamentals/index.md).

```text
Type: infographic-svg
**sim-id:** block-cipher-modes-compare<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A 2×2 grid of small mode diagrams:

**Top-left: ECB**
- 4 plaintext blocks (with two identical blocks shown in red to highlight pattern leakage)
- Each block fed independently into a "AES Encrypt" box with the same key
- 4 ciphertext blocks output, with the two corresponding ciphertext blocks ALSO identical (red)
- Caption: "Identical plaintext → identical ciphertext. Pattern leaks. AVOID."

**Top-right: CBC**
- 4 plaintext blocks
- An IV box at the start, XOR with first block before AES Encrypt
- Each ciphertext block is XOR'd into the next plaintext before encryption
- Caption: "Chained. IV must be unpredictable. Sequential."

**Bottom-left: CTR**
- IV / counter sequence (nonce, nonce+1, nonce+2, …)
- Each counter encrypted with AES under key, producing keystream blocks
- Plaintext XOR keystream → ciphertext
- Caption: "Parallelizable. Nonce must be unique. No padding needed."

**Bottom-right: GCM**
- Same CTR-mode structure as bottom-left
- Plus a parallel "GHASH" computation over ciphertext blocks
- Output: ciphertext + 128-bit authentication tag
- Caption: "AEAD: encrypts AND authenticates. Modern default."

Color: amber (#ffa000) outline on the ECB tile (warning), green (#4caf50) outline on the GCM tile (recommended), neutral slate on CBC and CTR.

Responsive: 2x2 grid collapses to vertical stack below 800px.

Implementation: Static SVG with `<title>` tooltips per mode.
```

## Related Resources

- [Chapter 3: "Cryptography Fundamentals: Symmetric Ciphers and Hashing"](../../chapters/03-crypto-fundamentals/index.md)
