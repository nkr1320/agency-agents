# Qualification Protocol — Evidence Before Commercial Claims

## Objective

Determine whether a focused combination of Agency Agents instructions, limited ECC review practices and **one Playwright runner** improves reliable website QA versus a simpler single-agent workflow. This protocol is a **plan**; no benchmark runs have been executed in this PR.

## Setup prerequisites

- Create a private or local **controlled sample website** with documented intentional defects and ground-truth acceptance criteria. Use only owned/authorized test environments.
- Pin model, prompts, repository commit SHAs, browser/tooling versions, machine environment and access permissions.
- Fix the same run budget, test cases, output requirements and approval boundaries for each configuration.
- Keep evidence (trace, screenshots, logs, model usage and cost records) private and available to an independent reviewer.
- Use an isolated working directory and reset to the same starting state for each run.

## Compare

**Baseline A:** one coding/test agent with Playwright and the same site brief.  
**Candidate B:** six-role NKR process, selected Agency Agents role instructions and optional (not duplicate) ECC review practices.

Initial screening: **10 representative runs per configuration** distributed over multiple journeys and defect types. This sample size is operational screening, **not** a statistical reliability certification.

## Measurement ledger

| Measure | Definition |
| --- | --- |
| True findings | Independently verified defects matched to ground truth |
| Missed defects | Ground-truth defects not found |
| False positives | Reported findings that cannot be reproduced or violate no requirement |
| Fix success | Defect is actually resolved on retest without a known regression |
| Coverage | Executed agreed cases / total agreed cases; blocked and not-run are explicit |
| Evidence completeness | Proportion of findings with reproducible steps and suitable artifacts |
| Review quality | Confirmed issues identified by independent reviewer |
| Owner correction time | Minutes of substantive human fixes to agent output |
| Elapsed time | Wall-clock duration for a complete scoped run |
| Direct incremental spend | Actual token/API, browser, infrastructure and attributable costs |
| Total delivery time | Intake + testing + triage + fixes + review + reporting + rework |

Capture per-run values, median and ranges. Never infer results from the number of agents, test cases generated, or GitHub stars.

## Minimum release decision

Candidate B is eligible for **manual pilot consideration** only if it produces at least as reliable findings as baseline A, has no unreviewed security/privacy incident, does not hide regressions, and the owner determines its additional time/cost is justified. An authorized owner reviews every customer-facing report and any change to production.

**Fail/stop conditions:** missing consent, exposed credentials/customer data, inaccurate pass claims, repeated unreproducible bug reports, uncontrolled tool side effects, or fixes outside the agreed cap. Investigate, record and correct before expanding automation.

## Commercial validation (from the source assessment)

- After **30 relevant, individualized approaches with no meaningful replies**, change targeting/message.
- After **five qualified conversations without a paid pilot**, reconsider customer problem/proof/price.
- After **two pilots exceeding delivery-hour budget**, narrow or reprice the scope.
- If recurring value is absent, offer discrete project QA rather than a retainer.

**Spending ceiling before first paid pilot:** proposed incremental maximum INR 2,000, subject to owner approval. Do not purchase subscriptions or hardware automatically.

## Pilot exit checklist

- [ ] Written authorization and scope approved
- [ ] Known-defect baseline established
- [ ] Playwright adapter chosen and tested end-to-end
- [ ] Ten-run screening logged with real artifacts
- [ ] Evidence quality independently reviewed
- [ ] Service economics calculated from actual data
- [ ] Example customer report approved for external use
- [ ] First paid pilot accepted and payment confirmed
