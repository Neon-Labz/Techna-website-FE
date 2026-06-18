"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Users, Award, Star } from "lucide-react";

const stats = [
  { icon: Users, value: "2,400+", label: "Students Enrolled" },
  { icon: BookOpen, value: "7", label: "Core Subjects" },
  { icon: Award, value: "98%", label: "Pass Rate" },
  { icon: Star, value: "15+", label: "Years of Excellence" },
];

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative h-[620px] flex flex-col justify-center overflow-hidden bg-[#0a0a0f] pt-14">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />
      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(rgba(244,241,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(244,241,235,0.03)_1px,transparent_1px)] [background-size:64px_44px]" />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] opacity-70 [background:linear-gradient(90deg,transparent,#D9D9D9,transparent)]" />

      {/* Glow blobs */}
      <div className="absolute rounded-full pointer-events-none -left-[8%] top-[5%] w-[420px] h-[420px] bg-[rgba(232,184,75,0.07)] blur-[90px]" />
      <div className="absolute rounded-full pointer-events-none right-[18%] bottom-[8%] w-[280px] h-[280px] bg-[rgba(42,93,224,0.07)] blur-[90px]" />

      {/* Background word */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -right-[2%] select-none pointer-events-none leading-none whitespace-nowrap text-transparent"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(180px,28vw,320px)",
          WebkitTextStroke: "1px rgba(232,184,75,0.07)",
        }}
      >
        TECHNA
      </div>

      {/* Corner marks */}
      <div className="absolute top-5 right-5 w-9 h-9 border-t-[1.5px] border-r-[1.5px] border-[rgba(232,184,75,0.4)] opacity-50" />
      <div className="absolute bottom-5 left-5 w-9 h-9 border-b-[1.5px] border-l-[1.5px] border-[rgba(232,184,75,0.4)] opacity-50" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[48px] pb-[56px]">
        {/* Headline */}
        <h1
          className="leading-[0.88] tracking-[-0.01em] mb-4"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(72px,10vw,110px)",
          }}
        >
          <span className="text-[#34BFF3]">Shape</span>
          <br />
          <span className="text-transparent" style={{ WebkitTextStroke: "2px #34BFF3" }}>
            Your
          </span>
          <br />
          <span className="text-[#34BFF3]">Future</span>
        </h1>

        {/* Description */}
        <p className="max-w-[460px] text-[17px] leading-[28px] text-white font-medium mb-6">
          Empowering minds. Shaping leaders.<br />
          Join a community that inspires<br />
          innovation and excellence.
        </p>

        {/* CTA */}
        <button
          onClick={() => router.push("/register")}
          className="inline-flex items-center gap-2.5 text-white text-[13px] font-bold tracking-[0.05em] uppercase rounded-xl border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
          style={{
            background: "linear-gradient(90deg, #1a9fd4 0%, #34BFF3 50%, #6dd5f7 100%)",
            width: "205px",
            height: "48px",
            paddingLeft: "32px",
            paddingRight: "32px",
          }}
        >
          Discover More <ArrowRight className="w-4 h-4" />
        </button>

        {/* Stats */}
        <div className="w-full max-w-[850px] h-[50px] bg-white border border-[#F9FAFB] rounded-[11px] flex items-center px-6 mt-6">
          {stats.map(({ icon: Icon, value, label }, index) => (
            <div key={label} className="flex items-center flex-1">
              {index !== 0 && (
                <div className="w-px h-8 border-l border-dashed border-[#34BFF3] mr-6 ml-6" />
              )}
              <div className="flex items-center gap-3">
                <Icon className="w-[26px] h-[26px] text-[#34BFF3] shrink-0" />
                <div>
                  <p className="text-[#0a0a0f] leading-none mb-0.5 text-[19px] font-bold">
                    {value}
                  </p>
                  <p className="text-[10px] tracking-[0.08em] uppercase text-[#6b7280] font-medium">
                    {label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side accent */}
      <div className="absolute right-12 bottom-14 flex flex-col items-center gap-2 z-10">
        <span
          className="text-[10px] tracking-[0.15em] uppercase text-[rgba(244,241,235,0.2)]"
          style={{ writingMode: "vertical-rl" }}
        >
          Techna Institute · 2024
        </span>
        <div className="w-px h-14 [background:linear-gradient(180deg,transparent,rgba(232,184,75,0.45))]" />
      </div>
    </section>
  );
}