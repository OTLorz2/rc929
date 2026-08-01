# Draw.io Editing Rules

Use with `templates/research-starter.drawio` (reference only) and `scripts/audit_drawio.py`. For layout density, reading direction, and connector routing, also read `drawio-layout-guide.md`.

## Workflow (authoring / editing)

1. Read every explicitly named source file before drawing.
2. Complete the Diagram decisions gate (question, reader, abstraction, primary success path, main vs supporting) before authoring nodes.
3. Read the complete `.drawio` file. Identify whether it contains uncompressed `mxGraphModel` XML or compressed diagram text. **rc929 requires uncompressed XML.**
4. If editing an existing file, snapshot it before modification:

   ```bash
   python3 .claude/skills/rc929/scripts/audit_drawio.py FILE --snapshot /tmp/drawio-before.json
   ```

5. Inspect the target page and any reference page (usually the Flow page in `research-starter.drawio`). Reuse page dimensions, main-path vocabulary, path-color semantics, typography, Impl map placement, and failure-gutter treatment. When creating a new deliverable, author a new file that matches this visual language — do not `cp` the starter into the output path. Use host/guest nesting only when isolation is real.
6. Plan one primary reading direction and a small number of lanes. Read `drawio-layout-guide.md` before creating or substantially rearranging a diagram.
7. Edit only the requested page. Preserve page names, page IDs, non-target pages, and existing cells outside the requested scope. Prefix new cell IDs with a short page-specific namespace (e.g. `ov_`, `fl_`, `err_`).
8. Escape XML attribute content correctly: use `&lt;`, `&gt;`, `&amp;`, and `&quot;`. Keep HTML labels inside the `value` attribute rather than inserting raw tags.
9. Validate after editing:

   ```bash
   python3 .claude/skills/rc929/scripts/audit_drawio.py FILE --page PAGE_NAME \
     --baseline /tmp/drawio-before.json
   ```

10. Preview with draw.io or the Obsidian Draw.io editor whenever available. Inspect the exact target page at a readable zoom. A headless renderer may verify geometry but may not render draw.io HTML labels faithfully; never claim visual QA from an incompatible renderer.

## Editing rules

- Overview: no metadata block (`question` / `repo` / `date` / `branch` / `commit`). Order: title → Summary (3 unlabeled paragraphs) → 要点 (prose then cite line) → 待验证 when needed.
- Write a **Summary** with three unlabeled paragraphs: analogy → Feynman what/how (short `path:line` cites) → First-Principle why (causal necessity from observed behavior; no named-principle checklist). Do not use technique names as on-page subtitles.
- Label conceptual content nodes with a short verb phrase (prefer 2–7 words) plus a muted evidence badge (`S1`, `V1`, `R1`). Do not put full `path:line` on conceptual node faces.
- Include a same-page **Impl map** region: `S1 → path:line`.
- Default to main-path chrome (Start → spine → Success; failure gutter; path colors). Host/guest only when isolation is real.
- Mid-side connector attach is fine when waypoints immediately separate tracks; do not leave multiple edges stacked on the same segment.
- Default to exact, evidence-backed nodes and edges. Do not invent relationships.
- Keep one concern per page. Split architecture, runtime flow, error flow, and infrastructure when combining them would create long cross-page-style edges.
- Prefer ≤7 major process nodes, ≤3 decisions, ≤2 failure terminals; treat ~10 content nodes as the upper bound before splitting. Decorative titles, legends, Impl map blocks, and empty boundaries do not count as process nodes.
- Prefer direct or short orthogonal connectors. Use at most two intentional bends unless an obstacle forces another.
- Do not route through nodes, labels, or unrelated containers. Reserve gutters between lanes for return and error paths.
- Shorten edge labels; move explanations into the Summary. Avoid Continue / Next / Return.
- Keep external processes outside the relevant internal boundary and distinguish them consistently.
- Do not modify another page merely to make its style more consistent.

## Validation expectations

The audit script checks XML structure, page counts, cell references, geometry bounds, labeled-node overlap, explicit routing points, untouched-page hashes, and warns when conceptual content-node labels contain a source `path:line` (use a badge + Impl map instead). Treat structural errors as blockers. Resolve overlap, routing, and path:line-in-node warnings before delivery unless the warning is a deliberate, visually verified exception.

Report the edited file and page, the main contents added, validation performed, and any preview limitation.
