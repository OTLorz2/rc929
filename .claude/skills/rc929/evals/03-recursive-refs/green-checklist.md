# GREEN checklist — 03-recursive-refs

## Mandatory self-review

- [ ] Three-second: Start, main path, Success identifiable quickly
- [ ] Path-tracing: success path, one failure path, and recursive/repeated path without guessing
- [ ] Abstraction: peer nodes at conceptual workflow level (no indexes / pending-record internals)
- [ ] Label: action verbs / decisions as questions; prefer 2–7 words
- [ ] Metadata: no raw `path:line` on conceptual node faces; Impl map lists S#/V#/R# → cites
- [ ] Geometry: no long ordinary recursion return to Start; failure in gutter
- [ ] Semantic-style: path colors consistent; legend present

## Scenario-specific

- [ ] Conceptual spine matches the brief (attempt → proposal → validate → children → aggregate → global validate)
- [ ] Recursion shown as collapsed subprocess, bounded loop, or re-entry callout
- [ ] Invalid proposal ends at named failure; global validation fail ends at named failure (≤2 failure terminals)
- [ ] Edge labels use Valid / Invalid / Pass / Fail / More children / Complete as appropriate — not Continue / Next / Return
- [ ] ≤7 major process nodes (phase grouping / loop collapse allowed); ≤3 major decisions
- [ ] `audit_drawio.py --strict` exits 0 on `golden.drawio`
