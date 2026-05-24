---
name: rc929
description: Deep, accurate codebase exploration for user research questions, delivered as ONE self-contained HTML report with diagrams and interactive navigation. Use whenever the user asks to explore, map, trace, document, or research how code works in a repository (data flows, architecture, class dependencies, request lifecycles, module boundaries, agent/tool wiring)—even if they do not say "HTML" or "report". Prefer this over markdown research dumps when the goal is understanding a codebase visually. Accuracy of findings is mandatory; aesthetics support comprehension, never override facts.
---

# rc929 — Codebase Research → Single HTML Report

Turn a research question into **one** accurate, visual, interactive HTML file. The user reads by **looking** (diagrams, cards, tabs) more than scrolling walls of text.

## Non-negotiables

1. **Accuracy first** — Every claim needs evidence (`path:line` or quoted symbol). If uncertain, mark `待验证` and do not draw it in diagrams as fact.
2. **Exactly one deliverable** — One `.html` file, self-contained (inline CSS/JS; CDN only for fonts/mermaid if needed). No companion markdown, no folder of assets unless embedded as data URLs.
3. **Document what IS** — No refactors, critiques, or "should" unless the user explicitly asked.
4. **Fresh research** — Read the live codebase; do not trust stale docs alone.

## When to read bundled references

| File | Read when |
|------|-----------|
| `references/codebase-locator.md` | Before/during discovery — finding WHERE files live |
| `references/codebase-analyzer.md` | After locators — tracing HOW code works |
| `references/html-report-guide.md` | Before writing HTML — structure, mermaid rules, UI patterns |
| `references/html-shell-template.html` | **Copy this shell** — fonts, theme/mermaid JS, TOC conventions |

For visual polish, apply principles from the **frontend-design** skill (distinctive typography, cohesive palette, intentional motion)—but never sacrifice accuracy for aesthetics.

## Research workflow

### 1. Intake

Confirm the research question. If the user named files/docs, **read them fully first** (no partial reads) before spawning sub-tasks.

Gather metadata for the report footer/header:
- Repository path/name, date (ISO), git branch/commit if available
- Original question verbatim

### 2. Plan

Decompose the question into 2–6 investigable areas (e.g., entry points, storage, external APIs, error paths). Use a todo list for multi-area research.

Choose diagram types **up front** (only where evidence supports them):

| Question shape | Prefer |
|----------------|--------|
| Pipelines, ETL, batch jobs | `flowchart` / `graph` |
| Module/package dependencies | `graph` (classes/components as nodes) |
| Multi-party RPC, webhooks, agents | `sequenceDiagram` |
| State machines, modes | `stateDiagram-v2` |
| Layered architecture | `flowchart` with subgraphs |

### 3. Explore (locator → analyzer)

Mirror the proven two-phase pattern:

**Phase A — Locate (WHERE)**  
Act as **codebase-locator** (see `references/codebase-locator.md`): Grep/Glob/Bash for keywords, naming patterns, directories. Output grouped file lists with one-line roles. Do not deep-read implementation yet.

**Phase B — Analyze (HOW)**  
Act as **codebase-analyzer** (see `references/codebase-analyzer.md`): Read entry points, trace calls and data transformations, record `file:line` for each step. Parallelize independent areas (Task/subagents when available).

**Phase C — Cross-check**  
- Re-read critical paths you diagrammed; remove nodes/edges you cannot cite.
- Prefer primary source (source code) over README/architecture PNGs; if docs disagree with code, show **code truth** and note the doc mismatch briefly.

### 4. Synthesize for visual HTML

**Lead with diagrams**, then short supporting sections:

- Executive visual: 1–2 hero diagrams answering the question
- **要点**: one-sentence `summary-lead` plus `summary-cards` grid (3–6 cards) — avoid a dense bullet wall on first scroll
- Evidence panels: collapsible `file:line` snippets (keep snippets short; link to path)
- Optional: comparison table, timeline, or "key symbols" glossary

Cap prose: prefer cards, diagrams, tables, and `<details>` over long paragraphs.

### 5. Build the single HTML file

Follow `references/html-report-guide.md` and **base the page on** `references/html-shell-template.html`. Requirements:

- Filename: `research-<kebab-topic>-<YYYY-MM-DD>.html` (or user-specified path)
- **Layout**: copy shell widths (`min(1440px, 98vw)`), sidebar + wide main; optional `sidebar-card` for reading hints
- **Section ids**: `id="sec-<slug>"` only — Mermaid subgraph/node ids must use `sg_` / `n_` prefixes and never equal a section slug (prevents `#plugins` anchor jumping into SVG)
- **Typography**: Source Sans 3 **17px** body, line-height ≥1.7; headings 700. Static `<code class="ref">` only
- **TOC**: `href="#sec-…"` and link text **exactly** equals `<h2>`; use shell click handler + `scroll-margin-top`
- **Diagrams**: shell lightbox zoom (click diagram, +/- / wheel / Esc) — required for complex charts
- **Mermaid**: `data-mermaid-source` + theme re-render per shell script

**Do not** split into multiple HTML pages or export PDF unless asked.

### 6. Handoff

Tell the user:
- Path to the HTML file
- 2–3 sentence factual summary
- What to open first (which diagram/section)
- Any `待验证` items or open gaps

## Quality checklist (before delivery)

- [ ] Single `.html` only
- [ ] Research question stated in header
- [ ] At least one mermaid diagram if the topic involves flow/structure/interaction
- [ ] Every diagram node/edge traceable to code (or labeled hypothetical)
- [ ] No improvement recommendations unless requested
- [ ] Metadata block (date, commit, repo) present
- [ ] Open in browser mentally: mermaid syntax valid; theme toggle re-renders diagrams
- [ ] TOC labels match every `<h2>` exactly; no click-only ref widgets
- [ ] Body font readable (Source Sans 3 17px); 要点 uses summary-cards
- [ ] Section ids prefixed `sec-`; Mermaid ids prefixed `sg_`/`n_`; TOC anchors land on sections
- [ ] Diagram lightbox works; layout uses wide shell (not narrow 1100px column)

## Parallel agents (when available)

Spawn focused read-only tasks:

- **Locator task**: "Find all files involved in [topic]; group by role; no implementation analysis."
- **Analyzer task**: "Trace [flow] from entry X; document steps with file:line; no critique."

Wait for all tasks before final synthesis. Main context synthesizes and builds HTML.

## Common failure modes (avoid)

| Failure | Fix |
|---------|-----|
| Generic purple-gradient "AI slop" UI | Pick a context-specific aesthetic (see frontend-design) |
| Diagram fiction | Build diagrams from analyzer notes only; delete unverified edges |
| Markdown report instead of HTML | Deliverable must be `.html` |
| Multiple files | Merge everything into one file |
| Wall of text | Convert to diagram + collapsible evidence |
| TOC jumps wrong section | Mermaid id collides with `section id` — use `sec-*` + `sg_*` prefixes |
| Cramped 要点 | Use `summary-lead` + `summary-cards` from shell |
| Tiny diagrams | Shell diagram modal zoom; split into overview + detail diagrams if needed |

## Example user prompts (trigger this skill)

- "探索这个仓库里数据是怎么从抓取到入库再到分析的"
- "画一下 CLI 启动后一次请求是怎么走的"
- "这些 agent 之间怎么协作？给我一份能点开看的说明"
