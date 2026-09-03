import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectFile, ProjectDocCategory } from '../../types';
import { HospitalLogo } from '../common/HospitalLogo';
import { 
  X, 
  FileText, 
  Download, 
  Eye, 
  Upload, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar, 
  User, 
  Building, 
  Layers, 
  Target, 
  Wallet, 
  Plus, 
  CheckSquare, 
  TrendingUp, 
  Paperclip,
  Share2,
  Edit,
  ArrowUpRight,
  FileCheck2
} from 'lucide-react';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { ProjectDocumentChecklistModal } from './ProjectDocumentChecklistModal';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onEdit: (project: Project) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onEdit
}) => {
  const { workgroups, personnel, updateProject, deleteProjectFile, addProjectFile, tasks, setSelectedTaskForDetail, setActiveTab } = useApp();
  const [activeTab, setActiveTabState] = useState<'overview' | 'documents' | 'budget'>('overview');
  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  // New File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [newFileCategory, setNewFileCategory] = useState<ProjectDocCategory>('proposal');
  const [newFileNotes, setNewFileNotes] = useState('');
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!project) return null;

  const currentWorkgroup = workgroups.find(w => w.id === project.workgroupId);
  const leader = personnel.find(p => p.id === project.leaderId);

  // Helper labels
  const getProjectTypeLabel = (type: string) => {
    switch (type) {
      case 'hospital_fund': return { label: 'โครงการเงินบำรุง รพ.', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'local_fund': return { label: 'กองทุน กปท. ท้องถิ่น', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'nhso_pp': return { label: 'สปสช. PP Express', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'strategic': return { label: 'ยุทธศาสตร์ สสจ./กสธ.', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'primary_care': return { label: 'บริการปฐมภูมิ & หมอครอบครัว', color: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'quality_improvement': return { label: 'พัฒนาคุณภาพ HA/PCA', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      default: return { label: 'โครงการอื่นๆ', color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft': return { label: 'ร่างโครงการ', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
      case 'submitted': return { label: 'เสนอขออนุมัติ', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock };
      case 'approved': return { label: 'อนุมัติแล้ว', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle };
      case 'in_progress': return { label: 'กำลังดำเนินงาน', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: TrendingUp };
      case 'completed': return { label: 'เสร็จสิ้นโครงการ', color: 'bg-teal-100 text-teal-800 border-teal-200', icon: CheckCircle };
      case 'evaluated': return { label: 'สรุปผลแล้ว', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: CheckCircle };
      case 'rejected': return { label: 'ส่งกลับแก้ไข', color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle };
      default: return { label: status, color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Clock };
    }
  };

  const getDocCategoryLabel = (category: string) => {
    switch (category) {
      case 'proposal': return 'แบบเสนอโครงการ (Proposal)';
      case 'approval': return 'ใบอนุมัติ / คำสั่งแต่งตั้ง';
      case 'schedule': return 'กำหนดการ / แผนงาน';
      case 'budget_plan': return 'แผนประมาณการงบประมาณ';
      case 'attendance': return 'ทะเบียนรายชื่อผู้เข้าร่วม';
      case 'summary_report': return 'รายงานสรุปผล / ภาพกิจกรรม';
      default: return 'เอกสารทั่วไป';
    }
  };

  const typeInfo = getProjectTypeLabel(project.type);
  const statusInfo = getStatusBadge(project.status);
  const StatusIcon = statusInfo.icon;

  const budgetRemaining = Math.max(0, project.budgetApproved - project.budgetSpent);
  const budgetSpentPercent = project.budgetApproved > 0 
    ? Math.min(100, Math.round((project.budgetSpent / project.budgetApproved) * 100)) 
    : 0;

  // Handle file select
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileObj(e.target.files[0]);
    }
  };

  const handleUploadSubmit = () => {
    if (!selectedFileObj) return;

    const fileName = selectedFileObj.name;
    const extension = fileName.split('.').pop()?.toLowerCase();
    let fileType: 'doc' | 'docx' | 'pdf' | 'excel' | 'other' = 'other';
    if (extension === 'doc') fileType = 'doc';
    else if (extension === 'docx') fileType = 'docx';
    else if (extension === 'pdf') fileType = 'pdf';
    else if (extension === 'xls' || extension === 'xlsx') fileType = 'excel';

    const fileSizeFormatted = (selectedFileObj.size / (1024 * 1024)).toFixed(1) + ' MB';

    // Read as Data URL
    const reader = new FileReader();
    reader.onload = () => {
      addProjectFile(project.id, {
        fileName,
        fileType,
        fileSize: fileSizeFormatted,
        fileData: reader.result as string,
        docCategory: newFileCategory,
        notes: newFileNotes.trim() || undefined
      });

      // Reset
      setSelectedFileObj(null);
      setNewFileNotes('');
      setIsUploading(false);
    };
    reader.readAsDataURL(selectedFileObj);
  };

  // Linked tasks
  const linkedTasks = tasks.filter(t => project.linkedTaskIds?.includes(t.id));

  return (
    <>
      <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-slate-900 text-white border-b border-slate-800 flex items-start justify-between">
            <div className="flex items-start gap-4 max-w-2xl">
              <HospitalLogo size="lg" className="shrink-0 hidden sm:inline-flex mt-1" />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {project.projectCode}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${typeInfo.color}`}>
                    {typeInfo.label}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border flex items-center gap-1.5 ${statusInfo.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusInfo.label}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium border border-slate-700">
                    ปีงบ {project.fiscalYear}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {project.title}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-emerald-400" />
                    {currentWorkgroup ? `${currentWorkgroup.code}. ${currentWorkgroup.name}` : 'กลุ่มงานปฐมภูมิ'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    ผู้รับผิดชอบ: {leader?.name || 'ไม่ระบุ'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsChecklistOpen(true)}
                className="p-2 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-xl transition text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="แบบตรวจเอกสารแนบโครงการ"
              >
                <FileCheck2 className="w-4 h-4 text-emerald-100" />
                <span className="hidden sm:inline">แบบตรวจเอกสาร</span>
              </button>
              <button
                onClick={() => onEdit(project)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl transition text-xs font-medium flex items-center gap-1.5 cursor-pointer border border-slate-700"
                title="แก้ไขข้อมูลโครงการ"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">แก้ไข</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 flex gap-2">
            <button
              onClick={() => setActiveTabState('overview')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Target className="w-4 h-4" />
              ข้อมูลทั่วไป & วัตถุประสงค์
            </button>
            <button
              onClick={() => setActiveTabState('documents')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'documents'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Paperclip className="w-4 h-4" />
              เอกสาร & ไฟล์แนบ (DOC/PDF)
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                {project.files?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTabState('budget')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'budget'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wallet className="w-4 h-4" />
              งบประมาณ & งานที่เกี่ยวข้อง
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Highlight Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium block">งบประมาณที่ได้รับอนุมัติ</span>
                    <span className="text-lg font-bold text-slate-900">฿{project.budgetApproved.toLocaleString()}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">จากที่เสนอ {project.budgetRequested.toLocaleString()} บาท</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium block">เบิกจ่ายไปแล้ว</span>
                    <span className="text-lg font-bold text-emerald-600">฿{project.budgetSpent.toLocaleString()}</span>
                    <span className="text-[11px] text-emerald-700 font-medium block mt-0.5">({budgetSpentPercent}%)</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium block">กลุ่มเป้าหมาย</span>
                    <span className="text-lg font-bold text-slate-900">{project.targetCount.toLocaleString()} ราย</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5 truncate">{project.targetGroup}</span>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs text-slate-500 font-medium block">ความก้าวหน้าโครงการ</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <span className="text-sm font-bold text-emerald-700">{project.progress}%</span>
                    </div>
                  </div>
                </div>

                {/* Project Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-emerald-600" />
                      ข้อมูลสถานที่และระยะเวลา
                    </h3>
                    <div className="text-xs space-y-2 text-slate-600">
                      <div>
                        <span className="text-slate-400 block">แหล่งงบประมาณ:</span>
                        <span className="font-semibold text-slate-800">{project.fundingSource}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">สถานที่ดำเนินงาน:</span>
                        <span className="font-semibold text-slate-800">{project.location}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">ระยะเวลาดำเนินโครงการ:</span>
                        <span className="font-semibold text-slate-800">{project.startDate} ถึง {project.endDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" />
                      ทีมงานผู้รับผิดชอบ
                    </h3>
                    <div className="text-xs space-y-2 text-slate-600">
                      <div>
                        <span className="text-slate-400 block">ผู้รับผิดชอบหลัก:</span>
                        <span className="font-semibold text-slate-800">{leader?.name} ({leader?.position})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">กลุ่มงานหลัก:</span>
                        <span className="font-semibold text-slate-800">{currentWorkgroup?.name}</span>
                      </div>
                      {project.coWorkgroupIds && project.coWorkgroupIds.length > 0 && (
                        <div>
                          <span className="text-slate-400 block">กลุ่มงานร่วมดำเนินงาน:</span>
                          <span className="font-medium text-slate-700">
                            {project.coWorkgroupIds.map(id => workgroups.find(w => w.id === id)?.shortName || id).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Objectives */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-emerald-600" />
                    วัตถุประสงค์โครงการ
                  </h3>
                  <ul className="space-y-2">
                    {project.objectives.map((obj, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Expected Outcomes */}
                {project.expectedOutcomes && project.expectedOutcomes.length > 0 && (
                  <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                      ผลผลิต / ผลลัพธ์ที่คาดหวัง
                    </h3>
                    <ul className="space-y-2">
                      {project.expectedOutcomes.map((out, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Notes */}
                {project.notes && (
                  <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                    <span className="font-bold block">บันทึกสถานะการดำเนินงานปัจจุบัน:</span>
                    <p>{project.notes}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Upload Action Card */}
                <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-emerald-700" />
                        นำเข้าเอกสารโครงการ (.doc, .docx, .pdf)
                      </h3>
                      <p className="text-xs text-emerald-700/80 mt-0.5">
                        รองรับไฟล์แบบเสนอโครงการ, ใบอนุมัติ, แผนประมาณการงบประมาณ และรายงานผล
                      </p>
                    </div>
                    {!isUploading && (
                      <button
                        onClick={() => setIsUploading(true)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        + อัปโหลดไฟล์เพิ่ม
                      </button>
                    )}
                  </div>

                  {/* Upload Form Box */}
                  {isUploading && (
                    <div className="bg-white p-4 rounded-xl border border-emerald-300 space-y-3.5 mt-3 shadow-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">หมวดหมู่เอกสาร *</label>
                          <select
                            value={newFileCategory}
                            onChange={(e) => setNewFileCategory(e.target.value as ProjectDocCategory)}
                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                          >
                            <option value="proposal">แบบเสนอโครงการ (Proposal)</option>
                            <option value="approval">ใบอนุมัติ / คำสั่งแต่งตั้ง</option>
                            <option value="schedule">กำหนดการ / แผนงาน</option>
                            <option value="budget_plan">แผนประมาณการงบประมาณ</option>
                            <option value="attendance">ทะเบียนรายชื่อผู้เข้าร่วม</option>
                            <option value="summary_report">รายงานสรุปผล / ภาพกิจกรรม</option>
                            <option value="other">เอกสารอื่นๆ</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-700 block mb-1">บันทึกช่วยจำ / รายละเอียด</label>
                          <input
                            type="text"
                            value={newFileNotes}
                            onChange={(e) => setNewFileNotes(e.target.value)}
                            placeholder="เช่น ฉบับแก้ไขรอบสอง, ผ่านความเห็นชอบ สสจ."
                            className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                          />
                        </div>
                      </div>

                      {/* File Drag/Picker Area */}
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 p-4 rounded-xl text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <FileText className="w-8 h-8 text-emerald-600" />
                        {selectedFileObj ? (
                          <div className="text-xs font-bold text-emerald-900">
                            ไฟล์ที่เลือก: {selectedFileObj.name} ({(selectedFileObj.size / (1024 * 1024)).toFixed(2)} MB)
                          </div>
                        ) : (
                          <div>
                            <span className="text-xs font-semibold text-emerald-800">คลิกเลือกไฟล์ หรือลากไฟล์มาวางที่นี่</span>
                            <span className="text-[11px] text-slate-500 block">รองรับไฟล์ DOC, DOCX, PDF (สูงสุด 25MB)</span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUploading(false);
                            setSelectedFileObj(null);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition cursor-pointer"
                        >
                          ยกเลิก
                        </button>
                        <button
                          type="button"
                          disabled={!selectedFileObj}
                          onClick={handleUploadSubmit}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
                        >
                          บันทึกเอกสาร
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* File List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                    <span>รายการเอกสารทั้งหมดในโครงการ ({project.files?.length || 0} ไฟล์)</span>
                  </h3>

                  {(!project.files || project.files.length === 0) ? (
                    <div className="bg-slate-50 p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
                      ยังไม่มีเอกสารแนบในโครงการนี้ กดปุ่ม "+ อัปโหลดไฟล์เพิ่ม" เพื่อนำเข้าไฟล์ DOC หรือ PDF
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {project.files.map((file) => {
                        const isPdf = file.fileType === 'pdf' || file.fileName.toLowerCase().endsWith('.pdf');
                        const isDoc = file.fileType === 'doc' || file.fileType === 'docx' || file.fileName.toLowerCase().endsWith('.doc') || file.fileName.toLowerCase().endsWith('.docx');

                        return (
                          <div 
                            key={file.id} 
                            className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-xs ${
                                isPdf ? 'bg-red-500' : isDoc ? 'bg-blue-600' : 'bg-emerald-600'
                              }`}>
                                {isPdf ? 'PDF' : isDoc ? 'DOC' : 'FILE'}
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                                    {file.fileName}
                                  </h4>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                                    {getDocCategoryLabel(file.docCategory)}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-x-3">
                                  <span>ขนาด: {file.fileSize}</span>
                                  <span>นำเข้า: {file.uploadedAt}</span>
                                  <span>โดย: {file.uploadedBy}</span>
                                </div>
                                {file.notes && (
                                  <p className="text-[11px] text-slate-600 mt-1 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                                    {file.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <button
                                onClick={() => setPreviewFile(file)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                ดูตัวอย่าง
                              </button>
                              <button
                                onClick={() => {
                                  setPreviewFile(file);
                                }}
                                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer border border-emerald-200"
                              >
                                <Download className="w-3.5 h-3.5" />
                                ดาวน์โหลด
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`คุณต้องการลบเอกสาร "${file.fileName}" ใช่หรือไม่?`)) {
                                    deleteProjectFile(project.id, file.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                title="ลบเอกสาร"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'budget' && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Budget Breakdown Card */}
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                    สถานะการเบิกจ่ายงบประมาณ
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">อัตราการเบิกจ่ายจริง ({budgetSpentPercent}%)</span>
                      <span className="text-emerald-700">฿{project.budgetSpent.toLocaleString()} / ฿{project.budgetApproved.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                        style={{ width: `${budgetSpentPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                      <span className="text-[11px] text-slate-400 block">งบเสนอขอ</span>
                      <span className="text-sm font-bold text-slate-800">฿{project.budgetRequested.toLocaleString()}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                      <span className="text-[11px] text-emerald-600 block">งบอนุมัติ</span>
                      <span className="text-sm font-bold text-emerald-700">฿{project.budgetApproved.toLocaleString()}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                      <span className="text-[11px] text-blue-600 block">งบคงเหลือ</span>
                      <span className="text-sm font-bold text-blue-700">฿{budgetRemaining.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Linked Tasks in System */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                    งานในระบบที่เชื่อมโยงกับโครงการนี้ ({linkedTasks.length} งาน)
                  </h3>

                  {linkedTasks.length === 0 ? (
                    <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs">
                      ยังไม่มีงานที่เชื่อมโยงกับโครงการนี้
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {linkedTasks.map(task => (
                        <div 
                          key={task.id}
                          onClick={() => {
                            setSelectedTaskForDetail(task);
                            setActiveTab('tasks');
                          }}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition flex items-center justify-between cursor-pointer"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-bold text-emerald-700">{task.taskCode}</span>
                              <span className="text-xs font-semibold text-slate-900">{task.title}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-3">
                              <span>กำหนดส่ง: {task.dueDate}</span>
                              <span>ความก้าวหน้า: {task.progress}%</span>
                            </div>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              อัปเดตล่าสุด: <span className="font-medium text-slate-700">{new Date(project.updatedAt).toLocaleDateString('th-TH')}</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => onEdit(project)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                แก้ไขโครงการ
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium transition cursor-pointer"
              >
                ปิด
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Embedded Document Preview Modal */}
      {previewFile && (
        <DocumentPreviewModal
          file={previewFile}
          projectTitle={project.title}
          projectCode={project.projectCode}
          onClose={() => setPreviewFile(null)}
        />
      )}

      {/* Project Document Checklist Modal (แบบตรวจเอกสารแนบโครงการ) */}
      {isChecklistOpen && (
        <ProjectDocumentChecklistModal
          isOpen={isChecklistOpen}
          project={project}
          onClose={() => setIsChecklistOpen(false)}
        />
      )}
    </>
  );
};
