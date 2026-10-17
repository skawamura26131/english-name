'use strict';

/*
 * ENGLISH QUEST — FAMILY DATA v1.7
 *
 * Load BEFORE app.js.
 *
 * Design:
 * - One persistent family object contains every player's data.
 * - PLAYER switching NEVER copies/replaces english-quest-v1.
 * - Existing app code keeps using localStorage.getItem/setItem with the
 *   legacy keys, but this layer virtualizes those keys per player.
 * - Every write is merged into the latest family object, so repeated
 *   switching and multiple tabs cannot overwrite another player's slice.
 */

(() => {
  const FAMILY_KEY = 'english-quest-family-data-v2';

  // Old FAMILY v1 keys are read only once for migration.
  const OLD_REGISTRY_KEY = 'english-quest-family-v1';
  const OLD_DATA_PREFIX = 'english-quest-player-data-v1:';

  const MANAGED_KEYS = new Set([
    'english-quest-v1',
    'english-quest-active-pack-v1',
    'english-quest-gear-reward-v2',
    'english-quest-learning-flow-v1-migrated',
    'english-quest-test-area-pref-v1'
  ]);

  const DEFAULT_PLAYERS = [
    { id:'student', name:'中学生', icon:'🎒', defaultPack:'school-p4' },
    { id:'child',   name:'小学生', icon:'🧢', defaultPack:'eiken5-start' },
    { id:'adult',   name:'大人',   icon:'☕', defaultPack:'toeic550-start' }
  ];

  const nativeGetItem = Storage.prototype.getItem;
  const nativeSetItem = Storage.prototype.setItem;
  const nativeRemoveItem = Storage.prototype.removeItem;

  function rawGet(key) {
    try { return nativeGetItem.call(localStorage, key); }
    catch (_) { return null; }
  }

  function rawSet(key, value) {
    try {
      nativeSetItem.call(localStorage, key, String(value));
      return true;
    } catch (_) {
      return false;
    }
  }

  function rawRemove(key) {
    try { nativeRemoveItem.call(localStorage, key); }
    catch (_) {}
  }

  function parseJson(text, fallback = null) {
    try {
      const value = JSON.parse(text);
      return value ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function emptyStateJson() {
    // app.js migrate() will add every current vocabulary record.
    // Explicitly keep the original five legacy words locked for fresh players.
    const locked = {};
    ['they','his','friend','different','find'].forEach(id => {
      locked[id] = { unlocked:false };
    });

    return JSON.stringify({
      version:6,
      xp:0,
      legacyXp:0,
      legacyReadingWords:0,
      history:[],
      records:locked,
      daySnapshot:null
    });
  }

  function freshPlayer(base) {
    return {
      id:base.id,
      name:base.name,
      icon:base.icon,
      defaultPack:base.defaultPack,
      storage:{
        'english-quest-v1': emptyStateJson(),
        'english-quest-active-pack-v1': base.defaultPack
      }
    };
  }

  function normalizePlayer(raw, base) {
    const p = raw && typeof raw === 'object' ? raw : {};
    const storage = p.storage && typeof p.storage === 'object'
      ? {...p.storage}
      : {};

    if (typeof storage['english-quest-v1'] !== 'string') {
      storage['english-quest-v1'] = emptyStateJson();
    }

    if (typeof storage['english-quest-active-pack-v1'] !== 'string') {
      storage['english-quest-active-pack-v1'] = base.defaultPack;
    }

    return {
      id:base.id,
      name:base.name,
      icon:base.icon,
      defaultPack:base.defaultPack,
      storage
    };
  }

  function normalizeFamily(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const sourcePlayers = source.players && typeof source.players === 'object'
      ? source.players
      : {};

    const players = {};

    DEFAULT_PLAYERS.forEach(base => {
      players[base.id] = normalizePlayer(sourcePlayers[base.id], base);
    });

    const activePlayerId = players[source.activePlayerId]
      ? source.activePlayerId
      : 'student';

    return {
      version:2,
      activePlayerId,
      players
    };
  }

  function readFamily() {
    return normalizeFamily(parseJson(rawGet(FAMILY_KEY), null));
  }

  function writeFamily(family) {
    const normalized = normalizeFamily(family);
    rawSet(FAMILY_KEY, JSON.stringify(normalized));
    return normalized;
  }

  function readOldBundle(playerId) {
    const bundle = parseJson(rawGet(`${OLD_DATA_PREFIX}${playerId}`), null);
    if (!bundle || typeof bundle !== 'object') return null;
    if (!bundle.values || typeof bundle.values !== 'object') return null;
    return bundle.values;
  }

  function copyManagedValues(source) {
    const out = {};
    if (!source || typeof source !== 'object') return out;

    MANAGED_KEYS.forEach(key => {
      if (typeof source[key] === 'string') out[key] = source[key];
    });

    return out;
  }

  function migrateToFamilyV2() {
    const existing = parseJson(rawGet(FAMILY_KEY), null);
    if (existing && existing.version === 2 && existing.players) {
      return writeFamily(existing);
    }

    const oldRegistry = parseJson(rawGet(OLD_REGISTRY_KEY), null);
    const family = normalizeFamily(null);

    if (oldRegistry && Array.isArray(oldRegistry.players)) {
      // FAMILY v1/v1.0.x -> FAMILY DATA v2
      DEFAULT_PLAYERS.forEach(base => {
        const values = readOldBundle(base.id);
        if (!values) return;

        const copied = copyManagedValues(values);
        family.players[base.id].storage = {
          ...family.players[base.id].storage,
          ...copied
        };
      });

      if (family.players[oldRegistry.activeId]) {
        family.activePlayerId = oldRegistry.activeId;
      }
    } else {
      // Pre-FAMILY install: preserve current legacy data as the student profile.
      const legacy = {};
      MANAGED_KEYS.forEach(key => {
        const value = rawGet(key);
        if (value !== null) legacy[key] = value;
      });

      family.players.student.storage = {
        ...family.players.student.storage,
        ...copyManagedValues(legacy)
      };
      family.activePlayerId = 'student';
    }

    /*
     * Keep the old physical keys/bundles untouched as emergency recovery data.
     * From this point on they are NOT used for normal reads/writes.
     */
    return writeFamily(family);
  }

  let family = migrateToFamilyV2();

  /*
   * Each tab owns a player context for its lifetime.
   * This prevents another tab's PLAYER switch from redirecting this tab's writes.
   */
  let tabPlayerId = family.activePlayerId;

  function latestFamily() {
    family = readFamily();
    return family;
  }

  function playerMeta(playerId = tabPlayerId) {
    return latestFamily().players[playerId] || latestFamily().players.student;
  }

  function readManaged(key) {
    const f = latestFamily();
    const player = f.players[tabPlayerId] || f.players.student;
    const value = player.storage[key];

    return typeof value === 'string' ? value : null;
  }

  function writeManaged(key, value) {
    const f = latestFamily();
    const player = f.players[tabPlayerId] || f.players.student;

    player.storage[key] = String(value);
    f.players[player.id] = player;
    family = writeFamily(f);
  }

  function removeManaged(key) {
    const f = latestFamily();
    const player = f.players[tabPlayerId] || f.players.student;

    delete player.storage[key];

    // Keep fresh-player defaults stable after a full reset/reload.
    if (key === 'english-quest-active-pack-v1') {
      player.storage[key] = player.defaultPack;
    }

    f.players[player.id] = player;
    family = writeFamily(f);
  }

  /*
   * Virtualize only the keys ENGLISH QUEST already uses.
   * No physical swapping of english-quest-v1 happens anymore.
   */
  if (!window.__englishQuestFamilyDataV2Installed) {
    window.__englishQuestFamilyDataV2Installed = true;

    Storage.prototype.getItem = function(key) {
      const k = String(key);

      if (this === window.localStorage && MANAGED_KEYS.has(k)) {
        return readManaged(k);
      }

      return nativeGetItem.call(this, key);
    };

    Storage.prototype.setItem = function(key, value) {
      const k = String(key);

      if (this === window.localStorage && MANAGED_KEYS.has(k)) {
        writeManaged(k, value);
        return;
      }

      nativeSetItem.call(this, key, value);
    };

    Storage.prototype.removeItem = function(key) {
      const k = String(key);

      if (this === window.localStorage && MANAGED_KEYS.has(k)) {
        removeManaged(k);
        return;
      }

      nativeRemoveItem.call(this, key);
    };
  }

  function getActivePlayer() {
    const p = playerMeta(tabPlayerId);
    return {
      id:p.id,
      name:p.name,
      icon:p.icon,
      defaultPack:p.defaultPack
    };
  }

  function getPlayers() {
    const f = latestFamily();

    return DEFAULT_PLAYERS.map(base => {
      const p = f.players[base.id] || freshPlayer(base);
      return {
        id:p.id,
        name:p.name,
        icon:p.icon,
        defaultPack:p.defaultPack
      };
    });
  }

  function switchPlayer(playerId) {
    const f = latestFamily();
    const target = f.players[playerId];

    if (!target || playerId === tabPlayerId) return false;

    if (document.body?.classList.contains('test-mode')) {
      try {
        if (typeof notify === 'function') {
          notify('TEST MODEを終了してからプレイヤーを切り替えてください。');
        }
      } catch (_) {}
      return false;
    }

    const ok = window.confirm(
      `「${target.name}」に切り替えますか？\n画面を再読み込みします。`
    );

    if (!ok) return false;

    /*
     * Only activePlayerId changes.
     * No player state is copied, cleared, restored, or replaced here.
     */
    f.activePlayerId = playerId;
    family = writeFamily(f);
    tabPlayerId = playerId;

    location.reload();
    return true;
  }

  function getDebugSummary() {
    const f = latestFamily();

    return DEFAULT_PLAYERS.map(base => {
      const p = f.players[base.id];
      const state = parseJson(p?.storage?.['english-quest-v1'], null);

      return {
        id:base.id,
        name:base.name,
        xp:Number.isFinite(state?.xp) ? state.xp : null,
        unlocked:state?.records
          ? Object.values(state.records).filter(r => r?.unlocked).length
          : null,
        activePack:p?.storage?.['english-quest-active-pack-v1'] || null
      };
    });
  }

  /*
   * Optional complete-family backup helpers for later UI use.
   * Existing app JSON import/export still works on the CURRENT player only.
   */
  function exportFamilyObject() {
    return JSON.parse(JSON.stringify(latestFamily()));
  }

  function replaceCurrentPlayerState(rawStateJson) {
    const f = latestFamily();
    const p = f.players[tabPlayerId];

    if (!p) return false;

    p.storage['english-quest-v1'] = String(rawStateJson);
    f.players[tabPlayerId] = p;
    family = writeFamily(f);
    return true;
  }

  window.EnglishQuestPlayers = {
    getActivePlayer,
    getPlayers,
    switchPlayer,
    getDebugSummary,
    exportFamilyObject,
    replaceCurrentPlayerState,
    storageModel:'family-data-v2'
  };

  function injectStyle() {
    if (document.getElementById('player-layer-style')) return;

    const style = document.createElement('style');
    style.id = 'player-layer-style';
    style.textContent = `
      .player-switcher{
        display:flex;align-items:center;gap:8px;padding:10px 14px;
        margin:0 0 12px;border:1px solid #dde4ed;border-radius:15px;
        background:#fffdf8;overflow-x:auto;-webkit-overflow-scrolling:touch
      }
      .player-switcher-label{
        flex:0 0 auto;font-size:10px;font-weight:950;letter-spacing:.12em;color:#8190a3
      }
      .player-switcher-buttons{display:flex;gap:7px;min-width:max-content}
      .player-switcher button{
        appearance:none;border:1px solid #d5dde8;border-radius:999px;background:#f7f9fc;
        color:#425773;padding:8px 12px;font-size:12px;font-weight:900;cursor:pointer
      }
      .player-switcher button.current{
        border-color:#3d58b6;background:#eaf0ff;color:#274293;
        box-shadow:inset 0 0 0 1px rgba(61,88,182,.12)
      }
      .player-switcher button:disabled{cursor:default}
      @media(max-width:520px){
        .player-switcher{margin-left:0;margin-right:0;padding:9px 10px}
        .player-switcher button{padding:8px 11px}
      }
    `;

    document.head.appendChild(style);
  }

  function renderSwitcher() {
    const topbar = document.querySelector('.topbar');
    if (!topbar || document.getElementById('player-switcher')) return;

    injectStyle();

    const root = document.createElement('section');
    root.id = 'player-switcher';
    root.className = 'player-switcher';
    root.setAttribute('aria-label', 'プレイヤー切り替え');

    const label = document.createElement('span');
    label.className = 'player-switcher-label';
    label.textContent = 'PLAYER';

    const buttons = document.createElement('div');
    buttons.className = 'player-switcher-buttons';

    getPlayers().forEach(player => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.playerId = player.id;
      button.textContent = `${player.icon} ${player.name}`;
      button.classList.toggle('current', player.id === tabPlayerId);
      button.setAttribute(
        'aria-pressed',
        player.id === tabPlayerId ? 'true' : 'false'
      );
      button.addEventListener('click', () => switchPlayer(player.id));
      buttons.appendChild(button);
    });

    root.append(label, buttons);
    topbar.insertAdjacentElement('afterend', root);

    const version = document.querySelector('.topbar .version');
    if (version) version.textContent = 'v1.7 · FAMILY DATA';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSwitcher, {once:true});
  } else {
    renderSwitcher();
  }
})();
