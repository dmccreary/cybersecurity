// CANVAS_HEIGHT: 2080
// Practitioner Decision Flow — Mermaid hover interaction.
// Hovering (or tapping) a gate updates the right-side info panel with what the
// gate checks and where the chapter introduced its concepts.

const nodeInfo = {
  'Start': 'You are weighing an action on a system — scanning, accessing data, ' +
    'changing a configuration, or disrupting a service. Before touching it, run ' +
    'each gate below in order. Trust, but verify.',
  'Legal': 'Gate 1 — Legal. Do you have written authorization in this ' +
    'jurisdiction, for these specific systems, within this time window? "I had ' +
    'permission" is not a defense unless it is scoped and documented. Introduced ' +
    'in the chapter section on computer crime law and authorization.',
  'StopLegal': 'If the action is not clearly authorized, STOP. Obtain written, ' +
    'scoped authorization before proceeding — there is no continue path until ' +
    'you do.',
  'Ethical': 'Gate 2 — Ethical. Even when an action is legal, ask whether it ' +
    'harms someone the ACM Code of Ethics obligates you to consider (users, ' +
    'bystanders, the public). Introduced in the chapter section on professional ' +
    'codes of ethics.',
  'Revise': 'If the action causes avoidable harm, revise the plan to reduce that ' +
    'harm, then re-check the ethical gate before continuing.',
  'Forensic': 'Gate 3 — Forensic. If this could become evidence, will your chain ' +
    'of custody hold? Acting first can destroy or taint evidence. Introduced in ' +
    'the chapter section on digital forensics and evidence handling.',
  'Capture': 'If forensic integrity is at risk, capture or image the system ' +
    'state before you act, so the evidence is preserved and admissible.',
  'Notify': 'Gate 4 — Notification. Does this event trigger a breach-notification ' +
    'duty under HIPAA, GLBA, GDPR, NIS2, or a state breach law? Introduced in the ' +
    'chapter section on breach-notification regimes.',
  'Alert': 'If a notification duty is triggered, alert Legal and Privacy and ' +
    'start the regulatory clock now — many regimes count hours, not days.',
  'Public': 'Gate 5 — Public Good. Should you coordinate disclosure or notify ' +
    'CISA / a CERT? Introduced in the chapter section on coordinated vulnerability ' +
    'disclosure and the public interest.',
  'Coord': 'If coordination serves the public good, open a coordination channel ' +
    'with the affected vendor, CISA, or a CERT before or alongside acting.',
  'Proceed': 'All five gates cleared. You can proceed with the action on a ' +
    'documented, defensible basis — legal, ethical, forensically sound, ' +
    'compliant, and aligned with the public good.'
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
