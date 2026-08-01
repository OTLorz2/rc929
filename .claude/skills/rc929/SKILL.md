---
name: rc929
description: Deep, accurate codebase exploration for user research questions, delivered as ONE uncompressed .drawio file (Overview + glanceable conceptual Flow pages with Summaries, short evidence badges, and a same-page Impl map). Use whenever the user asks to explore, map, trace, document, or research how code works in a repository (data flows, architecture, class dependencies, request lifecycles, module boundaries, agent/tool wiring)—even if they do not say "drawio" or "diagram". Accuracy is mandatory; diagrams must be understandable at a glance, with evidence visually subordinate.
---

# rc929 — Codebase Research → Draw.io Report

Turn a research question into **one** accurate, editable `.drawio` file. The agent researches the live codebase, reads the bundled starter as a visual/structure reference, **authors** a new Overview + Flow pages deliverable, and validates with `scripts/audit_drawio.py`. Flow diagrams show a **conceptual main path**; prose Summaries teach; evidence lives in short badges + a same-page **Impl map**.

## Non-negotiables

1. **Accuracy first** — Every claim needs evidence (`path:line` or quoted symbol). If uncertain, mark `待验证` on Overview and do not draw it in diagrams as fact. Put cites in the Impl map (and Overview 要点 / Summary Feynman), not as full paths on conceptual node faces.
2. **Final deliverable: one `.drawio` file** — Uncompressed `mxGraphModel` XML. Read `templates/research-starter.drawio` as an internal reference, author a new file matching its visual language, audit, hand off. Do **not** `cp` or byte-seed the starter into the target directory. Do **not** write a research `.md` or `.html` to disk.
3. **Document what IS** — No refactors, critiques, or "should" unless the user explicitly asked.
4. **Fresh research** — Read the live codebase; do not trust stale docs alone.
5. **Glanceable conceptual Flows** — Primary success path identifiable in about three seconds. One abstraction level per diagram. Implementation metadata stays off conceptual node faces.

## When to read bundled references

| File | Read when |
|------|-----------|
| `references/codebase-locator.md` | Before/during discovery — finding WHERE files live |
| `references/codebase-analyzer.md` | After locators — tracing HOW code works |
| `references/drawio-content-guide.md` | At authoring — Overview / Summary / Impl map / citation text |
| `references/drawio-layout-guide.md` | Before drawing or rearranging a Flow page |
| `references/drawio-editing-rules.md` | While editing XML — IDs, escaping, audit, validation |
| `templates/research-starter.drawio` | Internal visual/structure reference only — do not copy into the output path |
| `evals/` | When verifying skill behavior against the three golden scenarios |

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

### 4. Diagram decisions (mandatory gate)

**Do not begin drawing until these five are clear** for each Flow page (write them in working notes / todos — not as Overview metadata):

1. What single question the diagram should answer
2. Who the intended reader is
3. What abstraction level is appropriate (default: **conceptual workflow**)
4. What the primary success path is (explicit Start → stages → Success)
5. Which details belong on the main diagram vs supporting material (Impl map, focused sub-page)

### 5. Synthesize for the drawio report

**Pair every Flow diagram with a Summary and an Impl map on the same page.** The diagram shows the conceptual main path; the Summary teaches; the Impl map holds `S# → path:line`.

- **Overview**: title + Summary + 要点 + 待验证 if any — **no** metadata block (`drawio-content-guide.md`). Summary uses the same three unlabeled paragraphs as Flow. Each 要点 item is a plain-language sentence, then the cite alone on the next line (do not mix `` `path:line` `` into the sentence). Do not fold analogy/why into 要点.
- **Flow pages**: one concern each. Conceptual diagram with main-path chrome; short verb labels (prefer 2–7 words) + muted evidence badge (`S1`, `V1`, `R1`); same-page **Impl map**; Summary. Prefer main-path vocabulary; use host/guest nesting only when the system truly has isolation/sandbox boundaries. Complexity budget (conceptual): ≤7 major process nodes, ≤3 major decisions, ≤2 terminal failures — split or phase-group when exceeded.
- **Summary** (Overview teaching block and every Flow page): three unlabeled paragraphs, in order — (1) analogy (everyday metaphor; no cites), (2) Feynman what/how for a newcomer with short `` `path:line` `` cites, (3) First-Principle why (causal necessity from observed behavior; no named-principle checklist). No on-page subtitles for technique names.
- Do not invent relationships to make the picture prettier
- Do not peer-mix business stages with function calls, loop mechanics, DB writes, validation rule lists, source locations, or fine-grained state fields on the conceptual diagram

### 6. Author the `.drawio` file

1. Choose the output path (create parent dirs if needed):

   ```text
   thoughts/research/<YYYY-MM-DD>-research-<kebab-topic>.drawio
   ```

   Use a user-specified path when provided.

2. **Read** `templates/research-starter.drawio` as the style/structure reference (Overview + main-path Flow vocabulary: Start/spine/Success, failure gutter, path-color semantics, Impl map, badges). **Write a new** uncompressed `.drawio` that matches that visual language. Do **not** shell-`cp` the starter into the target directory and do **not** seed the target from starter bytes as a copy step.

3. Snapshot before edits:

   ```bash
   python3 .claude/skills/rc929/scripts/audit_drawio.py FILE --snapshot /tmp/drawio-before.json
   ```

4. Fill **Overview** (title + Summary + 要点 + 待验证). For each planned area, add a **Flow** page: conceptual main-path diagram + Impl map + Summary. Follow `drawio-editing-rules.md` (XML escaping, cell ID namespaces, preserve non-target pages). Node labels: action verb phrase + muted `S#` badge — **never** full `path:line` on the conceptual face. Connectors: midpoint attach is fine when waypoints diverge; do not stack overlapping edge segments. Recursion: collapsed subprocess, bounded loop, or re-entry callout — not a long ordinary arrow back to Start. Decision edges: Valid / Invalid / Yes / No / Pass / Fail / More children / Complete — not Continue / Next / Return.

5. **Mandatory self-review** before audit/handoff:
   - Three-second test — start, main path, outcome
   - Path-tracing — success, one failure, one recursive/repeated path if present
   - Abstraction — peer nodes at one level
   - Label — short, action-oriented
   - Metadata — paths/lines only in Impl map (plus Overview 要点 / Summary Feynman)
   - Geometry — no avoidable crossings, long returns, or empty waste
   - Semantic-style — colors/shapes mean process / decision / success / failure / data

6. Re-audit after edits:

   ```bash
   python3 .claude/skills/rc929/scripts/audit_drawio.py FILE --page PAGE_NAME \
     --baseline /tmp/drawio-before.json
   ```

   Structural errors are blockers. Resolve overlap/routing warnings and path:line-in-node warnings before delivery unless a deliberate, visually verified exception is called out in the handoff.

7. Preview in draw.io or Obsidian Draw.io when available. Do not claim visual QA from renderers that mishandle draw.io HTML labels.

**Do not** emit `.md` / `.html` research reports or Mermaid diagrams.

### 7. Handoff

Tell the user:
- Path to the **`.drawio`** file (primary deliverable)
- Which page to open first (usually Overview, then a named Flow page)
- 2–3 sentence factual summary
- Chosen abstraction level (brief) and that the Impl map is on the Flow page
- Any `待验证` items or open gaps
- That validation ran (`audit_drawio.py`) and any preview limitation

## Quality checklist (before delivery)

- [ ] Deliverable authored from scratch (starter not copied into target dir); path matches `drawio-content-guide.md` (or user override)
- [ ] Diagram decisions gate completed for each Flow page
- [ ] Overview has Summary (3 unlabeled paragraphs) above 要点 (+ 待验证 if needed); **no** question/repo/date/branch/commit block
- [ ] Each 要点 item is prose, then cite alone on the next line (no inline cite mixed into the sentence)
- [ ] Each Flow page: conceptual main-path diagram + Impl map + Summary
- [ ] Each Flow Summary has analogy → Feynman what/how (+ cites) → First-Principle why, with no technique subtitles
- [ ] Conceptual nodes: short verb labels + muted `S#` badges; **no** full `path:line` on node faces
- [ ] Main path has explicit Start and Success/Complete; failures secondary with named terminals
- [ ] Flow chrome is main-path / path-color by default; host/guest only when isolation is real
- [ ] Every diagram node/edge traceable to code via Impl map (or omitted / listed as 待验证)
- [ ] Self-review (7 tests) passed
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
| Skipped Diagram decisions gate | Write the five decisions; then draw |
| Full `path:line` on conceptual node face | Use `S1` badge; put cite in Impl map |
| No dominant main path / missing Start or Success | Rebuild spine; move failures to gutter |
| Recursion as long ordinary back-edge | Collapsed subprocess, bounded loop, or re-entry callout |
| Vague edge labels (Continue / Next / Return) | Use Valid / Invalid / Yes / No / Pass / Fail / … |
| Business stages peer with function calls / DB writes / loop internals | One abstraction level; move details to Impl map or a focused page |
| Role-actor colors without path meaning | Use process / decision / success / failure / data semantics |
| Invented edges for a prettier diagram | Build only from analyzer notes; delete unverified edges |
| Shipping empty starter placeholders | Replace or delete sample nodes |
| Bare file/symbol-only titles | Rewrite as short behavior + badge |
| Stacked overlapping edge segments | Diverge with waypoints or stagger ports |
| `cp` starter into research dir | Read starter as reference; write new deliverable |
| Side prose titled Feynman note | Retitle to Summary |
| Overview still leads with metadata | Delete metadata region; start with title + Summary + 要点 |
| Cite jammed into finding prose | Split: sentence, then cite on its own line |
| Summary missing analogy paragraph | Add unlabeled ¶1 metaphor |
| Summary only narrates what, skips First-Principle why | Add unlabeled ¶3 causal necessity |
| Technique names used as on-page subtitles | Remove labels; keep paragraph order only |
| Analogy/why folded into Overview 要点 | Move teaching to Overview Summary; keep 要点 as finding + cite |
| Host/guest forced when isolation is not real | Use main-path chrome |
| Agents copy and `~/.agents` diverge | Sync full skill tree after edits |
| Compressed draw.io XML | Open/save uncompressed; keep `mxGraphModel` in the file |
| Skipping audit | Always run `audit_drawio.py` before handoff |
| Writing a markdown/HTML report | Deliverable is `.drawio` only; prose lives on pages |
| Overcrowded single Flow page | Split or phase-group; respect complexity budget |
| Edges through nodes / overlaps | Follow `drawio-layout-guide.md`; fix audit warnings |
| Claiming visual QA from wrong renderer | Preview in draw.io / Obsidian Draw.io |

## Example user prompts (trigger this skill)

- "探索这个仓库里数据是怎么从抓取到入库再到分析的"
- "画一下 CLI 启动后一次请求是怎么走的"
- "这些 agent 之间怎么协作？给我一份能打开看的说明"
- "Map the module boundaries between the API layer and the worker queue"
