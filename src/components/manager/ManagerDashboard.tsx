import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import { StatCard } from '../common/StatCard';
import {
  Users,
  Clock,
  CalendarDays,
  Award,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Building,
  Home,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface ManagerDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { employees, attendance, leaves, reviewLeave } = useHRM();

  const teamList = employees.filter((e) =>
    e.department === 'Engineering' || e.managerId === user?.id || e.managerName.includes('Marcus')
  );

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a) => a.date === today);

  const pendingLeaves = leaves.filter((l) => l.status === 'pending');
  const presentTodayCount = todayAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;

  const avgTeamRating = (
    teamList.reduce((acc, curr) => acc + (curr.performanceScore || 4.5), 0) /
    (teamList.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/20">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Department Management • Engineering Pod
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Engineering Team Cockpit
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Hello Marcus! You are managing {teamList.length} direct reports in Software Engineering.
              {pendingLeaves.length > 0 && ` There are ${pendingLeaves.length} time-off requests waiting for your decision.`}
            </p>
          </div>

          <div className="flex gap-2 self-start md:self-auto">
            <button
              onClick={() => onNavigateTab('leaves')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <CalendarDays className="w-4 h-4" />
              Review Leaves ({pendingLeaves.length})
            </button>
            <button
              onClick={() => onNavigateTab('performance')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Review KPI
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Team Headcount"
          value={teamList.length}
          subtitle="Direct reports"
          icon={<Users className="w-5 h-5" />}
          colorScheme="blue"
          onClick={() => onNavigateTab('team')}
        />
        <StatCard
          title="Present Today"
          value={presentTodayCount}
          subtitle={`Across office & remote`}
          icon={<Clock className="w-5 h-5" />}
          colorScheme="emerald"
          onClick={() => onNavigateTab('attendance')}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingLeaves.length}
          subtitle="Awaiting authorization"
          icon={<CalendarDays className="w-5 h-5" />}
          colorScheme="amber"
          onClick={() => onNavigateTab('leaves')}
        />
        <StatCard
          title="Avg Team Rating"
          value={`${avgTeamRating} ★`}
          subtitle="Q3 Performance Calibration"
          icon={<Award className="w-5 h-5" />}
          colorScheme="purple"
          onClick={() => onNavigateTab('performance')}
        />
      </div>

      {/* Two Column Grid: Pending Approvals & Live Team Presence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Action Needed: Leave Requests</h3>
                  <p className="text-xs text-slate-500">Requires manager sign-off</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('leaves')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View all queue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {pendingLeaves.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                  No pending requests right now. All approvals cleared!
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
                          {req.leaveType} • {req.startDate} to {req.endDate} ({req.daysCount}d)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => reviewLeave(req.id, 'approved', 'Approved via quick action.')}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                        title="Quick Approve"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => reviewLeave(req.id, 'rejected', 'Declined via quick action.')}
                        className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                        title="Quick Decline"
                      >
                        <XCircle className="w-4 h-4" />
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
            Manage Leave Approvals
          </button>
        </div>

        {/* Live Team Presence */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Today&apos;s Team Presence</h3>
                  <p className="text-xs text-slate-500">Live work status of reports</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('attendance')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Timesheets <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              {teamList.map((emp) => {
                const rec = todayAttendance.find((a) => a.employeeId === emp.employeeId);
                return (
                  <div
                    key={emp.id}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">{emp.name}</p>
                        <p className="text-[10px] text-slate-500">{emp.designation}</p>
                      </div>
                    </div>

                    <div>
                      {rec?.clockIn ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                          {rec.workMode === 'office' ? <Building className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                          In at {rec.clockIn.slice(0, 5)}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium">
                          Not Clocked In
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('attendance')}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition"
          >
            View Full Timesheet Logs
          </button>
        </div>
      </div>
    </div>
  );
};
