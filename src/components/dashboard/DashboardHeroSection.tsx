'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Bell, BookOpen, Award, TrendingUp } from 'lucide-react';
import { dashboardApi } from '@/api/dashboard.api';

type Notice = {
  id?: string;
  _id?: string;
  type?: 'exam' | 'general' | 'assignment' | 'holiday';
};

type Module = {
  id?: string;
  _id?: string;
  name?: string;
};

type Result = {
  id?: string;
  _id?: string;
  marks: number;
  maxMarks: number;
  grade?: string;
  moduleName?: string;
};

export default function DashboardHeroSection() {
  const { student } = useAuthStore();
  const studentKey = student?._id || student?.id || student?.studentId || student?.email || '';
  const studentFullName =
    student?.fullNameEnglish?.trim() || student?.name?.trim() || 'Student';
  const studentFirstName = studentFullName?.split(' ')?.[0] || 'Student';
  const admissionNo =
    student?.admissionNumber?.trim() || student?.studentId?.trim() || '-';

  const [notices, setNotices] = useState<Notice[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setNotices([]);
      setModules([]);
      setResults([]);

      try {
        const [notices, modules, results] = await Promise.all([
            dashboardApi.getNotices(),
            dashboardApi.getModules(),
            dashboardApi.getResults(),
          ]);

          setNotices(notices);
          setModules(modules);
          setResults(results);
      } catch (error) {
        console.error('Dashboard data fetch error:', error);
      }
    };

    fetchDashboardData();
  }, [studentKey]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const avgScore = useMemo(() => {
    if (results.length === 0) return 0;

    const validResults = results.filter(
      (r) => Number(r.marks) >= 0 && Number(r.maxMarks) > 0
    );

    if (validResults.length === 0) return 0;

    return Math.round(
      validResults.reduce(
        (acc, r) => acc + (Number(r.marks) / Number(r.maxMarks)) * 100,
        0
      ) / validResults.length
    );
  }, [results]);

  const recentResults = results.slice(0, 3);

  const examNoticesCount = notices.filter((n) => n.type === 'exam').length;

  const enrolledModuleCount = useMemo(() => {
    const selectedModules = [
      ...(student?.subjects ?? []),
      ...(student?.modules ?? []),
      ...(student?.subjectSelection?.subjects ?? []),
      ...(student?.subjectSelection?.enrolledModules ?? []),
      ...(student?.enrolledModules ?? []),
    ]
      .map((module) => module?.trim())
      .filter((module): module is string => Boolean(module));

    return new Set(selectedModules).size;
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
      label: 'Notices',
      value: examNoticesCount.toString(),
      sub: 'Exam Notices',
      color: 'text-red-600 bg-red-50',
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-400 px-5 py-6 text-white shadow-sm md:px-7 md:py-7">
          <div className="absolute -right-10 -top-16 h-52 w-52 rounded-full bg-white/10" />
          <div className="absolute right-16 -bottom-16 h-28 w-28 rounded-full bg-white/10" />

          <div className="relative z-10">
            <p className="text-xs font-medium text-white/80">{greeting()},</p>

            <h1 className="mt-1 text-2xl font-extrabold tracking-wide md:text-3xl">
              {studentFirstName?.toUpperCase() || 'STUDENT'}
              ! 👋
            </h1>

            <p className="mt-1 text-xs text-white/85 md:text-sm">
              Welcome to your Techna Student Portal. Here's what's happening.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="min-w-[78px] rounded-lg bg-slate-900/20 px-4 py-2">
                <p className="text-lg font-bold">
                  {avgScore ? `${avgScore}%` : '-'}
                </p>
                <p className="text-[10px] text-white/75">Avg. Score</p>
              </div>

              <div className="min-w-[78px] rounded-lg bg-slate-900/20 px-4 py-2">
                <p className="text-lg font-bold">
                  {enrolledModuleCount}
                </p>
                <p className="text-[10px] text-white/75">Subjects</p>
              </div>

              <div className="min-w-[78px] rounded-lg bg-slate-900/20 px-4 py-2">
                <p className="text-lg font-bold">{results.length}</p>
                <p className="text-[10px] text-white/75">Results</p>
              </div>

              <div className="min-w-[90px] rounded-lg bg-slate-900/20 px-4 py-2">
                <p className="text-lg font-bold">
                  {admissionNo}
                </p>
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

                <p className="text-xl font-bold text-gray-900">
                  {item.value}
                </p>
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
