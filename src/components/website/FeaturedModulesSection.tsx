import { useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, User, Layers } from 'lucide-react';
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

export default function FeaturedModulesSection() {
  const navigate = useNavigate();
  const featured = mockModules.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-blue-900 font-semibold text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Our Modules</h2>
            <p className="text-gray-500 mt-2 max-w-lg">Comprehensive subjects designed for A/L Technology Stream students to excel academically and professionally.</p>
          </div>
          <button
            onClick={() => navigate('/modules')}
            className="flex items-center gap-2 text-blue-900 font-semibold hover:gap-3 transition-all"
          >
            View All Modules <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((module, i) => (
            <div
              key={module.id}
              className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              onClick={() => navigate('/modules')}
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-br ${moduleColors[i % moduleColors.length]} p-6 relative overflow-hidden`}>
                <div className="absolute -right-6 -top-6 w-20 h-20 bg-white/10 rounded-full" />
                <div className="absolute -right-2 -bottom-4 w-12 h-12 bg-white/10 rounded-full" />
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wider mb-1">{module.code}</p>
                <h3 className="text-white font-bold text-lg leading-snug">{module.name}</h3>
              </div>

              {/* Card Body */}
              <div className="p-5 bg-white">
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{module.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-500" /> {module.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-500" /> {module.instructor}
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
                    {module.category}
                  </span>
                  <span className="text-xs text-gray-400">{module.credits} Credits</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
