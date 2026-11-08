/**
 * Local microbenchmark of FailureGuard overhead only.
 * No agents, model API, external websites, token billing, or repositories are touched.
 *
 * Run: node nkr-agency/failure-intelligence/addon/benchmark.mjs
 */
import fs from "node:fs";
import {performance} from "node:perf_hooks";
import {adviseForVerifiedEvent} from "./event-adapter.mjs";

const catalog=JSON.parse(fs.readFileSync(new URL("./failure-patterns.json",import.meta.url),"utf8"));
const scenarios=[
  ["OFF", {kind:"mcp.error",outcome:"FAIL",phase:"build",signals:["mcp-401"]}, {enabled:false,trustedSource:true}],
  ["UNRELATED", {kind:"build.failed",outcome:"FAIL",phase:"build",signals:["unlisted-safe-error"]},{enabled:true,trustedSource:true}],
  ["MATCHING_MCP", {kind:"mcp.error",outcome:"FAIL",phase:"build",signals:["mcp-401"]},{enabled:true,trustedSource:true}],
  ["MATCHING_CI", {kind:"ci.startup_failed",outcome:"FAIL",phase:"verify",signals:["ci-startup-failure"]},{enabled:true,trustedSource:true}],
  ["REPEAT_SUPPRESSED", {kind:"mcp.error",outcome:"FAIL",phase:"build",signals:["mcp-401"],already_surfaced_ids:["OPS-02"]},{enabled:true,trustedSource:true}]
];

const warmup=200;
const iterations=5000;
function run(name,event,options) {
  for(let i=0;i<warmup;i++)adviseForVerifiedEvent(event,catalog,options);
  const durations=[];
  let chars=0;
  for(let i=0;i<iterations;i++){
    const start=performance.now();
    const result=adviseForVerifiedEvent(event,catalog,options);
    const diff=performance.now()-start;
    durations.push(diff);
    chars=result.text.length;
    if((name==="OFF"||name==="UNRELATED"||name==="REPEAT_SUPPRESSED")&&chars!==0)throw Error("Non-matching scenario emitted context");
  }
  durations.sort((a,b)=>a-b);
  const at=q=>Math.round(durations[Math.floor((durations.length-1)*q)]*1000)/1000;
  return {scenario:name,iterations,p50_ms:at(.5),p95_ms:at(.95),max_context_chars:chars,extra_model_calls:0};
}
const result={measurement:"Local single-process microbenchmark, NOT accepted-product delivery speed or token billing",runtime:process.version,records:catalog.records.length,run_at:new Date().toISOString(),scenarios:scenarios.map(x=>run(...x))};
process.stdout.write(JSON.stringify(result,null,2)+"\n");
