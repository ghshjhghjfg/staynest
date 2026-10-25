import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, StudentRecord } from '../../types';
import { SEED_PROFILES } from '../../services/seedData';
import { dataStore } from '../../services/dataStore';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { useToast } from '../../components/ui/Toast';

interface AuthContextType {
  currentUser: UserProfile | null;
  currentStudent: StudentRecord | null;
  role: UserRole;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerStudent: (data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    studentCode: string;
    department: string;
    academicYear: string;
    gender?: 'Male' | 'Female' | 'Other';
    guardianName: string;
    guardianPhone: string;
    emergencyContact: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'staynest_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      // Default to administrator in demo mode
      return SEED_PROFILES[0];
    } catch {
      return SEED_PROFILES[0];
    }
  });

  const [currentStudent, setCurrentStudent] = useState<StudentRecord | null>(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      if (currentUser.role === 'student') {
        const student = dataStore.getStudentById(currentUser.id) || dataStore.getStudents()[0];
        setCurrentStudent(student || null);
      } else {
        setCurrentStudent(null);
      }
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setCurrentStudent(null);
    }
  }, [currentUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Try Supabase auth if properly configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            const userProfile = profile as UserProfile;
            setCurrentUser(userProfile);
            showToast(`Signed in successfully! Welcome back, ${userProfile.full_name}.`, 'success');
            return { success: true };
          }
        }
      } catch (err: any) {
        console.warn('Supabase auth failed, falling back to local credentials:', err);
      }
    }

    // Local / Demo Mode matching
    const seedUser = SEED_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (seedUser) {
      setCurrentUser(seedUser);
      showToast(`Signed in successfully! Welcome, ${seedUser.full_name} (${seedUser.role.toUpperCase()}).`, 'success');
      return { success: true };
    }

    // Check if student was registered locally
    const student = dataStore.getStudents().find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (student) {
      const studentProfile: UserProfile = {
        id: student.profile_id || student.id,
        email: student.email,
        full_name: student.full_name,
        phone: student.phone,
        role: 'student',
        account_status: student.account_status,
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(student.full_name)}`,
        created_at: student.created_at,
        updated_at: student.created_at,
      };
      setCurrentUser(studentProfile);
      setCurrentStudent(student);
      showToast(`Signed in successfully! Welcome back, ${student.full_name}.`, 'success');
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please check your email and password or use one of the demo accounts provided.',
    };
  };

  const registerStudent = async (data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    studentCode: string;
    department: string;
    academicYear: string;
    gender?: 'Male' | 'Female' | 'Other';
    guardianName: string;
    guardianPhone: string;
    emergencyContact: string;
  }): Promise<{ success: boolean; error?: string }> => {
    // Validation
    if (!data.fullName.trim()) return { success: false, error: 'Full name is required.' };
    if (!data.email.includes('@')) return { success: false, error: 'Valid college or personal email is required.' };
    if (data.password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
    if (!data.studentCode.trim()) return { success: false, error: 'Student ID / Roll Number is required.' };

    const students = dataStore.getStudents();
    const existingCode = students.some(
      (s) => s.student_code.toLowerCase() === data.studentCode.trim().toLowerCase()
    );
    if (existingCode) {
      return { success: false, error: `Student ID "${data.studentCode}" is already registered in the system.` };
    }

    const existingEmail = students.some((s) => s.email.toLowerCase() === data.email.trim().toLowerCase());
    if (existingEmail) {
      return { success: false, error: `An account with email "${data.email}" already exists.` };
    }

    // CRITICAL SECURITY RULE: Public registration creates ONLY 'student' role!
    const newProfileId = `user-std-${Date.now()}`;
    const newStudent = dataStore.addStudent({
      profile_id: newProfileId,
      student_code: data.studentCode.trim(),
      full_name: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      department: data.department,
      academic_year: data.academicYear,
      gender: data.gender || 'Male',
      guardian_name: data.guardianName.trim(),
      guardian_phone: data.guardianPhone.trim(),
      emergency_contact: data.emergencyContact.trim(),
      fee_status: 'Pending',
      account_status: 'active',
      joining_date: new Date().toISOString().split('T')[0],
    } as any);

    const studentProfile: UserProfile = {
      id: newProfileId,
      email: data.email.trim().toLowerCase(),
      full_name: data.fullName.trim(),
      phone: data.phone.trim(),
      role: 'student', // ALWAYS student
      account_status: 'active',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.fullName)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCurrentUser(studentProfile);
    setCurrentStudent(newStudent);
    showToast(`Account registered successfully! Welcome to staynest, ${data.fullName}.`, 'success');

    return { success: true };
  };

  const logout = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentUser(null);
    setCurrentStudent(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    showToast('You have been logged out successfully.', 'info');
  };

  const switchDemoRole = (targetRole: UserRole) => {
    const profile = SEED_PROFILES.find((p) => p.role === targetRole);
    if (profile) {
      setCurrentUser(profile);
      if (profile.role === 'student') {
        const student = dataStore.getStudentById(profile.id) || dataStore.getStudents()[0];
        setCurrentStudent(student || null);
      } else {
        setCurrentStudent(null);
      }
      showToast(`Switched persona to ${targetRole.toUpperCase()}: ${profile.full_name}`, 'info');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentStudent,
        role: currentUser?.role || 'student',
        isAuthenticated: Boolean(currentUser),
        isDemoMode: !isSupabaseConfigured,
        login,
        registerStudent,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
