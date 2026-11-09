import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const script=readFileSync(new URL('../naib-chat-form-v1.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
function setup(){
  const elements=new Map();
  for(const id of ['naib-chat-form','naib-message','naib-ask','naib-clear','naib-answer']){
    const listeners=new Map();
    elements.set(id,{value:'',disabled:id==='naib-ask',textContent:'',listeners,
      addEventListener(event,fn){listeners.set(event,fn)},
      focus(){this.focused=true},
      requestSubmit(){this.listeners.get('submit')?.({preventDefault(){}})}
    });
  }
  const window={location:{hash:''},addEventListener(){}};
  window.NAIBPublicConversation={status:()=>'ready',respond:q=>'Reply: '+q};
  const context={window,document:{getElementById:id=>elements.get(id)}};
  vm.runInNewContext(script,context,{timeout:1000});
  return {elements,get:id=>elements.get(id),window};
}
test('Meet NAIB targets conversation, not purpose cards',()=>{
 assert.match(html,/href="#naib-chat"[^>]*>\s*Meet NAIB/);
 assert.match(html,/id="naib-chat-form"/);
 assert.match(html,/id="naib-ask" disabled/);
 assert.match(html,/scroll-margin-top:150px/);
});
test('Ask NAIB is disabled until non-blank text is typed',()=>{
 const a=setup(),input=a.get('naib-message'),ask=a.get('naib-ask');
 assert.equal(ask.disabled,true);
 input.value='  ';
 input.listeners.get('input')();
 assert.equal(ask.disabled,true);
 input.value='Hello NAIB';
 input.listeners.get('input')();
 assert.equal(ask.disabled,false);
});
test('click/submit posts typed message into answer',()=>{
 const a=setup(),input=a.get('naib-message');
 input.value='Hello NAIB';
 a.get('naib-chat-form').listeners.get('submit')({preventDefault(){}});
 assert.equal(a.get('naib-answer').textContent,'Reply: Hello NAIB');
});
test('Enter submits while Shift+Enter does not',()=>{
 const a=setup(),input=a.get('naib-message');
 input.value='Can you help?';input.listeners.get('input')();
 let prevented=0;
 const key=input.listeners.get('keydown');
 key({key:'Enter',shiftKey:false,isComposing:false,preventDefault(){prevented++}});
 assert.equal(prevented,1);
 assert.equal(a.get('naib-answer').textContent,'Reply: Can you help?');
 a.get('naib-answer').textContent='unchanged';
 key({key:'Enter',shiftKey:true,isComposing:false,preventDefault(){prevented++}});
 assert.equal(prevented,1);
 assert.equal(a.get('naib-answer').textContent,'unchanged');
});
test('Clear resets text, response, disabled state and focus',()=>{
 const a=setup(),input=a.get('naib-message');
 input.value='Question';input.listeners.get('input')();
 a.get('naib-clear').listeners.get('click')();
 assert.equal(input.value,'');
 assert.equal(a.get('naib-ask').disabled,true);
 assert.equal(input.focused,true);
});
