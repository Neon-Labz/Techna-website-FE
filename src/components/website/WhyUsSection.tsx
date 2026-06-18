import {
  GraduationCap,
  User,
  FlaskConical,
  Briefcase,
  Globe,
  Users,
} from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    title: 'Quality Education',
    desc: 'Industry-focused curriculum designed for real-world success.',
  },
  {
    icon: User,
    title: 'Expert Faculty',
    desc: 'Learn from experienced educators and industry professionals.',
  },
  {
    icon: FlaskConical,
    title: 'Modern Facilities',
    desc: 'State-of-the-art labs, libraries and smart classrooms.',
  },
  {
    icon: Briefcase,
    title: 'Career Support',
    desc: 'Placement assistance and career guidance for a bright future.',
  },
  {
    icon: Globe,
    title: 'Global Exposure',
    desc: 'International tie-ups and exchange opportunities.',
  },
  {
    icon: Users,
    title: 'Vibrant Campus',
    desc: 'Engage in clubs, events and activities beyond academics.',
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-20 bg-[#EEF6FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[#34BFF3] font-semibold text-[12px] uppercase tracking-[0.12em]">
            WHY CHOOSE US
          </span>
          <h2 className="text-[36px] font-bold text-[#0a0a0f] mt-2">
            Excellence in Every Aspect
          </h2>
          <div className="w-12 h-[3px] bg-[#34BFF3] rounded-full mx-auto mt-4" />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon Circle */}
                <div className="w-[80px] h-[80px] rounded-full bg-white shadow-sm flex items-center justify-center mb-5 group-hover:shadow-md transition-shadow duration-200">
                  <Icon className="w-[30px] h-[30px] text-[#1a6fa8]" />
                </div>

                {/* Title */}
                <h3 className="text-[#0a0a0f] font-bold text-[14px] mb-2">
                  {f.title}
                </h3>

                {/* Description */}
                <p className="text-[#6b7280] text-[12px] leading-relaxed">
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