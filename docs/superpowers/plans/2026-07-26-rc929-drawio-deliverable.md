# rc929 Draw.io Deliverable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the rc929 skill so research ends in one audited uncompressed `.drawio` file instead of an HTML report.

**Architecture:** Keep locator → analyzer research. Bundle `audit_drawio.py` and drawio guides from `thoughts/drawio-diagramming/` into `.claude/skills/rc929/`. Ship `templates/research-starter.drawio` (Overview + blank Flow). Delete the HTML/Markdown converter pipeline. Repurpose report prose rules into `drawio-content-guide.md` for in-diagram text only.

**Tech Stack:** Agent skill markdown, uncompressed draw.io XML, Python 3 (`audit_drawio.py`)

**Spec:** `docs/superpowers/specs/2026-07-26-rc929-drawio-deliverable-design.md`

---

## File map

| Path | Action |
|------|--------|
| `.claude/skills/rc929/scripts/audit_drawio.py` | Create (copy from thoughts) |
| `.claude/skills/rc929/scripts/md-to-html.mjs` | Delete |
| `.claude/skills/rc929/templates/research-starter.drawio` | Create |
| `.claude/skills/rc929/references/drawio-layout-guide.md` | Create (copy layout-guide) |
| `.claude/skills/rc929/references/drawio-editing-rules.md` | Create (from drawio SKILL rules) |
| `.claude/skills/rc929/references/drawio-content-guide.md` | Create (repurpose markdown-report-guide) |
| `.claude/skills/rc929/references/markdown-report-guide.md` | Delete after content guide exists |
| `.claude/skills/rc929/references/diagram-layout-guide.md` | Delete |
| `.claude/skills/rc929/references/html-shell-template.html` | Delete |
| `.claude/skills/rc929/references/html-report-guide.md` | Delete |
| `.claude/skills/rc929/references/template-sync-guide.md` | Delete |
| `.claude/skills/rc929/SKILL.md` | Rewrite |
| `README.md`, `README.zh-CN.md` | Rewrite for drawio deliverable |

---

### Task 1: Bundle audit script and drawio guides

**Files:**
- Create: `.claude/skills/rc929/scripts/audit_drawio.py`
- Create: `.claude/skills/rc929/references/drawio-layout-guide.md`
- Create: `.claude/skills/rc929/references/drawio-editing-rules.md`

- [ ] **Step 1: Copy audit script**

```bash
cp thoughts/drawio-diagramming/scripts/audit_drawio.py .claude/skills/rc929/scripts/audit_drawio.py
chmod +x .claude/skills/rc929/scripts/audit_drawio.py
```

- [ ] **Step 2: Copy layout guide**

```bash
cp thoughts/drawio-diagramming/references/layout-guide.md \
  .claude/skills/rc929/references/drawio-layout-guide.md
```

- [ ] **Step 3: Write editing rules from drawio SKILL.md**

Create `.claude/skills/rc929/references/drawio-editing-rules.md` containing the Editing rules + Validation expectations + Workflow steps 3–9 from `thoughts/drawio-diagramming/SKILL.md`, with script paths rewritten to `.claude/skills/rc929/scripts/audit_drawio.py`.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/references/drawio-layout-guide.md \
  .claude/skills/rc929/references/drawio-editing-rules.md
git commit -m "feat(rc929): bundle drawio audit script and guides"
```

---

### Task 2: Create research-starter.drawio and verify audit

**Files:**
- Create: `.claude/skills/rc929/templates/research-starter.drawio`

- [ ] **Step 1: Create templates directory and starter file**

Uncompressed two-page drawio:

1. Page name `Overview` — title text, metadata text, Summary note rectangle, 待验证 note rectangle (no overlaps; within page bounds).
2. Page name `Flow` — page title text, Feynman note rectangle (placeholder), light process-shape style samples left as non-overlapping placeholders OR empty canvas with only title + note region.

Use pageWidth=1600, pageHeight=900. Root cells `0` and `1` on each page. Namespace cell IDs: `ov_*` on Overview, `fl_*` on Flow.

- [ ] **Step 2: Audit starter**

```bash
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/templates/research-starter.drawio
```

Expected: exit 0, no structural errors. Warnings only if deliberate and documented.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/rc929/templates/research-starter.drawio
git commit -m "feat(rc929): add research-starter.drawio template"
```

---

### Task 3: Write drawio-content-guide and delete markdown-report-guide

**Files:**
- Create: `.claude/skills/rc929/references/drawio-content-guide.md`
- Delete: `.claude/skills/rc929/references/markdown-report-guide.md`

- [ ] **Step 1: Write content guide** covering:
  - Output filename/path for `.drawio` (not `.md`)
  - Overview required fields (question, date, repo/commit/branch, 要点, 待验证)
  - Flow page: Feynman note (≥2 sentences), `path:line` citation format, no invented edges
  - Explicit: do **not** write a research `.md` or `.html` to disk

- [ ] **Step 2: Delete** `references/markdown-report-guide.md`

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/rc929/references/drawio-content-guide.md
git add -u .claude/skills/rc929/references/markdown-report-guide.md
git commit -m "feat(rc929): replace markdown report guide with drawio content guide"
```

---

### Task 4: Rewrite SKILL.md

**Files:**
- Modify: `.claude/skills/rc929/SKILL.md`

- [ ] **Step 1: Rewrite** description + body per the design spec:
  - Deliverable: one `.drawio`
  - Reference table: locator, analyzer, drawio-layout-guide, drawio-editing-rules, drawio-content-guide, research-starter
  - Remove template.html sync section entirely
  - Workflow ends: copy starter → author pages → audit → handoff
  - Quality checklist + failure modes updated for drawio
  - Example prompts without HTML/template.html restyle

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/rc929/SKILL.md
git commit -m "feat(rc929): rewrite skill workflow for drawio deliverable"
```

---

### Task 5: Delete HTML pipeline assets

**Files:**
- Delete: `scripts/md-to-html.mjs`
- Delete: `references/html-shell-template.html`
- Delete: `references/html-report-guide.md`
- Delete: `references/template-sync-guide.md`
- Delete: `references/diagram-layout-guide.md`

- [ ] **Step 1: Delete the five files**

- [ ] **Step 2: Confirm skill tree**

```bash
find .claude/skills/rc929 -type f | sort
```

Expected only: SKILL.md, audit_drawio.py, research-starter.drawio, locator, analyzer, drawio-layout-guide, drawio-editing-rules, drawio-content-guide.

- [ ] **Step 3: Commit**

```bash
git add -u .claude/skills/rc929
git commit -m "chore(rc929): remove HTML report pipeline assets"
```

---

### Task 6: Update READMEs

**Files:**
- Modify: `README.md`
- Modify: `README.zh-CN.md`

- [ ] **Step 1: Update both READMEs** — `.drawio` deliverable, Python 3 requirement, new install tree, pipeline steps, remove template.html restyle section and Mermaid/HTML evidence panels; point Learn more links to new guides.

- [ ] **Step 2: Commit**

```bash
git add README.md README.zh-CN.md
git commit -m "docs: update READMEs for rc929 drawio deliverable"
```

---

### Task 7: Smoke verification

- [ ] **Step 1: Audit starter again** (must exit 0)

- [ ] **Step 2: Copy starter to a temp research path, fill minimal Overview text via a tiny edit if needed, audit both pages**

```bash
mkdir -p thoughts/research
cp .claude/skills/rc929/templates/research-starter.drawio \
  thoughts/research/2026-07-26-research-smoke-starter.drawio
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  thoughts/research/2026-07-26-research-smoke-starter.drawio
```

- [ ] **Step 3: Confirm no HTML converter remains**

```bash
test ! -f .claude/skills/rc929/scripts/md-to-html.mjs && echo OK
```

Smoke output under `thoughts/` is gitignored — do not commit it.

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| Bundle audit + layout + editing rules | 1 |
| Hybrid starter template | 2 |
| In-diagram content guide; no on-disk md | 3 |
| SKILL rewrite; no template sync | 4 |
| Delete HTML assets | 5 |
| README updates; Python not Node | 6 |
| Audit verification | 2, 7 |
