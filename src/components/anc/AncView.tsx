import React, { useState, useRef } from 'react';
import { 
  Baby, 
  ExternalLink, 
  RefreshCw, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  ArrowUpRight,
  ShieldCheck,
  Heart,
  Sparkles,
  Info,
  Calendar,
  Users,
  Activity,
  Phone,
  FileCheck2,
  Stethoscope,
  Clock,
  AlertCircle
} from 'lucide-react';

export const ANC_APP_URL = 'https://anc-pnk-hospital-v-1.vercel.app/';

export const AncView: React.FC = () => {
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
    navigator.clipboard.writeText(ANC_APP_URL);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleOpenExternal = () => {
    window.open(ANC_APP_URL, '_blank', 'noopener,noreferrer');
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
            <div className="p-3 bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 text-white rounded-2xl shadow-sm shrink-0">
              <Baby className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  งาน ANC (Antenatal Care System) • คลินิกฝากครรภ์
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-50 text-pink-700 border border-pink-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-ping"></span>
                  ANC V.1 Online
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  กลุ่มงาน 03: ส่งเสริมสุขภาพทุกกลุ่มวัย
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>โรงพยาบาลโพนนาแก้ว</span>
                <span>•</span>
                <span className="font-medium text-slate-700">ระบบบันทึกและติดตามหญิงตั้งครรภ์ / อนามัยแม่และเด็ก</span>
                <span>•</span>
                <span className="font-mono text-pink-700 bg-pink-50/80 px-2 py-0.5 rounded text-xs border border-pink-100 truncate max-w-[280px]">
                  {ANC_APP_URL}
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
              title="คัดลอกลิงก์โปรแกรม ANC"
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
              title="โหลดหน้าโปรแกรมใหม่"
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

            {/* Open Active in New Tab */}
            <button
              onClick={handleOpenExternal}
              className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="เปิดระบบงาน ANC ในแท็บใหม่"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>เปิดระบบ ANC ในแท็บใหม่</span>
              <ArrowUpRight className="w-3 h-3 text-pink-200" />
            </button>
          </div>
        </div>

        {/* Informational ANC Cards */}
        {!isFullscreen && showInfoBanner && (
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Clinic & Responsible Person */}
            <div className="p-4 rounded-xl bg-pink-50/50 border border-pink-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-pink-800 uppercase tracking-wider mb-2">
                  <Stethoscope className="w-4 h-4 text-pink-600" />
                  <span>คลินิกฝากครรภ์ (ANC Clinic)</span>
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  พว.นงลักษณ์ มงคลกุล
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  พยาบาลวิชาชีพชำนาญการ • หัวหน้างานส่งเสริมสุขภาพทุกกลุ่มวัย
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>084-345-6789</span>
                  <span className="text-slate-300">•</span>
                  <span>รพ.โพนนาแก้ว</span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-pink-100/80 flex items-center justify-between text-[11px] text-pink-700">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-pink-500" />
                  ให้บริการทุกวันพฤหัสบดี
                </span>
                <span className="bg-pink-100 text-pink-800 px-2 py-0.5 rounded-md font-bold">
                  08.30 - 12.00 น.
                </span>
              </div>
            </div>

            {/* Card 2: Core ANC Goals & Standards */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>เกณฑ์คุณภาพ ANC 5 ครั้ง มาตรฐาน</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>ฝากครรภ์ครั้งแรก ≤ 12 สัปดาห์ (Early ANC)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>ครบ 5 ครั้งตามนัด (12, 18, 26, 32, 36 สัปดาห์)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>ตรวจคัดกรอง Lab ANC 1 & 2 ครบถ้วน</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>ตรวจทันตกรรมและประเมินภาวะเสี่ยงสูง (High Risk)</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  เป้าหมาย: แม่ปลอดภัย ลูกแข็งแรง
                </span>
                <span className="font-semibold text-emerald-700">W.H.O. Standard</span>
              </div>
            </div>

            {/* Card 3: System Features & Direct Action */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>ระบบ ANC V.1 Cloud Portal</span>
                  </div>
                  <span className="text-[10px] font-mono bg-pink-500/20 text-pink-300 border border-pink-400/30 px-2 py-0.5 rounded-full">
                    Vercel Hosted
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  เว็บแอปพลิเคชันสำหรับบุคลากรสาธารณสุข บันทึก ค้นหา ติดตามหญิงตั้งครรภ์ และจัดการข้อมูลการฝากครรภ์แบบเรียลไทม์
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    E-ANC
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    High Risk Alert
                  </span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    PCU Network
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-700 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono truncate max-w-[150px]">
                  anc-pnk-hospital-v-1
                </span>
                <button
                  onClick={handleOpenExternal}
                  className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer active:scale-95"
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
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            <span>ระบบงาน ANC รพ.โพนนาแก้ว (V.1)</span>
          </div>
          <span className="text-xs font-mono text-slate-600 bg-white/60 px-3 py-1.5 rounded-xl border border-slate-200/60 hidden sm:inline-block">
            {ANC_APP_URL}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 px-2">
          <button
            onClick={() => setShowInfoBanner(!showInfoBanner)}
            className="text-xs text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl transition cursor-pointer hidden md:flex items-center gap-1"
            title="ซ่อน/แสดงแผงข้อมูลคลินิก"
          >
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span>{showInfoBanner ? 'ซ่อนข้อมูลคลินิก' : 'แสดงข้อมูลคลินิก'}</span>
          </button>

          <button
            onClick={handleOpenExternal}
            className="text-xs font-bold text-pink-700 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 border border-pink-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
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
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-600 mb-3 animate-bounce">
              <Baby className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-pink-600" />
              <span>กำลังโหลดระบบงาน ANC รพ.โพนนาแก้ว (V.1)...</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm font-mono">
              กำลังเชื่อมต่อไปยัง {ANC_APP_URL}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleOpenExternal}
                className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดในแท็บใหม่ทันที</span>
              </button>
            </div>
          </div>
        )}

        {/* Embedded Iframe */}
        <iframe
          key={`anc-iframe-${iframeKey}`}
          src={ANC_APP_URL}
          title="งาน ANC โรงพยาบาลโพนนาแก้ว"
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
            <ExternalLink className="w-4 h-4 text-pink-400" />
            <span>เปิดระบบ ANC ในแท็บใหม่</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

    </div>
  );
};
