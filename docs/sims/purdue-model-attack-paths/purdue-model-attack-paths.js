// CANVAS_HEIGHT: 640
// Purdue Model Attack Paths — inline SVG with hover tooltips and per-path
// toggles. Seven horizontal Purdue levels stack from Level 5 (enterprise) at
// the top to Level 0 (physical process) at the bottom, with the IT/OT boundary
// drawn as a thick dashed line between Level 3 and Level 4. Three historical
// attack paths descend through the levels; hovering an arrow segment reveals the
// control that failed.

// Levels top-to-bottom (Level 5 at top), each with its display color.
const levels = [
  { id: 5, name: 'Level 5 — Enterprise', sub: 'ERP, email, internet', color: '#1565c0', text: '#ffffff',
    tip: 'Level 5 (Enterprise): business IT — ERP, email, and internet access. This is where most intrusions begin because it is the most exposed.' },
  { id: 4, name: 'Level 4 — Site Business Planning', sub: 'MES, file servers', color: '#1e88e5', text: '#ffffff',
    tip: 'Level 4 (Site Business Planning): manufacturing execution systems and file servers. Still IT, but closer to the plant floor.' },
  { id: 3, name: 'Level 3 — Operations Management', sub: 'historian, engineering workstations', color: '#37474f', text: '#ffffff', boundary: true,
    tip: 'Level 3 (Operations Management): the historian and engineering workstations. This is the top of the OT side and the most defended boundary — compromise here gives an attacker a path toward control.' },
  { id: 2, name: 'Level 2 — Supervisory Control', sub: 'HMIs, SCADA servers', color: '#546e7a', text: '#ffffff',
    tip: 'Level 2 (Supervisory Control): human-machine interfaces and SCADA servers that operators use to watch and adjust the process.' },
  { id: 1, name: 'Level 1 — Basic Control', sub: 'PLCs, RTUs', color: '#455a64', text: '#ffffff',
    tip: 'Level 1 (Basic Control): programmable logic controllers and remote terminal units that directly drive the physical equipment.' },
  { id: 0, name: 'Level 0 — Physical Process', sub: 'sensors, actuators, valves, breakers', color: '#d84315', text: '#ffffff',
    tip: 'Level 0 (Physical Process): the physical reality — sensors, actuators, valves, breakers. Impact here is real-world: spinning centrifuges, dosing pumps, pipeline flow.' }
];

// Attack paths: each is a list of level ids it touches (in order), a color, and
// per-segment control-failure tooltips keyed by the destination level.
const attacks = {
  stuxnet: {
    label: 'Stuxnet (2010)', color: '#c62828', offset: 0,
    hops: [3, 1, 0],
    entry: 'USB drive', entryTag: 'USB',
    tips: {
      3: 'Stuxnet: a USB drive carried the worm onto a Level 3 engineering workstation. Control that failed: an air gap was ASSUMED, but removable USB media was still allowed.',
      1: 'Stuxnet: from the workstation it reprogrammed Level 1 PLCs driving the centrifuges.',
      0: 'Stuxnet: the altered PLC logic drove Level 0 centrifuges to destruction while reporting normal readings to operators.'
    }
  },
  colonial: {
    label: 'Colonial Pipeline (2021)', color: '#ad1457', offset: 1,
    hops: [5, 4, 3],
    entry: 'VPN credential', entryTag: 'VPN',
    tips: {
      5: 'Colonial Pipeline: attackers logged in with a single leaked VPN credential at the Level 5 enterprise. Control that failed: MFA was missing on the VPN.',
      4: 'Colonial Pipeline: ransomware spread across Level 4 IT, including billing systems.',
      3: 'Colonial Pipeline: the company shut down Level 3 operations as a precaution because it could not bill — an IT compromise caused an OT/operational outage without ever touching the controllers.'
    }
  },
  oldsmar: {
    label: 'Oldsmar water (2021)', color: '#6a1b9a', offset: 2,
    hops: [2, 1, 0],
    entry: 'TeamViewer', entryTag: 'RDP',
    tips: {
      2: 'Oldsmar water plant: an attacker connected to a Level 2 HMI through TeamViewer. Control that failed: a remote-access tool with a shared password and no isolation.',
      1: 'Oldsmar: through the HMI the attacker changed a setpoint at Level 1.',
      0: 'Oldsmar: the setpoint change commanded Level 0 chemical dosing to a dangerous level (sodium hydroxide), caught by an operator watching the screen.'
    }
  }
};

let activePath = 'all';
const tipEl = document.getElementById('tip');
const defaultTip = tipEl.textContent;

function levelY(id, top, bandH, gap) {
  // index 0 == Level 5 at top
  const idx = levels.findIndex(l => l.id === id);
  return top + idx * (bandH + gap);
}

function setTip(t) { tipEl.textContent = t; }
function resetTip() { tipEl.textContent = defaultTip; }

function render() {
  const W = 820, top = 40, bandH = 64, gap = 14;
  const labelW = 460, bandX = 16;
  const nShown = (activePath === 'all') ? 3 : 1;
  const legendBlock = 6 + nShown * 20;
  const H = top + levels.length * (bandH + gap) + legendBlock;

  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Purdue model levels with three attack paths">`;

  // bands
  levels.forEach(l => {
    const y = levelY(l.id, top, bandH, gap);
    const strokeW = l.boundary ? 4 : 2;
    const stroke = l.boundary ? '#ffa000' : '#ffffff';
    svg += `<g class="band" data-key="lvl${l.id}">`;
    svg += `<rect x="${bandX}" y="${y}" width="${labelW}" height="${bandH}" rx="6" fill="${l.color}" stroke="${stroke}" stroke-width="${strokeW}"/>`;
    svg += `<text x="${bandX + 16}" y="${y + 26}" font-size="16" font-weight="700" fill="${l.text}">${l.name}</text>`;
    svg += `<text x="${bandX + 16}" y="${y + 47}" font-size="12.5" fill="${l.text}">${l.sub}</text>`;
    svg += `</g>`;
  });

  // IT/OT boundary dashed line between Level 4 (idx 1) and Level 3 (idx 2)
  const l3y = levelY(3, top, bandH, gap);
  const by = l3y - gap / 2;
  svg += `<line x1="${bandX - 4}" y1="${by}" x2="${W - 8}" y2="${by}" stroke="#ffa000" stroke-width="4" stroke-dasharray="12 7"/>`;
  svg += `<rect x="${bandX + labelW - 150}" y="${by - 14}" width="160" height="22" rx="4" fill="#fff3e0" stroke="#ffa000" stroke-width="1.5"/>`;
  svg += `<text x="${bandX + labelW - 70}" y="${by + 1}" font-size="12.5" font-weight="700" fill="#e65100" text-anchor="middle">IT / OT BOUNDARY</text>`;

  // attack paths on the right side, each in its own vertical lane
  const laneBaseX = bandX + labelW + 40;
  const laneGap = 48;
  // single shared arrowhead marker per color is fine, but keep per-key for clarity
  Object.keys(attacks).forEach(key => {
    if (activePath !== 'all' && activePath !== key) return;
    const a = attacks[key];
    const laneX = laneBaseX + a.offset * laneGap;
    const pts = a.hops.map(id => ({ id, y: levelY(id, top, bandH, gap) + bandH / 2 }));
    svg += `<g class="attack" data-key="atk-${key}">`;
    // vertical descending path through waypoints
    let d = `M ${laneX} ${top - 4} `;
    pts.forEach(p => { d += `L ${laneX} ${p.y} `; });
    svg += `<path d="${d}" fill="none" stroke="${a.color}" stroke-width="3.5" marker-end="url(#arrow-${key})"/>`;
    svg += `<defs><marker id="arrow-${key}" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${a.color}"/></marker></defs>`;
    pts.forEach(p => {
      svg += `<circle cx="${laneX}" cy="${p.y}" r="6" fill="${a.color}" stroke="#fff" stroke-width="1.5"/>`;
    });
    // small entry tag near the top of the lane (the entry point), placed in the
    // gap above the bands; lanes are 48px apart so a short tag fits without
    // colliding with its neighbors
    svg += `<text x="${laneX}" y="${top - 12}" font-size="10.5" font-weight="700" fill="${a.color}" text-anchor="middle">${a.entryTag}</text>`;
    svg += `</g>`;
  });

  // path color legend (compact, bottom) — one line per shown attack
  let legendY = top + levels.length * (bandH + gap) + 12;
  Object.keys(attacks).forEach(key => {
    if (activePath !== 'all' && activePath !== key) return;
    const a = attacks[key];
    svg += `<circle cx="${bandX + 8}" cy="${legendY}" r="6" fill="${a.color}"/>`;
    svg += `<text x="${bandX + 20}" y="${legendY + 4}" font-size="11.5" fill="#37474f">${a.label} — entry: ${a.entry}</text>`;
    legendY += 20;
  });

  svg += `</svg>`;
  document.getElementById('diagram').innerHTML = svg;

  // wire interactions
  levels.forEach(l => {
    const el = document.querySelector(`.band[data-key="lvl${l.id}"]`);
    if (!el) return;
    el.addEventListener('mouseenter', () => setTip(l.tip));
    el.addEventListener('click', () => setTip(l.tip));
    el.addEventListener('mouseleave', resetTip);
  });
  Object.keys(attacks).forEach(key => {
    const el = document.querySelector(`.attack[data-key="atk-${key}"]`);
    if (!el) return;
    const a = attacks[key];
    const summary = a.label + ': ' + Object.values(a.tips).join(' ');
    el.addEventListener('mouseenter', () => setTip(summary));
    el.addEventListener('click', () => setTip(summary));
    el.addEventListener('mouseleave', resetTip);
  });
}

function setupButtons() {
  document.querySelectorAll('.pathbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pathbtn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePath = btn.dataset.path;
      resetTip();
      render();
    });
  });
}

render();
setupButtons();
window.addEventListener('resize', render);
