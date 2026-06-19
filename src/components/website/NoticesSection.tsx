'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import {
  announcementApi,
  type Announcement,
} from '../../api/announcement.api';
import { useAuthStore } from '../../store/authStore';

const formatDate = (date?: string) => {
  if (!date) return '-';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '-';

  return parsedDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

type NoticesSectionProps = {
  embedded?: boolean;
};

const getAnnouncementTarget = (announcement: Announcement) =>
  announcement.batch && announcement.batch !== 'None'
    ? announcement.batch
    : 'All Students';

export default function NoticesSection({
  embedded = false,
}: NoticesSectionProps) {
  const { student } = useAuthStore();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadAnnouncements = async () => {
      try {
        const data = await announcementApi.getAll();
        if (isMounted) setAnnouncements(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log('Announcements load error:', error);
        if (isMounted) setAnnouncements([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAnnouncements();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleAnnouncements = useMemo(() => {
    const studentBatch = student?.batch?.trim();

    return announcements.filter((announcement) => {
      const target = getAnnouncementTarget(announcement);

      if (target === 'All Students') return true;
      if (!studentBatch) return !embedded;

      return target === studentBatch;
    });
  }, [announcements, embedded, student?.batch]);

  return (
    <section
      className={embedded ? 'pt-2 pb-3 sm:pt-3 sm:pb-4' : 'bg-gray-50 py-10'}
    >
      <div
        className={
          embedded
            ? 'mx-auto w-full max-w-[1480px] px-4'
            : 'mx-auto w-full max-w-[1480px] px-4'
        }
      >
        <div className="mb-6 text-center sm:mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0183CB]">
            Latest Updates
          </span>

          <h2 className="mt-1 text-2xl font-extrabold text-gray-900">
            Notices & Announcements
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-500">
            Stay updated with the latest exam schedules, assignments, holidays,
            and general announcements from Techna.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading && (
            <div className="col-span-full rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
              Loading announcements...
            </div>
          )}

          {!loading && visibleAnnouncements.length === 0 && (
            <div className="col-span-full rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
              No announcements available.
            </div>
          )}

          {!loading && visibleAnnouncements.map((notice) => {
            return (
              <div
                key={notice._id || notice.id || `${notice.title}-${notice.date}`}
                className="flex min-h-[170px] flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="mb-2 text-sm font-bold leading-snug text-gray-900">
                  {notice.title}
                </h3>

                <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-gray-500">
                  {notice.content || '-'}
                </p>

                <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-[11px] text-gray-400">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {formatDate(notice.date)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
