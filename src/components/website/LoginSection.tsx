'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '@/api/auth.api';

const getLoginErrorMessage = (err: any) => {
  const responseData = err?.response?.data;
  const details = responseData?.error?.details;

  const detailMessage = Array.isArray(details)
    ? details
        .map((detail) => detail?.message)
        .find((message) => typeof message === 'string' && message.trim())
    : undefined;

  const responseMessage = Array.isArray(responseData?.message)
    ? responseData.message.join(', ')
    : responseData?.message;

  const message = detailMessage || responseMessage || err?.message;

  if (!message || message === 'Unauthorized') {
    return 'Invalid email/password, or your student account is not approved yet.';
  }

  return message;
};

export default function LoginSection() {
  const router = useRouter();
  const { hasHydrated, isAuthenticated, login, student: authStudent, token } =
    useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hasHydrated && isAuthenticated && authStudent && token) {
      router.replace('/dashboard');
    }
  }, [hasHydrated, isAuthenticated, router, authStudent, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { student, token } = await authApi.loginStudent(
        email.trim(),
        password,
      );

      login(student, token, rememberMe);
      router.push('/dashboard');
    } catch (err: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('accessToken');

      setError(getLoginErrorMessage(err));
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
      {/* Dark overlay so the white card stays readable over the photo */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="w-full max-w-md relative z-10 mt-8 sm:mt-12">
       <div className="bg-white rounded-3xl shadow-2xl px-4 pb-8 pt-0 sm:px-8 sm:pb-8 sm:pt-0">
  <div className="flex flex-col items-center -mt-12">
    <Image
      src="/new.png"
      alt="Techna Logo"
      width={200}
      height={200}
      className="block w-[220px] h-auto object-contain -mb-10"
    />
            <h1 className="text-[30px] font-extrabold text-slate-800 leading-9 -mt-6">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-base font-medium mt-2">
              Sign in to My Techna LMS
            </p>
          </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400"
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600"
                />
                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="text-blue-700 font-medium hover:underline"
              >
                Forgot password?
              </Link>
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
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4 pt-4 sm:mt-6 sm:pt-6 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="text-blue-700 font-semibold hover:underline"
              >
                Register Now
              </Link>
            </p>
          </div>

          <div className="mt-3 p-2 sm:mt-4 sm:p-3 bg-blue-50 rounded-xl text-xs text-blue-700 text-center">
            Use your approved student email and password to login
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