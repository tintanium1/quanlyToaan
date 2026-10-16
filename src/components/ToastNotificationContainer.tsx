import React, { useEffect, useState, useRef } from 'react';
import { ActiveToast } from '../types/notification';
import { 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Scale, 
  FileText, 
  CheckCircle2, 
  X, 
  ArrowRight,
  Sparkles,
  Bell
} from 'lucide-react';

interface ToastNotificationContainerProps {
  toasts: ActiveToast[];
  onDismiss: (id: string) => void;
  onNavigateCase?: (caseId: string) => void;
}

export const ToastNotificationContainer: React.FC<ToastNotificationContainerProps> = ({
  toasts,
  onDismiss,
  onNavigateCase,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      aria-live="polite"
      aria-label="Thông báo đẩy Tòa án"
      className="fixed top-16 right-3 md:right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[92vw] sm:w-96 pointer-events-none"
    >
      {toasts.map((toast) => (
        <SingleToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          onNavigateCase={onNavigateCase}
        />
      ))}
    </div>
  );
};

interface SingleToastItemProps {
  toast: ActiveToast;
  onDismiss: (id: string) => void;
  onNavigateCase?: (caseId: string) => void;
}

const SingleToastItem: React.FC<SingleToastItemProps> = ({
  toast,
  onDismiss,
  onNavigateCase,
}) => {
  const duration = toast.duration || 6500;
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);

  useEffect(() => {
    let animFrame: number;
    const updateProgress = () => {
      if (!isPaused) {
        const elapsed = Date.now() - startTimeRef.current;
        const currentRemaining = Math.max(0, remainingTimeRef.current - elapsed);
        const percent = (currentRemaining / duration) * 100;
        setProgress(percent);

        if (currentRemaining <= 0) {
          onDismiss(toast.id);
          return;
        }
      }
      animFrame = requestAnimationFrame(updateProgress);
    };

    animFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animFrame);
  }, [isPaused, duration, onDismiss, toast.id]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
  };

  const handleMouseLeave = () => {
    startTimeRef.current = Date.now();
    setIsPaused(false);
  };

  const handleClickAction = () => {
    if (toast.caseId && onNavigateCase) {
      onNavigateCase(toast.caseId);
    }
    onDismiss(toast.id);
  };

  // Color configurations based on type
  const getConfig = () => {
    switch (toast.type) {
      case 'DEADLINE_URGENT':
        return {
          borderColor: 'border-red-600',
          bgColor: 'bg-white',
          headerBg: 'bg-red-50 text-red-900 border-red-200',
          badgeText: 'HẠN KHẨN CẤP',
          badgeClass: 'bg-red-800 text-white',
          icon: <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 animate-bounce" />,
          progressColor: 'bg-red-600',
          btnClass: 'bg-red-700 hover:bg-red-800 text-white',
        };
      case 'DEADLINE_WARNING':
        return {
          borderColor: 'border-amber-500',
          bgColor: 'bg-white',
          headerBg: 'bg-amber-50 text-amber-900 border-amber-200',
          badgeText: 'CẢNH BÁO THỜI HẠN',
          badgeClass: 'bg-amber-700 text-white',
          icon: <Clock className="w-4 h-4 text-amber-600 shrink-0" />,
          progressColor: 'bg-amber-500',
          btnClass: 'bg-amber-700 hover:bg-amber-800 text-white',
        };
      case 'DETENTION_EXPIRING':
        return {
          borderColor: 'border-orange-500',
          bgColor: 'bg-white',
          headerBg: 'bg-orange-50 text-orange-950 border-orange-200',
          badgeText: 'HẠN TẠM GIAM',
          badgeClass: 'bg-orange-800 text-white',
          icon: <ShieldAlert className="w-4 h-4 text-orange-600 shrink-0" />,
          progressColor: 'bg-orange-600',
          btnClass: 'bg-orange-800 hover:bg-orange-900 text-white',
        };
      case 'JUDGE_ASSIGNED':
        return {
          borderColor: 'border-blue-600',
          bgColor: 'bg-white',
          headerBg: 'bg-blue-50 text-blue-950 border-blue-200',
          badgeText: 'PHÂN CÔNG MỚI',
          badgeClass: 'bg-blue-800 text-white',
          icon: <Scale className="w-4 h-4 text-blue-600 shrink-0" />,
          progressColor: 'bg-blue-600',
          btnClass: 'bg-blue-700 hover:bg-blue-800 text-white',
        };
      case 'NEW_CASE':
        return {
          borderColor: 'border-emerald-600',
          bgColor: 'bg-white',
          headerBg: 'bg-emerald-50 text-emerald-950 border-emerald-200',
          badgeText: 'THỤ LÝ MỚI',
          badgeClass: 'bg-emerald-800 text-white',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
          progressColor: 'bg-emerald-600',
          btnClass: 'bg-emerald-700 hover:bg-emerald-800 text-white',
        };
      case 'DECISION_ISSUED':
      default:
        return {
          borderColor: 'border-teal-600',
          bgColor: 'bg-white',
          headerBg: 'bg-teal-50 text-teal-950 border-teal-200',
          badgeText: 'QUYẾT ĐỊNH MỚI',
          badgeClass: 'bg-teal-800 text-white',
          icon: <FileText className="w-4 h-4 text-teal-600 shrink-0" />,
          progressColor: 'bg-teal-600',
          btnClass: 'bg-teal-700 hover:bg-teal-800 text-white',
        };
    }
  };

  const config = getConfig();

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto rounded-lg shadow-xl border-l-4 ${config.borderColor} ${config.bgColor} border border-slate-200 overflow-hidden transform transition-all duration-200 animate-in slide-in-from-right-5 fade-in`}
    >
      {/* Toast Header */}
      <div className={`px-3 py-2 border-b flex items-center justify-between text-xs ${config.headerBg}`}>
        <div className="flex items-center gap-1.5 font-bold tracking-wide">
          {config.icon}
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${config.badgeClass}`}>
            {config.badgeText}
          </span>
          {typeof toast.daysRemaining === 'number' && (
            <span className="text-[11px] font-bold text-red-700 ml-1">
              (Còn {toast.daysRemaining} ngày)
            </span>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-slate-700 p-0.5 rounded hover:bg-black/5 transition-colors"
          title="Đóng thông báo"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Toast Body */}
      <div className="p-3 text-xs">
        <h4 className="font-bold text-slate-900 text-xs mb-1 line-clamp-1">
          {toast.title}
        </h4>
        <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
          {toast.message}
        </p>

        {/* Footer actions */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[10.5px] text-slate-400 font-medium">
            {new Date(toast.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>

          {toast.caseId && (
            <button
              onClick={handleClickAction}
              className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors shadow-2xs ${config.btnClass}`}
            >
              <span>{toast.actionLabel || 'Xem vụ án'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Countdown Progress Bar */}
      <div className="h-1 w-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full transition-all ease-linear ${config.progressColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
