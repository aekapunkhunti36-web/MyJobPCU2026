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
   * Check if database structure is initialized (workgroups & personnel), if not initialize master data
   */
  static async initializeDefaultDataIfNeeded(): Promise<boolean> {
    try {
      const workgroupSnap = await getDocs(collection(db, COLLECTIONS.WORKGROUPS));
      if (!workgroupSnap.empty) {
        console.log('Firestore already contains hospital structure.');
        return false;
      }

      console.log('Initializing hospital structure in Firestore...');
      const batch = writeBatch(db);

      // Seed 13 Workgroups
      initialWorkgroups.forEach((wg) => {
        const ref = doc(db, COLLECTIONS.WORKGROUPS, wg.id);
        batch.set(ref, wg);
      });

      // Seed 12 Personnel accounts
      initialPersonnel.forEach((person) => {
        const ref = doc(db, COLLECTIONS.PERSONNEL, person.id);
        batch.set(ref, person);
      });

      await batch.commit();
      console.log('Firestore hospital structure successfully initialized.');
      return true;
    } catch (error) {
      console.error('Error initializing Firestore master structure:', error);
      return false;
    }
  }

  /**
   * Clear all operational sample data from Firestore (projects, tasks, KPIs, calendar, notifications)
   */
  static async clearOperationalFirestoreData(): Promise<void> {
    try {
      const collectionsToClear = [
        COLLECTIONS.PROJECTS,
        COLLECTIONS.TASKS,
        COLLECTIONS.KPIS,
        COLLECTIONS.CALENDAR_EVENTS,
        COLLECTIONS.NOTIFICATIONS
      ];

      for (const collName of collectionsToClear) {
        const snap = await getDocs(collection(db, collName));
        if (!snap.empty) {
          const batch = writeBatch(db);
          snap.forEach((docItem) => {
            batch.delete(docItem.ref);
          });
          await batch.commit();
        }
      }
      console.log('Successfully cleared all operational data from Firestore.');
    } catch (error) {
      console.error('Error clearing operational Firestore data:', error);
      throw error;
    }
  }

  /**
   * Complete reset: clear all collections and re-initialize clean 13 workgroups & 12 personnel
   */
  static async resetAllFirestoreData(): Promise<void> {
    try {
      const allCollections = [
        COLLECTIONS.PROJECTS,
        COLLECTIONS.TASKS,
        COLLECTIONS.KPIS,
        COLLECTIONS.CALENDAR_EVENTS,
        COLLECTIONS.NOTIFICATIONS,
        COLLECTIONS.WORKGROUPS,
        COLLECTIONS.PERSONNEL
      ];

      for (const collName of allCollections) {
        const snap = await getDocs(collection(db, collName));
        if (!snap.empty) {
          const batch = writeBatch(db);
          snap.forEach((docItem) => {
            batch.delete(docItem.ref);
          });
          await batch.commit();
        }
      }

      // Re-initialize master workgroups & personnel
      const batch = writeBatch(db);
      initialWorkgroups.forEach((wg) => {
        const ref = doc(db, COLLECTIONS.WORKGROUPS, wg.id);
        batch.set(ref, wg);
      });
      initialPersonnel.forEach((person) => {
        const ref = doc(db, COLLECTIONS.PERSONNEL, person.id);
        batch.set(ref, person);
      });
      await batch.commit();
      console.log('Successfully reset all Firestore collections to clean state.');
    } catch (error) {
      console.error('Error resetting Firestore collections:', error);
      throw error;
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

  // --- Workgroups CRUD ---
  static async saveWorkgroup(workgroup: Workgroup): Promise<void> {
    await setDoc(doc(db, COLLECTIONS.WORKGROUPS, workgroup.id), workgroup);
  }

  static async updateWorkgroup(id: string, updates: Partial<Workgroup>): Promise<void> {
    await updateDoc(doc(db, COLLECTIONS.WORKGROUPS, id), updates);
  }

  static async deleteWorkgroup(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.WORKGROUPS, id));
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
