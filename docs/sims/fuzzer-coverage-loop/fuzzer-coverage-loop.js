// Coverage-Guided Fuzzer Loop
// CANVAS_HEIGHT: 590
// Bloom: Analyze. Compare coverage-guided vs. random fuzzing and explain why
// coverage guidance reaches deep code paths (where the bug lives) far faster.

let canvasWidth = 720;
let drawHeight = 470;
let controlHeight = 120;
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 16;

const BLUE = '#1565c0';
const SLATE = '#455a64';
const CREAM = '#fff8e1';
const ALERT = '#ffa000';
const GRAY = '#c7cdd1';

// Control-flow graph: tree of basic blocks. depth gates how "rare" a path is.
// A few deep blocks are amber (the bug lives at the deepest one).
let blocks = [];   // {x, y (relative 0..1), depth, parent, covered, isBug, isRare}
let edges = [];

let mutationSlider, rateSlider, coverageCheckbox, resetBtn;
let corpus = [];   // {len, gainedCoverage}
let tick = 0;
let accumulator = 0;
let lastMillis = 0;
let token = null;  // animated token traversing blocks: {path:[idx...], i, t}
let crashed = false;
let crashTimer = 0;
let mouseOverCanvas = false;

function buildGraph() {
  blocks = [];
  edges = [];
  // Root
  blocks.push({ rx: 0.5, ry: 0.06, depth: 0, parent: -1, covered: true, isBug: false });
  // Build a branching tree, ~25 blocks, increasing depth, a rare deep chain.
  // Level 1
  addBlock(0.28, 0.20, 1, 0);
  addBlock(0.72, 0.20, 1, 0);
  // Level 2
  addBlock(0.16, 0.36, 2, 1);
  addBlock(0.40, 0.36, 2, 1);
  addBlock(0.60, 0.36, 2, 2);
  addBlock(0.86, 0.36, 2, 2);
  // Level 3
  addBlock(0.10, 0.52, 3, 3);
  addBlock(0.24, 0.52, 3, 3);
  addBlock(0.36, 0.52, 3, 4);
  addBlock(0.48, 0.52, 3, 4);
  addBlock(0.58, 0.52, 3, 5);
  addBlock(0.70, 0.52, 3, 6);
  addBlock(0.90, 0.52, 3, 6);
  // Level 4
  addBlock(0.20, 0.68, 4, 8);
  addBlock(0.34, 0.68, 4, 9);
  addBlock(0.46, 0.68, 4, 10);
  addBlock(0.56, 0.68, 4, 11, false, true);   // rare guarded path
  addBlock(0.72, 0.68, 4, 12);
  addBlock(0.88, 0.68, 4, 13);
  // Level 5 (deep)
  addBlock(0.34, 0.84, 5, 15);
  addBlock(0.50, 0.84, 5, 17, false, true);    // rare
  addBlock(0.66, 0.84, 5, 18);
  addBlock(0.82, 0.84, 5, 19);
  // Level 6 — the bug
  addBlock(0.50, 0.95, 6, 21, true, true);      // BUG block (amber, deepest, rare)
  for (let i = 0; i < blocks.length; i++) {
    const p = blocks[i].parent;
    if (p >= 0) edges.push([p, i]);
  }
}

function addBlock(rx, ry, depth, parent, isBug = false, isRare = false) {
  blocks.push({ rx, ry, depth, parent, covered: false, isBug, isRare });
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);
  textFont('Arial');

  mutationSlider = createSlider(1, 10, 5, 1);
  mutationSlider.parent(document.querySelector('main'));
  rateSlider = createSlider(1, 50, 12, 1);
  rateSlider.parent(document.querySelector('main'));
  coverageCheckbox = createCheckbox(' Coverage-guided', true);
  coverageCheckbox.parent(document.querySelector('main'));
  coverageCheckbox.changed(resetSim);
  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(resetSim);

  positionControls();
  buildGraph();
  resetSim();
  lastMillis = millis();
  describe('A coverage-guided fuzzer simulation. The left panel is a control-flow graph of basic blocks that light up blue as inputs reach them; a deep amber block is the bug. The right panel is the input corpus, where inputs that increased coverage are highlighted. A coverage gauge at the top tracks the percentage of blocks reached. Toggle the Coverage-guided checkbox off to compare against pure random fuzzing, which rarely reaches the deep bug block.', LABEL);
}

function positionControls() {
  const y1 = drawHeight + 8;
  const y2 = drawHeight + 43;
  const y3 = drawHeight + 80;
  const leftMargin = 215;
  mutationSlider.position(leftMargin, y1 + 2);
  mutationSlider.size(max(120, canvasWidth - leftMargin - margin));
  rateSlider.position(leftMargin, y2 + 2);
  rateSlider.size(max(120, canvasWidth - leftMargin - margin));
  coverageCheckbox.position(12, y3);
  coverageCheckbox.style('font-size', '14px');
  resetBtn.position(200, y3 - 2);
}

function resetSim() {
  for (const b of blocks) b.covered = (b.depth === 0);
  corpus = [{ len: 24, gainedCoverage: true }];  // seed input
  tick = 0;
  accumulator = 0;
  token = null;
  crashed = false;
  crashTimer = 0;
}

function coverageFraction() {
  let c = 0;
  for (const b of blocks) if (b.covered) c++;
  return c / blocks.length;
}

function draw() {
  updateCanvasSize();

  // backgrounds
  noStroke();
  fill(CREAM);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver'); noFill();
  rect(0, 0, canvasWidth, drawHeight);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title
  noStroke(); fill('black');
  textSize(20); textAlign(CENTER, TOP);
  text('Coverage-Guided Fuzzer Loop', canvasWidth / 2, 6);

  drawCoverageGauge(margin, 34, canvasWidth - margin * 2, 26);

  const panelTop = 70;
  const panelH = drawHeight - panelTop - 28;
  const gap = 14;
  const leftW = (canvasWidth - margin * 2 - gap) * 0.62;
  const rightW = (canvasWidth - margin * 2 - gap) * 0.38;
  drawCFG(margin, panelTop, leftW, panelH);
  drawCorpus(margin + leftW + gap, panelTop, rightW, panelH);

  // step simulation by rate (inputs per second)
  if (mouseOverCanvas && !crashed) {
    const now = millis();
    const dt = (now - lastMillis) / 1000;
    lastMillis = now;
    accumulator += dt * rateSlider.value();
    while (accumulator >= 1) {
      accumulator -= 1;
      fuzzOneInput();
    }
  } else {
    lastMillis = millis();
  }

  drawToken(margin, panelTop, leftW, panelH);

  if (crashed) drawCrash();

  drawControlLabels();
  drawHint();
}

function blockScreen(idx, x0, y0, w, h) {
  const b = blocks[idx];
  return { x: x0 + b.rx * w, y: y0 + b.ry * h };
}

// Coverage-guided fuzzing: pick a parent input, mutate, and try to extend
// coverage. With guidance, bias toward inputs that previously gained coverage
// and let deeper blocks become reachable as their parents get covered. Random
// mode picks a shallow target and almost never reaches deep/rare blocks.
function fuzzOneInput() {
  tick++;
  const guided = coverageCheckbox.checked();
  const aggression = mutationSlider.value() / 10; // 0.1..1.0

  // Candidate uncovered blocks whose parent is already covered (reachable next).
  let frontier = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (!b.covered && (b.parent < 0 || blocks[b.parent].covered)) frontier.push(i);
  }
  if (frontier.length === 0) return;

  // probability of reaching a frontier block this input
  let chosen = -1;
  if (guided) {
    // guidance: prefer extending coverage; rare blocks still hard but reachable,
    // scaled by mutation aggressiveness.
    for (const i of frontier) {
      const b = blocks[i];
      const base = b.isRare ? 0.05 : 0.45;
      const p = base * (0.4 + 0.6 * aggression);
      if (random() < p) { chosen = i; break; }
    }
  } else {
    // random: only shallow blocks get hit with any regularity; deep/rare ~never
    const i = frontier[floor(random(frontier.length))];
    const b = blocks[i];
    const depthPenalty = pow(0.45, b.depth);          // deeper => far less likely
    const rarePenalty = b.isRare ? 0.05 : 1.0;
    const p = 0.5 * depthPenalty * rarePenalty * (0.5 + 0.5 * aggression);
    if (random() < p) chosen = i;
  }

  const gained = chosen >= 0;
  if (gained) {
    blocks[chosen].covered = true;
    // animate a token along the path root -> chosen
    token = { path: pathTo(chosen), i: 0, t: 0 };
    if (blocks[chosen].isBug) { crashed = true; crashTimer = 0; }
  }
  // record the input in the corpus (cap visible entries)
  corpus.push({ len: floor(random(8, 40)), gainedCoverage: gained });
  if (corpus.length > 60) corpus.shift();
}

function pathTo(idx) {
  const path = [];
  let cur = idx;
  while (cur >= 0) { path.unshift(cur); cur = blocks[cur].parent; }
  return path;
}

function drawCoverageGauge(x, y, w, h) {
  const frac = coverageFraction();
  noStroke();
  fill('rgba(69,90,100,0.15)');
  rect(x, y, w, h, 8);
  fill(BLUE);
  rect(x, y, w * frac, h, 8);
  fill('black');
  textAlign(LEFT, CENTER); textSize(14); textStyle(BOLD);
  text('Code coverage: ' + Math.round(frac * 100) + '%  (' +
       blocks.filter(b => b.covered).length + ' / ' + blocks.length + ' blocks)',
       x + 8, y + h / 2);
  textStyle(NORMAL);
}

function drawCFG(x0, y0, w, h) {
  // panel
  noStroke(); fill('rgba(255,255,255,0.5)');
  rect(x0, y0, w, h, 8);
  noStroke(); fill(SLATE); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD);
  text('Target control-flow graph', x0 + 6, y0 + 4);
  textStyle(NORMAL);

  const gy = y0 + 20, gh = h - 26;
  // edges
  stroke(GRAY); strokeWeight(1.5);
  for (const [a, b] of edges) {
    const pa = blockScreen(a, x0, gy, w, gh);
    const pb = blockScreen(b, x0, gy, w, gh);
    const covEdge = blocks[a].covered && blocks[b].covered;
    stroke(covEdge ? BLUE : GRAY);
    strokeWeight(covEdge ? 2 : 1.2);
    line(pa.x, pa.y, pb.x, pb.y);
  }
  // nodes
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const p = blockScreen(i, x0, gy, w, gh);
    const r = b.isBug ? 9 : 7;
    noStroke();
    if (b.isBug) {
      fill(b.covered ? '#d84315' : ALERT);
    } else {
      fill(b.covered ? BLUE : GRAY);
    }
    circle(p.x, p.y, r * 2);
    if (b.isBug) {
      stroke(b.covered ? '#d84315' : ALERT); strokeWeight(1.5); noFill();
      circle(p.x, p.y, r * 2 + 6);
    }
  }
  // legend
  noStroke(); textSize(10.5); textAlign(LEFT, CENTER);
  fill(GRAY); circle(x0 + 10, y0 + h - 10, 9); fill(SLATE); text('uncovered', x0 + 18, y0 + h - 10);
  fill(BLUE); circle(x0 + 92, y0 + h - 10, 9); fill(SLATE); text('covered', x0 + 100, y0 + h - 10);
  fill(ALERT); circle(x0 + 165, y0 + h - 10, 9); fill(SLATE); text('rare path / bug', x0 + 173, y0 + h - 10);
}

function drawToken(x0, y0, w, h) {
  if (!token) return;
  const gy = y0 + 20, gh = h - 26;
  if (token.i >= token.path.length - 1) { token = null; return; }
  const a = blockScreen(token.path[token.i], x0, gy, w, gh);
  const b = blockScreen(token.path[token.i + 1], x0, gy, w, gh);
  const px = lerp(a.x, b.x, token.t);
  const py = lerp(a.y, b.y, token.t);
  noStroke(); fill('#ffb300');
  circle(px, py, 9);
  if (mouseOverCanvas) {
    token.t += 0.18;
    if (token.t >= 1) { token.t = 0; token.i++; }
  }
}

function drawCorpus(x0, y0, w, h) {
  noStroke(); fill('rgba(255,255,255,0.5)');
  rect(x0, y0, w, h, 8);
  fill(SLATE); textAlign(LEFT, TOP); textSize(12); textStyle(BOLD);
  text('Input corpus', x0 + 6, y0 + 4);
  textStyle(NORMAL);
  fill('#6c757d'); textSize(10);
  text(corpus.length + ' inputs tried', x0 + 6, y0 + 19);

  // draw the most recent inputs as horizontal bars stacking from the top
  const top = y0 + 34;
  const barH = 7, barGap = 3;
  const maxBars = floor((h - 44) / (barH + barGap));
  const visible = corpus.slice(max(0, corpus.length - maxBars));
  for (let i = 0; i < visible.length; i++) {
    const it = visible[i];
    const by = top + i * (barH + barGap);
    const bw = map(it.len, 8, 40, 12, w - 16);
    noStroke();
    fill(it.gainedCoverage ? BLUE : GRAY);
    rect(x0 + 8, by, bw, barH, 3);
  }
}

function drawCrash() {
  crashTimer += 1;
  const cx = canvasWidth / 2, cy = drawHeight / 2;
  push();
  textAlign(CENTER, CENTER);
  const pulse = 1 + 0.08 * sin(crashTimer * 0.3);
  noStroke();
  fill(216, 67, 21, 230);
  const w = 230 * pulse, hh = 70 * pulse;
  rect(cx - w / 2, cy - hh / 2, w, hh, 10);
  fill('white'); textSize(26); textStyle(BOLD);
  text('CRASH!', cx, cy - 8);
  textSize(12); textStyle(NORMAL);
  text('Fuzzer reached the deep bug block', cx, cy + 16);
  pop();
}

function drawControlLabels() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(14);
  text('Mutation aggressiveness: ' + mutationSlider.value(), 12, drawHeight + 17);
  text('Inputs per second: ' + rateSlider.value(), 12, drawHeight + 52);
}

function drawHint() {
  noStroke(); fill('#6c757d'); textSize(11); textAlign(RIGHT, CENTER);
  const mode = coverageCheckbox.checked() ? 'Coverage-guided: corpus keeps inputs that reach new blocks.'
                                          : 'Random mode: deep/rare blocks are almost never reached.';
  text(mode, canvasWidth - 12, drawHeight + 98);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
  if (typeof mutationSlider !== 'undefined' && mutationSlider) positionControls();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}
