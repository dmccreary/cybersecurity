// CANVAS_HEIGHT: 700
// Threat Modeling Methodology Comparison — static SVG infographic + summary table.
// Three equal columns: STRIDE (blue, six threat categories each violating a
// security property), PASTA (slate, a seven-stage business-driven process), and
// Attack Trees (amber, a goal "Steal Customer Data" branching into three paths
// with one expanded). Below, an HTML summary table compares time, output, and
// best fit. Bloom: Understand. Interaction = hover tooltips per cell (no
// animation). Responsive: the SVG scales with width and the columns stack
// (via the diagram's intrinsic narrowing) below 800px; the floating tooltip is
// clamped in-bounds on resize.

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
      const w = tip.offsetWidth || 300;
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
