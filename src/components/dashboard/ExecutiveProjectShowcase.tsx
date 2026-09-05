import React, { useState, useMemo } from 'react';
import { Project } from '../../types';
import { 
  FolderKanban, 
  Award, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Users, 
  Target, 
  Building2, 
  FileText, 
  ExternalLink, 
  Maximize2, 
  Printer, 
  ChevronRight,
  Filter,
  BarChart3,
  PieChart as PieIcon,
  Sparkles,
  Paperclip,
  Check
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
  Cell 
} from 'recharts';

interface ExecutiveProjectShowcaseProps {
  projects: Project[];
  workgroups: any[];
  personnel: any[];
  onOpenPresentation: () => void;
  onNavigateToProjects: () => void;
  onOpenProjectDetail: (project: Project) => void;
}

export const ExecutiveProjectShowcase: React.FC<ExecutiveProjectShowcaseProps> = ({
  projects,
  workgroups,
  personnel,
  onOpenPresentation,
  onNavigateToProjects,
  onOpenProjectDetail
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Executive Metric Calculations
  const stats = useMemo(() => {
    const totalCount = projects.length;
    const totalApproved = projects.reduce((s, p) => s + (p.budgetApproved || 0), 0);
    const totalSpent = projects.reduce((s, p) => s + (p.budgetSpent || 0), 0);
    const completedCount = projects.filter(p => p.status === 'completed' || p.status === 'evaluated').length;
    const inProgressCount = projects.filter(p => p.status === 'in_progress' || p.status === 'approved').length;
    const avgProgress = totalCount > 0 
      ? Math.round(projects.reduce((s, p) => s + (p.progress || 0), 0) / totalCount) 
      : 0;
    const disbursementRate = totalApproved > 0 
      ? Math.min(100, Math.round((totalSpent / totalApproved) * 100)) 
      : 0;
    const totalBeneficiaries = projects.reduce((s, p) => s + (p.targetCount || 0), 0);

    // Chart: Budget by Type
    const typeTotals: Record<string, { label: string; approved: number; spent: number }> = {
      hospital_fund: { label: 'เงินบำรุง รพ.', approved: 0, spent: 0 },
      local_fund: { label: 'กองทุน กปท.', approved: 0, spent: 0 },
      nhso_pp: { label: 'สปสช. PP', approved: 0, spent: 0 },
      strategic: { label: 'ยุทธศาสตร์ สสจ.', approved: 0, spent: 0 },
      primary_care: { label: 'บริการปฐมภูมิ', approved: 0, spent: 0 },
      quality_improvement: { label: 'พัฒนาคุณภาพ', approved: 0, spent: 0 }
    };

    projects.forEach(p => {
      if (typeTotals[p.type]) {
        typeTotals[p.type].approved += (p.budgetApproved || 0);
        typeTotals[p.type].spent += (p.budgetSpent || 0);
      }
    });

    const budgetByTypeChart = Object.values(typeTotals)
      .filter(t => t.approved > 0 || t.spent > 0)
      .map(t => ({
        name: t.label,
        งบอนุมัติ: t.approved,
        เบิกจ่ายจริง: t.spent
      }));

    // Status Pie Data
    const statusData = [
      { name: 'เสร็จสิ้นสมบูรณ์', value: completedCount, color: '#10b981' },
      { name: 'กำลังดำเนินงาน', value: projects.filter(p => p.status === 'in_progress').length, color: '#0284c7' },
      { name: 'อนุมัติแล้ว', value: projects.filter(p => p.status === 'approved').length, color: '#6366f1' },
      { name: 'ร่าง/ยื่นขอ', value: projects.filter(p => p.status === 'draft' || p.status === 'submitted').length, color: '#94a3b8' }
    ].filter(s => s.value > 0);

    return {
      totalCount,
      totalApproved,
      totalSpent,
      completedCount,
      inProgressCount,
      avgProgress,
      disbursementRate,
      totalBeneficiaries,
      budgetByTypeChart,
      statusData
    };
  }, [projects]);

  // Filtered Projects for Showcase
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'completed') return p.status === 'completed' || p.status === 'evaluated';
      if (activeFilter === 'in_progress') return p.status === 'in_progress';
      if (activeFilter === 'local_fund') return p.type === 'local_fund';
      if (activeFilter === 'hospital_fund') return p.type === 'hospital_fund';
      if (activeFilter === 'primary_care') return p.type === 'primary_care';
      if (activeFilter === 'nhso_pp') return p.type === 'nhso_pp';
      return true;
    });
  }, [projects, activeFilter]);

  const getFundingBadge = (type: string) => {
    switch (type) {
      case 'hospital_fund': return { label: 'เงินบำรุง รพ.', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'local_fund': return { label: 'กองทุน กปท.', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'nhso_pp': return { label: 'สปสช. PP Express', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'strategic': return { label: 'ยุทธศาสตร์ สสจ.', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'primary_care': return { label: 'บริการปฐมภูมิ', bg: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'quality_improvement': return { label: 'พัฒนาคุณภาพ (HA)', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      default: return { label: 'อื่นๆ', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return { label: 'เสร็จสิ้นสมบูรณ์', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'evaluated': return { label: 'สรุปผลงานแล้ว', bg: 'bg-teal-100 text-teal-800 border-teal-300' };
      case 'in_progress': return { label: 'กำลังดำเนินงาน', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'approved': return { label: 'อนุมัติโครงการ', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      default: return { label: 'ยื่นเสนอ/ร่าง', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
      
      {/* 1. Header with Executive Presentation Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-2">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            <span>ผลงานขับเคลื่อนระบบบริการปฐมภูมิ • Annual Project Portfolio 2569</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            สรุปผลการดำเนินงานโครงการสำคัญเพื่อนำเสนอผลงาน
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            รายงานผลสัมฤทธิ์ การเบิกจ่ายงบประมาณ และผลงานเชิงประจักษ์ กลุ่มงานบริการด้านปฐมภูมิและองค์รวม โรงพยาบาลโพนนาแก้ว
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenPresentation}
            className="px-4 py-2.5 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
            title="เปิดโหมดนำเสนอเต็มหน้าจอ สำหรับฉายจอประชุม"
          >
            <Maximize2 className="w-4 h-4" />
            <span>โหมดนำเสนอผลงาน (Presentation Mode)</span>
          </button>

          <button
            onClick={onNavigateToProjects}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 cursor-pointer"
            title="ไปยังระบบจัดการโครงการทั้งหมด"
          >
            <FolderKanban className="w-4 h-4 text-slate-600" />
            <span>ศูนย์โครงการทั้งหมด</span>
          </button>

          <button
            onClick={() => window.print()}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
            title="พิมพ์หน้านี้ / PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. 5 Key Executive KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* Metric 1: Total Projects */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">โครงการทั้งหมด</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {stats.totalCount} <span className="text-sm font-normal text-slate-500">โครงการ</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            ✓ เสร็จสิ้น {stats.completedCount} • กำลังทำ {stats.inProgressCount}
          </p>
        </div>

        {/* Metric 2: Approved Budget */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">งบอนุมัติรวม</span>
          <div className="text-xl sm:text-2xl font-black text-teal-800 mt-1">
            ฿{stats.totalApproved.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            กปท. / เงินบำรุง / สปสช.
          </p>
        </div>

        {/* Metric 3: Spent Budget & Rate */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">เบิกจ่ายแล้วจริง</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
            ฿{stats.totalSpent.toLocaleString()}
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-bold">เบิกจ่าย {stats.disbursementRate}%</span>
            <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden ml-2">
              <div 
                className="bg-emerald-500 h-full rounded-full"
                style={{ width: `${stats.disbursementRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 4: Avg Progress */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ความก้าวหน้าเฉลี่ย</span>
          <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-1">
            {stats.avgProgress}%
          </div>
          <div className="mt-1 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${stats.avgProgress}%` }}
            />
          </div>
        </div>

        {/* Metric 5: Beneficiaries */}
        <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ผู้รับประโยชน์สะสม</span>
          <div className="text-2xl sm:text-3xl font-black text-sky-700 mt-1">
            {stats.totalBeneficiaries.toLocaleString()} <span className="text-sm font-normal text-slate-500">คน</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            ผู้ป่วย NCDs, ผู้สูงอายุ, ประชาชน
          </p>
        </div>

      </div>

      {/* 3. Visual Charts Row (Budget by Source + Status Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        
        {/* Left 2 Cols: Budget Allocation vs Spent by Funding Source */}
        <div className="lg:col-span-2 bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-600" />
                <span>การจัดสรรและเบิกจ่ายงบประมาณตามแหล่งเงินทุน (บาท)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                เปรียบเทียบงบประมาณที่ได้รับอนุมัติกับงบประมาณที่เบิกจ่ายจริงเพื่อดำเนินกิจกรรม
              </p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
              อัตราเบิกจ่ายรวม {stats.disbursementRate}%
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.budgetByTypeChart} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any) => [`฿${Number(val).toLocaleString()}`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="งบอนุมัติ" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="เบิกจ่ายจริง" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Status Distribution Pie */}
        <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-1">
              <PieIcon className="w-4 h-4 text-teal-600" />
              <span>สัดส่วนสถานะโครงการ</span>
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              จำแนกตามสถานะความสำเร็จของโครงการ
            </p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any, name: any) => [`${val} โครงการ`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xs">
            {stats.statusData.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="truncate max-w-[130px]">{s.name}</span>
                </div>
                <span className="font-bold text-slate-800">{s.value} โครงการ</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 4. Filter Bar & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'all', label: `ทั้งหมด (${stats.totalCount})` },
            { id: 'completed', label: `🏆 สำเร็จแล้ว (${stats.completedCount})` },
            { id: 'in_progress', label: `⚡ กำลังทำ (${stats.inProgressCount})` },
            { id: 'local_fund', label: `🏛️ กองทุน กปท.` },
            { id: 'hospital_fund', label: `🏥 เงินบำรุง รพ.` },
            { id: 'primary_care', label: `🌿 ปฐมภูมิ` },
            { id: 'nhso_pp', label: `🩺 สปสช. PP` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end sm:self-auto shrink-0">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            การ์ดผลงาน
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ตารางสรุป
          </button>
        </div>

      </div>

      {/* 5A. VIEW MODE: Cards Grid (Dossier Portfolio Style) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map(project => {
            const wg = workgroups.find(w => w.id === project.workgroupId);
            const leader = personnel.find(p => p.id === project.leaderId);
            const fBadge = getFundingBadge(project.type);
            const sBadge = getStatusBadge(project.status);
            const spentRate = project.budgetApproved > 0 
              ? Math.min(100, Math.round((project.budgetSpent / project.budgetApproved) * 100)) 
              : 0;

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-teal-300 transition-all p-5 flex flex-col justify-between group"
              >
                <div>
                  
                  {/* Card Header Tags */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                      {project.projectCode}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${sBadge.bg}`}>
                      {sBadge.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => onOpenProjectDetail(project)}
                    className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-teal-700 transition cursor-pointer line-clamp-2"
                  >
                    {project.title}
                  </h3>

                  {/* Workgroup & Funding Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {wg?.name || 'บริการปฐมภูมิ'}
                    </span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${fBadge.bg}`}>
                      {fBadge.label}
                    </span>
                  </div>

                  {/* Target & Beneficiaries */}
                  <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">เป้าหมายผู้รับประโยชน์:</span>
                      <strong className="text-slate-800 font-bold">{project.targetCount?.toLocaleString()} คน</strong>
                    </div>
                    <div className="truncate text-slate-500 text-[11px]">
                      📍 {project.location}
                    </div>
                  </div>

                  {/* Tangible Results Highlights */}
                  {project.expectedOutcomes && project.expectedOutcomes.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        ผลงานเชิงประจักษ์ (Key Highlights):
                      </span>
                      <ul className="text-xs text-slate-600 space-y-1">
                        {project.expectedOutcomes.slice(0, 2).map((out, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Budget Spent vs Approved Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">งบอนุมัติ: <strong>฿{project.budgetApproved?.toLocaleString()}</strong></span>
                      <span className="text-emerald-700 font-bold">เบิกจ่าย: ฿{project.budgetSpent?.toLocaleString()} ({spentRate}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${spentRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Project Progress Milestone Bar */}
                  <div className="mt-2.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">ความก้าวหน้าโครงการ</span>
                      <span className="font-bold text-teal-800">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-teal-600 h-full rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Card Footer: Leader + Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate max-w-[150px]">
                    {leader?.name ? `ผู้รับผิดชอบ: ${leader.name}` : 'กลุ่มงานปฐมภูมิ'}
                  </span>
                  
                  <button
                    onClick={() => onOpenProjectDetail(project)}
                    className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 transition cursor-pointer hover:underline"
                  >
                    <span>เปิดดูสรุปผลงาน ↗</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 5B. VIEW MODE: Table View (For quick tabular presentation) */}
      {viewMode === 'table' && (
        <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">รหัส</th>
                  <th className="py-3 px-4 font-bold">ชื่อโครงการ</th>
                  <th className="py-3 px-4 font-bold">กลุ่มงาน</th>
                  <th className="py-3 px-4 font-bold">แหล่งงบประมาณ</th>
                  <th className="py-3 px-4 font-bold text-right">งบอนุมัติ (บาท)</th>
                  <th className="py-3 px-4 font-bold text-right">เบิกจ่ายจริง (บาท)</th>
                  <th className="py-3 px-4 font-bold text-center">เบิกจ่าย %</th>
                  <th className="py-3 px-4 font-bold text-center">ความก้าวหน้า</th>
                  <th className="py-3 px-4 font-bold text-center">สถานะ</th>
                  <th className="py-3 px-4 font-bold">ผู้รับผิดชอบ</th>
                  <th className="py-3 px-4 font-bold text-center">แฟ้มผลงาน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map(project => {
                  const wg = workgroups.find(w => w.id === project.workgroupId);
                  const leader = personnel.find(p => p.id === project.leaderId);
                  const sBadge = getStatusBadge(project.status);
                  const spentRate = project.budgetApproved > 0 
                    ? Math.min(100, Math.round((project.budgetSpent / project.budgetApproved) * 100)) 
                    : 0;

                  return (
                    <tr 
                      key={project.id} 
                      className="hover:bg-teal-50/40 transition cursor-pointer"
                      onClick={() => onOpenProjectDetail(project)}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-teal-800">{project.projectCode}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">{project.title}</td>
                      <td className="py-3 px-4 text-slate-600">{wg?.shortName || wg?.name}</td>
                      <td className="py-3 px-4 text-slate-600">{project.fundingSource}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-800">฿{project.budgetApproved?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-700">฿{project.budgetSpent?.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-700">{spentRate}%</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="font-bold text-teal-800">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sBadge.bg}`}>
                          {sBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{leader?.name || '-'}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProjectDetail(project);
                          }}
                          className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded font-semibold text-[11px] transition"
                        >
                          เปิดดู ↗
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 border-t border-slate-100">
        <span>
          ข้อมูลอัปเดตเรียลไทม์จากระบบบันทึกโครงการ และรายงานตรวจรับ กปท.10 ปีงบประมาณ 2569
        </span>
        <button
          onClick={onOpenPresentation}
          className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>เปิดฉายโหมดนำเสนอผลงานเต็มจอ</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
