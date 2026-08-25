# rc929 Draw.io Deliverable Design

**Date:** 2026-07-26  
**Status:** Approved for implementation planning  
**Branch context:** `drawio`  
**Source skill reference:** `thoughts/drawio-diagramming/` (bundled into rc929; not left as a runtime dependency)

## Problem

rc929 turns codebase research questions into one interactive HTML report (Markdown → `md-to-html.mjs` → HTML shell + Mermaid). The desired product is an editable, evidence-backed **draw.io** artifact instead: one `.drawio` file the user opens in draw.io / Obsidian Draw.io, with research prose beside diagrams.

## Goals

1. Final deliverable is **exactly one** uncompressed `.drawio` file.
2. Keep the research method: intake → plan → locate → analyze → cross-check, accuracy-first, document what IS.
3. Bundle draw.io authoring/validation capability into `.claude/skills/rc929/` (from `thoughts/drawio-diagramming/`).
4. Preserve explanatory value: Overview summary + Feynman notes on each flow page + `path:line` citations.
5. Validate structure/layout with `audit_drawio.py` before handoff.

## Non-goals

- Dual HTML + drawio output
- Writing a research `.md` (or other intermediate report) to disk
- JSON/YAML → drawio codegen pipeline
- Changing locator/analyzer research semantics
- Obsidian-plugin-specific features
- Keeping the HTML converter as a deprecated parallel path

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Deliverable | Drawio only |
| Drawio skill integration | Bundle into rc929 |
| Page structure | Overview + one page per flow |
| Visual starter | Hybrid: `research-starter.drawio` + layout guide |
| HTML cleanup | Delete converter/shell/HTML guides; repurpose markdown content guide for in-diagram prose |
| Intermediate `.md` | None on disk — content guide shapes text inside drawio pages only |
| Implementation shape | Approach 1: rewrite synthesize/build/handoff around drawio |

## Architecture

```
Intake → Plan → Locate → Analyze → Cross-check
       → Author .drawio (from starter)
       → Audit (audit_drawio.py)
       → Handoff (.drawio path only)
```

**Removed from the active workflow:** research `.md` file, `md-to-html.mjs`, HTML shell, Mermaid diagrams, `template.html` sync.

**Unchanged principles:**

1. Accuracy first — every claim needs evidence (`path:line` or quoted symbol). Uncertain items are `待验证` and are not drawn as fact.
2. One deliverable file.
3. Document what IS — no refactors/critiques unless asked.
4. Fresh research — read live code; do not trust stale docs alone.

## Skill package layout

Target tree under `.claude/skills/rc929/`:

```
.claude/skills/rc929/
├── SKILL.md                          # rewrite: research → .drawio
├── scripts/
│   └── audit_drawio.py               # from thoughts/drawio-diagramming/scripts/
├── templates/
│   └── research-starter.drawio       # Overview + one blank Flow page
└── references/
    ├── codebase-locator.md           # keep
    ├── codebase-analyzer.md          # keep
    ├── drawio-layout-guide.md        # from thoughts/.../layout-guide.md
    ├── drawio-editing-rules.md       # extracted from drawio SKILL editing/validation rules
    └── drawio-content-guide.md       # repurposed from markdown-report-guide.md
                                      # (in-diagram Overview / Feynman / citations)
```

**Delete:**

- `scripts/md-to-html.mjs`
- `references/html-shell-template.html`
- `references/html-report-guide.md`
- `references/template-sync-guide.md`
- `references/diagram-layout-guide.md` (Mermaid/ELK-oriented; replaced by drawio layout guide)

**Also update:** `README.md` and `README.zh-CN.md` — deliverable is `.drawio`; drop Node.js requirement; require Python 3 for audit.

**Bundling note:** Copy files from `thoughts/drawio-diagramming/` into the skill. `thoughts/` remains a local reference workspace (gitignored by this repo’s whitelist); the installed skill must be self-contained under `.claude/skills/rc929/`.

## File and page model

### Output

- Default path: `thoughts/research/<YYYY-MM-DD>-research-<kebab-topic>.drawio`
- Create parent directories if needed
- User-specified path overrides the default

### Starter template

`templates/research-starter.drawio` contains:

1. **Overview** page — title/metadata placeholders, empty summary region, empty 待验证 region; no flowchart
2. **Flow** page — page size, shape vocabulary/styles, empty note block region, empty diagram canvas

Agent copies the starter to the output path, then fills and duplicates Flow pages as needed.

### Overview page content

- Research question (verbatim)
- Metadata: repo path/name, ISO date, branch/commit when available
- 要点-style bullets sufficient for a reader new to the codebase
- 待验证 list when uncertainty remains
- No large architecture/flow diagram on this page

### Flow pages

- One investigable concern per page (runtime vs errors vs infra split when combining would densify edges)
- Prefer ~8 content nodes; treat 10 as the normal upper bound
- Feynman-technique note block beside the diagram explaining what the page shows and why it matters
- Short `path:line` citations on nodes and/or in the note
- Uncompressed `mxGraphModel` XML; correct XML escaping; page-specific cell ID namespaces
- Follow `drawio-layout-guide.md` for reading direction, lanes, gutters, connector routing

### Content guide (replaces markdown report file)

`drawio-content-guide.md` defines how to structure text **inside** drawio pages (Overview bullets, note length/expectations, citation format). It does **not** instruct the agent to write a `.md` report to disk.

## Authoring and validation workflow

1. Complete research phases (locator → analyzer → cross-check) using existing reference guides.
2. Copy `templates/research-starter.drawio` → output path.
3. Snapshot:  
   `python3 .claude/skills/rc929/scripts/audit_drawio.py FILE --snapshot /tmp/drawio-before.json`
4. Fill Overview; for each area, duplicate/rename a Flow page and draw evidence-backed content.
5. Re-audit target pages with `--page` and `--baseline`; treat structural errors as blockers; resolve overlap/routing warnings before delivery unless a deliberate, visually verified exception is documented in the handoff.
6. Preview in draw.io / Obsidian Draw.io when available. Do not claim visual QA from renderers that mishandle draw.io HTML labels.
7. Handoff: `.drawio` path, which page to open first, 2–3 sentence factual summary, 待验证 gaps.

## Error handling

| Class | Examples | Action |
|-------|----------|--------|
| Blocker | Invalid/compressed XML, broken cell refs, audit structural errors, invented edges, empty starter shipped as done | Fix before handoff |
| Warning | Node overlap, edges through nodes, >10 content nodes, missing Feynman note, claim without citation | Resolve before handoff by default |
| Explicit gap | Uncertain relationship | List under 待验证 on Overview; omit from flow diagrams as fact |

## Quality checklist (skill)

- [ ] Starter copied; output path correct
- [ ] Overview has question, metadata, 要点, and 待验证 if needed
- [ ] Each flow page: focused diagram + Feynman note + evidence cites
- [ ] Every diagram node/edge traceable to code (or labeled hypothetical / omitted)
- [ ] `audit_drawio.py` run; structural errors cleared; warnings addressed
- [ ] No research `.md` / `.html` produced as part of the skill contract
- [ ] SKILL description and READMEs refer to `.drawio`, not HTML

## Testing / verification plan (for implementation)

1. Bundle scripts/guides/starter; delete HTML-only assets; SKILL.md + READMEs updated.
2. Dry-run audit on the untouched starter (expect clean structure / known placeholders).
3. Smoke research on this repo (or a tiny fixture): produce one Overview + ≥1 Flow page; audit passes.
4. Confirm Node-based converter is gone and Python audit is the only required tooling call at build time.

## Migration impact

| Before | After |
|--------|-------|
| `.html` deliverable | `.drawio` deliverable |
| Mermaid in HTML | Native draw.io shapes/edges |
| Node 18+ for conversion | Python 3 for `audit_drawio.py` |
| `template.html` sync subagent | Copy `research-starter.drawio` |
| Collapsible HTML evidence panels | On-page citations + Overview 待验证 |

## Open points resolved during brainstorming

- No dual output; no on-disk research markdown.
- Drawio tooling is vendored into the skill, not invoked via a separate install path at runtime.
- HTML assets are removed, not deprecated in-tree.
