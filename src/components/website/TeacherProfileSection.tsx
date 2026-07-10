'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Home,
  ChevronRight,
  Award,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import api from '@/lib/axios';

interface PublicTeacher {
  _id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  subject: string | string[];
  qualification?: string;
  experience?: string;
  degree?: string[];
  specializations?: string[];
  awards?: string[];
  achievements?: string[];
  biography?: string;
  photoUrl?: string;
}

function toTitleCase(str: string): string {
  if (!str) return '';
  return str
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function normalizeSubjects(raw: string | string[] | undefined | null): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

const MONTSERRAT: React.CSSProperties = { fontFamily: 'Montserrat, sans-serif' };

export default function TeacherProfileSection() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = (params?.id ?? '') as string;
  const subjectFromUrl = searchParams?.get('subject') ?? null;

  const [teacher, setTeacher] = useState<PublicTeacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/teachers/${id}`)
      .then(res => setTeacher(res as unknown as PublicTeacher))
      .catch(() => setError('Teacher not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCF8FF] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#0183CB]" />
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-[#FCF8FF] flex flex-col items-center justify-center gap-4">
        <p className="text-[#6B7280]">{error ?? 'Teacher not found'}</p>
        <Link
          href="/modules"
          className="flex items-center gap-1.5 font-semibold text-[#34BFF3] hover:underline text-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Subjects
        </Link>
      </div>
    );
  }

  const teacherName = toTitleCase(teacher.fullName);
  const rawSubjects = normalizeSubjects(teacher.subject);
  const subjects = rawSubjects.map(toTitleCase);

  const breadcrumbSubject = subjectFromUrl
    ? toTitleCase(subjectFromUrl)
    : subjects[0] ?? '';

  // degree[] takes priority; fall back to qualification string
  const degreeEntries: string[] =
    teacher.degree && teacher.degree.length > 0
      ? teacher.degree
      : teacher.qualification
        ? [teacher.qualification]
        : [];

  const hasCredentials = degreeEntries.length > 0 || !!teacher.experience;
  const hasAwards = !!(teacher.awards && teacher.awards.length > 0);
  const hasSpecializations = !!(teacher.specializations && teacher.specializations.length > 0);
  const biography = teacher.biography?.trim() ?? '';

  return (
    <div className="min-h-screen bg-[#FCF8FF]">

      <section
        className="py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(90deg, #0183CB 25%, #34BFF3 95%)' }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-8 left-1/4 w-32 h-32 rounded-full border-4 border-white" />
          <div className="absolute bottom-4 right-1/3 w-48 h-48 rounded-full border-4 border-white" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <nav className="flex items-center justify-center flex-wrap gap-1.5 mb-6"
            style={{ color: '#DAD7FF', fontSize: '11px', fontWeight: 500 }}
          >
            <Home className="w-3 h-3 shrink-0" />
            <Link href="/" className="hover:opacity-80 transition-opacity">Home</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <Link href="/modules" className="hover:opacity-80 transition-opacity">Subjects</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span>Teacher Details</span>
          </nav>

          <h1
            className="font-bold"
            style={{ fontSize: '30px', lineHeight: '38px', letterSpacing: '-0.6px', color: '#DAD7FF' }}
          >
            {breadcrumbSubject || 'Teacher Profile'}
          </h1>

          <p
            className="mt-3 mx-auto text-center"
            style={{ fontSize: '14px', lineHeight: '20px', color: '#DAD7FF', maxWidth: '612px' }}
          >
            {biography
              ? biography.slice(0, 120) + (biography.length > 120 ? '…' : '')
              : `Faculty specialized in ${breadcrumbSubject || subjects[0] || 'their subject'}`}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <Link
          href="/modules"
          className="inline-flex items-center gap-2 font-semibold hover:opacity-80 transition-opacity mb-8"
          style={{ color: '#34BFF3', fontSize: '12px', letterSpacing: '0.6px' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Subjects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <div className="lg:col-span-1 space-y-5">

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-2">
              <div
                className="relative rounded-2xl overflow-hidden bg-[#E4E1EE]"
                style={{ height: '320px' }}
              >
                {teacher.photoUrl ? (
                  <img
                    src={teacher.photoUrl}
                    alt={teacherName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0183CB] to-[#34BFF3]">
                    <span className="text-white text-6xl font-bold">
                      {teacher.fullName?.charAt(0).toUpperCase() ?? '?'}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 w-14 h-14 bg-[#34BFF3] rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="text-white w-8 h-8" />
                </div>
              </div>
            </div>

            {hasCredentials && (
              <div
                className="border border-[#E2E8F0] rounded-xl p-8"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
                  backdropFilter: 'blur(5px)',
                }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <GraduationCap className="w-6 h-6 shrink-0" style={{ color: '#0059BB' }} />
                  <h3
                    className="font-semibold text-[#1B1C1C]"
                    style={{ ...MONTSERRAT, fontSize: '24px', lineHeight: '32px' }}
                  >
                    Academic Qualifications
                  </h3>
                </div>

                <div className="space-y-5">
                  {degreeEntries.map((deg, i) => (
                    <div key={i} className="flex gap-5 items-stretch min-h-[44px]">
                      <div
                        className="shrink-0 rounded-full"
                        style={{ width: '4px', background: '#C1C6D7', borderRadius: '9999px' }}
                      />
                      <div className="flex flex-col justify-center">
                        <p
                          className="font-bold text-[#0183CB]"
                          style={{ fontSize: '16px', lineHeight: '24px' }}
                        >
                          {deg}
                        </p>
                      </div>
                    </div>
                  ))}

                  {teacher.experience && (
                    <div className="flex gap-5 items-stretch min-h-[44px]">
                      <div
                        className="shrink-0 rounded-full"
                        style={{ width: '4px', background: '#C1C6D7', borderRadius: '9999px' }}
                      />
                      <div className="flex flex-col justify-center">
                        <p
                          className="font-bold text-[#0183CB]"
                          style={{ fontSize: '16px', lineHeight: '24px' }}
                        >
                          Years of Experience
                        </p>
                        <p
                          className="text-[#414754] mt-0.5"
                          style={{ fontSize: '14px', lineHeight: '20px' }}
                        >
                          {teacher.experience}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {hasAwards && (
              <div
                className="border border-[#E2E8F0] rounded-xl p-8"
                style={{
                  background: '#F5F3F3',
                  boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-6 h-6 shrink-0" style={{ color: '#9E3D00' }} />
                  <h3
                    className="font-semibold text-[#1B1C1C]"
                    style={{ ...MONTSERRAT, fontSize: '24px', lineHeight: '32px' }}
                  >
                    Awards &amp; Honors
                  </h3>
                </div>

                <div className="space-y-3">
                  {teacher.awards!.map((award, i) => (
                    <div
                      key={i}
                      className="bg-white flex items-start gap-3 rounded-lg p-4"
                      style={{
                        border: '1px solid #C1C6D7',
                        boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                        borderRadius: '8px',
                      }}
                    >
                      <div className="shrink-0 mt-0.5">
                        <Award className="w-5 h-5" style={{ color: '#9E3D00' }} />
                      </div>
                      <p
                        className="font-bold text-[#1B1C1C]"
                        style={{ fontSize: '16px', lineHeight: '24px' }}
                      >
                        {award}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2">
            <div
              className="bg-white rounded-3xl p-8 md:p-10"
              style={{
                border: '1px solid rgba(199, 196, 216, 0.3)',
                boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                borderRadius: '24px',
              }}
            >
              <div
                className="pb-8 mb-8"
                style={{ borderBottom: '1px solid rgba(199, 196, 216, 0.2)' }}
              >
                <span
                  className="inline-block px-3 mb-4"
                  style={{
                    background: 'rgba(52,191,243,0.25)',
                    borderRadius: '9999px',
                    color: '#0183CB',
                    fontSize: '11px',
                    fontWeight: 500,
                    lineHeight: '22px',
                    padding: '4px 12px',
                  }}
                >
                  Faculty Member
                </span>

                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h2
                    className="font-bold text-[#1B1B24]"
                    style={{ fontSize: '30px', lineHeight: '38px', letterSpacing: '-0.6px' }}
                  >
                    {teacherName}
                  </h2>
                  {teacher.experience && (
                    <span
                      className="font-normal"
                      style={{ fontSize: '18px', lineHeight: '22px', color: '#34BFF3' }}
                    >
                      ({teacher.experience} experience)
                    </span>
                  )}
                </div>

                {teacher.qualification && (
                  <p
                    className="mt-1 text-[#464555]"
                    style={{ fontSize: '16px', lineHeight: '24px' }}
                  >
                    {teacher.qualification}
                  </p>
                )}
              </div>

              {(subjects.length > 0 || hasSpecializations) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

                  {subjects.length > 0 && (
                    <div
                      className="bg-white rounded-xl p-6"
                      style={{
                        background: 'rgba(255,255,255,0.95)',
                        borderWidth: '1px 1px 1px 4px',
                        borderStyle: 'solid',
                        borderColor: '#0183CB #E2E8F0 #E2E8F0 #0183CB',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
                      }}
                    >
                      <h3
                        className="font-semibold text-[#1B1C1C] mb-5"
                        style={{ ...MONTSERRAT, fontSize: '24px', lineHeight: '32px' }}
                      >
                        Subjects Teaching
                      </h3>
                      <div className="space-y-1">
                        {subjects.map(s => (
                          <div key={s} className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 shrink-0 text-[#0183CB]" />
                            <p
                              className="text-[#0183CB] font-normal"
                              style={{ fontSize: '18px', lineHeight: '28px' }}
                            >
                              {s}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasSpecializations && (
                    <div
                      className="bg-white rounded-xl p-6"
                      style={{
                        background: 'rgba(255,255,255,0.95)',
                        borderWidth: '1px 1px 1px 4px',
                        borderStyle: 'solid',
                        borderColor: '#34BFF3 #E2E8F0 #E2E8F0 #34BFF3',
                        borderRadius: '12px',
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.05)',
                      }}
                    >
                      <h3
                        className="font-semibold text-[#1B1C1C] mb-5"
                        style={{ ...MONTSERRAT, fontSize: '24px', lineHeight: '32px' }}
                      >
                        Areas of Specialization
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {teacher.specializations!.map((s, i) => (
                          <span
                            key={i}
                            className="font-semibold text-[#0183CB]"
                            style={{
                              background: '#F5F3F3',
                              borderRadius: '9999px',
                              padding: '4px 12px',
                              fontSize: '14px',
                              lineHeight: '16px',
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {biography && (
                <div className="mb-8">
                  <h2
                    className="font-bold text-[#0183CB] mb-5 flex items-center gap-3"
                    style={{ ...MONTSERRAT, fontSize: '32px', lineHeight: '40px' }}
                  >
                    <BookOpen className="w-6 h-6 shrink-0" />
                    Professional Biography
                  </h2>

                  <p
                    className="text-[#414754]"
                    style={{ fontSize: '18px', lineHeight: '29px' }}
                  >
                    {biography}
                  </p>
                </div>
              )}

              <div
                className="flex flex-col sm:flex-row gap-4 pt-6"
                style={{ borderTop: '1px solid rgba(199, 196, 216, 0.2)', fontSize: '14px' }}
              >
                {teacher.email && (
                  <a
                    href={`mailto:${teacher.email}`}
                    className="flex items-center gap-2 text-[#0183CB] hover:underline"
                  >
                    <Mail className="w-4 h-4 shrink-0" />
                    {teacher.email}
                  </a>
                )}
                {teacher.phone && (
                  <span className="flex items-center gap-2 text-[#0183CB]">
                    <Phone className="w-4 h-4 shrink-0" />
                    {teacher.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
