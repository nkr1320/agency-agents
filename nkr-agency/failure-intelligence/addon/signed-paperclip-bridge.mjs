/**
 * Server-only opt-in composition of authenticated Paperclip events + FailureGuard.
 *
 * The shared HMAC secret and replay store must remain with the trusted
 * control-plane adapter, NEVER in Claude/Codex/Cursor agent processes.
 * No network calls, skill activation, production action or LLM invocation.
 */
import {verifyFailureEventAsync} from "./event-auth.mjs";
import {adviseFromPaperclipRecord} from "./paperclip-bridge.mjs";

function empty(mode,reason=null){
  return {mode,reason,context:"",surfaced_ids:[],run_id:null,event_id:null};
}

/**
 * The caller must derive expectedCompanyId/expectedProjectId from its own
 * authenticated session or durable assigned task, NOT from the envelope body.
 */
export async function adviseFromSignedPaperclipEvent(envelope,catalog,trust={}) {
  if (trust.enabled !== true) return empty("DISABLED");
  const verified=await verifyFailureEventAsync(envelope,{
    keys:trust.keys,
    expectedCompanyId:trust.expectedCompanyId,
    expectedProjectId:trust.expectedProjectId,
    reserveEventId:trust.reserveEventId,
    now:trust.now
  });
  if (!verified.ok) return empty("REJECTED_EVENT",verified.reason);
  const hint=adviseFromPaperclipRecord(verified.record,catalog,{
    enabled:true,
    sourceAuthenticated:true,
    expectedCompanyId:trust.expectedCompanyId,
    expectedProjectId:trust.expectedProjectId,
    maxHints:trust.maxHints,
    maxChars:trust.maxChars,
    contextChars:trust.contextChars
  });
  return {...hint,event_id:verified.evidence.event_id,reason:null};
}
