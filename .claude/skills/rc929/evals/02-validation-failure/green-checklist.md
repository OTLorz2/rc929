# GREEN checklist — 02-validation-failure

## Mandatory self-review

- [ ] Three-second: Start, main path, Success identifiable quickly
- [ ] Path-tracing: success path and one failure path without guessing
- [ ] Abstraction: peer nodes at one conceptual level
- [ ] Label: action verbs / decision as question
- [ ] Metadata: no raw `path:line` on conceptual node faces; Impl map present
- [ ] Geometry: failure in gutter; no long return arrow through the spine
- [ ] Semantic-style: decision blue/purple; success green; failure red/coral

## Scenario-specific

- [ ] Decision node phrased as a question (e.g. `Proposal valid?`)
- [ ] Outgoing edges labeled Valid and Invalid
- [ ] Named failure terminal (e.g. `End as failed`)
- [ ] ≤3 major decision nodes; ≤2 terminal failure outcomes
- [ ] Main success path not interrupted by the failure branch
- [ ] `audit_drawio.py --strict` exits 0 on `golden.drawio`
