// CANVAS_HEIGHT: 470
// SSDLC Cost Curve — Chart.js horizontal bar chart with a logarithmic x-axis.
// Bloom: Understand. Interaction = hover tooltips (no animation loop). Six SDLC
// phases on the y-axis; relative remediation cost (1x..100x) on a log x-axis so
// the geometric growth is visible. Bars use a cybersecurity-blue gradient that
// darkens with cost; the Production bar is bordered in alert amber to mark the
// "after a breach" worst case. Tooltips name typical activities and a cost driver.

(function () {
  'use strict';

  const PHASES = [
    { phase: 'Requirements', cost: 1,
      activities: 'Threat modeling, abuse cases, security requirements',
      driver: 'A flaw caught here is a sentence edited in a doc.' },
    { phase: 'Design', cost: 2,
      activities: 'Architecture review, trust-boundary analysis',
      driver: 'Reworking a design diagram, before any code exists.' },
    { phase: 'Implementation', cost: 5,
      activities: 'Secure coding, code review, SAST, linting',
      driver: 'A developer rewrites a function and re-reviews it.' },
    { phase: 'Testing', cost: 10,
      activities: 'Fuzzing, DAST, penetration testing, QA',
      driver: 'A bug bounces back through code review and re-test.' },
    { phase: 'Deployment', cost: 30,
      activities: 'Release hotfix, config rollback, change control',
      driver: 'Emergency patch, coordinated release, customer comms.' },
    { phase: 'Production (post-incident)', cost: 100,
      activities: 'Incident response, forensics, disclosure, legal',
      driver: 'Breach response, regulatory fines, lost trust, cleanup.' }
  ];

  // cybersecurity-blue gradient, lightest -> darkest with cost
  const BLUES = ['#bbdefb', '#90caf9', '#42a5f5', '#1e88e5', '#1565c0', '#0d47a1'];

  function init() {
    const ctx = document.getElementById('costChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: PHASES.map(p => p.phase),
        datasets: [{
          label: 'Relative cost (×)',
          data: PHASES.map(p => p.cost),
          backgroundColor: BLUES,
          borderColor: PHASES.map((p, i) => i === PHASES.length - 1 ? '#ffa000' : '#0d47a1'),
          borderWidth: PHASES.map((p, i) => i === PHASES.length - 1 ? 3 : 1),
          borderRadius: 3,
          barPercentage: 0.78
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { right: 18 } },
        animation: { duration: 400 },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#263238',
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            callbacks: {
              title: (items) => items[0].label,
              label: (item) => {
                const p = PHASES[item.dataIndex];
                return [
                  'Relative cost: ' + p.cost + '×',
                  'Activities: ' + p.activities,
                  'Cost driver: ' + p.driver
                ];
              }
            }
          }
        },
        scales: {
          x: {
            type: 'logarithmic',
            // min just below 1 so the 1x "Requirements" bar has visible width
            // (a log axis starting exactly at 1 renders a value of 1 with zero length).
            min: 0.8,
            max: 120,
            title: { display: true, text: 'Relative cost to fix (× baseline, log scale)',
              color: '#455a64', font: { size: 12 } },
            ticks: {
              color: '#455a64',
              callback: (v) => ([1, 2, 5, 10, 30, 100].includes(v) ? v + '×' : null)
            },
            grid: { color: '#eceff1' }
          },
          y: {
            ticks: { color: '#263238', font: { size: 12 } },
            grid: { display: false }
          }
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
