import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  GraduationCap,
  BellRing,
  Award,
  BarChart3,
  UserCheck,
  ShieldAlert,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { role, switchPersona } = useAuth();
  const { leaves, announcements } = useHRM();

  const pendingLeavesCount = leaves.filter((l) => l.status === 'pending').length;

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }

  const getNavItems = (): NavItem[] => {
    if (role === 'hr') {
      return [
        { id: 'dashboard', label: 'HR Executive Cockpit', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'employees', label: 'Employee Directory', icon: <Users className="w-4 h-4" /> },
        { id: 'attendance', label: 'Attendance Tracker', icon: <Clock className="w-4 h-4" /> },
        {
          id: 'leaves',
          label: 'Leave Management',
          icon: <CalendarDays className="w-4 h-4" />,
          badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        { id: 'announcements', label: 'Announcements Board', icon: <BellRing className="w-4 h-4" /> },
        { id: 'trainings', label: 'Training Programs', icon: <GraduationCap className="w-4 h-4" /> },
        { id: 'reports', label: 'Analytics & Reports', icon: <BarChart3 className="w-4 h-4" /> }
      ];
    }

    if (role === 'manager') {
      return [
        { id: 'dashboard', label: 'Team Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'team', label: 'Direct Reports', icon: <Users className="w-4 h-4" /> },
        {
          id: 'leaves',
          label: 'Leave Approvals',
          icon: <CalendarDays className="w-4 h-4" />,
          badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined,
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        { id: 'attendance', label: 'Team Timesheets', icon: <Clock className="w-4 h-4" /> },
        { id: 'performance', label: 'Performance Reviews', icon: <Award className="w-4 h-4" /> },
        { id: 'trainings', label: 'Team Skill & Training', icon: <GraduationCap className="w-4 h-4" /> },
        { id: 'announcements', label: 'Announcements', icon: <BellRing className="w-4 h-4" /> }
      ];
    }

    // Employee
    return [
      { id: 'dashboard', label: 'My Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { id: 'attendance', label: 'Mark Attendance', icon: <Clock className="w-4 h-4" /> },
      { id: 'leaves', label: 'Leave Requests', icon: <CalendarDays className="w-4 h-4" /> },
      { id: 'trainings', label: 'Trainings & Certs', icon: <GraduationCap className="w-4 h-4" /> },
      { id: 'announcements', label: 'Announcements', icon: <BellRing className="w-4 h-4" /> },
      { id: 'performance', label: 'My Performance', icon: <Award className="w-4 h-4" /> },
      { id: 'profile', label: 'My Profile', icon: <UserCheck className="w-4 h-4" /> }
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 shrink-0 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 min-h-[calc(100vh-57px)]">
      {/* Current Workspace Role Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          <span>Active Workspace</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg text-white font-bold text-xs ${role === 'hr' ? 'bg-purple-600' : role === 'manager' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
              {role === 'hr' ? 'HR' : role === 'manager' ? 'MGR' : 'EMP'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {role === 'hr' ? 'HR Directorate' : role === 'manager' ? 'Engineering Pod' : 'Employee Portal'}
              </p>
              <p className="text-[11px] text-slate-400 capitalize">
                {role === 'hr' ? 'Full HR Access' : `${role} view`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5">
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-indigo-500 text-white'}`}>
                  {item.badge}
                </span>
              )}

              {isActive && !item.badge && (
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Fast Persona Switcher Banner in Sidebar Footer */}
      <div className="p-3.5 m-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Role Preview</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug mb-3">
          Test any role without re-logging:
        </p>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => { switchPersona('employee'); onTabChange('dashboard'); }}
            className={`py-1.5 px-1 rounded text-[11px] font-medium border text-center transition ${
              role === 'employee'
                ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                : 'bg-slate-700/50 border-transparent hover:bg-slate-700 text-slate-300'
            }`}
          >
            Employee
          </button>
          <button
            onClick={() => { switchPersona('manager'); onTabChange('dashboard'); }}
            className={`py-1.5 px-1 rounded text-[11px] font-medium border text-center transition ${
              role === 'manager'
                ? 'bg-blue-500/20 border-blue-500/60 text-blue-300'
                : 'bg-slate-700/50 border-transparent hover:bg-slate-700 text-slate-300'
            }`}
          >
            Manager
          </button>
          <button
            onClick={() => { switchPersona('hr'); onTabChange('dashboard'); }}
            className={`py-1.5 px-1 rounded text-[11px] font-medium border text-center transition ${
              role === 'hr'
                ? 'bg-purple-500/20 border-purple-500/60 text-purple-300'
                : 'bg-slate-700/50 border-transparent hover:bg-slate-700 text-slate-300'
            }`}
          >
            HR Admin
          </button>
        </div>
      </div>
    </aside>
  );
};
