# Template Sync Guide

When `template.html` appears in the **rc929 skill root** (same directory as `SKILL.md`), the skill must sync its bundled HTML assets to match that template **before** starting research.

**Who does this:** spawn a **dedicated subagent** (Task/generalPurpose). The main agent must NOT perform the sync — it needs full context for the user's research question.

---

## Trigger & lifecycle

```
skill root/template.html exists?
  ├─ NO  → proceed with current html-shell-template.html + html-report-guide.md
  └─ YES → subagent sync (this guide) → delete template.html → main agent researches
```

After a successful sync, `template.html` is **deleted**. It is a one-shot input, not a permanent file.

---

## What to extract from template.html

Focus on **structure, styling, and behavior** — the reusable shell:

| Category | Extract | Examples |
|----------|---------|----------|
| **Typography** | Google Fonts links, `font-family`, sizes, weights, line-height | `Atkinson Hyperlegible`, `EB Garamond` |
| **Color system** | `:root` CSS variables | `--bg`, `--accent`, `--muted`, `--border` |
| **Layout** | Grid/flex, max-width, padding, breakpoints | `.layout`, `nav.toc` sticky vs static, column counts |
| **Components** | Class names and their CSS | `.question-box`, `.step-card`, `.diagram-wrap`, `.meta`, `details` |
| **Navigation** | TOC markup pattern, active-link JS, scroll-margin | `nav.toc` links, IntersectionObserver |
| **Scripts** | Mermaid init, theme toggle, scroll progress, diagram interactions | bottom `<script>` block |
| **Section skeleton** | Which section ids exist, heading hierarchy | `#summary`, `#diagrams`, `#evidence`, `#gaps` |
| **Metadata chrome** | Header structure for title, repo, date, question panel | `<header>` layout |

## What to IGNORE (content, not chrome)

Strip all research-specific material. Do **not** let sample content influence the skill:

- Titles, headings text (e.g. "Claude Code 请求链路")
- `<p class="meta">` values (repo name, dates, git info)
- `.question-box` body text
- All `<main>` prose, bullet text, table rows
- Mermaid diagram **node labels and edges** (keep diagram **wrapper** markup only)
- `<details>` snippet contents, file paths in examples
- Footer attribution text
- Any `path:line` citations in the sample

When building the new shell, replace content areas with placeholders: `{{TITLE}}`, `{{HERO_EYEBROW}}`, `{{HERO_TITLE}}`, `{{META_PILLS}}`, `{{QUESTION}}`, `{{TOC_ITEMS}}`, `{{MAIN_CONTENT}}`, `{{FOOTER}}`.

---

## Files to update

### 1. `references/html-shell-template.html`

Produce a **generic, copy-ready shell**:

1. Copy template's `<head>` CSS and bottom `<script>` block (adapted).
2. Keep structural HTML: header, nav, main wrapper, footer — with placeholder content.
3. Include a short HTML comment at top documenting:
   - Source: synced from skill-root `template.html` on `<date>`
   - ID rule: section `id="<slug>"`; Mermaid subgraph/node ids use `sg_` / `n_` prefixes
   - TOC rule: `href="#<slug>"` text must equal section `<h2>`
4. Preserve **rc929 essentials** if the template lacks them:
   - Mermaid via ES module (`mermaid@11` + `@mermaid-js/layout-elk`) in bottom `<script type="module">` — **not** a classic `<script src="mermaid.min.js">` in `<head>`
   - `mermaid.registerLayoutLoaders(elkLayouts)` + Dagre-tuned `mermaid.initialize()` (see current shell)
   - `pre.mermaid` inside `.diagram-wrap`
   - `.diagram-caption` under each diagram
   - highlight.js CDN (css + js) in `<head>` + `highlightSnippets()` init in bottom `<script>` (after Mermaid render)
   - `pre.snippet` token color overrides in CSS (scoped to shell palette vars)
   - If template has no diagram fullscreen: **add** `setupDiagramFullscreen()` from the previous shell (inject `.diagram-fs-btn`, overlay, Ctrl+wheel zoom, Esc close) — this is a rc929 UX requirement unless the template explicitly implements an equivalent

Replace all `<main>` content with a single `{{MAIN_CONTENT}}` placeholder (converter generates sections from markdown). Replace fixed TOC `<li>` entries with `{{TOC_ITEMS}}`.

### 2. `references/html-report-guide.md`

Rewrite the **Visual system** and **Hard UI rules** sections to match the new shell:

- Font names, palette vars, page max-width
- TOC pattern (class names, sticky vs inline, numbered or plain links)
- Section heading pattern (`.section-head` + `.section-num` vs plain `<h2>`)
- 要点 format (`.summary-list` ordered list vs `<ul>` — **follow the template's list style**)
- Diagram rules, mermaid id prefixes, any JS behaviors
- Remove references to the **previous** template's fonts/layout (e.g. Fraunces/toc-rail) unless still present

Update the architecture table row for `html-shell-template.html` if its role changed (e.g. "sticky sidebar toc" vs "toc-rail").

### 3. `references/markdown-report-guide.md`

If shell placeholder tokens or section CSS class names change, review the mapping table in `markdown-report-guide.md` and update if needed. Ensure `scripts/md-to-html.mjs` placeholder replacements still match the new shell.

Do **not** change research workflow sections in `SKILL.md` — only HTML-related references.

### 4. Delete `template.html`

After both files are written and saved, delete `template.html` from the skill root. Confirm it no longer exists.

---

## Subagent prompt template

Main agent spawns a subagent with this task (adjust paths):

```
You are syncing rc929 skill HTML assets from a new user template.

Read: .claude/skills/rc929/references/template-sync-guide.md (full guide)
Read: .claude/skills/rc929/template.html (the new template — STYLE ONLY)

Update:
1. .claude/skills/rc929/references/html-shell-template.html — generic shell with placeholders
2. .claude/skills/rc929/references/html-report-guide.md — visual system + UI rules matching new shell

Rules:
- Extract layout/CSS/JS/structure from template.html
- IGNORE all research content (titles, prose, diagram nodes, citations, sample paths)
- Preserve rc929 diagram fullscreen if template lacks it
- Preserve highlight.js CDN, `highlightSnippets()` init, and `pre.snippet` token CSS if template lacks them
- Mermaid ids: sg_/n_ prefixes; section ids: simple slugs
- After saving both files, DELETE template.html

Return a brief summary: fonts, max-width, toc layout, list style, any JS features added.
```

---

## Validation before handoff

Subagent checklist:

- [ ] `html-shell-template.html` opens as valid HTML; fonts load; CSS vars defined
- [ ] Shell uses placeholders, not sample research text
- [ ] `html-report-guide.md` visual table matches shell (no stale Fraunces/toc-rail unless template has them)
- [ ] `template.html` deleted from skill root
- [ ] Diagram fullscreen or template-equivalent interaction documented
- [ ] Placeholder tokens (`{{MAIN_CONTENT}}`, `{{TOC_ITEMS}}`, etc.) unchanged or `md-to-html.mjs` updated to match
- [ ] `markdown-report-guide.md` mapping table reviewed if class names changed

Main agent: after subagent returns, **do not re-read template.html** (it's gone). Read `markdown-report-guide.md` when writing the report; the converter reads the updated shell.

---

## Common mistakes

| Mistake | Fix |
|---------|-----|
| Copied claude-code sample diagram into shell | Shell should have empty/placeholder mermaid or one minimal example |
| Left template.html in place | Always delete after sync |
| Main agent does sync itself | Offload to subagent; main agent starts research immediately after |
| Kept old guide fonts while shell changed | Guide and shell must describe the same system |
| Removed mermaid/TOC JS | Keep all functional JS from template; add missing rc929 essentials |
| Removed highlight.js CDN/init | Restore highlight.js CDN, `highlightSnippets()`, and `pre.snippet` token CSS from previous shell |
| Replaced ES module Mermaid with classic script tag | Shell must use `<script type="module">` + elk registration + Dagre init config |
