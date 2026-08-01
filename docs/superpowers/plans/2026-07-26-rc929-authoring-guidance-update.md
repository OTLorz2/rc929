# rc929 Authoring Guidance Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update rc929 skill authoring guidance so agents title side prose Summary, author deliverables from scratch using the starter as reference only, avoid stacked overlapping edges, and label nodes with behavior + cite.

**Architecture:** Surgical docs/template edits inside `.claude/skills/rc929/` only. No audit script changes. No research method changes.

**Tech Stack:** Markdown skill docs, uncompressed draw.io XML template

**Spec:** `docs/superpowers/specs/2026-07-26-rc929-authoring-guidance-update-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `.claude/skills/rc929/SKILL.md` | Agent workflow entrypoint |
| `references/drawio-content-guide.md` | In-diagram prose + path/filename rules |
| `references/drawio-layout-guide.md` | Connector routing |
| `references/drawio-editing-rules.md` | XML edit workflow |
| `templates/research-starter.drawio` | Visual/structure reference placeholders |

---

### Task 1: Update SKILL.md

**Files:**
- Modify: `.claude/skills/rc929/SKILL.md`

- [ ] **Step 1: Replace Feynman / cp language and add new rules**

Update frontmatter `description` and body so that:
- “Feynman note(s)” → “Summary” / “Summaries”
- Non-negotiable #2 and step 5 say: read starter as reference; **write new** deliverable; remove the `cp` bash block
- Synthesize section pairs Flow with **Summary**
- Checklist: authored from scratch; Summary; two-line behavior+cite labels
- Failure modes: file-only titles; stacked overlapping edges; cp into research dir; leftover Feynman title

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/rc929/SKILL.md
git commit -m "$(cat <<'EOF'
docs(rc929): retitle Summary and drop starter cp workflow

EOF
)"
```

---

### Task 2: Update content + editing guides

**Files:**
- Modify: `.claude/skills/rc929/references/drawio-content-guide.md`
- Modify: `.claude/skills/rc929/references/drawio-editing-rules.md`

- [ ] **Step 1: Content guide**

- Remove “Copy starter to output path”
- Document: read starter → write new file matching visual language
- Rename Feynman note → Summary in table and rules
- Add **Node labels** section: line 1 behavior, line 2 `path:line`; ban file/symbol-only sole labels

- [ ] **Step 2: Editing rules**

- Replace “Feynman Technique” with writing a **Summary** beside the diagram
- Keep “Inspect … research-starter” as reference language (already close)
- Add bullets: two-line node labels; no stacked overlapping edge segments (midpoint OK if waypoints diverge)

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/rc929/references/drawio-content-guide.md \
  .claude/skills/rc929/references/drawio-editing-rules.md
git commit -m "$(cat <<'EOF'
docs(rc929): align content and editing guides with Summary rules

EOF
)"
```

---

### Task 3: Update layout guide

**Files:**
- Modify: `.claude/skills/rc929/references/drawio-layout-guide.md`

- [ ] **Step 1: Extend Route connectors**

Add after existing routing bullets:
- Mid-side attach (~0.5) is OK when waypoints immediately separate tracks
- Do not leave multiple edges stacked on the same segment
- Prefer port stagger when clearer than shared midpoint + fan-out

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/rc929/references/drawio-layout-guide.md
git commit -m "$(cat <<'EOF'
docs(rc929): clarify connector midpoint vs stacked-edge policy

EOF
)"
```

---

### Task 4: Update research-starter.drawio

**Files:**
- Modify: `.claude/skills/rc929/templates/research-starter.drawio`

- [ ] **Step 1: Placeholder text**

- `fl_note` value: `<b>Summary</b>` + same guidance body (plain language + cites; ~8 nodes)
- Sample nodes demonstrate two-line labels, e.g.:
  - Process: `Load config, then start CLI<br><code>cmd/cli.go:42</code>` (escaped in XML)
  - Data: `Persist job row<br><code>store/jobs.go:88</code>`
  - External: `Call upstream API<br><code>client/api.go:15</code>`
- Slightly increase process/data node height if needed so two lines fit (~72–80)

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/rc929/templates/research-starter.drawio
git commit -m "$(cat <<'EOF'
feat(rc929): update starter Summary and two-line sample labels

EOF
)"
```

---

### Task 5: Verify

- [ ] **Step 1: Grep for leftovers**

```bash
rg -n 'Feynman note|Feynman Technique|cp .*research-starter' .claude/skills/rc929/
```

Expected: no matches in agent-facing workflow text (cell id `fl_note` may remain as an ID).

- [ ] **Step 2: Confirm audit untouched**

```bash
git diff HEAD -- .claude/skills/rc929/scripts/audit_drawio.py
```

Expected: empty

- [ ] **Step 3: Spot-check starter**

Confirm `Summary` appears in `fl_note` value and sample nodes contain `<br>` + `<code>`.
