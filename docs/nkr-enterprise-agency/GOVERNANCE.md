# Enterprise Governance, Authority, Risk, and Internal Controls

## Chain of accountability

The person who implements a change is not the final release authority for risk-bearing changes. Assign a named **DRI** (delivery owner), **A** (one accountable human), **R** (implementer), **C** (domain/security/QA reviewer), **I** (affected stakeholders). For a small team, one person may fill multiple operational roles, but do not fabricate approvals or represent self-review as independent review. High-risk releases are **BLOCKED** until independent review/approval is available.

| Decision | Delivery owner | Quality reviewer | Security/privacy authority | Executive/client approver |
| --- | --- | --- | --- | --- |
| Scope/price/timeline | drafts | consulted | consulted when sensitive | approves |
| Architecture/tech choice | recommends | reviews testability | reviews risk | decides when material |
| Agent tool access/data grants | requests | checks behavior | approves constraints | approves sensitive access |
| Routine branch code merge | proposes | independently reviews | consulted by tier | follows repo required reviewers |
| Production web deploy | prepares | verifies evidence | approves if risk warrants | **explicit human authorization** |
| AI autonomous writes/actions | proposes bounded scope | verifies safe test evidence | approves tool/data policy | **explicit authorization** |
| App signing/store publish | prepares | verifies build/device evidence | reviews privacy/permissions | **publisher owner authorizes** |
| Emergency rollback | incident lead executes preapproved procedure | records evidence | incident commander oversight | notified and reviews |

## Risk tiers

- **R0:** Public, reversible, no sensitive data, non-production. Baseline review.
- **R1:** Internal/client-visible low impact, limited approved actions. Named owner + standard review.
- **R2:** Client information, uptime, authentication or material service risk. Independent QA/security assessment, access scope, separate approval.
- **R3:** Sensitive/regulated data, money or financial impact, high-volume production, cross-tenant operations, destructive action, externally acting agents. Strong separation, explicit approval and domain/legal compliance review as appropriate.

The policy JSON defines the minimum role/approval vocabulary. **A JSON file alone cannot enforce these rules.** True enforcement needs GitHub rulesets, identity providers, deployment environments, server-side authorization and auditable action logs, configured after repository-specific assessment.

## Minimum control coverage, all three divisions

- **GOV-01 to GOV-04:** accountable owner, written scope, data classification, least-privileged identity/tools.
- **GOV-05 to GOV-08:** isolated change PR, real test evidence, proportional security review, authorized release.
- **GOV-09 to GOV-12:** operations/backup/rollback, financial caps, skill provenance, incident response.

No secrets, real customer personal data, private customer traces or signing material in this **public** fork. Use private authorized storage, encrypted credentials, MFA, scoped service accounts and retention policies.

## Source-to-production controls

1. Separate dev/staging/production identities and data.
2. Record exact dependencies, model versions, prompt hashes, tool versions and release artifacts.
3. Protected default branches: required status checks, independently reviewed PRs and approvals where applicable, no bypass without tracked break-glass.
4. Dependency/secret scanning, selected static analysis and provenance for released software; triage high-impact findings.
5. Environment-specific deployment approvers and production logs; least-privilege tokens.
6. Change freeze and incident rollback/forward-fix plan for risky changes.
7. Review policies at least quarterly and after incidents, regulatory updates or major upstream changes.

**Never assume controls exist** just because this documentation recommends them. Verify repo and production settings in an implementation audit.

## Security standards adoption

- **Website:** OWASP ASVS 5.0.0, applicable privacy/accessibility and web threat modeling.
- **AI Agents:** NIST Govern/Map/Measure/Manage, GenAI Profile, OWASP Agentic Top 10 2026 and 2026 LLM risk guidance; account for untrusted retrieved instructions, excessive agency, tool escalation, data leakage and runaway spend.
- **Apps:** OWASP MASVS, platform release requirements, data/privacy controls, tested permissions and secure local storage.
- **Enterprise:** Consider ISO/IEC 27001 and ISO/IEC 42001 as long-term governance benchmarks; certification requires actual independent assessment and extensive operating evidence.
- **Delivery:** DORA outcome metrics; software supply-chain provenance where technically justified. Do not advertise any compliance certificate without audit evidence.

## Incident protocol

Detect -> classify severity -> contain -> assign incident commander -> communicate accurately -> recover via documented procedure -> preserve redacted evidence -> root-cause/postmortem -> assign prevention action -> verify closure. For suspected credential exfiltration, immediately halt affected automation and rotate credentials through authorized operators. Exercise disaster recovery and access revocation periodically.

## Auditability

Each service task must have a stable job ID and customer/project boundary, classification, owner, reviewer, decisions, permissions, version hashes, tests, evidence retention location, actual cost, deployment history and acceptance. Dashboard statuses originate from actual underlying events; animated cursors/agent messages are not proof.
