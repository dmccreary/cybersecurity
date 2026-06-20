// CANVAS_HEIGHT: 560
// The Three Layers of Software Assurance (p5.js infographic)
// Bloom: Understand. Three concentric layers — In-Code Defenses (inner),
// Analysis Tooling (middle ring), Supply Chain (outer ring) — compose to defend
// a software system. Hovering a chip shows its one-line definition; hovering a
// ring updates the "what this layer protects against" caption at the top. A
// checkbox pins every definition at once. Hover-reveal interaction (no animation)
// is the right fit for an Understand-level objective.

let canvasWidth = 720;
let drawHeight = 500;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 16;

// brand palette
const C_BLUE = '#1565c0';    // In-Code Defenses
const C_SLATE = '#455a64';   // Analysis Tooling
const C_AMBER = '#ffa000';   // Supply Chain
const C_CREAM = '#fff8e1';

let showDefs;        // checkbox: pin all definitions
let cx, cy;          // center of the concentric circles
let rInner, rMid, rOuter;

// Each layer: ring radius band [innerR, outerR], color, label, caption, chips.
// Chips are positioned at angles around the layer's mid-radius.
const layers = [
  {
    key: 'inner', label: 'In-Code Defenses', color: C_BLUE, textOnDark: true,
    caption: 'In-code defenses stop injection and abuse at the trust boundary, in the program itself.',
    chips: [
      { t: 'Input Validation', def: 'Reject or constrain untrusted input before it is used.' },
      { t: 'Output Encoding', def: 'Encode data for the context it lands in (HTML, SQL, shell) so it cannot break out.' },
      { t: 'Parameterized Queries', def: 'Send SQL structure and data separately so input is never executed as code.' }
    ]
  },
  {
    key: 'mid', label: 'Analysis Tooling', color: C_SLATE, textOnDark: true,
    caption: 'Analysis tooling finds the defects the developer missed, before and after the code runs.',
    chips: [
      { t: 'Static Analysis (SAST)', def: 'Scans source code for vulnerable patterns without running it.' },
      { t: 'Dynamic Analysis (DAST)', def: 'Tests the running application from the outside, like an attacker.' },
      { t: 'Fuzzing', def: 'Feeds malformed and random input to crash or trip the program into revealing bugs.' }
    ]
  },
  {
    key: 'outer', label: 'Supply Chain', color: C_AMBER, textOnDark: false,
    caption: 'Supply-chain controls defend the code you did not write — dependencies and the build.',
    chips: [
      { t: 'SCA / Dependency Scanning', def: 'Checks third-party dependencies against known-vulnerability databases.' },
      { t: 'SBOM', def: 'A Software Bill of Materials: the full inventory of components you ship.' },
      { t: 'Code Signing', def: 'Cryptographically proves an artifact came from you and was not tampered with.' },
      { t: 'Secure Build', def: 'A hardened, reproducible pipeline so the build itself cannot be subverted.' }
    ]
  }
];

let chipBoxes = [];   // computed each frame for hit-testing
let hoverChip = null;
let hoverLayer = null;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  const m = document.querySelector('main');

  showDefs = createCheckbox(' Pin all definitions', false);
  showDefs.parent(m);
  showDefs.style('font-size', '14px');
  showDefs.style('color', '#263238');

  textFont('Arial');
  layout();
  describe('A concentric-circle infographic of the three layers of software assurance: ' +
    'In-Code Defenses at the center, Analysis Tooling in the middle ring, and Supply ' +
    'Chain controls in the outer ring. Hover any chip for its definition.', LABEL);
}

function layout() {
  cx = canvasWidth / 2;
  cy = drawHeight / 2 + 30;
  const maxR = min(canvasWidth, drawHeight - 44) / 2 - 6;
  rOuter = maxR;
  rMid = maxR * 0.74;
  rInner = maxR * 0.46;
  if (showDefs) showDefs.position(margin, drawHeight + 18);
}

function draw() {
  background(C_CREAM);

  // title
  noStroke();
  fill('#0d47a1');
  textSize(20);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  text('The Three Layers of Software Assurance', canvasWidth / 2, 8);
  textStyle(NORMAL);

  // determine hover (chip first, then ring) unless pinned
  hoverChip = null;
  hoverLayer = null;
  const pinned = showDefs.checked();

  // draw rings outer -> inner so inner sits on top
  drawRing(rOuter, layers[2]);
  drawRing(rMid, layers[1]);
  drawDisc(rInner, layers[0]);

  // ring band labels (place each layer's label on its band)
  drawLayerLabels();

  // chips
  chipBoxes = [];
  computeChips();
  // hit-test chips
  if (!pinned) {
    for (const cb of chipBoxes) {
      if (mouseX >= cb.x && mouseX <= cb.x + cb.w && mouseY >= cb.y && mouseY <= cb.y + cb.h) {
        hoverChip = cb; break;
      }
    }
    // ring hover if no chip
    if (!hoverChip) hoverLayer = layerAt(mouseX, mouseY);
  }
  drawChips(pinned);

  // caption box (top, under title)
  drawCaption(pinned);

  // tooltip for hovered chip
  if (hoverChip && !pinned) drawTooltip(hoverChip);

  // control region background
  noStroke();
  fill('#ffffff');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('#cfd8dc'); strokeWeight(1);
  line(0, drawHeight, canvasWidth, drawHeight);
  noStroke();
  fill('#455a64');
  textSize(13);
  textAlign(LEFT, CENTER);
  text('Hover a chip for its definition; hover a ring for what it protects against.',
       margin + 170, drawHeight + controlHeight / 2);
}

function drawRing(r, layer) {
  noStroke();
  fill(layer.color);
  ellipse(cx, cy, r * 2, r * 2);
}
function drawDisc(r, layer) {
  noStroke();
  fill(layer.color);
  ellipse(cx, cy, r * 2, r * 2);
}

function drawLayerLabels() {
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  // inner label near the top of the inner disc
  fill('#ffffff'); textSize(15);
  text('In-Code', cx, cy - rInner * 0.50);
  text('Defenses', cx, cy - rInner * 0.50 + 16);
  // mid ring label centered on the TOP band of the mid ring
  fill('#ffffff'); textSize(14);
  text('Analysis Tooling', cx, cy - (rInner + rMid) / 2);
  // outer ring label centered on the TOP band of the outer ring (kept inside the band)
  fill('#3a2a00'); textSize(14);
  text('Supply Chain', cx, cy - (rMid + rOuter) / 2);
  textStyle(NORMAL);
}

// place chips around each layer. Layer labels sit on the TOP arc, so chips go on
// the lower/side arcs to avoid colliding with them.
function computeChips() {
  // inner chips: stack vertically in the lower portion of the inner disc
  const inner = layers[0];
  const n0 = inner.chips.length;
  const startY = cy + 6;
  for (let i = 0; i < n0; i++) {
    pushChip(inner, inner.chips[i], cx, startY + i * 22);
  }
  // mid ring chips on the lower/side arc (top band reserved for the ring label)
  placeArc(layers[1], (rInner + rMid) / 2, 200, 340);
  // outer ring chips spread across the bottom and sides (avoid the top label)
  placeArc(layers[2], (rMid + rOuter) / 2, 130, 410);
}

// place n chips evenly between startA and endA degrees on a circle of radius r
function placeArc(layer, r, startA, endA) {
  const n = layer.chips.length;
  for (let i = 0; i < n; i++) {
    const a = startA + (endA - startA) * (n === 1 ? 0.5 : i / (n - 1));
    const rad = radians(a);
    const x = cx + cos(rad) * r;
    const y = cy + sin(rad) * r;
    pushChip(layer, layer.chips[i], x, y);
  }
}

function pushChip(layer, chip, x, y) {
  textSize(11.5);
  const w = textWidth(chip.t) + 16;
  const h = 22;
  chipBoxes.push({ layer, chip, x: x - w / 2, y: y - h / 2, w, h });
}

function drawChips(pinned) {
  textAlign(CENTER, CENTER);
  textSize(11.5);
  for (const cb of chipBoxes) {
    const active = (cb === hoverChip) || pinned;
    stroke('#ffffff'); strokeWeight(1.2);
    fill(active ? '#ffffff' : 'rgba(255,255,255,0.85)');
    rect(cb.x, cb.y, cb.w, cb.h, 11);
    noStroke();
    fill('#0d2c54');
    text(cb.chip.t, cb.x + cb.w / 2, cb.y + cb.h / 2 + 0.5);
  }
}

function layerAt(mx, my) {
  const d = dist(mx, my, cx, cy);
  if (d <= rInner) return layers[0];
  if (d <= rMid) return layers[1];
  if (d <= rOuter) return layers[2];
  return null;
}

function drawCaption(pinned) {
  let msg;
  if (pinned) {
    msg = 'All definitions pinned. Each layer composes with the others; remove the pin to explore by hover.';
  } else if (hoverChip) {
    msg = hoverChip.layer.label + ': ' + hoverChip.chip.def;
  } else if (hoverLayer) {
    msg = hoverLayer.caption;
  } else {
    msg = 'Hover a ring to see what that layer protects against.';
  }
  const bx = margin, by = 34, bw = canvasWidth - margin * 2, bh = 34;
  noStroke();
  fill('rgba(255,255,255,0.92)');
  rect(bx, by, bw, bh, 8);
  stroke('#90a4ae'); strokeWeight(1); noFill();
  rect(bx, by, bw, bh, 8);
  noStroke();
  fill('#263238');
  textSize(13.5);
  textAlign(CENTER, CENTER);
  text(msg, bx + bw / 2, by + bh / 2);
}

function drawTooltip(cb) {
  const pad = 8;
  textSize(12.5);
  const full = cb.chip.def;
  const maxW = 240;
  const lines = wrapText(full, maxW);
  const tw = maxW + pad * 2;
  const th = lines.length * 16 + pad * 2;
  let tx = cb.x + cb.w / 2 - tw / 2;
  let ty = cb.y - th - 6;
  tx = constrain(tx, 4, canvasWidth - tw - 4);
  if (ty < 70) ty = cb.y + cb.h + 6;
  noStroke();
  fill('#263238');
  rect(tx, ty, tw, th, 6);
  fill('#ffffff');
  textAlign(LEFT, TOP);
  for (let i = 0; i < lines.length; i++) text(lines[i], tx + pad, ty + pad + i * 16);
}

function wrapText(s, maxW) {
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (textWidth(test) > maxW && cur) { lines.push(cur); cur = w; }
    else cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  layout();
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
    if (canvasWidth < 360) canvasWidth = 360;
    if (canvasWidth > 760) canvasWidth = 760;
  }
}
