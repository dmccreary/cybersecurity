// CANVAS_HEIGHT: 430
// ML Attack Surface — Mermaid hover interaction.
// Hovering (or tapping) a pipeline stage or an attack box updates the
// right-side info panel with what that stage does, or how the attack abuses it.

const nodeInfo = {
  'Collect': 'Data collection gathers training examples from web scrapes, user ' +
    'uploads, and partner feeds. Because the inputs come from many untrusted ' +
    'sources, this is the entry point for data poisoning.',
  'Clean': 'Data cleaning filters, labels, and deduplicates the raw corpus. Good ' +
    'cleaning can catch some poisoned samples, but it cannot assume the upstream ' +
    'data was honest.',
  'Train': 'Training runs optimization that adjusts the model weights to fit the ' +
    'cleaned data. Whatever bias or backdoor survived cleaning is baked into the ' +
    'weights here.',
  'Trained': 'The trained model has frozen weights and is ready to deploy. At ' +
    'this point its behavior — including any poisoned behavior — is fixed until ' +
    'it is retrained.',
  'Prod': 'The production model receives live user input and returns predictions. ' +
    'It is the inference-time attack surface: evasion, model theft, and prompt ' +
    'injection all target this stage.',
  'Output': 'The output is the prediction the model returns: a score, a label, or ' +
    'generated text. An attacker who can shape inputs is ultimately trying to ' +
    'control what appears here.',
  'Poison': 'Data Poisoning: the attacker contributes corrupted examples upstream ' +
    'so the model learns the wrong thing — a hidden backdoor or a skewed ' +
    'decision boundary. The attack happens at training time but only pays off ' +
    'later. What does this pipeline assume about its data sources?',
  'Evasion': 'Adversarial ML / Model Evasion: the attacker crafts an input with ' +
    'small, deliberate perturbations that cause a confident but wrong output, ' +
    'without changing the model. The classic example is a stop sign the model ' +
    'reads as a speed-limit sign.',
  'Theft': 'Model Theft (model extraction): by sending many queries and ' +
    'observing outputs, an attacker reconstructs a close copy of the model — ' +
    'stealing intellectual property and a surface to attack offline.',
  'Inject': 'Prompt Injection: instructions hidden inside user-supplied input ' +
    '(or retrieved content) override the system prompt, making the model ignore ' +
    'its guardrails. The model cannot tell trusted instructions from untrusted ' +
    'data at the trust boundary.'
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
