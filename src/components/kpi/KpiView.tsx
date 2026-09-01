import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { KPI, KpiStatus } from '../../types';
import { KpiBadge } from '../common/Badge';
import { 
  Target, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  X, 
  Check, 
  Download 
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const KpiView: React.FC = () => {
  const { kpis, workgroups, addKPI, updateKPI, deleteKPI } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [workgroupFilter, setWorkgroupFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fiscalYearFilter, setFiscalYearFilter] = useState<string>('2569');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<KPI | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [workgroupId, setWorkgroupId] = useState('');
  const [target, setTarget] = useState<number>(100);
  const [actual, setActual] = useState<number>(0);
  const [unit, setUnit] = useState('ร้อยละ');
  const [formula, setFormula] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('');
  const [fiscalYear, setFiscalYear] = useState<number>(2569);

  const filteredKpis = useMemo(() => {
    return kpis.filter(k => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchCode = k.code.toLowerCase().includes(q);
        const matchName = k.name.toLowerCase().includes(q);
        const matchResp = (k.responsiblePerson || '').toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchResp) return false;
      }

      if (workgroupFilter !== 'all' && k.workgroupId !== workgroupFilter) {
        return false;
      }

      if (statusFilter !== 'all' && k.status !== statusFilter) {
        return false;
      }

      if (fiscalYearFilter !== 'all' && k.fiscalYear?.toString() !== fiscalYearFilter) {
        return false;
      }

      return true;
    });
  }, [kpis, searchQuery, workgroupFilter, statusFilter, fiscalYearFilter]);

  // Overall Stats
  const stats = useMemo(() => {
    const total = kpis.length;
    const achieved = kpis.filter(k => k.status === 'achieved').length;
    const nearly = kpis.filter(k => k.status === 'nearly').length;
    const notAchieved = kpis.filter(k => k.status === 'not_achieved').length;
    const avgRate = total > 0 ? Math.round(kpis.reduce((acc, k) => acc + k.achievementRate, 0) / total) : 0;
    return { total, achieved, nearly, notAchieved, avgRate };
  }, [kpis]);

  const handleOpenAdd = () => {
    setEditingKpi(null);
    setCode(`KPI-${kpis.length + 1 < 10 ? '0' : ''}${kpis.length + 1}`);
    setName('');
    setWorkgroupId(workgroups[0]?.id || 'wg-01');
    setTarget(85);
    setActual(75);
    setUnit('ร้อยละ');
    setFormula('(จำนวนผลงาน / จำนวนเป้าหมาย) * 100');
    setResponsiblePerson('พว.สมใจ ใจดี');
    setFiscalYear(2569);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (kpi: KPI) => {
    setEditingKpi(kpi);
    setCode(kpi.code);
    setName(kpi.name);
    setWorkgroupId(kpi.workgroupId);
    setTarget(kpi.target);
    setActual(kpi.actual);
    setUnit(kpi.unit);
    setFormula(kpi.formula || '');
    setResponsiblePerson(kpi.responsiblePerson || 'พว.สมใจ ใจดี');
    setFiscalYear(kpi.fiscalYear || 2569);
    setIsModalOpen(true);
  };

  const handleSaveKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingKpi) {
      updateKPI(editingKpi.id, {
        code,
        name: name.trim(),
        workgroupId,
        target,
        actual,
        unit: unit.trim(),
        formula: formula.trim(),
        responsiblePerson: responsiblePerson.trim(),
        fiscalYear
      });
    } else {
      addKPI({
        code,
        name: name.trim(),
        workgroupId,
        target,
        actual,
        unit: unit.trim(),
        formula: formula.trim(),
        responsiblePerson: responsiblePerson.trim(),
        fiscalYear
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (kpiId: string, kpiName: string) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบตัวชี้วัด "${kpiName}"?`)) {
      deleteKPI(kpiId);
    }
  };

  const handleExportExcel = () => {
    const rows = filteredKpis.map(k => {
      const wg = workgroups.find(w => w.id === k.workgroupId);
      return {
        'รหัส KPI': k.code,
        'ชื่อตัวชี้วัด': k.name,
        'กลุ่มงาน': `${wg?.code} - ${wg?.name}`,
        'เป้าหมาย': k.target,
        'ผลงานจริง': k.actual,
        'หน่วยนับ': k.unit,
        'ร้อยละผลสำเร็จ (%)': k.achievementRate,
        'สถานะการบรรลุ': k.status === 'achieved' ? 'บรรลุเป้าหมาย' : k.status === 'nearly' ? 'ใกล้บรรลุ' : 'ไม่บรรลุ',
        'สูตรคำนวณ': k.formula || '-',
        'ผู้รับผิดชอบ': k.responsiblePerson || '-',
        'ปีงบประมาณ': k.fiscalYear || 2569
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KPI_Report');
    XLSX.writeFile(workbook, `KPI_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>🎯 การกำกับติดตามตัวชี้วัดผลการดำเนินงาน (KPI Master)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {kpis.length} ตัวชี้วัด
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            ติดตามผลสัมฤทธิ์ตัวชี้วัด 13 กลุ่มงานบริการปฐมภูมิ โรงพยาบาลโพนนาแก้ว ปีงบประมาณ 2569
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>ส่งออก Excel</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ เพิ่มตัวชี้วัด KPI</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">ตัวชี้วัดทั้งหมด</span>
          <div className="text-2xl font-black text-slate-800 mt-1">{stats.total}</div>
          <span className="text-[11px] text-slate-400">เฉลี่ยผลสำเร็จรวม {stats.avgRate}%</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-800 block">🟢 บรรลุเป้าหมาย (≥100%)</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">{stats.achieved}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            {stats.total > 0 ? Math.round((stats.achieved / stats.total) * 100) : 0}% ของตัวชี้วัด
          </span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-xs font-bold text-amber-800 block">🟡 ใกล้บรรลุ (80-99%)</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{stats.nearly}</div>
          <span className="text-[11px] text-amber-600 font-semibold">
            {stats.total > 0 ? Math.round((stats.nearly / stats.total) * 100) : 0}% ของตัวชี้วัด
          </span>
        </div>

        <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-200 shadow-xs">
          <span className="text-xs font-bold text-rose-800 block">🔴 ไม่บรรลุ (&lt;80%)</span>
          <div className="text-2xl font-black text-rose-700 mt-1">{stats.notAchieved}</div>
          <span className="text-[11px] text-rose-600 font-semibold">
            {stats.total > 0 ? Math.round((stats.notAchieved / stats.total) * 100) : 0}% ต้องเร่งรัด
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ค้นหารหัส KPI ชื่อตัวชี้วัด หรือชื่อผู้รับผิดชอบ..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">ทุกสถานะผลสำเร็จ</option>
            <option value="achieved">🟢 บรรลุเป้าหมาย (≥100%)</option>
            <option value="nearly">🟡 ใกล้บรรลุ (80-99%)</option>
            <option value="not_achieved">🔴 ไม่บรรลุ (&lt;80%)</option>
          </select>

          <select
            value={workgroupFilter}
            onChange={e => setWorkgroupFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">ทุกกลุ่มงาน (13 กลุ่ม)</option>
            {workgroups.map(wg => (
              <option key={wg.id} value={wg.id}>
                {wg.code}. {wg.shortName}
              </option>
            ))}
          </select>

          <select
            value={fiscalYearFilter}
            onChange={e => setFiscalYearFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="all">ทุกปีงบประมาณ</option>
            <option value="2569">ปีงบฯ 2569</option>
            <option value="2568">ปีงบฯ 2568</option>
          </select>
        </div>
      </div>

      {/* KPI Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-28">รหัส KPI</th>
                <th className="py-3.5 px-4">ชื่อตัวชี้วัด / สูตรคำนวณ</th>
                <th className="py-3.5 px-3">กลุ่มงาน</th>
                <th className="py-3.5 px-3 text-center">เป้าหมาย</th>
                <th className="py-3.5 px-3 text-center">ผลงานจริง</th>
                <th className="py-3.5 px-4 w-40 text-center">อัตราผลสำเร็จ (%)</th>
                <th className="py-3.5 px-3 text-center">สถานะ</th>
                <th className="py-3.5 px-3">ผู้รับผิดชอบ</th>
                <th className="py-3.5 px-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKpis.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 px-4 text-center text-slate-500">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                      <Target className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-slate-700">ไม่พบข้อมูลตัวชี้วัด KPI</p>
                    <p className="text-[11px] text-slate-400 mt-1">คุณสามารถเพิ่มตัวชี้วัดสำหรับปีงบประมาณ 2569 ได้ทันที</p>
                    <button
                      onClick={handleOpenAdd}
                      className="mt-3 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> เพิ่มตัวชี้วัดใหม่
                    </button>
                  </td>
                </tr>
              ) : (
                filteredKpis.map(kpi => {
                const wg = workgroups.find(w => w.id === kpi.workgroupId);

                return (
                  <tr key={kpi.id} className="hover:bg-slate-50/80 transition group">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-800">
                      <span className="bg-teal-50 px-2 py-1 rounded border border-teal-200 block text-center">
                        {kpi.code}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <h4 className="font-bold text-slate-900 leading-snug">{kpi.name}</h4>
                      {kpi.formula && (
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-md">
                          สูตร: {kpi.formula}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700 truncate max-w-[120px]">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: wg?.color }}></span>
                        <span>{wg?.code}. {wg?.shortName}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                      {kpi.target} <span className="text-[10px] font-normal text-slate-400">{kpi.unit}</span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-extrabold text-slate-900">
                      {kpi.actual} <span className="text-[10px] font-normal text-slate-400">{kpi.unit}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-slate-500">ผลสำเร็จ:</span>
                        <span className={`font-black ${
                          kpi.status === 'achieved' ? 'text-emerald-700' :
                          kpi.status === 'nearly' ? 'text-amber-700' : 'text-rose-700'
                        }`}>
                          {kpi.achievementRate}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            kpi.status === 'achieved' ? 'bg-emerald-500' :
                            kpi.status === 'nearly' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, kpi.achievementRate)}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <KpiBadge status={kpi.status} />
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 font-medium">
                      {kpi.responsiblePerson}
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(kpi)}
                          className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition"
                          title="อัปเดตผลงานจริง"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(kpi.id, kpi.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="ลบตัวชี้วัด"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* KPI Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {editingKpi ? 'อัปเดตผลการดำเนินงานตัวชี้วัด (KPI)' : '+ เพิ่มตัวชี้วัดใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveKpi} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">รหัส KPI *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full px-3 py-2 font-mono font-bold bg-white border border-slate-300 rounded-lg text-teal-800"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">กลุ่มงานที่สังกัด *</label>
                  <select
                    value={workgroupId}
                    onChange={e => setWorkgroupId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium"
                  >
                    {workgroups.map(wg => (
                      <option key={wg.id} value={wg.id}>
                        {wg.code}. {wg.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่อตัวชี้วัด *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ร้อยละของผู้ป่วยโรคเบาหวานที่ควบคุมระดับน้ำตาลได้ดี"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ค่าเป้าหมาย *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={target}
                    onChange={e => setTarget(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-bold bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ผลงานจริง (Actual) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={actual}
                    onChange={e => setActual(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm font-bold text-teal-800 bg-white border border-teal-400 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">หน่วยนับ</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">สูตรคำนวณ</label>
                <input
                  type="text"
                  placeholder="เช่น (ผู้ป่วย HbA1c < 7.0 / ผู้ป่วยทั้งหมด) * 100"
                  value={formula}
                  onChange={e => setFormula(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ผู้รับผิดชอบตัวชี้วัด</label>
                  <input
                    type="text"
                    value={responsiblePerson}
                    onChange={e => setResponsiblePerson(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ปีงบประมาณ</label>
                  <input
                    type="number"
                    value={fiscalYear}
                    onChange={e => setFiscalYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg shadow-sm"
                >
                  บันทึกตัวชี้วัด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
