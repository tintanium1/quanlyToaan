import React, { useState, useMemo } from 'react';
import { 
  TrialSession, 
  CourtCase, 
  Official, 
  CourtUnitSettings, 
  UserAccount, 
  CaseType,
  TrialStatus,
  TrialFormat
} from '../types/court';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Users, 
  User, 
  ShieldAlert, 
  Plus, 
  Filter, 
  Search, 
  Printer, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Edit, 
  Video, 
  Building2, 
  X,
  Gavel,
  BookOpen,
  ArrowRight,
  List,
  Grid
} from 'lucide-react';
import { formatDateVN } from '../utils/courtUtils';

interface TrialCalendarViewProps {
  trialSessions: TrialSession[];
  onUpdateTrialSessions: (sessions: TrialSession[]) => void;
  cases: CourtCase[];
  officials: Official[];
  settings: CourtUnitSettings;
  currentUser: UserAccount;
  onOpenCaseDetail: (caseItem: CourtCase) => void;
  onOpenPrintModal?: (caseItem: CourtCase, docType?: string) => void;
}

export const TrialCalendarView: React.FC<TrialCalendarViewProps> = ({
  trialSessions,
  onUpdateTrialSessions,
  cases,
  officials,
  settings,
  currentUser,
  onOpenCaseDetail,
  onOpenPrintModal,
}) => {
  // Calendar month state: Default to current month or October 2026
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-10-16');
  const [viewMode, setViewMode] = useState<'CALENDAR' | 'LIST'>('CALENDAR');

  // Filter states
  const [selectedCaseType, setSelectedCaseType] = useState<string>('ALL');
  const [selectedJudge, setSelectedJudge] = useState<string>('ALL');
  const [selectedCourtroom, setSelectedCourtroom] = useState<string>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<TrialSession | null>(null);

  // Form state for scheduling new trial
  const [formCaseId, setFormCaseId] = useState<string>(cases[0]?.id || '');
  const [formDate, setFormDate] = useState<string>('2026-10-20');
  const [formTime, setFormTime] = useState<string>('08:00');
  const [formCourtroom, setFormCourtroom] = useState<string>('Phòng xử án số 1');
  const [formFormat, setFormFormat] = useState<TrialFormat>('TRUC_TIEP');
  const [formTrialType, setFormTrialType] = useState<string>('Xét xử sơ thẩm công khai');
  const [formJudge, setFormJudge] = useState<string>(officials.find(o => o.role === 'THAM_PHAN')?.name || 'Võ Thị Tuyết Trinh');
  const [formAlternateJudge, setFormAlternateJudge] = useState<string>('');
  const [formClerk, setFormClerk] = useState<string>(officials.find(o => o.role === 'THU_KY')?.name || 'Trần Thanh Uyên');
  const [formProcurator, setFormProcurator] = useState<string>('Kiểm sát viên VKSND khu vực 12');
  const [formJurors, setFormJurors] = useState<string>('Chu Ngọc Thạch, Trần Đình Trọng');
  const [formNotes, setFormNotes] = useState<string>('');

  // Month navigation helpers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleGoToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9); // October
    setSelectedDateStr('2026-10-16');
  };

  // Filtered trial sessions
  const filteredSessions = useMemo(() => {
    return trialSessions.filter((s) => {
      if (selectedCaseType !== 'ALL' && s.caseType !== selectedCaseType) return false;
      if (selectedJudge !== 'ALL' && s.presidingJudge !== selectedJudge) return false;
      if (selectedCourtroom !== 'ALL' && s.courtroom !== selectedCourtroom) return false;
      if (selectedFormat !== 'ALL' && s.trialFormat !== selectedFormat) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          s.caseCode.toLowerCase().includes(q) ||
          s.docketNumber.toLowerCase().includes(q) ||
          s.caseTitle.toLowerCase().includes(q) ||
          s.presidingJudge.toLowerCase().includes(q) ||
          s.courtroom.toLowerCase().includes(q) ||
          s.defendantsOrLitigants.some(d => d.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [trialSessions, selectedCaseType, selectedJudge, selectedCourtroom, selectedFormat, searchQuery]);

  // Calendar Grid generation
  // Standard Vietnamese Monday-Sunday week: Mon=0, Tue=1, ..., Sun=6
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();

    // In JS: Sunday is 0, Monday is 1...
    // We convert so Monday is 0, Sunday is 6
    let startingDayOfWeek = firstDay.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    // Previous month padding
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    const days: {
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      trials: TrialSession[];
    }[] = [];

    // Add days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const prevMonth = currentMonth === 0 ? 12 : currentMonth;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dayNumber: dayNum,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === '2026-10-16',
        trials: filteredSessions.filter(t => t.trialDate === dateStr),
      });
    }

    // Add days of current month
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
        isToday: dateStr === '2026-10-16',
        trials: filteredSessions.filter(t => t.trialDate === dateStr),
      });
    }

    // Next month padding to fill complete weeks (up to 35 or 42 slots)
    const remainingSlots = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingSlots; i++) {
      const nextMonth = currentMonth === 11 ? 1 : currentMonth + 2;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNumber: i,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === '2026-10-16',
        trials: filteredSessions.filter(t => t.trialDate === dateStr),
      });
    }

    return days;
  }, [currentYear, currentMonth, filteredSessions]);

  // Trials on the currently selected date
  const selectedDateTrials = useMemo(() => {
    return filteredSessions.filter(t => t.trialDate === selectedDateStr);
  }, [filteredSessions, selectedDateStr]);

  // Statistics for the current month
  const monthStats = useMemo(() => {
    const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const thisMonthTrials = trialSessions.filter(t => t.trialDate.startsWith(currentMonthPrefix));
    return {
      total: thisMonthTrials.length,
      criminal: thisMonthTrials.filter(t => t.caseType === 'HINH_SU').length,
      civil: thisMonthTrials.filter(t => t.caseType === 'DAN_SU' || t.caseType === 'HON_NHAN').length,
      online: thisMonthTrials.filter(t => t.trialFormat === 'TRUC_TUYEN').length,
      completed: thisMonthTrials.filter(t => t.status === 'DA_TUYEN_AN').length,
      postponed: thisMonthTrials.filter(t => t.status === 'HOAN_PHIEN_TOA').length,
    };
  }, [trialSessions, currentYear, currentMonth]);

  // Case type badge color
  const getCaseTypeBadge = (type: CaseType) => {
    switch (type) {
      case 'HINH_SU':
        return { label: 'Hình sự', bg: 'bg-red-100 text-red-900 border-red-200', dot: 'bg-red-600' };
      case 'DAN_SU':
        return { label: 'Dân sự', bg: 'bg-blue-100 text-blue-900 border-blue-200', dot: 'bg-blue-600' };
      case 'HON_NHAN':
        return { label: 'Hôn nhân & GĐ', bg: 'bg-purple-100 text-purple-900 border-purple-200', dot: 'bg-purple-600' };
      case 'KDTM':
        return { label: 'Kinh doanh TM', bg: 'bg-emerald-100 text-emerald-900 border-emerald-200', dot: 'bg-emerald-600' };
      case 'HANH_CHINH':
        return { label: 'Hành chính', bg: 'bg-slate-100 text-slate-800 border-slate-300', dot: 'bg-slate-600' };
      case 'LAO_DONG':
        return { label: 'Lao động', bg: 'bg-amber-100 text-amber-900 border-amber-200', dot: 'bg-amber-600' };
      default:
        return { label: type, bg: 'bg-slate-100 text-slate-800 border-slate-200', dot: 'bg-slate-500' };
    }
  };

  const getStatusBadge = (status: TrialStatus) => {
    switch (status) {
      case 'DANG_DIEN_RA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-white animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            Đang diễn ra phiên tòa
          </span>
        );
      case 'SAP_DIEN_RA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3 h-3 text-blue-700" />
            Sắp diễn ra
          </span>
        );
      case 'DA_TUYEN_AN':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Đã tuyên án / Giải quyết
          </span>
        );
      case 'HOAN_PHIEN_TOA':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3 h-3 text-rose-700" />
            Hoãn phiên tòa
          </span>
        );
      case 'DINH_CHI':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-800">
            Đình chỉ
          </span>
        );
      default:
        return null;
    }
  };

  // Add new trial session
  const handleSaveNewTrial = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCase = cases.find(c => c.id === formCaseId);
    if (!targetCase) {
      alert('Vui lòng chọn vụ án!');
      return;
    }

    const newSession: TrialSession = {
      id: 'trial-' + Date.now(),
      caseId: targetCase.id,
      caseCode: targetCase.caseCode,
      docketNumber: targetCase.docketNumber,
      caseTitle: targetCase.title,
      caseType: targetCase.caseType,
      trialDate: formDate,
      trialTime: formTime,
      courtroom: formCourtroom,
      trialFormat: formFormat,
      trialType: formTrialType,
      presidingJudge: formJudge,
      alternateJudge: formAlternateJudge || undefined,
      clerk: formClerk,
      procurator: formProcurator || undefined,
      jurors: formJurors.split(',').map(j => j.trim()).filter(Boolean),
      defendantsOrLitigants: targetCase.litigants.map(l => `${l.roleName}: ${l.name}`),
      status: 'SAP_DIEN_RA',
      statusName: 'Sắp diễn ra',
      summary: targetCase.disputeOrCrime,
      notes: formNotes,
    };

    const updated = [newSession, ...trialSessions];
    onUpdateTrialSessions(updated);
    setIsAddModalOpen(false);
    setSelectedDateStr(formDate);
    alert(`Đã thêm thành công lịch xét xử cho vụ án ${targetCase.docketNumber}!`);
  };

  // Update trial status (e.g. Hoãn, Đã tuyên án)
  const handleChangeStatus = (sessionId: string, newStatus: TrialStatus, reason?: string) => {
    const updated = trialSessions.map(t => {
      if (t.id === sessionId) {
        let statusName = 'Sắp diễn ra';
        if (newStatus === 'DA_TUYEN_AN') statusName = 'Đã tuyên án';
        if (newStatus === 'HOAN_PHIEN_TOA') statusName = `Hoãn phiên tòa: ${reason || 'Theo quy định'}`;
        if (newStatus === 'DANG_DIEN_RA') statusName = 'Đang diễn ra phiên tòa';
        return {
          ...t,
          status: newStatus,
          statusName,
          notes: reason ? `${t.notes ? t.notes + ' | ' : ''}${reason}` : t.notes,
        };
      }
      return t;
    });
    onUpdateTrialSessions(updated);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Title */}
      <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#991B1B] text-amber-300 rounded-lg shadow-xs">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
                  LỊCH XÉT XỬ & PHIÊN TÒA TÒA ÁN NHÂN DÂN
                </h2>
                <span className="px-2 py-0.5 bg-red-100 text-red-900 border border-red-300 text-xs font-bold rounded">
                  {settings.courtName}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Theo dõi toàn bộ phiên tòa sơ thẩm, phúc thẩm, phiên họp hòa giải, xử kín, trực tiếp và trực tuyến theo từng ngày trong tháng
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 border border-slate-300 rounded p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('CALENDAR')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  viewMode === 'CALENDAR' ? 'bg-[#991B1B] text-white shadow-2xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Lịch tháng</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('LIST')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  viewMode === 'LIST' ? 'bg-[#991B1B] text-white shadow-2xs' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Danh sách ({filteredSessions.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-bold transition-colors shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>In Lịch xét xử tháng</span>
            </button>

            {currentUser.permissions.canIssueTrialDecision && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded text-xs font-bold transition-colors shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>+ Lên lịch phiên tòa mới</span>
              </button>
            )}
          </div>
        </div>

        {/* Month Statistics Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-3">
          <div className="bg-slate-50 border border-slate-200 rounded p-2.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Tổng phiên trong tháng</div>
            <div className="text-xl font-black text-slate-800 mt-0.5">{monthStats.total} <span className="text-xs font-normal text-slate-500">phiên</span></div>
          </div>
          <div className="bg-red-50/60 border border-red-200 rounded p-2.5">
            <div className="text-[11px] font-semibold text-red-700 uppercase">Án Hình sự (Tạm giam)</div>
            <div className="text-xl font-black text-red-900 mt-0.5">{monthStats.criminal} <span className="text-xs font-normal text-red-600">vụ</span></div>
          </div>
          <div className="bg-blue-50/60 border border-blue-200 rounded p-2.5">
            <div className="text-[11px] font-semibold text-blue-700 uppercase">Dân sự & HNGĐ</div>
            <div className="text-xl font-black text-blue-900 mt-0.5">{monthStats.civil} <span className="text-xs font-normal text-blue-600">vụ</span></div>
          </div>
          <div className="bg-emerald-50/60 border border-emerald-200 rounded p-2.5">
            <div className="text-[11px] font-semibold text-emerald-700 uppercase">Xử trực tuyến</div>
            <div className="text-xl font-black text-emerald-900 mt-0.5">{monthStats.online} <span className="text-xs font-normal text-emerald-600">phiên</span></div>
          </div>
          <div className="bg-teal-50/60 border border-teal-200 rounded p-2.5">
            <div className="text-[11px] font-semibold text-teal-700 uppercase">Đã tuyên án xong</div>
            <div className="text-xl font-black text-teal-900 mt-0.5">{monthStats.completed} <span className="text-xs font-normal text-teal-600">vụ</span></div>
          </div>
          <div className="bg-rose-50/60 border border-rose-200 rounded p-2.5">
            <div className="text-[11px] font-semibold text-rose-700 uppercase">Hoãn phiên tòa</div>
            <div className="text-xl font-black text-rose-900 mt-0.5">{monthStats.postponed} <span className="text-xs font-normal text-rose-600">vụ</span></div>
          </div>
        </div>
      </div>

      {/* Filter and Month Navigation Bar */}
      <div className="bg-white border border-slate-300 rounded-lg p-3 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Month Selector Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded border border-slate-300">
              <button
                type="button"
                onClick={handlePrevMonth}
                title="Tháng trước"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-3 py-1 font-black text-slate-900 text-sm whitespace-nowrap min-w-[150px] text-center">
                Tháng {String(currentMonth + 1).padStart(2, '0')}/{currentYear}
              </div>
              <button
                type="button"
                onClick={handleNextMonth}
                title="Tháng sau"
                className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleGoToday}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-xs font-bold transition-colors"
            >
              Hôm nay (16/10/2026)
            </button>

            <div className="text-xs text-slate-500 font-medium hidden sm:block">
              (Nhấp vào từng ô ngày để xem danh sách chi tiết các phiên tòa)
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative w-44">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm mã án, bị cáo..."
                className="w-full pl-7 pr-2.5 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
            </div>

            {/* Case type */}
            <select
              value={selectedCaseType}
              onChange={(e) => setSelectedCaseType(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
            >
              <option value="ALL">Tất cả loại án</option>
              <option value="HINH_SU">Hình sự</option>
              <option value="DAN_SU">Dân sự</option>
              <option value="HON_NHAN">Hôn nhân & GĐ</option>
              <option value="KDTM">Kinh doanh, TM</option>
              <option value="HANH_CHINH">Hành chính</option>
              <option value="LAO_DONG">Lao động</option>
            </select>

            {/* Presiding Judge */}
            <select
              value={selectedJudge}
              onChange={(e) => setSelectedJudge(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
            >
              <option value="ALL">Tất cả Thẩm phán</option>
              {officials.filter(o => o.role === 'THAM_PHAN').map(o => (
                <option key={o.id} value={o.name}>{o.name}</option>
              ))}
            </select>

            {/* Courtroom */}
            <select
              value={selectedCourtroom}
              onChange={(e) => setSelectedCourtroom(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
            >
              <option value="ALL">Tất cả phòng xử</option>
              <option value="Phòng xử án số 1">Phòng xử án số 1</option>
              <option value="Phòng xử án số 2">Phòng xử án số 2</option>
              <option value="Phòng xử trực tuyến 01">Phòng trực tuyến 01</option>
              <option value="Phòng xử trực tuyến 02">Phòng trực tuyến 02</option>
              <option value="Hội trường lớn TAND">Hội trường lớn TAND</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main View: Calendar Grid + Day Details Panel */}
      {viewMode === 'CALENDAR' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Calendar Grid (8 cols on lg) */}
          <div className="lg:col-span-8 bg-white border border-slate-300 rounded-lg overflow-hidden shadow-xs">
            {/* Weekday Header */}
            <div className="grid grid-cols-7 bg-[#991B1B] text-white text-center text-xs font-bold py-2 border-b border-red-800">
              <div className="py-0.5">Thứ Hai</div>
              <div className="py-0.5">Thứ Ba</div>
              <div className="py-0.5">Thứ Tư</div>
              <div className="py-0.5">Thứ Năm</div>
              <div className="py-0.5">Thứ Sáu</div>
              <div className="py-0.5 text-amber-200">Thứ Bảy</div>
              <div className="py-0.5 text-amber-300 font-black">Chủ Nhật</div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-200 bg-slate-100">
              {calendarDays.map((cell, idx) => {
                const isSelected = cell.dateStr === selectedDateStr;
                const trialCount = cell.trials.length;

                return (
                  <div
                    key={cell.dateStr + '_' + idx}
                    onClick={() => setSelectedDateStr(cell.dateStr)}
                    className={`min-h-[105px] p-1.5 transition-all cursor-pointer relative flex flex-col justify-between ${
                      cell.isCurrentMonth ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/70 text-slate-400'
                    } ${
                      isSelected ? 'ring-2 ring-red-600 ring-inset bg-red-50/40' : ''
                    } ${
                      cell.isToday ? 'border-t-2 border-t-amber-500 bg-amber-50/20' : ''
                    }`}
                  >
                    {/* Top day number & indicator */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-bold inline-block px-1.5 py-0.5 rounded ${
                          cell.isToday
                            ? 'bg-amber-500 text-white font-black shadow-2xs'
                            : isSelected
                            ? 'bg-[#991B1B] text-white'
                            : cell.isCurrentMonth
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {cell.dayNumber}
                      </span>

                      {cell.isToday && (
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 py-0.2 rounded hidden sm:inline-block">
                          Hôm nay
                        </span>
                      )}

                      {trialCount > 0 && (
                        <span
                          className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                            trialCount > 1
                              ? 'bg-red-700 text-white shadow-2xs'
                              : 'bg-red-100 text-red-900 border border-red-300'
                          }`}
                        >
                          {trialCount} phiên
                        </span>
                      )}
                    </div>

                    {/* Trials List in cell */}
                    <div className="space-y-1 flex-1 overflow-hidden">
                      {cell.trials.slice(0, 2).map((trial) => {
                        const badge = getCaseTypeBadge(trial.caseType);
                        return (
                          <div
                            key={trial.id}
                            title={`${trial.trialTime} - ${trial.courtroom}: ${trial.caseTitle}`}
                            className={`text-[10px] p-1 rounded font-medium border truncate transition-all leading-tight ${
                              trial.status === 'DANG_DIEN_RA'
                                ? 'bg-amber-100 text-amber-950 border-amber-300 font-bold animate-pulse'
                                : trial.status === 'HOAN_PHIEN_TOA'
                                ? 'bg-rose-50 text-rose-800 border-rose-200 line-through'
                                : trial.status === 'DA_TUYEN_AN'
                                ? 'bg-slate-100 text-slate-600 border-slate-200'
                                : badge.bg
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              <span className="font-bold">{trial.trialTime}</span>
                              <span className="truncate">{trial.docketNumber}</span>
                            </div>
                            <div className="text-[9px] text-slate-600 truncate mt-0.5">
                              {trial.presidingJudge} • {trial.courtroom.replace('Phòng xử án số ', 'P.')}
                            </div>
                          </div>
                        );
                      })}

                      {trialCount > 2 && (
                        <div className="text-[9px] text-center font-bold text-red-700 bg-red-50 rounded py-0.5">
                          + {trialCount - 2} phiên tòa khác
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Legend */}
            <div className="bg-slate-50 p-2.5 border-t border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-600">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-slate-700">Chú thích loại án:</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Hình sự</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Dân sự</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Hôn nhân & GĐ</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Kinh doanh, TM</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Lao động</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[11px] font-bold">
                  ● Đang diễn ra
                </span>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-900 border border-rose-300 rounded text-[11px] font-bold">
                  ✕ Hoãn phiên
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Day Details Panel (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white border border-slate-300 rounded-lg p-4 shadow-xs sticky top-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Chi tiết lịch xử ngày</div>
                  <div className="text-base font-black text-red-900 flex items-center gap-1.5 mt-0.5">
                    <CalendarIcon className="w-4 h-4 text-red-700" />
                    <span>{formatDateVN(selectedDateStr)}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2.5 py-1 bg-red-100 text-red-900 font-bold text-xs rounded-full border border-red-300">
                    {selectedDateTrials.length} phiên tòa
                  </span>
                </div>
              </div>

              {/* Trials list on selected date */}
              <div className="mt-3 space-y-3 max-h-[68vh] overflow-y-auto pr-1">
                {selectedDateTrials.length === 0 ? (
                  <div className="py-10 text-center text-slate-500 space-y-2">
                    <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs font-medium">Không có phiên tòa nào được lên lịch vào ngày này.</p>
                    {currentUser.permissions.canIssueTrialDecision && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormDate(selectedDateStr);
                          setIsAddModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded text-xs font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Lên lịch phiên tòa cho ngày này</span>
                      </button>
                    )}
                  </div>
                ) : (
                  selectedDateTrials.map((trial) => {
                    const badge = getCaseTypeBadge(trial.caseType);
                    const linkedCase = cases.find(c => c.id === trial.caseId);

                    return (
                      <div
                        key={trial.id}
                        className="border border-slate-200 rounded-lg p-3 bg-white hover:border-red-300 transition-all shadow-2xs space-y-2.5"
                      >
                        {/* Header: Time, Courtroom, Status */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-[#991B1B] text-white font-mono font-bold text-xs rounded">
                              {trial.trialTime}
                            </span>
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-500" />
                              {trial.courtroom}
                            </span>
                          </div>

                          {getStatusBadge(trial.status)}
                        </div>

                        {/* Title and Docket Number */}
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                              {badge.label}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-800">
                              {trial.docketNumber}
                            </span>
                            {trial.trialFormat === 'TRUC_TUYEN' && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <Video className="w-3 h-3" /> Trực tuyến
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                            {trial.caseTitle}
                          </h4>
                          {trial.summary && (
                            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                              {trial.summary}
                            </p>
                          )}
                        </div>

                        {/* Trial Panel Info */}
                        <div className="bg-slate-50 p-2 rounded text-[11px] space-y-1 text-slate-700 border border-slate-200">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Chủ tọa phiên tòa:</span>
                            <span className="font-bold text-slate-900 flex items-center gap-1">
                              <Gavel className="w-3 h-3 text-red-700" />
                              {trial.presidingJudge}
                            </span>
                          </div>
                          {trial.alternateJudge && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Thẩm phán dự khuyết:</span>
                              <span className="font-medium text-slate-700">{trial.alternateJudge}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Thư ký phiên tòa:</span>
                            <span className="font-medium text-slate-800">{trial.clerk}</span>
                          </div>
                          {trial.procurator && (
                            <div className="flex items-center justify-between">
                              <span className="text-slate-500">Kiểm sát viên:</span>
                              <span className="font-medium text-slate-800">{trial.procurator}</span>
                            </div>
                          )}
                          {trial.jurors.length > 0 && (
                            <div className="pt-1 border-t border-slate-200">
                              <span className="text-slate-500">Hội thẩm ND: </span>
                              <span className="font-medium text-slate-800">{trial.jurors.join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {/* Litigants / Defendants */}
                        {trial.defendantsOrLitigants.length > 0 && (
                          <div className="text-[11px] text-slate-600 bg-amber-50/50 p-2 rounded border border-amber-200/60">
                            <span className="font-bold text-amber-900">Đương sự / Bị cáo: </span>
                            <span>{trial.defendantsOrLitigants.join(' | ')}</span>
                          </div>
                        )}

                        {/* Notes */}
                        {trial.notes && (
                          <div className="text-[10px] text-slate-500 italic bg-slate-50 p-1.5 rounded">
                            <span className="font-semibold text-slate-700">Ghi chú:</span> {trial.notes}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1 border-t border-slate-100">
                          {linkedCase && (
                            <button
                              type="button"
                              onClick={() => onOpenCaseDetail(linkedCase)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Hồ sơ vụ án</span>
                            </button>
                          )}

                          {onOpenPrintModal && linkedCase && (
                            <button
                              type="button"
                              onClick={() => onOpenPrintModal(linkedCase, 'GIAY_TRIEU_TAP')}
                              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="In giấy triệu tập đương sự tham dự phiên tòa"
                            >
                              <Printer className="w-3 h-3" />
                              <span>In Giấy triệu tập</span>
                            </button>
                          )}

                          {/* Status changer buttons */}
                          {currentUser.permissions.canIssueTrialDecision && (
                            <div className="flex items-center gap-1">
                              {trial.status !== 'DA_TUYEN_AN' && (
                                <button
                                  type="button"
                                  onClick={() => handleChangeStatus(trial.id, 'DA_TUYEN_AN')}
                                  title="Đánh dấu phiên tòa đã xét xử và tuyên án xong"
                                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[11px] font-bold"
                                >
                                  ✓ Đã tuyên án
                                </button>
                              )}

                              {trial.status !== 'HOAN_PHIEN_TOA' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const reason = prompt('Nhập lý do hoãn phiên tòa (Điều 297 BLTTHS/BLTTDS):', 'Vắng mặt người tham gia tố tụng quan trọng');
                                    if (reason) handleChangeStatus(trial.id, 'HOAN_PHIEN_TOA', reason);
                                  }}
                                  title="Hoãn phiên tòa theo luật định"
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded text-[11px] font-bold"
                                >
                                  Hoãn phiên
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Detailed List / Agenda View */
        <div className="bg-white border border-slate-300 rounded-lg overflow-hidden shadow-xs">
          <div className="bg-[#991B1B] text-white px-4 py-3 flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase tracking-wide flex items-center gap-2">
              <List className="w-4 h-4 text-amber-300" />
              <span>DANH SÁCH TOÀN BỘ PHIÊN TÒA ({filteredSessions.length} PHIÊN)</span>
            </h3>
            <span className="text-xs text-red-100">Sắp xếp theo thứ tự thời gian</span>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Không tìm thấy phiên tòa nào phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              filteredSessions.map((trial) => {
                const badge = getCaseTypeBadge(trial.caseType);
                const linkedCase = cases.find(c => c.id === trial.caseId);

                return (
                  <div key={trial.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="text-center p-2 bg-slate-100 rounded-lg border border-slate-200 min-w-[75px]">
                        <div className="text-xs font-bold text-red-700">{formatDateVN(trial.trialDate).split('/')[0]}/{formatDateVN(trial.trialDate).split('/')[1]}</div>
                        <div className="text-sm font-black text-slate-900 font-mono mt-0.5">{trial.trialTime}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{trial.courtroom.replace('Phòng xử án số ', 'P.')}</div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-800">
                            {trial.docketNumber}
                          </span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-600 font-medium">
                            {trial.caseCode}
                          </span>
                          {getStatusBadge(trial.status)}
                        </div>

                        <h4 className="text-sm font-bold text-slate-900">{trial.caseTitle}</h4>

                        <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span>Chủ tọa: <strong className="text-slate-800">{trial.presidingJudge}</strong></span>
                          <span>Thư ký: <strong className="text-slate-800">{trial.clerk}</strong></span>
                          {trial.jurors.length > 0 && <span>Hội thẩm: {trial.jurors.join(', ')}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      {linkedCase && (
                        <button
                          type="button"
                          onClick={() => onOpenCaseDetail(linkedCase)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Chi tiết hồ sơ</span>
                        </button>
                      )}

                      {onOpenPrintModal && linkedCase && (
                        <button
                          type="button"
                          onClick={() => onOpenPrintModal(linkedCase, 'GIAY_TRIEU_TAP')}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>In Triệu tập</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal: Schedule New Trial Session */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden border border-slate-300 flex flex-col max-h-[92vh]">
            <div className="bg-[#991B1B] text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gavel className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Lên Lịch Phiên Tòa / Phiên Họp Mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded hover:bg-red-800 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewTrial} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Select Case */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Chọn vụ án cần mở phiên tòa <span className="text-red-600">*</span></label>
                <select
                  value={formCaseId}
                  onChange={(e) => setFormCaseId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-red-600 focus:outline-none bg-white"
                  required
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.docketNumber}] - {c.title} ({c.statusName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Ngày mở phiên tòa <span className="text-red-600">*</span></label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Thời gian (Giờ:Phút) <span className="text-red-600">*</span></label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Courtroom and Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Phòng xử án / Địa điểm <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    value={formCourtroom}
                    onChange={(e) => setFormCourtroom(e.target.value)}
                    placeholder="VD: Phòng xử án số 1"
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Hình thức phiên tòa</label>
                  <select
                    value={formFormat}
                    onChange={(e) => setFormFormat(e.target.value as TrialFormat)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none bg-white font-medium"
                  >
                    <option value="TRUC_TIEP">Trực tiếp tại trụ sở TAND</option>
                    <option value="TRUC_TUYEN">Trực tuyến (Kết nối các điểm cầu)</option>
                    <option value="LUU_DONG">Xét xử lưu động</option>
                  </select>
                </div>
              </div>

              {/* Presiding Judge & Clerk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Thẩm phán chủ tọa <span className="text-red-600">*</span></label>
                  <select
                    value={formJudge}
                    onChange={(e) => setFormJudge(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none bg-white font-medium"
                    required
                  >
                    {officials.filter(o => o.role === 'THAM_PHAN').map(o => (
                      <option key={o.id} value={o.name}>{o.name} ({o.roleName})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Thư ký phiên tòa <span className="text-red-600">*</span></label>
                  <select
                    value={formClerk}
                    onChange={(e) => setFormClerk(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none bg-white font-medium"
                    required
                  >
                    {officials.filter(o => o.role === 'THU_KY').map(o => (
                      <option key={o.id} value={o.name}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Procurator & Jurors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kiểm sát viên VKSND</label>
                  <input
                    type="text"
                    value={formProcurator}
                    onChange={(e) => setFormProcurator(e.target.value)}
                    placeholder="VD: Nguyễn Văn Thái (KSV sơ cấp)"
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Hội thẩm nhân dân (cách nhau bởi dấu phẩy)</label>
                  <input
                    type="text"
                    value={formJurors}
                    onChange={(e) => setFormJurors(e.target.value)}
                    placeholder="VD: Chu Ngọc Thạch, Trần Đình Trọng"
                    className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ghi chú & Chỉ đạo xét xử</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ghi chú về trích xuất bị cáo, yêu cầu an ninh, phòng xét xử..."
                  className="w-full p-2 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#991B1B] hover:bg-red-800 text-white rounded text-xs font-bold transition-colors shadow-2xs"
                >
                  Lưu & Đưa Vào Lịch Xét Xử
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Print Monthly Trial Schedule */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
          <div className="bg-white w-full max-w-4xl rounded-lg shadow-2xl overflow-hidden border border-slate-300 flex flex-col max-h-[92vh]">
            <div className="bg-[#991B1B] text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-base">Xem Trước Bản In Lịch Xét Xử Tháng {currentMonth + 1}/{currentYear}</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1 rounded hover:bg-red-800 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Preview Sheet */}
            <div className="p-6 overflow-y-auto bg-slate-50">
              <div className="bg-white p-8 rounded border border-slate-300 shadow-sm max-w-3xl mx-auto font-serif text-slate-900 leading-relaxed text-sm">
                {/* Official Judicial Header */}
                <div className="flex justify-between items-start pb-4 border-b border-slate-300">
                  <div className="text-center font-bold text-xs uppercase">
                    <div>{settings.courtName}</div>
                    <div className="text-[11px] font-normal underline">{settings.address}</div>
                  </div>
                  <div className="text-center font-bold text-xs uppercase">
                    <div>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                    <div className="text-[11px] font-bold">Độc lập - Tự do - Hạnh phúc</div>
                    <div className="text-[10px] font-normal italic mt-1">Đắk Lắk, ngày 16 tháng 10 năm 2026</div>
                  </div>
                </div>

                <div className="text-center py-5 space-y-1">
                  <h2 className="text-lg font-black uppercase text-slate-900">
                    LỊCH XÉT XỬ CÁC VỤ ÁN THÁNG {currentMonth + 1} NĂM {currentYear}
                  </h2>
                  <p className="text-xs italic text-slate-600">
                    (Ban hành kèm theo Kế hoạch công tác xét xử của Chánh án Tòa án nhân dân)
                  </p>
                </div>

                {/* Printable Table */}
                <table className="w-full text-xs border-collapse border border-slate-400 mt-2">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-center">
                      <th className="border border-slate-400 p-2 w-8">STT</th>
                      <th className="border border-slate-400 p-2 w-28">Thời gian & Địa điểm</th>
                      <th className="border border-slate-400 p-2 w-32">Số thụ lý / Loại án</th>
                      <th className="border border-slate-400 p-2">Tên vụ án & Đương sự</th>
                      <th className="border border-slate-400 p-2 w-32">Hội đồng xét xử</th>
                      <th className="border border-slate-400 p-2 w-24">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.map((t, idx) => (
                      <tr key={t.id} className="align-top hover:bg-slate-50">
                        <td className="border border-slate-400 p-1.5 text-center font-bold">{idx + 1}</td>
                        <td className="border border-slate-400 p-1.5">
                          <div className="font-bold">{formatDateVN(t.trialDate)}</div>
                          <div>{t.trialTime}</div>
                          <div className="text-[10px] text-slate-600 italic">{t.courtroom}</div>
                        </td>
                        <td className="border border-slate-400 p-1.5">
                          <div className="font-bold font-mono">{t.docketNumber}</div>
                          <div className="text-[10px]">{t.caseType}</div>
                          <div className="text-[10px] text-emerald-700 font-semibold">{t.trialFormat === 'TRUC_TUYEN' ? 'Xử trực tuyến' : 'Trực tiếp'}</div>
                        </td>
                        <td className="border border-slate-400 p-1.5">
                          <div className="font-bold">{t.caseTitle}</div>
                          <div className="text-[10px] text-slate-600 mt-0.5">{t.defendantsOrLitigants.join('; ')}</div>
                        </td>
                        <td className="border border-slate-400 p-1.5 text-[11px]">
                          <div><strong>Chủ tọa:</strong> {t.presidingJudge}</div>
                          <div><strong>Thư ký:</strong> {t.clerk}</div>
                          {t.jurors.length > 0 && <div className="text-[10px]"><strong>Hội thẩm:</strong> {t.jurors.join(', ')}</div>}
                        </td>
                        <td className="border border-slate-400 p-1.5 text-[10px] italic">
                          {t.statusName}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Signature Block */}
                <div className="mt-8 flex justify-between items-start text-xs text-center">
                  <div>
                    <div className="font-bold uppercase">NGƯỜI LẬP LỊCH</div>
                    <div className="italic text-[11px] text-slate-500">(Ký, ghi rõ họ tên)</div>
                    <div className="mt-14 font-bold">Trần Thanh Uyên</div>
                  </div>
                  <div>
                    <div className="font-bold uppercase">CHÁNH ÁN TÒA ÁN NHÂN DÂN</div>
                    <div className="italic text-[11px] text-slate-500">(Ký tên, đóng dấu)</div>
                    <div className="mt-14 font-bold">{settings.chiefJudgeName}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-1.5 bg-white text-slate-700 border border-slate-300 rounded text-xs font-semibold"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-1.5 bg-[#991B1B] hover:bg-red-800 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                <Printer className="w-4 h-4" />
                <span>Tiến hành In lịch xét xử</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
