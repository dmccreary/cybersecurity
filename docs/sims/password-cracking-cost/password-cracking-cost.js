// CANVAS_HEIGHT: 560
// Password Cracking Cost — p5.js calculator MicroSim (Bloom: Analyze).
// Students analyze how each password-protection technique changes the time and
// dollar cost an attacker faces when cracking a stolen password database.
// Benchmark numbers are hard-coded, calibrated against published 2025 GPU
// benchmarks (order-of-magnitude figures for teaching, not an exact model).

let canvasWidth = 800;
let drawHeight = 430;
let controlHeight = 130;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let sliderLeftMargin = 215;
let defaultTextSize = 16;

let hashSelect, hardwareSlider, dbSlider, rainbowCheckbox;

// --- Hardware tiers: raw SHA-256 guesses per second (~2025 figures) ---
const hardwareTiers = [
  { name: '1 CPU',            short: '1 CPU',         rate: 2e7,  dollarsPerHour: 0.05 },
  { name: '1 GPU (RTX 4090)', short: '1 GPU',         rate: 2e10, dollarsPerHour: 0.40 },
  { name: '100-GPU farm',     short: '100-GPU farm',  rate: 2e12, dollarsPerHour: 40   },
  { name: 'ASIC cluster',     short: 'ASIC cluster',  rate: 5e13, dollarsPerHour: 200  }
];

// --- Database sizes ---
const dbSizes = [
  { name: '10K users',  n: 1e4 },
  { name: '100K users', n: 1e5 },
  { name: '1M users',   n: 1e6 },
  { name: '10M users',  n: 1e7 }
];

// --- Hash functions: workFactor = relative slowdown vs raw SHA-256 ---
// salted = whether per-account salt defeats a precomputed rainbow table.
const hashFns = [
  { name: 'SHA-256 (raw)',        work: 1,     salted: false, safe: false,
    why: 'Raw SHA-256 is a fast general-purpose hash: billions of guesses per second on a GPU, and no salt means one precomputed table cracks every reused password at once.' },
  { name: 'SHA-256 + salt',       work: 1,     salted: true,  safe: false,
    why: 'A unique salt per user defeats precomputed rainbow tables, but SHA-256 is still blazing fast per guess, so brute force and dictionary attacks remain cheap.' },
  { name: 'bcrypt (cost 10)',     work: 1e5,   salted: true,  safe: true,
    why: 'bcrypt is a deliberately slow, salted hash. Cost 10 means ~100,000x more work per guess than raw SHA-256, collapsing the attacker guess rate.' },
  { name: 'bcrypt (cost 12)',     work: 4e5,   salted: true,  safe: true,
    why: 'Each bcrypt cost increment doubles the work. Cost 12 is 4x slower than cost 10 - tune the cost as hardware gets faster.' },
  { name: 'Argon2id (64MB, t=3)', work: 2e6,   salted: true,  safe: true, memoryHard: true,
    why: 'Argon2id is memory-hard: each guess needs 64 MB of RAM, which strips GPUs and ASICs of their massive parallelism advantage. The 2015 Password Hashing Competition winner.' }
];

// Fraction of a real database whose passwords are weak enough to fall to a
// dictionary/brute attack within the modeled guess budget, and the average
// number of guesses spent per crackable account.
const WEAK_FRACTION = 0.25;
const GUESSES_PER_ACCOUNT = 1e9; // ~1 billion guesses covers large wordlists + rules

// Memory-hard hashes blunt GPU/ASIC parallelism: divide their effective rate.
const MEMORY_HARD_PENALTY = 1000;

let animRate = 0; // animated readout of guesses/sec

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  hashSelect = createSelect();
  hashFns.forEach(h => hashSelect.option(h.name));
  hashSelect.selected('SHA-256 (raw)');
  hashSelect.parent(document.querySelector('main'));
  hashSelect.position(sliderLeftMargin, drawHeight + 8);

  hardwareSlider = createSlider(0, hardwareTiers.length - 1, 1, 1);
  hardwareSlider.parent(document.querySelector('main'));
  hardwareSlider.position(sliderLeftMargin, drawHeight + 45);

  dbSlider = createSlider(0, dbSizes.length - 1, 2, 1);
  dbSlider.parent(document.querySelector('main'));
  dbSlider.position(sliderLeftMargin, drawHeight + 80);

  rainbowCheckbox = createCheckbox(' Show common-password rainbow attack', false);
  rainbowCheckbox.parent(document.querySelector('main'));
  rainbowCheckbox.position(10, drawHeight + 105);
  rainbowCheckbox.style('font-size', '14px');

  describe('A calculator showing how the choice of password hash, attacker ' +
    'hardware, and database size change the time and dollar cost to crack a ' +
    'stolen password database.', LABEL);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  hardwareSlider.size(canvasWidth - sliderLeftMargin - margin);
  dbSlider.size(canvasWidth - sliderLeftMargin - margin);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
  if (typeof hardwareSlider !== 'undefined') {
    hardwareSlider.size(canvasWidth - sliderLeftMargin - margin);
    dbSlider.size(canvasWidth - sliderLeftMargin - margin);
  }
}

function currentModel() {
  const hash = hashFns[hashFns.findIndex(h => h.name === hashSelect.value())];
  const hw = hardwareTiers[hardwareSlider.value()];
  const db = dbSizes[dbSlider.value()];
  const rainbow = rainbowCheckbox.checked();

  let effRate = hw.rate / hash.work;
  if (hash.memoryHard) effRate /= MEMORY_HARD_PENALTY;

  const crackable = db.n * WEAK_FRACTION;

  // Rainbow precomputation: only works on UNSALTED fast hashes.
  const rainbowApplies = rainbow && !hash.salted;

  // Total guesses to crack a given fraction of the database.
  function timeForFraction(frac) {
    if (rainbowApplies) return 0.001; // precomputed table -> effectively instant lookup
    const accounts = db.n * frac;
    const cap = Math.min(accounts, crackable); // beyond the weak fraction, cost explodes
    return (cap * GUESSES_PER_ACCOUNT) / effRate; // seconds
  }

  const t1 = timeForFraction(0.01);
  const t10 = timeForFraction(0.10);
  const t50 = timeForFraction(0.50);

  // Dollar cost to crack 1% of the database.
  const hours = t1 / 3600;
  const cost1 = rainbowApplies ? 0 : hours * hw.dollarsPerHour;

  return { hash, hw, db, rainbow, rainbowApplies, effRate, t1, t10, t50, cost1, crackable };
}

function fmtTime(s) {
  if (s < 0.01) return 'instant';
  if (s < 1) return s.toFixed(2) + ' s';
  if (s < 60) return s.toFixed(1) + ' s';
  if (s < 3600) return (s / 60).toFixed(1) + ' min';
  if (s < 86400) return (s / 3600).toFixed(1) + ' hours';
  if (s < 86400 * 365) return (s / 86400).toFixed(1) + ' days';
  const years = s / (86400 * 365);
  if (years < 1e6) return years.toExponential(1) + ' years';
  return years.toExponential(1) + ' years';
}

function fmtRate(r) {
  if (r >= 1e12) return (r / 1e12).toFixed(1) + ' T/s';
  if (r >= 1e9) return (r / 1e9).toFixed(1) + ' B/s';
  if (r >= 1e6) return (r / 1e6).toFixed(1) + ' M/s';
  if (r >= 1e3) return (r / 1e3).toFixed(1) + ' K/s';
  return r.toFixed(0) + ' /s';
}

function fmtDollars(d) {
  if (d <= 0) return '$0 (table lookup)';
  if (d < 0.01) return '< $0.01';
  if (d < 1000) return '$' + d.toFixed(2);
  if (d < 1e6) return '$' + (d / 1e3).toFixed(1) + 'K';
  if (d < 1e9) return '$' + (d / 1e6).toFixed(1) + 'M';
  return '$' + (d / 1e9).toExponential(1) + 'B';
}

function draw() {
  updateCanvasSize();
  const m = currentModel();

  // ease the animated rate readout toward the target, snapping when close so
  // the steady-state value shown is exact rather than perpetually approaching
  animRate += (m.effRate - animRate) * 0.18;
  if (Math.abs(m.effRate - animRate) < m.effRate * 0.02) animRate = m.effRate;

  // Drawing area
  fill('aliceblue'); stroke('silver'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  fill('black'); noStroke(); textSize(22); textAlign(CENTER, TOP);
  text('Password Cracking Cost: How Your Hash Choice Changes the Attack', canvasWidth / 2, 8);

  const safe = m.hash.safe && !m.rainbowApplies;
  const accentSafe = color('#1565c0');
  const accentUnsafe = color('#d84315');
  const accent = safe ? accentSafe : accentUnsafe;

  // Big guesses/sec readout
  textAlign(CENTER, TOP); noStroke();
  fill('#455a64'); textSize(15);
  text('Attacker effective guess rate', canvasWidth / 2, 44);
  fill(accent); textSize(40); textStyle(BOLD);
  text(fmtRate(animRate), canvasWidth / 2, 62);
  textStyle(NORMAL);
  fill('#455a64'); textSize(13);
  text(m.hw.name + '  using  ' + m.hash.name, canvasWidth / 2, 112);

  // Time-to-crack bars
  drawTimeBars(m, accent);

  // Cost estimator + footgun callout panel
  drawCostPanel(m, safe, accent);

  // Control labels
  noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(defaultTextSize);
  text('Hash function:', 10, drawHeight + 20);
  text('Hardware: ' + m.hw.short, 10, drawHeight + 57);
  text('Database: ' + m.db.name, 10, drawHeight + 92);
}

function drawTimeBars(m, accent) {
  const x0 = 40;
  const top = 140;
  const barH = 30;
  const gap = 22;
  const maxW = canvasWidth - x0 - 250;
  const rows = [
    { label: 'Crack 1% of DB', t: m.t1 },
    { label: 'Crack 10% of DB', t: m.t10 },
    { label: 'Crack 50% of DB', t: m.t50 }
  ];
  // log scale: map seconds (0.001 .. 1e16) -> 0..1
  const logMin = -3, logMax = 16;
  textAlign(LEFT, CENTER); textSize(14); noStroke();
  fill('#455a64');
  text('Time to crack (logarithmic scale)', x0, top - 16);
  rows.forEach((r, i) => {
    const y = top + 10 + i * (barH + gap);
    // track
    noStroke(); fill('#eceff1'); rect(x0, y, maxW, barH, 4);
    let frac;
    if (r.t < 0.01) frac = 0.02;
    else {
      const lg = Math.log10(r.t);
      frac = Math.max(0.02, Math.min(1, (lg - logMin) / (logMax - logMin)));
    }
    fill(accent); rect(x0, y, maxW * frac, barH, 4);
    noStroke(); fill('black'); textAlign(LEFT, CENTER); textSize(14);
    text(r.label, x0, y - 12);
    fill('white'); textAlign(LEFT, CENTER);
    // value label: place inside if bar wide enough, else to the right
    const valTxt = fmtTime(r.t);
    if (maxW * frac > 120) {
      text(valTxt, x0 + 8, y + barH / 2);
    } else {
      fill('#212529');
      text(valTxt, x0 + maxW * frac + 8, y + barH / 2);
    }
  });
}

function drawCostPanel(m, safe, accent) {
  const pw = 220;
  const px = canvasWidth - pw - 20;
  const py = 138;
  const ph = 270;
  noStroke(); fill(255, 255, 255, 235); stroke('#cbd5e1');
  rect(px, py, pw, ph, 10);

  noStroke(); textAlign(LEFT, TOP);
  fill('#455a64'); textSize(13);
  text('Cloud-GPU cost to crack 1% of the database', px + 12, py + 12, pw - 24);
  fill(accent); textSize(26); textStyle(BOLD);
  text(fmtDollars(m.cost1), px + 12, py + 52);
  textStyle(NORMAL);

  // verdict
  fill(safe ? '#1565c0' : '#d84315'); textSize(14); textStyle(BOLD);
  text(safe ? 'Defensible configuration' : 'INSECURE configuration', px + 12, py + 96, pw - 24);
  textStyle(NORMAL);
  fill('#334155'); textSize(12.5);
  let msg;
  if (m.rainbowApplies) {
    msg = 'No salt + a fast hash means a precomputed rainbow table cracks every reused password almost instantly. This is a footgun. Add a unique salt and a slow hash.';
  } else if (!m.hash.safe) {
    msg = 'A fast hash (even salted) lets cheap hardware brute-force weak passwords. Use a slow, memory-hard hash for stored passwords.';
  } else {
    msg = 'A slow, salted hash makes mass cracking time- and cost-prohibitive. Each guess is expensive, so only a few weak passwords ever fall.';
  }
  text(msg, px + 12, py + 118, pw - 24);

  // why-this-speed note
  fill('#455a64'); textSize(11.5);
  text(m.hash.why, px + 12, py + 196, pw - 24);
}
