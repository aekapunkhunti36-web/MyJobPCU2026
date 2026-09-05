import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { HospitalLogo } from '../common/HospitalLogo';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Printer, 
  Maximize2, 
  Minimize2, 
  Wallet, 
  Users, 
  Target, 
  CheckCircle2, 
  Clock, 
  Building2, 
  FileText, 
  Award, 
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Paperclip
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

interface ProjectPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  workgroups: any[];
  personnel: any[];
  onOpenProjectDetail?: (project: Project) => void;
}

export const ProjectPresentationModal: React.FC<ProjectPresentationModalProps> = ({
  isOpen,
  onClose,
  projects,
  workgroups,
  personnel,
  onOpenProjectDetail
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentSlide(prev => Math.min(projects.length, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, projects.length, onClose]);

  if (!isOpen) return null;

  const totalSlides = projects.length + 1; // 0 = Executive Overview, 1..N = Projects

  // Overall calculations for Executive Overview Slide
  const totalApproved = projects.reduce((s, p) => s + (p.budgetApproved || 0), 0);
  const totalSpent = projects.reduce((s, p) => s + (p.budgetSpent || 0), 0);
  const completedCount = projects.filter(p => p.status === 'completed' || p.status === 'evaluated').length;
  const inProgressCount = projects.filter(p => p.status === 'in_progress' || p.status === 'approved').length;
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((s, p) => s + (p.progress || 0), 0) / projects.length) 
    : 0;
  const disbursementRate = totalApproved > 0 
    ? Math.min(100, Math.round((totalSpent / totalApproved) * 100)) 
    : 0;
  const totalBeneficiaries = projects.reduce((s, p) => s + (p.targetCount || 0), 0);

  // Chart Data
  const chartData = [
    {
      name: 'เงินบำรุง รพ.',
      อนุมัติ: projects.filter(p => p.type === 'hospital_fund').reduce((s, p) => s + (p.budgetApproved || 0), 0),
      เบิกจ่าย: projects.filter(p => p.type === 'hospital_fund').reduce((s, p) => s + (p.budgetSpent || 0), 0),
    },
    {
      name: 'กองทุน กปท.',
      อนุมัติ: projects.filter(p => p.type === 'local_fund').reduce((s, p) => s + (p.budgetApproved || 0), 0),
      เบิกจ่าย: projects.filter(p => p.type === 'local_fund').reduce((s, p) => s + (p.budgetSpent || 0), 0),
    },
    {
      name: 'สปสช. PP',
      อนุมัติ: projects.filter(p => p.type === 'nhso_pp').reduce((s, p) => s + (p.budgetApproved || 0), 0),
      เบิกจ่าย: projects.filter(p => p.type === 'nhso_pp').reduce((s, p) => s + (p.budgetSpent || 0), 0),
    },
    {
      name: 'ยุทธศาสตร์ สสจ.',
      อนุมัติ: projects.filter(p => p.type === 'strategic').reduce((s, p) => s + (p.budgetApproved || 0), 0),
      เบิกจ่าย: projects.filter(p => p.type === 'strategic').reduce((s, p) => s + (p.budgetSpent || 0), 0),
    },
    {
      name: 'บริการปฐมภูมิ',
      อนุมัติ: projects.filter(p => p.type === 'primary_care').reduce((s, p) => s + (p.budgetApproved || 0), 0),
      เบิกจ่าย: projects.filter(p => p.type === 'primary_care').reduce((s, p) => s + (p.budgetSpent || 0), 0),
    }
  ].filter(d => d.อนุมัติ > 0 || d.เบิกจ่าย > 0);

  const activeProject = currentSlide > 0 ? projects[currentSlide - 1] : null;
  const activeWg = activeProject ? workgroups.find(w => w.id === activeProject.workgroupId) : null;
  const activeLeader = activeProject ? personnel.find(p => p.id === activeProject.leaderId) : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden animate-in fade-in duration-200">
      
      {/* Top Presentation Bar */}
      <header className="h-16 px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <HospitalLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30">
                โหมดนำเสนอผลงาน (Executive Presentation)
              </span>
              <span className="text-xs text-slate-400">
                สไลด์ {currentSlide + 1} / {totalSlides}
              </span>
            </div>
            <h2 className="text-sm font-bold text-white truncate max-w-md">
              {currentSlide === 0 ? 'ภาพรวมผลสัมฤทธิ์โครงการ โรงพยาบาลโพนนาแก้ว' : activeProject?.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            title="พิมพ์สไลด์นี้"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">พิมพ์ / PDF</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            title="ปิดโหมดนำเสนอ (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Slide Stage */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-10 flex flex-col min-h-[580px] justify-between relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* SLIDE 0: Executive Overview */}
          {currentSlide === 0 && (
            <div className="space-y-8 relative z-10">
              
              {/* Header Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-2 rounded-2xl border border-white/20">
                    <HospitalLogo size="xl" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 tracking-wider uppercase mb-1">
                      <Award className="w-4 h-4 text-teal-400" />
                      Executive Performance Portfolio • ปีงบประมาณ 2569
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                      สรุปผลการดำเนินงานโครงการขับเคลื่อนระบบบริการปฐมภูมิ
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                      กลุ่มงานบริการด้านปฐมภูมิและองค์รวม โรงพยาบาลโพนนาแก้ว สำนักงานสาธารณสุขจังหวัดสกลนคร
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right shrink-0 bg-slate-800/80 px-4 py-3 rounded-2xl border border-slate-700">
                  <span className="text-xs text-slate-400">อัตราความสำเร็จเฉลี่ย</span>
                  <div className="text-3xl font-extrabold text-emerald-400">{avgProgress}%</div>
                  <span className="text-[11px] text-teal-300">เบิกจ่ายแล้ว {disbursementRate}%</span>
                </div>
              </div>

              {/* 4 Core Executive Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                  <span className="text-xs text-slate-400 font-medium">จำนวนโครงการทั้งหมด</span>
                  <div className="text-2xl sm:text-3xl font-bold text-white mt-1">{projects.length} โครงการ</div>
                  <p className="text-xs text-emerald-400 mt-1">
                    เสร็จสิ้น {completedCount} • ดำเนินการ {inProgressCount}
                  </p>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                  <span className="text-xs text-slate-400 font-medium">งบประมาณอนุมัติรวม</span>
                  <div className="text-2xl sm:text-3xl font-bold text-teal-300 mt-1">
                    ฿{totalApproved.toLocaleString()}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">กองทุน กปท. / เงินบำรุง / สปสช.</p>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                  <span className="text-xs text-slate-400 font-medium">เบิกจ่ายแล้วจริง</span>
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">
                    ฿{totalSpent.toLocaleString()}
                  </div>
                  <p className="text-xs text-emerald-300 mt-1">คิดเป็น {disbursementRate}% ของงบอนุมัติ</p>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                  <span className="text-xs text-slate-400 font-medium">กลุ่มเป้าหมายผู้รับประโยชน์</span>
                  <div className="text-2xl sm:text-3xl font-bold text-sky-400 mt-1">
                    {totalBeneficiaries.toLocaleString()} คน
                  </div>
                  <p className="text-xs text-slate-400 mt-1">ประชาชนและผู้ป่วยในพื้นที่</p>
                </div>
              </div>

              {/* Chart Comparison in Slide */}
              <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-teal-400" />
                  <span>เปรียบเทียบงบประมาณอนุมัติ vs เบิกจ่ายจริง ตามแหล่งเงินทุน (บาท)</span>
                </h3>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#fff' }}
                        formatter={(val: any) => [`฿${Number(val).toLocaleString()}`, '']}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="อนุมัติ" fill="#0d9488" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="เบิกจ่าย" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Footer Guide */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span>กดปุ่มลูกศร ◀ ▶ หรือปุ่มด้านล่าง เพื่อเปิดดูสไลด์เจาะลึกผลงานแต่ละโครงการ</span>
                <span className="text-teal-400 font-semibold">
                  พร้อมแฟ้มเอกสารหลักฐาน กปท.10 และชุดตรวจรับสมบูรณ์
                </span>
              </div>
            </div>
          )}

          {/* SLIDE 1..N: Individual Project Details */}
          {currentSlide > 0 && activeProject && (
            <div className="space-y-6 relative z-10">
              
              {/* Project Header */}
              <div className="border-b border-slate-800 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-1 rounded-lg text-xs font-mono font-bold">
                      {activeProject.projectCode}
                    </span>
                    <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      ปีงบประมาณ {activeProject.fiscalYear}
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      {activeWg?.name || 'กลุ่มงานบริการด้านปฐมภูมิ'}
                    </span>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    activeProject.status === 'completed' || activeProject.status === 'evaluated'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}>
                    {activeProject.status === 'completed' ? '✓ เสร็จสิ้นสมบูรณ์' : activeProject.status === 'evaluated' ? '✓ ประเมินผลแล้ว' : '⚡ กำลังดำเนินงาน'}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {activeProject.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                  <span>ผู้รับผิดชอบ: <strong className="text-slate-200">{activeLeader?.name}</strong> ({activeLeader?.position})</span>
                  <span>•</span>
                  <span>แหล่งทุน: <strong className="text-teal-300">{activeProject.fundingSource}</strong></span>
                  <span>•</span>
                  <span>สถานที่: <strong className="text-slate-300">{activeProject.location}</strong></span>
                </p>
              </div>

              {/* 3 Columns Spotlight Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Col 1: Target & Objectives */}
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/70 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Target className="w-4 h-4" />
                      กลุ่มเป้าหมาย & วัตถุประสงค์
                    </h4>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 mb-3 text-xs">
                      <span className="text-slate-400 block text-[11px]">กลุ่มเป้าหมาย:</span>
                      <strong className="text-white text-sm">{activeProject.targetGroup}</strong>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {activeProject.objectives?.slice(0, 3).map((obj, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-teal-400 shrink-0 font-bold">•</span>
                          <span className="leading-relaxed">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Col 2: Tangible Results & Outcomes */}
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/70 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      ผลสัมฤทธิ์เชิงประจักษ์ (Key Results)
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-200">
                      {activeProject.expectedOutcomes?.slice(0, 3).map((outcome, i) => (
                        <li key={i} className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 leading-relaxed flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {activeProject.notes && (
                    <p className="mt-3 text-[11px] text-slate-400 bg-slate-900/50 p-2 rounded-lg italic">
                      หมายเหตุ: {activeProject.notes}
                    </p>
                  )}
                </div>

                {/* Col 3: Budget & Progress Metrics */}
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/70 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Wallet className="w-4 h-4" />
                      สถานะงบประมาณ & แผนงาน
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>งบอนุมัติ:</span>
                          <span className="font-bold text-white">฿{activeProject.budgetApproved?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>เบิกจ่ายจริง:</span>
                          <span className="font-bold text-emerald-400">฿{activeProject.budgetSpent?.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, (activeProject.budgetSpent / (activeProject.budgetApproved || 1)) * 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                          <span>อัตราเบิกจ่าย:</span>
                          <span className="font-bold text-emerald-300">
                            {Math.round(((activeProject.budgetSpent || 0) / (activeProject.budgetApproved || 1)) * 100)}%
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-700/60">
                        <div className="flex justify-between text-xs text-slate-300 mb-1">
                          <span>ความก้าวหน้าโครงการ:</span>
                          <span className="font-bold text-teal-300">{activeProject.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-teal-400 h-full rounded-full transition-all"
                            style={{ width: `${activeProject.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Open Dossier Button */}
                  <div className="mt-4 pt-3 border-t border-slate-700/60">
                    <button
                      onClick={() => {
                        onClose();
                        if (onOpenProjectDetail) {
                          onOpenProjectDetail(activeProject);
                        }
                      }}
                      className="w-full py-2 px-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>เปิดดูแฟ้มโครงการและชุดตรวจรับ ↗</span>
                    </button>
                  </div>

                </div>

              </div>

              {/* Evidence & File attachments count */}
              <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Paperclip className="w-4 h-4 text-teal-400" />
                  <span>
                    เอกสารหลักฐานแนบ: <strong>{activeProject.files?.length || 0} ไฟล์</strong> 
                    {activeProject.files && activeProject.files.length > 0 && (
                      <span className="text-slate-400 ml-2">({activeProject.files.map(f => f.fileName).join(', ')})</span>
                    )}
                  </span>
                </div>
                <span className="text-emerald-400 font-semibold">
                  ตรวจรับผ่านเกณฑ์และบันทึกในระบบ รพ.โพนนาแก้ว เรียบร้อย
                </span>
              </div>

            </div>
          )}

          {/* Bottom Slide Controller */}
          <footer className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2">
              <button
                disabled={currentSlide === 0}
                onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>ก่อนหน้า</span>
              </button>

              <button
                disabled={currentSlide === totalSlides - 1}
                onClick={() => setCurrentSlide(prev => Math.min(totalSlides - 1, prev + 1))}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-30 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:cursor-not-allowed"
              >
                <span>ถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Slide Dots / Thumbnails */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-md py-1">
              <button
                onClick={() => setCurrentSlide(0)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                  currentSlide === 0 
                    ? 'bg-teal-500 text-slate-950 font-black' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ภาพรวม
              </button>
              {projects.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setCurrentSlide(idx + 1)}
                  className={`px-2 py-1 rounded-md text-[10px] font-mono transition ${
                    currentSlide === idx + 1
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                  title={p.title}
                >
                  {p.projectCode.replace('PRJ-69-', 'P')}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 hidden sm:block">
              กด Esc เพื่อปิด • ลูกศรซ้าย/ขวา เพื่อเปลี่ยนสไลด์
            </div>
          </footer>

        </div>
      </main>

    </div>
  );
};
