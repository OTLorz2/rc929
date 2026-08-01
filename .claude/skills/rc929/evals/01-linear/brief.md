# Scenario 01 — Linear workflow

**Question:** How does a received event move from intake to acknowledgement?

**Reader:** Onboarding engineer (first week on the service).

**Abstraction:** Conceptual workflow (not function-call graph).

**Stages to show:**

1. Receive event
2. Normalize payload
3. Persist record
4. Acknowledge

**Constraints:** Short, mostly linear. Left-to-right layout is allowed. Include Start and Success terminals. Evidence badges + Impl map required; no raw `path:line` on conceptual node faces.
