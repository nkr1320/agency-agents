# Job Templates — Copy Into a Private Customer Workspace

Never fill these templates with imaginary execution results. **Client-specific data and evidence must not be committed to this public repository.**

## 1. Intake / authorization

| Field | Required value |
| --- | --- |
| Job ID / customer contact | |
| Written authorization / date | |
| Allowed hostnames and environment | |
| Explicitly prohibited URLs and actions | |
| Up to five named pages | |
| Three journeys and expected outcomes | |
| Source repository / stack / environment version | |
| Test accounts and permitted synthetic data | |
| Form/SMS/email/payment sandbox and side effects | |
| Client-approved evidence handling and retention | |
| Browser and viewport requirements | |
| Fix access and branch naming | |
| Definition of a small fix / hours cap | |
| Owner approval / signature | |

If authorization, environment or behavior is uncertain, **BLOCK** execution and ask the client for details.

## 2. Test case

- Job ID / case ID:
- Page / journey:
- Preconditions / approved test data:
- Steps:
- Expected result (client requirement or source):
- Actual result **after execution**:
- Status: NOT_RUN / PASS / FAIL / BLOCKED
- Execution timestamp/timezone:
- Browser version / viewport / application version:
- Evidence path and SHA-256 (if available):
- Notes and uncertainty:

## 3. Reproducible defect

- Defect ID and case ID:
- Short title:
- Business impact and severity **with rationale**:
- Source/requirement:
- Reproduction steps:
- Expected / observed behavior:
- Reproduction count (X/Y actual attempts):
- Environment and URL:
- Screenshot / trace / console/network evidence:
- Sensitive data redacted?:
- Scope classification (included fix / separately quoted / not reproducible):
- Triage approval:
- Resolution PR/commit (if fixed):
- Retest result and evidence:

A screenshot is suitable for visible UI state, but does not prove backend persistence or successful form submission. Include assertions, response checks or other observed evidence when testing behavior.

## 4. Handover report

# Website QA report — [customer] — [date]
- Authorization and approved scope:
- Release/version/environment:
- Executed cases: N (PASS: N / FAIL: N / BLOCKED: N / NOT_RUN: N)
- Confirmed defects: N (severity and risk):
- Fixes approved / delivered / excluded:
- Source PRs, commit IDs and review approvals:
- Retest outcome and remaining regression risks:
- Evidence index (private, access-limited):
- Unverified behavior, excluded pages and limitations:
- Recommended next actions:
- Customer acknowledgement / owner release approval:

Do **not** use "100% tested" or "secure" unless those assertions are strictly supported and scoped.

## 5. Delivery economics (actuals, not guesses)

| Metric | Value |
| --- | --- |
| Agreed customer price | |
| Cash collected and date | |
| Direct API/model usage charges | |
| Attributable subscription cost | |
| Hosting/platform/test service charges | |
| Outreach + meetings time | |
| QA and reporting hours | |
| Fix and review hours | |
| Rework hours | |
| Refunds/credits | |
| Remaining cash before tax / own labor valuation | |
| Effective amount per total owner hour | |

## 6. Outreach tracking (consented and lawful)

Record agency, reason for relevance, contact date, response, qualified conversation, offer, result and follow-up. Do not mark drafts as sent or replies as received without actual communication evidence.
