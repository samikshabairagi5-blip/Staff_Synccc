import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import { LeaveRequest } from '../../types/hrm';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  AlertCircle,
  MessageSquare,
  X
} from 'lucide-react';

export const TeamLeaveReview: React.FC = () => {
  const { user } = useAuth();
  const { leaves, reviewLeave } = useHRM();

  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed'>('pending');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [decisionType, setDecisionType] = useState<'approved' | 'rejected'>('approved');
  const [comment, setComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingLeaves = leaves.filter((l) => l.status === 'pending');
  const reviewedLeaves = leaves.filter((l) => l.status !== 'pending');

  const openDecisionModal = (leave: LeaveRequest, type: 'approved' | 'rejected') => {
    setSelectedLeave(leave);
    setDecisionType(type);
    setComment(type === 'approved' ? 'Approved. Please make sure all handovers are up to date.' : 'Declined due to team sprint coverage.');
    setIsModalOpen(true);
  };

  const handleConfirmDecision = () => {
    if (!selectedLeave) return;
    reviewLeave(selectedLeave.id, decisionType, comment);
    setIsModalOpen(false);
    setSelectedLeave(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Team Leave Requests & Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review time-off applications submitted by direct reports, verify handover plans, and authorize absences.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pending Review</span>
            {pendingLeaves.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingLeaves.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('reviewed')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'reviewed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Decision Archive ({reviewedLeaves.length})
          </button>
        </div>
      </div>

      {activeTab === 'pending' ? (
        pendingLeaves.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
            <p className="font-bold text-slate-800 text-sm">All caught up!</p>
            <p className="text-xs text-slate-500 mt-1">
              There are currently no pending leave requests awaiting your review.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingLeaves.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.employeeAvatar}
                        alt={req.employeeName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{req.employeeName}</h3>
                        <p className="text-xs text-slate-500">{req.department} • {req.employeeId}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      Pending Action
                    </span>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Leave Type:</span>
                      <span className="font-bold text-slate-900 capitalize">{req.leaveType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Requested Dates:</span>
                      <span className="font-semibold text-slate-800">
                        {req.startDate} to {req.endDate} ({req.daysCount} days)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Submitted On:</span>
                      <span className="text-slate-600 font-mono text-[11px]">{req.appliedAt}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-xs font-semibold text-slate-700 block mb-1">Reason:</span>
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed italic">
                      &ldquo;{req.reason}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                  <button
                    onClick={() => openDecisionModal(req, 'rejected')}
                    className="flex-1 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    Decline Request
                  </button>
                  <button
                    onClick={() => openDecisionModal(req, 'approved')}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Leave
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Reviewed Leaves History Table */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Employee</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Dates</th>
                  <th className="px-5 py-3">Days</th>
                  <th className="px-5 py-3">Decision</th>
                  <th className="px-5 py-3">Review Notes</th>
                  <th className="px-5 py-3">Reviewed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {reviewedLeaves.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={req.employeeAvatar}
                          alt={req.employeeName}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{req.employeeName}</p>
                          <p className="text-[10px] text-slate-400">{req.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 capitalize font-medium">{req.leaveType}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {req.startDate} <span className="text-slate-400">to</span> {req.endDate}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{req.daysCount}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                          req.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {req.status === 'approved' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        {req.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate italic">
                      &ldquo;{req.managerComment || '—'}&rdquo;
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                      {req.reviewedAt || 'Earlier'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Decision Review Modal */}
      {isModalOpen && selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div
              className={`p-5 text-white flex items-center justify-between ${
                decisionType === 'approved' ? 'bg-emerald-600' : 'bg-rose-600'
              }`}
            >
              <div className="flex items-center gap-2">
                {decisionType === 'approved' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <h3 className="font-bold text-sm">
                  {decisionType === 'approved' ? 'Confirm Leave Approval' : 'Decline Leave Request'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">{selectedLeave.employeeName}</p>
                <p className="text-slate-600 mt-0.5">
                  Requesting {selectedLeave.daysCount} days of {selectedLeave.leaveType} leave ({selectedLeave.startDate} to {selectedLeave.endDate})
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Manager Review Note / Instructions:
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add guidance, handover requirements, or reason for decline..."
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
                  onClick={handleConfirmDecision}
                  className={`px-5 py-2.5 rounded-xl text-white font-semibold shadow-sm transition ${
                    decisionType === 'approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {decisionType === 'approved' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
