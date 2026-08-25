'use client';
import { Quote, Star } from 'lucide-react';
import { useState } from 'react';
import { MdOutlineArrowBack } from 'react-icons/md';

const testimonials = [
  {
    name: 'Selvan Vinusikan',
    achievement: 'District Rank - 1 (2A B)',
    course: 'ENGINEERING TECHNOLOGY – A/L 2025 BATCH',
    rating: 5,
    quote:
      'Techna Technical Institute gave me the guidance, confidence, and support I needed throughout my G.C.E. Advanced Level Engineering Technology journey. The dedicated lecturers, regular examinations, practical sessions, and well-structured learning environment helped me achieve 2A, 1B and secure the District 1st Rank in 2025. I am truly grateful to the entire Techna team and highly recommend Techna Technical Institute to every A/L Technology student.',
    avatarSrc: '/avatars/selvan-vinusikan.jpg',
  },
  {
    name: 'Calistus Antony Anpuchelvan',
    achievement: 'District Rank - 3 (2A B)',
    course: 'ENGINEERING TECHNOLOGY – A/L 2025 BATCH',
    rating: 5,
    quote:
      'Techna Technical Institute provided me with the guidance, confidence, and support I needed throughout my A/L Engineering Technology journey. The dedicated lecturers, regular examinations, and structured learning environment helped me achieve District Rank 3 and Island Rank 106 in the G.C.E. Advanced Level Examination – 2025. I sincerely thank the entire Techna team and highly recommend Techna to every A/L Technology student.',
    avatarSrc: '/avatars/calistus-anpuchelvan.jpg',
  },
  {
    name: 'Thanuja Vijayakumar',
    achievement: 'District Rank - 7 (A B C)',
    course: 'ENGINEERING TECHNOLOGY – A/L 2025 BATCH',
    rating: 5,
    quote:
      'Techna Technical Institute gave me the guidance, confidence, and support I needed throughout my G.C.E. Advanced Level Technology journey. The dedicated lecturers, structured learning environment, and continuous encouragement helped me achieve District Rank 7 in the G.C.E. Advanced Level Technology Stream Examination – 2025. I sincerely thank the entire Techna team and highly recommend Techna Technical Institute to every A/L Technology student.',
    avatarSrc: '/avatars/thanuja-vijayakumar.jpg',
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((i) => (i === 0 ? testimonials.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === testimonials.length - 1 ? 0 : i + 1));

  const t = testimonials[current];

  return (
    <section className="bg-[#0183CB]/5 py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-[#0183CB] font-bold text-[13px] sm:text-sm tracking-[1.4px] uppercase mb-3">
            WHAT OUR STUDENTS SAY
          </p>
          <h2 className="text-[28px] sm:text-4xl font-extrabold text-[#111827]">
            Student Testimonials
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center">

          {/* Left Arrow */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="hidden sm:flex absolute left-0 z-10 items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <MdOutlineArrowBack className="w-[34px] h-[34px] text-[#0183CB]" />
          </button>

          {/* Card */}
          <div className="max-w-[864px] w-full sm:mx-16 text-center">

            {/* Quotation mark */}
            <div className="flex justify-center mb-4">
              <Quote className="w-11 h-8 fill-[#0EA5E9] text-[#0EA5E9] opacity-10" />
            </div>

            {/* Full quote — no truncation */}
            <p className="text-[rgba(55,65,81,0.5)] italic text-lg sm:text-xl leading-7 sm:leading-8 mb-8 max-w-[747px] mx-auto">
              &quot;{t.quote}&quot;
            </p>

            {/* Avatar + Stars/Rating */}
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] overflow-hidden">
                <img
                  src={t.avatarSrc}
                  alt={t.name}
                  className="w-full h-full object-cover object-top rounded-full"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const parent = target.parentElement;
                    if (parent) {
                      target.style.display = 'none';
                      parent.classList.add('bg-[#0183CB]', 'flex', 'items-center', 'justify-center');
                      parent.innerHTML = `<span class="text-white font-bold text-xl">${t.name.charAt(0)}</span>`;
                    }
                  }}
                />
              </div>

              <div className="flex flex-col items-start">
                <span className="text-[#6B7280] text-sm leading-[32px]">{t.rating}.0 / 5.0</span>
                <div className="flex items-center gap-0">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#FACC15] text-[#FACC15]" />
                  ))}
                </div>
              </div>
            </div>

            {/* Name */}
            <h3 className="font-bold text-xl text-[#111827] mb-2">{t.name}</h3>

            {/* Achievement badge */}
            <div className="inline-flex items-center px-[17px] py-[5px] rounded-full bg-[#F0F9FF] border border-[#DBEAFE] mb-2">
              <span className="font-bold text-sm text-[#0EA5E9]">{t.achievement}</span>
            </div>

            {/* Course */}
            <p className="text-[#6B7280] text-xs tracking-[0.6px] uppercase">{t.course}</p>
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="hidden sm:flex absolute right-0 z-10 items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          >
            <MdOutlineArrowBack className="w-[34px] h-[34px] text-[#0183CB] scale-x-[-1]" />
          </button>
        </div>

        {/* Mobile arrows (below card, since fixed side positions don't fit small screens) */}
        <div className="flex sm:hidden items-center justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center"
          >
            <MdOutlineArrowBack className="w-6 h-6 text-[#0183CB]" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center"
          >
            <MdOutlineArrowBack className="w-6 h-6 text-[#0183CB] scale-x-[-1]" />
          </button>
        </div>

      </div>
    </section>
  );
}