import React from 'react';
import { Car, CustomerInquiry } from '../../types';
import { 
  CarFront, 
  CheckCircle2, 
  Clock,  
  Users, 
  PlusCircle, 
  ArrowUpRight, 
  TrendingUp, 
  Sparkles,
  Eye,
  AlertCircle
} from 'lucide-react';

interface AdminOverviewProps {
  cars: Car[];
  inquiries: CustomerInquiry[];
  onNavigateTab: (tab: 'cars' | 'add-car' | 'customers' | 'settings') => void;
  onEditCar: (car: Car) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  cars,
  inquiries,
  onNavigateTab,
  onEditCar,
}) => {
  const safeCars = Array.isArray(cars) ? cars : [];
const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

  // Statistics calculations
const totalCars = safeCars.length;

const availableCars = safeCars.filter(
  (c) => (c.status || 'available') === 'available'
).length;

const reservedCars = safeCars.filter(
  (c) => c.status === 'reserved'
).length;

const soldCars = safeCars.filter(
  (c) => c.status === 'sold'
).length;

const totalValueYen = safeCars.reduce(
  (acc, c) => acc + (c.priceRaw || 0),
  0
);

const totalValueVndBillion =
  (totalValueYen * 165) / 1000000000;

const pendingInquiries = safeInquiries.filter(
  (i) => i.status === 'new' || i.status === 'appointment'
).length;

// Group by brand
const brandCounts: { [key: string]: number } = {};

safeCars.forEach((c) => {
  const brand = c.brand || 'Khác';
  brandCounts[brand] =
    (brandCounts[brand] || 0) + 1;
});

const sortedBrands = Object.entries(brandCounts).sort(
  (a, b) => b[1] - a[1]
);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#17212B] via-[#1F2E3E] to-[#17212B] text-white border border-[#C8A96B]/30 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8A96B]/20 text-[#C8A96B] text-[11px] font-bold tracking-wider uppercase mb-3 border border-[#C8A96B]/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hệ Thống Quản Trị ROYAL JPcar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Tổng Quan Hoạt Động Showroom
            </h1>
            <p className="text-xs sm:text-sm text-[#B8C0C7] mt-1 max-w-xl">
              Giám sát kho xe sang, tiến độ giao dịch, lịch hẹn lái thử và quản lý khách hàng VIP tại các chi nhánh Tokyo, Yokohama và Osaka.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('add-car')}
              className="px-4 py-2.5 bg-[#C8A96B] hover:bg-[#DFCA97] text-[#17212B] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm Xe Mới</span>
            </button>
            <button
              onClick={() => onNavigateTab('cars')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-lg transition-all border border-white/15 flex items-center gap-2 cursor-pointer"
            >
              <CarFront className="w-4 h-4 text-[#C8A96B]" />
              <span>Kho Tất Cả Xe ({totalCars})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Inventory */}
        <div className="p-5 rounded-xl bg-white border border-[#E2E5E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#69727C] uppercase tracking-wider block">
              Tổng Số Xe Trong Kho
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-serif font-bold text-[#17212B]">
                {totalCars}
              </span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> 100% Sẵn sàng
              </span>
            </div>
            <span className="text-[10px] text-[#69727C] mt-1 block">
              {availableCars} đang bán • {reservedCars} giữ cọc • {soldCars} đã bán
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#E2E5E8] flex items-center justify-center text-[#C8A96B] shrink-0">
            <CarFront className="w-6 h-6" />
          </div>
        </div>

        {/* Available Cars */}
        <div className="p-5 rounded-xl bg-white border border-[#E2E5E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#69727C] uppercase tracking-wider block">
              Xe Đang Mở Bán
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-serif font-bold text-emerald-600">
                {availableCars}
              </span>
              <span className="text-xs text-[#69727C]">xe niêm yết</span>
            </div>
            <span className="text-[10px] text-[#69727C] mt-1 block">
              Sẵn sàng bàn giao hoặc lái thử ngay
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Reserved & Sold */}
        <div className="p-5 rounded-xl bg-white border border-[#E2E5E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#69727C] uppercase tracking-wider block">
              Đặt Cọc & Đã Giao
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-serif font-bold text-[#C8A96B]">
                {reservedCars}
              </span>
              <span className="text-xs text-[#69727C]">cọc / {soldCars} đã bán</span>
            </div>
            <span className="text-[10px] text-[#69727C] mt-1 block">
              Đang làm thủ tục hồ sơ hải quan & đăng kiểm
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#FAF8F5] border border-[#C8A96B]/30 flex items-center justify-center text-[#C8A96B] shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Customer Inquiries */}
        <div className="p-5 rounded-xl bg-white border border-[#E2E5E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#69727C] uppercase tracking-wider block">
              Yêu Cầu & Lịch Lái Thử
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-serif font-bold text-[#17212B]">
                {safeInquiries.length}
              </span>
              {pendingInquiries > 0 && (
                <span className="text-xs text-amber-600 font-semibold flex items-center">
                  <AlertCircle className="w-3 h-3 mr-0.5" /> {pendingInquiries} cần xử lý
                </span>
              )}
            </div>
            <button
              onClick={() => onNavigateTab('customers')}
              className="text-[10px] text-[#C8A96B] hover:underline font-bold mt-1 inline-flex items-center gap-0.5 cursor-pointer"
            >
              <span>Xem chi tiết danh sách</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns - Inventory Value & Brand Breakdown / Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Brand Breakdown & Total Value (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inventory Valuation Card */}
          <div className="p-6 rounded-2xl bg-white border border-[#E2E5E8] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] text-[#69727C] uppercase font-bold tracking-wider">
                  Định Giá Ước Tính Toàn Bộ Kho Xe
                </span>
                <h3 className="text-xl font-serif font-bold text-[#17212B] mt-0.5">
                  ¥{totalValueYen.toLocaleString()} Yên
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-[#69727C]">Quy đổi xấp xỉ</span>
                <div className="text-sm font-bold text-[#C8A96B]">
                  ~{totalValueVndBillion.toFixed(1)} Tỷ VNĐ
                </div>
              </div>
            </div>

            {/* Brand Distribution Bars */}
            <div className="pt-4 border-t border-[#E2E5E8] space-y-3">
              <span className="text-xs font-bold text-[#17212B] block mb-2">
                Phân bổ theo thương hiệu xe:
              </span>
              {sortedBrands.map(([brand, count]) => {
                const percent =
  totalCars > 0
    ? Math.round((count / totalCars) * 100)
    : 0;
                return (
                  <div key={brand} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#17212B]">{brand}</span>
                      <span className="text-[#69727C]">
                        {count} xe ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F7F5F0] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#17212B] to-[#C8A96B]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick List: Recently Updated Cars */}
          <div className="p-6 rounded-2xl bg-white border border-[#E2E5E8] shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-serif font-bold text-[#17212B]">
                Xe Mới Cập Nhật Trong Kho
              </h3>
              <button
                onClick={() => onNavigateTab('cars')}
                className="text-xs font-bold text-[#C8A96B] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Xem tất cả</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-[#E2E5E8]">
              {safeCars.slice(0, 5).map((car) => {
                const status = car.status || 'available';
                return (
                  <div key={car.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-14 h-10 object-cover rounded-md border border-[#E2E5E8] shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-[#17212B] truncate">
                          {car.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-[#69727C] mt-0.5">
                          <span>{car.year}</span>
                          <span>•</span>
                          <span className="font-semibold text-[#C8A96B]">{car.price}</span>
                          {car.brand && (
                            <>
                              <span>•</span>
                              <span>{car.brand}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {status === 'available' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Đang bán
                        </span>
                      )}
                      {status === 'reserved' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
                          Đặt cọc
                        </span>
                      )}
                      {status === 'sold' && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-gray-100 text-gray-600 border border-gray-200">
                          Đã bán
                        </span>
                      )}

                      <button
                        onClick={() => onEditCar(car)}
                        className="p-1.5 rounded hover:bg-[#F7F5F0] text-[#69727C] hover:text-[#17212B] cursor-pointer"
                        title="Chỉnh sửa xe này"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Inquiries Feed (1 col) */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-[#E2E5E8] shadow-xs flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-serif font-bold text-[#17212B]">
                Yêu Cầu Mới Nhất
              </h3>
              <span className="text-[11px] font-bold text-[#C8A96B] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E2E5E8]">
                {safeInquiries.length} lượt
              </span>
            </div>

            <div className="space-y-4 flex-1">
              {safeInquiries.slice(0, 4).map((inq) => (
                <div
                  key={inq.id}
                  className="p-3.5 rounded-xl bg-[#F7F5F0] border border-[#E2E5E8] hover:border-[#C8A96B] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#17212B] truncate max-w-[180px]">
                      {inq.customerName}
                    </span>
                    {inq.status === 'new' ? (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        Mới
                      </span>
                    ) : inq.status === 'appointment' ? (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        Lịch hẹn
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Đã tư vấn
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#C8A96B] font-semibold mb-1 truncate">
                    Quan tâm: {inq.carInterest}
                  </p>

                  <p className="text-[11px] text-[#69727C] line-clamp-2 italic mb-2">
                    "{inq.message}"
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[#8C95A0] pt-2 border-t border-[#E2E5E8]">
                    <span>SĐT: {inq.phone}</span>
                    <span>{new Date(inq.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('customers')}
              className="w-full mt-4 py-2.5 bg-[#17212B] hover:bg-[#C8A96B] text-white hover:text-[#17212B] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer text-center"
            >
              Xem Toàn Bộ Khách Hàng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
