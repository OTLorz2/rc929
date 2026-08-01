# RED — how the pre-change skill fails (02-validation-failure)

Under the previous rc929 instructions, a diagram for this brief typically:

1. **Failure mixed into the main spine** — reject/fail nodes sit on the same horizontal chain as success, so the primary path is not obvious in three seconds.
2. **Vague or missing edge labels** — edges often unlabeled or use Continue / Next / Return.
3. **No named failure terminal** — failure trails off or rejoins ambiguously.
4. **Cites compete with the decision** — `Validate…` nodes carry long `path:line` ranges, burying the Valid/Invalid question.
5. **Role colors** — planner/executor coloring does not encode decision vs success vs failure.
