import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, Sparkles, Gauge, Zap, ShieldCheck, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import heroCarImg from '../assets/images/hero_luxury_car_1788423241155.jpg';

interface HeroProps {
  onExploreClick: () => void;
  onAccountClick: () => void;
}

interface HeroSlide {
  id: string;
  name: string;
  nameJa?: string;
  tag: string;
  tagJa?: string;
  category: string;
  categoryJa?: string;
  image: string;
  horsepower: string;
  acceleration: string;
  accelerationJa?: string;
  warranty: string;
  warrantyJa?: string;
  price: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "aurum-gt",
    name: "AURUM GT-650 Executive Coupé",
    nameJa: "AURUM GT-650 エグゼクティブ クーペ",
    tag: "Kiệt Tác 2026 • Limited Edition",
    tagJa: "2026 傑作 • 特別限定モデル",
    category: "Super Grand Tourer",
    categoryJa: "スーパーグランドツアラー",
    image: heroCarImg,
    horsepower: "650 HP",
    acceleration: "3.2 giây",
    accelerationJa: "3.2 秒",
    warranty: "5 năm VIP",
    warrantyJa: "5年特別保証",
    price: "¥23,800,000",
  },
  {
    id: "maybach-s680",
    name: "Mercedes-Maybach S680 First Class",
    nameJa: "メルセデス・マイバッハ S680 ファーストクラス",
    tag: "Đỉnh Cao Thượng Lưu • V12 Twin-Turbo",
    tagJa: "至高のラグジュアリー • V12ツインターボ",
    category: "Flagship Luxury Saloon",
    categoryJa: "フラッグシップサルーン",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop",
    horsepower: "621 HP",
    acceleration: "4.4 giây",
    accelerationJa: "4.4 秒",
    warranty: "5 năm VIP",
    warrantyJa: "5年特別保証",
    price: "¥38,500,000",
  },
  {
    id: "panamera-turbo",
    name: "Porsche Panamera Turbo E-Hybrid",
    nameJa: "ポルシェ パナメーラ ターボ E-ハイブリッド",
    tag: "Hiệu Năng Đường Đua • V8 Hybrid",
    tagJa: "サーキットの血統 • V8ハイブリッド",
    category: "Performance Sportback",
    categoryJa: "スポーツサルーン",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop",
    horsepower: "680 HP",
    acceleration: "3.2 giây",
    accelerationJa: "3.2 秒",
    warranty: "4 năm VIP",
    warrantyJa: "4年特別保証",
    price: "¥29,800,000",
  },
  {
    id: "range-rover-sv",
    name: "Range Rover SV Autobiography LWB",
    nameJa: "レンジローバー SV オートバイオグラフィー LWB",
    tag: "Quý Tộc Hoàng Gia Anh Quốc • SV Bespoke",
    tagJa: "英国最高峰の気品 • SVビスポーク",
    category: "Ultra-Luxury SUV",
    categoryJa: "ウルトララグジュアリーSUV",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    horsepower: "606 HP",
    acceleration: "4.5 giây",
    accelerationJa: "4.5 秒",
    warranty: "5 năm VIP",
    warrantyJa: "5年特別保証",
    price: "¥36,500,000",
  },
  {
    id: "lexus-lm500h",
    name: "Lexus LM 500h 4-Seater Executive",
    nameJa: "レクサス LM 500h 4人乗り EXECUTIVE",
    tag: "Chuyên Cơ Mặt Đất • Vách Ngăn Riêng Tư",
    tagJa: "移動するファーストクラス • 完全個室",
    category: "VIP Executive MPV",
    categoryJa: "ショーファーカー",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop",
    horsepower: "366 HP",
    acceleration: "6.9 giây",
    accelerationJa: "6.9 秒",
    warranty: "5 năm VIP",
    warrantyJa: "5年特別保証",
    price: "¥20,000,000",
  }
];

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onAccountClick }) => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCar = HERO_SLIDES[currentSlideIndex];

  // Auto-advance slideshow every 4.5 seconds
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  // Mouse Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Strict 2-3 degree max tilt to avoid distortion
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [2.5, -2.5]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-3, 3]);
  const translateX = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);
  const translateY = useTransform(smoothMouseY, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[92vh] pt-28 pb-16 md:pt-32 md:pb-20 overflow-hidden flex items-center bg-[#F7F5F0]"
      style={{
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F7F5F0 100%)'
      }}
    >
      {/* Decorative architectural grid lines and ambient radial glow from design */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(200, 169, 107, 0.14) 0%, transparent 70%)' }}
        />
        <div className="max-w-7xl mx-auto h-full grid grid-cols-4 md:grid-cols-6 border-x border-[#E2E5E8]/60 opacity-40">
          <div className="border-r border-[#E2E5E8]/40 h-full"></div>
          <div className="border-r border-[#E2E5E8]/40 h-full"></div>
          <div className="border-r border-[#E2E5E8]/40 h-full"></div>
          <div className="border-r border-[#E2E5E8]/40 h-full"></div>
          <div className="hidden md:block border-r border-[#E2E5E8]/40 h-full"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT: Heading, Description, CTA */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block px-3 py-1 bg-[#D9DDE1] text-[10px] tracking-[0.2em] font-bold text-[#17212B] mb-4 uppercase w-fit"
            >
              {isJa ? '2026 傑作コレクション • 日本' : 'Bộ sưu tập biểu tượng 2026 • Nhật Bản'}
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#17212B] leading-[1.15] mb-4 tracking-tight font-serif"
            >
              {isJa ? (
                <>
                  至高を求める <br />
                  <span className="text-[#C8A96B]">極上の美学</span>
                </>
              ) : (
                <>
                  CHINH PHỤC <br />
                  <span className="text-[#C8A96B]">SỰ HOÀN HẢO</span>
                </>
              )}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-[#69727C] text-sm sm:text-base max-w-md leading-relaxed mb-8"
            >
              {isJa
                ? '厳選された欧州ハイパフォーマンスカーと最高峰のホスピタリティ。日本国内でのご購入から車検・整備、在日ベトナム人の皆様の各種手続きまで安心のフルサポート。'
                : 'Trải nghiệm sự kết hợp hoàn mỹ giữa nghệ thuật chế tác thủ công thượng thừa và những cỗ máy tốc độ đỉnh cao thế giới ngay tại Showroom Nhật Bản.'}
            </motion.p>

            {/* Quick Specs Strip - dynamically synchronizes with active car */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="grid grid-cols-3 gap-3 sm:gap-4 py-4 px-4 sm:px-5 mb-8 rounded-lg bg-white/80 border border-[#E2E5E8] backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#69727C] uppercase tracking-wider">
                  <Zap className="w-3 h-3 text-[#C8A96B]" />
                  {isJa ? '最高出力' : 'Công suất'}
                </div>
                <div className="text-lg sm:text-xl font-bold font-serif text-[#17212B] mt-0.5 transition-all duration-300">
                  {currentCar.horsepower}
                </div>
              </div>

              <div className="border-l border-[#E2E5E8] pl-3 sm:pl-4">
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#69727C] uppercase tracking-wider">
                  <Gauge className="w-3 h-3 text-[#C8A96B]" />
                  0 - 100 km/h
                </div>
                <div className="text-lg sm:text-xl font-bold font-serif text-[#17212B] mt-0.5 transition-all duration-300">
                  {isJa && currentCar.accelerationJa ? currentCar.accelerationJa : currentCar.acceleration}
                </div>
              </div>

              <div className="border-l border-[#E2E5E8] pl-3 sm:pl-4">
                <div className="flex items-center gap-1 text-[11px] font-medium text-[#69727C] uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-[#C8A96B]" />
                  {isJa ? '特別保証' : 'Bảo hành'}
                </div>
                <div className="text-lg sm:text-xl font-bold font-serif text-[#17212B] mt-0.5">
                  {isJa && currentCar.warrantyJa ? currentCar.warrantyJa : currentCar.warranty}
                </div>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap items-center gap-3.5"
            >
              <button
                id="hero-explore-cta"
                onClick={onExploreClick}
                className="bg-[#17212B] text-white px-7 sm:px-9 py-3.5 sm:py-4 font-bold tracking-wider hover:bg-[#C8A96B] hover:text-[#17212B] transition-all cursor-pointer uppercase text-xs sm:text-sm shadow-sm flex items-center gap-2"
              >
                <span>{t('hero.ctaExplore')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-account-cta"
                onClick={onAccountClick}
                className="border border-[#17212B] text-[#17212B] px-7 sm:px-9 py-3.5 sm:py-4 font-bold tracking-wider hover:border-[#C8A96B] hover:text-[#C8A96B] transition-colors cursor-pointer uppercase text-xs sm:text-sm"
              >
                {t('hero.ctaConsult')}
              </button>
            </motion.div>

          </div>

          {/* RIGHT: Auto-advancing Luxury Car Visual Showcase */}
          <div className="lg:col-span-7 relative flex flex-col items-center justify-center">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full flex flex-col items-center"
            >
              
              {/* Radial glow behind car */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] pointer-events-none rounded-full blur-[80px]"
                style={{
                  background: 'radial-gradient(circle, rgba(200,169,107,0.18) 0%, rgba(200,169,107,0.06) 50%, rgba(200,169,107,0) 75%)'
                }}
              />

              {/* Floating Container with Mouse Parallax (Tilt max 2-3 deg) */}
              <motion.div
                style={{
                  rotateX,
                  rotateY,
                  x: translateX,
                  y: translateY,
                  transformPerspective: 1200
                }}
                className="relative z-10 w-full"
              >
                
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-[#D9DDE1] to-white shadow-2xl border border-white/50 p-2 sm:p-4 backdrop-blur-xs">
                  
                  {/* Subtle Background Watermark text */}
                  <div className="absolute inset-0 flex items-center justify-center text-[#17212B]/10 font-black text-8xl lg:text-9xl tracking-tighter select-none pointer-events-none z-0">
                    LUXURY
                  </div>

                  {/* Car Image */}
                  <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-transparent flex items-center justify-center group z-10">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentCar.id}
                        id="hero-car-image"
                        src={currentCar.image}
                        alt={isJa && currentCar.nameJa ? currentCar.nameJa : currentCar.name}
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                    </AnimatePresence>

                    {/* Light sweep representation */}
                    <div className="absolute top-0 -left-1/2 w-1/4 h-full bg-white/40 skew-x-[30deg] blur-xl pointer-events-none animate-light-sweep z-20" />
                  </div>

                  {/* Clean car info bar below the photo */}
                  <div className="mt-3.5 px-3 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-[#E2E5E8]/70 relative z-10">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#C8A96B] font-bold block">
                        {isJa && currentCar.tagJa ? currentCar.tagJa : currentCar.tag}
                      </span>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#17212B]">
                        {isJa && currentCar.nameJa ? currentCar.nameJa : currentCar.name}
                      </h3>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-[10px] uppercase tracking-wider text-[#69727C] block font-medium">
                        {isJa ? '参考販売価格（税込）' : 'Giá niêm yết (Đã gồm thuế)'}
                      </span>
                      <span className="text-base font-bold text-[#17212B] font-serif">
                        {currentCar.price}
                      </span>
                    </div>
                  </div>

                  {/* Reflection Shadow */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-4/5 h-4 bg-black/10 blur-xl rounded-full pointer-events-none" />

                </div>
              </motion.div>

              {/* Slide Navigation Controls */}
              <div className="mt-5 w-full flex items-center justify-between gap-3 px-2">
                
                {/* Indicator Pills */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#69727C] uppercase tracking-wider">
                    {isJa && currentCar.categoryJa ? currentCar.categoryJa : currentCar.category}
                  </span>
                  <div className="flex items-center gap-1.5 ml-2">
                    {HERO_SLIDES.map((slide, idx) => (
                      <button
                        key={slide.id}
                        onClick={() => setCurrentSlideIndex(idx)}
                        title={slide.name}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          currentSlideIndex === idx
                            ? 'w-7 bg-[#C8A96B]'
                            : 'w-2 bg-[#D9DDE1] hover:bg-[#69727C]'
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Arrow Buttons & AutoPlay Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    className="w-8 h-8 rounded-full bg-white border border-[#D9DDE1] hover:border-[#C8A96B] hover:text-[#C8A96B] text-[#17212B] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                    title={isJa ? "前の車両" : "Mẫu xe trước"}
                    aria-label="Previous car"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    className="w-8 h-8 rounded-full bg-white border border-[#D9DDE1] hover:border-[#C8A96B] hover:text-[#C8A96B] text-[#17212B] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                    title={isAutoPlay ? (isJa ? "自動再生を一時停止" : "Tạm dừng tự động chuyển xe") : (isJa ? "自動再生を開始" : "Bật tự động chuyển xe")}
                    aria-label="Toggle autoplay"
                  >
                    {isAutoPlay ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5 ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={handleNextSlide}
                    className="w-8 h-8 rounded-full bg-white border border-[#D9DDE1] hover:border-[#C8A96B] hover:text-[#C8A96B] text-[#17212B] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                    title={isJa ? "次の車両" : "Mẫu xe kế tiếp"}
                    aria-label="Next car"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
};
