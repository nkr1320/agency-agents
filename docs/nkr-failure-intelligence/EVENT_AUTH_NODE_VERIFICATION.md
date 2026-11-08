# Signed FailureGuard Event Gate — Local Node Verification

**Date:** 2026-11-08 UTC; branch `nkr/failure-intelligence-memory-v1` (unmerged PR #5). This report documents **real Node.js execution for exactly two files**, not a full repository/CI pass.

## Verified artifacts

- `nkr-agency/failure-intelligence/addon/event-auth.mjs`
  - SHA-256: `2095271934cfdf8cb687659b2267ead1dc5063fb46dc909fd0cee7fcaaf03a88`
  - Original GitHub file and local file text fingerprints matched exactly before Node test execution.
- `tests/nkr_failureguard_event_auth.test.mjs`
  - SHA-256: `48765d56cf1efd976acff9994100637e8080e57b00021c615eae27cff4f4b3cd`
  - Original GitHub test and local test text fingerprints matched exactly.

## Actual Node.js result

Environment: local Node.js **v22.16.0**. Command:
```sh
node --test tests/nkr_failureguard_event_auth.test.mjs
```

**Result: 20 tests, 20 passed, 0 failed.** This exercised real Node.js `node:crypto` HMAC, tenant/project binding, tampering, timestamp rules, missing/weak keys, closed replay stores and both sync/async unique-event reservation paths.

The test key is a **fixed public fixture only**, not a live secret. Concurrency tests use an in-process Set to simulate atomic first-insert; this is **not proof of an independently durable database reservation**.

## Other qualifications remain incomplete

- 52 prior pure FailureGuard/Paperclip-bridge tests passed in an isolated V8 shim evaluator, not Node.
- Signed composition was probed with 3 mock-driven V8 checks, not a real Paperclip server or full Node suite.
- GitHub Actions **still fails before any job steps execute**, including inherited workflows. Cause not confirmed from available logs.
- The local Node run does not validate real Paperclip event authenticity, durable RLS/tenant isolation, external network permissions, secret storage, sandbox security, customer data safety or model token usage.

Required next proof: execute all Node test files under a functioning CI runner, then run signed-event ingestion against an actual authenticated, sandboxed manager with persistent replay protection.
