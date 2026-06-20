// CANVAS_HEIGHT: 700
// IDS/IPS Decision Flow — Mermaid hover interaction.
// Hovering (or tapping) a node updates the right-side info panel with a
// concrete explanation of that step in the detection vs prevention path.

const nodeInfo = {
  'Packet': 'An inbound packet reaches the network boundary. From here it can ' +
    'be mirrored to an out-of-band sensor (IDS) and/or pass through an in-line ' +
    'device (IPS) that sits directly in the data path.',
  'Span': 'A switch SPAN (mirror) port copies traffic to the IDS without sitting ' +
    'in the live path. Because it only sees a copy, the IDS can never delay or ' +
    'drop the real packet — that is what "out of band" means.',
  'IDSeng': 'The IDS engine inspects the copied traffic with a signature engine ' +
    '(known-bad patterns) and an anomaly engine (statistical deviation) running ' +
    'in parallel. It decides whether something is worth alerting on.',
  'IDSmatch': 'If either the signature or anomaly engine fires, the IDS raises an ' +
    'alert. Either way the original packet is already on its way — the IDS cannot ' +
    'undo what has passed.',
  'Alert': 'The IDS emits an alert to the SIEM for analysts to triage. This is ' +
    'alert-only: the packet is NOT blocked. Detection without prevention trades ' +
    'real-time control for zero availability risk.',
  'Continue': 'The original packet reaches its destination unchanged. The IDS ' +
    'observed and recorded, but never interfered with delivery.',
  'IPSeng': 'The IPS engine sits in-line, in the live data path. Every packet ' +
    'must pass through it, so an IPS can act in real time — but it also becomes a ' +
    'point that can drop legitimate traffic or fail the connection entirely.',
  'Sig': 'The signature check compares the packet against known-bad patterns. A ' +
    'confident match is treated as hostile and handled immediately.',
  'Anom': 'If no signature matches, the anomaly engine scores how far the traffic ' +
    'deviates from normal. A score over the configured threshold is treated as ' +
    'suspicious even without a known signature.',
  'Drop': 'On a signature match the IPS drops the packet, logs the event, and ' +
    'terminates the connection — stopping the attack in real time. Ask: what is ' +
    'the blast radius if this rule fires on legitimate traffic?',
  'Quar': 'On a high anomaly score the IPS drops or quarantines the flow. Anomaly ' +
    'rules catch novel attacks but are the most likely source of false positives.',
  'Forward': 'Traffic that passes both checks is forwarded to its destination. ' +
    'The IPS adds latency to every packet, which is the cost of in-line control.'
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
