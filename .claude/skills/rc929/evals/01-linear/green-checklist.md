# GREEN checklist — 01-linear

## Mandatory self-review

- [x] Three-second: Start, main path, Success identifiable quickly
- [x] Path-tracing: success path clear (no failure path required)
- [x] Abstraction: peer nodes at one conceptual level
- [x] Label: action verbs, prefer 2–7 words
- [x] Metadata: no raw `path:line` on conceptual node faces; Impl map present
- [x] Geometry: no avoidable crossings / long returns / large empty waste
- [x] Semantic-style: path colors (process / success / …) consistent; legend if >3 categories

## Scenario-specific

- [x] Explicit Start and Success terminals
- [x] Four conceptual stages (receive → normalize → persist → acknowledge) or equivalent collapsed phases totaling ≤7 process nodes
- [x] LTR allowed and used only because the flow is short/linear
- [x] Tiny evidence badges (`S1`…) on stages; Impl map lists `S# → path:line`
- [x] `audit_drawio.py --strict` exits 0 on `golden.drawio`
