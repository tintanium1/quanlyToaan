import React, { useState } from 'react';
import { DocumentTemplate, CourtCase, CourtUnitSettings } from '../types/court';
import { DEFAULT_TEMPLATES, NQ05_CRIMINAL_TEMPLATES, renderTemplateWithCase } from '../data/defaultTemplates';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  RotateCcw, 
  Eye, 
  Check, 
  X, 
  Tag, 
  AlertTriangle,
  FileCheck,
  Search,
  BookOpen,
  Award,
  FileUp
} from 'lucide-react';
import { WordTemplateUploaderModal } from './WordTemplateUploaderModal';

interface TemplateManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: DocumentTemplate[];
  onSaveTemplates: (templates: DocumentTemplate[]) => void;
  cases: CourtCase[];
  settings: CourtUnitSettings;
}

export const TemplateManagementModal: React.FC<TemplateManagementModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSaveTemplates,
  cases,
  settings,
}) => {
  if (!isOpen) return null;

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Add/Edit Modal
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState<'ALL' | 'HINH_SU' | 'DAN_SU' | 'HON_NHAN' | 'KDTM' | 'HANH_CHINH' | 'LAO_DONG'>('ALL');
  const [formLaw, setFormLaw] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formBody, setFormBody] = useState('');

  // State for Preview
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate | null>(null);
  const [previewCaseId, setPreviewCaseId] = useState<string>(cases[0]?.id || '');

  // Delete confirm
  const [templateToDelete, setTemplateToDelete] = useState<DocumentTemplate | null>(null);

  // Word Uploader Modal state
  const [isWordUploaderOpen, setIsWordUploaderOpen] = useState<boolean>(false);

  const filteredTemplates = templates.filter((t) => {
    if (categoryFilter !== 'ALL' && t.category !== categoryFilter) return false;
    if (categoryFilter === 'HINH_SU' && stageFilter !== 'ALL' && t.stage !== stageFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        (t.formNumber && t.formNumber.toLowerCase().includes(q)) ||
        (t.stage && t.stage.toLowerCase().includes(q)) ||
        (t.resolution && t.resolution.toLowerCase().includes(q)) ||
        t.applicableLaw.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingTemplate(null);
    setFormName('');
    setFormCode(`MAU_${Date.now().toString().slice(-4)}`);
    setFormCategory('ALL');
    setFormLaw('Bộ luật Tố tụng hiện hành');
    setFormDesc('');
    setFormBody(DEFAULT_TEMPLATES[0].templateBody);
  };

  const handleStartEdit = (t: DocumentTemplate) => {
    setEditingTemplate(t);
    setIsAddingNew(false);
    setFormName(t.name);
    setFormCode(t.code);
    setFormCategory(t.category);
    setFormLaw(t.applicableLaw);
    setFormDesc(t.description);
    setFormBody(t.templateBody);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formBody.trim()) {
      alert('Vui lòng điền đầy đủ Tên biểu mẫu và Nội dung mẫu!');
      return;
    }

    if (isAddingNew) {
      const newTmpl: DocumentTemplate = {
        id: 'tmpl-' + Date.now(),
        name: formName.trim(),
        code: formCode.trim() || `MAU_${Date.now().toString().slice(-4)}`,
        category: formCategory,
        applicableLaw: formLaw.trim() || 'Quy định pháp luật tố tụng',
        description: formDesc.trim() || 'Biểu mẫu do Tòa án cấu hình tự động điền.',
        isSystem: false,
        templateBody: formBody,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onSaveTemplates([...templates, newTmpl]);
    } else if (editingTemplate) {
      const updated = templates.map((t) =>
        t.id === editingTemplate.id
          ? {
              ...t,
              name: formName.trim(),
              code: formCode.trim(),
              category: formCategory,
              applicableLaw: formLaw.trim(),
              description: formDesc.trim(),
              templateBody: formBody,
              updatedAt: new Date().toISOString(),
            }
          : t
      );
      onSaveTemplates(updated);
    }

    setIsAddingNew(false);
    setEditingTemplate(null);
  };

  const handleConfirmDelete = () => {
    if (!templateToDelete) return;
    const remaining = templates.filter((t) => t.id !== templateToDelete.id);
    onSaveTemplates(remaining);
    setTemplateToDelete(null);
  };

  const handleResetToDefaults = () => {
    if (confirm('Khôi phục lại toàn bộ danh mục biểu mẫu tố tụng chuẩn ban đầu của Tòa án nhân dân?')) {
      onSaveTemplates(DEFAULT_TEMPLATES);
    }
  };

  const handleLoadFullNQ05Suite = () => {
    if (confirm('Nạp và cập nhật đầy đủ toàn bộ bộ mẫu Hình sự chuẩn theo Nghị quyết số 05/2017/NQ-HĐTP (TANDTC)?')) {
      const nonNQ05 = templates.filter((t) => !t.code?.startsWith('MAU_') || !t.code?.endsWith('_HS'));
      onSaveTemplates([...nonNQ05, ...NQ05_CRIMINAL_TEMPLATES]);
      setCategoryFilter('HINH_SU');
      setStageFilter('ALL');
    }
  };

  const insertTag = (tag: string) => {
    setFormBody((prev) => prev + tag);
  };

  const selectedCaseForPreview = cases.find((c) => c.id === previewCaseId) || cases[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#991B1B] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-bold text-base md:text-lg tracking-wide uppercase">
                Hệ Thống Quản Lý Biểu Mẫu Tố Tụng Tự Động Điền
              </h2>
              <div className="text-[11px] text-amber-200">
                Bao gồm đầy đủ 60 biểu mẫu Hình sự chuẩn Nghị quyết số 05/2017/NQ-HĐTP & các mẫu tố tụng khác
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

        {/* Toolbar */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-white border border-slate-300 rounded p-0.5">
              {[
                { key: 'ALL', label: 'Tất cả' },
                { key: 'HINH_SU', label: 'Bộ mẫu NQ 05 (Hình sự)' },
                { key: 'DAN_SU', label: 'Dân sự & HNGĐ' },
                { key: 'KDTM', label: 'Kinh doanh, TM' },
                { key: 'HANH_CHINH', label: 'Hành chính' },
                { key: 'LAO_DONG', label: 'Lao động' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setCategoryFilter(tab.key);
                    if (tab.key !== 'HINH_SU') setStageFilter('ALL');
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                    categoryFilter === tab.key
                      ? 'bg-red-700 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-56">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã mẫu, 04-HS, tạm giam..."
                className="w-full pl-7 pr-3 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadFullNQ05Suite}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Khôi phục hoặc nạp đủ 60 mẫu hình sự NQ 05/2017/NQ-HĐTP"
            >
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>Nạp 60 mẫu NQ 05/2017</span>
            </button>

            <button
              onClick={handleResetToDefaults}
              className="px-3 py-1.5 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-semibold text-xs flex items-center gap-1 transition-colors"
              title="Khôi phục lại toàn bộ mẫu chuẩn ban đầu"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Khôi phục tất cả</span>
            </button>

            <button
              type="button"
              onClick={() => setIsWordUploaderOpen(true)}
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              title="Tải lên tệp Word (.docx) để hệ thống tự động trích xuất và tạo biểu mẫu nhanh chóng"
            >
              <FileUp className="w-3.5 h-3.5 text-amber-300" />
              <span>Tải file Word (.docx)</span>
            </button>

            <button
              onClick={handleStartAdd}
              className="px-3.5 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm biểu mẫu mới</span>
            </button>
          </div>
        </div>

        {/* Sub-toolbar for Criminal Stages */}
        {categoryFilter === 'HINH_SU' && (
          <div className="bg-amber-50/80 border-b border-amber-200 px-5 py-1.5 flex flex-wrap items-center gap-1.5 text-[11px] shrink-0">
            <span className="font-bold text-red-950 mr-1 flex items-center gap-1">
              <Award className="w-3 h-3 text-red-700" />
              Giai đoạn NQ 05/2017:
            </span>
            {[
              { key: 'ALL', label: 'Tất cả 60 mẫu' },
              { key: 'Phân công & Chuẩn bị', label: '1. Phân công & Chuẩn bị' },
              { key: 'Tạm giam & Biện pháp ngăn chặn', label: '2. Tạm giam & Ngăn chặn' },
              { key: 'Phiên tòa & Nghị án', label: '3. Phiên tòa & Nghị án' },
              { key: 'Bản án & Quyết định', label: '4. Bản án & Quyết định' },
              { key: 'Trả hồ sơ & Đình chỉ', label: '5. Trả hồ sơ & Đình chỉ' },
              { key: 'Kháng cáo & Phúc thẩm', label: '6. Kháng cáo & Phúc thẩm' },
              { key: 'Giám đốc thẩm & Khởi tố', label: '7. Giám đốc thẩm & Khởi tố' },
            ].map((stg) => (
              <button
                key={stg.key}
                onClick={() => setStageFilter(stg.key)}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  stageFilter === stg.key
                    ? 'bg-red-800 text-white shadow-2xs'
                    : 'bg-white hover:bg-amber-100 text-slate-700 border border-amber-200'
                }`}
              >
                {stg.label}
              </button>
            ))}
          </div>
        )}

        {/* Content Body: Templates List */}
        <div className="p-5 overflow-y-auto flex-1 text-xs space-y-3 bg-[#F8FAFC]">
          {filteredTemplates.length === 0 ? (
            <div className="p-10 text-center text-slate-400 bg-white border border-slate-200 rounded">
              Không tìm thấy biểu mẫu nào phù hợp với bộ lọc.
            </div>
          ) : (
            filteredTemplates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="bg-white border border-slate-300 hover:border-amber-400 rounded-lg p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {tmpl.formNumber ? (
                      <span className="font-mono font-bold text-white bg-red-800 px-2 py-0.5 rounded text-[11px] shadow-2xs">
                        Mẫu số {tmpl.formNumber}
                      </span>
                    ) : (
                      <span className="font-mono font-bold text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[11px]">
                        {tmpl.code}
                      </span>
                    )}

                    {tmpl.resolution && (
                      <span className="bg-amber-100 border border-amber-300 text-amber-950 font-bold px-1.5 py-0.5 rounded text-[10px]">
                        {tmpl.resolution}
                      </span>
                    )}

                    {tmpl.stage && (
                      <span className="bg-slate-100 border border-slate-200 text-slate-800 font-medium px-2 py-0.5 rounded text-[10px]">
                        {tmpl.stage}
                      </span>
                    )}

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tmpl.category === 'HINH_SU'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : tmpl.category === 'DAN_SU'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : tmpl.category === 'KDTM'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : tmpl.category === 'HANH_CHINH'
                          ? 'bg-purple-50 text-purple-800 border border-purple-200'
                          : 'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {tmpl.category === 'ALL'
                        ? 'Áp dụng chung'
                        : tmpl.category === 'HINH_SU'
                        ? 'Án Hình sự'
                        : tmpl.category === 'DAN_SU'
                        ? 'Án Dân sự'
                        : tmpl.category === 'KDTM'
                        ? 'Kinh doanh, TM'
                        : tmpl.category === 'HANH_CHINH'
                        ? 'Hành chính'
                        : 'Lao động'}
                    </span>
                    {tmpl.isSystem && (
                      <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                        Mẫu chuẩn TAND
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{tmpl.name}</h3>
                  <p className="text-slate-600">{tmpl.description}</p>
                  <div className="text-slate-500 text-[11px] italic">
                    Căn cứ pháp lý: <span className="font-medium text-slate-700">{tmpl.applicableLaw}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => setPreviewTemplate(tmpl)}
                    className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                    title="Xem thử kết quả tự động điền với dữ liệu vụ án"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-700" />
                    <span>Xem thử tự điền</span>
                  </button>

                  <button
                    onClick={() => handleStartEdit(tmpl)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-semibold text-xs transition-colors flex items-center gap-1"
                    title="Chỉnh sửa nội dung biểu mẫu này"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Chỉnh sửa</span>
                  </button>

                  <button
                    onClick={() => setTemplateToDelete(tmpl)}
                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded transition-colors"
                    title="Xóa biểu mẫu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-300 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-semibold text-xs transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>

      {/* MODAL 1: ADD OR EDIT TEMPLATE */}
      {(isAddingNew || editingTemplate) && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
            <div className="bg-[#991B1B] text-white px-5 py-3 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm uppercase">
                {isAddingNew ? 'Thêm Biểu Mẫu Tố Tụng Mới' : `Chỉnh Sửa Biểu Mẫu: ${editingTemplate?.code}`}
              </h3>
              <button
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingTemplate(null);
                }}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tên biểu mẫu quyết định / lệnh <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="VD: Quyết định tạm hoãn phiên tòa sơ thẩm"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Mã ký hiệu biểu mẫu
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="VD: MAU_09_TH"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs font-mono focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Phân hệ loại án áp dụng
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                  >
                    <option value="ALL">Áp dụng chung (Hình sự & Dân sự...)</option>
                    <option value="HINH_SU">Án Hình sự</option>
                    <option value="DAN_SU">Án Dân sự</option>
                    <option value="HON_NHAN">Hôn nhân & Gia đình</option>
                    <option value="KDTM">Kinh doanh, Thương mại</option>
                    <option value="HANH_CHINH">Án Hành chính</option>
                    <option value="LAO_DONG">Án Lao động</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Căn cứ pháp lý viện dẫn
                  </label>
                  <input
                    type="text"
                    value={formLaw}
                    onChange={(e) => setFormLaw(e.target.value)}
                    placeholder="VD: Điều 297 Bộ luật Tố tụng Hình sự 2015"
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Mô tả mục đích sử dụng
                </label>
                <input
                  type="text"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Mô tả khi nào cần sử dụng biểu mẫu này..."
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              {/* Tag Quick Inserters */}
              <div className="bg-amber-50 border border-amber-300 rounded p-3 space-y-2">
                <div className="font-bold text-amber-900 flex items-center gap-1.5 text-[11px] uppercase">
                  <Tag className="w-3.5 h-3.5 text-amber-700" />
                  <span>Bấm vào thẻ bên dưới để chèn biến tự động điền vào nội dung biểu mẫu:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { tag: '{{TEN_TOA_AN}}', label: 'Tên Tòa án' },
                    { tag: '{{TINH_THANH}}', label: 'Tỉnh/TP' },
                    { tag: '{{SO_QUYET_DINH}}', label: 'Số Quyết định' },
                    { tag: '{{NGAY_BAN_HANH}}', label: 'Ngày ban hành' },
                    { tag: '{{SO_THU_LY}}', label: 'Số thụ lý' },
                    { tag: '{{NGAY_THU_LY}}', label: 'Ngày thụ lý' },
                    { tag: '{{MA_VU_VIEC}}', label: 'Mã vụ việc' },
                    { tag: '{{TEN_VU_AN}}', label: 'Tên vụ án' },
                    { tag: '{{TOI_DANH_HOAC_TRANH_CHAP}}', label: 'Tội danh/Tranh chấp' },
                    { tag: '{{THAM_PHAN}}', label: 'Thẩm phán' },
                    { tag: '{{NGACH_THAM_PHAN}}', label: 'Ngạch Thẩm phán' },
                    { tag: '{{THU_KY}}', label: 'Thư ký' },
                    { tag: '{{HOI_THAM_NHAN_DAN}}', label: 'Hội thẩm nhân dân' },
                    { tag: '{{CHANH_AN}}', label: 'Chánh án' },
                    { tag: '{{BI_CAN_BI_CAO}}', label: 'Bị can/Bị cáo' },
                    { tag: '{{NGUYEN_DON}}', label: 'Nguyên đơn' },
                    { tag: '{{BI_DON}}', label: 'Bị đơn' },
                    { tag: '{{DUONG_SU}}', label: 'Đương sự vụ án' },
                    { tag: '{{THOI_HAN_TAM_GIAM}}', label: 'Thời hạn tạm giam' },
                    { tag: '{{NGAY_HET_HAN_TAM_GIAM}}', label: 'Ngày hết hạn tạm giam' },
                    { tag: '{{CAN_CU_PHAP_LY}}', label: 'Căn cứ/Cáo trạng' },
                  ].map((item) => (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => insertTag(item.tag)}
                      className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px] font-mono transition-colors"
                      title={`Chèn mã: ${item.tag}`}
                    >
                      + {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Template Body Editor */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nội dung chi tiết biểu mẫu (Định dạng HTML có hỗ trợ mã tự động điền) <span className="text-red-600">(*)</span>
                </label>
                <textarea
                  value={formBody}
                  onChange={(e) => setFormBody(e.target.value)}
                  rows={14}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-3 font-mono text-[11px] focus:ring-1 focus:ring-red-600 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setEditingTemplate(null);
                  }}
                  className="px-4 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{isAddingNew ? 'Tạo biểu mẫu mới' : 'Lưu cập nhật'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PREVIEW AUTO-FILL */}
      {previewTemplate && selectedCaseForPreview && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
            <div className="bg-[#991B1B] text-white px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm uppercase">
                  Xem Trước Kết Quả Tự Động Điền Dữ Liệu
                </h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Chọn vụ án thử nghiệm:</span>
                <select
                  value={previewCaseId}
                  onChange={(e) => setPreviewCaseId(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-medium text-slate-800 focus:ring-1 focus:ring-red-600 focus:outline-none"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.caseType}] {c.docketNumber} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                ✓ Đã thay thế thành công toàn bộ biến dữ liệu của vụ việc
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-200 flex justify-center">
              <div 
                className="bg-white shadow-md p-8 md:p-12 w-full max-w-[210mm] min-h-[297mm] text-slate-900 font-serif leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: renderTemplateWithCase(previewTemplate, selectedCaseForPreview, settings),
                }}
              />
            </div>

            <div className="p-3 bg-slate-100 border-t border-slate-300 text-right shrink-0">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-semibold text-xs transition-colors"
              >
                Đóng xem trước
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION */}
      {templateToDelete && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-red-700 text-white px-4 py-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-sm uppercase">Xác Nhận Xóa Biểu Mẫu</h3>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <p className="text-slate-700">
                Bạn có chắc chắn muốn xóa biểu mẫu: <strong>{templateToDelete.name}</strong> ({templateToDelete.code}) ra khỏi hệ thống không?
              </p>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setTemplateToDelete(null)}
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

      {/* MODAL 4: WORD TEMPLATE UPLOADER (.DOCX) */}
      <WordTemplateUploaderModal
        isOpen={isWordUploaderOpen}
        onClose={() => setIsWordUploaderOpen(false)}
        onSaveTemplate={(newTmpl) => {
          onSaveTemplates([...templates, newTmpl]);
          setIsWordUploaderOpen(false);
        }}
        cases={cases}
        settings={settings}
      />
    </div>
  );
};
