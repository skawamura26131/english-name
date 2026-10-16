ENGLISH QUEST — COURSE MAP v1.0

今回のアップデート
==================
まず「PROGRAM 4をマップで選んで学習できる」状態を作ります。

PROGRAM 3
  章末まとめ（現在は単語データ未登録なので準備中）

PROGRAM 4
  71語
  今回のデフォルト。最初にここが選ばれます。

PROGRAM 5
  65語
  既存データ・既存進捗をそのまま使えます。

PROGRAM 6
  150語
  既存データ・既存進捗をそのまま使えます。

マップを切り替えても、ほかのPROGRAMの学習記録は消えません。

今回変わるもの
==============
・通常学習：選択中のPROGRAMだけから出題
・自動単語追加：選択中のPROGRAMだけを追加
・王冠、Step1/2/3表示：選択中PROGRAMを分母に表示
・単語図鑑：選択中PROGRAMを優先表示。他PROGRAMの記録も残す
・TEST MODE：選択中PROGRAMの語数に合わせて上限とプリセットを自動調整
・BOSS v0.1：当面は現在選択中PROGRAMから5問出題

装備
====
gear-layer.js を v1.8.0 に更新します。
最初の取得は今まで通り、靴3語・盾5語・剣8語。
その後の7段階は現在選択している教材パックの総語数に合わせて自動でスケールします。
装備トースト履歴もPROGRAMごとに分けます。

将来拡張
========
内部的にはPROGRAMではなく「教材パック」として扱います。
将来の例：
  school-p4
  toeic-550-unit1
  enjoy-simple-english-2026-10-week1

単語データに packs: ['toeic-550-unit1'] のようなタグを追加すれば、
同じ学習エンジンへ載せられる設計です。

今回はまだ app.js から単語データを分離しません。
PROGRAM 4選択を安全に動かすことを優先します。

導入方法
========
1. course-layer.js をリポジトリ直下へアップロード
2. gear-layer.js を今回の v1.8.0 に置き換え
3. index.html の script 部分を次の順にします：

<script src="./app.js?v=1.5p456kv" defer></script>
<script src="./learning-flow.js?v=1.0mix" defer></script>
<script src="./course-layer.js?v=1.0map" defer></script>
<script src="./gear-layer.js?v=1.8pack" defer></script>
<script src="./boss-layer.js?v=0.1" defer></script>

4. GitHub Pages反映後に再読み込み

確認ポイント
============
1. ADVENTURE MAP に PROGRAM 3 / 4 / 5 / 6 が表示される
2. 最初は PROGRAM 4 が NOW
3. PROGRAM 4 が71語
4. PROGRAM 5は65語、PROGRAM 6は150語
5. PROGRAM 3は準備中で押せない
6. マップ切替で既存記録が消えない
7. PROGRAM 4で学習するとP4だけ出題される
8. TEST MODEの上限・プリセットが71語基準になる
9. PROGRAM 4でも装備7段階まで確認できる
