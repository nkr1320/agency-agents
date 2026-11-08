# FailureGuard validation and local performance protocol

**Status:** Tests/benchmark defined in draft PR #5. Running this suite requires a local Node.js 22+ environment or a working GitHub Actions runner. No paid model or cloud integration is involved.

## Run

```bash
node --test tests/nkr_failure_memory.test.mjs tests/nkr_failureguard_addon.test.mjs tests/nkr_failureguard_context.test.mjs tests/nkr_failureguard_events.test.mjs
node nkr-agency/failure-intelligence/addon/benchmark.mjs
```

GitHub workflow: `.github/workflows/nkr-failureguard-tests.yml`, read-only `contents:read`, 5-minute timeout, no `npm install` or secrets. It is proposed and must successfully execute before the PR is considered validated.

## What results do and don't prove

The microbenchmark measures local per-event JavaScript overhead across five cases: default OFF, unknown signal, matching MCP, matching CI and repeat suppression. Report p50/p95 function latency and prompt-context characters without model calls. **Do not convert characters/4 into actual model-billed tokens** or claim a speedup for software delivery from a local JS microbenchmark.

The real business qualification should test:
- The same approved Website, AI Agent and App tasks with FailureGuard OFF and ON.
- Actual task acceptance, reproducible defects, false positives and warning usefulness.
- End-to-end elapsed time, human corrections, cost per accepted output and real token counts obtained from model-provider usage.
- Safety failures and negative tests held constant (FailureGuard may never disable mandatory security gates).
- No global hooks, secrets, automatic repairs, extra LLM invocations or production permissions.

## CI problem to resolve

Existing inherited GitHub Actions workflows have repeatedly returned **failure with no job steps**. Job logs are unavailable through the available connection; the root cause cannot be asserted. An admin should inspect the Actions run UI and repository/org Actions permissions, hosted runner availability and billing/usage limits. Do not incorrectly diagnose this as a FailureGuard code-test failure.

## Go/no-go

- All Node tests actually pass on supported Node environment.
- No warnings on benign/no-match events.
- Advisor text is bounded; no hidden network calls or modifications.
- Human reviewer validates suggestions are not promoted to policy.
- Measured accepted-task efficiency improves or stays acceptable with no increase in critical failures.
- Rollback is removing the voluntary adapter call; original task management/QA/security continues unchanged.
