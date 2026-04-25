# Cybersecurity Textbook — Project Instructions

## Learning Mascot: Sentinel the Fox

### Character Overview

- **Name:** Sentinel ("Sen")
- **Species:** Red fox
- **Personality:** Vigilant, curious, principled, encouraging
- **Catchphrase:** "Trust, but verify."
- **Visual:** Warm rust-orange red fox with cream belly, black ear tips and leg "socks", small round wire-rimmed slate-steel glasses, deep cybersecurity-blue shield emblem on chest. Both paws **always free** (no held objects) so gestures stay expressive.

### Voice Characteristics

- Calm, watchful, and respectful of the reader's intelligence — never condescending.
- Frames security as defensible *engineering*, not folklore. Avoids fearmongering.
- Reaches for adversarial-thinking and systems-thinking framings ("How would an attacker abuse this?", "What's the blast radius?").
- Normalizes struggle on hard topics (cryptography, threat modeling, incident analysis).
- Signature phrases: *"Trust, but verify."* / *"Think like an attacker, build like a defender."* / *"Defense in depth."* / *"What's the blast radius?"*

### Mascot Admonition Format

Always place the mascot image in the admonition body, never in the title bar:

    !!! mascot-welcome "Title Here"
        <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
        Body text goes here after the img tag.

The `src` path is relative to the rendered page URL. For a chapter page at `chapters/01-foundations/index.md`, use `../../img/mascot/`. For pages at deeper paths, count directories accordingly.

### Placement Rules

| Context | Admonition Type | Frequency |
|---------|----------------|-----------|
| General note / sidebar | `mascot-neutral` | As needed |
| Chapter opening | `mascot-welcome` | Every chapter |
| Key concept / insight | `mascot-thinking` | 2–3 per chapter |
| Helpful tip / habit | `mascot-tip` | As needed |
| Common mistake / footgun | `mascot-warning` | As needed |
| Difficult content | `mascot-encourage` | Where students may struggle |
| Section completion | `mascot-celebration` | End of major sections |

**Restraint:** Sentinel should appear **no more than 5–6 times per chapter total**. The mascot is a wayfinding signal, not decoration. Never place two mascot admonitions back-to-back.

### Do's and Don'ts

**Do:**

- Use Sentinel to introduce chapters warmly with the catchphrase.
- Match the pose/admonition type to the actual content type.
- Keep dialogue brief (1–3 sentences).
- Use `mascot-warning` for footguns, insecure-by-default patterns, and common cryptographic misuses (ECB mode, hardcoded keys, etc.).

**Don't:**

- Use Sentinel more than 5–6 times per chapter.
- Place mascot admonitions back-to-back.
- Use the mascot for purely decorative purposes.
- Change Sentinel's species, name, personality, or speech patterns.
- Put objects in Sentinel's paws (they stay free for expressive gestures).
- Put the mascot image in the admonition title bar — always in the body.
