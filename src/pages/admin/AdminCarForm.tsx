import React, { useState, useEffect } from 'react';
import { Car, CarStatus, CarCategory } from '../../types';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2, 
  Star, 
  Check, 
  ArrowLeft, 
  Plus, 
  Sparkles,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface AdminCarFormProps {
  carToEdit?: Car | null;
  onSaveCar: (carData: Partial<Car>) => void;
  onCancel: () => void;
}

const LUXURY_BRANDS = [
  'Mercedes-Benz',
  'Porsche',
  'Rolls-Royce',
  'Ferrari',
  'Lamborghini',
  'Bentley',
  'Lexus',
  'Range Rover',
  'BMW',
  'Aston Martin',
  'Maserati',
  'Audi',
  'Khác',
];

const FUEL_TYPES = [
  'Xăng (Gasoline)',
  'Plug-in Hybrid (PHEV)',
  'Thuần điện (EV)',
  'Hybrid (HEV)',
  'Diesel',
];

const TRANSMISSIONS = [
  'Tự động 8 cấp PDK',
  'Tự động 9G-TRONIC',
  'Tự động 8 cấp Tiptronic',
  'Tự động 8 cấp ZF',
  'Ly hợp kép 8 cấp F1',
  'Tự động 7 cấp ly hợp kép',
  'Hộp số điện tử E-CVT',
];

export const AdminCarForm: React.FC<AdminCarFormProps> = ({
  carToEdit,
  onSaveCar,
  onCancel,
}) => {
  // Form State
  const [name, setName] = useState(carToEdit?.name || '');
  const [brand, setBrand] = useState(carToEdit?.brand || 'Mercedes-Benz');
  const [customBrand, setCustomBrand] = useState('');
  const [category, setCategory] = useState<Exclude<CarCategory, 'all'>>(carToEdit?.category || 'sedan');
  const [priceYen, setPriceYen] = useState<string>(carToEdit?.priceRaw ? carToEdit.priceRaw.toString() : '25000000');
  const [year, setYear] = useState<number>(carToEdit?.year || 2026);
  const [mileage, setMileage] = useState<string>(carToEdit?.mileage ? carToEdit.mileage.toString() : 'Mới 100% (15 km)');
  const [fuelType, setFuelType] = useState<string>(carToEdit?.fuelType || 'Xăng (Gasoline)');
  const [transmission, setTransmission] = useState<string>(carToEdit?.transmission || 'Tự động 8 cấp PDK');
  const [colorName, setColorName] = useState<string>(carToEdit?.colorName || 'Đen Obsidian');
  const [description, setDescription] = useState<string>(
    carToEdit?.description || 'Tuyệt tác xe sang nhập khẩu nguyên chiếc. Đã qua kiểm định 120 hạng mục tiêu chuẩn Đức và bảo hành chính hãng.'
  );
  const [status, setStatus] = useState<CarStatus>(carToEdit?.status || 'available');

  // Specs
  const [engine, setEngine] = useState<string>(carToEdit?.engine || '4.0L V8 Biturbo');
  const [horsepower, setHorsepower] = useState<string>(carToEdit?.horsepower || '580 HP');
  const [acceleration, setAcceleration] = useState<string>(carToEdit?.acceleration || '3.5s');
  const [topSpeed, setTopSpeed] = useState<string>(carToEdit?.topSpeed || '300 km/h');

  // Images list
  const [images, setImages] = useState<string[]>(() => {
    if (carToEdit?.images && carToEdit.images.length > 0) return carToEdit.images;
    if (carToEdit?.image) return [carToEdit.image];
    return [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop',
    ];
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync if carToEdit changes
  useEffect(() => {
    if (carToEdit) {
      setName(carToEdit.name);
      setBrand(carToEdit.brand || 'Mercedes-Benz');
      setCategory(carToEdit.category || 'sedan');
      setPriceYen(carToEdit.priceRaw ? carToEdit.priceRaw.toString() : '25000000');
      setYear(carToEdit.year || 2026);
      setMileage(carToEdit.mileage ? carToEdit.mileage.toString() : 'Mới 100%');
      setFuelType(carToEdit.fuelType || 'Xăng (Gasoline)');
      setTransmission(carToEdit.transmission || 'Tự động 8 cấp PDK');
      setColorName(carToEdit.colorName || 'Đen Obsidian');
      setDescription(carToEdit.description || '');
      setStatus(carToEdit.status || 'available');
      setEngine(carToEdit.engine || '');
      setHorsepower(carToEdit.horsepower || '');
      setAcceleration(carToEdit.acceleration || '');
      setTopSpeed(carToEdit.topSpeed || '');
      setImages(carToEdit.images && carToEdit.images.length > 0 ? carToEdit.images : [carToEdit.image]);
    }
  }, [carToEdit]);

  // Handle local file uploads (multiple images)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent: ProgressEvent<FileReader>) => {
        if (uploadEvent.target?.result) {
          setImages((prev) => [...prev, uploadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Add image by URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setImages((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    if (images.length <= 1) {
      alert('Mỗi xe cần có ít nhất 1 hình ảnh đại diện.');
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Make cover image
  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const target = prev[index];
      const remaining = prev.filter((_, i) => i !== index);
      return [target, ...remaining];
    });
  };

  // Calculated approximate VND price
  const numPriceYen = parseInt(priceYen.replace(/\D/g, ''), 10) || 0;
  const approxVndBillion = (numPriceYen * 165) / 1000000000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên xe.');
      return;
    }

    if (images.length === 0) {
      setErrorMessage('Vui lòng tải lên hoặc cung cấp ít nhất 1 hình ảnh xe.');
      return;
    }

    setIsSubmitting(true);

    const actualBrand = brand === 'Khác' && customBrand.trim() ? customBrand.trim() : brand;

    const carPayload: Partial<Car> = {
      id: carToEdit ? carToEdit.id : undefined,
      name: name.trim(),
      brand: actualBrand,
      category,
      categoryLabel: category.toUpperCase(),
      priceRaw: numPriceYen,
      price: `¥${numPriceYen.toLocaleString()}`,
      year,
      mileage: mileage.trim(),
      fuelType,
      transmission,
      colorName: colorName.trim(),
      description: description.trim(),
      status,
      image: images[0],
      images: images,
      engine: engine.trim() || 'V8 Twin-Turbo',
      horsepower: horsepower.trim() || '500 HP',
      acceleration: acceleration.trim() || '3.5s',
      topSpeed: topSpeed.trim() || '280 km/h',
    };

    setTimeout(() => {
      onSaveCar(carPayload);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E5E8]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg bg-white hover:bg-[#FAF8F5] border border-[#E2E5E8] text-[#17212B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] text-[#C8A96B] font-bold uppercase tracking-wider block">
              {carToEdit ? 'CẬP NHẬT THÔNG TIN XE' : 'THÊM MẪU XE MỚI'}
            </span>
            <h1 className="text-2xl font-serif font-bold text-[#17212B]">
              {carToEdit ? `Chỉnh Sửa: ${carToEdit.name}` : 'Nhập Xe Mới Vào Showroom'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-[#69727C] hover:text-[#17212B] hover:bg-white rounded-lg border border-[#E2E5E8] transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#17212B] hover:bg-[#C8A96B] text-white hover:text-[#17212B] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Đang lưu...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{carToEdit ? 'Lưu Thay Đổi' : 'Tạo Xe Mới'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Thông tin cơ bản */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2E5E8] shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-[#17212B] pb-2 border-b border-[#E2E5E8]">
            <Sparkles className="w-4 h-4 text-[#C8A96B]" />
            <span>1. Thông Tin Nhận Diện & Định Giá</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Tên xe */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Tên mẫu xe <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Mercedes-Maybach S680 First Class, Porsche 911 GT3 RS..."
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B] placeholder:text-[#8C95A0] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            {/* Hãng xe */}
            <div>
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Hãng xe <span className="text-red-500">*</span>
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B] cursor-pointer"
              >
                {LUXURY_BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              {brand === 'Khác' && (
                <input
                  type="text"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  placeholder="Nhập tên hãng xe..."
                  className="w-full mt-2 px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B]"
                />
              )}
            </div>

            {/* Giá tiền (Yên Nhật) */}
            <div>
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Giá tiền (Yên Nhật ¥) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={priceYen}
                  onChange={(e) => setPriceYen(e.target.value)}
                  placeholder="VD: 38500000"
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-bold text-[#17212B] focus:outline-none focus:border-[#C8A96B]"
                />
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-[#C8A96B] pointer-events-none">
                  ¥ Yên
                </span>
              </div>
              <div className="text-[11px] text-[#69727C] mt-1 font-medium">
                ≈ {approxVndBillion > 0 ? approxVndBillion.toFixed(2) : 0} tỷ VNĐ (tỷ giá ước tính)
              </div>
            </div>

            {/* Năm sản xuất */}
            <div>
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Năm sản xuất <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10) || 2026)}
                min="1990"
                max="2030"
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            {/* Phân khúc / Kiểu dáng */}
            <div>
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Phân khúc kiểu dáng
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Exclude<CarCategory, 'all'>)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B] cursor-pointer"
              >
                <option value="sedan">Sedan Hạng Sang</option>
                <option value="suv">SUV / Crossover</option>
                <option value="mpv">MPV / Chuyên cơ mặt đất</option>
                <option value="hatchback">Coupe / Thể Thao 2 Cửa</option>
                <option value="pickup">Siêu Xe / Hypercar</option>
              </select>
            </div>

            {/* Trạng thái xe */}
            <div className="sm:col-span-2 lg:col-span-3 pt-2">
              <label className="block text-xs font-bold text-[#17212B] mb-2">
                Trạng thái niêm yết <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Đang bán */}
                <label
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    status === 'available'
                      ? 'border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500'
                      : 'border-[#E2E5E8] bg-[#FAF8F5] hover:border-[#C8A96B]'
                  }`}
                >
                  <input
                    type="radio"
                    name="carStatus"
                    value="available"
                    checked={status === 'available'}
                    onChange={() => setStatus('available')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#17212B] block">
                      Đang bán (Available)
                    </span>
                    <span className="text-[10px] text-[#69727C]">
                      Khách hàng có thể xem và đặt lịch lái thử
                    </span>
                  </div>
                </label>

                {/* Đặt cọc */}
                <label
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    status === 'reserved'
                      ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500'
                      : 'border-[#E2E5E8] bg-[#FAF8F5] hover:border-[#C8A96B]'
                  }`}
                >
                  <input
                    type="radio"
                    name="carStatus"
                    value="reserved"
                    checked={status === 'reserved'}
                    onChange={() => setStatus('reserved')}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#17212B] block">
                      Đặt cọc (Reserved)
                    </span>
                    <span className="text-[10px] text-[#69727C]">
                      Đã có khách giữ chỗ, chờ hoàn tất thủ tục
                    </span>
                  </div>
                </label>

                {/* Đã bán */}
                <label
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    status === 'sold'
                      ? 'border-gray-500 bg-gray-100 ring-1 ring-gray-500'
                      : 'border-[#E2E5E8] bg-[#FAF8F5] hover:border-[#C8A96B]'
                  }`}
                >
                  <input
                    type="radio"
                    name="carStatus"
                    value="sold"
                    checked={status === 'sold'}
                    onChange={() => setStatus('sold')}
                    className="text-gray-600 focus:ring-gray-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#17212B] block">
                      Đã bán (Sold)
                    </span>
                    <span className="text-[10px] text-[#69727C]">
                      Đã bàn giao xe cho chủ nhân danh giá
                    </span>
                  </div>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: Thông số kỹ thuật & Vận hành */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2E5E8] shadow-xs space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-[#17212B] pb-2 border-b border-[#E2E5E8]">
            <Sparkles className="w-4 h-4 text-[#C8A96B]" />
            <span>2. Thông Số Vận Hành & Ngoại Thất</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Số km */}
            <div>
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Số km đã đi (ODO) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="VD: Mới 100% (15 km), 1.200 km..."
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            {/* Nhiên liệu */}
            <div>
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Nhiên liệu <span className="text-red-500">*</span>
              </label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B] cursor-pointer"
              >
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Hộp số */}
            <div>
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Hộp số <span className="text-red-500">*</span>
              </label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B] cursor-pointer"
              >
                {TRANSMISSIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Màu xe */}
            <div>
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Màu ngoại thất <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="VD: Đen Obsidian, Trắng Ngọc Trai, Xanh Royal..."
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            {/* Động cơ */}
            <div>
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Động cơ
              </label>
              <input
                type="text"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                placeholder="VD: 4.0L V8 Biturbo, 6.75L V12..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            {/* Công suất */}
            <div>
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Công suất cực đại
              </label>
              <input
                type="text"
                value={horsepower}
                onChange={(e) => setHorsepower(e.target.value)}
                placeholder="VD: 621 HP, 830 HP..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            {/* Mô tả chi tiết */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-[#17212B] mb-1.5">
                Mô tả chi tiết & Điểm nhấn đặc quyền <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Mô tả về trang bị nội thất, vật liệu chế tác thủ công, gói cá nhân hóa Bespoke..."
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-medium text-[#17212B] placeholder:text-[#8C95A0] focus:outline-none focus:border-[#C8A96B]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Upload Nhiều Hình Ảnh */}
        <div className="p-6 rounded-2xl bg-white border border-[#E2E5E8] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E5E8]">
            <div className="flex items-center gap-2 text-sm font-bold text-[#17212B]">
              <ImageIcon className="w-4 h-4 text-[#C8A96B]" />
              <span>3. Quản Lý Album Ảnh Xe (Upload Nhiều Ảnh)</span>
            </div>
            <span className="text-xs font-bold text-[#C8A96B] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#E2E5E8]">
              {images.length} hình ảnh
            </span>
          </div>

          {/* Upload Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Drag & Drop / File Input */}
            <label className="border-2 border-dashed border-[#C8A96B]/50 hover:border-[#C8A96B] bg-[#FAF8F5] hover:bg-[#F7F5F0] p-6 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group">
              <UploadCloud className="w-10 h-10 text-[#C8A96B] group-hover:scale-110 transition-transform mb-2" />
              <span className="text-xs font-bold text-[#17212B]">
                Chọn ảnh từ máy tính (Có thể chọn nhiều ảnh cùng lúc)
              </span>
              <span className="text-[11px] text-[#69727C] mt-1">
                Định dạng hỗ trợ: JPG, PNG, WEBP. Dung lượng tối ưu &lt; 5MB/ảnh.
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Direct URL Input */}
            <div className="p-6 rounded-xl bg-[#FAF8F5] border border-[#E2E5E8] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#17212B] block mb-1">
                  Hoặc thêm qua đường dẫn hình ảnh (URL)
                </span>
                <span className="text-[11px] text-[#69727C]">
                  Dán liên kết ảnh trực tiếp từ Unsplash, Cloudinary hoặc máy chủ riêng.
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#E2E5E8] text-xs text-[#17212B] placeholder:text-[#8C95A0] focus:outline-none focus:border-[#C8A96B]"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 bg-[#17212B] hover:bg-[#C8A96B] text-white hover:text-[#17212B] text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Thêm URL
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnails list */}
          <div>
            <span className="text-xs font-bold text-[#17212B] block mb-2">
              Danh sách ảnh hiện tại (Ảnh đầu tiên là ảnh đại diện chính):
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {images.map((imgUrl, index) => {
                const isCover = index === 0;
                return (
                  <div
                    key={index}
                    className={`relative rounded-xl overflow-hidden border group bg-[#17212B] aspect-[4/3] ${
                      isCover ? 'ring-2 ring-[#C8A96B] border-transparent' : 'border-[#E2E5E8]'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Ảnh xe ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {isCover && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#C8A96B] text-[#17212B] text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Ảnh Chính</span>
                      </div>
                    )}

                    {/* Hover controls */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCoverImage(index)}
                          className="p-1.5 rounded bg-white/90 hover:bg-white text-[#17212B] text-[10px] font-bold cursor-pointer"
                          title="Đặt làm ảnh chính"
                        >
                          <Star className="w-3.5 h-3.5 text-[#C8A96B]" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 rounded bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        title="Xóa ảnh này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E5E8]">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg border border-[#E2E5E8] bg-white text-xs font-semibold text-[#69727C] hover:bg-[#FAF8F5] cursor-pointer"
          >
            Hủy Bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-[#17212B] hover:bg-[#C8A96B] text-white hover:text-[#17212B] font-bold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Đang lưu...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{carToEdit ? 'Cập Nhật Xe' : 'Hoàn Tất Thêm Xe'}</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
