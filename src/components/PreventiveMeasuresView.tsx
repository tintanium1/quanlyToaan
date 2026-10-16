import React, { useState } from 'react';
import { CourtCase, PreventiveMeasure, UserAccount } from '../types/court';
import { formatDateVN, getDaysRemaining } from '../utils/courtUtils';
import { getRoleBadge } from '../utils/rbacUtils';
import { 
  ShieldAlert, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Printer, 
  Plus, 
  Search, 
  Filter, 
  Scale, 
  UserCheck,
  FileText
} from 'lucide-react';

interface PreventiveMeasuresViewProps {
  cases: CourtCase[];
  onOpenCaseDetail: (c: CourtCase) => void;
  onOpenPrintModal: (c: CourtCase, docType: string) => void;
  onPinCase: (c: CourtCase) => void;
  onOpenDetentionExtension?: (c: CourtCase, pm?: PreventiveMeasure) => void;
  currentUser?: UserAccount;
  onDenyPermission?: (actionName: string, requiredRole: string) => void;
}

export const PreventiveMeasuresView: React.FC<PreventiveMeasuresViewProps> = ({
  cases,
  onOpenCaseDetail,
  onOpenPrintModal,
  onPinCase,
  onOpenDetentionExtension,
  currentUser,
  onDenyPermission,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'TAM_GIAM' | 'SAP_HET_HAN' | 'KHAC'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Extract all preventive measures across all cases
  const allMeasures: { measure: PreventiveMeasure; caseItem: CourtCase }[] = [];
  cases.forEach((c) => {
    c.preventiveMeasures.forEach((pm) => {
      allMeasures.push({ measure: pm, caseItem: c });
    });
  });

  // Calculate statistics
  const totalDetained = allMeasures.filter(
    (m) => (m.measure.type === 'TAM_GIAM' || m.measure.type === 'BAT_TAM_GIAM') && m.measure.status !== 'HUY_BO'
  ).length;

  const totalExpiringSoon = allMeasures.filter((m) => {
    const days = getDaysRemaining(m.measure.effectiveTo);
    return days.days <= 10 && !days.isOverdue && m.measure.status !== 'HUY_BO';
  }).length;

  const totalOverdue = allMeasures.filter((m) => {
    const days = getDaysRemaining(m.measure.effectiveTo);
    return days.isOverdue && m.measure.status !== 'HUY_BO';
  }).length;

  const totalProvisionalCivil = allMeasures.filter(
    (m) => m.measure.type === 'KE_BIEN_TAI_SAN' || m.measure.type === 'PHONG_TOA_TAI_KHOAN'
  ).length;

  const filtered = allMeasures.filter(({ measure, caseItem }) => {
    // Filter type
    if (filterType === 'TAM_GIAM') {
      if (measure.type !== 'TAM_GIAM' && measure.type !== 'BAT_TAM_GIAM' && measure.type !== 'GIA_HAN_TAM_GIAM') return false;
    } else if (filterType === 'SAP_HET_HAN') {
      const days = getDaysRemaining(measure.effectiveTo);
      if (days.days > 10 || days.isOverdue) return false;
    } else if (filterType === 'KHAC') {
      if (measure.type === 'TAM_GIAM' || measure.type === 'BAT_TAM_GIAM') return false;
    }

    // Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchPerson = measure.targetPerson.toLowerCase().includes(q);
      const matchCase = caseItem.title.toLowerCase().includes(q) || caseItem.caseCode.toLowerCase().includes(q);
      const matchDoc = measure.decisionNo.toLowerCase().includes(q);
      if (!matchPerson && !matchCase && !matchDoc) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4 text-xs">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-300 rounded p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-slate-500 font-semibold text-[11px] uppercase tracking-wide">
              Đang áp dụng Tạm giam
            </div>
            <div className="text-2xl font-bold font-mono text-red-800 mt-1 tabular-nums">
              {totalDetained} <span className="text-xs font-normal text-slate-500">bị can/bị cáo</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-slate-500 font-semibold text-[11px] uppercase tracking-wide">
              Sắp hết hạn tạm giam (≤ 10 ngày)
            </div>
            <div className="text-2xl font-bold font-mono text-amber-700 mt-1 tabular-nums">
              {totalExpiringSoon} <span className="text-xs font-normal text-amber-600">cần ra lệnh mới</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-slate-500 font-semibold text-[11px] uppercase tracking-wide">
              Quá hạn tạm giam
            </div>
            <div className="text-2xl font-bold font-mono text-rose-700 mt-1 tabular-nums">
              {totalOverdue} <span className="text-xs font-normal text-slate-500">vụ việc</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-slate-500 font-semibold text-[11px] uppercase tracking-wide">
              BP Khẩn cấp tạm thời (Dân sự/KDTM)
            </div>
            <div className="text-2xl font-bold font-mono text-blue-800 mt-1 tabular-nums">
              {totalProvisionalCivil} <span className="text-xs font-normal text-slate-500">kê biên/phong tỏa</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
            <Scale className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-300 rounded shadow-2xs overflow-hidden">
        {/* Table Filter Header */}
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded p-0.5">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                filterType === 'ALL'
                  ? 'bg-red-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả ({allMeasures.length})
            </button>

            <button
              onClick={() => setFilterType('TAM_GIAM')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                filterType === 'TAM_GIAM'
                  ? 'bg-red-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tạm giam ({totalDetained})
            </button>

            <button
              onClick={() => setFilterType('SAP_HET_HAN')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                filterType === 'SAP_HET_HAN'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sắp hết hạn ({totalExpiringSoon})
            </button>

            <button
              onClick={() => setFilterType('KHAC')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                filterType === 'KHAC'
                  ? 'bg-red-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Khác / Dân sự ({totalProvisionalCivil})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên bị can, số lệnh..."
                className="w-full pl-8 pr-3 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            </div>

            {onOpenDetentionExtension && (
              <button
                type="button"
                onClick={() => {
                  if (currentUser && !currentUser.permissions.canExtendDetention) {
                    if (onDenyPermission) {
                      onDenyPermission('Ban hành Lệnh gia hạn thời hạn tạm giam (Đ.278)', 'Thẩm phán chủ tọa phiên tòa / Lãnh đạo Tòa án');
                    } else {
                      alert('Quyền ký Lệnh tạm giam / Gia hạn tạm giam thuộc Thẩm phán chủ tọa hoặc Lãnh đạo Tòa án.');
                    }
                    return;
                  }
                  const firstDetained = cases.find(
                    (c) => c.caseType === 'HINH_SU' && c.preventiveMeasures.some((pm) => pm.type === 'TAM_GIAM' || pm.type === 'BAT_TAM_GIAM' || pm.type === 'GIA_HAN_TAM_GIAM')
                  );
                  if (firstDetained) {
                    onOpenDetentionExtension(firstDetained);
                  }
                }}
                className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                title="Gia hạn thời hạn tạm giam theo Điều 278 Bộ luật Tố tụng Hình sự"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>+ Gia hạn tạm giam (Đ.278)</span>
              </button>
            )}
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#991B1B] text-white text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3 text-center w-10">TT</th>
                <th className="py-2.5 px-3">Đối tượng bị áp dụng</th>
                <th className="py-2.5 px-3">Biện pháp ngăn chặn</th>
                <th className="py-2.5 px-3">Số QĐ / Lệnh</th>
                <th className="py-2.5 px-3">Vụ án thụ lý</th>
                <th className="py-2.5 px-3">Thẩm phán phụ trách</th>
                <th className="py-2.5 px-3">Thời hạn hiệu lực</th>
                <th className="py-2.5 px-3 text-center">Tình trạng hạn</th>
                <th className="py-2.5 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 italic">
                    Không tìm thấy biện pháp ngăn chặn nào phù hợp điều kiện lọc.
                  </td>
                </tr>
              ) : (
                filtered.map(({ measure, caseItem }, idx) => {
                  const daysRemaining = getDaysRemaining(measure.effectiveTo);
                  return (
                    <tr key={measure.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                        {idx + 1}
                      </td>

                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {measure.targetPerson}
                      </td>

                      <td className="py-2.5 px-3 font-semibold text-red-900">
                        {measure.typeName}
                      </td>

                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                        {measure.decisionNo}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-medium text-slate-800 hover:text-red-700 cursor-pointer"
                          onClick={() => onOpenCaseDetail(caseItem)}
                        >
                          {caseItem.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500">
                          {caseItem.docketNumber}
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-slate-800">
                        {caseItem.assignedJudgeName || (
                          <span className="text-amber-700 italic">Chưa phân công</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-slate-700">
                        <div>Từ: {formatDateVN(measure.effectiveFrom)}</div>
                        <div>Đến: <strong className="text-red-800">{formatDateVN(measure.effectiveTo)}</strong></div>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                          daysRemaining.isOverdue
                            ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                            : daysRemaining.isWarning
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          {daysRemaining.displayText}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          <button
                            onClick={() => onPinCase(caseItem)}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-[11px] font-medium transition-colors"
                            title="Ghim vụ án này lên đầu trang"
                          >
                            Ghim
                          </button>

                          {(measure.type === 'TAM_GIAM' || measure.type === 'BAT_TAM_GIAM' || measure.type === 'GIA_HAN_TAM_GIAM') && onOpenDetentionExtension && (
                            <button
                              onClick={() => {
                                if (currentUser && !currentUser.permissions.canExtendDetention) {
                                  if (onDenyPermission) {
                                    onDenyPermission('Ban hành Lệnh gia hạn thời hạn tạm giam (Đ.278)', 'Thẩm phán chủ tọa phiên tòa / Lãnh đạo Tòa án');
                                  } else {
                                    alert('Quyền ký Lệnh tạm giam / Gia hạn tạm giam thuộc Thẩm phán chủ tọa hoặc Lãnh đạo Tòa án.');
                                  }
                                  return;
                                }
                                onOpenDetentionExtension(caseItem, measure);
                              }}
                              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 rounded text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                              title="Ban hành Lệnh gia hạn thời hạn tạm giam theo Điều 278 BLTTHS"
                            >
                              <Clock className="w-3 h-3 text-red-700" />
                              <span>Gia hạn</span>
                            </button>
                          )}

                          {caseItem.caseType === 'HINH_SU' && (
                            <button
                              onClick={() => onOpenPrintModal(caseItem, measure.type === 'GIA_HAN_TAM_GIAM' ? 'MAU_07_GHTG' : 'LENH_TAM_GIAM')}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px] font-semibold transition-colors flex items-center gap-1"
                              title="In Lệnh tạm giam / Lệnh gia hạn tạm giam"
                            >
                              <Printer className="w-3 h-3 text-amber-700" />
                              <span>In lệnh</span>
                            </button>
                          )}
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
