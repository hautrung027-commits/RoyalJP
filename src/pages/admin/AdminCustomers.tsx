import React, { useState } from 'react';
import { CustomerInquiry } from '../../types';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  Car, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Trash2,
  Filter,
  X
} from 'lucide-react';

interface AdminCustomersProps {
  inquiries: CustomerInquiry[];
  onUpdateStatus: (id: string, status: CustomerInquiry['status'], notes?: string) => void;
  onDeleteInquiry: (id: string) => void;
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({
  inquiries,
  onUpdateStatus,
  onDeleteInquiry,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null);
  const [internalNote, setInternalNote] = useState('');

  const filteredInquiries = inquiries.filter((item) => {
    const matchSearch =
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.carInterest.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleOpenDetail = (item: CustomerInquiry) => {
    setSelectedInquiry(item);
    setInternalNote(item.notes || '');
  };

  const handleSaveNote = () => {
    if (selectedInquiry) {
      onUpdateStatus(selectedInquiry.id, selectedInquiry.status, internalNote);
      setSelectedInquiry({ ...selectedInquiry, notes: internalNote });
    }
  };

  const getStatusBadge = (status: CustomerInquiry['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">
            Chờ liên hệ
          </span>
        );
      case 'contacted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200">
            Đã gọi điện
          </span>
        );
      case 'appointment':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-purple-50 text-purple-700 border border-purple-200">
            Lịch hẹn showroom
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            Hoàn tất
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-gray-100 text-gray-600 border border-gray-200">
            Đã hủy
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17212B]">
          Quản Lý Khách Hàng & Yêu Cầu Tư Vấn
        </h1>
        <p className="text-xs sm:text-sm text-[#69727C] mt-1">
          Theo dõi dữ liệu khách hàng VIP đăng ký tư vấn, đặt lịch lái thử siêu xe và giữ chỗ hợp đồng.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#E2E5E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#69727C] font-bold uppercase tracking-wider block">
              Tổng lượt yêu cầu
            </span>
            <span className="text-2xl font-serif font-bold text-[#17212B] mt-0.5 block">
              {inquiries.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#FAF8F5] text-[#C8A96B] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E2E5E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#69727C] font-bold uppercase tracking-wider block">
              Cần liên hệ lại
            </span>
            <span className="text-2xl font-serif font-bold text-amber-600 mt-0.5 block">
              {inquiries.filter((i) => i.status === 'new').length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E2E5E8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#69727C] font-bold uppercase tracking-wider block">
              Lịch hẹn đã chốt
            </span>
            <span className="text-2xl font-serif font-bold text-emerald-600 mt-0.5 block">
              {inquiries.filter((i) => i.status === 'appointment' || i.status === 'completed').length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E5E8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C95A0]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên khách, SĐT, email, mẫu xe..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-[#17212B] focus:outline-none focus:border-[#C8A96B]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#69727C]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto py-2 px-3 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B] cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="new">Chờ liên hệ</option>
            <option value="contacted">Đã gọi điện</option>
            <option value="appointment">Lịch hẹn showroom</option>
            <option value="completed">Hoàn tất</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-xl border border-[#E2E5E8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F5F0] border-b border-[#E2E5E8] text-[#69727C] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Khách hàng</th>
                <th className="py-3.5 px-4">Liên hệ</th>
                <th className="py-3.5 px-4">Mẫu xe quan tâm</th>
                <th className="py-3.5 px-4">Chi nhánh</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4">Ngày gửi</th>
                <th className="py-3.5 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E5E8]">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#69727C]">
                    Không tìm thấy yêu cầu tư vấn nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-sm text-[#17212B]">
                        {inq.customerName}
                      </div>
                      <span className="text-[10px] text-[#C8A96B] uppercase font-bold">
                        {inq.type === 'test_drive' ? 'Lái thử xe' : inq.type === 'deposit' ? 'Giữ cọc xe' : 'Tư vấn mua xe'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#17212B]">{inq.phone}</div>
                      <div className="text-[11px] text-[#69727C]">{inq.email}</div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#17212B]">
                      <div className="flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-[#C8A96B] shrink-0" />
                        <span className="truncate max-w-[200px]">{inq.carInterest}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[#69727C]">
                      {inq.preferredBranch}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(inq.status)}
                        <select
                          value={inq.status}
                          onChange={(e) => onUpdateStatus(inq.id, e.target.value as CustomerInquiry['status'])}
                          className="text-[10px] py-1 px-1.5 rounded bg-white border border-[#E2E5E8] text-[#17212B] focus:outline-none cursor-pointer"
                        >
                          <option value="new">Chờ liên hệ</option>
                          <option value="contacted">Đã gọi điện</option>
                          <option value="appointment">Lịch hẹn</option>
                          <option value="completed">Hoàn tất</option>
                          <option value="cancelled">Hủy</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-[#69727C]">
                      {new Date(inq.createdAt).toLocaleDateString('vi-VN')}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenDetail(inq)}
                          className="px-2.5 py-1 rounded bg-[#17212B] hover:bg-[#C8A96B] text-white hover:text-[#17212B] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Xem & Ghi chú
                        </button>
                        <button
                          onClick={() => onDeleteInquiry(inq.id)}
                          className="p-1 rounded text-red-500 hover:bg-red-50 cursor-pointer"
                          title="Xóa yêu cầu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail & Internal Notes Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E2E5E8] animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E5E8]">
              <div>
                <span className="text-[10px] text-[#C8A96B] font-bold uppercase tracking-wider block">
                  CHI TIẾT YÊU CẦU KHÁCH HÀNG
                </span>
                <h3 className="text-lg font-serif font-bold text-[#17212B]">
                  {selectedInquiry.customerName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-lg text-[#69727C] hover:text-[#17212B] hover:bg-[#FAF8F5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-[#E2E5E8]">
                <div>
                  <span className="text-[10px] text-[#69727C] block">Số điện thoại</span>
                  <span className="font-bold text-sm text-[#17212B]">{selectedInquiry.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#69727C] block">Email</span>
                  <span className="font-semibold text-xs text-[#17212B] truncate block">{selectedInquiry.email}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#69727C] block">Dòng xe quan tâm</span>
                  <span className="font-semibold text-xs text-[#C8A96B]">{selectedInquiry.carInterest}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#69727C] block">Chi nhánh showroom</span>
                  <span className="font-semibold text-xs text-[#17212B]">{selectedInquiry.preferredBranch}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-[#17212B] block mb-1">
                  Nội dung khách nhắn gửi:
                </span>
                <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs text-[#17212B] italic">
                  "{selectedInquiry.message}"
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17212B] mb-1">
                  Ghi chú nội bộ chuyên viên tư vấn (Nhân viên showroom lưu ý):
                </label>
                <textarea
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  rows={3}
                  placeholder="Ghi lại tiến độ tư vấn, giờ hẹn gọi lại, ưu đãi đề xuất..."
                  className="w-full p-2.5 rounded-lg bg-white border border-[#E2E5E8] text-xs text-[#17212B] focus:outline-none focus:border-[#C8A96B]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E5E8]">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 rounded-lg border border-[#E2E5E8] text-xs font-semibold text-[#69727C] hover:bg-[#FAF8F5] cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveNote}
                className="px-5 py-2 rounded-lg bg-[#17212B] hover:bg-[#C8A96B] text-white hover:text-[#17212B] text-xs font-bold transition-colors cursor-pointer"
              >
                Lưu Ghi Chú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
