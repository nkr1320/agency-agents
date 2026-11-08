# NKR Website QA & Small-Fix Service — Pilot v1

**Status:** Proposed operating specification; **not** an installed service, completed benchmark, or customer delivery.  
**Source:** Owner-provided service assessment, 2026-11-08.  
**Owner control:** Work is performed only on explicitly authorized websites and repositories. No automatic client outreach, deployments, or purchases.

## Commercial hypothesis (validation prices, not established market prices)

**Paid pilot:** INR 4,000 for **one website**, **up to five agreed pages**, and **three agreed journeys** (e.g. navigation, enquiry and mobile menu). Deliver a prioritized reproducible-defect report, up to **two small fixes capped at three implementation hours total**, retest evidence, and handover. Anything exceeding the cap is excluded and quoted separately.

**Optional monthly tier:** starts at INR 6,000 for one website, weekly agreed journey checks, monthly evidence report, up to three hours of small fixes; no included emergency support, major features, or unlimited revisions.

**First commercial objective:** one accepted, paid INR 4,000 pilot. The long-term INR 10,000–30,000/month income goal is a target, not a forecast.

## Engineering principle

**A passed test requires observed execution and supporting evidence.** An agent role file, synthetic screenshot, generated test, or written plan does not establish that a client website has passed.

Use the following existing upstream materials as **references**, not as automatically installed or validated runtime workers:

| NKR responsibility | Existing candidate |
| --- | --- |
| Scope and owner approval | project-management/project-manager-senior.md |
| Test design and browser automation | testing/testing-test-automation-engineer.md |
| Reproducible evidence | testing/testing-evidence-collector.md |
| Minimal fixes | engineering/engineering-minimal-change-engineer.md |
| Independent code review | engineering/engineering-code-reviewer.md |
| Release / reporting | engineering/engineering-technical-writer.md |
| Additional E2E/security review | nkr1320/ECC: agents/e2e-runner.md, agents/security-reviewer.md |
| Browser tooling candidate | nkr1320/nkr-playwright-mcp |

**Important compatibility decision:** use **Playwright as the single pilot browser execution engine** unless benchmarking proves another adapter better. ECC's e2e-runner currently prefers Agent Browser with a Playwright fallback, so do not blindly combine the two runners. ECC's skills/hooks are opt-in and must be tested in an isolated environment to avoid duplicate actions.

## Workflow and hard gates

1. **Authorize / scope:** Record client identity, written authority to test, permitted domains/environments, pages, journeys, stack, test accounts, form destinations and restrictions. Identify what must not be touched.
2. **Baseline:** Capture URLs, viewport, timestamp, release SHA/version where available. Create explicit test cases and expected results; do not assume requirements.
3. **Execute tests:** Run only approved journeys using Playwright. Collect trace/log/screenshot when relevant, and distinguish pass/fail/blocked/not-run.
4. **Triage:** Record reproducible defects with actual steps, expected versus observed outcomes, severity, environment, attachments and uncertainty. No invented bugs.
5. **Fix, only if authorized:** Work in a dedicated branch. Two bounded fixes / three hours maximum under pilot terms. Avoid unrelated refactors; require test(s) and review.
6. **Independent review:** Review changed files and regression risk. Security-sensitive areas require explicit review. Any failed/blocked gate is recorded and escalated.
7. **Retest:** Reproduce baseline defect, verify corrected behavior, and rerun agreed critical journeys. Preserve before/after evidence.
8. **Customer approval / handover:** Owner approves the report and any deployment separately. Deliver a clearly scoped report of pass/fail/fixed/unverified items, source refs, exclusions and suggested next action.

**No direct writes to main and no automatic production deployments** from this pilot. No credentials in GitHub issues, PRs, screenshots, logs, prompts or test fixtures. Store sensitive artifacts in an access-controlled location with an agreed retention/deletion policy.

## Owner workflow

- Provide one **authorized** sample site and at most three journeys.
- Review the intake and test plan before any active run.
- Review proposed defects and the fix branch before a customer sees them.
- Authorize production release separately.
- Record actual customer payment and costs independently of estimates.

## What is not delivered by this PR

No active agents, browser tests, live dashboard, customer site scan, fix implementation, CI deployment, completed ten-run benchmark, or paid engagement. This PR is a reversible, non-executable pilot specification on a separate branch.

See [agent contracts](AGENT_CONTRACTS.md), [templates](TEMPLATES.md), and [qualification protocol](QUALIFICATION.md).
