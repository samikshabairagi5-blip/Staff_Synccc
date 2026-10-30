import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRM } from '../../context/HRMContext';
import { Employee, PerformanceReview } from '../../types/hrm';
import {
  Award,
  Star,
  CheckCircle,
  Plus,
  Trash2,
  TrendingUp,
  User,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export const PerformanceReviewModule: React.FC = () => {
  const { user } = useAuth();
  const { employees, reviews, submitReview } = useHRM();

  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');

  // Direct reports
  const teamList = employees.filter((e) =>
    user?.role === 'manager'
      ? e.department === 'Engineering' || e.managerId === user.id
      : true
  );

  const [selectedEmpId, setSelectedEmpId] = useState(teamList[0]?.employeeId || '');
  const [rating, setRating] = useState<number>(4.8);
  const [techScore, setTechScore] = useState<number>(5.0);
  const [commScore, setCommScore] = useState<number>(4.5);
  const [punctScore, setPunctScore] = useState<number>(4.7);
  const [probScore, setProbScore] = useState<number>(4.9);
  const [teamScore, setTeamScore] = useState<number>(4.6);
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [managerNotes, setManagerNotes] = useState('');
  const [goals, setGoals] = useState<string[]>([
    'Spearhead the next architecture milestone',
    'Mentor junior developers during PR reviews'
  ]);
  const [newGoal, setNewGoal] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const selectedEmployee = employees.find((e) => e.employeeId === selectedEmpId) || teamList[0];

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (idx: number) => {
    setGoals(goals.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    submitReview({
      employeeId: selectedEmployee.employeeId,
      employeeName: selectedEmployee.name,
      reviewerId: user?.id || 'usr_mgr_01',
      reviewerName: user?.name || 'Marcus Vance',
      reviewPeriod: 'Q4 2026',
      rating,
      categories: {
        technicalSkills: techScore,
        communication: commScore,
        punctuality: punctScore,
        problemSolving: probScore,
        teamwork: teamScore
      },
      strengths: strengths || 'Exemplary architectural intuition and reliable feature delivery.',
      areasForImprovement: improvements || 'Continue expanding leadership and mentorship footprint.',
      managerNotes: managerNotes || 'Highly recommended for next promotion cycle.',
      goalsNextQuarter: goals,
      status: 'submitted'
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setActiveTab('history');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Performance Appraisals & OKR Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Conduct 360 evaluations, calibrate competency scores, and formulate quarterly goals for direct reports.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'create'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Conduct Review
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Review Logs ({reviews.length})
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {submittedSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Appraisal submitted successfully! Roster score updated.</span>
            </div>
          )}

          {/* Select Employee Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm text-xs">
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Select Team Member for Evaluation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {teamList.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmpId(emp.employeeId)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center gap-3 ${
                    selectedEmpId === emp.employeeId
                      ? 'bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-500/10'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{emp.name}</h4>
                    <p className="text-[10px] text-slate-500">{emp.designation}</p>
                    <span className="text-[10px] text-amber-600 font-semibold">
                      Current Score: ★ {emp.performanceScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ratings & Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Overall Appraisal Rating
                </h3>
                <span className="text-xl font-extrabold text-indigo-700">{rating.toFixed(1)} / 5.0</span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Overall Score Slider (1.0 to 5.0)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="pt-2 space-y-3">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Detailed Competency Calibration
                </h4>

                <div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span>Technical Architecture & Code Quality</span>
                    <span className="font-bold text-indigo-600">{techScore.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={techScore}
                    onChange={(e) => setTechScore(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span>Communication & Cross-Functional Alignment</span>
                    <span className="font-bold text-indigo-600">{commScore.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={commScore}
                    onChange={(e) => setCommScore(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span>Punctuality & Deadline Adherence</span>
                    <span className="font-bold text-indigo-600">{punctScore.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={punctScore}
                    onChange={(e) => setPunctScore(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span>Complex Problem Solving</span>
                    <span className="font-bold text-indigo-600">{probScore.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={probScore}
                    onChange={(e) => setProbScore(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-medium">
                    <span>Team Collaboration & Mentorship</span>
                    <span className="font-bold text-indigo-600">{teamScore.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={teamScore}
                    onChange={(e) => setTeamScore(parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Qualitative Notes */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                Qualitative Feedback & Promotion Notes
              </h3>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Key Strengths & High-Impact Contributions
                </label>
                <textarea
                  rows={2}
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="e.g., Outstanding delivery on cloud migration and automated testing..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Opportunities for Development & Focus Areas
                </label>
                <textarea
                  rows={2}
                  value={improvements}
                  onChange={(e) => setImprovements(e.target.value)}
                  placeholder="e.g., Increase delegation to junior team members..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Manager Notes & Career Ladder Recommendation
                </label>
                <textarea
                  rows={2}
                  value={managerNotes}
                  onChange={(e) => setManagerNotes(e.target.value)}
                  placeholder="e.g., Recommended for Senior/Staff promotion review..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Goals */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-slate-700 font-semibold mb-2">
                  Quarterly Strategic OKR Goals:
                </label>
                <div className="space-y-1.5 mb-2">
                  {goals.map((g, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <span className="text-slate-800 text-[11px]">{g}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(idx)}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Add an OKR milestone"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddGoal}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              Finalize & Submit Performance Appraisal
            </button>
          </div>
        </form>
      ) : (
        /* History list */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm">Historical Reviews Log</h3>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 hover:bg-slate-50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{rev.employeeName}</h4>
                    <p className="text-slate-500 text-xs">
                      Reviewed by <strong>{rev.reviewerName}</strong> • {rev.reviewPeriod} on {rev.date}
                    </p>
                  </div>
                  <span className="text-sm font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full self-start">
                    ★ {rev.rating} / 5.0
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <p className="text-slate-600">
                    <strong className="text-slate-800">Strengths:</strong> {rev.strengths}
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-slate-800">Notes:</strong> {rev.managerNotes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
