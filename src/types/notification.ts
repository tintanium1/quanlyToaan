export type NotificationType = 
  | 'DEADLINE_URGENT'    // Sắp hết hạn chuẩn bị xét xử (< 7 ngày hoặc quá hạn)
  | 'DEADLINE_WARNING'   // Cảnh báo hạn chuẩn bị xét xử (7 - 15 ngày)
  | 'DETENTION_EXPIRING' // Biện pháp tạm giam sắp hết hạn (< 5 ngày)
  | 'JUDGE_ASSIGNED'     // Thẩm phán vừa được phân công vụ án mới
  | 'NEW_CASE'           // Vụ án mới được nhập thụ lý
  | 'DECISION_ISSUED';   // Quyết định tố tụng / Bản án mới được ban hành

export interface CourtNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  caseId?: string;
  caseDocket?: string;
  caseTitle?: string;
  judgeName?: string;
  daysRemaining?: number;
  timestamp: string; // ISO string
  isRead: boolean;
  actionLabel?: string;
}

export interface ActiveToast extends CourtNotification {
  duration?: number; // ms, default 6000
}
