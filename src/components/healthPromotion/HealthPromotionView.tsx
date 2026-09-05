import React, { useState, useRef } from 'react';
import { 
  HeartPulse, 
  ExternalLink, 
  RefreshCw, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  ArrowUpRight,
  Share2,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Award,
  Footprints,
  Flame,
  Info,
  Clock,
  Construction
} from 'lucide-react';

export interface HealthPromotionProgram {
  id: string;
  orderNumber: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  url: string;
  badge: string;
  developer: string;
  status: 'active' | 'development';
  statusLabel: string;
  tagColor: string;
  accentColor: 'emerald' | 'orange';
  description: string;
  features: string[];
  note?: string;
}

export const HEALTH_PROMOTION_PROGRAMS: HealthPromotionProgram[] = [
  {
    id: 'run-ict',
    orderNumber: 1,
    title: 'แอพวิ่ง รพ.โพนนาแก้ว /ระบบวิ่ง โดย ICT',
    shortTitle: 'แอพวิ่ง รพ.โพนนาแก้ว (ICT)',
    subtitle: 'ระบบบันทึกระยะทางและสะสมกิโลเมตรกิจกรรมเดิน-วิ่ง โรงพยาบาลโพนนาแก้ว',
    url: 'https://apps.pnkhospital.net/run24_web/public/',
    badge: 'ระบบหลัก (Official)',
    developer: 'พัฒนาและดูแลโดย: ศูนย์เทคโนโลยีสารสนเทศ (ICT) รพ.โพนนาแก้ว',
    status: 'active',
    statusLabel: 'พร้อมใช้งาน (Official Production)',
    tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentColor: 'emerald',
    description: 'ระบบหลักสำหรับบุคลากรโรงพยาบาลโพนนาแก้วและเครือข่ายบริการสุขภาพ บันทึกส่งผลสะสมระยะทางเดิน-วิ่ง ภาพถ่ายหลักฐาน และสรุปสถิติจัดอันดับสุขภาพ',
    features: [
      'บันทึกระยะทางสะสม (กิโลเมตร) เวลา และแคลอรี่',
      'แนบรูปภาพหน้าจอนาฬิกา/แอปพลิเคชันวิ่ง (Strava, Garmin, Nike Run)',
      'ตรวจสอบสถิติและประวัติการส่งผลย้อนหลังรายบุคคล',
      'ตารางจัดอันดับ (Leaderboard) บุคลากรสุขภาพยอดเยี่ยม'
    ],
    note: 'แนะนำให้เข้าใช้งานเพื่อสะสมระยะทางและบันทึกคะแนนกิจกรรมสุขภาพประจำปีของโรงพยาบาล'
  },
  {
    id: 'run-it-pcu',
    orderNumber: 2,
    title: 'แอพวิ่ง พัฒนาโดย IT PCU',
    shortTitle: 'แอพวิ่ง (IT PCU)',
    subtitle: 'ระบบวิ่งเพื่อสุขภาพรุ่นใหม่ พัฒนาบน Vercel Cloud (*อยู่ระหว่างกำลังพัฒนา)',
    url: 'https://pnk-run.vercel.app/',
    badge: 'กำลังพัฒนา (Beta)',
    developer: 'พัฒนาและออกแบบโดย: ทีมงาน IT PCU เครือข่ายปฐมภูมิ',
    status: 'development',
    statusLabel: 'อยู่ระหว่างกำลังพัฒนา (*Beta Testing)',
    tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
    accentColor: 'orange',
    description: 'เว็บแอปพลิเคชันบันทึกกิจกรรมทางกายและส่งผลวิ่งรุ่นใหม่ ดีไซน์ทันสมัย ใช้งานสะดวกบนสมาร์ตโฟน พัฒนาเพื่อการประมวลผลที่รวดเร็ว',
    features: [
      'อินเทอร์เฟซทันสมัย รองรับการใช้งานบนมือถือทุกระบบ (Mobile Responsive)',
      'บันทึกกิจกรรมทางกาย เดิน-วิ่ง ก้าวท้าใจ',
      'แดชบอร์ดแสดงผลความก้าวหน้าและเป้าหมายสุขภาพ',
      'เชื่อมโยงและทดสอบฟังก์ชันใหม่สำหรับเครือข่าย PCU'
    ],
    note: '*ระบบอยู่ระหว่างการพัฒนาและทดสอบฟังก์ชัน สามารถกดเข้าทดสอบและร่วมให้ข้อเสนอแนะได้'
  }
];

export const HealthPromotionView: React.FC = () => {
  const [activeProgramId, setActiveProgramId] = useState<string>('run-ict');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const iframeContainerRef = useRef<HTMLDivElement>(null);

  const activeProgram = HEALTH_PROMOTION_PROGRAMS.find(p => p.id === activeProgramId) || HEALTH_PROMOTION_PROGRAMS[0];

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
    HEALTH_PROMOTION_PROGRAMS.forEach(prog => {
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
            <div className="p-3 bg-gradient-to-br from-emerald-600 via-teal-600 to-amber-600 text-white rounded-2xl shadow-sm shrink-0">
              <Footprints className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  งานส่งเสริมสุขภาพและกิจกรรมทางกาย (Health Promotion & Running Portal)
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  ระบบวิ่งเพื่อสุขภาพ 2 แอปพลิเคชัน
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-2">
                <span>โรงพยาบาลโพนนาแก้ว</span>
                <span>•</span>
                <span className="font-semibold text-slate-700">กำลังเลือก: {activeProgram.title}</span>
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
              title="โหลดหน้านี้ใหม่"
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

            {/* Open Both in Tabs */}
            <button
              onClick={handleOpenAllPrograms}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="เปิดทั้ง 2 แอพพร้อมกันในแท็บแยก"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">เปิดทั้ง 2 แท็บ</span>
            </button>
          </div>
        </div>

        {/* 2 Program Cards Grid */}
        {!isFullscreen && (
          <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            {HEALTH_PROMOTION_PROGRAMS.map(prog => {
              const isActive = prog.id === activeProgramId;
              const isDevelopment = prog.status === 'development';

              return (
                <div
                  key={prog.id}
                  className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between group ${
                    isActive 
                      ? isDevelopment
                        ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/30 shadow-sm'
                        : 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div>
                    {/* Header Row of Card */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center shadow-xs text-white ${
                          isDevelopment ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}>
                          {prog.orderNumber}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">
                            {prog.shortTitle}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {prog.developer}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${prog.tagColor}`}>
                        {prog.badge}
                      </span>
                    </div>

                    {/* Program Title and Subtitle */}
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-emerald-700 transition">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {prog.subtitle}
                    </p>

                    {/* Features List */}
                    <div className="mt-3.5 space-y-1.5 bg-white/80 p-3 rounded-xl border border-slate-200/60">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>ฟังก์ชันเด่นของระบบ</span>
                      </div>
                      {prog.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDevelopment ? 'text-amber-600' : 'text-emerald-600'}`} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Note badge */}
                    {prog.note && (
                      <p className={`text-[11px] mt-2.5 px-2.5 py-1.5 rounded-lg border flex items-start gap-1.5 ${
                        isDevelopment 
                          ? 'bg-amber-50/80 text-amber-800 border-amber-200/70' 
                          : 'bg-emerald-50/80 text-emerald-800 border-emerald-200/70'
                      }`}>
                        {isDevelopment ? (
                          <Construction className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        <span>{prog.note}</span>
                      </p>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <span className="text-[11px] font-mono text-slate-500 truncate">
                      {prog.url}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelectProgram(prog.id)}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                          isActive 
                            ? 'bg-slate-200 text-slate-800 border-slate-300 font-bold' 
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                        title="ดูตัวอย่างในหน้านี้"
                      >
                        {isActive ? 'กำลังดูหน้านี้' : 'ดูตัวอย่าง'}
                      </button>

                      {/* Primary Open New Tab Button */}
                      <button
                        onClick={() => handleOpenExternal(prog.url)}
                        className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                          isDevelopment 
                            ? 'bg-amber-600 hover:bg-amber-700' 
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                        title={`เปิด ${prog.shortTitle} ในแท็บใหม่`}
                      >
                        <span>เปิดแท็บใหม่</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Browser Tab Switcher Bar */}
      <div className="flex items-center justify-between gap-2 bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/80 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1.5 flex-1 min-w-max">
          {HEALTH_PROMOTION_PROGRAMS.map(prog => {
            const isActive = prog.id === activeProgramId;
            const isDevelopment = prog.status === 'development';
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
                  <span className={`w-2 h-2 rounded-full ${
                    isActive 
                      ? isDevelopment ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse' 
                      : 'bg-slate-400'
                  }`}></span>
                  <span>{prog.orderNumber}. {prog.shortTitle}</span>
                  {isDevelopment && (
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-semibold">
                      Beta
                    </span>
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
              <Footprints className="w-6 h-6" />
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
