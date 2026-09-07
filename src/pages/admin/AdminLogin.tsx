import React, { useState } from 'react';
import { RoyalJpLogo } from '../../components/RoyalJpLogo';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  KeyRound, 
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import { AdminUser } from '../../types';
import { AdminAuthService } from '../../services/adminAuthService';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToWebsite: () => void;
  initialError?: string | null;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToWebsite,
  initialError,
}) => {
  const [identifier, setIdentifier] = useState('director@royaljpcar.com');
  const [password, setPassword] = useState('royaljpcar2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Vui lòng nhập đầy đủ email/tên đăng nhập và mật khẩu.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await AdminAuthService.login({
        identifier,
        password,
        rememberMe,
      });

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
      }
    } catch (err: any) {
      setError(err?.message || 'Có lỗi kết nối xảy ra trong quá trình xác thực Firebase.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (emailOrUsername: string, pass: string = 'royaljpcar2026') => {
    setIdentifier(emailOrUsername);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#0D1117] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#C8A96B]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#1B2838]/40 blur-[140px] pointer-events-none" />

      {/* Top Bar with Return Link */}
      <header className="relative z-10 p-6 sm:px-12 flex items-center justify-between border-b border-white/5">
        <button
          type="button"
          onClick={onBackToWebsite}
          className="inline-flex items-center gap-2 text-xs text-[#B8C0C7] hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#C8A96B]" />
          <span>Quay lại trang chủ website</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] text-[#8C95A0] bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96B]" />
          <span>Firebase Authentication SSL 256-bit</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-[#161B22] border border-[#C8A96B]/30 rounded-2xl p-8 sm:p-10 shadow-[0_24px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4 p-2.5 bg-black/70 rounded-xl border border-[#C8A96B]/30 shadow-inner">
              <RoyalJpLogo variant="badge" className="h-12 w-auto" />
            </div>
            <span className="text-[10px] tracking-[0.25em] text-[#C8A96B] uppercase font-bold block mb-1">
              HỆ THỐNG QUẢN TRỊ BẢO MẬT
            </span>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
              Đăng Nhập Quản Trị
            </h1>
            <p className="text-xs text-[#8C95A0] mt-1.5 leading-relaxed">
              Xác thực quyền truy cập dành riêng cho Ban Giám Đốc & Đội ngũ ROYAL JPcar
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#D9DDE1] mb-1.5">
                Email hoặc Tên đăng nhập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C95A0]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="director@royaljpcar.com hoặc admin..."
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0D1117] border border-white/15 text-sm text-white placeholder:text-[#586069] focus:outline-none focus:border-[#C8A96B] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D9DDE1] mb-1.5">
                Mật khẩu truy cập
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C95A0]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#0D1117] border border-white/15 text-sm text-white placeholder:text-[#586069] focus:outline-none focus:border-[#C8A96B] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C95A0] hover:text-white cursor-pointer"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me checkbox */}
            <div className="flex items-center justify-between text-xs text-[#8C95A0] pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#D9DDE1] hover:text-white">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-[#0D1117] text-[#C8A96B] focus:ring-[#C8A96B] cursor-pointer"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <span className="text-[11px] text-[#C8A96B] font-medium">Firebase Auth</span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-3 bg-gradient-to-r from-[#C8A96B] to-[#DFCA97] hover:from-[#DFCA97] hover:to-[#C8A96B] text-[#17212B] font-bold text-xs uppercase tracking-widest rounded-lg transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#17212B] border-t-transparent rounded-full animate-spin" />
                  <span>Đang xác thực bảo mật...</span>
                </>
              ) : (
                <>
                  <span>Đăng Nhập Quản Trị</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials helper */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-[11px] text-[#8C95A0] mb-2.5">
              Đăng nhập nhanh theo phân quyền nhân viên:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('director@royaljpcar.com')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#C8A96B]/20 border border-white/10 hover:border-[#C8A96B]/50 text-xs text-[#C8A96B] font-medium transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Super Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('k.takahashi@royaljpcar.jp')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 text-xs text-blue-300 font-medium transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Quản Lý Showroom</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('quan.tm@royaljpcar.com')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/50 text-xs text-emerald-300 font-medium transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Kinh Doanh</span>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('sato.daiki@royaljpcar.jp')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/50 text-xs text-amber-300 font-medium transition-all cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Kho Xe</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-xs text-[#8C95A0] border-t border-white/5">
        <span>© 2026 ROYAL JPcar SHOWROOM. Hệ thống quản trị nội bộ bảo mật cao cấp.</span>
      </footer>
    </div>
  );
};
