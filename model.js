(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ActOne=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const KEY='sun-revolution.acts1234567.ui.v9.main';
const LEGACY='sun-revolution.acts1234567.content.v8.main';
const supplements=['hongkong','huizhou','huanghuagang','huangReflection','reform','negotiation'];
const seventh=['wuchangIntro','wuchangNews','responseIntro','provinces','provinceTalk','voyage','inauguration','republic','abdicationIntro','abdication','reflection','journeyEnd'];
const sixth=['railIntro','railNews','railLetter','railReaction','railUpdate','railMap','railChoice','railResult','railEnd'];
const fifth=['overseas','fundLetter','speech','doubt','answer','fundQuestion','uses','family','support','report','fundEnd'];
const fourth=['tokyo','letters','union','alliance','drafts','common','published'];
const principles=['nation','rights4','livelihood'];
const third=['exile','captured','cell','message','attempt','cole','appeal','trust','delivered','unlock','rescue','finale'];
const second=['gather','pledge','founded','finished'];
const phases=['intro','explore','teacher','year','petition','waiting','resolve','end',...second,...third,...fourth,...fifth,...sixth,...seventh,...supplements];
const docs=['timetable','notes','book','rights','power'];
const fresh=(chapter=1)=>({version:8,mapRead:[],region:null,judgment:null,response:null,principles:[],sheet:null,phase:chapter===7?'wuchangIntro':chapter===6?'railIntro':chapter===5?'overseas':chapter===4?'tokyo':chapter===3?'exile':chapter===2?'gather':'intro',index:0,doc:null,read:[],topics:[],act1Complete:chapter>1,complete:false,inspected:[],look:null,message:null,seen:[chapter===7?'wuchangIntro':chapter===6?'railIntro':chapter===5?'overseas':chapter===4?'tokyo':chapter===3?'exile':chapter===2?'gather0':'intro0']});
function valid(s){
 if(!s||s.version!==8||!phases.includes(s.phase)||!Number.isInteger(s.index)||s.index<0||s.index>(['intro','gather','union','common','family','railReaction','provinceTalk','republic'].includes(s.phase)?1:s.phase==='teacher'?3:s.phase==='appeal'?2:s.phase==='rescue'?2:0))return false;
 if(s.doc!==null&&(!docs.includes(s.doc)||s.phase!=='explore'))return false;
 if(!Array.isArray(s.read)||!s.read.every(x=>docs.includes(x))||new Set(s.read).size!==s.read.length)return false;
 if(!Array.isArray(s.topics)||!s.topics.every(x=>['rights','power'].includes(x))||new Set(s.topics).size!==s.topics.length)return false;
 if(!Array.isArray(s.seen)||s.seen.length>150||!s.seen.every(x=>/^(intro[01]|teacher[0-3]|explore|year|petition|waiting|resolve|end|timetable|notes|book|rights|power|gather[01]|pledge|founded|finished|exile|captured|cell|message|attempt|cole|appeal[0-2]|trust|delivered|unlock|rescue[0-2]|finale|tokyo|letters|union[01]|alliance|drafts|nation|rights4|livelihood|common[01]|published|overseas|fundLetter|speech|doubt|answer|fundQuestion|uses|family[01]|support|report|fundEnd|railIntro|railNews|railLetter|railReaction[01]|railUpdate|railMap|railChoice|railResult|railEnd|wuchangIntro|wuchangNews|responseIntro|provinces|provinceTalk[01]|voyage|inauguration|republic[01]|abdicationIntro|abdication|reflection|journeyEnd|hongkong|huizhou|huanghuagang|huangReflection|reform|negotiation)$/.test(x)))return false;
 if(s.complete!==(s.phase==='journeyEnd')||typeof s.act1Complete!=='boolean')return false;
 if((s.phase==='end'||second.includes(s.phase)||third.includes(s.phase)||fourth.includes(s.phase)||fifth.includes(s.phase)||sixth.includes(s.phase)||seventh.includes(s.phase))&&!s.act1Complete)return false;
 if((s.topics.length||s.doc&&s.doc!=='timetable'||['teacher','year','petition','waiting','resolve','end'].includes(s.phase))&&!s.read.includes('timetable'))return false;
 if(['teacher','year','petition','waiting','resolve','end'].includes(s.phase)&&!s.topics.length)return false;
 if(!Array.isArray(s.inspected)||!s.inspected.every(x=>['door','window'].includes(x))||new Set(s.inspected).size!==s.inspected.length)return false;
 if(s.look!==null&&(!['door','window'].includes(s.look)||s.phase!=='cell'))return false;
 if(s.message!==null&&!['clear','vague'].includes(s.message))return false;
 if(['message','attempt','cole','appeal','trust','delivered','unlock','rescue','finale'].includes(s.phase)&&!s.inspected.length)return false;
 if(['attempt','cole','appeal','trust','delivered','unlock','rescue','finale'].includes(s.phase)&&!s.message)return false;
 if(!Array.isArray(s.principles)||!s.principles.every(x=>principles.includes(x))||new Set(s.principles).size!==s.principles.length)return false;
 if(s.sheet!==null&&(!principles.includes(s.sheet)||s.phase!=='drafts'))return false;
 if(['common','published'].includes(s.phase)&&s.principles.length!==3)return false;
 if(s.response!==null&&!['prepare','ideal'].includes(s.response))return false;
 if(['answer','fundQuestion','uses','family','support','report','fundEnd'].includes(s.phase)&&!s.response)return false;
 if(!Array.isArray(s.mapRead)||!s.mapRead.every(x=>['hubei','sichuan'].includes(x))||new Set(s.mapRead).size!==s.mapRead.length)return false;
 if(s.region!==null&&(!['hubei','sichuan'].includes(s.region)||s.phase!=='railMap'))return false;
 if(s.judgment!==null&&!['chance','certain'].includes(s.judgment))return false;
 if(['railChoice','railResult','railEnd'].includes(s.phase)&&!s.mapRead.includes('hubei'))return false;
 if(['railResult','railEnd'].includes(s.phase)&&!s.judgment)return false;
 return true;
}
function act(state,a){
 if(!valid(state))throw Error('Invalid state');
 let s=JSON.parse(JSON.stringify(state));
 const add=(k,v)=>{if(!s[k].includes(v))s[k].push(v)};
 if(a.type==='readWuchang'&&s.phase==='wuchangIntro'){s.phase='wuchangNews';
 }else if(a.type==='showProvinces'&&s.phase==='responseIntro'){s.phase='provinces';
 }else if(a.type==='swear'&&s.phase==='inauguration'){s.phase='republic';s.index=0;
 }else if(a.type==='readAbdication'&&s.phase==='abdicationIntro'){s.phase='abdication';
 }else if(a.type==='finishJourney'&&s.phase==='reflection'){s.phase='journeyEnd';s.complete=true;
 }else if(a.type==='railNews'&&s.phase==='railIntro'){s.phase='railNews';
 }else if(a.type==='railLetter'&&s.phase==='railNews'){s.phase='railLetter';
 }else if(a.type==='openMap'&&s.phase==='railUpdate'){s.phase='railMap';
 }else if(a.type==='region'&&s.phase==='railMap'&&['hubei','sichuan'].includes(a.value)){s.region=a.value;add('mapRead',a.value);
 }else if(a.type==='judge'&&s.phase==='railChoice'&&['chance','certain'].includes(a.value)){s.judgment=a.value;s.phase='railResult';
 }else if(a.type==='fundLetter'&&s.phase==='overseas'){s.phase='fundLetter';
 }else if(a.type==='reply'&&s.phase==='doubt'&&['prepare','ideal'].includes(a.value)){s.response=a.value;s.phase='answer';
 }else if(a.type==='showUses'&&s.phase==='fundQuestion'){s.phase='uses';
 }else if(a.type==='reportFunds'&&s.phase==='support'){s.phase='report';
 }else if(a.type==='letters'&&s.phase==='tokyo'){s.phase='letters';
 }else if(a.type==='unite'&&s.phase==='union'&&s.index===1){s.phase='alliance';s.index=0;
 }else if(a.type==='principle'&&s.phase==='drafts'&&principles.includes(a.value)){s.sheet=a.value;
 }else if(a.type==='putSheet'&&s.phase==='drafts'&&s.sheet){add('principles',s.sheet);s.sheet=null;if(s.principles.length===3){s.phase='common';s.index=0}
 }else if(a.type==='publish'&&s.phase==='common'&&s.index===1){s.phase='published';s.index=0;
 }else if(a.type==='inspect'&&s.phase==='cell'&&['door','window'].includes(a.value)){add('inspected',a.value);s.look=a.value;
 }else if(a.type==='backRoom'&&s.phase==='cell'){s.look=null;
 }else if(a.type==='write'&&s.phase==='cell'&&s.inspected.length){s.phase='message';s.look=null;
 }else if(a.type==='chooseMessage'&&s.phase==='message'&&['clear','vague'].includes(a.value)){s.message=a.value;s.phase='attempt';
 }else if(a.type==='askCole'&&s.phase==='cole'){s.phase='appeal';s.index=0;
 }else if(a.type==='give'&&s.phase==='trust'){s.phase='delivered';
 }else if(a.type==='leave'&&s.phase==='unlock'){s.phase='rescue';s.index=0;
 }else if(a.type==='open'&&s.phase==='explore'&&docs.includes(a.value)){
  if(a.value==='timetable'||s.read.includes('timetable'))s.doc=a.value;
 }else if(a.type==='close'&&s.phase==='explore'&&s.doc){add('read',s.doc);if(['rights','power'].includes(s.doc))add('topics',s.doc);s.doc=null;
 }else if(a.type==='teacher'&&s.phase==='explore'&&!s.doc&&s.topics.length){s.phase='teacher';s.index=0;
 }else if(a.type==='submit'&&s.phase==='petition'){s.phase='waiting';
 }else if(a.type==='propose'&&s.phase==='gather'&&s.index===1){s.phase='pledge';s.index=0;
 }else if(a.type==='reviewPledge'&&s.phase==='founded'){s.phase='pledge';
 }else if(a.type==='next'&&!s.doc&&!s.sheet){
  switch(s.phase){case'hongkong':s.phase='exile';break;case'huizhou':s.phase='tokyo';break;case'huanghuagang':s.phase='huangReflection';break;case'huangReflection':s.phase='reform';break;case'reform':s.phase='railIntro';break;case'negotiation':s.phase='abdicationIntro';break;case'railEnd':s.phase='wuchangIntro';break;case'wuchangNews':s.phase='responseIntro';break;case'provinces':s.phase='provinceTalk';s.index=0;break;case'provinceTalk':if(s.index===0)s.index=1;else{s.phase='voyage';s.index=0}break;case'voyage':s.phase='inauguration';break;case'republic':if(s.index===0)s.index=1;else{s.phase='negotiation';s.index=0}break;case'abdication':s.phase='reflection';break;case'fundEnd':s.phase='huanghuagang';break;case'railLetter':s.phase='railReaction';s.index=0;break;case'railReaction':if(s.index===0)s.index=1;else{s.phase='railUpdate';s.index=0}break;case'railMap':if(s.mapRead.includes('hubei')){s.phase='railChoice';s.region=null}break;case'railResult':s.phase='railEnd';break;case'published':s.phase='overseas';break;case'fundLetter':s.phase='speech';break;case'speech':s.phase='doubt';break;case'answer':s.phase='fundQuestion';break;case'uses':s.phase='family';s.index=0;break;case'family':if(s.index===0)s.index=1;else{s.phase='support';s.index=0}break;case'report':s.phase='fundEnd';break;case'finale':s.phase='huizhou';break;case'letters':s.phase='union';s.index=0;break;case'union':if(s.index===0)s.index=1;break;case'alliance':s.phase='drafts';break;case'common':if(s.index===0)s.index=1;break;case'intro':if(s.index===0)s.index=1;else{s.phase='explore';s.index=0}break;
  case'teacher':if(s.index<3)s.index++;else{s.phase='year';s.index=0}break;
  case'year':s.phase='petition';break;case'waiting':s.phase='resolve';break;case'resolve':s.phase='end';s.act1Complete=true;break;case'end':s.phase='gather';s.index=0;break;case'gather':if(s.index===0)s.index=1;break;case'pledge':s.phase='founded';break;case'founded':s.phase='finished';break;case'finished':s.phase='hongkong';break;case'exile':s.phase='captured';break;case'captured':s.phase='cell';break;case'attempt':s.phase='cole';break;case'appeal':if(s.index<2)s.index++;else{s.phase='trust';s.index=0}break;case'delivered':s.phase='unlock';break;case'rescue':if(s.index<2)s.index++;else{s.phase='finale';s.index=0}break;}
 }
 add('seen',s.sheet||s.doc||s.phase+(['intro','teacher','gather','appeal','rescue','union','common','family','railReaction','provinceTalk','republic'].includes(s.phase)?s.index:''));
 return s;
}
function load(db){try{const raw=db.getItem(KEY);if(raw!==null){const state=JSON.parse(raw);return valid(state)?{state,error:false}:{state:null,error:true}}const oldRaw=db.getItem(LEGACY);if(oldRaw===null)return{state:null,error:false};const old=JSON.parse(oldRaw);if(old.version!==8)return{state:null,error:true};const state={...old,version:8};return valid(state)?{state,error:false,imported:true}:{state:null,error:true}}catch{return{state:null,error:true}}}
function save(db,state,mode){if(mode==='replay')return{ok:true,written:false};if(!valid(state))return{ok:false,written:false};try{db.setItem(KEY,JSON.stringify(state));return{ok:true,written:true}}catch{return{ok:false,written:false}}}
return{KEY,fresh,act,valid,load,save};
});
