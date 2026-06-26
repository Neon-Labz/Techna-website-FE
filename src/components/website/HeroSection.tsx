"use client";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, BookOpen, Users, Star } from "lucide-react";

const stats = [
  { icon: Building2, value: "6+", label: "Years of Excellence" },
  { icon: BookOpen, value: "9", label: "Core Subjects" },
  { icon: Users, value: "1,500+", label: "Students Enrolled" },
  { icon: Star, value: "98%", label: "Pass Rate" },
];

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative w-full flex items-center overflow-hidden bg-[#0a0a0f] h-[520px] sm:h-[580px] lg:h-[640px]">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.jpg')", opacity: 0.32 }}
      />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 [background:linear-gradient(90deg,rgba(10,10,15,0.88)_0%,rgba(10,10,15,0.5)_55%,rgba(10,10,15,0.1)_100%)]" />

      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(rgba(244,241,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(244,241,235,0.03)_1px,transparent_1px)] [background-size:64px_44px]" />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] [background:linear-gradient(90deg,transparent,rgba(217,217,217,0.7),transparent)]" />

      {/* Glow blobs */}
      <div className="absolute rounded-full pointer-events-none -left-[6%] top-[8%] w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[380px] lg:h-[380px] bg-[rgba(232,184,75,0.06)] blur-[100px]" />
      <div className="absolute rounded-full pointer-events-none right-[20%] bottom-[10%] w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] lg:w-[240px] lg:h-[240px] bg-[rgba(42,93,224,0.06)] blur-[90px]" />

      {/* Background word — hidden on mobile */}
      <div
        className="hidden sm:block absolute top-1/2 -translate-y-1/2 right-[-1%] select-none pointer-events-none leading-none whitespace-nowrap"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(130px, 20vw, 240px)",
          color: "transparent",
          WebkitTextStroke: "1px rgba(232,184,75,0.055)",
        }}
      >
        TECHNA
      </div>

      {/* Corner marks */}
      <div className="absolute top-4 right-4 w-7 h-7 border-t-[1.5px] border-r-[1.5px] border-[rgba(232,184,75,0.35)] opacity-60" />
      <div className="absolute bottom-4 left-4 w-7 h-7 border-b-[1.5px] border-l-[1.5px] border-[rgba(232,184,75,0.35)] opacity-60" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col max-w-[520px]">

          {/* Headline */}
          <h1
            className="mb-3 sm:mb-4 lg:mb-5 leading-[0.92]"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 8vw, 84px)",
              letterSpacing: "-0.01em",
            }}
          >
            <span className="block text-[#34BFF3]">Build</span>
            <span
              className="block"
              style={{ color: "transparent", WebkitTextStroke: "2px #34BFF3" }}
            >
              Your
            </span>
            <span className="block text-[#34BFF3]">Dreams with</span>
            <span className="block text-[#34BFF3]">Technology</span>
          </h1>

          {/* Description */}
          <p
            className="text-white font-medium mb-5 sm:mb-6 lg:mb-7 leading-relaxed text-[12.5px] sm:text-[13.5px] lg:text-[14.5px]"
            style={{ maxWidth: "360px" }}
          >
            Empowering minds. Shaping leaders.
            <br />
            Join a community that inspires
            <br />
            innovation and excellence.
          </p>

          {/* CTA Button */}
          <div className="mb-5 sm:mb-6">
            <button
              onClick={() => router.push("/register")}
              className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-[0.07em] rounded-xl border-none cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:brightness-110 active:scale-[0.98]"
              style={{
                background: "linear-gradient(90deg,#1a9fd4 0%,#34BFF3 50%,#6dd5f7 100%)",
                fontSize: "10.5px",
                height: "36px",
                paddingLeft: "18px",
                paddingRight: "18px",
              }}
            >
              Discover More <ArrowRight className="w-[12px] h-[12px]" />
            </button>
          </div>

          {/* Stats Bar */}
          {/* iPhone SE: 2x2 grid | iPad Air + Desktop: single row */}
          <div
            className="bg-white rounded-[12px]"
            style={{
              border: "1px solid #EFEFEF",
              width: "fit-content",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            {/* Mobile (iPhone SE) — 2x2 grid */}
            <div className="grid grid-cols-2 sm:hidden px-3 py-2 gap-y-1">
              {stats.map(({ icon: Icon, value, label }, index) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 py-2 ${
                    index % 2 !== 0
                      ? "pl-3 border-l border-dashed border-[#34BFF3]/40"
                      : ""
                  } ${
                    index >= 2
                      ? "border-t border-dashed border-[#34BFF3]/40 pt-2"
                      : ""
                  }`}
                >
                  <Icon className="text-[#34BFF3] shrink-0 w-[16px] h-[16px]" />
                  <div className="flex flex-col leading-none">
                    <span className="text-[#0a0a0f] font-bold" style={{ fontSize: "13px", lineHeight: "1.2" }}>
                      {value}
                    </span>
                    <span className="uppercase text-[#6b7280] font-medium tracking-[0.07em]" style={{ fontSize: "7px", marginTop: "2px" }}>
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* iPad Air + Desktop — single row */}
            <div className="hidden sm:inline-flex items-center px-4 gap-0" style={{ height: "54px" }}>
              {stats.map(({ icon: Icon, value, label }, index) => (
                <div key={label} className="flex items-center">
                  {index !== 0 && (
                    <div
                      className="mx-3 shrink-0"
                      style={{
                        width: "1px",
                        height: "28px",
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, #34BFF3 0px, #34BFF3 4px, transparent 4px, transparent 8px)",
                      }}
                    />
                  )}
                  <div className="flex items-center gap-2">
                    <Icon className="text-[#34BFF3] shrink-0" style={{ width: "20px", height: "20px" }} />
                    <div className="flex flex-col leading-none">
                      <span className="text-[#0a0a0f] font-bold" style={{ fontSize: "15px", lineHeight: "1.2" }}>
                        {value}
                      </span>
                      <span className="uppercase text-[#6b7280] font-medium tracking-[0.07em]" style={{ fontSize: "8px", marginTop: "2px" }}>
                        {label}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Side accent — hidden on mobile */}
      <div className="hidden sm:flex absolute right-10 bottom-10 flex-col items-center gap-2 z-10">
        <span
          className="uppercase text-[rgba(244,241,235,0.18)] tracking-[0.15em]"
          style={{ fontSize: "8.5px", writingMode: "vertical-rl" }}
        >
          Techna Institute · 2024
        </span>
        <div className="w-px h-11 [background:linear-gradient(180deg,transparent,rgba(232,184,75,0.4))]" />
      </div>
    </section>
  );
}