import { Student, AcademicResult, AttendanceSession, Assignment } from '../types';

export interface SyncOutboxItem {
  id: string;
  type: 'STUDENT' | 'MARK' | 'ATTENDANCE' | 'ASSIGNMENT';
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: string;
}

export interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  pendingCount: number;
  serverDbModified: number;
}

type SyncListener = (state: SyncState) => void;
type DataChangeListener = () => void;

class CentralSyncService {
  private listeners: Set<SyncListener> = new Set();
  private dataChangeListeners: Set<DataChangeListener> = new Set();
  private pollInterval: any = null;
  private isSyncing = false;
  private lastServerModified = 0;
  private lastSyncedAt: Date | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.broadcastChannel = new BroadcastChannel('amani_cross_device_sync');
        this.broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'SYNC_COMPLETED' || event.data?.type === 'FORCE_REFRESH') {
            this.notifyDataChange();
          }
        };
      } catch (e) {
        // Fallback for browsers without BroadcastChannel support
      }

      window.addEventListener('online', () => {
        this.isOnline = true;
        this.notifyListeners();
        this.syncNow();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notifyListeners();
      });

      window.addEventListener('focus', () => {
        this.checkStatusAndSync();
      });

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.checkStatusAndSync();
        }
      });
    }
  }

  public init(intervalMs = 4000) {
    this.startAutoSync(intervalMs);
  }

  public startAutoSync(intervalMs = 4000) {
    if (this.pollInterval) return;

    // Run initial sync
    this.syncNow();

    // Poll status to catch updates made on other devices
    this.pollInterval = setInterval(() => {
      this.checkStatusAndSync();
    }, intervalMs);
  }

  public stopAutoSync() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  public onDataChange(listener: DataChangeListener): () => void {
    this.dataChangeListeners.add(listener);
    return () => this.dataChangeListeners.delete(listener);
  }

  private notifyListeners() {
    const state = this.getState();
    this.listeners.forEach((l) => {
      try {
        l(state);
      } catch (e) {
        console.error('Error in sync listener', e);
      }
    });
  }

  public notifyDataChange() {
    this.dataChangeListeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.error('Error in data change listener', e);
      }
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('amani:data-synchronized'));
    }
  }

  public getState(): SyncState {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      lastSyncedAt: this.lastSyncedAt,
      pendingCount: this.getOutbox().length,
      serverDbModified: this.lastServerModified,
    };
  }

  public getOutbox(): SyncOutboxItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('amani_sync_outbox');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveOutbox(items: SyncOutboxItem[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('amani_sync_outbox', JSON.stringify(items));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save sync outbox', e);
    }
  }

  public queueOutboxItem(item: Omit<SyncOutboxItem, 'id' | 'timestamp'>) {
    const outbox = this.getOutbox();
    const newItem: SyncOutboxItem = {
      ...item,
      id: `out-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    outbox.push(newItem);
    this.saveOutbox(outbox);

    // If online, immediately try to sync outbox
    if (this.isOnline) {
      this.syncNow();
    }
  }

  public async checkStatusAndSync(): Promise<void> {
    if (this.isSyncing) return;
    try {
      const res = await fetch('/api/sync/status', {
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) return;
      const data = await res.json();
      this.isOnline = true;

      const serverLastModified = Number(data.dbLastModified) || 0;
      const localOutbox = this.getOutbox();

      // If server has newer data or we have outbox items to push, trigger sync
      if (serverLastModified > this.lastServerModified || localOutbox.length > 0) {
        await this.syncNow();
      }
    } catch {
      // Network failure / offline
      this.isOnline = false;
      this.notifyListeners();
    }
  }

  public async syncNow(): Promise<boolean> {
    if (this.isSyncing) return false;
    this.isSyncing = true;
    this.notifyListeners();

    try {
      // 1. First, check if there are locally registered students in localStorage that were never synced
      const outbox = this.getOutbox();
      const localStudentsRaw = localStorage.getItem('amani_students');
      let localStudents: Student[] = [];
      if (localStudentsRaw) {
        try {
          localStudents = JSON.parse(localStudentsRaw);
        } catch {}
      }

      // Collect any students that might have been saved in local state while offline
      const pushStudents: Student[] = [];
      const pushMarks: AcademicResult[] = [];
      const pushAttendance: AttendanceSession[] = [];
      const pushAssignments: Assignment[] = [];

      for (const item of outbox) {
        if (item.type === 'STUDENT' && item.payload) pushStudents.push(item.payload);
        if (item.type === 'MARK' && item.payload) {
          if (Array.isArray(item.payload)) pushMarks.push(...item.payload);
          else pushMarks.push(item.payload);
        }
        if (item.type === 'ATTENDANCE' && item.payload) pushAttendance.push(item.payload);
        if (item.type === 'ASSIGNMENT' && item.payload) pushAssignments.push(item.payload);
      }

      // 2. Perform bidirectional sync with central server
      const syncPayload = {
        clientTimestamp: new Date().toISOString(),
        students: pushStudents,
        marks: pushMarks,
        attendance: pushAttendance,
        assignments: pushAssignments,
      };

      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncPayload),
      });

      if (res.ok) {
        const result = await res.json();
        this.isOnline = true;
        this.lastServerModified = Number(result.serverTimestamp) || Date.now();
        this.lastSyncedAt = new Date();

        // Update local storage caches with canonical data from the central database
        if (result.students && Array.isArray(result.students)) {
          localStorage.setItem('amani_students', JSON.stringify(result.students));
        }
        if (result.marks && Array.isArray(result.marks)) {
          localStorage.setItem('amani_marks', JSON.stringify(result.marks));
        }
        if (result.attendance && Array.isArray(result.attendance)) {
          localStorage.setItem('amani_attendance', JSON.stringify(result.attendance));
        }
        if (result.assignments && Array.isArray(result.assignments)) {
          localStorage.setItem('amani_assignments', JSON.stringify(result.assignments));
        }

        // Clear flushed outbox
        this.saveOutbox([]);

        // Notify broadcast channel for other tabs on this device
        try {
          this.broadcastChannel?.postMessage({
            type: 'SYNC_COMPLETED',
            timestamp: this.lastServerModified,
          });
        } catch {}

        this.notifyDataChange();
        return true;
      } else {
        // Fallback: pull directly if push had an issue
        const pullRes = await fetch('/api/sync/pull');
        if (pullRes.ok) {
          const pullData = await pullRes.json();
          this.isOnline = true;
          this.lastServerModified = Number(pullData.dbLastModified) || Date.now();
          this.lastSyncedAt = new Date();

          if (pullData.students) localStorage.setItem('amani_students', JSON.stringify(pullData.students));
          if (pullData.marks) localStorage.setItem('amani_marks', JSON.stringify(pullData.marks));
          if (pullData.attendance) localStorage.setItem('amani_attendance', JSON.stringify(pullData.attendance));
          if (pullData.assignments) localStorage.setItem('amani_assignments', JSON.stringify(pullData.assignments));

          this.notifyDataChange();
          return true;
        }
      }
    } catch (err) {
      console.warn('Sync attempt encountered offline or network error:', err);
      this.isOnline = false;
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }

    return false;
  }
}

export const syncService = new CentralSyncService();
