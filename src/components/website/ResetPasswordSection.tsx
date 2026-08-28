'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, KeyRound, CheckCircle } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:4000/api';

export default function ResetPasswordSection() {
  const router = useRouter();
  const params = useSearchParams();
  const emailHint = params?.get('email') ?? '';

  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim() || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (token.trim().length !== 6 || !/^\d{6}$/.test(token.trim())) {
      setError('Reset code must be a 6-digit number.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim(), newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.message ?? 'Reset failed. Please try again.';
        setError(Array.isArray(msg) ? msg.join(' ') : msg);
        return;
      }

      setSuccess(true);
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6 sm:py-8 relative"
      style={{
        backgroundImage: "url('/techna-promo.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay so the white card stays readable over the photo */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="w-full max-w-[480px] sm:max-w-xl relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl px-4 pb-5 pt-4 sm:px-10 sm:pb-6 sm:pt-5">
          <div className="flex flex-col items-center">
            <Image
              src="/new.png"
              alt="Techna Logo"
              width={200}
              height={200}
              className="block w-[190px] h-[145px] sm:w-[230px] sm:h-[175px] object-contain -mb-2"
            />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-tight text-center">
              Reset Password
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1.5 text-center px-2">
              {emailHint ? (
                <>
                  Enter the 6-digit code sent to{' '}
                  <span className="font-semibold text-slate-700">{emailHint}</span>
                </>
              ) : (
                'Enter the 6-digit code from your email'
              )}
            </p>
          </div>

          {success ? (
            <div className="text-center py-2">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1.5">Password Reset!</h2>
              <p className="text-gray-500 text-sm mb-4">
                Your password has been updated. You can now sign in with your new password.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#0183CB] to-[#34BFF3] hover:from-[#0175B5] hover:to-[#20AEE5] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm mb-3.5 mt-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 mt-3.5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    6-Digit Reset Code
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={token}
                      onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400 tracking-widest font-mono text-center text-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      className="w-full pl-4 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your new password"
                    autoComplete="new-password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#0183CB] to-[#34BFF3] hover:from-[#0175B5] hover:to-[#20AEE5] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-60 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                <Link href="/forgot-password" className="text-blue-700 text-sm font-medium hover:underline">
                  Didn&apos;t receive a code? Resend
                </Link>
              </div>
            </>
          )}

          <div className="text-center mt-3 pt-3 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-700 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          {/* {!success && (
            <div className="mt-3 p-2 bg-blue-50 rounded-xl text-xs text-blue-700 text-center">
              Check your inbox for the 6-digit code we sent you
            </div>
          )} */}
        </div>

        <div className="text-center mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white text-sm font-medium bg-black/30 hover:bg-black/45 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}