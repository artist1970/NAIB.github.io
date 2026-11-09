/* NAIB public chat controls: local guidance, no persistence or privileged requests. */
(function(){
 "use strict";
 const form=document.getElementById("naib-chat-form");
 const input=document.getElementById("naib-message");
 const ask=document.getElementById("naib-ask");
 const clear=document.getElementById("naib-clear");
 const output=document.getElementById("naib-answer");
 if(!form||!input||!ask||!clear||!output)return;
 const refresh=()=>{ask.disabled=!input.value.trim();};
 function submit(event){
   if(event)event.preventDefault();
   const message=input.value.trim();
   if(!message){refresh();return;}
   try{
     const assistant=window.NAIBPublicConversation;
     if(!assistant||assistant.status()==="unavailable"){
       output.textContent="Public guidance is temporarily unavailable. Please use the public resource directory.";
     }else if(assistant.status()!=="ready"){
       output.textContent="Public guidance is loading. Please try sending again.";
     }else{
       output.textContent=assistant.respond(message)||"No public guidance is available for that question.";
     }
   }catch{
     output.textContent="Public guidance could not respond. Please use the public resource directory.";
   }
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
   output.textContent="What would you like to explore?";
   refresh();
   input.focus();
 });
 function focusOnChatRoute(){
   if(window.location.hash==="#naib-chat")input.focus({preventScroll:true});
 }
 window.addEventListener("hashchange",focusOnChatRoute);
 refresh();
 focusOnChatRoute();
})();
