// CANVAS_HEIGHT: 880
// Risk Treatment Decision Tree — Mermaid hover interaction.
// Hovering (or tapping) a node updates the right-side info panel with a
// concrete explanation of that step in the four-option risk treatment flow:
// AVOID, MITIGATE, TRANSFER, ACCEPT.

const nodeInfo = {
  'Risk': 'A single identified risk, rated by likelihood times impact. Before ' +
    'treatment it is just a number on a register — the job is to assign it ' +
    'exactly one treatment, an owner, and a date.',
  'D1': 'Avoidance question: can you simply stop doing the risky activity ' +
    'without an unacceptable hit to the business? If a feature, integration, or ' +
    'data flow is not worth its risk, the cheapest control is to remove it.',
  'Avoid': 'AVOID — stop the activity entirely and document the decision. This ' +
    'drives the residual risk to (near) zero, but only works when the business ' +
    'can live without the activity. Record who decided and why.',
  'D2': 'Mitigation question: with the controls available to you, does the ' +
    'residual risk fall below the organization\'s stated risk appetite? Ask ' +
    'whether a feasible control actually exists, not just a wished-for one.',
  'Mitigate': 'MITIGATE — implement one or more controls to reduce likelihood ' +
    'or impact, then track the residual risk that remains. Most risks land ' +
    'here. The control assumes maintenance: an unpatched control is no control.',
  'D3': 'Transfer question: can the financial impact be shifted to another ' +
    'party through cyber insurance or a contractual clause? Transfer moves the ' +
    'cost, not the operational responsibility — you still suffer the outage.',
  'Transfer': 'TRANSFER — procure insurance or a vendor contract that absorbs ' +
    'the financial impact, and track coverage limits and exclusions. The risk ' +
    'of the event still exists; what changes is who pays when it fires.',
  'Accept': 'ACCEPT — the only remaining option. Document the risk, have it ' +
    'signed off at the appropriate executive level, time-bound it (typically ' +
    '12 months), and put a reassessment on the calendar. Acceptance is a ' +
    'deliberate, owned, dated decision — never a silent default.'
};

const panel = document.getElementById('panel');

function showInfo(id) {
  if (nodeInfo[id]) {
    panel.textContent = nodeInfo[id];
  }
}

function setupNodeHover() {
  const nodes = document.querySelectorAll('.node');
  nodes.forEach(node => {
    const nodeId = node.id.replace('flowchart-', '').split('-')[0];
    if (nodeInfo[nodeId]) {
      node.addEventListener('mouseenter', () => showInfo(nodeId));
      node.addEventListener('click', () => showInfo(nodeId));
    }
  });
}

function waitForMermaid() {
  const mermaidDiv = document.querySelector('.mermaid');
  const svg = mermaidDiv ? mermaidDiv.querySelector('svg') : null;
  if (svg && document.querySelectorAll('.node').length > 0) {
    setupNodeHover();
  } else {
    setTimeout(waitForMermaid, 100);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
} else {
  setTimeout(waitForMermaid, 100);
}
