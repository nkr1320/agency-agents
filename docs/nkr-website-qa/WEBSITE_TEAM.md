# NKR Website Team — Build + QA + Maintenance

**Status:** Proposed service line; not live or automatically operating.  
**Compatibility:** This extends the existing Website QA pilot documentation; it **does not change or replace** the INR 4,000 / five-page / three-journey pilot.

## What this team delivers

1. **Build:** responsive business websites, landing pages, portfolios and approved dashboards/web apps.
2. **Improve:** accessible UI/UX, page speed, forms, SEO foundations, functionality, bug fixes.
3. **Verify:** browser journeys, mobile behavior, API contracts, security-sensitive review, evidence.
4. **Ship (only after owner/client approval):** deploy to authorized hosting, verify post-release checks, provide rollback documentation.
5. **Maintain:** scheduled regression checks, small approved fixes and incident triage within contractual hours.

The existing **Website QA pilot** in [README](README.md) and [Qualification](QUALIFICATION.md) is the first low-risk commercial offer. Full website development is a **separate estimate** based on scope; it is not included in the INR 4,000 QA offer.

## Team roles — reference existing role files

| Role | Reused instruction candidate | Output |
| --- | --- | --- |
| Delivery lead / scope | [Senior Project Manager](../../project-management/project-manager-senior.md) | contract scope, milestones, approvals |
| Product/UI designer | [UI Designer](../../design/design-ui-designer.md) | signed-off screens, states and responsiveness |
| Frontend developer | [Frontend Developer](../../engineering/engineering-frontend-developer.md) | branch + components + tests |
| Backend developer (as needed) | [Backend Architect](../../engineering/engineering-backend-architect.md) | reviewed API, auth and data contracts |
| Test automation | [Test Automation Engineer](../../testing/testing-test-automation-engineer.md) | real Playwright runs and artifacts |
| Evidence and code review | [Evidence Collector](../../testing/testing-evidence-collector.md), [Code Reviewer](../../engineering/engineering-code-reviewer.md) | defect ledger and independent approval |
| Security / release (on demand) | [AppSec Engineer](../../security/security-appsec-engineer.md), [DevOps Automator](../../engineering/engineering-devops-automator.md) | risk review, deployment plan, rollback |

Roles may be invoked on demand; a small project does **not** require eight simultaneous model workers.

## Standard workflow

Client brief -> approved requirements and screens -> task breakdown -> Git feature branches/worktrees -> implementation -> automated/unit/API/browser checks -> independent review -> client preview -> explicit production deployment approval -> handover / maintenance.

**Hard gates:**
- No source modification without repository access and owner permission.
- No fake, mock or placeholder **production data** presented as live information. Controlled synthetic data is allowed only in clearly labeled test/staging.
- No application release with unverified critical functionality.
- No direct default-branch writes; follow project-specific branch protections, review and CI.
- Never run browser tests on an unapproved domain, or submit real client forms/payments without an explicit test arrangement.
- One source of truth for requirements and one integration owner for shared changes.

## First qualification exercise

On an owned sample site: implement one responsive contact/lead page; execute desktop + mobile navigation and form journeys against a test endpoint; collect screenshots/traces and outcome assertions; introduce and then fix one controlled regression; verify rollback documentation. Measure actual usage, elapsed time, owner correction time and escaped defects. **No results are claimed until run.**

## Website-specific deliverable bundle

Requirements and approval record; UI reference; source branch/PR; test evidence; accessibility and security findings within scope; build/deploy instructions; signoff; post-release checklist; known limitations; maintenance boundaries.
