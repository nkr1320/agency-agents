# NKR FailureGuard — Isolated Verification Snapshot

**Date:** 2026-11-08. **Code:** draft PR #5 branch `nkr/failure-intelligence-memory-v1`. **Status:** engineering evidence for the pure local add-on ONLY.

## Exact tests executed

Executed the **40 committed test bodies** from:
- `tests/nkr_failureguard_addon.test.mjs`
- `tests/nkr_failureguard_context.test.mjs`
- `tests/nkr_failureguard_events.test.mjs`

against the **exact committed JavaScript implementation** of `core.mjs`, `context-addon.mjs`, `event-adapter.mjs`, `failure-patterns.json` and `skill-map.json`.

**Result:** **40 passed / 0 failed**, using an isolated V8 JavaScript evaluator with Node-compatible testing assertion/structured-clone shims. **This was not a Node.js runtime, not GitHub Actions, and did not execute the separate prior seed-memory test file.** The standalone local `node --test` command remains unverified. No actual production permission boundaries were exercised.

Tested cases include: disabled by default; no signal/no hint; scope-specific MCP/CI/QA/build hints; 14+25+14 catalog integrity; bounded suggestions and context; repeat suppression; rejection of invalid checks/skills; malicious raw log/instruction not displayed; machine-readable 401/403, TS2322 and CI startup failures; event outcome/type/phase guards; and retrieval of a matching record after index 200 (no silent first-200 truncation).

## Microbenchmark (isolated V8, not Node.js)

Source: same committed functions, 53 catalog entries, 10,000 invocations per case, 100 warmups per case. Wall time observed with `Date.now()`, **millisecond clock resolution**. Single process; no model, external I/O, agent, CI or browser work.

| Case | Total for 10k | Approx. mean / call | Optional context bytes/characters | Note |
| --- | ---: | ---: | ---: | --- |
| Disabled | 2 ms | 0.0002 ms | 0 chars | No add-on context |
| Enabled, unrelated signal | 964 ms | 0.0964 ms | 0 chars | No add-on context |
| Recognized MCP HTTP 401 | 1,422 ms | 0.1422 ms | 278 chars | One short advisory |
| Recognized CI startup failure | 1,247 ms | 0.1247 ms | 269 chars | One short advisory |
| Already shown MCP hint | 1,328 ms | 0.1328 ms | 0 chars | Repeat suppressed |

**Interpretation:** This shows low local pure-JavaScript overhead at 53 patterns in this isolated evaluator, **not** a measured reduction in billed model tokens, full task latency, bugs, security incidents or agency operating cost. V8 environments and runtime optimization differ; numbers are exploratory and not SLAs. All code must be re-benchmarked with a working Node runtime and real agent tasks before adoption. A nonempty advisory incurs prompt tokens; it must save more downstream rework than it costs.

## GitHub Actions blocker

The new workflow `NKR FailureGuard Add-on Tests` did trigger, but the run **failed before any job steps were present**, as did inherited repository workflows. The actual job logs could not be retrieved with the currently available GitHub connection. Do **not** count those workflows as passing or claim the source of failure has been conclusively identified.

Required follow-up with GitHub repo administrator/runner access:
- View the Actions run UI summary/annotations and find the actual startup error.
- Check repository/organization Actions enablement, account billing/usage quotas, hosted runner availability, workflow policy and any fork restrictions.
- Re-run `node --test` suite on an available real Node 22 environment.
- Preserve required status checks; never disable security gates just to turn a badge green.

## Adoption gate

Keep default OFF until an authoritative, authenticated task manager emits trustworthy normalized failure events, the local Node tests pass, and the ON/OFF end-to-end benchmark measures actual cost, accepted deliverables, false alerts and disruptions for the three divisions. Approval to change production authorization or release policy remains separate and mandatory.
