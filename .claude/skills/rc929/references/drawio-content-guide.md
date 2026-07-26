# Draw.io Content Guide

Agents put research prose **inside** the `.drawio` pages. Do **not** write a research `.md` or `.html` report to disk.

Copy `templates/research-starter.drawio` to the output path, then replace placeholders. Follow `drawio-editing-rules.md` and `drawio-layout-guide.md` for XML and layout.

---

## Filename & path

- Pattern: `<YYYY-MM-DD>-research-<kebab-topic>.drawio`
- Default directory: `thoughts/research/` (override when the user specifies a custom path)
- Create parent directories if needed

---

## Overview page

Fill the Overview page in the starter (do not put a large flowchart here).

| Region | Required | Content |
|--------|----------|---------|
| Title | yes | Short report title (plain text) |
| Metadata | yes | `question` verbatim; `date` ISO `YYYY-MM-DD`; `repo`, `branch`, `commit` when available |
| 要点 / Key findings | yes | Ordered findings a newcomer can follow; each claim with a short `` `path:line` `` when possible |
| 待验证 | when needed | Uncertainties; remove the placeholder bullet if none |
| Hint line | optional | Keep or delete; never replace with a diagram |

**Rules**

1. Overview text must be enough that a reader unfamiliar with the codebase understands the answer’s shape before opening Flow pages.
2. Anything uncertain is listed under 待验证 and is **not** drawn as fact on Flow pages.
3. Metadata fields may stay empty only when truly unavailable (still keep the labels).

---

## Flow pages

Duplicate the starter `Flow` page once per investigable area. Rename the page to the concern (e.g. `Runtime path`, `Error handling`).

| Region | Required | Content |
|--------|----------|---------|
| Page title | yes | Matches the page name / concern |
| Diagram | yes | Evidence-backed nodes and edges; prefer ~8 content nodes, max 10 |
| Feynman note | yes | Plain-language explanation of what the page shows and why (≥2 sentences). Include short `` `path:line` `` cites |
| Style samples | replace | Swap starter process/data/external placeholders for real nodes; delete unused samples |

**Rules**

1. One concern per page. Split runtime, errors, infrastructure, and package topology when combining densifies edges.
2. Every node and edge must be traceable to code, or omitted / listed under Overview 待验证.
3. Shorten edge labels; put longer explanation in the Feynman note.
4. Reuse the starter’s visual language (blue process, green data, warm external, dashed empty boundary).
5. Prefix new cell IDs with a page-specific namespace (e.g. `rt_`, `err_`).

---

## Citation format

- Prefer inline `` `path/to/file.ext:line` `` or `` `path/to/file.ext:start-end` ``.
- Quoted symbol names are acceptable when a single line is misleading; still name the file.
- Do not paste large code blocks into the diagram; cite and summarize.

---

## What not to produce

| Artifact | Status |
|----------|--------|
| Research `.md` report | **Do not write** |
| Research `.html` report | **Do not write** |
| Mermaid diagrams | **Do not use** — native draw.io shapes only |
| Compressed draw.io XML | **Do not use** — keep `mxGraphModel` uncompressed |

---

## Handoff text (chat, not a file)

Tell the user:

1. Path to the `.drawio` file
2. Which page to open first (usually Overview, then a named Flow page)
3. 2–3 sentence factual summary
4. Any remaining 待验证 items
