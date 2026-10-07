'use strict';

(() => {
  const PERCENTS = [0, 5, 15, 30, 50, 75, 100];

  const THRESHOLDS = {
    shoes:  [3, 15, 43, 86, 143, 215, 286],
    shield: [5, 15, 43, 86, 143, 215, 286],
    sword:  [8, 15, 43, 86, 143, 215, 286]
  };

  const NAMES = {
    shoes: [
      'いつものスニーカー','ちょっと軽いくつ','よく歩けるくつ',
      '遠くまで行けそうなくつ','かなり歩いたブーツ','本番前のブーツ','ここまで歩いたくつ'
    ],
    shield: [
      '小さなたて','少し安心なたて','ちゃんと守れるたて',
      '頼りになるたて','けっこう安心なたて','本番に持っていくたて','だいじょうぶなたて'
    ],
    sword: [
      'はじめのつるぎ','手になじんできたつるぎ','ちゃんと使えるつるぎ',
      '頼りになるつるぎ','けっこうやれるつるぎ','本番に持っていくつるぎ','これならいけるつるぎ'
    ]
  };

  const ICONS = { shoes:'👟', shield:'🛡', sword:'⚔' };
  const LABELS = { shoes:'くつ', shield:'たて', sword:'つるぎ' };

  const ASSETS = {
    hero:'./assets/hero/hero_base_front.png',
    shoes:{
      progressId:'gear-shoes-progress', nameId:'gear-shoes-name', nextId:'gear-shoes-next',
      layerId:'hero-shoes-layer', path:p=>`./assets/equipment/shoes/shoes_${p}.png`
    },
    shield:{
      progressId:'gear-shield-progress', nameId:'gear-shield-name', nextId:'gear-shield-next',
      layerId:'hero-shield-layer', path:p=>`./assets/equipment/shields/shield_${p}.png`
    },
    sword:{
      progressId:'gear-sword-progress', nameId:'gear-sword-name', nextId:'gear-sword-next',
      layerId:'hero-sword-layer', path:p=>`./assets/equipment/swords/sword_${p}.png`
    }
  };

  const REWARD_KEY = 'english-quest-gear-reward-v1';
  let rewardLoaded = false;
  let rewardState = null;
  let renderQueued = false;

  function injectStyle(){
    if(document.getElementById('gear-layer-style')) return;
    const style=document.createElement('style');
    style.id='gear-layer-style';
    style.textContent=`
      .hero-gear-badges{display:none!important}
      .avatar-wrap,.hero-visual{overflow:visible!important}
      .hero-sprite-stack{
        position:relative;width:min(100%,220px);aspect-ratio:1/1;display:block;flex:0 0 auto
      }
      .hero-sprite-stack .hero-sprite{
        position:absolute!important;inset:0!important;display:block;
        width:100%!important;height:100%!important;max-width:none!important;
        object-fit:contain!important;image-rendering:pixelated!important;pointer-events:none
      }
      .hero-sprite-stack .hero-base{z-index:1}
      .hero-sprite-stack .hero-outfit-layer{z-index:2}
      .hero-sprite-stack .hero-shoes-layer{z-index:3}
      .hero-sprite-stack .hero-shield-layer{z-index:4}
      .hero-sprite-stack .hero-sword-layer{z-index:5;transform:translateX(-16%)!important}
      .hero-sprite-stack .hero-sprite[hidden]{display:none!important}
      .gear-card[data-visual-tier="0"]::after{width:0!important}
      @media(max-width:680px){.hero-sprite-stack{width:min(100%,205px)}}
    `;
    document.head.appendChild(style);
  }

  function makeLayer(id,cls){
    const img=document.createElement('img');
    img.id=id; img.className=`hero-sprite ${cls}`;
    img.alt=''; img.setAttribute('aria-hidden','true'); img.hidden=true; img.decoding='async';
    return img;
  }

  function prepareStack(){
    const visual=document.querySelector('.hero-visual');
    const base=document.getElementById('hero-key');
    if(!visual||!base) return null;

    let stack=document.getElementById('hero-sprite-stack');
    if(stack) return stack;

    stack=document.createElement('div');
    stack.id='hero-sprite-stack';
    stack.className='hero-sprite-stack';
    stack.setAttribute('aria-label',base.alt||'街の冒険少年');

    const fallback=base.getAttribute('src')||'./hero-key.png';
    base.dataset.fallbackSrc=fallback;
    base.classList.add('hero-sprite','hero-base');

    visual.insertBefore(stack,base);
    stack.appendChild(base);

    [
      makeLayer('hero-outfit-layer','hero-outfit-layer'),
      makeLayer('hero-shoes-layer','hero-shoes-layer'),
      makeLayer('hero-shield-layer','hero-shield-layer'),
      makeLayer('hero-sword-layer','hero-sword-layer')
    ].forEach(x=>stack.appendChild(x));

    base.onerror=()=>{
      if(base.dataset.usingFallback==='1') return;
      base.dataset.usingFallback='1';
      base.src=base.dataset.fallbackSrc;
    };
    base.src=ASSETS.hero;
    return stack;
  }

  function parseCount(id){
    const node=document.getElementById(id);
    const m=String(node?.textContent||'').match(/\d+/);
    return m?Number(m[0]):0;
  }

  function stageFor(kind,count){
    let stage=0;
    THRESHOLDS[kind].forEach((t,i)=>{ if(count>=t) stage=i+1; });
    return stage;
  }

  function setLayer(img,src){
    if(!img) return;
    if(!src){
      img.hidden=true;
      img.removeAttribute('src');
      img.dataset.assetSrc='';
      img.dataset.assetState='none';
      return;
    }
    if(img.dataset.assetSrc===src && ['loaded','loading','missing'].includes(img.dataset.assetState)) return;

    img.dataset.assetSrc=src;
    img.dataset.assetState='loading';
    img.hidden=true;

    img.onload=()=>{
      if(img.dataset.assetSrc!==src) return;
      img.dataset.assetState='loaded';
      img.hidden=false;
    };
    img.onerror=()=>{
      if(img.dataset.assetSrc!==src) return;
      img.dataset.assetState='missing';
      img.hidden=true;
    };
    img.src=src;
  }

  function isTestMode(){
    return document.body.classList.contains('test-mode');
  }

  function saveReward(){
    if(!rewardState || isTestMode()) return;
    try{ localStorage.setItem(REWARD_KEY,JSON.stringify(rewardState)); }catch(_){}
  }

  function loadReward(current){
    if(rewardLoaded) return;
    rewardLoaded=true;
    try{
      const raw=JSON.parse(localStorage.getItem(REWARD_KEY)||'null');
      if(raw && typeof raw==='object'){
        rewardState={
          shoes:Number(raw.shoes)||0,
          shield:Number(raw.shield)||0,
          sword:Number(raw.sword)||0
        };
      }
    }catch(_){}
    if(!rewardState){
      rewardState={...current};
      saveReward();
    }
  }

  function toast(events){
    if(!events.length || isTestMode()) return;

    let msg='';
    if(events.length===1){
      const e=events[0];
      if(e.stage===1) msg=`${ICONS[e.kind]}「${e.name}」を手に入れた！`;
      else if(e.stage===7) msg=`${ICONS[e.kind]}「${e.name}」まで育った！`;
      else msg=`${ICONS[e.kind]} ${LABELS[e.kind]}が「${e.name}」になった！`;
    }else{
      msg=`✨ 装備が${events.length}つ成長した！ `+
        events.map(e=>`${ICONS[e.kind]} ${e.name}`).join(' / ');
    }

    try{
      if(typeof notify==='function'){ notify(msg); return; }
    }catch(_){}

    const t=document.getElementById('toast');
    if(t){
      t.textContent=msg; t.hidden=false;
      setTimeout(()=>{t.hidden=true;},4400);
    }
  }

  function updateReward(current){
    if(isTestMode()) return;
    loadReward(current);

    const events=[];
    for(const kind of ['shoes','shield','sword']){
      const prev=Number(rewardState[kind])||0;
      const now=current[kind];

      if(now<prev){
        rewardState[kind]=now;
      }else if(now>prev){
        rewardState[kind]=now;
        events.push({kind,stage:now,name:NAMES[kind][now-1]});
      }
    }
    saveReward();
    toast(events);
  }

  function updateCard(kind,count,stage){
    const cfg=ASSETS[kind];
    const nameEl=document.getElementById(cfg.nameId);
    const nextEl=document.getElementById(cfg.nextId);
    const card=nameEl?.closest('.gear-card');

    const name=stage===0?'装備なし':NAMES[kind][stage-1];
    if(nameEl && nameEl.textContent!==name) nameEl.textContent=name;

    if(card){
      card.dataset.visualTier=String(stage);
      card.style.setProperty('--tier',String(stage));
    }

    if(nextEl){
      const thresholds=THRESHOLDS[kind];
      let txt='';
      if(stage>=7){
        txt='この装備は、ここまで来た ✓';
      }else{
        const next=thresholds[stage];
        if(stage===0){
          txt=`あと${Math.max(0,next-count)}語で「${NAMES[kind][0]}」`;
        }else{
          txt=`次まであと${Math.max(0,next-count)}語`;
        }
      }
      if(nextEl.textContent!==txt) nextEl.textContent=txt;
    }
  }

  function render(){
    renderQueued=false;
    if(!prepareStack()) return;

    const current={};

    for(const kind of ['shoes','shield','sword']){
      const cfg=ASSETS[kind];
      const count=parseCount(cfg.progressId);
      const stage=stageFor(kind,count);
      current[kind]=stage;

      updateCard(kind,count,stage);

      const img=document.getElementById(cfg.layerId);
      if(stage===0) setLayer(img,'');
      else setLayer(img,cfg.path(PERCENTS[stage-1]));
    }

    updateReward(current);
  }

  function queueRender(){
    if(renderQueued) return;
    renderQueued=true;
    requestAnimationFrame(render);
  }

  function addTestPresets(){
    const root=document.getElementById('test-presets');
    if(!root || root.dataset.earlyGearPresets==='1') return;
    root.dataset.earlyGearPresets='1';

    const existing=new Set([...root.querySelectorAll('button[data-count]')].map(b=>Number(b.dataset.count)));

    [3,5,8].forEach(n=>{
      if(existing.has(n)) return;
      const b=document.createElement('button');
      b.type='button';
      b.dataset.count=String(n);
      b.textContent=String(n);
      b.title=n===3?'靴の初期装備':n===5?'盾の初期装備':'剣の初期装備';

      b.addEventListener('click',()=>{
        if(!document.body.classList.contains('test-mode')) return;
        try{
          if(typeof applyTestProgress==='function') applyTestProgress(n,n,n,n);
        }catch(_){}
      });

      const before=[...root.querySelectorAll('button[data-count]')].find(x=>Number(x.dataset.count)>n);
      if(before) root.insertBefore(b,before);
      else root.appendChild(b);
    });
  }

  function startObserver(){
    const grid=document.getElementById('gear-grid');
    if(grid){
      const o=new MutationObserver(queueRender);
      o.observe(grid,{
        subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['data-tier']
      });
    }

    const bodyO=new MutationObserver(queueRender);
    bodyO.observe(document.body,{attributes:true,attributeFilter:['class']});
  }

  function init(){
    if(document.documentElement.dataset.gearLayerReady==='1') return;
    document.documentElement.dataset.gearLayerReady='1';

    injectStyle();
    prepareStack();
    addTestPresets();
    render();
    startObserver();
    requestAnimationFrame(render);
    setTimeout(render,150);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();
