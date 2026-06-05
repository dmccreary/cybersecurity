---
title: Three Flavors of XSS
description: Three Flavors of XSS
status: scaffold
library: Static SVG with hover tooltips
bloom_level: TBD
---

# Three Flavors of XSS



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 5: "Software Vulnerabilities and Secure Coding"](../../chapters/05-software-vulnerabilities/index.md).

```text
Type: infographic-svg
**sim-id:** xss-three-flavors<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A three-column infographic, one column per XSS subtype, each showing the data flow as a sequence of actors and arrows.

**Column 1: Stored XSS**

Actors top-to-bottom: Attacker → Server (with database icon) → Victim browser

Arrows:
1. Attacker → Server: "POST /comment payload=`<script>...</script>`"
2. Server stores payload in database
3. Victim → Server: "GET /comments"
4. Server → Victim: "page contains `<script>...</script>`"
5. Victim browser executes script

Caption: "One injection compromises every visitor."

**Column 2: Reflected XSS**

Actors: Attacker → Victim → Server → Victim browser

Arrows:
1. Attacker → Victim: "Phishing email with crafted link `?q=<script>...</script>`"
2. Victim → Server: "GET /search?q=`<script>...</script>`"
3. Server → Victim: "Search results page reflects `q` into HTML without escaping"
4. Victim browser executes script

Caption: "Requires the victim to click the crafted URL."

**Column 3: DOM-based XSS**

Actors: Attacker → Victim → Browser only (no server interaction)

Arrows:
1. Attacker → Victim: "Crafted URL `https://site/#payload=<script>...</script>`"
2. Victim browser fetches static page
3. Page's JavaScript reads `location.hash`
4. Page's JavaScript writes hash into `innerHTML` → script executes

Caption: "Server never sees the payload — invisible to server logs."

Color: cybersecurity blue for legitimate flows, alert amber `#ffa000` for attacker-controlled data, red outline on the "executes script" box.

Responsive: columns stack vertically below 900px.

Implementation: Static SVG with consistent layout, `<title>` tooltips on each step.
```

## Related Resources

- [Chapter 5: "Software Vulnerabilities and Secure Coding"](../../chapters/05-software-vulnerabilities/index.md)
