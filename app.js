'use strict';

// All data stays on this device. No external analytics, accounts, or APIs.
const WORDS = [
  {id:'they',en:'they',jp:'彼らは・彼女らは'},
  {id:'his',en:'his',jp:'彼の'},
  {id:'friend',en:'friend',jp:'友だち（1人）'},
  {id:'different',en:'different',jp:'異なる・ちがう'},
  {id:'find',en:'find',jp:'見つける'},
  {id:'their',en:'their',jp:'彼らの・彼女らの'},
  {id:'him',en:'him',jp:'彼を・彼に'},
  {id:'friends',en:'friends',jp:'友だち（複数）'},
  {id:'look-for',en:'look for',jp:'探す'},
  {id:'need',en:'need',jp:'必要とする'},
  {id:'use',en:'use',jp:'使う'},
  {id:'together',en:'together',jp:'一緒に'},
  {id:'meet',en:'meet',jp:'会う・出会う'},
  {id:'help',en:'help',jp:'助ける'},
  {id:'travel',en:'travel',jp:'旅をする'},
  {id:'map',en:'map',jp:'地図'},
  {id:'house',en:'house',jp:'家'},
  {id:'iron',en:'iron',jp:'鉄'},
  {id:'were',en:'were',jp:'〜だった（we/you/they）'},
  {id:'was',en:'was',jp:'〜だった（I/he/she/it）'},
  {id:'do',en:'do',jp:'する・疑問文で使うdo'},
  {id:'does',en:'does',jp:'する・三単現の疑問文で使う'},
  {id:'game',en:'game',jp:'ゲーム（1つ）'},
  {id:'games',en:'games',jp:'ゲーム（複数）'},
  {id:'finds',en:'finds',jp:'見つける（主語がheなど）'},
  {id:'play',en:'play',jp:'遊ぶ・プレーする'},
  {id:'make',en:'make',jp:'作る'},
  {id:'wood',en:'wood',jp:'木材'},
  {id:'town',en:'town',jp:'町'},
  {id:'old',en:'old',jp:'古い'}
];
const STORE_KEY = 'english-quest-v1';
const MAX_DAILY_XP = 30;
const dateStr = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
function addDays(day, n){ const d = new Date(`${day}T12:00:00`); d.setDate(d.getDate()+n); return dateStr(d); }
function fresh(){
  const records = {};
  WORDS.forEach((word,i) => {records[word.id] = {unlocked:i<5,stage:1,streak:0,due:dateStr(),attempts:0,correct:0,mastered:false,lastAttempt:null};});
  return {version:1,xp:54,legacyXp:54,legacyReadingWords:131,history:[],records};
}
function saneState(value){
  if(!value || value.version!==1 || !Number.isSafeInteger(value.xp) || value.xp<0 || !Array.isArray(value.history) || !value.records || typeof value.records!=='object') return false;
  if(value.history.length>100000) return false;
  return WORDS.every(w => {
    const x=value.records[w.id];
    return x && typeof x.unlocked==='boolean' && [1,2,3].includes(x.stage) && Number.isInteger(x.streak) && x.streak>=0 && x.streak<=4 && /^\d{4}-\d{2}-\d{2}$/.test(x.due) && Number.isInteger(x.attempts) && x.attempts>=0 && Number.isInteger(x.correct) && x.correct>=0 && typeof x.mastered==='boolean';
  });
}
function load(){try {const obj=JSON.parse(localStorage.getItem(STORE_KEY));return saneState(obj)?obj:fresh();}catch(_){return fresh();}}
let state=load();
function persist(){try{localStorage.setItem(STORE_KEY,JSON.stringify(state));return true;}catch(_){notify('保存できません。ブラウザの保存設定を確認し、バックアップを取ってください。');return false;}}
let session = null;
const el = (id) => document.getElementById(id);
const today = () => dateStr();
const wordById = id => WORDS.find(w => w.id===id);
function totalMaster(){return WORDS.filter(w=>state.records[w.id].unlocked && state.records[w.id].mastered).length;}
function unlocked(){return WORDS.filter(w=>state.records[w.id].unlocked);}
function dueWords(){return unlocked().filter(w=>state.records[w.id].due<=today() && state.records[w.id].lastAttempt!==today()).sort((a,b)=>state.records[a.id].due.localeCompare(state.records[b.id].due));}
function dailyEarned(){return state.history.filter(x=>x.day===today()).reduce((s,x)=>s+x.xp,0);}
function stageName(rec){if(rec.mastered)return 'MASTER・復習中';if(rec.stage===1)return 'STAGE 1 見る';if(rec.stage===2)return 'STAGE 2 言う';return `STAGE 3 書く（${rec.streak}/4）`;}
function show(view){
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===view));
  document.querySelectorAll('.nav button').forEach(b=>{const chosen=b.dataset.view===(['practice','result'].includes(view)?'home':view);b.classList.toggle('selected',chosen);if(chosen)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  if(view==='home')renderHome();if(view==='library')renderLibrary();if(view==='data')renderData();
  window.scrollTo({top:0,behavior:'instant'});
}
let toastTimer;
function notify(message){const t=el('toast');t.textContent=message;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{t.hidden=true;},4400);}
function renderHome(){
  const lvl=Math.floor(state.xp/100)+1, xpPart=state.xp%100;
  el('level-title').textContent=`Lv.${lvl} ${lvl===1?'はじまりの村':'冒険者'}`;
  el('xp-label').textContent=`${state.xp} EXP`;
  el('xp-bar').style.width=`${xpPart}%`;
  el('next-label').textContent=`次のレベルまで${100-xpPart} EXP`;
  el('unlocked-stat').textContent=`${unlocked().length}語`;
  el('master-stat').textContent=`${totalMaster()}語`;
  el('due-stat').textContent=`${dueWords().length}語`;
  const due=dueWords().length;
  el('start-btn').disabled=due===0;
  el('start-btn').textContent=due?'修行をはじめる →':'今日の修行は終了 ✓';
  el('home-message').textContent=due?`今日の復習は${due}語。まずは最大5語だけ。終わったらそこで終了してもOK。`:'今日の分は終了！ 追加しなくてもOK。新しい語を増やす場合は下のボタンから。';
  const left=WORDS.length-unlocked().length;
  el('unlock-btn').disabled=left===0;
  el('unlock-btn').textContent=left?`新しい${Math.min(5,left)}語を追加する`:'全30語を図鑑に登録済み';
}
function renderLibrary(){
  const root=el('library-list');root.replaceChildren();
  unlocked().forEach(w=>{
    const rec=state.records[w.id];
    const row=document.createElement('div');row.className='word-row';
    const left=document.createElement('div');const en=document.createElement('strong');en.textContent=w.en;const jp=document.createElement('small');jp.textContent=w.jp;left.append(en,jp);
    const right=document.createElement('div');right.className='state';right.textContent=stageName(rec);
    const next=document.createElement('div');next.className='due';next.textContent=`次回：${rec.due}`;right.append(next);
    row.append(left,right);root.append(row);
  });
}
function renderData(){
  const list=state.history.filter(x=>x.day===today());
  el('today-summary').textContent=`挑戦 ${list.length}語分 / 今日の獲得 ${dailyEarned()} EXP（1日の上限${MAX_DAILY_XP}）`;
  el('overall-summary').textContent=`累計 ${state.xp} EXP / 図鑑 ${unlocked().length}語 / MASTER ${totalMaster()}語 / 過去の教材で読んだ記録 ${state.legacyReadingWords||0} words`;
}
function unlockFive(){
  const items=WORDS.filter(w=>!state.records[w.id].unlocked).slice(0,5);
  if(!items.length)return;
  items.forEach(w=>{state.records[w.id].unlocked=true;state.records[w.id].due=today();});
  persist();renderHome();notify(`${items.length}語を追加しました。今日はやらなくても大丈夫。`);
}
function start(){
  const chosen=dueWords().slice(0,5).map(w=>w.id);
  if(!chosen.length){renderHome();return;}
  session={ids:chosen,index:0,earned:0,success:0,review:0,finished:false};
  renderQuestion();show('practice');
}
function shuffle(list){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function optionsFor(word){
  const distractors=shuffle(WORDS.filter(w=>w.id!==word.id && w.jp!==word.jp)).slice(0,3);
  return shuffle([word,...distractors]);
}
function renderQuestion(){
  const word=wordById(session.ids[session.index]);const rec=state.records[word.id];
  el('session-counter').textContent=`${session.index+1} / ${session.ids.length}`;
  el('session-progress').style.width=`${session.index/session.ids.length*100}%`;
  el('question-stage').textContent=rec.stage===1?'STAGE 1 · 見る':rec.stage===2?'STAGE 2 · 言う':'STAGE 3 · 書く';
  el('task-instruction').textContent=rec.stage===1?'英語を見て、正しい意味を選ぼう':rec.stage===2?'日本語を見て、まず英語を声に出してから答えを見よう':'英語は見ずに、キーボードで正確に入力しよう';
  el('question-text').textContent=rec.stage===1?word.en:word.jp;
  el('question-note').textContent=rec.stage===3?'スペルのヒントはありません。わからなければ空欄のまま判定してOK。':rec.stage===2?'声に出したら「答えを見る」を押して自分でチェック。':'正解をタップしてね。';
  el('feedback').hidden=true;el('feedback').classList.remove('bad');el('next-btn').hidden=true;
  const root=el('answer-area');root.replaceChildren();
  if(rec.stage===1){
    const grid=document.createElement('div');grid.className='answer-grid';
    optionsFor(word).forEach(option=>{
      const b=document.createElement('button');b.type='button';b.className='answer-btn';b.textContent=option.jp;
      b.addEventListener('click',()=>{
        grid.querySelectorAll('button').forEach(x=>x.disabled=true);
        b.classList.add(option.id===word.id?'right':'wrong');
        complete(option.id===word.id,word,`正解：${word.en} = ${word.jp}`);
      });grid.append(b);
    });root.append(grid);
  }else if(rec.stage===2){
    const guide=document.createElement('div');guide.className='say-guide';guide.textContent='① 声に出す → ② 正解を見る → ③「言えた」「まだ」を選ぶ';
    const reveal=document.createElement('button');reveal.type='button';reveal.className='secondary full';reveal.textContent='答えを見る';
    const actions=document.createElement('div');actions.className='say-actions';actions.hidden=true;
    const yes=document.createElement('button');yes.textContent='言えた ✓';
    const no=document.createElement('button');no.textContent='まだ難しい';
    reveal.addEventListener('click',()=>{guide.textContent=`答え：${word.en}（${word.jp}）`;reveal.hidden=true;actions.hidden=false;});
    [yes,no].forEach(b=>b.addEventListener('click',()=>{yes.disabled=true;no.disabled=true;complete(b===yes,word,`正解：${word.en}`);}));
    actions.append(yes,no);root.append(guide,reveal,actions);
  }else{
    const form=document.createElement('form');form.noValidate=true;
    const input=document.createElement('input');input.className='typed';input.type='text';input.autocomplete='off';input.autocapitalize='none';input.spellcheck=false;input.placeholder='ここに英語を書く';input.setAttribute('aria-label','英単語を入力');
    const submit=document.createElement('button');submit.type='submit';submit.className='primary';submit.textContent='答え合わせ';
    form.append(input,submit);
    form.addEventListener('submit',evt=>{
      evt.preventDefault();submit.disabled=true;input.readOnly=true;
      const norm=s=>s.normalize('NFKC').trim().toLowerCase().replace(/[.!?]+$/,'').replace(/\s+/g,' ');
      const correct=norm(input.value)===norm(word.en);
      complete(correct,word,`正解：${word.en}（${word.jp}）${correct?'':' / 自分の回答：'+(input.value||'空欄')}`);
    });root.append(form);
    setTimeout(()=>input.focus({preventScroll:true}),100);
  }
}
function complete(correct,word,message){
  const rec=state.records[word.id], before=rec.stage, now=today();
  rec.attempts++;
  rec.lastAttempt=now;
  if(correct){
    rec.correct++;
    if(before===1){rec.stage=2;rec.due=addDays(now,1);}
    else if(before===2){rec.stage=3;rec.streak=0;rec.due=addDays(now,1);}
    else {rec.streak=Math.min(4,rec.streak+1);if(rec.streak===4)rec.mastered=true;rec.due=addDays(now,rec.streak===1?1:rec.streak===2?3:rec.streak===3?7:30);}
    session.success++;
  }else{
    if(before===3)rec.streak=0;
    rec.due=addDays(now,1);session.review++;
  }
  const raw=correct?(before===3?3:2):1;
  const award=Math.min(raw,Math.max(0,MAX_DAILY_XP-dailyEarned()));
  state.xp+=award;session.earned+=award;
  state.history.push({day:now,id:word.id,stage:before,correct,xp:award,nextDue:rec.due});
  persist();
  const fb=el('feedback');fb.hidden=false;fb.classList.toggle('bad',!correct);fb.replaceChildren();
  const title=document.createElement('strong');title.textContent=correct?`正解！ +${award} EXP`:`再挑戦のチャンス +${award} EXP`;
  const desc=document.createElement('span');desc.textContent=`${message}。次の復習：${rec.due}`;
  fb.append(title,desc);el('next-btn').hidden=false;
  if(correct && rec.mastered)notify(`${word.en} がMASTERになりました！`);
}
function advance(){session.index++;if(session.index>=session.ids.length){renderResult();show('result');}else renderQuestion();}
function renderResult(){el('result-xp').textContent=`+${session.earned}`;el('result-count').textContent=`${session.ids.length}語`;el('result-review').textContent=`${session.review}語`;el('result-message').textContent=session.review?'間違えた語は明日また登場。今日は直せなかったところが分かっただけでOK。':'今日の分は終了。次回は一段上の問題に挑戦しよう。';}
function download(name,content,mime){
  const blob=new Blob([content],{type:mime});const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
function exportJson(){download(`english-quest-backup-${today()}.json`,JSON.stringify(state,null,2),'application/json');notify('バックアップを保存しました。ファイルを安全な場所に保管してください。');}
function csvCell(s){const v=String(s??'');return '"'+v.replace(/"/g,'""')+'"';}
function exportCsv(){
  const rows=[['date','word','japanese','stage_at_attempt','correct','xp_awarded','next_due']];
  state.history.forEach(h=>{const w=wordById(h.id);if(w)rows.push([h.day,w.en,w.jp,h.stage,h.correct?'yes':'no',h.xp,h.nextDue]);});
  download(`english-quest-log-${today()}.csv`,'\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');
  notify('CSVを保存しました。このチャットに添付できます。');
}
async function importJson(event){
  const file=event.target.files?.[0];if(!file)return;
  try{
    if(file.size>5_000_000)throw new Error('ファイルが大きすぎます');
    const obj=JSON.parse(await file.text());if(!saneState(obj))throw new Error('形式が違います');
    if(!confirm(`記録を読み込むと、この端末の今の履歴は置き換わります。読み込むデータ：${obj.xp} EXP。続けますか？`))return;
    state=obj;persist();renderHome();show('home');notify('バックアップを読み込みました。');
  }catch(e){notify('読み込めませんでした。English QuestのバックアップJSONを選んでください。');}
  finally{event.target.value='';}
}
function init(){
  el('start-btn').addEventListener('click',start);
  el('unlock-btn').addEventListener('click',unlockFive);
  el('reset-today-btn').addEventListener('click',()=>show('data'));
  el('back-btn').addEventListener('click',()=>show('home'));
  el('next-btn').addEventListener('click',advance);
  el('result-home-btn').addEventListener('click',()=>show('home'));
  document.querySelectorAll('.nav button').forEach(btn=>btn.addEventListener('click',()=>show(btn.dataset.view)));
  el('export-json').addEventListener('click',exportJson);
  el('export-csv').addEventListener('click',exportCsv);
  el('import-file').addEventListener('change',importJson);
  renderHome();
  if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  }
}
init();
