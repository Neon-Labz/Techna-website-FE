'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const images = [
  'https://pub-e43a8535a35b41a89a5cbb89981d3df2.r2.dev/home/Exam01.jpeg',
  'https://pub-e43a8535a35b41a89a5cbb89981d3df2.r2.dev/home/Exam02.jpeg',
];

export default function VisionMissionSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[500px_1fr]">
        {/* Left Image */}
        <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-2xl shadow-xl">
            {images.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt="Vision and Mission"
                fill
                className={`object-cover transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            </div>

        {/* Right Content */}
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[4px] text-[#34BFF3]">
            STRATEGIC FRAMEWORK
          </p>

          <h2 className="mb-8 text-[28px] font-bold text-[#1B1C1C]">
            Our Vision and Mission
          </h2>

          <div className="mb-8 border-l-4 border-[#34BFF3] pl-5">
            <h3 className="mb-2 text-sm font-bold uppercase text-[#34BFF3]">
              Vision
            </h3>

            <p className="leading-7 text-gray-600 italic">
              To become the leading technical institution in Sri Lanka
              recognised for providing outstanding education in the Advanced
              Level Technology stream and empowering students to excel and lead
              in their respective fields.
            </p>
          </div>

          <div className="mb-8 border-l-4 border-[#34BFF3] pl-5">
            <h3 className="mb-2 text-sm font-bold uppercase text-[#34BFF3]">
              Mission
            </h3>

            <p className="leading-7 text-gray-600 italic">
              To equip students with practical skills, innovative thinking and
              a strong academic foundation in A/L Technology stream through
              modern teaching methods and strategic partnerships with industry
              and community.
            </p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}