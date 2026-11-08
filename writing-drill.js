'use strict';

/*
 * ENGLISH QUEST — WRITING DRILL v1.8.1
 * Load LAST, after toeic-steps.js.
 * Adds an optional copy-three-times + closed-book spelling drill.
 * No change to XP, crowns, due dates, history, player storage or packs.
 */
(() => {
  if (window.EnglishQuestWritingDrill) return;

  const NAME = '書き取り特訓';
  const MAX_WORDS = 5;
  let controller = null;
  let selected = new Set();
  let wordPool = [];
  let drill = null;

  const byId = id => document.getElementById(id);
  const element = (tag, cls, content) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (content !== undefined) n.textContent = String(content);
    return n;
  };
  const getCourse = () => window.EnglishQuestCourses || null;
  const knownWord = id => WORDS.find(w => w.id === id);
  const todayStr = () => typeof today === 'function' ? today() : new Date().toISOString().slice(0,10);

  function activeWords() {
    const api = getCourse();
    if (api?.getActivePack && api?.wordsForPack) {
      return api.wordsForPack(api.getActivePack());
    }
    return WORDS.filter(w => (w.programs || []).includes(4));
  }

  function scoreFor(word) {
    const rec = state?.records?.[word.id];
    if (!rec) return 0;
    const errors = Math.max(0, (rec.attempts || 0) - (rec.correct || 0));
    const recent = state.history?.slice(-150).filter(h => h.id === word.id && !h.correct).length || 0;
    return (rec.misspellCount || 0) * 100 + recent * 15 + errors * 10 +
      (rec.attempts > 0 && !rec.mastered ? 2 : 0);
  }

  function orderedPool() {
    return activeWords().filter(w => w && state?.records?.[w.id]).sort((a,b) =>
      scoreFor(b) - scoreFor(a) ||
      (state.records[b.id].attempts || 0) - (state.records[a.id].attempts || 0) ||
      a.en.localeCompare(b.en));
  }

  function safeInput(input) {
    if (!(input instanceof HTMLInputElement)) return;
    if (!['text','search'].includes(input.type)) return;
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('spellcheck', 'false');
    input.spellcheck = false;
  }

  function processInputs(root) {
    if (root instanceof HTMLInputElement) safeInput(root);
    if (root.querySelectorAll) root.querySelectorAll('input').forEach(safeInput);
  }

  function installInputProtection() {
    processInputs(document);
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) processInputs(node);
        }
      }
    });
    observer.observe(document.body, {subtree:true, childList:true});
  }

  function createModal() {
    const overlay = element('div','eqwd-overlay');
    overlay.id = 'eqwd-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="eqwd-card" role="dialog" aria-modal="true" aria-labelledby="eqwd-title">
        <header class="eqwd-header">
          <div><small>ENGLISH QUEST · SPECIAL TRAINING</small><h2 id="eqwd-title">✍️ 書き取り特訓</h2></div>
          <button type="button" class="eqwd-close" id="eqwd-close" aria-label="閉じる">✕ 閉じる</button>
        </header>
        <div id="eqwd-body"></div>
      </section>`;
    document.body.appendChild(overlay);
    byId('eqwd-close').addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !overlay.hidden) close();
    });
  }

  function open() {
    const overlay = byId('eqwd-overlay');
    overlay.hidden = false;
    document.body.classList.add('eqwd-open');
  }

  function close() {
    const overlay = byId('eqwd-overlay');
    if (overlay) overlay.hidden = true;
    document.body.classList.remove('eqwd-open');
    drill = null;
  }

  function addPanels() {
    const featured = document.querySelector('#home .featured');
    if (featured && !byId('eqwd-home')) {
      const section = element('section','panel eqwd-teaser');
      section.id = 'eqwd-home';
      section.innerHTML = `<div class="panel-label">SPECIAL TRAINING</div>
          <h2>✍️ 苦手単語の書き取り特訓</h2>
          <p>お手本を見ながら3回。次は見ずに書けるかな？ 好きなときに練習できます。</p>`;
      const b = element('button','secondary full','苦手単語を選んで特訓 →');
      b.type = 'button'; b.addEventListener('click', () => openPicker('weak'));
      section.appendChild(b);
      featured.insertAdjacentElement('afterend', section);
    }

    const result = document.querySelector('#result .result-stats');
    if (result && !byId('eqwd-result')) {
      const section = element('section','panel eqwd-teaser');
      section.id = 'eqwd-result';
      section.innerHTML = `<div class="panel-label">AFTER QUEST</div>
          <h2>✍️ 今日の単語を書いてみる？</h2>
          <p>今日取り組んだ単語をお手本で練習。そのあと、見ずに書くことにも挑戦できます。</p>`;
      const b = element('button','secondary full','今回の単語で特訓 →');
      b.type = 'button'; b.addEventListener('click', () => openPicker('session'));
      section.appendChild(b);
      result.insertAdjacentElement('afterend',section);
    }
  }

  function openPicker(source='weak') {
    if (typeof testMode !== 'undefined' && testMode) {
      if (typeof notify === 'function') notify('TEST MODEを終了してから書き取り特訓を使ってください。');
      return;
    }
    wordPool = orderedPool();
    selected = new Set();
    drill = null;

    const fromSession = source === 'session' && Array.isArray(session?.tasks)
      ? [...new Set(session.tasks.map(t => t.id))].filter(id => wordPool.some(w=>w.id===id))
      : [];

    if (fromSession.length) {
      fromSession.slice(0,MAX_WORDS).forEach(id=>selected.add(id));
    } else {
      const known = wordPool.filter(w => state.records[w.id]?.attempts > 0);
      const candidates = known.length ? known : wordPool;
      candidates.slice(0,MAX_WORDS).forEach(w=>selected.add(w.id));
    }

    open();
    renderPicker();
  }

  function renderPicker() {
    const root = byId('eqwd-body');
    root.replaceChildren();

    const instructions = element('p','eqwd-muted',
      `現在の教材から、最大${MAX_WORDS}語を選べます。ミスが多い単語を上に表示しています。`);
    const search = element('input','eqwd-search');
    search.type='search';search.placeholder='単語を検索（例：different）';
    search.setAttribute('aria-label','特訓する単語を検索');
    safeInput(search);
    const count = element('p','eqwd-count');
    const list = element('div','eqwd-picker-list');
    const start = element('button','eqwd-primary');
    start.type='button';start.addEventListener('click',startDrill);
    const note = element('p','eqwd-muted',
      '特訓は練習専用です。EXP・王冠・復習日には影響しません。');
    root.append(instructions,search,count,list,start,note);

    function drawList() {
      const query = search.value.trim().toLowerCase();
      list.replaceChildren();
      const results = wordPool.filter(w =>
        w.en.toLowerCase().includes(query) || w.jp.includes(query));
      const shown = results.slice(0,50);
      if (!shown.length) list.append(element('p','eqwd-muted',
        wordPool.length ? '条件に合う単語がありません。' : 'この教材にはまだ単語がありません。'));
      shown.forEach(w => {
        const label = element('label','eqwd-word');
        const check = element('input');check.type='checkbox';check.checked=selected.has(w.id);
        check.addEventListener('change', () => {
          if (check.checked) {
            if (selected.size >= MAX_WORDS) {
              check.checked=false;
              if (typeof notify==='function') notify(`一度に選べるのは${MAX_WORDS}語までです。`);
              return;
            }
            selected.add(w.id);
          } else selected.delete(w.id);
          refreshCount();
        });
        const content = element('div');
        content.append(element('strong','',w.en),element('small','',w.jp));
        const tag = element('span','eqwd-tag',scoreFor(w) > 0 ? '復習候補' : '新しい語');
        label.append(check,content,tag);
        list.append(label);
      });
      if (results.length > shown.length) {
        list.append(element('small','eqwd-muted',
          `検索結果は先頭${shown.length}語を表示中。検索で絞り込めます。`));
      }
      refreshCount();
    }
    function refreshCount() {
      count.textContent=`選択中：${selected.size} / ${MAX_WORDS}語`;
      start.textContent=`${selected.size}語の書き取りを始める →`;
      start.disabled=selected.size===0;
    }
    search.addEventListener('input',drawList);
    drawList();
  }

  function startDrill() {
    const words = [...selected].map(knownWord).filter(Boolean);
    if (!words.length) return;
    drill = {words,index:0,copyCount:0,blindCount:0,blindCorrect:0,phase:'copy'};
    renderDrill();
  }

  function goNextWord() {
    drill.index += 1;
    drill.copyCount = 0;
    drill.phase = 'copy';
    renderDrill();
  }

  function renderDrill() {
    const root=byId('eqwd-body');
    root.replaceChildren();
    if (!drill) return;
    if (drill.index >= drill.words.length) {
      renderSummary();
      return;
    }
    const word=drill.words[drill.index];
    const head=element('div','eqwd-progress');
    head.append(element('span','',`${drill.index+1} / ${drill.words.length}語`),
      element('span','',drill.phase === 'blind' ? '見ずに書く' : `見ながら書く ${drill.copyCount}/3`));
    root.append(head);
    if (drill.phase === 'copy') renderCopy(root,word);
    if (drill.phase === 'choice') renderChoice(root,word);
    if (drill.phase === 'blind') renderBlind(root,word);
    if (drill.phase === 'graded') renderGraded(root,word);
  }

  function renderCopy(root,word) {
    const prompt=element('div','eqwd-prompt');
    prompt.append(element('span','eqwd-eyebrow','お手本を見ながら書こう'),
      element('strong','eqwd-english',word.en),element('small','',word.jp));
    const info=element('p','eqwd-muted',
      '英語を見ながら入力しよう。正しく書けたら1回分クリア。');
    const form=element('form','eqwd-form');
    const input=element('input','eqwd-typed');
    input.type='text';input.placeholder='つづりを入力';input.setAttribute('aria-label','英単語の書き取り');safeInput(input);
    const submit=element('button','eqwd-primary',`${drill.copyCount+1}回目をチェック`);
    submit.type='submit';
    const feedback=element('div','eqwd-feedback');feedback.hidden=true;
    form.append(input,submit);
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if (!input.value.trim()) return;
      if (isTypedCorrect(input.value,word)) {
        drill.copyCount++;
        drill.phase=drill.copyCount >= 3 ? 'choice' : 'copy';
        renderDrill();
      } else {
        feedback.hidden=false;
        feedback.className='eqwd-feedback eqwd-wrong';
        feedback.textContent=`もう一度お手本を見よう。 ${typeof spellingHint==='function' ? spellingHint(input.value,word.en) : `正解：${word.en}`}`;
        input.focus();input.select();
      }
    });
    root.append(prompt,info,form,feedback);
  }

  function renderChoice(root,word) {
    const prompt=element('div','eqwd-prompt');
    prompt.append(element('span','eqwd-eyebrow','3回書けた！'),
      element('strong','eqwd-english',word.en),element('small','',word.jp));
    const text=element('p','eqwd-muted',
      'ここで終えてもOK。お手本を隠して、記憶だけで書くことにも挑戦できるよ。');
    const row=element('div','eqwd-actions');
    const finish=element('button','eqwd-secondary','この単語は終了');
    finish.type='button';finish.addEventListener('click',goNextWord);
    const blind=element('button','eqwd-primary','見ずに書く →');
    blind.type='button';blind.addEventListener('click',()=>{drill.phase='blind';renderDrill();});
    row.append(finish,blind);root.append(prompt,text,row);
  }

  function renderBlind(root,word) {
    // No English spelling is rendered during closed-book answering.
    const prompt=element('div','eqwd-prompt');
    prompt.append(element('span','eqwd-eyebrow','お手本は隠しています'),
      element('strong','eqwd-japanese',word.jp),
      element('small','','')); // intentionally no written English
    const info=element('p','eqwd-muted','つづりを思い出して、見ずに書こう。');
    const form=element('form','eqwd-form');
    const input=element('input','eqwd-typed');
    input.type='text';input.placeholder='答えの英語を入力';input.setAttribute('aria-label','見ずに英単語を書く');safeInput(input);
    const submit=element('button','eqwd-primary','答え合わせ');submit.type='submit';
    form.append(input,submit);
    form.addEventListener('submit',e=>{
      e.preventDefault();if (!input.value.trim()) return;
      drill.blindCount++;
      drill.lastBlindAnswer=input.value;
      drill.lastBlindCorrect=isTypedCorrect(input.value,word);
      if (drill.lastBlindCorrect) drill.blindCorrect++;
      drill.phase='graded';
      renderDrill();
    });
    root.append(prompt,info,form);
  }

  function renderGraded(root,word) {
    const correct=drill.lastBlindCorrect;
    const prompt=element('div','eqwd-prompt');
    prompt.append(element('span','eqwd-eyebrow',correct?'🎉 正解！':'惜しい、ここを確認'),
      element('strong','eqwd-english',word.en),element('small','',word.jp));
    const feedback=element('p',`eqwd-feedback ${correct?'eqwd-right':'eqwd-wrong'}`,
      correct?'見ずに書けたね！':
        (typeof spellingHint==='function' ? spellingHint(drill.lastBlindAnswer,word.en) : `正解：${word.en}`));
    const row=element('div','eqwd-actions');
    const next=element('button','eqwd-primary',
      drill.index===drill.words.length-1?'特訓の結果へ →':'次の単語へ →');
    next.type='button';next.addEventListener('click',goNextWord);
    row.append(next);
    if(!correct){
      const again=element('button','eqwd-secondary','もう一度見ずに書く');
      again.type='button';again.addEventListener('click',()=>{drill.phase='blind';renderDrill();});
      row.prepend(again);
    }
    root.append(prompt,feedback,row);
  }

  function renderSummary() {
    const root=byId('eqwd-body');
    root.replaceChildren();
    const wrap=element('div','eqwd-summary');
    wrap.append(element('div','eqwd-celebrate','✍️'),
      element('h3','',`${NAME} 完了！`),
      element('p','',`${drill.words.length}語を見ながら3回ずつ練習しました。`),
      element('p','',`見ずに書く：${drill.blindCorrect} / ${drill.blindCount}回 正解`),
      element('p','eqwd-muted','学習記録・EXP・王冠・復習予定日は変更していません。'));
    const actions=element('div','eqwd-actions');
    const repeat=element('button','eqwd-secondary','もう一度練習');
    repeat.type='button';repeat.addEventListener('click',()=>{drill.index=0;drill.copyCount=0;drill.blindCount=0;drill.blindCorrect=0;drill.phase='copy';renderDrill();});
    const done=element('button','eqwd-primary','終了する');done.type='button';done.addEventListener('click',close);
    actions.append(repeat,done);root.append(wrap,actions);
  }

  function addStyles() {
    if (byId('eqwd-styles')) return;
    const style=element('style');style.id='eqwd-styles';
    style.textContent=`
      body.eqwd-open{overflow:hidden}
      .eqwd-teaser{margin-top:15px}
      .eqwd-teaser p{font-size:14px;color:#66768b;line-height:1.6;margin:8px 0 16px}
      .eqwd-overlay{position:fixed;inset:0;z-index:650;display:grid;place-items:center;padding:12px;background:rgba(14,21,42,.78);backdrop-filter:blur(2px)}
      .eqwd-overlay[hidden]{display:none!important}
      .eqwd-card{width:min(100%,690px);max-height:94dvh;overflow-y:auto;background:#fffdf8;color:#233751;padding:clamp(16px,4vw,28px);border-radius:22px;box-shadow:0 24px 60px rgba(0,0,0,.27)}
      .eqwd-header{display:flex;align-items:start;justify-content:space-between;gap:12px;margin-bottom:18px}
      .eqwd-header small{font-size:10px;color:#9e7c25;font-weight:900;letter-spacing:.09em}
      .eqwd-header h2{margin:5px 0;font-size:clamp(22px,5vw,27px)}
      .eqwd-close{border:1px solid #d7dce6;border-radius:10px;color:#4b5c76;background:#fff;padding:10px;cursor:pointer}
      .eqwd-muted{font-size:13px;color:#67778c;line-height:1.65;margin:10px 0}
      .eqwd-search,.eqwd-typed{box-sizing:border-box;width:100%;min-width:0;padding:13px 14px;border:1.5px solid #bfcadc;border-radius:11px;background:#fff;color:#24354d;font-size:18px}
      .eqwd-picker-list{border:1px solid #e0e5ee;border-radius:12px;max-height:min(44vh,420px);overflow:auto;margin:10px 0;padding:5px}
      .eqwd-word{display:flex;gap:12px;align-items:center;padding:11px 9px;border-bottom:1px solid #edf0f4;cursor:pointer}
      .eqwd-word:last-child{border-bottom:0}.eqwd-word input{width:19px;height:19px;flex:0 0 auto}
      .eqwd-word div{flex:1;min-width:0}.eqwd-word strong{display:block;word-break:break-word;font-size:15px}
      .eqwd-word small{display:block;margin-top:3px;color:#7a8798;font-size:12px;line-height:1.45}
      .eqwd-tag{flex:0 0 auto;border-radius:999px;background:#f4f0df;color:#8a702d;padding:5px 7px;font-size:10px;font-weight:900}
      .eqwd-count{font-size:12px;font-weight:850;margin:10px 0;color:#586c8b}
      .eqwd-primary,.eqwd-secondary{display:block;width:100%;min-height:48px;border-radius:12px;padding:11px 15px;font-size:14px;font-weight:900;cursor:pointer}
      .eqwd-primary{background:#3553b6;color:#fff;border:0}.eqwd-primary:disabled{opacity:.5;cursor:not-allowed}
      .eqwd-secondary{background:#fff;border:1px solid #bdcbe0;color:#3b5080}
      .eqwd-progress{display:flex;justify-content:space-between;gap:10px;color:#718097;font-size:12px;font-weight:900;margin:8px 0 16px}
      .eqwd-prompt{border-radius:16px;background:#edf1f9;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:26px 15px;text-align:center}
      .eqwd-eyebrow{font-size:11px;letter-spacing:.1em;font-weight:900;color:#657793}
      .eqwd-english{font-size:clamp(26px,6vw,39px);word-break:break-word;color:#253d7a}
      .eqwd-japanese{font-size:clamp(22px,5vw,30px);line-height:1.5;color:#253d7a}
      .eqwd-prompt small{font-size:15px;color:#5c6b84;line-height:1.5}
      .eqwd-form{display:flex;flex-direction:column;gap:10px;margin-top:14px}
      .eqwd-feedback{padding:13px 15px;margin:14px 0;border-radius:12px;line-height:1.6;font-size:14px}
      .eqwd-wrong{background:#fff1ed;color:#8d3e29}.eqwd-right{background:#e8f6ee;color:#236544}
      .eqwd-actions{display:flex;gap:10px;margin:18px 0 4px}.eqwd-actions>*{flex:1;min-width:0}
      .eqwd-summary{text-align:center}.eqwd-summary h3{font-size:22px}
      .eqwd-summary p{line-height:1.6}.eqwd-celebrate{font-size:52px;margin:10px}
      @media(max-width:390px){.eqwd-actions{flex-direction:column}.eqwd-tag{display:none}}
    `;
    document.head.appendChild(style);
  }

  function init() {
    addStyles();createModal();addPanels();installInputProtection();
    const version = document.querySelector('.topbar .version');
    if (version) version.textContent = 'v1.8.1 · FAMILY DATA';
  }

  if (document.readyState === 'complete') init();
  else document.addEventListener('DOMContentLoaded',init,{once:true});

  window.EnglishQuestWritingDrill={version:'1.8.1',openPicker};
})();
