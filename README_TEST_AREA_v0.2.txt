ENGLISH QUEST — TEST AREA v0.2

今回の内容
==========
BOSS v0.1 を、試験前の「範囲テスト」に置き換えます。

できること
----------
・PROGRAM 4 / 5 / 6 を複数選択
・PROGRAM 3 は単語データ追加後に自動で選択可能
・MIX / 見る / 言う / 書く
・10問 / 20問 / 全範囲 / ひたすら
・1周するまでは同じ単語を原則重複させない
・結果で間違えた語を一覧表示
・間違えた語だけ再テスト
・EXP / 王冠 / 復習日 / 通常学習履歴は変更しない

「〜」入力修正
==============
answer-fix.js も同梱しています。
STEP3で ~ / ～ / 〜 は空所記号として採点対象から外します。

例：
hear from ~
hear from ～
hear from 〜
hear from

は同じ答えとして扱います。

導入
====
1. answer-fix.js をリポジトリ直下へ追加
2. boss-layer.js を今回のファイルへ置き換え
3. index.html の script を次の順番にする

<script src="./app.js?v=1.5p456kv" defer></script>
<script src="./answer-fix.js?v=1.0tilde" defer></script>
<script src="./learning-flow.js?v=1.0mix" defer></script>
<script src="./course-layer.js?v=1.0map" defer></script>
<script src="./gear-layer.js?v=1.7early" defer></script>
<script src="./boss-layer.js?v=0.2test" defer></script>

※ gear-layer.js は今使っているものをそのままでOKです。

確認ポイント
============
1. ホーム下部が TEST AREA になる
2. 範囲を複数選べる
3. 10 / 20 / 全範囲 / ひたすら が動く
4. MIXで見る・言う・書くが混ざる
5. ひたすらモードで「ここで結果を見る」が使える
6. 間違えた語だけ再テストできる
7. テスト前後でEXP・王冠が変わらない
8. 通常学習STEP3で「~」を入力しなくても正解になる
