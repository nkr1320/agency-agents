# NKR Enterprise Agency OS — Federated Three-Division Operating System

**State:** Version 1 design and machine-readable configuration proposal. Not a running multi-agent platform; no MNC certification or real employee organization is claimed. This proposal is isolated in a draft PR.

## Mission

Operate **three independent delivery divisions** under one scalable company operating model:
- **Website Division**: engineering, design, QA, web releases, support.
- **AI Agent Division**: assistant/RAG/tool engineering, independent evals, safe runtime, support.
- **App Division**: Android/iOS/cross-platform products, real device QA, signing/store operations, support.

One **enterprise control plane** provides identity/access, policy, project/financial oversight, skills registry, observability, risk decisions, audit and governance. Each division owns **its own delivery workflow**, staff/agent responsibilities, backlogs, evidence, on-call operations and customer acceptance.

## Organization, not agent inflation

An "agent" is a capability-enabled worker with **defined task, owner, input, permission, budget, output, expiry and proof**. A Markdown role is not a deployed agent. New roles are activated when workload and measured quality justify them. No default 50- or 1,000-agent launch; start with **one or two controlled concurrent workers per job**.

Shared executive and functional responsibilities (assign named humans when capacity grows):
- Executive/Finance/Sales/Client Delivery: contracts, budget, legal entity, hiring, pricing and customer commitments.
- CTO/Platform/Architecture: standards, paved roads, developer productivity and availability.
- CISO/Security/Privacy: policies, threat modeling, incident escalation, independent security gates.
- Quality Engineering: test strategy, artifact truth, independent release verification.
- Compliance/Legal/HR: vendor reviews, data contracts, jurisdiction rules and personnel management.
- Divisional heads: delivery outcome, budget, hiring plan and staffing.

People can hold several responsibilities in a small company, **but a high-risk deployment never receives fictitious independent approvals**. Obtain an outside reviewer or keep it blocked until segregation is possible.

## Governance by design

Every task and release is traceable: **approved requirement -> assigned accountable owner -> isolated branch/worktree -> artifact -> executed tests -> independent review -> approval -> controlled release -> monitoring -> maintenance -> postmortem/change request**.

Mandatory cross-division controls live in [governance](GOVERNANCE.md). Domain pipelines live in [lifecycles](DIVISIONS.md) and machine-readable manifests: 
- [website manifest](../../nkr-agency/teams/website.json)
- [agent manifest](../../nkr-agency/teams/agents.json)
- [app manifest](../../nkr-agency/teams/app.json)
- [governance controls](../../nkr-agency/policies/governance.json)
- [skills registry](../../nkr-agency/skills/registry.json)

## Roadmap, not a claim of implementation

**OS-0: policy-as-code skeleton (this PR)** — versioned team manifests + static validation tests and draft org documents.  
**OS-1: pilot control plane** — read-only dashboard using real GitHub and run events; role registries; cost ledgers; approval audit.  
**OS-2: controlled execution** — single coordinator, sandboxed tasks, isolated branches, per-job budgets, Playwright / app / agent eval workers, independent gates.  
**OS-3: multiple client programs** — RBAC, project and organization isolation, incident queue, contracts and billing, monitored scheduled maintenance.  
**OS-4: enterprise readiness** — SSO, asset inventory, secrets management, policy enforcement, disaster recovery, third-party risk management, audit evidence and verified controls.  
**OS-5: federation** — regional units, autonomous business lines under central policy distribution, per-tenant limits, replicated services, sub-organizations and regulated data residency.

**Do not skip stages.** The GitHub check in this PR validates manifest structure, **not** production readiness or effectiveness of operational controls.

## Relationship to prior work

This governance PR is additive and independent of:
- [PR #1 — Website](https://github.com/nkr1320/agency-agents/pull/1)
- [PR #2 — AI Agents](https://github.com/nkr1320/agency-agents/pull/2)
- [PR #3 — App](https://github.com/nkr1320/agency-agents/pull/3)

Existing BWN, VioAI, PrintSize, Green Revolution and other project-specific rules **remain authoritative** in their own repositories; nothing here grants access to or changes those projects. All imported open-source licenses and notices remain intact.

## References

Design influences, not certifications: [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework); [NIST GenAI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence); [OWASP ASVS](https://asvs.owasp.org/); [OWASP MASVS](https://mas.owasp.org/MASVS/); [OWASP Agentic 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/); [ISO/IEC 42001](https://www.iso.org/standard/42001); [ISO/IEC 27001](https://www.iso.org/standard/27001); [GitHub protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches); [DORA](https://dora.dev/guides/dora-metrics/).

**Success criterion:** A paying customer receives a traceable, accepted deliverable within agreed economics; a system whose agent count grows but lacks verifiable output fails this mission.
