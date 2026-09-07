import React, { useState, useMemo } from 'react';
import { Car, CarStatus } from '../../types';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Filter, 
  LayoutGrid, 
  LayoutList, 
  AlertTriangle,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface AdminCarListProps {
  cars: Car[];
  onAddNewCar: () => void;
  onEditCar: (car: Car) => void;
  onDeleteCar: (id: string) => void;
  onUpdateStatus: (id: string, status: CarStatus) => void;
}

export const AdminCarList: React.FC<AdminCarListProps> = ({
  cars,
  onAddNewCar,
  onEditCar,
  onDeleteCar,
  onUpdateStatus,
}) => {
  const safeCars = Array.isArray(cars) ? cars : [];
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);

  // Extract unique brands
  const brands = useMemo(() => {
  const list = new Set<string>();

  safeCars.forEach((c) => {
    if (c.brand) list.add(c.brand);
  });

  return Array.from(list).sort();
}, [safeCars]);

  // Filtered cars
  const filteredCars = useMemo(() => {
  return safeCars.filter((car) => {
      const matchSearch =
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (car.brand && car.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (car.year && car.year.toString().includes(searchTerm));

      const status = car.status || 'available';
      const matchStatus = statusFilter === 'all' || status === statusFilter;
      const matchBrand = brandFilter === 'all' || car.brand === brandFilter;

      return matchSearch && matchStatus && matchBrand;
    });
  }, [safeCars, searchTerm, statusFilter, brandFilter]);

  const confirmDelete = () => {
    if (carToDelete) {
      onDeleteCar(carToDelete.id);
      setCarToDelete(null);
    }
  };

  const getStatusBadge = (status?: CarStatus) => {
    const current = status || 'available';
    switch (current) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Đang bán
          </span>
        );
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Đặt cọc
          </span>
        );
      case 'sold':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-300">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Đã bán
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#17212B]">
            Quản Lý Danh Sách Xe
          </h1>
          <p className="text-xs sm:text-sm text-[#69727C] mt-1">
            Hiển thị toàn bộ {safeCars.length} mẫu xe trong kho showroom. Bạn có thể thêm, sửa, đổi trạng thái hoặc xóa xe.
          </p>
        </div>

        <button
          onClick={onAddNewCar}
          className="px-5 py-2.5 bg-[#17212B] hover:bg-[#C8A96B] text-white hover:text-[#17212B] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Xe Mới</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-white border border-[#E2E5E8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C95A0]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên xe, hãng sản xuất, năm..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-[#17212B] placeholder:text-[#8C95A0] focus:outline-none focus:border-[#C8A96B]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C95A0] hover:text-[#17212B]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns for status & brand */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#69727C]">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B] cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="available">Đang bán</option>
              <option value="reserved">Đặt cọc</option>
              <option value="sold">Đã bán</option>
            </select>
          </div>

          {/* Brand filter */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="py-1.5 px-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B] cursor-pointer"
          >
            <option value="all">Tất cả hãng xe</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* View switcher */}
          <div className="flex items-center bg-[#FAF8F5] border border-[#E2E5E8] rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-[#17212B] shadow-xs' : 'text-[#8C95A0] hover:text-[#17212B]'
              }`}
              title="Xem dạng bảng"
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-[#17212B] shadow-xs' : 'text-[#8C95A0] hover:text-[#17212B]'
              }`}
              title="Xem dạng thẻ"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#69727C]">
        <span>
          Đang hiển thị <strong className="text-[#17212B]">{filteredCars.length}</strong> / {safeCars.length} mẫu xe
        </span>
        {(searchTerm || statusFilter !== 'all' || brandFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setBrandFilter('all');
            }}
            className="text-[#C8A96B] hover:underline font-semibold cursor-pointer"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Main View: Table OR Grid */}
      {filteredCars.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-[#E2E5E8]">
          <AlertTriangle className="w-10 h-10 text-[#C8A96B] mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-serif font-bold text-[#17212B]">
            Không tìm thấy mẫu xe nào phù hợp
          </h3>
          <p className="text-xs text-[#69727C] mt-1">
            Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại bộ lọc.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-[#E2E5E8] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F5F0] border-b border-[#E2E5E8] text-[#69727C] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Hình ảnh</th>
                  <th className="py-3.5 px-4">Tên xe & Hãng</th>
                  <th className="py-3.5 px-4">Giá tiền</th>
                  <th className="py-3.5 px-4">Năm SX</th>
                  <th className="py-3.5 px-4">Số km / Nhiên liệu</th>
                  <th className="py-3.5 px-4">Trạng thái</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5E8]">
                {filteredCars.map((car) => {
                  const currentStatus = car.status || 'available';
                  return (
                    <tr key={car.id} className="hover:bg-[#FAF8F5] transition-colors">
                      {/* Image */}
                      <td className="py-3 px-4">
                        <img
                          src={car.image}
                          alt={car.name}
                          className="w-16 h-11 object-cover rounded-md border border-[#E2E5E8] shadow-2xs"
                        />
                      </td>

                      {/* Name & Brand */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-sm text-[#17212B] hover:text-[#C8A96B] transition-colors">
                          {car.name}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#69727C] mt-0.5">
                          <span className="font-semibold text-[#C8A96B]">{car.brand || 'Bespoke'}</span>
                          <span>•</span>
                          <span>{car.categoryLabel || car.category}</span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-sm text-[#17212B]">
                          {car.price}
                        </div>
                        {car.priceRaw && (
                          <div className="text-[10px] text-[#69727C]">
                            ~{((car.priceRaw * 165) / 1000000000).toFixed(2)} tỷ VNĐ
                          </div>
                        )}
                      </td>

                      {/* Year */}
                      <td className="py-3 px-4 font-semibold text-[#17212B]">
                        {car.year}
                      </td>

                      {/* Mileage & Fuel */}
                      <td className="py-3 px-4 text-[#69727C]">
                        <div>{car.mileage || 'Mới 100%'}</div>
                        <div className="text-[10px] text-[#8C95A0]">{car.fuelType}</div>
                      </td>

                      {/* Status & Quick Change */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(car.status)}
                          <div className="relative inline-block">
                            <select
                              value={currentStatus}
                              onChange={(e) => onUpdateStatus(car.id, e.target.value as CarStatus)}
                              className="text-[10px] py-1 px-1.5 rounded bg-white border border-[#E2E5E8] text-[#17212B] focus:outline-none focus:border-[#C8A96B] cursor-pointer hover:border-[#C8A96B]"
                              title="Thay đổi trạng thái nhanh"
                            >
                              <option value="available">Đang bán</option>
                              <option value="reserved">Đặt cọc</option>
                              <option value="sold">Đã bán</option>
                            </select>
                          </div>
                        </div>
                      </td>

                      {/* Actions: Edit & Delete */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => onEditCar(car)}
                            className="p-1.5 rounded-md hover:bg-[#FAF8F5] text-[#17212B] hover:text-[#C8A96B] border border-transparent hover:border-[#E2E5E8] transition-colors cursor-pointer"
                            title="Chỉnh sửa thông tin xe"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCarToDelete(car)}
                            className="p-1.5 rounded-md hover:bg-red-50 text-red-500 hover:text-red-700 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                            title="Xóa xe khỏi danh sách"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => {
            const currentStatus = car.status || 'available';
            return (
              <div
                key={car.id}
                className="bg-white rounded-xl border border-[#E2E5E8] shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#C8A96B] transition-colors"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#17212B]">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(car.status)}
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                      {car.year}
                    </div>
                  </div>

                  <div className="p-4">
                    <span className="text-[10px] text-[#C8A96B] font-bold uppercase tracking-wider block mb-1">
                      {car.brand || 'Bespoke Edition'}
                    </span>
                    <h3 className="font-bold text-sm text-[#17212B] line-clamp-1 mb-2">
                      {car.name}
                    </h3>

                    <div className="flex items-baseline justify-between pt-2 border-t border-[#E2E5E8]">
                      <div>
                        <span className="text-[10px] text-[#69727C] block">Giá niêm yết</span>
                        <span className="text-base font-serif font-bold text-[#17212B]">
                          {car.price}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#69727C] block">Số ODO</span>
                        <span className="text-xs font-semibold text-[#17212B]">
                          {car.mileage || 'Mới 100%'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-[#E2E5E8] mt-3 flex items-center justify-between gap-2">
                  <select
                    value={currentStatus}
                    onChange={(e) => onUpdateStatus(car.id, e.target.value as CarStatus)}
                    className="text-[11px] py-1.5 px-2 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-[#17212B] focus:outline-none focus:border-[#C8A96B] cursor-pointer flex-1"
                  >
                    <option value="available">Đang bán</option>
                    <option value="reserved">Đặt cọc</option>
                    <option value="sold">Đã bán</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditCar(car)}
                      className="px-3 py-1.5 rounded-lg bg-[#17212B] hover:bg-[#C8A96B] text-white hover:text-[#17212B] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Sửa</span>
                    </button>
                    <button
                      onClick={() => setCarToDelete(car)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 border border-[#E2E5E8] transition-colors cursor-pointer"
                      title="Xóa xe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {carToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E2E5E8] animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 border border-red-200">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-serif font-bold text-[#17212B] mb-2">
              Xác Nhận Xóa Mẫu Xe Này?
            </h3>
            <p className="text-xs text-[#69727C] leading-relaxed mb-4">
              Bạn có chắc chắn muốn xóa xe <strong className="text-[#17212B]">{carToDelete.name}</strong> ({carToDelete.year}) khỏi hệ thống kho? Thao tác này sẽ cập nhật ngay lập tức trên website khách hàng.
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E5E8]">
              <button
                onClick={() => setCarToDelete(null)}
                className="px-4 py-2 rounded-lg border border-[#E2E5E8] text-xs font-semibold text-[#69727C] hover:bg-[#FAF8F5] cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                Đồng Ý Xóa
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
