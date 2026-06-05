---
title: IoT Device Security Stack
description: A Mermaid flowchart of a representative IoT device drawn from the immutable silicon root of trust up through boot loader, firmware, OS, and application code, with a mutual-TLS channel to the cloud management plane.
image: /sims/iot-security-stack/iot-security-stack.png
og:image: /sims/iot-security-stack/iot-security-stack.png
twitter:image: /sims/iot-security-stack/iot-security-stack.png
social:
   cards: false
status: review
library: Mermaid
bloom_level: Understand
---

# IoT Device Security Stack

![IoT Device Security Stack](./iot-security-stack.png)

<iframe src="main.html" width="100%" height="1217" scrolling="no"></iframe>

[Run the IoT Security Stack MicroSim Fullscreen](main.html){ .md-button .md-button--primary }

You can include this MicroSim on your own website with the following `iframe`:

```html
<iframe src="https://dmccreary.github.io/cybersecurity/sims/iot-security-stack/main.html" height="1217" width="100%" scrolling="no"></iframe>
```

## About this MicroSim

This diagram shows the **security stack of a representative IoT device** as a
vertical chain, drawn the way trust is actually established: from the bottom up.
At the base is the **silicon** — immutable boot ROM, fuses, and a PUF — which is
the **hardware root of trust** and cannot be re-flashed. Each layer above it is
verified relative to the one below: the **secure boot loader** checks the
**firmware** signature, the firmware loads the **OS / RTOS**, and the **OS**
hosts the **application code**. An amber arrow rising out of the device
represents the **mutual-TLS channel** — secured with a device-bound key from a
secure element — that connects to the **cloud backend** managing the whole fleet.

Two ideas are worth holding together as you read. **Trust diminishes upward:**
the silicon is the hardest layer to subvert, while firmware and application code
are the most attacked because they change and are reachable over the network.
**Blast radius grows upward:** a single device's firmware compromise affects one
device, but a backend compromise can reach the entire fleet at once — which is
why the cloud management plane is the highest-value target. Hover any layer to
read its specific security role.

## Lesson Plan

**Learning objective (Bloom — Understand):** Students can identify the layers of
an IoT device security stack from the hardware root of trust to the cloud
management plane and explain why trust diminishes and blast radius grows upward.

**Suggested classroom use:** Read the stack bottom-up, hovering each layer. Then
ask students to point to the layer they would attack if they wanted to (a) take
over one device versus (b) take over the whole fleet, and justify each choice.

**Discussion questions:**

1. Why must the silicon root of trust be immutable rather than updatable?
2. Firmware is signed *and* anti-rollback protected. What attack does anti-rollback
   specifically defend against that signing alone does not?
3. The OTA / firmware channel is drawn in amber because it is the most common
   attack surface. Why does being remotely updatable make it both valuable and
   dangerous?

## References

- [Internet of things — Security (Wikipedia)](https://en.wikipedia.org/wiki/Internet_of_things#Security)
- [Hardware security module (Wikipedia)](https://en.wikipedia.org/wiki/Hardware_security_module)
- [Trusted Computing — Root of trust (Wikipedia)](https://en.wikipedia.org/wiki/Trusted_Computing)

## Specification

The full specification below is extracted from
[Chapter 7: "Component and Hardware Security"](../../chapters/07-component-security/index.md).

```text
Type: diagram
**sim-id:** iot-security-stack<br/>
**Library:** Mermaid<br/>
**Status:** Specified

A vertical layered diagram of a representative IoT device, with each layer annotated for its security role.

From bottom to top:

1. **Silicon (immutable boot ROM, fuses, PUF)** — slate steel — caption: "Hardware root of trust. Cannot be re-flashed."
2. **Secure Boot Loader (signed)** — cybersecurity blue — caption: "Verifies next stage signature."
3. **Firmware (signed, version-anti-rolled-back)** — cybersecurity blue — caption: "Application logic. OTA-updatable."
4. **OS / RTOS (FreeRTOS, Zephyr, embedded Linux)** — cybersecurity blue — caption: "Process isolation, if any."
5. **Application code** — cybersecurity blue
6. **TLS-based communication channel** — drawn as an arrow leaving the device upward — caption: "Mutual TLS to backend, device-bound key from secure element."
7. **Cloud backend / Device management plane** — drawn at the top as a separate box — caption: "Identity registry, OTA orchestration, attestation verifier."

On the right side, a vertical bar shows "trust diminishes upward — most attacks target firmware and application." On the left side, a vertical bar shows "blast radius grows upward — a backend compromise hits the whole fleet."

Color: cybersecurity blue for layers, slate steel for the immutable silicon, amber for the OTA channel (because that is the most common attack surface).

Responsive: vertical stack on all viewports; annotations move below boxes on narrow screens.

Implementation: Mermaid `flowchart TB` with subgraphs for the device and backend.
```

## Related Resources

- [Chapter 7: "Component and Hardware Security"](../../chapters/07-component-security/index.md)
