'use client';

import { useEffect, useState } from 'react';
import { Bell, CalendarDays, BookOpen, FileText, Sun } from 'lucide-react';
import api from '../../lib/axios';
import { dashboardApi } from '@/api/dashboard.api';

type NoticeType = 'exam' | 'general' | 'assignment' | 'holiday';

type Notice = {
  id?: string;
  _id?: string;
  type?: NoticeType;
  title?: string;
  content?: string;
  description?: string;
  date?: string;
  examDate?: string;
  createdAt?: string;
};

const typeConfig = {
  exam: {
    label: 'Exam',
    color: 'bg-red-50 text-red-600 border-red-100',
    dot: 'bg-red-500',
    icon: BookOpen,
  },
  general: {
    label: 'General',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    dot: 'bg-blue-500',
    icon: Bell,
  },
  assignment: {
    label: 'Assignment',
    color: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    dot: 'bg-yellow-500',
    icon: FileText,
  },
  holiday: {
    label: 'Holiday',
    color: 'bg-green-50 text-green-600 border-green-100',
    dot: 'bg-green-500',
    icon: Sun,
  },
};

type NoticesSectionProps = {
  embedded?: boolean;
};

function getArrayData(resData: any): Notice[] {
  if (Array.isArray(resData)) return resData;
  if (Array.isArray(resData?.data)) return resData.data;
  if (Array.isArray(resData?.notices)) return resData.notices;
  return [];
}

export default function NoticesSection({
  embedded = false,
}: NoticesSectionProps) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const notices = await dashboardApi.getNotices();
        setNotices(notices);
      } catch (error) {
        console.error('Fetch notices error:', error);
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <section
      className={
        embedded
          ? 'pt-2 pb-3 sm:pt-3 sm:pb-4'
          : 'w-full bg-gray-50 py-6 sm:py-8 lg:py-10'
      }
    >
      <div
        className={
          embedded
            ? 'mx-auto w-full max-w-7xl'
            : 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'
        }
      >
        <div className="mb-6 text-center sm:mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-500">
            Latest Updates
          </span>

          <h2 className="mt-1 text-xl font-extrabold text-gray-900 sm:text-2xl">
            Notices & Announcements
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-gray-500 sm:text-sm">
            Stay updated with the latest exam schedules, assignments, holidays,
            and general announcements from Techna.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500">
            Loading notices...
          </div>
        ) : notices.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500">
            No notices available.
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => {
              const noticeType = notice.type || 'exam';
              const cfg = typeConfig[noticeType] || typeConfig.exam;
              const Icon = cfg.icon;

              const noticeDate =
                notice.date ||
                notice.examDate ||
                notice.createdAt ||
                new Date().toISOString();

              return (
                <div
                  key={notice._id || notice.id}
                  className="flex min-h-[170px] w-full flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold ${cfg.color}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}
                      />
                      {cfg.label}
                    </span>

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50">
                      <Icon className="h-4 w-4 text-sky-600" />
                    </div>
                  </div>

                  <h3 className="mb-3 text-sm font-extrabold leading-snug text-gray-900 sm:text-base">
                    {notice.title || 'Untitled Notice'}
                  </h3>

                  <p className="line-clamp-3 flex-1 text-xs leading-6 text-gray-500 sm:text-sm">
                    {notice.content || notice.description || '-'}
                  </p>

                  <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-[11px] text-gray-400 sm:text-xs">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {new Date(noticeDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}