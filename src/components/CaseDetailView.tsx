import React, { useState } from 'react';
import { CourtCase, CaseDecision, PreventiveMeasure, DecisionType, Official, UserAccount } from '../types/court';
import { formatDateVN, getDaysRemaining, getStatusBadge, getCaseTypeName } from '../utils/courtUtils';
import { getRoleBadge, hasPermission, isCaseAssignedToUser } from '../utils/rbacUtils';
import { TrialExtensionModal } from './TrialExtensionModal';
import { DetentionExtensionModal } from './DetentionExtensionModal';
import { CaseHistoryTimeline } from './CaseHistoryTimeline';
import { 
  FolderTree, 
  ChevronRight, 
  ChevronDown, 
  FileText, 
  UserCheck, 
  Scale, 
  ShieldAlert, 
  Clock, 
  Calendar, 
  Printer, 
  Plus, 
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Eye,
  Gavel,
  History,
  Lock,
  Shield,
  Trash2
} from 'lucide-react';

interface CaseDetailViewProps {
  caseItem: CourtCase;
  officials?: Official[];
  onUpdateCase: (updatedCase: CourtCase) => void;
  onOpenAssignModal: (c: CourtCase) => void;
  onOpenPrintModal: (c: CourtCase, docType?: string) => void;
  onBack: () => void;
  onOpenTrialExtension?: (c: CourtCase) => void;
  onOpenDetentionExtension?: (c: CourtCase, pm?: PreventiveMeasure) => void;
  onDeleteCase?: (c: CourtCase) => void;
  currentUser?: UserAccount;
  onDenyPermission?: (actionName: string, requiredRole: string) => void;
}

type TreeSection = 
  | '1_THU_LY'
  | '2_PHAN_CONG'
  | '3_1_NGUOI_TO_TUNG'
  | '3_2_DUONG_SU'
  | '3_3_QUYET_DINH'
  | '3_4_BAN_AN'
  | '3_7_BIEN_PHAP_NGAN_CHAN'
  | 'TIMELINE';

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({
  caseItem,
  officials = [],
  onUpdateCase,
  onOpenAssignModal,
  onOpenPrintModal,
  onBack,
  onOpenTrialExtension,
  onOpenDetentionExtension,
  onDeleteCase,
  currentUser,
  onDenyPermission,
}) => {
  const [activeSection, setActiveSection] = useState<TreeSection>('3_3_QUYET_DINH');
  const [bSoThamExpanded, setBSoThamExpanded] = useState(true);
  const [ttGiaiQuyetExpanded, setTtGiaiQuyetExpanded] = useState(true);

  // Modals inside CaseDetailView
  const [isTrialExtModalOpen, setIsTrialExtModalOpen] = useState(false);
  const [isDetentionExtModalOpen, setIsDetentionExtModalOpen] = useState(false);
  const [selectedPmForExtension, setSelectedPmForExtension] = useState<PreventiveMeasure | undefined>(undefined);

  // New decision form state
  const [newDecType, setNewDecType] = useState<DecisionType>('DUA_VU_AN_RA_XET_XU');
  const [decNo, setDecNo] = useState('');
  const [decDate, setDecDate] = useState('2026-06-23');
  const [decEffectiveDate, setDecEffectiveDate] = useState('2026-06-23');
  const [decSigner, setDecSigner] = useState(caseItem.assignedJudgeName || 'Võ Thị Tuyết Trinh');
  const [decSignerRole, setDecSignerRole] = useState('Thẩm phán chủ tọa');
  const [trialDate, setTrialDate] = useState('2026-07-06 08:00');
  const [trialLocation, setTrialLocation] = useState('Hội trường xét xử số 1 - TAND');
  const [decSummary, setDecSummary] = useState('');

  const deadlineInfo = getDaysRemaining(caseItem.deadlineDate);
  const statusBadge = getStatusBadge(caseItem.status);

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();

    // Enforce role-based access control
    if (currentUser) {
      if (newDecType === 'DUA_VU_AN_RA_XET_XU' && !currentUser.permissions.canIssueTrialDecision) {
        if (onDenyPermission) {
          onDenyPermission('Ban hành Quyết định đưa vụ án ra xét xử', 'Thẩm phán giải quyết / Lãnh đạo Tòa án');
        } else {
          alert('Tài khoản của bạn không có quyền ban hành Quyết định đưa vụ án ra xét xử.');
        }
        return;
      }
      if ((newDecType === 'BAN_AN_SO_THAM' || newDecType === 'DINH_CHI' || newDecType === 'CONG_NHAN_THOA_THUAN') && !currentUser.permissions.canIssueJudgment) {
        if (onDenyPermission) {
          onDenyPermission('Ban hành Bản án sơ thẩm / Quyết định giải quyết', 'Thẩm phán giải quyết / Lãnh đạo Tòa án');
        } else {
          alert('Tài khoản của bạn không có quyền ban hành Bản án hoặc Quyết định giải quyết.');
        }
        return;
      }
      if (newDecType === 'GIA_HAN_CHUAN_BI_XET_XU' && !currentUser.permissions.canExtendPreparation) {
        if (onDenyPermission) {
          onDenyPermission('Ký Quyết định gia hạn thời hạn chuẩn bị xét xử', 'Lãnh đạo Tòa án (Chánh án / Phó Chánh án)');
        } else {
          alert('Quyền ký quyết định gia hạn thời hạn chuẩn bị xét xử thuộc Lãnh đạo Tòa án.');
        }
        return;
      }
      if ((newDecType === 'LENH_TAM_GIAM' || newDecType === 'LENH_GIA_HAN_TAM_GIAM') && !currentUser.permissions.canExtendDetention) {
        if (onDenyPermission) {
          onDenyPermission('Ban hành Lệnh tạm giam / Gia hạn tạm giam', 'Thẩm phán chủ tọa phiên tòa / Lãnh đạo Tòa án');
        } else {
          alert('Tài khoản của bạn không có quyền ban hành Lệnh tạm giam.');
        }
        return;
      }
    }

    const typeNames: Record<DecisionType, string> = {
      QUYET_DINH_PHAN_CONG: 'Quyết định phân công Thẩm phán',
      LENH_TAM_GIAM: 'Lệnh tạm giam của Tòa án',
      LENH_GIA_HAN_TAM_GIAM: 'Lệnh gia hạn thời hạn tạm giam',
      DUA_VU_AN_RA_XET_XU: 'Quyết định đưa vụ án ra xét xử',
      GIA_HAN_CHUAN_BI_XET_XU: 'Quyết định gia hạn thời hạn chuẩn bị xét xử',
      TAM_DINH_CHI: 'Quyết định tạm đình chỉ giải quyết vụ án',
      DINH_CHI: 'Quyết định đình chỉ giải quyết vụ án',
      BAN_AN_SO_THAM: 'Bản án sơ thẩm',
      CONG_NHAN_THOA_THUAN: 'Quyết định công nhận sự thỏa thuận',
    };

    const newDec: CaseDecision = {
      id: 'dec-' + Date.now(),
      decisionType: newDecType,
      decisionTypeName: typeNames[newDecType],
      decisionNo: decNo || `${Math.floor(Math.random() * 50) + 1}/2026/QĐ-TA`,
      issuedDate: decDate,
      effectiveDate: decEffectiveDate,
      signerName: decSigner,
      signerRole: decSignerRole,
      summary: decSummary || `Ban hành ${typeNames[newDecType]} theo quy định pháp luật.`,
      trialDate: newDecType === 'DUA_VU_AN_RA_XET_XU' ? trialDate : undefined,
      trialLocation: newDecType === 'DUA_VU_AN_RA_XET_XU' ? trialLocation : undefined,
    };

    let updatedStatus = caseItem.status;
    let updatedStatusName = caseItem.statusName;

    if (newDecType === 'DUA_VU_AN_RA_XET_XU') {
      updatedStatus = 'DA_CO_QUYET_DINH';
      updatedStatusName = 'Đã có QĐ đưa vụ án ra xét xử';
    } else if (newDecType === 'GIA_HAN_CHUAN_BI_XET_XU') {
      updatedStatus = 'GIA_HAN';
      updatedStatusName = 'Gia hạn chuẩn bị xét xử';
    } else if (newDecType === 'TAM_DINH_CHI') {
      updatedStatus = 'TAM_DINH_CHI';
      updatedStatusName = 'Tạm đình chỉ vụ án';
    } else if (newDecType === 'BAN_AN_SO_THAM') {
      updatedStatus = 'DA_TUYEN_AN';
      updatedStatusName = 'Đã tuyên án sơ thẩm';
    }

    const updated = {
      ...caseItem,
      status: updatedStatus,
      statusName: updatedStatusName,
      decisions: [newDec, ...caseItem.decisions],
      updatedAt: new Date().toISOString(),
    };

    onUpdateCase(updated);
    alert('Đã lưu Quyết định thành công vào hồ sơ vụ án!');
    // Reset form
    setDecNo('');
    setDecSummary('');
  };

  return (
    <div className="space-y-3">
      {/* RBAC Role Context Banner */}
      {currentUser && (
        <div className="bg-white border border-slate-300 rounded px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getRoleBadge(currentUser.role).bgClass} ${getRoleBadge(currentUser.role).textClass} ${getRoleBadge(currentUser.role).borderClass}`}>
              {getRoleBadge(currentUser.role).label}
            </span>
            <span className="text-slate-600 font-medium">
              {currentUser.role === 'THAM_PHAN' && (
                caseItem.assignedJudgeName === currentUser.fullName ? (
                  <span className="text-emerald-800 font-semibold">
                    ✓ Bạn là <strong>Thẩm phán chủ tọa</strong> giải quyết vụ án này. Bạn có quyền cập nhật tiến độ, ra QĐ xét xử, Lệnh tạm giam và Bản án sơ thẩm.
                  </span>
                ) : (
                  <span>
                    Vụ án đang do <strong>Thẩm phán {caseItem.assignedJudgeName || 'Chưa phân công'}</strong> giải quyết. (Chế độ xem tiến độ)
                  </span>
                )
              )}
              {currentUser.role === 'THU_KY' && (
                caseItem.assignedClerkName === currentUser.fullName ? (
                  <span className="text-teal-800 font-semibold">
                    ✓ Bạn là <strong>Thư ký phiên tòa</strong> được phân công giúp việc. Cập nhật biên bản, tống đạt và hoàn thiện hồ sơ.
                  </span>
                ) : (
                  <span>
                    Vụ án đang do <strong>Thư ký {caseItem.assignedClerkName || 'Chưa phân công'}</strong> phụ trách hồ sơ.
                  </span>
                )
              )}
              {currentUser.role === 'LANH_DAO' && (
                <span className="text-red-900 font-semibold">
                  ★ Lãnh đạo Tòa án: Giám sát toàn diện tiến độ vụ án, toàn quyền phân công Thẩm phán và ký duyệt QĐ gia hạn xét xử.
                </span>
              )}
              {currentUser.role === 'CAN_BO_TONG_HOP' && (
                <span className="text-blue-900 font-semibold">
                  ℹ Cán bộ Tổng hợp & Thụ lý: Theo dõi thụ lý ban đầu, kiểm tra thời hạn và tổng hợp báo cáo số liệu thống kê.
                </span>
              )}
              {currentUser.role === 'ADMIN' && (
                <span className="text-purple-900 font-semibold">
                  🛡 Quản trị viên: Toàn quyền truy cập, kiểm tra và thử nghiệm các thao tác nghiệp vụ Tòa án.
                </span>
              )}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Tài khoản: @{currentUser.username}
          </div>
        </div>
      )}

      {/* Real-time Timeline Bar (Tiến trình giải quyết theo thời gian thực) */}
      <div className="bg-white border border-slate-300 rounded shadow-2xs p-3">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5 pb-2 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-red-700" />
              Tiến độ giải quyết theo thời gian thực:
            </span>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${statusBadge.bgClass} ${statusBadge.textClass} ${statusBadge.borderClass}`}>
              {caseItem.statusName}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Hạn luật định:</span>
              <span className="font-semibold text-slate-800">{formatDateVN(caseItem.deadlineDate)}</span>
            </div>

            <div className={`flex items-center gap-1 font-bold text-xs px-2 py-0.5 rounded ${
              deadlineInfo.isOverdue
                ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                : deadlineInfo.isWarning
                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
            }`}>
              {deadlineInfo.isOverdue ? (
                <AlertCircle className="w-3.5 h-3.5 text-red-600" />
              ) : deadlineInfo.isWarning ? (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>{deadlineInfo.displayText}</span>
            </div>

            <div className="flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={() => setActiveSection('TIMELINE')}
                className={`px-2.5 py-1 rounded font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all ${
                  activeSection === 'TIMELINE'
                    ? 'bg-[#991B1B] text-white ring-2 ring-red-300'
                    : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300'
                }`}
                title="Xem toàn bộ Dòng thời gian tố tụng (Case History Timeline)"
              >
                <History className="w-3.5 h-3.5 text-amber-600" />
                <span>Dòng thời gian vụ án</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenTrialExtension) onOpenTrialExtension(caseItem);
                  else setIsTrialExtModalOpen(true);
                }}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                title="Gia hạn thời hạn chuẩn bị xét xử theo Điều 277 BLTTHS hoặc Điều 203 BLTTDS"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Gia hạn chuẩn bị XX</span>
              </button>

              {caseItem.caseType === 'HINH_SU' && (
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenDetentionExtension) onOpenDetentionExtension(caseItem);
                    else setIsDetentionExtModalOpen(true);
                  }}
                  className="px-2.5 py-1 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                  title="Gia hạn thời hạn tạm giam theo Điều 278 BLTTHS"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Gia hạn tạm giam</span>
                </button>
              )}

              {onDeleteCase && (
                <button
                  type="button"
                  onClick={() => onDeleteCase(caseItem)}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                  title="Xóa hồ sơ vụ án này khỏi hệ thống"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Xóa vụ án</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-[11px]">
          <div className={`p-2 rounded border ${
            caseItem.intakeDate ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="font-bold">1. Thụ lý vụ án</div>
            <div className="text-[10px] opacity-80">{formatDateVN(caseItem.intakeDate)}</div>
          </div>

          <div className={`p-2 rounded border ${
            caseItem.assignedJudgeName ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
          }`}>
            <div className="font-bold">2. Phân công TP</div>
            <div className="text-[10px] opacity-80">
              {caseItem.assignedJudgeName ? caseItem.assignedJudgeName : 'Chưa phân công'}
            </div>
          </div>

          <div className={`p-2 rounded border ${
            caseItem.status === 'DANG_CHUAN_BI_XET_XU' || caseItem.status === 'GIA_HAN' || caseItem.status === 'DA_CO_QUYET_DINH' || caseItem.status === 'DA_TUYEN_AN' || caseItem.status === 'DA_GIAI_QUYET'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="font-bold">3. Chuẩn bị xét xử</div>
            <div className="text-[10px] opacity-80">
              {caseItem.status === 'GIA_HAN' ? 'Đã gia hạn' : 'Nghiên cứu hồ sơ'}
            </div>
          </div>

          <div className={`p-2 rounded border ${
            caseItem.decisions.some(d => d.decisionType === 'DUA_VU_AN_RA_XET_XU') || caseItem.status === 'DA_TUYEN_AN' || caseItem.status === 'DA_GIAI_QUYET'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="font-bold">4. QĐ Đưa ra XX</div>
            <div className="text-[10px] opacity-80">
              {caseItem.decisions.find(d => d.decisionType === 'DUA_VU_AN_RA_XET_XU')?.trialDate || 'Chưa mở phiên tòa'}
            </div>
          </div>

          <div className={`p-2 rounded border ${
            caseItem.status === 'DA_TUYEN_AN' || caseItem.status === 'DA_GIAI_QUYET'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}>
            <div className="font-bold">5. Tuyên án / Xong</div>
            <div className="text-[10px] opacity-80">
              {caseItem.judgmentResult?.judgmentNo || 'Chưa ban hành bản án'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column View mirroring Court Software (Cây thư mục bên trái, Form bên phải) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
        {/* Left Tree Sidebar (A. Hồ sơ vụ án, B. Sơ thẩm -> 1, 2, 3...) */}
        <div className="md:col-span-3 bg-white border border-slate-300 rounded shadow-2xs overflow-hidden">
          <div className="bg-[#991B1B] text-white px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
            <span>{getCaseTypeName(caseItem.caseType)}</span>
            <span className="text-[10px] bg-red-800 px-1.5 py-0.5 rounded font-mono">
              {caseItem.level === 'SO_THAM' ? 'SƠ THẨM' : 'PHÚC THẨM'}
            </span>
          </div>

          <div className="p-2 space-y-1 text-xs select-none">
            {/* A. Hồ sơ vụ án */}
            <div className="flex items-center gap-1.5 px-2 py-1 text-slate-700 font-semibold hover:bg-slate-100 rounded cursor-pointer">
              <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-slate-500">+</span>
              <FolderTree className="w-3.5 h-3.5 text-blue-600" />
              <span>A. Hồ sơ vụ án</span>
            </div>

            {/* B. Sơ thẩm */}
            <div>
              <div 
                onClick={() => setBSoThamExpanded(!bSoThamExpanded)}
                className="flex items-center gap-1.5 px-2 py-1 text-slate-800 font-bold hover:bg-slate-100 rounded cursor-pointer"
              >
                {bSoThamExpanded ? (
                  <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-slate-600">-</span>
                ) : (
                  <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-slate-600">+</span>
                )}
                <FolderTree className="w-3.5 h-3.5 text-amber-600" />
                <span>B. Sơ thẩm</span>
              </div>

              {bSoThamExpanded && (
                <div className="pl-4 space-y-0.5 mt-0.5 border-l border-slate-200 ml-3">
                  {/* 1. Thụ lý */}
                  <button
                    onClick={() => setActiveSection('1_THU_LY')}
                    className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 transition-colors ${
                      activeSection === '1_THU_LY'
                        ? 'bg-amber-100 text-amber-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>1. Thụ lý</span>
                  </button>

                  {/* 2. Phân công thẩm phán giải quyết */}
                  <button
                    onClick={() => setActiveSection('2_PHAN_CONG')}
                    className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 transition-colors ${
                      activeSection === '2_PHAN_CONG'
                        ? 'bg-amber-100 text-amber-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>2. Phân công thẩm phán</span>
                  </button>

                  {/* 3. Thông tin giải quyết */}
                  <div>
                    <div 
                      onClick={() => setTtGiaiQuyetExpanded(!ttGiaiQuyetExpanded)}
                      className="px-2 py-1 text-slate-800 font-semibold hover:bg-slate-100 rounded cursor-pointer flex items-center gap-1.5"
                    >
                      {ttGiaiQuyetExpanded ? (
                        <span className="w-3 h-3 flex items-center justify-center font-bold text-slate-500">-</span>
                      ) : (
                        <span className="w-3 h-3 flex items-center justify-center font-bold text-slate-500">+</span>
                      )}
                      <span>3. Thông tin giải quyết</span>
                    </div>

                    {ttGiaiQuyetExpanded && (
                      <div className="pl-3 space-y-0.5 mt-0.5 border-l border-slate-200 ml-2 text-[11.5px]">
                        <button
                          onClick={() => setActiveSection('3_1_NGUOI_TO_TUNG')}
                          className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 transition-colors ${
                            activeSection === '3_1_NGUOI_TO_TUNG'
                              ? 'bg-amber-100 text-amber-900 font-bold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          <span>3.1 Người tiến hành tố tụng</span>
                        </button>

                        <button
                          onClick={() => setActiveSection('3_2_DUONG_SU')}
                          className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 transition-colors ${
                            activeSection === '3_2_DUONG_SU'
                              ? 'bg-amber-100 text-amber-900 font-bold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          <span>3.2 Bị can, bị cáo / Đương sự</span>
                        </button>

                        <button
                          onClick={() => setActiveSection('3_3_QUYET_DINH')}
                          className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 transition-colors ${
                            activeSection === '3_3_QUYET_DINH'
                              ? 'bg-amber-100 text-amber-900 font-bold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                          <span>3.3 Quyết định vụ án</span>
                        </button>

                        <button
                          onClick={() => setActiveSection('3_4_BAN_AN')}
                          className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 transition-colors ${
                            activeSection === '3_4_BAN_AN'
                              ? 'bg-amber-100 text-amber-900 font-bold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          <span>3.4 Bản án / QĐ sơ thẩm</span>
                        </button>

                        <button
                          onClick={() => setActiveSection('3_7_BIEN_PHAP_NGAN_CHAN')}
                          className={`w-full text-left px-2 py-1 rounded flex items-center gap-2 transition-colors ${
                            activeSection === '3_7_BIEN_PHAP_NGAN_CHAN'
                              ? 'bg-amber-100 text-amber-900 font-bold'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                          <span>3.7 Biện pháp ngăn chặn</span>
                        </button>

                        <button
                          onClick={() => setActiveSection('TIMELINE')}
                          className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between gap-1.5 transition-colors ${
                            activeSection === 'TIMELINE'
                              ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                              : 'text-slate-700 hover:bg-slate-100 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <History className="w-3.5 h-3.5 text-red-700 shrink-0" />
                            <span className="truncate">3.8 Dòng thời gian tố tụng</span>
                          </div>
                          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0">
                            {(caseItem.decisions?.length || 0) + (caseItem.preventiveMeasures?.length || 0) + (caseItem.trialExtensions?.length || 0) + (caseItem.detentionExtensions?.length || 0) + 2}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Main Content Pane */}
        <div className="md:col-span-9 bg-white border border-slate-300 rounded shadow-2xs overflow-hidden">
          {/* Breadcrumb matching court software */}
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 text-xs text-slate-600 flex items-center gap-1.5 font-medium">
            <span>{getCaseTypeName(caseItem.caseType)}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>B. Sơ thẩm</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span>3. Thông tin giải quyết</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-slate-900">
              {activeSection === '1_THU_LY' && '1. Thụ lý vụ án'}
              {activeSection === '2_PHAN_CONG' && '2. Phân công thẩm phán giải quyết'}
              {activeSection === '3_1_NGUOI_TO_TUNG' && '3.1 Người tiến hành tố tụng'}
              {activeSection === '3_2_DUONG_SU' && '3.2 Quyết định bị can, bị cáo / Đương sự'}
              {activeSection === '3_3_QUYET_DINH' && '3.3 Quyết định vụ án'}
              {activeSection === '3_4_BAN_AN' && '3.4 Bản án / Quyết định sơ thẩm'}
              {activeSection === '3_7_BIEN_PHAP_NGAN_CHAN' && '3.7 Biện pháp ngăn chặn & bảo đảm'}
              {activeSection === 'TIMELINE' && '3.8 Dòng thời gian tố tụng (Case History Timeline)'}
            </span>
          </div>

          <div className="p-4 space-y-4 text-xs">
            {/* ================= SECTION 3.3: QUYẾT ĐỊNH VỤ ÁN (EXACT MIRROR OF SCREENSHOT) ================= */}
            {activeSection === '3_3_QUYET_DINH' && (
              <div className="space-y-4">
                <form onSubmit={handleAddDecision} className="space-y-3 bg-slate-50 border border-slate-200 rounded p-3.5">
                  <div className="font-bold text-slate-800 text-xs uppercase flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-red-900">Thông tin quyết định</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      (*: Thông tin bắt buộc)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Thụ lý <span className="text-red-600">(*)</span>
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={`${caseItem.docketNumber} - ${caseItem.title} - ${formatDateVN(caseItem.intakeDate)}`}
                        className="w-full bg-slate-100 border border-slate-300 rounded px-2.5 py-1.5 text-slate-700 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Tên quyết định <span className="text-red-600">(*)</span>
                      </label>
                      <select
                        value={newDecType}
                        onChange={(e) => setNewDecType(e.target.value as DecisionType)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none font-semibold text-slate-900"
                      >
                        <option value="DUA_VU_AN_RA_XET_XU">Quyết định đưa vụ án ra xét xử</option>
                        <option value="GIA_HAN_CHUAN_BI_XET_XU">Quyết định gia hạn thời hạn chuẩn bị xét xử</option>
                        <option value="TAM_DINH_CHI">Quyết định tạm đình chỉ giải quyết vụ án</option>
                        <option value="DINH_CHI">Quyết định đình chỉ giải quyết vụ án</option>
                        <option value="QUYET_DINH_PHAN_CONG">Quyết định phân công người tiến hành tố tụng</option>
                      </select>
                    </div>
                  </div>

                  {newDecType === 'DUA_VU_AN_RA_XET_XU' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">
                          Ngày mở phiên tòa
                        </label>
                        <input
                          type="text"
                          value={trialDate}
                          onChange={(e) => setTrialDate(e.target.value)}
                          placeholder="2026-07-06 08:00"
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-red-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-medium mb-1">
                          Địa điểm mở phiên tòa
                        </label>
                        <input
                          type="text"
                          value={trialLocation}
                          onChange={(e) => setTrialLocation(e.target.value)}
                          placeholder="Phòng xử án số 1 - TAND"
                          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Người ký
                      </label>
                      <input
                        type="text"
                        value={decSigner}
                        onChange={(e) => setDecSigner(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Chức vụ
                      </label>
                      <input
                        type="text"
                        value={decSignerRole}
                        onChange={(e) => setDecSignerRole(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:ring-1 focus:ring-red-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Ngày quyết định
                      </label>
                      <input
                        type="date"
                        value={decDate}
                        onChange={(e) => setDecDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Số Quyết định
                      </label>
                      <input
                        type="text"
                        value={decNo}
                        onChange={(e) => setDecNo(e.target.value)}
                        placeholder="VD: 01/2026/QĐXXST-HS"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold focus:ring-1 focus:ring-red-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Nội dung tóm tắt quyết định
                    </label>
                    <textarea
                      rows={2}
                      value={decSummary}
                      onChange={(e) => setDecSummary(e.target.value)}
                      placeholder="Nội dung trích yếu của Quyết định..."
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDecNo('');
                        setDecSummary('');
                      }}
                      className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium transition-colors"
                    >
                      Làm mới
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold shadow-2xs transition-colors"
                    >
                      Lưu
                    </button>
                  </div>
                </form>

                {/* Table of Decisions matching screenshot header */}
                <div className="space-y-2">
                  <div className="text-slate-600 font-semibold text-xs">
                    Có {caseItem.decisions.length} bản ghi trong vụ án
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#991B1B] text-white text-[11px] uppercase tracking-wider font-semibold">
                          <th className="py-2 px-2.5 text-center w-10">TT</th>
                          <th className="py-2 px-2.5">Tên quyết định</th>
                          <th className="py-2 px-2.5">Số QĐ</th>
                          <th className="py-2 px-2.5">Ngày ra QĐ</th>
                          <th className="py-2 px-2.5">Người ký</th>
                          <th className="py-2 px-2.5">Tòa án ra QĐ</th>
                          <th className="py-2 px-2.5 text-center">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {caseItem.decisions.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-6 text-center text-slate-400 italic">
                              Chưa có quyết định nào được ban hành cho vụ án này.
                            </td>
                          </tr>
                        ) : (
                          caseItem.decisions.map((dec, idx) => (
                            <tr key={dec.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-2 px-2.5 text-center font-mono font-medium text-slate-600">
                                {idx + 1}
                              </td>
                              <td className="py-2 px-2.5 font-semibold text-slate-900">
                                {dec.decisionTypeName}
                              </td>
                              <td className="py-2 px-2.5 font-mono text-red-800 font-bold">
                                {dec.decisionNo}
                              </td>
                              <td className="py-2 px-2.5 text-slate-700">
                                {formatDateVN(dec.issuedDate)}
                              </td>
                              <td className="py-2 px-2.5 text-slate-800">
                                <div>{dec.signerName}</div>
                                <div className="text-[10px] text-slate-500">{dec.signerRole}</div>
                              </td>
                              <td className="py-2 px-2.5 text-slate-600">
                                {caseItem.courtName}
                              </td>
                              <td className="py-2 px-2.5 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => onOpenPrintModal(caseItem, dec.decisionType)}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded font-bold text-[11px] transition-colors shadow-2xs"
                                    title="Mở giao diện soạn thảo & chỉnh sửa kiểu Word (không cần code)"
                                  >
                                    <FileText className="w-3 h-3 text-blue-700" />
                                    <span>Soạn / Sửa Word</span>
                                  </button>
                                  <button
                                    onClick={() => onOpenPrintModal(caseItem, dec.decisionType)}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-medium text-[11px] transition-colors"
                                    title="In văn bản A4"
                                  >
                                    <Printer className="w-3 h-3 text-amber-700" />
                                    <span>In A4</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SECTION 1: THỤ LÝ ================= */}
            {activeSection === '1_THU_LY' && (
              <div className="space-y-3 bg-slate-50 border border-slate-200 rounded p-4">
                <div className="font-bold text-slate-800 text-xs uppercase border-b border-slate-200 pb-2 text-red-900">
                  Thông tin Thụ lý vụ án
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-500 font-medium">Mã vụ việc:</label>
                    <div className="font-mono font-bold text-red-800 text-sm">{caseItem.caseCode}</div>
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium">Số thụ lý:</label>
                    <div className="font-bold text-slate-900 text-sm">{caseItem.docketNumber}</div>
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium">Ngày thụ lý:</label>
                    <div className="font-semibold text-slate-800">{formatDateVN(caseItem.intakeDate)}</div>
                  </div>

                  <div>
                    <label className="text-slate-500 font-medium">Cấp xét xử:</label>
                    <div className="font-semibold text-slate-800">
                      {caseItem.level === 'SO_THAM' ? 'Sơ thẩm' : 'Phúc thẩm'}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-slate-500 font-medium">Tên vụ việc:</label>
                    <div className="font-bold text-slate-900 text-sm">{caseItem.title}</div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-slate-500 font-medium">
                      {caseItem.caseType === 'HINH_SU' ? 'Tội danh truy tố:' : 'Quan hệ pháp luật tranh chấp:'}
                    </label>
                    <div className="bg-white border border-slate-200 rounded p-2.5 text-slate-800">
                      {caseItem.disputeOrCrime}
                    </div>
                  </div>

                  {caseItem.prosecutionDocument && (
                    <div className="md:col-span-2">
                      <label className="text-slate-500 font-medium">Văn bản truy tố / Khởi kiện:</label>
                      <div className="font-medium text-slate-800">{caseItem.prosecutionDocument}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= SECTION 2: PHÂN CÔNG THẨM PHÁN ================= */}
            {activeSection === '2_PHAN_CONG' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-red-900 text-xs uppercase">
                      Người tiến hành tố tụng được Chánh án phân công
                    </span>
                    <button
                      onClick={() => onOpenAssignModal(caseItem)}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{caseItem.assignedJudgeName ? 'Thay đổi phân công' : 'Phân công ngay'}</span>
                    </button>
                  </div>

                  {caseItem.assignedJudgeName ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border border-slate-200">
                        <div className="text-slate-500 text-[11px] uppercase font-bold text-red-800">
                          Thẩm phán chủ tọa phiên tòa:
                        </div>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">
                          {caseItem.assignedJudgeName}
                        </div>
                        <div className="text-slate-600 text-xs">
                          {caseItem.assignedJudgeTitle || 'Thẩm phán'}
                        </div>
                        {caseItem.alternateJudgeName && (
                          <div className="text-[11px] text-slate-500 mt-2">
                            Thẩm phán dự khuyết: <strong>{caseItem.alternateJudgeName}</strong>
                          </div>
                        )}
                      </div>

                      <div className="bg-white p-3 rounded border border-slate-200">
                        <div className="text-slate-500 text-[11px] uppercase font-bold text-red-800">
                          Thư ký Tòa án:
                        </div>
                        <div className="font-bold text-slate-900 text-sm mt-0.5">
                          {caseItem.assignedClerkName || 'Chưa chỉ định'}
                        </div>
                        <div className="text-slate-600 text-xs">Thư ký viên TAND</div>
                        {caseItem.alternateClerkName && (
                          <div className="text-[11px] text-slate-500 mt-2">
                            Thư ký dự khuyết: <strong>{caseItem.alternateClerkName}</strong>
                          </div>
                        )}
                      </div>

                      <div className="md:col-span-2 bg-white p-3 rounded border border-slate-200">
                        <div className="text-slate-500 text-[11px] uppercase font-bold text-red-800 mb-2">
                          Hội thẩm nhân dân tham gia Hội đồng xét xử:
                        </div>
                        {caseItem.assignedJurors.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            {caseItem.assignedJurors.map((jur, i) => (
                              <div key={i} className="bg-slate-50 p-2 rounded border border-slate-200">
                                <div className="font-semibold text-slate-900">{jur.name}</div>
                                <div className="text-[11px] text-slate-500">{jur.organization || 'Đoàn Hội thẩm'}</div>
                                <div className="text-[10px] text-amber-800 font-medium">
                                  {jur.isAlternate ? 'Hội thẩm dự khuyết' : 'Hội thẩm chính thức'}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-400 italic">Chưa phân công Hội thẩm nhân dân.</div>
                        )}
                      </div>

                      <div className="md:col-span-2 flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <div>
                          Ngày ký phân công: <strong>{formatDateVN(caseItem.assignmentDate)}</strong>
                        </div>
                        <div>
                          Người ký: <strong>{caseItem.assignmentSigner || 'Chánh án'}</strong>
                        </div>
                        <button
                          onClick={() => onOpenPrintModal(caseItem, 'QUYET_DINH_PHAN_CONG')}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>In QĐ Phân công (Mẫu 01)</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-white rounded border border-dashed border-slate-300">
                      <p className="text-slate-500 mb-2">Vụ án này chưa được Chánh án phân công Thẩm phán giải quyết.</p>
                      <button
                        onClick={() => {
                          if (currentUser && !currentUser.permissions.canAssignJudges) {
                            if (onDenyPermission) {
                              onDenyPermission('Phân công Thẩm phán & Thư ký giải quyết', 'Lãnh đạo Tòa án (Chánh án / Phó Chánh án)');
                            } else {
                              alert('Thao tác Phân công Thẩm phán chỉ dành cho Lãnh đạo Tòa án.');
                            }
                            return;
                          }
                          onOpenAssignModal(caseItem);
                        }}
                        className="px-4 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-xs shadow-2xs transition-colors"
                      >
                        Thực hiện phân công ngay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= SECTION 3.1 & 3.2: ĐƯƠNG SỰ / BỊ CAN ================= */}
            {(activeSection === '3_1_NGUOI_TO_TUNG' || activeSection === '3_2_DUONG_SU') && (
              <div className="space-y-3">
                <div className="font-bold text-slate-800 text-xs uppercase border-b border-slate-200 pb-2 text-red-900">
                  Danh sách người tham gia tố tụng ({caseItem.litigants.length} người)
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="py-2 px-3 text-center w-10">TT</th>
                        <th className="py-2 px-3">Tư cách tố tụng</th>
                        <th className="py-2 px-3">Họ và tên</th>
                        <th className="py-2 px-3">Năm sinh / CCCD</th>
                        <th className="py-2 px-3">Địa chỉ cư trú</th>
                        <th className="py-2 px-3">Tình trạng giam giữ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {caseItem.litigants.map((lit, idx) => (
                        <tr key={lit.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 text-center font-mono">{idx + 1}</td>
                          <td className="py-2 px-3 font-semibold text-red-900">{lit.roleName}</td>
                          <td className="py-2 px-3 font-bold text-slate-900">{lit.name}</td>
                          <td className="py-2 px-3 text-slate-600">
                            {lit.birthYear || '-'} {lit.identityNo ? `(${lit.identityNo})` : ''}
                          </td>
                          <td className="py-2 px-3 text-slate-700">{lit.address}</td>
                          <td className="py-2 px-3 text-slate-800">
                            {lit.detentionStatus ? (
                              <span className="text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                                {lit.detentionStatus}
                              </span>
                            ) : (
                              <span className="text-slate-400">Tại ngoại</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= SECTION 3.4: BẢN ÁN SƠ THẨM ================= */}
            {activeSection === '3_4_BAN_AN' && (
              <div className="space-y-3 bg-slate-50 border border-slate-200 rounded p-4">
                <div className="font-bold text-slate-800 text-xs uppercase border-b border-slate-200 pb-2 text-red-900 flex items-center justify-between">
                  <span>Kết quả xét xử & Bản án sơ thẩm</span>
                  <Gavel className="w-4 h-4 text-amber-700" />
                </div>

                {caseItem.judgmentResult ? (
                  <div className="space-y-3 bg-white p-3.5 rounded border border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 font-medium">Số bản án:</span>
                        <div className="font-mono font-bold text-red-800 text-sm">
                          {caseItem.judgmentResult.judgmentNo}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Ngày tuyên án:</span>
                        <div className="font-semibold text-slate-800">
                          {formatDateVN(caseItem.judgmentResult.judgmentDate)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 font-medium">Tóm tắt quyết định tuyên án:</span>
                      <div className="bg-slate-50 border border-slate-200 p-2.5 rounded font-serif text-slate-900 mt-1 leading-relaxed">
                        {caseItem.judgmentResult.verdictSummary}
                      </div>
                    </div>

                    {caseItem.judgmentResult.courtFees && (
                      <div>
                        <span className="text-slate-500 font-medium">Án phí:</span>
                        <div className="font-medium text-slate-800">{caseItem.judgmentResult.courtFees}</div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div>
                        Tình trạng hiệu lực:{' '}
                        <strong className="text-emerald-700">
                          {caseItem.judgmentResult.appealStatus === 'HIEU_LUC_PHAP_LUAT'
                            ? 'Đã có hiệu lực pháp luật'
                            : caseItem.judgmentResult.appealStatus === 'CO_KHANG_CAO'
                            ? 'Có kháng cáo/kháng nghị'
                            : 'Đang trong thời hạn kháng cáo'}
                        </strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-white rounded border border-dashed border-slate-300">
                    <p className="text-slate-500 mb-3">Vụ việc chưa có Bản án hoặc Quyết định giải quyết cuối cùng.</p>
                    <button
                      onClick={() => setActiveSection('3_3_QUYET_DINH')}
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-xs"
                    >
                      Ban hành Quyết định đưa vụ án ra xét xử trước
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ================= SECTION 3.7: BIỆN PHÁP NGĂN CHẶN ================= */}
            {activeSection === '3_7_BIEN_PHAP_NGAN_CHAN' && (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-red-900 text-xs uppercase flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-700" />
                      Biện pháp ngăn chặn & bảo đảm đã áp dụng
                    </span>
                    {caseItem.caseType === 'HINH_SU' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenDetentionExtension) onOpenDetentionExtension(caseItem);
                            else setIsDetentionExtModalOpen(true);
                          }}
                          className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Gia hạn tạm giam (Điều 278)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenPrintModal(caseItem, 'LENH_TAM_GIAM')}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>In Lệnh tạm giam (Mẫu 03)</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {caseItem.preventiveMeasures.length === 0 ? (
                    <div className="text-center py-6 bg-white rounded border border-dashed border-slate-300 text-slate-500 italic">
                      Chưa áp dụng biện pháp ngăn chặn hoặc biện pháp khẩn cấp tạm thời đối với vụ án này.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {caseItem.preventiveMeasures.map((pm) => {
                        const daysLeft = getDaysRemaining(pm.effectiveTo);
                        const isDetention = pm.type === 'TAM_GIAM' || pm.type === 'BAT_TAM_GIAM' || pm.type === 'GIA_HAN_TAM_GIAM';
                        return (
                          <div
                            key={pm.id}
                            className="bg-white border border-slate-200 rounded p-3 space-y-2 hover:border-amber-400 transition-colors"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-red-800 text-xs">{pm.typeName}</span>
                                <span className="font-mono text-slate-600 text-[11px]">Số: {pm.decisionNo}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  pm.status === 'SAP_HET_HAN'
                                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}>
                                  {pm.status === 'SAP_HET_HAN' ? 'Sắp hết hạn tạm giam!' : 'Đang hiệu lực'}
                                </div>
                                {isDetention && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (onOpenDetentionExtension) {
                                        onOpenDetentionExtension(caseItem, pm);
                                      } else {
                                        setSelectedPmForExtension(pm);
                                        setIsDetentionExtModalOpen(true);
                                      }
                                    }}
                                    className="px-2 py-0.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors"
                                  >
                                    <Clock className="w-3 h-3 text-red-600" />
                                    <span>Gia hạn lệnh này</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                              <div>
                                <span className="text-slate-500 font-medium">Người bị áp dụng:</span>{' '}
                                <strong className="text-slate-900">{pm.targetPerson}</strong>
                              </div>
                              <div>
                                <span className="text-slate-500 font-medium">Hiệu lực từ:</span>{' '}
                                <span className="text-slate-800">{formatDateVN(pm.effectiveFrom)}</span>
                              </div>
                              <div>
                                <span className="text-slate-500 font-medium">Hiệu lực đến:</span>{' '}
                                <strong className="text-red-700">{formatDateVN(pm.effectiveTo)}</strong>
                                <span className="text-[11px] text-slate-500 ml-1">({daysLeft.displayText})</span>
                              </div>
                            </div>

                            {pm.notes && (
                              <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 italic">
                                Ghi chú: {pm.notes}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Detention Extension History Box if exists */}
                  {caseItem.detentionExtensions && caseItem.detentionExtensions.length > 0 && (
                    <div className="mt-3 bg-white border border-slate-200 rounded p-3 space-y-2">
                      <div className="font-bold text-red-900 text-xs uppercase flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-amber-700" />
                        Lịch sử các lần gia hạn thời hạn tạm giam ({caseItem.detentionExtensions.length} lần)
                      </div>
                      <div className="space-y-1.5">
                        {caseItem.detentionExtensions.map((dext, idx) => (
                          <div key={dext.id || idx} className="bg-slate-50 p-2 rounded border border-slate-200 flex flex-wrap items-center justify-between text-[11px] gap-2">
                            <div>
                              <span className="font-bold text-slate-900">{dext.targetPerson}:</span> Lệnh gia hạn số <strong>{dext.decisionNo}</strong> (ngày {formatDateVN(dext.decisionDate)})
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
              </div>
            )}

            {/* ================= SECTION TIMELINE: CASE HISTORY TIMELINE ================= */}
            {activeSection === 'TIMELINE' && (
              <CaseHistoryTimeline
                caseItem={caseItem}
                onOpenPrintModal={onOpenPrintModal}
                onOpenAssignModal={onOpenAssignModal}
                onOpenTrialExtension={onOpenTrialExtension || (() => setIsTrialExtModalOpen(true))}
                onOpenDetentionExtension={onOpenDetentionExtension || ((c, pm) => {
                  setSelectedPmForExtension(pm);
                  setIsDetentionExtModalOpen(true);
                })}
              />
            )}
          </div>
        </div>
      </div>

      {/* Extension Modals */}
      {isTrialExtModalOpen && (
        <TrialExtensionModal
          isOpen={isTrialExtModalOpen}
          onClose={() => setIsTrialExtModalOpen(false)}
          caseItem={caseItem}
          officials={officials}
          onSaveExtension={(updated) => onUpdateCase(updated)}
          onOpenPrintModal={onOpenPrintModal}
        />
      )}

      {isDetentionExtModalOpen && (
        <DetentionExtensionModal
          isOpen={isDetentionExtModalOpen}
          onClose={() => {
            setIsDetentionExtModalOpen(false);
            setSelectedPmForExtension(undefined);
          }}
          caseItem={caseItem}
          officials={officials}
          preselectedMeasure={selectedPmForExtension}
          onSaveDetentionExtension={(updated) => onUpdateCase(updated)}
          onOpenPrintModal={onOpenPrintModal}
        />
      )}
    </div>
  );
};
