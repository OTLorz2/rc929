# rc929 Glanceable Diagrams — Implementation Results

**Date:** 2026-08-01  
**Spec:** `docs/superpowers/specs/2026-08-01-rc929-glanceable-conceptual-diagrams-design.md`  
**Plan:** `docs/superpowers/plans/2026-08-01-rc929-glanceable-conceptual-diagrams.md`

## Behavioral changes summary

1. **Diagram decisions gate** — agents must fix question, reader, abstraction, primary success path, and main vs supporting details before drawing.
2. **Conceptual-first Flows** — short verb labels + muted `S#` badges; full `path:line` moved to a same-page **Impl map**.
3. **Main-path chrome** — Start → spine → Success; failures in a gutter; TB-first for non-trivial flows; path-color semantics (process / decision / success / failure / data).
4. **Host/guest demoted** — nested isolation chrome only when the researched system truly has it.
5. **Audit** — warns on raw `path:line` inside conceptual content-node labels; supporting regions (Impl map / Summary / 要点 / legend) excluded from that check and from the content-node budget.
6. **Evals** — three RED→GREEN packs with golden `.drawio` files under `.claude/skills/rc929/evals/`.

## Test scenarios

| Pack | Path | Focus |
|------|------|--------|
| 01-linear | `evals/01-linear/` | Short LTR ingest spine |
| 02-validation-failure | `evals/02-validation-failure/` | Valid/Invalid + named failure |
| 03-recursive-refs | `evals/03-recursive-refs/` | Bounded recursion + Impl map cites |

## Before / after observations

### 01-linear

| Before (RED) | After (GREEN golden) |
|--------------|----------------------|
| Every node forced `behavior` + `path:line` | Stages show verb + `S#`; cites in Impl map |
| No required Start/Success | Explicit Start → … → Success |
| Role-actor colors | Neutral process + yellow persist + green success |

### 02-validation-failure

| Before (RED) | After (GREEN golden) |
|--------------|----------------------|
| Failure mixed into main spine | Invalid branch in side gutter to `End as failed` |
| Vague edge labels | Valid / Invalid |
| Decision buried under cites | `Proposal valid?` + `V1` badge |

### 03-recursive-refs

| Before (RED) | After (GREEN golden) |
|--------------|----------------------|
| Long ordinary recursion back-edge | Bounded `For each child` / execute recursively block (`R1`) |
| Paths inside node faces | Impl map only (`task_execution.py:…`) |
| Tangled return/failure | Two named failure terminals; Pass/Fail on global check |

**Improved recursive example:** `.claude/skills/rc929/evals/03-recursive-refs/golden.drawio` (open Overview, then **Recursive decomposition**).

## Verification run

```text
python3 scripts/test_audit_drawio_path_labels.py → OK
audit_drawio.py evals/01-linear/golden.drawio --strict → OK
audit_drawio.py evals/02-validation-failure/golden.drawio --strict → OK
audit_drawio.py evals/03-recursive-refs/golden.drawio --strict → OK
audit_drawio.py templates/research-starter.drawio --strict → OK
```

GREEN checklists marked complete after scoring the goldens.

## Remaining limitations

- `audit_drawio.py` cannot enforce the three-second or path-tracing tests; those remain agent self-review + golden review.
- Tiny `S#` badges still add minor visual noise versus perfectly clean nodes.
- Host/guest remains available and can be overused if isolation is misjudged.
- Overview 要点 / Summary Feynman still carry `path:line` by design (teaching/evidence), separate from conceptual node faces.
- Recursive golden collapses “create attempt” + “generate proposal” into one conceptual node to stay within the content-node budget; the Impl map still lists S1 and S2 separately.
