# NKR Agency — Three Independent Delivery Teams

**State:** Architecture and role specifications in **draft pull requests**, not an installed or operational three-team agency.

| Team | Scope | Draft PR | Initial proof of capability |
| --- | --- | --- | --- |
| **Website** | Web design/build, website QA, agreed fixes, deployment preparation, maintenance | [PR #1](https://github.com/nkr1320/agency-agents/pull/1) | one authorized page + 3 real browser journeys with evidence; pilot INR 4,000 is QA-only |
| **AI Agents** | Agent design/build, RAG, tool integrations, evaluation, monitoring | [PR #2](https://github.com/nkr1320/agency-agents/pull/2) | one controlled assistant + grounded answer/tool evaluation suite |
| **App** | Android/iOS/cross-platform UX, engineering, platform tests, store preparation | [PR #3](https://github.com/nkr1320/agency-agents/pull/3) | one authorized Android or chosen-stack app change, built and tested on supported environment |

## One owner view, three isolated job pipelines

             NKR owner / authorized customer
                       |
               Request intake / approval
                       |
                Scope/type routing
                   /    |     \
             WEBSITE  AGENTS    APP
                |       |        |
          own tasks / Git branches / checklists / run logs
                   \    |     /
              Independent evidence review
                       |
              Explicit owner acceptance
                       |
              Approved delivery / support

**Candidate supervisor:** trial [NKR Orchestrator fork](https://github.com/nkr1320/nkr-agent-orchestrator) for engineering worktrees and status visibility; **not yet installed or proven to support all three job types**. Do not turn on Paperclip, OpenHands and Orchestrator simultaneously for a first test. Apps and agent workflows may require independent executors rather than relying exclusively on a coding orchestrator.

## Shared operational fields for a future dashboard

- customer/job ID and service line
- current phase and owner/agent
- permitted environments, authorization and permissions
- priority and dependency/blocked state
- branch/PR and actual build/evaluation artifacts
- test results: PASS / FAIL / BLOCKED / NOT_RUN (with source links)
- usage, elapsed time, budget cap and expected payment (actual only when recorded)
- security/privacy gate and responsible reviewer
- human approval for deployment/production tool writes/store release

**Never** mark a task complete solely because an agent sent a status message. Completion requires real artifacts and agreed acceptance conditions.

## Shared rules

1. Client and project source code stay isolated per customer and task.
2. Only authorized domains, apps, datasets and integrations are touched.
3. Project governance (protected main, reviews, CI, audit trails) overrides imported agent instructions.
4. Original Agency Agents, ECC and other upstream material retains credits/licenses. Customizations are additive and tracked.
5. Default least-privilege/read-only for external tools; separate human approval for writes, payment, outbound messages, releases and production DB changes.
6. No synthetic or mock data is misrepresented as live production behavior.
7. Agent instructions are not proof of tool capability; benchmark the minimal workflow against a simpler baseline.
8. Keep a cost and correction-time ledger; evaluate business viability from actual paying clients and delivered outcomes.

## Commercial sequencing

**Not a forced launch order for all three.** Website QA is the existing narrow paid pilot in PR #1. AI Agent Evaluation is a different bounded offer proposed at INR 10,000–25,000 depending on scope. Apps require per-project estimates because platform build/release effort varies. Scope, price and deliverables must be individually agreed with each client.

## Current verified status

- Source repositories and relevant specialist instructions exist in owner-controlled GitHub forks.
- Three draft service specifications have been authored under separate branches and PRs.
- No runtime agent roster, coordinator, browser/mobile evaluation, client connection, live dashboard, deployment or revenue has been verified.
