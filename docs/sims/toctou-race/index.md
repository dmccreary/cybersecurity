---
title: A TOCTOU Race Condition
description: A TOCTOU Race Condition
status: scaffold
library: Mermaid
bloom_level: TBD
---

# A TOCTOU Race Condition



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 5: "Software Vulnerabilities and Secure Coding"](../../chapters/05-software-vulnerabilities/index.md).

```text
Type: workflow-diagram
**sim-id:** toctou-race<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A sequence diagram with three actors: Privileged Process (left), Filesystem (center), Attacker (right).

Time flows top-to-bottom. Steps:

1. Privileged Process → Filesystem: `access("/tmp/x", R_OK)` (T1: check)
2. Filesystem → Privileged Process: returns OK (file is a normal user-owned file)
3. **CRITICAL WINDOW** (annotated with a red dashed box around steps 4-5):
4. Attacker → Filesystem: `unlink("/tmp/x")`
5. Attacker → Filesystem: `symlink("/etc/shadow", "/tmp/x")`
6. Privileged Process → Filesystem: `open("/tmp/x", O_RDONLY)` (T2: use)
7. Filesystem → Privileged Process: returns file descriptor for /etc/shadow (because the privileged process followed the symlink)
8. Privileged Process reads /etc/shadow

A side note labels the window between T1 and T2 as "TOCTOU window".

Below the sequence diagram, a small box shows the structural fix: "Use openat() with O_NOFOLLOW, or open the file once and operate on the file descriptor — eliminates the window."

Color: cybersecurity blue for legitimate actors, rust orange (`#d84315`) for attacker actions, alert amber for the critical window box.

Responsive: simplifies to vertical sequence below 600px.

Implementation: Mermaid sequenceDiagram with rect-bordered critical window.
```

## Related Resources

- [Chapter 5: "Software Vulnerabilities and Secure Coding"](../../chapters/05-software-vulnerabilities/index.md)
