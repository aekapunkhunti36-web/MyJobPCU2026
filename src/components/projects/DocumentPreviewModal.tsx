import React from 'react';
import { ProjectFile } from '../../types';
import { X, Download, Printer, FileText, FileSpreadsheet, Eye, Calendar, User, Info, CheckCircle } from 'lucide-react';

interface DocumentPreviewModalProps {
  file: ProjectFile | null;
  projectTitle: string;
  projectCode: string;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  file,
  projectTitle,
  projectCode,
  onClose
}) => {
  if (!file) return null;

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

  const handleDownload = () => {
    if (file.fileData) {
      const link = document.createElement('a');
      link.href = file.fileData;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Create text blob simulation if no data url
      const content = `เอกสาร: ${file.fileName}\nโครงการ: ${projectTitle} (${projectCode})\nหมวดหมู่: ${getDocCategoryLabel(file.docCategory)}\nผู้นำเข้า: ${file.uploadedBy}\nวันที่นำเข้า: ${file.uploadedAt}\n\n[เนื้อหาจำลองเอกสารโรงพยาบาลโพนนาแก้ว]`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isPdf = file.fileType === 'pdf' || file.fileName.toLowerCase().endsWith('.pdf');
  const isDoc = file.fileType === 'doc' || file.fileType === 'docx' || file.fileName.toLowerCase().endsWith('.doc') || file.fileName.toLowerCase().endsWith('.docx');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-md ${
              isPdf ? 'bg-red-500' : isDoc ? 'bg-blue-600' : 'bg-emerald-600'
            }`}>
              {isPdf ? 'PDF' : isDoc ? 'DOC' : 'FILE'}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white truncate flex items-center gap-2">
                {file.fileName}
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-normal border border-slate-700">
                  {getDocCategoryLabel(file.docCategory)}
                </span>
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {projectCode} - {projectTitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition text-xs flex items-center gap-1.5 cursor-pointer"
              title="พิมพ์เอกสาร"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">พิมพ์</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition text-xs font-medium flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลด ({file.fileSize})</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer / Document Simulation Canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/70">
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-8 min-h-[500px] flex flex-col justify-between">
            {/* Document Header */}
            <div>
              <div className="flex items-start justify-between border-b border-slate-200 pb-5 mb-6">
                <div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    กลุ่มงานบริการด้านปฐมภูมิและองค์รวม โรงพยาบาลโพนนาแก้ว
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">{file.fileName}</h2>
                  <p className="text-xs text-slate-500 mt-1">รหัสอ้างอิงโครงการ: {projectCode}</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div className="font-semibold text-slate-700">{file.uploadedAt}</div>
                  <div>ผู้นำเข้า: {file.uploadedBy}</div>
                </div>
              </div>

              {/* Document Meta Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-500 block">หมวดหมู่เอกสาร</span>
                  <span className="text-xs font-semibold text-slate-800">{getDocCategoryLabel(file.docCategory)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">ประเภทไฟล์</span>
                  <span className="text-xs font-semibold text-slate-800 uppercase">{file.fileType} ({file.fileSize})</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">สถานะเอกสาร</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> ตรวจสอบผ่านแล้ว
                  </span>
                </div>
              </div>

              {/* Preview Content Area */}
              {file.fileData && file.fileData.startsWith('data:image/') ? (
                <div className="rounded-xl overflow-hidden border border-slate-200 mb-6 bg-slate-900 flex items-center justify-center p-2">
                  <img 
                    src={file.fileData} 
                    alt={file.fileName} 
                    className="max-h-[400px] w-auto object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="space-y-4 text-slate-700 text-sm leading-relaxed border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-50/30 rounded-r-xl">
                  <div className="font-semibold text-slate-900 text-base">
                    สรุปสาระสำคัญของเอกสาร
                  </div>
                  <p className="text-slate-600">
                    เอกสารประกอบโครงการ: <strong className="text-slate-800">{projectTitle}</strong>
                  </p>
                  {file.notes && (
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700">
                      <strong className="text-slate-900 block mb-1">บันทึกเพิ่มเติมจากผู้นำเข้า:</strong>
                      {file.notes}
                    </div>
                  )}

                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2.5 text-xs">
                    <div className="font-medium text-slate-800 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-emerald-600" />
                      คำแนะนำการใช้งานไฟล์:
                    </div>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      <li>ไฟล์ <strong className="text-slate-800">{file.fileName}</strong> ถูกบันทึกและจัดเก็บไว้ในฐานข้อมูลเรียบร้อยแล้ว</li>
                      <li>สามารถกดปุ่ม <strong className="text-emerald-700">"ดาวน์โหลด ({file.fileSize})"</strong> ที่มุมขวาบนเพื่อนำไฟล์ไปเปิดแก้ไขใน Microsoft Word หรือโปรแกรมอ่าน PDF</li>
                      <li>เอกสารนี้ได้รับความเห็นชอบให้ใช้ประกอบการดำเนินงานตามแผนยุทธศาสตร์สุขภาพปฐมภูมิ</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Document Footer Note */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <span>กลุ่มงานบริการด้านปฐมภูมิและองค์รวม โรงพยาบาลโพนนาแก้ว จังหวัดสกลนคร</span>
              <span className="text-[11px] text-slate-400">ระบบบริหารโครงการและเอกสารปฐมภูมิ v1.0</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            ขนาดไฟล์: <span className="font-medium text-slate-700">{file.fileSize}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              ดาวน์โหลดเอกสาร
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
