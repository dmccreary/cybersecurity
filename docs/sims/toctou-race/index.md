---
title: A TOCTOU Race Condition
description: A Mermaid sequence diagram of a Time-Of-Check to Time-Of-Use (TOCTOU) race condition, showing a symlink-swap attack against a privileged process and the structural fix that eliminates the window.
image: /sims/toctou-race/toctou-race.png
og:image: /sims/toctou-race/toctou-race.png
twitter:image: /sims/toctou-race/toctou-race.png
social:
   cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# A TOCTOU Race Condition

![A TOCTOU Race Condition](./toctou-race.png)

<iframe src="main.html" width="100%" height="820" scrolling="no"></iframe>

[Run the TOCTOU Race Condition MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/toctou-race/main.html" height="820" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This sequence diagram shows a classic **TOCTOU** bug — *Time-Of-Check to
Time-Of-Use* — one of the more counterintuitive software vulnerabilities because
the buggy code often looks defensive. Three lifelines run top to bottom: a
**Privileged Process** (left), the **Filesystem** (center), and an **Attacker**
(right).

At **T1 (time of check)** the privileged process calls `access("/tmp/x", R_OK)`
and the filesystem replies that `/tmp/x` is a normal, user-owned file — so far so
good. The danger is the gap that follows. Inside the red-tinted **TOCTOU window**,
the attacker `unlink`s `/tmp/x` and re-creates it as a *symlink* pointing at
`/etc/shadow`. Then at **T2 (time of use)** the privileged process opens the same
path, follows the symlink, and is handed a file descriptor for `/etc/shadow` — a
file it should never have read. The check and the use referred to two *different*
objects, and that is the whole bug.

The green box below the diagram states the **structural fix**: don't try to make
the window smaller — close it. Use `openat()` with `O_NOFOLLOW`, or open the file
*once* and operate on the resulting file descriptor (`fstat` rather than re-running
`stat` on the path), so the thing you checked and the thing you use are guaranteed
to be the same object. The diagram is read top to bottom and simplifies to a
single vertical sequence on narrow screens.

## Lesson Plan

**Learning objective (Bloom — Understand / explain):** Students can explain how
the interval between a check and a use creates an exploitable race, trace a
symlink-swap TOCTOU attack against a privileged process, and identify the
structural fix.

**Suggested classroom use:** Project the diagram and read it as a story. Cover the
red window first and ask "this code checks the file before using it — what could
go wrong?" Then reveal the attacker's two calls inside the window. Finish on the
fix box and stress the principle: re-resolving a path is re-checking; operating on
a file descriptor is not.

**Discussion questions:**

1. The developer "fixes" the bug by moving the `open()` call to the line right
   after `access()`. Why does shrinking the window fail to eliminate the
   vulnerability?
2. What property of a file descriptor (versus a path string) makes the
   `openat()` / `fstat()` approach safe?
3. TOCTOU bugs are a kind of race condition. What makes them especially dangerous
   when the checking code runs with elevated privilege?

## References

- [Time-of-check to time-of-use (Wikipedia)](https://en.wikipedia.org/wiki/Time-of-check_to_time-of-use)
- [Race condition (Wikipedia)](https://en.wikipedia.org/wiki/Race_condition#File_systems)
- [CWE-367: Time-of-check Time-of-use (TOCTOU) Race Condition](https://cwe.mitre.org/data/definitions/367.html)
- [Symbolic link (Wikipedia)](https://en.wikipedia.org/wiki/Symbolic_link)

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
