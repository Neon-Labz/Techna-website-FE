import {
  GraduationCap,
  ClipboardCheck,
  BookOpen,
  TrendingUp,
  FlaskConical,
  MapPin,
  LifeBuoy,
} from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'Expert Teaching',
    desc: 'Learn from experienced and dedicated lecturers committed to academic excellence.',
  },
  {
    icon: ClipboardCheck,
    title: 'Regular Classes & Examinations',
    desc: 'Structured regular classes, unit examinations, and practice examinations to strengthen learning, monitor progress, and improve examination performance.',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Learning Materials',
    desc: 'Access high-quality notes, revision materials, and study resources for effective learning.',
  },
  {
    icon: TrendingUp,
    title: 'Z-Score Focused Preparation',
    desc: 'Specialized coaching designed to help students achieve a higher Z-Score in the A/L examination.',
  },
  {
    icon: FlaskConical,
    title: 'Practical Learning',
    desc: 'Hands-on practical sessions to strengthen technical knowledge and real-world skills.',
  },
  {
    icon: MapPin,
    title: 'Educational Field Visits',
    desc: 'Industrial and educational field visits to enhance practical exposure and real-world understanding.',
  },
  {
    icon: LifeBuoy,
    title: 'Student Support & Guidance',
    desc: 'Continuous academic guidance, progress monitoring, and personalized support for every student.',
  },
];

export default function WhyChooseTechnaSection() {
  return (
    <section className="py-10 sm:py-14 lg:py-20 bg-[#EEF6FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

       
        <div className="text-center mb-8 sm:mb-10 lg:mb-14">
          <span className="text-[#34BFF3] font-semibold text-[11px] sm:text-[12px] uppercase tracking-[0.12em]">
            WHY CHOOSE TECHNA
          </span>
          <h2 className="text-[24px] sm:text-[30px] lg:text-[36px] font-bold text-[#0a0a0f] mt-2">
            Excellence in A/L Technology Education
          </h2>
          <div className="w-12 h-[3px] bg-[#34BFF3] rounded-full mx-auto mt-4" />
          <p className="text-[#6b7280] text-[13px] sm:text-[14px] lg:text-[15px] leading-relaxed max-w-2xl mx-auto mt-4">
            Empowering students with expert teaching, practical learning, exam-focused
            preparation, and continuous academic support to achieve outstanding success
            in the G.C.E. Advanced Level Technology Stream.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {features.slice(0, 4).map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 sm:p-7 text-center"
              >
                <div className="w-[52px] h-[52px] rounded-full bg-[#EAF6FE] flex items-center justify-center mb-4 mx-auto">
                  <Icon
                    style={{ color: '#34BFF3' }}
                    className="w-[22px] h-[22px]"
                  />
                </div>
                <h3 className="text-[#0a0a0f] font-bold text-[15px] sm:text-[16px] mb-2">
                  {f.title}
                </h3>
                <p className="text-[#6b7280] text-[13px] sm:text-[13px] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mt-4 sm:mt-5 lg:mt-6 lg:max-w-[75%] lg:mx-auto">
          {features.slice(4, 7).map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6 sm:p-7 text-center"
              >
                <div className="w-[52px] h-[52px] rounded-full bg-[#EAF6FE] flex items-center justify-center mb-4 mx-auto">
                  <Icon
                    style={{ color: '#34BFF3' }}
                    className="w-[22px] h-[22px]"
                  />
                </div>
                <h3 className="text-[#0a0a0f] font-bold text-[15px] sm:text-[16px] mb-2">
                  {f.title}
                </h3>
                <p className="text-[#6b7280] text-[13px] sm:text-[13px] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}