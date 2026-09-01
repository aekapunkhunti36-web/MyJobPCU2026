import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';
import { Bell, CheckCheck, Trash2, AlertCircle, Clock, CheckCircle2, Paperclip, Target, ArrowRight } from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, unreadNotificationsCount, setSelectedTaskForDetail, tasks, setActiveTab } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filterType === 'unread') return !n.read;
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'overdue':
        return <div className="p-2 rounded-xl bg-rose-100 text-rose-600"><AlertCircle className="w-5 h-5" /></div>;
      case 'due_soon':
        return <div className="p-2 rounded-xl bg-amber-100 text-amber-600"><Clock className="w-5 h-5" /></div>;
      case 'new_task':
        return <div className="p-2 rounded-xl bg-teal-100 text-teal-600"><CheckCircle2 className="w-5 h-5" /></div>;
      case 'evidence_added':
        return <div className="p-2 rounded-xl bg-blue-100 text-blue-600"><Paperclip className="w-5 h-5" /></div>;
      case 'kpi_alert':
        return <div className="p-2 rounded-xl bg-purple-100 text-purple-600"><Target className="w-5 h-5" /></div>;
      default:
        return <div className="p-2 rounded-xl bg-slate-100 text-slate-600"><Bell className="w-5 h-5" /></div>;
    }
  };

  const handleNotifClick = (notif: NotificationItem) => {
    markNotificationRead(notif.id);
    if (notif.relatedTaskId) {
      const task = tasks.find(t => t.id === notif.relatedTaskId);
      if (task) {
        setSelectedTaskForDetail(task);
        setActiveTab('tasks');
      }
    } else if (notif.relatedKpiId) {
      setActiveTab('kpi');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>🔔 ศูนย์การแจ้งเตือนงานและตัวชี้วัด (Notifications)</span>
            {unreadNotificationsCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                ใหม่ {unreadNotificationsCount} รายการ
              </span>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            แจ้งเตือนงานมอบหมายใหม่ งานใกล้ครบกำหนด งานเกินกำหนด และการส่งหลักฐาน
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            <span>ทำเครื่องหมายว่าอ่านทั้งหมดแล้ว</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition ${filterType === 'all' ? 'bg-slate-800 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          ทั้งหมด ({notifications.length})
        </button>
        <button
          onClick={() => setFilterType('unread')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition ${filterType === 'unread' ? 'bg-teal-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          ยังไม่ได้อ่าน ({unreadNotificationsCount})
        </button>
        <button
          onClick={() => setFilterType('overdue')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition ${filterType === 'overdue' ? 'bg-rose-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-rose-700 hover:bg-rose-50'}`}
        >
          เกินกำหนด
        </button>
        <button
          onClick={() => setFilterType('due_soon')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition ${filterType === 'due_soon' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-amber-700 hover:bg-amber-50'}`}
        >
          ใกล้ครบกำหนด
        </button>
        <button
          onClick={() => setFilterType('new_task')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition ${filterType === 'new_task' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-blue-700 hover:bg-blue-50'}`}
        >
          มอบหมายงาน
        </button>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            ไม่มีรายการแจ้งเตือนในหมวดหมู่นี้
          </div>
        ) : (
          filteredNotifs.map(notif => (
            <div
              key={notif.id}
              onClick={() => handleNotifClick(notif)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50 cursor-pointer transition ${!notif.read ? 'bg-teal-50/30' : ''}`}
            >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {getNotifIcon(notif.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {notif.title}
                    </h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">{notif.message}</p>
                  <span className="text-[11px] text-slate-400 block">{notif.timestamp}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notif.id);
                  }}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  title="ลบการแจ้งเตือนนี้"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
