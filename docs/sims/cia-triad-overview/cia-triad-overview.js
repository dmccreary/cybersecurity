// CANVAS_HEIGHT: 600
// CIA Triad Overview — static SVG triangle + per-property cards with
// red threat / green control boxes. Bloom: Understand. Interaction = hover
// tooltips on the vertices (no animation). Responsive: cards stack below 600px.

(function () {
  'use strict';

  const properties = [
    {
      letter: 'C', name: 'Confidentiality',
      def: 'Only authorized parties can read the data.',
      threat: 'Eavesdropping on unencrypted traffic',
      control: 'AES-GCM encryption + access control',
    },
    {
      letter: 'I', name: 'Integrity',
      def: 'Data stays accurate and unaltered except by authorized changes.',
      threat: 'Tampering with a database row',
      control: 'Digital signatures + write-protected logs',
    },
    {
      letter: 'A', name: 'Availability',
      def: 'Authorized users can reach the service when they need it.',
      threat: 'DDoS flooding a public service',
      control: 'Load balancing + rate limiting',
    },
  ];

  function buildCards() {
    const host = document.getElementById('cards');
    if (!host) return;
    properties.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML =
        '<h2>' + p.letter + ' — ' + p.name + '</h2>' +
        '<p class="def">' + p.def + '</p>' +
        '<div class="row threat"><span class="tag">Threat</span>' + p.threat + '</div>' +
        '<div class="row control"><span class="tag">Control</span>' + p.control + '</div>';
      host.appendChild(card);
    });
  }

  function wireTooltips() {
    const tip = document.getElementById('tip');
    function show(e) {
      const t = e.target.closest('[data-tip]');
      if (!t) { tip.style.opacity = '0'; return; }
      tip.textContent = t.getAttribute('data-tip');
      tip.style.opacity = '1';
      move(e);
    }
    function move(e) {
      const x = (e.touches ? e.touches[0].clientX : e.clientX) + 14;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) + 14;
      tip.style.left = Math.min(x, window.innerWidth - 270) + 'px';
      tip.style.top = y + 'px';
    }
    document.addEventListener('mousemove', show);
    document.addEventListener('mouseleave', () => tip.style.opacity = '0');
    document.addEventListener('touchstart', show, { passive: true });
  }

  function init() { buildCards(); wireTooltips(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
