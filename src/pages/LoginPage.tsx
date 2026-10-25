import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { SEED_PROFILES } from '../services/seedData';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isDemoMode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    <div className="min-h-screen bg-[#F0F3F3] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#0C1629] flex items-center justify-center text-white">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0C1629]">HostelEase</span>
          </Link>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-[#0C1629]">
          Sign in to your account
        </h2>
        <p className="mt-1 text-center text-xs text-[#727A84]">
          Access student records, room allocations, leaves, or daily operations
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FEFEFE] py-8 px-6 shadow-sm border border-[#D6DCE0] rounded-xl sm:px-10">
          {errorMessage && (
            <div className="mb-5 p-3 rounded-md bg-[#B54747]/10 border border-[#B54747]/20 flex items-start gap-2.5 text-xs text-[#B54747]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. admin@hostelease.edu"
                className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629] focus:ring-1 focus:ring-[#0C1629] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#0C1629]">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-medium text-[#356B9A] hover:underline"
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
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 pr-10 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629] focus:ring-1 focus:ring-[#0C1629] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-[#727A84] hover:text-[#0C1629]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-[#0C1629] hover:bg-[#1A2942] disabled:opacity-50 text-white rounded-md text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Panel */}
          {isDemoMode && (
            <div className="mt-6 pt-5 border-t border-[#D6DCE0]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#0C1629] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#287A52]" />
                  Demo Accounts
                </span>
                <span className="text-[10px] text-[#727A84]">Click to auto-fill</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-left">
                {SEED_PROFILES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleFillDemo(p.email)}
                    className="p-2 rounded bg-[#F0F3F3] hover:bg-[#D6DCE0]/60 border border-[#D6DCE0] transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[11px] text-[#0C1629] capitalize">{p.role}</span>
                      {email === p.email && <Check className="w-3 h-3 text-[#287A52]" />}
                    </div>
                    <span className="text-[10px] text-[#727A84] block truncate">{p.full_name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 text-center text-xs text-[#727A84]">
            New resident student?{' '}
            <Link to="/register" className="font-semibold text-[#0C1629] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
