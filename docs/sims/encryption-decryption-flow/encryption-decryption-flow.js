// CANVAS_HEIGHT: 400
// Symmetric Encryption and Decryption Flow — Mermaid hover interaction.
// Plaintext -> Encryption -> Ciphertext -> Decryption -> Plaintext, with one
// shared secret key feeding BOTH the encryption and decryption boxes. The point:
// in symmetric crypto the same key is used in both directions.

const nodeInfo = {
  'PT1': 'The plaintext is the original, readable message — here, "Attack at ' +
    'dawn." Anyone who can read it understands it; that is exactly what ' +
    'encryption is meant to prevent.',
  'ENC': 'Encryption combines the plaintext with the secret key using a public ' +
    'algorithm. The same algorithm everyone knows, plus a key only the ' +
    'authorized parties know, produces unreadable output.',
  'CT': 'The ciphertext looks like random bytes (e.g., 8a4f...d12b). Without the ' +
    'key it reveals nothing useful about the plaintext, even though the ' +
    'algorithm that produced it is publicly documented.',
  'DEC': 'Decryption reverses encryption using the SAME secret key. In symmetric ' +
    'cryptography there is one shared key for both directions — lose control of ' +
    'it and confidentiality is gone.',
  'PT2': 'The recovered plaintext is byte-for-byte identical to the original. ' +
    'Successful decryption returns exactly "Attack at dawn."',
  'KEY': 'The shared cryptographic key must be kept secret and must be the same ' +
    'on both ends. Distributing this single key safely is the hard problem ' +
    'symmetric crypto leaves unsolved — which is why key exchange matters.'
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
