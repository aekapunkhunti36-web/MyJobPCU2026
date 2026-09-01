import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskAttachment } from '../../types';
import { 
  Paperclip, 
  Search, 
  Upload, 
  Download, 
  Trash2, 
  FileText, 
  FileSpreadsheet, 
  FileCode, 
  Image as ImageIcon, 
  Layers, 
  Calendar, 
  UserCheck, 
  Filter, 
  ExternalLink,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';

export const EvidenceView: React.FC = () => {
  const { tasks, workgroups, addTaskAttachment, deleteTaskAttachment, setSelectedTaskForDetail, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<string>('all');
  const [workgroupFilter, setWorkgroupFilter] = useState<string>('all');
  const [docTypeFilter, setDocTypeFilter] = useState<string>('all');

  // Quick Upload Form
  const [isUploading, setIsUploading] = useState(false);
  const [targetTaskId, setTargetTaskId] = useState(tasks[0]?.id || '');
  const [fileName, setFileName] = useState('');
  const [fileCategory, setFileCategory] = useState<'pdf' | 'word' | 'excel' | 'image'>('pdf');
  const [docType, setDocType] = useState('รายงานผลการดำเนินงาน');

  // Collect all attachments from all tasks
  const allAttachments = useMemo(() => {
    const list: { attachment: TaskAttachment; taskId: string; taskCode: string; taskTitle: string; workgroupId: string }[] = [];
    tasks.forEach(task => {
      task.attachments?.forEach(att => {
        list.push({
          attachment: att,
          taskId: task.id,
          taskCode: task.taskCode,
          taskTitle: task.title,
          workgroupId: task.workgroupId
        });
      });
    });
    return list;
  }, [tasks]);

  const filteredAttachments = useMemo(() => {
    return allAttachments.filter(item => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.attachment.name.toLowerCase().includes(q);
        const matchTask = item.taskTitle.toLowerCase().includes(q);
        const matchCode = item.taskCode.toLowerCase().includes(q);
        const matchUploader = item.attachment.uploadedBy.toLowerCase().includes(q);
        if (!matchName && !matchTask && !matchCode && !matchUploader) return false;
      }

      if (fileTypeFilter !== 'all' && item.attachment.fileType !== fileTypeFilter) {
        return false;
      }

      if (workgroupFilter !== 'all' && item.workgroupId !== workgroupFilter) {
        return false;
      }

      if (docTypeFilter !== 'all' && item.attachment.docType !== docTypeFilter) {
        return false;
      }

      return true;
    });
  }, [allAttachments, searchQuery, fileTypeFilter, workgroupFilter, docTypeFilter]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !targetTaskId) return;

    let ext = '.pdf';
    if (fileCategory === 'word') ext = '.docx';
    if (fileCategory === 'excel') ext = '.xlsx';
    if (fileCategory === 'image') ext = '.jpg';

    const fullFileName = fileName.endsWith(ext) ? fileName : `${fileName}${ext}`;

    addTaskAttachment(targetTaskId, {
      name: fullFileName,
      fileType: fileCategory,
      fileSize: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      docType
    });

    setFileName('');
    setIsUploading(false);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-6 h-6 text-rose-500" />;
      case 'excel': return <FileSpreadsheet className="w-6 h-6 text-emerald-600" />;
      case 'word': return <FileCode className="w-6 h-6 text-blue-600" />;
      case 'image': return <ImageIcon className="w-6 h-6 text-amber-500" />;
      default: return <FileText className="w-6 h-6 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>📎 คลังจัดเก็บเอกสารและหลักฐานการดำเนินงาน (Evidence Vault)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold">
              {allAttachments.length} เอกสาร
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            รวบรวมไฟล์รายงาน ภาพถ่ายกิจกรรม แบบฟอร์ม และคู่มือ 13 กลุ่มงานบริการปฐมภูมิ รพ.โพนนาแก้ว
          </p>
        </div>

        <button
          onClick={() => setIsUploading(!isUploading)}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>+ อัปโหลดหลักฐานเข้าคลัง</span>
        </button>
      </div>

      {/* Upload Dropdown Modal / Form */}
      {isUploading && (
        <form onSubmit={handleUploadSubmit} className="p-5 bg-white rounded-2xl border-2 border-teal-500/50 shadow-md space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-teal-600" />
            <span>อัปโหลดเอกสารหลักฐานใหม่</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">เลือกภารกิจ/งานที่เกี่ยวข้อง *</label>
              <select
                value={targetTaskId}
                onChange={e => setTargetTaskId(e.target.value)}
                required
                className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg font-medium"
              >
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.taskCode}: {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ประเภทไฟล์ *</label>
              <select
                value={fileCategory}
                onChange={e => setFileCategory(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value="pdf">📄 PDF Document</option>
                <option value="word">📝 Microsoft Word (.docx)</option>
                <option value="excel">📊 Microsoft Excel (.xlsx)</option>
                <option value="image">🖼️ ภาพถ่ายกิจกรรม (.jpg, .png)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ประเภทเอกสาร *</label>
              <select
                value={docType}
                onChange={e => setDocType(e.target.value)}
                className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg"
              >
                <option value="รายงานผลการดำเนินงาน">รายงานผลการดำเนินงาน</option>
                <option value="ภาพถ่ายกิจกรรม">ภาพถ่ายกิจกรรม</option>
                <option value="แบบฟอร์มข้อมูล">แบบฟอร์มข้อมูล</option>
                <option value="คู่มือแนวทางปฏิบัติ">คู่มือแนวทางปฏิบัติ</option>
                <option value="ใบรับรอง/ประกาศนียบัตร">ใบรับรอง/ประกาศนียบัตร</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ชื่อเอกสารหลักฐาน *</label>
              <input
                type="text"
                placeholder="เช่น รายงานผลเยี่ยมบ้าน_ประจำเดือน"
                value={fileName}
                onChange={e => setFileName(e.target.value)}
                required
                className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg font-semibold"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsUploading(false)}
              className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg shadow-sm"
            >
              บันทึกเข้าคลังหลักฐาน
            </button>
          </div>
        </form>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อไฟล์ ชื่องาน หรือผู้อัปโหลด..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={fileTypeFilter}
            onChange={e => setFileTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">ทุกนามสกุลไฟล์</option>
            <option value="pdf">📄 PDF Files</option>
            <option value="word">📝 Word (.docx)</option>
            <option value="excel">📊 Excel (.xlsx)</option>
            <option value="image">🖼️ รูปภาพ (.jpg, .png)</option>
          </select>

          <select
            value={docTypeFilter}
            onChange={e => setDocTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">ทุกประเภทเอกสาร</option>
            <option value="รายงานผลการดำเนินงาน">รายงานผลการดำเนินงาน</option>
            <option value="ภาพถ่ายกิจกรรม">ภาพถ่ายกิจกรรม</option>
            <option value="แบบฟอร์มข้อมูล">แบบฟอร์มข้อมูล</option>
            <option value="คู่มือแนวทางปฏิบัติ">คู่มือแนวทางปฏิบัติ</option>
          </select>

          <select
            value={workgroupFilter}
            onChange={e => setWorkgroupFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">ทุกกลุ่มงาน</option>
            {workgroups.map(wg => (
              <option key={wg.id} value={wg.id}>{wg.code}. {wg.shortName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Evidence Document Grid */}
      {filteredAttachments.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">ไม่พบเอกสารหลักฐานที่ค้นหา</h3>
          <p className="text-xs text-slate-500 mt-1">ลองเปลี่ยนคำค้นหา หรือกดปุ่มอัปโหลดเอกสารหลักฐานใหม่</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttachments.map((item, idx) => {
            const wg = workgroups.find(w => w.id === item.workgroupId);
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition p-4 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-teal-50 transition">
                        {getFileIcon(item.attachment.fileType)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                          {item.attachment.docType || 'เอกสารแนบ'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 truncate max-w-[200px] mt-1" title={item.attachment.name}>
                          {item.attachment.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-500 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100 mb-3">
                    <p className="font-semibold text-slate-800 truncate">
                      🔗 งาน: {item.taskTitle}
                    </p>
                    <div className="flex items-center justify-between text-slate-500 pt-1">
                      <span>รหัสงาน: <strong className="font-mono text-teal-800">{item.taskCode}</strong></span>
                      <span>{item.attachment.fileSize}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="text-slate-400 text-[10px]">
                    {item.attachment.uploadedBy} • {item.attachment.uploadedAt}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => alert(`จำลองการดาวน์โหลดไฟล์: ${item.attachment.name}`)}
                      className="p-1.5 bg-teal-50 hover:bg-teal-600 hover:text-white text-teal-700 rounded-lg transition"
                      title="ดาวน์โหลดไฟล์"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        const targetTask = tasks.find(t => t.id === item.taskId);
                        if (targetTask) {
                          setSelectedTaskForDetail(targetTask);
                          setActiveTab('tasks');
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition"
                      title="เปิดดูงานที่เกี่ยวข้อง"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
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
