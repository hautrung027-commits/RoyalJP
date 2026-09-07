import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { Car, CarCategory } from '../types';
import { useCars } from '../hooks/useCars';
import { FilterBar } from './FilterBar';
import { CarCard } from './CarCard';
import { Sparkles, SlidersHorizontal, Search } from 'lucide-react';

interface CarCollectionProps {
  onSelectCar: (car: Car) => void;
  onConsultCar: (car: Car) => void;
}

export const CarCollection: React.FC<CarCollectionProps> = ({
  onSelectCar,
  onConsultCar
}) => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';
  const carsData = useCars();

  const [activeCategory, setActiveCategory] = useState<CarCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'power'>('featured');

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<CarCategory, number> = {
      all: carsData.length,
      sedan: 0,
      suv: 0,
      mpv: 0,
      hatchback: 0,
      pickup: 0
    };
    carsData.forEach((car) => {
      if (counts[car.category] !== undefined) {
        counts[car.category]++;
      }
    });
    return counts;
  }, [carsData]);

  // Filter and sort
  const filteredCars = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return carsData.filter((car) => {
      const matchesCategory = activeCategory === 'all' || car.category === activeCategory;
      const matchesSearch =
        !query ||
        car.name.toLowerCase().includes(query) ||
        (car.nameJa && car.nameJa.toLowerCase().includes(query)) ||
        car.description.toLowerCase().includes(query) ||
        (car.descriptionJa && car.descriptionJa.toLowerCase().includes(query)) ||
        car.engine.toLowerCase().includes(query) ||
        (car.engineJa && car.engineJa.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceRaw - b.priceRaw;
      if (sortBy === 'price-desc') return b.priceRaw - a.priceRaw;
      if (sortBy === 'power') {
        const hpA = parseInt(a.horsepower) || 0;
        const hpB = parseInt(b.horsepower) || 0;
        return hpB - hpA;
      }
      return 0; // featured default order
    });
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <section
      id="collection"
      className="py-20 sm:py-28 bg-[#FFFFFF] relative border-b border-[#E2E5E8]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F2F3] text-[#C8A96B] text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            SHOWROOM COLLECTION 2026 • JAPAN
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#17212B] tracking-tight mb-5">
            {t('cars.title')}
          </h2>
          
          <p className="text-base text-[#69727C] leading-relaxed">
            {t('cars.subtitle')}
          </p>
        </div>

        {/* Filter Bar & Controls */}
        <div className="mb-10 flex flex-col gap-6">
          
          {/* Main Category Filter Buttons */}
          <FilterBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            counts={categoryCounts}
          />

          {/* Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E2E5E8]/60">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#69727C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('cars.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-sm bg-[#FFFFFF] border border-[#E2E5E8] focus:border-[#C8A96B] focus:outline-none text-[#17212B] placeholder-[#69727C]/70 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#69727C] hover:text-[#17212B] cursor-pointer"
                >
                  {isJa ? 'クリア' : 'Xoá'}
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-[#69727C]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>{t('cars.sortLabel')}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FFFFFF] border border-[#E2E5E8] rounded-sm px-3 py-1.5 text-xs text-[#17212B] focus:border-[#C8A96B] focus:outline-none cursor-pointer"
              >
                <option value="featured">{t('cars.sortOptions.featured')}</option>
                <option value="price-desc">{t('cars.sortOptions.priceDesc')}</option>
                <option value="price-asc">{t('cars.sortOptions.priceAsc')}</option>
                <option value="power">{t('cars.sortOptions.power')}</option>
              </select>
            </div>
          </div>

        </div>

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence>
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onSelectCar={onSelectCar}
                  onConsultCar={onConsultCar}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-[#F7F5F0] rounded-xl border border-[#E2E5E8]">
            <p className="text-sm text-[#69727C] mb-3">
              {t('cars.noResults')}
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-sm bg-[#17212B] text-white text-xs font-semibold uppercase hover:bg-[#C8A96B] hover:text-[#17212B] transition-colors cursor-pointer"
            >
              {isJa ? '検索条件をリセット' : 'Đặt lại bộ lọc'}
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
