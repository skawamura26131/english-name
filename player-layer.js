'use strict';

/*
 * ENGLISH QUEST — FAMILY / PLAYER v1.0
 *
 * IMPORTANT:
 * This script must load BEFORE app.js.
 *
 * Existing browser progress is automatically assigned to the first profile.
 * Player names are deliberately generic because the GitHub repository is public.
 */
(() => {
  const REGISTRY_KEY = 'english-quest-family-v1';
  const DATA_PREFIX = 'english-quest-player-data-v1:';

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

  function safeGet(key) {
    try { return localStorage.getItem(key); }
    catch (_) { return null; }
  }

  function safeSet(key, value) {
    try { localStorage.setItem(key, value); return true; }
    catch (_) { return false; }
  }

  function safeRemove(key) {
    try { localStorage.removeItem(key); }
    catch (_) {}
  }

  function emptyStateJson() {
    // app.js の migrate() を通す前提の最小データ。
    // 既存アプリの最初の5語も、新規プレイヤーではロック状態から始める。
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
      version: 1,
      updatedAt: Date.now(),
      values: {
        'english-quest-v1': emptyStateJson(),
        'english-quest-active-pack-v1': player.defaultPack
      }
    };
  }

  function readRegistry() {
    try {
      const raw = JSON.parse(localStorage.getItem(REGISTRY_KEY) || 'null');
      if (!raw || typeof raw !== 'object' || !Array.isArray(raw.players)) return null;
      return raw;
    } catch (_) {
      return null;
    }
  }

  function normalizeRegistry(raw) {
    const byId = new Map((raw?.players || []).map(p => [p.id, p]));
    const players = DEFAULT_PLAYERS.map(base => ({...base, ...(byId.get(base.id) || {})}));
    const activeId = players.some(p => p.id === raw?.activeId) ? raw.activeId : players[0].id;
    return { version:1, activeId, players };
  }

  function saveRegistry(registry) {
    safeSet(REGISTRY_KEY, JSON.stringify(registry));
  }

  function bundleKey(playerId) {
    return `${DATA_PREFIX}${playerId}`;
  }

  function readBundle(playerId) {
    try {
      const raw = JSON.parse(localStorage.getItem(bundleKey(playerId)) || 'null');
      if (!raw || typeof raw !== 'object' || !raw.values || typeof raw.values !== 'object') return null;
      return raw;
    } catch (_) {
      return null;
    }
  }

  function writeBundle(playerId, bundle) {
    safeSet(bundleKey(playerId), JSON.stringify(bundle));
  }

  function snapshotLive(playerId) {
    if (!playerId) return;

    const values = {};
    MANAGED_KEYS.forEach(key => {
      const value = safeGet(key);
      if (value !== null) values[key] = value;
    });

    writeBundle(playerId, {
      version: 1,
      updatedAt: Date.now(),
      values
    });
  }

  function clearManagedLive() {
    MANAGED_KEYS.forEach(safeRemove);
  }

  function restoreBundle(player) {
    clearManagedLive();

    const bundle = readBundle(player.id) || makeFreshBundle(player);
    const values = {...bundle.values};

    if (!values['english-quest-active-pack-v1']) {
      values['english-quest-active-pack-v1'] = player.defaultPack;
    }

    Object.entries(values).forEach(([key, value]) => {
      if (MANAGED_KEYS.includes(key) && typeof value === 'string') safeSet(key, value);
    });

    writeBundle(player.id, {
      version: 1,
      updatedAt: Date.now(),
      values
    });
  }

  let registry = readRegistry();

  if (!registry) {
    // 初回導入：これまでの実データを「中学生」にそのまま引き継ぐ。
    registry = normalizeRegistry({activeId:'student', players:DEFAULT_PLAYERS});
    saveRegistry(registry);
    snapshotLive('student');

    DEFAULT_PLAYERS.filter(p => p.id !== 'student').forEach(player => {
      writeBundle(player.id, makeFreshBundle(player));
    });
  } else {
    registry = normalizeRegistry(registry);
    saveRegistry(registry);

    // 直前まで表示していたプレイヤーの最新localStorageを先に退避。
    snapshotLive(registry.activeId);

    // 新しく増えた既定プレイヤーがあれば初期データを用意。
    registry.players.forEach(player => {
      if (!readBundle(player.id)) writeBundle(player.id, makeFreshBundle(player));
    });
  }

  let activePlayer = registry.players.find(p => p.id === registry.activeId) || registry.players[0];
  restoreBundle(activePlayer);

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
        if (typeof notify === 'function') notify('TEST MODEを終了してからプレイヤーを切り替えてください。');
      } catch (_) {}
      return false;
    }

    const ok = window.confirm(`「${target.name}」に切り替えますか？\n画面を再読み込みします。`);
    if (!ok) return false;

    snapshotLive(activePlayer.id);
    registry.activeId = target.id;
    saveRegistry(registry);
    restoreBundle(target);
    location.reload();
    return true;
  }

  window.EnglishQuestPlayers = {
    getActivePlayer,
    getPlayers,
    switchPlayer,
    saveCurrent: () => snapshotLive(activePlayer.id)
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
        border-color:#3d58b6;background:#eaf0ff;color:#274293;box-shadow:inset 0 0 0 1px rgba(61,88,182,.12)
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
      b.setAttribute('aria-pressed', player.id === activePlayer.id ? 'true' : 'false');
      b.addEventListener('click', () => switchPlayer(player.id));
      buttons.appendChild(b);
    });

    root.append(label, buttons);
    topbar.insertAdjacentElement('afterend', root);

    const version = document.querySelector('.topbar .version');
    if (version) version.textContent = 'v1.6 · FAMILY';
  }

  // 最新データをプレイヤー側にも退避。通常の学習保存先は従来どおりlocalStorage。
  window.addEventListener('pagehide', () => snapshotLive(activePlayer.id));
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') snapshotLive(activePlayer.id);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSwitcher, {once:true});
  } else {
    renderSwitcher();
  }
})();
