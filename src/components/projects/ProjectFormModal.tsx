import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectType, ProjectStatus, ProjectDocCategory, ProjectFile } from '../../types';
import { X, Plus, Trash2, Upload, FileText, CheckCircle, AlertCircle, Calendar, User, Building, Target, Wallet } from 'lucide-react';

interface ProjectFormModalProps {
  isOpen: boolean;
  projectToEdit?: Project | null;
  onClose: () => void;
}

interface NewFileItem {
  id: string;
  file: File;
  fileName: string;
  fileType: 'doc' | 'docx' | 'pdf' | 'excel' | 'other';
  fileSize: string;
  fileData?: string;
  docCategory: ProjectDocCategory;
  notes?: string;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  projectToEdit,
  onClose
}) => {
  const { workgroups, personnel, addProject, updateProject, currentUser } = useApp();

  // Form State
  const [projectCode, setProjectCode] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ProjectType>('primary_care');
  const [workgroupId, setWorkgroupId] = useState(workgroups[0]?.id || 'wg-01');
  const [leaderId, setLeaderId] = useState(currentUser?.id || personnel[0]?.id || 'usr-01');
  const [fiscalYear, setFiscalYear] = useState<number>(2569);
  const [status, setStatus] = useState<ProjectStatus>('in_progress');
  const [budgetRequested, setBudgetRequested] = useState<number>(100000);
  const [budgetApproved, setBudgetApproved] = useState<number>(100000);
  const [budgetSpent, setBudgetSpent] = useState<number>(0);
  const [fundingSource, setFundingSource] = useState('งบสร้างเสริมสุขภาพและป้องกันโรค (PP Express สปสช.)');
  const [targetGroup, setTargetGroup] = useState('ประชาชนกลุ่มเป้าหมายในเขตอำเภอโพนนาแก้ว');
  const [targetCount, setTargetCount] = useState<number>(200);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('2026-09-30');
  const [location, setLocation] = useState('รพ.โพนนาแก้ว และ รพ.สต. ในเครือข่าย');
  const [objectives, setObjectives] = useState<string[]>(['เพื่อพัฒนาระบบบริการสุขภาพปฐมภูมิเชิงรุกในชุมชน']);
  const [expectedOutcomes, setExpectedOutcomes] = useState<string[]>(['กลุ่มเป้าหมายได้รับการดูแลสุขภาพตามมาตรฐาน']);
  const [progress, setProgress] = useState<number>(20);
  const [notes, setNotes] = useState('');

  // Initial Attachments for new project
  const [newFiles, setNewFiles] = useState<NewFileItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize or Reset Form
  useEffect(() => {
    if (projectToEdit) {
      setProjectCode(projectToEdit.projectCode);
      setTitle(projectToEdit.title);
      setType(projectToEdit.type);
      setWorkgroupId(projectToEdit.workgroupId);
      setLeaderId(projectToEdit.leaderId);
      setFiscalYear(projectToEdit.fiscalYear);
      setStatus(projectToEdit.status);
      setBudgetRequested(projectToEdit.budgetRequested);
      setBudgetApproved(projectToEdit.budgetApproved);
      setBudgetSpent(projectToEdit.budgetSpent);
      setFundingSource(projectToEdit.fundingSource);
      setTargetGroup(projectToEdit.targetGroup);
      setTargetCount(projectToEdit.targetCount);
      setStartDate(projectToEdit.startDate);
      setEndDate(projectToEdit.endDate);
      setLocation(projectToEdit.location);
      setObjectives(projectToEdit.objectives && projectToEdit.objectives.length > 0 ? projectToEdit.objectives : ['']);
      setExpectedOutcomes(projectToEdit.expectedOutcomes && projectToEdit.expectedOutcomes.length > 0 ? projectToEdit.expectedOutcomes : ['']);
      setProgress(projectToEdit.progress || 0);
      setNotes(projectToEdit.notes || '');
      setNewFiles([]);
    } else {
      // Auto-generate fresh project code
      const rand = Math.floor(100 + Math.random() * 900);
      setProjectCode(`PRJ-PNK-69-${rand}`);
      setTitle('');
      setType('primary_care');
      setWorkgroupId(workgroups[0]?.id || 'wg-01');
      setLeaderId(currentUser?.id || personnel[0]?.id || 'usr-01');
      setFiscalYear(2569);
      setStatus('in_progress');
      setBudgetRequested(80000);
      setBudgetApproved(80000);
      setBudgetSpent(0);
      setFundingSource('งบสร้างเสริมสุขภาพและป้องกันโรค (PP Express สปสช.)');
      setTargetGroup('กลุ่มเป้าหมายในพื้นที่รับผิดชอบ');
      setTargetCount(150);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('2026-09-30');
      setLocation('โรงพยาบาลโพนนาแก้ว และเครือข่าย รพ.สต.');
      setObjectives(['เพื่อพัฒนาคุณภาพบริการและส่งเสริมสุขภาพประชาชน']);
      setExpectedOutcomes(['ประชาชนได้รับบริการที่มีคุณภาพและเข้าถึงง่าย']);
      setProgress(15);
      setNotes('');
      setNewFiles([]);
    }
  }, [projectToEdit, isOpen, currentUser, personnel, workgroups]);

  if (!isOpen) return null;

  // Handle Objective item change
  const handleObjectiveChange = (index: number, val: string) => {
    const updated = [...objectives];
    updated[index] = val;
    setObjectives(updated);
  };

  const addObjective = () => {
    setObjectives([...objectives, '']);
  };

  const removeObjective = (index: number) => {
    if (objectives.length <= 1) return;
    setObjectives(objectives.filter((_, idx) => idx !== index));
  };

  // Handle Expected Outcome change
  const handleOutcomeChange = (index: number, val: string) => {
    const updated = [...expectedOutcomes];
    updated[index] = val;
    setExpectedOutcomes(updated);
  };

  const addOutcome = () => {
    setExpectedOutcomes([...expectedOutcomes, '']);
  };

  const removeOutcome = (index: number) => {
    if (expectedOutcomes.length <= 1) return;
    setExpectedOutcomes(expectedOutcomes.filter((_, idx) => idx !== index));
  };

  // File upload handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray: File[] = Array.from(e.target.files);

    filesArray.forEach((file: File) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      let fileType: 'doc' | 'docx' | 'pdf' | 'excel' | 'other' = 'other';
      if (extension === 'doc') fileType = 'doc';
      else if (extension === 'docx') fileType = 'docx';
      else if (extension === 'pdf') fileType = 'pdf';
      else if (extension === 'xls' || extension === 'xlsx') fileType = 'excel';

      const fileSizeFormatted = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      const reader = new FileReader();
      reader.onload = () => {
        setNewFiles(prev => [
          ...prev,
          {
            id: `temp-${Date.now()}-${Math.random()}`,
            file,
            fileName: file.name,
            fileType,
            fileSize: fileSizeFormatted,
            fileData: reader.result as string,
            docCategory: 'proposal',
            notes: ''
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewFile = (id: string) => {
    setNewFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateNewFileCategory = (id: string, category: ProjectDocCategory) => {
    setNewFiles(prev => prev.map(f => f.id === id ? { ...f, docCategory: category } : f));
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('กรุณาระบุชื่อโครงการ');
      return;
    }

    const filteredObjectives = objectives.filter(o => o.trim().length > 0);
    const filteredOutcomes = expectedOutcomes.filter(o => o.trim().length > 0);

    const projectPayload = {
      projectCode: projectCode.trim() || `PRJ-PNK-69-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim(),
      type,
      workgroupId,
      leaderId,
      fiscalYear,
      status,
      budgetRequested: Number(budgetRequested) || 0,
      budgetApproved: Number(budgetApproved) || 0,
      budgetSpent: Number(budgetSpent) || 0,
      fundingSource: fundingSource.trim(),
      targetGroup: targetGroup.trim(),
      targetCount: Number(targetCount) || 0,
      startDate,
      endDate,
      location: location.trim(),
      objectives: filteredObjectives.length > 0 ? filteredObjectives : ['เพื่อพัฒนาคุณภาพบริการ'],
      expectedOutcomes: filteredOutcomes.length > 0 ? filteredOutcomes : ['ผลลัพธ์ตามเป้าหมาย'],
      progress: Number(progress) || 0,
      notes: notes.trim() || undefined
    };

    if (projectToEdit) {
      updateProject(projectToEdit.id, projectPayload);
    } else {
      const filesForCreation = newFiles.map(nf => ({
        fileName: nf.fileName,
        fileType: nf.fileType,
        fileSize: nf.fileSize,
        fileData: nf.fileData,
        docCategory: nf.docCategory,
        notes: nf.notes
      }));
      addProject(projectPayload, filesForCreation);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              {projectToEdit ? 'แก้ไขข้อมูลโครงการ' : 'บันทึกโครงการใหม่'}
            </h2>
            <p className="text-xs text-slate-400">
              {projectToEdit ? `รหัสโครงการ: ${projectToEdit.projectCode}` : 'กรอกข้อมูลโครงการและนำเข้าไฟล์เอกสาร (.doc, .pdf)'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: ข้อมูลหลักโครงการ */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <Building className="w-4 h-4 text-emerald-600" />
              1. ข้อมูลหลักโครงการ & การจัดหมวดหมู่
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">รหัสโครงการ *</label>
                <input
                  type="text"
                  required
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value)}
                  placeholder="เช่น PRJ-PNK-69-001"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600 font-mono font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">ประเภทโครงการ (แยกประเภท) *</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ProjectType)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600 font-medium"
                >
                  <option value="primary_care">บริการปฐมภูมิและหมอครอบครัว</option>
                  <option value="hospital_fund">โครงการเงินบำรุง รพ.</option>
                  <option value="local_fund">กองทุน กปท. ท้องถิ่น / อบต.</option>
                  <option value="nhso_pp">งบสร้างเสริมสุขภาพ สปสช. (PP Express)</option>
                  <option value="strategic">โครงการตามยุทธศาสตร์ สสจ./กสธ.</option>
                  <option value="quality_improvement">พัฒนาคุณภาพบริการ (HA / PCA)</option>
                  <option value="other">โครงการอื่นๆ</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">สถานะโครงการ *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600 font-medium"
                >
                  <option value="draft">ร่างโครงการ</option>
                  <option value="submitted">ยื่นขออนุมัติ</option>
                  <option value="approved">อนุมัติแล้ว</option>
                  <option value="in_progress">กำลังดำเนินงาน</option>
                  <option value="completed">เสร็จสิ้นโครงการ</option>
                  <option value="evaluated">สรุปและประเมินผลแล้ว</option>
                  <option value="rejected">ส่งกลับแก้ไข</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">ชื่อโครงการ *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น โครงการพัฒนาระบบการดูแลผู้ป่วยเบาหวานและความดันโลหิตสูงเชิงรุกในชุมชน..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">กลุ่มงานรับผิดชอบหลัก (13 กลุ่มงาน) *</label>
                <select
                  value={workgroupId}
                  onChange={(e) => setWorkgroupId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                >
                  {workgroups.map(w => (
                    <option key={w.id} value={w.id}>{w.code}. {w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">ผู้รับผิดชอบหลัก *</label>
                <select
                  value={leaderId}
                  onChange={(e) => setLeaderId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                >
                  {personnel.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.position})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">ปีงบประมาณ</label>
                <select
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                >
                  <option value={2568}>2568</option>
                  <option value={2569}>2569</option>
                  <option value={2570}>2570</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: งบประมาณและกลุ่มเป้าหมาย */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <Wallet className="w-4 h-4 text-emerald-600" />
              2. งบประมาณ & กลุ่มเป้าหมาย & สถานที่
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">งบประมาณที่ขออนุมัติ (บาท)</label>
                <input
                  type="number"
                  min="0"
                  value={budgetRequested}
                  onChange={(e) => setBudgetRequested(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">งบประมาณที่ได้รับอนุมัติ (บาท)</label>
                <input
                  type="number"
                  min="0"
                  value={budgetApproved}
                  onChange={(e) => setBudgetApproved(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600 font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">งบประมาณเบิกจ่ายไปแล้ว (บาท)</label>
                <input
                  type="number"
                  min="0"
                  value={budgetSpent}
                  onChange={(e) => setBudgetSpent(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600 text-blue-700 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">แหล่งงบประมาณ</label>
                <input
                  type="text"
                  value={fundingSource}
                  onChange={(e) => setFundingSource(e.target.value)}
                  placeholder="เช่น กองทุนหลักประกันสุขภาพ อบต.บ้านนาแก้ว, เงินบำรุง รพ."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">สถานที่ดำเนินงาน</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="เช่น โรงพยาบาลโพนนาแก้ว, ศพด. และ รพ.สต. เครือข่าย"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">กลุ่มเป้าหมาย</label>
                <input
                  type="text"
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  placeholder="เช่น ผู้ป่วยเบาหวานและความดันโลหิตสูง"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">จำนวนเป้าหมาย (คน/ราย)</label>
                <input
                  type="number"
                  min="1"
                  value={targetCount}
                  onChange={(e) => setTargetCount(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">ความก้าวหน้าโครงการ ({progress}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full mt-2 accent-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">วันที่เริ่มดำเนินโครงการ</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">วันที่สิ้นสุดโครงการ</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: วัตถุประสงค์และผลลัพธ์ */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <Target className="w-4 h-4 text-emerald-600" />
              3. วัตถุประสงค์โครงการ & ผลผลิตที่คาดหวัง
            </h3>

            {/* Objectives List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">วัตถุประสงค์โครงการ</label>
                <button
                  type="button"
                  onClick={addObjective}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> เพิ่มวัตถุประสงค์
                </button>
              </div>
              {objectives.map((obj, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => handleObjectiveChange(idx, e.target.value)}
                    placeholder={`วัตถุประสงค์ข้อที่ ${idx + 1}`}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                  />
                  {objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObjective(idx)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Outcomes List */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">ผลผลิต / ผลลัพธ์ที่คาดหวัง</label>
                <button
                  type="button"
                  onClick={addOutcome}
                  className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> เพิ่มผลลัพธ์
                </button>
              </div>
              {expectedOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0">
                    ✓
                  </span>
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => handleOutcomeChange(idx, e.target.value)}
                    placeholder={`ผลลัพธ์ที่คาดหวังข้อที่ ${idx + 1}`}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
                  />
                  {expectedOutcomes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOutcome(idx)}
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: นำเข้าไฟล์เอกสาร (.doc, .pdf) ตอนสร้างโครงการ */}
          {!projectToEdit && (
            <div className="space-y-4 bg-emerald-50/40 p-5 rounded-2xl border border-emerald-200">
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-emerald-200">
                <Upload className="w-4 h-4 text-emerald-700" />
                4. นำเข้าไฟล์เอกสารโครงการ (.doc, .docx, .pdf)
              </h3>

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-white p-5 rounded-xl text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <FileText className="w-8 h-8 text-emerald-600" />
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">คลิกเลือกไฟล์ หรือลากไฟล์เอกสารมาวางที่นี่</span>
                  <span className="text-[11px] text-slate-500 block">รองรับไฟล์ Microsoft Word (.doc, .docx), Adobe PDF (.pdf)</span>
                </div>
              </div>

              {/* Selected Files List in Creation Form */}
              {newFiles.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-emerald-950 block">เอกสารที่เตรียมบันทึก ({newFiles.length} ไฟล์):</span>
                  {newFiles.map(nf => (
                    <div key={nf.id} className="bg-white p-3 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded text-white ${
                          nf.fileType === 'pdf' ? 'bg-red-500' : 'bg-blue-600'
                        }`}>
                          {nf.fileType.toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{nf.fileName}</p>
                          <span className="text-[10px] text-slate-400">{nf.fileSize}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                          value={nf.docCategory}
                          onChange={(e) => updateNewFileCategory(nf.id, e.target.value as ProjectDocCategory)}
                          className="text-[11px] p-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-700"
                        >
                          <option value="proposal">แบบเสนอโครงการ</option>
                          <option value="approval">ใบอนุมัติ/คำสั่ง</option>
                          <option value="schedule">กำหนดการ/แผนงาน</option>
                          <option value="budget_plan">แผนงบประมาณ</option>
                          <option value="attendance">ทะเบียนรายชื่อ</option>
                          <option value="summary_report">รายงานสรุปผล</option>
                          <option value="other">อื่นๆ</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => removeNewFile(nf.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section 5: บันทึกเพิ่มเติม */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">บันทึกเพิ่มเติม / หมายเหตุ</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ระบุข้อความหรือข้อมูลเพิ่มเติมสำหรับโครงการนี้..."
              className="w-full text-xs p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {projectToEdit ? 'บันทึกการแก้ไข' : 'ยืนยันบันทึกโครงการ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
