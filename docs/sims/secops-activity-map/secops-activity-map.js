// CANVAS_HEIGHT: 720
// Security Operations Activity Map — Mermaid hover interaction.
// Hovering (or tapping) a node updates the right-side info panel with a
// concrete description of that security-operations function or flow.

const nodeInfo = {
  'Off': 'OFFENSIVE security probes systems the way an adversary would, to find ' +
    'weaknesses before a real attacker does. It includes penetration testing, ' +
    'red teaming, bug bounty programs, capture-the-flag exercises, and threat ' +
    'modeling. Its product is findings the defenders can act on.',
  'Def': 'DEFENSIVE security builds and runs the controls that detect and resist ' +
    'attacks: the blue team, SOC monitoring, threat hunting, vulnerability ' +
    'management, and detection engineering. It turns offensive findings into ' +
    'durable detections and hardened systems.',
  'Resp': 'RESPONSE handles incidents once something gets through: incident ' +
    'response following the PICERL lifecycle, forensics, malware analysis, and ' +
    'the lessons-learned step. Its job is to contain damage and feed what it ' +
    'learns back into the cycle.',
  'Purple': 'PURPLE TEAM is the integrative practice that joins offense and ' +
    'defense in the same room: attackers run techniques while defenders tune ' +
    'detections in real time. It connects to all three functions and turns the ' +
    'cycle into a fast feedback loop instead of three silos.',
  'TI': 'THREAT INTELLIGENCE is consumed by every function. It tells offense ' +
    'which adversary techniques to emulate, gives defense the indicators and ' +
    'TTPs to detect, and helps response attribute and scope an incident.',
  'F1': 'Findings improve detections: vulnerabilities and attack paths surfaced ' +
    'by offensive work become new detection rules, patches, and hardening ' +
    'standards on the defensive side.',
  'F2': 'Alerts trigger investigations: when defensive monitoring fires a ' +
    'high-confidence alert, it hands the event to the response function to ' +
    'confirm, contain, and remediate.',
  'F3': 'Lessons drive the next exercise: the lessons-learned output of an ' +
    'incident defines what the next red-team or penetration test should ' +
    'specifically try to break.'
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
