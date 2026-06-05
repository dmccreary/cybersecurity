// CANVAS_HEIGHT: 250
// Cyber Kill Chain Phases with Defensive Controls — Mermaid flowchart LR.
// Bloom: Understand. Interaction = hover tooltips listing the controls that
// disrupt each phase (no animation). The "Break the Chain" node feeds a dashed
// arrow into every phase to show defenders can win at any single phase.

const nodeInfo = {
  'Break': 'A defender does not have to stop every phase — disrupting any ONE phase breaks the chain and the attack fails. Earlier phases are cheaper to stop.',
  'P1': 'Reconnaissance — the attacker researches targets and the attack surface. Controls: external attack surface management, domain and brand monitoring.',
  'P2': 'Weaponization — the attacker pairs an exploit with a payload. Controls: threat intelligence, sandboxing, anti-exploit tooling.',
  'P3': 'Delivery — the weaponized payload is sent to the target. Controls: email security, URL filtering, attachment scanning.',
  'P4': 'Exploitation — the payload triggers a vulnerability to run code. Controls: patching, EDR, application allowlisting.',
  'P5': 'Installation — the attacker establishes persistence on the host. Controls: EDR, file integrity monitoring, persistence detection.',
  'P6': 'Command and Control — the implant calls home for instructions. Controls: egress filtering, DNS filtering, network detection.',
  'P7': 'Actions on Objectives — the attacker pursues the goal (exfiltration, encryption, fraud). Controls: data loss prevention, segmentation, anomaly detection.',
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
    const nodes = document.querySelectorAll('.node');
    nodes.forEach(node => {
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
