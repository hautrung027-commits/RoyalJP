import React, { useState } from 'react';
import { AdminUser } from '../../types';
import { AdminStaffManagement } from './AdminStaffManagement';
import { 
  Building2, 
  Save, 
  Check 
} from 'lucide-react';

interface AdminSettingsProps {
  adminUser: AdminUser;
  onResetCarsToDefault?: () => void;
  onShowToast?: (msg: string) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  adminUser,
  onShowToast,
}) => {
  const [showroomName, setShowroomName] = useState('ROYAL JPcar TOKYO SHOWROOM');
  const [hotline, setHotline] = useState('+81 (0)3 5555 8888');
  const [email, setEmail] = useState('vip@royaljpcar.com');
  const [address, setAddress] = useState('7-12-8 Roppongi, Minato-ku, Tokyo (東京都港区六本木 7-12-8)');
  const [exchangeRate, setExchangeRate] = useState('165'); // 1 Yen = 165 VND
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveShowroom = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17212B]">
          Cài Đặt Hệ Thống Showroom
        </h1>
        <p className="text-xs sm:text-sm text-[#69727C] mt-1">
          Cấu hình thông tin đại lý ROYAL JPcar, tỷ giá quy đổi tiền tệ và quản trị nhân viên.
        </p>
      </div>

      {/* Showroom Information */}
      <div className="p-6 rounded-2xl bg-white border border-[#E2E5E8] shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E5E8]">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-[#C8A96B]" />
            <h2 className="text-base font-bold text-[#17212B]">
              Thông Tin Thương Hiệu & Showroom
            </h2>
          </div>
          {isSaved && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold">
              <Check className="w-4 h-4" /> Đã lưu thành công
            </span>
          )}
        </div>

        <form onSubmit={handleSaveShowroom} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#17212B] mb-1">
                Tên Showroom Niêm Yết
              </label>
              <input
                type="text"
                value={showroomName}
                onChange={(e) => setShowroomName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#17212B] mb-1">
                Hotline VIP Tiếp Nhận
              </label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#17212B] mb-1">
                Email Chăm Sóc Khách Hàng
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#17212B] mb-1">
                Tỷ giá quy đổi (1 Yên Nhật = ? VNĐ)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B]"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-[#C8A96B] pointer-events-none">
                  VNĐ
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-[#17212B] mb-1">
                Địa Chỉ Flagship Roppongi (Trụ sở chính)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[#17212B] hover:bg-[#C8A96B] text-white hover:text-[#17212B] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cấu Hình</span>
            </button>
          </div>
        </form>
      </div>

      {/* QUẢN LÝ TÀI KHOẢN & NHÂN VIÊN */}
      <AdminStaffManagement
        adminUser={adminUser}
        onShowToast={onShowToast}
      />
    </div>
  );
};
