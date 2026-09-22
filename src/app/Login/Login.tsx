'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { addUserToSaved } from '@/lib/SavedUser';

export default function Login() {
  const [RegNo, setRegNo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        RegNo: RegNo.trim(),
        redirect: false,
      });

      if (res?.ok) {
        const user = await fetch('/api/auth/me').then((r) => r.json());
        if (user?.role === 'student') {
          addUserToSaved({
            RegNo: user.RegNo,
            name: user.name,
            avatarUrl: user.avatarUrl,
          });
        }
        router.push('/Redirecting');
      } else {
        setError('Invalid Registration Number');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Branding Panel */}
      <aside className="relative hidden w-[44%] shrink-0 flex-col overflow-hidden bg-[#8c6be8] px-14 py-10 text-white md:flex lg:w-[42%]">
        <div className="mb-auto">
          <div className="flex items-center gap-2.5 text-[28px] font-extrabold tracking-tight">
          <img
            src="/images/logo.png"
            alt="StarSeed"
            className="w-10 h-10 object-contain"
          />
          <span className="text-[28px] font-extrabold tracking-tight">
            StarSeed
          </span>
          </div>
        </div>

        <div className="my-auto w-full max-w-[460px]">
          <h1 className="my-6 text-[clamp(40px,5vw,64px)] font-bold leading-[0.98] tracking-tight">
            Welcome
            <br />
            back<span className="text-white/70">.</span>
          </h1>
          <p className="text-[17px] leading-relaxed text-white/70">
            Sign in to access your school dashboard and stay on top of your academics.
          </p>

          <div className="mt-12 space-y-4">
            <div className="relative w-[92%] -rotate-2 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-sm font-bold">
                  A
                </span>
                <div>
                  <strong className="text-sm font-bold">Admin</strong>
                  <p className="mt-1 text-sm text-white/70">Manage your entire school system.</p>
                </div>
              </div>
            </div>
            <div className="relative ml-8 w-[92%] rotate-2 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex items-start gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-sm font-bold">
                  T
                </span>
                <div>
                  <strong className="text-sm font-bold">Teacher</strong>
                  <p className="mt-1 text-sm text-white/70">Track courses and student progress.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Form Panel */}
      <section className="flex min-w-0 flex-1 flex-col px-12 max-[580px]:px-6">
        <div className="flex w-full items-center justify-between py-8 text-[13px] text-gray-400 max-[580px]:py-5">
          <a href="/" className="flex items-center gap-1.5 transition-colors hover:text-gray-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back to home
          </a>
          <span>
            New here?{' '}
            <a href="/" className="font-semibold text-[#8c6be8] transition-colors hover:text-[#7555d0]">
              Get started
            </a>
          </span>
        </div>

        <div className="my-auto w-full max-w-[420px] py-10 max-[580px]:max-w-none">
          <div className="mb-10">
            <h2 className="text-[40px] font-semibold leading-tight tracking-tight text-gray-900">
              Sign in
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-500">
              Enter your registration number to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-[14px] text-red-700">
                {error}
              </div>
            )}

            <div className="flex flex-col">
              <label className="mb-2.5 text-[15px] font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                required
                value={RegNo}
                onChange={(e) => setRegNo(e.target.value)}
                placeholder="e.g. STD/2024/001"
                className="h-[50px] w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-[15px] text-gray-900 outline-none transition-[border-color,box-shadow] placeholder:text-gray-400 focus:border-[#8c6be8] focus:shadow-[0_0_0_3px_rgba(140,107,232,0.12)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex min-h-[50px] items-center justify-center gap-2 rounded-xl bg-[#8c6be8] px-6 text-[15px] font-semibold text-white transition-all hover:bg-[#7555d0] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6C9 6 15 10.4189 15 12C15 13.5812 9 18 9 18" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6 text-center text-[13px] text-gray-400">
            All rights reserved &copy; {new Date().getFullYear()} StarSeed
          </div>
        </div>
      </section>
    </div>
  );
}
