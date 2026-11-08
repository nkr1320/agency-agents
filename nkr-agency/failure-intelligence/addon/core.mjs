/**
 * NKR FailureGuard add-on: local, deterministic, advisory-only risk retrieval.
 * OFF by default; no network, LLM, filesystem access, hooks or writes.
 * It NEVER grants tool permissions, executes checks, or certifies completion.
 */
export const LIMITS = Object.freeze({maxHints: 3, defaultHints: 2, maxChars: 1600, defaultChars: 850, maxSignals: 32});

function token(value) {
  return typeof value === "string"
    ? value.trim().toLowerCase().replace(/\s+/g, "-").slice(0, 90)
    : "";
}

function boundedInteger(value, fallback, low, high) {
  return Number.isSafeInteger(value) ? Math.max(low, Math.min(high, value)) : fallback;
}

function empty(mode) {
  return {mode, hints: [], omitted: 0, estimated_tokens: 0};
}

/**
 * The only authoritative input to activate this module is options.enabled.
 * The task JSON cannot switch on protections, access tools or grant authority.
 */
export function assessFailureGuard(task, catalog, options = {}) {
  if (options.enabled !== true) return empty("DISABLED");
  if (!task || typeof task !== "object" || Array.isArray(task)) return empty("INVALID_TASK");
  if (!catalog || catalog.schema_version !== 1 || !Array.isArray(catalog.records)) return empty("INVALID_CATALOG");
  const stageAliases = {architecture: "plan", planning: "plan", implementation: "build", development: "build", integration: "integrate", qa: "verify", testing: "verify", improve: "operate", maintenance: "operate"};
  const rawPhase = token(task.phase);
  const phase = stageAliases[rawPhase] || rawPhase;
  if (!phase) return empty("MISSING_PHASE");
  const rawSignals = Array.isArray(task.signals) ? task.signals : [];
  const signals = new Set(rawSignals.slice(0, LIMITS.maxSignals).map(token).filter(Boolean));
  if (signals.size === 0) return empty("NO_SIGNALS");
  const seen = new Set((Array.isArray(task.already_surfaced_ids) ? task.already_surfaced_ids : []).slice(0, 100).filter(x => typeof x === "string"));
  const maxHints = boundedInteger(options.maxHints, LIMITS.defaultHints, 0, LIMITS.maxHints);
  const maxChars = boundedInteger(options.maxChars, LIMITS.defaultChars, 160, LIMITS.maxChars);
  const candidates = [];
  // Read every record in the reviewed catalog. The previous hard first-200
  // cap could silently hide relevant lessons appended by future ingestion.
  for (const record of catalog.records) {
    if (!record || seen.has(record.id) || !Array.isArray(record.phases) || !record.phases.includes(phase) || !Array.isArray(record.signals)) continue;
    const matches = record.signals.filter(s => signals.has(token(s)));
    if (!matches.length || !Array.isArray(record.checks) || !record.checks.length) continue;
    const priority = record.severity === "P0" ? 100 : record.severity === "P1" ? 40 : 10;
    const specificity = matches.length * 10 + (record.group === "ENGINEERING_FAILURE_PATTERN" ? 2 : 0);
    candidates.push({record, matches, score: priority + specificity});
  }
  candidates.sort((a, b) => b.score - a.score || a.record.id.localeCompare(b.record.id));
  const out = {mode: "ADVISORY_ONLY", hints: [], omitted: 0, estimated_tokens: 0};
  const total = candidates.length;
  for (const candidate of candidates) {
    if (out.hints.length >= maxHints) { out.omitted++; continue; }
    const r = candidate.record;
    const hint = {
      id: r.id, severity: r.severity, trigger: candidate.matches.slice(0, 2),
      check: r.checks[0], skill: r.skill_id, remedy: r.remedy
    };
    const trial = {...out, hints: [...out.hints, hint], omitted: total - out.hints.length - 1, estimated_tokens: 9999};
    if (JSON.stringify(trial).length > maxChars) { out.omitted++; continue; }
    out.hints.push(hint);
  }
  const candidateTokenEstimate = Math.ceil(JSON.stringify(out).length / 4);
  out.estimated_tokens = candidateTokenEstimate;
  // Ensure even the final estimate fits: trim only advisory hints, never weaken a real policy.
  while (out.hints.length && JSON.stringify(out).length > maxChars) {
    out.hints.pop();
    out.omitted++;
    out.estimated_tokens = Math.ceil(JSON.stringify({...out, estimated_tokens: 0}).length / 4);
  }
  return out;
}

export function validateFailureGuardCatalog(catalog, skillMap) {
  const errors = [];
  if (!catalog || catalog.schema_version !== 1 || !Array.isArray(catalog.records)) return ["Invalid catalog"];
  if (!skillMap || skillMap.schema_version !== 1 || !Array.isArray(skillMap.skills)) return ["Invalid skill map"];
  const ids = new Set();
  const skills = new Set(skillMap.skills.map(s => s.id));
  const validPhases = new Set(["intake","research","plan","design","dispatch","build","integrate","verify","review","release","operate"]);
  for (const r of catalog.records) {
    if (!r || typeof r.id !== "string" || ids.has(r.id)) errors.push("Duplicate or missing ID");
    if (r?.id) ids.add(r.id);
    if (!["MAST_RESEARCH","PDF_FAULT_SCENARIO","ENGINEERING_FAILURE_PATTERN"].includes(r?.group)) errors.push("Invalid group: "+r?.id);
    if (!["P0","P1","P2"].includes(r?.severity)) errors.push("Invalid severity: "+r?.id);
    if (!Array.isArray(r?.signals) || !r.signals.length || r.signals.some(s => !token(s))) errors.push("Invalid signals: "+r?.id);
    if (!Array.isArray(r?.phases) || !r.phases.length || r.phases.some(p => !validPhases.has(p))) errors.push("Invalid phases: "+r?.id);
    if (!Array.isArray(r?.checks) || !r.checks.length || r.checks.some(c => typeof c !== "string" || !/^CHECK_[A-Z0-9_]+$/.test(c))) errors.push("Invalid check IDs: "+r?.id);
    if (!skills.has(r?.skill_id)) errors.push("Missing skill: "+r?.id);
    if (typeof r?.remedy !== "string" || r.remedy.length > 200 || !r.remedy.trim()) errors.push("Invalid remedy: "+r?.id);
    if (!["research_taxonomy","proposed_qualification_test","engineering_design_pattern"].includes(r?.evidence_class)) errors.push("Invalid evidence: "+r?.id);
  }
  return errors;
}
