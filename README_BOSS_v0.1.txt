ENGLISH QUEST — BOSS v0.1 導入手順

1. boss-layer.js を GitHub リポジトリ直下にアップロード

2. index.html の gear-layer.js の直後に次の1行を追加

<script src="./boss-layer.js?v=0.1" defer></script>

例:
<script src="./app.js?v=1.5p456kv" defer></script>
<script src="./gear-layer.js?v=1.6gear" defer></script>
<script src="./boss-layer.js?v=0.1" defer></script>

3. GitHub Pages反映後に再読み込み

4. TEST MODEで王冠25以上にする
   一括プリセットなら 43（15%）で十分です。
   25王冠以上になると BOSS AHEAD に「ボスに挑む」ボタンが出ます。

BOSS v0.1仕様
- 王冠25個で解放
- MASTER済み単語からランダム5問
- 英語→日本語の4択
- 5問中何問できたかだけ表示
- HPなし
- 合否なし
- 撃破報酬なし
- 装備効果なし
- 学習記録・EXP・王冠・復習日は一切変更しない
- TEST MODEでも動作

将来追加候補
- HP制
- 撃破条件
- 装備効果
- ボス画像
- 報酬
- 撃破履歴
