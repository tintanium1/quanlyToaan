import React, { useState } from 'react';
import { CourtCase, Official, CourtUnitSettings } from '../types/court';
import { formatDateVN } from '../utils/courtUtils';
import { X, UserCheck, Shield, Scale, Briefcase, Printer, Check } from 'lucide-react';

interface JudgeAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CourtCase;
  officials: Official[];
  settings: CourtUnitSettings;
  onSaveAssignment: (
    caseId: string,
    assignmentData: {
      judgeId: string;
      judgeName: string;
      judgeTitle: string;
      altJudgeId?: string;
      altJudgeName?: string;
      clerkId: string;
      clerkName: string;
      altClerkId?: string;
      altClerkName?: string;
      jurors: { id: string; name: string; organization?: string; isAlternate?: boolean }[];
      assignmentDate: string;
      signerName: string;
      signerRole: string;
    }
  ) => void;
  onOpenPrintModal?: (caseItem: CourtCase, docType?: string) => void;
}

export const JudgeAssignmentModal: React.FC<JudgeAssignmentModalProps> = ({
  isOpen,
  onClose,
  caseItem,
  officials,
  settings,
  onSaveAssignment,
  onOpenPrintModal,
}) => {
  if (!isOpen) return null;

  const judges = officials.filter((o) => o.role === 'THAM_PHAN');
  const clerks = officials.filter((o) => o.role === 'THU_KY');
  const allJurors = officials.filter((o) => o.role === 'HOI_THAM');

  const [selectedJudgeId, setSelectedJudgeId] = useState(caseItem.assignedJudgeId || judges[0]?.id || '');
  const [selectedAltJudgeId, setSelectedAltJudgeId] = useState(caseItem.alternateJudgeId || '');
  const [selectedClerkId, setSelectedClerkId] = useState(caseItem.assignedClerkId || clerks[0]?.id || '');
  const [selectedAltClerkId, setSelectedAltClerkId] = useState(caseItem.alternateClerkId || '');

  // Jurors selection (Juror 1, Juror 2, Juror alternate)
  const initialJ1 = caseItem.assignedJurors?.[0]?.id || allJurors[0]?.id || '';
  const initialJ2 = caseItem.assignedJurors?.[1]?.id || allJurors[1]?.id || '';
  const initialJAlt = caseItem.assignedJurors?.find((j) => j.isAlternate)?.id || allJurors[2]?.id || '';

  const [juror1Id, setJuror1Id] = useState(initialJ1);
  const [juror2Id, setJuror2Id] = useState(initialJ2);
  const [jurorAltId, setJurorAltId] = useState(initialJAlt);

  const [assignmentDate, setAssignmentDate] = useState(
    caseItem.assignmentDate || new Date().toISOString().split('T')[0]
  );
  const [signerName, setSignerName] = useState(
    caseItem.assignmentSigner || settings.chiefJudgeName
  );
  const [signerRole, setSignerRole] = useState('Chánh án');

  const handleSave = (andPrint: boolean = false) => {
    const judge = judges.find((j) => j.id === selectedJudgeId);
    const altJudge = judges.find((j) => j.id === selectedAltJudgeId);
    const clerk = clerks.find((c) => c.id === selectedClerkId);
    const altClerk = clerks.find((c) => c.id === selectedAltClerkId);

    const j1 = allJurors.find((j) => j.id === juror1Id);
    const j2 = allJurors.find((j) => j.id === juror2Id);
    const jAlt = allJurors.find((j) => j.id === jurorAltId);

    const assignedJurorsList: {
      id: string;
      name: string;
      organization?: string;
      isAlternate?: boolean;
    }[] = [];

    if (j1) assignedJurorsList.push({ id: j1.id, name: j1.name, organization: j1.organization, isAlternate: false });
    if (j2) assignedJurorsList.push({ id: j2.id, name: j2.name, organization: j2.organization, isAlternate: false });
    if (jAlt) assignedJurorsList.push({ id: jAlt.id, name: jAlt.name, organization: jAlt.organization, isAlternate: true });

    if (!judge || !clerk) {
      alert('Vui lòng chọn Thẩm phán chủ tọa và Thư ký phiên tòa!');
      return;
    }

    onSaveAssignment(caseItem.id, {
      judgeId: judge.id,
      judgeName: judge.name,
      judgeTitle: judge.title,
      altJudgeId: altJudge?.id,
      altJudgeName: altJudge?.name,
      clerkId: clerk.id,
      clerkName: clerk.name,
      altClerkId: altClerk?.id,
      altClerkName: altClerk?.name,
      jurors: assignedJurorsList,
      assignmentDate,
      signerName,
      signerRole,
    });

    onClose();

    if (andPrint && onOpenPrintModal) {
      onOpenPrintModal(
        {
          ...caseItem,
          assignedJudgeId: judge.id,
          assignedJudgeName: judge.name,
          assignedJudgeTitle: judge.title,
          assignedClerkId: clerk.id,
          assignedClerkName: clerk.name,
          assignedJurors: assignedJurorsList,
          assignmentDate,
          assignmentSigner: signerName,
        },
        'QUYET_DINH_PHAN_CONG'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="bg-[#991B1B] text-white px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-base md:text-lg tracking-wide uppercase">
              Chánh Án Phân Công Thẩm Phán, Thư Ký & Hội Thẩm
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case summary banner */}
        <div className="bg-amber-50/80 border-b border-amber-200 px-5 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-800">
          <div>
            <span className="text-slate-500">Mã vụ việc:</span>{' '}
            <strong className="font-mono text-red-800">{caseItem.caseCode}</strong>
            <span className="mx-2 text-slate-300">|</span>
            <span className="text-slate-500">Số thụ lý:</span>{' '}
            <strong className="text-slate-800">{caseItem.docketNumber}</strong>
          </div>
          <div>
            <span className="text-slate-500">Thụ lý ngày:</span>{' '}
            <strong className="text-slate-800">{formatDateVN(caseItem.intakeDate)}</strong>
          </div>
          <div className="w-full text-slate-900 font-medium">
            <span className="text-slate-500">Tên vụ việc:</span> {caseItem.title}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {/* Section 1: Thẩm phán */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-3">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-red-700"></span>
              1. Phân công Thẩm phán giải quyết vụ án
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Thẩm phán chủ tọa phiên tòa <span className="text-red-600">(*)</span>
                </label>
                <select
                  value={selectedJudgeId}
                  onChange={(e) => setSelectedJudgeId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none font-semibold text-slate-900"
                >
                  {judges.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name} - {j.title} (Đang thụ lý: {j.activeCasesCount} vụ)
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Cân đối tải công việc giữa các Thẩm phán trong đơn vị.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Thẩm phán dự khuyết (nếu có)
                </label>
                <select
                  value={selectedAltJudgeId}
                  onChange={(e) => setSelectedAltJudgeId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none text-slate-800"
                >
                  <option value="">-- Không chỉ định Thẩm phán dự khuyết --</option>
                  {judges
                    .filter((j) => j.id !== selectedJudgeId)
                    .map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.name} - {j.title} (Đang thụ lý: {j.activeCasesCount} vụ)
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Thư ký */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-3">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-red-700"></span>
              2. Phân công Thư ký Tòa án
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Thư ký phiên tòa <span className="text-red-600">(*)</span>
                </label>
                <select
                  value={selectedClerkId}
                  onChange={(e) => setSelectedClerkId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none font-semibold text-slate-900"
                >
                  {clerks.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.title} (Đang phụ trách: {c.activeCasesCount} vụ)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Thư ký dự khuyết (nếu có)
                </label>
                <select
                  value={selectedAltClerkId}
                  onChange={(e) => setSelectedAltClerkId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none text-slate-800"
                >
                  <option value="">-- Không chỉ định Thư ký dự khuyết --</option>
                  {clerks
                    .filter((c) => c.id !== selectedClerkId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} - {c.title} (Đang phụ trách: {c.activeCasesCount} vụ)
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Hội thẩm nhân dân */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-3">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-red-700"></span>
              3. Phân công Hội thẩm nhân dân tham gia Hội đồng xét xử
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Hội thẩm thứ nhất <span className="text-red-600">(*)</span>
                </label>
                <select
                  value={juror1Id}
                  onChange={(e) => setJuror1Id(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none text-slate-900"
                >
                  {allJurors.map((jur) => (
                    <option key={jur.id} value={jur.id}>
                      {jur.name} ({jur.organization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Hội thẩm thứ hai <span className="text-red-600">(*)</span>
                </label>
                <select
                  value={juror2Id}
                  onChange={(e) => setJuror2Id(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none text-slate-900"
                >
                  {allJurors
                    .filter((jur) => jur.id !== juror1Id)
                    .map((jur) => (
                      <option key={jur.id} value={jur.id}>
                        {jur.name} ({jur.organization})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Hội thẩm dự khuyết
                </label>
                <select
                  value={jurorAltId}
                  onChange={(e) => setJurorAltId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none text-slate-800"
                >
                  <option value="">-- Không có --</option>
                  {allJurors
                    .filter((jur) => jur.id !== juror1Id && jur.id !== juror2Id)
                    .map((jur) => (
                      <option key={jur.id} value={jur.id}>
                        {jur.name} ({jur.organization})
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Ngày ký & Người ký */}
          <div className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-3">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase">
              <span className="w-2 h-2 rounded-full bg-red-700"></span>
              4. Thông tin ban hành Quyết định phân công
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Ngày ký quyết định <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="date"
                  value={assignmentDate}
                  onChange={(e) => setAssignmentDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Người ký phân công <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Chức vụ người ký
                </label>
                <select
                  value={signerRole}
                  onChange={(e) => setSignerRole(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none"
                >
                  <option value="Chánh án">Chánh án</option>
                  <option value="Phó Chánh án">Phó Chánh án</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Hệ thống sẽ tự động cập nhật vào Hồ sơ vụ án và tạo dự thảo Quyết định phân công Mẫu 01.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-medium text-xs transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Lưu & In Quyết định ngay</span>
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-4 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Lưu phân công</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
