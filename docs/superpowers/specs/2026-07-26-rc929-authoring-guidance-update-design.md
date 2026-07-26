# rc929 Authoring Guidance Update Design

**Date:** 2026-07-26  
**Status:** Approved for implementation planning  
**Branch context:** `drawio`  
**Scope:** Surgical wording/guidance updates inside `.claude/skills/rc929/` (Approach 1)

## Problem

The rc929 skill’s authoring instructions produce diagrams that are harder to read than they need to be, and they over-prescribe a mechanical starter copy step:

1. Side prose is titled **“Feynman note”**, which is jargon and inconsistent with the desired plain label.
2. Agents are told to **`cp` `templates/research-starter.drawio` into the target research directory**, leaving a starter clone as the deliverable seed.
3. Layout guidance does not clearly allow mid-side attachment when routes diverge, so agents often pin every connector to the middle of a node edge and **stack overlapping segments**.
4. Node labels often dump **file/symbol names only**, instead of short natural-language workflow behavior plus evidence.

## Goals

1. Title every Flow-page side prose region **Summary** (never “Feynman note”).
2. Treat the bundled starter as an **internal visual/structure reference** only; agents **author** the output `.drawio` from scratch (no `cp`, no byte-seeding into the target directory).
3. Document connector policy: **midpoint attach is OK** when waypoints immediately separate tracks; **forbid stacked overlapping edge segments**.
4. Require node labels as **two lines**: short behavior phrase + `` `path:line` `` cite. Ban file/symbol-only titles as the sole label.
5. Enforce via skill text, guides, and starter placeholders only — **do not** change `audit_drawio.py`.

## Non-goals

- Changes to `scripts/audit_drawio.py` (no new warnings or errors for these rules)
- Syncing `thoughts/drawio-diagramming/` or `~/.agents/skills/rc929`
- Regenerating or rewriting existing research `.drawio` files under `thoughts/research/`
- Changing locator/analyzer research method, Overview+Flow page model, or deliverable type (still one uncompressed `.drawio`)
- Writing research `.md` / `.html` reports

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Side prose title | **Summary** |
| Starter usage | **Reference only** — inspect starter; write new deliverable matching its visual language |
| Connectors | Midpoint OK if routes diverge via waypoints; forbid stacked overlapping segments; stagger when clearer |
| Node labels | Line 1: short NL behavior; Line 2: `` `path:line` `` |
| Enforcement | Docs/skill/starter only |
| Implementation shape | Approach 1: surgical wording pass across existing files |

## Authoring workflow (target)

1. Create output path: `thoughts/research/<YYYY-MM-DD>-research-<kebab-topic>.drawio` (or user-specified path). Create parent dirs if needed.
2. **Read** `templates/research-starter.drawio` as the style/structure reference (Overview + Flow page shape, colors, process/data/external vocabulary).
3. **Write a new** uncompressed `.drawio` that matches that visual language. Do **not** shell-`cp` the starter into the target directory and do **not** seed the target file from starter bytes as a copy step.
4. Snapshot with `audit_drawio.py --snapshot`, fill Overview + Flow pages, re-audit, preview in draw.io / Obsidian Draw.io when available, hand off.

Research phases (intake → plan → locate → analyze → cross-check) and handoff shape remain unchanged.

## Content rules

### Summary (replaces Feynman note)

- Every Flow page includes a side region titled **Summary**.
- Content: ≥2 sentences of plain-language explanation of what the page shows and why; include short `` `path:line` `` cites.
- Longer explanation belongs in Summary; edge labels stay short.
- Remove “Feynman note” / “Feynman Technique” wording from skill description, workflow text, guides, checklist, and starter placeholder (`fl_note`).

### Node labels

- Required pattern on content nodes:
  - **Line 1:** short natural-language workflow behavior (verb phrase describing what happens in the flow).
  - **Line 2:** `` `path:line` `` or `` `path:start-end` ``.
- Forbidden as the sole label: bare symbols or bare file names (e.g. `Run()`, `cli.go`).
- Cites may also appear in Summary and Overview 要点; they do not replace the two-line node pattern.

### Connectors

- Prefer facing sides and shortest clear orthogonal paths (existing layout guide).
- Mid-side attach (~0.5) is acceptable when waypoints immediately fan routes onto separated tracks.
- Do not leave multiple edges stacked on the same segment.
- Prefer port stagger when that is clearer than shared midpoint + fan-out.
- Guidance only; audit script behavior unchanged.

## Per-file change plan

| File | Changes |
|------|---------|
| `.claude/skills/rc929/SKILL.md` | Description + intro: Summary; non-negotiable #2 and step 5: reference starter / author from scratch (remove `cp` block); synthesize, checklist, failure modes for Summary, two-line labels, stacked-edge guidance |
| `references/drawio-content-guide.md` | Remove “Copy starter to output”; document read-reference → write-new; rename Feynman → Summary; add node-label recipe |
| `references/drawio-layout-guide.md` | Route connectors: midpoint OK if routes diverge; forbid stacked overlapping segments; optional stagger |
| `references/drawio-editing-rules.md` | Replace Feynman Technique with Summary; inspect-reference language; brief two-line label + stacked-edge pointers |
| `templates/research-starter.drawio` | `fl_note` → Summary placeholder; sample process/data nodes demonstrate two-line behavior+cite |

**Unchanged:** `references/codebase-locator.md`, `references/codebase-analyzer.md`, `scripts/audit_drawio.py`.

## Quality checklist additions (skill)

- [ ] Deliverable authored from scratch (starter not copied into target dir)
- [ ] Each Flow page has **Summary** (not Feynman)
- [ ] Nodes use behavior + cite two-line labels

## Failure modes to document

| Failure | Fix |
|---------|-----|
| File/symbol-only node titles | Rewrite as behavior + cite (two lines) |
| Stacked overlapping edge segments | Diverge with waypoints or stagger ports |
| `cp` starter into research dir | Read starter as reference; write new deliverable |
| Side prose still titled Feynman note | Retitle to Summary |

## Verification (for implementation)

- Grep `.claude/skills/rc929/` for leftover “Feynman note” and `cp …research-starter` instructions (should be none in agent-facing workflow text).
- Spot-check starter XML shows Summary title and sample two-line node labels.
- Confirm `audit_drawio.py` is untouched.

## Out of scope follow-ups (not this change)

- Soft or hard audit checks for stacked edges or Summary title
- Mirroring guidance into `thoughts/drawio-diagramming/` or the home HTML-era rc929 skill
