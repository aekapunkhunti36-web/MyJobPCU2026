import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, Priority } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { 
  X, 
  Calendar, 
  Users, 
  Layers, 
  Target, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  Paperclip, 
  Send, 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  Image as ImageIcon, 
  Trash2, 
  Edit3, 
  CheckSquare, 
  Square,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Share2,
  Download
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, onEdit }) => {
  const { 
    workgroups, 
    personnel, 
    kpis, 
    currentUser, 
    updateTaskProgress, 
    updateTask, 
    deleteTask,
    addTaskComment, 
    addTaskAttachment, 
    deleteTaskAttachment,
    toggleSubtask 
  } = useApp();

  const [commentInput, setCommentInput] = useState('');
  const [activeTab, setActiveTab] = useState<'timeline' | 'comments' | 'attachments' | 'checklist'>('timeline');
  const [isUploading, setIsUploading] = useState(false);
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('รายงานผลการดำเนินงาน');
  const [fileCategory, setFileCategory] = useState<'pdf' | 'word' | 'excel' | 'image'>('pdf');
  const [customProgress, setCustomProgress] = useState<number>(task?.progress || 0);

  if (!task) return null;

  const currentWg = workgroups.find(w => w.id === task.workgroupId);
  const mainAssignee = personnel.find(p => p.id === task.mainAssigneeId);
  const coAssignees = personnel.filter(p => task.coAssigneeIds?.includes(p.id));
  const linkedKpi = kpis.find(k => k.id === task.kpiId);

  const handleProgressChange = (newVal: number) => {
    setCustomProgress(newVal);
    updateTaskProgress(task.id, newVal, newVal === 100 ? 'completed' : undefined);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus, progress: newStatus === 'completed' ? 100 : task.progress });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addTaskComment(task.id, commentInput);
    setCommentInput('');
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      alert('กรุณากรอกชื่อไฟล์เอกสาร');
      return;
    }

    const sizes = ['1.2 MB', '2.8 MB', '4.5 MB', '850 KB', '3.1 MB'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    
    let extension = '.pdf';
    if (fileCategory === 'word') extension = '.docx';
    if (fileCategory === 'excel') extension = '.xlsx';
    if (fileCategory === 'image') extension = '.jpg';

    const fullFileName = docName.endsWith(extension) ? docName : `${docName}${extension}`;

    addTaskAttachment(task.id, {
      name: fullFileName,
      fileType: fileCategory,
      fileSize: randomSize,
      docType: docType
    });

    setDocName('');
    setIsUploading(false);
  };

  const handleDeleteTask = () => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบงาน "${task.title}"?`)) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 rounded-t-2xl flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-bold text-teal-800 bg-teal-100/80 px-2.5 py-0.5 rounded border border-teal-200">
                {task.taskCode}
              </span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-200/80 px-2.5 py-0.5 rounded">
                กลุ่มงานที่ {currentWg?.code} • {currentWg?.shortName}
              </span>
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {task.title}
            </h2>
            
            {task.subActivity && (
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span>ภารกิจย่อย: <strong>{task.subActivity}</strong></span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onEdit(task)}
              className="p-2 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition"
              title="แก้ไขข้อมูล"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDeleteTask}
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="ลบงานนี้"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Quick Metrics & Meta Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">ผู้รับผิดชอบหลัก:</span>
              <strong className="text-slate-800 font-semibold">{mainAssignee?.name || 'ไม่ระบุ'}</strong>
              <span className="text-[11px] text-slate-500 block truncate">{mainAssignee?.position}</span>
            </div>
            
            <div>
              <span className="text-slate-400 block mb-0.5">วันที่เริ่ม - กำหนดส่ง:</span>
              <span className="text-slate-700 block">{task.startDate}</span>
              <strong className="text-rose-700 font-bold block">ถึง {task.dueDate}</strong>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">สถานะงาน:</span>
              <select
                value={task.status}
                onChange={e => handleStatusChange(e.target.value as TaskStatus)}
                className="mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 cursor-pointer"
              >
                <option value="not_started">ยังไม่เริ่ม</option>
                <option value="in_progress">กำลังดำเนินการ</option>
                <option value="pending">รอติดตาม</option>
                <option value="completed">เสร็จสิ้น</option>
                <option value="overdue">เกินกำหนด</option>
              </select>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">เป้าหมายผลงาน:</span>
              <strong className="text-teal-800 font-semibold truncate block">
                {task.targetValue || 'ตามเกณฑ์มาตรฐาน'}
              </strong>
              {linkedKpi && (
                <span className="text-[10px] text-slate-500 truncate block">
                  KPI: {linkedKpi.code}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Progress Bar & Quick Adjust */}
          <div className="p-4 bg-teal-50/40 rounded-xl border border-teal-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-950 uppercase tracking-wider">ความก้าวหน้าภารกิจ (Progress)</span>
                <span className="text-sm font-extrabold text-teal-800">{task.progress}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[0, 25, 50, 75, 100].map(val => (
                  <button
                    key={val}
                    onClick={() => handleProgressChange(val)}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded transition cursor-pointer ${
                      task.progress === val 
                        ? 'bg-teal-600 text-white shadow-xs' 
                        : 'bg-white text-slate-600 hover:bg-teal-100 border border-slate-200'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={task.progress}
              onChange={e => handleProgressChange(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>

          {/* Task Description & Co-Assignees */}
          {task.description && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                รายละเอียดงาน
              </h4>
              <p className="text-sm text-slate-700 bg-white p-3.5 rounded-xl border border-slate-200/80 whitespace-pre-line leading-relaxed">
                {task.description}
              </p>
            </div>
          )}

          {coAssignees.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Users className="w-4 h-4 text-teal-600" />
              <span>ผู้ร่วมรับผิดชอบ:</span>
              <div className="flex flex-wrap gap-1.5">
                {coAssignees.map(ca => (
                  <span key={ca.id} className="bg-slate-100 px-2 py-0.5 rounded-full font-medium text-slate-700">
                    {ca.name} ({ca.position})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subtabs for Checklist, Timeline, Comments, Attachments */}
          <div>
            <div className="flex border-b border-slate-200 text-xs font-bold">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`py-2.5 px-4 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>ไทม์ไลน์ความก้าวหน้า ({task.timeline?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('checklist')}
                className={`py-2.5 px-4 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'checklist'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>ขั้นตอนย่อย Checklist ({task.subtasks?.filter(s => s.completed).length || 0}/{task.subtasks?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('comments')}
                className={`py-2.5 px-4 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'comments'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>บันทึกความก้าวหน้า / หมายเหตุ ({task.comments?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('attachments')}
                className={`py-2.5 px-4 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'attachments'
                    ? 'border-teal-600 text-teal-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>หลักฐานและเอกสารแนบ ({task.attachments?.length || 0})</span>
              </button>
            </div>

            {/* Tab 1: Timeline Steps */}
            {activeTab === 'timeline' && (
              <div className="pt-4 space-y-4">
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-teal-200">
                  {task.timeline?.map((log, idx) => (
                    <div key={log.id} className="relative group">
                      <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-[10px] ring-4 ring-white shadow-xs">
                        {idx + 1}
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h5 className="text-xs font-bold text-slate-800">{log.step}</h5>
                          <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-600">{log.notes || 'ดำเนินการตามขั้นตอน'}</p>
                        <span className="text-[10px] text-teal-700 font-medium block mt-1">
                          ผู้บันทึก: {log.updatedBy}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center">
                  <p className="text-xs text-slate-500">
                    💡 ขั้นตอนจะถูกบันทึกอัตโนมัติเมื่อปรับแถบความก้าวหน้า หรือเปลี่ยนสถานะงาน
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Checklist / Subtasks */}
            {activeTab === 'checklist' && (
              <div className="pt-4 space-y-2">
                {(!task.subtasks || task.subtasks.length === 0) ? (
                  <p className="text-xs text-slate-400 py-4 text-center">ไม่มีขั้นตอนย่อยที่ระบุไว้</p>
                ) : (
                  task.subtasks.map(st => (
                    <div
                      key={st.id}
                      onClick={() => toggleSubtask(task.id, st.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer ${
                        st.completed 
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-500 line-through' 
                          : 'bg-white border-slate-200 hover:border-teal-400 text-slate-800 font-medium'
                      }`}
                    >
                      {st.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 shrink-0" />
                      )}
                      <span className="text-xs sm:text-sm">{st.title}</span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Comments */}
            {activeTab === 'comments' && (
              <div className="pt-4 space-y-4">
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="เพิ่มบันทึกความก้าวหน้า เช่น 'ลงพื้นที่เยี่ยมบ้านแล้ว 15 ราย'..."
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:border-teal-500 focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>บันทึก</span>
                  </button>
                </form>

                <div className="space-y-3">
                  {(!task.comments || task.comments.length === 0) ? (
                    <p className="text-xs text-slate-400 py-6 text-center">ยังไม่มีข้อความบันทึกความก้าวหน้า</p>
                  ) : (
                    task.comments.map(c => (
                      <div key={c.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                            {c.userName}
                            {c.userPosition && <span className="text-[10px] text-slate-400 font-normal">({c.userPosition})</span>}
                          </span>
                          <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Attachments */}
            {activeTab === 'attachments' && (
              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">หลักฐานและเอกสารแนบในระบบ</span>
                  <button
                    onClick={() => setIsUploading(!isUploading)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>+ แนบหลักฐานใหม่ (PDF, Word, Excel, รูปภาพ)</span>
                  </button>
                </div>

                {isUploading && (
                  <form onSubmit={handleSimulateUpload} className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 space-y-3 animate-in fade-in duration-150">
                    <h5 className="text-xs font-bold text-teal-900">แนบไฟล์เอกสารหลักฐานการดำเนินงาน</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">ประเภทไฟล์</label>
                        <select
                          value={fileCategory}
                          onChange={e => setFileCategory(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                        >
                          <option value="pdf">📄 PDF Document</option>
                          <option value="word">📝 Microsoft Word (.docx)</option>
                          <option value="excel">📊 Microsoft Excel (.xlsx)</option>
                          <option value="image">🖼️ รูปภาพกิจกรรม (.jpg, .png)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">ประเภทเอกสาร</label>
                        <select
                          value={docType}
                          onChange={e => setDocType(e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                        >
                          <option value="รายงานผลการดำเนินงาน">รายงานผลการดำเนินงาน</option>
                          <option value="ภาพถ่ายกิจกรรม">ภาพถ่ายกิจกรรม</option>
                          <option value="แบบฟอร์มข้อมูล">แบบฟอร์มข้อมูล</option>
                          <option value="คู่มือแนวทางปฏิบัติ">คู่มือแนวทางปฏิบัติ</option>
                          <option value="ใบรับรอง/ประกาศนียบัตร">ใบรับรอง/ประกาศนียบัตร</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">ชื่อไฟล์เอกสาร</label>
                        <input
                          type="text"
                          placeholder="เช่น รายงานผลเยี่ยมบ้าน_สิงหาคม69"
                          value={docName}
                          onChange={e => setDocName(e.target.value)}
                          required
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsUploading(false)}
                        className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg shadow-xs"
                      >
                        อัปโหลดเข้าคลังหลักฐาน
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(!task.attachments || task.attachments.length === 0) ? (
                    <div className="col-span-2 py-8 text-center text-slate-400 text-xs">
                      ยังไม่มีหลักฐานที่แนบไว้ในงานนี้
                    </div>
                  ) : (
                    task.attachments.map(att => (
                      <div key={att.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs flex items-start justify-between gap-3 group hover:border-teal-300 transition">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className={`p-2.5 rounded-lg shrink-0 ${
                            att.fileType === 'pdf' ? 'bg-rose-50 text-rose-600' :
                            att.fileType === 'excel' ? 'bg-emerald-50 text-emerald-600' :
                            att.fileType === 'word' ? 'bg-blue-50 text-blue-600' :
                            'bg-amber-50 text-amber-600'
                          }`}>
                            {att.fileType === 'pdf' ? <FileText className="w-5 h-5" /> :
                             att.fileType === 'excel' ? <FileSpreadsheet className="w-5 h-5" /> :
                             att.fileType === 'image' ? <ImageIcon className="w-5 h-5" /> :
                             <FileCode className="w-5 h-5" />}
                          </div>

                          <div className="min-w-0">
                            <h6 className="text-xs font-bold text-slate-800 truncate" title={att.name}>{att.name}</h6>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span>{att.fileSize}</span>
                              <span>•</span>
                              <span className="text-teal-700 font-semibold">{att.docType}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-1">
                              ผู้อัปโหลด: {att.uploadedBy} ({att.uploadedAt})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => alert(`ดาวน์โหลดไฟล์: ${att.name}`)}
                            className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition"
                            title="ดาวน์โหลดไฟล์"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTaskAttachment(task.id, att.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="ลบไฟล์นี้"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <span className="text-xs text-slate-500">
            รหัสประจำตัวงาน: <code className="font-mono text-slate-700">{task.id}</code>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
