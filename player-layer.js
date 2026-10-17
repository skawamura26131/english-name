'use strict';

/*
 * ENGLISH QUEST — FAMILY / PLAYER v1.0.2 MIRROR
 *
 * Load BEFORE app.js.
 *
 * v1.0.2 changes the save strategy:
 * - the legacy live keys are still used by the existing app
 * - EVERY write to a managed live key is mirrored immediately into
 *   the currently active player's private bundle
 * - switching restores the target player's bundle, then reloads
 *
 * This removes the timing/race dependency on pagehide.
 */
(() => {
  const REGISTRY_KEY = 'english-quest-family-v1';
  const DATA_PREFIX = 'english-quest-player-data-v1:';
  const RESCUE_PREFIX = 'english-quest-player-rescue-v1:';
  const LIVE_OWNER_KEY = 'english-quest-family-live-owner-v1';

  const MANAGED_KEYS = [
    'english-quest-v1',
    'english-quest-active-pack-v1',
    'english-quest-gear-reward-v2',
    'english-quest-learning-flow-v1-migrated',
    'english-quest-test-area-pref-v1'
  ];

  const DEFAULT_PLAYERS = [
    { id:'student', name:'中学生', icon:'🎒', defaultPack:'school-p4' },
    { id:'child',   name:'小学生', icon:'🧢', defaultPack:'eiken5-start' },
    { id:'adult',   name:'大人',   icon:'☕', defaultPack:'toeic550-start' }
  ];

  const nativeSetItem = Storage.prototype.setItem;
  const nativeRemoveItem = Storage.prototype.removeItem;

  let internalStorageWrite = false;
  let switching = false;
  let registry = null;
  let activePlayer = null;

  function nativeSet(key, value) {
    try {
      internalStorageWrite = true;
      nativeSetItem.call(localStorage, key, String(value));
      return true;
    } catch (_) {
      return false;
    } finally {
      internalStorageWrite = false;
    }
  }

  function nativeRemove(key) {
    try {
      internalStorageWrite = true;
      nativeRemoveItem.call(localStorage, key);
    } catch (_) {
    } finally {
      internalStorageWrite = false;
    }
  }

  function safeGet(key) {
    try { return localStorage.getItem(key); }
    catch (_) { return null; }
  }

  function emptyStateJson() {
    const locked = {};
    ['they','his','friend','different','find'].forEach(id => {
      locked[id] = { unlocked:false };
    });

    return JSON.stringify({
      version: 6,
      xp: 0,
      legacyXp: 0,
      legacyReadingWords: 0,
      history: [],
      records: locked,
      daySnapshot: null
    });
  }

  function makeFreshBundle(player) {
    return {
      version: 2,
      updatedAt: Date.now(),
      values: {
        'english-quest-v1': emptyStateJson(),
        'english-quest-active-pack-v1': player.defaultPack
      }
    };
  }

  function bundleKey(playerId) {
    return `${DATA_PREFIX}${playerId}`;
  }

  function rescueKey(playerId) {
    return `${RESCUE_PREFIX}${playerId}`;
  }

  function readBundle(playerId) {
    try {
      const raw = JSON.parse(safeGet(bundleKey(playerId)) || 'null');
      if (!raw || typeof raw !== 'object' || !raw.values || typeof raw.values !== 'object') {
        return null;
      }
      return raw;
    } catch (_) {
      return null;
    }
  }

  function writeBundle(playerId, bundle) {
    nativeSet(bundleKey(playerId), JSON.stringify(bundle));
  }

  function readRegistry() {
    try {
      const raw = JSON.parse(safeGet(REGISTRY_KEY) || 'null');
      if (!raw || typeof raw !== 'object' || !Array.isArray(raw.players)) return null;
      return raw;
    } catch (_) {
      return null;
    }
  }

  function normalizeRegistry(raw) {
    const byId = new Map((raw?.players || []).map(p => [p.id, p]));
    const players = DEFAULT_PLAYERS.map(base => ({...base, ...(byId.get(base.id) || {})}));
    const activeId = players.some(p => p.id === raw?.activeId)
      ? raw.activeId
      : players[0].id;

    return { version:2, activeId, players };
  }

  function saveRegistry() {
    nativeSet(REGISTRY_KEY, JSON.stringify(registry));
  }

  function collectLiveValues() {
    const values = {};
    MANAGED_KEYS.forEach(key => {
      const value = safeGet(key);
      if (value !== null) values[key] = value;
    });
    return values;
  }

  function snapshotLive(playerId, rescue = false) {
    if (!playerId) return;

    const bundle = {
      version: 2,
      updatedAt: Date.now(),
      values: collectLiveValues()
    };

    writeBundle(playerId, bundle);

    if (rescue) {
      nativeSet(rescueKey(playerId), JSON.stringify(bundle));
    }
  }

  function updateBundleValue(playerId, key, value, remove = false) {
    if (!playerId || !MANAGED_KEYS.includes(key)) return;

    const player =
      registry?.players?.find(p => p.id === playerId) ||
      DEFAULT_PLAYERS.find(p => p.id === playerId);

    const bundle = readBundle(playerId) || makeFreshBundle(player || DEFAULT_PLAYERS[0]);
    const values = {...bundle.values};

    if (remove) delete values[key];
    else values[key] = String(value);

    writeBundle(playerId, {
      version: 2,
      updatedAt: Date.now(),
      values
    });
  }

  function installMirror() {
    if (window.__englishQuestPlayerMirrorV102) return;
    window.__englishQuestPlayerMirrorV102 = true;

    Storage.prototype.setItem = function(key, value) {
      nativeSetItem.call(this, key, value);

      if (
        this === window.localStorage &&
        !internalStorageWrite &&
        activePlayer &&
        MANAGED_KEYS.includes(String(key))
      ) {
        updateBundleValue(activePlayer.id, String(key), String(value), false);
        nativeSet(LIVE_OWNER_KEY, activePlayer.id);
      }
    };

    Storage.prototype.removeItem = function(key) {
      nativeRemoveItem.call(this, key);

      if (
        this === window.localStorage &&
        !internalStorageWrite &&
        activePlayer &&
        MANAGED_KEYS.includes(String(key))
      ) {
        updateBundleValue(activePlayer.id, String(key), '', true);
        nativeSet(LIVE_OWNER_KEY, activePlayer.id);
      }
    };
  }

  function clearManagedLive() {
    MANAGED_KEYS.forEach(nativeRemove);
  }

  function restoreBundle(player) {
    const bundle = readBundle(player.id) || makeFreshBundle(player);
    const values = {...bundle.values};

    if (!values['english-quest-active-pack-v1']) {
      values['english-quest-active-pack-v1'] = player.defaultPack;
    }

    clearManagedLive();

    Object.entries(values).forEach(([key, value]) => {
      if (MANAGED_KEYS.includes(key) && typeof value === 'string') {
        nativeSet(key, value);
      }
    });

    nativeSet(LIVE_OWNER_KEY, player.id);

    writeBundle(player.id, {
      version: 2,
      updatedAt: Date.now(),
      values
    });
  }

  /*
   * Bootstrap.
   */
  const existingRegistry = readRegistry();

  if (!existingRegistry) {
    registry = normalizeRegistry({
      activeId:'student',
      players:DEFAULT_PLAYERS
    });

    saveRegistry();

    // Pre-family progress belongs to the student profile.
    snapshotLive('student', true);

    DEFAULT_PLAYERS
      .filter(p => p.id !== 'student')
      .forEach(p => writeBundle(p.id, makeFreshBundle(p)));

    nativeSet(LIVE_OWNER_KEY, 'student');
  } else {
    registry = normalizeRegistry(existingRegistry);
    saveRegistry();

    /*
     * Only snapshot live storage if we know who owns it.
     * v1.0.1 writes LIVE_OWNER_KEY, so this is safe for upgraded installs.
     * If no owner is known, do NOT guess and overwrite a bundle.
     */
    const owner = safeGet(LIVE_OWNER_KEY);
    if (registry.players.some(p => p.id === owner)) {
      snapshotLive(owner);
    }

    registry.players.forEach(player => {
      if (!readBundle(player.id)) {
        writeBundle(player.id, makeFreshBundle(player));
      }
    });
  }

  activePlayer =
    registry.players.find(p => p.id === registry.activeId) ||
    registry.players[0];

  restoreBundle(activePlayer);

  // Must be installed before app.js starts writing progress.
  installMirror();

  function getActivePlayer() {
    return {...activePlayer};
  }

  function getPlayers() {
    return registry.players.map(p => ({...p}));
  }

  function switchPlayer(playerId) {
    const target = registry.players.find(p => p.id === playerId);
    if (!target || target.id === activePlayer.id) return false;

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

    // Final safety copy of the player being left.
    snapshotLive(activePlayer.id, true);

    switching = true;

    registry.activeId = target.id;
    saveRegistry();

    activePlayer = target;
    restoreBundle(target);

    location.reload();
    return true;
  }

  function getDebugSummary() {
    return registry.players.map(player => {
      const bundle = readBundle(player.id);
      let xp = null;
      let unlocked = null;
      let pack = bundle?.values?.['english-quest-active-pack-v1'] || null;

      try {
        const state = JSON.parse(bundle?.values?.['english-quest-v1'] || 'null');
        xp = Number.isFinite(state?.xp) ? state.xp : null;
        unlocked = state?.records
          ? Object.values(state.records).filter(r => r?.unlocked).length
          : null;
      } catch (_) {}

      return {
        id: player.id,
        name: player.name,
        xp,
        unlocked,
        pack,
        updatedAt: bundle?.updatedAt || null
      };
    });
  }

  window.EnglishQuestPlayers = {
    getActivePlayer,
    getPlayers,
    switchPlayer,
    saveCurrent: () => snapshotLive(activePlayer.id, true),
    getDebugSummary
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

    registry.players.forEach(player => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.playerId = player.id;
      b.textContent = `${player.icon} ${player.name}`;
      b.classList.toggle('current', player.id === activePlayer.id);
      b.setAttribute(
        'aria-pressed',
        player.id === activePlayer.id ? 'true' : 'false'
      );
      b.addEventListener('click', () => switchPlayer(player.id));
      buttons.appendChild(b);
    });

    root.append(label, buttons);
    topbar.insertAdjacentElement('afterend', root);

    const version = document.querySelector('.topbar .version');
    if (version) version.textContent = 'v1.6.2 · FAMILY';
  }

  window.addEventListener('pagehide', () => {
    if (switching) return;
    snapshotLive(activePlayer.id);
  });

  document.addEventListener('visibilitychange', () => {
    if (switching || document.visibilityState !== 'hidden') return;
    snapshotLive(activePlayer.id);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSwitcher, {once:true});
  } else {
    renderSwitcher();
  }
})();
