'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Clock,
  Calendar,
  ArrowRight,
  BookOpen,
  Loader2,
} from 'lucide-react';
import api from '@/lib/axios';
import { sortModulesByConfig, getModuleIcon } from '@/lib/moduleIcons';
import PageHero from './PageHero';

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
  term?: string;
  unit?: number;
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
  const router = useRouter();
  const [modules, setModules] = useState<ApiModule[]>([]);
  const [teacherBySubject, setTeacherBySubject] = useState<Record<string, PublicTeacher>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get('/modules/public') as unknown as Promise<ApiModule[]>,
      api.get('/public/teachers') as unknown as Promise<PublicTeacher[]>,
    ])
      .then(([modulesData, teachersData]) => {
        const sorted = sortModulesByConfig(
          Array.isArray(modulesData) ? modulesData : []
        );
        setModules(sorted);

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
      <PageHero
        title="Our Subject"
        subtitle="Explore our wide range of industry-relevant subjects designed to build skills, knowledge and shape your future."
        currentPage="Our Subject"
      />

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
              {modules.map((module) => {
                const Icon = getModuleIcon(module.name);
                const matchedTeacher =
                  teacherBySubject[module.name.toLowerCase()];
                const teacherId = matchedTeacher?._id ?? module.teacherId;

                return (
                  <div
                    key={module._id}
                    onClick={() => router.push(`/modules/${module._id}`)}
                    className="flex cursor-pointer flex-col rounded-xl border border-[#C1C6D7] bg-white shadow-sm transition-shadow hover:shadow-md"
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

                      <div className="mb-5 flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
                        {module.duration && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-[#0183CB]" />
                            {module.duration}
                          </span>
                        )}

                        {module.unit != null && module.unit > 0 && (
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="h-4 w-4 text-[#0183CB]" />
                            {module.unit} Unit{module.unit !== 1 ? 's' : ''}
                          </span>
                        )}

                        {module.term && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-[#0183CB]" />
                            Term: {module.term}
                          </span>
                        )}
                      </div>

                      {teacherId ? (
                        <Link
                          href={`/teachers/${teacherId}?subject=${encodeURIComponent(
                            module.name,
                          )}`}
                          onClick={(e) => e.stopPropagation()}
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