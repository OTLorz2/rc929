# rc929 First-Principles Summary, Overview Readability, and Starter Visual Update

**Date:** 2026-07-26  
**Status:** Approved for implementation planning  
**Branch context:** `drawio`  
**Approach:** Full sync + exemplar refresh (Approach 3)

## Problem

Recent rc929 research deliverables are accurate but harder to learn from than they should be:

1. **Summaries** describe *what* happens and cite evidence, but often skip *why* a step or structure exists, so readers miss causal intent.
2. **Overview** mixes prose and inline `` `path:line` `` in the same sentences, and leads with metadata (`question`, `repo`, `date`, `branch`, `commit`) that adds noise before findings.
3. **Starter Flow** visual language is thinner than the quality bar set by strong research diagrams (nested host/guest boundaries, fail-closed gutter, distinct role colors). Agents under-use those patterns because the starter does not teach them.

## Goals

1. Every Flow **Summary** explains why major operations/structures exist, grounded in observed code behavior and evidence (causal “why,” not a fixed principle vocabulary).
2. **Overview** drops metadata fields and uses a two-line finding pattern: plain prose, then cite alone on the next line.
3. **`templates/research-starter.drawio`** teaches a rich Flow composition inspired by the uploaded Microsandbox architecture diagram: nested trust/guest boundaries, failure gutter, expanded role colors.
4. Agents **prefer** that rich composition; they may use the simple process/data/external set only when rich scaffolding would be mostly empty.
5. **Sync** the updated skill to `~/.agents/skills/rc929/` and **refresh** `thoughts/research/2026-07-26-research-dy-v0-auto-workflow.drawio` as the living exemplar.

## Non-goals

- Changing `scripts/audit_drawio.py` behavior or adding NLP heuristics for “why” / metadata detection
- Regenerating other research `.drawio` files under `thoughts/research/`
- Changing locator/analyzer research method, or the deliverable type (still one uncompressed `.drawio`; no research `.md` / `.html`)
- Requiring a fixed security-principle checklist (isolation, least privilege, etc.) in every Summary
- Requiring nested guest + failure gutter on every Flow page regardless of content

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Summary “First Principles” | Causal why-from-evidence (no fixed principle vocabulary) |
| Overview metadata | Remove `question` / `repo` / `date` / `branch` / `commit` entirely |
| Overview 要点 format | Prose sentence; cite alone on the next line |
| Starter learning from screenshot | Structure + role colors (nested boundaries, failure gutter, expanded legend) |
| Rich vs simple Flow | Prefer rich; allow simple when rich scaffolding would be empty |
| Implementation shape | Approach 3: skill update + `~/.agents` sync + dy-v0 exemplar refresh |
| Enforcement | Docs + starter + exemplar only (no audit-script changes) |
| Starter usage | Still reference-only; agents author new deliverables (no `cp` into research dir) |

## Content rules

### Overview

| Region | Required | Content |
|--------|----------|---------|
| Title | yes | Short report title |
| 要点 / Key findings | yes | Ordered findings; each item = prose line, then cite line |
| 待验证 | when needed | Uncertainties; omit empty placeholder bullets |
| Hint line | optional | Keep or delete; never replace with a diagram |
| Metadata block | **no** | Do not include `question`, `repo`, `date`, `branch`, `commit` |

**要点 item shape**

```text
1. Plain-language finding with no inline path:line mixed into the sentence.
src/planner.ts:49-84
```

Rules:

1. Overview text must still be enough for a newcomer to grasp the answer’s shape before opening Flow pages.
2. Uncertain claims go under 待验证 and are not drawn as fact on Flow pages.
3. Intake no longer gathers Overview metadata. Chat handoff may still name the `.drawio` path and give a 2–3 sentence factual summary.

### Summary (Flow pages)

- Title remains **Summary** (≥2 sentences; include short `` `path:line` `` cites).
- For each major step or structure on the page, explain (1) what happens and (2) **why it exists / why it is done that way**, grounded in observed behavior and evidence.
- Do not require a fixed checklist of named principles. Causal explanation is enough.
- Longer why belongs in Summary; edge labels stay short.

### Node labels (unchanged)

1. Line 1: short natural-language workflow behavior  
2. Line 2: `` `path:line` `` or `` `path:start-end` ``  

Bare file/symbol-only titles remain forbidden.

## Starter visual language

Inspired by the uploaded “Real Microsandbox” architecture diagram. The Flow page of `templates/research-starter.drawio` becomes a **rich sample composition** agents inspect, then match when authoring.

### Boundaries

- Outer **host / trusted control** region for orchestration, promote, freeze, verify.
- Inner dashed **guest / isolate** region when execution is sandboxed or otherwise isolated.
- **Failure gutter** (bottom or side) with a fail-closed sample; dashed warm/red edge from boundary/provider errors.

### Role colors

| Role | Color family |
|------|----------------|
| Planner / control process | cool blue |
| Executor / scheduler | warm amber |
| Provider / sandbox boundary | violet |
| Guest / isolated execute | red / rose |
| Staging / copy-out | yellow |
| Data / freeze store | green cylinder |
| Verify | green process |
| Failure shutdown | pink / coral |
| External API | warm external (outside or at edge) |

Legend text on the starter must list these roles. Guides document when to use each.

### Prefer-rich / allow-simple

- **Default:** use the rich composition (nested boundaries + failure gutter + role colors as applicable).
- **Allowed fallback:** simple process / data / external set when the page would otherwise be mostly unused nested/failure scaffolding (e.g. pure package topology with no isolate or fail-closed path).

### Overview starter

- Remove `ov_meta`.
- Enlarge 要点 with at least one sample finding using the prose + next-line cite pattern.
- Keep 待验证 + optional hint.

## Sync and exemplar

### Sync

After updating `.claude/skills/rc929/`, mirror the skill tree to `~/.agents/skills/rc929/` so both copies match for this change set (`SKILL.md`, `references/`, `templates/`, `scripts/`).

### Exemplar refresh

File: `thoughts/research/2026-07-26-research-dy-v0-auto-workflow.drawio`

- Preserve the same research scope and factual claims; re-verify cites against the dy-v0 codebase as needed; invent no edges.
- Overview: remove metadata; rewrite 要点 to prose + next-line cite.
- Flow pages (`Lifecycle`, `Fresh plan`, `Build execution`, `Verify & recovery`): apply prefer-rich layout where isolation/fail-closed exists (especially Build execution → nested microVM + failure gutter); rewrite each Summary with causal why; keep ~8 content nodes (max 10); run `audit_drawio.py`.

## Authoring workflow (target deltas)

Relative to the current rc929 skill:

1. Intake confirms the research question for the agent’s work, but **does not** populate Overview metadata fields.
2. Synthesize Overview with the two-line 要点 pattern; synthesize each Summary with causal why.
3. Read the updated starter as the visual reference; prefer rich Flow composition; author a new deliverable (still no `cp` into the research directory).
4. Audit and hand off as today.

## Per-file change plan

| Path | Changes |
|------|---------|
| `.claude/skills/rc929/SKILL.md` | Intake/Overview/Summary/checklist/failure modes; remove metadata gathering; prefer-rich rule |
| `references/drawio-content-guide.md` | Overview regions; 要点 2-line pattern; Summary why rule; role-color pointer |
| `references/drawio-layout-guide.md` | Nested boundaries, failure gutter, prefer-rich / allow-simple |
| `references/drawio-editing-rules.md` | Brief pointers to new Overview/Summary/starter patterns |
| `templates/research-starter.drawio` | Drop Overview metadata; sample 2-line 要点; rich Flow sample + legend |
| `~/.agents/skills/rc929/` | Full mirror of updated skill package |
| `thoughts/research/2026-07-26-research-dy-v0-auto-workflow.drawio` | Exemplar refresh per above |

**Unchanged:** `references/codebase-locator.md`, `references/codebase-analyzer.md`, `scripts/audit_drawio.py`.

## Quality checklist additions (skill)

- [ ] Overview has no question/repo/date/branch/commit block
- [ ] Each 要点 item is prose then next-line cite (no inline cite mixed into the sentence)
- [ ] Each Flow Summary includes causal why for major steps/structures, with evidence cites
- [ ] Flow pages prefer rich starter vocabulary; simple layout only when rich scaffolding would be empty
- [ ] `~/.agents/skills/rc929` matches `.claude/skills/rc929` after sync
- [ ] dy-v0 exemplar refreshed and audited

## Failure modes to document

| Failure | Fix |
|---------|-----|
| Overview still leads with metadata | Delete metadata region; start with title + 要点 |
| Cite jammed into finding prose | Split: sentence, then cite on its own line |
| Summary only narrates what, not why | Add causal why grounded in observed behavior + cite |
| Every page forced into empty nested/failure chrome | Use allow-simple when scaffolding would be empty |
| Starter `cp` into research dir | Inspect starter; author new deliverable |
| Agents copy and `~/.agents` diverge | Sync full skill tree after edits |

## Validation

1. `audit_drawio.py` on updated starter and refreshed exemplar (structural errors blockers; resolve overlap/routing warnings unless deliberately accepted).
2. Preview exemplar in draw.io or Obsidian Draw.io when available.
3. Spot-check that `~/.agents/skills/rc929` file contents match the repo skill copy for edited paths.
