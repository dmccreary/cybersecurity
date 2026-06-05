// CANVAS_HEIGHT: 540
// Threat Actor Capability Matrix — inline SVG scatter plot, hover tooltips.
// X-axis = Resources (low -> high), Y-axis = Skill (low -> high). Five threat
// actor types are placed as circles in the quadrant that matches their typical
// skill/resource profile; circle RADIUS encodes typical campaign duration
// (script kiddies = minutes -> APTs = years). Insiders get a callout arrow
// ("bypasses perimeter by design") because their threat is access, not the
// skill/resource axes. Bloom: Analyze — compare actors across two dimensions and
// reason about why high-impact actors cluster upper-right. The SVG scales to its
// container; below ~640px the layout reflows to a more compact plot.

const SVGNS = 'http://www.w3.org/2000/svg';

// actor data. sx/sy are 0..1 fractions across the plot (resources, skill).
// r is a relative radius weight (duration encoding).
const ACTORS = [
  {
    id: 'kiddies', name: 'Script kiddies', color: '#1565c0',
    sx: 0.16, sy: 0.16, r: 14,
    motiv: 'Notoriety, curiosity, mischief.',
    horizon: 'Minutes to hours — opportunistic.',
    example: 'Mass-scanning, off-the-shelf exploit kits, defacements.'
  },
  {
    id: 'hacktivists', name: 'Hacktivists', color: '#2e7d32',
    sx: 0.30, sy: 0.52, r: 20,
    motiv: 'Ideology, protest, publicity.',
    horizon: 'Days to weeks — campaign tied to a cause.',
    example: 'DDoS waves, doxxing, website takeovers (e.g. Anonymous ops).'
  },
  {
    id: 'criminals', name: 'Cybercriminals', color: '#fb8c00',
    sx: 0.66, sy: 0.66, r: 28,
    motiv: 'Financial gain — extortion, fraud, theft.',
    horizon: 'Weeks to months — repeatable, profit-driven.',
    example: 'Ransomware crews, banking trojans, BEC fraud.'
  },
  {
    id: 'apt', name: 'Nation-state / APTs', color: '#c62828',
    sx: 0.86, sy: 0.88, r: 38,
    motiv: 'Espionage, sabotage, strategic advantage.',
    horizon: 'Months to YEARS — patient, persistent.',
    example: 'Stuxnet, SolarWinds supply-chain compromise.'
  }
];

// Insider is special: low on the resources axis but unique access, so it is
// drawn off-axis with a callout rather than plotted on skill/resources.
const INSIDER = {
  id: 'insider', name: 'Insiders', color: '#455a64', r: 22,
  motiv: 'Grievance, money, coercion, or simple negligence.',
  horizon: 'Varies — sometimes a single act, sometimes long-term.',
  example: 'Edward Snowden leak; malicious admin data theft.'
};

const tooltip = document.getElementById('tooltip');
const host = document.getElementById('svgHost');

function el(name, attrs) {
  const e = document.createElementNS(SVGNS, name);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}
function txt(x, y, s, attrs) {
  const t = el('text', Object.assign({ x, y }, attrs || {}));
  t.textContent = s;
  return t;
}
function showTip(a) {
  tooltip.innerHTML =
    '<div class="tt-title" style="color:' + a.color + '">' + a.name + '</div>' +
    '<div class="tt-row"><b>Motivation:</b> ' + a.motiv + '</div>' +
    '<div class="tt-row"><b>Time horizon:</b> ' + a.horizon + '</div>' +
    '<div class="tt-row"><b>Examples:</b> ' + a.example + '</div>';
  tooltip.style.opacity = '1';
}
function moveTip(e) {
  const pad = 14;
  const ev = (e.touches && e.touches[0]) ? e.touches[0] : e;
  let x = ev.clientX + pad, y = ev.clientY + pad;
  const r = tooltip.getBoundingClientRect();
  if (x + r.width > window.innerWidth - 6) x = ev.clientX - r.width - pad;
  if (y + r.height > window.innerHeight - 6) y = ev.clientY - r.height - pad;
  if (y < 4) y = 4;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}
function hideTip() { tooltip.style.opacity = '0'; }
function hot(group, a) {
  group.setAttribute('class', 'hot');
  group.appendChild((function () { const t = el('title', {}); t.textContent = a.name + ' — ' + a.motiv; return t; })());
  group.addEventListener('mouseenter', () => showTip(a));
  group.addEventListener('mousemove', moveTip);
  group.addEventListener('mouseleave', hideTip);
  group.addEventListener('touchstart', (e) => { showTip(a); moveTip(e); }, { passive: true });
  group.addEventListener('touchend', hideTip);
}

function build(narrow) {
  host.innerHTML = '';
  // FIXED viewBox, top-anchored (xMinYMin meet). The host width drives the scale;
  // at the textbook's ~776px-wide host the scale is ~1, so the full VH renders
  // inside the available host height. ALL content (axes, bubbles, insider callout,
  // size legend) lives within VH so nothing is clipped — no runtime measurement.
  const VW = narrow ? 560 : 776, VH = narrow ? 600 : 458;
  const svg = el('svg', { viewBox: `0 0 ${VW} ${VH}`, preserveAspectRatio: 'xMinYMin meet' });

  // plot box — bottom margin large enough to hold the x-axis label AND the legend
  const m = { l: 62, r: narrow ? 28 : 140, t: 20, b: 92 };
  const px0 = m.l, py0 = m.t;
  const pw = VW - m.l - m.r, ph = VH - m.t - m.b;
  const px1 = px0 + pw, py1 = py0 + ph;

  // plot background + quadrant guides
  svg.appendChild(el('rect', { x: px0, y: py0, width: pw, height: ph,
    fill: '#fafbfc', stroke: '#cfd8dc', 'stroke-width': 1 }));
  // midlines
  svg.appendChild(el('line', { x1: px0 + pw / 2, y1: py0, x2: px0 + pw / 2, y2: py1,
    stroke: '#e0e6ea', 'stroke-width': 1, 'stroke-dasharray': '4 4' }));
  svg.appendChild(el('line', { x1: px0, y1: py0 + ph / 2, x2: px1, y2: py0 + ph / 2,
    stroke: '#e0e6ea', 'stroke-width': 1, 'stroke-dasharray': '4 4' }));

  // axes
  svg.appendChild(el('line', { x1: px0, y1: py1, x2: px1, y2: py1, stroke: '#455a64', 'stroke-width': 2 }));
  svg.appendChild(el('line', { x1: px0, y1: py0, x2: px0, y2: py1, stroke: '#455a64', 'stroke-width': 2 }));

  // axis arrowheads via small triangles
  svg.appendChild(el('path', { d: `M${px1},${py1} l-9,-4 l0,8 z`, fill: '#455a64' }));
  svg.appendChild(el('path', { d: `M${px0},${py0} l-4,9 l8,0 z`, fill: '#455a64' }));

  // axis labels
  svg.appendChild(txt(px0 + pw / 2, py1 + 40, 'Resources  (funding · tooling · time)',
    { 'font-size': 14, 'font-weight': 700, fill: '#455a64', 'text-anchor': 'middle' }));
  svg.appendChild(txt(px0 + 8, py1 + 22, 'low', { 'font-size': 11, fill: '#78909c' }));
  svg.appendChild(txt(px1 - 8, py1 + 22, 'high', { 'font-size': 11, fill: '#78909c', 'text-anchor': 'end' }));

  const yLabX = 22;
  const yLab = txt(yLabX, py0 + ph / 2, 'Skill  (technical sophistication)',
    { 'font-size': 14, 'font-weight': 700, fill: '#455a64', 'text-anchor': 'middle',
      transform: `rotate(-90 ${yLabX} ${py0 + ph / 2})` });
  svg.appendChild(yLab);
  svg.appendChild(txt(px0 - 8, py1 - 4, 'low', { 'font-size': 11, fill: '#78909c', 'text-anchor': 'end' }));
  svg.appendChild(txt(px0 - 8, py0 + 12, 'high', { 'font-size': 11, fill: '#78909c', 'text-anchor': 'end' }));

  function plotX(sx) { return px0 + sx * pw; }
  function plotY(sy) { return py1 - sy * ph; }

  // draw the four plotted actors
  ACTORS.forEach(a => {
    const cx = plotX(a.sx), cy = plotY(a.sy);
    const g = el('g', {});
    g.appendChild(el('circle', { cx, cy, r: a.r, fill: a.color, 'fill-opacity': 0.82,
      stroke: '#ffffff', 'stroke-width': 2 }));
    // label placed to avoid the axes — below the bubble for low ones, above for high
    const below = a.sy < 0.4;
    const ly = below ? cy + a.r + 14 : cy - a.r - 8;
    g.appendChild(txt(cx, ly, a.name,
      { 'font-size': 12.5, 'font-weight': 700, fill: '#263238', 'text-anchor': 'middle' }));
    hot(g, a);
    svg.appendChild(g);
  });

  // INSIDER callout — placed near lower-right margin (low resources axis sense:
  // it sits off the skill/resources logic). Draw a circle with an arrow + label.
  const inx = narrow ? px0 + pw * 0.5 : px1 - 24;
  const iny = narrow ? py0 + ph * 0.28 : py0 + ph * 0.30;
  const ig = el('g', {});
  ig.appendChild(el('circle', { cx: inx, cy: iny, r: INSIDER.r, fill: INSIDER.color,
    'fill-opacity': 0.85, stroke: '#ffffff', 'stroke-width': 2 }));
  ig.appendChild(txt(inx, iny + 4, 'Insiders',
    { 'font-size': 11, 'font-weight': 700, fill: '#ffffff', 'text-anchor': 'middle' }));
  hot(ig, INSIDER);
  svg.appendChild(ig);
  // dashed callout arrow from the insider toward the plot interior
  const ax2 = px0 + pw * 0.42, ay2 = py0 + ph * 0.5;
  svg.appendChild(el('line', { x1: inx - INSIDER.r, y1: iny, x2: ax2, y2: ay2,
    stroke: INSIDER.color, 'stroke-width': 1.6, 'stroke-dasharray': '5 4',
    'marker-end': 'url(#ins)' }));
  const defs = el('defs', {});
  const mk = el('marker', { id: 'ins', markerWidth: 9, markerHeight: 9, refX: 6, refY: 3,
    orient: 'auto', markerUnits: 'strokeWidth' });
  mk.appendChild(el('path', { d: 'M0,0 L6,3 L0,6 Z', fill: INSIDER.color }));
  defs.appendChild(mk);
  svg.appendChild(defs);
  // insider annotation text near the bubble
  svg.appendChild(txt(inx, iny - INSIDER.r - 8, 'bypasses perimeter',
    { 'font-size': 10.5, 'font-style': 'italic', fill: INSIDER.color, 'text-anchor': 'middle' }));
  svg.appendChild(txt(inx, iny - INSIDER.r + 4, 'by design',
    { 'font-size': 10.5, 'font-style': 'italic', fill: INSIDER.color, 'text-anchor': 'middle' }));

  // size legend at the bottom: circle size -> campaign duration
  drawSizeLegend(svg, px0, py1 + 52, pw);

  host.appendChild(svg);
}

function drawSizeLegend(svg, x0, y, w) {
  svg.appendChild(txt(x0, y - 2, 'Circle size = typical campaign duration:',
    { 'font-size': 12, 'font-weight': 700, fill: '#455a64' }));
  const items = [
    { r: 7, t: 'minutes (kiddies)' },
    { r: 11, t: 'days (hacktivists)' },
    { r: 15, t: 'months (criminals)' },
    { r: 19, t: 'years (APTs)' }
  ];
  let x = x0 + 290;
  const gap = 32;
  items.forEach(it => {
    const cy = y - 6;
    svg.appendChild(el('circle', { cx: x + it.r, cy: cy, r: it.r,
      fill: '#90a4ae', 'fill-opacity': 0.5, stroke: '#607d8b', 'stroke-width': 1 }));
    svg.appendChild(txt(x + it.r, cy + it.r + 13, it.t,
      { 'font-size': 10.5, fill: '#607d8b', 'text-anchor': 'middle' }));
    x += it.r * 2 + gap + it.t.length * 3.2;
  });
}

function render() {
  build(window.innerWidth < 640);
}
render();
window.addEventListener('resize', render);
