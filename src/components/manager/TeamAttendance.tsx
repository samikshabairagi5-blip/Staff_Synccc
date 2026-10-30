import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import { Clock, Building, Home, CheckCircle2, AlertCircle, Filter, Download } from 'lucide-react';

export const TeamAttendance: React.FC = () => {
  const { user } = useAuth();
  const { attendance, employees } = useHRM();

  const [filterMode, setFilterMode] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Filter records for today or selected date
  const records = attendance.filter((a) => a.date === selectedDate);

  const filteredRecords = records.filter((r) => {
    if (filterMode === 'all') return true;
    return r.workMode === filterMode;
  });

  const presentCount = records.filter((r) => r.status === 'present' || r.status === 'late').length;
  const lateCount = records.filter((r) => r.status === 'late').length;
  const onLeaveCount = records.filter((r) => r.status === 'on_leave').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Team Timesheets & Daily Presence
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time monitoring of team check-ins, office vs remote work distribution, and clock-out stamps.
          </p>
        </div>

        {/* Date picker */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Present Today</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-emerald-600">{presentCount}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Late Check-ins</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-amber-600">{lateCount}</span>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">On Approved Leave</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-blue-600">{onLeaveCount}</span>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Punctuality Rate</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-indigo-600">
              {presentCount > 0 ? `${Math.round(((presentCount - lateCount) / presentCount) * 100)}%` : '100%'}
            </span>
            <span className="text-xs text-slate-400 font-mono">Org Standard</span>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Timesheet Roster ({selectedDate})</h3>
            <p className="text-xs text-slate-500">Live check-in feed and work location</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Locations</option>
              <option value="office">Office Presence</option>
              <option value="remote">Remote Work</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Clock In</th>
                <th className="px-5 py-3">Clock Out</th>
                <th className="px-5 py-3">Total Shift</th>
                <th className="px-5 py-3">Work Mode</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Notes & Station</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No attendance records for {selectedDate}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900">{rec.employeeName}</p>
                      <p className="text-[10px] text-slate-400">{rec.department} • {rec.employeeId}</p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-800">{rec.clockIn}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-800">{rec.clockOut || '—'}</td>
                    <td className="px-5 py-3.5 font-semibold">
                      {rec.totalHours ? `${rec.totalHours} hrs` : (rec.clockIn ? 'Active now' : '—')}
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
                      {rec.notes || rec.location || 'Standard desk'}
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
