import React, { useState } from 'react';
import { CaseStatus, CaseType, CourtCase, UserAccount } from '../types/court';
import { formatDateVN, getDaysRemaining, getStatusBadge, getCaseTypeName } from '../utils/courtUtils';
import { 
  Search, 
  Filter, 
  Pin, 
  UserCheck, 
  Printer, 
  Eye, 
  Clock, 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  PlusCircle,
  User
} from 'lucide-react';

interface CaseListViewProps {
  cases: CourtCase[];
  categoryTitle: string;
  categoryType?: CaseType;
  onOpenNewCaseModal: () => void;
  onOpenCaseDetail: (c: CourtCase) => void;
  onOpenAssignModal: (c: CourtCase) => void;
  onOpenPrintModal: (c: CourtCase, docType?: string) => void;
  onPinCase: (c: CourtCase) => void;
  pinnedCaseId?: string;
  searchFilterQuery: string;
  onClearSearch?: () => void;
  onOpenTrialExtension?: (c: CourtCase) => void;
  onOpenDetentionExtension?: (c: CourtCase) => void;
  currentUser?: UserAccount;
  onDenyPermission?: (actionName: string, requiredRole: string) => void;
}

export const CaseListView: React.FC<CaseListViewProps> = ({
  cases,
  categoryTitle,
  categoryType,
  onOpenNewCaseModal,
  onOpenCaseDetail,
  onOpenAssignModal,
  onOpenPrintModal,
  onPinCase,
  pinnedCaseId,
  searchFilterQuery,
  onClearSearch,
  onOpenTrialExtension,
  onOpenDetentionExtension,
  currentUser,
  onDenyPermission,
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'MOI_THU_LY' | 'DANG_XU_LY' | 'SAP_HET_HAN' | 'DA_XONG'>('ALL');
  const [judgeFilter, setJudgeFilter] = useState('ALL');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('ALL');
  const [filterOnlyMyCases, setFilterOnlyMyCases] = useState(false);

  // Filter cases by category first
  let displayCases = categoryType
    ? cases.filter((c) => c.caseType === categoryType)
    : (selectedSubCategory !== 'ALL' 
        ? cases.filter((c) => c.caseType === selectedSubCategory)
        : cases);

  // Filter only my cases if user is judge or clerk
  if (filterOnlyMyCases && currentUser) {
    displayCases = displayCases.filter((c) => {
      if (currentUser.role === 'THAM_PHAN') {
        return c.assignedJudgeName === currentUser.fullName || c.assignedJudgeId === currentUser.linkedOfficialId;
      }
      if (currentUser.role === 'THU_KY') {
        return c.assignedClerkName === currentUser.fullName || c.assignedClerkId === currentUser.linkedOfficialId;
      }
      return true;
    });
  }

  // Search query filter: Comprehensive search across all relevant court dossier fields
  if (searchFilterQuery.trim()) {
    const q = searchFilterQuery.toLowerCase().trim();
    displayCases = displayCases.filter((c) => {
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchCode = c.caseCode.toLowerCase().includes(q);
      const matchDocket = c.docketNumber.toLowerCase().includes(q);
      const matchDispute = c.disputeOrCrime?.toLowerCase().includes(q) || false;
      const matchJudge = c.assignedJudgeName?.toLowerCase().includes(q) || false;
      const matchClerk = c.assignedClerkName?.toLowerCase().includes(q) || false;
      const matchJuror = c.assignedJurors?.some((j) => j.name.toLowerCase().includes(q)) || false;
      const matchLitigant = c.litigants.some((l) => 
        l.name.toLowerCase().includes(q) || 
        (l.address && l.address.toLowerCase().includes(q)) ||
        (l.identityNo && l.identityNo.includes(q))
      );
      const matchPreventive = c.preventiveMeasures.some((pm) =>
        pm.decisionNo.toLowerCase().includes(q) ||
        pm.targetPerson.toLowerCase().includes(q) ||
        pm.typeName.toLowerCase().includes(q)
      );
      return matchTitle || matchCode || matchDocket || matchDispute || matchJudge || matchClerk || matchJuror || matchLitigant || matchPreventive;
    });
  }

  // Filter by status tab
  if (statusFilter === 'MOI_THU_LY') {
    displayCases = displayCases.filter((c) => c.status === 'MOI_THU_LY');
  } else if (statusFilter === 'DANG_XU_LY') {
    displayCases = displayCases.filter(
      (c) =>
        c.status === 'DA_PHAN_CONG' ||
        c.status === 'DANG_CHUAN_BI_XET_XU' ||
        c.status === 'GIA_HAN' ||
        c.status === 'DA_CO_QUYET_DINH'
    );
  } else if (statusFilter === 'SAP_HET_HAN') {
    displayCases = displayCases.filter((c) => {
      const remaining = getDaysRemaining(c.deadlineDate);
      return (remaining.isWarning || remaining.isOverdue) && c.status !== 'DA_GIAI_QUYET' && c.status !== 'DA_TUYEN_AN';
    });
  } else if (statusFilter === 'DA_XONG') {
    displayCases = displayCases.filter(
      (c) => c.status === 'DA_GIAI_QUYET' || c.status === 'DA_TUYEN_AN' || c.status === 'DINH_CHI'
    );
  }

  // Filter by Judge
  if (judgeFilter !== 'ALL') {
    displayCases = displayCases.filter((c) => c.assignedJudgeName === judgeFilter);
  }

  // Distinct judges
  const distinctJudges = Array.from(
    new Set(cases.map((c) => c.assignedJudgeName).filter(Boolean))
  ) as string[];

  return (
    <div className="space-y-3 text-xs">
      {/* Active Search Filter Banner */}
      {searchFilterQuery.trim() && (
        <div className="bg-amber-50 border border-amber-300 rounded p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-900 font-medium">
            <Search className="w-4 h-4 text-amber-700" />
            <span>
              Kết quả tra cứu cho từ khóa: <strong className="text-red-900">"{searchFilterQuery}"</strong> — Tìm thấy{' '}
              <strong className="font-mono text-red-900">{displayCases.length}</strong> vụ việc phù hợp.
            </span>
          </div>

          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-400 rounded font-semibold text-xs transition-colors flex items-center gap-1 shadow-2xs"
            >
              <span>✕ Bỏ tìm kiếm / Xem tất cả</span>
            </button>
          )}
        </div>
      )}

      {/* Subcategory Pills (when viewing all cases on dashboard) */}
      {!categoryType && (
        <div className="bg-white border border-slate-300 rounded p-2 flex flex-wrap items-center gap-1.5 shadow-2xs">
          <span className="text-slate-500 font-bold uppercase text-[11px] px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Lọc theo phân hệ:
          </span>
          {[
            { key: 'ALL', label: 'Tất cả loại án', count: cases.length },
            { key: 'HINH_SU', label: 'Hình sự', count: cases.filter((c) => c.caseType === 'HINH_SU').length },
            { key: 'DAN_SU', label: 'Dân sự', count: cases.filter((c) => c.caseType === 'DAN_SU').length },
            { key: 'HON_NHAN', label: 'Hôn nhân & GĐ', count: cases.filter((c) => c.caseType === 'HON_NHAN').length },
            { key: 'KDTM', label: 'Kinh doanh, TM', count: cases.filter((c) => c.caseType === 'KDTM').length },
            { key: 'HANH_CHINH', label: 'Hành chính', count: cases.filter((c) => c.caseType === 'HANH_CHINH').length },
            { key: 'LAO_DONG', label: 'Lao động', count: cases.filter((c) => c.caseType === 'LAO_DONG').length },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedSubCategory(cat.key)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                selectedSubCategory === cat.key
                  ? 'bg-red-800 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                selectedSubCategory === cat.key ? 'bg-red-950 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Table Card */}
      <div className="bg-white border border-slate-300 rounded shadow-2xs overflow-hidden">
        {/* Top Header & Filters */}
        <div className="bg-slate-100 p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-red-900 text-sm uppercase tracking-wide">
              {categoryTitle}
            </h2>
            <span className="bg-red-700 text-white font-mono px-2 py-0.5 rounded text-[11px] font-bold">
              {displayCases.length} vụ việc
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Segmented Control */}
            <div className="flex items-center bg-white border border-slate-300 rounded p-0.5">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === 'ALL'
                    ? 'bg-red-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setStatusFilter('MOI_THU_LY')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === 'MOI_THU_LY'
                    ? 'bg-red-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mới thụ lý
              </button>
              <button
                onClick={() => setStatusFilter('DANG_XU_LY')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === 'DANG_XU_LY'
                    ? 'bg-red-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đang giải quyết
              </button>
              <button
                onClick={() => setStatusFilter('SAP_HET_HAN')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === 'SAP_HET_HAN'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-amber-800 hover:text-amber-950 font-bold'
                }`}
              >
                Cảnh báo hạn
              </button>
              <button
                onClick={() => setStatusFilter('DA_XONG')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  statusFilter === 'DA_XONG'
                    ? 'bg-red-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đã giải quyết
              </button>
            </div>

            {/* Filter by Judge (Only shown for Leadership / Intake officers viewing multiple judges) */}
            {currentUser?.role !== 'THAM_PHAN' ? (
              <select
                value={judgeFilter}
                onChange={(e) => setJudgeFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700 focus:ring-1 focus:ring-red-600 focus:outline-none"
              >
                <option value="ALL">-- Tất cả Thẩm phán ({distinctJudges.length}) --</option>
                {distinctJudges.map((j) => (
                  <option key={j} value={j}>
                    TP: {j}
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-2.5 py-1 bg-amber-50 border border-amber-300 rounded text-amber-900 font-bold text-xs flex items-center gap-1 shadow-2xs">
                <span>⚖ Thẩm phán: {currentUser.fullName} ({displayCases.length} vụ án)</span>
              </div>
            )}

            <button
              onClick={() => {
                if (currentUser && !currentUser.permissions.canCreateCase) {
                  if (onDenyPermission) {
                    onDenyPermission('Nhập thụ lý vụ án mới', 'Cán bộ Tổng hợp & Thụ lý / Lãnh đạo Tòa án');
                  } else {
                    alert('Quyền nhập thụ lý ban đầu dành cho Cán bộ Tổng hợp & Thụ lý hoặc Lãnh đạo Tòa án.');
                  }
                  return;
                }
                onOpenNewCaseModal();
              }}
              className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded font-bold text-xs shadow-2xs transition-colors flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Thêm mới</span>
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#991B1B] text-white text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3 text-center w-10">TT</th>
                <th className="py-2.5 px-3">Mã vụ việc & Thụ lý</th>
                <th className="py-2.5 px-3">Tên vụ việc & Đương sự</th>
                <th className="py-2.5 px-3">Quan hệ PL / Tội danh</th>
                <th className="py-2.5 px-3">Thẩm phán & Thư ký</th>
                <th className="py-2.5 px-3 text-center">Tiến độ thời gian thực</th>
                <th className="py-2.5 px-3 text-center">Trạng thái</th>
                <th className="py-2.5 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {displayCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-400">
                    <p className="mb-2 italic">Không tìm thấy vụ việc nào phù hợp với bộ lọc.</p>
                    <button
                      onClick={onOpenNewCaseModal}
                      className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-bold text-xs"
                    >
                      Nhập thụ lý vụ án mới
                    </button>
                  </td>
                </tr>
              ) : (
                displayCases.map((c, idx) => {
                  const deadlineInfo = getDaysRemaining(c.deadlineDate);
                  const statusBadge = getStatusBadge(c.status);
                  const isPinned = pinnedCaseId === c.id;
                  const hasDetention = c.preventiveMeasures.some(
                    (pm) => pm.type === 'TAM_GIAM' || pm.type === 'BAT_TAM_GIAM'
                  );

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-amber-50/50 transition-colors ${
                        isPinned ? 'bg-amber-50/70 border-l-4 border-l-red-700' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500 font-medium">
                        {idx + 1}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-red-800 text-xs">
                          {c.caseCode}
                        </div>
                        <div className="text-[11px] text-slate-600 font-semibold mt-0.5">
                          Số: {c.docketNumber}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Thụ lý: {formatDateVN(c.intakeDate)}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 max-w-xs">
                        <div
                          onClick={() => onOpenCaseDetail(c)}
                          className="font-bold text-slate-900 hover:text-red-700 cursor-pointer line-clamp-2"
                          title="Nhấp để xem chi tiết vụ án"
                        >
                          {c.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <span>{getCaseTypeName(c.caseType)}</span>
                          {hasDetention && (
                            <span className="inline-flex items-center gap-0.5 bg-red-100 text-red-800 px-1.5 py-0.2 rounded font-bold text-[10px]">
                              <ShieldAlert className="w-2.5 h-2.5" />
                              Tạm giam
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="text-slate-700 line-clamp-2 text-[11px]">
                          {c.disputeOrCrime}
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        {c.assignedJudgeName ? (
                          <div>
                            <div className="font-bold text-slate-800">
                              TP: {c.assignedJudgeName}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              TK: {c.assignedClerkName || 'Chưa phân công'}
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => onOpenAssignModal(c)}
                            className="text-amber-800 hover:text-amber-950 font-bold underline text-[11px] flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Chưa phân công</span>
                          </button>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <div className="text-[11px] text-slate-500">
                          Hạn: {formatDateVN(c.deadlineDate)}
                        </div>
                        <div
                          className={`mt-0.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10.5px] font-bold ${
                            deadlineInfo.isOverdue
                              ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                              : deadlineInfo.isWarning
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {deadlineInfo.isOverdue ? (
                            <AlertCircle className="w-2.5 h-2.5 text-red-700" />
                          ) : deadlineInfo.isWarning ? (
                            <AlertTriangle className="w-2.5 h-2.5 text-amber-700" />
                          ) : (
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
                          )}
                          <span>{deadlineInfo.displayText}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10.5px] font-semibold border ${statusBadge.bgClass} ${statusBadge.textClass} ${statusBadge.borderClass}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onPinCase(c)}
                            className={`p-1.5 rounded transition-colors ${
                              isPinned
                                ? 'bg-amber-200 text-amber-900 font-bold'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                            title={isPinned ? 'Đang ghim làm việc' : 'Ghim lên đầu trang'}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>

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
                              onOpenAssignModal(c);
                            }}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded transition-colors"
                            title="Chánh án phân công Thẩm phán"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>

                          {onOpenTrialExtension && (
                            <button
                              onClick={() => {
                                if (currentUser && !currentUser.permissions.canExtendPreparation) {
                                  if (onDenyPermission) {
                                    onDenyPermission('Ký Quyết định gia hạn chuẩn bị xét xử', 'Lãnh đạo Tòa án (Chánh án / Phó Chánh án)');
                                  } else {
                                    alert('Quyền ký quyết định gia hạn thời hạn chuẩn bị xét xử thuộc Lãnh đạo Tòa án.');
                                  }
                                  return;
                                }
                                onOpenTrialExtension(c);
                              }}
                              className="p-1.5 bg-orange-50 hover:bg-orange-100 text-orange-800 rounded transition-colors"
                              title="Gia hạn thời hạn chuẩn bị xét xử vụ án"
                            >
                              <Clock className="w-3.5 h-3.5 text-orange-700" />
                            </button>
                          )}

                          <button
                            onClick={() => onOpenPrintModal(c)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded transition-colors"
                            title="In biểu mẫu quyết định"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenCaseDetail(c)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-800 rounded transition-colors font-semibold"
                            title="Chi tiết hồ sơ vụ án"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
