# GREEN checklist — 03-recursive-refs

## Mandatory self-review

- [x] Three-second: Start, main path, Success identifiable quickly
- [x] Path-tracing: success path, one failure path, and recursive/repeated path without guessing
- [x] Abstraction: peer nodes at conceptual workflow level (no indexes / pending-record internals)
- [x] Label: action verbs / decisions as questions; prefer 2–7 words
- [x] Metadata: no raw `path:line` on conceptual node faces; Impl map lists S#/V#/R# → cites
- [x] Geometry: no long ordinary recursion return to Start; failure in gutter
- [x] Semantic-style: path colors consistent; legend present

## Scenario-specific

- [x] Conceptual spine matches the brief (attempt → proposal → validate → children → aggregate → global validate)
- [x] Recursion shown as collapsed subprocess, bounded loop, or re-entry callout
- [x] Invalid proposal ends at named failure; global validation fail ends at named failure (≤2 failure terminals)
- [x] Edge labels use Valid / Invalid / Pass / Fail / More children / Complete as appropriate — not Continue / Next / Return
- [x] ≤7 major process nodes (phase grouping / loop collapse allowed); ≤3 major decisions
- [x] `audit_drawio.py --strict` exits 0 on `golden.drawio`
