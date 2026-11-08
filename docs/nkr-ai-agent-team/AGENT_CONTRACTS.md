# AI Agent Team — Role and Execution Contracts

**Common inputs:** approved purpose and audience, customer constraints, supported channels, representative examples, data classification, tool permissions, model budget, expected refusal/handoff rules, and job ID.  
**Common outputs:** versioned artifacts with input references, execution evidence, failure notes, execution/cost measurements and reviewer verdict.  
**States:** NOT_STARTED -> SCOPED -> BUILDING -> EVALUATING -> REVIEW_REQUIRED -> APPROVED -> RELEASED; add BLOCKED / FAILED and reasons at any point. APPROVED and RELEASED require separate authorized actions.

| Owner | Work artifact | Pass / block criterion |
| --- | --- | --- |
| Intake lead | scope.md, acceptance.md, data-permissions.md | use-case, allowed tools and success criteria signed off |
| Architect | architecture.md, threat-model.md, fallback.md | single source of truth, bounded tool graph, human escalation |
| Builder | prompts/ and service source on feature branch | unit/integration tests and runnable staging integration |
| Evaluation lead | golden_cases.jsonl, runs, metrics.md | independent factual/task checks, observed not simulated results |
| Security reviewer | review.md with findings/mitigations | no unreviewed high-risk tool/data issues |
| Delivery lead | handbook.md, release signoff, monitoring plan | known limits, cost cap, rollback and support owner |

Only roles needed for current scope are activated. Architect and test designer may overlap, while integration depends on approved interfaces; evaluation of a candidate is independent of its implementer.

## Tool contracts

For each tool record: name/version, purpose, allowed environments, input/output schema, auth principal, read/write privilege, idempotency, rate limit, retries/timeouts, failure behavior, logging/redaction and escalation owner.

Treat ambiguous tool outcomes as **UNKNOWN** rather than guessing success. Idempotent retry design is mandatory for any eventual authorized write tool.

## Agent evaluation dimensions

- **Task success:** verified against ground truth and acceptance rules.
- **Groundedness:** statements have adequate source support; fabricated citations are failures.
- **Tool reliability:** correct tool selection, valid arguments, response handling and clear uncertainty.
- **Safety/privacy:** correct permissions, prompt-injection resistance, no secret/PII leaks.
- **RAG quality (when relevant):** retrieval relevance and answer support, including missing-info abstention.
- **Robustness:** paraphrases, empty/error inputs, tool timeouts, unavailable downstream services.
- **Operations:** measured latency, tokens/usage, costs per successful task and human corrections.

Evaluate the baseline single-agent configuration against the multi-agent configuration on the *same* representative cases. Define numerical release thresholds **with the customer** before running the evaluation; do not invent pass rates.

## Recovery and approvals

If external data contradicts instructions, tools request unapproved permissions, eval artifacts are missing, or budget is exceeded: suspend workflow, retain redacted evidence, and request authorized triage. Final permission to act in external business systems is never delegated implicitly from a prompt.
