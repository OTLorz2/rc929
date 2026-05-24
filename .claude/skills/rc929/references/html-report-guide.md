# HTML Report Guide

Build **one** self-contained research page. Accuracy > decoration.

**Always start from** `references/html-shell-template.html` — copy layout, CSS, and the bottom `<script>` block intact; only replace header/main content.

## Architecture (keep lean)

| Layer | File | Purpose |
|-------|------|---------|
| Workflow | `SKILL.md` | Research process, accuracy |
| UI shell | `html-shell-template.html` | Layout, zoom modal, anchors, mermaid |
| UI rules | `html-report-guide.md` | This file — conventions |
| Discovery | `codebase-locator.md`, `codebase-analyzer.md` | Code exploration |

Do not fork new CSS/JS patterns per report — extend the shell once if a feature is missing for everyone.

## Hard UI rules

| Rule | Why |
|------|-----|
| **Section ids: `sec-<slug>`** | Bare ids like `plugins` collide with Mermaid subgraph ids → TOC jumps to SVG (documented bug in delivery report) |
| **Mermaid ids: `sg_` / `n_` prefixes** | e.g. `subgraph sg_plugins["plugins/"]` not `subgraph plugins` |
| **TOC `href="#sec-…"` + text = `<h2>`** | Label match for humans; `sec-` prefix for safe `getElementById` |
| **Wide layout** | `--content-max: min(1440px, 98vw)` — avoid 1100px column floating in empty viewport |
| **要点 = summary-cards** | Lead line + 3–6 cards; not a dense `<ul>` wall |
| **Diagram zoom** | Keep shell `.diagram-wrap` click → `#diagramModal` lightbox with +/- / wheel |
| **Static `.ref`** | No copy chips or pointer gimmicks |
| **Mermaid theme** | `data-mermaid-source` + re-run on theme toggle (shell script) |

## Page structure

```html
<section id="sec-summary"><h2>要点</h2>
  <p class="summary-lead">…</p>
  <div class="summary-cards">…</div>
</section>
<section id="sec-…"><h2>…</h2>
  <div class="diagram-wrap" data-diagram-title="…">
    <pre class="mermaid">… subgraph sg_…</pre>
  </div>
</section>
```

## Mermaid

- Real module/function names in labels
- `diagram-caption` with Sources
- No subgraph/node id equal to any `sec-*` slug

## Pre-delivery checklist

1. Single `.html`; shell script included
2. All sections use `id="sec-…"`; TOC uses matching `#sec-…`
3. Click each TOC link — lands on correct section (not diagram)
4. Click a diagram — modal opens, zoom works, Esc closes
5. Theme toggle twice — diagrams intact
6. 要点 uses `summary-cards`, not cramped bullet-only block
7. Accuracy: diagrams traceable to code
