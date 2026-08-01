# Scenario 03 — Recursive workflow with source references

**Question:** How does recursive decomposition execute a plan from attempt through global validation?

**Reader:** Engineer learning the control flow (not reading the scheduler internals yet).

**Abstraction:** Conceptual workflow. Implementation mapping is subordinate.

**Required conceptual spine:**

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

**Impl map (example ranges — stable fakes for the golden):**

```text
S1 → task_execution.py:175-180
S2 → task_execution.py:200-220
V1 → task_execution.py:240-260
S3 → task_execution.py:278-311
R1 → task_execution.py:320-350
S4 → task_execution.py:360-390
V2 → task_execution.py:477-510
```

**Constraints:** Do not draw recursion as a long ordinary arrow back to Start. Use collapsed subprocess / bounded loop / re-entry callout. No raw paths on conceptual node faces.
