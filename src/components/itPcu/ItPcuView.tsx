import React, { useState, useRef } from 'react';
import { 
  Network, 
  ExternalLink, 
  RefreshCw, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  ArrowUpRight,
  ShieldCheck,
  Server,
  Database,
  Info,
  Layers,
  Cpu,
  Phone,
  HardDrive,
  FileCheck2,
  Lock,
  Wifi,
  Radio,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export const IT_PCU_URL = 'http://192.168.0.244/data-exchange/';

export const ItPcuView: React.FC = () => {
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
    navigator.clipboard.writeText(IT_PCU_URL);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleOpenExternal = () => {
    window.open(IT_PCU_URL, '_blank', 'noopener,noreferrer');
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
            <div className="p-3 bg-gradient-to-br from-cyan-600 via-sky-600 to-indigo-700 text-white rounded-2xl shadow-sm shrink-0">
              <Network className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  งาน IT PCU • ระบบแลกเปลี่ยนข้อมูลสุขภาพ (PCU Data Exchange)
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></span>
                  LAN / Intranet Server
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  กลุ่มงาน 12: สารสนเทศและข้อมูลคุณภาพ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>โรงพยาบาลโพนนาแก้ว</span>
                <span>•</span>
                <span className="font-medium text-slate-700">ระบบเชื่อมโยงและแลกเปลี่ยนข้อมูลเครือข่ายปฐมภูมิ รพ.สต.</span>
                <span>•</span>
                <span className="font-mono text-cyan-800 bg-cyan-50/80 px-2 py-0.5 rounded text-xs border border-cyan-200 truncate max-w-[320px]">
                  {IT_PCU_URL}
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
              title="คัดลอกลิงก์เซิร์ฟเวอร์ IT PCU"
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
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="เปิดระบบ IT PCU Data Exchange ในแท็บใหม่"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>เปิดระบบในแท็บใหม่ (LAN)</span>
              <ArrowUpRight className="w-3 h-3 text-cyan-200" />
            </button>
          </div>
        </div>

        {/* Intranet & Network Notice Banner */}
        <div className="mt-4 p-3.5 bg-gradient-to-r from-amber-50 to-sky-50 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center gap-2.5 text-slate-700">
            <Wifi className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
            <p>
              <span className="font-bold text-amber-900">คำแนะนำการเข้าใช้งานเครือข่ายภายใน (Intranet Server):</span>{' '}
              ระบบตั้งอยู่บนหมายเลข IP <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300 text-amber-900 font-bold">192.168.0.244</code> ผู้ใช้งานต้องเชื่อมต่อสัญญาณอินเทอร์เน็ต/Wi-Fi ภายใน รพ.โพนนาแก้ว หรือเครือข่าย VPN ปฐมภูมิ หากเบราว์เซอร์ไม่แสดงผลในกรอบ iframe ให้กดปุ่ม <strong>"เปิดระบบในแท็บใหม่"</strong>
            </p>
          </div>
          <button
            onClick={handleOpenExternal}
            className="shrink-0 px-3 py-1.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-lg text-xs transition flex items-center gap-1 cursor-pointer active:scale-95"
          >
            <span>เปิดหน้าต่างแท็บใหม่</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Informational Cards */}
        {!isFullscreen && showInfoBanner && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Server Architecture */}
            <div className="p-4 rounded-xl bg-cyan-50/50 border border-cyan-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-800 uppercase tracking-wider mb-2">
                  <Server className="w-4 h-4 text-cyan-600" />
                  <span>สถาปัตยกรรมเซิร์ฟเวอร์ (Server Specs)</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">เซิร์ฟเวอร์ IP:</span>
                    <span className="font-mono font-bold text-cyan-900">192.168.0.244</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">เส้นทางระบบ:</span>
                    <span className="font-mono font-medium text-slate-800">/data-exchange/</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">โปรโตคอล:</span>
                    <span className="font-medium text-slate-800">HTTP (Intranet Local)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">ตำแหน่งที่ตั้ง:</span>
                    <span className="font-medium text-slate-800">ห้องศูนย์คอมพิวเตอร์ รพ.โพนนาแก้ว</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-cyan-100/80 flex items-center justify-between text-[11px] text-cyan-700">
                <span className="flex items-center gap-1 font-medium">
                  <HardDrive className="w-3.5 h-3.5 text-cyan-500" />
                  Local On-Premises Server
                </span>
                <span className="bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-md font-bold">
                  Active
                </span>
              </div>
            </div>

            {/* Card 2: Key Capabilities & Services */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>บริการแลกเปลี่ยนข้อมูลปฐมภูมิ</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>เชื่อมโยงและรับ-ส่งแฟ้มข้อมูลสุขภาพ 43 แฟ้ม (HDC)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>ซิงค์ประวัติผู้รับบริการระหว่าง รพ.โพนนาแก้ว และ รพ.สต.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>ตรวจสอบคุณภาพข้อมูล (Data Quality Audit)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    <span>ระบบสนับสนุนการดูแลต่อเนื่อง (Continuity of Care: COC)</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-sky-500" />
                  มาตรฐานข้อมูล: สปสช. & กสธ.
                </span>
                <span className="font-semibold text-indigo-700">PCU Network</span>
              </div>
            </div>

            {/* Card 3: Admin & Responsible Person */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-700 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>ผู้รับผิดชอบงาน IT PCU</span>
                  </div>
                  <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded-full">
                    System Admin
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  นายอนุชา ชัยเจริญ
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  นักวิชาการคอมพิวเตอร์ปฏิบัติการ • งานสารสนเทศและข้อมูลคุณภาพ
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>086-789-0123</span>
                  <span className="text-slate-600">•</span>
                  <span>ศูนย์คอมพิวเตอร์ รพ.โพนนาแก้ว</span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-700 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono truncate max-w-[140px]">
                  192.168.0.244
                </span>
                <button
                  onClick={handleOpenExternal}
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer active:scale-95"
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
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            <span>ระบบ IT PCU Data Exchange รพ.โพนนาแก้ว</span>
          </div>
          <span className="text-xs font-mono text-slate-600 bg-white/60 px-3 py-1.5 rounded-xl border border-slate-200/60 hidden sm:inline-block">
            {IT_PCU_URL}
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
            className="text-xs font-bold text-cyan-800 hover:text-cyan-900 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
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
        {/* Loading & Fallback Indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-50/95 backdrop-blur-2xs flex flex-col items-center justify-center z-10 p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 mb-3 animate-bounce">
              <Network className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-600" />
              <span>กำลังเชื่อมต่อไปยังระบบ IT PCU Data Exchange...</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm font-mono">
              กำลังเชื่อมต่อไปยัง {IT_PCU_URL}
            </p>
            <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 max-w-md text-xs text-amber-800 text-left flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                หากท่านอยู่นอกเครือข่าย LAN หรือเบราว์เซอร์ไม่แสดงหน้าเว็บภายในกรอบ ให้กดปุ่ม <strong>"เปิดในแท็บใหม่ทันที"</strong> เพื่อเปิดเข้าใช้งานโดยตรง
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleOpenExternal}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดในแท็บใหม่ทันที (LAN Direct)</span>
              </button>
            </div>
          </div>
        )}

        {/* Embedded Iframe */}
        <iframe
          key={`it-pcu-iframe-${iframeKey}`}
          src={IT_PCU_URL}
          title="งาน IT PCU Data Exchange โรงพยาบาลโพนนาแก้ว"
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
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            <span>เปิดระบบ IT PCU ในแท็บใหม่</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

    </div>
  );
};
