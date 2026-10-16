import { UserAccount, UserRole, UserPermissions, CourtCase } from '../types/court';

export function getRoleBadge(role: UserRole): {
  label: string;
  shortLabel: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  description: string;
} {
  switch (role) {
    case 'CAN_BO_TONG_HOP':
      return {
        label: 'Cán bộ Tổng hợp & Thụ lý',
        shortLabel: 'Tổng hợp',
        bgClass: 'bg-blue-100',
        textClass: 'text-blue-900',
        borderClass: 'border-blue-300',
        description: 'Nhập thụ lý vụ án mới, tiếp nhận hồ sơ, lập và xuất báo cáo thống kê định kỳ.',
      };
    case 'LANH_DAO':
      return {
        label: 'Lãnh đạo Tòa án',
        shortLabel: 'Lãnh đạo',
        bgClass: 'bg-red-100',
        textClass: 'text-red-950 font-bold',
        borderClass: 'border-red-400',
        description: 'Chánh án / Phó Chánh án: phân công Thẩm phán, duyệt gia hạn thời hạn chuẩn bị xét xử, theo dõi tiến độ toàn viện.',
      };
    case 'THAM_PHAN':
      return {
        label: 'Thẩm phán giải quyết',
        shortLabel: 'Thẩm phán',
        bgClass: 'bg-amber-100',
        textClass: 'text-amber-900 font-bold',
        borderClass: 'border-amber-400',
        description: 'Chủ tọa phiên tòa: ban hành Quyết định đưa ra xét xử, bản án sơ thẩm, lệnh tạm giam theo Điều 278.',
      };
    case 'THU_KY':
      return {
        label: 'Thư ký giải quyết',
        shortLabel: 'Thư ký',
        bgClass: 'bg-teal-100',
        textClass: 'text-teal-900',
        borderClass: 'border-teal-300',
        description: 'Thư ký phiên tòa: phối hợp Thẩm phán, cập nhật biên bản, tống đạt, hồ sơ đương sự.',
      };
    case 'ADMIN':
      return {
        label: 'Quản trị viên Hệ thống',
        shortLabel: 'Quản trị',
        bgClass: 'bg-slate-800',
        textClass: 'text-amber-300 font-bold',
        borderClass: 'border-slate-700',
        description: 'Toàn quyền quản trị tài khoản, phân quyền, quản lý hệ thống biểu mẫu và cấu hình Tòa án.',
      };
    default:
      return {
        label: 'Người dùng',
        shortLabel: 'Người dùng',
        bgClass: 'bg-gray-100',
        textClass: 'text-gray-800',
        borderClass: 'border-gray-300',
        description: 'Tài khoản cán bộ Tòa án.',
      };
  }
}

export function hasPermission(
  user: UserAccount | null | undefined,
  permission: keyof UserPermissions
): boolean {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  return !!user.permissions[permission];
}

export function isCaseAssignedToUser(
  caseItem: CourtCase,
  user: UserAccount | null | undefined
): boolean {
  if (!user) return false;
  
  // Quản trị viên chỉ quản trị tài khoản, không tham gia thụ lý hay giải quyết án
  if (user.role === 'ADMIN') {
    return false;
  }

  // Lãnh đạo Tòa án và Cán bộ Tổng hợp có quyền giám sát, tổng hợp toàn bộ án
  if (user.role === 'LANH_DAO' || user.role === 'CAN_BO_TONG_HOP') {
    return true;
  }

  // Thẩm phán: CHỈ ĐƯỢC XEM & QUẢN LÝ VỤ ÁN ĐƯỢC PHÂN CÔNG CHO MÌNH
  if (user.role === 'THAM_PHAN') {
    const isIdMatch = Boolean(
      user.linkedOfficialId && 
      caseItem.assignedJudgeId && 
      caseItem.assignedJudgeId === user.linkedOfficialId
    );

    const judgeName = (caseItem.assignedJudgeName || '').trim().toLowerCase();
    const userFullName = (user.fullName || '').trim().toLowerCase();
    const userShortName = userFullName.split(' ').slice(-2).join(' ');

    const isNameMatch = Boolean(
      judgeName && (
        judgeName === userFullName ||
        judgeName.includes(userFullName) ||
        userFullName.includes(judgeName) ||
        (userShortName && judgeName.includes(userShortName))
      )
    );

    return isIdMatch || isNameMatch;
  }

  // Thư ký: CHỈ ĐƯỢC XEM & QUẢN LÝ VỤ ÁN MÌNH ĐƯỢC PHÂN CÔNG THƯ KÝ
  if (user.role === 'THU_KY') {
    const isIdMatch = Boolean(
      user.linkedOfficialId && 
      caseItem.assignedClerkId && 
      caseItem.assignedClerkId === user.linkedOfficialId
    );

    const clerkName = (caseItem.assignedClerkName || '').trim().toLowerCase();
    const userFullName = (user.fullName || '').trim().toLowerCase();
    const userShortName = userFullName.split(' ').slice(-2).join(' ');

    const isNameMatch = Boolean(
      clerkName && (
        clerkName === userFullName ||
        clerkName.includes(userFullName) ||
        userFullName.includes(clerkName) ||
        (userShortName && clerkName.includes(userShortName))
      )
    );

    return isIdMatch || isNameMatch;
  }

  return false;
}
