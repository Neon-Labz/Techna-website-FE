'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { moduleApi, ModuleFromApi } from '@/api/module.api';
import { sortModulesByConfig, getModuleIcon } from '@/lib/moduleIcons';

export default function FeaturedModulesSection() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleFromApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moduleApi.getAll()
      .then((data) => {
        setModules(sortModulesByConfig(data).slice(0, 6));
      })
      .catch((err: unknown) => console.error('Failed to fetch modules:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-10 sm:py-14 lg:py-20 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-[#34BFF3] font-semibold text-[11px] sm:text-[12px] uppercase tracking-[0.1em]">
              OUR PROGRAMS
            </span>
            <h2 className="text-[24px] sm:text-[28px] lg:text-[30px] font-bold text-[#0a0a0f] mt-1">
              Explore Our Programs
            </h2>
            <p className="text-[#6b7280] text-[13px] sm:text-[14px] mt-2 max-w-md leading-relaxed">
              Discover a wide range of undergraduate, postgraduate and diploma
              programs designed for your success.
            </p>
          </div>
          <button
            onClick={() => router.push('/modules')}
            className="flex items-center gap-2 text-[#34BFF3] hover:gap-3 text-[13px] sm:text-[14px] font-bold transition-all duration-200 whitespace-nowrap"
          >
            View All Programs
            <span className="flex items-center justify-center w-7 h-7 bg-[#34BFF3] rounded-full">
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </span>
          </button>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-[#e5e7eb] animate-pulse">
                <div className="h-[140px] sm:h-[160px] bg-[#34BFF3]/20" />
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!loading && modules.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {modules.map((module) => {
              const Icon = getModuleIcon(module.name);
              return (
                <div
                  key={module._id}
                  className="group rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white"
                  onClick={() => router.push(`/modules/${module._id}`)}
                >
                  {/* Card Top */}
                  <div
                    className="p-5 sm:p-6 relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #34BFF3 0%, #1a9fd4 60%, #0e7ab5 100%)',
                    }}
                  >
                    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4 relative z-10">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-[15px] sm:text-[16px] leading-snug relative z-10">
                      {module.name}
                    </h3>
                    <p className="text-white/80 text-[12px] sm:text-[13px] mt-2 leading-relaxed line-clamp-2 relative z-10">
                      {module.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && modules.length === 0 && (
          <p className="text-center text-[#6b7280] text-[14px] py-10">
            No programs found.
          </p>
        )}

      </div>
    </section>
  );
}