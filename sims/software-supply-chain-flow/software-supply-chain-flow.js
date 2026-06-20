// CANVAS_HEIGHT: 700
// A Modern Software Supply Chain — Mermaid flow (TD spine) with an attack
// injection point attached to each of the nine stages and a defenses summary.
// Bloom: Analyze. Interaction = hover/tap reveal of each stage and each amber
// attack annotation (a one-line real-world incident), plus the defenses panel.
// Rendered as a vertical chain so the nine stages and their attached attack
// annotations fit the narrow 2/3 diagram panel without LR text-shrinking.

const nodeInfo = {
  'S1': 'Developer Workstation — where local source code is written. The earliest ' +
    'place an attacker can inject code, often through a tampered toolchain.',
  'A1': 'Compromised IDE plugin: a malicious editor extension or local tool can ' +
    'inject code or steal secrets before anything is even committed.',
  'S2': 'Source Repository (Git) — version control holding the authoritative code ' +
    'and history. Protect it with branch protection, signed commits, and review.',
  'A2': 'Stolen credentials / malicious pull request: an attacker who can push or ' +
    'merge can introduce a backdoor that looks like a normal change.',
  'S3': 'Dependency Registry (npm, PyPI, Maven) — third-party libraries pulled in ' +
    'at build time. Most code in a modern app is dependencies you did not write.',
  'A3': 'Typosquatting and hijacked packages — e.g., the 2018 event-stream ' +
    'incident, where a popular npm package was handed off and back-doored.',
  'S4': 'Build Server (CI/CD) — turns source plus dependencies into a shipped ' +
    'artifact. A compromised build step poisons every downstream consumer.',
  'A4': 'SolarWinds (2020): attackers modified the build process so the official, ' +
    'signed Orion update itself carried the SUNBURST backdoor.',
  'S5': 'Artifact Repository — stores the built binaries and container images that ' +
    'will be signed and shipped.',
  'A5': 'Registry account takeover: with the artifact store credentials, an ' +
    'attacker can replace a good binary with a malicious one of the same name.',
  'S6': 'Code Signing — a cryptographic signature is applied so consumers can ' +
    'verify the artifact came from you and was not altered.',
  'A6': 'Stolen signing key: a leaked private key lets an attacker sign malware ' +
    'that passes signature verification as if it were genuine.',
  'S7': 'Distribution — the package registry, app store, or CDN that delivers the ' +
    'signed artifact to consumers.',
  'A7': 'In-transit replacement: without verified signatures over the channel, a ' +
    'man-in-the-middle can swap the package during download.',
  'S8': 'Deploy / Update — the artifact is installed and runs on user ' +
    'infrastructure, frequently via an auto-update mechanism.',
  'A8': 'Malicious update — e.g., NotPetya (2017), which spread through a ' +
    'trojanized update of Ukrainian accounting software M.E.Doc.',
  'S9': 'End User — finally executes the code. By this point every earlier ' +
    'control either held or failed; verification here is the last line.',
  'A9': 'If verification at execution is skipped, a tampered artifact that slipped ' +
    'past earlier stages runs with the user\'s privileges.',
  'DSBOM': 'SBOM (Software Bill of Materials): an inventory of every component. ' +
    'Covers dependency pull-in (3), artifact contents (5), and what the end user ' +
    'actually runs (9) — so a known-bad component can be found fast.',
  'DSIGN': 'Code signing, applied at stage 6 and VERIFIED at stage 9. Signing ' +
    'alone is not enough; the consumer must check the signature before running.',
  'DREPRO': 'Reproducible builds (stage 4): anyone can rebuild from source and ' +
    'get a bit-identical artifact, so a tampered build is detectable.',
  'DPROV': 'Provenance attestations (stages 4–8), e.g., the SLSA framework: ' +
    'signed metadata proving where and how the artifact was built, carried with ' +
    'it through distribution and deploy.'
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
