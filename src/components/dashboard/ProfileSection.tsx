'use client';
import { useState } from 'react';
import { User, Edit2, Save, X, Eye, EyeOff, Camera, CheckCircle, BookOpen, Phone, MapPin, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function ProfileSection() {
  const { student, updateStudent } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'password'>('personal');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwForm, setPwForm] = useState({ old: '', newPw: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');
  const [editForm, setEditForm] = useState({ ...student });

  const inputCls = (disabled = false) => `w-full px-3 py-2.5 border rounded-xl text-sm text-gray-900 ${disabled ? 'bg-gray-50 border-gray-100 text-gray-500' : 'bg-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500'}`;

  const handleSave = () => {
    if (editForm && student) {
      updateStudent({ ...student, ...editForm as typeof student });
    }
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePasswordChange = () => {
    if (!pwForm.old || !pwForm.newPw || !pwForm.confirm) {
      setPwMsg('Please fill all fields.'); return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      setPwMsg('New passwords do not match.'); return;
    }
    if (pwForm.newPw.length < 6) {
      setPwMsg('Password must be at least 6 characters.'); return;
    }
    setPwMsg('Password updated successfully!');
    setPwForm({ old: '', newPw: '', confirm: '' });
    setTimeout(() => setPwMsg(''), 3000);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'academic', label: 'Academic Info', icon: BookOpen },
    { id: 'password', label: 'Change Password', icon: Lock },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-950 to-blue-800 rounded-3xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-xl">
              <User className="w-12 h-12 text-blue-900" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-all">
              <Camera className="w-4 h-4 text-blue-900" />
            </button>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold">{student?.fullNameEnglish}</h1>
            <p className="text-blue-300 text-sm mt-1">{student?.fullNameTamil}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">{student?.studentId || '-'}</span>
              <span className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 rounded-full text-xs font-medium">Active Student</span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">{student?.email}</span>
            </div>
          </div>
          <div className="shrink-0">
            {saved && (
              <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 px-4 py-2 rounded-xl text-sm">
                <CheckCircle className="w-4 h-4" /> Saved!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-blue-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Personal Details Tab */}
      {activeTab === 'personal' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 text-lg">Personal Information</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 font-medium transition-all">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Full Name (English)</label>
              <input value={editing ? (editForm?.fullNameEnglish || '') : (student?.fullNameEnglish || '')} onChange={e => setEditForm(f => ({ ...f!, fullNameEnglish: e.target.value }))} disabled={!editing} className={inputCls(!editing)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Full Name (Tamil)</label>
              <input value={editing ? (editForm?.fullNameTamil || '') : (student?.fullNameTamil || '')} onChange={e => setEditForm(f => ({ ...f!, fullNameTamil: e.target.value }))} disabled={!editing} className={inputCls(!editing)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Date of Birth</label>
              <input value={student?.dateOfBirth || ''} disabled className={inputCls(true)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">NIC Number</label>
              <input value={student?.nicNo || ''} disabled className={inputCls(true)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input value={student?.email || ''} disabled className={inputCls(true)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">WhatsApp No.</label>
              <input value={editing ? (editForm?.whatsappNo || '') : (student?.whatsappNo || '')} onChange={e => setEditForm(f => ({ ...f!, whatsappNo: e.target.value }))} disabled={!editing} className={inputCls(!editing)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Parent's No.</label>
              <input value={editing ? (editForm?.parentsNo || '') : (student?.parentsNo || '')} onChange={e => setEditForm(f => ({ ...f!, parentsNo: e.target.value }))} disabled={!editing} className={inputCls(!editing)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">School</label>
              <input value={editing ? (editForm?.school || '') : (student?.school || '')} onChange={e => setEditForm(f => ({ ...f!, school: e.target.value }))} disabled={!editing} className={inputCls(!editing)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Address</label>
              <textarea value={editing ? (editForm?.address || '') : (student?.address || '')} onChange={e => setEditForm(f => ({ ...f!, address: e.target.value }))} disabled={!editing} rows={2} className={inputCls(!editing) + ' resize-none'} />
            </div>
          </div>

          {/* Residence Details */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-600" /> Residence Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Permanent Address</label>
                <input value={student?.permanentAddress || ''} disabled className={inputCls(true)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">District</label>
                <input value={student?.administrativeDistrict || ''} disabled className={inputCls(true)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Race</label>
                <input value={student?.race || ''} disabled className={inputCls(true)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Religion</label>
                <input value={student?.religion || ''} disabled className={inputCls(true)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Citizen by Descent</label>
                <input value={student?.citizenByDescent || ''} disabled className={inputCls(true)} />
              </div>
            </div>
          </div>

          {/* Parent Details */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-blue-600" /> Parent / Guardian Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Father's Name</label>
                <input value={student?.fatherName || ''} disabled className={inputCls(true)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Mother's Name</label>
                <input value={student?.motherName || ''} disabled className={inputCls(true)} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Guardian's Name</label>
                <input value={student?.guardianName || ''} disabled className={inputCls(true)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Academic Tab */}
      {activeTab === 'academic' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-6">Academic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-800 uppercase tracking-wider mb-1.5">
              Admission Number              </label>
              <input value={student?.studentId || ''} disabled className={inputCls(true)} />
            </div>
           
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Enrolled Subjects</h3>
            <div className="flex flex-wrap gap-2">
              {student?.subjects.map(sub => (
                <span key={sub} className="px-3 py-1.5 bg-blue-50 text-blue-800 text-sm font-medium rounded-xl border border-blue-100">{sub}</span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">G.C.E. (O/L) Results</h3>
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 grid grid-cols-3 gap-4 text-xs text-gray-500">
                <div><span className="font-medium text-gray-700">Category:</span> {student?.olCategory}</div>
                <div><span className="font-medium text-gray-700">Year:</span> {student?.olYear}</div>
                <div><span className="font-medium text-gray-700">Index No.:</span> {student?.olIndexNumber}</div>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-3"><span className="font-medium text-gray-700">Name used:</span> {student?.olNameUsed}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        {['Year', 'Index No.', 'English', 'Mathematics', 'Science', 'Sinhala', 'Tamil'].map(h => (
                          <th key={h} className="text-left py-2 pr-4 font-semibold text-gray-600">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {student?.olResults.map((r, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 pr-4 text-gray-700">{r.year}</td>
                          <td className="py-2 pr-4 text-gray-700">{r.indexNumber}</td>
                          {[r.english, r.mathematics, r.science, r.sinhala, r.tamil].map((g, gi) => (
                            <td key={gi} className="py-2 pr-4">
                              <span className={`px-2 py-0.5 rounded-md font-semibold ${g === 'A+' || g === 'A' ? 'bg-green-100 text-green-700' : g === 'B+' || g === 'B' ? 'bg-blue-100 text-blue-700' : g ? 'bg-yellow-100 text-yellow-700' : 'text-gray-300'}`}>{g || '–'}</span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-md">
          <h2 className="font-bold text-gray-900 text-lg mb-2">Change Password</h2>
          <p className="text-gray-500 text-sm mb-6">Choose a strong password to keep your account secure.</p>

          {pwMsg && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm mb-5 ${pwMsg.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {pwMsg.includes('success') ? <CheckCircle className="w-4 h-4" /> : null}
              {pwMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
              <div className="relative">
                <input type={showOld ? 'text' : 'password'} value={pwForm.old} onChange={e => setPwForm(f => ({ ...f, old: e.target.value }))} placeholder="Enter current password" className="w-full pr-10 px-3 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} value={pwForm.newPw} onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))} placeholder="Enter new password" className="w-full pr-10 px-3 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Confirm new password" className="w-full pr-10 px-3 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button onClick={handlePasswordChange} className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl transition-all shadow-md text-sm">
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
