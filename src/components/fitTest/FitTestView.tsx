import React, { useState, useRef } from 'react';
import { 
  TestTube2, 
  ExternalLink, 
  RefreshCw, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  ArrowUpRight,
  ShieldAlert,
  Info,
  Activity,
  Phone,
  Microscope,
  Stethoscope,
  Target,
  AlertCircle,
  FileCheck2,
  Users,
  CheckCircle2,
  HeartPulse
} from 'lucide-react';

export const FIT_TEST_APP_URL = 'https://cacolonpnkhos2027.vercel.app/';

export const FitTestView: React.FC = () => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showInfoBanner, setShowInfoBanner] = useState<boolean>(true);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(FIT_TEST_APP_URL);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleOpenExternal = () => {
    window.open(FIT_TEST_APP_URL, '_blank', 'noopener,noreferrer');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`space-y-4 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900 p-4 overflow-hidden flex flex-col' : ''}`}>
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Title and Status */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-rose-600 via-pink-600 to-amber-600 text-white rounded-2xl shadow-sm shrink-0">
              <TestTube2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  งานคัดกรองมะเร็งลำไส้ใหญ่ (FIT Test) • CA Colon 2027
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  FIT System Online
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  กลุ่มงาน 04: ป้องกันและควบคุมโรคและระบาดวิทยา
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>โรงพยาบาลโพนนาแก้ว</span>
                <span>•</span>
                <span className="font-medium text-slate-700">ระบบบันทึกและติดตามการตรวจคัดกรองมะเร็งลำไส้ใหญ่และไส้ตรง</span>
                <span>•</span>
                <span className="font-mono text-rose-700 bg-rose-50/80 px-2 py-0.5 rounded text-xs border border-rose-200 truncate max-w-[300px]">
                  {FIT_TEST_APP_URL}
                </span>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Copy URL */}
            <button
              onClick={handleCopyUrl}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition border border-slate-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="คัดลอกลิงก์โปรแกรมคัดกรองมะเร็งลำไส้ใหญ่"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>คัดลอกลิงก์</span>
                </>
              )}
            </button>

            {/* Reload Iframe */}
            <button
              onClick={handleRefresh}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition border border-slate-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="โหลดหน้าระบบใหม่"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
              <span>รีเฟรช</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition border border-slate-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
              title={isFullscreen ? 'ย่อหน้าต่างกลับ' : 'ขยายเต็มหน้าจอ'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>ย่อจอ</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>เต็มจอ</span>
                </>
              )}
            </button>

            {/* Primary Open External Tab Button */}
            <button
              onClick={handleOpenExternal}
              className="px-4 py-2 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="เปิดระบบคัดกรอง FIT Test ในแท็บใหม่"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>เปิดระบบในแท็บใหม่</span>
              <ArrowUpRight className="w-3 h-3 text-rose-200" />
            </button>
          </div>
        </div>

        {/* Informational Cards */}
        {!isFullscreen && showInfoBanner && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Screening Standards & Target Group */}
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
                  <Target className="w-4 h-4 text-rose-600" />
                  <span>เกณฑ์มาตรฐานการคัดกรอง FIT Test</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1"></span>
                    <span><strong>กลุ่มเป้าหมาย:</strong> ประชากรอายุ 50 - 70 ปี ทุกสิทธิการรักษา</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1"></span>
                    <span><strong>ความถี่การตรวจ:</strong> ตรวจอุจจาระด้วย FIT Test ทุก 2 ปี</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1"></span>
                    <span><strong>ส่งต่อ Colonoscopy:</strong> ผู้ที่มีผลตรวจเป็นบวก (Positive) ภายใน 30 วัน</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-rose-800">
                <span className="flex items-center gap-1 font-medium">
                  <Microscope className="w-3.5 h-3.5 text-rose-600" />
                  Faecal Immunochemical Test
                </span>
                <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md font-bold">
                  เป้าหมาย รพ.โพนนาแก้ว
                </span>
              </div>
            </div>

            {/* Card 2: Core System Features */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <Activity className="w-4 h-4 text-pink-600" />
                  <span>ฟังก์ชันระบบ CA Colon 2027</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>บันทึกการแจกชุดตรวจ FIT Test รายบุคคล/ชุมชน</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>บันทึกผลแล็บ (Negative ปกติ / Positive ผิดปกติ)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>ระบบส่งต่อและนัดส่องกล้อง Colonoscopy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>รายงานสถิติร้อยละความครอบคลุมและตรวจพบติ่งเนื้อ</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-rose-500" />
                  Cancer Anywhere / NCD Clinic Plus
                </span>
                <span className="font-semibold text-rose-700">ปีงบประมาณ 2569-2570</span>
              </div>
            </div>

            {/* Card 3: Clinic & Responsible Team */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white border border-rose-900/40 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                    <Users className="w-4 h-4 text-rose-400" />
                    <span>ผู้รับผิดชอบงานคัดกรองมะเร็ง</span>
                  </div>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-400/30 px-2 py-0.5 rounded-full font-medium">
                    กลุ่มงาน 04
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  นายเอกพันธ์ ขันติ
                </h4>
                <p className="text-xs text-rose-200 mt-0.5">
                  นักวิชาการสาธารณสุขชำนาญการ • หัวหน้างานป้องกันและควบคุมโรคและระบาดวิทยา
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-rose-200/80">
                  <Phone className="w-3.5 h-3.5 text-rose-400" />
                  <span>081-197-4316</span>
                  <span className="text-rose-400">•</span>
                  <span>คลินิก NCD / ห้องชันสูตร รพ.โพนนาแก้ว</span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-rose-800/60 flex items-center justify-between">
                <span className="text-[11px] text-rose-300 truncate max-w-[150px]">
                  cacolonpnkhos2027
                </span>
                <button
                  onClick={handleOpenExternal}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <span>เข้าสู่ระบบ</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Browser Bar */}
      <div className="flex items-center justify-between gap-2 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/80 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-2 px-2 flex-1 min-w-max">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl shadow-xs border border-slate-200/90 text-xs font-bold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span>ระบบคัดกรองมะเร็งลำไส้ใหญ่ (FIT Test) รพ.โพนนาแก้ว</span>
          </div>
          <span className="text-xs font-mono text-slate-600 bg-white/60 px-3 py-1.5 rounded-xl border border-slate-200/60 hidden sm:inline-block">
            {FIT_TEST_APP_URL}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 px-2">
          <button
            onClick={() => setShowInfoBanner(!showInfoBanner)}
            className="text-xs text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl transition cursor-pointer hidden md:flex items-center gap-1"
            title="ซ่อน/แสดงแผงข้อมูลระบบ"
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>{showInfoBanner ? 'ซ่อนข้อมูลระบบ' : 'แสดงข้อมูลระบบ'}</span>
          </button>

          <button
            onClick={handleOpenExternal}
            className="text-xs font-bold text-rose-800 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>เปิดหน้าต่างใหม่</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Container */}
      <div 
        ref={iframeContainerRef}
        className={`relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex-1 ${
          isFullscreen 
            ? 'h-full flex-1' 
            : 'h-[calc(100vh-280px)] min-h-[640px]'
        }`}
      >
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-2xs flex flex-col items-center justify-center z-10 p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-600 mb-3 animate-bounce">
              <TestTube2 className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-rose-600" />
              <span>กำลังโหลดระบบคัดกรองมะเร็งลำไส้ใหญ่ (FIT Test)...</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm font-mono">
              กำลังเชื่อมต่อไปยัง {FIT_TEST_APP_URL}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleOpenExternal}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดในแท็บใหม่ทันที</span>
              </button>
            </div>
          </div>
        )}

        {/* Embedded Iframe */}
        <iframe
          key={`fit-test-iframe-${iframeKey}`}
          src={FIT_TEST_APP_URL}
          title="งานคัดกรองมะเร็งลำไส้ใหญ่ FIT Test โรงพยาบาลโพนนาแก้ว"
          className="w-full h-full border-0 bg-white"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"
          onLoad={() => setIsLoading(false)}
        />

        {/* Floating Quick Action at Bottom Right */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleOpenExternal}
            className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm transition flex items-center gap-2 border border-slate-700/60 hover:scale-105 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-rose-400" />
            <span>เปิดระบบ FIT Test ในแท็บใหม่</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

    </div>
  );
};
