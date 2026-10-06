'use strict';

/*
 * ENGLISH QUEST — BOSS v0.1
 *
 * Small-start boss experience:
 * - Unlocks at 25 crowns.
 * - 5 questions only.
 * - Stage 1 style: English -> choose the Japanese meaning.
 * - Questions come from mastered PROGRAM 4/5/6 words.
 * - No HP, no pass/fail, no rewards yet.
 * - Does NOT change XP, crowns, review dates, or learning records.
 * - Works in TEST MODE because it reads the temporary test state.
 */

(() => {
  const BOSS_UNLOCK_CROWNS = 25;
  const BOSS_QUESTION_COUNT = 5;

  let bossSession = null;
  let syncQueued = false;

  function bossUnlocked() {
    try {
      return focusMasterCount() >= BOSS_UNLOCK_CROWNS;
    } catch (_) {
      return false;
    }
  }

  function masteredFocusWords() {
    try {
      return allFocusWords().filter(w => state.records[w.id]?.mastered);
    } catch (_) {
      return [];
    }
  }

  function sampleBossWords() {
    const pool = masteredFocusWords();
    if (pool.length < BOSS_QUESTION_COUNT) return [];
    return shuffle(pool).slice(0, BOSS_QUESTION_COUNT);
  }

  function injectStyle() {
    if (document.getElementById('boss-v01-style')) return;

    const style = document.createElement('style');
    style.id = 'boss-v01-style';
    style.textContent = `
      .boss-challenge-btn{
        margin-top:14px;
        width:100%;
        min-height:48px;
        border:1px solid #f0c86e;
        border-radius:13px;
        padding:11px 16px;
        background:linear-gradient(180deg,#ffe59a,#f2c35c);
        color:#4f3700;
        font-weight:900;
        font-size:14px;
        cursor:pointer;
        box-shadow:0 4px 10px rgba(0,0,0,.12);
      }
      .boss-challenge-btn:hover{filter:brightness(1.03)}
      .boss-challenge-btn[hidden]{display:none!important}

      body.boss-v01-open{overflow:hidden}

      .boss-v01-overlay{
        position:fixed;
        inset:0;
        z-index:250;
        display:grid;
        place-items:center;
        padding:18px;
        background:rgba(18,20,45,.78);
        backdrop-filter:blur(4px);
      }
      .boss-v01-overlay[hidden]{display:none!important}

      .boss-v01-card{
        width:min(100%,620px);
        max-height:min(88vh,760px);
        overflow:auto;
        border:2px solid #5f64a6;
        border-radius:24px;
        background:#fffdf7;
        box-shadow:0 24px 60px rgba(0,0,0,.35);
        padding:clamp(20px,5vw,34px);
        color:#20324b;
      }

      .boss-v01-top{
        display:flex;
        justify-content:space-between;
        align-items:flex-start;
        gap:16px;
        margin-bottom:18px;
      }
      .boss-v01-label{
        font-size:11px;
        letter-spacing:.16em;
        font-weight:900;
        color:#9b7921;
      }
      .boss-v01-card h2{
        margin:5px 0 0;
        font-size:clamp(22px,5vw,30px);
      }
      .boss-v01-close{
        flex:0 0 auto;
        border:1px solid #cfd5df;
        background:#fff;
        color:#4d5e73;
        border-radius:10px;
        padding:8px 11px;
        font-weight:800;
        cursor:pointer;
      }

      .boss-v01-enemy{
        width:90px;
        height:90px;
        margin:4px auto 18px;
        display:grid;
        place-items:center;
        border-radius:24px;
        background:linear-gradient(145deg,#262a5a,#41356d);
        border:3px solid #696fa9;
        color:#ffe08a;
        font-size:52px;
        font-weight:950;
        box-shadow:inset 0 0 0 4px rgba(255,255,255,.04);
      }

      .boss-v01-progress{
        height:9px;
        border-radius:999px;
        background:#e0e4ea;
        overflow:hidden;
        margin:10px 0 22px;
      }
      .boss-v01-progress span{
        display:block;
        height:100%;
        width:0;
        background:linear-gradient(90deg,#4bb4c4,#f2c95f);
        transition:width .2s ease;
      }

      .boss-v01-counter{
        font-size:12px;
        font-weight:900;
        color:#68778b;
        text-align:center;
      }
      .boss-v01-instruction{
        margin:14px 0 6px;
        text-align:center;
        color:#68778b;
        font-size:13px;
      }
      .boss-v01-word{
        margin:6px 0 22px;
        text-align:center;
        font-size:clamp(32px,8vw,48px);
        line-height:1.2;
        overflow-wrap:anywhere;
      }

      .boss-v01-options{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:10px;
      }
      .boss-v01-option{
        min-height:70px;
        border:1.5px solid #cbd9e6;
        border-radius:14px;
        background:#f7f9fc;
        color:#20324b;
        padding:12px;
        font-weight:750;
        cursor:pointer;
      }
      .boss-v01-option.right{
        border-color:#50b283;
        background:#e9f8ee;
      }
      .boss-v01-option.wrong{
        border-color:#df9393;
        background:#fff0f0;
      }
      .boss-v01-option:disabled{
        opacity:1;
        cursor:default;
      }

      .boss-v01-feedback{
        margin:16px 0 0;
        padding:13px 15px;
        border-radius:13px;
        background:#eef7f1;
        border:1px solid #c3e4ce;
        font-size:14px;
        line-height:1.65;
      }
      .boss-v01-feedback.bad{
        background:#fff5eb;
        border-color:#e8cfaa;
      }
      .boss-v01-feedback[hidden]{display:none!important}

      .boss-v01-next,
      .boss-v01-again,
      .boss-v01-home{
        width:100%;
        min-height:48px;
        margin-top:13px;
        border-radius:13px;
        padding:11px 16px;
        font-weight:900;
        cursor:pointer;
      }
      .boss-v01-next,
      .boss-v01-again{
        border:0;
        background:linear-gradient(180deg,#2e4bb3,#2543a0);
        color:#fff;
      }
      .boss-v01-home{
        border:1px solid #c6d2df;
        background:#fff;
        color:#35516d;
      }
      .boss-v01-next[hidden],
      .boss-v01-again[hidden],
      .boss-v01-home[hidden]{display:none!important}

      .boss-v01-result{
        text-align:center;
        padding:6px 0 2px;
      }
      .boss-v01-score{
        margin:12px 0 4px;
        font-size:clamp(38px,10vw,62px);
        font-weight:950;
        color:#293f95;
      }
      .boss-v01-note{
        color:#68778b;
        line-height:1.7;
        font-size:14px;
      }

      @media(max-width:520px){
        .boss-v01-options{grid-template-columns:1fr}
        .boss-v01-option{min-height:56px}
        .boss-v01-card{border-radius:20px;padding:20px}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureChallengeButton() {
    const copy = document.querySelector('.boss-teaser .boss-copy');
    if (!copy) return null;

    let button = document.getElementById('boss-challenge-btn');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.id = 'boss-challenge-btn';
      button.className = 'boss-challenge-btn';
      button.textContent = 'ボスに挑む →';
      button.addEventListener('click', startBoss);
      copy.appendChild(button);
    }
    return button;
  }

  function syncBossTeaser() {
    syncQueued = false;

    const title = document.getElementById('boss-title');
    const message = document.getElementById('boss-message');
    const lock = document.getElementById('boss-lock');
    const button = ensureChallengeButton();
    if (!title || !message || !lock || !button) return;

    const crowns = (() => {
      try { return focusMasterCount(); }
      catch (_) { return 0; }
    })();

    const ready = crowns >= BOSS_UNLOCK_CROWNS;

    if (ready) {
      if (title.textContent !== 'ボスへの道がひらいた。') {
        title.textContent = 'ボスへの道がひらいた。';
      }
      if (message.textContent !== '5問だけ、挑戦してみよう。学習記録は変わりません。') {
        message.textContent = '5問だけ、挑戦してみよう。学習記録は変わりません。';
      }
      if (lock.textContent !== '!') lock.textContent = '!';
      lock.classList.add('ready');
      button.hidden = false;
    } else {
      button.hidden = true;
      const remaining = Math.max(0, BOSS_UNLOCK_CROWNS - crowns);
      const expected = `最初のボスまで、あと${remaining}王冠。`;
      if (message.textContent !== expected) message.textContent = expected;
    }
  }

  function queueSync() {
    if (syncQueued) return;
    syncQueued = true;
    requestAnimationFrame(syncBossTeaser);
  }

  function createModal() {
    if (document.getElementById('boss-v01-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'boss-v01-overlay';
    overlay.className = 'boss-v01-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="boss-v01-card" role="dialog" aria-modal="true" aria-labelledby="boss-v01-title">
        <div class="boss-v01-top">
          <div>
            <div class="boss-v01-label">BOSS CHALLENGE · v0.1</div>
            <h2 id="boss-v01-title">最初のボス</h2>
          </div>
          <button type="button" class="boss-v01-close" id="boss-v01-close">閉じる</button>
        </div>

        <div id="boss-v01-question-area">
          <div class="boss-v01-enemy" aria-hidden="true">?</div>
          <div class="boss-v01-counter" id="boss-v01-counter">1 / 5</div>
          <div class="boss-v01-progress"><span id="boss-v01-progress-bar"></span></div>
          <p class="boss-v01-instruction">英語を見て、正しい意味を選ぼう</p>
          <h3 class="boss-v01-word" id="boss-v01-word"></h3>
          <div class="boss-v01-options" id="boss-v01-options"></div>
          <div class="boss-v01-feedback" id="boss-v01-feedback" hidden></div>
          <button type="button" class="boss-v01-next" id="boss-v01-next" hidden>次の問題へ →</button>
        </div>

        <div class="boss-v01-result" id="boss-v01-result" hidden>
          <div class="boss-v01-enemy" aria-hidden="true">!</div>
          <div class="boss-v01-label">CHALLENGE COMPLETE</div>
          <div class="boss-v01-score" id="boss-v01-score">0 / 5</div>
          <p class="boss-v01-note">まずはここまで。<br>HP・撃破条件・装備効果・報酬は、あとから少しずつ追加できます。</p>
          <button type="button" class="boss-v01-again" id="boss-v01-again">もう一度挑む</button>
          <button type="button" class="boss-v01-home" id="boss-v01-home">ホームへ戻る</button>
        </div>
      </section>
    `;

    document.body.appendChild(overlay);

    document.getElementById('boss-v01-close').addEventListener('click', closeBoss);
    document.getElementById('boss-v01-next').addEventListener('click', nextBossQuestion);
    document.getElementById('boss-v01-again').addEventListener('click', startBoss);
    document.getElementById('boss-v01-home').addEventListener('click', closeBoss);

    overlay.addEventListener('click', evt => {
      if (evt.target === overlay) closeBoss();
    });

    document.addEventListener('keydown', evt => {
      if (evt.key === 'Escape' && !overlay.hidden) closeBoss();
    });
  }

  function openBoss() {
    const overlay = document.getElementById('boss-v01-overlay');
    if (!overlay) return;
    overlay.hidden = false;
    document.body.classList.add('boss-v01-open');
  }

  function closeBoss() {
    const overlay = document.getElementById('boss-v01-overlay');
    if (!overlay) return;
    overlay.hidden = true;
    document.body.classList.remove('boss-v01-open');
    bossSession = null;
  }

  function startBoss() {
    if (!bossUnlocked()) {
      try { notify(`最初のボスは王冠${BOSS_UNLOCK_CROWNS}個でひらきます。`); }
      catch (_) {}
      return;
    }

    const words = sampleBossWords();
    if (words.length < BOSS_QUESTION_COUNT) {
      try { notify('ボス戦に使えるMASTER単語がまだ足りません。'); }
      catch (_) {}
      return;
    }

    bossSession = {
      words,
      index: 0,
      score: 0,
      answered: false
    };

    document.getElementById('boss-v01-question-area').hidden = false;
    document.getElementById('boss-v01-result').hidden = true;

    openBoss();
    renderBossQuestion();
  }

  function renderBossQuestion() {
    if (!bossSession) return;

    const word = bossSession.words[bossSession.index];
    bossSession.answered = false;

    document.getElementById('boss-v01-counter').textContent =
      `${bossSession.index + 1} / ${BOSS_QUESTION_COUNT}`;

    document.getElementById('boss-v01-progress-bar').style.width =
      `${(bossSession.index / BOSS_QUESTION_COUNT) * 100}%`;

    document.getElementById('boss-v01-word').textContent = word.en;

    const feedback = document.getElementById('boss-v01-feedback');
    feedback.hidden = true;
    feedback.classList.remove('bad');
    feedback.textContent = '';

    const next = document.getElementById('boss-v01-next');
    next.hidden = true;
    next.textContent =
      bossSession.index === BOSS_QUESTION_COUNT - 1
        ? '結果を見る →'
        : '次の問題へ →';

    const root = document.getElementById('boss-v01-options');
    root.replaceChildren();

    optionsFor(word).forEach(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'boss-v01-option';
      button.textContent = option.jp;

      button.addEventListener('click', () => {
        if (!bossSession || bossSession.answered) return;
        bossSession.answered = true;

        const correct = option.id === word.id;
        if (correct) bossSession.score++;

        root.querySelectorAll('button').forEach(b => {
          b.disabled = true;
          if (b === button) b.classList.add(correct ? 'right' : 'wrong');
        });

        // Always reveal the correct option too.
        if (!correct) {
          [...root.querySelectorAll('button')].forEach(b => {
            if (b.textContent === word.jp) b.classList.add('right');
          });
        }

        feedback.hidden = false;
        feedback.classList.toggle('bad', !correct);
        feedback.textContent = correct
          ? `正解！ ${word.en} = ${word.jp}`
          : `正解は「${word.jp}」。`;

        next.hidden = false;
      });

      root.appendChild(button);
    });
  }

  function nextBossQuestion() {
    if (!bossSession || !bossSession.answered) return;

    bossSession.index++;

    if (bossSession.index >= BOSS_QUESTION_COUNT) {
      renderBossResult();
      return;
    }

    renderBossQuestion();
  }

  function renderBossResult() {
    if (!bossSession) return;

    document.getElementById('boss-v01-question-area').hidden = true;
    document.getElementById('boss-v01-result').hidden = false;
    document.getElementById('boss-v01-score').textContent =
      `${bossSession.score} / ${BOSS_QUESTION_COUNT}`;
  }

  function watchApp() {
    const boss = document.querySelector('.boss-teaser');
    const adventure = document.querySelector('.adventure-panel');

    const observer = new MutationObserver(queueSync);

    if (boss) {
      observer.observe(boss, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
    }

    if (adventure) {
      observer.observe(adventure, {
        subtree: true,
        childList: true,
        characterData: true,
        attributes: true
      });
    }
  }

  function initBossV01() {
    injectStyle();
    createModal();
    ensureChallengeButton();
    syncBossTeaser();
    watchApp();

    // Covers initial render order and TEST MODE switches.
    requestAnimationFrame(syncBossTeaser);
    setTimeout(syncBossTeaser, 200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBossV01, { once: true });
  } else {
    initBossV01();
  }
})();
