# HTML Report Guide

Build **one** self-contained research page. Accuracy > decoration.

**Always start from** `references/html-shell-template.html` — copy the full `<head>` CSS, page chrome, and bottom `<script>` block **intact**; only replace header metadata and `<main>` content.

If `template.html` was present in the skill root at invocation, it has already been consumed: a subagent synced this shell and guide from it, then deleted the file. Do not look for `template.html` during report build — use the updated files below.

## Architecture (keep lean)

| Layer | File | Purpose |
|-------|------|---------|
| Workflow | `SKILL.md` | Research process, accuracy, template sync trigger |
| Template sync | `template-sync-guide.md` | How to update shell from new `template.html` |
| UI shell | `html-shell-template.html` | Layout, CSS, JS — current generation |
| UI rules | `html-report-guide.md` | This file — conventions |
| Discovery | `codebase-locator.md`, `codebase-analyzer.md` | Code exploration |

Do not fork new CSS/JS patterns per report — extend the shell once if a feature is missing for everyone.

## Visual system (current shell)

> **Note:** Values below reflect the **current** synced shell. After a template sync, these rows are rewritten to match the new template.

| Element | Value |
|---------|-------|
| Display font | Fraunces (`var(--display)`) |
| Body font | Libre Baskerville 16px, line-height 1.72 |
| Mono / refs | IBM Plex Mono |
| Palette | Moss/sage/clay on warm parchment (`--bg`, `--surface`, `--moss`, …) |
| Page width | `--page-max: 1400px` |
| Hero | `.hero-grid` — single-line `<h1>{{title}}</h1>` (moss color only; **no** `<em>` subtitle split) |
| TOC | Fixed `.toc-rail` with numbered `.idx` links |
| Sections | `.section-head` + `.section-num` + `<h2>` |

## Hard UI rules

| Rule | Why |
|------|-----|
| **Hero `<h1>`** | One plain title line; follow shell's color/weight conventions |
| **Section ids: `<slug>`** (e.g. `summary`, `diagrams`) | Keep slugs unique |
| **Mermaid ids: `sg_` / `n_` prefixes** | e.g. `subgraph sg_plugins["plugins/"]` — never equal a section id |
| **TOC `href="#<slug>"` + text = `<h2>`** | Label match; active-link highlighting per shell JS |
| **Diagram interactions** | Preserve shell JS (e.g. `setupDiagramFullscreen()` if present) |
| **Do not remove shell JS** | Mermaid init, TOC tracking, scroll progress — keep intact |
| **Static `.ref`** | No copy chips or pointer gimmicks unless shell includes them |
| **要点** | Use shell's list pattern (`.summary-list` or `<ul>` per current template) |
| **Explanatory prose required** | Every section must have a `.section-prose` block (2+ sentences) explaining the topic in plain language — diagrams alone are insufficient |

## Prose guidelines

Reports must balance visual elements with substantive text. Diagrams show **structure**; prose explains **behavior, rationale, and context**.

### Minimum text requirements

- Each `<section>` must contain at least one `<div class="section-prose">` with 2+ sentences of explanatory text
- After every diagram, write a paragraph explaining what the diagram shows, key relationships, and non-obvious details
- 要点 items should be full sentences with enough context for a reader unfamiliar with the codebase
- Step cards and table cells should contain complete explanations, not just labels

### `.section-prose` usage

```html
<div class="section-prose">
  <p>Explanatory paragraph here. Describe what this section covers,
  why the architecture works this way, and what constraints shaped the design.</p>
  <p>Additional context paragraph if needed — relationships between components,
  edge cases, or historical decisions worth noting.</p>
</div>
```

Place `.section-prose` blocks:
- After the `<h2>` section header (before diagrams) to introduce the topic
- After diagrams to explain what the reader is looking at
- Before evidence/code snippets to contextualize them

## Page structure

Follow the section pattern in the current shell. Typical layout:

```html
<section id="summary">
  <div class="section-head"><span class="section-num">01</span><h2>要点</h2></div>
  <div class="section-prose">
    <p>概述本次研究的背景和核心发现，帮助读者快速理解整体结论。</p>
  </div>
  <ol class="summary-list">
    <li><strong>主题</strong>：… <code class="ref">path:line</code></li>
  </ol>
</section>
<section id="diagrams">
  <div class="section-head"><span class="section-num">02</span><h2>架构概览</h2></div>
  <div class="section-prose">
    <p>介绍段落：说明本架构的设计思路和主要组件之间的关系。</p>
  </div>
  <div class="diagram-wrap">
    <pre class="mermaid">… subgraph sg_…</pre>
    <p class="diagram-caption">Sources: …</p>
  </div>
  <div class="section-prose">
    <p>图后解释：描述图中的关键路径、各节点职责，以及图中未体现的约束和设计决策。</p>
  </div>
</section>
```

If the synced shell uses plain `<h2>` and `<ul>` instead, follow **that** pattern — do not force `.section-head` if the shell doesn't have it.

Optional sections (reuse shell classes): `.card-grid` + `.step-card`, `.table-wrap`, `.evidence-stack` + `<details>`, `#gaps` list.

## Mermaid

- Real module/function names in labels
- `diagram-caption` with Sources
- No subgraph/node id equal to any section id

## Diagram layout

Dense single flowcharts produce overlapping edges and unreadable labels. **Split before you draw** — follow these rules in addition to the Mermaid id rules above.

### Complexity limits

| Rule | Rationale |
|------|-----------|
| Target **~8 nodes** per flowchart (10 hard cap) | Dagre and ELK both degrade beyond this |
| Max **12 edges** per flowchart | Hub nodes (e.g. Gateway) cause label collisions |
| Max **2 cross-subgraph** long-range edges | Long edges spanning layers create crossings |

If a draft exceeds these limits, split into 2–4 focused diagrams before writing HTML.

### When to split (by concern)

| Concern | Diagram type | Example |
|---------|--------------|---------|
| Request / RPC path | `sequenceDiagram` | Client → API → backends |
| Service topology | `flowchart LR` with subgraphs | One runtime layer only |
| Infra / observability | Small `flowchart TB` | Metrics scrape, cache |
| Package / module deps | `flowchart TB` or `graph TD` | Source tree only |

Do **not** combine infrastructure, client, service runtime, and package layers in one flowchart.

### Syntax patterns

- **Subgraphs per layer** — declare nodes inside `subgraph sg_*` blocks; draw edges between adjacent layers, not diagonally across the whole canvas.
- **Direction** — `flowchart LR` for pipelines; `flowchart TB` only for shallow hierarchies (≤3 levels).
- **Node ordering** — list source nodes before targets so Dagre respects reading order.
- **Edge labels** — shorten repeated labels (`/predict` not `POST /predict` on every edge); explain the verb once in `diagram-caption`.
- **Optional deps** — use `-.->` for non-primary paths to reduce visual weight.

### ELK layout (complex graphs only)

The shell loads Mermaid 11 + `@mermaid-js/layout-elk`. Default layout is Dagre. For a unavoidably dense flowchart, add per-diagram frontmatter:

````
<pre class="mermaid">
---
config:
  layout: elk
  elk:
    nodePlacementStrategy: LINEAR_SEGMENTS
    mergeEdges: true
---
flowchart TB
  subgraph sg_api["API layer"]
    n_gw["gateway"]
  end
  ...
</pre>
````

Prefer splitting over ELK when possible. ELK is a safety net, not a substitute for good authoring.

## Pre-delivery checklist

1. Single `.html`; shell `<script type="module">` block included unchanged
2. Header, meta, question panel filled with **this** research (not template sample text)
3. All section ids match TOC `href`s; each TOC label equals its `<h2>`
4. Click each TOC link — lands on correct section (not diagram SVG)
5. Diagram interactions work per shell (fullscreen, zoom, etc. if provided)
6. 要点 uses shell's list format with cited findings
7. Accuracy: diagrams traceable to code
8. No flowchart exceeds 10 nodes or 12 edges
9. Multi-layer architecture split into ≥2 diagrams (or one `sequenceDiagram` + one topology diagram)
10. Request/RPC flows use `sequenceDiagram` where applicable
11. Edge labels readable without overlap; use fullscreen to verify dense diagrams
