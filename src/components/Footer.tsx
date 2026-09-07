import React from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, ArrowUp, ChevronRight, Lock } from 'lucide-react';
import { SHOWROOM_INFO } from '../data/content';
import { RoyalJpLogo } from './RoyalJpLogo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';
  const [subscribed, setSubscribed] = React.useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayTagline = isJa && SHOWROOM_INFO.taglineJa ? SHOWROOM_INFO.taglineJa : SHOWROOM_INFO.tagline;
  const displayAddress = isJa && SHOWROOM_INFO.addressJa ? SHOWROOM_INFO.addressJa : SHOWROOM_INFO.address;
  const displayHotline = isJa && SHOWROOM_INFO.hotlineJa ? SHOWROOM_INFO.hotlineJa : SHOWROOM_INFO.hotline;
  const displayHours = isJa && SHOWROOM_INFO.hoursJa ? SHOWROOM_INFO.hoursJa : SHOWROOM_INFO.hours;

  const carLinks = isJa
    ? [
        { label: 'エグゼクティブ・セダン', category: 'sedan' },
        { label: 'ハイパフォーマンス SUV', category: 'suv' },
        { label: '最上級ミニバン・LM', category: 'mpv' },
        { label: 'スポーツ・ハッチバック', category: 'hatchback' },
        { label: 'ラグジュアリー・ピックアップ', category: 'pickup' },
        { label: '特注ビスポーク・コレクション', category: 'all' },
      ]
    : [
        { label: 'Sedan Thượng Hạng', category: 'sedan' },
        { label: 'SUV Hiệu Năng Cao', category: 'suv' },
        { label: 'MPV Chuyên Cơ Mặt Đất', category: 'mpv' },
        { label: 'Hatchback Thể Thao', category: 'hatchback' },
        { label: 'Siêu Bán Tải Khủng Long', category: 'pickup' },
        { label: 'Bộ Sưu Tập Bespoke 2026', category: 'all' },
      ];

  const serviceLinks = isJa
    ? [
        { label: 'VIP会員ラウンジ & デジタル会員証', page: 'account' },
        { label: 'オートローン & ビスポーク相談', page: 'cars' },
        { label: 'ドイツ基準認定テクニカル整備工場', page: 'services' },
        { label: '5つ星正規保証プログラム', page: 'services' },
        { label: '全国24時間ロードサービス', page: 'services' },
        { label: '六本木ショールーム・プライベートサロン', page: 'services' },
      ]
    : [
        { label: 'Cổng thành viên VIP & Thẻ số', page: 'account' },
        { label: 'Tư vấn tài chính & Trả góp VIP', page: 'cars' },
        { label: 'Xưởng dịch vụ kỹ thuật chuẩn Đức', page: 'services' },
        { label: 'Chính sách bảo hành 5 sao', page: 'services' },
        { label: 'Dịch vụ cứu hộ 24/7 toàn quốc', page: 'services' },
        { label: 'Không gian trải nghiệm 5 sao', page: 'services' },
      ];

  return (
    <footer
      id="footer"
      className="bg-[#17212B] text-white pt-16 sm:pt-20 pb-12 border-t border-white/10 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top brand & newsletter strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10 items-center">
          
          <div className="lg:col-span-6">
            <div className="mb-4">
              <RoyalJpLogo variant="footer" />
            </div>
            <p className="text-sm text-[#B8C0C7] max-w-lg leading-relaxed">
              {isJa
                ? '東京・六本木に拠点を置く「royalJPcar」。日本人のお客様および在日ベトナム人コミュニティの皆様へ、最上級のプレミアムカーと専任バイリンガルコンシェルジュサービスをお届けします。'
                : 'royalJPcar - Showroom xe sang và siêu xe chuẩn 5 sao tại Nhật Bản. Nơi kết nối niềm đam mê đỉnh cao cùng dịch vụ tư vấn song ngữ Nhật - Việt tận tâm.'}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#C8A96B] block mb-2">
                {isJa ? 'VIPプライベート・ニュースレター' : 'ĐẶC QUYỀN BẢN TIN THƯỢNG LƯU'}
              </span>
              <p className="text-xs text-[#B8C0C7] mb-4">
                {isJa
                  ? '新着限定車両のご案内やプライベート内覧会へのご招待をお届けします。'
                  : 'Đăng ký để nhận danh mục các dòng xe Bespoke và lời mời tham dự sự kiện ra mắt riêng tư.'}
              </p>
              {subscribed ? (
                <div className="text-xs text-[#C8A96B] font-semibold py-2">
                  {isJa ? '✓ ご登録ありがとうございます。VIP情報をお届けいたします。' : '✓ Cảm ơn quý khách đã đăng ký nhận bản tin VIP!'}
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubscribed(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="email"
                    required
                    placeholder={isJa ? 'メールアドレスを入力...' : 'Nhập email của bạn...'}
                    className="w-full px-4 py-2.5 rounded-sm bg-white/10 border border-white/20 text-xs text-white placeholder-[#B8C0C7]/70 focus:outline-none focus:border-[#C8A96B]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-sm bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                  >
                    {isJa ? '登録する' : 'Đăng Ký'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* Middle Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16 border-b border-white/10">
          
          {/* Col 1: Showroom Info */}
          <div>
            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider mb-5">
              {isJa ? 'ショールーム拠点' : 'Hệ Thống Showroom'}
            </h4>
            <div className="space-y-4 text-xs text-[#B8C0C7]">
              {SHOWROOM_INFO.branches.map((b, idx) => {
                const cityName = isJa && b.cityJa ? b.cityJa : b.city;
                const locationName = isJa && b.locationJa ? b.locationJa : b.location;
                return (
                  <div key={idx} className="border-l border-[#C8A96B] pl-3">
                    <span className="font-bold text-white block">{cityName}:</span>
                    <span className="text-[#B8C0C7]">{locationName}</span>
                  </div>
                );
              })}
              <div className="pt-2">
                <span className="text-white block font-semibold">
                  {isJa ? 'ご案内可能時間:' : 'Giờ đón khách:'}
                </span>
                <span className="text-[#B8C0C7]">{displayHours}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Dòng xe cao cấp */}
          <div>
            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider mb-5">
              {isJa ? '展示中カテゴリー' : 'Dòng Xe Trưng Bày'}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B8C0C7]">
              {carLinks.map((item, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => onNavigate('cars')}
                    className="hover:text-[#C8A96B] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-[#C8A96B]" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Dịch vụ đặc quyền */}
          <div>
            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider mb-5">
              {isJa ? 'サービス＆VIPメンバーシップ' : 'Dịch Vụ & Đặc Quyền'}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#B8C0C7]">
              {serviceLinks.map((item, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.page)}
                    className="hover:text-[#C8A96B] transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <ChevronRight className="w-3 h-3 text-[#C8A96B]" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Hotline & Liên hệ */}
          <div>
            <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider mb-5">
              {isJa ? 'VIP専用直通ライン' : 'Đường Dây Nóng VIP'}
            </h4>
            <div className="space-y-3 text-xs text-[#B8C0C7]">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[10px] text-[#C8A96B] uppercase tracking-wider block font-bold">
                  {isJa ? '年中無休 フリーダイヤル' : 'Hotline 24/7 (Miễn cước)'}
                </span>
                <a href="tel:0120888899" className="text-lg font-serif font-bold text-white hover:text-[#C8A96B] transition-colors">
                  0120-88-8899
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C8A96B]" />
                <span>{SHOWROOM_INFO.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C8A96B] shrink-0 mt-0.5" />
                <span className="line-clamp-2">{displayAddress}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & Return to top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B8C0C7]">
          <div>
            {isJa
              ? '© 2026 royalJPcar SHOWROOM TOKYO. All rights reserved. 古物商許可証・日本自動車査定協会認定店'
              : '© 2026 royalJPcar SHOWROOM TOKYO. All rights reserved. Tiêu chuẩn thiết kế showroom 5 sao chuẩn quốc tế.'}
          </div>

          <div className="flex items-center gap-6">
            <span className="text-white/60">{isJa ? 'プライバシーポリシー' : 'Chính sách bảo mật'}</span>
            <span className="text-white/60">{isJa ? '利用規約' : 'Điều khoản dịch vụ'}</span>
            <a
              href="#/admin"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '/admin';
              }}
              className="text-white/40 hover:text-[#C8A96B] transition-colors flex items-center gap-1 cursor-pointer"
              title="Cổng quản trị nội bộ ROYAL JPcar"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-white hover:text-[#C8A96B] transition-colors cursor-pointer"
            >
              <span>{isJa ? 'ページトップへ' : 'Đầu trang'}</span>
              <ArrowUp className="w-4 h-4 text-[#C8A96B]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
