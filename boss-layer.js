'use strict';

/* ENGLISH QUEST — TEST AREA v0.2 */
(() => {
  const PREF_KEY='english-quest-test-area-pref-v1';
  const STAGE_LABEL={1:'見る',2:'言う',3:'書く'};
  let session=null, syncQueued=false;

  const api=()=>window.EnglishQuestCourses||null;
  const unique=words=>{const s=new Set();return words.filter(w=>w&&!s.has(w.id)&&(s.add(w.id),true));};

  function packs(){
    const a=api();
    if(a?.getPacks&&a?.wordsForPack) return a.getPacks().map(p=>({...p,words:a.wordsForPack(p)}));
    return [3,4,5,6].map(p=>({id:`school-p${p}`,label:`PROGRAM ${p}`,program:p,words:WORDS.filter(w=>(w.programs||[]).includes(p))}));
  }
  function activePackId(){try{return api()?.getActivePack?.().id||'';}catch(_){return '';}}
  function wordsFor(ids){const set=new Set(ids);return unique(packs().filter(p=>set.has(p.id)).flatMap(p=>p.words));}
  function shuffleCopy(a){return shuffle(a);}

  function prefs(){
    const fallback={packIds:activePackId()?[activePackId()]:['school-p4'],mode:'mix',amount:'20'};
    try{
      const x=JSON.parse(localStorage.getItem(PREF_KEY)||'null');
      if(!x||typeof x!=='object')return fallback;
      return {
        packIds:Array.isArray(x.packIds)?x.packIds:fallback.packIds,
        mode:['mix','1','2','3'].includes(String(x.mode))?String(x.mode):'mix',
        amount:['10','20','all','endless'].includes(String(x.amount))?String(x.amount):'20'
      };
    }catch(_){return fallback;}
  }
  function savePrefs(x){try{localStorage.setItem(PREF_KEY,JSON.stringify(x));}catch(_){}}

  function injectStyle(){
    if(document.getElementById('test-area-v02-style'))return;
    const s=document.createElement('style');s.id='test-area-v02-style';s.textContent=`
      .test-area-open-btn{margin-top:14px;width:100%;min-height:50px;border:0;border-radius:14px;padding:12px 16px;background:linear-gradient(180deg,#344cc2,#273b9c);color:#fff;font-weight:900;font-size:15px;cursor:pointer;box-shadow:0 5px 14px rgba(31,46,120,.22)}
      body.test-area-modal-open{overflow:hidden}.test-area-overlay{position:fixed;inset:0;z-index:300;display:grid;place-items:center;padding:14px;background:rgba(17,22,46,.82);backdrop-filter:blur(4px)}.test-area-overlay[hidden]{display:none!important}
      .test-area-card{width:min(100%,680px);max-height:min(92vh,860px);overflow:auto;border:2px solid #5968af;border-radius:24px;background:#fffdf8;box-shadow:0 24px 70px rgba(0,0,0,.38);padding:clamp(18px,4.5vw,32px);color:#20334d}
      .test-area-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:18px}.test-area-kicker{color:#a27b1d;font-size:11px;font-weight:950;letter-spacing:.15em}.test-area-card h2{margin:5px 0 0;font-size:clamp(24px,6vw,32px)}
      .test-area-close{flex:0 0 auto;border:1px solid #cdd6e1;border-radius:11px;background:#fff;color:#4b5d73;font-weight:850;padding:9px 12px;cursor:pointer}.test-area-section{margin:18px 0 0}.test-area-section h3{margin:0 0 10px;font-size:15px}
      .test-pack-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.test-pack-option{position:relative;display:block}.test-pack-option input,.test-segment input{position:absolute;opacity:0;pointer-events:none}
      .test-pack-box{display:block;min-height:72px;border:1.5px solid #d0d9e4;border-radius:14px;padding:11px 13px;background:#f8fafc;cursor:pointer}.test-pack-option input:checked+.test-pack-box{border-color:#4a62bd;background:#edf1ff;box-shadow:inset 0 0 0 1px rgba(74,98,189,.14)}.test-pack-option input:disabled+.test-pack-box{opacity:.48;cursor:not-allowed}.test-pack-box strong{display:block;margin-bottom:4px}.test-pack-box small{color:#728095}
      .test-segment{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}.test-segment label{position:relative;display:block}.test-segment span{display:grid;place-items:center;min-height:46px;border:1.5px solid #d0d9e4;border-radius:12px;background:#fff;font-weight:850;font-size:13px;cursor:pointer;text-align:center;padding:7px}.test-segment input:checked+span{background:#273f9f;color:#fff;border-color:#273f9f}
      .test-area-start,.test-area-next,.test-area-primary{width:100%;min-height:50px;border:0;border-radius:14px;padding:12px 16px;background:linear-gradient(180deg,#344cc2,#273b9c);color:#fff;font-weight:950;cursor:pointer}.test-area-start{margin-top:22px}.test-area-start:disabled{opacity:.45;cursor:not-allowed}.test-area-quiet{margin:10px 0 0;color:#758298;font-size:12px;line-height:1.6}
      .test-q-head{display:flex;justify-content:space-between;align-items:center;gap:12px;color:#65758a;font-size:12px;font-weight:900}.test-q-stage{display:inline-flex;align-items:center;border-radius:999px;padding:6px 10px;background:#eef1fb;color:#324a9d}.test-q-progress{height:9px;border-radius:999px;background:#e1e6ed;overflow:hidden;margin:12px 0 22px}.test-q-progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,#50b7bf,#efc85b);transition:width .2s ease}
      .test-q-instruction{margin:0 0 8px;text-align:center;color:#718095;font-size:13px}.test-q-word{margin:8px 0 22px;text-align:center;font-size:clamp(30px,8vw,46px);line-height:1.2;overflow-wrap:anywhere}.test-answer-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.test-answer-btn{min-height:66px;border:1.5px solid #cad6e2;border-radius:14px;background:#f8fafc;color:#20334d;padding:11px;font-weight:800;cursor:pointer}.test-answer-btn.right{border-color:#4caf7d;background:#eaf8ef}.test-answer-btn.wrong{border-color:#df9696;background:#fff0f0}.test-answer-btn:disabled{opacity:1;cursor:default}
      .test-say-answer{margin:12px 0;border-radius:14px;background:#eef3fb;padding:15px;text-align:center;font-size:22px;font-weight:900}.test-say-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}.test-say-actions button,.test-reveal-btn,.test-replay-btn{min-height:48px;border-radius:13px;padding:10px 12px;font-weight:900;cursor:pointer}.test-reveal-btn{width:100%;border:0;background:#2f47aa;color:#fff}.test-replay-btn{width:100%;border:1px solid #ccd7e4;background:#fff;color:#314c69}.test-say-actions button:first-child{border:0;background:#2e9367;color:#fff}.test-say-actions button:last-child{border:1px solid #d6a9a9;background:#fff7f7;color:#8b4d4d}
      .test-write-form{display:flex;gap:9px}.test-write-input{flex:1 1 auto;min-width:0;min-height:50px;border:2px solid #c9d5e2;border-radius:13px;background:#fff;padding:10px 13px;font-size:18px}.test-write-submit{flex:0 0 auto;min-height:50px;border:0;border-radius:13px;background:#2f47aa;color:#fff;padding:10px 15px;font-weight:900}
      .test-feedback{margin-top:15px;padding:13px 15px;border:1px solid #bee0ca;border-radius:13px;background:#ebf8f0;line-height:1.6}.test-feedback.bad{border-color:#e3c7a3;background:#fff5e9}.test-feedback[hidden],.test-area-next[hidden]{display:none!important}.test-area-next{margin-top:12px}.test-endless-stop{margin-top:10px;width:100%;min-height:46px;border:1px solid #ccd6e2;border-radius:13px;background:#fff;color:#52657b;font-weight:850;cursor:pointer}
      .test-result{text-align:center}.test-result-score{margin:10px 0 2px;font-size:clamp(42px,11vw,64px);font-weight:950;color:#293f96}.test-result-rate{color:#65758b;font-weight:850}.test-result-summary{margin:18px 0;padding:14px;border-radius:14px;background:#f1f4f8;line-height:1.7}.test-wrong-details{text-align:left;margin:14px 0;border:1px solid #d7dee7;border-radius:14px;padding:12px 14px}.test-wrong-details summary{cursor:pointer;font-weight:900}.test-wrong-list{margin:10px 0 0;padding-left:20px;line-height:1.7}.test-result-actions{display:grid;gap:9px;margin-top:16px}.test-area-secondary{width:100%;min-height:48px;border:1px solid #c9d4e0;border-radius:13px;background:#fff;color:#314d69;padding:10px 14px;font-weight:900;cursor:pointer}
      @media(max-width:540px){.test-pack-grid{grid-template-columns:1fr}.test-segment{grid-template-columns:repeat(2,minmax(0,1fr))}.test-answer-grid{grid-template-columns:1fr}.test-write-form{display:block}.test-write-submit{width:100%;margin-top:9px}.test-area-card{border-radius:20px;padding:18px}}
    `;document.head.appendChild(s);
  }

  function ensureButton(){
    const copy=document.querySelector('.boss-teaser .boss-copy');if(!copy)return null;
    let b=document.getElementById('test-area-open-btn');
    if(!b){b=document.createElement('button');b.type='button';b.id='test-area-open-btn';b.className='test-area-open-btn';b.textContent='範囲を選んでテストする →';b.addEventListener('click',openSetup);copy.appendChild(b);}
    return b;
  }

  function syncTeaser(){
    syncQueued=false;const title=el('boss-title'),msg=el('boss-message'),lock=el('boss-lock'),btn=ensureButton();if(!title||!msg||!lock||!btn)return;
    if(title.textContent!=='覚えているか、試してみる。')title.textContent='覚えているか、試してみる。';
    const m='範囲と出題方法を選んで、何問でもテストできます。学習記録は変わりません。';if(msg.textContent!==m)msg.textContent=m;
    if(lock.textContent!=='TEST')lock.textContent='TEST';lock.classList.add('ready');btn.hidden=false;
  }
  function queueSync(){if(syncQueued)return;syncQueued=true;requestAnimationFrame(syncTeaser);}

  function createModal(){
    if(el('test-area-overlay'))return;
    const o=document.createElement('div');o.id='test-area-overlay';o.className='test-area-overlay';o.hidden=true;o.innerHTML=`
      <section class="test-area-card" role="dialog" aria-modal="true" aria-labelledby="test-area-title">
        <div class="test-area-top"><div><div class="test-area-kicker">TEST AREA · v0.2</div><h2 id="test-area-title">範囲テスト</h2></div><button type="button" class="test-area-close" id="test-area-close">閉じる</button></div>
        <div id="test-area-setup">
          <div class="test-area-section"><h3>① 出題範囲</h3><div class="test-pack-grid" id="test-pack-grid"></div></div>
          <div class="test-area-section"><h3>② 出題方法</h3><div class="test-segment"><label><input type="radio" name="test-mode" value="mix" checked><span>MIX</span></label><label><input type="radio" name="test-mode" value="1"><span>見る</span></label><label><input type="radio" name="test-mode" value="2"><span>言う</span></label><label><input type="radio" name="test-mode" value="3"><span>書く</span></label></div></div>
          <div class="test-area-section"><h3>③ 問題数</h3><div class="test-segment"><label><input type="radio" name="test-amount" value="10"><span>10問</span></label><label><input type="radio" name="test-amount" value="20" checked><span>20問</span></label><label><input type="radio" name="test-amount" value="all"><span>全範囲</span></label><label><input type="radio" name="test-amount" value="endless"><span>ひたすら</span></label></div></div>
          <button type="button" class="test-area-start" id="test-area-start">テスト開始 →</button><p class="test-area-quiet" id="test-area-selection-note"></p><p class="test-area-quiet">EXP・王冠・復習日は変わりません。試験前の確認専用です。</p>
        </div>
        <div id="test-area-question" hidden><div class="test-q-head"><span class="test-q-stage" id="test-q-stage">MIX</span><span id="test-q-counter"></span></div><div class="test-q-progress"><span id="test-q-progress-bar"></span></div><p class="test-q-instruction" id="test-q-instruction"></p><h3 class="test-q-word" id="test-q-word"></h3><div id="test-q-answer-area"></div><div class="test-feedback" id="test-q-feedback" hidden></div><button type="button" class="test-area-next" id="test-q-next" hidden>次の問題へ →</button><button type="button" class="test-endless-stop" id="test-endless-stop" hidden>ここで結果を見る</button></div>
        <div class="test-result" id="test-area-result" hidden><div class="test-area-kicker">TEST COMPLETE</div><div class="test-result-score" id="test-result-score"></div><div class="test-result-rate" id="test-result-rate"></div><div class="test-result-summary" id="test-result-summary"></div><details class="test-wrong-details" id="test-wrong-details" hidden><summary id="test-wrong-summary"></summary><ul class="test-wrong-list" id="test-wrong-list"></ul></details><div class="test-result-actions"><button type="button" class="test-area-primary" id="test-retry-wrong" hidden>間違えた語だけ再テスト</button><button type="button" class="test-area-secondary" id="test-restart-same">同じ条件でもう一度</button><button type="button" class="test-area-secondary" id="test-change-settings">範囲・条件を変える</button><button type="button" class="test-area-secondary" id="test-result-close">ホームへ戻る</button></div></div>
      </section>`;
    document.body.appendChild(o);
    el('test-area-close').addEventListener('click',closeModal);el('test-area-start').addEventListener('click',startFromSetup);el('test-q-next').addEventListener('click',advance);el('test-endless-stop').addEventListener('click',finish);el('test-retry-wrong').addEventListener('click',retryWrong);el('test-restart-same').addEventListener('click',restartSame);el('test-change-settings').addEventListener('click',showSetup);el('test-result-close').addEventListener('click',closeModal);
    o.addEventListener('click',e=>{if(e.target===o)closeModal();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!o.hidden)closeModal();});
  }

  function renderPackChoices(){
    const root=el('test-pack-grid');root.replaceChildren();const p=prefs(),ps=packs(),valid=new Set(ps.filter(x=>x.words.length).map(x=>x.id));let selected=p.packIds.filter(id=>valid.has(id));
    if(!selected.length){const a=activePackId();if(valid.has(a))selected=[a];else{const f=ps.find(x=>x.words.length);if(f)selected=[f.id];}}
    ps.forEach(pack=>{const enabled=pack.words.length>0,l=document.createElement('label');l.className='test-pack-option';const i=document.createElement('input');i.type='checkbox';i.name='test-pack';i.value=pack.id;i.disabled=!enabled;i.checked=enabled&&selected.includes(pack.id);const box=document.createElement('span');box.className='test-pack-box';const strong=document.createElement('strong');strong.textContent=pack.label||pack.id;const small=document.createElement('small');small.textContent=enabled?`${pack.words.length}語`:'単語データ未登録';box.append(strong,small);l.append(i,box);root.append(l);i.addEventListener('change',selectionNote);});
    document.querySelector(`input[name="test-mode"][value="${p.mode}"]`)?.click();document.querySelector(`input[name="test-amount"][value="${p.amount}"]`)?.click();selectionNote();
  }
  function setupValues(){return {packIds:[...document.querySelectorAll('input[name="test-pack"]:checked')].map(x=>x.value),mode:document.querySelector('input[name="test-mode"]:checked')?.value||'mix',amount:document.querySelector('input[name="test-amount"]:checked')?.value||'20'};}
  function selectionNote(){const x=setupValues(),ws=wordsFor(x.packIds),labels=packs().filter(p=>x.packIds.includes(p.id)).map(p=>p.label);el('test-area-start').disabled=!ws.length;el('test-area-selection-note').textContent=ws.length?`選択中：${labels.join(' ＋ ')}　合計 ${ws.length}語`:'出題範囲を1つ以上選んでください。';}
  function openSetup(){createModal();showSetup();el('test-area-overlay').hidden=false;document.body.classList.add('test-area-modal-open');}
  function closeModal(){const o=el('test-area-overlay');if(!o)return;o.hidden=true;document.body.classList.remove('test-area-modal-open');try{speechSynthesis?.cancel?.();}catch(_){}session=null;}
  function showSetup(){el('test-area-setup').hidden=false;el('test-area-question').hidden=true;el('test-area-result').hidden=true;renderPackChoices();}

  function wordQueue(pool,count){const q=[];let last=null;while(q.length<count){let c=shuffleCopy(pool);if(c.length>1&&last&&c[0].id===last)[c[0],c[1]]=[c[1],c[0]];for(const w of c){if(q.length>=count)break;q.push(w);}last=q.at(-1)?.id||null;}return q;}
  function stageDeck(){return shuffleCopy([1,2,3]);}
  function nextStage(s){if(s.mode!=='mix')return Number(s.mode);if(!s.stageDeck.length)s.stageDeck=stageDeck();return s.stageDeck.shift();}
  function finiteTasks(pool,amount,mode){const words=amount==='all'?shuffleCopy(pool):wordQueue(pool,Number(amount));const temp={mode,stageDeck:[]};return words.map(word=>({word,stage:nextStage(temp)}));}

  function startFromSetup(){const x=setupValues(),pool=wordsFor(x.packIds);if(!pool.length){notify?.('出題範囲を1つ以上選んでください。');return;}savePrefs(x);session={...x,pool,endless:x.amount==='endless',tasks:x.amount==='endless'?[]:finiteTasks(pool,x.amount,x.mode),index:0,current:null,score:0,answeredCount:0,answered:false,wrong:new Map(),stageDeck:[],endlessQueue:[],cycle:0,lastWordId:null};el('test-area-setup').hidden=true;el('test-area-result').hidden=true;el('test-area-question').hidden=false;prepare();renderQuestion();}
  function nextEndlessWord(){if(!session.endlessQueue.length){let c=shuffleCopy(session.pool);if(c.length>1&&session.lastWordId&&c[0].id===session.lastWordId)[c[0],c[1]]=[c[1],c[0]];session.endlessQueue=c;session.cycle++;}const w=session.endlessQueue.shift();session.lastWordId=w?.id||null;return w;}
  function prepare(){session.current=session.endless?{word:nextEndlessWord(),stage:nextStage(session)}:(session.tasks[session.index]||null);session.answered=false;}

  function distractors(word){const same=session.pool.filter(w=>w.id!==word.id&&w.jp!==word.jp&&(w.programs||[]).some(p=>(word.programs||[]).includes(p)));let pool=same.length>=3?same:session.pool.filter(w=>w.id!==word.id&&w.jp!==word.jp);let chosen=shuffleCopy(pool).slice(0,3);if(chosen.length<3){const used=new Set([word.id,...chosen.map(w=>w.id)]);const fill=WORDS.filter(w=>!used.has(w.id)&&w.jp!==word.jp&&!chosen.some(x=>x.jp===w.jp));chosen.push(...shuffleCopy(fill).slice(0,3-chosen.length));}return shuffleCopy([word,...chosen]);}
  function counter(){return session.endless?`${session.answeredCount+1}問目・${session.cycle}周目`:`${session.index+1} / ${session.tasks.length}`;}
  function progress(){if(session.endless){const n=Math.max(1,session.pool.length),pos=n-session.endlessQueue.length;return Math.min(100,pos/n*100);}return session.index/Math.max(1,session.tasks.length)*100;}

  function renderQuestion(){
    if(!session?.current){finish();return;}const {word,stage}=session.current;el('test-q-stage').textContent=session.mode==='mix'?`MIX · ${STAGE_LABEL[stage]}`:`TEST · ${STAGE_LABEL[stage]}`;el('test-q-counter').textContent=counter();el('test-q-progress-bar').style.width=`${progress()}%`;const ins=el('test-q-instruction'),prompt=el('test-q-word'),root=el('test-q-answer-area'),fb=el('test-q-feedback'),next=el('test-q-next'),stop=el('test-endless-stop');root.replaceChildren();fb.hidden=true;fb.classList.remove('bad');next.hidden=true;stop.hidden=!session.endless;
    if(stage===1){ins.textContent='英語を見て、正しい意味を選ぼう';prompt.textContent=word.en;const grid=document.createElement('div');grid.className='test-answer-grid';distractors(word).forEach(opt=>{const b=document.createElement('button');b.type='button';b.className='test-answer-btn';b.textContent=opt.jp;b.addEventListener('click',()=>{if(session.answered)return;const ok=opt.id===word.id;grid.querySelectorAll('button').forEach(x=>{x.disabled=true;if(x===b)x.classList.add(ok?'right':'wrong');if(!ok&&x.textContent===word.jp)x.classList.add('right');});record(ok,word,stage);feedback(ok,ok?`正解！ ${word.en} = ${word.jp}`:`正解は「${word.jp}」。`);});grid.append(b);});root.append(grid);return;}
    if(stage===2){ins.textContent='日本語を見て、先に英語を声に出そう';prompt.textContent=word.jp;const reveal=document.createElement('button');reveal.type='button';reveal.className='test-reveal-btn';reveal.textContent='答えと発音を確認する 🔊';const ans=document.createElement('div');ans.className='test-say-answer';ans.hidden=true;const replay=document.createElement('button');replay.type='button';replay.className='test-replay-btn';replay.textContent='もう一度聞く 🔊';replay.hidden=true;const acts=document.createElement('div');acts.className='test-say-actions';acts.hidden=true;const yes=document.createElement('button');yes.type='button';yes.textContent='言えた ✓';const no=document.createElement('button');no.type='button';no.textContent='まだ難しい';reveal.addEventListener('click',()=>{ans.textContent=word.en;ans.hidden=false;reveal.hidden=true;replay.hidden=false;acts.hidden=false;try{speakWord(word);}catch(_){}});replay.addEventListener('click',()=>{try{speakWord(word);}catch(_){}});yes.addEventListener('click',()=>{if(session.answered)return;yes.disabled=no.disabled=true;record(true,word,stage);feedback(true,`言えた！ ${word.en}`);});no.addEventListener('click',()=>{if(session.answered)return;yes.disabled=no.disabled=true;record(false,word,stage);feedback(false,`答え：${word.en}`);});acts.append(yes,no);root.append(reveal,ans,replay,acts);return;}
    ins.textContent='日本語を見て、英語を正確に書こう';prompt.textContent=word.jp;const form=document.createElement('form');form.className='test-write-form';form.noValidate=true;const input=document.createElement('input');input.className='test-write-input';input.type='text';input.autocomplete='off';input.autocapitalize='none';input.spellcheck=false;input.placeholder='ここに英語を書く';const sub=document.createElement('button');sub.type='submit';sub.className='test-write-submit';sub.textContent='答え合わせ';form.append(input,sub);form.addEventListener('submit',e=>{e.preventDefault();if(session.answered)return;sub.disabled=true;input.readOnly=true;const ok=isTypedCorrect(input.value,word);record(ok,word,stage);let m=ok?`正解！ ${word.en}（${word.jp}）`:`正解：${word.en}`;if(!ok)try{m=spellingHint(input.value,word.en);}catch(_){}feedback(ok,m);});root.append(form);setTimeout(()=>{try{input.focus({preventScroll:true});}catch(_){}},80);
  }

  function record(ok,word,stage){if(session.answered)return;session.answered=true;session.answeredCount++;if(ok)session.score++;else{const x=session.wrong.get(word.id)||{word,misses:0,stages:new Set()};x.misses++;x.stages.add(stage);session.wrong.set(word.id,x);}}
  function feedback(ok,msg){const fb=el('test-q-feedback'),next=el('test-q-next');fb.hidden=false;fb.classList.toggle('bad',!ok);fb.textContent=msg;next.hidden=false;next.textContent=!session.endless&&session.index===session.tasks.length-1?'結果を見る →':'次の問題へ →';}
  function advance(){if(!session?.answered)return;if(session.endless){prepare();renderQuestion();return;}session.index++;if(session.index>=session.tasks.length){finish();return;}prepare();renderQuestion();}

  function finish(){if(!session)return;el('test-area-setup').hidden=true;el('test-area-question').hidden=true;el('test-area-result').hidden=false;const total=session.answeredCount,score=session.score,rate=total?Math.round(score/total*100):0;el('test-result-score').textContent=`${score} / ${total}`;el('test-result-rate').textContent=`正解率 ${rate}%`;const labels=packs().filter(p=>session.packIds.includes(p.id)).map(p=>p.label).join(' ＋ '),mode=session.mode==='mix'?'MIX':STAGE_LABEL[Number(session.mode)],amount=session.endless?`ひたすら・${total}問で終了`:session.amount==='all'?'全範囲':`${session.tasks.length}問`;el('test-result-summary').textContent=`${labels} / ${mode} / ${amount}。間違えた語は${session.wrong.size}語でした。`;const details=el('test-wrong-details'),list=el('test-wrong-list'),retry=el('test-retry-wrong');list.replaceChildren();if(session.wrong.size){details.hidden=false;retry.hidden=false;el('test-wrong-summary').textContent=`間違えた語 ${session.wrong.size}語`;[...session.wrong.values()].sort((a,b)=>b.misses-a.misses||a.word.en.localeCompare(b.word.en)).forEach(item=>{const li=document.createElement('li');li.textContent=`${item.word.en} — ${item.word.jp}（${[...item.stages].map(s=>STAGE_LABEL[s]).join('・')}）`;list.append(li);});}else{details.hidden=true;retry.hidden=true;}}
  function retryWrong(){if(!session?.wrong.size)return;const prior=session,wrong=[...prior.wrong.values()].map(x=>x.word),temp={mode:prior.mode,stageDeck:[]};session={packIds:[...prior.packIds],mode:prior.mode,amount:'wrong',pool:wrong,endless:false,tasks:shuffleCopy(wrong).map(word=>({word,stage:nextStage(temp)})),index:0,current:null,score:0,answeredCount:0,answered:false,wrong:new Map(),stageDeck:[],endlessQueue:[],cycle:0,lastWordId:null};el('test-area-result').hidden=true;el('test-area-question').hidden=false;prepare();renderQuestion();}
  function restartSame(){if(!session)return;const prior=session,amount=prior.amount==='wrong'?'all':prior.amount,pool=wordsFor(prior.packIds);session={packIds:[...prior.packIds],mode:prior.mode,amount,pool,endless:amount==='endless',tasks:amount==='endless'?[]:finiteTasks(pool,amount,prior.mode),index:0,current:null,score:0,answeredCount:0,answered:false,wrong:new Map(),stageDeck:[],endlessQueue:[],cycle:0,lastWordId:null};el('test-area-result').hidden=true;el('test-area-question').hidden=false;prepare();renderQuestion();}

  function watch(){const o=new MutationObserver(queueSync);const boss=document.querySelector('.boss-teaser'),map=document.querySelector('.map-panel');if(boss)o.observe(boss,{subtree:true,childList:true,characterData:true,attributes:true});if(map)o.observe(map,{subtree:true,childList:true,characterData:true});}
  function init(){injectStyle();createModal();ensureButton();syncTeaser();watch();requestAnimationFrame(syncTeaser);setTimeout(syncTeaser,200);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
