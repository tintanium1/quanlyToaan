import React, { useState } from 'react';
import { UserAccount, UserRole, UserPermissions } from '../types/court';
import { getRoleBadge } from '../utils/rbacUtils';
import { 
  ShieldCheck, 
  UserPlus, 
  Edit3, 
  Lock, 
  Unlock, 
  Key, 
  Check, 
  Shield, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  Search,
  Sparkles
} from 'lucide-react';

interface AccountManagementViewProps {
  accounts: UserAccount[];
  currentUser: UserAccount;
  onUpdateAccounts: (updated: UserAccount[]) => void;
  onSelectAccount: (user: UserAccount) => void;
  onOpenAccountManagementModal: (accountId?: string) => void;
}

export const AccountManagementView: React.FC<AccountManagementViewProps> = ({
  accounts,
  currentUser,
  onUpdateAccounts,
  onSelectAccount,
  onOpenAccountManagementModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');

  const filtered = accounts.filter((acc) => {
    if (roleFilter !== 'ALL' && acc.role !== roleFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        acc.fullName.toLowerCase().includes(q) ||
        acc.username.toLowerCase().includes(q) ||
        acc.roleTitle.toLowerCase().includes(q) ||
        acc.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const countTongHop = accounts.filter((a) => a.role === 'CAN_BO_TONG_HOP').length;
  const countLanhDao = accounts.filter((a) => a.role === 'LANH_DAO').length;
  const countThamPhan = accounts.filter((a) => a.role === 'THAM_PHAN').length;
  const countThuKy = accounts.filter((a) => a.role === 'THU_KY').length;
  const countAdmin = accounts.filter((a) => a.role === 'ADMIN').length;

  return (
    <div className="space-y-4 text-xs">
      {/* Information Banner: Per-Account Permissions Explanation */}
      <div className="bg-gradient-to-r from-red-900 to-slate-900 text-white p-4 rounded shadow-sm border border-red-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-400 text-red-950 rounded font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wide text-amber-300">
              Phân Quyền Theo Từng Tài Khoản Cá Nhân (Granular RBAC)
            </h2>
            <p className="text-slate-200 text-xs mt-0.5 max-w-3xl leading-relaxed">
              Hệ thống hỗ trợ <strong>phân quyền linh hoạt theo từng tài khoản cá biệt</strong>: Bạn có thể chọn bất kỳ tài khoản cán bộ nào và bật/tắt độc lập 12 quyền tác vụ (nhập thụ lý, sửa án, phân công, ra QĐ xét xử, ra bản án, gia hạn tạm giam/chuẩn bị xét xử, báo cáo thống kê...) mà không bị bó hẹp vào một chức danh cố định.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenAccountManagementModal()}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-red-950 rounded font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tạo Tài Khoản Mới & Phân Quyền</span>
        </button>
      </div>

      {/* Overview Stat Cards for the 4 RBAC Groups */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div 
          onClick={() => setRoleFilter('CAN_BO_TONG_HOP')}
          className={`bg-white border rounded p-3.5 shadow-2xs cursor-pointer transition-all hover:border-blue-500 ${
            roleFilter === 'CAN_BO_TONG_HOP' ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/30' : 'border-slate-300'
          }`}
        >
          <div className="text-slate-500 font-bold text-[11px] uppercase tracking-wide">
            1. Cán bộ Tổng hợp & Thụ lý
          </div>
          <div className="text-2xl font-bold font-mono text-blue-800 mt-1 tabular-nums">
            {countTongHop} <span className="text-xs font-normal text-slate-500">tài khoản</span>
          </div>
          <div className="text-[10px] text-blue-700 mt-1">Thụ lý án & Báo cáo thống kê</div>
        </div>

        <div 
          onClick={() => setRoleFilter('LANH_DAO')}
          className={`bg-white border rounded p-3.5 shadow-2xs cursor-pointer transition-all hover:border-red-500 ${
            roleFilter === 'LANH_DAO' ? 'border-red-600 ring-2 ring-red-500/20 bg-red-50/30' : 'border-slate-300'
          }`}
        >
          <div className="text-slate-500 font-bold text-[11px] uppercase tracking-wide">
            2. Lãnh đạo Tòa án
          </div>
          <div className="text-2xl font-bold font-mono text-red-800 mt-1 tabular-nums">
            {countLanhDao} <span className="text-xs font-normal text-slate-500">tài khoản</span>
          </div>
          <div className="text-[10px] text-red-700 mt-1">Phân công & Giám sát tiến độ</div>
        </div>

        <div 
          onClick={() => setRoleFilter('THAM_PHAN')}
          className={`bg-white border rounded p-3.5 shadow-2xs cursor-pointer transition-all hover:border-amber-500 ${
            roleFilter === 'THAM_PHAN' ? 'border-amber-600 ring-2 ring-amber-500/20 bg-amber-50/30' : 'border-slate-300'
          }`}
        >
          <div className="text-slate-500 font-bold text-[11px] uppercase tracking-wide">
            3. Thẩm phán giải quyết
          </div>
          <div className="text-2xl font-bold font-mono text-amber-800 mt-1 tabular-nums">
            {countThamPhan} <span className="text-xs font-normal text-slate-500">tài khoản</span>
          </div>
          <div className="text-[10px] text-amber-700 mt-1">QĐ xét xử, Bản án, Lệnh tạm giam</div>
        </div>

        <div 
          onClick={() => setRoleFilter('THU_KY')}
          className={`bg-white border rounded p-3.5 shadow-2xs cursor-pointer transition-all hover:border-teal-500 ${
            roleFilter === 'THU_KY' ? 'border-teal-600 ring-2 ring-teal-500/20 bg-teal-50/30' : 'border-slate-300'
          }`}
        >
          <div className="text-slate-500 font-bold text-[11px] uppercase tracking-wide">
            4. Thư ký Tòa án
          </div>
          <div className="text-2xl font-bold font-mono text-teal-800 mt-1 tabular-nums">
            {countThuKy} <span className="text-xs font-normal text-slate-500">tài khoản</span>
          </div>
          <div className="text-[10px] text-teal-700 mt-1">Biên bản, tống đạt, hồ sơ</div>
        </div>

        <div 
          onClick={() => setRoleFilter('ADMIN')}
          className={`bg-white border rounded p-3.5 shadow-2xs cursor-pointer transition-all hover:border-slate-700 ${
            roleFilter === 'ADMIN' ? 'border-slate-800 ring-2 ring-slate-800/20 bg-slate-100' : 'border-slate-300'
          }`}
        >
          <div className="text-slate-500 font-bold text-[11px] uppercase tracking-wide">
            5. Quản trị hệ thống
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {countAdmin} <span className="text-xs font-normal text-slate-500">tài khoản</span>
          </div>
          <div className="text-[10px] text-slate-600 mt-1">Toàn quyền phân quyền RBAC</div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-300 rounded shadow-2xs overflow-hidden">
        {/* Toolbar Header */}
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-700 flex items-center gap-1 uppercase text-[11px]">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              Lọc theo vai trò:
            </span>
            {[
              { key: 'ALL', label: 'Tất cả vai trò' },
              { key: 'CAN_BO_TONG_HOP', label: '1. Cán bộ Tổng hợp' },
              { key: 'LANH_DAO', label: '2. Lãnh đạo' },
              { key: 'THAM_PHAN', label: '3. Thẩm phán' },
              { key: 'THU_KY', label: '4. Thư ký' },
              { key: 'ADMIN', label: '5. Quản trị' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setRoleFilter(f.key as any)}
                className={`px-2.5 py-1 rounded font-semibold text-xs transition-colors ${
                  roleFilter === f.key
                    ? 'bg-[#991B1B] text-white shadow-2xs'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-60">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm cán bộ, tên đăng nhập..."
                className="w-full pl-8 pr-3 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            <button
              type="button"
              onClick={() => onOpenAccountManagementModal()}
              className="px-3 py-1 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Thêm Tài Khoản</span>
            </button>
          </div>
        </div>

        {/* Table of Accounts */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#991B1B] text-white text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3 text-center w-10">TT</th>
                <th className="py-2.5 px-3">Họ và tên cán bộ</th>
                <th className="py-2.5 px-3">Tên đăng nhập</th>
                <th className="py-2.5 px-3">Nhóm phân quyền (RBAC)</th>
                <th className="py-2.5 px-3">Chức danh & Đơn vị</th>
                <th className="py-2.5 px-3">Quyền hạn tác vụ</th>
                <th className="py-2.5 px-3 text-center">Trạng thái</th>
                <th className="py-2.5 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filtered.map((acc, idx) => {
                const badge = getRoleBadge(acc.role);
                const isCurrent = acc.id === currentUser.id;

                return (
                  <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                      {idx + 1}
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full ${acc.avatarColor || 'bg-slate-700'} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                          {acc.fullName.split(' ').slice(-1)[0][0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{acc.fullName}</span>
                            {isCurrent && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                                Đang đăng nhập
                              </span>
                            )}
                          </div>
                          {acc.email && (
                            <div className="text-[10px] text-slate-400">{acc.email}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                      @{acc.username}
                    </td>

                    <td className="py-2.5 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${badge.bgClass} ${badge.textClass} ${badge.borderClass}`}>
                        {badge.label}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{acc.roleTitle}</div>
                      <div className="text-[11px] text-slate-500">{acc.department}</div>
                    </td>

                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="text-[10.5px] text-slate-600 line-clamp-2">
                        {acc.permissions.canCreateCase && 'Thụ lý; '}
                        {acc.permissions.canAssignJudges && 'Phân công; '}
                        {acc.permissions.canIssueTrialDecision && 'QĐ xét xử; '}
                        {acc.permissions.canIssueJudgment && 'Bản án; '}
                        {acc.permissions.canExtendPreparation && 'Gia hạn XX; '}
                        {acc.permissions.canExtendDetention && 'Gia hạn tạm giam; '}
                        {acc.permissions.canViewAllReports && 'Báo cáo; '}
                        {acc.permissions.canManageAccounts && 'Quản trị; '}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        acc.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-50 text-rose-800 border border-rose-300'
                      }`}>
                        {acc.status === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenAccountManagementModal(acc.id)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                          title={`Chỉnh sửa phân quyền chi tiết cho tài khoản: @${acc.username}`}
                        >
                          <Edit3 className="w-3 h-3 text-amber-700" />
                          <span>Sửa quyền</span>
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
    </div>
  );
};
