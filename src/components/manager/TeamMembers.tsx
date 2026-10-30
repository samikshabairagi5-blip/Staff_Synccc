import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import { Employee } from '../../types/hrm';
import {
  Users,
  Search,
  Mail,
  Phone,
  Award,
  Sparkles,
  Calendar,
  Building,
  Shield,
  ArrowRight
} from 'lucide-react';

interface TeamMembersProps {
  onReviewEmployee?: (employee: Employee) => void;
}

export const TeamMembers: React.FC<TeamMembersProps> = ({ onReviewEmployee }) => {
  const { user } = useAuth();
  const { employees } = useHRM();

  const [searchTerm, setSearchTerm] = useState('');

  // Engineering manager's reports (or department reports)
  const teamList = employees.filter((e) =>
    user?.role === 'manager'
      ? e.department === 'Engineering' || e.managerId === user.id || e.managerName.includes('Marcus')
      : true
  );

  const filteredTeam = teamList.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Direct Reports & Team Roster
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise team competencies, job responsibilities, contact details, and performance evaluations.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, role, or skill..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeam.map((emp) => (
          <div
            key={emp.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{emp.name}</h3>
                    <p className="text-xs text-indigo-600 font-medium">{emp.designation}</p>
                    <span className="text-[10px] text-slate-400 font-mono">{emp.employeeId}</span>
                  </div>
                </div>

                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  ★ {emp.performanceScore}
                </span>
              </div>

              <div className="mt-3.5 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{emp.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Joined: {emp.dateOfJoining}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Key Competencies
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {emp.skills.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                    >
                      {s}
                    </span>
                  ))}
                  {emp.skills.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[10px]">
                      +{emp.skills.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Leave Bal: <strong>{emp.leaveBalance.annual}d</strong> left
              </span>

              {onReviewEmployee && (
                <button
                  onClick={() => onReviewEmployee(emp)}
                  className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <Award className="w-3.5 h-3.5" />
                  Review KPI
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
