# Mobile Application — Intake, QA, Release and Handover Templates

Blank operational forms. Do **not** enter guessed metrics or claim store approval.

## 1. Project intake

| Field | Required |
| --- | --- |
| Customer / job ID / app name and package/bundle ID | |
| Ownership and source repo authorization | |
| Target Android/iOS versions and devices | |
| Native or cross-platform stack selected (and why) | |
| Screens/features and approved reference designs | |
| API/auth/storage and third-party integration requirements | |
| Data privacy categories and runtime permissions | |
| Offline/background/notification requirements | |
| Accessibility and performance expectations | |
| Release signing owner and store account permissions | |
| Support, warranty and bug-fix boundaries | |
| Total budget, test fixtures and approval owners | |

## 2. Functional test ledger

- App version, build number, source SHA:
- Device/emulator OS and version:
- Case ID / feature / expected result:
- Observed action/output on actual execution:
- Status: PASS / FAIL / BLOCKED / NOT_RUN
- Logs, screenshots, recordings and private evidence path:
- Severity / reproducibility / regression risk:
- Fix PR and retest verification:

## 3. Pre-release gate

- [ ] Screens/features match approved scope; no known unreviewed high-severity defects
- [ ] Chosen platform build passes from reviewed source version
- [ ] Unit/integration/mobile UI checks executed; evidence retained
- [ ] Backend, auth, payments and any sensitive data pathways reviewed
- [ ] Permissions and privacy/consent disclosures verified for actual functionality
- [ ] Store listing copy, images, assets and ownership approved
- [ ] Version, build number, package ID and signing plan verified
- [ ] Artifacts/checksums logged in restricted workspace
- [ ] Internal/beta test feedback and supported device checks reviewed
- [ ] Staged release/rollout-halt and corrective-update plan documented
- [ ] Explicit owner approval to sign or publish

## 4. Customer delivery

# Mobile App Release Report — [customer/date]
- Approved scope and delivered screens:
- Git PR/commit/build artifact identifier:
- Platform matrix actually tested:
- Passed/failed/blocked/not-run checks:
- Fixed issues / outstanding issues:
- Runtime permission and privacy notes:
- Signing and store status (**not submitted / submitted / approved / rejected / released**, evidence-linked):
- Monitoring/support owner and escalation instructions:
- Change log, known issues and acceptance:
- Final client signoff:

## 5. Delivery economics

Measure actual total hours for design, engineering, QA, review, revisions and store follow-up, as well as attributable tools, subscriptions, test devices, hosting, APIs and refunds. Do not infer earnings from planned app prices.
