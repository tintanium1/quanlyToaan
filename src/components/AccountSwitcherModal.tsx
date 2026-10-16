import React from 'react';
import { UserAccount, UserRole } from '../types/court';
import { getRoleBadge } from '../utils/rbacUtils';
import { 
  X, 
  CheckCircle2, 
  UserCheck, 
  ShieldAlert, 
  FileText, 
  Scale, 
  Key, 
  Lock, 
  ArrowRight, 
  Sparkles,
  Shield,
  Briefcase,
  LogOut
} from 'lucide-react';

interface AccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  accounts: UserAccount[];
  onSelectAccount: (user: UserAccount) => void;
  onOpenAccountManagement?: () => void;
  onLogout?: () => void;
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  accounts,
  onSelectAccount,
  onOpenAccountManagement,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#991B1B] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-bold text-base md:text-lg tracking-wide uppercase">
                Bảng Phân Quyền Vai Trò & Nghiệp Vụ Tố Tụng (RBAC)
              </h2>
              <div className="text-[11px] text-amber-200">
                Hệ thống Quản lý quyền truy cập theo vai trò - Tòa án nhân dân
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Account Card */}
        <div className="bg-amber-50/80 border-b border-amber-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${currentUser.avatarColor || 'bg-red-800'} text-white flex items-center justify-center font-bold text-sm shadow-2xs`}>
              {currentUser.fullName.split(' ').slice(-1)[0][0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{currentUser.fullName}</span>
                <span className="font-mono text-slate-500">(@{currentUser.username})</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getRoleBadge(currentUser.role).bgClass} ${getRoleBadge(currentUser.role).textClass} ${getRoleBadge(currentUser.role).borderClass}`}>
                  {getRoleBadge(currentUser.role).label}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 mt-0.5">
                {currentUser.roleTitle} • {currentUser.department}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-emerald-800 font-bold bg-emerald-100/80 px-3 py-1 rounded border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Tài khoản đang đăng nhập</span>
          </div>
        </div>

        {/* List of Accounts Grouped by The User Categories */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="text-slate-600 font-medium">
            Danh mục các tài khoản chức danh và bảng phân quyền nghiệp vụ quy định trong hệ thống:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {accounts.map((acc) => {
              const badge = getRoleBadge(acc.role);
              const isCurrent = acc.id === currentUser.id;

              return (
                <div
                  key={acc.id}
                  className={`p-3.5 rounded-lg border transition-all relative flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-amber-50/50 border-red-700 ring-2 ring-red-700/20 shadow-xs'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div>
                    {/* Role Header */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full ${acc.avatarColor || 'bg-slate-700'} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                          {acc.fullName.split(' ').slice(-1)[0][0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{acc.fullName}</span>
                            {isCurrent && (
                              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                            )}
                          </div>
                          <div className="text-[10.5px] font-mono text-slate-500">
                            @{acc.username}
                          </div>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold border shrink-0 ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}>
                        {badge.shortLabel}
                      </span>
                    </div>

                    {/* Department & Title */}
                    <div className="text-[11px] text-slate-700 font-semibold mb-1">
                      {acc.roleTitle}
                    </div>
                    <div className="text-[10px] text-slate-500 mb-2">
                      {acc.department}
                    </div>

                    {/* Permissions summary */}
                    <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[11px] space-y-1 mb-3">
                      <div className="font-semibold text-slate-800 text-[10.5px] uppercase tracking-wide">
                        Phân quyền chính:
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px]">
                        <div className={`flex items-center gap-1 ${acc.permissions.canCreateCase ? 'text-emerald-800 font-semibold' : 'text-slate-400'}`}>
                          <span>{acc.permissions.canCreateCase ? '✓' : '✗'}</span> Thụ lý án mới
                        </div>
                        <div className={`flex items-center gap-1 ${acc.permissions.canAssignJudges ? 'text-emerald-800 font-semibold' : 'text-slate-400'}`}>
                          <span>{acc.permissions.canAssignJudges ? '✓' : '✗'}</span> Phân công TP
                        </div>
                        <div className={`flex items-center gap-1 ${acc.permissions.canIssueTrialDecision ? 'text-emerald-800 font-semibold' : 'text-slate-400'}`}>
                          <span>{acc.permissions.canIssueTrialDecision ? '✓' : '✗'}</span> QĐ đưa ra XX
                        </div>
                        <div className={`flex items-center gap-1 ${acc.permissions.canIssueJudgment ? 'text-emerald-800 font-semibold' : 'text-slate-400'}`}>
                          <span>{acc.permissions.canIssueJudgment ? '✓' : '✗'}</span> Ban hành Bản án
                        </div>
                        <div className={`flex items-center gap-1 ${acc.permissions.canExtendPreparation ? 'text-emerald-800 font-semibold' : 'text-slate-400'}`}>
                          <span>{acc.permissions.canExtendPreparation ? '✓' : '✗'}</span> Gia hạn chuẩn bị XX
                        </div>
                        <div className={`flex items-center gap-1 ${acc.permissions.canViewAllReports ? 'text-emerald-800 font-semibold' : 'text-slate-400'}`}>
                          <span>{acc.permissions.canViewAllReports ? '✓' : '✗'}</span> Báo cáo thống kê
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="pt-1">
                    <div
                      className={`w-full py-1.5 px-3 rounded font-bold text-xs flex items-center justify-center gap-1.5 ${
                        isCurrent
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tài khoản hiện đang đăng nhập</span>
                        </>
                      ) : (
                        <span>Để truy cập, vui lòng Thoát và đăng nhập bằng tài khoản này</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="text-slate-500">
            Hệ thống phân quyền độc lập theo từng tài khoản cán bộ và vai trò công tác tại Tòa án.
          </div>

          <div className="flex items-center gap-2">
            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 rounded font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Đăng xuất khỏi tài khoản hiện tại"
              >
                <LogOut className="w-3.5 h-3.5 text-red-700" />
                <span>Đăng xuất</span>
              </button>
            )}

            {onOpenAccountManagement && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAccountManagement();
                }}
                className="px-3 py-1.5 bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 rounded font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-slate-600" />
                <span>Quản trị tài khoản & Chi tiết quyền</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded font-bold text-xs transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
