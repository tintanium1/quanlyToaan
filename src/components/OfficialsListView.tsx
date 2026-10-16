import React, { useState } from 'react';
import { Official, CourtCase } from '../types/court';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Mail, 
  Briefcase, 
  Scale, 
  Award, 
  Trash2, 
  Edit3, 
  X, 
  Search, 
  Check, 
  AlertTriangle 
} from 'lucide-react';

interface OfficialsListViewProps {
  officials: Official[];
  cases: CourtCase[];
  onAddOfficial: (newOff: Official) => void;
  onUpdateOfficial: (updatedOff: Official) => void;
  onDeleteOfficial: (officialId: string) => void;
  onFilterByOfficial: (officialName: string) => void;
}

export const OfficialsListView: React.FC<OfficialsListViewProps> = ({
  officials,
  cases,
  onAddOfficial,
  onUpdateOfficial,
  onDeleteOfficial,
  onFilterByOfficial,
}) => {
  const [roleTab, setRoleTab] = useState<'ALL' | 'THAM_PHAN' | 'THU_KY' | 'HOI_THAM'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingOfficial, setEditingOfficial] = useState<Official | null>(null);
  const [officialToDelete, setOfficialToDelete] = useState<Official | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Form state
  const [name, setName] = useState('');
  const [role, setRole] = useState<'THAM_PHAN' | 'THU_KY' | 'HOI_THAM'>('THAM_PHAN');
  const [title, setTitle] = useState('Thẩm phán Sơ cấp');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Edit Form state
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'THAM_PHAN' | 'THU_KY' | 'HOI_THAM'>('THAM_PHAN');
  const [editTitle, setEditTitle] = useState('');
  const [editOrganization, setEditOrganization] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const filtered = officials.filter((o) => {
    if (roleTab !== 'ALL' && o.role !== roleTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = o.name.toLowerCase().includes(q);
      const matchTitle = o.title.toLowerCase().includes(q);
      const matchOrg = o.organization?.toLowerCase().includes(q) || false;
      const matchPhone = o.phone?.includes(q) || false;
      return matchName || matchTitle || matchOrg || matchPhone;
    }
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const roleNames: Record<string, string> = {
      THAM_PHAN: 'Thẩm phán',
      THU_KY: 'Thư ký',
      HOI_THAM: 'Hội thẩm nhân dân',
    };

    const newOff: Official = {
      id: 'off-' + Date.now(),
      name: name.trim(),
      role,
      roleName: roleNames[role],
      title: title.trim(),
      organization: organization.trim() || undefined,
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      activeCasesCount: 0,
    };

    onAddOfficial(newOff);
    setShowAddModal(false);
    setName('');
    setPhone('');
    setEmail('');
    setOrganization('');
  };

  const handleStartEdit = (off: Official) => {
    setEditingOfficial(off);
    setEditName(off.name);
    setEditRole(off.role as any);
    setEditTitle(off.title);
    setEditOrganization(off.organization || '');
    setEditPhone(off.phone || '');
    setEditEmail(off.email || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficial || !editName.trim()) return;

    const roleNames: Record<string, string> = {
      THAM_PHAN: 'Thẩm phán',
      THU_KY: 'Thư ký',
      HOI_THAM: 'Hội thẩm nhân dân',
    };

    const updated: Official = {
      ...editingOfficial,
      name: editName.trim(),
      role: editRole,
      roleName: roleNames[editRole],
      title: editTitle.trim(),
      organization: editOrganization.trim() || undefined,
      phone: editPhone.trim() || undefined,
      email: editEmail.trim() || undefined,
    };

    onUpdateOfficial(updated);
    setEditingOfficial(null);
  };

  const handleConfirmDelete = () => {
    if (!officialToDelete) return;
    onDeleteOfficial(officialToDelete.id);
    setOfficialToDelete(null);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* Top Banner and Tabs */}
      <div className="bg-white border border-slate-300 rounded shadow-2xs p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 border border-slate-300 rounded p-0.5">
          <button
            onClick={() => setRoleTab('ALL')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              roleTab === 'ALL'
                ? 'bg-red-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả cán bộ ({officials.length})
          </button>

          <button
            onClick={() => setRoleTab('THAM_PHAN')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              roleTab === 'THAM_PHAN'
                ? 'bg-red-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Thẩm phán ({officials.filter((o) => o.role === 'THAM_PHAN').length})
          </button>

          <button
            onClick={() => setRoleTab('THU_KY')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              roleTab === 'THU_KY'
                ? 'bg-red-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Thư ký Tòa án ({officials.filter((o) => o.role === 'THU_KY').length})
          </button>

          <button
            onClick={() => setRoleTab('HOI_THAM')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
              roleTab === 'HOI_THAM'
                ? 'bg-red-700 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đoàn Hội thẩm nhân dân ({officials.filter((o) => o.role === 'HOI_THAM').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search inside officials */}
          <div className="relative w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên cán bộ, hội thẩm..."
              className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-xs transition-colors shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Thêm cán bộ / Hội thẩm</span>
          </button>
        </div>
      </div>

      {/* Grid of Officials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded p-8 text-center text-slate-400 italic">
            Không tìm thấy cán bộ, thẩm phán hoặc hội thẩm nhân dân nào theo điều kiện tìm kiếm.
          </div>
        ) : (
          filtered.map((off) => {
            // Calculate actual assigned cases count
            const assignedCases = cases.filter(
              (c) =>
                c.assignedJudgeId === off.id ||
                c.assignedClerkId === off.id ||
                c.assignedJurors.some((j) => j.id === off.id)
            );
            const assignedCount = assignedCases.length;

            return (
              <div
                key={off.id}
                className="bg-white border border-slate-300 rounded p-4 shadow-2xs space-y-3 hover:border-amber-400 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span>{off.name}</span>
                      </h3>
                      <div className="text-red-800 font-semibold text-xs mt-0.5">{off.title}</div>
                      {off.organization && (
                        <div className="text-[11px] text-slate-600 italic mt-0.5">
                          Đoàn thể / CQ: <span className="font-medium text-slate-800">{off.organization}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                          off.role === 'THAM_PHAN'
                            ? 'bg-red-50 text-red-800 border border-red-200'
                            : off.role === 'THU_KY'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}
                      >
                        {off.roleName}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-slate-600 text-[11.5px] mt-2.5">
                    {off.phone ? (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{off.phone}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 italic">
                        <Phone className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span>Chưa cập nhật số ĐT</span>
                      </div>
                    )}
                    {off.email ? (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{off.email}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-400 italic">
                        <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                        <span>Chưa có email công vụ</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-500 font-medium">Đang thụ lý:</span>{' '}
                    <strong className="text-red-800 font-mono text-xs">{assignedCount} vụ việc</strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onFilterByOfficial(off.name)}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold text-[11px] transition-colors"
                      title="Xem tất cả các vụ án do người này giải quyết"
                    >
                      Xem án ({assignedCount})
                    </button>

                    <button
                      onClick={() => handleStartEdit(off)}
                      className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded transition-colors"
                      title="Sửa thông tin cán bộ / hội thẩm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setOfficialToDelete(off)}
                      className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded transition-colors"
                      title="Xóa cán bộ khỏi danh sách"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#991B1B] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase">Thêm Cán Bộ / Hội Thẩm Mới</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Chức danh <span className="text-red-600">(*)</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => {
                    const r = e.target.value as any;
                    setRole(r);
                    if (r === 'THAM_PHAN') setTitle('Thẩm phán Sơ cấp');
                    else if (r === 'THU_KY') setTitle('Thư ký viên');
                    else setTitle('Hội thẩm nhân dân');
                  }}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium"
                >
                  <option value="THAM_PHAN">Thẩm phán</option>
                  <option value="THU_KY">Thư ký Tòa án</option>
                  <option value="HOI_THAM">Hội thẩm nhân dân</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Họ và tên <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Trần Thị Bích"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ngạch / Chức danh</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Thẩm phán Sơ cấp, Thư ký viên chính..."
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>

              {role === 'HOI_THAM' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Cơ quan / Đoàn thể công tác
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="VD: Hội Liên hiệp Phụ nữ, Hội Luật gia..."
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0912..."
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email công vụ</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="...@toaan.gov.vn"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#991B1B] text-white rounded font-bold hover:bg-red-800 transition-colors"
                >
                  Lưu cán bộ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingOfficial && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#991B1B] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase">Cập Nhật Thông Tin Cán Bộ / Hội Thẩm</h3>
              <button
                onClick={() => setEditingOfficial(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Chức danh <span className="text-red-600">(*)</span>
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium"
                >
                  <option value="THAM_PHAN">Thẩm phán</option>
                  <option value="THU_KY">Thư ký Tòa án</option>
                  <option value="HOI_THAM">Hội thẩm nhân dân</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Họ và tên <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ngạch / Chức danh</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                />
              </div>

              {editRole === 'HOI_THAM' && (
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Cơ quan / Đoàn thể công tác
                  </label>
                  <input
                    type="text"
                    value={editOrganization}
                    onChange={(e) => setEditOrganization(e.target.value)}
                    placeholder="VD: Hội Liên hiệp Phụ nữ, Hội Nông dân..."
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email công vụ</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingOfficial(null)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#991B1B] text-white rounded font-bold hover:bg-red-800 transition-colors flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Cập nhật</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {officialToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-red-700 text-white px-4 py-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-sm uppercase">Xác Nhận Xóa Cán Bộ</h3>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <p className="text-slate-700">
                Bạn có chắc chắn muốn xóa cán bộ / hội thẩm: <strong>{officialToDelete.name}</strong> ({officialToDelete.roleName} - {officialToDelete.title}) ra khỏi danh sách quản lý của đơn vị?
              </p>

              {cases.some(
                (c) =>
                  c.assignedJudgeId === officialToDelete.id ||
                  c.assignedClerkId === officialToDelete.id ||
                  c.assignedJurors.some((j) => j.id === officialToDelete.id)
              ) && (
                <div className="bg-amber-50 border border-amber-300 rounded p-2.5 text-amber-900">
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    Lưu ý về hồ sơ vụ án:
                  </div>
                  <div>
                    Người này hiện đang được phân công trong một số vụ án. Việc xóa sẽ cập nhật lại thông tin hiển thị trong các quyết định liên quan.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setOfficialToDelete(null)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 font-medium"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold transition-colors"
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
