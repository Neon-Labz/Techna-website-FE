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
  title?: string | null;
  moduleId?: string | null;
  moduleName: string;
  examType?: string | null;
  batch?: string;
  date?: string | null;
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
  if (grade.startsWith('A')) return 'bg-emerald-100 text-emerald-700';
  if (grade === 'B' || grade === 'B+') return 'bg-blue-100 text-blue-700';
  if (grade === 'F') return 'bg-red-100 text-red-700';
  return 'bg-cyan-100 text-cyan-700';
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

        const session = await getSession(token);
        const studentId = session?.studentId || session?._id;

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

  const modules = useMemo(
    () => [...new Set(results.map((r) => r.moduleName).filter(Boolean))],
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

  const semesters = useMemo(
    () => [...new Set(results.map((r) => r.semester).filter(Boolean))] as string[],
    [results],
  );

  const filtered = useMemo(() => {
    const from = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
    const to = toDate ? new Date(`${toDate}T23:59:59`).getTime() : null;

    return results.filter((row) => {
      if (moduleFilter !== 'all' && row.moduleName !== moduleFilter) return false;
      if (semesterFilter !== 'all' && row.semester !== semesterFilter) return false;

      const current = dateValue(row.date);
      if (from !== null && (current === null || current < from)) return false;
      if (to !== null && (current === null || current > to)) return false;

      return true;
    });
  }, [fromDate, moduleFilter, results, semesterFilter, toDate]);

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

  const handleDownloadCSV = () => {
    const header = ['Module', 'Code', 'Exam Type', 'Marks', 'Grade', 'Date', 'Semester'];
    const body = rows.map((row) => [
      row.moduleName,
      row.code,
      row.examType || '',
      row.marks != null ? `${row.marks}/${row.maxMarks ?? 100}` : '',
      row.grade || '',
      formatDate(row.date),
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
      <section className="min-w-0 rounded-2xl bg-gradient-to-r from-[#008AD8] to-[#34BFF3] px-4 py-5 text-white shadow-sm sm:px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-lg bg-white/15 p-2">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">My Results</h1>
              <p className="mt-1 text-xs text-white/80">
                View and download your examination results
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
            <div className="min-w-[74px] rounded-lg bg-white/15 px-3 py-2 text-center sm:px-4">
              <p className="text-lg font-bold leading-tight">{averageScore}%</p>
              <p className="text-[10px] text-white/75">Overall Avg</p>
            </div>
            <div className="min-w-[74px] rounded-lg bg-white/15 px-3 py-2 text-center sm:px-4">
              <p className="text-lg font-bold leading-tight">{rows.length}</p>
              <p className="text-[10px] text-white/75">Exams</p>
            </div>
          </div>
        </div>
      </section>

      <section className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#34BFF3]" />
          <h2 className="text-sm font-semibold text-[#101828]">Filter Results</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-[#667085]">
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
            <label className="mb-1.5 block text-[11px] font-medium text-[#667085]">
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
            <label className="mb-1.5 block text-[11px] font-medium text-[#667085]">
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
            <label className="mb-1.5 block text-[11px] font-medium text-[#667085]">
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

        <div className="mt-4 flex flex-col gap-3 border-t border-[#F2F4F7] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#98A2B3]">
            {rows.length} result{rows.length === 1 ? '' : 's'} found
          </p>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              type="button"
              onClick={handleClearFilters}
              className="h-8 rounded-lg border border-[#E5E7EB] px-3 text-xs font-medium text-[#667085] transition hover:bg-[#F9FAFB] sm:px-4"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#008AD8] px-3 text-xs font-semibold text-white transition hover:bg-[#0078BC] sm:px-4"
            >
              <Download className="h-3.5 w-3.5" />
              Download CSV
            </button>
          </div>
        </div>
      </section>

      <section className="min-w-0 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-[#34BFF3]" />
          <h2 className="text-sm font-semibold text-[#101828]">
            Performance by Module (Average %)
          </h2>
        </div>

        <div className="h-[230px] w-full min-w-0">
          {chartData.length > 0 ? (
            <div className="grid h-full min-w-0 grid-cols-[28px_minmax(0,1fr)] gap-2 sm:grid-cols-[34px_minmax(0,1fr)] sm:gap-3">
              <div className="flex h-[190px] flex-col justify-between text-right text-[10px] text-[#98A2B3]">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>
              <div className="relative h-full min-w-0 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[190px]">
                  {[0, 1, 2, 3, 4].map((line) => (
                    <div
                      key={line}
                      className="absolute left-0 right-0 border-t border-[#EEF2F6]"
                      style={{ top: `${line * 25}%` }}
                    />
                  ))}
                </div>

                <div
                  className="relative grid h-[220px] min-w-0 gap-2 overflow-hidden pb-1 sm:gap-4"
                  style={{
                    gridTemplateColumns: `repeat(${chartData.length}, minmax(0, 1fr))`,
                  }}
                >
                  {chartData.map((item) => (
                    <div
                      key={item.code}
                      className="flex min-w-0 flex-col justify-end"
                    >
                      <div className="flex h-[190px] items-end">
                        <div
                          title={`${item.code}: ${item.average}%`}
                          className="min-h-1 w-full rounded-t-md bg-[#008AD8] transition hover:bg-[#0078BC]"
                          style={{ height: `${Math.min(item.average, 100)}%` }}
                        />
                      </div>
                      <span className="mt-2 truncate text-center text-[9px] text-[#667085] sm:text-[10px]">
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
        <div className="flex items-center gap-2 border-b border-[#F2F4F7] px-4 py-4 sm:px-5">
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
                        className="h-full rounded-full bg-[#2E90FA]"
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
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-[#98A2B3]">
                        Semester
                      </p>
                      <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#2E90FA]">
                        {row.semester || 'Semester'}
                      </span>
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
                    <th className="px-3 py-3 font-semibold lg:px-5">Semester</th>
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
                              className="h-full rounded-full bg-[#2E90FA]"
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
                      <td className="px-3 py-4 lg:px-5">
                        <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#2E90FA]">
                          {row.semester || 'Semester'}
                        </span>
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
              Showing {rows.length} result{rows.length === 1 ? '' : 's'} - Average:{' '}
              {averageScore}%
            </p>
            <button
              type="button"
              onClick={handleDownloadCSV}
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
