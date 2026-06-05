# Generation Log: kernel-user-boundary

- **sim-id:** kernel-user-boundary
- **Library:** Static SVG with hover tooltips
- **Bloom level/verb:** Understand / Explain
- **Learning objective:** Students will explain why user-mode processes cannot touch
  hardware directly, identify the system call interface as the only legal path
  between privilege rings, and reason about why a kernel bug is a total compromise.

## Instructional-design decision

The spec is a "drawing" / static stack diagram. Per the pipeline, "interactive" for
a static diagram means hover/tap reveals, not animation. Bloom Understand →
hover-reveal of concrete data. I built a labeled SVG stack with one tooltip per
meaningful region (each user app, the syscall boundary, the kernel, the hardware)
so a student can probe each layer and read why the boundary matters.

## Implementation approach

- Inline SVG built in a `.js` file from a fixed `viewBox` so it scales to the
  container; a fixed-position `#tooltip` div follows the pointer (and supports
  touchstart for tablets). Marker defs provide the red down "syscall" arrow and the
  green up "return" arrow crossing the slate boundary line.
- Layers: user-mode band (#e3f2fd) with three white app boxes each carrying a small
  drawn padlock + "unprivileged"; the slate boundary line with the System Call
  Interface label and the two arrows; the cybersecurity-blue kernel band subdivided
  into five subsystem boxes with "Direct hardware access"; and a gray hardware bar.
- The `.js` carries the `// CANVAS_HEIGHT:` comment for fix-iframe-heights.

## Validation score

- Before: scaffold.
- After: 100 (A) on the first validation run (metadata `educational`/`pedagogical`
  sections were included up front, so no missing-section deductions).

## Layout review (Claude Vision, Opus 4.8)

- Cycle 1 FAILs:
  1. Large empty whitespace band above the diagram — the viewBox aspect ratio was
     much wider than the iframe, so `xMidYMid meet` centered a short SVG in a tall
     host.
  2. The "System Call Interface (…)" label overlapped the bottom edge of the
     user-mode band (label y was only ~4px below the band).
- Fixes: switched to `xMidYMin meet` (top-anchored), tightened the viewBox
  (820×412) and CANVAS_HEIGHT (520→475) so the SVG fills the iframe with no
  whitespace; increased the gap between the user band and the boundary line
  (boundary offset 26→56) so the interface label sits cleanly in the gap. Re-ran
  fix-iframe-heights (→477), updated the copy-paste example iframe to match,
  re-screenshotted.
- Cycle 2: all checklist items PASS — title/subtitle legible, all four hot regions
  drawn and labeled, arrows + boundary label clear, no clipping top or bottom, good
  contrast. **Clean.**

## Final iframe height

477 (CANVAS_HEIGHT 475 + 2). Copy-paste example iframe also set to 477.
