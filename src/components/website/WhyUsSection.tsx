import { Shield, Cpu, Users, BookOpen, Award, Clock } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Experienced Faculty',
    desc: 'Our lecturers hold advanced degrees and bring years of real-world industry experience to the classroom.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Cpu,
    title: 'Modern Labs & Resources',
    desc: 'State-of-the-art computer labs, engineering workshops, and digital libraries for hands-on learning.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Shield,
    title: 'Safe Learning Environment',
    desc: 'We provide a secure, inclusive campus with CCTV monitoring and student welfare programs.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: BookOpen,
    title: 'Comprehensive Curriculum',
    desc: 'Our syllabus aligns with national A/L standards while incorporating modern technological trends.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Users,
    title: 'Small Batch Sizes',
    desc: 'Limited students per batch ensure personalized attention and better learning outcomes for every student.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Clock,
    title: 'Flexible Scheduling',
    desc: 'Morning, afternoon, and weekend batches available to accommodate students from all areas.',
    color: 'bg-teal-50 text-teal-600',
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-950 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
          <h2 className="text-4xl font-bold text-white mt-2">Excellence in Every Aspect</h2>
          <p className="text-blue-300 mt-3 max-w-xl mx-auto">We are committed to providing the best A/L technology education in the region.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group">
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-blue-300 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
