import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import { StatCard } from '../common/StatCard';
import {
  Clock,
  CalendarDays,
  GraduationCap,
  Award,
  BellRing,
  ArrowRight,
  CheckCircle,
  Building,
  Home,
  UserCheck,
  Zap,
  TrendingUp
} from 'lucide-react';

interface EmployeeDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onNavigateTab }) => {
  const { user } = useAuth();
  const { attendance, leaves, trainings, announcements, getTodayRecord, clockIn, clockOut } = useHRM();

  const todayRecord = getTodayRecord(user?.employeeId);

  // Stats
  const userAttendance = attendance.filter((a) => a.employeeId === user?.employeeId);
  const presentCount = userAttendance.filter((a) => a.status === 'present' || a.status === 'late').length;
  const pendingLeaves = leaves.filter((l) => l.employeeId === user?.employeeId && l.status === 'pending').length;
  const enrolledTrainings = trainings.filter((t) => t.enrolledEmployeeIds.includes(user?.id || ''));
  const activeTraining = enrolledTrainings.find((t) => t.status !== 'completed') || enrolledTrainings[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-semibold border border-indigo-400/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Employee Portal • {user?.department}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/80 max-w-xl">
              {todayRecord?.clockIn
                ? `You clocked in at ${todayRecord.clockIn} (${todayRecord.workMode}). Keep up the momentum!`
                : "You haven't clocked in yet today. Record your punch to begin tracking hours."}
            </p>
          </div>

          {/* Quick Attendance Action Widget inside Banner */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-w-[200px]">
            <span className="text-[11px] text-indigo-200 uppercase tracking-wider font-semibold">
              Today&apos;s Work Punch
            </span>
            <div className="my-2 font-mono text-xl font-bold">
              {todayRecord?.clockIn ? (todayRecord.clockOut ? 'Shift Ended' : todayRecord.clockIn) : 'Not Clocked In'}
            </div>
            {!todayRecord?.clockIn ? (
              <button
                onClick={() => clockIn('office', 'Standard shift check-in')}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-md shadow-emerald-500/30 transition flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                Clock In Now
              </button>
            ) : !todayRecord.clockOut ? (
              <button
                onClick={clockOut}
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                Clock Out
              </button>
            ) : (
              <span className="text-xs text-emerald-300 font-medium">✓ Punch recorded</span>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Days Present"
          value={presentCount}
          subtitle="This calendar month"
          icon={<Clock className="w-5 h-5" />}
          colorScheme="emerald"
          onClick={() => onNavigateTab('attendance')}
        />
        <StatCard
          title="Active Trainings"
          value={enrolledTrainings.length}
          subtitle="Curricula enrolled"
          icon={<GraduationCap className="w-5 h-5" />}
          colorScheme="indigo"
          onClick={() => onNavigateTab('trainings')}
        />
        <StatCard
          title="Pending Leaves"
          value={pendingLeaves}
          subtitle="Awaiting manager sign-off"
          icon={<CalendarDays className="w-5 h-5" />}
          colorScheme="amber"
          onClick={() => onNavigateTab('leaves')}
        />
        <StatCard
          title="Performance Rating"
          value="4.8 ★"
          subtitle="Q3 Appraisal Score"
          icon={<Award className="w-5 h-5" />}
          colorScheme="purple"
          onClick={() => onNavigateTab('performance')}
        />
      </div>

      {/* Two Column Grid: Active Training & Recent Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Learning Track */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Learning in Progress</h3>
                  <p className="text-xs text-slate-500">Pick up where you left off</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('trainings')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View all courses <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeTraining ? (
              <div className="mt-5 space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                    {activeTraining.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1.5">{activeTraining.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{activeTraining.description}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-600">Course Progress</span>
                    <span className="text-indigo-600">
                      {Math.round(
                        (activeTraining.modules.filter((m) => m.completed).length /
                          activeTraining.modules.length) *
                          100
                      )}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{
                        width: `${Math.round(
                          (activeTraining.modules.filter((m) => m.completed).length /
                            activeTraining.modules.length) *
                            100
                        )}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                No active courses right now
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('trainings')}
            className="mt-6 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition flex items-center justify-center gap-1.5"
          >
            Continue Learning Module <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Company Announcements Bulletin */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Company Bulletins</h3>
                  <p className="text-xs text-slate-500">Corporate announcements & updates</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('announcements')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  onClick={() => onNavigateTab('announcements')}
                  className="p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        ann.priority === 'urgent'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : ann.priority === 'high'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ann.priority}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{ann.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{ann.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('announcements')}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition"
          >
            Read All Announcements
          </button>
        </div>
      </div>
    </div>
  );
};
