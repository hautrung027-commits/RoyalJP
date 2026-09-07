import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Eye, Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { SHOWROOM_GALLERY, GalleryImage } from '../data/gallery';

interface HomeCarGalleryProps {
  onSelectImage: (image: GalleryImage) => void;
  onNavigateToCollection: () => void;
  onNavigateToAccount?: () => void;
}

export const HomeCarGallery: React.FC<HomeCarGalleryProps> = ({
  onSelectImage,
  onNavigateToCollection,
  onNavigateToAccount,
}) => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';

  const [activeCategory, setActiveCategory] = useState<'all' | 'exterior' | 'interior' | 'details' | 'handover'>('all');

  const categories = [
    { key: 'all', label: isJa ? 'すべてのギャラリー' : 'Tất Cả Góc Chụp' },
    { key: 'exterior', label: isJa ? 'エクステリア' : 'Ngoại Thất Sang Trọng' },
    { key: 'interior', label: isJa ? 'インテリア・キャビン' : 'Khoang Lái Thượng Hạng' },
    { key: 'details', label: isJa ? 'クラフトマンシップ' : 'Chi Tiết Chế Tác' },
    { key: 'handover', label: isJa ? '納車セレモニー' : 'Bàn Giao Xe VIP' },
  ] as const;

  const filteredImages = activeCategory === 'all'
    ? SHOWROOM_GALLERY
    : SHOWROOM_GALLERY.filter((img) => img.category === activeCategory);

  return (
    <section id="home-gallery-section" className="py-20 bg-white border-t border-[#E2E5E8] relative overflow-hidden">
      
      {/* Background soft ambient accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D9DDE1]/60 text-[10px] tracking-[0.2em] font-bold text-[#17212B] uppercase mb-3 rounded-sm">
              <Camera className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>SHOWROOM PHOTO GALLERY • TOKYO ROPPONGI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#17212B] tracking-tight">
              {isJa ? (
                <>
                  ショールーム実車 <span className="text-[#C8A96B]">フォトギャラリー</span>
                </>
              ) : (
                <>
                  Tuyển Tập <span className="text-[#C8A96B]">Hình Ảnh Thực Tế</span>
                </>
              )}
            </h2>
            <p className="text-sm sm:text-base text-[#69727C] max-w-2xl mt-3 leading-relaxed">
              {isJa
                ? '六本木ショールームに展示中の実車ディテール、厳選されたナッパレザーの内装美、そしてプライベートブースでの特別なご納車セレモニーをご覧ください。'
                : 'Chiêm ngưỡng từng đường nét thiết kế kiệt tác, chất liệu da Nappa thượng hạng và khoảnh khắc bàn giao xe trang trọng diễn ra trực tiếp tại sảnh trưng bày.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onNavigateToCollection}
              className="px-6 py-3 bg-[#17212B] text-white hover:bg-[#C8A96B] hover:text-[#17212B] transition-colors text-[11px] font-bold tracking-widest uppercase rounded-sm flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>{isJa ? '全在庫車両を見る' : 'Xem Toàn Bộ Dòng Xe'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pb-8 border-b border-[#F1F2F3] mb-8">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2 rounded-sm text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#17212B] text-white shadow-sm'
                    : 'bg-[#F7F5F0] text-[#1B2025] hover:bg-[#E2E5E8]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Pure Image Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
        >
          <AnimatePresence>
            {filteredImages.map((item, index) => {
              const displayTitle = isJa && item.titleJa ? item.titleJa : item.title;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.03 }}
                  onClick={() => onSelectImage(item)}
                  className="group relative rounded-xl overflow-hidden aspect-[16/10] bg-black/5 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer border border-[#E2E5E8] hover:border-[#C8A96B]"
                >
                  {/* Pure Image */}
                  <img
                    src={item.imageUrl}
                    alt={displayTitle}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Subtle Hover Gradient & Zoom Indicator */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
                    <div className="flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center border border-white/20">
                        <Eye className="w-4 h-4 text-[#C8A96B]" />
                      </div>
                    </div>
                    <div className="text-white text-xs font-serif font-medium truncate">
                      {displayTitle}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Banner inside Gallery section */}
        <div className="mt-14 p-8 rounded-2xl bg-[#F7F5F0] border border-[#E2E5E8] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#17212B] text-[#C8A96B] flex items-center justify-center shrink-0 border border-[#C8A96B]/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-serif font-bold text-[#17212B]">
                {isJa ? '東京・六本木ショールームにて実車特別公開中' : 'Trực Tiếp Trải Nghiệm & Ngắm Xe Tại Showroom'}
              </h4>
              <p className="text-xs text-[#69727C] mt-0.5">
                {isJa
                  ? '30台以上のプレミアムカーを常時展示。上質なプライベートサロンにてお飲み物をご用意してお待ちしております。'
                  : 'Hơn 30+ mẫu xe sẵn sàng đón tiếp quý khách thưởng trà, lái thử và nhận tư vấn cấu hình Bespoke.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                if (onNavigateToAccount) {
                  onNavigateToAccount();
                } else {
                  window.location.href = 'tel:0908888999';
                }
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-sm bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
            >
              {isJa ? 'ショールーム来店予約' : 'Liên Hệ Xem Xe Trực Tiếp'}
            </button>
            <button
              type="button"
              onClick={onNavigateToCollection}
              className="w-full sm:w-auto px-6 py-3 rounded-sm bg-white border border-[#17212B] hover:bg-[#17212B] hover:text-white text-[#17212B] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
            >
              {isJa ? '車両価格一覧' : 'Khám Phá Bảng Giá'}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
