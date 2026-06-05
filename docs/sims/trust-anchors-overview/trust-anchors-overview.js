// CANVAS_HEIGHT: 690
// Hardware Trust Anchors on a Modern System — static SVG infographic + legend table.
// A board-level diagram of four hardware trust anchors: a TEE region (amber =
// depends on microcode), a Secure Enclave coprocessor (blue, runs only signed
// firmware), a discrete TPM chip (slate, off-CPU), and an external HSM appliance
// (off-board, FIPS 140-3 L3+). A Hardware Root of Trust badge anchors the chain
// in silicon. Below, a legend table compares each anchor's capability and threat
// model. Bloom: Understand. Interaction = rich hover tooltips per anchor (HTML
// content, no animation). Responsive: SVG scales with width; tooltip is clamped
// in-bounds and hides on resize.

(function () {
  'use strict';

  function wireTooltips() {
    const tip = document.getElementById('tip');
    if (!tip) return;

    function show(e) {
      const t = e.target.closest('[data-tip]');
      if (!t) { tip.style.opacity = '0'; return; }
      tip.innerHTML = t.getAttribute('data-tip');
      tip.style.opacity = '1';
      move(e);
    }
    function move(e) {
      const px = e.touches ? e.touches[0].clientX : e.clientX;
      const py = e.touches ? e.touches[0].clientY : e.clientY;
      const x = px + 14, y = py + 14;
      const w = tip.offsetWidth || 320;
      const h = tip.offsetHeight || 80;
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
