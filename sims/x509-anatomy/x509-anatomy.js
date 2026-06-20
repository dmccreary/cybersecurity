// CANVAS_HEIGHT: 685
// Anatomy of an X.509 Certificate — static SVG credential infographic.
// A TLS server certificate drawn top-to-bottom like a physical credential: a
// blue header band, eight hoverable fields (Subject, SAN, Subject Public Key,
// Issuer, Validity, Serial Number, Key Usage, Extended Key Usage), and a slate
// footer signature band. A rust-orange key icon links the Subject Public Key
// field to a callout for the server's private key (kept on the server, never
// transmitted). Bloom: Understand. Interaction = rich hover tooltips per field
// (HTML content, no animation). Responsive: SVG scales with width; the floating
// tooltip is clamped in-bounds and hidden on resize.

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
