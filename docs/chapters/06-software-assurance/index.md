---
title: "Software Assurance and Supply Chain Security"
description: "Introduces the defensive toolchain: input validation, output encoding, parameterized queries, static and dynamic analysis, fuzzing, software composition analysis, the supply chain, SBOMs, code signing, and secure code review."
generated_by: claude skill chapter-content-generator
date: 2026-04-25 11:05:00
version: 0.07
---

# Software Assurance and Supply Chain Security

## Summary

Introduces the defensive toolchain that hardens software: input validation, output encoding, parameterized queries, static and dynamic analysis, fuzzing, software composition analysis and dependency scanning, the software supply chain, SBOMs, code signing, and secure code review.

## Concepts Covered

This chapter covers the following 12 concepts from the learning graph:

1. Input Validation
2. Output Encoding
3. Parameterized Query
4. Static Analysis
5. Dynamic Analysis
6. Fuzzing
7. Software Composition Analysis
8. Dependency Scanning
9. Software Supply Chain
10. SBOM
11. Code Signing
12. Secure Code Review

## Prerequisites

This chapter builds on concepts from:

- [Chapter 4: Cryptography in Practice: PKI, TLS, and Data Protection](../04-crypto-in-practice/index.md)
- [Chapter 5: Software Vulnerabilities and Secure Coding](../05-software-vulnerabilities/index.md)

---

!!! mascot-welcome "Welcome to the Defensive Toolchain"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    Welcome. Chapter 5 named the bugs; this chapter equips you to find, prevent, and contain them at scale. We will move from in-code defenses (validating input, encoding output, parameterizing queries) through the automated tooling that finds bugs you missed (static analysis, dynamic analysis, fuzzing) out to the supply-chain layer where most modern code is *not yours*. Trust, but verify — including the libraries you imported this morning.

## 1. From "Don't Write Bugs" to "Make Bugs Hard to Write"

A working secure-coding standard is necessary but not sufficient. Even teams that have read the OWASP Top Ten and the CWE Top 25 ship vulnerabilities, because most software is now assembled from hundreds of dependencies, written under deadline, and modified by dozens of engineers across years. The goal of **software assurance** is to add automated, repeatable defenses to the development pipeline so that whole *classes* of bug become hard to introduce, and the ones that slip through are caught before users encounter them.

This chapter organizes those defenses into three concentric layers. The innermost layer is the code itself: defensive patterns at the boundaries of an application — validating input, encoding output, parameterizing database queries — that eliminate entire vulnerability classes if used consistently. The middle layer is the analysis tooling that runs over the code: static analysis, dynamic analysis, and fuzzing find bugs the developer did not. The outermost layer is the supply chain: the libraries, base images, build systems, and signing infrastructure your code depends on, all of which an attacker can target instead of your code. A modern security program needs all three layers, and they reinforce one another rather than substituting for one another.

The "defense in depth" principle from Chapter 1 shows up here in operational form. Input validation alone is not enough — a single missed validation point exposes the application. Static analysis alone is not enough — it has false positives and misses runtime-only bugs. SBOMs alone do not stop an attacker — they only tell you what was in the box. The strength of the program is in the *composition* of layers, each catching what the others miss.

#### Diagram: The Three Layers of Software Assurance

<details markdown="1">
<summary>Concentric circles showing in-code defenses, analysis tooling, and supply chain layers</summary>
Type: infographic
**sim-id:** software-assurance-layers<br/>
**Library:** p5.js<br/>
**Status:** Specified

Three concentric circles on a 720x480 responsive canvas (resizes to container width).

- **Inner circle** (cybersecurity blue #1565c0, label "In-Code Defenses"): contains three rotating chips: "Input Validation", "Output Encoding", "Parameterized Queries"
- **Middle ring** (slate steel #455a64, label "Analysis Tooling"): contains three chips: "Static Analysis (SAST)", "Dynamic Analysis (DAST)", "Fuzzing"
- **Outer ring** (amber alert accent #ffa000, label "Supply Chain"): contains four chips: "SCA / Dependency Scanning", "SBOM", "Code Signing", "Secure Build"

Hovering on any chip shows a 1-line tooltip with the definition (matching the glossary). A small "What this layer protects against" caption updates as the user hovers a ring (e.g., "In-code defenses prevent injection at the trust boundary.").

Learning objective (Bloom — Understand): explain how the three layers compose to defend a software system, and articulate which layer fails when a particular incident occurs.

Responsive: collapses to vertical stack of three labeled bands below 600px viewport.

Implementation: p5.js sketch with `updateCanvasSize()` first in setup(), `canvas.parent(document.querySelector('main'))`, mouse-hover tooltips drawn on top.
</details>

## 2. The First Line of Defense: Input Validation

**Input validation** is the practice of checking that data crossing a trust boundary into an application matches an expected, well-defined shape *before* the application acts on it. Every place an application receives data from a less-trusted source — an HTTP request, a file upload, a command-line argument, a message from another service, a row from a database it did not write — is a trust boundary, and every trust boundary needs validation.

Validation policies fall into two broad families. **Allow-listing** (also called whitelist validation) defines what *is* permitted and rejects everything else: e.g., "this field must match the regex `^[A-Za-z0-9_-]{1,32}$`." **Deny-listing** (blacklist validation) defines what is not permitted and allows everything else: e.g., "reject inputs containing `<script>`." Allow-listing is strictly more secure because the defender enumerates the small set of acceptable inputs rather than trying to enumerate the unbounded set of malicious ones. Deny-listing is the path of least resistance and the path of most bypasses — attackers spend their careers finding inputs that the deny-list author did not think of.

A useful mental model is to validate inputs along four dimensions, in order:

1. **Type** — is this an integer, a string, a date? Reject anything that fails to parse.
2. **Length / range** — is the integer in `[0, 1_000_000]`? Is the string `<= 256` characters?
3. **Format / structure** — does it match the expected pattern (regex, schema, JSON shape)?
4. **Semantic / business rule** — does the user have permission to act on the resource named in this input?

Validation should happen *as close to the input source as possible*, ideally at a single chokepoint per trust boundary, and it should *reject* (not silently sanitize) malformed input. Auto-fixing malformed input is a footgun: the auto-fixer's idea of "what the user meant" can differ from the application's idea of "what is safe," and the gap is where bypasses live.

| Validation aspect | Bad pattern | Good pattern |
|---|---|---|
| Where | Scattered across handlers | One layer at the trust boundary |
| Strategy | Deny-list ("block dangerous chars") | Allow-list ("must match this schema") |
| On failure | Try to "fix" the input | Reject with a clear error |
| Encoding | Validate after decoding once | Validate canonical form (decode fully first) |
| Trust | Trust client-side validation | Re-validate server-side; client is advisory |

Client-side validation (the JavaScript that turns a form red) is a *usability* feature, not a security feature. Anyone can disable it, send the request directly with `curl`, or replay the request from a proxy. **Server-side validation is mandatory; client-side validation is a courtesy.** Treating client-side validation as a security control is one of the most common mistakes new web developers make.

## 3. Output Encoding — The Second Half of Injection Defense

Where input validation defends the *entry* of data into the application, **output encoding** defends the *exit* of data into another system: a web page, a shell command, a SQL statement, an LDAP filter, an XML document. Output encoding transforms data so that whatever it contains — even hostile-looking characters — is interpreted as data, not as control instructions, by the downstream parser.

The core idea is that every output context has a different syntax. A `<` in HTML starts a tag. A `;` in a shell starts a new command. A `'` in SQL ends a string literal. A `$` in a JavaScript template literal begins an interpolation. The same byte means different things in different contexts, so the encoder must match the *destination* context. Encoding for the wrong context is a common bug: HTML-encoding a value that is then placed inside a JavaScript string in an HTML page can leave the JavaScript-context attack vector wide open.

The contexts you will most often need to encode for, in web work specifically, are summarized below:

| Output context | Dangerous characters | Encoder | Common bug |
|---|---|---|---|
| HTML body | `< > & " '` | HTML entity encode | XSS via untrusted text in templates |
| HTML attribute | `< > & " ' space` | HTML attribute encode | Breaking out of an attribute |
| JavaScript string | `< > & " ' \ /` and Unicode line terminators | `\xHH` or `\uHHHH` escapes | Breaking out of a `<script>` block |
| URL parameter | reserved characters per RFC 3986 | percent-encoding | Path traversal, parameter pollution |
| CSS value | `< > & " '` and Unicode controls | CSS escape | XSS via `expression()` or `url()` |

Most modern web frameworks (React, Angular, Vue, Django, Rails) encode by default in HTML body and HTML attribute contexts, which is why **cross-site scripting** has become rarer in framework-using code than it was in raw-template code. The bugs that remain tend to live in the *non-default* contexts: a developer renders a value into a `<script>` block, or assigns it to an `innerHTML`, or builds a URL by string concatenation, and the framework's default encoding does not apply.

The pairing of input validation with output encoding is the textbook injection defense. Input validation rejects ill-formed data at the entrance; output encoding ensures any data that does pass through is treated as data wherever it is used. **Neither one is sufficient alone**, because validation cannot anticipate every downstream syntax, and encoding cannot fix data that was already malformed enough to break business logic.

## 4. Parameterized Queries — Killing SQL Injection As A Class

Of all the injection-class defenses, the one that demonstrates the structural-fix principle most clearly is the **parameterized query** (also called a *prepared statement*). A parameterized query separates the SQL *code* (a fixed template with placeholder markers) from the SQL *data* (user-supplied values that fill those markers). Because the values are bound through a typed API after the SQL syntax is already parsed, no value, no matter what characters it contains, can change the structure of the query.

Compare two ways of asking the database for a user:

```python
# Vulnerable: string concatenation builds the SQL
username = request.GET["user"]
cursor.execute("SELECT * FROM users WHERE name = '" + username + "'")
# username = "admin' OR '1'='1" turns this into a query that returns all rows.

# Safe: parameterized query — the ? is a placeholder
username = request.GET["user"]
cursor.execute("SELECT * FROM users WHERE name = ?", (username,))
# username = "admin' OR '1'='1" is treated as a literal string value;
# the SQL structure is fixed before any user data is bound.
```

In the safe version, the database driver hands the query template and the parameter to the database as separate elements. The database parses the SQL once, then plugs the parameter into the parsed plan as data. There is no string-concatenation step to attack. The parameter could be the entire works of Shakespeare — it would be looked up as a username string and not found, and that is the entire failure mode.

The same pattern generalizes beyond SQL. **Parameterized commands** (with shell APIs that accept arrays of arguments rather than a single command string) prevent command injection. **DOM APIs** (`textContent`, `setAttribute`) prevent DOM-based XSS where their template-string equivalents (`innerHTML`) do not. The unifying idea is *separating code from data at an API boundary that is enforced by the runtime, not by the developer's discipline*.

!!! mascot-warning "String Concatenation Into A Query Is Always Wrong"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel showing caution">
    If you ever find yourself building a SQL string with `+` or `f"...{value}..."`, stop. The fix is not "escape the value harder" — it is to use the parameterized API your database driver already provides. Escaping is a deny-list (Section 2); parameterization is a structural fix. One of these is on every list of "common SQL injection bypasses." The other is not.

The parameterized query is the canonical example of a defense that **makes the bad outcome impossible**, not just unlikely. That is the bar to aim for in security engineering. When you can find it, take it.

## 5. Static Analysis — Reading Code At Scale

Even with disciplined developers and a good framework, no human team reviews every line of every commit on every branch. **Static application security testing (SAST)**, often shortened to **static analysis**, runs an automated tool over source code (or compiled artifacts) to find bug patterns *without executing the program*. Static analyzers know about classes of bug — null dereferences, untrusted-data sinks, hardcoded secrets, unsafe deserialization, taint flowing from an HTTP parameter into a SQL string — and they flag suspicious patterns for human review.

Static analyzers range from simple linters (`eslint`, `pyflakes`) that catch style and obvious mistakes, through security-focused tools (Semgrep, CodeQL, SonarQube, Checkmarx, Fortify) that ship with rules for known vulnerability classes. The deeper tools perform **taint analysis**: they trace where data enters the program (sources — HTTP parameters, file reads, environment variables) through the call graph until it reaches a *sink* (a SQL execute, a `system()` call, an HTML render). If untainted-by-validation data reaches a sink, the tool reports a finding.

The strengths and weaknesses of static analysis are mirror images of each other. The strengths: it runs early (in the IDE, on every commit, in CI), it scales to millions of lines of code, it finds bugs without test inputs, and it documents a repeatable security baseline. The weaknesses: it is **noisy** (false positives are common, especially for complex frameworks), it cannot reason about runtime configuration or dynamic behavior, and it has trouble with reflection, dynamic dispatch, and code-loading patterns common in modern languages.

| Property | Static analysis (SAST) | Dynamic analysis (DAST) |
|---|---|---|
| Runs on | Source code or bytecode | Running application |
| Needs build artifact | No (source-level) or compiled | Yes — must be deployable |
| Coverage | Sees all paths in code | Sees only paths exercised by tests |
| False positive rate | Higher (sees infeasible paths) | Lower (only flags reproduced bugs) |
| False negative rate | Misses runtime-config bugs | Misses paths not exercised |
| Where in SDLC | Early — IDE, pre-commit, CI | Later — staging, pre-prod |

The practical workflow that emerges is: run a fast linter on every save, run a deeper SAST tool on every pull request, and triage findings into "must fix before merge," "fix in this sprint," and "false positive — suppress with comment." The triage discipline matters: a static analyzer that nobody reads is worse than no analyzer, because it gives the team false confidence while burying real findings in noise.

## 6. Dynamic Analysis — Watching The Code Run

**Dynamic application security testing (DAST)** runs the application and probes it from the outside, the same way an attacker would. A DAST tool sends crafted HTTP requests, fuzzes form inputs, walks the application looking for endpoints, and records how the application responds. It is the security analog of an integration test: it does not care about the source code, only about how the running system behaves.

DAST is good at finding bugs that arise from the *interaction* between components — a misconfigured TLS setting, an open admin endpoint, a missing authentication check on a side route, a verbose error page that leaks stack traces, a CSRF protection that is silently disabled in this environment. These are bugs static analysis tends to miss because they live in configuration, in deployment, or in the gap between two services.

The price is coverage. A DAST tool sees only the code paths that its test inputs reach. If a vulnerability lives behind an authentication wall the tool cannot pass, behind a feature flag the tool does not flip, or in a state the tool does not know how to reach, the tool will not see it. For this reason, DAST is usually combined with **interactive application security testing (IAST)** — agents that instrument the running application and report on what code actually executed during a DAST run, giving better coverage data and lower false positive rates.

A pragmatic SAST + DAST + IAST pipeline looks like this:

1. **Pre-commit:** linter and a fast SAST rule set in the IDE.
2. **Pull request:** full SAST scan, results posted to the PR with severity threshold gating merge.
3. **Nightly / on staging deploy:** DAST scan of the deployed staging environment, with IAST instrumentation collecting code-execution telemetry.
4. **Release gate:** dependency scan (Section 8) and security review sign-off (Section 12).

Many organizations omit one of these stages and pay for it later. The most commonly omitted stage is DAST against staging, because it requires a fully deployed environment and produces findings that nobody owns. Closing that gap — assigning a person, not just a tool — is one of the highest-leverage moves a security program can make.

## 7. Fuzzing — Letting The Machine Try Inputs You Did Not Imagine

**Fuzzing** is a class of dynamic testing in which a tool generates large quantities of malformed, random, or mutated inputs and feeds them to a target program, looking for inputs that cause crashes, hangs, or other observable misbehavior. Fuzzing is one of the most productive security-testing techniques ever invented: it has found tens of thousands of bugs in widely deployed software, including security-critical bugs in OpenSSL, the Linux kernel, browsers, and image-parsing libraries.

The classical fuzzer feeds random bytes to a program and watches for crashes. Modern fuzzers — AFL++, libFuzzer, Honggfuzz, Jazzer — are dramatically more effective because they are **coverage-guided**: they instrument the target binary, observe which code paths each input exercises, and prioritize inputs that reach new code. Over hours or days, this evolutionary loop drives the fuzzer toward inputs that exercise rarely-traversed paths, where bugs hide.

#### Diagram: Coverage-Guided Fuzzer Loop

<details markdown="1">
<summary>Interactive p5.js MicroSim of a coverage-guided fuzzer</summary>
Type: microsim
**sim-id:** fuzzer-coverage-loop<br/>
**Library:** p5.js<br/>
**Status:** Specified

A p5.js MicroSim that visualizes how a coverage-guided fuzzer explores a target program's code paths over time.

Layout (responsive canvas, default 720x520, resizes via `updateCanvasSize()`):

- **Left panel (40%)** — a stylized control-flow graph of a target function: ~25 basic blocks arranged in a tree with a few rare-path branches. Blocks start gray (uncovered). As inputs reach them, they fade to cybersecurity blue #1565c0. A handful of "deep" blocks are colored amber #ffa000 and represent rare paths where the bug lives.
- **Right panel (40%)** — a vertical "input corpus" stack. New inputs added by the fuzzer appear as small bars, with bar length representing input size. Bars that increased coverage are highlighted (cybersecurity blue); bars that did not are dim (gray).
- **Top bar** — a coverage gauge: percentage of basic blocks reached. Updates in real time.
- **Bottom controls** (p5.js builtins — `createSlider`, `createButton`, `createCheckbox`):
  - Slider: "Mutation aggressiveness" (1–10)
  - Slider: "Inputs per second" (1–50)
  - Checkbox: "Coverage-guided" — when off, the fuzzer reverts to pure random fuzzing for comparison
  - Button: "Reset"

Behavior:

- Each tick, the fuzzer picks a parent input from its corpus and mutates it.
- The mutated input "executes" through the graph (animation of a token traversing blocks).
- If the input reaches a previously uncovered block, it is added to the corpus and that block lights up.
- After ~30s in coverage-guided mode, the fuzzer should reach the amber block and a small "CRASH" animation plays.
- In pure-random mode, the amber block almost never gets reached — illustrating why coverage guidance matters.

Learning objective (Bloom — Analyze): compare the exploration behavior of coverage-guided versus random fuzzing and explain why coverage guidance dramatically reduces time-to-bug for deep code paths.

Responsive: panels stack vertically below 700px viewport.

Implementation: p5.js sketch, `canvas.parent(document.querySelector('main'))`, no external libraries. Use builtin p5 controls only.
</details>

Fuzzing is most effective on programs that parse complex inputs: file formats, network protocols, serialized data, regex engines, scripting interpreters. It is least effective on programs whose interesting bugs are in business logic — a fuzzer can find that your XML parser crashes on a particular malformed nesting, but it will not find that your authorization check uses `==` where it should use a constant-time comparison.

A practical fuzzing program looks like: identify the parsing entry points in your codebase, write a small **harness** for each that takes a byte buffer and feeds it to the parser, integrate the harness into a continuous fuzzing service (Google's OSS-Fuzz is the canonical example for open-source projects), and triage the crashes the fuzzer discovers. The cost is mostly upfront (writing the harnesses); after that, the fuzzer keeps finding bugs as long as you keep feeding it CPU.

!!! mascot-thinking "Fuzzing Inverts The Tester's Burden"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    Notice the asymmetry. A unit test asks "does the code work for the inputs *I* thought of?" A fuzzer asks "does the code survive all the inputs *I did not think of*?" The defender must cover every path; the attacker only needs one. Fuzzing is the cheapest way to make a machine think like the attacker.

## 8. Software Composition Analysis and Dependency Scanning

A modern application is mostly *not its own code*. A typical Node.js service has 1,000+ transitive dependencies. A typical Python application has 100+. Each of those dependencies has its own dependencies, its own maintainers, its own update cadence, and its own vulnerabilities. The discipline that addresses this reality is **software composition analysis (SCA)**: identifying every third-party component used by an application, mapping each to known vulnerabilities, and tracking license obligations.

The narrower term **dependency scanning** usually refers to the security half of SCA — checking your dependency manifest (`package-lock.json`, `requirements.txt`, `pom.xml`, `go.sum`, etc.) against vulnerability databases such as the National Vulnerability Database (NVD), the GitHub Advisory Database, and language-specific databases (npm advisories, RustSec, PyPI). When a dependency you use has a published CVE, the scanner reports the vulnerable package, the introduced version, the fixed version, and the severity.

Dependency scanning matters because most public-facing breaches in the last decade have routed through dependencies, not through hand-written code. The 2021 Log4Shell vulnerability in Apache Log4j sat in a logging library used by an enormous fraction of Java applications; an attacker who controlled any string that ended up in a log entry could trigger remote code execution. The vulnerability was a single line of unsafe deserialization in a transitive dependency that almost no one had directly imported. Without an inventory of dependencies — an SBOM, see Section 10 — most affected organizations spent days just figuring out *whether* they were exposed.

A dependency scanner produces output that is only useful if someone acts on it. Treat the scanner as a generator of *work items*, not as a solved problem:

- **Direct dependencies**: usually upgradable in a single pull request. Schedule.
- **Transitive dependencies**: may require lifting the version of a parent library. Track and prioritize.
- **No fix available**: requires either pinning to a forked version, removing the dependency, or compensating controls (WAF rule, network isolation). Rare but expensive.
- **False positive (vulnerability does not affect this code path)**: suppress with a comment that explains *why*, not just *that*, the suppression is safe.

The footgun in this area is treating the scanner output as fire-and-forget noise. A red dashboard that nobody reads is one breach away from a regulatory finding. Tying scanner findings to a SLA — "all critical CVEs in production dependencies must be patched within 14 days" — is what turns a tool into a program.

## 9. The Software Supply Chain — Trust Beyond Your Repo

The **software supply chain** is the chain of people, processes, and infrastructure that sits between *the code on a developer's screen* and *the binary running on a user's machine*. It includes source repositories, build servers, package registries, container registries, deployment pipelines, signing keys, and the maintainer accounts that hold privileges over each. Every link in this chain is a target.

Supply-chain attacks succeed because they exploit *transitive trust*. You trust your developers; your developers trust the build server; the build server trusts the package registry; the package registry trusts the maintainers of every package on it. An attacker who compromises any link earlier in the chain inherits the trust of every link downstream — often without any direct interaction with the target organization.

#### Diagram: A Modern Software Supply Chain

<details markdown="1">
<summary>Workflow diagram of the supply chain from developer keyboard to production user, with attack injection points</summary>
Type: workflow-diagram
**sim-id:** software-supply-chain-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A horizontal flow from left to right with nine nodes; attack-injection points marked with a red lightning bolt icon and labeled with a known incident.

1. **Developer Workstation** — local source code (lightning bolt: "compromised IDE plugin")
2. → **Source Repository (Git)** — version control (lightning bolt: "stolen credentials, malicious PR")
3. → **Dependency Registry (npm, PyPI, Maven)** — third-party libraries pulled in (lightning bolt: "typosquatting; event-stream 2018")
4. → **Build Server (CI/CD)** — turns source + deps into artifact (lightning bolt: "SolarWinds 2020")
5. → **Artifact Repository** — stores binaries / container images (lightning bolt: "registry account takeover")
6. → **Code Signing** — signature applied (lightning bolt: "stolen signing key")
7. → **Distribution** — package registry, app store, CDN (lightning bolt: "in-transit replacement")
8. → **Deploy / Update** — running on user infrastructure (lightning bolt: "malicious update; NotPetya 2017")
9. → **End User** — finally executes the code

Each node uses cybersecurity blue #1565c0. The lightning-bolt annotations use amber #ffa000. Hovering an annotation shows a 1-line incident summary.

Below the chain, a horizontal banner labeled "Defenses" lists controls aligned to each stage: SBOM (covers stages 3, 5, 9), code signing (stage 6, verified at 9), reproducible builds (stage 4), provenance attestations (stages 4–8, e.g., SLSA framework).

Learning objective (Bloom — Analyze): given a real-world supply-chain incident, identify which stage of the chain was compromised and which defenses would have detected or prevented it.

Responsive: chain wraps to two rows below 900px; attack annotations remain attached.

Implementation: Mermaid graph LR with custom node styling; tooltips via Mermaid `click` callbacks or a thin overlay layer.
</details>

The historical record of supply-chain attacks reads like a weather report of escalating storms. The 2017 **NotPetya** attack pushed malware through a legitimate update channel of Ukrainian accounting software, causing roughly $10 billion in global damage. The 2018 **event-stream** attack added a malicious child dependency to a wildly popular npm package, targeting a single cryptocurrency wallet downstream. The 2020 **SolarWinds** attack inserted a backdoor into the build pipeline of network-management software used by 18,000 organizations including U.S. federal agencies. The 2021 **Log4Shell** vulnerability turned a transitive logging dependency into a global emergency. The 2024 **xz-utils** attempt nearly succeeded in slipping a backdoor into a compression library bundled with most Linux distributions, caught only by a Microsoft engineer noticing a half-second of latency.

The lesson across all of these is that **software security is now a property of the supply chain, not just the code**. Defending against this class of threat requires three things: knowing what is in your software (Section 10), verifying that what you are running is what was built (Section 11), and reviewing changes — your own and those flowing in from upstream — with eyes open (Section 12).

!!! mascot-thinking "What's The Blast Radius Of A Library You Don't Maintain?"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    The hard mental shift in supply-chain security is recognizing that *the code in your repo is a small minority of the code that runs in your service*. Ask the same questions about your dependencies that you would ask about your own code: who can change this, how do I verify it has not been changed, and what is the blast radius if it is hostile?

## 10. SBOMs — A Bill of Materials For Software

A **Software Bill of Materials (SBOM)** is a structured, machine-readable inventory of every component included in a piece of software, including each component's name, version, supplier, license, and (often) cryptographic hash. The phrase is borrowed from manufacturing, where a bill of materials lists every part in a physical product so that any defective part can be traced quickly when a recall is needed.

The need became urgent during Log4Shell. Organizations spent the first 72 hours not patching, but *searching*: which of our applications use Log4j? Which version? Through which dependency? Did the vendor we bought this product from ship Log4j inside it? The teams that had SBOMs answered those questions in minutes; the teams that did not answered them in weeks. In May 2021, U.S. Executive Order 14028 made SBOMs a procurement requirement for software sold to the U.S. federal government, and the practice has since spread broadly.

Two SBOM standards dominate. **SPDX** (Software Package Data Exchange) is an ISO/IEC standard developed by the Linux Foundation, focused on license and component metadata. **CycloneDX** is a specification developed by OWASP, focused on security-relevant metadata including vulnerability assertions. Both are JSON or XML based, both are produced automatically by build tools (Syft, Trivy, language-specific tools), and both are interoperable enough that most modern security platforms accept either.

| SBOM field | What it answers | Why it matters |
|---|---|---|
| Component name + version | What is in this software? | Vulnerability lookup |
| Supplier / namespace | Who maintains it? | Trust assessment |
| License | What can we redistribute? | Legal compliance |
| Hash (SHA-256) | Is this *exactly* the right artifact? | Integrity verification |
| Dependency relationship | Which components depend on which? | Transitive impact analysis |
| PURL / CPE | Standardized identifier | Cross-tool correlation |

#### Diagram: SBOM as a Dependency Tree Explorer

<details markdown="1">
<summary>Interactive vis-network MicroSim that lets students explore an SBOM's transitive dependencies</summary>
Type: graph-data-model
**sim-id:** sbom-dependency-explorer<br/>
**Library:** vis-network<br/>
**Status:** Specified

An interactive graph visualization of a small-but-realistic application SBOM, rendered with vis-network in a responsive container (default 800x500, resizes on window resize).

Nodes (about 35 total):

- **Root application** (cybersecurity blue #1565c0, large): `my-web-app v1.4.2`
- **Direct dependencies** (slate steel #455a64, medium): ~8 nodes (e.g., `express`, `jsonwebtoken`, `lodash`, `axios`, `pg`, `winston`, `react`, `react-dom`)
- **Transitive dependencies** (light gray, small): ~25 nodes including a deliberately included `log4js@2.4.0` as a known-vulnerable example
- **Vulnerable nodes** (amber #ffa000 with red border): 2–3 nodes, each tagged with a CVE label visible on hover
- **Edges**: directed, from dependent to dependency, slightly y-offset on horizontal edges so labels render correctly (per the project's vis-network rendering note)

Controls (using p5-style buttons rendered as HTML buttons next to the canvas):

- **Filter:** "Show vulnerable only" — hides any node not reachable from the root through a vulnerable node
- **Filter:** "Show direct only" — hides transitive dependencies
- **Highlight path:** click any node to highlight the full transitive path from root
- **Search box:** find a component by name (allow-list filtered to alphanumerics)

Side panel (right side, 30% width on desktop, below canvas on mobile):

- Selected component name, version, license, hash (truncated)
- "Listed CVEs" with severity badge
- "Path from root" as an arrow-separated breadcrumb

Learning objective (Bloom — Apply): given a published CVE in a transitive dependency, locate the affected component in an SBOM and identify the path from the root application to the vulnerable component.

Responsive: side panel collapses below the network below 700px viewport.

Implementation: vis-network for the graph, vanilla JS for the side panel, fetch from a local `data.json` containing the SBOM in CycloneDX format. Note: apply the project's edge y-offset workaround for horizontal edges to avoid the label-rendering bug.
</details>

An SBOM is **not a security control** by itself — it does not stop an attacker — but it is the *prerequisite* for almost every other supply-chain control. Without it, you cannot quickly answer "are we exposed?" when the next Log4Shell-class vulnerability is announced. The 2026 maturity expectation is that an SBOM is generated automatically at build time, attached to the artifact (or stored adjacently), and consulted by both the security team and the vendor management process.

## 11. Code Signing — Verifying What You Are About To Run

**Code signing** is the cryptographic process of attaching a digital signature to a software artifact (a binary, a script, a container image, an installer) so that anyone who later receives the artifact can verify two things: that the artifact was produced by the holder of the signing key, and that it has not been modified since signing. Code signing uses the public-key signature primitives covered in Chapter 4, applied to the hash of the artifact.

The chain of trust runs as follows. A publisher generates a keypair and obtains a code-signing certificate from a Certificate Authority that has verified their identity. When the publisher releases an artifact, they sign its hash with the private key and attach (or publish) the signature alongside the artifact. A receiver — an operating system, a package manager, a Kubernetes admission controller — fetches the artifact and the signature, computes the hash, verifies the signature against the publisher's public key, and allows execution only if the verification succeeds.

Code signing addresses two distinct supply-chain threats. The first is **integrity in transit**: an attacker on the network or in a CDN cannot replace the artifact with a malicious version, because the substituted artifact will not have a valid signature from the legitimate publisher. The second is **provenance**: a receiver can refuse to run any code that was not signed by an approved publisher, drastically narrowing the set of binaries that can run on a hardened endpoint or in a Kubernetes cluster.

Modern code signing is moving from per-publisher long-lived keys (with their attendant key-management burden and theft risk — see SolarWinds) toward **transparency-logged**, **short-lived**, **identity-bound** signing. The reference implementation in the open-source ecosystem is the **Sigstore** project, including its `cosign` tool, which uses ephemeral keys tied to OIDC identities and records every signing event in a public, append-only log (Rekor). The transparency log means that even if a signing identity is misused, the misuse is publicly visible and auditable after the fact.

| Signing approach | Key lifetime | Where the trust comes from | Audit log |
|---|---|---|---|
| Long-lived keypair + CA certificate | Years | CA's identity verification | Per-CA, often internal |
| Short-lived ephemeral key + OIDC identity (Sigstore) | Minutes | OIDC provider's identity | Public transparency log (Rekor) |
| Self-signed (no CA) | Variable | None — trust is asserted, not verified | None |

Verification is where most signing programs go wrong. It is straightforward to *sign* artifacts; it is much harder to *verify* signatures on every host that runs them, and to make the verification a hard gate rather than an advisory log line. The "I signed everything but verification was disabled" failure mode is common and silent — exactly the footgun shape of a default that flips behavior when accidentally omitted.

## 12. Secure Code Review — Humans In The Loop

The final layer is the human one. **Secure code review** is the deliberate examination of source-code changes by a person other than the author, with the explicit goal of identifying security-relevant defects: missed validations, weakened access checks, hardcoded secrets, dangerous APIs, broken cryptographic patterns, and the dozens of subtler smells the automated tools cannot catch.

Secure code review is *complementary* to static analysis, not redundant with it. Tools find pattern-based defects across a large surface; humans find intent-based defects that require judgment about *what the code is supposed to do*. A SAST tool can detect that a string flows from an HTTP parameter into an SQL execute call; only a human reviewer can decide whether the new endpoint that introduces this pattern is a legitimate feature, an accidental backdoor, or a malicious insertion.

A modern code-review process pairs the human review with automation: the SAST run, the dependency scan, and the test suite all post their results into the pull request, and the human reviewer reads those results alongside the diff. The reviewer is then doing higher-leverage work: confirming that the threat model still holds, that any new trust boundary is actually validated, that any new use of a sensitive API has a justifying comment, and that the test coverage exercises the security-relevant paths.

A useful checklist for the human reviewer to keep in mind, organized by trust boundary:

- **At every input boundary**: is the new data validated against an allow-list before it is used?
- **At every output boundary**: is data being written to a context (HTML, SQL, shell) where it must be encoded for that context?
- **At every authorization boundary**: is the access check present, performed *before* the action, and based on the user's identity rather than any user-supplied parameter?
- **At every secret use**: is the secret pulled from configuration (a vault, an env var) rather than hardcoded? Does any new logging or error path leak it?
- **At every cryptographic call**: is a high-level primitive being used (AEAD, library-provided KDF) rather than a low-level one being assembled by hand?
- **At every dependency change**: is the new package known? Has its license been reviewed? Has SCA been re-run?
- **At every test that covers a security path**: is the test exercising the *real* behavior, or has the security check been mocked out for convenience?

The last bullet hides one of the most insidious footguns in the field: a developer mocks out the authentication or authorization check "to make the test simpler," the test passes, the mock survives the code review, and the production code now has an untested security boundary. **Mocking a security control in a test that purports to verify it is the same as having no test.** The fix is structural — keep security-control tests hermetic and unmockable, or use integration tests that exercise the real control end-to-end.

!!! mascot-tip "Two Habits That Make Code Review Pay"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sentinel offering a tip">
    Two habits change the return on a code review. First, *small diffs*: a 20-line PR gets a real review; a 2,000-line PR gets a rubber stamp. Second, *blameless tone*: the goal is to find bugs, not to find fault. Reviewers who feel safe to flag a "stupid question" find the bugs whose ownership is unclear — which are usually the bugs that bite production. Least privilege, by default; review by default; merge only when both have run.

## 13. Putting It All Together — The Assurance Pipeline

A mature software-assurance program composes the techniques in this chapter into a single pipeline that runs continuously, not as a quarterly audit. The pipeline binds a developer's commit to a set of automated and human gates, each of which catches a specific class of bug, and produces an auditable record at each stage.

A representative pipeline looks like:

1. **Pre-commit hook** — fast linter; secrets scanner; reject obvious issues without a CI round-trip.
2. **Pull request opens** — full SAST; dependency scan; reviewer assigned; tests run.
3. **Pull request approved + merged** — build server compiles, runs unit tests, generates SBOM, signs the artifact with an ephemeral Sigstore identity.
4. **Staging deploy** — DAST run against the staging environment; IAST telemetry collected.
5. **Release gate** — security review sign-off if any high-severity finding is open; SBOM and signature attached to the release record.
6. **Production deploy** — admission controller verifies signature against expected publisher identity; refuses to run unsigned or unrecognized artifacts.
7. **Continuous** — fuzzing service runs against parsing surfaces; SCA continuously rechecks deployed SBOMs against newly published CVEs; on a critical CVE match, the inventory immediately tells the team which services to patch.

Each step is independently weak; together they provide depth. A bug that defeats input validation may still be caught by static analysis. A bug that defeats static analysis may still be caught by a fuzzer. A malicious dependency that defeats human review may still be detected after publication when an SBOM is correlated against a new advisory. A compromised build server may still be caught when the produced artifact fails a signature policy at deploy time. **The point of the pipeline is not that any one stage is bulletproof — it is that every stage of an attack must defeat a different control.**

!!! mascot-celebration "What You Can Now Do"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sentinel celebrating">
    You can now read a software-assurance program — your team's, a vendor's, a published incident report — and identify which layers exist, which are missing, and which ones failed in a given breach. You can name the structural fix for SQL injection, distinguish SAST from DAST from fuzzing, explain why an SBOM matters and what code signing does and does not buy you. That is the foundation Chapter 7 builds on as we move from software to the components — hardware, firmware, embedded systems — that software runs on.

## Key Takeaways

- **Three layers compose into a defensible program**: in-code defenses (input validation, output encoding, parameterized queries), automated analysis (SAST, DAST, fuzzing), and supply-chain controls (SCA, SBOM, code signing).
- **Allow-listing beats deny-listing**, **server-side beats client-side**, and **rejecting beats auto-fixing** — every time, on every input boundary.
- **Output encoding must match the destination context** (HTML body, HTML attribute, JS string, URL, CSS); a single value placed into multiple contexts may need different encodings.
- **Parameterized queries make SQL injection impossible by construction** — a structural fix, not a deny-list. The same separation-of-code-and-data pattern generalizes to shell commands and DOM operations.
- **SAST and DAST are complementary, not substitutes**: SAST sees all paths but with false positives; DAST sees only exercised paths but reproduces real bugs. Run both. Add fuzzing for parsing-heavy code.
- **Most modern code is not your code** — software composition analysis and dependency scanning are now table stakes. SBOMs make "are we exposed?" answerable in minutes instead of weeks.
- **Code signing protects integrity and provenance**, but only if verification is enforced at deploy time. Sigstore-style transparency-logged ephemeral signing is the modern direction.
- **Human secure code review remains essential** for intent-based defects automation cannot see. Small diffs, blameless tone, and never mocking security controls in their own tests.
- **The assurance pipeline is the unit of defense**, not any single tool — every attack stage must defeat a different control.
