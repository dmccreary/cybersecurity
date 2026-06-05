# Generation Log — x509-anatomy

- **sim-id:** x509-anatomy
- **Library:** Static SVG (inline `<svg>` + small hover-tooltip script in a `.js`
  carrying the `CANVAS_HEIGHT` comment)
- **Bloom level / verb:** Understand / Identify
- **Learning objective:** Students can identify the eight core fields of an
  X.509 v3 TLS server certificate, explain what each field is for and why a
  browser checks it, and distinguish the certificate's public key from the
  server's private key.
- **Chapter:** 4 — Cryptography in Practice: PKI, TLS, and Data Protection

## Instructional-design decision

The spec is an `infographic-svg`, Bloom level Understand. Per the pipeline,
"interactive" means hover/click reveals, not animation. I built a static
credential document with a rich per-field hover tooltip (HTML content via
`innerHTML` so each tooltip can bold the field name and give a plain-language
"what / why a browser checks it"). No sliders or animation — there is no
continuous parameter; the learner controls pace by hovering. This matches an
Identify/Understand objective and lets the diagram double as a reference card.

## Implementation approach

Replaced the "Not Yet Implemented" placeholder with a full inline SVG
(viewBox 0 0 760 600) styled like a physical credential:

- **Blue header band:** "X.509 Certificate — v3".
- **Eight hoverable fields**, each a `<g class="field" data-tip="...HTML...">`
  with a colored left-edge tag grouping them by category (blue = identity:
  Subject, SAN, Public Key; slate = provenance/lifecycle: Issuer, Validity,
  Serial; amber = usage constraints: Key Usage, EKU). Each row shows the field
  name and a realistic monospace value. Hovering a row highlights its background
  and shows the tooltip.
- **Slate footer band** with a rust-orange tag: the issuer's ECDSA signature
  "over all fields above," with a tooltip explaining tamper-evidence.
- **Key-icon callout:** a rust-orange arrow + key glyph links the Subject Public
  Key row to a "Server's private key" box (kept on the server, never
  transmitted, not in this certificate), making the public/private split
  concrete — the spec's required graphic.

**Key behavior:** floating, viewport-clamped tooltip on hover/tap; `innerHTML`
content so tooltips render formatted text; hides on resize and mouse-leave.
Responsive via `viewBox` + `max-width:760px`.

Brand palette honored: blue `#1565c0` header/identity, slate `#455a64` footer/
provenance, amber `#ffa000` usage tags, rust `#d84315` signature accent + key.

## Validation score

- **Before:** placeholder (would have failed schema, lesson plan, references,
  image, metadata).
- **After:** 100 (A). metadata.json rebuilt (creator Dan McCreary, subject
  cybersecurity, CC BY-NC-SA 4.0, `educational` + `pedagogical` blocks,
  completion_status validated); index.md rebuilt with social-preview frontmatter,
  screenshot embed, copy-paste iframe, About / Lesson Plan / References; schema
  meta tag and bare `<main>` present.

## Layout review (Claude Vision)

- **Model:** Claude Opus 4.8 (1M context) — the model running this agent.
- **Screenshot:** `docs/sims/x509-anatomy/x509-anatomy.png` at iframe height 687.

**Checklist walk:** 1.1 PASS (all field labels and monospace values complete,
well inside the frame; callout text contained), 1.3 PASS (flat fills), 1.4 PASS
(header colors on light rows, white-on-slate footer, rust-on-cream callout all
legible), 3.1 PASS (title centered), 3.2 PASS (draw order correct: rounded frame
+ header/footer band overlays render cleanly, alternating row stripes visible),
3.3 PASS (private-key callout text inside its box), 4.x PASS (color-coded
category tags drive the eye; rust key icon clearly links public-key row to
private-key callout), 5.x N/A (no Mermaid/network/chart/map), 6.x PASS (full
render, aspect matches 687). Controls section N/A (static infographic).

**FAILs found:** none.

**Final state: CLEAN** on the first pass — no source patches needed.
