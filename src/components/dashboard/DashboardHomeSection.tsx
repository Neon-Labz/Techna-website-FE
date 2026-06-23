'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Play,
  ChevronRight,
  Calendar,
  Award,
  Clock,
  Filter,
  MapPin,
  X,
} from 'lucide-react';
import { dashboardApi } from '@/api/dashboard.api';
import { useAuthStore } from '../../store/authStore';

type NoticeType = 'exam' | 'general' | 'assignment' | 'holiday';

type Notice = {
  _id?: string;
  type?: NoticeType;
  moduleId?: string;
  moduleName?: string;
  module?:
    | string
    | {
        _id?: string;
        name?: string;
        moduleId?: string;
        moduleName?: string;
      };
  subject?: string;
  batch?: string;
  title?: string;
  content?: string;
  description?: string;
  date?: string;
  examDate?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  createdAt?: string;
  isPublished?: boolean | string;
  published?: boolean | string;
  status?: string;
};

type Video = {
  _id?: string;
  moduleId?: string;
  moduleName?: string;
  title?: string;
  description?: string;
  duration?: string;
  uploadedAt?: string;
  createdAt?: string;
  fileType?: string;
  fileUrl?: string;
  url?: string;
  videoUrl?: string;
  link?: string;
  isPublished?: boolean | string;
  published?: boolean | string;
  status?: string;
};

type Module = {
  _id?: string;
  name?: string;
  batch?: string;
  videos?: Video[];
  resources?: Video[];
  recordings?: Video[];
  lectureRecordings?: Video[];
};

type Result = {
  _id?: string;
  title?: string | null;
  moduleName?: string;
  examType?: string;
  semester?: string;
  date?: string | null;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  marks?: number;
  maxMarks?: number;
  grade?: string;
  result?: string | null;
  hasResult?: boolean;
};

type ModuleSelection =
  | string
  | {
      _id?: string;
      name?: string;
      moduleId?: string;
      moduleName?: string;
      subject?: string;
    };

const typeColors: Record<NoticeType, string> = {
  exam: 'bg-red-50 border-red-200 text-red-700',
  general: 'bg-blue-50 border-blue-200 text-blue-700',
  assignment: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  holiday: 'bg-green-50 border-green-200 text-green-700',
};

const typeDots: Record<NoticeType, string> = {
  exam: 'bg-red-500',
  general: 'bg-blue-500',
  assignment: 'bg-yellow-500',
  holiday: 'bg-green-500',
};

const normalizeText = (value?: unknown) =>
  String(value ?? '').trim().toLowerCase();

const moduleKey = (module: Module) =>
  module._id || module.name || '';

const selectionKeys = (selection: ModuleSelection) => {
  if (typeof selection === 'string') {
    return [normalizeText(selection)].filter(Boolean);
  }

  return [
    selection._id,
    selection.moduleId,
    selection.moduleName,
    selection.name,
    selection.subject,
  ]
    .map(normalizeText)
    .filter(Boolean);
};

const moduleReferenceKeys = (
  value:
    | string
    | {
        _id?: string;
        name?: string;
        moduleId?: string;
        moduleName?: string;
      }
    | undefined
) => {
  if (!value) return [];
  if (typeof value === 'string') return [normalizeText(value)].filter(Boolean);

  return [
    value._id,
    value.moduleId,
    value.moduleName,
    value.name,
  ]
    .map(normalizeText)
    .filter(Boolean);
};

const moduleReferenceLabel = (
  value: Parameters<typeof moduleReferenceKeys>[0]
) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.moduleName || value.name || value.moduleId || value._id || '';
};

const formatNoticeDate = (value?: string) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const isPublished = (item: {
  isPublished?: boolean | string;
  published?: boolean | string;
  status?: string;
}) => {
  if (typeof item.isPublished === 'boolean') return item.isPublished;
  if (typeof item.published === 'boolean') return item.published;

  const publishText = normalizeText(
    String(item.isPublished ?? item.published ?? '')
  );

  if (publishText === 'true' || publishText === 'published') return true;
  if (publishText === 'false' || publishText === 'unpublished') return false;

  const status = normalizeText(item.status);
  if (status === 'published') return true;
  if (status === 'draft' || status === 'unpublished') return false;

  return true;
};

const isVideoResource = (resource: Video) => {
  const fileType = normalizeText(resource.fileType);
  const url = resource.fileUrl || resource.url || resource.videoUrl || resource.link || '';

  return (
    (fileType === '' && Boolean(url)) ||
    fileType === 'video' ||
    fileType.startsWith('video/') ||
    /\.(mp4|webm|mov|m4v|avi)$/i.test(url) ||
    /(?:youtube\.com|youtu\.be|vimeo\.com|drive\.google\.com)/i.test(url)
  );
};

export default function DashboardHomeSection() {
  const { student, token } = useAuthStore();

  const studentKey =
    student?._id || student?.studentId || student?.email || '';
  const studentResultId = student?.studentId || student?._id ||'';

  const [activeModule, setActiveModule] = useState<string>('all');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setActiveModule('all');
      setNotices([]);
      setModules([]);
      setResults([]);

      try {
        const [noticesResult, modulesResult, resultsResult] =
          await Promise.allSettled([
            dashboardApi.getNotices(),
            dashboardApi.getModules(),
            dashboardApi.getResults(studentResultId, token || undefined),
          ]);

        if (noticesResult.status === 'fulfilled') {
          setNotices(noticesResult.value);
        }

        if (modulesResult.status === 'fulfilled') {
          setModules(modulesResult.value);
        }

        if (resultsResult.status === 'fulfilled') {
          setResults(resultsResult.value);
        }
      } catch (error) {
        console.error('Dashboard home fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchDashboardData();
  }, [studentKey, studentResultId, token]);

  const studentModuleSelections = useMemo(() => {
    const enrollmentSources = [
      student?.subjectSelection?.enrolledModules,
      student?.subjectSelection?.subjects,
      student?.enrolledModules,
      student?.subjects,
      student?.modules,
    ];

    const selections =
      enrollmentSources.find(
        (source) => Array.isArray(source) && source.length > 0
      ) ?? [];

    return Array.from(
      new Set((selections as ModuleSelection[]).flatMap(selectionKeys))
    );
  }, [
    student?.enrolledModules,
    student?.modules,
    student?.subjectSelection?.enrolledModules,
    student?.subjectSelection?.subjects,
    student?.subjects,
  ]);

  const studentModuleSelectionSet = useMemo(
    () => new Set(studentModuleSelections),
    [studentModuleSelections]
  );

  const selectedModules = useMemo(
    () =>
      modules.filter((module) =>
        [module._id, module.name]
          .map(normalizeText)
          .filter(Boolean)
          .some((key) => studentModuleSelectionSet.has(key))
      ),
    [modules, studentModuleSelectionSet]
  );

  const selectedModuleIds = useMemo(
    () =>
      new Set(
        selectedModules
          .map((module) => normalizeText(module._id ))
          .filter(Boolean)
      ),
    [selectedModules]
  );

  const selectedModuleNames = useMemo(
    () =>
      new Set(
        selectedModules
          .map((module) => normalizeText(module.name))
          .filter(Boolean)
      ),
    [selectedModules]
  );

  const isSelectedModuleContent = (
    ...moduleRefs: Array<Parameters<typeof moduleReferenceKeys>[0]>
  ) => {
    if (studentModuleSelections.length === 0) return false;

    const refs = moduleRefs.flatMap(moduleReferenceKeys);

    return refs.some(
      (ref) =>
        selectedModuleIds.has(ref) ||
        selectedModuleNames.has(ref) ||
        studentModuleSelectionSet.has(ref)
    );
  };

  const examNotices = useMemo(
    () =>
      notices.filter(
        (n) =>
          (n.type || 'exam') === 'exam' &&
          isPublished(n) &&
          isSelectedModuleContent(n.moduleId, n.moduleName, n.module, n.subject)
      ),
    [
      notices,
      selectedModuleIds,
      selectedModuleNames,
      studentModuleSelectionSet,
      studentModuleSelections.length,
    ]
  );

  const allVideos = useMemo(() => {
    return modules.flatMap((m) =>
      [
        ...(m.resources ?? []),
        ...(m.videos ?? []),
        ...(m.recordings ?? []),
        ...(m.lectureRecordings ?? []),
      ]
        .filter((resource) => isPublished(resource) && isVideoResource(resource))
        .map((video) => ({
          ...video,
          moduleId: video.moduleId || moduleKey(m),
          moduleName: video.moduleName || m.name,
        }))
    );
  }, [modules]);

  const studentModules = selectedModules;

  const filteredVideos =
    activeModule === 'all'
      ? allVideos.filter((v) =>
          isSelectedModuleContent(v.moduleId, v.moduleName)
        )
      : allVideos.filter(
          (v) =>
            isSelectedModuleContent(v.moduleId, v.moduleName) &&
            (normalizeText(v.moduleId) === normalizeText(activeModule) ||
              normalizeText(v.moduleName) === normalizeText(activeModule))
        );

  const latestResultsByModule = useMemo(() => {
    const releasedResults = results.filter(
      (result) =>
        result.hasResult !== false &&
        result.marks !== null &&
        result.marks !== undefined,
    );

    const sortedResults = [...releasedResults].sort((a, b) => {
      const aTime = new Date(
        a.publishedAt || a.updatedAt || a.createdAt || a.date || 0,
      ).getTime();
      const bTime = new Date(
        b.publishedAt || b.updatedAt || b.createdAt || b.date || 0,
      ).getTime();

      return (Number.isNaN(bTime) ? 0 : bTime) - (Number.isNaN(aTime) ? 0 : aTime);
    });

    const moduleResults = new Map<string, Result>();

    sortedResults.forEach((result) => {
      const key = normalizeText(result.moduleName);
      if (!key || moduleResults.has(key)) return;

      if (
        studentModuleSelections.length > 0 &&
        !isSelectedModuleContent(result.moduleName)
      ) {
        return;
      }

      moduleResults.set(key, result);
    });

    return Array.from(moduleResults.values());
  }, [
    results,
    selectedModuleIds,
    selectedModuleNames,
    studentModuleSelectionSet,
    studentModuleSelections.length,
  ]);

  return (
    <section className="mx-auto w-full max-w-[1250px] px-4 py-6">
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-1">
            <div className="h-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 font-bold text-gray-900">
                  <Bell className="h-5 w-5 text-[#0183CB]" /> Exam Notices
                </h2>
                <span className="shrink-0 text-xs text-gray-400">
                  {examNotices.length} active
                </span>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <p className="rounded-xl border border-gray-100 px-4 py-5 text-center text-sm text-gray-400">
                    Loading notices...
                  </p>
                ) : examNotices.length === 0 ? (
                  <p className="rounded-xl border border-gray-100 px-4 py-5 text-center text-sm text-gray-400">
                    No exam notices available.
                  </p>
                ) : (
                  examNotices.slice(0, 4).map((notice) => {
                    const noticeType = notice.type || 'exam';
                    const noticeDate =
                      notice.date ||
                      notice.examDate ||
                      notice.createdAt ||
                      new Date().toISOString();

                    return (
                      <button
                        type="button"
                        key={notice._id }
                        onClick={() => setSelectedNotice(notice)}
                        className={`w-full rounded-xl border p-3.5 text-left text-sm transition hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300 ${typeColors[noticeType]}`}
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${typeDots[noticeType]}`}
                          />
                          <div className="min-w-0">
                            <p className="mb-1 text-xs font-semibold leading-snug">
                              {notice.title || 'Untitled Notice'}
                            </p>
                            <p className="line-clamp-2 text-xs leading-relaxed opacity-80">
                              {notice.content || notice.description || '-'}
                            </p>
                            <div className="mt-1.5 flex items-center gap-1 text-xs opacity-60">
                              <Calendar className="h-3 w-3" />
                              {formatNoticeDate(noticeDate)}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="h-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-2 font-bold text-gray-900">
                  <Play className="h-5 w-5 text-[#0183CB]" /> Lecture Recordings
                </h2>

                <div className="flex items-center gap-1.5 sm:justify-end">
                  <Filter className="h-3.5 w-3.5 text-gray-400" />
                  <select
                    value={activeModule}
                    onChange={(e) => setActiveModule(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
                  >
                    <option value="all">All Modules</option>
                    {studentModules.map((m) => (
                      <option key={moduleKey(m)} value={moduleKey(m)}>
                        {m.name || 'Unnamed Module'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="flex min-h-[112px] flex-col items-center justify-center rounded-xl border border-gray-100 px-4 py-6 text-center text-gray-400">
                    <Play className="mb-2 h-8 w-8 opacity-30" />
                    <p className="text-sm">Loading videos...</p>
                  </div>
                ) : filteredVideos.length === 0 ? (
                  <div className="flex min-h-[112px] flex-col items-center justify-center rounded-xl border border-gray-100 px-4 py-6 text-center text-gray-400">
                    <Play className="mb-2 h-8 w-8 opacity-30" />
                    <p className="text-sm">
                      {studentModuleSelections.length === 0
                        ? 'No modules selected for this student yet.'
                        : 'No videos available for this module yet.'}
                    </p>
                  </div>
                ) : (
                  filteredVideos.slice(0, 5).map((video) => {
                    const uploadedDate =
                      video.uploadedAt ||
                      video.createdAt ||
                      new Date().toISOString();

                    const videoUrl = video.fileUrl || video.url || '#';

                    return (
                      <a
                        key={video._id }
                        href={videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-start gap-3 rounded-xl border border-gray-100 p-3 transition-all hover:bg-gray-50 sm:items-center sm:gap-4 sm:p-4"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 shadow-md transition-transform group-hover:scale-105 sm:h-14 sm:w-14">
                          <Play className="h-6 w-6 fill-white text-white" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                            {video.title || 'Untitled Video'}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {video.moduleName || 'Module'}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-gray-400">
                            {video.description || '-'}
                          </p>
                        </div>

                        <div className="hidden shrink-0 text-right sm:block">
                          <div className="mb-1 flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />{' '}
                            {video.duration || '-'}
                          </div>
                          <p className="text-xs text-gray-400">
                            {new Date(uploadedDate).toLocaleDateString(
                              'en-GB',
                              {
                                day: '2-digit',
                                month: 'short',
                              }
                            )}
                          </p>
                        </div>

                        <ChevronRight className="mt-4 h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-blue-500 sm:mt-0" />
                      </a>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-bold text-gray-900">
              <Award className="h-5 w-5 text-[#0183CB]" /> Recent Results
            </h2>

            <Link
              href="/dashboard/results"
              className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#0183CB] hover:underline"
            >
              View All <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-400">
              Loading results...
            </div>
          ) : latestResultsByModule.length === 0 ? (
            <div className="rounded-xl border border-gray-100 p-6 text-center text-sm text-gray-400">
              No results available.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {latestResultsByModule.slice(0, 3).map((result, index) => {
                const marks = Number(result.marks || 0);
                const maxMarks = Number(result.maxMarks || 100);
                const pct =
                  maxMarks > 0 ? Math.round((marks / maxMarks) * 100) : 0;

                const color =
                  pct >= 90
                    ? 'text-green-600 bg-green-50'
                    : pct >= 75
                      ? 'text-blue-600 bg-blue-50'
                      : pct >= 60
                        ? 'text-yellow-600 bg-yellow-50'
                        : 'text-red-600 bg-red-50';

                return (
                  <div
                    key={
                      result._id ||
                      `${result.moduleName || 'module'}-${result.examType || 'exam'}-${result.marks ?? 'marks'}-${index}`
                    }
                    className="rounded-xl border border-gray-100 p-4 transition-all hover:shadow-sm"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {result.moduleName || 'Module'}
                        </p>
                        <p className="text-xs text-gray-400">
                          {result.examType || 'Exam'} ·{' '}
                          {result.semester || 'Semester'}
                        </p>
                      </div>

                      <span
                        className={`rounded-lg px-2 py-0.5 text-lg font-bold ${color}`}
                      >
                        {result.grade || '-'}
                      </span>
                    </div>

                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-xs text-gray-500">
                        <span>
                          {marks}/{maxMarks}
                        </span>
                        <span>{pct}%</span>
                      </div>

                      <div className="h-1.5 w-full rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
          onClick={() => setSelectedNotice(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-500">
                  Exam Notice
                </p>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedNotice.title || 'Untitled Notice'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close exam notice details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-xs text-gray-400">Module</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {selectedNotice.moduleName ||
                    moduleReferenceLabel(selectedNotice.module) ||
                    selectedNotice.subject ||
                    '-'}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-3">
                <p className="text-xs text-gray-400">Batch</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {selectedNotice.batch || '-'}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-3">
                <p className="flex items-center gap-1 text-xs text-gray-400">
                  <Calendar className="h-3.5 w-3.5" /> Date
                </p>
                <p className="mt-1 font-semibold text-gray-800">
                  {formatNoticeDate(
                    selectedNotice.date ||
                      selectedNotice.examDate ||
                      selectedNotice.createdAt
                  )}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-3">
                <p className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="h-3.5 w-3.5" /> Time
                </p>
                <p className="mt-1 font-semibold text-gray-800">
                  {selectedNotice.startTime || selectedNotice.endTime
                    ? `${selectedNotice.startTime || '-'} - ${
                        selectedNotice.endTime || '-'
                      }`
                    : '-'}
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 p-3">
                <p className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="h-3.5 w-3.5" /> Venue
                </p>
                <p className="mt-1 font-semibold text-gray-800">
                  {selectedNotice.venue || '-'}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              <p className="mb-1 font-semibold">Description</p>
              <p className="whitespace-pre-wrap leading-relaxed">
                {selectedNotice.description || selectedNotice.content || '-'}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
