import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Inbox, 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound, 
  Lock, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  X, 
  Copy, 
  Check,
  User,
  Phone
} from 'lucide-react';
import { UserProfile } from '../types';

interface GmailOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newUser: UserProfile) => void;
  initialEmail?: string;
  initialFullName?: string;
  initialPhone?: string;
}

export const GmailOtpModal: React.FC<GmailOtpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialEmail = 'iamhakwin@gmail.com',
  initialFullName = '',
  initialPhone = '090-1234-5678',
}) => {
  const { t, i18n } = useTranslation();
  const isJa = i18n.language === 'ja';

  // Step: 'input' (confirm Google profile) -> 'otp' (verify 6-digit OTP) -> 'success'
  const [step, setStep] = useState<'input' | 'otp' | 'success'>('input');
  
  // Registration credentials
  const [googleEmail, setGoogleEmail] = useState(initialEmail);
  const [fullName, setFullName] = useState(initialFullName || (isJa ? '山田 太郎' : 'Khách Hàng Google VIP'));
  const [phone, setPhone] = useState(initialPhone);
  const [city, setCity] = useState(isJa ? '東京都' : 'TP. Hồ Chí Minh');

  // OTP states
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showInboxPreview, setShowInboxPreview] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update when props change or modal opens
  useEffect(() => {
    if (isOpen) {
      setGoogleEmail(initialEmail || 'iamhakwin@gmail.com');
      setFullName(initialFullName || (isJa ? '山田 太郎' : 'Khách Hàng Google VIP'));
      setPhone(initialPhone || (isJa ? '090-1234-5678' : '0912 888 999'));
      setStep('input');
      setOtpDigits(['', '', '', '', '', '']);
      setErrorMsg(null);
      setIsCopied(false);
      setShowInboxPreview(true);
    }
  }, [isOpen, initialEmail, initialFullName, initialPhone, isJa]);

  // Resend cooldown countdown
  useEffect(() => {
    if (step !== 'otp') return;

    if (resendCooldown > 0) {
      const timer = window.setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [step, resendCooldown]);

  // Generate 6-digit OTP
  const generateRandomOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Trigger send OTP
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const emailTrimmed = googleEmail.trim().toLowerCase();
    if (!emailTrimmed || !emailTrimmed.includes('@')) {
      setErrorMsg(
        isJa ? '有効なGmailアドレスを入力してください。' : 'Vui lòng nhập địa chỉ Gmail hợp lệ.'
      );
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg(
        isJa ? 'お名前をご入力ください。' : 'Vui lòng cung cấp họ và tên để mở hồ sơ VIP.'
      );
      return;
    }

    const newCode = generateRandomOtp();
    setGeneratedOtp(newCode);
    setOtpDigits(['', '', '', '', '', '']);
    setResendCooldown(60);
    setCanResend(false);
    setStep('otp');
    setShowInboxPreview(true);

    // Focus first input box
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 200);
  };

  // Handle individual OTP digit change
  const handleDigitChange = (index: number, value: string) => {
    setErrorMsg(null);
    const cleaned = value.replace(/\D/g, '');

    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    // If pasted multiple digits
    if (cleaned.length > 1) {
      const pastedChars = cleaned.slice(0, 6).split('');
      const updated = [...otpDigits];
      pastedChars.forEach((char, i) => {
        if (i < 6) updated[i] = char;
      });
      setOtpDigits(updated);
      const nextFocus = Math.min(pastedChars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleaned[0];
    setOtpDigits(updated);

    // Move to next input box
    if (index < 5 && cleaned[0]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Quick auto-fill from simulated Gmail inbox
  const handleAutoFillOtp = () => {
    if (!generatedOtp) return;
    const chars = generatedOtp.split('');
    setOtpDigits(chars);
    setErrorMsg(null);
    inputRefs.current[5]?.focus();
  };

  // Copy OTP code to clipboard
  const handleCopyOtp = () => {
    if (!generatedOtp) return;
    navigator.clipboard.writeText(generatedOtp);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Verify OTP submission
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const enteredCode = otpDigits.join('').trim();
    if (enteredCode.length < 6) {
      setErrorMsg(
        isJa ? '6桁の認証コードをすべて入力してください。' : 'Vui lòng nhập đủ 6 chữ số của mã OTP.'
      );
      return;
    }

    if (enteredCode !== generatedOtp) {
      setErrorMsg(
        isJa
          ? '認証コードが一致しません。Gmailの受信トレイをご確認いただくか、再送信をお試しください。'
          : 'Mã OTP không chính xác. Quý khách vui lòng kiểm tra lại hộp thư Gmail hoặc bấm gửi lại.'
      );
      return;
    }

    // Verification successful
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setStep('success');

      // Create new verified user profile
      const verifiedUser: UserProfile = {
        id: `usr_google_${Date.now()}`,
        fullName: fullName.trim(),
        email: googleEmail.trim().toLowerCase(),
        phone: phone.trim() || (isJa ? '090-1234-5678' : '0912 888 999'),
        tier: 'Gold',
        membershipId: `LX-${Math.floor(100000 + Math.random() * 900000)}-GGL`,
        points: 500, // 500 welcome points
        joinedDate: isJa ? '2026年9月' : 'Tháng 09/2026',
        city: city,
        address: isJa ? 'Googleアカウント認証済み' : 'Xác thực tài khoản Google',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        authProvider: 'google'
      };

      setTimeout(() => {
        onSuccess(verifiedUser);
        onClose();
      }, 1200);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2E5E8] overflow-hidden my-auto"
      >
        {/* Top Header Banner with Google & Luxe Aesthetic */}
        <div className="bg-[#17212B] px-6 py-5 text-white flex items-center justify-between border-b border-[#C8A96B]/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-xs">
              <span className="font-bold text-sm font-sans tracking-tight">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#34A853]">g</span>
                <span className="text-[#EA4335]">l</span>
                <span className="text-[#4285F4]">e</span>
              </span>
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                <span>{isJa ? 'Googleアカウントで登録' : 'Đăng Ký Bằng Google'}</span>
                <span className="text-[10px] bg-[#C8A96B] text-[#17212B] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-sans">
                  Gmail OTP
                </span>
              </h3>
              <p className="text-[11px] text-[#A6B0BA]">
                {isJa ? 'Gmail受信トレイに届くOTPコードで本人確認' : 'Xác thực danh tính an toàn với mã OTP gửi về Hộp thư đến'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-[#A6B0BA] hover:text-white transition-colors cursor-pointer"
            aria-label={isJa ? '閉じる' : 'Đóng cửa sổ'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">

          {/* ================= STEP 1: CONFIRM GOOGLE INFORMATION ================= */}
          {step === 'input' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="p-4 rounded-xl bg-[#F7F5F0] border border-[#E2E5E8] flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#EA4335]/10 border border-[#EA4335]/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#EA4335]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#69727C] block">
                    {isJa ? 'Gmailアカウント本人認証' : 'Xác thực tài khoản Gmail'}
                  </span>
                  <p className="text-xs text-[#17212B] font-medium leading-relaxed">
                    {isJa
                      ? 'ご登録のGmailアドレス宛に6桁のワンタイム認証コード（OTP）をお送りします。'
                      : 'Hệ thống sẽ gửi mã xác thực gồm 6 chữ số về hộp thư Gmail của quý khách để bảo vệ đặc quyền hội viên.'}
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#17212B] mb-1.5">
                  {isJa ? 'OTP送信用 Gmailアドレス *' : 'Địa chỉ Gmail nhận mã OTP *'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="user@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs font-medium focus:outline-none focus:border-[#C8A96B] bg-[#FAF8F5]"
                  />
                  <Mail className="w-4 h-4 text-[#EA4335] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[11px] text-[#69727C] mt-1 block">
                  {isJa ? 'このアドレス宛に認証メールが届きます。' : 'Mã OTP kích hoạt sẽ được chuyển trực tiếp vào hộp thư đến của địa chỉ này.'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17212B] mb-1.5">
                  {isJa ? 'お名前（漢字・ローマ字）*' : 'Họ và tên Quý khách *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isJa ? '例: 山田 太郎 / Nguyen Van A' : 'Họ và tên đại diện'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B] bg-[#FAF8F5]"
                  />
                  <User className="w-4 h-4 text-[#8C95A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#17212B] mb-1.5">
                    {isJa ? '電話番号' : 'Số điện thoại liên lạc'}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={isJa ? '090-1234-5678' : '0912 888 999'}
                      className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B] bg-[#FAF8F5]"
                    />
                    <Phone className="w-4 h-4 text-[#8C95A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17212B] mb-1.5">
                    {isJa ? '居住地域' : 'Khu vực sinh sống'}
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-sm border border-[#E2E5E8] text-xs focus:outline-none focus:border-[#C8A96B] bg-[#FAF8F5]"
                  >
                    {isJa ? (
                      <>
                        <option value="東京都">東京都 / 関東圏</option>
                        <option value="神奈川県">神奈川県（横浜など）</option>
                        <option value="大阪府">大阪府 / 関西圏</option>
                        <option value="愛知県">愛知県 / 中部圏</option>
                        <option value="その他">日本国内その他</option>
                      </>
                    ) : (
                      <>
                        <option value="Tokyo">Tokyo / Vùng Kanto</option>
                        <option value="Yokohama">Yokohama / Kanagawa</option>
                        <option value="Osaka">Osaka / Vùng Kansai</option>
                        <option value="Nagoya">Nagoya / Aichi</option>
                        <option value="Khác">Tỉnh thành khác tại Nhật</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-sm bg-[#17212B] hover:bg-[#C8A96B] text-white hover:text-[#17212B] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-[#EA4335]" />
                  <span>{isJa ? 'GmailにOTP認証コードを送信' : 'Gửi Mã OTP Về Hộp Thư Gmail'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-center text-[11px] text-[#69727C] pt-1">
                {isJa
                  ? '本操作により、royalJPcar JAPANの利用規約およびプライバシーポリシーに同意したものとみなされます。'
                  : 'Bằng cách tiếp tục, quý khách đồng ý nhận email xác thực từ hệ thống bảo mật royalJPcar.'}
              </p>
            </form>
          )}

          {/* ================= STEP 2: ENTER & VERIFY GMAIL OTP ================= */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center space-y-1.5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EA4335]/10 border border-[#EA4335]/20 text-[#EA4335] mb-1">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-serif font-bold text-[#17212B]">
                  {isJa ? 'Gmail OTP認証コードの入力' : 'Xác Thực Mã OTP Từ Gmail'}
                </h4>
                <p className="text-xs text-[#69727C]">
                  {isJa ? '6桁の認証コードを以下のアドレスに送信しました:' : 'Mã OTP 6 chữ số đã được gửi thành công đến:'}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E2E5E8] text-xs font-semibold text-[#17212B]">
                  <Mail className="w-3.5 h-3.5 text-[#EA4335]" />
                  <span>{googleEmail}</span>
                </div>
              </div>

              {/* SIMULATED GMAIL INBOX CARD NOTIFICATION */}
              {showInboxPreview && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-200 bg-linear-to-b from-white to-[#FEF5F5] p-4 shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-red-100 pb-2.5 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#EA4335] flex items-center justify-center text-white text-[11px] font-bold">
                        M
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-[#17212B] flex items-center gap-1">
                          {isJa ? 'Gmail 受信トレイ (新着メール)' : 'Hộp Thư Đến Gmail (Inbox)'}
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </span>
                        <span className="text-[10px] text-[#69727C]">
                          {isJa ? '差出人: security@royaljpcar.com' : 'Từ: security@royaljpcar.com (royalJPcar VIP)'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-2.5 py-1 rounded bg-[#C8A96B] hover:bg-[#DDBF7A] text-[#17212B] font-bold text-[10px] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{isJa ? '自動入力' : 'Điền mã nhanh'}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-[#17212B]">
                      {isJa
                        ? '【royalJPcar JAPAN】Googleアカウント登録のご本人確認コード'
                        : '[royalJPcar] Mã OTP xác thực đăng ký tài khoản Google'}
                    </div>
                    <div className="text-[11px] text-[#69727C]">
                      {isJa ? 'お客様の認証コードは:' : 'Mã xác thực của quý khách là:'}{' '}
                      <span className="font-mono font-bold text-base text-[#EA4335] bg-white px-2 py-0.5 rounded border border-red-200 tracking-wider">
                        {generatedOtp}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-red-100 flex items-center justify-between text-[10px] text-[#69727C]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C8A96B]" />
                      {isJa ? '有効期限: 5分間' : 'Hiệu lực trong 5 phút'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyOtp}
                      className="text-[#17212B] hover:text-[#EA4335] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">{isJa ? 'コピー完了' : 'Đã chép mã'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{isJa ? 'コードをコピー' : 'Sao chép mã'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 6-DIGIT OTP INPUTS */}
              <div className="space-y-2">
                <label className="block text-center text-xs font-semibold text-[#17212B]">
                  {isJa ? '受信した6桁のコードを入力してください:' : 'Nhập mã 6 chữ số từ email:'}
                </label>
                <div className="flex justify-center items-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold rounded-lg border transition-all focus:outline-none ${
                        digit
                          ? 'border-[#C8A96B] bg-[#FAF8F5] text-[#17212B] ring-2 ring-[#C8A96B]/20'
                          : 'border-[#E2E5E8] bg-white text-[#17212B] focus:border-[#C8A96B]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isVerifying || otpDigits.join('').length < 6}
                  className="w-full py-3.5 rounded-sm bg-[#C8A96B] hover:bg-[#DDBF7A] disabled:opacity-50 text-[#17212B] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#17212B]" />
                      <span>{isJa ? '検証中...' : 'Đang Xác Thực...'}</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>{isJa ? '認証して会員登録を完了する' : 'Xác Nhận & Hoàn Tất Đăng Ký'}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('input');
                      setErrorMsg(null);
                    }}
                    className="text-[#69727C] hover:text-[#17212B] flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{isJa ? 'Gmailアドレスを変更' : 'Đổi địa chỉ Gmail'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={!canResend}
                    onClick={() => handleSendOtp()}
                    className={`flex items-center gap-1 font-semibold ${
                      canResend
                        ? 'text-[#C8A96B] hover:underline cursor-pointer'
                        : 'text-[#8C95A0] cursor-not-allowed'
                    }`}
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${!canResend ? 'opacity-40' : ''}`} />
                    <span>
                      {canResend
                        ? (isJa ? 'コードを再送信' : 'Gửi lại mã OTP')
                        : (isJa ? `再送信まで (${resendCooldown}秒)` : `Gửi lại sau (${resendCooldown}s)`)}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ================= STEP 3: SUCCESS CELEBRATION ================= */}
          {step === 'success' && (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-serif font-bold text-[#17212B]">
                {isJa ? '認証が完了しました！' : 'Xác Thực Tài Khoản Thành Công!'}
              </h4>
              <p className="text-xs text-[#69727C] max-w-sm mx-auto leading-relaxed">
                {isJa ? (
                  <>
                    <span className="font-bold text-[#17212B]">{fullName} 様</span>、royalJPcar JAPAN VIPメンバーズクラブへようこそ。マイページへご案内いたします...
                  </>
                ) : (
                  <>
                    Chào mừng Quý khách <span className="font-bold text-[#17212B]">{fullName}</span> gia nhập câu lạc bộ thành viên VIP của royalJPcar. Đang chuyển hướng vào bảng điều khiển...
                  </>
                )}
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF8F5] border border-[#C8A96B] text-xs font-semibold text-[#C8A96B]">
                <Sparkles className="w-4 h-4" />
                <span>{isJa ? '会員ランク: Gold Member • VIP歓迎ボーナス +500pt' : 'Hạng hội viên: Gold Member • +500 Điểm thưởng VIP'}</span>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};
