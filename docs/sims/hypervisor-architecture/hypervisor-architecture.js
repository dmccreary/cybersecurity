// Hypervisor Architecture and the Trust Boundary — Static SVG, two stacks.
// CANVAS_HEIGHT: 520
// Bloom: Understand. Two side-by-side stacks (Type 1 bare-metal vs Type 2
// hosted) show where the trust boundary sits and how the attack surface differs.
// Hovering a band reveals a short explanation.

(function () {
  const tooltip = document.getElementById('tooltip');
  const bands = document.querySelectorAll('.band');

  function showTip(evt, text) {
    tooltip.textContent = text;
    tooltip.classList.add('show');
    moveTip(evt);
  }
  function moveTip(evt) {
    const pad = 14;
    let x = evt.pageX + pad;
    let y = evt.pageY + pad;
    const r = tooltip.getBoundingClientRect();
    const maxX = window.scrollX + document.documentElement.clientWidth - r.width - 8;
    if (x > maxX) x = evt.pageX - r.width - pad;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  }
  function hideTip() { tooltip.classList.remove('show'); }

  bands.forEach(function (g) {
    const tip = g.getAttribute('data-tip');
    if (!tip) return;
    g.addEventListener('mouseenter', function (e) { showTip(e, tip); });
    g.addEventListener('mousemove', moveTip);
    g.addEventListener('mouseleave', hideTip);
    g.addEventListener('click', function (e) {
      if (tooltip.classList.contains('show') && tooltip.textContent === tip) hideTip();
      else showTip(e, tip);
    });
  });
})();
