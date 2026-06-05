// CANVAS_HEIGHT: 1360
// Layered Network Defense Reference — Mermaid hover interaction.
// Hovering (or tapping) a layer updates the right-side info panel with what
// that layer defends and the attack class it primarily addresses.

const nodeInfo = {
  'Client': 'The Internet client is fully external and untrusted. Every request ' +
    'it sends must be treated as potentially hostile until proven otherwise — ' +
    'this is the outermost trust boundary.',
  'DDoS': 'DDoS scrubbing and CDN sit at the edge to absorb volumetric floods ' +
    'and apply geo filtering before traffic ever reaches your own capacity. ' +
    'Primary attack class addressed: DDoS / availability attacks.',
  'Edge': 'The edge stateful firewall permits only the ports and protocols you ' +
    'actually serve (e.g. 443) and tracks connection state. It shrinks the ' +
    'externally reachable surface to a single deliberate doorway.',
  'WAF': 'The Web Application Firewall inspects Layer 7 (HTTP) and blocks ' +
    'application attacks: SQL injection, cross-site scripting, request ' +
    'smuggling. Primary attack class addressed: the OWASP Top 10.',
  'LB': 'The load balancer spreads traffic across replicas and terminates TLS, ' +
    'centralizing certificate management and giving downstream tiers a clean, ' +
    'decrypted request to inspect.',
  'App': 'The application tier runs in a DMZ / public subnet as N replicas with ' +
    'internal IPs. It is reachable from the front end but isolated from the ' +
    'sensitive datastore behind the inner firewall.',
  'Inner': 'The inner firewall and micro-segmentation enforce deny-by-default ' +
    'between tiers. Even if the app tier is compromised, this boundary limits ' +
    'how far an attacker can move. Primary attack class addressed: lateral ' +
    'movement. Least privilege, by default.',
  'Internal': 'Internal services — database, cache, and auth — live in a private ' +
    'subnet with no direct Internet path. This is the asset every outer layer ' +
    'exists to protect; if it is breached, what is the blast radius?',
  'IDS': 'IDS/IPS sensors tap every boundary so suspicious traffic is detected ' +
    '(and optionally blocked) no matter which layer it reaches. Observability is ' +
    'a cross-cutting concern, not a single appliance.',
  'Crypto': 'Encryption in transit (TLS, or mTLS between internal services) ' +
    'protects data at every hop, so a foothold on one segment does not hand the ' +
    'attacker plaintext from the others.',
  'Logging': 'Every component emits events to centralized logging and a SIEM. ' +
    'Without logs across all layers you cannot detect a slow intrusion, ' +
    'reconstruct an incident, or prove what happened. Assume breach; plan ' +
    'recovery.'
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
