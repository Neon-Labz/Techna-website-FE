'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronRight, ChevronLeft, User, MapPin, BookOpen, FileText, Plus, Trash2, Upload, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import { registerStudent } from '../../api/auth.api';
import apiClient from '../../lib/axios';

const STEPS = [
  { id: 1, label: 'Basic Info', icon: User, desc: 'Personal details' },
  { id: 2, label: 'Address & Contact', icon: MapPin, desc: 'Residence details' },
  { id: 3, label: 'Parent Details', icon: User, desc: 'Guardian info' },
  { id: 4, label: 'O/L Results', icon: BookOpen, desc: 'Academic results' },
  { id: 5, label: 'Subjects & Confirm', icon: FileText, desc: 'Subject selection' },
];

const DISTRICTS = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Mullaitivu', 'Vavuniya', 'Puttalam', 'Kurunegala', 'Anuradhapura',
  'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle',
  'Ampara', 'Batticaloa', 'Trincomalee',
];

const GRADES = ['A', 'B', 'C', 'S', 'W', 'Absent'];
const RACE_OPTIONS = ['Sinhala', 'Tamil', 'Indian Tamil', 'Muslim', 'Burgher', 'Malay', 'Other'];
const RELIGION_OPTIONS = ['Buddhism', 'Hinduism', 'Islam', 'Christianity', 'Catholicism', 'Other'];
interface OLRow { year: string; indexNumber: string; english: string; mathematics: string; science: string; sinhala: string; tamil: string; }
const emptyOL: OLRow = { year: '', indexNumber: '', english: '', mathematics: '', science: '', sinhala: '', tamil: '' };

type ModuleOption = {
  name?: string;
};

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const responseData = (error as { response?: { data?: { message?: string | string[] } } })?.response?.data;
  const message = responseData?.message;

  if (Array.isArray(message)) return message.join(', ');
  if (message) return message;
  if (error instanceof Error) return error.message;
  return fallback;
};

export default function RegisterSection() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submissionReference, setSubmissionReference] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [subjectOptions, setSubjectOptions] = useState<string[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [subjectsError, setSubjectsError] = useState('');

  // Form state
  const [form, setForm] = useState({
    fullNameTamil: '', fullNameEnglish: '', dateOfBirth: '',
    nicNo: '', address: '', school: '', whatsappNo: '', parentsNo: '', email: '', password: '', confirmPassword: '',
    // Address
    permanentAddress: '', administrativeDistrict: '', fixedTelephone: '', residingSince: '',
    race: '', religion: '', citizenByDescent: 'YES',
    contactAddress: '', postalCode: '',
    // Parents
    fatherName: '', motherName: '', guardianName: '',
    contactPerson: 'Mother' as 'Father' | 'Mother' | 'Guardian',
    guardianAddress: '', guardianFixedTel: '', guardianMobile: '',
    // OL
    olCategory: 'Local O/L', olYear: '', olIndexNumber: '', olNameUsed: '',
    olAccept: 'Accept' as 'Accept' | 'Change',
    // Subjects
    batch: '',
    subjects: [] as string[],
    // Agreement
    declarationRules: false,
    declarationAccuracy: false,
  });

  const [olRows, setOlRows] = useState<OLRow[]>([{ ...emptyOL }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string | boolean | string[]) => setForm(f => ({ ...f, [key]: value }));

  useEffect(() => {
    let active = true;

    const loadSubjects = async () => {
      setLoadingSubjects(true);
      setSubjectsError('');

      try {
        const result = await apiClient.get('/modules');

        const modules = Array.isArray(result.data)
          ? result.data
          : Array.isArray(result.data?.data)
            ? result.data.data
            : [];

        const options = modules
          .map((module: ModuleOption) => module.name || '')
          .filter((name: string) => Boolean(name.trim()));

        if (active) setSubjectOptions(Array.from(new Set(options)));
      } catch {
        if (active) {
          setSubjectOptions([]);
          setSubjectsError('Unable to load subjects');
        }
      } finally {
        if (active) setLoadingSubjects(false);
      }
    };

    loadSubjects();

    return () => {
      active = false;
    };
  }, []);

  const toggleSubject = (sub: string) => {
    const current = form.subjects;
    if (current.includes(sub)) set('subjects', current.filter(s => s !== sub));
    else set('subjects', [...current, sub]);
  };

  const addOlRow = () => setOlRows(rows => [...rows, { ...emptyOL }]);
  const removeOlRow = (i: number) => setOlRows(rows => rows.filter((_, idx) => idx !== i));
  const setOlRow = (i: number, key: keyof OLRow, val: string) => {
    setOlRows(rows => rows.map((r, idx) => idx === i ? { ...r, [key]: val } : r));
  };

  const validateStep = () => {
    const e: Record<string, string> = {};
    if (step === 1) {
      if (!form.fullNameEnglish) e.fullNameEnglish = 'Full name (English) is required';
      if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required';
      if (!form.nicNo) e.nicNo = 'NIC number is required';
      if (!form.whatsappNo) e.whatsappNo = 'WhatsApp number is required';
      if (!form.email) e.email = 'Email is required';
      if (!form.password) e.password = 'Password is required';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    if (step === 2) {
      if (!form.permanentAddress) e.permanentAddress = 'Address is required';
      if (!form.administrativeDistrict) e.administrativeDistrict = 'District is required';
    }
    if (step === 5) {
      if (!form.batch) e.batch = 'Batch is required';
      if (form.subjects.length === 0) e.subjects = 'Select at least one subject';
      if (!form.declarationRules || !form.declarationAccuracy) e.declaration = 'Both declarations are required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 5)); };
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    setSubmitError('');

    const payload = {
      account: {
        email: form.email,
        password: form.password,
      },
      personal: {
        fullNameTamil: form.fullNameTamil,
        fullNameEnglish: form.fullNameEnglish,
        dateOfBirth: form.dateOfBirth,
        nicNo: form.nicNo,
        school: form.school,
        whatsappNo: form.whatsappNo,
        parentsNo: form.parentsNo,
        permanentAddress: form.permanentAddress || form.address,
        administrativeDistrict: form.administrativeDistrict,
        fixedTelephone: form.fixedTelephone,
        residingSince: form.residingSince,
        race: form.race || undefined,
        religion: form.religion || undefined,
        citizenByDescent: form.citizenByDescent || undefined,
        contactAddress: form.contactAddress,
        postalCode: form.postalCode,
      },
      parent: {
        fatherName: form.fatherName,
        motherName: form.motherName,
        guardianName: form.guardianName,
        contactPerson: form.contactPerson || undefined,
        guardianAddress: form.guardianAddress,
        guardianFixedTel: form.guardianFixedTel,
        guardianMobile: form.guardianMobile,
      },
      olRecords: {
        olCategory: form.olCategory || undefined,
        olYear: form.olYear,
        olIndexNumber: form.olIndexNumber,
        olNameUsed: form.olNameUsed,
        olAccept: form.olAccept || undefined,
        olResults: olRows
          .filter(row => row.year && row.indexNumber)
          .map(row => ({
            year: row.year,
            indexNumber: row.indexNumber,
            english: row.english || undefined,
            mathematics: row.mathematics || undefined,
            science: row.science || undefined,
            sinhala: row.sinhala || undefined,
            tamil: row.tamil || undefined,
          })),
      },
      subjectSelection: {
        subjects: form.subjects,
        //modules: form.subjects,
        agreed: form.declarationRules && form.declarationAccuracy,
      },
      batch: form.batch,
    };

    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));
    if (profilePhoto) {
      formData.append('profilePhoto', profilePhoto);
    }

    try {
      const result = await registerStudent(formData);

      setSubmissionReference(
        result.data?.applicationReference ||
          result.applicationReference ||
          result.data?.reference ||
          result.reference ||
          '',
      );
      setLoading(false);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, 'Registration failed. Please try again.'));
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-500 via-cyan-400 to-sky-600 flex items-center justify-center px-4 py-12">
        <GraduationCap className="absolute -left-12 top-10 h-80 w-80 rotate-12 text-white/10 stroke-[1.5] sm:h-[30rem] sm:w-[30rem]" />
        <BookOpen className="absolute -right-16 bottom-6 h-72 w-72 -rotate-12 text-white/10 stroke-[1.5] sm:h-[26rem] sm:w-[26rem]" />
        <GraduationCap className="absolute bottom-24 right-16 h-24 w-24 rotate-12 text-white/10 stroke-[1.5] sm:h-36 sm:w-36" />

        <div className="relative w-full max-w-md rounded-3xl bg-white px-7 py-8 text-center shadow-2xl sm:px-10 sm:py-10">
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-sky-100">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-sky-400 shadow-lg shadow-sky-300/40">
              <Check className="h-10 w-10 text-white" />
            </div>
          </div>

          <h2 className="mb-3 text-2xl font-bold text-slate-950">Application Submitted!</h2>
          <p className="mb-7 text-base text-gray-500">You can login only after admin approval.</p>

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

          <p className="text-xs text-gray-400">
            Need help? Contact our support team at support@techna.edu
          </p>
        </div>
      </div>
    );
  }

  const inputCls = (err?: string) => `w-full px-3 py-2.5 border ${err ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'} rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Techna Logo" width={120} height={50} className="mx-auto mb-4 rounded-full" />
          <h1 className="text-2xl font-bold text-white">Techna Technical Institute</h1>
          <p className="text-blue-300 text-sm">A/L Technology Stream – Admission Form 2024</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = step === s.id;
            const done = step > s.id;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${done ? 'bg-green-500 border-green-500' : active ? 'bg-yellow-400 border-yellow-400' : 'bg-white/10 border-white/30'}`}>
                    {done ? <Check className="w-5 h-5 text-white" /> : <Icon className={`w-5 h-5 ${active ? 'text-blue-900' : 'text-blue-300'}`} />}
                  </div>
                  <p className={`text-xs mt-1.5 font-medium hidden sm:block ${active ? 'text-yellow-400' : done ? 'text-green-400' : 'text-blue-400'}`}>{s.label}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${done ? 'bg-green-500' : 'bg-white/20'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">{STEPS[step - 1].label}</h2>
            <p className="text-gray-500 text-sm">{STEPS[step - 1].desc}</p>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (Tamil) <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input value={form.fullNameTamil} onChange={e => set('fullNameTamil', e.target.value)} placeholder="தமிழில் முழு பெயர்" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (English) <span className="text-red-500">*</span></label>
                  <input value={form.fullNameEnglish} onChange={e => set('fullNameEnglish', e.target.value.toUpperCase())} placeholder="FULL NAME IN ENGLISH" className={inputCls(errors.fullNameEnglish)} />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <label className="flex h-[42px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 px-3 text-sm font-semibold text-blue-800 transition-all hover:border-blue-500 hover:bg-blue-100">
                    <Upload className="h-4 w-4" />
                    <span className="truncate">{profilePhoto ? profilePhoto.name : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setProfilePhoto(e.target.files?.[0] || null)}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea value={form.address} onChange={e => set('address', e.target.value)} rows={2} placeholder="Full residential address" className={inputCls() + ' resize-none'} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School</label>
                <input value={form.school} onChange={e => set('school', e.target.value)} placeholder="School / College name" className={inputCls()} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp No. <span className="text-red-500">*</span></label>
                  <input value={form.whatsappNo} onChange={e => set('whatsappNo', e.target.value)} placeholder="07X-XXXXXXX" className={inputCls(errors.whatsappNo)} />
                  {errors.whatsappNo && <p className="text-red-500 text-xs mt-1">{errors.whatsappNo}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Parent's No.</label>
                  <input value={form.parentsNo} onChange={e => set('parentsNo', e.target.value)} placeholder="Parent/Guardian phone" className={inputCls()} />
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

          {/* Step 2: Address & Contact */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address of the Residence <span className="text-red-500">*</span></label>
                <input value={form.permanentAddress} onChange={e => set('permanentAddress', e.target.value)} placeholder="Full permanent address" className={inputCls(errors.permanentAddress)} />
                {errors.permanentAddress && <p className="text-red-500 text-xs mt-1">{errors.permanentAddress}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Administrative District <span className="text-red-500">*</span></label>
                  <select value={form.administrativeDistrict} onChange={e => set('administrativeDistrict', e.target.value)} className={inputCls(errors.administrativeDistrict)}>
                    <option value="">Select District</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.administrativeDistrict && <p className="text-red-500 text-xs mt-1">{errors.administrativeDistrict}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fixed Telephone Number</label>
                  <input value={form.fixedTelephone} onChange={e => set('fixedTelephone', e.target.value)} placeholder="0XX-XXXXXXX" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Residing Since</label>
                  <input type="date" value={form.residingSince} onChange={e => set('residingSince', e.target.value)} className={inputCls()} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Race</label>
                  <select value={form.race} onChange={e => set('race', e.target.value)} className={inputCls()}>
                    <option value="">Select Race</option>
                    {RACE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <select value={form.religion} onChange={e => set('religion', e.target.value)} className={inputCls()}>
                    <option value="">Select Religion</option>
                    {RELIGION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Citizen by Descent</label>
                  <select value={form.citizenByDescent} onChange={e => set('citizenByDescent', e.target.value)} className={inputCls()}>
                    <option value="">Select</option>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Address</label>
                <textarea value={form.contactAddress} onChange={e => set('contactAddress', e.target.value)} rows={2} placeholder="Contact/mailing address" className={inputCls() + ' resize-none'} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input value={form.postalCode} onChange={e => set('postalCode', e.target.value)} placeholder="Postal code" className={inputCls()} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Parent/Guardian Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Full Name</label>
                <input value={form.fatherName} onChange={e => set('fatherName', e.target.value.toUpperCase())} placeholder="FATHER'S FULL NAME" className={inputCls()} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Full Name</label>
                <input value={form.motherName} onChange={e => set('motherName', e.target.value.toUpperCase())} placeholder="MOTHER'S FULL NAME" className={inputCls()} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guardian's Full Name</label>
                <input value={form.guardianName} onChange={e => set('guardianName', e.target.value.toUpperCase())} placeholder="GUARDIAN'S FULL NAME" className={inputCls()} />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Address of Father/Mother or Guardian</label>
                <textarea value={form.guardianAddress} onChange={e => set('guardianAddress', e.target.value)} rows={2} placeholder="Guardian's address" className={inputCls() + ' resize-none'} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fixed Telephone Number</label>
                  <input value={form.guardianFixedTel} onChange={e => set('guardianFixedTel', e.target.value)} placeholder="0XX-XXXXXXX" className={inputCls()} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input value={form.guardianMobile} onChange={e => set('guardianMobile', e.target.value)} placeholder="07X-XXXXXXX" className={inputCls()} />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: O/L Results */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 text-sm">G.C.E. (O/L) Results</h3>
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

              {/* O/L Results Table */}
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

          {/* Step 5: Subjects & Confirm */}
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
                <label className="block text-sm font-semibold text-gray-800 mb-3">Select Subjects <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {subjectOptions.map(sub => {
                    const selected = form.subjects.includes(sub);
                    return (
                      <label
                        key={sub}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-blue-300'}`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSubject(sub)}
                          className="text-blue-600 rounded w-4 h-4"
                        />
                        <span className={`text-sm font-medium ${selected ? 'text-blue-800' : 'text-gray-700'}`}>{sub}</span>
                        {selected && <Check className="w-4 h-4 text-blue-600 ml-auto" />}
                      </label>
                    );
                  })}
                </div>
                {loadingSubjects && <p className="text-gray-500 text-xs mt-2">Loading subjects...</p>}
                {!loadingSubjects && subjectsError && <p className="text-red-500 text-xs mt-2">{subjectsError}</p>}
                {!loadingSubjects && !subjectsError && subjectOptions.length === 0 && <p className="text-gray-500 text-xs mt-2">No subjects are available.</p>}
                {errors.subjects && <p className="text-red-500 text-xs mt-2">{errors.subjects}</p>}
              </div>

              {/* Summary */}
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-3 text-sm">Application Summary</h4>
                <div className="space-y-1.5 text-sm text-gray-700">
                  <div className="flex justify-between"><span className="text-gray-500">Race:</span><span className="font-medium">{form.race || 'â€“'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Religion:</span><span className="font-medium">{form.religion || 'â€“'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Name:</span><span className="font-medium">{form.fullNameEnglish || '–'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">NIC:</span><span className="font-medium">{form.nicNo || '–'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Email:</span><span className="font-medium">{form.email || '–'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">District:</span><span className="font-medium">{form.administrativeDistrict || '–'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Batch:</span><span className="font-medium">{form.batch || '–'}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-gray-500">Subjects:</span><span className="font-medium text-right">{form.subjects.length > 0 ? form.subjects.join(', ') : '–'}</span></div>
                </div>
              </div>

              {/* Declaration */}
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
                <span className="text-sm text-gray-700">I agree to follow all institute rules and regulations.</span>
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
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <div>
              {step > 1 && (
                <button onClick={prev} className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all text-sm">
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Step {step} of {STEPS.length}</span>
              {step < 5 ? (
                <button onClick={next} className="flex items-center gap-2 px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all text-sm shadow-md">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all text-sm shadow-md disabled:opacity-60"
                >
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
          {submitError && <p className="text-red-500 text-sm mt-4 text-right">{submitError}</p>}
        </div>

        <div className="text-center mt-6">
          <Link href="/login" className="text-blue-200 text-sm hover:text-white transition-colors">
            Already registered? Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
}