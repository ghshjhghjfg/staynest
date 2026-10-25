import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { SEED_PROFILES } from '../services/seedData';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isDemoMode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill from query param if available (e.g., ?role=student or ?role=admin)
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'student') {
      setEmail('student@staynest.edu');
      setPassword('demo1234');
    } else if (roleParam === 'admin') {
      setEmail('admin@staynest.edu');
      setPassword('demo1234');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo1234');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* LEFT COLUMN: Login Logo, Brand Branding & Campus Info */}
        <div className="lg:col-span-6 space-y-6">
          {/* Logo Badge */}
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl bg-[#2563EB] flex items-center justify-center text-white shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-3xl font-extrabold tracking-tight text-[#0C1629] block">
                staynest
              </span>
              <span className="text-[11px] font-bold text-[#2563EB] tracking-wider uppercase">
                Campus living, connected
              </span>
            </div>
          </Link>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0C1629] tracking-tight leading-tight">
              Welcome back to your residence portal
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#475569] leading-relaxed">
              Sign in to manage your room allocation, inspect mess menus, submit out-pass leaves,
              and track fee payments in one centralized system.
            </p>
          </div>

          {/* Campus Visual Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#E2E8F0] aspect-[16/9] hidden sm:block">
            <img
              src="/hero-building.jpg"
              alt="staynest Campus Residence"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <div className="text-white">
                <p className="text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#60A5FA]" />
                  <span>Ashoka Residence Block · 24/7 Campus Security</span>
                </p>
                <p className="text-[11px] text-[#CBD5E1]">
                  Official University Residence Welfare & Operations
                </p>
              </div>
            </div>
          </div>

          {/* Demo Credentials Quick-Filler (Demo Mode) */}
          {isDemoMode && (
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#0C1629]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>1-Click Demo Accounts:</span>
                </span>
                <span className="text-[11px] text-[#64748B]">Password: demo1234</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SEED_PROFILES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleFillDemo(p.email)}
                    className={`px-3 py-2 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                      email.toLowerCase() === p.email.toLowerCase()
                        ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-bold shadow-2xs'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#0F172A]'
                    }`}
                  >
                    <div className="font-semibold capitalize flex items-center justify-between">
                      <span>{p.role}</span>
                      {email.toLowerCase() === p.email.toLowerCase() && (
                        <Check className="w-3 h-3 text-[#2563EB]" />
                      )}
                    </div>
                    <div className="text-[10px] text-[#64748B] truncate">{p.email}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Login Form (Slightly shifted to right) */}
        <div className="lg:col-span-6 flex justify-end">
          <div className="w-full max-w-md lg:ml-auto bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-[#E2E8F0]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[#0C1629]">Sign In</h2>
              <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
                Enter your university email and password below.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-600 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0C1629] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. admin@staynest.edu"
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#0C1629]">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-[#2563EB] hover:underline font-semibold"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0C1629] p-0.5 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#93C5FD] text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Verifying session...</span>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E2E8F0] text-center">
              <p className="text-xs text-[#64748B]">
                New student resident?{' '}
                <Link
                  to="/register"
                  className="font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1"
                >
                  Register here <ArrowRight className="w-3 h-3" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
