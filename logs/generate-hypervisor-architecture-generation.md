# Generation Log: hypervisor-architecture

- **sim-id:** hypervisor-architecture
- **Library:** Static SVG (two inline `<svg>` stacks + small JS tooltip layer)
- **Bloom level / verb:** Understand / Compare
- **Learning objective:** Students will distinguish Type 1 from Type 2
  hypervisors and explain why the Type 2 host OS layer enlarges the attack
  surface.

## Instructional-design decision

The spec type is `drawing`. Per the pipeline, this is a static SVG; "interactive"
means hover/tap reveals, not animation. The MicroSim is two side-by-side
architecture stacks with optional hover tooltips on each band — matching the
Understand Bloom level (compare the two designs, locate the trust boundary).

## Implementation approach

- Two inline SVG stacks in a flex row that wraps to a single column below ~800px
  (responsive per spec).
- Left (Type 1, bare metal): three "Guest OS + Apps" VM boxes (light blue) over a
  cybersecurity-blue hypervisor band over a gray hardware band, with a red dashed
  "VM escape" arrow (custom marker) from a VM down through the hypervisor to the
  hardware, plus a "VM escape ?" callout.
- Right (Type 2, hosted): two "Guest OS" boxes over a slate hypervisor band over a
  wider gray "Host OS" band over a gray hardware band, with a red "larger attack
  surface" annotation.
- Captions above each stack ("Cloud providers use this." / "Developers use
  this.").
- Each band is a hoverable/tappable group with a short data-tip explanation;
  hypervisor-architecture.js shows a positioned tooltip and carries the
  CANVAS_HEIGHT (520) for the iframe-height tool (iframe 522px).

## Validation score

- Before (scaffold): not run (placeholder).
- After: **100 / 100 (grade A).**

## Layout review (Claude Vision)

- Model: Claude Opus 4.8 (1M context) vision.
- **Cycle 1 FAIL — 3.2/3.3 draw-order overlap:** the "VM escape ?" amber callout
  was positioned over the Type 1 hypervisor band and occluded the centered band
  title, which read as "pervisor".
  - **Fix:** moved the "VM escape ?" callout up into the empty gap between the VM
    row and the hypervisor band (beside the dashed arrow), clear of the band title.
- **Cycle 2:** re-screenshot — the hypervisor band title "Hypervisor / ESXi / KVM
  / Hyper-V" is fully readable; the VM-escape arrow and callout are clear; both
  stacks, all band labels, both captions, and the red attack-surface annotation
  render with correct color coding (blue Type 1, slate Type 2, gray hardware/host,
  red escape).
- **Final state:** clean.
