# Division-by-Division Lifecycle: Different Jobs, Same Traceability

All three teams use ten phase identifiers for **consistent reporting**, but each phase contains different specialists, work products, tests and release authority. The authoritative phase/role details are in the JSON manifests (checked in CI). A phase can repeat after a defect, incident, failed rollout or change request; it is **not** a one-way waterfall.

| Stage | Website division | AI Agent division | Mobile App division |
| --- | --- | --- | --- |
| 01 Intake | signed pages/journeys, domain access | allowed knowledge/tools/autonomy, model budget | OS/platform, package ID, device matrix |
| 02 Research | web UX, accessibility, audience, SEO | representative tasks, data provenance | user research, OS and store policy |
| 03 Architecture | frontend/back, identity, data and hosting | orchestration, RAG, tool schema, permission boundaries | native/cross-platform modules, offline and service contracts |
| 04 Design | responsive UI and states | dialogue/tool/handoff states | screens, navigation, loading/error/offline |
| 05 Build | code in Git branch, API and UI checks | prompts, model/tool versions, runtime integrations | reproducible Android/iOS build, integration |
| 06 Verify | Playwright, API, A11y, real traces | gold-set, groundedness, tool safety, injection, cost | instrumentation/device, API, upgrade, privacy |
| 07 Review | independent engineering/security and regressions | independent eval, security/privacy review | independent source/mobile security and device evidence |
| 08 Release | tested hosting + controlled rollout/rollback | restricted staging, explicit approval for write tools | signing, internal/beta, store and phased rollout approval |
| 09 Operate | uptime, performance, incidents | latency, quality drift, tool errors, tokens and incidents | crash/ANR, customer support, store reviews |
| 10 Improve | performance, security updates, client backlog | re-evaluation after model/prompt/tool changes | OS compatibility, SDK fixes, maintenance releases |

## Work streams inside each division

**Website:** sales/discovery -> UX/design -> frontend/backend -> API/browser/performance/accessibility tests -> AppSec -> release -> uptime/support -> maintenance. Small QA-only pilots use a narrower contract and must **not** pretend full website engineering is included in the pilot.

**AI Agents:** use-case intake -> data and authorization -> evaluation design -> orchestration/retrieval/prompt/tool development -> tool contract and task tests -> independent evaluation/security -> safe canary -> runtime observability -> drift/cost/error remediation. Agents are not allowed to grant themselves new authority.

**Mobile App:** user journeys -> platform/UX -> native or selected cross-platform build -> real emulator/device and backend tests -> privacy/permissions -> versioning/signing -> store review/rollout -> crash analytics -> OS/SDK maintenance. Browser Playwright does **not** replace native app device QA. Windows alone does not build/sign native iOS apps without a compatible macOS environment.

## Service ownership after handover

Each paid job needs a defined maintenance period, severity response promise, defect-versus-new-feature distinction, escalation channel, support budget and end-of-service/data deletion plan. Never sell unlimited updates at a fixed low fee.

## Task handoffs

Every phase emits: job_id, team_id, source SHA, scope_version, named_owner, started/completed timestamps, artifact reference, evidence references, risk tier, cost consumption, open blockers and next gate. For versioned state machines, a phase can only move to **APPROVED** when its gate is recorded by a valid authority. A blocked phase cannot silently transition to release.

**Operational note:** JSON manifests currently check static completeness, not the runtime state transitions. Runtime enforcement is a subsequent engineering milestone.
