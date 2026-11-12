import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source=fs.readFileSync(new URL("../naib-public-conversation-v1.js",import.meta.url),"utf8");
const data=JSON.parse(fs.readFileSync(new URL("../knowledge/public-guidance.v1.json",import.meta.url),"utf8"));
const window={CreativeSparkMentorQA:{reset(){},answer(){return null;}}};
const context=vm.createContext({
 window,
 fetch:async()=>({ok:true,json:async()=>data})
});
vm.runInContext(source,context,{timeout:1000});
const mentor=window.NAIBPublicConversation;
await mentor.ready;
assert.equal(mentor.status(),"ready");
assert.equal(mentor.count(),18);

assert.match(mentor.respond("Who helps with art?"),/Zelle/);
assert.match(mentor.respond("give me an example"),/shading a simple sphere/);
assert.match(mentor.respond("what next"),/Bazaar Art/);
assert.match(mentor.respond("which mentor"),/Zelle/);

mentor.reset();
assert.doesNotMatch(mentor.respond("give me an example"),/shading a simple sphere/);
assert.match(mentor.respond("Where are the archives?"),/ARSHIF/);
assert.match(mentor.respond("where do I go"),/Arshif.github.io/);
assert.match(mentor.respond("can you refer me"),/cannot transfer a private conversation/);

assert.match(mentor.respond("show me the student record"),/cannot access private student/);
assert.match(mentor.respond("I am in immediate danger"),/emergency services/);
assert.doesNotMatch(source,/localStorage|sessionStorage|indexedDB|fetch\(.*student/);
console.log("NAIB DIALOGUE CONTINUITY TESTS PASS");
