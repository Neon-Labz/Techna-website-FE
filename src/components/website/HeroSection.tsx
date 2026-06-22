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
    <section className="relative w-full h-[640px] flex items-center overflow-hidden bg-[#0a0a0f]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          opacity: 0.32,
        }}
      />

      {/* Dark overlay gradient - left side darker for text readability */}
      <div className="absolute inset-0 [background:linear-gradient(90deg,rgba(10,10,15,0.75)_0%,rgba(10,10,15,0.35)_55%,rgba(10,10,15,0.1)_100%)]" />

      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(rgba(244,241,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(244,241,235,0.03)_1px,transparent_1px)] [background-size:64px_44px]" />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] [background:linear-gradient(90deg,transparent,rgba(217,217,217,0.7),transparent)]" />

      {/* Glow blobs */}
      <div className="absolute rounded-full pointer-events-none -left-[6%] top-[8%] w-[380px] h-[380px] bg-[rgba(232,184,75,0.06)] blur-[100px]" />
      <div className="absolute rounded-full pointer-events-none right-[20%] bottom-[10%] w-[240px] h-[240px] bg-[rgba(42,93,224,0.06)] blur-[90px]" />

      {/* Background word */}
      <div
        className="absolute top-1/2 -translate-y-1/2 right-[-1%] select-none pointer-events-none leading-none whitespace-nowrap"
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

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col max-w-[520px] -ml-16">

          {/* Headline */}
          <h1
            className="mb-5 leading-[0.92]"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(58px, 6.8vw, 84px)",
              letterSpacing: "-0.01em",
            }}
          >
            <span className="block text-[#34BFF3]">Build</span>
            <span
              className="block"
              style={{
                color: "transparent",
                WebkitTextStroke: "2px #34BFF3",
              }}
            >
              Your
            </span>
            <span className="block text-[#34BFF3]">Dreams with</span>
            <span className="block text-[#34BFF3]">Technology</span>
          </h1>

          {/* Description */}
          <p
            className="text-white font-medium mb-7 leading-relaxed"
            style={{ fontSize: "14.5px", maxWidth: "360px" }}
          >
            Empowering minds. Shaping leaders.
            <br />
            Join a community that inspires
            <br />
            innovation and excellence.
          </p>

          {/* CTA Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push("/register")}
              className="inline-flex items-center gap-2 text-white font-bold uppercase tracking-[0.07em] rounded-xl border-none cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:brightness-110 active:scale-[0.98]"
              style={{
                background: "linear-gradient(90deg,#1a9fd4 0%,#34BFF3 50%,#6dd5f7 100%)",
                fontSize: "11.5px",
                height: "42px",
                paddingLeft: "26px",
                paddingRight: "26px",
              }}
            >
              Discover More <ArrowRight className="w-[13px] h-[13px]" />
            </button>
          </div>

          {/* Stats Bar */}
          <div
            className="inline-flex items-center bg-white rounded-[12px] h-[72px] px-20 gap-0"
            style={{
              border: "1px solid #EFEFEF",
              width: "fit-content",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            {stats.map(({ icon: Icon, value, label }, index) => (
              <div key={label} className="flex items-center">
                {index !== 0 && (
                  <div className="mx-10 h-9 w-px border-l border-dashed border-[#34BFF3]" />
                )}
                <div className="flex items-center gap-3">
                  <Icon
                    className="text-[#34BFF3] shrink-0"
                    style={{ width: "26px", height: "26px" }}
                  />
                  <div className="flex flex-col leading-none">
                    <span
                      className="text-[#0a0a0f] font-bold"
                      style={{ fontSize: "19px", lineHeight: "1.2" }}
                    >
                      {value}
                    </span>
                    <span
                      className="uppercase text-[#6b7280] font-medium tracking-[0.07em]"
                      style={{ fontSize: "9.5px", marginTop: "3px" }}
                    >
                      {label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Side accent */}
      <div className="absolute right-10 bottom-10 flex flex-col items-center gap-2 z-10">
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