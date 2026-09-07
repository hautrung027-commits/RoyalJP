export interface GalleryImage {
  id: string;
  title: string;
  titleJa?: string;
  subtitle: string;
  subtitleJa?: string;
  category: 'all' | 'exterior' | 'interior' | 'details' | 'handover';
  categoryName: string;
  categoryNameJa?: string;
  imageUrl: string;
  carName: string;
  carNameJa?: string;
  highlight: string;
  highlightJa?: string;
}

export const SHOWROOM_GALLERY: GalleryImage[] = [
  {
    id: "gal-1",
    title: "Mercedes-Maybach S680 Hai Tông Màu",
    titleJa: "メルセデス・マイバッハ S680 ツートーンペイント",
    subtitle: "Ngoại thất hai tông màu Obsidian Black & Bicolor Champagne chuẩn Bespoke",
    subtitleJa: "オブシディアンブラックとシャンパンシルバーが織りなす究極の特注ツートーン",
    category: "exterior",
    categoryName: "Ngoại Thất",
    categoryNameJa: "エクステリア",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
    carName: "Mercedes-Maybach S680 First Class",
    carNameJa: "メルセデス・マイバッハ S680 ファーストクラス",
    highlight: "Sơn thủ công 2 màu kéo dài 7 ngày tại nhà máy Sindelfingen",
    highlightJa: "ジンデルフィンゲン工場で熟練職人が7日間かけて仕上げたハンドペイント"
  },
  {
    id: "gal-2",
    title: "Khoang Lái Hàng Ghế Sau Hạng Nhất",
    titleJa: "後席ファーストクラス エグゼクティブスイート",
    subtitle: "Ghế thương gia ngả 43.5 độ kèm bàn làm việc gập điện và bệ đỡ bắp chân massage",
    subtitleJa: "リクライニング角43.5°を誇る後席独立シート、電動格納テーブルおよび温熱マッサージ完備",
    category: "interior",
    categoryName: "Nội Thất",
    categoryNameJa: "インテリア",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop",
    carName: "Khoang Hạng Nhất Maybach & Rolls-Royce",
    carNameJa: "マイバッハ＆ロールスロイス ファーストクラス",
    highlight: "Da bò Nappa nguyên tấm tuyển chọn từ thảo nguyên Bavaria",
    highlightJa: "バイエルン高地で厳選された最高級フルグレインナッパレザー採用"
  },
  {
    id: "gal-3",
    title: "Porsche Panamera Turbo E-Hybrid",
    titleJa: "ポルシェ パナメーラ ターボ E-ハイブリッド",
    subtitle: "Vóc dáng coupe thể thao 4 cửa với cụm đèn pha ma trận LED HD 32.000 điểm ảnh",
    subtitleJa: "片側32,000画素のHDマトリクスLEDヘッドライトを備えた4ドアスポーツクーペ",
    category: "exterior",
    categoryName: "Ngoại Thất",
    categoryNameJa: "エクステリア",
    imageUrl: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
    carName: "Porsche Panamera Turbo E-Hybrid 2026",
    carNameJa: "ポルシェ パナメーラ ターボ E-ハイブリッド 2026",
    highlight: "Công suất 680 mã lực, tốc độ tối đa 315 km/h",
    highlightJa: "システム出力680PS、最高速度315km/hの圧巻のドライビング"
  },
  {
    id: "gal-4",
    title: "Bàn Giao Xe Riêng Tư Cho Khách Hàng VIP",
    titleJa: "VIPオーナー専用 プライベート納車セレモニー",
    subtitle: "Khu vực Private Handover Bay trang bị thảm đỏ, hoa tươi và tiệc Champagne thượng hạng",
    subtitleJa: "レッドカーペットと銘醸シャンパンをご用意した専用デリバリーブースでの格調高き納車式",
    category: "handover",
    categoryName: "Khoảnh Khắc Bàn Giao",
    categoryNameJa: "ご納車セレモニー",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1200&auto=format&fit=crop",
    carName: "Nghi Thức Bàn Giao VIP tại Showroom",
    carNameJa: "六本木ショールーム VIP納車式",
    highlight: "Đặc quyền chìa khóa mạ vàng và hộp kỷ niệm Bespoke",
    highlightJa: "特製ゴールドキーケースと特注メモリアルブックを進呈"
  },
  {
    id: "gal-5",
    title: "Chi Tiết Vành Đúc Hợp Kim Đa Chấu 22 Inch",
    titleJa: "22インチ鍛造マルチスポークアルミホイール & PCCB",
    subtitle: "Bộ mâm hợp kim rèn phay kim cương cùng kẹp phanh gốm Ceramic chịu nhiệt cao",
    subtitleJa: "ダイヤモンドカット仕上げの高剛性鍛造ホイールと対向ピストン式カーボンセラミックブレーキ",
    category: "details",
    categoryName: "Chi Tiết Tinh Xảo",
    categoryNameJa: "クラフトマンシップ",
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop",
    carName: "Hệ Thống Mâm Xe Siêu Nhẹ & Phanh Gốm",
    carNameJa: "超軽量鍛造ホイール & セラミックブレーキシステム",
    highlight: "Giảm 30% trọng lượng không treo để tăng tốc vượt trội",
    highlightJa: "バネ下重量を大幅軽減し、圧倒的な回頭性と制動力を実現"
  },
  {
    id: "gal-6",
    title: "Khu Vực Trưng Bày Độc Bản Range Rover SV",
    titleJa: "レンジローバー SV 特別展示エリア",
    subtitle: "Không gian trưng bày đạt chuẩn Hoàng gia Anh với ánh sáng studio mô phỏng tự nhiên",
    subtitleJa: "自然光を忠実に再現したスタジオライティングでボディの陰影を美しく演出",
    category: "exterior",
    categoryName: "Ngoại Thất",
    categoryNameJa: "エクステリア",
    imageUrl: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?q=80&w=1200&auto=format&fit=crop",
    carName: "Range Rover SV Autobiography LWB",
    carNameJa: "レンジローバー SV オートバイオグラフィー LWB",
    highlight: "Khung gầm MLA-Flex tĩnh lặng bậc nhất phân khúc SUV siêu sang",
    highlightJa: "MLA-Flexアーキテクチャによるクラストップレベルの静粛性"
  },
  {
    id: "gal-7",
    title: "Vô Lăng Thể Thao Alcantara & Sợi Carbon",
    titleJa: "アルカンターラ＆カーボン スポーツステアリング",
    subtitle: "Tích hợp cụm nút điều khiển xoay đa chế độ lái và lẫy chuyển số hợp kim nguyên khối",
    subtitleJa: "ドライビングダイナミクススイッチとアルミ削り出しパドルシフトを直感配置",
    category: "details",
    categoryName: "Chi Tiết Tinh Xảo",
    categoryNameJa: "クラフトマンシップ",
    imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
    carName: "Vô Lăng AMG & M Performance",
    carNameJa: "AMG & M パフォーマンスステアリング",
    highlight: "Khâu chỉ màu vàng Aurum Gold thủ công",
    highlightJa: "ゴールドステッチの手縫いフィニッシュ"
  },
  {
    id: "gal-8",
    title: "Khoang Thương Gia Lexus LM 500h 4 Chỗ",
    titleJa: "レクサス LM 500h 完全個室キャビン",
    subtitle: "Vách ngăn kính điện riêng tư cùng màn hình 48 inch siêu rộng và tủ lạnh mini",
    subtitleJa: "48インチワイドディスプレイと調光ガラスパーテーションで極上のプライベート空間",
    category: "interior",
    categoryName: "Nội Thất",
    categoryNameJa: "インテリア",
    imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    carName: "Lexus LM 500h Executive 4-Seater",
    carNameJa: "レクサス LM 500h EXECUTIVE 4人乗り",
    highlight: "Dàn âm thanh vòm 3D Mark Levinson 23 loa hòa nhạc",
    highlightJa: "マークレビンソン 23スピーカー プレミアムリファレンスサラウンド"
  }
];
