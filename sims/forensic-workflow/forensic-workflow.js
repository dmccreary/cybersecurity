// CANVAS_HEIGHT: 1620
// The Forensic Investigation Workflow — Mermaid flowchart TD with two decision
// diamonds and a parallel Chain-of-Custody-Log rail. Bloom: Understand.
// Interaction = hover tooltips on each step (no animation). Dashed edges from
// several steps to the LOG node show that every step writes to the custody log.

const nodeInfo = {
  'S1': 'Identify and Isolate — first responder photographs the scene in place, documents the device state, and isolates it from the network so evidence cannot be altered remotely.',
  'S2': 'Capture Volatile Data — RAM, running processes, and open network connections vanish at power-off, so they are captured first while the system is still live.',
  'D1': 'Power Decision — policy choice: take a live image first and then power off cleanly, or pull the plug to freeze disk state. Each trades off volatile data against on-disk consistency.',
  'S4': 'Forensic Imaging — connect through a hardware write-blocker, take a bit-for-bit copy of the media, and compute a SHA-256 hash so the copy can be proven identical later.',
  'D2': 'Verify Hashes Match — recompute the hash of the image and compare to the source. Match: continue. Mismatch: the image is unreliable, so re-image.',
  'S6': 'Examination Copy — all analysis is done on a working copy of the verified image. The original evidence is never touched, preserving its integrity.',
  'S7': 'Analysis — examine filesystem, registry, logs, memory, and network artifacts on the working copy to reconstruct what happened.',
  'S8': 'Reporting — write findings that tie each conclusion to specific evidence and its hashes, so an independent examiner can reproduce the result.',
  'S9': 'Court / Disclosure — present testimony and produce the chain-of-custody log showing every person who handled the evidence and every step taken.',
  'LOG': 'Chain of Custody Log — a continuous, tamper-evident record kept alongside every step. It documents who handled the evidence, when, and what they did; without it, evidence may be ruled inadmissible.',
};

(function () {
  'use strict';
  const tooltip = document.getElementById('tooltip');

  function position(e) {
    const x = e.clientX + 16;
    const y = e.clientY + 16;
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
