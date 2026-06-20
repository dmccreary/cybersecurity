// CANVAS_HEIGHT: 760
// Block Cipher Modes Comparison — Static SVG infographic with hover tooltips.
// Bloom: Understand. Interaction = hover/tap reveals (no animation). A 2x2 grid
// compares ECB, CBC, CTR and GCM. ECB is outlined amber (avoid), GCM green
// (recommended), CBC/CTR neutral slate.

(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const W = 380, H = 250; // per-tile SVG viewBox

  // ---- small SVG helpers ----------------------------------------------------
  function el(name, attrs, tip) {
    const e = document.createElementNS(SVG_NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (tip) {
      e.setAttribute('data-tip', tip);
      e.style.cursor = 'help';
      const t = document.createElementNS(SVG_NS, 'title'); // native fallback
      t.textContent = tip;
      e.appendChild(t);
    }
    return e;
  }
  function group() { return document.createElementNS(SVG_NS, 'g'); }

  function box(g, x, y, w, h, fill, stroke, label, tip, textColor) {
    const r = el('rect', { x, y, width: w, height: h, rx: 5, fill,
      stroke: stroke || '#455a64', 'stroke-width': 1.5 }, tip);
    g.appendChild(r);
    if (label) {
      const t = el('text', { x: x + w / 2, y: y + h / 2 + 4,
        'text-anchor': 'middle', 'font-size': 12, fill: textColor || '#263238',
        'font-weight': 600 });
      t.textContent = label;
      g.appendChild(t);
    }
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  }

  function arrow(g, x1, y1, x2, y2, color) {
    const c = color || '#607d8b';
    g.appendChild(el('line', { x1, y1, x2, y2, stroke: c, 'stroke-width': 1.5,
      'marker-end': 'url(#arrow)' }));
  }

  function xor(g, x, y, tip) {
    const r = 9;
    g.appendChild(el('circle', { cx: x, cy: y, r, fill: '#fff',
      stroke: '#455a64', 'stroke-width': 1.5 }, tip || 'XOR (exclusive OR)'));
    g.appendChild(el('line', { x1: x - 5, y1: y, x2: x + 5, y2: y, stroke: '#455a64', 'stroke-width': 1.3 }));
    g.appendChild(el('line', { x1: x, y1: y - 5, x2: x, y2: y + 5, stroke: '#455a64', 'stroke-width': 1.3 }));
    return { x, y, r };
  }

  function label(g, x, y, txt, size, color, anchor) {
    const t = el('text', { x, y, 'text-anchor': anchor || 'middle',
      'font-size': size || 11, fill: color || '#455a64' });
    t.textContent = txt;
    g.appendChild(t);
  }

  function newSvg() {
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`,
      preserveAspectRatio: 'xMidYMid meet', role: 'img' });
    const defs = document.createElementNS(SVG_NS, 'defs');
    const m = el('marker', { id: 'arrow', viewBox: '0 0 10 10', refX: 8, refY: 5,
      markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' });
    m.appendChild(el('path', { d: 'M0,0 L10,5 L0,10 z', fill: '#607d8b' }));
    defs.appendChild(m);
    svg.appendChild(defs);
    return svg;
  }

  // ---- tile builders --------------------------------------------------------
  const PT = '#e3f2fd', CT = '#eceff1', AES = '#1565c0', RED = '#e53935';
  const KEY = '#fff3cd';

  function ecb() {
    const svg = newSvg();
    const g = group(); svg.appendChild(g);
    const cols = [22, 112, 202, 292];
    const ptFill = [PT, '#ffcdd2', PT, '#ffcdd2']; // blocks 2 & 4 identical -> red
    const ptStroke = ['#455a64', RED, '#455a64', RED];
    for (let i = 0; i < 4; i++) {
      const x = cols[i];
      const pTip = (i === 1 || i === 3)
        ? 'Identical plaintext block — note blocks 2 and 4 carry the same value.'
        : 'Plaintext block ' + (i + 1);
      box(g, x, 16, 66, 30, ptFill[i], ptStroke[i], 'P' + (i + 1), pTip);
      box(g, x, 96, 66, 34, AES, '#0d47a1', 'AES', 'AES Encrypt under the SAME key — each block handled independently.', '#fff');
      box(g, x, 188, 66, 30, (i === 1 || i === 3) ? '#ffcdd2' : CT, ptStroke[i], 'C' + (i + 1),
        (i === 1 || i === 3) ? 'Identical ciphertext — equal inputs map to equal outputs. The leak.' : 'Ciphertext block ' + (i + 1));
      arrow(g, x + 33, 46, x + 33, 96);
      arrow(g, x + 33, 130, x + 33, 188);
    }
    label(g, W / 2, 160, 'same key for every block', 10, '#90a4ae');
    return svg;
  }

  function cbc() {
    const svg = newSvg();
    const g = group(); svg.appendChild(g);
    const cols = [70, 160, 250];
    box(g, 14, 96, 44, 34, KEY, '#c9a227', 'IV', 'Initialization Vector — must be UNPREDICTABLE (random) for CBC.');
    for (let i = 0; i < 3; i++) {
      const x = cols[i];
      box(g, x, 16, 60, 28, PT, '#455a64', 'P' + (i + 1), 'Plaintext block ' + (i + 1));
      const xpt = xor(g, x + 30, 70, 'XOR with the previous ciphertext (or the IV for block 1) before encryption.');
      box(g, x, 100, 60, 32, AES, '#0d47a1', 'AES', 'AES Encrypt under the key.', '#fff');
      box(g, x, 196, 60, 28, CT, '#455a64', 'C' + (i + 1), 'Ciphertext block ' + (i + 1));
      arrow(g, x + 30, 44, x + 30, 61);
      arrow(g, x + 30, 79, x + 30, 100);
      arrow(g, x + 30, 132, x + 30, 196);
      if (i === 0) arrow(g, 58, 113, x + 20, 70); // IV feeds first XOR
      // chain previous ciphertext into next XOR
      if (i > 0) arrow(g, cols[i - 1] + 30, 210, x + 30, 78, '#1565c0');
    }
    label(g, W / 2, 244, 'each ciphertext feeds the next block (sequential)', 10, '#607d8b');
    return svg;
  }

  function ctr() {
    const svg = newSvg();
    const g = group(); svg.appendChild(g);
    const cols = [40, 160, 280];
    const ctrLbl = ['nonce', 'nonce+1', 'nonce+2'];
    for (let i = 0; i < 3; i++) {
      const x = cols[i];
      box(g, x, 16, 70, 28, KEY, '#c9a227', ctrLbl[i], 'Counter input — the nonce must be UNIQUE per message (never reused with a key).');
      box(g, x, 70, 70, 32, AES, '#0d47a1', 'AES', 'AES encrypts the counter to produce a keystream block.', '#fff');
      box(g, x, 124, 70, 24, '#f1f8e9', '#7cb342', 'keystream', 'Keystream block = AES(counter). Independent of the plaintext.');
      const xx = xor(g, x + 35, 182, 'Plaintext XOR keystream = ciphertext. No padding needed.');
      box(g, x, 208, 70, 26, CT, '#455a64', 'C' + (i + 1), 'Ciphertext block ' + (i + 1));
      box(g, x - 30, 171, 24, 22, PT, '#455a64', 'P', 'Plaintext block ' + (i + 1));
      arrow(g, x + 35, 44, x + 35, 70);
      arrow(g, x + 35, 102, x + 35, 124);
      arrow(g, x + 35, 148, x + 35, 173);
      arrow(g, x - 4, 182, x + 26, 182); // plaintext into xor
      arrow(g, x + 35, 191, x + 35, 208);
    }
    label(g, W / 2, 244, 'counters are independent → fully parallelizable', 10, '#607d8b');
    return svg;
  }

  function gcm() {
    const svg = newSvg();
    const g = group(); svg.appendChild(g);
    const cols = [30, 140, 250];
    for (let i = 0; i < 3; i++) {
      const x = cols[i];
      box(g, x, 14, 64, 24, KEY, '#c9a227', 'ctr+' + i, 'Counter input (CTR core, identical to CTR mode).');
      box(g, x, 56, 64, 28, AES, '#0d47a1', 'AES', 'AES encrypts the counter to a keystream block.', '#fff');
      const xx = xor(g, x + 32, 116, 'Plaintext XOR keystream = ciphertext.');
      box(g, x, 138, 64, 24, CT, '#455a64', 'C' + (i + 1), 'Ciphertext block ' + (i + 1));
      box(g, x, 178, 64, 26, '#e8f5e9', '#4caf50', 'GHASH', 'GHASH accumulates over every ciphertext block to build the auth tag.');
      arrow(g, x + 32, 38, x + 32, 56);
      arrow(g, x + 32, 84, x + 32, 107);
      arrow(g, x + 32, 125, x + 32, 138);
      arrow(g, x + 32, 162, x + 32, 178);
      if (i > 0) arrow(g, cols[i - 1] + 56, 191, x + 8, 191, '#4caf50'); // ghash chain
    }
    box(g, 240, 214, 110, 26, '#c8e6c9', '#2e7d32', '128-bit Tag', 'Authentication tag — lets the receiver detect any tampering (integrity + authenticity).');
    arrow(g, 282, 204, 295, 214, '#2e7d32');
    label(g, 110, 230, 'encrypt + authenticate (AEAD)', 11, '#2e7d32');
    return svg;
  }

  // ---- tile metadata --------------------------------------------------------
  const tiles = [
    { cls: 'ecb', title: 'ECB — Electronic Codebook', badge: 'AVOID', badgeCls: 'avoid',
      cap: 'Identical plaintext → identical ciphertext. Pattern leaks. AVOID.', build: ecb },
    { cls: '',    title: 'CBC — Cipher Block Chaining', badge: 'use with care', badgeCls: 'neutral',
      cap: 'Chained. IV must be unpredictable. Sequential (cannot parallelize encryption).', build: cbc },
    { cls: '',    title: 'CTR — Counter', badge: 'use with care', badgeCls: 'neutral',
      cap: 'Parallelizable. Nonce must be unique. No padding needed.', build: ctr },
    { cls: 'gcm', title: 'GCM — Galois/Counter', badge: 'RECOMMENDED', badgeCls: 'ok',
      cap: 'AEAD: encrypts AND authenticates. Modern default.', build: gcm },
  ];

  function buildGrid() {
    const grid = document.getElementById('grid');
    if (!grid) return;
    tiles.forEach(t => {
      const div = document.createElement('div');
      div.className = 'tile ' + t.cls;
      const h = document.createElement('h2');
      h.innerHTML = t.title + ' <span class="badge ' + t.badgeCls + '">' + t.badge + '</span>';
      div.appendChild(h);
      div.appendChild(t.build());
      const cap = document.createElement('p');
      cap.className = 'cap';
      cap.textContent = t.cap;
      div.appendChild(cap);
      grid.appendChild(div);
    });
  }

  // ---- tooltip wiring (custom div, also keeps native <title>) ---------------
  function wireTooltips() {
    const tip = document.getElementById('tip');
    function show(e) {
      const target = e.target.closest('[data-tip]');
      if (!target) { hide(); return; }
      tip.textContent = target.getAttribute('data-tip');
      tip.style.opacity = '1';
      move(e);
    }
    function move(e) {
      const x = (e.touches ? e.touches[0].clientX : e.clientX) + 14;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) + 14;
      tip.style.left = Math.min(x, window.innerWidth - 270) + 'px';
      tip.style.top = y + 'px';
    }
    function hide() { tip.style.opacity = '0'; }
    document.addEventListener('mousemove', show);
    document.addEventListener('mouseleave', hide);
    // touch support: tap to reveal
    document.addEventListener('touchstart', show, { passive: true });
  }

  function init() { buildGrid(); wireTooltips(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
