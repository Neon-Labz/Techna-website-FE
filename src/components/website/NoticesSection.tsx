import { Bell, CalendarDays, BookOpen, FileText, Sun } from 'lucide-react';
import { mockNotices } from '../../data/mockData';

const typeConfig = {
  exam: { label: 'Exam', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500', icon: BookOpen },
  general: { label: 'General', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500', icon: Bell },
  assignment: { label: 'Assignment', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', icon: FileText },
  holiday: { label: 'Holiday', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500', icon: Sun },
};

export default function NoticesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-900 font-semibold text-sm uppercase tracking-wider">Latest Updates</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">Notices & Announcements</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Stay updated with the latest exam schedules, assignments, holidays, and general announcements from Techna.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockNotices.map(notice => {
            const cfg = typeConfig[notice.type];
            const Icon = cfg.icon;
            return (
              <div
                key={notice.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-blue-700" />
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-base mb-2 leading-snug">{notice.title}</h3>
                <p className="text-gray-500 text-sm flex-1 leading-relaxed line-clamp-3">{notice.content}</p>

                <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {new Date(notice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
