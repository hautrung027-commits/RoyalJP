import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, Gauge, Shield, Check, Calendar, ArrowRight, Sparkles, Calculator } from 'lucide-react';
import { Car } from '../types';

interface CarDetailModalProps {
  car: Car | null;
  onClose: () => void;
  onRequestQuote: (car: Car) => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  onClose,
  onRequestQuote
}) => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';

  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'finance'>('specs');
  const [selectedColor, setSelectedColor] = useState(car?.colors ? car.colors[0] : null);

  // Loan calculator states
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTermMonths, setLoanTermMonths] = useState(60);

  if (!car) return null;

  const displayName = isJa && car.nameJa ? car.nameJa : car.name;
  const displayTag = isJa && car.tagJa ? car.tagJa : car.tag;
  const displayCategory = isJa && car.categoryLabelJa ? car.categoryLabelJa : car.categoryLabel;
  const displayDesc = isJa && car.descriptionJa ? car.descriptionJa : car.description;
  const displayEngine = isJa && car.engineJa ? car.engineJa : car.engine;
  const displayFuel = isJa && car.fuelTypeJa ? car.fuelTypeJa : car.fuelType;
  const displayTransmission = isJa && car.transmissionJa ? car.transmissionJa : car.transmission;
  const displayFeatures = isJa && car.featuresJa ? car.featuresJa : car.features;

  // Simple finance calculation
  const downPaymentAmount = (car.priceRaw * downPaymentPercent) / 100;
  const loanPrincipal = car.priceRaw - downPaymentAmount;
  const interestRateYearly = 0.029; // 2.9% auto loan in Japan
  const monthlyInterestRate = interestRateYearly / 12;
  const monthlyPayment =
    loanTermMonths > 0
      ? (loanPrincipal * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths))) /
        (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
      : 0;

  const formatJPY = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#17212B]/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl border border-[#E2E5E8] shadow-[0_25px_60px_rgba(23,33,43,0.18)] overflow-hidden my-auto z-10 max-h-[90vh] flex flex-col"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E5E8] bg-[#F7F5F0]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A96B]">
                {displayCategory} • {isJa ? '2026年 最新仕様' : 'PHIÊN BẢN 2026'}
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#17212B]">
                {displayName}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#69727C] hover:text-[#17212B] hover:bg-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-6 space-y-6">
            
            {/* Image Preview & Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              <div className="md:col-span-7 relative rounded-xl overflow-hidden bg-gradient-to-b from-white to-[#F1F2F3] border border-[#E2E5E8] aspect-[16/10]">
                <img
                  src={car.image}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
                {displayTag && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-sm bg-[#17212B] text-white text-[10px] font-bold uppercase tracking-wider">
                    {displayTag}
                  </div>
                )}
              </div>

              <div className="md:col-span-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-[#69727C] uppercase tracking-wider font-semibold block">
                    {isJa ? '参考販売価格（税込）:' : 'Giá niêm yết chính hãng:'}
                  </span>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#C8A96B] my-1">
                    {car.price}
                  </div>
                  <p className="text-xs text-[#69727C] leading-relaxed mb-4">
                    {displayDesc}
                  </p>
                </div>

                {/* Color choices if available */}
                {car.colors && car.colors.length > 0 && (
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-[#17212B] block mb-2">
                      {isJa ? 'ボディカラー選択:' : 'Tùy chọn màu sơn ngoại thất:'}
                    </span>
                    <div className="flex items-center gap-2">
                      {car.colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                            selectedColor?.name === c.name
                              ? 'ring-2 ring-[#C8A96B] ring-offset-2 scale-110'
                              : 'border-[#D9DDE1]'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                      <span className="text-xs text-[#69727C] ml-2">
                        {selectedColor?.name || car.colors[0].name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Direct Action */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestQuote(car);
                  }}
                  className="w-full py-3 rounded-sm bg-[#17212B] hover:bg-[#C8A96B] hover:text-[#17212B] text-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-[#C8A96B]" />
                  <span>{isJa ? 'お見積り・専任コンシェルジュ相談' : 'Yêu Cầu Báo Giá & Tư Vấn VIP'}</span>
                </button>
              </div>

            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-[#E2E5E8] gap-6 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`pb-3 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'specs'
                    ? 'border-[#C8A96B] text-[#17212B]'
                    : 'border-transparent text-[#69727C] hover:text-[#17212B]'
                }`}
              >
                {isJa ? '主要諸元' : 'Thông Số Kỹ Thuật'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('features')}
                className={`pb-3 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'features'
                    ? 'border-[#C8A96B] text-[#17212B]'
                    : 'border-transparent text-[#69727C] hover:text-[#17212B]'
                }`}
              >
                {isJa ? '主要装備' : 'Trang Bị Tiêu Biểu'}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('finance')}
                className={`pb-3 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'finance'
                    ? 'border-[#C8A96B] text-[#17212B]'
                    : 'border-transparent text-[#69727C] hover:text-[#17212B]'
                }`}
              >
                {isJa ? 'ローンシミュレーション' : 'Dự Toán Trả Góp'}
              </button>
            </div>

            {/* Tab Content 1: Specs */}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-lg bg-[#F7F5F0] border border-[#E2E5E8]">
                  <span className="text-[11px] text-[#69727C] uppercase tracking-wider block">
                    {isJa ? 'エンジン' : 'Động cơ'}
                  </span>
                  <span className="text-sm font-bold text-[#17212B]">{displayEngine}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#F7F5F0] border border-[#E2E5E8]">
                  <span className="text-[11px] text-[#69727C] uppercase tracking-wider block">
                    {isJa ? '最高出力' : 'Công suất tối đa'}
                  </span>
                  <span className="text-sm font-bold text-[#17212B]">{car.horsepower}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#F7F5F0] border border-[#E2E5E8]">
                  <span className="text-[11px] text-[#69727C] uppercase tracking-wider block">
                    {isJa ? '0-100km/h 加速' : 'Tăng tốc 0 - 100'}
                  </span>
                  <span className="text-sm font-bold text-[#17212B]">{car.acceleration}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#F7F5F0] border border-[#E2E5E8]">
                  <span className="text-[11px] text-[#69727C] uppercase tracking-wider block">
                    {isJa ? '最高速度' : 'Tốc độ tối đa'}
                  </span>
                  <span className="text-sm font-bold text-[#17212B]">{car.topSpeed}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#F7F5F0] border border-[#E2E5E8]">
                  <span className="text-[11px] text-[#69727C] uppercase tracking-wider block">
                    {isJa ? 'トランスミッション' : 'Hộp số'}
                  </span>
                  <span className="text-sm font-bold text-[#17212B]">{displayTransmission}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-[#F7F5F0] border border-[#E2E5E8]">
                  <span className="text-[11px] text-[#69727C] uppercase tracking-wider block">
                    {isJa ? '燃料タイプ' : 'Nhiên liệu'}
                  </span>
                  <span className="text-sm font-bold text-[#17212B]">{displayFuel}</span>
                </div>
              </div>
            )}

            {/* Tab Content 2: Features */}
            {activeTab === 'features' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-3 rounded-lg bg-[#F7F5F0] border border-[#E2E5E8] text-xs font-semibold text-[#17212B]">
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 border border-[#C8A96B]">
                      <Check className="w-3 h-3 text-[#C8A96B]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Content 3: Finance Calculator */}
            {activeTab === 'finance' && (
              <div className="space-y-4 bg-[#F7F5F0] p-5 rounded-xl border border-[#E2E5E8]">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8A96B]">
                  <Calculator className="w-4 h-4" />
                  <span>{isJa ? '日本国内提携オートローン試算 (金利 2.9% 想定)' : 'Bảng tính ước tính trả góp ngân hàng Nhật Bản (2.9%/năm)'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17212B] mb-1">
                      {isJa ? `頭金 (${downPaymentPercent}%): ${formatJPY(downPaymentAmount)}` : `Tỷ lệ trả trước (${downPaymentPercent}%): ${formatJPY(downPaymentAmount)}`}
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="70"
                      step="5"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full accent-[#C8A96B] cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17212B] mb-1">
                      {isJa ? `返済期間: ${loanTermMonths} ヶ月 (${loanTermMonths / 12} 年)` : `Thời hạn vay: ${loanTermMonths} tháng (${loanTermMonths / 12} năm)`}
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="96"
                      step="12"
                      value={loanTermMonths}
                      onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                      className="w-full accent-[#C8A96B] cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E5E8] flex items-center justify-between">
                  <span className="text-xs text-[#69727C]">
                    {isJa ? '月々のお支払い目安額:' : 'Ước tính thanh toán hàng tháng:'}
                  </span>
                  <span className="text-lg font-serif font-bold text-[#C8A96B]">
                    ~{formatJPY(Math.round(monthlyPayment))} {isJa ? '/月' : '/ tháng'}
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-[#F7F5F0] border-t border-[#E2E5E8] flex items-center justify-between text-xs text-[#69727C]">
            <span>
              {isJa ? '専任コンシェルジュ フリーダイヤル: ' : 'Hotline tư vấn trực tiếp 24/7: '}
              <strong className="text-[#17212B]">0120-88-8899</strong>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-sm border border-[#D9DDE1] hover:border-[#17212B] text-[#17212B] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              {isJa ? '閉じる' : 'Đóng'}
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
