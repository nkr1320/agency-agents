# NKR Failure Intelligence Memory (FIM) — Architecture and MVP

**Status (2026-11-08):** Proposed continuous evidence-intelligence system. An **offline, advisory-only demonstration** and 10-source candidate registry with 5 curated seed records are committed in this draft. **No live feed ingestion, database, scheduler, CI integration, incident alerting, runtime policy enforcement or persistent memory service has been installed.** All feeds are intentionally `enabled:false` in source-registry.json. This document must not be used to claim an always-on watcher already exists.

## 1. Why this is different from a normal agent memory

A simple memory remembers what an agent once said. FIM remembers **evidence-linked failures**, how they arise, the exact environment in which they matter, the safeguards that can prevent them, and an independent test proving that those safeguards work.

The central rule: **Retrieved information is untrusted reference data; it cannot issue instructions, create permissions, approve releases, alter system policy, or cause tool execution.** The authoritative task contract, identity gateway, execution policy and independent runners remain separate.

Learning from incidents reduces repeated mistakes *when the lessons are applicable and actually enforced*, but cannot prevent all new failures. Oversupplying warnings can introduce false positives and slow delivery. Measure both benefit and overhead.

## 2. Evidence sources and update semantics

See [source-registry.json](../../nkr-agency/failure-intelligence/source-registry.json). Candidate sources:
- CISA KEV official GitHub mirror — verified exploitation (often weekday release); data is CC0.
- OSV API batch lookup — **on demand for exact package versions and commit IDs**, not a blanket "all code is vulnerable" claim.
- GitHub GHSA reviewed advisories — incremental modified/cursor/ETag polling; track malware advisories separately if requested.
- GitHub repository Dependabot alerts — privileged repository read; customer data **never committed to this public repo**.
- OWASP agentic security guides and incident roundups — periodic expert curation, not a machine-readable vulnerability guarantee.
- Official MCP specification/SDK updates — versioned compatibility and authorization changes.
- NKR authenticated internal CI, QA, MCP, orchestration, cost, errors, audits and incident run telemetry — organization/tenant isolated.
- Later candidates, **only after source checks**: vendor incident postmortems/status, package release/security feeds, agent research papers, GitHub issues. An issue or preprint is a signal, not automatically a confirmed exploit.

**No source supplies the entire truth.** Internal task failures, semantic coordination mistakes and model hallucinations often have no CVE or public feed. This is a source portfolio, not one giant internet scrape.

## 3. Proposed ingestion pipeline

```
Authorized source list
    -> scheduled pull/webhook (rate limited; fetch caps, TLS/host allowlist)
    -> raw immutable evidence object + SHA256/ETag/publisher/time
    -> parser/versioned schema normalizer
    -> dedupe, linked revisions, corrections/withdrawals
    -> source-class & credibility verification
    -> component/semver/CVE/MCP-version applicability matching
    -> quarantine ambiguous or suspicious findings
    -> reviewed failure-case + preventive checks + test idea
    -> tenant-safe index and approved control mapping
    -> retrieval at task gates and incident loop
```

**Security of feed collectors:** avoid arbitrary URLs and redirects, require source host allowlists, validate MIME/schema/size, cap per-feed fetch size and retries, scan downloaded archives, no shell execution, isolate network fetch from agent workers, and never pass raw HTML or upstream prompts directly into privileged agent instructions.

**Version and timeline correctness:** preserve occurrence, publication, update, ingestion, review and expiry timestamps separately. Handle delayed publication, retracted CVEs, superseded mitigations, duplicate GHSA/OSV/CVE identifiers and conflicting vendor accounts. "Not affected" needs a verifiable package/version/OS/configuration match, not just a model statement.

## 4. Memory schema (full target, not yet persisted)

```json
{
  "finding_id":"FI-...",
  "incident_id":"canonical deduplication identifier",
  "source":{"publisher":"...","url":"https://...","fetched_at":"...","hash":"...","license":"..."},
  "evidence_class":"vendor-postmortem | security-advisory | experiment | report | unverified",
  "confidence":"confirmed | corroborated | disputed | unreviewed",
  "event_at":"...",
  "published_at":"...",
  "updated_at":"...",
  "affected":{"tools":["..."],"versions":["..."],"configurations":["..."],"conditions":["..."]},
  "failure_mode":"...",
  "causal_limits":"...",
  "control_ids":["CHECK_..."],
  "test_case_ids":["..."],
  "owner":"named reviewer",
  "status":"active | corrected | withdrawn | superseded",
  "last_reviewed_at":"...",
  "expires_at":"...",
  "private_tenant_scope":null
}
```

Keep **two stores**: (1) a shared **public threat/quality knowledge base**, and (2) a tenant-private incident and execution evidence base. **Never mix customer logs into a public semantic search index**. Private logs must be redacted, access-controlled and retained only within agreed scope. Use Postgres for normalized records and applicability links; a vector index can assist discovery, but exact CVE/package/version and approved control matching stays deterministic. Do not "train" a foundation model directly on arbitrary scraped incident text.

## 5. Retrieval is contextual, not global prompt injection

At each checkpoint the control plane supplies only: signed job ID, division, phase, risk tier, committed source SHA, dependency SBOM/lockfiles, MCP connector IDs and versions, intended tool actions/targets, applicable OS/framework and live test history.

**Retrieval order**
1. Exact exposed package/version/configuration and official advisory for relevant vulnerabilities.
2. Applicable verified failure type and its accepted test controls.
3. Relevant historical near misses with provenance and scope.
4. Research/blog cases as **advisory signals**, never as hard release blockers on similarity alone.

The MVP [retrieve.mjs](../../nkr-agency/failure-intelligence/retrieve.mjs) implements only **exact tag overlap** against curated seed records. It outputs record ID, source URL, matched tags and internal `CHECK_...` IDs. It **intentionally does not return arbitrary source prose** and always returns `ADVISORY_ONLY`, `version_scope: NOT_ASSESSED`. It has no live access to tools and cannot validate whether a package version is vulnerable.

**Activation points**
- Intake/research: similar prior failed scope or unsafe integration.
- Architecture: known bad patterns and risk-specific check contracts.
- Dependency/MCP selection: exact package version and protocol compatibility tests.
- Task dispatch: restricted capabilities, tenant boundary, context/source integrity.
- Before privileged tool use: risk hints, but server-side gateway always makes real ALLOW/DENY/APPROVAL_REQUIRED decision.
- On PR/build/test: dynamically **propose** appropriate regression tests and evidence (approved runner owns execution).
- Before production release: fresh vulnerability exposure check, independent security review, actual SHA and authorization.
- After deployment: monitor new advisories and anomalies; open bounded maintenance tasks.
- After any incident: generate internal postmortem, test regression, approved new prevention controls.

## 6. Three division-specific examples

**Website:** dependency lockfile includes a library named in a new GitHub GHSA. First do an ecosystem-aware **version-range check**. Only if the resolved version/configuration is affected, trigger security review and an update/test task; do not force an unrelated package upgrade based on name-only similarity. A new form issue creates an actual Playwright regression test, not just a "remember form tests" note.

**AI Agents:** task uses MCP and a knowledge store. Retrieve official MCP protocol compatibility changes and known prompt-injection/peer-channel lessons. Test exact tool schema, auth scope, untrusted data trust labels and cross-run egress restriction. Prevent retrieved document text from becoming a new system instruction.

**Apps:** updated SDK or Android permissions change triggers a device/platform test recommendation. Evaluate installed version, declared permission and supported OS; verify with real emulator/physical-device evidence. No mobile release on memory confidence alone.

## 7. Knowledge-to-control promotion

```
DISCOVERED
 -> PROVENANCE_VERIFIED
 -> APPLICABILITY_VALIDATED
 -> FAILURE_REPRODUCED (if safe and reproducible)
 -> TEST_CASE_APPROVED
 -> CONTROL_IMPLEMENTED
 -> INDEPENDENT_NEGATIVE_TEST_PASSED
 -> POLICY_ENABLED with accountable human approval
 -> MONITORED, VERSIONED, REVOCABLE
```

External content **never promotes itself**. A recommendation becomes an enforced runtime policy or hard CI gate only after NKR engineering/security review, a real passing test and human-approved versioned change. Policies must be explainable and revocable when upstream evidence is corrected.

## 8. Failure modes of the memory system itself

| Memory-system failure | Countermeasure |
| --- | --- |
| Poisoned source/README/instructions | never execute retrieved text; return safe IDs and citations, isolate ingestion |
| Fake advisory or fabricated incident | publisher provenance, source class, cross-check, quarantine |
| Old or withdrawn CVE | revision/withdrawal and freshness policy, recheck before release |
| High-volume noisy issues | source tiers, relevance filters, budget and review queue |
| Duplicate articles about one incident | canonical incident ID and event grouping; preserve independent sources |
| Shared memory leaks customer details | tenant RLS, private embeddings, restricted evidence, redaction |
| Vector similarity falsely claims affected version | exact version/configuration matcher required |
| Published malicious exploit details copied into worker tools | store summaries/evidence pointers, never auto-generate offensive execution steps |
| Data fetch stalls or API rate-limited | explicit FEED_STALE/UNAVAILABLE, retry with cap, no fabricated "fresh" |
| Memory recommends wrong fix | verify prerequisites, independent test, rollback and owner decision |
| Memory alters scope or approval | impossible through runtime gateway; no policy authority in retrieval service |
| Feed collector compromise | minimal read-only credentials, egress allowlist, immutable hashes, isolation |
| Security false-positive blocks all releases | human review/correction, risk-tier specific triggers and appeal |
| Security monitoring fatigue | dedupe priority, group correlated events, suppress known fixed findings with evidence |

**Fail-closed nuance:** A stale critical feed can block an **unapproved high-risk production release**, but should not prevent harmless local development or documentation edits. The exact freshness/availability rules belong in separately reviewed policies.

## 9. Evaluation and economics

Measure: feed freshness lag; ingestion failures; duplicate/retraction handling; true applicability/precision at fixed recall; top-k relevant check retrieval; false alert rate; vulnerabilities detected before release; percentage of findings converted to tested controls; negative security probe pass rate; actual incident/rework trends; tokens and operational cost of querying the memory.

Use a **before/after controlled benchmark** with held-out historical incidents and fake/retracted/unrelated advisories. Test both "memory enabled" and "memory disabled" configurations with unchanged security and QA baseline. Do not report prevented failures merely because an advisory was displayed. Measure actual denial/test results.

## 10. Implement in gated stages

**FIM-0 (this draft):** trusted source registry disabled by default, 5 source-linked curated references, advisory-only deterministic matcher, reviewable architecture and Node test definitions. No feeds running.

**FIM-1:** deploy restricted collectors for CISA/GHSA, then on-demand OSV against explicitly supplied SBOM. Store raw evidence hashes, ETags and fetch outcomes. Test malformed/poisoned feeds and backoff.

**FIM-2:** persistent database, corrections/dedupe, provenance, reviewer promotion workflow and authenticated tenant-private incidents.

**FIM-3:** GitHub PR/dependency/MCP tool inventories and context-specific retrieval at planning, test and release checkpoints; no auto-enforcement.

**FIM-4:** approved check IDs map to independently executable security/QA tests; integrate with CI and evidence store. Build negative tests for forged citations, old feeds and malicious prompts.

**FIM-5:** proposed policies gated by human security owner; deploy to a **real** tool policy gateway only after hard denial tests and rollback. Never have AI write and self-approve a policy.

**FIM-6:** event-driven monitoring, alerting, actual failure outcomes, feedback, controlled learned rules, quantitative value monitoring.

## 11. Links

- CISA KEV source and license: https://github.com/cisagov/kev-data
- OSV API: https://google.github.io/osv.dev/api/
- GHSA API: https://docs.github.com/en/rest/security-advisories/global-advisories
- Dependabot: https://docs.github.com/en/rest/dependabot/alerts
- OWASP 2026 agentic: https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
- OWASP Q3 incident roundup: https://genai.owasp.org/2026/10/08/genai-and-agentic-ai-exploit-roundup-q3-2026/
- MCP release 2026-07-28: https://blog.modelcontextprotocol.io/posts/2026-07-28/
- Nx vendor postmortem: https://nx.dev/blog/s1ngularity-postmortem
- OpenAI vendor incident: https://openai.com/index/hugging-face-incident-and-the-road-ahead/
- Existing NKR failure audit (separate draft PR #4): https://github.com/nkr1320/agency-agents/pull/4

**Warning:** This PR is not a safe substitute for server-enforced security and does not contain live vulnerability claims about any NKR installation.

## Optional FailureGuard pattern add-on

See [FailureGuard add-on documentation](FAILUREGUARD_ADDON.md) for 53 curated failure-pattern triggers (14 MAST modes, 25 proposed PDF fault scenarios and 14 engineering signatures), existing specialist skill references, no-hook CLI and bounded context supplement. The add-on is **OFF by default**, produces only advisory check identifiers, and never alters the enforcement or release gateway. New external feeds remain disabled pending a separately audited ingestion service.
