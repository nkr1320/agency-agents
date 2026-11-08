/**
 * NKR FailureGuard: verified, replay-resistant event envelope gate.
 *
 * This is a standalone boundary helper for a trusted SERVER; no agent,
 * editor, MCP server or subprocess should receive its HMAC signing key.
 * It does not invoke a worker, change a policy, fetch data, or modify a job.
 *
 * HMAC proves possession of a shared secret only. It does NOT prove the
 * correctness of underlying test or tool outcomes; use trusted runners.
 */
import {createHmac, timingSafeEqual} from 'node:crypto';

const IDENT = /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/;
const CODE = /^[A-Z][A-Z0-9_]{0,79}$/;
const SIGNAL = /^[a-z0-9][a-z0-9_-]{0,89}$/;
const DOMAINS = new Set(['mcp','build','ci','integration','qa','review','release','ops','agent']);
const STATUSES = new Set(['failed','timed_out']);
const ENVELOPE_KEYS = new Set(['v','kid','event_id','occurred_at','company_id','project_id','run_id','payload','signature']);
const PAYLOAD_KEYS = new Set(['companyId','projectId','agentId','runId','status','failureDomain','structuredErrorCode','httpStatus','validatedSignals','alreadySurfacedIds']);
const id = value => typeof value === 'string' && IDENT.test(value);

function exactKeys(object, allowed) {
  return object && typeof object === 'object' && !Array.isArray(object)
    && Object.keys(object).every(k => allowed.has(k));
}

function canonicalPayload(payload) {
  if (!exactKeys(payload, PAYLOAD_KEYS)) return null;
  if (![payload.companyId,payload.projectId,payload.agentId,payload.runId].every(id)) return null;
  if (!STATUSES.has(payload.status) || !DOMAINS.has(payload.failureDomain)) return null;
  const code = payload.structuredErrorCode ?? null;
  if (code !== null && (typeof code !== 'string' || !CODE.test(code))) return null;
  const httpStatus = payload.httpStatus ?? null;
  if (httpStatus !== null && (!Number.isSafeInteger(httpStatus) || httpStatus < 100 || httpStatus > 599)) return null;
  const signals = payload.validatedSignals ?? [];
  const seen = payload.alreadySurfacedIds ?? [];
  if (!Array.isArray(signals) || signals.length > 8 || signals.some(x => typeof x !== 'string' || !SIGNAL.test(x))) return null;
  if (!Array.isArray(seen) || seen.length > 100 || seen.some(x => !id(x))) return null;
  return {
    companyId:payload.companyId,projectId:payload.projectId,agentId:payload.agentId,
    runId:payload.runId,status:payload.status,failureDomain:payload.failureDomain,
    structuredErrorCode:code,httpStatus,validatedSignals:[...signals],alreadySurfacedIds:[...seen]
  };
}

/** Return exactly the bytes authenticated by both publisher and verifier. */
export function canonicalizeFailureEvent(envelope) {
  if (!exactKeys(envelope, ENVELOPE_KEYS)) return null;
  if (envelope.v !== 1 || ![envelope.kid,envelope.event_id,envelope.company_id,envelope.project_id,envelope.run_id].every(id)) return null;
  if (typeof envelope.occurred_at !== 'string' || envelope.occurred_at.length > 40) return null;
  const payload=canonicalPayload(envelope.payload);
  if (!payload || payload.companyId !== envelope.company_id || payload.projectId !== envelope.project_id || payload.runId !== envelope.run_id) return null;
  return JSON.stringify({v:1,kid:envelope.kid,event_id:envelope.event_id,
    occurred_at:envelope.occurred_at,company_id:envelope.company_id,
    project_id:envelope.project_id,run_id:envelope.run_id,payload});
}

function reject(reason) {return {ok:false,reason};}

/**
 * Verify ONLY in the trusted control plane after session/auth has been checked.
 *
 * options:
 * - keys: a key-id to 32+ byte server-side secret (not accessible to agents)
 * - expectedCompanyId, expectedProjectId: from authenticated session, NOT agent body
 * - reserveEventId: atomic, durable single-use reservation function (mandatory)
 * - now: injectable clock for testing, default Date.now()
 */
function verifyEnvelopeWithoutReplay(envelope,options={}) {
  if (!id(options.expectedCompanyId) || !id(options.expectedProjectId)) return reject('NO_TRUSTED_SCOPE');
  const canonical=canonicalizeFailureEvent(envelope);
  if (!canonical || Buffer.byteLength(canonical,'utf8') > 16384) return reject('INVALID_ENVELOPE');
  if (envelope.company_id !== options.expectedCompanyId || envelope.project_id !== options.expectedProjectId) return reject('SCOPE_MISMATCH');
  const occurred=Date.parse(envelope.occurred_at);
  if (!Number.isFinite(occurred) || new Date(occurred).toISOString() !== envelope.occurred_at) return reject('INVALID_TIME');
  const now=options.now ?? Date.now();
  if (!Number.isFinite(now) || occurred < now-300000 || occurred > now+30000) return reject('EXPIRED_OR_FUTURE');
  if (typeof envelope.signature !== 'string' || !/^[a-f0-9]{64}$/i.test(envelope.signature)) return reject('INVALID_SIGNATURE');
  const secret=options.keys?.[envelope.kid];
  if (typeof secret !== 'string' && !Buffer.isBuffer(secret)) return reject('UNKNOWN_KEY');
  if (Buffer.byteLength(secret) < 32) return reject('WEAK_SIGNING_SECRET');
  const expected=createHmac('sha256',secret).update(canonical,'utf8').digest();
  const supplied=Buffer.from(envelope.signature,'hex');
  if (supplied.length !== expected.length || !timingSafeEqual(supplied,expected)) return reject('SIGNATURE_MISMATCH');
  const verified=canonicalPayload(envelope.payload);
  return {ok:true,record:verified,evidence:{event_id:envelope.event_id,kid:envelope.kid,run_id:envelope.run_id,company_id:envelope.company_id,project_id:envelope.project_id}};
}

function reservationArguments(envelope) {
  return {company_id:envelope.company_id,event_id:envelope.event_id,
    run_id:envelope.run_id,occurred_at:envelope.occurred_at};
}

/** Synchronous reservation for trusted synchronous stores. */
export function verifyFailureEvent(envelope,options={}) {
  if (typeof options.reserveEventId !== 'function') return reject('NO_REPLAY_STORE');
  const result=verifyEnvelopeWithoutReplay(envelope,options);
  if (!result.ok) return result;
  let reserved=false;
  try {reserved=options.reserveEventId(reservationArguments(envelope)) === true;}
  catch {return reject('REPLAY_STORE_ERROR');}
  return reserved ? result : reject('REPLAY_OR_UNAVAILABLE');
}

/** Async reservation for durable remote DB stores. Reservation MUST be atomic. */
export async function verifyFailureEventAsync(envelope,options={}) {
  if (typeof options.reserveEventId !== 'function') return reject('NO_REPLAY_STORE');
  const result=verifyEnvelopeWithoutReplay(envelope,options);
  if (!result.ok) return result;
  let reserved=false;
  try {reserved=(await options.reserveEventId(reservationArguments(envelope))) === true;}
  catch {return reject('REPLAY_STORE_ERROR');}
  return reserved ? result : reject('REPLAY_OR_UNAVAILABLE');
}
