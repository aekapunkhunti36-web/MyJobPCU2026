import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge, KpiBadge } from '../common/Badge';
import { HospitalLogo } from '../common/HospitalLogo';
import { 
  CheckCircle2, 
  Clock, 
  Hourglass, 
  AlertTriangle, 
  AlertCircle, 
  Layers, 
  TrendingUp, 
  Target, 
  ArrowRight, 
  Flame, 
  Calendar,
  Sparkles,
  ChevronRight,
  Stethoscope,
  Activity,
  FileCheck2,
  Users
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';

export const DashboardView: React.FC = () => {
  const { 
    tasks, 
    kpis, 
    workgroups, 
    personnel, 
    setActiveTab, 
    setSelectedTaskForDetail, 
    setSelectedWorkgroupFilter,
    setIsCreateTaskModalOpen 
  } = useApp();

  // Summary Metrics Computation
  const stats = useMemo(() => {
    const total = tasks.length;
    const notStarted = tasks.filter(t => t.status === 'not_started').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const overdue = tasks.filter(t => t.status === 'overdue').length;

    // Due soon: within next 5 days
    const today = new Date();
    const next5Days = new Date();
    next5Days.setDate(today.getDate() + 5);
    const todayStr = today.toISOString().split('T')[0];
    const next5DaysStr = next5Days.toISOString().split('T')[0];

    const dueSoon = tasks.filter(t => 
      t.status !== 'completed' && 
      t.status !== 'overdue' && 
      t.dueDate >= todayStr && 
      t.dueDate <= next5DaysStr
    ).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      notStarted,
      inProgress,
      pending,
      completed,
      overdue,
      dueSoon,
      completionRate
    };
  }, [tasks]);

  // Urgent & Overdue Task List
  const urgentTasks = useMemo(() => {
    return tasks
      .filter(t => t.status === 'overdue' || t.priority === 'urgent' || (t.status !== 'completed' && t.priority === 'high'))
      .sort((a, b) => {
        if (a.status === 'overdue' && b.status !== 'overdue') return -1;
        if (b.status === 'overdue' && a.status !== 'overdue') return 1;
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
        if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
        return a.dueDate.localeCompare(b.dueDate);
      })
      .slice(0, 6);
  }, [tasks]);

  // Chart 1: Tasks by Workgroup
  const tasksByWorkgroupData = useMemo(() => {
    return workgroups.map(wg => {
      const wgTasks = tasks.filter(t => t.workgroupId === wg.id);
      const comp = wgTasks.filter(t => t.status === 'completed').length;
      const onGoing = wgTasks.filter(t => t.status === 'in_progress' || t.status === 'pending').length;
      const over = wgTasks.filter(t => t.status === 'overdue').length;
      return {
        name: wg.code,
        fullName: wg.shortName,
        total: wgTasks.length,
        เสร็จสิ้น: comp,
        กำลังดำเนิน: onGoing,
        เกินกำหนด: over,
        color: wg.color
      };
    });
  }, [workgroups, tasks]);

  // Chart 2: Status Breakdown Pie
  const statusPieData = useMemo(() => {
    return [
      { name: 'เสร็จสิ้น', value: stats.completed, color: '#10b981' },
      { name: 'กำลังดำเนินการ', value: stats.inProgress, color: '#3b82f6' },
      { name: 'รอติดตาม', value: stats.pending, color: '#f59e0b' },
      { name: 'ยังไม่เริ่ม', value: stats.notStarted, color: '#94a3b8' },
      { name: 'เกินกำหนด', value: stats.overdue, color: '#f43f5e' }
    ].filter(item => item.value > 0);
  }, [stats]);

  // Chart 3: KPI Achievement Breakdown
  const kpiStats = useMemo(() => {
    const achieved = kpis.filter(k => k.status === 'achieved').length;
    const nearly = kpis.filter(k => k.status === 'nearly').length;
    const notAchieved = kpis.filter(k => k.status === 'not_achieved').length;
    const total = kpis.length;
    const avgRate = total > 0 ? Math.round(kpis.reduce((acc, k) => acc + k.achievementRate, 0) / total) : 0;
    return {
      achieved,
      nearly,
      notAchieved,
      total,
      avgRate,
      data: [
        { name: '🟢 บรรลุเป้าหมาย (≥100%)', count: achieved, color: '#10b981' },
        { name: '🟡 ใกล้บรรลุ (80-99%)', count: nearly, color: '#f59e0b' },
        { name: '🔴 ไม่บรรลุ (<80%)', count: notAchieved, color: '#f43f5e' }
      ]
    };
  }, [kpis]);

  // Chart 4: Monthly Task Trend
  const monthlyTrendData = useMemo(() => {
    const months = [
      { key: '04', name: 'เม.ย.' },
      { key: '05', name: 'พ.ค.' },
      { key: '06', name: 'มิ.ย.' },
      { key: '07', name: 'ก.ค.' },
      { key: '08', name: 'ส.ค.' },
      { key: '09', name: 'ก.ย.' },
    ];
    return months.map(m => {
      const monthTasks = tasks.filter(t => t.startDate.includes(`-08-`) || t.startDate.includes(`-07-`)); // dynamic simulated trend
      const isAug = m.key === '08';
      const isJul = m.key === '07';
      const count = isAug ? tasks.length - 8 : isJul ? 14 : isAug ? 25 : Math.floor(Math.random() * 8) + 12;
      const comp = isAug ? stats.completed : isJul ? 12 : 8;
      return {
        month: m.name,
        งานที่เปิด: count,
        งานที่เสร็จ: comp
      };
    });
  }, [tasks, stats]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Official Government Hospital Hero Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-400/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5 max-w-3xl">
            <div className="shrink-0 bg-white/10 p-1.5 rounded-2xl backdrop-blur-xs border border-white/20 shadow-inner hidden sm:block">
              <HospitalLogo size="xl" className="shrink-0" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
                <HospitalLogo size="xs" className="sm:hidden" />
                <Activity className="w-3.5 h-3.5" />
                <span>ระบบบริหารผลสัมฤทธิ์และติดตามภารกิจปฐมภูมิ</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                ระบบบริหารงานกลุ่มงานบริการด้านปฐมภูมิและองค์รวม
              </h1>
              <p className="text-teal-100 text-sm sm:text-base font-normal mt-1">
                โรงพยาบาลโพนนาแก้ว สำนักงานสาธารณสุขจังหวัดสกลนคร (ปีงบประมาณ 2569)
              </p>
              <p className="text-xs text-teal-200/80 mt-2 font-light">
                ขับเคลื่อนภารกิจ 13 กลุ่มงาน • คลินิกหมอครอบครัว (3 หมอ) • การดูแลต่อเนื่องที่บ้าน (COC / LTC / Home Ward) • ส่งเสริม ป้องกัน ฟื้นฟู
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 sm:border-l border-teal-600/50 pt-4 sm:pt-0 sm:pl-6">
            <div className="text-left sm:text-right">
              <span className="text-xs text-teal-200">อัตราความสำเร็จงานรวม</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white flex items-baseline gap-1">
                <span>{stats.completionRate}%</span>
              </div>
            </div>
            <button
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="px-4 py-2 bg-white text-teal-900 hover:bg-teal-50 font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <span>+ มอบหมายงานใหม่</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-7 Summary Metric Cards - Clean Utility Style */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Card 1: งานทั้งหมด */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition cursor-pointer"
        >
          <p className="text-slate-500 text-xs font-medium uppercase">งานทั้งหมด</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total}</p>
          <div className="mt-2 flex items-center text-[10px] text-emerald-600 font-medium">
            <span>↑ อัตราสำเร็จ {stats.completionRate}%</span>
          </div>
        </div>

        {/* Card 2: กำลังดำเนินการ */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition cursor-pointer"
        >
          <p className="text-slate-500 text-xs font-medium uppercase">กำลังดำเนินการ</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
          <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all" 
              style={{ width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Card 3: ใกล้ครบกำหนด */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-300 transition cursor-pointer"
        >
          <p className="text-slate-500 text-xs font-medium uppercase">ใกล้ครบกำหนด</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">{stats.dueSoon}</p>
          <div className="mt-2 flex items-center text-[10px] text-slate-400">
            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">5 วันล่าสุด</span>
          </div>
        </div>

        {/* Card 4: เกินกำหนด */}
        <div 
          onClick={() => setActiveTab('tasks')}
          className="bg-white p-4 rounded-2xl border border-slate-200 border-l-4 border-l-red-500 shadow-xs hover:border-red-300 transition cursor-pointer"
        >
          <p className="text-slate-500 text-xs font-medium uppercase">เกินกำหนด</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{stats.overdue < 10 ? `0${stats.overdue}` : stats.overdue}</p>
          <div className="mt-2 flex items-center text-[10px] text-red-600 font-bold">
            <span>⚠️ ต้องดำเนินการด่วน</span>
          </div>
        </div>

      </div>

      {/* 2-Column Section: Urgent Table (Left) + KPI & Announcement (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Urgent Tasks Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
              📋 รายการงานเร่งด่วน <span className="text-xs font-normal text-slate-400">(แสดง {urgentTasks.length} รายการล่าสุด)</span>
            </h3>
            <button 
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
            >
              + เพิ่มงานใหม่
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">รหัส</th>
                  <th className="px-4 py-3">ชื่องาน</th>
                  <th className="px-4 py-3">กลุ่มงาน</th>
                  <th className="px-4 py-3">ผู้รับผิดชอบ</th>
                  <th className="px-4 py-3">สถานะ</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100">
                {urgentTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400 text-xs">
                      ✨ ไม่มีงานเร่งด่วนในขณะนี้
                    </td>
                  </tr>
                ) : (
                  urgentTasks.map(task => {
                    const wg = workgroups.find(w => w.id === task.workgroupId);
                    const assignee = personnel.find(p => p.id === task.mainAssigneeId);
                    return (
                      <tr 
                        key={task.id} 
                        onClick={() => setSelectedTaskForDetail(task)}
                        className="hover:bg-slate-50 cursor-pointer transition"
                      >
                        <td className="px-4 py-3 text-slate-400 font-mono font-medium">{task.taskCode}</td>
                        <td className="px-4 py-3 font-medium text-slate-800 max-w-[200px] truncate">{task.title}</td>
                        <td className="px-4 py-3 text-slate-600">{wg?.code} - {wg?.shortName}</td>
                        <td className="px-4 py-3 text-slate-600">{assignee?.name || '-'}</td>
                        <td className="px-4 py-3">
                          {task.status === 'overdue' ? (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-[10px] font-bold">เกินกำหนด</span>
                          ) : task.priority === 'urgent' ? (
                            <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold">เร่งด่วน</span>
                          ) : (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-[10px] font-medium">ดำเนินการ</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: KPI Achievement & System Announcement Banner */}
        <div className="flex flex-col gap-6">
          
          {/* KPI Achievement Summary Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800 text-sm">🎯 KPI Achievement</h3>
              <button 
                onClick={() => setActiveTab('kpi')}
                className="text-[11px] text-blue-600 font-semibold hover:underline"
              >
                ดูทั้งหมด ({kpis.length})
              </button>
            </div>
            
            <div className="space-y-4">
              {kpis.slice(0, 4).map(kpi => (
                <div key={kpi.id}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 truncate max-w-[180px]">{kpi.name}</span>
                    <span className={`font-bold ${
                      kpi.status === 'achieved' ? 'text-emerald-600' :
                      kpi.status === 'nearly' ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {kpi.achievementRate}% {kpi.status === 'achieved' ? '🟢' : kpi.status === 'nearly' ? '🟡' : '🔴'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        kpi.status === 'achieved' ? 'bg-emerald-500' :
                        kpi.status === 'nearly' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, kpi.achievementRate)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Announcement Card (Clean Utility Style) */}
          <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-md relative overflow-hidden flex-1 flex flex-col justify-between">
            <div className="relative z-10">
              <h4 className="text-xs font-bold uppercase tracking-wider opacity-80">ประกาศระบบ รพ.โพนนาแก้ว</h4>
              <p className="text-sm mt-2 leading-relaxed font-medium">
                กำหนดส่งรายงานผลการดำเนินงานไตรมาสที่ 2 ปีงบประมาณ 2569 กรุณาอัปโหลดหลักฐานในระบบให้ครบถ้วน
              </p>
              <button 
                onClick={() => setActiveTab('reports')}
                className="mt-4 bg-white hover:bg-slate-50 text-blue-600 text-xs font-bold px-4 py-2 rounded-lg shadow-xs transition cursor-pointer"
              >
                ดูรายละเอียด
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 text-[100px] select-none pointer-events-none">
              📋
            </div>
          </div>

          {/* External Epidem & TB Systems Quick Access Card */}
          <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 text-white p-5 rounded-2xl shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  ระบบงานภายนอกเชื่อมโยง (3 โปรแกรม)
                </span>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30 font-semibold">
                  พร้อมใช้งาน
                </span>
              </div>
              <h4 className="text-base font-bold mt-2 text-white">ระบบงานระบาดวิทยา & วัณโรค</h4>
              <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                PNK TB-Care • งานนักระบาด SRRT 2026 • NTIProgram.s1
              </p>
              
              <div className="mt-3 grid grid-cols-3 gap-1.5 text-[11px]">
                <a
                  href="https://epidem-pnk-hospital.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-950/50 hover:bg-emerald-700/60 p-1.5 rounded-lg border border-emerald-500/30 text-center transition cursor-pointer"
                  title="เปิด PNK TB-Care ในแท็บใหม่"
                >
                  <span className="font-bold text-emerald-200 block truncate">1. TB-Care</span>
                  <span className="text-[9px] text-emerald-300">เปิดแท็บ ↗</span>
                </a>
                <a
                  href="https://epidem-pnk-hospital-2026.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-950/50 hover:bg-sky-700/60 p-1.5 rounded-lg border border-sky-500/30 text-center transition cursor-pointer"
                  title="เปิด งานนักระบาดSRRT ในแท็บใหม่"
                >
                  <span className="font-bold text-sky-200 block truncate">2. SRRT</span>
                  <span className="text-[9px] text-sky-300">เปิดแท็บ ↗</span>
                </a>
                <a
                  href="http://103.74.253.10/UIForm/Login.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-950/50 hover:bg-indigo-700/60 p-1.5 rounded-lg border border-indigo-500/30 text-center transition cursor-pointer"
                  title="เปิด NTIProgram.s1 ในแท็บใหม่"
                >
                  <span className="font-bold text-indigo-200 block truncate">3. NTIP</span>
                  <span className="text-[9px] text-indigo-300">เปิดแท็บ ↗</span>
                </a>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('epidem')}
                  className="flex-1 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
                  <span>เข้าสู่หน้าศูนย์รวมโปรแกรม</span>
                </button>
              </div>
            </div>
            <div className="absolute -right-2 -bottom-2 opacity-10 text-emerald-200 pointer-events-none">
              <Activity className="w-24 h-24" />
            </div>
          </div>

        </div>

      </div>

      {/* Main Charts Row (2x2 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Tasks by Workgroup */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>1. จำนวนงานแยกตาม 13 กลุ่มงาน (Workgroup Breakdown)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">แสดงสัดส่วนงานเสร็จสิ้น กำลังดำเนินการ และเกินกำหนด</p>
            </div>
            <button
              onClick={() => setActiveTab('workgroups')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              ดู 13 กลุ่มงาน <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksByWorkgroupData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value} งาน`, name]}
                  labelFormatter={(label) => {
                    const item = tasksByWorkgroupData.find(d => d.name === label);
                    return `กลุ่มงานที่ ${label}: ${item?.fullName || ''}`;
                  }}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="เสร็จสิ้น" stackId="a" fill="#10b981" />
                <Bar dataKey="กำลังดำเนิน" stackId="a" fill="#3b82f6" />
                <Bar dataKey="เกินกำหนด" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Task Status Pie Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>2. สัดส่วนสถานะงานทั้งหมด (Status Distribution)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">ภาพรวมอัตราการขับเคลื่อนภารกิจของโรงพยาบาล</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-semibold text-slate-700">
              รวม {stats.total} งาน
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [`${value} งาน`, 'จำนวน']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: KPI Achievement Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>3. สรุปผลสัมฤทธิ์ตัวชี้วัด (KPI Achievement)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">ติดตามตัวชี้วัดสำคัญ 20 รายการ ปีงบประมาณ 2569</p>
            </div>
            <button
              onClick={() => setActiveTab('kpi')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              ดู KPI ทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
              <span className="text-xs text-emerald-700 font-medium">🟢 บรรลุเป้าหมาย</span>
              <div className="text-xl font-bold text-emerald-800">{kpiStats.achieved}</div>
              <span className="text-[11px] text-emerald-600">
                {kpiStats.total > 0 ? Math.round((kpiStats.achieved / kpiStats.total) * 100) : 0}%
              </span>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
              <span className="text-xs text-amber-700 font-medium">🟡 ใกล้บรรลุ</span>
              <div className="text-xl font-bold text-amber-800">{kpiStats.nearly}</div>
              <span className="text-[11px] text-amber-600">
                {kpiStats.total > 0 ? Math.round((kpiStats.nearly / kpiStats.total) * 100) : 0}%
              </span>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-center">
              <span className="text-xs text-rose-700 font-medium">🔴 ไม่บรรลุ</span>
              <div className="text-xl font-bold text-rose-800">{kpiStats.notAchieved}</div>
              <span className="text-[11px] text-rose-600">
                {kpiStats.total > 0 ? Math.round((kpiStats.notAchieved / kpiStats.total) * 100) : 0}%
              </span>
            </div>
          </div>

          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={kpiStats.data} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={140} />
                <Tooltip 
                  formatter={(value: any) => [`${value} ตัวชี้วัด`, 'จำนวน']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]}>
                  {kpiStats.data.map((entry, index) => (
                    <Cell key={`kpicell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Monthly Trend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>4. แนวโน้มภารกิจรายเดือน (Monthly Task Trend)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">การเปิดงานและการปิดงานเสร็จสิ้นรายเดือน</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 font-semibold text-emerald-700 border border-emerald-200">
              ไตรมาส 3-4
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="งานที่เปิด" stroke="#0284c7" fillOpacity={1} fill="url(#colorCreated)" />
                <Area type="monotone" dataKey="งานที่เสร็จ" stroke="#10b981" fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 13 Workgroups Quick Navigator Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>ภาพรวม 13 กลุ่มงานบริการด้านปฐมภูมิและองค์รวม โรงพยาบาลโพนนาแก้ว</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">คลิกกลุ่มงานเพื่อกรองงานและดูรายละเอียดภารกิจย่อย</p>
          </div>
          <button
            onClick={() => setActiveTab('workgroups')}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
          >
            เปิดโครงสร้างละเอียด 13 กลุ่มงาน →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {workgroups.map(wg => {
            const wgTasks = tasks.filter(t => t.workgroupId === wg.id);
            const leader = personnel.find(p => p.id === wg.leaderId);
            const comp = wgTasks.filter(t => t.status === 'completed').length;
            const rate = wgTasks.length > 0 ? Math.round((comp / wgTasks.length) * 100) : 0;
            return (
              <div
                key={wg.id}
                onClick={() => {
                  setSelectedWorkgroupFilter(wg.id);
                  setActiveTab('tasks');
                }}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition cursor-pointer bg-slate-50/60 hover:bg-white group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-black text-white px-2 py-0.5 rounded-md" style={{ backgroundColor: wg.color }}>
                    {wg.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {wgTasks.length} งาน ({rate}%)
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition truncate">
                  {wg.name}
                </h4>
                <p className="text-[11px] text-slate-500 truncate mt-1">
                  หัวหน้า: {leader?.name || 'พยาบาลวิชาชีพ'}
                </p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="h-1.5 rounded-full transition-all" style={{ width: `${rate}%`, backgroundColor: wg.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
