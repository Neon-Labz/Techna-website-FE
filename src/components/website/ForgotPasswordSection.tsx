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
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8"
      style={{
        backgroundImage: "url('/techna-promo.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="w-full max-w-md relative z-10 mt-8 sm:mt-12">
<div className="bg-white rounded-3xl shadow-2xl px-6 pb-8 pt-2 sm:px-8 sm:pb-8 sm:pt-2">
<div className="flex flex-col items-center -mt-6">
        <Image
        src="/new.png"
        alt="Techna Logo"
        width={200}
        height={200}
        priority
        className="block w-[220px] h-auto object-contain -mb-10"
      />

      <h1 className="text-[30px] font-extrabold text-slate-800 leading-9 -mt-6">
        Forgot Password
      </h1>

     <p className="mt-2 mb-5 text-center text-base font-medium text-slate-500">
       Enter your registered email to receive a reset code
      </p>
    </div>

          {sent ? (
            <div className="py-2 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-9 w-9 text-green-600" />
              </div>

              <h2 className="mb-2 text-lg font-semibold text-gray-900">
                Check your email
              </h2>

              <p className="mb-6 text-sm leading-6 text-gray-500">
                If <strong>{email}</strong> is registered, a 6-digit reset code has
                been sent to your inbox.
              </p>

              <button
                type="button"
                onClick={() =>
                  router.push(`/reset-password?email=${encodeURIComponent(email)}`)
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0183CB] to-[#34BFF3] py-3.5 font-semibold text-white shadow-lg transition-all duration-200 hover:from-[#0175B5] hover:to-[#20AEE5] hover:shadow-xl"
              >
                Enter Reset Code <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@techna.lk"
                      autoComplete="email"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0183CB] to-[#34BFF3] py-3.5 font-semibold text-white shadow-lg transition-all duration-200 hover:from-[#0175B5] hover:to-[#20AEE5] hover:shadow-xl disabled:opacity-60"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      Send Reset Code <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 border-t border-gray-100 pt-5 text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{' '}
              <Link href="/login" className="font-semibold text-blue-700 hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-4 rounded-xl bg-blue-50 p-3 text-center text-xs text-blue-700">
            Use your registered student email to reset your password
          </div>
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/45"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}