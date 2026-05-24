# HTML Report Guide

Build **one** self-contained research page. Accuracy > decoration.

**Always start from** `references/html-shell-template.html` — copy the full `<head>` CSS, page chrome (scroll bar, ambient blobs, hero, toc-rail, footer), and bottom `<script>` block **intact**; only replace hero text and `<main>` content.

If the user provides a `template.html` at repo root, **do not edit it**. Treat it as a style reference only — ignore its research-specific content; the bundled shell already encodes its layout, palette, and JS behavior.

## Architecture (keep lean)

| Layer | File | Purpose |
|-------|------|---------|
| Workflow | `SKILL.md` | Research process, accuracy |
| UI shell | `html-shell-template.html` | Layout, diagram fullscreen, toc-rail, mermaid |
| UI rules | `html-report-guide.md` | This file — conventions |
| Discovery | `codebase-locator.md`, `codebase-analyzer.md` | Code exploration |

Do not fork new CSS/JS patterns per report — extend the shell once if a feature is missing for everyone.

## Visual system (from user template)

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
| **Hero `<h1>`** | One plain title line in `--moss`; do not split with `<em>` (no clay/orange accent) |
| **Section ids: `<slug>`** (e.g. `summary`, `diagrams`) | Match shell + user template; keep slugs unique |
| **Mermaid ids: `sg_` / `n_` prefixes** | e.g. `subgraph sg_plugins["plugins/"]` — never equal a section id |
| **TOC `href="#<slug>"` + text = `<h2>`** | Label match; IntersectionObserver highlights active link |
| **Diagram fullscreen** | Keep shell `setupDiagramFullscreen()` — injects `.diagram-fs-btn` on each `.diagram-wrap` after mermaid render; Ctrl+wheel zoom in overlay; Esc closes |
| **Do not remove shell JS** | `data-mermaid-source`, toc-rail positioning, scroll progress bar |
| **Static `.ref`** | No copy chips or pointer gimmicks |
| **要点 = `.summary-list`** | Ordered list with `<strong>` lead terms; not a dense prose wall |

## Page structure

```html
<section id="summary">
  <div class="section-head"><span class="section-num">01</span><h2>要点</h2></div>
  <ol class="summary-list">
    <li><strong>主题</strong>：… <code class="ref">path:line</code></li>
  </ol>
</section>
<section id="diagrams">
  <div class="section-head"><span class="section-num">02</span><h2>架构概览</h2></div>
  <div class="diagram-wrap">
    <pre class="mermaid">… subgraph sg_…</pre>
    <p class="diagram-caption">Sources: …</p>
  </div>
</section>
```

Optional sections (reuse shell classes): `.card-grid` + `.step-card`, `.table-wrap`, `.evidence-stack` + `<details>`, `#gaps` list.

## Mermaid

- Real module/function names in labels
- `diagram-caption` with Sources
- No subgraph/node id equal to any section id

## Pre-delivery checklist

1. Single `.html`; shell `<script>` block included unchanged
2. Hero, meta pills, question panel filled with **this** research (not template sample text)
3. All section ids match TOC `href`s; each TOC label equals its `<h2>`
4. Click each TOC link — lands on correct section (not diagram SVG)
5. Hover diagram — `.diagram-fs-btn` appears; click opens fullscreen overlay; Ctrl+wheel zooms; Esc closes
6. 要点 uses `.summary-list` with cited findings
7. Accuracy: diagrams traceable to code
