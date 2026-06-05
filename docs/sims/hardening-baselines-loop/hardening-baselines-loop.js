// CANVAS_HEIGHT: 720
// Hardening, Baselines, and Drift — Mermaid flowchart TD modeling the
// configuration-hardening feedback loop. Bloom: Understand. Interaction = hover
// tooltips (no animation). Four primary cycle nodes (blue), two outside
// influences plus the CIS reference (slate), and Drift Detection highlighted in
// amber as the place ops attention concentrates. The cycle closes when drift
// findings revise the baseline.

const nodeInfo = {
  'CIS': 'CIS Benchmarks — an external, community-maintained reference of hardening recommendations. It seeds the baseline but is not the baseline itself; each organization tailors it.',
  'VULN': 'New vulnerabilities and patches — when a new CVE or patch lands, the baseline must evolve to require the fix. The loop is never "done".',
  'AUD': 'Auditors and compliance frameworks — regulatory requirements (PCI DSS, HIPAA, FedRAMP) feed additional mandatory settings into the baseline.',
  'BASE': 'Baseline Configuration — the codified, named definition of "what hardened looks like for us". Everything in the loop revolves around keeping this current and enforced.',
  'CM': 'Configuration Management — applies the baseline to every host automatically and repeatably (Ansible, Puppet, or other infrastructure-as-code).',
  'DRIFT': 'Drift Detection — scanners measure the gap between each host\'s actual state and the baseline and report findings. This is where operational attention concentrates: every finding is either an exception to approve, a baseline to update, or a host to remediate.',
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
