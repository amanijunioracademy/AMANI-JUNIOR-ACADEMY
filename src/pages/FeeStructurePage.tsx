import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { FeeStructureItem, initialFeeStructures } from '../data/feeStructuresData';
import { generateFeeStructurePdf } from '../utils/pdfGenerator';
import {
  FileText,
  Download,
  Eye,
  CreditCard,
  Building2,
  Phone,
  ShieldCheck,
  Clock,
  Calendar,
  Sparkles,
  Info,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  X,
  Printer,
  Search,
} from 'lucide-react';

export const FeeStructurePage: React.FC = () => {
  const { navigate, openAdmissionModal } = useApp();
  const [feeStructures, setFeeStructures] = useState<FeeStructureItem[]>(initialFeeStructures);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewItem, setPreviewItem] = useState<FeeStructureItem | null>(null);

  const fetchFeeStructures = async () => {
    setIsLoading(true);
    try {
      const data = await api.getFeeStructures();
      if (Array.isArray(data) && data.length > 0) {
        setFeeStructures(data);
      }
    } catch (err) {
      console.error('Error loading fee structures:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const handleDownloadPdf = (item: FeeStructureItem) => {
    if (item.customPdfUrl) {
      // If a custom PDF was uploaded by administrator
      const link = document.createElement('a');
      link.href = item.customPdfUrl;
      link.download = item.customPdfName || `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      generateFeeStructurePdf(item, true);
    }
  };

  const filteredStructures = feeStructures.filter((item) => {
    const matchesCategory =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'Grade 1 - 6' && item.category === 'Grade 1 - 6') ||
      (selectedCategory === 'Grade 7' && item.category === 'Grade 7') ||
      (selectedCategory === 'Grade 8' && item.category === 'Grade 8');

    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.applicableGrades.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-[#0A1628] via-[#0F1E36] to-[#1E293B] text-white py-16 px-4 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2026 Official Academic Year Schedules</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                School Fee Structures
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Clear, transparent, and approved tuition schedules for Amani Junior Academy &amp; Junior Secondary School.
                Open or download official PDF fee sheets directly for Early Years, Primary (Grade 1 - 6), and JSS (Grade 7 &amp; Grade 8).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => openAdmissionModal()}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-[#0F1E36] font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                <span>Admission Enquiry</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('contact')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Bursar Enquiries</span>
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white">Direct School Bank Accounts:</span> KCB Bank Account No.{' '}
                <strong className="text-amber-300">1169273831</strong> &bull; Primary M-Pesa Paybill:{' '}
                <strong className="text-amber-300">522123</strong> (Acc: 62138K + Pupil Name) &bull; JSS Paybill:{' '}
                <strong className="text-amber-300">4404404</strong> (Acc: PB0755 + Pupil Name)
              </div>
            </div>
            <div className="text-slate-400 shrink-0 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ministry Reg: MoE/PRI/2026/089</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* Controls: Search & Categories */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Fee Structures' },
              { id: 'Grade 1 - 6', label: 'Grade 1 to Grade 6 (& ECD)' },
              { id: 'Grade 7', label: 'Grade 7 (JSS)' },
              { id: 'Grade 8', label: 'Grade 8 (JSS)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedCategory === tab.id
                    ? 'bg-[#0F1E36] text-amber-300 shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by grade or item..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-800"
            />
          </div>
        </div>

        {/* Fee Structures Grid */}
        <div className="space-y-8">
          {filteredStructures.map((fee) => (
            <div
              key={fee.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition hover:shadow-md"
            >
              {/* Card Header */}
              <div className="bg-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{fee.category}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{fee.title}</h2>
                  <p className="text-xs text-slate-300">
                    Applicable to: {fee.applicableGrades.join(', ')} &bull; Last updated:{' '}
                    <span className="text-amber-300 font-medium">{fee.lastUpdated}</span> by {fee.updatedBy}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setPreviewItem(fee)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-amber-300" />
                    <span>Open / Preview PDF</span>
                  </button>
                  <button
                    onClick={() => handleDownloadPdf(fee)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-[#0F1E36] text-xs font-bold rounded-xl transition shadow-md flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 space-y-6">
                {/* Tuition Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#0F1E36] text-white">
                      <tr>
                        {fee.tableHeaders.map((th, idx) => (
                          <th
                            key={idx}
                            className={`py-3 px-4 font-bold ${idx === 0 ? 'text-left' : 'text-right'}`}
                          >
                            {th}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {fee.rows.map((row, rIdx) => {
                        const isTotal = row.gradeOrItem === 'TOTAL';
                        return (
                          <tr
                            key={rIdx}
                            className={`hover:bg-slate-50 transition ${
                              isTotal ? 'bg-amber-50 font-bold text-[#0F1E36]' : 'text-slate-700'
                            }`}
                          >
                            <td className="py-2.5 px-4 font-bold">{row.gradeOrItem}</td>
                            <td className="py-2.5 px-4 text-right font-mono">
                              KES {row.term1.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono">
                              KES {row.term2.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono">
                              KES {row.term3.toLocaleString()}
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono text-[#0F1E36] font-bold">
                              KES {row.yearTotal.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {fee.extraRowNote && (
                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{fee.extraRowNote}</span>
                  </div>
                )}

                {/* Two-Column Grid: Other Payments & Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Left Column: Other Payments */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      <span>Other Approved School Payments</span>
                    </h3>
                    <div className="space-y-1.5 text-xs">
                      {fee.otherPayments.map((op, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-1 border-b border-slate-200/70 last:border-0"
                        >
                          <span className="text-slate-600 font-medium">{op.item}</span>
                          <span className="font-bold text-slate-800 text-right">{op.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Requirements & Uniforms */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Requirements &amp; Uniforms</span>
                    </h3>
                    <div className="space-y-2 text-xs text-slate-600">
                      <div>
                        <span className="font-bold text-slate-700 block mb-1">Documents &amp; Essentials:</span>
                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                          {fee.requirements.map((req, rIdx) => (
                            <li key={rIdx}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      {fee.uniforms.boys && (
                        <div className="pt-2 border-t border-slate-200/70">
                          <span className="font-bold text-slate-700 block">Boys Uniform:</span>
                          <p className="text-slate-600">{fee.uniforms.boys}</p>
                        </div>
                      )}
                      {fee.uniforms.girls && (
                        <div>
                          <span className="font-bold text-slate-700 block">Girls Uniform:</span>
                          <p className="text-slate-600">{fee.uniforms.girls}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Official Fees Policy & Bank Accounts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl space-y-1 text-xs text-red-900">
                    <span className="font-bold block uppercase tracking-wider text-red-800">
                      Official Fees Policy:
                    </span>
                    <p className="leading-relaxed text-red-950 font-medium">{fee.feesPolicy}</p>
                  </div>

                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950">
                    <span className="font-bold block uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-700" />
                      <span>Payment Banking Details:</span>
                    </span>
                    <div className="space-y-1">
                      {fee.bankAccounts.map((acc, aIdx) => (
                        <div key={aIdx} className="font-medium">
                          <strong className="text-emerald-900">{acc.method}:</strong> {acc.details}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* PDF Document Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Top Bar */}
            <div className="bg-[#0F1E36] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">{previewItem.title}</h3>
                  <span className="text-[11px] text-slate-300">Official Letterhead Document Preview</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPdf(previewItem)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-[#0F1E36] font-bold text-xs rounded-lg transition flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Document Body (Simulated Printable A4 Sheet) */}
            <div className="overflow-y-auto p-6 sm:p-8 bg-slate-100 flex-1">
              <div className="bg-white max-w-2xl mx-auto shadow-md border border-slate-300 p-8 space-y-6 text-slate-800 rounded-sm">
                {/* Institutional Letterhead */}
                <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#0F1E36] tracking-tight">
                    AMANI JUNIOR ACADEMY &amp; JUNIOR SECONDARY SCHOOL
                  </h2>
                  <p className="text-xs font-semibold text-slate-700">
                    P.O. Box 93 - 80114, Mazeras, Kenya &bull; Tel: 0718540922 / 0746529712
                  </p>
                  <p className="text-[11px] italic font-medium text-amber-700">
                    Motto: "STRIVE TO ACHIEVE" &bull; Approved 2026 Academic Year
                  </p>
                </div>

                {/* Title Banner */}
                <div className="bg-slate-100 border border-slate-300 py-2 px-4 text-center">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                    {previewItem.title}
                  </h3>
                </div>

                {/* Table */}
                <table className="w-full text-xs border border-slate-300 text-left">
                  <thead className="bg-slate-800 text-white">
                    <tr>
                      {previewItem.tableHeaders.map((th, i) => (
                        <th key={i} className={`p-2 font-bold ${i === 0 ? 'text-left' : 'text-right'}`}>
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {previewItem.rows.map((row, i) => (
                      <tr key={i} className={row.gradeOrItem === 'TOTAL' ? 'bg-amber-100/70 font-bold' : ''}>
                        <td className="p-2 font-semibold">{row.gradeOrItem}</td>
                        <td className="p-2 text-right font-mono">{row.term1.toLocaleString()}/=</td>
                        <td className="p-2 text-right font-mono">{row.term2.toLocaleString()}/=</td>
                        <td className="p-2 text-right font-mono">{row.term3.toLocaleString()}/=</td>
                        <td className="p-2 text-right font-mono font-bold">{row.yearTotal.toLocaleString()}/=</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {previewItem.extraRowNote && (
                  <p className="text-[11px] font-bold text-amber-900 bg-amber-50 p-2 border border-amber-200 rounded">
                    * {previewItem.extraRowNote}
                  </p>
                )}

                {/* Other Payments */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-900 block border-b border-slate-300 pb-1">
                    OTHER APPROVED SCHOOL PAYMENTS:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                    {previewItem.otherPayments.map((op, i) => (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span className="text-slate-600">{op.item}:</span>
                        <span className="font-bold text-slate-900">{op.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-900 block border-b border-slate-300 pb-1">
                    REQUIREMENTS &amp; UNIFORMS:
                  </span>
                  <ul className="list-disc list-inside text-[11px] space-y-0.5 text-slate-700">
                    {previewItem.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                  {previewItem.uniforms.boys && (
                    <p className="text-[11px] text-slate-700 pt-1">
                      <strong>Boys Uniform:</strong> {previewItem.uniforms.boys}
                    </p>
                  )}
                  {previewItem.uniforms.girls && (
                    <p className="text-[11px] text-slate-700">
                      <strong>Girls Uniform:</strong> {previewItem.uniforms.girls}
                    </p>
                  )}
                </div>

                {/* Fees Policy */}
                <div className="p-3 bg-red-50 border border-red-200 text-[11px] text-red-950 rounded">
                  <span className="font-bold text-red-900 block mb-0.5">FEES CLEARANCE POLICY:</span>
                  <p>{previewItem.feesPolicy}</p>
                </div>

                {/* Bank Accounts */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950 rounded space-y-1">
                  <span className="font-bold text-emerald-900 block">APPROVED PAYMENT CHANNELS:</span>
                  {previewItem.bankAccounts.map((b, i) => (
                    <p key={i}>&bull; {b.method}: <strong>{b.details}</strong></p>
                  ))}
                </div>

                {/* Stamp / Signature Line */}
                <div className="pt-4 border-t border-slate-300 flex justify-between items-end text-[11px] text-slate-600">
                  <div>
                    <span className="font-bold text-slate-800 block">Constance Mwaka Pole</span>
                    <span>School Director</span>
                  </div>
                  <div className="text-right">
                    <span className="inline-block border-2 border-emerald-700 text-emerald-800 font-bold px-2 py-1 uppercase text-[10px] rounded">
                      Official Document &bull; Validated
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">GOD BLESS YOU</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-100"
              >
                Close Preview
              </button>
              <button
                onClick={() => handleDownloadPdf(previewItem)}
                className="px-5 py-2 bg-[#0F1E36] hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Save / Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
