// CANVAS_HEIGHT: 520
// Attack Surface, Trust Boundary, and Blast Radius — static SVG architecture
// diagram with hover tooltips. Bloom: Understand. Interaction = hover/tap reveals
// (no animation). One simple 3-tier web app carries three distinct ideas:
//   - the red dashed ATTACK SURFACE (where an adversary can poke),
//   - two solid blue TRUST BOUNDARIES (where trust level changes), and
//   - two amber dashed BLAST RADIUS circles (what one compromise reaches).
// The teaching point: surface, boundary, and blast radius are different
// questions about the same system. Responsive: SVG scales to container width.

(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const C = {
    surface: '#c62828', boundary: '#1565c0', component: '#455a64',
    blast: '#ffa000', text: '#263238', white: '#ffffff'
  };

  function el(name, attrs, tip) {
    const e = document.createElementNS(SVG_NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (tip) {
      e.setAttribute('data-tip', tip);
      e.classList.add('hot');
      const t = document.createElementNS(SVG_NS, 'title');
      t.textContent = tip;
      e.appendChild(t);
    }
    return e;
  }
  function txt(svg, x, y, s, attrs) {
    const t = el('text', Object.assign({ x, y, fill: C.text, 'font-size': 12,
      'text-anchor': 'middle' }, attrs || {}));
    t.textContent = s;
    svg.appendChild(t);
    return t;
  }

  function component(svg, x, y, w, h, label, sublabel, tip) {
    svg.appendChild(el('rect', { x, y, width: w, height: h, rx: 8,
      fill: '#eceff1', stroke: C.component, 'stroke-width': 2.5 }, tip));
    txt(svg, x + w / 2, y + h / 2 - 2, label, { 'font-size': 13, 'font-weight': 700, fill: '#37474f' });
    if (sublabel) txt(svg, x + w / 2, y + h / 2 + 15, sublabel, { 'font-size': 10.5, fill: '#607d8b' });
  }

  function boundary(svg, x, yTop, yBot, label, tip) {
    svg.appendChild(el('line', { x1: x, y1: yTop, x2: x, y2: yBot,
      stroke: C.boundary, 'stroke-width': 3.5 }, tip));
    // label rotated along the line
    const t = el('text', { x: x, y: yTop - 8, 'text-anchor': 'middle',
      'font-size': 11.5, 'font-weight': 700, fill: C.boundary }, tip);
    t.textContent = label;
    svg.appendChild(t);
  }

  function explosion(svg, cx, cy, r, tip) {
    // jagged star burst
    let d = '';
    const spikes = 10;
    for (let i = 0; i < spikes * 2; i++) {
      const ang = (Math.PI * i) / spikes - Math.PI / 2;
      const rad = (i % 2 === 0) ? r : r * 0.5;
      d += (i === 0 ? 'M' : 'L') + (cx + rad * Math.cos(ang)).toFixed(1) + ',' +
        (cy + rad * Math.sin(ang)).toFixed(1) + ' ';
    }
    d += 'Z';
    svg.appendChild(el('path', { d, fill: '#ff7043', stroke: '#bf360c', 'stroke-width': 1.5 }, tip));
    txt(svg, cx, cy + 4, '💥', { 'font-size': 14 });
  }

  function render() {
    const host = document.getElementById('diagram');
    if (!host) return;
    host.innerHTML = '';
    const W = 880, H = 470;
    const svg = el('svg', { class: 'diagram', viewBox: '0 0 ' + W + ' ' + H,
      preserveAspectRatio: 'xMidYMid meet', role: 'img',
      'aria-label': 'A 3-tier web app showing the attack surface on the internet side, two trust boundaries, the internal components, and two blast-radius circles.' });

    // band lanes
    const laneY = 70, laneH = 200;

    // ---- attack surface box (red dashed, left / internet side) ----
    const asX = 18, asY = 56, asW = 200, asH = 360;
    svg.appendChild(el('rect', { x: asX, y: asY, width: asW, height: asH, rx: 10,
      fill: '#fff5f5', stroke: C.surface, 'stroke-width': 2.5, 'stroke-dasharray': '8 5' },
      'Attack surface: every place an untrusted party can send input. Minimizing it is the cheapest security win — every endpoint you remove is one an attacker cannot reach.'));
    txt(svg, asX + asW / 2, asY + 20, 'ATTACK SURFACE', { 'font-size': 13, 'font-weight': 800, fill: C.surface });
    txt(svg, asX + asW / 2, asY + 36, '(internet-facing)', { 'font-size': 10.5, fill: '#a13b3b' });

    const points = [
      ['HTTPS endpoint', 'TLS termination; the front door for all traffic.'],
      ['Login form', 'Credential stuffing, brute force, injection in auth fields.'],
      ['Password reset', 'Account-takeover via token leakage or host-header injection.'],
      ['File upload', 'Malicious files, path traversal, content-type confusion.'],
      ['API tokens', 'Leaked or over-scoped tokens grant programmatic access.'],
      ['3rd-party JavaScript', 'Supply-chain risk: a compromised script runs in your origin.']
    ];
    points.forEach((p, i) => {
      const py = asY + 56 + i * 50;
      svg.appendChild(el('rect', { x: asX + 14, y: py, width: asW - 28, height: 38, rx: 6,
        fill: C.white, stroke: C.surface, 'stroke-width': 1.5 }, p[1]));
      txt(svg, asX + asW / 2, py + 23, p[0], { 'font-size': 11.5, 'font-weight': 600, fill: '#7a1f1f' });
    });

    // attacker glyph above the surface box
    txt(svg, asX + asW / 2, asY - 22, '🧑‍💻 Untrusted internet', { 'font-size': 12, 'font-weight': 700, fill: C.surface });

    // ---- trust boundary 1: Untrusted -> DMZ ----
    boundary(svg, 250, 50, 430, 'Untrusted → DMZ',
      'Trust boundary: the point where data crosses from a less-trusted zone to a more-trusted one. Validate, authenticate, and rate-limit everything that crosses here.');

    // ---- reverse proxy (DMZ) ----
    component(svg, 282, 200, 130, 80, 'Reverse Proxy', 'DMZ · WAF · TLS',
      'Reverse proxy in the DMZ: terminates TLS, applies a WAF, and forwards only well-formed requests inward. First internal component an attacker reaches.');

    // arrow proxy -> app
    svg.appendChild(el('line', { x1: 412, y1: 240, x2: 470, y2: 240, stroke: C.component, 'stroke-width': 2, 'marker-end': 'url(#arr)' }));

    // ---- app server (blast radius #1) ----
    const appX = 470, appCx = 540, appCy = 240;
    // blast circle around app (draw before component so it sits behind)
    svg.appendChild(el('circle', { cx: appCx, cy: appCy, r: 100, fill: 'rgba(255,160,0,0.10)',
      stroke: C.blast, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' },
      'Blast radius if the app server is compromised: read all users’ records via the DB connection — but NO path to the host OS or to other tenants. Containment limits the damage.'));
    component(svg, appX, 200, 140, 80, 'Application Server', 'business logic',
      'Application server: runs your code. If an attacker gains code execution here, what can they reach? That question is the blast radius.');
    explosion(svg, appX + 10, 196, 16, 'Compromise point: assume the app server is breached. Now reason about blast radius, not about whether the breach happened.');
    txt(svg, appCx, appCy + 118, 'Blast radius: all user records', { 'font-size': 11, 'font-weight': 700, fill: '#a06a00' });
    txt(svg, appCx, appCy + 132, 'no path to OS', { 'font-size': 10.5, fill: '#a06a00' });

    // ---- trust boundary 2: App -> Data tier ----
    boundary(svg, 668, 50, 430, 'App → Data tier',
      'Second trust boundary: the application tier is not the database tier. Least-privilege DB credentials and network segmentation here shrink the blast radius of an app compromise.');

    // arrow app -> db
    svg.appendChild(el('line', { x1: 610, y1: 240, x2: 700, y2: 240, stroke: C.component, 'stroke-width': 2, 'marker-end': 'url(#arr)' }));

    // ---- database (blast radius #2) ----
    const dbX = 700, dbCx = 770, dbCy = 240;
    svg.appendChild(el('circle', { cx: dbCx, cy: dbCy, r: 74, fill: 'rgba(255,160,0,0.10)',
      stroke: C.blast, 'stroke-width': 2.5, 'stroke-dasharray': '7 5' },
      'Blast radius if the DB credentials are stolen: read/write ALL customer data directly. This is why DB creds are high-value and why app-tier creds should be least-privilege and rotatable.'));
    // db cylinder
    svg.appendChild(el('ellipse', { cx: dbCx, cy: 206, rx: 38, ry: 11, fill: '#cfd8dc', stroke: C.component, 'stroke-width': 2 },
      'Database: the crown jewels. Customer data at rest.'));
    svg.appendChild(el('path', { d: 'M' + (dbCx - 38) + ',206 v52 a38,11 0 0 0 76,0 v-52',
      fill: '#eceff1', stroke: C.component, 'stroke-width': 2 }));
    txt(svg, dbCx, 248, 'Database', { 'font-size': 12.5, 'font-weight': 700, fill: '#37474f' });
    txt(svg, dbCx, dbCy + 92, 'Blast radius: all customer data', { 'font-size': 11, 'font-weight': 700, fill: '#a06a00' });
    txt(svg, dbCx, dbCy + 106, 'read AND write', { 'font-size': 10.5, fill: '#a06a00' });

    // arrowhead marker
    const defs = document.createElementNS(SVG_NS, 'defs');
    const m = el('marker', { id: 'arr', markerWidth: 8, markerHeight: 8, refX: 6, refY: 3, orient: 'auto' });
    m.appendChild(el('path', { d: 'M0,0 L6,3 L0,6 Z', fill: C.component }));
    defs.appendChild(m);
    svg.insertBefore(defs, svg.firstChild);

    host.appendChild(svg);
  }

  function wireTooltips() {
    const tip = document.getElementById('tip');
    function show(e) {
      const t = e.target.closest('[data-tip]');
      if (!t) { tip.style.opacity = '0'; return; }
      tip.textContent = t.getAttribute('data-tip');
      tip.style.opacity = '1';
      move(e);
    }
    function move(e) {
      const x = (e.touches ? e.touches[0].clientX : e.clientX) + 14;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) + 14;
      tip.style.left = Math.min(x, window.innerWidth - 290) + 'px';
      tip.style.top = y + 'px';
    }
    document.addEventListener('mousemove', show);
    document.addEventListener('mouseleave', () => tip.style.opacity = '0');
    document.addEventListener('touchstart', show, { passive: true });
  }

  function init() { render(); wireTooltips(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
