// CANVAS_HEIGHT: 770
// Vendor Risk Tiers — Static SVG concentric-ring infographic with hover tooltips.
// Bloom: Understand. Interaction = hover/tap reveals (no animation). The
// organization sits at the center; three concentric rings represent Tier-1
// (critical), Tier-2 (important), and Tier-3 (standard) vendors, with example
// vendor chips on each ring and the typical controls in a tooltip. A small
// "fourth-party" cluster sits outside the rings, joined to Tier-1 vendors by
// dotted lines (inherited subprocessor risk). Teaching point: tier the portfolio
// — one questionnaire for everyone is the wrong default. Responsive: the radial
// layout collapses to a vertical stacked list below 640px; a resize listener
// re-renders.

(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  const C = {
    org: '#1565c0', orgBorder: '#0d47a1',
    t1: '#455a64', t1Border: '#263238',
    t2: '#78909c', t2Border: '#546e7a',
    t3: '#fff3d6', t3Border: '#d6b656',
    chip: '#ffffff', chipBorder: '#90a4ae',
    fourth: '#eceff1', fourthBorder: '#90a4ae',
    text: '#263238', white: '#ffffff'
  };

  // Ring band labels are drawn near the TOP of each band; vendor chips are kept
  // OFF the top so they never collide with the band name. Angles are degrees,
  // 0 = right, 90 = down, -90 = up.
  const TIERS = [
    {
      key: 't1', name: 'Tier 1 — Critical', r: 240, labelDx: 0, labelDy: 26,
      fill: C.t1, border: C.t1Border, labelColor: C.white,
      tip: '<b>Tier 1 — Critical.</b> A failure or breach here could halt the business or expose customer data. Controls: annual SOC 2 review, executive escalation path, contractual SLAs, joint incident-response runbook.',
      vendors: [
        { label: 'Cloud platform', angle: -35 },
        { label: 'Payment processor', angle: 35 },
        { label: 'Identity provider', angle: 215 }
      ]
    },
    {
      key: 't2', name: 'Tier 2 — Important', r: 178, labelDx: 0, labelDy: 24,
      fill: C.t2, border: C.t2Border, labelColor: C.white,
      tip: '<b>Tier 2 — Important.</b> Real but contained impact. Controls: annual security questionnaire, quarterly review of public incidents, contract security review.',
      vendors: [
        { label: 'Monitoring', angle: 40 },
        { label: 'HR SaaS', angle: 215 },
        { label: 'Analytics', angle: 130 }
      ]
    },
    {
      key: 't3', name: 'Tier 3 — Standard', r: 116, labelDx: 0, labelDy: 22,
      fill: C.t3, border: C.t3Border, labelColor: C.text,
      tip: '<b>Tier 3 — Standard.</b> Little or no access to sensitive data. Controls: self-attestation, lightweight onboarding. Do not over-burden these vendors.',
      vendors: [
        { label: 'Office supplies', angle: 50 },
        { label: 'Marketing', angle: 130 }
      ]
    }
  ];

  // Fourth parties: subprocessors hanging off the Tier-1 vendors, outside the
  // rings. Placed on the lower half + right so they never clip the top edge.
  const FOURTH = {
    tip: '<b>Fourth parties.</b> Subprocessors of YOUR vendors — your data flows to them even though you never signed a contract with them. Inherited risk; usually disclosed in the vendor\'s DPA / subprocessor list.',
    nodes: [
      { label: 'CDN', parentAngle: 60 },
      { label: 'KMS', parentAngle: 120 },
      { label: 'SMS gw', parentAngle: 235 }
    ]
  };

  function el(tag, attrs, tip) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (tip) node.setAttribute('data-tip', tip);
    return node;
  }

  function txt(parent, x, y, str, attrs) {
    const a = Object.assign({ x, y, 'text-anchor': 'middle', 'dominant-baseline': 'middle',
      'font-family': 'Arial, Helvetica, sans-serif', fill: C.text }, attrs || {});
    const t = el('text', a);
    t.textContent = str;
    parent.appendChild(t);
    return t;
  }

  function polar(cx, cy, r, deg) {
    const rad = deg * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  // ---------- Radial (wide) view ----------
  function renderRadial() {
    // The outer ring (r=240) plus fourth-party nodes (r=240+62 + node radius 22)
    // span a vertical range narrower than the full square, so the viewBox is
    // cropped vertically to remove dead whitespace above and below the diagram.
    const W = 700, cx = W / 2, cy = 350;
    const FOURTH_OFFSET = 62, FOURTH_R = 22;
    const vbY = 78, vbH = 560;   // tight crop around content (ring r=240 + fourth-party reach)
    const svg = el('svg', { class: 'diagram', viewBox: `0 ${vbY} ${W} ${vbH}`,
      role: 'img', 'aria-label': 'Concentric ring diagram of vendor risk tiers' });

    // Rings (outer first so inner paint on top)
    TIERS.forEach(t => {
      svg.appendChild(el('circle', { cx, cy, r: t.r, fill: t.fill, stroke: t.border,
        'stroke-width': 2, opacity: 0.97 }, t.tip));
    });

    // Fourth-party nodes + dotted connectors (drawn UNDER the chips and labels)
    FOURTH.nodes.forEach(n => {
      const anchor = polar(cx, cy, TIERS[0].r, n.parentAngle);                 // on Tier-1 ring
      const out = polar(cx, cy, TIERS[0].r + FOURTH_OFFSET, n.parentAngle);    // outside the rings
      svg.appendChild(el('line', { x1: anchor.x, y1: anchor.y, x2: out.x, y2: out.y,
        stroke: C.fourthBorder, 'stroke-width': 1.6, 'stroke-dasharray': '4 3' }, FOURTH.tip));
      svg.appendChild(el('circle', { cx: out.x, cy: out.y, r: FOURTH_R,
        fill: C.fourth, stroke: C.fourthBorder, 'stroke-width': 1.6, 'stroke-dasharray': '4 3' }, FOURTH.tip));
      txt(svg, out.x, out.y, n.label, { 'font-size': 10.5, fill: '#546e7a', 'font-weight': 600 })
        .setAttribute('data-tip', FOURTH.tip);
    });

    // Ring name labels: horizontal, near the TOP edge of each band (no vendor sits there)
    TIERS.forEach((t, i) => {
      const topY = cy - t.r + t.labelDy;
      txt(svg, cx + t.labelDx, topY, t.name,
        { 'font-size': 13.5, 'font-weight': 700, fill: t.labelColor }).setAttribute('data-tip', t.tip);
    });

    // Vendor example chips on each ring (placed at band midline, away from the top)
    TIERS.forEach((t, i) => {
      const inner = i < TIERS.length - 1 ? TIERS[i + 1].r : 70;
      const bandMid = (t.r + inner) / 2;
      t.vendors.forEach(v => {
        const p = polar(cx, cy, bandMid, v.angle);
        const w = Math.max(76, v.label.length * 6.6 + 16), h = 24;
        svg.appendChild(el('rect', { x: p.x - w / 2, y: p.y - h / 2, width: w, height: h, rx: 6,
          fill: C.chip, stroke: C.chipBorder, 'stroke-width': 1.4 }, t.tip));
        txt(svg, p.x, p.y, v.label, { 'font-size': 11.5, fill: C.text }).setAttribute('data-tip', t.tip);
      });
    });

    // Center: the organization (radius < Tier-3 inner radius of ~70)
    svg.appendChild(el('circle', { cx, cy, r: 60, fill: C.org, stroke: C.orgBorder, 'stroke-width': 3 },
      'Your organization. Vendor risk is YOUR risk — you remain accountable for data your vendors process.'));
    txt(svg, cx, cy - 7, 'Our', { fill: C.white, 'font-size': 14, 'font-weight': 700 }).setAttribute('data-tip',
      'Your organization. Vendor risk is YOUR risk — you remain accountable for data your vendors process.');
    txt(svg, cx, cy + 10, 'Organization', { fill: C.white, 'font-size': 14, 'font-weight': 700 }).setAttribute('data-tip',
      'Your organization. Vendor risk is YOUR risk — you remain accountable for data your vendors process.');

    return svg;
  }

  // ---------- Stacked list (narrow) view ----------
  function renderList() {
    const W = 360, rowH = 92, gap = 10;
    const rows = [
      { name: 'Our Organization', sub: 'You remain accountable for vendor-processed data.',
        fill: C.org, border: C.orgBorder, color: C.white,
        tip: 'Your organization. Vendor risk is YOUR risk.' },
      ...TIERS.map(t => ({
        name: t.name, sub: t.vendors.map(v => v.label).join(' · '),
        fill: t.fill, border: t.border, color: t.labelColor, tip: t.tip
      })),
      { name: 'Fourth parties', sub: FOURTH.nodes.map(n => n.label).join(' · '),
        fill: C.fourth, border: C.fourthBorder, color: C.text, tip: FOURTH.tip, dotted: true }
    ];
    const H = rows.length * (rowH + gap) + gap;
    const svg = el('svg', { class: 'diagram', viewBox: `0 0 ${W} ${H}`,
      role: 'img', 'aria-label': 'Stacked list of vendor risk tiers' });
    rows.forEach((r, i) => {
      const y = gap + i * (rowH + gap);
      const rect = el('rect', { x: 8, y, width: W - 16, height: rowH, rx: 8,
        fill: r.fill, stroke: r.border, 'stroke-width': 2 }, r.tip);
      if (r.dotted) rect.setAttribute('stroke-dasharray', '5 4');
      svg.appendChild(rect);
      txt(svg, W / 2, y + 30, r.name, { 'font-size': 15, 'font-weight': 700, fill: r.color }).setAttribute('data-tip', r.tip);
      // wrap sub line
      const words = r.sub.split(' ');
      let line = '', lines = [];
      words.forEach(w => {
        if ((line + ' ' + w).length > 44) { lines.push(line); line = w; }
        else line = line ? line + ' ' + w : w;
      });
      if (line) lines.push(line);
      lines.slice(0, 2).forEach((ln, li) => {
        txt(svg, W / 2, y + 54 + li * 16, ln, { 'font-size': 11.5, fill: r.color, opacity: 0.92 })
          .setAttribute('data-tip', r.tip);
      });
    });
    return svg;
  }

  let isList = null;
  function render() {
    const host = document.getElementById('diagram');
    if (!host) return;
    const list = host.clientWidth > 0 && host.clientWidth < 640;
    if (list === isList && host.firstChild) return;
    isList = list;
    host.innerHTML = '';
    host.appendChild(list ? renderList() : renderRadial());
  }

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
      const x = (e.touches ? e.touches[0].clientX : e.clientX) + 14;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) + 14;
      tip.style.left = Math.min(x, window.innerWidth - 290) + 'px';
      tip.style.top = Math.min(y, window.innerHeight - 90) + 'px';
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
