'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { getSession, studentLogin } from '../../api/auth.api';

const getApiErrorMessage = (error: unknown, fallback: string) => {
  const responseData = (error as { response?: { data?: { message?: string | string[] } } })?.response?.data;
  const message = responseData?.message;

  if (Array.isArray(message)) return message.join(', ');
  if (message) return message;
  if (error instanceof Error) return error.message;
  return fallback;
};

export default function LoginSection() {
  const router = useRouter();
  const { hasHydrated, isAuthenticated, login, student: authStudent, token } = useAuthStore();

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
      const data = await studentLogin(email.trim(), password);
      console.log('Student login response:', data);

      const accessToken =
        data?.access_token ||
        data?.token ||
        data?.data?.access_token ||
        data?.data?.token;

      if (!accessToken) {
        throw new Error('Login token not found');
      }

      const sessionResult = await getSession(accessToken);
      const isStudentObject = (value: any) =>
        value && typeof value === 'object' && !value.access_token && !value.token;

      const student =
        sessionResult?.student ||
        sessionResult?.user ||
        sessionResult?.data?.student ||
        sessionResult?.data?.user ||
        (isStudentObject(sessionResult?.data) ? sessionResult.data : undefined) ||
        (isStudentObject(sessionResult) ? sessionResult : undefined);

      if (!student) {
        throw new Error('Failed to load student session.');
      }

      console.log('Student object before login():', student);
      login(student, accessToken, rememberMe);
      router.push('/dashboard');
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('access_token');
      localStorage.removeItem('accessToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('accessToken');

      setError(getApiErrorMessage(error, 'Login failed. Please check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at center, #34BFF3 0%, #1EA6E6 50%, #0183CB 100%)',
      }}
    >
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <Image
              src="/logo.png"
              alt="Techna Logo"
              width={150}
              height={80}
              className="mx-auto mb-4 rounded-full"
            />
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your Techna LMS</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="student@techna.lk"
                  autoComplete="new-email"
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
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600"
                />
                Remember me
              </label>
                              <Link
                  href="/forgot-password"
                  className="font-medium hover:underline transition-colors"
                  style={{ color: '#0183CB' }}
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

          <div className="text-center mt-6 pt-6 border-t border-gray-100">
            <p className="text-gray-500 text-sm">
              Don&apos;t have an account?{' '}
                            <Link
                href="/register"
                className="font-semibold hover:underline transition-colors"
                style={{ color: '#0183CB' }}
              >
                Register Now
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-blue-100 text-sm hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}