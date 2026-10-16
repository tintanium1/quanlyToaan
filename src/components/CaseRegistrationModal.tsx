import React, { useState } from 'react';
import { CaseType, CourtCase, CourtLevel, Litigant, LitigantRole } from '../types/court';
import { getCaseTypeName } from '../utils/courtUtils';
import { 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  FileText, 
  UserCheck, 
  ShieldAlert, 
  Scale, 
  Building, 
  Briefcase, 
  Heart, 
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Landmark,
  Layers,
  Users
} from 'lucide-react';

interface CaseRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCase: (newCase: CourtCase) => void;
  courtName: string;
}

export const CaseRegistrationModal: React.FC<CaseRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSaveCase,
  courtName,
}) => {
  if (!isOpen) return null;

  const todayStr = '2026-06-27'; // within app reference context

  const [caseType, setCaseType] = useState<CaseType>('HINH_SU');
  const [level, setLevel] = useState<CourtLevel>('SO_THAM');
  const [docketNumber, setDocketNumber] = useState('35/2026/TLST-HS');
  const [intakeDate, setIntakeDate] = useState(todayStr);
  const [title, setTitle] = useState('');
  const [statutoryDays, setStatutoryDays] = useState(30);

  // =========================================================================
  // 1. STATE DÀNH RIÊNG CHO ÁN HÌNH SỰ
  // =========================================================================
  const [crimeCategory, setCrimeCategory] = useState<'IT_NGHIEM_TRONG' | 'NGHIEM_TRONG' | 'RAT_NGHIEM_TRONG' | 'DAC_BIET_NGHIEM_TRONG'>('IT_NGHIEM_TRONG');
  const [prosecutionIndictmentNo, setProsecutionIndictmentNo] = useState('24/CT-VKS-KV12');
  const [prosecutionDate, setProsecutionDate] = useState('2026-06-20');
  const [prosecutionAuthority, setProsecutionAuthority] = useState('VKSND khu vực 12 - Tỉnh Đắk Lắk');
  const [prosecutorName, setProsecutorName] = useState('Kiểm sát viên Nguyễn Văn H');
  const [crimeArticle, setCrimeArticle] = useState('Tội trộm cắp tài sản theo điểm c khoản 2 Điều 173 Bộ luật Hình sự');
  const [seizedEvidence, setSeizedEvidence] = useState('01 xe mô tô Honda Wave, 01 điện thoại di động');
  const [hasDetention, setHasDetention] = useState(true);
  const [detentionWarrantNo, setDetentionWarrantNo] = useState('18/2026/LTG-TA');
  const [detentionDurationDays, setDetentionDurationDays] = useState(30);
  const [detentionFacility, setDetentionFacility] = useState('Trại tạm giam Công an tỉnh Đắk Lắk');

  // =========================================================================
  // 2. STATE DÀNH RIÊNG CHO ÁN DÂN SỰ
  // =========================================================================
  const [civilDisputeType, setCivilDisputeType] = useState('Tranh chấp quyền sử dụng đất và tài sản gắn liền với đất');
  const [civilPetitionDate, setCivilPetitionDate] = useState('2026-06-15');
  const [civilReceiptNo, setCivilReceiptNo] = useState('BL-009218');
  const [civilAdvanceFee, setCivilAdvanceFee] = useState('3.500.000 VNĐ');
  const [civilClaimValue, setCivilClaimValue] = useState('850.000.000 VNĐ');
  const [civilLandParcel, setCivilLandParcel] = useState('Thửa đất số 182, Tờ bản đồ số 15, diện tích 1.250 m2');
  const [civilLocalMediation, setCivilLocalMediation] = useState('Đã hòa giải cơ sở không thành tại UBND cấp xã');
  const [civilHasBPKCTT, setCivilHasBPKCTT] = useState(false);
  const [civilBpkcttType, setCivilBpkcttType] = useState('Kê biên tài sản đang tranh chấp');
  const [civilBpkcttDecisionNo, setCivilBpkcttDecisionNo] = useState('04/2026/QĐ-BPKCTT');

  // =========================================================================
  // 3. STATE DÀNH RIÊNG CHO ÁN HÔN NHÂN & GIA ĐÌNH
  // =========================================================================
  const [marriageRequestType, setMarriageRequestType] = useState('Đơn phương ly hôn và tranh chấp quyền nuôi con, chia tài sản');
  const [marriageCertNo, setMarriageCertNo] = useState('Số 45/ĐKKH ngày 12/03/2018 tại UBND phường Tân Lợi');
  const [marriageConflictReason, setMarriageConflictReason] = useState('Mâu thuẫn sâu sắc, bất đồng quan điểm sống, đã sống ly thân từ đầu năm 2026');
  const [marriageChildrenCount, setMarriageChildrenCount] = useState(2);
  const [marriageChildrenDetail, setMarriageChildrenDetail] = useState('02 con chung: Cháu Lê Minh Khang (SN: 2019), Cháu Lê Ngọc Hân (SN: 2022)');
  const [marriageChildCustodyRequest, setMarriageChildCustodyRequest] = useState('Nguyên đơn yêu cầu trực tiếp nuôi 02 con, yêu cầu bị đơn cấp dưỡng 4.000.000 đ/tháng');
  const [marriageCommonProperty, setMarriageCommonProperty] = useState('Nhà đất tại số 10 đường Nguyễn Tất Thành (trị giá ước tính 3.200.000.000 VNĐ)');
  const [marriageCommonDebt, setMarriageCommonDebt] = useState('Nợ Ngân hàng Vietcombank 450.000.000 đ');
  const [marriageReconciliationStatus, setMarriageReconciliationStatus] = useState('Hòa giải đoàn tụ không thành');

  // =========================================================================
  // 4. STATE DÀNH RIÊNG CHO ÁN KINH DOANH, THƯƠNG MẠI (KDTM)
  // =========================================================================
  const [kdtmContractType, setKdtmContractType] = useState('Tranh chấp hợp đồng tín dụng và xử lý tài sản bảo đảm thế chấp');
  const [kdtmContractNo, setKdtmContractNo] = useState('HĐTD số 88/2024/HĐTD-VCB ngày 15/04/2024');
  const [kdtmPrincipalDebt, setKdtmPrincipalDebt] = useState('12.500.000.000 VNĐ');
  const [kdtmInterestDebt, setKdtmInterestDebt] = useState('2.350.000.000 VNĐ');
  const [kdtmTotalClaim, setKdtmTotalClaim] = useState('14.850.000.000 VNĐ');
  const [kdtmCollateralInfo, setKdtmCollateralInfo] = useState('Toàn bộ nhà xưởng chế biến nông sản và quyền sử dụng đất tại KCN Hòa Phú');
  const [kdtmHasBPKCTT, setKdtmHasBPKCTT] = useState(false);
  const [kdtmBpkcttType, setKdtmBpkcttType] = useState('Phong tỏa tài khoản tại ngân hàng');
  const [kdtmBpkcttDecisionNo, setKdtmBpkcttDecisionNo] = useState('02/2026/QĐ-BPKCTT');

  // =========================================================================
  // 5. STATE DÀNH RIÊNG CHO ÁN LAO ĐỘNG
  // =========================================================================
  const [laborDisputeType, setLaborDisputeType] = useState('Tranh chấp về kỷ luật sa thải người lao động trái pháp luật');
  const [laborContractType, setLaborContractType] = useState('Hợp đồng lao động không xác định thời hạn (Ký ngày 01/06/2021)');
  const [laborJobPosition, setLaborJobPosition] = useState('Kỹ sư chế biến gỗ / Quản đốc xưởng');
  const [laborMonthlySalary, setLaborMonthlySalary] = useState('18.500.000 VNĐ/tháng');
  const [laborDismissalDecisionNo, setLaborDismissalDecisionNo] = useState('QĐ sa thải số 14/QĐ-GĐ ngày 05/05/2026 của Giám đốc Công ty');
  const [laborClaimCompensation, setLaborClaimCompensation] = useState('Hủy quyết định sa thải, bồi thường tiền lương những ngày không làm việc 74.000.000 đ, truy đóng BHXH 6 tháng');
  const [laborMediationRecord, setLaborMediationRecord] = useState('Biên bản hòa giải không thành số 03/BB-HGLĐ của Phòng LĐ-TB&XH');
  const [laborFeeExemption, setLaborFeeExemption] = useState(true);

  // =========================================================================
  // 6. STATE DÀNH RIÊNG CHO ÁN HÀNH CHÍNH
  // =========================================================================
  const [adminTargetType, setAdminTargetType] = useState<'QUYET_DINH' | 'HANH_VI'>('QUYET_DINH');
  const [adminDocDecisionNo, setAdminDocDecisionNo] = useState('Quyết định số 412/QĐ-UBND ngày 10/03/2026 của Chủ tịch UBND huyện Ea Kar');
  const [adminIssuingAuthority, setAdminIssuingAuthority] = useState('Chủ tịch UBND huyện Ea Kar, Tỉnh Đắk Lắk');
  const [adminField, setAdminField] = useState('Quản lý đất đai (Thu hồi đất và bồi thường, hỗ trợ tái định cư)');
  const [adminClaimContent, setAdminClaimContent] = useState('Yêu cầu Tòa án hủy toàn bộ Quyết định số 412/QĐ-UBND do thu hồi đất trái quy hoạch và giá bồi thường không đúng quy định');
  const [adminPriorComplaintStatus, setAdminPriorComplaintStatus] = useState('Đã khiếu nại lần 1 nhưng không được giải quyết thỏa đáng');

  // =========================================================================
  // DANH SÁCH ĐƯƠNG SỰ THEO VAI TRÒ CHUYÊN BIỆT
  // =========================================================================
  const [litigants, setLitigants] = useState<Litigant[]>([
    {
      id: 'lit-1',
      name: '',
      role: 'BI_CAN',
      roleName: 'Bị can/Bị cáo',
      birthYear: '',
      address: '',
      identityNo: '',
      detentionStatus: 'Tạm giam',
    },
  ]);

  // Handle case type change with specialized presets
  const handleCaseTypeChange = (type: CaseType) => {
    setCaseType(type);
    setTitle('');

    if (type === 'HINH_SU') {
      setDocketNumber(`35/2026/TLST-HS`);
      setStatutoryDays(30);
      setCrimeCategory('IT_NGHIEM_TRONG');
      setLitigants([
        {
          id: 'lit-1',
          name: '',
          role: 'BI_CAN',
          roleName: 'Bị can/Bị cáo',
          birthYear: '',
          address: '',
          identityNo: '',
          detentionStatus: 'Tạm giam',
        },
      ]);
    } else if (type === 'DAN_SU') {
      setDocketNumber(`120/2026/TLST-DS`);
      setStatutoryDays(120); // 4 tháng theo BLTTDS
      setLitigants([
        {
          id: 'lit-1',
          name: '',
          role: 'NGUYEN_DON',
          roleName: 'Nguyên đơn',
          birthYear: '',
          address: '',
        },
        {
          id: 'lit-2',
          name: '',
          role: 'BI_DON',
          roleName: 'Bị đơn',
          birthYear: '',
          address: '',
        },
      ]);
    } else if (type === 'HON_NHAN') {
      setDocketNumber(`55/2026/TLST-HNGĐ`);
      setStatutoryDays(120);
      setLitigants([
        {
          id: 'lit-1',
          name: '',
          role: 'NGUYEN_DON',
          roleName: 'Nguyên đơn (Vợ/Chồng)',
          birthYear: '',
          address: '',
        },
        {
          id: 'lit-2',
          name: '',
          role: 'BI_DON',
          roleName: 'Bị đơn (Chồng/Vợ)',
          birthYear: '',
          address: '',
        },
      ]);
    } else if (type === 'KDTM') {
      setDocketNumber(`24/2026/TLST-KDTM`);
      setStatutoryDays(60); // 2 tháng theo BLTTDS
      setLitigants([
        {
          id: 'lit-1',
          name: '',
          role: 'NGUYEN_DON',
          roleName: 'Nguyên đơn (Ngân hàng / Doanh nghiệp)',
          birthYear: '',
          address: '',
        },
        {
          id: 'lit-2',
          name: '',
          role: 'BI_DON',
          roleName: 'Bị đơn (Doanh nghiệp vay / vi phạm hợp đồng)',
          birthYear: '',
          address: '',
        },
      ]);
    } else if (type === 'LAO_DONG') {
      setDocketNumber(`09/2026/TLST-LĐ`);
      setStatutoryDays(60); // 2 tháng
      setLitigants([
        {
          id: 'lit-1',
          name: '',
          role: 'NGUYEN_DON',
          roleName: 'Người lao động (Nguyên đơn)',
          birthYear: '',
          address: '',
        },
        {
          id: 'lit-2',
          name: '',
          role: 'BI_DON',
          roleName: 'Người sử dụng lao động / Công ty (Bị đơn)',
          birthYear: '',
          address: '',
        },
      ]);
    } else if (type === 'HANH_CHINH') {
      setDocketNumber(`12/2026/TLST-HC`);
      setStatutoryDays(120); // 4 tháng theo Luật TTHC
      setLitigants([
        {
          id: 'lit-1',
          name: '',
          role: 'NGUOI_KHOI_KIEN',
          roleName: 'Người khởi kiện',
          birthYear: '',
          address: '',
        },
        {
          id: 'lit-2',
          name: '',
          role: 'NGUOI_BI_KIEN',
          roleName: 'Người bị kiện (Chủ tịch UBND / Cơ quan nhà nước)',
          birthYear: '',
          address: '',
        },
      ]);
    }
  };

  const handleCrimeCategoryChange = (cat: typeof crimeCategory) => {
    setCrimeCategory(cat);
    if (cat === 'IT_NGHIEM_TRONG') setStatutoryDays(30);
    else if (cat === 'NGHIEM_TRONG') setStatutoryDays(45);
    else if (cat === 'RAT_NGHIEM_TRONG') setStatutoryDays(45);
    else if (cat === 'DAC_BIET_NGHIEM_TRONG') setStatutoryDays(60);
  };

  const handleAddLitigant = () => {
    let defaultRole: LitigantRole = 'NGUOI_CO_QUYEN_NGHIA_VU';
    let roleLabel = 'Người có quyền lợi, nghĩa vụ liên quan';

    if (caseType === 'HINH_SU') {
      defaultRole = 'NGUOI_BI_HAI';
      roleLabel = 'Người bị hại';
    } else if (caseType === 'HANH_CHINH') {
      defaultRole = 'NGUOI_CO_QUYEN_NGHIA_VU';
      roleLabel = 'Người có quyền lợi, nghĩa vụ liên quan';
    }

    setLitigants([
      ...litigants,
      {
        id: 'lit-' + Date.now(),
        name: '',
        role: defaultRole,
        roleName: roleLabel,
        birthYear: '',
        address: '',
      },
    ]);
  };

  const handleRemoveLitigant = (id: string) => {
    if (litigants.length <= 1) return;
    setLitigants(litigants.filter((l) => l.id !== id));
  };

  const handleLitigantChange = (id: string, field: keyof Litigant, value: string) => {
    setLitigants(
      litigants.map((l) => {
        if (l.id === id) {
          return { ...l, [field]: value };
        }
        return l;
      })
    );
  };

  const calculateDeadline = (start: string, days: number): string => {
    const d = new Date(start);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let computedTitle = title.trim();
    let disputeOrCrimeSummary = '';
    let prosecutionDoc = '';

    // =========================================================================
    // DYNAMIC SUMMARY GENERATION PER CASE TYPE
    // =========================================================================
    if (caseType === 'HINH_SU') {
      const def = litigants.find((l) => l.role === 'BI_CAN' || l.role === 'BI_CAO');
      if (!computedTitle) {
        computedTitle = `${def?.name || 'Bị can'} - ${crimeArticle.slice(0, 50)}`;
      }
      disputeOrCrimeSummary = `${crimeArticle}. Phân loại: ${
        crimeCategory === 'IT_NGHIEM_TRONG'
          ? 'Tội ít nghiêm trọng'
          : crimeCategory === 'NGHIEM_TRONG'
          ? 'Tội nghiêm trọng'
          : crimeCategory === 'RAT_NGHIEM_TRONG'
          ? 'Tội rất nghiêm trọng'
          : 'Tội đặc biệt nghiêm trọng'
      }. Vật chứng: ${seizedEvidence}`;
      prosecutionDoc = `Cáo trạng số ${prosecutionIndictmentNo} ngày ${prosecutionDate} của ${prosecutionAuthority} (KSV: ${prosecutorName})`;
    } else if (caseType === 'DAN_SU') {
      const p1 = litigants[0]?.name || 'Nguyên đơn';
      const p2 = litigants[1]?.name || 'Bị đơn';
      if (!computedTitle) {
        computedTitle = `${p1} - ${p2}: ${civilDisputeType.slice(0, 45)}`;
      }
      disputeOrCrimeSummary = `${civilDisputeType}. Giá trị tranh chấp: ${civilClaimValue}. Đất/Tài sản: ${civilLandParcel}. Tình trạng hòa giải: ${civilLocalMediation}`;
      prosecutionDoc = `Đơn khởi kiện nộp ngày ${civilPetitionDate}; Biên lai tạm ứng án phí số ${civilReceiptNo} (${civilAdvanceFee})`;
    } else if (caseType === 'HON_NHAN') {
      const p1 = litigants[0]?.name || 'Vợ';
      const p2 = litigants[1]?.name || 'Chồng';
      if (!computedTitle) {
        computedTitle = `${p1} - ${p2}: ${marriageRequestType.slice(0, 45)}`;
      }
      disputeOrCrimeSummary = `${marriageRequestType}. ĐKKH: ${marriageCertNo}. Mâu thuẫn: ${marriageConflictReason}. Con chung: ${marriageChildrenDetail} (Yêu cầu nuôi con: ${marriageChildCustodyRequest}). Tài sản chung: ${marriageCommonProperty}. Nợ chung: ${marriageCommonDebt}`;
      prosecutionDoc = `Đơn yêu cầu / Đơn khởi kiện HNGĐ nộp ngày ${intakeDate}; Tình trạng hòa giải: ${marriageReconciliationStatus}`;
    } else if (caseType === 'KDTM') {
      const bank = litigants[0]?.name || 'Nguyên đơn';
      const company = litigants[1]?.name || 'Bị đơn';
      if (!computedTitle) {
        computedTitle = `${bank} kiện ${company} - ${kdtmContractType.slice(0, 40)}`;
      }
      disputeOrCrimeSummary = `${kdtmContractType}. Căn cứ: ${kdtmContractNo}. Tổng dư nợ yêu cầu: ${kdtmTotalClaim} (Nợ gốc: ${kdtmPrincipalDebt}, Nợ lãi: ${kdtmInterestDebt}). Tài sản thế chấp: ${kdtmCollateralInfo}`;
      prosecutionDoc = `Đơn khởi kiện kinh doanh thương mại nộp ngày ${intakeDate}; Hợp đồng tín dụng: ${kdtmContractNo}`;
    } else if (caseType === 'LAO_DONG') {
      const worker = litigants[0]?.name || 'Người lao động';
      const employer = litigants[1]?.name || 'Công ty';
      if (!computedTitle) {
        computedTitle = `${worker} - ${employer}: ${laborDisputeType.slice(0, 40)}`;
      }
      disputeOrCrimeSummary = `${laborDisputeType}. Hợp đồng: ${laborContractType}, vị trí: ${laborJobPosition}, lương: ${laborMonthlySalary}. QĐ sa thải: ${laborDismissalDecisionNo}. Yêu cầu bồi thường: ${laborClaimCompensation}. Hòa giải LĐ: ${laborMediationRecord}`;
      prosecutionDoc = `Đơn khởi kiện lao động ngày ${intakeDate}; ${laborFeeExemption ? 'Miễn nộp tạm ứng án phí theo NQ 326' : 'Đã nộp tạm ứng án phí'}`;
    } else if (caseType === 'HANH_CHINH') {
      const citizen = litigants[0]?.name || 'Người khởi kiện';
      if (!computedTitle) {
        computedTitle = `${citizen} khiếu kiện ${adminDocDecisionNo.slice(0, 50)}`;
      }
      disputeOrCrimeSummary = `${adminClaimContent}. Đối tượng khởi kiện: ${adminDocDecisionNo} do ${adminIssuingAuthority} ban hành. Lĩnh vực: ${adminField}. Tình trạng giải quyết khiếu nại: ${adminPriorComplaintStatus}`;
      prosecutionDoc = `Đơn khởi kiện hành chính nộp ngày ${intakeDate}; Biên lai tạm ứng án phí hành chính số BL-HC01`;
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const caseCode = `01.D01.126.12.${randomSuffix}`;
    const deadlineDate = calculateDeadline(intakeDate, statutoryDays);

    // Preventive measures construction
    const preventiveMeasures = [];
    if (caseType === 'HINH_SU' && hasDetention) {
      preventiveMeasures.push({
        id: 'pm-' + Date.now(),
        type: 'TAM_GIAM' as const,
        typeName: 'Lệnh tạm giam của Tòa án',
        targetPerson: litigants.find((l) => l.role === 'BI_CAN' || l.role === 'BI_CAO')?.name || computedTitle,
        decisionNo: detentionWarrantNo,
        issuedDate: intakeDate,
        effectiveFrom: intakeDate,
        effectiveTo: calculateDeadline(intakeDate, detentionDurationDays),
        issuingAuthority: courtName,
        status: 'HIEU_LUC' as const,
        notes: `Tạm giam tại: ${detentionFacility} trong giai đoạn chuẩn bị xét xử`,
      });
    } else if (caseType === 'DAN_SU' && civilHasBPKCTT) {
      preventiveMeasures.push({
        id: 'pm-' + Date.now(),
        type: 'KE_BIEN_TAI_SAN' as const,
        typeName: `BPKCTT: ${civilBpkcttType}`,
        targetPerson: litigants[1]?.name || 'Bị đơn',
        decisionNo: civilBpkcttDecisionNo,
        issuedDate: intakeDate,
        effectiveFrom: intakeDate,
        effectiveTo: calculateDeadline(intakeDate, 180),
        issuingAuthority: courtName,
        status: 'HIEU_LUC' as const,
        notes: `Áp dụng biện pháp khẩn cấp tạm thời trong án dân sự`,
      });
    } else if (caseType === 'KDTM' && kdtmHasBPKCTT) {
      preventiveMeasures.push({
        id: 'pm-' + Date.now(),
        type: 'PHONG_TOA_TAI_KHOAN' as const,
        typeName: `BPKCTT KDTM: ${kdtmBpkcttType}`,
        targetPerson: litigants[1]?.name || 'Bị đơn',
        decisionNo: kdtmBpkcttDecisionNo,
        issuedDate: intakeDate,
        effectiveFrom: intakeDate,
        effectiveTo: calculateDeadline(intakeDate, 180),
        issuingAuthority: courtName,
        status: 'HIEU_LUC' as const,
        notes: `Phong tỏa tài khoản/tài sản bảo đảm kinh doanh thương mại`,
      });
    }

    const newCase: CourtCase = {
      id: 'case-' + Date.now(),
      caseCode,
      docketNumber,
      intakeDate,
      courtName,
      caseType,
      level,
      title: computedTitle,
      disputeOrCrime: disputeOrCrimeSummary,
      prosecutionDocument: prosecutionDoc,
      status: 'MOI_THU_LY',
      statusName: 'Mới thụ lý (Chờ Chánh án phân công)',
      statutoryLimitMonths: statutoryDays,
      deadlineDate,
      assignedJurors: [],
      litigants: litigants.filter((l) => l.name.trim() !== ''),
      preventiveMeasures,
      decisions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveCase(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-300 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-[#991B1B] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="font-bold text-base md:text-lg tracking-wide uppercase">
                Nhập Thụ Lý Mới: {getCaseTypeName(caseType)}
              </h2>
              <div className="text-[11px] text-amber-200">
                Biểu mẫu hồ sơ chuyên biệt theo từng ngành luật tố tụng (Hình sự khác biệt Dân sự, Hôn nhân, KDTM, Lao động, Hành chính)
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

        {/* Case Type Segmented Selector */}
        <div className="bg-slate-100 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 font-bold text-slate-700 text-xs">
            <Layers className="w-4 h-4 text-red-700" />
            <span>Chọn loại vụ án:</span>
          </div>

          <div className="flex flex-wrap items-center bg-white border border-slate-300 rounded p-0.5">
            {[
              { type: 'HINH_SU' as CaseType, label: 'Án Hình sự', color: 'text-red-700' },
              { type: 'DAN_SU' as CaseType, label: 'Án Dân sự', color: 'text-blue-700' },
              { type: 'HON_NHAN' as CaseType, label: 'Hôn nhân & GĐ', color: 'text-pink-700' },
              { type: 'KDTM' as CaseType, label: 'Kinh doanh, TM', color: 'text-emerald-700' },
              { type: 'LAO_DONG' as CaseType, label: 'Án Lao động', color: 'text-orange-700' },
              { type: 'HANH_CHINH' as CaseType, label: 'Án Hành chính', color: 'text-purple-700' },
            ].map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => handleCaseTypeChange(item.type)}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  caseType === item.type
                    ? 'bg-red-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs bg-slate-50">
          {/* Section 1: Classification & Docket Registration */}
          <div className="bg-white border border-slate-300 rounded p-3.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase">
                <span className="w-2 h-2 rounded-full bg-red-700"></span>
                1. Thông tin Sổ thụ lý & Cấp xét xử ({getCaseTypeName(caseType)})
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Đơn vị: {courtName}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Cấp xét xử <span className="text-red-600">(*)</span>
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as CourtLevel)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
                >
                  <option value="SO_THAM">Sơ thẩm</option>
                  <option value="PHUC_THAM">Phúc thẩm</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Số thụ lý Tòa án <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="text"
                  value={docketNumber}
                  onChange={(e) => setDocketNumber(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono font-bold text-red-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Ngày vào sổ thụ lý <span className="text-red-600">(*)</span>
                </label>
                <input
                  type="date"
                  value={intakeDate}
                  onChange={(e) => setIntakeDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Hạn chuẩn bị xét xử <span className="text-red-600">(*)</span>
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={statutoryDays}
                    onChange={(e) => setStatutoryDays(Number(e.target.value))}
                    className="w-20 bg-white border border-slate-300 rounded px-2 py-1.5 font-mono text-center font-bold text-slate-900"
                  />
                  <span className="text-slate-500">ngày</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Tiêu đề vụ án / vụ việc <span className="text-slate-400 font-normal">(để trống sẽ tự động đặt tên theo đương sự và quan hệ tranh chấp)</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Nhập tiêu đề vụ án hoặc để hệ thống tự động sinh tên chuẩn..."
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: 100% RIÊNG BIỆT CHO TỪNG LOẠI ÁN                               */}
          {/* ========================================================================= */}

          {/* ----------------- 2.1: ÁN HÌNH SỰ ----------------- */}
          {caseType === 'HINH_SU' && (
            <div className="bg-white border-2 border-red-300 rounded p-4 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-red-200 pb-2">
                <h3 className="font-bold text-red-900 text-xs flex items-center gap-1.5 uppercase">
                  <ShieldAlert className="w-4 h-4 text-red-700" />
                  2. Thông tin Tố tụng Hình sự: Cáo trạng, Tội danh & Tạm giam
                </h3>
                <span className="bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded font-bold text-[11px]">
                  Bộ luật Tố tụng Hình sự 2015
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Số Cáo trạng truy tố <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={prosecutionIndictmentNo}
                    onChange={(e) => setProsecutionIndictmentNo(e.target.value)}
                    placeholder="VD: 24/CT-VKS-KV12"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-red-600 focus:outline-none font-semibold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Ngày ban hành Cáo trạng
                  </label>
                  <input
                    type="date"
                    value={prosecutionDate}
                    onChange={(e) => setProsecutionDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Viện kiểm sát truy tố <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={prosecutionAuthority}
                    onChange={(e) => setProsecutionAuthority(e.target.value)}
                    placeholder="VKSND khu vực 12 / VKSND tỉnh..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tội danh & Điều luật áp dụng truy tố <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={crimeArticle}
                    onChange={(e) => setCrimeArticle(e.target.value)}
                    placeholder="VD: Tội cướp tài sản theo điểm a khoản 2 Điều 168 Bộ luật Hình sự"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-red-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Phân loại mức độ tội phạm (Điều 9 BLHS) <span className="text-red-600">(*)</span>
                  </label>
                  <select
                    value={crimeCategory}
                    onChange={(e) => handleCrimeCategoryChange(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-medium text-slate-800 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  >
                    <option value="IT_NGHIEM_TRONG">Ít nghiêm trọng (Hạn chuẩn bị XX: 30 ngày)</option>
                    <option value="NGHIEM_TRONG">Nghiêm trọng (Hạn chuẩn bị XX: 45 ngày)</option>
                    <option value="RAT_NGHIEM_TRONG">Rất nghiêm trọng (Hạn chuẩn bị XX: 45 ngày)</option>
                    <option value="DAC_BIET_NGHIEM_TRONG">Đặc biệt nghiêm trọng (Hạn chuẩn bị XX: 60 ngày)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Kiểm sát viên thực hành quyền công tố
                  </label>
                  <input
                    type="text"
                    value={prosecutorName}
                    onChange={(e) => setProsecutorName(e.target.value)}
                    placeholder="Họ và tên Kiểm sát viên"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Vật chứng thu giữ kèm theo hồ sơ
                  </label>
                  <input
                    type="text"
                    value={seizedEvidence}
                    onChange={(e) => setSeizedEvidence(e.target.value)}
                    placeholder="VD: 01 xe máy, hung khí, tiền mặt, niêm phong ma túy..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Lệnh tạm giam trong giai đoạn chuẩn bị xét xử */}
              <div className="bg-red-50 border border-red-200 rounded p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-red-900 text-xs">
                    <input
                      type="checkbox"
                      checked={hasDetention}
                      onChange={(e) => setHasDetention(e.target.checked)}
                      className="rounded text-red-700 focus:ring-red-600 w-4 h-4"
                    />
                    <span>Áp dụng Lệnh tạm giam của Tòa án nhân dân trong giai đoạn chuẩn bị xét xử</span>
                  </label>
                  <span className="text-[10.5px] text-red-700 italic">
                    Hệ thống sẽ tự động giám sát đếm ngược và cảnh báo khi sắp hết hạn tạm giam
                  </span>
                </div>

                {hasDetention && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-red-200">
                    <div>
                      <label className="block text-slate-700 font-medium mb-0.5">Số Lệnh tạm giam</label>
                      <input
                        type="text"
                        value={detentionWarrantNo}
                        onChange={(e) => setDetentionWarrantNo(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-0.5">Thời hạn tạm giam (ngày)</label>
                      <input
                        type="number"
                        value={detentionDurationDays}
                        onChange={(e) => setDetentionDurationDays(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 font-mono text-xs font-bold text-red-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-0.5">Nơi giam giữ</label>
                      <input
                        type="text"
                        value={detentionFacility}
                        onChange={(e) => setDetentionFacility(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------- 2.2: ÁN DÂN SỰ ----------------- */}
          {caseType === 'DAN_SU' && (
            <div className="bg-white border-2 border-blue-300 rounded p-4 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                <h3 className="font-bold text-blue-900 text-xs flex items-center gap-1.5 uppercase">
                  <Building className="w-4 h-4 text-blue-700" />
                  2. Thông tin Thụ lý Dân sự: Đất đai, Hợp đồng vay & Án phí
                </h3>
                <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded font-bold text-[11px]">
                  Điều 26 Bộ luật Tố tụng Dân sự
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Quan hệ pháp luật tranh chấp Dân sự <span className="text-red-600">(*)</span>
                  </label>
                  <select
                    value={civilDisputeType}
                    onChange={(e) => setCivilDisputeType(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-blue-900 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="Tranh chấp quyền sử dụng đất và tài sản gắn liền với đất">Tranh chấp quyền sử dụng đất và tài sản gắn liền với đất</option>
                    <option value="Tranh chấp hợp đồng chuyển nhượng quyền sử dụng đất">Tranh chấp hợp đồng chuyển nhượng quyền sử dụng đất</option>
                    <option value="Tranh chấp hợp đồng vay tài sản">Tranh chấp hợp đồng vay tài sản</option>
                    <option value="Tranh chấp thừa kế tài sản">Tranh chấp thừa kế tài sản</option>
                    <option value="Tranh chấp bồi thường thiệt hại ngoài hợp đồng">Tranh chấp bồi thường thiệt hại ngoài hợp đồng</option>
                    <option value="Tranh chấp hợp đồng mua bán, thuê tài sản">Tranh chấp hợp đồng mua bán, thuê tài sản</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Giá trị tranh chấp (VNĐ) <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={civilClaimValue}
                    onChange={(e) => setCivilClaimValue(e.target.value)}
                    placeholder="VD: 850.000.000 VNĐ"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Ngày nộp đơn khởi kiện
                  </label>
                  <input
                    type="date"
                    value={civilPetitionDate}
                    onChange={(e) => setCivilPetitionDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Số Biên lai nộp tạm ứng án phí
                  </label>
                  <input
                    type="text"
                    value={civilReceiptNo}
                    onChange={(e) => setCivilReceiptNo(e.target.value)}
                    placeholder="VD: BL-009218"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Số tiền tạm ứng án phí đã nộp
                  </label>
                  <input
                    type="text"
                    value={civilAdvanceFee}
                    onChange={(e) => setCivilAdvanceFee(e.target.value)}
                    placeholder="VD: 15.000.000 VNĐ"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Thông tin Thửa đất / Tài sản tranh chấp cụ thể
                  </label>
                  <input
                    type="text"
                    value={civilLandParcel}
                    onChange={(e) => setCivilLandParcel(e.target.value)}
                    placeholder="Thửa đất số..., tờ bản đồ số..., diện tích m2..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tình trạng hòa giải tại cơ sở (UBND cấp xã)
                  </label>
                  <select
                    value={civilLocalMediation}
                    onChange={(e) => setCivilLocalMediation(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="Đã hòa giải cơ sở không thành tại UBND cấp xã">Đã hòa giải cơ sở không thành tại UBND cấp xã</option>
                    <option value="Không bắt buộc hòa giải cơ sở">Thuộc trường hợp không bắt buộc hòa giải cơ sở</option>
                    <option value="Chưa qua hòa giải cơ sở">Chưa qua hòa giải cơ sở</option>
                  </select>
                </div>
              </div>

              {/* BPKCTT Dân sự */}
              <div className="bg-blue-50 border border-blue-200 rounded p-2.5 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-blue-900 text-xs">
                  <input
                    type="checkbox"
                    checked={civilHasBPKCTT}
                    onChange={(e) => setCivilHasBPKCTT(e.target.checked)}
                    className="rounded text-blue-700 focus:ring-blue-600 w-4 h-4"
                  />
                  <span>Áp dụng Biện pháp khẩn cấp tạm thời (Kê biên tài sản, cấm thay đổi hiện trạng...)</span>
                </label>

                {civilHasBPKCTT && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-blue-200">
                    <select
                      value={civilBpkcttType}
                      onChange={(e) => setCivilBpkcttType(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    >
                      <option value="Kê biên tài sản đang tranh chấp">Kê biên tài sản đang tranh chấp</option>
                      <option value="Cấm thay đổi hiện trạng tài sản">Cấm thay đổi hiện trạng tài sản</option>
                      <option value="Cấm chuyển dịch quyền về tài sản">Cấm chuyển dịch quyền về tài sản</option>
                    </select>
                    <input
                      type="text"
                      value={civilBpkcttDecisionNo}
                      onChange={(e) => setCivilBpkcttDecisionNo(e.target.value)}
                      placeholder="Số Quyết định BPKCTT"
                      className="bg-white border border-slate-300 rounded px-2 py-1 font-mono text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------- 2.3: ÁN HÔN NHÂN & GIA ĐÌNH ----------------- */}
          {caseType === 'HON_NHAN' && (
            <div className="bg-white border-2 border-pink-300 rounded p-4 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-pink-200 pb-2">
                <h3 className="font-bold text-pink-900 text-xs flex items-center gap-1.5 uppercase">
                  <Heart className="w-4 h-4 text-pink-700" />
                  2. Thông tin Hôn nhân, Ly hôn, Quyền nuôi con & Chia tài sản chung
                </h3>
                <span className="bg-pink-50 text-pink-800 border border-pink-200 px-2 py-0.5 rounded font-bold text-[11px]">
                  Luật Hôn nhân & Gia đình 2014
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Yêu cầu khởi kiện Hôn nhân gia đình <span className="text-red-600">(*)</span>
                  </label>
                  <select
                    value={marriageRequestType}
                    onChange={(e) => setMarriageRequestType(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-pink-900 focus:ring-1 focus:ring-pink-600 focus:outline-none"
                  >
                    <option value="Đơn phương ly hôn và tranh chấp quyền nuôi con, chia tài sản">Đơn phương ly hôn, quyền nuôi con & chia tài sản chung</option>
                    <option value="Thuận tình ly hôn và thỏa thuận quyền nuôi con (Việc dân sự)">Thuận tình ly hôn & thỏa thuận nuôi con (Việc dân sự)</option>
                    <option value="Tranh chấp về thay đổi người trực tiếp nuôi con sau khi ly hôn">Tranh chấp thay đổi người trực tiếp nuôi con sau ly hôn</option>
                    <option value="Tranh chấp về chia tài sản chung của vợ chồng sau khi ly hôn">Tranh chấp chia tài sản chung của vợ chồng sau ly hôn</option>
                    <option value="Yêu cầu cấp dưỡng nuôi con">Yêu cầu cấp dưỡng nuôi con</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Giấy chứng nhận kết hôn <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={marriageCertNo}
                    onChange={(e) => setMarriageCertNo(e.target.value)}
                    placeholder="Số GCNKH, ngày, nơi đăng ký kết hôn..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-pink-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Mâu thuẫn hôn nhân & tình trạng chung sống
                </label>
                <input
                  type="text"
                  value={marriageConflictReason}
                  onChange={(e) => setMarriageConflictReason(e.target.value)}
                  placeholder="Mô tả nguyên nhân mâu thuẫn, bạo lực gia đình, ngoại tình, thời gian ly thân..."
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-pink-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Số con chung của vợ chồng
                  </label>
                  <input
                    type="number"
                    value={marriageChildrenCount}
                    onChange={(e) => setMarriageChildrenCount(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-center text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Họ tên & Năm sinh các con chung
                  </label>
                  <input
                    type="text"
                    value={marriageChildrenDetail}
                    onChange={(e) => setMarriageChildrenDetail(e.target.value)}
                    placeholder="Tên cháu, năm sinh, nguyện vọng của con từ đủ 7 tuổi..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-pink-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Yêu cầu về người trực tiếp nuôi con & Mức cấp dưỡng
                </label>
                <input
                  type="text"
                  value={marriageChildCustodyRequest}
                  onChange={(e) => setMarriageChildCustodyRequest(e.target.value)}
                  placeholder="VD: Giao con cho mẹ nuôi dưỡng; người cha cấp dưỡng 4.000.000 đ/tháng/con..."
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-pink-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tài sản chung vợ chồng yêu cầu phân chia (nếu có)
                  </label>
                  <input
                    type="text"
                    value={marriageCommonProperty}
                    onChange={(e) => setMarriageCommonProperty(e.target.value)}
                    placeholder="Nhà đất, xe ô tô, tài khoản tiết kiệm..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-pink-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nợ chung của vợ chồng yêu cầu giải quyết
                  </label>
                  <input
                    type="text"
                    value={marriageCommonDebt}
                    onChange={(e) => setMarriageCommonDebt(e.target.value)}
                    placeholder="Nợ ngân hàng, nợ cá nhân bên ngoài..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-pink-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ----------------- 2.4: ÁN KINH DOANH, THƯƠNG MẠI (KDTM) ----------------- */}
          {caseType === 'KDTM' && (
            <div className="bg-white border-2 border-emerald-300 rounded p-4 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <h3 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 uppercase">
                  <Briefcase className="w-4 h-4 text-emerald-700" />
                  2. Thông tin Kinh doanh Thương mại: Hợp đồng tín dụng, Nợ gốc/lãi & Tài sản thế chấp
                </h3>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[11px]">
                  Điều 30 Bộ luật Tố tụng Dân sự
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Quan hệ tranh chấp Kinh doanh, Thương mại <span className="text-red-600">(*)</span>
                  </label>
                  <select
                    value={kdtmContractType}
                    onChange={(e) => setKdtmContractType(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-emerald-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Tranh chấp hợp đồng tín dụng và xử lý tài sản bảo đảm thế chấp">Tranh chấp hợp đồng tín dụng & xử lý tài sản bảo đảm thế chấp</option>
                    <option value="Tranh chấp hợp đồng mua bán hàng hóa, cung ứng dịch vụ">Tranh chấp hợp đồng mua bán hàng hóa, cung ứng dịch vụ</option>
                    <option value="Tranh chấp giữa công ty với các thành viên công ty">Tranh chấp giữa công ty với thành viên (cổ phần, vốn góp)</option>
                    <option value="Tranh chấp hợp đồng thi công xây dựng công trình">Tranh chấp hợp đồng thi công xây dựng công trình</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Số Hợp đồng tín dụng / Kinh tế <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={kdtmContractNo}
                    onChange={(e) => setKdtmContractNo(e.target.value)}
                    placeholder="HĐ số, ngày ký kết..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-mono focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nợ gốc tranh chấp (VNĐ) <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={kdtmPrincipalDebt}
                    onChange={(e) => setKdtmPrincipalDebt(e.target.value)}
                    placeholder="VD: 10.000.000.000 VNĐ"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Nợ lãi trong hạn & quá hạn (VNĐ)
                  </label>
                  <input
                    type="text"
                    value={kdtmInterestDebt}
                    onChange={(e) => setKdtmInterestDebt(e.target.value)}
                    placeholder="VD: 1.500.000.000 VNĐ"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tổng giá trị khởi kiện (Gốc + Lãi)
                  </label>
                  <input
                    type="text"
                    value={kdtmTotalClaim}
                    onChange={(e) => setKdtmTotalClaim(e.target.value)}
                    placeholder="VD: 11.500.000.000 VNĐ"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-red-900 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tài sản bảo đảm thế chấp yêu cầu phát mại xử lý
                </label>
                <input
                  type="text"
                  value={kdtmCollateralInfo}
                  onChange={(e) => setKdtmCollateralInfo(e.target.value)}
                  placeholder="GCN QSDĐ, nhà xưởng, máy móc thiết bị, phương tiện vận tải..."
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* BPKCTT KDTM */}
              <div className="bg-emerald-50 border border-emerald-200 rounded p-2.5 space-y-1.5">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-900 text-xs">
                  <input
                    type="checkbox"
                    checked={kdtmHasBPKCTT}
                    onChange={(e) => setKdtmHasBPKCTT(e.target.checked)}
                    className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                  />
                  <span>Áp dụng Biện pháp khẩn cấp tạm thời (Phong tỏa tài khoản, kê biên tài sản...)</span>
                </label>

                {kdtmHasBPKCTT && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-200">
                    <select
                      value={kdtmBpkcttType}
                      onChange={(e) => setKdtmBpkcttType(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    >
                      <option value="Phong tỏa tài khoản tại ngân hàng">Phong tỏa tài khoản ngân hàng</option>
                      <option value="Kê biên tài sản bảo đảm">Kê biên tài sản bảo đảm</option>
                      <option value="Cấm thay đổi hiện trạng nhà xưởng">Cấm thay đổi hiện trạng nhà xưởng</option>
                    </select>
                    <input
                      type="text"
                      value={kdtmBpkcttDecisionNo}
                      onChange={(e) => setKdtmBpkcttDecisionNo(e.target.value)}
                      placeholder="Số QĐ BPKCTT"
                      className="bg-white border border-slate-300 rounded px-2 py-1 font-mono text-xs"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ----------------- 2.5: ÁN LAO ĐỘNG ----------------- */}
          {caseType === 'LAO_DONG' && (
            <div className="bg-white border-2 border-orange-300 rounded p-4 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-orange-200 pb-2">
                <h3 className="font-bold text-orange-900 text-xs flex items-center gap-1.5 uppercase">
                  <Briefcase className="w-4 h-4 text-orange-700" />
                  2. Thông tin Tranh chấp Lao động: Hợp đồng, Sa thải, Lương & BHXH
                </h3>
                <span className="bg-orange-50 text-orange-800 border border-orange-200 px-2 py-0.5 rounded font-bold text-[11px]">
                  Bộ luật Lao động 2019
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Quan hệ pháp luật tranh chấp Lao động <span className="text-red-600">(*)</span>
                  </label>
                  <select
                    value={laborDisputeType}
                    onChange={(e) => setLaborDisputeType(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-orange-900 focus:ring-1 focus:ring-orange-600 focus:outline-none"
                  >
                    <option value="Tranh chấp về kỷ luật sa thải người lao động trái pháp luật">Tranh chấp sa thải kỷ luật người lao động trái luật</option>
                    <option value="Tranh chấp về đơn phương chấm dứt hợp đồng lao động">Tranh chấp đơn phương chấm dứt hợp đồng lao động</option>
                    <option value="Tranh chấp về tiền lương, tiền thưởng và làm thêm giờ">Tranh chấp nợ tiền lương, thưởng, làm thêm giờ</option>
                    <option value="Tranh chấp về bảo hiểm xã hội và bảo hiểm y tế">Tranh chấp chưa đóng, chậm đóng BHXH</option>
                    <option value="Tranh chấp về bồi thường tai nạn lao động, bệnh nghề nghiệp">Tranh chấp bồi thường tai nạn lao động</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Mức tiền lương hàng tháng (VNĐ) <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={laborMonthlySalary}
                    onChange={(e) => setLaborMonthlySalary(e.target.value)}
                    placeholder="VD: 15.000.000 VNĐ/tháng"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:ring-1 focus:ring-orange-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Loại hợp đồng lao động đã ký kết
                  </label>
                  <input
                    type="text"
                    value={laborContractType}
                    onChange={(e) => setLaborContractType(e.target.value)}
                    placeholder="HĐLĐ không xác định thời hạn / 24 tháng..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-orange-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Vị trí / Chức danh công việc
                  </label>
                  <input
                    type="text"
                    value={laborJobPosition}
                    onChange={(e) => setLaborJobPosition(e.target.value)}
                    placeholder="VD: Quản đốc phân xưởng / Nhân viên kinh doanh..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-orange-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Quyết định sa thải / Chấm dứt HĐLĐ bị khiếu kiện
                  </label>
                  <input
                    type="text"
                    value={laborDismissalDecisionNo}
                    onChange={(e) => setLaborDismissalDecisionNo(e.target.value)}
                    placeholder="Số Quyết định sa thải, ngày ban hành..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-orange-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tình trạng hòa giải qua Hòa giải viên lao động
                  </label>
                  <input
                    type="text"
                    value={laborMediationRecord}
                    onChange={(e) => setLaborMediationRecord(e.target.value)}
                    placeholder="Số Biên bản hòa giải không thành của Phòng LĐ-TB&XH..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-orange-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nội dung yêu cầu bồi thường thiệt hại cụ thể của người lao động
                </label>
                <input
                  type="text"
                  value={laborClaimCompensation}
                  onChange={(e) => setLaborClaimCompensation(e.target.value)}
                  placeholder="Yêu cầu hủy quyết định sa thải, nhận trở lại làm việc, bồi thường tiền lương, truy đóng BHXH..."
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:ring-1 focus:ring-orange-600 focus:outline-none"
                />
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded p-2.5 flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-orange-950 text-xs">
                  <input
                    type="checkbox"
                    checked={laborFeeExemption}
                    onChange={(e) => setLaborFeeExemption(e.target.checked)}
                    className="rounded text-orange-700 focus:ring-orange-600 w-4 h-4"
                  />
                  <span>Người lao động được miễn nộp tiền tạm ứng án phí (Theo Nghị quyết 326/2016/UBTVQH14)</span>
                </label>
                <span className="text-[10.5px] text-orange-800 font-mono">Đã áp dụng miễn giảm</span>
              </div>
            </div>
          )}

          {/* ----------------- 2.6: ÁN HÀNH CHÍNH ----------------- */}
          {caseType === 'HANH_CHINH' && (
            <div className="bg-white border-2 border-purple-300 rounded p-4 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                <h3 className="font-bold text-purple-900 text-xs flex items-center gap-1.5 uppercase">
                  <Landmark className="w-4 h-4 text-purple-700" />
                  2. Thông tin Khiếu kiện Hành chính: Quyết định, Hành vi hành chính & Thẩm quyền
                </h3>
                <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded font-bold text-[11px]">
                  Luật Tố tụng Hành chính 2015
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Đối tượng khiếu kiện <span className="text-red-600">(*)</span>
                  </label>
                  <select
                    value={adminTargetType}
                    onChange={(e) => setAdminTargetType(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-bold text-purple-900 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  >
                    <option value="QUYET_DINH">Khiếu kiện Quyết định hành chính</option>
                    <option value="HANH_VI">Khiếu kiện Hành vi hành chính</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Lĩnh vực quản lý nhà nước bị khiếu kiện <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={adminField}
                    onChange={(e) => setAdminField(e.target.value)}
                    placeholder="VD: Quản lý đất đai (Thu hồi đất, bồi thường tái định cư), Xử phạt VPHC..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Số, ngày ban hành Quyết định hành chính bị khởi kiện <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={adminDocDecisionNo}
                    onChange={(e) => setAdminDocDecisionNo(e.target.value)}
                    placeholder="VD: Quyết định số 412/QĐ-UBND ngày 10/03/2026 của Chủ tịch UBND..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Người / Cơ quan có thẩm quyền ban hành quyết định <span className="text-red-600">(*)</span>
                  </label>
                  <input
                    type="text"
                    value={adminIssuingAuthority}
                    onChange={(e) => setAdminIssuingAuthority(e.target.value)}
                    placeholder="Chủ tịch UBND huyện / UBND tỉnh..."
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nội dung yêu cầu khởi kiện cụ thể của công dân / doanh nghiệp <span className="text-red-600">(*)</span>
                </label>
                <textarea
                  rows={2}
                  value={adminClaimContent}
                  onChange={(e) => setAdminClaimContent(e.target.value)}
                  placeholder="Yêu cầu Tòa án tuyên hủy Quyết định số 412/QĐ-UBND do thu hồi đất trái luật và buộc bồi thường theo đúng giá thị trường..."
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tình trạng giải quyết khiếu nại tại cơ quan hành chính
                </label>
                <select
                  value={adminPriorComplaintStatus}
                  onChange={(e) => setAdminPriorComplaintStatus(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                >
                  <option value="Đã khiếu nại lần 1 nhưng không được giải quyết thỏa đáng">Đã khiếu nại lần 1 nhưng không được giải quyết thỏa đáng</option>
                  <option value="Khởi kiện thẳng ra Tòa án nhân dân không qua khiếu nại">Khởi kiện thẳng ra Tòa án nhân dân (không qua thủ tục khiếu nại)</option>
                  <option value="Đã có quyết định giải quyết khiếu nại lần 2">Đã có quyết định giải quyết khiếu nại lần 2</option>
                </select>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 3: DANH SÁCH ĐƯƠNG SỰ / BỊ CÁO THEO TƯ CÁCH TỐ TỤNG CHUYÊN BIỆT    */}
          {/* ========================================================================= */}
          <div className="bg-white border border-slate-300 rounded p-3.5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase">
                <Users className="w-4 h-4 text-red-700" />
                3. Danh sách người tham gia tố tụng ({litigants.length} người)
              </h3>
              <button
                type="button"
                onClick={handleAddLitigant}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs border border-slate-300 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5 text-red-700" />
                <span>
                  {caseType === 'HINH_SU'
                    ? 'Thêm Người bị hại / Đương sự'
                    : caseType === 'HANH_CHINH'
                    ? 'Thêm Người có quyền lợi nghĩa vụ'
                    : 'Thêm Đương sự liên quan'}
                </span>
              </button>
            </div>

            <div className="space-y-3">
              {litigants.map((lit, idx) => (
                <div
                  key={lit.id}
                  className="bg-slate-50 border border-slate-200 rounded p-3 space-y-2.5 relative group hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-red-800 text-white flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800">
                        {caseType === 'HINH_SU'
                          ? idx === 0
                            ? 'Bị can / Bị cáo chính'
                            : 'Người tham gia tố tụng (Người bị hại, Đương sự)'
                          : caseType === 'HANH_CHINH'
                          ? idx === 0
                            ? 'Người khởi kiện'
                            : idx === 1
                            ? 'Người bị kiện (Chủ tịch UBND / Cơ quan NN)'
                            : 'Người có quyền lợi, nghĩa vụ liên quan'
                          : caseType === 'LAO_DONG'
                          ? idx === 0
                            ? 'Người lao động (Nguyên đơn)'
                            : idx === 1
                            ? 'Người sử dụng lao động (Bị đơn)'
                            : 'Người có quyền lợi nghĩa vụ liên quan'
                          : caseType === 'HON_NHAN'
                          ? idx === 0
                            ? 'Nguyên đơn (Vợ hoặc Chồng)'
                            : idx === 1
                            ? 'Bị đơn (Chồng hoặc Vợ)'
                            : 'Người có quyền lợi nghĩa vụ liên quan'
                          : caseType === 'KDTM'
                          ? idx === 0
                            ? 'Nguyên đơn (Ngân hàng / TCTD / Doanh nghiệp)'
                            : idx === 1
                            ? 'Bị đơn (Doanh nghiệp vay vốn / vi phạm HĐ)'
                            : 'Người có quyền lợi nghĩa vụ liên quan'
                          : idx === 0
                          ? 'Nguyên đơn'
                          : idx === 1
                          ? 'Bị đơn'
                          : 'Người có quyền lợi nghĩa vụ liên quan'}
                      </span>
                    </div>

                    {litigants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLitigant(lit.id)}
                        className="text-slate-400 hover:text-red-700 p-1 transition-colors"
                        title="Xóa người này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-slate-600 text-[11px] font-medium mb-1">
                        Họ và tên / Tên cơ quan, tổ chức <span className="text-red-600">(*)</span>
                      </label>
                      <input
                        type="text"
                        value={lit.name}
                        onChange={(e) => handleLitigantChange(lit.id, 'name', e.target.value)}
                        placeholder="Họ tên hoặc Tên tổ chức"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-red-600 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 text-[11px] font-medium mb-1">
                        Tư cách tham gia tố tụng <span className="text-red-600">(*)</span>
                      </label>
                      <select
                        value={lit.role}
                        onChange={(e) => {
                          const r = e.target.value as LitigantRole;
                          const roleNameMap: Record<string, string> = {
                            BI_CAN: 'Bị can/Bị cáo',
                            BI_CAO: 'Bị cáo',
                            NGUOI_BI_HAI: 'Người bị hại',
                            NGUYEN_DON: 'Nguyên đơn',
                            BI_DON: 'Bị đơn',
                            NGUOI_CO_QUYEN_NGHIA_VU: 'Người có quyền lợi, nghĩa vụ liên quan',
                            NGUOI_KHOI_KIEN: 'Người khởi kiện',
                            NGUOI_BI_KIEN: 'Người bị kiện',
                          };
                          handleLitigantChange(lit.id, 'role', r);
                          handleLitigantChange(lit.id, 'roleName', roleNameMap[r] || r);
                        }}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none font-medium"
                      >
                        {caseType === 'HINH_SU' ? (
                          <>
                            <option value="BI_CAN">Bị can / Bị cáo</option>
                            <option value="NGUOI_BI_HAI">Người bị hại</option>
                            <option value="NGUYEN_DON">Nguyên đơn dân sự trong án HS</option>
                            <option value="BI_DON">Bị đơn dân sự trong án HS</option>
                            <option value="NGUOI_CO_QUYEN_NGHIA_VU">Người có quyền lợi, nghĩa vụ liên quan</option>
                          </>
                        ) : caseType === 'HANH_CHINH' ? (
                          <>
                            <option value="NGUOI_KHOI_KIEN">Người khởi kiện</option>
                            <option value="NGUOI_BI_KIEN">Người bị kiện (Chủ tịch UBND / CQ)</option>
                            <option value="NGUOI_CO_QUYEN_NGHIA_VU">Người có quyền lợi, nghĩa vụ liên quan</option>
                          </>
                        ) : (
                          <>
                            <option value="NGUYEN_DON">Nguyên đơn</option>
                            <option value="BI_DON">Bị đơn</option>
                            <option value="NGUOI_CO_QUYEN_NGHIA_VU">Người có quyền lợi, nghĩa vụ liên quan</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 text-[11px] font-medium mb-1">
                        Năm sinh / Mã số thuế
                      </label>
                      <input
                        type="text"
                        value={lit.birthYear || ''}
                        onChange={(e) => handleLitigantChange(lit.id, 'birthYear', e.target.value)}
                        placeholder="VD: 1985 hoặc MST công ty"
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 text-[11px] font-medium mb-1">
                        Số CCCD / CMND / ĐKKD
                      </label>
                      <input
                        type="text"
                        value={lit.identityNo || ''}
                        onChange={(e) => handleLitigantChange(lit.id, 'identityNo', e.target.value)}
                        placeholder="Số CCCD 12 số"
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono focus:ring-1 focus:ring-red-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-600 text-[11px] font-medium mb-1">
                        Địa chỉ nơi cư trú / Trụ sở doanh nghiệp, cơ quan
                      </label>
                      <input
                        type="text"
                        value={lit.address || ''}
                        onChange={(e) => handleLitigantChange(lit.id, 'address', e.target.value)}
                        placeholder="Số nhà, đường, thôn/xã, phường/huyện, tỉnh/thành phố"
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                      />
                    </div>

                    {caseType === 'HINH_SU' && (lit.role === 'BI_CAN' || lit.role === 'BI_CAO') && (
                      <div>
                        <label className="block text-slate-600 text-[11px] font-medium mb-1">
                          Tình trạng giam giữ
                        </label>
                        <select
                          value={lit.detentionStatus || 'Tạm giam'}
                          onChange={(e) => handleLitigantChange(lit.id, 'detentionStatus', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none font-bold text-red-900"
                        >
                          <option value="Tạm giam">Đang bị tạm giam</option>
                          <option value="Tại ngoại">Tại ngoại (Cấm đi khỏi nơi cư trú)</option>
                          <option value="Đặt tiền bảo lãnh">Đặt tiền bảo đảm / Bảo lĩnh</option>
                          <option value="Đang bị truy nã">Đang bị truy nã</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Statutory Limits & Timing */}
          <div className="bg-amber-50/80 border border-amber-300 rounded p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-1">
              <div className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>Thời hạn giải quyết vụ án theo quy định tố tụng ({getCaseTypeName(caseType)}):</span>
              </div>
              <div className="text-[11px] text-amber-800">
                Thụ lý ngày: <strong>{intakeDate}</strong> → Hạn chót ban hành Quyết định xét xử / Quyết định đình chỉ:{' '}
                <strong className="text-red-900 underline font-mono text-xs">
                  {calculateDeadline(intakeDate, statutoryDays)}
                </strong>{' '}
                ({statutoryDays} ngày)
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-slate-700 font-semibold text-xs">Điều chỉnh hạn luật định:</label>
              <input
                type="number"
                value={statutoryDays}
                onChange={(e) => setStatutoryDays(Number(e.target.value))}
                className="w-20 bg-white border border-amber-300 rounded px-2 py-1 font-mono text-xs font-bold text-red-900 text-center"
              />
              <span className="text-slate-600 text-xs">ngày</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-300 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-[#991B1B] hover:bg-red-800 text-white rounded font-bold transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xác nhận nhập thụ lý vụ án</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
