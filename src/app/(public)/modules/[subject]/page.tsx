'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Clock, Calendar, Loader2, Home, ChevronRight, ArrowLeft } from 'lucide-react';
import api from '@/lib/axios';
import { subjectUnitsByName, SubjectUnitDetail } from '@/data/subjectUnits';

interface ApiModule {
  _id: string;
  name: string;
  description: string;
  duration: string;
  term?: string;
}

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.subject as string;

  const [module, setModule] = useState<ApiModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('/modules/public')
      .then((data) => {
        const modules = data as unknown as ApiModule[];
        const found = modules.find((m) => m._id === id);
        if (!found) {
          setError('Subject not found');
        } else {
          setModule(found);
        }
      })
      .catch(() => setError('Failed to load subject'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#0183CB]" />
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-gray-500">
        <p>{error ?? 'Subject not found'}</p>
        <button
          onClick={() => router.push('/modules')}
          className="rounded-lg bg-[#0183CB] px-5 py-2 text-sm font-semibold text-white"
        >
          Back to Subjects
        </button>
      </div>
    );
  }

  const units: SubjectUnitDetail[] =
    subjectUnitsByName[module.name.toLowerCase()] ?? [];
  const grade12Units = units.filter((u) => u.grade === '12');
  const grade13Units = units.filter((u) => u.grade === '13');

  // Group by term for a table layout matching the syllabus PDF
  const terms = Array.from(new Set(units.map((u) => u.term)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative overflow-hidden py-16"
        style={{ background: 'linear-gradient(90deg, #0183CB, #34BFF3)' }}
      >
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/80">
            <Home className="h-3.5 w-3.5" />
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/modules" className="transition-colors hover:text-white">
              Subjects
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-white">{module.name}</span>
          </nav>

          <h1 className="text-4xl font-bold text-white md:text-5xl">
            {module.name}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-white/80">
            {module.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-5 text-sm text-white/90">
            {module.duration && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {module.duration}
              </span>
            )}
            {module.term && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {module.term}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push('/modules')}
          className="mb-6 flex items-center gap-1.5 text-sm font-medium text-[#0183CB] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all subjects
        </button>

        {units.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-400">
            Unit details for this subject are not available yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-[#C1C6D7] bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[#0183CB]/10 text-[#1B1C1C]">
                  <th className="w-40 p-4 font-semibold">தவணை</th>
                  <th className="p-4 font-semibold">தரம் 12 பாடத்திட்டம்</th>
                  <th className="p-4 font-semibold">தரம் 13 பாடத்திட்டம்</th>
                </tr>
              </thead>
              <tbody>
                {terms.map((term) => {
                  const g12 = grade12Units.filter((u) => u.term === term);
                  const g13 = grade13Units.filter((u) => u.term === term);
                  const rowCount = Math.max(g12.length, g13.length, 1);

                  return Array.from({ length: rowCount }).map((_, i) => (
                    <tr key={`${term}-${i}`} className="border-t border-[#E5E7EB]">
                      {i === 0 && (
                        <td
                          rowSpan={rowCount}
                          className="p-4 align-top font-medium text-[#0183CB]"
                        >
                          {term}
                        </td>
                      )}
                      <td className="p-4 align-top">
                        {g12[i] && (
                          <>
                            <span className="mr-2 font-semibold text-gray-500">
                              {g12[i].unitNo}
                            </span>
                            {g12[i].title}
                          </>
                        )}
                      </td>
                      <td className="p-4 align-top">
                        {g13[i] && (
                          <>
                            <span className="mr-2 font-semibold text-gray-500">
                              {g13[i].unitNo}
                            </span>
                            {g13[i].title}
                          </>
                        )}
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}