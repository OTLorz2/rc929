---
name: rc929
description: Deep, accurate codebase exploration for user research questions, delivered as ONE uncompressed .drawio file (Overview + focused flow pages with Summaries and path:line evidence). Use whenever the user asks to explore, map, trace, document, or research how code works in a repository (data flows, architecture, class dependencies, request lifecycles, module boundaries, agent/tool wiring)—even if they do not say "drawio" or "diagram". Accuracy of findings is mandatory; layout supports comprehension, never overrides facts.
---

# rc929 — Codebase Research → Draw.io Report

Turn a research question into **one** accurate, editable `.drawio` file. The agent researches the live codebase, reads the bundled starter as a visual/structure reference, **authors** a new Overview + Flow pages deliverable, and validates with `scripts/audit_drawio.py`. Diagrams provide structural overview; **prose on the page provides understanding** (Summaries). Every diagram node/edge needs clear textual explanation of what it means and why it matters.

## Non-negotiables

1. **Accuracy first** — Every claim needs evidence (`path:line` or quoted symbol). If uncertain, mark `待验证` on Overview and do not draw it in diagrams as fact.
2. **Final deliverable: one `.drawio` file** — Uncompressed `mxGraphModel` XML. Read `templates/research-starter.drawio` as an internal reference, author a new file matching its visual language, audit, hand off. Do **not** `cp` or byte-seed the starter into the target directory. Do **not** write a research `.md` or `.html` to disk.
3. **Document what IS** — No refactors, critiques, or "should" unless the user explicitly asked.
4. **Fresh research** — Read the live codebase; do not trust stale docs alone.

## When to read bundled references

| File | Read when |
|------|-----------|
| `references/codebase-locator.md` | Before/during discovery — finding WHERE files live |
| `references/codebase-analyzer.md` | After locators — tracing HOW code works |
| `references/drawio-content-guide.md` | At authoring — Overview / Summary / citation text inside pages |
| `references/drawio-layout-guide.md` | Before drawing or rearranging a Flow page |
| `references/drawio-editing-rules.md` | While editing XML — IDs, escaping, audit, validation |
| `templates/research-starter.drawio` | Internal visual/structure reference only — do not copy into the output path |

## Research workflow

### 1. Intake

Confirm the research question. If the user named files/docs, **read them fully first** (no partial reads) before spawning sub-tasks.

Do **not** put `question`, `repo`, `date`, `branch`, or `commit` on the Overview page. Keep those only if needed for your own notes; Overview starts with title + Summary + 要点.

### 2. Plan

Decompose the question into 2–6 investigable areas (e.g., entry points, storage, external APIs, error paths). Use a todo list for multi-area research.

Choose which concerns become separate Flow pages **up front** (only where evidence will support them). Prefer splitting over overcrowding — see `drawio-layout-guide.md`.

### 3. Explore (locator → analyzer)

**Phase A — Locate (WHERE)**  
Act as **codebase-locator** (see `references/codebase-locator.md`): Grep/Glob for keywords, naming patterns, directories. Output grouped file lists with one-line roles. Do not deep-read implementation yet.

**Phase B — Analyze (HOW)**  
Act as **codebase-analyzer** (see `references/codebase-analyzer.md`): Read entry points, trace calls and data transformations, record `file:line` for each step. Parallelize independent areas (Task/subagents when available).

**Phase C — Cross-check**  
- Re-read critical paths you will diagram; remove nodes/edges you cannot cite.
- Prefer primary source (source code) over README/architecture PNGs; if docs disagree with code, show **code truth** and note the doc mismatch briefly in the Summary or 待验证.

### 4. Synthesize for the drawio report

**Pair every Flow diagram with a Summary** on the same page. The diagram shows structure; the Summary teaches via analogy, plain explanation, and first-principles why.

- **Overview**: title + Summary + 要点 + 待验证 if any — **no** metadata block (`drawio-content-guide.md`). Summary uses the same three unlabeled paragraphs as Flow. Each 要点 item is a plain-language sentence, then the cite alone on the next line (do not mix `` `path:line` `` into the sentence). Do not fold analogy/why into 要点.
- **Flow pages**: one concern each; ~8 content nodes (max 10); each node labeled with short workflow behavior + `path:line` (two lines). Prefer the starter’s rich host/guest/failure vocabulary; use simple process/data/external only when rich scaffolding would be mostly empty.
- **Summary** (Overview teaching block and every Flow page): three unlabeled paragraphs, in order — (1) analogy (everyday metaphor; no cites), (2) Feynman what/how for a newcomer with short `` `path:line` `` cites, (3) First-Principle why (causal necessity from observed behavior; no named-principle checklist). No on-page subtitles for technique names.
- Do not invent relationships to make the picture prettier

### 5. Author the `.drawio` file

1. Choose the output path (create parent dirs if needed):

   ```text
   thoughts/research/<YYYY-MM-DD>-research-<kebab-topic>.drawio
   ```

   Use a user-specified path when provided.

2. **Read** `templates/research-starter.drawio` as the style/structure reference (Overview + rich Flow vocabulary: nested host/guest boundaries, failure gutter, role colors). **Write a new** uncompressed `.drawio` that matches that visual language. Do **not** shell-`cp` the starter into the target directory and do **not** seed the target from starter bytes as a copy step.

3. Snapshot before edits:

   ```bash
   python3 .claude/skills/rc929/scripts/audit_drawio.py FILE --snapshot /tmp/drawio-before.json
   ```

4. Fill **Overview** (title + Summary + 要点 + 待验证). For each planned area, add a **Flow** page and draw evidence-backed content. Follow `drawio-editing-rules.md` (XML escaping, cell ID namespaces, preserve non-target pages). Node labels: line 1 = short natural-language behavior; line 2 = `path:line`. Connectors: midpoint attach is fine when waypoints diverge; do not stack overlapping edge segments.

5. Re-audit after edits:

   ```bash
   python3 .claude/skills/rc929/scripts/audit_drawio.py FILE --page PAGE_NAME \
     --baseline /tmp/drawio-before.json
   ```

   Structural errors are blockers. Resolve overlap/routing warnings before delivery unless a deliberate, visually verified exception is called out in the handoff.

6. Preview in draw.io or Obsidian Draw.io when available. Do not claim visual QA from renderers that mishandle draw.io HTML labels.

**Do not** emit `.md` / `.html` research reports or Mermaid diagrams.

### 6. Handoff

Tell the user:
- Path to the **`.drawio`** file (primary deliverable)
- Which page to open first (usually Overview, then a named Flow page)
- 2–3 sentence factual summary
- Any `待验证` items or open gaps
- That validation ran (`audit_drawio.py`) and any preview limitation

## Quality checklist (before delivery)

- [ ] Deliverable authored from scratch (starter not copied into target dir); path matches `drawio-content-guide.md` (or user override)
- [ ] Overview has Summary (3 unlabeled paragraphs) above 要点 (+ 待验证 if needed); **no** question/repo/date/branch/commit block
- [ ] Each 要点 item is prose, then cite alone on the next line (no inline cite mixed into the sentence)
- [ ] Each Flow page: focused diagram + Summary + evidence cites
- [ ] Each Flow Summary has analogy → Feynman what/how (+ cites) → First-Principle why, with no technique subtitles
- [ ] Flow pages prefer rich starter vocabulary; simple layout only when rich scaffolding would be empty
- [ ] Nodes use two-line labels: short workflow behavior + `path:line` (not file/symbol-only titles)
- [ ] Every diagram node/edge traceable to code (or omitted / listed as 待验证)
- [ ] Uncompressed XML; attributes escaped; page-specific cell ID prefixes
- [ ] `audit_drawio.py` run; structural errors cleared; warnings addressed
- [ ] No research `.md` / `.html` produced as part of this skill

## Parallel agents (when available)

Spawn focused read-only tasks:

- **Locator task**: "Find all files involved in [topic]; group by role; no implementation analysis."
- **Analyzer task**: "Trace [flow] from entry X; document steps with file:line; no critique."

Wait for all explore tasks before authoring the `.drawio`. Main context writes the diagram and runs the audit.

## Common failure modes (avoid)

| Failure | Fix |
|---------|-----|
| Invented edges for a prettier diagram | Build only from analyzer notes; delete unverified edges |
| Shipping empty starter placeholders | Replace or delete sample process/data/external nodes |
| File/symbol-only node titles | Rewrite as behavior + cite (two lines) |
| Stacked overlapping edge segments | Diverge with waypoints or stagger ports |
| `cp` starter into research dir | Read starter as reference; write new deliverable |
| Side prose titled Feynman note | Retitle to Summary |
| Overview still leads with metadata | Delete metadata region; start with title + Summary + 要点 |
| Cite jammed into finding prose | Split: sentence, then cite on its own line |
| Summary missing analogy paragraph | Add unlabeled ¶1 metaphor |
| Summary only narrates what, skips First-Principle why | Add unlabeled ¶3 causal necessity |
| Technique names used as on-page subtitles | Remove labels; keep paragraph order only |
| Analogy/why folded into Overview 要点 | Move teaching to Overview Summary; keep 要点 as finding + cite |
| Every page forced into empty nested/failure chrome | Use allow-simple when scaffolding would be empty |
| Agents copy and `~/.agents` diverge | Sync full skill tree after edits |
| Compressed draw.io XML | Open/save uncompressed; keep `mxGraphModel` in the file |
| Skipping audit | Always run `audit_drawio.py` before handoff |
| Writing a markdown/HTML report | Deliverable is `.drawio` only; prose lives on pages |
| Overcrowded single Flow page | Split concerns; max ~10 content nodes per page |
| Edges through nodes / overlaps | Follow `drawio-layout-guide.md`; fix audit warnings |
| Claiming visual QA from wrong renderer | Preview in draw.io / Obsidian Draw.io |

## Example user prompts (trigger this skill)

- "探索这个仓库里数据是怎么从抓取到入库再到分析的"
- "画一下 CLI 启动后一次请求是怎么走的"
- "这些 agent 之间怎么协作？给我一份能打开看的说明"
- "Map the module boundaries between the API layer and the worker queue"
