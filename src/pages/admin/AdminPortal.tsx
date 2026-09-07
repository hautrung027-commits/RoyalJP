import React, { useState, useEffect } from 'react';
import { AdminTab, AdminUser, Car, CarStatus, CustomerInquiry, StaffPermissions } from '../../types';
import { CarsStorageService } from '../../services/carsStorage';
import { AdminAuthService } from '../../services/adminAuthService';
import { AdminLogin } from './AdminLogin';
import { AdminOverview } from './AdminOverview';
import { AdminCarList } from './AdminCarList';
import { AdminCarForm } from './AdminCarForm';
import { AdminCustomers } from './AdminCustomers';
import { AdminSettings } from './AdminSettings';
import { RoyalJpLogo } from '../../components/RoyalJpLogo';
import { 
  LayoutDashboard, 
  CarFront, 
  PlusCircle, 
  Users, 
  Settings, 
  LogOut, 
  Globe, 
  Menu, 
  X, 
  ShieldCheck,
  Check,
  ShieldAlert,
  Lock
} from 'lucide-react';

interface AdminPortalProps {
  onBackToWebsite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToWebsite }) => {
  // Authentication & Verification State
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab determined by URL hash or permissions
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Mobile sidebar open/close
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data states
  const [cars, setCars] = useState<Car[]>(() => CarsStorageService.getCars());
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => CarsStorageService.getInquiries());

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to read current Admin subroute from Hash or URL
  const getSubRouteFromUrl = (): AdminTab => {
    if (typeof window === 'undefined') return 'overview';
    const hash = window.location.hash.toLowerCase();
    if (hash === '#/admin/cars' || hash === '#admin/cars') return 'cars';
    if (hash === '#/admin/add-car' || hash === '#admin/add-car') return 'add-car';
    if (hash === '#/admin/customers' || hash === '#admin/customers') return 'customers';
    if (hash === '#/admin/settings' || hash === '#admin/settings') return 'settings';
    return 'overview';
  };

  // 1. Initial Authentication Guard & Session Verification
  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      setIsVerifying(true);
      const session = await AdminAuthService.verifyCurrentSession();

      if (!isMounted) return;

      if (session.isAuthenticated && session.user) {
        setAdminUser(session.user);
        
        // Match initial route
        const requestedSub = getSubRouteFromUrl();
        // Check permission for requested tab
        const perms = session.user.permissions;
        if (requestedSub === 'overview' && perms && !perms.system_view_dashboard) {
          // If no dashboard permission, find first allowed
          if (perms.cars_view) setActiveTab('cars');
          else if (perms.customers_view) setActiveTab('customers');
          else if (perms.staff_view) setActiveTab('settings');
          else setActiveTab('cars');
        } else {
          setActiveTab(requestedSub);
        }

        // If URL was #/admin/login, change to #/admin/dashboard
        if (window.location.hash.includes('login')) {
          window.location.hash = '#/admin/dashboard';
        }
      } else {
        setAdminUser(null);
        if (session.isLocked) {
          setLoginError('Tài khoản này đã bị khóa hoặc ngừng hoạt động. Vui lòng liên hệ Quản trị viên.');
        }
        // Force redirect to login route
        if (!window.location.hash.includes('login')) {
          window.location.hash = '#/admin/login';
        }
      }
      setIsVerifying(false);
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen to hash changes inside Admin Portal for deep linking
  useEffect(() => {
    const handleHashChange = () => {
      if (!adminUser) return;
      const sub = getSubRouteFromUrl();
      setActiveTab(sub);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [adminUser]);

  // Sync cars & inquiries updates
  useEffect(() => {
    const handleCarsUpdate = () => {
      setCars(CarsStorageService.getCars());
    };
    const handleInquiriesUpdate = () => {
      setInquiries(CarsStorageService.getInquiries());
    };

    window.addEventListener('royaljpcar-cars-updated', handleCarsUpdate);
    window.addEventListener('royaljpcar-inquiries-updated', handleInquiriesUpdate);

    return () => {
      window.removeEventListener('royaljpcar-cars-updated', handleCarsUpdate);
      window.removeEventListener('royaljpcar-inquiries-updated', handleInquiriesUpdate);
    };
  }, []);

  // Handlers for Login / Logout
  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    setLoginError(null);
    window.location.hash = '#/admin/dashboard';
    setActiveTab('overview');
    showToast(`Chào mừng quản trị viên ${user.fullName} đã đăng nhập thành công.`);
  };

  const handleLogout = async () => {
    if (window.confirm('Quý quản trị viên có chắc chắn muốn đăng xuất khỏi hệ thống ROYAL JPcar?')) {
      await AdminAuthService.logout();
      setAdminUser(null);
      window.location.hash = '#/admin/login';
    }
  };

  // Switch Admin Sub-Tab and synchronize URL hash
  const navigateToTab = (tab: AdminTab) => {
    if (tab === 'add-car') setEditingCar(null);
    setActiveTab(tab);
    setIsSidebarOpen(false);

    const hashMapping: Record<AdminTab, string> = {
      overview: '#/admin/dashboard',
      cars: '#/admin/cars',
      'add-car': '#/admin/add-car',
      customers: '#/admin/customers',
      settings: '#/admin/settings',
    };
    window.location.hash = hashMapping[tab] || '#/admin/dashboard';
  };

 const handleSaveCar = async (carData: Partial<Car>) => {
  try {
    const isEdit = !!carData.id;

    await CarsStorageService.saveCar(carData);

    setEditingCar(null);
    navigateToTab('cars');

    showToast(
      isEdit
        ? 'Đã cập nhật thông tin xe thành công!'
        : 'Đã thêm mẫu xe mới vào showroom!'
    );
  } catch (error) {
    console.error('Lỗi khi lưu xe:', error);

    showToast('Không thể lưu xe lên Firebase!');
  }
};

  const handleDeleteCar = (id: string) => {
    const success = CarsStorageService.deleteCar(id);
    if (success) {
      showToast('Đã xóa mẫu xe khỏi danh sách.');
    }
  };

  const handleUpdateCarStatus = (id: string, status: CarStatus) => {
    CarsStorageService.updateCarStatus(id, status);
    showToast(`Đã chuyển trạng thái xe sang "${status === 'available' ? 'Đang bán' : status === 'reserved' ? 'Đặt cọc' : 'Đã bán'}"`);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    navigateToTab('add-car');
  };

  const handleAddNewCar = () => {
    setEditingCar(null);
    navigateToTab('add-car');
  };

  // Handlers for Inquiries
  const handleUpdateInquiryStatus = (id: string, status: CustomerInquiry['status'], notes?: string) => {
    CarsStorageService.updateInquiryStatus(id, status, notes);
    showToast('Đã cập nhật tiến độ xử lý khách hàng.');
  };

  const handleDeleteInquiry = (id: string) => {
    CarsStorageService.deleteInquiry(id);
    showToast('Đã xóa yêu cầu của khách hàng.');
  };

  // Check Permissions helper
  const perms: StaffPermissions | undefined = adminUser?.permissions;

  // 1. Render Loading Screen during Firebase Auth Verification
  if (isVerifying) {
    return (
      <div className="min-h-screen w-full bg-[#0D1117] text-white flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-black/60 rounded-2xl border border-[#C8A96B]/30 shadow-2xl animate-pulse">
            <RoyalJpLogo variant="badge" className="h-12 w-auto" />
          </div>
          <div className="flex items-center gap-2.5 text-[#C8A96B] text-xs font-semibold uppercase tracking-widest mt-2">
            <div className="w-4 h-4 border-2 border-[#C8A96B] border-t-transparent rounded-full animate-spin" />
            <span>Đang kiểm tra bảo mật & xác thực Firebase Auth...</span>
          </div>
        </div>
      </div>
    );
  }

  // 2. If not authenticated, render Login Guard Screen
  if (!adminUser) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        onBackToWebsite={onBackToWebsite}
        initialError={loginError}
      />
    );
  }

  // 3. Authenticated: Render Full Luxury Admin Panel
  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#17212B] flex flex-col lg:flex-row font-sans relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#17212B] text-white px-4 py-3 rounded-xl shadow-2xl border border-[#C8A96B]/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-6 h-6 rounded-full bg-[#C8A96B] text-[#17212B] flex items-center justify-center font-bold">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* MOBILE TOP BAR */}
      <div className="lg:hidden bg-[#17212B] text-white p-4 flex items-center justify-between border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <RoyalJpLogo variant="badge" className="h-8 w-auto" />
          <div>
            <span className="text-[9px] text-[#C8A96B] font-bold uppercase tracking-wider block">
              PORTAL ADMIN
            </span>
            <span className="text-sm font-serif font-bold text-white">ROYAL JPcar</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBackToWebsite}
            className="p-2 rounded bg-white/10 text-xs text-[#C8A96B]"
            title="Về website khách"
          >
            <Globe className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded bg-white/10 text-white cursor-pointer"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* SIDEBAR (Menu bên trái) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#161B22] text-white border-r border-[#C8A96B]/20 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static shrink-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-1.5 rounded-lg bg-black/60 border border-[#C8A96B]/30 shadow-inner">
                <RoyalJpLogo variant="badge" className="h-9 w-auto" />
              </div>
              <div>
                <span className="text-[9px] tracking-[0.2em] text-[#C8A96B] uppercase font-black block">
                  ADMIN PANEL
                </span>
                <span className="text-base font-serif font-bold text-white tracking-wide">
                  ROYAL JPcar
                </span>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[10px] text-[#8C95A0] mt-1 bg-white/5 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-[#C8A96B]" />
              <span>{adminUser.role}</span>
            </div>
          </div>

          {/* Left Menu Items with Role & Permission Guard */}
          <nav className="p-4 space-y-1.5">
            {/* 1. Tổng quan (Dashboard) */}
            {(!perms || perms.system_view_dashboard) && (
              <button
                type="button"
                onClick={() => navigateToTab('overview')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#C8A96B] text-[#17212B] shadow-md font-bold'
                    : 'text-[#B8C0C7] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Tổng quan</span>
                </div>
              </button>
            )}

            {/* 2. Quản lý xe */}
            {(!perms || perms.cars_view) && (
              <button
                type="button"
                onClick={() => navigateToTab('cars')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'cars'
                    ? 'bg-[#C8A96B] text-[#17212B] shadow-md font-bold'
                    : 'text-[#B8C0C7] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CarFront className="w-4 h-4" />
                  <span>Quản lý xe</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeTab === 'cars' ? 'bg-[#17212B] text-white' : 'bg-white/10 text-[#C8A96B]'
                  }`}
                >
                  {cars.length}
                </span>
              </button>
            )}

            {/* 3. Thêm xe mới */}
            {(!perms || perms.cars_add) && (
              <button
                type="button"
                onClick={() => handleAddNewCar()}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'add-car' && !editingCar
                    ? 'bg-[#C8A96B] text-[#17212B] shadow-md font-bold'
                    : 'text-[#B8C0C7] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm xe mới</span>
                </div>
              </button>
            )}

            {/* 4. Quản lý khách hàng */}
            {(!perms || perms.customers_view) && (
              <button
                type="button"
                onClick={() => navigateToTab('customers')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'customers'
                    ? 'bg-[#C8A96B] text-[#17212B] shadow-md font-bold'
                    : 'text-[#B8C0C7] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>Quản lý khách hàng</span>
                </div>
                {inquiries.length > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeTab === 'customers' ? 'bg-[#17212B] text-white' : 'bg-white/10 text-amber-400'
                    }`}
                  >
                    {inquiries.length}
                  </span>
                )}
              </button>
            )}

            {/* 5. Cài đặt */}
            {(!perms || perms.system_edit_settings || perms.staff_view) && (
              <button
                type="button"
                onClick={() => navigateToTab('settings')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#C8A96B] text-[#17212B] shadow-md font-bold'
                    : 'text-[#B8C0C7] hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4" />
                  <span>Cài đặt</span>
                </div>
              </button>
            )}
          </nav>
        </div>

        {/* Sidebar Footer: Back to Website, User Profile, & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3">
          
          {/* Quick link: View Website Khách Hàng */}
          <button
            type="button"
            onClick={onBackToWebsite}
            className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-[#C8A96B]/20 text-xs text-[#C8A96B] border border-white/10 hover:border-[#C8A96B]/40 transition-colors flex items-center justify-center gap-2 cursor-pointer font-medium"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Xem Website Khách Hàng</span>
          </button>

          {/* Admin User Card */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-black/40 border border-white/5">
            <div className="w-8 h-8 rounded-full bg-[#17212B] border border-[#C8A96B] text-[#C8A96B] font-bold text-xs flex items-center justify-center shrink-0">
              {adminUser.fullName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                {adminUser.fullName}
              </div>
              <div className="text-[10px] text-[#C8A96B] truncate font-medium">
                {adminUser.role} • {adminUser.branch || 'Tokyo'}
              </div>
            </div>
          </div>

          {/* 6. Đăng xuất Firebase */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top Desktop Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-[#E2E5E8] sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#69727C] uppercase tracking-wider">
              {activeTab === 'overview' && 'Bảng Điều Khiển Quản Trị'}
              {activeTab === 'cars' && 'Quản Lý Kho Xe'}
              {activeTab === 'add-car' && (editingCar ? 'Cập Nhật Mẫu Xe' : 'Thêm Xe Mới')}
              {activeTab === 'customers' && 'Khách Hàng & Đặt Lịch Hẹn'}
              {activeTab === 'settings' && 'Cài Đặt Showroom'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Direct jump to customer website */}
            <button
              type="button"
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F7F5F0] border border-[#E2E5E8] text-xs font-bold text-[#17212B] transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>← Trở Về Trang Chủ Website</span>
            </button>

            <div className="h-4 w-px bg-[#E2E5E8]" />

            {/* Notification indicator */}
            <div className="flex items-center gap-2 text-xs text-[#69727C]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Xác thực Firebase trực tuyến</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body with Permission Check */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'overview' && (
            perms && !perms.system_view_dashboard ? (
              <PermissionDenied message="Tài khoản của bạn không được cấp quyền xem Bảng Điều Khiển Tổng Quan." />
            ) : (
              <AdminOverview
                cars={cars}
                inquiries={inquiries}
                onNavigateTab={(tab) => {
                  if (tab === 'add-car') setEditingCar(null);
                  navigateToTab(tab);
                }}
                onEditCar={handleEditCar}
              />
            )
          )}

          {activeTab === 'cars' && (
            perms && !perms.cars_view ? (
              <PermissionDenied message="Tài khoản của bạn không được cấp quyền xem Danh Sách Kho Xe." />
            ) : (
              <AdminCarList
                cars={cars}
                onAddNewCar={handleAddNewCar}
                onEditCar={handleEditCar}
                onDeleteCar={handleDeleteCar}
                onUpdateStatus={handleUpdateCarStatus}
              />
            )
          )}

          {activeTab === 'add-car' && (
            perms && !perms.cars_add && !editingCar ? (
              <PermissionDenied message="Tài khoản của bạn không được cấp quyền Thêm Mới Xe." />
            ) : perms && !perms.cars_edit && editingCar ? (
              <PermissionDenied message="Tài khoản của bạn không được cấp quyền Chỉnh Sửa Thông Tin Xe." />
            ) : (
              <AdminCarForm
                carToEdit={editingCar}
                onSaveCar={handleSaveCar}
                onCancel={() => {
                  setEditingCar(null);
                  navigateToTab('cars');
                }}
              />
            )
          )}

          {activeTab === 'customers' && (
            perms && !perms.customers_view ? (
              <PermissionDenied message="Tài khoản của bạn không được cấp quyền Quản Lý Khách Hàng." />
            ) : (
              <AdminCustomers
                inquiries={inquiries}
                onUpdateStatus={handleUpdateInquiryStatus}
                onDeleteInquiry={handleDeleteInquiry}
              />
            )
          )}

          {activeTab === 'settings' && (
            perms && !perms.system_edit_settings && !perms.staff_view ? (
              <PermissionDenied message="Tài khoản của bạn không được cấp quyền Cài Đặt Showroom & Quản Trị Nhân Viên." />
            ) : (
              <AdminSettings
                adminUser={adminUser}
                onShowToast={showToast}
              />
            )
          )}
        </div>

      </main>

    </div>
  );
};

// Sub-component: Clean Luxury Permission Denied State
const PermissionDenied: React.FC<{ message: string }> = ({ message }) => (
  <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[#E2E5E8] shadow-xs text-center max-w-lg mx-auto my-12">
    <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
      <Lock className="w-7 h-7" />
    </div>
    <h3 className="text-lg font-serif font-bold text-[#17212B] mb-2">
      Bạn Không Có Quyền Truy Cập
    </h3>
    <p className="text-xs text-[#69727C] leading-relaxed mb-6">
      {message} Vui lòng liên hệ Quản trị viên cấp cao (Super Admin) để được cấp quyền mở rộng.
    </p>
    <div className="inline-flex items-center gap-2 text-xs text-[#C8A96B] font-semibold bg-[#FAF8F5] px-4 py-2 rounded-lg border border-[#E2E5E8]">
      <ShieldAlert className="w-4 h-4" />
      <span>Quyền hạn được kiểm soát bởi Firebase Firestore</span>
    </div>
  </div>
);
