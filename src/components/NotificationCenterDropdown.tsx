import React, { useState } from 'react';
import { CourtNotification } from '../types/notification';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  Scale, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';

interface NotificationCenterDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CourtNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectNotification: (notif: CourtNotification) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSimulateNotification: (type: 'DEADLINE' | 'JUDGE' | 'DETENTION') => void;
}

export const NotificationCenterDropdown: React.FC<NotificationCenterDropdownProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotification,
  soundEnabled,
  onToggleSound,
  onSimulateNotification,
}) => {
  if (!isOpen) return null;

  const [filter, setFilter] = useState<'ALL' | 'URGENT' | 'JUDGE' | 'DETENTION'>('ALL');

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'URGENT') return n.type === 'DEADLINE_URGENT' || n.type === 'DEADLINE_WARNING';
    if (filter === 'JUDGE') return n.type === 'JUDGE_ASSIGNED';
    if (filter === 'DETENTION') return n.type === 'DETENTION_EXPIRING';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'DEADLINE_URGENT':
        return <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />;
      case 'DEADLINE_WARNING':
        return <Clock className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'DETENTION_EXPIRING':
        return <ShieldAlert className="w-4 h-4 text-orange-600 shrink-0" />;
      case 'JUDGE_ASSIGNED':
        return <Scale className="w-4 h-4 text-blue-600 shrink-0" />;
      case 'NEW_CASE':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      default:
        return <FileText className="w-4 h-4 text-teal-600 shrink-0" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-2xs"
        onClick={onClose}
      />

      {/* Dropdown Container */}
      <div className="absolute right-0 top-full mt-2 w-[92vw] sm:w-[420px] bg-white border border-slate-300 rounded-lg shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#991B1B] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-300" />
            <span className="font-bold text-sm tracking-wide uppercase">Trung Tâm Thông Báo Đẩy</span>
            {unreadCount > 0 && (
              <span className="bg-amber-400 text-red-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {unreadCount} mới
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Đang bật âm thanh chuông (Bấm để tắt)' : 'Đang tắt âm thanh (Bấm để bật)'}
              className="p-1 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-300" /> : <VolumeX className="w-4 h-4 text-white/50" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white rounded hover:bg-white/10 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter & Actions Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center justify-between gap-1 text-[11px]">
          <div className="flex items-center gap-1">
            {[
              { key: 'ALL', label: 'Tất cả' },
              { key: 'URGENT', label: 'Khẩn cấp / Hạn' },
              { key: 'JUDGE', label: 'Phân công' },
              { key: 'DETENTION', label: 'Tạm giam' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as typeof filter)}
                className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                  filter === f.key
                    ? 'bg-red-800 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-red-700 hover:text-red-900 font-semibold flex items-center gap-0.5 hover:underline"
                title="Đánh dấu tất cả là đã đọc"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đã đọc hết</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-slate-500 hover:text-rose-700 p-1 rounded hover:bg-slate-200"
                title="Xóa danh sách thông báo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Simulator Tools for User & Assessors */}
        <div className="bg-amber-50/70 border-b border-amber-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-amber-900">
          <span className="font-semibold flex items-center gap-1 text-[10.5px]">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Thử nghiệm đẩy:
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSimulateNotification('DEADLINE')}
              className="px-1.5 py-0.5 bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 rounded font-semibold text-[10px] transition-colors"
            >
              + Hạn khẩn cấp
            </button>
            <button
              onClick={() => onSimulateNotification('JUDGE')}
              className="px-1.5 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 rounded font-semibold text-[10px] transition-colors"
            >
              + Phân công
            </button>
            <button
              onClick={() => onSimulateNotification('DETENTION')}
              className="px-1.5 py-0.5 bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300 rounded font-semibold text-[10px] transition-colors"
            >
              + Tạm giam
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 text-xs">
          {filteredNotifs.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-60" />
              <p className="font-medium text-xs">Không có thông báo nào trong mục này</p>
              <p className="text-[11px] text-slate-400 mt-1">Các thông báo về thời hạn và phân công sẽ hiển thị tức thì tại đây</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                  !notif.isRead ? 'bg-amber-50/40' : 'bg-white'
                }`}
              >
                <div className="pt-0.5">{getIcon(notif.type)}</div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 text-xs line-clamp-1">
                      {notif.title}
                    </span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                    )}
                  </div>

                  <p className="text-slate-600 text-[11.5px] leading-relaxed">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10.5px]">
                    <span className="text-slate-400">
                      {new Date(notif.timestamp).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    {notif.caseId && (
                      <span className="text-red-700 font-bold hover:underline flex items-center gap-0.5">
                        {notif.actionLabel || 'Xem vụ án'}
                        <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
