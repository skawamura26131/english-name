'use strict';
/*
 * ENGLISH QUEST — TOEIC STEPS v1.8.0
 * Small, opt-in extension loaded LAST, after boss-layer.js.
 *
 * Only TOEIC packs are affected. Core save, migration, PLAYER and crown
 * rules are unchanged. Stage 4 results are normal state.history events,
 * so existing JSON backup/import and FAMILY DATA v2 retain them.
 */
(() => {
  if (window.EnglishQuestToeicStepsV18) return;

  const STEP4_MODES = {listen:'sentence-listen', read:'sentence-read'};
  let lastTask = null;
  let stage3Mode = null;
  let stage3Answered = false;
  let challenge = null;

  function courseApi() { return window.EnglishQuestCourses || null; }
  function activeToeic() {
    const p = courseApi()?.getActivePack?.();
    return !!p && p.group === 'adult' && p.id.startsWith('toeic');
  }
  function activeWords() {
    const api = courseApi();
    const pack = api?.getActivePack?.();
    return api?.wordsForPack?.(pack) || [];
  }
  function supportsSpeech() {
    return typeof window.speechSynthesis !== 'undefined' &&
      typeof window.SpeechSynthesisUtterance !== 'undefined';
  }
  function play(text) {
    if (!supportsSpeech()) return false;
    try {
      window.speechSynthesis.cancel();
      const u = new window.SpeechSynthesisUtterance(text);
      u.lang = 'en-US'; u.rate = .85; u.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => /^en-US/i.test(v.lang)) ||
        voices.find(v => /^en/i.test(v.lang));
      if (voice) u.voice = voice;
      window.speechSynthesis.speak(u);
      return true;
    } catch (e) {
      console.warn('TOEIC STEPS: voice playback unavailable', e);
      return false;
    }
  }
  const cleanVoiceText = word => String(word.tts || word.en)
    .replace(/\s*~\s*/g, ' ').replace(/\s+/g,' ').trim();
  function button(label, cls='') {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = label;
    if (cls) b.className = cls;
    return b;
  }
  function optionsForTarget(target, candidates, field) {
    const used = new Set([target[field]]);
    const others = shuffle(candidates.filter(w => w.id !== target.id))
      .filter(w => {
        const value = w[field];
        if (typeof value !== 'string' || !value.trim() || used.has(value)) return false;
        used.add(value); return true;
      }).slice(0,3);
    return shuffle([target, ...others]);
  }
  function isCrownFinal(word, task) {
    const rec = state.records[word.id];
    return task?.stage === 3 && task?.mode === 'mixed' &&
      !rec?.mastered && rec?.streak >= 2;
  }

  // STEP 3: retain the original typing exercise and complete() mechanics.
  // For listening questions, replace only the visible answer widget.
  const originalRenderQuestion = renderQuestion;
  renderQuestion = function toeicStep3Render() {
    originalRenderQuestion();
    const task = session?.tasks?.[session.index];
    const word = task && wordById(task.id);
    if (!task || !word || !activeToeic() || task.stage !== 3 || testMode) {
      lastTask = null;
      stage3Mode = null;
      return;
    }

    const finalWrite = isCrownFinal(word, task);
    if (lastTask !== task) {
      lastTask = task;
      stage3Answered = false;
      stage3Mode = finalWrite ? 'write'
        : (supportsSpeech() && Math.random() < .5 ? 'listen' : 'write');
    }
    if (finalWrite) stage3Mode = 'write';

    const root = el('answer-area');
    const chooser = document.createElement('div');
    chooser.className = 'eq18-choice';
    const listen = button('🎧 聞く');
    const write = button('✍️ 書く');
    listen.className = stage3Mode === 'listen' ? 'eq18-selected' : '';
    write.className = stage3Mode === 'write' ? 'eq18-selected' : '';
    listen.disabled = finalWrite || !supportsSpeech();
    if (finalWrite) {
      const note = document.createElement('small');
      note.textContent = '👑 王冠の最終確認はスペリングで判定します。';
      chooser.append(note);
    }
    const changeMode = next => {
      if (stage3Answered || stage3Mode === next) return;
      stage3Mode = next;
      renderQuestion();
    };
    listen.addEventListener('click', () => changeMode('listen'));
    write.addEventListener('click', () => changeMode('write'));
    chooser.prepend(listen, write);

    if (stage3Mode === 'listen') {
      root.replaceChildren();
      el('question-stage').textContent = 'STAGE 3 · 聞く';
      el('task-instruction').textContent = '音声だけを聞いて、意味を選ぼう';
      el('question-text').textContent = '🔊 音声を聞いてください';
      el('question-note').textContent = '答えたあとに英単語を確認できます。音を出せないときは「書く」に切り替えよう。';
      const playButton = button('🔊 英単語を再生', 'primary full');
      playButton.addEventListener('click', () => {
        if (play(cleanVoiceText(word))) {
          answers.querySelectorAll('button').forEach(b => { b.disabled = false; });
        } else {
          playButton.textContent = '音声を再生できません。✍️ 書くへ切り替えてください';
          playButton.disabled = true;
          answers.querySelectorAll('button').forEach(b => { b.disabled = true; });
        }
      });
      const answers = document.createElement('div');
      answers.className = 'answer-grid';
      // Same TOEIC pack only: no unrelated school-word distractors.
      optionsForTarget(word, activeWords(), 'jp').forEach(option => {
        const b = button(option.jp, 'answer-btn');
        b.disabled = true; // Listening credit requires playing the audio first.
        b.addEventListener('click', () => {
          if (stage3Answered) return;
          answers.querySelectorAll('button').forEach(x => x.disabled = true);
          b.classList.add(option.id === word.id ? 'right' : 'wrong');
          complete(option.id === word.id, word, `正解：${word.en} = ${word.jp}`);
        });
        answers.append(b);
      });
      root.append(playButton, answers);
    } else {
      el('question-stage').textContent = 'STAGE 3 · 書く';
    }
    root.prepend(chooser);
  };

  // Tag regular history events without changing XP, progress, mastery or due.
  const originalComplete = complete;
  complete = function toeicStep3Complete(correct, word, message) {
    const task = session?.tasks?.[session.index];
    const isToeicStage3 = !testMode && !!word && activeToeic() && task?.stage === 3;
    const countBefore = state.history.length;
    const chosen = stage3Mode;
    const result = originalComplete(correct, word, message);
    if (isToeicStage3 && state.history.length > countBefore) {
      const entry = state.history[state.history.length-1];
      if (entry?.id === word.id && entry.stage === 3) {
        entry.toeicSkill = chosen === 'listen' ? 'word-listening' : 'word-writing';
        persist();
      }
      stage3Answered = true;
      document.querySelectorAll('.eq18-choice button').forEach(b => { b.disabled = true; });
    }
    return result;
  };

  // STEP 4: context listening / text reading. No legacy stage or crown change.
  function exampleWords() {
    return activeWords().filter(w =>
      typeof w.exampleEn === 'string' && w.exampleEn.trim() &&
      typeof w.exampleJa === 'string' && w.exampleJa.trim());
  }
  function step4Ready(w) {
    const rec = state.records[w.id];
    if (!rec?.unlocked) return false;
    // Use the historical STEP 3 date, not today's most recent review date.
    // Otherwise a normal review today would accidentally re-lock STEP 4.
    if (state.history.some(h => h?.id === w.id && h.stage === 3 &&
        h.correct === true && h.day < today())) return true;
    // Conservative fallback for imported backups without old history.
    return (rec.mastered || (rec.stage === 3 && rec.streak >= 1)) &&
      !!rec.lastAttempt && rec.lastAttempt < today();
  }
  function historyOf(wordId, mode, correct=true) {
    return state.history.some(h => h?.id === wordId &&
      h.stage === 4 && h.mode === mode && (correct === null || h.correct === correct));
  }
  function medals() {
    return exampleWords().filter(w => historyOf(w.id,STEP4_MODES.listen)).length;
  }
  function readingCount() {
    return exampleWords().filter(w => historyOf(w.id,STEP4_MODES.read)).length;
  }
  function queue() {
    return shuffle(exampleWords().filter(step4Ready))
      .sort((a,b) => Number(historyOf(a.id,STEP4_MODES.listen)) -
                     Number(historyOf(b.id,STEP4_MODES.listen)))
      .slice(0,5);
  }
  function createPanel() {
    let panel = document.getElementById('eq18-panel');
    if (panel) return panel;
    const quest = document.querySelector('#home .panel.featured');
    if (!quest) return null;
    panel = document.createElement('section');
    panel.id = 'eq18-panel'; panel.className = 'panel eq18-panel';
    panel.innerHTML = '<div class="panel-label">TOEIC PRACTICE</div><h2>STEP 4｜例文で使える英語へ</h2><p class="eq18-desc"></p><p class="eq18-progress"></p>';
    const launch = button('🎧 例文に挑戦する', 'primary');
    launch.id = 'eq18-launch';
    launch.addEventListener('click', () => startStep4());
    panel.append(launch);
    quest.insertAdjacentElement('afterend', panel);
    return panel;
  }
  function refreshPanel() {
    const panel = createPanel();
    if (!panel) return;
    panel.hidden = !activeToeic();
    if (panel.hidden) return;
    const count = exampleWords().length;
    const ready = exampleWords().filter(step4Ready).length;
    panel.querySelector('.eq18-progress').textContent =
      `🏅 実践クリア ${medals()}/${count}語　｜　📖 読解クリア ${readingCount()}語`;
    panel.querySelector('.eq18-desc').textContent =
      count ? `STEP 3を終えた翌日以降に例文へ挑戦。現在挑戦できる語：${ready}語。聞けない場所では読むモードに変更できます。`
            : 'この教材には、まだ例文が登録されていません。';
    const launch = panel.querySelector('#eq18-launch');
    launch.disabled = testMode || ready === 0;
    launch.textContent = testMode ? 'TEST MODE中は利用できません'
      : ready ? `🎧 例文に挑戦する（最大5語）` : '翌日以降に例文が解放されます';
  }

  function closeStep4() {
    try { window.speechSynthesis?.cancel?.(); } catch (_) {}
    document.getElementById('eq18-overlay')?.remove();
    document.body.classList.remove('eq18-open');
    challenge = null;
    refreshPanel();
    try { renderLibraryIfOpen(); } catch (_) {}
  }
  function renderLibraryIfOpen() {
    if (document.getElementById('library')?.classList.contains('active')) renderLibrary();
  }
  function startStep4() {
    if (!activeToeic() || testMode || challenge) return;
    const words = queue();
    if (!words.length) return;
    challenge = {words,index:0,mode:supportsSpeech()?'listen':'read',answered:false};
    const overlay = document.createElement('div');
    overlay.id = 'eq18-overlay'; overlay.className = 'eq18-overlay';
    overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label','STEP 4 例文の実践');
    const card = document.createElement('div');
    card.className = 'eq18-card';
    overlay.append(card);
    document.body.append(overlay);
    document.body.classList.add('eq18-open');
    renderStep4();
  }
  function renderStep4() {
    if (!challenge) return;
    const card = document.querySelector('#eq18-overlay .eq18-card');
    if (!card) return;
    card.replaceChildren();
    const word = challenge.words[challenge.index];
    if (!word) {closeStep4();return;}
    const header = document.createElement('div'); header.className = 'eq18-top';
    const title = document.createElement('strong');
    title.textContent = `STEP 4 · ${challenge.index+1}/${challenge.words.length}例文`;
    const close = button('閉じる ×'); close.addEventListener('click',closeStep4);
    header.append(title,close);
    const heading = document.createElement('h2'); heading.textContent = '例文の意味を理解しよう';
    const note = document.createElement('p'); note.className='eq18-note';
    note.textContent = '🎧 音声だけで意味を考える／📖 英文を読む。正解後に英文と訳を確認できます。';
    const chooser = document.createElement('div'); chooser.className='eq18-choice';
    const listen = button('🎧 聞く');
    const read = button('📖 読む');
    listen.className = challenge.mode === 'listen' ? 'eq18-selected' : '';
    read.className = challenge.mode === 'read' ? 'eq18-selected' : '';
    listen.disabled = !supportsSpeech() || challenge.answered;
    read.disabled = challenge.answered;
    listen.addEventListener('click', () => {challenge.mode='listen';renderStep4();});
    read.addEventListener('click', () => {challenge.mode='read';renderStep4();});
    chooser.append(listen,read);
    const prompt = document.createElement('div');prompt.className='eq18-prompt';
    if (challenge.mode === 'listen') {
      const audio = button('🔊 例文を再生', 'primary');
      audio.addEventListener('click', () => {
        if (play(word.exampleEn)) {
          answers.querySelectorAll('button').forEach(b => { b.disabled = false; });
        } else {
          challenge.mode='read';
          renderStep4();
        }
      });
      prompt.append(audio);
      const hint = document.createElement('small');
      hint.textContent = '英文は答えたあとに表示されます';
      prompt.append(hint);
    } else {
      const sentence = document.createElement('strong');
      sentence.textContent = word.exampleEn;
      prompt.append(sentence);
    }
    const answers = document.createElement('div');answers.className='eq18-answers';
    const selections = optionsForTarget(word, exampleWords(), 'exampleJa');
    selections.forEach(option => {
      const b = button(option.exampleJa);
      b.disabled = challenge.mode === 'listen'; // Must listen before answering.
      b.addEventListener('click', () => {
        if (!challenge || challenge.answered) return;
        challenge.answered = true;
        answers.querySelectorAll('button').forEach(x => { x.disabled=true; });
        const correct = option.id === word.id;
        b.classList.add(correct?'eq18-right':'eq18-wrong');
        const mode = STEP4_MODES[challenge.mode];
        const ev = {
          day:today(),id:word.id,stage:4,mode,correct,xp:0,
          nextDue:addDays(today(),1),
          answer:`${word.exampleEn} / ${word.exampleJa}`,
          toeicStep4Version:1
        };
        // Persist with the proven player-specific state data and JSON backups.
        // This is NOT a crown, STEP 3 completion, or extra EXP.
        state.history.push(ev);
        persist();
        const feedback = document.createElement('div');feedback.className='eq18-feedback';
        const h = document.createElement('strong');
        h.textContent = correct
          ? (challenge.mode==='listen'?'🏅 実践クリア！':'📖 読解クリア！')
          : '答えを確認して、次の復習で再挑戦';
        const en = document.createElement('p');en.textContent = word.exampleEn;
        const ja = document.createElement('p');ja.textContent = word.exampleJa;
        const focus = document.createElement('small');focus.textContent = `${word.en} ＝ ${word.jp}`;
        feedback.append(h,en,ja,focus);
        const next = button(challenge.index+1===challenge.words.length?'終了する':'次の例文へ →','primary');
        next.addEventListener('click',()=>{
          if (!challenge) return;
          challenge.index++;
          challenge.answered = false;
          if (challenge.index >= challenge.words.length) closeStep4();
          else renderStep4();
        });
        feedback.append(next);
        card.append(feedback);
        refreshPanel();
      });
      answers.append(b);
    });
    card.append(header,heading,note,chooser,prompt,answers);
  }

  const oldRenderHome = renderHome;
  renderHome = function toeicStep4Home() {
    const result=oldRenderHome();
    refreshPanel();
    return result;
  };

  const oldRenderLibrary = renderLibrary;
  renderLibrary = function toeicStep4Library() {
    const result = oldRenderLibrary();
    if (!activeToeic()) return result;
    const words = activeWords().filter(w => state.records[w.id]?.unlocked)
      .sort((a,b)=>a.en.localeCompare(b.en));
    const rows = [...(document.querySelector('#library-list')?.children || [])];
    // The course-layer library uses the same en-sorted order as this list.
    rows.forEach((row,i) => {
      const w = words[i];
      if (!w || !w.exampleEn) return;
      const dest = row.querySelector('.state');
      if (!dest) return;
      const skill = document.createElement('div');skill.className='eq18-library-medal';
      if (historyOf(w.id,STEP4_MODES.listen)) skill.textContent='🏅 実践クリア';
      else if (historyOf(w.id,STEP4_MODES.read)) skill.textContent='📖 読解済み';
      else skill.textContent='STEP 4 未挑戦';
      dest.append(skill);
    });
    return result;
  };

  function addStyles() {
    if (document.getElementById('eq18-styles')) return;
    const style=document.createElement('style');style.id='eq18-styles';
    style.textContent=`
      .eq18-panel{margin-top:14px}.eq18-panel h2{margin:6px 0 10px}.eq18-panel p{line-height:1.6}
      .eq18-progress{font-weight:800;color:#394d6e}.eq18-panel button{margin-top:6px}
      .eq18-choice{display:flex;flex-wrap:wrap;gap:9px;align-items:center;margin:12px 0}
      .eq18-choice button{flex:1;min-width:90px;padding:10px;border:1.5px solid #c7d1e1;
        border-radius:12px;background:#f8faff;color:#344a67;font-size:14px;font-weight:800}
      .eq18-choice button.eq18-selected{border-color:#536bd3;background:#eaf0ff;color:#263f9c}
      .eq18-choice button:disabled{opacity:.55}.eq18-choice small{width:100%;font-size:12px;color:#63738b}
      #answer-area .eq18-choice{width:100%}#answer-area .eq18-choice button{min-height:40px}
      .eq18-library-medal{margin-top:4px;font-size:12px;font-weight:850;color:#997124}
      body.eq18-open{overflow:hidden}.eq18-overlay{position:fixed;inset:0;z-index:400;
        display:grid;place-items:center;background:rgba(12,18,37,.82);padding:12px}
      .eq18-card{width:min(100%,650px);max-height:94vh;overflow:auto;border-radius:22px;
        background:#fffdf8;color:#20354e;padding:clamp(16px,4vw,28px)}
      .eq18-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
      .eq18-top strong{font-size:12px;color:#56688a}.eq18-top button{border:0;background:none;
        color:#43516c;padding:8px;cursor:pointer}
      .eq18-card h2{margin:12px 0 3px}.eq18-note{font-size:13px;color:#657591;line-height:1.6}
      .eq18-prompt{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;
        padding:24px 12px;border-radius:14px;background:#f0f3fa;text-align:center;margin:12px 0}
      .eq18-prompt strong{font-size:18px;line-height:1.5}.eq18-prompt small{color:#738197}
      .eq18-prompt button{width:100%;max-width:270px;min-height:50px}
      .eq18-answers{display:grid;gap:9px}.eq18-answers button{width:100%;min-height:48px;
        padding:12px;text-align:left;border:1.5px solid #d5dce8;border-radius:12px;
        background:#fff;color:#20354e;font-size:14px;font-weight:750}
      .eq18-answers button.eq18-right{background:#e8f6e9;border-color:#50a166}
      .eq18-answers button.eq18-wrong{background:#fff1ee;border-color:#db827a}
      .eq18-feedback{margin-top:18px;border-top:1px solid #dce2ec;padding-top:16px}
      .eq18-feedback strong{font-size:18px}.eq18-feedback p{margin:8px 0;line-height:1.5}
      .eq18-feedback small{display:block;color:#697891}.eq18-feedback button{width:100%;margin-top:14px;min-height:48px}
    `;
    document.head.append(style);
  }
  function init() {
    addStyles();
    refreshPanel();
    const version = document.querySelector('.topbar .version');
    if (version) version.textContent = 'v1.8 · FAMILY DATA';
  }
  // A defer script can run while readyState==='interactive' before other defer
  // files have finished. Use DOMContentLoaded for this UI-only initialization.
  if (document.readyState === 'complete') init();
  else document.addEventListener('DOMContentLoaded',init,{once:true});
  window.EnglishQuestToeicStepsV18 = {
    version:'1.8.0',
    getStatus:()=>({medals:medals(),reading:readingCount(),ready:exampleWords().filter(step4Ready).length}),
    refresh:refreshPanel
  };
})();
