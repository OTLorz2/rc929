# rc929 Summary Analogy/Feynman/First-Principle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update rc929 so Overview and Flow Summaries use three unlabeled paragraphs (analogy → Feynman what/how + cites → First-Principle why), surgically edit skill docs + starter, and sync `~/.agents/skills/rc929/`.

**Architecture:** Wording-only changes in `.claude/skills/rc929/` (SKILL, content guide, editing rules, starter XML). Mirror the tree to `~/.agents/skills/rc929/`. No audit-script changes and no research exemplar refresh.

**Tech Stack:** Markdown skill docs, uncompressed draw.io XML, `rsync`/`cp` for agent skill sync

**Spec:** `docs/superpowers/specs/2026-07-27-rc929-summary-analogy-feynman-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `.claude/skills/rc929/SKILL.md` | Agent workflow entrypoint |
| `references/drawio-content-guide.md` | Overview / Summary / 要点 rules |
| `references/drawio-editing-rules.md` | Short Summary edit bullet |
| `templates/research-starter.drawio` | Overview Summary placeholder + Flow Summary sample |
| `~/.agents/skills/rc929/` | Mirrored skill package |

**Unchanged:** locator/analyzer/layout guides, `scripts/audit_drawio.py`, research `.drawio` exemplars

---

### Task 1: Update SKILL.md

**Files:**
- Modify: `.claude/skills/rc929/SKILL.md`

- [ ] **Step 1: Apply content-rule deltas**

Edit these sections:

1. **Intake** — Overview starts with title + **Summary** + 要点 (not title + 要点 only).
2. **Synthesize** — Replace Summary guidance with:
   - Overview: title + Summary (3 unlabeled paragraphs) + 要点 + 待验证; no metadata.
   - Summary contract: ¶1 analogy (no cites) → ¶2 Feynman what/how with short `path:line` cites → ¶3 First-Principle why (causal necessity from observed behavior; no named-principle checklist). No on-page subtitles for technique names.
   - Keep: do not invent relationships; prefer-rich Flow vocabulary unchanged.
3. **Authoring step 4** — Fill Overview (title + Summary + 要点 + 待验证).
4. **Quality checklist** — Replace/adjust:
   - Overview has Summary (3 unlabeled paragraphs) above 要点 (+ 待验证 if needed); no metadata block
   - Each 要点 item is prose, then cite alone on the next line
   - Each Flow Summary has analogy → Feynman what/how (+ cites) → First-Principle why, with no technique subtitles
   - Keep other checklist items (authored from scratch, prefer-rich, two-line nodes, audit, no md/html)
5. **Failure modes** — Keep “Side prose titled Feynman note → Retitle to Summary”. Replace “Summary only narrates what, not why” with rows from the spec:
   - Summary missing analogy paragraph → Add unlabeled ¶1 metaphor
   - Summary only narrates what, skips First-Principle why → Add unlabeled ¶3 causal necessity
   - Technique names used as on-page subtitles → Remove labels; keep paragraph order only
   - Analogy/why folded into Overview 要点 → Move teaching to Overview Summary; keep 要点 as finding + cite
6. **Handoff** — Unchanged (2–3 factual sentences; not required to mirror 3-paragraph Summary).

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/rc929/SKILL.md
git commit -m "$(cat <<'EOF'
docs(rc929): require unlabeled analogy/Feynman/why Summary

EOF
)"
```

---

### Task 2: Update content + editing guides

**Files:**
- Modify: `.claude/skills/rc929/references/drawio-content-guide.md`
- Modify: `.claude/skills/rc929/references/drawio-editing-rules.md`

- [ ] **Step 1: Rewrite Overview section in content guide**

Update Overview table to:

| Region | Required | Content |
|--------|----------|---------|
| Title | yes | Short report title (plain text) |
| Summary | yes | Three unlabeled paragraphs: analogy → Feynman what/how (+ cites) → First-Principle why |
| 要点 / Key findings | yes | Ordered findings; each item = prose line, then cite line |
| 待验证 | when needed | Uncertainties; remove the placeholder bullet if none |
| Hint line | optional | Keep or delete; never replace with a diagram |
| Metadata | **no** | Do not include this block |

Add rules:

- Overview order: title → Summary → 要点 → 待验证
- Summary teaches the answer’s shape; 要点 remain the scannable evidence list
- Do not fold analogy / Feynman / First-Principle prose into 要点 items

Keep the existing 要点 item shape example unchanged.

- [ ] **Step 2: Rewrite Summary section in content guide**

Replace `## Summary (causal why)` with `## Summary (analogy → Feynman → First Principle)`:

- Every Flow page and the Overview teaching block use a region titled **Summary**.
- Three unlabeled paragraphs, in order:
  1. Analogy — everyday metaphor for the page’s core idea; no `path:line` cites
  2. Explanation (Feynman) — plain-language what/how for a newcomer; short `` `path:line` `` cites here
  3. First Principle — short paragraph on why the behavior/structure must exist (causal necessity from observed code); not a named-principle checklist
- No on-page subtitles (`Analogy`, `Explanation`, `First Principle`, etc.)
- Separate with paragraph breaks only (`<br><br>` in draw.io HTML)
- Longer teaching belongs in Summary; edge labels stay short

Update the Flow pages table Summary row to match this contract (drop “≥2 sentences” / bare “causal why” wording).

- [ ] **Step 3: Update editing rules**

Replace the Overview/Summary bullets (lines ~30–31) with:

- Overview: no metadata block. Order: title → Summary (3 unlabeled paragraphs) → 要点 (prose then cite line) → 待验证 when needed.
- Write a **Summary** with three unlabeled paragraphs: analogy → Feynman what/how (short `path:line` cites) → First-Principle why (causal necessity from observed behavior; no named-principle checklist). Do not use technique names as on-page subtitles.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/rc929/references/drawio-content-guide.md \
        .claude/skills/rc929/references/drawio-editing-rules.md
git commit -m "$(cat <<'EOF'
docs(rc929): document 3-paragraph Summary on Overview and Flow

EOF
)"
```

---

### Task 3: Update research-starter.drawio

**Files:**
- Modify: `.claude/skills/rc929/templates/research-starter.drawio`

- [ ] **Step 1: Snapshot**

```bash
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/templates/research-starter.drawio \
  --snapshot /tmp/drawio-before-starter.json
```

- [ ] **Step 2: Overview — insert Summary cell above 要点**

Add cell `ov_teach` (or similar) titled **Summary** with three unlabeled sample paragraphs, placed between `ov_title` and `ov_summary` (要点). Shift `ov_summary`, `ov_gaps`, and `ov_hint` downward so regions do not overlap.

Suggested Overview Summary placeholder text (HTML-escaped in `value`):

```text
Summary
Like a kitchen pass: tickets are checked before anything hits the stove.
The host verifies the plan, then schedules work so the guest only runs after checks pass. path/to/file.ext:12
Unsafe work must not start until the control plane has a trusted plan.
```

Keep 要点 sample content as today’s numbered findings + cites.

Widen/heighten the Summary box as needed (~900×140). Example geometry after insert:

- `ov_teach`: y≈90, height≈140
- `ov_summary` (要点): y≈250, height≈280
- `ov_gaps`: y≈550
- `ov_hint`: y≈730

- [ ] **Step 3: Flow — replace `fl_note` body**

Keep title **Summary**. Replace body with three unlabeled paragraphs (same kitchen-pass sample, adapted to the Flow page). Increase `fl_note` height if needed so text fits (~200).

- [ ] **Step 4: Audit**

```bash
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/templates/research-starter.drawio \
  --page Overview --baseline /tmp/drawio-before-starter.json

python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/templates/research-starter.drawio \
  --page Flow --baseline /tmp/drawio-before-starter.json
```

Expected: no structural errors; resolve overlap warnings if any.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/rc929/templates/research-starter.drawio
git commit -m "$(cat <<'EOF'
feat(rc929): starter Overview Summary and 3-paragraph Flow sample

EOF
)"
```

---

### Task 4: Sync `~/.agents/skills/rc929/`

**Files:**
- Sync: entire `.claude/skills/rc929/` → `/Users/runyingchen/.agents/skills/rc929/`

- [ ] **Step 1: Mirror**

```bash
rsync -a --delete \
  /Users/runyingchen/UIUC/003/rc929/.claude/skills/rc929/ \
  /Users/runyingchen/.agents/skills/rc929/
```

- [ ] **Step 2: Verify key strings exist in both trees**

```bash
rg -n "First-Principle|unlabeled|Analogy" \
  .claude/skills/rc929/SKILL.md \
  ~/.agents/skills/rc929/SKILL.md \
  .claude/skills/rc929/references/drawio-content-guide.md \
  ~/.agents/skills/rc929/references/drawio-content-guide.md
```

Expected: matching guidance in both locations; starter Overview contains a Summary cell.

- [ ] **Step 3: Commit note**

`~/.agents` is outside the repo — no git commit for the sync. Confirm in the final handoff that sync completed.

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| 3 unlabeled paragraphs on Flow Summary | 1, 2, 3 |
| Overview Summary above 要点 | 1, 2, 3 |
| No technique subtitles | 1, 2, 3 |
| Surgical Approach 1 (no long recipe essay) | all tasks |
| Sync `~/.agents` | 4 |
| No audit NLP / no exemplar refresh | excluded |
| Failure modes + checklist | 1 |
| Region title remains Summary | 1, 2, 3 |
