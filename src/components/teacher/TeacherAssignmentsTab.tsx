import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../../services/api';
import { Assignment } from '../../types';
import {
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Eye,
  Trash2,
  Paperclip,
  X,
  FileCheck,
  Upload,
  Search,
  BookOpen,
  Filter,
  Sparkles,
} from 'lucide-react';
import { generateAssignmentPdf, downloadAssignmentPdf } from '../../utils/pdfGenerator';
import { useCentralSync } from '../../hooks/useCentralSync';

interface Props {
  teacherId: string;
  teacherName: string;
  assignedClasses: string[];
  assignedSubjects: string[];
  isAdmin?: boolean;
  selectedClass?: string;
  onSelectClass?: (cls: string) => void;
}

const DOCUMENT_CATEGORIES = [
  'Homework Assignment',
  'Continuous Assessment (CAT)',
  'Holiday Revision Paper',
  'CBC Project / Practical',
  'Study Notes / Learning Handout',
  'Exam Past Paper',
];

export const TeacherAssignmentsTab: React.FC<Props> = ({
  teacherId,
  teacherName,
  assignedClasses,
  assignedSubjects,
  isAdmin = false,
  selectedClass: selectedClassProp,
  onSelectClass,
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters & Search
  const [filterClass, setFilterClass] = useState<string>(
    selectedClassProp || (assignedClasses.length === 1 ? assignedClasses[0] : 'ALL')
  );
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [className, setClassName] = useState(selectedClassProp || assignedClasses[0] || 'Grade 7A (JSS)');
  const uniqueAssignedSubjects = useMemo(() => {
    return Array.from(new Set(assignedSubjects || []));
  }, [assignedSubjects]);

  const [subjectName, setSubjectName] = useState(uniqueAssignedSubjects[0] || 'Mathematics');
  const [category, setCategory] = useState('Homework Assignment');
  const [dueDate, setDueDate] = useState('2026-04-10');
  const [description, setDescription] = useState('');
  const [attachmentData, setAttachmentData] = useState<string | null>(null);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // PDF Preview State
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewPdfTitle, setPreviewPdfTitle] = useState<string>('');
  const [previewAssignment, setPreviewAssignment] = useState<Assignment | null>(null);

  const isAdministrator = isAdmin || teacherId.includes('admin');

  const fetchAssignments = async () => {
    if (!isAdministrator && assignedClasses.length === 0) {
      setAssignments([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      // If administrator, retrieve across all classes; if teacher, retrieve for their assigned scope
      const data = await api.getAssignments(undefined, undefined, isAdministrator ? undefined : teacherId);
      setAssignments(data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Real-time synchronization
  useCentralSync(fetchAssignments);

  useEffect(() => {
    fetchAssignments();
  }, [teacherId, isAdministrator]);

  useEffect(() => {
    if (selectedClassProp) {
      setClassName(selectedClassProp);
      if (assignedClasses.length === 1) {
        setFilterClass(selectedClassProp);
      }
    }
  }, [selectedClassProp, assignedClasses]);

  useEffect(() => {
    if (assignedClasses.length > 0 && !assignedClasses.includes(className)) {
      setClassName(assignedClasses[0]);
    }
  }, [assignedClasses]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds 15MB limit. Please select a smaller PDF document.');
      return;
    }

    const formatSize = (bytes: number) => {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const sizeStr = formatSize(file.size);
    const reader = new FileReader();
    reader.onload = () => {
      setAttachmentData(reader.result as string);
      setAttachmentName(file.name);
      setFileSize(sizeStr);

      // Auto-suggest clear title if user hasn't typed one yet
      if (!title.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setTitle(cleanName);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePublishAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please provide a clear title for the PDF document.');
      return;
    }

    setIsPublishing(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await api.createAssignment({
        title: title.trim(),
        className,
        subjectName,
        dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        description: description.trim(),
        instructions: description.trim() || 'Refer to the attached official PDF document for coursework tasks.',
        teacherId,
        teacherName: isAdministrator ? `${teacherName} (Admin)` : teacherName,
        attachmentUrl: attachmentData || undefined,
        attachmentName: attachmentName || undefined,
        fileSize: fileSize || undefined,
        category,
        createdAt: new Date().toISOString().split('T')[0],
      });

      setTitle('');
      setDescription('');
      setAttachmentData(null);
      setAttachmentName(null);
      setFileSize(null);
      setStatusMessage(`PDF document "${title}" uploaded and published successfully! It is now accessible to learners and parents.`);
      await fetchAssignments();
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload PDF assignment.');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteAssignment = async (id: string, docTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${docTitle}"?`)) return;
    try {
      await api.deleteAssignment(id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      setStatusMessage(`Document "${docTitle}" deleted.`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to delete assignment document');
    }
  };

  const handleDownloadPdf = (assignment: Assignment) => {
    downloadAssignmentPdf(assignment);
  };

  const handlePreviewPdf = (assignment: Assignment) => {
    setPreviewAssignment(assignment);
    setPreviewPdfTitle(assignment.title);

    if (assignment.attachmentUrl && (assignment.attachmentUrl.startsWith('data:application/pdf') || assignment.attachmentUrl.endsWith('.pdf'))) {
      setPreviewPdfUrl(assignment.attachmentUrl);
      return;
    }

    try {
      const doc = generateAssignmentPdf(assignment, false);
      const blob = doc.output('bloburl');
      setPreviewPdfUrl(blob.toString());
    } catch (e) {
      console.error('Error previewing PDF:', e);
      if (assignment.attachmentUrl) {
        setPreviewPdfUrl(assignment.attachmentUrl);
      }
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    // Class access filter: for teachers, restricted to their assigned classes
    if (!isAdministrator && assignedClasses.length > 0) {
      const belongsToTeacher = assignedClasses.some(
        (c) =>
          a.className.toLowerCase() === c.toLowerCase() ||
          a.className.toLowerCase().includes(c.toLowerCase()) ||
          c.toLowerCase().includes(a.className.toLowerCase())
      );
      if (!belongsToTeacher) return false;
    }

    // UI Class selector filter
    if (filterClass !== 'ALL') {
      const matchesClass =
        a.className.toLowerCase() === filterClass.toLowerCase() ||
        a.className.toLowerCase().includes(filterClass.toLowerCase()) ||
        filterClass.toLowerCase().includes(a.className.toLowerCase());
      if (!matchesClass) return false;
    }

    // Category filter
    if (filterCategory !== 'ALL' && a.category && a.category !== filterCategory) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = a.title.toLowerCase().includes(q);
      const matchesDesc = (a.description || a.instructions || '').toLowerCase().includes(q);
      const matchesSub = a.subjectName.toLowerCase().includes(q);
      const matchesFile = (a.attachmentName || '').toLowerCase().includes(q);
      if (!matchesTitle && !matchesDesc && !matchesSub && !matchesFile) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAdministrator ? 'Institutional PDF Assignment & Document System' : 'Classroom PDF Assignments & Handouts'}</span>
          </div>
          <h2 className="text-xl font-bold text-[#0F1E36]">
            {isAdministrator ? 'All School PDF Assignments & Learning Documents' : 'My Class PDF Assignments & Documents'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isAdministrator
              ? 'Administrators have global access across all classes. Upload, view, and download PDF assignments and curriculum documents for any class.'
              : `Upload and manage PDF assignments and learning documents for your assigned classes (${assignedClasses.join(', ')}).`}
          </p>
        </div>

        <button
          onClick={fetchAssignments}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 self-start cursor-pointer"
        >
          <span>Refresh List</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 flex items-center gap-3 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-800 rounded-2xl border border-red-200 flex items-center gap-3 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Upload Form + Previously Uploaded Documents */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Upload Form Column */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Upload className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-[#0F1E36] font-['Cinzel',serif]">
              Upload PDF Assignment / Document
            </h3>
          </div>

          <form onSubmit={handlePublishAssignment} className="space-y-3.5 text-xs">
            {/* Dedicated PDF File Upload Input */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Select PDF Document *</label>
              <div className="border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-2xl p-4 text-center transition bg-slate-50 relative">
                <input
                  type="file"
                  id="pdf-assignment-upload-input"
                  accept="application/pdf,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="pdf-assignment-upload-input"
                  className="cursor-pointer flex flex-col items-center gap-1.5 text-slate-600"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {attachmentName ? attachmentName : 'Click to select PDF document'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {fileSize ? `Size: ${fileSize} • Ready to upload` : 'Supported: .PDF (Max 15MB)'}
                  </span>
                </label>

                {attachmentName && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md text-[10px] font-semibold">
                      PDF Attached
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAttachmentData(null);
                        setAttachmentName(null);
                        setFileSize(null);
                      }}
                      className="text-[11px] text-red-600 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" /> Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Clear Title */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Document / Assignment Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mathematics Term 1 Holiday Revision Worksheet"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 font-semibold focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Class Selection */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Class *</label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800 outline-none"
              >
                {assignedClasses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {isAdministrator
                  ? 'Administrator privilege: global access to all classes.'
                  : 'Restricted strictly to your assigned teaching classes.'}
              </p>
            </div>

            {/* Document Category */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Document Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800 outline-none"
              >
                {DOCUMENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Subject *</label>
              <select
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800 outline-none"
              >
                {uniqueAssignedSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Short Description */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Short Description / Instructions (Optional)</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of the document, required CBC competencies, or completion instructions..."
                className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Submission Date */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Submission / Review Deadline</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-800 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isPublishing}
              className="w-full py-2.5 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>{isPublishing ? 'Uploading & Publishing...' : 'Upload & Publish PDF'}</span>
            </button>
          </form>
        </div>

        {/* Previously Uploaded PDFs List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Controls Bar: Search & Filters */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-[#0F1E36] font-['Cinzel',serif]">
                  Previously Uploaded PDFs ({filteredAssignments.length})
                </h3>
              </div>

              {/* Class Filter */}
              <div className="flex items-center gap-2">
                {assignedClasses.length === 1 && !isAdministrator ? (
                  <span className="px-3 py-1.5 bg-[#0F1E36] text-amber-300 text-xs font-bold rounded-xl border border-slate-700 shadow-sm">
                    {assignedClasses[0]}
                  </span>
                ) : (
                  <select
                    value={filterClass}
                    onChange={(e) => {
                      setFilterClass(e.target.value);
                      if (onSelectClass && e.target.value !== 'ALL') {
                        onSelectClass(e.target.value);
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl outline-none"
                  >
                    <option value="ALL">{isAdministrator ? 'All School Classes' : `All My Classes (${assignedClasses.length})`}</option>
                    {assignedClasses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl outline-none hidden sm:block"
                >
                  <option value="ALL">All Categories</option>
                  {DOCUMENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search previously uploaded PDFs by title, subject, or description..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* List of PDFs */}
          <div className="space-y-3.5">
            {isLoading ? (
              <div className="p-10 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                Loading previously uploaded PDF documents...
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="p-10 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-sm text-slate-700">No PDF documents found</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery || filterClass !== 'ALL'
                    ? 'No uploaded documents matched your current search or class filters.'
                    : 'No documents uploaded yet. Use the upload panel to publish PDF assignments for your classes.'}
                </p>
              </div>
            ) : (
              filteredAssignments.map((docItem) => (
                <div
                  key={docItem.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-amber-300 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                          {docItem.className}
                        </span>
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md text-[10px] font-bold border border-amber-200">
                          {docItem.category || 'Assignment'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">{docItem.subjectName}</span>
                      </div>

                      <h4 className="font-bold text-sm sm:text-base text-slate-900">{docItem.title}</h4>

                      {docItem.attachmentName && (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 font-medium">
                          <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-800">{docItem.attachmentName}</span>
                          {docItem.fileSize && (
                            <span className="text-slate-400 font-mono">({docItem.fileSize})</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-right text-xs shrink-0">
                      <span className="text-slate-400">Due / Date: </span>
                      <span className="font-mono font-bold text-red-600">{docItem.dueDate}</span>
                    </div>
                  </div>

                  {(docItem.description || docItem.instructions) && (
                    <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      {docItem.description || docItem.instructions}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div className="text-slate-400">
                      <span>Uploaded by: <strong className="text-slate-600">{docItem.teacherName || teacherName}</strong></span>
                      <span className="mx-2">&bull;</span>
                      <span>Date: {docItem.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handlePreviewPdf(docItem)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition cursor-pointer"
                        title="Preview PDF Document"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>Preview PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadPdf(docItem)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-[#0F1E36] rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
                        title="Download uploaded PDF document"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAssignment(docItem.id, docItem.title)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* PDF Modal Preview */}
      {previewPdfUrl && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-[#0F1E36] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-[#0F1E36] flex items-center justify-center font-bold text-xs">
                  PDF
                </div>
                <div>
                  <h3 className="font-bold text-sm truncate max-w-md sm:max-w-lg">{previewPdfTitle}</h3>
                  <p className="text-[10px] text-amber-300">Official Amani Junior Academy Document</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {previewAssignment && (
                  <button
                    onClick={() => handleDownloadPdf(previewAssignment)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-[#0F1E36] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setPreviewPdfUrl(null);
                    setPreviewAssignment(null);
                  }}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-slate-100 relative">
              <iframe
                src={previewPdfUrl}
                title="Assignment Handout PDF Preview"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
