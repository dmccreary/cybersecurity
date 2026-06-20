// CANVAS_HEIGHT: 605
// ICS Attack Path Explorer
// Bloom: Apply -> Analyze. A student starts with an attacker at Purdue Level 5
// (Enterprise IT) and toggles segmentation controls (DMZ broker, allowlisting,
// MFA jump host, read-only historian, disable RDP). Running the attack animates
// a red token attempting to descend toward the Level 1 PLCs; each enabled
// control lengthens the path, raises time-to-compromise, or blocks the descent
// entirely. Live readouts (path length, time to compromise, blast radius) and a
// narration log let the student analyze how defense-in-depth shrinks blast radius.

let canvasWidth = 900;
let drawHeight = 480;
let controlHeight = 125;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

// brand palette
const C_BLUE = '#1565c0';   // OT
const C_SLATE = '#455a64';  // IT
const C_ORANGE = '#ffa000'; // DMZ
const C_RED = '#d84315';    // attacker
const C_CREAM = '#fff8e1';

let skillSlider, runButton, resetButton;
let chkDmz, chkAllowlist, chkMfa, chkHistorian, chkRdp;

let mouseOverCanvas = false;

// Purdue levels, top (Level 5) to bottom (Level 0). x/w/h set in layout().
// reachable = whether attacker can currently occupy this level given defenses.
let levels = [];

// attack run state
let running = false;
let attackerLevel = 5;     // current band index the attacker token occupies
let attackerY = 0;         // pixel y of the token (animated)
let hopProgress = 0;       // 0..1 progress of the current hop
let blocked = false;       // attack contained
let logLines = [];         // narration
let result = null;         // {pathLen, timeStr, blast}
let frameTick = 0;

// Computed plan (which bands the attacker can step through) — recomputed each run.
let plan = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);
  const m = document.querySelector('main');

  // Defense checkboxes live in the right panel, over the drawing area.
  chkDmz = createCheckbox(' DMZ Broker (Level 3.5)', false); chkDmz.parent(m);
  chkAllowlist = createCheckbox(' Allowlist on Eng. Workstation', false); chkAllowlist.parent(m);
  chkMfa = createCheckbox(' MFA Jump Host', false); chkMfa.parent(m);
  chkHistorian = createCheckbox(' Read-Only Historian', false); chkHistorian.parent(m);
  chkRdp = createCheckbox(' Disable RDP at Level 2', false); chkRdp.parent(m);
  [chkDmz, chkAllowlist, chkMfa, chkHistorian, chkRdp].forEach(c => {
    c.style('font-size', '13px');
    c.style('color', '#263238');
    c.changed(planChanged);
  });

  // Control region: Run / Reset buttons + Attacker Skill slider.
  runButton = createButton('Run Attack'); runButton.parent(m);
  runButton.mousePressed(startRun);
  runButton.style('font-size', '14px');

  resetButton = createButton('Reset'); resetButton.parent(m);
  resetButton.mousePressed(resetAll);
  resetButton.style('font-size', '14px');

  skillSlider = createSlider(0, 10, 5, 1); skillSlider.parent(m);

  layout();
  resetAll();
  describe('Interactive ICS attack-path explorer: a six-band Purdue network with an ' +
    'attacker at Level 5. Toggle segmentation controls and run the attack to see how ' +
    'the path length, time to compromise, and blast radius at the Level 1 PLCs change.',
    LABEL);
}

// Geometry: left ~58% of canvas is the Purdue stack; right is the panel.
let stackX, stackW, panelX, panelW, bandH, bandTop;
function layout() {
  stackX = margin;
  stackW = canvasWidth * 0.56 - margin;
  panelX = canvasWidth * 0.56 + 6;
  panelW = canvasWidth - panelX - margin;

  bandTop = 56;
  const bandsArea = drawHeight - bandTop - 14;
  bandH = bandsArea / 6;

  const defs = [
    { name: 'Level 5 — Enterprise IT', col: C_SLATE, txt: 'white',
      devices: ['ERP', 'Email', 'Workstations'] },
    { name: 'Level 4 — Business / DMZ Edge', col: C_SLATE, txt: 'white',
      devices: ['Patch Server', 'Eng. Workstation'] },
    { name: 'Level 3.5 — Industrial DMZ', col: C_ORANGE, txt: '#3a2a00',
      devices: ['Data Broker', 'Historian Replica', 'Jump Host'] },
    { name: 'Level 3 — Operations / Historian', col: C_BLUE, txt: 'white',
      devices: ['Historian', 'Domain Ctrl', 'Eng. Tools'] },
    { name: 'Level 2 — Supervisory (SCADA/HMI)', col: C_BLUE, txt: 'white',
      devices: ['SCADA', 'HMI', 'OPC Server'] },
    { name: 'Level 1 — Control (PLCs / RTUs)', col: C_BLUE, txt: 'white',
      devices: ['PLC-1', 'PLC-2', 'RTU', 'Safety PLC'] }
  ];
  levels = defs.map((d, i) => ({
    idx: i, ...d,
    y: bandTop + i * bandH, h: bandH - 6
  }));
  positionControls();
}

function positionControls() {
  const px = panelX + 10;
  const cy = bandTop + 18;
  chkDmz.position(px, cy);
  chkAllowlist.position(px, cy + 26);
  chkMfa.position(px, cy + 52);
  chkHistorian.position(px, cy + 78);
  chkRdp.position(px, cy + 104);

  runButton.position(margin, drawHeight + 14);
  resetButton.position(margin + 110, drawHeight + 14);
  const skX = margin + 300;
  skillSlider.position(skX, drawHeight + 18);
  skillSlider.size(canvasWidth - skX - margin);
}

function planChanged() {
  // Toggling a control after a run invalidates the displayed result.
  if (!running) { result = null; logLines = []; }
}

// --- Attack model -----------------------------------------------------------
// Returns a plan: ordered list of {level, blockedBy, narrate, extraHops, mins}.
// Attacker descends from Level 5 toward Level 1. Each control either adds hops,
// adds time, or blocks the descent at a boundary.
function computePlan() {
  const skill = skillSlider.value();           // 0..10
  const dmz = chkDmz.checked();
  const allow = chkAllowlist.checked();
  const mfa = chkMfa.checked();
  const hist = chkHistorian.checked();
  const rdp = chkRdp.checked();

  const steps = [];
  let hops = 0;
  let minutes = 0;
  let log = [];
  let containedAt = null;   // level index where attacker is contained (cannot go below)

  // Helper: a control "holds" if the attacker's skill cannot beat it.
  // Strong controls (mfa, dmz, allowlist) need high skill to bypass; weak ones leak.
  const beats = (threshold) => skill >= threshold;

  // Start: Level 5 (already compromised foothold).
  steps.push({ level: 0 }); hops++;
  log.push('Foothold established at Level 5 (Enterprise IT) via phishing.');

  // 5 -> 4
  steps.push({ level: 1 }); hops++; minutes += 20;
  log.push('Pivot to Level 4: harvested credentials reused on patch server.');

  // 4 -> 3.5 (Industrial DMZ). DMZ broker is the key boundary control.
  if (dmz && !beats(9)) {
    containedAt = 1;
    log.push('DMZ broker forced session termination — no direct route to OT. ' +
             'Attacker must re-authenticate through the broker and is stopped at Level 4.');
  } else {
    if (dmz) { minutes += 90; hops++; log.push('DMZ broker slowed the attacker (re-auth required), but skill ' + skill + ' bypassed it.'); }
    steps.push({ level: 2 }); hops++; minutes += 30;
    if (!dmz) log.push('No DMZ broker: attacker crossed the IT/OT boundary directly into Level 3.5.');

    // 3.5 -> 3 (Operations / Historian)
    if (hist && !beats(8)) {
      // Read-only historian denies a write path but a determined attacker may
      // still read; descent to Level 3 is allowed but blast radius later shrinks.
      log.push('Historian is read-only: attacker can read process data but cannot ' +
               'use it to push commands. Tradecraft slowed.');
      minutes += 40;
    }
    steps.push({ level: 3 }); hops++; minutes += 25;
    log.push('Reached Level 3 (Operations). Mapping historian and engineering tools.');

    // 3 -> 2 (Supervisory). Allowlisting on the engineering workstation is the gate.
    if (allow && !beats(8)) {
      containedAt = 3;
      log.push('Application allowlisting blocked the attacker\'s tooling on the ' +
               'engineering workstation — no execution into Level 2. Contained in Operations.');
    } else {
      if (allow) { minutes += 60; hops++; log.push('Allowlisting slowed the attacker; a living-off-the-land technique bypassed it.'); }
      steps.push({ level: 4 }); hops++; minutes += 35;

      // 2 -> 1 (Control / PLCs). MFA jump host + disabled RDP are the last gates.
      const lastGateThreshold = (mfa ? 4 : 0) + (rdp ? 3 : 0);
      if ((mfa || rdp) && !beats(lastGateThreshold)) {
        containedAt = 4;
        let why = [];
        if (mfa) why.push('MFA jump host required a second factor the attacker lacks');
        if (rdp) why.push('RDP disabled at Level 2 removed the lateral-movement protocol');
        log.push(why.join('; ') + '. Attacker cannot reach the PLCs — contained at Level 2.');
      } else {
        if (mfa || rdp) { minutes += 50; hops++; log.push('Jump-host / RDP controls slowed the final hop but high skill defeated them.'); }
        steps.push({ level: 5 }); hops++; minutes += 45;
        log.push('Attacker reached Level 1 — direct access to PLCs. Process integrity at risk.');
      }
    }
  }

  // Blast radius = how many Level-1 devices are reachable.
  const l1Devices = levels[5].devices.length;
  let blast = 0;
  const reachedL1 = (containedAt === null);
  if (reachedL1) {
    blast = hist ? Math.max(1, l1Devices - 1) : l1Devices; // read-only historian protects safety PLC
  }

  return {
    steps, hops, minutes, log,
    containedAt,
    pathLen: hops,
    timeMin: minutes,
    blast,
    reachedL1
  };
}

function startRun() {
  plan = computePlan();
  running = true;
  blocked = false;
  attackerLevel = 0;
  attackerY = levels[0].y + levels[0].h / 2;
  hopProgress = 0;
  result = null;
  logLines = [];
  frameTick = 0;
}

function resetAll() {
  running = false;
  blocked = false;
  attackerLevel = 5;
  result = null;
  logLines = [];
  plan = [];
  attackerY = levels.length ? levels[0].y + levels[0].h / 2 : 80;
}

function fmtTime(min) {
  if (min < 60) return min + ' min';
  const h = (min / 60);
  return (Math.round(h * 10) / 10) + ' h';
}

// --- Drawing ----------------------------------------------------------------
function draw() {
  updateCanvasSize();

  // Backgrounds
  noStroke();
  fill('aliceblue'); stroke('silver'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke(); fill('black'); textSize(22); textAlign(CENTER, TOP);
  text('ICS Attack Path Explorer', canvasWidth / 2, 12);
  textSize(13); fill(C_SLATE);
  text('Purdue-model segmentation: toggle controls, then Run Attack to see path length & blast radius',
       canvasWidth / 2, 36);

  drawStack();
  drawPanel();

  // advance the animation only on mouse-over (or while a fresh run resolves)
  if (running) advanceRun();

  drawControlLabels();
}

function drawStack() {
  textAlign(LEFT, CENTER);
  for (const lv of levels) {
    // band
    stroke('white'); strokeWeight(1);
    fill(lv.col);
    rect(stackX, lv.y, stackW, lv.h, 6);
    // band title
    noStroke(); fill(lv.txt); textSize(13);
    textAlign(LEFT, TOP);
    text(lv.name, stackX + 10, lv.y + 6);
    // devices as small chips
    textAlign(LEFT, CENTER);
    textSize(11);
    let cx = stackX + 12;
    const cyy = lv.y + lv.h - 14;
    for (const d of lv.devices) {
      const w = textWidth(d) + 12;
      fill(255, 255, 255, 60); noStroke();
      rect(cx, cyy - 9, w, 17, 4);
      fill(lv.txt);
      text(d, cx + 6, cyy);
      cx += w + 6;
    }
  }

  // attacker token
  if (running || result) {
    const yy = attackerY;
    const tx = stackX + stackW - 26;
    // glow
    noStroke();
    fill(216, 67, 21, 60); circle(tx, yy, 30);
    fill(C_RED); circle(tx, yy, 18);
    fill('white'); textAlign(CENTER, CENTER); textSize(12); noStroke();
    text('A', tx, yy);
  }

  // "Attacker start" marker
  if (!running && !result) {
    noStroke(); fill(C_RED); textSize(12); textAlign(RIGHT, CENTER);
    const sy = levels[0].y + levels[0].h / 2;
    fill(216, 67, 21, 60); circle(stackX + stackW - 26, sy, 30);
    fill(C_RED); circle(stackX + stackW - 26, sy, 18);
    fill('white'); textAlign(CENTER, CENTER); textSize(12);
    text('A', stackX + stackW - 26, sy);
  }
}

function drawPanel() {
  // Panel header
  noStroke(); fill(C_BLUE); textSize(15); textAlign(LEFT, TOP);
  text('Segmentation Controls', panelX + 4, bandTop - 6);

  // readout box (below checkboxes)
  const ry = bandTop + 150;
  fill(255); stroke('#cfd8dc'); rect(panelX, ry, panelW, 96, 8);
  noStroke(); fill('black'); textAlign(LEFT, TOP); textSize(14);
  text('Result', panelX + 10, ry + 8);

  textSize(13);
  const r = result;
  fill('#263238');
  text('Path length: ' + (r ? r.pathLen + ' hops' : '—'), panelX + 10, ry + 30);
  text('Time to compromise: ' + (r ? fmtTime(r.timeMin) : '—'), panelX + 10, ry + 50);
  // blast radius with color cue
  const blastTxt = r ? (r.reachedL1 ? r.blast + ' / ' + levels[5].devices.length + ' PLCs' : 'CONTAINED') : '—';
  fill(r ? (r.reachedL1 ? C_RED : '#2e7d32') : '#263238');
  text('Blast radius: ' + blastTxt, panelX + 10, ry + 70);

  // narration log
  const ly = ry + 104;
  noStroke(); fill(C_SLATE); textSize(13); textAlign(LEFT, TOP);
  text('Narration', panelX + 4, ly);
  fill(C_CREAM); stroke('#e0cfa0');
  const logH = drawHeight - (ly + 20) - 6;
  rect(panelX, ly + 18, panelW, logH, 8);
  noStroke(); fill('#3a2a00'); textSize(11.5); textAlign(LEFT, TOP);
  let yy = ly + 26;
  const shown = logLines.slice(-7);
  for (const line of shown) {
    yy = wrapText('• ' + line, panelX + 8, yy, panelW - 16, 14);
    yy += 3;
  }
  if (shown.length === 0) {
    fill('#7a6a40');
    text('Toggle controls and press Run Attack.', panelX + 8, yy);
  }
}

function advanceRun() {
  frameTick++;
  // reveal narration progressively
  const revealEvery = 14;
  const linesToShow = Math.min(plan.log.length, Math.floor(frameTick / revealEvery) + 1);
  logLines = plan.log.slice(0, linesToShow);

  // move token toward the deepest reached band
  const targetIdx = plan.steps[plan.steps.length - 1].level;
  const targetY = levels[targetIdx].y + levels[targetIdx].h / 2;
  attackerY += (targetY - attackerY) * 0.08;

  // when settled and all log revealed, finalize
  if (linesToShow >= plan.log.length && Math.abs(attackerY - targetY) < 1.2) {
    attackerY = targetY;
    running = false;
    result = plan;
  }
}

function drawControlLabels() {
  noStroke();
  textAlign(LEFT, CENTER);
  fill('black'); textSize(13);
  text('Attacker Skill: ' + skillSlider.value() + ' / 10',
       margin + 192, drawHeight + 26);
  fill(C_SLATE); textSize(11.5);
  text('(0 = script kiddie, 10 = nation-state). Higher skill bypasses weaker controls.',
       margin, drawHeight + 56);
  text('Solid controls (DMZ broker, allowlisting, MFA + disabled RDP) form the IT/OT chokepoints. ' +
       'Stack them for defense in depth.', margin, drawHeight + 80);
}

// word-wrap helper for the narration panel; returns the new y after drawing.
function wrapText(str, x, y, maxW, lineH) {
  const words = str.split(' ');
  let line = '';
  for (const w of words) {
    const test = line + w + ' ';
    if (textWidth(test) > maxW && line.length > 0) {
      text(line, x, y); y += lineH; line = w + ' ';
    } else { line = test; }
  }
  text(line, x, y); y += lineH;
  return y;
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
  }
}
