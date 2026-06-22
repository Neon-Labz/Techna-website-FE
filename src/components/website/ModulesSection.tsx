'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Layers } from 'lucide-react';
import { mockModules } from '../../data/mockData';

const subjectDisplayNames: Record<string, string> = {
  'Engineering Technology': 'Engineering Technology',
  'Bio Systems Technology': 'Bio Systems Technology',
  'Science For Technology': 'Science For Technology',
  'Information Communication Technology': 'Computer Applications',
  Mathematics: 'Mathematics',
  Geography: 'Geography',
  'Agricultural Science': 'Agricultural Science',
};

const subjectEmojis: Record<string, string> = {
  'Engineering Technology': '⚙️',
  'Bio Systems Technology': '🧬',
  'Science For Technology': '🔬',
  'Information Communication Technology': '💻',
  Mathematics: '📐',
  Geography: '🌍',
  'Agricultural Science': '🌱',
};

const subjectDescriptions: Record<string, string> = {
  'Engineering Technology':
    'Build a strong foundation in core engineering principles with hands-on learning.',
  'Bio Systems Technology':
    "Develop biodiversity and business skills for tomorrow's global challenges.",
  'Science For Technology':
    'Explore the world through discovery, research and innovation.',
  'Information Communication Technology':
    'Innovate, code and transform ideas into digital solutions.',
  Mathematics:
    'Shape perspectives and create a better understanding of society and the universe.',
  Geography:
    'Drive business growth with knowledge, analytics and practical skills.',
  'Agricultural Science':
    'Explore AI concepts and build intelligent systems for the future.',
};

export default function ModulesSection() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'Core', 'Elective'];
  const subjects =
    filter === 'All'
      ? mockModules
      : mockModules.filter((module) => module.category === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-950 to-blue-900 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
            A/L Technology Stream
          </span>
          <h1 className="mt-2 text-4xl font-bold text-white md:text-5xl">
            Our Subjects
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-blue-300">
            Explore all subjects and courses offered at Techna Technical
            Institute for the A/L Technology Stream.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Filter by:</span>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                filter === category
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-blue-300'
              }`}
            >
              {category}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400">
            {subjects.length} subjects found
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="group flex flex-col justify-between rounded-xl border border-[#C1C6D7] bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-[#0183CB] hover:shadow-xl"
            >
              <div className="mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0183CB]/8 transition-colors group-hover:bg-[#0183CB]/15">
                  <span
                    className="text-[30px] leading-none"
                    role="img"
                    aria-label={subject.name}
                  >
                    {subjectEmojis[subject.name] || '📚'}
                  </span>
                </div>
              </div>

              <h3 className="mb-2 font-['Montserrat'] text-[24px] font-bold leading-8 text-[#1B1C1C] transition-colors group-hover:text-[#0183CB]">
                {subjectDisplayNames[subject.name] || subject.name}
              </h3>

              <p className="mb-6 font-['Inter'] text-base leading-[26px] text-[#414754]">
                {subjectDescriptions[subject.name] || subject.description}
              </p>

              <div className="mb-6 border-t border-[#EFEDED] pt-4">
                <div className="flex flex-wrap items-center gap-5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-[15px] w-[15px] text-[#0183CB]" />
                    <span className="font-['Inter'] text-sm text-[#414754]">
                      2 Years
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-[15px] w-[15px] text-[#0183CB]" />
                    <span className="font-['Inter'] text-sm text-[#414754]">
                      12 Modules
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-[15px] w-[13.5px] text-[#0183CB]" />
                    <span className="font-['Inter'] text-sm text-[#414754]">
                      Term: 6
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="#"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0183CB] py-3 font-['Inter'] text-base font-bold text-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-colors hover:bg-[#016ba5]"
              >
                Visit Teacher
                <ArrowRight className="h-[9px] w-[19px]" strokeWidth={3} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
