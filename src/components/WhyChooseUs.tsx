import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Award, BadgeDollarSign, Landmark, Wrench, Sparkles, Check } from 'lucide-react';
import { WHY_CHOOSE_US } from '../data/content';

export const WhyChooseUs: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';

  const getIcon = (num: string) => {
    switch (num) {
      case '01':
        return <Award className="w-7 h-7 text-[#C8A96B]" />;
      case '02':
        return <BadgeDollarSign className="w-7 h-7 text-[#C8A96B]" />;
      case '03':
        return <Landmark className="w-7 h-7 text-[#C8A96B]" />;
      case '04':
        return <Wrench className="w-7 h-7 text-[#C8A96B]" />;
      default:
        return <Sparkles className="w-7 h-7 text-[#C8A96B]" />;
    }
  };

  return (
    <section
      id="why-us"
      className="py-20 sm:py-28 bg-[#FFFFFF] relative border-b border-[#E2E5E8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F5F0] text-[#C8A96B] text-[11px] font-bold uppercase tracking-[0.2em] mb-4 border border-[#E2E5E8]">
            {isJa ? 'royalJPcarが選ばれる理由' : 'GIÁ TRỊ KHÁC BIỆT'}
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#17212B] tracking-tight mb-4">
            {t('whyUs.title')}
          </h2>
          
          <p className="text-base text-[#69727C] leading-relaxed">
            {t('whyUs.subtitle')}
          </p>
        </div>

        {/* 4 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {WHY_CHOOSE_US.map((item, index) => {
            const displayTitle = isJa && item.titleJa ? item.titleJa : item.title;
            const displayDesc = isJa && item.descriptionJa ? item.descriptionJa : item.description;
            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group p-8 rounded-xl bg-[#FFFFFF] border border-[#E2E5E8] hover:border-[#C8A96B] transition-all duration-300 hover:-translate-y-1 shadow-[0_4px_20px_rgba(23,33,43,0.03)] hover:shadow-[0_12px_28px_rgba(200,169,107,0.12)] flex flex-col justify-between"
              >
                <div>
                  {/* Header with Number & Icon */}
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-serif text-3xl font-bold text-[#C8A96B]/50 group-hover:text-[#C8A96B] transition-colors">
                      {item.number}
                    </span>
                    <div className="w-14 h-14 rounded-lg bg-[#F7F5F0] border border-[#E2E5E8] flex items-center justify-center group-hover:bg-[#C8A96B]/10 group-hover:border-[#C8A96B]/40 transition-colors">
                      {getIcon(item.number)}
                    </div>
                  </div>

                  {/* Micro Tag */}
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A96B] mb-2">
                    {item.badge}
                  </div>

                  {/* Heading */}
                  <h3 className="text-xl font-serif font-bold text-[#17212B] mb-3 group-hover:text-[#243746] transition-colors">
                    {displayTitle}
                  </h3>

                  {/* Body */}
                  <p className="text-xs sm:text-sm text-[#69727C] leading-relaxed">
                    {displayDesc}
                  </p>
                </div>

                {/* Bottom indicator */}
                <div className="mt-8 pt-4 border-t border-[#E2E5E8]/60 flex items-center justify-between text-xs text-[#69727C] font-medium">
                  <span className="text-[#C8A96B] flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    {isJa ? '5つ星ホスピタリティ' : 'Tiêu chuẩn 5 sao'}
                  </span>
                  <span className="text-[#D9DDE1]">•</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
