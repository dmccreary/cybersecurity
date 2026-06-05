---
title: Cyber Law Jurisdictional Map
description: Statutes grouped into U.S. Federal, U.S. State, and International bands. Hover any law for details; pick a scenario to highlight the laws that apply and read why each reaches it.
image: /sims/cyber-law-jurisdiction-map/cyber-law-jurisdiction-map.png
og:image: /sims/cyber-law-jurisdiction-map/cyber-law-jurisdiction-map.png
twitter:image: /sims/cyber-law-jurisdiction-map/cyber-law-jurisdiction-map.png
social:
  cards: false
status: review
library: p5.js
bloom_level: Analyze
---

# Cyber Law Jurisdictional Map

![Cyber Law Jurisdictional Map](./cyber-law-jurisdiction-map.png)

<iframe src="main.html" width="100%" height="612" scrolling="no"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

You can embed this MicroSim in your own course page with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/cyber-law-jurisdiction-map/main.html"
        width="100%" height="612" scrolling="no"></iframe>
```

## About this MicroSim

This interactive map groups the laws a cybersecurity practitioner is most likely
to meet into three vertical bands: **U.S. Federal** (CFAA, ECPA, HIPAA, GLBA,
FERPA), **U.S. State** (CCPA/CPRA plus a stacked card for the growing set of
other state privacy laws), and **International** (GDPR and NIS2). Each statute is
a rounded card colored to its band. Hover any card to reveal a tooltip with the
law's scope, who it regulates, its key obligation, and its breach-notification
window — so you can compare, for example, GDPR's 72-hour authority notice against
HIPAA's 60-day window.

The real lesson is jurisdiction. Use the **Scenario** dropdown below the bands to
pick a situation such as "A U.S. healthcare company stores European patient data
on California servers." The MicroSim highlights every law that applies in
cybersecurity blue, dims the rest, and lists in the right-hand panel *why* each
highlighted law reaches the scenario — by data subject, data location, or the
type of regulated entity. Working through the five scenarios shows that more than
one regime usually applies at once, and that jurisdiction is rarely decided by
server location alone.

## Lesson Plan

**Learning objective (Bloom: Understand → Analyze):** Given a hypothetical
data-handling scenario, students will identify which laws apply and explain why
each one reaches the scenario.

**Suggested classroom use:** Before selecting a scenario, have students predict
out loud which laws they think apply and on what basis. Then select the scenario
and compare their prediction with the highlighted laws and the side-panel
reasoning. Emphasize the cases where a law applies for a non-obvious reason
(GDPR following EU data subjects regardless of server location).

**Discussion questions:**

1. In the healthcare scenario, three laws apply for three different reasons.
   Name the trigger for each.
2. Why does moving data to U.S. servers *not* remove GDPR obligations for EU
   residents' data?
3. Which scenario has the shortest required breach-notification window, and how
   would that change an incident-response plan?

## References

- [Wikipedia: General Data Protection Regulation (GDPR)](https://en.wikipedia.org/wiki/General_Data_Protection_Regulation) — the EU privacy law with extraterritorial reach.
- [Wikipedia: Computer Fraud and Abuse Act (CFAA)](https://en.wikipedia.org/wiki/Computer_Fraud_and_Abuse_Act) — the primary U.S. anti-hacking statute.
- [Wikipedia: California Consumer Privacy Act (CCPA)](https://en.wikipedia.org/wiki/California_Consumer_Privacy_Act) — the leading U.S. state privacy law.
- [Wikipedia: NIS2 Directive](https://en.wikipedia.org/wiki/NIS2_Directive) — the EU directive on critical-infrastructure cybersecurity.

## Specification

The full specification below is extracted from
[Chapter 14: "Societal Security: Law, Forensics, and Ethics"](../../chapters/14-societal-security/index.md).

```text
Type: interactive-infographic
**sim-id:** cyber-law-jurisdiction-map
**Library:** p5.js

Learning objective (Bloom: Understand -> Analyze): Given a hypothetical scenario,
the student identifies which laws apply and why. Three vertical bands (U.S.
Federal, U.S. State, International) of statute cards. Hovering a statute reveals
scope, who is regulated, key obligation, and breach-notification window. A
Scenario Selector highlights applicable statutes in cybersecurity blue, dims the
others, and a side panel explains why each highlighted law applies. Responsive via
updateCanvasSize().
```

## Related Resources

- [Chapter 14: "Societal Security: Law, Forensics, and Ethics"](../../chapters/14-societal-security/index.md)
