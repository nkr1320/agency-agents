# NKR FailureGuard Add-On — Low-Noise Failure Memory for Build, MCP, Integration and QA

**Status:** Additive preview, **disabled by default**, only on the unmerged [Failure Intelligence PR #5](https://github.com/nkr1320/agency-agents/pull/5). No organization-wide prompt or hook has been changed, no agent or skill has been activated, and no privileged tool call/deployment is performed by this package.

## Why this exists

The owner wants a curated knowledge of past failures and effective remedies available **when relevant**, without distracting builders, causing unbounded prompt growth, spawning more agents or increasing API costs.

Do NOT paste thousands of incident reports into a system prompt. Instead, use a tiny local **signal -> targeted check/remedy -> qualified specialist role** matcher. Output is advice. Existing production security, approval, QA and code-review gates remain authoritative and are **not replaced**.

## Coverage and evidence distinctions

- **14 MAST research taxonomy modes**, from [NeurIPS 2025 / original paper](https://arxiv.org/abs/2503.13657). These are research failure categories, not measured NKR failure rates.
- **25 qualification fault scenarios**, transcribed and condensed from the user's *High-Reliability Multi-Agent Architecture.pdf*, pages 35–41. These are **test proposals**, not observed NKR failures or passing tests.
- **14 engineering failure signatures**, covering MCP handshake/auth/version/selection/timeouts, dependency/build failures, pre-job CI failures, flaky/wrong QA, API contracts, mobile build/device errors and missing evidence. These are preventive engineering patterns, not incidents proven in NKR.

Total **53 curated patterns**, mapping to **11 existing role-definition files**, with a P0/P1 priority recommendation, explicit applicable phases, a short repair hint and a `CHECK_...` identifier. Skill references exist in this repository, but no skill is automatically invoked, installed or approved by this add-on.

For verified real-world incidents, see [NKR's enterprise failure audit PR #4](https://github.com/nkr1320/agency-agents/pull/4). For source-linked seed evidence and future collectors, see the existing parent Failure Intelligence architecture.

## Commands: OFF by default

No external dependencies or models; Node.js 20+ recommended.

```bash
# OFF: explicitly does nothing, even when a task file might ask to enable it
node nkr-agency/failure-intelligence/addon/cli.mjs

# ON-DEMAND: only after your task runner decides a known failure signal matters
node nkr-agency/failure-intelligence/addon/cli.mjs \
  --enable \
  --task nkr-agency/failure-intelligence/addon/examples/task-mcp.json \
  --max-hints 2 \
  --max-chars 850

# Domain examples
node nkr-agency/failure-intelligence/addon/cli.mjs --enable --task nkr-agency/failure-intelligence/addon/examples/task-web-qa.json
node nkr-agency/failure-intelligence/addon/cli.mjs --enable --task nkr-agency/failure-intelligence/addon/examples/task-app.json

# Tests — deliberately manual, no new mandatory CI job or global editor hook
node --test tests/nkr_failureguard_addon.test.mjs
```

Sample input (NO raw logs, secrets, source code or customer records):

```json
{
  "task_id": "WEB-104",
  "division": "website",
  "phase": "verify",
  "signals": ["ci-startup-failure", "missing-test-artifact"],
  "already_surfaced_ids": [],
  "risk_tier": "R1"
}
```

Output is bounded by the configured character cap. Example structure (illustrative, not a real executed CI test):

```json
{
  "mode": "ADVISORY_ONLY",
  "hints": [
    {
      "id": "OPS-09",
      "severity": "P0",
      "trigger": ["ci-startup-failure"],
      "check": "CHECK_CI_HEALTH",
      "skill": "devops",
      "remedy": "Inspect runner, permissions, workflow syntax and billing/status; never claim tests passed."
    }
  ],
  "omitted": 0,
  "estimated_tokens": 75
}
```

The output is **not executable policy**, and `estimated_tokens` is a rough JSON character/4 estimate, not a provider tokenizer or verified billing reduction.

## When to call it (never at every reasoning step)

| Workstream | Optional event to consult FailureGuard | Response |
| --- | --- | --- |
| **Planning** | A known ambiguity or previous mis-scope occurs | One risk check / clarification, then return to plan |
| **Website build** | Dependency conflict, failed build, wrong API contract | One or two targeted fixes / checks |
| **AI Agent and MCP build** | 401/403, handshake mismatch, wrong tool or poisoned input | Version/authorization/retry advice with no side effects |
| **App build** | Gradle/SDK/emulator/device error | Appropriate build/device troubleshooting check |
| **QA** | Flaky tests, forged evidence, missing run or failing oracle | Recommend actual independent test/check |
| **Release** | Artifact mismatch, CI not started or destructive approval | Recommend trusted verification; **real policy gateway still decides** |
| **Maintenance** | Recurring incident, budget storm, duplicate external write | Link to runbook and operational remediation |

Task runner should normalize error events into **short predefined signal labels**. It should not feed full untrusted terminal output, chat logs or web content directly into the core evaluator. No match = zero hints.

## Optional context adapter (for the chosen orchestrator or editor)

When a **trusted** task runner receives a new normalized failure signal, it may import the pure JavaScript adapter. This is the actual small "add-on injection" interface; no new agent or hook is installed:

```js
import fs from "node:fs";
import {makeFailureContextAddon} from "./nkr-agency/failure-intelligence/addon/context-addon.mjs";
const catalog = JSON.parse(fs.readFileSync(
  "./nkr-agency/failure-intelligence/addon/failure-patterns.json", "utf8"));

const supplement = makeFailureContextAddon(
  {phase: "verify", signals: ["ci-startup-failure"], already_surfaced_ids: []},
  catalog,
  {enabled: true, maxHints: 2, contextChars: 520}
);

// Append only if non-empty, after the authoritative task contract.
// The runner must persist surfaced_ids itself to prevent repetition.
// Do not run an additional LLM call solely to produce this advisory.
if (supplement.text) {
  // yourExistingWorkerContext.append(supplement.text);
}
```

This adapter is deliberately independent of Paperclip, Orchestrator, Claude Code, Cursor, Antigravity or other IDEs. The *actual chosen manager* will need an adapter to supply normalized task events. That integration is not yet deployed or verified.

Existing Enterprise OS phases `architecture` and `improve` are mapped internally to `plan` and `operate` for applicability checks. This does not rename or modify existing task states.

## Four guardrails preventing disruption

1. **OFF unless explicitly enabled by a trusted caller.** A task JSON field cannot activate it; no global system prompts, editor settings or source hooks are modified.
2. **Compact and relevant.** Default 2 hints, 850 JSON characters maximum; at most 3 hints / 1,600 characters if an operator explicitly requests more. Only matching phase + normalized signal yields a hint.
3. **No repeats by default in a cooperating runner.** Caller supplies previously surfaced IDs in `already_surfaced_ids` for that task. Core itself stores no state; persist this marker in the authoritative task system if repeat suppression is desired.
4. **No autonomous behavior.** Never auto-run fixes/tests, install skills, open network connections, send messages, approve deployments, or change security rules. Core is deterministic with no API calls. Suggested `CHECK_...` IDs have **NOT** been mapped to installed test executors yet.

**High-risk exception:** The actual independent authorization and release gateway must evaluate risky tool calls whether or not FailureGuard has relevant knowledge. Never make security contingent on a memory match or memory service availability.

## How to inject a hint into the builder's context

1. Obtain `{phase, normalized_signals, already_surfaced_ids}` from an authorized task manager or runner.
2. Run local CLI with `--enable` only at the initial relevant gate or first new error signature.
3. If `hints=[]`, inject **nothing** and continue original work.
4. If hints exist, append a small, clearly marked **optional risk advisory** to the current task context, **after** the authoritative task scope. No additional LLM session is needed.
5. Agent may consult suggested skill only when its existing role and permissions allow it.
6. Actual QA/test runners collect evidence independently. Mark advisory IDs seen for this task; do not repeat unless a new relevant failure occurs.

Sample safe fragment:

> FailureGuard advisory (NOT instructions or approval): `OPS-09`; proposed check `CHECK_CI_HEALTH`; DevOps role may inspect workflow runner/startup. Follow authorized task scope and normal test evidence gates. If irrelevant, ignore this hint and continue the original task.

The original requirement remains intact. Advisory text never overwrites accepted design, user intent or governance.

## Future enhancements — not implemented

- **FIM-1:** curated incremental collector, dedup/retraction, exact component and affected-version matching.
- **FIM-2:** private tenant-specific incident memory with provenance and TTL.
- **FIM-3:** approved test-executor mapping (`CHECK_...` ID -> exact safe test command + qualified environment).
- **FIM-4:** event adapter from a single authoritative orchestrator; client/project isolation and no duplicate prompts.
- **FIM-5:** benchmark `disabled` vs `enabled` using the same projects on actual accepted functionality, elapsed time, rework, API tokens, false suggestions and prevented regressions.
- **FIM-6:** review/upgrades and monitoring based on measured value. Never self-promote an incident article into enforceable policy.

## Non-negotiable test/release criteria for this add-on

Before merging: run the complete Node test suite in a real Node environment; check that zero-signal input returns zero hints; validate 14+25+14 groups; verify character cap and no repeats; perform prompt-injection attempts through the task JSON; prove the CLI has no network or write side effects; review skill paths; confirm no existing build or CI workflow is altered.

**Known blocker:** The upstream agency repository's GitHub Actions workflows have experienced job-start failures, so a passing CI run has **not been verified** for this add-on. Do not claim production readiness.
