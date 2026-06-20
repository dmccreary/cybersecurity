// CANVAS_HEIGHT: 540
// Three Flavors of XSS — Static SVG infographic with hover tooltips.
// Bloom: Understand. Interaction = hover/tap reveals (no animation). Three
// side-by-side data-flow columns — Stored, Reflected, and DOM-based XSS — each a
// vertical stack of step boxes joined by arrows, color-coded: blue = legitimate
// flow, amber (#ffa000) = attacker-controlled data, red outline = the box where
// the script finally executes in the victim's browser. Teaching point: the three
// subtypes differ in WHERE the payload lives and WHETHER the server ever sees it
// (DOM-based never touches the server). Responsive: the three columns stack
// vertically below ~860px container width; a resize listener re-renders.

(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  const C = {
    legit: '#1565c0', legitFill: '#e3f0fb', legitBorder: '#1565c0',
    attack: '#ffa000', attackFill: '#fff3d6', attackBorder: '#e08e00',
    exec: '#c62828', execFill: '#ffebee', execBorder: '#c62828',
    arrow: '#607d8b', text: '#263238', head: '#0d2c54', cap: '#455a64'
  };

  // kind: 'legit' | 'attack' | 'exec'
  const COLUMNS = [
    {
      title: 'Stored XSS',
      titleTip: '<b>Stored (persistent) XSS.</b> The payload is saved on the server and served to every later visitor.',
      caption: 'One injection compromises every visitor.',
      steps: [
        { kind: 'attack', label: 'Attacker', sub: 'POST /comment\npayload=<script>',
          tip: 'Attacker submits a comment whose body is <code>&lt;script&gt;...&lt;/script&gt;</code> instead of text.' },
        { kind: 'legit', label: 'Server + DB', sub: 'stores payload\nin database',
          tip: 'The server saves the payload verbatim — it persists in the database, so this is the "stored" variant.' },
        { kind: 'legit', label: 'Victim', sub: 'GET /comments',
          tip: 'An ordinary visitor later requests the page that lists comments. They did nothing wrong.' },
        { kind: 'attack', label: 'Server → Victim', sub: 'page contains\n<script>',
          tip: 'The server renders the stored comment into the page without escaping it, so the markup is now live HTML.' },
        { kind: 'exec', label: "Browser executes script", sub: 'in victim context',
          tip: "The victim's browser runs the attacker's script with the site's origin — session cookies, DOM, and actions are all reachable." }
      ]
    },
    {
      title: 'Reflected XSS',
      titleTip: '<b>Reflected (non-persistent) XSS.</b> The payload rides in the request and is echoed straight back in the response.',
      caption: 'Requires the victim to click the crafted URL.',
      steps: [
        { kind: 'attack', label: 'Attacker → Victim', sub: 'phishing link\n?q=<script>',
          tip: 'Attacker emails a crafted link containing the payload in a query parameter: <code>?q=&lt;script&gt;...</code>' },
        { kind: 'attack', label: 'Victim → Server', sub: 'GET /search?q=\n<script>',
          tip: 'The victim clicks the link; the payload travels to the server inside the request. Nothing is stored.' },
        { kind: 'attack', label: 'Server → Victim', sub: 'reflects q into\nHTML, unescaped',
          tip: 'The search-results page echoes the <code>q</code> value into the HTML without escaping — the payload is reflected back.' },
        { kind: 'exec', label: 'Browser executes script', sub: 'in victim context',
          tip: 'The reflected markup runs in the victim\'s browser. No server-side storage was needed.' }
      ]
    },
    {
      title: 'DOM-based XSS',
      titleTip: '<b>DOM-based XSS.</b> The vulnerability is in client-side JavaScript; the payload may never reach the server.',
      caption: 'Server never sees the payload — invisible to server logs.',
      steps: [
        { kind: 'attack', label: 'Attacker → Victim', sub: 'crafted URL\n#payload=<script>',
          tip: 'Payload sits in the URL fragment (<code>#...</code>). Browsers do NOT send the fragment to the server.' },
        { kind: 'legit', label: 'Browser', sub: 'fetches static page',
          tip: 'The browser loads a perfectly ordinary, unmodified page. The server sees only a normal request.' },
        { kind: 'attack', label: 'Page JS reads', sub: 'location.hash',
          tip: 'Vulnerable client-side script reads attacker-controlled input from <code>location.hash</code> — a "source".' },
        { kind: 'exec', label: 'JS writes to innerHTML', sub: 'script executes',
          tip: 'The script assigns the hash into <code>element.innerHTML</code> — a dangerous "sink" — and the payload runs. The server never logged any of it.' }
      ]
    }
  ];

  function el(tag, attrs, tip) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    if (tip) node.setAttribute('data-tip', tip);
    return node;
  }

  function txt(parent, x, y, str, attrs) {
    const a = Object.assign({ x, y, 'text-anchor': 'middle',
      'font-family': 'Arial, Helvetica, sans-serif', fill: C.text }, attrs || {});
    const t = el('text', a);
    t.textContent = str;
    parent.appendChild(t);
    return t;
  }

  function arrowDefs(svg) {
    const defs = el('defs', {});
    const m = el('marker', { id: 'xssarrow', viewBox: '0 0 10 10', refX: 9, refY: 5,
      markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
    m.appendChild(el('path', { d: 'M0,0 L10,5 L0,10 z', fill: C.arrow }));
    defs.appendChild(m);
    svg.appendChild(defs);
  }

  function styleFor(kind) {
    if (kind === 'attack') return { fill: C.attackFill, border: C.attackBorder, label: C.head, sw: 2 };
    if (kind === 'exec') return { fill: C.execFill, border: C.execBorder, label: C.exec, sw: 2.6 };
    return { fill: C.legitFill, border: C.legitBorder, label: C.head, sw: 1.6 };
  }

  // Draw one column's flow at (x0, top) with given box width. Returns bottom y.
  function drawColumn(svg, col, x0, top, boxW) {
    const cx = x0 + boxW / 2;
    const boxH = 50, gapV = 30;
    // Column title
    txt(svg, cx, top, col.title, { 'font-size': 16, 'font-weight': 700, fill: C.legit })
      .setAttribute('data-tip', col.titleTip);
    let y = top + 18;
    col.steps.forEach((s, i) => {
      const st = styleFor(s.kind);
      const rect = el('rect', { x: x0, y, width: boxW, height: boxH, rx: 7,
        fill: st.fill, stroke: st.border, 'stroke-width': st.sw }, s.tip);
      svg.appendChild(rect);
      // label line
      txt(svg, cx, y + 19, s.label, { 'font-size': 12.5, 'font-weight': 700, fill: st.label })
        .setAttribute('data-tip', s.tip);
      // sub lines (may contain \n)
      const subLines = s.sub.split('\n');
      subLines.forEach((ln, li) => {
        const mono = /[<>?#=]/.test(ln) || /location|innerHTML|GET|POST/.test(ln);
        txt(svg, cx, y + 34 + li * 12, ln,
          { 'font-size': 10.5, fill: mono ? '#7a4f00' : C.cap,
            'font-family': mono ? 'Consolas, Menlo, monospace' : 'Arial, Helvetica, sans-serif' })
          .setAttribute('data-tip', s.tip);
      });
      // arrow to next box
      if (i < col.steps.length - 1) {
        const ax = cx, ay1 = y + boxH + 4, ay2 = y + boxH + gapV - 4;
        svg.appendChild(el('line', { x1: ax, y1: ay1, x2: ax, y2: ay2,
          stroke: C.arrow, 'stroke-width': 2, 'marker-end': 'url(#xssarrow)' }));
      }
      y += boxH + gapV;
    });
    // caption box
    const capY = y - gapV + 16;
    const capRect = el('rect', { x: x0, y: capY, width: boxW, height: 44, rx: 6,
      fill: '#f5f5f5', stroke: '#bdbdbd', 'stroke-width': 1, 'stroke-dasharray': '4 3' });
    svg.appendChild(capRect);
    // wrap caption text
    const words = col.caption.split(' ');
    let line = '', lines = [];
    words.forEach(w => {
      if ((line + ' ' + w).length > 30) { lines.push(line); line = w; }
      else line = line ? line + ' ' + w : w;
    });
    if (line) lines.push(line);
    lines.slice(0, 2).forEach((ln, li) => {
      txt(svg, cx, capY + 19 + li * 15, ln, { 'font-size': 11.5, 'font-style': 'italic', fill: C.cap });
    });
    return capY + 44;
  }

  // Column geometry: 5 steps max -> title(18) + 5*(50+30) = 418, + caption ~60.
  function colHeight(col) {
    return 18 + col.steps.length * 80 + 60;
  }

  // ---------- Wide (3 across) ----------
  function renderWide() {
    const W = 980, pad = 20, colGap = 24;
    const boxW = (W - 2 * pad - 2 * colGap) / 3;
    const maxSteps = Math.max(...COLUMNS.map(c => c.steps.length));
    const H = 18 + maxSteps * 80 + 60 + 24;
    const svg = el('svg', { class: 'diagram', viewBox: `0 0 ${W} ${H}`,
      role: 'img', 'aria-label': 'Three columns of XSS data flow: stored, reflected, DOM-based' });
    arrowDefs(svg);
    COLUMNS.forEach((col, i) => {
      const x0 = pad + i * (boxW + colGap);
      drawColumn(svg, col, x0, 18, boxW);
      // vertical separator between columns
      if (i < COLUMNS.length - 1) {
        const sx = x0 + boxW + colGap / 2;
        svg.appendChild(el('line', { x1: sx, y1: 8, x2: sx, y2: H - 8,
          stroke: '#eceff1', 'stroke-width': 1 }));
      }
    });
    return svg;
  }

  // ---------- Narrow (stacked) ----------
  function renderStacked() {
    const W = 420, pad = 16, boxW = W - 2 * pad, blockGap = 26;
    let total = 8;
    COLUMNS.forEach(c => { total += colHeight(c) + blockGap; });
    const svg = el('svg', { class: 'diagram', viewBox: `0 0 ${W} ${total}`,
      role: 'img', 'aria-label': 'Three XSS data flows stacked vertically' });
    arrowDefs(svg);
    let y = 14;
    COLUMNS.forEach(col => {
      const bottom = drawColumn(svg, col, pad, y, boxW);
      y = bottom + blockGap;
    });
    return svg;
  }

  let isStacked = null;
  function render() {
    const host = document.getElementById('diagram');
    if (!host) return;
    const stacked = host.clientWidth > 0 && host.clientWidth < 680;
    if (stacked === isStacked && host.firstChild) return;
    isStacked = stacked;
    host.innerHTML = '';
    host.appendChild(stacked ? renderStacked() : renderWide());
  }

  function wireTooltips() {
    const tip = document.getElementById('tip');
    if (!tip) return;
    function show(e) {
      const t = e.target.closest('[data-tip]');
      if (!t) { tip.style.opacity = '0'; return; }
      tip.innerHTML = t.getAttribute('data-tip');
      tip.style.opacity = '1';
      move(e);
    }
    function move(e) {
      const x = (e.touches ? e.touches[0].clientX : e.clientX) + 14;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) + 14;
      tip.style.left = Math.min(x, window.innerWidth - 310) + 'px';
      tip.style.top = Math.min(y, window.innerHeight - 100) + 'px';
    }
    document.addEventListener('mousemove', show);
    document.addEventListener('mouseleave', () => tip.style.opacity = '0');
    document.addEventListener('touchstart', show, { passive: true });
  }

  function init() {
    render();
    wireTooltips();
    window.addEventListener('resize', render);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
