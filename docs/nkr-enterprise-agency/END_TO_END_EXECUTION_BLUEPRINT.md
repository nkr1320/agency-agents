# NKR Enterprise Agency OS — End-to-End Execution Blueprint

**Status:** Proposed engineering implementation plan, 2026-11-08. No running agency platform, deployed three-team workflow, executed local validation suite, customer deployment, or paid revenue is claimed.

## Purpose and customer promise

One authorized client brief becomes an approved scope, a dependency-aware task plan, assigned and bounded specialist workers, reviewable code and artifacts, independently executed tests, explicit release approval, delivered product, monitoring, maintenance and measurable economics.

The three independent divisions are **Website**, **AI Agents** and **App**. They share enterprise controls but own their role catalog, phase requirements, test engines, customer deliverables and support runbooks.

Not another role library: reusable upstream components already supply agents, worktrees, scheduling, review and evaluation. NKR should own the **client-specific delivery model, real evidence, hard permission gates, economic attribution, skill qualification and cross-division product coordination**.

## Reuse versus rebuild: management decision

Evaluate the existing NKR Paperclip fork first as the authoritative **company-level task and permission control plane**, because its documented upstream functions include org charts, task ownership, budgets, routines, approval stages and skill records. Evaluate NKR Orchestrator as a **subordinate coding executor** for isolated worktrees and PR/CI feedback only when an adapter can preserve a single task owner and source of approval. OpenHands remains an alternative executor. Avoid deploying Paperclip, Orchestrator and OpenHands as three competing task managers. These candidates have NOT been benchmarked on NKR infrastructure.

Agency Agents role definitions are task guidance, not deployed workers. Curate ECC skills only after inspecting installer hooks, model-specific support and collision hazards. Playwright provides web test execution; Promptfoo-type engines provide LLM evaluation; native platform frameworks provide mobile app testing. Skills and tools need versions, reviewers and rollback.

## Proposed execution architecture

1. Authenticated owner/customer portal receives scoped intake and written authorization; sensitive client details live in private storage.
2. Manager creates job, risk tier, spending ceiling, phase plan, dependencies, human approvals and support terms.
3. Server-side policy checks identity, tenant, tool permissions, target hosts/repos and budget BEFORE scheduling work.
4. Concurrency-limited execution adapters start workers in separate repositories/worktrees/containers or approved sandboxes.
5. A worker receives a signed or trusted job scope, pinned skill versions, minimum necessary data, a time/cost budget and a single defined output contract.
6. Runner returns observable logs, artifact IDs, Git SHAs, explicit failures and measured usage; agent-written status is not proof.
7. Independent tester executes domain-specific checks; security reviewer assesses applicable risks and source changes.
8. If a gate fails, defect/review feedback creates bounded rework assigned to the original task owner. Retry cannot bypass approvals.
9. Authorized human approves production changes, external writes or app-store release. Release records exact artifact, target and audit event.
10. Monitoring generates support, incident and maintenance tasks. Customer acceptance, actual payments, costs and margin are recorded separately.

Control-plane services: identity and tenancy; intake/contracts; task/dependency management; agent/runtime adapter; skill registry; tool-policy gateway; evidence and artifact storage; independent QA and eval; release and approval control; monitoring and incident queue; usage/finance ledger; truthful event-backed dashboard.

Candidate stack only: reuse Paperclip’s data/task model unless a verified gap requires extra services; existing GitHub is source/PR/CI truth; use a private artifact store and minimum necessary project-specific event processing. Adding Supabase, Cloudflare queues or a custom React portal requires an ADR specifying the existing gap, data owner, operational cost and migration path.

## Canonical records (minimum)

Organization: human accountable owner, division policies, retention rules.
Client: client ID, contract/permissions, data classification, contacts.
Project: owning division, approved repository/domains and access scope.
Job: unique ID, scope revision, accountable human, risk tier, approved budget, acceptance criteria.
Task: phase, dependencies, named worker, single owner, lease, permissions, status, retry budget, evidence links.
Agent: role ID, instruction SHA, model/runtime version, permissions, sandbox, expiry and usage cap.
Skill: source, license/notice, hash, supported runtime, trial results, approver, promotion status, rollback pin.
Execution: task, input and artifact hashes, actual start/end, tool use, model usage and error code.
Evidence: runner identity, timestamp, expected/observed, status, evidence URI and checksum.
Approval: authorized human identity, scope, decision, timestamp and action type.
Release: approved artifact SHA, environment, checks, rollout, rollback plan and human release authority.
Operations: incident, severity, SLA/owner, change request, maintenance cycle, cost/payment reference.

## States and automations

Job lifecycle: DRAFT -> SCOPE_REVIEW -> SCOPED -> PLANNED -> DESIGN_APPROVAL -> IMPLEMENTING -> TESTING -> CODE_REVIEW -> RELEASE_APPROVAL -> RELEASED -> MONITORING -> MAINTENANCE. Support BLOCKED, FAILED, CANCELLED and REWORK with transition evidence. A job is DELIVERED only when required artifacts and customer acceptance exist.

Task lifecycle: READY -> CLAIMED -> RUNNING -> EVIDENCE_SUBMITTED -> REVIEW_REQUIRED -> APPROVED. Failures become BLOCKED/FAILED/RETRY_WAIT. Every claim is atomic; retries idempotent and bounded.

Proposed reliable events: job.created, scope.approved, plan.approved, task.ready, task.claimed, task.started, test.completed, artifact.produced, review.changes_requested, review.approved, budget.threshold, budget.exceeded, release.requested, release.approved, release.completed, incident.opened, monitor.alert, skill.promotion_requested and skill.revoked.

An event needs event ID, source, org/job/task IDs, actor, version, timestamp, redacted payload and correlation ID. Consumers must tolerate duplicates. Payment, message sending, deletion and other external mutations require separate explicit permissions and idempotency protections.

## Website division: complete workflow

Authorized business requirement -> client screens/journeys, host, accessibility and form/data requirements -> UI and responsive states -> frontend/backend architecture -> parallel isolated development and test design -> build/unit/API checks -> Playwright browser tests on approved staging (desktop/mobile) -> real traces, screenshots and assertions -> defect triage -> reviewed repair PR -> independent quality/security checks -> human-approved release -> production smoke test -> uptime, incidents, dependency updates and contracted recurring maintenance.

Outputs: scope, design, code PR, actual build logs, test cases and run IDs, defects, security report, release SHA, support/rollback plan and client acceptance.

Existing INR 4,000 website QA pilot remains QA-only; building an entire website requires separately priced scope.

## AI Agent division: complete workflow

Authorized use case -> allowed data, tools, writes and human handoff requirements -> define expected-task golden set BEFORE implementing -> agent graph, RAG/tool schemas, model limits and policy -> sandbox integration -> real tool API contract and prompt tests -> independent eval on groundedness, hallucinations, tool safety, prompt injection, spend, latency and refusal/handoff -> versioned results and remediation -> human-approved live tool scope -> monitored canary/rollout -> quality drift and repeat eval whenever prompts, retrieval, models or tools change.

Outputs: agent architecture, permission matrix, exact versions, golden set with provenance, real run/eval artifacts, security findings, cost/task scorecard, response escalation/disable plan, release authorization and support report.

An agent cannot self-grant credentials, treat retrieved instructions as authority, or classify its own response as verified solely by judging its generated text.

## Mobile App division: complete workflow

Authorized target devices/platform and package/bundle ownership -> app screens, loading/error/offline/permission states -> native or cross-platform stack decision -> isolated implementation and backend integration -> reproducible compilation and unit tests -> emulator/physical device and API tests -> regression, privacy/security, performance, offline/upgrade and crash checks -> independent review -> store asset/signing/release checklist -> owner-approved internal/beta release and staged rollout -> crash/ANR/support monitoring -> versioned bug, SDK and OS-compatibility maintenance.

Outputs: source PR, build hash, OS/device matrix, actual test results, security and privacy assessment, signed-release plan, publishing decision, post-release support ownership. Browser Playwright alone does NOT validate native mobile functionality; Windows alone does NOT provide native iOS signing without compatible macOS tooling.

## Cross-division projects

A customer might buy one Website, one mobile App and one AI booking agent. Maintain ONE program/client record, but three independent delivery tracks and approval trails. Formal API contracts and release dependencies block deployment if another track is incompatible. A shared auth backend needs an explicitly assigned service owner. No division may overwrite another division's branch or shared artifact without agreed integration ownership.

## Governance implementation, not merely written rules

Risk tiers R0–R3 defined in the governance policy. Required server-side safeguards: verified RBAC/tenant isolation; allowlisted external tools/hosts; credential scoping; branch protections, real code/test checks; protected production environments; independent review for risk-bearing changes; immutable/tamper-evident decision logs; private artifact retention; per-job token/cost ceilings; stop/disable controls; backups and recovery exercises.

A green-looking dashboard, an instruction file, a passing manifest JSON validator or a PR comment does not prove these controls are enforced. Write intentional denial/negative tests and inspect server events. Security or ISO certification requires independent evidence and assessment.

## Roadmap: sequential engineering work packages

| WP | Purpose and deliverables | Hard exit criterion |
| --- | --- | --- |
| 0 CI recovery | Investigate NKR GitHub Actions failing before job steps, audit branch rules and repo source/licenses/versions | Existing and new workflow checks actually execute and pass; diagnosis documented |
| 1 Architecture selection | Evaluate Paperclip versus coding-only supervisor; choose authoritative task state and database; approve permission architecture | ADR, compatibility/ownership decision, no dual managers |
| 2 Controlled manager | Install selected pinned manager in isolated nonproduction setup; 3 teams, projects, task ownership, backups | real login, task states, approve/deny and restart persistence verified |
| 3 Worker adapters | Task contract, worktrees/sandbox, skill loading and exact versions, result ingestion, retry/cancel | working single/dual worker job with actual artifact and bounded cost |
| 4 Hard governance | RBAC, tenant isolation, secrets, gateway, audit, evidence and release approvals | unauthorized cross-client access and unapproved tool/deploy attempts rejected/logged |
| 5 Website vertical slice | one owned sample web job traversing full build/test/review/approved staging delivery | real Playwright traces and accepted output, defect rework demonstrated |
| 6 AI Agent vertical slice | one owned sandbox assistant with approved tools, golden-set eval and controlled failure | real task metrics, permission denial, model/tool rollback |
| 7 App vertical slice | one owned Android sample build/test/release-preparation cycle | source SHA, compiled artifact, actual emulator/device evidence, publishing held for human |
| 8 Dashboard and commerce | real project/agent/phase/PR/test/cost status, invoices/customer signoff, support tickets | all counts reconcile to underlying GitHub and run records; no fake completed tasks |
| 9 Benchmark and paid pilot | compare single agent vs selected team on representative jobs; scope sales pilot | independent scorecard and one accepted paid delivery with actual margin |
| 10 Operational automation | maintenance schedules, incident routing, CI failure rework, skill qualification | audited triggers, controlled retry, no permission or budget bypass |
| 11 Enterprise growth | SSO, formal IAM, audit, DR exercises, regional/federated business units only when needed | independent security assessment, measured scale and sustainable economics |

**Dependencies:** WP0 gates merging the current design; WP1 controls WP2; WP2–4 are prerequisites for autonomous execution; WP5–7 can have domain planning in parallel but all production writes await WP4. Do not postpone first sellable customer pilot until WP11.

## Trigger matrix

New client brief -> create draft scope/plan; owner approves scope and quote.
Approved task -> assign available bounded specialist worker with single owner.
Worker PR -> actual CI/test/evidence runs; failure creates retriable rework ticket.
Reviewer requests changes -> return to implementing worker, no completed claim.
Budget hits cap -> stop/alert and require owner reauthorization.
Release request -> verify SHA/tests/privacy/security and wait for named human approval.
Monitoring alert -> create incident and notify owner; only preapproved safe response automatic.
Scheduled maintenance -> run limited authorized checks and create evidence-backed report.
Skill update -> provenance/security checks and benchmark PR; never auto-promote unreviewed upstream content.
Client cancellation -> revoke access, stop workers and follow agreed export/retention/deletion procedure.

## Skill upgrades and corporate scaling

A role is promoted DISCOVERED -> PROVENANCE_VERIFIED -> SANDBOXED -> BENCHMARKED -> APPROVED -> PILOT -> GENERAL, or DEPRECATED/REVOKED. A new agent must show benefit on the same tasks compared to simpler baseline; measure correct outcomes, false findings, regression rate, manual rework, elapsed time and actual cost. Upgrading prompts or model versions is a controlled change and must preserve regression artifacts.

A 1–2-person startup uses the same job IDs and release evidence as a large enterprise but with simpler manual operations. Later add independent domain leads, security, platform and operations owners, SSO, formal audit, multi-tenant controls, regional policy and organizational reporting only when actual load and finance justify them. Never claim AI worker counts equal human employees.

## Commercial exit metrics

Website QA pilot INR 4,000 and proposed INR 6,000/month maintenance are validation offers, not established market prices. AI Agent Evaluation may be priced after bounded engagement scoping (proposed INR 10,000–25,000 validation range). App services require a project estimate. Track customer payment actually received, attributable model/cloud/tool costs, owner and rework hours, delivered acceptance, support burden and effective margin. Commercial traction is not the number of role definitions.

## Current known blocker

All four service/OS draft PRs are open and unmerged as checked 2026-11-08. PR #4 adds the enterprise manifests, 30 discovered skill/tool candidates, policy JSON and a proposed Python+GitHub Actions validator. GitHub Actions runs have failed before job steps, including inherited workflows, so these CI checks and tests are not proven. Read-only source/reference checking does not replace executed validation. Resolve this BEFORE marking governance as passed or merging the PR.
