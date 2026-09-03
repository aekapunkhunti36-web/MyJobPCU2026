import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { HospitalLogo } from '../common/HospitalLogo';
import { StorageService } from '../../services/storageService';
import { 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  LogIn, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  HelpCircle,
  Building2,
  PhoneCall,
  KeyRound,
  Sparkles,
  Users
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, personnel } = useApp();
  
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showQuickSelect, setShowQuickSelect] = useState<boolean>(true);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  // Auto-fill remembered user
  useEffect(() => {
    const remembered = StorageService.getRememberedUser();
    if (remembered) {
      setUsername(remembered);
      setPassword('password123');
    } else {
      // Default to doctor/admin for easy initial preview
      setUsername('wisarut.w');
      setPassword('password123');
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = login(username, password, rememberMe);
      if (result.success) {
        setSuccessMessage('เข้าสู่ระบบสำเร็จ กำลังนำเข้าสู่ระบบ...');
      } else {
        setErrorMessage(result.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        setIsLoading(false);
      }
    }, 400);
  };

  const handleQuickSelect = (userUname: string, userPass: string = 'password123') => {
    setUsername(userUname);
    setPassword(userPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex flex-col justify-between selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Rings & Glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Header Bar */}
      <header className="px-6 py-4 border-b border-slate-700/50 bg-slate-900/60 backdrop-blur-md flex items-center justify-between text-white z-10">
        <div className="flex items-center gap-3">
          <HospitalLogo size="md" />
          <div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              โรงพยาบาลโพนนาแก้ว
              <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                สสจ.สกลนคร
              </span>
            </h1>
            <p className="text-xs text-slate-300">ระบบบริหารงานกลุ่มงานบริการด้านปฐมภูมิและองค์รวม</p>
          </div>
        </div>

        <button
          onClick={() => setShowHelpModal(true)}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">คู่มือการเข้าใช้ / สอบถาม</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-4">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80">
          
          {/* Left Hero Brand Panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                ระบบสารสนเทศสุขภาพมาตรฐานปฐมภูมิ
              </div>

              <div className="flex items-center gap-3 pt-2">
                <HospitalLogo size="xl" className="shadow-lg" />
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">
                    ระบบบริหารผลสัมฤทธิ์
                  </h2>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    กลุ่มงานบริการด้านปฐมภูมิและองค์รวม
                  </p>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 text-xs text-slate-200">
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>กำกับติดตามภารกิจ 13 กลุ่มงานบริการสุขภาพ</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>บันทึกความก้าวหน้าโครงการ ข้อเสนอแผนงาน และเอกสารแนบ</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="p-1 rounded bg-emerald-500/20 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>ตัวชี้วัด KPI สถิติภาระงาน และการประเมินคุณภาพ HA/PCU</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-8 border-t border-emerald-800/60 mt-6 text-[11px] text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <Building2 className="w-3.5 h-3.5" />
                โรงพยาบาลโพนนาแก้ว
              </div>
              <p>199 หมู่ 3 ต.นาแก้ว อ.โพนนาแก้ว จ.สกลนคร 47230</p>
              <p className="text-slate-400">โทร: 042-719100, 042-719101</p>
            </div>
          </div>

          {/* Right Login Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-slate-50/50">
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">เข้าสู่ระบบ (Sign In)</h3>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono font-medium">
                    User & Password
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  กรอกชื่อผู้ใช้งานและรหัสผ่านเพื่อเข้าสู่ระบบงานปฐมภูมิ
                </p>
              </div>

              {/* Error / Success Messages */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-semibold">{errorMessage}</p>
                    <p className="text-[11px] text-red-600 mt-0.5">
                      หากลืมรหัสผ่าน สามารถเลือกบัญชีด่วนด้านล่าง หรือติดต่อผู้ดูแลระบบ
                    </p>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-medium">{successMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Username Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    ชื่อผู้ใช้งาน / อีเมลบุคลากร (Username) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="login-username-input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="เช่น wisarut.w หรือ admin"
                      required
                      className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-sm"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      รหัสผ่าน (Password) <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowHelpModal(true)}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                    >
                      ลืมรหัสผ่าน?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="กรอกรหัสผ่าน (เริ่มต้น: password123)"
                      required
                      className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Note */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-slate-600">จดจำบัญชีผู้ใช้ในอุปกรณ์นี้</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">
                    รหัสเริ่มต้น: <span className="font-semibold text-emerald-700">password123</span>
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="btn-login-submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>เข้าสู่ระบบ (Sign In)</span>
                    </>
                  )}
                </button>
              </form>

              {/* Fast Demo Account Selectors */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    เลือกบัญชีทดสอบด่วน (Quick Demo Login)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowQuickSelect(!showQuickSelect)}
                    className="text-[11px] text-slate-500 hover:text-slate-700 underline"
                  >
                    {showQuickSelect ? 'ซ่อน' : 'แสดง'}
                  </button>
                </div>

                {showQuickSelect && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => handleQuickSelect('trinpong.t', 'password123')}
                      className={`p-2 text-left rounded-lg border text-xs transition flex flex-col ${
                        username === 'trinpong.t' 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-400' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-semibold text-[11px] text-slate-900 truncate">
                        🏥 นายตฤณพงศ์ (ผอ.รพ.)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">User: trinpong.t [Director]</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickSelect('wisarut.w', 'password123')}
                      className={`p-2 text-left rounded-lg border text-xs transition flex flex-col ${
                        username === 'wisarut.w' 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-400' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-semibold text-[11px] text-slate-900 truncate">
                        👨‍⚕️ นพ.วิศรุต (หน.กลุ่มงาน)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">User: wisarut.w [Head]</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickSelect('kanjana.s', 'password123')}
                      className={`p-2 text-left rounded-lg border text-xs transition flex flex-col ${
                        username === 'kanjana.s' 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-400' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-semibold text-[11px] text-slate-900 truncate">
                        👩‍⚕️ พว.กาญจนา (หน.พยาบาล)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">User: kanjana.s [Head]</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickSelect('admin', 'admin123')}
                      className={`p-2 text-left rounded-lg border text-xs transition flex flex-col ${
                        username === 'admin' 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-400' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-semibold text-[11px] text-slate-900 truncate">
                        💻 นายอดิศร (Admin)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">User: admin / Pass: admin123</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickSelect('thanakrit.s', 'password123')}
                      className={`p-2 text-left rounded-lg border text-xs transition flex flex-col ${
                        username === 'thanakrit.s' 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-400' 
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="font-semibold text-[11px] text-slate-900 truncate">
                        👨‍💼 นายธนกฤต (ควบคุมโรค)
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">User: thanakrit.s [Head]</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Notice */}
            <div className="mt-6 pt-3 text-center border-t border-slate-200/60">
              <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ระบบสงวนสิทธิ์เฉพาะเจ้าหน้าที่โรงพยาบาลโพนนาแก้วเท่านั้น
              </p>
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Sub-footer */}
      <footer className="px-6 py-3 text-center text-xs text-slate-400 bg-slate-900/40 backdrop-blur-sm border-t border-slate-800/40 z-10">
        <p>© 2569 กลุ่มงานบริการด้านปฐมภูมิและองค์รวม โรงพยาบาลโพนนาแก้ว จ.สกลนคร • เวอร์ชัน 2.4.0</p>
      </footer>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <KeyRound className="w-5 h-5 text-emerald-600" />
                คำแนะนำการเข้าสู่ระบบ & ข้อมูลบัญชี
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 space-y-1">
                <p className="font-semibold text-emerald-900">รูปแบบการตั้งชื่อผู้ใช้และรหัสผ่านเริ่มต้น:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-emerald-800">
                  <li><strong>ชื่อผู้ใช้ (Username):</strong> นามสกุลย่อ เช่น <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">wisarut.w</code> หรือ <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">admin</code></li>
                  <li><strong>รหัสผ่านเริ่มต้น (Default Password):</strong> <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">password123</code> หรือ <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">123456</code></li>
                  <li><strong>ผู้ดูแลระบบ (Admin):</strong> Username: <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">admin</code> / Password: <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">admin123</code></li>
                </ul>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-900">หากลืมรหัสผ่านหรือต้องการรีเซ็ตรหัสผ่าน:</p>
                <p className="text-slate-600">
                  กรุณาติดต่อ งานสารสนเทศและข้อมูลคุณภาพ (กลุ่มงานบริการด้านปฐมภูมิ) โรงพยาบาลโพนนาแก้ว หรือแจ้งผู้ดูแลระบบเพื่อรีเซ็ตรหัสผ่านใหม่
                </p>
                <div className="flex items-center gap-2 text-slate-600 pt-1 font-medium">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>โทรภายใน: 113 หรือ 042-719100</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
              >
                เข้าใจแล้ว / ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
