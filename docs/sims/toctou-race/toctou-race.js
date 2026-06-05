// CANVAS_HEIGHT: 818
// A TOCTOU Race Condition — Mermaid sequenceDiagram with a highlighted critical window.
// Bloom: Understand. A static sequence diagram (no animation) showing the
// Time-Of-Check / Time-Of-Use race: a privileged process checks /tmp/x (T1), an
// attacker unlinks it and replaces it with a symlink to /etc/shadow inside the
// "TOCTOU window" (drawn as a red-tinted rect highlight), then the privileged
// process opens the path (T2) and unwittingly follows the symlink. A green box
// below states the structural fix (openat + O_NOFOLLOW / operate on the fd). The
// diagram renders inline in main.html via Mermaid; this file carries the
// CANVAS_HEIGHT comment that fix-iframe-heights.py reads.
