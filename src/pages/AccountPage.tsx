import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  ShieldCheck, 
  Sparkles, 
  Calendar, 
  Heart, 
  Settings, 
  LogOut, 
  Phone, 
  Mail, 
  MapPin, 
  QrCode, 
  CreditCard, 
  Award, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Lock, 
  Car as CarIcon,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  AlertCircle,
  Tag,
  KeyRound,
  Send,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCars } from '../hooks/useCars';
import { Car, UserProfile, UserBooking } from '../types';
import { GmailOtpModal } from '../components/GmailOtpModal';

interface AccountPageProps {
  onNavigate: (pageId: string) => void;
  onSelectCar: (car: Car) => void;
  onShowToast: (msg: string) => void;
  isLoggedIn: boolean;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
  onUpdateUser: (user: UserProfile) => void;
}

// Initial registered accounts for immediate testing and persistence
const INITIAL_DEMO_ACCOUNTS: UserProfile[] = [
  {
    id: 'usr_demo_01',
    fullName: 'Nguyễn Hoàng Long',
    phone: '0988889926',
    email: 'demo@luxe.vn',
    password: 'password123',
    tier: 'Diamond',
    membershipId: 'LX-889926-DIA',
    points: 4850,
    joinedDate: '15/03/2024',
    currentCar: 'Mercedes-Maybach S680 First Class',
    city: 'TP. Hồ Chí Minh',
    address: 'Vinhomes Central Park, Q. Bình Thạnh',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'usr_demo_02',
    fullName: 'Trần Minh Tuấn',
    phone: '0912345678',
    email: 'tuan.tran@gmail.com',
    password: 'password123',
    tier: 'Gold',
    membershipId: 'LX-123456-GLD',
    points: 1200,
    joinedDate: '10/06/2025',
    city: 'Hà Nội',
    address: 'Starlake Tây Hồ Tây, Q. Bắc Từ Liêm',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  }
];

const DEFAULT_BOOKINGS: UserBooking[] = [
  {
    id: 'bk_001',
    type: 'showroom_visit',
    typeLabel: 'Tiếp Đón Sảnh VIP Lounge',
    title: 'Thưởng lãm & Đặt cấu hình Bespoke - Porsche Panamera Turbo',
    date: '10/09/2026',
    time: '14:30',
    location: 'Showroom Q.1, TP. Hồ Chí Minh',
    carModel: 'Porsche Panamera Turbo E-Hybrid',
    status: 'confirmed',
    notes: 'Yêu cầu phòng tiếp đón riêng và chuẩn bị mẫu da nội thất Nappa màu Cognac.'
  },
  {
    id: 'bk_002',
    type: 'maintenance',
    typeLabel: 'Bảo Dưỡng Định Kỳ',
    title: 'Bảo dưỡng cấp 20.000km & Phủ Ceramic bảo vệ sơn',
    date: '25/08/2026',
    time: '09:00',
    location: 'Xưởng Dịch Vụ Chuẩn Châu Âu - Q.7',
    carModel: 'Mercedes-Maybach S680 First Class',
    status: 'completed',
    notes: 'Xe đã được giao nhận tận tư gia đúng giờ.'
  }
];

export const AccountPage: React.FC<AccountPageProps> = ({
  onNavigate,
  onSelectCar,
  onShowToast,
  isLoggedIn,
  currentUser,
  onLoginSuccess,
  onLogout,
  onUpdateUser,
}) => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';
  const carsData = useCars();

  // Accounts database persisted in localStorage
  const [accounts, setAccounts] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('luxe_accounts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_DEMO_ACCOUNTS;
  });

  // Active Auth Tab: 'login' | 'register'
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regCity, setRegCity] = useState('TP. Hồ Chí Minh');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [regError, setRegError] = useState<string | null>(null);

  // Google / Gmail OTP Registration Modal State
  const [isGoogleOtpModalOpen, setIsGoogleOtpModalOpen] = useState(false);
  const [googleModalEmail, setGoogleModalEmail] = useState('iamhakwin@gmail.com');
  const [googleModalName, setGoogleModalName] = useState('');
  const [googleModalPhone, setGoogleModalPhone] = useState('');

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'input' | 'otp' | 'reset'>('input');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);

  // Active Tab when logged in: 'overview' | 'wishlist' | 'bookings' | 'benefits'
  const [activeTab, setActiveTab] = useState<'overview' | 'wishlist' | 'bookings' | 'benefits'>('overview');

  // Saved Cars (Wishlist)
  const [savedCarIds, setSavedCarIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('luxe_saved_cars');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['maybach-s680', 'porsche-panamera', 'range-rover-sv'];
      }
    }
    return ['maybach-s680', 'porsche-panamera', 'range-rover-sv'];
  });

  // User Bookings
  const [bookings, setBookings] = useState<UserBooking[]>(() => {
    const saved = localStorage.getItem('luxe_user_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_BOOKINGS;
      }
    }
    return DEFAULT_BOOKINGS;
  });

  // Profile Edit State
  const [editProfileData, setEditProfileData] = useState({
    fullName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    city: currentUser?.city || 'TP. Hồ Chí Minh',
    address: currentUser?.address || '',
  });

  // Change Password State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [newBookingData, setNewBookingData] = useState({
    type: 'showroom_visit' as UserBooking['type'],
    carModel: carsData[0]?.name || 'Mercedes-Maybach S680 First Class',
    date: '2026-09-15',
    time: '10:00',
    location: 'Showroom Quận 1 - TP. Hồ Chí Minh',
    notes: ''
  });

  // Synchronize state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setEditProfileData({
        fullName: currentUser.fullName,
        phone: currentUser.phone,
        email: currentUser.email,
        city: currentUser.city || 'TP. Hồ Chí Minh',
        address: currentUser.address || '',
      });
    }
  }, [currentUser]);

  // Persist accounts, saved cars, and bookings
  useEffect(() => {
    localStorage.setItem('luxe_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('luxe_saved_cars', JSON.stringify(savedCarIds));
  }, [savedCarIds]);

  useEffect(() => {
    localStorage.setItem('luxe_user_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const trimmedId = loginIdentifier.trim().toLowerCase();
    const trimmedPass = loginPassword.trim();

    if (!trimmedId || !trimmedPass) {
      setLoginError('Vui lòng nhập đầy đủ email/số điện thoại và mật khẩu.');
      return;
    }

    // Match by email or phone
    const matchedAccount = accounts.find(
      (acc) =>
        acc.email.toLowerCase() === trimmedId ||
        acc.phone.replace(/\s+/g, '') === trimmedId.replace(/\s+/g, '')
    );

    if (!matchedAccount) {
      setLoginError('Tài khoản không tồn tại. Vui lòng kiểm tra lại hoặc chuyển sang Đăng ký.');
      return;
    }

    if (matchedAccount.password && matchedAccount.password !== trimmedPass) {
      setLoginError('Mật khẩu không chính xác. Vui lòng thử lại hoặc bấm "Quên mật khẩu?".');
      return;
    }

    // Successful login
    onLoginSuccess(matchedAccount);
    onShowToast(`Đăng nhập thành công! Chào mừng trở lại, ${matchedAccount.fullName}.`);
    setLoginPassword('');
  };

  // Quick Demo Login helper
  const handleQuickDemoLogin = (accountIndex = 0) => {
    const demoAcc = accounts[accountIndex] || INITIAL_DEMO_ACCOUNTS[0];
    setLoginIdentifier(demoAcc.email);
    setLoginPassword(demoAcc.password || 'password123');
    onLoginSuccess(demoAcc);
    onShowToast(`Đã đăng nhập nhanh với tài khoản mẫu: ${demoAcc.fullName}!`);
  };

  // Handle Registration Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    const trimmedName = regFullName.trim();
    const trimmedPhone = regPhone.trim();
    const trimmedEmail = regEmail.trim().toLowerCase();
    const trimmedPass = regPassword.trim();
    const trimmedConfirm = regConfirmPassword.trim();

    if (!trimmedName || !trimmedPhone || !trimmedEmail || !trimmedPass) {
      setRegError('Vui lòng điền đầy đủ các trường thông tin bắt buộc (*).');
      return;
    }

    if (trimmedPass.length < 6) {
      setRegError('Mật khẩu phải có độ dài tối thiểu từ 6 ký tự trở lên.');
      return;
    }

    if (trimmedPass !== trimmedConfirm) {
      setRegError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    if (!agreeTerms) {
      setRegError('Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.');
      return;
    }

    // Check if email or phone already registered
    const existing = accounts.find(
      (acc) =>
        acc.email.toLowerCase() === trimmedEmail ||
        acc.phone.replace(/\s+/g, '') === trimmedPhone.replace(/\s+/g, '')
    );

    if (existing) {
      setRegError('Email hoặc số điện thoại này đã được đăng ký tài khoản. Vui lòng đăng nhập.');
      return;
    }

    // Create new registered account
    const newAccount: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail,
      password: trimmedPass,
      tier: 'Gold',
      membershipId: `LX-${Math.floor(100000 + Math.random() * 900000)}-MEM`,
      points: 500,
      joinedDate: 'Tháng 09/2026',
      city: regCity,
      address: '',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
    };

    const updatedAccounts = [newAccount, ...accounts];
    setAccounts(updatedAccounts);
    onLoginSuccess(newAccount);
    onShowToast(`Đăng ký tài khoản thành công! Chào mừng quý khách ${newAccount.fullName}.`);

    // Reset register fields
    setRegFullName('');
    setRegPhone('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
  };

  // Open Google & Gmail OTP Registration Modal
  const handleOpenGoogleRegister = (customEmail?: string, customName?: string, customPhone?: string) => {
    setGoogleModalEmail(customEmail || regEmail || 'iamhakwin@gmail.com');
    setGoogleModalName(customName || regFullName || 'Khách Hàng Google VIP');
    setGoogleModalPhone(customPhone || regPhone || '0912 888 999');
    setIsGoogleOtpModalOpen(true);
  };

  // Callback on successful Google/Gmail OTP Verification
  const handleGoogleOtpSuccess = (newUser: UserProfile) => {
    const existingIndex = accounts.findIndex(
      (acc) => acc.email.toLowerCase() === newUser.email.toLowerCase()
    );
    let updatedAccounts: UserProfile[];
    if (existingIndex >= 0) {
      updatedAccounts = accounts.map((acc, idx) =>
        idx === existingIndex ? { ...acc, ...newUser } : acc
      );
    } else {
      updatedAccounts = [newUser, ...accounts];
    }
    setAccounts(updatedAccounts);
    onLoginSuccess(newUser);
    onShowToast(`Xác thực Gmail OTP thành công! Chào mừng Quý khách ${newUser.fullName}.`);
    // Clear registration fields
    setRegFullName('');
    setRegPhone('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirmPassword('');
  };

  // Quick Google Login in Login Tab
  const handleQuickGoogleLogin = () => {
    const googleAccount = accounts.find(
      (acc) => acc.authProvider === 'google' || acc.email.toLowerCase().includes('gmail')
    );
    if (googleAccount) {
      onLoginSuccess(googleAccount);
      onShowToast(`Đăng nhập Google thành công! Chào mừng trở lại, ${googleAccount.fullName}.`);
    } else {
      // Prompt OTP registration with Google
      handleOpenGoogleRegister('iamhakwin@gmail.com', 'Khách Hàng Google VIP', '0912 888 999');
    }
  };

  // Forgot password flow
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    const trimmed = forgotIdentifier.trim().toLowerCase();
    if (!trimmed) {
      setForgotError('Vui lòng nhập Email hoặc Số điện thoại đã đăng ký.');
      return;
    }

    const matched = accounts.find(
      (acc) =>
        acc.email.toLowerCase() === trimmed ||
        acc.phone.replace(/\s+/g, '') === trimmed.replace(/\s+/g, '')
    );

    if (!matched) {
      setForgotError('Không tìm thấy tài khoản với thông tin này trong hệ thống.');
      return;
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setForgotStep('otp');
    onShowToast(`Mã xác thực OTP đã được gửi: ${randomOtp}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (forgotOtp.trim() !== generatedOtp) {
      setForgotError('Mã OTP không chính xác. Vui lòng thử lại.');
      return;
    }
    setForgotStep('reset');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (newPassword.trim().length < 6) {
      setForgotError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    const trimmed = forgotIdentifier.trim().toLowerCase();
    const updated = accounts.map((acc) => {
      if (
        acc.email.toLowerCase() === trimmed ||
        acc.phone.replace(/\s+/g, '') === trimmed.replace(/\s+/g, '')
      ) {
        return { ...acc, password: newPassword.trim() };
      }
      return acc;
    });

    setAccounts(updated);
    setIsForgotModalOpen(false);
    setForgotStep('input');
    setForgotIdentifier('');
    setForgotOtp('');
    setNewPassword('');
    onShowToast('Đổi mật khẩu thành công! Quý khách có thể đăng nhập với mật khẩu mới.');
  };

  // Update profile
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updatedUser: UserProfile = {
      ...currentUser,
      fullName: editProfileData.fullName,
      phone: editProfileData.phone,
      email: editProfileData.email,
      city: editProfileData.city,
      address: editProfileData.address,
    };

    onUpdateUser(updatedUser);

    // Update in accounts array
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === updatedUser.id ? updatedUser : acc))
    );

    onShowToast('Thông tin tài khoản đã được cập nhật thành công.');
  };

  // Update Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (currentUser.password && passwordData.oldPassword !== currentUser.password) {
      onShowToast('Mật khẩu hiện tại không chính xác.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      onShowToast('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      onShowToast('Mật khẩu mới nhập lại không khớp.');
      return;
    }

    const updatedUser: UserProfile = {
      ...currentUser,
      password: passwordData.newPassword,
    };

    onUpdateUser(updatedUser);
    setAccounts((prev) =>
      prev.map((acc) => (acc.id === updatedUser.id ? updatedUser : acc))
    );

    setPasswordData({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    onShowToast('Đã đổi mật khẩu thành công!');
  };

  // Wishlist actions
  const savedCars = carsData.filter((c) => savedCarIds.includes(c.id));

  const handleRemoveSavedCar = (carId: string) => {
    setSavedCarIds((prev) => prev.filter((id) => id !== carId));
    onShowToast('Đã xóa xe khỏi danh sách quan tâm.');
  };

  // Booking actions
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabelMap: Record<UserBooking['type'], string> = {
      showroom_visit: 'Tiếp Đón Sảnh VIP Lounge',
      maintenance: 'Bảo Dưỡng & Chăm Sóc Xe',
      appraisal: 'Thẩm Định Định Giá Xe Sang',
      consultation: 'Tư Vấn Cấu Hình Bespoke'
    };

    const newBooking: UserBooking = {
      id: `bk_${Date.now()}`,
      type: newBookingData.type,
      typeLabel: typeLabelMap[newBookingData.type],
      title: `${typeLabelMap[newBookingData.type]} - ${newBookingData.carModel}`,
      date: newBookingData.date,
      time: newBookingData.time,
      location: newBookingData.location,
      carModel: newBookingData.carModel,
      status: 'pending',
      notes: newBookingData.notes
    };

    setBookings((prev) => [newBooking, ...prev]);
    setIsBookingModalOpen(false);
    onShowToast('Đã tạo lịch hẹn tư vấn thành công! Chuyên viên chăm sóc khách hàng sẽ liên hệ xác nhận trong 15 phút.');
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    onShowToast('Đã hủy lịch hẹn tư vấn.');
  };

  return (
    <div className="w-full pt-20 bg-[#F7F5F0] min-h-screen">
      
      {/* Header Breadcrumbs */}
      <div className="bg-white border-b border-[#E2E5E8] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <nav className="flex items-center gap-2 text-xs text-[#69727C] mb-2.5">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#C8A96B] transition-colors cursor-pointer"
            >
              {t('nav.home')}
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#17212B] font-semibold">
              {isJa ? 'マイアカウント' : 'Tài khoản khách hàng'}
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-[#C8A96B] uppercase font-bold tracking-[0.25em] block mb-1">
                royalJPcar PORTAL
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#17212B]">
                {isLoggedIn && currentUser
                  ? (isJa ? `会員様: ${currentUser.fullName}` : `Tài Khoản: ${currentUser.fullName}`)
                  : (isJa ? 'ログイン & 新規会員登録' : 'Đăng Nhập & Đăng Ký Tài Khoản')}
              </h1>
            </div>

            {isLoggedIn && currentUser && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-sm text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto bg-white shadow-xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{isJa ? 'ログアウト' : 'Đăng Xuất'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        {!isLoggedIn || !currentUser ? (
          /* ========================================================================= */
          /* 1. GUEST AUTHENTICATION VIEW: ĐĂNG NHẬP & ĐĂNG KÝ CHO KHÁCH HÀNG */
          /* ========================================================================= */
          <div className="max-w-xl mx-auto">
            
            {/* Card Container */}
            <div className="bg-white rounded-2xl border border-[#E2E5E8] shadow-sm overflow-hidden">
              
              {/* Header Tab Switcher: ĐĂNG NHẬP vs ĐĂNG KÝ */}
              <div className="grid grid-cols-2 border-b border-[#E2E5E8] bg-[#FAF8F5]">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login');
                    setLoginError(null);
                  }}
                  className={`py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    authTab === 'login'
                      ? 'bg-white text-[#17212B] border-b-2 border-[#C8A96B] shadow-xs'
                      : 'text-[#69727C] hover:text-[#17212B]'
                  }`}
                >
                  <LogIn className="w-4 h-4 text-[#C8A96B]" />
                  <span>{isJa ? 'ログイン' : 'Đăng Nhập'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('register');
                    setRegError(null);
                  }}
                  className={`py-4 px-6 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    authTab === 'register'
                      ? 'bg-white text-[#17212B] border-b-2 border-[#C8A96B] shadow-xs'
                      : 'text-[#69727C] hover:text-[#17212B]'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-[#C8A96B]" />
                  <span>{isJa ? '新規会員登録' : 'Đăng Ký Tài Khoản'}</span>
                </button>
              </div>

              {/* Form Content Body */}
              <div className="p-6 sm:p-8">
                
                {/* -------------------- TAB 1: FORM ĐĂNG NHẬP -------------------- */}
                {authTab === 'login' ? (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-xl font-serif font-bold text-[#17212B]">
                        {isJa ? '会員ログイン' : 'Đăng Nhập Vào Hệ Thống'}
                      </h2>
                      <p className="text-xs text-[#69727C] mt-1 leading-relaxed">
                        {isJa
                          ? '保存したお気に入り車両の閲覧、試乗・ご商談予約の管理、会員限定の特別優遇をご利用いただけます。'
                          : 'Đăng nhập để xem danh sách xe đã lưu, quản lý lịch hẹn tư vấn và nhận ưu đãi độc quyền.'}
                      </p>
                    </div>

                    {loginError && (
                      <div className="mb-5 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#17212B] mb-1.5">
                          {isJa ? 'メールアドレス または 電話番号 *' : 'Địa chỉ Email hoặc Số điện thoại *'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={loginIdentifier}
                            onChange={(e) => setLoginIdentifier(e.target.value)}
                            placeholder={isJa ? '例: demo@luxe-japan.com または 090-1234-5678' : 'Ví dụ: demo@luxe.vn hoặc 0988 889 926'}
                            className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B] bg-[#FAF8F5]/50"
                          />
                          <Mail className="w-4 h-4 text-[#8C95A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold text-[#17212B] mb-1.5">
                          <span>{isJa ? 'パスワード *' : 'Mật khẩu *'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsForgotModalOpen(true);
                              setForgotError(null);
                            }}
                            className="text-[#C8A96B] hover:underline font-normal cursor-pointer"
                          >
                            {isJa ? 'パスワードをお忘れですか？' : 'Quên mật khẩu?'}
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showLoginPassword ? 'text' : 'password'}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder={isJa ? 'パスワードを入力...' : 'Nhập mật khẩu...'}
                            className="w-full pl-10 pr-10 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B] bg-[#FAF8F5]/50"
                          />
                          <Lock className="w-4 h-4 text-[#8C95A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C95A0] hover:text-[#17212B] cursor-pointer"
                          >
                            {showLoginPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center gap-2 cursor-pointer text-[#69727C]">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="accent-[#C8A96B] rounded w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>{isJa ? 'ログイン状態を保持する' : 'Ghi nhớ đăng nhập'}</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 rounded-sm bg-[#17212B] hover:bg-[#C8A96B] text-white font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 mt-2"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>{isJa ? '今すぐログイン' : 'Đăng Nhập Ngay'}</span>
                      </button>

                      {/* Quick Google Sign In */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleQuickGoogleLogin}
                          className="w-full py-2.5 px-4 rounded-sm bg-white hover:bg-[#FAF8F5] border border-[#E2E5E8] hover:border-[#C8A96B] text-[#17212B] font-semibold text-xs transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2.5"
                        >
                          <span className="font-bold text-xs font-sans">
                            <span className="text-[#4285F4]">G</span>
                            <span className="text-[#EA4335]">o</span>
                            <span className="text-[#FBBC05]">o</span>
                            <span className="text-[#34A853]">g</span>
                            <span className="text-[#EA4335]">l</span>
                            <span className="text-[#4285F4]">e</span>
                          </span>
                          <span>{isJa ? 'Googleアカウントでクイックログイン' : 'Đăng Nhập Nhanh Bằng Tài Khoản Google'}</span>
                        </button>
                      </div>
                    </form>

                    {/* Quick Demo Login Box */}
                    <div className="mt-6 p-4 rounded-xl bg-[#F7F5F0] border border-[#E2E5E8]/80 text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-[#17212B] flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-[#C8A96B]" />
                          {isJa ? 'クイック体験アカウント:' : 'Tài khoản trải nghiệm nhanh:'}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-[#8C95A0] bg-white px-2 py-0.5 rounded border border-[#E2E5E8]">
                          {isJa ? 'お試し用' : 'Demo sẵn'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#69727C] mb-2.5">
                        {isJa ? 'アカウント: ' : 'Tài khoản: '}<span className="font-mono text-[#17212B] font-bold">demo@luxe.vn</span> • {isJa ? 'パスワード: ' : 'Mật khẩu: '}<span className="font-mono text-[#17212B] font-bold">password123</span>
                      </p>
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin(0)}
                        className="w-full py-2 bg-white hover:bg-[#C8A96B] hover:text-white border border-[#C8A96B] text-[#17212B] font-bold text-[11px] uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>{isJa ? '⚡ この体験アカウントで自動ログイン' : '⚡ Điền & Đăng Nhập Tài Khoản Mẫu Này'}</span>
                      </button>
                    </div>

                    {/* Switch to Register link */}
                    <div className="mt-6 pt-5 border-t border-[#E2E5E8] text-center text-xs text-[#69727C]">
                      {isJa ? 'まだアカウントをお持ちではありませんか？ ' : 'Chưa có tài khoản tại royalJPcar Showroom? '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('register');
                          setLoginError(null);
                        }}
                        className="text-[#C8A96B] font-bold hover:underline cursor-pointer"
                      >
                        {isJa ? '新規会員登録はこちら' : 'Đăng ký tài khoản mới ngay'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* -------------------- TAB 2: FORM ĐĂNG KÝ TÀI KHOẢN -------------------- */
                  <div>
                    <div className="mb-6">
                      <h2 className="text-xl font-serif font-bold text-[#17212B]">
                        {isJa ? '新規会員アカウントの作成' : 'Tạo Tài Khoản Khách Hàng Mới'}
                      </h2>
                      <p className="text-xs text-[#69727C] mt-1 leading-relaxed">
                        {isJa
                          ? '1分で簡単登録。お気に入り車両の保管や試乗優先予約、会員限定イベントへの招待をご利用いただけます。'
                          : 'Đăng ký thông tin nhanh gọn trong 1 phút để lưu giữ mẫu xe yêu thích và nhận hỗ trợ tận tình.'}
                      </p>
                    </div>

                    {/* OPTION 1: QUICK GOOGLE REGISTRATION (WITH GMAIL OTP) */}
                    <div className="mb-6 p-4 rounded-xl border border-[#C8A96B]/50 bg-linear-to-r from-[#FAF8F5] via-white to-[#F7F5F0] shadow-xs">
                      <div className="flex items-start gap-3 mb-3.5">
                        <div className="w-10 h-10 rounded-full bg-white border border-[#E2E5E8] flex items-center justify-center shadow-xs shrink-0 font-bold font-sans text-xs">
                          <span className="text-[#4285F4]">G</span>
                          <span className="text-[#EA4335]">o</span>
                          <span className="text-[#FBBC05]">o</span>
                          <span className="text-[#34A853]">g</span>
                          <span className="text-[#EA4335]">l</span>
                          <span className="text-[#4285F4]">e</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-serif font-bold text-sm text-[#17212B]">
                              {isJa ? 'Googleアカウントで簡単登録' : 'Đăng Ký Tài Khoản Bằng Google'}
                            </h3>
                            <span className="text-[10px] bg-[#EA4335]/10 text-[#EA4335] font-bold px-2 py-0.5 rounded font-sans uppercase tracking-wider">
                              {isJa ? 'Gmail OTP認証' : 'Nhận mã OTP qua Gmail'}
                            </span>
                          </div>
                          <p className="text-xs text-[#69727C] mt-1 leading-relaxed">
                            {isJa
                              ? 'Googleアカウント情報を利用して迅速に会員登録。本人確認のためGmail受信トレイへ6桁の認証コード（OTP）が送信されます。'
                              : 'Đăng ký siêu tốc bằng tài khoản Google. Sau khi chọn tài khoản, mã xác thực OTP 6 chữ số sẽ được gửi trực tiếp về Hộp thư đến Gmail của quý khách để xác nhận danh tính an toàn.'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenGoogleRegister()}
                        className="w-full py-3 px-4 rounded-sm bg-[#17212B] hover:bg-[#C8A96B] text-white hover:text-[#17212B] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2.5"
                      >
                        <Mail className="w-4 h-4 text-[#EA4335]" />
                        <span>{isJa ? 'Googleアカウントで登録 & Gmail OTPを受信' : 'Đăng Ký Bằng Tài Khoản Google & Nhận Mã OTP Gmail'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="relative flex py-2 items-center mb-6">
                      <div className="flex-grow border-t border-[#E2E5E8]"></div>
                      <span className="shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-[#8C95A0] bg-white px-2">
                        {isJa ? 'またはフォームを入力して登録' : 'Hoặc điền biểu mẫu truyền thống'}
                      </span>
                      <div className="flex-grow border-t border-[#E2E5E8]"></div>
                    </div>

                    {regError && (
                      <div className="mb-5 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{regError}</span>
                      </div>
                    )}

                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#17212B] mb-1.5">
                          {isJa ? 'お名前（漢字 / ローマ字）*' : 'Họ và tên quý khách *'}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={regFullName}
                            onChange={(e) => setRegFullName(e.target.value)}
                            placeholder={isJa ? '例: 山田 太郎 / Tanaka Taro' : 'Ví dụ: Trần Quốc Hưng'}
                            className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B] bg-[#FAF8F5]/50"
                          />
                          <User className="w-4 h-4 text-[#8C95A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#17212B] mb-1.5">
                            {isJa ? '携帯電話番号 *' : 'Số điện thoại di động *'}
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              required
                              value={regPhone}
                              onChange={(e) => setRegPhone(e.target.value)}
                              placeholder={isJa ? '090-1234-5678' : '0912 345 678'}
                              className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B] bg-[#FAF8F5]/50"
                            />
                            <Phone className="w-4 h-4 text-[#8C95A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#17212B] mb-1.5">
                            {isJa ? 'メールアドレス *' : 'Địa chỉ Email *'}
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              required
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              placeholder={isJa ? 'yamada@example.com' : 'hung.tran@gmail.com'}
                              className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B] bg-[#FAF8F5]/50"
                            />
                            <Mail className="w-4 h-4 text-[#8C95A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#17212B] mb-1.5">
                            {isJa ? 'パスワード設定 *' : 'Mật khẩu khởi tạo *'}
                          </label>
                          <div className="relative">
                            <input
                              type={showRegPassword ? 'text' : 'password'}
                              required
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              placeholder={isJa ? '6文字以上' : 'Tối thiểu 6 ký tự'}
                              className="w-full pl-10 pr-10 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B] bg-[#FAF8F5]/50"
                            />
                            <Lock className="w-4 h-4 text-[#8C95A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <button
                              type="button"
                              onClick={() => setShowRegPassword(!showRegPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C95A0] hover:text-[#17212B] cursor-pointer"
                            >
                              {showRegPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#17212B] mb-1.5">
                            {isJa ? 'パスワード再入力 *' : 'Nhập lại mật khẩu *'}
                          </label>
                          <div className="relative">
                            <input
                              type={showRegPassword ? 'text' : 'password'}
                              required
                              value={regConfirmPassword}
                              onChange={(e) => setRegConfirmPassword(e.target.value)}
                              placeholder={isJa ? '上記のパスワードと一致させてください' : 'Khớp với mật khẩu trên'}
                              className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B] bg-[#FAF8F5]/50"
                            />
                            <Lock className="w-4 h-4 text-[#8C95A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#17212B] mb-1.5">
                          {isJa ? 'お住まいの地域 / 都道府県' : 'Tỉnh / Thành phố sinh sống'}
                        </label>
                        <select
                          value={regCity}
                          onChange={(e) => setRegCity(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B] bg-[#FAF8F5]/50"
                        >
                          {isJa ? (
                            <>
                              <option value="東京都">東京都 (Tokyo)</option>
                              <option value="神奈川県">神奈川県 (Kanagawa)</option>
                              <option value="大阪府">大阪府 (Osaka)</option>
                              <option value="愛知県">愛知県 (Aichi)</option>
                              <option value="福岡県">福岡県 (Fukuoka)</option>
                              <option value="埼玉県">埼玉県 (Saitama)</option>
                              <option value="千葉県">千葉県 (Chiba)</option>
                              <option value="京都府">京都府 (Kyoto)</option>
                              <option value="兵庫県">兵庫県 (Hyogo)</option>
                              <option value="北海道">北海道 (Hokkaido)</option>
                              <option value="その他">その他 (Other regions)</option>
                            </>
                          ) : (
                            <>
                              <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                              <option value="Hà Nội">Hà Nội</option>
                              <option value="Đà Nẵng">Đà Nẵng</option>
                              <option value="Hải Phòng">Hải Phòng</option>
                              <option value="Quảng Ninh">Quảng Ninh</option>
                              <option value="Bình Dương">Bình Dương</option>
                              <option value="Đồng Nai">Đồng Nai</option>
                              <option value="Cần Thơ">Cần Thơ</option>
                              <option value="Khác">Tỉnh thành khác</option>
                            </>
                          )}
                        </select>
                      </div>

                      <div className="pt-1">
                        <label className="flex items-start gap-2 cursor-pointer text-xs text-[#69727C]">
                          <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            className="accent-[#C8A96B] rounded w-4 h-4 mt-0.5 cursor-pointer"
                          />
                          <span>
                            {isJa ? (
                              <>
                                royalJPcarの{' '}
                                <span className="text-[#17212B] font-semibold">会員利用規約</span>{' '}
                                および{' '}
                                <span className="text-[#17212B] font-semibold">プライバシーポリシー</span>{' '}
                                に同意します。
                              </>
                            ) : (
                              <>
                                Tôi đồng ý với{' '}
                                <span className="text-[#17212B] font-semibold">Quy định thành viên</span>{' '}
                                và{' '}
                                <span className="text-[#17212B] font-semibold">Chính sách bảo mật</span>{' '}
                                của royalJPcar Showroom.
                              </>
                            )}
                          </span>
                        </label>
                      </div>

                      <div className="space-y-2.5 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (!regFullName.trim() || !regEmail.trim()) {
                              setRegError(isJa ? '氏名とGmailアドレスを入力してOTP認証コードを受信してください。' : 'Vui lòng điền Họ và tên cùng Địa chỉ Gmail để nhận mã xác thực OTP.');
                              return;
                            }
                            handleOpenGoogleRegister(regEmail, regFullName, regPhone);
                          }}
                          className="w-full py-3 rounded-sm bg-[#17212B] hover:bg-[#C8A96B] text-white hover:text-[#17212B] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                        >
                          <Mail className="w-4 h-4 text-[#EA4335]" />
                          <span>{isJa ? 'Gmailへ認証コード(OTP)を送信して登録' : 'Gửi Mã OTP Về Gmail Để Kích Hoạt'}</span>
                        </button>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-sm bg-white hover:bg-[#FAF8F5] border border-[#E2E5E8] hover:border-[#C8A96B] text-[#17212B] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-2xs flex items-center justify-center gap-2"
                        >
                          <UserPlus className="w-4 h-4 text-[#C8A96B]" />
                          <span>{isJa ? '通常登録でアカウント作成' : 'Tạo Tài Khoản Tiêu Chuẩn Trực Tiếp'}</span>
                        </button>
                      </div>
                    </form>

                    {/* Switch to Login link */}
                    <div className="mt-6 pt-5 border-t border-[#E2E5E8] text-center text-xs text-[#69727C]">
                      {isJa ? '既にアカウントをお持ちですか？ ' : 'Đã có tài khoản tại royalJPcar Showroom? '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('login');
                          setRegError(null);
                        }}
                        className="text-[#C8A96B] font-bold hover:underline cursor-pointer"
                      >
                        {isJa ? '今すぐログイン' : 'Đăng nhập ngay'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Security Guarantee Strip */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#69727C]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#C8A96B]" />
                {isJa ? '256-bit SSL暗号化通信保護' : 'Bảo mật mã hóa 256-bit'}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C8A96B]" />
                {isJa ? '個人情報の第三者提供なし' : 'Không chia sẻ thông tin cho bên thứ 3'}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#C8A96B]" />
                {isJa ? 'カスタマーサポート: 0120-88-8899' : 'Hỗ trợ 24/7: 1800 8899'}
              </span>
            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* 2. LOGGED IN CUSTOMER DASHBOARD: QUẢN LÝ TÀI KHOẢN KHÁCH HÀNG */
          /* ========================================================================= */
          <div className="space-y-8">
            
            {/* Header User Card */}
            <div className="bg-[#17212B] text-white rounded-2xl p-6 sm:p-8 border border-white/10 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8A96B]/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                {/* Avatar & User Details */}
                <div className="md:col-span-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <div className="relative">
                    <img
                      src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'}
                      alt={currentUser.fullName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-[#C8A96B] shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 p-1.5 bg-[#C8A96B] text-[#17212B] rounded-full shadow-sm">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                        {currentUser.fullName}
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#C8A96B] text-[#17212B] text-[10px] font-bold uppercase tracking-wider">
                        Hạng {currentUser.tier}
                      </span>
                    </div>

                    <p className="text-xs text-[#B8C0C7]">
                      Mã khách hàng: <span className="font-mono text-white font-bold">{currentUser.membershipId}</span> • Tham gia từ: {currentUser.joinedDate}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-[#B8C0C7]">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#C8A96B]" />
                        {currentUser.phone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#C8A96B]" />
                        {currentUser.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C8A96B]" />
                        {currentUser.city || 'TP. Hồ Chí Minh'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points & Quick Actions */}
                <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                  <div className="text-center md:text-right">
                    <span className="text-[10px] uppercase tracking-wider text-[#B8C0C7]">
                      Điểm tích lũy dịch vụ
                    </span>
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-[#C8A96B]">
                      {currentUser.points.toLocaleString('vi-VN')} <span className="text-xs font-sans text-white">Pts</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <button
                      onClick={() => setIsBookingModalOpen(true)}
                      className="w-full sm:w-auto px-4 py-2 bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Đặt Lịch Tư Vấn</span>
                    </button>
                    <button
                      onClick={onLogout}
                      className="px-3 py-2 border border-white/20 hover:border-red-400 hover:text-red-400 text-white rounded-sm text-xs font-semibold transition-colors cursor-pointer"
                      title="Đăng xuất khỏi tài khoản"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#E2E5E8] pb-1">
              {[
                { id: 'overview', label: 'Thông Tin Cá Nhân & Bảo Mật', icon: Settings },
                { id: 'wishlist', label: `Xe Đã Lưu (${savedCars.length})`, icon: Heart },
                { id: 'bookings', label: `Lịch Hẹn Tư Vấn (${bookings.length})`, icon: Calendar },
                { id: 'benefits', label: 'Ưu Đãi Của Tôi', icon: Tag },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all rounded-t-sm cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#17212B] border-t-2 border-t-[#C8A96B] border-x border-[#E2E5E8] -mb-[1px]'
                        : 'text-[#69727C] hover:text-[#17212B] hover:bg-white/50'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#C8A96B]' : ''}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Profile and Settings */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Edit Profile Form */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E5E8] p-6 sm:p-8 shadow-xs">
                  <h3 className="text-lg font-serif font-bold text-[#17212B] mb-1">
                    Cập Nhật Thông Tin Cá Nhân
                  </h3>
                  <p className="text-xs text-[#69727C] mb-6">
                    Quý khách có thể thay đổi số điện thoại, địa chỉ và thông tin giao dịch tại đây.
                  </p>

                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#17212B] mb-1">
                        Họ và tên quý khách
                      </label>
                      <input
                        type="text"
                        value={editProfileData.fullName}
                        onChange={(e) => setEditProfileData({ ...editProfileData, fullName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#17212B] mb-1">
                          Số điện thoại liên hệ
                        </label>
                        <input
                          type="tel"
                          value={editProfileData.phone}
                          onChange={(e) => setEditProfileData({ ...editProfileData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#17212B] mb-1">
                          Địa chỉ Email
                        </label>
                        <input
                          type="email"
                          value={editProfileData.email}
                          onChange={(e) => setEditProfileData({ ...editProfileData, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#17212B] mb-1">
                          Tỉnh / Thành phố
                        </label>
                        <input
                          type="text"
                          value={editProfileData.city}
                          onChange={(e) => setEditProfileData({ ...editProfileData, city: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#17212B] mb-1">
                          Địa chỉ tư gia / cơ quan
                        </label>
                        <input
                          type="text"
                          value={editProfileData.address}
                          onChange={(e) => setEditProfileData({ ...editProfileData, address: e.target.value })}
                          placeholder="Số nhà, đường, quận/huyện..."
                          className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#17212B] hover:bg-[#C8A96B] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                      >
                        Lưu Thay Đổi Thông Tin
                      </button>
                    </div>
                  </form>
                </div>

                {/* Change Password & Account Card */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Password Form */}
                  <div className="bg-white rounded-2xl border border-[#E2E5E8] p-6 sm:p-8 shadow-xs">
                    <h3 className="text-lg font-serif font-bold text-[#17212B] mb-1">
                      Đổi Mật Khẩu
                    </h3>
                    <p className="text-xs text-[#69727C] mb-4">
                      Bảo vệ an toàn tài khoản với mật khẩu tối thiểu 6 ký tự.
                    </p>

                    <form onSubmit={handleChangePassword} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-[#17212B] mb-1">
                          Mật khẩu hiện tại
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordData.oldPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full px-4 py-2 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#17212B] mb-1">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Tối thiểu 6 ký tự"
                          className="w-full px-4 py-2 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#17212B] mb-1">
                          Nhập lại mật khẩu mới
                        </label>
                        <input
                          type="password"
                          required
                          value={passwordData.confirmNewPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                          placeholder="••••••••"
                          className="w-full px-4 py-2 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                      >
                        Cập Nhật Mật Khẩu
                      </button>
                    </form>
                  </div>

                  {/* Digital Membership Pass preview */}
                  <div className="bg-gradient-to-br from-[#17212B] to-[#243343] text-white p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] tracking-widest text-[#C8A96B] uppercase font-bold">
                        royalJPcar DIGITAL PASS
                      </span>
                      <QrCode className="w-5 h-5 text-[#C8A96B]" />
                    </div>

                    <div className="font-mono text-sm tracking-widest text-[#E2E5E8] mb-4">
                      {currentUser.membershipId}
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#8C95A0] block">
                          Chủ thẻ
                        </span>
                        <span className="text-sm font-bold">{currentUser.fullName}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#C8A96B] text-[#17212B] text-[10px] font-bold uppercase">
                        {currentUser.tier}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Saved Cars (Wishlist) */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#17212B]">
                      Mẫu Xe Quan Tâm & Đã Lưu
                    </h3>
                    <p className="text-xs text-[#69727C]">
                      Danh sách các mẫu xe quý khách đã quan tâm để theo dõi giá và thông số kỹ thuật.
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('cars')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8A96B] hover:text-[#17212B] uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>Khám phá thêm dòng xe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {savedCars.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#E2E5E8] p-12 text-center">
                    <Heart className="w-12 h-12 text-[#E2E5E8] mx-auto mb-3" />
                    <h4 className="text-base font-bold text-[#17212B] mb-1">
                      Chưa Có Mẫu Xe Nào Được Lưu
                    </h4>
                    <p className="text-xs text-[#69727C] max-w-md mx-auto mb-5">
                      Quý khách có thể ghé thăm bộ sưu tập xe của showroom và nhấn nút lưu yêu thích để theo dõi thuận tiện tại đây.
                    </p>
                    <button
                      onClick={() => onNavigate('cars')}
                      className="px-6 py-3 bg-[#17212B] hover:bg-[#C8A96B] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                    >
                      Xem Toàn Bộ Bộ Sưu Tập Xe
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedCars.map((car) => (
                      <div
                        key={car.id}
                        className="bg-white rounded-xl border border-[#E2E5E8] overflow-hidden hover:shadow-md transition-shadow group flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative h-48 overflow-hidden bg-[#F1F2F3]">
                            <img
                              src={car.image}
                              alt={car.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <button
                              onClick={() => handleRemoveSavedCar(car.id)}
                              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 hover:bg-red-50 text-[#69727C] hover:text-red-600 transition-colors shadow-sm cursor-pointer"
                              title="Xóa khỏi danh sách lưu"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-[#17212B]/80 text-[#C8A96B] text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                              {car.categoryLabel}
                            </span>
                          </div>

                          <div className="p-5">
                            <h4 className="font-serif font-bold text-base text-[#17212B] line-clamp-1 mb-1">
                              {car.name}
                            </h4>
                            <div className="text-sm font-bold text-[#C8A96B] mb-3">
                              {car.price}
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-[#E2E5E8] text-[11px] text-[#69727C] text-center mb-4">
                              <div>
                                <span className="block font-bold text-[#17212B]">{car.horsepower}</span>
                                <span>Công suất</span>
                              </div>
                              <div>
                                <span className="block font-bold text-[#17212B]">{car.acceleration}</span>
                                <span>0-100 km/h</span>
                              </div>
                              <div>
                                <span className="block font-bold text-[#17212B]">{car.topSpeed}</span>
                                <span>Tối đa</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 pt-0 flex items-center gap-2">
                          <button
                            onClick={() => onSelectCar(car)}
                            className="flex-1 py-2.5 bg-[#17212B] hover:bg-[#C8A96B] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer text-center"
                          >
                            Xem Cấu Hình
                          </button>
                          <button
                            onClick={() => {
                              onShowToast(`Đã gửi yêu cầu báo giá mẫu xe ${car.name}. Chuyên viên tư vấn sẽ liên hệ lại với quý khách.`);
                            }}
                            className="px-3.5 py-2.5 border border-[#C8A96B] text-[#17212B] hover:bg-[#C8A96B] hover:text-white rounded-sm text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            title="Yêu cầu gửi báo giá mẫu xe này"
                          >
                            Báo Giá
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Consultations and Appointments */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-[#17212B]">
                      Lịch Hẹn & Yêu Cầu Tư Vấn Của Quý Khách
                    </h3>
                    <p className="text-xs text-[#69727C]">
                      Theo dõi trạng thái tiếp đón tại sảnh VIP Lounge, lịch bảo dưỡng hoặc thẩm định định giá xe.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo Lịch Hẹn Tư Vấn Mới</span>
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#E2E5E8] p-12 text-center">
                    <Calendar className="w-12 h-12 text-[#E2E5E8] mx-auto mb-3" />
                    <h4 className="text-base font-bold text-[#17212B] mb-1">
                      Quý Khách Chưa Có Lịch Hẹn Nào
                    </h4>
                    <p className="text-xs text-[#69727C] max-w-md mx-auto mb-5">
                      Hãy đặt lịch hẹn để chuyên viên cao cấp của chúng tôi chuẩn bị đón tiếp quý khách chu đáo tại Private Lounge.
                    </p>
                    <button
                      onClick={() => setIsBookingModalOpen(true)}
                      className="px-6 py-3 bg-[#17212B] hover:bg-[#C8A96B] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                    >
                      Đặt Lịch Hẹn Ngay
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white rounded-xl border border-[#E2E5E8] p-5 sm:p-6 hover:border-[#C8A96B]/50 transition-colors shadow-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-1 rounded-sm bg-[#17212B] text-[#C8A96B] text-[10px] font-bold uppercase tracking-wider">
                              {booking.typeLabel}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider ${
                                booking.status === 'confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : booking.status === 'completed'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {booking.status === 'confirmed'
                                ? 'Đã Xác Nhận Tiếp Đón'
                                : booking.status === 'completed'
                                ? 'Đã Hoàn Tất'
                                : 'Đang Xử Lý & Chờ Xác Nhận'}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-[#69727C]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#C8A96B]" />
                              {booking.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#C8A96B]" />
                              {booking.time}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-base font-bold text-[#17212B] mb-2">
                          {booking.title}
                        </h4>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#69727C] mb-3">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#C8A96B]" />
                            {booking.location}
                          </span>
                          {booking.carModel && (
                            <span className="flex items-center gap-1.5">
                              <CarIcon className="w-3.5 h-3.5 text-[#C8A96B]" />
                              Mẫu xe: {booking.carModel}
                            </span>
                          )}
                        </div>

                        {booking.notes && (
                          <div className="p-3 bg-[#F7F5F0] rounded text-xs text-[#69727C] mb-3 italic">
                            "{booking.notes}"
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-[#E2E5E8] text-xs">
                          <span className="text-[#8C95A0]">
                            Hotline điều phối viên: <a href="tel:18008899" className="text-[#17212B] font-bold hover:underline">1800 8899</a>
                          </span>
                          {booking.status !== 'completed' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                            >
                              Hủy lịch hẹn này
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Benefits & Vouchers */}
            {activeTab === 'benefits' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#17212B]">
                    Đặc Quyền & Ưu Đãi Dành Cho Thành Viên
                  </h3>
                  <p className="text-xs text-[#69727C]">
                    Các mã voucher dịch vụ độc quyền dành riêng cho tài khoản của quý khách.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      code: 'ROYAL-CERAMIC-VIP',
                      title: 'Tặng Gói Phủ Ceramic Cao Cấp',
                      value: 'Trị giá 15.000.000 VNĐ',
                      desc: 'Áp dụng cho mọi hợp đồng đặt xe sang mới trong tháng này tại royalJPcar Showroom.',
                      expiry: 'Hạn dùng: 31/12/2026'
                    },
                    {
                      code: 'FREE-CHECK-50',
                      title: 'Miễn Phí Kiểm Tra 50 Hạng Mục',
                      value: 'Miễn phí 100%',
                      desc: 'Kiểm tra toàn diện máy móc, khung gầm và hệ thống điện tử bằng máy chẩn đoán chuyên dụng.',
                      expiry: 'Hạn dùng: Không thời hạn'
                    },
                    {
                      code: 'VIP-ACCESSORY-15',
                      title: 'Ưu Đãi 15% Phụ Kiện Chính Hãng',
                      value: 'Giảm 15%',
                      desc: 'Áp dụng khi nâng cấp thảm lót sàn da bò, phim cách nhiệt 3M Crystalline và camera hành trình cao cấp.',
                      expiry: 'Hạn dùng: 31/10/2026'
                    }
                  ].map((voucher, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-[#E2E5E8] p-6 flex flex-col justify-between shadow-xs hover:border-[#C8A96B] transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2 py-0.5 rounded bg-[#C8A96B]/20 text-[#C8A96B] font-bold text-[10px] uppercase">
                            {voucher.value}
                          </span>
                          <span className="text-[10px] text-[#8C95A0]">{voucher.expiry}</span>
                        </div>

                        <h4 className="font-bold text-sm text-[#17212B] mb-1.5">
                          {voucher.title}
                        </h4>
                        <p className="text-xs text-[#69727C] leading-relaxed mb-4">
                          {voucher.desc}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#E2E5E8]">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#17212B] bg-[#F7F5F0] px-3 py-1.5 rounded border border-[#E2E5E8]">
                            {voucher.code}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(voucher.code);
                              onShowToast(`Đã sao chép mã ưu đãi ${voucher.code}!`);
                            }}
                            className="text-xs text-[#C8A96B] font-bold hover:underline cursor-pointer"
                          >
                            Sao Chép Mã
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Modal: Forgot Password */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E2E5E8]"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#C8A96B]" />
                  <h3 className="font-serif font-bold text-lg text-[#17212B]">
                    {isJa ? 'パスワードの再設定' : 'Khôi Phục Mật Khẩu'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsForgotModalOpen(false)}
                  className="text-[#8C95A0] hover:text-[#17212B] text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {forgotError && (
                <div className="mb-4 p-2.5 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotStep === 'input' && (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <p className="text-xs text-[#69727C]">
                    {isJa
                      ? '認証コード（OTP）を受け取るための登録メールアドレスまたは電話番号を入力してください。'
                      : 'Nhập Email hoặc Số điện thoại của quý khách để nhận mã xác thực OTP.'}
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-[#17212B] mb-1">
                      {isJa ? 'ご登録のメールアドレスまたは電話番号' : 'Email hoặc SĐT đăng ký'}
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder={isJa ? 'demo@luxe-japan.com または 090-1234-5678' : 'demo@luxe.vn hoặc 0988 889 926'}
                      className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#17212B] hover:bg-[#C8A96B] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    {isJa ? '認証コード(OTP)を送信' : 'Gửi Mã Xác Thực OTP'}
                  </button>
                </form>
              )}

              {forgotStep === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-xs text-[#69727C]">
                    {isJa ? (
                      <>生成された認証コード(OTP): <span className="font-mono font-bold text-[#C8A96B] text-sm">{generatedOtp}</span>。確認のため以下に入力してください:</>
                    ) : (
                      <>Mã OTP vừa được tạo là: <span className="font-mono font-bold text-[#C8A96B] text-sm">{generatedOtp}</span>. Vui lòng nhập vào bên dưới để xác nhận:</>
                    )}
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-[#17212B] mb-1">
                      {isJa ? '6桁の認証コードを入力' : 'Nhập mã OTP 6 chữ số'}
                    </label>
                    <input
                      type="text"
                      required
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="889926"
                      className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B] font-mono tracking-widest text-center text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    {isJa ? '認証コードを確認' : 'Xác Thực Mã OTP'}
                  </button>
                </form>
              )}

              {forgotStep === 'reset' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-xs text-[#69727C]">
                    {isJa
                      ? '認証に成功しました。アカウントの新しいパスワードを設定してください。'
                      : 'Xác thực thành công! Vui lòng thiết lập mật khẩu mới cho tài khoản.'}
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-[#17212B] mb-1">
                      {isJa ? '新しいパスワード（6文字以上）' : 'Mật khẩu mới (tối thiểu 6 ký tự)'}
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#17212B] hover:bg-[#C8A96B] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    {isJa ? '新しいパスワードを保存してログイン' : 'Lưu Mật Khẩu Mới & Đăng Nhập'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Create New Booking */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E2E5E8] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#17212B]">
                    Đặt Lịch Hẹn Tư Vấn Riêng
                  </h3>
                  <p className="text-xs text-[#69727C]">
                    Chuyên viên cao cấp sẽ sắp xếp phòng tiếp đón VIP chu đáo cho quý khách.
                  </p>
                </div>
                <button
                  onClick={() => setIsBookingModalOpen(false)}
                  className="text-[#8C95A0] hover:text-[#17212B] text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateBooking} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17212B] mb-1">
                    Hình thức dịch vụ mong muốn *
                  </label>
                  <select
                    value={newBookingData.type}
                    onChange={(e) => setNewBookingData({ ...newBookingData, type: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                  >
                    <option value="showroom_visit">Tiếp Đón Sảnh VIP Lounge (Thưởng Lãm Xe)</option>
                    <option value="consultation">Tư Vấn Báo Giá & Đặt Xe Bespoke Cá Nhân Hóa</option>
                    <option value="maintenance">Bảo Dưỡng & Chăm Sóc Xe Định Kỳ</option>
                    <option value="appraisal">Thẩm Định & Định Giá Xe Đang Sử Dụng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17212B] mb-1">
                    Mẫu xe quý khách đang quan tâm *
                  </label>
                  <select
                    value={newBookingData.carModel}
                    onChange={(e) => setNewBookingData({ ...newBookingData, carModel: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                  >
                    {carsData.map((car) => (
                      <option key={car.id} value={car.name}>
                        {car.name} ({car.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17212B] mb-1">
                      Ngày hẹn mong muốn *
                    </label>
                    <input
                      type="date"
                      required
                      value={newBookingData.date}
                      onChange={(e) => setNewBookingData({ ...newBookingData, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17212B] mb-1">
                      Giờ tiếp đón *
                    </label>
                    <select
                      value={newBookingData.time}
                      onChange={(e) => setNewBookingData({ ...newBookingData, time: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                    >
                      <option value="09:00">09:00 Sáng</option>
                      <option value="10:30">10:30 Sáng</option>
                      <option value="14:00">14:00 Chiều</option>
                      <option value="16:00">16:00 Chiều</option>
                      <option value="18:30">18:30 Tối</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17212B] mb-1">
                    Địa điểm tiếp đón *
                  </label>
                  <select
                    value={newBookingData.location}
                    onChange={(e) => setNewBookingData({ ...newBookingData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                  >
                    <option value="Showroom Quận 1 - TP. Hồ Chí Minh">Showroom Quận 1 - 88 Nguyễn Du, Bến Nghé, Q.1, TP.HCM</option>
                    <option value="Showroom Quận 7 - Phú Mỹ Hưng">Showroom Quận 7 - 105 Nguyễn Văn Linh, Q.7, TP.HCM</option>
                    <option value="Showroom Hà Nội - Tây Hồ">Showroom Hà Nội - 68 Lạc Long Quân, Tây Hồ, Hà Nội</option>
                    <option value="Tư vấn tận nơi theo yêu cầu">Chuyên viên tư vấn đến tư gia / văn phòng riêng của quý khách</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17212B] mb-1">
                    Yêu cầu đặc biệt (nếu có)
                  </label>
                  <textarea
                    rows={2}
                    value={newBookingData.notes}
                    onChange={(e) => setNewBookingData({ ...newBookingData, notes: e.target.value })}
                    placeholder="Ví dụ: Cần chuẩn bị mẫu bảng màu da nội thất, chuẩn bị đồ uống riêng..."
                    className="w-full px-4 py-2 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-4 py-2.5 text-xs text-[#69727C] hover:text-[#17212B] font-semibold cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer shadow-sm"
                  >
                    Xác Nhận Đặt Lịch
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Google & Gmail OTP Registration Modal */}
      <GmailOtpModal
        isOpen={isGoogleOtpModalOpen}
        onClose={() => setIsGoogleOtpModalOpen(false)}
        onSuccess={handleGoogleOtpSuccess}
        initialEmail={googleModalEmail}
        initialFullName={googleModalName}
        initialPhone={googleModalPhone}
      />

    </div>
  );
};
