import React from 'react';
import { Priority, TaskStatus, KpiStatus, UserRole } from '../../types';
import { AlertCircle, CheckCircle2, Clock, Hourglass, ShieldAlert, UserCheck } from 'lucide-react';

export const StatusBadge: React.FC<{ status: TaskStatus; className?: string }> = ({ status, className = '' }) => {
  switch (status) {
    case 'not_started':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          ยังไม่เริ่ม
        </span>
      );
    case 'in_progress':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          กำลังดำเนินการ
        </span>
      );
    case 'pending':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 ${className}`}>
          <Hourglass className="w-3 h-3 text-amber-500" />
          รอติดตาม
        </span>
      );
    case 'completed':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}>
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          เสร็จสิ้น
        </span>
      );
    case 'overdue':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 ${className}`}>
          <AlertCircle className="w-3 h-3 text-rose-600" />
          เกินกำหนด
        </span>
      );
    default:
      return null;
  }
};

export const PriorityBadge: React.FC<{ priority: Priority; className?: string }> = ({ priority, className = '' }) => {
  switch (priority) {
    case 'low':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 ${className}`}>
          ต่ำ
        </span>
      );
    case 'normal':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200 ${className}`}>
          ปกติ
        </span>
      );
    case 'high':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300 font-semibold ${className}`}>
          สูง
        </span>
      );
    case 'urgent':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse ${className}`}>
          <ShieldAlert className="w-3 h-3 text-rose-600" />
          เร่งด่วน
        </span>
      );
    default:
      return null;
  }
};

export const KpiBadge: React.FC<{ status: KpiStatus; rate?: number; className?: string }> = ({ status, rate, className = '' }) => {
  switch (status) {
    case 'achieved':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 ${className}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          🟢 บรรลุเป้าหมาย {rate !== undefined ? `(${rate}%)` : ''}
        </span>
      );
    case 'nearly':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-300 ${className}`}>
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          🟡 ใกล้บรรลุ {rate !== undefined ? `(${rate}%)` : ''}
        </span>
      );
    case 'not_achieved':
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-300 ${className}`}>
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          🔴 ไม่บรรลุ {rate !== undefined ? `(${rate}%)` : ''}
        </span>
      );
    default:
      return null;
  }
};

export const RoleBadge: React.FC<{ role: UserRole; className?: string }> = ({ role, className = '' }) => {
  switch (role) {
    case 'admin':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 ${className}`}>
          ผู้ดูแลระบบ (Admin)
        </span>
      );
    case 'head':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200 ${className}`}>
          หัวหน้ากลุ่มงาน
        </span>
      );
    case 'officer':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 ${className}`}>
          เจ้าหน้าที่
        </span>
      );
    case 'viewer':
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}>
          ผู้เข้าชม (Viewer)
        </span>
      );
    default:
      return null;
  }
};
