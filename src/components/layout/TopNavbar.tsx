import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RoleBadge } from '../common/Badge';
import { 
  Menu, 
  Search, 
  Plus, 
  Bell, 
  UserCircle2, 
  ChevronDown, 
  Check, 
  AlertCircle, 
  Calendar as CalendarIcon,
  X,
  ExternalLink,
  Shield,
  FileCheck,
  LogOut,
  KeyRound,
  UserCheck,
  Cloud,
  CloudOff,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface TopNavbarProps {
  setIsMobileOpen: (open: boolean) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ setIsMobileOpen }) => {
  const { 
    activeTab, 
    currentUser, 
    personnel, 
    switchUser, 
    switchUserWithPassword,
    logout,
    notifications, 
    unreadNotificationsCount, 
    markNotificationRead, 
    markAllNotificationsRead,
    setIsCreateTaskModalOpen,
    globalSearch,
    setGlobalSearch,
    setActiveTab,
    setSelectedTaskForDetail,
    tasks,
    isFirebaseConnected,
    syncStatus
  } = useApp();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  // Switch User with Password Modal State
  const [switchTargetUser, setSwitchTargetUser] = useState<typeof personnel[0] | null>(null);
  const [switchPassword, setSwitchPassword] = useState('');
  const [showSwitchPassword, setShowSwitchPassword] = useState(false);
  const [switchError, setSwitchError] = useState('');
  const [switchSuccessMsg, setSwitchSuccessMsg] = useState('');

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return '📊 แผงควบคุมภาพรวม (Executive Dashboard)';
      case 'projects': return '📂 ระบบบันทึกและติดตามโครงการ (Projects)';
      case 'tasks': return '📋 ระบบบริหารจัดการงานและภารกิจทั้งหมด';
      case 'workgroups': return '🗂️ โครงสร้าง 13 กลุ่มงานบริการปฐมภูมิและองค์รวม';
      case 'personnel': return '👥 ทำเนียบบุคลากรและภารกิจรับผิดชอบ';
      case 'calendar': return '📅 ปฏิทินปฏิบัติงาน ลงพื้นที่ และกิจกรรม';
      case 'kpi': return '🎯 การกำกับติดตามตัวชี้วัดผลการดำเนินงาน (KPI)';
      case 'evidence': return '📎 คลังจัดเก็บเอกสารและหลักฐานการดำเนินงาน';
      case 'reports': return '📑 ศูนย์จัดทำรายงานและส่งออกข้อมูล (Report Center)';
      case 'epidem': return '🩺 ระบบงานระบาดวิทยา รพ.โพนนาแก้ว (Epidem System)';
      case 'health_promotion': return '🏃 งานส่งเสริมสุขภาพและกิจกรรมทางกาย (Health Promotion & Running)';
      case 'notifications': return '🔔 ศูนย์การแจ้งเตือนงานและตัวชี้วัด';
      case 'settings': return '⚙️ ตั้งค่าระบบและการเชื่อมต่อ Firebase';
      default: return 'ระบบบริหารงานกลุ่มงานบริการด้านปฐมภูมิและองค์รวม';
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    setIsNotifDropdownOpen(false);
    if (notif.relatedTaskId) {
      const targetTask = tasks.find(t => t.id === notif.relatedTaskId);
      if (targetTask) {
        setSelectedTaskForDetail(targetTask);
        setActiveTab('tasks');
      }
    } else if (notif.relatedKpiId) {
      setActiveTab('kpi');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shadow-2xs">
      {/* Left side: Hamburger & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          aria-label="เปิดเมนู"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <h2 className="font-bold text-base sm:text-lg text-slate-800 leading-tight">
            {getPageTitle()}
          </h2>
          <span className="hidden md:inline-block bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
            v2.4.0
          </span>
          <button
            onClick={() => setActiveTab('settings')}
            title="คลิกเพื่อดูสถานะฐานข้อมูล Firebase Firestore"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
              isFirebaseConnected 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {isFirebaseConnected ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <Cloud className="w-3 h-3 text-emerald-600" />
                <span>Cloud Synced</span>
              </>
            ) : (
              <>
                <CloudOff className="w-3 h-3 text-amber-600" />
                <span>Local Cache</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right side: Search, Action, Notification & User Role Switcher */}
      <div className="flex items-center gap-3">
        
        {/* Quick Search */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <input
            type="text"
            placeholder="ค้นหางาน, ชื่อเจ้าหน้าที่..."
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="w-full bg-slate-100 text-sm px-4 py-2 rounded-full border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none text-slate-800 transition-all placeholder:text-slate-400"
          />
          {globalSearch && (
            <button 
              onClick={() => setGlobalSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Add Task Button */}
        <button
          onClick={() => setIsCreateTaskModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">+ เพิ่มงานใหม่</span>
          <span className="sm:hidden">เพิ่ม</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full relative transition cursor-pointer"
            title="การแจ้งเตือน"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-sm">การแจ้งเตือน</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                      ใหม่ {unreadNotificationsCount}
                    </span>
                  )}
                </div>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    อ่านทั้งหมดแล้ว
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    ไม่มีการแจ้งเตือนใหม่
                  </div>
                ) : (
                  notifications.slice(0, 6).map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`p-3 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${!notif.read ? 'bg-blue-50/40' : ''}`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                        notif.type === 'overdue' ? 'bg-rose-100 text-rose-600' :
                        notif.type === 'due_soon' ? 'bg-amber-100 text-amber-600' :
                        notif.type === 'evidence_added' ? 'bg-blue-100 text-blue-600' :
                        'bg-emerald-100 text-emerald-600'
                      }`}>
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{notif.title}</p>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                      </div>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 text-center bg-slate-50 rounded-b-2xl">
                <button
                  onClick={() => {
                    setActiveTab('notifications');
                    setIsNotifDropdownOpen(false);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  ดูการแจ้งเตือนทั้งหมด ({notifications.length}) →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Role Switcher & Profile */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-full sm:rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.name.slice(0, 2)}
            </div>
            <div className="hidden md:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{currentUser.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[10px] text-slate-500 truncate max-w-[130px]">{currentUser.position}</div>
            </div>
          </button>

          {/* Dropdown to switch users/roles */}
          {isUserDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-84 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">ผู้ใช้งานปัจจุบัน</p>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    @{currentUser.username || currentUser.id}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-800 mt-1">{currentUser.name}</p>
                <p className="text-xs text-slate-600">{currentUser.position}</p>
                <div className="mt-2 flex items-center justify-between">
                  <RoleBadge role={currentUser.role} />
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsUserDropdownOpen(false);
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline"
                  >
                    <KeyRound className="w-3 h-3" />
                    เปลี่ยนรหัสผ่าน
                  </button>
                </div>
              </div>

              <div className="px-4 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>สลับบัญชีผู้ใช้ (Switch User)</span>
                <span className="text-[10px] font-normal text-slate-400">{personnel.length} บัญชี</span>
              </div>

              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                {personnel.map(user => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        if (!isSelected) {
                          setSwitchTargetUser(user);
                          setSwitchPassword('');
                          setSwitchError('');
                          setSwitchSuccessMsg('');
                        }
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between transition cursor-pointer ${isSelected ? 'bg-blue-50/60' : ''}`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-semibold text-slate-800 truncate flex items-center gap-1.5">
                          {user.name}
                          {isSelected && <span className="text-[10px] text-blue-600 font-bold">(ปัจจุบัน)</span>}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          <span className="font-mono text-slate-400">@{user.username}</span> • {user.position}
                        </p>
                      </div>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-300 shrink-0 hover:text-slate-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Logout Button */}
              <div className="p-2 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                <button
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    logout();
                  }}
                  className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer border border-red-200/60"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>ออกจากระบบ (Sign Out)</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Password Verification Modal for Switching Users */}
      {switchTargetUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">ยืนยันรหัสผ่านเพื่อสลับบัญชี</h3>
                  <p className="text-[11px] text-slate-300">ระบบความปลอดภัย โรงพยาบาลโพนนาแก้ว</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSwitchTargetUser(null);
                  setSwitchPassword('');
                  setSwitchError('');
                  setSwitchSuccessMsg('');
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target User Info Card */}
            <div className="p-6 space-y-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                  {switchTargetUser.name.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-slate-800 text-sm truncate">{switchTargetUser.name}</p>
                    <RoleBadge role={switchTargetUser.role} />
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-0.5">{switchTargetUser.position}</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">ชื่อผู้ใช้: @{switchTargetUser.username}</p>
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  ผู้ใช้งานปัจจุบันไม่สามารถสลับเป็นบัญชีอื่นได้โดยตรง <strong>กรุณากรอกรหัสผ่านของ &quot;{switchTargetUser.name}&quot;</strong> เพื่อยืนยันตัวตน
                </span>
              </div>

              {switchError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{switchError}</span>
                </div>
              )}

              {switchSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{switchSuccessMsg}</span>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!switchTargetUser) return;
                  setSwitchError('');
                  const res = switchUserWithPassword(switchTargetUser.id, switchPassword);
                  if (res.success) {
                    setSwitchSuccessMsg(`สลับเข้าสู่ระบบสำเร็จ กำลังโหลดข้อมูล...`);
                    setTimeout(() => {
                      setSwitchTargetUser(null);
                      setSwitchPassword('');
                      setSwitchSuccessMsg('');
                    }, 600);
                  } else {
                    setSwitchError(res.message || 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    รหัสผ่านของบัญชีนี้ (Password)
                  </label>
                  <div className="relative">
                    <input
                      type={showSwitchPassword ? 'text' : 'password'}
                      value={switchPassword}
                      onChange={(e) => setSwitchPassword(e.target.value)}
                      placeholder="กรอกรหัสผ่าน..."
                      autoFocus
                      required
                      className="w-full pl-3.5 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSwitchPassword(!showSwitchPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showSwitchPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    * สามารถดูรหัสผ่านได้จากหน้ารายชื่อบุคลากร (สำหรับผู้ดูแลระบบ)
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSwitchTargetUser(null);
                      setSwitchPassword('');
                      setSwitchError('');
                      setSwitchSuccessMsg('');
                    }}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>ยืนยันและสลับบัญชี</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
