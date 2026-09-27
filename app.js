'use strict';

// ENGLISH QUEST v1.3 · PROGRAM 4/5/6 TEST FOCUS
// 学習データは端末内(localStorage)に保存。既存のv1.x記録を引き継ぎます。
const WORDS = [{"id":"they","en":"they","jp":"彼らは・彼女らは","programs":[]},{"id":"his","en":"his","jp":"彼の","programs":[]},{"id":"friend","en":"friend","jp":"友だち（1人）","programs":[]},{"id":"different","en":"different","jp":"異なる・ちがう","programs":[]},{"id":"find","en":"find","jp":"見つける","programs":[]},{"id":"their","en":"their","jp":"彼らの・彼女らの","programs":[]},{"id":"him","en":"him","jp":"彼を・彼に","programs":[]},{"id":"friends","en":"friends","jp":"友だち（複数）","programs":[]},{"id":"look-for","en":"look for","jp":"探す","programs":[]},{"id":"need","en":"need","jp":"必要とする","programs":[]},{"id":"use","en":"use","jp":"使う","programs":[]},{"id":"together","en":"together","jp":"一緒に","programs":[]},{"id":"meet","en":"meet","jp":"会う・出会う","programs":[]},{"id":"help","en":"help","jp":"助ける","programs":[]},{"id":"travel","en":"travel","jp":"旅をする","programs":[]},{"id":"map","en":"map","jp":"地図","programs":[]},{"id":"house","en":"house","jp":"家","programs":[]},{"id":"iron","en":"iron","jp":"鉄","programs":[]},{"id":"were","en":"were","jp":"〜だった（we/you/they）","programs":[]},{"id":"was","en":"was","jp":"〜だった（I/he/she/it）","programs":[]},{"id":"do","en":"do","jp":"する・疑問文で使うdo","programs":[]},{"id":"does","en":"does","jp":"する・三単現の疑問文で使う","programs":[]},{"id":"game","en":"game","jp":"ゲーム（1つ）","programs":[]},{"id":"games","en":"games","jp":"ゲーム（複数）","programs":[]},{"id":"finds","en":"finds","jp":"見つける（主語がheなど）","programs":[]},{"id":"play","en":"play","jp":"遊ぶ・プレーする","programs":[]},{"id":"make","en":"make","jp":"作る","programs":[]},{"id":"wood","en":"wood","jp":"木材","programs":[]},{"id":"town","en":"town","jp":"町","programs":[]},{"id":"old","en":"old","jp":"古い","programs":[]},{"id":"always","en":"always","jp":"いつも","programs":[]},{"id":"usually","en":"usually","jp":"たいてい・ふつうは","programs":[]},{"id":"before","en":"before","jp":"〜の前に","programs":[]},{"id":"after","en":"after","jp":"〜の後に","programs":[]},{"id":"p4-footprint","en":"footprint","jp":"足跡","programs":[4]},{"id":"p4-leave","en":"leave","jp":"置いて［残して］いく","programs":[4]},{"id":"p4-actually","en":"actually","jp":"実際に、実のところ","programs":[4]},{"id":"p4-deer","en":"deer","jp":"シカ（複数形も同形）","programs":[4]},{"id":"p4-guitarist","en":"guitarist","jp":"ギタリスト","programs":[4]},{"id":"p4-smartphone","en":"smartphone","jp":"スマートフォン、スマホ","programs":[4]},{"id":"p4-hear-from","en":"hear from ~","jp":"〜から手紙［伝言、電話、連絡］をもらう","programs":[4],"answers":["hear from"]},{"id":"p4-clear","en":"clear","jp":"よく晴れた、雲のない","programs":[4]},{"id":"p4-glad","en":"glad","jp":"うれしい","programs":[4]},{"id":"p4-guide","en":"guide","jp":"案内する、導く","programs":[4]},{"id":"p4-hike","en":"hike","jp":"ハイキングをする","programs":[4]},{"id":"p4-true","en":"true","jp":"ほんとうの","programs":[4]},{"id":"p4-go-hiking","en":"go hiking","jp":"ハイキングに行く","programs":[4]},{"id":"p4-emotional","en":"emotional","jp":"感動的な、感情に訴える","programs":[4]},{"id":"p4-must","en":"must","jp":"〜しなければならない","programs":[4]},{"id":"p4-uh-oh","en":"uh-oh","jp":"おっと、あらら","programs":[4]},{"id":"p4-volume","en":"volume","jp":"ボリューム、音量","programs":[4]},{"id":"p4-hallway","en":"hallway","jp":"廊下","programs":[4]},{"id":"p4-potato-chip","en":"potato chip","jp":"ポテトチップ","programs":[4]},{"id":"p4-mustn-t","en":"mustn't","jp":"must not の短縮形","programs":[4]},{"id":"p4-turn-down","en":"turn down ~","jp":"（音量を）下げる","programs":[4],"answers":["turn down"]},{"id":"p4-breathtaking","en":"breathtaking","jp":"すごい、息をのむような","programs":[4]},{"id":"p4-forest","en":"forest","jp":"森","programs":[4]},{"id":"p4-garbage","en":"garbage","jp":"ごみ、生ごみ","programs":[4]},{"id":"p4-hiking","en":"hiking","jp":"ハイキング","programs":[4]},{"id":"p4-protect","en":"protect","jp":"守る、保護する","programs":[4]},{"id":"p4-rule","en":"rule","jp":"規則、ルール","programs":[4]},{"id":"p4-trouble","en":"trouble","jp":"困ったこと","programs":[4]},{"id":"p4-first-of-all","en":"first of all","jp":"何よりもまず","programs":[4]},{"id":"p4-cover","en":"cover","jp":"おおう","programs":[4]},{"id":"p4-head","en":"head","jp":"頭、頭部","programs":[4]},{"id":"p4-hood","en":"hood","jp":"（上着の）フード","programs":[4]},{"id":"p4-right","en":"right","jp":"（同意を表して）そのとおり","programs":[4]},{"id":"p4-don-t-have-to","en":"don't have to ~","jp":"〜する必要はない","programs":[4],"answers":["don't have to"]},{"id":"p4-have-to","en":"have to ~","jp":"〜する必要がある","programs":[4],"answers":["have to"]},{"id":"p4-beaver","en":"beaver","jp":"ビーバー","programs":[4]},{"id":"p4-build","en":"build","jp":"建てる、作る","programs":[4]},{"id":"p4-dam","en":"dam","jp":"ダム","programs":[4]},{"id":"p4-engineer","en":"engineer","jp":"技術者、エンジニア","programs":[4]},{"id":"p4-lodge","en":"lodge","jp":"（ビーバーなどの）巣、山小屋","programs":[4]},{"id":"p4-list","en":"list","jp":"リスト、一覧表","programs":[4]},{"id":"p4-loud","en":"loud","jp":"（音・声が）大きな、（音が）うるさい","programs":[4]},{"id":"p4-noise","en":"noise","jp":"騒音、物音","programs":[4]},{"id":"p4-own","en":"own","jp":"自分自身の","programs":[4]},{"id":"p4-school-trip","en":"school trip","jp":"修学旅行","programs":[4]},{"id":"p4-shampoo","en":"shampoo","jp":"シャンプー","programs":[4]},{"id":"p4-snack","en":"snack","jp":"おやつ、軽食","programs":[4]},{"id":"p4-sad","en":"sad","jp":"悲しい","programs":[4]},{"id":"p4-they-re","en":"they're","jp":"they are の短縮形","programs":[4]},{"id":"p4-cut-down","en":"cut down ~","jp":"〜を切り倒す","programs":[4],"answers":["cut down"]},{"id":"p4-go-to-bed","en":"go to bed","jp":"寝る、就寝する","programs":[4]},{"id":"p4-on-time","en":"on time","jp":"時間どおりに","programs":[4]},{"id":"p4-caesar-salad","en":"Caesar salad","jp":"シーザーサラダ","programs":[4]},{"id":"p4-medium","en":"medium","jp":"（肉の焼き方が）ミディアムの","programs":[4]},{"id":"p4-onion","en":"onion","jp":"タマネギ","programs":[4]},{"id":"p4-order","en":"order","jp":"注文する","programs":[4]},{"id":"p4-party","en":"party","jp":"一行、集団","programs":[4]},{"id":"p4-potato","en":"potato","jp":"ポテト、ジャガイモ","programs":[4]},{"id":"p4-rare","en":"rare","jp":"（肉の焼き方が）レアの、生焼けの","programs":[4]},{"id":"p4-share","en":"share","jp":"分け合う","programs":[4]},{"id":"p4-table","en":"table","jp":"テーブル、食卓","programs":[4]},{"id":"p4-well-done","en":"well-done","jp":"（肉が）よく焼けた","programs":[4]},{"id":"p4-be-ready-to","en":"be ready to ~","jp":"〜する準備［用意］ができている","programs":[4],"answers":["be ready to"]},{"id":"p4-earth","en":"earth","jp":"地球","programs":[4]},{"id":"p4-exercise","en":"exercise","jp":"運動、運動する","programs":[4]},{"id":"p4-finnish-style","en":"Finnish-style","jp":"フィンランド風の","programs":[4]},{"id":"p4-life","en":"life","jp":"生活、人生","programs":[4]},{"id":"p4-machine","en":"machine","jp":"機械、器具","programs":[4]},{"id":"p4-save","en":"save","jp":"救う、守る","programs":[4]},{"id":"p4-twenty-four-seven","en":"twenty-four seven","jp":"いつでも、四六時中","programs":[4]},{"id":"p4-for-free","en":"for free","jp":"無料で","programs":[4]},{"id":"p5-tablet","en":"tablet","jp":"タブレット（型コンピュータ）","programs":[5]},{"id":"p5-both","en":"both","jp":"両方、2人［2つ］とも","programs":[5]},{"id":"p5-chess","en":"chess","jp":"チェス","programs":[5]},{"id":"p5-unicycle","en":"unicycle","jp":"一輪車","programs":[5]},{"id":"p5-blame","en":"blame","jp":"責める、非難する","programs":[5]},{"id":"p5-drop","en":"drop","jp":"落とす","programs":[5]},{"id":"p5-goods","en":"goods","jp":"商品","programs":[5]},{"id":"p5-kindly","en":"kindly","jp":"親切に","programs":[5]},{"id":"p5-mistake","en":"mistake","jp":"間違い","programs":[5]},{"id":"p5-pack","en":"pack","jp":"1箱、1パック","programs":[5]},{"id":"p5-shelf","en":"shelf","jp":"たな","programs":[5]},{"id":"p5-shelves","en":"shelves","jp":"shelf（たな）の複数形","programs":[5]},{"id":"p5-treat","en":"treat","jp":"扱う","programs":[5]},{"id":"p5-by-mistake","en":"by mistake","jp":"誤って、間違って","programs":[5]},{"id":"p5-good-for-you","en":"Good for you.","jp":"よかったですね。","programs":[5]},{"id":"p5-athlete","en":"athlete","jp":"運動選手、アスリート","programs":[5]},{"id":"p5-become","en":"become","jp":"〜になる","programs":[5]},{"id":"p5-meter","en":"meter","jp":"メートル","programs":[5]},{"id":"p5-cold","en":"cold","jp":"（病気の）かぜ","programs":[5]},{"id":"p5-happen","en":"happen","jp":"起こる","programs":[5]},{"id":"p5-get-place","en":"get ~ place","jp":"（競争などで）〜位になる","programs":[5],"answers":["get place"]},{"id":"p5-action","en":"action","jp":"行動","programs":[5]},{"id":"p5-decide","en":"decide","jp":"決める、決心する","programs":[5]},{"id":"p5-everything","en":"everything","jp":"すべてのもの、なんでも","programs":[5]},{"id":"p5-listener","en":"listener","jp":"聞き手","programs":[5]},{"id":"p5-lonely","en":"lonely","jp":"さびしい、孤独な","programs":[5]},{"id":"p5-spoke","en":"spoke","jp":"speak（話す）の過去形","programs":[5]},{"id":"p5-waiting-room","en":"waiting room","jp":"待合室","programs":[5]},{"id":"p5-while","en":"while","jp":"〜する間に","programs":[5]},{"id":"p5-in-particular","en":"in particular","jp":"特に","programs":[5]},{"id":"p5-take-action","en":"take action","jp":"行動を起こす","programs":[5]},{"id":"p5-apron","en":"apron","jp":"エプロン","programs":[5]},{"id":"p5-lend","en":"lend","jp":"貸す","programs":[5]},{"id":"p5-boat","en":"boat","jp":"ボート、小舟","programs":[5]},{"id":"p5-paper","en":"paper","jp":"紙","programs":[5]},{"id":"p5-asleep","en":"asleep","jp":"眠って","programs":[5]},{"id":"p5-beside","en":"beside","jp":"〜のそばに［で］","programs":[5]},{"id":"p5-fall","en":"fall","jp":"落ちる","programs":[5]},{"id":"p5-fell","en":"fell","jp":"fall（落ちる）の過去形","programs":[5]},{"id":"p5-future","en":"future","jp":"将来の、未来の","programs":[5]},{"id":"p5-gave","en":"gave","jp":"give（与える）の過去形","programs":[5]},{"id":"p5-importance","en":"importance","jp":"大切さ、重要性","programs":[5]},{"id":"p5-nap","en":"nap","jp":"昼寝、うたた寝","programs":[5]},{"id":"p5-nursery-school","en":"nursery school","jp":"保育園","programs":[5]},{"id":"p5-taught","en":"taught","jp":"teach の過去形","programs":[5]},{"id":"p5-thank-you","en":"thank-you","jp":"感謝［お礼］の","programs":[5]},{"id":"p5-balance","en":"balance","jp":"バランス、つり合い","programs":[5]},{"id":"p5-camera","en":"camera","jp":"カメラ","programs":[5]},{"id":"p5-clean","en":"clean","jp":"きれいな、清潔な","programs":[5]},{"id":"p5-color","en":"color","jp":"色","programs":[5]},{"id":"p5-fashionable","en":"fashionable","jp":"流行の","programs":[5]},{"id":"p5-flash","en":"flash","jp":"（カメラの）フラッシュ","programs":[5]},{"id":"p5-heat","en":"heat","jp":"熱、暑さ","programs":[5]},{"id":"p5-honey","en":"honey","jp":"はちみつ","programs":[5]},{"id":"p5-piece","en":"piece","jp":"1つ、1片","programs":[5]},{"id":"p5-slowly","en":"slowly","jp":"ゆっくり（と）","programs":[5]},{"id":"p5-tidy","en":"tidy","jp":"（部屋が）片づいた、（人が）きちんとした","programs":[5]},{"id":"p5-became","en":"became","jp":"become（〜になる）の過去形","programs":[5]},{"id":"p5-postcard","en":"postcard","jp":"郵便はがき","programs":[5]},{"id":"p5-send","en":"send","jp":"送る","programs":[5]},{"id":"p5-fall-asleep","en":"fall asleep","jp":"眠りに落ちる、寝入る","programs":[5]},{"id":"p5-after-a-while","en":"after a while","jp":"しばらくすると","programs":[5]},{"id":"p5-make-use-of","en":"make use of ~","jp":"〜を利用する、活用する","programs":[5],"answers":["make use of"]},{"id":"p5-take-for-a-walk","en":"take ~ for a walk","jp":"〜を散歩に連れて行く","programs":[5],"answers":["take for a walk"]},{"id":"p5-give-it-a-try","en":"Give it a try.","jp":"ためしてみてください。","programs":[5]},{"id":"p6-high-tech","en":"high-tech","jp":"ハイテクの、高度先端技術の","programs":[6]},{"id":"p6-cafe","en":"cafe","jp":"カフェ、喫茶店","programs":[6]},{"id":"p6-more","en":"more","jp":"もっと","programs":[6]},{"id":"p6-than","en":"than","jp":"〜よりも","programs":[6]},{"id":"p6-germany","en":"Germany","jp":"ドイツ","programs":[6]},{"id":"p6-mt","en":"Mt.","jp":"（山の名の前に置いて）〜山","programs":[6]},{"id":"p6-another","en":"another","jp":"別の、もう1つ［1人］の","programs":[6]},{"id":"p6-leaf","en":"leaf","jp":"葉","programs":[6]},{"id":"p6-leaves","en":"leaves","jp":"leaf（葉）の複数形","programs":[6]},{"id":"p6-lid","en":"lid","jp":"ふた","programs":[6]},{"id":"p6-lotus","en":"lotus","jp":"ハス","programs":[6]},{"id":"p6-raindrop","en":"raindrop","jp":"雨だれ、雨つぶ","programs":[6]},{"id":"p6-stick","en":"stick","jp":"くっつく","programs":[6]},{"id":"p6-wet","en":"wet","jp":"ぬれた、湿った","programs":[6]},{"id":"p6-yogurt","en":"yogurt","jp":"ヨーグルト","programs":[6]},{"id":"p6-stick-to","en":"stick to ~","jp":"〜にくっつく","programs":[6],"answers":["stick to"]},{"id":"p6-most","en":"most","jp":"もっとも","programs":[6]},{"id":"p6-parfait","en":"parfait","jp":"パフェ","programs":[6]},{"id":"p6-london","en":"London","jp":"ロンドン（イギリスの首都）","programs":[6]},{"id":"p6-useful","en":"useful","jp":"役に立つ","programs":[6]},{"id":"p6-boat-shoe","en":"boat shoe","jp":"デッキシューズ","programs":[6]},{"id":"p6-deck","en":"deck","jp":"（船の）甲板、デッキ","programs":[6]},{"id":"p6-develop","en":"develop","jp":"発展させる、開発する","programs":[6]},{"id":"p6-groove","en":"groove","jp":"溝","programs":[6]},{"id":"p6-icy","en":"icy","jp":"氷の（張った）","programs":[6]},{"id":"p6-inspiration","en":"inspiration","jp":"インスピレーション、ひらめき","programs":[6]},{"id":"p6-invention","en":"invention","jp":"発明","programs":[6]},{"id":"p6-move","en":"move","jp":"動く、移動する","programs":[6]},{"id":"p6-non-slip","en":"non-slip","jp":"すべり止めのある","programs":[6]},{"id":"p6-paw","en":"paw","jp":"（動物の）足","programs":[6]},{"id":"p6-pet","en":"pet","jp":"ペット","programs":[6]},{"id":"p6-sail","en":"sail","jp":"航海する","programs":[6]},{"id":"p6-sea","en":"sea","jp":"海","programs":[6]},{"id":"p6-slip","en":"slip","jp":"すべる、すべってころぶ","programs":[6]},{"id":"p6-sole","en":"sole","jp":"足の裏、靴の底","programs":[6]},{"id":"p6-survive","en":"survive","jp":"生き延びる","programs":[6]},{"id":"p6-without","en":"without","jp":"〜なしで、〜せずに","programs":[6]},{"id":"p6-don-t-you","en":"~, don't you?","jp":"〜ですよね。","programs":[6],"answers":["don't you?","don't you"]},{"id":"p6-fall-into","en":"fall into ~","jp":"〜に落ちる","programs":[6],"answers":["fall into"]},{"id":"p6-one-day","en":"one day","jp":"ある日","programs":[6]},{"id":"p6-as","en":"as","jp":"（as 〜 as ...）…と同じくらい〜","programs":[6]},{"id":"p6-stylish","en":"stylish","jp":"流行の、しゃれた","programs":[6]},{"id":"p6-centimeter","en":"centimeter","jp":"センチメートル","programs":[6]},{"id":"p6-tall","en":"tall","jp":"身長［高さ］がある、背が高い","programs":[6]},{"id":"p6-able","en":"able","jp":"できる、能力がある","programs":[6]},{"id":"p6-agriculture","en":"agriculture","jp":"農業","programs":[6]},{"id":"p6-bee","en":"bee","jp":"ハチ、ミツバチ","programs":[6]},{"id":"p6-coin","en":"coin","jp":"硬貨","programs":[6]},{"id":"p6-creature","en":"creature","jp":"生物（植物は含まない）","programs":[6]},{"id":"p6-living","en":"living","jp":"生きている","programs":[6]},{"id":"p6-narrow","en":"narrow","jp":"狭い","programs":[6]},{"id":"p6-paper-clip","en":"paper clip","jp":"紙ばさみ、ペーパークリップ","programs":[6]},{"id":"p6-plant","en":"plant","jp":"植物","programs":[6]},{"id":"p6-pollen","en":"pollen","jp":"花粉","programs":[6]},{"id":"p6-potential","en":"potential","jp":"可能性、潜在能力","programs":[6]},{"id":"p6-quarter","en":"quarter","jp":"アメリカの25セント硬貨","programs":[6]},{"id":"p6-search","en":"search","jp":"捜索、探索","programs":[6]},{"id":"p6-space","en":"space","jp":"空間、場所","programs":[6]},{"id":"p6-air-circulator","en":"air circulator","jp":"サーキュレーター（空気循環装置）","programs":[6]},{"id":"p6-air-conditioner","en":"air conditioner","jp":"エアコン","programs":[6]},{"id":"p6-continue","en":"continue","jp":"続ける、続く","programs":[6]},{"id":"p6-curtain","en":"curtain","jp":"カーテン","programs":[6]},{"id":"p6-eco-friendly","en":"eco-friendly","jp":"環境に配慮した、環境にやさしい","programs":[6]},{"id":"p6-effort","en":"effort","jp":"努力","programs":[6]},{"id":"p6-electricity","en":"electricity","jp":"電気","programs":[6]},{"id":"p6-energy","en":"energy","jp":"エネルギー","programs":[6]},{"id":"p6-fridge","en":"fridge","jp":"冷蔵庫（= refrigerator）","programs":[6]},{"id":"p6-less","en":"less","jp":"little（少ない）の比較級","programs":[6]},{"id":"p6-light","en":"light","jp":"明かり、光","programs":[6]},{"id":"p6-better","en":"better","jp":"good（よい）の比較級","programs":[6]},{"id":"p6-be-able-to","en":"be able to ~","jp":"〜することができる","programs":[6],"answers":["be able to"]},{"id":"p6-turn-off","en":"turn off ~","jp":"〜（テレビなど）を消す、止める","programs":[6],"answers":["turn off"]},{"id":"p6-guinea-pig","en":"guinea pig","jp":"モルモット","programs":[6]},{"id":"p6-made","en":"made","jp":"make の過去形（過去分詞も同形）","programs":[6]},{"id":"p6-relaxing","en":"relaxing","jp":"くつろげる、ほっとする","programs":[6]},{"id":"p6-beef","en":"beef","jp":"牛肉、ビーフ","programs":[6]},{"id":"p6-cloth","en":"cloth","jp":"布、布切れ","programs":[6]},{"id":"p6-mayonnaise","en":"mayonnaise","jp":"マヨネーズ","programs":[6]},{"id":"p6-plastic-bag","en":"plastic bag","jp":"ビニール袋","programs":[6]},{"id":"p6-sauce","en":"sauce","jp":"ソース","programs":[6]},{"id":"p6-soy-sauce","en":"soy sauce","jp":"しょうゆ","programs":[6]},{"id":"p6-square","en":"square","jp":"正方形の、四角い","programs":[6]},{"id":"p6-sugar","en":"sugar","jp":"砂糖","programs":[6]},{"id":"p6-wrap","en":"wrap","jp":"包む、くるむ","programs":[6]},{"id":"p6-a-piece-of","en":"a piece of ~","jp":"1つ［1枚］の〜","programs":[6],"answers":["a piece of"]},{"id":"p6-building","en":"building","jp":"建物、ビルディング","programs":[6]},{"id":"p6-car","en":"car","jp":"車、自動車","programs":[6]},{"id":"p6-cave","en":"cave","jp":"洞くつ、ほら穴","programs":[6]},{"id":"p6-comfortable","en":"comfortable","jp":"心地よい","programs":[6]},{"id":"p6-display","en":"display","jp":"展示、見世物、ディスプレー","programs":[6]},{"id":"p6-escape","en":"escape","jp":"逃げる、のがれる","programs":[6]},{"id":"p6-even","en":"even","jp":"〜でさえ","programs":[6]},{"id":"p6-film","en":"film","jp":"撮影する","programs":[6]},{"id":"p6-handicraft","en":"handicraft","jp":"手工芸（品）","programs":[6]},{"id":"p6-magical","en":"magical","jp":"魔法の、不思議な","programs":[6]},{"id":"p6-material","en":"material","jp":"材料、原料","programs":[6]},{"id":"p6-prefecture","en":"prefecture","jp":"県、都道府県","programs":[6]},{"id":"p6-souvenir","en":"souvenir","jp":"みやげ","programs":[6]},{"id":"p6-stone","en":"stone","jp":"石","programs":[6]},{"id":"p6-above","en":"above","jp":"〜の上（のほう）に［の］","programs":[6]},{"id":"p6-airport","en":"airport","jp":"空港","programs":[6]},{"id":"p6-beyond","en":"beyond","jp":"〜を越えて","programs":[6]},{"id":"p6-border","en":"border","jp":"国境、境界（線）","programs":[6]},{"id":"p6-friendship","en":"friendship","jp":"親交、友情","programs":[6]},{"id":"p6-iran","en":"Iran","jp":"イラン","programs":[6]},{"id":"p6-iraq","en":"Iraq","jp":"イラク","programs":[6]},{"id":"p6-no-fly-zone","en":"no-fly zone","jp":"飛行禁止区域","programs":[6]},{"id":"p6-president","en":"president","jp":"大統領","programs":[6]},{"id":"p6-sent","en":"sent","jp":"send の過去形（過去分詞も同形）","programs":[6]},{"id":"p6-suddenly","en":"suddenly","jp":"突然、急に","programs":[6]},{"id":"p6-turkish","en":"Turkish","jp":"トルコ（人）の／トルコ語","programs":[6]},{"id":"p6-war","en":"war","jp":"戦争","programs":[6]},{"id":"p6-bury","en":"bury","jp":"埋葬する、埋める","programs":[6]},{"id":"p6-chicken","en":"chicken","jp":"ニワトリ、鶏肉","programs":[6]},{"id":"p6-coast","en":"coast","jp":"海岸","programs":[6]},{"id":"p6-dead","en":"dead","jp":"死んでいる","programs":[6]},{"id":"p6-die","en":"die","jp":"死ぬ","programs":[6]},{"id":"p6-fishing","en":"fishing","jp":"漁業","programs":[6]},{"id":"p6-goodwill","en":"goodwill","jp":"親善、好意","programs":[6]},{"id":"p6-however","en":"however","jp":"しかし","programs":[6]},{"id":"p6-left","en":"left","jp":"leave の過去形（過去分詞も同形）","programs":[6]},{"id":"p6-met","en":"met","jp":"meet の過去形（過去分詞も同形）","programs":[6]},{"id":"p6-mission","en":"mission","jp":"使命、任務","programs":[6]},{"id":"p6-nearby","en":"nearby","jp":"近くの","programs":[6]},{"id":"p6-respectfully","en":"respectfully","jp":"うやうやしく、丁重に","programs":[6]},{"id":"p6-sank","en":"sank","jp":"sink（沈む）の過去形","programs":[6]},{"id":"p6-ship","en":"ship","jp":"船","programs":[6]},{"id":"p6-sink","en":"sink","jp":"沈む","programs":[6]},{"id":"p6-survivor","en":"survivor","jp":"生存者","programs":[6]},{"id":"p6-the-dead","en":"the dead","jp":"死者","programs":[6]},{"id":"p6-turkey","en":"Turkey","jp":"トルコ","programs":[6]},{"id":"p6-typhoon","en":"typhoon","jp":"台風","programs":[6]},{"id":"p6-understand","en":"understand","jp":"わかる、理解する","programs":[6]},{"id":"p6-village","en":"village","jp":"村","programs":[6]},{"id":"p6-ambassador","en":"ambassador","jp":"大使","programs":[6]},{"id":"p6-between","en":"between","jp":"〜の間の","programs":[6]},{"id":"p6-earthquake","en":"earthquake","jp":"地震","programs":[6]},{"id":"p6-eastern","en":"eastern","jp":"東部の、東の","programs":[6]},{"id":"p6-flew","en":"flew","jp":"fly（飛ぶ）の過去形","programs":[6]},{"id":"p6-former","en":"former","jp":"前の、元の","programs":[6]},{"id":"p6-accident","en":"accident","jp":"事故","programs":[6]},{"id":"p6-return","en":"return","jp":"帰る、もどる、もどす","programs":[6]},{"id":"p6-worker","en":"worker","jp":"仕事［勉強］をする人、労働者","programs":[6]},{"id":"p6-at-war","en":"at war","jp":"戦争中で","programs":[6]},{"id":"p6-one-after-another","en":"one after another","jp":"次々と","programs":[6]},{"id":"p6-run-short","en":"run short","jp":"不足する","programs":[6]},{"id":"p6-shoot-down","en":"shoot down ~","jp":"〜を撃ち落とす","programs":[6],"answers":["shoot down"]},{"id":"p6-more-than","en":"more than ~","jp":"〜より多い","programs":[6],"answers":["more than"]},{"id":"p6-on-the-way-back-to","en":"on the way (back) to ~","jp":"〜へ行く［もどる］途中で","programs":[6],"answers":["on the way to","on the way back to"]},{"id":"p6-each-other","en":"each other","jp":"おたがいに［を］","programs":[6]}];

const FOCUS_PROGRAMS = [4,5,6];
const STORE_KEY = 'english-quest-v1';
const DATA_VERSION = 5;
const MAX_DAILY_XP = 30;
const KNOWN_WRITE_RECOMMENDED = new Set(['friend','friends','their','different','p5-shelves','p5-become','p5-future','p6-comfortable','p6-earthquake','p6-friendship','p6-suddenly','p6-understand']);

const dateStr = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
function addDays(day,n){const d=new Date(`${day}T12:00:00`);d.setDate(d.getDate()+n);return dateStr(d);}
function deepClone(obj){return JSON.parse(JSON.stringify(obj));}
function defaultRecord(unlocked=false){return {unlocked,stage:1,streak:0,due:dateStr(),attempts:0,correct:0,mastered:false,lastAttempt:null,inProgress:false,misspellCount:0,reviewAttempts:0};}
function fresh(){
  const records={};
  WORDS.forEach((word,i)=>{records[word.id]=defaultRecord(i<5);});
  return {version:DATA_VERSION,xp:54,legacyXp:54,legacyReadingWords:131,history:[],records,daySnapshot:null};
}
function cleanRecord(old,unlockedDefault=false){
  const base=defaultRecord(unlockedDefault);
  if(!old||typeof old!=='object')return base;
  return {
    unlocked:typeof old.unlocked==='boolean'?old.unlocked:base.unlocked,
    stage:[1,2,3].includes(old.stage)?old.stage:1,
    streak:Number.isInteger(old.streak)&&old.streak>=0&&old.streak<=4?old.streak:0,
    due:/^\d{4}-\d{2}-\d{2}$/.test(old.due||'')?old.due:dateStr(),
    attempts:Number.isInteger(old.attempts)&&old.attempts>=0?old.attempts:0,
    correct:Number.isInteger(old.correct)&&old.correct>=0?old.correct:0,
    mastered:typeof old.mastered==='boolean'?old.mastered:false,
    lastAttempt:(old.lastAttempt===null||/^\d{4}-\d{2}-\d{2}$/.test(old.lastAttempt||''))?old.lastAttempt:null,
    inProgress:typeof old.inProgress==='boolean'?old.inProgress:false,
    misspellCount:Number.isInteger(old.misspellCount)&&old.misspellCount>=0?old.misspellCount:0,
    reviewAttempts:Number.isInteger(old.reviewAttempts)&&old.reviewAttempts>=0?old.reviewAttempts:0
  };
}
function migrate(raw){
  const next=fresh();
  if(!raw||typeof raw!=='object')return next;
  if(Number.isSafeInteger(raw.xp)&&raw.xp>=0)next.xp=raw.xp;
  if(Number.isSafeInteger(raw.legacyXp)&&raw.legacyXp>=0)next.legacyXp=raw.legacyXp;
  if(Number.isSafeInteger(raw.legacyReadingWords)&&raw.legacyReadingWords>=0)next.legacyReadingWords=raw.legacyReadingWords;
  if(Array.isArray(raw.history))next.history=raw.history.slice(-100000).filter(h=>h&&typeof h==='object');
  WORDS.forEach((w,i)=>{next.records[w.id]=cleanRecord(raw.records?.[w.id],i<5);});
  if(raw.daySnapshot&&raw.daySnapshot.day===dateStr()&&raw.daySnapshot.records){
    next.daySnapshot={day:raw.daySnapshot.day,xp:Number(raw.daySnapshot.xp)||0,historyLength:Number(raw.daySnapshot.historyLength)||0,records:{}};
    WORDS.forEach((w,i)=>{next.daySnapshot.records[w.id]=cleanRecord(raw.daySnapshot.records?.[w.id],i<5);});
  }
  // 古い版で今日Stage 2/3へ進んだ語は、導入後も続きから再開。
  if((Number(raw.version)||0)<3){
    WORDS.forEach(w=>{const r=next.records[w.id];if(r.lastAttempt===dateStr()&&!r.mastered&&(r.stage===2||(r.stage===3&&r.streak===0))){r.inProgress=true;r.due=dateStr();}});
  }
  next.version=DATA_VERSION;
  return next;
}
function load(){
  try{const raw=JSON.parse(localStorage.getItem(STORE_KEY));const migrated=migrate(raw);localStorage.setItem(STORE_KEY,JSON.stringify(migrated));return migrated;}
  catch(_){return fresh();}
}
let state=load();
function persist(){try{localStorage.setItem(STORE_KEY,JSON.stringify(state));return true;}catch(_){notify('保存できません。ブラウザの保存設定を確認し、バックアップを取ってください。');return false;}}
let session=null;
const el=id=>document.getElementById(id);
const today=()=>dateStr();
const wordById=id=>WORDS.find(w=>w.id===id);
function isFocusWord(w){return (w.programs||[]).some(p=>FOCUS_PROGRAMS.includes(p));}
function programLabel(w){const ps=(w.programs||[]).filter(p=>FOCUS_PROGRAMS.includes(p));return ps.length?`P${ps.join('/')}`:'基礎';}
function unlocked(){return WORDS.filter(w=>state.records[w.id].unlocked);}
function totalMaster(){return unlocked().filter(w=>state.records[w.id].mastered).length;}
function sortDue(list){return [...list].sort((a,b)=>{const ar=state.records[a.id],br=state.records[b.id];if(ar.inProgress!==br.inProgress)return ar.inProgress?-1:1;const d=ar.due.localeCompare(br.due);if(d!==0)return d;return ar.attempts-br.attempts;});}
function dueWords(){return sortDue(unlocked().filter(w=>{const r=state.records[w.id];return r.due<=today()&&(r.lastAttempt!==today()||r.inProgress);}));}
function focusDueWords(){return dueWords().filter(isFocusWord);}
function baseDueWords(){return dueWords().filter(w=>!isFocusWord(w));}
function lockedFocusWords(program=null){return WORDS.filter(w=>isFocusWord(w)&&!state.records[w.id].unlocked&&(program===null||(w.programs||[]).includes(program)));}
function unlockedFocusCount(program){return WORDS.filter(w=>(w.programs||[]).includes(program)&&state.records[w.id].unlocked).length;}
function ensureDaySnapshot(){
  if(state.daySnapshot?.day===today())return;
  state.daySnapshot={day:today(),xp:state.xp,historyLength:state.history.length,records:deepClone(state.records)};
  persist();
}
function unlockNextFocus(){
  const candidates=FOCUS_PROGRAMS.map(p=>({p,count:unlockedFocusCount(p),word:lockedFocusWords(p)[0]})).filter(x=>x.word).sort((a,b)=>a.count-b.count||a.p-b.p);
  if(!candidates.length)return null;
  const w=candidates[0].word,r=state.records[w.id];r.unlocked=true;r.due=today();return w;
}
function ensureFocusDue(n){let due=focusDueWords();while(due.length<n){const w=unlockNextFocus();if(!w)break;due=focusDueWords();}persist();return due;}
function sessionWords(allowUnlock=false){
  let focus=allowUnlock?ensureFocusDue(4):focusDueWords();const base=baseDueWords();const chosen=[];
  chosen.push(...focus.slice(0,4));if(base.length)chosen.push(base[0]);
  if(chosen.length<5){if(allowUnlock)focus=ensureFocusDue(5);const used=new Set(chosen.map(w=>w.id));for(const w of focus){if(chosen.length>=5)break;if(!used.has(w.id)){chosen.push(w);used.add(w.id);}}for(const w of base){if(chosen.length>=5)break;if(!used.has(w.id)){chosen.push(w);used.add(w.id);}}}
  return chosen.slice(0,5);
}
function focusStats(){return FOCUS_PROGRAMS.map(p=>({p,total:WORDS.filter(w=>(w.programs||[]).includes(p)).length,unlocked:unlockedFocusCount(p)}));}
function dailyEarned(){return state.history.filter(x=>x.day===today()).reduce((s,x)=>s+(Number(x.xp)||0),0);}
function stageStars(rec){if(rec.mastered)return '👑 MASTER';if(rec.stage===1)return '★☆☆';if(rec.stage===2)return '★★☆';if(rec.streak===0)return '★★★';return `★★★ 定着${Math.min(rec.streak,3)}/3`;}
function stageName(rec){if(rec.mastered)return 'MASTER・ランダム復習';if(rec.stage===1)return 'STAGE 1 見る';if(rec.stage===2)return 'STAGE 2 言う';if(rec.streak===0)return 'STAGE 3 書く';return 'MIX REVIEW 1・2・3';}
function kindOf(rec){return rec.attempts===0?'NEW':'REVIEW';}
function isGuided(rec){return !rec.mastered&&(rec.stage<3||(rec.stage===3&&rec.streak===0));}
function shuffle(list){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function chooseMixedStage(rec,deckStage){
  if(rec.mastered)return deckStage||shuffle([1,2,3])[0];
  if(rec.streak>=3)return 3; // MASTER直前は必ずスペルで確認
  if(rec.streak===2)return shuffle([2,3,3])[0];
  return deckStage||shuffle([1,2,3])[0];
}
function buildTasks(words){
  const deck=shuffle([1,2,3,2,3]);let di=0;
  return words.map(w=>{const r=state.records[w.id];const guided=isGuided(r);return {id:w.id,stage:guided?r.stage:chooseMixedStage(r,deck[di++%deck.length]),mode:guided?'guided':'mixed'};});
}
function show(view){
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===view));
  document.querySelectorAll('.nav button').forEach(b=>{const chosen=b.dataset.view===(['practice','result'].includes(view)?'home':view);b.classList.toggle('selected',chosen);if(chosen)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
  if(view==='home')renderHome();if(view==='library')renderLibrary();if(view==='data')renderData();window.scrollTo({top:0,behavior:'instant'});
}
let toastTimer;
function notify(message){const t=el('toast');t.textContent=message;t.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{t.hidden=true;},4400);}
function renderHome(){
  const lvl=Math.floor(state.xp/100)+1,xpPart=state.xp%100;
  el('level-title').textContent=`Lv.${lvl} ${lvl===1?'はじまりの村':'冒険者'}`;el('xp-label').textContent=`${state.xp} EXP`;el('xp-bar').style.width=`${xpPart}%`;el('next-label').textContent=`次のレベルまで${100-xpPart} EXP`;
  el('unlocked-stat').textContent=`${unlocked().length}語`;el('master-stat').textContent=`${totalMaster()}語`;
  const preview=sessionWords(false),lockedFocus=lockedFocusWords().length,available=preview.length||lockedFocus>0;el('due-stat').textContent=available?`${Math.min(5,Math.max(preview.length,lockedFocus?5:0))}語`:'0語';
  const focusDoneToday=new Set(state.history.filter(h=>h.day===today()).map(h=>wordById(h.id)).filter(Boolean).filter(isFocusWord).map(w=>w.id)).size;
  el('start-btn').disabled=!available;el('start-btn').textContent=!available?'今日の修行は終了 ✓':focusDoneToday>=4?'余力があれば、もう5語 →':'修行をはじめる →';
  const pf=preview.filter(isFocusWord).length,pb=preview.length-pf,stats=focusStats().map(x=>`P${x.p} ${x.unlocked}/${x.total}`).join(' ・ ');
  el('home-message').textContent=available?(focusDoneToday>=4?'今日の基本分はクリア。ここで終了してOKです。追加するなら、次もPROGRAM 4・5・6を中心に5語だけ。':`テスト対策モード：PROGRAM 4・5・6を重点出題。最初は同じ語を1→2→3、慣れた語はSTAGEを混ぜて復習します。${preview.length?`（今の候補 TEST ${pf} / 基礎 ${pb}）`:''}`):'今日の分は終了！ 追加しなくてもOK。';
  if(el('focus-status'))el('focus-status').textContent=`TEST RANGE ON　PROGRAM 4・5・6　｜　${stats}`;
  const left=lockedFocusWords().length;el('unlock-btn').disabled=left===0;el('unlock-btn').textContent=left?`テスト範囲を${Math.min(5,left)}語追加する`:'P4・P5・P6をすべて図鑑に登録済み';
}
function renderLibrary(){
  const root=el('library-list');root.replaceChildren();
  unlocked().sort((a,b)=>{const af=isFocusWord(a)?0:1,bf=isFocusWord(b)?0:1;if(af!==bf)return af-bf;const ap=(a.programs||[])[0]||99,bp=(b.programs||[])[0]||99;return ap-bp||a.en.localeCompare(b.en);}).forEach(w=>{
    const rec=state.records[w.id],row=document.createElement('div');row.className='word-row';const left=document.createElement('div');const tag=document.createElement('span');tag.className='program-tag';tag.textContent=programLabel(w);const en=document.createElement('strong');en.textContent=w.en;const jp=document.createElement('small');jp.textContent=w.jp;left.append(tag,en,jp);
    const right=document.createElement('div');right.className='state';const stars=document.createElement('div');stars.className='stars';stars.textContent=stageStars(rec);const label=document.createElement('div');label.textContent=stageName(rec);const next=document.createElement('div');next.className='due';next.textContent=`次回：${rec.due} / 正解 ${rec.correct}/${rec.attempts}`;right.append(stars,label,next);row.append(left,right);root.append(row);
  });
}
function renderData(){
  const list=state.history.filter(x=>x.day===today());el('today-summary').textContent=`挑戦 ${list.length}回 / 今日の獲得 ${dailyEarned()} EXP（1日の上限${MAX_DAILY_XP}）`;
  const fs=focusStats().map(x=>`P${x.p} ${x.unlocked}/${x.total}`).join(' ・ ');el('overall-summary').textContent=`累計 ${state.xp} EXP / 図鑑 ${unlocked().length}語 / MASTER ${totalMaster()}語 / テスト範囲 ${fs} / 過去の教材で読んだ記録 ${state.legacyReadingWords||0} words`;
  const snapshotOk=state.daySnapshot?.day===today();el('reset-today').disabled=!snapshotOk;el('reset-today-note').textContent=snapshotOk?'この端末の今日のテストプレイを、v1.3開始時点まで戻せます。':'今日の開始スナップショットがありません。次の学習から使えます。';
}
function unlockFive(){ensureDaySnapshot();const items=[];while(items.length<5){const w=unlockNextFocus();if(!w)break;items.push(w);}persist();renderHome();notify(items.length?`テスト範囲から${items.length}語を追加しました。今日はやらなくても大丈夫。`:'P4・P5・P6はすべて登録済みです。');}
function start(){
  ensureDaySnapshot();const words=sessionWords(true);if(!words.length){renderHome();return;}
  session={tasks:buildTasks(words),index:0,earned:0,success:0,review:0,finished:false,repeatCurrent:false,writeSuggested:new Set()};renderQuestion();show('practice');
}
function optionsFor(word){const sameProgram=WORDS.filter(w=>w.id!==word.id&&w.jp!==word.jp&&isFocusWord(word)&&(w.programs||[]).some(p=>(word.programs||[]).includes(p)));const pool=sameProgram.length>=3?sameProgram:WORDS.filter(w=>w.id!==word.id&&w.jp!==word.jp);return shuffle([word,...shuffle(pool).slice(0,3)]);}
function normalizeAnswer(s){return String(s??'').normalize('NFKC').trim().toLowerCase().replace(/[’‘]/g,"'").replace(/[‐‑‒–—−]/g,'-').replace(/[.!?]+$/,'').replace(/\s+/g,' ');}
function isTypedCorrect(input,word){const got=normalizeAnswer(input);return [word.en,...(word.answers||[])].some(a=>normalizeAnswer(a)===got);}
function spellingHint(gotRaw,expectedRaw){
  const got=normalizeAnswer(gotRaw),expected=normalizeAnswer(expectedRaw);if(!got)return `空欄でした。正解は「${expectedRaw}」。1回見てから、もう一度思い出そう。`;
  let p=0;while(p<got.length&&p<expected.length&&got[p]===expected[p])p++;let s=0;while(s<got.length-p&&s<expected.length-p&&got[got.length-1-s]===expected[expected.length-1-s])s++;
  const gmid=got.slice(p,got.length-s),emid=expected.slice(p,expected.length-s);if(!gmid&&emid)return `惜しい！「${emid}」が抜けています。 ${gotRaw} → ${expectedRaw}`;if(gmid&&!emid)return `惜しい！「${gmid}」が余分です。 ${gotRaw} → ${expectedRaw}`;if(gmid.length===1&&emid.length===1)return `惜しい！「${gmid}」ではなく「${emid}」。 ${gotRaw} → ${expectedRaw}`;return `ちがう部分を確認：${gotRaw} → ${expectedRaw}`;
}
function speakWord(word){
  if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){notify('この端末では音声読み上げを使えません。文字で答えを確認してください。');return false;}
  const text=String(word.tts||word.en).replace(/\s*~\s*/g,' ').replace(/\s+/g,' ').trim();
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.82;u.pitch=1;const voices=speechSynthesis.getVoices();const voice=voices.find(v=>/^en-US/i.test(v.lang))||voices.find(v=>/^en/i.test(v.lang));if(voice)u.voice=voice;speechSynthesis.speak(u);return true;}catch(_){return false;}
}
function shouldRecommendWrite(word,rec){const plain=normalizeAnswer(word.en).replace(/[^a-z]/g,'');return rec.misspellCount>0||KNOWN_WRITE_RECOMMENDED.has(word.id)||plain.length>=9;}
function currentTask(){return session.tasks[session.index];}
function renderQuestion(){
  const task=currentTask(),word=wordById(task.id),rec=state.records[word.id],stage=task.stage;
  el('session-counter').textContent=`${session.index+1} / ${session.tasks.length}語`;el('session-progress').style.width=`${session.index/session.tasks.length*100}%`;
  el('question-stage').textContent=stage===1?'STAGE 1 · 見る':stage===2?'STAGE 2 · 言う':'STAGE 3 · 書く';
  const origin=el('question-origin');origin.textContent=`${programLabel(word)} · ${kindOf(rec)} · ${task.mode==='guided'?'順番':'MIX'}`;origin.classList.toggle('review',rec.attempts>0);
  el('task-instruction').textContent=stage===1?'英語を見て、正しい意味を選ぼう':stage===2?'日本語を見て、先に自分で英語を言ってみよう':'英語は見ずに、キーボードで正確に入力しよう';
  el('question-text').textContent=stage===1?word.en:word.jp;
  el('question-note').textContent=stage===3?'スペルのヒントはありません。間違えると、どこが違うか表示します。':stage===2?'自分で言ってから「答えと発音を聞く」を押そう。':'正解をタップしてね。';
  el('feedback').hidden=true;el('feedback').classList.remove('bad');el('next-btn').hidden=true;const root=el('answer-area');root.replaceChildren();
  if(stage===1){
    const grid=document.createElement('div');grid.className='answer-grid';optionsFor(word).forEach(option=>{const b=document.createElement('button');b.type='button';b.className='answer-btn';b.textContent=option.jp;b.addEventListener('click',()=>{grid.querySelectorAll('button').forEach(x=>x.disabled=true);b.classList.add(option.id===word.id?'right':'wrong');complete(option.id===word.id,word,`正解：${word.en} = ${word.jp}`);});grid.append(b);});root.append(grid);
  }else if(stage===2){
    const guide=document.createElement('div');guide.className='say-guide';guide.textContent='① 日本語を見る → ② 自分で英語を言う → ③ 答えと発音で確認 → ④ 自分で判定';
    const reveal=document.createElement('button');reveal.type='button';reveal.className='primary full';reveal.textContent='答えと発音を聞く 🔊';
    const answer=document.createElement('div');answer.className='spoken-answer';answer.hidden=true;
    const replay=document.createElement('button');replay.type='button';replay.className='secondary full compact';replay.textContent='もう一度聞く 🔊';replay.hidden=true;
    const recommend=document.createElement('div');recommend.className='write-recommend';recommend.hidden=true;
    const actions=document.createElement('div');actions.className='say-actions';actions.hidden=true;const yes=document.createElement('button');yes.textContent='言えた ✓';const no=document.createElement('button');no.textContent='まだ難しい';
    reveal.addEventListener('click',()=>{answer.textContent=`答え：${word.en}`;answer.hidden=false;reveal.hidden=true;replay.hidden=false;actions.hidden=false;speakWord(word);if(shouldRecommendWrite(word,rec)){recommend.hidden=false;recommend.textContent='✍️ 書き取りおすすめ：つづりを1回、見ずに書くと定着しやすい語です。';session.writeSuggested.add(word.id);}});
    replay.addEventListener('click',()=>speakWord(word));[yes,no].forEach(b=>b.addEventListener('click',()=>{yes.disabled=true;no.disabled=true;complete(b===yes,word,`正解：${word.en}`);}));actions.append(yes,no);root.append(guide,reveal,answer,replay,recommend,actions);
  }else{
    const form=document.createElement('form');form.noValidate=true;const input=document.createElement('input');input.className='typed';input.type='text';input.autocomplete='off';input.autocapitalize='none';input.spellcheck=false;input.placeholder='ここに英語を書く';input.setAttribute('aria-label','英単語を入力');const submit=document.createElement('button');submit.type='submit';submit.className='primary';submit.textContent='答え合わせ';form.append(input,submit);
    form.addEventListener('submit',evt=>{evt.preventDefault();submit.disabled=true;input.readOnly=true;const correct=isTypedCorrect(input.value,word);if(!correct)rec.misspellCount++;const msg=correct?`正解：${word.en}（${word.jp}）`:spellingHint(input.value,word.en);complete(correct,word,msg);});root.append(form);setTimeout(()=>input.focus({preventScroll:true}),100);
  }
}
function nextInterval(streak){return streak<=1?1:streak===2?3:streak===3?7:30;}
function complete(correct,word,message){
  ensureDaySnapshot();const task=currentTask(),rec=state.records[word.id],stage=task.stage,now=today();rec.attempts++;rec.lastAttempt=now;session.repeatCurrent=false;
  if(task.mode==='guided'){
    if(correct){rec.correct++;if(stage===1){rec.stage=2;rec.inProgress=true;rec.due=now;session.repeatCurrent=true;}else if(stage===2){rec.stage=3;rec.streak=0;rec.inProgress=true;rec.due=now;session.repeatCurrent=true;}else{rec.stage=3;rec.streak=1;rec.inProgress=false;rec.due=addDays(now,1);}session.success++;}
    else{rec.inProgress=false;rec.due=addDays(now,1);session.review++;}
  }else{
    rec.reviewAttempts++;
    if(correct){
      rec.correct++;session.success++;
      if(rec.mastered){rec.due=addDays(now,30);}
      else{
        if(rec.streak>=3&&stage!==3)rec.streak=3;else rec.streak=Math.min(4,rec.streak+1);
        if(rec.streak>=4&&stage===3){rec.mastered=true;rec.streak=4;rec.due=addDays(now,30);}else rec.due=addDays(now,nextInterval(rec.streak));
      }
    }else{rec.due=addDays(now,1);session.review++;}
    rec.inProgress=false;
  }
  const raw=correct?(stage===3?3:2):1,award=Math.min(raw,Math.max(0,MAX_DAILY_XP-dailyEarned()));state.xp+=award;session.earned+=award;
  state.history.push({day:now,id:word.id,stage,mode:task.mode,correct,xp:award,nextDue:rec.due,answer:message});persist();
  const fb=el('feedback');fb.hidden=false;fb.classList.toggle('bad',!correct);fb.replaceChildren();const title=document.createElement('strong');title.textContent=correct?`正解！ +${award} EXP`:`再挑戦のチャンス +${award} EXP`;const desc=document.createElement('span');
  const guidedNext=task.mode==='guided'&&correct&&stage<3?` 次はSTAGE ${stage+1}。`:'';const mixNote=task.mode==='mixed'?' 次回は別のSTAGEが出ることもあります。':'';desc.textContent=`${message}。${guidedNext}${session.repeatCurrent?'':`次の復習：${rec.due}`}${mixNote}`;fb.append(title,desc);
  const next=el('next-btn');next.hidden=false;next.textContent=session.repeatCurrent?`同じ単語で STAGE ${rec.stage} へ →`:'次の単語へ →';if(correct&&rec.mastered)notify(`${word.en} がMASTERになりました！`);
}
function renderResult(){
  const unique=[...new Set(session.tasks.map(t=>t.id))];el('result-xp').textContent=`+${session.earned}`;el('result-count').textContent=`${unique.length}語`;const reviewCount=unique.filter(id=>{const r=state.records[id];return r&&!r.mastered&&r.due<=addDays(today(),1);}).length;el('result-review').textContent=`${reviewCount}語`;
  const focusCount=unique.map(wordById).filter(Boolean).filter(isFocusWord).length;el('result-message').textContent=`今日は${focusCount}語がPROGRAM 4・5・6のテスト範囲でした。ここで終了してOK。余力がある日だけ、もう5語へ。`;
  const suggest=unique.map(wordById).filter(Boolean).filter(w=>shouldRecommendWrite(w,state.records[w.id])).slice(0,3);const box=el('write-suggest');const list=el('write-suggest-list');list.replaceChildren();if(suggest.length){box.hidden=false;suggest.forEach(w=>{const chip=document.createElement('span');chip.className='write-chip';chip.textContent=`✍️ ${w.en}`;list.append(chip);});}else box.hidden=true;
  el('result-more-btn').hidden=!(lockedFocusWords().length>0||dueWords().length>0);
}
function advance(){
  if(session.repeatCurrent){session.repeatCurrent=false;const task=currentTask(),r=state.records[task.id];task.stage=r.stage;task.mode='guided';renderQuestion();return;}
  session.index++;if(session.index>=session.tasks.length){renderResult();show('result');}else renderQuestion();
}
function download(name,content,mime){const blob=new Blob([content],{type:mime});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
function exportJson(){download(`english-quest-backup-${today()}.json`,JSON.stringify(state,null,2),'application/json');notify('バックアップを保存しました。ファイルを安全な場所に保管してください。');}
function csvCell(s){const v=String(s??'');return '"'+v.replace(/"/g,'""')+'"';}
function exportCsv(){const rows=[['date','word','japanese','program','stage_at_attempt','mode','correct','xp_awarded','next_due']];state.history.forEach(h=>{const w=wordById(h.id);if(w)rows.push([h.day,w.en,w.jp,programLabel(w),h.stage,h.mode||'',h.correct?'yes':'no',h.xp,h.nextDue]);});download(`english-quest-log-${today()}.csv`,'\uFEFF'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');notify('CSVを保存しました。このチャットに添付できます。');}
async function importJson(event){const file=event.target.files?.[0];if(!file)return;try{if(file.size>5_000_000)throw new Error('large');const raw=JSON.parse(await file.text()),obj=migrate(raw);if(!confirm(`記録を読み込むと、この端末の今の履歴は置き換わります。読み込むデータ：${obj.xp} EXP。続けますか？`))return;state=obj;persist();renderHome();show('home');notify('バックアップを読み込みました。');}catch(e){notify('読み込めませんでした。English QuestのバックアップJSONを選んでください。');}finally{event.target.value='';}}
function resetToday(){
  const snap=state.daySnapshot;if(!snap||snap.day!==today()){notify('今日の開始スナップショットがありません。');return;}
  if(!confirm('この端末の「今日の学習」を開始時点まで戻します。今日獲得したEXP・Stage進行・今日追加した語が戻ります。よろしいですか？'))return;
  state.xp=snap.xp;state.records=deepClone(snap.records);state.history=state.history.slice(0,snap.historyLength);state.daySnapshot={day:today(),xp:snap.xp,historyLength:snap.historyLength,records:deepClone(snap.records)};persist();renderData();renderHome();notify('今日の学習をリセットしました。');
}
function resetProgress(){
  if(!confirm('学習進捗を初期状態へ戻します。EXP、Stage、復習予定、MASTER記録がリセットされます。この端末だけが対象です。'))return;
  const typed=prompt('誤操作防止のため RESET と入力してください。');if(typed!=='RESET'){notify('リセットを中止しました。');return;}
  const keepReading=state.legacyReadingWords||131;state=fresh();state.legacyReadingWords=keepReading;persist();show('home');notify('学習進捗を初期化しました。');
}
function fullReset(){
  if(!confirm('完全初期化します。念のため、現在のバックアップJSONを先に保存します。続けますか？'))return;exportJson();
  const typed=prompt('完全初期化するには FULL RESET と入力してください。');if(typed!=='FULL RESET'){notify('完全初期化を中止しました。');return;}
  localStorage.removeItem(STORE_KEY);location.reload();
}
function init(){
  // v1.3導入時点を「今日のテスト開始点」にする。以後、今日のリセットでここへ戻せます。
  if(!state.daySnapshot||state.daySnapshot.day!==today()){state.daySnapshot={day:today(),xp:state.xp,historyLength:state.history.length,records:deepClone(state.records)};persist();}
  el('start-btn').addEventListener('click',start);el('unlock-btn').addEventListener('click',unlockFive);el('reset-today-btn').addEventListener('click',()=>show('data'));el('back-btn').addEventListener('click',()=>show('home'));el('next-btn').addEventListener('click',advance);el('result-home-btn').addEventListener('click',()=>show('home'));el('result-more-btn').addEventListener('click',start);
  document.querySelectorAll('.nav button').forEach(btn=>btn.addEventListener('click',()=>show(btn.dataset.view)));el('export-json').addEventListener('click',exportJson);el('export-csv').addEventListener('click',exportCsv);el('import-file').addEventListener('change',importJson);
  el('reset-today').addEventListener('click',resetToday);el('reset-progress').addEventListener('click',resetProgress);el('reset-all').addEventListener('click',fullReset);
  renderHome();if('speechSynthesis' in window)window.speechSynthesis.getVoices();
  if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('./service-worker.js?v=1.3p456').catch(()=>{});
}
init();
