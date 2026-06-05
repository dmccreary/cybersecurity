---
title: IAM Request Flow
description: A Mermaid sequence diagram of a federated login (SAML / OIDC) across four lanes — User, Browser, Identity Provider, and Service Provider — showing how the IdP authenticates and the SP authorizes via a signed identity token.
image: /sims/iam-request-flow/iam-request-flow.png
og:image: /sims/iam-request-flow/iam-request-flow.png
twitter:image: /sims/iam-request-flow/iam-request-flow.png
social:
   cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# IAM Request Flow

![IAM Request Flow](./iam-request-flow.png)

<iframe src="main.html" width="100%" height="622" scrolling="no"></iframe>

[Run the IAM Request Flow MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/iam-request-flow/main.html" height="622" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This sequence diagram traces a **federated login** — the pattern behind "Sign in
with your company account," SAML, and OpenID Connect — across four lanes: the
**User**, their **Browser**, the **Identity Provider (IdP)**, and the
**Service Provider (SP)** they are trying to reach. Read the numbered messages
top to bottom: the browser asks the SP for a protected page, the SP redirects to
the IdP, the IdP (and *only* the IdP) collects the password and MFA factor, then
mints a **signed identity token** and sends the browser back to the SP. The SP
verifies that token and serves the resource.

The central idea is the division of trust: the **IdP authenticates** (it proves
who you are) and the **SP authorizes** (it decides what you may do), and the two
communicate only through a token the SP can cryptographically verify. Hover any
message arrow to see why that step exists, or hover an actor lane to see what it
is and is not trusted with. The note over the SP lane explains the three checks
that make the token trustworthy — **signature**, **expiry**, and **audience** —
each of which closes off a specific attack.

## Lesson Plan

**Learning objective (Bloom — Understand):** Students can describe the sequence of
messages in a federated authentication flow and explain why the Service Provider
trusts a signed identity token rather than handling credentials itself.

**Suggested classroom use:** Walk the numbered steps as a class, pausing at step 3
(the redirect) to ask "why does the SP hand the user off instead of asking for the
password?" Then hover the SP verification note and name the attack each of the
three token checks prevents.

**Discussion questions:**

1. Why is it safer for the SP to *never* see the user's password, even though it
   ultimately decides whether to grant access?
2. What attack does checking the token's **audience** prevent that checking only
   the signature would miss?
3. The IdP is a single point of trust for many applications. What is the blast
   radius if the IdP's signing key is stolen?

## References

- [Identity and access management (Wikipedia)](https://en.wikipedia.org/wiki/Identity_management)
- [Security Assertion Markup Language (SAML) (Wikipedia)](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language)
- [OpenID Connect (Wikipedia)](https://en.wikipedia.org/wiki/OpenID_Connect)

## Specification

The full specification below is extracted from
[Chapter 12: "Human Security: Identity, Authentication, and Social Engineering"](../../chapters/12-human-security/index.md).

```text
Type: workflow-diagram
**sim-id:** iam-request-flow<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A horizontal sequence diagram with four lanes: User, Browser/Client, Identity Provider (IdP), Service Provider (SP).

1. User → Browser: Visits SP application URL.
2. Browser → SP: GET /protected-resource (no session).
3. SP → Browser: 302 redirect to IdP with an authentication request.
4. Browser → IdP: Authentication request.
5. IdP ↔ User: Prompts for credentials (password + MFA).
6. IdP → Browser: Issues signed identity token; redirects back to SP.
7. Browser → SP: Presents identity token.
8. SP: Verifies token signature, extracts claims (user id, groups, expiry).
9. SP → Browser: Returns the protected resource.

Annotations on the side: "IdP authenticates. SP authorizes. The token is the only thing the SP trusts about who the user is — so its signature, expiry, and audience all matter."

Color: cybersecurity blue (#1565c0) for IdP lane, slate (#455a64) for SP lane, white for user/browser. Responsive: vertical stacking under 700px viewport.

Implementation: Mermaid sequenceDiagram with custom theme colors.
```

## Related Resources

- [Chapter 12: "Human Security: Identity, Authentication, and Social Engineering"](../../chapters/12-human-security/index.md)
