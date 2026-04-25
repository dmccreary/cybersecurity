---
title: "System Security: OS, Memory, and Access Control"
description: "Inside the operating system and runtime: kernel security, process isolation, memory protections (ASLR, DEP, stack canaries), access-control models (DAC, MAC, RBAC, ABAC), file permissions, MAC implementations (SELinux, AppArmor), and virtualization, hypervisor, container, Docker, and Kubernetes security."
generated_by: claude skill chapter-content-generator
date: 2026-04-25 11:15:00
version: 0.07
---

# System Security: OS, Memory, and Access Control

## Summary

Looks inside the operating system and runtime: kernel security, process isolation, memory protections (ASLR, DEP, stack canaries), the major access-control models (DAC, MAC, RBAC, ABAC), file permissions, mandatory access control implementations (SELinux, AppArmor), and virtualization, hypervisor, container, Docker, and Kubernetes security.

## Concepts Covered

This chapter covers the following 20 concepts from the learning graph:

1. Operating System Security
2. Kernel Security
3. Process Isolation
4. Memory Protection
5. ASLR
6. Stack Canary
7. DEP
8. Access Control
9. DAC
10. MAC
11. RBAC
12. ABAC
13. File Permissions
14. SELinux
15. AppArmor
16. Virtualization Security
17. Hypervisor Security
18. Container Security
19. Docker Security
20. Kubernetes Security

## Prerequisites

This chapter builds on concepts from:

- [Chapter 1: Security Foundations: Properties, Mindset, and Risk](../01-security-foundations/index.md)
- [Chapter 5: Software Vulnerabilities and Secure Coding](../05-software-vulnerabilities/index.md)

---

!!! mascot-welcome "Welcome to the System Layer"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Sentinel waving welcome">
    Welcome. So far we have looked at the network on the wire and at the application that produces traffic. This chapter is about the layer in between — the operating system, the runtime, and the isolation primitives that decide which code can read which bytes. The bugs here are quieter than a buffer overflow but louder than a misconfigured firewall: they are the failures that turn a small compromise into total system ownership. Trust, but verify — and start with what the kernel is willing to grant you.

## 1. What "System Security" Covers

Up to now the book has treated the *operating system* as a reliable substrate underneath the application. In practice, the OS is a complex, privileged piece of software with its own attack surface, its own threat model, and its own security mechanisms. **Operating system security** is the discipline of designing, configuring, and operating an OS so that no single process can read another's secrets, escalate to administrator, or persist undetectably across reboots. Every modern security control — sandboxing, encryption-at-rest, access logging — ultimately rests on the OS getting its job right.

The OS sits at a uniquely sensitive trust boundary. On one side is application code, which is plentiful, frequently updated, and often untrusted. On the other side is hardware, which the OS is the only piece of software allowed to talk to directly. The OS must mediate every attempt by application code to use the hardware: every memory allocation, every file read, every network packet, every system call. If an attacker can convince the OS to run their code with kernel privileges, every other security control above it becomes negotiable.

The chapter has three movements. First, the *runtime* — what the OS does to keep processes from interfering with each other and what memory protections prevent the kind of buffer-overflow exploits we met in Chapter 5 from succeeding even when the bug exists. Second, *access control* — the policy languages the OS uses to decide who can do what, from classical Unix permissions through enterprise role models and attribute-based authorization. Third, *isolation primitives above the OS* — virtualization, hypervisors, containers, and Kubernetes — which extend the OS's isolation story to cloud-scale workloads.

## 2. The Kernel and Why It Is Special

The **kernel** is the part of the OS that runs in *privileged mode* (also called *kernel mode* or *ring 0* on x86). Kernel code can execute any CPU instruction, access any memory, and talk to any hardware. Application code, by contrast, runs in *user mode* (ring 3) where the CPU traps on privileged instructions and forces a transition into the kernel through a controlled gateway called a **system call**. This privilege separation is the most important architectural fact in OS security: there is exactly one piece of software with full power over the machine, and it is the piece you most want to keep small, audited, and unsurprising.

**Kernel security** is the practice of keeping that privileged code trustworthy. It includes hardening the kernel itself against bugs (memory-safe kernel modules, fuzzing the system-call interface, reducing the attack surface by removing unused features), protecting the kernel from user-mode exploitation (KASLR — kernel address space layout randomization, SMEP/SMAP — supervisor mode execute and access prevention, kernel-page-table isolation that defends against Meltdown), and signing kernel modules so that an attacker with root cannot quietly load a rootkit driver. Modern operating systems also support **secure boot**, where firmware verifies the kernel's signature before transferring control to it, anchoring the trust chain at the hardware (a topic we revisit in component security).

The kernel attack surface is larger than newcomers expect. A typical Linux kernel exposes several hundred system calls, each accepting structured arguments that the kernel must validate. A bug in any one of them — a missing bounds check, an integer overflow in a length field, a race condition between two threads — can become a *local privilege escalation* (LPE) that turns a user-level shell into a root shell. The CVE database is full of such bugs; treat each one as a reminder that "we are user-only, so kernel bugs do not affect us" is rarely the right model.

#### Diagram: Kernel Mode vs. User Mode and the System Call Boundary

<details markdown="1">
<summary>Cross-section diagram of user/kernel separation and the system call gateway</summary>
Type: drawing
**sim-id:** kernel-user-boundary<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A horizontal stack diagram with three layers, top to bottom:

**Top layer (user mode, ring 3) — light blue background `#e3f2fd`:**
- Three application boxes: "Browser", "Database", "Editor"
- Each has a small lock icon in the corner labeled "unprivileged"

**Middle layer (kernel boundary) — slate steel `#455a64` line, 4px thick:**
- A single labeled gateway: "System Call Interface (open, read, write, mmap, ...)"
- Two arrows shown crossing it: one labeled "syscall" going down, one labeled "return" going up

**Bottom layer (kernel mode, ring 0) — cybersecurity blue background `#1565c0` with white text:**
- Subdivided into: "Process Scheduler", "Memory Manager", "VFS / File Systems", "Network Stack", "Device Drivers"
- A small label at the bottom: "Direct hardware access"

**Below the kernel layer, a thinner hardware layer (gray `#cfd8dc`):**
- Labeled "CPU / RAM / Disk / NIC"

Hover tooltips:
- Hovering on a user-mode app shows: "Cannot directly touch hardware. Must ask the kernel via syscalls."
- Hovering on the system call line shows: "The only legal way for user code to enter kernel mode."
- Hovering on the kernel layer shows: "Trusted code. A bug here = total compromise."

Color: cybersecurity blue `#1565c0` (kernel), slate steel `#455a64` (boundary), light blue `#e3f2fd` (user mode), gray `#cfd8dc` (hardware). Responsive: stacks layers tightly below 700px viewport but preserves the horizontal arrows.

Implementation: Static SVG with `<title>` tooltips per layer.
</details>

## 3. Process Isolation — One Program, One World

When two programs run on the same machine, the OS must convince each one that it has the machine to itself, while making sure that neither can read or modify the other. This is **process isolation**, and it rests on three pillars: separate virtual address spaces, separate file-descriptor tables, and the privilege separation we just described between user and kernel mode.

The most fundamental of these is the **virtual address space**. The CPU's memory management unit (MMU), under control of the kernel, translates each process's virtual addresses to physical addresses through per-process page tables. Process A's "address `0x4000`" and Process B's "address `0x4000`" map to entirely different physical pages of RAM. Neither process can name the other's memory; the addresses they would have to use simply do not resolve. This is why a buffer overflow in one process cannot, by itself, corrupt another process — the runaway pointer cannot reach into a different address space.

Process isolation is not absolute. Processes share the kernel, the CPU, the cache, and the clock. Side channels — measuring how long an operation takes, what the cache contains, how branch prediction behaves — can leak information across the isolation boundary even when the explicit channels (memory, files, IPC) are closed. The Spectre and Meltdown disclosures of 2018 made these channels a first-class concern, and modern operating systems mitigate them with software workarounds at measurable performance cost. We will return to side channels in the component security chapter.

| Isolation mechanism | What it separates | What it does not separate |
|---------------------|-------------------|---------------------------|
| Virtual address spaces | Memory contents per process | CPU caches, branch predictors |
| File-descriptor tables | Open files, sockets per process | Filesystem itself (still shared) |
| User IDs / credentials | Identity-based authorization | Kernel attack surface |
| Namespaces (Linux) | Views of mounts, PIDs, networks | Underlying kernel |
| Hypervisor / VM | Almost everything (guest kernels) | CPU caches, hardware bugs |

The table is a preview of the layered isolation story this chapter develops. Each row is a stronger boundary than the previous, and each row carries a corresponding cost in performance and operational complexity. Choosing the right isolation strength for a workload is a security-engineering judgment we will return to throughout the chapter.

## 4. Memory Protection — Defending The Address Space

A successful Chapter 5 buffer overflow gets the attacker control of a return address, a function pointer, or a heap structure. Memory protections are the OS-and-toolchain features that make exploiting the bug *much harder* even when the bug itself remains. They do not make memory-corruption bugs disappear; they raise the cost of weaponizing them. Three are foundational, and most modern operating systems compose all three by default.

**Memory protection** is the umbrella term for the set of OS mechanisms that constrain what an executing process can do with memory it does not own (or with memory it does own, but should not be able to execute or rewrite). The three load-bearing mechanisms are non-executable memory (DEP), randomization (ASLR), and stack protection (canaries).

### 4.1 DEP — Make Data Unexecutable

**DEP (Data Execution Prevention)** marks memory regions that hold *data* — the stack, the heap, and read-only data segments — as *non-executable*. The CPU enforces this through a per-page "no-execute" bit (called NX on AMD/Intel, XN on ARM). When DEP is on, an attacker who has overflowed a buffer with shellcode cannot simply jump into the buffer to execute it: the CPU will trap on the first instruction fetched from that page and the kernel will kill the process.

DEP turned classic stack-smashing-shellcode attacks from one-step exploits into harder problems. Attackers responded with **return-oriented programming (ROP)**, which chains together short instruction sequences (gadgets) already present in executable code, never executing data pages directly. ROP is harder to construct than shellcode, but it is not stopped by DEP alone — that is what ASLR is for.

### 4.2 ASLR — Make Memory Unpredictable

**ASLR (Address Space Layout Randomization)** randomizes the base addresses of the stack, heap, executable, and shared libraries every time a process starts. Without ASLR, an exploit author can write down the exact address of a useful gadget or function and bake it into the exploit; with ASLR, those addresses change each run, and the attacker has to either guess (and crash on a wrong guess), leak an address through a separate information disclosure bug, or brute-force a 32- or 64-bit search space.

The strength of ASLR depends on the *entropy* — the number of random bits in the base address. 32-bit ASLR is weak (often only 8–16 bits of entropy, which is feasible to brute-force for some services). 64-bit ASLR provides 28+ bits of entropy on typical configurations and makes blind guessing impractical. ASLR composes with DEP: DEP prevents executing data, ASLR prevents knowing where to jump.

### 4.3 Stack Canaries — Detect The Tampering

A **stack canary** is a random value the compiler inserts into a function's stack frame, between the local variables and the saved return address. On function exit, the prologue checks that the canary still holds its original value. A linear stack-buffer overflow that overwrites the return address must, in passing, also overwrite the canary; the mismatch is detected, and the process aborts before the corrupted return address is used. Canaries do not stop overflows; they catch the most common consequence of one before it does damage.

Canary values are typically randomized per-process and include a leading null byte (so that string-copy bugs cannot easily preserve the canary while overflowing past it). Sophisticated exploits sometimes leak the canary through a separate information-disclosure bug and then craft an overflow that re-writes it to its correct value — at which point the canary check passes. As with all individual mitigations, canaries raise the bar without being a complete defense.

#### Diagram: Stack Frame With and Without a Canary Under Overflow

<details markdown="1">
<summary>Side-by-side stack frame visualizations during a buffer overflow attack</summary>
Type: infographic
**sim-id:** stack-canary-comparison<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

Two stack frames shown side by side, drawn vertically with high-address at top and low-address at bottom (the standard stack layout).

**Left frame — "Without Canary":**
- Top to bottom: "Saved return address" (dark gray), "Saved frame pointer" (gray), "Local variable: char buf[16]" (yellow)
- Below the left frame, a red arrow labeled "strcpy(buf, attacker_input)" pointing upward into the buffer
- Annotation: "Long input overruns buf, overwrites saved return address"
- Result label at top: "Return → attacker-controlled address. Exploit succeeds silently."

**Right frame — "With Canary":**
- Top to bottom: "Saved return address" (dark gray), "Saved frame pointer" (gray), "Stack canary: 0xA3F2B7C1" (green), "Local variable: char buf[16]" (yellow)
- Below the right frame, the same red overflow arrow
- Annotation: "Overflow path crosses canary first"
- Result label at top: "Canary check fails on return → process aborts before return"

A small legend below explains the colors: yellow = attacker-writable buffer, green = canary, gray = saved frame pointer, dark gray = saved return address.

Hover tooltips:
- Hovering on the canary box shows: "A random per-process value. Compiler inserts; prologue checks."
- Hovering on the saved return address shows: "Where the function returns to. Hijacking this is the classic exploit goal."

Color: amber `#ffa000` accent on the "exploit succeeds" label (warning), green `#4caf50` on the canary, slate steel for return address, light yellow for buffer. Responsive: side-by-side at >800px, stacked vertically below.

Implementation: Static SVG.
</details>

!!! mascot-thinking "Defense In Depth, At The Bit Level"
    <img src="../../img/mascot/thinking.png" class="mascot-admonition-img" alt="Sentinel thinking">
    No single memory protection stops exploitation; together they make the path long and noisy. DEP forces the attacker to reuse code rather than inject it. ASLR forces them to leak addresses before they can target it. Canaries force them to leak the canary too. Each step is a bug they have to find — and each bug found is a defender's chance to detect them.

### 4.4 Where The Hierarchy Comes From

The three mitigations above are the durable foundation. Modern systems layer further: **Control-Flow Integrity (CFI)** validates indirect call/jump targets against a known-good set; **shadow stacks** keep a second copy of return addresses in protected memory; **Intel CET** and **ARM Pointer Authentication** add hardware enforcement to both. Each addition closes a class of bypasses against the older mitigations. The trend is unmistakable: silicon and OS together are increasingly hostile to memory-corruption exploitation, which is part of why memory-safe languages (Rust, Go, modern C++ with sanitizers) and memory-safe targets (Android adopting Rust for new system code) are gaining ground.

## 5. Access Control — Who Can Do What

Memory protection answers "what can a running process do to itself"; access control answers "what can a running process do to *the rest of the system* — files, devices, network, other processes". **Access control** is the policy mechanism by which the OS decides whether a particular *subject* (a user or process) may perform a particular *operation* (read, write, execute) on a particular *object* (a file, a device node, a socket). This is the AAA (Authentication, Authorization, Accounting) authorization layer from Chapter 1, made concrete inside the OS.

Before we examine the access-control models, two definitions are essential. A **subject** is the active entity making the request — typically a process running on behalf of a user, identified by a numeric user ID and a set of group IDs on Unix systems. An **object** is the passive entity being acted upon — a file, a directory, a device, an IPC endpoint. An *access decision* is the OS answer to "may this subject perform this operation on this object", made every time a request is issued.

Different operating systems and different security regimes use different *models* for expressing the policy. Four models cover almost all practical deployments. Each makes a different tradeoff between flexibility, manageability, and assurance, and each shows up in different parts of a real system.

### 5.1 DAC — Discretionary Access Control

**DAC (Discretionary Access Control)** lets the *owner* of an object set the access policy on it. If you own a file, you decide who else can read or write it; the OS enforces your decision but does not constrain what you may decide. The classical example is Unix file permissions: the file's owner runs `chmod` and `chown`, and the kernel honors the result.

DAC is flexible and intuitive — it matches most users' mental model of "my files, my rules". Its weakness is that policy is fragmented: there is no central statement of who can read what, only a forest of per-file decisions made by individual owners over time. A single careless `chmod 777` opens a file to the world, and the OS will not warn the owner that this contradicts an organizational policy, because in DAC there is no organizational policy — only owners' decisions.

### 5.2 MAC — Mandatory Access Control

**MAC (Mandatory Access Control)** removes the owner's discretion: the *system* sets and enforces policy, and individual users — even file owners, even root — cannot relax it. MAC originated in defense and intelligence systems where data has classification labels (Unclassified, Confidential, Secret, Top Secret) and subjects have clearances. The classical Bell-LaPadula model formalizes this with two rules: *no read up* (a subject cannot read data above its clearance) and *no write down* (a subject cannot write data below its clearance, preventing information leakage from high to low).

In modern Linux, MAC is not just about data classification; it is also about *type enforcement*, where every process and every file is labeled with a type, and a system-wide policy says which process types may perform which operations on which file types. The two dominant Linux MAC implementations — SELinux and AppArmor — are detailed in Section 7. The defining property of MAC is that policy is enforced *even against root*: an attacker who escalates to root still cannot perform actions the MAC policy forbids.

### 5.3 RBAC — Role-Based Access Control

**RBAC (Role-Based Access Control)** structures permissions around *roles* rather than individuals. Permissions are granted to roles ("billing-clerk can read invoices, write payments"); users are assigned to roles ("Alice is a billing-clerk"); and the system grants Alice a permission whenever she activates the role that has it. When Alice changes jobs, you change her role assignment, not the dozens of permissions her job required.

RBAC scales the way DAC does not. A 50,000-employee enterprise cannot maintain a per-user permission list for every resource; it can maintain a few hundred roles, each with carefully scoped permissions, and assign every employee to one or a few roles. RBAC is the dominant model in enterprise applications, in cloud IAM ("Storage Admin" role in AWS, GCP, Azure), and in Kubernetes (which has a literal `Role` and `ClusterRole` object, covered later).

RBAC's limitation is that *role* is a coarse handle. If billing-clerks should see invoices for *their region only*, RBAC alone cannot express that — every region would need its own role, and the role count explodes. That is the gap ABAC fills.

### 5.4 ABAC — Attribute-Based Access Control

**ABAC (Attribute-Based Access Control)** evaluates access decisions against arbitrary *attributes* of the subject, the object, and the environment. A policy is a logical expression: "permit if `subject.department == object.department AND environment.time IN business_hours`". ABAC subsumes RBAC (a role is just an attribute) and goes further by letting decisions consider context — location, device posture, time of day, sensitivity label, recent risk score.

ABAC is what cloud IAM has been moving toward, expressed in policy languages like AWS IAM JSON, GCP IAM Conditions, and the more general XACML. Zero Trust architectures rely on ABAC to make per-request decisions that consider device health and user risk, not just static role membership. ABAC's cost is policy complexity: an expressive policy language is easier to misconfigure than a list of role assignments, and policy review becomes a real engineering activity rather than a clerical one.

| Model | Who sets policy | Strength | Typical use |
|-------|-----------------|----------|-------------|
| DAC | The object's owner | Flexible, intuitive | Unix files, classic OS |
| MAC | The system / security policy | High assurance | Defense, hardened Linux (SELinux) |
| RBAC | An admin via roles | Scales to enterprises | Apps, cloud IAM, Kubernetes |
| ABAC | A policy author via attributes | Expressive, context-aware | Cloud, Zero Trust |

The table compares the four models along three axes that this section explained in prose. Most real systems mix at least two of these — Linux uses DAC by default with MAC layered on top via SELinux/AppArmor, while cloud platforms typically use RBAC for human users and ABAC for fine-grained service-to-service authorization.

#### MicroSim: Access Control Decision Explorer

<details markdown="1">
<summary>Interactive simulator that takes a (subject, action, object) and shows how each access-control model decides</summary>
Type: microsim
**sim-id:** access-control-explorer<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom: Analyzing):** Given a request from a subject to perform an action on an object, learners predict and compare how DAC, MAC, RBAC, and ABAC each render the access decision, and identify which models would forbid an apparently reasonable request.

**Layout (700 × 480 canvas, responsive — uses `updateCanvasSize()` on setup):**

- Top control panel (createSelect, createSelect, createSelect — p5.js builtin controls):
  - "Subject:" dropdown — Alice (HR analyst), Bob (engineer), Charlie (intern), root
  - "Action:" dropdown — read, write, execute
  - "Object:" dropdown — payroll.csv (HR-owned, sensitive), build.sh (engineering, executable), public.txt (world-readable)
- A "Request" button (createButton) that triggers the evaluation
- Below controls, four panels arranged in a 2×2 grid, one per model: DAC, MAC, RBAC, ABAC
- Each panel shows:
  - The model name (header)
  - The policy snippet relevant to the current request (e.g., "DAC: payroll.csv perms = `rw- r-- ---`; Alice in HR group → READ allowed")
  - A green "ALLOW" or red "DENY" badge with the rationale
- Bottom info strip:
  - A short generalization comparing the four answers, noting any disagreement (e.g., "DAC permits, but SELinux MAC denies because `analyst_t` cannot read `payroll_finance_t`.")

**Behavior:**
- Default state shows Alice / read / payroll.csv with the four model decisions populated
- Changing any dropdown re-runs all four models and updates badges in real time
- A "Randomize scenario" button picks a (subject, action, object) tuple to encourage exploration
- A "Show policy" toggle reveals each model's underlying rules in a side drawer

**Visual style:**
- cybersecurity blue `#1565c0` headers
- green `#4caf50` ALLOW badges, red `#d32f2f` DENY badges
- slate steel `#455a64` for policy text
- responsive: panels collapse to a vertical stack below 700px viewport

**Setup details:**
- `setup()` begins with `updateCanvasSize();`
- `canvas.parent(document.querySelector('main'));`
- All controls are created with p5.js builtin functions (createSelect, createButton)
- Resize event re-flows the panel grid

Implementation: p5.js sketch with a small policy-engine in JavaScript. The policy data lives in `data.json` so instructors can edit subjects, objects, and policies without touching the sketch.
</details>

## 6. File Permissions In Practice

The most familiar instance of DAC is the classical Unix **file permissions** model, which expresses every file's policy in nine bits: read, write, and execute, each repeated for *owner*, *group*, and *other*. A directory listing displays them as `rwxr-x---`: owner can read/write/execute, group can read/execute, other has no access. Two numeric values control the mapping — the file's *owner UID* and *group GID* — and three octal digits encode the permission bits (the familiar `chmod 750`).

Three special bits modify the basic model. **setuid** (`chmod u+s`) makes an executable run with the owner's privileges instead of the caller's — historically used so non-root users could ping or change their password, and historically the source of most local privilege escalation bugs in Unix. **setgid** does the same for group identity, and on directories causes new files to inherit the directory's group. **The sticky bit** on a directory (`chmod +t`, displayed as `t` in the other-execute slot) prevents non-owners from deleting files they did not create — used on `/tmp` so users cannot delete each other's temp files.

Two newer mechanisms extend the basic model. **Access Control Lists (ACLs)**, accessed via `getfacl`/`setfacl`, allow per-user and per-group permissions beyond the single owner+group+other triple — useful when a project needs read access for a half-dozen specific people who don't all share a group. **Capabilities**, used in Linux to break root's monolithic power into ~40 finer-grained privileges (CAP_NET_BIND_SERVICE for binding to ports below 1024, CAP_SYS_ADMIN for many admin operations), let a process drop the privileges it does not need so that a compromise does not yield full root.

The classical file-permission model is *DAC*: each file's owner sets policy. It is also *coarse* — every read either is or is not permitted, with no per-attribute conditions. That coarseness is exactly why high-assurance Linux systems layer SELinux or AppArmor on top of file permissions, and why containers further constrain what a process can do regardless of what its UID would imply.

!!! mascot-warning "World-Writable Files Are A Persistent Footgun"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel showing caution">
    A `chmod 777` on a script that root will later run is the classic local-escalation foothold. Any user can replace the script's contents; root will then execute the attacker's code. The pattern looks fine in development ("just give it permission"), survives review because nothing breaks, and remains a footgun until exploited. Default file modes should be 644 for data and 755 for executables, never 777.

## 7. SELinux and AppArmor — MAC On Linux

The two production-grade Linux MAC implementations take different paths to the same destination: enforcing system-defined policy regardless of file owner.

**SELinux (Security-Enhanced Linux)** was originally developed by the U.S. NSA and is the default MAC layer on Red Hat, Fedora, CentOS Stream, and Android. SELinux uses *type enforcement*: every process and every file is labeled with a *type* (a short string like `httpd_t` or `var_log_t`), and the policy is a long list of "allow" rules stating which subject-type may perform which operation on which object-type. Out of the box, the targeted policy ships rules for hundreds of common services (Apache, MySQL, sshd, systemd) — so a compromised Apache process can only read `httpd_sys_content_t` files and cannot touch `/etc/shadow`, even though Apache runs as root in some configurations.

SELinux has earned a reputation for being hard to administer. The policy language is dense, error messages are terse ("avc: denied"), and the friction of writing custom policy for a new application is real. The tooling has improved (audit2allow generates suggested rules from denial messages, semanage simplifies common edits), but operating SELinux at scale still requires a dedicated engineer's attention.

**AppArmor** was developed by Immunix and is the default MAC layer on Ubuntu, openSUSE, and Debian. AppArmor's central concept is the *profile*: a per-program file in `/etc/apparmor.d/` listing the paths the program is allowed to read, write, or execute. AppArmor is *path-based* (rather than label-based), which makes profiles easier to read and write — they look like a list of file paths with permission letters — but it also makes them more fragile to symlinks and bind mounts that change what a path resolves to.

| Aspect | SELinux | AppArmor |
|--------|---------|----------|
| Policy model | Type enforcement (labels on every object) | Path-based profiles per program |
| Default on | Red Hat / Fedora / Android | Ubuntu / openSUSE / Debian |
| Granularity | Very fine (hundreds of types, tens of thousands of rules) | Per-program, file-path-scoped |
| Learning curve | Steep | Moderate |
| Common failure mode | Mislabeled files after restore from backup | Profile bypass via unanticipated path |

Both systems support *enforcing*, *permissive* (logs denials but does not block — useful for debugging), and *disabled* modes. The presence of MAC is a strong defense-in-depth control: even if an attacker exploits a service to gain its UID, MAC bounds what that UID can do to a small subset of the filesystem. The most common MAC failure in practice is not bypass — it is administrators putting the system in permissive mode "to fix something" and forgetting to re-enable it.

#### Diagram: Layers of Access Control on a Modern Linux Box

<details markdown="1">
<summary>Stacked-layer diagram showing how DAC, capabilities, and MAC compose for one access decision</summary>
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
</details>

## 8. Virtualization and Hypervisor Security

A **virtual machine (VM)** is an emulated computer running its own operating system on top of a host. A **hypervisor** is the software layer that creates and manages VMs, mapping each VM's virtual hardware to a slice of the host's real hardware. **Virtualization security** is the practice of keeping each VM convinced it has a private machine, while preventing any VM (or the workloads inside it) from breaking out to affect the host or other guests.

Hypervisors come in two architectural flavors. **Type 1 ("bare metal") hypervisors** — VMware ESXi, Microsoft Hyper-V, KVM, Xen — run directly on hardware and are the foundation of every cloud provider's compute service. **Type 2 ("hosted") hypervisors** — VirtualBox, VMware Workstation — run as an application on a host OS and are typical for developer machines. Type 1 hypervisors have a smaller attack surface because they do not include a general-purpose host OS underneath them; type 2 hypervisors inherit whatever vulnerabilities the host OS has.

**Hypervisor security** centers on a single threat: *VM escape*, where code inside a guest exploits a bug in the hypervisor or in emulated hardware to execute on the host or in another guest. VM escape is rare but devastating — a single such bug in a public cloud lets one tenant read another tenant's data. Notable historical examples include CVE-2015-3456 (the "VENOM" floppy-controller bug in QEMU/KVM), various Xen privilege-escalation issues, and a long tail of bugs in emulated USB and network controllers. The mitigations are: minimize the hypervisor's attack surface (disable unused emulated devices), patch promptly, use hardware-assisted virtualization (Intel VT-x, AMD-V) which moves much of the isolation into silicon, and consider tenant isolation strategies (dedicated hosts, single-tenant clusters) for the most sensitive workloads.

A second concern is **side-channel attacks across VMs sharing a CPU**. The same Spectre/Meltdown family of issues that crosses process boundaries also crosses VM boundaries, because the cache and branch predictor are shared at the silicon level. Cloud providers mitigate with microcode updates, scheduler awareness (avoid co-tenanting hostile workloads on the same physical core), and — for the highest-assurance workloads — confidential computing technologies (Intel SGX, AMD SEV, Intel TDX) that encrypt VM memory in a way the hypervisor itself cannot read.

#### Diagram: Hypervisor Architecture and the Trust Boundary

<details markdown="1">
<summary>Stacked architecture showing Type 1 vs. Type 2 hypervisors and the VM-escape threat model</summary>
Type: drawing
**sim-id:** hypervisor-architecture<br/>
**Library:** Static SVG<br/>
**Status:** Specified

Two stacks shown side by side.

**Left stack — Type 1 (Bare Metal):**
- Top: 3 VM boxes side-by-side, each labeled "Guest OS + Apps" with light-blue fill
- Below: a single wide cybersecurity-blue band labeled "Hypervisor (ESXi / KVM / Hyper-V)"
- Bottom: a gray hardware band labeled "CPU / RAM / NIC / Disk"
- A red dashed arrow labeled "VM escape" going from one VM down through the hypervisor to the hardware band, with a "?" mark — the threat to mitigate

**Right stack — Type 2 (Hosted):**
- Top: 2 VM boxes labeled "Guest OS"
- Below: a slate band labeled "Hypervisor (VirtualBox / VMware Workstation)"
- Below that: a wider band labeled "Host OS (Windows / macOS / Linux)"
- Bottom: gray hardware band
- Annotation: "Larger attack surface — host OS bugs can affect all guests."

Captions:
- Above the left stack: "Type 1: hypervisor on hardware. Cloud providers use this."
- Above the right stack: "Type 2: hypervisor as application. Developers use this."

Color: cybersecurity blue `#1565c0` for Type 1 hypervisor band, slate steel for Type 2 hypervisor band, light blue for VMs, gray for hardware, red dashed for the escape arrow.

Responsive: stacks render side-by-side at >800px and stack vertically below.

Implementation: Static SVG.
</details>

## 9. Containers — Lighter Isolation, Different Tradeoffs

A **container** is an isolated process group on a single host kernel, made to look (from the inside) like its own machine. Where a VM virtualizes the hardware and runs a full guest kernel, a container shares the host kernel and uses kernel features — namespaces, cgroups, capabilities, seccomp filters — to give the contained process a partial, restricted view. Containers start in milliseconds, weigh megabytes instead of gigabytes, and have become the default packaging unit for cloud-native workloads.

**Container security** is the practice of getting the right amount of isolation out of those kernel features for a workload that you may or may not fully trust. The headline tradeoff is well known: containers offer *lighter* isolation than VMs, because all containers on a host share one kernel — and any kernel privilege-escalation bug is a potential container-escape primitive. For most workloads (your own services in your own infrastructure), this tradeoff is fine; for hostile multi-tenant workloads, it is not enough on its own and is typically wrapped in a VM or a sandboxed runtime (gVisor, Kata Containers, Firecracker).

The kernel features that compose into "a container" are:

- **Namespaces** — give the container its own view of PIDs, network interfaces, mount points, user/group IDs, and IPC. Namespaces are why `ps` inside a container shows only the container's processes.
- **cgroups (control groups)** — bound how much CPU, memory, I/O, and process count the container can consume. Without cgroups a container could fork-bomb the host.
- **Capabilities** — drop dangerous Linux capabilities (CAP_SYS_ADMIN, CAP_NET_RAW, CAP_SYS_PTRACE) that the container does not need.
- **seccomp filters** — restrict which system calls the container can issue, reducing the kernel attack surface from hundreds of syscalls to dozens.
- **MAC profiles** — apply an SELinux type or AppArmor profile to further bound what the container can touch on the host filesystem.

These are not optional layers; a "container" with namespaces but no capability dropping, no seccomp, no MAC, and no read-only root filesystem is roughly as isolated as a `chroot` jail — which is to say, not very. Production container security means turning on every layer that does not break the workload.

### 9.1 Docker Security

**Docker** is the most widely deployed container engine and the source of the "container" mental model most engineers have. **Docker security** considerations cluster into four buckets, each of which is a frequent finding in production audits.

**Image security.** A Docker image is a stack of filesystem layers, ultimately based on some base image. Vulnerabilities in base images, libraries inside images, or in the application binaries are inherited by every container that runs from them. Practical hygiene: use minimal base images (distroless, Alpine, scratch), scan images with a tool like Trivy, Grype, or Snyk, sign and verify images (Cosign, Notary), and rebuild promptly when CVEs are disclosed against base images.

**Runtime security.** A running container should drop privileges aggressively: never run as root inside the container if you can avoid it (use `USER` directive in Dockerfile), drop all Linux capabilities and add back only what's needed (`--cap-drop=ALL --cap-add=NET_BIND_SERVICE`), use a read-only root filesystem (`--read-only`), apply seccomp and AppArmor/SELinux profiles, and never run with `--privileged` (which disables almost every isolation feature). The most consequential Docker footgun is mounting the Docker socket (`/var/run/docker.sock`) into a container — a process inside the container can then issue Docker API calls and trivially launch a privileged container that escapes.

**Registry and supply chain security.** Images come from registries; registries can be compromised, mirrors can be poisoned, and `latest` tags can drift. Pin images by digest (`@sha256:...`) for production, run a private registry with strict push controls, and keep an SBOM (software bill of materials) for every shipped image.

**Host security.** The Docker daemon runs as root and has full access to the host. Anyone who can talk to the Docker socket has effective root on the host. Restrict socket access to a small admin group, never expose the daemon's TCP API without TLS and client certificate authentication, and consider rootless Docker for developer machines.

!!! mascot-warning "Two Defaults That Are Footguns"
    <img src="../../img/mascot/warning.png" class="mascot-admonition-img" alt="Sentinel showing caution">
    Two Docker patterns look fine and aren't. (1) Mounting `/var/run/docker.sock` into a container that "needs to launch other containers" — that container can now launch a `--privileged` sibling and pivot to host root. (2) Running as root inside a container "because the build is simpler" — most container escapes that work require root inside. Default to a non-root `USER`, drop the socket, and only relax when you have written down why.

### 9.2 Kubernetes Security

**Kubernetes** is the dominant container orchestration platform: it schedules containers across a cluster of hosts, gives them networking, manages their lifecycle, and exposes a declarative API for the whole thing. **Kubernetes security** inherits all of Docker's security concerns and adds several new ones at the cluster level.

The Kubernetes attack surface is large because the cluster is a *distributed system* with several privileged components: the API server (the cluster's brain, exposes a REST API), etcd (the cluster's database, holds all state including secrets), the scheduler, the controller manager, the kubelet on every node, and an ingress and CNI plugin layer. Each is a potential point of compromise; collectively they are why Kubernetes has its own security guidance from CIS, NSA, and most cloud providers.

The five most consequential Kubernetes security controls in practice are:

- **RBAC** — Kubernetes ships with first-class Role-Based Access Control. Every API request is authenticated (usually by a service account or human user) and authorized against `Role` and `ClusterRole` definitions. The default service account in a namespace should *not* have cluster-admin permissions; the principle of least privilege says each workload should have its own service account with the minimum required API access.
- **Pod Security Standards (Restricted, Baseline, Privileged)** — replace the deprecated PodSecurityPolicy and bound what pods can do at admission time: forbid privileged containers, forbid host network/PID/IPC, require non-root users, require seccomp profiles. The Restricted profile is the right default for application namespaces.
- **Network Policies** — by default, all pods in a Kubernetes cluster can talk to all other pods. NetworkPolicy resources let you write allow-lists ("frontend may talk to backend on port 8080; nothing else may talk to backend"), implementing the network segmentation that microservice architectures otherwise lack. Without network policies, one compromised pod has lateral access to every other workload.
- **Secrets management** — Kubernetes Secrets are base64-encoded by default in etcd and accessible to any pod with the right RBAC binding. Production deployments encrypt secrets at rest in etcd, restrict secret access via RBAC, and increasingly externalize secrets to a dedicated secret manager (HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager) accessed via short-lived tokens.
- **Admission controllers** — pluggable policy enforcement at API request time, increasingly via OPA Gatekeeper or Kyverno. Admission policies enforce organizational rules ("no images from outside our registry", "every workload must have CPU/memory limits", "no `hostPath` mounts") at the moment they would otherwise become a running workload.

The Kubernetes failure modes that lead to real incidents tend to cluster: an exposed dashboard with no authentication, a service account binding that grants `cluster-admin` to a workload that did not need it, a network policy that does not exist so a compromised pod can reach the cloud metadata service and steal IAM credentials, and secrets stored in environment variables (visible in `kubectl describe`) rather than mounted with restricted permissions. None of these are exotic; all are routine findings.

#### MicroSim: Container Isolation Strength Comparator

<details markdown="1">
<summary>Interactive simulator comparing the isolation strength of chroot, Docker, hardened Docker, and a VM</summary>
Type: microsim
**sim-id:** container-isolation-comparator<br/>
**Library:** p5.js<br/>
**Status:** Specified

**Learning objective (Bloom: Evaluating):** Given a hypothetical workload (trusted, semi-trusted, hostile multi-tenant), learners select an isolation level and evaluate whether each available threat — host filesystem access, kernel exploit, sibling-container interference, hardware side channel — is mitigated.

**Layout (700 × 540 canvas, responsive):**

- Top control row:
  - "Isolation level:" select (createSelect) — chroot, Docker (default), Docker (hardened: non-root, drop-caps, seccomp, MAC), VM (KVM), VM + confidential computing
  - "Workload trust:" select — fully trusted, semi-trusted, hostile multi-tenant
  - "Run threat suite" button (createButton)
- Center: a vertical list of five threat scenarios:
  1. "Container reads `/etc/shadow` on host"
  2. "Container exploits a kernel CVE for LPE"
  3. "Container A reads memory of Container B (cache side channel)"
  4. "Container reaches AWS metadata service at 169.254.169.254"
  5. "Compromised container modifies the orchestrator API"
- For each scenario, a colored badge appears: green "blocked", amber "mitigated with caveats", red "feasible"
- Right side: a "Verdict" panel that recommends whether the chosen isolation is appropriate for the chosen workload

**Behavior:**
- Each combination of isolation level + workload trust produces a deterministic threat-evaluation table
- A "Why?" hover on each badge shows a one-sentence rationale tied to a concept from the chapter (namespaces, seccomp, hardware-assisted virtualization, etc.)
- A "Reset" button (createButton) restores defaults

**Visual style:**
- cybersecurity blue `#1565c0` headers and section borders
- green `#4caf50`, amber `#ffa000`, red `#d32f2f` badges
- slate steel `#455a64` rationale text
- responsive: threat list collapses to two columns above 900px, single column below

**Setup details:**
- `setup()` begins with `updateCanvasSize();`
- `canvas.parent(document.querySelector('main'));`
- All controls are p5.js builtins

Implementation: p5.js sketch with isolation-level → threat-mitigation matrix in `data.json`. Instructors can extend with new scenarios by editing the JSON.
</details>

!!! mascot-encourage "Containers Reward A Layered Mental Model"
    <img src="../../img/mascot/encouraging.png" class="mascot-admonition-img" alt="Sentinel offering encouragement">
    The container ecosystem can feel like an avalanche of acronyms — namespaces, cgroups, seccomp, AppArmor, RBAC, NetworkPolicy, Pod Security Standards. Hold onto one thread: each one closes a different escape path, and you turn them all on for the same reason — defense in depth. You do not have to memorize every flag at once. Recognize what each layer is doing, and the rest follows.

## 10. Putting It Together — A Defensible System

A modern hardened Linux server running a containerized application stacks every concept in this chapter at once. From the bottom up:

1. **Hardware and firmware** verify a signed boot chain, anchoring trust before any software runs (Chapter 7's territory, but it begins here).
2. **The kernel** boots in privileged mode with KASLR, SMEP/SMAP, and module signing on. Its system-call surface is reduced where possible.
3. **Memory protections** (DEP, ASLR, stack canaries, control-flow integrity) raise the cost of exploiting any memory-safety bug in user-space code.
4. **DAC file permissions** give every file a sensible owner and mode; no `chmod 777` survived review.
5. **Linux capabilities** replace monolithic root with finer-grained privileges that services drop after binding their ports.
6. **MAC** (SELinux or AppArmor) bounds what each service type can do on the filesystem, even if it runs as root.
7. **Containers** wrap the application in namespaces, cgroups, dropped capabilities, seccomp, and a MAC profile — adding another envelope around the workload.
8. **Kubernetes** schedules the container with a least-privilege service account, a Restricted Pod Security Standard, a network policy that allows only the connections the service needs, and admission controls that enforce organizational policy.
9. **A hypervisor** below the host kernel isolates this whole stack from the other tenants on the same physical machine.

Every layer is doing exactly one job; together they form the defense-in-depth posture that no single layer can provide. When an attacker finds a bug in any one of them — and they will — the next layer up is what determines whether the bug becomes an incident or stays an interesting log entry.

!!! mascot-celebration "What You Can Now Do"
    <img src="../../img/mascot/celebration.png" class="mascot-admonition-img" alt="Sentinel celebrating">
    You can now read the security posture of a Linux system end-to-end: kernel hardening, the three foundational memory protections, the four access-control models and where each fits, the difference between SELinux and AppArmor, and how containers and VMs trade isolation strength for performance. The next chapter takes this stack to the cloud and folds in the monitoring layer that watches it operate.

## Key Takeaways

- **The kernel is the most privileged code on the machine.** Every other security control rests on it being correct. Reduce its attack surface, sign its modules, and patch it.
- **Process isolation rests on virtual address spaces, file-descriptor tables, and the user/kernel privilege boundary.** Side channels can still cross even hard boundaries.
- **Memory protections — DEP, ASLR, stack canaries — do not eliminate memory bugs; they raise the cost of exploiting them.** Use them all; they compose.
- **Four access-control models cover almost everything:** DAC (owner-set, classic Unix), MAC (system-set, defense-grade), RBAC (role-based, enterprise-friendly), ABAC (attribute-based, expressive). Most real systems mix them.
- **Linux file permissions are DAC.** SELinux and AppArmor add a MAC layer on top; the two MAC implementations differ in policy model (labels vs. paths) but serve the same goal.
- **Hypervisors give strong isolation at higher cost; containers give lighter isolation at lower cost.** VM escape is rare but devastating; container escape is more feasible and is the threat model containers are designed against.
- **Containers are not one feature.** They are a composition of namespaces, cgroups, capabilities, seccomp, and MAC. A container with any of those layers off is much weaker than one with all on.
- **Kubernetes adds cluster-level concerns** — RBAC, Pod Security Standards, NetworkPolicy, secrets management, admission control — and most real Kubernetes incidents trace to one of these being misconfigured rather than to a novel exploit.
