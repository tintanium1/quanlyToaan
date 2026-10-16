import React, { useState, useEffect } from 'react';
import { CourtCase, Official, CourtUnitSettings, CaseType, DocumentTemplate, UserAccount, UserRole, UserPermissions, ResolutionTargets, TrialSession } from './types/court';
import { DEFAULT_COURT_SETTINGS, DEFAULT_RESOLUTION_TARGETS, INITIAL_CASES, INITIAL_OFFICIALS, INITIAL_ACCOUNTS, INITIAL_TRIAL_SESSIONS } from './data/mockData';
import { DEFAULT_TEMPLATES, getStoredTemplates, saveStoredTemplates } from './data/defaultTemplates';
import { CourtHeader, NavTab } from './components/CourtHeader';
import { CaseListView } from './components/CaseListView';
import { CaseDetailView } from './components/CaseDetailView';
import { CaseRegistrationModal } from './components/CaseRegistrationModal';
import { JudgeAssignmentModal } from './components/JudgeAssignmentModal';
import { PreventiveMeasuresView } from './components/PreventiveMeasuresView';
import { StatisticalReportsView } from './components/StatisticalReportsView';
import { TrialCalendarView } from './components/TrialCalendarView';
import { OfficialsListView } from './components/OfficialsListView';
import { DocumentGeneratorModal } from './components/DocumentGeneratorModal';
import { CourtSettingsModal } from './components/CourtSettingsModal';
import { SystemCustomizationModal, CustomizationTab } from './components/SystemCustomizationModal';
import { TemplateManagementModal } from './components/TemplateManagementModal';
import { WordTemplateUploaderModal } from './components/WordTemplateUploaderModal';
import { TrialExtensionModal } from './components/TrialExtensionModal';
import { DetentionExtensionModal } from './components/DetentionExtensionModal';
import { AccountManagementView } from './components/AccountManagementView';
import { AccountManagementModal } from './components/AccountManagementModal';
import { AccountSwitcherModal } from './components/AccountSwitcherModal';
import { PermissionDeniedAlertModal } from './components/PermissionDeniedAlertModal';
import { LoginView } from './components/LoginView';
import { ToastNotificationContainer } from './components/ToastNotificationContainer';
import { CourtNotification, ActiveToast } from './types/notification';
import { playNotificationSound } from './utils/notificationAudio';
import { getDaysRemaining } from './utils/courtUtils';
import { hasPermission, isCaseAssignedToUser, getRoleBadge } from './utils/rbacUtils';
import { PreventiveMeasure, CaseDecision } from './types/court';
import { 
  Scale, 
  ShieldAlert, 
  Clock, 
  FileText, 
  BarChart3, 
  UserCheck, 
  PlusCircle, 
  AlertTriangle,
  FolderTree,
  CheckCircle2,
  Calendar,
  Printer,
  ShieldCheck,
  Key,
  Bell
} from 'lucide-react';

const STORAGE_CASES_KEY = 'tand_cases_v1';
const STORAGE_OFFICIALS_KEY = 'tand_officials_v1';
const STORAGE_SETTINGS_KEY = 'tand_settings_v1';
const STORAGE_TARGETS_KEY = 'tand_targets_v1';
const STORAGE_ACCOUNTS_KEY = 'tand_accounts_v1';
const STORAGE_CURRENT_USER_KEY = 'tand_current_user_id_v1';
const STORAGE_NOTIFICATIONS_KEY = 'tand_notifications_v1';
const STORAGE_SOUND_KEY = 'tand_sound_enabled_v1';
const STORAGE_TRIAL_SESSIONS_KEY = 'tand_trial_sessions_v1';

export default function App() {
  // Initialize state from LocalStorage or defaults
  const [cases, setCases] = useState<CourtCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CASES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_CASES;
    } catch {
      return INITIAL_CASES;
    }
  });

  const [officials, setOfficials] = useState<Official[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_OFFICIALS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_OFFICIALS;
    } catch {
      return INITIAL_OFFICIALS;
    }
  });

  const [settings, setSettings] = useState<CourtUnitSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_COURT_SETTINGS;
    } catch {
      return DEFAULT_COURT_SETTINGS;
    }
  });

  // Work targets and quotas state (customizable by unit/judges)
  const [targets, setTargets] = useState<ResolutionTargets>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TARGETS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_RESOLUTION_TARGETS;
    } catch {
      return DEFAULT_RESOLUTION_TARGETS;
    }
  });

  // User Accounts State (RBAC - 5 specialized roles requested by user)
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const savedId = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (savedId) {
        const found = accounts.find((a) => a.id === savedId);
        if (found && found.status !== 'LOCKED') return found;
      }
      return accounts[0] || INITIAL_ACCOUNTS[0];
    } catch {
      return accounts[0] || INITIAL_ACCOUNTS[0];
    }
  });

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    } catch (e) {
      console.error('Error removing user from localStorage', e);
    }
  };

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, user.id);
    } catch (e) {
      console.error('Error saving user to localStorage', e);
    }
  };

  // Navigation & Current View state
  const [currentTab, setCurrentTab] = useState<NavTab>('TRANG_CHU');
  const [pinnedCaseId, setPinnedCaseId] = useState<string>('case-01'); // Pin Case 01 initially matching screenshot!
  const [activeCaseDetail, setActiveCaseDetail] = useState<CourtCase | null>(null);
  
  // Search query
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchFilter, setActiveSearchFilter] = useState('');

  // Modals state
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [assigningCase, setAssigningCase] = useState<CourtCase | null>(null);
  const [printingDoc, setPrintingDoc] = useState<{ caseItem: CourtCase; docType?: string } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [customizationInitialTab, setCustomizationInitialTab] = useState<CustomizationTab>('UNIT');
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false);

  const handleOpenCustomization = (tab: CustomizationTab = 'UNIT') => {
    setCustomizationInitialTab(tab);
    setIsCustomizationModalOpen(true);
  };

  // RBAC & Account Modals State
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  const [isAccountManagementOpen, setIsAccountManagementOpen] = useState(false);
  const [editingAccountIdForModal, setEditingAccountIdForModal] = useState<string | null>(null);
  const [deniedActionAlert, setDeniedActionAlert] = useState<{ actionName: string; requiredRoleName: string } | null>(null);

  // Extension Modals State
  const [trialExtCase, setTrialExtCase] = useState<CourtCase | null>(null);
  const [detentionExtCase, setDetentionExtCase] = useState<{ caseItem: CourtCase; measure?: PreventiveMeasure } | null>(null);

  // Document templates state
  const [templates, setTemplates] = useState<DocumentTemplate[]>(getStoredTemplates);
  const [isWordUploaderOpen, setIsWordUploaderOpen] = useState(false);

  // Court Hearing Schedule & Trial Calendar Sessions State
  const [trialSessions, setTrialSessions] = useState<TrialSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TRIAL_SESSIONS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TRIAL_SESSIONS;
    } catch {
      return INITIAL_TRIAL_SESSIONS;
    }
  });

  // Push Notifications & Toast Notifications State
  const [notifications, setNotifications] = useState<CourtNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTIFICATIONS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeToasts, setActiveToasts] = useState<ActiveToast[]>([]);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SOUND_KEY);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Error saving notifications to localStorage', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SOUND_KEY, JSON.stringify(soundEnabled));
    } catch (e) {
      console.error('Error saving sound setting to localStorage', e);
    }
  }, [soundEnabled]);

  const dismissToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const pushNotification = (
    notifData: Omit<CourtNotification, 'id' | 'timestamp' | 'isRead'>,
    showToast = true
  ) => {
    const newNotif: CourtNotification = {
      ...notifData,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setNotifications((prev) => [newNotif, ...prev.slice(0, 49)]);

    if (showToast) {
      setActiveToasts((prev) => [
        { ...newNotif, duration: 6500 },
        ...prev.slice(0, 3),
      ]);

      if (soundEnabled) {
        if (newNotif.type === 'DEADLINE_URGENT' || newNotif.type === 'DETENTION_EXPIRING') {
          playNotificationSound('urgent');
        } else if (newNotif.type === 'NEW_CASE' || newNotif.type === 'DECISION_ISSUED') {
          playNotificationSound('success');
        } else {
          playNotificationSound('info');
        }
      }
    }
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleSelectNotification = (notif: CourtNotification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );

    if (notif.caseId) {
      const found = cases.find((c) => c.id === notif.caseId);
      if (found) {
        setActiveCaseDetail(found);
        setPinnedCaseId(found.id);
        setCurrentTab('TRANG_CHU');
      }
    }
  };

  // Automated background check on cases for upcoming deadlines & detentions
  useEffect(() => {
    const hasScanned = sessionStorage.getItem('tand_scanned_deadlines_session_v1');
    if (hasScanned) return;

    // Scan for urgent cases (< 7 days or overdue)
    const urgentList = cases.filter((c) => {
      if (c.status === 'DA_GIAI_QUYET' || c.status === 'DA_TUYEN_AN') return false;
      const days = getDaysRemaining(c.deadlineDate);
      return days.isOverdue || days.days <= 7;
    });

    // Scan for detention expiring (< 5 days)
    const detentionUrgentList: { c: CourtCase; pm: PreventiveMeasure; days: number }[] = [];
    cases.forEach((c) => {
      c.preventiveMeasures.forEach((pm) => {
        if (pm.type === 'TAM_GIAM' && pm.status !== 'HUY_BO') {
          const days = getDaysRemaining(pm.effectiveTo);
          if (days.isOverdue || days.days <= 5) {
            detentionUrgentList.push({ c, pm, days: days.days });
          }
        }
      });
    });

    if (urgentList.length > 0) {
      const topUrgent = urgentList[0];
      const days = getDaysRemaining(topUrgent.deadlineDate);
      setTimeout(() => {
        pushNotification({
          type: 'DEADLINE_URGENT',
          title: `CẢNH BÁO HẾT HẠN XÉT XỬ (${topUrgent.docketNumber})`,
          message: `Vụ án "${topUrgent.title}" ${
            days.isOverdue ? 'đã QUÁ HẠN chuẩn bị xét xử!' : `chỉ còn ${days.days} ngày nữa hết hạn chuẩn bị xét xử!`
          }`,
          caseId: topUrgent.id,
          caseDocket: topUrgent.docketNumber,
          caseTitle: topUrgent.title,
          daysRemaining: days.isOverdue ? 0 : days.days,
          actionLabel: 'Xử lý ngay',
        }, true);
      }, 1000);
    }

    if (detentionUrgentList.length > 0) {
      const topDet = detentionUrgentList[0];
      setTimeout(() => {
        pushNotification({
          type: 'DETENTION_EXPIRING',
          title: `CẢNH BÁO HẠN TẠM GIAM (${topDet.c.docketNumber})`,
          message: `Biện pháp tạm giam đối với bị can/bị cáo trong vụ án "${topDet.c.title}" ${
            topDet.days <= 0 ? 'đã hết hạn!' : `sẽ hết hiệu lực trong ${topDet.days} ngày tới!`
          }`,
          caseId: topDet.c.id,
          caseDocket: topDet.c.docketNumber,
          caseTitle: topDet.c.title,
          daysRemaining: topDet.days,
          actionLabel: 'Gia hạn tạm giam',
        }, true);
      }, 3000);
    }

    sessionStorage.setItem('tand_scanned_deadlines_session_v1', 'true');
  }, [cases]);

  // Simulator for user & testing
  const handleSimulateNotification = (simType: 'DEADLINE' | 'JUDGE' | 'DETENTION') => {
    if (simType === 'DEADLINE') {
      const targetCase = cases[0] || INITIAL_CASES[0];
      pushNotification({
        type: 'DEADLINE_URGENT',
        title: `CẢNH BÁO GẤP: SẮP HẾT HẠN CHUẨN BỊ XÉT XỬ`,
        message: `Vụ án số ${targetCase.docketNumber} (${targetCase.title}) còn 02 ngày nữa là hết hạn luật định! Đề nghị Thẩm phán khẩn trương ban hành Quyết định đưa vụ án ra xét xử hoặc gia hạn.`,
        caseId: targetCase.id,
        caseDocket: targetCase.docketNumber,
        caseTitle: targetCase.title,
        daysRemaining: 2,
        actionLabel: 'Xem hồ sơ án',
      });
    } else if (simType === 'JUDGE') {
      const targetCase = cases[1] || cases[0];
      pushNotification({
        type: 'JUDGE_ASSIGNED',
        title: `PHÂN CÔNG THẨM PHÁN CHỦ TỌA MỚI`,
        message: `Chánh án Tòa án vừa ký Quyết định phân công Thẩm phán ${targetCase.assignedJudgeName || 'Võ Thị Tuyết Trinh'} chủ tọa phiên tòa giải quyết vụ án số ${targetCase.docketNumber}.`,
        caseId: targetCase.id,
        caseDocket: targetCase.docketNumber,
        caseTitle: targetCase.title,
        judgeName: targetCase.assignedJudgeName,
        actionLabel: 'Nhận án phân công',
      });
    } else {
      const targetCase = cases[0];
      pushNotification({
        type: 'DETENTION_EXPIRING',
        title: `CẢNH BÁO: LỆNH TẠM GIAM SẮP HẾT HIỆU LỰC`,
        message: `Bị can/bị cáo trong vụ án ${targetCase.docketNumber} sắp hết hạn tạm giam theo Lệnh tạm giam trước (còn 03 ngày). Cần làm thủ tục gia hạn kịp thời theo Điều 278 BLTTHS.`,
        caseId: targetCase.id,
        caseDocket: targetCase.docketNumber,
        caseTitle: targetCase.title,
        daysRemaining: 3,
        actionLabel: 'Ký lệnh tạm giam',
      });
    }
  };

  // Sync to LocalStorage
  useEffect(() => {
    saveStoredTemplates(templates);
  }, [templates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CASES_KEY, JSON.stringify(cases));
    } catch (e) {
      console.error('Error saving cases to localStorage', e);
    }
  }, [cases]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_OFFICIALS_KEY, JSON.stringify(officials));
    } catch (e) {
      console.error('Error saving officials to localStorage', e);
    }
  }, [officials]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings to localStorage', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Error saving accounts to localStorage', e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TARGETS_KEY, JSON.stringify(targets));
    } catch (e) {
      console.error('Error saving targets to localStorage', e);
    }
  }, [targets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TRIAL_SESSIONS_KEY, JSON.stringify(trialSessions));
    } catch (e) {
      console.error('Error saving trial sessions to localStorage', e);
    }
  }, [trialSessions]);

  const handleUpdateCurrentUser = (updatedUser: UserAccount) => {
    setCurrentUser(updatedUser);
    setAccounts((prev) => prev.map((a) => (a.id === updatedUser.id ? updatedUser : a)));
    if (updatedUser.linkedOfficialId) {
      setOfficials((prev) =>
        prev.map((off) => {
          if (off.id === updatedUser.linkedOfficialId) {
            return {
              ...off,
              name: updatedUser.fullName,
              title: updatedUser.roleTitle,
              email: updatedUser.email || off.email,
              phone: updatedUser.phone || off.phone,
            };
          }
          return off;
        })
      );
    }
  };

  // When an admin logs in, enforce QUAN_TRI tab
  useEffect(() => {
    if (currentUser?.role === 'ADMIN' && currentTab !== 'QUAN_TRI') {
      setCurrentTab('QUAN_TRI');
      setActiveCaseDetail(null);
    }
  }, [currentUser, currentTab]);

  // Strict Data Isolation:
  // Judges ONLY see and manage cases assigned to them!
  // Leaders and Intake Officers see all cases.
  // Admins only see account management.
  const visibleCases = React.useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'ADMIN') return [];
    if (currentUser.role === 'LANH_DAO' || currentUser.role === 'CAN_BO_TONG_HOP') {
      return cases;
    }
    if (currentUser.role === 'THAM_PHAN' || currentUser.role === 'THU_KY') {
      return cases.filter((c) => isCaseAssignedToUser(c, currentUser));
    }
    return cases;
  }, [cases, currentUser]);

  // Automatically adjust pinned case and active case when user switches
  useEffect(() => {
    if (currentUser?.role === 'THAM_PHAN' || currentUser?.role === 'THU_KY') {
      const myCases = cases.filter((c) => isCaseAssignedToUser(c, currentUser));
      if (myCases.length > 0) {
        if (!pinnedCaseId || !myCases.some((c) => c.id === pinnedCaseId)) {
          setPinnedCaseId(myCases[0].id);
        }
      } else {
        setPinnedCaseId('');
      }
      if (activeCaseDetail && !myCases.some((c) => c.id === activeCaseDetail.id)) {
        setActiveCaseDetail(null);
      }
    }
  }, [currentUser, cases]);

  // Find pinned case object - ONLY from visibleCases
  const pinnedCase = visibleCases.find((c) => c.id === pinnedCaseId) || null;

  // RBAC Permission Checking Helpers
  const handleDenyPermission = (actionName: string, requiredRoleName: string) => {
    setDeniedActionAlert({ actionName, requiredRoleName });
  };

  // Handlers
  const handleResetData = () => {
    if (confirm('Khôi phục toàn bộ dữ liệu mẫu ban đầu của Tòa án nhân dân?')) {
      setCases(INITIAL_CASES);
      setOfficials(INITIAL_OFFICIALS);
      setSettings(DEFAULT_COURT_SETTINGS);
      setAccounts(INITIAL_ACCOUNTS);
      setCurrentUser(INITIAL_ACCOUNTS[0]);
      setPinnedCaseId('case-01');
      setActiveCaseDetail(null);
      localStorage.removeItem(STORAGE_CASES_KEY);
      localStorage.removeItem(STORAGE_OFFICIALS_KEY);
      localStorage.removeItem(STORAGE_SETTINGS_KEY);
      localStorage.removeItem(STORAGE_ACCOUNTS_KEY);
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
  };

  const handleSaveNewCase = (newCase: CourtCase) => {
    setCases([newCase, ...cases]);
    setPinnedCaseId(newCase.id);
    setActiveCaseDetail(newCase);

    pushNotification({
      type: 'NEW_CASE',
      title: `TIẾP NHẬN THỤ LÝ VỤ ÁN MỚI`,
      message: `Đã nhập thụ lý thành công vụ án số ${newCase.docketNumber} (${newCase.title}) vào sổ thụ lý Tòa án.`,
      caseId: newCase.id,
      caseDocket: newCase.docketNumber,
      caseTitle: newCase.title,
      actionLabel: 'Xem thụ lý',
    });
  };

  const handleUpdateCase = (updatedCase: CourtCase) => {
    setCases(cases.map((c) => (c.id === updatedCase.id ? updatedCase : c)));
    if (activeCaseDetail && activeCaseDetail.id === updatedCase.id) {
      setActiveCaseDetail(updatedCase);
    }
  };

  const handleOpenTrialExtension = (c: CourtCase) => {
    if (!hasPermission(currentUser, 'canExtendPreparation')) {
      handleDenyPermission('Ký Quyết định gia hạn thời hạn chuẩn bị xét xử', 'Lãnh đạo Tòa án (Chánh án / Phó Chánh án)');
      return;
    }
    setTrialExtCase(c);
  };

  const handleOpenDetentionExtension = (c: CourtCase, pm?: PreventiveMeasure) => {
    if (!hasPermission(currentUser, 'canExtendDetention')) {
      handleDenyPermission('Ban hành Lệnh gia hạn thời hạn tạm giam (Điều 278 BLTTHS)', 'Thẩm phán chủ tọa phiên tòa / Lãnh đạo Tòa án');
      return;
    }
    setDetentionExtCase({ caseItem: c, measure: pm });
  };

  const handleOpenAssignment = (c: CourtCase) => {
    if (!hasPermission(currentUser, 'canAssignJudges')) {
      handleDenyPermission('Phân công Thẩm phán & Thư ký giải quyết', 'Lãnh đạo Tòa án (Chánh án / Phó Chánh án)');
      return;
    }
    setAssigningCase(c);
  };

  const handleSaveAssignment = (
    caseId: string,
    data: {
      judgeId: string;
      judgeName: string;
      judgeTitle: string;
      altJudgeId?: string;
      altJudgeName?: string;
      clerkId: string;
      clerkName: string;
      altClerkId?: string;
      altClerkName?: string;
      jurors: { id: string; name: string; organization?: string; isAlternate?: boolean }[];
      assignmentDate: string;
      signerName: string;
      signerRole: string;
    }
  ) => {
    setCases((prevCases) =>
      prevCases.map((c) => {
        if (c.id === caseId) {
          const newDecision = {
            id: 'dec-' + Date.now(),
            decisionType: 'QUYET_DINH_PHAN_CONG' as const,
            decisionTypeName: 'Quyết định phân công Thẩm phán giải quyết vụ án',
            decisionNo: `${c.decisions.length + 1}/2026/QĐ-PC-TA`,
            issuedDate: data.assignmentDate,
            effectiveDate: data.assignmentDate,
            signerName: data.signerName,
            signerRole: data.signerRole,
            summary: `Phân công Thẩm phán ${data.judgeName} chủ tọa phiên tòa; Thư ký ${data.clerkName}.`,
          };

          return {
            ...c,
            status: c.status === 'MOI_THU_LY' ? 'DA_PHAN_CONG' : c.status,
            statusName: c.status === 'MOI_THU_LY' ? 'Đã phân công Thẩm phán' : c.statusName,
            assignedJudgeId: data.judgeId,
            assignedJudgeName: data.judgeName,
            assignedJudgeTitle: data.judgeTitle,
            alternateJudgeId: data.altJudgeId,
            alternateJudgeName: data.altJudgeName,
            assignedClerkId: data.clerkId,
            assignedClerkName: data.clerkName,
            alternateClerkId: data.altClerkId,
            alternateClerkName: data.altClerkName,
            assignedJurors: data.jurors,
            assignmentDate: data.assignmentDate,
            assignmentSigner: data.signerName,
            assignmentSignerRole: data.signerRole,
            decisions: [newDecision, ...c.decisions],
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    // Update activeCaseDetail if matching
    if (activeCaseDetail && activeCaseDetail.id === caseId) {
      setActiveCaseDetail((prev) =>
        prev
          ? {
              ...prev,
              assignedJudgeId: data.judgeId,
              assignedJudgeName: data.judgeName,
              assignedJudgeTitle: data.judgeTitle,
              assignedClerkId: data.clerkId,
              assignedClerkName: data.clerkName,
              assignedJurors: data.jurors,
              assignmentDate: data.assignmentDate,
              assignmentSigner: data.signerName,
              status: prev.status === 'MOI_THU_LY' ? 'DA_PHAN_CONG' : prev.status,
              statusName: prev.status === 'MOI_THU_LY' ? 'Đã phân công Thẩm phán' : prev.statusName,
            }
          : null
      );
    }

    // Trigger toast notification for judge assignment
    const targetCase = cases.find((c) => c.id === caseId);
    if (targetCase) {
      pushNotification({
        type: 'JUDGE_ASSIGNED',
        title: `PHÂN CÔNG THẨM PHÁN GIẢI QUYẾT VỤ ÁN`,
        message: `Thẩm phán ${data.judgeName} (${data.judgeTitle}) vừa được phân công chủ tọa giải quyết vụ án số ${targetCase.docketNumber} (${targetCase.title}). Thư ký: ${data.clerkName}.`,
        caseId: targetCase.id,
        caseDocket: targetCase.docketNumber,
        caseTitle: targetCase.title,
        judgeName: data.judgeName,
        actionLabel: 'Xem hồ sơ phân công',
      });
    }
  };

  const handleAddOfficial = (newOff: Official) => {
    setOfficials([...officials, newOff]);
  };

  const handleUpdateOfficial = (updatedOff: Official) => {
    setOfficials((prev) => prev.map((o) => (o.id === updatedOff.id ? updatedOff : o)));
    // Synchronize cases where this official is assigned so names and titles never become inconsistent
    setCases((prevCases) =>
      prevCases.map((c) => {
        let modified = false;
        let cCopy = { ...c };
        if (c.assignedJudgeId === updatedOff.id && (c.assignedJudgeName !== updatedOff.name || c.assignedJudgeTitle !== updatedOff.title)) {
          cCopy.assignedJudgeName = updatedOff.name;
          cCopy.assignedJudgeTitle = updatedOff.title;
          modified = true;
        }
        if (c.alternateJudgeId === updatedOff.id && c.alternateJudgeName !== updatedOff.name) {
          cCopy.alternateJudgeName = updatedOff.name;
          modified = true;
        }
        if (c.assignedClerkId === updatedOff.id && c.assignedClerkName !== updatedOff.name) {
          cCopy.assignedClerkName = updatedOff.name;
          modified = true;
        }
        if (c.alternateClerkId === updatedOff.id && c.alternateClerkName !== updatedOff.name) {
          cCopy.alternateClerkName = updatedOff.name;
          modified = true;
        }
        if (c.assignedJurors?.some((j) => j.id === updatedOff.id)) {
          cCopy.assignedJurors = c.assignedJurors.map((j) =>
            j.id === updatedOff.id ? { ...j, name: updatedOff.name, organization: updatedOff.organization } : j
          );
          modified = true;
        }
        return modified ? cCopy : c;
      })
    );
  };

  const handleDeleteOfficial = (officialId: string) => {
    setOfficials((prev) => prev.filter((o) => o.id !== officialId));
  };

  const handleOpenPrint = (caseItem: CourtCase, docType?: string) => {
    setPrintingDoc({ caseItem, docType: docType || 'QUYET_DINH_PHAN_CONG' });
  };

  const handleSearchSubmit = () => {
    setActiveSearchFilter(searchQuery);
    if (activeCaseDetail) {
      setActiveCaseDetail(null);
    }
    // If the user searches while in reports or officials directory, switch to TRANG_CHU so results are immediately visible
    if (currentTab === 'BAO_CAO' || currentTab === 'CAN_BO') {
      setCurrentTab('TRANG_CHU');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearchFilter('');
  };

  // Urgent alerts calculation for dashboard (computed from visibleCases)
  const overdueCases = visibleCases.filter((c) => {
    const days = getDaysRemaining(c.deadlineDate);
    return days.isOverdue && c.status !== 'DA_GIAI_QUYET' && c.status !== 'DA_TUYEN_AN';
  });

  const expiringSoonCases = visibleCases.filter((c) => {
    const days = getDaysRemaining(c.deadlineDate);
    return days.isWarning && !days.isOverdue && c.status !== 'DA_GIAI_QUYET' && c.status !== 'DA_TUYEN_AN';
  });

  const detentionWarningCount = visibleCases.reduce((acc, c) => {
    const expiringPm = c.preventiveMeasures.filter((pm) => {
      const d = getDaysRemaining(pm.effectiveTo);
      return (d.isWarning || d.isOverdue) && pm.status !== 'HUY_BO';
    });
    return acc + expiringPm.length;
  }, 0);

  // If user is logged out, render official Vietnamese Court Login View
  if (!currentUser) {
    return (
      <LoginView
        accounts={accounts}
        settings={settings}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-sans text-slate-800">
      {/* Header matching Vietnamese Court Software */}
      <CourtHeader
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setActiveCaseDetail(null);
        }}
        pinnedCase={pinnedCase}
        onUnpinCase={() => setPinnedCaseId('')}
        onOpenNewCaseModal={() => {
          if (!hasPermission(currentUser, 'canCreateCase')) {
            handleDenyPermission('Nhập thụ lý vụ án ban đầu', 'Cán bộ Tổng hợp & Thụ lý / Lãnh đạo Tòa án');
            return;
          }
          setIsNewCaseModalOpen(true);
        }}
        onOpenCaseDetail={(c) => {
          setActiveCaseDetail(c);
          setPinnedCaseId(c.id);
        }}
        onOpenPrintModal={handleOpenPrint}
        onOpenTemplateManager={() => {
          if (!hasPermission(currentUser, 'canManageTemplates')) {
            handleDenyPermission('Quản lý hệ thống biểu mẫu tố tụng', 'Lãnh đạo Tòa án / Quản trị viên');
            return;
          }
          setIsTemplateManagerOpen(true);
        }}
        onOpenWordUploader={() => {
          if (!hasPermission(currentUser, 'canManageTemplates')) {
            handleDenyPermission('Thêm biểu mẫu tố tụng bằng file Word', 'Lãnh đạo Tòa án / Quản trị viên');
            return;
          }
          setIsWordUploaderOpen(true);
        }}
        onOpenCustomization={handleOpenCustomization}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        settings={settings}
        onOpenSettings={() => {
          handleOpenCustomization('UNIT');
        }}
        onResetData={handleResetData}
        currentUser={currentUser}
        accounts={accounts}
        onSelectAccount={(acc) => setCurrentUser(acc)}
        onOpenAccountSwitcher={() => setIsAccountSwitcherOpen(true)}
        onOpenAccountManagement={() => setIsAccountManagementOpen(true)}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        onClearAllNotifications={handleClearAllNotifications}
        onSelectNotification={handleSelectNotification}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onSimulateNotification={handleSimulateNotification}
      />

      {/* Real-time Toast Notifications Display */}
      <ToastNotificationContainer
        toasts={activeToasts}
        onDismiss={dismissToast}
        onNavigateCase={(caseId) => {
          const found = cases.find((c) => c.id === caseId);
          if (found) {
            setActiveCaseDetail(found);
            setPinnedCaseId(found.id);
            setCurrentTab('TRANG_CHU');
          }
        }}
      />

      {/* Main Workspace Content */}
      <main className="flex-1 max-w-[1580px] w-full mx-auto p-3 md:p-4 space-y-4">
        {currentUser.role === 'ADMIN' ? (
          /* TRONG TÀI KHOẢN QUẢN TRỊ CHỈ CÓ MỤC QUẢN TRỊ TÀI KHOẢN */
          <AccountManagementView
            accounts={accounts}
            currentUser={currentUser}
            onUpdateAccounts={(updated) => setAccounts(updated)}
            onSelectAccount={(acc) => setCurrentUser(acc)}
            onOpenAccountManagementModal={(accId) => {
              setEditingAccountIdForModal(accId || null);
              setIsAccountManagementOpen(true);
            }}
          />
        ) : activeCaseDetail && isCaseAssignedToUser(activeCaseDetail, currentUser) ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white border border-slate-300 rounded px-4 py-2.5 shadow-2xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveCaseDetail(null)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold transition-colors"
                >
                  ← Trở lại danh sách
                </button>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-500 font-medium">Đang xem chi tiết vụ án:</span>
                <strong className="text-xs text-slate-900">{activeCaseDetail.title}</strong>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenTrialExtension(activeCaseDetail)}
                  className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  title="Gia hạn thời hạn chuẩn bị xét xử"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Gia hạn chuẩn bị XX</span>
                </button>

                {activeCaseDetail.caseType === 'HINH_SU' && (
                  <button
                    onClick={() => handleOpenDetentionExtension(activeCaseDetail)}
                    className="px-3 py-1 bg-[#991B1B] hover:bg-red-800 text-white rounded text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                    title="Gia hạn thời hạn tạm giam theo Điều 278 BLTTHS"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Gia hạn tạm giam</span>
                  </button>
                )}

                <button
                  onClick={() => handleOpenAssignment(activeCaseDetail)}
                  className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Phân công Thẩm phán</span>
                </button>
                <button
                  onClick={() => handleOpenPrint(activeCaseDetail)}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors shadow-2xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>In biểu mẫu quyết định</span>
                </button>
              </div>
            </div>

            <CaseDetailView
              caseItem={activeCaseDetail}
              officials={officials}
              onUpdateCase={handleUpdateCase}
              onOpenAssignModal={handleOpenAssignment}
              onOpenPrintModal={handleOpenPrint}
              onBack={() => setActiveCaseDetail(null)}
              onOpenTrialExtension={handleOpenTrialExtension}
              onOpenDetentionExtension={handleOpenDetentionExtension}
              currentUser={currentUser}
              onDenyPermission={handleDenyPermission}
            />
          </div>
        ) : (
          <>
            {/* THẨM PHÁN: THÔNG BÁO CHẾ ĐỘ PHÂN QUYỀN HỒ SƠ */}
            {currentUser.role === 'THAM_PHAN' && (
              <div className="bg-amber-50 border border-amber-300 rounded p-3 flex items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-center gap-2 text-amber-900">
                  <Scale className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Chế độ Thẩm phán giải quyết ({currentUser.fullName}):</strong> Hệ thống chỉ hiển thị <strong>{visibleCases.length} vụ án</strong> do đồng chí được phân công. Hồ sơ của các Thẩm phán khác đã được ẩn theo chính sách bảo mật tố tụng.
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-amber-200/80 text-amber-950 font-bold rounded text-xs shrink-0 border border-amber-400">
                  {visibleCases.length} vụ án phụ trách
                </span>
              </div>
            )}
            {/* TRANG CHỦ / DASHBOARD TỔNG QUAN */}
            {currentTab === 'TRANG_CHU' && (
              <div className="space-y-4">
                {/* Urgent Alerts Ribbon (Án quá hạn / Sắp hết hạn / Tạm giam) */}
                {(overdueCases.length > 0 || expiringSoonCases.length > 0 || detentionWarningCount > 0) && (
                  <div className="bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border border-red-200 rounded p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
                    <div className="flex items-center gap-2 text-red-900 font-bold">
                      <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" />
                      <span>CẢNH BÁO TIẾN ĐỘ THỜI GIAN THỰC CẦN LÃNH ĐẠO ĐƠN VỊ & THẨM PHÁN CHÚ Ý:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {overdueCases.length > 0 && (
                        <span className="bg-red-700 text-white px-2.5 py-0.5 rounded font-bold">
                          {overdueCases.length} vụ quá hạn luật định
                        </span>
                      )}
                      {expiringSoonCases.length > 0 && (
                        <span className="bg-amber-600 text-white px-2.5 py-0.5 rounded font-bold">
                          {expiringSoonCases.length} vụ sắp hết hạn chuẩn bị xét xử (≤ 10 ngày)
                        </span>
                      )}
                      {detentionWarningCount > 0 && (
                        <button
                          onClick={() => setCurrentTab('BIEN_PHAP_NGAN_CHAN')}
                          className="bg-rose-800 text-white px-2.5 py-0.5 rounded font-bold hover:bg-rose-900 transition-colors"
                        >
                          {detentionWarningCount} lệnh tạm giam cần gia hạn / xét xử ngay!
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Dashboard Metrics Grid - Strictly Synchronized across all 6 court categories */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
                  <div 
                    onClick={() => {
                      setCurrentTab('HINH_SU');
                      setActiveSearchFilter('');
                    }}
                    className="bg-white border border-slate-300 hover:border-red-600 rounded p-3 cursor-pointer shadow-2xs transition-all hover:-translate-y-0.5"
                  >
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Án Hình sự</div>
                    <div className="text-xl font-bold font-mono text-red-800 mt-1">
                      {visibleCases.filter((c) => c.caseType === 'HINH_SU').length} <span className="text-xs font-normal text-slate-500">vụ</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Tạm giam, cáo trạng</div>
                  </div>

                  <div 
                    onClick={() => {
                      setCurrentTab('DAN_SU');
                      setActiveSearchFilter('');
                    }}
                    className="bg-white border border-slate-300 hover:border-red-600 rounded p-3 cursor-pointer shadow-2xs transition-all hover:-translate-y-0.5"
                  >
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Án Dân sự</div>
                    <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                      {visibleCases.filter((c) => c.caseType === 'DAN_SU').length} <span className="text-xs font-normal text-slate-500">vụ</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Đất đai, hợp đồng, vay</div>
                  </div>

                  <div 
                    onClick={() => {
                      setCurrentTab('HON_NHAN');
                      setActiveSearchFilter('');
                    }}
                    className="bg-white border border-slate-300 hover:border-red-600 rounded p-3 cursor-pointer shadow-2xs transition-all hover:-translate-y-0.5"
                  >
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Hôn nhân & GĐ</div>
                    <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                      {visibleCases.filter((c) => c.caseType === 'HON_NHAN').length} <span className="text-xs font-normal text-slate-500">vụ</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Ly hôn, nuôi con, chia TS</div>
                  </div>

                  <div 
                    onClick={() => {
                      setCurrentTab('KDTM');
                      setActiveSearchFilter('');
                    }}
                    className="bg-white border border-slate-300 hover:border-red-600 rounded p-3 cursor-pointer shadow-2xs transition-all hover:-translate-y-0.5"
                  >
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Kinh doanh, TM</div>
                    <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                      {visibleCases.filter((c) => c.caseType === 'KDTM').length} <span className="text-xs font-normal text-slate-500">vụ</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Tín dụng, ngân hàng, cty</div>
                  </div>

                  <div 
                    onClick={() => {
                      setCurrentTab('HANH_CHINH');
                      setActiveSearchFilter('');
                    }}
                    className="bg-white border border-slate-300 hover:border-red-600 rounded p-3 cursor-pointer shadow-2xs transition-all hover:-translate-y-0.5"
                  >
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Hành chính</div>
                    <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                      {visibleCases.filter((c) => c.caseType === 'HANH_CHINH').length} <span className="text-xs font-normal text-slate-500">vụ</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Khiếu kiện QĐ UBND</div>
                  </div>

                  <div 
                    onClick={() => {
                      setCurrentTab('LAO_DONG');
                      setActiveSearchFilter('');
                    }}
                    className="bg-white border border-slate-300 hover:border-red-600 rounded p-3 cursor-pointer shadow-2xs transition-all hover:-translate-y-0.5"
                  >
                    <div className="text-[11px] font-bold text-slate-500 uppercase">Án Lao động</div>
                    <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                      {visibleCases.filter((c) => c.caseType === 'LAO_DONG').length} <span className="text-xs font-normal text-slate-500">vụ</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Sa thải, lương, BHXH</div>
                  </div>

                  <div 
                    onClick={() => {
                      setCurrentTab('BAO_CAO');
                      setActiveSearchFilter('');
                    }}
                    className="bg-red-800 text-white rounded p-3 cursor-pointer shadow-2xs transition-all hover:bg-red-900 hover:-translate-y-0.5"
                  >
                    <div className="text-[11px] font-bold text-amber-300 uppercase">Báo cáo thống kê</div>
                    <div className="text-xl font-bold font-mono text-white mt-1">
                      {visibleCases.length} <span className="text-xs font-normal text-slate-200">
                        {currentUser.role === 'THAM_PHAN' ? 'án phân công' : 'tổng thụ lý'}
                      </span>
                    </div>
                    <div className="text-[10px] text-amber-200 mt-1">Xem biểu mẫu 01/BC-TA</div>
                  </div>
                </div>

                {/* All Cases Table */}
                <CaseListView
                  cases={visibleCases}
                  categoryTitle={
                    currentUser.role === 'THAM_PHAN'
                      ? `Danh mục vụ án được phân công cho Thẩm phán ${currentUser.fullName}`
                      : "Toàn bộ danh mục vụ án đang thụ lý & giải quyết"
                  }
                  onOpenNewCaseModal={() => {
                    if (!hasPermission(currentUser, 'canCreateCase')) {
                      handleDenyPermission('Nhập thụ lý vụ án ban đầu', 'Cán bộ Tổng hợp & Thụ lý / Lãnh đạo Tòa án');
                      return;
                    }
                    setIsNewCaseModalOpen(true);
                  }}
                  onOpenCaseDetail={(c) => {
                    setActiveCaseDetail(c);
                    setPinnedCaseId(c.id);
                  }}
                  onOpenAssignModal={handleOpenAssignment}
                  onOpenPrintModal={handleOpenPrint}
                  onPinCase={(c) => setPinnedCaseId(c.id)}
                  pinnedCaseId={pinnedCaseId}
                  searchFilterQuery={activeSearchFilter}
                  onClearSearch={handleClearSearch}
                  onOpenTrialExtension={handleOpenTrialExtension}
                  onOpenDetentionExtension={handleOpenDetentionExtension}
                  currentUser={currentUser}
                  onDenyPermission={handleDenyPermission}
                />
              </div>
            )}

            {/* HÌNH SỰ */}
            {currentTab === 'HINH_SU' && (
              <CaseListView
                cases={visibleCases}
                categoryType="HINH_SU"
                categoryTitle={
                  currentUser.role === 'THAM_PHAN'
                    ? `Án Hình sự phân công cho Thẩm phán ${currentUser.fullName}`
                    : "Quản lý Án Hình sự - Giám sát tiến độ & Biện pháp tạm giam"
                }
                onOpenNewCaseModal={() => {
                  if (!hasPermission(currentUser, 'canCreateCase')) {
                    handleDenyPermission('Nhập thụ lý vụ án ban đầu', 'Cán bộ Tổng hợp & Thụ lý / Lãnh đạo Tòa án');
                    return;
                  }
                  setIsNewCaseModalOpen(true);
                }}
                onOpenCaseDetail={(c) => {
                  setActiveCaseDetail(c);
                  setPinnedCaseId(c.id);
                }}
                onOpenAssignModal={handleOpenAssignment}
                onOpenPrintModal={handleOpenPrint}
                onPinCase={(c) => setPinnedCaseId(c.id)}
                pinnedCaseId={pinnedCaseId}
                searchFilterQuery={activeSearchFilter}
                onClearSearch={handleClearSearch}
                onOpenTrialExtension={handleOpenTrialExtension}
                onOpenDetentionExtension={handleOpenDetentionExtension}
                currentUser={currentUser}
                onDenyPermission={handleDenyPermission}
              />
            )}

            {/* DÂN SỰ */}
            {currentTab === 'DAN_SU' && (
              <CaseListView
                cases={visibleCases}
                categoryType="DAN_SU"
                categoryTitle={
                  currentUser.role === 'THAM_PHAN'
                    ? `Án Dân sự phân công cho Thẩm phán ${currentUser.fullName}`
                    : "Quản lý Án Dân sự - Tranh chấp tài sản, đất đai, hợp đồng"
                }
                onOpenNewCaseModal={() => {
                  if (!hasPermission(currentUser, 'canCreateCase')) {
                    handleDenyPermission('Nhập thụ lý vụ án ban đầu', 'Cán bộ Tổng hợp & Thụ lý / Lãnh đạo Tòa án');
                    return;
                  }
                  setIsNewCaseModalOpen(true);
                }}
                onOpenCaseDetail={(c) => {
                  setActiveCaseDetail(c);
                  setPinnedCaseId(c.id);
                }}
                onOpenAssignModal={handleOpenAssignment}
                onOpenPrintModal={handleOpenPrint}
                onPinCase={(c) => setPinnedCaseId(c.id)}
                pinnedCaseId={pinnedCaseId}
                searchFilterQuery={activeSearchFilter}
                onClearSearch={handleClearSearch}
                onOpenTrialExtension={handleOpenTrialExtension}
                onOpenDetentionExtension={handleOpenDetentionExtension}
                currentUser={currentUser}
                onDenyPermission={handleDenyPermission}
              />
            )}

            {/* HÔN NHÂN & GIA ĐÌNH */}
            {currentTab === 'HON_NHAN' && (
              <CaseListView
                cases={visibleCases}
                categoryType="HON_NHAN"
                categoryTitle={
                  currentUser.role === 'THAM_PHAN'
                    ? `Án Hôn nhân & GĐ phân công cho Thẩm phán ${currentUser.fullName}`
                    : "Quản lý Án Hôn nhân & Gia đình - Ly hôn, quyền nuôi con & chia tài sản"
                }
                onOpenNewCaseModal={() => {
                  if (!hasPermission(currentUser, 'canCreateCase')) {
                    handleDenyPermission('Nhập thụ lý vụ án ban đầu', 'Cán bộ Tổng hợp & Thụ lý / Lãnh đạo Tòa án');
                    return;
                  }
                  setIsNewCaseModalOpen(true);
                }}
                onOpenCaseDetail={(c) => {
                  setActiveCaseDetail(c);
                  setPinnedCaseId(c.id);
                }}
                onOpenAssignModal={handleOpenAssignment}
                onOpenPrintModal={handleOpenPrint}
                onPinCase={(c) => setPinnedCaseId(c.id)}
                pinnedCaseId={pinnedCaseId}
                searchFilterQuery={activeSearchFilter}
                onClearSearch={handleClearSearch}
                onOpenTrialExtension={handleOpenTrialExtension}
                onOpenDetentionExtension={handleOpenDetentionExtension}
                currentUser={currentUser}
                onDenyPermission={handleDenyPermission}
              />
            )}

            {/* KINH DOANH THƯƠNG MẠI */}
            {currentTab === 'KDTM' && (
              <CaseListView
                cases={visibleCases}
                categoryType="KDTM"
                categoryTitle={
                  currentUser.role === 'THAM_PHAN'
                    ? `Án Kinh doanh, Thương mại phân công cho Thẩm phán ${currentUser.fullName}`
                    : "Quản lý Án Kinh doanh, Thương mại - Tranh chấp hợp đồng kinh tế, tín dụng"
                }
                onOpenNewCaseModal={() => {
                  if (!hasPermission(currentUser, 'canCreateCase')) {
                    handleDenyPermission('Nhập thụ lý vụ án ban đầu', 'Cán bộ Tổng hợp & Thụ lý / Lãnh đạo Tòa án');
                    return;
                  }
                  setIsNewCaseModalOpen(true);
                }}
                onOpenCaseDetail={(c) => {
                  setActiveCaseDetail(c);
                  setPinnedCaseId(c.id);
                }}
                onOpenAssignModal={handleOpenAssignment}
                onOpenPrintModal={handleOpenPrint}
                onPinCase={(c) => setPinnedCaseId(c.id)}
                pinnedCaseId={pinnedCaseId}
                searchFilterQuery={activeSearchFilter}
                onClearSearch={handleClearSearch}
                onOpenTrialExtension={handleOpenTrialExtension}
                onOpenDetentionExtension={handleOpenDetentionExtension}
                currentUser={currentUser}
                onDenyPermission={handleDenyPermission}
              />
            )}

            {/* HÀNH CHÍNH */}
            {currentTab === 'HANH_CHINH' && (
              <CaseListView
                cases={visibleCases}
                categoryType="HANH_CHINH"
                categoryTitle={
                  currentUser.role === 'THAM_PHAN'
                    ? `Án Hành chính phân công cho Thẩm phán ${currentUser.fullName}`
                    : "Quản lý Án Hành chính - Khiếu kiện Quyết định & Hành vi hành chính"
                }
                onOpenNewCaseModal={() => {
                  if (!hasPermission(currentUser, 'canCreateCase')) {
                    handleDenyPermission('Nhập thụ lý vụ án ban đầu', 'Cán bộ Tổng hợp & Thụ lý / Lãnh đạo Tòa án');
                    return;
                  }
                  setIsNewCaseModalOpen(true);
                }}
                onOpenCaseDetail={(c) => {
                  setActiveCaseDetail(c);
                  setPinnedCaseId(c.id);
                }}
                onOpenAssignModal={handleOpenAssignment}
                onOpenPrintModal={handleOpenPrint}
                onPinCase={(c) => setPinnedCaseId(c.id)}
                pinnedCaseId={pinnedCaseId}
                searchFilterQuery={activeSearchFilter}
                onClearSearch={handleClearSearch}
                onOpenTrialExtension={handleOpenTrialExtension}
                onOpenDetentionExtension={handleOpenDetentionExtension}
                currentUser={currentUser}
                onDenyPermission={handleDenyPermission}
              />
            )}

            {/* LAO ĐỘNG */}
            {currentTab === 'LAO_DONG' && (
              <CaseListView
                cases={visibleCases}
                categoryType="LAO_DONG"
                categoryTitle={
                  currentUser.role === 'THAM_PHAN'
                    ? `Án Lao động phân công cho Thẩm phán ${currentUser.fullName}`
                    : "Quản lý Án Lao động - Tranh chấp hợp đồng lao động & tiền lương"
                }
                onOpenNewCaseModal={() => {
                  if (!hasPermission(currentUser, 'canCreateCase')) {
                    handleDenyPermission('Nhập thụ lý vụ án ban đầu', 'Cán bộ Tổng hợp & Thụ lý / Lãnh đạo Tòa án');
                    return;
                  }
                  setIsNewCaseModalOpen(true);
                }}
                onOpenCaseDetail={(c) => {
                  setActiveCaseDetail(c);
                  setPinnedCaseId(c.id);
                }}
                onOpenAssignModal={handleOpenAssignment}
                onOpenPrintModal={handleOpenPrint}
                onPinCase={(c) => setPinnedCaseId(c.id)}
                pinnedCaseId={pinnedCaseId}
                searchFilterQuery={activeSearchFilter}
                onClearSearch={handleClearSearch}
                onOpenTrialExtension={handleOpenTrialExtension}
                onOpenDetentionExtension={handleOpenDetentionExtension}
                currentUser={currentUser}
                onDenyPermission={handleDenyPermission}
              />
            )}

            {/* BIỆN PHÁP NGĂN CHẶN */}
            {currentTab === 'BIEN_PHAP_NGAN_CHAN' && (
              <PreventiveMeasuresView
                cases={visibleCases}
                onOpenCaseDetail={(c) => {
                  setActiveCaseDetail(c);
                  setPinnedCaseId(c.id);
                }}
                onOpenPrintModal={handleOpenPrint}
                onPinCase={(c) => setPinnedCaseId(c.id)}
                onOpenDetentionExtension={handleOpenDetentionExtension}
                currentUser={currentUser}
                onDenyPermission={handleDenyPermission}
              />
            )}

            {/* BÁO CÁO THỐNG KÊ CHO LÃNH ĐẠO */}
            {currentTab === 'BAO_CAO' && (
              <StatisticalReportsView
                cases={visibleCases}
                officials={officials}
                settings={settings}
                targets={targets}
                onOpenTargetCustomization={() => handleOpenCustomization('TARGETS')}
                currentUser={currentUser}
                onOpenCaseDetail={(c) => {
                  setActiveCaseDetail(c);
                  setPinnedCaseId(c.id);
                }}
                onSelectCategoryTab={(tab) => {
                  setCurrentTab(tab as any);
                  setActiveSearchFilter('');
                }}
              />
            )}

            {/* LỊCH XÉT XỬ & PHIÊN TÒA TÒA ÁN NHÂN DÂN */}
            {currentTab === 'LICH_XET_XU' && (
              <TrialCalendarView
                trialSessions={trialSessions}
                onUpdateTrialSessions={(sessions) => setTrialSessions(sessions)}
                cases={cases}
                officials={officials}
                settings={settings}
                currentUser={currentUser}
                onOpenCaseDetail={(c) => {
                  setActiveCaseDetail(c);
                  setPinnedCaseId(c.id);
                }}
                onOpenPrintModal={handleOpenPrint}
              />
            )}

            {/* DANH SÁCH CÁN BỘ & HỘI THẨM */}
            {currentTab === 'CAN_BO' && (
              <OfficialsListView
                officials={officials}
                cases={visibleCases}
                onAddOfficial={handleAddOfficial}
                onUpdateOfficial={handleUpdateOfficial}
                onDeleteOfficial={handleDeleteOfficial}
                onFilterByOfficial={(name) => {
                  setSearchQuery(name);
                  setActiveSearchFilter(name);
                  setCurrentTab('TRANG_CHU');
                }}
              />
            )}

            {/* QUẢN TRỊ TÀI KHOẢN & PHÂN QUYỀN (RBAC) */}
            {currentTab === 'QUAN_TRI' && (
              <AccountManagementView
                accounts={accounts}
                currentUser={currentUser}
                onUpdateAccounts={(updated) => setAccounts(updated)}
                onSelectAccount={(acc) => setCurrentUser(acc)}
                onOpenAccountManagementModal={(accId) => {
                  setEditingAccountIdForModal(accId || null);
                  setIsAccountManagementOpen(true);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-300 py-3 px-4 text-xs text-slate-500 text-center shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-2 max-w-[1580px] mx-auto">
          <div>
            <strong>{settings.courtName}</strong> · Địa chỉ: {settings.address} · SĐT: {settings.phone}
          </div>
          <div>
            Hệ thống Quản lý thụ lý, giải quyết án & giám sát tiến độ thời gian thực © {new Date().getFullYear()} TAND
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Case Registration Modal */}
      <CaseRegistrationModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onSaveCase={handleSaveNewCase}
        courtName={settings.courtName}
      />

      {/* 2. Judge Assignment Modal */}
      {assigningCase && (
        <JudgeAssignmentModal
          isOpen={!!assigningCase}
          onClose={() => setAssigningCase(null)}
          caseItem={assigningCase}
          officials={officials}
          settings={settings}
          onSaveAssignment={handleSaveAssignment}
          onOpenPrintModal={handleOpenPrint}
        />
      )}

      {/* 3. Document Generator & Print Modal */}
      {printingDoc && (
        <DocumentGeneratorModal
          isOpen={!!printingDoc}
          onClose={() => setPrintingDoc(null)}
          caseItem={printingDoc.caseItem}
          settings={settings}
          templates={templates}
          onOpenTemplateManager={() => setIsTemplateManagerOpen(true)}
          initialTemplateCode={printingDoc.docType}
        />
      )}

      {/* 4. Comprehensive System Customization Hub (Unit, User, Targets, Templates) */}
      <SystemCustomizationModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
        initialTab={customizationInitialTab}
        settings={settings}
        onSaveSettings={setSettings}
        currentUser={currentUser}
        onSaveCurrentUser={handleUpdateCurrentUser}
        accounts={accounts}
        onSaveAccounts={setAccounts}
        officials={officials}
        onSaveOfficials={setOfficials}
        targets={targets}
        onSaveTargets={setTargets}
        templates={templates}
        onSaveTemplates={setTemplates}
        onOpenTemplateManagerModal={() => setIsTemplateManagerOpen(true)}
        onOpenWordUploader={() => setIsWordUploaderOpen(true)}
      />

      {/* Legacy Court Unit Settings Modal */}
      <CourtSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />

      {/* 5. Document Templates Management Modal */}
      <TemplateManagementModal
        isOpen={isTemplateManagerOpen}
        onClose={() => setIsTemplateManagerOpen(false)}
        templates={templates}
        onSaveTemplates={setTemplates}
        cases={cases}
        settings={settings}
      />

      {/* 6. Trial Preparation Extension Modal */}
      {trialExtCase && (
        <TrialExtensionModal
          isOpen={!!trialExtCase}
          onClose={() => setTrialExtCase(null)}
          caseItem={trialExtCase}
          officials={officials}
          onSaveExtension={(updated) => {
            handleUpdateCase(updated);
            pushNotification({
              type: 'DECISION_ISSUED',
              title: `GIA HẠN THỜI HẠN CHUẨN BỊ XÉT XỬ`,
              message: `Đã ban hành Quyết định gia hạn thời hạn chuẩn bị xét xử đối với vụ án ${updated.docketNumber} (${updated.title}).`,
              caseId: updated.id,
              caseDocket: updated.docketNumber,
              caseTitle: updated.title,
              actionLabel: 'Xem hồ sơ vụ án',
            });
          }}
          onOpenPrintModal={handleOpenPrint}
        />
      )}

      {/* 7. Detention Extension Modal */}
      {detentionExtCase && (
        <DetentionExtensionModal
          isOpen={!!detentionExtCase}
          onClose={() => setDetentionExtCase(null)}
          caseItem={detentionExtCase.caseItem}
          officials={officials}
          preselectedMeasure={detentionExtCase.measure}
          onSaveDetentionExtension={(updated) => {
            handleUpdateCase(updated);
            pushNotification({
              type: 'DECISION_ISSUED',
              title: `BAN HÀNH LỆNH GIA HẠN TẠM GIAM`,
              message: `Đã ký Lệnh gia hạn tạm giam đối với bị can/bị cáo trong vụ án ${updated.docketNumber} theo Điều 278 BLTTHS.`,
              caseId: updated.id,
              caseDocket: updated.docketNumber,
              caseTitle: updated.title,
              actionLabel: 'Xem lệnh tạm giam',
            });
          }}
          onOpenPrintModal={handleOpenPrint}
        />
      )}

      {/* 8. Account Switcher Modal */}
      <AccountSwitcherModal
        isOpen={isAccountSwitcherOpen}
        onClose={() => setIsAccountSwitcherOpen(false)}
        currentUser={currentUser}
        accounts={accounts}
        onSelectAccount={(acc) => {
          setCurrentUser(acc);
          setIsAccountSwitcherOpen(false);
        }}
        onOpenAccountManagement={() => {
          setIsAccountSwitcherOpen(false);
          setEditingAccountIdForModal(null);
          setIsAccountManagementOpen(true);
        }}
        onLogout={handleLogout}
      />

      {/* 9. Account Management Modal */}
      <AccountManagementModal
        isOpen={isAccountManagementOpen}
        onClose={() => {
          setIsAccountManagementOpen(false);
          setEditingAccountIdForModal(null);
        }}
        accounts={accounts}
        onSaveAccounts={(updated) => setAccounts(updated)}
        currentUser={currentUser}
        initialEditingAccountId={editingAccountIdForModal}
      />

      {/* 10. Permission Denied Alert Modal */}
      {deniedActionAlert && (
        <PermissionDeniedAlertModal
          isOpen={!!deniedActionAlert}
          onClose={() => setDeniedActionAlert(null)}
          actionName={deniedActionAlert.actionName}
          requiredRoleName={deniedActionAlert.requiredRoleName}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* 11. Word Template Uploader Modal (.docx) */}
      <WordTemplateUploaderModal
        isOpen={isWordUploaderOpen}
        onClose={() => setIsWordUploaderOpen(false)}
        onSaveTemplate={(newTmpl) => {
          const updated = [...templates, newTmpl];
          setTemplates(updated);
          saveStoredTemplates(updated);
          setIsWordUploaderOpen(false);
          pushNotification({
            type: 'DECISION_ISSUED',
            title: 'ĐÃ THÊM BIỂU MẪU TỪ FILE WORD',
            message: `Biểu mẫu "${newTmpl.name}" (${newTmpl.code}) đã được thêm thành công vào hệ thống.`,
            actionLabel: 'Xem biểu mẫu',
          });
        }}
        cases={cases}
        settings={settings}
      />
    </div>
  );
}
