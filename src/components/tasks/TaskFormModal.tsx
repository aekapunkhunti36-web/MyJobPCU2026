import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, Priority, TaskStatus } from '../../types';
import { X, Plus, Trash2, Calendar, Target, UserCheck, Layers, FileText, AlertCircle, Check } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { workgroups, personnel, kpis, addTask, updateTask, currentUser } = useApp();

  const [taskCode, setTaskCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workgroupId, setWorkgroupId] = useState('');
  const [subActivity, setSubActivity] = useState('');
  const [mainAssigneeId, setMainAssigneeId] = useState('');
  const [coAssigneeIds, setCoAssigneeIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [status, setStatus] = useState<TaskStatus>('not_started');
  const [progress, setProgress] = useState<number>(0);
  const [kpiId, setKpiId] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [notes, setNotes] = useState('');
  const [fiscalYear, setFiscalYear] = useState<number>(2569);
  const [subtaskList, setSubtaskList] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  // When opening or editing
  useEffect(() => {
    if (taskToEdit) {
      setTaskCode(taskToEdit.taskCode);
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setWorkgroupId(taskToEdit.workgroupId);
      setSubActivity(taskToEdit.subActivity);
      setMainAssigneeId(taskToEdit.mainAssigneeId);
      setCoAssigneeIds(taskToEdit.coAssigneeIds || []);
      setStartDate(taskToEdit.startDate);
      setDueDate(taskToEdit.dueDate);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setProgress(taskToEdit.progress);
      setKpiId(taskToEdit.kpiId || '');
      setTargetValue(taskToEdit.targetValue || '');
      setNotes(taskToEdit.notes || '');
      setFiscalYear(taskToEdit.fiscalYear || 2569);
      setSubtaskList(taskToEdit.subtasks || []);
    } else {
      // Auto generate code
      const autoNum = Math.floor(100 + Math.random() * 900);
      setTaskCode(`PNK-69-${autoNum}`);
      setTitle('');
      setDescription('');
      const defaultWg = workgroups[0]?.id || 'wg-01';
      setWorkgroupId(defaultWg);
      setSubActivity(workgroups[0]?.subActivities[0] || '');
      setMainAssigneeId(currentUser.id || personnel[0]?.id || 'usr-01');
      setCoAssigneeIds([]);
      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);
      setStartDate(today);
      setDueDate(nextMonth.toISOString().split('T')[0]);
      setPriority('normal');
      setStatus('not_started');
      setProgress(0);
      setKpiId('');
      setTargetValue('');
      setNotes('');
      setFiscalYear(2569);
      setSubtaskList([
        { id: `st-${Date.now()}-1`, title: 'จัดทำแผนและเตรียมการ', completed: false },
        { id: `st-${Date.now()}-2`, title: 'ลงมือปฏิบัติตามขั้นตอน', completed: false },
        { id: `st-${Date.now()}-3`, title: 'สรุปรายงานผลและแนบหลักฐาน', completed: false }
      ]);
    }
  }, [taskToEdit, isOpen, workgroups, personnel, currentUser]);

  // Selected workgroup details
  const currentWorkgroup = workgroups.find(w => w.id === workgroupId);

  const handleWorkgroupChange = (newWgId: string) => {
    setWorkgroupId(newWgId);
    const targetWg = workgroups.find(w => w.id === newWgId);
    if (targetWg && targetWg.subActivities.length > 0) {
      setSubActivity(targetWg.subActivities[0]);
    } else {
      setSubActivity('');
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    setSubtaskList([
      ...subtaskList,
      { id: `st-${Date.now()}`, title: newSubtaskInput.trim(), completed: false }
    ]);
    setNewSubtaskInput('');
  };

  const handleRemoveSubtask = (stId: string) => {
    setSubtaskList(subtaskList.filter(s => s.id !== stId));
  };

  const handleToggleCoAssignee = (userId: string) => {
    if (coAssigneeIds.includes(userId)) {
      setCoAssigneeIds(coAssigneeIds.filter(id => id !== userId));
    } else {
      setCoAssigneeIds([...coAssigneeIds, userId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('กรุณาระบุชื่องาน');
      return;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        taskCode,
        title: title.trim(),
        description: description.trim(),
        workgroupId,
        subActivity,
        mainAssigneeId,
        coAssigneeIds,
        startDate,
        dueDate,
        priority,
        status,
        progress,
        kpiId: kpiId || undefined,
        targetValue: targetValue.trim() || undefined,
        notes: notes.trim() || undefined,
        fiscalYear,
        subtasks: subtaskList
      });
    } else {
      addTask({
        taskCode,
        title: title.trim(),
        description: description.trim(),
        workgroupId,
        subActivity,
        mainAssigneeId,
        coAssigneeIds,
        startDate,
        dueDate,
        priority,
        status,
        progress,
        kpiId: kpiId || undefined,
        targetValue: targetValue.trim() || undefined,
        notes: notes.trim() || undefined,
        fiscalYear,
        subtasks: subtaskList
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-teal-800 to-slate-800 text-white rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-600/40 text-teal-200 border border-teal-400/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {taskToEdit ? 'แก้ไขข้อมูลงาน / ภารกิจ' : '+ เพิ่มงานและมอบหมายภารกิจใหม่'}
              </h3>
              <p className="text-xs text-teal-200 font-light">
                กลุ่มงานบริการด้านปฐมภูมิและองค์รวม โรงพยาบาลโพนนาแก้ว
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Section 1: Basic Identifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                รหัสงาน (Task Code) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={taskCode}
                onChange={e => setTaskCode(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-teal-500 focus:outline-hidden font-mono font-bold text-teal-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่องาน / กิจกรรม <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="เช่น โครงการเยี่ยมบ้านผู้ป่วยติดเตียงและ Palliative Care"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-hidden font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Section 2: 13 Workgroups & Sub-activities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-teal-50/50 rounded-xl border border-teal-100">
            <div>
              <label className="block text-xs font-bold text-teal-900 mb-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>กลุ่มงาน (เลือกจาก 13 กลุ่มงาน) <span className="text-rose-500">*</span></span>
              </label>
              <select
                value={workgroupId}
                onChange={e => handleWorkgroupChange(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-teal-300 rounded-lg focus:border-teal-600 focus:outline-hidden text-slate-800 font-medium cursor-pointer"
              >
                {workgroups.map(wg => (
                  <option key={wg.id} value={wg.id}>
                    {wg.code}. {wg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-teal-900 mb-1">
                งานย่อย / ภารกิจเฉพาะ <span className="text-rose-500">*</span>
              </label>
              <select
                value={subActivity}
                onChange={e => setSubActivity(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-teal-300 rounded-lg focus:border-teal-600 focus:outline-hidden text-slate-800 cursor-pointer"
              >
                {currentWorkgroup?.subActivities.map((act, idx) => (
                  <option key={idx} value={act}>
                    {act}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Section 3: Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              รายละเอียดงานและวัตถุประสงค์
            </label>
            <textarea
              rows={3}
              placeholder="ระบุวัตถุประสงค์ ขั้นตอนการทำงาน พื้นที่เป้าหมาย หรือเกณฑ์ที่ต้องบรรลุ..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-hidden text-slate-800"
            />
          </div>

          {/* Section 4: Assignees (Main & Co-Assignees) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span>ผู้รับผิดชอบหลัก (Main Assignee) <span className="text-rose-500">*</span></span>
              </label>
              <select
                value={mainAssigneeId}
                onChange={e => setMainAssigneeId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-hidden text-slate-800 font-semibold cursor-pointer"
              >
                {personnel.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.position}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ผู้ร่วมรับผิดชอบ (Co-assignees)
              </label>
              <div className="max-h-28 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-slate-50 space-y-1">
                {personnel.map(u => {
                  if (u.id === mainAssigneeId) return null;
                  const isChecked = coAssigneeIds.includes(u.id);
                  return (
                    <label key={u.id} className="flex items-center gap-2 text-xs text-slate-700 hover:bg-white p-1 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCoAssignee(u.id)}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="truncate">{u.name} ({u.position})</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 5: Dates, Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                วันที่เริ่มต้น <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                กำหนดส่ง (Due Date) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-hidden font-semibold text-rose-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ระดับความสำคัญ <span className="text-rose-500">*</span>
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-hidden font-semibold cursor-pointer"
              >
                <option value="low">ต่ำ</option>
                <option value="normal">ปกติ</option>
                <option value="high">สูง</option>
                <option value="urgent">🔥 เร่งด่วน</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                สถานะงาน <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-hidden font-semibold cursor-pointer"
              >
                <option value="not_started">ยังไม่เริ่ม</option>
                <option value="in_progress">กำลังดำเนินการ</option>
                <option value="pending">รอติดตาม</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="overdue">เกินกำหนด</option>
              </select>
            </div>
          </div>

          {/* Section 6: Linked KPI & Target Value */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>KPI ที่เกี่ยวข้อง</span>
              </label>
              <select
                value={kpiId}
                onChange={e => setKpiId(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-hidden cursor-pointer"
              >
                <option value="">-- ไม่เชื่อมโยง KPI --</option>
                {kpis.map(k => (
                  <option key={k.id} value={k.id}>
                    {k.code}: {k.name} (เป้าหมาย: {k.target} {k.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ค่าเป้าหมายของงาน
              </label>
              <input
                type="text"
                placeholder="เช่น 15 ราย (100%), ผ่านเกณฑ์ 85%"
                value={targetValue}
                onChange={e => setTargetValue(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 7: Subtask Checklist */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              รายการงานย่อย / ขั้นตอนการทำงาน (Checklist)
            </label>
            <div className="space-y-2 mb-2">
              {subtaskList.map((st, idx) => (
                <div key={st.id} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-800 font-medium">{st.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="+ เพิ่มขั้นตอนย่อย..."
                value={newSubtaskInput}
                onChange={e => setNewSubtaskInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
              >
                เพิ่ม
              </button>
            </div>
          </div>

          {/* Section 8: Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              หมายเหตุเพิ่มเติม
            </label>
            <input
              type="text"
              placeholder="หมายเหตุ ข้อควรระวัง หรือบุคคลติดต่อ..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-hidden"
            />
          </div>

        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            ยกเลิก
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{taskToEdit ? 'บันทึกการแก้ไข' : 'บันทึกและมอบหมายงาน'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
