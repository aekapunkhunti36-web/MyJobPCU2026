import React, { useState, useEffect } from 'react';
import { Project, ProjectDocumentChecklist, ProjectChecklistItems } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  FileCheck2, 
  Printer, 
  Save, 
  X, 
  CheckSquare, 
  Square, 
  AlertCircle, 
  CheckCircle2, 
  Building, 
  Coins, 
  Calendar, 
  User, 
  Plus, 
  Trash2,
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ProjectDocumentChecklistModalProps {
  isOpen: boolean;
  project?: Project | null;
  onClose: () => void;
  onSaved?: (checklist: ProjectDocumentChecklist) => void;
}

const defaultChecklistItems: ProjectChecklistItems = {
  kpt10_report: false,
  shop_receipt: false,
  shop_id_card: false,
  shop_inspection_cert: false,
  shop_delivery_note: false,
  shop_commercial_reg: false,
  shop_po_agreement: false,
  shop_winner_announcement: false,
  shop_approval_report: false,
  shop_price_agreement: false,
  shop_quotation: false,
  shop_committee_appointment: false,
  shop_egp_report: false,
  shop_tor_note: false,
  shop_tor_draft: false,
  shop_tor_appointment: false,
  food_receipt: false,
  food_id_card: false,
  food_inspection_cert: false,
  speaker_receipt: false,
  speaker_id_card: false,
  speaker_acceptance: false,
  speaker_invitation_letter: false,
  speaker_inspection_cert: false,
  activity_photos: false,
  attendance_with_id: false,
  project_copy_schedule: false,
  approval_memo: false,
};

export const ProjectDocumentChecklistModal: React.FC<ProjectDocumentChecklistModalProps> = ({
  isOpen,
  project,
  onClose,
  onSaved
}) => {
  const { projects, updateProject, currentUser } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>(project?.id || '');
  const [fundName, setFundName] = useState<string>('กองทุนหลักประกันสุขภาพเทศบาลตำบลนาแก้ว');
  const [agencyName, setAgencyName] = useState<string>('โรงพยาบาลโพนนาแก้ว');
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [year, setYear] = useState<string>('2568');
  const [activities, setActivities] = useState<string[]>([
    'จัดอบรมให้ความรู้เชิงปฏิบัติการแก่กลุ่มเป้าหมาย',
    'กิจกรรมรณรงค์ตรวจคัดกรองสุขภาพเชิงรุกในชุมชน',
    'การลงพื้นที่ติดตามเยี่ยมบ้านและประเมินผล'
  ]);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [spentBudget, setSpentBudget] = useState<number>(0);
  const [returnItemsDescription, setReturnItemsDescription] = useState<string>('');
  
  const [items, setItems] = useState<ProjectChecklistItems>(defaultChecklistItems);
  const [reviewResult, setReviewResult] = useState<'pass' | 'amend' | 'pending'>('pending');
  const [notes, setNotes] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('นายแพทย์วิศรุต วงศ์ไทย');
  const [reviewerPosition, setReviewerPosition] = useState<string>('ผู้อำนวยการโรงพยาบาลโพนนาแก้ว');
  const [reviewDate, setReviewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isSavedAlert, setIsSavedAlert] = useState<boolean>(false);

  // Auto-fill from selected project
  useEffect(() => {
    const currentProj = projects.find(p => p.id === selectedProjectId) || project;
    if (currentProj) {
      setProjectTitle(currentProj.title);
      setTotalBudget(currentProj.budgetApproved || currentProj.budgetRequested || 0);
      setSpentBudget(currentProj.budgetSpent || 0);
      setYear(currentProj.fiscalYear?.toString() || '2568');

      if (currentProj.checklist) {
        const c = currentProj.checklist;
        setFundName(c.fundName || 'กองทุนหลักประกันสุขภาพเทศบาลตำบลนาแก้ว');
        setAgencyName(c.agencyName || 'โรงพยาบาลโพนนาแก้ว');
        setYear(c.year || currentProj.fiscalYear?.toString() || '2568');
        setActivities(c.activities && c.activities.length > 0 ? c.activities : [currentProj.title]);
        setTotalBudget(c.totalBudget ?? currentProj.budgetApproved ?? 0);
        setSpentBudget(c.spentBudget ?? currentProj.budgetSpent ?? 0);
        setReturnItemsDescription(c.returnItemsDescription || '');
        setItems(c.items || defaultChecklistItems);
        setReviewResult(c.reviewResult || 'pending');
        setNotes(c.notes || '');
        setReviewerName(c.reviewerName || currentUser?.name || 'นายแพทย์วิศรุต วงศ์ไทย');
        setReviewerPosition(c.reviewerPosition || currentUser?.position || 'ผู้อำนวยการโรงพยาบาลโพนนาแก้ว');
        setReviewDate(c.reviewDate || new Date().toISOString().split('T')[0]);
      } else {
        // Defaults from project
        if (currentProj.fundingSource) {
          setFundName(currentProj.fundingSource);
        }
      }
    }
  }, [selectedProjectId, project, projects, currentUser]);

  if (!isOpen) return null;

  const remainingBudget = Math.max(0, totalBudget - spentBudget);

  const toggleItem = (key: keyof ProjectChecklistItems) => {
    setItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCheckAll = (val: boolean) => {
    const updated: any = {};
    Object.keys(defaultChecklistItems).forEach(k => {
      updated[k] = val;
    });
    setItems(updated);
  };

  const handleAddActivity = () => {
    if (activities.length < 10) {
      setActivities([...activities, '']);
    }
  };

  const handleUpdateActivity = (index: number, val: string) => {
    const next = [...activities];
    next[index] = val;
    setActivities(next);
  };

  const handleRemoveActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const totalCount = Object.keys(defaultChecklistItems).length;
  const checkedCount = Object.values(items).filter(Boolean).length;
  const percentComplete = Math.round((checkedCount / totalCount) * 100);

  const handleSave = () => {
    const currentProj = projects.find(p => p.id === selectedProjectId) || project;
    const checklistData: ProjectDocumentChecklist = {
      projectId: currentProj?.id,
      projectCode: currentProj?.projectCode,
      fundName,
      agencyName,
      projectTitle,
      year,
      activities: activities.filter(a => a.trim().length > 0),
      totalBudget,
      spentBudget,
      remainingBudget,
      returnItemsDescription,
      items,
      reviewResult: checkedCount >= 20 ? (reviewResult === 'pending' ? 'pass' : reviewResult) : reviewResult,
      notes,
      reviewerName,
      reviewerPosition,
      reviewDate,
      updatedAt: new Date().toISOString()
    };

    if (currentProj) {
      updateProject(currentProj.id, {
        checklist: checklistData
      });
    }

    if (onSaved) {
      onSaved(checklistData);
    }

    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:h-auto print:overflow-visible">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200 print:shadow-none print:border-none print:max-w-none print:max-h-none print:w-full print:rounded-none">
        
        {/* Header - Hidden in Print */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                แบบตรวจเอกสารแนบโครงการ (Checklist)
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  สำหรับส่วนราชการ/หน่วยงาน
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                ระบบตรวจสอบความครบถ้วนของเอกสารโครงการ & พิมพ์แบบตรวจเอกสารทางการ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="พิมพ์แบบฟอร์ม"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">พิมพ์แบบฟอร์ม (A4)</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>บันทึก</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Saved Alert Toast */}
        {isSavedAlert && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between shadow-inner print:hidden">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              บันทึกผลการตรวจเอกสารแนบโครงการเรียบร้อยแล้ว
            </span>
            <button onClick={() => setIsSavedAlert(false)} className="text-emerald-200 hover:text-white text-xs">
              ปิด
            </button>
          </div>
        )}

        {/* Progress & Quick Controls Bar - Hidden in Print */}
        <div className="px-6 py-3 bg-emerald-50/70 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700">ความครบถ้วนของเอกสาร:</span>
            <div className="w-32 bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <span className="font-bold text-emerald-800">
              {checkedCount} จาก {totalCount} รายการ ({percentComplete}%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleCheckAll(true)}
              className="px-2.5 py-1 bg-white hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] font-semibold transition cursor-pointer"
            >
              เลือกทั้งหมด
            </button>
            <button
              type="button"
              onClick={() => handleCheckAll(false)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-[11px] font-semibold transition cursor-pointer"
            >
              ล้างทั้งหมด
            </button>
          </div>
        </div>

        {/* Form Body - Scrollable on Screen, Full Expansion on Print */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 print:overflow-visible print:p-8 print:space-y-4 text-slate-900 font-sans">
          
          {/* Printable Official Header matching 001.jpg & 002.jpg */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-slate-800">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              ตรวจเอกสารแนบโครงการ{fundName} ปี {year}
            </h1>
            <p className="text-sm font-semibold text-slate-700">
              (กรณี ส่วนราชการ/หน่วยงานราชการ)
            </p>
          </div>

          {/* Form Header Info (หน่วยงาน, ชื่อโครงการ, รายการกิจกรรม, งบประมาณ) */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 print:bg-transparent print:p-0 print:border-none space-y-3 text-xs sm:text-sm">
            
            {/* Select existing project if available (Interactive Only) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:hidden">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  เลือกโครงการที่ต้องการตรวจเอกสาร:
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-emerald-500"
                >
                  <option value="">-- กรอกข้อมูลโครงการเอง (หรือเลือกจากระบบ) --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.projectCode}] {p.title} (ปี {p.fiscalYear})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อกองทุน / แหล่งงบประมาณ:
                </label>
                <input
                  type="text"
                  value={fundName}
                  onChange={e => setFundName(e.target.value)}
                  placeholder="เช่น กองทุนหลักประกันสุขภาพเทศบาลตำบลนาแก้ว"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:outline-emerald-500"
                />
              </div>
            </div>

            {/* Print & Screen Layout for Agency and Project Name */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="font-bold text-slate-800 whitespace-nowrap">หน่วยงาน:</span>
                <input
                  type="text"
                  value={agencyName}
                  onChange={e => setAgencyName(e.target.value)}
                  placeholder="เช่น โรงพยาบาลโพนนาแก้ว"
                  className="flex-1 px-2.5 py-1 bg-white border-b border-dotted border-slate-400 focus:border-emerald-600 focus:outline-hidden font-semibold text-slate-900 print:border-none print:p-0"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                <span className="font-bold text-slate-800 whitespace-nowrap">ชื่อโครงการ:</span>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  placeholder="เช่น โครงการส่งเสริมสุขภาพและป้องกันโรคในชุมชน..."
                  className="flex-1 px-2.5 py-1 bg-white border-b border-dotted border-slate-400 focus:border-emerald-600 focus:outline-hidden font-semibold text-slate-900 print:border-none print:p-0"
                />
              </div>
            </div>

            {/* Activities List (1 - 7 items) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">รายการกิจกรรม:</span>
                <button
                  type="button"
                  onClick={handleAddActivity}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 print:hidden cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> เพิ่มกิจกรรม
                </button>
              </div>

              <div className="space-y-1 pl-2">
                {activities.map((act, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 w-5 shrink-0">
                      {index + 1}.
                    </span>
                    <input
                      type="text"
                      value={act}
                      onChange={e => handleUpdateActivity(index, e.target.value)}
                      placeholder={`กิจกรรมที่ ${index + 1}...`}
                      className="flex-1 px-2 py-0.5 bg-white border-b border-dotted border-slate-300 focus:border-emerald-600 focus:outline-hidden text-xs sm:text-sm print:border-none print:p-0"
                    />
                    {activities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveActivity(index)}
                        className="text-slate-400 hover:text-rose-600 p-1 print:hidden cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Line matching 001.jpg */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/80">
              <div className="flex items-baseline gap-1">
                <span className="font-bold text-slate-800 whitespace-nowrap">งบประมาณทั้งสิ้น:</span>
                <input
                  type="number"
                  value={totalBudget || ''}
                  onChange={e => setTotalBudget(Number(e.target.value))}
                  placeholder="0"
                  className="w-28 px-2 py-0.5 bg-white border-b border-dotted border-slate-400 font-bold text-emerald-700 text-right print:border-none print:p-0"
                />
                <span className="font-bold text-slate-800">บาท</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-bold text-slate-800 whitespace-nowrap">งบประมาณที่ใช้:</span>
                <input
                  type="number"
                  value={spentBudget || ''}
                  onChange={e => setSpentBudget(Number(e.target.value))}
                  placeholder="0"
                  className="w-28 px-2 py-0.5 bg-white border-b border-dotted border-slate-400 font-bold text-slate-800 text-right print:border-none print:p-0"
                />
                <span className="font-bold text-slate-800">บาท</span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-bold text-slate-800 whitespace-nowrap">งบประมาณคงเหลือ/ส่งคืน:</span>
                <span className="font-bold text-teal-700 w-24 text-right">
                  {remainingBudget.toLocaleString()}
                </span>
                <span className="font-bold text-slate-800">บาท</span>
              </div>
            </div>

            {remainingBudget > 0 && (
              <div className="flex items-baseline gap-2 pt-1">
                <span className="font-bold text-slate-700 whitespace-nowrap">รายการส่งคืนกองทุนฯ:</span>
                <input
                  type="text"
                  value={returnItemsDescription}
                  onChange={e => setReturnItemsDescription(e.target.value)}
                  placeholder="ระบุรายละเอียดเงินส่งคืน เช่น เงินคงเหลือโครงการส่งคืนเข้าบัญชีกองทุนฯ..."
                  className="flex-1 px-2 py-0.5 bg-white border-b border-dotted border-slate-400 text-xs text-slate-800 print:border-none"
                />
              </div>
            )}

          </div>

          {/* CHECKLIST ITEMS (Accurately translated from 001.jpg & 002.jpg) */}
          <div className="space-y-4 pt-2">
            
            {/* Section 1: แบบรายงาน กปท.10 */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs print:border-none print:p-0 print:shadow-none">
              <label 
                onClick={() => toggleItem('kpt10_report')}
                className="flex items-start gap-3 cursor-pointer group select-none"
              >
                <div className="mt-0.5 text-emerald-600 group-hover:scale-110 transition shrink-0">
                  {items.kpt10_report ? <CheckSquare className="w-5 h-5 fill-emerald-100" /> : <Square className="w-5 h-5 text-slate-400" />}
                </div>
                <div className="text-xs sm:text-sm">
                  <span className="font-bold text-slate-900 group-hover:text-emerald-700">
                    แบบรายงานผลการดำเนินแผนงาน/โครงการ/กิจกรรม (กปท.10)
                  </span>
                  <p className="text-slate-500 text-xs mt-0.5 pl-0.5">
                    - หัวหน้า/ผู้บริหารสูงสุด ของ หน่วยงาน/องค์กร/กลุ่มประชาชน เป็นผู้รายงาน
                  </p>
                </div>
              </label>
            </div>

            {/* Section 2: รายงานผลการดำเนินโครงการ พร้อมสำเนาเอกสารทางการเงิน */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs print:border-none print:p-0 print:shadow-none space-y-4">
              <div className="font-bold text-slate-900 text-xs sm:text-sm border-b border-slate-100 pb-2">
                รายงานผลการดำเนินโครงการ พร้อมสำเนาเอกสารทางการเงิน
              </div>

              {/* 2.1 กรณีซื้อ/จ้าง ร้านค้า (15 items) */}
              <div className="pl-3 sm:pl-5 space-y-2 border-l-2 border-emerald-300 print:border-l-0 print:pl-4">
                <div className="font-bold text-emerald-900 text-xs sm:text-sm mb-1.5">
                  กรณี ซื้อ/จ้าง ร้านค้า
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 print:grid-cols-1 print:gap-1">
                  
                  <label onClick={() => toggleItem('shop_receipt')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_receipt ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">ใบเสร็จ/บิลเงินสด โดยเจ้าของร้านค้าเป็นผู้รับเงิน</span>
                  </label>

                  <label onClick={() => toggleItem('shop_id_card')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_id_card ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">สำเนาบัตรประชาชนเจ้าของร้านค้า</span>
                  </label>

                  <label onClick={() => toggleItem('shop_inspection_cert')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_inspection_cert ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">ใบตรวจรับ / บันทึกการตรวจรับ</span>
                  </label>

                  <label onClick={() => toggleItem('shop_delivery_note')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_delivery_note ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">ใบส่งของ / ใบแจ้งหนี้ / ใบส่งมอบงาน / ใบส่งมอบพัสดุ แล้วแต่กรณี</span>
                  </label>

                  <label onClick={() => toggleItem('shop_commercial_reg')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_commercial_reg ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">ใบจดทะเบียนพาณิชย์ / เอกสารจดทะเบียนร้านค้า</span>
                  </label>

                  <label onClick={() => toggleItem('shop_po_agreement')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_po_agreement ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">ใบสั่งซื้อสั่งจ้าง / บันทึกข้อตกลงซื้อจ้าง</span>
                  </label>

                  <label onClick={() => toggleItem('shop_winner_announcement')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_winner_announcement ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">ประกาศผู้ชนะการเสนอราคา</span>
                  </label>

                  <label onClick={() => toggleItem('shop_approval_report')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_approval_report ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">รายงานผลการพิจารณาและอนุมัติสั่งซื้อสั่งจ้าง</span>
                  </label>

                  <label onClick={() => toggleItem('shop_price_agreement')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_price_agreement ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">บันทึกการตกลงราคา</span>
                  </label>

                  <label onClick={() => toggleItem('shop_quotation')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_quotation ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">ใบเสนอราคา</span>
                  </label>

                  <label onClick={() => toggleItem('shop_committee_appointment')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_committee_appointment ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">สำเนาคำสั่งแต่งตั้งผู้ตรวจรับ / คณะกรรมการตรวจรับพัสดุ (ถ้ามี)</span>
                  </label>

                  <label onClick={() => toggleItem('shop_egp_report')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_egp_report ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">รายงานขอซื้อขอจ้าง (จากระบบ e-GP)</span>
                  </label>

                  <label onClick={() => toggleItem('shop_tor_note')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_tor_note ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">บันทึกข้อความ ขอความเห็นชอบรายละเอียดคุณลักษณะฯ (TOR)</span>
                  </label>

                  <label onClick={() => toggleItem('shop_tor_draft')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_tor_draft ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">การจัดทำร่างกำหนดคุณลักษณะเฉพาะของพัสดุ</span>
                  </label>

                  <label onClick={() => toggleItem('shop_tor_appointment')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none col-span-1 md:col-span-2">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.shop_tor_appointment ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">คำสั่งแต่งตั้งผู้กำหนดคุณลักษณะ / คณะกรรมการกำหนดคุณลักษณะ (TOR)</span>
                  </label>

                </div>
              </div>

              {/* 2.2 กรณี จ้างประกอบอาหาร อาหารว่าง (มิใช่ซื้อจ้างร้านค้า) */}
              <div className="pl-3 sm:pl-5 space-y-2 border-l-2 border-amber-300 print:border-l-0 print:pl-4">
                <div className="font-bold text-amber-900 text-xs sm:text-sm mb-1.5">
                  กรณี จ้างประกอบอาหาร อาหารว่าง (มิใช่ซื้อจ้างร้านค้า)
                </div>

                <div className="space-y-1.5">
                  <label onClick={() => toggleItem('food_receipt')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.food_receipt ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">ใบเสร็จ / บิลเงินสด / ใบสำคัญรับเงิน</span>
                  </label>

                  <label onClick={() => toggleItem('food_id_card')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.food_id_card ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">สำเนาบัตรประชาชนของผู้ประกอบอาหาร อาหารว่าง</span>
                  </label>

                  <label onClick={() => toggleItem('food_inspection_cert')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.food_inspection_cert ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">ใบตรวจรับ / บันทึกการตรวจรับ</span>
                  </label>
                </div>
              </div>

              {/* 2.3 กรณี ค่าสมนาคุณวิทยากร */}
              <div className="pl-3 sm:pl-5 space-y-2 border-l-2 border-blue-300 print:border-l-0 print:pl-4">
                <div className="font-bold text-blue-900 text-xs sm:text-sm mb-1.5">
                  กรณี ค่าสมนาคุณวิทยากร
                </div>

                <div className="space-y-1.5">
                  <label onClick={() => toggleItem('speaker_receipt')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.speaker_receipt ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">ใบสำคัญรับเงิน</span>
                  </label>

                  <label onClick={() => toggleItem('speaker_id_card')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.speaker_id_card ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">สำเนาบัตรประชาชนของวิทยากร</span>
                  </label>

                  <label onClick={() => toggleItem('speaker_acceptance')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.speaker_acceptance ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">ใบตอบรับการเป็นวิทยากร</span>
                  </label>

                  <label onClick={() => toggleItem('speaker_invitation_letter')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.speaker_invitation_letter ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">หนังสือขอความอนุเคราะห์เป็นวิทยากร****</span>
                  </label>

                  <label onClick={() => toggleItem('speaker_inspection_cert')} className="flex items-start gap-2.5 cursor-pointer text-xs select-none">
                    <span className="text-emerald-600 mt-0.5 shrink-0">
                      {items.speaker_inspection_cert ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="text-slate-800">ใบตรวจรับ / บันทึกการตรวจรับ</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Sections 3, 4, 5, 6 */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs print:border-none print:p-0 print:shadow-none space-y-3">
              
              {/* 3. รูปถ่ายกิจกรรม */}
              <label onClick={() => toggleItem('activity_photos')} className="flex items-start gap-3 cursor-pointer group select-none">
                <span className="mt-0.5 text-emerald-600 group-hover:scale-110 transition shrink-0">
                  {items.activity_photos ? <CheckSquare className="w-5 h-5 fill-emerald-100" /> : <Square className="w-5 h-5 text-slate-400" />}
                </span>
                <span className="font-bold text-slate-900 group-hover:text-emerald-700 text-xs sm:text-sm">
                  รูปถ่ายกิจกรรมตามโครงการและรูปป้ายโครงการ
                </span>
              </label>

              {/* 4. รายชื่อผู้เข้าร่วมโครงการ */}
              <label onClick={() => toggleItem('attendance_with_id')} className="flex items-start gap-3 cursor-pointer group select-none">
                <span className="mt-0.5 text-emerald-600 group-hover:scale-110 transition shrink-0">
                  {items.attendance_with_id ? <CheckSquare className="w-5 h-5 fill-emerald-100" /> : <Square className="w-5 h-5 text-slate-400" />}
                </span>
                <span className="font-bold text-slate-900 group-hover:text-emerald-700 text-xs sm:text-sm">
                  รายชื่อผู้เข้าร่วมโครงการ พร้อมเลขบัตรประชาชนผู้เข้าร่วมโครงการ
                </span>
              </label>

              {/* 5. สำเนาโครงการและกำหนดการ */}
              <label onClick={() => toggleItem('project_copy_schedule')} className="flex items-start gap-3 cursor-pointer group select-none">
                <span className="mt-0.5 text-emerald-600 group-hover:scale-110 transition shrink-0">
                  {items.project_copy_schedule ? <CheckSquare className="w-5 h-5 fill-emerald-100" /> : <Square className="w-5 h-5 text-slate-400" />}
                </span>
                <span className="font-bold text-slate-900 group-hover:text-emerald-700 text-xs sm:text-sm">
                  สำเนาโครงการและกำหนดการ
                </span>
              </label>

              {/* 6. บันทึกข้อความขออนุมัติจัดทำโครงการ */}
              <label onClick={() => toggleItem('approval_memo')} className="flex items-start gap-3 cursor-pointer group select-none">
                <span className="mt-0.5 text-emerald-600 group-hover:scale-110 transition shrink-0">
                  {items.approval_memo ? <CheckSquare className="w-5 h-5 fill-emerald-100" /> : <Square className="w-5 h-5 text-slate-400" />}
                </span>
                <span className="font-bold text-slate-900 group-hover:text-emerald-700 text-xs sm:text-sm">
                  บันทึกข้อความขออนุมัติจัดทำโครงการ
                </span>
              </label>

            </div>

          </div>

          {/* Review Results & Remarks */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 print:bg-transparent print:border-t-2 print:border-slate-800 print:rounded-none print:p-2 space-y-3">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="font-bold text-slate-800 text-xs sm:text-sm">สรุปผลการตรวจสอบเอกสาร:</span>
              <div className="flex items-center gap-4 text-xs sm:text-sm">
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="reviewResult"
                    checked={reviewResult === 'pass'}
                    onChange={() => setReviewResult('pass')}
                    className="text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                  />
                  <span>ครบถ้วนถูกต้อง</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="radio"
                    name="reviewResult"
                    checked={reviewResult === 'amend'}
                    onChange={() => setReviewResult('amend')}
                    className="text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span>มีเอกสารต้องแก้ไข / ส่งเพิ่มเติม</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ข้อสังเกต / เอกสารที่ต้องแนบเพิ่มเติม:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="ระบุข้อสังเกต หรือสิ่งที่ต้องแก้ไขเพิ่มเติม..."
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-emerald-500 print:border-none print:p-0"
              />
            </div>

          </div>

          {/* Official Signature Block matching 001.jpg & 002.jpg */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="hidden sm:block">
              {/* Optional left note / seal placeholder */}
            </div>

            <div className="text-center space-y-2 pl-4 sm:pl-10">
              <p className="text-slate-600">ลงชื่อ .......................................................................... ผู้ตรวจเอกสาร</p>
              <div className="flex justify-center items-center gap-1">
                <span>(</span>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={e => setReviewerName(e.target.value)}
                  className="text-center font-bold border-b border-dotted border-slate-400 focus:outline-hidden w-64 text-slate-900 print:border-none"
                />
                <span>)</span>
              </div>
              <div className="flex justify-center items-center gap-1">
                <span>ตำแหน่ง</span>
                <input
                  type="text"
                  value={reviewerPosition}
                  onChange={e => setReviewerPosition(e.target.value)}
                  className="text-center font-medium border-b border-dotted border-slate-400 focus:outline-hidden w-64 text-slate-700 print:border-none"
                />
              </div>
              <div className="flex justify-center items-center gap-1 text-slate-600 pt-1">
                <span>วันที่ตรวจ:</span>
                <input
                  type="date"
                  value={reviewDate}
                  onChange={e => setReviewDate(e.target.value)}
                  className="px-2 py-0.5 border border-slate-300 rounded-md text-xs font-bold text-slate-800 print:border-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer - Hidden in Print */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 print:hidden">
          <span className="text-xs text-slate-500">
            สถานะ: {reviewResult === 'pass' ? '✅ ครบถ้วนถูกต้อง' : reviewResult === 'amend' ? '⚠️ ต้องแก้ไขเพิ่มเติม' : '🕒 รอดำเนินการ'}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกแบบตรวจเอกสาร</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
