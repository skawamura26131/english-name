'use strict';

/*
 * ENGLISH QUEST — LEARNING FLOW v1.0
 *
 * Purpose:
 * 1) Keep the first encounter exactly as before:
 *      STAGE 1 見る -> STAGE 2 言う -> STAGE 3 書く
 * 2) After that first three-stage run, do not repeat the word again that day.
 *    (The existing app already enforces this; this patch preserves it.)
 * 3) Mix review words and review formats more naturally.
 * 4) Reduce routine typing:
 *      ordinary MIX target = 見る2 / 言う2 / 書く1 per five review questions
 *      crown-ready words are always 書く.
 * 5) Shorten crown acquisition:
 *      first STAGE 3 success -> 定着1 (next day)
 *      next successful MIX review -> 定着2 (3 days later)
 *      final STAGE 3 spelling success -> 👑 MASTER
 *
 * No data schema changes.
 * Existing EXP / words / equipment / BOSS files can remain as they are.
 */

(() => {
  const PATCH_ID = 'english-quest-learning-flow-v1';
  if (document.documentElement.dataset.learningFlowV1 === '1') return;
  document.documentElement.dataset.learningFlowV1 = '1';

  /*
   * The original app functions are top-level function bindings.
   * We override only the learning-flow functions, leaving the vocabulary,
   * save data, UI, test mode, equipment and BOSS logic intact.
   */

  // ------------------------------------------------------------
  // 1. Review word order: preserve interrupted guided words first,
  //    but shuffle the rest so the same review order is not repeated.
  // ------------------------------------------------------------
  const originalSessionWords = sessionWords;
  sessionWords = function(allowUnlock = false) {
    const words = originalSessionWords(allowUnlock);
    if (!Array.isArray(words) || words.length <= 1) return words;

    const inProgress = [];
    const others = [];

    words.forEach(w => {
      const r = state.records[w.id];
      if (r?.inProgress) inProgress.push(w);
      else others.push(w);
    });

    return [...inProgress, ...shuffle(others)];
  };

  // ------------------------------------------------------------
  // 2. Make the visible retention status match the new 2-review path.
  // ------------------------------------------------------------
  stageStars = function(rec) {
    if (rec.mastered) return '👑 MASTER';
    if (rec.stage === 1) return '★☆☆';
    if (rec.stage === 2) return '★★☆';
    if (rec.streak === 0) return '★★★';
    if (rec.streak === 1) return '★★★ 定着1/2';
    return '★★★ 王冠チャレンジ';
  };

  stageName = function(rec) {
    if (rec.mastered) return 'MASTER・ランダム復習';
    if (rec.stage === 1) return 'STAGE 1 見る';
    if (rec.stage === 2) return 'STAGE 2 言う';
    if (rec.streak === 0) return 'STAGE 3 書く';
    if (rec.streak >= 2) return 'FINAL CHECK・書く';
    return 'MIX REVIEW・見る／言う／書く';
  };

  // ------------------------------------------------------------
  // 3. Review format mix.
  //    Standard MIX plan: 見る2 / 言う2 / 書く1.
  //    The final crown check is always STAGE 3.
  // ------------------------------------------------------------
  chooseMixedStage = function(rec, deckStage) {
    if (!rec) return deckStage || 1;

    // Crown-ready = spelling check is mandatory.
    if (!rec.mastered && rec.streak >= 2) return 3;

    // MASTER reviews and retention-1 reviews use the mixed deck.
    return deckStage || shuffle([1, 1, 2, 2, 3])[0];
  };

  buildTasks = function(words) {
    // Only one routine writing slot in a five-question MIX deck.
    // Crown-ready words can add extra STAGE 3 questions because they are
    // intentional final checks rather than routine typing.
    const deck = shuffle([1, 1, 2, 2, 3]);
    let di = 0;

    return words.map(w => {
      const r = state.records[w.id];
      const guided = isGuided(r);

      return {
        id: w.id,
        stage: guided ? r.stage : chooseMixedStage(r, deck[di++ % deck.length]),
        mode: guided ? 'guided' : 'mixed'
      };
    });
  };

  // ------------------------------------------------------------
  // 4. Crown condition.
  //
  //    Original app masters at streak 4.
  //    For a correct final spelling check at streak 2, temporarily promote
  //    streak 2 -> 3 before the original complete() runs.
  //    The original complete() then increments 3 -> 4 and performs its
  //    existing MASTER handling, notification, history and 30-day due date.
  //
  //    This keeps the proven save/UI code intact.
  // ------------------------------------------------------------
  const originalComplete = complete;
  complete = function(correct, word, message) {
    const task = currentTask();
    const rec = word ? state.records[word.id] : null;

    if (
      correct &&
      task?.mode === 'mixed' &&
      task.stage === 3 &&
      rec &&
      !rec.mastered &&
      rec.stage === 3 &&
      rec.streak === 2
    ) {
      rec.streak = 3;
    }

    return originalComplete(correct, word, message);
  };

  // ------------------------------------------------------------
  // 5. One-time compatibility adjustment for existing real progress.
  //
  //    Under the old rule, streak 3 could still be waiting up to 7 days.
  //    Under the new rule that word is already ready for its final spelling
  //    check. We convert it to crown-ready and make it available today.
  //
  //    We do NOT auto-award a crown: spelling still has to be correct.
  // ------------------------------------------------------------
  function upgradeExistingProgressOnce() {
    if (testMode) return;

    const marker = `${PATCH_ID}-migrated`;
    try {
      if (localStorage.getItem(marker) === '1') return;
    } catch (_) {}

    let changed = false;

    allFocusWords().forEach(w => {
      const r = state.records[w.id];
      if (
        r?.unlocked &&
        !r.mastered &&
        r.stage === 3 &&
        r.streak >= 3
      ) {
        r.streak = 2;
        if (r.due > today()) r.due = today();
        r.inProgress = false;
        changed = true;
      }
    });

    if (changed) persist();

    try {
      localStorage.setItem(marker, '1');
    } catch (_) {}
  }

  // ------------------------------------------------------------
  // 6. TEST MODE helper:
  //    add one "王冠前 5語" button so the new final-check flow can be
  //    tested immediately without waiting several days.
  // ------------------------------------------------------------
  function addTestPreset() {
    const root = document.getElementById('test-presets');
    if (!root || root.querySelector('[data-learning-flow-preset="crown-ready"]')) return;

    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.learningFlowPreset = 'crown-ready';
    b.textContent = '王冠前 5語';
    b.title = '5語をFINAL CHECK（書く）直前の状態にします';

    b.addEventListener('click', () => {
      if (!testMode) return;

      const focus = allFocusWords();

      // Start from a clean visual test state.
      applyTestProgress(5, 5, 5, 0);

      focus.slice(0, 5).forEach(w => {
        const r = state.records[w.id];
        r.unlocked = true;
        r.stage = 3;
        r.streak = 2;
        r.mastered = false;
        r.due = today();
        r.lastAttempt = null;
        r.inProgress = false;
      });

      renderHome();
      renderData();
      updateTestReadout();
      notify('TEST MODE：5語を王冠チャレンジ直前にしました。');
    });

    root.appendChild(b);
  }

  function initLearningFlowV1() {
    upgradeExistingProgressOnce();
    addTestPreset();

    // Repaint labels immediately if the user opens the library after update.
    try {
      renderHome();
    } catch (_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLearningFlowV1, { once: true });
  } else {
    initLearningFlowV1();
  }
})();
