// CANVAS_HEIGHT: 500
// Network Telemetry Stack — inline SVG layered reference diagram.
// Bloom: Understand. Five telemetry-source bands are stacked top (highest fidelity
// / narrowest coverage = full PCAP) to bottom (broadest coverage / cheapest = DNS
// logs). Each band shows the data type, an example tool, and the question it
// answers, and an arrow into the cream SIEM / data-lake box on the right. The
// "Fidelity" (up) and "Coverage" (down) axes flank the stack. Hover any band for a
// deployment-detail tooltip.
//
// Implemented as inline SVG (not Mermaid) because a five-layer vertical stack with
// a side SIEM renders far more compactly and predictably this way than a Mermaid
// flowchart, which blows the node text up under useMaxWidth in a wide iframe.

const SVGNS = 'http://www.w3.org/2000/svg';
const VW = 880, VH = 408;

const layers = [
  { key: 'pcap', title: 'Full Packet Capture (PCAP)', tool: 'tcpdump, Wireshark, Arkime',
    q: 'What were the exact bytes of this conversation?', fill: '#0d47a1', txt: '#ffffff',
    tip: 'Highest fidelity, lowest coverage. Captures every byte but is huge to store, ' +
         'so it is usually triggered on-demand around an investigation.' },
  { key: 'applog', title: 'Application Logs', tool: 'web server & application audit logs',
    q: 'What did the application do with this request?', fill: '#1565c0', txt: '#ffffff',
    tip: 'Business-level meaning the network never sees: which user, which action, ' +
         'which record. Quality varies with how well the app was instrumented.' },
  { key: 'fwlog', title: 'Firewall / Proxy Logs', tool: 'pfSense, Squid',
    q: 'Was this connection allowed, denied, or filtered?', fill: '#1976d2', txt: '#ffffff',
    tip: 'The perimeter’s record of what was permitted and blocked. Cheap and ' +
         'high-volume; great for confirming whether traffic ever left the network.' },
  { key: 'flow', title: 'NetFlow / IPFIX / sFlow', tool: 'nfdump, Elastiflow',
    q: 'Who talked to whom, when, and how much?', fill: '#42a5f5', txt: '#0d2c54',
    tip: 'Connection metadata without payload: src, dst, ports, bytes, timing. ' +
         'Broad always-on coverage that powers most lateral-movement detections.' },
  { key: 'dns', title: 'DNS Query Logs', tool: 'resolver logs',
    q: 'What names did this host look up?', fill: '#90caf9', txt: '#0d2c54',
    tip: 'Often the highest value per byte: nearly every connection starts with a ' +
         'lookup, so DNS logs reveal beaconing and exfiltration domains cheaply.' }
];

const tooltip = document.getElementById('tooltip');
const host = document.getElementById('svgHost');

function el(n, a) { const e = document.createElementNS(SVGNS, n); for (const k in a) e.setAttribute(k, a[k]); return e; }
function txt(x, y, s, a) { const t = el('text', Object.assign({ x, y }, a || {})); t.textContent = s; return t; }

function showTip(L) {
  tooltip.innerHTML = '<div class="tt-title">' + L.title + '</div>' + L.tip;
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

function build() {
  host.innerHTML = '';
  const svg = el('svg', { viewBox: `0 0 ${VW} ${VH}`, preserveAspectRatio: 'xMidYMin meet' });

  const defs = el('defs', {});
  const m = el('marker', { id: 'arr', markerWidth: 9, markerHeight: 9, refX: 7, refY: 3,
    orient: 'auto', markerUnits: 'strokeWidth' });
  m.appendChild(el('path', { d: 'M0,0 L6,3 L0,6 Z', fill: '#455a64' }));
  defs.appendChild(m);
  svg.appendChild(defs);

  // axis columns
  const axW = 30;
  const stackX = axW + 8, stackW = 540;
  const top = 8, gap = 8;
  const bandH = (VH - top - 8 - gap * (layers.length - 1)) / layers.length;

  // Fidelity axis (left, arrow up)
  svg.appendChild(el('line', { x1: 15, y1: VH - 14, x2: 15, y2: 14, stroke: '#1565c0',
    'stroke-width': 2.5, 'marker-end': 'url(#arr)' }));
  svg.appendChild(txt(15, VH / 2, 'FIDELITY', { 'font-size': 13, 'font-weight': 700, fill: '#1565c0',
    'text-anchor': 'middle', transform: `rotate(-90 15 ${VH / 2})` }));

  // Coverage axis (right, arrow down)
  const rx = VW - 15;
  svg.appendChild(el('line', { x1: rx, y1: 14, x2: rx, y2: VH - 14, stroke: '#d84315',
    'stroke-width': 2.5, 'marker-end': 'url(#arr-d)' }));
  // separate down marker (reuse same path, orient handles direction)
  const md = el('marker', { id: 'arr-d', markerWidth: 9, markerHeight: 9, refX: 7, refY: 3,
    orient: 'auto', markerUnits: 'strokeWidth' });
  md.appendChild(el('path', { d: 'M0,0 L6,3 L0,6 Z', fill: '#d84315' }));
  defs.appendChild(md);
  svg.appendChild(txt(rx, VH / 2, 'COVERAGE', { 'font-size': 13, 'font-weight': 700, fill: '#d84315',
    'text-anchor': 'middle', transform: `rotate(90 ${rx} ${VH / 2})` }));

  // SIEM box (right of the stack)
  const siemX = stackX + stackW + 36, siemW = VW - siemX - 40;
  const siemY = top + bandH, siemH = bandH * 3 + gap * 2;
  const gS = el('g', {});
  gS.appendChild(el('rect', { x: siemX, y: siemY, width: siemW, height: siemH, rx: 10,
    fill: '#fff8e1', stroke: '#ffa000', 'stroke-width': 3 }));
  gS.appendChild(txt(siemX + siemW / 2, siemY + siemH / 2 - 18, 'SIEM / Data Lake',
    { 'font-size': 15, 'font-weight': 700, fill: '#5d3d00', 'text-anchor': 'middle' }));
  gS.appendChild(txt(siemX + siemW / 2, siemY + siemH / 2 + 4, 'Splunk · Elastic · Chronicle',
    { 'font-size': 12, fill: '#6d4c00', 'text-anchor': 'middle' }));
  gS.appendChild(txt(siemX + siemW / 2, siemY + siemH / 2 + 24, 'Correlation rules run here',
    { 'font-size': 11.5, fill: '#6d4c00', 'font-style': 'italic', 'text-anchor': 'middle' }));
  svg.appendChild(gS);

  // layer bands + feed arrows
  layers.forEach((L, i) => {
    const y = top + i * (bandH + gap);
    const g = el('g', {});
    g.setAttribute('class', 'hot');
    g.appendChild(el('rect', { x: stackX, y, width: stackW, height: bandH, rx: 8,
      fill: L.fill, stroke: '#0d3a73', 'stroke-width': 1.2 }));
    g.appendChild(txt(stackX + 16, y + 22, L.title,
      { 'font-size': 15, 'font-weight': 700, fill: L.txt }));
    g.appendChild(txt(stackX + 16, y + 41, L.tool,
      { 'font-size': 12.5, fill: L.txt, opacity: 0.92 }));
    g.appendChild(txt(stackX + 16, y + 41 + 18, L.q,
      { 'font-size': 12.5, fill: L.txt, 'font-style': 'italic' }));
    g.addEventListener('mouseenter', () => showTip(L));
    g.addEventListener('mousemove', moveTip);
    g.addEventListener('mouseleave', hideTip);
    g.addEventListener('touchstart', (e) => { showTip(L); moveTip(e); }, { passive: true });
    g.addEventListener('touchend', hideTip);
    svg.appendChild(g);

    // arrow from band right edge to SIEM left edge
    const ay = y + bandH / 2;
    svg.appendChild(el('path', {
      d: `M ${stackX + stackW} ${ay} C ${stackX + stackW + 20} ${ay}, ${siemX - 20} ${siemY + siemH / 2}, ${siemX} ${siemY + siemH / 2}`,
      fill: 'none', stroke: '#455a64', 'stroke-width': 1.6, 'marker-end': 'url(#arr)', opacity: 0.7
    }));
  });

  host.appendChild(svg);
}

build();
window.addEventListener('resize', () => { /* SVG scales via viewBox */ });
