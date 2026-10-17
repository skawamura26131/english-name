ENGLISH QUEST — FAMILY / PLAYER v1.0
====================================

今回の更新
----------
1. プレイヤー切り替え
   ・中学生
   ・小学生
   ・大人

   ※ 公開GitHubに家族の実名を置かないため、表示名は汎用名にしています。

2. これまでの学習記録
   初回導入時に、現在のブラウザの記録を自動的に「中学生」へ引き継ぎます。
   小学生・大人は新規データから始まります。

3. PROGRAM 3 / Power-Up 2
   写真で確認した今回の範囲12項目を追加。

   bring
   bye
   field trip
   may
   moment
   number
   water bottle
   wrong
   help ~ with ...
   Hold on.
   Just a moment.
   May I ~?

4. 英検5級
   「START 30」として基本語彙30項目を追加。
   まず使ってみて、次のUnitを追加していく前提です。

5. 大人英語
   「目指せ TOEIC 550 / START 40」として基礎語彙・表現40項目を追加。

6. 教材マップ
   🏫 学校英語
   🏅 英検
   💼 大人英語
   の3グループに整理。

7. TEST AREA
   boss-layer.js v0.2 は変更不要です。
   新しい教材パックを自動認識するので、
   PROGRAM 3 + PROGRAM 4、英検5級、TOEIC 550 も範囲選択できます。


アップロードするファイル
------------------------
新規：player-layer.js
新規：content-packs.js
置換：course-layer.js

既存の以下はそのままでOKです。
answer-fix.js
learning-flow.js
gear-layer.js
boss-layer.js


index.html の script 順
----------------------
ここが重要です。
player-layer.js は必ず app.js より前。
content-packs.js は app.js より後、learning-flow.js より前です。

<script src="./player-layer.js?v=1.0family" defer></script>
<script src="./app.js?v=1.5p456kv" defer></script>
<script src="./content-packs.js?v=1.0starter" defer></script>
<script src="./answer-fix.js?v=1.0tilde" defer></script>
<script src="./learning-flow.js?v=1.0mix" defer></script>
<script src="./course-layer.js?v=1.1family" defer></script>
<script src="./gear-layer.js?v=1.8pack" defer></script>
<script src="./boss-layer.js?v=0.2test" defer></script>


導入後の確認
------------
1. 画面上部に PLAYER が出る
2. 「中学生」に今までのEXP・王冠・P4進捗が残っている
3. 「小学生」へ切り替えると新規データになる
4. 小学生の初期マップが「英検5級」になる
5. 「大人」の初期マップが「目指せ TOEIC 550」になる
6. 中学生の学校英語に PROGRAM 3 が12語で表示される
7. TEST AREAで PROGRAM 3 + PROGRAM 4 を同時に選択できる
8. 英検5級 / TOEIC 550 も通常学習とTEST AREAの両方で使える
9. プレイヤーを戻すと、それぞれの記録が元のまま残っている


バックアップについて
--------------------
従来の「バックアップJSON」は現在選択中のプレイヤーの学習記録を保存します。
プレイヤーごとに別々にバックアップする場合は、切り替えてからJSON保存してください。

PC → スマホの移行をする場合は、まずスマホ側で「中学生」を選び、
従来どおりPCのJSONを読み込んでください。
