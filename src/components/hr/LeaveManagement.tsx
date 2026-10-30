import React, { useState } from 'react';
import { useHRM } from '../../context/HRMContext';
import { LeaveRequest } from '../../types/hrm';
import { CalendarDays, CheckCircle2, XCircle, Clock, Filter, Search } from 'lucide-react';

export const LeaveManagement: React.FC = () => {
  const { leaves, reviewLeave } = useHRM();

  const [tab, setTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const filteredLeaves = leaves.filter((l) => {
    const matchesTab = tab === 'all' || l.status === tab;
    const matchesSearch =
      l.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'all' || l.department === deptFilter;
    return matchesTab && matchesSearch && matchesDept;
  });

  const pendingCount = leaves.filter((l) => l.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Organization-Wide Leave Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise PTO balances, review pending departmental requests, and audit leave patterns.
          </p>
        </div>

        {/* Tab pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg capitalize transition flex items-center gap-1.5 ${
                tab === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{t}</span>
              {t === 'pending' && pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applicant name or EMP ID..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Department:</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-none"
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

      {/* Leaves Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Applicant</th>
                <th className="px-5 py-3">Department</th>
                <th className="px-5 py-3">Leave Type</th>
                <th className="px-5 py-3">Schedule</th>
                <th className="px-5 py-3">Days</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">HR Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-400">
                    No leave requests found
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={req.employeeAvatar}
                          alt={req.employeeName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{req.employeeName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{req.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium">{req.department}</td>
                    <td className="px-5 py-3.5 capitalize font-semibold text-slate-800">{req.leaveType}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono text-[11px]">
                      {req.startDate} → {req.endDate}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{req.daysCount} d</td>
                    <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          req.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : req.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {req.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {req.status === 'rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                        {req.status === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => reviewLeave(req.id, 'approved', 'Approved by HR Directorate.')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => reviewLeave(req.id, 'rejected', 'Declined by HR Directorate.')}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-semibold transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-mono">
                          {req.reviewedBy || 'Decided'}
                        </span>
                      )}
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
