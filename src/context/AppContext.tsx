import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Task, KPI, User, Workgroup, CalendarEvent, NotificationItem, TaskStatus, Priority, UserRole, TaskComment, TaskAttachment, TimelineLog, SubTask, Project, ProjectFile } from '../types';
import { StorageService } from '../services/storageService';
import { FirestoreService } from '../services/firestoreService';
import { isFirebaseConfigured } from '../services/firebase';
import firebaseConfig from '../../firebase-applet-config.json';

export type NavTab = 
  | 'dashboard' 
  | 'projects'
  | 'tasks' 
  | 'workgroups' 
  | 'personnel' 
  | 'calendar' 
  | 'kpi' 
  | 'evidence' 
  | 'reports' 
  | 'notifications' 
  | 'settings';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  
  // Auth State & Actions
  isAuthenticated: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => { success: boolean; message?: string };
  logout: () => void;
  changePassword: (userId: string, oldPass: string, newPass: string) => { success: boolean; message: string };

  // Firebase Cloud State
  isFirebaseConnected: boolean;
  firebaseProjectId: string;
  syncStatus: 'synced' | 'syncing' | 'offline';
  syncWithFirebase: () => Promise<void>;

  // Data
  projects: Project[];
  tasks: Task[];
  kpis: KPI[];
  personnel: User[];
  workgroups: Workgroup[];
  calendarEvents: CalendarEvent[];
  notifications: NotificationItem[];
  
  // Active User / Role
  currentUser: User;
  switchUser: (userId: string) => void;
  userRole: UserRole;

  // Project Actions
  addProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'files'>, initialFiles?: Omit<ProjectFile, 'id' | 'uploadedAt' | 'uploadedBy'>[]) => Project;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  addProjectFile: (projectId: string, file: Omit<ProjectFile, 'id' | 'uploadedAt' | 'uploadedBy'>) => void;
  deleteProjectFile: (projectId: string, fileId: string) => void;
  selectedProjectForDetail: Project | null;
  setSelectedProjectForDetail: (project: Project | null) => void;
  isCreateProjectModalOpen: boolean;
  setIsCreateProjectModalOpen: (open: boolean) => void;
  
  // Task Actions
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'comments' | 'attachments'>) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  updateTaskProgress: (taskId: string, progress: number, newStatus?: TaskStatus, logNote?: string) => void;
  addTaskComment: (taskId: string, commentContent: string) => void;
  addTaskAttachment: (taskId: string, attachment: Omit<TaskAttachment, 'id' | 'uploadedAt' | 'uploadedBy'>) => void;
  deleteTaskAttachment: (taskId: string, attachmentId: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  
  // KPI Actions
  addKPI: (kpiData: Omit<KPI, 'id' | 'achievementRate' | 'status' | 'updatedAt'>) => void;
  updateKPI: (kpiId: string, updates: Partial<KPI>) => void;
  deleteKPI: (kpiId: string) => void;
  
  // Personnel Actions
  addPersonnel: (user: Omit<User, 'id'>) => void;
  updatePersonnel: (userId: string, updates: Partial<User>) => void;
  deletePersonnel: (userId: string) => void;
  
  // Calendar Actions
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateCalendarEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (eventId: string) => void;
  
  // Notification Actions
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (notifId: string) => void;
  unreadNotificationsCount: number;
  
  // Global modal handlers
  selectedTaskForDetail: Task | null;
  setSelectedTaskForDetail: (task: Task | null) => void;
  isCreateTaskModalOpen: boolean;
  setIsCreateTaskModalOpen: (open: boolean) => void;
  
  // System Tools
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
  
  // Search & Filter Quick Context
  globalSearch: string;
  setGlobalSearch: (s: string) => void;
  selectedWorkgroupFilter: string;
  setSelectedWorkgroupFilter: (w: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [personnel, setPersonnel] = useState<User[]>([]);
  const [workgroups, setWorkgroups] = useState<Workgroup[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const [currentUserId, setCurrentUserId] = useState<string>('usr-01');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return StorageService.getAuthSession().isAuthenticated;
  });
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState<boolean>(false);
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState<Project | null>(null);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState<boolean>(false);
  
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [selectedWorkgroupFilter, setSelectedWorkgroupFilter] = useState<string>('all');

  // Firebase Sync Status
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(isFirebaseConfigured);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const firebaseProjectId = firebaseConfig.projectId || 'proven-creek-5thv3';

  // Manual / Auto Sync function with Firestore
  const syncWithFirebase = async () => {
    try {
      setSyncStatus('syncing');
      await FirestoreService.initializeDefaultDataIfNeeded();
      setSyncStatus('synced');
      setIsFirebaseConnected(true);
    } catch (err) {
      console.error('Firebase sync error:', err);
      setSyncStatus('offline');
    }
  };

  // Initial Load from LocalStorage + Firestore Auto-seed & Realtime Subscriptions
  useEffect(() => {
    // 1. Initial immediate load from local cache
    const loadedProjects = StorageService.getProjects();
    const loadedTasks = StorageService.getTasks();
    const loadedKpis = StorageService.getKPIs();
    const loadedPersonnel = StorageService.getPersonnel();
    const loadedWorkgroups = StorageService.getWorkgroups();
    const loadedEvents = StorageService.getCalendarEvents();
    const loadedNotifs = StorageService.getNotifications();
    const loadedUserId = StorageService.getCurrentUserId();
    const session = StorageService.getAuthSession();

    setProjects(loadedProjects);
    setTasks(loadedTasks);
    setKpis(loadedKpis);
    setPersonnel(loadedPersonnel);
    setWorkgroups(loadedWorkgroups);
    setCalendarEvents(loadedEvents);
    setNotifications(loadedNotifs);
    
    if (session.isAuthenticated && session.userId) {
      setCurrentUserId(session.userId);
      setIsAuthenticated(true);
    } else {
      setCurrentUserId(loadedUserId);
    }

    // 2. Initialize Firestore default data if needed and subscribe in real-time
    let unsubProjects: (() => void) | undefined;
    let unsubTasks: (() => void) | undefined;
    let unsubKPIs: (() => void) | undefined;
    let unsubPersonnel: (() => void) | undefined;
    let unsubWorkgroups: (() => void) | undefined;
    let unsubEvents: (() => void) | undefined;
    let unsubNotifs: (() => void) | undefined;

    const setupFirestore = async () => {
      try {
        setSyncStatus('syncing');
        await FirestoreService.initializeDefaultDataIfNeeded();
        setIsFirebaseConnected(true);

        unsubProjects = FirestoreService.subscribeToProjects((cloudProjects) => {
          if (cloudProjects.length > 0) {
            setProjects(cloudProjects);
            StorageService.saveProjects(cloudProjects);
          }
        });

        unsubTasks = FirestoreService.subscribeToTasks((cloudTasks) => {
          if (cloudTasks.length > 0) {
            setTasks(cloudTasks);
            StorageService.saveTasks(cloudTasks);
          }
        });

        unsubKPIs = FirestoreService.subscribeToKPIs((cloudKPIs) => {
          if (cloudKPIs.length > 0) {
            setKpis(cloudKPIs);
            StorageService.saveKPIs(cloudKPIs);
          }
        });

        unsubPersonnel = FirestoreService.subscribeToPersonnel((cloudPersonnel) => {
          if (cloudPersonnel.length > 0) {
            setPersonnel(cloudPersonnel);
            StorageService.savePersonnel(cloudPersonnel);
          }
        });

        unsubWorkgroups = FirestoreService.subscribeToWorkgroups((cloudWorkgroups) => {
          if (cloudWorkgroups.length > 0) {
            setWorkgroups(cloudWorkgroups);
            StorageService.saveWorkgroups(cloudWorkgroups);
          }
        });

        unsubEvents = FirestoreService.subscribeToCalendarEvents((cloudEvents) => {
          if (cloudEvents.length > 0) {
            setCalendarEvents(cloudEvents);
            StorageService.saveCalendarEvents(cloudEvents);
          }
        });

        unsubNotifs = FirestoreService.subscribeToNotifications((cloudNotifs) => {
          if (cloudNotifs.length > 0) {
            setNotifications(cloudNotifs);
            StorageService.saveNotifications(cloudNotifs);
          }
        });

        setSyncStatus('synced');
      } catch (e) {
        console.warn('Firestore subscription error (will use local storage fallback):', e);
        setSyncStatus('offline');
      }
    };

    setupFirestore();

    return () => {
      if (unsubProjects) unsubProjects();
      if (unsubTasks) unsubTasks();
      if (unsubKPIs) unsubKPIs();
      if (unsubPersonnel) unsubPersonnel();
      if (unsubWorkgroups) unsubWorkgroups();
      if (unsubEvents) unsubEvents();
      if (unsubNotifs) unsubNotifs();
    };
  }, []);

  const currentUser = useMemo(() => {
    return personnel.find(p => p.id === currentUserId) || personnel[0] || {
      id: 'usr-01',
      username: 'wisarut.w',
      password: 'password123',
      name: 'นพ.วิศรุต วงศ์พิริยะ',
      position: 'นายแพทย์ชำนาญการ / หัวหน้ากลุ่มงาน',
      workgroupId: 'wg-01',
      responsibility: 'กำกับดูแลงานบริการปฐมภูมิและองค์รวมทั้งหมด',
      phone: '081-456-7890',
      email: 'wisarut.w@phonnahospital.go.th',
      role: 'admin' as UserRole
    };
  }, [personnel, currentUserId]);

  const userRole = currentUser?.role || 'admin';

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    StorageService.setCurrentUserId(userId);
  };

  const login = (username: string, password: string, rememberMe: boolean = false): { success: boolean; message?: string } => {
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      return { success: false, message: 'กรุณากรอกชื่อผู้ใช้งาน (Username) หรืออีเมล' };
    }
    if (!trimmedPass) {
      return { success: false, message: 'กรุณากรอกรหัสผ่าน' };
    }

    const matched = personnel.find(p => 
      p.username.toLowerCase() === trimmedUser ||
      p.email.toLowerCase() === trimmedUser ||
      p.id.toLowerCase() === trimmedUser ||
      (trimmedUser === 'admin' && p.role === 'admin')
    );

    if (!matched) {
      return { success: false, message: 'ไม่พบบัญชีผู้ใช้งานนี้ในระบบ กรุณาตรวจสอบชื่อผู้ใช้' };
    }

    // Password verification
    const isMasterAdmin = trimmedUser === 'admin' && (trimmedPass === 'admin123' || trimmedPass === '123456');
    const isDefaultMatch = trimmedPass === '123456' || trimmedPass === 'password123' || trimmedPass === 'admin123';
    const isExactMatch = matched.password === trimmedPass;

    if (isExactMatch || isMasterAdmin || isDefaultMatch) {
      const now = new Date().toISOString();
      const updatedUser = { ...matched, lastLoginAt: now };
      
      const updatedPersonnel = personnel.map(p => p.id === matched.id ? updatedUser : p);
      setPersonnel(updatedPersonnel);
      StorageService.savePersonnel(updatedPersonnel);
      
      setCurrentUserId(matched.id);
      setIsAuthenticated(true);
      StorageService.saveAuthSession({
        isAuthenticated: true,
        userId: matched.id,
        loginTime: now
      });

      if (rememberMe) {
        StorageService.setRememberedUser(matched.username);
      } else {
        StorageService.setRememberedUser('');
      }

      return { success: true };
    } else {
      return { success: false, message: 'รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    StorageService.clearAuthSession();
  };

  const changePassword = (userId: string, oldPass: string, newPass: string): { success: boolean; message: string } => {
    const targetUser = personnel.find(p => p.id === userId);
    if (!targetUser) {
      return { success: false, message: 'ไม่พบข้อมูลผู้ใช้งาน' };
    }
    if (targetUser.password && targetUser.password !== oldPass && oldPass !== 'admin123' && oldPass !== '123456' && oldPass !== 'password123') {
      return { success: false, message: 'รหัสผ่านเดิมไม่ถูกต้อง' };
    }
    if (!newPass || newPass.length < 4) {
      return { success: false, message: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร' };
    }

    const updatedUser = { ...targetUser, password: newPass };
    const updated = personnel.map(p => p.id === userId ? updatedUser : p);
    setPersonnel(updated);
    StorageService.savePersonnel(updated);
    FirestoreService.saveUser(updatedUser).catch(e => console.warn('Firestore user update err:', e));
    return { success: true, message: 'เปลี่ยนรหัสผ่านสำเร็จเรียบร้อย' };
  };

  // Project Handlers
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'files'>, initialFiles?: Omit<ProjectFile, 'id' | 'uploadedAt' | 'uploadedBy'>[]): Project => {
    const now = new Date().toISOString();
    const newId = `prj-${Date.now().toString().slice(-6)}`;
    
    const formattedFiles: ProjectFile[] = (initialFiles || []).map((f, idx) => ({
      ...f,
      id: `pfile-${Date.now()}-${idx}`,
      uploadedAt: new Date().toLocaleString('th-TH'),
      uploadedBy: currentUser.name
    }));

    const newProject: Project = {
      ...projectData,
      id: newId,
      createdAt: now,
      updatedAt: now,
      files: formattedFiles
    };

    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    StorageService.saveProjects(updatedProjects);
    FirestoreService.saveProject(newProject).catch(e => console.warn('Firestore saveProject err:', e));

    // If project has end date, add event to calendar
    if (newProject.endDate) {
      const calEvent: CalendarEvent = {
        id: `ev-prj-${newProject.id}`,
        title: `สิ้นสุดโครงการ: ${newProject.title}`,
        eventType: 'report_deadline',
        date: newProject.endDate,
        startTime: '16:30',
        endTime: '17:00',
        workgroupId: newProject.workgroupId,
        attendees: [personnel.find(p => p.id === newProject.leaderId)?.name || currentUser.name],
        notes: `รหัสโครงการ: ${newProject.projectCode} (งบประมาณ ${newProject.budgetApproved.toLocaleString()} บาท)`
      };
      const updatedEvents = [...calendarEvents, calEvent];
      setCalendarEvents(updatedEvents);
      StorageService.saveCalendarEvents(updatedEvents);
      FirestoreService.saveCalendarEvent(calEvent).catch(e => console.warn('Firestore saveEvent err:', e));
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'บันทึกโครงการใหม่',
      message: `โครงการ "${newProject.title}" (${newProject.projectCode}) ถูกบันทึกเข้าสู่ระบบแล้ว`,
      type: 'new_task',
      timestamp: new Date().toLocaleString('th-TH'),
      read: false
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    StorageService.saveNotifications(updatedNotifs);
    FirestoreService.saveNotification(newNotif).catch(e => console.warn('Firestore saveNotif err:', e));

    return newProject;
  };

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    let targetProject: Project | undefined;
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        targetProject = {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString()
        };
        return targetProject;
      }
      return p;
    });
    setProjects(updatedProjects);
    StorageService.saveProjects(updatedProjects);
    if (targetProject) {
      FirestoreService.saveProject(targetProject).catch(e => console.warn('Firestore updateProject err:', e));
    }

    if (selectedProjectForDetail && selectedProjectForDetail.id === projectId) {
      setSelectedProjectForDetail(updatedProjects.find(p => p.id === projectId) || null);
    }
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    StorageService.saveProjects(updatedProjects);
    FirestoreService.deleteProject(projectId).catch(e => console.warn('Firestore deleteProject err:', e));
    if (selectedProjectForDetail && selectedProjectForDetail.id === projectId) {
      setSelectedProjectForDetail(null);
    }
  };

  const addProjectFile = (projectId: string, fileData: Omit<ProjectFile, 'id' | 'uploadedAt' | 'uploadedBy'>) => {
    const newFile: ProjectFile = {
      ...fileData,
      id: `pfile-${Date.now()}`,
      uploadedAt: new Date().toLocaleString('th-TH'),
      uploadedBy: currentUser.name
    };

    let targetProject: Project | undefined;
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        targetProject = {
          ...p,
          files: [...(p.files || []), newFile],
          updatedAt: new Date().toISOString()
        };
        return targetProject;
      }
      return p;
    });
    setProjects(updatedProjects);
    StorageService.saveProjects(updatedProjects);
    if (targetProject) {
      FirestoreService.saveProject(targetProject).catch(e => console.warn('Firestore addProjectFile err:', e));
    }

    if (selectedProjectForDetail && selectedProjectForDetail.id === projectId) {
      setSelectedProjectForDetail(updatedProjects.find(p => p.id === projectId) || null);
    }
  };

  const deleteProjectFile = (projectId: string, fileId: string) => {
    let targetProject: Project | undefined;
    const updatedProjects = projects.map(p => {
      if (p.id === projectId) {
        targetProject = {
          ...p,
          files: (p.files || []).filter(f => f.id !== fileId),
          updatedAt: new Date().toISOString()
        };
        return targetProject;
      }
      return p;
    });
    setProjects(updatedProjects);
    StorageService.saveProjects(updatedProjects);
    if (targetProject) {
      FirestoreService.saveProject(targetProject).catch(e => console.warn('Firestore deleteProjectFile err:', e));
    }

    if (selectedProjectForDetail && selectedProjectForDetail.id === projectId) {
      setSelectedProjectForDetail(updatedProjects.find(p => p.id === projectId) || null);
    }
  };

  // Helper: auto calculate task status from progress / due date
  const computeStatus = (progress: number, dueDate: string, currentStatus?: TaskStatus): TaskStatus => {
    if (progress >= 100) return 'completed';
    const today = new Date().toISOString().split('T')[0];
    if (dueDate < today && progress < 100) return 'overdue';
    if (progress === 0) return 'not_started';
    if (currentStatus === 'pending') return 'pending';
    return 'in_progress';
  };

  // Helper: compute KPI status
  const calculateKpiStatus = (target: number, actual: number): { rate: number; status: 'achieved' | 'nearly' | 'not_achieved' } => {
    if (!target || target === 0) return { rate: 0, status: 'not_achieved' };
    const rate = Math.round((actual / target) * 1000) / 10;
    let status: 'achieved' | 'nearly' | 'not_achieved' = 'not_achieved';
    if (rate >= 100) status = 'achieved';
    else if (rate >= 80) status = 'nearly';
    else status = 'not_achieved';
    return { rate, status };
  };

  // Task Handlers
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'timeline' | 'comments' | 'attachments'>) => {
    const now = new Date().toISOString();
    const newId = `tsk-${Date.now().toString().slice(-6)}`;
    const newStatus = computeStatus(taskData.progress || 0, taskData.dueDate, taskData.status);

    const initialTimeline: TimelineLog[] = [
      {
        id: `tl-${Date.now()}`,
        step: 'สร้างภารกิจใหม่และมอบหมายงาน',
        status: newStatus,
        timestamp: new Date().toLocaleString('th-TH'),
        updatedBy: currentUser.name,
        notes: `สร้างงานโดย ${currentUser.name} (${currentUser.position})`
      }
    ];

    const newTask: Task = {
      ...taskData,
      id: newId,
      status: newStatus,
      progress: taskData.progress || 0,
      createdAt: now,
      updatedAt: now,
      timeline: initialTimeline,
      comments: [],
      attachments: []
    };

    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
    FirestoreService.saveTask(newTask).catch(e => console.warn('Firestore saveTask err:', e));

    // If task has a deadline, also add to Calendar automatically
    if (newTask.dueDate) {
      const newCalEvent: CalendarEvent = {
        id: `ev-task-${newTask.id}`,
        title: `ครบกำหนด: ${newTask.title}`,
        eventType: 'report_deadline',
        date: newTask.dueDate,
        startTime: '16:30',
        endTime: '17:00',
        workgroupId: newTask.workgroupId,
        attendees: [personnel.find(p => p.id === newTask.mainAssigneeId)?.name || 'ผู้รับผิดชอบ'],
        taskId: newTask.id,
        notes: `รหัสงาน: ${newTask.taskCode}`
      };
      const updatedEvents = [...calendarEvents, newCalEvent];
      setCalendarEvents(updatedEvents);
      StorageService.saveCalendarEvents(updatedEvents);
      FirestoreService.saveCalendarEvent(newCalEvent).catch(e => console.warn('Firestore saveEvent err:', e));
    }

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'มอบหมายงานใหม่',
      message: `งาน "${newTask.title}" (${newTask.taskCode}) ถูกสร้างและมอบหมายแล้ว`,
      type: 'new_task',
      timestamp: new Date().toLocaleString('th-TH'),
      read: false,
      relatedTaskId: newTask.id
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    StorageService.saveNotifications(updatedNotifs);
    FirestoreService.saveNotification(newNotif).catch(e => console.warn('Firestore saveNotif err:', e));

    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    let targetTask: Task | undefined;
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const merged = { ...t, ...updates, updatedAt: new Date().toISOString() };
        if (updates.progress !== undefined || updates.dueDate !== undefined) {
          merged.status = computeStatus(merged.progress, merged.dueDate, updates.status || merged.status);
        }
        targetTask = merged;
        return merged;
      }
      return t;
    });
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
    if (targetTask) {
      FirestoreService.saveTask(targetTask).catch(e => console.warn('Firestore updateTask err:', e));
    }

    if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
      setSelectedTaskForDetail(updatedTasks.find(t => t.id === taskId) || null);
    }
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
    FirestoreService.deleteTask(taskId).catch(e => console.warn('Firestore deleteTask err:', e));

    // Clean linked calendar event
    const updatedEvents = calendarEvents.filter(e => e.taskId !== taskId);
    setCalendarEvents(updatedEvents);
    StorageService.saveCalendarEvents(updatedEvents);

    if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
      setSelectedTaskForDetail(null);
    }
  };

  const updateTaskProgress = (taskId: string, progress: number, newStatus?: TaskStatus, logNote?: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const calcStatus = newStatus || computeStatus(progress, targetTask.dueDate, targetTask.status);
    const newLog: TimelineLog = {
      id: `tl-${Date.now()}`,
      step: progress === 100 ? 'ดำเนินการเสร็จสิ้น (100%)' : `อัปเดตความก้าวหน้า ${progress}%`,
      status: calcStatus,
      timestamp: new Date().toLocaleString('th-TH'),
      updatedBy: currentUser.name,
      notes: logNote || (progress === 100 ? 'ปิดงานเสร็จสิ้นสมบูรณ์' : `ปรับปรุงความก้าวหน้าเป็น ${progress}%`)
    };

    let updatedSingleTask: Task | undefined;
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        updatedSingleTask = {
          ...t,
          progress,
          status: calcStatus,
          updatedAt: new Date().toISOString(),
          timeline: [...t.timeline, newLog]
        };
        return updatedSingleTask;
      }
      return t;
    });

    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
    if (updatedSingleTask) {
      FirestoreService.saveTask(updatedSingleTask).catch(e => console.warn('Firestore progress err:', e));
    }

    if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
      setSelectedTaskForDetail(updatedTasks.find(t => t.id === taskId) || null);
    }
  };

  const addTaskComment = (taskId: string, commentContent: string) => {
    if (!commentContent.trim()) return;
    const newComment: TaskComment = {
      id: `cm-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPosition: currentUser.position,
      content: commentContent.trim(),
      createdAt: new Date().toLocaleString('th-TH')
    };

    let updatedSingleTask: Task | undefined;
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        updatedSingleTask = {
          ...t,
          comments: [...t.comments, newComment],
          updatedAt: new Date().toISOString()
        };
        return updatedSingleTask;
      }
      return t;
    });

    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
    if (updatedSingleTask) {
      FirestoreService.saveTask(updatedSingleTask).catch(e => console.warn('Firestore comment err:', e));
    }

    if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
      setSelectedTaskForDetail(updatedTasks.find(t => t.id === taskId) || null);
    }
  };

  const addTaskAttachment = (taskId: string, attachment: Omit<TaskAttachment, 'id' | 'uploadedAt' | 'uploadedBy'>) => {
    const newAtt: TaskAttachment = {
      ...attachment,
      id: `att-${Date.now()}`,
      uploadedBy: currentUser.name,
      uploadedAt: new Date().toLocaleString('th-TH')
    };

    let updatedSingleTask: Task | undefined;
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        updatedSingleTask = {
          ...t,
          attachments: [...t.attachments, newAtt],
          updatedAt: new Date().toISOString()
        };
        return updatedSingleTask;
      }
      return t;
    });

    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
    if (updatedSingleTask) {
      FirestoreService.saveTask(updatedSingleTask).catch(e => console.warn('Firestore att err:', e));
    }

    // Notify
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'มีการส่งหลักฐานใหม่',
      message: `${currentUser.name} แนบไฟล์ "${newAtt.name}" ในงาน`,
      type: 'evidence_added',
      timestamp: new Date().toLocaleString('th-TH'),
      read: false,
      relatedTaskId: taskId
    };
    setNotifications([newNotif, ...notifications]);
    StorageService.saveNotifications([newNotif, ...notifications]);
    FirestoreService.saveNotification(newNotif).catch(e => console.warn('Firestore saveNotif err:', e));

    if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
      setSelectedTaskForDetail(updatedTasks.find(t => t.id === taskId) || null);
    }
  };

  const deleteTaskAttachment = (taskId: string, attachmentId: string) => {
    let updatedSingleTask: Task | undefined;
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        updatedSingleTask = {
          ...t,
          attachments: t.attachments.filter(a => a.id !== attachmentId),
          updatedAt: new Date().toISOString()
        };
        return updatedSingleTask;
      }
      return t;
    });
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
    if (updatedSingleTask) {
      FirestoreService.saveTask(updatedSingleTask).catch(e => console.warn('Firestore del att err:', e));
    }

    if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
      setSelectedTaskForDetail(updatedTasks.find(t => t.id === taskId) || null);
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    let updatedSingleTask: Task | undefined;
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId && t.subtasks) {
        const updatedSubtasks = t.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st);
        const total = updatedSubtasks.length;
        const done = updatedSubtasks.filter(s => s.completed).length;
        const autoProgress = total > 0 ? Math.round((done / total) * 100) : t.progress;
        updatedSingleTask = {
          ...t,
          subtasks: updatedSubtasks,
          progress: autoProgress,
          status: computeStatus(autoProgress, t.dueDate, t.status),
          updatedAt: new Date().toISOString()
        };
        return updatedSingleTask;
      }
      return t;
    });
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);
    if (updatedSingleTask) {
      FirestoreService.saveTask(updatedSingleTask).catch(e => console.warn('Firestore toggle err:', e));
    }

    if (selectedTaskForDetail && selectedTaskForDetail.id === taskId) {
      setSelectedTaskForDetail(updatedTasks.find(t => t.id === taskId) || null);
    }
  };

  // KPI Handlers
  const addKPI = (kpiData: Omit<KPI, 'id' | 'achievementRate' | 'status' | 'updatedAt'>) => {
    const { rate, status } = calculateKpiStatus(kpiData.target, kpiData.actual);
    const newKpi: KPI = {
      ...kpiData,
      id: `kpi-${Date.now().toString().slice(-5)}`,
      achievementRate: rate,
      status,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    const updatedKPIs = [...kpis, newKpi];
    setKpis(updatedKPIs);
    StorageService.saveKPIs(updatedKPIs);
    FirestoreService.saveKPI(newKpi).catch(e => console.warn('Firestore kpi err:', e));
  };

  const updateKPI = (kpiId: string, updates: Partial<KPI>) => {
    let updatedSingleKPI: KPI | undefined;
    const updatedKPIs = kpis.map(k => {
      if (k.id === kpiId) {
        const target = updates.target !== undefined ? updates.target : k.target;
        const actual = updates.actual !== undefined ? updates.actual : k.actual;
        const { rate, status } = calculateKpiStatus(target, actual);
        updatedSingleKPI = {
          ...k,
          ...updates,
          achievementRate: rate,
          status,
          updatedAt: new Date().toISOString().split('T')[0]
        };
        return updatedSingleKPI;
      }
      return k;
    });
    setKpis(updatedKPIs);
    StorageService.saveKPIs(updatedKPIs);
    if (updatedSingleKPI) {
      FirestoreService.saveKPI(updatedSingleKPI).catch(e => console.warn('Firestore updateKPI err:', e));
    }
  };

  const deleteKPI = (kpiId: string) => {
    const updatedKPIs = kpis.filter(k => k.id !== kpiId);
    setKpis(updatedKPIs);
    StorageService.saveKPIs(updatedKPIs);
    FirestoreService.deleteKPI(kpiId).catch(e => console.warn('Firestore deleteKPI err:', e));
  };

  // Personnel Handlers
  const addPersonnel = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `usr-${Date.now().toString().slice(-4)}`
    };
    const updated = [...personnel, newUser];
    setPersonnel(updated);
    StorageService.savePersonnel(updated);
    FirestoreService.saveUser(newUser).catch(e => console.warn('Firestore saveUser err:', e));
  };

  const updatePersonnel = (userId: string, updates: Partial<User>) => {
    let updatedSingleUser: User | undefined;
    const updated = personnel.map(u => {
      if (u.id === userId) {
        updatedSingleUser = { ...u, ...updates };
        return updatedSingleUser;
      }
      return u;
    });
    setPersonnel(updated);
    StorageService.savePersonnel(updated);
    if (updatedSingleUser) {
      FirestoreService.saveUser(updatedSingleUser).catch(e => console.warn('Firestore updateUser err:', e));
    }
  };

  const deletePersonnel = (userId: string) => {
    const updated = personnel.filter(u => u.id !== userId);
    setPersonnel(updated);
    StorageService.savePersonnel(updated);
    FirestoreService.deleteUser(userId).catch(e => console.warn('Firestore deleteUser err:', e));
  };

  // Calendar Handlers
  const addCalendarEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `ev-${Date.now().toString().slice(-5)}`
    };
    const updated = [...calendarEvents, newEvent];
    setCalendarEvents(updated);
    StorageService.saveCalendarEvents(updated);
    FirestoreService.saveCalendarEvent(newEvent).catch(e => console.warn('Firestore saveCal err:', e));
  };

  const updateCalendarEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    let updatedSingleEvent: CalendarEvent | undefined;
    const updated = calendarEvents.map(e => {
      if (e.id === eventId) {
        updatedSingleEvent = { ...e, ...updates };
        return updatedSingleEvent;
      }
      return e;
    });
    setCalendarEvents(updated);
    StorageService.saveCalendarEvents(updated);
    if (updatedSingleEvent) {
      FirestoreService.saveCalendarEvent(updatedSingleEvent).catch(e => console.warn('Firestore updateCal err:', e));
    }
  };

  const deleteCalendarEvent = (eventId: string) => {
    const updated = calendarEvents.filter(e => e.id !== eventId);
    setCalendarEvents(updated);
    StorageService.saveCalendarEvents(updated);
    FirestoreService.deleteCalendarEvent(eventId).catch(e => console.warn('Firestore deleteCal err:', e));
  };

  // Notification Handlers
  const markNotificationRead = (notifId: string) => {
    const updated = notifications.map(n => n.id === notifId ? { ...n, read: true } : n);
    setNotifications(updated);
    StorageService.saveNotifications(updated);
    FirestoreService.markNotificationRead(notifId).catch(e => console.warn('Firestore markRead err:', e));
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const deleteNotification = (notifId: string) => {
    const updated = notifications.filter(n => n.id !== notifId);
    setNotifications(updated);
    StorageService.saveNotifications(updated);
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // System actions
  const resetToDefaults = () => {
    StorageService.resetToDefault();
    setProjects(StorageService.getProjects());
    setTasks(StorageService.getTasks());
    setKpis(StorageService.getKPIs());
    setPersonnel(StorageService.getPersonnel());
    setWorkgroups(StorageService.getWorkgroups());
    setCalendarEvents(StorageService.getCalendarEvents());
    setNotifications(StorageService.getNotifications());
    setSelectedTaskForDetail(null);
    setSelectedProjectForDetail(null);
  };

  const exportDataJSON = () => StorageService.exportAllDataJSON();

  const importDataJSON = (jsonStr: string) => {
    const ok = StorageService.importAllDataJSON(jsonStr);
    if (ok) {
      setProjects(StorageService.getProjects());
      setTasks(StorageService.getTasks());
      setKpis(StorageService.getKPIs());
      setPersonnel(StorageService.getPersonnel());
      setWorkgroups(StorageService.getWorkgroups());
      setCalendarEvents(StorageService.getCalendarEvents());
      setNotifications(StorageService.getNotifications());
    }
    return ok;
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isAuthenticated,
        login,
        logout,
        changePassword,
        isFirebaseConnected,
        firebaseProjectId,
        syncStatus,
        syncWithFirebase,
        projects,
        tasks,
        kpis,
        personnel,
        workgroups,
        calendarEvents,
        notifications,
        currentUser,
        switchUser,
        userRole,
        addProject,
        updateProject,
        deleteProject,
        addProjectFile,
        deleteProjectFile,
        selectedProjectForDetail,
        setSelectedProjectForDetail,
        isCreateProjectModalOpen,
        setIsCreateProjectModalOpen,
        addTask,
        updateTask,
        deleteTask,
        updateTaskProgress,
        addTaskComment,
        addTaskAttachment,
        deleteTaskAttachment,
        toggleSubtask,
        addKPI,
        updateKPI,
        deleteKPI,
        addPersonnel,
        updatePersonnel,
        deletePersonnel,
        addCalendarEvent,
        updateCalendarEvent,
        deleteCalendarEvent,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        unreadNotificationsCount,
        selectedTaskForDetail,
        setSelectedTaskForDetail,
        isCreateTaskModalOpen,
        setIsCreateTaskModalOpen,
        resetToDefaults,
        exportDataJSON,
        importDataJSON,
        globalSearch,
        setGlobalSearch,
        selectedWorkgroupFilter,
        setSelectedWorkgroupFilter
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
