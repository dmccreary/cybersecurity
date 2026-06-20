// CANVAS_HEIGHT: 975
// The Purdue Model — Mermaid flowchart TB with seven stacked layers: enterprise
// IT at the top (slate), the IT/OT DMZ (amber, the firewalled boundary), the
// operations/control layers (blue), and the physical process at the bottom
// (cream). Bloom: Understand. Interaction = hover tooltips per layer (no
// animation). A side legend shows the IT-vs-OT CIA priority inversion.

const nodeInfo = {
  'L5': 'Level 5 — Enterprise Network: ordinary corporate IT (email, ERP, internet access). Internet-facing and the highest-traffic layer, so it is treated as the least trusted relative to the plant floor.',
  'L4': 'Level 4 — Business Logistics: plant-level business systems such as production scheduling and inventory. Still IT in character, but specific to running the site.',
  'DMZ': 'IT / OT DMZ: the controlled boundary between the enterprise and the plant. It holds a data-historian replica, jump hosts, and security monitoring. No host on one side opens a direct session to the other; everything is brokered and inspected here.',
  'L3': 'Level 3 — Operations Management: engineering workstations, historians, and the MES (manufacturing execution system) that coordinate production. The top of the OT (operational technology) zone.',
  'L2': 'Level 2 — Supervisory Control: HMIs (human-machine interfaces) and SCADA servers that operators use to watch and command the process.',
  'L1': 'Level 1 — Basic Control: the PLCs and DCS controllers that execute the control logic, reading sensors and driving actuators in real time.',
  'L0': 'Level 0 — Physical Process: the physical world — sensors, actuators, pumps, valves. A fault here has real-world safety consequences, which is why availability and integrity outrank confidentiality in OT.'
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
