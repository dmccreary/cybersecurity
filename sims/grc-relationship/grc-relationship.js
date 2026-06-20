// CANVAS_HEIGHT: 520
// GRC Relationship — three-circle Venn (Governance, Risk, Compliance) rendered as
// inline SVG with hover/tap tooltips. Below 600px the circles stack vertically.

const COLORS = {
  governance: "#1565c0",
  risk: "#455a64",
  compliance: "#ffa000"
};

const tips = {
  governance: { title: "Governance",
    body: "Who decides and who is accountable. Governance sets direction, " +
      "assigns ownership, and approves the organization's risk appetite." },
  risk: { title: "Risk",
    body: "What could go wrong and what we do about it. Risk management " +
      "identifies, measures, and treats threats to the organization's objectives." },
  compliance: { title: "Compliance",
    body: "Evidence that we meet external standards and regulations (such as " +
      "HIPAA, PCI DSS, or GDPR). Compliance proves we did something — not that " +
      "we are secure." },
  gov_risk: { title: "Governance ∩ Risk",
    body: "Risk appetite and board reporting: leadership decides how much risk " +
      "is acceptable and is kept informed of the organization's risk posture." },
  gov_comp: { title: "Governance ∩ Compliance",
    body: "Policy ownership and audit response: leadership owns the policies that " +
      "auditors test and is accountable for responding to findings." },
  risk_comp: { title: "Risk ∩ Compliance",
    body: "Control mapping and gap analysis: comparing the controls a standard " +
      "requires against the controls actually in place to find and close gaps." },
  center: { title: "Security Program",
    body: "Where governance, risk, and compliance meet: a coherent program that " +
      "decides priorities, manages real risk, and produces the evidence that " +
      "demonstrates due care." }
};

const tooltip = document.getElementById('tooltip');
const host = document.getElementById('vennHost');

function showTip(key) {
  const t = tips[key];
  if (!t) return;
  tooltip.innerHTML = '<div class="tt-title">' + t.title + '</div>' + t.body;
  tooltip.style.opacity = '1';
}
function moveTip(e) {
  const pad = 14;
  let x = e.clientX + pad, y = e.clientY + pad;
  const r = tooltip.getBoundingClientRect();
  if (x + r.width > window.innerWidth - 6) x = e.clientX - r.width - pad;
  if (y + r.height > window.innerHeight - 6) y = e.clientY - r.height - pad;
  if (y < 4) y = 4;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}
function hideTip() { tooltip.style.opacity = '0'; }

function svgEl(name, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (const k in attrs) el.setAttribute(k, attrs[k]);
  return el;
}

function hotspot(svg, shape, attrs, key) {
  const el = svgEl(shape, Object.assign({ class: 'region', fill: 'transparent' }, attrs));
  el.addEventListener('mouseenter', () => showTip(key));
  el.addEventListener('mousemove', moveTip);
  el.addEventListener('mouseleave', hideTip);
  el.addEventListener('click', () => showTip(key));
  svg.appendChild(el);
}

function text(svg, x, y, str, cls, size, color, weight) {
  const el = svgEl('text', {
    x, y, 'text-anchor': 'middle', 'dominant-baseline': 'middle',
    'font-size': size, fill: color, class: cls || ''
  });
  if (weight) el.setAttribute('font-weight', weight);
  el.textContent = str;
  svg.appendChild(el);
}

function renderWide() {
  const W = 900, H = 470;
  const svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H,
    preserveAspectRatio: 'xMidYMin meet' });

  const r = 140;
  const gx = 340, gy = 175;   // governance (top-left)
  const rx = 560, ry = 175;   // risk (top-right)
  const cx = 450, cy = 300;   // compliance (bottom-center)

  // translucent circles
  svg.appendChild(svgEl('circle', { cx: gx, cy: gy, r, fill: COLORS.governance, 'fill-opacity': 0.45, stroke: COLORS.governance, 'stroke-width': 2 }));
  svg.appendChild(svgEl('circle', { cx: rx, cy: ry, r, fill: COLORS.risk, 'fill-opacity': 0.45, stroke: COLORS.risk, 'stroke-width': 2 }));
  svg.appendChild(svgEl('circle', { cx: cx, cy: cy, r, fill: COLORS.compliance, 'fill-opacity': 0.45, stroke: '#e65100', 'stroke-width': 2 }));

  // titles in the outer part of each circle
  text(svg, gx - 60, gy - 70, 'GOVERNANCE', 'label', 18, '#0d2f63', 700);
  text(svg, gx - 60, gy - 50, 'Who decides; who is accountable', 'sublabel', 11, '#0d2f63');
  text(svg, rx + 60, ry - 70, 'RISK', 'label', 18, '#1c2a31', 700);
  text(svg, rx + 60, ry - 50, 'What could go wrong; what we do', 'sublabel', 11, '#1c2a31');
  text(svg, cx, cy + 95, 'COMPLIANCE', 'label', 18, '#5d4d12', 700);
  text(svg, cx, cy + 112, 'Evidence we meet external standards', 'sublabel', 11, '#5d4d12');

  // overlap labels
  text(svg, (gx + rx) / 2, gy - 12, 'Risk appetite,', 'sublabel', 11, '#102a3c', 600);
  text(svg, (gx + rx) / 2, gy + 3, 'board reporting', 'sublabel', 11, '#102a3c', 600);
  text(svg, (gx + cx) / 2 - 18, (gy + cy) / 2 + 18, 'Policy ownership,', 'sublabel', 11, '#33321a', 600);
  text(svg, (gx + cx) / 2 - 18, (gy + cy) / 2 + 33, 'audit response', 'sublabel', 11, '#33321a', 600);
  text(svg, (rx + cx) / 2 + 18, (ry + cy) / 2 + 18, 'Control mapping,', 'sublabel', 11, '#33321a', 600);
  text(svg, (rx + cx) / 2 + 18, (ry + cy) / 2 + 33, 'gap analysis', 'sublabel', 11, '#33321a', 600);

  // center triple overlap
  const ctx = (gx + rx + cx) / 3, cty = (gy + ry + cy) / 3;
  text(svg, ctx, cty - 6, 'Security', 'label', 13, '#ffffff', 700);
  text(svg, ctx, cty + 9, 'Program', 'label', 13, '#ffffff', 700);

  // hotspots (small invisible circles placed in each distinct region)
  hotspot(svg, 'circle', { cx: gx - 60, cy: gy - 30, r: 40 }, 'governance');
  hotspot(svg, 'circle', { cx: rx + 60, cy: ry - 30, r: 40 }, 'risk');
  hotspot(svg, 'circle', { cx: cx, cy: cy + 55, r: 40 }, 'compliance');
  hotspot(svg, 'circle', { cx: (gx + rx) / 2, cy: gy - 4, r: 26 }, 'gov_risk');
  hotspot(svg, 'circle', { cx: (gx + cx) / 2 - 18, cy: (gy + cy) / 2 + 25, r: 24 }, 'gov_comp');
  hotspot(svg, 'circle', { cx: (rx + cx) / 2 + 18, cy: (ry + cy) / 2 + 25, r: 24 }, 'risk_comp');
  hotspot(svg, 'circle', { cx: ctx, cy: cty, r: 28 }, 'center');

  return svg;
}

function renderStacked() {
  // vertical layout for narrow screens: three labeled bars
  const W = 320, H = 400;
  const svg = svgEl('svg', { viewBox: '0 0 ' + W + ' ' + H,
    preserveAspectRatio: 'xMidYMid meet' });
  const rows = [
    { key: 'governance', label: 'GOVERNANCE', sub: 'Who decides; who is accountable', color: COLORS.governance, tc: '#fff' },
    { key: 'risk', label: 'RISK', sub: 'What could go wrong; what we do', color: COLORS.risk, tc: '#fff' },
    { key: 'compliance', label: 'COMPLIANCE', sub: 'Evidence we meet external standards', color: COLORS.compliance, tc: '#212529' },
    { key: 'center', label: 'SECURITY PROGRAM', sub: 'Where all three meet', color: '#2e7d32', tc: '#fff' }
  ];
  const h = 84, gap = 14;
  rows.forEach((row, i) => {
    const y = 8 + i * (h + gap);
    const rect = svgEl('rect', { x: 20, y, width: W - 40, height: h, rx: 10,
      fill: row.color, class: 'region' });
    rect.addEventListener('mouseenter', () => showTip(row.key));
    rect.addEventListener('mousemove', moveTip);
    rect.addEventListener('mouseleave', hideTip);
    rect.addEventListener('click', () => showTip(row.key));
    svg.appendChild(rect);
    text(svg, W / 2, y + 32, row.label, 'label', 16, row.tc, 700);
    text(svg, W / 2, y + 56, row.sub, 'sublabel', 11, row.tc);
  });
  return svg;
}

function render() {
  host.innerHTML = '';
  const narrow = host.clientWidth < 600;
  host.appendChild(narrow ? renderStacked() : renderWide());
}

render();
let lastNarrow = host.clientWidth < 600;
window.addEventListener('resize', () => {
  const narrow = host.clientWidth < 600;
  if (narrow !== lastNarrow) { lastNarrow = narrow; render(); }
});
