import React, { useState } from 'react';
import { CourtCase, Official, TrialExtensionRecord, CaseDecision } from '../types/court';
import { formatDateVN, getDaysRemaining, getCaseTypeName } from '../utils/courtUtils';
import { 
  X, 
  Clock, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  Scale, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface TrialExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CourtCase;
  officials: Official[];
  onSaveExtension: (updatedCase: CourtCase, newDecision: CaseDecision) => void;
  onOpenPrintModal?: (c: CourtCase, docType?: string) => void;
}

export const TrialExtensionModal: React.FC<TrialExtensionModalProps> = ({
  isOpen,
  onClose,
  caseItem,
  officials,
  onSaveExtension,
  onOpenPrintModal,
}) => {
  if (!isOpen) return null;

  // Calculate default legal ground based on case type
  const getDefaultApplicableLaw = () => {
    switch (caseItem.caseType) {
      case 'HINH_SU':
        return 'Khoản 1 Điều 277 Bộ luật Tố tụng Hình sự 2015';
      case 'HANH_CHINH':
        return 'Khoản 1 Điều 130 Luật Tố tụng Hành chính 2015';
      default:
        return 'Khoản 1 Điều 203 Bộ luật Tố tụng Dân sự 2015';
    }
  };

  const getDefaultReason = () => {
    if (caseItem.caseType === 'HINH_SU') {
      return 'Vụ án có nhiều tình tiết phức tạp, nhiều bị can/bị cáo, cần thêm thời gian nghiên cứu hồ sơ và bổ sung chứng cứ.';
    }
    return 'Vụ án có tính chất phức tạp, nhiều đương sự, đang chờ kết quả xác minh ủy thác tư pháp / kết luận thẩm định giá tài sản.';
  };

  // State
  const [extensionDays, setExtensionDays] = useState<number>(30);
  const [applicableLaw, setApplicableLaw] = useState(getDefaultApplicableLaw());
  const [reason, setReason] = useState(getDefaultReason());
  const [decisionNo, setDecisionNo] = useState(`${caseItem.decisions.length + 1}/2026/QĐ-GHCBXX-TA`);
  const [decisionDate, setDecisionDate] = useState('2026-06-27');
  
  // Leadership signers (Chánh án / Phó Chánh án)
  const leaders = officials.filter(
    (o) => o.role === 'CHANH_AN' || o.role === 'PHO_CHANH_AN'
  );
  const defaultSigner = leaders[0]?.name || 'Nguyễn Thành Trung';
  const defaultRole = leaders[0]?.title || 'Chánh án Tòa án nhân dân';
  const [signerName, setSignerName] = useState(defaultSigner);
  const [signerRole, setSignerRole] = useState(defaultRole);

  // Compute new deadline
  const currentDeadlineObj = new Date(caseItem.deadlineDate);
  const newDeadlineObj = new Date(currentDeadlineObj.getTime() + extensionDays * 24 * 60 * 60 * 1000);
  const newDeadlineStr = !isNaN(newDeadlineObj.getTime())
    ? newDeadlineObj.toISOString().split('T')[0]
    : caseItem.deadlineDate;

  const currentRemaining = getDaysRemaining(caseItem.deadlineDate);
  const newRemaining = getDaysRemaining(newDeadlineStr);

  const handleSubmit = (andPrint: boolean = false) => {
    const extensionRecord: TrialExtensionRecord = {
      id: 'ext-' + Date.now(),
      decisionNo,
      decisionDate,
      previousDeadline: caseItem.deadlineDate,
      newDeadline: newDeadlineStr,
      extensionDays,
      reason,
      applicableLaw,
      signerName,
      signerRole,
      createdAt: new Date().toISOString(),
    };

    const newDecision: CaseDecision = {
      id: 'dec-' + Date.now(),
      decisionType: 'GIA_HAN_CHUAN_BI_XET_XU',
      decisionTypeName: 'Quyết định gia hạn thời hạn chuẩn bị xét xử',
      decisionNo,
      issuedDate: decisionDate,
      effectiveDate: decisionDate,
      signerName,
      signerRole,
      summary: `Gia hạn thời hạn chuẩn bị xét xử thêm ${extensionDays} ngày (đến ngày ${formatDateVN(newDeadlineStr)}) do: ${reason}`,
    };

    const updatedCase: CourtCase = {
      ...caseItem,
      originalDeadlineDate: caseItem.originalDeadlineDate || caseItem.deadlineDate,
      deadlineDate: newDeadlineStr,
      status: 'GIA_HAN',
      statusName: 'Gia hạn chuẩn bị xét xử',
      trialExtensions: [extensionRecord, ...(caseItem.trialExtensions || [])],
      decisions: [newDecision, ...caseItem.decisions],
      updatedAt: new Date().toISOString(),
    };

    onSaveExtension(updatedCase, newDecision);
    onClose();

    if (andPrint && onOpenPrintModal) {
      setTimeout(() => {
        onOpenPrintModal(updatedCase, 'GIA_HAN_CHUAN_BI_XET_XU');
      }, 200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#991B1B] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-bold text-base md:text-lg tracking-wide uppercase">
                Gia Hạn Thời Hạn Chuẩn Bị Xét Xử
              </h2>
              <div className="text-[11px] text-amber-200">
                Thẩm quyền: Chánh án Tòa án nhân dân ban hành Quyết định gia hạn theo Luật định
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

        {/* Content Form */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Dossier Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5 text-red-900 font-bold uppercase text-[11px]">
                <Scale className="w-4 h-4 text-amber-700" />
                Hồ sơ vụ án đề nghị gia hạn
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-white border border-slate-300 font-medium">
                {getCaseTypeName(caseItem.caseType)} • {caseItem.level === 'SO_THAM' ? 'Sơ thẩm' : 'Phúc thẩm'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
              <div>
                <span className="text-slate-500">Mã vụ việc:</span>{' '}
                <strong className="font-mono text-red-800">{caseItem.caseCode}</strong>
              </div>
              <div>
                <span className="text-slate-500">Số thụ lý:</span>{' '}
                <strong className="text-slate-900">{caseItem.docketNumber}</strong> (ngày {formatDateVN(caseItem.intakeDate)})
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-500">Tên vụ việc:</span>{' '}
                <strong className="text-slate-900">{caseItem.title}</strong>
              </div>
              <div className="md:col-span-2">
                <span className="text-slate-500">Thẩm phán thụ lý:</span>{' '}
                <strong className="text-slate-800">{caseItem.assignedJudgeName || 'Chưa phân công'}</strong>
                {caseItem.assignedJudgeTitle && ` (${caseItem.assignedJudgeTitle})`}
              </div>
            </div>
          </div>

          {/* Current vs New Deadline Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-amber-50/70 border border-amber-200 rounded p-3 space-y-1">
              <div className="text-[11px] font-bold text-amber-900 uppercase">Hạn luật định hiện tại:</div>
              <div className="text-base font-bold text-slate-900 font-mono">
                {formatDateVN(caseItem.deadlineDate)}
              </div>
              <div className="text-[11px] text-amber-800 font-medium">
                Tình trạng: {currentRemaining.displayText}
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200 rounded p-3 space-y-1">
              <div className="text-[11px] font-bold text-emerald-900 uppercase flex items-center gap-1">
                <span>Hạn mới sau khi gia hạn:</span>
                <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded text-[10px]">
                  +{extensionDays} ngày
                </span>
              </div>
              <div className="text-base font-bold text-emerald-800 font-mono">
                {formatDateVN(newDeadlineStr)}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                Tình trạng mới: {newRemaining.displayText}
              </div>
            </div>
          </div>

          {/* Quick extension duration options */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 font-bold">
              Chọn thời gian gia hạn thêm <span className="text-red-600">(*)</span>:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { days: 15, label: '15 ngày', desc: 'Tội ít nghiêm trọng / cấp thiết' },
                { days: 30, label: '30 ngày (01 tháng)', desc: 'Chuẩn BLTTHS & BLTTDS' },
                { days: 45, label: '45 ngày', desc: 'Vụ án phức tạp' },
                { days: 60, label: '60 ngày (02 tháng)', desc: 'Tối đa luật định dân sự' },
              ].map((opt) => (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setExtensionDays(opt.days)}
                  className={`p-2 rounded text-left border transition-all ${
                    extensionDays === opt.days
                      ? 'bg-red-50 border-red-600 text-red-900 ring-2 ring-red-600/20 font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Legal grounds */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Căn cứ pháp lý gia hạn <span className="text-red-600">(*)</span>
              </label>
              <input
                type="text"
                value={applicableLaw}
                onChange={(e) => setApplicableLaw(e.target.value)}
                placeholder="VD: Điều 277 BLTTHS 2015 hoặc Điều 203 BLTTDS 2015"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Số Quyết định gia hạn <span className="text-red-600">(*)</span>
              </label>
              <input
                type="text"
                value={decisionNo}
                onChange={(e) => setDecisionNo(e.target.value)}
                placeholder="VD: 02/2026/QĐ-GHCBXX-TA"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none font-mono font-bold text-red-900"
              />
            </div>
          </div>

          {/* Signing authority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Ngày ban hành QĐ</label>
              <input
                type="date"
                value={decisionDate}
                onChange={(e) => setDecisionDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Người ký Quyết định</label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Chức vụ người ký</label>
              <select
                value={signerRole}
                onChange={(e) => setSignerRole(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
              >
                <option value="Chánh án Tòa án nhân dân">Chánh án Tòa án nhân dân</option>
                <option value="Phó Chánh án Tòa án nhân dân">Phó Chánh án Tòa án nhân dân</option>
                <option value="Thẩm phán phụ trách">Thẩm phán phụ trách</option>
              </select>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-slate-700 font-bold">
                Lý do gia hạn chuẩn bị xét xử <span className="text-red-600">(*)</span>
              </label>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-500">Mẫu gợi ý:</span>
                <select
                  onChange={(e) => e.target.value && setReason(e.target.value)}
                  className="text-[11px] bg-slate-100 border border-slate-300 rounded px-2 py-0.5"
                >
                  <option value="">-- Chọn lý do mẫu --</option>
                  <option value="Vụ án có nhiều tình tiết phức tạp, nhiều bị can/bị cáo, cần thu thập thêm chứng cứ.">Vụ án phức tạp, nhiều tình tiết</option>
                  <option value="Đang chờ kết quả giám định pháp y / giám định tài chính của cơ quan chuyên môn.">Chờ kết luận giám định</option>
                  <option value="Đang chờ kết quả thẩm định giá tài sản tranh chấp của Hội đồng định giá.">Chờ kết quả định giá tài sản</option>
                  <option value="Đang thực hiện ủy thác tư pháp xác minh tình tiết tại địa phương khác.">Thực hiện ủy thác tư pháp</option>
                  <option value="Đương sự có đơn đề nghị gia hạn vì lý do trở ngại khách quan chính đáng.">Đương sự gặp trở ngại khách quan</option>
                </select>
              </div>
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập chi tiết căn cứ và lý do cần gia hạn..."
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 focus:ring-1 focus:ring-red-600 focus:outline-none leading-relaxed text-slate-800"
            />
          </div>

          {/* History of Previous Extensions if any */}
          {caseItem.trialExtensions && caseItem.trialExtensions.length > 0 && (
            <div className="border border-slate-200 rounded p-3 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-700 text-[11px] uppercase">
                Lịch sử các lần gia hạn trước đó ({caseItem.trialExtensions.length} lần):
              </div>
              <div className="space-y-1.5">
                {caseItem.trialExtensions.map((ext, idx) => (
                  <div key={ext.id || idx} className="bg-white p-2 rounded border border-slate-200 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-bold text-red-900">Lần {caseItem.trialExtensions!.length - idx}:</span>{' '}
                      Số QĐ: <strong>{ext.decisionNo}</strong> (ngày {formatDateVN(ext.decisionDate)})
                    </div>
                    <div className="text-slate-600">
                      Gia hạn +{ext.extensionDays} ngày → Đến ngày: <strong className="text-red-800">{formatDateVN(ext.newDeadline)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-medium text-xs transition-colors"
          >
            Đóng / Hủy bỏ
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Lưu & In Quyết Định (Mẫu 04-TA)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-5 py-2 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác Nhận Gia Hạn Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
