# GREEN checklist — 02-validation-failure

## Mandatory self-review

- [x] Three-second: Start, main path, Success identifiable quickly
- [x] Path-tracing: success path and one failure path without guessing
- [x] Abstraction: peer nodes at one conceptual level
- [x] Label: action verbs / decision as question
- [x] Metadata: no raw `path:line` on conceptual node faces; Impl map present
- [x] Geometry: failure in gutter; no long return arrow through the spine
- [x] Semantic-style: decision blue/purple; success green; failure red/coral

## Scenario-specific

- [x] Decision node phrased as a question (e.g. `Proposal valid?`)
- [x] Outgoing edges labeled Valid and Invalid
- [x] Named failure terminal (e.g. `End as failed`)
- [x] ≤3 major decision nodes; ≤2 terminal failure outcomes
- [x] Main success path not interrupted by the failure branch
- [x] `audit_drawio.py --strict` exits 0 on `golden.drawio`
