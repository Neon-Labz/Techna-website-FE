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
    <section className="relative h-[680px] flex flex-col justify-center overflow-hidden bg-[#0a0a0f]">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />
      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(rgba(244,241,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(244,241,235,0.03)_1px,transparent_1px)] [background-size:64px_44px]" />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] opacity-70 [background:linear-gradient(90deg,transparent,#e8b84b,transparent)]" />

      {/* Glow blobs */}
      <div className="absolute rounded-full pointer-events-none -left-[8%] top-[5%] w-[420px] h-[420px] bg-[rgba(232,184,75,0.07)] blur-[90px]" />
      <div className="absolute rounded-full pointer-events-none right-[18%] bottom-[8%] w-[280px] h-[280px] bg-[rgba(42,93,224,0.07)] blur-[90px]" />

      {/* Background word */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -right-[2%] select-none pointer-events-none leading-none whitespace-nowrap text-transparent"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(180px,28vw,380px)",
          WebkitTextStroke: "1px rgba(232,184,75,0.07)",
        }}
      >
        TECHNA
      </div>

      {/* Corner marks */}
      <div className="absolute top-5 right-5 w-9 h-9 border-t-[1.5px] border-r-[1.5px] border-[rgba(232,184,75,0.4)] opacity-50" />
      <div className="absolute bottom-5 left-5 w-9 h-9 border-b-[1.5px] border-l-[1.5px] border-[rgba(232,184,75,0.4)] opacity-50" />

      {/* Content */}
      <div
        className="relative z-10 max-w-[1100px] px-15 pt-20 pb-24"
        style={{ padding: "48px 60px 56px" }}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 border border-[rgba(232,184,75,0.35)] bg-[rgba(232,184,75,0.1)] text-[#e8b84b] text-[11px] font-semibold tracking-[0.12em] uppercase px-[14px] py-[6px] mb-9"
          style={{
            clipPath:
              "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#e8b84b] animate-pulse" />
          A/L Technology Stream — Batch 2024
        </div>

        {/* Headline */}
        <h1
          className="leading-[0.9] tracking-[-0.01em] text-[#f4f1eb] mb-1"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(52px,8vw,80px)",
          }}
        >
          Shape
          <br />
          <span
            className="text-transparent"
            style={{ WebkitTextStroke: "2px #f4f1eb" }}
          >
            Your
          </span>
          <br />
          <span className="text-[#e8b84b] block">Future.</span>
        </h1>

        {/* Divider */}
        <div className="flex items-center gap-[18px] mt-4 mb-4">
          <div className="w-[100px] h-px shrink-0 [background:linear-gradient(90deg,#e8b84b,transparent)]" />
          <span className="text-[12px] tracking-[0.1em] uppercase text-[rgba(244,241,235,0.42)] font-medium">
            <strong className="text-[#e8b84b] font-semibold">
              Smart Thinking
            </strong>{" "}
            Leads to Innovate
          </span>
        </div>

        {/* Description */}
        <p className="max-w-[460px] text-[14px] leading-[1.6] text-[rgba(244,241,235,0.52)] font-light mb-6">
          Techna Technical Institute delivers world-class A/L Technology Stream
          education. Join{" "}
          <strong className="text-[#f4f1eb] font-medium">
            2,400+ students
          </strong>{" "}
          who trust us to unlock their potential and build the technology of
          tomorrow.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3.5 items-center mb-8">
          <button
            onClick={() => router.push("/register")}
            className="inline-flex items-center gap-2.5 bg-[#e8b84b] hover:bg-[#f0c85e] text-[#0a0a0f] text-[12px] font-bold tracking-[0.1em] uppercase px-9 py-4 border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
            style={{
              clipPath:
                "polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))",
            }}
          >
            Apply Now <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push("/modules")}
            className="inline-flex items-center gap-2.5 bg-transparent text-[#f4f1eb] text-[12px] font-semibold tracking-[0.1em] uppercase px-7 py-4 border border-[rgba(244,241,235,0.18)] hover:border-[rgba(244,241,235,0.45)] hover:bg-[rgba(244,241,235,0.04)] cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
          >
            Explore Modules <BookOpen className="w-4 h-4 opacity-65" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-px max-w-[660px] bg-[rgba(244,241,235,0.07)] border border-[rgba(244,241,235,0.07)]">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="bg-[#0a0a0f] p-[14px_14px] hover:bg-[rgba(232,184,75,0.05)] transition-colors"
            >
              <Icon className="w-[17px] h-[17px] text-[#e8b84b] mb-2.5 opacity-85" />
              <p
                className="text-[#f4f1eb] leading-none mb-1.5"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24 }}
              >
                {value}
              </p>
              <p className="text-[10px] tracking-[0.08em] uppercase text-[rgba(244,241,235,0.32)] font-medium">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      {/* <div className="absolute bottom-8 left-[60px] flex items-center gap-3 text-[rgba(244,241,235,0.28)] text-[10px] tracking-[0.14em] uppercase z-10">
        <div className="w-[30px] h-px bg-[rgba(244,241,235,0.12)] relative overflow-hidden">
          <div className="absolute inset-y-0 w-full bg-[#e8b84b] animate-[slide_2s_ease-in-out_infinite]" />
        </div>
        Scroll to explore
      </div> */}

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
