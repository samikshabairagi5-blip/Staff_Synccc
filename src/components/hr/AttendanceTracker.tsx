import React, { useState } from 'react';
import { useHRM } from '../../context/HRMContext';
import { Clock, Filter, Download, Building, Home, CheckCircle2, AlertCircle } from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const { attendance, employees } = useHRM();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [statusFilter, setStatusFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');

  const filteredAttendance = attendance.filter((rec) => {
    const matchesDate = !selectedDate || rec.date === selectedDate;
    const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
    const matchesDept = deptFilter === 'all' || rec.department === deptFilter;
    return matchesDate && matchesStatus && matchesDept;
  });

  const presentCount = filteredAttendance.filter((r) => r.status === 'present' || r.status === 'late').length;
  const lateCount = filteredAttendance.filter((r) => r.status === 'late').length;
  const onLeaveCount = filteredAttendance.filter((r) => r.status === 'on_leave').length;

  const handleExportCSV = () => {
    const headers = ['Record ID,Employee Name,EMP ID,Department,Date,Clock In,Clock Out,Hours,Mode,Status,Notes'];
    const rows = filteredAttendance.map(
      (r) =>
        `"${r.id}","${r.employeeName}","${r.employeeId}","${r.department}","${r.date}","${r.clockIn}","${r.clockOut || ''}","${r.totalHours || ''}","${r.workMode}","${r.status}","${r.notes || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NexusHR_Attendance_Report_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Organization-Wide Attendance Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time corporate attendance rosters, shift compliance, punch logs, and payroll time export.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          Export Timesheet CSV
        </button>
      </div>

      {/* Filter and Date Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Audit Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="late">Late Punch</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Department:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="People & Culture">People & Culture</option>
              <option value="Product & Design">Product & Design</option>
              <option value="Finance & Operations">Finance & Operations</option>
              <option value="Marketing & Sales">Marketing & Sales</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Employee</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Clock In</th>
                <th className="px-5 py-3">Clock Out</th>
                <th className="px-5 py-3">Hours</th>
                <th className="px-5 py-3">Mode</th>
                <th className="px-5 py-3">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    No attendance records for the selected filters
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900">{rec.employeeName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{rec.employeeId}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{rec.department}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-[11px]">{rec.date}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-800">{rec.clockIn}</td>
                    <td className="px-5 py-3.5 font-mono text-slate-800">{rec.clockOut || '—'}</td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">
                      {rec.totalHours ? `${rec.totalHours} hrs` : (rec.clockIn && !rec.clockOut ? 'Active shift' : '—')}
                    </td>
                    <td className="px-5 py-3.5 capitalize">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px]">
                        {rec.workMode === 'office' ? <Building className="w-3 h-3 text-indigo-500" /> : <Home className="w-3 h-3 text-emerald-500" />}
                        {rec.workMode}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
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
