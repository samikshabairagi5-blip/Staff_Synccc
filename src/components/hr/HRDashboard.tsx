import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import { StatCard } from '../common/StatCard';
import {
  Users,
  Clock,
  CalendarDays,
  DollarSign,
  Plus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Building,
  BellRing,
  Award,
  BarChart3
} from 'lucide-react';

interface HRDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { employees, attendance, leaves, announcements, reviewLeave, departments } = useHRM();

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a) => a.date === today);

  const pendingLeaves = leaves.filter((l) => l.status === 'pending');
  const presentCount = todayAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const totalPayroll = employees.reduce((acc, curr) => acc + curr.salary, 0);

  return (
    <div className="space-y-6">
      {/* Executive Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-200 text-xs font-semibold border border-purple-400/20">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              People & Culture Directorate • Executive View
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              HR Operations Cockpit
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Welcome Elena! Total workforce is active across {departments.length} departments.
              {pendingLeaves.length > 0 && ` There are ${pendingLeaves.length} company-wide leave requests pending authorization.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 self-start md:self-auto">
            <button
              onClick={() => onNavigateTab('employees')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Onboard Employee
            </button>
            <button
              onClick={() => onNavigateTab('announcements')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition flex items-center gap-1.5"
            >
              <BellRing className="w-4 h-4" />
              Broadcast Bulletin
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Workforce"
          value={employees.length}
          subtitle="Active team members"
          icon={<Users className="w-5 h-5" />}
          colorScheme="purple"
          onClick={() => onNavigateTab('employees')}
        />
        <StatCard
          title="Present Today"
          value={presentCount}
          subtitle="Checked in via punch"
          icon={<Clock className="w-5 h-5" />}
          colorScheme="emerald"
          onClick={() => onNavigateTab('attendance')}
        />
        <StatCard
          title="Open Leave Queue"
          value={pendingLeaves.length}
          subtitle="Awaiting authorization"
          icon={<CalendarDays className="w-5 h-5" />}
          colorScheme="amber"
          onClick={() => onNavigateTab('leaves')}
        />
        <StatCard
          title="Annual Payroll"
          value={`$${(totalPayroll / 1000000).toFixed(2)}M`}
          subtitle="Annualized expenditure"
          icon={<DollarSign className="w-5 h-5" />}
          colorScheme="blue"
          onClick={() => onNavigateTab('reports')}
        />
      </div>

      {/* Two Column Grid: Pending Leaves & Recent Employees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Leaves Queue */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Company-Wide Leave Approvals</h3>
                  <p className="text-xs text-slate-500">Decide open employee requests</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('leaves')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View full board <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {pendingLeaves.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                  All leave requests cleared. Zero backlog.
                </div>
              ) : (
                pendingLeaves.slice(0, 3).map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={req.employeeAvatar}
                        alt={req.employeeName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{req.employeeName}</p>
                        <p className="text-slate-500 text-[11px]">
                          {req.department} • {req.leaveType} ({req.daysCount} days)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => reviewLeave(req.id, 'approved', 'Approved by HR Directorate.')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => reviewLeave(req.id, 'rejected', 'Declined by HR Directorate.')}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[11px] transition"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('leaves')}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition"
          >
            Manage All Leave Requests
          </button>
        </div>

        {/* Department Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Department Staffing</h3>
                  <p className="text-xs text-slate-500">Headcount distribution</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('reports')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Analytics <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              {departments.map((dept) => {
                const count = employees.filter((e) => e.department === dept.name).length;
                const pct = Math.round((count / (employees.length || 1)) * 100);
                return (
                  <div key={dept.id} className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-800">{dept.name}</span>
                      <span className="font-bold text-indigo-600">
                        {count} FTEs ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-indigo-600 h-1.5 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('employees')}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition"
          >
            View Full Employee Directory
          </button>
        </div>
      </div>
    </div>
  );
};
