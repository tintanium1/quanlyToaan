import React, { useState } from 'react';
import { CourtCase, Official, CourtUnitSettings, UserAccount, ResolutionTargets } from '../types/court';
import { formatDateVN, getDaysRemaining } from '../utils/courtUtils';
import { getRoleBadge } from '../utils/rbacUtils';
import { 
  BarChart3, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  Users,
  ChevronDown,
  Filter,
  Eye,
  X,
  FileText,
  ExternalLink,
  Shield,
  Briefcase,
  Target,
  Sliders
} from 'lucide-react';

interface StatisticalReportsViewProps {
  cases: CourtCase[];
  officials: Official[];
  settings: CourtUnitSettings;
  targets?: ResolutionTargets;
  onOpenCaseDetail?: (c: CourtCase) => void;
  onSelectCategoryTab?: (catKey: string) => void;
  onOpenTargetCustomization?: () => void;
  currentUser?: UserAccount;
}

export const StatisticalReportsView: React.FC<StatisticalReportsViewProps> = ({
  cases,
  officials,
  settings,
  targets,
  onOpenCaseDetail,
  onSelectCategoryTab,
  onOpenTargetCustomization,
  currentUser,
}) => {
  const [period, setPeriod] = useState<'ALL' | 'MONTH' | 'QUARTER_2' | 'SIX_MONTHS' | 'FULL_YEAR'>('ALL');
  const [inspectCategory, setInspectCategory] = useState<any | null>(null);
  const [inspectJudge, setInspectJudge] = useState<any | null>(null);

  const judges = officials.filter((o) => o.role === 'THAM_PHAN');

  // Filter cases strictly by selected period
  const filterCasesByPeriod = (rawCases: CourtCase[]): CourtCase[] => {
    if (period === 'ALL') return rawCases;

    return rawCases.filter((c) => {
      const d = new Date(c.intakeDate);
      if (isNaN(d.getTime())) return true;
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-12

      if (period === 'MONTH') {
        return year === 2026 && month === 6;
      } else if (period === 'QUARTER_2') {
        return year === 2026 && month >= 4 && month <= 6;
      } else if (period === 'SIX_MONTHS') {
        // Năm công tác ngành Tòa án tính từ 01/10 năm trước đến 31/03 năm sau
        return (year === 2025 && month >= 10) || (year === 2026 && month <= 6);
      } else if (period === 'FULL_YEAR') {
        return (year === 2025 && month >= 10) || (year === 2026 && month <= 9);
      }
      return true;
    });
  };

  const periodCases = filterCasesByPeriod(cases);

  // All distinct court case categories strictly matched to App navigation tabs with dynamic targets
  const categories = [
    { key: 'HINH_SU', label: 'Án Hình sự', targetRate: targets?.hinhSuRate ?? 88, navTab: 'HINH_SU' },
    { key: 'DAN_SU', label: 'Án Dân sự', targetRate: targets?.danSuRate ?? 78, navTab: 'DAN_SU' },
    { key: 'HON_NHAN', label: 'Hôn nhân & Gia đình', targetRate: targets?.honNhanRate ?? 85, navTab: 'HON_NHAN' },
    { key: 'KDTM', label: 'Kinh doanh, Thương mại', targetRate: targets?.kdtmRate ?? 75, navTab: 'KDTM' },
    { key: 'HANH_CHINH', label: 'Án Hành chính', targetRate: targets?.hanhChinhRate ?? 60, navTab: 'HANH_CHINH' },
    { key: 'LAO_DONG', label: 'Án Lao động', targetRate: targets?.laoDongRate ?? 80, navTab: 'LAO_DONG' },
    { key: 'PHA_SAN', label: 'Phá sản doanh nghiệp', targetRate: targets?.phaSanRate ?? 70, navTab: 'PHA_SAN' },
  ];

  const categoryStats = categories.map((cat) => {
    const catCases = periodCases.filter((c) => c.caseType === cat.key);
    const resolved = catCases.filter(
      (c) => c.status === 'DA_GIAI_QUYET' || c.status === 'DA_TUYEN_AN' || c.status === 'DINH_CHI'
    ).length;
    const pending = catCases.length - resolved;
    const suspended = catCases.filter((c) => c.status === 'TAM_DINH_CHI').length;
    
    // Check overdue uniformly with rest of app
    const overdue = catCases.filter((c) => {
      const remaining = getDaysRemaining(c.deadlineDate);
      return remaining.isOverdue && c.status !== 'DA_GIAI_QUYET' && c.status !== 'DA_TUYEN_AN';
    }).length;

    const rate = catCases.length > 0 ? Math.round((resolved / catCases.length) * 100) : 100;
    const isTargetMet = catCases.length === 0 || rate >= cat.targetRate;

    return {
      ...cat,
      total: catCases.length,
      resolved,
      pending,
      suspended,
      overdue,
      rate,
      isTargetMet,
      casesList: catCases,
    };
  });

  // Totals - 100% synchronized with periodCases count
  const totalCases = categoryStats.reduce((sum, c) => sum + c.total, 0);
  const totalResolved = categoryStats.reduce((sum, c) => sum + c.resolved, 0);
  const totalPending = totalCases - totalResolved;
  const totalSuspended = categoryStats.reduce((sum, c) => sum + c.suspended, 0);
  const totalOverdue = categoryStats.reduce((sum, c) => sum + c.overdue, 0);
  const overallRate = totalCases > 0 ? Math.round((totalResolved / totalCases) * 100) : 0;

  // Judge breakdown (Judges only see their own assigned statistics; Leaders see all)
  const relevantJudges = currentUser?.role === 'THAM_PHAN'
    ? judges.filter((j) => 
        (currentUser.linkedOfficialId && j.id === currentUser.linkedOfficialId) || 
        j.name.trim().toLowerCase() === currentUser.fullName.trim().toLowerCase()
      )
    : judges;

  const judgeStats = relevantJudges.map((judge) => {
    const judgeCases = periodCases.filter((c) => c.assignedJudgeId === judge.id);
    const resolved = judgeCases.filter(
      (c) => c.status === 'DA_GIAI_QUYET' || c.status === 'DA_TUYEN_AN' || c.status === 'DINH_CHI'
    ).length;
    const pending = judgeCases.length - resolved;
    const overdue = judgeCases.filter((c) => {
      const remaining = getDaysRemaining(c.deadlineDate);
      return remaining.isOverdue && c.status !== 'DA_GIAI_QUYET' && c.status !== 'DA_TUYEN_AN';
    }).length;
    const rate = judgeCases.length > 0 ? Math.round((resolved / judgeCases.length) * 100) : 100;

    return {
      ...judge,
      total: judgeCases.length,
      resolved,
      pending,
      overdue,
      rate,
      casesList: judgeCases,
    };
  });

  const getPeriodLabel = () => {
    switch (period) {
      case 'ALL':
        return 'Toàn bộ thời gian (Tất cả án đã thụ lý)';
      case 'MONTH':
        return 'Tháng 06/2026';
      case 'QUARTER_2':
        return 'Quý II/2026 (01/04/2026 - 30/06/2026)';
      case 'SIX_MONTHS':
        return '6 tháng đầu năm công tác 2026 (01/10/2025 - 31/03/2026)';
      case 'FULL_YEAR':
        return 'Năm công tác Tòa án 2026 (01/10/2025 - 30/09/2026)';
    }
  };

  const handlePrintReport = () => {
    const reportHtml = `
      <div style="font-family: 'Times New Roman', serif; padding: 25px; line-height: 1.4;">
        <table style="width: 100%; margin-bottom: 20px;">
          <tr>
            <td style="width: 45%; text-align: center; vertical-align: top;">
              <div style="font-size: 11pt; font-weight: bold;">${settings.courtName.toUpperCase()}</div>
              <div style="font-size: 11pt;">Số: 18/BC-TA</div>
            </td>
            <td style="width: 55%; text-align: center; vertical-align: top;">
              <div style="font-weight: bold; font-size: 12pt;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
              <div style="font-weight: bold; font-size: 12pt; text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</div>
              <div style="font-style: italic; font-size: 11pt; margin-top: 5px;">${settings.province}, ngày 27 tháng 06 năm 2026</div>
            </td>
          </tr>
        </table>

        <div style="text-align: center; margin: 25px 0;">
          <div style="font-weight: bold; font-size: 15pt;">BÁO CÁO THỐNG KÊ KẾT QUẢ CÔNG TÁC GIẢI QUYẾT, XÉT XỬ CÁC LOẠI VỤ ÁN</div>
          <div style="font-style: italic; font-size: 12pt;">(Kỳ báo cáo: ${getPeriodLabel()})</div>
        </div>

        <div style="font-weight: bold; font-size: 12pt; margin: 15px 0 8px 0;">I. TỔNG HỢP KẾT QUẢ THỤ LÝ VÀ GIẢI QUYẾT THEO TỪNG LOẠI ÁN</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11pt;" border="1">
          <thead>
            <tr style="background: #f0f0f0; text-align: center; font-weight: bold;">
              <th style="padding: 6px;">TT</th>
              <th style="padding: 6px;">Loại vụ án</th>
              <th style="padding: 6px;">Tổng thụ lý</th>
              <th style="padding: 6px;">Đã giải quyết</th>
              <th style="padding: 6px;">Đang giải quyết</th>
              <th style="padding: 6px;">Tạm đình chỉ</th>
              <th style="padding: 6px;">Quá hạn</th>
              <th style="padding: 6px;">Tỷ lệ đạt (%)</th>
              <th style="padding: 6px;">Chỉ tiêu giao</th>
            </tr>
          </thead>
          <tbody>
            ${categoryStats.map((c, i) => `
              <tr>
                <td style="text-align: center; padding: 6px;">${i + 1}</td>
                <td style="padding: 6px; font-weight: bold;">${c.label}</td>
                <td style="text-align: center; padding: 6px;">${c.total}</td>
                <td style="text-align: center; padding: 6px; font-weight: bold;">${c.resolved}</td>
                <td style="text-align: center; padding: 6px;">${c.pending}</td>
                <td style="text-align: center; padding: 6px;">${c.suspended}</td>
                <td style="text-align: center; padding: 6px; color: ${c.overdue > 0 ? '#b91c1c' : '#000'}; font-weight: bold;">${c.overdue}</td>
                <td style="text-align: center; padding: 6px; font-weight: bold;">${c.rate}%</td>
                <td style="text-align: center; padding: 6px;">≥ ${c.targetRate}%</td>
              </tr>
            `).join('')}
            <tr style="background: #e5e7eb; font-weight: bold;">
              <td colspan="2" style="padding: 6px; text-align: center;">TỔNG CỘNG</td>
              <td style="text-align: center; padding: 6px;">${totalCases}</td>
              <td style="text-align: center; padding: 6px;">${totalResolved}</td>
              <td style="text-align: center; padding: 6px;">${totalPending}</td>
              <td style="text-align: center; padding: 6px;">${totalSuspended}</td>
              <td style="text-align: center; padding: 6px; color: #b91c1c;">${totalOverdue}</td>
              <td style="text-align: center; padding: 6px;">${overallRate}%</td>
              <td style="text-align: center; padding: 6px;">-</td>
            </tr>
          </tbody>
        </table>

        <div style="font-weight: bold; font-size: 12pt; margin: 25px 0 8px 0;">II. KẾT QUẢ THỰC HIỆN NHIỆM VỤ CỦA TỪNG THẨM PHÁN</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11pt;" border="1">
          <thead>
            <tr style="background: #f0f0f0; text-align: center; font-weight: bold;">
              <th style="padding: 6px;">TT</th>
              <th style="padding: 6px;">Họ và tên Thẩm phán</th>
              <th style="padding: 6px;">Chức vụ / Ngạch</th>
              <th style="padding: 6px;">Số án thụ lý</th>
              <th style="padding: 6px;">Đã giải quyết</th>
              <th style="padding: 6px;">Còn lại</th>
              <th style="padding: 6px;">Án quá hạn</th>
              <th style="padding: 6px;">Tỷ lệ giải quyết</th>
            </tr>
          </thead>
          <tbody>
            ${judgeStats.map((j, i) => `
              <tr>
                <td style="text-align: center; padding: 6px;">${i + 1}</td>
                <td style="padding: 6px; font-weight: bold;">${j.name}</td>
                <td style="padding: 6px;">${j.title}</td>
                <td style="text-align: center; padding: 6px;">${j.total}</td>
                <td style="text-align: center; padding: 6px; font-weight: bold;">${j.resolved}</td>
                <td style="text-align: center; padding: 6px;">${j.pending}</td>
                <td style="text-align: center; padding: 6px; color: ${j.overdue > 0 ? '#b91c1c' : '#000'}; font-weight: bold;">${j.overdue}</td>
                <td style="text-align: center; padding: 6px; font-weight: bold;">${j.rate}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <table style="width: 100%; margin-top: 35px; font-size: 11pt;">
          <tr>
            <td style="width: 50%; vertical-align: top;">
              <strong><em>Nơi nhận:</em></strong><br>
              - Tòa án nhân dân tỉnh ${settings.province} (để b/c);<br>
              - Thường trực Huyện ủy, HĐND;<br>
              - Lưu: VT-TA, Thống kê.
            </td>
            <td style="width: 50%; vertical-align: top; text-align: center;">
              <div style="font-weight: bold; font-size: 12pt;">CHÁNH ÁN</div>
              <div style="font-style: italic; font-size: 10pt; color: #555;">(Ký tên, đóng dấu)</div>
              <div style="height: 60px;"></div>
              <div style="font-weight: bold; font-size: 12pt;">${settings.chiefJudgeName}</div>
            </td>
          </tr>
        </table>
      </div>
    `;

    const printWin = window.open('', '_blank');
    if (!printWin) return;
    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bao_Cao_Thong_Ke_TAND</title>
          <style>
            @page { size: A4; margin: 15mm; }
            body { font-family: 'Times New Roman', serif; margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          ${reportHtml}
          <script>
            window.onload = function() { window.print(); window.onafterprint = function() { window.close(); }; };
          </script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  const handleExportCSV = () => {
    let csv = `BÁO CÁO THỐNG KÊ HOẠT ĐỘNG TÒA ÁN - ${settings.courtName}\n`;
    csv += `Kỳ báo cáo: ${getPeriodLabel()}\n\n`;
    csv += `Loại vụ án,Tổng thụ lý,Đã giải quyết,Đang giải quyết,Tạm đình chỉ,Quá hạn,Tỷ lệ giải quyết (%),Chỉ tiêu Quốc hội giao\n`;
    categoryStats.forEach((c) => {
      csv += `"${c.label}",${c.total},${c.resolved},${c.pending},${c.suspended},${c.overdue},${c.rate}%,≥${c.targetRate}%\n`;
    });
    csv += `"TỔNG CỘNG",${totalCases},${totalResolved},${totalPending},${totalSuspended},${totalOverdue},${overallRate}%,-\n\n`;

    csv += `DANH SÁCH THẨM PHÁN VÀ TIẾN ĐỘ GIẢI QUYẾT\n`;
    csv += `Họ và tên,Chức vụ,Số án thụ lý,Đã giải quyết,Còn lại,Án quá hạn,Tỷ lệ hoàn thành\n`;
    judgeStats.forEach((j) => {
      csv += `"${j.name}","${j.title}",${j.total},${j.resolved},${j.pending},${j.overdue},${j.rate}%\n`;
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bao_cao_thong_ke_TAND_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* RBAC Header Banner */}
      {currentUser && (
        <div className="bg-white border border-slate-300 rounded p-3 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getRoleBadge(currentUser.role).bgClass} ${getRoleBadge(currentUser.role).textClass} ${getRoleBadge(currentUser.role).borderClass}`}>
              {getRoleBadge(currentUser.role).label}
            </span>
            <span className="text-slate-700 font-medium">
              {currentUser.role === 'CAN_BO_TONG_HOP' && (
                <span>
                  ✓ <strong>Cán bộ Tổng hợp & Thụ lý:</strong> Tổng hợp đầy đủ số liệu thụ lý mới, tiến độ giải quyết và tình hình chấp hành thời hạn để lập báo cáo định kỳ theo quy định của TAND Tối cao.
                </span>
              )}
              {currentUser.role === 'LANH_DAO' && (
                <span>
                  ★ <strong>Lãnh đạo Tòa án:</strong> Giám sát tiến độ xét xử toàn diện, đánh giá tiến độ từng Thẩm phán và chỉ đạo các vụ án quá hạn / lệnh tạm giam sắp hết hạn.
                </span>
              )}
              {currentUser.role === 'THAM_PHAN' && (
                <span>
                  ⚖ <strong>Thẩm phán:</strong> Theo dõi tiến độ giải quyết của bản thân và so sánh với chỉ tiêu công tác được Quốc hội và Tòa án tối cao giao.
                </span>
              )}
              {currentUser.role === 'THU_KY' && (
                <span>
                  📋 <strong>Thư ký Tòa án:</strong> Tra cứu số liệu án phục vụ kiểm tra hồ sơ và hoàn thiện báo cáo công tác.
                </span>
              )}
              {currentUser.role === 'ADMIN' && (
                <span>
                  🛡 <strong>Quản trị viên:</strong> Toàn quyền đối soát số liệu thống kê và cấu hình hệ thống báo cáo.
                </span>
              )}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Đang đăng nhập: <strong>{currentUser.fullName}</strong> (@{currentUser.username})
          </div>
        </div>
      )}

      {/* Top Filter and Controls Bar */}
      <div className="bg-white border border-slate-300 rounded shadow-2xs p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <label className="font-bold text-slate-800 flex items-center gap-1.5 uppercase text-xs">
            <Calendar className="w-4 h-4 text-red-700" />
            Kỳ báo cáo thống kê:
          </label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs font-semibold text-red-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
          >
            <option value="ALL">Toàn bộ án đang thụ lý trong hệ thống ({cases.length} vụ)</option>
            <option value="MONTH">Tháng hiện tại (06/2026)</option>
            <option value="QUARTER_2">Quý II/2026 (01/04 - 30/06/2026)</option>
            <option value="SIX_MONTHS">6 tháng đầu năm công tác 2026</option>
            <option value="FULL_YEAR">Cả năm công tác ngành Tòa án 2026</option>
          </select>
          <span className="text-[11px] text-slate-500 font-medium">
            (Số liệu khớp 100% với danh mục vụ án trong từng phân hệ)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenTargetCustomization && (
            <button
              type="button"
              onClick={onOpenTargetCustomization}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold text-xs transition-colors shadow-2xs"
              title="Tùy chỉnh chỉ tiêu thi đua và định mức giải quyết án của đơn vị"
            >
              <Target className="w-4 h-4 text-rose-700" />
              <span>Tùy Chỉnh Chỉ Tiêu</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded font-semibold text-xs transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Xuất file Excel / CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold text-xs transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>In Báo Cáo Chính Thức (A4)</span>
          </button>
        </div>
      </div>

      {/* High-level KPI Scorecards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-300 rounded p-3 shadow-2xs">
          <div className="text-slate-500 font-bold text-[11px] uppercase">Tổng số thụ lý</div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {totalCases} <span className="text-xs font-normal text-slate-500">vụ việc</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Khớp 100% với các phân hệ</div>
        </div>

        <div className="bg-white border border-slate-300 rounded p-3 shadow-2xs">
          <div className="text-slate-500 font-bold text-[11px] uppercase">Đã giải quyết</div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1 tabular-nums">
            {totalResolved} <span className="text-xs font-normal text-slate-500">vụ việc</span>
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Đã tuyên án / công nhận thỏa thuận</div>
        </div>

        <div className="bg-white border border-slate-300 rounded p-3 shadow-2xs">
          <div className="text-slate-500 font-bold text-[11px] uppercase">Đang giải quyết</div>
          <div className="text-2xl font-bold font-mono text-amber-700 mt-1 tabular-nums">
            {totalPending} <span className="text-xs font-normal text-slate-500">vụ việc</span>
          </div>
          <div className="text-[10px] text-amber-600 mt-0.5">Trong hạn chuẩn bị xét xử</div>
        </div>

        <div className="bg-white border border-slate-300 rounded p-3 shadow-2xs">
          <div className="text-slate-500 font-bold text-[11px] uppercase">Án quá hạn luật định</div>
          <div className="text-2xl font-bold font-mono text-rose-700 mt-1 tabular-nums">
            {totalOverdue} <span className="text-xs font-normal text-slate-500">vụ</span>
          </div>
          <div className="text-[10px] text-rose-600 mt-0.5">Cần kiểm điểm tiến độ</div>
        </div>

        <div className="bg-white border border-slate-300 rounded p-3 shadow-2xs">
          <div className="text-slate-500 font-bold text-[11px] uppercase">Tỷ lệ giải quyết chung</div>
          <div className="text-2xl font-bold font-mono text-red-800 mt-1 tabular-nums">
            {overallRate}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Trên tổng số thụ lý</div>
        </div>
      </div>

      {/* Table 1: Category Breakdown matching each nav tab */}
      <div className="bg-white border border-slate-300 rounded shadow-2xs overflow-hidden">
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 font-bold text-slate-800 text-xs flex items-center justify-between uppercase">
          <span className="text-red-900">
            1. Bảng số liệu thống kê theo từng loại án (Khớp hoàn toàn với Danh sách loại án)
          </span>
          <span className="text-[11px] text-slate-500 font-normal">Đơn vị tính: Vụ việc</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#991B1B] text-white text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3 text-center w-10">TT</th>
                <th className="py-2.5 px-3">Loại vụ án</th>
                <th className="py-2.5 px-3 text-center">Tổng thụ lý</th>
                <th className="py-2.5 px-3 text-center">Đã giải quyết</th>
                <th className="py-2.5 px-3 text-center">Đang giải quyết</th>
                <th className="py-2.5 px-3 text-center">Tạm đình chỉ</th>
                <th className="py-2.5 px-3 text-center">Quá hạn</th>
                <th className="py-2.5 px-3 text-center">Tỷ lệ đạt</th>
                <th className="py-2.5 px-3 text-center">Chỉ tiêu Quốc hội</th>
                <th className="py-2.5 px-3 text-center">Đánh giá</th>
                <th className="py-2.5 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {categoryStats.map((c, idx) => (
                <tr key={c.key} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    <button
                      onClick={() => onSelectCategoryTab && onSelectCategoryTab(c.navTab)}
                      className="hover:text-red-700 hover:underline text-left font-bold"
                      title={`Xem danh sách chi tiết án ${c.label}`}
                    >
                      {c.label}
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900 text-sm">
                    {c.total}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-700">
                    {c.resolved}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-amber-700 font-semibold">
                    {c.pending}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-600">
                    {c.suspended}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-700">
                    {c.overdue}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                    {c.rate}%
                  </td>
                  <td className="py-2.5 px-3 text-center text-slate-600">
                    ≥ {c.targetRate}%
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {c.isTargetMet ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Đạt chỉ tiêu</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Chưa đạt</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setInspectCategory(c)}
                        className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold text-[11px] transition-colors inline-flex items-center gap-1 shadow-2xs"
                        title="Xem danh sách chi tiết các vụ việc trong loại án này"
                      >
                        <Eye className="w-3 h-3 text-amber-700" />
                        <span>Xem ({c.total})</span>
                      </button>
                      <button
                        onClick={() => onSelectCategoryTab && onSelectCategoryTab(c.navTab)}
                        className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] transition-colors shadow-2xs"
                        title="Chuyển đến phân hệ xử lý án này"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Summary Row */}
              <tr className="bg-amber-50/80 font-bold text-slate-900 border-t-2 border-slate-300">
                <td colSpan={2} className="py-2.5 px-3 text-center uppercase text-red-900 font-bold">
                  TỔNG CỘNG TOÀN ĐƠN VỊ
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-base text-red-900 font-bold">
                  {totalCases}
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-base text-emerald-800">
                  {totalResolved}
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-base text-amber-800">
                  {totalPending}
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-base">
                  {totalSuspended}
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-base text-rose-800">
                  {totalOverdue}
                </td>
                <td className="py-2.5 px-3 text-center font-mono text-base text-red-900">
                  {overallRate}%
                </td>
                <td className="py-2.5 px-3 text-center text-slate-500">-</td>
                <td className="py-2.5 px-3 text-center text-emerald-800 font-bold">
                  Hoàn thành tốt
                </td>
                <td className="py-2.5 px-3 text-center text-slate-400 font-normal">
                  (Tổng cộng)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Judge Productivity Breakdown */}
      <div className="bg-white border border-slate-300 rounded shadow-2xs overflow-hidden">
        <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 font-bold text-slate-800 text-xs flex items-center justify-between uppercase">
          <span className="text-red-900">2. Thống kê tiến độ giải quyết của từng Thẩm phán</span>
          <span className="text-[11px] text-slate-500 font-normal">Đánh giá thi đua định kỳ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#991B1B] text-white text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3 text-center w-10">TT</th>
                <th className="py-2.5 px-3">Họ và tên Thẩm phán</th>
                <th className="py-2.5 px-3">Chức vụ / Ngạch</th>
                <th className="py-2.5 px-3 text-center">Số án được giao</th>
                <th className="py-2.5 px-3 text-center">Đã giải quyết</th>
                <th className="py-2.5 px-3 text-center">Đang giải quyết</th>
                <th className="py-2.5 px-3 text-center">Án quá hạn</th>
                <th className="py-2.5 px-3 text-center">Tỷ lệ hoàn thành</th>
                <th className="py-2.5 px-3 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {judgeStats.map((judge, idx) => (
                <tr key={judge.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{judge.name}</td>
                  <td className="py-2.5 px-3 text-slate-700">{judge.title}</td>
                  <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-800">
                    {judge.total}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-700">
                    {judge.resolved}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-amber-700">
                    {judge.pending}
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-rose-700">
                    {judge.overdue}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full"
                          style={{ width: `${judge.rate}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-900">{judge.rate}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => setInspectJudge(judge)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded font-semibold text-[11px] transition-colors inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3 h-3 text-slate-500" />
                      <span>Xem án</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Category Cases Modal */}
      {inspectCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#991B1B] text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm uppercase">
                  Danh sách chi tiết: {inspectCategory.label} ({inspectCategory.casesList.length} vụ việc)
                </h3>
              </div>
              <button
                onClick={() => setInspectCategory(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-center justify-between shrink-0">
              <span>
                Số liệu này phản ánh chính xác các vụ án đang thuộc phân hệ <strong>{inspectCategory.label}</strong> trong hệ thống.
              </span>
              {onSelectCategoryTab && (
                <button
                  onClick={() => {
                    const nav = inspectCategory.navTab;
                    setInspectCategory(null);
                    onSelectCategoryTab(nav);
                  }}
                  className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở phân hệ {inspectCategory.label}</span>
                </button>
              )}
            </div>

            <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-200 text-xs">
              {inspectCategory.casesList.length === 0 ? (
                <div className="py-8 text-center text-slate-400 italic">
                  Chưa có vụ việc nào thuộc loại án này trong kỳ báo cáo.
                </div>
              ) : (
                inspectCategory.casesList.map((c: CourtCase, i: number) => (
                  <div key={c.id} className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50 px-2 rounded">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-red-900 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-[11px]">
                          {c.docketNumber}
                        </span>
                        <span className="font-mono text-slate-500 text-[11px]">{c.caseCode}</span>
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-slate-100 text-slate-700">
                          {c.statusName}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                      <p className="text-slate-600 line-clamp-1">{c.disputeOrCrime}</p>
                      <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                        <span>Thụ lý: <strong>{formatDateVN(c.intakeDate)}</strong></span>
                        <span>Thẩm phán: <strong className="text-slate-800">{c.assignedJudgeName || 'Chưa phân công'}</strong></span>
                        <span>Thời hạn: <strong>{formatDateVN(c.deadlineDate)}</strong></span>
                      </div>
                    </div>

                    {onOpenCaseDetail && (
                      <button
                        onClick={() => {
                          setInspectCategory(null);
                          onOpenCaseDetail(c);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-800 border border-slate-300 rounded font-semibold text-xs shrink-0 transition-colors"
                      >
                        Xem hồ sơ vụ án →
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-100 border-t border-slate-300 text-right shrink-0">
              <button
                onClick={() => setInspectCategory(null)}
                className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-semibold text-xs transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Judge Cases Modal */}
      {inspectJudge && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#991B1B] text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm uppercase">
                  Án Thẩm phán đang giải quyết: {inspectJudge.name} ({inspectJudge.casesList.length} vụ việc)
                </h3>
              </div>
              <button
                onClick={() => setInspectJudge(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-200 text-xs">
              {inspectJudge.casesList.length === 0 ? (
                <div className="py-8 text-center text-slate-400 italic">
                  Thẩm phán hiện chưa được phân công giải quyết vụ án nào.
                </div>
              ) : (
                inspectJudge.casesList.map((c: CourtCase) => (
                  <div key={c.id} className="py-3 flex items-start justify-between gap-3 hover:bg-slate-50 px-2 rounded">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-red-900 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-[11px]">
                          {c.docketNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10.5px] font-semibold bg-slate-100 text-slate-700">
                          {c.statusName}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                      <p className="text-slate-600 line-clamp-1">{c.disputeOrCrime}</p>
                      <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                        <span>Thụ lý: <strong>{formatDateVN(c.intakeDate)}</strong></span>
                        <span>Hạn giải quyết: <strong>{formatDateVN(c.deadlineDate)}</strong></span>
                      </div>
                    </div>

                    {onOpenCaseDetail && (
                      <button
                        onClick={() => {
                          setInspectJudge(null);
                          onOpenCaseDetail(c);
                        }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-800 border border-slate-300 rounded font-semibold text-xs shrink-0 transition-colors"
                      >
                        Xem hồ sơ →
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-100 border-t border-slate-300 text-right shrink-0">
              <button
                onClick={() => setInspectJudge(null)}
                className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-semibold text-xs transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
