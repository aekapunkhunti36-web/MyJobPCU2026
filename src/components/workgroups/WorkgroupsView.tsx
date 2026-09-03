import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Workgroup } from '../../types';
import { StatusBadge } from '../common/Badge';
import { 
  Layers, 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  Target,
  FileCheck2,
  Calendar,
  Sparkles,
  Edit3,
  Trash2,
  X,
  Check,
  Save,
  ShieldCheck
} from 'lucide-react';

export const WorkgroupsView: React.FC = () => {
  const { 
    workgroups, 
    tasks, 
    personnel, 
    kpis, 
    isAdmin,
    addWorkgroup,
    updateWorkgroup,
    deleteWorkgroup,
    setSelectedWorkgroupFilter, 
    setActiveTab, 
    setSelectedTaskForDetail,
    setIsCreateTaskModalOpen 
  } = useApp();

  const [expandedWgId, setExpandedWgId] = useState<string | null>(workgroups[0]?.id || null);

  // Workgroup Add/Edit Modal
  const [isWgModalOpen, setIsWgModalOpen] = useState(false);
  const [editingWg, setEditingWg] = useState<Workgroup | null>(null);
  const [wgCode, setWgCode] = useState<number>(1);
  const [wgName, setWgName] = useState('');
  const [wgShortName, setWgShortName] = useState('');
  const [wgDescription, setWgDescription] = useState('');
  const [wgLeaderId, setWgLeaderId] = useState('');
  const [wgColor, setWgColor] = useState('#0d9488');
  const [wgSubActivitiesText, setWgSubActivitiesText] = useState('');

  const toggleExpand = (id: string) => {
    setExpandedWgId(expandedWgId === id ? null : id);
  };

  const handleOpenAddModal = () => {
    setEditingWg(null);
    setWgCode(workgroups.length + 1);
    setWgName('');
    setWgShortName('');
    setWgDescription('');
    setWgLeaderId(personnel[0]?.id || '');
    setWgColor('#0d9488');
    setWgSubActivitiesText('');
    setIsWgModalOpen(true);
  };

  const handleOpenEditModal = (wg: Workgroup, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingWg(wg);
    setWgCode(wg.code);
    setWgName(wg.name);
    setWgShortName(wg.shortName);
    setWgDescription(wg.description);
    setWgLeaderId(wg.leaderId);
    setWgColor(wg.color);
    setWgSubActivitiesText(wg.subActivities.join('\n'));
    setIsWgModalOpen(true);
  };

  const handleDeleteWorkgroup = (wg: Workgroup, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบกลุ่มงาน "${wg.code}. ${wg.name}"?`)) {
      deleteWorkgroup(wg.id);
    }
  };

  const handleSaveWorkgroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wgName.trim()) {
      alert('กรุณาระบุชื่อกลุ่มงาน');
      return;
    }

    const subActivities = wgSubActivitiesText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (editingWg) {
      updateWorkgroup(editingWg.id, {
        code: wgCode,
        name: wgName.trim(),
        shortName: wgShortName.trim() || wgName.trim(),
        description: wgDescription.trim(),
        leaderId: wgLeaderId,
        color: wgColor,
        subActivities: subActivities.length > 0 ? subActivities : editingWg.subActivities
      });
    } else {
      addWorkgroup({
        code: wgCode,
        name: wgName.trim(),
        shortName: wgShortName.trim() || wgName.trim(),
        description: wgDescription.trim(),
        leaderId: wgLeaderId,
        memberCount: 5,
        color: wgColor,
        icon: 'Layers',
        subActivities: subActivities.length > 0 ? subActivities : ['ภารกิจและงานบริการประจำกลุ่มงาน']
      });
    }
    setIsWgModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>🗂️ โครงสร้าง 13 กลุ่มงานบริการด้านปฐมภูมิและองค์รวม</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            โรงพยาบาลโพนนาแก้ว — กำกับดูแลภารกิจ 13 สายงาน คลินิกหมอครอบครัว การดูแลต่อเนื่อง และงานส่งเสริมสุขภาพ
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มกลุ่มงาน</span>
          </button>
          <button
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มงานในกลุ่มงาน</span>
          </button>
        </div>
      </div>

      {/* 13 Workgroups Master Accordion / Cards */}
      <div className="space-y-4">
        {workgroups.map(wg => {
          const wgTasks = tasks.filter(t => t.workgroupId === wg.id);
          const leader = personnel.find(p => p.id === wg.leaderId);
          const wgKpis = kpis.filter(k => k.workgroupId === wg.id);
          const completedTasks = wgTasks.filter(t => t.status === 'completed').length;
          const overdueTasks = wgTasks.filter(t => t.status === 'overdue').length;
          const inProgressTasks = wgTasks.filter(t => t.status === 'in_progress').length;
          const rate = wgTasks.length > 0 ? Math.round((completedTasks / wgTasks.length) * 100) : 0;
          const isExpanded = expandedWgId === wg.id;

          return (
            <div 
              key={wg.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition"
            >
              {/* Main Card Header */}
              <div 
                onClick={() => toggleExpand(wg.id)}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition"
              >
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  <div 
                    className="w-12 h-12 rounded-2xl text-white font-extrabold flex items-center justify-center text-sm shadow-md shrink-0 ring-4 ring-slate-100"
                    style={{ backgroundColor: wg.color }}
                  >
                    {wg.code}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {wg.code}. {wg.name}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                        {wg.shortName}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">{wg.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Users className="w-3.5 h-3.5 text-teal-600" />
                        หัวหน้า: {leader?.name || 'พยาบาลวิชาชีพ'} ({leader?.position || 'รพ.โพนนาแก้ว'})
                      </span>
                      <span>•</span>
                      <span>{wg.subActivities.length} ภารกิจย่อย</span>
                      <span>•</span>
                      <span>{wgKpis.length} ตัวชี้วัด KPI</span>
                    </div>
                  </div>
                </div>

                {/* Right summary metrics */}
                <div className="flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{wgTasks.length} งาน</span>
                      <span className="text-xs font-bold text-emerald-600">({rate}%)</span>
                    </div>
                    <div className="w-28 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                      <div className="h-1.5 rounded-full" style={{ width: `${rate}%`, backgroundColor: wg.color }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {overdueTasks > 0 && (
                      <span className="text-xs font-bold text-rose-700 bg-rose-100 px-2 py-1 rounded-lg flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {overdueTasks} เกินกำหนด
                      </span>
                    )}

                    <button
                      onClick={(e) => handleOpenEditModal(wg, e)}
                      className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                      title="แก้ไขข้อมูลกลุ่มงาน"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {workgroups.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteWorkgroup(wg, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="ลบกลุ่มงาน"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <div className="p-1.5 text-slate-400 rounded-lg hover:bg-slate-200">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Details Panel */}
              {isExpanded && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-6 animate-in fade-in duration-150">
                  
                  {/* Sub-activities List */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-teal-600" />
                      <span>ขอบเขตภารกิจและงานย่อยประจำกลุ่มงาน ({wg.subActivities.length} รายการ)</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {wg.subActivities.map((act, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-medium text-slate-800 leading-snug">{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tasks List inside this workgroup */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4 text-teal-600" />
                        <span>ทะเบียนงานในกลุ่มงานนี้ ({wgTasks.length} รายการ)</span>
                      </h4>
                      <button
                        onClick={() => {
                          setSelectedWorkgroupFilter(wg.id);
                          setActiveTab('tasks');
                        }}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                      >
                        ดูในหน้ารายการงานทั้งหมด →
                      </button>
                    </div>

                    {wgTasks.length === 0 ? (
                      <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                        ยังไม่มีรายการงานในกลุ่มงานนี้
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {wgTasks.map(task => {
                          const assignee = personnel.find(p => p.id === task.mainAssigneeId);
                          return (
                            <div
                              key={task.id}
                              onClick={() => setSelectedTaskForDetail(task)}
                              className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-teal-400 hover:shadow-xs transition cursor-pointer flex flex-col justify-between group"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="text-[11px] font-mono font-bold text-teal-800 bg-teal-50 px-1.5 py-0.5 rounded">
                                    {task.taskCode}
                                  </span>
                                  <StatusBadge status={task.status} />
                                </div>
                                <h5 className="text-xs font-bold text-slate-800 group-hover:text-teal-700 line-clamp-2">
                                  {task.title}
                                </h5>
                                {task.subActivity && (
                                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                    • {task.subActivity}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 mt-2 border-t border-slate-100">
                                <span>👤 {assignee?.name || 'ไม่ระบุ'}</span>
                                <span className="font-semibold text-slate-700">ก้าวหน้า {task.progress}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* KPIs for this workgroup */}
                  {wgKpis.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-emerald-600" />
                        <span>ตัวชี้วัด KPI ที่กำกับติดตาม ({wgKpis.length} ตัวชี้วัด)</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {wgKpis.map(kpi => (
                          <div key={kpi.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                                {kpi.code}
                              </span>
                              <h6 className="text-xs font-bold text-slate-800 truncate mt-1">{kpi.name}</h6>
                              <span className="text-[11px] text-slate-500">
                                เป้าหมาย: {kpi.target} {kpi.unit} | ผลงาน: {kpi.actual} {kpi.unit}
                              </span>
                            </div>
                            <div className="text-right shrink-0">
                              <span className={`text-xs font-black px-2 py-1 rounded-md ${
                                kpi.status === 'achieved' ? 'bg-emerald-100 text-emerald-800' :
                                kpi.status === 'nearly' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {kpi.achievementRate}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Modal: Add / Edit Workgroup */}
      {isWgModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] flex flex-col animate-in fade-in duration-150 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>{editingWg ? 'แก้ไขข้อมูลกลุ่มงาน' : 'เพิ่มกลุ่มงานใหม่'}</span>
              </h3>
              <button
                onClick={() => setIsWgModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWorkgroup} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ลำดับกลุ่มงาน (Code)
                  </label>
                  <input
                    type="number"
                    value={wgCode}
                    onChange={e => setWgCode(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อย่อกลุ่มงาน
                  </label>
                  <input
                    type="text"
                    value={wgShortName}
                    onChange={e => setWgShortName(e.target.value)}
                    placeholder="เช่น คลินิกหมอครอบครัว"
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อเต็มกลุ่มงาน
                </label>
                <input
                  type="text"
                  value={wgName}
                  onChange={e => setWgName(e.target.value)}
                  placeholder="เช่น กลุ่มงานคลินิกหมอครอบครัวและบริการปฐมภูมิ"
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  คำอธิบายภารกิจ
                </label>
                <textarea
                  rows={2}
                  value={wgDescription}
                  onChange={e => setWgDescription(e.target.value)}
                  placeholder="รายละเอียดขอบเขตงานหรือความรับผิดชอบหลัก..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    หัวหน้ากลุ่มงาน
                  </label>
                  <select
                    value={wgLeaderId}
                    onChange={e => setWgLeaderId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-emerald-500 font-medium"
                  >
                    {personnel.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.position})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    สีประจำกลุ่มงาน
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={wgColor}
                      onChange={e => setWgColor(e.target.value)}
                      className="w-10 h-9 p-0.5 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={wgColor}
                      onChange={e => setWgColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ขอบเขตภารกิจและงานย่อย (พิมพ์ 1 บรรทัดต่อ 1 กิจกรรม)
                </label>
                <textarea
                  rows={4}
                  value={wgSubActivitiesText}
                  onChange={e => setWgSubActivitiesText(e.target.value)}
                  placeholder="งานที่ 1&#10;งานที่ 2&#10;งานที่ 3..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-emerald-500 font-medium font-mono text-xs"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsWgModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกข้อมูล</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
