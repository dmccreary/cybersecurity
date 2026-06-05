// CANVAS_HEIGHT: 535
// The Security Program at a Glance — inline SVG four-layer stack with hover/tap tooltips.
// Top to bottom: Board & CEO (narrowest), CISO & Security Leadership, Security
// Functions (four side-by-side boxes), and Foundations (widest). A left arrow
// labels "Metrics flow up" and a right arrow labels "Strategy & policy flow down".
// The SVG scales to its container via a fixed viewBox; below ~600px the four
// function boxes stack vertically. Bloom: Understand.

const SVGNS = 'http://www.w3.org/2000/svg';

const COL = {
  board: '#455a64', boardStroke: '#263238',
  ciso: '#1565c0', cisoStroke: '#0d47a1',
  func: '#4f8fd6', funcStroke: '#1565c0',
  found: '#fff3cd', foundStroke: '#caa53d',
  text: '#0d2c54', white: '#ffffff',
  up: '#2e7d32', down: '#d84315'
};

const tips = {
  board: { title: 'Board & CEO',
    body: 'Sets the risk appetite, receives the metrics, and signs off on the top risks. ' +
      'Accountable for public disclosures.' },
  ciso: { title: 'CISO & Security Leadership',
    body: 'Owns the program. Translates technical risk into board-readable decisions: ' +
      'strategy, policy, the risk register, and the compliance roadmap.' },
  riskComp: { title: 'Risk & Compliance',
    body: 'Maintains the risk register and maps controls to regulatory and contractual ' +
      'obligations.' },
  secEng: { title: 'Security Engineering',
    body: 'Builds and runs the controls — identity, encryption, segmentation, secure ' +
      'defaults in the product and platform.' },
  soc: { title: 'Security Operations (SOC)',
    body: 'Detects, triages, and responds to incidents around the clock. Owns monitoring ' +
      'and the incident lifecycle.' },
  grc: { title: 'GRC & Audit',
    body: 'Governance, risk, and compliance oversight plus internal audit — checks that ' +
      'the controls actually work as claimed.' },
  found: { title: 'Foundations',
    body: 'Asset inventory, access management, logging, vendor inventory, and training. ' +
      'Without these, every layer above is operating blind.' },
  up: { title: 'Metrics flow up',
    body: 'Coverage, incident counts, mean-time-to-respond, and audit findings roll up so ' +
      'leadership and the board can see the program honestly.' },
  down: { title: 'Strategy & policy flow down',
    body: 'Risk appetite and policy set at the top become concrete standards, baselines, ' +
      'and day-to-day controls at the foundation.' }
};

const VW = 900, VH = 530;
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

// build a layer band centered horizontally, given width, returns {y, h}
function band(svg, cx, y, w, h, fill, stroke, key) {
  const g = el('g', {});
  g.appendChild(el('rect', { x: cx - w / 2, y: y, width: w, height: h, rx: 8,
    fill: fill, stroke: stroke, 'stroke-width': 2 }));
  hot(g, key);
  svg.appendChild(g);
  return g;
}

function build(stack) {
  host.innerHTML = '';
  const svg = el('svg', { viewBox: `0 0 ${VW} ${VH}`, preserveAspectRatio: 'xMidYMin meet' });

  // arrow markers
  const defs = el('defs', {});
  const mk = (id, color) => {
    const m = el('marker', { id, markerWidth: 9, markerHeight: 9, refX: 6, refY: 3,
      orient: 'auto', markerUnits: 'strokeWidth' });
    m.appendChild(el('path', { d: 'M0,0 L6,3 L0,6 Z', fill: color }));
    return m;
  };
  defs.appendChild(mk('arrUp', COL.up));
  defs.appendChild(mk('arrDown', COL.down));
  svg.appendChild(defs);

  const cx = VW / 2;
  const topPad = 18, sideMargin = 96; // leave room for side arrows
  const usable = VW - sideMargin * 2;

  // four bands, narrowest at top -> widest at bottom
  const wBoard = usable * 0.42;
  const wCiso = usable * 0.66;
  const wFunc = usable * 0.90;
  const wFound = usable;

  const hBoard = 70, hCiso = 78, hFunc = stack ? 268 : 150, hFound = 86;
  const gap = 24;

  let y = topPad;

  // ---- Board & CEO ----
  const gBoard = band(svg, cx, y, wBoard, hBoard, COL.board, COL.boardStroke, 'board');
  gBoard.appendChild(txt(cx, y + 26, 'Board & CEO',
    { 'font-size': 18, 'font-weight': 700, fill: COL.white, 'text-anchor': 'middle' }));
  gBoard.appendChild(txt(cx, y + 48, 'Risk appetite · executive accountability · disclosures',
    { 'font-size': 12.5, fill: '#cfd8dc', 'text-anchor': 'middle' }));
  const boardTop = y;
  y += hBoard + gap;

  // ---- CISO ----
  const gCiso = band(svg, cx, y, wCiso, hCiso, COL.ciso, COL.cisoStroke, 'ciso');
  gCiso.appendChild(txt(cx, y + 28, 'CISO & Security Leadership',
    { 'font-size': 18, 'font-weight': 700, fill: COL.white, 'text-anchor': 'middle' }));
  gCiso.appendChild(txt(cx, y + 52, 'Strategy · policy · risk register · compliance roadmap',
    { 'font-size': 12.5, fill: '#e3f2fd', 'text-anchor': 'middle' }));
  y += hCiso + gap;

  // ---- Security Functions (container band + four boxes) ----
  const funcY = y;
  svg.appendChild(el('rect', { x: cx - wFunc / 2, y: funcY, width: wFunc, height: hFunc, rx: 8,
    fill: '#e8f1fb', stroke: COL.funcStroke, 'stroke-width': 2, 'pointer-events': 'none' }));
  svg.appendChild(txt(cx, funcY + 20, 'Security Functions',
    { 'font-size': 15, 'font-weight': 700, fill: COL.funcStroke, 'text-anchor': 'middle' }));

  const fboxes = [
    { key: 'riskComp', label: 'Risk &\nCompliance' },
    { key: 'secEng', label: 'Security\nEngineering' },
    { key: 'soc', label: 'Security\nOperations (SOC)' },
    { key: 'grc', label: 'GRC & Audit' }
  ];
  if (!stack) {
    const innerPad = 16, bGap = 14;
    const bW = (wFunc - innerPad * 2 - bGap * 3) / 4;
    const bH = 80, bY = funcY + 34;
    fboxes.forEach((b, i) => {
      const bx = cx - wFunc / 2 + innerPad + i * (bW + bGap);
      const g = el('g', {});
      g.appendChild(el('rect', { x: bx, y: bY, width: bW, height: bH, rx: 6,
        fill: COL.func, stroke: COL.funcStroke, 'stroke-width': 1.5 }));
      b.label.split('\n').forEach((ln, j) =>
        g.appendChild(txt(bx + bW / 2, bY + 32 + j * 18, ln,
          { 'font-size': 13.5, 'font-weight': 700, fill: COL.white, 'text-anchor': 'middle' })));
      hot(g, b.key);
      svg.appendChild(g);
    });
  } else {
    const innerPad = 16, bGap = 10;
    const bW = wFunc - innerPad * 2;
    const bH = (hFunc - 30 - bGap * 3 - 8) / 4, bY0 = funcY + 30;
    fboxes.forEach((b, i) => {
      const by = bY0 + i * (bH + bGap);
      const g = el('g', {});
      g.appendChild(el('rect', { x: cx - bW / 2, y: by, width: bW, height: bH, rx: 6,
        fill: COL.func, stroke: COL.funcStroke, 'stroke-width': 1.5 }));
      g.appendChild(txt(cx, by + bH / 2 + 5, b.label.replace('\n', ' '),
        { 'font-size': 14, 'font-weight': 700, fill: COL.white, 'text-anchor': 'middle' }));
      hot(g, b.key);
      svg.appendChild(g);
    });
  }
  y += hFunc + gap;

  // ---- Foundations ----
  const gFound = band(svg, cx, y, wFound, hFound, COL.found, COL.foundStroke, 'found');
  gFound.appendChild(txt(cx, y + 28, 'Foundations',
    { 'font-size': 17, 'font-weight': 700, fill: '#7a5c00', 'text-anchor': 'middle' }));
  gFound.appendChild(txt(cx, y + 52, 'Asset inventory · Access management · Logging · Vendor inventory · Training',
    { 'font-size': 12.5, fill: '#5d4a12', 'text-anchor': 'middle' }));
  const foundBottom = y + hFound;
  y += hFound;

  // ---- Side arrows ----
  const ax = cx - usable / 2 - 34;          // left arrow x
  const bx = cx + usable / 2 + 34;          // right arrow x
  const aTop = boardTop + 8, aBot = foundBottom - 8;
  // metrics up (left)
  const gUp = el('g', {});
  gUp.appendChild(el('line', { x1: ax, y1: aBot, x2: ax, y2: aTop,
    stroke: COL.up, 'stroke-width': 4, 'marker-end': 'url(#arrUp)' }));
  gUp.appendChild(el('rect', { x: ax - 16, y: aTop, width: 32, height: aBot - aTop, fill: 'transparent' }));
  hot(gUp, 'up');
  svg.appendChild(gUp);
  svg.appendChild(txt(ax - 10, (aTop + aBot) / 2, 'Metrics flow up',
    { 'font-size': 13, 'font-weight': 700, fill: COL.up, 'text-anchor': 'middle',
      transform: `rotate(-90 ${ax - 10} ${(aTop + aBot) / 2})` }));
  // strategy down (right)
  const gDown = el('g', {});
  gDown.appendChild(el('line', { x1: bx, y1: aTop, x2: bx, y2: aBot,
    stroke: COL.down, 'stroke-width': 4, 'marker-end': 'url(#arrDown)' }));
  gDown.appendChild(el('rect', { x: bx - 16, y: aTop, width: 32, height: aBot - aTop, fill: 'transparent' }));
  hot(gDown, 'down');
  svg.appendChild(gDown);
  svg.appendChild(txt(bx + 14, (aTop + aBot) / 2, 'Strategy & policy flow down',
    { 'font-size': 13, 'font-weight': 700, fill: COL.down, 'text-anchor': 'middle',
      transform: `rotate(90 ${bx + 14} ${(aTop + aBot) / 2})` }));

  // ---- Caption ----
  svg.appendChild(txt(cx, foundBottom + 36,
    'The security program is a system, not a checklist. Every layer depends on the one below it being honest.',
    { 'font-size': 14, 'font-style': 'italic', fill: '#455a64', 'text-anchor': 'middle' }));

  host.appendChild(svg);
}

function render() {
  const stack = window.innerWidth < 600;
  build(stack);
}
render();
window.addEventListener('resize', render);
