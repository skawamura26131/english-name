'use strict';

/* ENGLISH QUEST — COURSE MAP v1.0 */
(() => {
  const STORAGE_KEY='english-quest-active-pack-v1';
  const PACKS=[
    {id:'school-p3-review',label:'PROGRAM 3',subtitle:'章末まとめ',program:3},
    {id:'school-p4',label:'PROGRAM 4',subtitle:'今回の中心範囲',program:4},
    {id:'school-p5',label:'PROGRAM 5',subtitle:'保存済み',program:5},
    {id:'school-p6',label:'PROGRAM 6',subtitle:'保存済み',program:6}
  ];

  const wordsForPack=pack=>WORDS.filter(w=>{
    const packs=Array.isArray(w.packs)?w.packs:[];
    return packs.includes(pack.id)||(Number.isInteger(pack.program)&&(w.programs||[]).includes(pack.program));
  });
  const packById=id=>PACKS.find(p=>p.id===id)||null;
  const stored=(()=>{try{return localStorage.getItem(STORAGE_KEY)||'';}catch(_){return '';}})();
  let activePackId=(packById(stored)&&wordsForPack(packById(stored)).length)?stored:'school-p4';
  const getActivePack=()=>packById(activePackId)||packById('school-p4');
  const activeWords=()=>wordsForPack(getActivePack());
  const activeLabel=()=>getActivePack().label;

  function setActivePack(id){
    const pack=packById(id); if(!pack)return false;
    if(!wordsForPack(pack).length){notify?.(`${pack.label}は、単語データを追加したら選べるようになります。`);return false;}
    if(activePackId===id)return true;
    activePackId=id; try{localStorage.setItem(STORAGE_KEY,id);}catch(_){}
    session=null; renderHome();
    if(document.getElementById('library')?.classList.contains('active'))renderLibrary();
    if(document.getElementById('data')?.classList.contains('active'))renderData();
    notify?.(`🗺 ${pack.label}へ移動しました。`);
    return true;
  }

  window.EnglishQuestCourses={getActivePack,setActivePack,getPacks:()=>PACKS.map(p=>({...p,total:wordsForPack(p).length})),wordsForPack};

  // learning-flow.js の初期移行処理が先に走れるよう、
  // DOMContentLoaded までは旧スコープを保つ。
  const legacy={isFocusWord,allFocusWords,programLabel,lockedFocusWords,unlockedFocusCount,focusStats,baseDueWords,unlockNextFocus,levelInfo,mapInfo};
  let scopeEnabled=false;

  // 選択中の教材パックを「学習範囲」として扱う。
  isFocusWord=w=>scopeEnabled?activeWords().some(x=>x.id===w.id):legacy.isFocusWord(w);
  allFocusWords=()=>scopeEnabled?activeWords():legacy.allFocusWords();
  programLabel=w=>scopeEnabled?(isFocusWord(w)?activeLabel():((w.programs||[]).length?`P${(w.programs||[]).join('/')}`:'基礎')):legacy.programLabel(w);
  lockedFocusWords=(program=null)=>scopeEnabled?activeWords().filter(w=>!state.records[w.id]?.unlocked&&(program===null||(w.programs||[]).includes(program))):legacy.lockedFocusWords(program);
  unlockedFocusCount=(program=null)=>scopeEnabled?activeWords().filter(w=>state.records[w.id]?.unlocked&&(program===null||(w.programs||[]).includes(program))).length:legacy.unlockedFocusCount(program);
  focusStats=()=>scopeEnabled?[{p:getActivePack().program,label:activeLabel(),total:activeWords().length,unlocked:activeWords().filter(w=>state.records[w.id]?.unlocked).length}]:legacy.focusStats();
  baseDueWords=()=>scopeEnabled?[]:legacy.baseDueWords(); // 選択外PROGRAMが1語混ざるのを防ぐ。
  unlockNextFocus=()=>{if(!scopeEnabled)return legacy.unlockNextFocus();const w=lockedFocusWords()[0];if(!w)return null;const r=state.records[w.id];r.unlocked=true;r.due=today();return w;};

  // 選択中パックの語数に合わせてレベルをスケール。
  const RATIOS=[0,10/286,25/286,45/286,70/286,100/286,135/286,175/286,215/286,255/286,1];
  function levelThresholds(total){let prev=-1;return RATIOS.map((r,i)=>{let n=i?Math.ceil(total*r):0;n=Math.min(total,n);if(i&&n<=prev&&prev<total)n=prev+1;prev=n;return n;});}
  levelInfo=()=>{if(!scopeEnabled)return legacy.levelInfo();const total=activeWords().length,crowns=focusMasterCount(),t=levelThresholds(total);let idx=0;t.forEach((n,i)=>{if(crowns>=n)idx=i;});const next=t[idx+1],prev=t[idx]||0,span=next===undefined?1:Math.max(1,next-prev);return {level:idx+1,crowns,next,remaining:next===undefined?0:Math.max(0,next-crowns),part:next===undefined?100:Math.min(100,Math.max(0,(crowns-prev)/span*100)),max:next===undefined||crowns>=total};};
  mapInfo=()=>scopeEnabled?({crowns:focusMasterCount(),idx:0,current:{crowns:0,name:activeLabel()},next:null}):legacy.mapInfo();

  function injectStyle(){
    if(document.getElementById('course-map-style'))return;
    const s=document.createElement('style');s.id='course-map-style';s.textContent=`
      .map-panel .map-track.course-map-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;overflow:visible;padding:2px 0 0}
      .course-pack{appearance:none;width:100%;text-align:left;border:1px solid #d2dce8;border-radius:15px;background:#f8fafc;color:#21344d;padding:13px 14px;cursor:pointer}
      .course-pack.current{border-color:#5267b8;background:#eef1ff;box-shadow:inset 0 0 0 1px rgba(82,103,184,.15)}
      .course-pack.locked{opacity:.58;cursor:not-allowed}.course-pack-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}
      .course-pack strong{display:block;font-size:15px}.course-pack-badge{font-size:10px;font-weight:900;border-radius:999px;padding:4px 7px;background:#e8edf4;color:#607087}
      .course-pack.current .course-pack-badge{background:#5369bc;color:#fff}.course-pack small{display:block;color:#6f7d90;line-height:1.45}.course-pack-progress{margin-top:7px;font-size:12px;font-weight:850;color:#354a66}
      .course-map-note{margin-top:11px;color:#718095;font-size:12px;line-height:1.55}@media(max-width:520px){.map-panel .map-track.course-map-grid{grid-template-columns:1fr}}
    `;document.head.appendChild(s);
  }

  function renderCourseMap(){
    const track=el('map-track'),place=el('map-place'),next=el('map-next');if(!track||!place||!next)return;
    const active=getActivePack();place.textContent=active.label;track.className='map-track course-map-grid';track.replaceChildren();
    PACKS.forEach(pack=>{
      const words=wordsForPack(pack),total=words.length,mastered=words.filter(w=>state.records[w.id]?.mastered).length,unlockedCount=words.filter(w=>state.records[w.id]?.unlocked).length,enabled=total>0,current=active.id===pack.id;
      const b=document.createElement('button');b.type='button';b.className=`course-pack${current?' current':''}${enabled?'':' locked'}`;b.disabled=!enabled;
      const top=document.createElement('div');top.className='course-pack-top';const title=document.createElement('strong');title.textContent=pack.label;const badge=document.createElement('span');badge.className='course-pack-badge';badge.textContent=current?'NOW':enabled?'移動':'準備中';top.append(title,badge);
      const sub=document.createElement('small');sub.textContent=enabled?pack.subtitle:`${pack.subtitle}・単語未登録`;const prog=document.createElement('div');prog.className='course-pack-progress';prog.textContent=enabled?`👑 ${mastered} / ${total}　図鑑 ${unlockedCount}`:'データ追加後に選択できます';b.append(top,sub,prog);if(enabled)b.addEventListener('click',()=>setActivePack(pack.id));track.append(b);
    });
    next.textContent=`${active.label}を学習中。マップを切り替えても、ほかのPROGRAMの記録は消えません。`;
    let note=document.getElementById('course-map-note');if(!note){note=document.createElement('p');note.id='course-map-note';note.className='course-map-note';track.insertAdjacentElement('afterend',note);}note.textContent='今後、TOEICやEnjoy Simple Englishも同じ「教材パック」として追加できる土台です。';
  }

  renderAdventure=()=>{
    if(!el('hero-key'))return;const gear=allEquipment(),crowns=focusMasterCount(),total=allFocusWords().length,pct=total?crowns/total*100:0;
    el('crown-count').textContent=crowns;el('adventure-summary').textContent=crowns?`${activeLabel()}で王冠が${crowns}個。覚えたことが、ちゃんと装備になっています。`:`${activeLabel()}の冒険を開始。できることが増えると、少しずつ装備が変わります。`;
    setGearUi('shoes',gear.shoes);setGearUi('shield',gear.shield);setGearUi('sword',gear.sword);setGearUi('outfit',gear.outfit);renderHeroGear(gear);renderCourseMap();
    const bossThreshold=Math.min(25,Math.max(1,total)),ready=crowns>=bossThreshold;if(el('boss-title'))el('boss-title').textContent=ready?'ボスへの道がひらいた。':'この先に、何かいる。';if(el('boss-message'))el('boss-message').textContent=ready?`${activeLabel()}から、最初のボスに挑めます。`:`最初のボスまで、あと${Math.max(0,bossThreshold-crowns)}王冠。`;if(el('boss-lock')){el('boss-lock').textContent=ready?'!':'?';el('boss-lock').classList.toggle('ready',ready);}el('avatar-caption').textContent=pct>=90?'本番へ向かう冒険少年':pct>=30?'街を歩いてきた少年':'街の冒険少年';
  };

  const oldHome=renderHome;renderHome=()=>{oldHome();const p=getActivePack(),total=activeWords().length,left=lockedFocusWords().length;if(el('focus-status'))el('focus-status').textContent=`ACTIVE MAP　${p.label}　｜　${total}語　｜　👑 ${focusMasterCount()} / ${total}`;if(!testMode&&el('home-message'))el('home-message').textContent=`現在のマップは${p.label}。新しい語は「見る→言う→書く」、その後はMIXで少し間を空けて復習します。`;if(el('unlock-btn'))el('unlock-btn').textContent=testMode?'TEST MODEでは追加しません':left?`${p.label}を${Math.min(5,left)}語追加する`:`${p.label}はすべて図鑑に登録済み`;updateTestControls();};
  const oldData=renderData;renderData=()=>{oldData();const total=activeWords().length;if(el('overall-summary'))el('overall-summary').textContent=testMode?`シミュレーション / ${activeLabel()} ${total}語 / Step1 ${focusStageCount(1)} / Step2 ${focusStageCount(2)} / Step3 ${focusStageCount(3)} / 王冠 ${focusMasterCount()}`:`累計 ${state.xp} EXP / 現在 ${activeLabel()} ${total}語 / 王冠 ${focusMasterCount()} / 図鑑全体 ${unlocked().length}語 / MASTER全体 ${totalMaster()}語`;updateTestControls();};
  const oldResult=renderResult;renderResult=()=>{oldResult();if(el('result-message'))el('result-message').textContent=`今回は${activeLabel()}を学習しました。ここで終了してOK。余力がある日だけ、もう5語へ。`;};
  const oldLibrary=renderLibrary;renderLibrary=()=>{oldLibrary();const intro=document.querySelector('#library .intro'),quiet=document.querySelector('#library .quiet');if(intro)intro.textContent=`${activeLabel()}の語を優先表示。ほかのPROGRAMの記録もそのまま残ります。`;if(quiet)quiet.textContent='マップを切り替えると、その教材パックが学習・復習の中心になります。';};

  const TEST_RATIOS=[0,.05,.15,.30,.50,.75,1];
  function markBasePresets(){[...document.querySelectorAll('#test-presets button[data-count]')].slice(0,7).forEach((b,i)=>b.dataset.courseBasePreset=String(i));}
  function updateTestControls(){const total=activeWords().length;document.querySelectorAll('.test-fields input[type="number"]').forEach(i=>i.max=String(total));document.querySelectorAll('#test-presets button[data-course-base-preset]').forEach(b=>{const i=Number(b.dataset.courseBasePreset),r=TEST_RATIOS[i]||0,n=Math.min(total,Math.ceil(total*r));b.dataset.count=String(n);b.textContent=String(n);b.title=`${activeLabel()} ${Math.round(r*100)}%`;});const helper=document.querySelector('#test-mode-controls > p.tiny');if(helper)helper.innerHTML=`<strong>一括プリセット：</strong>${activeLabel()}（${total}語）の進捗を確認できます。`;}

  function init(){scopeEnabled=true;injectStyle();markBasePresets();updateTestControls();renderHome();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
