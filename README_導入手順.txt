ENGLISH QUEST — 英検5級・LEVEL 1 拡張 v1.0

既存START30はそのまま「基礎①」。新規60語で合計90語。
  基礎① 30語：既存START30（記録を維持）
  基礎② 30語：学校、教科、スポーツ、動作
  基礎③ 30語：時間、曜日、頻度、疑問詞

【GitHubへアップロード】
1. eiken5-level1.js を新規追加（index.htmlと同じ階層）
2. course-layer.js 内の PACKS 配列で、
   eiken5-start の行のすぐ後に COURSE_LAYER_2_LINES.txt の2行を追加
3. index.html のスクリプト順を次のようにする。

<script src="./content-packs.js?v=1.0starter" defer></script>
<script src="./toeic550-practice.js?v=1.0" defer></script>
<script src="./eiken5-level1.js?v=1.0" defer></script>
<script src="./answer-fix.js?v=1.0tilde" defer></script>
<script src="./learning-flow.js?v=1.0mix" defer></script>
<script src="./course-layer.js?v=1.3eiken5level1" defer></script>

player-layer.js / record-fix.js?v=1.7.3 / app.js /
toeic-steps.js / writing-drill.js は変更しないでください。

【確認】
1. 更新前に小学生の「記録」→JSONバックアップを保存
2. 小学生を選び、英検マップに「基礎②」「基礎③」があるか確認
3. 基礎②で「今日の修行」→5語→見て/言って/書く
4. 小学生→中学生→小学生に切り替え、進捗が保持されるか確認
5. 基礎① START30 の既存記録が残っていることを確認

【使い方の提案】
1日5語。まず基礎①から。次の単元へ進む目安は、
「30語のうち8割程度を見て意味がわかり、弱点を特訓できる」こと。
王冠30個を強制条件にせず、必要に応じて戻って復習可能。
学習が日付で打ち止めになったら、TEST AREAのMIXや書き取り特訓で復習可能。

【重要】
単元の難易度は家庭学習向け独自分類であり、英検協会の公式分類ではありません。
今回のアップデートは英検5級全範囲の完成版ではありません。

【既存の学習データ】
既存単語のIDは変更しません。新規60単語だけ追加します。
記録の初期化・PLAYER別保存方式の変更は行いません。
