// CANVAS_HEIGHT: 475
// Kernel / User Mode Boundary — inline SVG stack diagram with hover/tap tooltips.
// User mode (ring 3) applications sit above the system-call interface; the kernel
// (ring 0) sits below it with direct hardware access. The single boundary line is
// the only legal path between the two privilege rings. The SVG scales to its
// container via a fixed viewBox; the tooltip <div> follows the pointer.

const SVGNS = 'http://www.w3.org/2000/svg';
const COL = {
  user: '#e3f2fd', userStroke: '#1565c0',
  boundary: '#455a64',
  kernel: '#1565c0',
  hardware: '#cfd8dc', hardwareStroke: '#90a4ae',
  text: '#0d2c54', white: '#ffffff'
};

const tips = {
  user: { title: 'User mode (ring 3)',
    body: 'Unprivileged. Applications here cannot directly touch hardware or other ' +
      'processes’ memory. They must ask the kernel for everything via system calls.' },
  appBrowser: { title: 'Browser (user mode)',
    body: 'Cannot directly touch hardware. To read a file or open a socket it must ' +
      'request a syscall. A compromised browser is still confined by ring 3.' },
  appDatabase: { title: 'Database (user mode)',
    body: 'Runs unprivileged. Disk and network access go through the kernel, so the ' +
      'kernel can enforce permissions on every read and write.' },
  appEditor: { title: 'Editor (user mode)',
    body: 'Like every ring-3 process, it has no direct hardware access. The CPU traps ' +
      'to the kernel whenever it issues a privileged request.' },
  boundary: { title: 'System call interface',
    body: 'The only legal way for user code to enter kernel mode. The CPU switches ' +
      'privilege rings on a trap; the kernel validates arguments before acting.' },
  kernel: { title: 'Kernel mode (ring 0)',
    body: 'Trusted code with full hardware access. A bug here is total compromise — ' +
      'there is no higher authority to contain it. This is why the boundary exists.' },
  hardware: { title: 'Hardware',
    body: 'CPU, RAM, disk, and NIC. Only ring-0 kernel code addresses hardware ' +
      'directly; user processes reach it only through the kernel.' }
};

// fixed design coordinate system; SVG scales to container. The viewBox aspect
// ratio is kept close to the iframe's so the diagram fills the area without large
// top/bottom whitespace.
const VW = 820, VH = 412;

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

function lockIcon(g, x, y) {
  // small padlock + "unprivileged"
  g.appendChild(el('rect', { x: x, y: y + 4, width: 12, height: 9, rx: 2, fill: '#455a64' }));
  g.appendChild(el('path', { d: `M ${x + 2} ${y + 4} v -3 a 4 4 0 0 1 8 0 v 3`,
    fill: 'none', stroke: '#455a64', 'stroke-width': 1.6 }));
  g.appendChild(txt(x + 16, y + 12, 'unprivileged', { 'font-size': 10, fill: '#455a64' }));
}

function build() {
  host.innerHTML = '';
  const svg = el('svg', { viewBox: `0 0 ${VW} ${VH}`, preserveAspectRatio: 'xMidYMin meet' });

  // arrow marker defs
  const defs = el('defs', {});
  const mk = (id, color) => {
    const m = el('marker', { id, markerWidth: 9, markerHeight: 9, refX: 6, refY: 3,
      orient: 'auto', markerUnits: 'strokeWidth' });
    m.appendChild(el('path', { d: 'M0,0 L6,3 L0,6 Z', fill: color }));
    return m;
  };
  defs.appendChild(mk('arrDown', '#d84315'));
  defs.appendChild(mk('arrUp', '#2e7d32'));
  svg.appendChild(defs);

  const left = 40, right = VW - 40, fullW = right - left;

  // ---- User mode band ----
  const uY = 14, uH = 132;
  const gUser = el('g', {});
  gUser.appendChild(el('rect', { x: left, y: uY, width: fullW, height: uH, rx: 10,
    fill: COL.user, stroke: COL.userStroke, 'stroke-width': 2 }));
  gUser.appendChild(txt(left + 14, uY + 24, 'User mode  (ring 3)',
    { 'font-size': 16, 'font-weight': 700, fill: COL.userStroke }));
  hot(gUser, 'user');
  svg.appendChild(gUser);

  // three application boxes
  const apps = [
    { key: 'appBrowser', label: 'Browser' },
    { key: 'appDatabase', label: 'Database' },
    { key: 'appEditor', label: 'Editor' }
  ];
  const aGap = 24, aW = (fullW - 28 - aGap * 2) / 3, aH = 74, aY = uY + 40;
  apps.forEach((a, i) => {
    const ax = left + 14 + i * (aW + aGap);
    const g = el('g', {});
    g.appendChild(el('rect', { x: ax, y: aY, width: aW, height: aH, rx: 8,
      fill: '#ffffff', stroke: COL.userStroke, 'stroke-width': 1.5 }));
    g.appendChild(txt(ax + aW / 2, aY + 30, a.label,
      { 'font-size': 17, 'font-weight': 700, fill: COL.text, 'text-anchor': 'middle' }));
    lockIcon(g, ax + 12, aY + 44);
    hot(g, a.key);
    svg.appendChild(g);
  });

  // ---- Boundary line + arrows ----
  // leave a clear gap below the user band so the label does not touch it
  const bY = uY + uH + 56;
  const gB = el('g', {});
  gB.appendChild(el('line', { x1: left, y1: bY, x2: right, y2: bY,
    stroke: COL.boundary, 'stroke-width': 4 }));
  // syscall down arrow (left of center) and return up arrow (right of center)
  const cx = VW / 2;
  gB.appendChild(el('line', { x1: cx - 90, y1: bY - 22, x2: cx - 90, y2: bY + 22,
    stroke: '#d84315', 'stroke-width': 2.5, 'marker-end': 'url(#arrDown)' }));
  gB.appendChild(txt(cx - 84, bY - 12, 'syscall', { 'font-size': 12, fill: '#d84315', 'font-weight': 700 }));
  gB.appendChild(el('line', { x1: cx + 90, y1: bY + 22, x2: cx + 90, y2: bY - 22,
    stroke: '#2e7d32', 'stroke-width': 2.5, 'marker-end': 'url(#arrUp)' }));
  gB.appendChild(txt(cx + 96, bY - 12, 'return', { 'font-size': 12, fill: '#2e7d32', 'font-weight': 700 }));
  // label
  gB.appendChild(txt(VW / 2, bY - 30, 'System Call Interface  (open, read, write, mmap, …)',
    { 'font-size': 14, 'font-weight': 700, fill: COL.boundary, 'text-anchor': 'middle' }));
  // wide invisible hit area on the boundary
  gB.appendChild(el('rect', { x: left, y: bY - 14, width: fullW, height: 28, fill: 'transparent' }));
  hot(gB, 'boundary');
  svg.appendChild(gB);

  // ---- Kernel mode band ----
  const kY = bY + 28, kH = 118;
  const gK = el('g', {});
  gK.appendChild(el('rect', { x: left, y: kY, width: fullW, height: kH, rx: 10,
    fill: COL.kernel, stroke: '#0d47a1', 'stroke-width': 2 }));
  gK.appendChild(txt(left + 14, kY + 24, 'Kernel mode  (ring 0)',
    { 'font-size': 16, 'font-weight': 700, fill: COL.white }));
  hot(gK, 'kernel');
  svg.appendChild(gK);

  const subs = ['Process\nScheduler', 'Memory\nManager', 'VFS / File\nSystems', 'Network\nStack', 'Device\nDrivers'];
  const sGap = 14, sW = (fullW - 28 - sGap * 4) / 5, sH = 50, sY = kY + 36;
  subs.forEach((s, i) => {
    const sx = left + 14 + i * (sW + sGap);
    // these sub-boxes are decorative within the kernel; kernel group owns the tip
    svg.appendChild(el('rect', { x: sx, y: sY, width: sW, height: sH, rx: 6,
      fill: '#ffffff', stroke: '#0d47a1', 'stroke-width': 1.2, opacity: 0.92,
      'pointer-events': 'none' }));
    const lines = s.split('\n');
    lines.forEach((ln, j) => {
      svg.appendChild(txt(sx + sW / 2, sY + 22 + j * 15, ln,
        { 'font-size': 12.5, 'font-weight': 600, fill: COL.text, 'text-anchor': 'middle' }));
    });
  });
  svg.appendChild(txt(VW / 2, kY + kH - 8, 'Direct hardware access',
    { 'font-size': 12.5, fill: COL.white, 'font-style': 'italic', 'text-anchor': 'middle',
      'pointer-events': 'none' }));

  // ---- Hardware bar ----
  const hY = kY + kH + 12, hH = 40;
  const gH = el('g', {});
  gH.appendChild(el('rect', { x: left, y: hY, width: fullW, height: hH, rx: 8,
    fill: COL.hardware, stroke: COL.hardwareStroke, 'stroke-width': 1.5 }));
  gH.appendChild(txt(VW / 2, hY + 25, 'Hardware:  CPU  /  RAM  /  Disk  /  NIC',
    { 'font-size': 15, 'font-weight': 700, fill: '#37474f', 'text-anchor': 'middle' }));
  hot(gH, 'hardware');
  svg.appendChild(gH);

  host.appendChild(svg);
}

build();
window.addEventListener('resize', () => { /* SVG scales via viewBox; nothing to recompute */ });
