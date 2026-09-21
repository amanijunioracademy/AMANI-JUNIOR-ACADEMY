import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FeeStructureItem, initialFeeStructures } from '../../data/feeStructuresData';
import { generateFeeStructurePdf, downloadFeeStructure } from '../../utils/pdfGenerator';
import {
  FileText,
  Upload,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  Plus,
  Trash2,
  Save,
  X,
  Building2,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const FeeStructureManagementTab: React.FC = () => {
  const [feeStructures, setFeeStructures] = useState<FeeStructureItem[]>(initialFeeStructures);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<FeeStructureItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // File Upload State for replacement PDF
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState<string>('');

  // New Structure State
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Grade 1 - 6');
  const [newGrades, setNewGrades] = useState('Grade 1, Grade 2, Grade 3');
  const [newTerm1, setNewTerm1] = useState(15000);
  const [newTerm2, setNewTerm2] = useState(15000);
  const [newTerm3, setNewTerm3] = useState(15000);

  const fetchFeeStructures = async () => {
    setIsLoading(true);
    try {
      const data = await api.getFeeStructures();
      if (Array.isArray(data) && data.length > 0) {
        setFeeStructures(data);
      }
    } catch (err) {
      console.error('Error fetching fee structures:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const handleOpenEdit = (item: FeeStructureItem) => {
    setEditingItem(JSON.parse(JSON.stringify(item)));
    setErrorMessage(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await api.updateFeeStructure(editingItem.id, {
        title: editingItem.title,
        rows: editingItem.rows,
        extraRowNote: editingItem.extraRowNote,
        otherPayments: editingItem.otherPayments,
        requirements: editingItem.requirements,
        feesPolicy: editingItem.feesPolicy,
        uniforms: editingItem.uniforms,
        bankAccounts: editingItem.bankAccounts,
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'School Administrator',
      });

      setSuccessMessage(`Fee structure for "${editingItem.title}" updated successfully! Changes are live immediately.`);
      setEditingItem(null);
      await fetchFeeStructures();
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update fee structure.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRowChange = (index: number, field: 'term1' | 'term2' | 'term3' | 'gradeOrItem', value: any) => {
    if (!editingItem) return;
    const updatedRows = [...editingItem.rows];
    const row = { ...updatedRows[index] };

    if (field === 'gradeOrItem') {
      row.gradeOrItem = value;
    } else {
      const numVal = Number(value) || 0;
      row[field] = numVal;
      row.yearTotal = row.term1 + row.term2 + row.term3;
    }

    updatedRows[index] = row;
    setEditingItem({ ...editingItem, rows: updatedRows });
  };

  const handleFileUpload = async (itemId: string, file: File) => {
    if (!file) return;
    setIsSaving(true);
    setErrorMessage(null);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        await api.uploadFeeStructurePdf(itemId, base64Data, file.name);
        if (uploadTitle.trim()) {
          await api.updateFeeStructure(itemId, { title: uploadTitle.trim() });
        }
        setSuccessMessage(`Custom PDF "${file.name}" uploaded successfully! Visible immediately on the public website.`);
        setUploadTargetId(null);
        setUploadFile(null);
        setUploadTitle('');
        await fetchFeeStructures();
        setTimeout(() => setSuccessMessage(null), 5000);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload custom PDF.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearCustomPdf = async (itemId: string, title: string) => {
    if (!window.confirm(`Revert "${title}" back to standard system template PDF?`)) return;
    try {
      await api.clearFeeStructurePdf(itemId);
      setSuccessMessage(`Custom PDF for "${title}" cleared. Standard institutional template is now active.`);
      await fetchFeeStructures();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to clear custom PDF.');
    }
  };

  const handleDeleteStructure = async (itemId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to completely delete fee schedule "${title}"?`)) return;
    try {
      await api.deleteFeeStructure(itemId);
      setSuccessMessage(`Fee schedule "${title}" deleted.`);
      await fetchFeeStructures();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete fee schedule.');
    }
  };

  const handleCreateNewStructure = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSaving(true);
    try {
      const gradesArray = newGrades.split(',').map((g) => g.trim()).filter(Boolean);
      await api.createFeeStructure({
        title: newTitle.trim(),
        category: newCategory,
        applicableGrades: gradesArray.length > 0 ? gradesArray : [newTitle.trim()],
        tableHeaders: ['PARTICULARS', 'TERM 1', 'TERM 2', 'TERM 3', 'TOTAL (YEAR)'],
        rows: [
          {
            gradeOrItem: 'Tuition & Academic Levies',
            term1: Number(newTerm1) || 0,
            term2: Number(newTerm2) || 0,
            term3: Number(newTerm3) || 0,
            yearTotal: (Number(newTerm1) || 0) + (Number(newTerm2) || 0) + (Number(newTerm3) || 0),
          },
          {
            gradeOrItem: 'TOTAL',
            term1: Number(newTerm1) || 0,
            term2: Number(newTerm2) || 0,
            term3: Number(newTerm3) || 0,
            yearTotal: (Number(newTerm1) || 0) + (Number(newTerm2) || 0) + (Number(newTerm3) || 0),
          },
        ],
        extraRowNote: 'All fees are due on or before the first day of each term.',
        otherPayments: [
          { item: 'Admission & Assessment Fee', amount: 'KES 2,000 (New learners once)' },
          { item: 'CBC Assessment Materials & Book Levies', amount: 'Included in Tuition' },
        ],
        requirements: [
          '2 Reams of Printing Paper (A4) per term',
          'Mathematical Set & CBC Exercise Books',
          'Clean official uniform according to school code',
        ],
        feesPolicy:
          '1. All fees must be deposited directly to approved school bank accounts or Lipa na M-Pesa. 2. Cash is strictly NOT accepted at the school accounts desk.',
        uniforms: {
          boys: 'Navy blue trousers/shorts, sky blue shirt, institutional tie, and branded school sweater.',
          girls: 'Navy blue skirt/pinafore, sky blue blouse, institutional tie, and branded school sweater.',
        },
        bankAccounts: [
          {
            method: 'Cooperative Bank',
            details: 'Account Name: Amani Junior Academy, Branch: Mazeras, Acc No: 01129482049100',
          },
          {
            method: 'Lipa Na M-Pesa (Paybill)',
            details: 'Business No: 400200, Account No: 01129482049100#LearnerAdm',
          },
        ],
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: 'School Administrator',
      });

      setSuccessMessage(`New fee schedule "${newTitle}" created and published!`);
      setIsCreatingNew(false);
      setNewTitle('');
      await fetchFeeStructures();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create new fee schedule.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-200">
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Public Website Fee Schedules</span>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Fee Structure Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload, replace, edit, or update fee structures at any time. Changes appear immediately on the public website without requiring code updates.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start">
          <button
            onClick={() => setIsCreatingNew(true)}
            className="px-4 py-2 bg-[#0F1E36] hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>New Fee Schedule</span>
          </button>
          <button
            onClick={fetchFeeStructures}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 flex items-center gap-3 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 text-red-800 rounded-2xl border border-red-200 flex items-center gap-3 text-xs font-semibold">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Fee Structure Cards */}
      <div className="grid grid-cols-1 gap-6">
        {feeStructures.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                    {item.category}
                  </span>
                  {item.customPdfName && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>Custom PDF Active</span>
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#0F1E36]">{item.title}</h3>
                <p className="text-xs text-slate-500">
                  Applicable: {item.applicableGrades.join(', ')} &bull; Last updated:{' '}
                  <strong className="text-slate-700">{item.lastUpdated}</strong> by {item.updatedBy}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => downloadFeeStructure(item)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  title="Download current fee structure PDF"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => {
                    setUploadTargetId(item.id);
                    setUploadTitle(item.title);
                  }}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>Upload / Replace PDF</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(item)}
                  className="px-4 py-1.5 bg-[#0F1E36] hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Edit2 className="w-4 h-4 text-amber-400" />
                  <span>Edit Structure Figures</span>
                </button>

                {item.customPdfUrl && (
                  <button
                    onClick={() => handleClearCustomPdf(item.id, item.title)}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 hover:border-red-200 text-xs font-medium rounded-xl transition flex items-center gap-1 cursor-pointer"
                    title="Revert back to standard dynamic template PDF"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Custom PDF</span>
                  </button>
                )}

                {feeStructures.length > 1 && (
                  <button
                    onClick={() => handleDeleteStructure(item.id, item.title)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    title="Delete this fee schedule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Preview Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    {item.tableHeaders.map((th, idx) => (
                      <th key={idx} className={`py-2 px-3 ${idx === 0 ? 'text-left' : 'text-right'}`}>
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {item.rows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={row.gradeOrItem === 'TOTAL' ? 'bg-amber-50/70 font-bold text-[#0F1E36]' : ''}
                    >
                      <td className="py-2 px-3 font-semibold">{row.gradeOrItem}</td>
                      <td className="py-2 px-3 text-right font-mono">KES {row.term1.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-mono">KES {row.term2.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-mono">KES {row.term3.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold">KES {row.yearTotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {item.customPdfName && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                <span>Active Custom Upload: <strong>{item.customPdfName}</strong> (Immediate public download)</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Overriding standard template</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal: Upload / Replace Custom PDF */}
      {uploadTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm">Upload / Replace Fee PDF</h3>
              <button onClick={() => setUploadTargetId(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Select an official signed PDF document. Once uploaded, the updated version immediately appears on the website and is available for public download without requiring code updates.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Fee Schedule Title</label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. 2026 Primary School Fee Structure (Grade 1 - 6)"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-amber-500"
              />
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-2 hover:border-amber-400 transition bg-slate-50">
              <Upload className="w-8 h-8 text-amber-500 mx-auto" />
              <input
                type="file"
                accept=".pdf,application/pdf"
                id="fee-pdf-input"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadFile(e.target.files[0]);
                  }
                }}
              />
              <label
                htmlFor="fee-pdf-input"
                className="cursor-pointer block text-xs font-bold text-amber-700 hover:underline"
              >
                {uploadFile ? uploadFile.name : 'Click to browse PDF file from device'}
              </label>
              <span className="text-[10px] text-slate-400 block">Accepted formats: .PDF (Max 15MB)</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setUploadTargetId(null);
                  setUploadFile(null);
                  setUploadTitle('');
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs rounded-xl font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!uploadFile || isSaving}
                onClick={() => uploadTargetId && uploadFile && handleFileUpload(uploadTargetId, uploadFile)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-[#0F1E36] font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {isSaving ? 'Uploading...' : 'Save & Publish Immediately'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create New Fee Schedule */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Add New Fee Schedule Category</h3>
              <button onClick={() => setIsCreatingNew(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewStructure} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Fee Schedule Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 2026 Pre-Primary (PP1 & PP2) Fee Structure"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold text-slate-800 outline-none"
                  >
                    <option value="Pre-Primary">Pre-Primary (Playgroup, PP1, PP2)</option>
                    <option value="Grade 1 - 6">Grade 1 - 6 (Primary)</option>
                    <option value="Grade 7">Grade 7 (Junior Secondary)</option>
                    <option value="Grade 8">Grade 8 (Junior Secondary)</option>
                    <option value="Grade 9">Grade 9 (Junior Secondary)</option>
                    <option value="Special Programmes">Special Programmes & Boarding</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Applicable Grades</label>
                  <input
                    type="text"
                    value={newGrades}
                    onChange={(e) => setNewGrades(e.target.value)}
                    placeholder="e.g. PP1, PP2"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-bold text-slate-700 block">Tuition Levies per Term (KES)</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Term 1 (KES)</label>
                    <input
                      type="number"
                      required
                      value={newTerm1}
                      onChange={(e) => setNewTerm1(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Term 2 (KES)</label>
                    <input
                      type="number"
                      required
                      value={newTerm2}
                      onChange={(e) => setNewTerm2(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Term 3 (KES)</label>
                    <input
                      type="number"
                      required
                      value={newTerm3}
                      onChange={(e) => setNewTerm3(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono text-slate-800"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 text-right">
                  Estimated Year Total: <strong className="text-slate-800">KES {(Number(newTerm1) + Number(newTerm2) + Number(newTerm3)).toLocaleString()}</strong>
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0F1E36] hover:bg-amber-600 text-white font-bold rounded-xl transition shadow-sm cursor-pointer"
                >
                  {isSaving ? 'Creating...' : 'Create & Publish Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Fee Structure Values */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 space-y-5 border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Edit {editingItem.title}</h3>
                <span className="text-xs text-slate-500">Update amounts per term and official payment terms</span>
              </div>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-5 text-xs">
              {/* Rows Editor */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">Fee Breakdown Table</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#0F1E36] text-white">
                      <tr>
                        <th className="p-2.5">Class / Item</th>
                        <th className="p-2.5 text-right">Term 1 (KES)</th>
                        <th className="p-2.5 text-right">Term 2 (KES)</th>
                        <th className="p-2.5 text-right">Term 3 (KES)</th>
                        <th className="p-2.5 text-right">Year Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editingItem.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2">
                            <input
                              type="text"
                              value={row.gradeOrItem}
                              onChange={(e) => handleRowChange(idx, 'gradeOrItem', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded font-semibold text-slate-800"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={row.term1}
                              onChange={(e) => handleRowChange(idx, 'term1', e.target.value)}
                              className="w-24 px-2 py-1 border border-slate-200 rounded text-right font-mono"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={row.term2}
                              onChange={(e) => handleRowChange(idx, 'term2', e.target.value)}
                              className="w-24 px-2 py-1 border border-slate-200 rounded text-right font-mono"
                            />
                          </td>
                          <td className="p-2 text-right">
                            <input
                              type="number"
                              value={row.term3}
                              onChange={(e) => handleRowChange(idx, 'term3', e.target.value)}
                              className="w-24 px-2 py-1 border border-slate-200 rounded text-right font-mono"
                            />
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-slate-800">
                            {row.yearTotal.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Extra note */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Additional Table Note / Computer Fee</label>
                <input
                  type="text"
                  value={editingItem.extraRowNote || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, extraRowNote: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Fees Policy */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Fees Policy</label>
                <textarea
                  rows={3}
                  value={editingItem.feesPolicy}
                  onChange={(e) => setEditingItem({ ...editingItem, feesPolicy: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4 text-amber-400" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
