'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Languages } from 'lucide-react';

type Lang = 'ta' | 'en';

const content: Record<
  Lang,
  {
    heroTitle: string;
    heroDesc: string;
    rulesHeading: string;
    rules: { title: string; desc: React.ReactNode; }[];
    termsHeading: string;
    terms: string[];
  }
> = {
  ta: {
    heroTitle: 'விதிமுறைகள் மற்றும் ஒழுங்குவிதிகள்',
    heroDesc:
      'Techna Technical Institute இணையதளத்தை பயன்படுத்துவதற்கு முன் இந்த விதிமுறைகள் மற்றும் ஒழுங்குவிதிகளை கவனமாக வாசிக்கவும்.',
    rulesHeading: 'விதிமுறைகள் மற்றும் ஒழுங்குவிதிகள்',
    rules: [
      {
        title: '1. மாணவர் அடையாள அட்டை',
        desc: 'மாணவர்கள் வகுப்புகளுக்கு வரும்போது தங்களது மாணவர் அடையாள அட்டையை (Student ID Card) கட்டாயமாக கைவசம் வைத்திருக்க வேண்டும்.',
      },
      {
        title: '2. பாடக் கட்டணம்',
        desc: 'மாணவர்கள் நிறுவனத்தினால் அறிவிக்கப்படும் கால எல்லைக்குள் பாடக் கட்டணங்களை செலுத்த வேண்டும். குறிப்பிட்ட காலத்திற்குள் கட்டணம் செலுத்த முடியாத பட்சத்தில், பெற்றோர் அல்லது பாதுகாவலர் மூலம் நிர்வாகத்திற்கு முன்கூட்டியே அறிவிக்க வேண்டும்.',
      },
      {
        title: '3. வரவு',
        desc: 'மாணவர்கள் நடைபெறும் அனைத்து வகுப்புகள், மீளாய்வு வகுப்புகள், மாதாந்தத் தேர்வுகள் மற்றும் மாதிரிப் பரீட்சைகளில் தவறாமல் பங்கேற்க வேண்டும். வருகை தர முடியாத அல்லது தாமதமாக வரக்கூடிய சந்தர்ப்பங்களில், அதற்கான காரணத்தை பெற்றோர் அல்லது பாதுகாவலர் மூலம் நிர்வாகத்திற்கு அறிவிக்க வேண்டும்.',
      },
      {
        title: '4. வருகை மற்றும் அனுமதி நிலை',
        desc: (
          <>
            <p className="mb-4">
              மாணவர்கள் நீண்ட காலத்திற்கு வகுப்புகளுக்கு வருகை தராமல், அது தொடர்பாக
              நிறுவன நிர்வாகத்திற்கு முறையாக அறிவிக்காத பட்சத்தில், அவர்கள் இறுதியாக
              வகுப்பிற்கு வருகை தந்த நாளிலிருந்து{' '}
              <strong>3 மாதங்களுக்குப் பின்னர் அவர்களின் அனுமதி (Admission) இரத்து செய்யப்படும்.</strong>
            </p>

            <p>
              நீண்ட காலத்திற்கு வகுப்புகளுக்கு வருகை தர முடியாத சூழ்நிலை ஏற்பட்டால்,
              மாணவர்கள் முன்கூட்டியே நிறுவன நிர்வாகத்திற்கு அறிவித்து அனுமதி பெற்றிருந்தால்,
              நிறுவனத்தின் விதிமுறைகள் மற்றும் நிபந்தனைகளுக்கு உட்பட்டு அவர்களின் அனுமதி
              தொடர அனுமதிக்கப்படலாம்.
            </p>
          </>
        ),
      },
      {
        title: '5. கைப்பேசி பயன்பாடு',
        desc: 'வகுப்பறை மற்றும் பரீட்சை நடைபெறும் நேரங்களில் கைப்பேசி பயன்படுத்துவது முற்றிலும் தடைசெய்யப்பட்டுள்ளது. அவசர தேவைகளுக்காக மட்டுமே நிர்வாகத்தின் முன் அனுமதியுடன் பயன்படுத்தலாம்.',
      },
      {
        title: '6. மாணவர்களின் வாகனப் பாவனைக் கொள்கை',
        desc: 'சைக்கிளைத் தவிர வேறு எந்த மோட்டார் வாகனத்தையும் மாணவர்கள் தாங்களே ஓட்டி வகுப்புகளுக்கு வர அனுமதிக்கப்படமாட்டார்கள். அவசர சூழ்நிலைகளில் மட்டும், பெற்றோர்/பாதுகாவலர் நிறுவன நிர்வாகத்துடன் தொடர்புகொண்டு முன் அனுமதி பெற்ற பின்னரே மாணவர்கள் மோட்டார் வாகனத்தில் வரலாம். தொடர்ச்சியாக மோட்டார் வாகனத்தை கொண்டு வர வேண்டியிருந்தால், நிறுவன நிர்வாகத்தின் முன் அனுமதியுடனும், நிறுவனத்தின் விதிமுறைகள் மற்றும் நிபந்தனைகளை ஏற்றுக்கொண்ட பின்னரே அனுமதி வழங்கப்படும்.',
      },
      {
        title: '7. உடை மற்றும் தோற்றம்',
        desc: 'மாணவர்கள் கல்வி நிறுவனத்தின் ஒழுக்கத்திற்கு ஏற்ற உடை, சிகை அலங்காரம் மற்றும் அணிகலன்களுடன் வர வேண்டும். சமயம் சார்ந்த அணிகலன்கள் மற்றும் தங்க ஆபரணங்கள் அனுமதிக்கப்படும்.',
      },
      {
        title: '8. நிறுவனச் சொத்துக்களை பாதுகாத்தல்',
        desc: 'வகுப்பறைகள், மேசைகள், கதிரைகள் மற்றும் நிறுவனத்தின் அனைத்து சொத்துக்களையும் சுத்தமாகவும் பாதுகாப்பாகவும் பயன்படுத்த வேண்டும். வேண்டுமென்றே சேதப்படுத்துவது ஒழுக்க நடவடிக்கைக்கு உட்படுத்தப்படும்.',
      },
      {
        title: '9. ஒழுக்கமான நடத்தை',
        desc: 'மாணவர்கள் ஆசிரியர்கள், நிர்வாகத்தினர் மற்றும் சக மாணவர்களிடம் மரியாதையுடனும் ஒழுக்கத்துடனும் நடந்து கொண்டு, சிறந்த கற்றல் சூழலை பேண வேண்டும்.',
      },
      {
        title: '10. பரீட்சை ஒழுங்குவிதிகள்',
        desc: 'வகுப்புத் தேர்வுகள், மாதாந்திரத் தேர்வுகள் மற்றும் மாதிரிப் பரீட்சைகளின் போது முறைகேடுகளில் ஈடுபடுவது முற்றிலும் தடைசெய்யப்பட்டுள்ளது. மற்ற மாணவர்களின் விடைத்தாளைப் பார்த்து எழுதுதல், விடைத்தாளை பரிமாறுதல், மற்றவர்களிடம் கேட்டு எழுதுதல், குறிப்புகள், புத்தகங்கள், கைப்பேசிகள் அல்லது அனுமதியற்ற பொருட்களை பயன்படுத்துதல் ஆகியவை ஒழுக்க நடவடிக்கைக்கு உட்படுத்தப்படும்.',
      },
      {
        title: '11. பெற்றோர் சந்திப்பு',
        desc: 'நிறுவனத்தினால் ஏற்பாடு செய்யப்படும் பெற்றோர் சந்திப்புகள், கலந்துரையாடல்கள் மற்றும் முக்கிய அறிவிப்பு நிகழ்வுகளில் பெற்றோர் அல்லது பாதுகாவலர்கள் கட்டாயமாக பங்கேற்க வேண்டும்.',
      },
      {
        title: '12. பிரச்சினைகளை அறிவித்தல்',
        desc: 'பாடம், நிறுவனம் அல்லது மாணவர்களுக்கிடையில் ஏற்படும் ஏதேனும் பிரச்சினைகள் உடனடியாக நிர்வாகத்திற்கு அறிவிக்கப்பட வேண்டும்.',
      },
      {
        title: '13. தனிப்பட்ட பொருட்கள்',
        desc: 'மாணவர்கள் தங்களது தனிப்பட்ட பொருட்களுக்கு தாங்களே பொறுப்பானவர்கள். பொருட்கள் இழக்கப்படுதல் அல்லது சேதமடைவதற்கு நிறுவனம் பொறுப்பேற்காது.',
      },
      {
        title: '14. பெற்றோர் தொடர்பு',
        desc: 'மாணவர்களின் வருகை, ஒழுக்கம், கல்வி முன்னேற்றம் அல்லது கட்டண விடயங்கள் தொடர்பாக தேவையான சந்தர்ப்பங்களில் பெற்றோர் அல்லது பாதுகாவலர்களுடன் நிறுவனம் தொடர்பு கொள்ளும்.',
      },
      {
        title: '15. நிறுவனத்தின் தீர்மானங்கள்',
        desc: 'கல்வி நடவடிக்கைகள் சிறப்பாக நடைபெற நிறுவன நிர்வாகம் வழங்கும் அறிவுறுத்தல்கள் மற்றும் தீர்மானங்களை அனைத்து மாணவர்களும் கடைப்பிடிக்க வேண்டும்.',
      },
      {
        title: '16. நிறுவனத்தின் நற்பெயர் மற்றும் சமூக ஊடகப் பொறுப்பு',
        desc: 'மாணவர்கள் நிறுவனத்தின் நற்பெயர், ஒழுக்கம் மற்றும் மதிப்புகளை பாதிக்கும் எந்தவொரு செயலிலும், நேரடியாகவோ அல்லது சமூக ஊடகங்கள் மூலமாகவோ ஈடுபடக்கூடாது. நிறுவனத்தைப் பற்றிய தகவல்கள் அல்லது உள்ளடக்கங்களை பகிரும் போது பொறுப்புடனும் மரியாதையுடனும் செயல்பட வேண்டும்.',
      },
    ],
    termsHeading: 'நிபந்தனைகள் (Terms & Conditions)',
    terms: [
      'தேவையான பதிவு மற்றும் கட்டண நடைமுறைகள் பூர்த்தி செய்யப்பட்ட பின்னரே மாணவர் சேர்க்கை உறுதிப்படுத்தப்படும்.',
      'அனைத்து கட்டணங்களும் நிறுவனத்தினால் அறிவிக்கப்படும் கட்டண நடைமுறைகளுக்கு அமைவாக செலுத்தப்பட வேண்டும்.',
      'தேவையெனில் வகுப்பு நேரங்கள், கால அட்டவணைகள், ஆசிரியர்கள், பாடத்திட்டங்கள் அல்லது கல்வி நடவடிக்கைகளில் மாற்றங்களை மேற்கொள்ளும் உரிமை நிறுவனத்திற்கு உண்டு.',
      'மாணவர்கள் கல்விக் காலம் முழுவதும் நிறுவனத்தின் அனைத்து விதிமுறைகளையும் ஒழுங்குவிதிகளையும் கடைப்பிடிக்க வேண்டும்.',
      'மாணவர்கள் கல்வி நடவடிக்கைகள், பரீட்சைகள் மற்றும் நிறுவன நிகழ்வுகளில் நிறுவனத்தின் வழிகாட்டுதல்களை முழுமையாகப் பின்பற்ற வேண்டும்.',
      'கடுமையான ஒழுக்கக்கேடு அல்லது விதிமுறை மீறல்களில் ஈடுபடும் மாணவர்களுக்கு எதிராக எச்சரிக்கை, இடைநீக்கம் அல்லது மாணவர் சேர்க்கை ரத்து உள்ளிட்ட ஒழுக்க நடவடிக்கைகளை மேற்கொள்ளும் உரிமை நிறுவனத்திற்கு உண்டு.',
      'தேவைக்கேற்ப இவ்விதிமுறைகள் மற்றும் நிபந்தனைகளை எந்த நேரத்திலும் மாற்றம் செய்யும் உரிமை நிறுவனத்திற்கு உண்டு. மாற்றங்கள் குறித்து மாணவர்களுக்கும் பெற்றோர் / பாதுகாவலர்களுக்கும் உரிய முறையில் அறிவிக்கப்படும்.',
    ],
  },
  en: {
    heroTitle: 'Rules & Regulations',
    heroDesc:
      'Please read these Rules, Regulations, and Terms & Conditions carefully before using the Techna Technical Institute website or enrolling in our courses.',
    rulesHeading: 'Rules & Regulations',
    rules: [
      {
        title: '1. Student ID Card',
        desc: "Students must carry their Student ID Card whenever they attend classes.",
      },
      {
        title: '2. Course Fee Payment',
        desc: "Students are required to pay course fees within the payment period announced by the institute. If payment cannot be made on time, the administration must be informed in advance through the student's parent or guardian.",
      },
      {
        title: '3. Attendance',
        desc: "Students must attend all scheduled classes, revision sessions, monthly tests, and model examinations. If a student is absent or arrives late, the administration must be informed through the student's parent or guardian with a valid reason.",
      },
      {
        title: '4. Student Attendance & Admission Status',
        desc: (
          <>
            <p className="mb-4">
              Students who discontinue attending classes for a prolonged period without
              informing the institute administration will have their{' '}
              <strong>admission cancelled after three months from their last attended class.</strong>
            </p>

            <p>
              If a student is unable to attend classes for an extended period and has
              informed the institute administration in advance and received approval,
              their admission may remain active subject to the institute's rules and regulations.
            </p>
          </>
        ),
      },
      {
        title: '5. Mobile Phone Policy',
        desc: 'The use of mobile phones during classes and examinations is strictly prohibited. Mobile phones may only be used in emergency situations with prior permission from the administration.',
      },
      {
        title: '6. Student Vehicle Policy',
        desc: 'Students are not permitted to drive or bring any motor vehicle (except bicycles) to the institute. In emergency situations, students may bring a motor vehicle only with prior approval from the institute administration through their parent or guardian. If a student needs to bring a motor vehicle on a regular basis, permission will be granted only with prior approval from the institute administration and upon agreeing to comply with the institute\'s rules and regulations.',
      },
      {
        title: '7. Dress Code & Appearance',
        desc: 'Students must maintain a neat and respectful appearance suitable for an educational environment. Religious attire and modest accessories are permitted.',
      },
      {
        title: '8. Institute Property',
        desc: 'Students must keep classrooms, desks, chairs, and all institute property clean and in good condition. Any intentional damage to institute property may result in disciplinary action.',
      },
      {
        title: '9. Student Conduct',
        desc: 'Students are expected to behave respectfully towards teachers, staff, and fellow students while maintaining a positive learning environment.',
      },
      {
        title: '10. Examination Rules',
        desc: "Cheating or any form of examination misconduct is strictly prohibited during class tests, monthly tests, and model examinations. Looking at another student's answer sheet, exchanging papers, copying answers, bringing notes, books, mobile phones, or any unauthorized materials into an examination is not permitted and may result in disciplinary action.",
      },
      {
        title: '11. Parent Meetings',
        desc: 'Parents or guardians are required to attend parent meetings, discussions, and important announcements organized by the institute.',
      },
      {
        title: '12. Reporting Issues',
        desc: 'Any academic, institute-related, or student-related concerns should be reported to the administration immediately.',
      },
      {
        title: '13. Personal Belongings',
        desc: 'Students are responsible for their personal belongings. The institute is not responsible for any loss or damage to personal items.',
      },
      {
        title: '14. Parent Communication',
        desc: 'The institute may contact parents or guardians regarding attendance, discipline, academic progress, or fee-related matters whenever necessary.',
      },
      {
        title: '15. Institute Policies',
        desc: 'Students must comply with all instructions, policies, and decisions issued by the institute management.',
      },
      {
        title: '16. Institute Reputation & Social Media Responsibility',
        desc: 'Students must not engage in any activity, either in person or through social media, that may harm the reputation, discipline, or values of the institute. Any content related to the institute should be shared responsibly and respectfully.',
      },
    ],
    termsHeading: 'Terms & Conditions',
    terms: [
      'Student admission will be confirmed only after completing the required registration and payment procedures.',
      'All fees must be paid according to the payment procedures announced by the institute.',
      'The institute reserves the right to revise class schedules, timetables, lecturers, syllabi, or academic activities whenever necessary.',
      'Students are required to comply with all institute rules and regulations throughout their period of study.',
      'Students must follow all institute guidelines during academic activities, examinations, and institute events.',
      "The institute reserves the right to issue warnings, suspend, or terminate a student's enrollment in cases of serious misconduct or repeated violations of institute rules.",
      'The institute reserves the right to amend these Rules & Regulations and Terms & Conditions at any time. Students and parents/guardians will be informed of any significant changes.',
    ],
  },
};

export default function TermsAndConditions() {
  const [lang, setLang] = useState<Lang>('ta');
  const t = content[lang];

  return (
    <main className="w-full">
      {/* Hero Banner */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0183CB 0%, #34BFF3 100%)',
        }}
      >
        <div className="pointer-events-none absolute -left-10 -top-10 w-52 h-52 rounded-full border border-white/20" />
        <div className="pointer-events-none absolute right-10 top-8 w-72 h-72 rounded-full border border-white/10" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-sm text-white/90 mb-6">
            <Link href="/" className="flex items-center gap-1 hover:text-white">
              <Home className="w-4 h-4" />
              {lang === 'ta' ? 'முகப்பு' : 'Home'}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="font-semibold text-white">
              {lang === 'ta' ? 'விதிமுறைகள்' : 'Terms and Conditions'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
            {t.heroTitle}
          </h1>

          <p className="max-w-2xl mx-auto text-white/90 text-[15px] leading-relaxed mb-8">
            {t.heroDesc}
          </p>

          {/* Language toggle */}
          <div className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full p-1 border border-white/30">
            <button
              onClick={() => setLang('ta')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                lang === 'ta' ? 'bg-white text-[#0183CB]' : 'text-white'
              }`}
            >
              <Languages className="w-4 h-4" />
              தமிழ்
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                lang === 'en' ? 'bg-white text-[#0183CB]' : 'text-white'
              }`}
            >
              <Languages className="w-4 h-4" />
              English
            </button>
          </div>
        </div>
      </section>

      {/* Rules & Regulations */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl font-bold mb-8 text-center"
            style={{ color: '#0183CB' }}
          >
            {t.rulesHeading}
          </h2>

          <div className="space-y-4">
            {t.rules.map(rule => (
              <div
                key={rule.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="font-bold text-gray-900 mb-2">{rule.title}</h3>
                <div className="text-sm text-gray-600 leading-relaxed">{rule.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl font-bold mb-8 text-center"
            style={{ color: '#0183CB' }}
          >
            {t.termsHeading}
          </h2>

          <ul className="space-y-4">
            {t.terms.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 border border-gray-100"
              >
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: '#0183CB' }}
                >
                  {idx + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}