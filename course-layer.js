'use strict';

/* ENGLISH QUEST — COURSE MAP v1.1 · FAMILY PACKS */
(() => {
  const STORAGE_KEY = 'english-quest-active-pack-v1';

  const GROUPS = [
    {id:'school', icon:'🏫', label:'学校英語'},
    {id:'eiken', icon:'🏅', label:'英検'},
    {id:'adult', icon:'💼', label:'大人英語'}
  ];

  const PACKS = [
    {id:'school-p3-review', group:'school', label:'PROGRAM 3', subtitle:'Power-Up 2・今回の範囲', source:'tag', program:3},
    {id:'school-p4', group:'school', label:'PROGRAM 4', subtitle:'今回の中心範囲', source:'program', program:4},
    {id:'school-p5', group:'school', label:'PROGRAM 5', subtitle:'保存済み', source:'program', program:5},
    {id:'school-p6', group:'school', label:'PROGRAM 6', subtitle:'保存済み', source:'program', program:6},
    {id:'eiken5-start', group:'eiken', label:'英検5級', subtitle:'START 30・基本語彙', source:'tag'},
    {id:'toeic550-start', group:'adult', label:'目指せ TOEIC 550', subtitle:'START 40・基礎語彙', source:'tag'}
  ];

  function wordsForPack(pack) {
    if (!pack) return [];

    if (pack.source === 'tag') {
      return WORDS.filter(w => Array.isArray(w.packs) && w.packs.includes(pack.id));
    }

    if (Number.isInteger(pack.program)) {
      return WORDS.filter(w => (w.programs || []).includes(pack.program));
    }

    return WORDS.filter(w => Array.isArray(w.packs) && w.packs.includes(pack.id));
  }

  const packById = id => PACKS.find(p => p.id === id) || null;

  function preferredPackId() {
    try {
      const preferred = window.EnglishQuestPlayers?.getActivePlayer?.().defaultPack;
      const pack = packById(preferred);
      if (pack && wordsForPack(pack).length) return pack.id;
    } catch (_) {}
    return 'school-p4';
  }

  const stored = (() => {
    try { return localStorage.getItem(STORAGE_KEY) || ''; }
    catch (_) { return ''; }
  })();

  let activePackId = (() => {
    const storedPack = packById(stored);
    if (storedPack && wordsForPack(storedPack).length) return storedPack.id;
    return preferredPackId();
  })();

  const getActivePack = () => packById(activePackId) || packById(preferredPackId()) || PACKS[0];
  const activeWords = () => wordsForPack(getActivePack());
  const activeLabel = () => getActivePack().label;

  function playerName() {
    try { return window.EnglishQuestPlayers?.getActivePlayer?.().name || ''; }
    catch (_) { return ''; }
  }

  function setActivePack(id) {
    const pack = packById(id);
    if (!pack) return false;

    if (testMode) {
      try { notify('TEST MODEを終了してから教材を切り替えてください。'); } catch (_) {}
      return false;
    }

    if (!wordsForPack(pack).length) {
      try { notify(`${pack.label}は、単語データを追加したら選べるようになります。`); } catch (_) {}
      return false;
    }

    if (activePackId === id) return true;

    activePackId = id;
    try { localStorage.setItem(STORAGE_KEY, id); } catch (_) {}

    session = null;
    renderHome();

    if (document.getElementById('library')?.classList.contains('active')) renderLibrary();
    if (document.getElementById('data')?.classList.contains('active')) renderData();

    try { notify(`🗺 ${pack.label}へ移動しました。`); } catch (_) {}
    return true;
  }

  window.EnglishQuestCourses = {
    getActivePack,
    setActivePack,
    getPacks: () => PACKS.map(p => ({...p, total:wordsForPack(p).length})),
    getGroups: () => GROUPS.map(g => ({...g})),
    wordsForPack
  };

  // learning-flow.js の初期互換処理が先に走れるよう、
  // DOMContentLoaded までは従来スコープを維持する。
  const legacy = {
    isFocusWord,
    allFocusWords,
    programLabel,
    lockedFocusWords,
    unlockedFocusCount,
    focusStats,
    baseDueWords,
    unlockNextFocus,
    levelInfo,
    mapInfo
  };

  let scopeEnabled = false;

  isFocusWord = w => scopeEnabled
    ? activeWords().some(x => x.id === w.id)
    : legacy.isFocusWord(w);

  allFocusWords = () => scopeEnabled
    ? activeWords()
    : legacy.allFocusWords();

  function packForWord(w) {
    return PACKS.find(pack => wordsForPack(pack).some(x => x.id === w.id)) || null;
  }

  programLabel = w => {
    if (!scopeEnabled) return legacy.programLabel(w);
    const pack = packForWord(w);
    if (pack) return pack.label;
    const ps = w.programs || [];
    return ps.length ? `P${ps.join('/')}` : '基礎';
  };

  lockedFocusWords = (program = null) => {
    if (!scopeEnabled) return legacy.lockedFocusWords(program);
    return activeWords().filter(w => {
      if (state.records[w.id]?.unlocked) return false;
      if (program === null) return true;
      return (w.programs || []).includes(program);
    });
  };

  unlockedFocusCount = (program = null) => {
    if (!scopeEnabled) return legacy.unlockedFocusCount(program);
    return activeWords().filter(w => {
      if (!state.records[w.id]?.unlocked) return false;
      if (program === null) return true;
      return (w.programs || []).includes(program);
    }).length;
  };

  focusStats = () => scopeEnabled
    ? [{
        p: getActivePack().program ?? getActivePack().label,
        label: activeLabel(),
        total: activeWords().length,
        unlocked: activeWords().filter(w => state.records[w.id]?.unlocked).length
      }]
    : legacy.focusStats();

  // 選択していない教材のdue語が混ざらないようにする。
  baseDueWords = () => scopeEnabled ? [] : legacy.baseDueWords();

  unlockNextFocus = () => {
    if (!scopeEnabled) return legacy.unlockNextFocus();
    const w = lockedFocusWords()[0];
    if (!w) return null;
    const r = state.records[w.id];
    r.unlocked = true;
    r.due = today();
    return w;
  };

  const LEVEL_RATIOS = [0,10/286,25/286,45/286,70/286,100/286,135/286,175/286,215/286,255/286,1];

  function levelThresholds(total) {
    let prev = -1;
    return LEVEL_RATIOS.map((ratio, index) => {
      let n = index ? Math.ceil(total * ratio) : 0;
      n = Math.min(total, n);
      if (index && n <= prev && prev < total) n = prev + 1;
      prev = n;
      return n;
    });
  }

  levelInfo = () => {
    if (!scopeEnabled) return legacy.levelInfo();

    const total = activeWords().length;
    const crowns = focusMasterCount();
    const thresholds = levelThresholds(total);
    let idx = 0;

    thresholds.forEach((n, i) => {
      if (crowns >= n) idx = i;
    });

    const next = thresholds[idx + 1];
    const prev = thresholds[idx] || 0;
    const span = next === undefined ? 1 : Math.max(1, next - prev);

    return {
      level: idx + 1,
      crowns,
      next,
      remaining: next === undefined ? 0 : Math.max(0, next - crowns),
      part: next === undefined ? 100 : Math.min(100, Math.max(0, (crowns - prev) / span * 100)),
      max: next === undefined || crowns >= total
    };
  };

  mapInfo = () => scopeEnabled
    ? ({crowns:focusMasterCount(), idx:0, current:{crowns:0,name:activeLabel()}, next:null})
    : legacy.mapInfo();

  function injectStyle() {
    if (document.getElementById('course-map-style')) return;

    const s = document.createElement('style');
    s.id = 'course-map-style';
    s.textContent = `
      .map-panel .map-track.course-map-groups{display:block;overflow:visible;padding:0}
      .course-group{margin-top:16px}
      .course-group:first-child{margin-top:4px}
      .course-group-title{margin:0 0 8px;font-size:12px;font-weight:950;color:#60718a;letter-spacing:.04em}
      .course-map-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .course-pack{appearance:none;width:100%;min-width:0;text-align:left;border:1px solid #d2dce8;border-radius:15px;background:#f8fafc;color:#21344d;padding:13px 14px;cursor:pointer}
      .course-pack.current{border-color:#5267b8;background:#eef1ff;box-shadow:inset 0 0 0 1px rgba(82,103,184,.15)}
      .course-pack.locked{opacity:.58;cursor:not-allowed}
      .course-pack-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:7px}
      .course-pack strong{display:block;font-size:15px}
      .course-pack-badge{flex:0 0 auto;font-size:10px;font-weight:900;border-radius:999px;padding:4px 7px;background:#e8edf4;color:#607087}
      .course-pack.current .course-pack-badge{background:#5369bc;color:#fff}
      .course-pack small{display:block;color:#6f7d90;line-height:1.45}
      .course-pack-progress{margin-top:7px;font-size:12px;font-weight:850;color:#354a66}
      .course-map-note{margin-top:11px;color:#718095;font-size:12px;line-height:1.55}
      @media(max-width:520px){.course-map-grid{grid-template-columns:1fr}}
    `;
    document.head.appendChild(s);
  }

  function renderCourseMap() {
    const track = el('map-track');
    const place = el('map-place');
    const next = el('map-next');
    if (!track || !place || !next) return;

    const active = getActivePack();
    place.textContent = active.label;
    track.className = 'map-track course-map-groups';
    track.replaceChildren();

    GROUPS.forEach(group => {
      const groupPacks = PACKS.filter(p => p.group === group.id);
      if (!groupPacks.length) return;

      const section = document.createElement('section');
      section.className = 'course-group';

      const h = document.createElement('h3');
      h.className = 'course-group-title';
      h.textContent = `${group.icon} ${group.label}`;

      const grid = document.createElement('div');
      grid.className = 'course-map-grid';

      groupPacks.forEach(pack => {
        const words = wordsForPack(pack);
        const total = words.length;
        const mastered = words.filter(w => state.records[w.id]?.mastered).length;
        const unlockedCount = words.filter(w => state.records[w.id]?.unlocked).length;
        const enabled = total > 0;
        const current = active.id === pack.id;

        const b = document.createElement('button');
        b.type = 'button';
        b.className = `course-pack${current ? ' current' : ''}${enabled ? '' : ' locked'}`;
        b.disabled = !enabled;

        const top = document.createElement('div');
        top.className = 'course-pack-top';

        const title = document.createElement('strong');
        title.textContent = pack.label;

        const badge = document.createElement('span');
        badge.className = 'course-pack-badge';
        badge.textContent = current ? 'NOW' : enabled ? '移動' : '準備中';

        top.append(title, badge);

        const sub = document.createElement('small');
        sub.textContent = enabled ? pack.subtitle : `${pack.subtitle}・単語未登録`;

        const prog = document.createElement('div');
        prog.className = 'course-pack-progress';
        prog.textContent = enabled
          ? `👑 ${mastered} / ${total}　図鑑 ${unlockedCount}`
          : 'データ追加後に選択できます';

        b.append(top, sub, prog);
        if (enabled) b.addEventListener('click', () => setActivePack(pack.id));
        grid.appendChild(b);
      });

      section.append(h, grid);
      track.appendChild(section);
    });

    next.textContent = `${active.label}を学習中。`;

    let note = document.getElementById('course-map-note');
    if (!note) {
      note = document.createElement('p');
      note.id = 'course-map-note';
      note.className = 'course-map-note';
      track.insertAdjacentElement('afterend', note);
    }
    note.textContent = '教材を切り替えても、ほかの教材の記録は残ります。';
  }

  renderAdventure = () => {
    if (!el('hero-key')) return;

    const gear = allEquipment();
    const crowns = focusMasterCount();
    const total = allFocusWords().length;
    const pct = total ? crowns / total * 100 : 0;

    el('crown-count').textContent = crowns;
    const crownTotal = el('crown-count')?.parentElement?.querySelector('small');
    if (crownTotal) crownTotal.textContent = `/ ${total}`;

    el('adventure-summary').textContent = crowns
      ? `${activeLabel()}で王冠が${crowns}個。覚えたことが、ちゃんと装備になっています。`
      : `${activeLabel()}の冒険を開始。できることが増えると、少しずつ装備が変わります。`;

    setGearUi('shoes', gear.shoes);
    setGearUi('shield', gear.shield);
    setGearUi('sword', gear.sword);
    setGearUi('outfit', gear.outfit);
    renderHeroGear(gear);

    renderCourseMap();

    if (el('boss-title')) el('boss-title').textContent = '覚えているか、試してみる。';
    if (el('boss-message')) el('boss-message').textContent = '範囲と出題方法を選んで、何問でもテストできます。';
    if (el('boss-lock')) {
      el('boss-lock').textContent = 'TEST';
      el('boss-lock').classList.add('ready');
    }

    el('avatar-caption').textContent = pct >= 90 ? '本番へ向かう冒険者' : pct >= 30 ? '歩いてきた冒険者' : 'ことばの冒険者';
  };

  const oldRenderHome = renderHome;
  renderHome = function() {
    oldRenderHome();

    const pack = getActivePack();
    const words = activeWords();
    const total = words.length;
    const unlockedCount = words.filter(w => state.records[w.id]?.unlocked).length;
    const left = lockedFocusWords().length;

    if (el('unlocked-stat')) el('unlocked-stat').textContent = `${unlockedCount}語`;
    if (el('master-stat')) el('master-stat').textContent = `${focusMasterCount()} / ${total}`;

    const banner = document.querySelector('.focus-banner');
    const bannerStrong = banner?.querySelector('strong');
    if (bannerStrong) bannerStrong.textContent = pack.label;

    if (el('focus-status')) {
      el('focus-status').textContent = `ACTIVE MAP　${pack.label}　｜　${total}語　｜　👑 ${focusMasterCount()} / ${total}`;
    }

    if (!testMode && el('home-message')) {
      el('home-message').textContent = `現在は${pack.label}。新しい語は「見る→言う→書く」、その後はMIXで定着を確認します。`;
    }

    if (el('unlock-btn')) {
      el('unlock-btn').textContent = testMode
        ? 'TEST MODEでは追加しません'
        : left
          ? `${pack.label}を${Math.min(5, left)}語追加する`
          : `${pack.label}はすべて図鑑に登録済み`;
    }

    updateTestControls();
  };

  // 図鑑は「今選んでいる教材」だけに絞る。
  renderLibrary = function() {
    const root = el('library-list');
    root.replaceChildren();

    const words = activeWords()
      .filter(w => state.records[w.id]?.unlocked)
      .sort((a,b) => a.en.localeCompare(b.en));

    words.forEach(w => {
      const rec = state.records[w.id];
      const row = document.createElement('div');
      row.className = 'word-row';

      const left = document.createElement('div');
      const tag = document.createElement('span');
      tag.className = 'program-tag';
      tag.textContent = activeLabel();
      const en = document.createElement('strong');
      en.textContent = w.en;
      const jp = document.createElement('small');
      jp.textContent = w.jp;
      left.append(tag, en, jp);

      const right = document.createElement('div');
      right.className = 'state';
      const stars = document.createElement('div');
      stars.className = 'stars';
      stars.textContent = stageStars(rec);
      const label = document.createElement('div');
      label.textContent = stageName(rec);
      const next = document.createElement('div');
      next.className = 'due';
      next.textContent = `次回：${rec.due} / 正解 ${rec.correct}/${rec.attempts}`;
      right.append(stars, label, next);

      row.append(left, right);
      root.append(row);
    });

    const intro = document.querySelector('#library .intro');
    const quiet = document.querySelector('#library .quiet');
    if (intro) intro.textContent = `${activeLabel()}の図鑑。マップを切り替えると教材ごとに確認できます。`;
    if (quiet) quiet.textContent = words.length ? `${words.length}語を表示中。` : 'まだ図鑑に登録された語はありません。';
  };

  const oldRenderData = renderData;
  renderData = function() {
    oldRenderData();

    const total = activeWords().length;
    const unlockedCount = activeWords().filter(w => state.records[w.id]?.unlocked).length;
    const name = playerName();

    if (el('overall-summary')) {
      el('overall-summary').textContent = testMode
        ? `シミュレーション / ${activeLabel()} ${total}語 / Step1 ${focusStageCount(1)} / Step2 ${focusStageCount(2)} / Step3 ${focusStageCount(3)} / 王冠 ${focusMasterCount()}`
        : `${name ? `${name} / ` : ''}累計 ${state.xp} EXP / ${activeLabel()} ${unlockedCount}/${total}語 / 王冠 ${focusMasterCount()}`;
    }

    updateTestControls();
  };

  const oldRenderResult = renderResult;
  renderResult = function() {
    oldRenderResult();
    if (el('result-message')) {
      el('result-message').textContent = `今回は${activeLabel()}を学習しました。ここで終了してOK。余力がある日だけ、もう5語へ。`;
    }
  };

  const TEST_RATIOS = [0,.05,.15,.30,.50,.75,1];

  function markBaseTestPresets() {
    [...document.querySelectorAll('#test-presets button[data-count]')].slice(0,7).forEach((b,i) => {
      b.dataset.courseBasePreset = String(i);
    });
  }

  function updateTestControls() {
    const total = activeWords().length;

    document.querySelectorAll('.test-fields input[type="number"]').forEach(input => {
      input.max = String(total);
    });

    document.querySelectorAll('#test-presets button[data-course-base-preset]').forEach(button => {
      const index = Number(button.dataset.courseBasePreset);
      const ratio = TEST_RATIOS[index] ?? 0;
      const count = Math.min(total, Math.ceil(total * ratio));
      button.dataset.count = String(count);
      button.textContent = String(count);
      button.title = `${activeLabel()} ${Math.round(ratio * 100)}%`;
    });
  }

  function initCourseMap() {
    injectStyle();
    scopeEnabled = true;
    markBaseTestPresets();
    updateTestControls();

    try { renderHome(); } catch (_) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCourseMap, {once:true});
  } else {
    initCourseMap();
  }
})();
