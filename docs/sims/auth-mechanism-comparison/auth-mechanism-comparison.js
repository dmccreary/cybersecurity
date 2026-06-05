// CANVAS_HEIGHT: 560
// Authentication Mechanism Strength Comparison
// Bloom: Evaluating. Students judge which authentication mechanism fits a given
// threat model and user population. A horizontal bar infographic shows, per
// mechanism, three scores: phishing resistance, usability, and recovery ease.
// Two dropdowns change the threat model (which re-scores phishing resistance)
// and highlight which mechanisms are recommended for a chosen population.

let canvasWidth = 800;
let drawHeight = 510;
let controlHeight = 50;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

let threatSelect, audienceSelect;

// Data: each mechanism has scores 0..100. phishing depends on threat model.
// usability and recovery are stable. recommendedFor lists audiences.
const mechanisms = [
  {
    name: "Password only",
    phishing: { opportunistic: 20, spear: 5 },
    usability: 55, recovery: 85,
    recommended: [],
    summary: "Passwords alone are guessable, reusable, and fully phishable. " +
      "Credential-stuffing automates reuse across sites. Easy to reset, but a " +
      "reset is also an attacker's easiest path in. Not recommended on its own."
  },
  {
    name: "Password + SMS",
    phishing: { opportunistic: 45, spear: 15 },
    usability: 60, recovery: 70,
    recommended: ["consumers"],
    summary: "SMS codes stop simple reuse but are phishable and vulnerable to " +
      "SIM-swap attacks. Better than nothing for consumers; weak against a " +
      "targeted attacker who relays the code in real time."
  },
  {
    name: "Password + TOTP",
    phishing: { opportunistic: 60, spear: 20 },
    usability: 55, recovery: 55,
    recommended: ["consumers", "enterprise"],
    summary: "TOTP (authenticator-app codes) defeats SIM-swap attacks but is " +
      "still phishable: the user types the code into whatever site asks. Lost " +
      "device means painful recovery."
  },
  {
    name: "Password + Push MFA",
    phishing: { opportunistic: 65, spear: 30 },
    usability: 80, recovery: 60,
    recommended: ["consumers", "enterprise"],
    summary: "Push approvals are convenient but invite 'MFA fatigue': spam the " +
      "user with prompts until one taps Approve. Resistant to bulk attacks, " +
      "weak against a persistent targeted attacker."
  },
  {
    name: "Push MFA + number match",
    phishing: { opportunistic: 75, spear: 45 },
    usability: 70, recovery: 60,
    recommended: ["enterprise"],
    summary: "Number-matching forces the user to type a code shown on the login " +
      "screen, defeating blind 'approve' fatigue. Still phishable via a " +
      "real-time relay proxy, but materially harder to abuse at scale."
  },
  {
    name: "FIDO2 hardware key",
    phishing: { opportunistic: 98, spear: 95 },
    usability: 65, recovery: 35,
    recommended: ["enterprise", "high-value"],
    summary: "FIDO2 binds the credential to the site's origin, so a phishing " +
      "proxy cannot relay it — phishing-resistant by design. Cost: users must " +
      "carry a key, and losing it makes recovery hard without a backup key."
  },
  {
    name: "Passkey (synced)",
    phishing: { opportunistic: 95, spear: 90 },
    usability: 90, recovery: 75,
    recommended: ["consumers", "enterprise", "high-value"],
    summary: "Passkeys give FIDO2's origin-bound phishing resistance with cloud " +
      "sync, so recovery and usability are excellent. The trade-off is trusting " +
      "the platform's sync security and account-recovery flow."
  }
];

// Bar metric definitions. recovery is framed so green = easy recovery.
const metrics = [
  { key: "phishing",  label: "Phishing resistance" },
  { key: "usability", label: "Usability" },
  { key: "recovery",  label: "Account-recovery ease" }
];

let hoverRow = -1;

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  threatSelect = createSelect();
  threatSelect.option('Opportunistic credential stuffing');
  threatSelect.option('Targeted spear-phishing');
  threatSelect.parent(document.querySelector('main'));
  threatSelect.position(135, drawHeight + 10);

  audienceSelect = createSelect();
  audienceSelect.option('Show recommended for: (none)');
  audienceSelect.option('Consumers');
  audienceSelect.option('Enterprise');
  audienceSelect.option('High-value accounts');
  audienceSelect.parent(document.querySelector('main'));
  audienceSelect.position(135, drawHeight + 10);

  describe('A horizontal bar infographic comparing seven authentication ' +
    'mechanisms across phishing resistance, usability, and account-recovery ' +
    'ease. Dropdowns change the threat model and highlight recommendations.',
    LABEL);
}

function draw() {
  // Drawing region
  fill('aliceblue');
  stroke('silver');
  rect(0, 0, canvasWidth, drawHeight);
  // Control region
  fill('white');
  stroke('silver');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // Title
  noStroke();
  fill('#0d47a1');
  textSize(22);
  textAlign(CENTER, TOP);
  text('Authentication Mechanism Strength', canvasWidth / 2, 8);
  textSize(13);
  fill('#455a64');
  const threatMode = threatSelect.value().indexOf('spear') >= 0 ? 'spear' : 'opportunistic';
  const threatLabel = threatMode === 'spear'
    ? 'Threat model: targeted spear-phishing'
    : 'Threat model: opportunistic credential stuffing';
  text(threatLabel, canvasWidth / 2, 34);

  // Legend (metric colors)
  drawLegend(54);

  // Layout for rows
  const labelW = Math.min(190, canvasWidth * 0.26);
  const chartLeft = labelW + 12;
  const chartRight = canvasWidth - margin - 50; // room for value text
  const chartW = chartRight - chartLeft;
  const top = 90;
  const bottom = drawHeight - 14;
  const rowH = (bottom - top) / mechanisms.length;
  const barGap = 4;
  const barH = (rowH - 10) / metrics.length - barGap;

  const audience = audienceValue();

  hoverRow = -1;
  for (let i = 0; i < mechanisms.length; i++) {
    const rowY = top + i * rowH;
    const m = mechanisms[i];
    const isRec = audience && m.recommended.indexOf(audience) >= 0;

    // Row hover highlight band
    if (mouseY >= rowY && mouseY < rowY + rowH && mouseX >= 0 && mouseX < canvasWidth && mouseY < drawHeight) {
      hoverRow = i;
      noStroke();
      fill(255, 243, 191, 160);
      rect(0, rowY, canvasWidth, rowH);
    }

    // Recommended highlight (left accent + label color)
    if (isRec) {
      noStroke();
      fill('#2e7d32');
      rect(0, rowY + 3, 5, rowH - 6);
    }

    // Mechanism name
    noStroke();
    fill(isRec ? '#1b5e20' : '#212529');
    textAlign(LEFT, CENTER);
    textSize(13);
    text(m.name, 12, rowY + rowH / 2);
    if (isRec) {
      textSize(10);
      fill('#2e7d32');
      text('recommended', 12, rowY + rowH / 2 + 15);
    }

    // Three bars
    for (let b = 0; b < metrics.length; b++) {
      const mk = metrics[b];
      let val;
      if (mk.key === 'phishing') val = m.phishing[threatMode];
      else val = m[mk.key];
      const by = rowY + 6 + b * (barH + barGap);
      // track
      noStroke();
      fill('#e3e8ee');
      rect(chartLeft, by, chartW, barH, 3);
      // fill
      fill(scoreColor(val));
      rect(chartLeft, by, chartW * (val / 100), barH, 3);
      // value
      fill('#37474f');
      textAlign(LEFT, CENTER);
      textSize(11);
      text(val, chartRight + 6, by + barH / 2);
    }

    // Row separator
    stroke(220);
    strokeWeight(1);
    line(0, rowY + rowH, canvasWidth, rowY + rowH);
  }

  // Column headers (metric mini-legend at chart start)
  noStroke();
  textAlign(LEFT, BOTTOM);
  textSize(10);
  fill('#607d8b');
  text('bars per row, top→bottom: phishing resistance · usability · recovery ease',
       chartLeft, top - 4);

  // Tooltip for hovered row
  if (hoverRow >= 0) {
    drawTooltip(mechanisms[hoverRow]);
  }

  // Control labels
  noStroke();
  fill('black');
  textAlign(LEFT, CENTER);
  textSize(13);
  // dropdowns share x; show which is active by stacking — instead place side by side
  // Reposition selects each frame to keep them responsive
  layoutControls();
}

function layoutControls() {
  // Two dropdowns on one row with labels
  const y = drawHeight + 10;
  textAlign(LEFT, CENTER);
  textSize(13);
  fill('black');
  noStroke();
  text('Threat:', 10, drawHeight + 20);
  threatSelect.position(58, y);
  const tW = 215;
  const aLabelX = 58 + tW + 16;
  text('Audience:', aLabelX, drawHeight + 20);
  audienceSelect.position(aLabelX + 66, y);
}

function audienceValue() {
  const v = audienceSelect.value();
  if (v.indexOf('Consumers') >= 0) return 'consumers';
  if (v.indexOf('Enterprise') >= 0) return 'enterprise';
  if (v.indexOf('High-value') >= 0) return 'high-value';
  return null;
}

function scoreColor(v) {
  // traffic light: red (low) -> yellow -> green (high)
  if (v >= 67) return color('#2e9e3f');
  if (v >= 34) return color('#f3b305');
  return color('#d84315');
}

function drawLegend(y) {
  const items = [
    { c: '#d84315', t: 'weak' },
    { c: '#f3b305', t: 'moderate' },
    { c: '#2e9e3f', t: 'strong' }
  ];
  let x = canvasWidth / 2 - 130;
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(12);
  for (const it of items) {
    fill(it.c);
    rect(x, y, 14, 12, 2);
    fill('#37474f');
    text(it.t, x + 18, y + 6);
    x += 90;
  }
}

function drawTooltip(m) {
  const pad = 10;
  const boxW = Math.min(330, canvasWidth - 40);
  const lines = wrapText(m.summary, boxW - 2 * pad, 12);
  const boxH = 26 + lines.length * 16 + pad;
  let bx = mouseX + 14;
  let by = mouseY + 8;
  if (bx + boxW > canvasWidth - 6) bx = canvasWidth - boxW - 6;
  if (by + boxH > drawHeight - 4) by = drawHeight - boxH - 4;
  if (by < 4) by = 4;

  stroke('#455a64');
  strokeWeight(1);
  fill(255, 255, 255, 245);
  rect(bx, by, boxW, boxH, 8);

  noStroke();
  fill('#0d47a1');
  textAlign(LEFT, TOP);
  textSize(13);
  text(m.name, bx + pad, by + pad);
  fill('#37474f');
  textSize(12);
  let ty = by + pad + 20;
  for (const ln of lines) {
    text(ln, bx + pad, ty);
    ty += 16;
  }
}

function wrapText(str, maxW, size) {
  textSize(size);
  const words = str.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (textWidth(test) > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
}

function updateCanvasSize() {
  const container = document.querySelector('main');
  if (container) {
    canvasWidth = container.offsetWidth;
  }
}
