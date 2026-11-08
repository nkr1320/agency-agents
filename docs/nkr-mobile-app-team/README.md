# NKR App Team — Android, iOS and Cross-Platform Delivery

**Status:** Proposed operational specification. App compilation, device tests and store releases are **not performed** by these documents.

## Services

1. Design mobile UX/UI, navigation, accessibility and offline/error states.
2. Build Android, iOS or cross-platform apps with explicit customer-selected platform coverage.
3. Integrate authorized backend, auth, storage, payments, notifications and hardware capabilities when required.
4. Test functional, API, security, privacy, performance, device and release workflows.
5. Prepare approved signing, store metadata, submission and rollout, plus crash monitoring and maintenance.

**Service packages (not fixed prices):** app audit/bug fixing, scoped MVP creation, and monthly maintenance. App quotes require platform choice, complexity, integrations, testing devices, publishing accounts and ongoing support expectations. Do not imply that a QA pilot includes full app development.

## Selected roles from verified source files

| Role | Existing role file | Required output |
| --- | --- | --- |
| Intake and scope | [Senior Project Manager](../../project-management/project-manager-senior.md) | platform targets, functionality and acceptance |
| UX/UI | [UX Architect](../../design/design-ux-architect.md) and [UI Designer](../../design/design-ui-designer.md) | screen states, prototypes and approvals |
| Mobile builder | [Mobile App Builder](../../engineering/engineering-mobile-app-builder.md) | source changes and tests on isolated branch |
| Backend/API integrator | [API Platform Engineer](../../engineering/engineering-api-platform-engineer.md) | documented secure API/auth integration |
| Quality tester | [Test Automation Engineer](../../testing/testing-test-automation-engineer.md) and [API Tester](../../testing/testing-api-tester.md) | actually run platform-appropriate tests |
| Code/security reviewer | [Code Reviewer](../../engineering/engineering-code-reviewer.md) and [AppSec Engineer](../../security/security-appsec-engineer.md) | risk and correctness review |
| Release specialist | [Mobile Release Engineer](../../engineering/engineering-mobile-release-engineer.md) | signing and store release checklist |

Use [ECC Flutter reviewer](https://github.com/nkr1320/ECC/blob/main/agents/flutter-reviewer.md), [Kotlin reviewer](https://github.com/nkr1320/ECC/blob/main/agents/kotlin-reviewer.md), or [Swift reviewer](https://github.com/nkr1320/ECC/blob/main/agents/swift-reviewer.md) **only for the chosen stack**; do not load all stacks blindly.

## Execution paths

**Android native:** Kotlin + Android tooling and client-approved dependencies; build unit/instrumentation tests and actual Android device/emulator checks.  
**iOS native:** Swift/SwiftUI with the appropriate macOS/Xcode build/signing environment; do not assert iOS builds are possible on Windows alone.  
**Cross-platform:** React Native or Flutter, only after feature/platform fit is agreed; validate each target platform separately.

Choose **one** application stack per engagement and document the reason. An app with a web backend needs explicit API contracts and backend tests too.

## Mobile flow

Authorized brief -> screen inventory and approval -> platform/architecture selection -> feature branches/worktrees -> implement with real backend contracts -> automated tests -> emulator/simulator and physical-device checks where relevant -> privacy/security review -> beta/internal test -> human store-submission approval -> staged launch -> monitoring and bug support.

## Hard gates

- **Never change existing published apps, package IDs, signing keys, production databases or release tracks without explicit owner approval.**
- Only production-backed information may be described as live; mock data is allowed for isolated test fixtures/staging and must not be presented as production output.
- Protect keystores, certificates, API credentials, tokens, signing identities, user data and test artifacts from public repos.
- Test permissions, denial flows, background/offline behavior, crash/ANR handling, accessibility and low-network states according to agreed scope.
- App publishing includes app-store review/policies and consent/privacy requirements applicable to the actual release; no guarantee of store approval.
- The mobile release specialist prepares an artifact and instructions; **owner approves signing and store publishing** separately.
- All code merges obey the client's existing CI, review, branch protection and rollback controls.

## Qualification exercise

Use an authorized demo/owned application, not a live customer deployment. Reproduce one known defect; implement a minimal correction; build; execute unit + mobile UI tests; verify affected screens on at least one supported environment; prepare a **dry-run** signed/release checklist (no actual publishing). Compare a simpler single-agent baseline to the specialized team on verified quality, work hours, cost and regressions.

See [delivery and roles](WORKFLOW.md) and [test/release templates](RELEASE_CHECKLIST.md).

**Not delivered by this PR:** a built app, running team, CI configuration, Play Console/App Store deployment or measured benchmark.
