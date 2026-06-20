// CANVAS_HEIGHT: 470
// RTO and RPO Timeline — Static SVG infographic with hover tooltips.
// Bloom: Understand. Interaction = hover/tap reveals (no animation). A single
// incident marker anchors two business-continuity objectives: RPO looks BACK
// (the data-loss window, amber) and RTO looks FORWARD (the downtime window,
// slate). Two callout boxes frame the question each objective answers.
// Responsive: a horizontal timeline that rotates to a vertical layout below
// ~600px container width; a resize listener re-renders.

(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const C = {
    incident: '#d84315',
    rpo: '#ffa000',
    rto: '#455a64',
    callout: '#1565c0',
    text: '#263238',
    axis: '#90a4ae'
  };

  function el(name, attrs, tip) {
    const e = document.createElementNS(SVG_NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (tip) {
      e.setAttribute('data-tip', tip);
      e.classList.add('hot');
      const t = document.createElementNS(SVG_NS, 'title');
      t.textContent = tip;
      e.appendChild(t);
    }
    return e;
  }
  function txt(svg, x, y, s, attrs) {
    const t = el('text', Object.assign({ x, y, fill: C.text, 'font-size': 13 }, attrs || {}));
    t.textContent = s;
    svg.appendChild(t);
    return t;
  }

  // ---- horizontal layout (wide) ---------------------------------------------
  function renderWide() {
    const W = 900, H = 360;
    const svg = el('svg', {
      class: 'timeline', viewBox: '0 0 ' + W + ' ' + H,
      preserveAspectRatio: 'xMidYMid meet', role: 'img',
      'aria-label': 'Horizontal recovery timeline with an incident at the center, the RPO data-loss window to the left and the RTO downtime window to the right.'
    });

    const axisY = 220;
    const incX = 450;          // incident at center (time 0)
    const rpoX = 150;          // last good backup
    const rtoX = 770;          // system back online

    // baseline axis
    svg.appendChild(el('line', { x1: 70, y1: axisY, x2: 830, y2: axisY, stroke: C.axis, 'stroke-width': 2 }));
    txt(svg, 70, axisY + 34, 'time →', { 'font-size': 12, fill: C.axis });

    // ---- callout boxes (above the timeline) ----
    function callout(cx, label) {
      const w = 320, h = 52, x = cx - w / 2, y = 24;
      svg.appendChild(el('rect', { x, y, width: w, height: h, rx: 8, fill: C.callout }));
      const t1 = el('text', { x: cx, y: y + 22, 'text-anchor': 'middle', fill: '#fff', 'font-size': 14, 'font-weight': 700 });
      t1.textContent = label.head;
      svg.appendChild(t1);
      const t2 = el('text', { x: cx, y: y + 40, 'text-anchor': 'middle', fill: '#e3f2fd', 'font-size': 13 });
      t2.textContent = label.q;
      svg.appendChild(t2);
    }
    callout(300, { head: 'RPO answers:', q: 'How much data can we afford to lose?' });
    callout(620, { head: 'RTO answers:', q: 'How long can we be down?' });

    // ---- RPO band (amber, incident looking back) ----
    svg.appendChild(el('rect', {
      x: rpoX, y: axisY - 26, width: incX - rpoX, height: 52, rx: 4,
      fill: C.rpo, 'fill-opacity': 0.85
    }, 'RPO window: data written between the last recoverable backup and the incident is potentially lost. Smaller RPO means more frequent backups.'));
    txt(svg, (rpoX + incX) / 2, axisY + 4, 'data potentially lost', {
      'text-anchor': 'middle', fill: '#3e2723', 'font-size': 13, 'font-weight': 700
    });

    // ---- RTO band (slate, incident looking forward) ----
    svg.appendChild(el('rect', {
      x: incX, y: axisY - 26, width: rtoX - incX, height: 52, rx: 4,
      fill: C.rto, 'fill-opacity': 0.92
    }, 'RTO window: the business is degraded or down throughout this window, from the incident until the system is back online. Smaller RTO means faster recovery.'));
    txt(svg, (incX + rtoX) / 2, axisY + 4, 'system down / degraded', {
      'text-anchor': 'middle', fill: '#fff', 'font-size': 13, 'font-weight': 700
    });

    // ---- RPO point marker + clock ----
    marker(svg, rpoX, axisY, C.rpo, 'RPO point', 'last recoverable backup', true);
    // ---- RTO point marker + clock ----
    marker(svg, rtoX, axisY, C.rto, 'RTO point', 'system back online', true);

    // ---- incident bar (red, on top) ----
    svg.appendChild(el('rect', { x: incX - 4, y: axisY - 64, width: 8, height: 128, fill: C.incident },
      'INCIDENT (time 0): the outage, breach, or data corruption that starts the recovery clock.'));
    const inc = el('text', { x: incX, y: axisY - 72, 'text-anchor': 'middle', fill: C.incident, 'font-size': 15, 'font-weight': 800 });
    inc.textContent = 'INCIDENT';
    svg.appendChild(inc);

    return svg;
  }

  function marker(svg, x, y, color, label, sub, wide) {
    svg.appendChild(el('line', { x1: x, y1: y - 36, x2: x, y2: y + 36, stroke: color, 'stroke-width': 3 }));
    svg.appendChild(el('circle', { cx: x, cy: y, r: 6, fill: '#fff', stroke: color, 'stroke-width': 3 }));
    // clock glyph above
    const cy = y - 56;
    svg.appendChild(el('circle', { cx: x, cy, r: 11, fill: '#fff', stroke: color, 'stroke-width': 2 }));
    svg.appendChild(el('line', { x1: x, y1: cy, x2: x, y2: cy - 6, stroke: color, 'stroke-width': 2 }));
    svg.appendChild(el('line', { x1: x, y1: cy, x2: x + 5, y2: cy + 2, stroke: color, 'stroke-width': 2 }));
    txt(svg, x, y + 56, label, { 'text-anchor': 'middle', fill: color, 'font-size': 14, 'font-weight': 700 });
    txt(svg, x, y + 73, sub, { 'text-anchor': 'middle', fill: C.text, 'font-size': 11.5 });
  }

  // ---- vertical layout (narrow) ---------------------------------------------
  function renderTall() {
    const W = 360, H = 560;
    const svg = el('svg', {
      class: 'timeline', viewBox: '0 0 ' + W + ' ' + H,
      preserveAspectRatio: 'xMidYMid meet', role: 'img',
      'aria-label': 'Vertical recovery timeline with the incident at the center, the RPO window above and the RTO window below.'
    });
    const axisX = 60;
    const incY = 280, rpoY = 110, rtoY = 470;

    svg.appendChild(el('line', { x1: axisX, y1: 70, x2: axisX, y2: 510, stroke: C.axis, 'stroke-width': 2 }));

    // RPO band
    svg.appendChild(el('rect', { x: axisX - 18, y: rpoY, width: 36, height: incY - rpoY, rx: 4, fill: C.rpo, 'fill-opacity': 0.85 },
      'RPO window: data written between the last recoverable backup and the incident is potentially lost.'));
    // RTO band
    svg.appendChild(el('rect', { x: axisX - 18, y: incY, width: 36, height: rtoY - incY, rx: 4, fill: C.rto, 'fill-opacity': 0.92 },
      'RTO window: the business is down or degraded from the incident until the system is back online.'));

    // markers (vertical)
    function vmark(yy, color, label, sub) {
      svg.appendChild(el('circle', { cx: axisX, cy: yy, r: 6, fill: '#fff', stroke: color, 'stroke-width': 3 }));
      txt(svg, axisX + 26, yy - 2, label, { fill: color, 'font-size': 14, 'font-weight': 700 });
      txt(svg, axisX + 26, yy + 14, sub, { fill: C.text, 'font-size': 11.5 });
    }
    vmark(rpoY, C.rpo, 'RPO point', 'last recoverable backup');
    vmark(rtoY, C.rto, 'RTO point', 'system back online');

    // incident bar
    svg.appendChild(el('rect', { x: axisX - 36, y: incY - 4, width: 72, height: 8, fill: C.incident },
      'INCIDENT (time 0): the event that starts the recovery clock.'));
    txt(svg, axisX + 42, incY + 4, 'INCIDENT', { fill: C.incident, 'font-size': 15, 'font-weight': 800 });

    // band labels
    txt(svg, axisX + 26, (rpoY + incY) / 2, 'data potentially lost', { fill: '#3e2723', 'font-size': 12, 'font-weight': 700 });
    txt(svg, axisX + 26, (incY + rtoY) / 2, 'system down / degraded', { fill: C.rto, 'font-size': 12, 'font-weight': 700 });

    // callouts
    function vcall(yy, head, q) {
      const x = 150, w = 195, h = 44;
      svg.appendChild(el('rect', { x, y: yy, width: w, height: h, rx: 8, fill: C.callout }));
      const a = el('text', { x: x + w / 2, y: yy + 18, 'text-anchor': 'middle', fill: '#fff', 'font-size': 12.5, 'font-weight': 700 });
      a.textContent = head; svg.appendChild(a);
      const b = el('text', { x: x + w / 2, y: yy + 34, 'text-anchor': 'middle', fill: '#e3f2fd', 'font-size': 11 });
      b.textContent = q; svg.appendChild(b);
    }
    vcall(rpoY - 60, 'RPO answers:', 'How much data lost?');
    vcall(rtoY + 18, 'RTO answers:', 'How long are we down?');

    return svg;
  }

  let isTall = null;
  function render() {
    const host = document.getElementById('diagram');
    if (!host) return;
    const tall = host.clientWidth > 0 && host.clientWidth < 600;
    if (tall === isTall && host.firstChild) return;
    isTall = tall;
    host.innerHTML = '';
    host.appendChild(tall ? renderTall() : renderWide());
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

  function init() {
    render();
    wireTooltips();
    window.addEventListener('resize', render);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
