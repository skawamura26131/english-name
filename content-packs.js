'use strict';

/* ENGLISH QUEST — EXTRA CONTENT PACKS v1.0 */
(() => {
  const EXTRA_WORDS = [
    // ------------------------------------------------------------
    // PROGRAM 3 / Power-Up 2 — uploaded test range
    // ------------------------------------------------------------
    {id:'p3-pu2-bring',en:'bring',jp:'持ってくる、連れてくる',programs:[3],packs:['school-p3-review']},
    {id:'p3-pu2-bye',en:'bye',jp:'さようなら、じゃあね',programs:[3],packs:['school-p3-review']},
    {id:'p3-pu2-field-trip',en:'field trip',jp:'校外見学',programs:[3],packs:['school-p3-review']},
    {id:'p3-pu2-may',en:'may',jp:'〜してもよい',programs:[3],packs:['school-p3-review']},
    {id:'p3-pu2-moment',en:'moment',jp:'瞬間、ちょっとの間',programs:[3],packs:['school-p3-review']},
    {id:'p3-pu2-number',en:'number',jp:'（電話・住所などの）番号',programs:[3],packs:['school-p3-review']},
    {id:'p3-pu2-water-bottle',en:'water bottle',jp:'水筒',programs:[3],packs:['school-p3-review']},
    {id:'p3-pu2-wrong',en:'wrong',jp:'間違った',programs:[3],packs:['school-p3-review']},
    {id:'p3-pu2-help-with',en:'help ~ with ...',jp:'〜の…を手伝う',programs:[3],packs:['school-p3-review'],answers:['help with']},
    {id:'p3-pu2-hold-on',en:'Hold on.',jp:'（電話で）お待ちください。',programs:[3],packs:['school-p3-review']},
    {id:'p3-pu2-just-a-moment',en:'Just a moment.',jp:'少々お待ちください。',programs:[3],packs:['school-p3-review']},
    {id:'p3-pu2-may-i',en:'May I ~?',jp:'〜してもよろしいですか。',programs:[3],packs:['school-p3-review'],answers:['May I']},

    // ------------------------------------------------------------
    // 英検5級 START 30 — original starter pack
    // ------------------------------------------------------------
    {id:'e5-hello',en:'hello',jp:'こんにちは',programs:[],packs:['eiken5-start']},
    {id:'e5-goodbye',en:'goodbye',jp:'さようなら',programs:[],packs:['eiken5-start']},
    {id:'e5-please',en:'please',jp:'どうぞ、お願いします',programs:[],packs:['eiken5-start']},
    {id:'e5-thank-you',en:'thank you',jp:'ありがとう',programs:[],packs:['eiken5-start']},
    {id:'e5-family',en:'family',jp:'家族',programs:[],packs:['eiken5-start']},
    {id:'e5-father',en:'father',jp:'父',programs:[],packs:['eiken5-start']},
    {id:'e5-mother',en:'mother',jp:'母',programs:[],packs:['eiken5-start']},
    {id:'e5-brother',en:'brother',jp:'兄、弟、兄弟',programs:[],packs:['eiken5-start']},
    {id:'e5-sister',en:'sister',jp:'姉、妹、姉妹',programs:[],packs:['eiken5-start']},
    {id:'e5-friend',en:'friend',jp:'友だち',programs:[],packs:['eiken5-start']},
    {id:'e5-school',en:'school',jp:'学校',programs:[],packs:['eiken5-start']},
    {id:'e5-teacher',en:'teacher',jp:'先生',programs:[],packs:['eiken5-start']},
    {id:'e5-student',en:'student',jp:'生徒、学生',programs:[],packs:['eiken5-start']},
    {id:'e5-classroom',en:'classroom',jp:'教室',programs:[],packs:['eiken5-start']},
    {id:'e5-homework',en:'homework',jp:'宿題',programs:[],packs:['eiken5-start']},
    {id:'e5-breakfast',en:'breakfast',jp:'朝食',programs:[],packs:['eiken5-start']},
    {id:'e5-lunch',en:'lunch',jp:'昼食',programs:[],packs:['eiken5-start']},
    {id:'e5-dinner',en:'dinner',jp:'夕食',programs:[],packs:['eiken5-start']},
    {id:'e5-water',en:'water',jp:'水',programs:[],packs:['eiken5-start']},
    {id:'e5-milk',en:'milk',jp:'牛乳',programs:[],packs:['eiken5-start']},
    {id:'e5-go',en:'go',jp:'行く',programs:[],packs:['eiken5-start']},
    {id:'e5-come',en:'come',jp:'来る',programs:[],packs:['eiken5-start']},
    {id:'e5-eat',en:'eat',jp:'食べる',programs:[],packs:['eiken5-start']},
    {id:'e5-drink',en:'drink',jp:'飲む',programs:[],packs:['eiken5-start']},
    {id:'e5-play',en:'play',jp:'遊ぶ、（スポーツなどを）する',programs:[],packs:['eiken5-start']},
    {id:'e5-study',en:'study',jp:'勉強する',programs:[],packs:['eiken5-start']},
    {id:'e5-read',en:'read',jp:'読む',programs:[],packs:['eiken5-start']},
    {id:'e5-write',en:'write',jp:'書く',programs:[],packs:['eiken5-start']},
    {id:'e5-speak',en:'speak',jp:'話す',programs:[],packs:['eiken5-start']},
    {id:'e5-listen',en:'listen',jp:'聞く',programs:[],packs:['eiken5-start']},

    // ------------------------------------------------------------
    // 目指せ TOEIC 550 START 40 — original starter pack
    // ------------------------------------------------------------
    {id:'t550-meeting',en:'meeting',jp:'会議、打ち合わせ',programs:[],packs:['toeic550-start']},
    {id:'t550-schedule',en:'schedule',jp:'予定、日程',programs:[],packs:['toeic550-start']},
    {id:'t550-office',en:'office',jp:'事務所、オフィス',programs:[],packs:['toeic550-start']},
    {id:'t550-customer',en:'customer',jp:'客、顧客',programs:[],packs:['toeic550-start']},
    {id:'t550-staff',en:'staff',jp:'職員、スタッフ',programs:[],packs:['toeic550-start']},
    {id:'t550-department',en:'department',jp:'部門、部署',programs:[],packs:['toeic550-start']},
    {id:'t550-order',en:'order',jp:'注文、注文する',programs:[],packs:['toeic550-start']},
    {id:'t550-report',en:'report',jp:'報告書、報告する',programs:[],packs:['toeic550-start']},
    {id:'t550-reservation',en:'reservation',jp:'予約',programs:[],packs:['toeic550-start']},
    {id:'t550-appointment',en:'appointment',jp:'約束、予約',programs:[],packs:['toeic550-start']},
    {id:'t550-available',en:'available',jp:'利用できる、空いている',programs:[],packs:['toeic550-start']},
    {id:'t550-confirm',en:'confirm',jp:'確認する',programs:[],packs:['toeic550-start']},
    {id:'t550-contact',en:'contact',jp:'連絡する、連絡',programs:[],packs:['toeic550-start']},
    {id:'t550-provide',en:'provide',jp:'提供する',programs:[],packs:['toeic550-start']},
    {id:'t550-require',en:'require',jp:'必要とする、要求する',programs:[],packs:['toeic550-start']},
    {id:'t550-attend',en:'attend',jp:'出席する',programs:[],packs:['toeic550-start']},
    {id:'t550-submit',en:'submit',jp:'提出する',programs:[],packs:['toeic550-start']},
    {id:'t550-purchase',en:'purchase',jp:'購入、購入する',programs:[],packs:['toeic550-start']},
    {id:'t550-price',en:'price',jp:'価格',programs:[],packs:['toeic550-start']},
    {id:'t550-discount',en:'discount',jp:'割引',programs:[],packs:['toeic550-start']},
    {id:'t550-receipt',en:'receipt',jp:'領収書、レシート',programs:[],packs:['toeic550-start']},
    {id:'t550-service',en:'service',jp:'サービス、業務',programs:[],packs:['toeic550-start']},
    {id:'t550-arrive',en:'arrive',jp:'到着する',programs:[],packs:['toeic550-start']},
    {id:'t550-depart',en:'depart',jp:'出発する',programs:[],packs:['toeic550-start']},
    {id:'t550-delay',en:'delay',jp:'遅れ、遅らせる',programs:[],packs:['toeic550-start']},
    {id:'t550-flight',en:'flight',jp:'航空便、フライト',programs:[],packs:['toeic550-start']},
    {id:'t550-hotel',en:'hotel',jp:'ホテル',programs:[],packs:['toeic550-start']},
    {id:'t550-ticket',en:'ticket',jp:'切符、チケット',programs:[],packs:['toeic550-start']},
    {id:'t550-local',en:'local',jp:'地元の、地域の',programs:[],packs:['toeic550-start']},
    {id:'t550-recent',en:'recent',jp:'最近の',programs:[],packs:['toeic550-start']},
    {id:'t550-application',en:'application',jp:'申込書、応募',programs:[],packs:['toeic550-start']},
    {id:'t550-deadline',en:'deadline',jp:'締め切り',programs:[],packs:['toeic550-start']},
    {id:'t550-equipment',en:'equipment',jp:'設備、機器',programs:[],packs:['toeic550-start']},
    {id:'t550-repair',en:'repair',jp:'修理、修理する',programs:[],packs:['toeic550-start']},
    {id:'t550-on-time',en:'on time',jp:'時間どおりに',programs:[],packs:['toeic550-start']},
    {id:'t550-in-advance',en:'in advance',jp:'前もって',programs:[],packs:['toeic550-start']},
    {id:'t550-be-interested-in',en:'be interested in ~',jp:'〜に興味がある',programs:[],packs:['toeic550-start'],answers:['be interested in']},
    {id:'t550-be-responsible-for',en:'be responsible for ~',jp:'〜を担当している、〜に責任がある',programs:[],packs:['toeic550-start'],answers:['be responsible for']},
    {id:'t550-look-forward-to',en:'look forward to ~',jp:'〜を楽しみにする',programs:[],packs:['toeic550-start'],answers:['look forward to']},
    {id:'t550-as-soon-as-possible',en:'as soon as possible',jp:'できるだけ早く',programs:[],packs:['toeic550-start']}
  ];

  const existing = new Set(WORDS.map(w => w.id));
  const added = EXTRA_WORDS.filter(w => !existing.has(w.id));
  WORDS.push(...added);

  function ensureStateRecords(target) {
    if (!target || !target.records) return;

    added.forEach(word => {
      if (!target.records[word.id]) target.records[word.id] = defaultRecord(false);
    });

    if (target.daySnapshot?.records) {
      added.forEach(word => {
        if (!target.daySnapshot.records[word.id]) {
          target.daySnapshot.records[word.id] = defaultRecord(false);
        }
      });
    }
  }

  ensureStateRecords(state);
  if (liveState !== state) ensureStateRecords(liveState);
  if (testState) ensureStateRecords(testState);

  if (!testMode) {
    try { persist(); } catch (_) {}
  }

  window.EnglishQuestExtraPacks = {
    words: EXTRA_WORDS.map(w => ({...w})),
    counts: {
      p3: EXTRA_WORDS.filter(w => w.packs?.includes('school-p3-review')).length,
      eiken5: EXTRA_WORDS.filter(w => w.packs?.includes('eiken5-start')).length,
      toeic550: EXTRA_WORDS.filter(w => w.packs?.includes('toeic550-start')).length
    }
  };
})();
