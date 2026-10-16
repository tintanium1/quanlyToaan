import React, { useState, useEffect } from 'react';
import { 
  CourtUnitSettings, 
  UserAccount, 
  Official, 
  ResolutionTargets, 
  DocumentTemplate,
  UserRole
} from '../types/court';
import { DEFAULT_COURT_SETTINGS, DEFAULT_RESOLUTION_TARGETS, INITIAL_ACCOUNTS, INITIAL_OFFICIALS } from '../data/mockData';
import { DEFAULT_TEMPLATES } from '../data/defaultTemplates';
import { getRoleBadge } from '../utils/rbacUtils';
import { 
  Building, 
  User, 
  Target, 
  FileText, 
  Save, 
  X, 
  RotateCcw, 
  Download, 
  Upload, 
  CheckCircle2, 
  Sliders, 
  Key, 
  ShieldCheck, 
  Scale, 
  Sparkles,
  Phone,
  Mail,
  MapPin,
  FileCheck,
  ExternalLink,
  Copy,
  Info,
  FileUp
} from 'lucide-react';

export type CustomizationTab = 'UNIT' | 'USER' | 'TARGETS' | 'TEMPLATES' | 'BACKUP';

interface SystemCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: CustomizationTab;
  settings: CourtUnitSettings;
  onSaveSettings: (settings: CourtUnitSettings) => void;
  currentUser: UserAccount;
  onSaveCurrentUser: (updatedUser: UserAccount) => void;
  accounts: UserAccount[];
  onSaveAccounts: (accounts: UserAccount[]) => void;
  officials: Official[];
  onSaveOfficials: (officials: Official[]) => void;
  targets: ResolutionTargets;
  onSaveTargets: (targets: ResolutionTargets) => void;
  templates: DocumentTemplate[];
  onSaveTemplates: (templates: DocumentTemplate[]) => void;
  onOpenTemplateManagerModal: () => void;
  onOpenWordUploader?: () => void;
}

export const SystemCustomizationModal: React.FC<SystemCustomizationModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'UNIT',
  settings,
  onSaveSettings,
  currentUser,
  onSaveCurrentUser,
  accounts,
  onSaveAccounts,
  officials,
  onSaveOfficials,
  targets,
  onSaveTargets,
  templates,
  onSaveTemplates,
  onOpenTemplateManagerModal,
  onOpenWordUploader,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<CustomizationTab>(initialTab);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync tab if initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // ================= 1. UNIT FORM STATE =================
  const [unitForm, setUnitForm] = useState<CourtUnitSettings>({
    courtName: settings.courtName || '',
    unitType: settings.unitType || 'TOA_AN',
    unitTypeName: settings.unitTypeName || 'Tòa án nhân dân',
    courtDistrict: settings.courtDistrict || '',
    province: settings.province || '',
    chiefJudgeName: settings.chiefJudgeName || '',
    chiefJudgeTitle: settings.chiefJudgeTitle || 'Chánh án',
    deputyChiefJudgeName: settings.deputyChiefJudgeName || '',
    deputyChiefJudgeTitle: settings.deputyChiefJudgeTitle || 'Phó Chánh án',
    address: settings.address || '',
    phone: settings.phone || '',
    email: settings.email || '',
    website: settings.website || '',
    motto: settings.motto || 'Phụng công thủ pháp, chí công vô tư',
    sealNumber: settings.sealNumber || 'TAND-KV12-DLK',
  });

  const handleApplyUnitPreset = (presetType: 'TOA_AN_HUYEN' | 'TOA_AN_TINH' | 'VKS_HUYEN' | 'VKS_TINH') => {
    if (presetType === 'TOA_AN_HUYEN') {
      setUnitForm((prev) => ({
        ...prev,
        courtName: `TÒA ÁN NHÂN DÂN KHU VỰC 12 - ${prev.province || 'ĐẮK LẮK'}`.toUpperCase(),
        unitType: 'TOA_AN',
        unitTypeName: 'Tòa án nhân dân',
        chiefJudgeTitle: 'Chánh án',
        deputyChiefJudgeTitle: 'Phó Chánh án',
        motto: 'Phụng công thủ pháp, chí công vô tư',
      }));
    } else if (presetType === 'TOA_AN_TINH') {
      setUnitForm((prev) => ({
        ...prev,
        courtName: `TÒA ÁN NHÂN DÂN TỈNH ${prev.province || 'ĐẮK LẮK'}`.toUpperCase(),
        unitType: 'TOA_AN',
        unitTypeName: 'Tòa án nhân dân cấp tỉnh',
        chiefJudgeTitle: 'Chánh án',
        deputyChiefJudgeTitle: 'Phó Chánh án',
        motto: 'Phụng công thủ pháp, chí công vô tư',
      }));
    } else if (presetType === 'VKS_HUYEN') {
      setUnitForm((prev) => ({
        ...prev,
        courtName: `VIỆN KIỂM SÁT NHÂN DÂN HUYỆN ${prev.courtDistrict || 'KRÔNG BÚK'}`.toUpperCase(),
        unitType: 'VIEN_KIEM_SAT',
        unitTypeName: 'Viện kiểm sát nhân dân',
        chiefJudgeTitle: 'Viện trưởng',
        deputyChiefJudgeTitle: 'Phó Viện trưởng',
        motto: 'Công minh, chính trực, khách quan, thận trọng, khiêm tốn',
      }));
    } else if (presetType === 'VKS_TINH') {
      setUnitForm((prev) => ({
        ...prev,
        courtName: `VIỆN KIỂM SÁT NHÂN DÂN TỈNH ${prev.province || 'ĐẮK LẮK'}`.toUpperCase(),
        unitType: 'VIEN_KIEM_SAT',
        unitTypeName: 'Viện kiểm sát nhân dân cấp tỉnh',
        chiefJudgeTitle: 'Viện trưởng',
        deputyChiefJudgeTitle: 'Phó Viện trưởng',
        motto: 'Công minh, chính trực, khách quan, thận trọng, khiêm tốn',
      }));
    }
    showNotification('Đã nạp mẫu cấu hình cơ quan!');
  };

  const handleSaveUnit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(unitForm);
    showNotification('Đã lưu thành công cấu hình đơn vị & cơ quan!');
  };

  // ================= 2. USER FORM STATE =================
  const [selectedAccountUserId, setSelectedAccountUserId] = useState<string>(currentUser.id);
  const targetUserAccount = accounts.find((a) => a.id === selectedAccountUserId) || currentUser;

  const [userForm, setUserForm] = useState({
    fullName: targetUserAccount.fullName,
    username: targetUserAccount.username,
    roleTitle: targetUserAccount.roleTitle,
    department: targetUserAccount.department,
    email: targetUserAccount.email || '',
    phone: targetUserAccount.phone || '',
    avatarColor: targetUserAccount.avatarColor || 'bg-red-700',
  });

  // Switch edited account
  useEffect(() => {
    const acc = accounts.find((a) => a.id === selectedAccountUserId) || currentUser;
    setUserForm({
      fullName: acc.fullName,
      username: acc.username,
      roleTitle: acc.roleTitle,
      department: acc.department,
      email: acc.email || '',
      phone: acc.phone || '',
      avatarColor: acc.avatarColor || 'bg-red-700',
    });
  }, [selectedAccountUserId, accounts, currentUser]);

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.fullName.trim() || !userForm.username.trim()) {
      alert('Vui lòng nhập họ tên và tên đăng nhập!');
      return;
    }

    const updatedAcc: UserAccount = {
      ...targetUserAccount,
      fullName: userForm.fullName.trim(),
      username: userForm.username.trim().toLowerCase(),
      roleTitle: userForm.roleTitle.trim(),
      department: userForm.department.trim(),
      email: userForm.email.trim(),
      phone: userForm.phone.trim(),
      avatarColor: userForm.avatarColor,
    };

    // Update in accounts list
    const updatedAccounts = accounts.map((acc) =>
      acc.id === updatedAcc.id ? updatedAcc : acc
    );
    onSaveAccounts(updatedAccounts);

    // If it's the current user, update currentUser
    if (updatedAcc.id === currentUser.id) {
      onSaveCurrentUser(updatedAcc);
    }

    // Synchronize with officials list if linked
    if (updatedAcc.linkedOfficialId) {
      const updatedOfficials = officials.map((off) => {
        if (off.id === updatedAcc.linkedOfficialId) {
          return {
            ...off,
            name: updatedAcc.fullName,
            title: updatedAcc.roleTitle,
            email: updatedAcc.email || off.email,
            phone: updatedAcc.phone || off.phone,
          };
        }
        return off;
      });
      onSaveOfficials(updatedOfficials);
    }

    showNotification(`Đã cập nhật thông tin người dùng "${updatedAcc.fullName}" thành công!`);
  };

  // ================= 3. TARGETS FORM STATE =================
  const [targetsForm, setTargetsForm] = useState<ResolutionTargets>({ ...targets });

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTargets(targetsForm);
    showNotification('Đã lưu và áp dụng chỉ tiêu giải quyết mới toàn hệ thống!');
  };

  const handleResetTargetsToStandard = () => {
    if (confirm('Khôi phục toàn bộ chỉ tiêu giải quyết về chỉ tiêu chuẩn của Quốc hội & Tòa án Tối cao?')) {
      setTargetsForm(DEFAULT_RESOLUTION_TARGETS);
      onSaveTargets(DEFAULT_RESOLUTION_TARGETS);
      showNotification('Đã khôi phục chỉ tiêu giải quyết chuẩn!');
    }
  };

  // ================= 4. BACKUP / EXPORT / IMPORT =================
  const handleExportConfig = () => {
    const configData = {
      exportedAt: new Date().toISOString(),
      appVersion: '2.5.0',
      settings,
      targets,
      currentUser,
      accounts,
      templatesCount: templates.length,
    };
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tand_cau_hinh_don_vi_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Đã xuất tệp cấu hình JSON thành công!');
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.settings) {
          onSaveSettings(json.settings);
          setUnitForm(json.settings);
        }
        if (json.targets) {
          onSaveTargets(json.targets);
          setTargetsForm(json.targets);
        }
        if (json.accounts && Array.isArray(json.accounts)) {
          onSaveAccounts(json.accounts);
        }
        showNotification('Đã nhập và khôi phục cấu hình từ tệp tin thành công!');
      } catch (err) {
        alert('Tệp tin không đúng định dạng JSON hợp lệ!');
      }
    };
    reader.readAsText(file);
  };

  const avatarColorOptions = [
    { label: 'Đỏ thắm', value: 'bg-red-700' },
    { label: 'Hổ phách', value: 'bg-amber-700' },
    { label: 'Xanh lam', value: 'bg-blue-700' },
    { label: 'Tím hoa cà', value: 'bg-purple-700' },
    { label: 'Xanh ngọc', value: 'bg-teal-700' },
    { label: 'Xanh lá', value: 'bg-emerald-700' },
    { label: 'Xám đậm', value: 'bg-slate-800' },
    { label: 'Chàm', value: 'bg-indigo-700' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Header */}
        <div className="bg-[#991B1B] text-white px-5 py-3.5 flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-400 text-red-950 rounded font-bold shadow-2xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base uppercase tracking-wide flex items-center gap-2">
                <span>Trung Tâm Tùy Chỉnh & Cấu Hình Đơn Vị</span>
                <span className="text-[10.5px] bg-amber-400 text-red-950 px-2 py-0.5 rounded-full font-bold">
                  v2.5
                </span>
              </h2>
              <p className="text-amber-200/90 text-xs">
                Tùy chỉnh tên cơ quan, thông tin người dùng, chỉ tiêu giải quyết án và hệ thống biểu mẫu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 transition-all">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-slate-100 border-b border-slate-300 px-4 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('UNIT')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'UNIT'
                ? 'border-red-700 text-red-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building className="w-4 h-4 text-amber-700" />
            <span>1. Tên Đơn Vị & Cơ Quan</span>
          </button>

          <button
            onClick={() => setActiveTab('USER')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'USER'
                ? 'border-red-700 text-red-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <User className="w-4 h-4 text-blue-700" />
            <span>2. Tên Người Dùng & Hồ Sơ</span>
          </button>

          <button
            onClick={() => setActiveTab('TARGETS')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'TARGETS'
                ? 'border-red-700 text-red-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Target className="w-4 h-4 text-rose-700" />
            <span>3. Chỉ Tiêu Giải Quyết Án</span>
          </button>

          <button
            onClick={() => setActiveTab('TEMPLATES')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'TEMPLATES'
                ? 'border-red-700 text-red-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>4. Biểu Mẫu Tố Tụng ({templates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('BACKUP')}
            className={`px-4 py-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'BACKUP'
                ? 'border-red-700 text-red-800 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>5. Sao Lưu & Đồng Bộ</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs bg-slate-50/50">
          
          {/* ================= TAB 1: UNIT / ORGANIZATION SETTINGS ================= */}
          {activeTab === 'UNIT' && (
            <form onSubmit={handleSaveUnit} className="space-y-4">
              {/* Presets Bar */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-2.5">
                <div>
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Nạp nhanh mẫu cơ quan tư pháp chuẩn:</span>
                  </span>
                  <p className="text-[11px] text-amber-800 mt-0.5">
                    Tự động thiết lập cấu trúc tên đơn vị, chức danh người đứng đầu và tiêu ngữ chuẩn ngành
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyUnitPreset('TOA_AN_HUYEN')}
                    className="px-2.5 py-1 bg-white border border-amber-300 rounded font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    TAND Khu vực / Huyện
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyUnitPreset('TOA_AN_TINH')}
                    className="px-2.5 py-1 bg-white border border-amber-300 rounded font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    TAND Cấp Tỉnh
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyUnitPreset('VKS_HUYEN')}
                    className="px-2.5 py-1 bg-white border border-amber-300 rounded font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    VKSND Cấp Huyện
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyUnitPreset('VKS_TINH')}
                    className="px-2.5 py-1 bg-white border border-amber-300 rounded font-semibold text-amber-900 hover:bg-amber-100"
                  >
                    VKSND Cấp Tỉnh
                  </button>
                </div>
              </div>

              {/* Main Unit Form */}
              <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs space-y-3.5">
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                    <Building className="w-4 h-4 text-red-700" />
                    <span>Tên Gọi Cơ Quan & Đơn Vị Thụ Lý</span>
                  </h3>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Tên cơ quan / Đơn vị đầy đủ <span className="text-red-600 font-bold">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={unitForm.courtName}
                    onChange={(e) => setUnitForm({ ...unitForm, courtName: e.target.value })}
                    placeholder="VD: TÒA ÁN NHÂN DÂN KHU VỰC 12 - ĐẮK LẮK hoặc VIỆN KIỂM SÁT NHÂN DÂN..."
                    className="w-full border border-slate-300 rounded px-3 py-2 font-bold uppercase text-red-950 focus:ring-2 focus:ring-red-600 focus:outline-none"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Tên này sẽ hiển thị trang trọng trên tiêu đề ứng dụng, tiêu ngữ công văn, và thẻ <code>&#123;&#123;TEN_TOA_AN&#125;&#125;</code> trên mọi biểu mẫu in ấn.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Loại hình cơ quan</label>
                    <select
                      value={unitForm.unitType || 'TOA_AN'}
                      onChange={(e) =>
                        setUnitForm({
                          ...unitForm,
                          unitType: e.target.value as any,
                          unitTypeName: e.target.value === 'VIEN_KIEM_SAT' ? 'Viện kiểm sát nhân dân' : 'Tòa án nhân dân',
                        })
                      }
                      className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white font-medium"
                    >
                      <option value="TOA_AN">Tòa án nhân dân</option>
                      <option value="VIEN_KIEM_SAT">Viện kiểm sát nhân dân</option>
                      <option value="CO_QUAN_KHAC">Cơ quan tư pháp / Nội chính khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Quận / Huyện / Khu vực</label>
                    <input
                      type="text"
                      value={unitForm.courtDistrict}
                      onChange={(e) => setUnitForm({ ...unitForm, courtDistrict: e.target.value })}
                      placeholder="VD: Khu vực 12 / Huyện Krông Búk"
                      className="w-full border border-slate-300 rounded px-3 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Tỉnh / Thành phố trực thuộc TW</label>
                    <input
                      type="text"
                      value={unitForm.province}
                      onChange={(e) => setUnitForm({ ...unitForm, province: e.target.value })}
                      placeholder="VD: Tỉnh Đắk Lắk"
                      className="w-full border border-slate-300 rounded px-3 py-1.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <label className="block text-slate-800 font-bold mb-1">
                      Thủ trưởng cơ quan (Chánh án / Viện trưởng)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={unitForm.chiefJudgeTitle || 'Chánh án'}
                        onChange={(e) => setUnitForm({ ...unitForm, chiefJudgeTitle: e.target.value })}
                        placeholder="Chức danh"
                        className="w-1/3 border border-slate-300 rounded px-2.5 py-1.5 font-medium"
                      />
                      <input
                        type="text"
                        value={unitForm.chiefJudgeName}
                        onChange={(e) => setUnitForm({ ...unitForm, chiefJudgeName: e.target.value })}
                        placeholder="Họ và tên thủ trưởng"
                        className="w-2/3 border border-slate-300 rounded px-3 py-1.5 font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                    <label className="block text-slate-800 font-bold mb-1">
                      Phó Thủ trưởng (Phó Chánh án / Phó Viện trưởng)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={unitForm.deputyChiefJudgeTitle || 'Phó Chánh án'}
                        onChange={(e) => setUnitForm({ ...unitForm, deputyChiefJudgeTitle: e.target.value })}
                        placeholder="Chức danh"
                        className="w-1/3 border border-slate-300 rounded px-2.5 py-1.5 font-medium"
                      />
                      <input
                        type="text"
                        value={unitForm.deputyChiefJudgeName}
                        onChange={(e) => setUnitForm({ ...unitForm, deputyChiefJudgeName: e.target.value })}
                        placeholder="Họ và tên phó thủ trưởng"
                        className="w-2/3 border border-slate-300 rounded px-3 py-1.5 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Trụ sở cơ quan</label>
                    <input
                      type="text"
                      value={unitForm.address}
                      onChange={(e) => setUnitForm({ ...unitForm, address: e.target.value })}
                      placeholder="Số nhà, tên đường, phường/xã"
                      className="w-full border border-slate-300 rounded px-3 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Số điện thoại liên hệ</label>
                    <input
                      type="text"
                      value={unitForm.phone}
                      onChange={(e) => setUnitForm({ ...unitForm, phone: e.target.value })}
                      placeholder="0262.xxxxxxx"
                      className="w-full border border-slate-300 rounded px-3 py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Email công vụ</label>
                    <input
                      type="email"
                      value={unitForm.email || ''}
                      onChange={(e) => setUnitForm({ ...unitForm, email: e.target.value })}
                      placeholder="donvi@toaan.gov.vn"
                      className="w-full border border-slate-300 rounded px-3 py-1.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Khẩu hiệu / Tiêu ngữ ngành
                  </label>
                  <input
                    type="text"
                    value={unitForm.motto || ''}
                    onChange={(e) => setUnitForm({ ...unitForm, motto: e.target.value })}
                    placeholder="VD: Phụng công thủ pháp, chí công vô tư"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-medium italic text-slate-700"
                  />
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-amber-300 rounded-lg p-3.5">
                <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-red-700" />
                  <span>Xem trước Tiêu đề & Thông tin đơn vị trên Hồ sơ:</span>
                </div>
                <div className="mt-2 bg-white border border-slate-200 rounded p-3 text-center shadow-2xs">
                  <div className="font-bold text-slate-900 text-sm tracking-wide uppercase">
                    {unitForm.courtName || 'TÒA ÁN NHÂN DÂN'}
                  </div>
                  <div className="text-slate-600 text-xs italic mt-0.5">
                    "{unitForm.motto || 'Phụng công thủ pháp, chí công vô tư'}"
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap items-center justify-center gap-3">
                    <span>Trụ sở: {unitForm.address || 'Chưa cấu hình'}</span>
                    <span>•</span>
                    <span>ĐT: {unitForm.phone || 'Chưa cấu hình'}</span>
                    <span>•</span>
                    <span>{unitForm.chiefJudgeTitle || 'Chánh án'}: <strong>{unitForm.chiefJudgeName || 'Chưa cấu hình'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded font-semibold text-slate-700"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#991B1B] hover:bg-[#7F1D1D] text-white rounded font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Cấu Hình Đơn Vị</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= TAB 2: USER PROFILE & ACCOUNTS ================= */}
          {activeTab === 'USER' && (
            <div className="space-y-4">
              {/* Account Selector Bar */}
              <div className="bg-white border border-slate-300 rounded-lg p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-blue-100 text-blue-900 rounded font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">
                      Chọn tài khoản để tùy chỉnh thông tin cá nhân:
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Đang sửa: <strong>{targetUserAccount.fullName}</strong> ({targetUserAccount.roleTitle})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedAccountUserId}
                    onChange={(e) => setSelectedAccountUserId(e.target.value)}
                    className="border border-slate-300 rounded px-3 py-1.5 font-semibold text-xs bg-slate-50 focus:bg-white"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.fullName} (@{acc.username}) - {acc.roleTitle} {acc.id === currentUser.id ? '(Hiện tại)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form to edit selected user */}
              <form onSubmit={handleSaveUser} className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs space-y-3.5">
                <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                    <User className="w-4 h-4 text-blue-700" />
                    <span>Thông Tin Cán Bộ & Người Dùng</span>
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold border ${getRoleBadge(targetUserAccount.role).bgClass} ${getRoleBadge(targetUserAccount.role).textClass} ${getRoleBadge(targetUserAccount.role).borderClass}`}>
                    {getRoleBadge(targetUserAccount.role).label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Họ và tên cán bộ / Người dùng <span className="text-red-600 font-bold">(*)</span>
                    </label>
                    <input
                      type="text"
                      value={userForm.fullName}
                      onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                      placeholder="VD: Võ Thị Tuyết Trinh"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      required
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Tên này tự động đồng bộ sang Danh sách Thẩm phán/Thư ký, phân công vụ việc và chữ ký biểu mẫu.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Tên đăng nhập (Username) <span className="text-red-600 font-bold">(*)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-400 font-mono">@</span>
                      <input
                        type="text"
                        value={userForm.username}
                        onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                        placeholder="username"
                        className="w-full border border-slate-300 rounded pl-7 pr-3 py-1.5 font-mono text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Chức danh tư pháp / Chuyên môn</label>
                    <input
                      type="text"
                      value={userForm.roleTitle}
                      onChange={(e) => setUserForm({ ...userForm, roleTitle: e.target.value })}
                      placeholder="VD: Thẩm phán Trung cấp - Chánh án / Thư ký Tòa án"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Phòng ban / Đơn vị trực thuộc</label>
                    <input
                      type="text"
                      value={userForm.department}
                      onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                      placeholder="VD: Tòa Hình sự / Văn phòng tổng hợp"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Hộp thư điện tử công vụ</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      placeholder="email@toaan.gov.vn"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Số điện thoại liên hệ</label>
                    <input
                      type="text"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      placeholder="09xx.xxx.xxx"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 font-medium"
                    />
                  </div>
                </div>

                {/* Avatar Color Picker */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1.5">
                    Màu sắc huy hiệu đại diện (Avatar Color)
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {avatarColorOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setUserForm({ ...userForm, avatarColor: opt.value })}
                        className={`px-3 py-1.5 rounded-full flex items-center gap-2 border text-xs font-semibold transition-all ${
                          userForm.avatarColor === opt.value
                            ? 'ring-2 ring-blue-600 border-white shadow-sm'
                            : 'border-slate-300 bg-white hover:bg-slate-100'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${opt.value}`}></span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu Thông Tin Cán Bộ "{userForm.fullName}"</span>
                  </button>
                </div>
              </form>

              {/* Quick User List Table */}
              <div className="bg-white border border-slate-300 rounded-lg p-3.5 shadow-2xs">
                <div className="font-bold text-slate-800 text-xs mb-2 flex items-center justify-between">
                  <span>DANH SÁCH TÀI KHOẢN CÁN BỘ TRONG ĐƠN VỊ ({accounts.length})</span>
                  <span className="text-slate-500 font-normal">Nhấp chuột vào dòng để chỉnh sửa</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10.5px]">
                      <tr>
                        <th className="p-2 border-b">Họ và tên</th>
                        <th className="p-2 border-b">Tên đăng nhập</th>
                        <th className="p-2 border-b">Chức vụ / Chức danh</th>
                        <th className="p-2 border-b">Phòng ban</th>
                        <th className="p-2 border-b text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {accounts.map((acc) => (
                        <tr
                          key={acc.id}
                          onClick={() => setSelectedAccountUserId(acc.id)}
                          className={`cursor-pointer hover:bg-blue-50/50 transition-colors ${
                            selectedAccountUserId === acc.id ? 'bg-blue-50 font-semibold' : ''
                          }`}
                        >
                          <td className="p-2 flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-full ${acc.avatarColor || 'bg-red-700'} text-white flex items-center justify-center font-bold text-[10px]`}>
                              {acc.fullName.split(' ').slice(-1)[0][0]}
                            </span>
                            <span>{acc.fullName}</span>
                            {acc.id === currentUser.id && (
                              <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-bold">Bạn</span>
                            )}
                          </td>
                          <td className="p-2 font-mono text-slate-600">@{acc.username}</td>
                          <td className="p-2 text-slate-700">{acc.roleTitle}</td>
                          <td className="p-2 text-slate-600">{acc.department}</td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAccountUserId(acc.id);
                              }}
                              className="px-2 py-0.5 bg-blue-100 text-blue-900 hover:bg-blue-200 rounded font-bold text-[10.5px]"
                            >
                              Sửa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: RESOLUTION TARGETS & QUOTAS ================= */}
          {activeTab === 'TARGETS' && (
            <form onSubmit={handleSaveTargets} className="space-y-4">
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-rose-600 text-white rounded font-bold">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-950 text-xs uppercase tracking-wide">
                      Chỉ Tiêu Thi Đua Giải Quyết Vụ Việc & Định Mức Thẩm Phán
                    </h3>
                    <p className="text-[11px] text-rose-900 mt-0.5">
                      Căn cứ Nghị quyết của Quốc hội và Quyết định giao chỉ tiêu công tác hàng năm của TAND Tối cao / VKSND Tối cao
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetTargetsToStandard}
                  className="px-3 py-1.5 bg-white border border-rose-300 hover:bg-rose-100 rounded text-rose-900 font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục chỉ tiêu chuẩn Quốc hội</span>
                </button>
              </div>

              {/* General targets container */}
              <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-b border-slate-200 pb-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Tên đợt giao chỉ tiêu / Nghị quyết căn cứ
                    </label>
                    <input
                      type="text"
                      value={targetsForm.targetTitle || ''}
                      onChange={(e) => setTargetsForm({ ...targetsForm, targetTitle: e.target.value })}
                      placeholder="VD: Nghị quyết số 96/2019/QH14 & Chỉ tiêu ngành năm 2026"
                      className="w-full border border-slate-300 rounded px-3 py-1.5 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      Năm thi đua / Năm công tác
                    </label>
                    <input
                      type="number"
                      value={targetsForm.evaluationYear || 2026}
                      onChange={(e) => setTargetsForm({ ...targetsForm, evaluationYear: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded px-3 py-1.5 font-bold"
                    />
                  </div>
                </div>

                {/* Percentage by category grid */}
                <div>
                  <div className="font-bold text-slate-900 mb-2 uppercase text-[11px] tracking-wide flex items-center justify-between">
                    <span>1. Chỉ tiêu tỷ lệ giải quyết tối thiểu theo từng loại vụ án (%):</span>
                    <span className="text-slate-500 font-normal">Điều chỉnh theo tỷ lệ % giao thi đua của đơn vị</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-red-50/60 border border-red-200 rounded">
                      <label className="block text-red-950 font-bold mb-1">1. Án Hình sự</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="50"
                          max="100"
                          value={targetsForm.hinhSuRate}
                          onChange={(e) => setTargetsForm({ ...targetsForm, hinhSuRate: Number(e.target.value) })}
                          className="w-full border border-red-300 rounded px-2.5 py-1.5 font-bold text-red-900 bg-white"
                          required
                        />
                        <span className="font-bold text-slate-600">%</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Chuẩn QH: 88%</div>
                    </div>

                    <div className="p-3 bg-blue-50/60 border border-blue-200 rounded">
                      <label className="block text-blue-950 font-bold mb-1">2. Án Dân sự</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="50"
                          max="100"
                          value={targetsForm.danSuRate}
                          onChange={(e) => setTargetsForm({ ...targetsForm, danSuRate: Number(e.target.value) })}
                          className="w-full border border-blue-300 rounded px-2.5 py-1.5 font-bold text-blue-900 bg-white"
                          required
                        />
                        <span className="font-bold text-slate-600">%</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Chuẩn QH: 78%</div>
                    </div>

                    <div className="p-3 bg-amber-50/60 border border-amber-200 rounded">
                      <label className="block text-amber-950 font-bold mb-1">3. Hôn nhân & GĐ</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="50"
                          max="100"
                          value={targetsForm.honNhanRate}
                          onChange={(e) => setTargetsForm({ ...targetsForm, honNhanRate: Number(e.target.value) })}
                          className="w-full border border-amber-300 rounded px-2.5 py-1.5 font-bold text-amber-900 bg-white"
                          required
                        />
                        <span className="font-bold text-slate-600">%</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Chuẩn QH: 85%</div>
                    </div>

                    <div className="p-3 bg-purple-50/60 border border-purple-200 rounded">
                      <label className="block text-purple-950 font-bold mb-1">4. KD Thương mại</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="50"
                          max="100"
                          value={targetsForm.kdtmRate}
                          onChange={(e) => setTargetsForm({ ...targetsForm, kdtmRate: Number(e.target.value) })}
                          className="w-full border border-purple-300 rounded px-2.5 py-1.5 font-bold text-purple-900 bg-white"
                          required
                        />
                        <span className="font-bold text-slate-600">%</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Chuẩn QH: 75%</div>
                    </div>

                    <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded">
                      <label className="block text-emerald-950 font-bold mb-1">5. Án Hành chính</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="40"
                          max="100"
                          value={targetsForm.hanhChinhRate}
                          onChange={(e) => setTargetsForm({ ...targetsForm, hanhChinhRate: Number(e.target.value) })}
                          className="w-full border border-emerald-300 rounded px-2.5 py-1.5 font-bold text-emerald-900 bg-white"
                          required
                        />
                        <span className="font-bold text-slate-600">%</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Chuẩn QH: 60%</div>
                    </div>

                    <div className="p-3 bg-cyan-50/60 border border-cyan-200 rounded">
                      <label className="block text-cyan-950 font-bold mb-1">6. Án Lao động</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="50"
                          max="100"
                          value={targetsForm.laoDongRate}
                          onChange={(e) => setTargetsForm({ ...targetsForm, laoDongRate: Number(e.target.value) })}
                          className="w-full border border-cyan-300 rounded px-2.5 py-1.5 font-bold text-cyan-900 bg-white"
                          required
                        />
                        <span className="font-bold text-slate-600">%</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Chuẩn QH: 80%</div>
                    </div>

                    <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded">
                      <label className="block text-indigo-950 font-bold mb-1">7. Phá sản doanh nghiệp</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="40"
                          max="100"
                          value={targetsForm.phaSanRate}
                          onChange={(e) => setTargetsForm({ ...targetsForm, phaSanRate: Number(e.target.value) })}
                          className="w-full border border-indigo-300 rounded px-2.5 py-1.5 font-bold text-indigo-900 bg-white"
                          required
                        />
                        <span className="font-bold text-slate-600">%</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Chuẩn QH: 70%</div>
                    </div>

                    <div className="p-3 bg-gradient-to-br from-red-100 to-amber-100 border border-red-300 rounded">
                      <label className="block text-red-950 font-bold mb-1">Chỉ tiêu chung toàn viện</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="60"
                          max="100"
                          value={targetsForm.overallTargetRate}
                          onChange={(e) => setTargetsForm({ ...targetsForm, overallTargetRate: Number(e.target.value) })}
                          className="w-full border border-red-400 rounded px-2.5 py-1.5 font-bold text-red-950 bg-white"
                          required
                        />
                        <span className="font-bold text-slate-600">%</span>
                      </div>
                      <div className="text-[10px] text-slate-600 mt-1">Toàn diện: ≥ 85%</div>
                    </div>
                  </div>
                </div>

                {/* Additional criteria: quotas and max cancel/modify */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="font-bold text-slate-900 mb-2 uppercase text-[11px] tracking-wide">
                    2. Định mức cá nhân & Chỉ tiêu chất lượng xét xử:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <label className="block text-slate-700 font-semibold mb-1">
                        Định mức giải quyết của Thẩm phán
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={targetsForm.judgeMonthlyQuota}
                          onChange={(e) => setTargetsForm({ ...targetsForm, judgeMonthlyQuota: Number(e.target.value) })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold"
                          required
                        />
                        <span className="text-slate-600 font-semibold whitespace-nowrap">vụ / tháng</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <label className="block text-slate-700 font-semibold mb-1">
                        Tỷ lệ án quá hạn tối đa cho phép
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={targetsForm.maxOverdueRate}
                          onChange={(e) => setTargetsForm({ ...targetsForm, maxOverdueRate: Number(e.target.value) })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold text-red-700"
                          required
                        />
                        <span className="text-slate-600 font-semibold">%</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Tuyệt đối không để quá hạn (0%)</div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                      <label className="block text-slate-700 font-semibold mb-1">
                        Tỷ lệ án bị hủy, sửa do lỗi chủ quan
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={targetsForm.maxCancelModifyRate}
                          onChange={(e) => setTargetsForm({ ...targetsForm, maxCancelModifyRate: Number(e.target.value) })}
                          className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold text-amber-700"
                          required
                        />
                        <span className="text-slate-600 font-semibold">%</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">Quy định ngành: không quá 1.5%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded font-semibold text-slate-700"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#991B1B] hover:bg-[#7F1D1D] text-white rounded font-bold flex items-center gap-2 shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu & Áp Dụng Chỉ Tiêu Mới</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= TAB 4: TEMPLATES MANAGEMENT ================= */}
          {activeTab === 'TEMPLATES' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-700 text-white rounded font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-950 text-xs uppercase tracking-wide">
                      Hệ Thống Biểu Mẫu Tố Tụng & Điền Thẻ Tự Động ({templates.length} mẫu)
                    </h3>
                    <p className="text-[11px] text-emerald-900 mt-0.5">
                      Bao gồm đầy đủ các mẫu Quyết định phân công, Quyết định đưa ra xét xử, Lệnh tạm giam theo NQ 05/2017/NQ-HĐTP
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {onOpenWordUploader && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenWordUploader();
                      }}
                      className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <FileUp className="w-4 h-4 text-amber-300" />
                      <span>Tải file Word (.docx)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenTemplateManagerModal();
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Mở Trình Biên Tập Mẫu Chi Tiết</span>
                  </button>
                </div>
              </div>

              {/* Quick Template Cards */}
              <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs space-y-3">
                <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                  <span>DANH MỤC BIỂU MẪU ĐANG KÍCH HOẠT:</span>
                  <span className="text-slate-500 font-normal">Hỗ trợ tự động điền các thông tin đương sự, thẩm phán, cơ quan</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {templates.slice(0, 6).map((tpl) => (
                    <div
                      key={tpl.id}
                      className="p-3 border border-slate-200 hover:border-emerald-500 rounded bg-slate-50/50 hover:bg-white transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-900 text-xs">{tpl.name}</span>
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono text-[10px] font-bold">
                          {tpl.code}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] line-clamp-2">{tpl.description}</p>
                      <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/80">
                        <span>Căn cứ: {tpl.applicableLaw || 'Bộ luật Tố tụng'}</span>
                        <span className="text-emerald-700 font-semibold">Tự động điền thẻ</span>
                      </div>
                    </div>
                  ))}
                </div>

                {templates.length > 6 && (
                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenTemplateManagerModal();
                      }}
                      className="text-emerald-700 hover:text-emerald-900 font-bold text-xs underline"
                    >
                      Xem thêm và tùy biến {templates.length - 6} biểu mẫu khác &rarr;
                    </button>
                  </div>
                )}
              </div>

              {/* Tag Cheat Sheet */}
              <div className="bg-slate-100 border border-slate-300 rounded-lg p-3.5 space-y-2">
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-700" />
                  <span>Bảng mã thẻ điền tự động (Dynamic Placeholder Tags) dùng trong soạn thảo:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong className="text-red-700">&#123;&#123;TEN_TOA_AN&#125;&#125;</strong>: Tên đơn vị
                  </div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong className="text-red-700">&#123;&#123;QUAN_HUYEN&#125;&#125;</strong>: Huyện / Khu vực
                  </div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong className="text-red-700">&#123;&#123;TINH_TP&#125;&#125;</strong>: Tỉnh / Thành phố
                  </div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong className="text-red-700">&#123;&#123;CHANH_AN&#125;&#125;</strong>: Thủ trưởng
                  </div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong className="text-blue-700">&#123;&#123;SO_THU_LY&#125;&#125;</strong>: Số thụ lý
                  </div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong className="text-blue-700">&#123;&#123;MA_VU_VIEC&#125;&#125;</strong>: Mã vụ việc
                  </div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong className="text-blue-700">&#123;&#123;TEN_BI_CAN&#125;&#125;</strong>: Tên bị can/đương sự
                  </div>
                  <div className="p-1.5 bg-white border border-slate-200 rounded">
                    <strong className="text-blue-700">&#123;&#123;THAM_PHAN&#125;&#125;</strong>: Thẩm phán
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: BACKUP & RESTORE ================= */}
          {activeTab === 'BACKUP' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-2xs space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <h3 className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5 text-xs">
                    <Download className="w-4 h-4 text-slate-700" />
                    <span>Xuất & Nhập Tệp Tin Cấu Hình Hệ Thống</span>
                  </h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Lưu trữ dự phòng toàn bộ thông tin đơn vị, hồ sơ người dùng, chỉ tiêu và biểu mẫu ra tệp tin JSON hoặc chuyển sang máy tính khác
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Export Box */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between space-y-3">
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Download className="w-4 h-4 text-blue-700" />
                        <span>Xuất tệp sao lưu cấu hình (.JSON)</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                        Tải về tệp cấu hình chứa đầy đủ tên đơn vị ({settings.courtName}), các chỉ tiêu nghiệp vụ và danh sách cán bộ.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportConfig}
                      className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold text-xs flex items-center justify-center gap-2 shadow-2xs"
                    >
                      <Download className="w-4 h-4" />
                      <span>Tải Về Tệp Cấu Hình JSON</span>
                    </button>
                  </div>

                  {/* Import Box */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-between space-y-3">
                    <div>
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-emerald-700" />
                        <span>Phục hồi cấu hình từ tệp tin</span>
                      </div>
                      <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                        Chọn tệp JSON cấu hình đã lưu trước đó để khôi phục nhanh tên đơn vị và người dùng.
                      </p>
                    </div>
                    <label className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-2xs text-center">
                      <Upload className="w-4 h-4" />
                      <span>Chọn Tệp JSON Để Phục Hồi</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportConfig}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Reset to Factory Defaults */}
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-red-950 text-xs flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4 text-red-700" />
                      <span>Khôi phục toàn bộ cài đặt gốc</span>
                    </div>
                    <p className="text-red-900/80 text-[11px] mt-0.5">
                      Đưa tên đơn vị, hồ sơ cán bộ và chỉ tiêu thi đua về mặc định nguyên bản của hệ thống
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn khôi phục toàn bộ cài đặt đơn vị, người dùng và chỉ tiêu về mặc định ban đầu?')) {
                        onSaveSettings(DEFAULT_COURT_SETTINGS);
                        setUnitForm(DEFAULT_COURT_SETTINGS);
                        onSaveTargets(DEFAULT_RESOLUTION_TARGETS);
                        setTargetsForm(DEFAULT_RESOLUTION_TARGETS);
                        onSaveAccounts(INITIAL_ACCOUNTS);
                        onSaveCurrentUser(INITIAL_ACCOUNTS[0]);
                        onSaveOfficials(INITIAL_OFFICIALS);
                        onSaveTemplates(DEFAULT_TEMPLATES);
                        showNotification('Đã khôi phục toàn bộ cấu hình hệ thống về mặc định!');
                      }
                    }}
                    className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold text-xs shadow-2xs shrink-0"
                  >
                    Khôi phục mặc định
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
