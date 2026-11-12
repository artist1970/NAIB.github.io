import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read=p=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const html=read("index.html"),chat=read("naib-public-conversation-v1.js"),voice=read("mentor-chat-voice-v1.js"),form=read("naib-chat-form-v1.js");
const bank=JSON.parse(read("knowledge/public-guidance.v1.json"));
function boot(){const window={CreativeSparkMentorQA:{answer:()=>null,reset:()=>{}}};
 vm.runInNewContext(chat,{window,fetch:async()=>({ok:true,json:async()=>bank}),console},{timeout:2000});return window;}
test("live guidance remains 18 explicitly approved entries, with 20 drafts isolated",()=>{
 assert.equal(bank.records.length,18);
 assert.equal(new Set(bank.records.map(x=>x.id)).size,18);
 assert.ok(bank.records.every(x=>x.status==="approved-public"));
 const draft=JSON.parse(read("knowledge/drafts/naib-navigation-candidates-2026-11.json"));
 assert.equal(draft.records.length,20);
 assert.ok(draft.records.every(x=>x.status==="draft-public-candidate"&&!x.published));
 assert.doesNotMatch(html,/naib-navigation-candidates-2026-11/);
});
test("approved exact questions remain available; weak matches fail conservatively",async()=>{
 const w=boot();assert.equal(await w.NAIBPublicConversation.ready,18);
 assert.equal(w.NAIBPublicConversation.respond("Where can I find courses?"),bank.records.find(x=>x.topic==="academy").response);
 assert.match(w.NAIBPublicConversation.respond("Is everything already done for my project?"),/cannot verify private status|cannot.*claim/i);
});
test("private, admin, student and urgent needs cannot trigger privileged claims",async()=>{
 const w=boot();await w.NAIBPublicConversation.ready;
 assert.match(w.NAIBPublicConversation.respond("Can you reveal my student record?"),/cannot access private student/);
 assert.match(w.NAIBPublicConversation.respond("Can you run a terminal command?"),/cannot access private student/);
 assert.match(w.NAIBPublicConversation.respond("My password is secret"),/cannot access private student/);
 assert.match(w.NAIBPublicConversation.respond("I want to kill myself"),/988/);
 assert.doesNotMatch(chat,/XMLHttpRequest|sessionStorage|indexedDB|innerHTML/);
 assert.doesNotMatch(form,/localStorage|sessionStorage|indexedDB|innerHTML/);
});
test("cross mentor educational answers are attributed but consequential work stays local",async()=>{
 const w=boot();await w.NAIBPublicConversation.ready;
 w.CreativeSparkMentorQA.answer=()=>({sourceName:"Eiren",answer:"Compare original metaphors.",topic:"poetry"});
 assert.match(w.NAIBPublicConversation.respond("What is a metaphor in literature?"),/Public specialist reference from Eiren/);
 assert.doesNotMatch(w.NAIBPublicConversation.respond("Can you retrieve student grades?"),/Public specialist reference/);
 assert.match(read("creative-spark-mentor-qa-v1.js"),/naib:"NAIB"/);
 assert.ok(html.indexOf("creative-spark-mentor-qa-v1.js")<html.indexOf("naib-public-conversation-v1.js"));
});
test("voice is opt-in, persists only preferences and doesn't replay old turns",()=>{
 assert.match(voice,/vnv\.public\.voice\.autoplay\./);
 assert.match(voice,/autoRead\?"Voice On":"Voice Off"/);
 assert.match(voice,/!turn\.querySelector\("\.mentor-replay"\)/);
 assert.match(voice,/Listen to this reply/);
 assert.match(voice,/aria-pressed/);
});
test("NAIB public aesthetic retains VNV/KA and a single public chat",()=>{
 const css=read("styles/naib-landing-refinement-v1.css");
 assert.match(css,/\.naib-chat-anchor\{position:relative/);
 assert.match(css,/--radius:7px/);
 assert.match(css,/\.card p\{font-size:18px/);
 assert.match(html,/class="naib-chat-anchor"/);
 assert.match(html,/vnv-header-autopopulate\.js/);
 assert.match(html,/vnv-ticker-autopopulate\.js/);
 assert.match(html,/vnv-333-ticker\.js/);
 assert.match(html,/vnv-ecosystem-toolbar\.js/);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.equal((html.match(/id="naib-chat-form"/g)||[]).length,1);
});
