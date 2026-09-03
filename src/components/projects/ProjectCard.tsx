import React from 'react';
import { Project, ProjectFile } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Building, 
  User, 
  Calendar, 
  Paperclip, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Wallet, 
  FileText,
  Eye,
  Download,
  ArrowRight,
  MoreVertical,
  FileCheck2
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onEdit: (project: Project) => void;
  onPreviewDoc: (file: ProjectFile, project: Project) => void;
  onOpenChecklist?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onEdit,
  onPreviewDoc,
  onOpenChecklist
}) => {
  const { workgroups, personnel } = useApp();

  const currentWorkgroup = workgroups.find(w => w.id === project.workgroupId);
  const leader = personnel.find(p => p.id === project.leaderId);

  // Helper labels
  const getProjectTypeBadge = (type: string) => {
    switch (type) {
      case 'hospital_fund': return { label: 'เงินบำรุง รพ.', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'local_fund': return { label: 'กองทุน กปท.', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'nhso_pp': return { label: 'สปสช. PP Express', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'strategic': return { label: 'ยุทธศาสตร์ สสจ.', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'primary_care': return { label: 'บริการปฐมภูมิ', bg: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'quality_improvement': return { label: 'พัฒนาคุณภาพ HA/PCA', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      default: return { label: 'โครงการอื่นๆ', bg: 'bg-slate-50 text-slate-700 border-slate-200' };
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

  const typeInfo = getProjectTypeBadge(project.type);
  const statusInfo = getStatusBadge(project.status);

  const budgetSpentPercent = project.budgetApproved > 0 
    ? Math.min(100, Math.round((project.budgetSpent / project.budgetApproved) * 100)) 
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition duration-200 flex flex-col justify-between overflow-hidden group">
      
      {/* Top Card Section */}
      <div className="p-5 space-y-3.5">
        
        {/* Header Tags */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              {project.projectCode}
            </span>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${typeInfo.bg}`}>
              {typeInfo.label}
            </span>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${statusInfo.bg}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Project Title */}
        <div 
          onClick={() => onSelect(project)}
          className="cursor-pointer"
        >
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-2 leading-snug">
            {project.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            {project.fundingSource}
          </p>
        </div>

        {/* Workgroup & Responsible Person */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 min-w-0">
            <Building className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{currentWorkgroup?.shortName || currentWorkgroup?.name || 'กลุ่มงานปฐมภูมิ'}</span>
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{leader?.name || 'ไม่ระบุ'}</span>
          </div>
        </div>

        {/* Budget & Progress Box */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-slate-400" />
              งบอนุมัติ: <strong className="text-slate-800">฿{project.budgetApproved.toLocaleString()}</strong>
            </span>
            <span className="text-emerald-700 font-semibold text-[11px]">
              เบิกจ่าย {budgetSpentPercent}%
            </span>
          </div>
          
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500">
            <span>เบิกจ่ายแล้ว ฿{project.budgetSpent.toLocaleString()}</span>
            <span>ก้าวหน้า {project.progress}%</span>
          </div>
        </div>

        {/* Document Attachments Chips (.doc / .pdf) */}
        {project.files && project.files.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <Paperclip className="w-3 h-3 text-slate-400" />
              เอกสารแนบ ({project.files.length} ไฟล์):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.files.slice(0, 3).map(file => {
                const isPdf = file.fileType === 'pdf' || file.fileName.toLowerCase().endsWith('.pdf');
                const isDoc = file.fileType === 'doc' || file.fileType === 'docx' || file.fileName.toLowerCase().endsWith('.doc') || file.fileName.toLowerCase().endsWith('.docx');

                return (
                  <button
                    key={file.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewDoc(file, project);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-slate-200 text-[10px] font-medium text-slate-700 transition cursor-pointer max-w-[200px]"
                    title={`${file.fileName} (${file.fileSize})`}
                  >
                    <span className={`px-1 py-0.2 rounded font-bold text-[9px] text-white ${
                      isPdf ? 'bg-red-500' : isDoc ? 'bg-blue-600' : 'bg-emerald-600'
                    }`}>
                      {isPdf ? 'PDF' : isDoc ? 'DOC' : 'FILE'}
                    </span>
                    <span className="truncate">{file.fileName}</span>
                  </button>
                );
              })}
              {project.files.length > 3 && (
                <span className="text-[10px] text-slate-400 self-center">
                  +{project.files.length - 3} ไฟล์
                </span>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Footer Card Actions */}
      <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{project.startDate} ถึง {project.endDate}</span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenChecklist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenChecklist(project);
              }}
              className="text-slate-500 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-emerald-50 transition cursor-pointer flex items-center gap-1 text-[11px] font-semibold"
              title="แบบตรวจเอกสารแนบโครงการ"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">ตรวจเอกสาร</span>
            </button>
          )}

          <button
            onClick={() => onSelect(project)}
            className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition cursor-pointer"
          >
            ดูรายละเอียด
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
