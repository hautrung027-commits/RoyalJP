import promoBannerImg from '../assets/images/promo_car_banner_1788423264444.jpg';
import { FeatureBenefit, NewsArticle } from '../types';

export const PROMOTION_DATA = {
  badge: "ĐẶC QUYỀN THÁNG 9/2026",
  badgeJa: "今月の特別オーナーシップ優遇",
  title: "Đặc Quyền Chủ Sở Hữu Thượng Lưu",
  titleJa: "選ばれしオーナーのための特別優遇",
  highlight: "Gói Hỗ Trợ Độc Quyền Trị Giá Lên Đến ¥3,000,000",
  highlightJa: "最大300万円相当の購入・メンテナンス支援",
  subtitle: "Sở hữu những tuyệt tác xe sang với chính sách tài chính ưu đãi và gói chăm sóc xe chuẩn 5 sao trọn đời từ Luxe Motors Japan.",
  subtitleJa: "期間限定で正規輸入モデルの特別低金利オートローンおよびプレミアムフルメンテナンスパッケージをご提供いたします。",
  image: promoBannerImg,
  perks: [
    { 
      title: "Hỗ trợ phí đăng ký lăn bánh tại Nhật", 
      titleJa: "登録諸費用・自動車税一部サポート",
      desc: "Áp dụng cho các phiên bản giới hạn bàn giao trong tháng tại Tokyo, Osaka, Kanagawa",
      descJa: "今月ご成約・ご納車対象車両に限り、諸費用をショールームが一部負担"
    },
    { 
      title: "Tặng gói bảo dưỡng VIP 5 năm", 
      titleJa: "5年間VIPメンテナンスパック贈呈",
      desc: "Bao gồm toàn bộ phụ tùng chính hãng, thay dầu định kỳ và dịch vụ nhận xe tận nhà",
      descJa: "純正消耗品交換、オイル・ブレーキパッド交換、年次定期点検費用をすべてカバー"
    },
    { 
      title: "Lãi suất trả góp ưu đãi từ 0.9%/năm", 
      titleJa: "特別低金利 0.9% オートローン",
      desc: "Hợp tác độc quyền cùng các tổ chức tín dụng uy tín hàng đầu Nhật Bản",
      descJa: "提携信販各社による特別優遇金利（最長84回・在日外国人向け特別審査枠あり）"
    },
    { 
      title: "Tặng gói phủ Ceramic cao cấp toàn thân xe", 
      titleJa: "最高峰ナノセラミックコーティング施工",
      desc: "Bảo vệ bề mặt sơn gốm và dưỡng da nội thất chống tia UV đạt chuẩn showroom",
      descJa: "ボディ・ホイール・インテリアレザーまで極上のガラス系被膜で長期保護"
    }
  ],
  deadline: "Thời hạn áp dụng đến 30/09/2026",
  deadlineJa: "2026年9月30日ご成約分まで有効",
  ctaText: "Nhận Báo Giá Ưu Đãi",
  ctaTextJa: "特別見積りを依頼する"
};

export const WHY_CHOOSE_US: FeatureBenefit[] = [
  {
    number: "01",
    badge: "EXPERT ADVISORY",
    title: "Tư Vấn Chuyên Nghiệp Song Ngữ",
    titleJa: "プロフェッショナルな専任提案",
    description: "Đội ngũ chuyên viên người Nhật và người Việt am hiểu thị trường, hỗ trợ trọn gói thủ tục mua xe, trả góp và đăng ký biển số tại Nhật Bản.",
    descriptionJa: "欧州車アカデミー基準の専門知識を持つコンシェルジュが、お客様のライフスタイルに合わせた至高の1台をご提案。日本語・ベトナム語バイリンガル対応。"
  },
  {
    number: "02",
    badge: "TRANSPARENT PRICING",
    title: "Giá Bán Rõ Ràng, Không Phí Ẩn",
    titleJa: "明朗な価格と正規通関保証",
    description: "Toàn bộ xe đều có hồ sơ kiểm định Shaken và giấy tờ hải quan minh bạch. Báo giá lăn bánh trọn gói chi tiết từng khoản thuế phí tại Nhật.",
    descriptionJa: "正規通関書類および走行距離改ざん無しの鑑定書を全車開示。不透明な諸費用は一切ございません。"
  },
  {
    number: "03",
    badge: "FLEXIBLE FINANCE",
    title: "Hỗ Trợ Vay Ngân Hàng Tại Nhật",
    titleJa: "多様なオートローン & リース",
    description: "Gói giải pháp tài chính liên kết các ngân hàng Nhật Bản (JACCS, Orico, Cedyna). Hỗ trợ xét duyệt hồ sơ cho người nước ngoài đang làm việc tại Nhật.",
    descriptionJa: "国内大手信販会社および外資系金融機関と提携。頭金ゼロ、最長120回払い、在日外国人向け特別審査枠をご用意。"
  },
  {
    number: "04",
    badge: "CONCIERGE SERVICE",
    title: "Dịch Vụ Hậu Mãi Chuẩn 5 Sao",
    titleJa: "極上のアフターケア体制",
    description: "Xưởng bảo dưỡng chuyên dụng xe sang chuẩn châu Âu, phụ tùng chính hãng sẵn có, xe cứu hộ 24/7 và dịch vụ giao nhận xe bảo dưỡng tận tư gia.",
    descriptionJa: "最新テスター完備の自社認証ファクトリー、24時間駆け付けサポート、定期点検時のご自宅・職場への引き取り納車サービス。"
  }
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "news-1",
    title: "Khai trương sảnh trưng bày Private Lounge tiêu chuẩn 5 sao tại Tokyo Roppongi",
    titleJa: "東京・六本木に最高峰5つ星基準のプライベートラウンジをグランドオープン",
    category: "SỰ KIỆN SHOWROOM",
    categoryJa: "ショールーム催事",
    date: "02 Tháng 09, 2026",
    dateJa: "2026年9月2日",
    image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop",
    readTime: "4 phút đọc",
    readTimeJa: "4分",
    summary: "Trải nghiệm không gian tiếp đón thượng lưu mang phong cách kiến trúc châu Âu hiện đại kết hợp thưởng thức cà phê thượng hạng và phòng tư vấn tài chính riêng tư.",
    summaryJa: "都心の喧騒から離れた上質な隠れ家空間。選び抜かれた銘酒とシガー、プライベート商談ブースで特別な時間をご提供いたします。"
  },
  {
    id: "news-2",
    title: "Chiêm ngưỡng bộ sưu tập AURUM Grand Tourer 2026 vừa cập cảng Yokohama",
    titleJa: "2026年最新モデル AURUM グランドツアラーが横浜港に初入港",
    category: "RA MẮT XE MỚI",
    categoryJa: "新車入庫",
    date: "28 Tháng 08, 2026",
    dateJa: "2026年8月28日",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=800&auto=format&fit=crop",
    readTime: "6 phút đọc",
    readTimeJa: "6分",
    summary: "Siêu phẩm coupe hạng sang với khối động cơ V8 Biturbo sản sinh công suất 650 mã lực cùng nội thất bọc da Nappa thủ công tinh xảo.",
    summaryJa: "最高出力650馬力を誇るV8ビターボを搭載し、熟練職人の手縫いナッパレザーに彩られたフラッグシップクーペが日本上陸。"
  },
  {
    id: "news-3",
    title: "Nghệ thuật bảo dưỡng lớp sơn gốm Ceramic và kiểm định Shaken xe sang tại Nhật",
    titleJa: "極上の輝きを保つナノセラミック施工と高級車専用の車検・点検の真髄",
    category: "CHĂM SÓC XE SANG",
    categoryJa: "メンテナンス",
    date: "22 Tháng 08, 2026",
    dateJa: "2026年8月22日",
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=800&auto=format&fit=crop",
    readTime: "5 phút đọc",
    readTimeJa: "5分",
    summary: "Chia sẻ từ các chuyên gia kỹ thuật hàng đầu về cách gìn giữ vẻ đẹp nguyên bản và giá trị xe hơi theo năm tháng tại điều kiện khí hậu Nhật Bản.",
    summaryJa: "四季の変化が激しい日本において、塗装面の酸化や飛び石ダメージを防ぎ資産価値を維持するためのプロによるメンテナンス解説。"
  }
];

export const SHOWROOM_INFO = {
  name: "royalJPcar JAPAN",
  tagline: "The Pinnacle of Luxury Mobility in Japan",
  taglineJa: "日本における最高峰ラグジュアリーモビリティ・サロン",
  taglineVi: "Đỉnh Cao Xe Sang & Dịch Vụ Thượng Lưu Tại Nhật Bản",
  address: "7-12-8 Roppongi, Minato-ku, Tokyo 106-0032",
  addressJa: "東京都港区六本木 7-12-8 royalJPcar Building 1F-3F",
  addressVi: "Tòa nhà royalJPcar 1F-3F, 7-12-8 Roppongi, Minato-ku, Tokyo 106-0032",
  hotline: "0120-88-8899",
  hotlineJa: "0120-88-8899（通話料無料）",
  hotlineVi: "0120-88-8899 (Miễn cước)",
  email: "concierge@royaljpcar.com",
  hours: "10:00 - 19:00",
  hoursJa: "10:00 - 19:00（毎週火曜定休・祝日営業）",
  hoursVi: "10:00 - 19:00 (Nghỉ thứ Ba hàng tuần)",
  branches: [
    { 
      city: "Tokyo", 
      cityJa: "東京",
      location: "Roppongi Flagship Showroom & Private Lounge",
      locationJa: "六本木 フラッグシップショールーム & プライベートラウンジ",
      locationVi: "Showroom Flagship Roppongi & Private Lounge Thượng Lưu"
    },
    { 
      city: "Yokohama", 
      cityJa: "横浜",
      location: "Minatomirai Service & Delivery Hub",
      locationJa: "みなとみらい サービス & 納車デリバリーセンター",
      locationVi: "Trung tâm Dịch vụ Kỹ thuật & Bàn giao xe Minatomirai"
    },
    { 
      city: "Osaka", 
      cityJa: "大阪",
      location: "Umeda Kansai Showroom",
      locationJa: "梅田 関西プレミアムショールーム",
      locationVi: "Sảnh Trưng Bày Umeda Kansai"
    }
  ]
};
