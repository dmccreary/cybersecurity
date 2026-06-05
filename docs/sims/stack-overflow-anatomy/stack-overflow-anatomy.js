// CANVAS_HEIGHT: 520
// Stack Layout During a Buffer Overflow — static SVG infographic.
// Two stack frames side by side (Normal call vs Overflow), drawn stack-grows-down
// with high addresses on top. Slate = intact stack contents, red (#d84315) =
// attacker-controlled bytes, blue = annotations, grey = other frames. Bloom:
// Understand. Interaction = hover tooltips per stack cell, each naming the cell's
// role and which defense (stack canary, ASLR, DEP/NX) would have stopped the
// overflow there. No animation. Responsive: the SVG scales with width and fills
// the viewport below 700px; the floating tooltip is clamped in-bounds on resize.

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
