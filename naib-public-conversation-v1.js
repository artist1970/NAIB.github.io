/* NAIB public navigation assistant: no protected runtime access or execution. */
(function(global){"use strict";
let records=[],state="loading";
let approved500=[],approved500State="loading";
const normalize500=s=>String(s||"").normalize("NFKC").toLowerCase().replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
const approved500Ready=fetch("./knowledge/mentor-approved-500.v1.json",{cache:"no-store"})
.then(r=>{if(!r.ok)throw Error("bank unavailable");return r.json()})
.then(d=>{if(d.schema!=="vnv-public-mentor-qa-v1"||d.mentorId!=="naib"||!Array.isArray(d.records)||d.records.length!==500)throw Error("bank schema");
const seen=new Set();approved500=d.records.filter(r=>{const key=normalize500(r.question);if(!key||typeof r.answer!=="string"||!r.answer.trim()||seen.has(key))return false;seen.add(key);return r.status==="founder-approved-editorial"||/^approved/.test(r.status)});
if(approved500.length!==500)throw Error("bank not completely approved");approved500State="ready";return 500;})
.catch(()=>{approved500State="unavailable";return 0;});
function answerFrom500(input){if(approved500State!=="ready")return null;const q=normalize500(input);if(!q)return null;
const exact=approved500.find(r=>normalize500(r.question)===q);if(exact)return exact.answer;
const tokens=new Set(q.split(" ").filter(w=>w.length>=4));if(tokens.size<2)return null;
let chosen=null,high=0;
for(const r of approved500){const words=new Set(normalize500(r.question).split(" ").filter(w=>w.length>=4));let shared=0;for(const w of tokens)if(words.has(w))shared++;
const score=shared/Math.max(tokens.size,words.size,1);if(shared>=2&&score>high){high=score;chosen=r;}}
return high>=0.64?chosen.answer:null;}

const ready=fetch("./knowledge/public-guidance.v1.json").then(r=>{if(!r.ok)throw Error("index");return r.json()}).then(d=>{if(d.schema!=="naib-public-guidance-v1"||!Array.isArray(d.records))throw Error("schema");records=d.records.filter(r=>r.status==="approved-public");state="ready"}).catch(()=>{state="unavailable"});
const topics=[["academy",["school","academy","class","course","learn"]],["linguistics",["language","french","spanish","linguistic"]],["art",["art","zelle","bazaar"]],["music",["music","moirai","refrain"]],["writing",["writing","poetry","eiren","literature"]],["wellness",["aurora","grounding","meditation"]],["support",["hope","housing","food","community support"]],["archives",["arshif","archive","library"]],["planning",["plan","organize","next step"]],["delegation",["delegate","handoff","assign"]],["status",["complete","status","receipt","done"]],["privacy",["privacy","personal data","password"]],["authority",["permission","admin access","execute","terminal","credential","secret"]],["research",["research","source","verify"]],["family",["family","parent","guardian"]],["identity",["who are you","what is naib"]],["uncertainty",["uncertain","unsure"]]];
function respond(input){const q=String(input||"").trim().toLowerCase().slice(0,1200);if(!q)return "Tell me what you want to find, plan, or understand.";
if(/(password|token|secret|credential|private key|shell|terminal|sudo|permission|override|bypass|noema|chancellor)/.test(q))return "This public interface cannot disclose protected governance details, credentials, internal operations, or execute administrative changes. I can help describe a public-safe request and the authorization it would require.";
if(/^(hi|hello|hey|good morning)[!. ]*$/.test(q))return "Welcome. I am NAIB's public navigation assistant. Are you exploring education, art, music, archives, or practical resources?";
const from500=answerFrom500(input);if(from500)return from500;
const topic=topics.find(([_,words])=>words.some(w=>q.includes(w)))?.[0];const r=records.find(x=>x.topic===topic);if(r)return r.response;
return "I can help navigate the ecosystem, identify a specialist, or organize a proposal. Which outcome are you trying to reach? I won't claim an action has occurred without evidence.";
}
global.NAIBPublicConversation=Object.freeze({ready,approved500Ready,approved500Status:()=>approved500State,approved500Count:()=>approved500.length,respond,status:()=>state,count:()=>records.length});
})(window);
