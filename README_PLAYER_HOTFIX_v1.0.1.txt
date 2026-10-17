ENGLISH QUEST — FAMILY PLAYER HOTFIX v1.0.1

症状
====
PLAYERを切り替えたあと、元のプレイヤーのEXP・図鑑・王冠が
別プレイヤーのデータで上書きされることがありました。

原因
====
v1.0では切替時に、
  元プレイヤーを保存
  → 新プレイヤーをlocalStorageへ展開
  → reload
のあと、pagehideイベントがもう一度動き、
「新プレイヤーのデータ」を「元プレイヤー名」で保存する可能性がありました。

修正
====
・切替中はpagehide / visibilitychangeによる再保存を停止
・現在localStorageを所有しているPLAYERを明示的に記録
・切替直前のデータを rescue バックアップにも保存
・画面表示バージョンを v1.6.1 FAMILY に更新

導入
====
1. player-layer.js だけ今回のファイルへ置き換える
2. index.html の最初のscriptを

<script src="./player-layer.js?v=1.0.1safe" defer></script>

へ変更する
3. 他のファイルはそのままでOK

復旧
====
すでにEXPが0になっているPLAYERは、
この修正版を入れただけでは過去の値そのものを復元できません。

以前のバックアップJSONがある場合：
・PLAYERを「中学生」にする
・記録 → バックアップJSONを読み込む
・PCに元データが残っている場合はPC側でJSONを書き出してスマホへ送る

その後のPLAYER切替はこの修正版で保護されます。

重要
====
修正版を入れるまではPLAYERを何度も切り替えないでください。
