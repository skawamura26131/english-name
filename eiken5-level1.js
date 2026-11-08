'use strict';

/*
 * ENGLISH QUEST - EIKEN 5 LEVEL 1, UNIT 2 & 3 (v1.0)
 * 30 + 30 words. Preserve the existing eiken5-start records and IDs.
 * Load AFTER content-packs.js and toeic550-practice.js, BEFORE course-layer.js.
 * RECORD FIX v1.7.3 must remain enabled.
 */
(() => {
  if (window.EnglishQuestEiken5Level1) return;
  const WORD_SET = [
  {
    "id": "e5u2-desk",
    "en": "desk",
    "jp": "机",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "The book is on my desk.",
    "exampleJa": "本は私の机の上にあります。"
  },
  {
    "id": "e5u2-chair",
    "en": "chair",
    "jp": "いす",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "Please sit on this chair.",
    "exampleJa": "このいすに座ってください。"
  },
  {
    "id": "e5u2-table",
    "en": "table",
    "jp": "テーブル",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "There is a cup on the table.",
    "exampleJa": "テーブルの上にコップがあります。"
  },
  {
    "id": "e5u2-book",
    "en": "book",
    "jp": "本",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "I have a new book.",
    "exampleJa": "私は新しい本を持っています。"
  },
  {
    "id": "e5u2-notebook",
    "en": "notebook",
    "jp": "ノート",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "This is my English notebook.",
    "exampleJa": "これは私の英語のノートです。"
  },
  {
    "id": "e5u2-pencil",
    "en": "pencil",
    "jp": "えんぴつ",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "I write with a pencil.",
    "exampleJa": "私はえんぴつで書きます。"
  },
  {
    "id": "e5u2-pen",
    "en": "pen",
    "jp": "ペン",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "This pen is blue.",
    "exampleJa": "このペンは青いです。"
  },
  {
    "id": "e5u2-eraser",
    "en": "eraser",
    "jp": "消しゴム",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "Do you have an eraser?",
    "exampleJa": "消しゴムを持っていますか。"
  },
  {
    "id": "e5u2-bag",
    "en": "bag",
    "jp": "かばん",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "My bag is under the chair.",
    "exampleJa": "私のかばんはいすの下にあります。"
  },
  {
    "id": "e5u2-library",
    "en": "library",
    "jp": "図書館",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "We read books in the library.",
    "exampleJa": "私たちは図書館で本を読みます。"
  },
  {
    "id": "e5u2-music",
    "en": "music",
    "jp": "音楽",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "I like music very much.",
    "exampleJa": "私は音楽がとても好きです。"
  },
  {
    "id": "e5u2-art",
    "en": "art",
    "jp": "美術、芸術",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "We have art on Friday.",
    "exampleJa": "金曜日に美術の授業があります。"
  },
  {
    "id": "e5u2-math",
    "en": "math",
    "jp": "算数、数学",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "Math is my favorite subject.",
    "exampleJa": "算数は私の一番好きな科目です。"
  },
  {
    "id": "e5u2-english",
    "en": "English",
    "jp": "英語",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "I study English every day.",
    "exampleJa": "私は毎日英語を勉強します。"
  },
  {
    "id": "e5u2-science",
    "en": "science",
    "jp": "理科、科学",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "We study science at school.",
    "exampleJa": "私たちは学校で理科を勉強します。"
  },
  {
    "id": "e5u2-soccer",
    "en": "soccer",
    "jp": "サッカー",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "I play soccer after school.",
    "exampleJa": "私は放課後サッカーをします。"
  },
  {
    "id": "e5u2-baseball",
    "en": "baseball",
    "jp": "野球",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "My brother likes baseball.",
    "exampleJa": "私の兄（弟）は野球が好きです。"
  },
  {
    "id": "e5u2-basketball",
    "en": "basketball",
    "jp": "バスケットボール",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "We play basketball on Sunday.",
    "exampleJa": "私たちは日曜日にバスケットボールをします。"
  },
  {
    "id": "e5u2-tennis",
    "en": "tennis",
    "jp": "テニス",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "Can you play tennis?",
    "exampleJa": "テニスができますか。"
  },
  {
    "id": "e5u2-swim",
    "en": "swim",
    "jp": "泳ぐ",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "I can swim in the pool.",
    "exampleJa": "私はプールで泳げます。"
  },
  {
    "id": "e5u2-run",
    "en": "run",
    "jp": "走る",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "I run in the park.",
    "exampleJa": "私は公園で走ります。"
  },
  {
    "id": "e5u2-jump",
    "en": "jump",
    "jp": "跳ぶ、ジャンプする",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "Can you jump high?",
    "exampleJa": "高く跳べますか。"
  },
  {
    "id": "e5u2-sing",
    "en": "sing",
    "jp": "歌う",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "Let us sing a song.",
    "exampleJa": "歌を歌いましょう。"
  },
  {
    "id": "e5u2-dance",
    "en": "dance",
    "jp": "踊る",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "They dance together.",
    "exampleJa": "彼らは一緒に踊ります。"
  },
  {
    "id": "e5u2-draw",
    "en": "draw",
    "jp": "絵を描く",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "I draw a picture.",
    "exampleJa": "私は絵を描きます。"
  },
  {
    "id": "e5u2-make",
    "en": "make",
    "jp": "作る",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "We make a cake.",
    "exampleJa": "私たちはケーキを作ります。"
  },
  {
    "id": "e5u2-use",
    "en": "use",
    "jp": "使う",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "May I use your pen?",
    "exampleJa": "あなたのペンを使ってもいいですか。"
  },
  {
    "id": "e5u2-watch",
    "en": "watch",
    "jp": "（テレビなどを）見る",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "I watch TV after dinner.",
    "exampleJa": "私は夕食後にテレビを見ます。"
  },
  {
    "id": "e5u2-like",
    "en": "like",
    "jp": "好きである",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "I like dogs.",
    "exampleJa": "私は犬が好きです。"
  },
  {
    "id": "e5u2-need",
    "en": "need",
    "jp": "必要とする",
    "programs": [],
    "packs": [
      "eiken5-unit2"
    ],
    "category": "LEVEL 1 / UNIT 2",
    "exampleEn": "I need a pencil.",
    "exampleJa": "私はえんぴつが必要です。"
  },
  {
    "id": "e5u3-morning",
    "en": "morning",
    "jp": "朝",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I eat breakfast every morning.",
    "exampleJa": "私は毎朝朝食を食べます。"
  },
  {
    "id": "e5u3-afternoon",
    "en": "afternoon",
    "jp": "午後",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "We play in the afternoon.",
    "exampleJa": "私たちは午後に遊びます。"
  },
  {
    "id": "e5u3-evening",
    "en": "evening",
    "jp": "夕方、晩",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I read books in the evening.",
    "exampleJa": "私は夕方に本を読みます。"
  },
  {
    "id": "e5u3-night",
    "en": "night",
    "jp": "夜",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I go to bed at night.",
    "exampleJa": "私は夜に寝ます。"
  },
  {
    "id": "e5u3-today",
    "en": "today",
    "jp": "今日",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "Today is Monday.",
    "exampleJa": "今日は月曜日です。"
  },
  {
    "id": "e5u3-tomorrow",
    "en": "tomorrow",
    "jp": "明日",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "See you tomorrow.",
    "exampleJa": "また明日会いましょう。"
  },
  {
    "id": "e5u3-yesterday",
    "en": "yesterday",
    "jp": "昨日",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "Yesterday was Sunday.",
    "exampleJa": "昨日は日曜日でした。"
  },
  {
    "id": "e5u3-monday",
    "en": "Monday",
    "jp": "月曜日",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I have music on Monday.",
    "exampleJa": "月曜日に音楽の授業があります。"
  },
  {
    "id": "e5u3-tuesday",
    "en": "Tuesday",
    "jp": "火曜日",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "We play tennis on Tuesday.",
    "exampleJa": "私たちは火曜日にテニスをします。"
  },
  {
    "id": "e5u3-wednesday",
    "en": "Wednesday",
    "jp": "水曜日",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "My piano lesson is on Wednesday.",
    "exampleJa": "ピアノのレッスンは水曜日です。"
  },
  {
    "id": "e5u3-thursday",
    "en": "Thursday",
    "jp": "木曜日",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I study English on Thursday.",
    "exampleJa": "私は木曜日に英語を勉強します。"
  },
  {
    "id": "e5u3-friday",
    "en": "Friday",
    "jp": "金曜日",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "Friday is my favorite day.",
    "exampleJa": "金曜日は私の好きな曜日です。"
  },
  {
    "id": "e5u3-saturday",
    "en": "Saturday",
    "jp": "土曜日",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "We go shopping on Saturday.",
    "exampleJa": "私たちは土曜日に買い物に行きます。"
  },
  {
    "id": "e5u3-sunday",
    "en": "Sunday",
    "jp": "日曜日",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I play baseball on Sunday.",
    "exampleJa": "私は日曜日に野球をします。"
  },
  {
    "id": "e5u3-time",
    "en": "time",
    "jp": "時刻、時間",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "What time is it?",
    "exampleJa": "今何時ですか。"
  },
  {
    "id": "e5u3-hour",
    "en": "hour",
    "jp": "1時間",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I study for one hour.",
    "exampleJa": "私は1時間勉強します。"
  },
  {
    "id": "e5u3-minute",
    "en": "minute",
    "jp": "分（時間の単位）",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "Please wait one minute.",
    "exampleJa": "1分待ってください。"
  },
  {
    "id": "e5u3-week",
    "en": "week",
    "jp": "週",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I swim twice a week.",
    "exampleJa": "私は週に2回泳ぎます。"
  },
  {
    "id": "e5u3-month",
    "en": "month",
    "jp": "月（1か月）",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "This month is very busy.",
    "exampleJa": "今月はとても忙しいです。"
  },
  {
    "id": "e5u3-before",
    "en": "before",
    "jp": "〜より前に",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I wash my hands before dinner.",
    "exampleJa": "私は夕食前に手を洗います。"
  },
  {
    "id": "e5u3-after",
    "en": "after",
    "jp": "〜の後に",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I play soccer after school.",
    "exampleJa": "私は放課後サッカーをします。"
  },
  {
    "id": "e5u3-early",
    "en": "early",
    "jp": "早く、早い",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I get up early.",
    "exampleJa": "私は早起きします。"
  },
  {
    "id": "e5u3-late",
    "en": "late",
    "jp": "遅い、遅れて",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "Do not be late for school.",
    "exampleJa": "学校に遅れないでください。"
  },
  {
    "id": "e5u3-always",
    "en": "always",
    "jp": "いつも",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I always eat breakfast.",
    "exampleJa": "私はいつも朝食を食べます。"
  },
  {
    "id": "e5u3-sometimes",
    "en": "sometimes",
    "jp": "ときどき",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I sometimes play tennis.",
    "exampleJa": "私はときどきテニスをします。"
  },
  {
    "id": "e5u3-usually",
    "en": "usually",
    "jp": "たいてい、ふだん",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "I usually walk to school.",
    "exampleJa": "私はふだん歩いて学校へ行きます。"
  },
  {
    "id": "e5u3-where",
    "en": "where",
    "jp": "どこ",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "Where is your bag?",
    "exampleJa": "あなたのかばんはどこですか。"
  },
  {
    "id": "e5u3-when",
    "en": "when",
    "jp": "いつ",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "When is your birthday?",
    "exampleJa": "あなたの誕生日はいつですか。"
  },
  {
    "id": "e5u3-why",
    "en": "why",
    "jp": "なぜ",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "Why are you happy?",
    "exampleJa": "なぜうれしいのですか。"
  },
  {
    "id": "e5u3-which",
    "en": "which",
    "jp": "どちらの、どの",
    "programs": [],
    "packs": [
      "eiken5-unit3"
    ],
    "category": "LEVEL 1 / UNIT 3",
    "exampleEn": "Which book is yours?",
    "exampleJa": "どちらの本があなたのですか。"
  }
];

  // Stable word IDs: never replace or rename IDs already in use.
  const knownIds = new Set(WORDS.map(w => w.id));
  const appended = WORD_SET.filter(w => !knownIds.has(w.id));
  WORDS.push(...appended);

  function ensureRecords(target) {
    if (!target?.records) return;
    for (const word of WORD_SET) {
      if (!Object.prototype.hasOwnProperty.call(target.records, word.id)) {
        target.records[word.id] = defaultRecord(false);
      }
      if (target.daySnapshot?.records &&
          !Object.prototype.hasOwnProperty.call(target.daySnapshot.records, word.id)) {
        target.daySnapshot.records[word.id] = defaultRecord(false);
      }
    }
  }

  ensureRecords(state);
  if (liveState !== state) ensureRecords(liveState);
  if (testState) ensureRecords(testState);

  // REGISTER for record-fix.js v1.7.3's DOMContentLoaded restoration.
  // Without this, app.js may drop add-on vocabulary records on reload.
  const extra = window.EnglishQuestExtraPacks;
  if (extra && Array.isArray(extra.words)) {
    const registered = new Set(extra.words.map(w => w.id));
    extra.words.push(...WORD_SET.filter(w => !registered.has(w.id)));
    extra.counts = extra.counts || {};
    extra.counts.eiken5Unit2 = 30;
    extra.counts.eiken5Unit3 = 30;
  } else {
    console.warn('EIKEN5 LEVEL1: content-packs.js is required first.');
  }

  if (!testMode) {
    try { persist(); }
    catch (error) { console.error('EIKEN5 LEVEL1: save failed', error); }
  }

  window.EnglishQuestEiken5Level1 = Object.freeze({
    version:'1.0',
    units:[
      {id:'eiken5-start', label:'基礎①', count:30},
      {id:'eiken5-unit2', label:'基礎②', count:30},
      {id:'eiken5-unit3', label:'基礎③', count:30}
    ]
  });
})();
