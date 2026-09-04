import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent, EventType } from '../../types';
import { StorageService } from '../../services/storageService';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  Layers, 
  X, 
  Check, 
  Trash2, 
  Filter,
  CheckSquare,
  CalendarDays,
  ListFilter,
  AlertCircle,
  Tag
} from 'lucide-react';

const getTodayDateParts = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  return { y, m, d, dateStr };
};

const formatThaiDate = (dateStr: string) => {
  try {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return dateStr;
    const dateObj = new Date(y, m - 1, d);
    const dayNames = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    const thaiMonth = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ][m - 1] || '';
    return `วัน${dayNames[dateObj.getDay()]}ที่ ${d} ${thaiMonth} พ.ศ. ${y + 543}`;
  } catch {
    return dateStr;
  }
};

export const CalendarView: React.FC = () => {
  const { 
    calendarEvents, 
    projects,
    workgroups, 
    personnel, 
    addCalendarEvent, 
    updateCalendarEvent, 
    deleteCalendarEvent, 
    setSelectedTaskForDetail, 
    setSelectedProjectForDetail,
    tasks, 
    setActiveTab 
  } = useApp();

  const todayInfo = useMemo(() => getTodayDateParts(), []);
  const todayDateStr = todayInfo.dateStr;

  const [currentYear, setCurrentYear] = useState<number>(() => {
    const saved = StorageService.getCalendarViewState();
    return saved?.year ?? new Date().getFullYear();
  });
  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    const saved = StorageService.getCalendarViewState();
    return saved?.month ?? new Date().getMonth();
  });
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const saved = StorageService.getCalendarViewState();
    if (saved?.selectedDate) return saved.selectedDate;
    return getTodayDateParts().dateStr;
  });
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [workgroupFilter, setWorkgroupFilter] = useState<string>('all');
  const [activeSubView, setActiveSubView] = useState<'month' | 'list'>('month');

  // Modal State
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('meeting');
  const [date, setDate] = useState(todayDateStr);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [location, setLocation] = useState('');
  const [workgroupId, setWorkgroupId] = useState('');
  const [attendeesStr, setAttendeesStr] = useState('');
  const [linkedTaskId, setLinkedTaskId] = useState('');
  const [notes, setNotes] = useState('');

  const monthNamesThai = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const daysOfWeekThai = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];

  // 5-year range around current year
  const yearOptions = useMemo(() => {
    const baseYear = new Date().getFullYear();
    return [baseYear - 2, baseYear - 1, baseYear, baseYear + 1, baseYear + 2];
  }, []);

  const handlePrevMonth = () => {
    let newM = currentMonth - 1;
    let newY = currentYear;
    if (newM < 0) {
      newM = 11;
      newY = currentYear - 1;
    }
    setCurrentMonth(newM);
    setCurrentYear(newY);
    StorageService.saveCalendarViewState({ year: newY, month: newM, selectedDate });
  };

  const handleNextMonth = () => {
    let newM = currentMonth + 1;
    let newY = currentYear;
    if (newM > 11) {
      newM = 0;
      newY = currentYear + 1;
    }
    setCurrentMonth(newM);
    setCurrentYear(newY);
    StorageService.saveCalendarViewState({ year: newY, month: newM, selectedDate });
  };

  const handleGoToToday = () => {
    const { y, m, dateStr } = getTodayDateParts();
    setCurrentYear(y);
    setCurrentMonth(m);
    setSelectedDate(dateStr);
    StorageService.saveCalendarViewState({ year: y, month: m, selectedDate: dateStr });
  };

  const handleMonthSelect = (m: number) => {
    setCurrentMonth(m);
    StorageService.saveCalendarViewState({ year: currentYear, month: m, selectedDate });
  };

  const handleYearSelect = (y: number) => {
    setCurrentYear(y);
    StorageService.saveCalendarViewState({ year: y, month: currentMonth, selectedDate });
  };

  const handleDateClick = (dStr: string) => {
    setSelectedDate(dStr);
    StorageService.saveCalendarViewState({ year: currentYear, month: currentMonth, selectedDate: dStr });
  };

  // Merge calendar events with task deadlines and project deadlines for complete visual schedule
  const allScheduleItems = useMemo(() => {
    const directEvents = calendarEvents.map(e => ({
      ...e,
      isTaskDeadline: false,
      isProjectDeadline: false,
      projectId: undefined as string | undefined
    }));

    // Generate deadline items from tasks if not already covered
    const taskDeadlines = tasks
      .filter(t => t.dueDate)
      .map(t => ({
        id: `task-deadline-${t.id}`,
        title: `[ครบกำหนดงาน] ${t.title}`,
        eventType: 'report_deadline' as EventType,
        date: t.dueDate,
        startTime: '16:30',
        endTime: '16:30',
        location: 'รพ.โพนนาแก้ว',
        workgroupId: t.workgroupId,
        attendees: [],
        taskId: t.id,
        notes: `ความก้าวหน้า ${t.progress}% - สถานะ: ${t.status}`,
        isTaskDeadline: true,
        isProjectDeadline: false,
        projectId: undefined as string | undefined
      }));

    // Generate project deadline / end-date milestones
    const projectDeadlines = projects
      .filter(p => p.endDate)
      .map(p => ({
        id: `project-deadline-${p.id}`,
        title: `[สิ้นสุดโครงการ] ${p.title}`,
        eventType: 'campaign' as EventType,
        date: p.endDate,
        startTime: '09:00',
        endTime: '16:30',
        location: p.location || 'รพ.โพนนาแก้ว',
        workgroupId: p.workgroupId,
        attendees: [],
        taskId: undefined as string | undefined,
        notes: `รหัส: ${p.projectCode} - งบประมาณ ฿${p.budgetApproved.toLocaleString()} (ก้าวหน้า ${p.progress}%)`,
        isTaskDeadline: false,
        isProjectDeadline: true,
        projectId: p.id
      }));

    return [...directEvents, ...taskDeadlines, ...projectDeadlines];
  }, [calendarEvents, tasks, projects]);

  // Calendar Grid Days Calculation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; events: typeof allScheduleItems }[] = [];

    // Previous month filler days
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: false,
        events: allScheduleItems.filter(e => e.date === dateStr)
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = allScheduleItems.filter(e => {
        if (e.date !== dateStr) return false;
        if (typeFilter !== 'all' && e.eventType !== typeFilter) return false;
        if (workgroupFilter !== 'all' && e.workgroupId !== workgroupFilter) return false;
        return true;
      });

      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: true,
        events: dayEvents
      });
    }

    // Next month filler days (to fill 35 or 42 grid cells)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: false,
        events: allScheduleItems.filter(e => e.date === dateStr)
      });
    }

    return days;
  }, [currentYear, currentMonth, allScheduleItems, typeFilter, workgroupFilter]);

  // Events on selected date
  const selectedDateEvents = useMemo(() => {
    return allScheduleItems.filter(e => {
      if (e.date !== selectedDate) return false;
      if (typeFilter !== 'all' && e.eventType !== typeFilter) return false;
      if (workgroupFilter !== 'all' && e.workgroupId !== workgroupFilter) return false;
      return true;
    });
  }, [allScheduleItems, selectedDate, typeFilter, workgroupFilter]);

  // All filtered events for List View
  const filteredEventsList = useMemo(() => {
    return allScheduleItems
      .filter(e => {
        if (typeFilter !== 'all' && e.eventType !== typeFilter) return false;
        if (workgroupFilter !== 'all' && e.workgroupId !== workgroupFilter) return false;
        return true;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [allScheduleItems, typeFilter, workgroupFilter]);

  const getEventBadge = (type: EventType) => {
    switch (type) {
      case 'meeting':
        return { label: 'การประชุม', bg: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' };
      case 'home_visit':
        return { label: 'ลงพื้นที่เยี่ยมบ้าน', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      case 'campaign':
        return { label: 'กิจกรรม/รณรงค์', bg: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' };
      case 'supervision':
        return { label: 'นิเทศงาน', bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      case 'report_deadline':
        return { label: 'กำหนดส่งงาน/รายงาน', bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' };
      default:
        return { label: 'กิจกรรมทั่วไป', bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-500' };
    }
  };

  const handleOpenAddEvent = (presetDate?: string) => {
    setEditingEvent(null);
    setTitle('');
    setEventType('meeting');
    setDate(presetDate || selectedDate || todayDateStr);
    setStartTime('09:00');
    setEndTime('12:00');
    setLocation('ห้องประชุม รพ.โพนนาแก้ว');
    setWorkgroupId(workgroups[0]?.id || 'wg-01');
    setAttendeesStr('ทีมหมอครอบครัว, พยาบาลวิชาชีพ');
    setLinkedTaskId('');
    setNotes('');
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (ev: CalendarEvent) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setEventType(ev.eventType);
    setDate(ev.date);
    setStartTime(ev.startTime || '09:00');
    setEndTime(ev.endTime || '');
    setLocation(ev.location || '');
    setWorkgroupId(ev.workgroupId || '');
    setAttendeesStr(ev.attendees?.join(', ') || '');
    setLinkedTaskId(ev.taskId || '');
    setNotes(ev.notes || '');
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const attendees = attendeesStr.split(',').map(s => s.trim()).filter(Boolean);

    if (editingEvent) {
      updateCalendarEvent(editingEvent.id, {
        title: title.trim(),
        eventType,
        date,
        startTime,
        endTime,
        location: location.trim(),
        workgroupId: workgroupId || undefined,
        attendees,
        taskId: linkedTaskId || undefined,
        notes: notes.trim()
      });
    } else {
      addCalendarEvent({
        title: title.trim(),
        eventType,
        date,
        startTime,
        endTime,
        location: location.trim(),
        workgroupId: workgroupId || undefined,
        attendees,
        taskId: linkedTaskId || undefined,
        notes: notes.trim()
      });
    }
    setIsEventModalOpen(false);
  };

  // Quick stats
  const monthStats = useMemo(() => {
    const mStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const thisMonthEvents = allScheduleItems.filter(e => e.date.startsWith(mStr));
    return {
      total: thisMonthEvents.length,
      meetings: thisMonthEvents.filter(e => e.eventType === 'meeting').length,
      homeVisits: thisMonthEvents.filter(e => e.eventType === 'home_visit').length,
      deadlines: thisMonthEvents.filter(e => e.eventType === 'report_deadline').length
    };
  }, [allScheduleItems, currentYear, currentMonth]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header with Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span>📅 ปฏิทินปฏิบัติงานและนัดหมายกิจกรรม</span>
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-xs sm:text-sm text-slate-500">
              ลงตารางนัดหมาย ประชุม ลงพื้นที่เยี่ยมบ้าน รณรงค์ และติดตามกำหนดส่งงาน 13 กลุ่มงาน รพ.โพนนาแก้ว
            </p>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              วันนี้: {formatThaiDate(todayDateStr)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-xs">
            <button
              onClick={() => setActiveSubView('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSubView === 'month' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>มุมมองเดือน</span>
            </button>
            <button
              onClick={() => setActiveSubView('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeSubView === 'list' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>รายการทั้งหมด</span>
            </button>
          </div>

          <button
            onClick={() => handleOpenAddEvent()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ ลงงาน/กิจกรรมใหม่</span>
          </button>
        </div>
      </div>

      {/* Monthly Mini Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500 uppercase">กิจกรรมในเดือนนี้</p>
          <p className="text-2xl font-bold text-slate-800 mt-0.5">{monthStats.total}</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-medium text-blue-600 uppercase">การประชุม</p>
          <p className="text-2xl font-bold text-blue-600 mt-0.5">{monthStats.meetings}</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-medium text-emerald-600 uppercase">ลงพื้นที่เยี่ยมบ้าน</p>
          <p className="text-2xl font-bold text-emerald-600 mt-0.5">{monthStats.homeVisits}</p>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <p className="text-[11px] font-medium text-red-600 uppercase">กำหนดส่งงาน/รายงาน</p>
          <p className="text-2xl font-bold text-red-600 mt-0.5">{monthStats.deadlines}</p>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-600 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> ประเภท:
          </span>
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${typeFilter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            ทั้งหมด ({allScheduleItems.length})
          </button>
          <button
            onClick={() => setTypeFilter('meeting')}
            className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${typeFilter === 'meeting' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
          >
            การประชุม
          </button>
          <button
            onClick={() => setTypeFilter('home_visit')}
            className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${typeFilter === 'home_visit' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
          >
            ลงพื้นที่เยี่ยมบ้าน
          </button>
          <button
            onClick={() => setTypeFilter('campaign')}
            className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${typeFilter === 'campaign' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
          >
            กิจกรรม/รณรงค์
          </button>
          <button
            onClick={() => setTypeFilter('supervision')}
            className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${typeFilter === 'supervision' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'}`}
          >
            นิเทศงาน
          </button>
          <button
            onClick={() => setTypeFilter('report_deadline')}
            className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${typeFilter === 'report_deadline' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'}`}
          >
            กำหนดส่งงาน
          </button>
        </div>

        <select
          value={workgroupFilter}
          onChange={e => setWorkgroupFilter(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer"
        >
          <option value="all">ทุกกลุ่มงาน (13 กลุ่มงาน)</option>
          {workgroups.map(wg => (
            <option key={wg.id} value={wg.id}>{wg.code}. {wg.shortName}</option>
          ))}
        </select>
      </div>

      {activeSubView === 'month' ? (
        /* Month Grid Layout: Left Calendar Grid + Right Daily List */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendar Grid Box */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col">
            {/* Month Switcher Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                {/* Month Dropdown */}
                <select
                  value={currentMonth}
                  onChange={e => handleMonthSelect(Number(e.target.value))}
                  className="font-bold text-sm sm:text-base text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 cursor-pointer focus:outline-emerald-500"
                >
                  {monthNamesThai.map((name, idx) => (
                    <option key={idx} value={idx}>{name}</option>
                  ))}
                </select>
                {/* Year Dropdown */}
                <select
                  value={currentYear}
                  onChange={e => handleYearSelect(Number(e.target.value))}
                  className="font-bold text-sm sm:text-base text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 cursor-pointer focus:outline-emerald-500"
                >
                  {yearOptions.map(y => (
                    <option key={y} value={y}>พ.ศ. {y + 543} ({y})</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition cursor-pointer border border-slate-200"
                  title="เดือนก่อนหน้า"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleGoToToday}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 border ${
                    selectedDate === todayDateStr && currentMonth === todayInfo.m && currentYear === todayInfo.y
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100 shadow-2xs'
                  }`}
                  title="กลับมายังวันปัจจุบัน"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>วันนี้</span>
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition cursor-pointer border border-slate-200"
                  title="เดือนถัดไป"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 mb-2">
              {daysOfWeekThai.map((d, i) => (
                <div key={i} className={`py-1 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : ''}`}>
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid Cells */}
            <div className="grid grid-cols-7 gap-1.5 flex-1">
              {calendarDays.map((cell, idx) => {
                const isSelected = cell.dateStr === selectedDate;
                const isToday = cell.dateStr === todayDateStr;
                const hasEvents = cell.events.length > 0;

                return (
                  <div
                    key={idx}
                    onClick={() => handleDateClick(cell.dateStr)}
                    className={`
                      min-h-[88px] p-2 rounded-xl border transition flex flex-col justify-between cursor-pointer relative
                      ${!cell.isCurrentMonth ? 'bg-slate-50/40 text-slate-300 border-transparent opacity-60' : 'bg-white border-slate-200 hover:border-emerald-300'}
                      ${isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50/25 border-emerald-500 shadow-xs' : isToday ? 'border-amber-400 bg-amber-50/30' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className={`
                          text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center
                          ${isSelected ? 'bg-emerald-600 text-white shadow-xs' : isToday ? 'bg-amber-500 text-white font-extrabold ring-2 ring-amber-300 shadow-xs' : cell.isCurrentMonth ? 'text-slate-800' : 'text-slate-400'}
                        `}>
                          {cell.dayNum}
                        </span>
                        {isToday && (
                          <span className="text-[9px] font-extrabold text-amber-700 bg-amber-100 px-1 rounded border border-amber-300">
                            วันนี้
                          </span>
                        )}
                      </div>

                      {hasEvents && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                          {cell.events.length}
                        </span>
                      )}
                    </div>

                    {/* Event badges preview */}
                    <div className="space-y-1 mt-1 overflow-hidden">
                      {cell.events.slice(0, 2).map(ev => {
                        const badge = getEventBadge(ev.eventType);
                        return (
                          <div
                            key={ev.id}
                            className={`text-[9px] px-1.5 py-0.5 rounded font-medium truncate border ${badge.bg}`}
                          >
                            {ev.title}
                          </div>
                        );
                      })}
                      {cell.events.length > 2 && (
                        <span className="text-[8px] text-slate-400 block text-right font-medium">
                          +{cell.events.length - 2} อื่นๆ
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Events Drawer */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <span className="text-xs text-slate-400 font-semibold block">กิจกรรมและนัดหมายประจำวัน</span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex flex-wrap items-center gap-1.5">
                    <span>{formatThaiDate(selectedDate)}</span>
                    {selectedDate === todayDateStr && (
                      <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        วันนี้
                      </span>
                    )}
                  </h3>
                </div>
                <button
                  onClick={() => handleOpenAddEvent(selectedDate)}
                  className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  title="เพิ่มกิจกรรมในวันนี้"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่ม</span>
                </button>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                {selectedDateEvents.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-xs">
                    <CalendarDays className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    ไม่มีกิจกรรมหรือนัดหมายในวันที่เลือก
                    <button 
                      onClick={() => handleOpenAddEvent(selectedDate)}
                      className="block mx-auto mt-2 text-emerald-600 font-bold hover:underline cursor-pointer"
                    >
                      + เพิ่มกิจกรรมในวันนี้
                    </button>
                  </div>
                ) : (
                  selectedDateEvents.map(ev => {
                    const badge = getEventBadge(ev.eventType);
                    const wg = workgroups.find(w => w.id === ev.workgroupId);
                    const linkedTask = tasks.find(t => t.id === ev.taskId);

                    return (
                      <div
                        key={ev.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          {!('isTaskDeadline' in ev && ev.isTaskDeadline) && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleOpenEditEvent(ev as CalendarEvent)}
                                className="text-slate-400 hover:text-emerald-700 text-xs p-1 cursor-pointer"
                                title="แก้ไข"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => deleteCalendarEvent(ev.id)}
                                className="text-slate-400 hover:text-red-600 text-xs p-1 cursor-pointer"
                                title="ลบ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{ev.title}</h4>

                        <div className="space-y-1 text-[11px] text-slate-600">
                          {ev.startTime && (
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>เวลา {ev.startTime} {ev.endTime ? `- ${ev.endTime}` : ''} น.</span>
                            </div>
                          )}
                          {ev.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{ev.location}</span>
                            </div>
                          )}
                          {ev.attendees && ev.attendees.length > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate">{ev.attendees.join(', ')}</span>
                            </div>
                          )}
                          {wg && (
                            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                              <Layers className="w-3.5 h-3.5" />
                              <span>กลุ่มงานที่ {wg.code}: {wg.shortName}</span>
                            </div>
                          )}
                        </div>

                        {linkedTask && (
                          <button
                            onClick={() => {
                              setSelectedTaskForDetail(linkedTask);
                              setActiveTab('tasks');
                            }}
                            className="w-full mt-2 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-center transition block cursor-pointer"
                          >
                            📋 ดูงาน: {linkedTask.taskCode} ({linkedTask.title}) →
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-400">
                💡 คลิกวันที่ในปฏิทินเพื่อดูนัดหมาย หรือกดปุ่ม "+ ลงงาน/กิจกรรมใหม่"
              </span>
            </div>
          </div>

        </div>
      ) : (
        /* List View of All Events & Deadlines */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              📋 รายการกิจกรรมและภารกิจทั้งหมด ({filteredEventsList.length} รายการ)
            </h3>
            <button
              onClick={() => handleOpenAddEvent()}
              className="text-xs text-emerald-600 font-bold hover:underline cursor-pointer"
            >
              + เพิ่มกิจกรรมใหม่
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">วันที่ / เวลา</th>
                  <th className="px-4 py-3">ประเภท</th>
                  <th className="px-4 py-3">ชื่องาน / กิจกรรม</th>
                  <th className="px-4 py-3">กลุ่มงาน</th>
                  <th className="px-4 py-3">สถานที่ / ผู้เกี่ยวข้อง</th>
                  <th className="px-4 py-3 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEventsList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                      ไม่พบกิจกรรมหรือนัดหมายตามเงื่อนไขที่เลือก
                    </td>
                  </tr>
                ) : (
                  filteredEventsList.map(ev => {
                    const badge = getEventBadge(ev.eventType);
                    const wg = workgroups.find(w => w.id === ev.workgroupId);
                    const linkedTask = tasks.find(t => t.id === ev.taskId);
                    const isTaskDeadline = 'isTaskDeadline' in ev && ev.isTaskDeadline;

                    return (
                      <tr key={ev.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>{formatThaiDate(ev.date)}</span>
                            {ev.date === todayDateStr && (
                              <span className="text-[9px] font-extrabold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                                วันนี้
                              </span>
                            )}
                          </div>
                          {ev.startTime && (
                            <div className="text-[11px] text-slate-400">{ev.startTime} {ev.endTime ? `- ${ev.endTime}` : ''} น.</div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800 max-w-xs">
                          <div>{ev.title}</div>
                          {ev.notes && <p className="text-[10px] text-slate-400 font-normal mt-0.5 truncate">{ev.notes}</p>}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                          {wg ? `${wg.code}. ${wg.shortName}` : '-'}
                        </td>
                        <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                          {ev.location || '-'}{ev.attendees && ev.attendees.length > 0 ? ` (${ev.attendees.join(', ')})` : ''}
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {linkedTask ? (
                            <button
                              onClick={() => {
                                setSelectedTaskForDetail(linkedTask);
                                setActiveTab('tasks');
                              }}
                              className="text-xs text-emerald-600 font-bold hover:underline mr-2 cursor-pointer"
                            >
                              ดูงาน
                            </button>
                          ) : null}
                          {!isTaskDeadline && (
                            <>
                              <button
                                onClick={() => handleOpenEditEvent(ev as CalendarEvent)}
                                className="text-slate-500 hover:text-emerald-700 text-xs px-1.5 py-0.5 rounded cursor-pointer"
                              >
                                แก้ไข
                              </button>
                              <button
                                onClick={() => deleteCalendarEvent(ev.id)}
                                className="text-slate-400 hover:text-red-600 text-xs px-1.5 py-0.5 rounded cursor-pointer"
                              >
                                ลบ
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in duration-150">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-emerald-600" />
                <span>{editingEvent ? 'แก้ไขกิจกรรมในปฏิทิน' : '+ ลงงาน / นัดหมายกิจกรรมใหม่'}</span>
              </h3>
              <button 
                onClick={() => setIsEventModalOpen(false)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่องาน / กิจกรรม / วาระการประชุม *</label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ประชุมคลินิก NCDs สัญจร, ลงพื้นที่เยี่ยมบ้านผู้ป่วย Palliative"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ประเภทกิจกรรม *</label>
                  <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value as EventType)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl font-semibold focus:outline-emerald-500 cursor-pointer"
                  >
                    <option value="meeting">การประชุม</option>
                    <option value="home_visit">ลงพื้นที่เยี่ยมบ้าน</option>
                    <option value="campaign">กิจกรรม/รณรงค์</option>
                    <option value="supervision">นิเทศงาน</option>
                    <option value="report_deadline">กำหนดส่งรายงาน/งาน</option>
                    <option value="other">กิจกรรมทั่วไป</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">วันที่จัดกิจกรรม *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl focus:outline-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เวลาเริ่มต้น</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl focus:outline-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เวลาสิ้นสุด</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">สถานที่จัดกิจกรรม</label>
                <input
                  type="text"
                  placeholder="เช่น ห้องประชุม 1 รพ.โพนนาแก้ว หรือ รพ.สต.บ้านนาแก้ว"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">กลุ่มงานที่เกี่ยวข้อง</label>
                  <select
                    value={workgroupId}
                    onChange={e => setWorkgroupId(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl focus:outline-emerald-500 cursor-pointer"
                  >
                    <option value="">-- ไม่ระบุกลุ่มงาน --</option>
                    {workgroups.map(wg => (
                      <option key={wg.id} value={wg.id}>{wg.code}. {wg.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">เชื่อมโยงกับงาน (ถ้ามี)</label>
                  <select
                    value={linkedTaskId}
                    onChange={e => setLinkedTaskId(e.target.value)}
                    className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl focus:outline-emerald-500 cursor-pointer"
                  >
                    <option value="">-- ไม่เชื่อมโยง --</option>
                    {tasks.map(t => (
                      <option key={t.id} value={t.id}>{t.taskCode}: {t.title.substring(0, 30)}...</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ผู้เข้าร่วม / บุคลากรที่รับผิดชอบ</label>
                <input
                  type="text"
                  placeholder="เช่น พว.สมใจ, พว.กาญจนา, อสม. ประจำหมู่บ้าน"
                  value={attendeesStr}
                  onChange={e => setAttendeesStr(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">บันทึกเพิ่มเติม / หมายเหตุ</label>
                <textarea
                  rows={2}
                  placeholder="รายละเอียดเพิ่มเติม วาระ หรือสิ่งที่ต้องเตรียม..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  บันทึกกิจกรรม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
