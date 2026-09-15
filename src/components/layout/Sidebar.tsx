import React from 'react';
import { useApp, NavTab } from '../../context/AppContext';
import { HospitalLogo } from '../common/HospitalLogo';
import { 
  LayoutDashboard, 
  FolderKanban,
  CheckSquare, 
  Layers, 
  Users, 
  Calendar, 
  Target, 
  Paperclip, 
  FileText, 
  Bell, 
  Settings, 
  X,
  Stethoscope,
  Activity,
  HeartPulse,
  Baby,
  Network
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const { activeTab, setActiveTab, projects, tasks, unreadNotificationsCount, currentUser } = useApp();

  const overdueCount = tasks.filter(t => t.status === 'overdue').length;

  const navItems: { id: NavTab; label: string; icon: any; badge?: number | string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'บันทึกโครงการ', icon: FolderKanban, badge: projects.length, badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { id: 'tasks', label: 'งานทั้งหมด', icon: CheckSquare, badge: overdueCount > 0 ? `${overdueCount} เกิน` : tasks.length, badgeColor: overdueCount > 0 ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400' },
    { id: 'workgroups', label: '13 กลุ่มงาน', icon: Layers, badge: '13', badgeColor: 'bg-slate-800 text-emerald-400' },
    { id: 'personnel', label: 'บุคลากร', icon: Users },
    { id: 'calendar', label: 'ปฏิทินงาน', icon: Calendar },
    { id: 'kpi', label: 'KPI เป้าหมาย', icon: Target },
    { id: 'evidence', label: 'หลักฐานงาน', icon: Paperclip },
    { id: 'reports', label: 'รายงานสรุป', icon: FileText },
    { id: 'epidem', label: 'ระบบระบาดวิทยา', icon: Activity, badge: 'Epidem', badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { id: 'health_promotion', label: 'งานส่งเสริมสุขภาพ', icon: HeartPulse, badge: 'วิ่ง', badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { id: 'anc', label: 'งาน ANC (ฝากครรภ์)', icon: Baby, badge: 'ANC', badgeColor: 'bg-pink-500/20 text-pink-400 border border-pink-500/30' },
    { id: 'it_pcu', label: 'งาน IT PCU', icon: Network, badge: 'Exchange', badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined, badgeColor: 'bg-red-500 text-white animate-pulse' },
    { id: 'settings', label: 'ตั้งค่าระบบ', icon: Settings },
  ];

  const handleNavClick = (tabId: NavTab) => {
    setActiveTab(tabId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container - Clean Utility Dashboard Style */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0F172A] text-white flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-800
        lg:translate-x-0 lg:static lg:z-auto
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header Branding */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <HospitalLogo size="md" className="shrink-0" />
            <div className="min-w-0">
              <h1 className="text-sm font-bold leading-tight tracking-wider text-white truncate">รพ.โพนนาแก้ว</h1>
              <p className="text-[10.5px] text-emerald-400 font-medium truncate">บริการปฐมภูมิและองค์รวม</p>
            </div>
          </div>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            aria-label="ปิดเมนู"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 text-sm overflow-y-auto custom-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={item.label}
                className={`
                  w-full flex items-center justify-between p-2.5 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer
                  ${isActive 
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 font-semibold' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-semibold ${item.badgeColor || 'bg-slate-800 text-slate-400'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card at Footer */}
        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={() => setActiveTab('settings')}
            className="w-full bg-slate-800 hover:bg-slate-700/80 rounded-xl p-3 flex items-center gap-3 transition text-left cursor-pointer border border-slate-700/50"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs">
              {currentUser.name.slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.position}</p>
            </div>
            <span className="text-xs text-slate-400 hover:text-white">⚙️</span>
          </button>
        </div>
      </aside>
    </>
  );
};
