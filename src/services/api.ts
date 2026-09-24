import {
  SchoolSettings,
  TeacherProfile,
  SchoolClass,
  Subject,
  Assignment,
  Enquiry,
  NotificationItem,
  AuditLog,
  User,
  Student,
  AcademicResult,
  ResultCorrectionRequest,
  AttendanceSession,
  TeacherStudentLink,
  GradingScaleItem,
  StudentReportCard,
  EnquiryCategory,
  EnquiryStatus,
} from '../types';
import { localDb } from './localDatabase';
import { syncService } from './syncService';
import { FeeStructureItem, initialFeeStructures } from '../data/feeStructuresData';
import {
  initialSchoolSettings,
  initialTeachers,
  initialClasses,
  initialSubjects,
  initialAnnouncements,
  initialEvents,
  initialGallery,
  initialDocuments,
  initialChatbotKnowledge,
} from '../data/schoolInitialData';

export interface SchoolDataPayload {
  settings: SchoolSettings;
  teachers: TeacherProfile[];
  classes: SchoolClass[];
  subjects: Subject[];
  announcements: any[];
  events: any[];
  gallery: any[];
  documents: any[];
  knowledgeBaseSummary: Array<{ id: string; category: string; question: string }>;
}

let apiServerStatus: 'UNKNOWN' | 'AVAILABLE' | 'UNAVAILABLE' = 'UNKNOWN';

export function isKnownStaticHost(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  return (
    host.includes('vercel.app') ||
    host.includes('netlify.app') ||
    host.includes('github.io') ||
    host.includes('pages.dev') ||
    host.includes('render.com') ||
    host.includes('firebaseapp.com') ||
    host.includes('web.app')
  );
}

export function isStaticHostOrUnavailable(): boolean {
  if (isKnownStaticHost()) return true;
  return apiServerStatus === 'UNAVAILABLE';
}

export function markApiUnavailable(): void {
  apiServerStatus = 'UNAVAILABLE';
}

export function markApiAvailable(): void {
  apiServerStatus = 'AVAILABLE';
}

async function callApiWithFallback<T>(
  url: string,
  options: RequestInit | undefined,
  fallbackFn: () => Promise<T> | T
): Promise<T> {
  // If we already know the environment is a static host or central API is offline, execute fallback directly
  if (isStaticHostOrUnavailable()) {
    return await fallbackFn();
  }

  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    // If server returned valid JSON
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        // If it's a 404 or 405 route on host (e.g. static host without serverless functions), fallback
        if (res.status === 404 || res.status === 405) {
          markApiUnavailable();
          return await fallbackFn();
        }
        throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
      }
      markApiAvailable();
      return data;
    }

    // If response was HTML (e.g. Vercel/Netlify SPA rewrite /* -> index.html) or other non-JSON
    markApiUnavailable();
    return await fallbackFn();
  } catch (err: any) {
    // If business error (e.g. validation, duplicate, unauthorized), preserve it
    if (
      err.message &&
      (err.message.includes('already exists') ||
        err.message.includes('already registered') ||
        err.message.includes('Invalid credentials') ||
        err.message.includes('Unauthorized') ||
        err.message.includes('Forbidden'))
    ) {
      throw err;
    }

    // If network error, connection refused, non-JSON response, or unexpected HTML token '<'
    markApiUnavailable();
    return await fallbackFn();
  }
}

export const api = {
  // Public school data
  async getSchoolData(): Promise<SchoolDataPayload> {
    return callApiWithFallback<SchoolDataPayload>('/api/school-data', undefined, () => ({
      settings: localDb.getSettings(),
      teachers: localDb.getAdminTeachers(),
      classes: initialClasses,
      subjects: initialSubjects,
      announcements: initialAnnouncements,
      events: initialEvents,
      gallery: initialGallery,
      documents: initialDocuments,
      knowledgeBaseSummary: initialChatbotKnowledge.map((k) => ({
        id: k.id,
        category: k.category,
        question: k.question,
      })),
    }));
  },

  // Settings
  async getSettings(): Promise<SchoolSettings> {
    return callApiWithFallback<SchoolSettings>('/api/settings', undefined, () => localDb.getSettings());
  },

  async updateSettings(updates: Partial<SchoolSettings>): Promise<{ success: boolean; settings: SchoolSettings }> {
    return callApiWithFallback<{ success: boolean; settings: SchoolSettings }>(
      '/api/settings',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      },
      () => localDb.updateSettings(updates)
    );
  },

  async updateGradingScale(payload: { gradingScale: GradingScaleItem[]; rankingEnabled?: boolean }) {
    return callApiWithFallback(
      '/api/settings/grading-scale',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.updateGradingScale(payload)
    );
  },

  // Authentication
  async login(payload: { identifier: string; password: string }) {
    if (isStaticHostOrUnavailable()) {
      return localDb.login(payload.identifier, payload.password);
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok) {
          markApiAvailable();
          return data;
        }
        // If server actively returned password rejected
        if (res.status === 401 && data.error && !data.error.includes('Not Found')) {
          try {
            return localDb.login(payload.identifier, payload.password);
          } catch {
            throw new Error(data.error);
          }
        }
      }
      // On static or serverless environments where /api/auth/login is not an Express server
      markApiUnavailable();
      return localDb.login(payload.identifier, payload.password);
    } catch {
      markApiUnavailable();
      return localDb.login(payload.identifier, payload.password);
    }
  },

  async forgotPasswordRequestOtp(payload: { identifier: string; method?: string }): Promise<{
    success: boolean;
    userId: string;
    message: string;
    devOtp?: string;
    dispatchedTo?: string;
  }> {
    return callApiWithFallback(
      '/api/auth/forgot-password/request-otp',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.forgotPasswordRequestOtp(payload)
    );
  },

  async forgotPasswordVerifyOtp(payload: { userId: string; otp: string; newPassword: string; confirmPassword?: string }): Promise<{
    success: boolean;
    message: string;
    username?: string;
  }> {
    return callApiWithFallback(
      '/api/auth/forgot-password/verify-otp',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.forgotPasswordVerifyOtp(payload)
    );
  },

  async changePassword(payload: { userId: string; newPassword: string; confirmPassword?: string }) {
    return callApiWithFallback(
      '/api/auth/change-password',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.changePassword(payload)
    );
  },

  async completeSecuritySetup(payload: {
    userId: string;
    username?: string;
    fullName: string;
    email: string;
    phone: string;
    newPassword: string;
    confirmPassword?: string;
    securityQuestion?: string;
    securityAnswer?: string;
  }) {
    return callApiWithFallback(
      '/api/auth/complete-security-setup',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.completeSecuritySetup(payload)
    );
  },

  // Central Student Database
  async getStudents(params?: { class?: string; grade?: string; search?: string; teacherId?: string }): Promise<Student[]> {
    const q = new URLSearchParams();
    if (params?.class) q.append('class', params.class);
    if (params?.grade) q.append('grade', params.grade);
    if (params?.search) q.append('search', params.search);
    if (params?.teacherId) q.append('teacherId', params.teacherId);
    const url = q.toString() ? `/api/students?${q.toString()}` : '/api/students';

    return callApiWithFallback<Student[]>(url, undefined, () => localDb.getStudents(params)).then((students) => {
      // Keep local cache warm and merged with all fresh data from server
      if (Array.isArray(students) && students.length > 0) {
        try {
          const current = localDb.getStudents();
          students.forEach((s) => {
            const idx = current.findIndex((cs) => cs.studentId === s.studentId || cs.id === s.id);
            if (idx >= 0) {
              current[idx] = s;
            } else {
              current.unshift(s);
            }
          });
          localStorage.setItem('amani_students', JSON.stringify(current));
        } catch {}
      }
      return students;
    });
  },

  async getStudent(idOrStudentId: string) {
    return callApiWithFallback(`/api/students/${encodeURIComponent(idOrStudentId)}`, undefined, () => {
      const student = localDb.getStudents().find((s) => s.id === idOrStudentId || s.studentId === idOrStudentId);
      if (!student) throw new Error('Student profile not found');
      return { student };
    });
  },

  async createStudent(payload: Partial<Student> & { confirmDuplicate?: boolean }) {
    // If on a static host (Vercel, Netlify, GitHub Pages) or central API is offline, execute directly in local DB
    if (isStaticHostOrUnavailable()) {
      const localRes = localDb.createStudent(payload);
      if (localRes.student) {
        syncService.notifyDataChange();
      }
      return localRes;
    }

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        markApiAvailable();
        if (data.student) {
          // Update local cache immediately
          const current = localDb.getStudents();
          const idx = current.findIndex((s) => s.studentId === data.student.studentId || s.id === data.student.id);
          if (idx >= 0) current[idx] = data.student;
          else current.unshift(data.student);
          localStorage.setItem('amani_students', JSON.stringify(current));
          syncService.notifyDataChange();
        }
        return data;
      }

      // If server returned a business/validation error in JSON (e.g. 400 Duplicate admission number)
      if (!res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        throw new Error(data.error || data.message || `Failed to register student (Status ${res.status})`);
      }

      // If response is HTML (e.g. Vercel/Netlify SPA rewrite /* -> index.html) or 404/405/non-JSON:
      markApiUnavailable();
      const localRes = localDb.createStudent(payload);
      if (localRes.student) {
        syncService.notifyDataChange();
      }
      return localRes;
    } catch (err: any) {
      // If it is a duplicate validation error or business error, rethrow so the user gets the clear prompt
      if (err.message && (err.message.includes('already exists') || err.message.includes('already registered'))) {
        throw err;
      }

      // If server is not responding, returned non-JSON, or on static hosting, fallback to local storage database
      markApiUnavailable();
      const localRes = localDb.createStudent(payload);
      if (localRes.student) {
        syncService.notifyDataChange();
      }
      return localRes;
    }
  },

  async updateStudent(id: string, updates: Partial<Student>) {
    if (isStaticHostOrUnavailable()) {
      const localRes = localDb.updateStudent(id, updates);
      syncService.notifyDataChange();
      return localRes;
    }

    try {
      const res = await fetch(`/api/students/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        markApiAvailable();
        if (data.student) {
          const current = localDb.getStudents();
          const idx = current.findIndex((s) => s.id === id || s.studentId === id);
          if (idx >= 0) current[idx] = data.student;
          localStorage.setItem('amani_students', JSON.stringify(current));
          syncService.notifyDataChange();
        }
        return data;
      }

      if (!res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        throw new Error(data.error || data.message || `Failed to update student`);
      }

      markApiUnavailable();
      const localRes = localDb.updateStudent(id, updates);
      syncService.notifyDataChange();
      return localRes;
    } catch (err: any) {
      if (err.message && (err.message.includes('already exists') || err.message.includes('already registered'))) {
        throw err;
      }
      markApiUnavailable();
      const localRes = localDb.updateStudent(id, updates);
      syncService.notifyDataChange();
      return localRes;
    }
  },

  async deleteStudent(id: string, teacherId?: string) {
    if (isStaticHostOrUnavailable()) {
      const localRes = localDb.deleteStudent(id);
      syncService.notifyDataChange();
      return localRes;
    }

    const url = teacherId
      ? `/api/students/${encodeURIComponent(id)}?teacherId=${encodeURIComponent(teacherId)}`
      : `/api/students/${encodeURIComponent(id)}`;

    try {
      const res = await fetch(url, { method: 'DELETE' });
      const contentType = res.headers.get('content-type') || '';

      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        markApiAvailable();
        const current = localDb.getStudents();
        const updated = current.filter((s) => s.id !== id && s.studentId !== id);
        localStorage.setItem('amani_students', JSON.stringify(updated));
        syncService.notifyDataChange();
        return data;
      }

      if (!res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to remove student');
      }

      markApiUnavailable();
      const localRes = localDb.deleteStudent(id);
      syncService.notifyDataChange();
      return localRes;
    } catch (err: any) {
      markApiUnavailable();
      const localRes = localDb.deleteStudent(id);
      syncService.notifyDataChange();
      return localRes;
    }
  },

  // Teacher Student Roster Linking
  async getTeacherStudents(classId: string, subjectId: string): Promise<{ links: TeacherStudentLink[]; students: Student[] }> {
    return callApiWithFallback<{ links: TeacherStudentLink[]; students: Student[] }>(
      `/api/teacher/classes/${classId}/subjects/${subjectId}/students`,
      undefined,
      () => localDb.getTeacherStudents(classId, subjectId)
    );
  },

  async linkStudentsToClass(payload: {
    teacherId?: string;
    teacherName?: string;
    classId: string;
    className: string;
    subjectId: string;
    subjectName: string;
    studentIds: string[];
  }) {
    return callApiWithFallback(
      '/api/teacher/classes/students',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.linkStudentsToClass(payload)
    );
  },

  // Teacher & Staff Management (Chief Admin)
  async getAdminTeachers(): Promise<Array<TeacherProfile & { username: string; isActive: boolean; mustChangePassword: boolean; lastLogin?: string }>> {
    return callApiWithFallback('/api/admin/teachers', undefined, () => localDb.getAdminTeachers());
  },

  async createAdminTeacher(payload: {
    fullName: string;
    staffId: string;
    phone: string;
    email?: string;
    department?: string;
    subjectSpecialization?: string;
    additionalSpecializations?: string[];
    assignedClasses?: string[];
    assignedSubjects?: string[];
    accountStatus?: 'ACTIVE' | 'DISABLED';
  }): Promise<{
    success: boolean;
    teacher: TeacherProfile;
    username: string;
    temporaryPassword: string;
    tempPassword: string;
  }> {
    return callApiWithFallback(
      '/api/admin/teachers',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.createAdminTeacher(payload)
    );
  },

  async updateTeacherStatus(id: string, status: 'ACTIVE' | 'DISABLED') {
    return callApiWithFallback(
      `/api/admin/teachers/${id}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      },
      () => localDb.updateTeacherStatus(id, status)
    );
  },

  async resetTeacherPassword(id: string): Promise<{
    success: boolean;
    username: string;
    temporaryPassword: string;
    tempPassword: string;
  }> {
    return callApiWithFallback(
      `/api/admin/teachers/${id}/reset-password`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      () => localDb.resetTeacherPassword(id)
    );
  },

  async updateTeacherCredentials(id: string, payload: {
    username?: string;
    newPassword?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    department?: string;
    subjectSpecialization?: string;
    assignedClasses?: string[];
    assignedSubjects?: string[];
    mustChangePassword?: boolean;
  }) {
    return callApiWithFallback(
      `/api/admin/teachers/${id}/credentials`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.updateTeacherCredentials(id, payload)
    );
  },

  async deleteAdminTeacher(id: string) {
    return callApiWithFallback(
      `/api/admin/teachers/${id}`,
      { method: 'DELETE' },
      () => localDb.deleteAdminTeacher(id)
    );
  },

  // Attendance Module
  async getAttendance(params?: { classId?: string; date?: string; term?: string; academicYear?: string; studentId?: string }): Promise<AttendanceSession[]> {
    const q = new URLSearchParams();
    if (params?.classId) q.append('classId', params.classId);
    if (params?.date) q.append('date', params.date);
    if (params?.term) q.append('term', params.term);
    if (params?.academicYear) q.append('academicYear', params.academicYear);
    if (params?.studentId) q.append('studentId', params.studentId);
    const url = q.toString() ? `/api/attendance?${q.toString()}` : '/api/attendance';

    return callApiWithFallback<AttendanceSession[]>(url, undefined, () => localDb.getAttendance(params));
  },

  async recordAttendance(payload: Partial<AttendanceSession>) {
    if (isStaticHostOrUnavailable()) {
      const localRes = localDb.recordAttendance(payload);
      syncService.notifyDataChange();
      return localRes;
    }

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        markApiAvailable();
        if (data.session) {
          const current = localDb.getAttendance();
          const idx = current.findIndex((s) => s.id === data.session.id);
          if (idx >= 0) current[idx] = data.session;
          else current.unshift(data.session);
          localStorage.setItem('amani_attendance', JSON.stringify(current));
          syncService.notifyDataChange();
        }
        return data;
      }

      if (!res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to record attendance');
      }

      markApiUnavailable();
      const localRes = localDb.recordAttendance(payload);
      syncService.notifyDataChange();
      return localRes;
    } catch (err: any) {
      markApiUnavailable();
      const localRes = localDb.recordAttendance(payload);
      syncService.notifyDataChange();
      return localRes;
    }
  },

  // Academic Marks & Grading Lifecycle
  async getMarks(params?: {
    classId?: string;
    subjectId?: string;
    academicYear?: string;
    term?: string;
    assessmentType?: string;
    teacherId?: string;
    status?: string;
    studentId?: string;
  }): Promise<AcademicResult[]> {
    const q = new URLSearchParams();
    if (params?.classId) q.append('classId', params.classId);
    if (params?.subjectId) q.append('subjectId', params.subjectId);
    if (params?.academicYear) q.append('academicYear', params.academicYear);
    if (params?.term) q.append('term', params.term);
    if (params?.assessmentType) q.append('assessmentType', params.assessmentType);
    if (params?.teacherId) q.append('teacherId', params.teacherId);
    if (params?.status) q.append('status', params.status);
    if (params?.studentId) q.append('studentId', params.studentId);
    const url = q.toString() ? `/api/marks?${q.toString()}` : '/api/marks';

    return callApiWithFallback<AcademicResult[]>(url, undefined, () => localDb.getMarks(params));
  },

  async saveBatchMarks(payload: {
    classId: string;
    className: string;
    grade?: string;
    subjectId: string;
    subjectName: string;
    teacherId?: string;
    teacherName?: string;
    academicYear?: string;
    term?: string;
    assessmentType?: string;
    status?: 'DRAFT' | 'SUBMITTED';
    entries: Array<{
      studentId: string;
      maxMarks: number;
      marksObtained: number;
      strengths?: string;
      areasForImprovement?: string;
      teacherComment?: string;
      recommendedAction?: string;
    }>;
  }) {
    if (isStaticHostOrUnavailable()) {
      const localRes = localDb.saveBatchMarks(payload);
      syncService.notifyDataChange();
      return localRes;
    }

    try {
      const res = await fetch('/api/marks/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        markApiAvailable();
        if (data.results && Array.isArray(data.results)) {
          const current = localDb.getMarks();
          for (const item of data.results) {
            const idx = current.findIndex((m) => m.id === item.id);
            if (idx >= 0) current[idx] = item;
            else current.push(item);
          }
          localStorage.setItem('amani_marks', JSON.stringify(current));
          syncService.notifyDataChange();
        }
        return data;
      }

      if (!res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to submit marks to central database');
      }

      markApiUnavailable();
      const localRes = localDb.saveBatchMarks(payload);
      syncService.notifyDataChange();
      return localRes;
    } catch (err: any) {
      markApiUnavailable();
      const localRes = localDb.saveBatchMarks(payload);
      syncService.notifyDataChange();
      return localRes;
    }
  },

  async approveMark(id: string, reviewedBy?: string) {
    return callApiWithFallback(
      `/api/marks/${id}/approve`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewedBy }),
      },
      () => localDb.approveMark(id, reviewedBy)
    );
  },

  async batchApproveMarks(markIds: string[], reviewedBy?: string) {
    return callApiWithFallback(
      '/api/marks/batch-approve',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markIds, reviewedBy }),
      },
      () => localDb.batchApproveMarks(markIds, reviewedBy)
    );
  },

  async returnMark(id: string, reason: string, reviewedBy?: string) {
    return callApiWithFallback(
      `/api/marks/${id}/return`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, reviewedBy }),
      },
      () => localDb.returnMark(id, reason, reviewedBy)
    );
  },

  async requestResultCorrection(payload: {
    resultId: string;
    originalMark: number;
    proposedMark: number;
    reason: string;
    explanation: string;
    teacherId?: string;
    teacherName?: string;
  }) {
    return callApiWithFallback(
      '/api/marks/correction-request',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.requestResultCorrection(payload)
    );
  },

  async getCorrectionRequests(): Promise<ResultCorrectionRequest[]> {
    return callApiWithFallback('/api/marks/correction-requests', undefined, () => localDb.getCorrectionRequests());
  },

  async reviewCorrectionRequest(
    id: string,
    payload: { action: 'APPROVED' | 'REJECTED'; adminNotes?: string; reviewedBy?: string }
  ) {
    return callApiWithFallback(
      `/api/marks/correction-requests/${id}/review`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.reviewCorrectionRequest(id, payload)
    );
  },

  // Consolidated Results & Report Cards
  async getReportCards(params: {
    classId?: string;
    academicYear?: string;
    term?: string;
    studentId?: string;
  }): Promise<StudentReportCard[]> {
    const q = new URLSearchParams();
    if (params.classId) q.append('classId', params.classId);
    if (params.academicYear) q.append('academicYear', params.academicYear);
    if (params.term) q.append('term', params.term);
    if (params.studentId) q.append('studentId', params.studentId);
    const url = `/api/report-cards?${q.toString()}`;

    return callApiWithFallback<StudentReportCard[]>(url, undefined, () => localDb.getReportCards(params));
  },

  // Enquiries & Admissions
  async getEnquiries(): Promise<Enquiry[]> {
    return callApiWithFallback<Enquiry[]>('/api/enquiries', undefined, () => localDb.getEnquiries());
  },

  async submitEnquiry(payload: {
    fullName: string;
    phone: string;
    email?: string;
    category?: EnquiryCategory;
    message: string;
    source?: 'Website Form' | 'AI Chatbot Handoff' | 'Admissions Page' | 'Phone' | 'Contact Page' | string;
    studentGradeInterest?: string;
  }): Promise<{ success: boolean; enquiry: Enquiry; referenceNumber: string }> {
    return callApiWithFallback(
      '/api/enquiries',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.submitEnquiry(payload)
    );
  },

  async updateEnquiryStatus(id: string, status: EnquiryStatus, responseNotes?: string) {
    return callApiWithFallback(
      `/api/enquiries/${id}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, responseNotes }),
      },
      () => localDb.updateEnquiryStatus(id, status, responseNotes)
    );
  },

  async deleteEnquiry(id: string) {
    return callApiWithFallback(
      `/api/enquiries/${id}`,
      {
        method: 'DELETE',
      },
      () => localDb.deleteEnquiry(id)
    );
  },

  async clearExhaustedEnquiries(all = false) {
    return callApiWithFallback(
      `/api/enquiries?all=${all}`,
      {
        method: 'DELETE',
      },
      () => localDb.clearExhaustedEnquiries(all)
    );
  },

  // Chatbot
  async queryChatbot(
    message: string,
    visitorPhone?: string
  ): Promise<{ text: string; reply: string; source: string; canEscalate?: boolean }> {
    return callApiWithFallback(
      '/api/chatbot/message',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, visitorPhone }),
      },
      () => localDb.queryChatbot(message, visitorPhone)
    );
  },

  // Assignments
  async getAssignments(classId?: string, subjectId?: string, teacherId?: string): Promise<Assignment[]> {
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId);
    if (subjectId) params.append('subjectId', subjectId);
    if (teacherId) params.append('teacherId', teacherId);
    const url = params.toString() ? `/api/assignments?${params.toString()}` : '/api/assignments';

    return callApiWithFallback<Assignment[]>(url, undefined, () => localDb.getAssignments(classId, subjectId, teacherId));
  },

  async createAssignment(payload: Partial<Assignment>) {
    if (isStaticHostOrUnavailable()) {
      const localRes = localDb.createAssignment(payload);
      syncService.notifyDataChange();
      return localRes;
    }

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        markApiAvailable();
        if (data.assignment) {
          const current = localDb.getAssignments();
          const idx = current.findIndex((a) => a.id === data.assignment.id);
          if (idx >= 0) current[idx] = data.assignment;
          else current.unshift(data.assignment);
          localStorage.setItem('amani_assignments', JSON.stringify(current));
          syncService.notifyDataChange();
        }
        return data;
      }
      if (!res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to create assignment');
      }
      markApiUnavailable();
      const localRes = localDb.createAssignment(payload);
      syncService.notifyDataChange();
      return localRes;
    } catch (err: any) {
      markApiUnavailable();
      const localRes = localDb.createAssignment(payload);
      syncService.notifyDataChange();
      return localRes;
    }
  },

  async updateAssignment(id: string, payload: Partial<Assignment>) {
    if (isStaticHostOrUnavailable()) {
      const localRes = localDb.updateAssignment(id, payload);
      syncService.notifyDataChange();
      return localRes;
    }

    try {
      const res = await fetch(`/api/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        markApiAvailable();
        if (data.assignment) {
          const current = localDb.getAssignments();
          const idx = current.findIndex((a) => a.id === id);
          if (idx >= 0) current[idx] = data.assignment;
          localStorage.setItem('amani_assignments', JSON.stringify(current));
          syncService.notifyDataChange();
        }
        return data;
      }
      if (!res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to update assignment');
      }
      markApiUnavailable();
      const localRes = localDb.updateAssignment(id, payload);
      syncService.notifyDataChange();
      return localRes;
    } catch (err: any) {
      markApiUnavailable();
      const localRes = localDb.updateAssignment(id, payload);
      syncService.notifyDataChange();
      return localRes;
    }
  },

  async deleteAssignment(id: string, teacherId?: string) {
    if (isStaticHostOrUnavailable()) {
      const localRes = localDb.deleteAssignment(id, teacherId);
      syncService.notifyDataChange();
      return localRes;
    }

    const url = teacherId ? `/api/assignments/${id}?teacherId=${encodeURIComponent(teacherId)}` : `/api/assignments/${id}`;
    try {
      const res = await fetch(url, { method: 'DELETE' });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        markApiAvailable();
        const current = localDb.getAssignments();
        const updated = current.filter((a) => a.id !== id);
        localStorage.setItem('amani_assignments', JSON.stringify(updated));
        syncService.notifyDataChange();
        return data;
      }
      if (!res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        throw new Error(data.error || data.message || 'Failed to delete assignment');
      }
      markApiUnavailable();
      const localRes = localDb.deleteAssignment(id, teacherId);
      syncService.notifyDataChange();
      return localRes;
    } catch (err: any) {
      markApiUnavailable();
      const localRes = localDb.deleteAssignment(id, teacherId);
      syncService.notifyDataChange();
      return localRes;
    }
  },

  // Fee Structures
  async getFeeStructures(): Promise<FeeStructureItem[]> {
    return callApiWithFallback<FeeStructureItem[]>('/api/fee-structures', undefined, () => localDb.getFeeStructures());
  },

  async createFeeStructure(payload: Partial<FeeStructureItem>): Promise<FeeStructureItem> {
    return callApiWithFallback<FeeStructureItem>(
      '/api/fee-structures',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.createFeeStructure(payload)
    );
  },

  async updateFeeStructure(id: string, updates: Partial<FeeStructureItem>): Promise<FeeStructureItem> {
    return callApiWithFallback<FeeStructureItem>(
      `/api/fee-structures/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      },
      () => localDb.updateFeeStructure(id, updates)
    );
  },

  async uploadFeeStructurePdf(id: string, customPdfUrl: string, customPdfName: string, title?: string): Promise<FeeStructureItem> {
    return callApiWithFallback<FeeStructureItem>(
      `/api/fee-structures/${id}/upload`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customPdfUrl, customPdfName, title }),
      },
      () => localDb.uploadFeeStructurePdf(id, customPdfUrl, customPdfName, title)
    );
  },

  async clearFeeStructurePdf(id: string): Promise<FeeStructureItem> {
    return callApiWithFallback<FeeStructureItem>(
      `/api/fee-structures/${id}/custom-pdf`,
      {
        method: 'DELETE',
      },
      () => localDb.clearFeeStructurePdf(id)
    );
  },

  async deleteFeeStructure(id: string) {
    return callApiWithFallback(
      `/api/fee-structures/${id}`,
      {
        method: 'DELETE',
      },
      () => localDb.deleteFeeStructure(id)
    );
  },

  // Audit Logs
  async getAuditLogs(params?: { role?: string; search?: string }): Promise<AuditLog[]> {
    const q = new URLSearchParams();
    if (params?.role) q.append('role', params.role);
    if (params?.search) q.append('search', params.search);
    const url = q.toString() ? `/api/audit-logs?${q.toString()}` : '/api/audit-logs';

    return callApiWithFallback<AuditLog[]>(url, undefined, () => localDb.getAuditLogs(params));
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    return callApiWithFallback<NotificationItem[]>('/api/notifications', undefined, () => localDb.getNotifications());
  },

  async markNotificationRead(id: string) {
    return callApiWithFallback(`/api/notifications/${id}/read`, { method: 'PATCH' }, () => localDb.markNotificationRead(id));
  },
};
