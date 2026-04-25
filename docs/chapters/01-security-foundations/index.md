---
title: "Security Foundations: Properties, Mindset, and Risk"
description: "Establishes the core vocabulary, mindset, threat-modeling techniques, risk reasoning, and Saltzer-Schroeder design principles that ground every later chapter."
generated_by: claude skill chapter-content-generator
date: 2026-04-25 10:16:05
version: 0.07
---

# Security Foundations: Properties, Mindset, and Risk

## Summary

Establishes the conceptual core of cybersecurity: the CIA triad and AAA properties, adversarial and systems thinking, threat modeling techniques (STRIDE, PASTA, attack trees), risk reasoning, and the classical Saltzer–Schroeder design principles. Students leave this chapter with the vocabulary and habits of mind that the remaining chapters build on.

## Concepts Covered

This chapter covers the following 30 concepts from the learning graph:

1. Cybersecurity
2. Information Security
3. Confidentiality
4. Integrity
5. Availability
6. CIA Triad
7. Authentication
8. Authorization
9. Accounting
10. Non-Repudiation
11. AAA Framework
12. Adversarial Thinking
13. Systems Thinking
14. Threat Modeling
15. STRIDE
16. PASTA
17. Attack Trees
18. Risk
19. Likelihood
20. Impact
21. Risk Assessment
22. Defense in Depth
23. Least Privilege
24. Separation of Duties
25. Fail Secure Default
26. Complete Mediation
27. Open Design Principle
28. Economy of Mechanism
29. Psychological Acceptability
30. Security Economics

## Prerequisites

This chapter assumes only the prerequisites listed in the [course description](../../course-description.md).

---

!!! mascot-welcome "Welcome to Cybersecurity"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    Welcome. This chapter trades the comfortable assumption that "the system is benign" for a sharper instinct: every input, every interface, every assumption is somewhere an adversary can lie. We will build the vocabulary first, then the mindset, then the principles that turn that mindset into engineering. Trust, but verify.

## 1. What Cybersecurity Actually Defends

**Cybersecurity** is the computing discipline concerned with establishing and maintaining trustworthy operation of information, systems, and infrastructure in the presence of adversaries. The defining word in that sentence is *adversaries* — people and programs that act against your goals on purpose. Reliability engineering studies what happens when systems fail by accident; cybersecurity studies what happens when they fail because someone arranged for them to.

A closely related term, **information security** (often shortened to "infosec"), is the older and broader discipline that protects information regardless of medium — paper, voice, electronic. Cybersecurity is the subset of information security that deals with information *in computing systems and networks*. The two terms overlap heavily in practice, and in modern usage they are nearly interchangeable, but the distinction matters when you read older standards or when a problem touches non-digital assets.

Three properties have anchored security thinking for fifty years. **Confidentiality** is the property that information is disclosed only to authorized parties — a stolen laptop with an encrypted disk preserves confidentiality even when the hardware is in adversary hands. **Integrity** is the property that information and systems are not modified without authorization — a banking transaction that arrives with the amount changed in transit has lost integrity. **Availability** is the property that authorized users can access the system when they need to — a denial-of-service attack does not steal anything, but it destroys availability all the same.

Together these three properties form the **CIA triad**, and they are the first lens you will reach for when you analyze any system. Every control, every attack, and every requirement in this textbook can be traced back to one or more of these three letters.

#### Diagram: CIA Triad with Example Threats and Controls

<details markdown="1">
<summary>CIA Triad with example threats and controls per leg</summary>
Type: infographic-svg
**sim-id:** cia-triad-overview<br/>
**Library:** Mermaid (or static SVG)<br/>
**Status:** Specified

A triangle with the three letters C, I, A at the vertices. Each vertex is labeled with the property name (Confidentiality, Integrity, Availability) and shows two columns beneath the label:

- **Threats column** (red): one threat that violates this property
  - C: "Eavesdropping on unencrypted traffic"
  - I: "Tampering with a database row"
  - A: "DDoS flooding a public service"
- **Controls column** (green): one control that supports this property
  - C: "AES-GCM encryption + access control"
  - I: "Digital signatures + write-protected logs"
  - A: "Load balancing + rate limiting"

Center of the triangle: the words "Information Asset". Hover/click on each vertex reveals a short definition tooltip. Color: cybersecurity blue (#1565c0) for the triangle, white background, slate-steel text. Responsive design that reflows to a vertical stacked list below 600px viewport width.

Implementation: Static SVG generated at build time, or a small Mermaid graph. No interactivity needed beyond hover tooltips.
</details>

The triad is necessary but not sufficient. Modern systems require additional properties to support accountability and trust between parties.

## 2. Beyond CIA — The AAA Framework

When systems became multi-user and networked, three more properties became essential. **Authentication** is the process of verifying that a claimed identity is genuine — proving you are who you say you are. **Authorization** is the process of deciding whether an authenticated identity is permitted to perform a specific action — once we know it is you, do we let you do *this*? **Accounting** (sometimes called *auditing*) is the process of recording what authenticated identities actually did, so that activity can be reviewed, billed, or investigated.

These three together form the **AAA framework**, and they are the operational backbone of most identity and access management systems. Notice that they form a pipeline: you authenticate first, you authorize next, and you account throughout.

A fourth property is often added when legal or contractual disputes are possible. **Non-repudiation** is the property that an actor cannot credibly deny having performed an action — typically achieved with digital signatures or tamper-evident logs. Non-repudiation is what lets a court conclude that the message really was sent by the claimed sender, or that the transaction really was authorized by the named party.

Before we examine the AAA pipeline visually, let us establish two terms the diagram uses: a *principal* is the entity (user, service, or device) being authenticated, and a *resource* is the asset the principal is trying to access.

#### Diagram: AAA Pipeline with Non-Repudiation Sidebar

<details markdown="1">
<summary>AAA pipeline showing authentication, authorization, accounting, and non-repudiation</summary>
Type: workflow-diagram
**sim-id:** aaa-pipeline<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A horizontal flow diagram with four boxes connected by arrows:

1. **Principal** (left) - "Claims an identity (e.g., user@example.com)"
2. **Authentication** - "Is the claim genuine? (password, MFA, certificate)"
3. **Authorization** - "Is this principal allowed this action on this resource?"
4. **Accounting** - "Record what happened (logs, audit trail)"
5. **Resource** (right) - "Protected asset"

Below the main flow, a side-box labeled **Non-Repudiation** with arrows from "Authentication" and "Accounting" feeding into it, with the caption "Cryptographic evidence — actor cannot deny the action."

Each step is color-coded: authentication = blue (#1565c0), authorization = green, accounting = slate-steel (#455a64), non-repudiation = amber (#ffa000). Clicking each step expands a definition tooltip. Responsive: stacks vertically on screens under 700px wide.

Implementation: Mermaid graph LR with subgraph for non-repudiation sidebar.
</details>

In casual writing you will see "AAA" used to mean *authentication, authorization, accounting*; in some standards documents you will see it expanded to four or five letters that include non-repudiation, identification, or auditing as separate steps. The exact letter count is less important than recognizing that real systems need all of these properties working together.

!!! mascot-thinking "Why CIA and AAA Are Not the Same Question"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    The CIA triad asks *what properties does the asset need?* The AAA framework asks *who is acting on the asset, and are they allowed to?* You will see students conflate them — confidentiality is not authentication. A correctly authenticated user can still violate confidentiality if your authorization rules are wrong.

## 3. The Habits of Mind: Adversarial and Systems Thinking

Vocabulary is necessary but not sufficient. The hardest part of cybersecurity is *thinking like a defender in a world full of adversaries*, and that requires two cross-cutting habits of mind.

**Adversarial thinking** is the deliberate practice of asking "how would an attacker abuse this?" about every feature, interface, and assumption. It is the opposite of the engineering instinct to focus on the happy path. A developer building a comment form thinks about valid comments; an adversarial thinker also asks: *What if the comment contains JavaScript? What if it is 10 megabytes long? What if there are a million of them per second? What if the user impersonates someone else?*

**Systems thinking** is the discipline of reasoning about how components interact, how trust flows, and how a change in one place propagates somewhere unexpected. Most real-world breaches are not the failure of a single control but the surprising composition of multiple controls that each looked correct in isolation. A login service that is "secure" and a password reset flow that is "secure" can compose into a system that is *not* secure if the password reset bypasses the login service's rate limiter.

These two habits reinforce each other. Adversarial thinking asks "what could go wrong here?"; systems thinking asks "where else does this connection reach?" Together they produce the question that distinguishes a security engineer from a feature engineer: **what does this control assume, and what happens at the boundary where the assumption stops being true?**

The following table contrasts the two mindsets — both are essential, and they apply at different moments in a design conversation.

| Mindset | Default question | Useful at | Failure mode if missing |
|---------|-----------------|-----------|------------------------|
| Engineering (default) | "How do I make this work?" | Building features | Ignores misuse cases |
| Adversarial thinking | "How would an attacker abuse this?" | Reviewing controls, threat modeling | Becomes paranoia without context |
| Systems thinking | "Where does this connection reach? What does it assume?" | Architecture, incident response | Becomes academic without specifics |

!!! mascot-tip "A Habit Worth Building"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sentinel offering a tip">
    When you read a feature spec, write three lines of adversarial questions in the margin before you write any code. You will catch more issues during design than any audit will catch later. Think like an attacker, build like a defender.

## 4. Threat Modeling: Making Adversarial Thinking Repeatable

Adversarial thinking is a habit; **threat modeling** is the structured process that makes that habit repeatable across teams and across time. A threat model is an explicit, written description of (a) what assets the system protects, (b) where the trust boundaries are, (c) what an adversary might try, and (d) which threats the design mitigates versus which it accepts.

Three threat-modeling methodologies dominate professional practice, and you should be able to apply at least one fluently before you finish this course.

**STRIDE**, developed at Microsoft, classifies threats into six categories that map directly to the security properties they violate. Each letter of STRIDE is a question you ask of every component in the system:

- **S**poofing — can an adversary impersonate a legitimate identity? (violates authentication)
- **T**ampering — can an adversary modify data or code? (violates integrity)
- **R**epudiation — can an actor plausibly deny an action? (violates non-repudiation)
- **I**nformation disclosure — can an adversary read what they should not? (violates confidentiality)
- **D**enial of service — can an adversary deny use to legitimate users? (violates availability)
- **E**levation of privilege — can an adversary gain capabilities they should not have? (violates authorization)

STRIDE is fast, structured, and works well in design reviews because every component gets all six questions. Its weakness is that it does not naturally consider *why* an attacker would bother — it is property-driven, not goal-driven.

**PASTA** (Process for Attack Simulation and Threat Analysis) is a heavier, seven-stage methodology that begins with business objectives and ends with concrete attack simulations. PASTA forces the analyst to define what the business is trying to do, what assets support those objectives, who would target those assets, and what attack scenarios would actually achieve the attacker's goals. PASTA produces richer threat models than STRIDE but takes substantially more time, so it is reserved for high-stakes systems and compliance-driven analyses.

**Attack trees**, formalized by Bruce Schneier in the late 1990s, are a hierarchical decomposition of an attacker's goal. The root of the tree is the attacker's objective (for example, "read patient X's medical record"); the children are the different ways to achieve that objective; their children are the steps that would be required for each path. Attack trees make trade-offs between attacker paths visible and let you compare the cost or feasibility of each branch.

#### Diagram: Threat Modeling Methodology Comparison

<details markdown="1">
<summary>Side-by-side comparison of STRIDE, PASTA, and attack trees</summary>
Type: infographic-svg
**sim-id:** threat-modeling-methods<br/>
**Library:** Static SVG or Mermaid<br/>
**Status:** Specified

Three vertical columns of equal width:

**Column 1 — STRIDE** (header in cybersecurity blue #1565c0)
- Six rows, one per letter, each showing: letter, name, property violated
- Footer: "Use for: design reviews, fast component-by-component analysis"

**Column 2 — PASTA** (header in slate steel #455a64)
- Seven numbered stages from "Define Objectives" to "Simulate Attacks"
- Footer: "Use for: high-stakes systems, business-aligned analysis"

**Column 3 — Attack Trees** (header in amber #ffa000)
- A small attack tree showing root "Steal Customer Data" branching to three children: "Compromise database", "Phish admin", "Exploit API"; one child further expanded to two grandchildren
- Footer: "Use for: comparing attacker paths, cost/feasibility analysis"

Below all three columns: a single-line summary table showing time-to-complete (STRIDE: hours, PASTA: days–weeks, attack trees: hours–days), output type, and best fit. Responsive: columns stack vertically below 800px.

Implementation: Static SVG built once, or three small Mermaid diagrams in a CSS grid.
</details>

In practice, mature security programs use STRIDE for routine design reviews, attack trees when they need to compare specific adversary paths, and PASTA only for systems where regulatory or contractual stakes justify the time investment. None of the three is "best" — they are different tools for different conversations.

!!! mascot-encourage "If This Feels Like A Lot — It Is"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Sentinel offering encouragement">
    First-time threat models are awkward. You will second-guess your asset list, miss obvious threats, and feel like the methodology is fighting you. That is normal — threat modeling is a skill that compounds with practice. Run STRIDE on a small system three times, and the pattern stops being theory and starts being instinct.

## 5. Risk: Quantifying What Could Go Wrong

Threat modeling enumerates what could go wrong; **risk** quantifies how much it would matter. Risk is the bridge between technical security work and the business decisions that fund it. Stakeholders rarely care about the existence of a vulnerability — they care about the *risk* the vulnerability creates.

Two ingredients combine to form risk: **likelihood** is the probability that a specific adverse event occurs in a given time window, and **impact** is the magnitude of harm if it does. The standard simplification is that risk is the product of likelihood and impact, often written as

\[
\text{Risk} = \text{Likelihood} \times \text{Impact}
\]

This formula is more a way of *thinking* than a way of *computing* — actual numbers are usually approximate ranges, and impact is often multidimensional (financial loss, reputational harm, regulatory exposure, human safety). What the formula buys you is the discipline to consider both factors at once. A high-impact event with a vanishingly small likelihood may not justify the same investment as a moderate-impact event that happens monthly.

A **risk assessment** is a structured exercise that catalogs threats, estimates their likelihood and impact, and ranks them. The output is typically a risk register — a prioritized list that drives the security program's investment decisions for the next planning cycle.

Before we look at the risk-assessment matrix below, two terms worth pinning down. *Likelihood* is normally rated on a coarse ordinal scale (rare / unlikely / possible / likely / almost certain) rather than a precise probability, because real threat data rarely supports more precision. *Impact* is similarly rated on an ordinal scale (negligible / minor / moderate / major / catastrophic) tied to concrete dollar ranges or harm categories defined by the organization.

#### Diagram: 5x5 Risk Heat Map with Treatment Bands

<details markdown="1">
<summary>5x5 risk matrix with treatment recommendations per cell</summary>
Type: infographic-svg
**sim-id:** risk-heat-map<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A 5x5 grid:
- X-axis: Likelihood (Rare → Almost Certain), labels at column centers
- Y-axis: Impact (Negligible → Catastrophic), labels at row centers
- Each of the 25 cells is colored on a green-yellow-orange-red gradient based on Likelihood × Impact severity
- Cells along the diagonal and upper-right are red ("Critical — mitigate immediately")
- Yellow band of cells is "Significant — mitigate or transfer"
- Green band is "Acceptable — monitor"

A legend below shows four severity tiers (Acceptable / Significant / Critical / Mitigate Immediately) with their treatment recommendations. Hover tooltips on each cell explain the recommended treatment ("e.g., for Likelihood=Possible, Impact=Major: Mitigate or transfer; assign owner; review in 30 days").

Color palette: green #4caf50, yellow #fdd835, orange #fb8c00, red #c62828. Responsive: rotates to portrait orientation under 600px wide.

Implementation: Static SVG with `<title>` elements per cell for tooltip text.
</details>

Risk reasoning underpins almost every security decision in this course. When you encounter a control later in the textbook — encryption, network segmentation, multi-factor authentication — the question to ask is always *what risk does this control address, and is the cost commensurate with the risk?*

## 6. The Saltzer-Schroeder Design Principles

In 1975, Jerome Saltzer and Michael Schroeder published a paper titled "The Protection of Information in Computer Systems" that distilled the field's accumulated wisdom into a set of design principles. Half a century later, these principles remain the most concise summary of how to design defensible systems, and modern security frameworks still refer to them by name. We will examine the most important ones individually, then return to a comparison table.

**Defense in depth** is the principle that no single control should be expected to stop a determined adversary; instead, the system should layer multiple independent controls so that the failure of any one does not lead to total compromise. A well-designed system might use a network firewall, a host firewall, an intrusion detection system, encrypted databases, and access controls *all* protecting the same asset. The attacker must defeat each layer in turn, and the cost compounds.

**Least privilege** is the principle that every actor (user, service, process) should run with the minimum set of permissions required to do its job, and no more. A web server that only needs to read static files should not have write access to its own code. A backup process that only needs to read databases should not have credentials that can drop tables. Least privilege limits the *blast radius* — the scope of damage when something does go wrong.

**Separation of duties** is the principle that critical actions should require multiple independent actors, so that no single compromised account can cause catastrophic harm. The classical example is finance: the person who initiates a payment should not be the same person who approves it. In security, separation of duties shows up in code-deployment pipelines (developer commits, reviewer approves, automation deploys) and in privileged-access workflows (operator requests, manager approves, audit logs the action).

**Fail secure default** is the principle that when a system fails or encounters an unexpected condition, it should fail into a *secure* state — denying access, logging the failure, and refusing to make a guess. The opposite, fail-open behavior, is a footgun: an authentication service that returns "authenticated" when it can't reach the user database is failing in the wrong direction.

**Complete mediation** is the principle that every access to every protected resource must be checked against the authorization policy *every single time*, not cached or assumed. Caching authorization decisions is tempting for performance and is the source of an entire class of vulnerabilities (TOCTOU bugs, stale capability checks).

**Open design** is the principle that the security of a system should not depend on the secrecy of its design. Auguste Kerckhoffs articulated this in 1883 for cryptography ("the system should remain secure even if the design is known to the adversary"), and it generalizes to all of security. Secret algorithms cannot be peer-reviewed, and once leaked they offer no protection. Real security depends on secrets that are *replaceable* (keys, passwords) — not on the design itself.

**Economy of mechanism** is the principle that security mechanisms should be as small and simple as possible. Complex code has more bugs, and security bugs are catastrophic. The smallest mechanism that meets the requirement is almost always the right one; clever mechanisms accumulate failure modes faster than features.

**Psychological acceptability** is the principle that controls must be usable in practice. A password policy that requires 32-character random passwords rotated daily will produce sticky notes on monitors. Security mechanisms that are not psychologically acceptable get bypassed, and the bypassed system is less secure than a less-strict mechanism that people actually follow. This principle is the bridge between the Component, System, and Human Security knowledge areas — usable security is real security.

!!! mascot-warning "The Most Common Way Principles Fail"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel showing caution">
    These principles fail not when they are unknown, but when they are silently violated for short-term convenience. "We'll grant the service full database access for now and tighten it later" violates least privilege; "the auth check is expensive, let's cache it for 60 seconds" violates complete mediation. The principles are not obstacles — they are the failure modes of expedient shortcuts written down in advance.

The principles are not independent — they reinforce each other. The following table summarizes each principle, the question it answers, and a typical violation. (Recall that all eight principles have been defined in the prose above; this table reinforces that material.)

| Principle | Question it answers | Typical violation |
|-----------|---------------------|-------------------|
| Defense in depth | What if my primary control fails? | "We have a firewall — that's enough." |
| Least privilege | What's the minimum capability needed? | Service runs as root for "convenience" |
| Separation of duties | Can one compromised account cause catastrophe? | One admin can deploy and approve their own code |
| Fail secure default | What happens when the system errors? | Auth service fails-open on database timeout |
| Complete mediation | Is every access checked, every time? | Cached authorization decisions |
| Open design | Does security rely on secret design? | "Security through obscurity" |
| Economy of mechanism | Is this as simple as it can be? | Custom crypto, custom auth, custom protocols |
| Psychological acceptability | Will people actually follow this? | 32-char passwords, rotated daily |

## 7. Security Economics: When Principles Meet Budgets

The principles above describe what *should* happen; **security economics** is the discipline of deciding what *will* happen given finite budgets, finite attention, and rational adversaries. Security work is never about eliminating risk — it is about spending the next dollar on the control that reduces risk the most.

Three economic insights shape practical security work. First, security is a market with two sides: defenders pay to protect, and attackers pay to attack. A control is effective when it raises the attacker's cost above the value the attacker can extract. You do not need a perfect control — you need a control that makes you a less attractive target than the next system on the attacker's list.

Second, the marginal value of additional security investment diminishes. The first dollar spent on security typically returns enormous risk reduction; the millionth dollar may produce almost none. Beyond a certain point, additional spending fails to reduce risk faster than it consumes resources that could be used elsewhere.

Third, externalities and information asymmetries distort the market. Software vendors often bear less of the cost of insecurity than their customers do, which leads to systematic underinvestment in security. Regulation (HIPAA, GDPR, breach disclosure laws) exists in part to correct these market failures by forcing the cost back onto the producer.

Below is a small numeric example to make the trade-off concrete. Suppose a system faces a threat with annual likelihood 0.10 and expected impact $200,000 if the threat materializes.

\[
\text{Annual Loss Expectancy} = 0.10 \times \$200{,}000 = \$20{,}000
\]

A control that costs $5,000 per year and reduces likelihood from 0.10 to 0.02 reduces ALE to

\[
0.02 \times \$200{,}000 = \$4{,}000
\]

The control reduces expected loss by $16,000 per year at a cost of $5,000 — a clear win. A second, additional control that costs $30,000 per year and reduces likelihood further to 0.01 only saves an additional $2,000 in expected loss. The second control is uneconomic, even though it is technically effective. Economics, not technology, decides what gets deployed.

!!! mascot-thinking "The Real Question Stakeholders Are Asking"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    When a manager asks "is this secure?" they almost never mean "is this perfectly secure?" They mean "is the residual risk acceptable given what it costs to reduce it further?" Learning to translate technical findings into that question is the bridge from security analyst to security engineer.

## 8. Bringing It Together — A Worked Example

To anchor the chapter, consider a small example that uses every concept introduced. Imagine an organization is designing a customer portal that lets users view their billing history.

The CIA properties for the portal are clear: *confidentiality* of billing data, *integrity* of the displayed amounts, and *availability* during business hours. The AAA pipeline is also clear: customers authenticate (probably with passwords plus MFA), are authorized (each customer can see only their own records), and the system accounts (every billing-history view is logged for audit). Non-repudiation matters less for read-only billing views, but it matters greatly for the payment-submission feature that will follow.

Adversarial thinking on this design surfaces immediate questions: what stops a customer from changing the customer-ID parameter in the URL to view someone else's bills? What if an attacker tries 10,000 password guesses? What if the portal's reverse proxy fails and the application reachable behind it has weaker controls?

A STRIDE pass over the architecture surfaces six categories of threat, of which the most pressing are *spoofing* (credential stuffing against the login) and *information disclosure* (the customer-ID-in-URL pattern). A small attack tree confirms that the cheapest attacker path is credential stuffing using leaked passwords from other breaches.

Risk assessment ranks the credential-stuffing threat as *likely* with *major* impact (regulatory exposure if customer data leaks), placing it in the red zone of the heat map. Treatment: add MFA (mitigate), and add rate limiting plus credential-stuffing detection (mitigate further).

Design principles guide the controls: *defense in depth* says rate-limit at the load balancer *and* in the application; *least privilege* says the portal service account should only read the customer's own records; *fail secure* says authentication failure denies access (never approves on error); *psychological acceptability* says the MFA flow must be brief enough that users complete it, not bypass it. Security economics confirms the controls are worth their cost.

What you have just read is a complete, professional-quality security analysis of a small system, performed using only the concepts introduced in this chapter. Every later chapter in this textbook adds depth — cryptographic protocols, network defenses, secure-coding practices, organizational frameworks — but the structure of the analysis stays the same.

!!! mascot-celebration "What You Can Now Do"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sentinel celebrating">
    You can now read a system description, identify the CIA and AAA properties at stake, run a STRIDE pass, sketch an attack tree, score the surfaced threats on a risk heat map, and reason about which Saltzer-Schroeder principles the design honors or violates. That is the foundation. The next chapter builds the threat-and-control vocabulary you will use to translate that analysis into specific mitigations.

## Key Takeaways

- **CIA + AAA** form the property vocabulary: confidentiality, integrity, availability, authentication, authorization, accounting, plus non-repudiation when accountability matters.
- **Adversarial thinking** asks "how would an attacker abuse this?"; **systems thinking** asks "what does this connection assume?" Both are required.
- **Threat modeling** (STRIDE for fast component-by-component reviews, PASTA for high-stakes systems, attack trees for path comparison) makes adversarial thinking repeatable.
- **Risk = Likelihood × Impact** is a thinking tool more than a calculation; risk assessment ranks threats so investment can be prioritized.
- **Saltzer-Schroeder principles** — defense in depth, least privilege, separation of duties, fail-secure default, complete mediation, open design, economy of mechanism, psychological acceptability — describe what defensible designs have in common.
- **Security economics** decides which controls actually get built: spend the next dollar where it reduces the most risk.

Next chapter: the threat-and-control vocabulary that turns this foundation into specific engineering decisions.
