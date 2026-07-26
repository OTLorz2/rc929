# Draw.io Layout Guide

Use this guide before drawing or substantially rearranging a page.

## Choose the diagram shape

| Question | Preferred layout |
|---|---|
| Pipeline or execution path | Left-to-right flow |
| Shallow lifecycle or hierarchy | Top-to-bottom flow |
| Multi-party request/response | Horizontal participants with vertical sequence |
| Layered architecture | One lane or boundary per layer |
| Success and failure handling | Main path centered; failure paths in a reserved side gutter |

Do not mix runtime flow, package dependencies, deployment topology, and observability in one page.

## Rich Flow vocabulary (prefer)

Match `templates/research-starter.drawio` when the researched path has orchestration, isolation, or fail-closed behavior:

- **Outer host / trusted control** boundary for orchestration, promote, freeze, and verify.
- **Inner dashed guest / isolate** boundary when execution is sandboxed or otherwise isolated.
- **Failure gutter** (bottom or side) with a fail-closed node; use a dashed warm/red edge from boundary or provider errors.
- **Role color families:** planner blue · executor amber · provider violet · guest rose · staging yellow · data/freeze green cylinder · verify green · failure pink/coral · external warm (outside or at edge).

**Prefer rich.** Allow the simple process / data / external set only when nested or failure scaffolding would be mostly empty (for example a pure package topology with no isolate or fail-closed path).

## Complexity budget

- Target about 8 content nodes and 12 semantic edges.
- Treat 10 content nodes as the normal maximum for one focused flow.
- Split the page when a hub fans out to many unrelated concerns or when more than two edges must cross multiple lanes.
- Exclude titles, legends, annotations, and empty boundary rectangles from the content-node count.
- Allow peripheral context/data connectors beyond the target only when they remain short and do not cross the main flow.

## Place nodes before edges

1. Establish the page margin and primary reading direction.
2. Place source nodes before targets.
3. Align peer nodes to a shared row or column.
4. Keep sibling boxes equal in size when their roles are comparable.
5. Reserve blank gutters for backward, error, or cross-lane connectors.
6. Keep external systems outside the relevant internal boundary.
7. Add edges only after the node grid is stable.

## Route connectors

- Prefer the shortest clear orthogonal path.
- Choose source and target ports that face each other.
- Use zero bends for aligned nodes, one bend for adjacent lanes, and two bends to avoid a single obstacle.
- Do not add a turn merely for symmetry.
- Avoid routing behind an intermediate node; an edge that disappears under a box is ambiguous.
- Keep parallel edges on separated tracks. Do not stack unrelated edges on the same segment.
- Mid-side attach (~0.5 on an edge) is acceptable when waypoints immediately fan routes onto separated tracks.
- Do not leave multiple edges stacked on the same segment after attach; if they would overlap, diverge with waypoints or stagger ports along the side.
- Prefer port stagger when that is clearer than a shared midpoint plus fan-out.
- Route return and failure paths through reserved outer gutters rather than against the main direction.
- Avoid edge-edge crossings. If a crossing remains, reorder nodes or split the concern before adding line jumps.
- Keep labels on straight, uncongested segments. Shorten labels rather than widening the route.
- Use dashed or lighter connectors only when they encode a stable meaning such as context, optional flow, or data input.

## Reuse an existing page's visual language

Inspect the reference page for:

- process versus data shapes;
- rounded versus square corners;
- boundary and external-system styles;
- color meanings;
- dashed versus solid edges;
- arrowheads and line widths;
- font size and alignment;
- page dimensions and grid spacing.

Reuse meanings, not accidental inconsistencies. Never restyle the reference page unless requested.

## XML safety

- Keep `mxCell` IDs unique within each page.
- Keep `parent`, `source`, and `target` references resolvable within the page.
- Preserve the page's root cells, normally IDs `0` and `1`.
- Put geometry in `<mxGeometry ... as="geometry"/>`.
- Use explicit `<Array as="points">` routing points sparingly; automatic orthogonal routing is preferable for simple paths.
- Escape every HTML label inside the XML attribute value.
- Preserve all non-target `<diagram>` elements byte-for-byte when the editing method permits it.

## Visual QA checklist

- [ ] Reading order is obvious without tracing every arrow.
- [ ] No labeled nodes overlap.
- [ ] No edge crosses a node or label.
- [ ] No edge has an unnecessary turn.
- [ ] Edge labels do not collide.
- [ ] Main, optional, and failure paths are visually distinct.
- [ ] Internal and external boundaries are clear.
- [ ] The page remains readable at fit-to-page zoom.
- [ ] The target page opens in draw.io or Obsidian.
- [ ] Non-target pages are unchanged.
