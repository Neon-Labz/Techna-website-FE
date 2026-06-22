'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, X } from 'lucide-react';
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

const formatDateUpper = (date?: string) => {
  const formatted = formatDate(date);
  return formatted === '-' ? '-' : formatted.toUpperCase();
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
  const [selectedNotice, setSelectedNotice] = useState<Announcement | null>(
    null,
  );

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

  useEffect(() => {
    document.body.style.overflow = selectedNotice ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedNotice]);

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
    <>
      <section
        className={
          embedded ? 'pt-2 pb-3 sm:pt-3 sm:pb-4' : 'bg-gray-50 py-4'
        }
      >
        <div className="mx-auto w-full max-w-[1250px] px-4">
                <div className="mb-4 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0183CB]">
              Latest Updates
            </span>

            <h2 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Notices & Announcements
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
              Stay updated with the latest exam schedules, assignments,
              holidays, and general announcements from Techna.
            </p>
          </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {loading && (
              <div className="col-span-full rounded-md border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                Loading announcements...
              </div>
            )}

            {!loading && visibleAnnouncements.length === 0 && (
              <div className="col-span-full rounded-md border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 shadow-sm">
                No announcements available.
              </div>
            )}

            {!loading &&
              visibleAnnouncements.map((notice) => (
                <div
                  key={
                    notice._id || notice.id || `${notice.title}-${notice.date}`
                  }
                  className="flex min-h-[220px] flex-col rounded-md border border-gray-200 bg-white p-5 shadow-sm ..."                >
                  <h3 className="mb-3 text-[21px] font-bold leading-tight text-[#222222]">
                    {notice.title}
                  </h3>

                  <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-[#0069B4]">
                    {formatDateUpper(notice.date)}
                  </p>

                  <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-gray-600">
                    {notice.content || '-'}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedNotice(notice)}
                    className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-bold text-[#005EB8] transition hover:text-[#00498f]"
                  >
                    View Full Schedule
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </section>

      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedNotice(null)}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[#0183CB]">
              Announcement Details
            </p>

            <h3 className="pr-8 text-2xl font-extrabold leading-tight text-gray-900">
              {selectedNotice.title}
            </h3>

            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#0069B4]">
              <CalendarDays className="h-4 w-4" />
              {formatDate(selectedNotice.date)}
            </div>

            <div className="mt-5 rounded-lg bg-gray-50 p-4">
              <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
                {selectedNotice.content || '-'}
              </p>
            </div>


            <button
              type="button"
              onClick={() => setSelectedNotice(null)}
              className="mt-6 w-full rounded-lg bg-[#0183CB] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0069a5]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
