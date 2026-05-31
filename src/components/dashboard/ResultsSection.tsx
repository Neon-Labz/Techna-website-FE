import { useState, useMemo } from 'react';
import { Award, Download, Filter, BarChart3, Calendar, BookOpen } from 'lucide-react';
import { mockResults, mockModules } from '../../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const gradeColor = (g: string) => {
  if (['A+', 'A'].includes(g)) return 'bg-green-100 text-green-700 border-green-200';
  if (['A-', 'B+', 'B'].includes(g)) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (['B-', 'C+', 'C'].includes(g)) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
  return 'bg-red-100 text-red-700 border-red-200';
};

const pctColor = (p: number) => {
  if (p >= 90) return 'from-green-500 to-green-400';
  if (p >= 75) return 'from-blue-600 to-blue-400';
  if (p >= 60) return 'from-yellow-500 to-yellow-400';
  return 'from-red-500 to-red-400';
};

export default function ResultsSection() {
  const [moduleFilter, setModuleFilter] = useState('all');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const semesters = [...new Set(mockResults.map(r => r.semester))];
  const modules = [...new Set(mockResults.map(r => r.moduleName))];

  const filtered = useMemo(() => {
    return mockResults.filter(r => {
      if (moduleFilter !== 'all' && r.moduleName !== moduleFilter) return false;
      if (semesterFilter !== 'all' && r.semester !== semesterFilter) return false;
      if (dateFrom && r.date < dateFrom) return false;
      if (dateTo && r.date > dateTo) return false;
      return true;
    });
  }, [moduleFilter, semesterFilter, dateFrom, dateTo]);

  const avgScore = filtered.length > 0
    ? Math.round(filtered.reduce((a, r) => a + (r.marks / r.maxMarks) * 100, 0) / filtered.length)
    : 0;

  const chartData = mockModules
    .filter(m => filtered.some(r => r.moduleId === m.id))
    .map(m => {
      const mResults = filtered.filter(r => r.moduleId === m.id);
      const avg = mResults.length > 0 ? Math.round(mResults.reduce((a, r) => a + (r.marks / r.maxMarks) * 100, 0) / mResults.length) : 0;
      return { name: m.code, avg, full: m.name };
    });

  const handleDownload = () => {
    const header = 'Module,Code,Exam Type,Marks,Max Marks,Grade,Date,Semester\n';
    const rows = filtered.map(r =>
      `"${r.moduleName}","${r.moduleCode}","${r.examType}",${r.marks},${r.maxMarks},"${r.grade}","${r.date}","${r.semester}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techna-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-800 rounded-3xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Award className="w-7 h-7 text-yellow-400" /> My Results
            </h1>
            <p className="text-blue-300 text-sm mt-1">View and download your examination results</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">{avgScore}%</p>
              <p className="text-blue-200 text-xs">Overall Avg</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2.5 text-center">
              <p className="text-yellow-400 font-bold text-xl">{filtered.length}</p>
              <p className="text-blue-200 text-xs">Exams</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-blue-700" />
          <h3 className="font-semibold text-gray-900 text-sm">Filter Results</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Module</label>
            <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Modules</option>
              {modules.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">Semester</label>
            <select value={semesterFilter} onChange={e => setSemesterFilter(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">All Semesters</option>
              {semesters.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> From Date</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium flex items-center gap-1"><Calendar className="w-3 h-3" /> To Date</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-400">{filtered.length} results found</span>
          <div className="flex gap-2">
            <button onClick={() => { setModuleFilter('all'); setSemesterFilter('all'); setDateFrom(''); setDateTo(''); }} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-gray-600">Clear Filters</button>
            <button onClick={handleDownload} className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-900 text-white text-xs font-medium rounded-lg hover:bg-blue-800 transition-all">
              <Download className="w-3.5 h-3.5" /> Download CSV
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-sm">
            <BarChart3 className="w-5 h-5 text-blue-700" /> Performance by Module (Average %)
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Average Score']}
                  labelFormatter={(label) => chartData.find(d => d.name === label)?.full || label}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                />
                <Bar dataKey="avg" fill="#1e3a8a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-700" />
          <h3 className="font-bold text-gray-900 text-sm">Detailed Results</h3>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Award className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No results match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Module', 'Code', 'Exam Type', 'Marks', 'Grade', 'Date', 'Semester'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(result => {
                  const pct = Math.round((result.marks / result.maxMarks) * 100);
                  return (
                    <tr key={result.id} className="hover:bg-gray-50 transition-all">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900 text-sm">{result.moduleName}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 font-mono">{result.moduleCode}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{result.examType}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-gray-900">{result.marks}/{result.maxMarks}</span>
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${pctColor(pct)}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${gradeColor(result.grade)}`}>{result.grade}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {new Date(result.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">{result.semester}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {filtered.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <p className="text-xs text-gray-400">Showing {filtered.length} results · Average: <strong>{avgScore}%</strong></p>
            <button onClick={handleDownload} className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-xs font-medium rounded-xl hover:bg-blue-800 transition-all">
              <Download className="w-3.5 h-3.5" /> Download All Results
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
