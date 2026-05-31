import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Anushiya Yoganathan',
    role: 'ICT Student, Batch 2023',
    text: 'Techna gave me the foundation to excel in technology. The ICT module was incredibly practical and the teachers were always supportive.',
    rating: 5,
    avatar: 'AY',
    color: 'from-blue-500 to-blue-700',
  },
  {
    name: 'Kabilesh Sivakumar',
    role: 'Engineering Technology, Batch 2023',
    text: 'The engineering workshops and lab sessions were hands-on and extremely helpful. I scored A+ in my final examination thanks to Techna.',
    rating: 5,
    avatar: 'KS',
    color: 'from-purple-500 to-purple-700',
  },
  {
    name: 'Thivyaa Rajendran',
    role: 'Mathematics, Batch 2022',
    text: 'The mathematics faculty here is exceptional. Complex concepts were explained with clarity and patience. Highly recommend Techna!',
    rating: 5,
    avatar: 'TR',
    color: 'from-emerald-500 to-emerald-700',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-900 font-semibold text-sm uppercase tracking-wider">Student Stories</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">What Our Students Say</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">Hear from our students who have experienced the Techna difference.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col">
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <Quote className="w-8 h-8 text-blue-100 mb-3" />
              <p className="text-gray-600 text-sm leading-relaxed flex-1 italic">"{t.text}"</p>
              
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <div className={`w-11 h-11 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
