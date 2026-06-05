// CANVAS_HEIGHT: 620
// Phishing Email Anatomy — p5.js interactive infographic. A mock phishing email
// is rendered in a stylized client window with six hotspots, each a known
// manipulation technique. Bloom: Analyzing. Two modes via a dropdown:
//   "Spot the indicators" — hotspots hidden; click to find them; score shown.
//   "Annotated" — all hotspots highlighted; hover any one for its explanation.
// Interaction is click/hover reveal (NOT continuous animation).

let canvasWidth = 900;
let drawHeight = 560;
let controlHeight = 60;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

let modeSelect;     // "Spot the indicators" | "Annotated"
let resetButton;

// Hotspots: rectangles over the email mockup, with the manipulation technique
// each one demonstrates. Coordinates are in a 900-wide design space and scaled
// to the actual canvas width by scaleX().
const HOTSPOTS = [
  { id: 'sender',  x: 150, y: 96,  w: 480, h: 34, label: 'Sender address',
    tip: 'Display-name spoofing: the name says "Finance Department," but the real address is finance-dept@finance-securemail.co — a domain the attacker controls, not your company.' },
  { id: 'greeting', x: 60, y: 188, w: 220, h: 26, label: 'Generic greeting',
    tip: 'Generic greeting: "Dear Colleague" instead of your name. Bulk phishing skips personalization; targeted spear phishing would use your real name.' },
  { id: 'urgency', x: 60, y: 250, w: 700, h: 26, label: 'Urgency trigger',
    tip: 'Manufactured urgency: "by end of business today to avoid a late fee" pressures you to act before thinking. Urgency suppresses careful scrutiny.' },
  { id: 'link', x: 60, y: 320, w: 430, h: 26, label: 'Deceptive hyperlink',
    tip: 'Lookalike link: the text reads intranet.example.com but the real href is intranet-example.invoice-portal.ru/login — a different domain that only looks familiar.' },
  { id: 'attach', x: 60, y: 392, w: 250, h: 40, label: 'HTML attachment',
    tip: 'Dangerous attachment: Invoice_Q3.html opens a fake login page in your browser to harvest credentials. HTML attachments are a common credential-harvesting vector.' },
  { id: 'footer', x: 60, y: 470, w: 320, h: 60, label: 'Spoofed footer',
    tip: 'Forged legitimacy: a corporate signature block copied from the real company website makes the message look authentic. Attackers source these from public pages.' },
];

let found = {};          // id -> true once clicked in spot mode
let hoverId = null;      // currently hovered hotspot id
let mouseOverCanvas = false;

function scaleX() { return canvasWidth / 900; }

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => { mouseOverCanvas = false; hoverId = null; });

  modeSelect = createSelect();
  modeSelect.option('Spot the indicators');
  modeSelect.option('Annotated');
  modeSelect.selected('Spot the indicators');
  modeSelect.parent(document.querySelector('main'));
  modeSelect.position(150, drawHeight + 14);
  modeSelect.changed(resetFound);

  resetButton = createButton('Reset');
  resetButton.parent(document.querySelector('main'));
  resetButton.position(margin, drawHeight + 14);
  resetButton.mousePressed(resetFound);

  describe('A mock phishing email in a stylized email client. Six manipulation techniques are highlighted as hotspots. In Spot mode the learner clicks to find each indicator and a score is shown; in Annotated mode all indicators and their explanations are visible.', LABEL);
}

function resetFound() {
  found = {};
  hoverId = null;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = Math.max(360, container.offsetWidth);
  }
}

function isAnnotated() { return modeSelect && modeSelect.value() === 'Annotated'; }

function draw() {
  const s = scaleX();

  // Regions
  noStroke();
  fill('aliceblue'); stroke('silver'); rect(0, 0, canvasWidth, drawHeight);
  noStroke();
  fill('white'); stroke('silver'); rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill('#1565c0'); textSize(22); textAlign(CENTER, TOP); textStyle(BOLD);
  text('Anatomy of a Phishing Email', canvasWidth / 2, 8);
  textStyle(NORMAL);

  drawEmailWindow(s);
  drawHotspots(s);
  drawTooltip(s);
  drawControlsText();
}

function drawEmailWindow(s) {
  push();
  translate(0, 0);
  // window shadow + body
  const wx = 30 * s, wy = 44, ww = canvasWidth - 60 * s, wh = drawHeight - 60;
  noStroke();
  fill(0, 0, 0, 30); rect(wx + 4, wy + 5, ww, wh, 10);
  fill('#fff8e1'); stroke('#cfd8dc'); strokeWeight(1.5); rect(wx, wy, ww, wh, 10);

  // header bar
  noStroke(); fill('#455a64'); rect(wx, wy, ww, 26 * 1, 10, 10, 0, 0);
  fill('#ffffff'); textAlign(LEFT, CENTER); textSize(12 * s + 4);
  text('Inbox  —  1 new message', wx + 12 * s, wy + 13);

  textAlign(LEFT, TOP);
  const lx = 60 * s;
  // From line
  fill('#37474f'); textSize(13 * s + 3); textStyle(BOLD);
  text('From:', lx - 48 * s, 100);
  textStyle(NORMAL); fill('#263238');
  text('Finance Department  <finance-dept@finance-securemail.co>', lx + 92 * s, 100);
  // Subject
  fill('#37474f'); textStyle(BOLD); text('Subject:', lx - 48 * s, 134);
  textStyle(NORMAL); fill('#263238');
  text('ACTION REQUIRED: Review attached invoice', lx + 92 * s, 134);

  // divider
  stroke('#e0e0e0'); line(lx - 48 * s, 162, wx + ww - 18 * s, 162);

  // body text
  noStroke(); fill('#263238'); textSize(13 * s + 3);
  text('Dear Colleague,', lx, 190);
  text('Our records show an outstanding invoice on your account.', lx, 222);
  text('Please review by end of business today to avoid a late fee.', lx, 252);

  fill('#1565c0');
  const linkText = 'https://intranet.example.com/invoices/1042';
  text(linkText, lx, 322);
  // manual underline (p5 textStyle has no UNDERLINE constant)
  const lw = textWidth(linkText);
  stroke('#1565c0'); strokeWeight(1); line(lx, 322 + 18, lx + lw, 322 + 18);
  noStroke(); fill('#263238');

  text('The full statement is attached:', lx, 362);
  // attachment chip
  fill('#eceff1'); stroke('#90a4ae'); strokeWeight(1); rect(lx, 392, 220 * s, 38, 6);
  noStroke(); fill('#455a64'); textSize(12 * s + 3);
  // paperclip glyph drawn as text label (avoid emoji rendering differences)
  text('[file]  Invoice_Q3.html', lx + 12 * s, 404);

  // footer signature
  fill('#263238'); textSize(13 * s + 2);
  text('Regards,', lx, 470);
  textStyle(BOLD); text('Accounts Receivable Team', lx, 492);
  textStyle(NORMAL); fill('#607d8b'); textSize(11 * s + 2);
  text('Globex Corporation  ·  1 Corporate Way  ·  +1 555 0100', lx, 514);
  pop();
}

function drawHotspots(s) {
  const annotated = isAnnotated();
  hoverId = null;
  for (const h of HOTSPOTS) {
    const rx = h.x * s, ry = h.y, rw = h.w * s, rh = h.h;
    const over = mouseOverCanvas && mouseX >= rx && mouseX <= rx + rw && mouseY >= ry && mouseY <= ry + rh;
    if (over) hoverId = h.id;

    const reveal = annotated || found[h.id];
    if (reveal) {
      // red glow highlight
      noFill();
      stroke('#e53935'); strokeWeight(over ? 3 : 2);
      rect(rx - 3, ry - 3, rw + 6, rh + 6, 5);
      // soft fill
      noStroke(); fill(229, 57, 53, 26); rect(rx - 3, ry - 3, rw + 6, rh + 6, 5);
      // small label tag (annotated mode only, to keep spot mode clean)
      if (annotated) {
        noStroke(); fill('#e53935');
        const tagW = textWidth(h.label) + 12;
        rect(rx - 3, ry - 22, tagW, 18, 4);
        fill('#ffffff'); textSize(11); textAlign(LEFT, CENTER); textStyle(BOLD);
        text(h.label, rx + 3, ry - 13);
        textStyle(NORMAL);
      }
    } else if (over) {
      // in spot mode, show a subtle hover cue without revealing the answer
      noFill(); stroke(255, 160, 0, 180); strokeWeight(2);
      rect(rx - 3, ry - 3, rw + 6, rh + 6, 5);
    }
  }
}

function drawTooltip(s) {
  if (!hoverId) return;
  const annotated = isAnnotated();
  const h = HOTSPOTS.find(x => x.id === hoverId);
  if (!h) return;
  // Only show explanatory tooltip if revealed; in spot mode before finding,
  // show a prompt to click.
  const reveal = annotated || found[h.id];
  const msg = reveal ? h.tip : 'Possible indicator — click to confirm and reveal why.';

  textSize(12); textAlign(LEFT, TOP);
  const boxW = Math.min(320, canvasWidth - 24);
  const words = msg.split(' ');
  let lines = [], cur = '';
  for (const w of words) {
    if (textWidth(cur + w + ' ') > boxW - 16) { lines.push(cur); cur = w + ' '; }
    else cur += w + ' ';
  }
  if (cur) lines.push(cur);
  const boxH = lines.length * 16 + 12;
  let bx = mouseX + 14, by = mouseY + 14;
  if (bx + boxW > canvasWidth) bx = canvasWidth - boxW - 6;
  if (by + boxH > drawHeight) by = mouseY - boxH - 8;

  noStroke(); fill('#263238'); rect(bx, by, boxW, boxH, 6);
  fill('#ffffff');
  for (let i = 0; i < lines.length; i++) text(lines[i], bx + 8, by + 6 + i * 16);
}

function drawControlsText() {
  noStroke(); fill('#263238'); textSize(defaultTextSize); textAlign(LEFT, CENTER);
  text('Mode:', 150 - 48, drawHeight + 24);

  // score / instruction on the right
  textAlign(RIGHT, CENTER);
  if (isAnnotated()) {
    fill('#455a64');
    text('All six manipulation techniques are highlighted. Hover for the explanation.', canvasWidth - margin, drawHeight + 24);
  } else {
    const n = Object.keys(found).length;
    fill(n === HOTSPOTS.length ? '#2e7d32' : '#1565c0');
    text('Found ' + n + ' of ' + HOTSPOTS.length + ' indicators — click suspicious parts of the email.', canvasWidth - margin, drawHeight + 24);
  }
  textAlign(LEFT, CENTER);
}

function mousePressed() {
  // Only register clicks inside the drawing area, in spot mode.
  if (isAnnotated()) return;
  if (mouseY < 0 || mouseY > drawHeight) return;
  const s = scaleX();
  for (const h of HOTSPOTS) {
    const rx = h.x * s, ry = h.y, rw = h.w * s, rh = h.h;
    if (mouseX >= rx && mouseX <= rx + rw && mouseY >= ry && mouseY <= ry + rh) {
      found[h.id] = true;
    }
  }
}
