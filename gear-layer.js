'use strict';

/* ENGLISH QUEST v1.8.0 — pack-aware equipment progression */
(() => {
  const PERCENTS=[0,5,15,30,50,75,100];
  const LATER_RATIOS=[.05,.15,.30,.50,.75,1];
  const FIRST_UNLOCK={shoes:3,shield:5,sword:8};
  const MIN_STAGE_GAP=5;

  const NAMES={
    shoes:['いつものスニーカー','ちょっと軽いくつ','よく歩けるくつ','遠くまで行けそうなくつ','かなり歩いたブーツ','本番前のブーツ','ここまで歩いたくつ'],
    shield:['小さなたて','少し安心なたて','ちゃんと守れるたて','頼りになるたて','けっこう安心なたて','本番に持っていくたて','だいじょうぶなたて'],
    sword:['はじめのつるぎ','手になじんできたつるぎ','ちゃんと使えるつるぎ','頼りになるつるぎ','けっこうやれるつるぎ','本番に持っていくつるぎ','これならいけるつるぎ']
  };
  const ICONS={shoes:'👟',shield:'🛡',sword:'⚔'},LABELS={shoes:'くつ',shield:'たて',sword:'つるぎ'};
  const ASSETS={
    hero:'./assets/hero/hero_base_front.png',
    shoes:{progressId:'gear-shoes-progress',nameId:'gear-shoes-name',nextId:'gear-shoes-next',layerId:'hero-shoes-layer',path:p=>`./assets/equipment/shoes/shoes_${p}.png`},
    shield:{progressId:'gear-shield-progress',nameId:'gear-shield-name',nextId:'gear-shield-next',layerId:'hero-shield-layer',path:p=>`./assets/equipment/shields/shield_${p}.png`},
    sword:{progressId:'gear-sword-progress',nameId:'gear-sword-name',nextId:'gear-sword-next',layerId:'hero-sword-layer',path:p=>`./assets/equipment/swords/sword_${p}.png`}
  };

  const REWARD_KEY='english-quest-gear-reward-v2';
  let rewardState=null,renderQueued=false;
  const activePackKey=()=>{try{return window.EnglishQuestCourses?.getActivePack?.().id||'legacy';}catch(_){return 'legacy';}};

  function injectStyle(){if(document.getElementById('gear-layer-style'))return;const s=document.createElement('style');s.id='gear-layer-style';s.textContent=`
    .hero-gear-badges{display:none!important}.avatar-wrap,.hero-visual{overflow:visible!important}
    .hero-sprite-stack{position:relative;width:min(100%,220px);aspect-ratio:1/1;display:block;flex:0 0 auto}
    .hero-sprite-stack .hero-sprite{position:absolute!important;inset:0!important;display:block;width:100%!important;height:100%!important;max-width:none!important;object-fit:contain!important;image-rendering:pixelated!important;pointer-events:none}
    .hero-sprite-stack .hero-base{z-index:1}.hero-sprite-stack .hero-outfit-layer{z-index:2}.hero-sprite-stack .hero-shoes-layer{z-index:3}.hero-sprite-stack .hero-shield-layer{z-index:4}.hero-sprite-stack .hero-sword-layer{z-index:5;transform:translateX(-16%)!important}
    .hero-sprite-stack .hero-sprite[hidden]{display:none!important}.gear-card[data-visual-tier="0"]::after{width:0!important}@media(max-width:680px){.hero-sprite-stack{width:min(100%,205px)}}`;document.head.appendChild(s);}
  function makeLayer(id,cls){const img=document.createElement('img');img.id=id;img.className=`hero-sprite ${cls}`;img.alt='';img.setAttribute('aria-hidden','true');img.hidden=true;img.decoding='async';return img;}
  function prepareStack(){const visual=document.querySelector('.hero-visual'),base=document.getElementById('hero-key');if(!visual||!base)return null;let stack=document.getElementById('hero-sprite-stack');if(stack)return stack;stack=document.createElement('div');stack.id='hero-sprite-stack';stack.className='hero-sprite-stack';stack.setAttribute('aria-label',base.alt||'街の冒険少年');const fallback=base.getAttribute('src')||'./hero-key.png';base.dataset.fallbackSrc=fallback;base.classList.add('hero-sprite','hero-base');visual.insertBefore(stack,base);stack.appendChild(base);[makeLayer('hero-outfit-layer','hero-outfit-layer'),makeLayer('hero-shoes-layer','hero-shoes-layer'),makeLayer('hero-shield-layer','hero-shield-layer'),makeLayer('hero-sword-layer','hero-sword-layer')].forEach(x=>stack.appendChild(x));base.onerror=()=>{if(base.dataset.usingFallback==='1')return;base.dataset.usingFallback='1';base.src=base.dataset.fallbackSrc;};base.src=ASSETS.hero;return stack;}

  function parseProgress(id){const text=String(document.getElementById(id)?.textContent||''),m=text.match(/(\d+)\s*\/\s*(\d+)/);if(m)return {count:Number(m[1]),total:Number(m[2])};const one=text.match(/\d+/);return {count:one?Number(one[0]):0,total:0};}
  function thresholdsFor(kind,total){if(total<=0)return [0,0,0,0,0,0,0];const result=[Math.min(total,FIRST_UNLOCK[kind])];let prev=result[0];LATER_RATIOS.forEach(r=>{let target=Math.ceil(total*r);if(prev<total)target=Math.max(target,prev+MIN_STAGE_GAP);target=Math.min(total,target);result.push(target);prev=target;});return result.slice(0,7);}
  function stageFor(kind,count,total){let stage=0;thresholdsFor(kind,total).forEach((t,i)=>{if(t>0&&count>=t)stage=i+1;});return stage;}
  function setLayer(img,src){if(!img)return;if(!src){img.hidden=true;img.removeAttribute('src');img.dataset.assetSrc='';img.dataset.assetState='none';return;}if(img.dataset.assetSrc===src&&['loaded','loading','missing'].includes(img.dataset.assetState))return;img.dataset.assetSrc=src;img.dataset.assetState='loading';img.hidden=true;img.onload=()=>{if(img.dataset.assetSrc!==src)return;img.dataset.assetState='loaded';img.hidden=false;};img.onerror=()=>{if(img.dataset.assetSrc!==src)return;img.dataset.assetState='missing';img.hidden=true;};img.src=src;}
  const isTestMode=()=>document.body.classList.contains('test-mode');
  function loadRewardState(){if(rewardState)return;try{const raw=JSON.parse(localStorage.getItem(REWARD_KEY)||'null');if(raw&&typeof raw==='object'&&raw.packs)rewardState=raw;}catch(_){}if(!rewardState)rewardState={packs:{}};}
  function saveRewardState(){if(!rewardState||isTestMode())return;try{localStorage.setItem(REWARD_KEY,JSON.stringify(rewardState));}catch(_){}}
  function packRewardState(current){loadRewardState();const key=activePackKey();if(!rewardState.packs[key]){rewardState.packs[key]={...current};saveRewardState();}return rewardState.packs[key];}
  function toast(events){if(!events.length||isTestMode())return;let msg='';if(events.length===1){const e=events[0];msg=e.stage===1?`${ICONS[e.kind]}「${e.name}」を手に入れた！`:e.stage===7?`${ICONS[e.kind]}「${e.name}」まで育った！`:`${ICONS[e.kind]} ${LABELS[e.kind]}が「${e.name}」になった！`;}else msg=`✨ 装備が${events.length}つ成長した！ `+events.map(e=>`${ICONS[e.kind]} ${e.name}`).join(' / ');try{if(typeof notify==='function'){notify(msg);return;}}catch(_){}const t=document.getElementById('toast');if(t){t.textContent=msg;t.hidden=false;setTimeout(()=>t.hidden=true,4400);}}
  function updateReward(current){if(isTestMode())return;const stored=packRewardState(current),events=[];for(const kind of ['shoes','shield','sword']){const prev=Number(stored[kind])||0,now=current[kind];if(now<prev)stored[kind]=now;else if(now>prev){stored[kind]=now;events.push({kind,stage:now,name:NAMES[kind][now-1]});}}saveRewardState();toast(events);}
  function updateCard(kind,count,total,stage){const cfg=ASSETS[kind],nameEl=document.getElementById(cfg.nameId),nextEl=document.getElementById(cfg.nextId),card=nameEl?.closest('.gear-card'),name=stage===0?'装備なし':NAMES[kind][stage-1];if(nameEl&&nameEl.textContent!==name)nameEl.textContent=name;if(card){card.dataset.visualTier=String(stage);card.style.setProperty('--tier',String(stage));}if(nextEl){const thresholds=thresholdsFor(kind,total);let txt='';if(stage>=7||count>=total)txt='この装備は、ここまで来た ✓';else{const next=thresholds[stage];txt=stage===0?`あと${Math.max(0,next-count)}語で「${NAMES[kind][0]}」`:`次まであと${Math.max(0,next-count)}語`;}if(nextEl.textContent!==txt)nextEl.textContent=txt;}}
  function render(){renderQueued=false;if(!prepareStack())return;const current={};for(const kind of ['shoes','shield','sword']){const cfg=ASSETS[kind],p=parseProgress(cfg.progressId),stage=stageFor(kind,p.count,p.total);current[kind]=stage;updateCard(kind,p.count,p.total,stage);const img=document.getElementById(cfg.layerId);stage===0?setLayer(img,''):setLayer(img,cfg.path(PERCENTS[stage-1]));}updateReward(current);}
  function queueRender(){if(renderQueued)return;renderQueued=true;requestAnimationFrame(render);}
  function addTestPresets(){const root=document.getElementById('test-presets');if(!root||root.dataset.earlyGearPresets==='1')return;root.dataset.earlyGearPresets='1';const existing=new Set([...root.querySelectorAll('button[data-count]')].map(b=>Number(b.dataset.count)));[3,5,8].forEach(n=>{if(existing.has(n))return;const b=document.createElement('button');b.type='button';b.dataset.count=String(n);b.textContent=String(n);b.title=n===3?'靴の初期装備':n===5?'盾の初期装備':'剣の初期装備';b.addEventListener('click',()=>{if(!document.body.classList.contains('test-mode'))return;try{if(typeof applyTestProgress==='function')applyTestProgress(n,n,n,n);}catch(_){}});const before=[...root.querySelectorAll('button[data-count]')].find(x=>Number(x.dataset.count)>n);before?root.insertBefore(b,before):root.appendChild(b);});}
  function startObserver(){const grid=document.getElementById('gear-grid');if(grid){const o=new MutationObserver(queueRender);o.observe(grid,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['data-tier']});}const map=document.getElementById('map-track');if(map){const mo=new MutationObserver(queueRender);mo.observe(map,{subtree:true,childList:true,characterData:true});}const bo=new MutationObserver(queueRender);bo.observe(document.body,{attributes:true,attributeFilter:['class']});}
  function init(){if(document.documentElement.dataset.gearLayerReady==='1')return;document.documentElement.dataset.gearLayerReady='1';injectStyle();prepareStack();addTestPresets();render();startObserver();requestAnimationFrame(render);setTimeout(render,150);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
