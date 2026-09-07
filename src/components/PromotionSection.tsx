import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, CheckCircle2, Calendar, Gift, Percent } from 'lucide-react';
import { PROMOTION_DATA } from '../data/content';

interface PromotionSectionProps {
  onClaimPromotion: () => void;
}

export const PromotionSection: React.FC<PromotionSectionProps> = ({ onClaimPromotion }) => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';

  const displayBadge = isJa && PROMOTION_DATA.badgeJa ? PROMOTION_DATA.badgeJa : PROMOTION_DATA.badge;
  const displayTitle = isJa && PROMOTION_DATA.titleJa ? PROMOTION_DATA.titleJa : PROMOTION_DATA.title;
  const displaySubtitle = isJa && PROMOTION_DATA.subtitleJa ? PROMOTION_DATA.subtitleJa : PROMOTION_DATA.subtitle;
  const displayHighlight = isJa && PROMOTION_DATA.highlightJa ? PROMOTION_DATA.highlightJa : PROMOTION_DATA.highlight;
  const displayDeadline = isJa && PROMOTION_DATA.deadlineJa ? PROMOTION_DATA.deadlineJa : PROMOTION_DATA.deadline;
  const displayCta = isJa && PROMOTION_DATA.ctaTextJa ? PROMOTION_DATA.ctaTextJa : PROMOTION_DATA.ctaText;

  return (
    <section
      id="promotion"
      className="py-20 sm:py-28 bg-[#F1F2F3] relative overflow-hidden border-b border-[#E2E5E8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#C8A96B] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 border border-[#E2E5E8]">
            <Gift className="w-3.5 h-3.5" />
            {displayBadge}
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#17212B] tracking-tight mb-4">
            {t('promotion.title')}
          </h2>
          
          <p className="text-sm sm:text-base text-[#69727C] leading-relaxed">
            {displaySubtitle}
          </p>
        </div>

        {/* Big Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl border border-[#E2E5E8] overflow-hidden shadow-[0_12px_40px_rgba(23,33,43,0.06)] grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Left Visual Banner */}
          <div className="lg:col-span-7 relative min-h-[320px] lg:min-h-[500px] overflow-hidden bg-gradient-to-r from-[#FFFFFF] to-[#F1F2F3] group">
            <img
              src={PROMOTION_DATA.image}
              alt={isJa ? "特別優遇キャンペーン" : "Chương trình ưu đãi xe sang"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle champagne gradient sheen */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#17212B]/40 via-transparent to-transparent"></div>
            
            {/* Overlay badge on banner */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <div className="backdrop-blur-md bg-white/20 px-4 py-2 rounded-lg border border-white/30">
                <span className="text-[11px] uppercase tracking-wider block font-semibold text-[#DDBF7A]">
                  {isJa ? '成約特典' : 'ĐẶC QUYỀN DUY NHẤT'}
                </span>
                <span className="text-sm sm:text-base font-serif font-bold text-white">
                  {isJa ? '純正プレミアムアクセサリーセット進呈' : 'Tặng Bộ Phụ Kiện Chính Hãng Cao Cấp'}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs text-white/90">
                <Calendar className="w-4 h-4 text-[#DDBF7A]" />
                <span>{displayDeadline}</span>
              </div>
            </div>
          </div>

          {/* Right Offer Details */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Highlight Title */}
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#C8A96B]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8A96B]">
                  {displayHighlight}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#17212B] leading-tight mb-6">
                {displayTitle}
              </h3>

              {/* Perks List */}
              <div className="space-y-4 mb-8">
                {PROMOTION_DATA.perks.map((perk, index) => {
                  const perkTitle = isJa && perk.titleJa ? perk.titleJa : perk.title;
                  const perkDesc = isJa && perk.descJa ? perk.descJa : perk.desc;
                  return (
                    <div key={index} className="flex items-start gap-3.5">
                      <div className="mt-1 w-5 h-5 rounded-full bg-[#F7F5F0] border border-[#C8A96B] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96B]" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#17212B]">
                          {perkTitle}
                        </div>
                        <div className="text-xs text-[#69727C] mt-0.5">
                          {perkDesc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-[#E2E5E8]">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  id="promo-cta-btn"
                  type="button"
                  onClick={onClaimPromotion}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-sm bg-[#17212B] text-[#FFFFFF] hover:bg-[#C8A96B] hover:text-[#17212B] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md cursor-pointer"
                >
                  <span>{displayCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-xs text-[#69727C] text-center sm:text-right">
                  <span className="font-semibold text-[#17212B] block">
                    {isJa ? '専任ダイヤル:' : 'Hotline Ưu Đãi:'}
                  </span>
                  <span className="text-[#C8A96B] font-bold">0120-88-8899</span>
                </div>
              </div>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};
