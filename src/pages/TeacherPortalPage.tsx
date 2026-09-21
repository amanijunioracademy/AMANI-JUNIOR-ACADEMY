import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SchoolLogoBadge } from '../components/SchoolLogoBadge';
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  GraduationCap,
  Users,
  LogIn,
  LogOut,
  Shield,
  Layers,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

import { TeacherMarksEntryTab } from '../components/teacher/TeacherMarksEntryTab';
import { TeacherAttendanceTab } from '../components/teacher/TeacherAttendanceTab';
import { TeacherAssignmentsTab } from '../components/teacher/TeacherAssignmentsTab';
import { TeacherStudentRegistrationTab } from '../components/teacher/TeacherStudentRegistrationTab';
import { InfiniteCalendarModal } from '../components/common/InfiniteCalendarModal';

export const TeacherPortalPage: React.FC = () => {
  const { currentUser, navigate, settings, classes, subjects, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'learners' | 'marks' | 'attendance' | 'assignments'>('learners');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Derive teacher's assigned classes and subjects
  const assignedClasses: string[] =
    currentUser?.assignedClasses && currentUser.assignedClasses.length > 0
      ? currentUser.assignedClasses
      : (currentUser?.assignedClassIds && currentUser.assignedClassIds.length > 0
          ? currentUser.assignedClassIds.map((cId) => {
              const cls = classes.find((c) => c.id === cId);
              return cls ? cls.name : cId;
            })
          : []);

  const assignedSubjects: string[] =
    currentUser?.assignedSubjects && currentUser.assignedSubjects.length > 0
      ? currentUser.assignedSubjects
      : (currentUser?.assignedSubjectIds && currentUser.assignedSubjectIds.length > 0
          ? currentUser.assignedSubjectIds.map((sId) => {
              const sub = subjects.find((s) => s.id === sId);
              return sub ? sub.name : sId;
            })
          : []);

  // Class Selection State:
  // If only 1 assigned class, automatically take teacher directly to that class.
  // If multiple, default to the first assigned class, allowing switching between only assigned classes.
  const [selectedClass, setSelectedClass] = useState<string>(
    assignedClasses.length > 0 ? assignedClasses[0] : ''
  );

  useEffect(() => {
    if (assignedClasses.length === 1) {
      setSelectedClass(assignedClasses[0]);
    } else if (assignedClasses.length > 1) {
      if (!selectedClass || !assignedClasses.includes(selectedClass)) {
        setSelectedClass(assignedClasses[0]);
      }
    } else {
      setSelectedClass('');
    }
  }, [assignedClasses]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4 shadow-md">
        <BookOpen className="w-12 h-12 text-amber-600 mx-auto" />
        <h2 className="text-xl font-bold font-['Cinzel',serif] text-[#0F1E36]">
          Teacher Portal Access
        </h2>
        <p className="text-xs text-slate-600">
          Authorized faculty credentials are required to enter assessment marks, record attendance, and publish coursework handouts.
        </p>
        <button
          onClick={() => navigate('portal-login')}
          className="w-full py-2.5 bg-[#0F1E36] hover:bg-amber-600 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In to Teacher Portal</span>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-slate-50 py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F1E36] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>Faculty Academic Station • {settings.schoolName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel',serif] tracking-wide">
            Instructor Academic Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Welcome, <strong className="text-white">{currentUser.name}</strong> • Staff ID: {currentUser.staffId || currentUser.username} • Motto: "{settings.motto}"
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-300">
            <span className="font-semibold text-amber-400">Assigned Class(es):</span>
            {assignedClasses.length === 0 ? (
              <span className="bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-400/30">
                Pending Admin Class Assignment
              </span>
            ) : (
              assignedClasses.map((c) => (
                <span
                  key={c}
                  className={`px-2.5 py-0.5 rounded-full font-bold border transition ${
                    selectedClass === c
                      ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-sm'
                      : 'bg-white/10 text-amber-300 border-amber-400/30'
                  }`}
                >
                  {c}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 relative z-10 shrink-0">
          <button
            type="button"
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-amber-300 rounded-xl text-xs font-bold shadow-sm transition border border-white/20 cursor-pointer"
            title="Open Infinite Academic Calendar"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Academic Calendar</span>
          </button>
          <button
            id="btn-teacher-portal-logout"
            onClick={() => logout('portal-login')}
            className="flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition border border-rose-400/30 active:scale-95 cursor-pointer"
            title="Sign out of Teacher Portal"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
          <SchoolLogoBadge size="md" className="bg-white/10 p-1 rounded-2xl" />
        </div>
      </div>

      {/* Class Assignment Status & Selection Logic */}
      {assignedClasses.length === 0 ? (
        /* Zero Assigned Classes: Restrict access */
        <div className="p-6 bg-rose-50 border-2 border-rose-200 text-rose-900 rounded-3xl text-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
          <div className="p-3 bg-rose-100 rounded-2xl shrink-0">
            <AlertTriangle className="w-7 h-7 text-rose-600" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-rose-950 font-['Cinzel',serif]">
              Class Access Restricted: No Classes Assigned
            </h3>
            <p className="text-xs text-rose-800 leading-relaxed">
              Your instructor account does not currently have any assigned classes. In accordance with school security policy, access to student records, attendance registers, marks entry, and assignment distribution is restricted to authorized classes only.
            </p>
            <p className="text-[11px] text-rose-700 font-semibold pt-1">
              Please contact the school office at <a href="mailto:amanijacademy@gmail.com" className="underline font-bold">amanijacademy@gmail.com</a> or notify the Chief Administrator to configure your class assignments.
            </p>
          </div>
        </div>
      ) : assignedClasses.length === 1 ? (
        /* Single Assigned Class: Direct Access without selection screen */
        <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 rounded-2xl text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-emerald-900 flex items-center gap-2">
                <span>Direct Class Access:</span>
                <span className="px-2.5 py-0.5 bg-[#0F1E36] text-amber-300 rounded-lg text-xs font-extrabold tracking-wide">
                  {assignedClasses[0]}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                You have one assigned class. Your portal has automatically routed directly to this cohort for learner records, marks, attendance, and coursework.
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-emerald-800 bg-white/80 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Strict Cohort Isolation Active</span>
          </div>
        </div>
      ) : (
        /* Multiple Assigned Classes: Display only those assigned classes for teacher selection */
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-['Cinzel',serif]">
                Select Active Assigned Class ({assignedClasses.length} Cohorts)
              </h2>
            </div>
            <p className="text-[11px] text-slate-500">
              Displaying only classes assigned to your account. Select a cohort to switch your active workspace:
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {assignedClasses.map((cls) => {
              const isSelected = selectedClass === cls;
              return (
                <button
                  key={cls}
                  type="button"
                  onClick={() => setSelectedClass(cls)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    isSelected
                      ? 'bg-[#0F1E36] text-amber-300 border-[#0F1E36] shadow-md shadow-slate-900/10'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <GraduationCap className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{cls}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm scrollbar-none">
        <button
          onClick={() => setActiveTab('learners')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            activeTab === 'learners'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-amber-400" />
          <span>Learner Registration & Roster</span>
        </button>

        <button
          onClick={() => setActiveTab('marks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            activeTab === 'marks'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Continuous Assessment & Grading</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Class Attendance Register</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            activeTab === 'assignments'
              ? 'bg-[#0F1E36] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Coursework & Handouts</span>
        </button>
      </div>

      {/* Main Tab Render */}
      <div>
        {activeTab === 'learners' && (
          <TeacherStudentRegistrationTab
            teacherId={currentUser.id}
            teacherName={currentUser.name}
            assignedClasses={assignedClasses}
            selectedClass={selectedClass}
            onSelectClass={(cls) => setSelectedClass(cls)}
          />
        )}

        {activeTab === 'marks' && (
          <TeacherMarksEntryTab
            teacherId={currentUser.id}
            teacherName={currentUser.name}
            assignedClasses={assignedClasses}
            assignedSubjects={assignedSubjects}
            settings={settings}
            selectedClass={selectedClass}
            onSelectClass={(cls) => setSelectedClass(cls)}
          />
        )}

        {activeTab === 'attendance' && (
          <TeacherAttendanceTab
            teacherId={currentUser.id}
            teacherName={currentUser.name}
            assignedClasses={assignedClasses}
            selectedClass={selectedClass}
            onSelectClass={(cls) => setSelectedClass(cls)}
          />
        )}

        {activeTab === 'assignments' && (
          <TeacherAssignmentsTab
            teacherId={currentUser.id}
            teacherName={currentUser.name}
            assignedClasses={assignedClasses}
            assignedSubjects={assignedSubjects}
            selectedClass={selectedClass}
            onSelectClass={(cls) => setSelectedClass(cls)}
          />
        )}
      </div>

      {/* Infinite Academic Calendar Modal */}
      <InfiniteCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={new Date().toISOString().split('T')[0]}
        onSelectDate={() => {}}
        title="Faculty Academic Calendar"
        subtitle="School term dates, examination weeks, and reporting deadlines across all academic years."
      />
    </div>
  );
};
