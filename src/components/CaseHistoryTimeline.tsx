import React, { useState, useMemo } from 'react';
import { CourtCase, CaseDecision, PreventiveMeasure, TrialExtensionRecord, DetentionExtensionRecord } from '../types/court';
import { formatDateVN, formatDateFormalVN, getDaysRemaining, getCaseTypeName } from '../utils/courtUtils';
import { 
  Clock, 
  Calendar, 
  FileText, 
  UserCheck, 
  ShieldAlert, 
  Scale, 
  Gavel, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  ArrowDown, 
  ArrowUp, 
  Search, 
  Filter, 
  Printer, 
  Copy, 
  Check, 
  ChevronRight, 
  ChevronDown, 
  History,
  Building2,
  Users,
  ShieldCheck,
  FileCheck2,
  Bookmark
} from 'lucide-react';

export type TimelineEventType = 
  | 'INTAKE'          // Thụ lý vụ án
  | 'ASSIGNMENT'      // Phân công thẩm phán, thư ký, hội thẩm
  | 'PREVENTIVE'      // Áp dụng biện pháp ngăn chặn / Lệnh tạm giam
  | 'TRIAL_EXTENSION' // Gia hạn thời hạn chuẩn bị xét xử
  | 'DETENTION_EXT'   // Gia hạn thời hạn tạm giam
  | 'DECISION'        // Quyết định đưa vụ án ra xét xử / tạm đình chỉ / đình chỉ...
  | 'JUDGMENT'        // Tuyên án / Bản án sơ thẩm
  | 'STATUS_CHANGE';  // Chuyển giai đoạn tố tụng

export interface TimelineEventItem {
  id: string;
  date: string; // ISO date or YYYY-MM-DD
  time?: string;
  type: TimelineEventType;
  title: string;
  codeOrNo?: string;
  actor?: string;
  actorRole?: string;
  statusBadge?: {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
  };
  details: string;
  legalBasis?: string;
  extraInfo?: Record<string, string | number | undefined>;
  rawObject?: CaseDecision | PreventiveMeasure | TrialExtensionRecord | DetentionExtensionRecord | CourtCase;
  printableDocType?: string;
}

interface CaseHistoryTimelineProps {
  caseItem: CourtCase;
  onOpenPrintModal?: (c: CourtCase, docType?: string) => void;
  onSelectDecision?: (decision: CaseDecision) => void;
  onOpenAssignModal?: (c: CourtCase) => void;
  onOpenTrialExtension?: (c: CourtCase) => void;
  onOpenDetentionExtension?: (c: CourtCase, pm?: PreventiveMeasure) => void;
  compact?: boolean;
}

export const CaseHistoryTimeline: React.FC<CaseHistoryTimelineProps> = ({
  caseItem,
  onOpenPrintModal,
  onSelectDecision,
  onOpenAssignModal,
  onOpenTrialExtension,
  onOpenDetentionExtension,
  compact = false,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC'); // DESC: newest first, ASC: chronological
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  // 1. Build list of all chronological events from the case data
  const allEvents = useMemo<TimelineEventItem[]>(() => {
    const list: TimelineEventItem[] = [];

    // 1.1 Thụ lý vụ án (Case intake)
    if (caseItem.intakeDate) {
      list.push({
        id: `intake-${caseItem.id}`,
        date: caseItem.intakeDate,
        type: 'INTAKE',
        title: 'Thụ lý vụ án & Vào sổ thụ lý',
        codeOrNo: `Số thụ lý: ${caseItem.docketNumber}`,
        actor: caseItem.courtName,
        actorRole: 'Tòa án thụ lý',
        statusBadge: {
          label: 'ĐÃ THỤ LÝ',
          bgClass: 'bg-emerald-50',
          textClass: 'text-emerald-800',
          borderClass: 'border-emerald-300',
        },
        details: `Vụ án "${caseItem.title}" (${getCaseTypeName(caseItem.caseType)}) được chính thức thụ lý theo thẩm quyền. Thời hạn giải quyết luật định: ${caseItem.statutoryLimitMonths} tháng. Hạn chuẩn bị xét xử gốc: ${formatDateVN(caseItem.originalDeadlineDate || caseItem.deadlineDate)}.`,
        legalBasis: caseItem.caseType === 'HINH_SU' 
          ? 'Điều 276, Điều 277 Bộ luật Tố tụng hình sự 2015' 
          : 'Điều 191, Điều 203 Bộ luật Tố tụng dân sự 2015',
        extraInfo: {
          'Mã vụ việc': caseItem.caseCode,
          'Cấp xét xử': caseItem.level === 'SO_THAM' ? 'Sơ thẩm' : 'Phúc thẩm',
          'Tội danh / Tranh chấp': caseItem.disputeOrCrime,
          'Cáo trạng / Đơn khởi kiện': caseItem.prosecutionDocument || 'Hồ sơ thụ lý TAND',
          'Số lượng đương sự / bị can': `${caseItem.litigants?.length || 0} người`,
        },
        printableDocType: 'QUYET_DINH_THU_LY',
        rawObject: caseItem,
      });
    }

    // 1.2 Phân công Thẩm phán, Thư ký, Hội đồng xét xử
    if (caseItem.assignedJudgeName || caseItem.assignmentDate) {
      const assignmentDate = caseItem.assignmentDate || caseItem.intakeDate;
      const jurorNames = (caseItem.assignedJurors || [])
        .map((j) => `${j.name}${j.isAlternate ? ' (Dự khuyết)' : ''}`)
        .join(', ');

      list.push({
        id: `assignment-${caseItem.id}`,
        date: assignmentDate,
        type: 'ASSIGNMENT',
        title: 'Phân công Thẩm phán & Người tiến hành tố tụng',
        codeOrNo: caseItem.assignmentSigner ? `Ký duyệt bởi: ${caseItem.assignmentSigner}` : 'QĐ Phân công tố tụng',
        actor: caseItem.assignmentSigner || 'Chánh án TAND',
        actorRole: caseItem.assignmentSignerRole || 'Chánh án / Phó Chánh án',
        statusBadge: {
          label: 'ĐÃ PHÂN CÔNG',
          bgClass: 'bg-blue-50',
          textClass: 'text-blue-800',
          borderClass: 'border-blue-300',
        },
        details: `Phân công Thẩm phán ${caseItem.assignedJudgeName || 'Chưa rõ'} (${caseItem.assignedJudgeTitle || 'Thẩm phán sơ thẩm'}) làm Chủ tọa giải quyết vụ án; Thư ký: ${caseItem.assignedClerkName || 'Chưa phân công'}; ${caseItem.assignedJurors?.length ? `Hội thẩm nhân dân: ${jurorNames}` : ''}.`,
        legalBasis: caseItem.caseType === 'HINH_SU'
          ? 'Điều 44, Điều 45 Bộ luật Tố tụng hình sự 2015 (Mẫu 01-HS NQ 05/2017)'
          : 'Điều 47, Điều 48 Bộ luật Tố tụng dân sự 2015',
        extraInfo: {
          'Thẩm phán chủ tọa': caseItem.assignedJudgeName || 'Chưa phân công',
          'Thẩm phán dự khuyết': caseItem.alternateJudgeName || 'Không bố trí',
          'Thư ký phiên tòa': caseItem.assignedClerkName || 'Chưa phân công',
          'Thư ký dự khuyết': caseItem.alternateClerkName || 'Không bố trí',
          'Hội thẩm nhân dân': jurorNames || 'Chưa chỉ định',
        },
        printableDocType: 'QUYET_DINH_PHAN_CONG_TP',
        rawObject: caseItem,
      });
    }

    // 1.3 Biện pháp ngăn chặn & Tạm giam ban đầu
    (caseItem.preventiveMeasures || []).forEach((pm) => {
      const daysLeft = getDaysRemaining(pm.effectiveTo);
      list.push({
        id: `pm-${pm.id}`,
        date: pm.effectiveFrom,
        type: 'PREVENTIVE',
        title: `Áp dụng ${pm.typeName}`,
        codeOrNo: `Số Lệnh: ${pm.decisionNo}`,
        actor: pm.targetPerson,
        actorRole: 'Đối tượng áp dụng',
        statusBadge: {
          label: pm.status === 'SAP_HET_HAN' ? 'SẮP HẾT HẠN' : 'ĐANG HIỆU LỰC',
          bgClass: pm.status === 'SAP_HET_HAN' ? 'bg-amber-100' : 'bg-rose-50',
          textClass: pm.status === 'SAP_HET_HAN' ? 'text-amber-900' : 'text-rose-800',
          borderClass: pm.status === 'SAP_HET_HAN' ? 'border-amber-300' : 'border-rose-300',
        },
        details: `Áp dụng biện pháp ngăn chặn ${pm.typeName} đối với bị can/bị cáo ${pm.targetPerson}. Thời hạn hiệu lực từ ${formatDateVN(pm.effectiveFrom)} đến ${formatDateVN(pm.effectiveTo)} (${daysLeft.displayText}). ${pm.notes ? `Ghi chú: ${pm.notes}` : ''}`,
        legalBasis: 'Điều 119, Điều 278 Bộ luật Tố tụng hình sự 2015 (Mẫu 03-HS, 04-HS)',
        extraInfo: {
          'Người bị áp dụng': pm.targetPerson,
          'Ngày bắt đầu': formatDateVN(pm.effectiveFrom),
          'Ngày hết hạn': formatDateVN(pm.effectiveTo),
          'Thời hạn còn lại': daysLeft.displayText,
        },
        printableDocType: 'LENH_TAM_GIAM',
        rawObject: pm,
      });
    });

    // 1.4 Lịch sử gia hạn chuẩn bị xét xử (Trial extensions)
    (caseItem.trialExtensions || []).forEach((te) => {
      list.push({
        id: `trial-ext-${te.id}`,
        date: te.decisionDate,
        type: 'TRIAL_EXTENSION',
        title: 'Quyết định gia hạn thời hạn chuẩn bị xét xử',
        codeOrNo: `Số QĐ: ${te.decisionNo}`,
        actor: te.signerName,
        actorRole: te.signerRole || 'Chánh án / Phó Chánh án',
        statusBadge: {
          label: `GIA HẠN +${te.extensionDays} NGÀY`,
          bgClass: 'bg-amber-100',
          textClass: 'text-amber-900',
          borderClass: 'border-amber-300',
        },
        details: `Chánh án TAND quyết định gia hạn thời hạn chuẩn bị xét xử thêm ${te.extensionDays} ngày. Hạn mới ấn định đến ngày ${formatDateVN(te.newDeadline)} (hạn cũ: ${formatDateVN(te.previousDeadline)}). Lý do: ${te.reason}.`,
        legalBasis: te.applicableLaw || (caseItem.caseType === 'HINH_SU' ? 'Điều 277 BLTTHS 2015 (Mẫu số 42-HS)' : 'Điều 203 BLTTDS 2015'),
        extraInfo: {
          'Thời gian gia hạn': `+${te.extensionDays} ngày`,
          'Hạn cũ': formatDateVN(te.previousDeadline),
          'Hạn mới sau gia hạn': formatDateVN(te.newDeadline),
          'Lý do gia hạn': te.reason,
          'Người ký duyệt': `${te.signerName} (${te.signerRole})`,
        },
        printableDocType: 'QUYET_DINH_GIA_HAN_XX',
        rawObject: te,
      });
    });

    // 1.5 Lịch sử gia hạn thời hạn tạm giam (Detention extensions)
    (caseItem.detentionExtensions || []).forEach((de) => {
      list.push({
        id: `detention-ext-${de.id}`,
        date: de.decisionDate,
        type: 'DETENTION_EXT',
        title: `Lệnh gia hạn thời hạn tạm giam (${de.targetPerson})`,
        codeOrNo: `Số Lệnh: ${de.decisionNo}`,
        actor: de.signerName,
        actorRole: de.signerRole || 'Thẩm phán chủ tọa phiên tòa',
        statusBadge: {
          label: `GIA HẠN GIAM +${de.extensionDays} NGÀY`,
          bgClass: 'bg-red-100',
          textClass: 'text-red-900',
          borderClass: 'border-red-300',
        },
        details: `Gia hạn thời hạn tạm giam đối với ${de.targetPerson} thêm ${de.extensionDays} ngày để phục vụ xét xử. Hạn tạm giam mới đến hết ngày ${formatDateVN(de.newEffectiveTo)}. Cơ sở giam giữ: ${de.detentionFacility || 'Trại tạm giam Công an tỉnh'}.`,
        legalBasis: 'Điều 278 Bộ luật Tố tụng hình sự 2015 (Mẫu 05-HS NQ 05/2017)',
        extraInfo: {
          'Bị can / Bị cáo': de.targetPerson,
          'Thời gian gia hạn thêm': `+${de.extensionDays} ngày`,
          'Hạn tạm giam trước': formatDateVN(de.previousEffectiveTo),
          'Hạn tạm giam mới': formatDateVN(de.newEffectiveTo),
          'Cơ sở tạm giam': de.detentionFacility || 'Trại tạm giam',
          'Lý do gia hạn': de.reason,
        },
        printableDocType: 'LENH_GIA_HAN_TAM_GIAM',
        rawObject: de,
      });
    });

    // 1.6 Toàn bộ Quyết định tố tụng (Case Decisions)
    (caseItem.decisions || []).forEach((dec) => {
      let badgeLabel = 'QUYẾT ĐỊNH';
      let badgeBg = 'bg-slate-100';
      let badgeText = 'text-slate-800';
      let badgeBorder = 'border-slate-300';
      let printType = 'QUYET_DINH_XET_XU';

      if (dec.decisionType === 'DUA_VU_AN_RA_XET_XU') {
        badgeLabel = 'ĐƯA VỤ ÁN RA XÉT XỬ';
        badgeBg = 'bg-purple-50';
        badgeText = 'text-purple-800';
        badgeBorder = 'border-purple-300';
        printType = 'QUYET_DINH_XET_XU';
      } else if (dec.decisionType === 'TAM_DINH_CHI') {
        badgeLabel = 'TẠM ĐÌNH CHỈ';
        badgeBg = 'bg-amber-100';
        badgeText = 'text-amber-900';
        badgeBorder = 'border-amber-300';
        printType = 'QUYET_DINH_TAM_DINH_CHI';
      } else if (dec.decisionType === 'DINH_CHI') {
        badgeLabel = 'ĐÌNH CHỈ GIẢI QUYẾT';
        badgeBg = 'bg-rose-100';
        badgeText = 'text-rose-900';
        badgeBorder = 'border-rose-300';
        printType = 'QUYET_DINH_DINH_CHI';
      } else if (dec.decisionType === 'BAN_AN_SO_THAM') {
        badgeLabel = 'BẢN ÁN SƠ THẨM';
        badgeBg = 'bg-emerald-100';
        badgeText = 'text-emerald-900';
        badgeBorder = 'border-emerald-300';
        printType = 'BAN_AN_SO_THAM';
      }

      list.push({
        id: `dec-${dec.id}`,
        date: dec.issuedDate,
        type: 'DECISION',
        title: dec.decisionTypeName,
        codeOrNo: `Số: ${dec.decisionNo}`,
        actor: dec.signerName,
        actorRole: dec.signerRole,
        statusBadge: {
          label: badgeLabel,
          bgClass: badgeBg,
          textClass: badgeText,
          borderClass: badgeBorder,
        },
        details: dec.summary || `Ban hành ${dec.decisionTypeName} số ${dec.decisionNo} ngày ${formatDateVN(dec.issuedDate)}. Hiệu lực từ ${formatDateVN(dec.effectiveDate)}.`,
        legalBasis: caseItem.caseType === 'HINH_SU' 
          ? 'Bộ luật Tố tụng hình sự 2015 & Nghị quyết 05/2017/NQ-HĐTP'
          : 'Bộ luật Tố tụng dân sự 2015',
        extraInfo: {
          'Ngày ban hành': formatDateVN(dec.issuedDate),
          'Ngày có hiệu lực': formatDateVN(dec.effectiveDate),
          'Người ký': `${dec.signerName} (${dec.signerRole})`,
          ...(dec.trialDate ? { 'Thời gian mở phiên tòa': dec.trialDate } : {}),
          ...(dec.trialLocation ? { 'Địa điểm mở phiên tòa': dec.trialLocation } : {}),
        },
        printableDocType: printType,
        rawObject: dec,
      });
    });

    // 1.7 Bản án / Kết quả tuyên án sơ thẩm
    if (caseItem.judgmentResult && caseItem.judgmentResult.judgmentNo) {
      list.push({
        id: `judgment-${caseItem.id}`,
        date: caseItem.judgmentResult.judgmentDate,
        type: 'JUDGMENT',
        title: `Tuyên án Bản án sơ thẩm (${caseItem.judgmentResult.judgmentNo})`,
        codeOrNo: `Bản án số: ${caseItem.judgmentResult.judgmentNo}`,
        actor: caseItem.assignedJudgeName || 'Hội đồng xét xử sơ thẩm',
        actorRole: 'Chủ tọa phiên tòa',
        statusBadge: {
          label: caseItem.judgmentResult.appealStatus === 'HIEU_LUC_PHAP_LUAT'
            ? 'ĐÃ CÓ HIỆU LỰC'
            : caseItem.judgmentResult.appealStatus === 'CO_KHANG_CAO'
            ? 'CÓ KHÁNG CÁO'
            : 'ĐÃ TUYÊN ÁN',
          bgClass: 'bg-emerald-100',
          textClass: 'text-emerald-900',
          borderClass: 'border-emerald-300',
        },
        details: `Hội đồng xét xử tuyên án: ${caseItem.judgmentResult.verdictSummary}. Án phí: ${caseItem.judgmentResult.courtFees || 'Theo bản án'}.`,
        legalBasis: caseItem.caseType === 'HINH_SU' 
          ? 'Điều 260, Điều 261 Bộ luật Tố tụng hình sự 2015 (Mẫu 49-HS NQ 05/2017)'
          : 'Điều 266, Điều 267 Bộ luật Tố tụng dân sự 2015',
        extraInfo: {
          'Số bản án': caseItem.judgmentResult.judgmentNo,
          'Ngày tuyên án': formatDateVN(caseItem.judgmentResult.judgmentDate),
          'Án phí sơ thẩm': caseItem.judgmentResult.courtFees || 'Đã giải quyết',
          'Tình trạng kháng cáo/kháng nghị': caseItem.judgmentResult.appealStatus === 'HIEU_LUC_PHAP_LUAT'
            ? 'Đã có hiệu lực pháp luật'
            : caseItem.judgmentResult.appealStatus === 'CO_KHANG_CAO'
            ? 'Đang có đơn kháng cáo / kháng nghị'
            : 'Đang trong thời hạn kháng cáo luật định (15 ngày)',
        },
        printableDocType: 'BAN_AN_SO_THAM',
        rawObject: caseItem,
      });
    }

    // Sort by date
    list.sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateB - dateA; // Default desc
    });

    return list;
  }, [caseItem]);

  // Filter and Search
  const filteredEvents = useMemo(() => {
    let result = [...allEvents];

    if (filterType !== 'ALL') {
      result = result.filter((e) => e.type === filterType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((e) => 
        e.title.toLowerCase().includes(q) ||
        (e.codeOrNo && e.codeOrNo.toLowerCase().includes(q)) ||
        (e.actor && e.actor.toLowerCase().includes(q)) ||
        (e.details && e.details.toLowerCase().includes(q)) ||
        (e.legalBasis && e.legalBasis.toLowerCase().includes(q))
      );
    }

    if (sortOrder === 'ASC') {
      result.sort((a, b) => (new Date(a.date).getTime() || 0) - (new Date(b.date).getTime() || 0));
    } else {
      result.sort((a, b) => (new Date(b.date).getTime() || 0) - (new Date(a.date).getTime() || 0));
    }

    return result;
  }, [allEvents, filterType, searchQuery, sortOrder]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyEventInfo = (ev: TimelineEventItem) => {
    const text = `[${formatDateVN(ev.date)}] ${ev.title}\n${ev.codeOrNo ? `${ev.codeOrNo}\n` : ''}${ev.actor ? `Người thực hiện: ${ev.actor} (${ev.actorRole || ''})\n` : ''}Nội dung: ${ev.details}\n${ev.legalBasis ? `Căn cứ: ${ev.legalBasis}` : ''}`;
    navigator.clipboard.writeText(text);
    setCopiedId(ev.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getEventIcon = (type: TimelineEventType) => {
    switch (type) {
      case 'INTAKE':
        return <Building2 className="w-4 h-4 text-emerald-700" />;
      case 'ASSIGNMENT':
        return <UserCheck className="w-4 h-4 text-blue-700" />;
      case 'PREVENTIVE':
        return <ShieldAlert className="w-4 h-4 text-rose-700" />;
      case 'TRIAL_EXTENSION':
        return <Clock className="w-4 h-4 text-amber-700" />;
      case 'DETENTION_EXT':
        return <ShieldCheck className="w-4 h-4 text-red-700" />;
      case 'DECISION':
        return <Gavel className="w-4 h-4 text-purple-700" />;
      case 'JUDGMENT':
        return <Scale className="w-4 h-4 text-emerald-800" />;
      default:
        return <FileText className="w-4 h-4 text-slate-700" />;
    }
  };

  const getEventBorderClass = (type: TimelineEventType) => {
    switch (type) {
      case 'INTAKE':
        return 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-400';
      case 'ASSIGNMENT':
        return 'border-blue-200 bg-blue-50/40 hover:border-blue-400';
      case 'PREVENTIVE':
        return 'border-rose-200 bg-rose-50/40 hover:border-rose-400';
      case 'TRIAL_EXTENSION':
        return 'border-amber-200 bg-amber-50/40 hover:border-amber-400';
      case 'DETENTION_EXT':
        return 'border-red-200 bg-red-50/40 hover:border-red-400';
      case 'DECISION':
        return 'border-purple-200 bg-purple-50/40 hover:border-purple-400';
      case 'JUDGMENT':
        return 'border-emerald-300 bg-emerald-50/60 hover:border-emerald-500 shadow-xs';
      default:
        return 'border-slate-200 bg-white hover:border-slate-400';
    }
  };

  // Milestone stages for progress bar
  const milestones = [
    {
      id: 'm1',
      title: '1. Thụ lý hồ sơ',
      done: Boolean(caseItem.intakeDate),
      date: caseItem.intakeDate,
      desc: caseItem.docketNumber,
    },
    {
      id: 'm2',
      title: '2. Phân công TP',
      done: Boolean(caseItem.assignedJudgeName),
      date: caseItem.assignmentDate || caseItem.intakeDate,
      desc: caseItem.assignedJudgeName || 'Chưa phân công',
    },
    {
      id: 'm3',
      title: '3. Chuẩn bị xét xử',
      done: Boolean(caseItem.intakeDate),
      date: caseItem.deadlineDate,
      desc: (caseItem.trialExtensions && caseItem.trialExtensions.length > 0) ? `Gia hạn ${caseItem.trialExtensions.length} lần` : 'Thời hạn luật định',
    },
    {
      id: 'm4',
      title: '4. QĐ Đưa ra XX',
      done: caseItem.decisions.some((d) => d.decisionType === 'DUA_VU_AN_RA_XET_XU') || Boolean(caseItem.judgmentResult),
      date: caseItem.decisions.find((d) => d.decisionType === 'DUA_VU_AN_RA_XET_XU')?.issuedDate,
      desc: caseItem.decisions.find((d) => d.decisionType === 'DUA_VU_AN_RA_XET_XU')?.trialDate ? `Mở tòa: ${caseItem.decisions.find((d) => d.decisionType === 'DUA_VU_AN_RA_XET_XU')?.trialDate}` : 'Chưa có QĐ',
    },
    {
      id: 'm5',
      title: '5. Tuyên án / Xong',
      done: Boolean(caseItem.judgmentResult?.judgmentNo) || caseItem.status === 'DA_TUYEN_AN' || caseItem.status === 'DA_GIAI_QUYET',
      date: caseItem.judgmentResult?.judgmentDate,
      desc: caseItem.judgmentResult?.judgmentNo || 'Chưa tuyên án',
    },
  ];

  return (
    <div className="bg-white border border-slate-300 rounded shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="bg-[#991B1B] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-300 shrink-0" />
          <div>
            <h2 className="font-bold text-sm tracking-wide uppercase flex items-center gap-2">
              <span>Dòng Thời Gian Tố Tụng Vụ Án</span>
              <span className="text-xs bg-red-800 text-amber-200 px-2 py-0.5 rounded font-mono font-normal">
                {caseItem.docketNumber}
              </span>
            </h2>
            <p className="text-[11px] text-red-100 opacity-90 hidden sm:block">
              Toàn bộ tiến trình lịch sử: Thụ lý, phân công thẩm phán, gia hạn thời hạn, biện pháp ngăn chặn và các quyết định tố tụng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')}
            className="px-2.5 py-1 bg-red-800 hover:bg-red-700 text-white rounded font-medium flex items-center gap-1.5 transition-colors"
            title="Đảo chiều sắp xếp thời gian"
          >
            {sortOrder === 'DESC' ? (
              <>
                <ArrowDown className="w-3.5 h-3.5 text-amber-300" />
                <span>Mới nhất trước</span>
              </>
            ) : (
              <>
                <ArrowUp className="w-3.5 h-3.5 text-amber-300" />
                <span>Trình tự thụ lý (Cũ trước)</span>
              </>
            )}
          </button>

          {onOpenPrintModal && (
            <button
              onClick={() => onOpenPrintModal(caseItem, 'TRICH_LUC_HO_SO')}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded flex items-center gap-1.5 transition-colors shadow-2xs"
              title="In trích lục lịch sử tố tụng vụ án"
            >
              <Printer className="w-3.5 h-3.5 text-amber-950" />
              <span>In trích lục</span>
            </button>
          )}
        </div>
      </div>

      {/* Visual Workflow Milestones */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            Cột mốc tiến trình tố tụng chuẩn (Theo BLTTHS / BLTTDS):
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            Tổng cộng: <strong className="text-slate-800">{allEvents.length}</strong> sự kiện đã ghi nhận
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {milestones.map((m, idx) => (
            <div
              key={m.id}
              className={`p-2 rounded border text-xs transition-all relative ${
                m.done
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-400 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-[11.5px] truncate">{m.title}</span>
                {m.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0 flex items-center justify-center text-[9px] text-slate-400 font-bold">
                    {idx + 1}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-600 truncate font-mono">
                {m.date ? formatDateVN(m.date) : '—'}
              </div>
              <div className="text-[10.5px] text-slate-500 truncate mt-0.5">
                {m.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-slate-700 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Lọc loại sự kiện:
          </span>

          <button
            onClick={() => setFilterType('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              filterType === 'ALL'
                ? 'bg-red-800 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Tất cả ({allEvents.length})
          </button>

          <button
            onClick={() => setFilterType('DECISION')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              filterType === 'DECISION'
                ? 'bg-purple-700 text-white font-semibold'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200'
            }`}
          >
            Quyết định tố tụng ({allEvents.filter((e) => e.type === 'DECISION').length})
          </button>

          <button
            onClick={() => setFilterType('ASSIGNMENT')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              filterType === 'ASSIGNMENT'
                ? 'bg-blue-700 text-white font-semibold'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200'
            }`}
          >
            Phân công cán bộ ({allEvents.filter((e) => e.type === 'ASSIGNMENT').length})
          </button>

          <button
            onClick={() => setFilterType('PREVENTIVE')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              filterType === 'PREVENTIVE'
                ? 'bg-rose-700 text-white font-semibold'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
            }`}
          >
            Biện pháp ngăn chặn ({allEvents.filter((e) => e.type === 'PREVENTIVE').length})
          </button>

          <button
            onClick={() => setFilterType('TRIAL_EXTENSION')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              filterType === 'TRIAL_EXTENSION'
                ? 'bg-amber-700 text-white font-semibold'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
            }`}
          >
            Gia hạn thời hạn ({allEvents.filter((e) => e.type === 'TRIAL_EXTENSION' || e.type === 'DETENTION_EXT').length})
          </button>

          <button
            onClick={() => setFilterType('JUDGMENT')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              filterType === 'JUDGMENT'
                ? 'bg-emerald-700 text-white font-semibold'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
            }`}
          >
            Bản án / Tuyên án ({allEvents.filter((e) => e.type === 'JUDGMENT').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo số QĐ, người ký, nội dung..."
            className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1 text-xs focus:ring-1 focus:ring-red-600 focus:bg-white focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Main Chronological Timeline Body */}
      <div className="p-4 sm:p-6 bg-slate-50/60 max-h-[700px] overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded border border-dashed border-slate-300 p-6 space-y-2">
            <History className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-700 text-sm">Không tìm thấy sự kiện tố tụng phù hợp</h4>
            <p className="text-slate-500 text-xs">
              Thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm để xem đầy đủ dòng thời gian của vụ án.
            </p>
            <button
              onClick={() => {
                setFilterType('ALL');
                setSearchQuery('');
              }}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
            >
              Xem toàn bộ sự kiện
            </button>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {filteredEvents.map((ev, index) => {
              const isExpanded = expandedItems[ev.id] ?? false;
              const isCopied = copiedId === ev.id;

              return (
                <div key={ev.id} className="relative group">
                  {/* Timeline Node Icon */}
                  <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white border-2 border-slate-300 group-hover:border-red-600 shadow-xs flex items-center justify-center transition-colors z-10">
                    {getEventIcon(ev.type)}
                  </div>

                  {/* Timeline Card */}
                  <div className={`border rounded-lg p-3.5 sm:p-4 transition-all shadow-2xs ${getEventBorderClass(ev.type)}`}>
                    {/* Top Row: Date, Badge, and Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-200/80">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs text-red-900 bg-red-50 border border-red-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-red-700" />
                          {formatDateVN(ev.date)}
                        </span>

                        {ev.statusBadge && (
                          <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold border ${ev.statusBadge.bgClass} ${ev.statusBadge.textClass} ${ev.statusBadge.borderClass}`}>
                            {ev.statusBadge.label}
                          </span>
                        )}

                        {ev.codeOrNo && (
                          <span className="font-mono text-[11px] text-slate-700 font-semibold bg-white px-2 py-0.5 rounded border border-slate-200">
                            {ev.codeOrNo}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs">
                        {/* Copy button */}
                        <button
                          onClick={() => copyEventInfo(ev)}
                          className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded font-medium text-[11px] flex items-center gap-1 transition-colors"
                          title="Sao chép nội dung sự kiện tố tụng này"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>

                        {/* Print / Generate Document button */}
                        {onOpenPrintModal && ev.printableDocType && (
                          <button
                            onClick={() => onOpenPrintModal(caseItem, ev.printableDocType)}
                            className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                            title="Mở trình xuất văn bản / in biểu mẫu chuẩn cho sự kiện này"
                          >
                            <Printer className="w-3 h-3 text-amber-800" />
                            <span>In văn bản</span>
                          </button>
                        )}

                        {/* Expand / Collapse toggle */}
                        <button
                          onClick={() => toggleExpand(ev.id)}
                          className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-200/60 transition-colors"
                          title={isExpanded ? 'Thu gọn chi tiết' : 'Mở rộng chi tiết'}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Middle: Title & Actor */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {ev.title}
                        </h3>
                        {ev.actor && (
                          <span className="text-slate-600 text-xs flex items-center gap-1">
                            <span className="text-slate-400">Người ký/Chủ trì:</span>
                            <strong className="text-slate-800">{ev.actor}</strong>
                            {ev.actorRole && (
                              <span className="text-slate-500 font-normal">({ev.actorRole})</span>
                            )}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-700 text-xs leading-relaxed">
                        {ev.details}
                      </p>
                    </div>

                    {/* Legal Basis */}
                    {ev.legalBasis && (
                      <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5 bg-white/70 px-2.5 py-1 rounded border border-slate-200/70">
                        <FileCheck2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Căn cứ pháp lý: <em className="text-slate-700 font-medium not-italic">{ev.legalBasis}</em></span>
                      </div>
                    )}

                    {/* Expanded Extra Info Key-Value Table */}
                    {isExpanded && ev.extraInfo && (
                      <div className="mt-3 pt-3 border-t border-slate-200/80 bg-white/90 rounded p-3 text-xs space-y-2">
                        <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wide flex items-center gap-1.5">
                          <Bookmark className="w-3 h-3 text-red-700" />
                          Thông tin chi tiết hồ sơ tố tụng:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {Object.entries(ev.extraInfo).map(([key, val]) => (
                            <div key={key} className="bg-slate-50 p-2 rounded border border-slate-200/80">
                              <span className="text-slate-500 text-[10.5px] block font-medium">{key}:</span>
                              <span className="font-semibold text-slate-900 text-xs block break-words">{String(val)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Direct action triggers if applicable */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                          {ev.type === 'ASSIGNMENT' && onOpenAssignModal && (
                            <button
                              onClick={() => onOpenAssignModal(caseItem)}
                              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <UserCheck className="w-3 h-3 text-blue-700" />
                              <span>Điều chỉnh phân công Thẩm phán</span>
                            </button>
                          )}

                          {ev.type === 'TRIAL_EXTENSION' && onOpenTrialExtension && (
                            <button
                              onClick={() => onOpenTrialExtension(caseItem)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <Clock className="w-3 h-3 text-amber-700" />
                              <span>Gia hạn chuẩn bị xét xử tiếp</span>
                            </button>
                          )}

                          {ev.type === 'PREVENTIVE' && onOpenDetentionExtension && (
                            <button
                              onClick={() => onOpenDetentionExtension(caseItem, ev.rawObject as PreventiveMeasure)}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <ShieldAlert className="w-3 h-3 text-rose-700" />
                              <span>Gia hạn lệnh tạm giam này</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-100 border-t border-slate-200 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Dòng thời gian phản ánh liên tục mọi quyết định, phân công cán bộ và mốc tố tụng theo thời gian thực.</span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          Cập nhật lần cuối: {formatDateVN(caseItem.updatedAt || caseItem.createdAt)}
        </div>
      </div>
    </div>
  );
};
