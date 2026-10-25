import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-[#F0F3F3] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#0C1629] flex items-center justify-center text-white">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0C1629]">staynest</span>
          </Link>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-[#0C1629]">
          Student Resident Registration
        </h2>
        <p className="mt-1 text-center text-xs text-[#727A84]">
          Create your verified hostel resident account. Room allocation is reviewed by the warden upon admission.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-[#FEFEFE] py-8 px-6 shadow-sm border border-[#D6DCE0] rounded-xl sm:px-10">
          {/* Security Banner */}
          <div className="mb-6 p-3 rounded-lg bg-[#356B9A]/10 border border-[#356B9A]/20 flex items-center gap-3 text-xs text-[#0C1629]">
            <ShieldCheck className="w-5 h-5 text-[#356B9A] shrink-0" />
            <div>
              <span className="font-semibold text-[#0C1629]">Role-Secured Registration: </span>
              <span className="text-[#727A84]">
                Public sign-ups automatically receive resident student privileges. Administrative roles are provisioned by institutional authorities only.
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-md bg-[#B54747]/10 border border-[#B54747]/20 flex items-start gap-2.5 text-xs text-[#B54747]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className="mb-5 p-4 rounded-md bg-[#287A52]/10 border border-[#287A52]/20 flex items-center gap-3 text-xs text-[#287A52]">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-semibold">Account created successfully!</p>
                <p className="text-[11px] text-[#287A52]/80">Redirecting to your student dashboard...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Personal & Account Credentials */}
            <div>
              <h3 className="text-xs font-bold text-[#0C1629] uppercase tracking-wider pb-2 border-b border-[#D6DCE0]">
                1. Account & Identity
              </h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Varma"
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@institution.edu"
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629]"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Academic Details */}
            <div>
              <h3 className="text-xs font-bold text-[#0C1629] uppercase tracking-wider pb-2 border-b border-[#D6DCE0]">
                2. Academic Information
              </h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">Roll / Student ID *</label>
                  <input
                    type="text"
                    required
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    placeholder="e.g. HE-2025-099"
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden"
                  >
                    <option value="Computer Science & Eng">Computer Science & Eng</option>
                    <option value="Electronics & Comm">Electronics & Comm</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">Academic Year</label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Guardian & Emergency Contacts */}
            <div>
              <h3 className="text-xs font-bold text-[#0C1629] uppercase tracking-wider pb-2 border-b border-[#D6DCE0]">
                3. Guardian & Emergency Contacts
              </h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Parent / Guardian"
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">Guardian Phone *</label>
                  <input
                    type="tel"
                    required
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="+91 98450 00000"
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#0C1629] mb-1">Emergency Contact *</label>
                  <input
                    type="tel"
                    required
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="24/7 reachable number"
                    className="w-full px-3 py-2 bg-white border border-[#D6DCE0] rounded-md text-xs text-[#0C1629] focus:outline-hidden focus:border-[#0C1629]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#0C1629] hover:bg-[#1A2942] disabled:opacity-50 text-white rounded-md text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Student Registration</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs text-[#727A84]">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-[#0C1629] hover:underline">
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
