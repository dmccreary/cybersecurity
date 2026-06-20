// CANVAS_HEIGHT: 670
// DNSSEC Chain of Trust — Mermaid flowchart TD with a static resolver-steps
// panel and hover details. Bloom: Understand. The top-down tree shows each zone
// signing the next, anchored at the root KSK trust anchor (green). Hovering a
// node updates the detail box; the resolver validates the chain bottom-up.

const nodeInfo = {
  'Root': 'Root zone (.) — its Key Signing Key (KSK) is the trust anchor that every DNSSEC validator ships with out of band. The whole chain ultimately reduces to "does this match the anchor I already trust?"',
  'TLD': '.example TLD zone — the root publishes a DS (Delegation Signer) record that is a hash of the TLD KSK. That DS, signed by the root, is what links the TLD into the chain.',
  'Bank': 'bank.example zone — the .example TLD publishes a DS record pointing to bank.example KSK, extending the chain one level deeper.',
  'Rec': 'www.bank.example A record — returned to the resolver together with its RRSIG (the signature over the record made with the zone signing key).',
};

(function () {
  'use strict';
  const panel = document.getElementById('panel');
  const DEFAULT = 'Hover a zone above for details.';

  function setup() {
    document.querySelectorAll('.node').forEach(node => {
      const id = node.id.replace('flowchart-', '').split('-')[0];
      if (!nodeInfo[id]) return;
      node.addEventListener('mouseenter', () => { panel.textContent = nodeInfo[id]; });
      node.addEventListener('mouseleave', () => { panel.textContent = DEFAULT; });
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
