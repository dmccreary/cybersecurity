---
title: Layers of Access Control on a Modern Linux Box
description: A Mermaid flowchart following one read() syscall through three AND-composed Linux access-control gates — DAC, capabilities, and MAC — showing a denied read of /etc/shadow beside an allowed read of a web file.
image: /sims/linux-ac-layers/linux-ac-layers.png
og:image: /sims/linux-ac-layers/linux-ac-layers.png
twitter:image: /sims/linux-ac-layers/linux-ac-layers.png
social:
   cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# Layers of Access Control on a Modern Linux Box

![Layers of Access Control on a Modern Linux Box](./linux-ac-layers.png)

<iframe src="main.html" width="100%" height="832" scrolling="no"></iframe>

[Run the Linux Access-Control Layers MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/linux-ac-layers/main.html" height="832" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This diagram follows a **single `read()` syscall** as it passes through the three
access-control gates a modern Linux kernel enforces, and it does so twice — once
for a read that is **denied** and once for a read that is **allowed** — so you can
compare them side by side. The acting process is the Apache web server, running
as UID `apache` under the security label `httpd_t`. On the **left**, it tries to
read `/etc/shadow`; on the **right**, it reads a normal web file.

The three gates are **DAC** (discretionary access control — the familiar
owner/group/other permission bits), the **capability** check (privileged
overrides like `CAP_DAC_READ_SEARCH`), and **MAC** (mandatory access control via
AppArmor or SELinux). The crucial idea is that the gates are **AND-composed**:
access is granted only if *every* gate permits it, so a single DENY ends the
request. The shadow read fails at the very first gate (DAC), never reaching the
others; the web-file read clears all three and returns the file contents. Note
the asymmetry the side note calls out: if DAC permits but MAC denies, **MAC
wins** — the file's owner cannot override mandatory policy. Hover any box for
detail.

## Lesson Plan

**Learning objective (Bloom — Understand):** Students can trace a single `read()`
syscall through the DAC, capability, and MAC gates and explain why the gates are
AND-composed and why a single DENY is decisive.

**Suggested classroom use:** Walk the two chains in parallel, hovering each gate.
Ask students to predict the result at each gate before revealing it, and to name
which gate the attacker would have to defeat to read the shadow file.

**Discussion questions:**

1. The shadow read is denied at DAC and never reaches MAC. Why is "fail at the
   earliest gate" both efficient and safe?
2. Why can mandatory access control (MAC) deny a read that the file's own
   permission bits (DAC) would have allowed?
3. `CAP_DAC_READ_SEARCH` lets a process bypass DAC file-read checks. Why is
   handing that capability to a network-facing service like a web server
   dangerous?

## References

- [Mandatory access control (Wikipedia)](https://en.wikipedia.org/wiki/Mandatory_access_control)
- [Discretionary access control (Wikipedia)](https://en.wikipedia.org/wiki/Discretionary_access_control)
- [Capability-based security (Wikipedia)](https://en.wikipedia.org/wiki/Capability-based_security)

## Specification

The full specification below is extracted from
[Chapter 10: "System Security: OS, Memory, and Access Control"](../../chapters/10-system-security/index.md).

```text
Type: drawing
**sim-id:** linux-ac-layers<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A vertical flow showing a single `read(/etc/shadow)` syscall traveling through each access-control gate.

Top to bottom:
1. **Process** (white box, top): "httpd, UID=apache, current AppArmor profile: usr.sbin.apache2"
2. Arrow labeled `read("/etc/shadow")` going down
3. **DAC check** (light blue box): "Is UID `apache` in shadow's owner/group, or does it have read for other? `/etc/shadow` is `0640 root:shadow` — DAC: DENY for non-root non-shadow."
4. **Capability check** (cyan box): "Does process hold `CAP_DAC_READ_SEARCH`? No. Skip."
5. **MAC check** (cybersecurity blue box): "Is `httpd_t` allowed to read `shadow_t`? Policy: NO. MAC: DENY."
6. **Result** (red box): "EACCES — read denied. Logged in audit.log."

A side note in slate steel: "Even one DENY is enough; checks are AND-composed. If DAC permits but MAC denies, MAC wins."

Alongside the diagram, a small alternate path shown to the right where DAC permits a `read("/var/www/html/index.html")` and the process does hold the right MAC label, leading to a green ALLOW result.

Color: cybersecurity blue `#1565c0` for MAC layer, slate steel `#455a64` for capability layer, light blue `#e3f2fd` for DAC layer, red `#d32f2f` for DENY, green `#4caf50` for ALLOW. Responsive: vertical orientation on narrow screens.

Implementation: Mermaid flowchart TD with custom node styling.
```

## Related Resources

- [Chapter 10: "System Security: OS, Memory, and Access Control"](../../chapters/10-system-security/index.md)
