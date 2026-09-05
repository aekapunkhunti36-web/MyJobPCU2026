import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, Priority } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { 
  Search, 
  Filter, 
  Plus, 
  Layers, 
  Users, 
  Calendar, 
  LayoutList, 
  LayoutGrid, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Hourglass, 
  Flame, 
  Download, 
  Paperclip, 
  MessageSquare,
  X,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const TasksView: React.FC = () => {
  const { 
    tasks, 
    workgroups, 
    personnel, 
    kpis, 
    selectedTaskForDetail, 
    setSelectedTaskForDetail,
    isCreateTaskModalOpen,
    setIsCreateTaskModalOpen,
    globalSearch,
    setGlobalSearch,
    selectedWorkgroupFilter,
    setSelectedWorkgroupFilter,
    updateTaskProgress,
    setTaskToEdit
  } = useApp();

  // Local Filter States
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [fiscalYearFilter, setFiscalYearFilter] = useState<string>('2569');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'progress' | 'title'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter Computation
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Global Search
      if (globalSearch.trim()) {
        const q = globalSearch.toLowerCase().trim();
        const wg = workgroups.find(w => w.id === task.workgroupId);
        const assignee = personnel.find(p => p.id === task.mainAssigneeId);
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchCode = task.taskCode.toLowerCase().includes(q);
        const matchDesc = task.description.toLowerCase().includes(q);
        const matchSub = task.subActivity?.toLowerCase().includes(q);
        const matchWg = wg?.name.toLowerCase().includes(q) || wg?.code.toLowerCase().includes(q);
        const matchAssignee = assignee?.name.toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchDesc && !matchSub && !matchWg && !matchAssignee) {
          return false;
        }
      }

      // Workgroup
      if (selectedWorkgroupFilter !== 'all' && task.workgroupId !== selectedWorkgroupFilter) {
        return false;
      }

      // Status
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }

      // Priority
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false;
      }

      // Assignee
      if (assigneeFilter !== 'all' && task.mainAssigneeId !== assigneeFilter && !task.coAssigneeIds?.includes(assigneeFilter)) {
        return false;
      }

      // Fiscal Year
      if (fiscalYearFilter !== 'all' && task.fiscalYear?.toString() !== fiscalYearFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'dueDate') {
        comparison = a.dueDate.localeCompare(b.dueDate);
      } else if (sortBy === 'priority') {
        const priorityWeight = { urgent: 4, high: 3, normal: 2, low: 1 };
        comparison = priorityWeight[b.priority] - priorityWeight[a.priority];
      } else if (sortBy === 'progress') {
        comparison = a.progress - b.progress;
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [tasks, globalSearch, selectedWorkgroupFilter, statusFilter, priorityFilter, assigneeFilter, fiscalYearFilter, sortBy, sortOrder, workgroups, personnel]);

  // Export to Excel
  const handleExportExcel = () => {
    const rows = filteredTasks.map(t => {
      const wg = workgroups.find(w => w.id === t.workgroupId);
      const assignee = personnel.find(p => p.id === t.mainAssigneeId);
      const kpi = kpis.find(k => k.id === t.kpiId);
      return {
        'รหัสงาน': t.taskCode,
        'ชื่องาน': t.title,
        'กลุ่มงาน': `${wg?.code} - ${wg?.name}`,
        'ภารกิจย่อย': t.subActivity || '-',
        'ผู้รับผิดชอบหลัก': assignee?.name || '-',
        'ตำแหน่ง': assignee?.position || '-',
        'ระดับความสำคัญ': t.priority,
        'สถานะ': t.status,
        'ความก้าวหน้า (%)': t.progress,
        'วันที่เริ่มต้น': t.startDate,
        'กำหนดส่ง': t.dueDate,
        'KPI ที่เกี่ยวข้อง': kpi ? `${kpi.code}: ${kpi.name}` : '-',
        'เป้าหมาย': t.targetValue || '-',
        'ปีงบประมาณ': t.fiscalYear || 2569
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');
    XLSX.writeFile(workbook, `PhonNaKaeo_Tasks_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setIsCreateTaskModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>📋 ทะเบียนงานและภารกิจทั้งหมด</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold font-mono">
              {filteredTasks.length} รายการ
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            บริหารจัดการ มอบหมาย ติดตามความก้าวหน้า และรวบรวมหลักฐาน 13 กลุ่มงานบริการปฐมภูมิ
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="ส่งออกเป็นไฟล์ Excel"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>ส่งออก Excel</span>
          </button>

          <button
            onClick={() => {
              setTaskToEdit(null);
              setIsCreateTaskModalOpen(true);
            }}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-teal-700/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ มอบหมายงานใหม่</span>
          </button>
        </div>
      </div>

      {/* Multi-Filter & Search Bar Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        
        {/* Search & Mode row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ค้นหาตามรหัสงาน ชื่องาน กลุ่มงาน หรือชื่อผู้รับผิดชอบ..."
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:bg-white focus:border-teal-500 rounded-xl text-slate-800 focus:outline-hidden transition"
            />
            {globalSearch && (
              <button 
                onClick={() => setGlobalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  viewMode === 'table' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="มุมมองตาราง"
              >
                <LayoutList className="w-4 h-4" />
                <span className="hidden sm:inline">ตาราง</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                  viewMode === 'grid' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="มุมมองการ์ด"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">การ์ด</span>
              </button>
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-1">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="dueDate">เรียงตาม: วันครบกำหนด</option>
                <option value="priority">เรียงตาม: ความสำคัญ</option>
                <option value="progress">เรียงตาม: ความก้าวหน้า</option>
                <option value="title">เรียงตาม: ชื่องาน</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs text-slate-700"
                title={sortOrder === 'asc' ? 'น้อยไปมาก' : 'มากไปน้อย'}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 5 Filter Select Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100">
          
          {/* Workgroup Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">1. กลุ่มงาน (13 กลุ่ม)</label>
            <select
              value={selectedWorkgroupFilter}
              onChange={e => setSelectedWorkgroupFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-500 font-medium text-slate-800 cursor-pointer"
            >
              <option value="all">ทั้งหมด (13 กลุ่มงาน)</option>
              {workgroups.map(wg => (
                <option key={wg.id} value={wg.id}>
                  {wg.code}. {wg.shortName}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">2. สถานะงาน</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-500 font-medium text-slate-800 cursor-pointer"
            >
              <option value="all">ทุกสถานะ</option>
              <option value="not_started">ยังไม่เริ่ม</option>
              <option value="in_progress">กำลังดำเนินการ</option>
              <option value="pending">รอติดตาม</option>
              <option value="completed">เสร็จสิ้น</option>
              <option value="overdue">เกินกำหนด</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">3. ความสำคัญ</label>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-500 font-medium text-slate-800 cursor-pointer"
            >
              <option value="all">ทุกระดับ</option>
              <option value="urgent">🔥 เร่งด่วน</option>
              <option value="high">สูง</option>
              <option value="normal">ปกติ</option>
              <option value="low">ต่ำ</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">4. ผู้รับผิดชอบ</label>
            <select
              value={assigneeFilter}
              onChange={e => setAssigneeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-500 font-medium text-slate-800 cursor-pointer"
            >
              <option value="all">ทุกคน (12 บุคลากร)</option>
              {personnel.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fiscal Year */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">5. ปีงบประมาณ</label>
            <select
              value={fiscalYearFilter}
              onChange={e => setFiscalYearFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-500 font-medium text-slate-800 cursor-pointer"
            >
              <option value="all">ทุกปีงบประมาณ</option>
              <option value="2569">ปีงบประมาณ 2569</option>
              <option value="2568">ปีงบประมาณ 2568</option>
            </select>
          </div>

        </div>

        {/* Active Filter Clear Chips */}
        {(selectedWorkgroupFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all' || assigneeFilter !== 'all' || globalSearch) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 font-medium">ตัวกรองที่เลือก:</span>
            {selectedWorkgroupFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                กลุ่มงาน: {workgroups.find(w => w.id === selectedWorkgroupFilter)?.shortName}
                <button onClick={() => setSelectedWorkgroupFilter('all')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                สถานะ: {statusFilter}
                <button onClick={() => setStatusFilter('all')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
              </span>
            )}
            {priorityFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                ความสำคัญ: {priorityFilter}
                <button onClick={() => setPriorityFilter('all')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
              </span>
            )}
            {assigneeFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                ผู้รับผิดชอบ: {personnel.find(p => p.id === assigneeFilter)?.name}
                <button onClick={() => setAssigneeFilter('all')} className="hover:text-rose-600"><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedWorkgroupFilter('all');
                setStatusFilter('all');
                setPriorityFilter('all');
                setAssigneeFilter('all');
                setGlobalSearch('');
              }}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}

      </div>

      {/* Main Task List / Table Rendering */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">ไม่พบรายการงานที่ตรงกับเงื่อนไขการค้นหา</h3>
          <p className="text-xs text-slate-500 mt-1">ลองเปลี่ยนคำค้นหา หรือปรับตัวกรองกลุ่มงาน/สถานะ</p>
          <button
            onClick={() => {
              setSelectedWorkgroupFilter('all');
              setStatusFilter('all');
              setPriorityFilter('all');
              setAssigneeFilter('all');
              setGlobalSearch('');
            }}
            className="mt-4 px-4 py-2 bg-teal-50 text-teal-700 text-xs font-bold rounded-xl hover:bg-teal-100 transition"
          >
            แสดงงานทั้งหมด
          </button>
        </div>
      ) : viewMode === 'table' ? (
        
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">รหัส / ชื่องาน</th>
                  <th className="py-3 px-3">กลุ่มงาน (13 กลุ่ม)</th>
                  <th className="py-3 px-3">ผู้รับผิดชอบ</th>
                  <th className="py-3 px-3 text-center">ความสำคัญ</th>
                  <th className="py-3 px-3 text-center">สถานะ</th>
                  <th className="py-3 px-4 w-36">ความก้าวหน้า</th>
                  <th className="py-3 px-3">กำหนดส่ง</th>
                  <th className="py-3 px-3 text-center">หลักฐาน</th>
                  <th className="py-3 px-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTasks.map(task => {
                  const wg = workgroups.find(w => w.id === task.workgroupId);
                  const assignee = personnel.find(p => p.id === task.mainAssigneeId);
                  const isOverdue = task.status === 'overdue';

                  return (
                    <tr 
                      key={task.id}
                      className={`hover:bg-slate-50/80 transition group ${isOverdue ? 'bg-rose-50/30' : ''}`}
                    >
                      {/* Code & Title */}
                      <td className="py-3.5 px-4">
                        <div 
                          onClick={() => setSelectedTaskForDetail(task)}
                          className="cursor-pointer"
                        >
                          <span className="font-mono text-[11px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60 mr-2">
                            {task.taskCode}
                          </span>
                          <span className="font-bold text-slate-800 group-hover:text-teal-700 transition">
                            {task.title}
                          </span>
                          {task.subActivity && (
                            <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-sm">
                              {task.subActivity}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Workgroup */}
                      <td className="py-3.5 px-3">
                        <span 
                          onClick={() => setSelectedWorkgroupFilter(task.workgroupId)}
                          className="inline-flex items-center gap-1 font-medium text-slate-700 hover:text-teal-700 cursor-pointer truncate max-w-[130px]"
                          title={wg?.name}
                        >
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: wg?.color }}></span>
                          <span className="truncate">{wg?.code}. {wg?.shortName}</span>
                        </span>
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-800 block truncate max-w-[110px]">
                          {assignee?.name || 'ไม่ระบุ'}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[110px]">
                          {assignee?.position}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3 text-center">
                        <PriorityBadge priority={task.priority} />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 text-center">
                        <StatusBadge status={task.status} />
                      </td>

                      {/* Progress Bar & Quick Adjust */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                          <span className="text-slate-700">{task.progress}%</span>
                          {task.progress < 100 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const nextVal = Math.min(100, task.progress + 25);
                                updateTaskProgress(task.id, nextVal);
                              }}
                              className="text-[10px] text-teal-600 hover:text-teal-800 font-bold bg-teal-50 px-1 rounded"
                              title="+25% ความก้าวหน้า"
                            >
                              +25%
                            </button>
                          )}
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              task.status === 'overdue' ? 'bg-rose-500' :
                              task.progress >= 80 ? 'bg-emerald-500' :
                              task.progress >= 40 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`font-semibold ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                          {task.dueDate}
                        </span>
                      </td>

                      {/* Attachments / Comments Count */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-2 text-slate-400">
                          {task.attachments && task.attachments.length > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-teal-700 font-semibold" title={`${task.attachments.length} ไฟล์แนบ`}>
                              <Paperclip className="w-3.5 h-3.5" />
                              {task.attachments.length}
                            </span>
                          )}
                          {task.comments && task.comments.length > 0 && (
                            <span className="flex items-center gap-0.5 text-xs text-slate-600 font-medium" title={`${task.comments.length} บันทึก`}>
                              <MessageSquare className="w-3.5 h-3.5" />
                              {task.comments.length}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedTaskForDetail(task)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 font-semibold rounded-lg text-xs transition"
                          >
                            ดูงาน
                          </button>
                          <button
                            onClick={() => handleEditClick(task)}
                            className="px-2 py-1 text-slate-400 hover:text-teal-600 hover:bg-slate-100 rounded-lg text-xs transition"
                            title="แก้ไข"
                          >
                            แก้ไข
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

      ) : (
        
        /* CARD GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => {
            const wg = workgroups.find(w => w.id === task.workgroupId);
            const assignee = personnel.find(p => p.id === task.mainAssigneeId);

            return (
              <div
                key={task.id}
                onClick={() => setSelectedTaskForDetail(task)}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {task.taskCode}
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition line-clamp-2 mb-1.5">
                    {task.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: wg?.color }}></span>
                    <span className="font-semibold text-slate-700">{wg?.code}. {wg?.shortName}</span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {/* Progress Slider */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span className="text-slate-500">ความก้าวหน้า</span>
                      <span className="text-slate-800">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${
                          task.status === 'overdue' ? 'bg-rose-500' :
                          task.progress >= 80 ? 'bg-emerald-500' :
                          task.progress >= 40 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate max-w-[120px]">
                      👤 {assignee?.name || 'ไม่ระบุ'}
                    </span>
                    <span className={`font-semibold ${task.status === 'overdue' ? 'text-rose-600' : 'text-slate-600'}`}>
                      📅 {task.dueDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <StatusBadge status={task.status} />
                    <button className="text-xs font-bold text-teal-600 group-hover:text-teal-700 flex items-center gap-1">
                      <span>รายละเอียด</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
