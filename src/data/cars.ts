import { Car } from '../types';
import heroCarImg from '../assets/images/hero_luxury_car_1788423241155.jpg';

export const HERO_CAR_DATA = {
  name: "AURUM GT-650 Executive Coupé",
  tag: "Kiệt Tác 2026 • Limited Edition",
  tagJa: "2026 傑作 • 特別限定仕様車",
  price: "¥23,800,000",
  image: heroCarImg,
  specs: [
    { label: "Công suất cực đại", labelJa: "最高出力", value: "650 HP", sub: "V8 Biturbo 4.0L" },
    { label: "Tăng tốc 0 - 100 km/h", labelJa: "0 - 100 km/h 加速", value: "3.2 giây", valueJa: "3.2 秒", sub: "Launch Control" },
    { label: "Tốc độ tối đa", labelJa: "最高速度", value: "325 km/h", sub: "Giới hạn điện tử", subJa: "電子リミッター制御" },
    { label: "Hộp số", labelJa: "トランスミッション", value: "8 cấp PDK", valueJa: "8速 PDK", sub: "Ly hợp kép", subJa: "デュアルクラッチ" }
  ],
  colors: [
    { name: "Champagne Silver", hex: "#D9DDE1" },
    { name: "Pearl White", hex: "#FFFFFF" },
    { name: "Warm Ivory", hex: "#F7F5F0" },
    { name: "Navy Royal", hex: "#17212B" },
    { name: "Aurum Gold", hex: "#C8A96B" }
  ]
};

export const CARS_DATA: Car[] = [
  {
    id: "luxe-sedan-1",
    name: "Mercedes-Maybach S680 First Class",
    nameJa: "メルセデス・マイバッハ S680 ファーストクラス",
    category: "sedan",
    categoryLabel: "Sedan",
    categoryLabelJa: "セダン",
    price: "¥38,500,000",
    priceRaw: 38500000,
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
    engine: "6.0L V12 Twin-Turbo",
    engineJa: "6.0L V型12気筒 ツインターボ",
    horsepower: "621 HP",
    acceleration: "4.4s",
    topSpeed: "250 km/h",
    transmission: "9G-TRONIC",
    transmissionJa: "9G-TRONIC 9速AT",
    fuelType: "Xăng",
    fuelTypeJa: "ハイオクガソリン",
    year: 2026,
    tag: "Đẳng cấp VIP",
    tagJa: "VIP最高峰モデル",
    tagType: "gold",
    description: "Đỉnh cao của sự sang trọng quý phái, không gian nội thất da Nappa độc bản và hệ thống âm thanh vòm Burmester High-End 4D.",
    descriptionJa: "至高のラグジュアリーの極致。特注ナッパレザーインテリア、Burmesterハイエンド4Dサラウンドシステムを搭載した移動する宮殿。",
    colors: [
      { name: "Bicolor Champagne & Navy", hex: "#D9DDE1" },
      { name: "Obsidian Black", hex: "#243746" },
      { name: "Diamond White", hex: "#FFFFFF" }
    ],
    features: [
      "Ghế thương gia ngả 43.5 độ",
      "Hệ thống lọc khí ENERGIZING",
      "Màn hình OLED 12.8 inch",
      "Treo khí nén chủ động E-ACTIVE"
    ],
    featuresJa: [
      "後席ファーストクラスエグゼクティブシート (リクライニング43.5°)",
      "ENERGIZING エアコントロール空気清浄システム",
      "12.8インチ有機ELメディアディスプレイ",
      "E-ACTIVE BODY CONTROL フルアクティブサスペンション"
    ]
  },
  {
    id: "luxe-sedan-2",
    name: "Porsche Panamera Turbo E-Hybrid",
    nameJa: "ポルシェ パナメーラ ターボ E-ハイブリッド",
    category: "sedan",
    categoryLabel: "Sedan",
    categoryLabelJa: "セダン",
    price: "¥29,800,000",
    priceRaw: 29800000,
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
    engine: "4.0L V8 Turbo Hybrid",
    engineJa: "4.0L V8 ターボ プラグインハイブリッド",
    horsepower: "680 HP",
    acceleration: "3.2s",
    topSpeed: "315 km/h",
    transmission: "8 cấp PDK",
    transmissionJa: "8速 ポルシェ ドッペルクップルング (PDK)",
    fuelType: "Plug-in Hybrid",
    fuelTypeJa: "プラグインハイブリッド",
    year: 2026,
    tag: "Sẵn xe giao ngay",
    tagJa: "即納可能車",
    tagType: "navy",
    description: "Sự kết hợp hoàn mỹ giữa hiệu năng đường đua và tiện nghi saloon thượng hạng trên từng cung đường trải nghiệm.",
    descriptionJa: "サーキット由来の圧倒的パフォーマンスとサルーンの至高の快適性が完璧に融合したフラッグシップグランドツアラー。",
    colors: [
      { name: "Carrara White", hex: "#FFFFFF" },
      { name: "Dolomite Silver", hex: "#D9DDE1" },
      { name: "Gentian Blue", hex: "#17212B" }
    ],
    features: [
      "Porsche Active Suspension",
      "Màn hình hành khách phía trước",
      "Ống xả thể thao",
      "Chế độ lái Sport Chrono"
    ],
    featuresJa: [
      "ポルシェ アクティブサスペンション マネジメント (PASM)",
      "助手席専用パッセンジャーディスプレイ",
      "スポーツエグゾーストシステム",
      "スポーツクロノパッケージ"
    ]
  },
  {
    id: "luxe-suv-1",
    name: "Range Rover SV Autobiography LWB",
    nameJa: "レンジローバー SV オートバイオグラフィー LWB",
    category: "suv",
    categoryLabel: "SUV",
    categoryLabelJa: "SUV",
    price: "¥36,500,000",
    priceRaw: 36500000,
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1200&auto=format&fit=crop",
    engine: "4.4L V8 Twin-Turbocharged",
    engineJa: "4.4L V8 ツインターボチャージャー",
    horsepower: "606 HP",
    acceleration: "4.6s",
    topSpeed: "261 km/h",
    transmission: "Tự động 8 cấp",
    transmissionJa: "電子制御8速オートマチック",
    fuelType: "Xăng",
    fuelTypeJa: "ハイオクガソリン",
    year: 2026,
    tag: "Phiên bản SV giới hạn",
    tagJa: "SV限定エディション",
    tagType: "gold",
    description: "Biểu tượng SUV vương giả của giới tài phiệt với trục cơ sở kéo dài, chi tiết mạ vàng trắng và bàn làm việc chỉnh điện thông minh.",
    descriptionJa: "ロングホイールベースによる圧倒的キャビンスペース。セラミックフィニッシャーと電動格納式クラブテーブルを備えた王者の風格。",
    colors: [
      { name: "Ostuni Pearl White", hex: "#F7F5F0" },
      { name: "Hakuba Silver", hex: "#D9DDE1" },
      { name: "Belgravia Green", hex: "#243746" }
    ],
    features: [
      "Ghế SV Signature Suite",
      "Tủ làm mát Champagne",
      "Hệ thống khử tiếng ồn chủ động",
      "Hệ thống lái 4 bánh"
    ],
    featuresJa: [
      "SVシグネチャースイート後席独立シート",
      "シャンパン専用冷蔵クーラーキャビネット",
      "アクティブノイズキャンセレーション",
      "オールホイールステアリング (4輪操舵)"
    ]
  },
  {
    id: "luxe-suv-2",
    name: "Porsche Cayenne Turbo GT",
    nameJa: "ポルシェ カイエン ターボ GT",
    category: "suv",
    categoryLabel: "SUV",
    categoryLabelJa: "SUV",
    price: "¥32,800,000",
    priceRaw: 32800000,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    engine: "4.0L V8 Twin-Turbo",
    engineJa: "4.0L V8 ツインターボエンジン",
    horsepower: "659 HP",
    acceleration: "3.3s",
    topSpeed: "305 km/h",
    transmission: "8 cấp Tiptronic S",
    transmissionJa: "8速 ティプトロニックS",
    fuelType: "Xăng",
    fuelTypeJa: "ハイオクガソリン",
    year: 2026,
    tag: "Kỷ lục Nürburgring",
    tagJa: "ニュルブルクリンク最速記録",
    tagType: "silver",
    description: "Chiếc SUV thể thao nhanh nhất thế giới, thiết lập chuẩn mực hiệu suất phi thường với thiết kế khí động học sợi carbon.",
    descriptionJa: "ニュルブルクリンク北コースで量産SUV最速タイムを刻んだスーパーSUV。チタン製エグゾーストとカーボンルーフを標準装備。",
    colors: [
      { name: "Arctic Grey", hex: "#D9DDE1" },
      { name: "White Metallic", hex: "#FFFFFF" },
      { name: "Chalk", hex: "#F1F2F3" }
    ],
    features: [
      "Mui xe carbon",
      "Phanh gốm PCCB",
      "Ống xả titan trọng lượng nhẹ",
      "Vành đúc Neodyme 22 inch"
    ],
    featuresJa: [
      "カーボンファイバー軽量ルーフ",
      "ポルシェ セラミックコンポジット ブレーキ (PCCB)",
      "チタン製センターレイアウト エグゾースト",
      "22インチ GTデザイン ネオジムアルミホイール"
    ]
  },
  {
    id: "luxe-mpv-1",
    name: "Lexus LM 500h 4 Chỗ Hoàng Gia",
    nameJa: "レクサス LM 500h 4人乗り EXECUTIVE",
    category: "mpv",
    categoryLabel: "MPV",
    categoryLabelJa: "ミニバン",
    price: "¥20,000,000",
    priceRaw: 20000000,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    engine: "2.4L Turbo Hybrid DIRECT4",
    engineJa: "2.4L ターボ ハイブリッド DIRECT4",
    horsepower: "367 HP",
    acceleration: "6.9s",
    topSpeed: "190 km/h",
    transmission: "Tự động 6 cấp Direct Shift",
    transmissionJa: "Direct Shift 6速AT",
    fuelType: "Hybrid Tự sạc",
    fuelTypeJa: "ハイブリッド",
    year: 2026,
    tag: "Chuyên cơ mặt đất",
    tagJa: "陸上のファーストクラス",
    tagType: "gold",
    description: "Khoang thương gia độc lập ngăn cách bằng vách kính đổi màu, màn hình giải trí 48 inch siêu rộng và ghế massage hồng ngoại.",
    descriptionJa: "調光ガラス付きパーティションで仕切られた完全プライベートキャビン。48インチワイドディスプレイと赤外線温熱リフレッシュシートを完備。",
    colors: [
      { name: "Sonic Quartz", hex: "#FFFFFF" },
      { name: "Sonic Titanium", hex: "#D9DDE1" },
      { name: "Graphite Navy", hex: "#17212B" }
    ],
    features: [
      "Vách ngăn riêng tư kính điện",
      "Màn hình 48 inch Panorama",
      "Hệ thống âm thanh Mark Levinson 23 loa",
      "Tủ lạnh mini 14L"
    ],
    featuresJa: [
      "電動昇降・調光ガラスパーテーション",
      "48インチ大型ワイドディスプレイ",
      "マークレビンソン 23スピーカー プレミアムサラウンド",
      "キャビン内蔵 14L 冷蔵庫"
    ]
  },
  {
    id: "luxe-hatchback-1",
    name: "Mercedes-AMG A45 S 4MATIC+ Edition 1",
    nameJa: "メルセデスAMG A45 S 4MATIC+ エディション1",
    category: "hatchback",
    categoryLabel: "Hatchback",
    categoryLabelJa: "ハッチバック",
    price: "¥9,880,000",
    priceRaw: 9880000,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop",
    engine: "2.0L Turbo M139 mạnh nhất",
    engineJa: "2.0L 直列4気筒 ターボ M139",
    horsepower: "421 HP",
    acceleration: "3.9s",
    topSpeed: "270 km/h",
    transmission: "AMG SPEEDSHIFT 8G-DCT",
    transmissionJa: "AMGスピードシフト 8速DCT",
    fuelType: "Xăng",
    fuelTypeJa: "ハイオクガソリン",
    year: 2026,
    tag: "Hot Hatch số 1",
    tagJa: "世界最強のホットハッチ",
    tagType: "navy",
    description: "Động cơ 4 xi-lanh thương mại mạnh nhất thế giới được lắp ráp thủ công theo triết lý 'One Man, One Engine'.",
    descriptionJa: "『ワンマン・ワンエンジン』の哲学に基づき手作業で組み上げられた世界最強の2.0L直4ターボエンジンを搭載。",
    colors: [
      { name: "Sun Yellow", hex: "#DDBF7A" },
      { name: "Digital White", hex: "#FFFFFF" },
      { name: "Iridium Silver", hex: "#D9DDE1" }
    ],
    features: [
      "Chế độ drift mode",
      "Gói khí động học AMG Aero",
      "Ghế thể thao AMG Performance",
      "Vi sai cầu sau AMG Torque Control"
    ],
    featuresJa: [
      "専用ドリフトモード搭載 AMG TORQUE CONTROL",
      "AMG エアロダイナミクスパッケージ",
      "AMG パフォーマンスバケットシート",
      "AMG リアルパフォーマンステレメトリー"
    ]
  },
  {
    id: "luxe-pickup-1",
    name: "RAM 1500 TRX Havoc Edition 6.2L",
    nameJa: "ラム 1500 TRX ハボック エディション 6.2L",
    category: "pickup",
    categoryLabel: "Bán tải",
    categoryLabelJa: "ピックアップ",
    price: "¥18,500,000",
    priceRaw: 18500000,
    image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=1200&auto=format&fit=crop",
    engine: "6.2L Supercharged HEMI V8",
    engineJa: "6.2L スーパーチャージド HEMI V8",
    horsepower: "702 HP",
    acceleration: "4.5s",
    topSpeed: "190 km/h",
    transmission: "TorqueFlite 8 cấp",
    transmissionJa: "TorqueFlite 8速AT",
    fuelType: "Xăng",
    fuelTypeJa: "レギュラー/ハイオクガソリン",
    year: 2026,
    tag: "Mãnh thú sa mạc",
    tagJa: "デザートプレデター",
    tagType: "gold",
    description: "Siêu bán tải hiệu năng cao với phuộc giảm xóc Bilstein Black Hawk e2 thích ứng và khả năng vượt mọi địa hình khắc nghiệt nhất.",
    descriptionJa: "ビルシュタイン製Black Hawk e2適応型ショックアブソーバーを備え、過酷なオフロードを時速160km以上で走破可能なモンスターピックアップ。",
    colors: [
      { name: "Baja Yellow", hex: "#DDBF7A" },
      { name: "Bright White", hex: "#FFFFFF" },
      { name: "Billet Silver", hex: "#D9DDE1" }
    ],
    features: [
      "Hệ thống treo thích ứng Bilstein",
      "Lốp địa hình Goodyear 35 inch",
      "Cửa sổ trời toàn cảnh kép",
      "Màn hình HUD hiển thị kính lái"
    ],
    featuresJa: [
      "ビルシュタイン Black Hawk e2 アクティブダンピング",
      "35インチ グッドイヤー オールテレーンタイヤ",
      "パノラマツインサンルーフ",
      "フルカラー ヘッドアップディスプレイ"
    ]
  },
  {
    id: "luxe-sedan-3",
    name: "BMW M8 Gran Coupé First Edition",
    nameJa: "BMW M8 グランクーペ ファーストエディション",
    category: "sedan",
    categoryLabel: "Sedan",
    categoryLabelJa: "セダン",
    price: "¥26,800,000",
    priceRaw: 26800000,
    image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop",
    engine: "4.4L M TwinPower Turbo V8",
    engineJa: "4.4L M ツインパワーターボ V8",
    horsepower: "625 HP",
    acceleration: "3.2s",
    topSpeed: "305 km/h",
    transmission: "8 cấp M Steptronic",
    transmissionJa: "8速 Mステップトロニック (Drivelogic付)",
    fuelType: "Xăng",
    fuelTypeJa: "ハイオクガソリン",
    year: 2026,
    tag: "Mới về Showroom",
    tagJa: "六本木ショールーム新入庫",
    tagType: "navy",
    description: "Kiến trúc coupe thể thao 4 cửa với đường nét điêu khắc đầy uy lực, đèn pha Laser Light tầm chiếu 600m và trần sợi carbon.",
    descriptionJa: "彫刻のような流麗な4ドアクーペボディにカーボンルーフとBMWレーザーライト(照射距離600m)を融合させた最高峰スポーツサルーン。",
    colors: [
      { name: "Frozen Marina Bay Blue", hex: "#17212B" },
      { name: "Alpine White", hex: "#FFFFFF" },
      { name: "Donington Grey", hex: "#D9DDE1" }
    ],
    features: [
      "Hệ dẫn động M xDrive",
      "Đèn pha BMW Laserlight",
      "Nội thất da Merino nguyên tấm",
      "Hệ thống âm thanh Bowers & Wilkins"
    ],
    featuresJa: [
      "インテリジェント4WDシステム M xDrive (2WD切替可能)",
      "BMW レーザーライトシステム",
      "フルレザー メリノ バイカラーインテリア",
      "Bowers & Wilkins ダイヤモンド サラウンド サウンド"
    ]
  }
];
