/**
 * NKR FailureGuard bridge contract for Paperclip run events.
 *
 * Paperclip is the task manager. This file does NOT install a plugin, subscribe
 * to events, access its DB/API, activate any agent, or write context by itself.
 * The manager-side caller MUST authenticate the origin and bind company/run IDs
 * before passing a normalized record to this function.
 *
 * Importantly: Paperclip's errorMessage and stdout/stderr are NEVER scanned or
 * given to an LLM to guess a signal. Only approved structured failure codes
 * from trusted adapters/test runners are considered.
 */
import {adviseForVerifiedEvent} from "./event-adapter.mjs";

const ROUTES = Object.freeze({
  mcp: {kind:"mcp.error",phase:"build"},
  build: {kind:"build.failed",phase:"build"},
  ci: {kind:"ci.startup_failed",phase:"verify"},
  integration: {kind:"integration.failed",phase:"integrate"},
  qa: {kind:"test.failed",phase:"verify"},
  review: {kind:"review.changes_requested",phase:"review"},
  release: {kind:"release.blocked",phase:"release"},
  ops: {kind:"operations.alert",phase:"operate"},
  agent: {kind:"agent.execution_failed",phase:"build"}
});

function blank(mode) {
  return {mode, context:"", surfaced_ids:[],run_id:null};
}

function safeId(v) {
  return typeof v === "string" && /^[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,127}$/.test(v);
}

/**
 * Example input from a VERIFIED server-side adapter:
 * {
 *   companyId: "company-A", agentId:"agent-1", runId:"run-abc",
 *   status:"failed", failureDomain:"mcp",
 *   structuredErrorCode:"MCP_AUTH_FAILED", httpStatus:401,
 *   validatedSignals:["mcp-401"], alreadySurfacedIds:[]
 * }
 *
 * options.sourceAuthenticated is NOT an authentication implementation; it must
 * be set only by the service that verified actual session/webhook credentials.
 */
export function adviseFromPaperclipRecord(record,catalog,options={}) {
  if (options.enabled !== true) return blank("DISABLED");
  if (options.sourceAuthenticated !== true) return blank("UNAUTHENTICATED_SOURCE");
  if (!record || typeof record !== "object" || Array.isArray(record)) return blank("INVALID_RECORD");
  if (!safeId(options.expectedCompanyId) || !safeId(record.companyId) ||
      record.companyId !== options.expectedCompanyId) return blank("TENANT_MISMATCH");
  if (!safeId(record.agentId) || !safeId(record.runId)) return blank("MISSING_RUN_IDENTITY");
  if (record.status !== "failed" && record.status !== "timed_out") return blank("IGNORED_RUN_STATUS");
  if (!Object.hasOwn(ROUTES,record.failureDomain)) return blank("UNSUPPORTED_FAILURE_DOMAIN");
  if (options.expectedProjectId !== undefined &&
      (!safeId(options.expectedProjectId) || record.projectId !== options.expectedProjectId)) return blank("PROJECT_MISMATCH");
  const route=ROUTES[record.failureDomain];
  const signals=Array.isArray(record.validatedSignals)?record.validatedSignals.slice(0,8):[];
  const event={
    kind:route.kind, phase:route.phase,
    outcome:"FAIL",
    signals, error_code:record.structuredErrorCode,
    http_status:record.httpStatus,
    already_surfaced_ids:Array.isArray(record.alreadySurfacedIds)?record.alreadySurfacedIds:[]
  };
  const hint=adviseForVerifiedEvent(event,catalog,{
    enabled:true,
    trustedSource:true,  // caller already authenticated and tenant-checked above
    maxHints:options.maxHints,
    maxChars:options.maxChars,
    contextChars:options.contextChars
  });
  return {mode:hint.mode,context:hint.text,surfaced_ids:hint.surfaced_ids,run_id:record.runId};
}
