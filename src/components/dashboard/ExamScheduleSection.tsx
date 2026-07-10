'use client';
import { useEffect, useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, BookOpen, Filter, Award, AlertCircle, ClipboardList } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const API = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:4000/api';

interface ExamNotice {
  _id: string;
  title: string;
  moduleId: string;
  moduleName: string;
  batch: string;
  date: string;
  startTime: string;
  endTime: string;
  venue: string;
  description?: string;
  totalMarks?: number;
  status?: string;
  isPublished: boolean;
  publishedAt?: string;
}

const statusBadge = (status?: string) => {
  switch (status) {
    case 'upcoming': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'completed': return 'bg-green-50 text-green-700 border-green-200';
    case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

export default function ExamScheduleSection() {
  const { student } = useAuthStore();
  const [exams, setExams] = useState<ExamNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API}/exam-notices/public`);
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message ?? 'Failed to fetch');
        setExams(json.data ?? []);
      } catch {
        setError('Unable to load exam schedule. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const modules = useMemo(() => [...new Set(exams.map(e => e.moduleName))].sort(), [exams]);
  const batches = useMemo(() => [...new Set(exams.map(e => e.batch))].sort(), [exams]);

  const filtered = useMemo(() => {
    return exams
      .filter(e => {
        if (moduleFilter !== 'all' && e.moduleName !== moduleFilter) return false;
        if (batchFilter !== 'all' && e.batch !== batchFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [exams, moduleFilter, batchFilter]);

  const upcoming = filtered.filter(e => new Date(e.date) >= new Date());
  const past = filtered.filter(e => new Date(e.date) < new Date());

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const ExamCard = ({ exam }: { exam: ExamNotice }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{exam.title}</p>
          <p className="text-blue-700 text-xs font-medium mt-0.5">{exam.moduleName}</p>
        </div>
        <span className={`shrink-0 px-2.5 py-1 text-xs font-semibold rounded-lg border capitalize ${statusBadge(exam.status)}`}>
          {exam.status ?? 'scheduled'}
        </span>
      </div>

      <div className="space-y-1.5 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>{fmtDate(exam.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>{exam.startTime} – {exam.endTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>{exam.venue}</span>
        </div>
        {exam.totalMarks && (
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>Total Marks: {exam.totalMarks}</span>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">{exam.batch}</span>
        <span className="text-xs text-amber-600 font-medium italic">Grade: To be announced</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-950 to-blue-800 rounded-3xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ClipboardList className="w-7 h-7 text-yellow-400" /> Exam Schedule
            </h1>
            <p className="text-blue-300 text-sm mt-1">
              {student?.fullNameEnglish
                ? `${student.fullNameEnglish}'s upcoming exams and results`
                : 'View your upcoming exams and results'}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">{upcoming.length}</p>
              <p className="text-blue-200 text-xs">Upcoming</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">{filtered.length}</p>
              <p className="text-blue-200 text-xs">Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-blue-700" />
          <h3 className="font-semibold text-gray-900 text-sm">Filter Exams</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Subject</label>
            <select
              value={moduleFilter}
              onChange={e => setModuleFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Batch</label>
            <select
              value={batchFilter}
              onChange={e => setBatchFilter(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Batches</option>
              {batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>
        {(moduleFilter !== 'all' || batchFilter !== 'all') && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => { setModuleFilter('all'); setBatchFilter('all'); }}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700" />
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
          <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No exam notices available yet.</p>
          <p className="text-gray-400 text-sm mt-1">Check back later for your exam schedule.</p>
        </div>
      )}

      {!loading && !error && upcoming.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-blue-700" /> Upcoming Exams
            <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{upcoming.length}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcoming.map(exam => <ExamCard key={exam._id} exam={exam} />)}
          </div>
        </div>
      )}

      {!loading && !error && past.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-gray-500" /> Past Exams
            <span className="ml-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{past.length}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
            {past.map(exam => <ExamCard key={exam._id} exam={exam} />)}
          </div>
        </div>
      )}
    </div>
  );
}
