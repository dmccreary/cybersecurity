// CANVAS_HEIGHT: 620
// NIST CSF 2.0 Functions wheel — inline SVG with hover tooltips and a
// responsive re-render. GOVERN is the center hub; the five operational
// functions form a colored ring. Below 600px the wheel becomes a numbered
// vertical list. A clockwise arrow suggests the Identify -> Protect -> Detect
// -> Respond -> Recover cycle, with Govern overseeing all five.

const functions = [
  {
    key: 'identify', name: 'IDENTIFY', sub: 'Assets, risks, roles.',
    color: '#455a64', text: '#ffffff',
    tip: 'IDENTIFY — Develop an understanding of your assets, data, suppliers, and the cybersecurity risks to them, so the other functions can be prioritized.'
  },
  {
    key: 'protect', name: 'PROTECT', sub: 'Safeguards, training, access control.',
    color: '#1e88e5', text: '#ffffff',
    tip: 'PROTECT — Put safeguards in place (access control, training, data security, maintenance) to limit or contain the impact of a potential incident.'
  },
  {
    key: 'detect', name: 'DETECT', sub: 'Monitoring, anomalies, IDS.',
    color: '#ffa000', text: '#212529',
    tip: 'DETECT — Continuous monitoring identifies anomalies and signals incidents within the time-to-detect target so a response can begin.'
  },
  {
    key: 'respond', name: 'RESPOND', sub: 'Containment, communications, analysis.',
    color: '#d84315', text: '#ffffff',
    tip: 'RESPOND — Take action on a detected incident: contain it, analyze it, communicate with stakeholders, and mitigate to limit the blast radius.'
  },
  {
    key: 'recover', name: 'RECOVER', sub: 'Restore, lessons learned, plans.',
    color: '#fff8e1', text: '#5d4037',
    tip: 'RECOVER — Restore the capabilities or services impaired by an incident, and feed lessons learned back into the plan for next time.'
  }
];

const govern = {
  key: 'govern', name: 'GOVERN', sub: 'Strategy, expectations, policy.',
  color: '#1565c0', text: '#ffffff',
  tip: 'GOVERN — Establish and monitor the cybersecurity strategy, expectations, and policy. New in CSF 2.0, it oversees all five operational functions.'
};

const tipEl = document.getElementById('tip');
const defaultTip = tipEl.textContent;

function clearActive() {
  document.querySelectorAll('.seg.active, .hub.active, .listitem.active')
    .forEach(el => el.classList.remove('active'));
}

function bind(el, fn) {
  el.addEventListener('mouseenter', () => { clearActive(); el.classList.add('active'); tipEl.textContent = fn.tip; });
  el.addEventListener('click', () => { clearActive(); el.classList.add('active'); tipEl.textContent = fn.tip; });
  el.addEventListener('mouseleave', () => { el.classList.remove('active'); tipEl.textContent = defaultTip; });
}

// Polar helper: angle in degrees, 0 = up (12 o'clock), clockwise positive.
function polar(cx, cy, r, deg) {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function ringSegmentPath(cx, cy, rInner, rOuter, startDeg, endDeg) {
  const p1 = polar(cx, cy, rOuter, startDeg);
  const p2 = polar(cx, cy, rOuter, endDeg);
  const p3 = polar(cx, cy, rInner, endDeg);
  const p4 = polar(cx, cy, rInner, startDeg);
  const large = (endDeg - startDeg) <= 180 ? 0 : 1;
  return [
    `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`,
    `L ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${p4.x.toFixed(2)} ${p4.y.toFixed(2)}`,
    'Z'
  ].join(' ');
}

function renderWheel() {
  const W = 600, H = 520, cx = 300, cy = 250;
  const rInner = 96, rOuter = 188, rArrow = 210, rLabel = (rInner + rOuter) / 2;
  const seg = 72; // 360 / 5
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="NIST CSF 2.0 wheel of six functions">`;

  // outer clockwise direction arrow (3/4 circle)
  const aStart = polar(cx, cy, rArrow, 8);
  const aEnd = polar(cx, cy, rArrow, 300);
  svg += `<path d="M ${aStart.x.toFixed(2)} ${aStart.y.toFixed(2)} A ${rArrow} ${rArrow} 0 1 1 ${aEnd.x.toFixed(2)} ${aEnd.y.toFixed(2)}" fill="none" stroke="#90a4ae" stroke-width="3"/>`;
  // arrowhead at aEnd pointing clockwise
  const tan = polar(cx, cy, rArrow, 300 + 4);
  const dx = tan.x - aEnd.x, dy = tan.y - aEnd.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const nx = -uy, ny = ux;
  const tip1x = aEnd.x + ux * 12 + nx * 6, tip1y = aEnd.y + uy * 12 + ny * 6;
  const tip2x = aEnd.x + ux * 12 - nx * 6, tip2y = aEnd.y + uy * 12 - ny * 6;
  svg += `<polygon points="${aEnd.x.toFixed(1)},${aEnd.y.toFixed(1)} ${tip1x.toFixed(1)},${tip1y.toFixed(1)} ${tip2x.toFixed(1)},${tip2y.toFixed(1)}" fill="#90a4ae"/>`;

  // five ring segments
  functions.forEach((f, i) => {
    const start = i * seg + 2;
    const end = (i + 1) * seg - 2;
    const mid = (start + end) / 2;
    const d = ringSegmentPath(cx, cy, rInner, rOuter, start, end);
    const lp = polar(cx, cy, rLabel, mid);
    svg += `<g class="seg" data-key="${f.key}">`;
    svg += `<path d="${d}" fill="${f.color}" stroke="#ffffff" stroke-width="3"/>`;
    svg += `<text x="${lp.x.toFixed(1)}" y="${(lp.y + 5).toFixed(1)}" text-anchor="middle" font-size="17" font-weight="700" fill="${f.text}">${f.name}</text>`;
    svg += `</g>`;
  });

  // center hub: GOVERN
  svg += `<g class="hub" data-key="govern">`;
  svg += `<circle cx="${cx}" cy="${cy}" r="${rInner - 6}" fill="${govern.color}" stroke="#ffffff" stroke-width="3"/>`;
  svg += `<text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="20" font-weight="700" fill="#ffffff">GOVERN</text>`;
  svg += `<text x="${cx}" y="${cy + 13}" text-anchor="middle" font-size="10.5" fill="#ffffff">Strategy, expectations,</text>`;
  svg += `<text x="${cx}" y="${cy + 26}" text-anchor="middle" font-size="10.5" fill="#ffffff">policy</text>`;
  svg += `</g>`;

  svg += `</svg>`;
  document.getElementById('diagram').innerHTML = svg;

  document.querySelectorAll('.seg').forEach(el => {
    const f = functions.find(x => x.key === el.dataset.key);
    bind(el, f);
  });
  const hub = document.querySelector('.hub');
  if (hub) bind(hub, govern);
}

function renderList() {
  const order = [govern, ...functions];
  let html = '<div class="list">';
  order.forEach((f, i) => {
    html += `<div class="listitem" data-key="${f.key}">`;
    html += `<div class="num" style="background:${f.color === '#fff8e1' ? '#bfa14a' : f.color}">${i}</div>`;
    html += `<div class="body"><strong>${f.name}</strong><span>${f.sub}</span></div>`;
    html += `</div>`;
  });
  html += '</div>';
  document.getElementById('diagram').innerHTML = html;

  document.querySelectorAll('.listitem').forEach(el => {
    const f = order.find(x => x.key === el.dataset.key);
    bind(el, f);
  });
}

function render() {
  tipEl.textContent = defaultTip;
  if (window.innerWidth < 600) {
    renderList();
  } else {
    renderWheel();
  }
}

render();
window.addEventListener('resize', render);
