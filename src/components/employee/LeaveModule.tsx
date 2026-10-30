import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import { LeaveType } from '../../types/hrm';
import {
  CalendarDays,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Info,
  Calendar,
  X,
  FileText
} from 'lucide-react';

export const LeaveModule: React.FC = () => {
  const { user } = useAuth();
  const { leaves, applyLeave, employees } = useHRM();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Form states
  const [leaveType, setLeaveType] = useState<LeaveType>('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');

  // Find user's employee record to get current balance
  const employeeRecord = employees.find((e) => e.employeeId === user?.employeeId);
  const balances = employeeRecord?.leaveBalance || { annual: 14, sick: 8, casual: 4, maternity: 60 };

  // Calculate day difference
  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = d2.getTime() - d1.getTime();
    if (diffTime < 0) return 0;
    return Math.round(diffTime / (1000 * 3600 * 24)) + 1;
  };

  const daysRequested = calculateDays(startDate, endDate);

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!startDate || !endDate) {
      setFormError('Please select both start and end dates.');
      return;
    }

    if (daysRequested <= 0) {
      setFormError('End date must be on or after start date.');
      return;
    }

    if (!reason.trim()) {
      setFormError('Please provide a reason or handover note for your leave request.');
      return;
    }

    // Check available balance
    if (leaveType !== 'unpaid') {
      const available = balances[leaveType] || 0;
      if (daysRequested > available) {
        setFormError(`Insufficient leave balance. You requested ${daysRequested} days, but only ${available} days remain.`);
        return;
      }
    }

    applyLeave({
      employeeId: user?.employeeId || 'EMP-UNKNOWN',
      employeeName: user?.name || 'Employee',
      employeeAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      department: user?.department || 'Engineering',
      managerId: employeeRecord?.managerId || 'usr_mgr_01',
      leaveType,
      startDate,
      endDate,
      daysCount: daysRequested,
      reason
    });

    setIsModalOpen(false);
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  const userLeaves = leaves.filter((l) => l.employeeId === user?.employeeId);

  const filteredLeaves = userLeaves.filter((l) => {
    if (filterTab === 'all') return true;
    return l.status === filterTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Leave Management & Balances
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit paid and medical time-off requests, monitor approval status, and review entitlements.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Apply for Leave
        </button>
      </div>

      {/* Leave Balances Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="w-1.5 h-full bg-emerald-500 absolute left-0 top-0" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Annual Vacation</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{balances.annual}</span>
            <span className="text-xs text-slate-400 font-medium">/ 20 days</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (balances.annual / 20) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="w-1.5 h-full bg-blue-500 absolute left-0 top-0" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Medical / Sick</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{balances.sick}</span>
            <span className="text-xs text-slate-400 font-medium">/ 12 days</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (balances.sick / 12) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="w-1.5 h-full bg-amber-500 absolute left-0 top-0" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Casual / Personal</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{balances.casual}</span>
            <span className="text-xs text-slate-400 font-medium">/ 6 days</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-amber-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (balances.casual / 6) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="w-1.5 h-full bg-purple-500 absolute left-0 top-0" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Parental Leave</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{balances.maternity}</span>
            <span className="text-xs text-slate-400 font-medium">/ 60 days</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5">
            <div
              className="bg-purple-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (balances.maternity / 60) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Requests History List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Table Filter Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">My Leave History</h3>
            <p className="text-xs text-slate-500">Track current pending approvals and historical decisions</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterTab(t)}
                className={`px-3 py-1.5 rounded-lg capitalize transition ${
                  filterTab === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Leave Type</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Days</th>
                <th className="px-5 py-3">Reason</th>
                <th className="px-5 py-3">Applied On</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Review Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    No leave requests found in this category
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-3.5 font-semibold text-slate-900 capitalize">
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            req.leaveType === 'annual'
                              ? 'bg-emerald-500'
                              : req.leaveType === 'sick'
                              ? 'bg-blue-500'
                              : req.leaveType === 'casual'
                              ? 'bg-amber-500'
                              : 'bg-purple-500'
                          }`}
                        />
                        {req.leaveType} Leave
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {req.startDate} <span className="text-slate-400">to</span> {req.endDate}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {req.daysCount} {req.daysCount === 1 ? 'day' : 'days'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono text-[11px]">{req.appliedAt}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${
                          req.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : req.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {req.status === 'approved' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                        {req.status === 'rejected' && <XCircle className="w-3 h-3 text-rose-600" />}
                        {req.status === 'pending' && <Clock className="w-3 h-3 text-amber-600" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                      {req.managerComment ? (
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <p className="font-medium text-slate-700 italic">&ldquo;{req.managerComment}&rdquo;</p>
                          <span className="text-[10px] text-slate-400 block mt-0.5">By {req.reviewedBy}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Pending supervisor review</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm tracking-tight">Apply for Time Off</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitLeave} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Leave Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['annual', 'sick', 'casual', 'maternity'] as LeaveType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setLeaveType(type)}
                      className={`p-2.5 rounded-xl border text-center transition capitalize font-medium ${
                        leaveType === type
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                      <span className="block text-[10px] text-slate-400 font-normal mt-0.5">
                        {balances[type] || 0} days left
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {daysRequested > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Total Duration Requested:</span>
                  <span className="font-bold text-indigo-700 text-sm">{daysRequested} Days</span>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Reason & Handover Notes
                </label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Detail the purpose of leave and link handover documents or designated cover contact..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-600/20 transition"
                >
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
