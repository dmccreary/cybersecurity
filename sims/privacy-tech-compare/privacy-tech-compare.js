// CANVAS_HEIGHT: 525
// Privacy-Enhancing Technologies Compared — inline SVG 2x2 comparison cards.
// Bloom: Analyze (side-by-side comparison). Four privacy techniques (FHE, MPC, DP,
// ZKP) are shown as cards with the same six fields so they can be compared
// directly: definition, who sees inputs, who sees outputs, computational cost
// (1-5 bars, rust->gold gradient), and maturity. Each card has a hover/tap tooltip
// with a real-world deployment example. A footer band lists "when to reach for
// which". The SVG scales to its container via a fixed viewBox.

const SVGNS = 'http://www.w3.org/2000/svg';
const VW = 900, VH = 520;
const BLUE = '#1565c0', SLATE = '#455a64';

const cards = [
  { name: 'Homomorphic Encryption (FHE)',
    def: 'Compute directly on ciphertext.',
    inputs: 'client only', outputs: 'client only', cost: 5, maturity: 'Niche → Production',
    when: 'Reach for FHE when one party must compute on another\'s data without ever seeing it.',
    tip: 'Privacy-preserving ML inference and encrypted database queries. Libraries: Microsoft SEAL, OpenFHE.' },
  { name: 'Secure Multi-Party Computation (MPC)',
    def: 'Multiple parties compute jointly without sharing inputs.',
    inputs: 'each party sees only its own', outputs: 'all participating parties', cost: 3, maturity: 'Production',
    when: 'Reach for MPC when several distrusting parties want a joint result over private inputs.',
    tip: 'Threshold signatures, joint medical research, and privacy-preserving ad measurement.' },
  { name: 'Differential Privacy (DP)',
    def: 'Add calibrated noise to bound any single record\'s influence.',
    inputs: 'data curator', outputs: 'anyone (with bounded leakage)', cost: 1, maturity: 'Production',
    when: 'Reach for DP when publishing aggregate statistics while bounding what any one record reveals.',
    tip: 'U.S. 2020 Census, Apple iOS telemetry, and Google Chrome diagnostics.' },
  { name: 'Zero-Knowledge Proofs (ZKP)',
    def: 'Prove a statement is true without revealing why.',
    inputs: 'prover only', outputs: 'verifier (true/false + proof)', cost: 4, maturity: 'Production (growing)',
    when: 'Reach for ZKP when you must prove a fact (eligibility, balance) without disclosing the data behind it.',
    tip: 'Zcash shielded transactions, anonymous credentials, and blockchain rollups.' }
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

// cost-bar segment color, rust (#d84315) at 1 up to gold (#ffa000) at 5
const costColors = ['#d84315', '#e2641c', '#ec8413', '#f6a209', '#ffa000'];

function build() {
  host.innerHTML = '';
  const svg = el('svg', { viewBox: `0 0 ${VW} ${VH}`, preserveAspectRatio: 'xMidYMin meet' });

  const pad = 14;
  const cols = 2, rows = 2;
  const footerH = 92;
  const gridTop = 6, gridBottom = footerH + 12;
  const cardW = (VW - pad * (cols + 1)) / cols;
  const cardH = (VH - gridTop - gridBottom - pad) / rows;

  cards.forEach((c, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = pad + col * (cardW + pad);
    const y = gridTop + row * (cardH + pad);
    const g = el('g', {});
    g.setAttribute('class', 'hot');

    // card body
    g.appendChild(el('rect', { x, y, width: cardW, height: cardH, rx: 10,
      fill: '#ffffff', stroke: SLATE, 'stroke-width': 1.5 }));
    // header band (slate) with blue title text
    g.appendChild(el('rect', { x, y, width: cardW, height: 30, rx: 10,
      fill: '#eef3f8', stroke: 'none' }));
    g.appendChild(el('rect', { x, y: y + 16, width: cardW, height: 14, fill: '#eef3f8', stroke: 'none' }));
    g.appendChild(txt(x + 14, y + 20, c.name,
      { 'font-size': 14.5, 'font-weight': 700, fill: BLUE }));

    let ly = y + 50;
    g.appendChild(txt(x + 14, ly, c.def, { 'font-size': 12.5, 'font-style': 'italic', fill: '#263238' }));
    ly += 24;
    g.appendChild(txt(x + 14, ly, 'Inputs visible to:', { 'font-size': 12, 'font-weight': 700, fill: SLATE }));
    g.appendChild(txt(x + 130, ly, c.inputs, { 'font-size': 12, fill: '#263238' }));
    ly += 19;
    g.appendChild(txt(x + 14, ly, 'Outputs visible to:', { 'font-size': 12, 'font-weight': 700, fill: SLATE }));
    g.appendChild(txt(x + 130, ly, c.outputs, { 'font-size': 12, fill: '#263238' }));
    ly += 22;
    // cost bars
    g.appendChild(txt(x + 14, ly + 1, 'Cost:', { 'font-size': 12, 'font-weight': 700, fill: SLATE }));
    const barX = x + 60, barW = 22, barGap = 5, barH = 13;
    for (let b = 0; b < 5; b++) {
      const filled = b < c.cost;
      g.appendChild(el('rect', { x: barX + b * (barW + barGap), y: ly - 10, width: barW, height: barH, rx: 2,
        fill: filled ? costColors[b] : '#e0e0e0', stroke: '#bdbdbd', 'stroke-width': 0.8 }));
    }
    g.appendChild(txt(barX + 5 * (barW + barGap) + 6, ly + 1, c.cost + ' / 5',
      { 'font-size': 11.5, fill: '#6d4c00', 'font-weight': 700 }));
    ly += 22;
    // maturity pill
    g.appendChild(txt(x + 14, ly, 'Maturity:', { 'font-size': 12, 'font-weight': 700, fill: SLATE }));
    g.appendChild(txt(x + 80, ly, c.maturity, { 'font-size': 12, fill: BLUE, 'font-weight': 700 }));

    g.addEventListener('mouseenter', () => showTip(c.name, '<b>Real-world example:</b> ' + c.tip));
    g.addEventListener('mousemove', moveTip);
    g.addEventListener('mouseleave', hideTip);
    g.addEventListener('touchstart', (e) => { showTip(c.name, '<b>Real-world example:</b> ' + c.tip); moveTip(e); }, { passive: true });
    g.addEventListener('touchend', hideTip);
    svg.appendChild(g);
  });

  // footer band: "When to reach for which"
  const fy = VH - footerH - 4;
  svg.appendChild(el('rect', { x: pad, y: fy, width: VW - pad * 2, height: footerH, rx: 10,
    fill: '#fff8e1', stroke: '#ffa000', 'stroke-width': 2 }));
  svg.appendChild(txt(pad + 14, fy + 20, 'When to reach for which',
    { 'font-size': 14, 'font-weight': 700, fill: '#c77700' }));
  let fyy = fy + 38;
  cards.forEach((c) => {
    const short = c.name.replace(/.*\((\w+)\).*/, '$1');
    svg.appendChild(txt(pad + 18, fyy, '• ' + short + ' — ' + c.when,
      { 'font-size': 11.5, fill: '#6d4c00' }));
    fyy += 15;
  });

  host.appendChild(svg);
}

build();
window.addEventListener('resize', () => { /* SVG scales via viewBox */ });
