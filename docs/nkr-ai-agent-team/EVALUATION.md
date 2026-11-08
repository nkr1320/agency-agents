# AI Agent Evaluation + Customer Handover Templates

These are **blank forms**. Do not mark them completed without actual, linked test results. Store client-specific records in a private authorized workspace.

## 1. Engagement intake

| Field | Required information |
| --- | --- |
| Customer, authorized agent/system and job ID | |
| Deployment environment and version/commit | |
| Expected tasks and supported languages | |
| Disallowed tasks and required human handoffs | |
| Data source inventory, ownership and classification | |
| Allowed external tools + read/write permissions | |
| Evaluation dataset provenance and consent | |
| Sample size, distributions and acceptance thresholds | |
| Model/tool usage budget and scope ceiling | |
| Critical privacy, reliability and legal boundaries | |
| Human approver and rollback owner | |

## 2. Test-case ledger

- Case ID / category:
- Expected supported behavior and independent reference:
- Prompt/input (safe/redacted):
- Allowed data/tools for this case:
- Model/prompt/tool versions:
- Observed answer/tool calls **from an actual run**:
- Human review / objective scorer rationale:
- Outcome: PASS / FAIL / BLOCKED / NOT_RUN / INCONCLUSIVE
- Citation or tool evidence path (private):
- Latency, usage and measured cost:
- Issue ID, severity, remediation and retest status:

## 3. Report

# AI Agent Evaluation — [customer] — [date]
- Authorized system, model, versions and data scope:
- Test set design and limitations:
- Executed N, pass N, fail N, blocked N, inconclusive N, not-run N:
- Grounded response errors (evidence-linked):
- RAG retrieval and citation failures (if applicable):
- Tool permission/safety failures:
- Prompt-injection and adversarial boundaries assessed:
- Actual latency/usage/spend:
- Fixes made and verified:
- Residual risks and untested scenarios:
- Proposed go/no-go:
- Reviewer, approver and date:

Never claim full penetration testing or guaranteed safe outputs on the basis of generic agent instructions or a single benchmark.

## 4. Qualification before selling

Run a controlled initial suite with documented ground truth (suggested **10 screening runs per configuration**, not statistically conclusive) comparing a single-agent + tests baseline against role-coordinated execution. Track correct tasks, incorrect tasks, unsupported claims, failed tools, permission overreach, tokens, direct cost, human fixes and elapsed time.

Stage-gate: actual safe execution + independently checked report + observed cost within approved budget. **No live tests or customers are claimed by this document.**
