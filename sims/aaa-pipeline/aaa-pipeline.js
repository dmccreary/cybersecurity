// CANVAS_HEIGHT: 350
// AAA Pipeline with Non-Repudiation sidebar — Mermaid hover interaction.
// Hovering (or tapping) a node updates the right-side info panel with a
// concrete definition of that stage of the AAA pipeline.

const nodeInfo = {
  'Principal': 'The Principal is the entity (a user, service, or device) that ' +
    'claims an identity. The claim alone proves nothing — it is just an ' +
    'assertion such as "I am user@example.com" that must still be verified.',
  'AuthN': 'Authentication answers "is the claim genuine?" It checks evidence ' +
    'such as a password, an MFA code, or a client certificate. Authentication ' +
    'establishes WHO the principal is — not what they may do.',
  'AuthZ': 'Authorization answers "is this principal allowed to perform this ' +
    'action on this resource?" It runs only after authentication succeeds and ' +
    'enforces least privilege: identity is necessary but not sufficient.',
  'Acct': 'Accounting records what actually happened — logins, actions, and ' +
    'resource access — into logs and an audit trail. It supports detection, ' +
    'forensics, billing, and after-the-fact investigation.',
  'Resource': 'The Resource is the protected asset the principal is trying to ' +
    'reach: a file, an API, a database, or a service. Every preceding stage ' +
    'exists to govern access to it.',
  'NonRep': 'Non-repudiation uses cryptographic evidence (digital signatures ' +
    'over authentication and accounting records) so an actor cannot later deny ' +
    'an action. It binds an identity to an event with proof a third party can ' +
    'verify. Trust, but verify.'
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
