# Scenario 02 — Validation and failure branches

**Question:** What happens when a proposal is validated before apply?

**Reader:** Engineer debugging why work stops after validation.

**Abstraction:** Conceptual workflow with one major decision.

**Stages to show:**

1. Create proposal
2. Validate proposal?
3. If Invalid → reject proposal → End as failed
4. If Valid → apply proposal → End as successful

**Constraints:** Top-to-bottom preferred. Main success path must stay visually dominant. Failure in a secondary gutter with a named terminal. Edge labels Valid / Invalid (not Continue / Next). Badges + Impl map; no raw paths on conceptual nodes.
