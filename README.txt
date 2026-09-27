ENGLISH QUEST v1.0  /  2026-09-17
================================
これは「PC・iPad共用、単語の修行の塔」の静的Webアプリです。
GitHubアカウントとWebサイト公開操作はご本人にお願いします。

入っているファイル：
index.html / style.css / app.js / manifest.webmanifest /
service-worker.js / icon-192.png / icon-512.png / README.txt / .nojekyll

1. GitHubアカウントを作る：https://github.com/signup
   自分でメールアドレス確認やパスワード設定を行ってください。
2. 新しいリポジトリを作る：名前 english-quest / Public / Create repository。
3. リポジトリの「Add file」→「Upload files」。
   ZIP自体はアップロードせず、解凍したフォルダ内のファイルをすべて
   リポジトリの一番上（root）にアップロードしてコミットします。
   ※.nojekyllは隠しファイルなので、見えなければ後でGitHub上で作成できます。
4. 「Settings」→「Pages」→「Build and deployment」→
   Source: Deploy from a branch / Branch: main / Folder: /(root) → Save。
5. GitHubのPages設定に表示された公開URLをPCで開いて動作を確認します。
   URLの例：https://ユーザー名.github.io/english-quest/
6. iPadのSafariで同URLを開く→共有→ホーム画面に追加→
   「Webアプリとして開く」をオン→追加。

注意：
- GitHub Pagesで公開したHTML/JSや問題用の単語データは世界中から閲覧可能です。
  本名、学校名、答案、学習履歴、パスワードはリポジトリに入れないこと。
- 学習履歴はブラウザ内にだけ保存されます。PC/iPad間の自動同期はありません。
  PCの「記録」でJSONを書き出し、iPad版の「記録」で読み込めば引き継げます。
  端末を切り替える前には、最新の端末からバックアップしてください。
- Safariとホーム画面版で保存領域が別になることがあります。
  ホーム画面版の利用開始後はそちらを優先して、JSONをバックアップしてください。
- プライベートブラウズやブラウザデータ削除は履歴消失につながることがあります。
- オフライン利用はGitHub PagesのHTTPS公開後、通信中の初回読込で準備されます。
  保存領域やブラウザ設定により必ず使える保証はありません。
- 音声認識は使っていません。STAGE 2は自分で「言えた / まだ」を判定します。
- STAGE 3はキーボード入力です。Apple Pencil手書き認識は未実装です。
- EXPはPDFから54EXPを初期引継ぎし、アプリ内の新たな試行だけ加算します。
- 最初の5語以降は本人が任意のタイミングで5語ずつ追加できます。
