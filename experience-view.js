// Teaching dialogue and reactions are authored reconstructions, not historical quotations.
window.ImmersiveView=function(s,T,btn,esc){
 const x=s.xp;
 const choice=(text,type,v)=>btn(esc(text),type,v,'immersive-choice');
 const panel=(who,text,actions='',aside='')=>`<section class="caption-panel encounter"><div class="speaker">${who}</div>${aside?`<p class="aside">${esc(aside)}</p>`:''}<p id="focusText" tabindex="-1">${esc(text)}</p>${actions?`<div class="encounter-actions">${actions}</div>`:''}</section>`;
 const feedback=()=>x.feedback?`<div class="scene-reply" role="status">${esc(x.feedback).replaceAll('\n','<br>')}</div>`:'';
 const label=(k,text,arr,type)=>choice((arr.includes(k)?'✓ ':'')+text,type,k);
 if(x.peek){const data={news:T.railNews,letter:T.railLetter,troops:{title:'調兵短箋',text:'清廷調湖北部分新軍入川，協助鎮壓。湖北仍有守軍。'}}[x.peek];return `<section class="evidence-modal"><article><span class="paper-tag">放在桌上的消息 · 回看</span><h2 id="focusText" tabindex="-1">${data.title}</h2><p>${data.text}</p>${btn('放回原處','closeEvidence','','primary')}</article></section>`}
 if(s.phase==='explore'&&!s.doc)return null;
 if(s.phase==='teacher'){
  if(s.index===0)return panel('康德黎 · 詢問老師','你把醫學講義與家鄉來信放在一起。最想問的是甚麼？',choice('醫生能幫到多少人？','question','medical')+choice('人的困難，都能用醫術解決嗎？','question','country'));
  if(s.index===1)return panel('康德黎',x.question==='medical'?'診治一個病人，能減輕一個人的痛苦。若你想幫到更多人，便繼續了解他們的生活，也想想自己能做甚麼。':'有些困難與疾病有關，也有些與人們生活的環境有關。先看清問題，再想怎樣幫忙。',btn('繼續 →','next','','quiet'),x.question==='medical'?'我問：醫生能幫到多少人？':'我問：人的困難，都能用醫術解決嗎？');
 }
 if(s.phase==='gather')return `<div class="scene-people">${label('contacts','聽聽聯絡者',x.group,'group')}${label('funds','聽聽支持者',x.group,'group')}${label('action','聽聽行動者',x.group,'group')}</div>`+panel('我心想',x.group.length===3?'有人、經費、國內聯絡……都有意願，卻各自分散。要怎樣一起工作？':'各位願意幫忙，但彼此還未配合。我先聽聽大家遇到的困難。',feedback()+(x.group.length===3?btn('提出成立興中會 →','propose','','primary'):''));
 if(s.phase==='founded')return `<div class="ledger-on-table">${btn('<span class="ledger-label">同志聯絡簿</span><span class="ledger-glimpse">尋同志　籌經費　聯絡國內</span><span class="ledger-prompt">拿起翻看</span>','openRoster','','ledger-object')}${btn('回看誓詞','reviewPledge','','ledger-pledge')}</div>`+panel('我心想',T.founded.text,btn('繼續 →','next','','quiet'),'1894年11月24日 · 檀香山｜興中會成立。中國近代第一個以推翻滿清為目標的革命團體。');
 if(s.phase==='cell'){
  const traces=s.inspected.length?`<div class="action-traces">${s.inspected.includes('door')?'<span>門外有人 · 尚未開鎖</span>':''}${s.inspected.includes('window')?'<span>窗外行人 · 未知我的處境</span>':''}</div>`:'';
  return traces+`<div class="room-spots">${btn('敲門試試','inspect','door','room-door')}${btn('走近窗邊','inspect','window','room-window')}</div>`+panel('我心想',x.feedback||T.cell.text,s.inspected.length?btn('寫下求救訊息 →','write','','primary'):'');
 }
 if(s.phase==='attempt')return `<div class="action-traces"><span>紙條已投出 · 未得回音</span></div>`+panel('我心想',T.attempt.text,btn('再尋找機會 →','next','','primary'),s.message==='clear'?'我寫下姓名、位置與康德黎。':'我補上姓名、位置與康德黎，才把紙條投出。');
 if(s.phase==='appeal')return panel('柯爾','這件事……會給我惹麻煩。',`<div class="concern-replies">${label('identity','告訴他誰能證明我的身分',x.cole,'coleConcern')}${label('fear','回應他怕惹麻煩的顧慮',x.cole,'coleConcern')}</div>`+feedback()+(x.cole.length===2?btn('把談話繼續下去 →','next','','primary'):''),'他偶爾望向門外，還沒有答應。');
 if(s.phase==='trust')return panel('我心想',T.trust.text,`<div class="action-traces inline"><span>已說明身分</span><span>已回應風險</span></div>`+btn('交出求救訊息 →','give','','primary'),'其後幾天，仍有交談與等待。');
 if(s.phase==='drafts'){
  const needed=['nation','rights4','livelihood'].find(k=>!s.principles.includes(k));
  const q={nation:'大家都想救國，但我們究竟要推翻甚麼統治？',rights4:'推翻清廷後，再找一個好皇帝，不也可以嗎？',livelihood:'政府改了名字，百姓的生活就會好起來嗎？'}[needed];
  if(s.sheet){const d=T[s.sheet];return `<section class="evidence-modal"><article><span class="paper-tag">我手中的稿頁 · 教學合成</span><h2 id="focusText" tabindex="-1">${d.title}</h2><p>${d.text}</p><p>${d.thought}</p>${d.note?`<p class="principle-note">${d.note}</p>`:''}<div class="question-return">同志剛才問：「${q}」</div>${btn('用這個主張回應 →','applyPrinciple','','primary')}</article></section>`}
  return `<div class="manuscripts">${['nation','rights4','livelihood'].map(k=>`<button class="manuscript ${s.principles.includes(k)?'read-sheet':''}" data-action="principle" data-value="${k}"><span class="sheet-heading">${T[k].title}</span><span>${s.principles.includes(k)?'已攤開 · 可回看':'拿起稿頁'}</span></button>`).join('')}</div>`+panel('同志',q,feedback(),'同年11月 · 準備《民報》發刊詞');
 }
 if(s.phase==='doubt'){
  const names={hope:'商人 · 成功的疑慮',money:'工友 · 經費用途',family:'長者 · 家計負擔'};
  const options={hope:[['不能保證成功，說明正在加強準備','prepare'],['說明共和理想為何仍值得努力','ideal']],money:[['把宣傳、聯絡與起義用途展開','uses'],['逐項說明，再請他介紹有興趣的人','explain']],family:[['先照顧家計，也可以介紹革命主張','limits'],['尊重不捐款，邀請他繼續了解','respect']]};
  return `<div class="scene-people audience">${['money','hope','family'].map(k=>label(k,names[k],x.audience,'listener')).join('')}</div>`+panel('我心想',x.audience.length===3?'大家的回應，我都記下了。':x.listener&&x.audience.includes(x.listener)?'我記下他的回應，還有人想說話。':x.listener?'我聽見他的顧慮。該怎樣說，才能讓他明白？':'演講之後，有人欲言又止。先聽聽他們各自擔心甚麼。',feedback()+(x.listener&&!x.audience.includes(x.listener)?`<div class="concern-replies">${options[x.listener].map(([t,v])=>choice(t,'respond',v)).join('')}</div>`:'')+(x.audience.length===3?btn('收好大家的支持 →','endAudience','','primary'):''));
 }
 if(s.phase==='support')return `<div class="support-on-table">${btn('<span>支持筆記</span><small>拿起翻看</small>','openSupport','','support-object')}</div>`+panel('我心想',T.support.text,btn('寫信告知同志 →','reportFunds','','primary'),'有人捐助，也有人未捐離開。');
 if(s.phase==='huanghuagang')return `<section class="evidence-modal"><article><span class="paper-tag">1911年4月27日 · 廣州起義消息</span><h2 id="focusText" tabindex="-1">黃花崗之役</h2><p>${T.huanghuagang.text}</p><div class="question-return">我翻回早前的經費筆記：宣傳、聯絡、起義準備。如今，來信上又寫着同志犧牲的消息。</div>${btn('把信放在筆記旁 →','next','','primary')}</article></section>`;
 if(s.phase==='railChoice')return panel('我心想','消息還在陸續到來。接下來，我想特別留意哪一處？',choice('留意湖北同志與防務的變化','watch','hubei')+choice('留意四川保路衝突如何發展','watch','sichuan'));
 if(s.phase==='railResult')return panel('我心想',x.feedback||T[s.judgment].text,btn('收好消息 →','next','','quiet'));
 if(s.phase==='republic'&&s.index===1)return `<div class="desk-tasks">${label('provinces','各省來電',x.office,'office')}${label('government','政府待辦文件',x.office,'office')}${label('north','南北局勢急件',x.office,'office')}</div>`+panel('我心想','宣誓結束，工作才剛開始。桌上幾份文件等着我處理。',feedback()+(x.office.includes('north')&&x.office.length>=2?btn('處理眼前的南北交涉 →','next','','primary'):''),'1912年1月 · 南京');
 return null;
};
