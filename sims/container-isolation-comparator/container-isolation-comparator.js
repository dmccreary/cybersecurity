// CANVAS_HEIGHT: 550
// Container Isolation Strength Comparator — p5.js MicroSim (Bloom: Evaluate).
// Given a workload (fully trusted, semi-trusted, hostile multi-tenant),
// learners choose an isolation level, run five threat scenarios against it,
// and evaluate whether that level is appropriate for the workload.
//
// The isolation-level -> threat-mitigation matrix, the workload requirements,
// and every rationale live in data.json, so instructors can add scenarios
// without editing this sketch.

let canvasWidth = 800;
let drawHeight = 470;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;
const MIN_TEXT_SIZE = 11;

// --- book palette ---
const HEADER_BLUE = '#1565c0';
const BLOCKED_GREEN = '#4caf50';
const CAVEATS_AMBER = '#ffa000';
const FEASIBLE_RED = '#d32f2f';
const SLATE = '#455a64';
const PENDING_GRAY = '#9e9e9e';

const STATUS_STYLE = {
  blocked:  { fill: BLOCKED_GREEN, text: 'black' },
  caveats:  { fill: CAVEATS_AMBER, text: 'black' },
  feasible: { fill: FEASIBLE_RED,  text: 'white' }
};

// controls
let isolationSelect, workloadSelect, runButton, resetButton;
let narrowControls = null;
const selectLeft = 130;       // x of both dropdowns, right of their labels

// state
let simData = null;           // contents of data.json
let loadError = null;
let pending = false;          // true until the threat suite is run
let selectedRow = -1;         // threat row pinned by a click or tap
let rowBoxes = [];            // hit boxes of the threat rows, set in draw()

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  const mainElement = document.querySelector('main');

  isolationSelect = createSelect();
  isolationSelect.parent(mainElement);
  isolationSelect.position(selectLeft, drawHeight + 9);
  isolationSelect.changed(scenarioChanged);

  workloadSelect = createSelect();
  workloadSelect.parent(mainElement);
  workloadSelect.position(selectLeft, drawHeight + 45);
  workloadSelect.changed(scenarioChanged);

  runButton = createButton('Run threat suite');
  runButton.parent(mainElement);
  runButton.mousePressed(runThreatSuite);

  resetButton = createButton('Reset');
  resetButton.parent(mainElement);
  resetButton.mousePressed(resetScenario);

  layoutControls();

  // Load the matrix after setup so the page still renders (with a clear
  // message) if data.json cannot be fetched.
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      simData = data;
      data.isolationLevels.forEach(level => isolationSelect.option(level.label, level.id));
      data.workloads.forEach(w => workloadSelect.option(w.label, w.id));
      resetScenario();
    })
    .catch(err => { loadError = String(err); });

  describe('A list of five container threat scenarios, each with a badge ' +
    'showing whether the chosen isolation level blocks it, mitigates it with ' +
    'caveats, or leaves it feasible, beside a verdict on whether that ' +
    'isolation level suits the chosen workload.', LABEL);
}

// ---------- scenario handling ----------

// Changing either dropdown clears the badges so the learner judges first.
function scenarioChanged() {
  pending = true;
  selectedRow = -1;
}

function runThreatSuite() {
  if (simData) pending = false;
}

function resetScenario() {
  if (!simData) return;
  isolationSelect.selected(simData.defaults.isolation);
  workloadSelect.selected(simData.defaults.workload);
  selectedRow = -1;
  pending = false;      // the default scenario starts evaluated
}

function currentLevel() {
  return simData.isolationLevels.find(level => level.id === isolationSelect.value());
}

function currentWorkload() {
  return simData.workloads.find(w => w.id === workloadSelect.value());
}

function rank(status) {
  return simData.statuses[status].rank;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function listPhrase(items) {
  if (items.length <= 1) return items.join('');
  return items.slice(0, -1).join(', ') + ' and ' + items[items.length - 1];
}

// Compare the level's threat results with what the workload requires.
function computeVerdict(level, workload) {
  const meetsNeeds = candidate => simData.threats.every(t =>
    rank(candidate.threats[t.id].status) >= rank(workload.requires[t.id]));
  const shortfalls = simData.threats.filter(t =>
    rank(level.threats[t.id].status) < rank(workload.requires[t.id]));
  // isolationLevels is ordered weakest to strongest
  const lightest = simData.isolationLevels.find(meetsNeeds);
  // threats that another control layer, not isolation, has to finish off
  const otherLayers = simData.threats.filter(t =>
    t.layer !== 'isolation' && level.threats[t.id].status !== 'blocked');

  const paragraphs = [];
  let kind;
  if (shortfalls.length > 0) {
    kind = 'weak';
    paragraphs.push(capitalize(level.name) + ' is too weak for a ' + workload.label +
      ' workload. It falls short on ' + listPhrase(shortfalls.map(t => t.short)) + '.');
    if (lightest) {
      paragraphs.push('The lightest level that meets this workload\'s needs is ' + lightest.name + '.');
    }
  } else {
    if (lightest === level) {
      kind = 'fit';
      paragraphs.push(capitalize(level.name) + ' is the lightest level here that meets what a ' +
        workload.label + ' workload needs.');
    } else {
      kind = 'spare';
      paragraphs.push(capitalize(level.name) + ' is safe for a ' + workload.label +
        ' workload, but ' + lightest.name + ' would already meet its needs. The price of the extra margin: ' +
        level.cost + '.');
    }
    if (otherLayers.length > 0) {
      paragraphs.push('Isolation is not the whole answer. Still add ' +
        listPhrase(otherLayers.map(t => t.layer + ' (' + t.short + ')')) + '.');
    }
  }
  const note = (simData.notes || {})[level.id];
  if (note) paragraphs.push(note);
  return { kind, paragraphs };
}

const VERDICT_STYLE = {
  weak:  { label: 'Not appropriate', fill: FEASIBLE_RED,  text: 'white' },
  fit:   { label: 'Appropriate',     fill: BLOCKED_GREEN, text: 'black' },
  spare: { label: 'More than needed', fill: CAVEATS_AMBER, text: 'black' }
};

// ---------- text helpers ----------

// Largest text size (down to MIN_TEXT_SIZE) at which str fits in maxWidth
function fitSize(str, maxWidth, startSize) {
  let size = startSize;
  textSize(size);
  while (textWidth(str) > maxWidth && size > MIN_TEXT_SIZE) {
    size -= 1;
    textSize(size);
  }
  return size;
}

// Break str into lines no wider than maxWidth at the current text size
function wrapLines(str, maxWidth) {
  const words = str.split(' ');
  const lines = [];
  let current = '';
  words.forEach(word => {
    const candidate = current ? current + ' ' + word : word;
    if (textWidth(candidate) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });
  if (current) lines.push(current);
  return lines;
}

// Wrap a list of paragraphs to width w, shrinking the font until they fit in
// height h. Returns the rows to draw (an empty row separates paragraphs).
function fitParagraphs(paragraphs, w, h, startSize) {
  let size = startSize;
  let rows;
  while (true) {
    textSize(size);
    rows = [];
    paragraphs.forEach((p, i) => {
      if (i > 0) rows.push(null);
      wrapLines(p, w).forEach(part => rows.push(part));
    });
    const leading = size + 4;
    const used = rows.reduce((sum, row) => sum + (row === null ? leading * 0.5 : leading), 0);
    if (used <= h || size <= MIN_TEXT_SIZE) return { rows, size, leading };
    size -= 1;
  }
}

function drawParagraphs(paragraphs, x, y, w, h, startSize) {
  const fitted = fitParagraphs(paragraphs, w, h, startSize);
  textAlign(LEFT, TOP);
  let cursorY = y;
  fitted.rows.forEach(row => {
    if (row === null) {
      cursorY += fitted.leading * 0.5;
    } else {
      text(row, x, cursorY);
      cursorY += fitted.leading;
    }
  });
}

function drawPill(label, pillFill, labelColor, x, y, w, h) {
  noStroke();
  fill(pillFill);
  rect(x, y, w, h, 6);
  fill(labelColor);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(fitSize(label, w - 10, 14));
  text(label, x + w / 2, y + h / 2 + 1);
  textStyle(NORMAL);
}

// ---------- drawing ----------

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textAlign(CENTER, TOP);
  textSize(fitSize('Container Isolation Strength Comparator', canvasWidth - 20, 24));
  text('Container Isolation Strength Comparator', canvasWidth / 2, 8);

  drawControlLabels();

  if (!simData) {
    noStroke();
    fill(loadError ? FEASIBLE_RED : SLATE);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(loadError
      ? 'Could not load data.json. Open this MicroSim through a web server (for example mkdocs serve).'
      : 'Loading threat matrix...', 20, 60, canvasWidth - 40, drawHeight - 120);
    return;
  }

  const level = currentLevel();
  const workload = currentWorkload();
  const narrow = canvasWidth < 560;

  // the scenario under test
  noStroke();
  fill(SLATE);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  const scenarioShort = capitalize(level.name) + ' running a ' + workload.label + ' workload';
  const scenarioLong = scenarioShort + ': ' + workload.description;
  // drop the workload description when the full line cannot fit legibly
  textSize(MIN_TEXT_SIZE + 2);
  const scenario = textWidth(scenarioLong) <= canvasWidth - 20 ? scenarioLong : scenarioShort;
  textSize(fitSize(scenario, canvasWidth - 20, 16));
  text(scenario, canvasWidth / 2, 42);
  textStyle(NORMAL);

  // geometry
  const top = 70;
  const rowH = 56;
  const rowGap = 6;
  const listBottom = top + 5 * rowH + 4 * rowGap;
  const verdictW = narrow ? 0 : constrain((canvasWidth - 40) * 0.38, 230, 320);
  const listX = 15;
  const listW = canvasWidth - 30 - (narrow ? 0 : verdictW + 10);
  const bottomY = listBottom + 8;
  const bottomH = drawHeight - bottomY - 8;

  // which threat row is under the pointer or pinned by a tap
  rowBoxes = simData.threats.map((t, i) => ({ x: listX, y: top + i * (rowH + rowGap), w: listW, h: rowH }));
  const hovered = rowBoxes.findIndex(b => mouseX >= b.x && mouseX <= b.x + b.w &&
    mouseY >= b.y && mouseY <= b.y + b.h);
  const active = hovered >= 0 ? hovered : selectedRow;
  cursor(hovered >= 0 ? HAND : ARROW);

  simData.threats.forEach((threat, i) => {
    drawThreatRow(threat, level.threats[threat.id], i, rowBoxes[i], i === active);
  });

  const verdict = computeVerdict(level, workload);
  if (!narrow) {
    drawVerdictPanel(verdict, level, workload, listX + listW + 10, top, verdictW, listBottom - top);
    drawWhyBox(active, level, 15, bottomY, canvasWidth - 30, bottomH);
  } else if (active >= 0 && !pending) {
    drawWhyBox(active, level, 15, bottomY, canvasWidth - 30, bottomH);
  } else {
    // narrow screens: the verdict shares the bottom box with the rationale
    drawVerdictPanel(verdict, level, workload, 15, bottomY, canvasWidth - 30, bottomH);
  }
}

function drawThreatRow(threat, result, index, box, isActive) {
  // row card
  stroke(isActive ? HEADER_BLUE : 'silver');
  strokeWeight(isActive ? 2 : 1);
  fill('white');
  rect(box.x, box.y, box.w, box.h, 8);
  strokeWeight(1);

  // scenario number
  noStroke();
  fill(HEADER_BLUE);
  circle(box.x + 22, box.y + box.h / 2, 26);
  fill('white');
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  textSize(15);
  text(index + 1, box.x + 22, box.y + box.h / 2 + 1);
  textStyle(NORMAL);

  // badge
  const compact = box.w < 430;
  const badgeW = compact ? 82 : 172;
  const badgeH = 28;
  const badgeX = box.x + box.w - badgeW - 10;
  const badgeY = box.y + (box.h - badgeH) / 2;
  if (pending) {
    stroke(PENDING_GRAY);
    drawingContext.setLineDash([4, 3]);
    fill('white');
    rect(badgeX, badgeY, badgeW, badgeH, 6);
    drawingContext.setLineDash([]);
    noStroke();
    fill(SLATE);
    textAlign(CENTER, CENTER);
    textSize(14);
    text('not run', badgeX + badgeW / 2, badgeY + badgeH / 2 + 1);
  } else {
    const status = simData.statuses[result.status];
    const style = STATUS_STYLE[result.status];
    drawPill(compact && status.short ? status.short : status.label, style.fill, style.text,
      badgeX, badgeY, badgeW, badgeH);
  }

  // scenario text, wrapped to at most what the row can hold
  noStroke();
  fill('black');
  const textX = box.x + 44;
  const textW = badgeX - textX - 10;
  const fitted = fitParagraphs([threat.text], textW, box.h - 8, 15);
  const blockH = fitted.rows.length * fitted.leading;
  textAlign(LEFT, TOP);
  fitted.rows.forEach((row, i) => {
    text(row, textX, box.y + (box.h - blockH) / 2 + i * fitted.leading + 1);
  });
}

function drawVerdictPanel(verdict, level, workload, x, y, w, h) {
  const headerH = 30;
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill(HEADER_BLUE);
  rect(x, y, w, headerH, 8, 8, 0, 0);
  fill('white');
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  textSize(15);
  text('Verdict', x + 10, y + headerH / 2 + 1);
  textStyle(NORMAL);

  const bodyX = x + 10;
  const bodyW = w - 20;
  let bodyY = y + headerH + 8;

  if (pending) {
    noStroke();
    fill('black');
    drawParagraphs([
      'Your call: is ' + level.name + ' appropriate for a ' + workload.label + ' workload?',
      'Decide which of the five threats it must stop, then press Run threat suite to check.'
    ], bodyX, bodyY, bodyW, y + h - bodyY - 6, 15);
    return;
  }

  const style = VERDICT_STYLE[verdict.kind];
  const wideBody = h < 120;   // the short, full-width box used on narrow screens
  if (wideBody) {
    // pill sits in the header so the short box keeps its room for text
    drawPill(style.label, style.fill, style.text, x + w - 150, y + 4, 144, headerH - 8);
  } else {
    drawPill(style.label, style.fill, style.text, bodyX, bodyY, Math.min(bodyW, 170), 28);
    bodyY += 38;
  }
  noStroke();
  fill('black');
  drawParagraphs(wideBody ? verdict.paragraphs.slice(0, 1) : verdict.paragraphs,
    bodyX, bodyY, bodyW, y + h - bodyY - 6, 15);
}

function drawWhyBox(active, level, x, y, w, h) {
  stroke(HEADER_BLUE);
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();

  const bodyX = x + 10;
  const bodyW = w - 20;
  if (pending) {
    fill(SLATE);
    drawParagraphs(['Badges are hidden until you run the threat suite against this isolation level.'],
      bodyX, y + 8, bodyW, h - 14, 15);
    return;
  }
  if (active < 0) {
    fill(SLATE);
    drawParagraphs(['Why? Point at a threat (or tap it) to see why this isolation level earned that badge.'],
      bodyX, y + 8, bodyW, h - 14, 15);
    return;
  }
  const threat = simData.threats[active];
  const result = level.threats[threat.id];
  fill(HEADER_BLUE);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  const heading = 'Why is threat ' + (active + 1) + ' ' + simData.statuses[result.status].label + '?';
  textSize(fitSize(heading, bodyW, 15));
  text(heading, bodyX, y + 7);
  textStyle(NORMAL);
  fill('black');
  drawParagraphs([result.why], bodyX, y + 28, bodyW, h - 34, 15);
}

// ---------- pointer ----------

// A click or tap pins a threat row so its rationale stays on touch screens.
function mousePressed() {
  const hit = rowBoxes.findIndex(b => mouseX >= b.x && mouseX <= b.x + b.w &&
    mouseY >= b.y && mouseY <= b.y + b.h);
  if (hit >= 0) selectedRow = (selectedRow === hit ? -1 : hit);
}

// ---------- controls ----------

function drawControlLabels() {
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Isolation level:', 10, drawHeight + 21);
  text('Workload trust:', 10, drawHeight + 57);
}

function layoutControls() {
  const narrow = canvasWidth < 560;
  isolationSelect.size(Math.min(canvasWidth - selectLeft - 10, 400));
  const workloadW = narrow ? Math.max(90, canvasWidth - selectLeft - 125) : 190;
  workloadSelect.size(workloadW);
  const buttonsX = selectLeft + workloadW + 10;
  runButton.position(buttonsX, drawHeight + 45);
  resetButton.position(buttonsX + (narrow ? 50 : 132), drawHeight + 45);
  if (narrow !== narrowControls) {
    narrowControls = narrow;
    runButton.html(narrow ? 'Run' : 'Run threat suite');
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
  if (typeof resetButton !== 'undefined') {
    layoutControls();
  }
}
