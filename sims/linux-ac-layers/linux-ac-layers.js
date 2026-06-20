// CANVAS_HEIGHT: 830
// Linux Access-Control Layers — Mermaid flowchart TD. A single read() syscall
// travels through three AND-composed gates: DAC (file permissions), Linux
// capabilities, then MAC (AppArmor/SELinux). Left chain: read(/etc/shadow) is
// denied at the first gate. Right chain: read(index.html) clears all three.
// Bloom: Understand. Interaction = hover tooltips per box (no animation).

const nodeInfo = {
  'PROC': 'The acting process: the Apache web server, running as UID apache under the AppArmor/SELinux label httpd_t. Both its UID and its security label will be checked.',
  'DAC1': 'Discretionary Access Control — classic owner/group/other permission bits. /etc/shadow is mode 0640 owned by root:shadow. The apache user is neither the owner nor in the shadow group, and "other" has no read bit, so DAC denies immediately.',
  'CAP1': 'Linux capability check — CAP_DAC_READ_SEARCH would let a process bypass file-read permission checks. The httpd process does not hold it, so even this override is unavailable.',
  'MAC1': 'Mandatory Access Control — AppArmor/SELinux policy. Even if DAC had permitted the read, the policy does not allow httpd_t to read shadow_t, so MAC would deny it. MAC cannot be relaxed by the file owner.',
  'DENY': 'Result: the kernel returns EACCES (permission denied) and the attempt is recorded in audit.log. The read never reaches the file contents.',
  'DAC2': 'Discretionary Access Control — /var/www/html/index.html is mode 0644, world-readable. The "other" read bit is set, so DAC permits the apache user to read it.',
  'CAP2': 'Capability check — not relevant here because DAC already granted access; no capability override is needed.',
  'MAC2': 'Mandatory Access Control — policy allows httpd_t to read httpd_sys_content_t (the label of web content). MAC permits the read.',
  'ALLOW': 'Result: all three gates passed, so the kernel returns the file contents and the read succeeds.'
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
