// CANVAS_HEIGHT: 890
// Security Operations Monitoring Pipeline — Mermaid flowchart TD. Telemetry
// flows from sources -> collection -> SIEM -> SOAR -> analyst, with a feedback
// edge (analyst tunes the SIEM). Bloom: Understand. Interaction = hover tooltips
// per stage box (no animation). A retention-policy strip sits below the diagram.
// (Switched from LR to TD: per project guidance LR diagrams bottom-anchor and
// shrink node text; a TD pipeline of 5 stage boxes reads cleanly.)

const nodeInfo = {
  'SRC': 'Sources — where telemetry originates: endpoints with EDR agents, cloud control-plane logs (CloudTrail, Activity Log, Audit Logs), network devices and IDS/IPS, the identity provider (Okta, Entra ID, AD), and SaaS apps (M365, Salesforce, GitHub). Each speaks a different format.',
  'COLL': 'Collection layer — a log shipper, agent, or API pull (Fluent Bit, a Splunk forwarder, a cloud-native collector) that normalizes those many formats, applies consistent timestamps, and enriches events before they reach the SIEM.',
  'SIEM': 'Log Management and SIEM — the core. It indexes and stores events, runs correlation rules that stitch sources together, applies detection logic that fires alerts, and presents dashboards analysts use to monitor and hunt.',
  'SOAR': 'SOAR (Security Orchestration, Automation and Response) — playbooks codify response steps, case management tracks each incident from alert to closure, and automated containment can isolate a host or disable an account without waiting for a human.',
  'SOC': 'Analyst / SOC — the human in the loop. Triages alerts, investigates the ones that matter, and escalates true incidents. Their feedback tunes the SIEM so noisy rules get suppressed — closing the loop.'
};

(function () {
  'use strict';
  const tooltip = document.getElementById('tooltip');

  function position(e) {
    const x = e.clientX + 16, y = e.clientY + 16;
    const r = tooltip.getBoundingClientRect();
    tooltip.style.left = Math.min(x, window.innerWidth - r.width - 16) + 'px';
    tooltip.style.top = Math.min(y, window.innerHeight - r.height - 16) + 'px';
  }

  function setup() {
    document.querySelectorAll('.node').forEach(node => {
      const id = node.id.replace('flowchart-', '').split('-')[0];
      if (!nodeInfo[id]) return;
      node.addEventListener('mouseenter', () => {
        tooltip.textContent = nodeInfo[id];
        tooltip.classList.add('visible');
      });
      node.addEventListener('mousemove', position);
      node.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
    });
  }

  function waitForMermaid() {
    const m = document.querySelector('.mermaid');
    if (m && m.querySelector('svg') && document.querySelectorAll('.node').length > 0) {
      setup();
    } else {
      setTimeout(waitForMermaid, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(waitForMermaid, 100));
  } else {
    setTimeout(waitForMermaid, 100);
  }
})();
