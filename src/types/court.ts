export type CaseType = 
  | 'HINH_SU' 
  | 'DAN_SU' 
  | 'HON_NHAN' 
  | 'KDTM' 
  | 'HANH_CHINH' 
  | 'LAO_DONG' 
  | 'PHA_SAN';

export type CourtLevel = 'SO_THAM' | 'PHUC_THAM';

export type CaseStatus = 
  | 'MOI_THU_LY'
  | 'DA_PHAN_CONG'
  | 'DANG_CHUAN_BI_XET_XU'
  | 'GIA_HAN'
  | 'TAM_DINH_CHI'
  | 'DINH_CHI'
  | 'DA_CO_QUYET_DINH'
  | 'DA_TUYEN_AN'
  | 'DA_GIAI_QUYET';

export type PreventiveMeasureType = 
  | 'TAM_GIAM' 
  | 'BAT_TAM_GIAM' 
  | 'GIA_HAN_TAM_GIAM' 
  | 'CAM_DI_KHOI_NOI_CU_TRU' 
  | 'BAO_LINH' 
  | 'DAT_TIEN' 
  | 'KE_BIEN_TAI_SAN' 
  | 'PHONG_TOA_TAI_KHOAN';

export interface PreventiveMeasure {
  id: string;
  type: PreventiveMeasureType;
  typeName: string;
  targetPerson: string;
  decisionNo: string;
  issuedDate: string;
  effectiveFrom: string;
  effectiveTo: string;
  issuingAuthority: string;
  status: 'HIEU_LUC' | 'SAP_HET_HAN' | 'HET_HIEU_LUC' | 'HUY_BO';
  notes?: string;
}

export type LitigantRole = 
  | 'BI_CAN' 
  | 'BI_CAO' 
  | 'NGUYEN_DON' 
  | 'BI_DON' 
  | 'NGUOI_CO_QUYEN_NGHIA_VU' 
  | 'NGUOI_BI_HAI' 
  | 'NGUOI_KHOI_KIEN' 
  | 'NGUOI_BI_KIEN';

export interface Litigant {
  id: string;
  name: string;
  role: LitigantRole;
  roleName: string;
  birthYear?: string;
  address: string;
  identityNo?: string;
  detentionStatus?: string; // Đang bị tạm giam tại Trại giam số 1, v.v.
}

export interface Official {
  id: string;
  name: string;
  role: 'THAM_PHAN' | 'THU_KY' | 'HOI_THAM' | 'CHANH_AN' | 'PHO_CHANH_AN';
  roleName: string;
  title: string;
  phone?: string;
  email?: string;
  organization?: string; // Đối với Hội thẩm
  activeCasesCount: number;
}

export type DecisionType = 
  | 'QUYET_DINH_PHAN_CONG'
  | 'LENH_TAM_GIAM'
  | 'LENH_GIA_HAN_TAM_GIAM'
  | 'DUA_VU_AN_RA_XET_XU'
  | 'GIA_HAN_CHUAN_BI_XET_XU'
  | 'TAM_DINH_CHI'
  | 'DINH_CHI'
  | 'BAN_AN_SO_THAM'
  | 'CONG_NHAN_THOA_THUAN';

export interface TrialExtensionRecord {
  id: string;
  decisionNo: string;
  decisionDate: string;
  previousDeadline: string;
  newDeadline: string;
  extensionDays: number;
  reason: string;
  applicableLaw: string;
  signerName: string;
  signerRole: string;
  createdAt: string;
}

export interface DetentionExtensionRecord {
  id: string;
  targetPerson: string;
  decisionNo: string;
  decisionDate: string;
  previousEffectiveTo: string;
  newEffectiveTo: string;
  extensionDays: number;
  reason: string;
  detentionFacility?: string;
  signerName: string;
  signerRole: string;
  createdAt: string;
}

export interface CaseDecision {
  id: string;
  decisionType: DecisionType;
  decisionTypeName: string;
  decisionNo: string;
  issuedDate: string;
  effectiveDate: string;
  signerName: string;
  signerRole: string;
  summary: string;
  trialDate?: string;
  trialLocation?: string;
  attachmentName?: string;
}

export type TrialStatus = 'SAP_DIEN_RA' | 'DANG_DIEN_RA' | 'DA_TUYEN_AN' | 'HOAN_PHIEN_TOA' | 'DINH_CHI';
export type TrialFormat = 'TRUC_TIEP' | 'TRUC_TUYEN' | 'LUU_DONG';

export interface TrialSession {
  id: string;
  caseId: string;
  caseCode: string;
  docketNumber: string;
  caseTitle: string;
  caseType: CaseType;
  trialDate: string; // YYYY-MM-DD
  trialTime: string; // HH:mm
  courtroom: string;
  trialFormat: TrialFormat;
  trialType: string;
  presidingJudge: string;
  alternateJudge?: string;
  clerk: string;
  procurator?: string;
  jurors: string[];
  defendantsOrLitigants: string[];
  status: TrialStatus;
  statusName: string;
  summary?: string;
  notes?: string;
}

export interface CourtCase {
  id: string;
  caseCode: string; // Mã vụ việc: 01.D01.126.12.389458
  docketNumber: string; // Số thụ lý: 27/2026/TLST-HS
  intakeDate: string; // Ngày thụ lý: 09/06/2026
  courtName: string; // TAND khu vực 12 - Đắk Lắk
  caseType: CaseType;
  level: CourtLevel;
  title: string; // Châu Minh Ngọc - Giao cấu với trẻ em
  disputeOrCrime: string; // Tội danh hoặc Quan hệ pháp luật tranh chấp
  prosecutionDocument?: string; // Cáo trạng số...
  status: CaseStatus;
  statusName: string;
  
  // Thời hạn
  statutoryLimitMonths: number; // Hạn luật định chuẩn bị xét xử (tháng hoặc ngày)
  originalDeadlineDate?: string; // Hạn luật định gốc ban đầu trước khi gia hạn
  deadlineDate: string; // Ngày hết hạn chuẩn bị xét xử (đã tính gia hạn nếu có)
  trialExtensions?: TrialExtensionRecord[]; // Lịch sử các lần gia hạn thời hạn chuẩn bị xét xử
  detentionExtensions?: DetentionExtensionRecord[]; // Lịch sử các lần gia hạn thời hạn tạm giam
  
  // Phân công cán bộ
  assignedJudgeId?: string;
  assignedJudgeName?: string;
  assignedJudgeTitle?: string;
  alternateJudgeId?: string;
  alternateJudgeName?: string;
  
  assignedClerkId?: string;
  assignedClerkName?: string;
  alternateClerkId?: string;
  alternateClerkName?: string;
  
  assignedJurors: {
    id: string;
    name: string;
    organization?: string;
    isAlternate?: boolean;
  }[];
  assignmentDate?: string;
  assignmentSigner?: string;
  assignmentSignerRole?: string;
  
  // Đương sự / Bị can
  litigants: Litigant[];
  
  // Biện pháp ngăn chặn
  preventiveMeasures: PreventiveMeasure[];
  
  // Quyết định vụ án
  decisions: CaseDecision[];
  
  // Bản án / Kết quả
  judgmentResult?: {
    judgmentNo: string;
    judgmentDate: string;
    verdictSummary: string;
    courtFees?: string;
    appealStatus: 'CHUA_CO_KHANG_CAO' | 'CO_KHANG_CAO' | 'HIEU_LUC_PHAP_LUAT';
  };

  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourtUnitSettings {
  courtName: string;
  unitType?: 'TOA_AN' | 'VIEN_KIEM_SAT' | 'CO_QUAN_KHAC';
  unitTypeName?: string; // Tòa án nhân dân, Viện kiểm sát nhân dân, Cơ quan tư pháp khác
  courtDistrict: string;
  province: string;
  chiefJudgeName: string;
  chiefJudgeTitle?: string; // Chánh án / Viện trưởng / Thủ trưởng
  deputyChiefJudgeName: string;
  deputyChiefJudgeTitle?: string; // Phó Chánh án / Phó Viện trưởng
  address: string;
  phone: string;
  email?: string;
  website?: string;
  motto?: string; // Khẩu hiệu: 'Phụng công thủ pháp, chí công vô tư'
  sealNumber?: string;
}

export interface ResolutionTargets {
  hinhSuRate: number;        // Chỉ tiêu án Hình sự (%) (mặc định: 88%)
  danSuRate: number;         // Chỉ tiêu án Dân sự (%) (mặc định: 78%)
  honNhanRate: number;       // Chỉ tiêu Hôn nhân & Gia đình (%) (mặc định: 85%)
  kdtmRate: number;          // Chỉ tiêu Kinh doanh thương mại (%) (mặc định: 75%)
  hanhChinhRate: number;     // Chỉ tiêu án Hành chính (%) (mặc định: 60%)
  laoDongRate: number;       // Chỉ tiêu án Lao động (%) (mặc định: 80%)
  phaSanRate: number;        // Chỉ tiêu án Phá sản (%) (mặc định: 70%)
  overallTargetRate: number; // Chỉ tiêu giải quyết chung toàn cơ quan (%) (mặc định: 85%)
  judgeMonthlyQuota: number; // Định mức giải quyết (vụ/tháng/cán bộ) (mặc định: 5)
  maxOverdueRate: number;    // Tỷ lệ án quá hạn tối đa cho phép (%) (mặc định: 0%)
  maxSuspendedRate: number;  // Tỷ lệ án tạm đình chỉ tối đa (%) (mặc định: 5%)
  maxCancelModifyRate: number; // Tỷ lệ án bị hủy, sửa tối đa cho phép (%) (mặc định: 1.5%)
  evaluationYear: number;    // Năm công tác / thi đua (mặc định: 2026)
  targetTitle?: string;      // Tên đợt giao chỉ tiêu
}

export interface DocumentTemplate {
  id: string;
  code: string;
  name: string;
  category: 'ALL' | 'HINH_SU' | 'DAN_SU' | 'HON_NHAN' | 'KDTM' | 'HANH_CHINH' | 'LAO_DONG';
  applicableLaw: string;
  description: string;
  isSystem: boolean; // default court template
  templateBody: string; // contains {{PLACEHOLDER}} tags
  createdAt: string;
  updatedAt: string;
  formNumber?: string; // Ví dụ: '01-HS', '04-HS', '20-HS', '27-HS'
  stage?: string; // Giai đoạn: 'Phân công', 'Tạm giam & Ngăn chặn', 'Chuẩn bị xét xử', 'Phiên tòa & Nghị án', 'Bản án', 'Đình chỉ & Trả hồ sơ', 'Kháng cáo & Phúc thẩm', 'Giám đốc thẩm'
  resolution?: string; // Ví dụ: 'NQ 05/2017/NQ-HĐTP'
}

export type UserRole = 
  | 'CAN_BO_TONG_HOP' // 01 tài khoản để tổng hợp, nhập thụ lý ban đầu, báo cáo thống kê
  | 'LANH_DAO'        // 01 tài khoản lãnh đạo để phân công theo dõi tiến độ giải quyết
  | 'THAM_PHAN'       // Thẩm phán giải quyết để cập nhật kết quả, tiến độ giải quyết
  | 'THU_KY'          // Thư ký giải quyết để phối hợp cập nhật tiến độ, tống đạt
  | 'ADMIN';          // 01 tài khoản quản trị

export interface UserPermissions {
  canCreateCase: boolean;               // Nhập thụ lý ban đầu
  canEditCaseBasics: boolean;           // Sửa thông tin ban đầu vụ án, đương sự
  canAssignJudges: boolean;             // Phân công Thẩm phán, Thư ký, Hội thẩm
  canIssueTrialDecision: boolean;       // Ban hành QĐ đưa vụ án ra xét xử
  canIssueJudgment: boolean;            // Ban hành Bản án / Quyết định đình chỉ / công nhận thỏa thuận
  canExtendPreparation: boolean;        // Gia hạn thời hạn chuẩn bị xét xử
  canExtendDetention: boolean;          // Ban hành Lệnh gia hạn tạm giam
  canManagePreventiveMeasures: boolean; // Áp dụng / sửa biện pháp ngăn chặn & bảo đảm
  canViewAllReports: boolean;           // Xem & xuất toàn bộ báo cáo thống kê
  canManageCourtSettings: boolean;      // Cài đặt thông tin Tòa án
  canManageTemplates: boolean;          // Quản lý hệ thống biểu mẫu tố tụng
  canManageAccounts: boolean;           // Quản trị tài khoản & phân quyền
  canDeleteCase: boolean;               // Xóa hồ sơ vụ án khỏi hệ thống
}

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  email?: string;
  phone?: string;
  avatarColor?: string;
  linkedOfficialId?: string; // Gắn với Thẩm phán / Thư ký trong danh mục cán bộ
  permissions: UserPermissions;
  status: 'ACTIVE' | 'LOCKED';
  lastLogin?: string;
}

