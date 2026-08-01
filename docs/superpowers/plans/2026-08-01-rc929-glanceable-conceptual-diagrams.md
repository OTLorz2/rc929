# rc929 Glanceable Conceptual Diagrams Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update rc929 so Flow diagrams are glanceable conceptual workflows (main path first, subordinate `S#` evidence + Impl map), with package consistency, cheap audit enforcement, and three golden eval scenarios proving RED→GREEN→REFACTOR.

**Architecture:** Rewrite synthesize/author rules in the skill package; add a mandatory Diagram-decisions gate; replace prefer-rich role-color defaults with main-path + path-semantics chrome; add `evals/` golden packs; extend `audit_drawio.py` to warn on raw `path:line` inside content-node labels; sync `.claude/skills/rc929/` ↔ `~/.agents/skills/rc929/`.

**Tech Stack:** Markdown skill docs, uncompressed draw.io XML, Python 3 `audit_drawio.py`, pytest-style or `python3 -c` smoke tests for the new audit check

**Spec:** `docs/superpowers/specs/2026-08-01-rc929-glanceable-conceptual-diagrams-design.md`

---

## File map

| File | Responsibility |
|------|----------------|
| `.claude/skills/rc929/SKILL.md` | Workflow entrypoint, gate, checklist, failure modes |
| `references/drawio-content-guide.md` | Node labels, Impl map, citation placement |
| `references/drawio-layout-guide.md` | TB-first, main-path chrome, path colors |
| `references/drawio-editing-rules.md` | Edit-time node/chrome rules |
| `templates/research-starter.drawio` | Visual reference for new Flow chrome |
| `scripts/audit_drawio.py` | Warn on `path…:digits` in content-node labels |
| `evals/README.md` | How to run/score the three scenarios |
| `evals/01-linear/` | Brief, RED notes, GREEN checklist, golden `.drawio` |
| `evals/02-validation-failure/` | Same for branched validation |
| `evals/03-recursive-refs/` | Same for recursive + Impl map |
| `thoughts/research/2026-08-01-rc929-glanceable-skill-update-notes.md` | Behavioral summary, before/after, limitations (implementation deliverable from original prompt) |
| `~/.agents/skills/rc929/` | Mirror of the skill tree |

**Unchanged:** `references/codebase-locator.md`, `references/codebase-analyzer.md` (analyzer still records `path:line`; authoring puts them in Impl map)

---

### Task 1: RED — scenario briefs and failure notes

**Files:**
- Create: `.claude/skills/rc929/evals/README.md`
- Create: `.claude/skills/rc929/evals/01-linear/brief.md`
- Create: `.claude/skills/rc929/evals/01-linear/red-notes.md`
- Create: `.claude/skills/rc929/evals/01-linear/green-checklist.md`
- Create: `.claude/skills/rc929/evals/02-validation-failure/brief.md`
- Create: `.claude/skills/rc929/evals/02-validation-failure/red-notes.md`
- Create: `.claude/skills/rc929/evals/02-validation-failure/green-checklist.md`
- Create: `.claude/skills/rc929/evals/03-recursive-refs/brief.md`
- Create: `.claude/skills/rc929/evals/03-recursive-refs/red-notes.md`
- Create: `.claude/skills/rc929/evals/03-recursive-refs/green-checklist.md`

- [ ] **Step 1: Write eval README**

```markdown
# rc929 diagram-comprehension evals

Three fixed scenario packs. Score a skill revision only after all three GREEN checklists pass.

Each pack:
- `brief.md` — what to diagram
- `red-notes.md` — how the *pre-change* skill fails
- `green-checklist.md` — mandatory self-review + scenario-specific asserts
- `golden.drawio` — reference conceptual diagram under the revised skill

Do not claim success until RED notes are addressed by skill text + goldens pass checklists.
```

- [ ] **Step 2: Write scenario 01 (linear)**

`brief.md`: Diagram a 4-stage linear ingest: receive event → normalize → persist → acknowledge. Reader = onboarding engineer. Abstraction = conceptual workflow.

`red-notes.md` must record current-skill failures:
- Nodes forced to carry `path:line` on line 2
- No required Start/Success terminals
- LTR pipeline bias even when labels are long
- Role colors without path meaning

`green-checklist.md`: three-second, path-trace (success only), abstraction, label (2–7 words), metadata (no raw paths on nodes), geometry, semantic-style; plus: ≤7 process nodes; Start + Success present; LTR allowed.

- [ ] **Step 3: Write scenario 02 (validation + failure)**

`brief.md`: Propose → validate → (invalid: reject & end failed) / (valid: apply → success).

`red-notes.md`: failure mixed into main spine; vague edge labels; no named failure terminal; cites on nodes.

`green-checklist.md`: Valid/Invalid edge labels; named failure terminal in gutter; main path unblocked; ≤3 decisions; ≤2 failure terminals.

- [ ] **Step 4: Write scenario 03 (recursive + refs)**

`brief.md`: Use the spec’s recursive decomposition spine. Include fictional but stable source ranges in the Impl map only (e.g. `task_execution.py:175-180`).

`red-notes.md`: recursion as long back-edge; paths inside nodes; mixed abstraction; tangled return.

`green-checklist.md`: matches spec spine; recursion via collapsed/bounded pattern; Impl map has `S# → path:line`; no raw `path:` in conceptual node labels; Start + Success + Failed terminals.

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/rc929/evals
git commit -m "$(cat <<'EOF'
test(rc929): add RED eval briefs for glanceable diagrams

EOF
)"
```

---

### Task 2: GREEN — audit warns on path:line in content nodes

**Files:**
- Modify: `.claude/skills/rc929/scripts/audit_drawio.py`
- Create: `.claude/skills/rc929/scripts/test_audit_drawio_path_labels.py`

- [ ] **Step 1: Write failing test**

Create `.claude/skills/rc929/scripts/test_audit_drawio_path_labels.py`:

```python
#!/usr/bin/env python3
"""Smoke tests for conceptual-node path:line warnings."""

from __future__ import annotations

import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

import audit_drawio as audit

SAMPLE = """<?xml version="1.0"?>
<mxfile>
  <diagram id="d1" name="Flow">
    <mxGraphModel pageWidth="800" pageHeight="600">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="n1" value="Validate proposal&lt;br&gt;src/task.py:10" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="160" height="60" as="geometry"/>
        </mxCell>
        <mxCell id="n2" value="Validate proposal&lt;br&gt;S1" style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
          <mxGeometry x="40" y="140" width="160" height="60" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
"""


def test_flags_path_line_in_content_node():
    root = ET.fromstring(SAMPLE)
    diagram = root.find("diagram")
    assert diagram is not None
    issues, _ = audit.audit_page(diagram)
    messages = [i.message for i in issues if i.cell == "n1"]
    assert any("path:line" in m or "source path" in m for m in messages), messages


def test_allows_short_badge():
    root = ET.fromstring(SAMPLE)
    diagram = root.find("diagram")
    assert diagram is not None
    issues, _ = audit.audit_page(diagram)
    bad = [i for i in issues if i.cell == "n2" and ("path:line" in i.message or "source path" in i.message)]
    assert bad == []


if __name__ == "__main__":
    test_flags_path_line_in_content_node()
    test_allows_short_badge()
    print("OK")
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd .claude/skills/rc929/scripts && python3 test_audit_drawio_path_labels.py
```

Expected: AssertionError (no path:line warning yet)

- [ ] **Step 3: Implement check in `audit_page`**

After a vertex is classified as a content node (`label and not is_text and not is_container`), add:

```python
PATH_LINE_IN_LABEL = re.compile(
    r"(?:^|[\s/])[\w./-]+\.[A-Za-z0-9]+:\d+(?:-\d+)?"
)

# inside the content-node branch, after boxes.append(...):
if PATH_LINE_IN_LABEL.search(label):
    issues.append(
        Issue(
            "warning",
            page,
            cell_id,
            "Content node label contains a source path:line; "
            "use a short evidence badge (S1) and put the cite in the Impl map.",
        )
    )
```

Skip this warning when the label clearly belongs to an Impl map / legend / Summary region: if the visible label starts with `Impl map` or `Summary` or `Styles:` or `Legend`, do not flag (those regions may contain cites by design).

```python
def is_supporting_region(label: str) -> bool:
    head = label.strip().lower()
    return (
        head.startswith("impl map")
        or head.startswith("summary")
        or head.startswith("styles:")
        or head.startswith("legend")
        or head.startswith("要点")
    )
```

Only run `PATH_LINE_IN_LABEL` when `not is_supporting_region(label)`.

- [ ] **Step 4: Run test — expect PASS**

```bash
cd .claude/skills/rc929/scripts && python3 test_audit_drawio_path_labels.py
```

Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/scripts/test_audit_drawio_path_labels.py
git commit -m "$(cat <<'EOF'
feat(rc929): warn on path:line inside conceptual node labels

EOF
)"
```

---

### Task 3: Update SKILL.md

**Files:**
- Modify: `.claude/skills/rc929/SKILL.md`

- [ ] **Step 1: Rewrite frontmatter description**

Replace `description` with text that triggers on explore/map/trace/research and states the deliverable is one uncompressed `.drawio` with glanceable conceptual Flows and subordinate evidence mapping (keep under ~600 chars; do not paste the whole process).

- [ ] **Step 2: Insert Diagram decisions after Cross-check / before Synthesize**

Add section **4. Diagram decisions (mandatory gate)** with the five decisions from the spec. Renumber Synthesize → 5, Author → 6, Handoff → 7.

- [ ] **Step 3: Rewrite Synthesize + Author node rules**

Replace two-line `path:line` node rules with:
- Conceptual nodes: verb phrase 2–7 words + muted `S#` badge
- Same-page Impl map: `S# → path:line`
- Main-path chrome; host/guest only when isolation is real
- Complexity budget: ≤7 process / ≤3 decisions / ≤2 failure terminals
- Mandatory self-review checklist (7 tests from spec)

- [ ] **Step 4: Update quality checklist + failure modes**

Remove “two-line behavior + path:line”. Add rows for: cites on node face; long recursion back-edge; vague edge labels; missing Start/Success; role colors without path meaning; skipped Diagram decisions.

- [ ] **Step 5: Update handoff**

Add: brief abstraction level + Impl map location on the Flow page.

- [ ] **Step 6: Commit**

```bash
git add .claude/skills/rc929/SKILL.md
git commit -m "$(cat <<'EOF'
docs(rc929): require glanceable conceptual Flows and evidence map

EOF
)"
```

---

### Task 4: Update content, layout, and editing guides

**Files:**
- Modify: `.claude/skills/rc929/references/drawio-content-guide.md`
- Modify: `.claude/skills/rc929/references/drawio-layout-guide.md`
- Modify: `.claude/skills/rc929/references/drawio-editing-rules.md`

- [ ] **Step 1: Content guide — Flow regions + node labels**

In Flow pages table, add Impl map region (required for evidence-backed Flows).

Replace **Node labels** section with:

```markdown
## Node labels (conceptual)

Content nodes on the conceptual diagram use:

1. **Primary line:** short action-oriented label (verb phrase, prefer 2–7 words).
2. **Badge:** tiny muted evidence id (`S1`, `V1`, `R1`) — not a file path.

**Forbidden on conceptual node faces:** full source paths, line ranges, multi-concern sentences, bare symbols as the sole label.

## Implementation map (same page)

Required subordinate region titled **Impl map** listing:

```text
S1 → path/to/file.ext:12-40
V1 → path/to/file.ext:80-95
```

Overview 要点 and Summary Feynman paragraphs may still use `path:line` cites. Those do not replace the Impl map for Flow evidence.
```

- [ ] **Step 2: Layout guide — TB-first + path colors + main path**

Replace “Pipeline or execution path → Left-to-right” with:

| Question | Preferred layout |
|---|---|
| Short, mostly linear (≤6 stages, no branches/loops) | Left-to-right |
| >6 stages, branches, loops, recursion, or failures | Top-to-bottom |
| Success and failure handling | Main path as spine; failures in side/bottom gutter |

Replace **Rich Flow vocabulary (prefer)** with **Main-path vocabulary (default)** describing Start/process/decision/success/failure/data colors and conditional host/guest.

Update complexity budget to mention ≤7 process / ≤3 decisions / ≤2 failures (keep 10 as hard split trigger for total content nodes including terminals).

- [ ] **Step 3: Editing rules**

Replace two-line path:line bullet and prefer-rich default with conceptual label + badge + Impl map + main-path default. Mention audit warning for path:line in content nodes.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/rc929/references/drawio-content-guide.md \
  .claude/skills/rc929/references/drawio-layout-guide.md \
  .claude/skills/rc929/references/drawio-editing-rules.md
git commit -m "$(cat <<'EOF'
docs(rc929): align guides with conceptual main-path diagrams

EOF
)"
```

---

### Task 5: Rewrite research-starter Flow page

**Files:**
- Modify: `.claude/skills/rc929/templates/research-starter.drawio`

- [ ] **Step 1: Snapshot**

```bash
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/templates/research-starter.drawio \
  --snapshot /tmp/drawio-starter-before.json
```

- [ ] **Step 2: Replace Flow page content**

Keep Overview page unchanged (still valid). Rewrite `name="Flow"` page to a vertical main-path sample:

- Start → Create plan (S1) → Validate plan? (V1) → Apply plan (S2) → Success
- Invalid → End as failed (failure gutter)
- Impl map region with `S1/V1/S2 → example paths`
- Summary three paragraphs (update Feynman text: cites OK in prose; note Impl map)
- Legend: neutral process · blue decision · green success · red failure · yellow data

Use pageWidth ≥ 850 and pageHeight ≥ 1200 if needed for TB layout. Prefix ids with `fl_`. Do not `cp` starter elsewhere.

- [ ] **Step 3: Audit Flow page**

```bash
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/templates/research-starter.drawio \
  --page Flow --baseline /tmp/drawio-starter-before.json
```

Expected: `valid: true`; no path:line warnings on conceptual nodes; Overview hash unchanged.

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/rc929/templates/research-starter.drawio
git commit -m "$(cat <<'EOF'
feat(rc929): restyle starter Flow for main-path conceptual chrome

EOF
)"
```

---

### Task 6: GREEN goldens for three eval scenarios

**Files:**
- Create: `.claude/skills/rc929/evals/01-linear/golden.drawio`
- Create: `.claude/skills/rc929/evals/02-validation-failure/golden.drawio`
- Create: `.claude/skills/rc929/evals/03-recursive-refs/golden.drawio`

- [ ] **Step 1: Author golden.drawio for 01-linear**

Minimal Overview + one Flow page matching brief. LTR OK. Start/Success. Badges + Impl map. Run audit.

- [ ] **Step 2: Author golden.drawio for 02-validation-failure**

TB layout. Decision with Valid/Invalid. Failure gutter terminal. Audit clean.

- [ ] **Step 3: Author golden.drawio for 03-recursive-refs**

TB layout matching spec spine; bounded “For each child” with “Execute child recursively”; Impl map only for paths; two failure terminals max. Audit clean.

```bash
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/evals/03-recursive-refs/golden.drawio --strict
```

Expected: exit 0 (or warnings only if documented; prefer exit 0).

- [ ] **Step 4: Score each green-checklist.md against its golden — all boxes pass**

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/rc929/evals
git commit -m "$(cat <<'EOF'
test(rc929): add GREEN golden drawios for glanceable evals

EOF
)"
```

---

### Task 7: REFACTOR — conflict sweep + sync + notes

**Files:**
- Modify: any remaining conflicting strings under `.claude/skills/rc929/`
- Sync: `~/.agents/skills/rc929/`
- Create: `thoughts/research/2026-08-01-rc929-glanceable-skill-update-notes.md`

- [ ] **Step 1: Grep for conflicting instructions**

```bash
rg -n "path:line|two-line|prefer.?rich|role color|Left-to-right flow" \
  .claude/skills/rc929 --glob '!evals/**'
```

Fix any remaining conflicts (except intentional mentions in “Rules to remove” / RED notes / Impl map examples).

- [ ] **Step 2: Sync agent skill tree**

```bash
rsync -a --delete \
  .claude/skills/rc929/ \
  ~/.agents/skills/rc929/
```

- [ ] **Step 3: Write notes deliverable**

`thoughts/research/2026-08-01-rc929-glanceable-skill-update-notes.md` must include:
1. Behavioral changes summary
2. Test scenarios used
3. Before/after per scenario
4. Pointer to recursive golden as improved example
5. Remaining limitations (from spec)

- [ ] **Step 4: Final verify**

```bash
cd .claude/skills/rc929/scripts && python3 test_audit_drawio_path_labels.py
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/templates/research-starter.drawio --strict
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/evals/01-linear/golden.drawio --strict
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/evals/02-validation-failure/golden.drawio --strict
python3 .claude/skills/rc929/scripts/audit_drawio.py \
  .claude/skills/rc929/evals/03-recursive-refs/golden.drawio --strict
```

Expected: all OK / exit 0

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/rc929 thoughts/research/2026-08-01-rc929-glanceable-skill-update-notes.md
git commit -m "$(cat <<'EOF'
docs(rc929): finish glanceable-diagram REFACTOR and eval notes

EOF
)"
```

Note: `~/.agents` sync is local; do not commit home-directory paths.

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Diagram decisions gate | 3 |
| Conceptual-first + same-page Impl map | 3, 4, 5, 6 |
| Path-color semantics + main-path chrome | 4, 5 |
| Remove two-line path:line / prefer-rich default | 3, 4, 7 |
| Tiny S# badges | 3, 4, 5, 6 |
| Recursion patterns | 3, 6 (scenario 03) |
| Complexity limits | 3, 4 |
| Self-review checks | 3, 1 (green checklists) |
| audit cheap check | 2 |
| Three eval scenarios RED→GREEN→REFACTOR | 1, 6, 7 |
| Sync ~/.agents | 7 |
| Prompt deliverables (summary, before/after, limitations) | 7 |

## Plan self-review

- No TBD/placeholder steps
- Audit test asserts concrete message substrings aligned with implementation
- Eval paths live under skill root `evals/` as in the spec
- Overview cite-on-next-line behavior preserved (content guide Task 4)
