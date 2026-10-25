import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid registered email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* LEFT COLUMN: Logo & Info */}
        <div className="lg:col-span-5 space-y-6">
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
              Password Recovery
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#475569] leading-relaxed">
              Enter your registered university email address to receive password reset instructions
              and a temporary access credential.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs text-xs text-[#64748B] space-y-2">
            <p className="font-semibold text-[#0C1629]">Need emergency help?</p>
            <p>
              If you are locked out of your room or cannot access your resident dashboard during check-in,
              visit the hostel administration office or contact <span className="font-semibold text-[#2563EB]">hostel@staynest.edu</span>.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: Recovery Form (Shifted right) */}
        <div className="lg:col-span-7 flex justify-end">
          <div className="w-full max-w-md lg:ml-auto bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-[#E2E8F0]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[#0C1629]">Reset Password</h2>
              <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
                We will send reset instructions to your inbox.
              </p>
            </div>

            {submitted ? (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Reset instructions sent</p>
                    <p className="mt-1 text-[11px] text-emerald-700 leading-relaxed">
                      If an active resident or staff account exists for <span className="font-semibold">{email}</span>,
                      password recovery instructions have been dispatched.
                    </p>
                  </div>
                </div>
                <Link
                  to="/login"
                  className="w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-600 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1.5">
                    Institutional Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@staynest.edu"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
                  >
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] text-center">
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-[#64748B] hover:text-[#0C1629] inline-flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
