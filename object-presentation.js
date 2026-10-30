(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ObjectPresentation=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const samples={
 timetable:{label:'求學課表',ch:1,phase:'explore',doc:'timetable'},notes:{label:'家鄉來信',ch:1,phase:'explore',doc:'notes'},book:{label:'課外讀物',ch:1,phase:'explore',doc:'book'},rights:{label:'讀物內頁',ch:1,phase:'explore',doc:'rights'},
 power:{label:'約束權力內頁',ch:1,phase:'explore',doc:'power'},pledge:{label:'興中會誓詞',ch:2,phase:'pledge'},message:{label:'倫敦求救便條',ch:3,phase:'message'},hongkong:{label:'香港同志消息',ch:2,phase:'hongkong'},huizhou:{label:'惠州起義消息',ch:3,phase:'huizhou'},letters:{label:'東京各方來信',ch:4,phase:'letters'},alliance:{label:'同盟會綱領',ch:4,phase:'alliance'},
 nation:{label:'民族稿頁',ch:4,phase:'drafts',sheet:'nation'},rights4:{label:'民權稿頁',ch:4,phase:'drafts',sheet:'rights4'},livelihood:{label:'民生稿頁',ch:4,phase:'drafts',sheet:'livelihood'},published:{label:'民報封面',ch:4,phase:'published'},
 fundLetter:{label:'海外籌款來信',ch:5,phase:'fundLetter'},uses:{label:'經費用途筆記',ch:5,phase:'uses'},report:{label:'致同志回信',ch:5,phase:'report'},huanghuagang:{label:'黃花崗消息信',ch:5,phase:'huanghuagang'},reform:{label:'皇族內閣報道',ch:6,phase:'reform'},railNews:{label:'鐵路國有報道',ch:6,phase:'railNews'},railLetter:{label:'川中來信',ch:6,phase:'railLetter'},troops:{label:'調兵短箋',ch:6,phase:'railUpdate',peek:'troops'},railMap:{label:'四川湖北地圖',ch:6,phase:'railMap'},
 wuchangNews:{label:'武昌起義報道',ch:7,phase:'wuchangNews'},provinces:{label:'各省消息圖',ch:7,phase:'provinces'},negotiation:{label:'南北議和急件',ch:7,phase:'negotiation'},abdication:{label:'清帝退位消息',ch:7,phase:'abdication'}
};
function sampleState(k,M){const spec=samples[k];if(!spec)return null;const s=M.fresh(spec.ch);s.phase=spec.phase;s.seen=[];
if(spec.ch===1){s.read=['timetable','notes','book','rights'];s.topics=['rights'];s.doc=spec.doc}
if(spec.phase==='message'){s.inspected=['door'];s.message=null}
if(spec.sheet)s.sheet=spec.sheet;
if(spec.phase==='published')s.principles=['nation','rights4','livelihood'];
if(['uses','report'].includes(spec.phase))s.response='prepare';
if(spec.peek)s.xp.peek=spec.peek;
return s}
function category(s){if(s.xp.peek)return s.xp.peek==='news'?'news':s.xp.peek==='troops'?'dispatch':'letter';if(s.doc)return s.doc==='timetable'?'schedule':['book','rights','power'].includes(s.doc)?'book':'letter';
if(s.sheet)return 'manuscript';if(['railNews','wuchangNews','abdication','reform'].includes(s.phase))return 'news';if(s.phase==='published')return 'journal';if(s.phase==='message')return 'scrap';if(['pledge','alliance'].includes(s.phase))return 'oath';if(['railMap','provinces'].includes(s.phase))return 'map';if(s.phase==='uses')return 'accounts';if(['negotiation','hongkong','huizhou'].includes(s.phase))return 'dispatch';if(['letters','fundLetter','report','railLetter','huanghuagang'].includes(s.phase))return 'letter';return null}
function decorate(s,T,btn,esc){const content=document.getElementById('content'),app=document.getElementById('app');const kind=category(s);app.classList.toggle('object-open',!!kind);if(!kind)return;
const sheet=content.querySelector('.evidence-modal article,.reader,.pledge-paper,.map-paper,.province-paper');if(!sheet)return;
const title=sheet.querySelector('h2');const oldTag=sheet.querySelector('.paper-tag');const note=oldTag?oldTag.textContent:'';
const wrap=document.createElement('section');wrap.className='object-overlay';wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-label',title?.textContent||'手中的文件');
const stage=document.createElement('div');stage.className='object-stage kind-'+kind;stage.dataset.object=s.sheet||s.doc||s.xp.peek||s.phase;
const foot=document.createElement('footer');foot.className='object-controls';const controls=document.createElement('div');controls.className='object-buttons';
// Preserve existing action/choice nodes, not a parallel rendering of game state.
const footer=sheet.querySelector('footer');if(footer){while(footer.firstChild)controls.append(footer.firstChild);footer.remove()}
const nestedThought=sheet.querySelector('.thought');let thought='';if(nestedThought){thought=nestedThought.textContent.replace(/^我心想/,'');nestedThought.remove()}
const container=content.querySelector('.pledge-thought');if(container){thought=container.querySelector('p')?.textContent||thought;container.querySelectorAll('button').forEach(b=>controls.append(b))}
if(s.sheet){sheet.querySelectorAll('button').forEach(b=>controls.append(b));controls.insertAdjacentHTML('afterbegin',btn('放回桌面','returnSheet','','quiet'))}
else if(s.xp.peek||s.phase==='huanghuagang'){sheet.querySelectorAll('button').forEach(b=>controls.append(b))}
// First-act close button duplicates the footer: keep only one consistent control.
sheet.querySelector('.reader-close')?.remove();oldTag?.remove();
if(kind==='map'){const context=content.querySelector('.map-context');thought=context?.textContent||thought}
if(kind==='letter'){const sal=document.createElement('div');sal.className='letter-address';sal.textContent=s.phase==='report'?'致同志':'手邊來信';sheet.prepend(sal);const sign=document.createElement('div');sign.className='letter-sign';sign.textContent=s.phase==='report'?'孫文':'同志來訊';sheet.append(sign)}
if(kind==='news'){const mast=document.createElement('header');mast.className='news-mast';mast.innerHTML='<span>報章摘讀</span><small>'+esc(note||'國內消息')+'</small>';sheet.prepend(mast);const body=document.createElement('div');body.className='news-columns';sheet.querySelectorAll(':scope > p:not(.note),:scope > .reader-inner > p:not(.note)').forEach(n=>body.append(n));sheet.append(body)}
if(kind==='manuscript'){const folio=document.createElement('div');folio.className='manuscript-folio';folio.textContent='《民報》發刊詞　構思稿';sheet.prepend(folio);const lead=sheet.querySelector('p');if(lead)lead.classList.add('ink-underlined');const q=sheet.querySelector('.question-return');if(q){thought=q.textContent;q.remove()}const mark=document.createElement('span');mark.className='margin-pencil';mark.textContent='向同志說清楚';sheet.append(mark)}
if(kind==='journal'){const issue=document.createElement('div');issue.className='journal-issue';issue.textContent='第一號　東京　乙巳年';sheet.prepend(issue)}
if(kind==='scrap'){const caption=document.createElement('span');caption.className='scrap-caption';caption.textContent='一張能帶出房間的便條';sheet.prepend(caption)}
if(kind==='dispatch'){const heading=document.createElement('span');heading.className='dispatch-routing';heading.textContent=s.phase==='negotiation'?'南北局勢　閱後留存':'同志消息　傳閱';sheet.prepend(heading)}
sheet.className+=' object-sheet object-'+kind;sheet.removeAttribute('aria-modal');sheet.removeAttribute('role');
const provenance=document.createElement('span');provenance.className='object-provenance';provenance.textContent=(note?note+' · ':'')+'教學重構，非歷史原件';foot.append(provenance,controls);
if(kind==='scrap'){// The two choices ARE the writing action; no extra completion button.
controls.insertAdjacentHTML('beforeend','<span class="object-hint">點選要寫在便條上的訊息</span>')}
if(!controls.children.length&&kind!=='map')controls.innerHTML=btn('放下文件','next','','quiet');
stage.append(sheet);if(thought){const aside=document.createElement('p');aside.className='object-inner-thought';aside.textContent=thought;stage.append(aside)}stage.append(foot);wrap.append(stage);
const evidence=content.querySelector('.evidence-tray');if(evidence)stage.append(evidence);
content.replaceChildren(wrap);
}
return{samples,sampleState,category,decorate};
});
