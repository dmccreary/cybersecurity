// Cyber Law Jurisdictional Map
// CANVAS_HEIGHT: 610
// Bloom: Understand -> Analyze. Given a scenario, the student identifies which
// laws apply and why. Hover a statute for its scope/obligation/breach window;
// pick a scenario to highlight the applicable statutes and read why each applies.

let canvasWidth = 900;
let drawHeight = 560;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 16;
let defaultTextSize = 16;

const BLUE = '#1565c0';
const SLATE = '#455a64';
const CREAM = '#fff8e1';
const ALERT = '#ffa000';
const DIM = '#cfd4d8';

// Statutes grouped into three bands. id is used by scenarios.
const BANDS = [
  {
    title: 'U.S. Federal',
    color: '#1565c0',
    statutes: [
      { id: 'CFAA', name: 'CFAA', tag: 'Cybercrime', scope: 'Unauthorized access to protected computers in the U.S.', who: 'Anyone accessing U.S. computer systems.', oblig: 'Prohibits unauthorized access and exceeding authorization.', breach: 'N/A (criminal statute, not a breach-notification law).' },
      { id: 'ECPA', name: 'ECPA', tag: 'Communications', scope: 'Interception and disclosure of electronic communications.', who: 'Providers and anyone intercepting communications.', oblig: 'Restricts wiretapping and stored-communication access.', breach: 'N/A.' },
      { id: 'HIPAA', name: 'HIPAA', tag: 'Health', scope: 'Protected health information (PHI) in the U.S.', who: 'Covered entities and their business associates.', oblig: 'Safeguard PHI; honor patient rights.', breach: 'Notify within 60 days of discovery.' },
      { id: 'GLBA', name: 'GLBA', tag: 'Finance', scope: 'Nonpublic personal financial information.', who: 'U.S. financial institutions.', oblig: 'Safeguards Rule; privacy notices.', breach: 'No fixed federal window; "as soon as possible" per guidance.' },
      { id: 'FERPA', name: 'FERPA', tag: 'Education', scope: 'Student education records.', who: 'Schools receiving federal funds.', oblig: 'Protect records; honor access rights.', breach: 'No mandated notification window.' }
    ]
  },
  {
    title: 'U.S. State',
    color: '#455a64',
    statutes: [
      { id: 'CCPA', name: 'CCPA / CPRA', tag: 'California', scope: 'Personal information of California residents.', who: 'For-profit businesses meeting CCPA thresholds.', oblig: 'Consumer rights to know, delete, and opt out.', breach: '"Without unreasonable delay."' },
      { id: 'STATE', name: '+ 19 other state laws', tag: 'State privacy', scope: 'Resident personal data across many U.S. states.', who: 'Businesses handling those residents\' data.', oblig: 'Varies; mostly consumer-rights and breach rules.', breach: 'Typically 30-60 days; varies by state.' }
    ]
  },
  {
    title: 'International',
    color: '#6a1b9a',
    statutes: [
      { id: 'GDPR', name: 'GDPR', tag: 'EU privacy', scope: 'Personal data of people in the EU/EEA.', who: 'Controllers/processors handling EU personal data, wherever located.', oblig: 'Lawful basis, data-subject rights, DPO where required.', breach: 'Notify supervisory authority within 72 hours.' },
      { id: 'NIS2', name: 'NIS2', tag: 'EU critical infra', scope: 'Essential and important entities in the EU.', who: 'Operators of critical services in the EU.', oblig: 'Risk management and incident-handling measures.', breach: 'Early warning within 24 hours; report within 72 hours.' }
    ]
  }
];

// Scenarios: which statute ids apply, and why.
const SCENARIOS = {
  'Pick a scenario...': { apply: [], why: {} },
  'U.S. healthcare co. stores EU patient data on California servers': {
    apply: ['HIPAA', 'CCPA', 'GDPR'],
    why: {
      HIPAA: 'U.S. covered entity handling PHI must safeguard it.',
      CCPA: 'Data sits on California servers; CA residents\' data may be involved.',
      GDPR: 'The patients are EU data subjects, so GDPR follows the data.'
    }
  },
  'EU resident, U.S. SaaS, financial data': {
    apply: ['GLBA', 'GDPR'],
    why: {
      GLBA: 'A U.S. financial-service provider must follow the Safeguards Rule.',
      GDPR: 'The customer is an EU resident, so GDPR applies extraterritorially.'
    }
  },
  'U.S. university breach exposes student records': {
    apply: ['FERPA', 'STATE'],
    why: {
      FERPA: 'Education records at a federally funded school are FERPA-protected.',
      STATE: 'State breach-notification laws govern notifying affected students.'
    }
  },
  'Attacker accesses a U.S. company server without authorization': {
    apply: ['CFAA', 'ECPA'],
    why: {
      CFAA: 'Unauthorized access to a protected computer is a CFAA offense.',
      ECPA: 'If communications were intercepted, ECPA also applies.'
    }
  },
  'Ransomware hits an EU energy operator': {
    apply: ['GDPR', 'NIS2'],
    why: {
      NIS2: 'An EU critical-infrastructure operator has NIS2 incident duties.',
      GDPR: 'If personal data is affected, GDPR breach rules also apply.'
    }
  }
};

let scenarioKeys = Object.keys(SCENARIOS);
let currentScenario = scenarioKeys[0];
let scenarioSelect;
let cards = [];          // computed card rects each frame
let hoverCard = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));
  textFont('Arial');

  scenarioSelect = createSelect();
  for (const k of scenarioKeys) scenarioSelect.option(k);
  scenarioSelect.selected(currentScenario);
  scenarioSelect.changed(() => { currentScenario = scenarioSelect.value(); });
  scenarioSelect.parent(document.querySelector('main'));

  positionControls();
  describe('An interactive cyber-law jurisdictional map. Statutes are grouped into three bands — U.S. Federal, U.S. State, and International. Hovering a statute shows its scope, who it regulates, its key obligation, and its breach-notification window. Choosing a scenario highlights the statutes that apply in cybersecurity blue, dims the others, and explains in a side panel why each applies.', LABEL);
}

function positionControls() {
  scenarioSelect.position(150, drawHeight + 12);
  scenarioSelect.style('font-size', '14px');
  scenarioSelect.style('max-width', (canvasWidth - 170) + 'px');
}

function draw() {
  updateCanvasSize();

  // backgrounds
  noStroke();
  fill(CREAM);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);
  stroke('silver'); noFill();
  rect(0, 0, canvasWidth, drawHeight);
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title
  noStroke(); fill('black');
  textSize(21); textAlign(CENTER, TOP);
  text('Cyber Law Jurisdictional Map', canvasWidth / 2, 8);

  const sc = SCENARIOS[currentScenario];
  const applySet = sc.apply;

  const panelW = constrain(canvasWidth * 0.32, 220, 320);
  const bandsAreaW = canvasWidth - panelW - margin * 2;
  drawBands(margin, 40, bandsAreaW, applySet);
  drawSidePanel(canvasWidth - panelW - margin, 40, panelW, sc);

  // control label
  noStroke(); fill('black');
  textAlign(LEFT, CENTER); textSize(14);
  text('Scenario:', 12, drawHeight + 25);

  // hover tooltip last
  if (hoverCard >= 0 && hoverCard < cards.length) {
    drawTooltip(cards[hoverCard]);
  }
}

function drawBands(x0, y0, w, applySet) {
  cards = [];
  const bandGap = 10;
  const bandW = (w - bandGap * 2) / 3;
  const cardH = 52;
  const cardGap = 8;
  for (let b = 0; b < BANDS.length; b++) {
    const band = BANDS[b];
    const bx = x0 + b * (bandW + bandGap);
    // band header
    noStroke();
    fill(band.color);
    rect(bx, y0, bandW, 30, 6, 6, 0, 0);
    fill('white'); textAlign(CENTER, CENTER); textSize(14); textStyle(BOLD);
    text(band.title, bx + bandW / 2, y0 + 15);
    textStyle(NORMAL);
    // band body
    fill('rgba(255,255,255,0.55)');
    const bodyH = drawHeight - y0 - 40;
    rect(bx, y0 + 30, bandW, bodyH, 0, 0, 6, 6);

    // statute cards
    let cy = y0 + 40;
    for (const s of band.statutes) {
      const applies = applySet.length === 0 || applySet.includes(s.id);
      const highlighted = applySet.length > 0 && applySet.includes(s.id);
      const dimmed = applySet.length > 0 && !applySet.includes(s.id);
      const rectIdx = cards.length;
      cards.push({ x: bx + 8, y: cy, w: bandW - 16, h: cardH, s: s, band: band });

      stroke(highlighted ? BLUE : (dimmed ? DIM : band.color));
      strokeWeight(highlighted ? 3 : 1.5);
      fill(highlighted ? '#e3f0fb' : (dimmed ? '#f3f4f5' : 'white'));
      rect(bx + 8, cy, bandW - 16, cardH, 7);

      noStroke();
      fill(dimmed ? '#9aa0a4' : '#212529');
      textAlign(LEFT, TOP); textSize(13); textStyle(BOLD);
      text(s.name, bx + 16, cy + 8, bandW - 28, 18);
      textStyle(NORMAL);
      fill(dimmed ? '#aab0b4' : SLATE);
      textSize(11);
      text(s.tag, bx + 16, cy + 28, bandW - 28, 16);

      cy += cardH + cardGap;
    }
  }
  // hint
  noStroke(); fill('#6c757d'); textSize(11); textAlign(LEFT, TOP);
  text('Hover a statute for details. Pick a scenario to highlight the laws that apply.',
       x0, drawHeight - 22);
}

function drawSidePanel(x, y, w, sc) {
  const h = drawHeight - y - 14;
  stroke(SLATE); strokeWeight(1.5);
  fill('white');
  rect(x, y, w, h, 8);

  noStroke();
  fill(BLUE);
  rect(x, y, w, 30, 8, 8, 0, 0);
  fill('white'); textAlign(LEFT, CENTER); textSize(14); textStyle(BOLD);
  text('Why these laws apply', x + 12, y + 15);
  textStyle(NORMAL);

  let ty = y + 42;
  if (sc.apply.length === 0) {
    fill('#555'); textAlign(LEFT, TOP); textSize(13);
    text('Choose a scenario from the dropdown below. The statutes that apply will highlight in blue and an explanation for each will appear here.',
         x + 12, ty, w - 24, h - 50);
    return;
  }
  for (const id of sc.apply) {
    const statute = findStatute(id);
    fill(BLUE); textStyle(BOLD); textAlign(LEFT, TOP); textSize(13);
    text(statute.name, x + 12, ty, w - 24, 18);
    ty += 18;
    textStyle(NORMAL); fill('#333'); textSize(12);
    const why = sc.why[id] || '';
    const lines = wrapText(why, w - 24, 12);
    text(why, x + 12, ty, w - 24, lines * 15 + 4);
    ty += lines * 15 + 12;
  }
}

function findStatute(id) {
  for (const band of BANDS) for (const s of band.statutes) if (s.id === id) return s;
  return { name: id };
}

// estimate wrapped line count
function wrapText(str, boxW, size) {
  textSize(size);
  const words = str.split(' ');
  let line = '', lines = 1;
  for (const wd of words) {
    const test = line + wd + ' ';
    if (textWidth(test) > boxW && line.length > 0) { lines++; line = wd + ' '; }
    else line = test;
  }
  return lines;
}

function drawTooltip(c) {
  const s = c.s;
  const boxW = min(310, canvasWidth - 24);
  const boxH = 138;
  let bx = c.x + c.w + 10;
  let by = c.y;
  if (bx + boxW > canvasWidth - 8) bx = c.x - boxW - 10;
  if (bx < 8) bx = 8;
  by = constrain(by, 40, drawHeight - boxH - 16);

  stroke(SLATE); strokeWeight(1.5);
  fill(255, 255, 255, 248);
  rect(bx, by, boxW, boxH, 8);

  noStroke();
  fill(c.band.color);
  textAlign(LEFT, TOP); textSize(14); textStyle(BOLD);
  text(s.name + ' — ' + s.tag, bx + 10, by + 8, boxW - 20, 18);
  textStyle(NORMAL); fill('#333'); textSize(11.5);
  let ty = by + 30;
  ty = tipLine(bx, ty, boxW, 'Scope: ', s.scope);
  ty = tipLine(bx, ty, boxW, 'Regulates: ', s.who);
  ty = tipLine(bx, ty, boxW, 'Obligation: ', s.oblig);
  ty = tipLine(bx, ty, boxW, 'Breach notice: ', s.breach);
}

function tipLine(bx, ty, boxW, label, val) {
  noStroke();
  fill(SLATE); textStyle(BOLD); textSize(11.5);
  text(label, bx + 10, ty);
  const lw = textWidth(label);
  textStyle(NORMAL); fill('#333');
  text(val, bx + 10 + lw, ty, boxW - 20 - lw, 28);
  const lines = wrapText(val, boxW - 20 - lw, 11.5);
  return ty + max(15, lines * 13) + 2;
}

function mouseMoved() {
  hoverCard = -1;
  if (mouseY > drawHeight) return;
  for (let i = 0; i < cards.length; i++) {
    const c = cards[i];
    if (mouseX >= c.x && mouseX <= c.x + c.w && mouseY >= c.y && mouseY <= c.y + c.h) {
      hoverCard = i; break;
    }
  }
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) canvasWidth = container.offsetWidth;
  if (typeof scenarioSelect !== 'undefined' && scenarioSelect) positionControls();
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}
