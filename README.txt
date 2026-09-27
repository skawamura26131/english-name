ENGLISH QUEST v1.1  /  2026-09-27
================================

v1.0 からの更新版です。GitHub Pages の同じリポジトリの root に、
このフォルダ内のファイルを上書きアップロードしてください。

主な更新：
- STAGE 1 → STAGE 2 → STAGE 3 の進行を画面上で分かりやすく表示
- STAGE 3でスペルミスの「抜け・余分・違う文字」を簡単に表示
- TODAY'S QUESTを NEW / REVIEW に分けて表示
- 単語図鑑に ★☆☆ / ★★☆ / ★★★ / 👑 MASTER を表示
- 今日の修行が残っていれば、結果画面から「もう5語」できる
- always / usually / before / after を単語候補に追加
- v1.0 の localStorage 記録を自動移行（EXP・進捗を保持）
- Service Worker を更新し、公開後の新バージョンを取り込みやすく変更

更新手順：
1. GitHub の english-name リポジトリを開く。
2. Add file → Upload files。
3. このZIPを解凍し、中のファイル全部をアップロード。
   同名ファイルは更新対象になります。
4. Commit changes。
5. GitHub PagesのURLを開く。
6. 一度 Ctrl+F5（PC）またはページ再読み込み。まだv1.0ならもう一度再読み込み。
7. 画面右上が v1.1 になれば更新完了。

大事：
- STORE_KEY は v1.0 と同じなので、同じブラウザ・同じサイトURLなら現在の進捗を引き継ぎます。
- 念のため、更新前に「記録 → バックアップJSONを保存」を推奨します。
- PCとiPadは学習履歴が自動同期されません。必要ならJSONで移します。
