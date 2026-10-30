/* NAIB public navigation assistant: no protected runtime access or execution. */
(function(global){"use strict";
let records=[],state="loading";
const ready=fetch("./knowledge/public-guidance.v1.json").then(r=>{if(!r.ok)throw Error("index");return r.json()}).then(d=>{if(d.schema!=="naib-public-guidance-v1"||!Array.isArray(d.records))throw Error("schema");records=d.records.filter(r=>r.status==="approved-public");state="ready"}).catch(()=>{state="unavailable"});
const topics=[["academy",["school","academy","class","course","learn"]],["linguistics",["language","french","spanish","linguistic"]],["art",["art","zelle","bazaar"]],["music",["music","moirai","refrain"]],["writing",["writing","poetry","eiren","literature"]],["wellness",["aurora","grounding","meditation"]],["support",["hope","housing","food","community support"]],["archives",["arshif","archive","library"]],["planning",["plan","organize","next step"]],["delegation",["delegate","handoff","assign"]],["status",["complete","status","receipt","done"]],["privacy",["privacy","personal data","password"]],["authority",["permission","admin access","execute","terminal","credential","secret"]],["research",["research","source","verify"]],["family",["family","parent","guardian"]],["identity",["who are you","what is naib"]],["uncertainty",["uncertain","unsure"]]];
function respond(input){const q=String(input||"").trim().toLowerCase().slice(0,1200);if(!q)return "Tell me what you want to find, plan, or understand.";
if(/(password|token|secret|credential|private key|shell|terminal|sudo|permission|override|bypass|noema|chancellor)/.test(q))return "This public interface cannot disclose protected governance details, credentials, internal operations, or execute administrative changes. I can help describe a public-safe request and the authorization it would require.";
if(/^(hi|hello|hey|good morning)[!. ]*$/.test(q))return "Welcome. I am NAIB's public navigation assistant. Are you exploring education, art, music, archives, or practical resources?";
const topic=topics.find(([_,words])=>words.some(w=>q.includes(w)))?.[0];const r=records.find(x=>x.topic===topic);if(r)return r.response;
return "I can help navigate the ecosystem, identify a specialist, or organize a proposal. Which outcome are you trying to reach? I won't claim an action has occurred without evidence.";
}
global.NAIBPublicConversation=Object.freeze({ready,respond,status:()=>state,count:()=>records.length});
})(window);
