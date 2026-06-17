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
      <div className="absolute top-0 left-0 right-0 h-[3px] opacity-70 [background:linear-gradient(90deg,transparent,#D9D9D9,transparent)]" />

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
        {/* Headline */}
        <h1
  className="leading-[0.88] tracking-[-0.01em] mb-4"
  style={{
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: "clamp(72px,12vw,120px)",
  }}
>
  <span className="text-[#34BFF3]">Shape</span>
  <br />
  <span
    className="text-transparent"
    style={{ WebkitTextStroke: "2px #34BFF3" }}
  >
    Your
  </span>
  <br />
  <span className="text-[#34BFF3]">Future</span>
</h1>

        {/* Description */}
        <p className="max-w-[460px] text-[18px] leading-[28px] text-white font-medium tracking-[0px] mb-6">
          Empowering minds. Shaping leaders.<br />
          Join a community that inspires<br />
          innovation and excellence.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3.5 items-center mb-8">
          <button
  onClick={() => router.push("/register")}
  className="inline-flex items-center gap-2.5 text-white text-[13px] font-bold tracking-[0.05em] uppercase px-8 py-3.5 rounded-xl border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90"
  style={{
    background: "linear-gradient(90deg, #1a9fd4 0%, #34BFF3 50%, #6dd5f7 100%)",
    width: "205px",
    height: "48px",
  }}
>
  Discover More <ArrowRight className="w-4 h-4" />
</button>
        </div>

        {/* Stats */}
        <div className="w-full max-w-[863px] h-[72px] bg-white border border-[#F9FAFB] rounded-[10.62px] flex items-center px-6 mt-6">
          {stats.map(({ icon: Icon, value, label }, index) => (
            <div key={label} className="flex items-center flex-1">
              {/* Dashed divider */}
              {index !== 0 && (
                <div className="w-px h-10 border-l border-dashed border-[#34BFF3] mr-6" />
              )}
              <div className="flex items-center gap-3">
                <Icon className="w-[28px] h-[28px] text-[#34BFF3] shrink-0" />
                <div>
                  <p
                    className="text-[#0a0a0f] leading-none mb-0.5"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 700 }}
                  >
                    {value}
                  </p>
                  <p className="text-[10px] tracking-[0.08em] uppercase text-[#6b7280] font-medium">
                    {label}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div> {/* ← Stats div close */}
      </div> {/* ← Content div close */}

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