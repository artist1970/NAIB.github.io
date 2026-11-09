import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const script=readFileSync(new URL('../naib-chat-form-v1.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
function node(tag='div'){
 const listeners=new Map();
 return {tagName:tag,value:'',disabled:false,textContent:'',className:'',dataset:{},children:[],listeners,
   scrollTop:0,scrollHeight:200,
   addEventListener(event,fn){listeners.set(event,fn);},
   append(...items){this.children.push(...items);},
   replaceChildren(...items){this.children=[...items];},
   focus(){this.focused=true;},
   requestSubmit(){this.listeners.get('submit')?.({preventDefault(){}});}
 };
}
function setup(){
 const elements=new Map();
 for(const id of ['naib-chat-form','naib-message','naib-ask','naib-clear','naib-conversation','naib-chat-status'])elements.set(id,node());
 elements.get('naib-ask').disabled=true;
 const log=elements.get('naib-conversation');
 const greeting=node();greeting.dataset.speaker='naib';log.append(greeting);
 const window={location:{hash:''},addEventListener(){}};
 window.NAIBPublicConversation={status:()=>'ready',respond:q=>'Reply: '+q};
 vm.runInNewContext(script,{window,document:{getElementById:id=>elements.get(id),createElement:node}},{timeout:1000});
 return {get:id=>elements.get(id),window};
}
function send(a,message,via='submit'){
 const input=a.get('naib-message');input.value=message;input.listeners.get('input')();
 if(via==='enter')input.listeners.get('keydown')({key:'Enter',shiftKey:false,isComposing:false,preventDefault(){}});
 else a.get('naib-chat-form').listeners.get('submit')({preventDefault(){}});
}
function turns(a){return a.get('naib-conversation').children.map(turn=>({who:turn.dataset.speaker,message:turn.children[1]?.textContent}));}
test('Meet NAIB lands on chronological conversation',()=>{
 assert.match(html,/href="#naib-chat"[^>]*>\s*Meet NAIB/);
 assert.match(html,/id="naib-conversation" role="log"/);
 assert.doesNotMatch(html,/id="naib-answer"/);
});
test('send control enabled only for entered nonblank text',()=>{
 const a=setup(),input=a.get('naib-message'),ask=a.get('naib-ask');
 assert.equal(ask.disabled,true);
 input.value='  ';input.listeners.get('input')();assert.equal(ask.disabled,true);
 input.value='Hello';input.listeners.get('input')();assert.equal(ask.disabled,false);
});
test('multiple messages append in chronological order without erasing replies',()=>{
 const a=setup();send(a,'First question');send(a,'Second question');
 const t=turns(a);
 assert.equal(t.length,5);
 assert.deepEqual(t.slice(1).map(x=>x.who),['you','naib','you','naib']);
 assert.deepEqual(t.slice(1).map(x=>x.message),['First question','Reply: First question','Second question','Reply: Second question']);
 assert.equal(a.get('naib-message').value,'');
});
test('Enter submits, Shift+Enter adds a new line',()=>{
 const a=setup(),input=a.get('naib-message');send(a,'Keyboard message','enter');
 assert.equal(turns(a).length,3);
 let prevented=false;
 input.listeners.get('keydown')({key:'Enter',shiftKey:true,isComposing:false,preventDefault(){prevented=true;}});
 assert.equal(prevented,false);
 assert.equal(turns(a).length,3);
});
test('Clear Conversation resets the stream, not just the input',()=>{
 const a=setup();send(a,'Prior question');
 a.get('naib-clear').listeners.get('click')();
 assert.equal(turns(a).length,1);
 assert.equal(turns(a)[0].who,'naib');
 assert.match(turns(a)[0].message,/Welcome/);
 assert.equal(a.get('naib-ask').disabled,true);
 assert.equal(a.get('naib-message').focused,true);
});
test('No browser persistence and user messages render as plain text',()=>{
 assert.doesNotMatch(script,/localStorage|sessionStorage|indexedDB|innerHTML/);
 assert.match(script,/body\.textContent=message/);
});
