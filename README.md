<p align="center">
  <strong>rc929</strong>
</p>

<p align="center">
  🇺🇸 <a href="README.md">English</a> | 🇨🇳 <a href="README.zh-CN.md">简体中文</a>
</p>

<p align="center">
  A Cursor / Claude Code skill that turns codebase research questions into <strong>one</strong> accurate, editable <strong>.drawio</strong> diagram — Overview first, focused flow pages with evidence attached.
</p>

Ask your AI assistant to explore how code works — data flows, architecture, request lifecycles, agent wiring — and rc929 delivers a single draw.io file you open in diagrams.net or Obsidian Draw.io.

```
"Trace how a CLI request flows from entry to response in this repo."
/rc929 How do these agents collaborate? Give me something I can open and edit.
```

You get **one** file:

```
2026-05-24-research-<topic>.drawio   open in draw.io — Overview + flow pages, Feynman notes, path:line cites
```

---

## What it does

rc929 is a **research workflow skill**, not a CLI tool. The agent reads the live codebase, locates relevant files, traces call paths with `file:line` citations, and synthesizes findings into an uncompressed `.drawio` file.

| Principle | Meaning |
|-----------|---------|
| **Accuracy first** | Every claim needs evidence (`path:line` or quoted symbol). Uncertain items are marked **待验证** and never drawn as fact in diagrams. |
| **One deliverable** | Exactly one uncompressed `.drawio`. Agent copies the starter template, authors pages, then audits with the bundled Python script. |
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
            ├── scripts/
            │   └── audit_drawio.py
            ├── templates/
            │   └── research-starter.drawio
            └── references/
                ├── drawio-content-guide.md
                ├── drawio-layout-guide.md
                ├── drawio-editing-rules.md
                ├── codebase-locator.md
                └── codebase-analyzer.md
```

Open your AI assistant in the project — ask a research question in natural language, or type `/rc929` followed by your question to invoke the skill explicitly.

**Requires Python 3** for `audit_drawio.py` (stdlib only; no `pip install` needed).

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
Research the agent tool wiring and save as 2026-05-24-research-agents.drawio
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
| Multi-agent | "How do these agents coordinate? I want an editable diagram." |

---

## What's in the diagram

- **Overview page** — question, metadata, 要点 findings with `file:line` refs, 待验证 gaps.
- **Flow pages** — one concern per page (~8 nodes, max 10), native draw.io shapes/edges, Feynman note beside the diagram.
- **Evidence** — short `path:line` citations on nodes and in notes (not separate HTML panels).
- **Validation** — `audit_drawio.py` checks structure, refs, bounds, overlap, and routing before handoff.

Page layout follows the bundled draw.io layout guide: left-to-right pipelines, sequence-style multiparty flows, gutters for error paths, split when a page would densify.

---

## How it works

```
Intake → Plan (2–6 areas) → Locate (WHERE) → Analyze (HOW) → Cross-check → Author .drawio → Audit → Handoff
```

1. **Intake** — Confirm the question; read any files you named fully before exploring.
2. **Plan** — Split into investigable areas; decide Flow page splits.
3. **Locate** — Grep/Glob for keywords and naming patterns; group files by role (no deep reads yet).
4. **Analyze** — Read entry points; trace calls and data transforms; record `file:line` for each step.
5. **Cross-check** — Re-read critical paths; remove diagram nodes/edges without citations. Code wins over stale docs.
6. **Author** — Copy `templates/research-starter.drawio`, fill Overview, duplicate Flow pages per concern.
7. **Audit** — Run `python3 .claude/skills/rc929/scripts/audit_drawio.py <path.drawio>` (with snapshot/baseline when editing).
8. **Handoff** — Path to the `.drawio` file, 2–3 sentence summary, which page to open first, any open gaps.

Parallel subagents may run for independent exploration areas. The main context authors the `.drawio` and runs the audit.

---

## Repository layout

| Path | Purpose |
|------|---------|
| `.claude/skills/rc929/` | Skill definition, starter diagram, exploration + drawio guides |
| `docs/superpowers/specs/` | Design specs |
| `docs/superpowers/plans/` | Implementation plans |

Research output `.drawio` files default to `thoughts/research/` in the project root. You can override this by specifying a path. They are **not** bundled inside the skill folder.

---

## Tips

**Prefer visual questions.** rc929 shines when the answer benefits from diagrams — architecture, flows, dependencies — not one-line lookups.

**Name entry points if you know them.** "Start from `main.go`" or "focus on the `Worker` class" speeds up analysis.

**Check 待验证 items.** The Overview page flags claims that could not be fully verified in source.

**Don't expect refactors.** The skill documents current behavior. Ask separately if you want improvement suggestions.

---

## Learn more

- [SKILL.md](.claude/skills/rc929/SKILL.md) — full workflow, quality checklist, failure modes
- [drawio-content-guide.md](.claude/skills/rc929/references/drawio-content-guide.md) — in-diagram Overview / Feynman / citation rules
- [drawio-layout-guide.md](.claude/skills/rc929/references/drawio-layout-guide.md) — page layout and connector routing
- [drawio-editing-rules.md](.claude/skills/rc929/references/drawio-editing-rules.md) — XML editing and audit expectations
