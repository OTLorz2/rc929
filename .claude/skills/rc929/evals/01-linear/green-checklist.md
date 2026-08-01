# GREEN checklist — 01-linear

## Mandatory self-review

- [ ] Three-second: Start, main path, Success identifiable quickly
- [ ] Path-tracing: success path clear (no failure path required)
- [ ] Abstraction: peer nodes at one conceptual level
- [ ] Label: action verbs, prefer 2–7 words
- [ ] Metadata: no raw `path:line` on conceptual node faces; Impl map present
- [ ] Geometry: no avoidable crossings / long returns / large empty waste
- [ ] Semantic-style: path colors (process / success / …) consistent; legend if >3 categories

## Scenario-specific

- [ ] Explicit Start and Success terminals
- [ ] Four conceptual stages (receive → normalize → persist → acknowledge) or equivalent collapsed phases totaling ≤7 process nodes
- [ ] LTR allowed and used only because the flow is short/linear
- [ ] Tiny evidence badges (`S1`…) on stages; Impl map lists `S# → path:line`
- [ ] `audit_drawio.py --strict` exits 0 on `golden.drawio`
