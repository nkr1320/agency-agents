# Enterprise Operations, Metrics and Delivery Assurance

## Shared operating cadence

- Daily or per job: queue/blocked work, current risk, deadlines, incidents and cost limits.
- Weekly: customer commitments, defects/rework, acceptance evidence, skill quality, production alerts and hiring load.
- Monthly: revenue collected, gross margin, project profitability, security and access changes, incident trend and change failures.
- Quarterly: strategic service-line review, audit findings, disaster-recovery tests, staff learning paths, vendor review and risk appetite.

## Minimum job identity and evidence

Job ID / client ID / business unit / signed authority / risk tier / committed scope / DRI / source branch and SHA / versioned artifact IDs / test run / reviewer identity / client acceptance / release approver / incident and cost ledger.

No agent may mark TESTED from generated test code. No dashboard may mark DELIVERED from a PR alone. Use actual backend GitHub checks, test reporters and approval events. Unobserved = **NOT_RUN/UNKNOWN**.

## Metrics — measure value and reliability, not vanity

**Enterprise:** cash collected, contribution margin, on-time accepted delivery, client retention, warranty/rework hours, cost per job, security incidents, unplanned work and capacity utilization.

**Website:** lead time, actual customer journey pass rate, escaped defects, uptime, change fail rate, recovery time, accessibility issues resolved; select applicable DORA metrics.

**AI Agents:** verified task success by critical journey, factual support/grounding, unsafe tool invocation rate, incomplete handoff rate, retrieval failure rate, p95 response time, cost per successful task, drift and incident recurrence.

**Apps:** crash-free sessions, ANR, device coverage by user distribution, critical flow success, permission-denial UX, store rejection and release regression rate.

All percentages require a numerator, denominator, time window, data source and exclusion notes. There is **no earned revenue or deployed reliability figure** in this proposal.

## Support and incident ownership

Support requests become tickets with customer, severity, expected response, owner and affected release. P0 business-wide outage or data breach triggers immediate containment; lower severities follow agreed customer SLAs. A paid maintenance contract must define response windows, included hours, planned updates, backup/recovery ownership and end-of-contract handover.

**Cross-division handoffs:** If an agent change affects a mobile app and website, create a tracked dependency and joint release plan; do not silently deploy API-breaking changes. API schema/backward compatibility, auth, data migration and client rollback must be reviewed.

## Cost & sustainability controls

Per job record budget, fixed/variable subscriptions, token/API usage, cloud/test usage, owner hours, support hours, chargeable scope and actual receipts. Start small; do not commit to new subscriptions/hardware based on an unvalidated revenue forecast. Halt or escalate when a cost cap is reached.

## Program milestones

M1: one evidence-backed full lifecycle demo **per division**, approved in a private/controlled environment.  
M2: benchmark 10 runs of representative work per division against single-agent baseline.  
M3: first accepted paid customer delivery with actual margin tracked.  
M4: repeatable service runbooks and reliable maintainer rotation.  
M5: enterprise control plane proof (RBAC, audit, queue, budget, release gates).  
M6: formal independent review of security and risk program before expansion.

These are future acceptance criteria, not milestones already reached.
