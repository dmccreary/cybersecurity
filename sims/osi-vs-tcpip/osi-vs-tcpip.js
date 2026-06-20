// CANVAS_HEIGHT: 500
// OSI vs TCP/IP — inline SVG two-column comparison.
// Bloom: Understand. The left column is the 7-layer OSI model (Application at top
// down to Physical), the right-center column is the 4-layer TCP/IP model, and
// dashed lines map each OSI layer to its TCP/IP layer. A far-right "where attacks
// live" annotation lists representative attacks by layer. Hover any OSI or TCP/IP
// layer for example protocols and an example control. The SVG scales to its
// container via a fixed viewBox.

const SVGNS = 'http://www.w3.org/2000/svg';
const VW = 900, VH = 470;
const OSI_C = '#1565c0';    // OSI column
const TCP_C = '#455a64';    // TCP/IP column
const ATK_C = '#ffa000';    // attack callouts

// OSI layers top (7 Application) to bottom (1 Physical).
const osi = [
  { n: 7, name: 'Application', ex: 'HTTP, DNS, SMTP, SSH',
    tip: 'Where users and apps live. Controls: WAFs, input validation, API auth.', map: 'app' },
  { n: 6, name: 'Presentation', ex: 'encoding, TLS framing',
    tip: 'Encoding and encryption framing (TLS sits here in some readings). Control: TLS config.', map: 'app' },
  { n: 5, name: 'Session', ex: 'RPC session state',
    tip: 'Session setup/teardown. Largely absorbed into the application layer in practice.', map: 'app' },
  { n: 4, name: 'Transport', ex: 'TCP, UDP',
    tip: 'End-to-end delivery, ports. Control: stateful firewalls operate here.', map: 'transport' },
  { n: 3, name: 'Network', ex: 'IP, ICMP, routing',
    tip: 'Logical addressing and routing. Control: ACLs, anti-spoofing (BCP38).', map: 'internet' },
  { n: 2, name: 'Data Link', ex: 'Ethernet, Wi-Fi, ARP',
    tip: 'Local frame delivery and MAC addressing. Control: 802.1X, DAI, port security.', map: 'link' },
  { n: 1, name: 'Physical', ex: 'copper, fiber, radio',
    tip: 'Bits on the wire/air. Control: physical access control, shielding.', map: 'link' }
];

// TCP/IP layers top to bottom, with the OSI span each covers.
const tcp = [
  { key: 'app', name: 'Application', ex: 'HTTP, DNS, TLS, SSH', span: '≈ OSI 5–7',
    tip: 'Folds OSI Session, Presentation, and Application into one. Control: app auth, TLS, WAF.' },
  { key: 'transport', name: 'Transport', ex: 'TCP, UDP', span: '= OSI 4',
    tip: 'Same as OSI Transport. Control: stateful firewalls, SYN-flood protection.' },
  { key: 'internet', name: 'Internet', ex: 'IP, ICMP', span: '≈ OSI 3',
    tip: 'Same as OSI Network. Control: ACLs, ingress filtering against IP spoofing.' },
  { key: 'link', name: 'Link', ex: 'Ethernet, Wi-Fi', span: '≈ OSI 1–2',
    tip: 'Folds OSI Physical and Data Link. Control: 802.1X, dynamic ARP inspection.' }
];

const attacks = [
  { lbl: 'L2', txt: 'ARP spoofing, rogue DHCP, MAC flooding' },
  { lbl: 'L3', txt: 'IP spoofing, ICMP abuse' },
  { lbl: 'L4', txt: 'TCP RST injection, SYN floods, port scanning' },
  { lbl: 'L7', txt: 'SQL injection, XSS, request smuggling, prompt injection' }
];

const tooltip = document.getElementById('tooltip');
const host = document.getElementById('svgHost');

function el(n, a) { const e = document.createElementNS(SVGNS, n); for (const k in a) e.setAttribute(k, a[k]); return e; }
function txt(x, y, s, a) { const t = el('text', Object.assign({ x, y }, a || {})); t.textContent = s; return t; }
function showTip(title, body) {
  tooltip.innerHTML = '<div class="tt-title">' + title + '</div>' + body;
  tooltip.style.opacity = '1';
}
function moveTip(e) {
  const pad = 14; const ev = (e.touches && e.touches[0]) ? e.touches[0] : e;
  let x = ev.clientX + pad, y = ev.clientY + pad;
  const r = tooltip.getBoundingClientRect();
  if (x + r.width > window.innerWidth - 6) x = ev.clientX - r.width - pad;
  if (y + r.height > window.innerHeight - 6) y = ev.clientY - r.height - pad;
  if (y < 4) y = 4;
  tooltip.style.left = x + 'px'; tooltip.style.top = y + 'px';
}
function hideTip() { tooltip.style.opacity = '0'; }
function makeHot(g, title, body) {
  g.setAttribute('class', 'hot');
  g.addEventListener('mouseenter', () => showTip(title, body));
  g.addEventListener('mousemove', moveTip);
  g.addEventListener('mouseleave', hideTip);
  g.addEventListener('touchstart', (e) => { showTip(title, body); moveTip(e); }, { passive: true });
  g.addEventListener('touchend', hideTip);
}

function build() {
  host.innerHTML = '';
  const svg = el('svg', { viewBox: `0 0 ${VW} ${VH}`, preserveAspectRatio: 'xMidYMin meet' });

  const top = 36, bottom = 10;
  const osiX = 20, osiW = 250;
  const tcpX = 360, tcpW = 200;
  const atkX = 600, atkW = VW - atkX - 16;

  // column headers
  svg.appendChild(txt(osiX + osiW / 2, 22, 'OSI model (7 layers)',
    { 'font-size': 15, 'font-weight': 700, fill: OSI_C, 'text-anchor': 'middle' }));
  svg.appendChild(txt(tcpX + tcpW / 2, 22, 'TCP/IP model (4 layers)',
    { 'font-size': 15, 'font-weight': 700, fill: TCP_C, 'text-anchor': 'middle' }));
  svg.appendChild(txt(atkX + atkW / 2, 22, 'Where attacks live',
    { 'font-size': 15, 'font-weight': 700, fill: '#c77700', 'text-anchor': 'middle' }));

  const areaH = VH - top - bottom;
  const oGap = 5, tGap = 6;
  const oH = (areaH - oGap * (osi.length - 1)) / osi.length;   // OSI band height
  // TCP/IP bands align in height to the OSI layers they span
  const spanCount = { app: 3, transport: 1, internet: 1, link: 2 };

  // Draw OSI bands and remember each band's vertical center by map key.
  const osiBands = [];
  osi.forEach((L, i) => {
    const y = top + i * (oH + oGap);
    const g = el('g', {});
    g.appendChild(el('rect', { x: osiX, y, width: osiW, height: oH, rx: 6,
      fill: OSI_C, stroke: '#0d3a73', 'stroke-width': 1, opacity: 0.92 }));
    g.appendChild(txt(osiX + 12, y + oH / 2 - 4, L.n + '  ' + L.name,
      { 'font-size': 14, 'font-weight': 700, fill: '#ffffff' }));
    g.appendChild(txt(osiX + 12, y + oH / 2 + 13, L.ex,
      { 'font-size': 11.5, fill: '#e3f0fb' }));
    makeHot(g, 'OSI ' + L.n + ': ' + L.name, L.ex + '<br>' + L.tip);
    svg.appendChild(g);
    osiBands.push({ map: L.map, cy: y + oH / 2, right: osiX + osiW });
  });

  // Draw TCP/IP bands sized to span their OSI layers.
  let ty = top;
  tcp.forEach((T) => {
    const h = spanCount[T.key] * oH + (spanCount[T.key] - 1) * oGap;
    const g = el('g', {});
    g.appendChild(el('rect', { x: tcpX, y: ty, width: tcpW, height: h, rx: 6,
      fill: TCP_C, stroke: '#2b383d', 'stroke-width': 1, opacity: 0.95 }));
    g.appendChild(txt(tcpX + tcpW / 2, ty + h / 2 - 12, T.name,
      { 'font-size': 14, 'font-weight': 700, fill: '#ffffff', 'text-anchor': 'middle' }));
    g.appendChild(txt(tcpX + tcpW / 2, ty + h / 2 + 5, T.ex,
      { 'font-size': 11.5, fill: '#e0e6e9', 'text-anchor': 'middle' }));
    g.appendChild(txt(tcpX + tcpW / 2, ty + h / 2 + 21, T.span,
      { 'font-size': 11, fill: '#cfd8dc', 'font-style': 'italic', 'text-anchor': 'middle' }));
    makeHot(g, 'TCP/IP: ' + T.name + ' (' + T.span + ')', T.ex + '<br>' + T.tip);
    svg.appendChild(g);

    // dashed mapping lines from each OSI band of this span to this TCP band
    const cyT = ty + h / 2;
    osiBands.filter(b => b.map === T.key).forEach(b => {
      svg.appendChild(el('line', { x1: b.right, y1: b.cy, x2: tcpX, y2: cyT,
        stroke: '#90a4ae', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }));
    });
    ty += h + oGap;
  });

  // Attack callouts (far right)
  const aGap = 8, aH = (areaH - aGap * (attacks.length - 1)) / attacks.length;
  attacks.forEach((A, i) => {
    const y = top + i * (aH + aGap);
    svg.appendChild(el('rect', { x: atkX, y, width: atkW, height: aH, rx: 6,
      fill: '#fff3e0', stroke: ATK_C, 'stroke-width': 2 }));
    svg.appendChild(txt(atkX + 12, y + 20, A.lbl,
      { 'font-size': 14, 'font-weight': 700, fill: '#c77700' }));
    // wrap attack text into up to two lines
    wrapSvg(svg, A.txt, atkX + 42, y + 17, atkW - 52, 14,
      { 'font-size': 11.5, fill: '#6d4c00' });
  });

  host.appendChild(svg);
}

// simple SVG text wrapper
function wrapSvg(svg, str, x, y, maxW, lineH, attrs) {
  const words = str.split(' ');
  let line = '', cy = y;
  const flush = (s) => svg.appendChild(txt(x, cy, s, attrs));
  // approximate width: 6.2px per char at 11.5px
  const charW = 6.0;
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (test.length * charW > maxW && line) { flush(line); cy += lineH; line = w; }
    else line = test;
  }
  flush(line);
}

build();
window.addEventListener('resize', () => { /* SVG scales via viewBox */ });
