import React, { useState, useEffect, useRef } from 'react';
import mammoth from 'mammoth';
import { CourtCase, CourtUnitSettings, DocumentTemplate } from '../types/court';
import { renderTemplateWithCase } from '../data/defaultTemplates';
import { printHtmlContent, exportToWordDoc } from '../utils/courtUtils';
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Edit3, 
  Eye, 
  FileText, 
  Check, 
  Settings, 
  RotateCcw,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Table as TableIcon,
  Palette,
  Highlighter,
  Undo2,
  Redo2,
  RemoveFormatting,
  Save,
  FileUp,
  HelpCircle,
  CheckCircle2,
  Scale
} from 'lucide-react';

interface DocumentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CourtCase;
  settings: CourtUnitSettings;
  templates: DocumentTemplate[];
  onOpenTemplateManager?: () => void;
  initialTemplateCode?: string;
  onSaveCaseDocument?: (caseId: string, templateCode: string, content: string) => void;
}

export const DocumentGeneratorModal: React.FC<DocumentGeneratorModalProps> = ({
  isOpen,
  onClose,
  caseItem,
  settings,
  templates,
  onOpenTemplateManager,
  initialTemplateCode,
  onSaveCaseDocument,
}) => {
  if (!isOpen) return null;

  // Filter templates matching this case category or general
  const availableTemplates = templates.filter(
    (t) => t.category === 'ALL' || t.category === caseItem.caseType
  );

  const initialTemplate = 
    templates.find((t) => t.code === initialTemplateCode) ||
    availableTemplates[0] ||
    templates[0];

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialTemplate?.id || '');
  const [htmlContent, setHtmlContent] = useState('');
  const [editorMode, setEditorMode] = useState<'WORD_EDIT' | 'PRINT_PREVIEW'>('WORD_EDIT');
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasCustomEdits, setHasCustomEdits] = useState(false);
  const [stageFilter, setStageFilter] = useState<string>('ALL');

  // Word file upload ref
  const wordFileInputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Formatting state
  const [fontSize, setFontSize] = useState<string>('13pt');
  const [fontFamily, setFontFamily] = useState<string>("'Times New Roman', serif");

  const filteredTemplates = availableTemplates.filter((t) => {
    if (stageFilter !== 'ALL' && t.stage !== stageFilter) return false;
    return true;
  });

  // Storage key for custom edited document
  const getCustomStorageKey = (tmplId: string) => `tand_custom_doc_${caseItem.id}_${tmplId}`;

  // Generate or load saved custom document
  useEffect(() => {
    const tmpl = templates.find((t) => t.id === selectedTemplateId) || availableTemplates[0] || templates[0];
    if (tmpl) {
      // Check if user previously saved custom edits for this case and template
      const savedCustom = localStorage.getItem(getCustomStorageKey(tmpl.id));
      if (savedCustom) {
        setHtmlContent(savedCustom);
        setHasCustomEdits(true);
      } else {
        const generated = renderTemplateWithCase(tmpl, caseItem, settings);
        setHtmlContent(generated);
        setHasCustomEdits(false);
      }
      setIsSaved(false);
    }
  }, [selectedTemplateId, caseItem, settings, templates]);

  // Sync contentEditable element when htmlContent changes from external or load
  useEffect(() => {
    if (editorRef.current && editorMode === 'WORD_EDIT') {
      if (editorRef.current.innerHTML !== htmlContent) {
        editorRef.current.innerHTML = htmlContent;
      }
    }
  }, [htmlContent, editorMode]);

  // Execute formatting command on contentEditable document
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    // Sync state
    setHtmlContent(editorRef.current.innerHTML);
    setIsSaved(false);
    setHasCustomEdits(true);
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
      setIsSaved(false);
      setHasCustomEdits(true);
    }
  };

  const handleSaveToCase = () => {
    const currentTmpl = templates.find((t) => t.id === selectedTemplateId);
    if (!currentTmpl) return;

    try {
      localStorage.setItem(getCustomStorageKey(currentTmpl.id), htmlContent);
      if (onSaveCaseDocument) {
        onSaveCaseDocument(caseItem.id, currentTmpl.code, htmlContent);
      }
      setIsSaved(true);
      setHasCustomEdits(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {
      console.error('Error saving document to localStorage', e);
    }
  };

  const handleResetCurrentTemplate = () => {
    if (confirm('Bạn có chắc muốn hoàn tác toàn bộ nội dung về mẫu tự động điền ban đầu không? Các chỉnh sửa của bạn sẽ bị hủy.')) {
      const tmpl = templates.find((t) => t.id === selectedTemplateId);
      if (tmpl) {
        localStorage.removeItem(getCustomStorageKey(tmpl.id));
        const generated = renderTemplateWithCase(tmpl, caseItem, settings);
        setHtmlContent(generated);
        if (editorRef.current) {
          editorRef.current.innerHTML = generated;
        }
        setHasCustomEdits(false);
        setIsSaved(false);
      }
    }
  };

  const handlePrint = () => {
    const currentTmpl = templates.find((t) => t.id === selectedTemplateId);
    const title = `${currentTmpl?.code || 'Van_Ban'}_${caseItem.docketNumber.replace(/[\/\\]/g, '_')}`;
    printHtmlContent(htmlContent, title);
  };

  const handleDownloadWord = () => {
    const currentTmpl = templates.find((t) => t.id === selectedTemplateId);
    const title = `${currentTmpl?.code || 'Van_ban'}_${caseItem.docketNumber.replace(/[\/\\]/g, '_')}`;
    exportToWordDoc(htmlContent, title);
  };

  // Upload Word file to replace or update current document content
  const handleWordFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const lowerName = file.name.toLowerCase();
      let importedHtml = '';

      if (lowerName.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        importedHtml = result.value;
      } else {
        const rawText = await file.text();
        importedHtml = rawText.split('\n').map(l => `<p>${l}</p>`).join('');
      }

      if (importedHtml.trim()) {
        const wrappedHtml = `
          <div style="font-family: 'Times New Roman', serif; font-size: 13pt; line-height: 1.5; text-align: justify; color: #000;">
            ${importedHtml}
          </div>
        `;
        setHtmlContent(wrappedHtml);
        if (editorRef.current) {
          editorRef.current.innerHTML = wrappedHtml;
        }
        setHasCustomEdits(true);
        setIsSaved(false);
        alert(`Đã nạp thành công nội dung từ tệp Word: ${file.name}`);
      }
    } catch (err: any) {
      console.error('Lỗi khi nạp file Word:', err);
      alert('Không thể đọc tệp Word. Vui lòng đảm bảo tệp có định dạng .docx chuẩn.');
    } finally {
      if (wordFileInputRef.current) wordFileInputRef.current.value = '';
    }
  };

  const handleCopy = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    navigator.clipboard.writeText(tempDiv.innerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick Judicial Phrase Insertion
  const handleInsertPhrase = (phrase: string) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('insertText', false, phrase);
    setHtmlContent(editorRef.current.innerHTML);
    setHasCustomEdits(true);
  };

  // Insert standard court table (e.g. litigant table or property list)
  const handleInsertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12pt; border: 1px solid #333;">
        <thead>
          <tr style="background-color: #f1f5f9; font-weight: bold; text-align: center;">
            <th style="border: 1px solid #333; padding: 6px;">STT</th>
            <th style="border: 1px solid #333; padding: 6px;">Họ và tên / Đơn vị</th>
            <th style="border: 1px solid #333; padding: 6px;">Tư cách tố tụng</th>
            <th style="border: 1px solid #333; padding: 6px;">Địa chỉ cư trú</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #333; padding: 6px; text-align: center;">1</td>
            <td style="border: 1px solid #333; padding: 6px;">...</td>
            <td style="border: 1px solid #333; padding: 6px;">...</td>
            <td style="border: 1px solid #333; padding: 6px;">...</td>
          </tr>
        </tbody>
      </table>
      <p></p>
    `;
    executeCommand('insertHTML', tableHtml);
  };

  const selectedTmpl = templates.find((t) => t.id === selectedTemplateId);

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[94vh]">
        {/* Hidden File Input for Word (.docx) Import */}
        <input
          type="file"
          ref={wordFileInputRef}
          onChange={handleWordFileUpload}
          accept=".docx,.doc,.txt"
          className="hidden"
        />

        {/* Top Header Bar */}
        <div className="bg-[#991B1B] text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-red-800/80 rounded border border-red-700">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base md:text-lg tracking-wide uppercase">
                  Soạn Thảo & Chỉnh Sửa Lệnh, Quyết Định Tòa Án
                </h2>
                <span className="px-2 py-0.5 text-[10px] bg-amber-400 text-red-950 font-bold rounded">
                  GIAO DIỆN WORD TRỰC QUAN
                </span>
              </div>
              <div className="text-xs text-amber-200">
                Vụ án: <strong>{caseItem.docketNumber}</strong> - {caseItem.title}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/10 rounded p-1 transition-colors"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Selector & Action Ribbon */}
        <div className="bg-slate-100 border-b border-slate-300 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* Template Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Chọn biểu mẫu:
            </label>

            {caseItem.caseType === 'HINH_SU' && (
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 font-medium focus:ring-1 focus:ring-red-600 focus:outline-none"
              >
                <option value="ALL">Toàn bộ 60 mẫu NQ 05/2017</option>
                <option value="Phân công & Chuẩn bị">1. Phân công & Chuẩn bị</option>
                <option value="Tạm giam & Biện pháp ngăn chặn">2. Tạm giam & Ngăn chặn</option>
                <option value="Phiên tòa & Nghị án">3. Phiên tòa & Nghị án</option>
                <option value="Bản án & Quyết định">4. Bản án & Quyết định</option>
                <option value="Trả hồ sơ & Đình chỉ">5. Trả hồ sơ & Đình chỉ</option>
                <option value="Kháng cáo & Phúc thẩm">6. Kháng cáo & Phúc thẩm</option>
                <option value="Giám đốc thẩm & Khởi tố">7. Giám đốc thẩm & Khởi tố</option>
              </select>
            )}

            <select
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-bold text-red-900 focus:ring-1 focus:ring-red-600 focus:outline-none max-w-xs md:max-w-md shadow-2xs"
            >
              <optgroup label={`Biểu mẫu vụ án (${filteredTemplates.length} mẫu)`}>
                {filteredTemplates.map((tmpl) => (
                  <option key={tmpl.id} value={tmpl.id}>
                    {tmpl.formNumber ? `[Mẫu số ${tmpl.formNumber}] ` : `[${tmpl.code}] `}{tmpl.name.replace(/^\[.*?\]\s*/, '')}
                  </option>
                ))}
              </optgroup>
              {templates.filter((t) => !availableTemplates.some((at) => at.id === t.id)).length > 0 && (
                <optgroup label="Các biểu mẫu phân hệ khác">
                  {templates
                    .filter((t) => !availableTemplates.some((at) => at.id === t.id))
                    .map((tmpl) => (
                      <option key={tmpl.id} value={tmpl.id}>
                        [{tmpl.code}] {tmpl.name}
                      </option>
                    ))}
                </optgroup>
              )}
            </select>

            {hasCustomEdits && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <Edit3 className="w-3 h-3 text-amber-700" />
                <span>Đã có chỉnh sửa riêng</span>
              </span>
            )}
          </div>

          {/* Mode Switcher & Major Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switcher */}
            <div className="flex items-center bg-white border border-slate-300 rounded p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => setEditorMode('WORD_EDIT')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  editorMode === 'WORD_EDIT' ? 'bg-[#991B1B] text-white shadow-2xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Soạn thảo kiểu Word</span>
              </button>
              <button
                type="button"
                onClick={() => setEditorMode('PRINT_PREVIEW')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  editorMode === 'PRINT_PREVIEW' ? 'bg-[#991B1B] text-white shadow-2xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Xem trang in A4</span>
              </button>
            </div>

            {/* Save Button */}
            <button
              type="button"
              onClick={handleSaveToCase}
              className={`px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs ${
                isSaved 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
              title="Lưu lại toàn bộ nội dung đã chỉnh sửa cho vụ án này"
            >
              {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Đã lưu thành công!' : 'Lưu văn bản'}</span>
            </button>

            {/* Word Import/Export Buttons */}
            <button
              type="button"
              onClick={() => wordFileInputRef.current?.click()}
              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded font-semibold text-xs flex items-center gap-1 transition-colors"
              title="Tải tệp Word (.docx) từ máy tính của bạn vào văn bản này"
            >
              <FileUp className="w-3.5 h-3.5 text-blue-700" />
              <span>Nạp file Word</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadWord}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-blue-800 border border-blue-300 rounded font-semibold text-xs flex items-center gap-1 transition-colors shadow-2xs"
              title="Tải văn bản này về máy tính dưới dạng file Microsoft Word (.doc) để chỉnh sửa thoải mái"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải file Word</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In A4</span>
            </button>
          </div>
        </div>

        {/* Word WYSIWYG Ribbon Toolbar (Visible in WORD_EDIT mode) */}
        {editorMode === 'WORD_EDIT' && (
          <div className="bg-slate-50 border-b border-slate-300 px-4 py-1.5 flex flex-wrap items-center gap-1 text-xs shrink-0 select-none shadow-inner">
            {/* Font Family & Size */}
            <div className="flex items-center gap-1 pr-1.5 border-r border-slate-300">
              <select
                value={fontFamily}
                onChange={(e) => {
                  setFontFamily(e.target.value);
                  executeCommand('fontName', e.target.value);
                }}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium focus:outline-none"
                title="Phông chữ"
              >
                <option value="'Times New Roman', serif">Times New Roman (Chuẩn Tòa án)</option>
                <option value="Arial, sans-serif">Arial</option>
                <option value="Calibri, sans-serif">Calibri</option>
                <option value="Georgia, serif">Georgia</option>
              </select>

              <select
                value={fontSize}
                onChange={(e) => {
                  setFontSize(e.target.value);
                  executeCommand('fontSize', e.target.value === '14pt' ? '4' : e.target.value === '16pt' ? '5' : '3');
                }}
                className="bg-white border border-slate-300 rounded px-1.5 py-1 text-xs font-bold focus:outline-none w-16"
                title="Cỡ chữ"
              >
                <option value="11pt">11 pt</option>
                <option value="12pt">12 pt</option>
                <option value="13pt">13 pt</option>
                <option value="14pt">14 pt</option>
                <option value="16pt">16 pt</option>
                <option value="18pt">18 pt</option>
              </select>
            </div>

            {/* Basic Styles (B, I, U, S) */}
            <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-300">
              <button
                type="button"
                onClick={() => executeCommand('bold')}
                className="p-1.5 hover:bg-slate-200 rounded font-bold transition-colors text-slate-800"
                title="In đậm (Ctrl+B)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('italic')}
                className="p-1.5 hover:bg-slate-200 rounded italic transition-colors text-slate-800"
                title="In nghiêng (Ctrl+I)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('underline')}
                className="p-1.5 hover:bg-slate-200 rounded underline transition-colors text-slate-800"
                title="Gạch chân (Ctrl+U)"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('strikeThrough')}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-800"
                title="Gạch ngang chữ"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Text Alignment */}
            <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-300">
              <button
                type="button"
                onClick={() => executeCommand('justifyLeft')}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-800"
                title="Căn lề trái"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('justifyCenter')}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-800"
                title="Căn giữa (Tiêu ngữ, Tên Tòa án, Tiêu đề Lệnh)"
              >
                <AlignCenter className="w-3.5 h-3.5 text-red-800" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('justifyRight')}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-800"
                title="Căn lề phải"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('justifyFull')}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-800 font-bold"
                title="Căn đều 2 bên (Chuẩn văn bản tư pháp NĐ 30/2020)"
              >
                <AlignJustify className="w-3.5 h-3.5 text-blue-800" />
              </button>
            </div>

            {/* Indent & Lists */}
            <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-300">
              <button
                type="button"
                onClick={() => executeCommand('indent')}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-800"
                title="Thụt đầu dòng đoạn văn bản (Chuẩn 1.27cm)"
              >
                <Indent className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('outdent')}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-800"
                title="Giảm thụt lề"
              >
                <Outdent className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('insertUnorderedList')}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-800"
                title="Danh sách gạch đầu dòng"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('insertOrderedList')}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-800"
                title="Danh sách đánh số thứ tự (1, 2, 3...)"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Colors */}
            <div className="flex items-center gap-1 pr-1.5 border-r border-slate-300">
              <button
                type="button"
                onClick={() => executeCommand('foreColor', '#000000')}
                className="p-1.5 hover:bg-slate-200 rounded text-slate-900 transition-colors"
                title="Màu chữ Đen tiêu chuẩn"
              >
                <span className="font-bold underline text-xs">A</span>
              </button>
              <button
                type="button"
                onClick={() => executeCommand('foreColor', '#991B1B')}
                className="p-1.5 hover:bg-slate-200 rounded text-red-700 transition-colors"
                title="Màu chữ Đỏ tư pháp"
              >
                <span className="font-bold underline text-xs text-red-700">A</span>
              </button>
              <button
                type="button"
                onClick={() => executeCommand('hiliteColor', '#fef08a')}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors text-amber-700"
                title="Tô màu dạ quang vàng highlight"
              >
                <Highlighter className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Insert Tools */}
            <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-300">
              <button
                type="button"
                onClick={handleInsertTable}
                className="px-2 py-1 hover:bg-slate-200 rounded transition-colors text-slate-800 font-medium flex items-center gap-1 text-[11px]"
                title="Chèn bảng danh sách đương sự hoặc tài sản"
              >
                <TableIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>Bảng</span>
              </button>
              <button
                type="button"
                onClick={() => executeCommand('insertHorizontalRule')}
                className="px-2 py-1 hover:bg-slate-200 rounded transition-colors text-slate-800 font-medium text-[11px]"
                title="Chèn đường kẻ phân cách hành chính"
              >
                — Đường kẻ
              </button>
              <button
                type="button"
                onClick={() => executeCommand('removeFormat')}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-600"
                title="Xóa định dạng đang chọn"
              >
                <RemoveFormatting className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* History & Reset */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => executeCommand('undo')}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-700"
                title="Hoàn tác thao tác trước (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand('redo')}
                className="p-1.5 hover:bg-slate-200 rounded transition-colors text-slate-700"
                title="Làm lại thao tác vừa hủy (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetCurrentTemplate}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-[11px] font-medium flex items-center gap-1 ml-1"
                title="Khôi phục lại toàn bộ nội dung mẫu tự động ban đầu"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Mẫu gốc</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Court Phrase Insertion Ribbon */}
        {editorMode === 'WORD_EDIT' && (
          <div className="bg-amber-50/70 border-b border-amber-200 px-4 py-1.5 flex flex-wrap items-center gap-1.5 text-[11px] shrink-0">
            <span className="font-bold text-amber-950 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Chèn nhanh câu chữ tố tụng chuẩn:
            </span>
            <button
              type="button"
              onClick={() => handleInsertPhrase('Trích xuất bị cáo từ Trại tạm giam Công an tỉnh để phục vụ xét xử sơ thẩm. ')}
              className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded transition-colors"
            >
              + Trích xuất bị cáo tạm giam
            </button>
            <button
              type="button"
              onClick={() => handleInsertPhrase('Người có quyền lợi, nghĩa vụ liên quan vắng mặt không có lý do chính đáng. ')}
              className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded transition-colors"
            >
              + Đương sự vắng mặt
            </button>
            <button
              type="button"
              onClick={() => handleInsertPhrase('Căn cứ các điều 44, 45, 119 và Điều 278 Bộ luật Tố tụng Hình sự 2015. ')}
              className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded transition-colors"
            >
              + Căn cứ Điều 278 BLTTHS
            </button>
            <button
              type="button"
              onClick={() => handleInsertPhrase('Xử kín theo quy định pháp luật để bảo đảm bí mật đời tư của người chưa thành niên. ')}
              className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded transition-colors"
            >
              + Xét xử kín
            </button>
            <button
              type="button"
              onClick={() => handleInsertPhrase('Công nhận sự thỏa thuận của các đương sự theo Điều 212 Bộ luật Tố tụng Dân sự. ')}
              className="px-2 py-0.5 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded transition-colors"
            >
              + Công nhận thỏa thuận
            </button>
          </div>
        )}

        {/* Info Banner on Active Template */}
        {selectedTmpl && (
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-1 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-[10px] bg-red-800 text-white px-2 py-0.5 rounded shadow-2xs">
                {selectedTmpl.formNumber ? `Mẫu số ${selectedTmpl.formNumber}` : selectedTmpl.code}
              </span>
              <span className="font-semibold text-red-950 bg-amber-100 border border-amber-300 px-2 py-0.2 rounded text-[10px]">
                {selectedTmpl.resolution || 'NQ 05/2017/NQ-HĐTP'}
              </span>
              <span className="text-slate-800 font-medium">{selectedTmpl.name}</span>
            </div>
            <div className="text-[11px] text-slate-500 italic hidden sm:block">
              {editorMode === 'WORD_EDIT' 
                ? 'Nhấp chuột trực tiếp vào trang để chỉnh sửa câu chữ như Word (không cần mã code).' 
                : 'Đang hiển thị bản in A4 chính thức.'}
            </div>
          </div>
        )}

        {/* Main Document Canvas: Authentic A4 Sheet with Standard Margins */}
        <div className="flex-1 bg-slate-200/90 overflow-y-auto p-3 sm:p-6 md:p-8 flex justify-center">
          {editorMode === 'WORD_EDIT' ? (
            /* True Word-like WYSIWYG Editable Sheet */
            <div className="w-full max-w-[210mm] min-h-[297mm] bg-white rounded shadow-xl border border-slate-400 relative flex flex-col">
              {/* Word Visual Header / Ruler indicator */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-1.5 flex items-center justify-between text-[11px] text-slate-500 font-mono select-none">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Khổ giấy A4 (Lề chuẩn NĐ 30/2020: Trái 30mm, Phải 15mm, Trên 20mm, Dưới 20mm)
                </span>
                <span>Times New Roman • 13pt</span>
              </div>

              {/* Editable Document Body (contentEditable) */}
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                suppressContentEditableWarning
                className="flex-1 p-8 md:p-14 text-slate-900 font-serif leading-relaxed focus:outline-none min-h-[270mm] selection:bg-amber-200"
                style={{
                  fontFamily: fontFamily,
                  fontSize: fontSize,
                }}
              />

              {/* Word Page Footer Indicator */}
              <div className="border-t border-slate-200 p-2 text-center text-[10px] text-slate-400 font-mono select-none">
                - Trang 1 -
              </div>
            </div>
          ) : (
            /* A4 Print Preview Sheet */
            <div className="w-full max-w-[210mm] min-h-[297mm] bg-white rounded shadow-xl border border-slate-400 p-8 md:p-14 text-slate-900 font-serif leading-relaxed relative">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          )}
        </div>

        {/* Bottom Status & Quick Action Bar */}
        <div className="bg-slate-100 border-t border-slate-300 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép toàn bộ văn bản'}</span>
            </button>

            {hasCustomEdits && (
              <span className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                Lưu ý: Bạn đã chỉnh sửa văn bản này. Bấm <strong>Lưu văn bản</strong> để bảo lưu cho vụ án.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-semibold text-xs transition-colors"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Tiến hành In Văn Bản (A4)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
