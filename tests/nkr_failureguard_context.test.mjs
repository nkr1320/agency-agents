import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {makeFailureContextAddon} from "../nkr-agency/failure-intelligence/addon/context-addon.mjs";
const catalog = JSON.parse(fs.readFileSync(new URL("../nkr-agency/failure-intelligence/addon/failure-patterns.json", import.meta.url),"utf8"));
test("disabled returns no prompt supplement",()=>{
 const out=makeFailureContextAddon({phase:"build",signals:["mcp-401"]},catalog);
 assert.equal(out.text,"");
});
test("irrelevant task returns zero context tokens",()=>{
 const out=makeFailureContextAddon({phase:"build",signals:["unrelated-signal"]},catalog,{enabled:true});
 assert.equal(out.text,"");
});
test("relevant error yields short optional content only",()=>{
 const out=makeFailureContextAddon({phase:"build",signals:["mcp-401"]},catalog,{enabled:true});
 assert.ok(out.text.includes("OPTIONAL ADVISORY"));
 assert.ok(out.text.includes("CHECK_MCP_AUTH_SCOPE"));
 assert.ok(out.text.length<=520);
 assert.deepEqual(out.surfaced_ids,["OPS-02"]);
});
test("already seen hint is not repeated",()=>{
 const out=makeFailureContextAddon({phase:"build",signals:["mcp-401"],already_surfaced_ids:["OPS-02"]},catalog,{enabled:true});
 assert.equal(out.text,"");
});
test("tight context budget returns no unsafe truncation",()=>{
 const out=makeFailureContextAddon({phase:"build",signals:["mcp-401"]},catalog,{enabled:true,contextChars:160});
 assert.equal(out.text,"");
});
