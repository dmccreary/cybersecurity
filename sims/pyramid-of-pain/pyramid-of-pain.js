// CANVAS_HEIGHT: 540
// Pyramid of Pain (David Bianco) — interactive infographic.
// Bloom: Understand. Six indicator levels from Hash Values (bottom, "Trivial" for
// the attacker to change) up to TTPs (top, "Tough!"). The pyramid encodes the core
// idea: detecting attackers higher up imposes more cost on them. Hover a level for
// what the indicator is and what detecting it forces the adversary to do; click a
// level to reveal a sample SIEM detection rule. A view selector toggles between the
// Defender view (detection ideas) and the Attacker view (what evasion costs).
// Hover/click reveals — not looping animation — fit the Understand objective.

let canvasWidth = 700;
let drawHeight = 470;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

const C_CREAM = '#fff8e1';

// Levels top (index 0 = TTPs) to bottom (index 5 = Hash Values).
const levels = [
  { name: 'TTPs', pain: 'Tough!', fill: '#1565c0', txt: '#ffffff',
    what: 'Tactics, Techniques & Procedures — how the adversary operates.',
    forces: 'Detecting these forces the adversary to change their methodology — the hardest, most expensive change of all.',
    cost: 'Re-learning how to operate. Months of effort; may abandon the campaign.',
    rule: 'Behavioral rule: process spawning powershell.exe with a -enc base64 flag from an Office app.' },
  { name: 'Tools', pain: 'Challenging', fill: '#1e6fd0', txt: '#ffffff',
    what: 'The malware and utilities the adversary brings (e.g., Cobalt Strike, Mimikatz).',
    forces: 'Detecting these forces the adversary to find or build new capability.',
    cost: 'Rebuild or re-purchase tooling. Weeks of effort and money.',
    rule: 'Detect known tool artifacts: named pipes, default Cobalt Strike profiles, Mimikatz API call patterns.' },
  { name: 'Network / Host Artifacts', pain: 'Annoying', fill: '#3a86d6', txt: '#ffffff',
    what: 'Registry keys, files, user-agents, URI patterns the activity leaves behind.',
    forces: 'Detecting these forces the adversary to change their tradecraft.',
    cost: 'Reconfigure tooling to avoid the artifact. Days of effort.',
    rule: 'Detect a specific User-Agent string or a dropped file at a known path/hash-independent location.' },
  { name: 'Domain Names', pain: 'Simple', fill: '#7badd9', txt: '#0d2c54',
    what: 'C2 and phishing domain names used by the adversary.',
    forces: 'Detecting these forces the adversary to register new domains.',
    cost: 'Register and age new domains. Hours to days, small cost.',
    rule: 'Block/alert on newly registered domains or matches against a C2 domain threat feed.' },
  { name: 'IP Addresses', pain: 'Easy', fill: '#b9c7cf', txt: '#0d2c54',
    what: 'IP addresses the adversary connects from or to.',
    forces: 'Detecting these forces the attacker to rotate infrastructure.',
    cost: 'Switch VPS / proxy / cloud IPs. Minutes, trivially cheap.',
    rule: 'Block/alert on connections to IPs on a reputation or threat-intel blocklist.' },
  { name: 'Hash Values', pain: 'Trivial', fill: '#cfd8dc', txt: '#0d2c54',
    what: 'Exact file hashes (MD5/SHA-256) of known-bad files.',
    forces: 'Detecting these forces nothing — the attacker rebuilds with one byte changed.',
    cost: 'Recompile / flip one byte to get a new hash. Seconds.',
    rule: 'Alert when a file hash matches a known-malware hash set (e.g., from VirusTotal).' }
];

let viewSelect;
let selected = -1;     // clicked level index, -1 = none
let hovered = -1;
let mouseOverCanvas = false;

// pyramid geometry cache (computed each draw)
let bands = [];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  canvas.mouseOver(() => mouseOverCanvas = true);
  canvas.mouseOut(() => mouseOverCanvas = false);
  const m = document.querySelector('main');

  viewSelect = createSelect(); viewSelect.parent(m);
  viewSelect.option('Defender view');
  viewSelect.option('Attacker view');
  viewSelect.selected('Defender view');
  viewSelect.position(margin + 110, drawHeight + 12);
  viewSelect.style('font-size', '14px');

  describe('Interactive Pyramid of Pain: six indicator levels from Hash Values at the ' +
    'bottom (trivial for an attacker to change) to TTPs at the top (very hard to change). ' +
    'Hover a level for an explanation, click for a sample SIEM detection rule, and switch ' +
    'between Defender and Attacker views.', LABEL);
}

function draw() {
  updateCanvasSize();
  // backgrounds
  noStroke();
  fill('aliceblue'); stroke('silver'); rect(0, 0, canvasWidth, drawHeight);
  fill('white'); rect(0, drawHeight, canvasWidth, controlHeight);

  // title
  noStroke(); fill('black'); textSize(22); textAlign(CENTER, TOP);
  text('Pyramid of Pain', canvasWidth / 2, 10);
  textSize(12.5); fill('#455a64');
  text('Higher detections cost the adversary more. Hover a level; click for a SIEM rule.',
       canvasWidth / 2, 36);

  const attacker = viewSelect.value() === 'Attacker view';

  // pyramid region (left) and info panel (right)
  const pyTop = 60, pyBottom = drawHeight - 16;
  const pyH = pyBottom - pyTop;
  const bandH = pyH / levels.length;
  const apexX = margin + 30;             // left padding region; pyramid centered in left area
  const pyAreaW = canvasWidth * 0.56;
  const cx = margin + pyAreaW / 2;
  const maxHalf = pyAreaW / 2 - 10;      // half-width at base
  const minHalf = 34;                    // half-width at apex

  // detect hover
  hovered = -1;
  bands = [];
  for (let i = 0; i < levels.length; i++) {
    const y = pyTop + i * bandH;
    // half width interpolates apex(min) at i=0 to base(max) at last
    const t0 = i / levels.length;
    const t1 = (i + 1) / levels.length;
    const halfTop = lerp(minHalf, maxHalf, t0);
    const halfBot = lerp(minHalf, maxHalf, t1);
    bands.push({ y, h: bandH, halfTop, halfBot, cx });
    if (mouseX > cx - halfBot && mouseX < cx + halfBot && mouseY > y && mouseY < y + bandH && mouseY < drawHeight) {
      hovered = i;
    }
  }

  // draw bands (apex first)
  textAlign(CENTER, CENTER);
  for (let i = 0; i < levels.length; i++) {
    const b = bands[i];
    const L = levels[i];
    const active = (i === hovered || i === selected);
    stroke('white'); strokeWeight(active ? 3 : 1.5);
    fill(L.fill);
    quad(b.cx - b.halfTop, b.y, b.cx + b.halfTop, b.y,
         b.cx + b.halfBot, b.y + b.h, b.cx - b.halfBot, b.y + b.h);
    noStroke(); fill(L.txt);
    textSize(i < 2 ? 12.5 : 13.5);
    textStyle(BOLD);
    text(L.name, b.cx, b.y + b.h / 2 - 7);
    textStyle(NORMAL);
    textSize(11.5);
    text('"' + L.pain + '"', b.cx, b.y + b.h / 2 + 10);
  }

  // arrow up the right side of pyramid: "more pain for attacker"
  const arrowX = margin + pyAreaW + 6;
  stroke('#455a64'); strokeWeight(2);
  line(arrowX, pyBottom, arrowX, pyTop);
  // arrowhead
  noStroke(); fill('#455a64');
  triangle(arrowX, pyTop - 2, arrowX - 5, pyTop + 8, arrowX + 5, pyTop + 8);
  push();
  translate(arrowX - 10, (pyTop + pyBottom) / 2);
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER); textSize(11.5); fill('#455a64'); noStroke();
  text('more cost imposed on the adversary', 0, 0);
  pop();

  // info panel (right)
  drawInfoPanel(attacker);

  // control labels
  noStroke(); textAlign(LEFT, CENTER); fill('black'); textSize(14);
  text('View:', margin, drawHeight + 24);
  fill('#455a64'); textSize(11.5);
  text('Defender = how to detect each level · Attacker = what evading it costs',
       margin + 260, drawHeight + 24);
}

function drawInfoPanel(attacker) {
  const px = margin + canvasWidth * 0.58 + 10;
  const pw = canvasWidth - px - margin;
  const py = 60, ph = drawHeight - py - 16;
  fill('white'); stroke('#cfd8dc'); strokeWeight(1);
  rect(px, py, pw, ph, 8);

  const idx = (selected >= 0) ? selected : hovered;
  noStroke(); textAlign(LEFT, TOP);
  if (idx < 0) {
    fill('#455a64'); textSize(13.5); textStyle(BOLD);
    text(attacker ? 'Attacker view' : 'Defender view', px + 12, py + 12);
    textStyle(NORMAL); textSize(12.5); fill('#37474f');
    wrapText(attacker
      ? 'Hover a pyramid level to see what evading detection at that level costs the adversary. Click a level to pin it.'
      : 'Hover a pyramid level to see what it is and what detecting it forces the adversary to do. Click a level to reveal a sample SIEM detection rule.',
      px + 12, py + 36, pw - 24, 16);
    return;
  }

  const L = levels[idx];
  fill(L.fill === '#cfd8dc' || L.fill === '#b9c7cf' ? '#0d2c54' : '#1565c0');
  // header always readable color
  fill('#1565c0'); textSize(15); textStyle(BOLD);
  text(L.name + '  — "' + L.pain + '"', px + 12, py + 12);
  textStyle(NORMAL);

  let y = py + 40;
  textSize(12); fill('#455a64'); textStyle(BOLD);
  text('What it is', px + 12, y); textStyle(NORMAL); fill('#263238'); textSize(12);
  y = wrapText(L.what, px + 12, y + 16, pw - 24, 15) + 8;

  textSize(12); fill('#455a64'); textStyle(BOLD);
  text('Detecting it forces the adversary to', px + 12, y); textStyle(NORMAL);
  fill('#263238'); textSize(12);
  y = wrapText(L.forces, px + 12, y + 16, pw - 24, 15) + 8;

  if (attacker) {
    textSize(12); fill('#c77700'); textStyle(BOLD);
    text('Cost to the attacker', px + 12, y); textStyle(NORMAL);
    fill('#6d4c00'); textSize(12);
    y = wrapText(L.cost, px + 12, y + 16, pw - 24, 15) + 8;
  } else {
    textSize(12); fill('#2e7d32'); textStyle(BOLD);
    text('Sample SIEM detection rule', px + 12, y); textStyle(NORMAL);
    if (selected === idx) {
      fill('#1b5e20'); textSize(12);
      y = wrapText(L.rule, px + 12, y + 16, pw - 24, 15) + 6;
    } else {
      fill('#8a8a8a'); textSize(11.5); textStyle(ITALIC);
      y = wrapText('Click this level to reveal the rule.', px + 12, y + 16, pw - 24, 15);
      textStyle(NORMAL);
    }
  }
}

function mousePressed() {
  if (hovered >= 0 && mouseY < drawHeight) {
    selected = (selected === hovered) ? -1 : hovered;
  }
}

function wrapText(str, x, y, maxW, lineH) {
  const words = str.split(' ');
  let line = '';
  for (const w of words) {
    const test = line + w + ' ';
    if (textWidth(test) > maxW && line.length > 0) { text(line, x, y); y += lineH; line = w + ' '; }
    else line = test;
  }
  text(line, x, y); y += lineH;
  return y;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  viewSelect.position(margin + 110, drawHeight + 12);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
    if (canvasWidth < 360) canvasWidth = 360;
  }
}
