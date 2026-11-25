"use strict";
const byId=id=>document.getElementById(id);
let lang="vi", deadline=0, tick=null;
function setLang(next){lang=next;document.documentElement.lang=next;document.querySelectorAll("[data-vi]").forEach(el=>el.hidden=next!=="vi");document.querySelectorAll("[data-en]").forEach(el=>el.hidden=next!=="en");byId("language").textContent=next==="vi"?"EN":"VI";byId("language").setAttribute("aria-label",next==="vi"?"Switch to English":"Chuyển sang tiếng Việt");updateWords();} 
byId("language").addEventListener("click",()=>setLang(lang==="vi"?"en":"vi"));
byId("year").addEventListener("change",()=>{const y=byId("year").value;document.querySelectorAll("[data-year]").forEach(row=>row.hidden=y!=="all"&&row.dataset.year!==y);});
function updateWords(){const t=byId("essay").value.trim();const n=t?t.split(/\s+/u).length:0;byId("words").textContent=n+(lang==="vi"?" từ":" words");}
byId("essay").addEventListener("input",updateWords);
function showTimer(){const remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));byId("timer").textContent=String(Math.floor(remaining/60)).padStart(2,"0")+":"+String(remaining%60).padStart(2,"0");if(!remaining){clearInterval(tick);tick=null;byId("start").disabled=false;byId("labstatus").textContent=lang==="vi"?"Hết giờ luyện tập. Bạn có thể tiếp tục chỉnh sửa; không phải bài thi chính thức.":"Practice time ended. You may keep editing; this is not an official exam.";}}
byId("start").addEventListener("click",()=>{if(tick!==null)return;deadline=Date.now()+30*60*1000;byId("start").disabled=true;byId("labstatus").textContent="";showTimer();tick=setInterval(showTimer,250);});
byId("clear").addEventListener("click",()=>{if(!byId("essay").value||window.confirm(lang==="vi"?"Xóa bài luyện tập hiện tại?":"Clear the current practice essay?")){byId("essay").value="";updateWords();}});
byId("download").addEventListener("click",()=>{const url=URL.createObjectURL(new Blob([byId("essay").value],{type:"text/plain;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="vpo-practice-essay.txt";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});
setLang("vi");