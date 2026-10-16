import React, { useState } from 'react';
import { UserAccount, CourtUnitSettings } from '../types/court';
import { getRoleBadge } from '../utils/rbacUtils';
import { CourtEmblem } from './CourtEmblem';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Scale,
  LogIn
} from 'lucide-react';

interface LoginViewProps {
  accounts: UserAccount[];
  settings: CourtUnitSettings;
  onLogin: (user: UserAccount) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  accounts,
  settings,
  onLogin,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedUser = usernameInput.trim().toLowerCase();
    const targetUser = accounts.find(
      (a) => a.username.toLowerCase() === trimmedUser
    );

    if (!targetUser) {
      setErrorMessage('Tên đăng nhập không chính xác hoặc không tồn tại trong hệ thống Tòa án.');
      return;
    }

    if (targetUser.status === 'LOCKED') {
      setErrorMessage('Tài khoản này hiện đang bị tạm khóa. Vui lòng liên hệ Quản trị viên để mở khóa.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Vui lòng nhập mật khẩu xác thực.');
      return;
    }

    onLogin(targetUser);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col justify-between font-sans text-slate-800">
      {/* Top Banner Bar */}
      <div className="bg-[#991B1B] text-white py-2 px-4 shadow-sm border-b border-red-900 text-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>HỆ THỐNG QUẢN LÝ THỤ LÝ, GIÁM SÁT TIẾN ĐỘ GIẢI QUYẾT ÁN</span>
          </div>
          <div className="hidden sm:block text-amber-200 font-serif">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM — Độc lập - Tự do - Hạnh phúc
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 my-6">
        <div className="bg-white rounded-xl shadow-xl border border-slate-300 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header Branding */}
          <div className="relative overflow-hidden bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/60 to-[#FFFBEB] p-6 text-center border-b border-amber-200">
            {/* Background Courthouse Silhouette */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <svg width="450" height="90" viewBox="0 0 340 65" fill="#78350F">
                <rect x="20" y="55" width="300" height="8" />
                <rect x="35" y="48" width="270" height="7" />
                <rect x="50" y="24" width="8" height="24" />
                <rect x="75" y="24" width="8" height="24" />
                <rect x="100" y="24" width="8" height="24" />
                <rect x="125" y="24" width="8" height="24" />
                <rect x="150" y="24" width="8" height="24" />
                <rect x="175" y="24" width="8" height="24" />
                <rect x="200" y="24" width="8" height="24" />
                <rect x="225" y="24" width="8" height="24" />
                <rect x="250" y="24" width="8" height="24" />
                <rect x="275" y="24" width="8" height="24" />
                <polygon points="40,24 170,3 300,24" />
                <path d="M140,16 Q170,-4 200,16 Z" />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <CourtEmblem size={68} className="mb-2 drop-shadow-md" />
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[#991B1B] uppercase font-serif">
                Tòa Án Nhân Dân
              </h1>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mt-1">
                {settings.courtName.toUpperCase()}
              </p>
              <div className="text-[11px] text-slate-500 mt-1">
                Cổng xác thực & phân quyền quản lý nghiệp vụ tố tụng
              </div>
            </div>
          </div>

          {/* Login Form Body */}
          <div className="p-6 md:p-8">
            <div className="mb-6 text-center">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                Đăng Nhập Tài Khoản
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Vui lòng nhập thông tin tài khoản được cấp để truy cập hệ thống
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-300 rounded text-red-800 flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Username Input */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Tên đăng nhập (Tài khoản): <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Nhập tên đăng nhập (ví dụ: thamphan.trinh, lanhdao.chanhan, admin.quantri...)"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 font-medium focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-none transition-all shadow-2xs"
                    autoFocus
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Nhập tên tài khoản cán bộ được cấp để đăng nhập hệ thống Tòa án
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">
                  Mật khẩu xác thực: <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu xác thực..."
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600 focus:outline-none transition-all shadow-2xs"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 italic">
                  Mật khẩu mặc định hệ thống: <strong className="text-slate-800 font-mono">toaan@123</strong>
                </div>
              </div>

              {/* Remember me & Submit */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-red-700 focus:ring-red-600"
                  />
                  <span className="text-slate-600 font-medium text-xs">Ghi nhớ đăng nhập trên thiết bị này</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <LogIn className="w-4 h-4" />
                <span>ĐĂNG NHẬP VÀO HỆ THỐNG</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-300 py-3 px-4 text-xs text-slate-500 text-center shrink-0">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div>
            <strong>{settings.courtName}</strong> · Địa chỉ: {settings.address} · SĐT: {settings.phone}
          </div>
          <div>
            Phần mềm Quản lý thụ lý, giải quyết án & Phân quyền bảo mật hồ sơ © {new Date().getFullYear()} TAND
          </div>
        </div>
      </footer>
    </div>
  );
};
