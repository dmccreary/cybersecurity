// MITRE ATT&CK Tactic Sequence Explorer
// CANVAS_HEIGHT: 540
// Bloom: Analyze — students step through preset campaigns and identify which
// ATT&CK tactic each technique belongs to, reasoning about the earliest
// detection opportunity.

let canvasWidth = 900;
let drawHeight = 460;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

// Brand palette
const BLUE = '#1565c0';
const SLATE = '#455a64';
const CREAM = '#fff8e1';
const ALERT = '#ffa000';

// The 14 MITRE ATT&CK Enterprise tactics in kill-chain order.
// `full` is the proper name; `short` is a two-line label that fits a narrow column.
const TACTICS = [
  { short: ['Recon'],              full: 'Reconnaissance' },
  { short: ['Resource', 'Dev'],    full: 'Resource Development' },
  { short: ['Initial', 'Access'],  full: 'Initial Access' },
  { short: ['Exec'],               full: 'Execution' },
  { short: ['Persist'],            full: 'Persistence' },
  { short: ['Priv', 'Esc'],        full: 'Privilege Escalation' },
  { short: ['Defense', 'Evasion'], full: 'Defense Evasion' },
  { short: ['Cred', 'Access'],     full: 'Credential Access' },
  { short: ['Discovery'],          full: 'Discovery' },
  { short: ['Lateral', 'Move'],    full: 'Lateral Movement' },
  { short: ['Collect'],            full: 'Collection' },
  { short: ['C2'],                 full: 'Command and Control' },
  { short: ['Exfil'],              full: 'Exfiltration' },
  { short: ['Impact'],             full: 'Impact' }
];

// Scenarios: each technique references a tactic by index (0..13)
const SCENARIOS = {
  'Phishing -> Ransomware': [
    { id: 'T1566', name: 'Phishing', tactic: 2, desc: 'Spearphishing email with a malicious attachment delivered to a user.', detect: 'Inspect email attachments in a sandbox; flag macro-enabled docs.', detectable: true },
    { id: 'T1204', name: 'User Execution', tactic: 3, desc: 'Victim opens the attachment and enables macros, running the payload.', detect: 'Alert on Office spawning script interpreters (Word -> PowerShell).' },
    { id: 'T1547', name: 'Boot/Logon Autostart', tactic: 4, desc: 'Malware writes a Run key so it survives reboot.', detect: 'Monitor autorun registry keys with Sysmon event ID 13.' },
    { id: 'T1003', name: 'OS Credential Dumping', tactic: 7, desc: 'LSASS memory is scraped to harvest cached credentials.', detect: 'Detect non-system processes opening a handle to lsass.exe.' },
    { id: 'T1021', name: 'Remote Services (SMB)', tactic: 9, desc: 'Stolen creds are reused to move laterally via SMB/admin shares.', detect: 'Flag anomalous lateral SMB auth from a workstation.' },
    { id: 'T1486', name: 'Data Encrypted for Impact', tactic: 13, desc: 'Files across reachable shares are encrypted; ransom note dropped.', detect: 'Detect mass file-rename / high-entropy write bursts on file servers.' }
  ],
  'Supply Chain Compromise': [
    { id: 'T1195', name: 'Supply Chain Compromise', tactic: 2, desc: 'Adversary tampers with a trusted software update (SolarWinds-style).', detect: 'Verify build provenance and code-signing; compare hashes to source.', detectable: true },
    { id: 'T1554', name: 'Compromise Host Software', tactic: 4, desc: 'Backdoored DLL ships inside the signed update to every customer.', detect: 'Baseline expected DLLs; alert on unexpected loaded modules.' },
    { id: 'T1071', name: 'Application Layer Protocol', tactic: 11, desc: 'Implant beacons to C2 over HTTPS, blending with normal traffic.', detect: 'Hunt for beaconing patterns and rare destination domains.' },
    { id: 'T1078', name: 'Valid Accounts', tactic: 7, desc: 'Forged SAML tokens grant access to cloud resources.', detect: 'Alert on tokens signed by unexpected certificates.' },
    { id: 'T1530', name: 'Data from Cloud Storage', tactic: 10, desc: 'Sensitive mailboxes and cloud data are accessed and staged.', detect: 'Monitor unusual bulk reads of cloud mailboxes / storage.' },
    { id: 'T1567', name: 'Exfil over Web Service', tactic: 12, desc: 'Collected data is exfiltrated to attacker-controlled web services.', detect: 'Egress DLP on large uploads to uncommon SaaS endpoints.' }
  ],
  'Web App SQLi -> Data Theft': [
    { id: 'T1595', name: 'Active Scanning', tactic: 0, desc: 'Attacker scans the public web app for injectable parameters.', detect: 'WAF/IDS signatures for SQLi probing and scanner fingerprints.', detectable: true },
    { id: 'T1190', name: 'Exploit Public App', tactic: 2, desc: 'SQL injection yields query access to the backend database.', detect: 'Alert on database errors and anomalous query shapes.' },
    { id: 'T1059', name: 'Command & Scripting', tactic: 3, desc: 'Stacked queries enable command execution on the DB host.', detect: 'Detect xp_cmdshell / unexpected child processes of the DB engine.' },
    { id: 'T1005', name: 'Data from Local System', tactic: 10, desc: 'Customer records are dumped from database tables.', detect: 'Monitor bulk SELECT volumes against sensitive tables.' },
    { id: 'T1048', name: 'Exfil over Alt Protocol', tactic: 12, desc: 'The dump is exfiltrated over an unmonitored protocol.', detect: 'Egress filtering and DLP on non-standard outbound flows.' }
  ],
  'Insider Credential Abuse': [
    { id: 'T1078', name: 'Valid Accounts', tactic: 2, desc: 'A trusted insider logs in with their own legitimate credentials.', detect: 'Baseline normal access hours/scope; alert on deviations.', detectable: true },
    { id: 'T1087', name: 'Account Discovery', tactic: 8, desc: 'Insider enumerates groups and privileged accounts.', detect: 'Alert on unusual directory enumeration by a normal user.' },
    { id: 'T1098', name: 'Account Manipulation', tactic: 4, desc: 'Insider grants themselves access to additional systems.', detect: 'Monitor privilege/group membership changes.' },
    { id: 'T1213', name: 'Data from Info Repos', tactic: 10, desc: 'Confidential documents are pulled from internal repositories.', detect: 'Detect abnormal bulk document access on repositories.' },
    { id: 'T1052', name: 'Exfil over Physical Media', tactic: 12, desc: 'Data is copied to a USB drive and walked out the door.', detect: 'USB device-control policy and removable-media auditing.' }
  ]
};

let scenarioKeys = Object.keys(SCENARIOS);
let currentScenario = scenarioKeys[0];
let stepIndex = 2;          // how many techniques are revealed (0..len); start with 2 shown so the concept is visible on load
let selectedTech = -1;      // index of clicked technique for tooltip
let playing = false;
let lastStepTime = 0;
let pulsePhase = 0;
let mouseOverCanvas = false;

let scenarioSelect, stepFwdBtn, stepBackBtn, playBtn, resetBtn, speedSlider;

// geometry computed each frame
let colW, colTop, colBottom, plotTop, plotBottom;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);

  textFont('Arial');

  // Row 1: scenario select + step buttons
  scenarioSelect = createSelect();
  for (const k of scenarioKeys) scenarioSelect.option(k);
  scenarioSelect.selected(currentScenario);
  scenarioSelect.changed(onScenarioChange);
  scenarioSelect.parent(document.querySelector('main'));

  stepBackBtn = createButton('Step Back');
  stepBackBtn.parent(document.querySelector('main'));
  stepBackBtn.mousePressed(stepBack);

  stepFwdBtn = createButton('Step Forward');
  stepFwdBtn.parent(document.querySelector('main'));
  stepFwdBtn.mousePressed(stepForward);

  playBtn = createButton('Play All');
  playBtn.parent(document.querySelector('main'));
  playBtn.mousePressed(togglePlay);

  resetBtn = createButton('Reset');
  resetBtn.parent(document.querySelector('main'));
  resetBtn.mousePressed(resetSim);

  // Row 2: speed slider
  speedSlider = createSlider(0.5, 3.0, 1.5, 0.1);
  speedSlider.parent(document.querySelector('main'));

  positionControls();
  describe('An interactive MITRE ATT&CK tactic sequence explorer. Fourteen tactic columns are shown across the top. Stepping through a preset attack scenario reveals each technique as a blue circle in the column of its tactic, connected by arrows, so students can analyze how techniques chain into a full campaign and reason about the earliest detection point.', LABEL);
}

function positionControls() {
  const y1 = drawHeight + 8;
  const y2 = drawHeight + 44;
  scenarioSelect.position(10, y1);
  // place step/play/reset buttons after the select
  stepBackBtn.position(220, y1);
  stepFwdBtn.position(305, y1);
  playBtn.position(415, y1);
  resetBtn.position(495, y1);
  speedSlider.position(150, y2 + 4);
  speedSlider.size(max(120, canvasWidth - 150 - margin));
}

function onScenarioChange() {
  currentScenario = scenarioSelect.value();
  stepIndex = 0;
  selectedTech = -1;
  playing = false;
  playBtn.html('Play All');
}

function stepForward() {
  const seq = SCENARIOS[currentScenario];
  if (stepIndex < seq.length) stepIndex++;
}

function stepBack() {
  if (stepIndex > 0) stepIndex--;
  selectedTech = -1;
}

function togglePlay() {
  playing = !playing;
  playBtn.html(playing ? 'Pause' : 'Play All');
  lastStepTime = millis();
  if (playing && stepIndex >= SCENARIOS[currentScenario].length) {
    stepIndex = 0;
  }
}

function resetSim() {
  stepIndex = 0;
  selectedTech = -1;
  playing = false;
  playBtn.html('Play All');
}

function draw() {
  updateCanvasSize();

  // Drawing area background
  noStroke();
  fill(CREAM);
  rect(0, 0, canvasWidth, drawHeight);
  // Control area background
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver');
  noFill();
  rect(0, 0, canvasWidth, drawHeight);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill('black');
  textSize(22);
  textAlign(CENTER, TOP);
  text('MITRE ATT&CK Tactic Sequence Explorer', canvasWidth / 2, 8);

  // geometry
  colW = canvasWidth / TACTICS.length;
  colTop = 38;
  colBottom = drawHeight - 56;
  plotTop = 92;
  plotBottom = drawHeight - 72;

  drawColumns();

  // advance auto-play
  if (playing && mouseOverCanvas) {
    const interval = speedSlider.value() * 1000;
    if (millis() - lastStepTime >= interval) {
      lastStepTime = millis();
      if (stepIndex < SCENARIOS[currentScenario].length) {
        stepIndex++;
      } else {
        playing = false;
        playBtn.html('Play All');
      }
    }
  }
  if (mouseOverCanvas) pulsePhase += 0.08;

  drawTechniques();
  drawProgressStrip();
  drawControlLabels();

  // tooltip last (on top)
  if (selectedTech >= 0 && selectedTech < stepIndex) {
    drawTooltip(SCENARIOS[currentScenario][selectedTech]);
  }
}

function drawColumns() {
  textAlign(CENTER, TOP);
  for (let i = 0; i < TACTICS.length; i++) {
    const cx = i * colW + colW / 2;
    // alternating subtle column shading
    noStroke();
    fill(i % 2 === 0 ? 'rgba(69,90,100,0.05)' : 'rgba(69,90,100,0.10)');
    rect(i * colW, colTop, colW, colBottom - colTop);
    // header label — short two-line names sized to fit a narrow column
    fill(SLATE);
    noStroke();
    textSize(canvasWidth < 700 ? 9 : 11);
    const lines = TACTICS[i].short;
    for (let L = 0; L < lines.length; L++) {
      text(lines[L], cx, colTop + 2 + L * 13);
    }
  }
}

function techPos(i) {
  const seq = SCENARIOS[currentScenario];
  const t = seq[i];
  const cx = t.tactic * colW + colW / 2;
  // vertical position spreads techniques down the plot area by order
  const n = seq.length;
  const cy = map(i, 0, max(1, n - 1), plotTop + 20, plotBottom - 10);
  return { x: cx, y: cy };
}

function drawTechniques() {
  const seq = SCENARIOS[currentScenario];
  // arrows first
  stroke(BLUE);
  strokeWeight(2);
  for (let i = 1; i < stepIndex; i++) {
    const a = techPos(i - 1);
    const b = techPos(i);
    drawArrow(a.x, a.y, b.x, b.y);
  }
  // circles
  for (let i = 0; i < stepIndex; i++) {
    const p = techPos(i);
    const t = seq[i];
    const r = 17;
    // alert pulse on first detectable technique
    if (t.detectable) {
      const glow = 6 + 4 * sin(pulsePhase);
      noStroke();
      fill(255, 160, 0, 70);
      circle(p.x, p.y, (r + glow) * 2);
    }
    stroke('white');
    strokeWeight(2);
    fill(t.detectable ? ALERT : BLUE);
    circle(p.x, p.y, r * 2);
    // step number
    noStroke();
    fill(t.detectable ? '#212529' : 'white');
    textAlign(CENTER, CENTER);
    textSize(13);
    text(i + 1, p.x, p.y);
    // technique id label below circle
    fill(SLATE);
    textSize(10);
    text(t.id, p.x, p.y + r + 9);
  }
}

function drawArrow(x1, y1, x2, y2) {
  line(x1, y1, x2, y2);
  const ang = atan2(y2 - y1, x2 - x1);
  const ah = 7;
  push();
  translate(x2, y2);
  rotate(ang);
  // pull arrowhead back to circle edge
  translate(-19, 0);
  fill(BLUE);
  noStroke();
  triangle(0, 0, -ah, -ah / 2, -ah, ah / 2);
  pop();
}

function drawProgressStrip() {
  const seq = SCENARIOS[currentScenario];
  const pct = Math.round((stepIndex / seq.length) * 100);
  const y = drawHeight - 44;
  noStroke();
  fill(SLATE);
  textAlign(LEFT, CENTER);
  textSize(14);
  text('Cumulative attacker progress: ' + pct + '% of campaign', 14, y);
  // progress bar
  const bx = 14, bw = canvasWidth - 28, bh = 12, by = drawHeight - 28;
  noStroke();
  fill('rgba(69,90,100,0.18)');
  rect(bx, by, bw, bh, 6);
  fill(BLUE);
  rect(bx, by, bw * (stepIndex / seq.length), bh, 6);
  // hint
  fill('#6c757d');
  textSize(11);
  textAlign(RIGHT, CENTER);
  text('Amber = earliest typical SOC detection point. Click a circle for details.', canvasWidth - 14, y);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(14);
  text('Speed (s/step): ' + speedSlider.value().toFixed(1), 10, drawHeight + 52);
}

function drawTooltip(t) {
  const p = techPos(selectedTech);
  const boxW = min(300, canvasWidth - 24);
  const boxH = 118;
  let bx = p.x + 22;
  let by = p.y - boxH / 2;
  if (bx + boxW > canvasWidth - 8) bx = p.x - 22 - boxW;
  if (bx < 8) bx = 8;
  by = constrain(by, plotTop, drawHeight - boxH - 50);

  stroke(SLATE);
  strokeWeight(1.5);
  fill(255, 255, 255, 245);
  rect(bx, by, boxW, boxH, 8);

  noStroke();
  fill(BLUE);
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text(t.id + ' — ' + t.name, bx + 10, by + 8, boxW - 20, 22);
  textStyle(NORMAL);
  fill('#333');
  textSize(12);
  text(t.desc, bx + 10, by + 32, boxW - 20, 46);
  fill('#2e7d32');
  textStyle(BOLD);
  text('Detection: ', bx + 10, by + 80, boxW - 20, 16);
  textStyle(NORMAL);
  fill('#444');
  text(t.detect, bx + 10, by + 94, boxW - 20, 20);
}

function mousePressed() {
  // detect click on a revealed circle
  if (mouseY > drawHeight) return;
  const seq = SCENARIOS[currentScenario];
  let hit = -1;
  for (let i = 0; i < stepIndex; i++) {
    const p = techPos(i);
    if (dist(mouseX, mouseY, p.x, p.y) <= 18) { hit = i; break; }
  }
  selectedTech = (hit === selectedTech) ? -1 : hit;
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
  if (typeof speedSlider !== 'undefined' && speedSlider) {
    positionControls();
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}
