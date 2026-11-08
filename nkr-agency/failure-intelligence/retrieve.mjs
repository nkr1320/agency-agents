/** Offline, deterministic, advisory-only failure-memory retrieval. No network, actions, or policy enforcement. */
export function retrieveFailureLessons(records,task,maxResults=5){
 if(!Array.isArray(records)||!task||typeof task!=="object")throw new TypeError("records and task required");
 const tags=new Set((Array.isArray(task.tags)?task.tags:[]).filter(x=>typeof x==="string").map(x=>x.trim().toLowerCase()).filter(Boolean));
 const cap=Number.isInteger(maxResults)?Math.min(Math.max(maxResults,0),10):5;
 return records.filter(r=>r&&r.status==="ACTIVE"&&r.retrieval_state==="CURATED_EVIDENCE"&&r.source_url?.startsWith("https://")&&Array.isArray(r.tags)&&Array.isArray(r.controls))
 .map(r=>{
  const matched=r.tags.filter(t=>tags.has(String(t).toLowerCase())).sort();
  return {record_id:r.id,source_url:r.source_url,source_class:r.source_class,matched_tags:matched,check_ids:r.controls.filter(c=>typeof c==="string"&&/^CHECK_[A-Z0-9_]+$/.test(c)),score:matched.length,decision:"ADVISORY_ONLY",version_scope:"NOT_ASSESSED"};
 })
 .filter(r=>r.score>0).sort((a,b)=>b.score-a.score||a.record_id.localeCompare(b.record_id)).slice(0,cap);
}

export function validateFailureSeeds(catalog){
 const errors=[];
 if(!catalog||catalog.schema_version!==1||!Array.isArray(catalog.records))return ["invalid seed catalog"];
 const ids=new Set();
 for(const r of catalog.records){
  if(!r||typeof r.id!=="string"||ids.has(r.id))errors.push("bad or duplicate id");
  ids.add(r?.id);
  if(!r?.source_url?.startsWith("https://"))errors.push(`${r?.id}: source must be HTTPS`);
  if(!Array.isArray(r?.tags)||!r.tags.length)errors.push(`${r?.id}: missing tags`);
  if(!Array.isArray(r?.controls)||!r.controls.length||r.controls.some(c=>!/^CHECK_[A-Z0-9_]+$/.test(c)))errors.push(`${r?.id}: invalid control ids`);
  if(r?.retrieval_state!=="CURATED_EVIDENCE")errors.push(`${r?.id}: unreviewed record status`);
 }
 return errors;
}
