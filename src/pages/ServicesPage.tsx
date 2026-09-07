import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { 
  ChevronRight, 
  Sparkles, 
  Wrench, 
  ShieldCheck, 
  Clock, 
  Award, 
  Check, 
  PhoneCall, 
  FileText,
  Percent
} from 'lucide-react';
import { PromotionSection } from '../components/PromotionSection';

interface ServicesPageProps {
  onNavigate: (pageId: string) => void;
  onShowToast: (msg: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceInterest: isJa ? '定期点検・法定車検' : 'Bảo dưỡng định kỳ',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast(
      isJa
        ? 'ご予約ありがとうございます。専任コンシェルジュより折り返しご連絡いたします。'
        : 'Cảm ơn quý khách! Chuyên viên chăm sóc khách hàng VIP sẽ liên hệ trong ít phút.'
    );
    setFormData({
      name: '',
      phone: '',
      serviceInterest: isJa ? '定期点検・法定車検' : 'Bảo dưỡng định kỳ',
      notes: ''
    });
  };

  const servicePillars = isJa
    ? [
        {
          icon: Wrench,
          title: 'ドイツ基準認定テクニカルファクトリー',
          desc: '最新の油圧リフト、各欧州メーカー専用テスター、赤外線クリーンブースを完備。熟練マイスターがミクロン単位で愛車を調律。',
          badge: 'European Standard',
        },
        {
          icon: ShieldCheck,
          title: '100% 純正OEMパーツ供給',
          desc: 'ヨーロッパ本国からの正規直輸入ルートを確保。全パーツに通関証明およびシリアル番号が付帯し、最高の安全性を保証。',
          badge: 'OEM Certified',
        },
        {
          icon: Clock,
          title: '全国24時間積載車サポート & 自宅引取納車',
          desc: 'フルフラット仕様の専用積載車が日本全国24時間365日待機。ご自宅やオフィスまでお預かりに伺い、整備後に納車いたします。',
          badge: '24/7 Door-to-Door',
        },
        {
          icon: Award,
          title: '特注ビスポーク・カスタム & プロテクション',
          desc: '鍛造ホイール、自己修復型ハイグレードPPF（ペイントプロテクションフィルム）、多層ナノセラミックコーティング、特注レザー張替。',
          badge: 'Custom Studio',
        },
      ]
    : [
        {
          icon: Wrench,
          title: 'Trung Tâm Dịch Vụ Chuẩn Châu Âu',
          desc: 'Hệ thống cầu nâng thủy lực chuyên dụng, máy quét lỗi điện tử bản quyền từ các hãng siêu xe Đức & Anh quốc, buồng sơn sấy hồng ngoại vô trùng.',
          badge: 'European Standard',
        },
        {
          icon: ShieldCheck,
          title: 'Phụ Tùng Chính Hãng 100%',
          desc: 'Kho phụ tùng dự trữ sẵn sàng, nhập khẩu trực tiếp có tem kiểm định hải quan và mã QR bảo chứng nguồn gốc rõ ràng cho từng chi tiết.',
          badge: 'OEM Certified',
        },
        {
          icon: Clock,
          title: 'Cứu Hộ VIP & Giao Nhận Xe Tận Tư Gia',
          desc: 'Đội xe sàn trượt chuyên dụng phục vụ 24/7 toàn quốc. Nhận xe tại gia đình hoặc văn phòng và bàn giao lại sau khi hoàn tất quy trình chăm sóc.',
          badge: '24/7 Door-to-Door',
        },
        {
          icon: Award,
          title: 'Cá Nhân Hóa Bespoke & Nâng Cấp Xe',
          desc: 'Độ mâm rèn forged, dán phim bảo vệ sơn cao cấp PPF tự phục hồi vết xước, phủ ceramic đa lớp và may da nội thất theo yêu cầu độc bản.',
          badge: 'Custom Studio',
        },
      ];

  const vipTiers = isJa
    ? [
        {
          tier: 'Royal Silver',
          price: '全販売車両に標準付帯',
          features: [
            '3年間 正規ディスカウント保証',
            '法定24ヶ月点検・定期診断無料',
            'ご来店時 プレミアム洗車・室内除菌',
            '24時間ロードサービス（50km圏内）',
            '純正アクセサリー 10% OFF',
          ],
          highlight: false,
        },
        {
          tier: 'Royal Gold',
          price: 'リピーター・推薦オーナー様向け',
          features: [
            '最長5年間 特別VIP保証パッケージ',
            '初回3年間 オイル交換・消耗品工賃無料',
            'ご自宅・職場への無料引き取り納車',
            '日本全国24時間365日 レッカー搬送無料',
            'PPF施工 & コーティング 15% OFF',
            '六本木VIP専用ラウンジ＆バーのご利用',
          ],
          highlight: true,
        },
        {
          tier: 'Royal Diamond',
          price: '特注ビスポーク・オーナー様特別枠',
          features: [
            'パワートレイン永久保証プログラム',
            '5年間 定期メンテナンス費用 100% カバー',
            '点検期間中の同等クラス代車（スーパーカー/高級セダン）',
            '24時間 専任チーフエンジニア直通ホットライン',
            '国際サーキット走行会＆VIPプレビュー招待枠',
            'シャンパン＆プライベートシガーバー無制限',
          ],
          highlight: false,
        },
      ]
    : [
        {
          tier: 'Royal Silver',
          price: 'Tặng kèm mọi dòng xe',
          features: [
            'Bảo hành chính hãng 3 năm',
            'Miễn phí kiểm tra 24 hạng mục an toàn',
            'Rửa xe & hút bụi chuyên sâu mỗi lần ghé',
            'Cứu hộ 24/7 nội thành 50km',
            'Giảm 10% phụ kiện chính hãng',
          ],
          highlight: false,
        },
        {
          tier: 'Royal Gold',
          price: 'Dành cho khách hàng thân thiết',
          features: [
            'Bảo hành mở rộng 5 năm VIP',
            'Miễn phí công bảo dưỡng 3 năm đầu',
            'Giao nhận xe bảo dưỡng tận tư gia',
            'Cứu hộ 24/7 toàn quốc miễn phí',
            'Giảm 15% phụ kiện & phủ PPF bảo vệ',
            'Phòng tiếp đón VIP Lounge riêng biệt',
          ],
          highlight: true,
        },
        {
          tier: 'Royal Diamond',
          price: 'Đặc quyền chủ nhân Bespoke',
          features: [
            'Bảo hành trọn đời hệ thống truyền động',
            'Miễn phí 100% chi phí bảo dưỡng 5 năm',
            'Xe thay thế tương đương trong thời gian bảo dưỡng',
            'Chuyên gia kỹ thuật riêng túc trực 24/7',
            'Vé mời sự kiện lái thử đường đua quốc tế',
            'Đặc quyền tiệc Champagne & Cigar tại Showroom',
          ],
          highlight: false,
        },
      ];

  return (
    <div className="w-full pt-20 bg-white">
      {/* Header Breadcrumbs */}
      <div className="bg-[#F7F5F0] border-b border-[#E2E5E8] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <nav className="flex items-center gap-2 text-xs text-[#69727C] mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#C8A96B] transition-colors cursor-pointer"
            >
              {t('nav.home')}
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#17212B] font-semibold">
              {isJa ? 'サービス & VIP特典' : 'Dịch vụ & Ưu đãi'}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] text-[#C8A96B] uppercase font-bold tracking-[0.25em] block mb-2">
                {isJa ? '至高のアフターケア体制' : 'HẬU MÃI & QUYỀN LỢI THƯỢNG LƯU'}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#17212B]">
                {isJa ? (
                  <>
                    極上のアフターサービス <span className="text-[#C8A96B]">5ツ星基準</span>
                  </>
                ) : (
                  <>
                    Đặc Quyền Dịch Vụ <span className="text-[#C8A96B]">5 Sao</span>
                  </>
                )}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#69727C] max-w-md leading-relaxed">
              {isJa
                ? '欧州直輸入テスターを完備した自社認定整備工場と、最長5年の充実保証。日本全国24時間365日駆け付けサポートでお客様のカーライフをお守りします。'
                : 'Cam kết đồng hành trọn đời cùng chủ nhân xe với tiêu chuẩn kỹ thuật châu Âu và chính sách bảo hành, cứu hộ đẳng cấp bậc nhất.'}
            </p>
          </div>
        </div>
      </div>

      {/* Promotion Banner */}
      <PromotionSection onNavigateToCars={() => onNavigate('cars')} />

      {/* 4 Pillars Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] text-[#C8A96B] uppercase font-bold tracking-[0.25em]">
              {isJa ? 'SERVICE STANDARDS' : 'TIÊU CHUẨN XƯỞNG DỊCH VỤ'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#17212B] mt-2">
              {isJa ? '欧州基準の確かな整備技術' : 'Hệ Thống Dịch Vụ Chuẩn Châu Âu'}
            </h2>
            <p className="text-xs sm:text-sm text-[#69727C] mt-2">
              {isJa
                ? 'スーパーカーから最上級セダンまで、各ブランド認定テスターと経験豊富なメカニックが常駐。'
                : 'Được đầu tư bài bản với máy móc chẩn đoán chính hãng từ Porsche, Mercedes-Benz, Land Rover.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicePillars.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[#F7F5F0] border border-[#E2E5E8] hover:border-[#C8A96B] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#17212B] text-[#C8A96B] flex items-center justify-center">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#C8A96B] bg-white px-2 py-0.5 rounded border border-[#E2E5E8]">
                        {p.badge}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#17212B] mb-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-[#69727C] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VIP Membership Tiers */}
      <section className="py-20 bg-[#F7F5F0] border-t border-[#E2E5E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] text-[#C8A96B] uppercase font-bold tracking-[0.25em]">
              {isJa ? 'MEMBERSHIP TIERS' : 'GÓI ĐẶC QUYỀN HỘI VIÊN'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#17212B] mt-2">
              {isJa ? 'royalJPcar VIPメンバーシップ・プログラム' : 'Hạng Thẻ Thành Viên royalJPcar VIP'}
            </h2>
            <p className="text-xs sm:text-sm text-[#69727C] mt-2">
              {isJa
                ? '車両オーナー様限定の優待ステータス。ご納車時より最高峰のおもてなしをご体感いただけます。'
                : 'Mỗi chủ nhân sở hữu xe tại royalJPcar Showroom đều được cấp mã định danh VIP và hạng thành viên tương ứng.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vipTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 transition-all duration-300 flex flex-col justify-between ${
                  tier.highlight
                    ? 'bg-[#17212B] text-white shadow-xl ring-2 ring-[#C8A96B] relative scale-105 md:-translate-y-2'
                    : 'bg-white border border-[#E2E5E8] text-[#17212B]'
                }`}
              >
                <div>
                  {tier.highlight && (
                    <span className="inline-block mb-3 px-3 py-1 bg-[#C8A96B] text-[#17212B] text-[10px] font-bold uppercase tracking-wider rounded-sm">
                      {isJa ? '最も選ばれているプラン' : 'Phổ biến nhất'}
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-2xl mb-1">
                    {tier.tier}
                  </h3>
                  <div className={`text-xs font-semibold mb-6 ${tier.highlight ? 'text-[#C8A96B]' : 'text-[#69727C]'}`}>
                    {tier.price}
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-white/10 text-xs">
                    {tier.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#C8A96B] shrink-0 mt-0.5" />
                        <span className={tier.highlight ? 'text-[#B8C0C7]' : 'text-[#69727C]'}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigate('account')}
                  className={`mt-8 w-full py-3 rounded-sm font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                    tier.highlight
                      ? 'bg-[#C8A96B] text-[#17212B] hover:bg-[#DDBF7A]'
                      : 'bg-[#17212B] text-white hover:bg-[#C8A96B]'
                  }`}
                >
                  {isJa ? 'VIPプログラムを相談する' : 'Đăng Ký Tư Vấn Gói VIP'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Consultation Form */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-[#17212B] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-white/10">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[10px] text-[#C8A96B] uppercase font-bold tracking-widest">
                {isJa ? 'SERVICE APPOINTMENT' : 'ĐẶT LỊCH DỊCH VỤ NHANH'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
                {isJa ? '点検・メンテナンスのお申し込み' : 'Đăng Ký Chăm Sóc & Bảo Dưỡng Xe'}
              </h3>
              <p className="text-xs text-[#B8C0C7] mt-2">
                {isJa
                  ? '日時とお名前をお知らせいただければ、専用積載車またはショールームピットにてお迎えいたします。'
                  : 'Để lại thông tin, xe kỹ thuật chuyên dụng sẽ sẵn sàng phục vụ tại nhà hoặc sảnh showroom.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#B8C0C7] mb-1">
                    {isJa ? 'お名前 *' : 'Họ và tên quý khách *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isJa ? '例: 山田 太郎 / Nguyen Van A' : 'Ví dụ: Nguyễn Văn An'}
                    className="w-full px-4 py-3 rounded-sm bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#C8A96B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#B8C0C7] mb-1">
                    {isJa ? 'お電話番号 *' : 'Số điện thoại liên hệ *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder={isJa ? '090-1234-5678' : '0912 345 678'}
                    className="w-full px-4 py-3 rounded-sm bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#C8A96B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B8C0C7] mb-1">
                  {isJa ? 'ご希望のサービス項目' : 'Hạng mục dịch vụ quan tâm'}
                </label>
                <select
                  value={formData.serviceInterest}
                  onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                  className="w-full px-4 py-3 rounded-sm bg-[#243746] border border-white/20 text-white text-xs focus:outline-none focus:border-[#C8A96B]"
                >
                  {isJa ? (
                    <>
                      <option value="定期点検・法定車検">定期点検・法定24ヶ月車検</option>
                      <option value="PPFフィルム＆セラミック施工">PPFペイント保護フィルム＆ナノセラミック施工</option>
                      <option value="純正パーツ＆鍛造ホイール">純正パーツ換装＆鍛造ホイールカスタム</option>
                      <option value="認定120項目車両査定">認定120項目車両査定・下取りのご相談</option>
                      <option value="緊急出張サポート・引取">出張メンテナンス・積載車での引き取り</option>
                    </>
                  ) : (
                    <>
                      <option value="Bảo dưỡng định kỳ">Bảo dưỡng định kỳ theo cấp độ (10.000km, 20.000km...)</option>
                      <option value="Dán phim PPF & Ceramic">Dán phim bảo vệ sơn PPF cao cấp & Phủ Ceramic</option>
                      <option value="Nâng cấp phụ kiện & Mâm xe">Nâng cấp phụ kiện chính hãng & Mâm xe Forged</option>
                      <option value="Kiểm tra thẩm định xe cũ">Kiểm tra 176 hạng mục xe sang đã qua sử dụng</option>
                      <option value="Dịch vụ cứu hộ tận nơi">Yêu cầu cứu hộ hoặc giao nhận xe tận nhà</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B8C0C7] mb-1">
                  {isJa ? '備考・車両情報（車種・年式・ナンバーなど）' : 'Ghi chú thêm (Tên dòng xe, biển số, yêu cầu đặc biệt)'}
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={isJa ? '現在お乗りの車種やご要望などをご記入ください...' : 'Quý khách có thể ghi rõ dòng xe hiện tại đang sử dụng...'}
                  className="w-full px-4 py-3 rounded-sm bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs focus:outline-none focus:border-[#C8A96B]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] font-bold text-xs uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
                >
                  {isJa ? '予約申し込みを送信する' : 'Gửi Yêu Cầu Đặt Lịch Hẹn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
