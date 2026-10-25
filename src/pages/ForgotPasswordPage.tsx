import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

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
          Password Recovery
        </h2>
        <p className="mt-1 text-center text-xs text-[#727A84]">
          Enter your registered institutional email to reset your credentials
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FEFEFE] py-8 px-6 shadow-sm border border-[#D6DCE0] rounded-xl sm:px-10">
          {submitted ? (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-[#287A52]/10 border border-[#287A52]/20 flex items-start gap-3 text-xs text-[#287A52]">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Reset instructions sent</p>
                  <p className="mt-1 text-[11px] text-[#287A52]/90">
                    If an active resident or staff account exists for <span className="font-bold">{email}</span>, password reset instructions and security token have been dispatched.
                  </p>
                </div>
              </div>
              <Link
                to="/login"
                className="w-full py-2.5 px-4 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-[#B54747]/10 border border-[#B54747]/20 flex items-start gap-2.5 text-xs text-[#B54747]">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ananya.rao@student.edu"
                  className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#0C1629] hover:bg-[#1A2942] text-white rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                Send Password Reset Instructions
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#727A84] hover:text-[#0C1629]"
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
  );
};
