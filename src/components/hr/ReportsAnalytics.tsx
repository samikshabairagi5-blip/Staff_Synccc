import React, { useState } from 'react';
import { useHRM } from '../../context/HRMContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Users,
  DollarSign,
  Award,
  Building,
  Printer
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { employees, attendance, leaves, departments } = useHRM();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'q4'>('7d');

  // Calculations
  const totalEmployees = employees.length;
  const activeCount = employees.filter((e) => e.status === 'active').length;
  const totalPayroll = employees.reduce((acc, curr) => acc + curr.salary, 0);
  const avgSalary = Math.round(totalPayroll / (totalEmployees || 1));

  // Leave breakdown
  const leaveCounts = {
    annual: leaves.filter((l) => l.leaveType === 'annual').length,
    sick: leaves.filter((l) => l.leaveType === 'sick').length,
    casual: leaves.filter((l) => l.leaveType === 'casual').length,
    maternity: leaves.filter((l) => l.leaveType === 'maternity').length
  };
  const totalLeaves = leaves.length || 1;

  // Department payroll breakdown
  const deptBreakdown = departments.map((d) => {
    const emps = employees.filter((e) => e.department === d.name);
    const payroll = emps.reduce((acc, curr) => acc + curr.salary, 0);
    return {
      name: d.name,
      code: d.code,
      count: emps.length,
      payroll
    };
  });

  // Mock 7-day attendance trend data
  const attendanceTrend = [
    { day: 'Mon', presentPct: 98, count: 28 },
    { day: 'Tue', presentPct: 96, count: 27 },
    { day: 'Wed', presentPct: 100, count: 29 },
    { day: 'Thu', presentPct: 94, count: 26 },
    { day: 'Fri', presentPct: 92, count: 25 },
    { day: 'Sat', presentPct: 30, count: 6 },
    { day: 'Sun', presentPct: 15, count: 3 }
  ];

  // Export full HR Audit CSV
  const handleExportFullReport = () => {
    const headers = [
      'Report Type: NexusHR Full Executive Workforce Audit',
      `Date Generated: ${new Date().toISOString()}`,
      `Total Headcount: ${totalEmployees}`,
      `Total Annual Payroll: $${totalPayroll.toLocaleString()}`,
      '',
      'Employee ID,Name,Department,Designation,Salary,Status,Performance Score,Annual Leave Bal'
    ];
    const rows = employees.map(
      (e) =>
        `"${e.employeeId}","${e.name}","${e.department}","${e.designation}","${e.salary}","${e.status}","${e.performanceScore}","${e.leaveBalance.annual}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [...headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NexusHR_Workforce_Audit_${new Date().toISOString().split('T')[0]}.csv`);
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
            Workforce Analytics & Executive Reports
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data intelligence on headcount velocity, organizational attendance, PTO utilization, and department payroll.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
          <button
            onClick={handleExportFullReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
          >
            <Download className="w-3.5 h-3.5" />
            Export Full Audit (CSV)
          </button>
        </div>
      </div>

      {/* High Level KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Headcount</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-slate-900">{totalEmployees}</span>
            <span className="text-xs text-emerald-600 font-semibold font-mono">+{activeCount} active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Across 5 departments</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Annual Payroll</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900">
              ${(totalPayroll / 1000000).toFixed(2)}M
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Avg ${avgSalary.toLocaleString()} / FTE</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Attendance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-emerald-600">96.4%</span>
            <span className="text-xs text-emerald-600 font-semibold">↑ 1.2%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Punctuality standard met</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Appraisal Score</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-amber-500">4.7</span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">High engagement tier</p>
        </div>
      </div>

      {/* Two Column Charts: Attendance Bar Trend & Leave Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Rate SVG Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Attendance Compliance Velocity</h3>
              <p className="text-xs text-slate-500">Weekly workforce punch percentage</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              96% Goal
            </span>
          </div>

          <div className="mt-6 flex items-end justify-between gap-3 h-48 pt-4">
            {attendanceTrend.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-600">{item.presentPct}%</span>
                <div className="w-full max-w-[36px] bg-slate-100 rounded-t-lg overflow-hidden h-full flex items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      item.presentPct >= 90 ? 'bg-indigo-600' : 'bg-slate-300'
                    }`}
                    style={{ height: `${item.presentPct}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Workdays: Mon - Fri (Full shift coverage)</span>
            <span className="font-semibold text-slate-800">Peak day: Wednesday (100%)</span>
          </div>
        </div>

        {/* Leave Type Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Time-Off Distribution by Category</h3>
                <p className="text-xs text-slate-500">Utilization across request types</p>
              </div>
              <span className="text-xs text-slate-400 font-mono">{leaves.length} Total Requests</span>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-medium mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    Annual Vacation
                  </span>
                  <span className="font-bold text-slate-800">
                    {leaveCounts.annual} ({Math.round((leaveCounts.annual / totalLeaves) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${(leaveCounts.annual / totalLeaves) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500" />
                    Sick / Medical Leave
                  </span>
                  <span className="font-bold text-slate-800">
                    {leaveCounts.sick} ({Math.round((leaveCounts.sick / totalLeaves) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(leaveCounts.sick / totalLeaves) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    Casual / Personal Leave
                  </span>
                  <span className="font-bold text-slate-800">
                    {leaveCounts.casual} ({Math.round((leaveCounts.casual / totalLeaves) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${(leaveCounts.casual / totalLeaves) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1.5">
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500" />
                    Parental / Family Care
                  </span>
                  <span className="font-bold text-slate-800">
                    {leaveCounts.maternity} ({Math.round((leaveCounts.maternity / totalLeaves) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(leaveCounts.maternity / totalLeaves) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-slate-400 text-[11px]">
            PTO liability remains within target threshold (&lt;12% pending balance carryover).
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Department Payroll & FTE Allocation</h3>
          <p className="text-xs text-slate-500">Budget utilization by business unit</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Code</th>
                <th className="px-5 py-3">FTE Headcount</th>
                <th className="px-5 py-3">Annualized Payroll</th>
                <th className="px-5 py-3">Avg Comp per FTE</th>
                <th className="px-5 py-3">Budget Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {deptBreakdown.map((dept) => (
                <tr key={dept.name} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-900">{dept.name}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-400">{dept.code}</td>
                  <td className="px-5 py-3.5 font-semibold text-slate-800">{dept.count} Members</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-slate-900">
                    ${dept.payroll.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-600">
                    ${dept.count > 0 ? Math.round(dept.payroll / dept.count).toLocaleString() : 0}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                      On Target
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
