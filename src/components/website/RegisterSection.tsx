"use client";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, GraduationCap, User, MapPin, BookOpen, FileText, Plus, Trash2 } from 'lucide-react';
import { SUBJECTS, DISTRICTS, RACES, RELIGIONS, GRADES } from '../../data/mockData';

const STEPS = [
  { id: 1, label: 'Basic Info', icon: User, desc: 'Personal details' },
  { id: 2, label: 'Address & Contact', icon: MapPin, desc: 'Residence details' },
  { id: 3, label: 'Parent Details', icon: User, desc: 'Guardian info' },
  { id: 4, label: 'O/L Results', icon: BookOpen, desc: 'Academic results' },
  { id: 5, label: 'Subjects & Confirm', icon: FileText, desc: 'Subject selection' },
];

interface OLRow { year: string; indexNumber: string; english: string; mathematics: string; science: string; sinhala: string; tamil: string; }
const emptyOL: OLRow = { year: '', indexNumber: '', english: '', mathematics: '', science: '', sinhala: '', tamil: '' };

export default function RegisterSection() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [form, setForm] = useState({
    fullNameTamil: '', fullNameEnglish: '', dobDay: '', dobMonth: '', dobYear: '',
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
    subjects: [] as string[],
    // Agreement
    agreed: false,
  });

  const [olRows, setOlRows] = useState<OLRow[]>([{ ...emptyOL }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, value: string | boolean | string[]) => setForm(f => ({ ...f, [key]: value }));

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
      if (!form.dobDay || !form.dobMonth || !form.dobYear) e.dob = 'Date of birth is required';
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
      if (form.subjects.length === 0) e.subjects = 'Select at least one subject';
      if (!form.agreed) e.agreed = 'You must agree to the terms';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 5)); };
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    if (!validateStep()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-2">Your admission form has been successfully submitted.</p>
          <p className="text-gray-500 text-sm mb-6">A confirmation email will be sent to <strong>{form.email}</strong>. Our team will review your application and assign your admission number.</p>
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-sm text-blue-700">
            <p><strong>Application Reference:</strong></p>
            <p className="font-mono text-lg mt-1">APP-2024-{Math.floor(Math.random() * 9000 + 1000)}</p>
          </div>
          <button onClick={() => navigate('/login')} className="w-full py-3 bg-blue-900 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all">
            Go to Login
          </button>
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
          <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <GraduationCap className="w-8 h-8 text-blue-900" />
          </div>
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
                <div className="grid grid-cols-3 gap-3">
                  <div><input value={form.dobDay} onChange={e => set('dobDay', e.target.value)} maxLength={2} placeholder="DD" className={inputCls(errors.dob ? errors.dob : undefined)} /></div>
                  <div><input value={form.dobMonth} onChange={e => set('dobMonth', e.target.value)} maxLength={2} placeholder="MM" className={inputCls(errors.dob ? errors.dob : undefined)} /></div>
                  <div><input value={form.dobYear} onChange={e => set('dobYear', e.target.value)} maxLength={4} placeholder="YYYY" className={inputCls(errors.dob ? errors.dob : undefined)} /></div>
                </div>
                {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number <span className="text-red-500">*</span></label>
                <input value={form.nicNo} onChange={e => set('nicNo', e.target.value)} placeholder="NIC No. (National Identity Card)" className={inputCls(errors.nicNo)} />
                {errors.nicNo && <p className="text-red-500 text-xs mt-1">{errors.nicNo}</p>}
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
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="student@email.com" className={inputCls(errors.email)} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                  <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Create a password" className={inputCls(errors.password)} />
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password <span className="text-red-500">*</span></label>
                  <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Confirm password" className={inputCls(errors.confirmPassword)} />
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
                    {RACES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                  <select value={form.religion} onChange={e => set('religion', e.target.value)} className={inputCls()}>
                    <option value="">Select Religion</option>
                    {RELIGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Citizen by Descent</label>
                  <select value={form.citizenByDescent} onChange={e => set('citizenByDescent', e.target.value)} className={inputCls()}>
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
                      <option>Local O/L</option>
                      <option>London O/L</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
                    <select value={form.olYear} onChange={e => set('olYear', e.target.value)} className={inputCls()}>
                      <option value="">Select Year</option>
                      {Array.from({ length: 8 }, (_, i) => 2024 - i).map(y => (
                        <option key={y} value={String(y)}>{y}</option>
                      ))}
                    </select>
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
                <label className="block text-sm font-semibold text-gray-800 mb-3">Select Subjects <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SUBJECTS.map(sub => {
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
                {errors.subjects && <p className="text-red-500 text-xs mt-2">{errors.subjects}</p>}
              </div>

              {/* Summary */}
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-3 text-sm">Application Summary</h4>
                <div className="space-y-1.5 text-sm text-gray-700">
                  <div className="flex justify-between"><span className="text-gray-500">Name:</span><span className="font-medium">{form.fullNameEnglish || '–'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">NIC:</span><span className="font-medium">{form.nicNo || '–'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Email:</span><span className="font-medium">{form.email || '–'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">District:</span><span className="font-medium">{form.administrativeDistrict || '–'}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Subjects:</span><span className="font-medium">{form.subjects.length > 0 ? form.subjects.length + ' selected' : '–'}</span></div>
                </div>
              </div>

              {/* Declaration */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600 italic leading-relaxed">
                I hereby declare that all the information provided in this admission form is true and correct to the best of my knowledge. I agree to follow all the rules and regulations of the institution.
              </div>

              <label className={`flex items-start gap-3 cursor-pointer p-3 rounded-xl border-2 ${errors.agreed ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                <input
                  type="checkbox"
                  checked={form.agreed}
                  onChange={e => set('agreed', e.target.checked)}
                  className="text-blue-600 rounded mt-0.5 w-4 h-4"
                />
                <span className="text-sm text-gray-700">I agree to the terms and conditions and hereby declare that all provided information is accurate.</span>
              </label>
              {errors.agreed && <p className="text-red-500 text-xs">{errors.agreed}</p>}
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
        </div>

        <div className="text-center mt-6">
          <Link to="/login" className="text-blue-200 text-sm hover:text-white transition-colors">
            Already registered? Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
}
