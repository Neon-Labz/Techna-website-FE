'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, Cpu, FlaskConical, Leaf, Globe, Calculator, Dna, BookOpen } from 'lucide-react';
import { moduleApi, ModuleFromApi } from '@/api/module.api';

const iconMap: Record<string, React.ElementType> = {
  'ENGINEERING TECHNOLOGY': Cpu,
  'SCIENCE FOR TECHNOLOGY': FlaskConical,
  'BIO SYSTEMS TECHNOLOGY': Dna,
  'AGRICULTURAL SCIENCE': Leaf,
  'GEOGRAPHY': Globe,
  'MATHEMATICS': Calculator,
};

const getIcon = (name: string) => iconMap[name] ?? BookOpen;

export default function FeaturedModulesSection() {
  const router = useRouter();
  const [modules, setModules] = useState<ModuleFromApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moduleApi.getAll()
      .then((data) => {
        setModules(data.slice(0, 6));
      })
      .catch((err: unknown) => console.error('Failed to fetch modules:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-ml-16">

          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[#34BFF3] font-semibold text-[12px] uppercase tracking-[0.1em]">
                OUR PROGRAMS
              </span>
              <h2 className="text-[30px] font-bold text-[#0a0a0f] mt-1">
                Explore Our Programs
              </h2>
              <p className="text-[#6b7280] text-[14px] mt-2 max-w-md leading-relaxed">
                Discover a wide range of undergraduate, postgraduate and diploma
                programs designed for your success.
              </p>
            </div>
            <button
              onClick={() => router.push('/modules')}
              className="flex items-center gap-2 bg-[#34BFF3] hover:bg-[#2aadd8] text-white text-[13px] font-semibold px-4 py-2.5 rounded-full transition-all duration-200 whitespace-nowrap"
            >
              View All Programs <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-[#e5e7eb] animate-pulse">
                  <div className="h-[160px] bg-[#34BFF3]/20" />
                  <div className="px-6 py-4 bg-white h-[52px]" />
                </div>
              ))}
            </div>
          )}

          {/* Grid */}
          {!loading && modules.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {modules.map((module) => {
                const Icon = getIcon(module.name);
                return (
                  <div
                    key={module._id}
                    className="group rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer bg-white"
                    onClick={() => router.push('/modules')}
                  >
                    {/* Card Top */}
                    <div
                      className="p-6 relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #34BFF3 0%, #1a9fd4 60%, #0e7ab5 100%)',
                      }}
                    >
                      <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
                      <div className="absolute right-4 -bottom-6 w-14 h-14 bg-white/10 rounded-full" />
                      <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center mb-4 relative z-10">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-white font-bold text-[16px] leading-snug relative z-10">
                        {module.name}
                      </h3>
                      <p className="text-white/80 text-[13px] mt-2 leading-relaxed line-clamp-2 relative z-10">
                        {module.description}
                      </p>
                    </div>

                    {/* Card Bottom */}
                    <div className="px-6 py-4 bg-white">
                      <button
                        className="flex items-center gap-1.5 text-[#34BFF3] text-[13px] font-semibold hover:gap-3 transition-all duration-200"
                        onClick={(e) => { e.stopPropagation(); router.push('/modules'); }}
                      >
                        Learn More <ArrowRight className="w-3.5 h-3.5" />
                      </button>
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
      </div>
    </section>
  );
}