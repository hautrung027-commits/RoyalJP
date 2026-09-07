import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Zap, Gauge, ArrowUpRight, Sparkles } from 'lucide-react';
import { Car } from '../types';

interface CarCardProps {
  car: Car;
  onSelectCar: (car: Car) => void;
  onConsultCar: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  onSelectCar,
  onConsultCar
}) => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';

  const displayName = isJa && car.nameJa ? car.nameJa : car.name;
  const displayTag = isJa && car.tagJa ? car.tagJa : car.tag;
  const displayCategory = isJa && car.categoryLabelJa ? car.categoryLabelJa : car.categoryLabel;
  const displayDesc = isJa && car.descriptionJa ? car.descriptionJa : car.description;
  const displayEngine = isJa && car.engineJa ? car.engineJa : car.engine;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-[#FFFFFF] rounded-xl border border-[#E2E5E8] hover:border-[#C8A96B] transition-all duration-300 hover:-translate-y-[5px] shadow-[0_4px_16px_rgba(23,33,43,0.04)] hover:shadow-[0_12px_28px_rgba(200,169,107,0.12)] flex flex-col justify-between overflow-hidden"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-b from-[#FFFFFF] to-[#F7F5F0]">
        <img
          src={car.image}
          alt={displayName}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        {/* Tag / Badge */}
        {car.status === 'reserved' ? (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              {isJa ? 'ご予約済み' : 'ĐÃ ĐẶT CỌC'}
            </span>
          </div>
        ) : car.status === 'sold' ? (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-gray-700 text-white shadow-xs">
              {isJa ? '売約済み' : 'ĐÃ BÀN GIAO'}
            </span>
          </div>
        ) : displayTag ? (
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                car.tagType === 'gold'
                  ? 'bg-[#C8A96B] text-white shadow-xs'
                  : car.tagType === 'navy'
                  ? 'bg-[#17212B] text-white shadow-xs'
                  : 'bg-[#F1F2F3] text-[#17212B] border border-[#D9DDE1]'
              }`}
            >
              {car.tagType === 'gold' && <Sparkles className="w-3 h-3 text-white" />}
              {displayTag}
            </span>
          </div>
        ) : null}

        {/* Category Label Pill */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-[#E2E5E8] px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-[#69727C]">
          {displayCategory}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Car Name */}
          <h3 className="text-xl font-serif font-bold text-[#17212B] tracking-normal mb-1.5 line-clamp-1 group-hover:text-[#243746] transition-colors">
            {displayName}
          </h3>

          {/* Price */}
          <div className="text-lg font-serif font-bold text-[#C8A96B] tracking-wide mb-3">
            {car.price}
          </div>

          {/* Short Description */}
          <p className="text-xs text-[#69727C] line-clamp-2 leading-relaxed mb-4">
            {displayDesc}
          </p>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 gap-2.5 py-3 border-y border-[#E2E5E8] mb-5 text-[11px] text-[#69727C]">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#C8A96B] shrink-0" />
              <span className="truncate">{car.horsepower} ({displayEngine})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#C8A96B] shrink-0" />
              <span>0-100: {car.acceleration}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSelectCar(car)}
            className="w-full py-2.5 px-3 rounded-sm border border-[#D9DDE1] hover:border-[#C8A96B] hover:text-[#C8A96B] text-[#17212B] text-[11px] font-semibold tracking-widest uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{t('cars.btnDetails')}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onConsultCar(car)}
            className="w-full py-2.5 px-3 rounded-sm bg-[#17212B] hover:bg-[#C8A96B] hover:text-[#17212B] text-white text-[11px] font-semibold tracking-widest uppercase transition-colors flex items-center justify-center cursor-pointer shadow-xs"
          >
            {t('cars.btnConsult')}
          </button>
        </div>

      </div>
    </motion.div>
  );
};
