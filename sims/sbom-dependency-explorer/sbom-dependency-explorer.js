// CANVAS_HEIGHT: 600
// SBOM Dependency Tree Explorer (vis-network)
// Bloom: Apply. Given a published CVE in a transitive dependency, the student
// locates the affected component in the SBOM and identifies the dependency path
// from the root application (my-web-app) down to the vulnerable component.
// The graph is loaded from a CycloneDX-style data.json; the side panel shows the
// selected component's metadata, listed CVEs, and the path-from-root breadcrumb.
// Filters narrow the view to vulnerable-only or direct-only dependencies.

// ---------- color palette (brand) ----------
const COLORS = {
  root:       { background: '#1565c0', border: '#0d47a1', font: '#ffffff' },
  direct:     { background: '#455a64', border: '#263238', font: '#ffffff' },
  transitive: { background: '#cfd8dc', border: '#90a4ae', font: '#263238' },
  vuln:       { background: '#ffa000', border: '#c62828', font: '#3e2723' }
};

let sbom = null;          // parsed data.json
let compByRef = {};       // ref -> component
let childrenOf = {};      // ref -> [childRef]
let parentsOf = {};       // ref -> [parentRef]
let network = null;
let allNodes = null;      // vis.DataSet
let allEdges = null;      // vis.DataSet
let nodeRefs = [];        // list of refs in node order
let edgeList = [];        // {id, from, to}
let currentFilter = 'all';
let selectedRef = null;

function isInIframe() {
  try { return window.self !== window.top; } catch (e) { return true; }
}

// ---------- load ----------
fetch('data.json')
  .then(r => r.json())
  .then(data => { sbom = data; index(); build(); })
  .catch(err => {
    document.getElementById('network').innerHTML =
      '<p style="padding:20px;color:#c62828">Could not load data.json: ' + err + '</p>';
  });

function index() {
  sbom.components.forEach(c => { compByRef[c.ref] = c; childrenOf[c.ref] = []; parentsOf[c.ref] = []; });
  sbom.dependencies.forEach(d => {
    (d.dependsOn || []).forEach(child => {
      if (!childrenOf[d.ref]) childrenOf[d.ref] = [];
      childrenOf[d.ref].push(child);
      if (!parentsOf[child]) parentsOf[child] = [];
      parentsOf[child].push(d.ref);
    });
  });
}

// shortest path (BFS) from root 'app' to a target ref -> array of refs
function pathFromRoot(target) {
  const start = 'app';
  if (target === start) return [start];
  const queue = [[start]];
  const seen = new Set([start]);
  while (queue.length) {
    const path = queue.shift();
    const last = path[path.length - 1];
    for (const child of (childrenOf[last] || [])) {
      if (child === target) return path.concat([child]);
      if (!seen.has(child)) { seen.add(child); queue.push(path.concat([child])); }
    }
  }
  return null;
}

function nodeStyle(c) {
  if (c.cves && c.cves.length) return COLORS.vuln;
  if (c.kind === 'root') return COLORS.root;
  if (c.kind === 'direct') return COLORS.direct;
  return COLORS.transitive;
}

function nodeSize(c) {
  if (c.kind === 'root') return 22;
  if (c.kind === 'direct') return 30;   // box margin; handled by font instead
  return 14;
}

function build() {
  const nodes = sbom.components.map(c => {
    const st = nodeStyle(c);
    const fontSize = c.kind === 'root' ? 18 : (c.kind === 'direct' ? 15 : 12);
    return {
      id: c.ref,
      label: c.name + '\n' + c.version,
      color: { background: st.background, border: st.border,
               highlight: { background: st.background, border: '#ffab00' } },
      font: { color: st.font, size: fontSize, face: 'Arial', multi: false },
      borderWidth: (c.cves && c.cves.length) ? 3 : 2,
      shape: 'box',
      margin: 8
    };
  });
  nodeRefs = sbom.components.map(c => c.ref);

  let eid = 0;
  edgeList = [];
  sbom.dependencies.forEach(d => {
    (d.dependsOn || []).forEach(child => {
      edgeList.push({ id: 'e' + (eid++), from: d.ref, to: child });
    });
  });
  // y-offset workaround for horizontal-edge label rendering bug: use smooth curves.
  const edges = edgeList.map(e => ({
    id: e.id, from: e.from, to: e.to,
    color: { color: '#90a4ae', highlight: '#1565c0' },
    arrows: { to: { enabled: true, scaleFactor: 0.7 } },
    smooth: { enabled: true, type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.4 }
  }));

  allNodes = new vis.DataSet(nodes);
  allEdges = new vis.DataSet(edges);

  const enableMouse = !isInIframe();
  const options = {
    layout: {
      improvedLayout: false,
      hierarchical: {
        enabled: true, direction: 'UD', sortMethod: 'directed',
        levelSeparation: 130, nodeSpacing: 105, treeSpacing: 120,
        blockShifting: true, edgeMinimization: true, parentCentralization: true,
        shakeTowards: 'roots'
      }
    },
    physics: { enabled: false },
    interaction: {
      selectConnectedEdges: false,
      zoomView: enableMouse, dragView: enableMouse,
      dragNodes: false, navigationButtons: true, hover: true,
      keyboard: { enabled: true, bindToWindow: false, speed: { x: 2, y: 2, zoom: 0.01 } }
    },
    nodes: { shadow: { enabled: true, color: 'rgba(0,0,0,0.15)', size: 4, x: 1, y: 2 } },
    edges: { width: 1.5 }
  };

  const container = document.getElementById('network');
  network = new vis.Network(container, { nodes: allNodes, edges: allEdges }, options);

  network.on('click', params => {
    if (params.nodes.length) selectComponent(params.nodes[0]);
  });
  // Hierarchical layout finishes after the first draw; fit reliably by deferring.
  const fitView = () => network.fit({ animation: false });
  network.once('afterDrawing', () => { fitView(); setTimeout(fitView, 60); });

  wireControls();
}

// ---------- side panel ----------
function selectComponent(ref) {
  selectedRef = ref;
  const c = compByRef[ref];
  if (!c) return;

  document.getElementById('p-name').textContent = c.name + ' @ ' + c.version;
  const path = pathFromRoot(ref) || [ref];
  let cveHtml = '';
  if (c.cves && c.cves.length) {
    cveHtml = c.cves.map(id => {
      const det = (sbom.cveDetails && sbom.cveDetails[id]) || { severity: 'Unknown', summary: '' };
      return '<div class="cve-line"><span class="cve-id">' + id + '</span>' +
        '<span class="badge sev-' + det.severity + '">' + det.severity + '</span><br>' +
        det.summary + '</div>';
    }).join('');
  } else {
    cveHtml = '<div class="field"><span class="v">No CVEs listed.</span></div>';
  }

  const crumb = path.map(r => compByRef[r] ? compByRef[r].name : r).join(' &rarr; ');

  document.getElementById('p-body').innerHTML =
    '<div class="field"><span class="k">Version:</span> <span class="v">' + c.version + '</span></div>' +
    '<div class="field"><span class="k">License:</span> <span class="v">' + c.license + '</span></div>' +
    '<div class="field"><span class="k">Kind:</span> <span class="v">' + c.kind + '</span></div>' +
    '<div class="field"><span class="k">Hash:</span> <span class="v">' + c.hash.slice(0, 12) + '…</span></div>' +
    '<div class="field"><span class="k">Listed CVEs:</span></div>' + cveHtml +
    '<div class="field" style="margin-top:8px"><span class="k">Path from root:</span></div>' +
    '<div class="breadcrumb">' + crumb + '</div>';

  highlightPath(path);
}

// highlight the path-from-root: emphasize path nodes/edges, dim the rest
function highlightPath(path) {
  const pathSet = new Set(path);
  const pathEdges = new Set();
  for (let i = 0; i < path.length - 1; i++) pathEdges.add(path[i] + '|' + path[i + 1]);

  allNodes.update(visibleNodeIds().map(ref => {
    const c = compByRef[ref];
    const st = nodeStyle(c);
    const on = pathSet.has(ref);
    return {
      id: ref,
      opacity: on ? 1 : 0.28,
      borderWidth: on ? 4 : ((c.cves && c.cves.length) ? 3 : 2),
      color: { background: st.background, border: on ? '#ffab00' : st.border }
    };
  }));
  allEdges.update(edgeList.map(e => {
    const on = pathEdges.has(e.from + '|' + e.to);
    return { id: e.id, color: { color: on ? '#1565c0' : '#cfd8dc' }, width: on ? 3 : 1.2 };
  }));
}

function clearHighlight() {
  allNodes.update(visibleNodeIds().map(ref => {
    const c = compByRef[ref];
    const st = nodeStyle(c);
    return { id: ref, opacity: 1, borderWidth: (c.cves && c.cves.length) ? 3 : 2,
             color: { background: st.background, border: st.border } };
  }));
  allEdges.update(edgeList.map(e => ({ id: e.id, color: { color: '#90a4ae' }, width: 1.5 })));
}

// ---------- filters ----------
function visibleNodeIds() {
  return nodeRefs.filter(ref => {
    const hidden = allNodes.get(ref) && allNodes.get(ref).hidden;
    return !hidden;
  });
}

// set of refs on any root->vuln path (used by "show vulnerable only")
function vulnerableSubgraph() {
  const keep = new Set();
  sbom.components.filter(c => c.cves && c.cves.length).forEach(c => {
    const p = pathFromRoot(c.ref);
    if (p) p.forEach(r => keep.add(r));
  });
  return keep;
}

function applyFilter(name) {
  currentFilter = name;
  selectedRef = null;
  clearHighlight();

  let keep;
  if (name === 'vuln') {
    keep = vulnerableSubgraph();
  } else if (name === 'direct') {
    keep = new Set(['app']);
    (childrenOf['app'] || []).forEach(r => keep.add(r));
  } else {
    keep = new Set(nodeRefs);
  }

  allNodes.update(nodeRefs.map(ref => ({ id: ref, hidden: !keep.has(ref) })));
  allEdges.update(edgeList.map(e => ({ id: e.id, hidden: !(keep.has(e.from) && keep.has(e.to)) })));

  ['btn-vuln', 'btn-direct', 'btn-reset'].forEach(id => document.getElementById(id).classList.remove('active'));
  document.getElementById(name === 'vuln' ? 'btn-vuln' : name === 'direct' ? 'btn-direct' : 'btn-reset').classList.add('active');

  network.fit({ animation: false });

  document.getElementById('p-name').textContent = 'Select a component';
  document.getElementById('p-body').innerHTML =
    '<p class="hint">' +
    (name === 'vuln' ? 'Showing only components on a path from the root to a known CVE. '
     : name === 'direct' ? 'Showing the root and its direct dependencies only. '
     : 'Showing the full dependency tree. ') +
    'Click a node to see details and its path from the root.</p>';
}

// ---------- search (allow-list filtered to alphanumerics) ----------
function doSearch(raw) {
  const q = raw.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
  if (!q) return;
  const hit = sbom.components.find(c => c.name.toLowerCase().indexOf(q) !== -1);
  if (hit) {
    if (currentFilter !== 'all') applyFilter('all');
    network.selectNodes([hit.ref]);
    network.focus(hit.ref, { scale: 1.1, animation: { duration: 350 } });
    selectComponent(hit.ref);
  }
}

function wireControls() {
  document.getElementById('btn-vuln').addEventListener('click', () => applyFilter('vuln'));
  document.getElementById('btn-direct').addEventListener('click', () => applyFilter('direct'));
  document.getElementById('btn-reset').addEventListener('click', () => applyFilter('all'));
  const search = document.getElementById('search');
  search.addEventListener('input', () => { search.value = search.value.replace(/[^a-zA-Z0-9-]/g, ''); });
  search.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(search.value); });
}
