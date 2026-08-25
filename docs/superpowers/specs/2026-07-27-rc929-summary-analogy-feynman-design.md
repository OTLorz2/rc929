# rc929 Summary Analogy + Feynman + First-Principle Design

**Date:** 2026-07-27  
**Status:** Approved for implementation planning  
**Branch context:** `drawio`  
**Approach:** Surgical wording only (Approach 1)

## Problem

Flow and Overview prose in rc929 deliverables explain structure and cite evidence, but they do not consistently teach. Readers get *what* happened without a memorable model, a Feynman-style walkthrough, and a short first-principles *why*. Prior guidance required causal why and forbade “Feynman note” titles, but did not prescribe a separated analogy + explanation shape.

## Goals

1. Every Flow **Summary** uses three unlabeled paragraphs: analogy → Feynman what/how (with cites) → First-Principle why.
2. Overview adds the same **Summary** block above existing numbered **要点** (要点 format unchanged).
3. Region title remains **Summary**; analogy / Feynman / First Principle are authoring techniques, not on-page subtitles.
4. Update `.claude/skills/rc929/` surgically and sync to `~/.agents/skills/rc929/`.

## Non-goals

- Adding a long recipe essay or multiple worked examples beyond starter placeholders
- Changing `scripts/audit_drawio.py` (no heuristics for paragraph count or analogy detection)
- Refreshing `thoughts/research/2026-07-26-research-dy-v0-auto-workflow.drawio` or other research deliverables
- Changing locator/analyzer method, node-label rules, connector policy, or deliverable type (still one uncompressed `.drawio`)
- Restoring the side-prose title “Feynman note”
- Requiring a fixed named-principle checklist (isolation, least privilege, etc.) in ¶3 — First Principle means causal necessity from observed behavior

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Summary structure | One triple per page (not per step) |
| Labels on page | None — no “Analogy” / “Explanation” / “First Principle” subtitles |
| Paragraph order | ¶1 analogy → ¶2 Feynman what/how + cites → ¶3 First-Principle why |
| Overview | Keep 要点; add Summary above 要点 |
| Implementation | Approach 1: surgical wording + starter placeholder text |
| Sync | `.claude/skills/rc929/` → `~/.agents/skills/rc929/` |
| Exemplar refresh | No |
| Audit script | Unchanged |
| Chat handoff | Still 2–3 factual sentences; not required to mirror the 3-paragraph Summary |

## Content rules

### Summary contract (Flow + Overview teaching block)

Region title: **Summary**.

Three unlabeled paragraphs, in order:

1. **Analogy** — one everyday metaphor mapped to this page’s core idea. No `path:line` cites in this paragraph.
2. **Explanation (Feynman)** — plain-language what/how, teachable to a newcomer; short `` `path:line` `` cites belong here.
3. **First Principle** — one short paragraph on why this behavior or structure must exist, grounded in observed code behavior (causal necessity). Not a named-principle vocabulary checklist.

Hard rules:

- Separate with paragraph breaks only (blank line / `<br><br>` in draw.io HTML labels)
- Document what IS — no refactor advice
- Longer teaching belongs in Summary; edge labels stay short

### Overview page

| Region | Required | Content |
|--------|----------|---------|
| Title | yes | Short report title |
| Summary | yes (new) | Same unlabeled 3-paragraph contract |
| 要点 / Key findings | yes | Numbered plain findings; cite alone on the next line |
| 待验证 | when needed | Uncertainties; not drawn as fact on Flow pages |
| Metadata (`question` / `repo` / `date` / `branch` / `commit`) | **no** | Still forbidden |

Rules:

- Summary teaches the answer’s shape; 要点 remain the scannable evidence list
- Do not fold analogy / Feynman / First-Principle prose into 要点 items
- Overview order: title → Summary → 要点 → 待验证 (optional)

### Flow pages

Unchanged except Summary body shape: diagram + **Summary** with the three unlabeled paragraphs. Prefer-rich / allow-simple, node two-line labels, and connector policy stay as today.

### Node labels (unchanged)

1. Line 1: short natural-language workflow behavior  
2. Line 2: `` `path:line` `` or `` `path:start-end` ``

## Per-file change plan

| File | Changes |
|------|--------|
| `.claude/skills/rc929/SKILL.md` | Synthesize, Overview, Summary, checklist, failure modes → 3-paragraph contract; Overview gains Summary above 要点 |
| `references/drawio-content-guide.md` | Overview table + Summary section rewritten to § Content rules |
| `references/drawio-editing-rules.md` | Align short Summary bullet with new contract |
| `templates/research-starter.drawio` | Overview: add Summary placeholder cell above 要点; Flow `fl_note`: three unlabeled sample paragraphs |
| `~/.agents/skills/rc929/` | Full tree sync after `.claude` edits |

**Unchanged:** `references/codebase-locator.md`, `references/codebase-analyzer.md`, `references/drawio-layout-guide.md`, `scripts/audit_drawio.py`.

## Quality checklist additions (skill)

- [ ] Overview has Summary (3 unlabeled paragraphs) above 要点
- [ ] Each Flow Summary has analogy → Feynman what/how (+ cites) → First-Principle why, with no technique subtitles

## Failure modes to document

| Failure | Fix |
|---------|-----|
| Side prose titled Feynman note | Retitle to Summary |
| Summary missing analogy paragraph | Add unlabeled ¶1 metaphor |
| Summary only narrates what, skips First-Principle why | Add unlabeled ¶3 causal necessity |
| Technique names used as on-page subtitles | Remove labels; keep paragraph order only |
| Analogy/why folded into Overview 要点 | Move teaching to Overview Summary; keep 要点 as finding + cite |

## Relationship to prior specs

- Supersedes the Summary body guidance in `2026-07-26-rc929-first-principles-overview-starter-design.md` (causal why without prescribed analogy/Feynman separation).
- Preserves that spec’s Overview metadata ban, 要点 prose+cite shape, prefer-rich starter vocabulary, and “no audit NLP” stance.
- Preserves `2026-07-26-rc929-authoring-guidance-update-design.md` decision that the region title is **Summary**, not “Feynman note.”

## Success criteria

1. Skill + guides state the unlabeled 3-paragraph Summary contract for Flow and Overview.
2. Starter Overview shows Summary above 要点; Flow Summary placeholder shows three unlabeled paragraphs.
3. `~/.agents/skills/rc929/` matches `.claude/skills/rc929/` after sync.
4. No changes to `audit_drawio.py` or research exemplar redraws in this work.
