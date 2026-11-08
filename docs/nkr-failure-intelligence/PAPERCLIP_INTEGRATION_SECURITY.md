# FailureGuard / Paperclip bridge — security boundaries and integration gate

**Status (2026-11-08):** Optional library modules and source-verified Paperclip integration design in draft PR #5. Paperclip has NOT been installed, modified, connected, or deployed by this PR.

## Verified compatibility surface

Upstream mirror: `nkr1320/nkr-paperclip` `master` at commit `fda58d8cc175c2a75876bed120e060af2ae56e33`.

- `docs/agents-runtime.md`: agent heartbeat statuses include `queued`, `running`, `succeeded`, `failed`, `timed_out`, `cancelled`. The runtime stores error excerpts and usage when supported.
- `docs/adapters/creating-an-adapter.md`: adapter execution receives `runId`, `agent.companyId`, structured run context and events. Output contains `errorMessage`, which **must not be promoted to authoritative error codes without a trusted parser**.
- `docs/adapters/external-adapters.md`: an external adapter can be registered without editing Paperclip's core source.
- **Security blocker:** `docs/agents-runtime.md` explicitly says local CLI adapters run **unsandboxed on the host**. Never let a local CLI worker access production customer secrets, unrestricted cloud identities or unrelated customer workspaces.

An external adapter API exists, but **we have not verified a supported post-run trigger with authenticated server signatures**. A narrow server-side event bridge must be designed and reviewed before installing anything. Do not invent a Paperclip callback API.

## Components staged (disabled by default)

| Component | Responsibility | Limitation |
| --- | --- | --- |
| `event-auth.mjs` | SHA-256 HMAC verification, company/project binding, TTL, signed fields, durable replay reservation | Signing and trusted session/tenant validation must be implemented server-side |
| `signed-paperclip-bridge.mjs` | Only passes authenticated, non-replayed events to the advisory mapper | Composed module not yet integration tested against a running Paperclip server |
| `paperclip-bridge.mjs` | Maps failed Paperclip run records to reviewed failure advice | Cannot authenticate alone; `sourceAuthenticated` is **only a caller assertion** |
| `event-adapter.mjs` | Filters valid failure kinds, structured error codes and allowed phases | Must receive trustworthy normalized machine codes |
| `context-addon.mjs` | Returns at most 520 characters of optional context by default | Adding context to a real LLM requires a selected, reviewed manager integration |

## Recommended server-side flow (future)

1. Paperclip produces a completed failed/timed-out run event from a trusted adapter or independent test runner.
2. Trusted infrastructure verifies Paperclip actor, company, project, run, authorization and real structured machine failure codes. Ignore agent-generated `errorMessage` as authority.
3. A dedicated service with a **server-only 256-bit or stronger random HMAC key** signs the canonical event envelope (`kid` supports rotation). Agent worktrees and IDEs never receive this key.
4. The receiving service checks signature, **expected tenant/project from authenticated server context**, event expiry, and atomic replay reservation in a durable store.
5. Only then does the signed Paperclip bridge map it to an advisory. If no relevant failure matches, no context is injected and no extra model call occurs.
6. A chosen manager appends the optional context to the already authorized task, while maintaining the original task specification, security gateway, test requirements and release authorities.
7. `surfaced_ids` are recorded against the job so the same hint is not repeatedly sent. Revoke a hint if a corrected or superseded case invalidates it.

**Important:** The replay reservation must be a unique atomic database transaction (e.g. insert-on-conflict-do-nothing). A process-local Set is only suitable for tests; it is not safe across servers or restarts. A database outage must block the event advisory, not relax production policy. `verifyFailureEventAsync()` supports asynchronous durable stores.

**Scope limit:** HMAC authenticates an event *publisher* and payload integrity, not the truth of a model-generated statement or correctness of an application. Actual QA evidence must come from independent, trusted runners.

## Zero-disruption policy

- **Feature flag OFF by default** at the chosen manager. No global prompt hooks, new always-on workers or scheduled polling.
- Only failed or blocked recognized events may introduce a short advisory. Successful and unrelated tasks get no additional prompt context.
- Unknown/poisoned error messages are not parsed to create new policy or privileges.
- The add-on must never run an MCP tool, install a skill, modify code, approve a release, or execute a suggested `CHECK_...` action.
- If the memory service is unavailable, normal development continues, but all existing **mandatory** security and release gates still run.

## Verification and outstanding work

- `event-auth.mjs` and `tests/nkr_failureguard_event_auth.test.mjs`: **20/20 passed in real local Node.js v22.16.0**; exact content of these two files was fingerprint-matched with this GitHub draft branch.
- Existing local core/bridge test bodies: **52 passed / 0 failed in isolated V8 with Node-compatible shims**, *not* an end-to-end Paperclip integration test.
- Signed bridge composition: three isolated mock-driven routing checks; **full cryptographic Paperclip-to-LLM integration remains untested**.
- GitHub Actions workflows, including new NKR scoped test job: startup failure with **zero job steps**. No CI test result is claimed.
- No real persistent replay DB, HMAC key store, manager connector, active source feed, sandboxed Paperclip instance or actual model token savings.

**Deployment gate:** Fix GitHub Actions, execute all committed Node tests, review source/permission contracts, verify a real sandbox, and benchmark OFF vs ON using actual accepted project tasks. Keep this in draft.
