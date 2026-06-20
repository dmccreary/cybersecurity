// CANVAS_HEIGHT: 560
// Vulnerability Sandbox MicroSim (p5.js)
// Bloom: ANALYZE. The student sends ONE attacker payload at a vulnerable AND a
// fixed implementation of the same endpoint, then compares the constructed
// query/command/output and the resulting outcome. The point is structural:
// the vulnerable side concatenates attacker data INTO the code (so data becomes
// code), while the fixed side keeps the payload as DATA (parameterized query,
// argument array, or contextual escaping), making the bad outcome impossible.
// Interaction is event-driven (select a class, edit payload, Send request) with a
// short one-shot flow animation on Send — not a continuous loop.

// ---- Canvas / layout standard variables ----
let canvasWidth = 800;
let drawHeight = 480;     // drawing region (two panels + outcome bar)
let controlHeight = 80;   // two rows of controls
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 16;

// ---- Controls ----
let classSelect, payloadInput, sendButton, internalsCheckbox;

// ---- State ----
let showInternals = true;
let hasSent = true;             // start in the "sent" state so the default renders
let flowT = 1;                  // 0..1 flow animation progress (1 = settled)
const FLOW_SPEED = 0.045;
let currentClass = 'SQL Injection';
let currentPayload = "admin' --";

// Palette
const C_CODE = '#1565c0';       // safe code (blue)
const C_PAYLOAD = '#d84315';    // attacker payload (rust orange)
const C_DATA = '#455a64';       // normal data (slate steel)
const C_WARN = '#ffa000';       // alert amber
const C_BAD = '#c62828';        // exploited (red)
const C_GOOD = '#2e7d32';       // contained (green)

// Per-class model. Each entry describes how the SAME payload is handled by a
// vulnerable vs. a fixed implementation, plus the sink icon and outcomes.
const CLASSES = {
  'SQL Injection': {
    sink: 'Database', defaultPayload: "admin' --",
    vulnPre: 'SELECT * FROM users WHERE name = \'',
    vulnPost: '\'',
    fixedTemplate: 'SELECT * FROM users WHERE name = ?',
    fixedNote: 'bound parameter -> payload is treated as one literal value',
    vulnOutcome: 'Auth bypass / returned all 10,000 user rows',
    fixedOutcome: 'Returned 0 rows (no user literally named that)',
    sinkVuln: 'query executed as written', sinkFixed: 'payload bound, not parsed'
  },
  'Command Injection': {
    sink: 'Shell', defaultPayload: '; rm -rf / #',
    vulnPre: 'ping -c1 ',
    vulnPost: '',
    fixedTemplate: 'execFile("ping", ["-c1", host])',
    fixedNote: 'argument array -> no shell parses the metacharacters',
    vulnOutcome: 'Shell ran the injected command: rm -rf /',
    fixedOutcome: 'Argument treated as a literal hostname',
    sinkVuln: '/bin/sh -c interprets ; and #', sinkFixed: 'no shell invoked'
  },
  'Reflected XSS': {
    sink: 'Browser', defaultPayload: '<script>steal()</script>',
    vulnPre: '<div>Results for: ',
    vulnPost: '</div>',
    fixedTemplate: '<div>Results for: {{ q | escape }}</div>',
    fixedNote: 'contextual escaping -> < > become &lt; &gt;',
    vulnOutcome: 'Script ran in the victim\'s browser; stole session cookie',
    fixedOutcome: 'Payload rendered as visible text, not script',
    sinkVuln: 'browser parses injected <script>', sinkFixed: 'browser shows literal text'
  },
  'Path Traversal': {
    sink: 'Filesystem', defaultPayload: '../../../../etc/passwd',
    vulnPre: 'open("/var/www/files/" + ',
    vulnPost: ')',
    fixedTemplate: 'open(safeJoin(BASE, basename(name)))',
    fixedNote: 'canonicalize + confine to BASE dir',
    vulnOutcome: 'Read /etc/passwd outside the intended directory',
    fixedOutcome: 'Resolved path stayed inside the files directory',
    sinkVuln: '.. escapes the base directory', sinkFixed: 'path confined to BASE'
  },
  'IDOR': {
    sink: 'Object store', defaultPayload: 'invoice_id=1007',
    vulnPre: 'getInvoice(',
    vulnPost: ')   // no owner check',
    fixedTemplate: 'getInvoice(id) WHERE owner = currentUser',
    fixedNote: 'authorization check ties the object to the caller',
    vulnOutcome: 'Read another user\'s invoice #1007',
    fixedOutcome: 'Access denied: object not owned by caller',
    sinkVuln: 'any ID is fetched', sinkFixed: 'ownership enforced'
  }
};

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  // Row 1: vulnerability class select + payload input
  classSelect = createSelect();
  for (const k in CLASSES) classSelect.option(k);
  classSelect.selected(currentClass);
  classSelect.changed(onClassChange);
  classSelect.parent(document.querySelector('main'));

  payloadInput = createInput(currentPayload);
  payloadInput.parent(document.querySelector('main'));
  payloadInput.input(() => { currentPayload = payloadInput.value(); });

  // Row 2: Send request button + Show internals checkbox
  sendButton = createButton('Send request');
  sendButton.parent(document.querySelector('main'));
  sendButton.mousePressed(sendRequest);

  internalsCheckbox = createCheckbox('Show internals', true);
  internalsCheckbox.parent(document.querySelector('main'));
  internalsCheckbox.changed(() => { showInternals = internalsCheckbox.checked(); });

  positionControls();
  describe('Side-by-side sandbox comparing a vulnerable and a fixed web endpoint. ' +
    'Choose a vulnerability class, edit the attacker payload, and press Send request. ' +
    'The left panel concatenates the payload into code and is exploited; the right panel ' +
    'keeps the payload as data and contains the attack.', LABEL);
}

function onClassChange() {
  currentClass = classSelect.value();
  currentPayload = CLASSES[currentClass].defaultPayload;
  payloadInput.value(currentPayload);
  sendRequest();
}

function sendRequest() {
  currentPayload = payloadInput.value();
  hasSent = true;
  flowT = 0; // restart the one-shot flow animation
}

function positionControls() {
  const labelW = 130;      // room for "Vulnerability class" label
  const x1 = margin + labelW;
  classSelect.position(x1, drawHeight + 8);
  classSelect.style('width', '170px');

  const x2 = x1 + 190 + 110; // after select + "Attacker payload" label
  payloadInput.position(x2, drawHeight + 8);
  const inputW = Math.max(120, canvasWidth - x2 - margin);
  payloadInput.style('width', inputW + 'px');

  sendButton.position(margin, drawHeight + 44);
  internalsCheckbox.position(margin + 140, drawHeight + 47);
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

  // Title
  noStroke();
  fill('black');
  textSize(22);
  textAlign(CENTER, TOP);
  text('Vulnerability Sandbox: Same Payload, Two Implementations', canvasWidth / 2, 8);
  textSize(13);
  fill(C_DATA);
  text('Data becomes CODE on the left; stays DATA on the right.', canvasWidth / 2, 34);

  // advance one-shot flow animation
  if (flowT < 1) flowT = Math.min(1, flowT + FLOW_SPEED);

  const m = CLASSES[currentClass];
  const stacked = canvasWidth < 700;
  const panelTop = 58;
  const outcomeBarH = 56;
  const panelBottom = drawHeight - outcomeBarH - 10;

  if (!stacked) {
    const gap = 16;
    const pw = (canvasWidth - 2 * margin - gap) / 2;
    drawPanel(margin, panelTop, pw, panelBottom - panelTop, m, true);
    drawPanel(margin + pw + gap, panelTop, pw, panelBottom - panelTop, m, false);
  } else {
    const ph = (panelBottom - panelTop - 12) / 2;
    drawPanel(margin, panelTop, canvasWidth - 2 * margin, ph, m, true);
    drawPanel(margin, panelTop + ph + 12, canvasWidth - 2 * margin, ph, m, false);
  }

  // Outcome summary bar
  drawOutcomeBar(margin, drawHeight - outcomeBarH - 4, canvasWidth - 2 * margin, outcomeBarH, m);

  // Control labels
  drawControlLabels();
}

// Draw one server panel. vuln=true -> vulnerable (left), false -> fixed (right).
function drawPanel(x, y, w, h, m, vuln) {
  const headColor = vuln ? C_BAD : C_GOOD;
  // panel card
  noStroke();
  fill(255);
  stroke('silver');
  rect(x, y, w, h, 8);
  // header strip
  noStroke();
  fill(headColor);
  rect(x, y, w, 26, 8, 8, 0, 0);
  fill('white');
  textSize(14);
  textAlign(LEFT, CENTER);
  text(vuln ? '⚠  Vulnerable endpoint' : '✓  Fixed endpoint', x + 10, y + 13);

  let cy = y + 38;
  const padX = 10;
  const innerW = w - 2 * padX;

  // "Show internals": the constructed query/command/output
  if (showInternals) {
    noStroke();
    fill(C_DATA);
    textSize(12);
    textAlign(LEFT, TOP);
    text(vuln ? 'Constructed (concatenation):' : 'Constructed (separated code + data):', x + padX, cy);
    cy += 18;

    if (vuln) {
      // pre + PAYLOAD(rust) + post on one wrapped run
      cy = drawConcatString(x + padX, cy, innerW, m.vulnPre, currentPayload, m.vulnPost);
    } else {
      // code template in blue, payload shown as a separate bound DATA chip
      cy = drawWrapped(x + padX, cy, innerW, m.fixedTemplate, C_CODE, 13, true);
      cy += 4;
      noStroke();
      fill(C_DATA);
      textSize(11.5);
      textAlign(LEFT, TOP);
      text('bound value (data):', x + padX, cy);
      cy += 16;
      drawDataChip(x + padX, cy, currentPayload);
      cy += 26;
      noStroke();
      fill(C_DATA);
      textSize(11);
      text(m.fixedNote, x + padX, cy);
      cy += 18;
    }
  } else {
    cy += 6;
    noStroke();
    fill(C_DATA);
    textSize(12);
    textAlign(LEFT, TOP);
    text('(internals hidden — check "Show internals")', x + padX, cy);
    cy += 24;
  }

  // Flow arrow toward the sink
  const sinkY = y + h - 56;
  const arrowX = x + w / 2;
  const startY = Math.min(cy + 6, sinkY - 30);
  drawFlowArrow(arrowX, startY, sinkY - 24, vuln);

  // Sink icon + per-panel behavior
  drawSink(x + w / 2, sinkY, m.sink, vuln);
  noStroke();
  fill(C_DATA);
  textSize(10.5);
  textAlign(CENTER, TOP);
  text(vuln ? m.sinkVuln : m.sinkFixed, x + w / 2, sinkY + 16);

  // Outcome line at the very bottom of the panel
  noStroke();
  fill(vuln ? C_BAD : C_GOOD);
  textSize(12);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  drawWrapped(x + padX, y + h - 30, innerW, (vuln ? 'EXPLOITED: ' : 'CONTAINED: ') +
    (vuln ? m.vulnOutcome : m.fixedOutcome), vuln ? C_BAD : C_GOOD, 12, false);
  textStyle(NORMAL);
}

// vulnerable concatenation: pre (blue code) + payload (rust) + post (blue code),
// wrapped within width. Returns the new y.
function drawConcatString(x, y, w, pre, payload, post) {
  const fs = 13;
  textSize(fs);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  const tokens = [
    { s: pre, c: C_CODE },
    { s: payload, c: C_PAYLOAD },
    { s: post, c: C_CODE }
  ];
  let cx = x, cy = y;
  const lineH = fs + 6;
  for (const tk of tokens) {
    // split into words but keep spaces for code readability
    const parts = tk.s.split(/(\s+)/);
    for (const part of parts) {
      if (part === '') continue;
      const pw = textWidth(part);
      if (cx + pw > x + w && cx > x) { cx = x; cy += lineH; }
      noStroke();
      fill(tk.c);
      text(part, cx, cy);
      cx += pw;
    }
  }
  textStyle(NORMAL);
  return cy + lineH + 2;
}

// generic wrapped text. bold optional. Returns new y.
function drawWrapped(x, y, w, str, col, fs, bold) {
  textSize(fs);
  if (bold) textStyle(BOLD);
  textAlign(LEFT, TOP);
  const words = str.split(/(\s+)/);
  let cx = x, cy = y;
  const lineH = fs + 5;
  for (const word of words) {
    if (word === '') continue;
    const wpx = textWidth(word);
    if (cx + wpx > x + w && cx > x) { cx = x; cy += lineH; }
    noStroke();
    fill(col);
    text(word, cx, cy);
    cx += wpx;
  }
  if (bold) textStyle(NORMAL);
  return cy + lineH;
}

// a slate-steel "data" chip holding the payload (right panel)
function drawDataChip(x, y, payload) {
  textSize(12.5);
  textStyle(BOLD);
  const label = payload.length > 36 ? payload.slice(0, 35) + '…' : payload;
  const tw = textWidth(label);
  noStroke();
  fill(C_DATA);
  rect(x, y, tw + 16, 22, 6);
  fill('white');
  textAlign(LEFT, CENTER);
  text(label, x + 8, y + 11);
  textStyle(NORMAL);
}

// flow arrow showing the payload traveling to the sink; rust dot for vuln, slate for fixed
function drawFlowArrow(cx, y0, y1, vuln) {
  if (y1 <= y0) return;
  stroke(vuln ? C_PAYLOAD : C_DATA);
  strokeWeight(2);
  line(cx, y0, cx, y1);
  noStroke();
  fill(vuln ? C_PAYLOAD : C_DATA);
  triangle(cx - 6, y1 - 8, cx + 6, y1 - 8, cx, y1 + 1);
  // moving packet
  const t = flowT;
  const py = y0 + (y1 - y0) * t;
  fill(vuln ? C_PAYLOAD : C_DATA);
  circle(cx, py, 9);
}

// sink icon: a labeled rounded box; red ring if exploited, green if contained
function drawSink(cx, cy, label, vuln) {
  const w = 92, h = 30;
  stroke(vuln ? C_BAD : C_GOOD);
  strokeWeight(2);
  fill(vuln ? '#fdecea' : '#eaf5ec');
  rect(cx - w / 2, cy - h / 2, w, h, 6);
  noStroke();
  fill(vuln ? C_BAD : C_GOOD);
  textSize(12.5);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  text(label, cx, cy);
  textStyle(NORMAL);
}

function drawOutcomeBar(x, y, w, h, m) {
  noStroke();
  fill(C_WARN);
  rect(x, y, w, h, 8);
  fill('white');
  textAlign(CENTER, CENTER);
  textSize(15);
  textStyle(BOLD);
  text('Same payload. Different defense.', x + w / 2, y + 17);
  textSize(13.5);
  textStyle(NORMAL);
  text('Left outcome: EXPLOITED   •   Right outcome: CONTAINED', x + w / 2, y + 38);
}

function drawControlLabels() {
  noStroke();
  fill('black');
  textSize(13);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  text('Vulnerability class:', margin, drawHeight + 20);
  // "Attacker payload" label sits before the input
  const labelW = 130;
  const x1 = margin + labelW;
  text('Attacker payload:', x1 + 190, drawHeight + 20);
  textStyle(NORMAL);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
  if (typeof payloadInput !== 'undefined' && payloadInput) {
    positionControls();
  }
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  positionControls();
}
