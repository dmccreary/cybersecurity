// CANVAS_HEIGHT: 410
// Security Control 3D Taxonomy — interactive SVG/HTML grid.
// A 4 (function) x 3 (type) matrix of security controls. Each cell shows one or
// two representative controls and is colored by function. Hovering a cell reveals
// a richer tooltip with additional examples. Reflows to a single column < 700px.

const functions = [
  { key: "preventive",   label: "Preventive",   color: "#1565c0" },
  { key: "detective",    label: "Detective",    color: "#4caf50" },
  { key: "corrective",   label: "Corrective",   color: "#ffa000" },
  { key: "compensating", label: "Compensating", color: "#455a64" }
];

const types = ["Administrative", "Technical", "Physical"];

// cells[function][type] = { shown: [...], all: [...] }
const cells = {
  preventive: {
    Administrative: { shown: ["Acceptable use policy", "Security training"],
      all: ["Acceptable use policy", "Security awareness training", "Onboarding background checks", "Separation of duties"] },
    Technical: { shown: ["Firewall", "Encryption at rest", "MFA"],
      all: ["Firewall / network ACLs", "Encryption at rest", "Multi-factor authentication", "Input validation", "Least-privilege IAM roles"] },
    Physical: { shown: ["Door locks", "Badge access"],
      all: ["Door locks", "Badge / proximity access", "Bollards and fences", "Mantraps"] }
  },
  detective: {
    Administrative: { shown: ["Periodic audit", "User behavior reviews"],
      all: ["Periodic security audit", "User behavior / access reviews", "Log review procedures"] },
    Technical: { shown: ["IDS", "SIEM rules", "Audit logs"],
      all: ["Intrusion detection system (IDS)", "SIEM correlation rules", "Audit / access logs", "File integrity monitoring"] },
    Physical: { shown: ["Security cameras", "Motion sensors"],
      all: ["CCTV security cameras", "Motion sensors", "Door / window contact alarms"] }
  },
  corrective: {
    Administrative: { shown: ["Incident response plan", "DR procedures"],
      all: ["Incident response plan", "Disaster recovery procedures", "Post-incident review / lessons learned"] },
    Technical: { shown: ["Backups", "Patches", "Quarantine"],
      all: ["Backups and restore", "Patch deployment", "Endpoint quarantine / isolation", "Automated rollback"] },
    Physical: { shown: ["Replacement hardware", "Fire suppression"],
      all: ["Replacement hardware / spares", "Fire suppression systems", "Restoration of physical site"] }
  },
  compensating: {
    Administrative: { shown: ["Manual review when automation is unavailable"],
      all: ["Manual review when automation is unavailable", "Increased supervision for a risky temporary process"] },
    Technical: { shown: ["Strict segmentation when in-place encryption is impossible"],
      all: ["Strict network segmentation when in-place encryption is impossible", "Additional monitoring around a system that cannot be patched"] },
    Physical: { shown: ["Locked cage when full datacenter access control is unavailable"],
      all: ["Locked equipment cage when full datacenter access control is unavailable", "Dedicated escort for visitors to a sensitive area"] }
  }
};

const tooltip = document.getElementById('tooltip');

function build() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';

  // header row: corner + 3 type headers
  const corner = document.createElement('div');
  corner.className = 'corner';
  grid.appendChild(corner);
  for (const t of types) {
    const h = document.createElement('div');
    h.className = 'col-head';
    h.textContent = t;
    grid.appendChild(h);
  }

  // body rows
  for (const fn of functions) {
    const rh = document.createElement('div');
    rh.className = 'row-head';
    rh.style.background = fn.color;
    rh.textContent = fn.label;
    grid.appendChild(rh);

    for (const t of types) {
      const data = cells[fn.key][t];
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.background = fn.color;
      const ex = document.createElement('div');
      ex.className = 'examples';
      data.shown.forEach(s => {
        const sp = document.createElement('span');
        sp.textContent = '• ' + s;
        ex.appendChild(sp);
      });
      cell.appendChild(ex);

      const title = fn.label + ' × ' + t;
      cell.addEventListener('mouseenter', () => showTip(title, data.all));
      cell.addEventListener('mousemove', moveTip);
      cell.addEventListener('mouseleave', hideTip);
      cell.addEventListener('click', () => showTip(title, data.all)); // touch support
      grid.appendChild(cell);
    }
  }

  // legend
  const legend = document.getElementById('legend');
  legend.innerHTML = '';
  for (const fn of functions) {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = '<span class="legend-dot" style="background:' + fn.color +
      '"></span>' + fn.label;
    legend.appendChild(item);
  }
}

function showTip(title, all) {
  tooltip.innerHTML = '<div class="tt-title">' + title + '</div>' +
    all.map(a => '• ' + a).join('<br>');
  tooltip.style.opacity = '1';
}

function moveTip(e) {
  const pad = 14;
  let x = e.clientX + pad;
  let y = e.clientY + pad;
  const r = tooltip.getBoundingClientRect();
  if (x + r.width > window.innerWidth - 6) x = e.clientX - r.width - pad;
  if (y + r.height > window.innerHeight - 6) y = e.clientY - r.height - pad;
  if (y < 4) y = 4;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}

function hideTip() {
  tooltip.style.opacity = '0';
}

build();
window.addEventListener('resize', () => { /* CSS grid reflows automatically */ });
