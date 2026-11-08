import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {createHmac} from "node:crypto";
import {canonicalizeFailureEvent} from "../nkr-agency/failure-intelligence/addon/event-auth.mjs";
import {adviseFromSignedPaperclipEvent} from "../nkr-agency/failure-intelligence/addon/signed-paperclip-bridge.mjs";
const catalog=JSON.parse(fs.readFileSync(new URL("../nkr-agency/failure-intelligence/addon/failure-patterns.json",import.meta.url),"utf8"));
const key="server-only-test-key-must-be-at-least-32-bytes";
const now=Date.parse("2026-11-08T12:00:00.000Z");
function signed() {
 const payload={companyId:"co-1",projectId:"proj-1",agentId:"agent-1",runId:"run-1",status:"failed",failureDomain:"mcp",structuredErrorCode:"MCP_AUTH_FAILED",httpStatus:401,validatedSignals:[],alreadySurfacedIds:[]};
 const e={v:1,kid:"k1",event_id:"event-123",occurred_at:new Date(now).toISOString(),company_id:"co-1",project_id:"proj-1",run_id:"run-1",payload};
 e.signature=createHmac("sha256",key).update(canonicalizeFailureEvent(e)).digest("hex");
 return e;
}
function opts(overrides={}) {
 const used=new Set();
 return {enabled:true,keys:{k1:key},expectedCompanyId:"co-1",expectedProjectId:"proj-1",now,reserveEventId:async({event_id})=>!used.has(event_id)&&(used.add(event_id),true),...overrides};
}
test("default disabled returns no context",async()=>{
 const r=await adviseFromSignedPaperclipEvent(signed(),catalog);
 assert.equal(r.mode,"DISABLED");assert.equal(r.context,"");
});
test("valid signed Paperclip failure returns tiny advisory",async()=>{
 const r=await adviseFromSignedPaperclipEvent(signed(),catalog,opts());
 assert.equal(r.mode,"OPTIONAL_CONTEXT_ADDON");
 assert.ok(r.context.includes("CHECK_MCP_AUTH_SCOPE"));
 assert.equal(r.run_id,"run-1");
 assert.equal(r.event_id,"event-123");
 assert.ok(r.context.length<=520);
});
test("tampered body is denied before retrieval",async()=>{
 const e=signed();e.payload.httpStatus=403;
 const r=await adviseFromSignedPaperclipEvent(e,catalog,opts());
 assert.equal(r.mode,"REJECTED_EVENT");assert.equal(r.context,"");
});
test("wrong tenant scope denied",async()=>{
 const r=await adviseFromSignedPaperclipEvent(signed(),catalog,opts({expectedCompanyId:"co-2"}));
 assert.equal(r.mode,"REJECTED_EVENT");
});
test("missing replay reservation denied",async()=>{
 const r=await adviseFromSignedPaperclipEvent(signed(),catalog,opts({reserveEventId:undefined}));
 assert.equal(r.mode,"REJECTED_EVENT");assert.equal(r.reason,"NO_REPLAY_STORE");
});
test("second replay does not repeat advisory",async()=>{
 const e=signed(),trusted=opts();
 const first=await adviseFromSignedPaperclipEvent(e,catalog,trusted);
 const second=await adviseFromSignedPaperclipEvent(e,catalog,trusted);
 assert.ok(first.context);assert.equal(second.mode,"REJECTED_EVENT");assert.equal(second.context,"");
});
