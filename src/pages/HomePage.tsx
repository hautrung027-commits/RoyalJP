import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  PhoneCall, 
  MapPin, 
  Clock, 
  Star,
  Zap,
  Gauge,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { Hero } from '../components/Hero';
import { HomeCarGallery } from '../components/HomeCarGallery';
import { useCars } from '../hooks/useCars';
import { Car, CarCategory } from '../types';
import { GalleryImage } from '../data/gallery';

interface HomePageProps {
  onNavigate: (pageId: string) => void;
  onSelectCar: (car: Car) => void;
  onSelectGalleryImage: (image: GalleryImage) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectCar,
  onSelectGalleryImage,
}) => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';

  // Real-time cars inventory from Admin / Storage
  const carsDataResult = useCars();

const carsData = Array.isArray(carsDataResult)
  ? carsDataResult
  : [];
  const [activeCategory, setActiveCategory] = useState<CarCategory>('all');
  const [showAllInHome, setShowAllInHome] = useState(false);

  // Car categories for Showroom inventory tabs
  const HOME_CATEGORIES: { id: CarCategory; labelVi: string; labelJa: string }[] = [
    { id: 'all', labelVi: 'Tất Cả Dòng Xe', labelJa: '全モデル' },
    { id: 'sedan', labelVi: 'Sedan Hạng Sang', labelJa: 'セダン' },
    { id: 'suv', labelVi: 'SUV Siêu Sang', labelJa: 'SUV' },
    { id: 'hatchback', labelVi: 'Coupe & Siêu Xe', labelJa: 'クーペ＆スポーツ' },
    { id: 'mpv', labelVi: 'MPV Chuyên Cơ', labelJa: '最高級ミニバン' },
    { id: 'pickup', labelVi: 'Bán Tải Đẳng Cấp', labelJa: 'ピックアップ' },
  ];

  // Category counts computed in real-time
  const categoryCounts = useMemo(() => {
    const counts: Record<CarCategory, number> = {
      all: carsData.length,
      sedan: 0,
      suv: 0,
      hatchback: 0,
      mpv: 0,
      pickup: 0,
    };
    carsData.forEach((car) => {
      if (counts[car.category] !== undefined) {
        counts[car.category]++;
      }
    });
    return counts;
  }, [carsData]);

  // Filter cars based on active category
  const filteredCategoryCars = useMemo(() => {
    if (activeCategory === 'all') {
      return carsData;
    }
    return carsData.filter((car) => car.category === activeCategory);
  }, [carsData, activeCategory]);

  // Cars displayed in the grid
  const displayedCars = useMemo(() => {
    if (showAllInHome) {
      return filteredCategoryCars;
    }
    return filteredCategoryCars.slice(0, 8);
  }, [filteredCategoryCars, showAllInHome]);

  // VIP Handover feedback stories
  const clientStories = isJa
    ? [
        {
          name: '佐藤 健一 様 (IT企業経営者)',
          car: 'Mercedes-Maybach S680 First Class',
          comment:
            '六本木のプライベートラウンジでの接客が非常に心地よかったです。納車式でのシャンパンサービスや専任マイスターの丁寧な説明に感動しました。',
          date: '2026年8月 ご納車',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        },
        {
          name: 'グエン・ホアン・クアン 様 (在日コンサルティング代表)',
          car: 'Porsche Panamera Turbo E-Hybrid',
          comment:
            '日本語とベトナム語の両方で契約内容や税金、ローンの説明を受けられたので非常に安心できました。納車までのスピードも迅速でした。',
          date: '2026年8月 ご納車',
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        },
        {
          name: '高橋 美咲 様 (医療法人理事)',
          car: 'Range Rover SV Autobiography LWB',
          comment:
            '特注パールホワイトの輝きがカタログ以上に美しく、自宅までの特別陸送も完璧でした。アフターサポートも期待以上です。',
          date: '2026年7月 ご納車',
          avatar:
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
        },
      ]
    : [
        {
          name: 'Doanh nhân Trần V. Nam',
          car: 'Mercedes-Maybach S680 First Class',
          comment:
            'Dịch vụ tiếp đón tại sảnh Private Lounge rất đẳng cấp. Buổi lễ bàn giao xe với hoa tươi, champagne và chuyên viên hướng dẫn từng tính năng rất chu đáo.',
          date: 'Bàn giao Tháng 08/2026',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
        },
        {
          name: 'Kiến trúc sư Lê Hoàng Quân',
          car: 'Porsche Panamera Turbo E-Hybrid',
          comment:
            'Xe giao đúng lịch hẹn, hồ sơ hải quan và đăng ký biển số hoàn tất chỉ trong 24 giờ. Rất hài lòng với sự minh bạch và tận tâm của royalJPcar.',
          date: 'Bàn giao Tháng 08/2026',
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
        },
        {
          name: 'Bà Đặng Phương Thảo',
          car: 'Range Rover SV Autobiography LWB',
          comment:
            'Màu sơn ngoại thất Bespoke ngọc trai bên ngoài đẹp hơn cả trong ảnh catalog. Đội ngũ kỹ thuật viên hỗ trợ bàn giao tận tư gia vô cùng chuyên nghiệp.',
          date: 'Bàn giao Tháng 07/2026',
          avatar:
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
        },
      ];

  return (
    <div className="w-full">
      {/* 1. Flagship Hero Banner */}
      <Hero
        onExploreClick={() => onNavigate('cars')}
        onAccountClick={() => onNavigate('account')}
      />

      {/* 2. Visual Model Strip - Quick Car Photos Carousel / Quick Select */}
      <section className="py-12 bg-[#17212B] text-white border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header + Dòng xe category bar */}
          <div className="flex flex-col mb-8 pb-5 border-b border-white/10 gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#C8A96B] uppercase font-bold tracking-[0.25em]">
                  {isJa ? 'ショールーム展示車両' : 'SHOWROOM INVENTORY'}
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                  {isJa ? '即納可能なショールーム展示特選モデル' : 'Các Mẫu Xe Đang Trưng Bày Sẵn Sàng Giao Ngay'}
                </h2>
              </div>

              <button
                onClick={() => onNavigate('cars')}
                className="mt-2 md:mt-0 text-xs font-bold text-[#C8A96B] hover:text-[#DDBF7A] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <span>{isJa ? `全${carsData.length}台のストックを見る` : `Xem tất cả ${carsData.length} xe trong kho`}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Dòng xe Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar">
              {HOME_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const isActive = activeCategory === cat.id;
                const label = isJa ? cat.labelJa : cat.labelVi;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setShowAllInHome(false);
                    }}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#C8A96B] text-[#17212B] shadow-sm font-bold'
                        : 'bg-white/5 text-[#B8C0C7] hover:bg-white/10 hover:text-white border border-white/10'
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-[#17212B]/20 text-[#17212B]' : 'bg-white/10 text-white/70'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Cards Grid or Empty Notice */}
          {filteredCategoryCars.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white/5 border border-white/10 rounded-xl">
              <Sparkles className="w-8 h-8 text-[#C8A96B] mx-auto mb-3" />
              <p className="text-sm font-serif font-bold text-white mb-1">
                {isJa ? '現在、このカテゴリーの即納車両はございません' : 'Hiện chưa có xe trưng bày sẵn cho dòng này'}
              </p>
              <p className="text-xs text-[#B8C0C7] max-w-md mx-auto mb-4">
                {isJa
                  ? '本国オーダーまたは特別調達（ビスポーク）での輸入・納車を承っております。'
                  : 'Quý khách có thể yêu cầu đặt hàng Bespoke trực tiếp từ nhà máy hoặc kho đối tác tại Nhật Bản.'}
              </p>
              <button
                onClick={() => onNavigate('account')}
                className="px-4 py-2 bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
              >
                {isJa ? 'オーダー・お問い合わせ' : 'Liên hệ đặt xe theo yêu cầu'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {displayedCars.map((car) => {
                const displayTag = isJa && car.tagJa ? car.tagJa : car.tag;
                const displayCategory = isJa && car.categoryLabelJa ? car.categoryLabelJa : car.categoryLabel;
                const displayPrice = isJa && car.priceJa ? car.priceJa : car.price;

                return (
                  <div
                    key={car.id}
                    onClick={() => onSelectCar(car)}
                    className="group bg-white/5 border border-white/10 hover:border-[#C8A96B] rounded-xl p-3 sm:p-4 transition-all duration-300 cursor-pointer hover:bg-white/10 flex flex-col justify-between"
                  >
                    <div className="aspect-[16/10] rounded-lg overflow-hidden bg-black/30 mb-3 relative">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Status Badges */}
                      {car.status === 'reserved' ? (
                        <span className="absolute top-2 left-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          {isJa ? 'ご予約済み' : 'ĐÃ ĐẶT CỌC'}
                        </span>
                      ) : car.status === 'sold' ? (
                        <span className="absolute top-2 left-2 bg-gray-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
                          {isJa ? '売約済み' : 'ĐÃ BÀN GIAO'}
                        </span>
                      ) : displayTag ? (
                        <span className="absolute top-2 left-2 bg-[#C8A96B] text-[#17212B] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
                          {displayTag}
                        </span>
                      ) : (
                        <span className="absolute top-2 left-2 bg-[#C8A96B] text-[#17212B] text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-sm">
                          {isJa ? '即納可能' : 'SẴN SÀNG GIAO'}
                        </span>
                      )}

                      <span className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white/90 text-[9px] font-medium px-1.5 py-0.5 rounded-sm">
                        {displayCategory}
                      </span>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase text-[#B8C0C7] font-medium tracking-wider">
                        {car.brand ? `${car.brand} • ` : ''}{displayCategory} • {car.year}
                      </div>
                      <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#C8A96B] transition-colors line-clamp-1 mt-0.5">
                        {car.name}
                      </h3>
                      <div className="text-xs sm:text-sm font-serif font-bold text-[#C8A96B] mt-1">
                        {displayPrice}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#B8C0C7]">
                      <span>{car.horsepower}</span>
                      <span className="text-[#C8A96B] font-semibold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                        {isJa ? '詳細スペック' : 'Chi tiết'} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Show more toggle if more than 8 cars in category */}
          {filteredCategoryCars.length > 8 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllInHome((prev) => !prev)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg border border-white/10 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>
                  {showAllInHome
                    ? (isJa ? '折りたたむ' : 'Thu gọn bớt')
                    : (isJa ? `さらに表示 (${filteredCategoryCars.length - 8}台)` : `Xem thêm (${filteredCategoryCars.length - 8} xe khác)`)}
                </span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAllInHome ? '-rotate-90' : 'rotate-90'}`} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Extensive Photo Gallery */}
      <HomeCarGallery
        onSelectImage={onSelectGalleryImage}
        onNavigateToCollection={() => onNavigate('cars')}
        onNavigateToAccount={() => onNavigate('account')}
      />

      {/* 4. Showroom 5-Star Space Experience */}
      <section className="py-20 bg-[#F7F5F0] border-t border-[#E2E5E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block px-3 py-1 bg-[#D9DDE1] text-[10px] tracking-[0.2em] font-bold text-[#17212B] uppercase rounded-sm">
                {isJa ? '5ツ星基準の至高空間' : 'KHÔNG GIAN TIÊU CHUẨN 5 SAO'}
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#17212B] leading-tight">
                {isJa ? (
                  <>
                    洗練されたラグジュアリー体験 <br />
                    <span className="text-[#C8A96B]">Private VIP Lounge</span>
                  </>
                ) : (
                  <>
                    Trải Nghiệm Đẳng Cấp <br />
                    <span className="text-[#C8A96B]">Private VIP Lounge</span>
                  </>
                )}
              </h2>
              <p className="text-[#69727C] text-sm sm:text-base leading-relaxed">
                {isJa
                  ? '東京・六本木の中心に位置し、一流の建築家がデザインを手掛けたプライベートショールーム。最高峰のワイン＆シガーラウンジ、専用商談ルーム、最新のテスターを備えた認定サービスピットを併設しています。'
                  : 'Được thiết kế bởi các kiến trúc sư danh tiếng từ châu Âu, showroom mang lại không gian thưởng lãm xe biệt lập với phòng tiếp khách VIP, quầy bar Cigar & Wine cao cấp và xưởng dịch vụ chẩn đoán kỹ thuật hiện đại.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-[#E2E5E8] shadow-xs">
                  <div className="w-9 h-9 rounded-lg bg-[#17212B] text-[#C8A96B] flex items-center justify-center font-bold text-sm mb-3">
                    01
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#17212B]">
                    {isJa ? '完全個室プライベート商談室' : 'Phòng Tiếp Đón Riêng Tư'}
                  </h4>
                  <p className="text-xs text-[#69727C] mt-1">
                    {isJa
                      ? 'お客様のプライバシーを厳格に保護し、専任コンシェルジュとビスポークオーダーをじっくりご検討いただけます。'
                      : 'Bảo mật tuyệt đối thông tin và thảo luận cấu hình xe Bespoke với giám đốc thương hiệu.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E2E5E8] shadow-xs">
                  <div className="w-9 h-9 rounded-lg bg-[#17212B] text-[#C8A96B] flex items-center justify-center font-bold text-sm mb-3">
                    02
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#17212B]">
                    {isJa ? 'レッドカーペット納車セレモニー' : 'Sảnh Bàn Giao Xe Thảm Đỏ'}
                  </h4>
                  <p className="text-xs text-[#69727C] mt-1">
                    {isJa
                      ? 'シャンパンセレブレーションと特製キートレイ、記念クリスタルプレートを添えた心に残る納車式。'
                      : 'Nghi thức trao chìa khóa mạ vàng, tiệc nhẹ champagne cùng kỷ niệm chương khắc tên chủ nhân.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('account')}
                  className="px-6 py-3.5 bg-[#17212B] text-white hover:bg-[#C8A96B] transition-colors rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                >
                  {isJa ? 'ショールーム来店予約' : 'Ghé Thăm Showroom Ngay'}
                </button>
                <button
                  onClick={() => onNavigate('account')}
                  className="px-6 py-3.5 bg-white border border-[#17212B] text-[#17212B] hover:bg-[#17212B] hover:text-white transition-colors rounded-sm text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  {isJa ? 'VIP会員ラウンジ' : 'Cổng Thành Viên VIP'}
                </button>
              </div>
            </div>

            {/* Right Images Grid */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/5] bg-black/10">
                  <img
                    src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop"
                    alt={isJa ? 'VIPショールームフロア' : 'Sảnh Showroom VIP'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 rounded-xl bg-white border border-[#E2E5E8]">
                  <div className="text-2xl font-serif font-bold text-[#17212B]">3.500 m²</div>
                  <div className="text-xs text-[#69727C]">
                    {isJa ? '展示エリア総面積' : 'Diện tích trưng bày 3 miền'}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="p-4 rounded-xl bg-[#17212B] text-white">
                  <div className="text-2xl font-serif font-bold text-[#C8A96B]">100%</div>
                  <div className="text-xs text-[#B8C0C7]">
                    {isJa ? '正規通関・実走行証明済み' : 'Nhập khẩu nguyên chiếc chính ngạch'}
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-md aspect-[4/5] bg-black/10">
                  <img
                    src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop"
                    alt={isJa ? 'VIPラウンジ' : 'Khoang tiếp khách VIP'}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Client Testimonials & Handover Stories */}
      <section className="py-20 bg-white border-t border-[#E2E5E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] text-[#C8A96B] uppercase font-bold tracking-[0.25em]">
              {isJa ? 'オーナー様の声' : 'SỰ HÀI LÒNG CỦA KHÁCH HÀNG VIP'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#17212B] mt-2">
              {isJa ? '選ばれしオーナー様からのメッセージ' : 'Chia Sẻ Từ Các Chủ Nhân Danh Giá'}
            </h2>
            <p className="text-xs sm:text-sm text-[#69727C] mt-2">
              {isJa
                ? '日本国内および在日ベトナム人コミュニティをはじめ、1,200名以上のエグゼクティブに選ばれています。'
                : 'Hơn 1.200 khách hàng thượng lưu đã lựa chọn royalJPcar để đồng hành cùng niềm đam mê xe hơi.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {clientStories.map((story, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#F7F5F0] border border-[#E2E5E8] flex flex-col justify-between hover:border-[#C8A96B] transition-all duration-300 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#C8A96B] mb-4">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#17212B] leading-relaxed italic mb-6">
                    "{story.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#E2E5E8]">
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#C8A96B]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#17212B]">{story.name}</h4>
                    <span className="text-[10px] text-[#C8A96B] block font-medium">
                      {story.car}
                    </span>
                    <span className="text-[9px] text-[#69727C]">{story.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Bottom Full-Width Showcase Banner */}
      <section className="relative py-16 bg-[#17212B] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-[10px] text-[#C8A96B] uppercase font-bold tracking-[0.25em]">
              {isJa ? 'royalJPcar VIPメンバーズクラブ' : 'ĐẶC QUYỀN THÀNH VIÊN royalJPcar VIP'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white mt-1">
              {isJa ? 'エグゼクティブ・コミュニティへのご案内' : 'Gia Nhập Cộng Đồng Khách Hàng Thượng Lưu'}
            </h2>
            <p className="text-xs sm:text-sm text-[#B8C0C7] max-w-xl mt-2">
              {isJa
                ? 'VIPアカウントを作成してデジタル会員証を発行、お気に入り車両の保管や限定イベントへの招待をご利用いただけます。'
                : 'Đăng nhập tài khoản VIP để kích hoạt thẻ số, quản lý danh sách xe đã lưu và đặt lịch hẹn tiếp đón tại Private Lounge.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('account')}
              className="px-8 py-3.5 bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] font-bold text-xs uppercase tracking-widest rounded-sm transition-colors cursor-pointer shadow-md"
            >
              {isJa ? 'VIPポータルを開く' : 'Khám Phá Cổng VIP'}
            </button>
            <button
              onClick={() => {
                window.location.href = 'tel:0908888999';
              }}
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
            >
              {isJa ? 'ホットラインにお電話' : 'Liên Hệ Hotline'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
