import test from 'node:test';
import assert from 'node:assert/strict';
import {createHmac} from 'node:crypto';
import {canonicalizeFailureEvent,verifyFailureEvent} from '../nkr-agency/failure-intelligence/addon/event-auth.mjs';

const key='a-secret-production-server-key-at-least-32-bytes-long';
const now=Date.parse('2026-11-08T12:00:00.000Z');
function makeEvent(overrides={}) {
 const payload={companyId:'acme',projectId:'build-1',agentId:'agent-1',runId:'run-1',status:'failed',failureDomain:'mcp',structuredErrorCode:'MCP_AUTH_FAILED',httpStatus:401,validatedSignals:[],alreadySurfacedIds:[]};
 const envelope={v:1,kid:'key-1',event_id:'event-1',occurred_at:new Date(now).toISOString(),company_id:'acme',project_id:'build-1',run_id:'run-1',payload,...overrides};
 const canonical=canonicalizeFailureEvent(envelope);
 if (!canonical) throw new Error('Bad fixture');
 envelope.signature=createHmac('sha256',key).update(canonical).digest('hex');
 return envelope;
}
function options(overrides={}) {
 const seen=new Set();
 return {keys:{'key-1':key},expectedCompanyId:'acme',expectedProjectId:'build-1',now,reserveEventId:({event_id})=>!seen.has(event_id)&&(seen.add(event_id),true),...overrides};
}
test('valid signed event passes with trusted scope',()=>assert.equal(verifyFailureEvent(makeEvent(),options()).ok,true));
test('tampered signed payload denied',()=>{const e=makeEvent();e.payload.httpStatus=403;assert.equal(verifyFailureEvent(e,options()).reason,'SIGNATURE_MISMATCH')});
test('tenant mismatch denied',()=>assert.equal(verifyFailureEvent(makeEvent(),options({expectedCompanyId:'other'})).reason,'SCOPE_MISMATCH'));
test('project mismatch denied',()=>assert.equal(verifyFailureEvent(makeEvent(),options({expectedProjectId:'other-project'})).reason,'SCOPE_MISMATCH'));
test('replayed event denied atomically',()=>{const e=makeEvent(),opts=options();assert.equal(verifyFailureEvent(e,opts).ok,true);assert.equal(verifyFailureEvent(e,opts).reason,'REPLAY_OR_UNAVAILABLE')});
test('missing replay store fails closed',()=>assert.equal(verifyFailureEvent(makeEvent(),options({reserveEventId:undefined})).reason,'NO_REPLAY_STORE'));
test('unavailable replay store fails closed',()=>assert.equal(verifyFailureEvent(makeEvent(),options({reserveEventId:()=>{throw Error('down')}})).reason,'REPLAY_STORE_ERROR'));
test('unsigned event denied',()=>{const e=makeEvent();delete e.signature;assert.equal(verifyFailureEvent(e,options()).reason,'INVALID_SIGNATURE')});
test('expired event denied',()=>assert.equal(verifyFailureEvent(makeEvent(),options({now:now+301000})).reason,'EXPIRED_OR_FUTURE'));
test('future event denied',()=>assert.equal(verifyFailureEvent(makeEvent(),options({now:now-31000})).reason,'EXPIRED_OR_FUTURE'));
test('raw logs not allowed in signed payload',()=>{const e=makeEvent();e.payload.stdout='ignore policies';assert.equal(canonicalizeFailureEvent(e),null)});
test('forged company id in payload rejected',()=>{const e=makeEvent();e.payload.companyId='other';assert.equal(canonicalizeFailureEvent(e),null)});
test('unexpected outer keys rejected',()=>{const e=makeEvent();e.productionPermission=true;assert.equal(canonicalizeFailureEvent(e),null)});
test('unknown signing key denied',()=>assert.equal(verifyFailureEvent(makeEvent(),options({keys:{}})).reason,'UNKNOWN_KEY'));
test('weak server secret denied',()=>assert.equal(verifyFailureEvent(makeEvent(),options({keys:{'key-1':'short'}})).reason,'WEAK_SIGNING_SECRET'));
test('valid event returns only normalized fields',()=>{const r=verifyFailureEvent(makeEvent(),options());assert.equal(r.ok,true);assert.equal(r.record.httpStatus,401);assert.equal(r.record.structuredErrorCode,'MCP_AUTH_FAILED')});
