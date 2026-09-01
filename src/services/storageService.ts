import { Task, KPI, User, Workgroup, CalendarEvent, NotificationItem, Project } from '../types';
import { initialTasks, initialKPIs, initialPersonnel, initialWorkgroups, initialCalendarEvents, initialNotifications, initialProjects } from '../data/seedData';

const STORAGE_KEYS = {
  TASKS: 'phonnahospital_tasks_v1',
  KPIS: 'phonnahospital_kpis_v1',
  PERSONNEL: 'phonnahospital_personnel_v1',
  WORKGROUPS: 'phonnahospital_workgroups_v1',
  CALENDAR: 'phonnahospital_calendar_v1',
  NOTIFICATIONS: 'phonnahospital_notifications_v1',
  PROJECTS: 'phonnahospital_projects_v1',
  CURRENT_USER_ID: 'phonnahospital_current_user_v1',
  AUTH_SESSION: 'phonnahospital_auth_session_v1',
  REMEMBER_USER: 'phonnahospital_remember_user_v1',
  FIREBASE_CONFIG: 'phonnahospital_firebase_config_v1'
};

export class StorageService {
  // Load tasks
  static getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    this.saveTasks(initialTasks);
    return initialTasks;
  }

  static saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }

  // Load KPIs
  static getKPIs(): KPI[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.KPIS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load KPIs from localStorage', e);
    }
    this.saveKPIs(initialKPIs);
    return initialKPIs;
  }

  static saveKPIs(kpis: KPI[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.KPIS, JSON.stringify(kpis));
    } catch (e) {
      console.error('Failed to save KPIs to localStorage', e);
    }
  }

  // Load Personnel
  static getPersonnel(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PERSONNEL);
      if (data) {
        const parsed: User[] = JSON.parse(data);
        // Ensure username and password exist on legacy stored users
        const updated = parsed.map(user => {
          const defaultUser = initialPersonnel.find(u => u.id === user.id);
          return {
            ...user,
            username: user.username || defaultUser?.username || user.email.split('@')[0] || user.id,
            password: user.password || defaultUser?.password || 'password123'
          };
        });
        return updated;
      }
    } catch (e) {
      console.error('Failed to load personnel from localStorage', e);
    }
    this.savePersonnel(initialPersonnel);
    return initialPersonnel;
  }

  static savePersonnel(users: User[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PERSONNEL, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save personnel to localStorage', e);
    }
  }

  // Load Workgroups
  static getWorkgroups(): Workgroup[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WORKGROUPS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load workgroups from localStorage', e);
    }
    this.saveWorkgroups(initialWorkgroups);
    return initialWorkgroups;
  }

  static saveWorkgroups(workgroups: Workgroup[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.WORKGROUPS, JSON.stringify(workgroups));
    } catch (e) {
      console.error('Failed to save workgroups to localStorage', e);
    }
  }

  // Load Calendar
  static getCalendarEvents(): CalendarEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CALENDAR);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load calendar events from localStorage', e);
    }
    this.saveCalendarEvents(initialCalendarEvents);
    return initialCalendarEvents;
  }

  static saveCalendarEvents(events: CalendarEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(events));
    } catch (e) {
      console.error('Failed to save calendar events to localStorage', e);
    }
  }

  // Load Notifications
  static getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load notifications from localStorage', e);
    }
    this.saveNotifications(initialNotifications);
    return initialNotifications;
  }

  static saveNotifications(notifs: NotificationItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    } catch (e) {
      console.error('Failed to save notifications to localStorage', e);
    }
  }

  // Load Projects
  static getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
    }
    this.saveProjects(initialProjects);
    return initialProjects;
  }

  static saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage', e);
    }
  }

  // Active user selection
  static getCurrentUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'usr-01'; // Default: Dr. Wisarut (Head)
  }

  static setCurrentUserId(userId: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  // Authentication Session
  static getAuthSession(): { isAuthenticated: boolean; userId: string | null; loginTime?: string } {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to parse auth session', e);
    }
    return { isAuthenticated: false, userId: null };
  }

  static saveAuthSession(session: { isAuthenticated: boolean; userId: string | null; loginTime?: string }): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
      if (session.userId) {
        this.setCurrentUserId(session.userId);
      }
    } catch (e) {
      console.error('Failed to save auth session', e);
    }
  }

  static clearAuthSession(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }

  static getRememberedUser(): string {
    return localStorage.getItem(STORAGE_KEYS.REMEMBER_USER) || '';
  }

  static setRememberedUser(username: string): void {
    if (username) {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_USER, username);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_USER);
    }
  }

  // Clear all operational sample data (projects, tasks, KPIs, calendar, notifications)
  static clearAllOperationalData(): void {
    this.saveProjects([]);
    this.saveTasks([]);
    this.saveKPIs([]);
    this.saveCalendarEvents([]);
    this.saveNotifications([]);
  }

  // Reset all to clean master schema
  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.KPIS);
    localStorage.removeItem(STORAGE_KEYS.PERSONNEL);
    localStorage.removeItem(STORAGE_KEYS.WORKGROUPS);
    localStorage.removeItem(STORAGE_KEYS.CALENDAR);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    this.saveProjects([]);
    this.saveTasks([]);
    this.saveKPIs([]);
    this.savePersonnel(initialPersonnel);
    this.saveWorkgroups(initialWorkgroups);
    this.saveCalendarEvents([]);
    this.saveNotifications([]);
  }

  // Export full JSON
  static exportAllDataJSON(): string {
    const payload = {
      hospital: 'โรงพยาบาลโพนนาแก้ว',
      system: 'ระบบบริหารงานกลุ่มงานบริการด้านปฐมภูมิและองค์รวม',
      exportedAt: new Date().toISOString(),
      projects: this.getProjects(),
      tasks: this.getTasks(),
      kpis: this.getKPIs(),
      personnel: this.getPersonnel(),
      workgroups: this.getWorkgroups(),
      calendarEvents: this.getCalendarEvents(),
      notifications: this.getNotifications()
    };
    return JSON.stringify(payload, null, 2);
  }

  // Import JSON
  static importAllDataJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (data.projects) this.saveProjects(data.projects);
      if (data.tasks) this.saveTasks(data.tasks);
      if (data.kpis) this.saveKPIs(data.kpis);
      if (data.personnel) this.savePersonnel(data.personnel);
      if (data.workgroups) this.saveWorkgroups(data.workgroups);
      if (data.calendarEvents) this.saveCalendarEvents(data.calendarEvents);
      if (data.notifications) this.saveNotifications(data.notifications);
      return true;
    } catch (e) {
      console.error('Failed to import JSON data', e);
      return false;
    }
  }

  // Firebase Firestore ready interface
  static getFirebaseConfig(): any {
    try {
      const config = localStorage.getItem(STORAGE_KEYS.FIREBASE_CONFIG);
      return config ? JSON.parse(config) : null;
    } catch {
      return null;
    }
  }

  static saveFirebaseConfig(config: any): void {
    localStorage.setItem(STORAGE_KEYS.FIREBASE_CONFIG, JSON.stringify(config));
  }
}
