<p align="center">
  <strong>rc929</strong>
</p>

<p align="center">
  🇺🇸 <a href="README.md">English</a> | 🇨🇳 <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  A Cursor / Claude Code skill that turns codebase research questions into <strong>one</strong> accurate, visual, self-contained HTML report — diagrams first, evidence attached.
</p>

Ask your AI assistant to explore how code works — data flows, architecture, request lifecycles, agent wiring — and rc929 delivers a single file you open in any browser. No markdown dump, no folder of assets.

```
"Trace how a CLI request flows from entry to response in this repo."
/rc929 How do these agents collaborate? Give me something I can click through.
```

You get **one** file:

```
2026-05-24-research-<topic>.html   open in any browser — TOC, Mermaid diagrams, collapsible evidence
```

---

## What it does

rc929 is a **research workflow skill**, not a CLI tool. The agent reads the live codebase, locates relevant files, traces call paths with `file:line` citations, and synthesizes findings into an interactive HTML page.

| Principle | Meaning |
|-----------|---------|
| **Accuracy first** | Every claim needs evidence (`path:line` or quoted symbol). Uncertain items are marked **needs verification** and never drawn as fact in diagrams. |
| **One deliverable** | Exactly one self-contained `.html` (inline CSS/JS; CDN only for fonts/Mermaid if needed). |
| **Document what IS** | No refactors, critiques, or "should" unless you explicitly asked. |
| **Fresh research** | Reads source code directly — stale docs alone are not enough. |

Works in **Cursor**, **Claude Code**, and other assistants that load skills from `.claude/skills/`.

---

## Install

The skill lives at `.claude/skills/rc929/` in this repository. To use it in another project, copy that folder into your target repo's `.claude/skills/rc929/` (or install it to your user skills directory).

```
your-project/
└── .claude/
    └── skills/
        └── rc929/
            ├── SKILL.md
            └── references/
                ├── html-shell-template.html
                ├── html-report-guide.md
                ├── codebase-locator.md
                ├── codebase-analyzer.md
                └── template-sync-guide.md
```

Open your AI assistant in the project — ask a research question in natural language, or type `/rc929` followed by your question to invoke the skill explicitly.

---

## Usage

Two ways to invoke rc929:

### 1. Natural language

Describe what you want to understand — the skill triggers when you ask to explore, map, trace, or document how code works:

```
Explore how data moves from ingestion to storage to analysis in this repo.
Map the module boundaries between the API layer and the worker queue.
How does the auth middleware chain work on an incoming HTTP request?
```

You can also specify where to save the report (default: `thoughts/research/`):

```
Research the agent tool wiring and save the report as 2026-05-24-research-agents.html
```

### 2. Slash command

Type `/rc929` to invoke the skill explicitly. Append your research question as arguments:

```
/rc929 Trace how a CLI request flows from entry to response
/rc929 How do the delivery plugins load and interact with InsightStore?
```

Use this when you want a guaranteed skill invocation instead of relying on the model to pick it up from context.

### Example prompts

| Goal | Prompt |
|------|--------|
| Data pipeline | "How does data flow from crawl → ingest → analysis?" |
| Request lifecycle | "Draw the path after CLI startup for one request." |
| Multi-agent | "How do these agents coordinate? I want something clickable." |
| Restyle + research | "I dropped a new `template.html` in rc929 — restyle the shell and research X." |

---

## What's in the report

- **Hero diagrams** — 1–2 Mermaid charts answering your question (flowcharts, sequence diagrams, dependency graphs, state machines — chosen by question shape).
- **Summary** — short bullet list of key findings with inline `file:line` refs.
- **Evidence panels** — collapsible code snippets with syntax highlighting (`language-*` classes); paths link back to the repo.
- **Metadata** — repo name/path, date, git branch/commit when available, original question verbatim.
- **Gaps** — anything marked **needs verification** or left unexplored.

Diagram types are picked up front and only drawn where evidence supports them:

| Question shape | Diagram |
|----------------|---------|
| Pipelines, ETL, batch jobs | `flowchart` / `graph` |
| Module/package dependencies | `graph` |
| RPC, webhooks, agents | `sequenceDiagram` |
| State machines | `stateDiagram-v2` |
| Layered architecture | `flowchart` with subgraphs |

---

## How it works

```
Intake → Plan (2–6 areas) → Locate (WHERE) → Analyze (HOW) → Cross-check → Build HTML → Handoff
```

1. **Intake** — Confirm the question; read any files you named fully before exploring.
2. **Plan** — Split into investigable areas; choose diagram types.
3. **Locate** — Grep/Glob for keywords and naming patterns; group files by role (no deep reads yet).
4. **Analyze** — Read entry points; trace calls and data transforms; record `file:line` for each step.
5. **Cross-check** — Re-read critical paths; remove diagram nodes/edges without citations. Code wins over stale docs.
6. **Build** — Copy `references/html-shell-template.html`, fill `<main>` with findings, follow `references/html-report-guide.md`.
7. **Handoff** — Path to the HTML file, 2–3 sentence summary, where to start reading, any open gaps.

Parallel subagents may run for independent exploration areas. Template sync (see below) always runs in a subagent so the main context stays free for research.

---

## Customize report style

Drop a new `template.html` into `.claude/skills/rc929/` (alongside `SKILL.md`), then ask the assistant to research something. The skill detects the file, spawns a subagent to:

1. Extract UI structure, CSS, JS, and layout from your template (ignoring sample research content).
2. Update `references/html-shell-template.html` and `references/html-report-guide.md` to match.
3. Delete `template.html` from the skill root.

Sample HTML templates for inspiration live in [`templates/`](templates/) at the repo root.

---

## Repository layout

| Path | Purpose |
|------|---------|
| `.claude/skills/rc929/` | Skill definition, HTML shell, exploration guides |
| `templates/` | Example report templates you can adapt |
| `rc929-workspace/` | Skill development iterations and eval artifacts |
| `codebase-locator.md`, `codebase-analyzer.md` | Standalone copies of exploration reference docs |

Research output HTML files default to `thoughts/research/` in the project root. You can override this by specifying a path. They are **not** bundled inside the skill folder.

---

## Tips

**Prefer visual questions.** rc929 shines when the answer benefits from diagrams and navigation — architecture, flows, dependencies — not one-line lookups.

**Name entry points if you know them.** "Start from `main.go`" or "focus on the `Worker` class" speeds up analysis.

**Check unverified items.** The report explicitly flags claims that could not be fully verified in source.

**Don't expect refactors.** The skill documents current behavior. Ask separately if you want improvement suggestions.

---

## Learn more

- [SKILL.md](.claude/skills/rc929/SKILL.md) — full workflow, quality checklist, failure modes
- [html-report-guide.md](.claude/skills/rc929/references/html-report-guide.md) — page structure, Mermaid rules, UI conventions
- [template-sync-guide.md](.claude/skills/rc929/references/template-sync-guide.md) — how template restyling works
