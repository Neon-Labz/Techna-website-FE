'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ChevronRight, ChevronLeft, User, MapPin, BookOpen, FileText, Plus, Trash2, Upload, GraduationCap, X } from 'lucide-react';
import { authApi } from '@/api/auth.api';
import { dashboardApi } from '@/api/dashboard.api';
import type { RegisterStudentPayload } from '@/api/auth.api';
import {
  getSubjectCategory,
  countSubjectsByCategory,
  MAIN_SUBJECTS,
  BASKET_SUBJECTS,
  MAX_MAIN_SUBJECTS,
  MAX_BASKET_SUBJECTS,
} from '@/utils/subjectCategory';

const STEPS = [
  { id: 1, label: 'Basic Info', icon: User, desc: 'Personal details' },
  { id: 2, label: 'Address & Contact', icon: MapPin, desc: 'Residence details' },
  { id: 3, label: 'Parent Details', icon: User, desc: 'Guardian info' },
  { id: 4, label: 'O/L Results', icon: BookOpen, desc: 'Academic results (Optional)' },
  { id: 5, label: 'Subjects & Confirm', icon: FileText, desc: 'Subject selection' },
];

export const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Mullaitivu', 'Vavuniya', 'Puttalam', 'Kurunegala', 'Anuradhapura',
  'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle',
  'Ampara', 'Batticaloa', 'Trincomalee',
];

const GRADES = ['A', 'B', 'C', 'S', 'W', 'Absent'];
export const RACE_OPTIONS = ['Sinhala', 'Tamil', 'Indian Tamil', 'Muslim', 'Burgher', 'Malay', 'Other'];
export const RELIGION_OPTIONS = ['Buddhism', 'Hinduism', 'Islam', 'Christianity', 'Catholicism', 'Other'];
interface OLRow { year: string; indexNumber: string; english: string; mathematics: string; science: string; sinhala: string; tamil: string; }
const emptyOL: OLRow = { year: '', indexNumber: '', english: '', mathematics: '', science: '', sinhala: '', tamil: '' };

const SUBJECT_LABELS: Record<string, string> = {
  'Information Communication Technology': 'ICT',
};
const subjectLabel = (name: string) => SUBJECT_LABELS[name] || name;

const MAIN_SUBJECTS_REQUIRED = 2;
const BASKET_SUBJECTS_REQUIRED = 1;

type RegistrationModule = {
  _id?: string;
  name?: string;
  status?: string;
};

const clean = (value: string) => value.trim();

const PHONE_REGEX = /^(?:\+94|0094|0)[0-9]{9}$/;
const NIC_REGEX = /^(?:[0-9]{9}[vVxX]|[0-9]{12})$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const optional = (value: string) => {
  const trimmed = clean(value);
  return trimmed || undefined;
};

const cleanPhone = (value: string) => clean(value).replace(/[\s-]/g, '');

const createInitialForm = () => ({
  fullNameTamil: '', fullNameEnglish: '', dateOfBirth: '',
  nicNo: '', address: '', school: '', whatsappNo: '', parentsNo: '', email: '', password: '', confirmPassword: '',
  permanentAddress: '', administrativeDistrict: '', fixedTelephone: '', residingSince: '',
  race: '', religion: '', citizenByDescent: 'YES',
  contactAddress: '', postalCode: '',
  fatherName: '', motherName: '', guardianName: '',
  contactPerson: 'Mother' as 'Father' | 'Mother' | 'Guardian',
  guardianAddress: '', guardianFixedTel: '', guardianMobile: '',
  olCategory: 'Local O/L', olYear: '', olIndexNumber: '', olNameUsed: '',
  olAccept: 'Accept' as 'Accept' | 'Change',
  batch: '',
  subjects: [] as string[],
  declarationRules: false,
  declarationAccuracy: false,
});

const buildRegisterPayload = (
  form: ReturnType<typeof createInitialForm>,
  olRows: OLRow[]
): RegisterStudentPayload => {
  const olResults = olRows
    .filter((row) => clean(row.year) && clean(row.indexNumber))
    .map((row) => ({
      year: clean(row.year),
      indexNumber: clean(row.indexNumber),
      ...(optional(row.english) ? { english: clean(row.english) } : {}),
      ...(optional(row.mathematics) ? { mathematics: clean(row.mathematics) } : {}),
      ...(optional(row.science) ? { science: clean(row.science) } : {}),
      ...(optional(row.sinhala) ? { sinhala: clean(row.sinhala) } : {}),
      ...(optional(row.tamil) ? { tamil: clean(row.tamil) } : {}),
    }));

  return {
    account: {
      email: clean(form.email).toLowerCase(),
      password: form.password,
    },
    personal: {
      fullNameTamil: optional(form.fullNameTamil),
      fullNameEnglish: clean(form.fullNameEnglish),
      dateOfBirth: clean(form.dateOfBirth),
      nicNo: clean(form.nicNo),
      school: optional(form.school),
      whatsappNo: cleanPhone(form.whatsappNo),
      parentsNo: optional(cleanPhone(form.parentsNo)),
      permanentAddress: clean(form.permanentAddress),
      administrativeDistrict: form.administrativeDistrict,
      fixedTelephone: optional(cleanPhone(form.fixedTelephone)),
      residingSince: optional(form.residingSince),
      race: optional(form.race),
      religion: optional(form.religion),
      citizenByDescent: form.citizenByDescent,
      contactAddress: optional(form.contactAddress),
      postalCode: optional(form.postalCode),
    },
    parent: {
      fatherName: optional(form.fatherName),
      motherName: optional(form.motherName),
      guardianName: optional(form.guardianName),
      contactPerson: form.contactPerson,
      guardianAddress: optional(form.guardianAddress),
      guardianFixedTel: optional(cleanPhone(form.guardianFixedTel)),
      guardianMobile: optional(cleanPhone(form.guardianMobile)),
    },
    olRecords: {
      olCategory: form.olCategory,
      olYear: optional(form.olYear),
      olIndexNumber: optional(form.olIndexNumber),
      olNameUsed: optional(form.olNameUsed),
      olAccept: form.olAccept,
      olResults,
    },
    subjectSelection: {
      subjects: form.subjects,
      agreed: form.declarationRules && form.declarationAccuracy,
    },
    batch: clean(form.batch),
  };
};

type ApiValidationDetail = {
  field?: string;
  property?: string;
  message?: unknown;
  constraints?: Record<string, string>;
  children?: ApiValidationDetail[];
};

const stringifyApiMessage = (message: unknown): string => {
  if (!message) return '';
  if (typeof message === 'string') return message;
  if (Array.isArray(message)) {
    return message.map(stringifyApiMessage).filter(Boolean).join(', ');
  }
  if (typeof message === 'object') {
    const detail = message as ApiValidationDetail;
    const constraintMessage = stringifyApiMessage(
      detail.constraints ? Object.values(detail.constraints) : undefined
    );
    const childMessage = stringifyApiMessage(detail.children);
    const body = constraintMessage || childMessage || stringifyApiMessage(detail.message);
    const field = detail.field || detail.property;

    return field && body ? `${field}: ${body}` : body;
  }

  return String(message);
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const responseData = (error as {
    response?: {
      data?: {
        message?: unknown;
        error?: { details?: ApiValidationDetail[] };
      };
    };
  })?.response?.data;
  const details = responseData?.error?.details;
  const message = responseData?.message;

  if (Array.isArray(details) && details.length > 0) {
    const detailMessage = stringifyApiMessage(details);
    if (detailMessage) return detailMessage;
  }

  const apiMessage = stringifyApiMessage(message);
  if (apiMessage) return apiMessage;
  if (error instanceof Error) return error.message;
  return fallback;
};

export default function RegisterSection() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const [form, setForm] = useState(createInitialForm);

  const [olRows, setOlRows] = useState<OLRow[]>([{ ...emptyOL }]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [subjectsError, setSubjectsError] = useState('');
  const [subjectOptions, setSubjectOptions] = useState<string[]>([]);

  const set = (key: string, value: string | boolean | string[]) => setForm(f => ({ ...f, [key]: value }));

  useEffect(() => {
    let mounted = true;

    const loadModules = async () => {
      setLoadingSubjects(true);
      setSubjectsError('');

      try {
        const modules = (await dashboardApi.getModules()) as RegistrationModule[];
        const names = Array.from(
          new Set(
            modules
              .filter((module) => !module.status || module.status === 'active')
              .map((module) => module.name?.trim())
              .filter((name): name is string => Boolean(name))
          )
        );

        if (mounted && names.length > 0) {
          setSubjectOptions(names);
        }
      } catch (error) {
        console.error('Failed to load modules:', error);
        if (mounted) {
          setSubjectsError('Unable to load subjects');
        }
      } finally {
        if (mounted) {
          setLoadingSubjects(false);
        }
      }
    };

    void loadModules();

    return () => {
      mounted = false;
    };
  }, []);

  const toggleMainSubject = (sub: string) => {
    const mainSelected = form.subjects.filter(s => MAIN_SUBJECTS.includes(s));
    const otherSubjects = form.subjects.filter(s => !MAIN_SUBJECTS.includes(s));

    if (mainSelected.includes(sub)) {
      set('subjects', [...otherSubjects, ...mainSelected.filter(s => s !== sub)]);
    } else {
      if (mainSelected.length >= MAIN_SUBJECTS_REQUIRED) return;
      set('subjects', [...otherSubjects, ...mainSelected, sub]);
    }
  };

  const toggleBasketSubject = (sub: string) => {
    const otherSubjects = form.subjects.filter(s => !BASKET_SUBJECTS.includes(s));
    const basketSelected = form.subjects.filter(s => BASKET_SUBJECTS.includes(s));

    if (basketSelected.includes(sub)) {
      set('subjects', otherSubjects);
    } else {
      set('subjects', [...otherSubjects, sub]);
    }
  };

  const addOlRow = () => setOlRows(rows => [...rows, { ...emptyOL }]);
  const removeOlRow = (i: number) => setOlRows(rows => rows.filter((_, idx) => idx !== i));
  const setOlRow = (i: number, key: keyof OLRow, val: string) => {
    setOlRows(rows => rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  };

  const getStepErrors = (targetStep: number) => {
    const e: Record<string, string> = {};

    if (targetStep === 1) {
      if (!clean(form.fullNameEnglish)) e.fullNameEnglish = 'Full name (English) is required';
      if (!clean(form.dateOfBirth)) e.dateOfBirth = 'Date of birth is required';

      if (!clean(form.nicNo)) e.nicNo = 'NIC number is required';
      else if (!NIC_REGEX.test(clean(form.nicNo))) e.nicNo = 'Enter a valid NIC (9 digits + V/X or 12 digits)';

      if (!profilePhoto) e.profilePhoto = 'Profile picture is required';
      if (!clean(form.address)) e.address = 'Address is required';
      if (!clean(form.school)) e.school = 'School is required';

      if (!clean(form.whatsappNo)) e.whatsappNo = 'WhatsApp number is required';
      else if (!PHONE_REGEX.test(cleanPhone(form.whatsappNo))) e.whatsappNo = 'Enter a valid number e.g. 0771234567';

      if (!clean(form.parentsNo)) e.parentsNo = "Parent's number is required";
      else if (!PHONE_REGEX.test(cleanPhone(form.parentsNo))) e.parentsNo = 'Enter a valid number e.g. 0771234567';

      if (!clean(form.email)) e.email = 'Email is required';
      else if (!EMAIL_REGEX.test(clean(form.email))) e.email = 'Enter a valid email address';

      if (!form.password) e.password = 'Password is required';
      else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';

      if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
      else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }

    if (targetStep === 2) {
      if (!clean(form.permanentAddress)) e.permanentAddress = 'Permanent address is required';
      if (!form.administrativeDistrict) e.administrativeDistrict = 'District is required';

      if (!clean(form.fixedTelephone)) e.fixedTelephone = 'Fixed telephone number is required';
      else if (!PHONE_REGEX.test(cleanPhone(form.fixedTelephone))) e.fixedTelephone = 'Enter a valid number e.g. 0112345678';

      if (!form.race) e.race = 'Race is required';
      if (!form.religion) e.religion = 'Religion is required';
      if (!clean(form.contactAddress)) e.contactAddress = 'Contact address is required';

      if (!clean(form.postalCode)) e.postalCode = 'Postal code is required';
      else if (!/^[0-9]{4,6}$/.test(clean(form.postalCode))) e.postalCode = 'Enter a valid postal code';
    }

    if (targetStep === 3) {
      if (!clean(form.fatherName)) e.fatherName = "Father's full name is required";
      if (!clean(form.motherName)) e.motherName = "Mother's full name is required";
      if (!clean(form.guardianName)) e.guardianName = "Guardian's full name is required";
      if (!clean(form.guardianAddress)) e.guardianAddress = 'Guardian address is required';

      if (!clean(form.guardianFixedTel)) e.guardianFixedTel = 'Fixed telephone number is required';
      else if (!PHONE_REGEX.test(cleanPhone(form.guardianFixedTel))) e.guardianFixedTel = 'Enter a valid number e.g. 0112345678';

      if (!clean(form.guardianMobile)) e.guardianMobile = 'Mobile number is required';
      else if (!PHONE_REGEX.test(cleanPhone(form.guardianMobile))) e.guardianMobile = 'Enter a valid number e.g. 0771234567';
    }

    if (targetStep === 5) {
      if (!clean(form.batch)) e.batch = 'Batch is required';

      const mainSelected = form.subjects.filter(s => MAIN_SUBJECTS.includes(s));
      const basketSelected = form.subjects.filter(s => BASKET_SUBJECTS.includes(s));

      if (mainSelected.length !== MAIN_SUBJECTS_REQUIRED) {
        e.mainSubjects = `Select exactly ${MAIN_SUBJECTS_REQUIRED} main subjects`;
      }

      if (basketSelected.length !== BASKET_SUBJECTS_REQUIRED) {
        e.basketSubjects = `Select exactly ${BASKET_SUBJECTS_REQUIRED} basket subject`;
      }

      if (!form.declarationRules || !form.declarationAccuracy) e.declaration = 'Both declarations are required';
    }

    return e;
  };

  const validateStep = () => {
    const e = getStepErrors(step);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 5)); };
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    const stepsToValidate = [1, 2, 3, 5];
    const allErrors = stepsToValidate.reduce<Record<string, string>>(
      (acc, s) => ({ ...acc, ...getStepErrors(s) }),
      {}
    );

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      const firstInvalidStep = stepsToValidate.find(
        (s) => Object.keys(getStepErrors(s)).length > 0
      );
      if (firstInvalidStep) setStep(firstInvalidStep);
      setSubmitError('Please complete all required fields before submitting.');
      return;
    }

    setLoading(true);
    setSubmitMessage('');
    setSubmitError('');

    const formData = new FormData();
    formData.append('payload', JSON.stringify(buildRegisterPayload(form, olRows)));
    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

    try {
      const result = await authApi.registerStudent(formData);

      setSubmitMessage(
        result?.message ||
          'Registration submitted successfully. Awaiting admin approval.'
      );
      setSubmitted(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-12"
        style={{
          backgroundImage: "url('/Back.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <GraduationCap className="absolute -left-12 top-10 h-80 w-80 rotate-12 text-white/10 stroke-[1.5] sm:h-[30rem] sm:w-[30rem]" />
        <BookOpen className="absolute -right-16 bottom-6 h-72 w-72 -rotate-12 text-white/10 stroke-[1.5] sm:h-[26rem] sm:w-[26rem]" />
        <GraduationCap className="absolute bottom-24 right-16 h-24 w-24 rotate-12 text-white/10 stroke-[1.5] sm:h-36 sm:w-36" />

        <div className="relative w-full max-w-md rounded-3xl bg-white px-7 py-8 text-center shadow-2xl sm:px-10 sm:py-10">
          <Link href="/" className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors">
            <X className="h-4 w-4" />
          </Link>
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-sky-100">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-sky-400 shadow-lg shadow-sky-300/40">
              <Check className="h-10 w-10 text-white" />
            </div>
          </div>

          <h2 className="mb-3 text-2xl font-bold text-slate-950">Application Submitted!</h2>
          <p className="mb-7 text-base text-gray-500">{submitMessage || 'You can login only after admin approval.'}</p>

          <div className="mb-5 border-t border-gray-200 pt-3">
            <p className="text-sm text-gray-600">A confirmation email will be sent to</p>
            <p className="mt-1 break-words text-base font-bold text-sky-600">{form.email}</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-600">
              Our admin will review your application and assign your admission number.
            </p>
          </div>

          <div className="mt-4 flex justify-center">
            <button className="rounded-full bg-sky-400 px-10 py-3 text-base font-bold text-white shadow-md">
              Review in Progress
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            Need help? Contact our support team at support@techna.edu
          </p>
        </div>
      </div>
    );
  }

  const inputCls = (err?: string) => `w-full px-3 py-2.5 border ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400`;

  return (
    <div
      className="relative min-h-screen py-10 px-4 flex items-center"
      style={{
        backgroundImage: "url('/Back.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-12 px-2 pt-6">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = step > s.id;

            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      done
                        ? 'bg-[#1E40AF]'
                        : 'bg-white'
                    }`}
                  >
                    {done ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Icon className="w-5 h-5 text-[#1E40AF]" />
                    )}
                  </div>

                  <p
                    className={`text-xs mt-1.5 font-medium hidden sm:block ${
                      active || done
                        ? 'text-white'
                        : 'text-blue-100'
                    }`}
                  >
                    {s.label}
                  </p>
                </div>

                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      done ? 'bg-[#1E40AF]' : 'bg-white'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

       <div className="bg-white rounded-3xl shadow-2xl px-6 pt-0 pb-10 md:px-10 md:pt-0 md:pb-10">

<div className="text-center -mt-6 mb-0">
  <Image
    src="/new.png"
    alt="Techna Logo"
    width={220}
    height={220}
    className="mx-auto w-[220px] h-auto object-contain -mb-14"
  />

  <h1 className="text-[30px] font-extrabold text-slate-800 leading-9 -mt-10">
    Techna Technical Institute
  </h1>

  <p className="text-slate-500 text-base font-medium mt-0">
    Sign up to My Techna 
  </p> 
</div>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">{STEPS[step - 1].label}</h2>
            <p className="text-gray-500 text-sm">{STEPS[step - 1].desc}</p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Tamil) <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input value={form.fullNameTamil} onChange={e => set('fullNameTamil', e.target.value)} placeholder="தமிழில் முழு பெயர்" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (English) <span className="text-red-500">*</span></label>
                  <input value={form.fullNameEnglish} onChange={e => set('fullNameEnglish', e.target.value.replace(/[^a-zA-Z\s]/g, '').toUpperCase())} placeholder="FULL NAME IN ENGLISH" className={inputCls(errors.fullNameEnglish)} />
                  {errors.fullNameEnglish && <p className="text-red-500 text-xs mt-1">{errors.fullNameEnglish}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={e => set('dateOfBirth', e.target.value)}
                  className={inputCls(errors.dateOfBirth)}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number <span className="text-red-500">*</span></label>
                  <input value={form.nicNo} onChange={e => set('nicNo', e.target.value)} placeholder="NIC No. (National Identity Card)" className={inputCls(errors.nicNo)} />
                  {errors.nicNo && <p className="text-red-500 text-xs mt-1">{errors.nicNo}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture <span className="text-red-500">*</span></label>
                  <label className={`flex h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed px-3 text-sm font-semibold transition-all ${errors.profilePhoto ? 'border-red-400 bg-red-50 text-red-700' : 'border-blue-300 bg-blue-50 text-blue-800 hover:border-blue-500 hover:bg-blue-100'}`}>
                    <Upload className="h-4 w-4" />
                    <span className="truncate">{profilePhoto ? profilePhoto.name : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setProfilePhoto(e.target.files?.[0] || null)}
                      className="sr-only"
                    />
                  </label>
                  {errors.profilePhoto && <p className="text-red-500 text-xs mt-1">{errors.profilePhoto}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
                <textarea value={form.address} onChange={e => set('address', e.target.value)} rows={2} placeholder="Full residential address" className={inputCls(errors.address) + ' resize-none'} />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School <span className="text-red-500">*</span></label>
                <input value={form.school} onChange={e => set('school', e.target.value)} placeholder="School / College name" className={inputCls(errors.school)} />
                {errors.school && <p className="text-red-500 text-xs mt-1">{errors.school}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp No. <span className="text-red-500">*</span></label>
                  <input value={form.whatsappNo} onChange={e => set('whatsappNo', e.target.value)} placeholder="07X-XXXXXXX" className={inputCls(errors.whatsappNo)} />
                  {errors.whatsappNo && <p className="text-red-500 text-xs mt-1">{errors.whatsappNo}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent's No. <span className="text-red-500">*</span></label>
                  <input value={form.parentsNo} onChange={e => set('parentsNo', e.target.value)} placeholder="Parent/Guardian phone" className={inputCls(errors.parentsNo)} />
                  {errors.parentsNo && <p className="text-red-500 text-xs mt-1">{errors.parentsNo}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="student@email.com" autoComplete="new-email" className={inputCls(errors.email)} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                  <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Create a password" autoComplete="new-password" className={inputCls(errors.password)} />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                  <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Confirm password" autoComplete="new-password" className={inputCls(errors.confirmPassword)} />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address of the Residence <span className="text-red-500">*</span></label>
                <input value={form.permanentAddress} onChange={e => set('permanentAddress', e.target.value)} placeholder="Full permanent address" className={inputCls(errors.permanentAddress)} />
                {errors.permanentAddress && <p className="text-red-500 text-xs mt-1">{errors.permanentAddress}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Administrative District <span className="text-red-500">*</span></label>
                  <select value={form.administrativeDistrict} onChange={e => set('administrativeDistrict', e.target.value)} className={inputCls(errors.administrativeDistrict)}>
                    <option value="">Select District</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.administrativeDistrict && <p className="text-red-500 text-xs mt-1">{errors.administrativeDistrict}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fixed Telephone Number <span className="text-red-500">*</span></label>
                  <input value={form.fixedTelephone} onChange={e => set('fixedTelephone', e.target.value)} placeholder="0XX-XXXXXXX" className={inputCls(errors.fixedTelephone)} />
                  {errors.fixedTelephone && <p className="text-red-500 text-xs mt-1">{errors.fixedTelephone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Race <span className="text-red-500">*</span></label>
                  <select value={form.race} onChange={e => set('race', e.target.value)} className={inputCls(errors.race)}>
                    <option value="">Select Race</option>
                    {RACE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.race && <p className="text-red-500 text-xs mt-1">{errors.race}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion <span className="text-red-500">*</span></label>
                  <select value={form.religion} onChange={e => set('religion', e.target.value)} className={inputCls(errors.religion)}>
                    <option value="">Select Religion</option>
                    {RELIGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.religion && <p className="text-red-500 text-xs mt-1">{errors.religion}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Address <span className="text-red-500">*</span></label>
                <textarea value={form.contactAddress} onChange={e => set('contactAddress', e.target.value)} rows={2} placeholder="Contact/mailing address" className={inputCls(errors.contactAddress) + ' resize-none'} />
                {errors.contactAddress && <p className="text-red-500 text-xs mt-1">{errors.contactAddress}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code <span className="text-red-500">*</span></label>
                  <input value={form.postalCode} onChange={e => set('postalCode', e.target.value)} placeholder="Postal code" className={inputCls(errors.postalCode)} />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Full Name <span className="text-red-500">*</span></label>
                <input value={form.fatherName} onChange={e => set('fatherName', e.target.value.toUpperCase())} placeholder="FATHER'S FULL NAME" className={inputCls(errors.fatherName)} />
                {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Full Name <span className="text-red-500">*</span></label>
                <input value={form.motherName} onChange={e => set('motherName', e.target.value.toUpperCase())} placeholder="MOTHER'S FULL NAME" className={inputCls(errors.motherName)} />
                {errors.motherName && <p className="text-red-500 text-xs mt-1">{errors.motherName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian's Full Name <span className="text-red-500">*</span></label>
                <input value={form.guardianName} onChange={e => set('guardianName', e.target.value.toUpperCase())} placeholder="GUARDIAN'S FULL NAME" className={inputCls(errors.guardianName)} />
                {errors.guardianName && <p className="text-red-500 text-xs mt-1">{errors.guardianName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                <div className="flex gap-6">
                  {(['Father', 'Mother', 'Guardian'] as const).map(p => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="contactPerson"
                        value={p}
                        checked={form.contactPerson === p}
                        onChange={() => set('contactPerson', p)}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address of Father/Mother or Guardian <span className="text-red-500">*</span></label>
                <textarea value={form.guardianAddress} onChange={e => set('guardianAddress', e.target.value)} rows={2} placeholder="Guardian's address" className={inputCls(errors.guardianAddress) + ' resize-none'} />
                {errors.guardianAddress && <p className="text-red-500 text-xs mt-1">{errors.guardianAddress}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fixed Telephone Number <span className="text-red-500">*</span></label>
                  <input value={form.guardianFixedTel} onChange={e => set('guardianFixedTel', e.target.value)} placeholder="0XX-XXXXXXX" className={inputCls(errors.guardianFixedTel)} />
                  {errors.guardianFixedTel && <p className="text-red-500 text-xs mt-1">{errors.guardianFixedTel}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile <span className="text-red-500">*</span></label>
                  <input value={form.guardianMobile} onChange={e => set('guardianMobile', e.target.value)} placeholder="07X-XXXXXXX" className={inputCls(errors.guardianMobile)} />
                  {errors.guardianMobile && <p className="text-red-500 text-xs mt-1">{errors.guardianMobile}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 text-sm">G.C.E. (O/L) Results <span className="text-gray-400 font-normal">(Optional)</span></h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Category of G.C.E.(O/L)</label>
                    <select value={form.olCategory} onChange={e => set('olCategory', e.target.value)} className={inputCls()}>
                      <option value="">Select Category</option>
                      <option value="Local O/L">Local O/L</option>
                      <option value="London O/L">London O/L</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                    <input value={form.olYear} onChange={e => set('olYear', e.target.value)} placeholder="e.g. 2022" className={inputCls()} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Index Number</label>
                    <input value={form.olIndexNumber} onChange={e => set('olIndexNumber', e.target.value)} placeholder="e.g. 24590487" className={inputCls()} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name used in G.C.E.(O/L) Examination</label>
                  <input value={form.olNameUsed} onChange={e => set('olNameUsed', e.target.value.toUpperCase())} placeholder="FULL NAME AS IN O/L CERTIFICATE" className={inputCls()} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">Subject Results</h4>
                  <button onClick={addOlRow} className="flex items-center gap-1 text-xs text-blue-700 font-medium hover:text-blue-900">
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        {['Year', 'Index No.', 'English', 'Maths', 'Science', 'Sinhala', 'Tamil', ''].map(h => (
                          <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {olRows.map((row, i) => (
                        <tr key={i} className="border-t border-gray-100">
                          <td className="px-2 py-2"><input value={row.year} onChange={e => setOlRow(i, 'year', e.target.value)} className="w-16 border border-gray-200 rounded px-2 py-1 text-xs" placeholder="2022" /></td>
                          <td className="px-2 py-2"><input value={row.indexNumber} onChange={e => setOlRow(i, 'indexNumber', e.target.value)} className="w-24 border border-gray-200 rounded px-2 py-1 text-xs" placeholder="Index No." /></td>
                          {(['english', 'mathematics', 'science', 'sinhala', 'tamil'] as const).map(sub => (
                            <td key={sub} className="px-2 py-2">
                              <select value={row[sub]} onChange={e => setOlRow(i, sub, e.target.value)} className="border border-gray-200 rounded px-1 py-1 text-xs w-16">
                                <option value="">-</option>
                                {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                              </select>
                            </td>
                          ))}
                          <td className="px-2 py-2">
                            {olRows.length > 1 && (
                              <button onClick={() => removeOlRow(i)} className="text-red-400 hover:text-red-600">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Above Results</label>
                <div className="flex gap-6">
                  {(['Accept', 'Change'] as const).map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="olAccept" value={opt} checked={form.olAccept === opt} onChange={() => set('olAccept', opt)} className="text-blue-600" />
                      <span className="text-sm text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Batch <span className="text-red-500">*</span></label>
                <input
                  value={form.batch}
                  onChange={e => set('batch', e.target.value)}
                  placeholder="Enter selected batch"
                  className={inputCls(errors.batch)}
                />
                {errors.batch && <p className="text-red-500 text-xs mt-1">{errors.batch}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Main Subjects <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-3">Select exactly {MAIN_SUBJECTS_REQUIRED} subjects</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MAIN_SUBJECTS.map(sub => {
                      const selected = form.subjects.includes(sub);
                      const mainSelectedCount = form.subjects.filter(s => MAIN_SUBJECTS.includes(s)).length;
                      const disabled = !selected && mainSelectedCount >= MAIN_SUBJECTS_REQUIRED;
                      return (
                        <label
                          key={sub}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all ${
                            selected
                              ? 'border-blue-500 bg-blue-50 cursor-pointer'
                              : disabled
                              ? 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                              : 'border-gray-200 bg-gray-50 hover:border-blue-300 cursor-pointer'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            disabled={disabled}
                            onChange={() => toggleMainSubject(sub)}
                            className="text-blue-600 rounded w-4 h-4"
                          />
                          <span className={`text-sm font-medium ${selected ? 'text-blue-800' : 'text-gray-700'}`}>{subjectLabel(sub)}</span>
                          {selected && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
                        </label>
                      );
                    })}
                </div>
                {errors.mainSubjects && <p className="text-red-500 text-xs mt-2">{errors.mainSubjects}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1">
                  Basket Subjects <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-3">Select exactly {BASKET_SUBJECTS_REQUIRED} subject</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BASKET_SUBJECTS.map(sub => {
                      const selected = form.subjects.includes(sub);
                      return (
                        <label
                          key={sub}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300'}`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleBasketSubject(sub)}
                            className="text-blue-600 rounded w-4 h-4"
                          />
                          <span className={`text-sm font-medium ${selected ? 'text-blue-800' : 'text-gray-700'}`}>{subjectLabel(sub)}</span>
                          {selected && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
                        </label>
                      );
                    })}
                </div>
                {errors.basketSubjects && <p className="text-red-500 text-xs mt-2">{errors.basketSubjects}</p>}
                {!loadingSubjects && subjectsError && <p className="text-red-500 text-xs mt-2">{subjectsError}</p>}
              </div>

              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-3 text-sm">Application Summary</h4>
                <div className="space-y-1.5 text-sm text-gray-700">
                  <div className="flex justify-between"><span className="text-gray-500">Full Name:</span><span className="font-medium">{form.fullNameEnglish || '–'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">NIC:</span><span className="font-medium">{form.nicNo || '–'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Email:</span><span className="font-medium">{form.email || '–'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">District:</span><span className="font-medium">{form.administrativeDistrict || '–'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Batch:</span><span className="font-medium">{form.batch || '–'}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-gray-500">Subjects:</span><span className="font-medium text-right">{form.subjects.length > 0 ? form.subjects.map(subjectLabel).join(', ') : '–'}</span></div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600 italic leading-relaxed">
                I hereby declare that all the information provided in this admission form is true and correct to the best of my knowledge. I agree to follow all the rules and regulations of the institution.
              </div>

              <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border-2 ${errors.declaration ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                <input
                  type="checkbox"
                  checked={form.declarationRules}
                  onChange={e => set('declarationRules', e.target.checked)}
                  className="text-blue-600 rounded mt-0.5 w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  I agree to follow all institute{' '}
                  <Link
                    href="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Rules & Regulations
                  </Link>
                  .
                </span>
              </label>
              <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border-2 ${errors.declaration ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                <input
                  type="checkbox"
                  checked={form.declarationAccuracy}
                  onChange={e => set('declarationAccuracy', e.target.checked)}
                  className="text-blue-600 rounded mt-0.5 w-4 h-4"
                />
                <span className="text-sm text-gray-700">I declare that all provided information is true and accurate.</span>
              </label>
              {errors.declaration && <p className="text-red-500 text-xs">{errors.declaration}</p>}
            </div>
          )}

          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mt-4">
              {submitError}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
            <div className="text-center">
              <span className="text-xs text-gray-400">Step {step} of {STEPS.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {step > 1 ? (
                <button onClick={prev} className="w-full flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all text-sm">
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
              ) : (
                <div />
              )}
              {step < 5 ? (
                <button onClick={next} className="w-full flex items-center justify-center gap-2 px-6 py-2.5 text-white font-semibold rounded-xl transition-all text-sm shadow-md" style={{ background: 'linear-gradient(135deg, #0183CB 0%, #34BFF3 100%)' }}>
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-2.5 text-white font-semibold rounded-xl transition-all text-sm shadow-md disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #0183CB 0%, #34BFF3 100%)' }}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-white text-sm font-medium bg-black/30 hover:bg-black/45 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
          >
            Already registered? Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
}