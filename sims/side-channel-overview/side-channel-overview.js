// CANVAS_HEIGHT: 580
// Side-Channel Attack Surface — Static SVG radial infographic with hover tooltips.
// Bloom: Understand. Interaction = hover/tap reveals (no animation). A CPU package
// at the center performs a crypto operation holding secret key K; four amber
// channels radiate to attacker icons (timing up, power/EM right, cache down,
// rowhammer left). The teaching point: the secret leaks through PHYSICAL side
// effects, not the logical interface. Responsive: radial layout collapses to a
// vertical list below 700px; a resize listener re-renders.

(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const C = {
    chip: '#1565c0', chipBorder: '#0d47a1', board: '#455a64',
    leak: '#ffa000', attacker: '#c62828', text: '#263238', green: '#2e7d32'
  };

  const CHANNELS = [
    { key: 'timing', dir: 'up', title: 'Timing channel',
      arrow: 'execution time (cycles, ms)', icon: 'stopwatch',
      tip: 'Timing channel: the operation takes different amounts of time depending ' +
        'on secret-dependent branches or memory accesses. Real example: timing attacks ' +
        'on naive RSA / AES; remote timing of TLS. Defense: constant-time code.' },
    { key: 'power', dir: 'right', title: 'Power / EM channel',
      arrow: 'current draw, EM field', icon: 'scope',
      tip: 'Power & electromagnetic channel: instantaneous current draw and radiated EM ' +
        'correlate with the data being processed. Real example: DPA on smartcards; faulTPM ' +
        'voltage/EM glitching of TPMs. Defense: masking, shielding, decoupling.' },
    { key: 'cache', dir: 'down', title: 'Cache channel',
      arrow: 'shared cache state', icon: 'vm',
      tip: 'Cache channel: a co-tenant observes which cache lines were evicted to infer ' +
        'secret-dependent accesses. Real example: Flush+Reload, Prime+Probe, Spectre/Meltdown. ' +
        'Defense: no co-tenancy for sensitive work, cache partitioning.' },
    { key: 'rowhammer', dir: 'left', title: 'Rowhammer (fault)',
      arrow: 'induced bit flips in DRAM', icon: 'hammer',
      tip: 'Rowhammer: rapidly writing adjacent DRAM rows induces bit flips in a victim row — ' +
        'a fault-injection side channel that corrupts data the attacker cannot address directly. ' +
        'Defense: ECC RAM, Target Row Refresh (TRR), higher refresh rates.' }
  ];

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
    const t = el('text', Object.assign({ x, y, fill: C.text, 'font-size': 12,
      'text-anchor': 'middle' }, attrs || {}));
    t.textContent = s;
    svg.appendChild(t);
    return t;
  }
  function arrowDefs(svg) {
    const defs = document.createElementNS(SVG_NS, 'defs');
    const m = el('marker', { id: 'ah', markerWidth: 9, markerHeight: 9, refX: 7,
      refY: 3, orient: 'auto', markerUnits: 'strokeWidth' });
    m.appendChild(el('path', { d: 'M0,0 L7,3 L0,6 Z', fill: C.leak }));
    defs.appendChild(m);
    // two-way marker (start) for rowhammer
    const m2 = el('marker', { id: 'ah2', markerWidth: 9, markerHeight: 9, refX: 2,
      refY: 3, orient: 'auto', markerUnits: 'strokeWidth' });
    m2.appendChild(el('path', { d: 'M7,0 L0,3 L7,6 Z', fill: C.leak }));
    defs.appendChild(m2);
    svg.appendChild(defs);
  }

  // attacker icon glyphs (small, drawn at a center point)
  function attacker(svg, cx, cy, kind, label) {
    const g = el('g', {});
    g.appendChild(el('circle', { cx, cy, r: 22, fill: '#fdecea', stroke: C.attacker, 'stroke-width': 2 }));
    if (kind === 'stopwatch') {
      g.appendChild(el('circle', { cx, cy: cy + 2, r: 9, fill: 'none', stroke: C.attacker, 'stroke-width': 2 }));
      g.appendChild(el('line', { x1: cx, y1: cy + 2, x2: cx, y2: cy - 4, stroke: C.attacker, 'stroke-width': 2 }));
      g.appendChild(el('line', { x1: cx, y1: cy + 2, x2: cx + 5, y2: cy + 4, stroke: C.attacker, 'stroke-width': 2 }));
      g.appendChild(el('line', { x1: cx, y1: cy - 12, x2: cx, y2: cy - 9, stroke: C.attacker, 'stroke-width': 2 }));
    } else if (kind === 'scope') {
      g.appendChild(el('rect', { x: cx - 10, y: cy - 7, width: 20, height: 14, rx: 2, fill: 'none', stroke: C.attacker, 'stroke-width': 2 }));
      g.appendChild(el('path', { d: 'M' + (cx - 7) + ',' + cy + ' L' + (cx - 3) + ',' + (cy - 4) + ' L' + (cx + 1) + ',' + (cy + 4) + ' L' + (cx + 5) + ',' + (cy - 3) + ' L' + (cx + 8) + ',' + cy, fill: 'none', stroke: C.attacker, 'stroke-width': 1.6 }));
    } else if (kind === 'vm') {
      g.appendChild(el('rect', { x: cx - 10, y: cy - 8, width: 20, height: 16, rx: 2, fill: 'none', stroke: C.attacker, 'stroke-width': 2 }));
      g.appendChild(el('line', { x1: cx, y1: cy - 8, x2: cx, y2: cy + 8, stroke: C.attacker, 'stroke-width': 1.4 }));
    } else if (kind === 'hammer') {
      g.appendChild(el('rect', { x: cx - 9, y: cy - 8, width: 14, height: 5, rx: 1, fill: C.attacker }));
      g.appendChild(el('line', { x1: cx - 2, y1: cy - 3, x2: cx + 4, y2: cy + 9, stroke: C.attacker, 'stroke-width': 3 }));
    }
    svg.appendChild(g);
    txt(svg, cx, cy + 38, label, { 'font-size': 12, 'font-weight': 700, fill: C.attacker });
  }

  function chip(svg, cx, cy) {
    // board pad
    svg.appendChild(el('rect', { x: cx - 78, y: cy - 70, width: 156, height: 140, rx: 8,
      fill: '#eceff1', stroke: C.board, 'stroke-width': 2 },
      'The board / package boundary. Side-channel leaks cross this physical boundary even though no data crosses the logical interface.'));
    // chip
    svg.appendChild(el('rect', { x: cx - 60, y: cy - 52, width: 120, height: 104, rx: 6,
      fill: C.chip, stroke: C.chipBorder, 'stroke-width': 3 },
      'CPU package performing a cryptographic operation. The secret key K stays inside, but physical effects of computing on it leak outward.'));
    // pins
    for (let i = 0; i < 5; i++) {
      const px = cx - 44 + i * 22;
      svg.appendChild(el('rect', { x: px, y: cy + 52, width: 6, height: 12, fill: C.board }));
      svg.appendChild(el('rect', { x: px, y: cy - 64, width: 6, height: 12, fill: C.board }));
    }
    txt(svg, cx, cy - 24, 'CPU', { fill: '#fff', 'font-size': 16, 'font-weight': 800 });
    txt(svg, cx, cy - 6, 'crypto op in progress', { fill: '#e3f2fd', 'font-size': 10.5 });
    // lock + secret
    svg.appendChild(el('rect', { x: cx - 14, y: cy + 8, width: 28, height: 22, rx: 3, fill: '#fff8e1', stroke: '#ffa000', 'stroke-width': 2 }));
    svg.appendChild(el('path', { d: 'M' + (cx - 7) + ',' + (cy + 8) + ' a7,7 0 0 1 14,0', fill: 'none', stroke: '#ffa000', 'stroke-width': 2 }));
    txt(svg, cx, cy + 24, '🔑K', { fill: '#5a3d00', 'font-size': 11, 'font-weight': 700 });
    txt(svg, cx, cy + 46, 'secret key K', { fill: '#e3f2fd', 'font-size': 10.5 });
  }

  function leakArrow(svg, x1, y1, x2, y2, label, twoWay, tip, labelDx, labelDy) {
    const a = el('line', { x1, y1, x2, y2, stroke: C.leak, 'stroke-width': 3,
      'marker-end': 'url(#ah)' }, tip);
    if (twoWay) a.setAttribute('marker-start', 'url(#ah2)');
    svg.appendChild(a);
    const mx = (x1 + x2) / 2 + (labelDx || 0);
    const my = (y1 + y2) / 2 + (labelDy || 0);
    const t = el('text', { x: mx, y: my, 'text-anchor': 'middle', 'font-size': 11.5,
      fill: '#7a4f00', 'font-weight': 600 }, tip);
    t.textContent = label;
    svg.appendChild(t);
  }

  function renderRadial() {
    const W = 760, H = 540, cx = 380, cy = 270;
    const svg = el('svg', { class: 'diagram', viewBox: '0 0 ' + W + ' ' + H,
      preserveAspectRatio: 'xMidYMid meet', role: 'img',
      'aria-label': 'A CPU at the center leaking a secret through four side channels: timing (up), power and EM (right), cache (down), and rowhammer (left), each reaching an attacker.' });
    arrowDefs(svg);

    // arrows from chip edge to attackers
    // up - timing (arrow label to the right of the vertical arrow)
    leakArrow(svg, cx, cy - 74, cx, cy - 150, CHANNELS[0].arrow, false, CHANNELS[0].tip, 110, 4);
    attacker(svg, cx, cy - 178, 'stopwatch', 'Timing attacker');
    // right - power/EM (arrow label above the horizontal arrow)
    leakArrow(svg, cx + 80, cy, cx + 248, cy, CHANNELS[1].arrow, false, CHANNELS[1].tip, 0, -10);
    attacker(svg, cx + 278, cy, 'scope', 'Power / EM');
    // down - cache (arrow label to the right of the vertical arrow)
    leakArrow(svg, cx, cy + 74, cx, cy + 150, CHANNELS[2].arrow, false, CHANNELS[2].tip, 100, 4);
    attacker(svg, cx, cy + 178, 'vm', 'Co-tenant VM');
    // left - rowhammer (two-way; arrow label above the horizontal arrow)
    leakArrow(svg, cx - 80, cy, cx - 248, cy, CHANNELS[3].arrow, true, CHANNELS[3].tip, 0, -10);
    attacker(svg, cx - 278, cy, 'hammer', 'Rowhammer');

    // channel titles — placed at the midpoint of each arrow, clear of attacker labels
    txt(svg, cx - 70, cy - 112, CHANNELS[0].title, { 'font-size': 12.5, 'font-weight': 700, fill: C.leak });
    txt(svg, cx + 164, cy + 18, CHANNELS[1].title, { 'font-size': 12.5, 'font-weight': 700, fill: C.leak });
    txt(svg, cx - 66, cy + 114, CHANNELS[2].title, { 'font-size': 12.5, 'font-weight': 700, fill: C.leak });
    txt(svg, cx - 164, cy + 18, CHANNELS[3].title, { 'font-size': 12.5, 'font-weight': 700, fill: C.leak });

    chip(svg, cx, cy);
    return svg;
  }

  function renderList() {
    const rowH = 96, W = 360, H = 60 + CHANNELS.length * rowH;
    const svg = el('svg', { class: 'diagram', viewBox: '0 0 ' + W + ' ' + H,
      preserveAspectRatio: 'xMidYMid meet', role: 'img',
      'aria-label': 'Vertical list of the four side channels.' });
    // chip header
    svg.appendChild(el('rect', { x: 110, y: 8, width: 140, height: 40, rx: 6, fill: C.chip, stroke: C.chipBorder, 'stroke-width': 2 },
      'CPU holding secret key K. Physical side effects leak outward through four channels below.'));
    txt(svg, 180, 26, 'CPU + secret key K', { fill: '#fff', 'font-size': 12, 'font-weight': 700 });
    txt(svg, 180, 41, 'crypto op in progress', { fill: '#e3f2fd', 'font-size': 9.5 });

    CHANNELS.forEach((c, i) => {
      const y = 60 + i * rowH;
      svg.appendChild(el('rect', { x: 12, y, width: W - 24, height: rowH - 12, rx: 8,
        fill: '#fff', stroke: C.leak, 'stroke-width': 2 }, c.tip));
      const iconKind = c.icon;
      attacker(svg, 44, y + 38, iconKind, '');
      txt(svg, 78, y + 22, c.title, { 'text-anchor': 'start', 'font-size': 13.5, 'font-weight': 700, fill: C.leak });
      txt(svg, 78, y + 40, c.arrow, { 'text-anchor': 'start', 'font-size': 11.5, fill: '#7a4f00' });
      const hint = el('text', { x: 78, y: y + 58, 'text-anchor': 'start', 'font-size': 10.5, fill: '#607d8b' });
      hint.textContent = 'hover for real-world example';
      svg.appendChild(hint);
    });
    return svg;
  }

  let isList = null;
  function render() {
    const host = document.getElementById('diagram');
    if (!host) return;
    const list = host.clientWidth > 0 && host.clientWidth < 700;
    if (list === isList && host.firstChild) return;
    isList = list;
    host.innerHTML = '';
    host.appendChild(list ? renderList() : renderRadial());
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
      tip.style.left = Math.min(x, window.innerWidth - 280) + 'px';
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
