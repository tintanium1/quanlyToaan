import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import { DocumentTemplate, CaseType, CourtCase, CourtUnitSettings } from '../types/court';
import { 
  FileUp, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Sparkles, 
  Tag, 
  RotateCcw, 
  Save, 
  X, 
  Download,
  Info,
  Check,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import { renderTemplateWithCase } from '../data/defaultTemplates';

interface WordTemplateUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTemplate: (template: DocumentTemplate) => void;
  cases: CourtCase[];
  settings: CourtUnitSettings;
}

export const WordTemplateUploaderModal: React.FC<WordTemplateUploaderModalProps> = ({
  isOpen,
  onClose,
  onSaveTemplate,
  cases,
  settings,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Template metadata
  const [templateName, setTemplateName] = useState<string>('');
  const [templateCode, setTemplateCode] = useState<string>('');
  const [category, setCategory] = useState<'ALL' | 'HINH_SU' | 'DAN_SU' | 'HON_NHAN' | 'KDTM' | 'HANH_CHINH' | 'LAO_DONG'>('ALL');
  const [applicableLaw, setApplicableLaw] = useState<string>('Bộ luật Tố tụng hiện hành');
  const [description, setDescription] = useState<string>('Biểu mẫu được tải lên từ file Word (.docx)');
  const [templateBody, setTemplateBody] = useState<string>('');
  const [detectedPlaceholders, setDetectedPlaceholders] = useState<string[]>([]);
  const [previewCaseId, setPreviewCaseId] = useState<string>(cases[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'PREVIEW'>('CONTENT');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  // Placeholder definitions for 1-click injection
  const COMMON_TAGS = [
    { tag: '{{TEN_TOA_AN}}', desc: 'Tên Tòa án (VD: TÒA ÁN NHÂN DÂN KHU VỰC 12 - ĐẮK LẮK)' },
    { tag: '{{SO_VU_AN}}', desc: 'Số thụ lý vụ án (VD: 27/2026/TLST-HS)' },
    { tag: '{{TEN_VU_AN}}', desc: 'Tiêu đề / Quan hệ pháp luật vụ án' },
    { tag: '{{TOI_DANH}}', desc: 'Tội danh / Tranh chấp khởi kiện' },
    { tag: '{{HO_TEN_BI_CAO}}', desc: 'Họ tên Bị cáo / Đương sự chính' },
    { tag: '{{THAM_PHAN_CHU_TOA}}', desc: 'Thẩm phán chủ tọa phiên tòa' },
    { tag: '{{THU_KY}}', desc: 'Thư ký phiên tòa' },
    { tag: '{{HOI_THAM}}', desc: 'Danh sách Hội thẩm nhân dân' },
    { tag: '{{NGAY_THU_LY}}', desc: 'Ngày Tòa án thụ lý' },
    { tag: '{{NGAY_XET_XU}}', desc: 'Ngày mở phiên tòa' },
    { tag: '{{DIA_DIEM_XET_XU}}', desc: 'Phòng xử án / Địa điểm' },
    { tag: '{{NGAY_HIEN_TAI}}', desc: 'Ngày tháng năm hiện tại' },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    await processUploadedFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;
    await processUploadedFile(droppedFile);
  };

  const processUploadedFile = async (uploadedFile: File) => {
    setError(null);
    setFile(uploadedFile);
    setFileName(uploadedFile.name);
    setFileSize((uploadedFile.size / 1024).toFixed(1) + ' KB');
    setIsProcessing(true);

    try {
      const lowerName = uploadedFile.name.toLowerCase();
      let extractedText = '';

      if (lowerName.endsWith('.docx')) {
        // Read docx using mammoth
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value;
      } else if (lowerName.endsWith('.txt') || lowerName.endsWith('.rtf') || lowerName.endsWith('.html')) {
        // Standard text reading
        extractedText = await uploadedFile.text();
      } else {
        // Fallback: try reading arrayBuffer with mammoth or text
        try {
          const arrayBuffer = await uploadedFile.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          extractedText = result.value;
        } catch {
          extractedText = await uploadedFile.text();
        }
      }

      if (!extractedText.trim()) {
        throw new Error('Không thể trích xuất nội dung từ tệp. Vui lòng kiểm tra định dạng tệp .docx chuẩn.');
      }

      // Format line breaks cleanly
      const cleanBody = extractedText
        .split('\n')
        .map(line => line.trim())
        .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
        .join('\n');

      setTemplateBody(cleanBody);

      // Auto-detect Title
      const rawTitle = uploadedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      let detectedName = rawTitle;
      const lines = cleanBody.split('\n').filter(l => l.trim().length > 0);
      
      // Look for uppercase headings in first 10 lines
      for (const line of lines.slice(0, 10)) {
        const upper = line.toUpperCase();
        if (
          upper.includes('QUYẾT ĐỊNH') || 
          upper.includes('BẢN ÁN') || 
          upper.includes('GIẤY TRIỆU TẬP') || 
          upper.includes('LỆNH') || 
          upper.includes('THÔNG BÁO') ||
          upper.includes('BIÊN BẢN')
        ) {
          detectedName = line.trim();
          break;
        }
      }
      setTemplateName(detectedName);

      // Auto-detect Code
      let detectedCode = `MAU_WORD_${Date.now().toString().slice(-4)}`;
      const codeMatch = cleanBody.match(/Mẫu số\s*([0-9a-zA-Z\-_/]+)/i) || uploadedFile.name.match(/([0-9]{1,2}[-_][a-zA-Z]{2,4})/);
      if (codeMatch && codeMatch[1]) {
        detectedCode = `MAU_${codeMatch[1].toUpperCase()}`;
      }
      setTemplateCode(detectedCode);

      // Auto-detect Category
      const fullUpper = cleanBody.toUpperCase();
      if (fullUpper.includes('HÌNH SỰ') || fullUpper.includes('TỘI DANH') || fullUpper.includes('BỊ CÁO') || fullUpper.includes('TẠM GIAM')) {
        setCategory('HINH_SU');
        setApplicableLaw('Bộ luật Tố tụng hình sự 2015 & NQ 05/2017/NQ-HĐTP');
      } else if (fullUpper.includes('HÔN NHÂN') || fullUpper.includes('LY HÔN') || fullUpper.includes('CON CHUNG')) {
        setCategory('HON_NHAN');
        setApplicableLaw('Luật Hôn nhân & Gia đình 2014 & BLTTDS 2015');
      } else if (fullUpper.includes('KINH DOANH') || fullUpper.includes('THƯƠNG MẠI') || fullUpper.includes('TÍN DỤNG') || fullUpper.includes('DOANH NGHIỆP')) {
        setCategory('KDTM');
        setApplicableLaw('Bộ luật Tố tụng Dân sự 2015 & Luật Thương mại');
      } else if (fullUpper.includes('LAO ĐỘNG') || fullUpper.includes('SA THẢI') || fullUpper.includes('TIỀN LƯƠNG')) {
        setCategory('LAO_DONG');
        setApplicableLaw('Bộ luật Lao động 2019 & BLTTDS 2015');
      } else if (fullUpper.includes('HÀNH CHÍNH') || fullUpper.includes('UBND') || fullUpper.includes('THU HỒI ĐẤT')) {
        setCategory('HANH_CHINH');
        setApplicableLaw('Luật Tố tụng Hành chính 2015');
      } else if (fullUpper.includes('DÂN SỰ') || fullUpper.includes('TRANH CHẤP') || fullUpper.includes('NGUYÊN ĐƠN')) {
        setCategory('DAN_SU');
        setApplicableLaw('Bộ luật Dân sự 2015 & BLTTDS 2015');
      }

      // Detect existing placeholders
      const placeholderMatches = cleanBody.match(/\{\{[a-zA-Z0-9_\-]+\}\}/g) || [];
      const uniquePlaceholders = Array.from(new Set(placeholderMatches));
      setDetectedPlaceholders(uniquePlaceholders);

    } catch (err: any) {
      console.error('Lỗi khi đọc file Word:', err);
      setError(err?.message || 'Không thể đọc file Word. Vui lòng kiểm tra định dạng tệp!');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInsertTag = (tag: string) => {
    setTemplateBody(prev => prev + '\n' + tag);
    if (!detectedPlaceholders.includes(tag)) {
      setDetectedPlaceholders(prev => [...prev, tag]);
    }
  };

  const handleAutoReplaceCommonTerms = () => {
    let replaced = templateBody;
    const replacements = [
      { regex: /TÒA ÁN NHÂN DÂN [^\n]+/gi, tag: '{{TEN_TOA_AN}}' },
      { regex: /Số:\s*[0-9]+(?:\/[0-9]+)?\/[A-Z0-9\-]+/gi, tag: 'Số: {{SO_VU_AN}}' },
      { regex: /Thẩm phán - Chủ tọa phiên tòa:[^\n]+/gi, tag: 'Thẩm phán - Chủ tọa phiên tòa: {{THAM_PHAN_CHU_TOA}}' },
      { regex: /Thư ký phiên tòa:[^\n]+/gi, tag: 'Thư ký phiên tòa: {{THU_KY}}' },
      { regex: /Bị cáo:[^\n]+/gi, tag: 'Bị cáo: {{HO_TEN_BI_CAO}}' },
      { regex: /Nguyên đơn:[^\n]+/gi, tag: 'Nguyên đơn: {{NGUYEN_DON}}' },
      { regex: /Bị đơn:[^\n]+/gi, tag: 'Bị đơn: {{BI_DON}}' },
    ];

    let count = 0;
    for (const r of replacements) {
      if (r.regex.test(replaced)) {
        replaced = replaced.replace(r.regex, r.tag);
        count++;
      }
    }

    setTemplateBody(replaced);
    const placeholderMatches = replaced.match(/\{\{[a-zA-Z0-9_\-]+\}\}/g) || [];
    setDetectedPlaceholders(Array.from(new Set(placeholderMatches)));
    alert(`Đã tự động chuyển đổi các trường dữ liệu cố định sang thẻ động.`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim() || !templateBody.trim()) {
      alert('Vui lòng nhập Tên biểu mẫu và Nội dung mẫu!');
      return;
    }

    const newTemplate: DocumentTemplate = {
      id: 'tmpl-word-' + Date.now(),
      name: templateName.trim(),
      code: templateCode.trim() || `MAU_WORD_${Date.now().toString().slice(-4)}`,
      category,
      applicableLaw: applicableLaw.trim(),
      description: description.trim() || `Biểu mẫu nhập từ file Word: ${fileName}`,
      isSystem: false,
      templateBody,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveTemplate(newTemplate);
    alert(`Đã thêm thành công biểu mẫu "${newTemplate.name}" từ file Word!`);
    onClose();
  };

  const selectedCase = cases.find(c => c.id === previewCaseId) || cases[0];
  const tempTemplate: DocumentTemplate = {
    id: 'temp-preview',
    name: templateName || 'Biểu mẫu xem trước',
    code: templateCode || 'MAU_PREVIEW',
    category,
    applicableLaw,
    description,
    isSystem: false,
    templateBody,
    createdAt: '',
    updatedAt: '',
  };
  const renderedPreview = selectedCase ? renderTemplateWithCase(tempTemplate, selectedCase, settings) : templateBody;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-300">
        {/* Header */}
        <div className="bg-[#991B1B] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-red-800/80 rounded border border-red-700">
              <FileUp className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight flex items-center gap-2">
                <span>Thêm Biểu Mẫu Tố Tụng Bằng File Word (.docx)</span>
                <span className="px-2 py-0.5 text-[10px] bg-amber-400 text-red-950 font-bold rounded">
                  TIỆN LỢI & NHANH CHÓNG
                </span>
              </h3>
              <p className="text-xs text-red-100">
                Tự động nhận diện tiêu đề, loại án, căn cứ pháp lý và các vị trí điền thông tin tự động
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-red-800 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-50 space-y-4">
          {/* File Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-5 text-center transition-colors cursor-pointer bg-white ${
              file ? 'border-emerald-500 bg-emerald-50/20' : 'border-slate-300 hover:border-red-500 hover:bg-red-50/10'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".docx,.doc,.txt,.rtf"
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-between max-w-lg mx-auto">
                <div className="flex items-center gap-3 text-left">
                  <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <span>{fileName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-mono rounded font-semibold">
                        {fileSize}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">Đã trích xuất nội dung từ tệp Word. Nhấp để chọn tệp khác.</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sẵn sàng</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 py-3">
                <div className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto">
                  <FileUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">
                    Kéo thả file Word (.docx) vào đây, hoặc <span className="text-red-700 underline">bấm để chọn file</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Hỗ trợ tệp Microsoft Word (.docx, .doc) hoặc tệp văn bản (.txt, .rtf) biểu mẫu tố tụng
                  </div>
                </div>
              </div>
            )}
          </div>

          {isProcessing && (
            <div className="p-3 bg-blue-50 border border-blue-200 text-blue-900 rounded text-xs flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Đang đọc và phân tích cấu trúc văn bản Word...</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form and Template Editor */}
          {templateBody && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tên biểu mẫu <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="VD: Quyết định đưa vụ án ra xét xử sơ thẩm..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mã hiệu biểu mẫu <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    value={templateCode}
                    onChange={(e) => setTemplateCode(e.target.value)}
                    placeholder="VD: MAU_04_HS"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono uppercase focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Lĩnh vực áp dụng</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none bg-white font-medium"
                  >
                    <option value="ALL">Dùng chung cho tất cả các loại án</option>
                    <option value="HINH_SU">Hình sự</option>
                    <option value="DAN_SU">Dân sự</option>
                    <option value="HON_NHAN">Hôn nhân & Gia đình</option>
                    <option value="KDTM">Kinh doanh, Thương mại</option>
                    <option value="HANH_CHINH">Hành chính</option>
                    <option value="LAO_DONG">Lao động</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Căn cứ pháp lý</label>
                  <input
                    type="text"
                    value={applicableLaw}
                    onChange={(e) => setApplicableLaw(e.target.value)}
                    placeholder="VD: Bộ luật Tố tụng hình sự 2015"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mô tả / Ghi chú</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả công dụng biểu mẫu..."
                    className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Placeholders Toolbar */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Chèn biến điền tự động (Click để chèn vào văn bản):</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoReplaceCommonTerms}
                    className="px-2.5 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 rounded font-bold text-[11px] flex items-center gap-1 transition-colors"
                    title="Tự động tìm kiếm và đổi tên Tòa án, Thẩm phán thành thẻ biến"
                  >
                    <span>⚡ Tự động chuẩn hóa thẻ biến</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {COMMON_TAGS.map((item) => (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => handleInsertTag(item.tag)}
                      title={item.desc}
                      className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-mono text-[11px] transition-colors"
                    >
                      + {item.tag}
                    </button>
                  ))}
                </div>

                {detectedPlaceholders.length > 0 && (
                  <div className="pt-1 border-t border-amber-200 text-[11px] text-amber-800 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Đã nhận diện {detectedPlaceholders.length} thẻ biến trong file: </span>
                    <span className="font-mono font-bold">{detectedPlaceholders.slice(0, 5).join(', ')}{detectedPlaceholders.length > 5 ? '...' : ''}</span>
                  </div>
                )}
              </div>

              {/* Tabs for Edit vs Live Preview */}
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
                <div className="flex items-center justify-between bg-slate-100 px-4 py-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('CONTENT')}
                      className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                        activeTab === 'CONTENT' ? 'bg-white text-red-900 shadow-2xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Nội dung biểu mẫu Word
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('PREVIEW')}
                      className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        activeTab === 'PREVIEW' ? 'bg-white text-red-900 shadow-2xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem trước điền tự động</span>
                    </button>
                  </div>

                  {activeTab === 'PREVIEW' && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-600 font-medium">Thử với vụ án:</span>
                      <select
                        value={previewCaseId}
                        onChange={(e) => setPreviewCaseId(e.target.value)}
                        className="px-2 py-0.5 border border-slate-300 rounded text-xs bg-white font-medium"
                      >
                        {cases.map(c => (
                          <option key={c.id} value={c.id}>{c.docketNumber} - {c.title.slice(0, 30)}...</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="p-3">
                  {activeTab === 'CONTENT' ? (
                    <textarea
                      rows={14}
                      value={templateBody}
                      onChange={(e) => setTemplateBody(e.target.value)}
                      className="w-full p-3 font-mono text-xs border border-slate-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none leading-relaxed"
                      placeholder="Nội dung biểu mẫu trích xuất từ Word..."
                    />
                  ) : (
                    <div className="p-4 bg-white border border-slate-200 rounded min-h-[300px] max-h-[400px] overflow-y-auto whitespace-pre-wrap font-serif text-sm leading-relaxed text-slate-800 shadow-inner">
                      {renderedPreview}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-xs font-semibold transition-colors"
          >
            Đóng
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!templateBody.trim()}
              onClick={handleSave}
              className={`px-4 py-2 rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs ${
                templateBody.trim()
                  ? 'bg-[#991B1B] hover:bg-red-800 text-white'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              <span>Lưu và Thêm Biểu Mẫu Vào Hệ Thống</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
