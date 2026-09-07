import React from 'react';
import { useTranslation } from 'react-i18next';
import { CarCategory } from '../types';

interface FilterBarProps {
  activeCategory: CarCategory;
  onSelectCategory: (category: CarCategory) => void;
  counts: Record<CarCategory, number>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeCategory,
  onSelectCategory,
  counts
}) => {
  const { t } = useTranslation();

  const filterOptions: { key: CarCategory; label: string }[] = [
    { key: 'all', label: t('cars.categories.all') },
    { key: 'sedan', label: t('cars.categories.sedan') },
    { key: 'suv', label: t('cars.categories.suv') },
    { key: 'mpv', label: t('cars.categories.mpv') },
    { key: 'hatchback', label: t('cars.categories.hatchback') },
    { key: 'pickup', label: t('cars.categories.pickup') }
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2">
      {filterOptions.map((option) => {
        const isActive = activeCategory === option.key;
        return (
          <button
            key={option.key}
            id={`filter-btn-${option.key}`}
            type="button"
            onClick={() => onSelectCategory(option.key)}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-sm text-[11px] uppercase tracking-[0.12em] font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              isActive
                ? 'bg-[#17212B] text-[#FFFFFF] border border-[#17212B] shadow-sm'
                : 'bg-[#FFFFFF] border border-[#E2E5E8] text-[#17212B] hover:border-[#C8A96B] hover:text-[#C8A96B]'
            }`}
          >
            <span>{option.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                isActive
                  ? 'bg-white/20 text-white font-medium'
                  : 'bg-[#F1F2F3] text-[#69727C] font-medium'
              }`}
            >
              {counts[option.key] || 0}
            </span>
          </button>
        );
      })}
    </div>
  );
};
