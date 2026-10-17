ENGLISH QUEST — RECORD FIX v1.7.2

v1.7.1からの修正点：
defer読み込み中の document.readyState = interactive で、
app.jsの起動前に修正処理が走って終了する問題を修正。
全deferスクリプトの実行後に発生するDOMContentLoadedを待ちます。

導入：
1. record-fix.js を今回のファイルで上書き
2. index.html で次の行を変更
   <script src="./record-fix.js?v=1.7.2" defer></script>

ロード順：
  player-layer.js
  record-fix.js
  app.js
  content-packs.js
  answer-fix.js
  learning-flow.js
  course-layer.js
  gear-layer.js
  boss-layer.js

右上が v1.7.2 · FAMILY DATA になれば処理実行を確認できます。

※一度既に消えた単語進捗は自動復元されません。バックアップから復旧してください。
※初回は学習記録のバックアップJSONを保存するのがおすすめです。
