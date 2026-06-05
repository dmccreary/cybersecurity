// CANVAS_HEIGHT: 1215
// IoT Device Security Stack — Mermaid flowchart TB. A representative IoT device
// drawn bottom (immutable silicon = hardware root of trust) to top (application
// code), with an amber mutual-TLS channel rising to the cloud backend. Bloom:
// Understand. Interaction = hover tooltips per layer (no animation). Two side
// annotations explain that trust diminishes and blast radius grows upward.

const nodeInfo = {
  'SI': 'Silicon — immutable boot ROM, fuses, and an optional PUF (physically unclonable function) provide the hardware root of trust. It cannot be re-flashed, so an attacker cannot replace it; everything above is verified relative to it.',
  'BOOT': 'Secure Boot Loader — signed code that cryptographically verifies the signature of the next stage (the firmware) before executing it. A broken or unsigned boot loader lets an attacker boot arbitrary firmware.',
  'FW': 'Firmware — the device\'s main logic. It is signed and anti-rollback protected (it refuses older, vulnerable versions) and is OTA-updatable. Firmware is one of the two most-attacked layers.',
  'OS': 'OS / RTOS — FreeRTOS, Zephyr, or embedded Linux. Provides whatever process isolation exists; many small IoT devices have little or none, so a single bug can take the whole device.',
  'APP': 'Application Code — the top-of-stack business logic and the layer most exposed to network input. Together with firmware it is where most real-world IoT attacks land.',
  'CLOUD': 'Cloud Backend / Device Management Plane — the identity registry, OTA orchestration, and attestation verifier for the whole fleet. Its blast radius is the entire device population, so it is the highest-value target.'
};

(function () {
  'use strict';
  const tooltip = document.getElementById('tooltip');

  function position(e) {
    const x = e.clientX + 16, y = e.clientY + 16;
    const r = tooltip.getBoundingClientRect();
    tooltip.style.left = Math.min(x, window.innerWidth - r.width - 16) + 'px';
    tooltip.style.top = Math.min(y, window.innerHeight - r.height - 16) + 'px';
  }

  function setup() {
    document.querySelectorAll('.node').forEach(node => {
      const id = node.id.replace('flowchart-', '').split('-')[0];
      if (!nodeInfo[id]) return;
      node.addEventListener('mouseenter', () => {
        tooltip.textContent = nodeInfo[id];
        tooltip.classList.add('visible');
      });
      node.addEventListener('mousemove', position);
      node.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
    });
  }

  function waitForMermaid() {
    const m = document.querySelector('.mermaid');
    if (m && m.querySelector('svg') && document.querySelectorAll('.node').length > 0) {
      setup();
    } else {
      setTimeout(waitForMermaid, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
  } else {
    setTimeout(waitForMermaid, 100);
  }
})();
