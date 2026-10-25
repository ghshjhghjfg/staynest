import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BedDouble,
  Wallet,
  CalendarCheck,
  ClipboardList,
  MessageSquareWarning,
  Utensils,
  UserRoundCheck,
  Wrench,
  Megaphone,
  FileBarChart,
  Settings,
  LogOut,
  Building2,
  X,
} from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { canAccessModule } from '../../lib/permissions';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { currentUser, role, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, module: 'dashboard' },
    { label: 'Students', path: '/dashboard/students', icon: Users, module: 'students' },
    { label: 'Rooms', path: '/dashboard/rooms', icon: BedDouble, module: 'rooms' },
    { label: 'Fees', path: '/dashboard/fees', icon: Wallet, module: 'fees' },
    { label: 'Attendance', path: '/dashboard/attendance', icon: CalendarCheck, module: 'attendance' },
    { label: 'Leave Requests', path: '/dashboard/leaves', icon: ClipboardList, module: 'leaves' },
    { label: 'Complaints', path: '/dashboard/complaints', icon: MessageSquareWarning, module: 'complaints' },
    { label: 'Mess & Food', path: '/dashboard/mess', icon: Utensils, module: 'mess' },
    { label: 'Visitors', path: '/dashboard/visitors', icon: UserRoundCheck, module: 'visitors' },
    { label: 'Maintenance', path: '/dashboard/maintenance', icon: Wrench, module: 'maintenance' },
    { label: 'Notices', path: '/dashboard/notices', icon: Megaphone, module: 'notices' },
    { label: 'Reports', path: '/dashboard/reports', icon: FileBarChart, module: 'reports' },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings, module: 'settings' },
  ];

  const filteredItems = navItems.filter((item) => canAccessModule(role, item.module));

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/'); // Redirect to landing page as requested
  };

  const getRoleBadgeStyle = (r: string) => {
    switch (r) {
      case 'admin':
        return 'bg-[#2563EB] text-white border-none';
      case 'warden':
        return 'bg-[#3B82F6] text-white border-none';
      case 'staff':
        return 'bg-[#10B981] text-white border-none';
      default:
        return 'bg-[#F59E0B] text-white border-none';
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-[#0C1629] text-white w-64 select-none border-r border-[#1E293B]">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E293B]">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-bold shadow-sm">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white leading-tight">staynest</span>
            <span className="text-[10px] text-[#94A3B8] font-medium tracking-wide uppercase">Welfare & Ops</span>
          </div>
        </NavLink>
        {mobileOpen && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-md text-[#94A3B8] hover:text-white hover:bg-[#1E293B] md:hidden cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Role Indicator Banner */}
      <div className="px-5 py-2.5 bg-[#111E36] flex items-center justify-between border-b border-[#1E293B]">
        <span className="text-xs text-[#94A3B8] font-medium">Logged in as</span>
        <span className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${getRoleBadgeStyle(role)}`}>
          {role}
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-sm font-semibold'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-[#94A3B8] group-hover:text-white" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer & Logout */}
      <div className="p-3 border-t border-[#1E293B] bg-[#091120]">
        <div className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl bg-[#111E36] border border-[#1E293B]">
          <div className="flex items-center gap-2.5 min-w-0">
            {currentUser?.avatar_url ? (
              <img
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                className="w-8 h-8 rounded-full object-cover shrink-0 border border-[#2563EB]/40"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center text-xs font-semibold text-white shrink-0">
                {currentUser?.full_name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate leading-tight">
                {currentUser?.full_name || 'Guest User'}
              </p>
              <p className="text-[11px] text-[#94A3B8] truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            title="Sign Out of staynest"
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-red-400 hover:bg-[#1E293B] transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex h-screen sticky top-0 shrink-0 z-30">{content}</aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#D6DCE0] text-center transform animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-[#0C1629] mb-1.5">
              Sign out of staynest?
            </h3>
            <p className="text-xs text-[#727A84] mb-6 leading-relaxed">
              Are you sure you want to end your current session? You will be redirected to the landing page.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#D6DCE0] text-xs font-semibold text-[#0C1629] hover:bg-[#F0F3F3] transition-colors cursor-pointer"
              >
                Stay signed in
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
