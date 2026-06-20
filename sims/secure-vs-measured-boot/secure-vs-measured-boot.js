// CANVAS_HEIGHT: 540
// Secure Boot vs. Measured Boot — Mermaid two-column flowchart with hover detail.
// Bloom: Understand. Interaction = hover/tap reveals (no animation). The LEFT
// column shows enforcement (each stage verifies the next stage's signature and
// HALTS on failure); the RIGHT column shows recording (each stage hashes the
// next and EXTENDS a TPM PCR, then runs unconditionally). The contrast — prevent
// vs. prove — is the load-bearing idea, reinforced by the "use BOTH" caption.

const nodeInfo = {
  'SB0': 'Power is applied and the CPU begins executing at its hard-wired reset ' +
    'vector — the very first instruction, fixed in silicon. Identical starting ' +
    'point for both Secure Boot and Measured Boot.',
  'SB1': 'The Boot ROM is immutable code in the silicon: the root of trust. It ' +
    'cannot be reflashed, so an attacker cannot replace the thing that does the ' +
    'first verification. Everything downstream is only as trustworthy as this anchor.',
  'SB2': 'Boot ROM checks the cryptographic signature on the UEFI firmware against ' +
    'a public key burned into the chip. Secure Boot is ENFORCEMENT: a bad ' +
    'signature stops the boot here.',
  'SB3': 'UEFI verifies the signature of the bootloader before transferring ' +
    'control. The chain only continues if each stage vouches for the next.',
  'SB4': 'The bootloader verifies the kernel (and often initrd / driver) ' +
    'signatures. This closes the chain from silicon to OS.',
  'SB5': 'Only signed, unmodified code reached this point. Secure Boot has ' +
    'PREVENTED any unsigned component from executing.',
  'SBh1': 'Signature failure halts the boot. The machine refuses to run an ' +
    'unsigned or tampered UEFI image — fail-secure, not fail-open.',
  'SBh2': 'Same fail-secure rule for the bootloader: a bad signature halts the boot.',
  'SBh3': 'Same fail-secure rule for the kernel: a bad signature halts the boot.',
  'MB0': 'Power is applied and the CPU begins at its reset vector — the same ' +
    'starting point as Secure Boot.',
  'MB1': 'Measured Boot RECORDS instead of enforcing. The Boot ROM hashes the ' +
    'UEFI firmware and EXTENDS PCR[0] in the TPM: PCR = hash(PCR ‖ measurement). ' +
    'It does not stop the boot.',
  'MB2': 'UEFI hashes the bootloader and extends PCR[4]. Each measurement is ' +
    'folded into the running register value before the next stage runs.',
  'MB3': 'The bootloader hashes the kernel and initrd and extends PCR[8] and ' +
    'PCR[9]. The accumulating PCR set is a fingerprint of exactly what booted.',
  'MB4': 'The kernel runs UNCONDITIONALLY. Measured Boot never blocks a boot — ' +
    'it only leaves an evidence trail.',
  'MB5': 'After boot the TPM holds a set of PCR values that uniquely fingerprint ' +
    'the boot sequence. A remote attester compares them to known-good values to ' +
    'decide whether to trust the machine (remote attestation).'
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
