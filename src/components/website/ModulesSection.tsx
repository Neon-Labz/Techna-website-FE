'use client';
import { useState } from 'react';
import { Clock, Play, ChevronDown, ChevronUp, BookOpen, Layers, Calendar } from 'lucide-react';
import { mockModules } from '../../data/mockData';

const moduleColors = [
  'from-blue-600 to-blue-800',
  'from-purple-600 to-purple-800',
  'from-emerald-600 to-emerald-800',
  'from-orange-600 to-orange-800',
  'from-rose-600 to-rose-800',
  'from-teal-600 to-teal-800',
  'from-indigo-600 to-indigo-800',
];

export default function ModulesSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Core', 'Elective'];
  const filtered = filter === 'All' ? mockModules : mockModules.filter(m => m.category === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-br from-blue-950 to-blue-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">A/L Technology Stream</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">Our Subjects</h1>
          <p className="text-blue-300 mt-3 max-w-xl mx-auto">Explore all subjects and courses offered at Techna Technical Institute for the A/L Technology Stream.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <span className="text-sm text-gray-500 font-medium">Filter by:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === cat ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400">{filtered.length} subjects found</span>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((module, i) => {
            const isOpen = expanded === module.id;
            return (
              <div key={module.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                {/* Header */}
                <div className={`bg-gradient-to-r ${moduleColors[i % moduleColors.length]} p-5`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-white/60 text-xs font-medium uppercase tracking-wider">{module.code}</span>
                      <h3 className="text-white font-bold text-xl mt-0.5">{module.name}</h3>
                    </div>
                    <span className="px-2.5 py-1 bg-white/20 text-white text-xs font-semibold rounded-full">{module.category}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{module.description}</p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {module.instructorPhotoUrl ? (
                        <img
                          src={module.instructorPhotoUrl}
                          alt={module.instructor}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold shrink-0">
                          {module.instructor.charAt(0)}
                        </div>
                      )}
                      <span className="truncate">{module.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {module.duration}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="truncate">{module.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Layers className="w-4 h-4 text-blue-500" />
                      {module.credits} Credits
                    </div>
                  </div>

                  {/* Toggle Videos */}
                  {module.videos.length > 0 && (
                    <>
                      <button
                        onClick={() => setExpanded(isOpen ? null : module.id)}
                        className="flex items-center justify-between w-full px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-sm font-medium transition-all"
                      >
                        <span className="flex items-center gap-2">
                          <Play className="w-4 h-4" /> {module.videos.length} Lecture Recording{module.videos.length !== 1 ? 's' : ''}
                        </span>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isOpen && (
                        <div className="mt-3 space-y-2">
                          {module.videos.map(video => (
                            <div key={video.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shrink-0">
                                <Play className="w-4 h-4 text-white fill-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-700">{video.title}</p>
                                <p className="text-xs text-gray-400">{video.duration} · {new Date(video.uploadedAt).toLocaleDateString('en-GB')}</p>
                              </div>
                              <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
                            </div>
                          ))}
                          <div className="text-center pt-2">
                            <p className="text-xs text-gray-400">Login to access all lecture recordings →</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
