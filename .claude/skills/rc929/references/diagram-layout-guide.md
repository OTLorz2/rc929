# Diagram Layout Guide

Rules for keeping Mermaid diagrams readable in rc929 HTML reports. Apply these **before** writing any `<pre class="mermaid">` block.

## Diagram type selection

| Question shape | Prefer |
|----------------|--------|
| Pipelines, ETL, batch jobs | `flowchart LR` / `graph` |
| Module/package dependencies | `graph` (classes/components as nodes) |
| Multi-party RPC, webhooks, agents | `sequenceDiagram` |
| State machines, modes | `stateDiagram-v2` |
| Layered architecture | `flowchart` with subgraphs |

## Complexity limits

| Rule | Rationale |
|------|-----------|
| Target **~8 nodes** per flowchart (10 hard cap) | Dagre and ELK both degrade beyond this |
| Max **12 edges** per flowchart | Hub nodes (e.g. Gateway) cause label collisions |
| Max **2 cross-subgraph** long-range edges | Long edges spanning layers create crossings |

If a draft exceeds these limits, split into 2–4 focused diagrams before writing HTML.

## When to split

### By concern

| Concern | Diagram type | Example |
|---------|--------------|---------|
| Request / RPC path | `sequenceDiagram` | Client → API → backends |
| Service topology | `flowchart LR` with subgraphs | One runtime layer only |
| Infra / observability | Small `flowchart TB` | Metrics scrape, cache |
| Package / module deps | `flowchart TB` or `graph TD` | Source tree only |

Do **not** combine infrastructure, client, service runtime, and package layers in one flowchart.

### By node count

| Question shape | When to split |
|----------------|---------------|
| Pipelines, ETL, batch jobs | Stages >8 nodes → one diagram per stage |
| Module/package dependencies | Package tree vs import graph → separate diagrams |
| Multi-party RPC, webhooks, agents | Never cram RPC into a flowchart |
| Layered architecture | **One layer per diagram** (infra / services / packages) |

## Syntax patterns

- **Subgraphs per layer** — declare nodes inside `subgraph sg_*` blocks; draw edges between adjacent layers, not diagonally across the whole canvas.
- **Direction** — `flowchart LR` for pipelines; `flowchart TB` only for shallow hierarchies (≤3 levels).
- **Node ordering** — list source nodes before targets so Dagre respects reading order.
- **Edge labels** — shorten repeated labels (`/predict` not `POST /predict` on every edge); explain the verb once in `diagram-caption`.
- **Optional deps** — use `-.->` for non-primary paths to reduce visual weight.

## ELK layout (complex graphs only)

The shell loads Mermaid 11 + `@mermaid-js/layout-elk`. Default layout is Dagre. For an unavoidably dense flowchart, add per-diagram frontmatter:

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

## Analyzer integration

When writing codebase-analyzer output, include a **Suggested Diagrams** section that pre-splits architecture into focused scopes:

```markdown
### Suggested Diagrams
1. **[Scope name]** — type: `sequenceDiagram` | `flowchart LR` | `flowchart TB`
   - Nodes: `symbol1`, `symbol2`, …
   - Key edges: `A → B` (`path:line`)
2. **[Scope name]** — …
```

Each scope = one diagram; keep ≤8 nodes. Do not merge infra, runtime, and package layers into one scope.

## Checklist (diagram-specific)

- [ ] No flowchart exceeds 10 nodes or 12 edges
- [ ] Multi-layer architecture split into ≥2 diagrams (or one `sequenceDiagram` + one topology diagram)
- [ ] Request/RPC flows use `sequenceDiagram` where applicable
- [ ] Edge labels readable without overlap; use fullscreen to verify dense diagrams
