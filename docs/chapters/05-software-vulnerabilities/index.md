---
title: "Software Vulnerabilities and Secure Coding"
description: "Covers the secure software development lifecycle and the most consequential vulnerability classes: OWASP Top Ten, CWE Top 25, memory-safety bugs, injection attacks, deserialization, race conditions, broken access control, and security misconfiguration."
generated_by: claude skill chapter-content-generator
date: 2026-04-25 11:20:30
version: 0.07
---

# Software Vulnerabilities and Secure Coding

## Summary

Covers the secure software development lifecycle and the most consequential vulnerability classes: OWASP Top Ten, CWE Top 25, memory-safety bugs (buffer/stack/heap/integer overflows, format-string), injection attacks (SQL, command, XSS variants, CSRF, SSRF), insecure deserialization, race conditions, broken access control, and security misconfiguration.

## Concepts Covered

This chapter covers the following 26 concepts from the learning graph:

1. Secure SDLC
2. Secure Design
3. Secure Coding
4. OWASP Top Ten
5. CWE Top 25
6. Buffer Overflow
7. Stack Overflow
8. Heap Overflow
9. Integer Overflow
10. Format String Bug
11. Injection Attack
12. SQL Injection
13. Command Injection
14. Cross-Site Scripting
15. Stored XSS
16. Reflected XSS
17. DOM-Based XSS
18. CSRF
19. SSRF
20. Insecure Deserialization
21. Race Condition
22. TOCTOU
23. Broken Access Control
24. Broken Authentication
25. Security Misconfiguration
26. Sensitive Data Exposure

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Security Foundations: Properties, Mindset, and Risk](../01-security-foundations/index.md)
- [Chapter 2: Threats, Vulnerabilities, and Security Controls](../02-threats-and-controls/index.md)

---

!!! mascot-welcome "Welcome to Software Security"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    Welcome. The previous chapters armed you with cryptographic primitives that, used correctly, are essentially unbreakable. This chapter is about the layer above them — the application code where most real breaches actually happen. We will catalogue the bug classes that the industry has been making, and patching, for decades. Trust, but verify — because the compiler will not.

## 1. Why Software Is Where Breaches Happen

Cryptography, configured correctly, is rarely the weak link in a system. The weak link is the application code that calls the cryptographic library, parses untrusted input, talks to the database, renders the HTML, deserializes the cookie, and decides who is allowed to do what. A 2048-bit RSA key does not help when the login endpoint accepts `' OR 1=1 --` as a valid password. A perfectly tuned firewall does not help when a single endpoint reflects user input back into the page without escaping. The breaches that make the news — Equifax, Capital One, MOVEit, Log4Shell — are almost always *software bugs* in the application layer, not failures of cryptographic primitives.

The good news is that the bug classes are *not* infinite. The vast majority of exploitable vulnerabilities fall into a few dozen well-known patterns, catalogued and ranked by the security community for more than two decades. If you can recognize these patterns in your own code, you can eliminate most of the risk surface before an attacker ever sees the system. That is the work of this chapter.

We will move from process (how to build software securely) through the canonical vulnerability lists (what to look for) and into the specific bug classes that account for the lion's share of real-world incidents. Each class will be presented with: what it is, how an attacker exploits it, what makes the underlying language or framework vulnerable to it, and the structural fix that makes it impossible rather than "fixed for now."

## 2. The Secure Software Development Lifecycle

The **Secure Software Development Lifecycle (SSDLC, sometimes "Secure SDLC")** is the practice of integrating security activities into every phase of software development, rather than bolting on a security review at the end. The traditional SDLC has phases like requirements, design, implementation, testing, deployment, and maintenance. The SSDLC adds matching security activities to each:

- **Requirements** — capture security requirements alongside functional ones (authentication, authorization, data classification, regulatory constraints, abuse cases)
- **Design** — perform threat modeling, define trust boundaries, choose secure architectural patterns
- **Implementation** — apply secure coding standards, use safe libraries and frameworks, perform peer review
- **Testing** — run static analysis (SAST), dynamic analysis (DAST), software composition analysis (SCA), and fuzzing
- **Deployment** — harden the environment, manage secrets, enable telemetry
- **Maintenance** — track CVEs in dependencies, run vulnerability scans, respond to disclosures

The cost economics of SSDLC are well-studied and consistent across decades of research: a vulnerability caught in design costs perhaps an hour to fix; the same vulnerability caught in production after exploitation can cost months of incident response, regulatory penalties, and lost customer trust. Industry studies (notably IBM's annual *Cost of a Data Breach* report) have repeatedly placed the cost ratio at roughly 100x between "fix in design" and "fix after breach."

#### Diagram: Cost of Fixing a Bug Across SDLC Phases

<details markdown="1">
<summary>Bar chart showing the relative cost of fixing a vulnerability at each phase of the SDLC</summary>
Type: chart
**sim-id:** ssdlc-cost-curve<br/>
**Library:** Chart.js<br/>
**Status:** Specified

A horizontal bar chart with phases on the y-axis and relative cost on the x-axis (logarithmic scale).

Bars (top to bottom):

- **Requirements**: 1x (lightest blue)
- **Design**: 2x
- **Implementation**: 5x
- **Testing**: 10x
- **Deployment**: 30x
- **Production (post-incident)**: 100x (darkest blue, with red border)

Title: "Relative cost of remediating a security defect by phase discovered."

Subtitle: "Catching bugs early is roughly 100x cheaper than catching them after a breach."

Color palette: cybersecurity blue gradient (`#bbdefb` to `#0d47a1`), with the production bar bordered in alert amber (`#ffa000`).

Hovering on each bar shows: phase name, typical activities ("threat modeling", "code review", "fuzzing", "incident response"), and an example cost driver.

Responsive: rotates to vertical layout below 600px viewport. Title remains visible.

Implementation: Chart.js horizontal bar chart with logarithmic x-axis and custom tooltip callbacks.
</details>

### 2.1 Secure Design

**Secure design** is the practice of choosing architectures and patterns that make whole classes of vulnerability impossible, rather than relying on each developer to remember every rule. A few canonical secure-design practices appear repeatedly in the rest of this chapter:

- **Trust boundaries** — explicitly mark the points in your system where data crosses from less-trusted to more-trusted contexts (the network, the user, a third-party service). Validation and authorization happen *at* the boundary.
- **Least privilege** — every component runs with the minimum permissions it needs to do its job. A web server does not need root; a microservice does not need full database access; a build job does not need production credentials.
- **Defense in depth** — assume any single control will fail and stack independent controls so that no single failure is fatal. Input validation *and* parameterized queries *and* a least-privileged database account *and* monitoring.
- **Fail secure (fail closed)** — when something goes wrong, the default behavior should be to deny access, not to grant it. An authorization check that throws an exception should result in 403, not 200.
- **Open design** — security should not depend on the secrecy of the design. Security should depend on the secrecy of *keys* and *credentials* (Kerckhoffs's principle, generalized).

### 2.2 Secure Coding

**Secure coding** is the practice of writing implementation-level code that is robust against the bug classes we will catalogue in this chapter. Most modern organizations adopt a written secure coding standard — CERT Secure Coding Standards (for C, C++, Java), OWASP Secure Coding Practices, or a language-specific style guide that incorporates security rules. The standard codifies defaults: how to handle input, how to call cryptographic libraries, how to log without leaking secrets, how to construct database queries.

The single most important shift in modern secure coding has been the move toward **memory-safe languages** (Rust, Go, Java, C#, Python, JavaScript). Memory-safe languages eliminate, by construction, an entire class of bugs that we will examine in section 4 — buffer overflows, use-after-free, double-free. Microsoft and Google have both reported that approximately 70% of historical security bugs in their large C/C++ codebases were memory-safety bugs that simply could not exist in Rust or Go. The U.S. government's Cybersecurity and Infrastructure Security Agency (CISA) and the NSA have publicly recommended memory-safe languages as a strategic mitigation for new development.

## 3. The Canonical Vulnerability Lists

Two industry-maintained lists organize the bulk of known vulnerability patterns. Knowing both is part of the working vocabulary of every security engineer.

The **OWASP Top Ten** is a list maintained by the Open Worldwide Application Security Project. It is updated every few years (most recently 2021, with 2024 candidates in review at the time of writing) and ranks the most critical *web application* security risks by a combination of exploitability, prevalence, detectability, and impact. The list is grouped by *risk category* rather than by individual bug — for example, "A03: Injection" covers SQL injection, command injection, LDAP injection, and many others, all of which share a structural cause.

The **CWE Top 25** is maintained by MITRE and ranks the most dangerous *software weaknesses* from the much larger Common Weakness Enumeration (CWE) catalog. CWE entries are more granular than OWASP categories — CWE-79 is specifically Cross-Site Scripting, CWE-89 is specifically SQL Injection, CWE-787 is specifically Out-of-Bounds Write — and the Top 25 is derived from real CVE data over the prior two years, weighted by exploitability and impact.

The two lists overlap heavily but serve different purposes. OWASP Top Ten is a *teaching and prioritization* list for web application teams; CWE Top 25 is a *taxonomy and tracking* list used by static analysis tools, vulnerability databases, and government procurement standards.

The 2021 OWASP Top Ten, in rank order, is the framing scaffold for the rest of this chapter:

| Rank | Category | Representative bug class |
|------|----------|--------------------------|
| A01 | Broken Access Control | Missing authorization, IDOR, privilege escalation |
| A02 | Cryptographic Failures | Weak ciphers, missing TLS, exposed PII |
| A03 | Injection | SQLi, command injection, XSS |
| A04 | Insecure Design | Missing threat model, abuse-case blindness |
| A05 | Security Misconfiguration | Default creds, exposed admin panels, verbose errors |
| A06 | Vulnerable & Outdated Components | Unpatched libraries (e.g., Log4Shell) |
| A07 | Identification & Authentication Failures | Weak passwords, broken session management |
| A08 | Software & Data Integrity Failures | Insecure deserialization, unsigned updates |
| A09 | Security Logging & Monitoring Failures | Silent compromise, no detection |
| A10 | Server-Side Request Forgery | SSRF |

We will work through the most consequential of these in turn, plus the memory-safety class that the OWASP list does not explicitly call out (because OWASP focuses on web apps, where memory safety is usually handled by the runtime).

!!! mascot-thinking "Patterns, Not Incidents"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    Notice that the OWASP and CWE lists are organized by *pattern*, not by incident. The same structural mistake — trusting input that crosses a trust boundary — produces SQL injection, command injection, XSS, SSRF, deserialization bugs, and path traversal. Learn the pattern once and you will recognize it in every form it takes.

## 4. Memory-Safety Vulnerabilities

The first family of bugs we examine arises from languages — primarily C and C++ — that allow direct manipulation of memory without bounds checking. These languages are still pervasive in operating system kernels, browsers, network daemons, embedded firmware, and high-performance libraries. They are also the historical home of the most severe and most exploitable vulnerabilities ever cataloged.

### 4.1 Buffer Overflow

A **buffer overflow** occurs when a program writes data beyond the end of an allocated buffer (an array, a struct, a heap block) into adjacent memory. The corrupted memory may contain other variables, control flow data (function pointers, return addresses), or heap metadata. By choosing the input carefully, an attacker can use a buffer overflow to alter control flow — redirecting execution to attacker-controlled code or to existing code reused for malicious purposes (return-oriented programming).

The classic example, distilled, is a C function that copies a fixed-size input into a smaller fixed-size buffer without checking the length. Before we examine the code, the key C functions to know are: `strcpy(dest, src)`, which copies bytes from `src` into `dest` until it hits a null terminator (with no length check); and `gets(buf)`, which reads a line of input into `buf` (also with no length check, and so dangerous that it was removed from the C standard in C11).

```c
void greet(char *name) {
    char buffer[16];
    strcpy(buffer, name);   // No length check!
    printf("Hello, %s\n", buffer);
}
```

If `name` is longer than 16 bytes, `strcpy` keeps writing past the end of `buffer`, into whatever is on the stack next — typically the saved frame pointer and the return address. An attacker who can control `name` can overwrite the return address to point at code of their choosing.

### 4.2 Stack Overflow vs. Heap Overflow

A **stack overflow** is a buffer overflow that occurs in a buffer allocated on the *stack* — typically a local variable inside a function. Stack-based overflows are the classic exploitation target because the stack contains the saved return address that the function will jump to when it finishes; overwriting that return address gives the attacker control of the program counter.

A **heap overflow** is a buffer overflow that occurs in a buffer allocated from the *heap* via `malloc()` or `new`. Heap overflows do not directly overwrite a return address, but they can corrupt heap metadata (the data structures the allocator uses to track free blocks) or adjacent objects (whose function pointers can later be invoked). Modern heap allocators include hardening to make pure metadata-corruption attacks harder, but heap overflows remain regularly exploitable.

The defenses against both are the same general pattern: bounds-checking input, using safer string functions (`strncpy`, `strlcpy`, `snprintf`), enabling compiler protections (stack canaries, ASLR, DEP/NX), and — most decisively — moving to memory-safe languages where the bug class does not exist.

#### Diagram: Stack Layout During a Buffer Overflow

<details markdown="1">
<summary>Annotated diagram showing stack memory before and after a buffer overflow corrupts the return address</summary>
Type: infographic-svg
**sim-id:** stack-overflow-anatomy<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A side-by-side comparison of two stack frames, drawn vertically with high addresses at the top and low addresses at the bottom (the conventional stack-grows-down orientation).

**Left panel: "Normal call"**

From top to bottom of the stack frame:
- Caller's stack (greyed out)
- Return address (slate `#455a64`, labeled "Return address: 0x4011d3")
- Saved frame pointer (slate)
- `buffer[16]` (16 cells, white, contents: "Hello\0...")
- Stack pointer arrow at bottom

**Right panel: "Overflow"**

Same layout, but:
- `buffer[16]` is fully filled with "AAAA..." in red (`#d84315`)
- Saved frame pointer is overwritten with "AAAA" in red
- Return address is overwritten with attacker-chosen address "0xdeadbeef" in red
- An annotation arrow points from the return address to "→ now jumps to attacker code (shellcode or ROP chain)"

A caption below: "When the function returns, the CPU pops the (corrupted) return address and jumps to attacker-controlled memory."

Hovering on each cell shows the byte address and what defenses (stack canary, ASLR, DEP) would have stopped it.

Color palette: slate steel for normal stack contents, rust orange/red for attacker-controlled bytes, cybersecurity blue for annotations.

Responsive: panels stack vertically below 700px.

Implementation: Static SVG with `<title>` tooltips on each labeled region.
</details>

### 4.3 Integer Overflow

An **integer overflow** occurs when an arithmetic operation produces a result that cannot be represented in the destination type — for example, multiplying two 32-bit integers and getting a result larger than 2³² − 1. In C, signed integer overflow is *undefined behavior* (the compiler may legally do anything); unsigned integer overflow wraps around silently. In either case, the program continues with a number that is not the mathematically correct answer, and security bugs follow.

The most consequential pattern is an integer overflow used to size a buffer allocation. A common pattern: read a count from the network, multiply by the size of an element, allocate that many bytes, then read that many elements. If the multiplication overflows, the allocation is too small but the loop still reads the original count of elements — producing a heap overflow seeded by an integer overflow several lines earlier. CVE-2002-0639 (the OpenSSH challenge-response overflow) and many others fit this shape.

### 4.4 Format String Bug

A **format string bug** is a vulnerability in C's printf-family functions when an attacker controls the *format string* argument rather than just the data arguments. The format string contains directives like `%s` (read a string from the next argument), `%x` (read a hex integer), and the more dangerous `%n` (write the count of bytes printed so far to the address pointed to by the next argument). If an attacker can supply the format string, they can read process memory (`%x %x %x ...`), determine where things are in memory (defeating ASLR), and write to arbitrary memory locations (`%n`).

```c
printf(user_input);              // Vulnerable: user controls format string
printf("%s", user_input);        // Safe: user input is data, not format
```

The structural fix is non-negotiable: never let untrusted input become the format string. Modern compilers warn on this pattern; modern static analyzers flag it; and most modern languages do not expose the bug in the same form (Python's old `%` formatting is type-checked; Rust's `format!` is a macro that requires a literal format string).

!!! mascot-warning "Memory-Unsafe Languages Are Strategic Risk"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel showing caution">
    Buffer, stack, heap, integer, and format-string bugs share one root cause: a language that lets the program write to memory it does not own. Approximately 70% of the severe vulnerabilities patched in Chrome and Windows over the last two decades are memory-safety bugs. For new code where you have a choice, choose Rust, Go, Swift, or another memory-safe language. Defense in depth.

## 5. Injection Attacks

The second great family of software vulnerabilities is **injection**. An injection attack is any vulnerability where untrusted input is concatenated into a command or query that is then interpreted by another component — a database, a shell, a browser, an LDAP server, an XML parser. The interpreter cannot distinguish the original (trusted) command structure from the (untrusted) input, so input that contains the interpreter's own metacharacters can change the meaning of the command.

The structural fix for the entire injection family is the same: do not build commands by string concatenation. Use an API that *separates* the command structure from the data — parameterized queries for SQL, parameter arrays for shell execution, contextual escaping for HTML output, structured deserializers instead of pickle. The principle is: **data and code should travel in different lanes**.

### 5.1 SQL Injection

**SQL injection (SQLi)** occurs when untrusted input is interpolated into a SQL query string. Consider a login function:

```python
# VULNERABLE
query = "SELECT * FROM users WHERE username='" + user + "' AND password='" + pw + "'"
db.execute(query)
```

If the attacker submits `user = "admin' --"`, the resulting query becomes:

```sql
SELECT * FROM users WHERE username='admin' --' AND password='whatever'
```

The `--` is a SQL comment, so the password check is removed and the attacker logs in as admin. More aggressive payloads can exfiltrate the entire user table, drop tables, or, in some configurations, achieve OS command execution via database functions.

The structural fix is **parameterized queries** (also called *prepared statements*). The query string contains placeholders (`?` or named parameters), and the database driver substitutes the input values into the *data slots* without ever letting them affect the *query structure*:

```python
# SAFE
query = "SELECT * FROM users WHERE username = ? AND password = ?"
db.execute(query, (user, pw))
```

Every modern database driver supports parameterized queries. Object-relational mappers (SQLAlchemy, Django ORM, Hibernate) use them internally for any query you build through the ORM — the danger zones are raw query escape hatches and dynamic table/column names, which parameterization cannot help with. For those, use an allow-list of legal identifiers.

### 5.2 Command Injection

**Command injection** is the shell-execution version of SQL injection. The vulnerable pattern is constructing a shell command by concatenating user input and passing the result to a function that invokes a shell:

```python
# VULNERABLE
os.system("ping -c 1 " + user_supplied_host)
```

If the attacker supplies `8.8.8.8; rm -rf /`, the shell executes both commands. The metacharacters `;`, `&&`, `|`, `` ` ``, and `$()` all change the meaning of the command line.

The structural fix is to bypass the shell entirely. Most languages offer an API that takes the executable name and a list of arguments separately, with no shell interpretation — `subprocess.run(["ping", "-c", "1", host], shell=False)` in Python, `exec.Command("ping", "-c", "1", host)` in Go. The arguments are passed directly to the OS `execve()` syscall as separate strings; shell metacharacters in `host` are just bytes in an argument and have no special meaning.

### 5.3 Cross-Site Scripting (XSS)

**Cross-Site Scripting (XSS)** is injection into the *browser* — the attacker gets the victim's browser to execute attacker-supplied JavaScript in the security context of the vulnerable site. The attacker's script then has access to the victim's cookies, can read and modify the page, can make requests as the victim, and can capture keystrokes. XSS is consistently in the OWASP Top Ten and CWE Top 25 because it is everywhere and devastating.

XSS comes in three subtypes, which differ in *where the malicious script enters the page*.

**Stored XSS** (also called *persistent XSS*) occurs when the attacker's payload is *stored* on the server (in a database, a file, a cache) and *served to other users* on a later request. A comment field on a forum that does not escape HTML, where an attacker posts `<script>...</script>`, will execute that script for every subsequent reader. Stored XSS is the most serious subtype because a single injection compromises every visitor to the page.

**Reflected XSS** occurs when the attacker's payload is included in a request (typically a URL parameter) and *reflected* back into the response page without escaping. The attacker tricks the victim into clicking a crafted URL — by phishing, by posting it in a forum, by embedding it in an ad — and the victim's browser receives a page with the script in it. Reflected XSS requires social engineering to deliver the payload, but works against any visitor who clicks the link.

**DOM-based XSS** occurs entirely in the browser, with no server-side involvement. The vulnerable site has client-side JavaScript that reads from a *source* (the URL fragment, `document.location`, `window.name`) and writes it into a *sink* (`innerHTML`, `eval`, `document.write`) without sanitizing. The server never sees the payload — it lives in the URL fragment after the `#`, which browsers do not send to the server. This makes DOM XSS invisible to traditional server-side scanning and logging.

#### Diagram: Three Flavors of XSS

<details markdown="1">
<summary>Comparison diagram showing stored, reflected, and DOM-based XSS data flow</summary>
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
</details>

The structural defenses against XSS, in order of robustness:

- **Contextual output encoding** — escape user data appropriately for the context where it will be rendered (HTML body, HTML attribute, JavaScript string, CSS, URL). Modern templating engines (Jinja2, React JSX, Vue templates, Django templates) escape by default and require an explicit "trust me" annotation to disable escaping.
- **Content Security Policy (CSP)** — an HTTP response header that tells the browser which script sources to trust. A strict CSP can refuse to execute inline scripts entirely, neutralizing most XSS payloads even if the encoding fails.
- **Input validation** — accept only the characters that make sense for the field. Useful as defense in depth, but never sufficient on its own (rejecting `<` will not stop every payload).

### 5.4 Cross-Site Request Forgery (CSRF)

**Cross-Site Request Forgery (CSRF)** is closely related to XSS in name but different in mechanism. In CSRF, the attacker tricks the victim's browser into sending a *state-changing request* to a site where the victim is already logged in. The attacker does not need to read the response; they only need the request to be processed.

The classic example: a banking site has an endpoint `POST /transfer` that takes `to` and `amount`. The victim is logged in (session cookie present). The attacker creates a malicious page containing a form auto-submitted via JavaScript:

```html
<form action="https://bank.example/transfer" method="POST">
  <input name="to" value="attacker">
  <input name="amount" value="10000">
</form>
<script>document.forms[0].submit();</script>
```

When the victim visits the malicious page, the browser submits the form to the bank, *automatically attaching the bank's session cookie*, because that is how cookies work. The bank sees an authenticated request and processes the transfer.

The structural fixes are well-understood: **anti-CSRF tokens** (a per-session unpredictable token included in every state-changing form, validated on the server), **SameSite cookies** (a cookie attribute that tells the browser not to send the cookie on cross-site requests; modern browsers default to `SameSite=Lax`), and **requiring re-authentication** for sensitive operations.

### 5.5 Server-Side Request Forgery (SSRF)

**Server-Side Request Forgery (SSRF)** is injection at the *outbound* request. A web application accepts a URL from the user (image fetch, webhook, PDF generator, URL preview) and fetches that URL from the *server*. If the server has access to internal resources that the user does not — cloud metadata services (`http://169.254.169.254/`), internal admin panels, databases on private networks — the attacker can use the server as a confused deputy to reach them.

The Capital One breach in 2019 was a high-profile SSRF exploit: an attacker made the application fetch `http://169.254.169.254/latest/meta-data/iam/security-credentials/`, the AWS instance metadata endpoint, which returned temporary IAM credentials with read access to the S3 buckets containing customer data.

Defenses include allow-listing the destinations the application is permitted to fetch (no arbitrary URLs), refusing to follow redirects to private IP ranges, and — at the infrastructure layer — using IMDSv2 on AWS, which requires a session token that defeats most SSRF patterns against the metadata service.

!!! mascot-tip "The Injection Family Has One Cure"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Sentinel offering a tip">
    SQL injection, command injection, XSS, and SSRF look different but share one cure: separate code from data. Parameterized queries, argument arrays instead of shell strings, contextual encoding, and URL allow-lists are all the same idea. When you design an API that takes user input, ask: where does this data turn into code, and what keeps the boundary intact?

## 6. Insecure Deserialization

**Insecure deserialization** is the vulnerability that arises when an application deserializes attacker-controlled bytes into in-memory objects using a serialization format that allows arbitrary code execution during the deserialization process itself. Java's native serialization, Python's `pickle`, PHP's `unserialize`, and Ruby's YAML parsing have all had this property; consequently, all four have produced a long stream of remote-code-execution CVEs.

The mechanism is subtle. These serialization formats encode not just data but also *which classes the data belongs to* and *which methods to invoke during reconstruction* (constructors, `__reduce__`, `readObject`). An attacker who can supply the byte stream can specify any class available on the application's classpath, including classes whose construction has side effects — running shell commands, opening network connections, modifying files. A "gadget chain" of legitimate library classes can be assembled to achieve full remote code execution from a single deserialization call.

The structural fix is to never deserialize untrusted input with a code-executing format. Use a *data-only* format like JSON, MessagePack, or Protocol Buffers, and deserialize into specific schemas. If you must use a code-capable serializer (e.g., for legacy compatibility), deserialize only inside a hardened context with class allow-lists.

The 2017 Apache Struts 2 CVE that led to the **Equifax breach** was, at root, an insecure-deserialization-style flaw in an XML parser; the 2021 **Log4Shell** vulnerability was a different shape (a logging library that performed JNDI lookups on attacker-controlled strings) but exhibits the same structural failure: untrusted data was passed to a component that interpreted it as code.

## 7. Race Conditions and TOCTOU

A **race condition** is a vulnerability where the correctness of a program depends on the relative timing of multiple concurrent operations, and an attacker can manipulate the timing to violate the program's invariants. Race conditions are notoriously hard to test for because they are non-deterministic; they typically reveal themselves under high concurrency, in production, often years after deployment.

The most security-relevant race-condition pattern is **TOCTOU (Time-of-check to time-of-use)**. The application checks a property of a resource at time T1 (is this file world-writable? is the user authorized to read this path?) and acts on the resource at time T2, assuming the property still holds. Between T1 and T2, an attacker who can manipulate the resource changes it — replacing the file with a symbolic link to `/etc/passwd`, or changing the directory the path resolves to — and the application performs the action on the *substituted* resource.

A canonical TOCTOU example, in pseudocode:

```c
if (access(filename, R_OK) == 0) {  // check at T1
    fd = open(filename, O_RDONLY);   // use at T2
    // attacker replaced filename with a symlink between T1 and T2
}
```

The structural fix for filesystem TOCTOU is to perform the check and the use *atomically*, on a *handle to the resource* rather than a path that can be redirected. On POSIX, that means using `openat`, file descriptors, and `O_NOFOLLOW`; on Windows, file handles and `FILE_FLAG_OPEN_REPARSE_POINT`. For higher-level race conditions (database state, application state), the fix is transactions, locks, or compare-and-swap operations that make the check and the action a single atomic unit.

#### Diagram: A TOCTOU Race Condition

<details markdown="1">
<summary>Sequence diagram showing how an attacker can race between a permission check and a file operation</summary>
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
</details>

## 8. Broken Access Control and Authentication

**Broken Access Control** is OWASP's top-ranked risk in 2021 — the most common and most impactful category in modern web applications. The category covers any failure where the application does not correctly enforce *who is allowed to do what*. Common patterns include:

- **Insecure Direct Object References (IDOR)** — `/api/orders/12345` returns the order, but the application never checks that the requesting user owns order 12345. Changing the ID in the URL exposes other users' data.
- **Vertical privilege escalation** — a regular user can reach an admin-only endpoint because the application checks "is the user logged in?" but not "does the user have the admin role?"
- **Horizontal privilege escalation** — User A can read or modify User B's data because the authorization check only verified that *some* user is logged in.
- **Missing function-level access control** — the UI hides admin links from regular users, but the underlying endpoints have no server-side authorization check; anyone who guesses or scrapes the URLs can reach them.

The structural fix is to enforce authorization on *every* request to a protected resource, server-side, on the data layer itself. "Deny by default" — every endpoint requires an explicit grant. The check is parameterized by both the user identity *and* the specific resource being accessed (`is user X allowed to perform action Y on resource Z?`), not just whether the user is logged in.

**Broken Authentication** is the closely related category covering failures in *establishing* who the user is in the first place: weak password policies, password reset flows that leak account existence, session tokens that are predictable or never rotated, missing multi-factor authentication, login endpoints with no rate limiting that allow credential stuffing. NIST SP 800-63B is the modern reference standard for authentication and is required reading for anyone building a login system.

!!! mascot-encourage "Authorization Is Harder Than It Looks"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Sentinel offering encouragement">
    Authorization is one of the hardest problems in software security because every endpoint, every resource, every role, and every relationship contributes to the policy surface. It is normal for new engineers to underestimate the complexity. Build authorization once, into a single layer the application calls into — not scattered through handlers — and audit it like the load-bearing wall it is.

## 9. Security Misconfiguration and Sensitive Data Exposure

**Security Misconfiguration** is the failure to configure a system, framework, or platform securely — the bug is in the operations, not the code. Examples accumulate quickly: default admin credentials left in production, debug or trace endpoints exposed to the public internet, verbose error pages that leak stack traces and database schema, S3 buckets configured for public read, Kubernetes dashboards exposed without authentication, security headers (CSP, HSTS, X-Frame-Options) absent, TLS configured with weak ciphers or expired certificates, unnecessary services running.

The structural fix is **secure-by-default configuration baselines**, applied automatically by infrastructure-as-code (Terraform modules, Kubernetes admission controllers, CIS Benchmarks) rather than left to manual checklists. A configuration that requires an explicit human to make it secure will, eventually, be deployed without that human.

**Sensitive Data Exposure** is OWASP's renamed category in 2021, "Cryptographic Failures" — the failure to protect data appropriately when it is stored, transmitted, or processed. Examples: PII transmitted over plain HTTP, database backups copied to public buckets, passwords stored unhashed (or hashed with MD5 or SHA-1, both of which are unsuitable for password hashing), credit card data stored without tokenization, error messages or logs that include API keys or session tokens.

The defenses follow directly from the cryptography chapters: TLS for everything in transit, AES-GCM (or platform-managed encryption) for data at rest, Argon2id or scrypt for password hashing (never raw SHA), and a separation between *secrets* and *configuration* that keeps secrets out of source control entirely. Tools like HashiCorp Vault, AWS Secrets Manager, and Kubernetes External Secrets exist to make the right thing the easy thing.

| Category | Common manifestation | Structural fix |
|----------|----------------------|----------------|
| Misconfiguration | Default creds, exposed admin panels | Secure-by-default IaC, CIS benchmarks |
| Misconfiguration | Verbose error pages | Generic errors in prod, full detail in private logs |
| Sensitive Data Exposure | Plain HTTP, weak TLS | TLS 1.2+, HSTS, modern cipher suites |
| Sensitive Data Exposure | Passwords with weak hash | Argon2id with appropriate cost |
| Sensitive Data Exposure | Secrets in git | Secret manager + git pre-commit scanners |

## 10. A Case Study Drawn From The CWE Top 25

To make the abstractions concrete, consider a small, simulated application that combines several of the issues above — and how each is structurally fixed. We build a vulnerability sandbox that lets you flip between the vulnerable and the fixed implementation of a single endpoint and observe the difference.

#### Diagram: Vulnerability Sandbox MicroSim

<details markdown="1">
<summary>Interactive p5.js simulation that visualizes how a vulnerability is exploited and how the fix prevents it</summary>
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
</details>

The reader who completes this simulation should be able to articulate, for each vulnerability class, the *exact line* where the bug lives and the *exact replacement* that eliminates it.

## 11. Putting It Together — A Mental Checklist

When you sit down to review code or design a new endpoint, the bug classes in this chapter compress into a small mental checklist — the questions to ask at each trust boundary:

- Where does untrusted input enter this code? Is it validated against an allow-list of expected shapes?
- Where does untrusted input become part of a command interpreted by another component (database, shell, browser, deserializer, URL fetcher)? Is the boundary enforced by an API that separates code from data?
- What memory safety guarantees does the language give us? If we are in C or C++, is the bounds-checking explicit and the static analyzer enforcing it?
- Who is allowed to perform this action on this resource? Is the check on the server, on every request, parameterized by both user *and* resource?
- What does the code do when something fails? Does it fail closed?
- What does this code log? Does it log secrets? Does it log enough to detect abuse?
- What happens between any two operations? Is there a window an attacker can race into?

A surprisingly large fraction of real-world breaches would have been prevented by a code review whose reviewer asked these seven questions out loud. They are not glamorous — they are the working questions of a defensible-engineering practice.

## 12. Chapter Wrap

The bug classes in this chapter are old and well-known, and yet they continue to appear in production systems every week. The cause is rarely ignorance of the bugs — it is the friction between knowing them in the abstract and recognizing them in code under deadline pressure. The remedy is *structural*: choose languages, frameworks, and APIs that make the bad pattern impossible rather than merely "fixed for now." Memory-safe languages, parameterized queries, contextual encoding by default, secrets managers, and authorization libraries pulled into a single module — these are the load-bearing structural choices. They do more for security than any number of "be careful" admonitions in a coding standard.

Chapter 6 will turn from the bugs themselves to the *tools and processes* that find them at scale: static analysis, dynamic analysis, fuzzing, software composition analysis, and the supply-chain assurance practices that defend against bugs you did not write.

!!! mascot-celebration "What You Can Now Do"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sentinel celebrating">
    You can now read the OWASP Top Ten and CWE Top 25 with the eye of an engineer rather than a checklist follower. You can recognize the injection family in any of its forms, name the structural fix, and reason about why a memory-safe language eliminates an entire bug class by construction. That is the foundation we need before Chapter 6's tooling — because a tool only finds what you already know how to recognize.
