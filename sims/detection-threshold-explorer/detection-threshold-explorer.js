// CANVAS_HEIGHT: 600
// Detection Tuning Trade-Off Explorer — p5.js MicroSim (Bloom: Analyze).
// Students analyze how the choice of detection threshold trades true-positive
// rate against false-positive rate, and reason about the operational
// consequences (alert fatigue, missed attacks) of the two extremes.
//
// Model: anomaly scores for benign and malicious events are two normal
// distributions (means 0.3 and 0.7, shared standard deviation set by the
// "Curve overlap" slider), truncated to the visible 0..1 score axis so that
// every shaded area on screen matches the numbers in the readouts.
// Counts assume a fixed 1% of daily events are malicious (MALICIOUS_FRACTION).

let canvasWidth = 800;
let drawHeight = 450;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 250;
let defaultTextSize = 16;

// --- model constants ---
const BENIGN_MEAN = 0.3;
const MALICIOUS_MEAN = 0.7;
const MALICIOUS_FRACTION = 0.01;   // 1% of events are real attacks
const DEFAULT_THRESHOLD = 0.5;
const DEFAULT_OVERLAP = 0.2;
const DEFAULT_TRAFFIC_EXP = 5;     // 10^5 = 100,000 events per day
const SIGNATURE_THRESHOLD = 0.85;
const ANOMALY_THRESHOLD = 0.55;

// Zone boundaries (rate-based, so they follow the overlap slider)
const FATIGUE_FPR = 0.25;          // more than 25% of benign events alert
const MISSED_TPR = 0.5;            // fewer than half of the attacks alert

// --- book palette (named so the drawing code stays readable) ---
const BENIGN_BLUE = '#1565c0';
const MALICIOUS_ORANGE = '#d84315';
const FALSE_POSITIVE_AMBER = '#ffa000';
const TRUE_POSITIVE_GREEN = '#4caf50';
const FALSE_NEGATIVE_RED = '#d32f2f';
const SLATE = '#455a64';

// controls
let thresholdSlider, overlapSlider, trafficSlider;
let buttonRow, signatureButton, anomalyButton, resetButton;
let wideButtonLabels = null;
let draggingThreshold = false;

// layout (recomputed every frame from canvasWidth)
let plotLeft, plotRight, plotTop, plotBottom;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: preset and reset buttons in a flex row so they never overlap
  buttonRow = createDiv('');
  buttonRow.parent(document.querySelector('main'));
  buttonRow.position(10, drawHeight + 8);
  buttonRow.style('display', 'flex');
  buttonRow.style('gap', '8px');

  signatureButton = createButton('Preset: signature-style (high threshold)');
  signatureButton.parent(buttonRow);
  signatureButton.mousePressed(() => thresholdSlider.value(SIGNATURE_THRESHOLD));

  anomalyButton = createButton('Preset: anomaly-style (lower threshold)');
  anomalyButton.parent(buttonRow);
  anomalyButton.mousePressed(() => thresholdSlider.value(ANOMALY_THRESHOLD));

  resetButton = createButton('Reset');
  resetButton.parent(buttonRow);
  resetButton.mousePressed(resetControls);

  // Rows 2-4: sliders
  thresholdSlider = createSlider(0, 1, DEFAULT_THRESHOLD, 0.01);
  thresholdSlider.parent(document.querySelector('main'));
  thresholdSlider.position(sliderLeftMargin, drawHeight + 45);

  overlapSlider = createSlider(0.1, 0.5, DEFAULT_OVERLAP, 0.01);
  overlapSlider.parent(document.querySelector('main'));
  overlapSlider.position(sliderLeftMargin, drawHeight + 80);

  // log-scaled: the slider holds the exponent, 10^3 .. 10^6 events per day
  trafficSlider = createSlider(3, 6, DEFAULT_TRAFFIC_EXP, 0.05);
  trafficSlider.parent(document.querySelector('main'));
  trafficSlider.position(sliderLeftMargin, drawHeight + 115);

  updateCanvasSize();

  describe('Two overlapping bell curves of anomaly scores for benign and ' +
    'malicious traffic with a draggable detection threshold. Shaded areas and ' +
    'numeric readouts show true positives, false positives, false negatives, ' +
    'and the estimated alert volume per day, plus the matching point on an ' +
    'ROC curve.', LABEL);
}

function resetControls() {
  thresholdSlider.value(DEFAULT_THRESHOLD);
  overlapSlider.value(DEFAULT_OVERLAP);
  trafficSlider.value(DEFAULT_TRAFFIC_EXP);
}

// ---------- statistics helpers ----------

// Abramowitz-Stegun approximation of the error function (max error 1.5e-7)
function erf(x) {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const poly = ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t -
    0.284496736) * t + 0.254829592) * t;
  return sign * (1 - poly * Math.exp(-ax * ax));
}

function normalCdf(z) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

// Probability mass of a normal(mean, sigma) that lies on the 0..1 score axis
function massOnAxis(mean, sigma) {
  return normalCdf((1 - mean) / sigma) - normalCdf((0 - mean) / sigma);
}

// Density at score x of the normal truncated to 0..1
function density(x, mean, sigma) {
  const z = (x - mean) / sigma;
  return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI)) /
    massOnAxis(mean, sigma);
}

// Fraction of the truncated distribution with a score at or above threshold
function fractionAbove(threshold, mean, sigma) {
  return (normalCdf((1 - mean) / sigma) - normalCdf((threshold - mean) / sigma)) /
    massOnAxis(mean, sigma);
}

// Round a traffic volume to two significant figures so the readout is tidy
function tidyVolume(v) {
  const magnitude = Math.pow(10, Math.floor(Math.log10(v)) - 1);
  return Math.round(v / magnitude) * magnitude;
}

function currentModel() {
  const threshold = thresholdSlider.value();
  const sigma = overlapSlider.value();
  const traffic = tidyVolume(Math.pow(10, trafficSlider.value()));

  const tpr = fractionAbove(threshold, MALICIOUS_MEAN, sigma);
  const fpr = fractionAbove(threshold, BENIGN_MEAN, sigma);

  const maliciousEvents = Math.round(traffic * MALICIOUS_FRACTION);
  const benignEvents = traffic - maliciousEvents;
  const truePositives = Math.round(maliciousEvents * tpr);
  const falseNegatives = maliciousEvents - truePositives;
  const falsePositives = Math.round(benignEvents * fpr);
  const alerts = truePositives + falsePositives;
  const precision = alerts > 0 ? truePositives / alerts : 0;

  return { threshold, sigma, traffic, tpr, fpr, truePositives, falseNegatives,
    falsePositives, alerts, precision };
}

function zoneFor(m) {
  const noisy = m.fpr > FATIGUE_FPR;
  const blind = m.tpr < MISSED_TPR;
  if (noisy && blind) {
    return { tint: color(69, 90, 100, 45), edge: SLATE,
      message: 'no-win zone — the curves overlap so much that alerts are noisy and attacks are still missed' };
  }
  if (noisy) {
    return { tint: color(255, 160, 0, 60), edge: FALSE_POSITIVE_AMBER,
      message: 'alert fatigue zone — analysts will miss real attacks among the noise' };
  }
  if (blind) {
    return { tint: color(211, 47, 47, 45), edge: FALSE_NEGATIVE_RED,
      message: 'missed-attack zone — detection rules pass over real malicious activity' };
  }
  return { tint: color(76, 175, 80, 50), edge: TRUE_POSITIVE_GREEN,
    message: 'operational range — a workable balance between noise and misses' };
}

// ---------- drawing ----------

function draw() {
  updateCanvasSize();

  // drawing region and control region backgrounds
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  plotLeft = 40;
  plotRight = canvasWidth - 40;
  plotTop = 66;
  plotBottom = 232;

  const m = currentModel();

  // title
  noStroke();
  fill('black');
  textAlign(CENTER, TOP);
  textStyle(NORMAL);
  textSize(fitSize('Detection Tuning Trade-Off Explorer', canvasWidth - 20, 24));
  text('Detection Tuning Trade-Off Explorer', canvasWidth / 2, 8);

  drawDistributions(m);
  drawZoneCaption(m);
  drawReadouts(m);
  drawControlLabels(m);

  cursor(draggingThreshold || overThresholdLine() ? 'ew-resize' : ARROW);
}

function scoreToX(score) {
  return plotLeft + score * (plotRight - plotLeft);
}

// Largest text size (down to 11) at which str fits in maxWidth
function fitSize(str, maxWidth, startSize) {
  let size = startSize;
  textSize(size);
  while (textWidth(str) > maxWidth && size > 11) {
    size -= 1;
    textSize(size);
  }
  return size;
}

function shadeUnderCurve(fromScore, toScore, mean, sigma, yScale, shade) {
  if (toScore - fromScore < 0.0005) return;
  noStroke();
  fill(shade);
  beginShape();
  vertex(scoreToX(fromScore), plotBottom);
  const steps = 80;
  for (let i = 0; i <= steps; i++) {
    const s = fromScore + (toScore - fromScore) * i / steps;
    vertex(scoreToX(s), plotBottom - density(s, mean, sigma) * yScale);
  }
  vertex(scoreToX(toScore), plotBottom);
  endShape(CLOSE);
}

function traceCurve(mean, sigma, yScale, lineColor) {
  noFill();
  stroke(lineColor);
  strokeWeight(3);
  beginShape();
  for (let i = 0; i <= 200; i++) {
    const s = i / 200;
    vertex(scoreToX(s), plotBottom - density(s, mean, sigma) * yScale);
  }
  endShape();
  strokeWeight(1);
}

function drawDistributions(m) {
  const plotHeight = plotBottom - plotTop;
  // both curves share a sigma, so they share a peak height
  const peak = density(MALICIOUS_MEAN, MALICIOUS_MEAN, m.sigma);
  const yScale = plotHeight * 0.8 / peak;

  // shaded outcome regions (true negatives stay unshaded)
  shadeUnderCurve(0, m.threshold, MALICIOUS_MEAN, m.sigma, yScale, color(211, 47, 47, 120));
  shadeUnderCurve(m.threshold, 1, MALICIOUS_MEAN, m.sigma, yScale, color(76, 175, 80, 150));
  shadeUnderCurve(m.threshold, 1, BENIGN_MEAN, m.sigma, yScale, color(255, 160, 0, 170));

  traceCurve(BENIGN_MEAN, m.sigma, yScale, BENIGN_BLUE);
  traceCurve(MALICIOUS_MEAN, m.sigma, yScale, MALICIOUS_ORANGE);

  // horizontal axis with ticks
  stroke(SLATE);
  strokeWeight(1);
  line(plotLeft, plotBottom, plotRight, plotBottom);
  for (let i = 0; i <= 10; i++) {
    const x = scoreToX(i / 10);
    line(x, plotBottom, x, plotBottom + (i % 2 === 0 ? 6 : 3));
  }
  noStroke();
  fill(SLATE);
  textSize(14);
  textAlign(CENTER, TOP);
  for (let i = 0; i <= 10; i += 2) {
    text((i / 10).toFixed(1), scoreToX(i / 10), plotBottom + 8);
  }
  fill('black');
  textSize(fitSize('Anomaly score (drag the threshold line)', canvasWidth - 40, 16));
  text('Anomaly score (drag the threshold line)', canvasWidth / 2, plotBottom + 26);

  // curve labels in the top corners, clear of the curves
  textSize(16);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  fill(BENIGN_BLUE);
  text('benign traffic', plotLeft, plotTop - 22);
  textAlign(RIGHT, TOP);
  fill(MALICIOUS_ORANGE);
  text('malicious traffic', plotRight, plotTop - 22);
  textStyle(NORMAL);

  // threshold line and its label
  const tx = scoreToX(m.threshold);
  stroke(SLATE);
  strokeWeight(3);
  line(tx, plotTop + 4, tx, plotBottom);
  strokeWeight(1);
  noStroke();
  fill(SLATE);
  triangle(tx - 7, plotBottom + 1, tx + 7, plotBottom + 1, tx, plotBottom - 9);

  const label = 'threshold ' + m.threshold.toFixed(2);
  textSize(14);
  textStyle(BOLD);
  const pillW = textWidth(label) + 16;
  // keep the pill between the two corner labels' vertical band and on canvas
  const pillX = constrain(tx - pillW / 2, plotLeft, plotRight - pillW);
  fill(SLATE);
  rect(pillX, plotTop + 2, pillW, 22, 6);
  fill('white');
  textAlign(CENTER, CENTER);
  text(label, pillX + pillW / 2, plotTop + 13);
  textStyle(NORMAL);
}

function drawZoneCaption(m) {
  const zone = zoneFor(m);
  const x = 15;
  const y = 284;
  const w = canvasWidth - 30;
  const h = 28;
  stroke(zone.edge);
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  fill(zone.tint);
  rect(x, y, w, h, 8);
  noStroke();
  fill('black');
  textAlign(CENTER, CENTER);
  textSize(fitSize(zone.message, w - 16, 16));
  text(zone.message, x + w / 2, y + h / 2 + 1);
}

function drawCard(x, y, w, h, swatch, label, value, detail) {
  const compact = w < 210;
  stroke('silver');
  strokeWeight(1);
  fill(255, 255, 255, 235);
  rect(x, y, w, h, 8);
  noStroke();
  if (swatch) {
    fill(swatch);
    rect(x + 10, y + 9, 14, 14, 3);
  }
  fill(SLATE);
  textAlign(LEFT, TOP);
  textStyle(NORMAL);
  const labelX = x + (swatch ? 30 : 10);
  textSize(fitSize(label, x + w - labelX - 6, 15));
  text(label, labelX, y + 8);

  fill('black');
  textStyle(BOLD);
  textSize(fitSize(value, w - 20, compact ? 16 : 20));
  text(value, x + 10, y + 30);
  const valueWidth = textWidth(value);
  textStyle(NORMAL);
  if (!compact && detail) {
    fill(SLATE);
    textSize(14);
    text(detail, x + 10 + valueWidth + 10, y + 35);
  }
}

function drawReadouts(m) {
  const panelTop = 322;
  const rocSize = 100;
  const rocLeft = canvasWidth - 28 - rocSize;
  const rocTop = panelTop;

  // four readout cards in a 2 x 2 grid to the left of the ROC chart
  const gap = 8;
  const cardsLeft = 15;
  const cardsRight = rocLeft - 30;
  const cardW = (cardsRight - cardsLeft - gap) / 2;
  const cardH = 56;
  const compact = cardW < 210;
  const perDay = compact ? '' : ' / day';

  drawCard(cardsLeft, panelTop, cardW, cardH, TRUE_POSITIVE_GREEN,
    'True Positives', m.truePositives.toLocaleString() + perDay,
    'caught: ' + (m.tpr * 100).toFixed(1) + '% of attacks');
  drawCard(cardsLeft + cardW + gap, panelTop, cardW, cardH, FALSE_POSITIVE_AMBER,
    'False Positives', m.falsePositives.toLocaleString() + perDay,
    (m.fpr * 100).toFixed(1) + '% of benign');
  drawCard(cardsLeft, panelTop + cardH + gap, cardW, cardH, FALSE_NEGATIVE_RED,
    'False Negatives', m.falseNegatives.toLocaleString() + perDay,
    'missed: ' + ((1 - m.tpr) * 100).toFixed(1) + '% of attacks');
  drawCard(cardsLeft + cardW + gap, panelTop + cardH + gap, cardW, cardH, null,
    compact ? 'Alerts per Day (est.)' : 'Alert Volume per Day (estimated)',
    m.alerts.toLocaleString(),
    (m.precision * 100).toFixed(1) + '% are real attacks');

  // --- ROC chart ---
  stroke('silver');
  fill('white');
  rect(rocLeft, rocTop, rocSize, rocSize);

  // chance diagonal
  stroke(170);
  drawingContext.setLineDash([4, 4]);
  line(rocLeft, rocTop + rocSize, rocLeft + rocSize, rocTop);
  drawingContext.setLineDash([]);

  // ROC curve for the current overlap: sweep the threshold from 1 down to 0
  noFill();
  stroke(SLATE);
  strokeWeight(2);
  beginShape();
  for (let i = 100; i >= 0; i--) {
    const t = i / 100;
    vertex(rocLeft + fractionAbove(t, BENIGN_MEAN, m.sigma) * rocSize,
      rocTop + rocSize - fractionAbove(t, MALICIOUS_MEAN, m.sigma) * rocSize);
  }
  endShape();
  strokeWeight(1);

  // the operating point for the current threshold
  stroke('white');
  fill(MALICIOUS_ORANGE);
  circle(rocLeft + m.fpr * rocSize, rocTop + rocSize - m.tpr * rocSize, 12);

  noStroke();
  fill(SLATE);
  textSize(13);
  textAlign(RIGHT, BOTTOM);
  text('ROC curve', rocLeft + rocSize - 5, rocTop + rocSize - 4);
  fill('black');
  textAlign(CENTER, TOP);
  text('False positive rate', rocLeft + rocSize / 2, rocTop + rocSize + 4);
  push();
  translate(rocLeft - 6, rocTop + rocSize / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, BOTTOM);
  text('True positive rate', 0, 0);
  pop();
}

function drawControlLabels(m) {
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  text('Threshold: ' + m.threshold.toFixed(2), 10, drawHeight + 56);
  text('Curve overlap (std dev): ' + m.sigma.toFixed(2), 10, drawHeight + 91);
  text('Daily traffic: ' + m.traffic.toLocaleString() + ' events', 10, drawHeight + 126);
}

// ---------- dragging the threshold line ----------

function overThresholdLine() {
  if (typeof thresholdSlider === 'undefined' || plotLeft === undefined) return false;
  const tx = scoreToX(thresholdSlider.value());
  return mouseY >= plotTop && mouseY <= plotBottom + 6 && abs(mouseX - tx) <= 12;
}

function setThresholdFromMouse() {
  const score = constrain((mouseX - plotLeft) / (plotRight - plotLeft), 0, 1);
  thresholdSlider.value(Math.round(score * 100) / 100);
}

function mousePressed() {
  if (overThresholdLine()) draggingThreshold = true;
}

function mouseDragged() {
  if (draggingThreshold) setThresholdFromMouse();
}

function mouseReleased() {
  draggingThreshold = false;
}

// ---------- responsive sizing ----------

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
  if (typeof trafficSlider !== 'undefined') {
    const sliderWidth = canvasWidth - sliderLeftMargin - margin;
    thresholdSlider.size(sliderWidth);
    overlapSlider.size(sliderWidth);
    trafficSlider.size(sliderWidth);

    // shorten the preset labels when the full text would not fit on one row
    const wide = canvasWidth >= 680;
    if (wide !== wideButtonLabels) {
      wideButtonLabels = wide;
      signatureButton.html(wide ? 'Preset: signature-style (high threshold)' : 'Signature preset');
      anomalyButton.html(wide ? 'Preset: anomaly-style (lower threshold)' : 'Anomaly preset');
    }
  }
}
