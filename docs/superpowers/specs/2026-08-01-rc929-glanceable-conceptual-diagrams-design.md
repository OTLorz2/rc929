# rc929 Glanceable Conceptual Diagrams Design

**Date:** 2026-08-01  
**Status:** Approved for implementation planning  
**Branch context:** `drawio`  
**Skill trees to keep in sync:** `.claude/skills/rc929/` (repo) and `~/.agents/skills/rc929/`

## Problem

rc929 currently produces diagrams that mirror source-code execution more than they teach a workflow. Instructions that drive this include:

- Two-line Flow node labels: behavior + `path:line` (`SKILL.md`, `drawio-content-guide.md`, `drawio-editing-rules.md`)
- Prefer-rich host/guest/role-color chrome as the default Flow vocabulary
- Left-to-right as the preferred layout for pipelines
- Accuracy framed as cites competing on the node face with the workflow label

Observed failure modes:

- No visually dominant main path
- Business flow, control flow, implementation details, validation, persistence, and recursion mixed at one level
- Source paths/lines competing with node labels
- Recursion as a long ordinary back-edge
- Success, failure, loop, and return paths tangled
- Colors/shapes without stable path semantics
- Excessive width and unused space
- Inconsistent node granularity and too many words per node
- No obvious start, completion, or failure outcome

## Goals

1. Conceptual Flow diagrams are understandable in about three seconds (start → main path → outcome).
2. Evidence remains mandatory, but visually subordinate: tiny `S1`/`V1`/`R1` badges on nodes plus a same-page implementation mapping table.
3. One primary abstraction level per conceptual diagram; implementation details are not peer nodes on that diagram.
4. The full skill package stays internally consistent (`SKILL.md`, content/layout/editing guides, starter, checklist, evals, cheap audit checks).
5. Claim success only after three golden scenarios pass a RED → GREEN → REFACTOR cycle.

## Non-goals

- Changing locator/analyzer research semantics (still accuracy-first, document what IS, fresh research).
- Dual HTML/Markdown research reports on disk.
- Turning `audit_drawio.py` into a full visual-QA oracle for the three-second or path-tracing tests.
- Keeping role-actor colors or prefer-rich host/guest nesting as the default Flow chrome.
- Adding unrelated aesthetic guidance.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Flow default | Conceptual-first |
| Implementation mapping | Same Flow page, subordinate region |
| Color/shape semantics | Path semantics (process / decision / success / failure / data) |
| Package scope | Full package update |
| Evidence IDs on nodes | Tiny subordinate badges (`S1`, …) |
| Eval method | Spec + golden `.drawio` fixtures under `evals/` |
| Flow chrome default | Main-path layout; host/guest only when isolation is real |
| Update strategy | Approach 1: Diagram-decisions gate + rewrite conflicting rules |

## Architecture

Research method unchanged through cross-check. New gate and authoring contract:

```text
Intake → Plan → Locate → Analyze → Cross-check
       → Diagram decisions (mandatory gate)
       → Author .drawio (conceptual Flow + same-page impl map)
       → Mandatory self-review
       → Audit (structure + cheap label checks)
       → Handoff
```

### Diagram decisions (before any drawing)

For each Flow page, fix in working notes (not Overview metadata):

1. Single question the diagram answers
2. Intended reader
3. Abstraction level (conceptual workflow vs implementation mapping)
4. Primary success path (explicit start → stages → success)
5. What belongs on the main diagram vs supporting material (impl map, focused sub-page)

Do not author nodes until these five are clear.

### Page model

| Page | Role |
|------|------|
| Overview | Title + Summary (analogy → Feynman what/how → First-Principle why) + 要点 (prose then cite line) + 待验证 — purpose unchanged |
| Flow (per concern) | Conceptual main-path diagram + Impl map region + Summary |
| Optional focused Flow | Only when complexity limits force a split |

### Per Flow regions

1. Title  
2. Conceptual diagram (dominant)  
3. Impl map table (`S1 → path:line`)  
4. Summary (three unlabeled paragraphs; Feynman may still use short cites)  
5. Legend when more than three visual categories are used  

## Diagram rules (mandatory)

### Abstraction

One primary abstraction level per conceptual diagram. Do not place items from different categories below as peer nodes on the same conceptual diagram (unless that page’s stated question is explicitly about implementation details):

- Business / workflow stages
- Function calls
- Loop mechanics
- Database writes
- Validation rule lists
- Source-code locations
- Fine-grained state transitions

When both conceptual behavior and implementation mapping are needed: conceptual workflow is the Flow diagram; implementation mapping is the same-page subordinate table. If the table would overflow the page, add a focused implementation-mapping Flow page for that concern (exception only).

### Main path

Must be identifiable within about three seconds:

- Explicit Start
- One consistent reading direction
- Most visually direct route
- Explicit Success / Complete terminal
- Not interrupted by secondary branches occupying the spine

Failure, retry, rollback, and exceptional exits are visually secondary (gutter) and must terminate in a named failure state or clearly rejoin.

### Layout

Prefer top-to-bottom when any of these apply: more than six major stages, multiple branches, loops, recursion, failure paths, long labels.

Use left-to-right only for short, mostly linear processes.

Group related stages into labeled phases or subgraphs when helpful.

Avoid: long arrows crossing the whole diagram, lines behind nodes, multiple crossings, large empty regions from poor placement, very wide diagrams that force left↔right scanning.

### Nodes

Each node is one meaningful action, state, or decision at the chosen level.

Labels:

- Begin with a clear action verb when representing an operation
- Prefer 2–7 words
- No implementation explanations, full paths, or line numbers
- No combining unrelated operations
- Tiny muted badge: `S1` / `V1` / `R1` (etc.)

Decision nodes are questions or conditions (`Proposal valid?`, `More children?`).

### Edges

Outgoing paths from decisions are labeled with concise outcomes: Valid / Invalid / Yes / No / More children / Complete / Failed.

Forbidden vague labels: Continue / Process / Next / Return.

### Recursion and loops

Do not represent recursion as an ordinary step plus a long return arrow to the beginning.

Allowed patterns:

1. Collapsed subprocess: “Execute child recursively”
2. Bounded loop: “For each child”
3. Re-entry callout: “Run this workflow for child at depth + 1”

Boundary, input, and return point must be explicit. Do not expose internal iteration mechanics (indexes, pending-record traversal) unless the diagram’s question is about scheduling implementation.

### Colors and shapes (path semantics)

| Category | Meaning |
|----------|---------|
| Neutral | Ordinary processing |
| Blue/purple | Decision or validation |
| Green | Successful completion |
| Red/coral | Terminal failure |
| Yellow | Stored state or external data |

Pair color with shape and/or border style. Include a legend when more than three visual categories are used. Avoid decorative color with no meaning.

Host/guest nested chrome is allowed only when the researched system truly has isolation/sandbox boundaries worth showing.

### Complexity budget (conceptual)

Normally no more than:

- 7 major process nodes
- 3 major decision nodes
- 2 terminal failure outcomes

When exceeded: group into phases, collapse detail, or split into focused diagrams. Do not shrink text to fit everything into one image.

## Rules to remove or demote

These conflict with the design and must be deleted or rewritten, not layered:

| Old instruction | Action |
|-----------------|--------|
| Node label line 2 = `path:line` | Remove; replace with badge + Impl map |
| Prefer-rich host/guest as default | Demote to conditional |
| LTR preferred for pipelines | Replace with TB-first for non-trivial flows; LTR only when short/linear |
| Role-actor color families as default legend | Replace with path semantics |
| “File/symbol-only titles → rewrite as behavior + cite (two lines)” failure mode | Rewrite to behavior + badge; cite in Impl map |

Keep: accuracy-first evidence, Overview 要点 cite-on-next-line, Summary three-paragraph teaching, one `.drawio` deliverable, no research `.md`/`.html`, `audit_drawio.py` before handoff.

## Package changes

| Path | Change |
|------|--------|
| `SKILL.md` | Diagram-decisions gate; conceptual-first synthesize/author; new checklist and failure modes; frontmatter description mentions glanceable conceptual flows + subordinate evidence |
| `references/drawio-content-guide.md` | Node labels, Impl map region, citation placement |
| `references/drawio-layout-guide.md` | TB-first, main-path chrome, path-color semantics, conditional host/guest |
| `references/drawio-editing-rules.md` | Align node/label/audit expectations |
| `templates/research-starter.drawio` | Sample Flow: Start → spine → Success, failure gutter, badges, Impl map, path-color swatches |
| `scripts/audit_drawio.py` | Cheap checks only (e.g. flag full `path/…:digits` inside conceptual node labels); retain geometry/structure checks |
| `evals/` (new, under the skill root) | Three scenario packs for RED → GREEN → REFACTOR |

Frontmatter: preserve valid YAML; keep `name: rc929`; update `description` for triggering (glanceable conceptual research diagrams) without dumping the whole process into the description.

Skill-authoring constraints:

- Reusable and project-independent
- Mandatory rules distinguishable from recommendations
- Avoid duplicating the same rule across sections
- Prefer enforceable checks over vague “make it clean” advice

## Testing (RED → GREEN → REFACTOR)

### Scenario packs

Each pack under `evals/` includes: scenario brief, RED failure notes (how the *current* skill fails), GREEN checklist, and a golden `.drawio`.

1. **Linear** — short mostly-linear workflow; LTR allowed; clear Start and Success.
2. **Validation + failure** — decision with labeled Valid/Invalid; named failure terminal; main path unblocked.
3. **Recursive + refs** — recursive decomposition-style spine; recursion collapsed or bounded; all `path:line` only in Impl map; matches the expected conceptual structure below.

### Expected conceptual spine (scenario 3)

```text
Start
→ Create execution attempt
→ Generate local decomposition proposal
→ Validate proposal
    Invalid → Block affected sibling work → End as failed
    Valid → Save child plan
         → For each child:
              → Execute child recursively at depth + 1
              → Collect child result
         → Aggregate child results
         → Run root-level global validation
              Pass → End as successful
              Fail → End as failed
```

Source files and line ranges appear only in the Impl map, not inside conceptual node labels.

### Mandatory self-review (agent + eval scoring)

1. **Three-second test** — start, main path, outcome identifiable quickly  
2. **Path-tracing test** — success path, one failure path, one recursive/repeated path without guessing  
3. **Abstraction test** — peer nodes at roughly the same level  
4. **Label test** — short, action-oriented  
5. **Metadata test** — paths/lines/implementation details outside conceptual node faces  
6. **Geometry test** — no avoidable crossings, long return arrows, or large empty waste  
7. **Semantic-style test** — every color/shape has a consistent meaning  

### Success gate

Do not claim the skill update succeeded until all three scenarios pass GREEN under the revised skill, and REFACTOR has removed redundant, vague, or conflicting instructions.

## Handoff

Chat handoff (still no research `.md`/`.html`):

1. Path to the `.drawio` file  
2. Which page to open first  
3. 2–3 sentence factual summary  
4. Chosen abstraction level (brief) and that the Impl map is on the Flow page  
5. Any 待验证 items  
6. That `audit_drawio.py` ran and any preview limitations  

## Implementation-phase deliverables

When the plan is executed, produce:

1. Updated `SKILL.md` (and synced package files)  
2. Concise summary of behavioral changes  
3. The three test scenarios used  
4. Before-and-after observations per scenario  
5. One improved example from the recursive decomposition workflow (golden or generated under the new skill)  
6. Remaining limitations of the skill  

## Remaining limitations (accepted)

- `audit_drawio.py` cannot fully enforce three-second comprehensibility or recursion-pattern quality; those stay agent self-review + golden eval review.
- Tiny badges still add a little visual noise versus perfectly clean nodes.
- Host/guest remains available and may be overused if the agent misjudges “real isolation.”
- Overview 要点 and Summary Feynman paragraphs still carry `path:line` cites by design (teaching/evidence), which is separate from conceptual node faces.

## Out of scope for this change

- Locator/analyzer reference rewrites beyond citation output still feeding the Impl map
- Changing default output path `thoughts/research/<date>-research-<topic>.drawio`
- Reintroducing Mermaid or HTML research reports
