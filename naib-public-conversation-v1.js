/* NAIB public guidance v2. Browser-local answer selection, no protected capabilities. */
(function(root){"use strict";
let records=[],state="loading",lastTopic="";
const norm=s=>String(s||"").normalize("NFKC").toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
const tokens=s=>new Set(norm(s).split(" ").filter(w=>w.length>2&&!new Set(["how","what","when","where","why","which","the","and","for","your","from","with","this","that","please","help","can","would","could","should","about","tell","me","you"]).has(w)));
const protectedRequest=/\b(?:password|access token|api key|secret|credential|private key|shell|sudo|terminal|override|bypass|authentication|admin login|administrator account|permission escalation|protected runtime|private record|student record|student data|grade record|parent passcode)\b/i;
const dangerous=/\b(?:suicide|kill myself|self harm|immediate danger|emergency|overdose)\b/i;
const domains=[
 ["academy",["school","academy","class","course","learning"]],["linguistics",["language","french","spanish","linguistics"]],["art",["visual art","zelle","bazaar art"]],["music",["music","moirai","refrain"]],["writing",["poetry","eiren","literature","story writing"]],["wellness",["aurora","grounding","meditation"]],["support",["hope","housing","food assistance","community support"]],["archives",["arshif","archive","library"]],["planning",["plan","organize","next step"]],["delegation",["delegate","handoff","assign"]],["status",["completed","receipt","action status"]],["privacy",["privacy","personal data"]],["authority",["administrative authority","permission"]],["research",["research","source","verify"]],["family",["family","parent","guardian"]],["identity",["who are you","what is naib"]],["uncertainty",["uncertain","unsure"]]
];
const ready=fetch("./knowledge/public-guidance.v1.json",{cache:"no-store",credentials:"same-origin"}).then(r=>{if(!r.ok)throw Error("unavailable");return r.json()}).then(d=>{
 if(!d||d.schema!=="naib-public-guidance-v1"||!Array.isArray(d.records)||d.records.length!==18)throw Error("schema");
 const ids=new Set(),qs=new Set();
 for(const x of d.records){
  if(x.status!=="approved-public"||typeof x.id!=="string"||ids.has(x.id)||typeof x.question!=="string"||qs.has(norm(x.question))||typeof x.response!=="string"||!x.response.trim()||x.response.length>2200||typeof x.topic!=="string")throw Error("unreviewed");
  ids.add(x.id);qs.add(norm(x.question));
 }
 records=d.records;state="ready";return records.length;
}).catch(()=>{records=[];state="unavailable";return 0});
function reset(){lastTopic="";root.CreativeSparkMentorQA?.reset?.({mentorId:"naib",scope:"public-routing"});}
function ranked(raw){
 const q=norm(raw),t=tokens(q);
 const scored=records.map(x=>{
  const qt=norm(x.question),v=tokens(qt),common=[...t].filter(w=>v.has(w)).length;
  const coverage=common/Math.max(1,t.size);
  return {x,score:q===qt?100:common>=2&&coverage>=.72?Math.round(40+coverage*40):0};
 }).sort((a,b)=>b.score-a.score);
 if(!scored[0]||scored[0].score<75||(scored[1]&&scored[0].score===scored[1].score))return null;
 return scored[0].x;
}
function respond(input){
 const raw=String(input||"").trim().slice(0,1200),q=norm(raw);
 if(!q)return "Tell me what you would like to find, plan or understand.";
 if(dangerous.test(raw))return "If someone is in immediate danger, contact local emergency services or a trusted person nearby. In the United States, call or text 988 for crisis support. This public page cannot provide emergency care.";
 if(protectedRequest.test(raw))return "This public interface cannot access private student or family records, credentials, administrative controls, terminals or protected systems. I can help describe a public-safe request and the authorization it would require, but I have not taken action.";
 if(["hi","hello","hey","good morning","good evening"].includes(q))return "Welcome. Would you like to explore education, art, music, archives or practical support?";
 if(/^(tell me more|what next|continue|another option|go on)$/.test(q)&&lastTopic)
  return "We were exploring "+lastTopic+". Would you like the public doorway, a simple next-step plan, or a specialist introduction? No action has been executed.";
 const direct=ranked(raw);if(direct){lastTopic=direct.topic;return direct.response;}
 const safeAcademic=/\b(?:poetry|literature|grammar|language learning|music theory|painting|drawing|art technique|study strategy)\b/i.test(raw);
 const consequential=/\b(?:housing|benefits|medical|health|crisis|emergency|financial|legal|account|personal data|student|grades|permission)\b/i.test(raw);
 if(safeAcademic&&!consequential){
  const ref=root.CreativeSparkMentorQA?.answer(raw,{mentorId:"naib",scope:"public-routing"});
  if(ref)return "Public specialist reference from "+ref.sourceName+": "+ref.answer+" (Source: "+ref.sourceName+" · "+ref.topic+".) This is guidance, not an administrative action.";
 }
 const domain=domains.find(([_,phrases])=>phrases.some(p=>q.includes(p)))?.[0];
 if(domain){
  lastTopic=domain;
  const record=records.find(x=>x.topic===domain);
  if(record&&/\b(?:where do i start|how do i begin|first step|beginner)\b/.test(q))return record.response;
  return "I can help you navigate "+domain+". Are you looking for the appropriate public page, a specialist, or a suggested plan? I won't claim that anything has been completed.";
 }

 return "I can help identify an appropriate public resource, specialist, or next-step proposal. Which goal matters most to you? I cannot verify private status or claim an action occurred here.";
}
root.NAIBPublicConversation=Object.freeze({ready,respond,reset,status:()=>state,count:()=>records.length});
})(window);