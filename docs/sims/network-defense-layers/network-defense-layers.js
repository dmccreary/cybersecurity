// CANVAS_HEIGHT: 620
// Network Defense in Depth — static SVG of six nested trust zones from the
// untrusted internet (outer) to the crown jewels (inner), with trust-boundary
// controls labeled between rings and an arrow legend for ingress / egress /
// lateral movement. Bloom: Understand. Interaction = hover tooltips per zone
// (no animation). Responsive: the SVG scales with width and the legend stacks
// below the diagram under 700px (CSS media query); a resize listener keeps the
// tooltip clamped in bounds.

(function () {
  'use strict';

  function wireTooltips() {
    const tip = document.getElementById('tip');
    if (!tip) return;

    function show(e) {
      const t = e.target.closest('[data-tip]');
      if (!t) { tip.style.opacity = '0'; return; }
      tip.textContent = t.getAttribute('data-tip');
      tip.style.opacity = '1';
      move(e);
    }
    function move(e) {
      const px = e.touches ? e.touches[0].clientX : e.clientX;
      const py = e.touches ? e.touches[0].clientY : e.clientY;
      const x = px + 14, y = py + 14;
      const w = tip.offsetWidth || 280;
      const h = tip.offsetHeight || 60;
      tip.style.left = Math.min(x, window.innerWidth - w - 12) + 'px';
      tip.style.top = Math.min(y, window.innerHeight - h - 12) + 'px';
    }
    document.addEventListener('mousemove', show);
    document.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
    document.addEventListener('touchstart', show, { passive: true });
    // Spec: respond to window resize — hide the tooltip so it never strands
    // off-canvas after a reflow.
    window.addEventListener('resize', () => { tip.style.opacity = '0'; });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireTooltips);
  } else { wireTooltips(); }
})();
