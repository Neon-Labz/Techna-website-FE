'use client';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Award, Download, Filter, Calendar, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const API_BASE = 'http://localhost:4000/api';

interface StudentProfile {
  _id?: string;
  studentId?: string;
  fullNameEnglish?: string;
  admissionNumber?: string;
  email?: string;
  nicNo?: string;
  whatsappNo?: string;
  phone?: string;
  batch?: string;
  role?: string;
}

interface ExamNotice {
  _id: string;
  title: string;
  moduleId: string;
  moduleName: string;
  batch: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  description?: string;
  isPublished: boolean;
}

export default function ResultsSection() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [exams, setExams] = useState<ExamNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);
      const token = useAuthStore.getState().token;

      const [profileResult, examResult] = await Promise.allSettled([
        token
          ? fetch(`${API_BASE}/auth/session`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then(async r => {
              const d = await r.json();
              return r.ok && (d?.email || d?.studentId || d?._id) ? (d as StudentProfile) : null;
            })
          : Promise.resolve(null),

        fetch(`${API_BASE}/exam-notices/public`).then(async r => {
          const d = await r.json();
          if (!r.ok) return [] as ExamNotice[];
          return (Array.isArray(d) ? d : (d?.data ?? [])) as ExamNotice[];
        }),
      ]);

      const profileData = profileResult.status === 'fulfilled' ? profileResult.value : null;
      const examData = examResult.status === 'fulfilled' ? examResult.value : [];

      console.log('Profile:', profileData);
      console.log('Exams:', examData);

      setStudent(profileData);
      setExams(examData ?? []);
      setLoading(false);
    };

    loadAll();
  }, []);

  const modules = [...new Set(exams.map(e => e.moduleName).filter(Boolean))];
  const batches = [...new Set(exams.map(e => e.batch).filter(Boolean))];

  const filtered = exams.filter(e => {
    if (moduleFilter !== 'all' && e.moduleName !== moduleFilter) return false;
    if (batchFilter !== 'all' && e.batch !== batchFilter) return false;
    return true;
  });

  const handleDownloadPDF = async () => {
    // Load logo
    let logoDataUrl = '';
    try {
      const res = await fetch('/techna-logo.png');
      if (!res.ok) throw new Error('Logo not found');
      const blob = await res.blob();
      logoDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch { /* continue without logo */ }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const footerY = pageH - 22;

    // Header
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageW, 45, 'F');

    if (logoDataUrl) {
      try {
        const mimeMatch = logoDataUrl.match(/^data:image\/(\w+);base64,/);
        const imgType = mimeMatch ? mimeMatch[1].toUpperCase() : 'PNG';
        const imgProps = doc.getImageProperties(logoDataUrl);
        const boxSize = 25;
        const ratio = imgProps.width / imgProps.height;
        const logoW = ratio >= 1 ? boxSize : boxSize * ratio;
        const logoH = ratio >= 1 ? boxSize / ratio : boxSize;
        doc.addImage(logoDataUrl, imgType, 10, 6 + (20 - logoH) / 2, logoW, logoH);
      } catch { /* skip */ }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(0, 174, 219);
    doc.text('TECHNA', pageW / 2, 18, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Email: sivasakthy22@gmail.com  |  Contact: +94 77 170 3549', pageW / 2, 26, { align: 'center' });

    doc.setDrawColor(0, 174, 219);
    doc.setLineWidth(0.5);
    doc.line(14, 30, pageW - 14, 30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(0, 174, 219);
    doc.text('STUDENT EXAM SCHEDULE', pageW / 2, 38, { align: 'center' });

    // Student info box
    let y = 52;
    doc.setFillColor(240, 250, 255);
    doc.roundedRect(14, y - 4, pageW - 28, 46, 2, 2, 'F');
    doc.setDrawColor(0, 174, 219);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, y - 4, pageW - 28, 46, 2, 2, 'S');

    const leftX = 20;
    const rightX = pageW / 2 + 10;

    const infoRow = (label: string, value: string, lx: number, iy: number) => {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(label, lx, iy);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(value || 'N/A', lx + 28, iy);
    };

    const s = student as Record<string, unknown> | null;
    const str = (key: string) => (s?.[key] as string) || 'N/A';

    infoRow('Student Name', str('fullNameEnglish'), leftX, y);
    infoRow('Admission No', str('admissionNumber'), rightX, y);
    y += 10;
    infoRow('Email', str('email'), leftX, y);
    infoRow('Generated', new Date().toLocaleDateString('en-GB'), rightX, y);
    y += 10;
    infoRow('NIC', str('nicNo'), leftX, y);
    infoRow('WhatsApp', (s?.['whatsappNo'] as string) || (s?.['phone'] as string) || 'N/A', rightX, y);
    y += 10;
    infoRow('Student ID', str('studentId'), leftX, y);
    infoRow('Batch', str('batch'), rightX, y);
    y += 12;

    // Summary strip
    doc.setFillColor(0, 174, 219);
    doc.roundedRect(14, y, pageW - 28, 14, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`Total Exams: ${filtered.length}`, 22, y + 9);
    doc.text('Exam Schedule', pageW / 2, y + 9, { align: 'center' });
    const filterNote = [
      moduleFilter !== 'all' ? moduleFilter : '',
      batchFilter !== 'all' ? batchFilter : '',
    ].filter(Boolean).join(' · ') || 'All';
    doc.text(filterNote, pageW - 22, y + 9, { align: 'right' });
    y += 20;

    // Exams table
    autoTable(doc, {
      startY: y,
      head: [['Subject', 'Title', 'Date', 'Time', 'Venue', 'Batch']],
      body: filtered.map(e => [
        e.moduleName,
        e.title,
        (() => { try { return new Date(e.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return e.date; } })(),
        `${e.startTime} – ${e.endTime}`,
        e.venue,
        e.batch,
      ]),
      headStyles: {
        fillColor: [0, 174, 219] as [number, number, number],
        textColor: [255, 255, 255] as [number, number, number],
        fontSize: 8,
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [240, 250, 255] as [number, number, number] },
      bodyStyles: { fontSize: 7.5, textColor: [30, 40, 60] as [number, number, number] },
      columnStyles: {
        0: { cellWidth: 36 },
        1: { cellWidth: 38 },
        2: { cellWidth: 24 },
        3: { cellWidth: 30 },
        4: { cellWidth: 28 },
        5: { cellWidth: 'auto' as const },
      },
      margin: { left: 14, right: 14, bottom: 28 },
      didDrawPage: () => {
        doc.setFillColor(0, 174, 219);
        doc.rect(0, footerY, pageW, 22, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text('Techna', pageW / 2, footerY + 8, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Generated by Techna · School Management System', pageW / 2, footerY + 15, { align: 'center' });
      },
    });

    doc.save(`techna-exam-schedule-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin mb-3 text-blue-700" />
        <p className="text-sm">Loading your exam schedule…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-red-400">
        <AlertCircle className="w-10 h-10 mb-3" />
        <p className="text-sm">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-3 text-blue-700 text-sm underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-800 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Award className="w-7 h-7 text-yellow-400" /> My Exam Schedule
            </h1>
            <p className="text-blue-300 text-sm mt-1">View and download your upcoming exams</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">{filtered.length}</p>
              <p className="text-blue-200 text-xs">Exams</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">{modules.length}</p>
              <p className="text-blue-200 text-xs">Subjects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-blue-700" />
          <h3 className="font-semibold text-gray-900 text-sm">Filter Exams</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Subject</label>
            <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Subjects</option>
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Batch</label>
            <select value={batchFilter} onChange={e => setBatchFilter(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Batches</option>
              {batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">{filtered.length} exam{filtered.length !== 1 ? 's' : ''} found</span>
          <div className="flex gap-2">
            <button
              onClick={() => { setModuleFilter('all'); setBatchFilter('all'); }}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600"
            >
              Clear Filters
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-900 text-white text-xs font-medium rounded-lg hover:bg-blue-800 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-700" />
          <h3 className="font-bold text-gray-900 text-sm">Exam Schedule</h3>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No exams match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Subject', 'Title', 'Date', 'Time', 'Venue', 'Batch'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(exam => (
                  <tr key={exam._id} className="hover:bg-gray-50 transition-all">
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-900 text-sm">{exam.moduleName}</p>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{exam.title}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {(() => { try { return new Date(exam.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return exam.date; } })()}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{exam.startTime} – {exam.endTime}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{exam.venue}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">{exam.batch}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-400">Showing {filtered.length} exam{filtered.length !== 1 ? 's' : ''}</p>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-xs font-medium rounded-xl hover:bg-blue-800 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download Schedule PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
