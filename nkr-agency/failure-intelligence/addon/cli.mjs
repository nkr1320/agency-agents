#!/usr/bin/env node
/**
 * Explicit opt-in only. Reads a local normalized JSON task (no log scraping).
 * Prints compact advisory JSON. Makes no model/API calls and writes no files.
 */
import fs from "node:fs";
import {assessFailureGuard, validateFailureGuardCatalog} from "./core.mjs";

function usage() {
  return "Usage: node cli.mjs --enable --task task.json [--max-hints 2] [--max-chars 850]\n" +
    "Default without --enable: DISABLED; no hooks, writes, web calls or model calls.\n" +
    "Task format: {phase:'build', signals:['mcp-401'], already_surfaced_ids:[]}.\n";
}
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write(usage()); process.exit(0);
}
const allowed = new Set(["--enable","--task","--max-hints","--max-chars"]);
let enabled = false, taskPath = null, maxHints, maxChars;
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (!allowed.has(arg)) throw new Error("Unsupported option: " + arg);
  if (arg === "--enable") { enabled = true; continue; }
  const next = args[++i];
  if (!next || next.startsWith("--")) throw new Error("Missing value for " + arg);
  if (arg === "--task") taskPath = next;
  if (arg === "--max-hints") maxHints = Number(next);
  if (arg === "--max-chars") maxChars = Number(next);
}
if (!enabled) {
  process.stdout.write(JSON.stringify({mode:"DISABLED",hints:[],omitted:0,estimated_tokens:0})+"\n");
  process.exit(0);
}
if (!taskPath) throw new Error("--task is required when --enable is set");
const taskStat = fs.statSync(taskPath);
if (!taskStat.isFile() || taskStat.size > 65536) throw new Error("Task input must be a JSON file no larger than 64KiB");
const task = JSON.parse(fs.readFileSync(taskPath, "utf8"));
const catalog = JSON.parse(fs.readFileSync(new URL("./failure-patterns.json", import.meta.url), "utf8"));
const skillMap = JSON.parse(fs.readFileSync(new URL("./skill-map.json", import.meta.url), "utf8"));
const invalid = validateFailureGuardCatalog(catalog, skillMap);
if (invalid.length) throw new Error("FailureGuard catalog invalid: " + invalid.slice(0,3).join("; "));
process.stdout.write(JSON.stringify(assessFailureGuard(task, catalog, {enabled,maxHints,maxChars}))+"\n");
