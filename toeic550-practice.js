'use strict';

/*
 * ENGLISH QUEST — TOEIC 550 PRACTICE 100 v1.0
 * Must load AFTER app.js and content-packs.js, BEFORE course-layer.js.
 * Words are original, and their IDs are stable for saved learning records.
 * This addition does not modify existing START 40 progress or PLAYER data.
 * exampleEn/exampleJa are reserved for the future context/listening stages;
 * current normal STEP 1/2/3 and TEST AREA behavior remain unchanged.
 */
(() => {
  const PACK_ID='toeic550-practice';
  const PRACTICE_WORDS = [
  {
    "id": "t550p-reimburse",
    "en": "reimburse",
    "jp": "立て替えた費用を払い戻す、精算する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "The company will reimburse travel expenses.",
    "exampleJa": "会社は出張費を精算します。"
  },
  {
    "id": "t550p-invoice",
    "en": "invoice",
    "jp": "請求書",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "The invoice is due on Friday.",
    "exampleJa": "請求書の支払期限は金曜日です。"
  },
  {
    "id": "t550p-inventory",
    "en": "inventory",
    "jp": "在庫、棚卸し",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "We checked the inventory yesterday.",
    "exampleJa": "昨日、在庫を確認しました。"
  },
  {
    "id": "t550p-shipment",
    "en": "shipment",
    "jp": "出荷、発送品",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "The shipment was delayed.",
    "exampleJa": "出荷が遅れました。"
  },
  {
    "id": "t550p-postpone",
    "en": "postpone",
    "jp": "延期する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "They postponed the meeting until Monday.",
    "exampleJa": "彼らは会議を月曜日まで延期しました。"
  },
  {
    "id": "t550p-accommodate",
    "en": "accommodate",
    "jp": "収容する、要望に対応する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "The hotel can accommodate 200 guests.",
    "exampleJa": "そのホテルは200人の宿泊客を受け入れられます。"
  },
  {
    "id": "t550p-eligible",
    "en": "eligible",
    "jp": "資格がある、対象となる",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "You may be eligible for a discount.",
    "exampleJa": "割引の対象になるかもしれません。"
  },
  {
    "id": "t550p-premises",
    "en": "premises",
    "jp": "敷地、施設内",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "Smoking is not allowed on the premises.",
    "exampleJa": "敷地内は禁煙です。"
  },
  {
    "id": "t550p-conduct",
    "en": "conduct",
    "jp": "実施する、行う",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "We will conduct a customer survey.",
    "exampleJa": "顧客アンケートを実施します。"
  },
  {
    "id": "t550p-complimentary",
    "en": "complimentary",
    "jp": "無料で提供される",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "Complimentary breakfast is included.",
    "exampleJa": "無料の朝食が付いています。"
  },
  {
    "id": "t550p-obtain",
    "en": "obtain",
    "jp": "入手する、得る",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "Please obtain approval first.",
    "exampleJa": "まず承認を得てください。"
  },
  {
    "id": "t550p-approximately",
    "en": "approximately",
    "jp": "およそ、約",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "The trip takes approximately two hours.",
    "exampleJa": "移動にはおよそ2時間かかります。"
  },
  {
    "id": "t550p-allocate",
    "en": "allocate",
    "jp": "割り当てる、配分する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "We allocated funds to the project.",
    "exampleJa": "その事業に資金を配分しました。"
  },
  {
    "id": "t550p-approve",
    "en": "approve",
    "jp": "承認する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "The director approved the proposal.",
    "exampleJa": "部長は提案を承認しました。"
  },
  {
    "id": "t550p-arrange",
    "en": "arrange",
    "jp": "手配する、取り決める",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "I will arrange transportation.",
    "exampleJa": "移動手段を手配します。"
  },
  {
    "id": "t550p-assign",
    "en": "assign",
    "jp": "担当を割り当てる",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "They assigned her a new task.",
    "exampleJa": "彼女に新しい仕事を割り当てました。"
  },
  {
    "id": "t550p-attach",
    "en": "attach",
    "jp": "添付する、取り付ける",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "Please attach the document.",
    "exampleJa": "書類を添付してください。"
  },
  {
    "id": "t550p-authorize",
    "en": "authorize",
    "jp": "許可する、権限を与える",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "Only managers can authorize payments.",
    "exampleJa": "管理者だけが支払いを承認できます。"
  },
  {
    "id": "t550p-brochure",
    "en": "brochure",
    "jp": "案内パンフレット",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "Please read the brochure.",
    "exampleJa": "案内パンフレットをお読みください。"
  },
  {
    "id": "t550p-candidate",
    "en": "candidate",
    "jp": "候補者、応募者",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "We interviewed three candidates.",
    "exampleJa": "3人の応募者と面接しました。"
  },
  {
    "id": "t550p-colleague",
    "en": "colleague",
    "jp": "同僚",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "A colleague helped me prepare.",
    "exampleJa": "同僚が準備を手伝ってくれました。"
  },
  {
    "id": "t550p-compile",
    "en": "compile",
    "jp": "取りまとめる、編集する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "She compiled the sales figures.",
    "exampleJa": "彼女は売上数字を取りまとめました。"
  },
  {
    "id": "t550p-contract",
    "en": "contract",
    "jp": "契約、契約書",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "Please review the contract.",
    "exampleJa": "契約書を確認してください。"
  },
  {
    "id": "t550p-corporate",
    "en": "corporate",
    "jp": "企業の、会社の",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "Corporate headquarters is in Tokyo.",
    "exampleJa": "本社は東京にあります。"
  },
  {
    "id": "t550p-distribute",
    "en": "distribute",
    "jp": "配布する、流通させる",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "They distribute products nationwide.",
    "exampleJa": "全国に製品を流通させています。"
  },
  {
    "id": "t550p-efficient",
    "en": "efficient",
    "jp": "効率的な",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "The new system is more efficient.",
    "exampleJa": "新しいシステムの方が効率的です。"
  },
  {
    "id": "t550p-estimate",
    "en": "estimate",
    "jp": "見積もり、見積もる",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "The estimate includes labor costs.",
    "exampleJa": "見積もりには人件費が含まれます。"
  },
  {
    "id": "t550p-facility",
    "en": "facility",
    "jp": "施設、設備",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "The facility closes at six.",
    "exampleJa": "その施設は6時に閉まります。"
  },
  {
    "id": "t550p-implement",
    "en": "implement",
    "jp": "実施する、導入する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "We implemented a new policy.",
    "exampleJa": "新しい方針を導入しました。"
  },
  {
    "id": "t550p-inform",
    "en": "inform",
    "jp": "知らせる",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "Please inform the staff of the change.",
    "exampleJa": "変更をスタッフに知らせてください。"
  },
  {
    "id": "t550p-inquire",
    "en": "inquire",
    "jp": "問い合わせる",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "Please inquire at the front desk.",
    "exampleJa": "フロントでお問い合わせください。"
  },
  {
    "id": "t550p-inspection",
    "en": "inspection",
    "jp": "検査、点検",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "The building passed the inspection.",
    "exampleJa": "その建物は検査に合格しました。"
  },
  {
    "id": "t550p-install",
    "en": "install",
    "jp": "設置する、取り付ける",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "They will install the equipment.",
    "exampleJa": "彼らが設備を設置します。"
  },
  {
    "id": "t550p-maintain",
    "en": "maintain",
    "jp": "維持する、保守する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "We maintain the machines regularly.",
    "exampleJa": "定期的に機械を保守しています。"
  },
  {
    "id": "t550p-notify",
    "en": "notify",
    "jp": "通知する、知らせる",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "We will notify customers by email.",
    "exampleJa": "顧客にはメールで知らせます。"
  },
  {
    "id": "t550p-procedure",
    "en": "procedure",
    "jp": "手順、手続き",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "Follow the safety procedure.",
    "exampleJa": "安全手順に従ってください。"
  },
  {
    "id": "t550p-proposal",
    "en": "proposal",
    "jp": "提案、提案書",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "We submitted a proposal.",
    "exampleJa": "提案書を提出しました。"
  },
  {
    "id": "t550p-recruit",
    "en": "recruit",
    "jp": "採用する、募集する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "The firm plans to recruit workers.",
    "exampleJa": "その会社は従業員を募集する予定です。"
  },
  {
    "id": "t550p-refund",
    "en": "refund",
    "jp": "返金、払い戻し",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "You can request a refund.",
    "exampleJa": "返金を求めることができます。"
  },
  {
    "id": "t550p-renovation",
    "en": "renovation",
    "jp": "改装、改修",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "実務語彙 40",
    "exampleEn": "The store is closed for renovation.",
    "exampleJa": "その店は改装のため休業しています。"
  },
  {
    "id": "t550p-issue",
    "en": "issue",
    "jp": "問題；発行する；号",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "We need to address this issue.",
    "exampleJa": "私たちはこの問題に対処する必要があります。"
  },
  {
    "id": "t550p-due",
    "en": "due",
    "jp": "期限が来ている、予定の",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "The payment is due tomorrow.",
    "exampleJa": "支払い期限は明日です。"
  },
  {
    "id": "t550p-charge",
    "en": "charge",
    "jp": "料金を請求する；料金；担当",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "They charge a delivery fee.",
    "exampleJa": "配送料を請求します。"
  },
  {
    "id": "t550p-cover",
    "en": "cover",
    "jp": "対象に含む；費用を負担する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "The fee covers lunch.",
    "exampleJa": "料金には昼食代が含まれます。"
  },
  {
    "id": "t550p-account",
    "en": "account",
    "jp": "口座；取引先；説明",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "Please check your bank account.",
    "exampleJa": "銀行口座を確認してください。"
  },
  {
    "id": "t550p-address",
    "en": "address",
    "jp": "対処する；住所",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "We must address the complaint.",
    "exampleJa": "苦情に対応しなければなりません。"
  },
  {
    "id": "t550p-balance",
    "en": "balance",
    "jp": "残高；均衡",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "Your account balance is low.",
    "exampleJa": "口座残高が少なくなっています。"
  },
  {
    "id": "t550p-book",
    "en": "book",
    "jp": "予約する；本",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "Please book a room in advance.",
    "exampleJa": "事前に部屋を予約してください。"
  },
  {
    "id": "t550p-branch",
    "en": "branch",
    "jp": "支店；枝",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "Visit our nearest branch.",
    "exampleJa": "最寄りの支店へお越しください。"
  },
  {
    "id": "t550p-claim",
    "en": "claim",
    "jp": "請求する；主張する；請求",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "You can claim travel expenses.",
    "exampleJa": "旅費を請求できます。"
  },
  {
    "id": "t550p-concern",
    "en": "concern",
    "jp": "懸念；関係する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "Safety is our main concern.",
    "exampleJa": "安全が私たちの最大の懸念です。"
  },
  {
    "id": "t550p-present",
    "en": "present",
    "jp": "提示する；現在の；贈り物",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "Please present your ID at the desk.",
    "exampleJa": "受付で身分証を提示してください。"
  },
  {
    "id": "t550p-deliver",
    "en": "deliver",
    "jp": "届ける；（講演を）行う",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "She will deliver a presentation.",
    "exampleJa": "彼女がプレゼンテーションを行います。"
  },
  {
    "id": "t550p-draft",
    "en": "draft",
    "jp": "下書き；草案",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "I prepared a draft of the report.",
    "exampleJa": "報告書の草案を作りました。"
  },
  {
    "id": "t550p-fare",
    "en": "fare",
    "jp": "運賃",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "The train fare has increased.",
    "exampleJa": "電車の運賃が上がりました。"
  },
  {
    "id": "t550p-file",
    "en": "file",
    "jp": "提出する；ファイル",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "Please file your expense report.",
    "exampleJa": "経費報告書を提出してください。"
  },
  {
    "id": "t550p-figure",
    "en": "figure",
    "jp": "数字；図；人物",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "Sales figures increased in June.",
    "exampleJa": "6月の売上数字は増加しました。"
  },
  {
    "id": "t550p-hold",
    "en": "hold",
    "jp": "開催する；持つ；保留する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "The seminar will be held online.",
    "exampleJa": "セミナーはオンラインで開催されます。"
  },
  {
    "id": "t550p-interest",
    "en": "interest",
    "jp": "利息；関心",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "The loan has a low interest rate.",
    "exampleJa": "そのローンの金利は低いです。"
  },
  {
    "id": "t550p-item",
    "en": "item",
    "jp": "品目；項目",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "There are five items on the agenda.",
    "exampleJa": "議題には5つの項目があります。"
  },
  {
    "id": "t550p-leave",
    "en": "leave",
    "jp": "休暇；去る；残す",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "She is on maternity leave.",
    "exampleJa": "彼女は産休中です。"
  },
  {
    "id": "t550p-matter",
    "en": "matter",
    "jp": "問題；重要である",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "This is an urgent matter.",
    "exampleJa": "これは緊急の案件です。"
  },
  {
    "id": "t550p-note",
    "en": "note",
    "jp": "注意する；メモ；手形",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "Please note the new deadline.",
    "exampleJa": "新しい締め切りにご注意ください。"
  },
  {
    "id": "t550p-offer",
    "en": "offer",
    "jp": "提示する；申し出；特典",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "We offer free delivery.",
    "exampleJa": "無料配送を提供しています。"
  },
  {
    "id": "t550p-position",
    "en": "position",
    "jp": "職位；位置；立場",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "She applied for a management position.",
    "exampleJa": "彼女は管理職に応募しました。"
  },
  {
    "id": "t550p-rate",
    "en": "rate",
    "jp": "料金；割合；評価する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "The room rate includes breakfast.",
    "exampleJa": "宿泊料金には朝食が含まれます。"
  },
  {
    "id": "t550p-reserve",
    "en": "reserve",
    "jp": "予約する；確保する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "We reserved a seat for you.",
    "exampleJa": "あなたの席を確保しました。"
  },
  {
    "id": "t550p-run",
    "en": "run",
    "jp": "運営する；走る",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "He runs a small business.",
    "exampleJa": "彼は小さな会社を経営しています。"
  },
  {
    "id": "t550p-serve",
    "en": "serve",
    "jp": "役立つ；提供する；勤める",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "The restaurant serves lunch.",
    "exampleJa": "そのレストランでは昼食を提供しています。"
  },
  {
    "id": "t550p-statement",
    "en": "statement",
    "jp": "明細書；声明；記述",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "多義語・語法 30",
    "exampleEn": "Please review your bank statement.",
    "exampleJa": "銀行の利用明細をご確認ください。"
  },
  {
    "id": "t550p-be-subject-to",
    "en": "be subject to ~",
    "jp": "〜の対象となる、〜に従う",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "Prices are subject to change.",
    "exampleJa": "価格は変更される場合があります。"
  },
  {
    "id": "t550p-in-accordance-with",
    "en": "in accordance with ~",
    "jp": "〜に従って",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "We acted in accordance with the rules.",
    "exampleJa": "規則に従って行動しました。"
  },
  {
    "id": "t550p-in-charge-of",
    "en": "in charge of ~",
    "jp": "〜を担当して",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "She is in charge of sales.",
    "exampleJa": "彼女は営業を担当しています。"
  },
  {
    "id": "t550p-prior-to",
    "en": "prior to ~",
    "jp": "〜より前に",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "Submit the form prior to arrival.",
    "exampleJa": "到着前に用紙を提出してください。"
  },
  {
    "id": "t550p-with-regard-to",
    "en": "with regard to ~",
    "jp": "〜に関して",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "I have a question with regard to billing.",
    "exampleJa": "請求について質問があります。"
  },
  {
    "id": "t550p-as-a-result-of",
    "en": "as a result of ~",
    "jp": "〜の結果として",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "Flights were canceled as a result of the storm.",
    "exampleJa": "嵐のため欠航になりました。"
  },
  {
    "id": "t550p-on-behalf-of",
    "en": "on behalf of ~",
    "jp": "〜を代表して、〜の代理で",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "I am writing on behalf of the team.",
    "exampleJa": "チームを代表してご連絡します。"
  },
  {
    "id": "t550p-take-place",
    "en": "take place",
    "jp": "行われる、開催される",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "The event will take place on Friday.",
    "exampleJa": "イベントは金曜日に開催されます。"
  },
  {
    "id": "t550p-be-scheduled-to",
    "en": "be scheduled to ~",
    "jp": "〜する予定になっている",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "The train is scheduled to arrive at nine.",
    "exampleJa": "電車は9時に到着予定です。"
  },
  {
    "id": "t550p-as-requested",
    "en": "as requested",
    "jp": "依頼されたとおりに",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "As requested, I attached the file.",
    "exampleJa": "ご依頼どおりファイルを添付しました。"
  },
  {
    "id": "t550p-ahead-of-schedule",
    "en": "ahead of schedule",
    "jp": "予定より早く",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "The project finished ahead of schedule.",
    "exampleJa": "事業は予定より早く完了しました。"
  },
  {
    "id": "t550p-no-later-than",
    "en": "no later than ~",
    "jp": "遅くとも〜までに",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "Please respond no later than Friday.",
    "exampleJa": "遅くとも金曜日までに返信してください。"
  },
  {
    "id": "t550p-due-to",
    "en": "due to ~",
    "jp": "〜が原因で、〜のために",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "Service is delayed due to rain.",
    "exampleJa": "雨のため運行が遅れています。"
  },
  {
    "id": "t550p-at-your-earliest-convenience",
    "en": "at your earliest convenience",
    "jp": "ご都合のよいときに、できるだけ早く",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "Please reply at your earliest convenience.",
    "exampleJa": "ご都合がつき次第返信してください。"
  },
  {
    "id": "t550p-make-arrangements-for",
    "en": "make arrangements for ~",
    "jp": "〜の手配をする",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "We made arrangements for the visit.",
    "exampleJa": "訪問の手配をしました。"
  },
  {
    "id": "t550p-be-aware-of",
    "en": "be aware of ~",
    "jp": "〜を認識している、〜に注意する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "Please be aware of the new rule.",
    "exampleJa": "新しい規則にご注意ください。"
  },
  {
    "id": "t550p-in-response-to",
    "en": "in response to ~",
    "jp": "〜に応えて、〜への返答として",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "I am writing in response to your email.",
    "exampleJa": "メールへの返信としてご連絡しています。"
  },
  {
    "id": "t550p-in-stock",
    "en": "in stock",
    "jp": "在庫がある",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "This item is currently in stock.",
    "exampleJa": "この商品は現在在庫があります。"
  },
  {
    "id": "t550p-out-of-stock",
    "en": "out of stock",
    "jp": "在庫切れで",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "The blue model is out of stock.",
    "exampleJa": "青いモデルは在庫切れです。"
  },
  {
    "id": "t550p-fill-out",
    "en": "fill out ~",
    "jp": "〜に必要事項を記入する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "頻出表現 20",
    "exampleEn": "Please fill out the application form.",
    "exampleJa": "申込書に記入してください。"
  },
  {
    "id": "t550p-itinerary",
    "en": "itinerary",
    "jp": "旅行日程表、旅程",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "音で迷いやすい語 10",
    "exampleEn": "Check the itinerary before departure.",
    "exampleJa": "出発前に旅行日程表を確認してください。"
  },
  {
    "id": "t550p-personnel",
    "en": "personnel",
    "jp": "職員、人事担当者",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "音で迷いやすい語 10",
    "exampleEn": "All personnel must attend the training.",
    "exampleJa": "全職員が研修に参加しなければなりません。"
  },
  {
    "id": "t550p-guarantee",
    "en": "guarantee",
    "jp": "保証；保証する",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "音で迷いやすい語 10",
    "exampleEn": "The company offers a full guarantee.",
    "exampleJa": "会社は全面保証を提供しています。"
  },
  {
    "id": "t550p-quarterly",
    "en": "quarterly",
    "jp": "四半期ごとの",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "音で迷いやすい語 10",
    "exampleEn": "We publish quarterly reports.",
    "exampleJa": "四半期ごとに報告書を発行します。"
  },
  {
    "id": "t550p-thorough",
    "en": "thorough",
    "jp": "徹底した、念入りな",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "音で迷いやすい語 10",
    "exampleEn": "A thorough review is necessary.",
    "exampleJa": "徹底的な確認が必要です。"
  },
  {
    "id": "t550p-annually",
    "en": "annually",
    "jp": "毎年、年に1回",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "音で迷いやすい語 10",
    "exampleEn": "The fee is paid annually.",
    "exampleJa": "料金は年に1回支払われます。"
  },
  {
    "id": "t550p-immediately",
    "en": "immediately",
    "jp": "ただちに、すぐに",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "音で迷いやすい語 10",
    "exampleEn": "Please contact us immediately.",
    "exampleJa": "ただちにご連絡ください。"
  },
  {
    "id": "t550p-particularly",
    "en": "particularly",
    "jp": "特に、とりわけ",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "音で迷いやすい語 10",
    "exampleEn": "This service is particularly useful.",
    "exampleJa": "このサービスは特に便利です。"
  },
  {
    "id": "t550p-discrepancy",
    "en": "discrepancy",
    "jp": "食い違い、不一致",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "音で迷いやすい語 10",
    "exampleEn": "We found a discrepancy in the records.",
    "exampleJa": "記録に不一致が見つかりました。"
  },
  {
    "id": "t550p-throughout",
    "en": "throughout",
    "jp": "〜の至るところで、〜の間ずっと",
    "programs": [],
    "packs": [
      "toeic550-practice"
    ],
    "category": "音で迷いやすい語 10",
    "exampleEn": "The store is open throughout the year.",
    "exampleJa": "その店は一年中営業しています。"
  }
];

  const existingIds=new Set(WORDS.map(w=>w.id));
  const added=PRACTICE_WORDS.filter(w=>!existingIds.has(w.id));
  WORDS.push(...added);

  function ensureRecords(target){
    if(!target?.records)return;
    for(const word of PRACTICE_WORDS){
      if(!Object.prototype.hasOwnProperty.call(target.records,word.id)){
        target.records[word.id]=defaultRecord(false);
      }
      if(target.daySnapshot?.records &&
          !Object.prototype.hasOwnProperty.call(target.daySnapshot.records,word.id)){
        target.daySnapshot.records[word.id]=defaultRecord(false);
      }
    }
  }

  ensureRecords(state);
  if(liveState!==state)ensureRecords(liveState);
  if(testState)ensureRecords(testState);

  // RECORD FIX v1.7.3 restores appended IDs from this shared registry
  // after app.js's legacy migrate() has run. Registration is essential.
  if(window.EnglishQuestExtraPacks && Array.isArray(window.EnglishQuestExtraPacks.words)){
    const known=new Set(window.EnglishQuestExtraPacks.words.map(w=>w.id));
    window.EnglishQuestExtraPacks.words.push(...PRACTICE_WORDS.filter(w=>!known.has(w.id)));
    window.EnglishQuestExtraPacks.counts.toeic550Practice=PRACTICE_WORDS.length;
  }else{
    console.warn('TOEIC PRACTICE: content-packs.js is required before this script.');
  }

  if(!testMode)persist();

  window.EnglishQuestToeicPractice={
    packId:PACK_ID,
    count:PRACTICE_WORDS.length,
    categories:[
      {name:'実務語彙',count:40},
      {name:'多義語・語法',count:30},
      {name:'頻出表現',count:20},
      {name:'音で迷いやすい語',count:10}
    ]
  };
})();
