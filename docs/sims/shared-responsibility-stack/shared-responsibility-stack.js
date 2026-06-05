// CANVAS_HEIGHT: 660
// Shared Responsibility Across IaaS, PaaS, and SaaS — static SVG infographic.
// Four columns (On-Prem, IaaS, PaaS, SaaS), each a nine-layer stack colored
// slate (#455a64 = provider) or blue (#1565c0 = customer). As you move right,
// the provider absorbs more lower layers, but data, identity, and configuration
// always remain the customer's. Bloom: Understand. Interaction = hover tooltips
// per layer (no animation). Responsive: SVG scales with width; below 700px the
// SVG fills the viewport (CSS media query) and the floating tooltip is clamped
// in-bounds on resize.

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
      const w = tip.offsetWidth || 290;
      const h = tip.offsetHeight || 60;
      tip.style.left = Math.min(x, window.innerWidth - w - 12) + 'px';
      tip.style.top = Math.min(y, window.innerHeight - h - 12) + 'px';
    }
    document.addEventListener('mousemove', show);
    document.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
    document.addEventListener('touchstart', show, { passive: true });
    window.addEventListener('resize', () => { tip.style.opacity = '0'; });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireTooltips);
  } else { wireTooltips(); }
})();
