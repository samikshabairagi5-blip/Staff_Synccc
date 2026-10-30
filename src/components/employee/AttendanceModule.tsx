import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import { WorkMode, AttendanceStatus } from '../../types/hrm';
import {
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Home,
  Building,
  Laptop,
  Timer,
  FileText,
  Filter
} from 'lucide-react';

export const AttendanceModule: React.FC = () => {
  const { user } = useAuth();
  const { attendance, clockIn, clockOut, getTodayRecord } = useHRM();

  const [workMode, setWorkMode] = useState<WorkMode>('office');
  const [notes, setNotes] = useState('');
  const [locationName, setLocationName] = useState('SF HQ - Engineering Floor 4');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const todayRecord = getTodayRecord(user?.employeeId);

  // Sync elapsed time if clocked in and not clocked out
  useEffect(() => {
    if (!todayRecord || todayRecord.clockOut) {
      setElapsedSeconds(0);
      return;
    }

    const calcElapsed = () => {
      const now = new Date();
      const [h, m, s] = todayRecord.clockIn.split(':').map(Number);
      const clockedInTime = new Date();
      clockedInTime.setHours(h, m, s || 0);

      const diffSec = Math.max(0, Math.floor((now.getTime() - clockedInTime.getTime()) / 1000));
      setElapsedSeconds(diffSec);
    };

    calcElapsed();
    const interval = setInterval(calcElapsed, 1000);
    return () => clearInterval(interval);
  }, [todayRecord]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClockIn = () => {
    clockIn(workMode, notes, locationName);
    setNotes('');
  };

  const userAttendanceRecords = attendance.filter(
    (a) => a.employeeId === user?.employeeId
  );

  const filteredRecords = userAttendanceRecords.filter((rec) => {
    if (filterStatus === 'all') return true;
    return rec.status === filterStatus;
  });

  // Calculate monthly stats
  const presentDays = userAttendanceRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
  const lateDays = userAttendanceRecords.filter((r) => r.status === 'late').length;
  const avgHours = userAttendanceRecords.reduce((acc, curr) => acc + (curr.totalHours || 8), 0) / (userAttendanceRecords.length || 1);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Attendance & Timesheet Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track daily work hours, check-ins, geo-location modes, and historical punch logs.
          </p>
        </div>
      </div>

      {/* Clock In / Out Main Interactive Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-white to-slate-50/50 rounded-2xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Today&apos;s Attendance Punch</h3>
                <p className="text-xs text-slate-500">
                  {new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                todayRecord?.clockIn
                  ? todayRecord.clockOut
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${todayRecord?.clockIn ? (todayRecord.clockOut ? 'bg-amber-500' : 'bg-emerald-500 animate-ping') : 'bg-slate-400'}`} />
              {todayRecord?.clockIn
                ? todayRecord.clockOut
                  ? 'Completed Workday'
                  : 'Currently Active'
                : 'Awaiting Check-in'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Live Timer & Clock actions */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center text-center shadow-inner">
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mb-1">
                  {todayRecord?.clockIn && !todayRecord.clockOut ? 'Active Session Timer' : 'Total Session Duration'}
                </span>
                <span className="text-3xl font-mono font-bold tracking-wider text-indigo-300">
                  {todayRecord?.clockIn && !todayRecord.clockOut
                    ? formatTimer(elapsedSeconds)
                    : todayRecord?.totalHours
                    ? `${todayRecord.totalHours} hrs`
                    : '00:00:00'}
                </span>
                <div className="mt-2 text-xs text-slate-400 flex items-center gap-3">
                  <span>In: <strong>{todayRecord?.clockIn || '--:--'}</strong></span>
                  <span>•</span>
                  <span>Out: <strong>{todayRecord?.clockOut || '--:--'}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              {!todayRecord?.clockIn ? (
                <button
                  onClick={handleClockIn}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Clock In Now
                </button>
              ) : !todayRecord.clockOut ? (
                <button
                  onClick={clockOut}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-sm shadow-md shadow-amber-600/25 transition flex items-center justify-center gap-2"
                >
                  <Timer className="w-5 h-5" />
                  Clock Out (End Workday)
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-center font-medium">
                  ✓ You have completed your shift for today. Great work!
                </div>
              )}
            </div>

            {/* Mode & Details Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Working Location / Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setWorkMode('office');
                      setLocationName('SF HQ - Engineering Floor 4');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition ${
                      workMode === 'office'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    <span>Office</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWorkMode('remote');
                      setLocationName('Home Office - San Francisco');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition ${
                      workMode === 'remote'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Remote</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setWorkMode('hybrid');
                      setLocationName('Client Site / Flex Hub');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition ${
                      workMode === 'hybrid'
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Laptop className="w-4 h-4" />
                    <span>Hybrid</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location Details
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Location description"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Daily Standup / Tasks Note (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Working on sprint 24 API refactor & design sync"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Attendance Summary Metrics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Monthly Analytics</h3>
            <p className="text-xs text-slate-500 mb-4">Summary of current billing cycle</p>

            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-600 font-medium">Days Present</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{presentDays} days</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs text-slate-600 font-medium">Late Check-ins</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{lateDays}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs text-slate-600 font-medium">Avg Daily Shift</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{avgHours.toFixed(1)} hrs</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-xs text-slate-600 font-medium">Punctuality Score</span>
                </div>
                <span className="text-sm font-bold text-emerald-600">
                  {userAttendanceRecords.length > 0
                    ? `${Math.round(((presentDays - lateDays) / presentDays) * 100 || 95)}%`
                    : '100%'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Punctual check-in cutoff is 09:15 AM PST.</span>
          </div>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Attendance History Log</h3>
            <p className="text-xs text-slate-500">Record of all past clock-in/out timestamps and modes</p>
          </div>

          {/* Filter pill */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present Only</option>
              <option value="late">Late Check-ins</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Clock In</th>
                <th className="px-5 py-3">Clock Out</th>
                <th className="px-5 py-3">Hours</th>
                <th className="px-5 py-3">Mode</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{rec.date}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-800">{rec.clockIn}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-800">{rec.clockOut || '--:--:--'}</td>
                    <td className="px-5 py-3.5 font-semibold">
                      {rec.totalHours ? `${rec.totalHours} hrs` : (rec.clockIn && !rec.clockOut ? 'In progress' : '-')}
                    </td>
                    <td className="px-5 py-3.5 capitalize">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {rec.workMode === 'office' ? <Building className="w-3 h-3 text-indigo-500" /> : <Home className="w-3 h-3 text-emerald-500" />}
                        {rec.workMode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                          rec.status === 'present'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rec.status === 'late'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : rec.status === 'on_leave'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {rec.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">
                      {rec.notes || rec.location || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
