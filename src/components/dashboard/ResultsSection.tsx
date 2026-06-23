'use client';

import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Award, Download, Filter, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getSession } from '../../api/auth.api';
import { getResultsByStudentId } from '../../api/exam.api';

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
}

interface ResultRow {
  _id: string | null;
  moduleName: string;
  examType?: string | null;
  batch?: string;
  marks?: number | null;
  maxMarks?: number | null;
  grade?: string | null;
  result?: string | null;
  hasResult?: boolean;
}

const gradeColor = (grade: string | null | undefined) => {
  if (!grade) return '';
  if (grade.startsWith('A')) return 'text-green-600';
  if (grade === 'F') return 'text-red-500';
  return 'text-cyan-600';
};

export default function ResultsSection() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState('all');

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = useAuthStore.getState().token;

        if (!token) {
          setError('Not authenticated');
          return;
        }

        const session = await getSession(token);
        const studentId = session?.studentId || session?._id ;

        if (!studentId) {
          setError('Student ID not found');
          return;
        }

        const data = await getResultsByStudentId(studentId, token);

        setStudent((data?.student as unknown as StudentProfile) || null);
        setResults((data?.results as unknown as ResultRow[]) || []);
      } catch (err) {
        console.error('Failed to load:', err);
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  const modules = [...new Set(results.map((r) => r.moduleName).filter(Boolean))];

  const filtered =
    moduleFilter === 'all'
      ? results
      : results.filter((r) => r.moduleName === moduleFilter);

  const passed = filtered.filter((r) => r.result === 'pass').length;
  const failed = filtered.filter((r) => r.result === 'fail').length;

  const avgScore =
    filtered.length > 0
      ? Math.round(
          filtered.reduce((sum, r) => sum + (r.marks ?? 0), 0) / filtered.length
        )
      : 0;

  const handleDownloadPDF = async () => {
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
    } catch {
      // continue without logo
    }

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const footerY = pageH - 22;

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

        doc.addImage(
          logoDataUrl,
          imgType,
          10,
          6 + (20 - logoH) / 2,
          logoW,
          logoH
        );
      } catch {
        // skip logo
      }
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(0, 174, 219);
    doc.text('TECHNA', pageW / 2, 18, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      'Email: sivasakthy22@gmail.com  |  Contact: +94 77 170 3549',
      pageW / 2,
      26,
      { align: 'center' }
    );

    doc.setDrawColor(0, 174, 219);
    doc.setLineWidth(0.5);
    doc.line(14, 30, pageW - 14, 30);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(0, 174, 219);
    doc.text('STUDENT EXAM RESULTS', pageW / 2, 38, { align: 'center' });

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
      doc.text(value || '', lx + 28, iy);
    };

    const s = student as Record<string, unknown> | null;
    const str = (key: string) => (s?.[key] as string) || '';

    infoRow('Student Name', str('fullNameEnglish'), leftX, y);
    infoRow('Admission No', str('admissionNumber'), rightX, y);

    y += 10;
    infoRow('Email', str('email'), leftX, y);
    infoRow('Generated', new Date().toLocaleDateString('en-GB'), rightX, y);

    y += 10;
    infoRow('NIC', str('nicNo'), leftX, y);
    infoRow(
      'WhatsApp',
      (s?.whatsappNo as string) || (s?.phone as string) || '',
      rightX,
      y
    );

    y += 10;
    infoRow('Student ID', str('studentId'), leftX, y);
    infoRow('Batch', str('batch'), rightX, y);

    y += 12;

    doc.setFillColor(0, 174, 219);
    doc.roundedRect(14, y, pageW - 28, 14, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(
      `Results: ${filtered.length}  |  Pass: ${passed}  |  Fail: ${failed}  |  Avg: ${avgScore}%`,
      22,
      y + 9
    );

    if (moduleFilter !== 'all') {
      doc.text(moduleFilter, pageW - 22, y + 9, { align: 'right' });
    }

    y += 20;

    autoTable(doc, {
      startY: y,
      head: [['Module', 'Type', 'Marks', 'Grade', 'Result']],
      body: filtered.map((r) => [
        r.moduleName || '',
        r.examType || '',
        r.marks != null ? `${r.marks}/${r.maxMarks ?? 100}` : '',
        r.grade || '',
        r.result ? r.result.charAt(0).toUpperCase() + r.result.slice(1) : '',
      ]),
      headStyles: {
        fillColor: [0, 174, 219] as [number, number, number],
        textColor: [255, 255, 255] as [number, number, number],
        fontSize: 8,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 250, 255] as [number, number, number],
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 40, 60] as [number, number, number],
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25, halign: 'center' as const },
        3: { cellWidth: 20, halign: 'center' as const },
        4: { cellWidth: 25, halign: 'center' as const },
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
        doc.text(
          'Generated by Techna · School Management System',
          pageW / 2,
          footerY + 15,
          { align: 'center' }
        );
      },
    });

    doc.save(`techna-results-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin mb-3 text-blue-700" />
        <p className="text-sm">Loading your results…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-red-400">
        <AlertCircle className="w-10 h-10 mb-3" />
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-blue-700 text-sm underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-950 to-blue-800 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Award className="w-7 h-7 text-yellow-400" /> My Results
            </h1>
            <p className="text-blue-300 text-sm mt-1">Your published exam results</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">{filtered.length}</p>
              <p className="text-blue-200 text-xs">Results</p>
            </div>

            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-green-400 font-bold text-xl">{passed}</p>
              <p className="text-blue-200 text-xs">Passed</p>
            </div>

            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-red-400 font-bold text-xl">{failed}</p>
              <p className="text-blue-200 text-xs">Failed</p>
            </div>

            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">{avgScore}%</p>
              <p className="text-blue-200 text-xs">Average</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-blue-700" />
          <h3 className="font-semibold text-gray-900 text-sm">Filter</h3>
        </div>

        <div className="max-w-xs">
          <label className="block text-xs text-gray-500 mb-1.5 font-medium">
            Module
          </label>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Modules</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>

          <div className="flex gap-2">
            {moduleFilter !== 'all' && (
              <button
                onClick={() => setModuleFilter('all')}
                className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600"
              >
                Clear Filter
              </button>
            )}

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-900 text-white text-xs font-medium rounded-lg hover:bg-blue-800 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-700" />
          <h3 className="font-bold text-gray-900 text-sm">Exam Results</h3>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>
              {results.length === 0
                ? 'No results published yet.'
                : 'No results match the filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[35%]">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">
                    Type
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">
                    Result
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filtered.map((r, idx) => (
                  <tr
                    key={r._id ?? idx}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 align-middle">
                      <span className="text-sm font-medium text-gray-800">
                        {r.moduleName}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-middle">
                      <span className="text-sm text-gray-600">
                        {r.examType || ''}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-middle text-center">
                      <span className="text-sm font-semibold text-gray-800">
                        {r.marks != null ? `${r.marks}/${r.maxMarks ?? 100}` : ''}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-middle text-center">
                      <span className={`text-sm font-bold ${gradeColor(r.grade)}`}>
                        {r.grade || ''}
                      </span>
                    </td>

                    <td className="px-6 py-4 align-middle text-center">
                      {r.result === 'pass' ? (
                        <span className="inline-flex items-center justify-center gap-1 text-sm font-medium text-green-600 whitespace-nowrap">
                          ✅ Pass
                        </span>
                      ) : r.result === 'fail' ? (
                        <span className="inline-flex items-center justify-center gap-1 text-sm font-medium text-red-500 whitespace-nowrap">
                          ❌ Fail
                        </span>
                      ) : (
                        ''
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-400">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} · {passed}{' '}
              passed · {failed} failed
            </p>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-xs font-medium rounded-xl hover:bg-blue-800 transition-all"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
