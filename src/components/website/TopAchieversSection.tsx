'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';


const TOTAL_RESULTS = 6;
const RESULT_EXT = 'jpeg';

const resultImages = Array.from({ length: TOTAL_RESULTS }, (_, i) => ({
  index: i + 1,
  src: `/result/img${i + 1}.${RESULT_EXT}`,
}))
  // order by the number in the name (img1 first, then img2, ...)
  .sort((a, b) => a.index - b.index);

const INITIAL_VISIBLE = 3;

export default function TopAchieversSection() {
  const [showAll, setShowAll] = useState(false);

  const visibleImages = showAll
    ? resultImages
    : resultImages.slice(0, INITIAL_VISIBLE);

  const hasMore = resultImages.length > INITIAL_VISIBLE;

  return (
    <section className="bg-white py-10 sm:py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-14">
          <span className="text-[#34BFF3] font-semibold text-[11px] sm:text-[12px] uppercase tracking-[0.12em]">
            RECOGNIZING EXCELLENCE
          </span>
          <h2 className="text-[24px] sm:text-[30px] lg:text-[36px] font-bold text-[#0a0a0f] mt-2">
            Our Top Achievers
          </h2>
          <div className="w-12 h-[3px] bg-[#34BFF3] rounded-full mx-auto mt-4" />
        </div>

        {/* Result cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {visibleImages.map((img) => (
            <div
              key={img.src}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              <img
                src={img.src}
                alt={`Techna A/L top achiever result ${img.index}`}
                loading="lazy"
                className="w-full h-auto object-contain transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>

        {/* Show more / less */}
        {hasMore && (
          <div className="flex justify-center mt-8 sm:mt-10">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#34BFF3] text-[#34BFF3] font-semibold text-[13px] sm:text-[14px] hover:bg-[#34BFF3] hover:text-white transition-colors duration-200"
            >
              {showAll ? 'Show Less' : 'Show More'}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  showAll ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
