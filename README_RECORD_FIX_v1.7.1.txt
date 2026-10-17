ENGLISH QUEST — RECORD FIX v1.7.1

原因
====
app.js 起動時の migrate() は、app.js 内に最初からある単語だけで
学習記録を再構成していました。
P3 / 英検5級 / TOEIC550 は content-packs.js で後から追加するため、
再読込のたびに、その単語の進捗が失われていました。
PLAYER切替で再読込するので、切替バグのように見えていました。

修正
====
新規の record-fix.js を1ファイル追加します。
app.js の起動前に、追加単語の記録を退避。
content-packs.js の読み込み後に進捗を戻します。
JSON読込時の migrate() も補強し、今後の追加単語でも進捗を維持します。

変更する index.html（先頭部分のscriptは以下の順番）
=================================================
<script src="./player-layer.js?v=1.7familydata" defer></script>
<script src="./record-fix.js?v=1.7.1" defer></script>
<script src="./app.js?v=1.5p456kv" defer></script>
<script src="./content-packs.js?v=1.0starter" defer></script>
<script src="./answer-fix.js?v=1.0tilde" defer></script>
<script src="./learning-flow.js?v=1.0mix" defer></script>
<script src="./course-layer.js?v=1.1family" defer></script>
<script src="./gear-layer.js?v=1.8pack" defer></script>
<script src="./boss-layer.js?v=0.2test" defer></script>

player-layer.js v1.7 の置換は不要。ほかのJSも変更不要。

確認方法
========
1. 変更前に現在の学習データをJSONバックアップ
2. GitHub直下に record-fix.js をアップロード
3. index.html に上記の1行を追加
4. 大人のTOEIC550で新しい1語を最後まで学習
5. 同じタブで「再読み込み」して進捗が残るか確認
6. 中学生→大人→中学生→大人と切り替えても残るか確認
7. 英検5級/P3でも確認

すでに失われた進捗は自動復元できません。
ただし、v1.7導入前のバックアップやPC側のJSONが残っているなら復旧可能です。

注意
====
スマホとPCは自動同期しません。
中学生の旧PCデータは、選択中PLAYERが中学生の状態でJSONを読込してください。
