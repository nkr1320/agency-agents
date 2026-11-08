# NKR Enterprise Agency OS — Advanced Coordination, Performance and Security Specification

**Version:** Proposed architecture, 2026-11-08. **Status:** Design and source cross-check; no runtime enforcement, load test, agent benchmark, security certification or demonstrated 5x speedup.

## A. Architecture decision: own the assurance layer, not another agent framework

Use **one authoritative company-level task/permission manager**. Benchmark the NKR Paperclip fork as the leading candidate because the upstream documentation describes organization hierarchy, atomic issue checkout, dependencies, budgets, skills, routine triggers, approvals, tool connections, workspaces and activity. This is documented capability, not tested NKR execution. Orchestrator may be a subordinate **coding/worktree executor**, never a second authoritative task and approval database. OpenHands is an alternative executor. Agency Agents and ECC are **instruction/skill sources** to qualify; Playwright, Promptfoo and native Android/iOS tools generate *external test evidence*.

**Do not build:** another org-chart UI, task comments, generic memory store, agent prompt collection, first-generation dashboard or Git worktree manager when the chosen upstream already meets tested needs.

**NKR-specific software to build where absent:** tenant-scoped business-intake contract, risk-tier mapping, strict execution/task interface, cross-division shared API dependency tracking, enforced tool gateway/sandbox adapter, independent evidence/acceptance gate, model/skill performance registry, actual delivery cost/client revenue ledger, reproducible multi-division qualification suite and policy/approval audit integration.

## B. Sizing and roles

Current versioned NKR manifests define **37 role assignments using 23 unique existing role files**, not 37 simultaneously running workers. Eight or more role names on a project is not an instruction to spawn eight agents.

Website (12): delivery lead (scope, acceptance, money); research (users, requirements); UX (responsive states); architect (ADR, API/data boundaries); frontend (UI code); backend (API/auth/DB); QA (unit/API/browser); evidence (real screenshots/trace and defects); reviewer (independent diff check); security (web threat review); release (reproducible deploy); operations (monitor and maintain).

AI Agents (13): delivery lead (scope/budgets); research (golden-set provenance); architect (topology/trust/handoff); prompt designer (instructions/tool dialogue); builder (agent runtime); RAG specialist (retrieval/citations); API specialist (typed tools/auth); evaluator (ground truth/test metrics); evidence collector (real traces); privacy engineer (separation/retention); security reviewer (tool abuse/injection); code reviewer (independent implementation); operations (latency/drift/incidents/cost).

Apps (12): delivery lead (scope); researcher (OS/device/feature needs); UX architect (screen states); architect (modules/permissions/offline); mobile builder (Kotlin/Swift/chosen cross-platform); backend/API specialist (service contracts); QA (device/unit/integration); evidence collector (device traces/crashes); reviewer (code review); security specialist (mobile/privacy); release engineer (sign/store/rollout); operations (crashes/ANR/updates/support).

Initial concurrency per job: **one scheduler service, up to two execution workers, one independent QA/reviewer invoked when ready**. The scheduler and approvals can run without an LLM. Benchmark increases to 3–4 workers only for proven independent work; do not infer optimum agent count from prompt-library size. Large programs may operate multiple isolated jobs/teams; per-tenant resource quotas apply.

## C. Task delegation algorithm

Represent work as a **versioned directed acyclic graph (DAG)** with explicit dependencies. Task readiness is decided by the control plane, never by an agent declaring it can start.

1. Validate authorized project and signed/approved scope revision.
2. Split by deliverable ownership and interface contract, not by arbitrary agent titles. Assign estimated effort, risk, file/DB ownership, acceptance tests and reviewers.
3. Calculate approximate longest downstream path (critical-path length), task unlock value and risk. Keep high-risk integration and shared-interface work early.
4. Ready set = unfinished tasks whose *required dependency gates* are independently verified, not merely marked complete.
5. Rank eligible work by critical path, deadline/SLA, customer impact, dependency-unlock value and cost, **subject to**: allowed role, privileges, file/resource locks, model capabilities, context quality, service capacity and job budget.
6. Atomically lease a READY task to ONE execution owner, with attempt ID, expiry and heartbeat; enforce one-writer ownership for shared paths/resources. Another worker may read but cannot silently overwrite.
7. Worker writes output to its own branch/worktree/artifact partition; emits typed result with hashes and actual tests.
8. On crash/timeout: reconcile real task state, inspect artifacts, renew or expire lease and safely retry from checkpoint after checking idempotency. Never auto-retry external payments, messages or destructive writes.
9. On review failure: create a defect linked to source task and evidence; keep total attempts bounded.
10. Finish only after runner evidence, independent review and release authority by risk tier.

Suggested scoring logic for **eligible** task t and worker w:
priority(t,w) = weighted critical-path urgency + SLA pressure + verified skill fit + downstream unblock value - context-setup cost - estimated API/resource cost - conflict/rework risk.

Weights must be tuned from actual job data; this heuristic is not a globally optimal scheduler and must never override security eligibility or dependency requirements.

### Task contract: minimum typed fields

request: job_id, org_id, division_id, scope_version, task_id, dependency_gate_ids, task_goal, acceptance_tests, preferred_language/framework, repo_url, base_commit_sha, allowed_path_globs, denied_path_globs, allowed_tools, allowed_hosts, prohibited_actions, risk_tier, model/skill_version_pins, hard_budget, timeout, reviewer_id, evidence_requirements.

result: task_id, attempt_id, status (DONE/FAILED/BLOCKED/INCONCLUSIVE), branch, output_sha, changed_paths, test_run_ids with actual status, artifact_hashes, assumptions, unresolved risks, observed_token_usage, elapsed_time, replay/recovery_notes.

**Validator contract:** schema-check requests and results; verify run IDs in trusted test backends, SHA in GitHub, applicable approvals in control plane, file diff inside allowlist and usage under ceiling. The agent's narrative is not a trusted fact source.

## D. Inter-agent communication and context

**No unstructured all-to-all chat.** Durable task comments, typed events and artifact pointers form the normal communication channel. Workers may ask specific questions via task thread; the manager resolves dependencies, conflicts and escalations.

Use three context stores:
- Immutable project facts: client-approved scope, versions, ADRs, contracts, coding standards and policies.
- Per-task packet: task objective, parent goal, approved files/snippets, expected schema/tests, interfaces, dependencies and authoritative source SHA.
- Durable run memory: checkpoint ID, executed commands, findings, artifact pointers, unresolved issues, next suggested action.

Never copy all prior conversation history into every worker. Retrieve relevant, permission-filtered context with source references, freshness/version metadata, and bounded token budgets. Create a checkpoint at task transitions and before irreversible actions. Store facts and assumptions separately; stale or contradictory information creates a clarification or BLOCKED state. Treat external documents, webpages, other agents' messages and retrieved context as untrusted instructions. Scope context by customer and project, with tested cross-tenant denial.

**Conflict control:** assign codeownership by bounded module, separate Git worktrees and PRs, API-contract owners for shared changes, test against target branch, and a single integration authority. For shared binary scenes or generated assets, use one final integration process. Detect file/contract overlap BEFORE dispatch; do not solve collisions by last-writer-wins.

## E. Editor and model independence

Any approved editor (VS Code, Cursor, Antigravity, IDE plugins, command line) can create code. The editor is **not** the source of authority. GitHub is source history; the task/approval control plane is workflow truth; CI and domain-specific runners are test truth. Runner adapters implement a common capability contract:
- discover supported mode and OS (CLI, API, browser, desktop)
- start/stop/recover with scoped credentials and a declared working directory
- sync pinned context files and tool policies
- collect logs/telemetry, usage, commits, artifacts and errors
- enforce process/network/fs limits and task budgets
- report the exact tool capabilities and unsupported modes.

Choose supported coding tool based on task characteristics and platform capabilities, not a blanket guarantee that every editor has identical automation API. Prefer headless CLI/API runners; browser and desktop control are exception paths with extra isolation. Native iOS build/sign requires an appropriate macOS/Xcode environment; Android needs Android SDK and device/emulator tooling.

Models may be routed by risk/complexity/tool support; independent reviewers should be different sessions with clear separation. If a provider/model fails, fallback must preserve approved scope, tool permissions, artifact contracts and re-run verification. No agent may elevate its permissions or choose an unapproved model tier on its own.

## F. Policy enforcement and security

Scope control requires **enforcement outside the language model**:
- Identity: named user and service-account attribution; least privilege; MFA/SSO as scale grows.
- Tool gateway: deny-by-default at the actual API/tool boundary, host/path restrictions, data classification, scoped temporary credentials, approval for external writes.
- Sandboxing: ephemeral per-task worker container/VM where appropriate, network egress allowlist, non-root execution, file mounts limited to assigned repo, quotas, no host Docker socket, no broad cloud keys.
- Code supply chain: pinned tool/skill versions, license and dependency review, provenance, secret detection, SAST/SCA and GitHub PR protection.
- Release: separate build/test credentials from production deploy identity; required human approval for production and high-risk actions; verify artifact SHA and test evidence.
- Budget: per-job and agent cost ceilings, spend reservation before dispatch, bounded in-flight concurrency and automated freeze/reconcile on overage. Budget caps based only on delayed usage reports can overshoot.
- Data: tenant-specific access checks, private artifacts, redaction, encrypted credential handling, approved retention/deletion policy and audit.
- Emergency: revoke tokens, cancel workers, disable offending skills, freeze deployments and preserve trace evidence.

Guard for OWASP 2026 agentic risks: agent goal hijacking, tool misuse, identity/privilege abuse, unsafe MCP supply chain, unexpected code execution and poisoned memory/context. Stating these controls in agent prompts does **not** implement them.

Reference implementation option: query a dedicated policy service such as Open Policy Agent from the server-side tool gateway, returning ALLOW/DENY/APPROVAL_REQUIRED with reason and policy version. The gateway MUST enforce the result; do not make OPA the only authentication or secret boundary. Test decision failures and missing policy as DENY.

## G. Continuous monitoring and recovery

Generate trace_id, org_id, job_id, task_id, attempt_id, worker_id, model_version and code_sha for each execution. Use traces, metrics and structured logs (OpenTelemetry-compatible where practical) to detect:
- worker timeout, stale heartbeat or expired lease
- out-of-scope command/path/URL/permission attempted (immediate kill and alert)
- task retry loops, repeated negative test results, integration conflicts
- excessive token/tool usage, rising cost and provider throttling
- model hallucination or evaluation accuracy drift
- CI failures, rising flakiness and review queue bottlenecks
- suspected secret leak or cross-customer data exposure
- service degradation, queue backlog and unacknowledged incidents.

Alerts must carry observable evidence and an assigned escalation owner. A detector is not proof that an agent behaves correctly; combine runtime guardrail denials, behavioral evaluations, independent review and real output acceptance.

Recovery sequence: pause only affected scope -> preserve redacted logs -> examine actual run state and artifact hashes -> identify root cause -> retry if safe/idempotent, otherwise escalate -> retest full affected acceptance requirements -> record resolution. Enforce max retries and circuit breakers to prevent infinite spending.

## H. Quality assurance: gates that cannot be faked

G0 Scope: authorized customer and measurable acceptance tests.
G1 Architecture: interfaces/ADR, threat model and owned dependencies.
G2 Build: compilation, formatting/lint, unit tests, API contracts.
G3 Domain verification:
- Website: real Playwright assertions, browser/device sizes, form/API behavior, accessibility and relevant security checks (OWASP ASVS).
- AI Agents: human-checked gold cases, retrieval/grounding, tools, refusals, injection, timeouts, side effects, cost and safety (NIST AI RMF/OWASP agentic).
- Mobile App: native build and emulator/device test, permissions, auth, offline, crash/ANR, release signing and privacy (OWASP MASVS).
G4 Independent review: reviewer checks diff against requirements, security and actual test artifacts, not another agent's praise.
G5 Release: named human authorizes exact tested artifact SHA and target environment; failed/blocked/untested checks remain visible.
G6 Operation: smoke checks, metrics/alerts and support handover.
G7 Maintenance: approved changes return through the same scoped tests/reviews and version control.

Trust hierarchy: real external runner result > reviewed trace/artifact > versioned source/doc > agent narrative. A screenshot alone cannot prove backend persistence. Code written by an agent that passes a subset of tests is not guaranteed correct or safe.

## I. High-risk failure modes and mandatory responses

| Failure | Prevent | Detect | Recover |
| --- | --- | --- | --- |
| Duplicate assignment | atomic leases, unique task/run IDs | two active leases/commit conflicts | cancel loser, reconcile commits |
| Circular dependencies | DAG validation | graph cycle | reject plan, re-scope |
| Stale/poisoned context | version pin and provenance | mismatched scope/SHA, eval alarms | refresh packet, invalidate output |
| Writer collision | worktree/path ownership | overlapping diffs, merge conflicts | single integration owner, rerun tests |
| Skill drift/unsafe update | pin version and approval | benchmark/security regression | disable/revert skill |
| Unauthorized tools/URLs | server-side deny by default | denied tool action and trace | stop/revoke/escalate |
| Runaway retry/cost | budget reservation, max retries | burn rate / retry spikes | circuit-break and human triage |
| Agent false pass claims | trusted test backend | missing test run and artifact hashes | mark unverified, rerun |
| CI outage | independent CI-health gating | jobs fail before steps/startup failure | diagnose Actions; never mark green |
| Cross-tenant data leak | tenant isolation and scoped credentials | access-denial/secret alarms | isolate, revoke, respond incident |
| Silent tool failure | typed errors, idempotency keys | missing acknowledgment/timeout | reconcile external state, no blind retry |
| Reviewer rubber-stamping | independent review with access to evidence | unsupported approval or no findings | block release, reassess reviewer |
| Bottleneck from many agents | capped concurrency, critical-path scheduler | queue latency, rework and shared-file conflicts | reduce active workers, repartition work |
| Rollout causes outage | staged deploy and rollback plan | SLO/canary errors | stop rollout, approved recovery |

## J. Cross-verification sources and caveats

- NKR repository state and role assignments verified through connected GitHub (PR #4 nkr/enterprise-agency-os-v1).
- Paperclip architecture, task checkout/skills/budgets/approvals: https://github.com/paperclipai/paperclip/blob/master/README.md (documented, not tested on NKR).
- Orchestrator worktrees and CI repair: https://github.com/OrchestratorInc/agent-orchestrator/blob/main/README.md (documented).
- LangGraph durable checkpoints if custom workflows require it: https://github.com/langchain-ai/docs/blob/main/src/oss/langgraph/checkpointers.mdx (optional; do not add a second scheduler by default).
- OPA policy integration: https://www.openpolicyagent.org/docs/integration (optional enforcement engine, requires app-side enforcement).
- OpenTelemetry signals and GenAI agent trace conventions: https://opentelemetry.io/docs/concepts/signals/ (instrumentation choice).
- OWASP Agentic Top 10 2026: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
- OWASP ASVS: https://asvs.owasp.org/ ; OWASP MASVS: https://mas.owasp.org/MASVS/
- GitHub branch protection and Actions security: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches ; https://docs.github.com/en/actions/reference/security/secure-use

**Unverified:** actual integration between Paperclip and Orchestrator; sandbox efficacy; governance enforcement; compatibility of every editor; measured speedup, fault rate, customer outcome and budget actuals. Those require the gated qualification plan, not assumptions.
