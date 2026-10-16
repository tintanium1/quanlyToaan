import React from 'react';
import { UserAccount, UserRole } from '../types/court';
import { getRoleBadge } from '../utils/rbacUtils';
import { ShieldAlert, X, ArrowRight, Key } from 'lucide-react';

interface PermissionDeniedAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionName: string;
  requiredRoleName: string;
  currentUser: UserAccount;
  onLogout?: () => void;
}

export const PermissionDeniedAlertModal: React.FC<PermissionDeniedAlertModalProps> = ({
  isOpen,
  onClose,
  actionName,
  requiredRoleName,
  currentUser,
  onLogout,
}) => {
  if (!isOpen) return null;

  const currentBadge = getRoleBadge(currentUser.role);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden border border-amber-300 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-amber-600 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-100" />
            <h3 className="font-bold text-base uppercase tracking-wide">
              Thông Báo Giới Hạn Phân Quyền Tố Tụng
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3.5 text-xs text-slate-700">
          <div className="bg-amber-50 border border-amber-200 rounded p-3 text-slate-800 leading-relaxed">
            Hành động: <strong className="text-red-900">{actionName}</strong> chỉ dành riêng cho tài khoản có vai trò: <strong className="text-red-900">{requiredRoleName}</strong> theo quy định phân quyền nghiệp vụ của Tòa án.
          </div>

          <div className="space-y-1.5 border border-slate-200 rounded p-3 bg-slate-50">
            <div className="text-[11px] text-slate-500 font-semibold uppercase">
              Tài khoản hiện tại của bạn:
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">{currentUser.fullName}</span>{' '}
                <span className="text-slate-500">(@{currentUser.username})</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${currentBadge.bgClass} ${currentBadge.textClass} ${currentBadge.borderClass}`}>
                {currentBadge.label}
              </span>
            </div>
            <div className="text-[11px] text-slate-600 italic">
              {currentUser.department}
            </div>
          </div>

          <p className="text-slate-600 leading-relaxed">
            Để thực hiện thao tác này, vui lòng đăng xuất tài khoản hiện tại và đăng nhập bằng tài khoản có thẩm quyền tương ứng ({requiredRoleName}).
          </p>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex items-center justify-between gap-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-medium transition-colors"
          >
            Đã hiểu & Đóng
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold transition-colors flex items-center gap-1 shadow-2xs"
            >
              <span>Thoát để đổi tài khoản</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
