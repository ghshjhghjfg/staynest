import React, { useState } from 'react';
import {
  Settings,
  Database,
  ShieldCheck,
  RotateCcw,
  Key,
  Server,
  Lock,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { dataStore } from '../services/dataStore';

export const SettingsPage: React.FC = () => {
  const { role, isDemoMode } = useAuth();
  const [resetDone, setResetDone] = useState(false);

  const handleResetData = () => {
    if (window.confirm('Reset all demo data (residents, rooms, allocations, fees, and tasks) back to initial seed data?')) {
      dataStore.resetToDefaults();
      setResetDone(true);
      setTimeout(() => {
        setResetDone(false);
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-[#0C1629]">Hostel System & Institutional Configuration</h2>
        <p className="text-xs text-[#727A84]">
          Manage security access policies, database connection parameters, and administrative defaults
        </p>
      </div>

      {resetDone && (
        <div className="p-3.5 rounded-lg bg-[#287A52]/10 border border-[#287A52]/20 text-xs text-[#287A52] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Demo store reset to original factory state successfully!</span>
        </div>
      )}

      {/* Database & Supabase Status Panel */}
      <div className="bg-white rounded-xl border border-[#D6DCE0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D6DCE0]">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#356B9A]" />
            <div>
              <h3 className="font-bold text-sm text-[#0C1629]">Database Persistence & Supabase Connection</h3>
              <p className="text-xs text-[#727A84]">PostgreSQL + Row-Level Security (RLS)</p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded text-xs font-semibold ${
              isSupabaseConfigured
                ? 'bg-[#287A52]/10 text-[#287A52] border border-[#287A52]/20'
                : 'bg-[#A66B16]/10 text-[#A66B16] border border-[#A66B16]/20'
            }`}
          >
            {isSupabaseConfigured ? '● Supabase Live Connected' : '● Demo Store Mode (Active)'}
          </span>
        </div>

        <div className="text-xs text-[#727A84] space-y-2 leading-relaxed">
          <p>
            HostelEase runs out-of-the-box in <strong>Full Interactive Demo Mode</strong> with deterministic seed data and reactive LocalStorage persistence.
          </p>
          <p>
            To connect to your own Supabase project in production, populate the following environment variables in your deployment environment:
          </p>
          <div className="bg-[#0C1629] text-[#F0F3F3] p-3 rounded-md font-mono text-[11px] space-y-1">
            <p>VITE_SUPABASE_URL="https://your-project.supabase.co"</p>
            <p>VITE_SUPABASE_ANON_KEY="your-anon-key-here"</p>
          </div>
          <p className="text-[11px] text-[#727A84]">
            Note: Security policy mandates that the Supabase service-role key is never exposed on the client. All tables are safeguarded with strict RLS policies located in <code className="bg-[#F0F3F3] px-1 py-0.5 rounded text-[#0C1629]">supabase/migrations</code>.
          </p>
        </div>
      </div>

      {/* Hostel Operating Guidelines */}
      <div className="bg-white rounded-xl border border-[#D6DCE0] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#D6DCE0]">
          <Building2 className="w-5 h-5 text-[#0C1629]" />
          <div>
            <h3 className="font-bold text-sm text-[#0C1629]">Hostel Rules & Curfew Timings</h3>
            <p className="text-xs text-[#727A84]">Institutional parameters for curfew, visitors, and dining</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-[#F0F3F3] rounded-lg">
            <span className="text-[#727A84] block font-medium">Night Curfew Gate Lock</span>
            <span className="font-bold text-sm text-[#0C1629] mt-0.5 block">10:00 PM (Weekdays)</span>
            <span className="text-[10px] text-[#727A84]">10:30 PM on Sat/Sun</span>
          </div>
          <div className="p-3 bg-[#F0F3F3] rounded-lg">
            <span className="text-[#727A84] block font-medium">Visitor Entry Hours</span>
            <span className="font-bold text-sm text-[#0C1629] mt-0.5 block">8:00 AM – 7:30 PM</span>
            <span className="text-[10px] text-[#727A84]">Visitor register required</span>
          </div>
          <div className="p-3 bg-[#F0F3F3] rounded-lg">
            <span className="text-[#727A84] block font-medium">Minimum Attendance Rule</span>
            <span className="font-bold text-sm text-[#0C1629] mt-0.5 block">85% Compliance</span>
            <span className="text-[10px] text-[#727A84]">Required for exam eligibility</span>
          </div>
        </div>
      </div>

      {/* Demo State Reset */}
      <div className="bg-white rounded-xl border border-[#D6DCE0] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-[#0C1629]">Reset Demonstration Database</h3>
          <p className="text-xs text-[#727A84]">
            Revert all modified records (students, allocations, fee payments, complaints) back to initial seed data
          </p>
        </div>
        <button
          onClick={handleResetData}
          className="px-4 py-2 border border-[#B54747]/40 text-[#B54747] hover:bg-red-50 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Store</span>
        </button>
      </div>
    </div>
  );
};
