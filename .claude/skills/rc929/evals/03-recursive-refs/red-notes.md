# RED — how the pre-change skill fails (03-recursive-refs)

Under the previous rc929 instructions, a diagram for this brief typically:

1. **Recursion as a long ordinary back-edge** — an edge from “execute child” arcs across the page to the first stage, visually tangled with success/failure.
2. **Source paths inside nodes** — two-line labels put `task_execution.py:278–311` on the face, competing with the verb.
3. **Mixed abstraction** — business stages peer with loop indexes, pending-record traversal, and DB writes.
4. **Tangled success / failure / return** — global validation failure, proposal invalid, and recursive return share the same visual weight and routing.
5. **No subordinate Impl map** — cites live only on nodes or in Summary prose, so the conceptual spine cannot stay clean.
