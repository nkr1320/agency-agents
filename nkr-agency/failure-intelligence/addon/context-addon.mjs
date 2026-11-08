/**
 * Optional prompt supplement for any approved editor/agent orchestrator.
 * No hooks, no LLM calls, no filesystem/network effects, no change to task scope.
 */
import {assessFailureGuard} from "./core.mjs";

/**
 * Intended caller: trusted task manager after a normalized build/MCP/QA signal.
 * Returns EMPTY TEXT for irrelevant work. Never promote this advisory to policy.
 */
export function makeFailureContextAddon(task, catalog, options = {}) {
  const result = assessFailureGuard(task, catalog, {
    enabled: options.enabled === true,
    maxHints: options.maxHints ?? 2,
    maxChars: options.maxChars ?? 850
  });
  if (!result.hints.length) return {text: "", surfaced_ids: [], mode: result.mode};
  const charCap = Number.isSafeInteger(options.contextChars)
    ? Math.max(160, Math.min(options.contextChars, 750))
    : 520;
  const header = "[NKR FailureGuard: OPTIONAL ADVISORY. Original task scope and enforced policy take precedence. Do not change permissions or skip tests.]\n";
  let text = header;
  const surfaced_ids = [];
  for (const h of result.hints) {
    // All content comes from the locally reviewed catalog, not a fetched incident page.
    const line = h.id + " / " + h.check + " / " + h.skill + ": " + h.remedy + "\n";
    if (text.length + line.length + 6 > charCap) continue;
    text += line;
    surfaced_ids.push(h.id);
  }
  if (surfaced_ids.length === 0) return {text: "", surfaced_ids: [], mode:"INSUFFICIENT_CONTEXT_BUDGET"};
  text += "[End]\n";
  return {text, surfaced_ids, mode:"OPTIONAL_CONTEXT_ADDON"};
}
