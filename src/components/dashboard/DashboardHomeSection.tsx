import { useState } from 'react';
import { Bell, BookOpen, Play, ChevronRight, Calendar, Award, TrendingUp, Clock, Filter } from 'lucide-react';
import { mockNotices, mockModules, mockResults } from '../../data/mockData';
import { useAuthStore } from '../../store/authStore';

const typeColors = {
  exam: 'bg-red-50 border-red-200 text-red-700',
  general: 'bg-blue-50 border-blue-200 text-blue-700',
  assignment: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  holiday: 'bg-green-50 border-green-200 text-green-700',
};

const typeDots = {
  exam: 'bg-red-500',
  general: 'bg-blue-500',
  assignment: 'bg-yellow-500',
  holiday: 'bg-green-500',
};

export default function DashboardHomeSection() {
  const { student } = useAuthStore();
  const [activeModule, setActiveModule] = useState<string>('all');

  const allVideos = mockModules.flatMap(m => m.videos);
  const studentModules = mockModules.filter(m =>
    m.videos.length > 0 || student?.subjects.some(s => m.name.includes(s.split(' ')[0]))
  );

  const filteredVideos = activeModule === 'all'
    ? allVideos
    : allVideos.filter(v => v.moduleId === activeModule);

  const recentResults = mockResults.slice(0, 3);
  const avgScore = mockResults.length > 0
    ? Math.round(mockResults.reduce((acc, r) => acc + (r.marks / r.maxMarks) * 100, 0) / mockResults.length)
    : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-yellow-400/10 rounded-full translate-y-1/2" />
        <div className="relative">
          <p className="text-blue-300 text-sm font-medium mb-1">{greeting()},</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">{student?.fullNameEnglish?.split(' ')[0] || 'Student'}! 👋</h1>
          <p className="text-blue-200 text-sm">Welcome to your Techna Student Portal. Here's what's happening.</p>
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">{avgScore}%</p>
              <p className="text-blue-200 text-xs">Avg. Score</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">{student?.subjects.length || 3}</p>
              <p className="text-blue-200 text-xs">Subjects</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">{mockResults.length}</p>
              <p className="text-blue-200 text-xs">Results</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">{student?.admissionNumber?.split('-')[2] || '0042'}</p>
              <p className="text-blue-200 text-xs">Admission No.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Award, label: 'Latest Grade', value: recentResults[0]?.grade || 'A+', sub: recentResults[0]?.moduleName || 'ICT', color: 'text-blue-600 bg-blue-50' },
          { icon: TrendingUp, label: 'Average Marks', value: `${avgScore}%`, sub: 'All subjects', color: 'text-green-600 bg-green-50' },
          { icon: BookOpen, label: 'Modules', value: mockModules.length.toString(), sub: 'Enrolled', color: 'text-purple-600 bg-purple-50' },
          { icon: Bell, label: 'Notices', value: mockNotices.filter(n => n.type === 'exam').length.toString(), sub: 'Exam notices', color: 'text-red-600 bg-red-50' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Exam Notices */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-700" /> Exam Notices
              </h2>
              <span className="text-xs text-gray-400">{mockNotices.filter(n => n.type === 'exam').length} active</span>
            </div>
            <div className="space-y-3">
              {mockNotices.map(notice => (
                <div key={notice.id} className={`p-3.5 rounded-xl border text-sm ${typeColors[notice.type]}`}>
                  <div className="flex items-start gap-2">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${typeDots[notice.type]}`} />
                    <div>
                      <p className="font-semibold text-xs leading-snug mb-1">{notice.title}</p>
                      <p className="text-xs opacity-80 line-clamp-2 leading-relaxed">{notice.content}</p>
                      <div className="flex items-center gap-1 mt-1.5 text-xs opacity-60">
                        <Calendar className="w-3 h-3" />
                        {new Date(notice.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lecture Videos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-700" /> Lecture Recordings
              </h2>
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <select
                  value={activeModule}
                  onChange={e => setActiveModule(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Modules</option>
                  {studentModules.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Play className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No videos available for this module yet.</p>
                </div>
              ) : (
                filteredVideos.map(video => (
                  <div key={video.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer group border border-gray-100">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-700">{video.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{video.moduleName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{video.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                        <Clock className="w-3 h-3" /> {video.duration}
                      </div>
                      <p className="text-xs text-gray-400">{new Date(video.uploadedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-700" /> Recent Results
          </h2>
          <a href="/dashboard/results" className="text-xs text-blue-700 font-medium hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentResults.map(result => {
            const pct = Math.round((result.marks / result.maxMarks) * 100);
            const color = pct >= 90 ? 'text-green-600 bg-green-50' : pct >= 75 ? 'text-blue-600 bg-blue-50' : pct >= 60 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
            return (
              <div key={result.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{result.moduleName}</p>
                    <p className="text-xs text-gray-400">{result.examType} · {result.semester}</p>
                  </div>
                  <span className={`text-lg font-bold px-2 py-0.5 rounded-lg ${color}`}>{result.grade}</span>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{result.marks}/{result.maxMarks}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
