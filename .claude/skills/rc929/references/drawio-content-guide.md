# Draw.io Content Guide

Agents put research prose **inside** the `.drawio` pages. Do **not** write a research `.md` or `.html` report to disk.

Read `templates/research-starter.drawio` as an internal visual/structure reference, then **write a new** uncompressed `.drawio` at the output path that matches its page shape and style vocabulary. Do **not** `cp` or byte-seed the starter into the target directory. Follow `drawio-editing-rules.md` and `drawio-layout-guide.md` for XML and layout.

---

## Filename & path

- Pattern: `<YYYY-MM-DD>-research-<kebab-topic>.drawio`
- Default directory: `thoughts/research/` (override when the user specifies a custom path)
- Create parent directories if needed

---

## Overview page

Fill the Overview page (do not put a large flowchart here). Match the starter’s Overview regions.

| Region | Required | Content |
|--------|----------|---------|
| Title | yes | Short report title (plain text) |
| Summary | yes | Three unlabeled paragraphs: analogy → Feynman what/how (+ cites) → First-Principle why |
| 要点 / Key findings | yes | Ordered findings; each item = prose line, then cite line |
| 待验证 | when needed | Uncertainties; remove the placeholder bullet if none |
| Hint line | optional | Keep or delete; never replace with a diagram |
| Metadata (`question` / `repo` / `date` / `branch` / `commit`) | **no** | Do not include this block |

**要点 item shape**

```text
1. Plain-language finding with no inline path:line mixed into the sentence.
src/planner.ts:49-84
```

In draw.io HTML labels, put the cite on its own line after `<br>`, wrapped in `<code>…</code>`.

**Rules**

1. Overview order: title → Summary → 要点 → 待验证 (optional).
2. Summary teaches the answer’s shape; 要点 remain the scannable evidence list. Do not fold analogy / Feynman / First-Principle prose into 要点 items.
3. Overview text (Summary + 要点) must be enough that a reader unfamiliar with the codebase understands the answer’s shape before opening Flow pages.
4. Anything uncertain is listed under 待验证 and is **not** drawn as fact on Flow pages.
5. Do not mix `` `path:line` `` into the finding sentence; the cite stands alone on the next line.

---

## Flow pages

Add one Flow page per investigable area. Rename the page to the concern (e.g. `Runtime path`, `Error handling`). Match the starter’s Flow visual language (main-path spine, failure gutter, path-color semantics, Impl map, Summary). See `drawio-layout-guide.md`.

| Region | Required | Content |
|--------|----------|---------|
| Page title | yes | Matches the page name / concern |
| Conceptual diagram | yes | Main-path workflow; ≤7 major process nodes, ≤3 decisions, ≤2 failure terminals (split/phase if exceeded); max ~10 content nodes total before split |
| Impl map | yes (evidence-backed Flows) | Subordinate table: `S1 → path:line` |
| Summary | yes | Three unlabeled paragraphs: analogy → Feynman what/how (+ cites) → First-Principle why |
| Legend | when >3 visual categories | Path-color meanings |
| Style samples | replace | Use real path-semantic nodes; delete unused samples |

**Rules**

1. One concern per page. Split runtime, errors, infrastructure, and package topology when combining densifies edges.
2. Every conceptual node/edge must be traceable via the Impl map (or omitted / listed under Overview 待验证).
3. Shorten edge labels; put longer explanation in the Summary. Prefer Valid / Invalid / Yes / No / Pass / Fail / More children / Complete — not Continue / Next / Return.
4. Default to main-path chrome. Host/guest nesting only when isolation/sandbox boundaries are real in the researched system.
5. Prefix new cell IDs with a page-specific namespace (e.g. `rt_`, `err_`).

---

## Summary (analogy → Feynman → First Principle)

Every Flow page and the Overview teaching block use a region titled **Summary**.

Three unlabeled paragraphs, in order:

1. **Analogy** — one everyday metaphor mapped to this page’s core idea. No `` `path:line` `` cites in this paragraph.
2. **Explanation (Feynman)** — plain-language what/how, teachable to a newcomer; short `` `path:line` `` cites belong here.
3. **First Principle** — one short paragraph on why this behavior or structure must exist, grounded in observed code behavior (causal necessity). Not a named-principle vocabulary checklist.

Hard rules:

- No on-page subtitles (`Analogy`, `Explanation`, `First Principle`, etc.).
- Separate with paragraph breaks only (`<br><br>` in draw.io HTML labels).
- Longer teaching belongs in Summary; edge labels stay short.
- Document what IS — no refactor advice.

---

## Node labels (conceptual)

Content nodes on the conceptual diagram use:

1. **Primary line:** short action-oriented label (verb phrase, prefer 2–7 words).
2. **Badge:** tiny muted evidence id (`S1`, `V1`, `R1`) — not a file path.

Decision nodes are questions or conditions (`Proposal valid?`, `More children?`).

**Forbidden on conceptual node faces:** full source paths, line ranges, multi-concern sentences, bare symbols as the sole label (e.g. `Run()`, `cli.go`).

---

## Implementation map (same page)

Required subordinate region titled **Impl map** listing:

```text
S1 → path/to/file.ext:12-40
V1 → path/to/file.ext:80-95
```

If the table would overflow the page, add a focused implementation-mapping Flow page for that concern (exception only).

Overview 要点 and Summary Feynman paragraphs may still use `path:line` cites. Those do not replace the Impl map for Flow evidence.

---

## Citation format

- In Impl map and Overview 要点: `` `path/to/file.ext:line` `` or `` `path/to/file.ext:start-end` ``.
- On Overview 要点, put the cite on its **own line** under the finding (see above).
- Quoted symbol names are acceptable when a single line is misleading; still name the file.
- Do not paste large code blocks into the diagram; cite and summarize.
- Do not put full path:line strings on conceptual node faces.

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
4. Chosen abstraction level (brief) and that the Impl map is on the Flow page
5. Any remaining 待验证 items
