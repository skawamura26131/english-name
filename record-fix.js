'use strict';

/*
 * ENGLISH QUEST — RECORD FIX v1.7.1
 * Load AFTER player-layer.js but BEFORE app.js.
 *
 * The original app.js migrate() rebuilds records from the original WORDS
 * (P4/P5/P6) before content-packs.js appends P3/Eiken/TOEIC words.
 * This one-shot pre-load capture restores additional-word records that
 * would otherwise be discarded on each reload. It also patches migrate()
 * for later JSON imports, preserving current and future vocabulary IDs.
 */
(() => {
  const STORE_KEY = 'english-quest-v1';

  function parseJson(text) {
    try { return JSON.parse(text || 'null'); }
    catch (_) { return null; }
  }

  // Capture BEFORE app.js calls load()->migrate()->persist().
  // This getItem resolves to the active player's slice in FAMILY DATA v1.7.
  let savedBeforeLoad = null;
  try { savedBeforeLoad = parseJson(localStorage.getItem(STORE_KEY)); }
  catch (_) { /* localStorage unavailable */ }

  function isObject(x) {
    return x !== null && typeof x === 'object' && !Array.isArray(x);
  }

  function mergeExtraRecords(target, source, shouldRestore) {
    if (!isObject(target) || !isObject(source)) return false;
    let changed = false;

    for (const [id, record] of Object.entries(source)) {
      if (id === '__proto__' || id === 'constructor') continue;
      if (!shouldRestore(id)) continue;
      // cleanRecord validates the original save schema without losing progress.
      target[id] = cleanRecord(record, false);
      changed = true;
    }
    return changed;
  }

  function initializeFix() {
    if (typeof migrate !== 'function' ||
        typeof cleanRecord !== 'function' ||
        !Array.isArray(WORDS)) return;

    // Patch migrate() for all subsequent calls (especially importing JSON).
    const originalMigrate = migrate;
    migrate = function preserveAdditionalWords(raw) {
      const migrated = originalMigrate(raw);
      const availableIds = new Set(WORDS.map(w => w.id));

      // Make new appended words available even when a legacy JSON lacks them.
      WORDS.forEach(w => {
        if (!Object.prototype.hasOwnProperty.call(migrated.records, w.id)) {
          migrated.records[w.id] = cleanRecord(raw?.records?.[w.id], false);
        }
        if (migrated.daySnapshot?.records &&
            !Object.prototype.hasOwnProperty.call(migrated.daySnapshot.records, w.id)) {
          migrated.daySnapshot.records[w.id] =
            cleanRecord(raw?.daySnapshot?.records?.[w.id], false);
        }
      });

      // Preserve historical IDs, too, so future pack restructuring
      // doesn't irreversibly destroy progress for temporarily missing words.
      mergeExtraRecords(migrated.records, raw?.records,
        id => !availableIds.has(id) &&
              !Object.prototype.hasOwnProperty.call(migrated.records, id));

      if (migrated.daySnapshot?.records) {
        mergeExtraRecords(migrated.daySnapshot.records,
          raw?.daySnapshot?.records,
          id => !availableIds.has(id) &&
                !Object.prototype.hasOwnProperty.call(migrated.daySnapshot.records, id));
      }

      return migrated;
    };

    // The initial app.js load already ran before this callback. Restore
    // appended pack words from the exact pre-load copy, once, then persist.
    if (savedBeforeLoad && !testMode && isObject(savedBeforeLoad.records)) {
      const appended = new Set(
        (window.EnglishQuestExtraPacks?.words || [])
          .filter(w => w && typeof w.id === 'string')
          .map(w => w.id)
      );

      let changed = mergeExtraRecords(state.records, savedBeforeLoad.records,
        id => appended.has(id));

      if (state.daySnapshot && savedBeforeLoad.daySnapshot &&
          state.daySnapshot.day === savedBeforeLoad.daySnapshot.day &&
          isObject(state.daySnapshot.records)) {
        changed = mergeExtraRecords(
          state.daySnapshot.records,
          savedBeforeLoad.daySnapshot?.records,
          id => appended.has(id)
        ) || changed;
      }

      if (changed) persist();
    }

    savedBeforeLoad = null;

    const version = document.querySelector('.topbar .version');
    if (version) version.textContent = 'v1.7.1 · FAMILY DATA';
  }

  // All defer scripts (including content-packs.js) execute before this event.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFix, { once: true });
  } else {
    initializeFix();
  }
})();
