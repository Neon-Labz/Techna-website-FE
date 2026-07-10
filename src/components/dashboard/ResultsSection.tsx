'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Download,
  Filter,
  Loader2,
  Trophy,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuthStore } from '../../store/authStore';
import { getSession } from '../../api/auth.api';
import { getResultsByStudentId } from '../../api/result.api';

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
  title?: string | null;
  moduleId?: string | null;
  moduleName: string;
  examType?: string | null;
  batch?: string;

  date?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;

  semester?: string | null;
  marks?: number | null;
  maxMarks?: number | null;
  grade?: string | null;
  result?: string | null;
  hasResult?: boolean;
}

type ResultWithCode = ResultRow & {
  code: string;
  percent: number;
};

const inputCls =
  'h-9 w-full rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-3 text-xs text-[#344054] outline-none transition focus:border-[#34BFF3] focus:ring-2 focus:ring-[#34BFF3]/20';

const getPercent = (row: ResultRow) => {
  const marks = Number(row.marks ?? 0);
  const maxMarks = Number(row.maxMarks ?? 100);
  if (!Number.isFinite(marks) || !Number.isFinite(maxMarks) || maxMarks <= 0) {
    return 0;
  }
  return Math.round((marks / maxMarks) * 100);
};

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
const getResultDate = (row: ResultRow) =>
  row.date || row.createdAt || row.updatedAt || null;

const dateValue = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.getTime();
};

const buildModuleCode = (moduleName: string, index: number) => {
  const words = moduleName.match(/[A-Za-z0-9]+/g) || [];
  const initials = words
    .map((word) => word[0])
    .join('')
    .slice(0, 4)
    .toUpperCase();
  return `${initials || 'MOD'}-${String(101 + index).padStart(3, '0')}`;
};

const gradeBadgeClass = (grade?: string | null) => {
  if (!grade) return 'bg-gray-100 text-gray-500';
  if (grade === 'A+') return 'bg-emerald-100 text-emerald-700';
  if (grade === 'A' || grade === 'A-') return 'bg-blue-100 text-blue-700';
  if (grade === 'B+') return 'bg-green-100 text-green-700';
  if (grade === 'B') return 'bg-yellow-100 text-yellow-700';
  if (grade === 'C' || grade === 'C+') return 'bg-orange-100 text-orange-700';
  if (grade === 'F') return 'bg-red-100 text-red-700';
  return 'bg-cyan-100 text-cyan-700';
};

const progressBarColor = (percent: number, grade?: string | null) => {
  if (grade === 'A+') return 'bg-emerald-500';
  if (grade === 'A' || grade === 'A-') return 'bg-[#2E90FA]';
  if (grade === 'B+') return 'bg-green-500';
  if (grade === 'B') return 'bg-yellow-500';
  if (grade === 'C' || grade === 'C+') return 'bg-orange-400';
  if (grade === 'F') return 'bg-red-500';
  if (percent >= 90) return 'bg-emerald-500';
  if (percent >= 75) return 'bg-[#2E90FA]';
  if (percent >= 60) return 'bg-yellow-500';
  return 'bg-orange-400';
};

const escapeCsv = (value: string | number | null | undefined) => {
  const text = String(value ?? '');
  return `"${text.replace(/"/g, '""')}"`;
};

export default function ResultsSection() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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

      const session: any = await getSession(token);

      const studentId =
        session?.studentId ??
        session?.student?.studentId ??
        session?.data?.studentId ??
        session?.data?.student?.studentId;

      if (!studentId) {
        setError('Student ID not found');
        return;
      }

      console.log('LOGIN STUDENT ID:', studentId);

      const response: any = await getResultsByStudentId(studentId, token);

      console.log('RESULT FUNCTION RESPONSE:', response);

      /*
       * எல்லா possible API response shapes-ஐயும் support பண்ணும்:
       *
       * 1. { results: [...] }
       * 2. { data: [...] }
       * 3. { data: { results: [...] } }
       * 4. Direct array [...]
       */
      const resultList: any[] = Array.isArray(response)
        ? response
        : Array.isArray(response?.results)
          ? response.results
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.results)
              ? response.data.results
              : [];

      console.log('RESULT LIST:', resultList);

      const normalizedResults: ResultRow[] = resultList.flatMap(
        (result: any, resultIndex: number) => {
          if (!Array.isArray(result?.modules)) {
            return [];
          }

          return result.modules.map((module: any, moduleIndex: number) => ({
            _id:
              module?._id ??
              `${result?._id ?? result?.studentId ?? resultIndex}-${
                module?.moduleName ?? 'module'
              }-${moduleIndex}`,

            title: result?.title ?? null,
            moduleId: module?.moduleId ?? null,
            moduleName: module?.moduleName?.trim() || 'Unknown Module',
            examType: module?.examType ?? null,

            marks:
              module?.marks !== null && module?.marks !== undefined
                ? Number(module.marks)
                : null,

            maxMarks:
              module?.maxMarks !== null && module?.maxMarks !== undefined
                ? Number(module.maxMarks)
                : 100,

            grade: module?.grade ?? null,
            result: module?.result ?? null,
            hasResult: module?.hasResult,

            batch: result?.batch ?? '',
            semester: result?.semester ?? null,

            date:
              result?.date ??
              result?.createdAt ??
              result?.updatedAt ??
              null,

            createdAt: result?.createdAt ?? null,
            updatedAt: result?.updatedAt ?? null,
          }));
        },
      );

      console.log('NORMALIZED RESULTS:', normalizedResults);

      setStudent(
        response?.student
          ? (response.student as StudentProfile)
          : (session as StudentProfile),
      );

      setResults(normalizedResults);
    } catch (err) {
      console.error('Failed to load results:', err);
      setResults([]);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  void loadAll();
}, []);

  const modules = useMemo(
    () => [...new Set(results.map((r) => r.moduleName).filter(Boolean))],
    [results],
  );

  const semesters = useMemo(
    () => [
      ...new Set(
        results.map((r) => r.semester).filter((s): s is string => Boolean(s)),
      ),
    ],
    [results],
  );

  const moduleCodeMap = useMemo(() => {
    const map = new Map<string, string>();
    modules.forEach((moduleName, index) => {
      const found = results.find((row) => row.moduleName === moduleName);
      map.set(moduleName, found?.moduleId || buildModuleCode(moduleName, index));
    });
    return map;
  }, [modules, results]);

  

  const filtered = useMemo(() => {
    const from = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
    const to = toDate ? new Date(`${toDate}T23:59:59`).getTime() : null;

    return results.filter((row) => {
      if (moduleFilter !== 'all' && row.moduleName !== moduleFilter) return false;
      if (semesterFilter !== 'all' && row.semester !== semesterFilter) return false;

      const current = dateValue(getResultDate(row));
      if (from !== null && (current === null || current < from)) return false;
      if (to !== null && (current === null || current > to)) return false;

      return true;
    });
  }, [fromDate, moduleFilter, semesterFilter, results, toDate]);

  const rows: ResultWithCode[] = useMemo(
    () =>
      filtered.map((row, index) => ({
        ...row,
        code: moduleCodeMap.get(row.moduleName) || buildModuleCode(row.moduleName, index),
        percent: getPercent(row),
      })),
    [filtered, moduleCodeMap],
  );

  const averageScore =
    rows.length > 0
      ? Math.round(rows.reduce((sum, row) => sum + row.percent, 0) / rows.length)
      : 0;

  const chartData = useMemo(() => {
    const grouped = new Map<string, { code: string; total: number; count: number }>();

    rows.forEach((row) => {
      const existing = grouped.get(row.moduleName);
      if (existing) {
        existing.total += row.percent;
        existing.count += 1;
      } else {
        grouped.set(row.moduleName, {
          code: row.code,
          total: row.percent,
          count: 1,
        });
      }
    });

    return [...grouped.values()].map((item) => ({
      code: item.code,
      average: Math.round(item.total / item.count),
    }));
  }, [rows]);

  const handleClearFilters = () => {
    setModuleFilter('all');
    setSemesterFilter('all');
    setFromDate('');
    setToDate('');
  };

  const handleDownloadPDF = () => {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();

    // Header background
    pdf.setFillColor(0, 138, 216);
    pdf.rect(0, 0, pageWidth, 32, 'F');

    // Header text
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('Examination Results', pageWidth / 2, 14, { align: 'center' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text('Techna - School Management System', pageWidth / 2, 22, { align: 'center' });

    // Student info section
    let yPos = 40;
    pdf.setTextColor(31, 41, 55);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Student Information', 14, yPos);

    yPos += 8;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);

    if (student?.fullNameEnglish) {
      pdf.text(`Name: ${student.fullNameEnglish}`, 14, yPos);
      yPos += 6;
    }
    if (student?.studentId) {
      pdf.text(`Student ID: ${student.studentId}`, 14, yPos);
      yPos += 6;
    }
    if (student?.batch) {
      pdf.text(`Batch: ${student.batch}`, 14, yPos);
      yPos += 6;
    }

    // Summary stats
    pdf.text(`Total Exams: ${rows.length}`, pageWidth - 60, 48);
    pdf.text(`Overall Average: ${averageScore}%`, pageWidth - 60, 54);
    pdf.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - 60, 60);

    yPos += 6;

    // Results table
    const tableHeaders = [['Module', 'Code', 'Exam Type', 'Marks', 'Grade', 'Date', 'Semester']];
    const tableBody = rows.map((row) => [
      row.moduleName,
      row.code,
      row.examType || '-',
      row.marks != null ? `${row.marks}/${row.maxMarks ?? 100} (${row.percent}%)` : '-',
      row.grade || '-',
      formatDate(row.date),
      row.semester || '-',
    ]);

    autoTable(pdf, {
      startY: yPos,
      head: tableHeaders,
      body: tableBody,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 138, 216],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [52, 64, 84],
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
      columnStyles: {
        0: { cellWidth: 40 },
        3: { halign: 'center' },
        4: { halign: 'center', fontStyle: 'bold' },
        5: { halign: 'center' },
        6: { halign: 'center' },
      },
      margin: { left: 14, right: 14 },
    });

    // Footer
    const finalY = (pdf as any).lastAutoTable?.finalY ?? yPos + 20;
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      'This is a system-generated document from Techna School Management System.',
      pageWidth / 2,
      finalY + 12,
      { align: 'center' },
    );

    pdf.save(`techna-results-${student?.studentId || 'student'}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleDownloadCSV = () => {
    const header = ['Module', 'Code', 'Exam Type', 'Marks', 'Grade', 'Date', 'Semester'];
    const body = rows.map((row) => [
      row.moduleName,
      row.code,
      row.examType || '',
      row.marks != null ? `${row.marks}/${row.maxMarks ?? 100}` : '',
      row.grade || '',
formatDate(getResultDate(row)),
      row.semester || '',
    ]);

    const csv = [header, ...body]
      .map((line) => line.map((value) => escapeCsv(value)).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `techna-results-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <Loader2 className="mb-3 h-10 w-10 animate-spin text-[#34BFF3]" />
        <p className="text-sm">Loading your results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-red-400">
        <AlertCircle className="mb-3 h-10 w-10" />
        <p className="text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm text-[#008AD8] underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 space-y-5 overflow-hidden">
      <section className="min-w-0 rounded-2xl bg-gradient-to-r from-[#008AD8] to-[#34BFF3] px-5 py-6 text-white shadow-sm sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-white/15 p-2.5">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">My Results</h1>
              <p className="mt-1 text-sm text-white/80">
                View and download your examination results
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="min-w-[80px] rounded-xl bg-white/15 px-4 py-2.5 text-center">
              <p className="text-xl font-bold leading-tight">{averageScore}%</p>
              <p className="mt-0.5 text-[10px] text-white/70">Overall Avg</p>
            </div>
            <div className="min-w-[80px] rounded-xl bg-white/15 px-4 py-2.5 text-center">
              <p className="text-xl font-bold leading-tight">{rows.length}</p>
              <p className="mt-0.5 text-[10px] text-white/70">Exams</p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#34BFF3]" />
          <h2 className="text-sm font-semibold text-[#101828]">Filter Results</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-[#344054]">
              Module
            </label>
            <select
              value={moduleFilter}
              onChange={(event) => setModuleFilter(event.target.value)}
              className={inputCls}
            >
              <option value="all">All Subjects</option>
              {modules.map((moduleName) => (
                <option key={moduleName} value={moduleName}>
                  {moduleName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-[#344054]">
              Semester
            </label>
            <select
              value={semesterFilter}
              onChange={(event) => setSemesterFilter(event.target.value)}
              className={inputCls}
            >
              <option value="all">All Semesters</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-[#344054]">
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-[#344054]">
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className={inputCls}
            />
          </div>
           
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#F2F4F7] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#98A2B3]">
            {rows.length} result{rows.length === 1 ? '' : 's'} found
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleClearFilters}
              className="h-8 rounded-lg border border-[#E5E7EB] px-4 text-xs font-medium text-[#667085] transition hover:bg-[#F9FAFB]"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#008AD8] px-4 text-xs font-semibold text-white transition hover:bg-[#0078BC]"
            >
              <Download className="h-3.5 w-3.5" />
              Download CSV
            </button>
          </div>
        </div>
      </section>

      <section className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#34BFF3]" />
          <h2 className="text-sm font-semibold text-[#101828]">
            Performance by Module (Average %)
          </h2>
        </div>

        <div className="h-[240px] w-full min-w-0">
          {chartData.length > 0 ? (
            <div className="grid h-full min-w-0 grid-cols-[34px_minmax(0,1fr)] gap-3">
              <div className="flex h-[200px] flex-col justify-between text-right text-[10px] text-[#98A2B3]">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>
              <div className="relative h-full min-w-0 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[200px]">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <div
                      key={line}
                      className="absolute left-0 right-0 border-t border-dashed border-[#EEF2F6]"
                      style={{ top: `${line * 25}%` }}
                    />
                  ))}
                </div>

                <div
                  className="relative grid h-[230px] min-w-0 gap-4 overflow-hidden pb-1 sm:gap-6"
                  style={{
                    gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))`,
                  }}
                >
                  {chartData.map((item) => (
                    <div
                      key={item.code}
                      className="flex min-w-0 flex-col justify-end"
                    >
                      <div className="flex h-[200px] items-end justify-center px-2">
                        <div
                          title={`${item.code}: ${item.average}%`}
                          className="w-full max-w-[48px] min-h-1 rounded-t-md bg-[#008AD8] transition hover:bg-[#0078BC]"
                          style={{ height: `${Math.min(item.average, 100)}%` }}
                        />
                      </div>
                      <span className="mt-2 truncate text-center text-[10px] text-[#667085]">
                        {item.code}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#98A2B3]">
              No performance data available.
            </div>
          )}
        </div>
      </section>

      <section className="min-w-0 overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-[#F2F4F7] px-5 py-4 sm:px-6">
          <BookOpen className="h-4 w-4 text-[#34BFF3]" />
          <h2 className="text-sm font-semibold text-[#101828]">Detailed Results</h2>
        </div>

        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center text-[#98A2B3]">
            <BookOpen className="mb-3 h-10 w-10 opacity-40" />
            <p className="text-sm">
              {results.length === 0
                ? 'No results published yet.'
                : 'No results match the selected filters.'}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-[#F2F4F7] sm:hidden">
              {rows.map((row, index) => (
                <article
                  key={row._id || `${row.moduleName}-${row.examType}-${index}`}
                  className="px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words text-sm font-semibold text-[#344054]">
                        {row.moduleName}
                      </h3>
                      <p className="mt-1 text-xs text-[#667085]">
                        {row.code} - {row.examType || 'Exam'}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 min-w-8 justify-center rounded-full px-2.5 py-1 text-[11px] font-bold ${gradeBadgeClass(
                        row.grade,
                      )}`}
                    >
                      {row.grade || '-'}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="w-14 shrink-0 text-xs font-semibold text-[#344054]">
                      {row.marks != null ? `${row.marks}/${row.maxMarks ?? 100}` : '-'}
                    </span>
                    <div className="h-1.5 flex-1 rounded-full bg-[#E5E7EB]">
                      <div
                        className={`h-full rounded-full ${progressBarColor(row.percent, row.grade)}`}
                        style={{ width: `${Math.min(row.percent, 100)}%` }}
                      />
                    </div>
                    <span className="w-9 shrink-0 text-right text-[11px] text-[#98A2B3]">
                      {row.percent}%
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-[#98A2B3]">
                        Date
                      </p>
                      <p className="mt-1 text-[#667085]">{formatDate(row.date)}</p>
                    </div>
                    
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden max-w-full overflow-x-auto sm:block">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="bg-[#F9FAFB] text-[11px] uppercase tracking-wide text-[#667085]">
                    <th className="px-3 py-3 font-semibold lg:px-5">Module</th>
                    <th className="px-3 py-3 font-semibold lg:px-5">Code</th>
                    <th className="px-3 py-3 font-semibold lg:px-5">Exam Type</th>
                    <th className="px-3 py-3 font-semibold lg:px-5">Marks</th>
                    <th className="px-3 py-3 font-semibold lg:px-5">Grade</th>
                    <th className="px-3 py-3 font-semibold lg:px-5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F4F7]">
                  {rows.map((row, index) => (
                    <tr key={row._id || `${row.moduleName}-${row.examType}-${index}`}>
                      <td className="max-w-[190px] px-3 py-4 text-xs font-semibold text-[#344054] lg:max-w-none lg:px-5">
                        {row.moduleName}
                      </td>
                      <td className="px-3 py-4 text-xs text-[#667085] lg:px-5">
                        {row.code}
                      </td>
                      <td className="px-3 py-4 text-xs text-[#667085] lg:px-5">
                        {row.examType || '-'}
                      </td>
                      <td className="px-3 py-4 lg:px-5">
                        <div className="flex min-w-[96px] items-center gap-2 lg:min-w-[116px]">
                          <span className="w-12 text-xs font-semibold text-[#344054]">
                            {row.marks != null
                              ? `${row.marks}/${row.maxMarks ?? 100}`
                              : '-'}
                          </span>
                          <div className="h-1.5 flex-1 rounded-full bg-[#E5E7EB]">
                            <div
                              className={`h-full rounded-full ${progressBarColor(row.percent, row.grade)}`}
                              style={{ width: `${Math.min(row.percent, 100)}%` }}
                            />
                          </div>
                          <span className="w-8 text-[11px] text-[#98A2B3]">
                            {row.percent}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-4 lg:px-5">
                        <span
                          className={`inline-flex min-w-8 justify-center rounded-full px-2.5 py-1 text-[11px] font-bold ${gradeBadgeClass(
                            row.grade,
                          )}`}
                        >
                          {row.grade || '-'}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-xs text-[#667085] lg:px-5">
                        {formatDate(row.date)}
                      </td>
                     
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {rows.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-[#F2F4F7] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-xs text-[#98A2B3]">
              Showing {rows.length} result{rows.length === 1 ? '' : 's'} · Average:{' '}
              {averageScore}%
            </p>
            <button
              type="button"
              onClick={handleDownloadPDF}
              className="inline-flex h-8 w-fit items-center gap-1.5 rounded-lg bg-[#008AD8] px-4 text-xs font-semibold text-white transition hover:bg-[#0078BC]"
            >
              <Download className="h-3.5 w-3.5" />
              Download All Results
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
