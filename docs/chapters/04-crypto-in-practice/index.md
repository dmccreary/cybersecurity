---
title: "Cryptography in Practice: PKI, TLS, and Data Protection"
description: "Composes primitives into real-world security: digital signatures, X.509 PKI, certificate authorities, revocation, key management, password hashing, TLS, and data-at-rest/in-transit/in-use protections."
generated_by: claude skill chapter-content-generator
date: 2026-04-25 11:21:00
version: 0.07
---

# Cryptography in Practice: PKI, TLS, and Data Protection

## Summary

Shows how primitives compose into real-world security: digital signatures, X.509 certificates, certificate authorities, revocation (CRL/OCSP), key management, password hashing (bcrypt, Argon2, salting), TLS and the TLS handshake with perfect forward secrecy, and data-at-rest/in-transit/in-use protections including homomorphic encryption, secure computation, differential privacy, and zero-knowledge proofs.

## Concepts Covered

This chapter covers the following 27 concepts from the learning graph:

1. Digital Signature
2. Certificate Authority
3. PKI
4. X.509 Certificate
5. Certificate Chain
6. Certificate Revocation
7. OCSP
8. Key Management
9. Key Rotation
10. Key Derivation Function
11. Password Hashing
12. Bcrypt
13. Argon2
14. Salting
15. TLS
16. TLS Handshake
17. HTTPS
18. Perfect Forward Secrecy
19. Data at Rest
20. Data in Transit
21. Data in Use
22. Database Encryption
23. Data Loss Prevention
24. Homomorphic Encryption
25. Secure Computation
26. Differential Privacy
27. Zero-Knowledge Proof

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Security Foundations: Properties, Mindset, and Risk](../01-security-foundations/index.md)
- [Chapter 3: Cryptography Fundamentals: Symmetric Ciphers and Hashing](../03-crypto-fundamentals/index.md)

---

!!! mascot-welcome "Welcome to Cryptography in Practice"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    Welcome. Chapter 3 gave you the primitives. This chapter shows how the world actually composes them — into the certificates that make HTTPS work, the password hashes that survive a database leak, and the privacy tools that let two parties compute on data neither will reveal. Trust, but verify — and notice where the trust is anchored.

## 1. From Primitives to Protocols

Cryptographic primitives are pieces. Real systems are *compositions*. A web browser visiting a banking site does not perform "AES" or "SHA-256" as standalone operations — it runs a protocol that uses both, plus public-key signatures, plus a chain of certificates, plus an entire global trust infrastructure, all woven together to give the user a small green padlock. Almost every cryptographic failure in production happens not because someone broke AES, but because someone composed the pieces wrong: trusted the wrong certificate, used the wrong mode, leaked a key, or skipped a verification step.

This chapter walks through the dominant compositions in the modern internet. We start with **digital signatures**, the asymmetric primitive that lets one party authenticate a message to anyone who has the corresponding public key. Signatures lead naturally into **certificates** and the **public key infrastructure (PKI)** that issues, manages, and revokes them. From there we look at **TLS**, the protocol every HTTPS connection runs, including its handshake and its modern guarantee of **perfect forward secrecy**. Then we cover **key management** — the operational discipline that determines whether all of the above works for years or fails in a week — and **password hashing**, the special-case crypto that protects credentials at rest. We close with the modern frontier: protecting data while it is *in use*, with **homomorphic encryption**, **secure multi-party computation**, **differential privacy**, and **zero-knowledge proofs**.

The unifying theme is the question Sentinel keeps asking: *where is the trust anchored, and what happens if that anchor moves?*

## 2. Digital Signatures — Asymmetric Authentication

A **digital signature** is a value computed by the holder of a private key over a message, such that anyone with the corresponding public key can verify two things: that the message has not been altered, and that whoever generated the signature held the private key at the time of signing. Signatures provide **integrity**, **authentication**, and (in many legal frameworks) **non-repudiation** — the signer cannot plausibly claim later that they did not sign.

Conceptually, a signature is the public-key analog of a MAC. Both prove a message came from someone with a secret. The crucial difference is that a MAC requires the verifier to share the secret key, so a MAC cannot prove origin to a third party (the verifier could have computed the MAC themselves). A digital signature uses a *private* key that only the signer possesses; the verifier uses the signer's *public* key, which everyone can hold without compromising the scheme. This asymmetry is what makes signatures usable for software updates, certificates, and legal documents.

In practice, signatures are not computed over the message directly. The signer first hashes the message with a cryptographic hash function (SHA-256, SHA-384, or similar — see Chapter 3), then signs the hash. This is *hash-then-sign*. The hash collapses an arbitrary-length message into a fixed-size digest, which the signing algorithm operates on. Verification reverses the process: the verifier hashes the received message, runs the public-key verification algorithm on the hash and the signature, and accepts or rejects.

The two dominant signature algorithms today are:

- **RSA signatures** (typically RSA-PSS or PKCS#1 v1.5), based on the difficulty of factoring large composite numbers. Common key sizes are 2048 bits (acceptable) and 3072 or 4096 bits (preferred for long-lived signatures).
- **ECDSA and EdDSA** (Ed25519, Ed448), based on elliptic-curve discrete logarithms. These produce smaller signatures and faster verification at equivalent security. Ed25519 is the modern default for new designs.

#### Diagram: Sign and Verify Flow

<details markdown="1">
<summary>Side-by-side flow diagram showing signature generation and verification</summary>
Type: workflow-diagram
**sim-id:** digital-signature-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

Two parallel vertical flows drawn left-to-right, separated by a vertical dashed line labeled "Trust boundary — signer's machine | verifier's machine".

**Left flow (Signer):**
1. Box: "Message M" (white)
2. Down arrow into "Hash function (SHA-256)" (cybersecurity blue #1565c0)
3. Down arrow into "Digest H(M)" (slate steel #455a64)
4. Down arrow into "Sign with PRIVATE key" (cybersecurity blue, with small lock icon)
5. Down arrow into "Signature S" (rust orange #d84315)
6. Box "Send (M, S)" connects to right flow with horizontal arrow.

**Right flow (Verifier):**
1. Box: "Receive (M, S)" (white)
2. Splits into two arrows:
   - Down to "Hash function (SHA-256)" → "Digest H(M)"
   - Down to "Verify with PUBLIC key" with input from S → "Expected digest"
3. Both digests feed into a comparison diamond "Equal?"
4. Two outputs: "Valid signature ✓" (green) or "Tampered or wrong key ✗" (red)

A small inset shows the asymmetry: "PRIVATE key — only signer holds. PUBLIC key — anyone can hold."

Color: cybersecurity blue, slate steel, rust orange. Responsive: stacks vertically below 800px viewport.

Implementation: Mermaid graph LR with two subgraphs and styled nodes.
</details>

### 2.1 What Signatures Don't Do

Signatures prove *who signed* and *what they signed*, but they do not, by themselves, prove *when* they signed or *that the public key really belongs to a specific named entity*. The "when" problem is solved by external timestamping services. The "who" problem — binding a public key to a real-world identity — is the problem that the rest of this chapter is about.

## 3. Certificates and the Public Key Infrastructure

If Alice wants to send a private message to Bob using public-key crypto, she needs Bob's public key. The hard part is not the math; the hard part is *being sure the key really is Bob's*. An attacker who can substitute their own key for Bob's mounts a classic **man-in-the-middle attack** — Alice encrypts to the attacker's key, the attacker decrypts and reads, then re-encrypts to Bob's real key and forwards. Both Alice and Bob see normal traffic. This is the key-distribution problem in its starkest form, and it is what certificates exist to solve.

A **digital certificate** is a signed statement that binds a public key to an identity. The signer is a trusted third party — a **certificate authority (CA)** — whose public key is already known to the verifier through some out-of-band mechanism (typically baked into the operating system or browser). When Alice receives Bob's certificate, she checks the CA's signature; if it verifies under a CA she trusts, and the certificate's contents identify Bob, she can use the embedded public key with confidence that it really is Bob's.

The collection of CAs, certificates, policies, software, and procedures that make this trust model work at internet scale is called the **public key infrastructure (PKI)**.

!!! mascot-thinking "Where The Trust Actually Lives"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel reflecting on a key insight">
    Notice the shift. Public-key crypto eliminated the need to share *secrets* in advance — but it replaced that problem with the need to share *trusted public keys* in advance. PKI does not remove the trust requirement. It moves the trust to a small set of CAs whose root keys ship with your operating system. The internet's confidentiality rests on those root keys.

### 3.1 X.509 — The Certificate Format

The dominant certificate format on the internet is **X.509**, originally specified by the ITU-T in 1988 and refined many times since. An X.509 certificate is a structured data record containing, at minimum:

- **Subject** — the identity the certificate is issued to (a domain name, a person, an organization).
- **Subject Public Key** — the public key being bound to that identity, plus the algorithm it uses (RSA, ECDSA, Ed25519, etc.).
- **Issuer** — the CA that signed the certificate.
- **Validity period** — the start and end dates during which the certificate is valid.
- **Serial number** — a unique identifier the issuer assigns to this certificate.
- **Extensions** — modern fields like Subject Alternative Name (SAN) for additional domain names, Key Usage flags, and Extended Key Usage (server auth, client auth, code signing, etc.).
- **Signature** — the CA's signature over all of the above.

In a TLS server certificate, the Subject's Common Name or — preferably — the Subject Alternative Name fields list the domain names the certificate is valid for. Modern browsers ignore the Common Name entirely and require SAN entries. A certificate for `bank.example.com` will not be accepted by a browser visiting `www.bank.example.com` unless `www.bank.example.com` is listed as a SAN.

#### Diagram: Anatomy of an X.509 Certificate

<details markdown="1">
<summary>Annotated visual breakdown of a sample X.509 certificate</summary>
Type: infographic-svg
**sim-id:** x509-anatomy<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A vertical document layout styled like a physical credential, with hover tooltips on each field explaining its meaning.

Header band (cybersecurity blue #1565c0, white text): "X.509 Certificate v3"

Body fields (each with hover tooltip):

1. **Subject:** CN=www.example.com, O=Example Corp, C=US
   - Tooltip: "Identity this certificate authenticates. Browsers match the URL hostname against this field."
2. **Subject Alternative Names:** DNS:www.example.com, DNS:example.com
   - Tooltip: "Additional hostnames the certificate covers. Modern browsers require this; CN alone is ignored."
3. **Subject Public Key:** ECDSA P-256 (compressed point shown)
   - Tooltip: "The public key being bound to the subject. The corresponding private key lives on the server."
4. **Issuer:** CN=Example Intermediate CA, O=Example Trust Services
   - Tooltip: "The CA that signed this certificate. Look up the issuer's certificate to verify the chain."
5. **Validity:** 2026-04-25 to 2027-04-25 (one year)
   - Tooltip: "Certificates expire. Short validity reduces the window during which a compromised certificate can be misused."
6. **Serial Number:** 0x4d3e:f2a1:88c0:1234
   - Tooltip: "Unique identifier within the issuer. Used in revocation lists to point at a specific certificate."
7. **Key Usage:** Digital Signature, Key Encipherment
   - Tooltip: "Restricts what the key may be used for. A TLS server certificate cannot be used as a code-signing certificate."
8. **Extended Key Usage:** TLS Server Authentication
   - Tooltip: "Further narrows the role. Browsers reject certificates without this EKU for HTTPS."

Footer band (slate steel #455a64, white text): "Issuer's signature: 30:45:02:21:00... (ECDSA over all fields above)"

A small key-icon graphic on the right side links the "Subject Public Key" field to a "Server's private key (kept on the server, never transmitted)" callout.

Color: cybersecurity blue, slate steel, white, with rust orange accent on the signature footer. Responsive: scales to viewport width; tooltips collapse to expand-on-tap on mobile.

Implementation: Static SVG with embedded CSS hover styles and accessible tooltips.
</details>

### 3.2 The Certificate Chain

A single CA signing every certificate on the internet would be operationally impossible and a single point of failure. PKI instead uses a **certificate chain**: a sequence of certificates leading from the end-entity (your server) up to a self-signed **root certificate** that the verifier trusts intrinsically.

A typical chain has three links:

1. **Root CA certificate** — self-signed, lives in the browser/OS trust store. Roots are kept offline in HSMs and used only to sign intermediates.
2. **Intermediate CA certificate** — signed by the root, used for day-to-day issuance. If an intermediate is compromised, only it must be revoked, not the root.
3. **End-entity certificate** — your server certificate, signed by an intermediate.

When a client connects, the server sends its end-entity certificate plus all intermediates needed to chain up to a known root. The client verifies each signature in turn: the end-entity certificate's signature with the intermediate's public key, the intermediate's signature with the root's public key. If the root is in the trust store and every intermediate signature checks out, the chain is trusted.

Browsers and operating systems ship with a list of root CAs they have audited. Common root programs are run by Mozilla, Microsoft, Apple, Google, and Oracle (for Java). Each program publishes inclusion criteria: audits, key-management practices, incident response. A CA that misbehaves badly enough — issues fraudulent certificates, fails an audit, or is breached — is removed from the root programs, and every certificate it has ever issued effectively becomes untrusted overnight. This has happened multiple times (DigiNotar in 2011, WoSign in 2016, Camerfirma in 2021).

| Link | Lifespan (typical) | Where stored | Compromise impact |
|------|-------------------:|--------------|-------------------|
| Root CA | 20+ years | Offline HSM | Catastrophic; removal from trust stores |
| Intermediate CA | 3–10 years | Online HSM | Severe; revocation cascades |
| End-entity (server) | 90 days – 1 year | Server filesystem / KMS | Localized; revoke and reissue |

#### Diagram: Certificate Chain of Trust

<details markdown="1">
<summary>Hierarchical diagram showing root CA, intermediate CA, and end-entity certificates with verification arrows</summary>
Type: diagram
**sim-id:** certificate-chain-of-trust<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A vertical hierarchy with three tiers:

**Top tier — Root CA**
- Single node: "Root CA: Example Trust Root" (cybersecurity blue #1565c0, gold border indicating trust anchor)
- Tag: "Self-signed. Lives in browser trust store. Offline HSM."

**Middle tier — Intermediates**
- Two sibling nodes: "Intermediate CA A" and "Intermediate CA B" (slate steel #455a64)
- Both connected upward to Root CA via arrows labeled "signs"

**Bottom tier — End-entity certificates**
- Three leaf nodes: "www.example.com", "api.example.com", "mail.example.com" (white with rust orange #d84315 border)
- Each connected upward to one of the intermediates via arrows labeled "signs"

A vertical "Verification path" callout on the right shows the reverse direction:
- "Browser receives www.example.com cert"
- "↑ verifies signature using Intermediate CA A public key"
- "↑ verifies signature using Root CA public key"
- "↑ Root CA in trust store? → trust established"

A small inset legend explains the colors: gold border = trust anchor, blue = CA cert, white = end entity.

Color: cybersecurity blue, slate steel, rust orange, gold accent. Responsive: stacks at narrow widths.

Implementation: Mermaid graph TB with subgraphs for each tier.
</details>

### 3.3 Certificate Revocation, CRLs, and OCSP

Certificates have an expiration date, but sometimes a certificate must be invalidated *before* it expires — because the private key was stolen, the company was sold, the domain changed hands, or the issuing CA decided the certificate was issued in error. This is **certificate revocation**, and it is the part of PKI that has historically worked least well.

The original revocation mechanism is the **Certificate Revocation List (CRL)** — a signed list, published periodically by the CA, of every certificate it has revoked but not yet expired. Clients are supposed to download the CRL and check the certificate's serial number against it before trusting the certificate. CRLs do not scale: a busy CA's CRL can be megabytes, every client must redownload it on every cycle, and a stale CRL means revoked certificates are accepted as valid.

The **Online Certificate Status Protocol (OCSP)** was introduced as a real-time alternative. The client (or its TLS library) sends the certificate's serial number to an OCSP responder run by the CA, which returns a small signed response: "good," "revoked," or "unknown." OCSP solves the bandwidth problem but creates a privacy problem (the CA learns which sites you visit) and an availability problem (if the OCSP responder is down, the client must either fail open — accepting potentially revoked certs — or fail closed, breaking browsing).

The modern compromise is **OCSP stapling**: the *server* periodically fetches a fresh OCSP response from the CA and "staples" it to the TLS handshake itself. The client gets a recent revocation status without having to query the CA, the CA does not learn who is browsing, and there is no extra round-trip. OCSP stapling is supported by every major web server and is what most production HTTPS deployments use.

A newer trend is to make revocation less necessary by issuing very short-lived certificates. Let's Encrypt issues 90-day certificates by default, and there are proposals for 6-day or even shorter validity. With short enough lifetimes, a compromised certificate naturally expires before any revocation infrastructure could matter — *certificate validity becomes its own revocation mechanism*.

!!! mascot-warning "The Soft-Fail Revocation Footgun"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel showing caution">
    Most browsers, when an OCSP query fails or times out, accept the certificate anyway — a behavior called "soft-fail." This means an attacker who can block OCSP traffic can use a revoked certificate undetected. Hard-fail is too brittle to deploy by default, which is why OCSP stapling and short-lived certificates have eclipsed traditional revocation. Assume online revocation checking is best-effort, not a security guarantee.

## 4. Key Management — The Operational Heart

Cryptography only works when the keys stay secret. **Key management** is the discipline of generating, storing, distributing, rotating, and destroying cryptographic keys throughout their lifecycle. It is also the part of cryptography that goes wrong most often in practice — not because the math fails, but because someone checked a key into a Git repository, left a private key world-readable on a server, or kept using the same key for ten years.

A complete key-management story addresses every stage of the key lifecycle:

- **Generation** — keys must come from a strong random source (a cryptographically secure RNG), not from a programmer's chosen password or a low-entropy seed.
- **Storage** — keys at rest should be encrypted under a master key held in a hardware security module (HSM), trusted platform module (TPM), or cloud key management service (KMS). Plaintext keys on disk are a footgun.
- **Distribution** — keys that must be shared (symmetric session keys, for example) should be distributed under an authenticated channel — never in email, never in chat, never alongside the data they protect.
- **Use** — applications should access keys through controlled interfaces with logging and rate-limiting, not pull plaintext keys into memory and hold them indefinitely.
- **Rotation** — keys should be rotated on a schedule (every 90 days, every year — depending on use) and immediately upon suspected compromise.
- **Destruction** — when a key is retired, the storage medium must be wiped or destroyed, and any data still encrypted under the old key must be re-encrypted or accepted as lost.

### 4.1 Key Rotation

**Key rotation** is the practice of replacing a cryptographic key with a new one on a regular schedule. Rotation limits the *blast radius* of an undetected key compromise: if you rotate every 90 days, an attacker who steals a key has at most 90 days of usable access, and at most 90 days of data is exposed if the compromise is later detected and the old key revoked.

Rotation works smoothly only when systems are designed for it. Certificates support rotation via short validity periods and automated reissuance (ACME, the protocol behind Let's Encrypt, is designed precisely for this). Symmetric encryption keys for data at rest are usually rotated using a *key encryption key* (KEK) wrapping a *data encryption key* (DEK): the DEK protects data and is rarely rotated; the KEK protects DEKs and rotates frequently. This decouples bulk re-encryption from key changes.

Hardcoded keys, keys stored in environment variables that nobody owns, and keys that no one remembers how to change are common rotation failures. The defensible question to ask of any system: *if this key is compromised today, what is the procedure to rotate it, and how long does it take?*

### 4.2 Key Derivation Functions

A **key derivation function (KDF)** is a function that takes some secret input — often a password or a long-term master key — and produces one or more keys suitable for cryptographic use. KDFs serve two purposes: they *stretch* low-entropy inputs (passwords) into high-entropy keys, and they *derive* multiple distinct keys from a single shared secret without weakening it.

In TLS, after the handshake produces a shared secret, a KDF (HKDF — HMAC-based KDF) derives separate keys for each direction of traffic, plus authentication keys, plus the IVs needed by GCM. In disk encryption, a KDF turns the user's passphrase into the key that unlocks the master key. In password storage, a *deliberately slow* KDF (next section) turns the user's password into a hash that is hard to brute-force.

The key KDF property is that a KDF is *deterministic but irreversible*: given the same input and same parameters, the output is identical, but knowing the output tells you nothing about the input that you could not learn by brute-force search.

## 5. Password Hashing — A Special Case

Passwords are the bane of cryptographic engineering. They are the most common authentication factor on earth, they are typically chosen by humans (which means low entropy and reuse across sites), and they must be stored in a way that survives a database breach. **Password hashing** is the application of a slow, salted, deliberately memory-hard KDF to make stolen password hashes economically infeasible to reverse.

The naive approach — store `SHA-256(password)` — is broken on every level. Plain SHA-256 is fast, so an attacker with a stolen database can compute billions of hashes per second on a GPU and try every common password against every hash. Hashes of identical passwords are identical, so an attacker can spot reused passwords across the database without breaking anything. **Salting** addresses both problems.

### 5.1 Salting

A **salt** is a random per-password value that is prepended (or appended) to the password before hashing, then stored alongside the hash in cleartext. Two users with the same password get different salts and therefore different hashes, defeating bulk attacks. The salt is not a secret; it just has to be unique. A 16-byte random salt per password is standard.

Salting alone is not enough, because GPUs are fast. A single GPU can try a billion SHA-256 hashes per second, salt or no salt. The fix is to use a hash function that is *deliberately* slow — **password hashing functions** like bcrypt and Argon2.

### 5.2 Bcrypt

**Bcrypt**, designed in 1999, is a password hashing function based on the Blowfish cipher's expensive key schedule. It has a *cost factor* — typically labeled `2^N` for some N — that controls how much work the hash takes. Doubling N doubles the time. A typical 2026 deployment uses a cost of 12 or higher, taking around 250 milliseconds per hash on a modern server. That is fast enough for a user to log in but slow enough that an attacker who steals the database cannot brute-force common passwords economically.

Bcrypt is mature, widely deployed, and supported by every web framework. It has one notable limitation: passwords longer than 72 bytes are silently truncated, which has caused interesting bugs in systems that paste API keys into a password field.

### 5.3 Argon2

**Argon2** is the winner of the 2015 Password Hashing Competition and is the modern recommendation for new systems. It is *memory-hard*: it requires a configurable amount of RAM (e.g., 64 MB) to compute, which defeats GPU and ASIC attackers because GPU memory is expensive and small per core. There are three Argon2 variants:

- **Argon2d** — maximum resistance to GPU attacks, but vulnerable to side-channel attacks. Use when side channels are not a concern (e.g., a backend behind firewalls).
- **Argon2i** — side-channel resistant, less memory-hard. Use in environments where timing attacks are a real risk.
- **Argon2id** — a hybrid; Argon2id is the recommendation for almost all new password hashing.

Argon2 has three parameters: time cost (iterations), memory cost (KB), and parallelism. Recommended starting parameters in 2026 are roughly 64 MB memory, 3 iterations, parallelism 4. Tune up as hardware improves.

| Function | Year | Slow knob | Memory-hard? | 2026 recommendation |
|----------|-----:|-----------|:------------:|---------------------|
| MD5 / SHA-256 (raw) | — | None | No | Never use for passwords |
| PBKDF2 | 2000 | Iterations | No | Acceptable; legacy/FIPS only |
| bcrypt | 1999 | Cost factor | No | Acceptable; widely deployed |
| scrypt | 2009 | Memory + iterations | Yes | Acceptable |
| **Argon2id** | 2015 | Memory + iterations + parallelism | Yes | **Preferred for new designs** |

!!! mascot-tip "The Password Storage Default"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sentinel offering a tip">
    For any new system: store passwords with Argon2id, with parameters tuned to take roughly 250ms per hash on your production hardware, with a unique 16-byte random salt per password. Never use plain SHA-256, MD5, or any unsalted hash. If your framework's default is bcrypt, that is fine — both Argon2id and bcrypt are defensible. Plain hashes are not.

#### Diagram: Password Hashing — Cracking Cost Comparison

<details markdown="1">
<summary>Interactive simulator showing how salt, slow hashing, and memory-hardness affect attacker cost</summary>
Type: microsim
**sim-id:** password-cracking-cost<br/>
**Library:** p5.js<br/>
**Status:** Specified

Learning objective (Bloom: Analyze): Students will analyze how each password-protection technique (no protection, salt, slow hash, memory-hard hash) changes the time and dollar cost an attacker faces when trying to crack a stolen database of 1 million passwords.

A canvas (default 800×500, responsive) shows a horizontal "attacker speed" axis and a vertical "passwords cracked over time" axis with logarithmic scale.

**Controls (p5 createSelect / createSlider / createCheckbox):**
- Dropdown: Hash function — SHA-256 (raw), SHA-256+salt, bcrypt cost 10, bcrypt cost 12, Argon2id (64MB, t=3)
- Slider: Attacker hardware — 1 CPU, 1 GPU, 100-GPU farm, ASIC cluster
- Slider: Database size — 10K, 100K, 1M, 10M users
- Checkbox: Show common-password rainbow attack

**Visual elements:**
- Animated bar showing "passwords cracked per second" (numerical readout in large font)
- Time-to-crack-1%, 10%, 50% of database displayed as labeled vertical lines on the time axis
- A small "$" cost estimator showing cloud-GPU dollars to crack 1% of the database
- Color: cybersecurity blue (#1565c0) for safe configurations, rust orange (#d84315) for unsafe, gold for warning thresholds

**Behavior:**
- On any control change, recompute and animate the bar and time-to-crack lines
- A "footgun callout" appears in red when the configuration is genuinely insecure (raw SHA-256, MD5, no salt)
- Tooltip on each hash function explains why it has the speed it does

In setup(), call updateCanvasSize() first; parent the canvas to `document.querySelector('main')`.

Implementation: p5.js with hard-coded benchmark numbers calibrated against published 2025 GPU benchmarks; numbers update every frame for a smooth feel.
</details>

## 6. TLS — How HTTPS Actually Works

**Transport Layer Security (TLS)** is the protocol that secures most internet traffic — the "S" in HTTPS, the encryption around SMTP and IMAP, the basis of HTTP/3 (QUIC) cryptography, and many VPN protocols. TLS is the compositional masterpiece of applied cryptography: it weaves together symmetric ciphers, asymmetric crypto, hashes, MACs, signatures, certificates, and a key-exchange protocol, all to give two endpoints a fast, authenticated, confidential channel over an arbitrarily hostile network.

TLS evolved through several generations. SSL 2.0 (1995) and SSL 3.0 (1996) are dead and broken. TLS 1.0 (1999) and TLS 1.1 (2006) are deprecated and should not be enabled. TLS 1.2 (2008) is widely deployed and acceptable. **TLS 1.3** (2018) is the modern standard and a substantial cleanup: it removed dozens of legacy options, mandated authenticated encryption (AEAD), and reduced the handshake from two round-trips to one. New TLS deployments should support 1.3 and 1.2 only.

### 6.1 The TLS Handshake

The **TLS handshake** is the negotiation that happens at the start of every TLS connection, before any application data flows. Its job is to:

1. Agree on which TLS version and which cryptographic suite to use.
2. Authenticate the server (and optionally the client) via certificates.
3. Establish a shared secret used to derive symmetric session keys.
4. Begin encrypted, authenticated communication.

In TLS 1.3, the handshake is one round-trip:

- **ClientHello** — the client sends supported TLS versions, supported cipher suites (e.g., `TLS_AES_256_GCM_SHA384`), and a *key share* — its public ephemeral Diffie-Hellman key for the key exchange.
- **ServerHello + Certificate + CertificateVerify + Finished** — the server picks the version and suite, sends its own ephemeral DH public key, sends its certificate chain, signs the handshake transcript with its certificate's private key (proving it holds the private key), and sends a Finished message authenticating the handshake.
- **Client Finished + Application Data** — the client verifies the certificate chain, verifies the server's signature, derives the session keys from the DH shared secret using HKDF, and immediately begins sending application data.

The protocol packs an impressive amount of cryptography into that exchange: an ephemeral key exchange (Elliptic Curve Diffie-Hellman in practice), a long-term signature for server authentication, a certificate chain verification, key derivation, transcript hashing for integrity, and a switch to AEAD encryption (AES-GCM or ChaCha20-Poly1305) for the application data.

#### Diagram: TLS 1.3 Handshake

<details markdown="1">
<summary>Sequence diagram showing client, server, and the messages exchanged during a TLS 1.3 handshake</summary>
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
</details>

### 6.2 HTTPS — TLS Plus HTTP

**HTTPS** is HTTP carried over a TLS connection. There is no HTTPS protocol distinct from HTTP — the "S" indicates that the underlying transport is TLS. When a browser requests `https://example.com`, it opens a TCP connection to port 443, runs a TLS handshake to establish an authenticated and encrypted channel, then sends ordinary HTTP requests inside that channel.

Modern HTTPS deployments add hardening on top of basic TLS:

- **HSTS (HTTP Strict Transport Security)** — a response header that instructs browsers to *only* connect to this site over HTTPS for a given duration, preventing protocol downgrade attacks.
- **HSTS preloading** — browsers ship with a list of domains that are HTTPS-only from the very first visit, eliminating the trust-on-first-use window.
- **Certificate Transparency (CT)** — an append-only log of every certificate issued by participating CAs, so domain owners and the public can detect mis-issuance.
- **Public Key Pinning (HPKP)** — historically allowed sites to pin a specific public key. Largely deprecated due to operational fragility; CT logs and short-lived certificates serve the same goal more safely.

### 6.3 Perfect Forward Secrecy

**Perfect forward secrecy (PFS)** is the property that *compromise of long-term keys does not compromise past session keys*. The mechanism that gives TLS PFS is the *ephemeral* Diffie-Hellman key exchange: the DH key pair used to derive the session secret is generated fresh for every connection and discarded immediately after the handshake. Even if an attacker later steals the server's certificate private key, they cannot use it to decrypt a previously recorded session — the ephemeral keys needed for that session are gone.

This matters more than it might first appear. State-level adversaries can record encrypted internet traffic in bulk and store it indefinitely, hoping to decrypt it later. Without PFS, a single future compromise of a server's long-term key would retroactively unlock everything that key ever protected. With PFS, every recorded session is independently sealed.

TLS 1.3 *requires* ephemeral Diffie-Hellman for every connection. TLS 1.2 supports it but also supports older RSA key transport that lacks PFS. Disabling RSA key transport in TLS 1.2 configurations is one of the simplest and most valuable hardening steps for an HTTPS server. The handshake is the part of TLS that makes every other property — confidentiality, integrity, authentication, forward secrecy — composable rather than something humans must arrange out of band.

## 7. Data States — At Rest, In Transit, In Use

A useful framing for protecting data is to think about what *state* the data is in. Different states need different controls, and many real-world breaches happen in states that the deployment forgot to protect.

- **Data at rest** — data sitting on a storage medium: disks, SSDs, backups, archives. Protected primarily by *encryption at rest*: full-disk encryption (LUKS, BitLocker, FileVault), database encryption, S3 server-side encryption, encrypted backups. The threat is physical theft, lost backup tapes, or an attacker who reaches the storage layer without authentication.
- **Data in transit** — data moving across a network. Protected primarily by *encryption in transit*: TLS for application traffic, VPNs for network-to-network links, IPsec for site-to-site connections, SSH for remote administration. The threat is network eavesdropping and man-in-the-middle.
- **Data in use** — data loaded into memory while an application is processing it. This is the hardest state to protect, because the application by definition needs to see plaintext to operate on it. Protections include *secure enclaves* (Intel SGX, AMD SEV, Apple Secure Enclave, AWS Nitro Enclaves) that isolate the working memory from the host OS, and the privacy-preserving computation techniques covered in section 8.

### 7.1 Database Encryption

**Database encryption** is encryption applied to data stored in a database, and it comes in several layers with different threat models. Choose by what you are defending against, not by what is easiest to enable.

- **Storage-level encryption (encryption at rest)** — the database files on disk are encrypted by the storage layer or by full-disk encryption. Protects against stolen disks. Does *not* protect against an attacker who compromises the running database server, because the database has the keys and reads plaintext rows.
- **Transparent Data Encryption (TDE)** — built into the database engine, which encrypts on write and decrypts on read using a key managed by the engine. Same threat model as storage-level encryption: it protects the files, not the running engine.
- **Column-level encryption** — specific sensitive columns (SSNs, credit card numbers, health record fields) are encrypted by the application before insert and decrypted after select, with keys managed in a KMS. The database itself never sees the plaintext for those columns. Protects against database compromise, at the cost of search and indexing complexity.
- **Client-side / end-to-end encryption** — only the user's device ever sees plaintext; the database stores ciphertext that the database operator cannot read. Hardest to deploy but strongest guarantee.

### 7.2 Data Loss Prevention

**Data loss prevention (DLP)** is the family of controls that tries to detect and block sensitive data leaving an organization through legitimate channels — email, USB drives, cloud uploads, web forms, chat. DLP systems pattern-match for sensitive data shapes (credit card numbers, SSNs, health record formats), watermark documents, classify data by sensitivity, and enforce policies (e.g., "documents tagged Confidential cannot be attached to outbound email").

DLP is sociotechnical, not purely cryptographic. It is most effective when combined with classification labels, encryption, and access controls. Pure pattern-matching DLP is easily bypassed by a determined insider — encrypting a file before exfiltrating it, using steganography, or simply photographing a screen — but DLP catches a meaningful fraction of accidental and casual leaks, which are far more common than determined exfiltration.

| Data state | Primary control | Common technique | Defeats |
|-----------|-----------------|------------------|---------|
| At rest | Encryption at rest | LUKS, BitLocker, TDE, KMS-wrapped DEKs | Physical theft, lost backups |
| In transit | Encryption in transit | TLS, IPsec, SSH, WireGuard | Network eavesdropping, MitM |
| In use | Memory isolation, privacy-preserving compute | Enclaves (SGX, SEV), MPC, FHE | Host OS compromise, untrusted server |
| Egress | Data loss prevention | Pattern matching, classification, watermarks | Accidental leaks, casual exfiltration |

## 8. Privacy-Preserving Computation — Crypto on Plaintext You Cannot See

For decades, the limit of cryptography was that *to compute on data, you had to decrypt it*. The frontier of modern cryptography is removing that limit. Four techniques — homomorphic encryption, secure multi-party computation, differential privacy, and zero-knowledge proofs — enable computation, analysis, and verification on data without exposing the data itself. They are increasingly practical and increasingly deployed.

!!! mascot-encourage "This Section Takes A Few Passes"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Sentinel offering encouragement">
    The four techniques in this section break the intuition that "to use data you must see it." That intuition has been right for the entire history of computing. It takes a few passes to internalize what each technique buys you and what it costs. Read once for the shape, again for the example, and a third time for what it does *not* do. You will have it.

### 8.1 Homomorphic Encryption

**Homomorphic encryption (HE)** is encryption that supports computation on ciphertext: a server can take encrypted inputs, perform operations on them, and return an encrypted result that — when decrypted by the client — equals the result of performing the same operations on the plaintext inputs. The server learns neither the inputs nor the outputs.

Mathematically, an encryption scheme is *homomorphic* with respect to an operation (say, addition) if there is a corresponding ciphertext operation that mirrors it:

\[
\text{Dec}(\text{Enc}(x) \oplus \text{Enc}(y)) = x + y
\]

There are three flavors of HE:

- **Partially homomorphic encryption (PHE)** — supports one operation (addition or multiplication, but not both). RSA is multiplicatively homomorphic; Paillier is additively homomorphic. PHE has been usable for decades for narrow applications.
- **Somewhat homomorphic encryption (SHE)** — supports a bounded number of additions and multiplications.
- **Fully homomorphic encryption (FHE)** — supports arbitrary computations on ciphertext. Conceived in theory in 1978; first realized in 2009 by Craig Gentry. Modern FHE schemes (BGV, BFV, CKKS, TFHE) are usable for real workloads — slow, but practical for things like privacy-preserving machine-learning inference, encrypted database queries, and confidential analytics.

The cost of FHE is performance: ciphertexts are large (kilobytes to megabytes per encrypted number), and operations are thousands to millions of times slower than plaintext. The active research front is making FHE fast enough for general-purpose use.

### 8.2 Secure Multi-Party Computation

**Secure (multi-party) computation (MPC)** is a family of protocols that allow several parties, each holding private inputs, to jointly compute a function over those inputs while revealing only the function's output. The classic motivating example is the *millionaires' problem*: two millionaires want to know which is richer without revealing their net worth. A secure two-party computation lets them compute the comparison without exposing the inputs.

MPC is built from primitives like *secret sharing* (splitting a secret into shares such that any threshold of shares can reconstruct it but fewer reveal nothing) and *garbled circuits* (a way for one party to encrypt a Boolean circuit so another can evaluate it without learning the inputs). Production MPC deployments include privacy-preserving advertising measurement, threshold signatures for cryptocurrency custody, and joint analytics across organizations that cannot legally share raw data (medical research consortia, antitrust-sensitive industry benchmarks).

MPC's cost is communication and round-trips between the parties. For low-latency networks and modest functions, modern MPC is practical.

### 8.3 Differential Privacy

**Differential privacy (DP)** is a mathematical definition of privacy that bounds *how much any one individual's data can affect the output of a query*. A randomized algorithm is differentially private if running it on two databases that differ in a single individual's record produces nearly indistinguishable outputs — formalized by a parameter \(\epsilon\) that quantifies the maximum information leakage.

Mathematically, a randomized mechanism \(M\) is \(\epsilon\)-differentially private if for any two neighboring datasets \(D\) and \(D'\) (differing in one record) and any output \(S\):

\[
\Pr[M(D) \in S] \leq e^{\epsilon} \cdot \Pr[M(D') \in S]
\]

In practice, DP is achieved by adding carefully calibrated random noise — typically Laplace or Gaussian — to query results. The tradeoff is a *privacy budget*: smaller \(\epsilon\) means more noise (better privacy, less utility); larger \(\epsilon\) means less noise (less privacy, more utility). Each query consumes some of the budget; once exhausted, no further queries on the dataset are allowed.

DP is the framework behind the U.S. Census Bureau's 2020 census release, Apple's iOS telemetry, Google's Chrome diagnostics, and an increasing share of academic research data releases. It is not a magic privacy fix — choosing the right \(\epsilon\) is hard, and a too-large \(\epsilon\) gives weak guarantees that look strong on paper.

### 8.4 Zero-Knowledge Proofs

A **zero-knowledge proof (ZKP)** is a cryptographic protocol in which a *prover* convinces a *verifier* that a statement is true *without revealing any information beyond the truth of the statement itself*. The prover demonstrates knowledge of a secret (a password, a key, a witness for some computational problem) without disclosing it, and the verifier learns only that the proof is valid.

The classic intuitive example is the "Ali Baba cave": a circular cave with a magic door at the back that only opens to a secret password. To prove she knows the password without revealing it, the prover enters one branch of the cave at random; the verifier (waiting outside) calls out which branch she should emerge from. If she really knows the password, she can always come out correctly; if she does not, she only succeeds half the time. After 20 rounds, the verifier is convinced to within one chance in a million, while learning nothing about the password.

Modern ZKPs come in two main families:

- **Interactive proofs** — multiple rounds of challenge and response (like the cave example).
- **Non-interactive proofs** — a single message that verifies on its own, made possible by techniques like the Fiat-Shamir transform. **zk-SNARKs** (Succinct Non-interactive ARguments of Knowledge) and **zk-STARKs** are the dominant practical schemes today.

ZKPs power privacy-preserving cryptocurrencies (Zcash uses zk-SNARKs to prove transaction validity without revealing sender, receiver, or amount), anonymous credentials, scalable blockchain rollups, and increasingly login systems where users prove they meet some criterion (age, residency, employment) without revealing the underlying document.

#### Diagram: Comparing Privacy-Preserving Computation Techniques

<details markdown="1">
<summary>Interactive infographic comparing FHE, MPC, DP, and ZKP across input visibility, output visibility, and use case</summary>
Type: infographic-svg
**sim-id:** privacy-tech-compare<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A 2x2 grid of cards, each describing one technique with the same six fields for direct comparison. Each card has a hover tooltip with a real-world deployment example.

Card structure (consistent across all four):

- **Header:** Technique name (cybersecurity blue #1565c0)
- **One-line definition**
- **Inputs visible to whom?**
- **Outputs visible to whom?**
- **Computational cost** (1–5 scale visualized as bars)
- **Maturity** (Research / Niche / Production)
- **Real-world example** (in tooltip)

Card 1 — Homomorphic Encryption (FHE)
- Definition: "Compute directly on ciphertext."
- Inputs visible to: client only
- Outputs visible to: client only
- Cost: 5/5
- Maturity: Niche → Production
- Example tooltip: "Privacy-preserving ML inference; Microsoft SEAL, OpenFHE."

Card 2 — Secure Multi-Party Computation (MPC)
- Definition: "Multiple parties compute jointly without sharing inputs."
- Inputs visible to: each party sees only their own
- Outputs visible to: all participating parties
- Cost: 3/5
- Maturity: Production
- Example tooltip: "Threshold signatures, joint medical research, ad measurement."

Card 3 — Differential Privacy (DP)
- Definition: "Add calibrated noise to bound any single record's influence."
- Inputs visible to: data curator
- Outputs visible to: anyone (with bounded leakage)
- Cost: 1/5
- Maturity: Production
- Example tooltip: "U.S. 2020 Census, Apple iOS telemetry, Google Chrome diagnostics."

Card 4 — Zero-Knowledge Proofs (ZKP)
- Definition: "Prove a statement is true without revealing why."
- Inputs visible to: prover only
- Outputs visible to: verifier (just true/false + proof)
- Cost: 4/5
- Maturity: Production (growing)
- Example tooltip: "Zcash transactions, anonymous credentials, blockchain rollups."

A footer band lists "When to reach for which": one short sentence per technique linking the technique to the question it answers.

Color: cybersecurity blue, slate steel for headers, rust orange and gold for cost-bar gradient. Responsive: cards stack vertically below 700px viewport.

Implementation: Static SVG with embedded CSS hover tooltips, accessible labels.
</details>

## 9. Putting It Together — A Day In The Life Of A Banking Session

Pulling the entire chapter together, consider what happens when you log in to your bank. You type `bank.example.com` in your browser. The browser does a DNS lookup, opens a TCP connection to port 443, and starts a TLS 1.3 handshake. It generates an ephemeral ECDH key pair, sends the public half in a ClientHello, and receives the server's ECDH public half plus the bank's certificate chain.

The browser walks the chain: end-entity certificate signed by an intermediate, intermediate signed by a root. The browser checks each signature with the next-up public key, validates each certificate's name and validity period, and confirms the root is in its trust store. It checks OCSP stapling for revocation. It verifies the server's signature over the handshake transcript, proving the server holds the private key for the certificate. Both sides derive session keys with HKDF from the ECDH shared secret, and the channel becomes AEAD-encrypted with AES-GCM.

The browser sends an HTTP POST to `/login`. You typed your password; the browser sent it inside the encrypted channel. The server receives the password, runs Argon2id with a per-user salt and stored parameters, compares the result to the hash in the user database, and either succeeds or fails. On success, it sets a session cookie marked Secure and HttpOnly, ensuring it travels only over HTTPS and is not accessible to JavaScript.

Inside the data center, the bank's database stores account balances column-encrypted with keys held in an HSM-backed KMS, behind transparent data encryption that protects the disk files, behind backups encrypted with a separate KEK. When the bank's analytics team runs queries, they hit a differential-privacy gateway that adds noise calibrated to a privacy budget per analyst, ensuring no single customer's balance can be reconstructed even by the bank's own staff. When the bank's research team partners with a peer institution to study fraud patterns across the industry, they use secure multi-party computation so neither side ever sees the other's raw transactions.

Every primitive in this chapter is participating in that one login. Every layer is a different defensible question — *what if the network is hostile? what if the database is stolen? what if the analyst is curious? what if the partner is adversarial?* — and a different cryptographic answer.

!!! mascot-celebration "What You Can Now Do"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sentinel celebrating progress">
    You can now read a TLS handshake and name what each step is defending against. You can audit a password storage scheme and call out a footgun before it ships. You can place data into the at-rest, in-transit, in-use frame and pick the right control for each. And you have the vocabulary to follow modern privacy-preserving computation as it moves from research labs into your stack. That is the foundation the rest of the book builds on.

## 10. Key Takeaways

- **Digital signatures** turn asymmetric crypto into authenticated, third-party-verifiable assertions — the basis of certificates, software updates, and non-repudiation.
- **PKI** binds public keys to identities through a hierarchy of certificate authorities, with X.509 as the universal certificate format and a chain of trust as the validation mechanism.
- **Certificate revocation** is real but imperfect; OCSP stapling and short-lived certificates are the modern best practices.
- **Key management** is the operational discipline that determines whether cryptography survives contact with reality. Generation, storage, distribution, rotation, and destruction all have to work.
- **Password hashing** is its own specialty: salt every password, use a slow memory-hard function (Argon2id preferred, bcrypt acceptable), and tune parameters as hardware improves.
- **TLS 1.3** authenticates the server with a certificate, establishes session keys with ephemeral Diffie-Hellman (giving perfect forward secrecy), and encrypts application data with AEAD — all in a single round-trip.
- **HTTPS** is HTTP over TLS plus operational hardening (HSTS, certificate transparency, OCSP stapling).
- **Data states** — at rest, in transit, in use — each demand different controls; database encryption has multiple layers with different threat models.
- **Privacy-preserving computation** — homomorphic encryption, secure multi-party computation, differential privacy, zero-knowledge proofs — extends cryptography from "protecting data" to "computing on data without seeing it."
- The recurring discipline is asking *where the trust is anchored*, *what the blast radius is*, and *what happens when the anchor moves*.
