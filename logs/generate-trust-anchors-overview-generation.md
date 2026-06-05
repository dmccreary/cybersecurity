# Generation Log — trust-anchors-overview

- **sim-id:** trust-anchors-overview
- **Library:** Static SVG (inline `<svg>` + small hover-tooltip script in a `.js`
  carrying the `CANVAS_HEIGHT` comment)
- **Bloom level / verb:** Understand / Identify
- **Learning objective:** Students can identify the four hardware trust anchors
  on a modern system, explain why a root of trust must be anchored in silicon
  rather than software, and compare the threat model of each anchor.
- **Chapter:** 7 — Component and Hardware Security

## Instructional-design decision

The spec is an `infographic-svg`, Bloom level Understand. Per the pipeline,
"interactive" here means hover/click reveals, not animation. I built a static
board diagram with rich per-anchor hover tooltips (HTML content via `innerHTML`
so each tooltip can show What / Examples / Threat-model on separate lines) plus
a legend table that compares all four anchors at once. There is no continuous
parameter to vary, so no sliders or animation — the learner controls pace by
hovering. This matches an Identify/Understand objective.

## Implementation approach

Replaced the "Not Yet Implemented" placeholder with a full inline SVG
(viewBox 0 0 900 470). Layout, left to right on a board:

- A **Hardware Root of Trust** badge at the top with an arrow labeled "Anchored
  in silicon, set at fabrication" pointing down into the package; a dashed line
  continues into the Secure Enclave / TEE region.
- **Main CPU Package** (slate border) containing **Application Cores** (blue,
  labeled the large untrusted surface), the **TEE Region** (amber dashed outline
  to signal "depends on microcode/firmware," with SGX/TDX, SEV, TrustZone), and
  the **Secure Enclave** coprocessor (blue, "runs only signed firmware,"
  SEP/Titan M/Knox).
- A **Discrete TPM** chip (slate) connected to the CPU by an "LPC / SPI bus"
  line.
- An **External HSM** 1U appliance off the board (with status LEDs), connected by
  a dashed "network / PCIe" link, FIPS 140-3 L3+ and tamper-responsive.
- A color-key strip and a 4-row legend table comparing each anchor's capability
  and threat model.

**Key behavior:** each anchor `<g class="anchor" data-tip="...HTML...">` shows a
floating, viewport-clamped tooltip on hover/tap; tooltips use `innerHTML` so the
threat-model lines render as formatted text. Tooltip hides on resize and on
mouse-leave. Responsive via `viewBox` + `max-width:900px`.

Brand palette honored exactly: blue `#1565c0` for trusted regions, amber
`#ffa000` outline on the TEE, slate `#455a64` for packaging/buses.

## Validation score

- **Before:** placeholder (not scored / would have failed schema, lesson plan,
  references, image, metadata).
- **After:** 100 (A). metadata.json rebuilt (creator Dan McCreary, subject
  cybersecurity, CC BY-NC-SA 4.0, `educational` + `pedagogical` blocks,
  completion_status validated); index.md rebuilt with social-preview frontmatter,
  screenshot embed, copy-paste iframe, About / Lesson Plan / References; schema
  meta tag and bare `<main>` present.

## Layout review (Claude Vision)

- **Model:** Claude Opus 4.8 (1M context) — the model running this agent.
- **Screenshot:** `docs/sims/trust-anchors-overview/trust-anchors-overview.png`
  at iframe height 692.

**Checklist walk:** 1.1 PASS (all labels complete, no clipping at edges or panel
borders), 1.3 PASS (flat fills), 1.4 PASS (contrast good; amber-on-cream TEE
text legible), 3.1 PASS (title centered, no collision), 3.2 PASS (draw order
correct — inner boxes on top of package), 3.3 PASS (TEE and Enclave fully inside
the CPU package; HSM off-board as specced), 4.x PASS (blue/amber/slate hierarchy
with explicit color key), 5.x N/A (no Mermaid/network/chart/map), 6.x PASS
(renders fully, aspect matches 692). Controls section N/A (static infographic).

**Residue (cosmetic, not fixed):** the "LPC / SPI bus" and "network / PCIe" bus
labels sit close to their connector lines and the dashed root-of-trust diagonal
passes near the bus region; everything remains legible. Judged not worth a
re-layout cycle.

**Final state: CLEAN.**
