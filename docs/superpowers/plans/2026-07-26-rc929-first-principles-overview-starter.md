# rc929 Causal Summary, Overview Readability, and Starter Visual Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update rc929 so Summaries explain causal why, Overview uses prose-then-cite without metadata, the starter teaches rich host/guest/failure vocabulary, sync `~/.agents/skills/rc929`, and refresh the dy-v0 research exemplar.

**Architecture:** Docs + starter template edits in `.claude/skills/rc929/`, mirror to `~/.agents/skills/rc929/`, then rewrite Overview/Summaries/Build layout on the existing dy-v0 research `.drawio`. No audit-script changes. Starter remains reference-only (no `cp` into research dir).

**Tech Stack:** Markdown skill docs, uncompressed draw.io XML, `audit_drawio.py`

**Spec:** `docs/superpowers/specs/2026-07-26-rc929-first-principles-overview-starter-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `.claude/skills/rc929/SKILL.md` | Agent workflow entrypoint |
| `references/drawio-content-guide.md` | Overview / Summary / 要点 / node label rules |
| `references/drawio-layout-guide.md` | Nested boundaries, failure gutter, prefer-rich |
| `references/drawio-editing-rules.md` | XML edit pointers for new patterns |
| `templates/research-starter.drawio` | Visual reference (Overview + rich Flow sample) |
| `~/.agents/skills/rc929/` | Mirrored skill package |
| `thoughts/research/2026-07-26-research-dy-v0-auto-workflow.drawio` | Living exemplar |

---

### Task 1: Update SKILL.md

**Files:**
- Modify: `.claude/skills/rc929/SKILL.md`

- [ ] **Step 1: Apply content-rule deltas**

Edit these sections:

1. **Intake** — Keep “confirm the research question” for the agent’s work. **Remove** “Gather metadata for the Overview page” (`question`, `repo`, `date`, `branch`, `commit`).
2. **Synthesize / Overview** — Overview = title + 要点 + 待验证; no metadata. Each 要点 item = plain prose sentence, then cite alone on the next line. No inline `` `path:line` `` mixed into the finding sentence.
3. **Summary** — Require causal why: for each major step/structure, explain what happens and why it exists / why done that way, grounded in observed behavior + evidence. Explicitly: no fixed principle vocabulary checklist.
4. **Authoring / Flow** — Prefer rich starter composition (nested host/guest, failure gutter, role colors). Allow simple process/data/external only when rich scaffolding would be mostly empty.
5. **Quality checklist** — Add:
   - Overview has no question/repo/date/branch/commit block
   - Each 要点 is prose then next-line cite
   - Each Flow Summary includes causal why for major steps/structures
   - Prefer rich Flow vocabulary; simple only when rich scaffolding would be empty
6. **Failure modes** — Add rows from the spec (metadata on Overview; cite jammed into prose; Summary what-not-why; forced empty nested chrome; agents/`~/.agents` diverge).
7. **Handoff** — Unchanged shape (path, page to open, 2–3 sentence summary, 待验证, audit note). Do not require Overview metadata in handoff.

Remove checklist items that require “Research question stated on Overview” / “Overview has question, metadata”.

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/rc929/SKILL.md
git commit -m "$(cat <<'EOF'
docs(rc929): drop Overview metadata; require causal Summary why

EOF
)"
```

---

### Task 2: Update content + editing guides

**Files:**
- Modify: `.claude/skills/rc929/references/drawio-content-guide.md`
- Modify: `.claude/skills/rc929/references/drawio-editing-rules.md`

- [ ] **Step 1: Rewrite Overview section in content guide**

Replace the Overview table so Metadata is **not** required (or remove the row). Document:

| Region | Required | Content |
|--------|----------|---------|
| Title | yes | Short report title |
| 要点 | yes | Each item: prose line, then cite line |
| 待验证 | when needed | Uncertainties |
| Hint | optional | Keep or delete |

Add the 要点 shape example:

```text
1. Plain-language finding with no inline path:line in the sentence.
src/planner.ts:49-84
```

Delete rule “Metadata fields may stay empty only when truly unavailable”.

- [ ] **Step 2: Update Summary rules in content guide**

Change Summary content to require: plain-language what + **causal why** for major steps/structures, grounded in observed behavior and evidence; include short cites. State explicitly: do not require a fixed named-principle checklist.

Add a short pointer to role colors / nested boundaries living in the layout guide + starter.

- [ ] **Step 3: Update editing rules**

Add bullets:

- Overview: no metadata block; 要点 = prose then next-line cite
- Summary: include causal why for major steps/structures (evidence-backed)
- Prefer rich starter vocabulary (nested host/guest, failure gutter, role colors); allow simple when rich scaffolding would be empty

Keep existing Summary title, two-line labels, stacked-edge, and reference-only starter rules.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/rc929/references/drawio-content-guide.md \
  .claude/skills/rc929/references/drawio-editing-rules.md
git commit -m "$(cat <<'EOF'
docs(rc929): Overview prose+cite pattern and causal Summary rules

EOF
)"
```

---

### Task 3: Update layout guide

**Files:**
- Modify: `.claude/skills/rc929/references/drawio-layout-guide.md`

- [ ] **Step 1: Add boundaries / failure gutter / prefer-rich**

After “Choose the diagram shape” (or in “Reuse an existing page's visual language”), add a section **Rich Flow vocabulary (prefer)**:

- Outer host / trusted control boundary for orchestration, promote, freeze, verify
- Inner dashed guest / isolate boundary when execution is sandboxed
- Failure gutter (bottom or side) with fail-closed node; dashed warm/red edge from boundary errors
- Role color families: planner blue, executor amber, provider violet, guest rose, staging yellow, data/freeze green cylinder, verify green, failure pink/coral, external warm
- **Prefer rich**; allow simple process/data/external only when nested/failure scaffolding would be mostly empty

Keep existing connector midpoint / stacked-edge rules.

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/rc929/references/drawio-layout-guide.md
git commit -m "$(cat <<'EOF'
docs(rc929): document nested boundaries and prefer-rich Flow layout

EOF
)"
```

---

### Task 4: Rewrite research-starter.drawio

**Files:**
- Modify: `.claude/skills/rc929/templates/research-starter.drawio`

- [ ] **Step 1: Snapshot**

```bash
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/templates/research-starter.drawio \
  --snapshot /tmp/rc929-starter-before.json
```

- [ ] **Step 2: Overview page**

- Delete cell `ov_meta` entirely
- Move `ov_summary` up (e.g. `y=80`, height ~320) with sample:

```html
<b>要点 / Key findings</b><br>
1. Plain finding sentence with no inline cite mixed in.<br>
<code>path/to/file.ext:12</code><br>
2. Second finding in plain language.<br>
<code>path/to/other.ext:34-40</code>
```

- Keep `ov_gaps` and `ov_hint`; adjust Y so they do not overlap

- [ ] **Step 3: Flow page — rich sample**

Replace the simple Internal-system sample with a rich composition that fits pageWidth 1600 / pageHeight 900, leaving room for Summary at bottom. Include at least:

| Cell id (suggested) | Role | Notes |
|---------------------|------|-------|
| `fl_host_label` | label | Host / trusted control |
| `fl_host` | outer boundary | dashed or light fill |
| `fl_planner` | planner blue | two-line behavior+cite |
| `fl_executor` | executor amber | two-line |
| `fl_provider` | provider violet | two-line |
| `fl_guest` | inner dashed guest boundary | inside host |
| `fl_guest_build` | guest rose | inside guest |
| `fl_external` | warm external | outside host or at edge |
| `fl_staging` | staging yellow | two-line |
| `fl_freeze` | green cylinder | two-line |
| `fl_verify` | verify green | two-line |
| `fl_fail` | failure pink | in failure gutter |
| edges | success path L→R; dashed red/warm to `fl_fail` from provider or guest | no stacked segments |
| `fl_note` | Summary | placeholder requiring what + causal why + cites |
| `fl_legend` | text | list role colors |

Keep content nodes ≤10 (boundaries/labels/legend/Summary excluded from count). Prefer ~8 content nodes if crowded — drop staging or freeze from the sample rather than overcrowding.

Suggested sample Summary text:

```html
<b>Summary</b><br>
Explain what happens on this page and why each major step or structure exists, grounded in observed behavior and evidence. Include short <code>path:line</code> cites. Prefer rich host/guest/failure vocabulary; use simple process/data/external only when rich scaffolding would be empty. ~8 content nodes; max 10.
```

- [ ] **Step 4: Audit**

```bash
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/templates/research-starter.drawio \
  --page Overview --baseline /tmp/rc929-starter-before.json
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/templates/research-starter.drawio \
  --page Flow
```

Expected: no structural errors; resolve overlap/routing warnings.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/rc929/templates/research-starter.drawio
git commit -m "$(cat <<'EOF'
feat(rc929): rich starter Flow vocabulary and Overview prose+cite sample

EOF
)"
```

---

### Task 5: Sync to ~/.agents/skills/rc929

**Files:**
- Sync: `~/.agents/skills/rc929/` from `.claude/skills/rc929/`

- [ ] **Step 1: Mirror**

```bash
rsync -a --delete \
  /Users/runyingchen/UIUC/003/rc929/.claude/skills/rc929/ \
  /Users/runyingchen/.agents/skills/rc929/
```

- [ ] **Step 2: Verify**

```bash
diff -rq \
  /Users/runyingchen/UIUC/003/rc929/.claude/skills/rc929 \
  /Users/runyingchen/.agents/skills/rc929
```

Expected: no differences.

Note: `~/.agents` is outside the git repo; no commit for this task. Record verification in the handoff.

---

### Task 6: Refresh dy-v0 exemplar Overview

**Files:**
- Modify: `thoughts/research/2026-07-26-research-dy-v0-auto-workflow.drawio` (Overview page only)

- [ ] **Step 1: Snapshot**

```bash
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  thoughts/research/2026-07-26-research-dy-v0-auto-workflow.drawio \
  --snapshot /tmp/rc929-dyv0-before.json
```

- [ ] **Step 2: Rewrite Overview**

- Delete `ov_meta`
- Rewrite `ov_summary` so each finding is prose, then cite on the next line (HTML `<br>` + `<code>…</code>`). Preserve factual claims; split multi-cite findings into one primary cite under the sentence (additional cites may appear as a second cite line or in Flow Summaries — do not jam cites into the prose sentence).
- Keep title and 待验证; adjust geometry after removing meta
- Re-verify any cite you touch against dy-v0 if uncertain; mark 待验证 rather than invent

- [ ] **Step 3: Audit Overview**

```bash
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  thoughts/research/2026-07-26-research-dy-v0-auto-workflow.drawio \
  --page Overview --baseline /tmp/rc929-dyv0-before.json
```

- [ ] **Step 4: Commit**

```bash
git add thoughts/research/2026-07-26-research-dy-v0-auto-workflow.drawio
git commit -m "$(cat <<'EOF'
docs(research): rewrite dy-v0 Overview to prose+cite without metadata

EOF
)"
```

---

### Task 7: Refresh dy-v0 Flow Summaries + Build execution layout

**Files:**
- Modify: `thoughts/research/2026-07-26-research-dy-v0-auto-workflow.drawio` (Lifecycle, Fresh plan, Build execution, Verify & recovery)

- [ ] **Step 1: Rewrite each Summary with causal why**

For `lc_note`, `fp_note`, `bd_note`, `vr_note`: keep evidence cites; ensure each major step/structure answers **why it exists / why done that way** from observed behavior (not a fixed principle checklist). Do not invent new edges or claims.

- [ ] **Step 2: Prefer-rich on Build execution**

On `Build execution`, align with starter vocabulary where the path already has isolation/fail-closed:

- Outer host control boundary
- Inner guest/microVM boundary around the OpenCode build node
- Failure gutter / fail-closed node if a failure path already exists or is evidenced; dashed warm/red edge
- Role colors for planner/executor/provider/guest/staging/verify as nodes already present map cleanly

Do not exceed ~10 content nodes. Other Flow pages: apply role colors / nested boundaries only where they already fit; allow simple if rich chrome would be empty.

- [ ] **Step 3: Audit all Flow pages**

```bash
for p in "Lifecycle" "Fresh plan" "Build execution" "Verify & recovery"; do
  python3 .claude/skills/rc929/scripts/audit_drawio.py \
    thoughts/research/2026-07-26-research-dy-v0-auto-workflow.drawio \
    --page "$p" || exit 1
done
```

Expected: no structural errors; resolve overlap/routing warnings.

- [ ] **Step 4: Commit**

```bash
git add thoughts/research/2026-07-26-research-dy-v0-auto-workflow.drawio
git commit -m "$(cat <<'EOF'
docs(research): causal Summaries and rich Build layout on dy-v0 exemplar

EOF
)"
```

---

### Task 8: Final verification

- [ ] **Step 1: Grep skill for leftover metadata instructions**

```bash
rg -n "ov_meta|Gather metadata|question: \(paste|Research question stated on Overview" \
  .claude/skills/rc929/
```

Expected: no hits that still require Overview metadata (sample cites in starter Overview are fine).

- [ ] **Step 2: Confirm agents sync still matches**

```bash
diff -rq \
  /Users/runyingchen/UIUC/003/rc929/.claude/skills/rc929 \
  /Users/runyingchen/.agents/skills/rc929
```

If exemplar-only commits happened after Task 5, re-run Task 5 rsync (skill tree should still match; exemplar is not under the skill dir).

- [ ] **Step 3: Handoff**

Report: commits made, starter + exemplar audit status, sync status, any 待验证 left on the exemplar.
