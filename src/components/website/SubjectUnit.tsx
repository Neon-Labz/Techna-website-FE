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

export default function SubjectUnit() {
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

  // If any unit has a grade, show the two-column Grade 12 / Grade 13 table.
  // Otherwise (like ICT), show a simple single-column list.
  const hasGradeSplit = units.some((u) => u.grade);

  const grade12Units = units.filter((u) => u.grade === '12');
  const grade13Units = units.filter((u) => u.grade === '13');

  // Group by term for a table layout matching the syllabus PDF
  const terms = Array.from(new Set(units.map((u) => u.term)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className="relative overflow-hidden py-12 sm:py-16"
        style={{ background: 'linear-gradient(90deg, #0183CB, #34BFF3)' }}
      >
        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <nav className="mb-5 flex flex-wrap items-center justify-center gap-1.5 text-xs text-white/80 sm:mb-6 sm:text-sm">
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

          <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            {module.name}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            {module.description}
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs text-white/90 sm:gap-5 sm:text-sm">
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
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
        ) : hasGradeSplit ? (
          // ---- Two-column Grade 12 / Grade 13 table ----
          <div className="overflow-hidden rounded-xl border border-[#C1C6D7] bg-white shadow-sm">
            {/* Horizontal scroll wrapper keeps the 3-column table usable on
                narrow screens (iPhone SE 375px and up) instead of squashing
                or breaking the layout. */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#0183CB]/10 text-[#1B1C1C]">
                    <th className="w-32 whitespace-nowrap border-r border-[#E5E7EB] p-3 font-semibold sm:w-40 sm:p-4">
                      தவணை
                    </th>
                    <th className="border-r border-[#E5E7EB] p-3 font-semibold sm:p-4">
                      தரம் 12 பாடத்திட்டம்
                    </th>
                    <th className="p-3 font-semibold sm:p-4">
                      தரம் 13 பாடத்திட்டம்
                    </th>
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
                            className="border-r border-[#E5E7EB] p-3 align-top font-medium text-[#0183CB] sm:p-4"
                          >
                            {term}
                          </td>
                        )}
                          <td className="border-r border-[#E5E7EB] p-3 align-top sm:p-4">
                          {g12[i] && (
                            <>
                              <span className="mr-2 font-semibold text-gray-500">
                                {g12[i].unitNo}
                              </span>
                              {g12[i].title}
                            </>
                          )}
                        </td>
                        <td className="border-r border-[#E5E7EB]  p-3 align-top sm:p-4">
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
            <p className="border-t border-[#E5E7EB] p-3 text-center text-xs text-gray-400 sm:hidden">
              ← Scroll sideways to see the full table →
            </p>
          </div>
        ) : (
          // ---- Simple single-column list (no grade split, e.g. ICT) ----
          <div className="overflow-hidden rounded-xl border border-[#C1C6D7] bg-white shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#0183CB]/10 text-[#1B1C1C]">
                  <th className="w-28 whitespace-nowrap p-3 font-semibold sm:w-32 sm:p-4">
                    அலகு
                  </th>
                  <th className="p-3 font-semibold sm:p-4">தலைப்பு</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u) => (
                  <tr key={u.unitNo} className="border-t border-[#E5E7EB]">
                    <td className="p-3 align-top font-medium text-[#0183CB] sm:p-4">
                      {u.unitNo}
                    </td>
                    <td className="p-3 align-top sm:p-4">{u.title}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}