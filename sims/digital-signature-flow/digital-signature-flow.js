// CANVAS_HEIGHT: 430
// Digital Signature Sign-and-Verify Flow — Mermaid hover interaction.
// Two columns separated by a trust boundary: the signer hashes the message and
// signs the digest with the PRIVATE key; the verifier re-hashes the message and
// uses the PUBLIC key on the signature, then compares the two digests.

const nodeInfo = {
  'M': 'The original message M the signer wants to vouch for. A signature does ' +
    'not hide M (that is encryption) — it proves who produced M and that it has ' +
    'not changed.',
  'SH': 'The signer runs M through a cryptographic hash (SHA-256), producing a ' +
    'fixed-size digest. Hashing first means the expensive signing operation runs ' +
    'on a small fixed input, not the whole message.',
  'HM': 'The digest H(M) is a compact fingerprint of the message. Any change to ' +
    'M, however small, produces a completely different digest.',
  'SK': 'The signer encrypts the digest with their PRIVATE key. Only the holder ' +
    'of the private key can do this, which is exactly what binds the signature to ' +
    'the signer.',
  'S': 'The signature S is the result of signing the digest. It travels alongside ' +
    'M but is not part of M.',
  'SEND': 'The signer sends the pair (M, S) across the network. M is sent in the ' +
    'clear; S is the proof attached to it.',
  'RECV': 'The verifier receives (M, S). It does not yet know whether M is ' +
    'authentic — it must reconstruct and compare.',
  'VH': 'The verifier independently hashes the received M with the same SHA-256 ' +
    'algorithm, producing its own computed digest.',
  'VHM': 'The verifier-computed digest H(M). If M was altered in transit, this ' +
    'digest will differ from what the signer signed.',
  'VP': 'The verifier applies the signer\'s PUBLIC key to S. This recovers the ' +
    'digest the signer originally signed — the "expected digest."',
  'VEX': 'The expected digest recovered from the signature using the public key. ' +
    'This is what the signer claims the message digest should be.',
  'EQ': 'The verifier compares the computed digest with the expected digest. ' +
    'Equality means the message is unchanged AND was signed by the holder of the ' +
    'matching private key.',
  'OK': 'Digests match: the signature is valid. The message is authentic and ' +
    'intact. Trust, but verify — and here verification succeeded.',
  'BAD': 'Digests differ: either the message was tampered with, or it was signed ' +
    'with a different (wrong) private key. Reject it.'
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
