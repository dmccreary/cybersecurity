# Generation Log: sbom-dependency-explorer

- **sim-id:** sbom-dependency-explorer
- **Library:** vis-network (standalone UMD build + vis-network CSS for nav buttons)
- **Bloom level/verb:** Apply / Locate
- **Learning objective:** Given a published CVE in a transitive dependency, locate
  the affected component in an SBOM and identify the dependency path from the root
  application (`my-web-app v1.4.2`) to the vulnerable component.

## Instructional-design decision

Bloom "Apply" → the interaction is an *explorer*, not an animation: the student
acts on the graph (click to highlight a path, filter, search) to accomplish a
concrete task (trace a CVE to its root). A hierarchical UD tree (root at top,
direct deps next, transitive deps below) makes the "path from root" concept
spatially obvious — depth in the tree literally equals distance from the
application the team controls. Two CVEs were placed on *transitive* nodes
(`log4js@2.4.0` three levels deep, `follow-redirects` two levels deep) so the
exercise reinforces the key misconception target: vulnerable components are
usually ones nobody on the team chose to install.

## Implementation approach

- `data.json` is a CycloneDX-style SBOM: 32 components (`root` / `direct` /
  `transitive` kinds), a `dependencies` adjacency list, and a `cveDetails` map
  with severity + summary.
- `sbom-dependency-explorer.js` indexes the components, builds vis DataSets, and
  uses vis-network **hierarchical** layout (`improvedLayout:false`, UD,
  `sortMethod:'directed'`, levelSeparation 130 / nodeSpacing 105). Physics off.
- Path-from-root is computed by BFS; clicking a node highlights its path
  (amber-bordered path nodes, blue path edges, the rest dimmed to 0.28 opacity)
  and fills the side panel with version/license/kind/truncated-hash, listed CVEs
  (with severity badge + summary), and an arrow-separated breadcrumb.
- Filters: **Show vulnerable only** (root→CVE subgraph via BFS union),
  **Show direct only** (root + its children), **Show all**. Active button styled.
- **Find** box: input is allow-list filtered to `[A-Za-z0-9-]`, Enter focuses and
  selects the matched node. Iframe-aware interaction (zoom/pan only outside an
  iframe); navigation buttons always on; vis-network CSS loaded for the button
  icons.

## Validation score

- Before: scaffold (boilerplate metadata "Dementia Education Project").
- After: **100 / A** (validate-sims.py).

## Layout review (Claude Vision)

- Vision model: Claude Opus 4.8 (1M context) (`claude-opus-4-8[1m]`).
- Cycle 1: graph rendered but bunched into the lower-left corner with overlapping
  nodes on the deepest rows and large empty top/right area — the initial
  `levelSeparation 95 / nodeSpacing 70` was too tight and `fit()` had not settled.
- Fix: raised `levelSeparation` to 130 and `nodeSpacing` to 105, added
  `improvedLayout:false` + `shakeTowards:'roots'`, and deferred a second
  `network.fit()` 60ms after the first draw so hierarchical layout has finished.
- Cycle 2: clean — root centered at top, 8 direct deps spread evenly on level 2,
  transitive deps fan out below, both CVE nodes clearly amber/red, all labels
  legible, controls/legend/panel uncllipped. Some benign top whitespace remains
  because the tree is wider than tall (expected for a 4-level, 32-node tree).
- **Final state: clean.**
