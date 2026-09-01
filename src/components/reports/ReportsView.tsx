import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { HospitalLogo } from '../common/HospitalLogo';
import { FileText, Download, Printer, Filter, Calendar, Layers, Users, Target, AlertCircle, CheckCircle2, Table } from 'lucide-react';
import * as XLSX from 'xlsx';

export const ReportsView: React.FC = () => {
  const { tasks, kpis, workgroups, personnel } = useApp();

  const [reportType, setReportType] = useState<string>('workgroup_summary');
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<string>('2569');
  const [selectedWorkgroup, setSelectedWorkgroup] = useState<string>('all');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');

  // Generate dynamic report data based on reportType
  const reportData = useMemo(() => {
    let title = '';
    let description = '';
    let columns: string[] = [];
    let rows: any[] = [];

    if (reportType === 'workgroup_summary') {
      title = 'รายงานสรุปผลการดำเนินงานแยกตาม 13 กลุ่มงานบริการปฐมภูมิ';
      description = 'แสดงภาพรวมจำนวนภารกิจ งานที่สำเร็จ งานกำลังดำเนินการ งานเกินกำหนด และร้อยละผลสำเร็จ';
      columns = ['รหัสกลุ่มงาน', 'ชื่อกลุ่มงาน', 'หัวหน้ากลุ่มงาน', 'งานทั้งหมด', 'เสร็จสิ้น', 'กำลังดำเนิน', 'เกินกำหนด', 'ร้อยละผลสำเร็จ (%)'];
      
      rows = workgroups.map(wg => {
        const wgTasks = tasks.filter(t => t.workgroupId === wg.id);
        const leader = personnel.find(p => p.id === wg.leaderId);
        const comp = wgTasks.filter(t => t.status === 'completed').length;
        const inProg = wgTasks.filter(t => t.status === 'in_progress' || t.status === 'pending').length;
        const over = wgTasks.filter(t => t.status === 'overdue').length;
        const rate = wgTasks.length > 0 ? Math.round((comp / wgTasks.length) * 100) : 0;

        return {
          c1: wg.code,
          c2: wg.name,
          c3: leader?.name || 'พยาบาลวิชาชีพ',
          c4: wgTasks.length,
          c5: comp,
          c6: inProg,
          c7: over,
          c8: `${rate}%`
        };
      });

    } else if (reportType === 'personnel_workload') {
      title = 'รายงานภาระงานและผลการปฏิบัติงานรายบุคคล';
      description = 'แสดงจำนวนงานที่ได้รับมอบหมาย สถานะความก้าวหน้า และสัดส่วนงานเกินกำหนดของเจ้าหน้าที่';
      columns = ['ชื่อ - สกุล', 'ตำแหน่ง', 'กลุ่มงานหลัก', 'งานที่ได้รับมอบหมาย', 'เสร็จสิ้น', 'กำลังดำเนิน', 'เกินกำหนด', 'อัตราความสำเร็จ (%)'];

      rows = personnel.map(p => {
        const pTasks = tasks.filter(t => t.mainAssigneeId === p.id || t.coAssigneeIds?.includes(p.id));
        const comp = pTasks.filter(t => t.status === 'completed').length;
        const inProg = pTasks.filter(t => t.status === 'in_progress' || t.status === 'pending').length;
        const over = pTasks.filter(t => t.status === 'overdue').length;
        const rate = pTasks.length > 0 ? Math.round((comp / pTasks.length) * 100) : 0;
        const wg = workgroups.find(w => w.id === p.workgroupId);

        return {
          c1: p.name,
          c2: p.position,
          c3: wg?.shortName || '-',
          c4: pTasks.length,
          c5: comp,
          c6: inProg,
          c7: over,
          c8: `${rate}%`
        };
      });

    } else if (reportType === 'kpi_summary') {
      title = 'รายงานผลสัมฤทธิ์ตัวชี้วัดผลการดำเนินงาน (KPI Performance Report)';
      description = 'รายงานค่าเป้าหมาย ผลงานจริง และการบรรลุเป้าหมายตัวชี้วัด 20 รายการ';
      columns = ['รหัส KPI', 'ชื่อตัวชี้วัด', 'กลุ่มงาน', 'เป้าหมาย', 'ผลงานจริง', 'หน่วยนับ', 'ร้อยละผลสำเร็จ (%)', 'สถานะ'];

      rows = kpis.map(k => {
        const wg = workgroups.find(w => w.id === k.workgroupId);
        const statusText = k.status === 'achieved' ? '🟢 บรรลุเป้าหมาย' : k.status === 'nearly' ? '🟡 ใกล้บรรลุ' : '🔴 ไม่บรรลุ';
        return {
          c1: k.code,
          c2: k.name,
          c3: wg?.shortName || '-',
          c4: k.target,
          c5: k.actual,
          c6: k.unit,
          c7: `${k.achievementRate}%`,
          c8: statusText
        };
      });

    } else if (reportType === 'overdue_tasks') {
      title = 'รายงานติดตามงานและภารกิจเกินกำหนดส่ง (Overdue Task Report)';
      description = 'รายการงานที่เลยกำหนดส่งมอบ เพื่อใช้ประกอบการประชุมเร่งรัดและกำกับติดตาม';
      columns = ['รหัสงาน', 'ชื่องาน', 'กลุ่มงาน', 'ผู้รับผิดชอบหลัก', 'กำหนดส่ง', 'ความก้าวหน้า (%)', 'ระดับความสำคัญ'];

      const overTasks = tasks.filter(t => t.status === 'overdue');
      rows = overTasks.map(t => {
        const wg = workgroups.find(w => w.id === t.workgroupId);
        const assignee = personnel.find(p => p.id === t.mainAssigneeId);
        return {
          c1: t.taskCode,
          c2: t.title,
          c3: wg?.shortName || '-',
          c4: assignee?.name || '-',
          c5: t.dueDate,
          c6: `${t.progress}%`,
          c7: t.priority === 'urgent' ? '🔥 เร่งด่วน' : t.priority === 'high' ? 'สูง' : 'ปกติ'
        };
      });

    } else {
      // Monthly / Annual / Tasks Full List
      title = 'รายงานทะเบียนงานและภารกิจทั้งหมด (Full Task Registry Report)';
      description = 'รายการงานทุกกลุ่มงานพร้อมข้อมูลวันที่และสถานะ';
      columns = ['รหัสงาน', 'ชื่องาน', 'กลุ่มงาน', 'ผู้รับผิดชอบ', 'วันเริ่มต้น', 'กำหนดส่ง', 'สถานะ', 'ความก้าวหน้า (%)'];

      rows = tasks.map(t => {
        const wg = workgroups.find(w => w.id === t.workgroupId);
        const assignee = personnel.find(p => p.id === t.mainAssigneeId);
        return {
          c1: t.taskCode,
          c2: t.title,
          c3: wg?.shortName || '-',
          c4: assignee?.name || '-',
          c5: t.startDate,
          c6: t.dueDate,
          c7: t.status,
          c8: `${t.progress}%`
        };
      });
    }

    return { title, description, columns, rows };
  }, [reportType, tasks, kpis, workgroups, personnel]);

  // Export to Excel
  const handleExportExcel = () => {
    const formattedRows = reportData.rows.map(r => {
      const obj: any = {};
      reportData.columns.forEach((col, i) => {
        obj[col] = r[`c${i + 1}`];
      });
      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    XLSX.writeFile(workbook, `PhonNaKaeo_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>📑 ศูนย์จัดทำรายงานและส่งออกข้อมูล (Report Center)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            สร้างรายงานผลการปฏิบัติงาน รายงาน KPI รายงานภาระงานบุคลากร และส่งออกไฟล์ Excel / พิมพ์รายงาน
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก Excel (.xlsx)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงาน / PDF</span>
          </button>
        </div>
      </div>

      {/* Report Template Selector & Filters */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          1. เลือกรูปแบบรายงานที่ต้องการจัดทำ
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setReportType('workgroup_summary')}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              reportType === 'workgroup_summary' ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 text-teal-700 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-xs font-bold">สรุป 13 กลุ่มงาน</span>
            </div>
            <p className="text-[11px] text-slate-500">ผลงานและอัตราความสำเร็จแยกตามสายงาน</p>
          </button>

          <button
            onClick={() => setReportType('personnel_workload')}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              reportType === 'personnel_workload' ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-xs font-bold">ภาระงานรายบุคคล</span>
            </div>
            <p className="text-[11px] text-slate-500">ติดตามปริมาณงานและผลงานของเจ้าหน้าที่</p>
          </button>

          <button
            onClick={() => setReportType('kpi_summary')}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              reportType === 'kpi_summary' ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 text-emerald-700 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-xs font-bold">สรุปตัวชี้วัด KPI</span>
            </div>
            <p className="text-[11px] text-slate-500">เป้าหมาย ผลงานจริง และเกณฑ์ประเมิน</p>
          </button>

          <button
            onClick={() => setReportType('overdue_tasks')}
            className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              reportType === 'overdue_tasks' ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-500/20' : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-2 text-rose-700 mb-1">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-bold">งานเกินกำหนดส่ง</span>
            </div>
            <p className="text-[11px] text-slate-500">รายการงานเร่งรัดและติดตามแก้ไข</p>
          </button>
        </div>

        {/* Secondary Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div>
            <label className="block font-bold text-slate-600 mb-1">ปีงบประมาณ</label>
            <select
              value={selectedFiscalYear}
              onChange={e => setSelectedFiscalYear(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              <option value="2569">ปีงบประมาณ 2569</option>
              <option value="2568">ปีงบประมาณ 2568</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">ช่วงเวลา (ไตรมาส / ประจำเดือน)</label>
            <select
              value={selectedQuarter}
              onChange={e => setSelectedQuarter(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              <option value="all">ทั้งปีงบประมาณ</option>
              <option value="q1">ไตรมาสที่ 1 (ต.ค. - ธ.ค.)</option>
              <option value="q2">ไตรมาสที่ 2 (ม.ค. - มี.ค.)</option>
              <option value="q3">ไตรมาสที่ 3 (เม.ย. - มิ.ย.)</option>
              <option value="q4">ไตรมาสที่ 4 (ก.ค. - ก.ย.)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-600 mb-1">กลุ่มงานเป้าหมาย</label>
            <select
              value={selectedWorkgroup}
              onChange={e => setSelectedWorkgroup(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
            >
              <option value="all">ทุกกลุ่มงาน (13 กลุ่ม)</option>
              {workgroups.map(wg => (
                <option key={wg.id} value={wg.id}>{wg.code}. {wg.shortName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Document Preview Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Document Official Header */}
        <div className="text-center border-b border-slate-200 pb-5">
          <div className="flex justify-center mb-3">
            <HospitalLogo size="lg" className="shadow-xs" />
          </div>
          <span className="text-xs font-bold text-teal-900 uppercase tracking-widest block mb-1">
            โรงพยาบาลโพนนาแก้ว สำนักงานสาธารณสุขจังหวัดสกลนคร
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            {reportData.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            กลุ่มงานบริการด้านปฐมภูมิและองค์รวม • ประจำปีงบประมาณ {selectedFiscalYear}
          </p>
          <span className="text-[11px] text-slate-400 block mt-1">
            ข้อมูล ณ วันที่ {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>

        {/* Preview Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-y border-slate-200 font-bold text-slate-700">
                {reportData.columns.map((col, idx) => (
                  <th key={idx} className="py-3 px-3">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.rows.length === 0 ? (
                <tr>
                  <td colSpan={reportData.columns.length} className="py-8 text-center text-slate-400">
                    ไม่มีข้อมูลสำหรับรายงานนี้
                  </td>
                </tr>
              ) : (
                reportData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/80 transition">
                    {reportData.columns.map((_, cIdx) => (
                      <td key={cIdx} className="py-3 px-3 text-slate-800">
                        {row[`c${cIdx + 1}`]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Report Sign-off section */}
        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100 text-xs text-center">
          <div>
            <p className="text-slate-500 mb-10">ผู้จัดทำรายงาน</p>
            <p className="font-bold text-slate-800">( พว.สมใจ ใจดี )</p>
            <p className="text-slate-500">พยาบาลวิชาชีพชำนาญการ</p>
          </div>
          <div>
            <p className="text-slate-500 mb-10">ผู้รับรองรายงาน</p>
            <p className="font-bold text-slate-800">( นพ.วิศรุต วงศ์พิริยะ )</p>
            <p className="text-slate-500">หัวหน้ากลุ่มงานบริการด้านปฐมภูมิและองค์รวม</p>
          </div>
        </div>

      </div>

    </div>
  );
};
