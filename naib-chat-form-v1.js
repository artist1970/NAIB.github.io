/* NAIB public conversation timeline. Page-memory only; no private APIs or persistence. */
(function(){
 "use strict";
 const form=document.getElementById("naib-chat-form");
 const input=document.getElementById("naib-message");
 const ask=document.getElementById("naib-ask");
 const clear=document.getElementById("naib-clear");
 const conversation=document.getElementById("naib-conversation");
 const status=document.getElementById("naib-chat-status");
 if(!form||!input||!ask||!clear||!conversation||!status)return;
 const welcome="Welcome. I can help you explore the ecosystem, research public resources, and find the right specialist. What would you like to discuss?";
 const refresh=()=>{ask.disabled=!input.value.trim();};
 function appendTurn(who,message){
   const turn=document.createElement("div");
   turn.className="naib-turn";
   turn.dataset.speaker=who==="You"?"you":"naib";
   const speaker=document.createElement("span");
   speaker.className="naib-speaker";
   speaker.textContent=who;
   const body=document.createElement("p");
   body.textContent=message;
   turn.append(speaker,body);
   conversation.append(turn);
   conversation.scrollTop=conversation.scrollHeight;
 }
 function submit(event){
   if(event)event.preventDefault();
   const message=input.value.trim();
   if(!message){refresh();return;}
   input.value="";
   refresh();
   appendTurn("You",message);
   let reply;
   try{
     const assistant=window.NAIBPublicConversation;
     if(!assistant||assistant.status()==="unavailable"){
       reply="Public guidance is temporarily unavailable. Please use the public resource directory.";
     }else if(assistant.status()!=="ready"){
       reply="Public guidance is still loading. Please try your question again.";
     }else{
       reply=assistant.respond(message)||"No public guidance is available for that question.";
     }
   }catch{
     reply="Public guidance could not respond. Please use the public resource directory.";
   }
   appendTurn("NAIB",reply);
   status.textContent="Conversation updated.";
   input.focus({preventScroll:true});
 }
 form.addEventListener("submit",submit);
 input.addEventListener("input",refresh);
 input.addEventListener("keydown",event=>{
   if(event.key!=="Enter"||event.shiftKey||event.isComposing)return;
   event.preventDefault();
   if(!ask.disabled)form.requestSubmit();
 });
 clear.addEventListener("click",()=>{
   input.value="";
   conversation.replaceChildren();
   appendTurn("NAIB",welcome);
   status.textContent="Conversation cleared.";
   refresh();
   input.focus({preventScroll:true});
 });
 function focusOnChatRoute(){
   if(window.location.hash==="#naib-chat")input.focus({preventScroll:true});
 }
 window.addEventListener("hashchange",focusOnChatRoute);
 refresh();
 focusOnChatRoute();
})();
