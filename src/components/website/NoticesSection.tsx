import { Bell, CalendarDays, BookOpen, FileText, Sun } from 'lucide-react';
import { mockNotices } from '../../data/mockData';

const typeConfig = {
  exam: {
    label: 'Exam',
    color: 'bg-red-50 text-red-600 border-red-100',
    dot: 'bg-red-500',
    icon: BookOpen,
  },
  general: {
    label: 'General',
    color: 'bg-blue-50 text-[#0183CB] border-blue-100',
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

export default function NoticesSection({
  embedded = false,
}: NoticesSectionProps) {
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
          {mockNotices.map((notice) => {
            const cfg = typeConfig[notice.type];
            const Icon = cfg.icon;

            return (
              <div
                key={notice.id}
                className="flex min-h-[170px] flex-col rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${cfg.color}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>

                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sky-50">
                    <Icon className="h-3.5 w-3.5 text-[#0183CB]" />
                  </div>
                </div>

                <h3 className="mb-2 text-sm font-bold leading-snug text-gray-900">
                  {notice.title}
                </h3>

                <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-gray-500">
                  {notice.content}
                </p>

                <div className="mt-3 flex items-center gap-1.5 border-t border-gray-100 pt-3 text-[11px] text-gray-400">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(notice.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
