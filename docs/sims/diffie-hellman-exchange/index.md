---
title: Diffie-Hellman Key Exchange
description: A sequence diagram of the Diffie-Hellman key exchange showing which values are public, which stay secret, and why an eavesdropper cannot recover the shared secret.
image: /sims/diffie-hellman-exchange/diffie-hellman-exchange.png
og:image: /sims/diffie-hellman-exchange/diffie-hellman-exchange.png
twitter:image: /sims/diffie-hellman-exchange/diffie-hellman-exchange.png
social:
  cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# Diffie-Hellman Key Exchange

![Diffie-Hellman Key Exchange](./diffie-hellman-exchange.png)

<iframe src="main.html" width="100%" height="902" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/diffie-hellman-exchange/main.html"
        width="100%" height="902" scrolling="no"></iframe>
```

## About this MicroSim

This sequence diagram walks through the Diffie-Hellman key exchange step by step.
Alice and Bob first agree on two public parameters — a large prime *p* and a
generator *g* — shown in the amber box above the diagram. Each party then
generates a private exponent (*a* for Alice, *b* for Bob) that never leaves their
machine; the diagram marks these "kept secret" in notes over each actor.

Alice sends `A = g^a mod p` across the wire, and Bob sends back `B = g^b mod p`.
The center lifeline is the network, where **Eve** sits and can read every value
that crosses it. Alice then computes `s = B^a mod p` and Bob computes
`s = A^b mod p`; both arrive at the *same* shared secret `s = g^(ab) mod p`. The
final note shows Eve's predicament: she has *p*, *g*, *A*, and *B*, yet she
cannot recover *s* without solving the discrete logarithm problem, which is
believed to be computationally infeasible for large *p*. That asymmetry — easy to
combine, hard to reverse — is the whole point of the protocol. The diagram scales
to its container width.

## Lesson Plan

**Learning objective (Bloom: Understand):** Students will explain why two parties
can establish a shared secret over a channel an eavesdropper fully observes.

**Suggested classroom use:** Run the small-number version by hand first (for
example *p* = 23, *g* = 5, *a* = 6, *b* = 15) so students see both sides reach
the same *s*. Then display this diagram and map each hand-computed value onto the
corresponding step, emphasizing which values were ever transmitted.

**Discussion questions:**

1. List everything Eve knows after watching the entire exchange. Why is it not
   enough to compute *s*?
2. Diffie-Hellman by itself does not authenticate Alice or Bob. What attack does
   that omission enable, and what is usually added to prevent it?
3. Why must *p* be large? What happens to the discrete-log difficulty if *p* is
   small?

## References

- [Wikipedia: Diffie-Hellman key exchange](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) — the protocol shown in this diagram.
- [Wikipedia: Discrete logarithm](https://en.wikipedia.org/wiki/Discrete_logarithm) — the hard problem that protects the shared secret.
- [Wikipedia: Man-in-the-middle attack](https://en.wikipedia.org/wiki/Man-in-the-middle_attack) — why unauthenticated DH is vulnerable.
- [RFC 7919: Negotiated Finite Field Diffie-Hellman Ephemeral Parameters](https://www.rfc-editor.org/rfc/rfc7919) — standardized DH groups used in practice.

## Specification

The full specification below is extracted from
[Chapter 3: "Cryptography Fundamentals: Symmetric Ciphers and Hashing"](../../chapters/03-crypto-fundamentals/index.md).

```text
Type: workflow-diagram
**sim-id:** diffie-hellman-exchange
**Library:** Mermaid

A sequence diagram with three actors: Alice (left), Network/Eve (center), Bob
(right). Public parameters p and g are shown in a box above. Alice and Bob each
generate a secret exponent (kept secret), exchange A = g^a mod p and B = g^b mod
p, then compute the same shared secret s = g^(ab) mod p. Eve observes A and B but
cannot derive s without solving the discrete log problem (shown with a "?").
Responsive sequence diagram via Mermaid.
```

## Related Resources

- [Chapter 3: "Cryptography Fundamentals: Symmetric Ciphers and Hashing"](../../chapters/03-crypto-fundamentals/index.md)
