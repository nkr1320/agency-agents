/**
 * Adapter contract for normalized, independently verified task-runner events.
 *
 * This adapter is advisory-only. `trustedSource` is a caller assertion, NOT
 * authentication: the REAL control plane must authenticate event origin,
 * tenant, job, evidence and replay sequence before invoking this function.
 *
 * No network, disk, shell, editor hook, LLM call, permission change or
 * execution of the suggested checks.
 */
import {makeFailureContextAddon} from "./context-addon.mjs";

export const FAILURE_EVENTS = Object.freeze({
  "build.failed": "build",
  "ci.startup_failed": "verify",
  "mcp.error": "build",
  "tool.failed": "build",
  "integration.failed": "integrate",
  "test.failed": "verify",
  "qa.blocked": "verify",
  "review.changes_requested": "review",
  "release.blocked": "release",
  "agent.execution_failed": "build",
  "operations.alert": "operate"
});

const MAX_EVENT_SIGNALS = 8;
const MAX_SEEN_IDS = 100;

function blank(mode) {
  return {mode, text: "", surfaced_ids: [], matched_signals: 0};
}

function asSignal(value) {
  return typeof value === "string" && /^[a-z0-9][a-z0-9_-]{0,89}$/i.test(value)
    ? value.toLowerCase()
    : "";
}

function asPhase(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

/**
 * Returns a compact context supplement only when:
 * 1. a trusted CALLER explicitly opts in;
 * 2. the event type is a known FAILURE/BLOCKED event;
 * 3. at least one PRE-DEFINED signal exists in the reviewed catalog; and
 * 4. the phase-specific matcher finds an applicable lesson.
 */
export function adviseForVerifiedEvent(event, catalog, options = {}) {
  if (options.enabled !== true) return blank("DISABLED");
  if (options.trustedSource !== true) return blank("UNVERIFIED_EVENT_SOURCE");
  if (!event || typeof event !== "object" || Array.isArray(event)) return blank("INVALID_EVENT");
  if (!Object.hasOwn(FAILURE_EVENTS, event.kind)) return blank("IGNORED_EVENT");
  if (event.outcome !== "FAIL" && event.outcome !== "BLOCKED") return blank("IGNORED_OUTCOME");
  if (!catalog || catalog.schema_version !== 1 || !Array.isArray(catalog.records)) return blank("INVALID_CATALOG");

  // No fuzzy parsing of raw tool logs, markdown, websites or external prompts.
  const known = new Set(
    catalog.records.flatMap(r => Array.isArray(r.signals) ? r.signals : []).map(asSignal).filter(Boolean)
  );
  const normalized = Array.isArray(event.signals) ? event.signals.slice(0, MAX_EVENT_SIGNALS).map(asSignal).filter(Boolean) : [];
  const signals = [...new Set(normalized.filter(s => known.has(s)))];
  if (!signals.length) return blank("NO_RECOGNIZED_SIGNALS");

  // The event KIND determines canonical phase; caller-supplied phase may only
  // narrow it to a matching phase, never arbitrarily route to a release check.
  const expectedPhase = FAILURE_EVENTS[event.kind];
  const requestedPhase = asPhase(event.phase);
  if (requestedPhase && requestedPhase !== expectedPhase) return blank("PHASE_MISMATCH");

  const seen = Array.isArray(event.already_surfaced_ids)
    ? event.already_surfaced_ids.slice(0, MAX_SEEN_IDS).filter(s => typeof s === "string")
    : [];

  const result = makeFailureContextAddon({
    phase: expectedPhase,
    signals,
    already_surfaced_ids: seen
  }, catalog, {
    enabled: true,
    maxHints: options.maxHints,
    maxChars: options.maxChars,
    contextChars: options.contextChars
  });

  return {
    mode: result.mode,
    text: result.text,
    surfaced_ids: result.surfaced_ids,
    matched_signals: signals.length
  };
}
