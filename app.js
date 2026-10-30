(()=>{'use strict';
const M=window.ActOne,T=window.ActText,$=id=>document.getElementById(id);
const db={getItem:k=>localStorage.getItem(k),setItem:(k,v)=>localStorage.setItem(k,v)};
const supplements={hongkong:{chapter:'第二幕',place:'1895年 · 香港',image:'honolulu.png'},huizhou:{chapter:'第三幕',place:'1900年 · 海外消息',image:'london-rescue.png'},huanghuagang:{chapter:'第五幕',place:'1911年 · 海外',image:'nanyang.png'},huangReflection:{chapter:'第五幕',place:'1911年 · 海外',image:'nanyang.png'},reform:{chapter:'第六幕',place:'1911年 · 海外',image:'overseas1911.png'},negotiation:{chapter:'第七幕',place:'1912年初 · 南京',image:'nanjing-office.png'}};
const seventh=['wuchangIntro','wuchangNews','responseIntro','provinces','provinceTalk','voyage','inauguration','republic','abdicationIntro','abdication','reflection','journeyEnd'];
const sixth=['railIntro','railNews','railLetter','railReaction','railUpdate','railMap','railChoice','railResult','railEnd'];
const fifth=['overseas','fundLetter','speech','doubt','answer','fundQuestion','uses','family','support','report','fundEnd'];
const fourth=['tokyo','letters','union','alliance','drafts','common','published'];
const principleKeys=['nation','rights4','livelihood'];
const third=['exile','captured','cell','message','attempt','cole','appeal','trust','delivered','unlock','rescue','finale'];
const stored=M.load(db);let main=stored.state||M.fresh(),state=main,mode='main',cover=true,hasProgress=!!stored.state,lastClick=0,saveBlocked=stored.error;
let settings={sound:false,reduce:matchMedia('(prefers-reduced-motion: reduce)').matches};
try{const p=JSON.parse(db.getItem('sun-revolution.act1.prototype.v1.settings'));if(p&&typeof p.sound==='boolean'&&typeof p.reduce==='boolean')settings=p}catch{}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const btn=(label,action,value='',cls='')=>`<button class="${cls}" data-action="${action}" data-value="${esc(value)}">${label}</button>`;
let audio;
function sound(kind){if(!settings.sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const dur=kind==='step'?.16:.11,b=audio.createBuffer(1,Math.ceil(audio.sampleRate*dur),audio.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);const src=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();src.buffer=b;filter.type='lowpass';filter.frequency.value=kind==='step'?160:1600;gain.gain.value=.055;src.connect(filter).connect(gain).connect(audio.destination);src.start()}catch{settings.sound=false;$('sound').checked=false}}
function applySettings(){document.body.classList.toggle('reduce',settings.reduce);$('sound').checked=settings.sound;$('motion').checked=settings.reduce}
function warn(){const el=$('saveWarning');el.hidden=!saveBlocked;el.textContent=stored.error?'無法讀取原有存檔；本次可繼續遊玩，但不會覆蓋原資料。':'目前無法儲存進度；本次仍可遊玩，請先不要關閉網頁。'}
function persist(){if(mode==='main'){main=state;hasProgress=true;if(!saveBlocked&&!M.save(db,state,mode).ok)saveBlocked=true}warn()}
function current(){if(state.phase==='railResult')return T[state.judgment];if(state.phase==='answer')return T[state.response];return T[state.sheet||state.doc||state.phase+(['intro','teacher','gather','appeal','rescue','union','common','family','railReaction','provinceTalk','republic'].includes(state.phase)?state.index:'')]}
function imageFor(){if(!cover&&state.phase==='republic'&&state.index===1)return 'assets/nanjing-office.png';if(!cover&&supplements[state.phase])return 'assets/'+supplements[state.phase].image;if(!cover&&seventh.includes(state.phase))return state.phase==='voyage'?'assets/return-ship.png':['inauguration','republic'].includes(state.phase)?'assets/nanjing-oath.png':['abdicationIntro','abdication','reflection','journeyEnd'].includes(state.phase)?'assets/nanjing-office.png':'assets/usa-hotel.png';if(!cover&&sixth.includes(state.phase))return ['railNews','railLetter','railMap'].includes(state.phase)?'assets/overseas1911-desk.png':'assets/overseas1911.png';if(!cover&&fifth.includes(state.phase))return 'assets/nanyang.png';if(!cover&&fourth.includes(state.phase))return ['drafts','common','published'].includes(state.phase)?'assets/tokyo-desk.png':'assets/tokyo-meeting.png';if(!cover&&third.includes(state.phase)){if(['rescue','finale'].includes(state.phase))return 'assets/london-rescue.png';if(['cole','appeal','trust','delivered'].includes(state.phase))return 'assets/london-cole.png';return 'assets/london-room.png'}if(!cover&&['gather','pledge','founded','finished'].includes(state.phase))return 'assets/honolulu.png';return !cover&&state.phase==='teacher'?'assets/teacher.png':!cover&&['year','petition','waiting','resolve','end'].includes(state.phase)?'assets/petition.png':'assets/classroom.png'}
function sceneKey(){if(!cover&&state.phase==='republic'&&state.index===1)return '1912年1月 · 南京臨時政府辦公室';if(!cover&&supplements[state.phase])return supplements[state.phase].place;if(!cover&&seventh.includes(state.phase))return state.phase==='voyage'?'1911年末 · 回國航程':['inauguration','republic'].includes(state.phase)?'1912年1月1日 · 南京':['abdicationIntro','abdication','reflection','journeyEnd'].includes(state.phase)?'1912年2月12日 · 南京':'1911年10月起 · 美國';if(!cover&&sixth.includes(state.phase))return '1911年 · 海外寓所';if(!cover&&fifth.includes(state.phase))return '同盟會成立後 · 南洋';if(!cover&&fourth.includes(state.phase))return ['drafts','common','published'].includes(state.phase)?'1905年11月 · 東京':'1905年 · 日本東京';if(!cover&&third.includes(state.phase))return state.phase==='exile'?'1895—1896年 · 流亡海外':['rescue','finale'].includes(state.phase)?'1896年10月23日 · 倫敦':'1896年10月 · 倫敦公使館';if(!cover&&['gather','pledge','founded','finished'].includes(state.phase))return '1894年 · 檀香山';return !cover&&['year','petition','waiting','resolve','end'].includes(state.phase)?'1894年 · 改革與救國':'香港 · 西醫書院求學時期'}
const act1Phases=['intro','explore','teacher','year','petition','waiting','resolve','end'];
function inAct1(){return !cover&&act1Phases.includes(state.phase)}
function caption(d){if(inAct1())return `<section class="caption-panel" aria-label="故事對話">${state.phase==='teacher'?'<div class="teacher-heading">詢問老師</div>':''}<div class="speaker">${d.speaker}</div>${d.aside?`<p class="aside">${esc(d.aside)}</p>`:''}<p tabindex="-1" id="focusText">${esc(d.text)}</p><div class="tap-cue">點一下畫面，繼續故事</div></section>`;return `<section class="caption-panel" aria-label="故事對話"><div class="speaker">${d.speaker}</div>${d.aside?`<p class="aside">${esc(d.aside)}</p>`:''}<p tabindex="-1" id="focusText">${esc(d.text)}</p><div class="caption-actions">${state.phase==='gather'&&state.index===1?btn('提出成立興中會 →','propose','','primary'):btn('繼續 →','next','','quiet')}</div></section>`}
function reading(key){if(key==='petition')return PhysicalDocuments.petition(T.petition,btn,esc);const d=T[key];let body=`<div class="paper-tag">${d.tag}</div><h2 id="focusText" tabindex="-1">${d.title}</h2>`;
 if(key==='timetable')body+=`<table class="study-timetable"><caption>西醫學習課表</caption><thead><tr><th scope="col">科目</th><th scope="col">學習內容</th></tr></thead><tbody>${d.rows.map(r=>`<tr><th scope="row">${r[0]}</th><td>${r[1]}</td></tr>`).join('')}</tbody></table>`;
 else if(d.rows)body+=d.rows.map(r=>`<div class="subject-row"><span>${r[0]}</span><span>${r[1]}</span></div>`).join('');
 if(d.text)body+=`<p class="${key==='petition'?'petition-text':''}">${key==='petition'?d.text.replaceAll('，','，<br>'):esc(d.text)}</p>`;
 if(key==='book')body+=['rights','power'].map(k=>btn(T[k].title+(state.topics.includes(k)?' <span aria-label="已讀">✓</span>':''),'open',k,'choice')).join('');
 if(d.thought)body+=`<p class="thought"><span>我心想</span>${esc(d.thought)}</p>`;
 if(d.note)body+=`<p class="note">${d.note}</p>`;
 let actions=key==='petition'?btn('請人轉呈上書 →','submit','','primary'):['rights','power'].includes(key)?btn('返回桌面','close','','primary'):btn(key==='book'?'返回桌面':'放回桌面','close','','primary');
 return `<section class="reader act1-reader" role="dialog" aria-modal="true" aria-label="${d.title}"><button class="reader-close" data-action="${key==='petition'?'submit':'close'}" aria-label="${key==='petition'?'轉呈上書並離開':'關閉閱讀，返回桌面'}">${key==='petition'?'轉呈上書 →':'關閉 ✕'}</button><div class="reader-inner">${body}</div><footer>${actions}</footer></section>`}
function exploration(){const read=state.read,topic=state.topics.length;
 const spots=[['timetable','查看課表',17,70]];if(read.includes('timetable'))spots.push(['notes','家鄉消息',37,65],['book','課外讀物',75,65]);
 // Actual coordinates are attached to the image canvas, not to the viewport.
 const html=spots.map(([key,label,x,y])=>`<button class="hotspot ${read.includes(key)||key==='book'&&topic?'visited':''}" data-action="open" data-value="${key}" data-x="${x}" data-y="${y}"><span class="dot" aria-hidden="true"></span>${label}${read.includes(key)||key==='book'&&topic?'<span class="read">已讀</span>':''}</button>`).join('');
 return html+`<p class="explore-note">${!read.includes('timetable')?'桌上露出一角的課表，記着我的學習。':topic?'老師停在桌旁。我可以再讀一會，或向他請教。':'醫學講義旁，還有一本談國家治理的讀物。'}</p>`+(topic?`<div class="teacher-action">${btn('詢問老師 →','teacher','','primary')}</div>`:'')}
function thirdView(){
 const d=current();
 const panel=(data,actions)=>`<section class="caption-panel"><div class="speaker">${esc(data.speaker||'我心想')}</div>${data.aside?`<p class="aside">${esc(data.aside)}</p>`:''}<p id="focusText" tabindex="-1">${esc(data.text)}</p><div class="caption-actions">${actions}</div></section>`;
 if(state.phase==='cell'){
  if(state.look)return panel(T[state.look],btn('再看看房間','backRoom','','quiet')+btn('寫下求救訊息 →','write','','primary'));
  return `<div class="room-spots">${btn('查看房門'+(state.inspected.includes('door')?' · 已看':''),'inspect','door','room-door')}${btn('走近窗邊'+(state.inspected.includes('window')?' · 已看':''),'inspect','window','room-window')}</div>`+panel(T.cell,state.inspected.length?btn('寫下求救訊息 →','write','','primary'):'');
 }
 if(state.phase==='message')return `<section class="reader rescue-note"><div class="reader-inner"><span class="paper-tag">我手中的便條</span><h2 id="focusText" tabindex="-1">${d.title}</h2><p>${d.text}</p>${btn('我是孫文，被囚在清朝公使館，請通知康德黎。','chooseMessage','clear','choice')}${btn('救命！請立刻救我出去！','chooseMessage','vague','choice')}</div></section>`;
 if(state.phase==='attempt')return panel({...d,aside:state.message==='clear'?'名字、位置和求助的人，都寫清楚了。':'只寫「救命」，別人怎知道我在哪裏？我補上姓名、位置和老師的名字。'},btn('繼續 →','next','','quiet'));
 if(state.phase==='cole')return panel(d,btn('請柯爾幫忙傳訊 →','askCole','','primary'));
 if(state.phase==='trust')return panel(d,btn('交出求救訊息 →','give','','primary'));
 if(state.phase==='unlock')return panel(d,btn('走出房間 →','leave','','primary'));
 if(state.phase==='finale')return `<section class="caption-panel"><div class="speaker">第三幕 · 讓外面的人知道</div><h2 id="focusText" tabindex="-1">${d.title}</h2><p>${d.text}</p><div class="caption-actions">${btn('繼續旅程 →','next','','primary')}</div></section>`;
 return caption(d);
}
function fourthView(){
 const d=current();
 const panel=(data,actions)=>`<section class="caption-panel"><div class="speaker">${esc(data.speaker||'我心想')}</div>${data.aside?`<p class="aside">${esc(data.aside)}</p>`:''}<p id="focusText" tabindex="-1">${esc(data.text)}</p><div class="caption-actions">${actions}</div></section>`;
 if(state.phase==='tokyo')return panel(d,btn('翻看各方來信 →','letters','','primary'));
 if(state.phase==='letters')return `<section class="reader act4-paper"><div class="reader-inner"><span class="paper-tag">${d.tag}</span><h2 id="focusText" tabindex="-1">${d.title}</h2>${d.text.split('\n').map(x=>`<p>${esc(x)}</p>`).join('')}</div><footer>${btn('放下來信，與黃興交談 →','next','','primary')}</footer></section>`;
 if(state.phase==='union')return panel(d,state.index===1?btn('與各方同志商議聯合 →','unite','','primary'):btn('繼續 →','next','','quiet'));
 if(state.phase==='alliance')return `<section class="alliance-view"><article class="pledge-paper"><span class="paper-tag">${d.tag}</span><h2 id="focusText" tabindex="-1">${d.title}</h2><p class="oath">驅除韃虜，恢復中華，<br>創立民國，平均地權。</p><p class="alliance-fact">孫中山被推選為總理。<br>中國近代第一個全國性的資產階級革命政黨。</p></article><div class="pledge-thought"><p>${d.thought}</p>${btn('繼續 →','next','','quiet')}</div></section>`;
 if(state.phase==='drafts'){
  if(state.sheet)return `<section class="reader act4-paper"><div class="reader-inner"><span class="paper-tag">三民主義 · 教學稿頁</span><h2 id="focusText" tabindex="-1">${d.title}｜${d.tag}</h2><p class="principle-claim">${d.text}</p><p class="thought"><span>我心想</span>${d.thought}</p>${d.note?`<p class="principle-note">${d.note}</p>`:''}</div><footer>${btn('放回桌面 →','putSheet','','primary')}</footer></section>`;
  return `<div class="manuscripts" aria-label="桌上的三張稿頁">${principleKeys.map((k,i)=>`<button class="manuscript ${state.principles.includes(k)?'read-sheet':''}" data-action="principle" data-value="${k}"><span class="sheet-heading">${T[k].title}</span><span>${T[k].tag}</span><small>${state.principles.includes(k)?'已讀 · 再看':'拿起稿頁'}</small></button>`).join('')}</div>`+panel(T.drafts,'');
 }
 if(state.phase==='common')return panel(d,state.index===1?btn('將主張刊於《民報》 →','publish','','primary'):btn('繼續 →','next','','quiet'));
 return `<section class="alliance-view publication"><article class="pledge-paper"><span class="paper-tag">${d.tag} · 教學示意</span><h2 id="focusText" tabindex="-1">民報</h2><p class="oath">${d.text}</p><p class="alliance-fact">發刊詞闡述三民主義</p></article><div class="pledge-thought"><p>${d.thought}</p><div class="caption-actions">${btn('繼續旅程 →','next','','primary')}</div></div></section>`;
}
function fifthView(){
 const d=current();
 const panel=(data,actions)=>`<section class="caption-panel"><div class="speaker">${esc(data.speaker||'我心想')}</div>${data.aside?`<p class="aside">${esc(data.aside)}</p>`:''}<p id="focusText" tabindex="-1">${esc(data.text)}</p><div class="caption-actions">${actions}</div></section>`;
 if(state.phase==='overseas')return panel(d,btn('查看來信 →','fundLetter','','primary'));
 if(['fundLetter','uses','report'].includes(state.phase))return `<section class="reader act5-paper"><div class="reader-inner"><span class="paper-tag">${d.tag}</span><h2 id="focusText" tabindex="-1">${d.title}</h2>${d.rows?d.rows.map(r=>`<div class="fund-use"><h3>${r[0]}</h3><p>${r[1]}</p></div>`).join(''):`<p>${d.text}</p>`}</div><footer>${btn(state.phase==='fundLetter'?'放下來信，向大家說明 →':state.phase==='uses'?'繼續交談 →':'收好信件 →','next','','primary')}</footer></section>`;
 if(state.phase==='doubt')return panel(d,`<div class="spoken-choices">${btn('我不能保證下一次成功，但我們正在加強準備。','reply','prepare','spoken')}${btn('推翻專制、建立共和的目標，仍值得努力。','reply','ideal','spoken')}</div>`);
 if(state.phase==='fundQuestion')return panel(d,btn('展開經費用途簡表 →','showUses','','primary'));
 if(state.phase==='support')return panel(d,btn('寫信告知同志：已籌得一筆經費 →','reportFunds','','primary'));
 if(state.phase==='fundEnd')return panel({...d,aside:'第五幕 · 讓革命走下去'},btn('繼續旅程 →','next','','primary'));
 return caption(d);
}
function sixthView(){
 const d=current();
 const panel=(data,actions)=>`<section class="caption-panel"><div class="speaker">${esc(data.speaker||'我心想')}</div>${data.aside?`<p class="aside">${esc(data.aside)}</p>`:''}<p id="focusText" tabindex="-1">${esc(data.text)}</p><div class="caption-actions">${actions}</div></section>`;
 if(state.phase==='railIntro')return panel(d,btn('拿起報紙 →','railNews','','primary'));
 if(['railNews','railLetter'].includes(state.phase))return `<section class="reader act6-paper"><div class="reader-inner"><span class="paper-tag">${d.tag}</span><h2 id="focusText" tabindex="-1">${d.title}</h2><p>${d.text}</p></div><footer>${btn(state.phase==='railNews'?'放下報紙，讀取來信 →':'放下來信 →',state.phase==='railNews'?'railLetter':'next','','primary')}</footer></section>`;
 if(state.phase==='railUpdate')return panel(d,btn('攤開地圖 →','openMap','','primary'));
 if(state.phase==='railMap')return `<section class="map-paper"><span class="paper-tag">桌上位置示意 · 非精確疆界或行軍路線</span><h2 id="focusText" tabindex="-1">四川與湖北</h2><div class="map-space"><svg viewBox="0 0 600 190" aria-hidden="true"><path class="map-river" d="M30 145 Q150 45 265 125 T570 80"/>${state.mapRead.includes('hubei')?'<defs><marker id="arrow6" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#82603c"/></marker></defs><path class="troop-line" d="M425 85 Q300 15 170 85" marker-end="url(#arrow6)"/>':''}</svg>${btn('四川','region','sichuan','map-sichuan')}${btn('湖北','region','hubei','map-hubei')}<span class="remaining">湖北仍有守軍</span>${state.mapRead.includes('hubei')?'<span class="troop-label">部分湖北新軍入川</span>':''}</div><p class="region-note">${state.region==='sichuan'?'四川：保路風潮擴大，官府拘捕及開槍鎮壓。':state.region==='hubei'?'湖北：部分新軍被調往四川，原有防務減弱。':'點選湖北，查看調兵帶來的變化。四川也可查看。'}</p><footer>${state.mapRead.includes('hubei')?btn('想想這個變化 →','next','','primary'):''}</footer></section>`+`<div class="map-context">${esc(d.text)}</div>`;
 if(state.phase==='railChoice')return panel(d,`<div class="spoken-choices">${btn('湖北防務減弱，可能出現起義機會。','judge','chance','spoken')}${btn('兵都調走了，起義一定成功。','judge','certain','spoken')}</div>`);
 if(state.phase==='railEnd')return panel(d,btn('繼續旅程 →','next','','primary'));
 return caption(d);
}
function seventhView(){
 const d=current();
 const panel=(data,actions)=>`<section class="caption-panel"><div class="speaker">${esc(data.speaker||'我心想')}</div>${data.aside?`<p class="aside">${esc(data.aside)}</p>`:''}<p id="focusText" tabindex="-1">${esc(data.text)}</p><div class="caption-actions">${actions}</div></section>`;
 if(state.phase==='wuchangIntro')return panel(d,btn('讀取報紙上的中國消息 →','readWuchang','','primary'));
 if(['wuchangNews','abdication'].includes(state.phase))return `<section class="reader act7-paper"><div class="reader-inner"><span class="paper-tag">${d.tag}</span><h2 id="focusText" tabindex="-1">${d.title}</h2><p>${d.text}</p>${d.thought?`<p class="thought"><span>我心想</span>${d.thought}</p>`:''}</div><footer>${btn('放下消息 →','next','','primary')}</footer></section>`;
 if(state.phase==='responseIntro')return panel(d,btn('查看各地消息 →','showProvinces','','primary'));
 if(state.phase==='provinces')return `<section class="province-paper"><span class="paper-tag">各省消息 · 相對位置示意</span><h2 id="focusText" tabindex="-1">各省響應</h2><div class="province-positions"><span class="province-mark shaanxi">陝西<span>響應革命</span></span><span class="province-mark hubei">湖北 · 武昌<span>起義所在</span></span><span class="province-mark hunan">湖南<span>響應革命</span></span></div><p>${d.text}</p><p class="small">「獨立」指脫離清廷統治。僅示例部分省份。</p><footer>${btn('繼續 →','next','','primary')}</footer></section>`;
 if(state.phase==='inauguration')return panel(d,btn('宣誓就任臨時大總統 →','swear','','primary'));
 if(state.phase==='abdicationIntro')return panel(d,btn('閱讀退位消息 →','readAbdication','','primary'));
 if(state.phase==='reflection')return `<section class="reflection-view"><div class="reflection-text"><span class="speaker">我心想</span><p id="focusText" tabindex="-1">${d.text}</p><ol class="closing-dates"><li><time>1911年10月10日</time>武昌起義</li><li><time>1912年1月1日</time>中華民國臨時政府成立</li><li><time>1912年2月12日</time>清帝退位，清朝統治結束</li></ol>${btn('完成這段旅程 →','finishJourney','','primary')}</div></section>`;
 if(state.phase==='journeyEnd')return `<section class="ending"><span class="eyebrow">孫中山的革命之路</span><h1 id="focusText" tabindex="-1">${d.title}</h1><p>${d.text}</p><div class="cover-actions">${btn('從頭重看','replay','','primary')}${btn('回到封面','home','','quiet')}</div><p class="small">${mode==='replay'?'重看未改寫主線進度。':saveBlocked?'本次已完成，進度未能儲存。':'完成進度已保留。'}</p></section>`;
 return caption(d);
}
function supplementView(){
 const d=current();
 if(['hongkong','huizhou','huanghuagang','reform','negotiation'].includes(state.phase))return `<section class="reader supplement-paper"><div class="reader-inner"><span class="paper-tag">${d.aside}</span><h2 id="focusText" tabindex="-1">${({hongkong:'香港的革命基地',huizhou:'革命沒有停下',huanghuagang:'黃花崗之役',reform:'改革，為何仍令人失望？',negotiation:'南北交涉與共和'})[state.phase]}</h2><p>${d.text}</p><p class="note">史事摘要與第一身思考為教學改編，並非原件或原話。</p></div><footer>${btn('繼續 →','next','','primary')}</footer></section>`;
 return caption(d);
}
function render(focus=true){
 const mobile=matchMedia('(max-width:650px), (max-aspect-ratio:4/3)').matches;
 $('app').className=cover?'is-cover':`is-${state.phase}${state.doc||state.sheet||state.phase==='petition'?' is-reading':''}${state.look?' look-'+state.look:''}`;
 const src=imageFor();if(!$('scene').src.endsWith(src))$('scene').src=src;
 $('location').textContent=sceneKey();$('chapterNumber').textContent=!cover&&supplements[state.phase]?supplements[state.phase].chapter:!cover&&seventh.includes(state.phase)?'第七幕':!cover&&sixth.includes(state.phase)?'第六幕':!cover&&fifth.includes(state.phase)?'第五幕':!cover&&fourth.includes(state.phase)?'第四幕':!cover&&third.includes(state.phase)?'第三幕':!cover&&['gather','pledge','founded','finished'].includes(state.phase)?'第二幕':'第一幕';$('modeBar').hidden=mode!=='replay';
 if(cover){$('content').innerHTML=`<section class="cover"><div class="eyebrow">七幕內容增補版</div><h1>從學醫<span>到救國</span></h1><p>一張課表、一本讀物，<br>一個還沒有答案的問題。</p><div class="cover-actions">${btn(hasProgress?'繼續旅程 →':'走進故事 →','start','','primary')}${hasProgress?btn('從頭重看','replay','','quiet'):''}${btn('先看第二幕 →','replay2','','quiet')}${btn('先看第三幕 →','replay3','','quiet')}${btn('先看第四幕 →','replay4','','quiet')}${btn('先看第五幕 →','replay5','','quiet')}${btn('先看第六幕 →','replay6','','quiet')}${btn('先看第七幕 →','replay7','','quiet')}${btn('先看黃花崗增補 →','reviewNew','','quiet')}</div><p class="small">以孫中山第一身探索。點選場景中的物件，閱讀後再繼續。<br>本作場景、對白及部分文件為教學改編，並非歷史原話或原件。</p></section>`;
 }else if(supplements[state.phase]){$('content').innerHTML=supplementView();
 }else if(state.doc){$('content').innerHTML=reading(state.doc);
 }else if(state.phase==='explore'){$('content').innerHTML=exploration();
 }else if(state.phase==='year'){$('content').innerHTML=`<section class="time-card"><span class="eyebrow">時光往前</span><h1 id="focusText" tabindex="-1">1894年</h1><p>完成學業並曾行醫後</p><p>${T.year.thought}</p>${btn('看看我的上書 →','next','','primary')}</section>`;
 }else if(state.phase==='petition'){$('content').innerHTML=reading('petition');
 }else if(state.phase==='end'){$('content').innerHTML=`<section class="ending bridge"><span class="eyebrow">從學醫到救國</span><h1 id="focusText" tabindex="-1">${esc(T.end.title)}</h1><div class="cover-actions">${btn('繼續 →','next','','quiet')}</div></section>`;
 }else if(state.phase==='pledge'){$('content').innerHTML=`<section class="pledge-view"><article class="pledge-paper"><span class="paper-tag">${T.pledge.tag}</span><h2 id="focusText" tabindex="-1">興中會</h2><p class="oath">驅除韃虜，恢復中國，<br>創立合眾政府。</p></article><div class="pledge-thought"><p>${T.pledge.thought}</p>${btn('繼續 →','next','','quiet')}</div></section>`;
 }else if(state.phase==='founded'){$('content').innerHTML=`<div class="table-document"><span>興中會</span>${btn('再看誓詞','reviewPledge','','quiet')}</div><section class="caption-panel foundation"><div class="speaker">1894年11月24日 · 檀香山</div><p class="historical">孫中山成立興中會。<br>中國近代第一個以推翻滿清為目標的革命團體。</p><p id="focusText" tabindex="-1">${T.founded.text}</p><div class="caption-actions">${btn('繼續 →','next','','quiet')}</div></section>`;
 }else if(state.phase==='finished'){$('content').innerHTML=`<section class="ending bridge"><span class="eyebrow">第二幕 · 成立興中會</span><h1 id="focusText" tabindex="-1">${T.finished.title}</h1><div class="cover-actions">${btn('繼續旅程 →','next','','quiet')}</div></section>`;
 }else if(seventh.includes(state.phase)){$('content').innerHTML=seventhView();
 }else if(sixth.includes(state.phase)){$('content').innerHTML=sixthView();
 }else if(fifth.includes(state.phase)){$('content').innerHTML=fifthView();
 }else if(fourth.includes(state.phase)){$('content').innerHTML=fourthView();
 }else if(third.includes(state.phase)){$('content').innerHTML=thirdView();
 }else{$('content').innerHTML=caption(current())}
 if(!cover){const view=window.ImmersiveView(state,T,btn,esc);if(view!==null)$('content').innerHTML=view;
 if(state.phase==='explore'&&!state.doc&&state.xp.feedback)$('content').insertAdjacentHTML('beforeend',`<div class="discovery-feedback" role="status">${esc(state.xp.feedback)}</div>`);
 if(['railReaction','railUpdate','railMap'].includes(state.phase)&&!state.xp.peek)$('content').insertAdjacentHTML('beforeend',`<nav class="evidence-tray" aria-label="留在桌上的消息">${btn('報紙','peekEvidence','news','quiet')}${btn('川中來信','peekEvidence','letter','quiet')}${state.phase!=='railReaction'?btn('調兵短箋','peekEvidence','troops','quiet'):''}</nav>`);
 }
 $('app').classList.toggle('immersive-view',!cover);$('app').classList.toggle('has-evidence',!!state.xp.peek||!!$('content').querySelector('.evidence-modal'));
 $('app').classList.toggle('listeners-open',!cover&&state.phase==='doubt');
 $('app').dataset.listener=state.xp.listener||'';
 $('app').dataset.trace=state.phase==='cell'?state.inspected.join('-'):'';
 $('progressText').textContent=cover?'第一幕 · 從學醫到救國':`${mode==='replay'?'重看':'主線'} · ${supplements[state.phase]?T[state.phase].aside:({intro:'下課後',explore:'課表與讀物',teacher:'與康德黎交談',year:'1894年',petition:'一封上書',waiting:'等候回音',resolve:'走向革命',end:'第一幕完成',gather:'檀香山聚會',pledge:'興中會誓詞',founded:'成立興中會',finished:'第二幕完成',exile:'流亡海外',captured:'被囚使館',cell:'尋找傳訊機會',message:'寫下求救訊息',attempt:'等候回音',cole:'遇見柯爾',appeal:'爭取協助',trust:'託付訊息',delivered:'希望傳到外面',unlock:'房門打開',rescue:'獲釋',finale:'第三幕完成',tokyo:'東京聚會',letters:'各方來信',union:'商議聯合',alliance:'同盟會成立',drafts:'三民主義稿頁',common:'共同方向',published:'第四幕完成',overseas:'南洋聚會',fundLetter:'同志來信',speech:'向華僑演講',doubt:'回應疑慮',answer:'我的回應',fundQuestion:'說明經費',uses:'經費用途',family:'量力支持',support:'海外支持',report:'寫信告知同志',fundEnd:'第五幕完成',railIntro:'國內消息',railNews:'鐵路國有',railLetter:'保路民怨',railReaction:'川中局勢',railUpdate:'鎮壓與調兵',railMap:'湖北與四川',railChoice:'判斷機會',railResult:'我的思考',railEnd:'第六幕完成',wuchangIntro:'美國讀報',wuchangNews:'武昌起義',responseIntro:'各省消息',provinces:'各省響應',provinceTalk:'建立中央政府',voyage:'回國航程',inauguration:'南京就職',republic:'民國成立',abdicationIntro:'二月的新消息',abdication:'清帝退位',reflection:'回望革命',journeyEnd:'旅程完成'})[state.phase]}`;
 $('homeButton').textContent=mode==='replay'?'結束重看，回到封面':'回到封面';
 $('app').classList.toggle('act1-ui',inAct1());$('app').classList.toggle('act1-modal',inAct1()&&!!(state.doc||state.phase==='petition'));
 if(inAct1()&&['year','end'].includes(state.phase)){$('content').querySelectorAll('[data-action="next"]').forEach(b=>{b.outerHTML='<div class="tap-cue">點一下畫面，繼續故事</div>'})}
 if(!cover&&state.phase==='teacher'){
 const panel=$('content').querySelector('.caption-panel');
 if(panel){
 panel.classList.add('cinema-dialogue');
 panel.classList.toggle('inner-voice',state.index===3);
 const heading=panel.querySelector('.teacher-heading');if(heading)heading.remove();
 const speaker=panel.querySelector('.speaker');if(speaker)speaker.textContent=state.index===3?'心念':state.index===0||state.index===1||state.index===2?'康德黎':'';
 const context=document.createElement('div');context.className='cinema-context';context.textContent='詢問老師';panel.prepend(context);
 const action=panel.querySelector('[data-action="next"]');if(action)action.outerHTML='<div class="tap-cue"><span aria-hidden="true">◇</span> 點一下畫面，繼續</div>';
 }
 }
 if(!cover){ObjectPresentation.decorate(state,T,btn,esc);CinemaDialogue.decorate(state);}
 DeviceLayout.prepare(state);positionHotspots();warn();
 if(focus){const el=$('focusText');if(el)el.focus({preventScroll:true});if(mobile)window.scrollTo({top:0,behavior:'instant'})}
}
function positionHotspots(){if(cover||state.phase!=='explore'||state.doc)return;const r=$('composition').getBoundingClientRect(),c=$('content').getBoundingClientRect();document.querySelectorAll('.hotspot').forEach(b=>{b.style.left=`${r.left-c.left+r.width*Number(b.dataset.x)/100}px`;b.style.top=`${r.top-c.top+r.height*Number(b.dataset.y)/100}px`})}
function replay(chapter=1){mode='replay';state=M.fresh(chapter);cover=false;render()}
function returnMain(){mode='main';state=main;cover=!hasProgress;render()}
function dispatch(action,value){
 if(action==='dialoguePreview'){location.search='?dialogue='+encodeURIComponent(value);return}
 if(action==='objectPreview'){location.search='?object='+encodeURIComponent(value);return}
 if(action==='openSupport'){document.getElementById('artifact').innerHTML=PhysicalDocuments.support();document.getElementById('artifact').showModal();return}
 if(action==='openRoster'){document.getElementById('artifact').innerHTML=PhysicalDocuments.roster();document.getElementById('artifact').showModal();return}

 if(action==='start'){cover=false;state=main;persist();render();return}
 if(action==='home'){if(mode==='replay'){mode='main';state=main}cover=true;render();return}
 if(action==='reviewNew'){mode='replay';state={...M.fresh(5),phase:'huanghuagang',seen:['huanghuagang']};cover=false;render();return}if(action==='replay7'){replay(7);return}if(action==='replay6'){replay(6);return}if(action==='replay5'){replay(5);return}if(action==='replay4'){replay(4);return}if(action==='replay3'){replay(3);return}if(action==='replay2'){replay(2);return}if(action==='replay'){replay();return}if(action==='return'){returnMain();return}
 if(cover)return;
 const old=state;state=M.act(state,{type:action,value});if(JSON.stringify(old)===JSON.stringify(state))return;
 sound(action==='teacher'?'step':'paper');persist();render();
 if(action==='close'){const target=document.querySelector(`[data-action="open"][data-value="${['rights','power'].includes(old.doc)?'book':old.doc}"]`);target?.focus({preventScroll:true})}
}
$('content').addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(!b||e.detail>1)return;const now=performance.now();if(now-lastClick<330)return;lastClick=now;dispatch(b.dataset.action,b.dataset.value)});
// Background / text taps advance only the first act; explicit choices keep their own action.
$('app').addEventListener('click',e=>{
 if(!inAct1()||e.detail>1||e.target.closest('button,input,a,dialog,.hud,#modeBar,#saveWarning'))return;
 if(document.querySelector('dialog[open]'))return;
 const now=performance.now();if(now-lastClick<330)return;
 if(state.doc){if(state.doc==='book'&&e.target.closest('.reader'))return;lastClick=now;dispatch('close');return}
 if(state.phase==='petition'){if(e.target.closest('.reader'))return;lastClick=now;dispatch('submit');return}
 if(['intro','teacher','year','waiting','resolve','end'].includes(state.phase)){lastClick=now;dispatch('next')}
});
$('app').addEventListener('click',e=>{
 if(cover||inAct1()||e.detail>1||e.target.closest('button,input,a,dialog,.hud,#modeBar,#saveWarning,.evidence-tray,.work-record'))return;
 if(document.querySelector('dialog[open]'))return;
 const targets=[...$('content').querySelectorAll('.caption-panel .caption-actions [data-action="next"],.encounter-actions>[data-action="next"]')];
 if(targets.length!==1)return;
 const now=performance.now();if(now-lastClick<330)return;lastClick=now;dispatch('next');
});
document.addEventListener('keydown',e=>{
 if(!inAct1()||document.querySelector('dialog[open]')||e.target.closest('button,input'))return;
 if(e.key==='Escape'&&state.doc){e.preventDefault();dispatch('close')}
 else if([' ','Enter'].includes(e.key)&&!state.doc&&['intro','teacher','year','waiting','resolve','end'].includes(state.phase)){e.preventDefault();dispatch('next')}
});
$('menuButton').addEventListener('click',()=>{$('menu').showModal()});
$('resumeButton').addEventListener('click',()=>{$('menu').close()});
$('homeButton').addEventListener('click',()=>{$('menu').close();dispatch('home')});
$('replayButton').addEventListener('click',()=>{$('menu').close();replay()});
$('replaySevenButton').addEventListener('click',()=>{$('menu').close();replay(7)});
$('replaySixButton').addEventListener('click',()=>{$('menu').close();replay(6)});
$('replayFiveButton').addEventListener('click',()=>{$('menu').close();replay(5)});
$('replayFourButton').addEventListener('click',()=>{$('menu').close();replay(4)});
$('replayThreeButton').addEventListener('click',()=>{$('menu').close();replay(3)});
$('replayTwoButton').addEventListener('click',()=>{$('menu').close();replay(2)});
$('exitReplay').addEventListener('click',returnMain);
$('historyButton').addEventListener('click',()=>{const keys=state.seen.filter(k=>(T[k]||k==='answer'||k==='railResult')&&k!=='explore');$('historyBody').replaceChildren();for(const key of keys){const d=key==='railResult'?T[state.judgment]:key==='answer'?T[state.response]:T[key],a=document.createElement('article'),h=document.createElement('h3');h.textContent=d.title||d.speaker||'記錄';a.append(h);const lines=[d.aside,d.text,d.thought,d.rows?.map(r=>r.join('：')).join('；')].filter(Boolean);for(const l of lines){const p=document.createElement('p');p.textContent=l;a.append(p)}$('historyBody').append(a)}for(const line of state.xp.log){const a=document.createElement('article'),p=document.createElement('p');p.textContent=line;a.append(p);$('historyBody').append(a)}$('menu').close();$('history').showModal()});
for(const b of document.querySelectorAll('[data-close]'))b.addEventListener('click',()=>{$(b.dataset.close).close()});
for(const [id,key]of[['sound','sound'],['motion','reduce']])$(id).addEventListener('change',()=>{settings[key]=$(id).checked;applySettings();try{db.setItem('sun-revolution.act1.prototype.v1.settings',JSON.stringify(settings))}catch{}if(key==='sound'&&settings.sound)sound('paper')});
$('scene').addEventListener('error',()=>{$('assetError').hidden=false});$('scene').addEventListener('load',()=>{$('assetError').hidden=true;positionHotspots()});
window.addEventListener('resize',()=>{DeviceLayout.prepare(state);positionHotspots()});new ResizeObserver(positionHotspots).observe($('world'));
if(new URLSearchParams(location.search).get('preview')==='teacher'){
 mode='replay';state=M.fresh(1);state.phase='teacher';state.index=0;state.read=['timetable','notes','rights'];state.topics=['rights'];state.seen.push('teacher0');cover=false;
}
const artifact=document.getElementById('artifact');
artifact.addEventListener('click',e=>{if(e.target===artifact||e.target.closest('[data-artifact-close]'))artifact.close()});
const sample=new URLSearchParams(location.search).get('preview');
if(sample==='petition'){mode='replay';state=M.fresh(1);Object.assign(state,{phase:'petition',read:['timetable','notes','rights'],topics:['rights'],seen:['petition']});cover=false}
if(sample==='contacts'){mode='replay';state=M.fresh(2);state.phase='founded';state.xp.group=['contacts','funds','action'];state.seen=['founded'];cover=false}
const objectSample=new URLSearchParams(location.search).get('object');
if(ObjectPresentation.samples[objectSample]){mode='replay';state=ObjectPresentation.sampleState(objectSample,M);cover=false}
const gallery=document.createElement('div');gallery.className='object-gallery';gallery.innerHTML='<h3>實物文件試看</h3>'+Object.entries(ObjectPresentation.samples).map(([key,data])=>btn(data.label,'objectPreview',key,'quiet')).join('');
$('menu').append(gallery);gallery.addEventListener('click',e=>{const b=e.target.closest('[data-action="objectPreview"]');if(b)dispatch('objectPreview',b.dataset.value)});
const dialogueSample=new URLSearchParams(location.search).get('dialogue');
if(CinemaDialogue.samples[dialogueSample]){mode='replay';state=CinemaDialogue.sampleState(dialogueSample,M);cover=false}
const dialogueGallery=document.createElement('div');dialogueGallery.className='object-gallery';dialogueGallery.innerHTML='<h3>電影式對話試看</h3>'+Object.entries(CinemaDialogue.samples).map(([key,data])=>btn(data.label,'dialoguePreview',key,'quiet')).join('');
$('menu').append(dialogueGallery);dialogueGallery.addEventListener('click',e=>{const b=e.target.closest('[data-action="dialoguePreview"]');if(b)dispatch('dialoguePreview',b.dataset.value)});
applySettings();render(false);
})();
