---
title: Anatomy of an X.509 Certificate
description: Anatomy of an X.509 Certificate
status: scaffold
library: Static SVG with hover tooltips
bloom_level: TBD
---

# Anatomy of an X.509 Certificate



<iframe src="main.html" width="100%" height="600"></iframe>

[Run MicroSim in Fullscreen](main.html){ .md-button .md-button--primary }

## Specification

The full specification below is extracted from
[Chapter 4: "Cryptography in Practice: PKI, TLS, and Data Protection"](../../chapters/04-crypto-in-practice/index.md).

```text
Type: infographic-svg
**sim-id:** x509-anatomy<br/>
**Library:** Static SVG with hover tooltips<br/>
**Status:** Specified

A vertical document layout styled like a physical credential, with hover tooltips on each field explaining its meaning.

Header band (cybersecurity blue #1565c0, white text): "X.509 Certificate v3"

Body fields (each with hover tooltip):

1. **Subject:** CN=www.example.com, O=Example Corp, C=US
   - Tooltip: "Identity this certificate authenticates. Browsers match the URL hostname against this field."
2. **Subject Alternative Names:** DNS:www.example.com, DNS:example.com
   - Tooltip: "Additional hostnames the certificate covers. Modern browsers require this; CN alone is ignored."
3. **Subject Public Key:** ECDSA P-256 (compressed point shown)
   - Tooltip: "The public key being bound to the subject. The corresponding private key lives on the server."
4. **Issuer:** CN=Example Intermediate CA, O=Example Trust Services
   - Tooltip: "The CA that signed this certificate. Look up the issuer's certificate to verify the chain."
5. **Validity:** 2026-04-25 to 2027-04-25 (one year)
   - Tooltip: "Certificates expire. Short validity reduces the window during which a compromised certificate can be misused."
6. **Serial Number:** 0x4d3e:f2a1:88c0:1234
   - Tooltip: "Unique identifier within the issuer. Used in revocation lists to point at a specific certificate."
7. **Key Usage:** Digital Signature, Key Encipherment
   - Tooltip: "Restricts what the key may be used for. A TLS server certificate cannot be used as a code-signing certificate."
8. **Extended Key Usage:** TLS Server Authentication
   - Tooltip: "Further narrows the role. Browsers reject certificates without this EKU for HTTPS."

Footer band (slate steel #455a64, white text): "Issuer's signature: 30:45:02:21:00... (ECDSA over all fields above)"

A small key-icon graphic on the right side links the "Subject Public Key" field to a "Server's private key (kept on the server, never transmitted)" callout.

Color: cybersecurity blue, slate steel, white, with rust orange accent on the signature footer. Responsive: scales to viewport width; tooltips collapse to expand-on-tap on mobile.

Implementation: Static SVG with embedded CSS hover styles and accessible tooltips.
```

## Related Resources

- [Chapter 4: "Cryptography in Practice: PKI, TLS, and Data Protection"](../../chapters/04-crypto-in-practice/index.md)
