import React, { useState } from 'react';
import { CourtCase, Official, PreventiveMeasure, DetentionExtensionRecord, CaseDecision } from '../types/court';
import { formatDateVN, getDaysRemaining } from '../utils/courtUtils';
import { 
  X, 
  ShieldAlert, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  Scale, 
  Clock,
  UserCheck
} from 'lucide-react';

interface DetentionExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CourtCase;
  officials: Official[];
  preselectedMeasure?: PreventiveMeasure;
  onSaveDetentionExtension: (updatedCase: CourtCase, newDecision: CaseDecision) => void;
  onOpenPrintModal?: (c: CourtCase, docType?: string) => void;
}

export const DetentionExtensionModal: React.FC<DetentionExtensionModalProps> = ({
  isOpen,
  onClose,
  caseItem,
  officials,
  preselectedMeasure,
  onSaveDetentionExtension,
  onOpenPrintModal,
}) => {
  if (!isOpen) return null;

  // Find all active or existing detention measures in the case
  const detentionMeasures = caseItem.preventiveMeasures.filter(
    (pm) => pm.type === 'TAM_GIAM' || pm.type === 'BAT_TAM_GIAM' || pm.type === 'GIA_HAN_TAM_GIAM'
  );

  const initialMeasure = preselectedMeasure || detentionMeasures[0];
  const [selectedMeasureId, setSelectedMeasureId] = useState<string>(initialMeasure?.id || '');

  const activeMeasure = detentionMeasures.find((m) => m.id === selectedMeasureId) || initialMeasure;

  // Fallback target person from defendants
  const defendants = caseItem.litigants.filter((l) => l.role === 'BI_CAN' || l.role === 'BI_CAO');
  const defaultTarget = activeMeasure?.targetPerson || defendants[0]?.name || caseItem.title;

  const [targetPerson, setTargetPerson] = useState(defaultTarget);
  const [extensionDays, setExtensionDays] = useState<number>(30);
  const [isUntilTrialEnd, setIsUntilTrialEnd] = useState<boolean>(false);
  const [decisionNo, setDecisionNo] = useState(`${caseItem.decisions.length + 1}/2026/L-GHTG-TA`);
  const [decisionDate, setDecisionDate] = useState('2026-06-27');
  const [detentionFacility, setDetentionFacility] = useState('Trại tạm giam Công an tỉnh');
  const [reason, setReason] = useState(
    'Cần tiếp tục tạm giam bị cáo để hoàn thành việc chuẩn bị xét xử và bảo đảm có mặt tại phiên tòa theo quy định tại Điều 278 Bộ luật Tố tụng Hình sự 2015.'
  );

  // Signer
  const judges = officials.filter((o) => o.role === 'THAM_PHAN' || o.role === 'CHANH_AN');
  const defaultJudgeName = caseItem.assignedJudgeName || judges[0]?.name || 'Võ Thị Tuyết Trinh';
  const defaultJudgeRole = caseItem.assignedJudgeTitle || 'Thẩm phán chủ tọa phiên tòa';

  const [signerName, setSignerName] = useState(defaultJudgeName);
  const [signerRole, setSignerRole] = useState(defaultJudgeRole);

  // Compute base date and new effective date
  const baseEffectiveDateStr = activeMeasure?.effectiveTo || '2026-06-30';
  const baseDateObj = new Date(baseEffectiveDateStr);
  const newDateObj = new Date(baseDateObj.getTime() + extensionDays * 24 * 60 * 60 * 1000);
  const calculatedNewDateStr = !isNaN(newDateObj.getTime())
    ? newDateObj.toISOString().split('T')[0]
    : '2026-07-30';

  const newEffectiveToStr = isUntilTrialEnd
    ? 'Đến khi kết thúc phiên tòa'
    : calculatedNewDateStr;

  const currentRemaining = getDaysRemaining(baseEffectiveDateStr);
  const newRemaining = !isUntilTrialEnd ? getDaysRemaining(calculatedNewDateStr) : null;

  const handleSubmit = (andPrint: boolean = false) => {
    const extensionRecord: DetentionExtensionRecord = {
      id: 'dext-' + Date.now(),
      targetPerson,
      decisionNo,
      decisionDate,
      previousEffectiveTo: baseEffectiveDateStr,
      newEffectiveTo: calculatedNewDateStr,
      extensionDays,
      reason,
      detentionFacility,
      signerName,
      signerRole,
      createdAt: new Date().toISOString(),
    };

    const newDecision: CaseDecision = {
      id: 'dec-' + Date.now(),
      decisionType: 'LENH_GIA_HAN_TAM_GIAM',
      decisionTypeName: 'Lệnh gia hạn thời hạn tạm giam',
      decisionNo,
      issuedDate: decisionDate,
      effectiveDate: decisionDate,
      signerName,
      signerRole,
      summary: `Gia hạn thời hạn tạm giam đối với bị cáo ${targetPerson} thêm ${
        isUntilTrialEnd ? 'cho đến khi kết thúc phiên tòa' : `${extensionDays} ngày (đến ngày ${formatDateVN(calculatedNewDateStr)})`
      } theo Điều 278 BLTTHS.`,
    };

    // Update or add preventive measure
    let updatedPreventiveMeasures: PreventiveMeasure[] = [];
    if (activeMeasure) {
      updatedPreventiveMeasures = caseItem.preventiveMeasures.map((pm) => {
        if (pm.id === activeMeasure.id) {
          return {
            ...pm,
            type: 'GIA_HAN_TAM_GIAM' as const,
            typeName: 'Gia hạn thời hạn tạm giam',
            decisionNo: decisionNo,
            effectiveFrom: baseEffectiveDateStr,
            effectiveTo: calculatedNewDateStr,
            issuingAuthority: caseItem.courtName,
            status: 'HIEU_LUC' as const,
            notes: `Gia hạn thêm ${extensionDays} ngày theo Lệnh số ${decisionNo}. ${reason}`,
          };
        }
        return pm;
      });
    } else {
      const newPm: PreventiveMeasure = {
        id: 'pm-' + Date.now(),
        type: 'GIA_HAN_TAM_GIAM',
        typeName: 'Gia hạn thời hạn tạm giam',
        targetPerson,
        decisionNo,
        issuedDate: decisionDate,
        effectiveFrom: baseEffectiveDateStr,
        effectiveTo: calculatedNewDateStr,
        issuingAuthority: caseItem.courtName,
        status: 'HIEU_LUC',
        notes: reason,
      };
      updatedPreventiveMeasures = [newPm, ...caseItem.preventiveMeasures];
    }

    // Update litigant detention status note
    const updatedLitigants = caseItem.litigants.map((lit) => {
      if (lit.name.toLowerCase() === targetPerson.toLowerCase() || lit.role === 'BI_CAN' || lit.role === 'BI_CAO') {
        return {
          ...lit,
          detentionStatus: `Đang tạm giam theo Lệnh gia hạn số ${decisionNo} (đến ${formatDateVN(calculatedNewDateStr)})`,
        };
      }
      return lit;
    });

    const updatedCase: CourtCase = {
      ...caseItem,
      preventiveMeasures: updatedPreventiveMeasures,
      litigants: updatedLitigants,
      detentionExtensions: [extensionRecord, ...(caseItem.detentionExtensions || [])],
      decisions: [newDecision, ...caseItem.decisions],
      updatedAt: new Date().toISOString(),
    };

    onSaveDetentionExtension(updatedCase, newDecision);
    onClose();

    if (andPrint && onOpenPrintModal) {
      setTimeout(() => {
        onOpenPrintModal(updatedCase, 'MAU_07_GHTG');
      }, 200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#991B1B] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-bold text-base md:text-lg tracking-wide uppercase">
                Lệnh Gia Hạn Thời Hạn Tạm Giam
              </h2>
              <div className="text-[11px] text-amber-200">
                Thẩm quyền: Thẩm phán chủ tọa phiên tòa / Chánh án Tòa án theo Điều 278 Bộ luật Tố tụng Hình sự 2015
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

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Target Person & Measure selector */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5 text-red-900 font-bold uppercase text-[11px]">
                <Scale className="w-4 h-4 text-amber-700" />
                Thông tin bị can, bị cáo đang bị tạm giam
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Vụ án: {caseItem.docketNumber}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Chọn người bị áp dụng tạm giam <span className="text-red-600">(*)</span>
                </label>
                {detentionMeasures.length > 1 ? (
                  <select
                    value={selectedMeasureId}
                    onChange={(e) => {
                      setSelectedMeasureId(e.target.value);
                      const found = detentionMeasures.find((m) => m.id === e.target.value);
                      if (found) setTargetPerson(found.targetPerson);
                    }}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  >
                    {detentionMeasures.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.targetPerson} (Lệnh: {m.decisionNo} - Hạn đến: {formatDateVN(m.effectiveTo)})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={targetPerson}
                    onChange={(e) => setTargetPerson(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nơi giam giữ hiện tại
                </label>
                <input
                  type="text"
                  value={detentionFacility}
                  onChange={(e) => setDetentionFacility(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Current Detention Info & Warning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-amber-50/70 border border-amber-200 rounded p-3 space-y-1">
              <div className="text-[11px] font-bold text-amber-900 uppercase">
                Hạn tạm giam theo Lệnh hiện tại:
              </div>
              <div className="text-base font-bold text-slate-900 font-mono">
                {formatDateVN(baseEffectiveDateStr)}
              </div>
              <div className="text-[11px] font-semibold text-amber-800">
                Tình trạng: {currentRemaining.displayText}
              </div>
            </div>

            <div className="bg-emerald-50/80 border border-emerald-200 rounded p-3 space-y-1">
              <div className="text-[11px] font-bold text-emerald-900 uppercase flex items-center gap-1">
                <span>Hạn mới sau khi gia hạn:</span>
                <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded text-[10px]">
                  {isUntilTrialEnd ? 'Theo phiên tòa' : `+${extensionDays} ngày`}
                </span>
              </div>
              <div className="text-base font-bold text-emerald-800 font-mono">
                {isUntilTrialEnd ? 'Cho đến khi kết thúc phiên tòa' : formatDateVN(calculatedNewDateStr)}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium">
                {newRemaining ? `Tình trạng mới: ${newRemaining.displayText}` : 'Đảm bảo thời gian xét xử'}
              </div>
            </div>
          </div>

          {/* Preset Extension Periods */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-slate-700 font-bold">
                Thời hạn gia hạn tạm giam <span className="text-red-600">(*)</span>:
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-red-900">
                <input
                  type="checkbox"
                  checked={isUntilTrialEnd}
                  onChange={(e) => setIsUntilTrialEnd(e.target.checked)}
                  className="rounded text-red-700 focus:ring-red-600 w-4 h-4"
                />
                <span>Gia hạn "Cho đến khi kết thúc phiên tòa" (Khoản 2 Điều 278)</span>
              </label>
            </div>

            {!isUntilTrialEnd && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { days: 15, label: '15 ngày', desc: 'Bổ sung thời gian cấp thiết' },
                  { days: 30, label: '30 ngày (01 tháng)', desc: 'Chuẩn bị xét xử' },
                  { days: 45, label: '45 ngày', desc: 'Vụ án rất nghiêm trọng' },
                  { days: 60, label: '60 ngày (02 tháng)', desc: 'Vụ án đặc biệt phức tạp' },
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
            )}
          </div>

          {/* Decision Number & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Số Lệnh gia hạn tạm giam <span className="text-red-600">(*)</span>
              </label>
              <input
                type="text"
                value={decisionNo}
                onChange={(e) => setDecisionNo(e.target.value)}
                placeholder="VD: 04/2026/L-GHTG-TA"
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none font-mono font-bold text-red-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Ngày ra Lệnh gia hạn
              </label>
              <input
                type="date"
                value={decisionDate}
                onChange={(e) => setDecisionDate(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Signer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Người ký Lệnh gia hạn
              </label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none font-semibold text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Chức vụ người ký
              </label>
              <select
                value={signerRole}
                onChange={(e) => setSignerRole(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
              >
                <option value="Thẩm phán chủ tọa phiên tòa">Thẩm phán chủ tọa phiên tòa (Khoản 1 Điều 278)</option>
                <option value="Chánh án Tòa án nhân dân">Chánh án Tòa án nhân dân</option>
                <option value="Phó Chánh án Tòa án nhân dân">Phó Chánh án Tòa án nhân dân</option>
              </select>
            </div>
          </div>

          {/* Detention Reasons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-slate-700 font-bold">
                Lý do gia hạn thời hạn tạm giam <span className="text-red-600">(*)</span>
              </label>
              <select
                onChange={(e) => e.target.value && setReason(e.target.value)}
                className="text-[11px] bg-slate-100 border border-slate-300 rounded px-2 py-0.5"
              >
                <option value="">-- Chọn lý do mẫu chuẩn BLTTHS --</option>
                <option value="Cần tiếp tục tạm giam để hoàn thành việc chuẩn bị xét xử đối với vụ án có tính chất rất nghiêm trọng/đặc biệt nghiêm trọng.">Hoàn thành chuẩn bị xét xử</option>
                <option value="Ngăn ngừa nguy cơ bị cáo bỏ trốn, tiêu hủy chứng cứ hoặc tiếp tục thực hiện hành vi phạm tội.">Ngăn ngừa trốn tránh / tiêu hủy chứng cứ</option>
                <option value="Bảo đảm sự có mặt của bị cáo tại phiên tòa xét xử sơ thẩm theo quyết định đưa vụ án ra xét xử.">Bảo đảm có mặt tại phiên tòa</option>
              </select>
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded px-3 py-2 focus:ring-1 focus:ring-red-600 focus:outline-none leading-relaxed text-slate-800"
            />
          </div>

          {/* Prior Detention Extension Records if any */}
          {caseItem.detentionExtensions && caseItem.detentionExtensions.length > 0 && (
            <div className="border border-slate-200 rounded p-3 bg-slate-50 space-y-2">
              <div className="font-bold text-slate-700 text-[11px] uppercase">
                Lịch sử các lần gia hạn tạm giam ({caseItem.detentionExtensions.length} lần):
              </div>
              <div className="space-y-1.5">
                {caseItem.detentionExtensions.map((dext, idx) => (
                  <div key={dext.id || idx} className="bg-white p-2 rounded border border-slate-200 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="font-bold text-red-900">{dext.targetPerson}:</span>{' '}
                      Lệnh số: <strong>{dext.decisionNo}</strong> (ngày {formatDateVN(dext.decisionDate)})
                    </div>
                    <div className="text-slate-600">
                      Gia hạn +{dext.extensionDays} ngày → Hạn mới: <strong className="text-red-800">{formatDateVN(dext.newEffectiveTo)}</strong>
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
              <span>Lưu & In Lệnh Gia Hạn Tạm Giam</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              className="px-5 py-2 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Ban Hành Lệnh Gia Hạn Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
