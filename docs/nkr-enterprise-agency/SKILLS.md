# Skills & Agent Capability Upgrade Program

**Goal:** continuously improve proven delivery capability without importing untrusted prompts/hooks or accumulating overlapping managers. Upgrading means measurable performance and safe operations, not counting files or stars.

## Skill registry fields

Every capability requires **ID, discipline, owner, version/commit, original source URL, license and notice obligations, tested runtime, compatible model/tool versions, required permissions, expected artifacts, risk tier, benchmark, known limitations, last review date, rollback version and adoption state**.

States: DISCOVERED -> PROVENANCE_VERIFIED -> SANDBOXED -> BENCHMARKED -> APPROVED -> PILOT -> GENERAL -> DEPRECATED / REVOKED. A skill is NOT generally available simply because it exists in a fork.

## Approved-source candidates already in NKR account

- [Agency Agents](https://github.com/nkr1320/agency-agents): role instructions; inspect exact instructions and tool assumptions.
- [ECC](https://github.com/nkr1320/ECC): selected planning, code review, security and testing skills, but **do not install overlapping plugin/manual hooks**.
- [Agent skills collection](https://github.com/nkr1320/nkr-agent-skills): choose task-specific roles after validation.
- [Playwright MCP](https://github.com/nkr1320/nkr-playwright-mcp): website testing integration candidate, not proof of execution.
- [Promptfoo fork](https://github.com/nkr1320/nkr-agent-evals): repeatable model/prompt eval candidate.
- [Orchestrator fork](https://github.com/nkr1320/nkr-agent-orchestrator): **first manager/dashboard to benchmark**, not assumed universal.
- [OpenHands](https://github.com/nkr1320/nkr-agent-canvas) and [Paperclip](https://github.com/nkr1320/nkr-paperclip): **alternatives**, not concurrent required installations.
- [Blender MCP](https://github.com/nkr1320/nkr-blender-mcp): optional CGI production lane outside these three divisions until explicitly expanded.

## Required skill qualification sequence

1. **Provenance:** confirm source, release SHA, rights, dependencies, maintainers, known advisories and external network/telemetry.
2. **Sandbox:** read code and hooks before executing; isolate filesystem/network/credentials. Never install arbitrary commands as root.
3. **Fit:** map the skill to an existing role and a measurable job; reject duplicate orchestration or hidden global config modifications.
4. **Security:** test prompt injection, arbitrary-code or remote tool access, secret exfiltration and scope violations proportionate to risk.
5. **Benchmark:** same scenario against existing baseline; measure task correctness, false findings, regressions, time, spend and intervention.
6. **Approve:** owner/QA and security approvers by tier; pin exact SHA/version and permissions.
7. **Pilot:** small jobs with usage limits, real logs and manual review.
8. **Promote / revoke:** use evidence and rollback path; quarterly and incident-triggered reassessment.

## Skills by discipline

**Website:** requirements, UX/accessibility, design system, React/TypeScript, APIs/database, Playwright, OWASP ASVS, performance, deployment, SRE.  
**AI Agents:** use-case specification, prompt design, orchestration, RAG, retrieval validation, tool/API contracts, NIST/OWASP risk, gold-set eval, telemetry and cost controls.  
**Apps:** mobile design systems, Kotlin/Swift or an explicitly selected cross-platform stack, native UI/instrumentation testing, OWASP MASVS, offline/performance, signed releases, crash triage and store policies.

**Shared:** Git/GitHub, least privilege, PR review, CI, secrets, documentation, accounting, customer communication, observability, incident response, project management and legal/compliance input where required.

## Upgrade cadence

- Per delivery: record friction, failed steps, repeated human edits.
- Weekly: triage repeated errors and update benchmarks; do not auto-promote versions.
- Monthly: prioritize 1–2 capability improvements by measured bottleneck.
- Quarterly: provenance/license/security reevaluation, tool retirement, architecture and cost review.
- Immediately after incident/advisory: disable compromised skill, preserve evidence, assess blast radius, review replacements.

Use a **controlled upgrade PR** with before/after benchmark artifacts, reviewed changes and explicit rollback. Do not auto-pull upstream changes into production execution.
