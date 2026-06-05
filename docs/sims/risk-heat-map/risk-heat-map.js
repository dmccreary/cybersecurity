// CANVAS_HEIGHT: 700
// Risk Heat Map — p5.js interactive 5x5 likelihood-by-impact grid (Bloom:
// Analyze). Students place a risk on the grid (via a sample, the sliders, or by
// dragging the marker) and observe how the recommended treatment changes with
// placement. Score = likelihood x impact.

let canvasWidth = 920;
let drawHeight = 560;
let controlHeight = 140;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 150;
let defaultTextSize = 16;

let riskSelect, likeSlider, impactSlider, resetButton;

let likelihood = 3;
let impact = 4;
let dragging = false;
let hoverCell = null; // {l, i}

// Grid geometry (computed each frame for responsiveness)
let gridX, gridY, gridSize, cell;

const sampleRisks = [
  { name: 'Phishing email reaches employee', l: 4, i: 3 },
  { name: 'Hard-coded DB credential',        l: 3, i: 5 },
  { name: 'Vendor SaaS outage',              l: 3, i: 3 },
  { name: 'Lost employee laptop',            l: 3, i: 2 },
  { name: 'Quantum-broken legacy crypto',    l: 2, i: 5 },
  { name: 'Custom (drag your own)',          l: null, i: null }
];

const likeLabels = ['1 Rare', '2 Unlikely', '3 Possible', '4 Likely', '5 Almost Certain'];
const impactLabels = ['1 Negligible', '2 Minor', '3 Moderate', '4 Major', '5 Catastrophic'];

function scoreColor(s) {
  if (s <= 4) return color('#4caf50');
  if (s <= 9) return color('#fbc02d');
  if (s <= 14) return color('#ffa000');
  return color('#d84315');
}

function treatment(s) {
  if (s >= 15) return { name: 'Mitigate or Avoid', why: 'Severe risk: reduce it with strong controls, or avoid the activity entirely.' };
  if (s >= 10) return { name: 'Mitigate or Transfer', why: 'High risk: apply controls, and consider transferring residual risk (e.g. insurance, contracts).' };
  if (s >= 5)  return { name: 'Mitigate or Accept', why: 'Moderate risk: mitigate where controls are feasible, otherwise accept within appetite.' };
  return { name: 'Accept', why: 'Low risk: within appetite. Accept and monitor rather than spend scarce controls here.' };
}

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  riskSelect = createSelect();
  sampleRisks.forEach(r => riskSelect.option(r.name));
  riskSelect.selected('Hard-coded DB credential');
  riskSelect.parent(document.querySelector('main'));
  riskSelect.position(sliderLeftMargin, drawHeight + 8);
  riskSelect.changed(onSelectRisk);

  likeSlider = createSlider(1, 5, likelihood, 1);
  likeSlider.parent(document.querySelector('main'));
  likeSlider.position(sliderLeftMargin, drawHeight + 45);
  likeSlider.input(onSlider);

  impactSlider = createSlider(1, 5, impact, 1);
  impactSlider.parent(document.querySelector('main'));
  impactSlider.position(sliderLeftMargin, drawHeight + 80);
  impactSlider.input(onSlider);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.position(10, drawHeight + 108);
  resetButton.mousePressed(onReset);

  // initialize from the default sample
  onSelectRisk();

  describe('A 5 by 5 risk heat map where likelihood and impact set a risk score ' +
    'and a recommended treatment. Choose a sample risk, move the sliders, or drag ' +
    'the marker on the grid.', LABEL);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  likeSlider.size(min(260, canvasWidth - sliderLeftMargin - margin));
  impactSlider.size(min(260, canvasWidth - sliderLeftMargin - margin));
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
  if (typeof likeSlider !== 'undefined') {
    likeSlider.size(min(260, canvasWidth - sliderLeftMargin - margin));
    impactSlider.size(min(260, canvasWidth - sliderLeftMargin - margin));
  }
}

function onSelectRisk() {
  const r = sampleRisks.find(x => x.name === riskSelect.value());
  if (r && r.l !== null) {
    likelihood = r.l; impact = r.i;
    likeSlider.value(likelihood);
    impactSlider.value(impact);
  }
}

function onSlider() {
  likelihood = likeSlider.value();
  impact = impactSlider.value();
  // moving sliders implies a custom placement
  riskSelect.selected('Custom (drag your own)');
}

function onReset() {
  riskSelect.selected('Hard-coded DB credential');
  onSelectRisk();
}

function draw() {
  updateCanvasSize();

  fill('aliceblue'); stroke('silver'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  // layout: grid on left, panel on right
  const panelW = min(300, canvasWidth * 0.34);
  const leftArea = canvasWidth - panelW;
  gridSize = min(leftArea - 110, drawHeight - 130);
  gridSize = max(gridSize, 220);
  cell = gridSize / 5;
  gridX = 80;
  gridY = 70;

  // Title — centered over the whole drawing area
  noStroke(); fill('black'); textSize(19); textAlign(CENTER, TOP);
  text('Risk Heat Map: Likelihood x Impact Drives the Treatment',
       canvasWidth / 2, 12);

  drawGrid();
  drawAxes();
  drawMarker();
  drawPanel(canvasWidth - panelW + 10, 60, panelW - 25);
  drawControlLabels();
}

function drawGrid() {
  textAlign(CENTER, CENTER);
  for (let li = 1; li <= 5; li++) {        // x = likelihood
    for (let im = 1; im <= 5; im++) {      // y = impact (5 at top)
      const s = li * im;
      const x = gridX + (li - 1) * cell;
      const y = gridY + (5 - im) * cell;
      noStroke();
      const c = scoreColor(s);
      // dim non-hovered cells slightly when hovering one
      fill(c);
      rect(x, y, cell, cell);
      stroke('white'); strokeWeight(2); noFill();
      rect(x, y, cell, cell);
      // score number
      noStroke(); fill(0, 0, 0, 150); textSize(min(16, cell * 0.32));
      text(s, x + cell / 2, y + cell / 2);
    }
  }
  // hover highlight
  if (hoverCell) {
    const x = gridX + (hoverCell.l - 1) * cell;
    const y = gridY + (5 - hoverCell.i) * cell;
    noFill(); stroke('#0d2b4a'); strokeWeight(3);
    rect(x, y, cell, cell);
  }
}

function drawAxes() {
  noStroke(); fill('#263238');
  textSize(min(12, cell * 0.26));
  // x-axis labels (likelihood) below grid
  textAlign(CENTER, TOP);
  for (let li = 1; li <= 5; li++) {
    text(likeLabels[li - 1], gridX + (li - 1) * cell + cell / 2, gridY + gridSize + 6);
  }
  // x-axis title
  textSize(14); fill('#0d47a1');
  text('Likelihood  →', gridX + gridSize / 2, gridY + gridSize + 30);

  // y-axis labels (impact) left of grid, rotated
  textSize(min(12, cell * 0.26)); fill('#263238');
  push();
  textAlign(CENTER, CENTER);
  for (let im = 1; im <= 5; im++) {
    const y = gridY + (5 - im) * cell + cell / 2;
    push();
    translate(gridX - 12, y);
    rotate(-HALF_PI);
    text(impactLabels[im - 1], 0, 0);
    pop();
  }
  pop();
  // y-axis title
  push();
  translate(gridX - 52, gridY + gridSize / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER); textSize(14); fill('#0d47a1');
  text('Impact  →', 0, 0);
  pop();
}

function drawMarker() {
  const x = gridX + (likelihood - 1) * cell + cell / 2;
  const y = gridY + (5 - impact) * cell + cell / 2;
  stroke('#455a64'); strokeWeight(2); fill('#1565c0');
  circle(x, y, min(28, cell * 0.5));
  noStroke(); fill('white'); textAlign(CENTER, CENTER); textSize(min(13, cell * 0.26));
  text(likelihood * impact, x, y);
}

function drawPanel(px, py, pw) {
  const s = likelihood * impact;
  const t = treatment(s);
  const c = scoreColor(s);
  const riskName = riskSelect.value();

  noStroke(); fill(255, 255, 255, 235); stroke('#cbd5e1'); strokeWeight(1);
  rect(px, py, pw, drawHeight - py - 20, 10);

  noStroke(); textAlign(LEFT, TOP);
  fill('#455a64'); textSize(13);
  text('Selected risk', px + 14, py + 14, pw - 28);
  fill('#212529'); textSize(16); textStyle(BOLD);
  text(riskName, px + 14, py + 34, pw - 28);
  textStyle(NORMAL);

  // score chip
  const chipY = py + 92;
  fill('#455a64'); textSize(13);
  text('Likelihood ' + likelihood + '  x  Impact ' + impact + '  =  score', px + 14, chipY);
  fill(c); noStroke(); rect(px + 14, chipY + 22, 64, 44, 8);
  fill('white'); textAlign(CENTER, CENTER); textSize(26); textStyle(BOLD);
  text(s, px + 14 + 32, chipY + 22 + 22);
  textStyle(NORMAL);

  // band label
  textAlign(LEFT, CENTER); textSize(13); fill('#263238');
  let band = s <= 4 ? 'Low (1-4)' : s <= 9 ? 'Medium (5-9)' : s <= 14 ? 'High (10-14)' : 'Critical (15-25)';
  text(band, px + 90, chipY + 22 + 22);

  // recommended treatment
  textAlign(LEFT, TOP);
  fill('#0d47a1'); textSize(13);
  text('Recommended treatment', px + 14, chipY + 84);
  fill(c); textSize(20); textStyle(BOLD);
  text(t.name, px + 14, chipY + 104, pw - 28);
  textStyle(NORMAL);
  fill('#334155'); textSize(13);
  text(t.why, px + 14, chipY + 134, pw - 28);

  // hover interpretation
  if (hoverCell) {
    const hs = hoverCell.l * hoverCell.i;
    fill('#455a64'); textSize(12.5);
    const interp = 'Cell ' + hoverCell.l + ' x ' + hoverCell.i + ' = ' + hs +
      ': ' + likeLabels[hoverCell.l - 1].split(' ').slice(1).join(' ').toLowerCase() +
      ' likelihood, ' + impactLabels[hoverCell.i - 1].split(' ').slice(1).join(' ').toLowerCase() +
      ' impact — ' + treatment(hs).name.toLowerCase() + '.';
    text(interp, px + 14, chipY + 196, pw - 28);
  }
}

function drawControlLabels() {
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(defaultTextSize);
  text('Sample risk:', 10, drawHeight + 20);
  text('Likelihood: ' + likelihood, 10, drawHeight + 57);
  text('Impact: ' + impact, 10, drawHeight + 92);
}

// --- marker dragging + cell hover ---
function inGrid(mx, my) {
  return mx >= gridX && mx <= gridX + gridSize && my >= gridY && my <= gridY + gridSize;
}

function cellFromMouse(mx, my) {
  const li = constrain(floor((mx - gridX) / cell) + 1, 1, 5);
  const im = constrain(5 - floor((my - gridY) / cell), 1, 5);
  return { l: li, i: im };
}

function mousePressed() {
  if (inGrid(mouseX, mouseY)) {
    dragging = true;
    setFromMouse();
  }
}

function mouseDragged() {
  if (dragging) setFromMouse();
}

function mouseReleased() { dragging = false; }

function setFromMouse() {
  const c = cellFromMouse(mouseX, mouseY);
  likelihood = c.l; impact = c.i;
  likeSlider.value(likelihood);
  impactSlider.value(impact);
  riskSelect.selected('Custom (drag your own)');
}

function mouseMoved() {
  if (inGrid(mouseX, mouseY)) hoverCell = cellFromMouse(mouseX, mouseY);
  else hoverCell = null;
}
