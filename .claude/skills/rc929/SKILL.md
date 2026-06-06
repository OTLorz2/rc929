---
name: rc929
description: Deep, accurate codebase exploration for user research questions, delivered as ONE self-contained HTML report with diagrams and interactive navigation. Use whenever the user asks to explore, map, trace, document, or research how code works in a repository (data flows, architecture, class dependencies, request lifecycles, module boundaries, agent/tool wiring)—even if they do not say "HTML" or "report". Prefer this over markdown research dumps when the goal is understanding a codebase visually. Also use when the user drops a new template.html into the rc929 skill folder to restyle reports. Accuracy of findings is mandatory; aesthetics support comprehension, never override facts.
---

# rc929 — Codebase Research → Single HTML Report

Turn a research question into **one** accurate, well-explained, interactive HTML file. Diagrams provide structural overview; **prose provides understanding**. Every diagram and code reference must be accompanied by clear textual explanation of what it means and why it matters.

## Non-negotiables

1. **Accuracy first** — Every claim needs evidence (`path:line` or quoted symbol). If uncertain, mark `待验证` and do not draw it in diagrams as fact.
2. **Exactly one deliverable** — One `.html` file, self-contained (inline CSS/JS; CDN only for fonts/mermaid if needed). No companion markdown, no folder of assets unless embedded as data URLs.
3. **Document what IS** — No refactors, critiques, or "should" unless the user explicitly asked.
4. **Fresh research** — Read the live codebase; do not trust stale docs alone.

## When to read bundled references

| File | Read when |
|------|-----------|
| `references/template-sync-guide.md` | **First**, if `template.html` exists in this skill's root directory |
| `references/codebase-locator.md` | Before/during discovery — finding WHERE files live |
| `references/codebase-analyzer.md` | After locators — tracing HOW code works |
| `references/html-report-guide.md` | Before writing HTML — structure, mermaid rules, UI patterns |
| `references/html-shell-template.html` | **Copy this shell** — layout, CSS, JS for the current template generation |

For visual polish, apply principles from the **frontend-design** skill (distinctive typography, cohesive palette, intentional motion)—but never sacrifice accuracy for aesthetics.

## Research workflow

### 0. Template sync (if needed)

**Before intake**, check whether `template.html` exists in **this skill's root directory** (alongside `SKILL.md`).

```
Glob or Read: .claude/skills/rc929/template.html
```

| Result | Action |
|--------|--------|
| **Not found** | Skip to §1 Intake |
| **Found** | Spawn a **subagent** to sync — **do not** do this in the main context |

**Why subagent:** Template sync rewrites `html-shell-template.html` and `html-report-guide.md` (large diffs). The main agent needs full context for the user's research; offloading sync prevents context exhaustion before exploration begins.

**Subagent task:** Follow `references/template-sync-guide.md` end-to-end:
1. Read `template.html` for **UI structure, CSS, JS, layout only** — ignore all research content
2. Update `references/html-shell-template.html` (generic shell with placeholders)
3. Update `references/html-report-guide.md` (visual system + UI rules to match)
4. **Delete** `template.html` from the skill root

Wait for the subagent to finish. Briefly note what changed (fonts, layout, toc style). Then proceed to §1 — read the **updated** guide and shell when building HTML.

### 1. Intake

Confirm the research question. If the user named files/docs, **read them fully first** (no partial reads) before spawning sub-tasks.

Gather metadata for the report footer/header:
- Repository path/name, date (ISO), git branch/commit if available
- Original question verbatim

### 2. Plan

Decompose the question into 2–6 investigable areas (e.g., entry points, storage, external APIs, error paths). Use a todo list for multi-area research.

Choose diagram types **up front** (only where evidence supports them). For layout rules (node/edge limits, when to split), read `references/html-report-guide.md` § Diagram layout.

| Question shape | Prefer | When to split |
|----------------|--------|---------------|
| Pipelines, ETL, batch jobs | `flowchart LR` / `graph` | Stages >8 nodes → one diagram per stage |
| Module/package dependencies | `graph` (classes/components as nodes) | Package tree vs import graph → separate diagrams |
| Multi-party RPC, webhooks, agents | `sequenceDiagram` | Never cram RPC into a flowchart |
| State machines, modes | `stateDiagram-v2` | — |
| Layered architecture | `flowchart` with subgraphs | **One layer per diagram** (infra / services / packages) |

### 3. Explore (locator → analyzer)

Mirror the proven two-phase pattern:

**Phase A — Locate (WHERE)**  
Act as **codebase-locator** (see `references/codebase-locator.md`): Grep/Glob/Bash for keywords, naming patterns, directories. Output grouped file lists with one-line roles. Do not deep-read implementation yet.

**Phase B — Analyze (HOW)**  
Act as **codebase-analyzer** (see `references/codebase-analyzer.md`): Read entry points, trace calls and data transformations, record `file:line` for each step. Parallelize independent areas (Task/subagents when available).

**Phase C — Cross-check**  
- Re-read critical paths you diagrammed; remove nodes/edges you cannot cite.
- Prefer primary source (source code) over README/architecture PNGs; if docs disagree with code, show **code truth** and note the doc mismatch briefly.

### 4. Synthesize for explained HTML

**Pair every diagram with substantive prose.** A diagram shows structure; text explains behavior, rationale, and context that diagrams cannot convey.

- **要点**: summary list with enough detail that a reader unfamiliar with the codebase can follow (format per `html-report-guide.md`)
- Executive visual: 2–4 **focused** diagrams answering the question (split by concern per `html-report-guide.md` § Diagram layout), each followed by 2–4 paragraphs explaining the flow in plain language
- Detail sections: for each topic area, write **explanatory paragraphs first** (what happens, why it's designed this way, what constraints apply), then support with diagrams/tables/code if helpful
- Evidence panels: collapsible `file:line` snippets for readers who want to verify

Minimum text per section: each `<section>` must contain at least one `.section-prose` block (2+ sentences of explanatory context) beyond diagrams and bullet points. If a section is only a diagram with a caption, add explanation.

### 5. Build the single HTML file

Follow `references/html-report-guide.md` and **base the page on** `references/html-shell-template.html`. Replace all placeholder/sample content with **this research's** findings only.

- Filename: `<YYYY-MM-DD>-research-<kebab-topic>.html`
- Default path: `thoughts/research/` (create if needed; overridden by user-specified path)
- **Layout**: copy shell CSS/JS/layout intact; fill header + `<main>` with research content
- **Section ids**: per guide (typically `id="<slug>"`) — Mermaid subgraph/node ids must use `sg_` / `n_` prefixes and never equal a section id
- **TOC**: per guide — link text **exactly** equals `<h2>`
- **Diagrams**: preserve shell diagram interactions (fullscreen button if present in shell)
- **Mermaid**: `data-mermaid-source` preserved where shell uses it; re-init after render if shell requires

**Do not** split into multiple HTML pages or export PDF unless asked.

### 6. Handoff

Tell the user:
- Path to the HTML file
- 2–3 sentence factual summary
- What to open first (which diagram/section)
- Any `待验证` items or open gaps
- If template sync ran: note shell was updated and `template.html` consumed

## Quality checklist (before delivery)

- [ ] Single `.html` only
- [ ] Research question stated in header
- [ ] At least one mermaid diagram if the topic involves flow/structure/interaction
- [ ] Every diagram node/edge traceable to code (or labeled hypothetical)
- [ ] **Every section has a `.section-prose` block with 2+ sentences of explanatory text**
- [ ] **Every diagram is followed by a prose paragraph explaining what it shows**
- [ ] No improvement recommendations unless requested
- [ ] Metadata block (date, commit, repo) present
- [ ] Open in browser mentally: mermaid syntax valid; theme toggle re-renders diagrams (if shell has theme toggle)
- [ ] TOC labels match every `<h2>` exactly
- [ ] Section ids unique; Mermaid ids prefixed `sg_`/`n_`; TOC anchors land on sections
- [ ] No flowchart exceeds 10 nodes or 12 edges; multi-layer arch split into ≥2 diagrams
- [ ] Request/RPC flows use `sequenceDiagram`; edge labels readable without overlap
- [ ] Shell layout and typography match current `html-report-guide.md`
- [ ] No copied template sample research text (e.g. claude-code paths when researching a different repo)

## Parallel agents (when available)

Spawn focused read-only tasks:

- **Template sync task** (only if `template.html` present): "Sync rc929 HTML shell from template.html per template-sync-guide.md; delete template when done."
- **Locator task**: "Find all files involved in [topic]; group by role; no implementation analysis."
- **Analyzer task**: "Trace [flow] from entry X; document steps with file:line; no critique."

Wait for template sync (if any) before research. Wait for all explore tasks before final synthesis. Main context synthesizes and builds HTML.

## Common failure modes (avoid)

| Failure | Fix |
|---------|-----|
| Main agent syncs template itself | Spawn subagent; preserve main context for research |
| Template sample content leaks into report | Sync ignores content; build HTML from live research only |
| Left template.html after sync | Subagent must delete it |
| Stale guide after shell update | Sync updates both shell and guide together |
| Generic purple-gradient "AI slop" UI | Follow synced shell; apply frontend-design within its system |
| Diagram fiction | Build diagrams from analyzer notes only; delete unverified edges |
| Markdown report instead of HTML | Deliverable must be `.html` |
| Multiple files | Merge everything into one file |
| Diagram without explanation | Add 2–4 sentences of prose explaining what the diagram shows and why |
| Section with only bullets/cards | Add a `.section-prose` paragraph giving context and rationale |
| TOC jumps wrong section | Mermaid id collides with `section id` — use `sg_` / `n_` prefixes |
| Messy mermaid lines | Split into 2–4 diagrams by concern; use `sequenceDiagram` for RPC; follow `html-report-guide.md` § Diagram layout; ELK frontmatter only as last resort |

## Example user prompts (trigger this skill)

- "探索这个仓库里数据是怎么从抓取到入库再到分析的"
- "画一下 CLI 启动后一次请求是怎么走的"
- "这些 agent 之间怎么协作？给我一份能点开看的说明"
- "我在 rc929 目录放了新的 template.html，帮我按新模板风格研究 XXX"
