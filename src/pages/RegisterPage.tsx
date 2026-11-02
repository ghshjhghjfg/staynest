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
  Eye,
  EyeOff,
  Check,
  X,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerStudent } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Live 5-Criteria Verification Checklist
  const criteria = [
    {
      id: 'length',
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      id: 'upper',
      label: 'At least one uppercase letter (A-Z)',
      met: /[A-Z]/.test(password),
    },
    {
      id: 'lower',
      label: 'At least one lowercase letter (a-z)',
      met: /[a-z]/.test(password),
    },
    {
      id: 'number',
      label: 'At least one number (0-9)',
      met: /[0-9]/.test(password),
    },
    {
      id: 'symbol',
      label: 'At least one special symbol (!@#$%^&*)',
      met: /[!@#$%^&*]/.test(password),
    },
  ];

  const metCount = criteria.filter((c) => c.met).length;
  const isPasswordValid = metCount === 5;

  // Real-time visual indicator displaying Weak, Moderate, or Strong & Verified status
  const getStrengthInfo = () => {
    if (!password) {
      return {
        status: 'Weak' as const,
        barClass: 'w-0 bg-[#E2E8F0]',
        badgeClass: 'text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0]',
      };
    }
    if (metCount === 5) {
      return {
        status: 'Strong & Verified' as const,
        barClass: 'w-full bg-[#10B981]',
        badgeClass: 'text-[#065F46] bg-[#D1FAE5] border border-[#A7F3D0]',
      };
    }
    if (metCount >= 3) {
      return {
        status: 'Moderate' as const,
        barClass: 'w-2/3 bg-[#F59E0B]',
        badgeClass: 'text-[#92400E] bg-[#FEF3C7] border border-[#FDE68A]',
      };
    }
    return {
      status: 'Weak' as const,
      barClass: 'w-1/3 bg-[#EF4444]',
      badgeClass: 'text-[#991B1B] bg-[#FEE2E2] border border-[#FECACA]',
    };
  };

  const strength = getStrengthInfo();

  // "Suggest Strong Password" Button: Generates a secure high-entropy password,
  // fills both password and confirmation fields, and reveals the text for saving/viewing
  const handleSuggestStrongPassword = () => {
    const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz';
    const numberChars = '23456789';
    const symbolChars = '!@#$%^&*';
    const allChars = uppercaseChars + lowercaseChars + numberChars + symbolChars;

    // Guaranteed one of each required criteria
    const chars = [
      uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)],
      lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)],
      numberChars[Math.floor(Math.random() * numberChars.length)],
      symbolChars[Math.floor(Math.random() * symbolChars.length)],
    ];

    // Add 10 additional characters (total 14 characters)
    for (let i = 0; i < 10; i++) {
      chars.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle using Fisher-Yates
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    const generatedPassword = chars.join('');
    setPassword(generatedPassword);
    setConfirmPassword(generatedPassword);
    // Reveal text for saving/viewing
    setShowPassword(true);
    setShowConfirmPassword(true);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!fullName.trim()) return setErrorMessage('Full Name is required.');
    if (!email.trim() || !email.includes('@')) return setErrorMessage('A valid email address is required.');
    if (!isPasswordValid) {
      return setErrorMessage('Please fulfill all 5 password verification criteria (must be Strong & Verified).');
    }
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
      // Post-Registration Transition to Login
      setTimeout(() => {
        navigate(`/login?registered=true&email=${encodeURIComponent(email.trim())}`);
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
              <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-800 font-medium">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Account registered successfully! Transitioning to login to sign in...</span>
                </div>
                <Link
                  to={`/login?registered=true&email=${encodeURIComponent(email.trim())}`}
                  className="font-bold text-emerald-700 underline text-[11px] shrink-0"
                >
                  Sign In Now →
                </Link>
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

                {/* Password field with Suggest Strong Password Button & Strength Meter */}
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-[#0C1629]">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={handleSuggestStrongPassword}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded-lg transition-colors cursor-pointer"
                      title="Generates a secure high-entropy password, fills both fields, and reveals text"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Suggest Strong Password</span>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter strong password or click suggest above"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all font-mono tracking-normal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0C1629] p-1 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Meter: Real-time visual indicator */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-[#64748B]">Password Strength Meter:</span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${strength.badgeClass}`}>
                        {strength.status}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.barClass}`}
                      />
                    </div>
                  </div>

                  {/* Live 5-Criteria Verification Checklist */}
                  <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-[#0C1629] uppercase tracking-wider">
                        Live 5-Criteria Verification Checklist
                      </p>
                      <span className="text-[10px] font-semibold text-[#64748B]">
                        {metCount} of 5 satisfied
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {criteria.map((c) => (
                        <div
                          key={c.id}
                          className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all ${
                            c.met
                              ? 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46] font-medium'
                              : 'bg-white border-[#E2E8F0] text-[#64748B]'
                          }`}
                        >
                          {c.met ? (
                            <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-[#CBD5E1] shrink-0 flex items-center justify-center">
                              <span className="w-1 h-1 rounded-full bg-[#94A3B8]" />
                            </div>
                          )}
                          <span>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Confirm Password field */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold text-[#0C1629]">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password to confirm"
                      className="w-full pl-3.5 pr-10 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0C1629] placeholder-[#94A3B8] focus:bg-white focus:outline-hidden focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all font-mono tracking-normal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0C1629] p-1 cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-[11px] text-red-600 font-medium flex items-center gap-1">
                      <X className="w-3.5 h-3.5" /> Passwords do not match
                    </p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Passwords match & verified
                    </p>
                  )}
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
