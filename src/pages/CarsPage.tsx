import React from 'react';
import { useTranslation } from 'react-i18next';
import { Car } from '../types';
import { CarCollection } from '../components/CarCollection';
import { ChevronRight } from 'lucide-react';

interface CarsPageProps {
  onNavigate: (pageId: string) => void;
  onSelectCar: (car: Car) => void;
  onConsultCar: (car: Car) => void;
}

export const CarsPage: React.FC<CarsPageProps> = ({
  onNavigate,
  onSelectCar,
  onConsultCar,
}) => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';

  return (
    <div className="w-full pt-20 bg-white">
      {/* Page Header with Breadcrumbs */}
      <div className="bg-[#F7F5F0] border-b border-[#E2E5E8] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#69727C] mb-4">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#C8A96B] transition-colors cursor-pointer"
            >
              {t('nav.home')}
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#17212B] font-semibold">
              {isJa ? '特選モデル一覧' : 'Danh mục dòng xe'}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[10px] text-[#C8A96B] uppercase font-bold tracking-[0.25em] block mb-2">
                {isJa ? '2026 ビスポーク・コレクション' : 'BỘ SƯU TẬP 2026'}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#17212B]">
                {isJa ? (
                  <>
                    選ばれし最高峰の <span className="text-[#C8A96B]">ラグジュアリーカー</span>
                  </>
                ) : (
                  <>
                    Tuyển Tập Kiệt Tác <span className="text-[#C8A96B]">Xe Sang</span>
                  </>
                )}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#69727C] max-w-md leading-relaxed">
              {isJa
                ? '厳格な120項目認定検査済み。正規通関保証・最長5年特別保証・日本全国24時間緊急ロードサービスを全車に付帯。'
                : 'Tất cả các mẫu xe đều được bảo chứng nguồn gốc hải quan chính ngạch, đi kèm gói bảo hành 5 năm VIP và dịch vụ cứu hộ 24/7 toàn quốc.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Car Collection Catalog */}
      <CarCollection
        onSelectCar={onSelectCar}
        onConsultCar={onConsultCar}
      />
    </div>
  );
};
