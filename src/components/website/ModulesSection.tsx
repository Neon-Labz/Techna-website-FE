'use client';
import { Clock, Layers, Calendar, ArrowRight } from 'lucide-react';
import { mockModules } from '../../data/mockData';
import Link from 'next/link';

/* Proper capitalized subject display names */
const subjectDisplayNames: Record<string, string> = {
  'Engineering Technology': 'Engineering Technology',
  'Bio Systems Technology': 'Bio Systems Technology',
  'Science For Technology': 'Science For Technology',
  'Information Communication Technology': 'Computer Applications',
  'Mathematics': 'Mathematics',
  'Geography': 'Geography',
  'Agricultural Science': 'Agricultural Science',
};

/* Subject-related emojis - each emoji represents the subject */
const subjectEmojis: Record<string, string> = {
  'Engineering Technology': '⚙️',
  'Bio Systems Technology': '🧬',
  'Science For Technology': '🔬',
  'Information Communication Technology': '💻',
  'Mathematics': '📐',
  'Geography': '🌍',
  'Agricultural Science': '🌱',
};

/* Subject card descriptions */
const subjectDescriptions: Record<string, string> = {
  'Engineering Technology': 'Build a strong foundation in core engineering principles with hands-on learning.',
  'Bio Systems Technology': 'Develop biodiversity and business skills for tomorrow\'s global challenges.',
  'Science For Technology': 'Explore the world through discovery, research and innovation.',
  'Information Communication Technology': 'Innovate, code and transform ideas into digital solutions.',
  'Mathematics': 'Shape perspectives and create a better understanding of society and the universe.',
  'Geography': 'Drive business growth with knowledge, analytics and practical skills.',
  'Agricultural Science': 'Explore AI concepts and build intelligent systems for the future.',
};

export default function ModulesSection() {
  const subjects = mockModules;

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

          {/* Subject Cards Grid - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className="group bg-white border border-[#C1C6D7] rounded-xl p-8 flex flex-col justify-between hover:shadow-xl hover:border-[#0183CB] hover:-translate-y-1 transition-all duration-300"
              >
                {/* Subject-related Emoji */}
                <div className="mb-6">
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#0183CB]/8 group-hover:bg-[#0183CB]/15 transition-colors">
                    <span className="text-[30px] leading-none" role="img" aria-label={subject.name}>
                      {subjectEmojis[subject.name] || '📚'}
                    </span>
                  </div>
                </div>

                {/* Title - Proper Capitalization */}
                <h3 className="text-[24px] font-bold text-[#1B1C1C] leading-8 font-['Montserrat'] mb-2 group-hover:text-[#0183CB] transition-colors">
                  {subjectDisplayNames[subject.name] || subject.name}
                </h3>

                {/* Description */}
                <p className="text-base text-[#414754] leading-[26px] font-['Inter'] mb-6">
                  {subjectDescriptions[subject.name] || subject.description}
                </p>

                {/* Divider + Meta */}
                <div className="border-t border-[#EFEDED] pt-4 mb-6">
                  <div className="flex items-center gap-5 flex-wrap">
                    {/* Duration - displayed as "2 Years" */}
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-[15px] h-[15px] text-[#0183CB]" />
                      <span className="text-sm text-[#414754] font-['Inter']">2 Years</span>
                    </div>
                    {/* Modules / Units */}
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-[15px] h-[15px] text-[#0183CB]" />
                      <span className="text-sm text-[#414754] font-['Inter']">12 Modules</span>
                    </div>
                    {/* Terms */}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-[13.5px] h-[15px] text-[#0183CB]" />
                      <span className="text-sm text-[#414754] font-['Inter']">Term: 6</span>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="#"
                  className="w-full flex items-center justify-center gap-2 bg-[#0183CB] text-white font-bold text-base py-3 rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] hover:bg-[#016ba5] transition-colors font-['Inter']"
                >
                  Visit Teacher
                  <ArrowRight className="w-[19px] h-[9px]" strokeWidth={3} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
