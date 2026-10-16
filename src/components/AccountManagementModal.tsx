import React, { useState } from 'react';
import { UserAccount, UserRole, UserPermissions } from '../types/court';
import { getRoleBadge } from '../utils/rbacUtils';
import { 
  X, 
  ShieldCheck, 
  UserPlus, 
  Edit3, 
  Lock, 
  Unlock, 
  Check, 
  Save, 
  RotateCcw,
  Shield,
  Key
} from 'lucide-react';

interface AccountManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: UserAccount[];
  onSaveAccounts: (accounts: UserAccount[]) => void;
  currentUser: UserAccount;
  initialEditingAccountId?: string | null;
}

export const AccountManagementModal: React.FC<AccountManagementModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onSaveAccounts,
  currentUser,
  initialEditingAccountId,
}) => {
  if (!isOpen) return null;

  const [accountList, setAccountList] = useState<UserAccount[]>(accounts);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(initialEditingAccountId || null);

  // Form state for editing or creating
  const [formData, setFormData] = useState<{
    fullName: string;
    username: string;
    role: UserRole;
    roleTitle: string;
    department: string;
    email: string;
    phone: string;
    permissions: UserPermissions;
    status: 'ACTIVE' | 'LOCKED';
  }>(() => {
    if (initialEditingAccountId) {
      const target = accounts.find((a) => a.id === initialEditingAccountId);
      if (target) {
        return {
          fullName: target.fullName,
          username: target.username,
          role: target.role,
          roleTitle: target.roleTitle,
          department: target.department,
          email: target.email || '',
          phone: target.phone || '',
          permissions: { ...target.permissions },
          status: target.status,
        };
      }
    }
    return {
      fullName: '',
      username: '',
      role: 'THAM_PHAN',
      roleTitle: 'Thẩm phán Sơ cấp',
      department: 'Tòa Hình sự',
      email: '',
      phone: '',
      permissions: {
        canCreateCase: false,
        canEditCaseBasics: true,
        canAssignJudges: false,
        canIssueTrialDecision: true,
        canIssueJudgment: true,
        canExtendPreparation: false,
        canExtendDetention: true,
        canManagePreventiveMeasures: true,
        canViewAllReports: false,
        canManageCourtSettings: false,
        canManageTemplates: false,
        canManageAccounts: false,
      },
      status: 'ACTIVE',
    };
  });

  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Ensure accounts stay in sync
  React.useEffect(() => {
    setAccountList(accounts);
    if (initialEditingAccountId) {
      const target = accounts.find((a) => a.id === initialEditingAccountId);
      if (target) {
        startEdit(target);
      }
    }
  }, [accounts, initialEditingAccountId]);

  const startEdit = (acc: UserAccount) => {
    setEditingAccountId(acc.id);
    setIsCreatingNew(false);
    setFormData({
      fullName: acc.fullName,
      username: acc.username,
      role: acc.role,
      roleTitle: acc.roleTitle,
      department: acc.department,
      email: acc.email || '',
      phone: acc.phone || '',
      permissions: { ...acc.permissions },
      status: acc.status,
    });
  };

  const startCreate = () => {
    setIsCreatingNew(true);
    setEditingAccountId(null);
    setFormData({
      fullName: '',
      username: '',
      role: 'CAN_BO_TONG_HOP',
      roleTitle: 'Cán bộ Tổng hợp & Thụ lý',
      department: 'Tổ Hành chính Tư pháp',
      email: '',
      phone: '',
      permissions: {
        canCreateCase: true,
        canEditCaseBasics: true,
        canAssignJudges: false,
        canIssueTrialDecision: false,
        canIssueJudgment: false,
        canExtendPreparation: false,
        canExtendDetention: false,
        canManagePreventiveMeasures: false,
        canViewAllReports: true,
        canManageCourtSettings: false,
        canManageTemplates: false,
        canManageAccounts: false,
        canDeleteCase: true,
      },
      status: 'ACTIVE',
    });
  };

  const handleRoleChange = (newRole: UserRole) => {
    let newPerms: UserPermissions = {
      canCreateCase: false,
      canEditCaseBasics: true,
      canAssignJudges: false,
      canIssueTrialDecision: false,
      canIssueJudgment: false,
      canExtendPreparation: false,
      canExtendDetention: false,
      canManagePreventiveMeasures: false,
      canViewAllReports: false,
      canManageCourtSettings: false,
      canManageTemplates: false,
      canManageAccounts: false,
      canDeleteCase: false,
    };

    let title = 'Cán bộ';
    let dept = 'Tòa án nhân dân';

    if (newRole === 'CAN_BO_TONG_HOP') {
      title = 'Cán bộ Tổng hợp & Thụ lý đơn';
      dept = 'Tổ Hành chính Tư pháp - Tiếp nhận đơn';
      newPerms.canCreateCase = true;
      newPerms.canEditCaseBasics = true;
      newPerms.canViewAllReports = true;
      newPerms.canDeleteCase = true;
    } else if (newRole === 'LANH_DAO') {
      title = 'Chánh án Tòa án nhân dân';
      dept = 'Ban Lãnh đạo Tòa án';
      newPerms = {
        canCreateCase: true,
        canEditCaseBasics: true,
        canAssignJudges: true,
        canIssueTrialDecision: true,
        canIssueJudgment: true,
        canExtendPreparation: true,
        canExtendDetention: true,
        canManagePreventiveMeasures: true,
        canViewAllReports: true,
        canManageCourtSettings: true,
        canManageTemplates: true,
        canManageAccounts: false,
        canDeleteCase: true,
      };
    } else if (newRole === 'THAM_PHAN') {
      title = 'Thẩm phán Sơ cấp / Trung cấp';
      dept = 'Tòa chuyên trách';
      newPerms.canIssueTrialDecision = true;
      newPerms.canIssueJudgment = true;
      newPerms.canExtendDetention = true;
      newPerms.canManagePreventiveMeasures = true;
      newPerms.canDeleteCase = true;
    } else if (newRole === 'THU_KY') {
      title = 'Thư ký viên Tòa án';
      dept = 'Tổ Thư ký Tòa án';
      newPerms.canEditCaseBasics = true;
      newPerms.canDeleteCase = false;
    } else if (newRole === 'ADMIN') {
      title = 'Quản trị viên Hệ thống CNTT';
      dept = 'Tổ Công nghệ thông tin & Quản trị số liệu';
      newPerms = {
        canCreateCase: true,
        canEditCaseBasics: true,
        canAssignJudges: true,
        canIssueTrialDecision: true,
        canIssueJudgment: true,
        canExtendPreparation: true,
        canExtendDetention: true,
        canManagePreventiveMeasures: true,
        canViewAllReports: true,
        canManageCourtSettings: true,
        canManageTemplates: true,
        canManageAccounts: true,
        canDeleteCase: true,
      };
    }

    setFormData({
      ...formData,
      role: newRole,
      roleTitle: title,
      department: dept,
      permissions: newPerms,
    });
  };

  const handleTogglePermission = (key: keyof UserPermissions) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [key]: !formData.permissions[key],
      },
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.username.trim()) {
      alert('Vui lòng nhập Họ tên và Tên đăng nhập.');
      return;
    }

    if (isCreatingNew) {
      const newAcc: UserAccount = {
        id: 'usr-' + Date.now(),
        username: formData.username.trim().toLowerCase(),
        fullName: formData.fullName.trim(),
        role: formData.role,
        roleTitle: formData.roleTitle.trim(),
        department: formData.department.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        avatarColor: formData.role === 'LANH_DAO' ? 'bg-red-800' : formData.role === 'CAN_BO_TONG_HOP' ? 'bg-blue-600' : 'bg-slate-700',
        permissions: formData.permissions,
        status: formData.status,
        lastLogin: new Date().toISOString(),
      };
      const updated = [...accountList, newAcc];
      setAccountList(updated);
      onSaveAccounts(updated);
      setIsCreatingNew(false);
    } else if (editingAccountId) {
      const updated = accountList.map((acc) => {
        if (acc.id === editingAccountId) {
          return {
            ...acc,
            fullName: formData.fullName.trim(),
            username: formData.username.trim().toLowerCase(),
            role: formData.role,
            roleTitle: formData.roleTitle.trim(),
            department: formData.department.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            permissions: formData.permissions,
            status: formData.status,
          };
        }
        return acc;
      });
      setAccountList(updated);
      onSaveAccounts(updated);
      setEditingAccountId(null);
    }
  };

  const toggleStatus = (id: string) => {
    const updated = accountList.map((acc) => {
      if (acc.id === id) {
        return {
          ...acc,
          status: (acc.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE') as 'ACTIVE' | 'LOCKED',
        };
      }
      return acc;
    });
    setAccountList(updated);
    onSaveAccounts(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#991B1B] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-bold text-base md:text-lg tracking-wide uppercase">
                Quản Trị Người Dùng & Phân Quyền Hệ Thống (RBAC)
              </h2>
              <div className="text-[11px] text-amber-200">
                Thiết lập quyền truy cập cho Cán bộ Tổng hợp, Lãnh đạo, Thẩm phán, Thư ký và Quản trị viên
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Top toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="text-slate-700 font-semibold">
              Danh sách tài khoản cán bộ trong hệ thống ({accountList.length} tài khoản)
            </div>
            {!isCreatingNew && !editingAccountId && (
              <button
                type="button"
                onClick={startCreate}
                className="px-3 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Thêm Tài Khoản Mới</span>
              </button>
            )}
          </div>

          {/* Form edit/create mode */}
          {(isCreatingNew || editingAccountId) ? (
            <form onSubmit={handleSaveForm} className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-red-900 font-bold uppercase">
                <span>{isCreatingNew ? 'Thêm mới tài khoản cán bộ' : 'Chỉnh sửa tài khoản & phân quyền'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingAccountId(null);
                  }}
                  className="text-slate-500 hover:text-slate-800 text-xs font-normal"
                >
                  ✕ Hủy chỉnh sửa
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Họ và tên cán bộ <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Tên đăng nhập (Username) <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="VD: nguyenva.tand"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Nhóm vai trò (Role) <span className="text-red-600">(*)</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  >
                    <option value="CAN_BO_TONG_HOP">1. Cán bộ Tổng hợp & Thụ lý (Báo cáo thống kê)</option>
                    <option value="LANH_DAO">2. Lãnh đạo Tòa án (Phân công & Giám sát tiến độ)</option>
                    <option value="THAM_PHAN">3. Thẩm phán (Cập nhật tiến độ, Ban hành QĐ/Bản án)</option>
                    <option value="THU_KY">4. Thư ký giải quyết (Hỗ trợ Thẩm phán, biên bản, tống đạt)</option>
                    <option value="ADMIN">5. Quản trị viên Hệ thống (Toàn quyền)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Chức danh / Chức vụ</label>
                  <input
                    type="text"
                    value={formData.roleTitle}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phòng ban / Đơn vị</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Trạng thái tài khoản</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'LOCKED' })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold focus:ring-1 focus:ring-red-600 focus:outline-none"
                  >
                    <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                    <option value="LOCKED">Khóa tài khoản (LOCKED)</option>
                  </select>
                </div>
              </div>

              {/* Specific Permissions Grid */}
              <div className="space-y-2 pt-1 border-t border-slate-200">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide flex items-center justify-between">
                  <span>Chi tiết danh mục phân quyền tác vụ:</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    (Nhấp chọn để bật/tắt quyền chuyên biệt)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 bg-white p-3 rounded border border-slate-200">
                  {[
                    { key: 'canCreateCase', label: 'Thụ lý vụ án mới (+ Thụ lý)', desc: 'Nhập đơn khởi kiện / Cáo trạng' },
                    { key: 'canEditCaseBasics', label: 'Sửa thông tin cơ bản vụ án', desc: 'Sửa đương sự, tội danh, tranh chấp' },
                    { key: 'canAssignJudges', label: 'Phân công Thẩm phán, Thư ký', desc: 'Ban hành QĐ phân công (Mẫu 01)' },
                    { key: 'canIssueTrialDecision', label: 'Ban hành QĐ đưa vụ án ra xét xử', desc: 'Ấn định ngày giờ mở phiên tòa' },
                    { key: 'canIssueJudgment', label: 'Ban hành Bản án / QĐ đình chỉ', desc: 'Kết quả giải quyết sơ thẩm' },
                    { key: 'canExtendPreparation', label: 'Gia hạn chuẩn bị xét xử', desc: 'Ký Quyết định gia hạn theo Luật định' },
                    { key: 'canExtendDetention', label: 'Ban hành Lệnh gia hạn tạm giam', desc: 'Áp dụng theo Điều 278 BLTTHS' },
                    { key: 'canManagePreventiveMeasures', label: 'Quản lý biện pháp ngăn chặn', desc: 'Kê biên tài sản, phong tỏa, tạm giam' },
                    { key: 'canViewAllReports', label: 'Báo cáo thống kê toàn Tòa án', desc: 'Xem biểu mẫu 01/BC-TA định kỳ' },
                    { key: 'canManageCourtSettings', label: 'Cài đặt thông tin Tòa án', desc: 'Tên Tòa án, Chánh án, địa chỉ' },
                    { key: 'canManageTemplates', label: 'Quản lý hệ thống biểu mẫu', desc: 'Thêm, sửa, xóa mẫu văn bản' },
                    { key: 'canManageAccounts', label: 'Quản trị tài khoản & phân quyền', desc: 'Quyền Quản trị viên (Admin)' },
                    { key: 'canDeleteCase', label: 'Xóa hồ sơ vụ án khỏi hệ thống', desc: 'Xóa vụ án thụ lý nhầm / rút đơn' },
                  ].map((p) => {
                    const isChecked = !!formData.permissions[p.key as keyof UserPermissions];
                    return (
                      <label
                        key={p.key}
                        className={`p-2 rounded border cursor-pointer flex items-start gap-2 transition-all ${
                          isChecked
                            ? 'bg-red-50/80 border-red-300 text-red-950 font-medium'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(p.key as keyof UserPermissions)}
                          className="mt-0.5 rounded text-red-700 focus:ring-red-600"
                        />
                        <div>
                          <div className="font-semibold text-xs leading-tight">{p.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{p.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingAccountId(null);
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-xs flex items-center gap-1 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Lưu Tài Khoản & Áp Dụng Quyền</span>
                </button>
              </div>
            </form>
          ) : null}

          {/* Accounts Table */}
          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#991B1B] text-white text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-2.5 px-3 text-center w-10">TT</th>
                  <th className="py-2.5 px-3">Cán bộ / Tên đăng nhập</th>
                  <th className="py-2.5 px-3">Nhóm vai trò (Role)</th>
                  <th className="py-2.5 px-3">Chức vụ & Đơn vị</th>
                  <th className="py-2.5 px-3">Quyền hạn chính</th>
                  <th className="py-2.5 px-3 text-center">Trạng thái</th>
                  <th className="py-2.5 px-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {accountList.map((acc, idx) => {
                  const badge = getRoleBadge(acc.role);
                  const isCurrent = acc.id === currentUser.id;

                  return (
                    <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                        {idx + 1}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{acc.fullName}</span>
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                              Bạn đang đăng nhập
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500">
                          @{acc.username}
                        </div>
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
                          {acc.permissions.canViewAllReports && 'Báo cáo thống kê; '}
                          {acc.permissions.canManageAccounts && 'Quản trị hệ thống; '}
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
                            onClick={() => startEdit(acc)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                            title="Sửa thông tin & phân quyền"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleStatus(acc.id)}
                            className={`p-1.5 rounded transition-colors ${
                              acc.status === 'ACTIVE'
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                            }`}
                            title={acc.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Kích hoạt lại'}
                          >
                            {acc.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
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

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex items-center justify-between shrink-0 text-xs">
          <div className="text-slate-500">
            Dữ liệu phân quyền được đồng bộ hóa và lưu trữ tự động trong cơ sở dữ liệu hệ thống Tòa án.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded font-bold text-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
