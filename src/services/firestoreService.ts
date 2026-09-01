import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Project, Task, KPI, User, Workgroup, CalendarEvent, NotificationItem } from '../types';
import {
  initialWorkgroups,
  initialPersonnel,
  initialProjects,
  initialTasks,
  initialKPIs,
  initialCalendarEvents,
  initialNotifications
} from '../data/seedData';

// Firestore Collection Names
export const COLLECTIONS = {
  PROJECTS: 'projects',
  TASKS: 'tasks',
  KPIS: 'kpis',
  PERSONNEL: 'personnel',
  WORKGROUPS: 'workgroups',
  CALENDAR_EVENTS: 'calendar_events',
  NOTIFICATIONS: 'notifications'
} as const;

export class FirestoreService {
  /**
   * Check if database is seeded, if not seed initial hospital data in batch
   */
  static async initializeDefaultDataIfNeeded(): Promise<boolean> {
    try {
      const workgroupSnap = await getDocs(collection(db, COLLECTIONS.WORKGROUPS));
      if (!workgroupSnap.empty) {
        console.log('Firestore already contains hospital data.');
        return false;
      }

      console.log('Seeding initial hospital data into Firestore...');
      const batch = writeBatch(db);

      // Seed Workgroups
      initialWorkgroups.forEach((wg) => {
        const ref = doc(db, COLLECTIONS.WORKGROUPS, wg.id);
        batch.set(ref, wg);
      });

      // Seed Personnel
      initialPersonnel.forEach((person) => {
        const ref = doc(db, COLLECTIONS.PERSONNEL, person.id);
        batch.set(ref, person);
      });

      // Seed Projects
      initialProjects.forEach((proj) => {
        const ref = doc(db, COLLECTIONS.PROJECTS, proj.id);
        batch.set(ref, proj);
      });

      // Seed Tasks
      initialTasks.forEach((task) => {
        const ref = doc(db, COLLECTIONS.TASKS, task.id);
        batch.set(ref, task);
      });

      // Seed KPIs
      initialKPIs.forEach((kpi) => {
        const ref = doc(db, COLLECTIONS.KPIS, kpi.id);
        batch.set(ref, kpi);
      });

      // Seed Calendar Events
      initialCalendarEvents.forEach((ev) => {
        const ref = doc(db, COLLECTIONS.CALENDAR_EVENTS, ev.id);
        batch.set(ref, ev);
      });

      // Seed Notifications
      initialNotifications.forEach((notif) => {
        const ref = doc(db, COLLECTIONS.NOTIFICATIONS, notif.id);
        batch.set(ref, notif);
      });

      await batch.commit();
      console.log('Firestore seed data successfully committed.');
      return true;
    } catch (error) {
      console.error('Error seeding Firestore default data:', error);
      return false;
    }
  }

  // --- Real-time Subscriptions ---
  static subscribeToProjects(onUpdate: (projects: Project[]) => void) {
    return onSnapshot(collection(db, COLLECTIONS.PROJECTS), (snapshot) => {
      const data = snapshot.docs.map((d) => d.data() as Project);
      onUpdate(data);
    }, (err) => console.error('Error listening to projects:', err));
  }

  static subscribeToTasks(onUpdate: (tasks: Task[]) => void) {
    return onSnapshot(collection(db, COLLECTIONS.TASKS), (snapshot) => {
      const data = snapshot.docs.map((d) => d.data() as Task);
      onUpdate(data);
    }, (err) => console.error('Error listening to tasks:', err));
  }

  static subscribeToKPIs(onUpdate: (kpis: KPI[]) => void) {
    return onSnapshot(collection(db, COLLECTIONS.KPIS), (snapshot) => {
      const data = snapshot.docs.map((d) => d.data() as KPI);
      onUpdate(data);
    }, (err) => console.error('Error listening to KPIs:', err));
  }

  static subscribeToPersonnel(onUpdate: (personnel: User[]) => void) {
    return onSnapshot(collection(db, COLLECTIONS.PERSONNEL), (snapshot) => {
      const data = snapshot.docs.map((d) => d.data() as User);
      onUpdate(data);
    }, (err) => console.error('Error listening to personnel:', err));
  }

  static subscribeToWorkgroups(onUpdate: (workgroups: Workgroup[]) => void) {
    return onSnapshot(collection(db, COLLECTIONS.WORKGROUPS), (snapshot) => {
      const data = snapshot.docs.map((d) => d.data() as Workgroup);
      onUpdate(data);
    }, (err) => console.error('Error listening to workgroups:', err));
  }

  static subscribeToCalendarEvents(onUpdate: (events: CalendarEvent[]) => void) {
    return onSnapshot(collection(db, COLLECTIONS.CALENDAR_EVENTS), (snapshot) => {
      const data = snapshot.docs.map((d) => d.data() as CalendarEvent);
      onUpdate(data);
    }, (err) => console.error('Error listening to calendar events:', err));
  }

  static subscribeToNotifications(onUpdate: (notifs: NotificationItem[]) => void) {
    return onSnapshot(collection(db, COLLECTIONS.NOTIFICATIONS), (snapshot) => {
      const data = snapshot.docs.map((d) => d.data() as NotificationItem);
      onUpdate(data);
    }, (err) => console.error('Error listening to notifications:', err));
  }

  // --- Projects CRUD ---
  static async saveProject(project: Project): Promise<void> {
    await setDoc(doc(db, COLLECTIONS.PROJECTS, project.id), project);
  }

  static async deleteProject(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
  }

  // --- Tasks CRUD ---
  static async saveTask(task: Task): Promise<void> {
    await setDoc(doc(db, COLLECTIONS.TASKS, task.id), task);
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.TASKS, id), updates);
  }

  static async deleteTask(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.TASKS, id));
  }

  // --- KPIs CRUD ---
  static async saveKPI(kpi: KPI): Promise<void> {
    await setDoc(doc(db, COLLECTIONS.KPIS, kpi.id), kpi);
  }

  static async updateKPI(id: string, updates: Partial<KPI>): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.KPIS, id), updates);
  }

  static async deleteKPI(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.KPIS, id));
  }

  // --- Personnel CRUD ---
  static async saveUser(user: User): Promise<void> {
    await setDoc(doc(db, COLLECTIONS.PERSONNEL, user.id), user);
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.PERSONNEL, id), updates);
  }

  static async deleteUser(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.PERSONNEL, id));
  }

  // --- Calendar Events CRUD ---
  static async saveCalendarEvent(event: CalendarEvent): Promise<void> {
    await setDoc(doc(db, COLLECTIONS.CALENDAR_EVENTS, event.id), event);
  }

  static async deleteCalendarEvent(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.CALENDAR_EVENTS, id));
  }

  // --- Notifications CRUD ---
  static async saveNotification(notification: NotificationItem): Promise<void> {
    await setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notification.id), notification);
  }

  static async markNotificationRead(id: string): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), { read: true });
  }

  static async clearAllNotifications(): Promise<void> {
    const snap = await getDocs(collection(db, COLLECTIONS.NOTIFICATIONS));
    const batch = writeBatch(db);
    snap.forEach((docItem) => {
      batch.delete(docItem.ref);
    });
    await batch.commit();
  }
}
