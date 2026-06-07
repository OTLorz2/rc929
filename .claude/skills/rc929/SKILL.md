---
name: rc929
description: Deep, accurate codebase exploration for user research questions, delivered as ONE self-contained HTML report with diagrams and interactive navigation. Writes structured Markdown first, then converts via scripts/md-to-html.mjs to save tokens. Use whenever the user asks to explore, map, trace, document, or research how code works in a repository (data flows, architecture, class dependencies, request lifecycles, module boundaries, agent/tool wiring)—even if they do not say "HTML" or "report". Also use when the user drops a new template.html into the rc929 skill folder to restyle reports. Accuracy of findings is mandatory; aesthetics support comprehension, never override facts.
---

# rc929 — Codebase Research → Markdown → HTML Report

Turn a research question into **one** accurate, well-explained, interactive HTML file. The agent writes **Markdown content** per `markdown-report-guide.md`; a bundled script injects it into the HTML shell. Diagrams provide structural overview; **prose provides understanding**. Every diagram and code reference must be accompanied by clear textual explanation of what it means and why it matters.

## Non-negotiables

1. **Accuracy first** — Every claim needs evidence (`path:line` or quoted symbol). If uncertain, mark `待验证` and do not draw it in diagrams as fact.
2. **Final deliverable: one `.html` file** — Self-contained (inline CSS/JS; CDN only for fonts/mermaid if needed). Write intermediate `.md` per `markdown-report-guide.md`, then convert via `scripts/md-to-html.mjs`. Keep the `.md` alongside the HTML for debugging.
3. **Document what IS** — No refactors, critiques, or "should" unless the user explicitly asked.
4. **Fresh research** — Read the live codebase; do not trust stale docs alone.

## When to read bundled references

| File | Read when |
|------|-----------|
| `references/template-sync-guide.md` | **First**, if `template.html` exists in this skill's root directory |
| `references/codebase-locator.md` | Before/during discovery — finding WHERE files live |
| `references/codebase-analyzer.md` | After locators — tracing HOW code works |
| `references/markdown-report-guide.md` | **At build** — write the `.md` report per this schema |
| `references/html-report-guide.md` | Optional — HTML output conventions (converter handles markup) |
| `references/diagram-layout-guide.md` | Before drawing diagrams — complexity limits, splitting, ELK |

**Do not** read or copy `references/html-shell-template.html` into context — the converter fills it.


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

Wait for the subagent to finish. Briefly note what changed (fonts, layout, toc style). Then proceed to §1 — read `markdown-report-guide.md` when building the report.

### 1. Intake

Confirm the research question. If the user named files/docs, **read them fully first** (no partial reads) before spawning sub-tasks.

Gather metadata for the report footer/header:
- Repository path/name, date (ISO), git branch/commit if available
- Original question verbatim

### 2. Plan

Decompose the question into 2–6 investigable areas (e.g., entry points, storage, external APIs, error paths). Use a todo list for multi-area research.

Choose diagram types **up front** (only where evidence supports them). For type selection, complexity limits, and splitting rules, read `references/diagram-layout-guide.md`.

### 3. Explore (locator → analyzer)

Mirror the proven two-phase pattern:

**Phase A — Locate (WHERE)**  
Act as **codebase-locator** (see `references/codebase-locator.md`): Grep/Glob for keywords, naming patterns, directories. Output grouped file lists with one-line roles. Do not deep-read implementation yet.

**Phase B — Analyze (HOW)**  
Act as **codebase-analyzer** (see `references/codebase-analyzer.md`): Read entry points, trace calls and data transformations, record `file:line` for each step. Parallelize independent areas (Task/subagents when available).

**Phase C — Cross-check**  
- Re-read critical paths you diagrammed; remove nodes/edges you cannot cite.
- Prefer primary source (source code) over README/architecture PNGs; if docs disagree with code, show **code truth** and note the doc mismatch briefly.

### 4. Synthesize for explained report

**Pair every diagram with substantive prose.** A diagram shows structure; text explains behavior, rationale, and context that diagrams cannot convey.

- **要点**: summary list with enough detail that a reader unfamiliar with the codebase can follow (format per `markdown-report-guide.md`)
- Executive visual: 2–4 **focused** diagrams answering the question (split by concern per `references/diagram-layout-guide.md`), each followed by 2–4 paragraphs explaining the flow in plain language
- Detail sections: for each topic area, write **explanatory paragraphs first** (what happens, why it's designed this way, what constraints apply), then support with diagrams/tables/code if helpful
- Evidence panels: `:::evidence{file=… lines=… lang=…}` blocks with code excerpts for readers who want to verify

Minimum text per section: each section must have prose paragraphs (≥2 sentences total) beyond bullets/diagrams. Sections with Mermaid need prose before the diagram and after the `Sources:` line (each ≥80 characters).

### 5a. Write Markdown

Follow `references/markdown-report-guide.md`. Write the research content as a single `.md` file:

- Filename: `<YYYY-MM-DD>-research-<kebab-topic>.md`
- Default path: `thoughts/research/` (create if needed; overridden by user-specified path)
- YAML frontmatter: `title`, `question`, `date` required; `repo`, `commit`, `branch`, `eyebrow`, `footer` optional
- Sections: `## Title {#slug}` with Mermaid fences, `Sources:` captions, evidence directives
- Mermaid subgraph/node ids: `sg_` / `n_` prefixes; never equal a section slug

### 5b. Convert Markdown to HTML

Run the bundled converter (do **not** hand-build HTML):

```
node .claude/skills/rc929/scripts/md-to-html.mjs thoughts/research/<YYYY-MM-DD>-research-<topic>.md
```

- Script reads `references/html-shell-template.html` and injects your markdown
- Output: same path with `.html` extension (use `-o` for custom HTML path)
- If script exits non-zero, fix markdown per error messages and re-run
- Do **not** read or copy `html-shell-template.html` into context

**Do not** split into multiple HTML pages or export PDF unless asked.

### 6. Handoff

Tell the user:
- Path to the **HTML** file (primary deliverable)
- Path to the source `.md` file (optional, for debugging)
- 2–3 sentence factual summary
- What to open first (which diagram/section)
- Any `待验证` items or open gaps
- If template sync ran: note shell was updated and `template.html` consumed

## Quality checklist (before delivery)

- [ ] Markdown written per `markdown-report-guide.md`
- [ ] Converter ran successfully (`md-to-html.mjs` exit 0)
- [ ] Final `.html` has no unreplaced `{{` placeholders
- [ ] Research question stated in header
- [ ] At least one mermaid diagram if the topic involves flow/structure/interaction
- [ ] Every diagram node/edge traceable to code (or labeled hypothetical)
- [ ] **Every section has prose with 2+ sentences of explanatory text**
- [ ] **Every diagram is followed by a prose paragraph explaining what it shows**
- [ ] No improvement recommendations unless requested
- [ ] Metadata block (date, commit, repo) present in frontmatter
- [ ] Open in browser mentally: mermaid syntax valid
- [ ] TOC labels match every `<h2>` exactly
- [ ] Section ids unique; Mermaid ids prefixed `sg_`/`n_`; TOC anchors land on sections
- [ ] Diagram layout rules followed (see `references/diagram-layout-guide.md` § Checklist)
- [ ] Evidence blocks use `:::evidence` with correct `lang` attribute

## Parallel agents (when available)

Spawn focused read-only tasks:

- **Template sync task** (only if `template.html` present): "Sync rc929 HTML shell from template.html per template-sync-guide.md; delete template when done."
- **Locator task**: "Find all files involved in [topic]; group by role; no implementation analysis."
- **Analyzer task**: "Trace [flow] from entry X; document steps with file:line; no critique."

Wait for template sync (if any) before research. Wait for all explore tasks before final synthesis. Main context writes markdown (§4–5a), runs converter (§5b), and hands off (§6).

## Common failure modes (avoid)

| Failure | Fix |
|---------|-----|
| Main agent syncs template itself | Spawn subagent; preserve main context for research |
| Template sample content leaks into report | Sync ignores content; build from live research only |
| Left template.html after sync | Subagent must delete it |
| Stale guide after shell update | Sync updates both shell and guide together |
| Generic purple-gradient "AI slop" UI | Follow synced shell; apply frontend-design within its system |
| Diagram fiction | Build diagrams from analyzer notes only; delete unverified edges |
| HTML not generated / script not run | Run `md-to-html.mjs`; md-only is not a complete deliverable |
| Agent copied shell manually instead of using script | Write `.md` + run converter |
| Multiple HTML files | Merge everything into one report |
| Diagram without explanation | Add 2–4 sentences of prose explaining what the diagram shows and why |
| Section with only bullets/cards | Add prose paragraphs giving context and rationale |
| TOC jumps wrong section | Mermaid id collides with `section id` — use `sg_` / `n_` prefixes |
| Messy mermaid lines | Follow `references/diagram-layout-guide.md` — split by concern, use `sequenceDiagram` for RPC, ELK as last resort |

## Example user prompts (trigger this skill)

- "探索这个仓库里数据是怎么从抓取到入库再到分析的"
- "画一下 CLI 启动后一次请求是怎么走的"
- "这些 agent 之间怎么协作？给我一份能点开看的说明"
- "我在 rc929 目录放了新的 template.html，帮我按新模板风格研究 XXX"
