# Generation Log: tls13-handshake-sequence

- **sim-id:** tls13-handshake-sequence
- **Library:** Mermaid (sequenceDiagram, rendered inline in main.html via Mermaid 11 ESM)
- **Chapter:** 4 — "Cryptography in Practice: PKI, TLS, and Data Protection"
- **Bloom level / verb:** Understand / trace
- **Learning objective:** Trace the TLS 1.3 handshake message by message, name what each
  step defends against, explain how ephemeral Diffie-Hellman yields forward secrecy, and
  identify where the connection transitions from plaintext to encrypted.

## Instructional-design decision + rationale

The spec is a `workflow-diagram` whose goal is comprehension of a fixed protocol sequence,
not parameter exploration. Per the Bloom→interaction mapping (Understand → step-through /
hover-reveal of concrete data, NOT continuous animation), this is implemented as a **static,
read-top-to-bottom sequence diagram** with explanatory notes anchored to each message. No
looping animation; the "interaction" is the reader walking the lifelines and pausing at each
amber note. A dashed "Versus TLS 1.2" panel below the diagram supplies the comparison inset
the spec calls for (two round trips, more options, more footguns) to motivate TLS 1.3's
secure-by-default minimalism.

## Implementation approach

- Mermaid `sequenceDiagram` with two participants (Client, Server), `autonumber`, and notes.
- Color-coding via `themeVariables`: blue actors (`#1565c0`), amber notes (`#fff3d6` /
  `#ffa000` border), slate signal text — matching the brand palette and the spec's
  plaintext/encrypted/application-data color intent. A legend key above the diagram names the
  three stages (plaintext, encrypted-with-handshake-keys, application-data AEAD).
- Notes carry the spec's required side annotations: ephemeral DH private keys kept secret,
  the ECDH shared-secret symmetry, the encryption transition, CertificateVerify's purpose,
  1-RTT completion, and forward secrecy.
- Dashed arrows (`-->>`) are used for the encrypted handshake-finish and Finished messages to
  visually distinguish them from the plaintext Hello messages; solid arrows for application
  data.
- A `tls13-handshake-sequence.js` file carries the `// CANVAS_HEIGHT:` comment (Mermaid has
  no JS sketch; the file exists so `fix-iframe-heights.py` can read the height) plus a
  resize handler.
- Schema meta tag and bare `<main></main>` present; no `id` on `<main>`.

## Validation score

- Before this finishing pass: not run (sim was left mid-pipeline by the interrupted run).
- After: **100 / A** (`validate-sims.py`).

## Layout review (Claude Vision)

- **Model:** Claude Opus 4.8 (1M context) — `claude-opus-4-8[1m]`.
- **First pass FAIL (6.3 aspect ratio / 1.1 bottom clip):** the inherited CANVAS_HEIGHT was
  760 (iframe 762). The full Mermaid sequence diagram auto-sizes taller than that — the
  Application Data messages, the forward-secrecy note, the bottom actor boxes, and the
  "Versus TLS 1.2" panel were all clipped below the fold.
- **Fix:** measured the true rendered height by capturing at 1050 then 1140px; set
  `// CANVAS_HEIGHT: 1090`, re-ran `fix-iframe-heights.py` (762 → 1092), manually updated the
  copy-paste example iframe block in index.md to 1092, and re-captured the screenshot at 1092.
- **Second pass:** CLEAN. All messages, notes, both pairs of actor boxes, and the comparison
  panel are fully visible with no edge clipping; text is high-contrast; title centered; the
  CertificateVerify note is contained within the 800px canvas width.

**Final state: clean.**
