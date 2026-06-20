// CANVAS_HEIGHT: 392
// Stack Frame With and Without a Canary Under Overflow — inline SVG, hover tooltips.
// Two stack frames side by side, drawn with HIGH addresses at the top and LOW
// addresses at the bottom (standard stack layout). A red strcpy overflow arrow
// grows upward from the buffer toward the saved return address. The left frame
// has no canary (exploit succeeds); the right frame has a stack canary that the
// overflow must cross first (process aborts on the canary check). Bloom: Understand
// — compare the two layouts and explain how the canary turns silent compromise
// into a safe abort. The SVG scales to its container; below ~800px the frames stack.

const SVGNS = 'http://www.w3.org/2000/svg';

const COL = {
  ret: '#455a64', retText: '#ffffff',     // saved return address (slate)
  fp: '#90a4ae', fpText: '#263238',        // saved frame pointer (gray)
  canary: '#4caf50', canaryText: '#ffffff',// canary (green)
  buf: '#ffe082', bufText: '#5d4a12',      // buffer (light yellow)
  arrow: '#d84315',                        // overflow arrow (rust/red)
  bad: '#c62828', good: '#2e7d32',
  warn: '#ffa000',
  frameStroke: '#90a4ae', text: '#0d2c54'
};

const tips = {
  canary: { title: 'Stack canary',
    body: 'A random per-process value placed between the buffer and the saved registers. ' +
      'The compiler inserts it; the function prologue checks it before returning.' },
  retL: { title: 'Saved return address',
    body: 'Where the function returns to. Hijacking this is the classic exploit goal — ' +
      'overwrite it and the CPU jumps wherever the attacker chooses.' },
  retR: { title: 'Saved return address',
    body: 'Where the function returns to. With a canary in front of it, the overflow must ' +
      'corrupt the canary first, so the corruption is detected before the return.' },
  bufL: { title: 'char buf[16] (attacker-writable)',
    body: 'A fixed-size buffer on the stack. strcpy copies attacker input with no bounds ' +
      'check, so a long input writes past the end of buf.' },
  bufR: { title: 'char buf[16] (attacker-writable)',
    body: 'Same unbounded strcpy, but now the next thing above buf is the canary, not the ' +
      'saved frame pointer.' }
};

const VW = 920, VH = 380;
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
function showTip(key) {
  const t = tips[key]; if (!t) return;
  tooltip.innerHTML = '<div class="tt-title">' + t.title + '</div>' + t.body;
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
function hot(group, key) {
  group.setAttribute('class', 'hot');
  group.addEventListener('mouseenter', () => showTip(key));
  group.addEventListener('mousemove', moveTip);
  group.addEventListener('mouseleave', hideTip);
  group.addEventListener('touchstart', (e) => { showTip(key); moveTip(e); }, { passive: true });
  group.addEventListener('touchend', hideTip);
}

// draw one stack frame at (fx, fyTop) with given width; rows is an array of
// {label, fill, textColor, key?} from TOP (high address) to BOTTOM (low address).
function drawFrame(svg, fx, fyTop, fw, title, titleColor, resultText, resultColor, rows, annotation) {
  // result label at the very top
  svg.appendChild(txt(fx + fw / 2, fyTop - 44, title,
    { 'font-size': 16, 'font-weight': 700, fill: titleColor, 'text-anchor': 'middle' }));
  // result box
  const rb = el('g', {});
  rb.appendChild(el('rect', { x: fx, y: fyTop - 34, width: fw, height: 30, rx: 6,
    fill: resultColor === COL.good ? '#e8f5e9' : '#ffebee',
    stroke: resultColor, 'stroke-width': 1.5 }));
  // wrap result text into up to 2 lines
  resultText.forEach((ln, i) =>
    rb.appendChild(txt(fx + fw / 2, fyTop - 21 + i * 13, ln,
      { 'font-size': 11.5, 'font-weight': 700, fill: resultColor, 'text-anchor': 'middle' })));
  svg.appendChild(rb);

  // address labels on the left of the frame
  svg.appendChild(txt(fx - 8, fyTop + 6, 'high addr',
    { 'font-size': 10, fill: '#78909c', 'text-anchor': 'end' }));

  const rowH = 46, gap = 4;
  let y = fyTop;
  rows.forEach((r, i) => {
    const g = el('g', {});
    g.appendChild(el('rect', { x: fx, y: y, width: fw, height: rowH, rx: 5,
      fill: r.fill, stroke: COL.frameStroke, 'stroke-width': 1.2 }));
    g.appendChild(txt(fx + fw / 2, y + rowH / 2 + 4, r.label,
      { 'font-size': 13, 'font-weight': 600, fill: r.textColor, 'text-anchor': 'middle' }));
    if (r.key) hot(g, r.key);
    svg.appendChild(g);
    r._y = y; r._h = rowH;
    y += rowH + gap;
  });
  const frameBottom = y - gap;
  svg.appendChild(txt(fx - 8, frameBottom - 4, 'low addr',
    { 'font-size': 10, fill: '#78909c', 'text-anchor': 'end' }));

  // overflow arrow: from below the buffer (bottom) up to the top row
  const ax = fx + fw + 22;
  const aTopY = rows[0]._y + 6;
  const aBotY = frameBottom + 6;
  svg.appendChild(el('line', { x1: ax, y1: aBotY, x2: ax, y2: aTopY,
    stroke: COL.arrow, 'stroke-width': 3, 'marker-end': 'url(#arrUp)' }));
  svg.appendChild(txt(ax + 6, (aTopY + aBotY) / 2, 'strcpy(buf, attacker_input)',
    { 'font-size': 11.5, 'font-weight': 700, fill: COL.arrow, 'text-anchor': 'middle',
      transform: `rotate(90 ${ax + 6} ${(aTopY + aBotY) / 2})` }));

  // annotation under the frame
  annotation.forEach((ln, i) =>
    svg.appendChild(txt(fx + fw / 2, frameBottom + 22 + i * 15, ln,
      { 'font-size': 11.5, 'font-style': 'italic', fill: '#455a64', 'text-anchor': 'middle' })));

  return frameBottom;
}

function build(stack) {
  host.innerHTML = '';
  const vh = stack ? 920 : VH;
  const svg = el('svg', { viewBox: `0 0 ${VW} ${vh}`, preserveAspectRatio: 'xMidYMin meet' });

  const defs = el('defs', {});
  const m = el('marker', { id: 'arrUp', markerWidth: 9, markerHeight: 9, refX: 6, refY: 3,
    orient: 'auto', markerUnits: 'strokeWidth' });
  m.appendChild(el('path', { d: 'M0,0 L6,3 L0,6 Z', fill: COL.arrow }));
  defs.appendChild(m);
  svg.appendChild(defs);

  const leftRows = [
    { label: 'Saved return address', fill: COL.ret, textColor: COL.retText, key: 'retL' },
    { label: 'Saved frame pointer', fill: COL.fp, textColor: COL.fpText },
    { label: 'Local variable: char buf[16]', fill: COL.buf, textColor: COL.bufText, key: 'bufL' }
  ];
  const rightRows = [
    { label: 'Saved return address', fill: COL.ret, textColor: COL.retText, key: 'retR' },
    { label: 'Saved frame pointer', fill: COL.fp, textColor: COL.fpText },
    { label: 'Stack canary: 0xA3F2B7C1', fill: COL.canary, textColor: COL.canaryText, key: 'canary' },
    { label: 'Local variable: char buf[16]', fill: COL.buf, textColor: COL.bufText, key: 'bufR' }
  ];

  if (!stack) {
    const fw = 300, fyTop = 70;
    const lx = 70, rx = VW - 70 - fw;
    drawFrame(svg, lx, fyTop, fw, 'Without Canary', COL.bad,
      ['Return → attacker-controlled address.', 'Exploit succeeds silently.'], COL.bad,
      leftRows, ['Long input overruns buf and', 'overwrites the saved return address.']);
    drawFrame(svg, rx, fyTop, fw, 'With Canary', COL.good,
      ['Canary check fails on return →', 'process aborts before returning.'], COL.good,
      rightRows, ['Overflow path crosses the canary', 'first, so corruption is detected.']);
    drawLegend(svg, VW / 2, vh - 26);
  } else {
    const fw = 300, fx = (VW - fw) / 2;
    let b = drawFrame(svg, fx, 80, fw, 'Without Canary', COL.bad,
      ['Return → attacker-controlled address.', 'Exploit succeeds silently.'], COL.bad,
      leftRows, ['Long input overruns buf and', 'overwrites the saved return address.']);
    drawFrame(svg, fx, b + 130, fw, 'With Canary', COL.good,
      ['Canary check fails on return →', 'process aborts before returning.'], COL.good,
      rightRows, ['Overflow path crosses the canary', 'first, so corruption is detected.']);
    drawLegend(svg, VW / 2, vh - 26);
  }

  host.appendChild(svg);
}

function drawLegend(svg, cx, y) {
  const items = [
    { c: COL.buf, t: 'attacker-writable buffer' },
    { c: COL.canary, t: 'stack canary' },
    { c: COL.fp, t: 'saved frame pointer' },
    { c: COL.ret, t: 'saved return address' }
  ];
  // measure-ish: fixed spacing
  const sw = 16, pad = 8, itemGap = 26;
  // estimate widths
  const approx = items.map(it => sw + 6 + it.t.length * 6.2 + itemGap);
  const total = approx.reduce((a, b) => a + b, 0) - itemGap;
  let x = cx - total / 2;
  items.forEach((it, i) => {
    svg.appendChild(el('rect', { x: x, y: y - sw / 2, width: sw, height: sw, rx: 3,
      fill: it.c, stroke: '#90a4ae', 'stroke-width': 1 }));
    svg.appendChild(txt(x + sw + 6, y + 4, it.t,
      { 'font-size': 12, fill: '#455a64' }));
    x += approx[i];
  });
}

function render() {
  build(window.innerWidth < 800);
}
render();
window.addEventListener('resize', render);
