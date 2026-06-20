// CANVAS_HEIGHT: 1570
// Privacy Decision Tree — Mermaid flowchart TD. A reviewer walks this for each
// proposed data field: need it? minimize it? retain how long? shared? lawful
// basis? Decision nodes are blue, approve/use leaves slate, and the two
// "do not collect / do not share" stop leaves are alert-orange. Bloom:
// Understand/Apply. Interaction = hover tooltips mapping each node to the
// GDPR / CCPA principle it enforces (no animation).

const nodeInfo = {
  'Q1': 'Purpose limitation: collect personal data only for a specific, explicitly stated purpose. If you cannot name the purpose, you have no basis to collect the field. (GDPR Art. 5(1)(b); CCPA purpose-specification.)',
  'NO1': 'Do not collect. The cleanest privacy control is the data you never hold — there is nothing to leak, subpoena, or misuse.',
  'Q2': 'Data minimization: even for a valid purpose, prefer the least identifying form that still works — aggregate counts, a salted hash, or a derived flag instead of the raw identifier. (GDPR Art. 5(1)(c).)',
  'USE': 'Use the less-identifying form. Storing a hash or aggregate instead of the raw value shrinks the blast radius if the store is breached.',
  'Q3': 'Storage limitation: define the minimum retention period that satisfies the purpose, then delete. Indefinite retention is a liability, not an asset. (GDPR Art. 5(1)(e).)',
  'Q4': 'Decide whether the field leaves your control. Sharing with a third party multiplies the trust boundaries the data must cross and adds another party who can be breached.',
  'APPROVE1': 'Approve. Document the purpose, the retention window, and who may access the data — the record that makes the decision auditable later.',
  'Q5': 'Lawful basis for sharing: a third-party transfer needs both a data-processing agreement (DPA) binding the recipient and a lawful basis (consent, contract, legitimate interest). Without both, do not share. (GDPR Art. 6, Art. 28.)',
  'STOP2': 'Stop. Do not share. Lacking a DPA or lawful basis, sharing the data would itself be the violation — the safe action is to not transfer it.',
  'APPROVE2': 'Approve with annual review. Document the third-party scope, purpose, and DPA, and re-check it every year — sharing relationships drift over time.'
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
