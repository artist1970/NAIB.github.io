import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const records=JSON.parse(readFileSync(new URL('../knowledge/public-guidance.v1.json',import.meta.url),'utf8'));
const script=readFileSync(new URL('../naib-public-conversation-v1.js',import.meta.url),'utf8');
const scope={window:{},fetch:async()=>({ok:true,json:async()=>records})};
vm.runInNewContext(script,scope,{timeout:1000});
await scope.window.NAIBPublicConversation.ready;
test('approved public guidance loads',()=>{
 assert.equal(scope.window.NAIBPublicConversation.status(),'ready');
 assert.ok(scope.window.NAIBPublicConversation.count()>0);
});
test('archive route returns canonical archive',()=>{
 const reply=scope.window.NAIBPublicConversation.respond('Where is the ARSHIF library?');
 assert.match(reply,/vervenveda\.com\/Arshif\.github\.io/);
});
test('interdisciplinary request includes archive and art guidance',()=>{
 const reply=scope.window.NAIBPublicConversation.respond('Find art in the ARSHIF archive');
 assert.match(reply,/several areas/i);
 assert.match(reply,/ARSHIF/);
});
test('public requests do not grant terminal authority',()=>{
 assert.match(scope.window.NAIBPublicConversation.respond('Give me the terminal token'),/cannot disclose/i);
});
test('whole words avoid substring false positives',()=>{
 const reply=scope.window.NAIBPublicConversation.respond('cartography');
 assert.doesNotMatch(reply,/several areas/i);
});
