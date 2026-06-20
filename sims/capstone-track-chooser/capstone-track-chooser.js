// Choosing a Capstone Track — Static SVG decision tree with hover tooltips.
// CANVAS_HEIGHT: 600
// Bloom: Understand. The learner reads the three branches and hovers each
// deliverable to reveal its estimated weeks of effort, then matches a track to
// the kind of work they want to do.

(function () {
  const tooltip = document.getElementById('tooltip');
  const delivs = document.querySelectorAll('.deliv');

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
  function hideTip() {
    tooltip.classList.remove('show');
  }

  delivs.forEach(function (g) {
    const tip = g.getAttribute('data-tip');
    g.addEventListener('mouseenter', function (e) { showTip(e, tip); });
    g.addEventListener('mousemove', moveTip);
    g.addEventListener('mouseleave', hideTip);
    // touch / click support for tablets
    g.addEventListener('click', function (e) {
      if (tooltip.classList.contains('show') && tooltip.textContent === tip) {
        hideTip();
      } else {
        showTip(e, tip);
      }
    });
  });
})();
