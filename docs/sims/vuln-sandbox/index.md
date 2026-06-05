---
title: Vulnerability Sandbox MicroSim
description: Vulnerability Sandbox MicroSim
status: scaffold
library: p5.js
bloom_level: TBD
---

# Vulnerability Sandbox MicroSim



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 5: "Software Vulnerabilities and Secure Coding"](../../chapters/05-software-vulnerabilities/index.md).

```text
Type: microsim
**sim-id:** vuln-sandbox<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom: Analyze):** Given the same attacker payload, the student compares the behavior of a vulnerable and a fixed implementation of a web endpoint, identifies the structural difference, and reasons about why the fix makes the bad outcome impossible.

**Canvas layout:** 800px wide × 600px tall, responsive. Top region (200px): controls. Middle region (300px): two side-by-side simulated server panels (vulnerable on the left, fixed on the right). Bottom region (100px): outcome display.

**Controls (using p5.js built-in controls):**

- A `createSelect()` dropdown labeled "Vulnerability class" with options: SQL Injection, Command Injection, Reflected XSS, Path Traversal, IDOR.
- A `createInput()` text field labeled "Attacker payload" pre-filled with a default payload appropriate to the selected class (e.g., `' OR 1=1 --` for SQLi). Updates when class changes.
- A `createButton("Send request")` that submits the payload to both panels.
- A `createCheckbox("Show internals", true)` that toggles a translucent overlay showing the constructed query/command for each panel.

**Vulnerable panel (left):** Displays the constructed query as a single concatenated string with the payload highlighted in rust orange (`#d84315`). Animates the string flowing into a "Database/Shell/Browser" icon at the bottom and shows the exploit outcome: "Returned all 10,000 user rows" / "Ran `rm -rf`" / "Stole session cookie" — in red.

**Fixed panel (right):** Displays the parameterized query / argument array / contextually escaped output. The payload is shown as data, color-coded distinctly from the query structure (cybersecurity blue for code, slate steel for data). Outcome: "Returned 0 rows" / "Argument was treated as a literal hostname" / "Payload rendered as text, not script" — in green.

**Outcome display:** A summary bar at the bottom: "Same payload. Different defense. Outcome: [exploited / contained]."

**Default state on load:** SQL Injection class, payload `admin' --`, both panels visible, internals shown.

**Resize behavior:** `updateCanvasSize()` called first in setup(); panels stack vertically below 700px viewport.

**Color palette:** cybersecurity blue (`#1565c0`) for safe code, rust orange (`#d84315`) for attacker payload, slate steel (`#455a64`) for normal data, alert amber (`#ffa000`) for the warning indicator, green (`#2e7d32`) for "contained" outcome.

Implementation: p5.js sketch with `canvas.parent(document.querySelector('main'));` and `updateCanvasSize()` as the first call in setup().
```

## Related Resources

- [Chapter 5: "Software Vulnerabilities and Secure Coding"](../../chapters/05-software-vulnerabilities/index.md)
