'use client';
import { Star } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    name: 'Ananya R.',
    role: 'B.Tech Student',
    text: '"The faculty is supportive and the environment is perfect for learning and personal growth."',
    rating: 5,
    avatar: '/avatars/ananya.jpg',
  },
  {
    name: 'Karthik M.',
    role: 'MBA Student',
    text: '"A great place to build your career with excellent resources and opportunities."',
    rating: 5,
    avatar: '/avatars/karthik.jpg',
  },
  {
    name: 'Priya S.',
    role: 'B.Sc Student',
    text: '"The campus life is amazing and it helped me develop skills beyond academics."',
    rating: 5,
    avatar: '/avatars/priya.jpg',
  },
  {
    name: 'Rahul T.',
    role: 'M.Tech Student',
    text: '"World-class infrastructure and highly supportive teaching staff made my journey memorable."',
    rating: 5,
    avatar: '/avatars/rahul.jpg',
  },
  {
    name: 'Sneha K.',
    role: 'B.Sc Student',
    text: '"The practical exposure and industry connections helped me land my dream internship."',
    rating: 5,
    avatar: '/avatars/sneha.jpg',
  },
  {
    name: 'Arjun P.',
    role: 'MBA Student',
    text: '"Excellent faculty, modern facilities and a truly vibrant campus community."',
    rating: 5,
    avatar: '/avatars/arjun.jpg',
  },
];

// iPhone SE: 1 per page | iPad Air: 2 per page | Desktop: 3 per page
function getItemsPerPage() {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth < 640) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

export default function TestimonialsSection() {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Update items per page on resize
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { useEffect } = require('react');
    useEffect(() => {
      const update = () => {
        const newItems = getItemsPerPage();
        setItemsPerPage(newItems);
        setPage(0);
      };
      update();
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }, []);
  }

  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const visible = testimonials.slice(page * itemsPerPage, page * itemsPerPage + itemsPerPage);

  return (
    <section className="py-10 sm:py-14 lg:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <span className="text-[#34BFF3] font-semibold text-[11px] sm:text-[12px] uppercase tracking-[0.12em]">
            WHAT OUR STUDENTS SAY
          </span>
          <h2 className="text-[24px] sm:text-[30px] lg:text-[36px] font-bold text-[#0a0a0f] mt-2">
            Student Testimonials
          </h2>
        </div>

        {/* Cards */}
        {/* iPhone SE: 1 col | iPad Air: 2 cols | Desktop: 3 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {visible.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-[#e5e7eb] rounded-2xl p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 sm:gap-4"
            >
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-[15px] h-[15px] sm:w-[16px] sm:h-[16px] lg:w-[18px] lg:h-[18px] fill-[#FBBF24] text-[#FBBF24]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#374151] text-[13px] sm:text-[13.5px] lg:text-[14px] leading-relaxed flex-1">
                {t.text}
              </p>

              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mt-1 sm:mt-2">
                <div className="w-[38px] h-[38px] sm:w-[40px] sm:h-[40px] lg:w-[44px] lg:h-[44px] rounded-full bg-[#e5e7eb] overflow-hidden shrink-0">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=34BFF3&color=fff`;
                    }}
                  />
                </div>
                <div>
                  <p className="text-[#0a0a0f] font-bold text-[13px] sm:text-[14px]">{t.name}</p>
                  <p className="text-[#6b7280] text-[11px] sm:text-[12px]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8 sm:mt-10">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`rounded-full transition-all duration-200 ${
                i === page
                  ? 'w-3 h-3 bg-[#34BFF3]'
                  : 'w-2.5 h-2.5 bg-[#d1d5db]'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}