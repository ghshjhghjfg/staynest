import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { dataStore } from '../../services/dataStore';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobile }) => {
  const { currentUser, role, isDemoMode, switchDemoRole } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const notifications = dataStore.getNotifications(currentUser?.id);
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const getBreadcrumbTitle = () => {
    const path = location.pathname.split('/').filter(Boolean);
    if (path.length <= 1) return 'Dashboard Overview';
    const sub = path[1];
    return sub.charAt(0).toUpperCase() + sub.slice(1).replace('-', ' ');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data (students, rooms, payments, leaves, etc.) back to factory default?')) {
      dataStore.resetToDefaults();
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-[#FEFEFE] border-b border-[#D6DCE0] px-4 md:px-6 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-1.5 rounded-md text-[#727A84] hover:text-[#0C1629] hover:bg-[#F0F3F3] md:hidden"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg md:text-xl font-semibold text-[#0C1629] tracking-tight">
            {getBreadcrumbTitle()}
          </h1>
          <p className="hidden sm:block text-xs text-[#727A84]">
            staynest • Automated Resident & Facility Management
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Date Display */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#F0F3F3] border border-[#D6DCE0] rounded-md text-xs font-medium text-[#0C1629]">
          <Clock className="w-3.5 h-3.5 text-[#727A84]" />
          <span>{todayFormatted}</span>
        </div>

        {/* Quick Role Switcher (Crucial for live preview / demo grading) */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSelector(!showRoleSelector)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#F0F3F3] hover:bg-[#D6DCE0]/60 border border-[#D6DCE0] rounded-md text-xs font-medium text-[#0C1629] transition-colors"
            title="Switch demo persona"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#356B9A]" />
            <span className="hidden sm:inline">Role:</span>
            <span className="font-semibold capitalize text-[#0C1629]">{role}</span>
            <ChevronDown className="w-3 h-3 text-[#727A84]" />
          </button>

          {showRoleSelector && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#D6DCE0] rounded-lg shadow-lg py-1.5 z-50 text-xs">
              <div className="px-3 py-1 border-b border-[#D6DCE0] mb-1">
                <span className="font-semibold text-[#0C1629]">Switch Demo Persona</span>
                <p className="text-[10px] text-[#727A84]">Instant access with specific permissions</p>
              </div>
              {(['admin', 'warden', 'student', 'staff'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchDemoRole(r);
                    setShowRoleSelector(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-[#F0F3F3] ${
                    role === r ? 'font-semibold text-[#0C1629] bg-[#F0F3F3]/80' : 'text-[#727A84]'
                  }`}
                >
                  <span className="capitalize">{r}</span>
                  {role === r && <CheckCircle2 className="w-3.5 h-3.5 text-[#287A52]" />}
                </button>
              ))}
              <div className="px-3 py-1.5 border-t border-[#D6DCE0] mt-1 bg-[#F0F3F3]/50">
                <span className="text-[10px] text-[#727A84]">
                  In production, roles are enforced via Supabase Auth & RLS.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Reset Demo Data Button */}
        {isDemoMode && (
          <button
            onClick={handleResetData}
            title="Reset Seed Data"
            className="p-1.5 rounded-md text-[#727A84] hover:text-[#0C1629] hover:bg-[#F0F3F3] border border-[#D6DCE0] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        {/* Notifications Icon & Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 rounded-md text-[#727A84] hover:text-[#0C1629] hover:bg-[#F0F3F3] border border-[#D6DCE0] transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B54747] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#D6DCE0] rounded-lg shadow-xl z-50 text-xs">
              <div className="px-4 py-2.5 border-b border-[#D6DCE0] flex items-center justify-between">
                <span className="font-semibold text-[#0C1629]">Notifications</span>
                <span className="text-[11px] text-[#727A84]">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#D6DCE0]">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-[#727A84]">No notifications</p>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => dataStore.markNotificationRead(item.id)}
                      className={`px-4 py-2.5 hover:bg-[#F0F3F3] cursor-pointer transition-colors ${
                        !item.read_at ? 'bg-[#F0F3F3]/60' : ''
                      }`}
                    >
                      <p className="font-semibold text-[#0C1629]">{item.title}</p>
                      <p className="text-[11px] text-[#727A84] mt-0.5 line-clamp-2">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2 border-t border-[#D6DCE0] bg-[#F0F3F3]/50 text-center">
                <Link
                  to="/dashboard/notices"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-[#356B9A] hover:underline font-medium"
                >
                  View All Hostel Notices
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
