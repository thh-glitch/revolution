(function(root,factory){const api=typeof module==='object'&&module.exports?factory(require('./model.js')):factory(root.ActOne);if(typeof module==='object'&&module.exports)module.exports=api;else root.ActOne=api})(typeof globalThis!=='undefined'?globalThis:this,function(B){
'use strict';
const KEY='sun-revolution.immersive.v10.main',LEGACY=B.KEY;
const freshXP=()=>({question:null,group:[],cole:[],audience:[],listener:null,replies:{},feedback:null,peek:null,office:[],focus:null,tries:[],log:[]});
const fresh=(ch=1)=>({...B.fresh(ch),xp:freshXP()});
function valid(s){if(!B.valid(s)||!s.xp)return false;const x=s.xp;
 if(!['medical','country',null].includes(x.question)||!['hope','money','family',null].includes(x.listener)||!['news','letter','troops',null].includes(x.peek)||!['hubei','sichuan',null].includes(x.focus))return false;
 for(const [k,allowed]of [['group',['contacts','funds','action']],['cole',['identity','fear']],['audience',['hope','money','family']],['office',['provinces','government','north']]])if(!Array.isArray(x[k])||new Set(x[k]).size!==x[k].length||!x[k].every(v=>allowed.includes(v)))return false;
 if(!x.replies||Object.keys(x.replies).some(k=>!['hope','money','family'].includes(k))||Object.values(x.replies).some(v=>!['prepare','ideal','uses','limits','respect','explain'].includes(v)))return false;
 return Array.isArray(x.tries)&&x.tries.length<=60&&x.tries.every(v=>typeof v==='string'&&v.length<60)&&Array.isArray(x.log)&&x.log.length<=140&&x.log.every(v=>typeof v==='string'&&v.length<500)&&(x.feedback===null||typeof x.feedback==='string'&&x.feedback.length<600);
}
const group={contacts:'聯絡者：我認識願意幫忙的人，但不知道該把消息送給誰。',funds:'支持者：我願意提供經費。有人統籌用途，大家才知道怎樣配合。',action:'行動者：我願意聯絡國內同志。若各做各的，消息與行動便難以配合。'};
const office={provinces:'各省來電：各地需要與中央政府聯絡。宣布獨立之後，還有協調與統一的工作。',government:'待辦文件：政府人事、經費與日常行政，都需要有人處理。宣誓並不會讓政府自動運作。',north:'急件：南北仍在對峙，袁世凱掌握北洋軍。共和要站穩，眼前還有軍事力量與政治交涉。'};
function act(state,a){if(!valid(state))throw Error('Invalid immersive state');let s=JSON.parse(JSON.stringify(state)),x=s.xp;
 const add=(k,v)=>{if(!x[k].includes(v))x[k].push(v)};const say=t=>{x.feedback=t;x.log.push(t);if(x.log.length>140)x.log.shift()};
 if(a.type==='returnSheet'&&s.phase==='drafts'&&s.sheet){s.sheet=null;return s}
 if(a.type==='next'&&s.phase==='teacher'&&s.index===1){s.index=3;if(!s.seen.includes('teacher3'))s.seen.push('teacher3');x.feedback=null;return s}
 if(a.type==='teacher'&&s.phase==='explore'&&!s.read.includes('notes')){say('我看向講義旁的家鄉消息。還未讀過的來信，也許正是我想向老師問的事。');return s}
 if(a.type==='question'&&s.phase==='teacher'&&s.index===0&&['medical','country'].includes(a.value)){x.question=a.value;s.index=1;s.seen.push('teacher1');say(a.value==='medical'?'我：醫生能幫到多少人？若困難不只在身體上，我還能做甚麼？':'我：人的困難都能用醫術解決嗎？國家怎樣治理，又與生活有何關係？');return s}
 if(a.type==='group'&&s.phase==='gather'&&Object.hasOwn(group,a.value)){add('group',a.value);if(x.group.length===3)s.index=1;say(group[a.value]);return s}
 if(a.type==='coleConcern'&&s.phase==='appeal'&&['identity','fear'].includes(a.value)){add('cole',a.value);say(a.value==='identity'?'我：我是孫文。康德黎是我的老師，能證明我的身分。\n柯爾：有一位我能找到的人……我知道你要我通知誰了。':'我：我明白你怕惹麻煩。請只把消息交給康德黎，讓他設法求援。\n柯爾往門外看了一眼：我聽明白了。這件事，我得再想一想。');return s}
 if(a.type==='applyPrinciple'&&s.phase==='drafts'&&s.sheet){const expected=['nation','rights4','livelihood'].find(k=>!s.principles.includes(k));x.tries.push(expected+':'+s.sheet);if(x.tries.length>60)x.tries.shift();
  if(s.sheet!==expected){s.sheet=null;say(expected==='rights4'?'同志：我明白你剛才的主張。但若換一位皇帝，誰來限制他的權力？':'同志：這也是革命的主張。我眼前問的問題，還需要另一頁來說明。');return s}
  const chosen=s.sheet;const n=B.act(s,{type:'putSheet'});say(chosen==='nation'?'同志把「民族」稿頁攤開：先說清要推翻的統治，我們才有共同起點。':chosen==='rights4'?'同志把「民權」稿頁攤開：原來不是換一位皇帝，而是改變誰能參與政治。':'同志把「民生」稿頁攤開：政府改了名字，還要處理土地、生計與貧富問題。');n.xp=x;return n;
 }
 if(a.type==='listener'&&s.phase==='doubt'&&['hope','money','family'].includes(a.value)){x.listener=a.value;say({hope:'商人：革命失敗過多次，再支持下去，真的有希望嗎？',money:'工友：我想先知道，捐出的錢會用在哪裏。',family:'長者：我還要養家，拿不出很多。'}[a.value]);return s}
 if(a.type==='respond'&&s.phase==='doubt'&&x.listener){const allowed={hope:['prepare','ideal'],money:['uses','explain'],family:['limits','respect']}[x.listener];if(!allowed.includes(a.value))return s;add('audience',x.listener);x.replies[x.listener]=a.value;
  const r={prepare:'我：不能保證下一次成功，但同志正在聯絡各地、檢討失敗。\n商人沉默片刻：我會再想想，也願意聽你把準備說清楚。',ideal:'我：推翻專制、建立共和的目標仍值得努力。\n商人：我還有疑問，但願意留下來了解這個方向。',uses:'我展開用途：宣傳報刊、交通通信與組織、起義所需物資和軍械。\n工友逐項看過：這樣我便知道支持會用在甚麼工作。',explain:'我：每筆經費都要用在革命工作。讓我把宣傳、聯絡與起義準備的用途逐項說明。\n工友：說明了用途，我才放心介紹朋友來了解。',limits:'我：請按能力支持，先照顧家計。願意向別人介紹主張，也能幫忙。\n長者放鬆了神情：那我可以把宣傳品帶回去，跟熟人談談。',respect:'我：捐助和介紹革命主張，都是支持。不方便捐款，仍可以留下來問。\n長者沒有離開：我想再聽一些，也許能介紹別人認識你。'};say(r[a.value]);return s}
 if(a.type==='endAudience'&&s.phase==='doubt'&&x.audience.length===3){s.phase='support';s.response=x.replies.hope==='ideal'?'ideal':'prepare';say('有人留下來詢問，有人介紹朋友，有人量力捐助，也有人未捐離開。支持有不同方式，我不能把它們當成數字。');return s}
 if(a.type==='peekEvidence'&&['railReaction','railUpdate','railMap'].includes(s.phase)&&['news','letter','troops'].includes(a.value)){if(a.value==='troops'&&s.phase==='railReaction')return s;x.peek=a.value;return s}
 if(a.type==='closeEvidence'){x.peek=null;return s}
 if(a.type==='watch'&&s.phase==='railChoice'&&['hubei','sichuan'].includes(a.value)){x.focus=a.value;s.phase='railResult';s.judgment='chance';say(a.value==='hubei'?'我把湖北圈起來：部分新軍調走，防務可能減弱。我要留意當地同志是否有準備，不能把機會當成成功。':'我把四川圈起來：衝突仍在擴大，商民的處境值得留意。旁邊的調兵短箋也提醒我，湖北防務已出現變化。');return s}
 if(a.type==='office'&&s.phase==='republic'&&s.index===1&&Object.hasOwn(office,a.value)){add('office',a.value);say(office[a.value]);return s}
 // Narrative gates make actions matter; there is no history-changing failure ending.
 if(a.type==='next'&&s.phase==='teacher'&&s.index===0&&!x.question)return s;
 if(a.type==='propose'&&s.phase==='gather'&&x.group.length<3)return s;
 if(a.type==='next'&&s.phase==='appeal'&&x.cole.length<2)return s;
 if(a.type==='next'&&s.phase==='republic'&&s.index===1&&(!x.office.includes('north')||x.office.length<2))return s;
 if(a.type==='putSheet'&&s.phase==='drafts')return s;
 if(a.type==='reply'&&s.phase==='doubt')return s;
 if(a.type==='judge'&&s.phase==='railChoice')return s;
 const n=B.act(s,a);n.xp=x;
 if(n.phase!==s.phase||n.index!==s.index){n.xp.feedback=null;n.xp.peek=null}
 if(a.type==='inspect'&&s.phase==='cell')say(a.value==='door'?'我敲了敲門。腳步靠近，停住，卻沒有開鎖。門外有人。':'街上的人照常走過，沒有人抬頭。我得把自己的名字與位置送到外面。');
 if(a.type==='chooseMessage'&&s.phase==='message')say('紙條已投出。街上的腳步沒有停下，窗前只剩等待。');
 if(a.type==='askCole'&&s.phase==='cole')say('柯爾先看向手中的工作，沒有立刻答應。我得讓他知道我是誰，也得聽懂他的顧慮。');
 if(a.type==='next'&&s.phase==='appeal'&&x.cole.length===2){n.phase='trust';n.index=0}
 n.xp=x;return n;
}
function load(db){try{let raw=db.getItem(KEY);if(raw!==null){const s=JSON.parse(raw);return valid(s)?{state:s,error:false}:{state:null,error:true}}raw=db.getItem(LEGACY);if(raw===null)return{state:null,error:false};const old=JSON.parse(raw),s={...old,xp:freshXP()};return valid(s)?{state:s,error:false,imported:true}:{state:null,error:true}}catch{return{state:null,error:true}}}
function save(db,s,mode){if(mode==='replay')return{ok:true,written:false};if(!valid(s))return{ok:false,written:false};try{db.setItem(KEY,JSON.stringify(s));return{ok:true,written:true}}catch{return{ok:false,written:false}}}
return{KEY,fresh,valid,act,load,save,freshXP};
});
