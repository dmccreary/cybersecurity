# Cybersecurity Textbook — Project Instructions

## Learning Mascot: Sentinel the Fox — Full Style Guide

This is the canonical style guide for Sentinel the Fox. **When generating any chapter text, glossary entry, FAQ, quiz, or other student-facing prose for this textbook, follow this guide so Sentinel's character is consistent across every page.** Source-of-truth visual references live in `docs/img/mascot/` (one PNG per pose); generation prompts live in `docs/img/mascot/image-prompts.md`.

### Character Bible

- **Name:** Sentinel (nickname "Sen")
- **Species:** Red fox
- **Subject:** Cybersecurity
- **Catchphrase:** *"Trust, but verify."*
- **Personality four-pack:** **vigilant, curious, principled, encouraging.** Every line of Sentinel dialogue should sound like at least two of these four traits at once. Vigilant + curious produces a pose that asks "what could go wrong here?" without panic. Principled + encouraging produces "this is the defensible way to do it, and you can get there."
- **Worldview:** Security is **defensible engineering**, not folklore or theater. Sentinel believes in adversarial thinking, systems thinking, defense in depth, least privilege, and that the human in the loop deserves usable controls.
- **Audience-relationship:** Sentinel respects the reader as a capable engineer-in-training. He never talks down, never moralizes, and never uses fear as a teaching tool.

### Visual Identity (must remain consistent across all images)

- Warm **rust-orange (`#d84315`)** fur with **cream (`#fff8e1`)** belly, throat, and tail tip
- **Black** "socks" on legs and **black-tipped** ears
- **Small round wire-rimmed slate-steel glasses** (subtle scholarly detail — never reflective, never tinted)
- **Cybersecurity-blue (`#1565c0`) shield emblem** on chest with a thin **slate-steel (`#455a64`)** border. The shield is a chest emblem only — never held in the paws.
- **Both paws are always free and expressive.** No clipboards, badges, swords, laptops, or any held objects in any pose. The paws perform gestures (wave, point, thumbs-up, "stop," chin-rest, victory-up).
- Friendly closed-mouth smile by default; open-mouth smile for welcome and celebration; concerned-but-caring expression for warning.
- Compact, approachable proportions; head slightly larger relative to body for friendliness.
- Modern flat vector cartoon, clean bold lines, limited shading, **fully transparent background.**

### Color Palette (use these exact hex codes anywhere mascot styling is generated)

| Role | Hex | Use |
|------|-----|-----|
| Primary | `#1565c0` | Shield, accent strokes, callout borders |
| Secondary | `#455a64` | Shield border, glasses frames, neutral text accents |
| Alert accent | `#ffa000` | Sparkles in `tip` / `warning` only — used sparingly |
| Fur | `#d84315` | Body |
| Belly | `#fff8e1` | Belly, throat, tail tip |

### Voice & Speech Patterns

When you write dialogue or admonition body text in Sentinel's voice, follow these rules:

1. **Calm and watchful.** No alarms, no all-caps, no "!!!". Even warnings are delivered in a steady tone.
2. **Engineering framing, not folklore.** Replace "hackers will get you" with "this control fails open under condition X."
3. **Concrete adversarial framing.** Reach for *"How would an attacker abuse this?"*, *"What's the blast radius?"*, *"What does this control assume?"*, *"What happens at the trust boundary?"* — phrased as questions the reader is invited to ask alongside Sentinel.
4. **Normalize struggle on hard topics** (cryptography, threat modeling, incident analysis). When a topic is dense, name the difficulty: *"This part takes a few passes. That's normal."*
5. **Length:** 1–3 sentences per admonition body. Never longer than ~50 words. Sentinel is a guide, not a lecturer — the chapter prose does the heavy lifting.
6. **First person sparingly.** Sentinel can say "I" or "we" but should not narrate his own actions ("Let me show you…"). Default to second person ("notice that…", "ask yourself…").
7. **No fearmongering, no moralizing, no jokes at the reader's expense.** Self-deprecating humor about the difficulty of the field is fine; humor at the reader's expense is not.
8. **Signature phrases** (use sparingly — at most one per chapter so they stay meaningful):
   - *"Trust, but verify."*
   - *"Think like an attacker, build like a defender."*
   - *"Defense in depth."*
   - *"What's the blast radius?"*
   - *"Least privilege, by default."*
   - *"Assume breach. Plan recovery."*

### The Seven Poses — When to Use Each

Each pose maps to an MkDocs Material custom admonition class. The class names below are the source of truth.

| Pose file | Admonition class | When to use it | Voice cue |
|-----------|-----------------|----------------|-----------|
| `neutral.png` | `mascot-neutral` | General sidebar note that doesn't fit another pose | Even, observational. *"Notice that…"* |
| `welcome.png` | `mascot-welcome` | **Chapter opening, exactly once per chapter.** Always include the catchphrase or a chapter-specific framing question. | Warm, inviting. *"Welcome — in this chapter we'll…"* |
| `thinking.png` | `mascot-thinking` | A key insight, conceptual link, or "aha" moment. Use 2–3 times per chapter at the most load-bearing ideas. | Reflective. *"Here's what's actually going on…"* |
| `tip.png` | `mascot-tip` | A practical habit, mnemonic, or professional rule of thumb. | Helpful, knowing. *"In production, you'll usually…"* |
| `warning.png` | `mascot-warning` | A footgun, insecure-by-default pattern, or common misuse (ECB mode, hardcoded keys, `eval()`, missing IV randomness, mocked tests for security paths, etc.). | Concerned but caring, never alarmist. *"This pattern looks fine and isn't — here's why."* |
| `encouraging.png` | `mascot-encourage` | At a difficulty spike (RSA math, side-channel reasoning, crypto protocol analysis, threat modeling first time). Reassure without minimizing. | Steady, supportive. *"This takes a few passes. You'll have it."* |
| `celebration.png` | `mascot-celebration` | End of a major section or chapter wrap. Acknowledges what the reader can now do. | Proud, brief. *"You can now reason about X — that's the foundation for Y."* |

### Worked Examples — Sentinel Voice in Each Pose

These are reference templates. Adapt them; do not copy verbatim.

**Welcome (chapter opener):**

> *Welcome. In this chapter we'll trade the comfortable assumption that "the network is friendly" for a sharper instinct: every packet, every header, every protocol field is a place an adversary can lie. Trust, but verify.*

**Thinking (key insight):**

> *Notice the asymmetry: the defender must cover every path; the attacker only needs one. That's why "blast radius" matters more than "did the breach happen?"*

**Tip (practical habit):**

> *In production, prefer authenticated encryption (AES-GCM, ChaCha20-Poly1305) over plain AES-CBC plus a separate MAC. The composed version is a footgun; the AEAD primitive isn't.*

**Warning (footgun):**

> *ECB mode "looks like encryption" — same input, same output, no IV needed — and that's exactly why it leaks structure. If you can see the penguin in the encrypted penguin, your mode is wrong.*

**Encouraging (difficulty spike):**

> *RSA's math takes a few passes to settle. Run the small numeric example by hand once; the production library will then make sense as the same operations at scale.*

**Celebration (section end):**

> *You can now read a TLS handshake and name what each step is defending against. That's the foundation we'll build the PKI chapter on.*

**Neutral (general sidebar):**

> *The CSEC2017 Joint Task Force curriculum is the source the ABET CAC Cybersecurity Program Criteria reference. We'll touch all eight of its knowledge areas in the chapters ahead.*

### Admonition Syntax

Always place the mascot image in the admonition **body**, never in the title bar. The `class="mascot-admonition-img"` is required for CSS sizing.

```markdown
!!! mascot-welcome "Welcome to Cryptography"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    Welcome. In this chapter we'll learn the primitives — symmetric ciphers,
    hashes, and MACs — that every protocol from TLS to SSH composes from.
    Trust, but verify.
```

The `src` path is relative to the **rendered page URL**, not the source file. Path conventions:

| Page location | `src` prefix |
|--------------|--------------|
| `chapters/NN-slug/index.md` (rendered at `chapters/NN-slug/`) | `../../img/mascot/` |
| `chapters/NN-slug/section.md` | `../../img/mascot/` |
| `glossary.md` (rendered at root) | `img/mascot/` |
| `chapters/index.md` | `../img/mascot/` |

If a path looks wrong, count directories from the **rendered URL** out to `docs/`, not from the source `.md` file.

### Frequency & Placement Rules

| Context | Admonition type | Frequency per chapter |
|---------|-----------------|-----------------------|
| Chapter opening | `mascot-welcome` | **Exactly 1** (always) |
| Key concept / insight | `mascot-thinking` | 2–3 |
| Helpful tip / habit | `mascot-tip` | 0–1 |
| Footgun / insecure default | `mascot-warning` | 0–2 |
| Difficulty spike | `mascot-encourage` | 0–1 |
| Major section / chapter close | `mascot-celebration` | 0–1 (chapter close only) |
| General sidebar | `mascot-neutral` | 0–1 |

**Hard cap:** Sentinel appears **no more than 5–6 times per chapter total.** The mascot is a wayfinding signal, not decoration — overuse erases the signal.

**Spacing:** Never place two mascot admonitions back-to-back. Always have at least one section or several paragraphs of regular prose between them. If two admonitions naturally cluster, merge their content into one or drop the weaker of the two.

**Ordering within a chapter:** A typical strong chapter has this rhythm:

1. `mascot-welcome` (opening)
2. ... regular prose, headings, examples ...
3. `mascot-thinking` (at the first big conceptual leap)
4. ... regular prose ...
5. `mascot-warning` or `mascot-tip` (anchored to a specific footgun or habit)
6. ... regular prose ...
7. `mascot-thinking` (at the second big conceptual leap)
8. ... regular prose ...
9. `mascot-celebration` (chapter close, naming what the reader can now do)

### Cybersecurity-Specific Voice Triggers

When the surrounding prose covers any of the following, **strongly consider** the matching admonition and voice:

| Topic class | Reach for |
|-------------|-----------|
| Cryptographic misuse (ECB, hardcoded keys, missing IV randomness, weak hash for password, MAC-then-encrypt) | `mascot-warning` |
| Defensible-design principle (least privilege, defense in depth, fail-secure default) | `mascot-tip` with a signature phrase |
| Adversarial reframing of a feature ("here's how an attacker would use it") | `mascot-thinking` |
| First exposure to a hard topic (RSA math, side channels, formal protocol analysis) | `mascot-encourage` |
| Dense regulatory/compliance content (HIPAA, GDPR mappings) | `mascot-tip` to humanize, not `mascot-warning` |
| End of a foundational chapter (CIA triad, threat modeling, the PICERL lifecycle) | `mascot-celebration` naming the new capability |

### Do's and Don'ts (quick reference)

**Do:**

- Use Sentinel to open every chapter warmly, ideally tying the catchphrase to the chapter's specific material.
- Match the pose to the **actual** content type — a warning admonition without a real footgun erodes trust.
- Keep admonition bodies to 1–3 sentences and ≤50 words.
- Use `mascot-warning` for cryptographic and software-security footguns specifically (ECB, hardcoded keys, mock tests for security paths, missing input validation at trust boundaries, etc.).
- Use `mascot-encourage` honestly — only at genuine difficulty spikes.

**Don't:**

- Use Sentinel more than 5–6 times per chapter.
- Place mascot admonitions back-to-back.
- Use the mascot for purely decorative purposes ("look how cute the fox is").
- Change Sentinel's species, name, age, gender, accessories (he wears glasses; he does not wear hats, hoodies, or capes), or color palette.
- Put any object in Sentinel's paws — they stay free for expressive gestures.
- Put the mascot image in the admonition title bar — always in the body, with `class="mascot-admonition-img"`.
- Use scare-quotes around "hackers," all-caps for emphasis, or exclamation points except inside the warning admonition's optional sparkle iconography.
- Have Sentinel narrate his own actions ("I'll show you…", "Let me explain…"). Use second-person reader address instead.

### When in doubt

If you're unsure whether a passage warrants a Sentinel admonition, the answer is almost always **no** — the mascot is rare on purpose. Save him for the moments where his presence makes the reader stop, look up, and remember. Everywhere else, write good plain prose and trust the reader.
