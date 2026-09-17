import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Project, Task, KPI, User, Workgroup, CalendarEvent, NotificationItem } from '../types';
import { StorageService } from './storageService';
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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Clean undefined fields to prevent Firestore serialization errors
function cleanData<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj, (_, v) => (v === undefined ? null : v)));
}

export class FirestoreService {
  /**
   * Check if database structure and data are initialized.
   * If any collection is empty, populate it with local cached data or default seed data.
   */
  static async initializeDefaultDataIfNeeded(): Promise<boolean> {
    try {
      let anySeeded = false;

      // 1. Workgroups
      const workgroupSnap = await getDocs(collection(db, COLLECTIONS.WORKGROUPS));
      if (workgroupSnap.empty) {
        console.log('Seeding Workgroups to Firestore...');
        const localWg = StorageService.getWorkgroups();
        const wgToSeed = localWg.length > 0 ? localWg : initialWorkgroups;
        const batch = writeBatch(db);
        wgToSeed.forEach((wg) => {
          batch.set(doc(db, COLLECTIONS.WORKGROUPS, wg.id), cleanData(wg));
        });
        await batch.commit();
        anySeeded = true;
      }

      // 2. Personnel
      const personnelSnap = await getDocs(collection(db, COLLECTIONS.PERSONNEL));
      if (personnelSnap.empty) {
        console.log('Seeding Personnel to Firestore...');
        const localPersonnel = StorageService.getPersonnel();
        const personnelToSeed = localPersonnel.length > 0 ? localPersonnel : initialPersonnel;
        const batch = writeBatch(db);
        personnelToSeed.forEach((person) => {
          batch.set(doc(db, COLLECTIONS.PERSONNEL, person.id), cleanData(person));
        });
        await batch.commit();
        anySeeded = true;
      } else {
        const usr4Doc = personnelSnap.docs.find(d => d.id === 'usr-04');
        if (usr4Doc && usr4Doc.data()?.name === 'นายธนกฤต แสนสุข') {
          const freshUsr4 = initialPersonnel.find(p => p.id === 'usr-04');
          if (freshUsr4) {
            await setDoc(doc(db, COLLECTIONS.PERSONNEL, 'usr-04'), cleanData(freshUsr4), { merge: true });
          }
        }
      }

      // 3. Projects
      const projectSnap = await getDocs(collection(db, COLLECTIONS.PROJECTS));
      if (projectSnap.empty) {
        console.log('Seeding Projects to Firestore...');
        const localProjects = StorageService.getProjects();
        const projectsToSeed = localProjects.length > 0 ? localProjects : initialProjects;
        const batch = writeBatch(db);
        projectsToSeed.forEach((project) => {
          batch.set(doc(db, COLLECTIONS.PROJECTS, project.id), cleanData(project));
        });
        await batch.commit();
        anySeeded = true;
      }

      // 4. Tasks
      const taskSnap = await getDocs(collection(db, COLLECTIONS.TASKS));
      if (taskSnap.empty) {
        console.log('Seeding Tasks to Firestore...');
        const localTasks = StorageService.getTasks();
        const tasksToSeed = localTasks.length > 0 ? localTasks : initialTasks;
        const batch = writeBatch(db);
        tasksToSeed.forEach((task) => {
          batch.set(doc(db, COLLECTIONS.TASKS, task.id), cleanData(task));
        });
        await batch.commit();
        anySeeded = true;
      }

      // 5. KPIs
      const kpiSnap = await getDocs(collection(db, COLLECTIONS.KPIS));
      if (kpiSnap.empty) {
        console.log('Seeding KPIs to Firestore...');
        const localKpis = StorageService.getKPIs();
        const kpisToSeed = localKpis.length > 0 ? localKpis : initialKPIs;
        const batch = writeBatch(db);
        kpisToSeed.forEach((kpi) => {
          batch.set(doc(db, COLLECTIONS.KPIS, kpi.id), cleanData(kpi));
        });
        await batch.commit();
        anySeeded = true;
      }

      // 6. Calendar Events
      const calSnap = await getDocs(collection(db, COLLECTIONS.CALENDAR_EVENTS));
      if (calSnap.empty) {
        console.log('Seeding Calendar Events to Firestore...');
        const localCal = StorageService.getCalendarEvents();
        const calToSeed = localCal.length > 0 ? localCal : initialCalendarEvents;
        const batch = writeBatch(db);
        calToSeed.forEach((event) => {
          batch.set(doc(db, COLLECTIONS.CALENDAR_EVENTS, event.id), cleanData(event));
        });
        await batch.commit();
        anySeeded = true;
      }

      // 7. Notifications
      const notifSnap = await getDocs(collection(db, COLLECTIONS.NOTIFICATIONS));
      if (notifSnap.empty) {
        console.log('Seeding Notifications to Firestore...');
        const localNotifs = StorageService.getNotifications();
        const notifsToSeed = localNotifs.length > 0 ? localNotifs : initialNotifications;
        const batch = writeBatch(db);
        notifsToSeed.forEach((notif) => {
          batch.set(doc(db, COLLECTIONS.NOTIFICATIONS, notif.id), cleanData(notif));
        });
        await batch.commit();
        anySeeded = true;
      }

      console.log('Firestore initialization check completed. Seeded new:', anySeeded);
      return anySeeded;
    } catch (error) {
      console.error('Error initializing Firestore data:', error);
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
        batch.set(ref, cleanData(wg));
      });
      initialPersonnel.forEach((person) => {
        const ref = doc(db, COLLECTIONS.PERSONNEL, person.id);
        batch.set(ref, cleanData(person));
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
    return onSnapshot(
      collection(db, COLLECTIONS.PROJECTS),
      (snapshot) => {
        const data = snapshot.docs.map((d) => d.data() as Project);
        data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        onUpdate(data);
      },
      (err) => {
        console.error('Error listening to projects:', err);
      }
    );
  }

  static subscribeToTasks(onUpdate: (tasks: Task[]) => void) {
    return onSnapshot(
      collection(db, COLLECTIONS.TASKS),
      (snapshot) => {
        const data = snapshot.docs.map((d) => d.data() as Task);
        data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        onUpdate(data);
      },
      (err) => {
        console.error('Error listening to tasks:', err);
      }
    );
  }

  static subscribeToKPIs(onUpdate: (kpis: KPI[]) => void) {
    return onSnapshot(
      collection(db, COLLECTIONS.KPIS),
      (snapshot) => {
        const data = snapshot.docs.map((d) => d.data() as KPI);
        data.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
        onUpdate(data);
      },
      (err) => {
        console.error('Error listening to KPIs:', err);
      }
    );
  }

  static subscribeToPersonnel(onUpdate: (personnel: User[]) => void) {
    return onSnapshot(
      collection(db, COLLECTIONS.PERSONNEL),
      (snapshot) => {
        const data = snapshot.docs.map((d) => d.data() as User);
        data.sort((a, b) => (a.id || '').localeCompare(b.id || ''));
        onUpdate(data);
      },
      (err) => {
        console.error('Error listening to personnel:', err);
      }
    );
  }

  static subscribeToWorkgroups(onUpdate: (workgroups: Workgroup[]) => void) {
    return onSnapshot(
      collection(db, COLLECTIONS.WORKGROUPS),
      (snapshot) => {
        const data = snapshot.docs.map((d) => d.data() as Workgroup);
        data.sort((a, b) => (a.id || '').localeCompare(b.id || ''));
        onUpdate(data);
      },
      (err) => {
        console.error('Error listening to workgroups:', err);
      }
    );
  }

  static subscribeToCalendarEvents(onUpdate: (events: CalendarEvent[]) => void) {
    return onSnapshot(
      collection(db, COLLECTIONS.CALENDAR_EVENTS),
      (snapshot) => {
        const data = snapshot.docs.map((d) => d.data() as CalendarEvent);
        data.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
        onUpdate(data);
      },
      (err) => {
        console.error('Error listening to calendar events:', err);
      }
    );
  }

  static subscribeToNotifications(onUpdate: (notifs: NotificationItem[]) => void) {
    return onSnapshot(
      collection(db, COLLECTIONS.NOTIFICATIONS),
      (snapshot) => {
        const data = snapshot.docs.map((d) => d.data() as NotificationItem);
        data.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
        onUpdate(data);
      },
      (err) => {
        console.error('Error listening to notifications:', err);
      }
    );
  }

  // --- Projects CRUD ---
  static async saveProject(project: Project): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.PROJECTS, project.id), cleanData(project));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.PROJECTS}/${project.id}`);
    }
  }

  static async deleteProject(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.PROJECTS}/${id}`);
    }
  }

  // --- Tasks CRUD ---
  static async saveTask(task: Task): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.TASKS, task.id), cleanData(task));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.TASKS}/${task.id}`);
    }
  }

  static async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.TASKS, id), cleanData(updates));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.TASKS}/${id}`);
    }
  }

  static async deleteTask(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.TASKS, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.TASKS}/${id}`);
    }
  }

  // --- KPIs CRUD ---
  static async saveKPI(kpi: KPI): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.KPIS, kpi.id), cleanData(kpi));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.KPIS}/${kpi.id}`);
    }
  }

  static async updateKPI(id: string, updates: Partial<KPI>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.KPIS, id), cleanData(updates));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.KPIS}/${id}`);
    }
  }

  static async deleteKPI(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.KPIS, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.KPIS}/${id}`);
    }
  }

  // --- Personnel CRUD ---
  static async saveUser(user: User): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.PERSONNEL, user.id), cleanData(user));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.PERSONNEL}/${user.id}`);
    }
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.PERSONNEL, id), cleanData(updates));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.PERSONNEL}/${id}`);
    }
  }

  static async deleteUser(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PERSONNEL, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.PERSONNEL}/${id}`);
    }
  }

  // --- Workgroups CRUD ---
  static async saveWorkgroup(workgroup: Workgroup): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.WORKGROUPS, workgroup.id), cleanData(workgroup));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.WORKGROUPS}/${workgroup.id}`);
    }
  }

  static async updateWorkgroup(id: string, updates: Partial<Workgroup>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.WORKGROUPS, id), cleanData(updates));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.WORKGROUPS}/${id}`);
    }
  }

  static async deleteWorkgroup(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.WORKGROUPS, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.WORKGROUPS}/${id}`);
    }
  }

  // --- Calendar Events CRUD ---
  static async saveCalendarEvent(event: CalendarEvent): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.CALENDAR_EVENTS, event.id), cleanData(event));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.CALENDAR_EVENTS}/${event.id}`);
    }
  }

  static async deleteCalendarEvent(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CALENDAR_EVENTS, id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.CALENDAR_EVENTS}/${id}`);
    }
  }

  // --- Notifications CRUD ---
  static async saveNotification(notification: NotificationItem): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notification.id), cleanData(notification));
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.NOTIFICATIONS}/${notification.id}`);
    }
  }

  static async markNotificationRead(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, id), { read: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.NOTIFICATIONS}/${id}`);
    }
  }

  static async clearAllNotifications(): Promise<void> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.NOTIFICATIONS));
      const batch = writeBatch(db);
      snap.forEach((docItem) => {
        batch.delete(docItem.ref);
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTIONS.NOTIFICATIONS);
    }
  }
}

