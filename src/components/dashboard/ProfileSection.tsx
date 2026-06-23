'use client';

import { useEffect, useState } from 'react';
import {
  User,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle,
  BookOpen,
  Phone,
  MapPin,
  Lock,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { updateStudentProfile } from '../../api/students.api';
import {
  DISTRICTS,
  RACE_OPTIONS,
  RELIGION_OPTIONS,
} from '../website/RegisterSection';
import { changePassword } from '../../api/auth.api';

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const axiosError = error as {
    response?: {
      status?: number;
      data?: { message?: string | string[]; error?: string };
      config?: { url?: string; baseURL?: string };
    };
    config?: { url?: string; baseURL?: string };
  };

  const responseData = axiosError?.response?.data;
  const message = responseData?.message;
  const status = axiosError?.response?.status;
  const endpoint = `${axiosError?.response?.config?.baseURL || axiosError?.config?.baseURL || ''}${axiosError?.response?.config?.url || axiosError?.config?.url || ''}`;
  const backendMessage = Array.isArray(message) ? message.join(', ') : message;

  if (status === 403) {
    return `Profile update was rejected by the backend${endpoint ? ` (${endpoint})` : ''}: ${
      backendMessage || responseData?.error || 'Forbidden'
    }`;
  }

  if (backendMessage) return backendMessage;
  if (error instanceof Error) return error.message;
  return fallback;
};

const getUpdatedStudentData = (result: any) => {
  const candidates = [
    result?.student,
    result?.user,
    result?.profile,
    result?.data?.student,
    result?.data?.user,
    result?.data?.profile,
    result?.data?.data,
    result?.result,
    result?.data,
  ];

  return (
    candidates.find((candidate) => {
      if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
        return false;
      }

      return Boolean(
        candidate.email ||
          candidate._id ||
          candidate.studentId ||
          candidate.fullNameEnglish ||
          candidate.fullNameTamil,
      );
    }) || null
  );
};

export default function ProfileSection() {
  const { student, updateStudent } = useAuthStore();
  const studentData = student as any;

  const [activeTab, setActiveTab] = useState<
    'personal' | 'academic' | 'password'
  >('personal');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwForm, setPwForm] = useState({ old: '', newPw: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [editForm, setEditForm] = useState<any>({ ...studentData });

  const profileImage =
    studentData?.profilePhoto ||
    studentData?.avatar ||
    studentData?.profileImage ||
    '';

  useEffect(() => {
    setEditForm({ ...studentData });
  }, [studentData]);

  const inputCls = (disabled = false) =>
    `w-full px-3 py-2.5 border rounded-xl text-sm text-gray-900 ${
      disabled
        ? 'bg-gray-50 border-gray-100 text-gray-500'
        : 'bg-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
    }`;

  const handleEdit = () => {
    setEditForm({ ...studentData });
    setProfileMessage('');
    setProfileError('');
    setEditing(true);
  };

  const handleCancel = () => {
    setEditForm({ ...studentData });
    setProfileMessage('');
    setProfileError('');
    setEditing(false);
  };

  const handleSave = async () => {
    const studentId = studentData?._id || studentData?.id || studentData?.studentId;

    if (!studentId) {
      setProfileError('Profile update is not available for this session.');
      return;
    }

    const payload = {
      fullNameEnglish: editForm.fullNameEnglish,
      fullNameTamil: editForm.fullNameTamil,
      dateOfBirth: editForm.dateOfBirth,
      dob: editForm.dob,
      nicNo: editForm.nicNo,
      whatsappNo: editForm.whatsappNo,
      parentsNo: editForm.parentsNo,
      school: editForm.school,
      address: editForm.address,
      permanentAddress: editForm.permanentAddress,
      administrativeDistrict: editForm.administrativeDistrict,
      race: editForm.race,
      religion: editForm.religion,
      citizenByDescent: editForm.citizenByDescent,
      fatherName: editForm.fatherName,
      motherName: editForm.motherName,
      guardianName: editForm.guardianName,
    };

    setSaving(true);
    setProfileMessage('');
    setProfileError('');

    try {
      const result = await updateStudentProfile(studentId, payload);
      const updatedStudent = getUpdatedStudentData(result);
      const mergedStudent = { ...studentData, ...payload, ...(updatedStudent || {}) };

      updateStudent(mergedStudent);
      setEditForm(mergedStudent);
      setEditing(false);
      setSaved(true);
      setProfileMessage('Profile updated successfully.');
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setProfileError(
        getApiErrorMessage(error, 'Unable to update profile. Please try again.'),
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwMsg('');
    setPwError('');

    if (!pwForm.old || !pwForm.newPw || !pwForm.confirm) {
      setPwError('Please fill all fields.');
      return;
    }

    if (pwForm.newPw !== pwForm.confirm) {
      setPwError('New passwords do not match.');
      return;
    }

    if (pwForm.newPw.length < 6) {
      setPwError('Password must be at least 6 characters.');
      return;
    }

    setPwSaving(true);
    try {
      await changePassword(pwForm.old, pwForm.newPw);
      setPwMsg('Password changed successfully!');
      setPwForm({ old: '', newPw: '', confirm: '' });
      setTimeout(() => setPwMsg(''), 4000);
    } catch (error) {
      setPwError(getApiErrorMessage(error, 'Failed to change password. Please try again.'));
    } finally {
      setPwSaving(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'academic', label: 'Academic Info', icon: BookOpen },
    { id: 'password', label: 'Change Password', icon: Lock },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0183CB] to-[#34BFF3] rounded-3xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-xl">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={studentData?.fullNameEnglish || 'Profile photo'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-12 h-12 text-[#34BFF3]" />
                </div>
              )}
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold">
              {studentData?.fullNameEnglish || 'Student'}
            </h1>
            <p className="text-blue-300 text-sm mt-1">
              {studentData?.fullNameTamil || ''}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
                {studentData?.studentId ||
                  studentData?.admissionNumber ||
                  studentData?.id ||
                  '-'}
              </span>
              <span className="px-3 py-1 bg-white border border-[#34BFF3] text-[#34BFF3] rounded-full text-xs font-medium">
                Active Student
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">
                {studentData?.email || '-'}
              </span>
            </div>
          </div>

          {saved && (
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 px-4 py-2 rounded-xl text-sm">
              <CheckCircle className="w-4 h-4" /> Saved!
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#34BFF3] text-white shadow-md'
                  : 'bg-white text-[#4A5565] border border-[#E5E7EB] hover:border-[#34BFF3]'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'personal' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 text-lg">
              Personal Information
            </h2>

            {!editing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-[#34BFF3] rounded-xl hover:bg-blue-100 font-medium"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-900 text-white rounded-xl hover:bg-blue-800 disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />{' '}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          {(profileMessage || profileError) && (
            <div
              className={`mb-5 rounded-xl px-4 py-3 text-sm ${
                profileError
                  ? 'bg-red-50 text-red-700 border border-red-100'
                  : 'bg-green-50 text-green-700 border border-green-100'
              }`}
            >
              {profileError || profileMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Full Name (English)"
              value={editing ? editForm?.fullNameEnglish : studentData?.fullNameEnglish}
              disabled={!editing}
              onChange={(v) =>
                setEditForm((f: any) => ({ ...f, fullNameEnglish: v }))
              }
              inputCls={inputCls}
            />
            <Input
              label="Full Name (Tamil)"
              value={editing ? editForm?.fullNameTamil : studentData?.fullNameTamil}
              disabled={!editing}
              onChange={(v) =>
                setEditForm((f: any) => ({ ...f, fullNameTamil: v }))
              }
              inputCls={inputCls}
            />
            <Input
              label="Date of Birth"
              value={
                editing
                  ? editForm?.dateOfBirth || editForm?.dob
                  : studentData?.dateOfBirth || studentData?.dob
              }
              disabled={!editing}
              onChange={(v) =>
                setEditForm((f: any) => ({ ...f, dateOfBirth: v }))
              }
              inputCls={inputCls}
            />
            <Input
              label="NIC Number"
              value={editing ? editForm?.nicNo : studentData?.nicNo}
              disabled={!editing}
              onChange={(v) => setEditForm((f: any) => ({ ...f, nicNo: v }))}
              inputCls={inputCls}
            />
            <Input
              label="Email Address"
              value={studentData?.email}
              disabled
              inputCls={inputCls}
            />
            <Input
              label="WhatsApp No."
              value={editing ? editForm?.whatsappNo : studentData?.whatsappNo}
              disabled={!editing}
              onChange={(v) =>
                setEditForm((f: any) => ({ ...f, whatsappNo: v }))
              }
              inputCls={inputCls}
            />
            <Input
              label="Parent's No."
              value={editing ? editForm?.parentsNo : studentData?.parentsNo}
              disabled={!editing}
              onChange={(v) =>
                setEditForm((f: any) => ({ ...f, parentsNo: v }))
              }
              inputCls={inputCls}
            />
            <Input
              label="School"
              value={editing ? editForm?.school : studentData?.school}
              disabled={!editing}
              onChange={(v) => setEditForm((f: any) => ({ ...f, school: v }))}
              inputCls={inputCls}
            />

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Address
              </label>
              <textarea
                value={editing ? editForm?.address || '' : studentData?.address || ''}
                onChange={(e) =>
                  setEditForm((f: any) => ({ ...f, address: e.target.value }))
                }
                disabled={!editing}
                rows={2}
                className={inputCls(!editing) + ' resize-none'}
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-[#34BFF3]" /> Residence Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Permanent Address"
                value={
                  editing
                    ? editForm?.permanentAddress
                    : studentData?.permanentAddress
                }
                disabled={!editing}
                onChange={(v) =>
                  setEditForm((f: any) => ({ ...f, permanentAddress: v }))
                }
                inputCls={inputCls}
                className="md:col-span-2"
              />

              {editing ? (
                <SelectInput
                  label="District"
                  value={editForm?.administrativeDistrict}
                  options={DISTRICTS}
                  placeholder="Select District"
                  onChange={(v) =>
                    setEditForm((f: any) => ({
                      ...f,
                      administrativeDistrict: v,
                    }))
                  }
                  inputCls={inputCls}
                />
              ) : (
                <Input
                  label="District"
                  value={studentData?.administrativeDistrict}
                  disabled
                  inputCls={inputCls}
                />
              )}

              {editing ? (
                <SelectInput
                  label="Race"
                  value={editForm?.race}
                  options={RACE_OPTIONS}
                  placeholder="Select Race"
                  onChange={(v) => setEditForm((f: any) => ({ ...f, race: v }))}
                  inputCls={inputCls}
                />
              ) : (
                <Input
                  label="Race"
                  value={studentData?.race}
                  disabled
                  inputCls={inputCls}
                />
              )}

              {editing ? (
                <SelectInput
                  label="Religion"
                  value={editForm?.religion}
                  options={RELIGION_OPTIONS}
                  placeholder="Select Religion"
                  onChange={(v) =>
                    setEditForm((f: any) => ({ ...f, religion: v }))
                  }
                  inputCls={inputCls}
                />
              ) : (
                <Input
                  label="Religion"
                  value={studentData?.religion}
                  disabled
                  inputCls={inputCls}
                />
              )}

              <Input
                label="Citizen by Descent"
                value={
                  editing
                    ? editForm?.citizenByDescent
                    : studentData?.citizenByDescent
                }
                disabled={!editing}
                onChange={(v) =>
                  setEditForm((f: any) => ({ ...f, citizenByDescent: v }))
                }
                inputCls={inputCls}
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-[#34BFF3]" /> Parent / Guardian Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Father's Name"
                value={editing ? editForm?.fatherName : studentData?.fatherName}
                disabled={!editing}
                onChange={(v) =>
                  setEditForm((f: any) => ({ ...f, fatherName: v }))
                }
                inputCls={inputCls}
              />
              <Input
                label="Mother's Name"
                value={editing ? editForm?.motherName : studentData?.motherName}
                disabled={!editing}
                onChange={(v) =>
                  setEditForm((f: any) => ({ ...f, motherName: v }))
                }
                inputCls={inputCls}
              />
              <Input
                label="Guardian's Name"
                value={editing ? editForm?.guardianName : studentData?.guardianName}
                disabled={!editing}
                onChange={(v) =>
                  setEditForm((f: any) => ({ ...f, guardianName: v }))
                }
                inputCls={inputCls}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-6">
            Academic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <Input
              label="Student ID"
              value={studentData?.studentId}
              disabled
              inputCls={inputCls}
            />
            <Input
              label="Admission Number"
              value={studentData?.admissionNumber}
              disabled
              inputCls={inputCls}
            />
            <Input
              label="Batch"
              value={
                studentData?.batch ||
                studentData?.batchName ||
                studentData?.enrolledBatch ||
                studentData?.currentBatch ||
                '-'
              }
              disabled
              inputCls={inputCls}
            />
          </div>
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">
              Enrolled Subjects
            </h3>
            <div className="flex flex-wrap gap-2">
              {(studentData?.subjects || studentData?.modules || []).map(
                (sub: string) => (
                  <span
                    key={sub}
                    className="px-3 py-1.5 bg-blue-50 text-[#34BFF3] text-sm font-medium rounded-xl border border-blue-100"
                  >
                    {sub}
                  </span>
                ),
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">
              G.C.E. (O/L) Results
            </h3>

            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                <div>
                  <span className="font-medium text-gray-700">Category:</span>{' '}
                  {studentData?.olCategory || '-'}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Year:</span>{' '}
                  {studentData?.olYear || '-'}
                </div>
                <div>
                  <span className="font-medium text-gray-700">Index:</span>{' '}
                  {studentData?.olIndexNumber || '-'}
                </div>
              </div>

              <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2">English</th>
                      <th className="py-2">Maths</th>
                      <th className="py-2">Science</th>
                      <th className="py-2">Sinhala</th>
                      <th className="py-2">Tamil</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(studentData?.olResults || []).map((r: any, i: number) => (
                      <tr
                        key={i}
                        className="border-t border-gray-200 text-gray-800"
                      >
                        <td className="py-2">{r.english || '-'}</td>
                        <td className="py-2">{r.mathematics || '-'}</td>
                        <td className="py-2">{r.science || '-'}</td>
                        <td className="py-2">{r.sinhala || '-'}</td>
                        <td className="py-2">{r.tamil || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!studentData?.olResults?.length && (
                  <p className="text-sm text-gray-500">
                    No O/L results available.
                  </p>
                )}
              </div>
            </div>
          </div>
         
        </div>
      )}

      {activeTab === 'password' && (
        <div className="bg-white rounded-2xl shadow-sm border border-[#F3F4F6] p-6 max-w-[448px]">
          <h2 className="font-bold text-[#101828] text-lg">Change Password</h2>
          <p className="text-sm text-[#6A7282] mt-1 mb-0">
            Choose a strong password to keep your account secure.
          </p>

          <div className="flex flex-col gap-4 pt-4">
            {[
              { key: 'old', label: 'Current Password', placeholder: 'Enter current password', show: showOld, setShow: setShowOld },
              { key: 'newPw', label: 'New Password', placeholder: 'Enter new password', show: showNew, setShow: setShowNew },
              { key: 'confirm', label: 'Confirm New Password', placeholder: 'Confirm new password', show: showConfirm, setShow: setShowConfirm },
            ].map(item => (
              <div key={item.key} className="flex flex-col gap-1.5">
                <label className="block text-sm font-medium text-[#364153]">
                  {item.label}
                </label>
                <div className="relative">
                  <input
                    type={item.show ? 'text' : 'password'}
                    value={(pwForm as any)[item.key]}
                    onChange={e => setPwForm(f => ({ ...f, [item.key]: e.target.value }))}
                    placeholder={item.placeholder}
                    className="w-full px-3 py-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm text-gray-900 placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-[#34BFF3] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => item.setShow(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#99A1AF]"
                  >
                    {item.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}

            {pwMsg && <p className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">{pwMsg}</p>}
            {pwError && <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{pwError}</p>}

            <button
              onClick={handlePasswordChange}
              disabled={pwSaving}
              className="w-full py-3 bg-gradient-to-r from-[#0183CB] to-[#34BFF3] text-white rounded-xl text-sm font-semibold shadow-md hover:opacity-90 disabled:opacity-60 transition-all"
            >
              {pwSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  disabled,
  onChange,
  inputCls,
  className = '',
}: {
  label: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  inputCls: (disabled?: boolean) => string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        value={value || ''}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className={inputCls(disabled)}
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  placeholder,
  onChange,
  inputCls,
}: {
  label: string;
  value?: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  inputCls: (disabled?: boolean) => string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls(false)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
