'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  ArrowRight,
  BookOpen,
  Loader2,
  Home,
  ChevronRight,
} from 'lucide-react';
import api from '@/lib/axios';
import { moduleIcons } from '@/lib/moduleIcons';

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
  if (Array.isArray(raw)) return raw.map((s) => s.trim()).filter(Boolean);
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

export default function ModulesSection() {
  const [modules, setModules] = useState<ApiModule[]>([]);
  const [teacherBySubject, setTeacherBySubject] = useState<
    Record<string, PublicTeacher>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/modules') as unknown as Promise<ApiModule[]>,
      api.get('/public/teachers') as unknown as Promise<PublicTeacher[]>,
    ])
      .then(([modulesData, teachersData]) => {
        setModules(modulesData.filter((module) => module.status === 'active'));

        const map: Record<string, PublicTeacher> = {};
        teachersData.forEach((teacher) => {
          normalizeSubjects(teacher.subject).forEach((subject) => {
            map[subject.toLowerCase()] = teacher;
          });
        });

        setTeacherBySubject(map);
      })
      .catch(() => setError('Failed to load subjects'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative overflow-hidden py-16"
        style={{ background: 'linear-gradient(90deg, #0183CB, #34BFF3)' }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-8 h-32 w-32 rounded-full border-4 border-white" />
          <div className="absolute bottom-4 right-1/3 h-48 w-48 rounded-full border-4 border-white" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center justify-center gap-1.5 text-sm text-white/80">
            <Home className="h-3.5 w-3.5" />
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-white">Our Subject</span>
          </nav>

          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Our Subject
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white/80">
            Explore our wide range of industry-relevant subjects designed to
            build skills, knowledge and shape your future.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-[#0183CB]" />
          </div>
        )}

        {error && (
          <div className="py-24 text-center text-gray-500">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mb-8 flex justify-end">
              <span className="text-base font-semibold text-[#0183CB]">
                {modules.length} Subject{modules.length !== 1 ? 's' : ''} found
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module, idx) => {
                const Icon = moduleIcons[idx % moduleIcons.length];
                const matchedTeacher =
                  teacherBySubject[module.name.toLowerCase()];
                const teacherId = matchedTeacher?._id ?? module.teacherId;

                return (
                  <div
                    key={module._id}
                    className="flex flex-col rounded-xl border border-[#C1C6D7] bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#0183CB]/10">
                        <Icon className="h-7 w-7 text-[#0183CB]" />
                      </div>

                      <h3 className="mb-2 text-2xl font-bold text-[#1B1C1C]">
                        {module.name}
                      </h3>

                      {module.description ? (
                        <p className="mb-5 flex-1 text-base leading-relaxed text-[#414754]">
                          {module.description}
                        </p>
                      ) : (
                        <div className="mb-5 flex-1" />
                      )}

                      <div className="mb-4 border-t border-[#E5E7EB]" />

                      <div className="mb-5 flex items-center gap-5 text-sm text-[#6B7280]">
                        {module.duration && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-[#0183CB]" />
                            {module.duration}
                          </span>
                        )}

                        {module.batch && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-[#0183CB]" />
                            Batch: {module.batch}
                          </span>
                        )}
                      </div>

                      {teacherId ? (
                        <Link
                          href={`/teachers/${teacherId}?subject=${encodeURIComponent(
                            module.name,
                          )}`}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0183CB] py-3 text-sm font-bold text-white transition-colors hover:bg-[#016fad]"
                        >
                          Visit Teacher <ArrowRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <div className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gray-100 py-3 text-sm font-bold text-gray-400">
                          No Teacher Assigned
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {modules.length === 0 && (
              <div className="py-24 text-center text-gray-400">
                <BookOpen className="mx-auto mb-3 h-12 w-12 opacity-30" />
                <p>No subjects available</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}