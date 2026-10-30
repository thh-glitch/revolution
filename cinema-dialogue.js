(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.CinemaDialogue=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const samples={intro:{ch:1,phase:'intro',label:'一幕・同學說話'},teacher:{ch:1,phase:'teacher',label:'一幕・詢問老師'},gather:{ch:2,phase:'gather',label:'二幕・聯合同志'},founded:{ch:2,phase:'founded',label:'二幕・成立後的心念'},exile:{ch:3,phase:'exile',label:'三幕・流亡獨白'},appeal:{ch:3,phase:'appeal',label:'三幕・向柯爾求助'},rescue:{ch:3,phase:'rescue',index:1,label:'三幕・獲釋對話'},union:{ch:4,phase:'union',label:'四幕・與黃興交談'},drafts:{ch:4,phase:'drafts',label:'四幕・同志提問'},speech:{ch:5,phase:'speech',label:'五幕・海外演講'},doubt:{ch:5,phase:'doubt',label:'五幕・回應華僑'},huangReflection:{ch:5,phase:'huangReflection',label:'五幕・犧牲後的心念'},railIntro:{ch:6,phase:'railIntro',label:'六幕・同志送來消息'},railChoice:{ch:6,phase:'railChoice',label:'六幕・關注哪一處'},provinceTalk:{ch:7,phase:'provinceTalk',label:'七幕・各省響應對話'},republic:{ch:7,phase:'republic',index:1,label:'七幕・建國待辦'},reflection:{ch:7,phase:'reflection',label:'七幕・回望革命'}};
function voice(speaker,phase){return /我心想|心念|旁白/.test(speaker)||['exile','finale','reflection'].includes(phase)?'thought':'spoken'}
function sampleState(k,M){const v=samples[k];if(!v)return null;const s=M.fresh(v.ch);s.phase=v.phase;s.index=v.index||0;s.seen=[];
if(v.ch===1){s.read=['timetable','notes','rights'];s.topics=['rights']}
if(['appeal','rescue'].includes(v.phase)){s.inspected=['door','window'];s.message='clear'}
if(v.phase==='rescue')s.xp.cole=['identity','fear'];
if(v.phase==='founded')s.xp.group=['contacts','funds','action'];
if(v.phase==='railChoice')s.mapRead=['hubei'];
return s}
function decorate(s){const app=document.getElementById('app'),content=document.getElementById('content');const panels=[...content.querySelectorAll('.caption-panel')];const active=!app.classList.contains('object-open')&&(panels.length>0||s.phase==='reflection');app.classList.toggle('film-scene',active);if(!active)return;
for(const panel of panels){panel.classList.add('cinema-dialogue');const speaker=panel.querySelector(':scope > .speaker');const text=speaker?.textContent.trim()||'';const type=voice(text,s.phase);panel.classList.toggle('inner-voice',type==='thought');panel.dataset.voice=type;
if(type==='thought'&&speaker){speaker.textContent='心念';speaker.setAttribute('aria-label','孫中山的內心獨白')}
else if(speaker){speaker.dataset.speaker=text.split(' · ')[0]}
// Consequential dialogue is still spoken, even inside a thought-led panel.
panel.querySelectorAll('.scene-reply').forEach(reply=>{const lines=[...reply.childNodes].map(n=>n.nodeName==='BR'?'\n':n.textContent).join('').split(/\n/).filter(Boolean);reply.replaceChildren();for(const line of lines){const p=document.createElement('div');p.className='cinema-reply-line';const colon=line.indexOf('：');if(colon>0&&colon<22){const name=document.createElement('span');name.className='reply-name';name.textContent=line.slice(0,colon);p.append(name,document.createTextNode(line.slice(colon+1)))}else p.textContent=line;reply.append(p)}});
// Decorative quote marker is separate from real action labels and accessible names.
panel.querySelectorAll('.immersive-choice,.spoken-choices .spoken').forEach(b=>b.classList.add('cinema-choice'));
}
}
return{samples,voice,sampleState,decorate};
});
