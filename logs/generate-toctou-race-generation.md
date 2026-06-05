# Generation Log: toctou-race

- **sim-id:** toctou-race
- **Library:** Mermaid (sequenceDiagram, rendered inline in main.html via Mermaid 11 ESM)
- **Chapter:** 5 — "Software Vulnerabilities and Secure Coding"
- **Bloom level / verb:** Understand / explain (inferred — spec had no Bloom field)
- **Learning objective:** Explain how the interval between a check (T1) and a use (T2) creates
  an exploitable race; trace a symlink-swap TOCTOU attack against a privileged process; and
  identify the structural fix that eliminates the window.

## Instructional-design decision + rationale

Spec type is `workflow-diagram`; the goal is comprehension of a fixed attack sequence, so per
the Bloom→interaction mapping this is a static, read-top-to-bottom Mermaid sequence diagram —
no animation. The pedagogical crux is the *window* between check and use, which a sequence
diagram makes spatial and obvious: the attacker's two calls literally sit between the
privileged process's two calls. A separate green "structural fix" box anchors the lesson on
remediation (close the window, don't shrink it).

## Implementation approach

- Mermaid `sequenceDiagram` with three participants (Privileged Process, Filesystem, Attacker),
  `autonumber`, and `Note over` markers for T1 (time of check) and T2 (time of use).
- The critical window is a Mermaid `rect rgb(255, 205, 210)` highlight block wrapping the
  attacker's `unlink("/tmp/x")` and `symlink("/etc/shadow", "/tmp/x")` calls plus a "TOCTOU
  window" note — the spec's red critical-window box.
- Messages follow the spec exactly: access() → OK → (window: unlink, symlink) → open() →
  fd for /etc/shadow → reads /etc/shadow.
- The structural fix (openat + O_NOFOLLOW / operate on the fd) is rendered as an HTML green box
  below the Mermaid diagram (cleaner and more robust than forcing it into the diagram), with
  `<code>` styling for the syscalls.
- Theme uses the brand palette (blue actors, amber notes); a legend names legitimate/attacker/
  critical-window colors. Schema meta tag + bare `<main></main>` present. A `toctou-race.js`
  carries the CANVAS_HEIGHT comment for fix-iframe-heights.

## Validation score

- Before: placeholder scaffold (not gradeable).
- After: **100 / A** (`validate-sims.py`).

## Layout review (Claude Vision)

- **Model:** Claude Opus 4.8 (1M context) — `claude-opus-4-8[1m]`.
- **Mermaid render check:** the `rect rgb(...)` critical-window highlight (a WAVE-1 flagged
  pitfall) rendered correctly with the documented syntax — the red band wraps exactly the two
  attacker steps and the window note. No parse errors.
- **Pass 1 FAIL (6.3 / 1.1 bottom clip):** at the inherited 640 height the green structural-fix
  box and the bottom actor row were below the fold.
- **Attempted enhancement, reverted:** wrapped the Attacker lifeline in a rust-tinted Mermaid
  `box` to honor the spec's "rust orange for attacker." It rendered, but Mermaid duplicated the
  "Attacker" label (box title + participant name) and added excess right-hand whitespace, so it
  was reverted. The rust-orange attacker intent is instead carried by the legend swatch plus the
  red critical-window band that frames the attacker's actions — a cleaner result than the box.
- **Fix:** measured true content height (~810px), set CANVAS_HEIGHT 818 (iframe 820), updated
  both the live and copy-paste example iframes, re-captured.
- **Pass 2:** CLEAN. All three lifelines, the T1/T2 notes, the red critical window with both
  attacker calls, every syscall message, and the green fix box are fully visible with no edge
  clipping; high contrast; draw order correct (window rect behind notes/arrows).

**Final state: clean** (one spec nicety — per-message rust-orange arrows — intentionally not
implemented because Mermaid per-arrow coloring is fragile; the color intent is preserved via
the legend and the critical-window highlight).
