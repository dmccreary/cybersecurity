// CANVAS_HEIGHT: 845
// MITM via ARP Spoofing — Mermaid sequenceDiagram with four actors:
// Client, Attacker, Gateway, Internet.
// Bloom: Understand. A static, top-to-bottom walk through a man-in-the-middle
// attack: the normal ARP + HTTP flow, the attacker's gratuitous-ARP poisoning,
// and the resulting relayed flow with the attacker on path. Phase boundaries are
// marked with `Note over` separators; the amber HTML note below the diagram states
// the HTTPS defense.
//
// Sequence diagrams have no per-node hover targets, so the "interactivity" is the
// numbered, color-coded message flow plus the phase notes. This file mainly carries
// the CANVAS_HEIGHT comment that fix-iframe-heights.py reads.
