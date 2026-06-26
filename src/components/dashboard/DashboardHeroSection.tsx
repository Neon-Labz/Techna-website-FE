'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Bell, BookOpen, Award, TrendingUp } from 'lucide-react';
import { dashboardApi } from '@/api/dashboard.api';
import { announcementApi, type Announcement } from '@/api/announcement.api';

type Result = {
  _id?: string;
  marks?: number | null;
  maxMarks?: number | null;
  grade?: string;
  moduleName?: string;
  hasResult?: boolean;
};

export default function DashboardHeroSection() {
  const { student, token } = useAuthStore();

  const studentKey =
    student?._id  || student?.studentId || student?.email || '';

  const studentResultId = student?.studentId || student?._id ||  '';

  const studentFullName =
    student?.fullNameEnglish?.trim() || student?.name?.trim() || 'Student';

  const studentFirstName = studentFullName?.split(' ')?.[0] || 'Student';
  const admissionNo = student?.studentId?.trim() || '-';

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setAnnouncements([]);
      setResults([]);

      try {
        const [announcementData, resultData] = await Promise.all([
          announcementApi.getAll(),
          dashboardApi.getResults(studentResultId, token || undefined),
        ]);

        setAnnouncements(Array.isArray(announcementData) ? announcementData : []);
        setResults(resultData);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      }
    };

    fetchDashboardData();
  }, [studentKey, studentResultId, token]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const releasedResults = useMemo(
    () =>
      results.filter(
        (r) =>
          r.hasResult !== false &&
          r.marks !== null &&
          r.marks !== undefined,
      ),
    [results],
  );

  const avgScore = useMemo(() => {
    if (releasedResults.length === 0) return 0;

    const validResults = releasedResults.filter(
      (r) => Number(r.marks) >= 0 && Number(r.maxMarks ?? 100) > 0,
    );

    if (validResults.length === 0) return 0;

    return Math.round(
      validResults.reduce(
        (acc, r) => acc + (Number(r.marks) / Number(r.maxMarks ?? 100)) * 100,
        0,
      ) / validResults.length,
    );
  }, [releasedResults]);

  const recentResults = releasedResults.slice(0, 3);

  const announcementCount = useMemo(() => {
    const studentBatch = student?.batch?.trim();

    return announcements.filter((announcement) => {
      const target =
        announcement.batch && announcement.batch !== 'None'
          ? announcement.batch
          : 'All Students';

      return target === 'All Students' || target === studentBatch;
    }).length;
  }, [announcements, student?.batch]);

  const enrolledModuleCount = useMemo(() => {
    const enrolledSubjects = [
      ...(student?.subjects ?? []),
      ...(student?.modules ?? []),
      ...(student?.subjectSelection?.subjects ?? []),
      ...(student?.subjectSelection?.enrolledModules ?? []),
      ...(student?.enrolledModules ?? []),
    ]
      .map((module) => module?.trim())
      .filter((module): module is string => Boolean(module));

    return new Set(enrolledSubjects).size;
  }, [
    student?.enrolledModules,
    student?.modules,
    student?.subjectSelection?.enrolledModules,
    student?.subjectSelection?.subjects,
    student?.subjects,
  ]);

  const stats = [
    {
      icon: Award,
      label: 'Latest Grade',
      value: recentResults[0]?.grade || '-',
      sub: recentResults[0]?.moduleName || 'No results yet',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: TrendingUp,
      label: 'Average Marks',
      value: avgScore ? `${avgScore}%` : '-',
      sub: 'All Subjects',
      color: 'text-green-600 bg-green-50',
    },
    {
      icon: BookOpen,
      label: 'Modules',
      value: enrolledModuleCount.toString(),
      sub: 'Enrolled',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: Bell,
      label: 'Announcements',
      value: announcementCount.toString(),
      sub: 'Latest updates',
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <section className="mx-auto w-full max-w-[1250px] px-4 py-6">
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0183CB] to-[#34BFF3] px-5 py-6 text-white shadow-sm md:px-7 md:py-7">
          <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/10" />
          <div className="absolute right-16 -bottom-16 h-28 w-28 rounded-full bg-white/10" />

          <div className="relative z-10">
            <p className="text-xs font-medium text-white/80">{greeting()},</p>

            <h1 className="mt-1 text-2xl font-extrabold tracking-wide md:text-3xl">
              {studentFirstName?.toUpperCase() || 'STUDENT'}! 👋
            </h1>

            <p className="mt-1 text-xs text-white/85 md:text-sm">
              Welcome to your Techna Student Portal. Here's what's happening.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="min-w-[78px] rounded-lg bg-white/20 px-4 py-2">
                <p className="text-lg font-bold">
                  {avgScore ? `${avgScore}%` : '-'}
                </p>
                <p className="text-[10px] text-white/75">Avg. Score</p>
              </div>

              <div className="min-w-[78px] rounded-lg bg-white/20 px-4 py-2">
                <p className="text-lg font-bold">{enrolledModuleCount}</p>
                <p className="text-[10px] text-white/75">Subjects</p>
              </div>

              <div className="min-w-[78px] rounded-lg bg-white/20 px-4 py-2">
                <p className="text-lg font-bold">{releasedResults.length}</p>
                <p className="text-[10px] text-white/75">Results</p>
              </div>

              <div className="min-w-[90px] rounded-lg bg-white/20 px-4 py-2">
                <p className="text-lg font-bold">{admissionNo}</p>
                <p className="text-[10px] text-white/75">Admission No.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div
                  className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${item.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <p className="text-xl font-bold text-gray-900">{item.value}</p>
                <p className="mt-1 text-xs font-medium text-gray-500">
                  {item.label}
                </p>
                <p className="text-[11px] text-gray-400">{item.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
