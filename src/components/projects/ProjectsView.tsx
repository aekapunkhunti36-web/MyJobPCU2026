import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectType, ProjectStatus, ProjectFile } from '../../types';
import { 
  FolderKanban, 
  Plus, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon, 
  Building, 
  User, 
  Wallet, 
  Paperclip, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  FileText,
  Eye,
  Edit,
  Trash2,
  Calendar,
  ExternalLink,
  FileCheck2,
  ChevronRight,
  X,
  Sparkles
} from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ProjectFormModal } from './ProjectFormModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { ProjectDocumentChecklistModal } from './ProjectDocumentChecklistModal';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    workgroups, 
    personnel, 
    deleteProject, 
    selectedProjectForDetail, 
    setSelectedProjectForDetail,
    isCreateProjectModalOpen,
    setIsCreateProjectModalOpen
  } = useApp();

  // Local Filter States
  const [selectedTypeTab, setSelectedTypeTab] = useState<string>('all');
  const [selectedWorkgroup, setSelectedWorkgroup] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [previewDocData, setPreviewDocData] = useState<{ file: ProjectFile; project: Project } | null>(null);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [checklistProject, setChecklistProject] = useState<Project | null>(null);

  // Fiscal Year Selection Modal before entering project creation
  const [isYearSelectionModalOpen, setIsYearSelectionModalOpen] = useState(false);
  const [chosenFiscalYear, setChosenFiscalYear] = useState<number>(2569);
  const [customYearInput, setCustomYearInput] = useState<string>('');

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Type Tab Filter
      if (selectedTypeTab !== 'all' && project.type !== selectedTypeTab) {
        return false;
      }

      // Workgroup Filter
      if (selectedWorkgroup !== 'all' && project.workgroupId !== selectedWorkgroup) {
        return false;
      }

      // Status Filter
      if (selectedStatus !== 'all' && project.status !== selectedStatus) {
        return false;
      }

      // Year Filter
      if (selectedYear !== 'all' && project.fiscalYear.toString() !== selectedYear) {
        return false;
      }

      // Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const leaderName = personnel.find(p => p.id === project.leaderId)?.name.toLowerCase() || '';
        const wgName = workgroups.find(w => w.id === project.workgroupId)?.name.toLowerCase() || '';
        
        const matchTitle = project.title.toLowerCase().includes(query);
        const matchCode = project.projectCode.toLowerCase().includes(query);
        const matchFunding = project.fundingSource.toLowerCase().includes(query);
        const matchLeader = leaderName.includes(query);
        const matchWg = wgName.includes(query);

        if (!matchTitle && !matchCode && !matchFunding && !matchLeader && !matchWg) {
          return false;
        }
      }

      return true;
    });
  }, [projects, selectedTypeTab, selectedWorkgroup, selectedStatus, selectedYear, searchQuery, personnel, workgroups]);

  // Overall Statistics Calculations
  const stats = useMemo(() => {
    const totalCount = projects.length;
    const totalApprovedBudget = projects.reduce((sum, p) => sum + (p.budgetApproved || 0), 0);
    const totalSpentBudget = projects.reduce((sum, p) => sum + (p.budgetSpent || 0), 0);
    const activeCount = projects.filter(p => p.status === 'in_progress' || p.status === 'approved').length;
    const completedCount = projects.filter(p => p.status === 'completed' || p.status === 'evaluated').length;
    const totalFiles = projects.reduce((sum, p) => sum + (p.files?.length || 0), 0);
    const avgProgress = totalCount > 0 
      ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / totalCount) 
      : 0;
    const spentPercentage = totalApprovedBudget > 0 
      ? Math.min(100, Math.round((totalSpentBudget / totalApprovedBudget) * 100)) 
      : 0;

    return {
      totalCount,
      totalApprovedBudget,
      totalSpentBudget,
      activeCount,
      completedCount,
      totalFiles,
      avgProgress,
      spentPercentage
    };
  }, [projects]);

  // Type Tab Definition
  const typeTabs: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'โครงการทั้งหมด', count: projects.length },
    { id: 'primary_care', label: 'บริการปฐมภูมิ', count: projects.filter(p => p.type === 'primary_care').length },
    { id: 'hospital_fund', label: 'เงินบำรุง รพ.', count: projects.filter(p => p.type === 'hospital_fund').length },
    { id: 'local_fund', label: 'กองทุน กปท.', count: projects.filter(p => p.type === 'local_fund').length },
    { id: 'nhso_pp', label: 'สปสช. PP Express', count: projects.filter(p => p.type === 'nhso_pp').length },
    { id: 'strategic', label: 'ยุทธศาสตร์ สสจ.', count: projects.filter(p => p.type === 'strategic').length },
    { id: 'quality_improvement', label: 'พัฒนาคุณภาพ (HA/PCA)', count: projects.filter(p => p.type === 'quality_improvement').length },
  ];

  // Helper Labels for Table
  const getProjectTypeBadge = (type: string) => {
    switch (type) {
      case 'hospital_fund': return { label: 'เงินบำรุง รพ.', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'local_fund': return { label: 'กองทุน กปท.', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'nhso_pp': return { label: 'สปสช. PP Express', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'strategic': return { label: 'ยุทธศาสตร์ สสจ.', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'primary_care': return { label: 'บริการปฐมภูมิ', bg: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'quality_improvement': return { label: 'พัฒนาคุณภาพ', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      default: return { label: 'อื่นๆ', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return { label: 'ร่างโครงการ', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
      case 'submitted': return { label: 'ขออนุมัติ', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'approved': return { label: 'อนุมัติแล้ว', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'in_progress': return { label: 'กำลังดำเนินงาน', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'completed': return { label: 'เสร็จสิ้น', bg: 'bg-teal-100 text-teal-800 border-teal-200' };
      case 'evaluated': return { label: 'สรุปผลแล้ว', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'rejected': return { label: 'ส่งกลับแก้ไข', bg: 'bg-red-100 text-red-800 border-red-200' };
      default: return { label: status, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['รหัสโครงการ', 'ชื่อโครงการ', 'ประเภท', 'กลุ่มงาน', 'ผู้รับผิดชอบ', 'ปีงบ', 'งบอนุมัติ', 'งบเบิกจ่าย', 'ความก้าวหน้า(%)', 'สถานะ', 'จำนวนไฟล์แนบ'];
    const rows = filteredProjects.map(p => {
      const leaderName = personnel.find(u => u.id === p.leaderId)?.name || '';
      const wgName = workgroups.find(w => w.id === p.workgroupId)?.name || '';
      const typeLabel = getProjectTypeBadge(p.type).label;
      const statusLabel = getStatusBadge(p.status).label;
      return [
        p.projectCode,
        `"${p.title.replace(/"/g, '""')}"`,
        typeLabel,
        `"${wgName}"`,
        `"${leaderName}"`,
        p.fiscalYear,
        p.budgetApproved,
        p.budgetSpent,
        p.progress,
        statusLabel,
        p.files?.length || 0
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `รายงานโครงการ_รพ_โพนนาแก้ว_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs mb-1">
            <FolderKanban className="w-4 h-4 text-emerald-600" />
            <span>กลุ่มงานบริการด้านปฐมภูมิและองค์รวม โรงพยาบาลโพนนาแก้ว</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            ระบบบันทึกและบริหารโครงการ (Project Management)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            บันทึกโครงการ นำเข้าไฟล์เอกสาร (.doc, .docx, .pdf) แยกประเภทโครงการ ติดตามงบประมาณและความก้าวหน้า
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              setChecklistProject(null);
              setIsChecklistModalOpen(true);
            }}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            title="แบบตรวจเอกสารแนบโครงการ (กรณี ส่วนราชการ/หน่วยงานราชการ)"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-700" />
            <span>แบบตรวจเอกสารโครงการ</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>ส่งออก CSV</span>
          </button>

          <button
            onClick={() => {
              const initialYear = selectedYear !== 'all' ? parseInt(selectedYear, 10) : 2569;
              setChosenFiscalYear(initialYear);
              setIsYearSelectionModalOpen(true);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ บันทึกโครงการใหม่</span>
          </button>
        </div>
      </div>

      {/* Metric Cards - Clean Utility Dashboard Style */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: จำนวนโครงการ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">โครงการทั้งหมด</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <FolderKanban className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">{stats.totalCount}</span>
            <span className="text-xs text-slate-500">โครงการ</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>ดำเนินงานอยู่ {stats.activeCount} | เสร็จสิ้น {stats.completedCount}</span>
          </div>
        </div>

        {/* Metric 2: งบประมาณที่ได้รับอนุมัติ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">งบอนุมัติรวม</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-blue-900">
              ฿{(stats.totalApprovedBudget / 1000).toFixed(0)}k
            </span>
            <span className="text-xs text-slate-500">({stats.totalApprovedBudget.toLocaleString()} บ.)</span>
          </div>
          <div className="text-[11px] text-slate-500">
            จาก 6 แหล่งงบประมาณหลัก
          </div>
        </div>

        {/* Metric 3: การเบิกจ่ายงบประมาณ */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">เบิกจ่ายงบประมาณ</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-700">{stats.spentPercentage}%</span>
            <span className="text-xs text-slate-500">({(stats.totalSpentBudget / 1000).toFixed(0)}k บ.)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full" 
              style={{ width: `${stats.spentPercentage}%` }}
            />
          </div>
        </div>

        {/* Metric 4: เอกสารนำเข้า (DOC/PDF) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium">เอกสารในระบบ (DOC / PDF)</span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Paperclip className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-purple-900">{stats.totalFiles}</span>
            <span className="text-xs text-slate-500">ฉบับ</span>
          </div>
          <div className="text-[11px] text-purple-700 font-medium flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            <span>รองรับ Word, PDF, Excel</span>
          </div>
        </div>

      </div>

      {/* Category Tabs (แยกประเภทโครงการ) */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto custom-scrollbar">
        {typeTabs.map(tab => {
          const isActive = selectedTypeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTypeTab(tab.id)}
              className={`
                px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2
                ${isActive 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
              `}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                isActive ? 'bg-emerald-500 text-slate-900' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อโครงการ, รหัส, ผู้รับผิดชอบ, แหล่งงบ..."
              className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600 transition"
            />
          </div>

          {/* Workgroup Filter */}
          <div>
            <select
              value={selectedWorkgroup}
              onChange={(e) => setSelectedWorkgroup(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600 transition"
            >
              <option value="all">ทุกกลุ่มงาน (13 กลุ่มงาน)</option>
              {workgroups.map(w => (
                <option key={w.id} value={w.id}>{w.code}. {w.shortName}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600 transition"
            >
              <option value="all">ทุกสถานะโครงการ</option>
              <option value="draft">ร่างโครงการ</option>
              <option value="submitted">ยื่นขออนุมัติ</option>
              <option value="approved">อนุมัติแล้ว</option>
              <option value="in_progress">กำลังดำเนินงาน</option>
              <option value="completed">เสร็จสิ้นโครงการ</option>
              <option value="evaluated">สรุปผลแล้ว</option>
              <option value="rejected">ส่งกลับแก้ไข</option>
            </select>
          </div>

          {/* Year & View Switcher */}
          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600 transition"
            >
              <option value="all">ทุกปีงบ</option>
              <option value="2568">ปีงบ 2568</option>
              <option value="2569">ปีงบ 2569</option>
              <option value="2570">ปีงบ 2570</option>
            </select>

            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="มุมมองการ์ด"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="มุมมองตาราง"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Active Filter Info & Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div>
            แสดงผล <strong className="text-slate-800">{filteredProjects.length}</strong> จาก {projects.length} โครงการ
          </div>
          {(selectedTypeTab !== 'all' || selectedWorkgroup !== 'all' || selectedStatus !== 'all' || selectedYear !== 'all' || searchQuery.trim()) && (
            <button
              onClick={() => {
                setSelectedTypeTab('all');
                setSelectedWorkgroup('all');
                setSelectedStatus('all');
                setSelectedYear('all');
                setSearchQuery('');
              }}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer underline"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      </div>

      {/* Projects List Content */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <FolderKanban className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">ไม่พบโครงการตามเงื่อนไขที่ค้นหา</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือเลือกตัวกรองประเภทโครงการ กลุ่มงาน หรือสถานะอื่น
          </p>
          <button
            onClick={() => {
              setProjectToEdit(null);
              setIsCreateProjectModalOpen(true);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer mt-2"
          >
            <Plus className="w-4 h-4" />
            บันทึกโครงการใหม่
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={(p) => setSelectedProjectForDetail(p)}
              onEdit={(p) => setProjectToEdit(p)}
              onPreviewDoc={(file, p) => setPreviewDocData({ file, project: p })}
              onOpenChecklist={(p) => {
                setChecklistProject(p);
                setIsChecklistModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">รหัส / ชื่อโครงการ</th>
                  <th className="py-3.5 px-4">ประเภท</th>
                  <th className="py-3.5 px-4">กลุ่มงาน / ผู้รับผิดชอบ</th>
                  <th className="py-3.5 px-4">งบประมาณ</th>
                  <th className="py-3.5 px-4">ความก้าวหน้า</th>
                  <th className="py-3.5 px-4">สถานะ</th>
                  <th className="py-3.5 px-4">เอกสารแนบ</th>
                  <th className="py-3.5 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map(project => {
                  const typeInfo = getProjectTypeBadge(project.type);
                  const statusInfo = getStatusBadge(project.status);
                  const leader = personnel.find(p => p.id === project.leaderId);
                  const currentWorkgroup = workgroups.find(w => w.id === project.workgroupId);

                  return (
                    <tr key={project.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* Title & Code */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-mono text-[11px] font-bold text-emerald-700">{project.projectCode}</div>
                        <div 
                          onClick={() => setSelectedProjectForDetail(project)}
                          className="font-bold text-slate-900 hover:text-emerald-700 transition cursor-pointer truncate"
                          title={project.title}
                        >
                          {project.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">{project.fundingSource}</div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${typeInfo.bg}`}>
                          {typeInfo.label}
                        </span>
                      </td>

                      {/* Workgroup & Leader */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 truncate max-w-[150px]">{currentWorkgroup?.shortName || currentWorkgroup?.name}</div>
                        <div className="text-[11px] text-slate-500 truncate">{leader?.name || 'ไม่ระบุ'}</div>
                      </td>

                      {/* Budget */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">฿{project.budgetApproved.toLocaleString()}</div>
                        <div className="text-[10px] text-emerald-700">เบิกจ่าย: ฿{project.budgetSpent.toLocaleString()}</div>
                      </td>

                      {/* Progress */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${project.progress}%` }}></div>
                          </div>
                          <span className="font-bold text-slate-700">{project.progress}%</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${statusInfo.bg}`}>
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Files Chips */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {project.files && project.files.length > 0 ? (
                          <div className="flex items-center gap-1">
                            {project.files.slice(0, 2).map(f => (
                              <button
                                key={f.id}
                                onClick={() => setPreviewDocData({ file: f, project })}
                                className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 border border-slate-200 text-[10px] font-semibold text-slate-700 transition cursor-pointer"
                                title={f.fileName}
                              >
                                {f.fileType.toUpperCase()}
                              </button>
                            ))}
                            {project.files.length > 2 && (
                              <span className="text-[10px] text-slate-400">+{project.files.length - 2}</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">-</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setChecklistProject(project);
                              setIsChecklistModalOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            title="แบบตรวจเอกสารแนบโครงการ"
                          >
                            <FileCheck2 className="w-4 h-4 text-emerald-600" />
                          </button>
                          <button
                            onClick={() => setSelectedProjectForDetail(project)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            title="ดูรายละเอียด"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProjectToEdit(project)}
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                            title="แก้ไขโครงการ"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`คุณต้องการลบโครงการ "${project.title}" ใช่หรือไม่?`)) {
                                deleteProject(project.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="ลบโครงการ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProjectForDetail && (
        <ProjectDetailModal
          project={selectedProjectForDetail}
          onClose={() => setSelectedProjectForDetail(null)}
          onEdit={(p) => {
            setSelectedProjectForDetail(null);
            setProjectToEdit(p);
          }}
        />
      )}

      {/* Project Create / Edit Modal */}
      {(isCreateProjectModalOpen || projectToEdit) && (
        <ProjectFormModal
          isOpen={isCreateProjectModalOpen || !!projectToEdit}
          projectToEdit={projectToEdit}
          initialFiscalYear={chosenFiscalYear}
          onClose={() => {
            setIsCreateProjectModalOpen(false);
            setProjectToEdit(null);
          }}
        />
      )}

      {/* Fiscal Year Selection Modal (Pre-Step for Project Creation) */}
      {isYearSelectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 to-teal-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">เลือกปีงบประมาณของโครงการ</h3>
                  <p className="text-[11px] text-emerald-100">ระบบบันทึกโครงการ โรงพยาบาลโพนนาแก้ว</p>
                </div>
              </div>
              <button
                onClick={() => setIsYearSelectionModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  เลือกปีงบประมาณที่ต้องการบันทึกโครงการ:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { year: 2570, desc: 'วางแผนล่วงหน้า', tag: 'ปีหน้า' },
                    { year: 2569, desc: 'ปีงบประมาณปัจจุบัน', tag: 'ปัจจุบัน ★' },
                    { year: 2568, desc: 'ปีงบที่ผ่านมา', tag: 'ย้อนหลัง' },
                    { year: 2567, desc: 'บันทึกย้อนหลัง', tag: 'ประวัติ' },
                  ].map(item => {
                    const isSelected = chosenFiscalYear === item.year;
                    const countInYear = projects.filter(p => p.fiscalYear === item.year).length;
                    return (
                      <button
                        key={item.year}
                        type="button"
                        onClick={() => {
                          setChosenFiscalYear(item.year);
                          setCustomYearInput('');
                        }}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-base font-bold font-mono ${isSelected ? 'text-emerald-800' : 'text-slate-800'}`}>
                            {item.year}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            isSelected ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {item.tag}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 mt-1">{item.desc}</span>
                        <span className="text-[10px] text-slate-400 mt-1">
                          {countInYear} โครงการในระบบ
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Or Custom Year */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  หรือระบุปีงบประมาณอื่นๆ (พ.ศ.):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="2550"
                    max="2600"
                    placeholder="เช่น 2566, 2571"
                    value={customYearInput}
                    onChange={(e) => {
                      setCustomYearInput(e.target.value);
                      const val = parseInt(e.target.value, 10);
                      if (val && val >= 2500 && val <= 2650) {
                        setChosenFiscalYear(val);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  {customYearInput && (
                    <button
                      type="button"
                      onClick={() => {
                        const val = parseInt(customYearInput, 10);
                        if (val) setChosenFiscalYear(val);
                      }}
                      className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-bold"
                    >
                      เลือก
                    </button>
                  )}
                </div>
              </div>

              {/* Selected Summary Info */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/70 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-600 text-[11px] block">ปีงบประมาณที่เลือก:</span>
                  <strong className="text-emerald-900 font-bold text-sm">
                    ปีงบประมาณ พ.ศ. {chosenFiscalYear}
                  </strong>
                </div>
                <span className="text-xs text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 font-medium">
                  {projects.filter(p => p.fiscalYear === chosenFiscalYear).length} โครงการที่มีอยู่
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsYearSelectionModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsYearSelectionModalOpen(false);
                    setProjectToEdit(null);
                    setIsCreateProjectModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>เข้าสู่หน้าบันทึกโครงการ ({chosenFiscalYear})</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDocData && (
        <DocumentPreviewModal
          file={previewDocData.file}
          projectTitle={previewDocData.project.title}
          projectCode={previewDocData.project.projectCode}
          onClose={() => setPreviewDocData(null)}
        />
      )}

      {/* Project Document Checklist Modal */}
      {isChecklistModalOpen && (
        <ProjectDocumentChecklistModal
          isOpen={isChecklistModalOpen}
          project={checklistProject}
          onClose={() => {
            setIsChecklistModalOpen(false);
            setChecklistProject(null);
          }}
        />
      )}

    </div>
  );
};
