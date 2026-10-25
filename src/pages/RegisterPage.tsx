import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  BedDouble,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerStudent } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [studentCode, setStudentCode] = useState('');
  const [department, setDepartment] = useState('Computer Science & Eng');
  const [academicYear, setAcademicYear] = useState('1st Year');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!fullName.trim()) return setErrorMessage('Full Name is required.');
    if (!email.trim() || !email.includes('@')) return setErrorMessage('A valid email address is required.');
    if (password.length < 6) return setErrorMessage('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setErrorMessage('Passwords do not match.');
    if (!studentCode.trim()) return setErrorMessage('Student ID / Roll Number is required.');
    if (!phone.trim()) return setErrorMessage('Phone number is required.');
    if (!guardianName.trim()) return setErrorMessage('Guardian name is required.');
    if (!guardianPhone.trim()) return setErrorMessage('Guardian phone number is required.');
    if (!emergencyContact.trim()) return setErrorMessage('Emergency contact number is required.');

    setLoading(true);
    const result = await registerStudent({
      fullName,
      email,
      password,
      phone,
      studentCode,
      department,
      academicYear,
      gender,
      guardianName,
      guardianPhone,
      emergencyContact,
    });
    setLoading(false);

    if (result.success) {
      setSuccessNotice(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setErrorMessage(result.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* LEFT COLUMN: Registration Logo, Brand Branding & Onboarding Preview */}
        <div className="lg:col-span-5 space-y-6 pt-2 lg:sticky lg:top-8">
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
              Begin your resident journey with staynest
            </h1>
            <p className="mt-3 text-sm sm:text-base text-[#475569] leading-relaxed">
              Create your verified student resident account. Once registered, your application is
              reviewed for room and bed allocation across our modern campus residence blocks.
            </p>
          </div>

          {/* 3-Step Journey Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#2563EB] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>How your room allocation works</span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0C1629]">Create student profile</p>
                  <p className="text-[11px] text-[#64748B]">Fill in your student roll number and emergency contacts.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0C1629]">Warden room review</p>
                  <p className="text-[11px] text-[#64748B]">Beds are allocated based on year and wing availability.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#2563EB] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0C1629]">Move in & connect</p>
                  <p className="text-[11px] text-[#64748B]">View room details, weekly meals, and download fee vouchers.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Room Visual Card */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0] aspect-[16/9] hidden sm:block">
            <img
              src="/dorm-room.jpg"
              alt="Triple-Sharing Dormitory"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-[#60A5FA]" />
                <span>Comfortable Triple-Sharing Spaces · Wi-Fi & Study Desks</span>
              </p>
            </div>
          </div>

          {/* Security Banner */}
          <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center gap-3 text-xs text-[#1E3A8A]">
            <ShieldCheck className="w-5 h-5 text-[#2563EB] shrink-0" />
            <div>
              <span className="font-bold">Role-Secured Registration: </span>
              <span className="text-[#3B82F6]">
                New sign-ups automatically receive verified Student Resident status.
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Registration Form (Slightly shifted to right) */}
        <div className="lg:col-span-7 flex justify-end">
          <div className="w-full max-w-xl lg:ml-auto bg-white py-8 px-6 sm:px-10 rounded-3xl shadow-xl border border-[#E2E8F0]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-[#0C1629]">
                Student Registration
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#64748B]">
                Fill in your details below to create your campus residence account.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-600 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successNotice && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Account registered successfully! Redirecting to your dashboard...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Maya Patel"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                    Student ID / Roll No *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    placeholder="e.g. SN-2024-089"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                    Department *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  >
                    <option value="Computer Science & Eng">Computer Science & Eng</option>
                    <option value="Electronics & Comm">Electronics & Comm</option>
                    <option value="Mechanical Eng">Mechanical Eng</option>
                    <option value="Civil Eng">Civil Eng</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Management Studies">Management Studies</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                    Academic Year *
                  </label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                    Student Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                    University Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@staynest.edu"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                    Password (min 6 characters) *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  />
                </div>
              </div>

              {/* Guardian Info */}
              <div className="pt-2 border-t border-[#E2E8F0]">
                <h3 className="text-xs font-bold text-[#0C1629] mb-2 uppercase tracking-wide">
                  Parent / Guardian & Emergency Verification
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                      Guardian Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                      Guardian Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      placeholder="+91 94444 12345"
                      className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0C1629] mb-1">
                      Emergency Contact Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="+91 98888 56789"
                      className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#93C5FD] text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <span>Registering resident profile...</span>
                  ) : (
                    <>
                      <span>Complete Student Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E2E8F0] text-center">
              <p className="text-xs text-[#64748B]">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-bold text-[#2563EB] hover:underline inline-flex items-center gap-1"
                >
                  Sign in here <ArrowRight className="w-3 h-3" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
