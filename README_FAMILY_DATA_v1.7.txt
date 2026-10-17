ENGLISH QUEST — FAMILY DATA v1.7

今回の変更
==========
PLAYER保存方式を作り直しました。

旧方式：
PLAYER切替時に english-quest-v1 を
「退避 → 入れ替え → reload」していました。

新方式：
localStorageには1つの家族データ
  english-quest-family-data-v2
を持ち、その中に

  中学生
  小学生
  大人

の学習状態を同時に保存します。

PLAYER切替では activePlayerId だけを変更します。
学習データそのものをコピー・削除・入れ替えしません。


重要
====
player-layer.js は必ず app.js より前に読み込みます。

index.html：

<script src="./player-layer.js?v=1.7familydata" defer></script>
<script src="./app.js?v=1.5p456kv" defer></script>
<script src="./content-packs.js?v=1.0starter" defer></script>
<script src="./answer-fix.js?v=1.0tilde" defer></script>
<script src="./learning-flow.js?v=1.0mix" defer></script>
<script src="./course-layer.js?v=1.1family" defer></script>
<script src="./gear-layer.js?v=1.8pack" defer></script>
<script src="./boss-layer.js?v=0.2test" defer></script>

右上が
  v1.7 · FAMILY DATA
になれば導入成功です。


既存データの移行
================
v1.6系のPLAYER別保存データが残っていれば、
初回だけ自動で FAMILY DATA v2 に取り込みます。

ただし、v1.6で既に上書きされた中学生データは
自動復元できません。

PC側の正常なJSONを持っている場合は：

1. v1.7を導入
2. PLAYER「中学生」を選ぶ
3. 記録 → バックアップJSONを読み込む
4. PROGRAM 4を選び直す

これで読み込んだJSONは「中学生」の領域だけに保存されます。
小学生・大人には影響しません。


確認テスト
==========
導入後、まず以下だけ確認してください。

1. 中学生へ正常JSONを読み込む
2. 中学生のEXPを確認
3. 大人へ切り替える
4. 大人で1語だけ最後まで進める
5. 中学生へ戻る
6. 中学生のEXP・進捗がそのまま
7. 大人へ戻る
8. 大人の1語もそのまま

この往復を何回しても、PLAYER間でデータは移動しません。


バックアップ
============
現在の「バックアップJSON」は、
今までどおり選択中PLAYERだけを書き出します。

家族3人を1ファイルにまとめる「家族全体バックアップ」は
次の小更新で追加可能です。
