'use client';
import { useAuthStore } from '../../store/authStore';
import {
  Bell,
  BookOpen,
  Award,
  TrendingUp,
} from "lucide-react";
import { mockNotices, mockModules, mockResults } from "../../data/mockData";


export default function DashboardHeroSection() {
      const { student } = useAuthStore();
      const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
    };
    
     const avgScore = mockResults.length > 0
        ? Math.round(mockResults.reduce((acc, r) => acc + (r.marks / r.maxMarks) * 100, 0) / mockResults.length)
        : 0;
    
    const recentResults = mockResults.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-800 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-yellow-400/10 rounded-full translate-y-1/2" />
        <div className="relative">
          <p className="text-blue-300 text-sm font-medium mb-1">
            {greeting()},
          </p>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {student?.fullNameEnglish?.split(" ")[0] || "Student"}! 👋
          </h1>
          <p className="text-blue-200 text-sm">
            Welcome to your Techna Student Portal. Here's what's happening.
          </p>
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">{avgScore}%</p>
              <p className="text-blue-200 text-xs">Avg. Score</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">
                {student?.subjects.length || 3}
              </p>
              <p className="text-blue-200 text-xs">Subjects</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">
                {mockResults.length}
              </p>
              <p className="text-blue-200 text-xs">Results</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">
                {student?.admissionNumber?.split("-")[2] || "0042"}
              </p>
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
          { icon: BookOpen, label: 'Subjects', value: mockModules.length.toString(), sub: 'Enrolled', color: 'text-purple-600 bg-purple-50' },
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
    </div>
  );
}
