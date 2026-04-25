# Cover Image Prompt — Cybersecurity Textbook

**Target output:** `docs/img/cover.png`
**Aspect ratio:** 1.91:1 (1910×1000 pixels)
**Mascot:** Sentinel the Fox (canonical poses live in `docs/img/mascot/`)

## Layout (column widths)

```
+----------+--------------------------------------+----------+
|          |                                      |          |
|  LEFT    |              CENTER                  |  RIGHT   |
|   20%    |               60%                    |   20%    |
|          |                                      |          |
| SENTINEL |   BOOK TITLE (white text overlay)    | MONTAGE  |
| THE FOX  |   semi-transparent dark slab         | DENSE    |
| full     |                                      |          |
| body,    |   surrounded by softer montage       |          |
| vertical |   (lower density toward center)      |          |
| centered |                                      |          |
|          |                                      |          |
+----------+--------------------------------------+----------+
```

- **Left 20%:** Sentinel the Fox, full-body welcome pose, vertically centered, blended into the gradient with a subtle shadow. Both paws free (no held objects). Rust-orange fur (#d84315), cream belly (#fff8e1), wire-rimmed slate-steel glasses, blue shield emblem (#1565c0) on chest.
- **Center 60%:** Title overlay area — keep this region cleaner with a semi-transparent dark slab so white title text reads cleanly.
- **Right 20%:** Higher density of cybersecurity montage elements that visually balance Sentinel on the left.

## Full Image Prompt (paste into ChatGPT / DALL-E / Midjourney)

```
Please generate a new cover image for the Cybersecurity textbook.
A wide landscape book cover (1.91:1 aspect ratio, 1910×1000 pixels) for the
intelligent textbook "Cybersecurity: Foundations, Practice, and Professional
Responsibility."

BACKGROUND: Deep cybersecurity-blue (#1565c0) to slate-steel (#455a64) gradient,
darkening from upper-left to lower-right. Subtle hex-grid pattern overlay at very
low opacity (~8%) to evoke a digital/network feel without crowding the composition.
Faint glowing connection lines (cool cyan, low opacity) trace from element to
element to suggest defense-in-depth and systems thinking.

LEFT 20% — MASCOT REGION:
A friendly cartoon red fox named Sentinel stands vertically centered in the
left-most 20% of the canvas, full body visible from head to paws, facing slightly
toward the center. Rust-orange (#d84315) fur, cream (#fff8e1) belly and throat,
black-tipped ears and black socks on legs. Small round wire-rimmed slate-steel
(#455a64) glasses. A cybersecurity-blue (#1565c0) shield emblem with a thin
slate-steel border sits on his chest. Both paws are free and expressive — one
gives a small welcome wave, the other rests at his side. Closed-mouth friendly
smile. Modern flat vector cartoon, clean bold lines, limited shading. No held
objects. Subtle drop shadow under his paws to anchor him in the scene. He is
softly blended into the gradient, not pasted on top.

CENTER 60% — TITLE OVERLAY REGION:
Reserved for white title text. A horizontal semi-transparent dark slab
(rounded corners, ~40% black) sits centered to host the title text. Keep this
region cleaner — only a few faint montage elements drift through at very low
opacity so the title reads crisply. Do not generate any text in the image.

RIGHT 20% — DENSE MONTAGE REGION:
A balanced, higher-density cluster of cybersecurity iconography, arranged like
floating panels with subtle drop shadows:
- A stylized closed padlock with a binary fingerprint pattern on its face
- A certificate icon with a checkmark badge (PKI/X.509)
- A hash chain — three small linked blocks with hex-character glyphs
- A firewall brick wall icon with a glowing shield in front
- A threat-model attack tree (root node branching to three child nodes)
- A small TPM/HSM chip icon with concentric trust rings
- A bug/vulnerability silhouette inside a magnifying glass
- A network packet icon with directional arrows
- A small CIA-triad triangle (three dots labeled by color, not text)
- A subtle "kill chain" of small directional arrows fading toward the edge

FILL ELEMENTS (distributed sparsely across upper and lower bands of the canvas,
NOT in the center title area):
- A few faint glowing nodes connected by thin lines (network defense)
- Small SOC-style telemetry sparklines (low opacity)
- Soft particle dots like ambient packets in flight

STYLE: Modern flat vector cartoon for the fox; clean iconographic flat-design
for all other elements with a slight glow on shields and locks. Warm
alert-amber (#ffa000) accents used sparingly on 2–3 elements for contrast
(e.g., a glowing lock highlight, a CVE/alert badge). Cool cyan (#00bcd4)
accents on the network/connection lines. Overall mood: professional,
defensible, watchful — not alarmist, not dystopian, not "hacker-coded-in-a-
hoodie." Educational and inviting, like a serious computing textbook cover.

COMPOSITION: Elements softly fade toward the edges of the canvas with a subtle
vignette. Center title slab is the visual anchor. Sentinel on the left and the
montage cluster on the right balance each other. No text anywhere in the image.

TECHNICAL: Professional quality, high resolution, sharp vector-style edges, no
photographic textures, no realistic skin/fur (Sentinel is cartoon, not
photorealistic), no text, no watermarks.
```

## Midjourney variant

If using Midjourney, append:

```
--ar 191:100 --style raw --v 6
```

## Notes

- The fox's color palette and accessories are fixed by the project mascot style
  guide (`CLAUDE.md`). Do not change his glasses, shield, or color values.
- Generators sometimes add text despite the "No text" instruction. If they do,
  re-roll or post-process to remove.
- Save final result as `docs/img/cover.png` at exactly **1200×630 px** (Open
  Graph standard) or **1910×1000 px** (1.91:1 high-res master).
