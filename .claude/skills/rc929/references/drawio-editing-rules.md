# Draw.io Editing Rules

Use with `templates/research-starter.drawio` (reference only) and `scripts/audit_drawio.py`. For layout density, reading direction, and connector routing, also read `drawio-layout-guide.md`.

## Workflow (authoring / editing)

1. Read every explicitly named source file before drawing.
2. Read the complete `.drawio` file. Identify whether it contains uncompressed `mxGraphModel` XML or compressed diagram text. **rc929 requires uncompressed XML.**
3. If editing an existing file, snapshot it before modification:

   ```bash
   python3 .claude/skills/rc929/scripts/audit_drawio.py FILE --snapshot /tmp/drawio-before.json
   ```

4. Inspect the target page and any reference page (usually the Flow page in `research-starter.drawio`). Reuse page dimensions, shape vocabulary, typography, colors, arrow styles, and the distinction between data, process, boundary, and external-system nodes. When creating a new deliverable, author a new file that matches this visual language — do not `cp` the starter into the output path.
5. Plan one primary reading direction and a small number of lanes. Read `drawio-layout-guide.md` before creating or substantially rearranging a diagram.
6. Edit only the requested page. Preserve page names, page IDs, non-target pages, and existing cells outside the requested scope. Prefix new cell IDs with a short page-specific namespace (e.g. `ov_`, `fl_`, `err_`).
7. Escape XML attribute content correctly: use `&lt;`, `&gt;`, `&amp;`, and `&quot;`. Keep HTML labels inside the `value` attribute rather than inserting raw tags.
8. Validate after editing:

   ```bash
   python3 .claude/skills/rc929/scripts/audit_drawio.py FILE --page PAGE_NAME \
     --baseline /tmp/drawio-before.json
   ```

9. Preview with draw.io or the Obsidian Draw.io editor whenever available. Inspect the exact target page at a readable zoom. A headless renderer may verify geometry but may not render draw.io HTML labels faithfully; never claim visual QA from an incompatible renderer.

## Editing rules

- Write a **Summary** beside the diagram (≥2 sentences, plain language, with short `path:line` cites).
- Label content nodes with two lines: short workflow behavior, then `path:line`. Do not use file/symbol-only titles.
- Mid-side connector attach is fine when waypoints immediately separate tracks; do not leave multiple edges stacked on the same segment.
- Default to exact, evidence-backed nodes and edges. Do not invent relationships.
- Keep one concern per page. Split architecture, runtime flow, error flow, and infrastructure when combining them would create long cross-page-style edges.
- Prefer about 8 content nodes; treat 10 as the normal upper bound for a focused flow. Decorative titles, legends, and empty boundaries do not count.
- Prefer direct or short orthogonal connectors. Use at most two intentional bends unless an obstacle forces another.
- Do not route through nodes, labels, or unrelated containers. Reserve gutters between lanes for return and error paths.
- Shorten edge labels; move explanations into node text or the Summary.
- Keep external processes outside the internal boundary and distinguish them consistently.
- Treat permissions or prompts as preventive controls and audits or checks as verification controls when the source makes that distinction.
- Do not modify another page merely to make its style more consistent.

## Validation expectations

The audit script checks XML structure, page counts, cell references, geometry bounds, labeled-node overlap, explicit routing points, and untouched-page hashes. Treat structural errors as blockers. Resolve overlap and routing warnings before delivery unless the warning is a deliberate, visually verified exception.

Report the edited file and page, the main contents added, validation performed, and any preview limitation.
