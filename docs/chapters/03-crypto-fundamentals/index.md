---
title: "Cryptography Fundamentals: Symmetric Ciphers and Hashing"
description: "Builds the cryptographic foundation: plaintext, ciphertext, symmetric ciphers, block-cipher modes, key exchange, hashing, MACs, and HMAC."
generated_by: claude skill chapter-content-generator
date: 2026-04-25 10:32:00
version: 0.07
---

# Cryptography Fundamentals: Symmetric Ciphers and Hashing

## Summary

Builds the cryptographic foundation: plaintext/ciphertext, symmetric ciphers (AES, DES, 3DES), block-cipher modes and their pitfalls (ECB, CBC, CTR, GCM), stream ciphers, key exchange (Diffie-Hellman), and hash functions (SHA-2, SHA-3, collision and preimage resistance) with MACs and HMAC. Provides the primitives that Chapter 4 composes into protocols.

## Concepts Covered

This chapter covers the following 34 concepts from the learning graph:

1. Cryptography
2. Plaintext
3. Ciphertext
4. Encryption
5. Decryption
6. Cryptographic Key
7. Symmetric Cryptography
8. Block Cipher
9. Stream Cipher
10. AES
11. DES
12. 3DES
13. Block Cipher Modes
14. ECB Mode
15. CBC Mode
16. CTR Mode
17. GCM Mode
18. Initialization Vector
19. Padding Scheme
20. Asymmetric Cryptography
21. Public Key
22. Private Key
23. RSA
24. Elliptic Curve Cryptography
25. Diffie-Hellman
26. Key Exchange
27. Hash Function
28. SHA-2
29. SHA-3
30. MD5
31. Collision Resistance
32. Preimage Resistance
33. Message Authentication Code
34. HMAC

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Security Foundations: Properties, Mindset, and Risk](../01-security-foundations/index.md)

---

!!! mascot-welcome "Welcome to the Primitives"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    Welcome. Cryptography is the toolbox that the rest of the technical security stack composes from — TLS, signatures, password hashing, secure messaging, the lot. This chapter is the densest in the book, and it is the one that pays back the most. We will move from the simplest idea (turning a message into ciphertext) up through the mathematical primitives that protect the modern internet. Trust, but verify.

## 1. What Cryptography Is For

**Cryptography** is the mathematical study and engineering practice of techniques for secure communication and storage in the presence of adversaries. The discipline is much older than computing — it dates to antiquity, with substitution ciphers used by Caesar, mechanical rotor machines used in the World Wars, and the modern transition to mathematical hardness assumptions in the 1970s. What computing changed was the *scale*: cryptography now protects every web request, every payment, every messaging app, and almost every other digital interaction in your life.

Cryptography supports several of the security properties from Chapter 1, but it is not a magic solution to all of them. Used correctly, cryptography provides:

- **Confidentiality** — encryption hides the content of messages from those without the key.
- **Integrity** — keyed hashes (MACs) and digital signatures detect tampering.
- **Authentication** — signatures and key-exchange protocols prove identity.
- **Non-repudiation** — digital signatures bind an action to a specific key holder.

Cryptography does *not*, by itself, provide **availability** — encrypted services can still be denial-of-service attacked. It also does not protect data while it is being processed inside the application: once the application decrypts the data into memory to operate on it, the data is in plaintext for as long as the application has it. The most subtle failures of real-world cryptosystems usually happen at these joints — where ciphertext meets cleartext, where keys are stored, where protocols compose.

The chapter develops the primitives in two layers. The first layer is the *symmetric* world: one shared key encrypts and decrypts. The second layer is the *asymmetric* world: a key pair, with one half public and one half private, enables both encryption and signatures. Modern protocols compose both layers.

## 2. The Core Vocabulary

Every cryptographic discussion uses the same five words. **Plaintext** is the original, readable message — the data you are trying to protect. **Ciphertext** is the scrambled output of encryption; without the key, ciphertext should be indistinguishable from random data. **Encryption** is the process of transforming plaintext into ciphertext using a key, and **decryption** is the inverse operation that recovers the plaintext given the correct key. The **cryptographic key** is the secret parameter that controls both transformations. Anyone with the key can encrypt or decrypt; anyone without the key cannot — at least, not in any time scale that matters.

A core principle, articulated by Auguste Kerckhoffs in 1883 and now universally accepted, is that **the security of a cryptosystem must depend only on the secrecy of the key, not on the secrecy of the algorithm**. This is the *open design* principle from Chapter 1, applied to cryptography. Modern cryptographic algorithms are public, peer-reviewed, and standardized exactly so that thousands of cryptographers can attempt to break them; the keys are what stay secret. Any vendor who tells you they have a "proprietary encryption algorithm" is selling something nobody serious has reviewed.

#### Diagram: Encryption and Decryption Flow

<details markdown="1">
<summary>Block diagram showing plaintext, encryption, ciphertext, and decryption with shared key</summary>
Type: workflow-diagram
**sim-id:** encryption-decryption-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A horizontal flow:

1. **Plaintext** (input box, white) — "The original message: 'Attack at dawn.'"
2. → arrow into **Encryption** (process box, cybersecurity blue #1565c0) — "Algorithm + Key"
3. → arrow into **Ciphertext** (intermediate box, slate steel #455a64) — "8a4f...d12b (looks random)"
4. → arrow into **Decryption** (process box, cybersecurity blue) — "Algorithm + same Key"
5. → arrow into **Plaintext** (output box, white) — "Recovered: 'Attack at dawn.'"

Above the encryption and decryption boxes, a small key icon connects both, labeled "Shared cryptographic key (kept secret)". The diagram emphasizes that the same key must be used in both directions for symmetric crypto.

A small inset to the right shows the Kerckhoffs principle: "Algorithm: PUBLIC. Key: SECRET."

Color: cybersecurity blue, white, slate steel. Responsive: stacks vertically below 700px viewport.

Implementation: Mermaid graph LR with custom node styling.
</details>

## 3. Symmetric Cryptography — One Shared Key

**Symmetric cryptography** uses the same key for encryption and decryption. Both parties to a conversation share the secret key in advance, and they use it to scramble and unscramble messages. Symmetric algorithms are fast — modern AES on commodity hardware encrypts gigabytes per second per CPU core — and they are the workhorse of bulk data protection.

The fundamental challenge of symmetric cryptography is *key distribution*: how do two parties agree on a shared secret over an untrusted network without an adversary intercepting it? For decades this was a hard logistical problem (couriers, code books). The breakthroughs that solved it in the 1970s — public-key cryptography and Diffie-Hellman key exchange — are covered later in this chapter.

Symmetric algorithms come in two structural families: **block ciphers**, which operate on fixed-size chunks of plaintext (typically 128 bits at a time), and **stream ciphers**, which produce a continuous stream of pseudo-random bits that is XORed against the plaintext one bit (or one byte) at a time. Block ciphers are more common in modern practice because they can be built into authenticated-encryption modes, but stream ciphers (like ChaCha20) remain important on hardware that lacks AES instructions or where extreme throughput is required.

### 3.1 Block Ciphers — AES, DES, and 3DES

The reigning block cipher of the modern era is the **Advanced Encryption Standard (AES)**, standardized by the U.S. National Institute of Standards and Technology in 2001 after a public, multi-year competition. AES has a 128-bit block size and supports three key sizes: 128 bits (AES-128), 192 bits (AES-192), and 256 bits (AES-256). For symmetric encryption today, AES is essentially the default — it is fast, well-studied, and has hardware acceleration on almost every modern CPU (Intel/AMD AES-NI, ARM crypto extensions).

AES did not arrive in a vacuum. Its predecessor, the **Data Encryption Standard (DES)**, was the U.S. federal standard from 1977 to 2002. DES has a 56-bit key, which was already controversial in the 1970s because of its small size and is now trivially brute-forceable — a modern GPU breaks DES in hours. **3DES** (Triple-DES) was a stop-gap that applies DES three times with different keys to extend the effective key length, but it is slow and has been deprecated by NIST as of 2023. You will still encounter DES and 3DES in legacy financial systems and in older protocols, but neither belongs in any new design.

| Cipher | Block size | Key size | Status (2026) |
|--------|-----------:|---------:|---------------|
| DES | 64 bits | 56 bits | Broken; do not use |
| 3DES | 64 bits | 112 / 168 bits effective | Deprecated; phase out |
| AES-128 | 128 bits | 128 bits | Current standard |
| AES-192 | 128 bits | 192 bits | Current standard |
| AES-256 | 128 bits | 256 bits | Preferred for long-lived data |

The choice between AES-128 and AES-256 is sometimes contentious. AES-128 is sufficient against any classical attacker for the foreseeable future. AES-256 has a larger margin against future attacks (including quantum-era Grover's-algorithm attacks, which we will revisit in the Emerging Topics chapter), at modest performance cost. Most modern guidance recommends AES-256 for new designs and long-lived data.

### 3.2 Stream Ciphers

A **stream cipher** generates a long pseudo-random keystream from the key (and a nonce — see below) and XORs that keystream against the plaintext. ChaCha20 is the modern stream cipher of choice; the older RC4 was widely deployed but has known biases that disqualify it from new use. A subtle and dangerous property of stream ciphers is that *reusing the same keystream against two different messages reveals the XOR of the two plaintexts*, which is often enough for an attacker to recover both. This is the same failure mode that broke the Soviet VENONA traffic in the 1940s — a reused one-time-pad key. Modern stream ciphers require a *nonce* (number used once) for every encryption, and reuse of the nonce-key pair is catastrophic.

!!! mascot-tip "The Symmetric-Cipher Default"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sentinel offering a tip">
    For symmetric encryption in any new system, the default should be AES-GCM with 256-bit keys, or ChaCha20-Poly1305 if you need software-only performance on hardware without AES instructions. Both are *authenticated* encryption — they protect both confidentiality and integrity in a single primitive. We will see why that matters in the next section.

## 4. Block Cipher Modes — Where Most Crypto Bugs Live

A block cipher by itself only encrypts a single 128-bit block. To encrypt a message longer than one block — i.e., almost every real message — you need a *mode of operation*: a scheme for chaining the cipher's individual block encryptions together. **Block cipher modes** are where most cryptographic mistakes in real-world systems occur, because the choice of mode dramatically affects security even when the underlying cipher is correct.

Three modes appear constantly in security writing — ECB, CBC, and CTR — plus one authenticated-encryption mode that absorbs and surpasses them: GCM. We will examine all four.

A second concept used by every mode except ECB is the **initialization vector** (IV) — a per-message starting value that randomizes the encryption so that encrypting the same plaintext twice produces different ciphertexts. The IV is not secret (it is typically transmitted alongside the ciphertext), but its *uniqueness or randomness properties* depend on the mode and are critical to security. We will see in each mode below what the IV requirement is.

A third concept used by block ciphers operating on messages whose length is not a multiple of the block size is a **padding scheme** — a deterministic way to extend the final block. The most common is PKCS#7 padding, which appends bytes whose value equals the number of padding bytes added. Padding sounds boring, but mishandling padding (specifically, distinguishing valid from invalid padding in error messages) created the famous *padding oracle* attacks against CBC mode in the 2010s.

### 4.1 ECB — The Mode That Looks Like Encryption But Isn't

**ECB (Electronic Codebook) mode** encrypts each plaintext block independently with the same key. ECB has no IV and no chaining. It is conceptually the simplest mode, and it is *almost always wrong*. The reason: identical plaintext blocks produce identical ciphertext blocks. If your plaintext has any repeating structure — a database row with a common header, a bitmap image with large solid-color regions, an HTTP response with predictable framing — that structure leaks straight through into the ciphertext. The famous "ECB penguin" image, where a cartoon penguin remains visible after ECB encryption, is the canonical demonstration.

ECB mode has essentially no legitimate use in modern systems. The only places it appears correctly are encrypting a single block of data smaller than the block size, where chaining cannot help. If you see ECB in a code review, treat it as a defect.

!!! mascot-warning "ECB Is The Most Common Crypto Footgun"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel showing caution">
    ECB looks like encryption, accepts the same arguments as encryption, and decrypts back to the original plaintext — and it leaks the structure of the message anyway. It is the single most common cryptographic misuse in real-world codebases. Whenever you see "AES" in a code review, your next question must be "in what mode?" If the answer is "ECB" or "the default," dig in.

### 4.2 CBC — Chained, But Fragile

**CBC (Cipher Block Chaining) mode** XORs each plaintext block with the *previous* ciphertext block before encryption, creating a chain. The first block is XORed with the IV, which must be unpredictable (typically random) for each message. CBC was the dominant mode for decades and is still found in many protocols (older TLS versions, IPsec, and most disk encryption schemes).

CBC's weaknesses are well-documented. Encryption is sequential and cannot be parallelized (decryption can be). CBC is malleable in the sense that an attacker who can flip bits in the ciphertext can predictably flip bits in the plaintext of the *next* block — useless for reading the message, but useful for tampering if no integrity check is layered on top. And CBC is vulnerable to *padding oracle attacks* whenever the receiver leaks information about whether padding decoded correctly. CBC is acceptable when paired with an explicit MAC (encrypt-then-MAC), but the discipline required to compose CBC + MAC correctly has been the source of so many bugs that the security community has largely moved on to authenticated-encryption modes like GCM.

### 4.3 CTR — Turning A Block Cipher Into A Stream Cipher

**CTR (Counter) mode** turns a block cipher into a stream cipher: encrypt a sequence of counter values (IV, IV+1, IV+2, …) under the key, and XOR the resulting keystream against the plaintext. CTR is parallelizable in both directions, requires no padding, and is conceptually clean. Its IV requirement is *uniqueness* — every (key, IV) pair must be unique across all encryptions; reusing a counter with the same key reveals the XOR of the messages, just like a stream cipher with a reused nonce. CTR is the foundation of GCM.

### 4.4 GCM — Authenticated Encryption Done Right

**GCM (Galois/Counter Mode)** combines CTR-mode encryption with an integrity check (a Galois-field MAC) in a single primitive. GCM produces ciphertext *and* an authentication tag; on decryption, the tag is verified before the plaintext is returned. If an attacker tampers with even one bit of the ciphertext, the tag verification fails and the decryption operation refuses to return any plaintext at all. This property — *authenticated encryption with associated data*, AEAD — is what modern cryptographic engineering has converged on. It eliminates the entire class of malleability and padding-oracle attacks.

GCM has one nasty footgun: nonce reuse is catastrophic. If the same key is used with the same nonce (12-byte IV) for two different messages, an attacker can recover the authentication key and forge messages at will. In practice, nonces are either random (with low collision probability if generated with a good RNG) or counter-based with strict bookkeeping. Many libraries handle this for you; some do not.

#### Diagram: Block Cipher Modes Comparison

<details markdown="1">
<summary>Side-by-side visual showing ECB, CBC, CTR, and GCM mode behavior</summary>
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
</details>

The hierarchy of modes for new designs is straightforward: prefer GCM (or its sibling ChaCha20-Poly1305) for almost everything, accept CBC + HMAC only when you must, accept CTR only when you have a separate integrity check, and treat ECB as a defect.

## 5. From Symmetric to Asymmetric — Why We Need Both

Symmetric cryptography is fast and well-understood, but it has the *key distribution problem*: the two parties must already share a secret before they can communicate securely. For two people who can meet in person, that is solvable; for two computers on the internet that have never communicated before, it is not. **Asymmetric cryptography** (also called *public-key cryptography*) was invented in the 1970s exactly to solve this.

Asymmetric cryptography uses a *key pair*: two mathematically related keys with a special property. The **public key** can be freely published — printed on a business card, posted on a website, embedded in a certificate — and used by anyone who wants to send you an encrypted message or verify your signature. The corresponding **private key** is kept secret by the owner and is used to decrypt messages encrypted to the public key, or to produce signatures that the public key can verify.

The mathematical magic is that the two keys are linked, but extracting the private key from the public key is computationally infeasible for large enough key sizes. Asymmetric algorithms are based on hardness assumptions like *integer factorization* (RSA) or the *elliptic curve discrete logarithm problem* (ECC). Breaking them either requires solving the underlying math problem, which we have no efficient classical algorithm for, or building a sufficiently large quantum computer, which would render them all broken at once (the Emerging Topics chapter returns to this).

Asymmetric crypto is much *slower* than symmetric — typically thousands of times slower for the same data — so in practice, asymmetric crypto is used to set up *symmetric* keys that then carry the actual conversation. This pattern is called *hybrid encryption*, and it is the structure of TLS, SSH, S/MIME, age, and almost every other modern secure-channel protocol.

### 5.1 RSA — The Original

**RSA**, named for its inventors Rivest, Shamir, and Adleman in 1977, is the oldest and most widely deployed asymmetric algorithm. RSA security rests on the difficulty of factoring the product of two large primes. Common RSA key sizes are 2048 bits (current minimum acceptable) and 3072 or 4096 bits (preferred for new designs). RSA can both encrypt and produce signatures, with different padding schemes for each use (RSA-OAEP for encryption, RSA-PSS for signatures).

RSA is showing its age. Its keys and signatures are large (a 2048-bit RSA signature is 256 bytes), it is slow compared to elliptic-curve alternatives, and it requires careful padding to avoid attacks. Modern designs prefer ECC where compatibility allows.

### 5.2 Elliptic Curve Cryptography

**Elliptic Curve Cryptography (ECC)** uses the algebraic structure of elliptic curves over finite fields to achieve the same asymmetric capabilities as RSA at much smaller key sizes. A 256-bit ECC key (specifically Curve25519 or P-256) provides security roughly equivalent to a 3072-bit RSA key. The smaller key and signature sizes matter for constrained environments — embedded devices, mobile, smart cards — and for performance.

ECC has its own footgun history (early curves with weak parameters, side-channel implementations) but the modern curves (Curve25519 for key exchange, Ed25519 for signatures, P-256/P-384 for FIPS-compliant systems) are well-understood and widely deployed.

### 5.3 Diffie-Hellman Key Exchange

**Diffie-Hellman (DH)**, published by Whitfield Diffie and Martin Hellman in 1976, was the first widely known public-key construction and remains foundational. DH is a **key exchange** protocol: two parties, each generating a private value, can produce a shared secret by exchanging public values, and an eavesdropper who sees both public values cannot derive the shared secret. The shared secret then becomes the symmetric key for the rest of the session.

The math, briefly: both parties agree on public parameters (a large prime *p* and a generator *g*). Alice picks a private value *a* and sends \( g^a \mod p \); Bob picks a private value *b* and sends \( g^b \mod p \). Each computes the shared secret \( g^{ab} \mod p \) using their own private value and the other party's public value. The eavesdropper has \( g^a \) and \( g^b \) but, without knowing *a* or *b*, cannot compute \( g^{ab} \) — this is the *Diffie-Hellman problem*, which is at least as hard as the discrete logarithm problem.

Modern DH is almost always implemented in the elliptic-curve variant, ECDHE (Elliptic Curve Diffie-Hellman Ephemeral), with fresh values for every session — that "ephemeral" property is what gives modern TLS its *forward secrecy* (Chapter 4 will revisit forward secrecy in detail).

#### Diagram: Diffie-Hellman Key Exchange

<details markdown="1">
<summary>Sequence diagram showing Alice and Bob deriving a shared secret over an untrusted channel</summary>
Type: workflow-diagram
**sim-id:** diffie-hellman-exchange<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A sequence diagram with three actors: Alice (left), Network/Eve (center), Bob (right).

Steps from top to bottom:

1. Both Alice and Bob: agree on public parameters (large prime p, generator g) — shown above the diagram in a box: "Public: p, g"
2. Alice generates secret `a` (locally, in a side note: "kept secret")
3. Bob generates secret `b` (locally, side note: "kept secret")
4. Alice → Bob: sends `A = g^a mod p`
5. Bob → Alice: sends `B = g^b mod p`
6. Alice computes `s = B^a mod p`
7. Bob computes `s = A^b mod p`
8. Both arrive at the same shared secret `s = g^(ab) mod p`

Eve (center, sees the wire) observes A and B but cannot derive `s` without solving the discrete log problem. Show Eve with a "?" thought bubble at the bottom.

Color: cybersecurity blue for Alice/Bob private states (kept secret), slate steel for the wire transmissions, red for Eve's "cannot recover" annotation. Responsive: simplifies to a vertical sequence below 600px viewport.

Implementation: Mermaid sequenceDiagram.
</details>

DH does not, by itself, authenticate either party — Alice does not know whether the *B* she received came from the real Bob or from an active man-in-the-middle. That is what digital signatures and certificate authorities are for, and Chapter 4 will tie those pieces together.

!!! mascot-thinking "Why The Internet Has Two Crypto Layers"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    Asymmetric cryptography is slow but solves key distribution. Symmetric cryptography is fast but cannot bootstrap. Real protocols — TLS, SSH, Signal — use asymmetric crypto for *one quick handshake* that establishes a symmetric session key, then switch to symmetric crypto for the bulk of the conversation. Two different tools, each used where it shines.

## 6. Hash Functions — Fingerprints For Data

A **hash function** maps an input of arbitrary size to a fixed-size output called a *digest* or *hash*. The hash function we care about for cryptography is a *cryptographic* hash function, which is required to satisfy three properties:

- **Preimage resistance** — given a hash value *h*, it is computationally infeasible to find any input *x* such that hash(*x*) = *h*. (You cannot reverse the hash.)
- **Second-preimage resistance** — given a specific input *x*, it is infeasible to find a *different* input *y* such that hash(*x*) = hash(*y*).
- **Collision resistance** — it is infeasible to find *any* two inputs *x* and *y* (where *x* ≠ *y*) such that hash(*x*) = hash(*y*).

Collision resistance is the strongest of the three and is the property that breaks first when a hash function is found to be weak.

The currently recommended cryptographic hash functions are the **SHA-2** family (SHA-256, SHA-384, SHA-512) and the **SHA-3** family (Keccak, standardized in 2015). Both are believed secure against all known attacks. SHA-256 is the most widely deployed and is the default choice for new systems.

The historical hash function **MD5**, designed in 1992, is broken in the strongest sense: practical collision attacks exist that can produce two different inputs with the same MD5 hash in minutes on a laptop. MD5 must not be used for any security-relevant purpose. It survives in some non-security contexts (file checksums where adversarial collisions are not a concern), but every modern security guideline forbids it for signatures, certificates, integrity checks, or password storage. SHA-1 is in a similar state — practical collisions were demonstrated in 2017 (the SHAttered attack), and it is being phased out everywhere.

| Hash function | Output size | Status (2026) |
|---------------|-----------:|---------------|
| MD5 | 128 bits | Broken; do not use for security |
| SHA-1 | 160 bits | Deprecated; collisions demonstrated |
| SHA-256 (SHA-2) | 256 bits | Recommended |
| SHA-512 (SHA-2) | 512 bits | Recommended |
| SHA3-256 (SHA-3) | 256 bits | Recommended (different design from SHA-2) |
| SHA3-512 (SHA-3) | 512 bits | Recommended |

Hash functions are everywhere in security: file integrity verification, password storage (with a password-specific KDF, see Chapter 4), blockchain, code signing, content-addressable storage, deduplication, and as the building block for keyed integrity (MACs). The two-line summary is *use SHA-256 or SHA-512, never MD5 or SHA-1*.

!!! mascot-encourage "Why The Math Is Less Scary Than It Looks"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Sentinel offering encouragement">
    Cryptography has a reputation for being math-heavy and forbidding. The truth is that as a practitioner you will rarely implement a primitive — you will *call* a primitive in a well-vetted library. What you actually need is a clear mental model of *what each primitive guarantees* and *how to compose them safely*. That is what this chapter is teaching, and it is well within reach.

## 7. Message Authentication Codes — Keyed Integrity

A hash function alone gives you integrity *checking* but not integrity *protection*: anyone who can modify the data can also recompute the hash. To detect deliberate tampering, you need a keyed function that only the sender and receiver can produce or verify. That function is called a **Message Authentication Code (MAC)**.

A MAC takes a key and a message and produces a short tag. The receiver, knowing the same key, can re-derive the tag from the received message and compare. If the tags match, the message is intact and was produced by someone who knew the key. If the tags do not match, the message has been tampered with or someone is forging.

The dominant MAC construction is **HMAC** (Hash-based MAC), standardized in RFC 2104. HMAC takes a hash function (typically SHA-256 today, written HMAC-SHA-256) and uses it twice with the key in a specific way that resists known attacks against simpler "hash the key with the message" constructions. HMAC is fast, well-understood, and ubiquitous — it underlies AWS request signing, JWT signing, IPsec, TLS (in older versions), and many other protocols.

The relationship between hashing, MACs, and authenticated encryption can be summarized as follows. Hashing detects accidental corruption. MACs detect deliberate tampering by an adversary who does not have the key. AEAD modes (like GCM) combine encryption with a MAC into a single primitive, so you get confidentiality and integrity together with one library call.

| Primitive | Confidentiality | Integrity | Key needed? |
|-----------|:---------------:|:---------:|:-----------:|
| Hash (SHA-256) | No | Detects accidents only | No |
| HMAC | No | Detects tampering | Yes |
| Symmetric encryption alone (e.g., CBC) | Yes | No (must add MAC) | Yes |
| Authenticated encryption (GCM, ChaCha20-Poly1305) | Yes | Yes | Yes |

The "must add MAC" line for raw symmetric encryption is exactly where many older systems get this wrong — they encrypt without authenticating, and an attacker who can flip bits in the ciphertext can produce predictable, undetected changes to the plaintext. For new designs, *prefer authenticated encryption*. If you must use unauthenticated encryption, *always* layer a MAC over the ciphertext (encrypt-then-MAC).

!!! mascot-warning "Encrypt-Then-MAC, Never The Other Way"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel showing caution">
    Three orderings are possible: MAC-then-encrypt, encrypt-and-MAC (in parallel), and encrypt-then-MAC. Only encrypt-then-MAC is provably secure as a generic composition — the other two have known failure modes. If you are not using AEAD and you find yourself composing a cipher with a MAC, the order matters more than most engineers realize. (This is one reason the field switched to AEAD.)

## 8. Putting The Primitives Together

To anchor the chapter, consider how the primitives compose in the simplest secure-channel protocol you can imagine. Two parties want to exchange messages with confidentiality and integrity, over an untrusted network, when they have no prior shared secret.

1. **Establish a shared secret** using ECDHE (elliptic-curve Diffie-Hellman ephemeral). Each party generates a fresh key pair, exchanges the public halves, and derives the same shared secret. The "ephemeral" part means new key pairs every session — this gives forward secrecy.
2. **Derive symmetric keys** from the shared secret using a Key Derivation Function (the KDF concept will be explored in Chapter 4). The KDF turns one shared secret into the multiple keys needed for encryption, MAC, and other purposes.
3. **Encrypt and authenticate messages** using AES-256-GCM (or ChaCha20-Poly1305), with a unique nonce for each message. Each message arrives at the receiver as ciphertext + tag; the receiver verifies the tag before processing.
4. **Authenticate identities** (still missing from the above!) using digital signatures over the ECDHE public values. Without this, an active man-in-the-middle can pretend to be the other party. Chapter 4 will add this layer with PKI.

What you have just read, with the missing identity layer added, is essentially a TLS 1.3 handshake. Every primitive in this chapter — symmetric cipher, block-cipher mode, IV, MAC, hash, public-key key exchange — is present, doing exactly the job we have just defined for it. The protocol is not magic; it is a careful composition of primitives, each chosen for a specific guarantee.

!!! mascot-thinking "The Real Skill Is Composition"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    Implementing a primitive correctly is hard but rare — most of us will use a library. Composing primitives correctly is the daily job of secure systems work, and most failures in the wild come from composition mistakes (CBC without a MAC, GCM with a reused nonce, RSA without proper padding). The next chapter is largely about safe composition.

!!! mascot-celebration "What You Can Now Do"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sentinel celebrating">
    You can now read a security-protocol description and recognize every primitive it uses. You know the difference between symmetric and asymmetric crypto, when each is appropriate, and how they compose in hybrid schemes. You know which block-cipher modes are safe and which are footguns, what an IV does, what a MAC adds, and why authenticated encryption is the modern default. Chapter 4 builds the next layer on top of this — signatures, PKI, TLS, and the data-protection patterns that turn primitives into real-world security.

## Key Takeaways

- **Cryptography provides confidentiality, integrity, authentication, and non-repudiation** — but not availability, and not protection of data while in use.
- **Symmetric crypto** (AES, ChaCha20) is fast and bulk-data-friendly; **asymmetric crypto** (RSA, ECC) solves key distribution at much higher cost. Real protocols use both.
- **Block-cipher modes matter at least as much as the cipher.** Use AEAD (GCM, ChaCha20-Poly1305) by default. Avoid ECB. Be cautious with CBC.
- **Initialization vectors and nonces** carry strict requirements — uniqueness for CTR/GCM, unpredictability for CBC. Reuse breaks the security promise.
- **Diffie-Hellman key exchange** lets two parties derive a shared secret over an untrusted network; the elliptic-curve variant ECDHE is the modern default.
- **Hash functions** (SHA-256, SHA-512, SHA-3) provide integrity fingerprints; collision and preimage resistance are the security properties to remember. MD5 and SHA-1 are broken — do not use them.
- **HMAC** turns a hash function into a keyed integrity check; **AEAD** combines encryption and integrity in one primitive.

Next chapter: putting these primitives to work — digital signatures, PKI, TLS, key management, password hashing, and the data-protection patterns of real-world systems.
