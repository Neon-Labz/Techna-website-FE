'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:4000/api';

export default function ForgotPasswordSection() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!res.ok) {
        const data = await res.json();
        const msg = data?.message ?? 'Something went wrong. Please try again.';
        setError(Array.isArray(msg) ? msg.join(' ') : msg);
        return;
      }

      setSent(true);
    } catch {
      setError('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: "url('/Back.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8">
          <div className="text-center mb-3 sm:mb-8">
            <Image
              src="/techna-logo.png"
              alt="Techna Logo"
              width={150}
              height={150}
              className="mx-auto mb-1 rounded-full"
            />

            <h1 className="text-[30px] font-extrabold text-slate-800 leading-9">
              Forgot Password
            </h1>

            <p className="text-slate-500 text-base font-medium mt-2">
              Enter your registered email to receive a reset code
            </p>
          </div>

          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-green-600" />
              </div>

              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Check your email
              </h2>

              <p className="text-gray-500 text-sm mb-6 leading-6">
                If <strong>{email}</strong> is registered, a 6-digit reset code has been sent to your inbox.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push(`/reset-password?email=${encodeURIComponent(email)}`)
                }
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#0183CB] to-[#34BFF3] hover:from-[#0175B5] hover:to-[#20AEE5] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Enter Reset Code <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@techna.lk"
                      autoComplete="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-[#0183CB] to-[#34BFF3] hover:from-[#0175B5] hover:to-[#20AEE5] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-60 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Reset Code <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="text-center mt-4 pt-4 sm:mt-6 sm:pt-6 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-700 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-3 p-2 sm:mt-4 sm:p-3 bg-blue-50 rounded-xl text-xs text-blue-700 text-center">
            Use your registered student email to reset your password
          </div>
        </div>

        <div className="text-center mt-6">
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