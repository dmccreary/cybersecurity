// CANVAS_HEIGHT: 570
// Access Control Decision Explorer — p5.js MicroSim (Bloom: Analyze).
// Given a request (subject, action, object), learners predict and then compare
// how DAC, MAC, RBAC, and ABAC each render the access decision, and identify
// which models forbid an apparently reasonable request.
//
// All subjects, objects, and policies live in data.json. The four evaluate*
// functions below form a small policy engine that reads only that data, so an
// instructor can change the scenario without touching this sketch.

let canvasWidth = 800;
let drawHeight = 490;
let controlHeight = 80;
let canvasHeight = drawHeight + controlHeight;
let margin = 25;
let defaultTextSize = 16;

// --- book palette ---
const HEADER_BLUE = '#1565c0';
const ALLOW_GREEN = '#4caf50';
const DENY_RED = '#d32f2f';
const SLATE = '#455a64';
const PENDING_GRAY = '#9e9e9e';

// controls
let subjectSelect, actionSelect, objectSelect;
let requestButton, randomizeButton, policyCheckbox;
let wideLabels = null;

// state
let policyData = null;      // contents of data.json
let loadError = null;
let pending = false;        // true while the learner is predicting
let results = null;         // decisions for the current request

const MODELS = [
  { key: 'dac',  short: 'DAC',  full: 'Discretionary Access Control' },
  { key: 'mac',  short: 'MAC',  full: 'Mandatory Access Control' },
  { key: 'rbac', short: 'RBAC', full: 'Role-Based Access Control' },
  { key: 'abac', short: 'ABAC', full: 'Attribute-Based Access Control' }
];

function setup() {
  updateCanvasSize();
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent(document.querySelector('main'));

  const mainElement = document.querySelector('main');

  // Row 1: the three parts of the request
  subjectSelect = createSelect();
  subjectSelect.parent(mainElement);
  subjectSelect.changed(requestChanged);

  actionSelect = createSelect();
  actionSelect.parent(mainElement);
  actionSelect.changed(requestChanged);

  objectSelect = createSelect();
  objectSelect.parent(mainElement);
  objectSelect.changed(requestChanged);

  // Row 2: evaluate, randomize, and the full-policy toggle
  requestButton = createButton('Request');
  requestButton.parent(mainElement);
  requestButton.position(10, drawHeight + 45);
  requestButton.mousePressed(evaluateRequest);

  randomizeButton = createButton('Randomize scenario');
  randomizeButton.parent(mainElement);
  randomizeButton.position(90, drawHeight + 45);
  randomizeButton.mousePressed(randomizeScenario);

  policyCheckbox = createCheckbox(' Show policy', false);
  policyCheckbox.parent(mainElement);
  policyCheckbox.position(240, drawHeight + 46);
  policyCheckbox.style('font-size', '16px');

  layoutControls();

  // The policy data is loaded after setup so the page still renders (with a
  // clear message) if data.json cannot be fetched.
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      policyData = data;
      data.subjects.forEach(s => subjectSelect.option(s.label, s.id));
      data.actions.forEach(a => actionSelect.option(a));
      data.objects.forEach(o => objectSelect.option(o.label, o.id));
      subjectSelect.selected(data.default.subject);
      actionSelect.selected(data.default.action);
      objectSelect.selected(data.default.object);
      evaluateRequest();   // default request starts fully evaluated
    })
    .catch(err => { loadError = String(err); });

  describe('Four panels, one each for the DAC, MAC, RBAC, and ABAC access ' +
    'control models, showing the policy each model applies to a chosen ' +
    'subject, action, and object, and whether it allows or denies the request.',
    LABEL);
}

// ---------- request handling ----------

function currentRequest() {
  return {
    subject: policyData.subjects.find(s => s.id === subjectSelect.value()),
    action: actionSelect.value(),
    object: policyData.objects.find(o => o.id === objectSelect.value())
  };
}

// A changed dropdown hides the decisions so the learner can predict first.
function requestChanged() {
  if (!policyData) return;
  pending = true;
  results = evaluateAll(currentRequest());
}

function evaluateRequest() {
  if (!policyData) return;
  results = evaluateAll(currentRequest());
  pending = false;
}

function randomizeScenario() {
  if (!policyData) return;
  const before = subjectSelect.value() + actionSelect.value() + objectSelect.value();
  let after = before;
  while (after === before) {
    subjectSelect.selected(random(policyData.subjects).id);
    actionSelect.selected(random(policyData.actions));
    objectSelect.selected(random(policyData.objects).id);
    after = subjectSelect.value() + actionSelect.value() + objectSelect.value();
  }
  requestChanged();
}

// ---------- the policy engine ----------

function evaluateAll(request) {
  return {
    dac: evaluateDac(request),
    mac: evaluateMac(request),
    rbac: evaluateRbac(request),
    abac: evaluateAbac(request)
  };
}

// DAC: classic Unix owner / group / other permission bits set by the owner.
function evaluateDac({ subject, action, object }) {
  const bitIndex = { read: 0, write: 1, execute: 2 }[action];
  const applies = [
    object.id + ': owner ' + object.owner + ', group ' + object.group + ', mode ' + object.mode,
    subject.name + ': uid ' + subject.uid + ', groups ' + subject.groups.join(', ')
  ];
  const full = policyData.objects.map(o => ({
    text: o.id + '  ' + o.owner + ':' + o.group + '  ' + o.mode,
    matched: o.id === object.id
  }));
  full.push({ text: 'uid 0 (root) bypasses read and write checks', matched: !!subject.superuser });

  if (subject.superuser) {
    if (action !== 'execute') {
      return { allow: true, applies, full,
        reason: subject.name + ' is uid 0, and the superuser bypasses the permission bits for ' + action + '.' };
    }
    const anyExecuteBit = [2, 5, 8].some(i => object.mode[i] === 'x');
    return { allow: anyExecuteBit, applies, full,
      reason: anyExecuteBit
        ? 'root may execute any file that has at least one execute bit set.'
        : 'Even root cannot execute a file that has no execute bit set.' };
  }

  let who, bits;
  if (subject.uid === object.owner) {
    who = subject.name + ' owns the file, so the owner bits ';
    bits = object.mode.slice(0, 3);
  } else if (subject.groups.includes(object.group)) {
    who = subject.name + ' is in group ' + object.group + ', so the group bits ';
    bits = object.mode.slice(3, 6);
  } else {
    who = subject.name + ' is neither the owner nor in group ' + object.group + ', so the "other" bits ';
    bits = object.mode.slice(6, 9);
  }
  const allow = bits[bitIndex] !== '-';
  return { allow, applies, full,
    reason: who + bits + ' apply: ' + action + ' is ' + (allow ? 'allowed.' : 'denied.') };
}

// MAC: SELinux-style type enforcement. Default deny; only the system policy
// (never the file owner) can add an allow rule.
function evaluateMac({ subject, action, object }) {
  const rules = policyData.mac.allow;
  const rule = rules.find(r => r.domain === subject.domain && r.type === object.type);
  const allow = !!rule && rule.perms.includes(action);
  const ruleText = r => 'allow ' + r.domain + ' ' + r.type + ' { ' + r.perms.join(' ') + ' }';
  const applies = [
    subject.name + ' runs in domain ' + subject.domain,
    object.id + ' is labeled ' + object.type,
    rule ? ruleText(rule) : 'no allow rule for ' + subject.domain + ' on ' + object.type
  ];
  const full = rules.map(r => ({ text: ruleText(r), matched: r === rule }));
  let reason;
  if (allow) {
    reason = 'An allow rule grants ' + action + ' to ' + subject.domain + ' on ' + object.type +
      '. Only the system policy can change it.';
  } else if (rule) {
    reason = 'The rule for ' + subject.domain + ' on ' + object.type + ' does not include ' +
      action + ', and type enforcement denies by default.';
  } else {
    reason = 'No rule lets ' + subject.domain + ' touch ' + object.type +
      ', and type enforcement denies by default' + (subject.superuser ? ', even for root.' : '.');
  }
  return { allow, applies, full, reason };
}

// RBAC: permissions attach to roles; subjects get permissions only via roles.
function evaluateRbac({ subject, action, object }) {
  const roles = policyData.rbac.roles;
  const needed = object.id + ':' + action;
  const grantingRole = subject.roles.find(r => (roles[r] || []).includes(needed));
  const allow = !!grantingRole;
  const applies = [subject.name + ' holds role ' + subject.roles.join(', ')];
  subject.roles.forEach(r => applies.push(r + ' grants ' + (roles[r] || []).join(', ')));
  const full = Object.keys(roles).map(r => ({
    text: r + ': ' + roles[r].join(', '),
    matched: subject.roles.includes(r)
  }));
  return { allow, applies, full,
    reason: allow
      ? 'Role ' + grantingRole + ' includes the permission ' + needed + '.'
      : 'No role held by ' + subject.name + ' includes the permission ' + needed + '.' };
}

// ABAC: permit rules over subject and resource attributes; default deny.
function attributeValue(path, subject, object) {
  const [scope, name] = path.split('.');
  return (scope === 'subject' ? subject : object).attributes[name];
}

function checkCondition(condition, subject, object) {
  const actual = attributeValue(condition.attr, subject, object);
  if ('equals_attr' in condition) {
    const other = attributeValue(condition.equals_attr, subject, object);
    return { ok: actual === other,
      text: condition.attr + ' = ' + condition.equals_attr + ' (' + actual + ' vs ' + other + ')' };
  }
  if ('not_equals' in condition) {
    return { ok: actual !== condition.not_equals,
      text: condition.attr + ' is not ' + condition.not_equals + ' (it is ' + actual + ')' };
  }
  return { ok: actual === condition.equals,
    text: condition.attr + ' = ' + condition.equals + ' (it is ' + actual + ')' };
}

function evaluateAbac({ subject, action, object }) {
  const rules = policyData.abac.rules;
  const describeAttributes = attrs => Object.keys(attrs).map(k => k + ' = ' + attrs[k]).join(', ');
  const applies = [
    'subject: ' + describeAttributes(subject.attributes),
    'resource: ' + describeAttributes(object.attributes)
  ];

  let matchedRule = null;
  let closest = null;   // the same-action rule that came nearest to matching
  rules.filter(r => r.action === action).forEach(rule => {
    const checks = rule.when.map(c => checkCondition(c, subject, object));
    const passed = checks.filter(c => c.ok).length;
    if (passed === checks.length) {
      if (!matchedRule) matchedRule = rule;
    } else if (!closest || passed > closest.passed) {
      closest = { rule, passed, failed: checks.find(c => !c.ok) };
    }
  });

  const full = rules.map(r => ({ text: r.id + '  ' + r.text, matched: r === matchedRule }));
  full.push({ text: 'otherwise: deny', matched: !matchedRule });

  if (matchedRule) {
    return { allow: true, applies, full,
      reason: 'Rule ' + matchedRule.id + ' matches (' + matchedRule.text + ').' };
  }
  return { allow: false, applies, full,
    reason: closest
      ? 'No permit rule matches. ' + closest.rule.id + ' fails on ' + closest.failed.text + '.'
      : 'No permit rule covers ' + action + ', so the default is deny.' };
}

// A one-sentence summary of the four answers plus an optional explanatory note.
function comparisonText(request) {
  const allowed = MODELS.filter(m => results[m.key].allow).map(m => m.short);
  const denied = MODELS.filter(m => !results[m.key].allow).map(m => m.short);
  const what = request.subject.name + ' may ' + (denied.length === 0 ? '' : 'not ') +
    request.action + ' ' + request.object.id + '.';
  if (denied.length === 0) return { summary: 'All four models ALLOW: ' + what, note: '' };
  if (allowed.length === 0) return { summary: 'All four models DENY: ' + what, note: '' };

  const summary = 'The models disagree. ALLOW: ' + allowed.join(', ') + '. DENY: ' + denied.join(', ') + '.';
  const authored = (policyData.notes || []).find(n => n.subject === request.subject.id &&
    n.action === request.action && n.object === request.object.id);
  if (authored) return { summary, note: authored.text };
  if (allowed.length === 1 && allowed[0] === 'DAC') {
    return { summary, note: 'Only DAC says yes: owner, group, and root-override bits are coarse, so the centrally managed models catch what DAC lets through.' };
  }
  if (denied.length === 1) {
    return { summary, note: 'Only ' + denied[0] + ' says no: ' + results[denied[0].toLowerCase()].reason };
  }
  return { summary, note: 'Each model asks a different question (owner bits, system labels, roles, or attributes), so they need not agree.' };
}

// ---------- drawing ----------

function draw() {
  updateCanvasSize();

  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  fill('white');
  rect(0, drawHeight, canvasWidth, controlHeight);

  // title
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textAlign(CENTER, TOP);
  textSize(fitSize('Access Control Decision Explorer', canvasWidth - 20, 24));
  text('Access Control Decision Explorer', canvasWidth / 2, 8);

  drawControlLabels();

  if (!policyData) {
    noStroke();
    fill(loadError ? DENY_RED : SLATE);
    textAlign(CENTER, CENTER);
    textSize(16);
    text(loadError
      ? 'Could not load data.json. Open this MicroSim through a web server (for example mkdocs serve).'
      : 'Loading policy data...', 20, 60, canvasWidth - 40, drawHeight - 120);
    return;
  }

  const request = currentRequest();

  // the request being evaluated
  noStroke();
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  fill(SLATE);
  const requestLine = 'Request: ' + request.subject.name + ' wants to ' + request.action +
    ' ' + request.object.id;
  textSize(fitSize(requestLine, canvasWidth - 20, 17));
  text(requestLine, canvasWidth / 2, 42);
  textStyle(NORMAL);

  // four model panels in a 2 x 2 grid
  const gap = 8;
  const panelsTop = 70;
  const panelW = (canvasWidth - 30 - gap) / 2;
  const panelH = 168;
  MODELS.forEach((model, i) => {
    const x = 15 + (i % 2) * (panelW + gap);
    const y = panelsTop + Math.floor(i / 2) * (panelH + gap);
    drawPanel(model, results[model.key], x, y, panelW, panelH);
  });

  // comparison strip
  const stripY = panelsTop + 2 * panelH + gap + 8;
  const stripH = drawHeight - stripY - 8;
  stroke(HEADER_BLUE);
  fill('white');
  rect(15, stripY, canvasWidth - 30, stripH, 8);
  noStroke();
  fill('black');
  const comparison = pending
    ? { summary: 'Prediction time. For each model, use the policy shown to decide ALLOW or DENY, then press Request to check.', note: '' }
    : comparisonText(request);
  // drop the explanatory note on canvases too narrow to hold it legibly
  const fullText = comparison.summary + (comparison.note ? ' ' + comparison.note : '');
  const stripText = wrappedFits(fullText, canvasWidth - 50, stripH - 10, 15, 19) ? fullText : comparison.summary;
  drawWrapped(stripText, 25, stripY + 6, canvasWidth - 50, stripH - 10, 15, 19);
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

// Break str into lines no wider than maxWidth at the current text size
function wrapLines(str, maxWidth) {
  const words = str.split(' ');
  const lines = [];
  let line = '';
  words.forEach(word => {
    const candidate = line ? line + ' ' + word : word;
    if (textWidth(candidate) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  return lines;
}

const MIN_TEXT_SIZE = 11;

// Wrap str to width w, shrinking the font (never below MIN_TEXT_SIZE) until
// the lines fit in height h. Leaves textSize set to the size chosen.
function fitWrapped(str, w, h, startSize, startLeading) {
  let size = startSize;
  let leading = startLeading;
  textSize(size);
  let lines = wrapLines(str, w);
  while (lines.length * leading > h && size > MIN_TEXT_SIZE) {
    size -= 1;
    leading -= 1;
    textSize(size);
    lines = wrapLines(str, w);
  }
  return { lines, size, leading, fits: lines.length * leading <= h };
}

function wrappedFits(str, w, h, startSize, startLeading) {
  return fitWrapped(str, w, h, startSize, startLeading).fits;
}

// Draw wrapped text in a box, shrinking the font until it fits the height
function drawWrapped(str, x, y, w, h, startSize, startLeading) {
  const fitted = fitWrapped(str, w, h, startSize, startLeading);
  textAlign(LEFT, TOP);
  fitted.lines.forEach((line, i) => text(line, x, y + i * fitted.leading));
  return fitted.lines.length * fitted.leading;
}

function drawBadge(label, badgeColor, labelColor, x, y, w, h) {
  stroke('white');
  strokeWeight(1);
  fill(badgeColor);
  rect(x, y, w, h, 6);
  noStroke();
  fill(labelColor);
  textStyle(BOLD);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2 + 1);
  textStyle(NORMAL);
}

function drawPanel(model, result, x, y, w, h) {
  const headerH = 30;
  const showFullPolicy = policyCheckbox.checked();

  // body and header
  stroke('silver');
  strokeWeight(1);
  fill('white');
  rect(x, y, w, h, 8);
  noStroke();
  fill(HEADER_BLUE);
  rect(x, y, w, headerH, 8, 8, 0, 0);

  // decision badge at the right end of the header
  const badgeW = 64;
  if (pending) {
    drawBadge('?', PENDING_GRAY, 'white', x + w - badgeW - 6, y + 4, badgeW, headerH - 8);
  } else if (result.allow) {
    drawBadge('ALLOW', ALLOW_GREEN, 'black', x + w - badgeW - 6, y + 4, badgeW, headerH - 8);
  } else {
    drawBadge('DENY', DENY_RED, 'white', x + w - badgeW - 6, y + 4, badgeW, headerH - 8);
  }

  // model name
  noStroke();
  fill('white');
  textStyle(BOLD);
  textAlign(LEFT, CENTER);
  const headerRoom = w - badgeW - 24;
  textSize(15);
  // spell out the model names only when all four fit, so the headers match
  const allFit = MODELS.every(m => textWidth(m.short + ' - ' + m.full) <= headerRoom);
  text(allFit ? model.short + ' - ' + model.full : model.short, x + 10, y + headerH / 2 + 1);
  textStyle(NORMAL);

  const bodyX = x + 10;
  const bodyW = w - 20;
  let cursorY = y + headerH + 8;
  const bodyBottom = y + h - 6;

  if (showFullPolicy) {
    // every rule of this model, with the one that decided the request marked
    let size = 13;
    let leading = 16;
    textSize(size);
    let rows = result.full.map(rule => wrapLines(rule.text, bodyW - 8));
    while (rows.reduce((n, r) => n + r.length, 0) * leading > bodyBottom - cursorY && size > 10) {
      size -= 1;
      leading -= 1;
      textSize(size);
      rows = result.full.map(rule => wrapLines(rule.text, bodyW - 8));
    }
    textAlign(LEFT, TOP);
    result.full.forEach((rule, i) => {
      const highlight = rule.matched && !pending;
      if (highlight) {
        noStroke();
        fill(255, 236, 179);
        rect(bodyX - 4, cursorY - 1, bodyW + 8, rows[i].length * leading, 3);
      }
      noStroke();
      fill(highlight ? 'black' : SLATE);
      textStyle(highlight ? BOLD : NORMAL);
      rows[i].forEach(line => {
        text(line, bodyX, cursorY);
        cursorY += leading;
      });
    });
    textStyle(NORMAL);
    return;
  }

  // decision view: the slice of policy that applies, then the rationale.
  // Shrink both together until the whole panel body fits.
  const why = pending ? 'Your prediction: will ' + model.short + ' allow or deny?' : result.reason;
  const dividerSpace = 11;
  const room = bodyBottom - cursorY - dividerSpace;
  let size = 15;
  let leading = 19;
  let policyLines, whyLines;
  while (true) {
    textSize(size);
    policyLines = [];
    result.applies.forEach(entry => wrapLines(entry, bodyW).forEach(part => policyLines.push(part)));
    whyLines = wrapLines(why, bodyW);
    if ((policyLines.length + whyLines.length) * leading <= room || size <= MIN_TEXT_SIZE) break;
    size -= 1;
    leading -= 1;
  }

  noStroke();
  fill(SLATE);
  textAlign(LEFT, TOP);
  policyLines.forEach(part => {
    text(part, bodyX, cursorY);
    cursorY += leading;
  });
  cursorY += 5;
  stroke(225);
  line(bodyX, cursorY, bodyX + bodyW, cursorY);
  cursorY += 6;
  noStroke();
  fill('black');
  whyLines.forEach(part => {
    text(part, bodyX, cursorY);
    cursorY += leading;
  });
}

// ---------- controls ----------

function drawControlLabels() {
  noStroke();
  fill('black');
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  textSize(defaultTextSize);
  const layout = selectLayout();
  text('Subject:', layout.subjectLabelX, drawHeight + 21);
  text('Action:', layout.actionLabelX, drawHeight + 21);
  text('Object:', layout.objectLabelX, drawHeight + 21);
}

// Horizontal positions for the three label + dropdown pairs on row 1.
// The dropdowns share whatever width is left after the labels.
function selectLayout() {
  const labelW = 64;          // room for "Subject:" at 16px
  const gap = 10;
  const left = 10;
  const selectRoom = canvasWidth - 2 * left - 3 * labelW - 2 * gap;
  const scale = Math.min(1, selectRoom / (160 + 90 + 250));
  const subjectW = Math.floor(160 * scale);
  const actionW = Math.floor(90 * scale);
  const objectW = Math.floor(250 * scale);
  const subjectLabelX = left;
  const actionLabelX = subjectLabelX + labelW + subjectW + gap;
  const objectLabelX = actionLabelX + labelW + actionW + gap;
  return { labelW, subjectW, actionW, objectW, subjectLabelX, actionLabelX, objectLabelX };
}

function layoutControls() {
  const layout = selectLayout();
  subjectSelect.position(layout.subjectLabelX + layout.labelW, drawHeight + 9);
  subjectSelect.size(layout.subjectW);
  actionSelect.position(layout.actionLabelX + layout.labelW, drawHeight + 9);
  actionSelect.size(layout.actionW);
  objectSelect.position(layout.objectLabelX + layout.labelW, drawHeight + 9);
  objectSelect.size(layout.objectW);

  // shorten the second-row labels when the canvas is narrow
  const wide = canvasWidth >= 480;
  if (wide !== wideLabels) {
    wideLabels = wide;
    randomizeButton.html(wide ? 'Randomize scenario' : 'Randomize');
    policyCheckbox.position(wide ? 240 : 180, drawHeight + 46);
  }
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
  if (typeof policyCheckbox !== 'undefined') {
    layoutControls();
  }
}
