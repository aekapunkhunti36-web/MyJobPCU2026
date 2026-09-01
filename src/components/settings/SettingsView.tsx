import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StorageService } from '../../services/storageService';
import { HospitalLogo } from '../common/HospitalLogo';
import { 
  Settings, 
  Database, 
  ShieldCheck, 
  Download, 
  Upload, 
  RefreshCw, 
  Building2, 
  Check, 
  Flame, 
  Server,
  Layers,
  Key,
  Users,
  Code,
  Lock,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    currentUser, 
    resetToDefaults, 
    exportDataJSON, 
    importDataJSON, 
    changePassword, 
    personnel,
    isFirebaseConnected,
    firebaseProjectId,
    syncStatus,
    syncWithFirebase,
    projects,
    tasks,
    kpis,
    workgroups
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      await syncWithFirebase();
      setSyncFeedback('ซิงค์ข้อมูลกับ Firebase Cloud สำเร็จเรียบร้อย');
      setTimeout(() => setSyncFeedback(null), 3500);
    } catch (e) {
      setSyncFeedback('เกิดข้อผิดพลาดในการซิงค์ข้อมูล');
    } finally {
      setIsSyncing(false);
    }
  };

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (!oldPassword) {
      setPassMessage({ type: 'error', text: 'กรุณาระบุรหัสผ่านปัจจุบัน' });
      return;
    }
    if (newPassword.length < 4) {
      setPassMessage({ type: 'error', text: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMessage({ type: 'error', text: 'รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน' });
      return;
    }

    const res = changePassword(currentUser.id, oldPassword, newPassword);
    if (res.success) {
      setPassMessage({ type: 'success', text: res.message });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassMessage(null), 4000);
    } else {
      setPassMessage({ type: 'error', text: res.message });
    }
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PhonNaKaeo_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importDataJSON(importJsonText.trim());
    if (ok) {
      setImportStatus('success');
      setImportJsonText('');
      setTimeout(() => setImportStatus(null), 3000);
    } else {
      setImportStatus('error');
    }
  };

  const handleReset = () => {
    if (window.confirm('คำเตือน: คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นของโรงพยาบาลโพนนาแก้ว ใช่หรือไม่? ข้อมูลที่แก้ไขจะถูกแทนที่ด้วยข้อมูลตั้งต้น 13 กลุ่มงาน')) {
      resetToDefaults();
      alert('รีเซ็ตข้อมูลกลับสู่ค่ามาตรฐานเรียบร้อยแล้ว');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span>⚙️ ตั้งค่าระบบและการเชื่อมต่อฐานข้อมูล (Settings & Database)</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          กำหนดค่าปีงบประมาณ สำรองข้อมูล และเชื่อมต่อ Google Firebase Firestore
        </p>
      </div>

      {/* Hospital System Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center gap-4 mb-4">
          <HospitalLogo size="xl" className="shrink-0 shadow-xs" />
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              กระทรวงสาธารณสุข
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              ข้อมูลหน่วยงานและระบบสารสนเทศ
            </h2>
            <p className="text-xs text-slate-500">โรงพยาบาลโพนนาแก้ว สำนักงานสาธารณสุขจังหวัดสกลนคร</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-1">ชื่อหน่วยงาน:</span>
            <strong className="text-slate-800 font-bold">โรงพยาบาลโพนนาแก้ว (สสจ.สกลนคร)</strong>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-1">กลุ่มงานที่รับผิดชอบ:</span>
            <strong className="text-teal-800 font-bold">กลุ่มงานบริการด้านปฐมภูมิและองค์รวม</strong>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block mb-1">ปีงบประมาณปัจจุบัน:</span>
            <strong className="text-emerald-700 font-bold">ปีงบประมาณ 2569 (ต.ค. 68 - ก.ย. 69)</strong>
          </div>
        </div>
      </div>

      {/* User Account Security & Change Password Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              ความปลอดภัยบัญชีผู้ใช้และการเปลี่ยนรหัสผ่าน (Account & Password)
            </h2>
            <p className="text-xs text-slate-500">
              จัดการรหัสผ่านและตรวจสอบข้อมูลบัญชีผู้ใช้งานที่กำลังเข้าสู่ระบบ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Current User Info */}
          <div className="lg:col-span-5 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">ข้อมูลบัญชีปัจจุบัน</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                Active Session
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">ชื่อ-สกุล:</span>
                <span className="font-bold text-slate-800">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">ชื่อผู้ใช้งาน (Username):</span>
                <span className="font-mono font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                  @{currentUser.username || currentUser.id}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">ตำแหน่ง / บทบาท:</span>
                <span className="text-slate-700">{currentUser.position}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">อีเมลราชการ:</span>
                <span className="font-mono text-slate-600">{currentUser.email}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
              💡 เข้าใช้งานครั้งล่าสุด: {currentUser.lastLoginAt ? new Date(currentUser.lastLoginAt).toLocaleString('th-TH') : 'เข้าใช้งานในรอบปัจจุบัน'}
            </div>
          </div>

          {/* Change Password Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleChangePassword} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">เปลี่ยนรหัสผ่านใหม่ (Change Password)</span>
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1"
                >
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPass ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}</span>
                </button>
              </div>

              {passMessage && (
                <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                  passMessage.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {passMessage.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{passMessage.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    รหัสผ่านปัจจุบัน <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    placeholder="รหัสผ่านปัจจุบัน"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    รหัสผ่านใหม่ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="อย่างน้อย 4 ตัวอักษร"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    ยืนยันรหัสผ่านใหม่ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="กรอกซ้ำอีกครั้ง"
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  รหัสผ่านเริ่มต้นของระบบคือ <code className="font-mono font-bold text-slate-700">password123</code>
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>บันทึกรหัสผ่านใหม่</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Role & Permission Matrix Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-700">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              โครงสร้างระดับสิทธิ์การเข้าใช้งานระบบ (Role & Permissions Matrix)
            </h2>
            <p className="text-xs text-slate-500">สิทธิ์ของบทบาทต่างๆ สามารถสลับทดสอบได้ที่แถบมุมขวาบน</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-200">
            <span className="font-bold text-purple-900 block mb-1">1. ผู้ดูแลระบบ (Admin)</span>
            <p className="text-[11px] text-purple-800/80 leading-relaxed">
              สิทธิ์สูงสุด: มอบหมายงาน, แก้ไข/ลบงานและบุคลากร, จัดการ KPI, สำรองข้อมูล, เชื่อมต่อ Firebase
            </p>
          </div>

          <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200">
            <span className="font-bold text-teal-900 block mb-1">2. หัวหน้ากลุ่มงาน (Head)</span>
            <p className="text-[11px] text-teal-800/80 leading-relaxed">
              กำกับดูแลงานในกลุ่มงาน: มอบหมายงาน, อัปเดตความก้าวหน้า, ตรวจสอบหลักฐาน, รายงานผล KPI
            </p>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200">
            <span className="font-bold text-blue-900 block mb-1">3. เจ้าหน้าที่ (Officer)</span>
            <p className="text-[11px] text-blue-800/80 leading-relaxed">
              ผู้ปฏิบัติงาน: รายงานความก้าวหน้า (0-100%), เพิ่มข้อคิดเห็น, แนบไฟล์เอกสารหลักฐานงาน
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">4. ผู้เข้าชม (Viewer)</span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              ผู้บริหาร/ผู้ตรวจราชการ: ดูแผง Dashboard, ค้นหาข้อมูล, ส่งออกรายงาน Excel และพิมพ์รายงาน
            </p>
          </div>
        </div>
      </div>

      {/* Firebase Firestore Connection Bridge */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900">
                  ฐานข้อมูลคลาวด์ Google Firebase Firestore
                </h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${
                  isFirebaseConnected 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isFirebaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  {isFirebaseConnected ? 'เชื่อมต่อคลาวด์เรียลไทม์สำเร็จ' : 'พร้อมเชื่อมต่อ'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                ซิงค์ข้อมูลโครงการ ภารกิจ KPI ทำเนียบบุคลากร และปฏิทินงาน 13 กลุ่มงานแบบ Realtime
              </p>
            </div>
          </div>

          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'กำลังซิงค์กับ Firestore...' : 'ซิงค์ข้อมูลกับคลาวด์ทันที'}</span>
          </button>
        </div>

        {syncFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncFeedback}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-[11px] block">Firebase Project ID:</span>
            <span className="font-mono font-bold text-slate-800 text-xs">{firebaseProjectId}</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-[11px] block">สถานะการซิงค์ (Sync State):</span>
            <span className="font-semibold text-emerald-700 capitalize flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              {syncStatus === 'synced' ? 'Realtime Synchronized' : syncStatus === 'syncing' ? 'Syncing...' : 'Local Cache Ready'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 text-[11px] block">ข้อมูลในระบบปัจจุบัน:</span>
            <span className="font-bold text-slate-700">
              {projects.length} โครงการ / {tasks.length} ภารกิจ / {kpis.length} KPIs
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-600 space-y-1.5">
          <div className="text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
            <span>Collections ที่เชื่อมต่อใน Firestore Cloud Database:</span>
            <span className="text-emerald-700 font-sans font-semibold text-[11px]">7 Collections Active</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
            <div>• <code className="text-teal-700 font-bold">/projects</code> : เอกสารโครงการและงบประมาณ 2568-2569</div>
            <div>• <code className="text-teal-700 font-bold">/tasks</code> : ทะเบียนงาน 13 กลุ่มงาน + subtasks + timeline</div>
            <div>• <code className="text-teal-700 font-bold">/kpis</code> : ตัวชี้วัดผลงาน 20 รายการ</div>
            <div>• <code className="text-teal-700 font-bold">/personnel</code> : ทำเนียบบุคลากรและบัญชีผู้ใช้</div>
            <div>• <code className="text-teal-700 font-bold">/workgroups</code> : โครงสร้าง 13 กลุ่มงานมาตรฐาน</div>
            <div>• <code className="text-teal-700 font-bold">/calendar_events</code> : ปฏิทินและกำหนดส่งงาน</div>
            <div>• <code className="text-teal-700 font-bold">/notifications</code> : ประวัติการแจ้งเตือนงาน</div>
          </div>
        </div>
      </div>

      {/* Data Backup & Restore */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-50 text-blue-700">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              การสำรองและกู้คืนข้อมูล (Backup & Restore)
            </h2>
            <p className="text-xs text-slate-500">ส่งออกข้อมูลทั้งหมดเป็น JSON หรือกู้คืนข้อมูล</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Export JSON */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-teal-600" />
                <span>สำรองข้อมูลระบบทั้งหมด (JSON Backup)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                ดาวน์โหลดไฟล์ข้อมูล 13 กลุ่มงาน, งานทั้งหมด, KPI, บุคลากร และกิจกรรมปฏิทิน
              </p>
            </div>
            <button
              onClick={handleExport}
              className="mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดไฟล์ JSON สำรองข้อมูล</span>
            </button>
          </div>

          {/* Reset System */}
          <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-rose-600" />
                <span>รีเซ็ตระบบกลับสู่ค่าเริ่มต้น (Factory Reset)</span>
              </h3>
              <p className="text-[11px] text-rose-800/80">
                โหลดข้อมูลชุดมาตรฐาน 13 กลุ่มงาน 20 KPI และ 30 ภารกิจตั้งต้นของ รพ.โพนนาแก้ว ใหม่ทั้งหมด
              </p>
            </div>
            <button
              onClick={handleReset}
              className="mt-4 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>รีเซ็ตข้อมูลเริ่มต้น</span>
            </button>
          </div>
        </div>

        {/* Import JSON */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 pt-4">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Upload className="w-4 h-4 text-blue-600" />
            <span>กู้คืนข้อมูลจากโค้ด JSON (Restore JSON)</span>
          </h3>
          <textarea
            rows={3}
            placeholder="วางข้อความ JSON ที่สำรองไว้ที่นี่ เพื่อกู้คืนข้อมูล..."
            value={importJsonText}
            onChange={e => setImportJsonText(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono focus:outline-hidden"
          />

          <div className="flex items-center justify-between">
            {importStatus === 'success' && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> กู้คืนข้อมูลสำเร็จเรียบร้อย!
              </span>
            )}
            {importStatus === 'error' && (
              <span className="text-xs font-bold text-rose-600">
                รูปแบบ JSON ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง
              </span>
            )}
            {!importStatus && <span></span>}

            <button
              onClick={handleImport}
              disabled={!importJsonText.trim()}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg transition"
            >
              นำเข้าข้อมูล
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
