'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  ArrowRight,
  Settings,
  FlaskConical,
  Calculator,
  Globe,
  Monitor,
  Leaf,
  BookOpen,
  Microscope,
  Loader2,
  Home,
  ChevronRight,
  Layers,
} from 'lucide-react';
import api from '@/lib/axios';

interface ApiModule {
  _id: string;
  name: string;
  description: string;
  teacherId: string;
  teacherName: string;
  duration: string;
  fee: number;
  batch: string;
  status: 'active' | 'inactive';
}

interface PublicTeacher {
  _id: string;
  fullName: string;
  subject: string | string[];
  photoUrl?: string;
}

function normalizeSubjects(raw: string | string[] | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(s => s.trim()).filter(Boolean);
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

function getIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('engineering')) return Settings;
  if (lower.includes('science')) return FlaskConical;
  if (lower.includes('mathematics') || lower.includes('math')) return Calculator;
  if (lower.includes('geography')) return Globe;
  if (lower.includes('computer') || lower.includes('ict') || lower.includes('information')) return Monitor;
  if (lower.includes('agriculture') || lower.includes('agricultural')) return Leaf;
  if (lower.includes('biology') || lower.includes('bio')) return Microscope;
  if (lower.includes('commerce') || lower.includes('business')) return Layers;
  return BookOpen;
}

export default function ModulesSection() {
  const [modules, setModules] = useState<ApiModule[]>([]);
  const [teacherBySubject, setTeacherBySubject] = useState<Record<string, PublicTeacher>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/modules') as unknown as Promise<ApiModule[]>,
      api.get('/public/teachers') as unknown as Promise<PublicTeacher[]>,
    ])
      .then(([modulesData, teachersData]) => {
        setModules(modulesData.filter(m => m.status === 'active'));

        const map: Record<string, PublicTeacher> = {};
        teachersData.forEach(teacher => {
          normalizeSubjects(teacher.subject).forEach(subj => {
            map[subj.toLowerCase()] = teacher;
          });
        });
        setTeacherBySubject(map);
      })
      .catch(() => setError('Failed to load subjects'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div
        className="py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(90deg, #0183CB, #34BFF3)' }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-8 left-1/4 w-32 h-32 rounded-full border-4 border-white" />
          <div className="absolute bottom-4 right-1/3 w-48 h-48 rounded-full border-4 border-white" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <nav className="flex items-center justify-center gap-1.5 text-white/80 text-sm mb-6">
            <Home className="w-3.5 h-3.5" />
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Our Subject</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Our Subject</h1>
          <p className="text-white/80 mt-3 max-w-2xl mx-auto text-base leading-relaxed">
            Explore our wide range of industry-relevant subjects designed to build skills,
            knowledge and shape your future.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 animate-spin text-[#0183CB]" />
          </div>
        )}

        {error && (
          <div className="text-center py-24 text-gray-500">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex justify-end mb-8">
              <span className="text-[#0183CB] font-semibold text-base">
                {modules.length} Subject{modules.length !== 1 ? 's' : ''} found
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map(module => {
                const Icon = getIcon(module.name);

                const matchedTeacher = teacherBySubject[module.name.toLowerCase()];
                const teacherId = matchedTeacher?._id ?? (module.teacherId || null);

                return (
                  <div
                    key={module._id}
                    className="bg-white rounded-xl border border-[#C1C6D7] shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="p-6 flex flex-col flex-1">
                      <div className="w-14 h-14 rounded-xl bg-[#0183CB]/10 flex items-center justify-center mb-5">
                        <Icon className="w-7 h-7 text-[#0183CB]" />
                      </div>

                      <h3 className="text-2xl font-bold text-[#1B1C1C] mb-2">{module.name}</h3>

                      {module.description ? (
                        <p className="text-base text-[#414754] leading-relaxed flex-1 mb-5">
                          {module.description}
                        </p>
                      ) : (
                        <div className="flex-1 mb-5" />
                      )}

                      <div className="border-t border-[#E5E7EB] mb-4" />

                      <div className="flex items-center gap-5 text-sm text-[#6B7280] mb-5">
                        {module.duration && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#0183CB]" />
                            {module.duration}
                          </span>
                        )}
                        {module.batch && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#0183CB]" />
                            Batch: {module.batch}
                          </span>
                        )}
                      </div>

                      {teacherId ? (
                        <Link
                          href={`/teachers/${teacherId}?subject=${encodeURIComponent(module.name)}`}
                          className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-bold text-sm text-white transition-colors"
                          style={{ background: '#0183CB' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#016fad')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#0183CB')}
                        >
                          Visit Teacher <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <div className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-400 text-sm font-bold rounded-lg cursor-not-allowed">
                          No Teacher Assigned
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {modules.length === 0 && (
              <div className="text-center py-24 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No subjects available</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
