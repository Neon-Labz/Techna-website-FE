'use client';

import Image from 'next/image';

export default function VisionMissionSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[500px_1fr]">
        <div className="relative aspect-square w-full max-w-[500px] overflow-hidden rounded-2xl shadow-xl">
            <Image
                src="/vision.jpeg"
                alt="Vision and Mission"
                fill
                className="object-cover"
            />
            </div>

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

          <p className="leading-8 text-gray-600">
            At TECHNA, we believe that education is the catalyst for global
            progress. Our framework drives every initiative, ensuring our
            graduates are prepared for the challenges of the fourth industrial
            revolution.
          </p>
        </div>

      </div>
      </div>
    </section>
  );
}