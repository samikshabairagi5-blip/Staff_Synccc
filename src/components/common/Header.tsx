import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import { UserRole } from '../../types/hrm';
import {
  Bell,
  CheckCircle,
  Clock,
  LogOut,
  User as UserIcon,
  RefreshCw,
  ChevronDown,
  Building2,
  Briefcase,
  ExternalLink,
  Info
} from 'lucide-react';

interface HeaderProps {
  onOpenAuth: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuth, onNavigateTab }) => {
  const { user, role, switchPersona, logout } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead, getTodayRecord, resetToDefaults } = useHRM();

  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const personaRef = useRef<HTMLDivElement>(null);

  // Digital clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (personaRef.current && !personaRef.current.contains(event.target as Node)) {
        setShowPersonaMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const todayRecord = getTodayRecord(user?.employeeId);

  // Filter notifications relevant to current user / role
  const userNotifications = notifications.filter(
    (n) => n.userId === 'all' || n.userId === user?.id || n.targetRole === 'all' || n.targetRole === role
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const roleColors: Record<UserRole, { bg: string; text: string; label: string; border: string }> = {
    hr: { bg: 'bg-purple-50 text-purple-700', text: 'text-purple-600', label: 'HR Administrator', border: 'border-purple-200' },
    manager: { bg: 'bg-blue-50 text-blue-700', text: 'text-blue-600', label: 'Engineering Manager', border: 'border-blue-200' },
    employee: { bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-600', label: 'Team Member', border: 'border-emerald-200' }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Brand & Live Clock */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">NexusHR</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  MERN HRM
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Enterprise HR & People Operations</p>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs text-slate-600 font-mono">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{dateStr}</span>
            <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">{time}</span>
          </div>
        </div>

        {/* Attendance Pill & Quick Persona Switcher & Notification & Profile */}
        <div className="flex items-center gap-3">
          {/* Real-time Clock In status badge */}
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs">
              <span className={`w-2 h-2 rounded-full ${todayRecord?.clockIn ? (todayRecord.clockOut ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse') : 'bg-rose-400'}`} />
              <span className="text-slate-600">
                {todayRecord?.clockIn ? (
                  todayRecord.clockOut ? (
                    <span>Clocked Out: <strong>{todayRecord.clockOut.slice(0, 5)}</strong></span>
                  ) : (
                    <span>Clocked In: <strong>{todayRecord.clockIn.slice(0, 5)}</strong> ({todayRecord.workMode})</span>
                  )
                ) : (
                  <span className="text-rose-600 font-medium">Not Clocked In Today</span>
                )}
              </span>
            </div>
          )}

          {/* Quick Persona Switcher (Crucial for HRM demo testing) */}
          <div className="relative" ref={personaRef}>
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition shadow-sm ${roleColors[role].bg} ${roleColors[role].border}`}
              title="Switch demo persona to test Employee, Manager, and HR capabilities"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Role:</span>
              <span className="font-semibold">{roleColors[role].label}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in-50 zoom-in-95">
                <div className="px-3 py-1.5 border-b border-slate-100 font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                  Switch Role Persona
                </div>
                <button
                  onClick={() => { switchPersona('employee'); setShowPersonaMenu(false); }}
                  className={`w-full px-3 py-2.5 text-left flex items-start gap-2.5 hover:bg-slate-50 transition ${role === 'employee' ? 'bg-emerald-50/50' : ''}`}
                >
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop" className="w-7 h-7 rounded-full object-cover mt-0.5" alt="" />
                  <div>
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      Sarah Jenkins
                      {role === 'employee' && <span className="text-[10px] text-emerald-600 font-bold">● Active</span>}
                    </div>
                    <div className="text-[11px] text-slate-500">Employee • Sr Full-Stack Engineer</div>
                  </div>
                </button>

                <button
                  onClick={() => { switchPersona('manager'); setShowPersonaMenu(false); }}
                  className={`w-full px-3 py-2.5 text-left flex items-start gap-2.5 hover:bg-slate-50 transition ${role === 'manager' ? 'bg-blue-50/50' : ''}`}
                >
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop" className="w-7 h-7 rounded-full object-cover mt-0.5" alt="" />
                  <div>
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      Marcus Vance
                      {role === 'manager' && <span className="text-[10px] text-blue-600 font-bold">● Active</span>}
                    </div>
                    <div className="text-[11px] text-slate-500">Manager • Director of Engineering</div>
                  </div>
                </button>

                <button
                  onClick={() => { switchPersona('hr'); setShowPersonaMenu(false); }}
                  className={`w-full px-3 py-2.5 text-left flex items-start gap-2.5 hover:bg-slate-50 transition ${role === 'hr' ? 'bg-purple-50/50' : ''}`}
                >
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&fit=crop" className="w-7 h-7 rounded-full object-cover mt-0.5" alt="" />
                  <div>
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      Elena Rostova
                      {role === 'hr' && <span className="text-[10px] text-purple-600 font-bold">● Active</span>}
                    </div>
                    <div className="text-[11px] text-slate-500">HR Admin • VP of People & Culture</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in-50 zoom-in-95">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {userNotifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      No notifications yet
                    </div>
                  ) : (
                    userNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.linkTab && onNavigateTab) {
                            onNavigateTab(notif.linkTab);
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-3 hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${!notif.read ? 'bg-indigo-50/40' : ''}`}
                      >
                        <div className="mt-0.5">
                          {notif.type === 'leave' && <span className="w-2 h-2 rounded-full bg-amber-500 block" />}
                          {notif.type === 'attendance' && <span className="w-2 h-2 rounded-full bg-emerald-500 block" />}
                          {notif.type === 'training' && <span className="w-2 h-2 rounded-full bg-blue-500 block" />}
                          {notif.type === 'announcement' && <span className="w-2 h-2 rounded-full bg-purple-500 block" />}
                          {notif.type === 'performance' && <span className="w-2 h-2 rounded-full bg-pink-500 block" />}
                          {notif.type === 'system' && <span className="w-2 h-2 rounded-full bg-slate-500 block" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 leading-snug">{notif.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                        </div>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 self-center" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile & Settings Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{user?.name}</p>
                <p className="text-[10px] text-slate-500">{user?.department}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in-50 zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-slate-500 text-[11px] truncate">{user?.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="font-mono text-[10px] bg-slate-100 px-1 py-0.5 rounded text-slate-700">
                      {user?.employeeId}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-semibold uppercase">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onNavigateTab) onNavigateTab('profile');
                  }}
                  className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  View & Edit Profile
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenAuth();
                  }}
                  className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  Sign In / Register New Account
                </button>

                <button
                  onClick={() => {
                    if (confirm('Reset all HRM data back to initial enterprise demonstration state?')) {
                      resetToDefaults();
                      setShowProfileMenu(false);
                    }
                  }}
                  className="w-full px-3 py-2 text-left text-slate-600 hover:bg-amber-50 hover:text-amber-800 flex items-center gap-2 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                  Reset Demo Data
                </button>

                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
