import React, { useState, useEffect } from 'react';
import { Project, ProjectDocumentChecklist, ProjectChecklistItems } from '../../types';
import { useApp } from '../../context/AppContext';
import { OfficialChecklistA4Document } from './OfficialChecklistA4Document';
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
  Sparkles,
  Eye,
  Edit3,
  CheckCircle
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

  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');
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
  
  // Reviewer fields
  const [reviewerName, setReviewerName] = useState<string>(currentUser?.name || 'นายอดิศร วรราช');
  const [reviewerPosition, setReviewerPosition] = useState<string>(currentUser?.position || 'เจ้าหน้าที่ผู้รับผิดชอบงานโครงการ');
  const [reviewDate, setReviewDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Approver / Director fields - Updated to นายตฤณพงศ์ ธีรพงศ์ธนสุข ผู้อำนวยการโรงพยาบาลโพนนาแก้ว
  const [approverName, setApproverName] = useState<string>('นายตฤณพงศ์  ธีรพงศ์ธนสุข');
  const [approverPosition, setApproverPosition] = useState<string>('ผู้อำนวยการโรงพยาบาลโพนนาแก้ว');
  const [approvalDate, setApprovalDate] = useState<string>(new Date().toISOString().split('T')[0]);

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
        setReviewerName(c.reviewerName || currentUser?.name || 'นายอดิศร วรราช');
        setReviewerPosition(c.reviewerPosition || currentUser?.position || 'เจ้าหน้าที่ผู้รับผิดชอบงานโครงการ');
        setReviewDate(c.reviewDate || new Date().toISOString().split('T')[0]);
        setApproverName(c.approverName || 'นายตฤณพงศ์  ธีรพงศ์ธนสุข');
        setApproverPosition(c.approverPosition || 'ผู้อำนวยการโรงพยาบาลโพนนาแก้ว');
        setApprovalDate(c.approvalDate || new Date().toISOString().split('T')[0]);
      } else {
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
      approverName,
      approverPosition,
      approvalDate,
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

  // High-fidelity A4 printing using isolated iframe to guarantee no modal interference
  const handlePrint = () => {
    const printContent = document.getElementById('printable-a4-document-source');
    if (!printContent) {
      window.print();
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="th">
          <head>
            <meta charset="utf-8" />
            <title>แบบตรวจเอกสารแนบโครงการ - ${projectTitle || 'โรงพยาบาลโพนนาแก้ว'}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap" rel="stylesheet">
            <style>
              @page {
                size: A4 portrait;
                margin: 10mm 12mm 12mm 12mm;
              }
              * {
                box-sizing: border-box;
              }
              body {
                font-family: 'Sarabun', 'TH Sarabun New', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 12.5px;
                line-height: 1.35;
                color: #000;
                margin: 0;
                padding: 0;
                background: #fff;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              h1 {
                font-size: 16px;
                margin: 0 0 3px 0;
                text-align: center;
                font-weight: bold;
              }
              p {
                margin: 0 0 3px 0;
              }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .font-bold { font-weight: bold; }
              table.official-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 6px;
                margin-bottom: 8px;
              }
              table.official-table, table.official-table th, table.official-table td {
                border: 1px solid #000;
              }
              table.official-table th {
                background-color: #f3f4f6;
                padding: 4px 6px;
                font-weight: bold;
                text-align: center;
                font-size: 12px;
              }
              table.official-table td {
                padding: 3px 6px;
                vertical-align: top;
                font-size: 11.5px;
              }
              .page-break-inside-avoid {
                page-break-inside: avoid;
                break-inside: avoid;
              }
              .signature-block {
                page-break-inside: avoid;
                break-inside: avoid;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 1500);
      }, 400);
    } else {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static print:h-auto print:overflow-visible">
      
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in duration-200 print:hidden">
        
        {/* Header */}
        <div className="px-6 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                แบบตรวจเอกสารแนบโครงการ (Checklist A4)
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  มาตรฐานราชการ A4
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                โรงพยาบาลโพนนาแก้ว • ผอ. นายตฤณพงศ์ ธีรพงศ์ธนสุข
              </p>
            </div>
          </div>

          {/* View Mode Switcher & Top Actions */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('form')}
                className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'form' 
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>กรอกข้อมูล</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview' 
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>ตัวอย่างฟอร์ม A4</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="พิมพ์แบบฟอร์มขนาด A4 หรือ บันทึกเป็น PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">พิมพ์ฟอร์ม A4</span>
            </button>

            <button
              onClick={handleSave}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">บันทึก</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Alert Notification */}
        {isSavedAlert && (
          <div className="bg-emerald-500 text-white px-6 py-2 text-xs font-bold flex items-center justify-between shrink-0 animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              บันทึกแบบตรวจเอกสารและอัปเดตข้อมูลโครงการเรียบร้อยแล้ว
            </span>
            <button onClick={() => setIsSavedAlert(false)} className="text-white hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* TAB 1: INTERACTIVE FORM VIEW */}
        {activeTab === 'form' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm">
            
            {/* Top Progress & Quick Actions */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-950 text-sm">ความครบถ้วนของเอกสารแนบ:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                    {checkedCount} / {totalCount} รายการ ({percentComplete}%)
                  </span>
                </div>
                <div className="w-full sm:w-72 bg-emerald-200/80 rounded-full h-2 overflow-hidden mt-1">
                  <div 
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCheckAll(true)}
                  className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>เลือกทั้งหมด</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCheckAll(false)}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                  <span>ล้างทั้งหมด</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>ดูหน้า A4</span>
                </button>
              </div>
            </div>

            {/* General Project Info Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              
              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-600" />
                  เลือกโครงการที่ต้องการตรวจเอกสาร:
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-emerald-500"
                >
                  <option value="">-- เลือกโครงการจากระบบ --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.projectCode}] {p.title}
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
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  หน่วยงานผู้รับผิดชอบ:
                </label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={e => setAgencyName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อโครงการ:
                </label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={e => setProjectTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-emerald-500"
                />
              </div>

              {/* Activities list */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    รายการกิจกรรมในโครงการ:
                  </label>
                  <button
                    type="button"
                    onClick={handleAddActivity}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    เพิ่มกิจกรรม
                  </button>
                </div>
                <div className="space-y-1.5">
                  {activities.map((act, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 w-5">{index + 1}.</span>
                      <input
                        type="text"
                        value={act}
                        onChange={e => handleUpdateActivity(index, e.target.value)}
                        placeholder={`ระบุกิจกรรมที่ ${index + 1}`}
                        className="flex-1 px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-emerald-500"
                      />
                      {activities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveActivity(index)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget fields */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  งบประมาณทั้งสิ้น (บาท):
                </label>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={e => setTotalBudget(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  งบประมาณที่ใช้จริง (บาท):
                </label>
                <input
                  type="number"
                  value={spentBudget}
                  onChange={e => setSpentBudget(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-emerald-700 focus:outline-emerald-500"
                />
              </div>

              <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-lg border border-slate-200 gap-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-700">งบประมาณคงเหลือ / ส่งคืนกองทุนฯ:</span>
                  <span className={`text-xs font-extrabold ${remainingBudget > 0 ? 'text-amber-600' : 'text-slate-700'}`}>
                    {remainingBudget.toLocaleString()} บาท
                  </span>
                </div>

                {remainingBudget > 0 && (
                  <div className="flex-1 sm:max-w-xs">
                    <input
                      type="text"
                      placeholder="รายการส่งคืน เช่น คืนเงินบำรุง/เช็คส่งคืน"
                      value={returnItemsDescription}
                      onChange={e => setReturnItemsDescription(e.target.value)}
                      className="w-full px-2 py-1 border border-slate-300 rounded-md text-xs font-medium focus:outline-emerald-500"
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Checklist Groups */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-800 text-white px-4 py-2.5 font-bold text-xs flex items-center justify-between">
                <span>ตารางตรวจเอกสารแนบโครงการตามระเบียบราชการ</span>
                <span className="text-slate-300 font-normal">คลิกทำเครื่องหมาย [ ✓ ] รายการที่มี</span>
              </div>

              <div className="divide-y divide-slate-100 p-3 space-y-4">
                
                {/* 1. กปท.10 */}
                <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200/80">
                  <label onClick={() => toggleItem('kpt10_report')} className="flex items-start gap-3 cursor-pointer group select-none">
                    <span className="mt-0.5 text-emerald-600 group-hover:scale-110 transition shrink-0">
                      {items.kpt10_report ? <CheckSquare className="w-5 h-5 fill-emerald-100" /> : <Square className="w-5 h-5 text-slate-400" />}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 group-hover:text-emerald-700 text-xs sm:text-sm">
                        1. แบบรายงานผลการดำเนินแผนงาน/โครงการ/กิจกรรม (กปท.10)
                      </span>
                      <p className="text-[11px] text-slate-500">
                        (หัวหน้า/ผู้บริหารสูงสุด ของ หน่วยงาน/องค์กร/กลุ่มประชาชน เป็นผู้รายงาน)
                      </p>
                    </div>
                  </label>
                </div>

                {/* 2. การเงิน */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-900 bg-slate-100 px-3 py-1.5 rounded-md">
                    2. รายงานผลการดำเนินโครงการ พร้อมสำเนาเอกสารทางการเงิน
                  </h4>

                  {/* 2.1 ซื้อ/จ้าง ร้านค้า */}
                  <div className="pl-2 sm:pl-4 space-y-2">
                    <span className="font-bold text-xs text-slate-800">2.1 กรณี ซื้อ/จ้าง ร้านค้า (15 รายการ):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 1, key: 'shop_receipt', title: 'ใบเสร็จ/บิลเงินสด โดยเจ้าของร้านค้าเป็นผู้รับเงิน' },
                        { id: 2, key: 'shop_id_card', title: 'สำเนาบัตรประชาชนเจ้าของร้านค้า' },
                        { id: 3, key: 'shop_inspection_cert', title: 'ใบตรวจรับ / บันทึกการตรวจรับ' },
                        { id: 4, key: 'shop_delivery_note', title: 'ใบส่งของ / ใบแจ้งหนี้ / ใบส่งมอบงาน / ใบส่งมอบพัสดุ แล้วแต่กรณี' },
                        { id: 5, key: 'shop_commercial_reg', title: 'ใบจดทะเบียนพาณิชย์ / เอกสารจดทะเบียนร้านค้า' },
                        { id: 6, key: 'shop_po_agreement', title: 'ใบสั่งซื้อสั่งจ้าง / บันทึกข้อตกลงซื้อจ้าง' },
                        { id: 7, key: 'shop_winner_announcement', title: 'ประกาศผู้ชนะการเสนอราคา' },
                        { id: 8, key: 'shop_approval_report', title: 'รายงานผลการพิจารณาและอนุมัติสั่งซื้อสั่งจ้าง' },
                        { id: 9, key: 'shop_price_agreement', title: 'บันทึกการตกลงราคา' },
                        { id: 10, key: 'shop_quotation', title: 'ใบเสนอราคา' },
                        { id: 11, key: 'shop_committee_appointment', title: 'สำเนาคำสั่งแต่งตั้งผู้ตรวจรับ / คณะกรรมการตรวจรับพัสดุ (ถ้ามี)' },
                        { id: 12, key: 'shop_egp_report', title: 'รายงานขอซื้อขอจ้าง (จากระบบ e-GP)' },
                        { id: 13, key: 'shop_tor_note', title: 'บันทึกข้อความ ขอความเห็นชอบรายละเอียดคุณลักษณะฯ (TOR)' },
                        { id: 14, key: 'shop_tor_draft', title: 'การจัดทำร่างกำหนดคุณลักษณะเฉพาะของพัสดุ' },
                        { id: 15, key: 'shop_tor_appointment', title: 'คำสั่งแต่งตั้งผู้กำหนดคุณลักษณะ / คณะกรรมการกำหนดคุณลักษณะ (TOR)' }
                      ].map(r => {
                        const checked = !!items[r.key as keyof ProjectChecklistItems];
                        return (
                          <label key={r.key} onClick={() => toggleItem(r.key as keyof ProjectChecklistItems)} className="flex items-start gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition select-none">
                            <span className="mt-0.5 text-emerald-600 shrink-0">
                              {checked ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-300" />}
                            </span>
                            <span className={`text-xs ${checked ? 'font-semibold text-emerald-950' : 'text-slate-600'}`}>
                              {r.id}) {r.title}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2.2 จ้างประกอบอาหาร */}
                  <div className="pl-2 sm:pl-4 space-y-2 pt-2 border-t border-slate-100">
                    <span className="font-bold text-xs text-slate-800">2.2 กรณี จ้างประกอบอาหาร อาหารว่าง (มิใช่ซื้อจ้างร้านค้า) (3 รายการ):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { id: 1, key: 'food_receipt', title: 'ใบเสร็จ / บิลเงินสด / ใบสำคัญรับเงิน' },
                        { id: 2, key: 'food_id_card', title: 'สำเนาบัตรประชาชนของผู้ประกอบอาหาร อาหารว่าง' },
                        { id: 3, key: 'food_inspection_cert', title: 'ใบตรวจรับ / บันทึกการตรวจรับ' }
                      ].map(r => {
                        const checked = !!items[r.key as keyof ProjectChecklistItems];
                        return (
                          <label key={r.key} onClick={() => toggleItem(r.key as keyof ProjectChecklistItems)} className="flex items-start gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition select-none">
                            <span className="mt-0.5 text-emerald-600 shrink-0">
                              {checked ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-300" />}
                            </span>
                            <span className={`text-xs ${checked ? 'font-semibold text-emerald-950' : 'text-slate-600'}`}>
                              {r.id}) {r.title}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2.3 สมนาคุณวิทยากร */}
                  <div className="pl-2 sm:pl-4 space-y-2 pt-2 border-t border-slate-100">
                    <span className="font-bold text-xs text-slate-800">2.3 กรณี ค่าสมนาคุณวิทยากร (5 รายการ):</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 1, key: 'speaker_receipt', title: 'ใบสำคัญรับเงิน' },
                        { id: 2, key: 'speaker_id_card', title: 'สำเนาบัตรประชาชนของวิทยากร' },
                        { id: 3, key: 'speaker_acceptance', title: 'ใบตอบรับการเป็นวิทยากร' },
                        { id: 4, key: 'speaker_invitation_letter', title: 'หนังสือขอความอนุเคราะห์เป็นวิทยากร' },
                        { id: 5, key: 'speaker_inspection_cert', title: 'ใบตรวจรับ / บันทึกการตรวจรับ' }
                      ].map(r => {
                        const checked = !!items[r.key as keyof ProjectChecklistItems];
                        return (
                          <label key={r.key} onClick={() => toggleItem(r.key as keyof ProjectChecklistItems)} className="flex items-start gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition select-none">
                            <span className="mt-0.5 text-emerald-600 shrink-0">
                              {checked ? <CheckSquare className="w-4 h-4 fill-emerald-100" /> : <Square className="w-4 h-4 text-slate-300" />}
                            </span>
                            <span className={`text-xs ${checked ? 'font-semibold text-emerald-950' : 'text-slate-600'}`}>
                              {r.id}) {r.title}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* 3. รูปถ่ายกิจกรรม */}
                <div className="pt-2">
                  <label onClick={() => toggleItem('activity_photos')} className="flex items-start gap-3 cursor-pointer group select-none">
                    <span className="mt-0.5 text-emerald-600 group-hover:scale-110 transition shrink-0">
                      {items.activity_photos ? <CheckSquare className="w-5 h-5 fill-emerald-100" /> : <Square className="w-5 h-5 text-slate-400" />}
                    </span>
                    <span className="font-bold text-slate-900 group-hover:text-emerald-700 text-xs sm:text-sm">
                      3. รูปถ่ายกิจกรรมตามโครงการและรูปป้ายโครงการ (อย่างน้อย 4 - 6 ภาพ)
                    </span>
                  </label>
                </div>

                {/* 4. รายชื่อผู้เข้าร่วม */}
                <div>
                  <label onClick={() => toggleItem('attendance_with_id')} className="flex items-start gap-3 cursor-pointer group select-none">
                    <span className="mt-0.5 text-emerald-600 group-hover:scale-110 transition shrink-0">
                      {items.attendance_with_id ? <CheckSquare className="w-5 h-5 fill-emerald-100" /> : <Square className="w-5 h-5 text-slate-400" />}
                    </span>
                    <span className="font-bold text-slate-900 group-hover:text-emerald-700 text-xs sm:text-sm">
                      4. รายชื่อผู้เข้าร่วมโครงการ พร้อมเลขบัตรประชาชนผู้เข้าร่วมโครงการ
                    </span>
                  </label>
                </div>

                {/* 5. สำเนาโครงการ */}
                <div>
                  <label onClick={() => toggleItem('project_copy_schedule')} className="flex items-start gap-3 cursor-pointer group select-none">
                    <span className="mt-0.5 text-emerald-600 group-hover:scale-110 transition shrink-0">
                      {items.project_copy_schedule ? <CheckSquare className="w-5 h-5 fill-emerald-100" /> : <Square className="w-5 h-5 text-slate-400" />}
                    </span>
                    <span className="font-bold text-slate-900 group-hover:text-emerald-700 text-xs sm:text-sm">
                      5. สำเนาโครงการและกำหนดการ
                    </span>
                  </label>
                </div>

                {/* 6. บันทึกข้อความ */}
                <div>
                  <label onClick={() => toggleItem('approval_memo')} className="flex items-start gap-3 cursor-pointer group select-none">
                    <span className="mt-0.5 text-emerald-600 group-hover:scale-110 transition shrink-0">
                      {items.approval_memo ? <CheckSquare className="w-5 h-5 fill-emerald-100" /> : <Square className="w-5 h-5 text-slate-400" />}
                    </span>
                    <span className="font-bold text-slate-900 group-hover:text-emerald-700 text-xs sm:text-sm">
                      6. บันทึกข้อความขออนุมัติจัดทำโครงการ
                    </span>
                  </label>
                </div>

              </div>
            </div>

            {/* Review Results & Remarks */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
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
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:outline-emerald-500"
                />
              </div>
            </div>

            {/* Official Signatures Inputs Block */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-600" />
                  ข้อมูลผู้ตรวจเอกสาร และ ผู้อำนวยการโรงพยาบาลผู้รับรอง (A4 Signatures)
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setApproverName('นายตฤณพงศ์  ธีรพงศ์ธนสุข');
                      setApproverPosition('ผู้อำนวยการโรงพยาบาลโพนนาแก้ว');
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 px-2 py-1 rounded-md transition"
                  >
                    รีเซ็ตชื่อ ผอ. นายตฤณพงศ์
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                
                {/* Left Column: Reviewer */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-700 block border-b border-slate-100 pb-1">
                    ผู้ตรวจเอกสาร (ด้านซ้าย)
                  </span>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">ชื่อ-นามสกุล:</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={e => setReviewerName(e.target.value)}
                      className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 focus:outline-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">ตำแหน่ง:</label>
                    <input
                      type="text"
                      value={reviewerPosition}
                      onChange={e => setReviewerPosition(e.target.value)}
                      className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-medium text-slate-700 focus:outline-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">วันที่ตรวจ:</label>
                    <input
                      type="date"
                      value={reviewDate}
                      onChange={e => setReviewDate(e.target.value)}
                      className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-800 focus:outline-emerald-500"
                    />
                  </div>
                </div>

                {/* Right Column: Approver / Director */}
                <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200 space-y-2">
                  <span className="font-bold text-emerald-950 block border-b border-emerald-200/60 pb-1">
                    ผู้รับรอง / ผู้อำนวยการโรงพยาบาล (ด้านขวา)
                  </span>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">ชื่อ-นามสกุล:</label>
                    <input
                      type="text"
                      value={approverName}
                      onChange={e => setApproverName(e.target.value)}
                      className="w-full px-2.5 py-1 bg-white border border-emerald-300 rounded text-xs font-bold text-emerald-950 focus:outline-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">ตำแหน่ง:</label>
                    <input
                      type="text"
                      value={approverPosition}
                      onChange={e => setApproverPosition(e.target.value)}
                      className="w-full px-2.5 py-1 bg-white border border-emerald-300 rounded text-xs font-semibold text-emerald-900 focus:outline-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-0.5">วันที่รับรอง:</label>
                    <input
                      type="date"
                      value={approvalDate}
                      onChange={e => setApprovalDate(e.target.value)}
                      className="px-2.5 py-1 bg-white border border-emerald-300 rounded text-xs font-bold text-emerald-950 focus:outline-emerald-500"
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: A4 PRINT PREVIEW */}
        {activeTab === 'preview' && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-200/80">
            <div className="max-w-4xl mx-auto space-y-4">
              
              {/* Preview Banner */}
              <div className="bg-white p-3 rounded-xl border border-slate-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">ตัวอย่างเอกสารขนาด A4 เสมือนจริง</span>
                    <p className="text-slate-500 text-[11px]">
                      แบบตรวจเอกสารแนบโครงการราชการ พร้อมลายมือชื่อ นายตฤณพงศ์ ธีรพงศ์ธนสุข ผู้อำนวยการโรงพยาบาลโพนนาแก้ว
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('form')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                  >
                    แก้ไขข้อมูล
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>สั่งพิมพ์ฟอร์ม A4 ทันที</span>
                  </button>
                </div>
              </div>

              {/* Simulated A4 Paper */}
              <div className="bg-white shadow-xl rounded-sm max-w-[210mm] mx-auto p-8 sm:p-12 border border-slate-300">
                <OfficialChecklistA4Document
                  fundName={fundName}
                  agencyName={agencyName}
                  projectTitle={projectTitle}
                  year={year}
                  activities={activities}
                  totalBudget={totalBudget}
                  spentBudget={spentBudget}
                  remainingBudget={remainingBudget}
                  returnItemsDescription={returnItemsDescription}
                  items={items}
                  reviewResult={reviewResult}
                  notes={notes}
                  reviewerName={reviewerName}
                  reviewerPosition={reviewerPosition}
                  reviewDate={reviewDate}
                  approverName={approverName}
                  approverPosition={approverPosition}
                  approvalDate={approvalDate}
                />
              </div>

            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-600 font-medium">
            สถานะ: {reviewResult === 'pass' ? '✅ ครบถ้วนถูกต้อง' : reviewResult === 'amend' ? '⚠️ ต้องแก้ไขเพิ่มเติม' : '🕒 รอดำเนินการ'} • {checkedCount}/{totalCount} รายการ
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์แบบฟอร์ม A4</span>
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกแบบตรวจ</span>
            </button>
          </div>
        </div>

      </div>

      {/* DEDICATED PRINT SOURCE CONTAINER (Fail-safe for direct browser print and iframe print) */}
      <div id="printable-a4-document-source" className="hidden">
        <OfficialChecklistA4Document
          fundName={fundName}
          agencyName={agencyName}
          projectTitle={projectTitle}
          year={year}
          activities={activities}
          totalBudget={totalBudget}
          spentBudget={spentBudget}
          remainingBudget={remainingBudget}
          returnItemsDescription={returnItemsDescription}
          items={items}
          reviewResult={reviewResult}
          notes={notes}
          reviewerName={reviewerName}
          reviewerPosition={reviewerPosition}
          reviewDate={reviewDate}
          approverName={approverName}
          approverPosition={approverPosition}
          approvalDate={approvalDate}
        />
      </div>

      {/* Designated element for index.css @media print */}
      <div id="printable-a4-document" className="hidden print:block">
        <OfficialChecklistA4Document
          fundName={fundName}
          agencyName={agencyName}
          projectTitle={projectTitle}
          year={year}
          activities={activities}
          totalBudget={totalBudget}
          spentBudget={spentBudget}
          remainingBudget={remainingBudget}
          returnItemsDescription={returnItemsDescription}
          items={items}
          reviewResult={reviewResult}
          notes={notes}
          reviewerName={reviewerName}
          reviewerPosition={reviewerPosition}
          reviewDate={reviewDate}
          approverName={approverName}
          approverPosition={approverPosition}
          approvalDate={approvalDate}
        />
      </div>

    </div>
  );
};
