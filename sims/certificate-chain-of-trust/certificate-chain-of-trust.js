// CANVAS_HEIGHT: 540
// Certificate Chain of Trust — Mermaid hover interaction.
// Hovering or tapping a node explains its role in the PKI hierarchy. The static
// "Verification path" callout in the info panel shows the reverse direction a
// browser actually walks when validating a certificate.

const nodeInfo = {
  'Root': 'The Root CA is the trust anchor. Its certificate is self-signed and ' +
    'pre-installed in the browser/OS trust store. The private key is kept offline ' +
    'in a hardware security module (HSM) and is used rarely — only to sign ' +
    'intermediates — so a compromise is extremely costly to an attacker.',
  'IntA': 'Intermediate CA A is signed by the Root CA and does the day-to-day ' +
    'work of issuing end-entity certificates. Using intermediates means the ' +
    'precious root key stays offline; if an intermediate is compromised it can ' +
    'be revoked without replacing the root in every trust store.',
  'IntB': 'Intermediate CA B is a sibling intermediate, also signed by the Root ' +
    'CA. Separating issuance across intermediates limits blast radius: revoking ' +
    'one does not invalidate certificates issued by the other.',
  'WWW': 'www.example.com is an end-entity (leaf) certificate signed by ' +
    'Intermediate CA A. The server presents this certificate plus the chain up ' +
    'to (but not including) the root, which the browser already trusts.',
  'API': 'api.example.com is another leaf certificate signed by Intermediate ' +
    'CA A. Each leaf certificate binds a public key to a specific domain name; ' +
    'the signature proves a CA vouched for that binding.',
  'MAIL': 'mail.example.com is a leaf certificate signed by Intermediate CA B. ' +
    'Its chain therefore runs MAIL -> Intermediate CA B -> Root CA, a different ' +
    'path from the www and api certificates.'
};

const panel = document.getElementById('panel');

function showInfo(id) {
  if (nodeInfo[id]) panel.textContent = nodeInfo[id];
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
