// CANVAS_HEIGHT: 520
// Adversarial Example Explorer — p5.js MicroSim
// Learning objective (Bloom: Analyze): explain why a model's decision boundary
// admits adversarial examples by manipulating an input and watching the
// classifier's confidence change.
//
// Model note: this is NOT a live neural network. The "logits" are a small
// hand-tuned linear scoring function over a 28x28 grayscale digit. A
// precomputed gradient-sign vector (the sign of dLoss/dInput for a chosen
// target class) is hardcoded for two demonstration targets. Adding
// (epsilon * sign-vector) to the image is exactly the Fast Gradient Sign
// Method (FGSM). This is enough to reproduce the qualitative phenomenon:
// a perturbation that is nearly invisible to a human flips the classifier.

let canvasWidth = 800;
let drawHeight = 440;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 250;
let defaultTextSize = 16;

// Brand palette (named where p5 has names; hex for brand colors)
const COLOR_CORRECT = '#1565c0'; // cybersecurity blue — confident & correct
const COLOR_TARGET  = '#ffa000'; // alert accent — adversarial target
const COLOR_OTHER   = '#455a64'; // slate steel — non-target classes

const GRID = 28; // 28x28 "digit"

// Controls
let magSlider;       // perturbation magnitude epsilon (0.0 .. 0.3)
let targetSelect;    // target class dropdown 0..9
let applyButton;     // apply adversarial perturbation (latches epsilon)
let resetButton;     // restore original
let noiseOnlyCheckbox; // show perturbation only (10x magnified)
let whyButton;       // toggle "Why?" explanation

// State
let baseImage = [];      // GRID*GRID floats in [0,1] — the clean digit "3"
let signVectors = {};    // target class -> GRID*GRID in {-1,0,+1}
let appliedEpsilon = 0;  // epsilon committed by the Apply button
let liveEpsilon = 0;     // epsilon from slider (previewed live)
let showWhy = false;

let mouseOverCanvas = false;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  buildBaseImage();
  buildSignVectors();

  // Row 1: magnitude slider + target select
  magSlider = createSlider(0, 0.3, 0.0, 0.01);
  magSlider.parent(document.querySelector('main'));
  magSlider.position(sliderLeftMargin, drawHeight + 8);
  magSlider.size(canvasWidth - sliderLeftMargin - 200);

  targetSelect = createSelect();
  targetSelect.parent(document.querySelector('main'));
  for (let d = 0; d <= 9; d++) targetSelect.option('Target class ' + d, d);
  targetSelect.selected('8');
  targetSelect.position(canvasWidth - 175, drawHeight + 8);

  // Row 2: buttons + checkbox
  applyButton = createButton('Apply adversarial perturbation');
  applyButton.parent(document.querySelector('main'));
  applyButton.position(10, drawHeight + 45);
  applyButton.mousePressed(() => { appliedEpsilon = magSlider.value(); });

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.position(258, drawHeight + 45);
  resetButton.mousePressed(resetSim);

  noiseOnlyCheckbox = createCheckbox(' Show perturbation only (10x)', false);
  noiseOnlyCheckbox.parent(document.querySelector('main'));
  noiseOnlyCheckbox.position(322, drawHeight + 47);

  whyButton = createButton('Why?');
  whyButton.parent(document.querySelector('main'));
  whyButton.position(canvasWidth - 70, drawHeight + 45);
  whyButton.mousePressed(() => { showWhy = !showWhy; });

  describe('Adversarial example explorer: a hand-drawn digit 3 on the left and a '
    + 'live bar chart of ten classifier confidence scores on the right. A slider '
    + 'adds an imperceptible gradient-sign perturbation toward a target class; '
    + 'past a threshold the classifier flips to the target while the digit still '
    + 'looks like a 3.', LABEL);
}

function draw() {
  updateCanvasSize();

  // Backgrounds
  noStroke();
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Effective epsilon: slider value previews live; Apply latches it.
  liveEpsilon = magSlider.value();
  const epsilon = max(liveEpsilon, appliedEpsilon);
  const target = int(targetSelect.value());

  // Compute the perturbed image and the classifier scores.
  const sign = signVectors[target] || signVectors[8];
  const perturbed = applyPerturbation(baseImage, sign, epsilon);
  const scores = classify(perturbed);
  const probs = softmax(scores);
  const predicted = argmax(probs);

  // Title (offset left because the right side holds the bar chart)
  noStroke();
  fill('black');
  textSize(22);
  textAlign(CENTER, TOP);
  text('Adversarial Example Explorer', canvasWidth / 2, 8);
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);

  // Responsive: stack panels vertically below 700px
  const stacked = canvasWidth < 700;
  if (stacked) {
    drawDigitPanel(20, 44, min(220, canvasWidth - 40), perturbed, sign, epsilon);
    drawBarChart(20, 290, canvasWidth - 40, drawHeight - 300, probs, predicted, target);
  } else {
    const digitSize = 300;
    drawDigitPanel(30, 60, digitSize, perturbed, sign, epsilon);
    drawBarChart(360, 60, canvasWidth - 360 - 20, 340, probs, predicted, target);
  }

  // Annotation about L-infinity norm and human visibility
  drawAnnotation(epsilon, predicted, target, stacked);

  // Why? explanation
  if (showWhy) drawWhyPanel(stacked);

  // Control labels
  drawControlLabels(epsilon);
}

// ---- Drawing helpers -------------------------------------------------------

function drawDigitPanel(x, y, size, perturbed, sign, epsilon) {
  const cell = size / GRID;
  const showNoiseOnly = noiseOnlyCheckbox.checked();

  // Panel label
  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text(showNoiseOnly ? 'Perturbation only (10x magnified)' : 'Input image (28x28)', x, y - 4);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);

  // Pixels
  noStroke();
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const i = r * GRID + c;
      let v;
      if (showNoiseOnly) {
        // Show the signed perturbation, magnified 10x, centered at gray.
        const noise = sign[i] * epsilon * 10; // [-1..1]-ish
        v = 0.5 + noise * 0.5;
      } else {
        v = perturbed[i];
      }
      v = constrain(v, 0, 1);
      const g = 255 * (1 - v); // 1 -> black ink, 0 -> white paper
      fill(g);
      rect(x + c * cell, y + r * cell, cell + 0.5, cell + 0.5);
    }
  }
  // Border
  noFill();
  stroke('#455a64');
  strokeWeight(1.5);
  rect(x, y, size, size);
  strokeWeight(1);
}

function drawBarChart(x, y, w, h, probs, predicted, target) {
  const n = probs.length;
  const rowH = h / n;
  const barMax = w - 110; // leave room for label + percentage

  noStroke();
  fill('black');
  textSize(14);
  textAlign(LEFT, BOTTOM);
  text('Classifier confidence by digit class', x, y - 4);
  textSize(defaultTextSize);

  for (let d = 0; d < n; d++) {
    const cy = y + d * rowH + rowH / 2;
    // class label
    noStroke();
    fill('black');
    textAlign(RIGHT, CENTER);
    text(d, x + 26, cy);

    // bar
    const bw = barMax * probs[d];
    let col = COLOR_OTHER;
    if (d === predicted && d !== target) col = COLOR_CORRECT;
    if (d === predicted && d === target) col = COLOR_TARGET; // attack succeeded
    if (d === target && d !== predicted) col = COLOR_TARGET;
    fill(col);
    rect(x + 38, cy - rowH * 0.32, bw, rowH * 0.64, 3);

    // percentage
    fill('black');
    textAlign(LEFT, CENTER);
    text(nf(probs[d] * 100, 0, 1) + '%', x + 38 + bw + 6, cy);
  }
  textAlign(LEFT, CENTER);
}

function drawAnnotation(epsilon, predicted, target, stacked) {
  const linf = epsilon; // L-infinity norm of the perturbation == epsilon
  const human = epsilon < 0.04 ? 'none' : epsilon < 0.12 ? 'barely' : 'faint speckle';
  const msg = 'Perturbation Linf norm: ' + nf(linf, 0, 2)
    + '  |  Human-visible: ' + human
    + '  |  Classifier: ' + (predicted === target ? "confident '" + target + "'"
                                                   : "still '" + predicted + "'");
  noStroke();
  fill(255, 255, 255, 235);
  stroke('#455a64');
  const ax = 20;
  const ay = stacked ? drawHeight - 26 : drawHeight - 30;
  const aw = canvasWidth - 40;
  rect(ax, ay, aw, 22, 6);
  noStroke();
  fill(predicted === target ? '#b26a00' : 'black');
  textSize(13);
  textAlign(LEFT, CENTER);
  text(msg, ax + 8, ay + 11);
  textSize(defaultTextSize);
}

function drawWhyPanel(stacked) {
  const w = min(420, canvasWidth - 60);
  const x = canvasWidth - w - 20;
  const y = stacked ? 44 : 60;
  noStroke();
  fill(255, 255, 250, 245);
  stroke('#ffa000');
  strokeWeight(1.5);
  rect(x, y, w, 110, 8);
  strokeWeight(1);
  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, TOP);
  const txt = 'Why? FGSM nudges every pixel a tiny step in the direction of '
    + 'sign(∇ₓ loss) for the target class. Each pixel moves only ε, so the '
    + 'image barely changes, but the steps add up across hundreds of pixels in '
    + 'the exact direction the decision boundary is most sensitive to — so the '
    + 'logits flip.';
  text(txt, x + 8, y + 8, w - 16, 100);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
}

function drawControlLabels(epsilon) {
  noStroke();
  fill('black');
  textSize(defaultTextSize);
  textAlign(LEFT, CENTER);
  text('Perturbation magnitude (ε): ' + nf(magSlider.value(), 0, 2), 10, drawHeight + 18);
}

// ---- Model -----------------------------------------------------------------

function applyPerturbation(img, sign, epsilon) {
  const out = new Array(img.length);
  for (let i = 0; i < img.length; i++) {
    out[i] = constrain(img[i] + sign[i] * epsilon, 0, 1);
  }
  return out;
}

// Linear "classifier": score_d = bias_d + scale * dot(img, weight_d).
// weight[3] is the clean digit itself (so the clean image scores as "3"); the
// other classes get discriminative weight maps. Hand-tuned so the clean digit
// reads as "3" at ~95% and a bounded FGSM step toward the target flips it.
let classWeights = null;
const SCORE_SCALE = 0.18;

function classify(img) {
  if (!classWeights) buildTemplates();
  const scores = new Array(10).fill(0);
  for (let d = 0; d < 10; d++) {
    let s = 0;
    const w = classWeights[d];
    for (let i = 0; i < img.length; i++) s += img[i] * w[i];
    scores[d] = s * SCORE_SCALE + biasFor(d);
  }
  return scores;
}

function biasFor(d) {
  // Bias so the clean image is confidently "3".
  if (d === 3) return 2.2;
  return 0;
}

function softmax(scores) {
  const m = Math.max(...scores);
  const exps = scores.map(s => Math.exp(s - m));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
}

function argmax(arr) {
  let bi = 0;
  for (let i = 1; i < arr.length; i++) if (arr[i] > arr[bi]) bi = i;
  return bi;
}

// ---- Data construction -----------------------------------------------------

function resetSim() {
  appliedEpsilon = 0;
  magSlider.value(0);
  noiseOnlyCheckbox.checked(false);
}

// A blocky, hand-drawn-looking "3" rendered into a 28x28 float grid.
function buildBaseImage() {
  baseImage = new Array(GRID * GRID).fill(0);
  const strokes = [
    // top horizontal bar
    [6, 8], [7, 8], [8, 8], [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8], [15, 8], [16, 8], [17, 8],
    [16, 9], [17, 9], [18, 9],
    // upper right curve
    [18, 10], [19, 10], [18, 11], [19, 11], [18, 12], [19, 12], [17, 13], [18, 13],
    // middle bar
    [9, 13], [10, 13], [11, 13], [12, 13], [13, 13], [14, 13], [15, 13], [16, 13],
    [10, 14], [11, 14], [12, 14], [13, 14], [14, 14], [15, 14],
    // lower right curve
    [16, 15], [17, 15], [18, 15], [18, 16], [19, 16], [18, 17], [19, 17], [18, 18], [19, 18],
    [17, 19], [18, 19],
    // bottom bar
    [6, 20], [7, 20], [8, 20], [9, 20], [10, 20], [11, 20], [12, 20], [13, 20], [14, 20], [15, 20], [16, 20], [17, 20],
    [7, 19], [8, 19],
  ];
  for (const [c, r] of strokes) {
    if (r >= 0 && r < GRID && c >= 0 && c < GRID) baseImage[r * GRID + c] = 1;
  }
  // Soften edges slightly so it reads as ink, not a bitmap.
  baseImage = blur(baseImage);
  buildTemplates();
}

function blur(img) {
  const out = img.slice();
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      let sum = 0, cnt = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const rr = r + dr, cc = c + dc;
          if (rr >= 0 && rr < GRID && cc >= 0 && cc < GRID) { sum += img[rr * GRID + cc]; cnt++; }
        }
      }
      out[r * GRID + c] = (img[r * GRID + c] * 0.6) + (sum / cnt) * 0.4;
    }
  }
  return out;
}

function buildTemplates() {
  // Weight maps for the linear classifier. weight[3] is the clean digit, so the
  // clean image scores highest as a "3". Class 8 is the only other class with a
  // strong positive weight on the left-side column (the ink a closed "8" has and
  // an open "3" lacks); class 5 favours a flat top-left. The remaining classes
  // get a faint copy of the digit so their bars are non-zero but small.
  classWeights = [];
  for (let d = 0; d < 10; d++) classWeights.push(new Array(GRID * GRID).fill(0));
  classWeights[3] = baseImage.slice();

  // "8": rewards the closed left side that a 3 lacks.
  const w8 = baseImage.map(v => v * 0.5);
  for (let r = 8; r <= 20; r++) {
    w8[r * GRID + 3] = 2.0; w8[r * GRID + 4] = 2.0; w8[r * GRID + 5] = 2.0;
    w8[r * GRID + 6] = 2.0; w8[r * GRID + 7] = 1.6;
  }
  classWeights[8] = w8;

  // "5": rewards a vertical left stroke in the top half + a flat top bar.
  const w5 = baseImage.map(v => v * 0.5);
  for (let r = 8; r <= 14; r++) {
    w5[r * GRID + 4] = 2.0; w5[r * GRID + 5] = 2.0; w5[r * GRID + 6] = 2.0;
  }
  classWeights[5] = w5;

  for (let d = 0; d < 10; d++) {
    if (d === 3 || d === 8 || d === 5) continue;
    for (let i = 0; i < GRID * GRID; i++) classWeights[d][i] = baseImage[i] * 0.35;
  }
}

function buildSignVectors() {
  // The FGSM perturbation is sign(gradient of the loss w.r.t. the input). For a
  // linear model the gradient of (logit_target - logit_3) w.r.t. the input is
  // exactly (weight_target - weight_3), so the precomputed sign vector below IS
  // that gradient sign — this is faithful FGSM, not a cosmetic overlay.
  if (!classWeights) buildTemplates();
  for (let d = 0; d <= 9; d++) {
    const wt = (d === 3) ? classWeights[8] : classWeights[d]; // self-target -> use 8
    const sign = new Array(GRID * GRID);
    for (let i = 0; i < GRID * GRID; i++) {
      const g = wt[i] - classWeights[3][i];
      sign[i] = g > 0.05 ? 1 : (g < -0.05 ? -1 : 0);
    }
    signVectors[d] = sign;
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  if (typeof magSlider !== 'undefined') {
    magSlider.size(canvasWidth - sliderLeftMargin - 200);
    targetSelect.position(canvasWidth - 175, drawHeight + 8);
    whyButton.position(canvasWidth - 70, drawHeight + 45);
  }
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
    if (canvasWidth < 320) canvasWidth = 320;
  }
}
