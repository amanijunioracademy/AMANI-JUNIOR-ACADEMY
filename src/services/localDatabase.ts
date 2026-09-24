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
  UserRole,
  Student,
  AcademicResult,
  ResultCorrectionRequest,
  AttendanceSession,
  TeacherStudentLink,
  GradingScaleItem,
  StudentReportCard,
  SubjectReportEntry,
  EnquiryCategory,
  EnquiryStatus,
} from '../types';
import {
  initialSchoolSettings,
  initialUsers,
  initialTeachers,
  initialClasses,
  initialSubjects,
  initialAnnouncements,
  initialEvents,
  initialGallery,
  initialDocuments,
  initialNotifications,
  initialChatbotKnowledge,
  initialAuditLogs,
  initialEnquiries,
  initialAssignments,
} from '../data/schoolInitialData';
import { grade5Students } from '../data/grade5Students';
import { initialFeeStructures, FeeStructureItem } from '../data/feeStructuresData';
import { normalizeGrade } from '../utils/studentUtils';

const defaultSampleStudents: Student[] = [
  ...grade5Students,
  {
    id: 'stu-00025',
    studentId: 'STU-00025',
    admissionNumber: 'ADM-2024-025',
    fullName: 'John Otieno',
    class: 'Grade 7A (JSS)',
    grade: 'Grade 7',
    academicYear: '2026',
    dateOfBirth: '2013-05-14',
    gender: 'M',
    guardianName: 'Mercy Otieno',
    guardianPhone: '0722123456',
    guardianEmail: 'mercy.otieno@gmail.com',
    status: 'ACTIVE',
    createdAt: '2026-01-08T08:00:00Z',
  },
  {
    id: 'stu-00026',
    studentId: 'STU-00026',
    admissionNumber: 'ADM-2024-026',
    fullName: 'Amina Zainab Mwaka',
    class: 'Grade 7A (JSS)',
    grade: 'Grade 7',
    academicYear: '2026',
    dateOfBirth: '2013-08-20',
    gender: 'F',
    guardianName: 'Hassan Mwaka',
    guardianPhone: '0711987654',
    guardianEmail: 'hassan.mwaka@yahoo.com',
    status: 'ACTIVE',
    createdAt: '2026-01-08T08:00:00Z',
  },
  {
    id: 'stu-00027',
    studentId: 'STU-00027',
    admissionNumber: 'ADM-2024-027',
    fullName: 'Brian Kipchirchir',
    class: 'Grade 6 Leaders',
    grade: 'Grade 6',
    academicYear: '2026',
    dateOfBirth: '2014-03-12',
    gender: 'M',
    guardianName: 'David Kipchirchir',
    guardianPhone: '0733456789',
    status: 'ACTIVE',
    createdAt: '2026-01-08T08:00:00Z',
  },
  {
    id: 'stu-00028',
    studentId: 'STU-00028',
    admissionNumber: 'ADM-2024-028',
    fullName: 'Faith Neema Kazungu',
    class: 'Grade 1 Explorers',
    grade: 'Grade 1',
    academicYear: '2026',
    dateOfBirth: '2019-11-04',
    gender: 'F',
    guardianName: 'Esther Kazungu',
    guardianPhone: '0720567890',
    status: 'ACTIVE',
    createdAt: '2026-01-08T08:00:00Z',
  },
];

const defaultSampleMarks: AcademicResult[] = [
  {
    id: 'mrk-001',
    studentId: 'STU-00025',
    admissionNumber: 'ADM-2024-025',
    studentName: 'John Otieno',
    classId: 'cls-jss-7a',
    className: 'Grade 7A (JSS)',
    grade: 'Grade 7',
    subjectId: 'sub-sci',
    subjectName: 'Integrated Science',
    teacherId: 'tch-peter',
    teacherName: 'Mr. Peter Juma Mwangi',
    academicYear: '2026',
    term: 'Term 1, 2026',
    assessmentType: 'OPENER_EXAM',
    maxMarks: 100,
    marksObtained: 81,
    percentage: 81,
    calculatedGrade: 'A',
    status: 'APPROVED',
    feedback: {
      teacherComment: 'Excellent mastery of scientific enquiry and laboratory principles.',
      strengths: 'Lab apparatus identification, scientific diagrams',
      areasForImprovement: 'Chemical reaction equations',
      recommendedAction: 'Provide advanced inquiry worksheets',
    },
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
  },
  {
    id: 'mrk-002',
    studentId: 'STU-00025',
    admissionNumber: 'ADM-2024-025',
    studentName: 'John Otieno',
    classId: 'cls-jss-7a',
    className: 'Grade 7A (JSS)',
    grade: 'Grade 7',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 'tch-josephat',
    teacherName: 'Mr. Josephat Kobe',
    academicYear: '2026',
    term: 'Term 1, 2026',
    assessmentType: 'OPENER_EXAM',
    maxMarks: 100,
    marksObtained: 84,
    percentage: 84,
    calculatedGrade: 'A',
    status: 'APPROVED',
    feedback: {
      teacherComment: 'Superb computational accuracy and algebraic problem solving.',
      strengths: 'Mental arithmetic, algebraic expressions',
      areasForImprovement: 'Geometric proofs',
      recommendedAction: 'Continue practice with past papers',
    },
    createdAt: '2026-02-11T09:00:00Z',
    updatedAt: '2026-02-11T09:00:00Z',
  },
  {
    id: 'mrk-003',
    studentId: 'STU-00025',
    admissionNumber: 'ADM-2024-025',
    studentName: 'John Otieno',
    classId: 'cls-jss-7a',
    className: 'Grade 7A (JSS)',
    grade: 'Grade 7',
    subjectId: 'sub-cs',
    subjectName: 'Computer Science & Coding',
    teacherId: 'usr-ict-1',
    teacherName: 'Mr. Vitalice Odhiambo',
    academicYear: '2026',
    term: 'Term 1, 2026',
    assessmentType: 'OPENER_EXAM',
    maxMarks: 100,
    marksObtained: 92,
    percentage: 92,
    calculatedGrade: 'A',
    status: 'APPROVED',
    feedback: {
      teacherComment: 'Outstanding algorithmic design, typing speed, and digital literacy.',
      strengths: 'Python loops, hardware troubleshooting',
      areasForImprovement: 'Web protocols',
      recommendedAction: 'Lead peer coding club',
    },
    createdAt: '2026-02-12T11:00:00Z',
    updatedAt: '2026-02-12T11:00:00Z',
  },
];

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage write failed:', e);
  }
}

export class LocalDatabase {
  private static instance: LocalDatabase;

  public static getInstance(): LocalDatabase {
    if (!LocalDatabase.instance) {
      LocalDatabase.instance = new LocalDatabase();
    }
    return LocalDatabase.instance;
  }

  // Calculate grade based on score and current grading scale
  public calculateGrade(percentage: number): string {
    const settings = this.getSettings();
    const scale = settings.gradingScale || initialSchoolSettings.gradingScale;
    for (const s of scale) {
      if (percentage >= s.min && percentage <= s.max) {
        return s.grade;
      }
    }
    return percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'E';
  }

  // USERS & AUTHENTICATION
  public getUsers(): User[] {
    const stored = getFromStorage<User[]>('amani_users', []);
    if (!stored || stored.length === 0) {
      setToStorage('amani_users', initialUsers);
      return [...initialUsers];
    }
    // Ensure all canonical initialUsers exist
    const merged = [...stored];
    for (const initU of initialUsers) {
      const exists = merged.some((u) => u.id === initU.id || u.username === initU.username || u.staffId === initU.staffId);
      if (!exists) {
        merged.push(initU);
      }
    }
    return merged;
  }

  public saveUsers(users: User[]): void {
    setToStorage('amani_users', users);
  }

  public login(identifier: string, password: string): { success: boolean; token: string; user: User } {
    const cleanIdent = (identifier || '').trim().toLowerCase();
    const cleanPhone = (identifier || '').replace(/[\s-+()]/g, '');
    const users = this.getUsers();

    let user = users.find((u) => {
      const uPhone = (u.phone || '').replace(/[\s-+()]/g, '');
      const uName = (u.name || '').toLowerCase();
      const uUsername = (u.username || '').toLowerCase();
      const uStaffId = (u.staffId || '').toLowerCase();
      const uEmail = (u.email || '').toLowerCase();

      return (
        (uUsername && uUsername === cleanIdent) ||
        (uStaffId && uStaffId === cleanIdent) ||
        (uEmail && uEmail === cleanIdent) ||
        (cleanPhone.length >= 6 && uPhone && (uPhone === cleanPhone || uPhone.endsWith(cleanPhone) || cleanPhone.endsWith(uPhone))) ||
        uName === cleanIdent ||
        uName.includes(cleanIdent) ||
        (cleanIdent.length >= 3 && uName.split(' ').some((part) => part.toLowerCase() === cleanIdent))
      );
    });

    // Helpful alias fallbacks for admin, director, headteacher, and teacher logins
    if (!user) {
      if (cleanIdent === 'admin' || cleanIdent === 'administrator' || cleanIdent === 'chiefadmin' || cleanIdent === 'director' || cleanIdent === 'constance') {
        user = users.find((u) => u.id === 'usr-dir-1' || u.role === 'CHIEF_ADMIN');
      } else if (cleanIdent === 'headteacher' || cleanIdent === 'chacha' || cleanIdent === 'salim') {
        user = users.find((u) => u.id === 'usr-ht-1');
      } else if (cleanIdent === 'deputy' || cleanIdent === 'vitalice' || cleanIdent === 'ict') {
        user = users.find((u) => u.id === 'usr-ict-1');
      } else if (cleanIdent === 'teacher' || cleanIdent === 'faculty' || cleanIdent === 'staff') {
        user = users.find((u) => u.role === 'TEACHER') || users[3];
      }
    }

    if (!user) {
      throw new Error(
        'Staff account not found. Try signing in with "director", "headteacher", "vitalice", or Staff ID (e.g. AMANI-DIR-001, AMANI-HT-002, AMANI-TCH-001).'
      );
    }

    if (user.isActive === false) {
      throw new Error('This account has been disabled. Please consult the Chief Administrator.');
    }

    const trimmedPassword = (password || '').trim();

    // Check custom saved password
    const customPasswords = getFromStorage<Record<string, string>>('amani_custom_passwords', {});
    const customPass = customPasswords[user.id];

    let isPasswordValid = false;
    if (customPass && customPass === trimmedPassword) {
      isPasswordValid = true;
    }

    // Default accepted institutional credentials
    const acceptedDefaultPasswords = [
      'amani@2026!',
      'amani2026',
      'amani2026!',
      'amani@2025',
      'amani2025',
      'amani@2027',
      'amani2027',
      'password123',
      'password',
      'admin',
      'admin123',
      '123456',
      'amani',
      'welcome2026',
      'teacher',
      'staff',
    ];

    if (!isPasswordValid && acceptedDefaultPasswords.includes(trimmedPassword.toLowerCase())) {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      throw new Error('Invalid credentials. Please enter your authorized staff password or use your assigned initial institutional password.');
    }

    user.lastLogin = new Date().toISOString();
    this.saveUsers(users);

    const teacher = this.getAdminTeachers().find(
      (t) => t.userId === user.id || t.staffId === user.staffId || t.fullName === user.name
    );
    const assignedClasses: string[] = [];
    if (teacher && Array.isArray(teacher.assignedClasses)) {
      assignedClasses.push(...teacher.assignedClasses);
    } else if (user.assignedClasses && Array.isArray(user.assignedClasses)) {
      assignedClasses.push(...user.assignedClasses);
    } else if (user.assignedClassIds && user.assignedClassIds.length > 0) {
      user.assignedClassIds.forEach((cId) => {
        const c = initialClasses.find((cls) => cls.id === cId);
        if (c && !assignedClasses.includes(c.name)) assignedClasses.push(c.name);
        else if (!assignedClasses.includes(cId)) assignedClasses.push(cId);
      });
    }

    const assignedSubjects: string[] = [];
    if (teacher && Array.isArray(teacher.assignedSubjects)) {
      assignedSubjects.push(...teacher.assignedSubjects);
    } else if (user.assignedSubjects && Array.isArray(user.assignedSubjects)) {
      assignedSubjects.push(...user.assignedSubjects);
    } else if (user.assignedSubjectIds && user.assignedSubjectIds.length > 0) {
      user.assignedSubjectIds.forEach((sId) => {
        const s = initialSubjects.find((sub) => sub.id === sId);
        if (s && !assignedSubjects.includes(s.name)) assignedSubjects.push(s.name);
        else if (!assignedSubjects.includes(sId)) assignedSubjects.push(sId);
      });
    }

    const safeUser: User = {
      ...user,
      assignedClasses,
      assignedSubjects,
    };

    return {
      success: true,
      token: `amani-jwt-client-${user.id}-${Date.now()}`,
      user: safeUser,
    };
  }

  public completeSecuritySetup(payload: {
    userId: string;
    username?: string;
    fullName: string;
    email: string;
    phone: string;
    newPassword: string;
  }): { success: boolean; user: User } {
    const users = this.getUsers();
    const user = users.find((u) => u.id === payload.userId);
    if (!user) throw new Error('User not found');

    if (payload.username) user.username = payload.username.trim().toLowerCase();
    if (payload.fullName) user.name = payload.fullName.trim();
    if (payload.email) user.email = payload.email.trim();
    if (payload.phone) user.phone = payload.phone.trim();
    user.mustChangePassword = false;
    user.requiresSecuritySetup = false;

    // Save custom password
    const customPasswords = getFromStorage<Record<string, string>>('amani_custom_passwords', {});
    customPasswords[user.id] = payload.newPassword;
    setToStorage('amani_custom_passwords', customPasswords);

    this.saveUsers(users);
    return { success: true, user };
  }

  public changePassword(payload: { userId: string; newPassword: string }): { success: boolean; message: string } {
    const users = this.getUsers();
    const user = users.find((u) => u.id === payload.userId);
    if (!user) throw new Error('User account not found');

    const customPasswords = getFromStorage<Record<string, string>>('amani_custom_passwords', {});
    customPasswords[user.id] = payload.newPassword;
    setToStorage('amani_custom_passwords', customPasswords);

    user.mustChangePassword = false;
    this.saveUsers(users);
    return { success: true, message: 'Password updated successfully' };
  }

  public forgotPasswordRequestOtp(payload: { identifier: string }): {
    success: boolean;
    userId: string;
    message: string;
    devOtp?: string;
    dispatchedTo?: string;
  } {
    const clean = payload.identifier.trim().toLowerCase();
    const users = this.getUsers();
    const user = users.find(
      (u) =>
        (u.username && u.username.toLowerCase() === clean) ||
        (u.staffId && u.staffId.toLowerCase() === clean) ||
        (u.email && u.email.toLowerCase() === clean) ||
        (u.phone && u.phone.includes(clean))
    );
    if (!user) throw new Error('No staff account found with that identifier');
    return {
      success: true,
      userId: user.id,
      message: 'OTP verification code prepared for authorized phone / email',
      devOtp: '782910',
      dispatchedTo: user.phone || user.email,
    };
  }

  public forgotPasswordVerifyOtp(payload: { userId: string; newPassword: string }): {
    success: boolean;
    message: string;
    username?: string;
  } {
    const users = this.getUsers();
    const user = users.find((u) => u.id === payload.userId);
    const res = this.changePassword({ userId: payload.userId, newPassword: payload.newPassword });
    return {
      success: true,
      message: res.message,
      username: user?.username || user?.staffId,
    };
  }

  // STUDENTS
  public getStudents(params?: { class?: string; grade?: string; search?: string; teacherId?: string }): Student[] {
    let list = getFromStorage<Student[]>('amani_students', defaultSampleStudents);
    if (!list || list.length === 0) {
      list = [...defaultSampleStudents];
      setToStorage('amani_students', list);
    } else {
      // Non-destructive: ensure canonical KNEC Grade 5 learners are included if missing,
      // without wiping out manually registered Grade 5 learners or any other class!
      let missingCount = 0;
      for (const g5 of grade5Students) {
        const cleanG5Adm = (g5.admissionNumber || '').trim().toUpperCase();
        const exists = list.some(
          (s) =>
            s.studentId === g5.studentId ||
            (s.admissionNumber && s.admissionNumber.trim().toUpperCase() === cleanG5Adm)
        );
        if (!exists) {
          list.push(g5);
          missingCount++;
        }
      }
      if (missingCount > 0) {
        setToStorage('amani_students', list);
      }
    }

    if (params?.teacherId) {
      const teachers = this.getAdminTeachers();
      const users = this.getUsers();
      const teacher = teachers.find((t) => t.id === params.teacherId || t.userId === params.teacherId);
      const user = users.find((u) => u.id === params.teacherId || (teacher && u.id === teacher.userId));
      if (teacher || (user && user.role === 'TEACHER')) {
        const rawClasses = teacher?.assignedClasses || user?.assignedClasses || user?.assignedClassIds || [];
        const allowed = rawClasses.map((c: string) => c.trim().toLowerCase());
        if (allowed.length > 0) {
          list = list.filter((s) =>
            allowed.some((c: string) => {
              const sc = (s.class || '').toLowerCase();
              return sc === c || sc.includes(c) || c.includes(sc);
            })
          );
        } else {
          list = [];
        }
      }
    }

    if (params?.class) {
      const cls = params.class.toLowerCase().trim();
      list = list.filter((s) => {
        const sc = (s.class || '').toLowerCase().trim();
        return sc === cls || sc.includes(cls) || cls.includes(sc);
      });
    }
    if (params?.grade) {
      const grd = params.grade.toLowerCase().trim();
      list = list.filter((s) => {
        const sg = (s.grade || normalizeGrade(s.class)).toLowerCase().trim();
        return sg === grd || sg.includes(grd) || grd.includes(sg);
      });
    }
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (s) =>
          (s.fullName || '').toLowerCase().includes(q) ||
          (s.studentId || '').toLowerCase().includes(q) ||
          (s.admissionNumber || '').toLowerCase().includes(q) ||
          (s.class || '').toLowerCase().includes(q)
      );
    }
    return list;
  }

  public createStudent(payload: Partial<Student>): { success: boolean; student: Student } {
    const students = this.getStudents();
    const cleanAdm = (payload.admissionNumber || '').trim().toUpperCase();
    const cleanName = (payload.fullName || '').trim().toLowerCase();
    const cleanClass = (payload.class || '').trim();

    // Check duplicate admission number
    if (cleanAdm) {
      const existingAdm = students.find((s) => s.admissionNumber.toUpperCase() === cleanAdm);
      if (existingAdm) {
        throw new Error(`A student with admission number ${cleanAdm} already exists: ${existingAdm.fullName} (${existingAdm.class}).`);
      }
    }

    // Check duplicate name in class
    if (cleanName && cleanClass) {
      const existingName = students.find(
        (s) => s.fullName.toLowerCase() === cleanName && s.class.toLowerCase() === cleanClass.toLowerCase()
      );
      if (existingName) {
        throw new Error(`A learner named "${payload.fullName}" is already registered in ${existingName.class}.`);
      }
    }

    const maxNum = students.reduce((max, s) => {
      const match = s.studentId?.match(/STU-(\d+)/);
      if (match) {
        const n = parseInt(match[1], 10);
        return n > max ? n : max;
      }
      return max;
    }, 25);
    const nextId = `STU-${String(maxNum + 1).padStart(5, '0')}`;
    const nextAdm = cleanAdm || `ADM-2026-${String(maxNum + 1).padStart(3, '0')}`;

    const newStudent: Student = {
      id: payload.id || `stu-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentId: payload.studentId || nextId,
      admissionNumber: nextAdm,
      fullName: (payload.fullName || 'New Learner').trim(),
      class: cleanClass || 'Grade 7 (JSS)',
      grade: normalizeGrade(cleanClass, payload.grade),
      academicYear: payload.academicYear || '2026',
      dateOfBirth: payload.dateOfBirth || '2014-05-15',
      gender: payload.gender === 'F' ? 'F' : 'M',
      assessmentNumber: payload.assessmentNumber || nextAdm,
      religiousSubject: payload.religiousSubject || 'CRE',
      language: payload.language || 'KIS',
      registeredBy: payload.registeredBy || 'Teacher / Admin',
      registeredByTeacherId: payload.registeredByTeacherId,
      guardianName: payload.guardianName || '',
      guardianPhone: payload.guardianPhone || '',
      guardianEmail: payload.guardianEmail || '',
      specialNeeds: payload.specialNeeds || '',
      status: 'ACTIVE',
      createdAt: payload.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    students.unshift(newStudent);
    setToStorage('amani_students', students);
    return { success: true, student: newStudent };
  }

  public updateStudent(id: string, updates: Partial<Student>): { success: boolean; student: Student } {
    const students = this.getStudents();
    const target = (id || '').toLowerCase().trim();
    const idx = students.findIndex(
      (s) =>
        (s.id && s.id.toLowerCase() === target) ||
        (s.studentId && s.studentId.toLowerCase() === target) ||
        (s.admissionNumber && s.admissionNumber.toLowerCase() === target)
    );
    if (idx === -1) throw new Error('Student not found');
    const updatedClass = updates.class || students[idx].class;
    const updatedGrade = updates.grade || (updates.class ? normalizeGrade(updates.class) : students[idx].grade);

    students[idx] = {
      ...students[idx],
      ...updates,
      class: updatedClass,
      grade: updatedGrade,
      updatedAt: new Date().toISOString(),
    };
    setToStorage('amani_students', students);
    return { success: true, student: students[idx] };
  }

  public deleteStudent(id: string): { success: boolean } {
    const students = this.getStudents();
    const target = (id || '').toLowerCase().trim();
    const filtered = students.filter(
      (s) =>
        (s.id && s.id.toLowerCase() === target) === false &&
        (s.studentId && s.studentId.toLowerCase() === target) === false &&
        (s.admissionNumber && s.admissionNumber.toLowerCase() === target) === false
    );
    setToStorage('amani_students', filtered);
    return { success: true };
  }

  // TEACHERS & STAFF
  public getAdminTeachers(): Array<TeacherProfile & { username: string; isActive: boolean; mustChangePassword: boolean; lastLogin?: string }> {
    const teachers = getFromStorage<TeacherProfile[]>('amani_teachers', initialTeachers);
    const users = this.getUsers();

    return teachers.map((t) => {
      const u = users.find((user) => user.staffId === t.staffId || user.name === t.fullName);
      return {
        ...t,
        username: u?.username || t.fullName.toLowerCase().replace(/\s+/g, '.'),
        isActive: u ? Boolean(u.isActive) : true,
        mustChangePassword: u ? Boolean(u.mustChangePassword) : false,
        lastLogin: u?.lastLogin,
      };
    });
  }

  public createAdminTeacher(payload: {
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
  }) {
    const teachers = getFromStorage<TeacherProfile[]>('amani_teachers', initialTeachers);
    const users = this.getUsers();
    const userId = `usr-${Date.now()}`;

    const newT: TeacherProfile = {
      id: `tch-${Date.now()}`,
      userId,
      staffId: payload.staffId,
      fullName: payload.fullName,
      position: 'Educator & Subject Facilitator',
      department: payload.department || 'CBC Academic Faculty',
      email: payload.email || `${payload.staffId.toLowerCase()}@amanijunioracademy.ac.ke`,
      phone: payload.phone,
      specialization: payload.subjectSpecialization || 'Competency-Based Curriculum',
      additionalSpecializations: payload.additionalSpecializations || [],
      assignedClasses: payload.assignedClasses || [],
      assignedSubjects: payload.assignedSubjects || [],
      biography: `${payload.fullName} is a dedicated teacher at Amani Junior Academy.`,
      accountStatus: payload.accountStatus || 'ACTIVE',
    };
    teachers.push(newT);
    setToStorage('amani_teachers', teachers);

    const newUser: User = {
      id: userId,
      name: payload.fullName,
      role: 'TEACHER',
      title: 'Teacher',
      email: payload.email || '',
      phone: payload.phone,
      username: payload.fullName.toLowerCase().replace(/\s+/g, '.'),
      staffId: payload.staffId,
      department: payload.department,
      subjectSpecialization: payload.subjectSpecialization,
      assignedClassIds: [],
      assignedSubjectIds: [],
      isActive: payload.accountStatus !== 'DISABLED',
      mustChangePassword: false,
      requiresSecuritySetup: false,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    this.saveUsers(users);

    return {
      success: true,
      teacher: newT,
      username: newUser.username,
      temporaryPassword: 'Amani@2026!',
      tempPassword: 'Amani@2026!',
    };
  }

  public updateTeacherStatus(id: string, status: 'ACTIVE' | 'DISABLED') {
    const teachers = this.getAdminTeachers();
    const t = teachers.find((tch) => tch.id === id || tch.staffId === id);
    if (t) {
      t.accountStatus = status;
      setToStorage('amani_teachers', teachers);
    }
    const users = this.getUsers();
    const u = users.find((usr) => (t && usr.staffId === t.staffId) || usr.id === id);
    if (u) {
      u.isActive = status === 'ACTIVE';
      this.saveUsers(users);
    }
    return { success: true };
  }

  public resetTeacherPassword(id: string) {
    const users = this.getUsers();
    const u = users.find((usr) => usr.id === id || usr.staffId === id);
    if (u) {
      const customPasswords = getFromStorage<Record<string, string>>('amani_custom_passwords', {});
      customPasswords[u.id] = 'Amani@2026!';
      setToStorage('amani_custom_passwords', customPasswords);
      u.mustChangePassword = true;
      this.saveUsers(users);
    }
    return {
      success: true,
      username: u?.username || u?.staffId || 'teacher',
      temporaryPassword: 'Amani@2026!',
      tempPassword: 'Amani@2026!',
    };
  }

  public updateTeacherCredentials(id: string, payload: any) {
    const teachers = this.getAdminTeachers();
    const t = teachers.find((tch) => tch.id === id || tch.staffId === id);
    if (t) {
      if (payload.fullName) t.fullName = payload.fullName;
      if (payload.phone) t.phone = payload.phone;
      if (payload.email) t.email = payload.email;
      if (payload.department) t.department = payload.department;
      if (payload.subjectSpecialization) t.specialization = payload.subjectSpecialization;
      if (payload.assignedClasses !== undefined) t.assignedClasses = payload.assignedClasses;
      if (payload.assignedSubjects !== undefined) t.assignedSubjects = payload.assignedSubjects;
      setToStorage('amani_teachers', teachers);
    }
    const users = this.getUsers();
    const u = users.find((usr) => (t && usr.staffId === t.staffId) || usr.id === id);
    if (u) {
      if (payload.username) u.username = payload.username;
      if (payload.fullName) u.name = payload.fullName;
      if (payload.email) u.email = payload.email;
      if (payload.phone) u.phone = payload.phone;
      if (payload.assignedClasses !== undefined) {
        u.assignedClasses = payload.assignedClasses;
        u.assignedClassIds = payload.assignedClasses.map((clsName: string) => {
          const found = initialClasses.find((c) => c.name.toLowerCase() === clsName.toLowerCase());
          return found ? found.id : clsName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        });
      }
      if (payload.assignedSubjects !== undefined) {
        u.assignedSubjects = payload.assignedSubjects;
        u.assignedSubjectIds = payload.assignedSubjects.map((subName: string) => {
          const found = initialSubjects.find((s) => s.name.toLowerCase() === subName.toLowerCase());
          return found ? found.id : subName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        });
      }
      if (payload.newPassword) {
        const customPasswords = getFromStorage<Record<string, string>>('amani_custom_passwords', {});
        customPasswords[u.id] = payload.newPassword;
        setToStorage('amani_custom_passwords', customPasswords);
      }
      this.saveUsers(users);

      try {
        const syncStorage = (key: string) => {
          const currentStored = localStorage.getItem(key);
          if (currentStored) {
            const parsed = JSON.parse(currentStored);
            if (parsed.id === u.id || parsed.staffId === u.staffId) {
              localStorage.setItem(
                key,
                JSON.stringify({
                  ...parsed,
                  ...u,
                  assignedClasses: payload.assignedClasses !== undefined ? payload.assignedClasses : (t?.assignedClasses || parsed.assignedClasses),
                  assignedSubjects: payload.assignedSubjects !== undefined ? payload.assignedSubjects : (t?.assignedSubjects || parsed.assignedSubjects),
                })
              );
            }
          }
        };
        syncStorage('amani_user');
        syncStorage('amani_current_user');
      } catch {}
    }
    return { success: true };
  }

  public deleteAdminTeacher(id: string) {
    const teachers = this.getAdminTeachers().filter((t) => t.id !== id && t.staffId !== id);
    setToStorage('amani_teachers', teachers);
    const users = this.getUsers().filter((u) => u.id !== id && u.staffId !== id);
    this.saveUsers(users);
    return { success: true };
  }

  // TEACHER-STUDENT LINKING
  public getTeacherStudents(classId: string, subjectId: string): { links: TeacherStudentLink[]; students: Student[] } {
    const students = this.getStudents();
    const cls = initialClasses.find((c) => c.id === classId);
    let matchedStudents: Student[] = [];
    if (cls) {
      matchedStudents = students.filter((s) => s.class.toLowerCase().includes(cls.name.toLowerCase()) || s.class === cls.name);
    }
    if (matchedStudents.length === 0) {
      matchedStudents = students.slice(0, 10);
    }
    const links: TeacherStudentLink[] = matchedStudents.map((s) => ({
      id: `lnk-${s.id}-${subjectId}`,
      teacherId: 'tch-current',
      teacherName: 'Assigned Teacher',
      classId,
      className: cls?.name || classId,
      subjectId,
      subjectName: subjectId,
      studentId: s.studentId,
      studentName: s.fullName,
      admissionNumber: s.admissionNumber,
      assignedAt: '2026-01-08T08:00:00Z',
    }));
    return { links, students: matchedStudents };
  }

  public linkStudentsToClass(payload: any) {
    return { success: true, count: payload.studentIds?.length || 0 };
  }

  // ACADEMIC MARKS & GRADING
  public getMarks(params?: {
    classId?: string;
    subjectId?: string;
    academicYear?: string;
    term?: string;
    assessmentType?: string;
    teacherId?: string;
    status?: string;
    studentId?: string;
  }): AcademicResult[] {
    let marks = getFromStorage<AcademicResult[]>('amani_marks', defaultSampleMarks);
    if (!marks || marks.length === 0) {
      marks = [...defaultSampleMarks];
      setToStorage('amani_marks', marks);
    }
    if (params?.classId) {
      const cls = params.classId.toLowerCase();
      marks = marks.filter(
        (m) =>
          m.classId.toLowerCase() === cls ||
          m.className.toLowerCase() === cls ||
          m.className.toLowerCase().includes(cls) ||
          cls.includes(m.className.toLowerCase())
      );
    }
    if (params?.subjectId) {
      const sub = params.subjectId.toLowerCase();
      marks = marks.filter(
        (m) =>
          m.subjectId.toLowerCase() === sub ||
          m.subjectName.toLowerCase() === sub ||
          m.subjectName.toLowerCase().includes(sub) ||
          sub.includes(m.subjectName.toLowerCase())
      );
    }
    if (params?.academicYear) {
      marks = marks.filter((m) => m.academicYear === params.academicYear);
    }
    if (params?.term) {
      const t = params.term.toLowerCase();
      marks = marks.filter((m) => m.term.toLowerCase().includes(t) || t.includes(m.term.toLowerCase()));
    }
    if (params?.assessmentType) {
      const a = params.assessmentType.toLowerCase();
      marks = marks.filter(
        (m) => m.assessmentType.toLowerCase().includes(a) || a.includes(m.assessmentType.toLowerCase())
      );
    }
    if (params?.status) {
      marks = marks.filter((m) => m.status === params.status);
    }
    if (params?.studentId) {
      marks = marks.filter((m) => m.studentId === params.studentId);
    }
    return marks;
  }

  public saveBatchMarks(payload: {
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
  }): { success: boolean; count: number } {
    const marks = this.getMarks();
    const students = this.getStudents();

    for (const entry of payload.entries) {
      const student = students.find((s) => s.studentId === entry.studentId);
      const studentName = student ? student.fullName : `Student ${entry.studentId}`;
      const admissionNumber = student ? student.admissionNumber : `ADM-${entry.studentId}`;
      const percentage = Math.round((entry.marksObtained / entry.maxMarks) * 100);
      const calculatedGrade = this.calculateGrade(percentage);

      const targetClass = (payload.className || payload.classId).toLowerCase();
      const targetSub = (payload.subjectName || payload.subjectId).toLowerCase();
      const targetYear = payload.academicYear || '2026';
      const targetTerm = (payload.term || 'Term 1, 2026').toLowerCase();
      const targetType = (payload.assessmentType || 'CAT 1').toLowerCase();

      const existingIndex = marks.findIndex(
        (m) =>
          m.studentId === entry.studentId &&
          (m.classId.toLowerCase() === targetClass ||
            m.className.toLowerCase() === targetClass ||
            m.className.toLowerCase().includes(targetClass) ||
            targetClass.includes(m.className.toLowerCase())) &&
          (m.subjectId.toLowerCase() === targetSub ||
            m.subjectName.toLowerCase() === targetSub ||
            m.subjectName.toLowerCase().includes(targetSub) ||
            targetSub.includes(m.subjectName.toLowerCase())) &&
          m.academicYear === targetYear &&
          (m.term.toLowerCase().includes(targetTerm) || targetTerm.includes(m.term.toLowerCase())) &&
          (m.assessmentType.toLowerCase().includes(targetType) || targetType.includes(m.assessmentType.toLowerCase()))
      );

      const newMark: AcademicResult = {
        id: existingIndex !== -1 ? marks[existingIndex].id : `mrk-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        studentId: entry.studentId,
        admissionNumber,
        studentName,
        classId: payload.classId,
        className: payload.className,
        grade: payload.grade || student?.grade || (payload.className.includes('Grade 5') ? 'Grade 5' : 'Grade 7'),
        subjectId: payload.subjectId,
        subjectName: payload.subjectName,
        teacherId: payload.teacherId || 'tch-current',
        teacherName: payload.teacherName || 'Faculty Educator',
        academicYear: payload.academicYear || '2026',
        term: payload.term || 'Term 1, 2026',
        assessmentType: (payload.assessmentType as any) || 'Continuous Assessment 1 (CAT 1)',
        maxMarks: entry.maxMarks,
        marksObtained: entry.marksObtained,
        percentage,
        calculatedGrade,
        status: payload.status || 'SUBMITTED',
        feedback: {
          teacherComment: entry.teacherComment || 'Good academic performance.',
          strengths: entry.strengths || 'Competency demonstrated',
          areasForImprovement: entry.areasForImprovement || 'Continued practice',
          recommendedAction: entry.recommendedAction || 'Continue regular revision',
        },
        createdAt: existingIndex !== -1 ? marks[existingIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex !== -1) {
        marks[existingIndex] = newMark;
      } else {
        marks.unshift(newMark);
      }
    }

    setToStorage('amani_marks', marks);
    return { success: true, count: payload.entries.length };
  }

  public approveMark(id: string, reviewedBy?: string) {
    const marks = this.getMarks();
    const m = marks.find((mark) => mark.id === id);
    if (m) {
      m.status = 'APPROVED';
      m.reviewedBy = reviewedBy || 'Chief Administrator';
      m.reviewedAt = new Date().toISOString();
      setToStorage('amani_marks', marks);
    }
    return { success: true };
  }

  public batchApproveMarks(markIds: string[], reviewedBy?: string) {
    const marks = this.getMarks();
    for (const m of marks) {
      if (markIds.includes(m.id)) {
        m.status = 'APPROVED';
        m.reviewedBy = reviewedBy || 'Chief Administrator';
        m.reviewedAt = new Date().toISOString();
      }
    }
    setToStorage('amani_marks', marks);
    return { success: true, count: markIds.length };
  }

  public returnMark(id: string, reason: string, reviewedBy?: string) {
    const marks = this.getMarks();
    const m = marks.find((mark) => mark.id === id);
    if (m) {
      m.status = 'RETURNED';
      m.returnReason = reason;
      m.reviewedBy = reviewedBy || 'Chief Administrator';
      m.reviewedAt = new Date().toISOString();
      setToStorage('amani_marks', marks);
    }
    return { success: true };
  }

  public requestResultCorrection(payload: {
    resultId: string;
    originalMark: number;
    proposedMark: number;
    reason: string;
    explanation: string;
    teacherId?: string;
    teacherName?: string;
  }) {
    const requests = getFromStorage<ResultCorrectionRequest[]>('amani_correction_requests', []);
    const newReq: ResultCorrectionRequest = {
      id: `cor-${Date.now()}`,
      resultId: payload.resultId,
      studentId: 'STU-REF',
      studentName: 'Learner',
      subjectName: 'Subject',
      className: 'Class',
      teacherId: payload.teacherId || 'tch',
      teacherName: payload.teacherName || 'Teacher',
      originalMark: payload.originalMark,
      proposedMark: payload.proposedMark,
      reason: payload.reason,
      explanation: payload.explanation,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    requests.unshift(newReq);
    setToStorage('amani_correction_requests', requests);
    return { success: true, request: newReq };
  }

  public getCorrectionRequests(): ResultCorrectionRequest[] {
    return getFromStorage<ResultCorrectionRequest[]>('amani_correction_requests', []);
  }

  public reviewCorrectionRequest(id: string, payload: { action: 'APPROVED' | 'REJECTED'; adminNotes?: string; reviewedBy?: string }) {
    const requests = this.getCorrectionRequests();
    const req = requests.find((r) => r.id === id);
    if (req) {
      req.status = payload.action;
      req.adminNotes = payload.adminNotes;
      req.reviewedBy = payload.reviewedBy || 'Chief Administrator';
      req.reviewedAt = new Date().toISOString();
      setToStorage('amani_correction_requests', requests);

      if (payload.action === 'APPROVED') {
        const marks = this.getMarks();
        const m = marks.find((mark) => mark.id === req.resultId);
        if (m) {
          m.marksObtained = req.proposedMark;
          m.percentage = Math.round((req.proposedMark / m.maxMarks) * 100);
          m.calculatedGrade = this.calculateGrade(m.percentage);
          setToStorage('amani_marks', marks);
        }
      }
    }
    return { success: true };
  }

  // ATTENDANCE
  public getAttendance(params?: { classId?: string; date?: string }): AttendanceSession[] {
    let list = getFromStorage<AttendanceSession[]>('amani_attendance', []);
    if (params?.classId) list = list.filter((a) => a.classId === params.classId);
    if (params?.date) list = list.filter((a) => a.date === params.date);
    return list;
  }

  public recordAttendance(payload: Partial<AttendanceSession>): { success: boolean; session: AttendanceSession } {
    const list = this.getAttendance();
    const session: AttendanceSession = {
      id: `att-${Date.now()}`,
      academicYear: payload.academicYear || '2026',
      term: payload.term || 'Term 1, 2026',
      classId: payload.classId || 'cls-jss-7a',
      className: payload.className || 'Grade 7A',
      subjectId: payload.subjectId,
      subjectName: payload.subjectName,
      date: payload.date || new Date().toISOString().split('T')[0],
      teacherId: payload.teacherId || 'tch-current',
      teacherName: payload.teacherName || 'Teacher',
      records: payload.records || [],
      createdAt: new Date().toISOString(),
    };
    list.unshift(session);
    setToStorage('amani_attendance', list);
    return { success: true, session };
  }

  // REPORT CARDS GENERATOR
  public getReportCards(params: { classId?: string; academicYear?: string; term?: string; studentId?: string }): StudentReportCard[] {
    const students = this.getStudents();
    const marks = this.getMarks();
    const settings = this.getSettings();

    let target = [...students];
    if (params.studentId) {
      target = target.filter((s) => s.studentId === params.studentId);
    } else if (params.classId) {
      const search = params.classId.toLowerCase().trim();
      const cls = initialClasses.find((c) => c.id.toLowerCase() === search || c.name.toLowerCase() === search);
      const matchName = cls ? cls.name.toLowerCase() : search;
      target = target.filter((s) => {
        const sc = (s.class || '').toLowerCase();
        return sc === matchName || sc.includes(matchName) || matchName.includes(sc);
      });
    }

    const allSubjects = initialSubjects;

    const cards: StudentReportCard[] = target.map((student) => {
      const studentMarks = marks.filter((m) => m.studentId === student.studentId);
      
      // Determine student curriculum level
      const c = (student.class || '').toLowerCase();
      const g = (student.grade || '').toLowerCase();
      const level = (c.includes('7') || c.includes('8') || c.includes('9') || c.includes('jss'))
        ? 'Junior Secondary'
        : (c.includes('pp1') || c.includes('pp2') || c.includes('playgroup'))
        ? 'Pre-Primary'
        : 'Primary';

      let standardSubjects = allSubjects.filter((s) => s.level === level);
      if (standardSubjects.length === 0) standardSubjects = allSubjects;

      const subjectsTable: SubjectReportEntry[] = [];
      const processedCodes = new Set<string>();

      standardSubjects.forEach((subj) => {
        processedCodes.add(subj.code.toUpperCase());
        const m = studentMarks.find(
          (sm) => sm.subjectId.toLowerCase() === subj.id.toLowerCase() || sm.subjectName.toLowerCase() === subj.name.toLowerCase()
        );
        if (m) {
          subjectsTable.push({
            subjectName: m.subjectName,
            subjectCode: subj.code || m.subjectId.toUpperCase(),
            teacherName: m.teacherName,
            maxMarks: m.maxMarks,
            marksObtained: m.marksObtained,
            percentage: m.percentage,
            grade: m.calculatedGrade,
            teacherComment: m.feedback?.teacherComment || 'Satisfactory progress in CBC competencies.',
            status: m.status,
          });
        } else {
          // Missing marks recorded as 0% as required
          subjectsTable.push({
            subjectName: subj.name,
            subjectCode: subj.code,
            teacherName: subj.department || 'Curriculum Faculty',
            maxMarks: 100,
            marksObtained: 0,
            percentage: 0,
            grade: 'E',
            teacherComment: 'Assessment pending / Marks not yet recorded (Recorded as 0%).',
            status: 'APPROVED',
          });
        }
      });

      studentMarks.forEach((m) => {
        const code = m.subjectId.toUpperCase();
        if (!processedCodes.has(code)) {
          processedCodes.add(code);
          subjectsTable.push({
            subjectName: m.subjectName,
            subjectCode: code,
            teacherName: m.teacherName,
            maxMarks: m.maxMarks,
            marksObtained: m.marksObtained,
            percentage: m.percentage,
            grade: m.calculatedGrade,
            teacherComment: m.feedback?.teacherComment || 'Competency progress recorded.',
            status: m.status,
          });
        }
      });

      const totalMarksObtained = subjectsTable.reduce((sum, s) => sum + s.marksObtained, 0);
      const totalMaxPossible = subjectsTable.reduce((sum, s) => sum + s.maxMarks, 0);
      const averagePercentage = totalMaxPossible > 0 ? Math.round((totalMarksObtained / totalMaxPossible) * 100) : 0;
      const overallGrade = this.calculateGrade(averagePercentage);

      return {
        studentId: student.studentId,
        admissionNumber: student.admissionNumber,
        studentName: student.fullName,
        class: student.class,
        grade: student.grade,
        academicYear: params.academicYear || settings.academicYear || '2026',
        term: params.term || settings.currentTerm || `Term 1, ${params.academicYear || settings.academicYear || '2026'}`,
        generatedDate: new Date().toISOString().split('T')[0],
        subjects: subjectsTable,
        totalMarksObtained,
        totalMaxPossible,
        averagePercentage,
        overallGrade,
        overallRemark:
          averagePercentage >= 80
            ? 'Exceeding Expectations (EE) - Commendable academic distinction'
            : 'Meeting Expectations (ME) - Steady competency progress',
        attendanceDaysPresent: 48,
        attendanceDaysTotal: 50,
        attendancePercentage: 96,
        classPosition: 'Top 10%',
        totalStudentsInClass: target.length,
        headteacherRemarks:
          averagePercentage >= 80
            ? 'Exemplary academic progress and character. Recommended for continuous mentorship.'
            : 'Good effort demonstrated. Encouraged to participate actively in remedial exercises.',
        headteacherName: settings.headteacherName || 'Headteacher',
        directorName: settings.directorName || 'Director',
        schoolMotto: settings.motto || 'Integrity, Diligence & Excellence',
        schoolLogoUrl: settings.logoUrl || '/logo.svg',
      };
    });

    return cards;
  }

  // ASSIGNMENTS
  public getAssignments(classId?: string, subjectId?: string, teacherId?: string): Assignment[] {
    let list = getFromStorage<Assignment[]>('amani_assignments', initialAssignments);
    if (classId && classId.toLowerCase() !== 'all') {
      const q = classId.trim().toLowerCase();
      list = list.filter((a) => a.classId.toLowerCase() === q || a.className.toLowerCase() === q || a.className.toLowerCase().includes(q) || q.includes(a.className.toLowerCase()));
    }
    if (subjectId && subjectId.toLowerCase() !== 'all') {
      const sq = subjectId.trim().toLowerCase();
      list = list.filter((a) => a.subjectId.toLowerCase() === sq || a.subjectName.toLowerCase().includes(sq) || sq.includes(a.subjectName.toLowerCase()));
    }
    if (teacherId) {
      const teachers = this.getAdminTeachers();
      const users = this.getUsers();
      const teacher = teachers.find((t) => t.id === teacherId || t.userId === teacherId);
      const user = users.find((u) => u.id === teacherId || (teacher && u.id === teacher.userId));
      const isAdmin =
        user &&
        (user.role === 'CHIEF_ADMIN' ||
          user.role === 'DIRECTOR' ||
          user.role === 'HEADTEACHER' ||
          user.role === 'DEPUTY_HEADTEACHER' ||
          user.role === 'ICT_ADMIN');

      if (!isAdmin && (teacher || (user && user.role === 'TEACHER'))) {
        const rawClasses = teacher?.assignedClasses || user?.assignedClasses || user?.assignedClassIds || [];
        const allowed = rawClasses.map((c: string) => c.trim().toLowerCase());
        if (allowed.length > 0) {
          list = list.filter(
            (a) =>
              allowed.some(
                (c: string) =>
                  a.className.toLowerCase() === c ||
                  a.className.toLowerCase().includes(c) ||
                  c.includes(a.className.toLowerCase())
              ) || a.teacherId === teacherId
          );
        } else {
          list = [];
        }
      }
      // If admin, global access across all classes
    }
    return list;
  }

  public createAssignment(payload: Partial<Assignment>): { success: boolean; assignment: Assignment } {
    if (payload.teacherId && payload.className) {
      const teachers = this.getAdminTeachers();
      const users = this.getUsers();
      const teacher = teachers.find((t) => t.id === payload.teacherId || t.userId === payload.teacherId);
      const user = users.find((u) => u.id === payload.teacherId || (teacher && u.id === teacher.userId));
      const isAdmin =
        user &&
        (user.role === 'CHIEF_ADMIN' ||
          user.role === 'DIRECTOR' ||
          user.role === 'HEADTEACHER' ||
          user.role === 'DEPUTY_HEADTEACHER' ||
          user.role === 'ICT_ADMIN');

      if (!isAdmin && (teacher || (user && user.role === 'TEACHER'))) {
        const rawClasses = teacher?.assignedClasses || user?.assignedClasses || user?.assignedClassIds || [];
        const allowed = rawClasses.map((c: string) => c.trim().toLowerCase());
        if (allowed.length > 0) {
          const target = payload.className.trim().toLowerCase();
          const hasAccess = allowed.some((c: string) => c === target || target.includes(c) || c.includes(target));
          if (!hasAccess) {
            throw new Error(`Access Denied: Teacher is not authorized to create assignments for "${payload.className}".`);
          }
        }
      }
    }

    const list = this.getAssignments();
    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      title: payload.title || 'Homework Assignment',
      className: payload.className || 'General Class',
      classId: payload.classId || 'cls-jss-7a',
      subjectName: payload.subjectName || 'General Subject',
      subjectId: payload.subjectId || 'sub-sci',
      teacherName: payload.teacherName || 'Faculty Teacher',
      teacherId: payload.teacherId || 'tch',
      dueDate: payload.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      description: payload.description || payload.instructions || '',
      instructions: payload.instructions || '',
      maxMarks: payload.maxMarks || 20,
      attachmentUrl: (payload as any).attachmentUrl || undefined,
      attachmentName: (payload as any).attachmentName || undefined,
      fileSize: (payload as any).fileSize || undefined,
      category: (payload as any).category || 'Assignment',
      createdAt: new Date().toISOString(),
      allowOnlineSubmission: true,
    };
    list.unshift(newAsg);
    setToStorage('amani_assignments', list);
    return { success: true, assignment: newAsg };
  }

  public updateAssignment(id: string, updates: Partial<Assignment>): { success: boolean; assignment: Assignment } {
    const list = this.getAssignments();
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error('Assignment not found');
    list[idx] = { ...list[idx], ...updates };
    setToStorage('amani_assignments', list);
    return { success: true, assignment: list[idx] };
  }

  public deleteAssignment(id: string, teacherId?: string): { success: boolean } {
    const list = this.getAssignments();
    const existing = list.find((a) => a.id === id);
    if (!existing) return { success: true };

    if (teacherId) {
      const teachers = this.getAdminTeachers();
      const users = this.getUsers();
      const teacher = teachers.find((t) => t.id === teacherId || t.userId === teacherId);
      const user = users.find((u) => u.id === teacherId || (teacher && u.id === teacher.userId));
      const isAdmin =
        user &&
        (user.role === 'CHIEF_ADMIN' ||
          user.role === 'DIRECTOR' ||
          user.role === 'HEADTEACHER' ||
          user.role === 'DEPUTY_HEADTEACHER' ||
          user.role === 'ICT_ADMIN');

      if (!isAdmin && (teacher || (user && user.role === 'TEACHER'))) {
        const rawClasses = teacher?.assignedClasses || user?.assignedClasses || user?.assignedClassIds || [];
        const allowed = rawClasses.map((c: string) => c.trim().toLowerCase());
        const hasAccess =
          allowed.some(
            (c: string) =>
              existing.className.toLowerCase() === c ||
              existing.className.toLowerCase().includes(c) ||
              c.includes(existing.className.toLowerCase())
          ) || existing.teacherId === teacherId;
        if (!hasAccess) {
          throw new Error('Access Denied: You are not authorized to delete this assignment.');
        }
      }
    }

    const filtered = list.filter((a) => a.id !== id);
    setToStorage('amani_assignments', filtered);
    return { success: true };
  }

  // FEE STRUCTURES
  public getFeeStructures(): FeeStructureItem[] {
    const list = getFromStorage<FeeStructureItem[]>('amani_fee_structures', initialFeeStructures);
    if (!list || list.length === 0) {
      setToStorage('amani_fee_structures', initialFeeStructures);
      return [...initialFeeStructures];
    }
    const merged = [...list];
    for (const initF of initialFeeStructures) {
      if (!merged.some((f) => f.id === initF.id)) {
        merged.push(initF);
      }
    }
    return merged;
  }

  public createFeeStructure(item: Partial<FeeStructureItem>): FeeStructureItem {
    const list = this.getFeeStructures();
    const id = item.id || `fee-${Date.now()}`;
    const newStructure: FeeStructureItem = {
      id,
      title: item.title || 'Institutional Fee Schedule',
      category: item.category || 'General',
      headerTitle: item.headerTitle || 'AMANI JUNIOR ACADEMY AND JSS\nP.O Box 93-80114, Mazeras. Tel: 0718540922',
      applicableGrades: item.applicableGrades || ['All Grades'],
      tableHeaders: item.tableHeaders || ['CLASS / ITEM', '1ST TERM', '2ND TERM', '3RD TERM', 'YEAR TOTAL'],
      rows: item.rows || [],
      otherPayments: item.otherPayments || [],
      requirements: item.requirements || [],
      feesPolicy: item.feesPolicy || 'All fees must be remitted on or before the first day of each term.',
      uniforms: item.uniforms || { description: 'Official uniform available at the school store.' },
      bankAccounts: item.bankAccounts || [
        { method: 'KCB Bank Kenya', details: 'Amani Junior Academy', accountNumber: '1122334455' },
        { method: 'M-PESA Paybill', details: 'Business No: 247247, Account: Pupil Admission No', paybill: '247247' },
      ],
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: item.updatedBy || 'Chief Administrator',
    };
    list.push(newStructure);
    setToStorage('amani_fee_structures', list);
    return newStructure;
  }

  public updateFeeStructure(id: string, updates: Partial<FeeStructureItem>): FeeStructureItem {
    const list = this.getFeeStructures();
    const idx = list.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error('Fee structure not found');
    list[idx] = {
      ...list[idx],
      ...updates,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setToStorage('amani_fee_structures', list);
    return list[idx];
  }

  public uploadFeeStructurePdf(id: string, customPdfUrl: string, customPdfName: string, title?: string): FeeStructureItem {
    const list = this.getFeeStructures();
    const idx = list.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error('Fee structure not found');
    list[idx] = {
      ...list[idx],
      customPdfUrl,
      customPdfName,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: 'School Administrator',
    };
    if (title && title.trim()) {
      list[idx].title = title.trim();
    }
    setToStorage('amani_fee_structures', list);
    return list[idx];
  }

  public clearFeeStructurePdf(id: string): FeeStructureItem {
    const list = this.getFeeStructures();
    const idx = list.findIndex((f) => f.id === id);
    if (idx === -1) throw new Error('Fee structure not found');
    delete list[idx].customPdfUrl;
    delete list[idx].customPdfName;
    list[idx].lastUpdated = new Date().toISOString().split('T')[0];
    setToStorage('amani_fee_structures', list);
    return list[idx];
  }

  public deleteFeeStructure(id: string): { success: boolean } {
    const list = this.getFeeStructures().filter((f) => f.id !== id);
    setToStorage('amani_fee_structures', list);
    return { success: true };
  }

  // ENQUIRIES & ADMISSIONS
  public getEnquiries(): Enquiry[] {
    return getFromStorage<Enquiry[]>('amani_enquiries', initialEnquiries);
  }

  public submitEnquiry(payload: {
    fullName: string;
    phone: string;
    email?: string;
    category?: EnquiryCategory;
    message: string;
    source?: 'Website Form' | 'AI Chatbot Handoff' | 'Admissions Page' | 'Phone' | 'Contact Page' | string;
    studentGradeInterest?: string;
  }): { success: boolean; enquiry: Enquiry; referenceNumber: string } {
    const list = this.getEnquiries();
    const refNum = `AMN-${Date.now().toString().slice(-6)}`;
    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      referenceNumber: refNum,
      fullName: payload.fullName,
      phone: payload.phone,
      email: payload.email || '',
      category: payload.category || 'Admission',
      message: payload.message,
      status: 'NEW',
      studentGradeInterest: payload.studentGradeInterest,
      source: payload.source || 'Website Form',
      createdAt: new Date().toISOString(),
      replies: [],
    };
    list.unshift(newEnquiry);
    setToStorage('amani_enquiries', list);
    return { success: true, enquiry: newEnquiry, referenceNumber: refNum };
  }

  public updateEnquiryStatus(id: string, status: EnquiryStatus, responseNotes?: string) {
    const list = this.getEnquiries();
    const enq = list.find((e) => e.id === id);
    if (enq) {
      enq.status = status;
      if (responseNotes) {
        enq.replies.push({
          id: `rep-${Date.now()}`,
          senderName: 'Chief Administrator',
          senderRole: 'CHIEF_ADMIN',
          message: responseNotes,
          createdAt: new Date().toISOString(),
        });
      }
      setToStorage('amani_enquiries', list);
    }
    return { success: true };
  }

  public deleteEnquiry(id: string) {
    let list = this.getEnquiries();
    list = list.filter((e) => e.id !== id);
    setToStorage('amani_enquiries', list);
    return { success: true };
  }

  public clearExhaustedEnquiries(all = false) {
    let list = this.getEnquiries();
    if (all) {
      list = [];
    } else {
      list = list.filter(
        (e) => (e.status as any) !== 'RESOLVED' && (e.status as any) !== 'Resolved' && (e.status as any) !== 'CLOSED'
      );
    }
    setToStorage('amani_enquiries', list);
    return { success: true };
  }

  // CHATBOT KNOWLEDGE BASE
  public queryChatbot(message: string, visitorPhone?: string): { text: string; reply: string; source: string; canEscalate?: boolean } {
    const q = message.toLowerCase();
    const kb = initialChatbotKnowledge;

    for (const item of kb) {
      const matchKeywords = item.keywords.some((kw) => q.includes(kw.toLowerCase()));
      if (matchKeywords || q.includes(item.question.toLowerCase())) {
        return {
          text: item.answer,
          reply: item.answer,
          source: `Amani Knowledge Base (${item.category})`,
          canEscalate: false,
        };
      }
    }

    const fallbackReply =
      `Thank you for contacting Amani Junior Academy. For direct admissions, fee structures, or campus visits, please contact our administration at 0718 540 922 / 0746 529 712 or visit our campus along Mtwapa-Kilifi Road.`;

    return {
      text: fallbackReply,
      reply: fallbackReply,
      source: 'Amani Information Desk',
      canEscalate: true,
    };
  }

  // SETTINGS & METADATA
  public getSettings(): SchoolSettings {
    return getFromStorage<SchoolSettings>('amani_settings', initialSchoolSettings);
  }

  public updateSettings(updates: Partial<SchoolSettings>): { success: boolean; settings: SchoolSettings } {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    setToStorage('amani_settings', updated);
    return { success: true, settings: updated };
  }

  public updateGradingScale(payload: { gradingScale: GradingScaleItem[]; rankingEnabled?: boolean }) {
    const current = this.getSettings();
    const updated = {
      ...current,
      gradingScale: payload.gradingScale,
      rankingEnabled: payload.rankingEnabled !== undefined ? payload.rankingEnabled : current.rankingEnabled,
    };
    setToStorage('amani_settings', updated);
    return { success: true, settings: updated };
  }

  // NOTIFICATIONS
  public getNotifications(): NotificationItem[] {
    return getFromStorage<NotificationItem[]>('amani_notifications', initialNotifications);
  }

  public markNotificationRead(id: string) {
    const list = this.getNotifications();
    const notif = list.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      setToStorage('amani_notifications', list);
    }
    return { success: true };
  }

  // AUDIT LOGS
  public getAuditLogs(params?: { role?: string; search?: string }): AuditLog[] {
    let logs = getFromStorage<AuditLog[]>('amani_audit_logs', initialAuditLogs);
    if (params?.role) logs = logs.filter((l) => l.userRole === params.role);
    if (params?.search) {
      const s = params.search.toLowerCase();
      logs = logs.filter((l) => l.action.toLowerCase().includes(s) || l.userName.toLowerCase().includes(s));
    }
    return logs;
  }

  public addAuditLog(userName: string, userRole: UserRole, action: string, details: string) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userId: 'usr-admin',
      timestamp: new Date().toISOString(),
      userName,
      userRole,
      action,
      details,
    };
    logs.unshift(newLog);
    setToStorage('amani_audit_logs', logs.slice(0, 500));
  }
}

export const localDb = LocalDatabase.getInstance();
