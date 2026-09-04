import React, { useState, useRef } from 'react';
import { 
  Activity, 
  ExternalLink, 
  RefreshCw, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  Globe, 
  ShieldCheck, 
  Stethoscope, 
  Database,
  Info,
  ArrowUpRight,
  Radio,
  Share2,
  AlertTriangle,
  Server,
  Layers,
  ChevronRight
} from 'lucide-react';

export interface EpidemProgram {
  id: string;
  orderNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  url: string;
  badge: string;
  tag: string;
  tagColor: string;
  themeColor: 'emerald' | 'sky' | 'indigo';
  isHttp?: boolean;
  description: string;
  features: string[];
}

export const EPIDEM_PROGRAMS: EpidemProgram[] = [
  {
    id: 'tb-care',
    orderNumber: 1,
    title: 'โปรแกรม PNK TB-Care',
    shortTitle: 'PNK TB-Care',
    subtitle: 'ระบบควบคุมและติดตามผู้ป่วยวัณโรค รพ.โพนนาแก้ว',
    url: 'https://epidem-pnk-hospital.vercel.app/',
    badge: 'TB-Care',
    tag: 'Vercel Cloud',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    themeColor: 'emerald',
    description: 'ระบบควบคุม กำกับติดตามผู้ป่วยวัณโรค การกินยา DOTS และเฝ้าระวังอาการไม่พึงประสงค์',
    features: ['ทะเบียนผู้ป่วยวัณโรค', 'ติดตามการกินยา DOTS', 'นัดตรวจเสมหะและ X-ray', 'ประเมินผลสำเร็จการรักษา'],
  },
  {
    id: 'srrt',
    orderNumber: 2,
    title: 'โปรแกรม งานนักระบาดSRRT',
    shortTitle: 'งานนักระบาด SRRT',
    subtitle: 'ระบบเฝ้าระวัง สอบสวนโรค และตอบโต้ภาวะฉุกเฉินทางสาธารณสุข 2026',
    url: 'https://epidem-pnk-hospital-2026.vercel.app/',
    badge: 'SRRT 2026',
    tag: 'Vercel Cloud',
    tagColor: 'bg-sky-50 text-sky-700 border-sky-200',
    themeColor: 'sky',
    description: 'ระบบเฝ้าระวังทางระบาดวิทยา การสอบสวนโรคติดต่อ 506 และการควบคุมการระบาดในพื้นที่',
    features: ['เฝ้าระวังโรคติดต่อ 506', 'บันทึกรายงานการสอบสวนโรค', 'ติดตามคลัสเตอร์การระบาด', 'แผนที่พิกัดระบาดวิทยา'],
  },
  {
    id: 'ntip',
    orderNumber: 3,
    title: 'โปรแกรม NTIProgram.s1',
    shortTitle: 'NTIProgram.s1',
    subtitle: 'ระบบสารสนเทศวัณโรคแห่งชาติ (National Tuberculosis Information)',
    url: 'http://103.74.253.10/UIForm/Login.aspx',
    badge: 'NTIP Online',
    tag: 'สวร. / กรมควบคุมโรค',
    tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    themeColor: 'indigo',
    isHttp: true,
    description: 'ระบบสารสนเทศวัณโรคแห่งชาติ กรมควบคุมโรค กระทรวงสาธารณสุข สำหรับลงทะเบียนและรายงานผลระดับประเทศ',
    features: ['ลงทะเบียนผู้ป่วย NTIP', 'บันทึกสูตรยาและการรักษา', 'รายงานประเมินผลสิ้นสุด', 'ส่งต่อและแลกเปลี่ยนข้อมูลระดับชาติ'],
  },
];

export const EpidemView: React.FC = () => {
  const [activeProgramId, setActiveProgramId] = useState<string>('tb-care');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showHttpNotice, setShowHttpNotice] = useState<boolean>(true);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const activeProgram = EPIDEM_PROGRAMS.find(p => p.id === activeProgramId) || EPIDEM_PROGRAMS[0];

  const handleSelectProgram = (id: string) => {
    if (id !== activeProgramId) {
      setActiveProgramId(id);
      setIsLoading(true);
      setIframeKey(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  const handleCopyUrl = (urlToCopy?: string) => {
    const targetUrl = urlToCopy || activeProgram.url;
    navigator.clipboard.writeText(targetUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleOpenExternal = (urlToOpen?: string) => {
    const targetUrl = urlToOpen || activeProgram.url;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenAllPrograms = () => {
    EPIDEM_PROGRAMS.forEach(prog => {
      window.open(prog.url, '_blank', 'noopener,noreferrer');
    });
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
            <div className="p-3 bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-700 text-white rounded-2xl shadow-sm shrink-0">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  ระบบงานระบาดวิทยาและข้อมูลสุขภาพ (Epidem & TB Portal)
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  พร้อมใช้งาน 3 ระบบ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>โรงพยาบาลโพนนาแก้ว</span>
                <span>•</span>
                <span className="font-semibold text-slate-700">กำลังดู: {activeProgram.title}</span>
                <span>•</span>
                <span className="font-mono text-emerald-700 bg-emerald-50/80 px-2 py-0.5 rounded text-xs border border-emerald-100 truncate max-w-[280px]">
                  {activeProgram.url}
                </span>
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Copy Current URL */}
            <button
              onClick={() => handleCopyUrl()}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition border border-slate-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="คัดลอกลิงก์โปรแกรมปัจจุบัน"
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
              title="โหลดโปรแกรมนี้ใหม่"
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
              onClick={() => handleOpenExternal()}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="เปิดโปรแกรมปัจจุบันในแท็บใหม่"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>เปิดแท็บใหม่</span>
              <ArrowUpRight className="w-3 h-3 text-emerald-200" />
            </button>

            {/* Open All in Tabs */}
            <button
              onClick={handleOpenAllPrograms}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="เปิดทั้ง 3 โปรแกรมพร้อมกันในแท็บแยก"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">เปิดทั้ง 3 แท็บ</span>
            </button>
          </div>
        </div>

        {/* 3 Program Selector Cards */}
        {!isFullscreen && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3">
            {EPIDEM_PROGRAMS.map(prog => {
              const isActive = prog.id === activeProgramId;
              const activeBorder = prog.themeColor === 'emerald'
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40'
                : prog.themeColor === 'sky'
                ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/40'
                : 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/40';

              const badgeColor = prog.themeColor === 'emerald'
                ? 'bg-emerald-600 text-white'
                : prog.themeColor === 'sky'
                ? 'bg-sky-600 text-white'
                : 'bg-indigo-600 text-white';

              return (
                <div
                  key={prog.id}
                  onClick={() => handleSelectProgram(prog.id)}
                  className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                    isActive 
                      ? `${activeBorder} shadow-sm` 
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shadow-2xs ${badgeColor}`}>
                          {prog.orderNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition">
                          {prog.shortTitle}
                        </span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${prog.tagColor}`}>
                        {prog.badge}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {prog.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {prog.subtitle}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-slate-400 truncate max-w-[140px] sm:max-w-[170px]">
                      {prog.url.replace('https://', '').replace('http://', '')}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenExternal(prog.url);
                      }}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1 cursor-pointer shrink-0"
                      title={`เปิด ${prog.shortTitle} ในแท็บใหม่`}
                    >
                      <span>เปิดแท็บ</span>
                      <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Browser Tab Navigation Bar */}
      <div className="flex items-center justify-between gap-2 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/80 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1.5 flex-1 min-w-max">
          {EPIDEM_PROGRAMS.map(prog => {
            const isActive = prog.id === activeProgramId;
            return (
              <div
                key={prog.id}
                className={`flex items-center rounded-xl transition-all ${
                  isActive 
                    ? 'bg-white shadow-xs border border-slate-200/90 text-slate-900' 
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                }`}
              >
                <button
                  onClick={() => handleSelectProgram(prog.id)}
                  className="px-3 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                  <span>{prog.orderNumber}. {prog.shortTitle}</span>
                  {prog.isHttp && (
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1 rounded">HTTP</span>
                  )}
                </button>
                <button
                  onClick={() => handleOpenExternal(prog.url)}
                  className="p-1.5 mr-1 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  title={`เปิด ${prog.shortTitle} ในแท็บใหม่`}
                >
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0 px-2">
          <button
            onClick={() => handleOpenExternal(activeProgram.url)}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>เปิดหน้าต่างใหม่ ({activeProgram.shortTitle})</span>
          </button>
        </div>
      </div>

      {/* HTTP / Mixed-Content Notice for NTIProgram.s1 */}
      {activeProgram.isHttp && showHttpNotice && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 shadow-xs animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5 sm:mt-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                คำแนะนำการใช้งาน: {activeProgram.title}
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                โปรแกรม NTIProgram.s1 เป็นระบบเว็บแอปพลิเคชันเครือข่ายภายใน (HTTP: 103.74.253.10) ตามมาตรฐานความปลอดภัยของเบราว์เซอร์ 
                แนะนำให้กดปุ่ม <strong>"เปิดในแท็บใหม่"</strong> ด้านล่าง เพื่อเข้าสู่ระบบและบันทึกข้อมูลได้อย่างราบรื่นและสมบูรณ์
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleOpenExternal(activeProgram.url)}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>เปิด NTIProgram.s1 ในแท็บใหม่</span>
            </button>
            <button
              onClick={() => setShowHttpNotice(false)}
              className="text-amber-700 hover:text-amber-900 text-xs px-2 py-1 cursor-pointer"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Container */}
      <div 
        ref={iframeContainerRef}
        className={`relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex-1 ${
          isFullscreen 
            ? 'h-full flex-1' 
            : 'h-[calc(100vh-320px)] min-h-[640px]'
        }`}
      >
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-2xs flex flex-col items-center justify-center z-10 p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 mb-3 animate-bounce">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>กำลังโหลด {activeProgram.title}...</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-sm font-mono">
              กำลังเชื่อมต่อไปยัง {activeProgram.url}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleOpenExternal()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>เปิดในแท็บใหม่ทันที</span>
              </button>
            </div>
          </div>
        )}

        {/* Embedded Iframe */}
        <iframe
          key={`${activeProgram.id}-${iframeKey}`}
          src={activeProgram.url}
          title={activeProgram.title}
          className="w-full h-full border-0 bg-white"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"
          onLoad={() => setIsLoading(false)}
        />

        {/* Floating Quick Action at Bottom Right */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => handleOpenExternal(activeProgram.url)}
            className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-lg backdrop-blur-sm transition flex items-center gap-2 border border-slate-700/60 hover:scale-105 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-emerald-400" />
            <span>เปิด {activeProgram.shortTitle} ในแท็บใหม่</span>
            <ArrowUpRight className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

    </div>
  );
};
