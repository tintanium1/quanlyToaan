import React, { useState } from 'react';
import { CourtEmblem } from './CourtEmblem';
import { CourtCase, CourtUnitSettings, UserAccount } from '../types/court';
import { CourtNotification } from '../types/notification';
import { NotificationCenterDropdown } from './NotificationCenterDropdown';
import { formatDateVN } from '../utils/courtUtils';
import { getRoleBadge } from '../utils/rbacUtils';
import { 
  Search, 
  PlusCircle, 
  Printer, 
  FileText, 
  Send, 
  PinOff, 
  ChevronDown, 
  User, 
  BarChart3, 
  ShieldAlert, 
  Users, 
  Settings,
  Scale,
  RotateCcw,
  BookOpen,
  Key,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  LogOut,
  Bell,
  Sliders,
  Target,
  Building,
  Edit3,
  Calendar,
  FileUp
} from 'lucide-react';

export type NavTab = 
  | 'TRANG_CHU'
  | 'BAO_CAO'
  | 'LICH_XET_XU'
  | 'HINH_SU'
  | 'DAN_SU'
  | 'HON_NHAN'
  | 'KDTM'
  | 'LAO_DONG'
  | 'HANH_CHINH'
  | 'PHA_SAN'
  | 'BIEN_PHAP_NGAN_CHAN'
  | 'CAN_BO'
  | 'QUAN_TRI';

interface CourtHeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pinnedCase: CourtCase | null;
  onUnpinCase: () => void;
  onOpenNewCaseModal: () => void;
  onOpenCaseDetail: (caseItem: CourtCase) => void;
  onOpenPrintModal: (caseItem: CourtCase, docType?: string) => void;
  onOpenTemplateManager?: () => void;
  onOpenWordUploader?: () => void;
  onOpenCustomization?: (initialTab?: 'UNIT' | 'USER' | 'TARGETS' | 'TEMPLATES' | 'BACKUP') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  settings: CourtUnitSettings;
  onOpenSettings: () => void;
  onResetData: () => void;
  currentUser: UserAccount;
  accounts: UserAccount[];
  onSelectAccount: (user: UserAccount) => void;
  onOpenAccountSwitcher: () => void;
  onOpenAccountManagement?: () => void;
  onLogout: () => void;
  notifications?: CourtNotification[];
  onMarkAllNotificationsAsRead?: () => void;
  onClearAllNotifications?: () => void;
  onSelectNotification?: (notif: CourtNotification) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onSimulateNotification?: (type: 'DEADLINE' | 'JUDGE' | 'DETENTION') => void;
}

export const CourtHeader: React.FC<CourtHeaderProps> = ({
  currentTab,
  onSelectTab,
  pinnedCase,
  onUnpinCase,
  onOpenNewCaseModal,
  onOpenCaseDetail,
  onOpenPrintModal,
  onOpenTemplateManager,
  onOpenWordUploader,
  onOpenCustomization,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  settings,
  onOpenSettings,
  onResetData,
  currentUser,
  accounts,
  onSelectAccount,
  onOpenAccountSwitcher,
  onOpenAccountManagement,
  onLogout,
  notifications = [],
  onMarkAllNotificationsAsRead,
  onClearAllNotifications,
  onSelectNotification,
  soundEnabled = true,
  onToggleSound,
  onSimulateNotification,
}) => {
  const [showPrintDropdown, setShowPrintDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const roleBadge = getRoleBadge(currentUser.role);

  return (
    <header className="bg-white border-b border-neutral-300 shadow-sm sticky top-0 z-40">
      {/* Top Banner (Emblem + Title + User Profile) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFFBEB] border-b border-amber-200/80 px-4 py-2.5 flex items-center justify-between">
        {/* Background Neoclassical Courthouse Silhouette */}
        <div className="absolute right-36 top-0 bottom-0 opacity-15 pointer-events-none hidden md:block">
          <svg width="340" height="65" viewBox="0 0 340 65" fill="#78350F">
            <rect x="20" y="55" width="300" height="8" />
            <rect x="35" y="48" width="270" height="7" />
            {/* Columns */}
            <rect x="50" y="24" width="8" height="24" />
            <rect x="75" y="24" width="8" height="24" />
            <rect x="100" y="24" width="8" height="24" />
            <rect x="125" y="24" width="8" height="24" />
            <rect x="150" y="24" width="8" height="24" />
            <rect x="175" y="24" width="8" height="24" />
            <rect x="200" y="24" width="8" height="24" />
            <rect x="225" y="24" width="8" height="24" />
            <rect x="250" y="24" width="8" height="24" />
            <rect x="275" y="24" width="8" height="24" />
            {/* Pediment / Triangle */}
            <polygon points="40,24 170,3 300,24" />
            {/* Center Dome */}
            <path d="M140,16 Q170,-4 200,16 Z" />
            <line x1="170" y1="-4" x2="170" y2="-12" stroke="#78350F" strokeWidth="2" />
          </svg>
        </div>

        {/* Brand Lockup */}
        <div className="flex items-center gap-3.5 z-10">
          <CourtEmblem size={52} />
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#991B1B] uppercase leading-tight font-serif drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              Hệ thống giám sát hoạt động tòa án
            </h1>
            <p className="text-xs md:text-[13px] font-semibold text-slate-700 tracking-wide">
              QUẢN LÝ ÁN ST, PT - {settings.courtName}
            </p>
          </div>
        </div>

        {/* User Info & Controls */}
        <div className="flex items-center gap-2.5 z-10 text-xs">
          <button
            onClick={onResetData}
            title="Khôi phục dữ liệu mẫu ban đầu"
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-amber-100 rounded border border-amber-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Dữ liệu mẫu</span>
          </button>

          {/* Notification Center Bell Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              title="Trung tâm thông báo đẩy thời gian thực (Sắp hết hạn, phân công mới)"
              className="relative flex items-center gap-1.5 px-2.5 py-1 text-slate-700 hover:text-slate-900 hover:bg-amber-100 rounded border border-amber-200 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-red-700" />
              <span className="hidden sm:inline font-semibold">Thông báo</span>
              {unreadCount > 0 && (
                <span className="relative flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-600 text-white font-bold text-[9.5px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative">{unreadCount > 99 ? '99+' : unreadCount}</span>
                </span>
              )}
            </button>

            {showNotificationDropdown && (
              <NotificationCenterDropdown
                isOpen={showNotificationDropdown}
                onClose={() => setShowNotificationDropdown(false)}
                notifications={notifications}
                onMarkAllAsRead={() => onMarkAllNotificationsAsRead && onMarkAllNotificationsAsRead()}
                onClearAll={() => onClearAllNotifications && onClearAllNotifications()}
                onSelectNotification={(notif) => {
                  setShowNotificationDropdown(false);
                  if (onSelectNotification) onSelectNotification(notif);
                }}
                soundEnabled={soundEnabled}
                onToggleSound={() => onToggleSound && onToggleSound()}
                onSimulateNotification={(t) => onSimulateNotification && onSimulateNotification(t)}
              />
            )}
          </div>

          <button
            onClick={() => onOpenCustomization ? onOpenCustomization('UNIT') : onOpenSettings()}
            title="Trung tâm tùy chỉnh & cấu hình (Tên đơn vị, người dùng, chỉ tiêu, biểu mẫu)"
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-700 hover:text-slate-900 hover:bg-amber-100 rounded border border-amber-300 font-semibold transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Tùy chỉnh & Cấu hình</span>
          </button>

          <button
            onClick={onLogout}
            title="Đăng xuất khỏi hệ thống Tòa án"
            className="flex items-center gap-1 px-2.5 py-1 text-red-700 hover:text-red-950 hover:bg-red-100/80 rounded border border-red-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-red-700" />
            <span className="hidden md:inline font-bold">Thoát</span>
          </button>

          {/* Interactive User profile capsule & RBAC switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 bg-white/95 hover:bg-white border border-amber-300 hover:border-amber-400 rounded-full pl-1.5 pr-2.5 py-1 shadow-2xs transition-all text-left group"
              title="Nhấp để đổi tài khoản hoặc xem phân quyền tác vụ"
            >
              <div className={`w-7 h-7 rounded-full ${currentUser.avatarColor || 'bg-red-700'} text-white flex items-center justify-center font-bold text-xs shadow-2xs`}>
                {currentUser.fullName.split(' ').slice(-1)[0][0]}
              </div>
              <div className="leading-tight hidden sm:block">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                  <span>{currentUser.fullName}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-bold border ${roleBadge.bgClass} ${roleBadge.textClass} ${roleBadge.borderClass}`}>
                    {roleBadge.shortLabel}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  @{currentUser.username}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform" />
            </button>

            {/* User Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-84 bg-white border border-slate-300 rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Header info */}
                <div className="px-3.5 py-2.5 border-b border-slate-100 bg-amber-50/50">
                  <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                    <span>{currentUser.fullName}</span>
                    {onOpenCustomization && (
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenCustomization('USER');
                        }}
                        className="text-blue-700 hover:text-blue-900 text-[11px] font-bold flex items-center gap-1"
                        title="Sửa thông tin cá nhân"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Sửa hồ sơ</span>
                      </button>
                    )}
                  </div>
                  <div className="text-slate-600 text-xs font-medium">{currentUser.roleTitle}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">{currentUser.department}</div>
                  <div className="mt-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold border ${roleBadge.bgClass} ${roleBadge.textClass} ${roleBadge.borderClass}`}>
                      {roleBadge.label}
                    </span>
                  </div>
                </div>

                {/* Actions & Management modal triggers */}
                <div className="pt-1 px-2 space-y-1 text-xs">
                  {onOpenCustomization && (
                    <>
                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenCustomization('USER');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded hover:bg-blue-50 text-blue-900 font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-blue-700" />
                        <span>Tùy chỉnh tên & hồ sơ người dùng</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenCustomization('UNIT');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded hover:bg-amber-50 text-amber-950 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Building className="w-3.5 h-3.5 text-amber-700" />
                        <span>Tùy chỉnh tên cơ quan & đơn vị</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenCustomization('TARGETS');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded hover:bg-rose-50 text-rose-950 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Target className="w-3.5 h-3.5 text-rose-700" />
                        <span>Tùy chỉnh chỉ tiêu thi đua giải quyết án</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onOpenCustomization('TEMPLATES');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded hover:bg-emerald-50 text-emerald-950 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Tùy chỉnh hệ thống biểu mẫu tố tụng</span>
                      </button>

                      {onOpenWordUploader && (
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            onOpenWordUploader();
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded bg-blue-50/80 hover:bg-blue-100 text-blue-950 font-bold flex items-center gap-1.5 transition-colors border border-blue-200"
                        >
                          <FileUp className="w-3.5 h-3.5 text-blue-700" />
                          <span>Tải file Word (.docx) thêm biểu mẫu</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          onSelectTab('LICH_XET_XU');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded hover:bg-amber-50 text-amber-950 font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5 text-amber-700" />
                        <span>Mở Lịch xét xử & phiên tòa</span>
                      </button>

                      <div className="border-t border-slate-200 my-1"></div>
                    </>
                  )}

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenAccountSwitcher();
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-red-50 text-red-900 font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Key className="w-3.5 h-3.5 text-red-700" />
                    <span>Xem bảng phân quyền chức năng (RBAC)</span>
                  </button>

                  {onOpenAccountManagement && currentUser.permissions.canManageAccounts && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAccountManagement();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                      <span>Quản trị tài khoản & thêm người dùng</span>
                    </button>
                  )}

                  <div className="pt-1 mt-1 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded bg-red-50 hover:bg-red-100 text-red-900 font-bold flex items-center justify-between transition-colors border border-red-200"
                    >
                      <div className="flex items-center gap-1.5">
                        <LogOut className="w-3.5 h-3.5 text-red-700" />
                        <span>Đăng xuất (Thoát tài khoản)</span>
                      </div>
                      <span className="text-[10px] text-red-600 font-mono">@{currentUser.username}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Red Navigation Bar */}
      <nav className="bg-[#991B1B] text-white px-2 overflow-x-auto scrollbar-none flex items-center shadow-inner">
        {currentUser.role === 'ADMIN' ? (
          /* TRONG TÀI KHOẢN QUẢN TRỊ CHỈ CÓ MỤC QUẢN TRỊ TÀI KHOẢN */
          <button
            onClick={() => onSelectTab('QUAN_TRI')}
            className="px-4 py-2.5 text-xs md:text-sm font-bold tracking-wide whitespace-nowrap bg-[#7F1D1D] text-amber-300 border-b-2 border-amber-400 flex items-center gap-2 shadow-inner"
          >
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>QUẢN TRỊ TÀI KHOẢN & PHÂN QUYỀN</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => onSelectTab('TRANG_CHU')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 ${
                currentTab === 'TRANG_CHU'
                  ? 'bg-[#7F1D1D] text-amber-300 border-amber-400'
                  : 'text-white hover:bg-red-800/80 border-transparent'
              }`}
            >
              TRANG CHỦ
            </button>

            <button
              onClick={() => onSelectTab('BAO_CAO')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
                currentTab === 'BAO_CAO'
                  ? 'bg-[#7F1D1D] text-amber-300 border-amber-400'
                  : 'text-white hover:bg-red-800/80 border-transparent'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              TÌM KIẾM - BÁO CÁO
            </button>

            <button
              onClick={() => onSelectTab('LICH_XET_XU')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
                currentTab === 'LICH_XET_XU'
                  ? 'bg-[#7F1D1D] text-amber-300 border-amber-400'
                  : 'text-white hover:bg-red-800/80 border-transparent'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              LỊCH XÉT XỬ
            </button>

            <button
              onClick={() => onSelectTab('HINH_SU')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 ${
                currentTab === 'HINH_SU'
                  ? 'bg-[#7F1D1D] text-amber-300 border-amber-400'
                  : 'text-white hover:bg-red-800/80 border-transparent'
              }`}
            >
              HÌNH SỰ
            </button>

            <button
              onClick={() => onSelectTab('DAN_SU')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 ${
                currentTab === 'DAN_SU'
                  ? 'bg-[#7F1D1D] text-amber-300 border-amber-400'
                  : 'text-white hover:bg-red-800/80 border-transparent'
              }`}
            >
              DÂN SỰ
            </button>

            <button
              onClick={() => onSelectTab('HON_NHAN')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 ${
                currentTab === 'HON_NHAN'
                  ? 'bg-[#7F1D1D] text-amber-300 border-amber-400'
                  : 'text-white hover:bg-red-800/80 border-transparent'
              }`}
            >
              HN & GĐ
            </button>

            <button
              onClick={() => onSelectTab('KDTM')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 ${
                currentTab === 'KDTM'
                  ? 'bg-[#7F1D1D] text-amber-300 border-amber-400'
                  : 'text-white hover:bg-red-800/80 border-transparent'
              }`}
            >
              KD,TM
            </button>

            <button
              onClick={() => onSelectTab('HANH_CHINH')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 ${
                currentTab === 'HANH_CHINH'
                  ? 'bg-[#7F1D1D] text-amber-300 border-amber-400'
                  : 'text-white hover:bg-red-800/80 border-transparent'
              }`}
            >
              HÀNH CHÍNH
            </button>

            <button
              onClick={() => onSelectTab('LAO_DONG')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 ${
                currentTab === 'LAO_DONG'
                  ? 'bg-[#7F1D1D] text-amber-300 border-amber-400'
                  : 'text-white hover:bg-red-800/80 border-transparent'
              }`}
            >
              LAO ĐỘNG
            </button>

            <button
              onClick={() => onSelectTab('BIEN_PHAP_NGAN_CHAN')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
                currentTab === 'BIEN_PHAP_NGAN_CHAN'
                  ? 'bg-[#7F1D1D] text-amber-300 border-amber-400'
                  : 'text-white hover:bg-red-800/80 border-transparent'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              BIỆN PHÁP NGĂN CHẶN
            </button>

            <button
              onClick={() => onSelectTab('CAN_BO')}
              className={`px-3 py-2 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
                currentTab === 'CAN_BO'
                  ? 'bg-[#7F1D1D] text-amber-300 border-amber-400'
                  : 'text-white hover:bg-red-800/80 border-transparent'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              DANH SÁCH THẨM PHÁN & HỘI THẨM
            </button>

            {currentUser.permissions.canManageAccounts && (
              <button
                onClick={() => onSelectTab('QUAN_TRI')}
                className={`px-3 py-2 text-xs md:text-sm font-semibold tracking-wide whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
                  currentTab === 'QUAN_TRI'
                    ? 'bg-[#7F1D1D] text-amber-300 border-amber-400'
                    : 'text-white hover:bg-red-800/80 border-transparent'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                QUẢN TRỊ TÀI KHOẢN & PHÂN QUYỀN
              </button>
            )}
          </>
        )}
      </nav>

      {/* Pinned Case Bar (Exact mirror of court software top pinned banner) - Hidden for ADMIN */}
      {currentUser.role !== 'ADMIN' && pinnedCase && (
        <div className="bg-[#FFFBEB] border-b border-amber-300 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-800">
            <div>
              <span className="text-slate-500 font-medium">Mã vụ việc:</span>{' '}
              <strong className="text-red-800 font-mono text-[13px]">{pinnedCase.caseCode}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Thụ lý sơ thẩm:</span>{' '}
              <strong className="text-slate-800">{formatDateVN(pinnedCase.intakeDate)}</strong>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Tòa án:</span>{' '}
              <span className="font-semibold text-slate-700">{pinnedCase.courtName}</span>
            </div>
            <div className="w-full md:w-auto">
              <span className="text-slate-500 font-medium">Tên vụ việc:</span>{' '}
              <strong className="text-slate-900 text-[13px]">{pinnedCase.title}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={onUnpinCase}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded shadow-2xs font-medium text-xs transition-colors"
              title="Đóng ghim vụ án"
            >
              <PinOff className="w-3.5 h-3.5 text-slate-500" />
              <span>Hủy ghim</span>
            </button>

            <button
              onClick={() => onOpenCaseDetail(pinnedCase)}
              className="flex items-center gap-1 px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 rounded shadow-2xs font-medium text-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Chi tiết vụ án</span>
            </button>

            <button
              onClick={() => {
                alert(`Đã kích hoạt chức năng Tống đạt điện tử cho vụ án: ${pinnedCase.title}\nVăn bản tống đạt đã được gửi đến Viện kiểm sát và cổng thông tin đương sự.`);
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded shadow-2xs font-medium text-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>Tống đạt</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowPrintDropdown(!showPrintDropdown)}
                className="flex items-center gap-1 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded shadow-2xs font-medium text-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-amber-700" />
                <span>In biểu mẫu</span>
                <ChevronDown className="w-3 h-3 text-amber-700" />
              </button>

              {showPrintDropdown && (
                <div 
                  className="absolute right-0 mt-1 w-64 bg-white border border-slate-300 rounded shadow-lg py-1.5 z-50 text-slate-700 text-xs"
                  onMouseLeave={() => setShowPrintDropdown(false)}
                >
                  <button
                    onClick={() => {
                      setShowPrintDropdown(false);
                      onOpenPrintModal(pinnedCase, 'QUYET_DINH_PHAN_CONG');
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-amber-50 hover:text-red-800 flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>QĐ Phân công Thẩm phán (Mẫu 01)</span>
                  </button>

                  {pinnedCase.caseType === 'HINH_SU' && (
                    <button
                      onClick={() => {
                        setShowPrintDropdown(false);
                        onOpenPrintModal(pinnedCase, 'LENH_TAM_GIAM');
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-amber-50 hover:text-red-800 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Lệnh tạm giam của Tòa án (Mẫu 03)</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowPrintDropdown(false);
                      onOpenPrintModal(pinnedCase, 'DUA_VU_AN_RA_XET_XU');
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-amber-50 hover:text-red-800 flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>QĐ Đưa vụ án ra xét xử (Mẫu 04)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowPrintDropdown(false);
                      onOpenPrintModal(pinnedCase, 'GIA_HAN_CHUAN_BI_XET_XU');
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-amber-50 hover:text-red-800 flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>QĐ Gia hạn chuẩn bị xét xử (Mẫu 05)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sub-bar (Search & Quick Action Buttons) - Hidden for ADMIN */}
      {currentUser.role !== 'ADMIN' && (
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
            }}
            className="flex items-center gap-2 flex-1 max-w-xl"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  currentUser.role === 'THAM_PHAN'
                    ? `Tra cứu trong danh sách vụ án của Thẩm phán ${currentUser.fullName}...`
                    : "Nhập tên bị can, đương sự, số thụ lý hoặc mã vụ việc..."
                }
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <button
              type="submit"
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium shadow-2xs transition-colors shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Tra cứu</span>
            </button>
          </form>

          <div className="flex items-center gap-2">
            {currentUser.role === 'THAM_PHAN' && (
              <div className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded font-semibold text-xs flex items-center gap-1.5 shadow-2xs">
                <Scale className="w-3.5 h-3.5 text-amber-800" />
                <span>Thẩm phán: {currentUser.fullName} (Chỉ xem án phân công)</span>
              </div>
            )}

            {onOpenTemplateManager && (
              <button
                onClick={onOpenTemplateManager}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium shadow-2xs transition-colors"
                title="Quản lý hệ thống biểu mẫu tố tụng: thêm, sửa, xóa, cấu hình thẻ tự động điền"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Biểu mẫu Tòa án</span>
              </button>
            )}

            <button
              onClick={() => onSelectTab(currentTab === 'TRANG_CHU' ? 'HINH_SU' : currentTab)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium shadow-2xs transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-slate-500" />
              <span>Danh sách vụ việc</span>
            </button>

            {currentUser.permissions.canCreateCase && (
              <button
                onClick={onOpenNewCaseModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded font-semibold shadow-2xs transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Thêm mới thụ lý</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
