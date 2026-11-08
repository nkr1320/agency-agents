# Mobile App Team — Responsibility and Approval Contracts

## Shared record

Every job specifies: job ID, app owner and authorized source repo, target OS versions/devices, selected stack, approved screen list, app permissions, data and integration constraints, acceptance criteria, time/cost limits, and review authority.

## Milestones, outputs, independent gates

| Stage | Owner | Evidence required | Gate |
| --- | --- | --- | --- |
| Scope | Project manager | versioned screen/features inventory and budget | owner scope approval |
| UX | UI/UX lead | designs for loading, error, empty, success, permission denied and offline states | screen acceptance |
| Architecture | Mobile lead | modules, data flow, auth, offline strategy, dependencies | code-reviewable plan |
| Build | Platform builder | branch PR, build output and tests | CI/build check |
| QA | Platform tester | test run files, device/emulator versions, screenshots/recordings and defects | no critical unexplained failures |
| Security/privacy | Independent reviewer | consent/permission, token handling, network/storage review | signoff or explicit block |
| Release preparation | Mobile release specialist | reproducible artifact, checksums, version, signing and rollback notes | owner approves any signing/publishing |
| Post-launch | Operations owner | crash/ANR, issue, store and support triage | issue ownership and maintenance SLA |

## Separation of duties

Developer does not self-approve production release. Review artifacts belong to a customer-authorized, access-controlled workspace. Agent outputs are advisory unless backed by actual execution, authorized credentials and evidence. Protect client repositories with private access and separate branches. Any migration or change affecting live user data requires a reviewed plan.

## Test matrix (choose for actual app)

- Functional routes and primary customer journeys
- Login/logout, permissions and token expiry
- Input validation, API errors and unsafe state changes
- Loading, error, empty, offline and background/resume states
- Screen sizes/orientation and accessibility
- App startup and crash behavior
- Existing data preservation across upgrade/install (where relevant)
- Payments, notifications, camera, location, printer/Bluetooth or other hardware only if part of approved functionality
- Secret scanning and dependency security
- App-specific regression after fixes

**Browser Playwright is appropriate for web interfaces and some webviews, but not a substitute for native mobile UI and device testing.** Use platform-appropriate instrumentation/frameworks once the stack is chosen.

## Intervention and rollback

If signing credentials are unavailable, device results differ, permissions are overbroad, privacy disclosures are incomplete, or the release track is unclear, mark BLOCKED and request owner action. A store submission cannot be treated as a reversible ordinary Git deployment; document update/roll-forward and rollout-halt procedures.
