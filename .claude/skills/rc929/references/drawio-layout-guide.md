# Draw.io Layout Guide

Use this guide before drawing or substantially rearranging a page.

## Choose the diagram shape

| Question | Preferred layout |
|---|---|
| Short, mostly linear (≤6 stages, no branches/loops/failures) | Left-to-right flow |
| >6 stages, branches, loops, recursion, failure paths, or long labels | Top-to-bottom flow |
| Multi-party request/response | Horizontal participants with vertical sequence |
| Layered architecture | One lane or boundary per layer |
| Success and failure handling | Main path as the visual spine; failures in a reserved side/bottom gutter |

Do not mix runtime flow, package dependencies, deployment topology, and observability in one page.

A reader should not need to remember a node on the far left while inspecting a node on the far right — prefer TB when the diagram would become very wide.

## Main-path vocabulary (default)

Match `templates/research-starter.drawio` for conceptual workflows:

- **Explicit Start** and **Success / Complete** terminals on the primary spine.
- **Neutral process** nodes for ordinary stages.
- **Blue/purple decision or validation** nodes (questions/conditions).
- **Green** successful completion; **red/coral** terminal failure.
- **Yellow** stored state or external data when shown.
- **Failure gutter** (side or bottom) for secondary exits; dashed warm/red edges for failure.
- Pair color with shape and/or border; include a legend when more than three visual categories are used.

### Conditional host/guest nesting

Use outer host / inner dashed guest boundaries **only** when the researched system truly has isolation/sandbox boundaries worth showing. Do not force nested chrome onto ordinary linear or branched workflows.

## Recursion and loops

Do not represent recursion as an ordinary step plus a long return arrow to Start. Prefer:

1. Collapsed subprocess: “Execute child recursively”
2. Bounded loop: “For each child”
3. Re-entry callout: “Run this workflow for child at depth + 1”

Keep boundary, input, and return point explicit. Hide scheduling internals unless the page’s question is about that implementation.

## Complexity budget

- Conceptual targets: ≤7 major process nodes, ≤3 major decisions, ≤2 terminal failures.
- Treat about 10 content nodes as the normal maximum for one focused flow (split when exceeded).
- Split the page when a hub fans out to many unrelated concerns or when more than two edges must cross multiple lanes.
- Exclude titles, legends, Impl map blocks, annotations, and empty boundary rectangles from the conceptual process-node count.
- Allow peripheral context/data connectors beyond the target only when they remain short and do not cross the main flow.
- Prefer multiple understandable diagrams over one complete but unreadable diagram. Do not shrink text to cram.

## Place nodes before edges

1. Establish the page margin and primary reading direction.
2. Place the main-path spine first (Start → … → Success).
3. Place failure terminals in the reserved gutter.
4. Align peer nodes to a shared row or column.
5. Keep sibling boxes equal in size when their roles are comparable.
6. Reserve blank gutters for backward, error, or cross-lane connectors.
7. Keep external systems outside the relevant internal boundary.
8. Add edges only after the node grid is stable.

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
- Use dashed or lighter connectors only when they encode a stable meaning such as context, optional flow, or failure.

## Reuse an existing page's visual language

Inspect the reference page for:

- process versus decision versus terminal shapes;
- rounded versus square corners;
- boundary and external-system styles;
- path-color meanings;
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

- [ ] Start, main path, and outcome are obvious within about three seconds.
- [ ] No labeled nodes overlap.
- [ ] No edge crosses a node or label.
- [ ] No edge has an unnecessary turn.
- [ ] Edge labels do not collide.
- [ ] Main and failure paths are visually distinct.
- [ ] Recursion/loops use an approved pattern (not a long back-edge to Start).
- [ ] The page remains readable at fit-to-page zoom.
- [ ] The target page opens in draw.io or Obsidian.
- [ ] Non-target pages are unchanged.
